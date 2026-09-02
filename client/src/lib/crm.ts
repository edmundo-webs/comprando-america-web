/*
 * Ingesta pública de leads al CRM — punto único de envío para todo el sitio.
 * Centraliza la función que antes estaba duplicada en GpsPage.tsx y
 * EstructuraEmpresarial.tsx. Adjunta automáticamente visitorId, recorrido
 * (journey), URL de origen y parámetros UTM a cada envío.
 */
import { getVisitorId } from "./visitor";
import { getJourney } from "./journey";

const CRM_API_URL = (import.meta.env.VITE_CRM_API_URL as string | undefined) ?? "https://ca-cms.onrender.com";

/* ─── Contacto recordado localmente ───
   Se guarda tras el primer envío exitoso en cualquiera de las guías, para
   pre-llenar el formulario de la otra guía sin volver a pedir todos los datos. */
export type SavedContact = { name: string; email: string; phone: string };

export function saveContact(contact: SavedContact): void {
  if (typeof window === "undefined" || !window.localStorage) return;
  try {
    localStorage.setItem("ca_contact", JSON.stringify(contact));
  } catch {
    /* almacenamiento no disponible — ignorar */
  }
}

export function getSavedContact(): SavedContact | null {
  if (typeof window === "undefined" || !window.localStorage) return null;
  try {
    const raw = localStorage.getItem("ca_contact");
    return raw ? (JSON.parse(raw) as SavedContact) : null;
  } catch {
    return null;
  }
}

/* ─── Ficha para el equipo ───
   Mismos campos al CRM y al mensaje de WhatsApp, para que no se repregunte en la
   llamada lo que la persona ya contestó. */
export type FichaContacto = { name: string; email: string; phone: string; country: string };

/** Origen del lead: UTM + referrer, como campos de la ficha. */
export function origenCampos(): { label: string; value: string }[] {
  if (typeof window === "undefined") return [];
  const p = new URLSearchParams(window.location.search);
  const campos = [
    { label: "utm_source", value: p.get("utm_source") ?? "" },
    { label: "utm_medium", value: p.get("utm_medium") ?? "" },
    { label: "utm_campaign", value: p.get("utm_campaign") ?? "" },
    { label: "utm_content", value: p.get("utm_content") ?? "" },
    { label: "Referrer", value: typeof document !== "undefined" ? document.referrer : "" },
  ];
  return campos.filter((c) => c.value.trim());
}

/** Mensaje precargado de WhatsApp — mismo contenido que las notas del CRM. */
export function buildFichaTexto(
  campos: { label: string; value: string }[],
  saludo: string,
  contexto?: string,
): string {
  return [
    saludo,
    ...(contexto ? ["", contexto] : []),
    ...(campos.length ? ["", ...campos.map((c) => `${c.label}: ${c.value}`)] : []),
  ].join("\n");
}

function parseUtm(): Record<string, string | null> {
  const params = new URLSearchParams(window.location.search);
  return {
    utm_source: params.get("utm_source"),
    utm_medium: params.get("utm_medium"),
    utm_campaign: params.get("utm_campaign"),
    utm_content: params.get("utm_content"),
  };
}

export interface CrmLeadPayload {
  name?: string;
  email?: string;
  phone?: string;
  sourceSlug: string; // "web_ca_gps" | "web_ca_llc" | "web_ca_inversion"
  hito: string; // catálogo de hitos comunicacionales
  stage: "partial" | "complete" | "closed";
  tags?: string[];
  notes?: Record<string, unknown>; // respuestas del diagnóstico
  // Campos adicionales específicos de una página (ej. gpsFicha, quizSessionId)
  // se pasan tal cual al backend.
  [key: string]: unknown;
}

/**
 * Envía el lead al CRM. Nunca lanza: devuelve `true` solo si el CRM confirmó
 * que lo guardó, para que quien lo llame pueda decidir si el registro del
 * visitante quedó realmente asegurado en algún destino.
 */
export async function postCrmLead(payload: CrmLeadPayload, honeypot: string): Promise<boolean> {
  if (honeypot) return false; // bot llenó el campo oculto — omitir
  const visitorId = getVisitorId();
  const journey = getJourney();
  try {
    const res = await fetch(`${CRM_API_URL}/api/public/leads`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...payload,
        visitorId,
        sourceUrl: window.location.href,
        journey,
        ...parseUtm(),
      }),
    });
    if (!res.ok) {
      console.warn("[CRM] lead post rechazado:", res.status, await res.text().catch(() => ""));
      return false;
    }
    return true;
  } catch (err) {
    console.warn("[CRM] lead post failed (best-effort):", err);
    return false;
  }
}
