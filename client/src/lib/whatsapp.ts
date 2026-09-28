import { sendCtaClick, trackedRedirect } from "./tracking";
import { digitosParaWhatsApp } from "@shared/telefono";

/**
 * Genera una URL de WhatsApp con un mensaje predefinido
 * @param phoneNumber - Número de teléfono en formato internacional (ej: 523346766178)
 * @param message - Mensaje a enviar (será codificado en URL)
 * @returns URL de WhatsApp para iniciar chat
 */
export function getWhatsAppUrl(phoneNumber: string, message: string): string {
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
}

/**
 * Igual que getWhatsAppUrl pero devuelve una URL que pasa por
 * /api/track/redirect para que la clave del CTA quede registrada.
 * Úsalo en <a href={...}> cuando quieras que el propio click quede loggeado
 * incluso si el usuario abre el enlace en otra pestaña.
 */
export function getTrackedWhatsAppUrl(
  phoneNumber: string,
  message: string,
  cta: string,
  location?: string
): string {
  return trackedRedirect(getWhatsAppUrl(phoneNumber, message), cta, location);
}

/**
 * Abre WhatsApp con un mensaje predefinido en una nueva ventana.
 * Registra el click en /api/track/cta antes de abrir la ventana para que el
 * evento quede persistido aunque el usuario cierre la pestaña original.
 */
export function openWhatsApp(
  phoneNumber: string,
  message: string,
  cta: string = "whatsapp",
  location?: string
): void {
  const url = getWhatsAppUrl(phoneNumber, message);
  try {
    sendCtaClick({ cta, location, destination: url });
  } catch {
    /* swallow — nunca bloquees la apertura de WhatsApp por analytics */
  }
  window.open(url, "_blank", "noopener,noreferrer");
}

// Constantes de WhatsApp para Comprando América.
// El número del sitio vive SOLO aquí, en E.164 (CLAUDE.md §5). Ninguna página
// escribe el número a mano: todas usan WHATSAPP_PHONE o getWhatsAppUrl.
export const WHATSAPP_E164 = "+523346766178";
/** El mismo número sin "+", que es como lo pide wa.me. */
export const WHATSAPP_PHONE = digitosParaWhatsApp(WHATSAPP_E164);
export const WHATSAPP_MESSAGE = "Hola, vi tu información en el sitio web de Comprando América. Me gustaría conocer más sobre las oportunidades de inversión.";
