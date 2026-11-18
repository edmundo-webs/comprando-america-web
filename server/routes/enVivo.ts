import { Router } from "express";
import { z } from "zod";
import { esE164Valido } from "../../shared/telefono";
import { MENSAJE_OCUPADO, ESPERA_OCUPADO_MAX_MS } from "../_core/cmsLead";
import { parse as leerCookies } from "cookie";
import {
  SLUG_SALA,
  entrarConInvitacion,
  esFallaReintentable,
  registrarEnSala,
  reingresarEnSala,
  reintentarRegistroEnSegundoPlano,
} from "../_core/cmsSala";
import { MENSAJE_TURNSTILE, verificarTurnstile } from "../_core/turnstile";
import { ipDelVisitante } from "../_core/visitante";

/**
 * Registro a la sala en vivo (comprandoamerica.com/en-vivo).
 *
 * El navegador manda nombre, correo, WhatsApp (E.164), el aviso de privacidad
 * aceptado, la casilla opcional de información y el token de Turnstile. Aquí
 * se revisa Turnstile y se pasa al CMS con la llave (cmsSala.ts). El CMS crea o
 * reconoce al lead y devuelve la ficha de la sala; con ella el navegador lee el
 * panel, vota y pregunta directo en el CMS.
 */
export const enVivoRouter = Router();

const registroSchema = z.object({
  slug: z.string().regex(SLUG_SALA),
  name: z.string().trim().min(2).max(200),
  email: z.string().trim().toLowerCase().email().max(320),
  whatsapp: z.string().trim().max(30).refine(esE164Valido, "El WhatsApp va con el código de tu país."),
  privacyAccepted: z.literal(true),
  marketingOptIn: z.boolean().default(false),
  turnstileToken: z.string().max(2048).optional(),
  pageUrl: z.string().url().max(500).optional(),
  utm: z.record(z.string(), z.string().max(255)).optional(),
  website: z.string().max(500).optional(),
  /** El `ca_visitor_id` del navegador (también va en su cookie). */
  visitorId: z.string().max(64).optional(),
  /** La sala está en repetición: si el CMS no responde, el video se muestra igual. */
  repeticion: z.boolean().optional(),
});

/** El identificador del visitante (lib/visitor.ts): uuid del navegador, sin datos de la persona. */
const VISITANTE = /^[A-Za-z0-9-]{8,64}$/;

/** El `ca_visitor_id`: el que manda el navegador o, si no, el de su cookie. */
export function visitanteDe(req: { headers?: Record<string, unknown> }, delCuerpo?: string): string | undefined {
  if (delCuerpo && VISITANTE.test(delCuerpo)) return delCuerpo;
  const encabezado = req.headers?.cookie;
  if (typeof encabezado !== "string") return undefined;
  const id = leerCookies(encabezado)["ca_visitor_id"];
  return id && VISITANTE.test(id) ? id : undefined;
}

// Límite por IP: la sala se llena al empezar el evento, pero una persona no
// se registra más de un par de veces.
const VENTANA_MS = 60_000;
const MAXIMO_POR_VENTANA = 10;
const ventanas = new Map<string, { inicio: number; cuenta: number }>();

export function excedeLimiteSala(ip: string, ahora = Date.now()): boolean {
  const v = ventanas.get(ip);
  if (!v || ahora - v.inicio >= VENTANA_MS) {
    ventanas.set(ip, { inicio: ahora, cuenta: 1 });
    if (ventanas.size > 10_000) ventanas.clear();
    return false;
  }
  v.cuenta += 1;
  return v.cuenta > MAXIMO_POR_VENTANA;
}

enVivoRouter.post("/api/en-vivo/registro", async (req, res) => {
  const ip = ipDelVisitante(req);
  if (excedeLimiteSala(ip ?? "desconocida")) {
    return res.status(429).json({ ok: false, error: "Demasiados intentos seguidos. Intenta en un minuto." });
  }
  const parsed = registroSchema.safeParse(req.body ?? {});
  if (!parsed.success) {
    const sinAviso = parsed.error.issues.some((i) => i.path[0] === "privacyAccepted");
    return res.status(400).json({
      ok: false,
      error: sinAviso ? "Para entrar, acepta el aviso de privacidad." : "Revisa tus datos.",
    });
  }
  const entrada = parsed.data;

  // Campo trampa: se rechaza con el mismo mensaje que un dato inválido, sin pistas.
  if (entrada.website?.trim()) return res.status(400).json({ ok: false, error: "Revisa tus datos." });

  const verificacion = await verificarTurnstile(entrada.turnstileToken, ip);
  if (!verificacion.ok) {
    console.warn(`[sala] Turnstile no pasó: ${verificacion.motivo}`);
    return res.status(400).json({ ok: false, error: MENSAJE_TURNSTILE });
  }

  const visitorId = visitanteDe(req, entrada.visitorId);
  const cuerpo = {
    name: entrada.name,
    email: entrada.email,
    whatsapp: entrada.whatsapp,
    privacyAccepted: true,
    marketingOptIn: entrada.marketingOptIn,
    ...(entrada.pageUrl ? { pageUrl: entrada.pageUrl } : {}),
    ...(entrada.utm ? { utm: entrada.utm } : {}),
    ...(ip ? { clientIp: ip } : {}),
    ...(visitorId ? { visitorId } : {}),
  };
  const r = await registrarEnSala(entrada.slug, cuerpo);
  if (r.ok) return res.json({ ok: true, token: r.token, enRevision: r.enRevision });
  // Repetición: si el CMS no responde, la persona ve el video igual y su
  // registro se reintenta aquí en segundo plano (no se pierde el lead).
  if (entrada.repeticion && esFallaReintentable(r)) {
    void reintentarRegistroEnSegundoPlano(entrada.slug, cuerpo);
    return res.status(202).json({ ok: true, provisional: true });
  }
  if (r.ocupado) {
    res.setHeader("Retry-After", String(Math.ceil(ESPERA_OCUPADO_MAX_MS / 1000)));
    return res.status(503).json({ ok: false, ocupado: true, error: MENSAJE_OCUPADO });
  }
  return res.status(r.status >= 500 ? 502 : r.status).json({ ok: false, error: r.error });
});

const invitacionSchema = z.object({
  slug: z.string().regex(SLUG_SALA),
  invitacion: z.string().min(10).max(2048),
  /** En la repetición puede faltar: quien ya lo aceptó en esa sala entra directo (lo decide el CMS). */
  privacyAccepted: z.literal(true).optional(),
  marketingOptIn: z.boolean().default(false),
  visitorId: z.string().max(64).optional(),
  utm: z.record(z.string(), z.string().max(255)).optional(),
});

/**
 * Entrar con la liga personal del correo (/en-vivo/<clave>?i=…): la persona
 * solo acepta el aviso de privacidad (y, si quiere, la casilla de información).
 * El CMS revisa la firma de la liga y la liga a su contacto, sin duplicarlo.
 */
enVivoRouter.post("/api/en-vivo/invitacion", async (req, res) => {
  const ip = ipDelVisitante(req);
  if (excedeLimiteSala(ip ?? "desconocida")) {
    return res.status(429).json({ ok: false, error: "Demasiados intentos seguidos. Intenta en un minuto." });
  }
  const parsed = invitacionSchema.safeParse(req.body ?? {});
  if (!parsed.success) {
    const sinAviso = parsed.error.issues.some((i) => i.path[0] === "privacyAccepted");
    return res.status(400).json({ ok: false, error: sinAviso ? "Para entrar, acepta el aviso de privacidad." : "Tu liga no es válida." });
  }
  const { slug, ...cuerpo } = parsed.data;
  const visitorId = visitanteDe(req, cuerpo.visitorId);
  const r = await entrarConInvitacion(slug, {
    invitacion: cuerpo.invitacion,
    ...(cuerpo.privacyAccepted ? { privacyAccepted: true as const } : {}),
    marketingOptIn: cuerpo.marketingOptIn,
    ...(visitorId ? { visitorId } : {}),
    ...(cuerpo.utm ? { utm: cuerpo.utm } : {}),
  });
  if (r.ok) return res.json({ ok: true, token: r.token, enRevision: r.enRevision });
  if (r.ocupado) {
    res.setHeader("Retry-After", String(Math.ceil(ESPERA_OCUPADO_MAX_MS / 1000)));
    return res.status(503).json({ ok: false, ocupado: true, error: MENSAJE_OCUPADO });
  }
  return res.status(r.status >= 500 ? 502 : r.status).json({ ok: false, error: r.error });
});

const reingresoSchema = z.object({ slug: z.string().regex(SLUG_SALA), visitorId: z.string().max(64).optional() });

/**
 * Repetición: quien ya se registró en esa sala desde este navegador entra
 * directo al video, sin llenar otra vez el formulario. Se reconoce por su
 * `ca_visitor_id` (su cookie o lo que mande el navegador); el CMS lo revisa
 * con la llave del sitio.
 */
enVivoRouter.post("/api/en-vivo/reingreso", async (req, res) => {
  const ip = ipDelVisitante(req);
  if (excedeLimiteSala(ip ?? "desconocida")) {
    return res.status(429).json({ ok: false, error: "Demasiados intentos seguidos. Intenta en un minuto." });
  }
  const parsed = reingresoSchema.safeParse(req.body ?? {});
  if (!parsed.success) return res.status(400).json({ ok: false, error: "Esta sala no existe." });
  const visitorId = visitanteDe(req, parsed.data.visitorId);
  if (!visitorId) return res.status(404).json({ ok: false, error: "Regístrate para ver la grabación." });
  const r = await reingresarEnSala(parsed.data.slug, visitorId);
  if (r.ok) return res.json({ ok: true, token: r.token, enRevision: r.enRevision });
  if (r.ocupado) return res.status(503).json({ ok: false, ocupado: true, error: MENSAJE_OCUPADO });
  return res.status(r.status >= 500 ? 502 : r.status).json({ ok: false, error: r.error });
});
