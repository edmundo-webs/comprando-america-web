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
 */

export type RutaCms = "/api/public/leads" | "/api/public/v1/leads";

export type ResultadoEnvio =
  | { entregado: true; status: number }
  | { entregado: false; status?: number; error: string; reintentable: boolean };

type Fetch = typeof fetch;

/** Esperas entre reintentos en segundo plano, en milisegundos. */
export const ESPERAS_REINTENTO_MS = [5_000, 30_000, 120_000, 600_000];

const TIEMPO_MAXIMO_MS = 8_000;

export function urlDelCms(): string {
  const base = ENV.cmsApiUrl || process.env.VITE_CRM_API_URL || "https://ca-cms.onrender.com";
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
    // 429 y 5xx son pasajeros; un 4xx es un problema del envío y repetirlo
    // daría el mismo error.
    const reintentable = res.status === 429 || res.status >= 500;
    return { entregado: false, status: res.status, error: texto.slice(0, 500), reintentable };
  } catch (err: any) {
    return { entregado: false, error: String(err?.message ?? err), reintentable: true };
  }
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

/**
 * Envía el lead. Espera solo el primer intento; si falla por algo pasajero,
 * sigue reintentando en segundo plano sin hacer esperar al visitante.
 */
export async function enviarAlCms(
  ruta: RutaCms,
  cuerpo: Record<string, unknown>,
  opciones: { fetchImpl?: Fetch; programar?: Programar; esperas?: number[] } = {},
): Promise<ResultadoEnvio> {
  const { fetchImpl = fetch, programar = (fn, ms) => void setTimeout(fn, ms), esperas = ESPERAS_REINTENTO_MS } = opciones;

  if (ruta === "/api/public/v1/leads" && !ENV.cmsApiKey) {
    const r = { entregado: false as const, error: "Falta CMS_API_KEY en el servidor", reintentable: false };
    registrarFallo(ruta, cuerpo, r);
    return r;
  }

  const primero = await intentarEnvio(ruta, cuerpo, fetchImpl);
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
