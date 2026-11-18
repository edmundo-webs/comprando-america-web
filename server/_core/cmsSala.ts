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

/**
 * A qué ruta del CMS va: el registro con el formulario, la entrada con la
 * invitación del correo o, en la repetición, el reingreso de quien ya se
 * registró desde ese navegador (por su `ca_visitor_id`).
 */
export type AccionSala = "registro" | "invitacion" | "reingreso";

async function intentar(slug: string, accion: AccionSala, cuerpo: Record<string, unknown>, fetchImpl: Fetch) {
  const res = await fetchImpl(`${urlDelCms()}/api/public/sala/${slug}/${accion}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-api-key": ENV.cmsApiKey },
    body: JSON.stringify(cuerpo),
    signal: AbortSignal.timeout(TIEMPO_MAXIMO_MS),
  });
  const texto = await res.text().catch(() => "");
  return { res, texto };
}

export function registrarEnSala(
  slug: string,
  cuerpo: Record<string, unknown>,
  opciones: { fetchImpl?: Fetch; esperar?: Esperar } = {},
): Promise<ResultadoSala> {
  return enviarASala(slug, "registro", cuerpo, opciones);
}

/**
 * Entrar con la liga personal del correo: el aviso de privacidad aceptado y la
 * ficha de la invitación. El CMS la liga al contacto que ya existe, sin
 * duplicarlo; no hace falta Turnstile (la liga va firmada).
 */
export function entrarConInvitacion(
  slug: string,
  cuerpo: { invitacion: string; privacyAccepted?: true; marketingOptIn: boolean; visitorId?: string; utm?: Record<string, string> },
  opciones: { fetchImpl?: Fetch; esperar?: Esperar } = {},
): Promise<ResultadoSala> {
  return enviarASala(slug, "invitacion", cuerpo, opciones);
}

/**
 * Repetición: quien ya se registró en esa sala desde este navegador entra
 * directo, sin el formulario ni la liga personal. 404 si no hay registro.
 */
export function reingresarEnSala(
  slug: string,
  visitorId: string,
  opciones: { fetchImpl?: Fetch; esperar?: Esperar } = {},
): Promise<ResultadoSala> {
  return enviarASala(slug, "reingreso", { visitorId }, opciones);
}

// ─── Repetición: el registro no se pierde si el CMS no responde ──────────────

/** Cuándo se reintenta un registro de la repetición que no entró (después del primer intento). */
export const REINTENTOS_REPETICION_MS = [30_000, 120_000, 600_000] as const;

/** ¿Vale la pena reintentar? Ocupado, error del CMS o sin respuesta; no un dato inválido. */
export function esFallaReintentable(r: ResultadoSala): boolean {
  if (r.ok) return false;
  if (r.ocupado) return true;
  return r.status >= 500;
}

/**
 * En la repetición, el video se muestra aunque el registro no se haya podido
 * guardar: aquí se reintenta en segundo plano. Si al final no entra, el envío
 * completo queda en el registro del servidor (`ENVIO FALLIDO`), como los leads.
 */
export function reintentarRegistroEnSegundoPlano(
  slug: string,
  cuerpo: Record<string, unknown>,
  opciones: { fetchImpl?: Fetch; esperar?: Esperar; pausas?: readonly number[] } = {},
): Promise<boolean> {
  const { pausas = REINTENTOS_REPETICION_MS, esperar = (ms) => new Promise<void>((r) => setTimeout(r, ms).unref?.()) } = opciones;
  return (async () => {
    for (const pausa of pausas) {
      await esperar(pausa);
      const r = await registrarEnSala(slug, cuerpo, { ...opciones, esperar });
      if (r.ok) {
        console.log(`[sala] Registro de la repetición ${slug} guardado en el reintento.`);
        return true;
      }
      if (!esFallaReintentable(r)) break;
    }
    console.error(`[sala] ENVIO FALLIDO registro (repetición) ${slug} sin respuesta del CMS tras reintentar`, JSON.stringify(cuerpo));
    return false;
  })();
}

async function enviarASala(
  slug: string,
  accion: AccionSala,
  cuerpo: Record<string, unknown>,
  opciones: { fetchImpl?: Fetch; esperar?: Esperar },
): Promise<ResultadoSala> {
  const { fetchImpl = fetch, esperar = (ms) => new Promise<void>((r) => setTimeout(r, ms)) } = opciones;
  if (!ENV.cmsApiKey) {
    console.error("[sala] Falta CMS_API_KEY en el servidor");
    return { ok: false, status: 500, error: "Falta configuración del servidor" };
  }
  try {
    let { res, texto } = await intentar(slug, accion, cuerpo, fetchImpl);
    const primero = esOcupado(res.status, res.headers.get("retry-after"), texto);
    if (primero) {
      await esperar(primero.esperaMs ?? ESPERA_OCUPADO_MAX_MS);
      ({ res, texto } = await intentar(slug, accion, cuerpo, fetchImpl));
      if (esOcupado(res.status, res.headers.get("retry-after"), texto)) {
        // Sin datos de contacto en claro de más: el registro lleva el envío
        // completo, como los leads, para recuperarlo si hiciera falta.
        console.error(`[sala] ENVIO FALLIDO ${accion} ${slug} status=503 ocupado`, JSON.stringify(cuerpo));
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
      if (datos.error && [400, 404, 409, 410].includes(res.status)) error = datos.error;
    } catch {
      /* respuesta sin JSON */
    }
    if (res.status >= 500) console.error(`[sala] ${accion} ${slug} status=${res.status} ${texto.slice(0, 300)}`);
    return { ok: false, status: res.status, error };
  } catch (err: any) {
    console.error(`[sala] ${accion} ${slug} sin respuesta del CMS: ${String(err?.message ?? err)}`);
    return { ok: false, status: 502, error: "No pudimos registrarte. Intenta de nuevo." };
  }
}
