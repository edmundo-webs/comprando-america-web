/*
 * Identificador anónimo persistente por navegador.
 * Se envía en todos los posts al CRM (GPS, LLC, Inversión) para que el backend
 * pueda unir los touchpoints del mismo visitante en un solo contacto, incluso
 * antes de que deje su correo o teléfono.
 */
export function getVisitorId(): string {
  const KEY = "ca_visitor_id";
  if (typeof window === "undefined" || !window.localStorage) {
    // Entorno sin localStorage (SSR/pruebas): id efímero, no persiste.
    return crypto.randomUUID();
  }
  let id = localStorage.getItem(KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(KEY, id);
  }
  return id;
}
