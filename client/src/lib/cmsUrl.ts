/**
 * La dirección del CMS para las lecturas públicas (eventos, portafolio).
 *
 * Este código corre en dos lados: en el navegador (Vite) y en el servidor,
 * que pinta el home para los buscadores (`server/routes/search-pages.tsx`).
 * En el navegador la variable viene de `import.meta.env`, que Vite llena al
 * compilar; en Node `import.meta.env` NO existe, así que se lee con acceso
 * seguro y se cae a `process.env`. Se resuelve al llamarse, no al cargar el
 * módulo: leerla al importar tumbó el servidor al arrancar (#178).
 */

export const CMS_URL_POR_DEFECTO = "https://cms.comprandoamerica.com";

type Entorno = Record<string, string | undefined>;

export function cmsUrl(): string {
  const deVite = (import.meta as unknown as { env?: Entorno }).env?.VITE_CRM_API_URL;
  const deNode = typeof process !== "undefined" ? process.env?.VITE_CRM_API_URL : undefined;
  return (deVite || deNode || CMS_URL_POR_DEFECTO).replace(/\/+$/, "");
}
