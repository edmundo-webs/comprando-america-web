/*
 * Registro local del recorrido del visitante entre páginas.
 * Permite detectar cuando la misma persona explora ambas guías de estructura
 * (LLC e Inversión) para no tratarla como dos leads duplicados, y acompaña
 * cada post al CRM como contexto del touchpoint.
 */
export type JourneyEntry = { page: string; url: string; ts: string };

const KEY = "ca_journey";

export function trackPageVisit(page: string): void {
  if (typeof window === "undefined" || !window.localStorage) return;
  const history: JourneyEntry[] = getJourney();
  history.push({ page, url: window.location.href, ts: new Date().toISOString() });
  localStorage.setItem(KEY, JSON.stringify(history.slice(-20))); // máx. 20 entradas
}

export function getJourney(): JourneyEntry[] {
  if (typeof window === "undefined" || !window.localStorage) return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

/* Ventana de continuidad: solo tratamos el recorrido como "una misma exploración"
   cuando la visita a la otra página es reciente. Sin esto, una visita de hace
   semanas seguía disparando el mensaje de continuidad, que se sentía falso. */
export const CONTINUITY_WINDOW_MIN = 45;

export function visitedRecently(page: string, windowMinutes = CONTINUITY_WINDOW_MIN): boolean {
  const limite = Date.now() - windowMinutes * 60 * 1000;
  return getJourney().some((e) => {
    if (e.page !== page) return false;
    const t = Date.parse(e.ts);
    return Number.isFinite(t) && t >= limite;
  });
}
