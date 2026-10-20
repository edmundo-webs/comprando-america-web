/*
 * Sala en vivo (/en-vivo): lo que el navegador habla con el CMS.
 *
 * - El registro va a este sitio (POST /api/en-vivo/registro), que revisa
 *   Turnstile y lo pasa al CMS con la llave. Devuelve la «ficha» de la sala.
 * - Con la ficha, el navegador lee el panel, vota y pregunta directo en el CMS
 *   (/api/public/sala/:slug/...). La ficha no lleva datos de la persona: el
 *   CMS sabe quién es por ella, nunca por lo que mande el navegador.
 * - La ficha se guarda en el navegador (dura 7 días) para no volver a pedir el
 *   registro al recargar.
 */
import { cmsUrl } from "./cmsUrl";

export interface SalaInfo {
  slug: string;
  title: string;
  kicker: string | null;
  open: boolean;
}

export interface VideoSala {
  videoId: string;
  embedUrl: string;
  watchUrl: string;
}

export interface ResultadosEncuesta {
  voters: number;
  options: { label: string; votes: number; percent: number }[];
}

export interface EncuestaSala {
  id: number;
  question: string;
  kind: "opcion_unica" | "opcion_multiple";
  options: string[];
  open: boolean;
  results: ResultadosEncuesta | null;
  myVote: number[] | null;
}

export type PanelSala =
  | { mode: "vacio" }
  | { mode: "preguntas"; questions: { id: number; author: string; text: string; answered: boolean }[] }
  | { mode: "encuesta"; poll: EncuestaSala | null }
  | { mode: "cta"; buttons: { label: string; href: string }[] };

export interface EstadoSala {
  version: number;
  title: string;
  kicker: string | null;
  open: boolean;
  video: VideoSala | null;
  panel: PanelSala;
  /** false: registro en revisión; puede ver, no votar ni preguntar. */
  participa: boolean;
}

/** Cada cuánto se pregunta por el panel. El CMS responde de un caché de 2 s. */
export const INTERVALO_SONDEO_MS = 4_000;

// ─── La ficha guardada ───────────────────────────────────────────────────────

const llave = (slug: string) => `ca_sala:${slug}`;

export function fichaGuardada(slug: string): string | null {
  try {
    return localStorage.getItem(llave(slug));
  } catch {
    return null;
  }
}

export function guardarFicha(slug: string, token: string): void {
  try {
    localStorage.setItem(llave(slug), token);
  } catch {
    /* almacenamiento no disponible: se pedirá de nuevo al recargar */
  }
}

export function olvidarFicha(slug: string): void {
  try {
    localStorage.removeItem(llave(slug));
  } catch {
    /* nada que olvidar */
  }
}

// ─── Llamadas ────────────────────────────────────────────────────────────────

/** La sala abierta de /en-vivo, si hay una (solo de eventos publicados). */
export async function salaAbierta(): Promise<SalaInfo | null> {
  const res = await fetch(`${cmsUrl()}/api/public/sala`);
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return ((await res.json()) as { sala: SalaInfo | null }).sala;
}

/**
 * Una sala por su liga directa (/en-vivo/<slug>): así se entra a una sala de
 * prueba, que no sale en /en-vivo. `null` si no existe.
 */
export async function salaPorSlug(slug: string): Promise<SalaInfo | null> {
  if (!SLUG_VALIDO.test(slug)) return null;
  const res = await fetch(`${cmsUrl()}/api/public/sala/${slug}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Error ${res.status}`);
  return ((await res.json()) as { sala: SalaInfo | null }).sala;
}

/** El mismo formato de slug que acepta el CMS. */
export const SLUG_VALIDO = /^[a-z0-9-]{1,220}$/;

export interface DatosRegistro {
  slug: string;
  name: string;
  email: string;
  whatsapp: string;
  privacyAccepted: true;
  marketingOptIn: boolean;
  turnstileToken?: string;
  website?: string;
}

export type ResultadoRegistro =
  | { ok: true; token: string; enRevision: boolean }
  | { ok: false; error: string; ocupado?: boolean };

export async function registrarse(datos: DatosRegistro): Promise<ResultadoRegistro> {
  try {
    const res = await fetch("/api/en-vivo/registro", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...datos, pageUrl: window.location.href, utm: utmDeLaPagina() }),
    });
    const cuerpo = (await res.json().catch(() => ({}))) as { token?: string; enRevision?: boolean; error?: string; ocupado?: boolean };
    if (res.ok && cuerpo.token) return { ok: true, token: cuerpo.token, enRevision: cuerpo.enRevision === true };
    return { ok: false, error: cuerpo.error ?? "No pudimos registrarte. Intenta de nuevo.", ocupado: cuerpo.ocupado === true };
  } catch {
    return { ok: false, error: "No pudimos registrarte. Revisa tu conexión e inténtalo de nuevo." };
  }
}

export type LecturaEstado =
  | { tipo: "ok"; estado: EstadoSala; etag: string | null }
  | { tipo: "sin-cambios" }
  | { tipo: "sin-ficha" }
  | { tipo: "error" };

export async function leerEstado(slug: string, token: string, etag: string | null): Promise<LecturaEstado> {
  try {
    const res = await fetch(`${cmsUrl()}/api/public/sala/${slug}/estado`, {
      headers: { Authorization: `Bearer ${token}`, ...(etag ? { "If-None-Match": etag } : {}) },
      cache: "no-store",
    });
    if (res.status === 304) return { tipo: "sin-cambios" };
    if (res.status === 401) return { tipo: "sin-ficha" };
    if (!res.ok) return { tipo: "error" };
    return { tipo: "ok", estado: (await res.json()) as EstadoSala, etag: res.headers.get("etag") };
  } catch {
    return { tipo: "error" };
  }
}

export async function votar(
  slug: string,
  token: string,
  activityId: number,
  options: number[],
): Promise<{ ok: true; myVote: number[] } | { ok: false; error: string; myVote?: number[] | null }> {
  try {
    const res = await fetch(`${cmsUrl()}/api/public/sala/${slug}/votar`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ activityId, options }),
    });
    const cuerpo = (await res.json().catch(() => ({}))) as { myVote?: number[] | null; error?: string };
    if (res.ok) return { ok: true, myVote: cuerpo.myVote ?? options };
    return { ok: false, error: cuerpo.error ?? "No pudimos registrar tu voto.", myVote: cuerpo.myVote };
  } catch {
    return { ok: false, error: "No pudimos registrar tu voto. Revisa tu conexión." };
  }
}

export async function preguntar(slug: string, token: string, body: string): Promise<{ ok: boolean; mensaje: string }> {
  try {
    const res = await fetch(`${cmsUrl()}/api/public/sala/${slug}/preguntas`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ body }),
    });
    const cuerpo = (await res.json().catch(() => ({}))) as { mensaje?: string; error?: string };
    if (res.ok) return { ok: true, mensaje: cuerpo.mensaje ?? "Recibimos tu pregunta." };
    return { ok: false, mensaje: cuerpo.error ?? "No pudimos enviar tu pregunta." };
  } catch {
    return { ok: false, mensaje: "No pudimos enviar tu pregunta. Revisa tu conexión." };
  }
}

// ─── Piezas sin red (probadas en salaEnVivo.test.ts) ─────────────────────────

/** Opciones que se mandan al votar: una en opción única, una o más en múltiple. */
export function alternarOpcion(kind: EncuestaSala["kind"], elegidas: number[], indice: number): number[] {
  if (kind === "opcion_unica") return [indice];
  return elegidas.includes(indice) ? elegidas.filter((i) => i !== indice) : [...elegidas, indice].sort((a, b) => a - b);
}

/** Lo que se le dice a la persona en la encuesta según su estado. */
export function avisoEncuesta(poll: EncuestaSala): string | null {
  if (poll.myVote && !poll.results) return "Gracias por votar. Los resultados se muestran al cerrar la votación.";
  if (!poll.open && !poll.myVote && !poll.results) return "La votación ya cerró.";
  return null;
}

/** Los botones del panel solo abren WhatsApp o una liga https. */
export function esLigaSegura(href: string): boolean {
  try {
    const u = new URL(href);
    return u.protocol === "https:";
  } catch {
    return false;
  }
}

function utmDeLaPagina(): Record<string, string> | undefined {
  const p = new URLSearchParams(window.location.search);
  const utm: Record<string, string> = {};
  for (const k of ["source", "medium", "campaign", "term", "content"]) {
    const v = p.get(`utm_${k}`);
    if (v) utm[k] = v.slice(0, 255);
  }
  return Object.keys(utm).length ? utm : undefined;
}
