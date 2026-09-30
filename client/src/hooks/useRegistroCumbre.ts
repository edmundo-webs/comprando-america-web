import { useState } from "react";
import { toast } from "sonner";
import { postCrmLead } from "@/lib/crm";
import { telefonoAE164, TELEFONO_VACIO, type Telefono } from "@shared/telefono";
import { CUMBRE_URL, CUMBRE_WHATSAPP_GRUPO } from "@/lib/eventos";

/**
 * Registro a la Cumbre Digital.
 *
 * Vive fuera de la página porque ahora hay dos formularios —el de
 * /cumbre-digital y el de la ventana del home— y los dos tienen que caer
 * idénticos en el CMS. Duplicar esta función era la manera segura de que un
 * día uno de los dos dejara de etiquetar bien y nadie se diera cuenta.
 *
 * Lo que el CMS recibe no cambia según de dónde se envíe: mismo sourceSlug,
 * mismo hito, mismo stage. Lo único que distingue el origen es la etiqueta
 * `fuente:`, que es justamente para poder atribuirlo.
 */

export interface RegistroFormData {
  nombreCompleto: string;
  /** País elegido por la persona + número (CLAUDE.md §5: sin país por defecto). */
  telefono: Telefono;
  email: string;
}

export function useRegistroCumbre(fuente: string) {
  const [formData, setFormData] = useState<RegistroFormData>({
    nombreCompleto: "",
    telefono: TELEFONO_VACIO,
    email: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [errorTelefono, setErrorTelefono] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (enviando) return;
    if (!formData.nombreCompleto.trim()) {
      toast.error("Por favor ingresa tu nombre completo.");
      return;
    }
    const tel = telefonoAE164(formData.telefono.pais, formData.telefono.numero);
    if (!tel.ok) {
      setErrorTelefono(tel.error);
      toast.error(tel.error);
      return;
    }
    setErrorTelefono(null);
    if (!formData.email.includes("@")) {
      toast.error("Por favor ingresa un correo electrónico válido.");
      return;
    }

    const nombreCompleto = formData.nombreCompleto.trim();
    const email = formData.email.trim();

    setEnviando(true);
    // Un solo destino: el servidor del sitio, que lo pasa al CMS (CLAUDE.md §1).
    // Ya no se escribe en ca_leads.
    const ok = await postCrmLead(
      {
        name: nombreCompleto,
        email,
        phone: tel.e164,
        sourceSlug: "web_ca_cumbre",
        hito: "registro_cumbre",
        stage: "partial",
        tags: [`fuente:${fuente}`],
        // postCrmLead manda sourceUrl con la página donde se llenó el
        // formulario, que desde el home es "/". Esto asegura que el CMS
        // reciba siempre la URL del evento, no la de la página de origen.
        eventoUrl: CUMBRE_URL,
      },
      "",
    );
    setEnviando(false);

    if (!ok) {
      // Nunca mostramos el mensaje crudo del backend al visitante.
      toast.error("No pudimos completar tu registro. Revisa tu conexión e inténtalo de nuevo.");
      return;
    }

    setSubmitted(true);
    toast.success("¡Listo! Te esperamos el sábado 14 de noviembre.");
    setTimeout(() => {
      window.location.href = CUMBRE_WHATSAPP_GRUPO;
    }, 1500);
  };

  return { formData, setFormData, onSubmit, enviando, submitted, errorTelefono };
}
