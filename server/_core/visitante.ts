/**
 * La IP del visitante que llega al sitio. Render la pone en `x-forwarded-for`
 * (la primera de la lista); sin ese encabezado, la de la conexión.
 *
 * Se manda al CMS como `clientIp` para su límite de registros por IP: el CMS
 * recibe los formularios desde este servidor, así que sin ella todos los
 * envíos llegarían con la misma IP (la del sitio).
 */
export function ipDelVisitante(req: { headers?: Record<string, unknown>; ip?: string } | undefined): string | undefined {
  const xff = req?.headers?.["x-forwarded-for"];
  const primera = typeof xff === "string" ? xff.split(",")[0].trim() : "";
  const ip = primera || req?.ip || "";
  return ip && ip.length <= 64 ? ip : undefined;
}
