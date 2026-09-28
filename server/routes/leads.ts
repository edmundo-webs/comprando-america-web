/**
 * POST /api/leads — la única entrada de leads del sitio.
 *
 * Los formularios mandan aquí (mismo dominio, sin tokens en el navegador) y el
 * servidor lo reenvía al CMS con `CMS_API_KEY` (server/_core/cmsLead.ts).
 * Nada se guarda en la base de este sitio (CLAUDE.md §1).
 *
 * Aquí también se vuelve a revisar el teléfono (CLAUDE.md §5): si no llega en
 * E.164 válido, NO se completa ni se rechaza —se manda como llegó— y se anota
 * "código de país pendiente" en los datos del formulario, que el CMS guarda
 * como nota visible del contacto.
 */
import { Router } from "express";
import { esE164Valido } from "../../shared/telefono";
import { enviarAlCms } from "../_core/cmsLead";

export const leadsRouter = Router();

export const ETIQUETA_PAIS_PENDIENTE = "Código de país del teléfono";

type Campo = { label: string; value: string };

const ETIQUETAS_TELEFONO = new Set(["whatsapp", "numero de whatsapp", "telefono", "numero de telefono", "celular", "phone"]);

function normalizarEtiqueta(label: string): string {
  return label
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[/_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function texto(v: unknown, max: number): string | undefined {
  if (typeof v !== "string" && typeof v !== "number") return undefined;
  const t = String(v).trim();
  return t ? t.slice(0, max) : undefined;
}

function urlValida(v: unknown): string | undefined {
  const t = texto(v, 500);
  if (!t) return undefined;
  try {
    const u = new URL(t);
    return u.protocol === "https:" || u.protocol === "http:" ? t : undefined;
  } catch {
    return undefined;
  }
}

export type LeadPreparado = { ok: true; cuerpo: Record<string, unknown> } | { ok: false; error: string };

/**
 * Convierte lo que manda el navegador en el cuerpo que acepta
 * `/api/public/leads` del CMS. Solo pasan los campos que esa API conoce.
 */
export function prepararLead(entrada: Record<string, any>): LeadPreparado {
  const cuerpo: Record<string, unknown> = {};

  const name = texto(entrada.name, 200);
  const email = texto(entrada.email, 320)?.toLowerCase();
  const phone = texto(entrada.phone, 30);
  if (name) cuerpo.name = name;
  if (email) cuerpo.email = email;
  if (phone) cuerpo.phone = phone;

  for (const k of ["sourceSlug", "formSlug"] as const) {
    const v = texto(entrada[k], 100);
    if (v) cuerpo[k] = v;
  }
  for (const k of ["quizSessionId", "submissionId"] as const) {
    const v = texto(entrada[k], 200);
    if (v) cuerpo[k] = v;
  }
  const sourceUrl = urlValida(entrada.sourceUrl);
  if (sourceUrl) cuerpo.sourceUrl = sourceUrl;
  if (entrada.stage === "partial" || entrada.stage === "complete") cuerpo.stage = entrada.stage;
  if (entrada.gpsFicha && typeof entrada.gpsFicha === "object") cuerpo.gpsFicha = entrada.gpsFicha;
  const introText = texto(entrada.introText, 2000);
  if (introText) cuerpo.introText = introText;

  const campos: Campo[] = [];
  if (Array.isArray(entrada.formFields)) {
    for (const f of entrada.formFields.slice(0, 90)) {
      const label = texto(f?.label, 200);
      const value = texto(f?.value, 2000);
      if (label && value) campos.push({ label, value });
    }
  }

  // Teléfonos que no llegan en E.164: se mandan como llegaron y se marcan.
  const sinCodigo: string[] = [];
  if (phone && !esE164Valido(phone)) sinCodigo.push(phone);
  for (const c of campos) {
    if (ETIQUETAS_TELEFONO.has(normalizarEtiqueta(c.label)) && !esE164Valido(c.value) && !sinCodigo.includes(c.value)) {
      sinCodigo.push(c.value);
    }
  }
  if (sinCodigo.length > 0) {
    campos.push({ label: ETIQUETA_PAIS_PENDIENTE, value: `pendiente (llegó como: ${sinCodigo.join(", ")})` });
  }

  // UTM (CLAUDE.md §2): la API de formularios no tiene campo propio para ellos,
  // así que van como datos del formulario, sin repetir los que ya vengan.
  const utm = entrada.utm && typeof entrada.utm === "object" ? entrada.utm : {};
  const etiquetas = new Set(campos.map((c) => normalizarEtiqueta(c.label)));
  for (const k of ["utm_source", "utm_medium", "utm_campaign", "utm_content"]) {
    const v = texto(utm[k], 255);
    if (v && !etiquetas.has(normalizarEtiqueta(k))) campos.push({ label: k, value: v });
  }

  if (campos.length > 0) cuerpo.formFields = campos;

  const tieneNombre = !!name || campos.some((c) => normalizarEtiqueta(c.label) === "nombre");
  if (!tieneNombre) return { ok: false, error: "Falta el nombre" };
  if (!email && !phone && !campos.some((c) => ETIQUETAS_TELEFONO.has(normalizarEtiqueta(c.label)))) {
    return { ok: false, error: "Falta un email o un teléfono" };
  }
  return { ok: true, cuerpo };
}

// ── Límite simple por IP, para que un bot no convierta esto en un chorro de
// peticiones al CMS. Los cuestionarios mandan varias actualizaciones por
// visitante, así que el margen es amplio.
const VENTANA_MS = 60_000;
const MAXIMO_POR_VENTANA = 30;
const ventanas = new Map<string, { inicio: number; cuenta: number }>();

function ipDe(req: any): string {
  const xff = req.headers?.["x-forwarded-for"];
  const primera = typeof xff === "string" ? xff.split(",")[0].trim() : "";
  return primera || req.ip || "desconocida";
}

export function excedeLimite(ip: string, ahora = Date.now()): boolean {
  const v = ventanas.get(ip);
  if (!v || ahora - v.inicio >= VENTANA_MS) {
    ventanas.set(ip, { inicio: ahora, cuenta: 1 });
    if (ventanas.size > 10_000) ventanas.clear();
    return false;
  }
  v.cuenta += 1;
  return v.cuenta > MAXIMO_POR_VENTANA;
}

leadsRouter.post("/api/leads", async (req, res) => {
  const entrada = (req.body ?? {}) as Record<string, any>;

  // Campo trampa: una persona nunca lo llena. Se responde igual que un envío
  // bueno para no darle pistas al bot.
  if (texto(entrada.website, 500)) return res.json({ ok: true, entregado: true });

  if (excedeLimite(ipDe(req))) {
    return res.status(429).json({ ok: false, error: "Demasiados envíos seguidos. Intenta en un minuto." });
  }

  const preparado = prepararLead(entrada);
  if (!preparado.ok) return res.status(400).json({ ok: false, error: preparado.error });

  const r = await enviarAlCms("/api/public/leads", preparado.cuerpo);
  // Aunque el CMS no haya respondido, el envío quedó en manos del servidor
  // (reintento en segundo plano o registro): para el visitante, se recibió.
  res.json({ ok: true, entregado: r.entregado });
});
