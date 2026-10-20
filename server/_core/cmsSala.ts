import { ENV } from "./env";
import { ESPERA_OCUPADO_MAX_MS, esOcupado, urlDelCms } from "./cmsLead";

/**
 * Registro a la sala en vivo del CMS (`POST /api/public/sala/:slug/registro`).
 *
 * Igual que los leads (cmsLead.ts), el registro sale de este servidor con
 * `CMS_API_KEY`; el navegador nunca lleva la llave. A diferencia de un
 * formulario, aquí la persona espera la ficha de la sala para entrar, así que
 * no hay reintentos en segundo plano: si el CMS está ocupado se espera lo que
 * pide, se reintenta UNA vez y, si sigue ocupado, se le pide que lo intente en
 * unos segundos (su envío queda en el registro del servidor).
 *
 * Lo demás (panel, votos, preguntas) lo hace el navegador directo con el CMS,
 * con la ficha que devuelve este registro.
 */

export type ResultadoSala =
  | { ok: true; token: string; enRevision: boolean }
  | { ok: false; ocupado: true }
  | { ok: false; ocupado?: false; status: number; error: string };

type Fetch = typeof fetch;
type Esperar = (ms: number) => Promise<void>;

const TIEMPO_MAXIMO_MS = 8_000;

/** Slug de sala que acepta el CMS. */
export const SLUG_SALA = /^[a-z0-9-]{1,220}$/;

async function intentar(slug: string, cuerpo: Record<string, unknown>, fetchImpl: Fetch) {
  const res = await fetchImpl(`${urlDelCms()}/api/public/sala/${slug}/registro`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-api-key": ENV.cmsApiKey },
    body: JSON.stringify(cuerpo),
    signal: AbortSignal.timeout(TIEMPO_MAXIMO_MS),
  });
  const texto = await res.text().catch(() => "");
  return { res, texto };
}

export async function registrarEnSala(
  slug: string,
  cuerpo: Record<string, unknown>,
  opciones: { fetchImpl?: Fetch; esperar?: Esperar } = {},
): Promise<ResultadoSala> {
  const { fetchImpl = fetch, esperar = (ms) => new Promise<void>((r) => setTimeout(r, ms)) } = opciones;
  if (!ENV.cmsApiKey) {
    console.error("[sala] Falta CMS_API_KEY en el servidor");
    return { ok: false, status: 500, error: "Falta configuración del servidor" };
  }
  try {
    let { res, texto } = await intentar(slug, cuerpo, fetchImpl);
    const primero = esOcupado(res.status, res.headers.get("retry-after"), texto);
    if (primero) {
      await esperar(primero.esperaMs ?? ESPERA_OCUPADO_MAX_MS);
      ({ res, texto } = await intentar(slug, cuerpo, fetchImpl));
      if (esOcupado(res.status, res.headers.get("retry-after"), texto)) {
        // Sin datos de contacto en claro de más: el registro lleva el envío
        // completo, como los leads, para recuperarlo si hiciera falta.
        console.error(`[sala] ENVIO FALLIDO registro ${slug} status=503 ocupado`, JSON.stringify(cuerpo));
        return { ok: false, ocupado: true };
      }
    }
    if (res.status === 200 || res.status === 202) {
      const datos = JSON.parse(texto) as { token?: string; enRevision?: boolean };
      if (datos.token) return { ok: true, token: datos.token, enRevision: datos.enRevision === true };
    }
    let error = "No pudimos registrarte. Intenta de nuevo.";
    try {
      const datos = JSON.parse(texto) as { error?: string };
      // Solo los mensajes para la persona (sala cerrada, datos inválidos).
      if (datos.error && (res.status === 409 || res.status === 400 || res.status === 404)) error = datos.error;
    } catch {
      /* respuesta sin JSON */
    }
    if (res.status >= 500) console.error(`[sala] registro ${slug} status=${res.status} ${texto.slice(0, 300)}`);
    return { ok: false, status: res.status, error };
  } catch (err: any) {
    console.error(`[sala] registro ${slug} sin respuesta del CMS: ${String(err?.message ?? err)}`);
    return { ok: false, status: 502, error: "No pudimos registrarte. Intenta de nuevo." };
  }
}
