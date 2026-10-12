import { ENV } from "./env";

/**
 * Cloudflare Turnstile: comprueba en el servidor que el formulario lo envió una
 * persona. El navegador muestra el widget con `VITE_TURNSTILE_SITE_KEY` y manda
 * el token; aquí se verifica con `TURNSTILE_SECRET_KEY`, que nunca sale del
 * servidor.
 *
 * Mientras `TURNSTILE_SECRET_KEY` no esté puesta, no se verifica (se avisa en
 * el registro) para no tumbar el formulario antes de configurar las llaves.
 */

const URL_VERIFICACION = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export const MENSAJE_TURNSTILE = "No pudimos verificar que eres una persona. Intenta de nuevo.";

export type ResultadoTurnstile = { ok: true; omitido?: true } | { ok: false; motivo: string };

type Fetch = typeof fetch;

export async function verificarTurnstile(
  token: string | undefined,
  ip: string | undefined,
  fetchImpl: Fetch = fetch,
): Promise<ResultadoTurnstile> {
  if (!ENV.turnstileSecretKey) {
    console.warn("[turnstile] TURNSTILE_SECRET_KEY no está configurada: el boletín se acepta sin verificar.");
    return { ok: true, omitido: true };
  }
  if (!token) return { ok: false, motivo: "sin token" };

  const cuerpo = new URLSearchParams({ secret: ENV.turnstileSecretKey, response: token });
  if (ip) cuerpo.set("remoteip", ip);
  try {
    const res = await fetchImpl(URL_VERIFICACION, {
      method: "POST",
      body: cuerpo,
      signal: AbortSignal.timeout(8_000),
    });
    const datos = (await res.json().catch(() => ({}))) as { success?: boolean; "error-codes"?: string[] };
    if (datos.success === true) return { ok: true };
    return { ok: false, motivo: (datos["error-codes"] ?? ["rechazado"]).join(",") };
  } catch (err: any) {
    // Si Cloudflare no responde, no se deja pasar: el visitante lo intenta de nuevo.
    return { ok: false, motivo: `sin respuesta de Cloudflare: ${String(err?.message ?? err)}` };
  }
}
