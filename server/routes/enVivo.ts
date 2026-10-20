import { Router } from "express";
import { z } from "zod";
import { esE164Valido } from "../../shared/telefono";
import { MENSAJE_OCUPADO, ESPERA_OCUPADO_MAX_MS } from "../_core/cmsLead";
import { SLUG_SALA, entrarConInvitacion, registrarEnSala } from "../_core/cmsSala";
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
});

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

  const r = await registrarEnSala(entrada.slug, {
    name: entrada.name,
    email: entrada.email,
    whatsapp: entrada.whatsapp,
    privacyAccepted: true,
    marketingOptIn: entrada.marketingOptIn,
    ...(entrada.pageUrl ? { pageUrl: entrada.pageUrl } : {}),
    ...(entrada.utm ? { utm: entrada.utm } : {}),
    ...(ip ? { clientIp: ip } : {}),
  });
  if (r.ok) return res.json({ ok: true, token: r.token, enRevision: r.enRevision });
  if (r.ocupado) {
    res.setHeader("Retry-After", String(Math.ceil(ESPERA_OCUPADO_MAX_MS / 1000)));
    return res.status(503).json({ ok: false, ocupado: true, error: MENSAJE_OCUPADO });
  }
  return res.status(r.status >= 500 ? 502 : r.status).json({ ok: false, error: r.error });
});

const invitacionSchema = z.object({
  slug: z.string().regex(SLUG_SALA),
  invitacion: z.string().min(10).max(2048),
  privacyAccepted: z.literal(true),
  marketingOptIn: z.boolean().default(false),
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
  const r = await entrarConInvitacion(slug, { invitacion: cuerpo.invitacion, privacyAccepted: true, marketingOptIn: cuerpo.marketingOptIn });
  if (r.ok) return res.json({ ok: true, token: r.token, enRevision: r.enRevision });
  if (r.ocupado) {
    res.setHeader("Retry-After", String(Math.ceil(ESPERA_OCUPADO_MAX_MS / 1000)));
    return res.status(503).json({ ok: false, ocupado: true, error: MENSAJE_OCUPADO });
  }
  return res.status(r.status >= 500 ? 502 : r.status).json({ ok: false, error: r.error });
});
