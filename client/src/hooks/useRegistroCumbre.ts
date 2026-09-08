import { useState } from "react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { postCrmLead } from "@/lib/crm";
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
  countryCode: string;
  whatsapp: string;
  email: string;
}

export function useRegistroCumbre(fuente: string) {
  const [formData, setFormData] = useState<RegistroFormData>({
    nombreCompleto: "",
    countryCode: "+52",
    whatsapp: "",
    email: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [enviando, setEnviando] = useState(false);

  const registerMutation = trpc.leads.create.useMutation();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (enviando) return;
    if (!formData.nombreCompleto.trim()) {
      toast.error("Por favor ingresa tu nombre completo.");
      return;
    }
    if (!formData.whatsapp.trim()) {
      toast.error("Por favor ingresa tu número de WhatsApp.");
      return;
    }
    if (!formData.email.includes("@")) {
      toast.error("Por favor ingresa un correo electrónico válido.");
      return;
    }

    const nombreCompleto = formData.nombreCompleto.trim();
    const email = formData.email.trim();
    const lada = formData.countryCode.replace("CA", "");
    const numero = formData.whatsapp.trim();

    setEnviando(true);
    // El lead se manda a dos destinos independientes: la tabla `ca_leads` del
    // sitio (vía tRPC) y el CRM público. Si uno de los dos está caído el
    // registro del visitante NO se pierde, y solo mostramos error si fallan
    // ambos — antes un 500 de la base tiraba el registro completo.
    const [dbOk, crmOk] = await Promise.all([
      registerMutation
        .mutateAsync({ nombreCompleto, whatsapp: `${lada} ${numero}`, email, fuente })
        .then(() => true)
        .catch((err) => {
          console.error("[cumbre] no se pudo guardar en ca_leads:", err);
          return false;
        }),
      postCrmLead(
        {
          name: nombreCompleto,
          email,
          phone: `${lada}${numero}`,
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
      ),
    ]);
    setEnviando(false);

    if (!dbOk && !crmOk) {
      // Nunca mostramos el mensaje crudo del backend al visitante.
      toast.error("No pudimos completar tu registro. Revisa tu conexión e inténtalo de nuevo.");
      return;
    }

    setSubmitted(true);
    toast.success("¡Listo! Te esperamos el sábado 24 de octubre.");
    setTimeout(() => {
      window.location.href = CUMBRE_WHATSAPP_GRUPO;
    }, 1500);
  };

  return { formData, setFormData, onSubmit, enviando, submitted };
}
