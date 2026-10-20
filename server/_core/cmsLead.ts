import { ENV } from "./env";

/**
 * Único camino de los leads del sitio al CMS (CLAUDE.md §1 y §2): del servidor,
 * con el token `CMS_API_KEY`. Ningún formulario habla con el CMS desde el
 * navegador ni escribe el lead en la base de este sitio.
 *
 * Dos direcciones del CMS, según lo que su API acepta hoy:
 *
 *   /api/public/leads     Formularios y cuestionarios. Guarda la ficha del GPS y
 *                         los campos del formulario como notas visibles para el
 *                         equipo, acepta email o teléfono, y deduplica.
 *                         Hoy no revisa el token; se manda igual para que siga
 *                         funcionando el día que el CMS lo exija.
 *   /api/public/v1/leads  Boletín. Exige el token y etiqueta "newsletter".
 *
 * Si el CMS no responde se reintenta en segundo plano y al visitante se le dice
 * que su mensaje se recibió. Si al final no entra, el envío completo queda en
 * el registro del servidor —no en una base de datos— para recuperarlo a mano.
 *
 * «Ocupado» es otra cosa: el CMS está recibiendo muchos registros a la vez
 * (Cumbre) y responde 503 con Retry-After y `retryAfter`. Ahí se espera lo que
 * pide y se reintenta UNA sola vez; si sigue ocupado, se le avisa al visitante
 * («intenta en unos segundos») y queda un último intento en segundo plano a los
 * 60 segundos, cuando la avalancha ya pasó: los formularios con diagnóstico
 * siguen a WhatsApp sin esperar la respuesta y su lead no puede quedarse solo
 * en el registro. Si ese intento también falla, el envío completo queda en el
 * registro («ENVIO FALLIDO»). Si la persona además lo vuelve a enviar, el CMS
 * no duplica: lo reconoce por su correo o su teléfono.
 */

/** Lo que ve el visitante cuando el CMS está ocupado (mismo texto que el CMS). */
export const MENSAJE_OCUPADO = "Estamos recibiendo muchos registros, intenta en unos segundos.";

/** Nunca se espera más que esto antes del único reintento por «ocupado». */
export const ESPERA_OCUPADO_MAX_MS = 5_000;

/** El último intento en segundo plano cuando el CMS siguió ocupado. */
export const ULTIMO_INTENTO_OCUPADO_MS = 60_000;

export type RutaCms = "/api/public/leads" | "/api/public/v1/leads";

export type ResultadoEnvio =
  | { entregado: true; status: number }
  | { entregado: false; status?: number; error: string; reintentable: boolean; ocupado?: boolean; esperaMs?: number };

type Fetch = typeof fetch;

/** Esperas entre reintentos en segundo plano, en milisegundos. */
export const ESPERAS_REINTENTO_MS = [5_000, 30_000, 120_000, 600_000];

const TIEMPO_MAXIMO_MS = 8_000;

export function urlDelCms(): string {
  const base = ENV.cmsApiUrl || process.env.VITE_CRM_API_URL || "https://cms.comprandoamerica.com";
  return base.replace(/\/+$/, "");
}

/** Un solo intento. Nunca lanza. */
export async function intentarEnvio(
  ruta: RutaCms,
  cuerpo: Record<string, unknown>,
  fetchImpl: Fetch = fetch,
): Promise<ResultadoEnvio> {
  const encabezados: Record<string, string> = { "Content-Type": "application/json" };
  if (ENV.cmsApiKey) encabezados["x-api-key"] = ENV.cmsApiKey;

  try {
    const res = await fetchImpl(`${urlDelCms()}${ruta}`, {
      method: "POST",
      headers: encabezados,
      body: JSON.stringify(cuerpo),
      signal: AbortSignal.timeout(TIEMPO_MAXIMO_MS),
    });
    if (res.ok) return { entregado: true, status: res.status };
    const texto = await res.text().catch(() => "");
    const ocupado = esOcupado(res.status, res.headers.get("retry-after"), texto);
    if (ocupado) {
      return { entregado: false, status: res.status, error: texto.slice(0, 500), reintentable: false, ocupado: true, esperaMs: ocupado.esperaMs };
    }
    // 429 y 5xx son pasajeros; un 4xx es un problema del envío y repetirlo
    // daría el mismo error.
    const reintentable = res.status === 429 || res.status >= 500;
    return { entregado: false, status: res.status, error: texto.slice(0, 500), reintentable };
  } catch (err: any) {
    return { entregado: false, error: String(err?.message ?? err), reintentable: true };
  }
}

/** El 503 «ocupado» del CMS (fila de altas llena) lleva Retry-After y `retryAfter`. */
function esOcupado(status: number, retryAfter: string | null, cuerpo: string): { esperaMs: number } | null {
  if (status !== 503 || retryAfter === null) return null;
  try {
    if (typeof (JSON.parse(cuerpo) as { retryAfter?: unknown }).retryAfter !== "number") return null;
  } catch {
    return null;
  }
  const segundos = Number(retryAfter);
  return { esperaMs: Math.min(Number.isFinite(segundos) && segundos >= 0 ? segundos * 1000 : ESPERA_OCUPADO_MAX_MS, ESPERA_OCUPADO_MAX_MS) };
}

function registrarFallo(ruta: RutaCms, cuerpo: Record<string, unknown>, r: Extract<ResultadoEnvio, { entregado: false }>) {
  // El cuerpo va completo a propósito: es la única copia del lead que no llegó
  // (CLAUDE.md §2). Se busca en el registro de Render por "ENVIO FALLIDO".
  console.error(
    `[cms-lead] ENVIO FALLIDO ${ruta} status=${r.status ?? "sin respuesta"} error=${r.error}`,
    JSON.stringify(cuerpo),
  );
}

type Programar = (fn: () => void, ms: number) => void;
type Esperar = (ms: number) => Promise<void>;

/**
 * Envía el lead. Espera solo el primer intento; si falla por algo pasajero,
 * sigue reintentando en segundo plano sin hacer esperar al visitante.
 */
export async function enviarAlCms(
  ruta: RutaCms,
  cuerpo: Record<string, unknown>,
  opciones: { fetchImpl?: Fetch; programar?: Programar; esperas?: number[]; esperar?: Esperar } = {},
): Promise<ResultadoEnvio> {
  const {
    fetchImpl = fetch,
    programar = (fn, ms) => void setTimeout(fn, ms),
    esperas = ESPERAS_REINTENTO_MS,
    esperar = (ms) => new Promise<void>((r) => setTimeout(r, ms)),
  } = opciones;

  if (ruta === "/api/public/v1/leads" && !ENV.cmsApiKey) {
    const r = { entregado: false as const, error: "Falta CMS_API_KEY en el servidor", reintentable: false };
    registrarFallo(ruta, cuerpo, r);
    return r;
  }

  let primero = await intentarEnvio(ruta, cuerpo, fetchImpl);
  // CMS ocupado: se espera lo que pide y se reintenta una sola vez.
  if (!primero.entregado && primero.ocupado) {
    await esperar(primero.esperaMs ?? ESPERA_OCUPADO_MAX_MS);
    primero = await intentarEnvio(ruta, cuerpo, fetchImpl);
    if (!primero.entregado && primero.ocupado) {
      console.warn(`[cms-lead] CMS ocupado ${ruta}: último intento en ${ULTIMO_INTENTO_OCUPADO_MS / 1000} s`);
      programar(async () => {
        const r = await intentarEnvio(ruta, cuerpo, fetchImpl);
        if (r.entregado) console.log(`[cms-lead] entregado en el último intento ${ruta}`);
        else registrarFallo(ruta, cuerpo, r);
      }, ULTIMO_INTENTO_OCUPADO_MS);
      return primero;
    }
  }
  if (primero.entregado) return primero;
  if (!primero.reintentable) {
    registrarFallo(ruta, cuerpo, primero);
    return primero;
  }

  const reintentar = (intento: number) => {
    programar(async () => {
      const r = await intentarEnvio(ruta, cuerpo, fetchImpl);
      if (r.entregado) {
        console.log(`[cms-lead] entregado en el reintento ${intento + 1} ${ruta}`);
        return;
      }
      if (r.reintentable && intento + 1 < esperas.length) return reintentar(intento + 1);
      registrarFallo(ruta, cuerpo, r);
    }, esperas[intento]);
  };
  if (esperas.length > 0) reintentar(0);
  else registrarFallo(ruta, cuerpo, primero);

  return primero;
}
