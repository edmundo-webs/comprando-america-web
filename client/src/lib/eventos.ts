/**
 * Eventos de Comprando América.
 *
 * Desde el PR 3 del calendario, los eventos ya no viven en este repositorio:
 * se capturan en el CMS (Eventos) y se leen de su API pública,
 * `VITE_CRM_API_URL/api/public/eventos`. Antes estaban escritos aquí a mano, y
 * publicar o corregir una fecha exigía editar código y desplegar.
 *
 * Lo que llega ya viene filtrado por el CMS: solo eventos publicados (o
 * cancelados, marcados), públicos y que no han terminado. La liga de Zoom y los
 * eventos «solo miembros» nunca salen de ahí. Si el CMS no responde, las
 * secciones de eventos se ocultan en vez de mostrar datos viejos.
 *
 * Lo que SÍ se queda aquí es el programa de bloques de la Cumbre, que se
 * mantiene en su página del sitio por ahora.
 *
 * La logística del viaje (aeropuerto, hospedaje, traslados) NO va en el CMS
 * público: se comparte en privado con quien queda aprobado.
 */

import { cmsUrl } from "./cmsUrl";

/** Destinos y URL canónica de la Cumbre, usados por la página y por el
 *  registro del home. */
export const CUMBRE_URL = "/cumbre-digital";
export const CUMBRE_WHATSAPP_GRUPO =
  "https://chat.whatsapp.com/HIeLRj58zBsBweJuPjp2uN";

/** Un bloque del programa de la Cumbre.
 *  Los textos salen del índice detallado de la 2ª edición, reescritos para
 *  público: el documento original es interno —hojas de apoyo para ponentes— y
 *  describe cada bloque por su función comercial, no por lo que el asistente
 *  se lleva. */
export interface BloqueCumbre {
  num: string;
  titulo: string;
  ponente: string;
  resumen: string;
}

export const CUMBRE_BLOQUES: BloqueCumbre[] = [
  {
    num: "01",
    titulo: "Ya tengo el capital, ¿ahora qué?",
    ponente: "Edmundo Treviño",
    resumen:
      "Cómo se mueve el dinero de México a Estados Unidos, en qué orden van activo, estructura, operación y caso migratorio, y el piso mínimo: LLC, ITIN y banca.",
  },
  {
    num: "02",
    titulo: "La primera casa en dólares",
    ponente: "Joe Faraci & Edmundo Treviño",
    resumen:
      "Comprar de contado o a crédito con la LLC, cómo funciona la sección 8, los números de un caso real con escenario de estrés, y quién administra a distancia.",
  },
  {
    num: "03",
    titulo: "Cuando el objetivo es la visa",
    ponente: "Tomás Reséndez & Edmundo Treviño",
    resumen:
      "Qué exige de verdad un caso E-2 o E-1, veredicto giro por giro, por qué un inmueble rentado casi nunca sostiene el caso, y qué pasa con negativas y antecedentes previos.",
  },
  {
    num: "04",
    titulo: "El vehículo que conecta todo",
    ponente: "Edmundo Treviño & Diego Alcalá",
    resumen:
      "Qué incluye y qué no incluye el grupo empresarial, resultados verificables, cómo son las primeras cuatro semanas dentro y para quién no es.",
  },
  {
    num: "05",
    titulo: "Proyectos abiertos para invertir y calificar",
    ponente: "E. Treviño, D. Alcalá & T. Reséndez",
    resumen:
      "Proyectos disponibles con sus números y, en la misma mesa, la validación migratoria de cada uno. Entrar solo o en conjunto, y una E-2 ya resuelta.",
  },
  {
    num: "06",
    titulo: "Consultorio abierto",
    ponente: "T. Reséndez, E. Treviño & D. Alcalá",
    resumen:
      "Preguntas en vivo: dinero y estructura, migración, y dudas sobre los proyectos y las propiedades que se presentaron durante el día.",
  },
];

export interface DiaAgenda {
  fecha: string;
  titulo: string;
}

/** «Ver la transmisión»: la liga pública sale solo dentro de la ventana del evento. */
export interface Transmision {
  /** Solo dentro de la ventana y si el equipo ya la capturó. */
  url: string | null;
  /** Lo que se lee cuando todavía no hay botón. */
  mensaje: string | null;
}

export interface Evento {
  /** El slug del evento en el CMS. */
  id: string;
  /** La clave fija del tipo en el CMS («cumbre», «investment-week»): no
   *  cambia aunque el equipo renombre el tipo. Con ella se reconoce cada uno. */
  clave: string;
  /** Inicio y fin (ISO, UTC) y si es de «todo el día». */
  inicio: string;
  fin: string;
  todoElDia: boolean;
  /** Etiqueta de la tarjeta: modalidad y costo («Online · Gratuito»). */
  tipo: string;
  /** Línea sobre el título: la serie a la que pertenece la edición. */
  kicker?: string;
  titulo: string;
  /** Rango corto para la tarjeta. */
  fecha: string;
  /** Rango con día de la semana, para la ventana del evento. */
  rango?: string;
  lugar: string;
  desc: string;
  /** Ya recortada a cartel (4:5). Vacía si el evento no tiene imagen. */
  imagen: string;
  /** Qué se va a hacer en la edición, en una frase. */
  objetivo?: string;
  /** Para qué existe este evento. */
  porQue?: string;
  agenda?: DiaAgenda[];
  /** Programa de la Cumbre. Cuando está presente, la ventana muestra los
   *  bloques y el formulario de registro en vez de una agenda por días. */
  bloques?: BloqueCumbre[];
  /** Horario, para los eventos en vivo: «6 horas · 10:00 AM Houston / 10:00 AM Ciudad de México». */
  horario?: string;
  /** Presente sólo cuando el evento necesita una página propia. */
  href?: string;
  cta: string;
  cancelado: boolean;
  transmision: Transmision | null;
  /** Ligas de registro y programa capturadas en el CMS. */
  registro?: string;
  programa?: string;
}

/** Lo que manda `GET /api/public/eventos` del CMS (los campos que usa el sitio). */
export interface EventoApi {
  slug: string;
  type: string;
  /** Clave fija del tipo (`evt_event_types.slug` del CMS). */
  typeSlug: string;
  startsAt: string;
  endsAt: string;
  allDay: boolean;
  kicker: string | null;
  title: string;
  summary: string | null;
  objective: string | null;
  why: string | null;
  modalityLabel: string;
  location: string | null;
  platform: string | null;
  priceLabel: string | null;
  imageUrl: string | null;
  registrationUrl: string | null;
  programUrl: string | null;
  cancelled: boolean;
  dateLabel: string;
  rangeLabel: string;
  scheduleLabel: string | null;
  agenda: { date: string; label: string; title: string; description: string | null }[];
  liveStream: { state: string; url: string | null; message: string | null } | null;
}

/** Clave fija (no el nombre) del tipo que lleva el programa de bloques y el
 *  registro de la Cumbre. El nombre visible se puede cambiar en el CMS. */
export const TIPO_CUMBRE = "cumbre";
/** Clave fija del tipo cuyas ediciones muestra la página de Investment Week. */
export const TIPO_INVESTMENT_WEEK = "investment-week";

/* Las tarjetas van en formato cartel (4:5) para poder usar los flyers, que
   vienen verticales. El original pesa megas, así que se pide ya recortado a
   esa proporción, con el recorte anclado a lo importante de la imagen. */
const CARTEL = "c_fill,w_700,h_875,g_auto,q_auto,f_auto";

/** Recorta una imagen de Cloudinary a cartel. Otra liga, o una que ya trae
 *  transformaciones, pasa tal cual. */
export function cartel(url: string | null | undefined): string {
  if (!url) return "";
  const marker = "/image/upload/";
  const i = url.indexOf(marker);
  if (!/^https:\/\/res\.cloudinary\.com\//.test(url) || i < 0) return url;
  const tail = url.slice(i + marker.length);
  if (/^(f_|q_|w_|h_|c_|ar_|g_|e_)/.test(tail)) return url;
  return `${url.slice(0, i + marker.length)}${CARTEL}/${tail}`;
}

/** Un evento del CMS en la forma que dibujan el carrusel, la ventana y las páginas. */
export function aEvento(e: EventoApi): Evento {
  const esCumbre = e.typeSlug === TIPO_CUMBRE;
  const agenda = e.agenda.map((d) => ({ fecha: d.label, titulo: d.title }));
  return {
    id: e.slug,
    clave: e.typeSlug,
    inicio: e.startsAt,
    fin: e.endsAt,
    todoElDia: e.allDay,
    tipo: [e.modalityLabel, e.priceLabel].filter(Boolean).join(" · "),
    kicker: e.kicker ?? undefined,
    titulo: e.title,
    fecha: e.dateLabel,
    rango: e.rangeLabel,
    lugar: e.location || e.platform || "",
    desc: e.summary ?? "",
    imagen: cartel(e.imageUrl),
    objetivo: e.objective ?? undefined,
    porQue: e.why ?? undefined,
    agenda: agenda.length > 0 ? agenda : undefined,
    bloques: esCumbre ? CUMBRE_BLOQUES : undefined,
    horario: e.scheduleLabel ?? undefined,
    cta: esCumbre ? "Ver programa y registrarme" : agenda.length > 0 ? "Ver el programa" : "Ver detalles",
    cancelado: e.cancelled,
    transmision: e.liveStream ? { url: e.liveStream.url, mensaje: e.liveStream.message } : null,
    registro: e.registrationUrl ?? undefined,
    programa: e.programUrl ?? undefined,
  };
}

export async function cargarEventos(): Promise<Evento[]> {
  const res = await fetch(`${cmsUrl()}/api/public/eventos`);
  if (!res.ok) throw new Error(`El CMS respondió ${res.status}`);
  const body = (await res.json()) as { eventos?: EventoApi[] };
  return (body.eventos ?? []).map(aEvento);
}

/** La próxima Cumbre (la página /cumbre-digital toma de aquí fecha, horario y transmisión). */
export function proximaCumbre(eventos: Evento[]): Evento | undefined {
  const cumbres = eventos.filter((e) => e.clave === TIPO_CUMBRE);
  // La que sigue en pie; si todas se cancelaron, la primera, para avisarlo.
  return cumbres.find((e) => !e.cancelado) ?? cumbres[0];
}

/** Las ediciones de Investment Week, que son las que tienen programa. */
export function ediciones(eventos: Evento[]): (Evento & { agenda: DiaAgenda[] })[] {
  return eventos.filter(
    (e): e is Evento & { agenda: DiaAgenda[] } => e.clave === TIPO_INVESTMENT_WEEK && !!e.agenda?.length
  );
}

// ─── Textos que se arman con lo que manda el CMS ─────────────────────────────

const ZONA_CDMX = "America/Mexico_City";

/** «Sábado 14 de noviembre · 10:00 a. m. (hora de Ciudad de México)». Un
 *  evento de «todo el día» lleva solo la fecha. */
export function fechaHoraCdmx(e: Pick<Evento, "inicio" | "todoElDia" | "fecha">): string {
  const inicio = new Date(e.inicio);
  if (Number.isNaN(inicio.getTime())) return e.fecha;
  const partes = new Intl.DateTimeFormat("es-MX", {
    timeZone: ZONA_CDMX, weekday: "long", day: "numeric", month: "long",
  }).formatToParts(inicio);
  const p = (t: string) => partes.find((x) => x.type === t)?.value ?? "";
  const dia = `${p("weekday").charAt(0).toUpperCase()}${p("weekday").slice(1)} ${p("day")} de ${p("month")}`;
  if (e.todoElDia) return dia;
  const h = new Intl.DateTimeFormat("en-US", { timeZone: ZONA_CDMX, hour: "numeric", minute: "2-digit", hour12: true })
    .formatToParts(inicio);
  const q = (t: string) => h.find((x) => x.type === t)?.value ?? "";
  const ampm = q("dayPeriod").toUpperCase() === "PM" ? "p. m." : "a. m.";
  return `${dia} · ${q("hour")}:${q("minute")} ${ampm} (hora de Ciudad de México)`;
}

/** Cuántos días dura un viaje de «todo el día». Null si no aplica. */
export function diasDelEvento(e: Pick<Evento, "inicio" | "fin" | "todoElDia">): number | null {
  if (!e.todoElDia) return null;
  const dias = Math.round((new Date(e.fin).getTime() - new Date(e.inicio).getTime()) / 86_400_000);
  return dias > 0 ? dias : null;
}

/** El mensaje de WhatsApp para aplicar: nombra cada edición con su título y su
 *  fecha, tal como vienen del CMS. */
export function mensajeAplicar(ediciones: Pick<Evento, "titulo" | "fecha">[]): string {
  if (ediciones.length === 0) return "Hola, me interesa aplicar a Investment Week.";
  const lista = ediciones.map((e) => `${e.titulo} (${e.fecha})`).join(" o ");
  return `Hola, me interesa aplicar a ${lista}.`;
}
