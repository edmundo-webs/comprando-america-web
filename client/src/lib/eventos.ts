/**
 * Eventos de Comprando América — fuente única.
 *
 * Los datos de cada edición vivían duplicados en Home.tsx y en
 * InvestmentWeek.tsx, y las fechas ya se desfasaron una vez entre las dos.
 * Aquí viven una sola vez: el carrusel del home, la ventana del evento y la
 * página de Investment Week leen de este archivo.
 *
 * Las agendas se transcriben tal como vienen en el flyer oficial de cada
 * edición, sin rellenar los huecos: si el flyer sólo dice "Día 1 de Expo",
 * eso es lo que se muestra.
 *
 * La logística del viaje (aeropuerto, hospedaje, traslados) NO va aquí:
 * se comparte en privado con quien queda aprobado.
 */

/* Recorte para las fotos de las tarjetas. Los originales pesan megas y la caja
   de la imagen es apaisada, así que se sirven ya recortados. */
const FOTO = "c_fill,w_900,h_450,g_auto,q_auto,f_auto";
/* La foto de la Cumbre lleva personas y la caja llega a 2.7:1: se sirve en la
   proporción más ancha que toma la caja —para que el navegador sólo recorte a
   los lados, nunca por arriba— y anclada a las caras. */
const FOTO_CARAS = "c_fill,w_900,h_330,g_faces,q_auto,f_auto";
const CLOUD = "https://res.cloudinary.com/dgruohz6f/image/upload";

export interface DiaAgenda {
  fecha: string;
  titulo: string;
}

export interface Evento {
  id: string;
  /** Etiqueta de la tarjeta: presencial u online. */
  tipo: string;
  titulo: string;
  /** Rango corto para la tarjeta. */
  fecha: string;
  /** Rango con día de la semana, para la ventana del evento. */
  rango?: string;
  lugar: string;
  desc: string;
  imagen: string;
  /** Qué se va a hacer en la edición, en una frase. */
  objetivo?: string;
  agenda?: DiaAgenda[];
  /** Presente sólo cuando el evento necesita una página propia (un registro,
   *  por ejemplo). Si falta, el botón abre la ventana en vez de navegar. */
  href?: string;
  cta: string;
}

export const EVENTOS: Evento[] = [
  {
    id: "iw-ny",
    tipo: "Presencial",
    titulo: "Investment Week · Niagara Falls",
    fecha: "2 al 6 de octubre, 2026",
    rango: "Viernes 2 al martes 6 de octubre, 2026",
    lugar: "Niagara Falls, Nueva York",
    desc: "Casas unifamiliares para renta, el programa de la sección 8 y oportunidades en mercados que nadie está mirando.",
    objetivo:
      "Analizar oportunidades de inversión en casas unifamiliares para renta, el programa de la sección 8 y oportunidades en mercados ignorados.",
    agenda: [
      { fecha: "Viernes 2 de octubre", titulo: "Llegada" },
      { fecha: "Sábado 3 de octubre", titulo: "Día 1 — Teoría y campo" },
      { fecha: "Domingo 4 de octubre", titulo: "Día 2 — Inspección de propiedades" },
      { fecha: "Lunes 5 de octubre", titulo: "Visita a las cataratas del Niágara (opcional)" },
      { fecha: "Martes 6 de octubre", titulo: "Salida libre" },
    ],
    cta: "Ver el programa",
    imagen: `${CLOUD}/${FOTO}/v1788822723/tts-news/qjlkynfsqnkt4uflgaqm.jpg`,
  },
  {
    id: "iw-lv",
    tipo: "Presencial",
    titulo: "Investment Week · Las Vegas",
    fecha: "3 al 7 de noviembre, 2026",
    rango: "Martes 3 al sábado 7 de noviembre, 2026",
    lugar: "Las Vegas, Nevada",
    desc: "Las expos de la industria del transporte —AAPEX y SEMA— para detectar oportunidades, más sesión privada para miembros.",
    objetivo:
      "Recorrer las expos de la industria del transporte —AAPEX show y SEMA show— para detectar oportunidades, más una sesión privada para miembros.",
    agenda: [
      { fecha: "Martes 3 de noviembre", titulo: "Llegada" },
      { fecha: "Miércoles 4 de noviembre", titulo: "Día 1 de expo" },
      { fecha: "Jueves 5 de noviembre", titulo: "Día 2 de expo" },
      { fecha: "Viernes 6 de noviembre", titulo: "Sesión privada para miembros" },
      { fecha: "Sábado 7 de noviembre", titulo: "Regreso libre" },
    ],
    cta: "Ver el programa",
    imagen: `${CLOUD}/${FOTO}/v1788822260/tts-news/k51cme1dtzvs2c8qaa9b.jpg`,
  },
  {
    id: "cumbre",
    tipo: "Online · Gratuito",
    titulo: "Cumbre Digital",
    fecha: "Próxima edición por anunciar",
    lugar: "En vivo, desde donde estés",
    desc: "Una mañana intensiva para construir y proteger tu patrimonio en EE.UU. Regístrate y te avisamos en cuanto haya fecha.",
    /* Este sí necesita página: el registro va con formulario. */
    href: "/cumbre-digital",
    cta: "Registrarme sin costo",
    imagen: `${CLOUD}/${FOTO_CARAS}/v1782675100/tts-news/xpto1gompkv2f4lwqon4.jpg`,
  },
];

/** Las ediciones de Investment Week, que son las que tienen programa. */
export const EDICIONES = EVENTOS.filter((e) => e.agenda && e.agenda.length > 0);
