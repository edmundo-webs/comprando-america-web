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
 * Abre WhatsApp con un mensaje predefinido en una nueva ventana
 * @param phoneNumber - Número de teléfono en formato internacional
 * @param message - Mensaje a enviar
 */
export function openWhatsApp(phoneNumber: string, message: string): void {
  const url = getWhatsAppUrl(phoneNumber, message);
  window.open(url, "_blank", "noopener,noreferrer");
}

// Constantes de WhatsApp para Comprando América
export const WHATSAPP_PHONE = "523346766178";
export const WHATSAPP_MESSAGE = "Hola, vi tu información en el sitio web de Comprando América. Me gustaría conocer más sobre las oportunidades de inversión.";
