import { toast } from "sonner";

/*
 * Ingesta de leads — punto único de envío para todo el sitio.
 * Manda a POST /api/leads de este mismo sitio; el servidor lo reenvía al CMS
 * con el token (server/routes/leads.ts). El navegador nunca habla con la API
 * de leads del CMS ni lleva tokens (CLAUDE.md §1 y §3). Adjunta la URL de
 * origen y los parámetros UTM a cada envío.
 */

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

/** Cómo terminó un envío: recibido, CMS ocupado (intentar en unos segundos) o error. */
export type EnvioLead = "ok" | "ocupado" | "error";

/** Mismo texto que el CMS y que el servidor del sitio. */
export const MENSAJE_OCUPADO = "Estamos recibiendo muchos registros, intenta en unos segundos.";

/**
 * Envía el lead. Nunca lanza. «ok» cuando el servidor del sitio lo recibió;
 * desde ahí se encarga de que llegue al CMS (reintenta si el CMS no responde y,
 * si al final no entra, lo deja en su registro). «ocupado» cuando el CMS sigue
 * lleno después del único reintento del servidor: el formulario muestra
 * MENSAJE_OCUPADO para que la persona lo intente en unos segundos.
 */
export async function enviarLead(payload: CrmLeadPayload, honeypot: string): Promise<EnvioLead> {
  if (honeypot) return "error"; // bot llenó el campo oculto — omitir
  try {
    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // Sobrevive si la página abre WhatsApp o se cierra justo después:
      // el lead sale antes de que la persona se vaya.
      keepalive: true,
      body: JSON.stringify({
        ...payload,
        sourceUrl: window.location.href,
        utm: parseUtm(),
      }),
    });
    if (res.status === 503) return "ocupado";
    if (!res.ok) {
      console.warn("[leads] envío rechazado:", res.status, await res.text().catch(() => ""));
      return "error";
    }
    return "ok";
  } catch (err) {
    console.warn("[leads] envío fallido:", err);
    return "error";
  }
}

/**
 * Para los formularios que no esperan la respuesta (diagnósticos que siguen a
 * WhatsApp): `true` si se recibió. Si el CMS está ocupado, avisa con el mismo
 * mensaje, porque esa pantalla no muestra errores propios.
 */
export async function postCrmLead(payload: CrmLeadPayload, honeypot: string): Promise<boolean> {
  const r = await enviarLead(payload, honeypot);
  if (r === "ocupado") toast.error(MENSAJE_OCUPADO);
  return r === "ok";
}
