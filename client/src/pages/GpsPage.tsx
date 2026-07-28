// Diagnóstico de Inversión — página principal en /diagnostico
import React, { useState, useEffect, useRef } from "react";
import { trpc } from "@/lib/trpc";
import { AnimatePresence, motion } from "framer-motion";
import { sendCtaClick } from "@/lib/tracking";
import { postCrmLead } from "@/lib/crm";
import { trackPageVisit } from "@/lib/journey";

/* ─── Brand ─── */
const NAVY = "#0B1F3A";
const GOLD = "#2563EB";
const GOLD_LIGHT = "#3B82F6";
const NAVY_CARD = "#0F2847";
const NAVY_BORDER = "#1E3A5F";

const LOGO_URL = "https://res.cloudinary.com/dgruohz6f/image/upload/v1773438699/comprando-america/logo.png";

/* ─── CRM public lead ingestion — centralizado en lib/crm ─── */

const PHOTOS = {
  hero: "https://res.cloudinary.com/dkn4ybzog/image/upload/v1749082671/hero-skyline_c7itvs.jpg",
  business: "https://res.cloudinary.com/dkn4ybzog/image/upload/v1749082671/business-meeting_ij8vxs.jpg",
  realEstate: "https://res.cloudinary.com/dkn4ybzog/image/upload/v1749082671/real-estate_nwm2ry.jpg",
  expansion: "https://res.cloudinary.com/dkn4ybzog/image/upload/v1749082671/expansion_pkrqhb.jpg",
  visa: "https://res.cloudinary.com/dkn4ybzog/image/upload/v1749082671/visa-document_bxzl9v.jpg",
};

function usePlayfairFont() {
  useEffect(() => {
    if (document.getElementById("playfair-font-gps")) return;
    const link = document.createElement("link");
    link.id = "playfair-font-gps";
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,900;1,400;1,700&display=swap";
    document.head.appendChild(link);
  }, []);
}

function useIsMobile(bp = 600) {
  const [is, setIs] = useState(() => typeof window !== "undefined" && window.innerWidth < bp);
  useEffect(() => {
    const fn = () => setIs(window.innerWidth < bp);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, [bp]);
  return is;
}

/* ─── Data ─── */
const PERFILES: Record<string, { nombre: string; descripcion: string; vehiculos: string[]; porQueEncaja: string }> = {
  patrimonio: {
    nombre: "PROTECTOR PATRIMONIAL",
    descripcion: "Tu prioridad está enfocada en preservar patrimonio, diversificar riesgos y construir activos en dólares con visión de largo plazo.",
    porQueEncaja: "Tus respuestas indican que buscas protección y crecimiento sostenido. Esta ruta prioriza estructuras legales sólidas y activos con baja volatilidad en dólares dentro de Estados Unidos.",
    vehiculos: ["Fondo de Tierra Estratégica", "Estructura para Invertir en Estados Unidos", "Bienes Raíces", "Grupo Empresarial de Edmundo Treviño"],
  },
  ingresos: {
    nombre: "GENERADOR DE FLUJO",
    descripcion: "Tu enfoque principal es construir una fuente de ingresos constante en dólares con activos que trabajan por ti.",
    porQueEncaja: "Buscas activos que generen flujo mensual sin requerir tu presencia. Esta ruta conecta con vehículos de renta pasiva y gestión profesional en dólares dentro de Estados Unidos.",
    vehiculos: ["Fondo de Tierra Estratégica", "Programa de Vivienda con Renta Respaldada por el Gobierno", "Oportunidades Privadas Curadas", "Grupo Empresarial de Edmundo Treviño"],
  },
  empresa: {
    nombre: "EMPRESARIO EN EXPANSIÓN",
    descripcion: "Tienes una empresa funcionando y quieres llevarla al mercado más grande del mundo con estructura legal y fiscal correcta desde el primer día.",
    porQueEncaja: "Tu perfil indica capacidad operativa y visión de expansión. Esta ruta se diseña para llevar tu empresa a Estados Unidos con estructura sólida y acompañamiento estratégico.",
    vehiculos: ["Americaniza tu Operación", "Estructura para Invertir en Estados Unidos", "Oportunidades Privadas Curadas", "Grupo Empresarial de Edmundo Treviño"],
  },
  familia: {
    nombre: "CONSTRUCTOR DE OPCIONES FAMILIARES",
    descripcion: "Tu inversión está diseñada para abrir puertas a tu familia combinando estrategia migratoria con estructuras patrimoniales en Estados Unidos.",
    porQueEncaja: "Tus respuestas muestran que la familia es el motor. Esta ruta combina opciones de residencia con patrimonio en dólares que beneficia a las generaciones siguientes.",
    vehiculos: ["Grupo Empresarial de Edmundo Treviño", "Estructura para Invertir en Estados Unidos", "Bienes Raíces", "Visa E-2"],
  },
  explorar: {
    nombre: "EXPLORADOR ESTRATÉGICO",
    descripcion: "Sabes que quieres construir algo en Estados Unidos pero aún estás definiendo tu camino. Tu ruta comienza con claridad, no con una inversión.",
    porQueEncaja: "Antes de invertir, el mayor activo es el criterio. Esta ruta te da el mapa completo para tomar decisiones informadas, sin apresurarte ni comprometer capital sin certeza.",
    vehiculos: ["Grupo Empresarial de Edmundo Treviño", "Mapa de Rutas", "Comunidad", "Biblioteca GPS"],
  },
};

const OPCIONES_1 = [
  { id: "patrimonio", label: "Proteger mi patrimonio", sub: "Blindaje legal y fiscal fuera de mi país" },
  { id: "ingresos", label: "Generar ingresos en dólares", sub: "Activos que producen flujo constante" },
  { id: "empresa", label: "Expandir mi empresa", sub: "Llevar mi negocio al mercado norteamericano" },
  { id: "familia", label: "Crear opciones para mi familia", sub: "Migración, educación y futuro" },
  { id: "explorar", label: "Todavía no lo tengo claro", sub: "Quiero explorar mis posibilidades" },
];

// Horizonte: opciones clarificadas (el tiempo en que el dinero permanece invertido)
const SLIDER_POINTS = [
  { label: "1 año", desc: "Corto plazo" },
  { label: "3 años", desc: "Mediano plazo" },
  { label: "5 años", desc: "Largo plazo" },
  { label: "10+ años", desc: "Muy largo plazo" },
];

// Capital: incluye opción < $100k
const OPCIONES_CAPITAL = [
  { id: "menos-100k", label: "Menos de $100k USD", sub: "", info: true },
  { id: "100k-250k", label: "$100k – $250k USD", sub: "" },
  { id: "250k-500k", label: "$250k – $500k USD", sub: "" },
  { id: "500k-1m", label: "$500k – $1M USD", sub: "" },
  { id: "mas-1m", label: "Más de $1M USD", sub: "" },
];

const OPCIONES_PARTICIPACION = [
  { id: "no-operar", label: "No tengo tiempo para operar directamente", sub: "Prefiero delegar y recibir reportes periódicos" },
  { id: "supervisar", label: "Quiero supervisar sin operar", sub: "Decisiones estratégicas, no operativas" },
  { id: "activo", label: "Quiero participar activamente", sub: "Involucrado en cada decisión y proceso" },
  { id: "nosc", label: "Todavía no lo sé", sub: "Quiero orientación para decidir" },
];

const OPCIONES_4 = [
  { id: "flujo", label: "Flujo en dólares", sub: "Ingresos constantes y predecibles" },
  { id: "proteccion", label: "Protección patrimonial", sub: "Blindaje legal y fiscal" },
  { id: "crecimiento", label: "Crecimiento empresarial", sub: "Expansión y escala" },
  { id: "migracion", label: "Estrategia migratoria", sub: "Opciones de residencia" },
  { id: "apreciacion", label: "Apreciación del activo", sub: "Crecimiento de valor a largo plazo" },
  { id: "acceso", label: "Acceso a oportunidades", sub: "Red, comunidad y oportunidades de inversión disponibles" },
];

const CAPITAL_MAP: Record<string, number> = {
  "menos-100k": 0, "100k-250k": 250, "250k-500k": 500, "500k-1m": 750, "mas-1m": 1500,
};
const CAPITAL_LABELS: Record<string, string> = {
  "menos-100k": "Menos de $100k", "100k-250k": "$100k–$250k", "250k-500k": "$250k–$500k", "500k-1m": "$500k–$1M", "mas-1m": "+$1M",
};
const PARTICIPACION_LABELS: Record<string, string> = {
  "no-operar": "Delegar", "supervisar": "Supervisar", "activo": "Activo", "nosc": "Por definir",
};

/* ─── Diagnóstico final — preguntas adicionales de perfilamiento ─── */
const DIAG_OPCIONES = [
  { id: "patrimonio", label: "Proteger mi patrimonio" },
  { id: "invertir", label: "Invertir" },
  { id: "expandir", label: "Expandirme" },
  { id: "familia", label: "Explorar opciones familiares" },
  { id: "nosc", label: "No estoy seguro" },
];
const DIAGNOSTICO_RESPUESTAS: Record<string, string> = {
  patrimonio: "Tu siguiente paso es entender la estructura correcta para tu patrimonio. Recomendamos comenzar con una evaluación de Estructura LLC y Fondo de Tierra Estratégica.",
  invertir: "Tu siguiente paso es explorar Fondo de Tierra Estratégica o Programa de Vivienda con Renta Respaldada por el Gobierno, según tu horizonte y nivel de participación deseado.",
  expandir: "Tu siguiente paso es el programa Americaniza tu Operación. Creamos el puente entre tu empresa actual y el mercado americano en Estados Unidos.",
  familia: "Tu siguiente paso incluye una evaluación de opciones migratorias y las estructuras que benefician directamente a tu familia en Estados Unidos.",
  nosc: "Eso está bien. Tu siguiente paso es un diagnóstico estratégico donde exploramos juntos tus opciones reales en Estados Unidos, sin compromisos.",
};

// Labels de las áreas de interés seleccionables en "Estación 3 · Estructura" — reutilizadas
// en "Tu Ficha GPS Estratégica", el resumen de WhatsApp y el payload de gpsFicha para no re-traducir slugs.
const AREA_LABELS: Record<string, string> = {
  "estructura-legal": "Estructura legal y fiscal",
  "flujo-pasivo": "Flujo pasivo",
  "bienes-raices": "Bienes raíces",
  "expansion-empresa": "Expansión de empresa",
  "visa-residencia": "Visa o residencia",
};

/* ─── Vehicle data ─── */
type VehicleEntry = {
  id: string; nombre: string; frase: string; descripcion: string;
  desde: string; hacia: string; ganas: string[];
  ticketMin: number; ticketLabel: string; horizonte: string;
  participacion: string[]; objetivos: string[]; prioridades: string[];
  href?: string; exclusivo?: boolean;
};

const VEHICLE_DATA: VehicleEntry[] = [
  {
    id: "membresia", nombre: "Grupo Empresarial de Edmundo Treviño", frase: "El ecosistema de confianza para empresarios en Estados Unidos",
    descripcion: "Grupo privado y exclusivo de empresarios e inversionistas comprometidos con construir patrimonio, invertir y crear opciones en Estados Unidos. No es una membresía ni un curso. Es un entorno de confianza donde los miembros acceden a experiencia, relaciones, criterio, comunidad y oportunidades.",
    desde: "Tienes capital o intención de invertir en Estados Unidos, pero no sabes exactamente por dónde empezar ni en quién confiar.",
    hacia: "Formas parte de un grupo de alto nivel que te da contexto, criterio y acceso a oportunidades reales antes de comprometer tu dinero.",
    ganas: ["Claridad sobre qué ruta tiene sentido para tu perfil específico", "Acceso anticipado a proyectos y oportunidades curadas", "Red de empresarios que ya han recorrido el camino en Estados Unidos", "Acompañamiento estratégico para estructurar tu entrada al mercado americano"],
    ticketMin: 10, ticketLabel: "$10k", horizonte: "Inmediato",
    participacion: ["no-operar", "supervisar", "activo", "nosc"],
    objetivos: ["patrimonio", "ingresos", "empresa", "familia", "explorar"],
    prioridades: ["acceso", "flujo", "proteccion", "crecimiento", "migracion", "apreciacion"],
    href: "/circulo-cercano",
  },
  {
    id: "victory-capital", nombre: "Fondo de Tierra Estratégica", frase: "Flujo en dólares, apreciación patrimonial y gestión profesional",
    descripcion: "Vehículo patrimonial diseñado para inversionistas que buscan participar en la adquisición y operación profesional de tierra estratégica productiva en Estados Unidos. Tú aportas capital, un equipo profesional lo gestiona y tú recibes reportes y distribuciones en dólares.",
    desde: "Tu dinero está en tu país, expuesto a devaluación e incertidumbre, sin que trabaje con la eficiencia que podría.",
    hacia: "Tu capital opera dentro del sistema americano, invertido en tierra productiva gestionada por profesionales, generando flujo y apreciación en la moneda más sólida del mundo.",
    ganas: ["Flujo en dólares generado por tierra estratégica productiva", "Apreciación patrimonial de largo plazo en el mercado americano", "Gestión profesional sin necesidad de que operes nada tú mismo", "Diversificación fuera del riesgo económico de tu país de origen"],
    ticketMin: 100, ticketLabel: "$100k+", horizonte: "5-7 años",
    participacion: ["no-operar", "supervisar"],
    objetivos: ["patrimonio", "ingresos", "explorar"],
    prioridades: ["flujo", "apreciacion", "proteccion"],
    href: "/tierra-estrategica",
  },
  {
    id: "section8", nombre: "Programa de Vivienda con Renta Respaldada por el Gobierno", frase: "Flujo inmobiliario respaldado por programas gubernamentales",
    descripcion: "Estrategia patrimonial basada en la adquisición de propiedades residenciales en Estados Unidos que generan ingresos mediante programas gubernamentales de asistencia habitacional. El pago de renta es garantizado por el gobierno federal, eliminando el riesgo de impago o vacante.",
    desde: "Buscas flujo mensual en dólares pero temes las vacantes, los impagos o tener que gestionar propiedades desde otro país.",
    hacia: "Eres dueño de un activo inmobiliario en Estados Unidos que paga renta puntual respaldada por el gobierno federal, mes tras mes, sin depender del inquilino.",
    ganas: ["Flujo mensual en dólares respaldado por el gobierno federal", "Eliminación del riesgo de vacante o impago", "Apreciación del activo a largo plazo en mercados de alta demanda", "Inversión completamente pasiva, sin necesidad de operar ni estar presente"],
    ticketMin: 90, ticketLabel: "$90k+", horizonte: "Largo plazo",
    participacion: ["no-operar", "supervisar"],
    objetivos: ["ingresos", "patrimonio"],
    prioridades: ["flujo", "proteccion", "apreciacion"],
    href: "/renta-garantizada",
  },
  {
    id: "coinversiones", nombre: "Oportunidades Privadas Curadas", frase: "Inversiones, proyectos y activos seleccionados para tu perfil",
    descripcion: "Inversiones, proyectos o activos seleccionados y evaluados por el ecosistema Comprando América que podrían resultar relevantes para determinados perfiles de inversionista. Capital conjunto, criterio compartido, rendimientos distribuidos.",
    desde: "Quieres entrar a proyectos de alto potencial en Estados Unidos pero el ticket individual o la complejidad operativa te limita.",
    hacia: "Co-inviertes en proyectos seleccionados con acceso que normalmente requeriría mucho más capital, reduciendo riesgo y ampliando potencial.",
    ganas: ["Acceso a proyectos que individualmente serían inaccesibles", "Rendimientos en dólares distribuidos entre socios estratégicos", "Proyectos evaluados con criterio por el equipo de Comprando América", "Comunidad de inversionistas con visión de largo plazo en Estados Unidos"],
    ticketMin: 50, ticketLabel: "$50k+", horizonte: "2-4 años",
    participacion: ["supervisar", "activo", "nosc"],
    objetivos: ["ingresos", "patrimonio", "explorar"],
    prioridades: ["flujo", "apreciacion", "acceso"],
    href: "/club-de-inversion-en-estados-unidos", exclusivo: true,
  },
  {
    id: "real-estate", nombre: "Bienes Raíces en Estados Unidos", frase: "Patrimonio tangible en dólares con apreciación histórica",
    descripcion: "Adquisición de propiedades en mercados americanos con alta demanda de renta y apreciación histórica. Patrimonio tangible en dólares, protegido por el sistema legal más sólido del mundo.",
    desde: "Tu patrimonio está concentrado en un solo país, expuesto a inestabilidad política, cambiaria o jurídica.",
    hacia: "Tienes activos inmobiliarios en Estados Unidos: tangibles, en dólares, protegidos legalmente y con potencial de renta y apreciación simultánea.",
    ganas: ["Patrimonio tangible en la economía más grande del mundo", "Protección contra devaluación e inestabilidad en tu país de origen", "Ingreso por renta y apreciación del activo en paralelo", "Legado transferible a las generaciones siguientes"],
    ticketMin: 150, ticketLabel: "$150k+", horizonte: "Largo plazo",
    participacion: ["supervisar", "activo"],
    objetivos: ["patrimonio", "familia", "ingresos"],
    prioridades: ["apreciacion", "proteccion", "flujo"],
    href: "/activos-disponibles",
  },
  {
    id: "estructura-llc", nombre: "Estructura para Invertir en Estados Unidos", frase: "Legal, fiscal, bancaria y patrimonial desde el primer día",
    descripcion: "Diseño y constitución de estructuras jurídicas y fiscales en Estados Unidos —LLC, corporaciones, holdings— para operar, proteger activos y optimizar tu carga tributaria. Base legal de toda inversión seria en el mercado americano.",
    desde: "Operas o inviertes sin una estructura legal en Estados Unidos, lo que te expone a responsabilidad personal, doble tributación y falta de credibilidad ante el sistema americano.",
    hacia: "Tienes una entidad legal americana que te protege, te da acceso a cuentas bancarias, contratos y ventajas fiscales que antes estaban fuera de tu alcance.",
    ganas: ["Protección de activos personales frente a litigios o deudas", "Separación legal entre tú y tus inversiones en Estados Unidos", "Optimización fiscal con estructura correcta desde el inicio", "Credibilidad y acceso al sistema financiero americano"],
    ticketMin: 5, ticketLabel: "$5k", horizonte: "Corto plazo",
    participacion: ["no-operar", "supervisar", "activo", "nosc"],
    objetivos: ["empresa", "familia", "patrimonio", "ingresos"],
    prioridades: ["proteccion", "crecimiento", "migracion"],
    href: "/estructura-de-inversion-en-usa",
  },
  {
    id: "americaniza", nombre: "Americaniza tu Operación", frase: "Lleva tu empresa al mercado más grande del mundo",
    descripcion: "Programa diseñado para empresas latinas que quieren operar en Estados Unidos con estructura legal, fiscal y comercial correcta desde el primer día, con acompañamiento estratégico en cada etapa.",
    desde: "Tu empresa opera bien en tu país pero el mercado americano parece lejano, complejo o reservado para grandes corporaciones.",
    hacia: "Tu empresa tiene presencia, estructura y operación activa en el mercado más grande del mundo, con todos los elementos legales y fiscales en orden.",
    ganas: ["Acceso real al mercado americano con estructura correcta", "Credibilidad frente a clientes, socios y proveedores en Estados Unidos", "Acompañamiento estratégico de quienes ya han recorrido el camino", "Escalabilidad de tu modelo de negocio en dólares"],
    ticketMin: 0, ticketLabel: "Consultar", horizonte: "1-3 años",
    participacion: ["activo", "supervisar"],
    objetivos: ["empresa"],
    prioridades: ["crecimiento", "acceso", "flujo"],
    href: "/expansion-internacional-empresas", exclusivo: true,
  },
  {
    id: "adquisiciones", nombre: "Oportunidades Privadas Curadas · Adquisiciones", frase: "Adquiere una empresa en operación en Estados Unidos",
    descripcion: "Proceso guiado para adquirir una empresa en funcionamiento en Estados Unidos con flujo de caja positivo. Incluye búsqueda, evaluación, estructuración legal y cierre de la operación con acompañamiento experto.",
    desde: "Tienes capital y capacidad para operar un negocio, pero crear uno desde cero en Estados Unidos implica años de esfuerzo sin certeza de retorno.",
    hacia: "Eres dueño de un negocio americano ya probado, con clientes, ingresos y operación establecida desde el primer día.",
    ganas: ["Acceso inmediato a flujo de caja desde el primer día", "Negocio con historial financiero verificable en Estados Unidos", "Proceso estructurado de evaluación para minimizar riesgo", "Propiedad en el mercado más robusto y transparente del mundo"],
    ticketMin: 500, ticketLabel: "$500k+", horizonte: "6-12 meses",
    participacion: ["activo"],
    objetivos: ["empresa"],
    prioridades: ["crecimiento", "flujo"],
    exclusivo: true,
  },
  {
    id: "plan-migratorio", nombre: "Visa E-2 · Residencia por Inversión", frase: "Vive en Estados Unidos a través de tu propia empresa",
    descripcion: "Visa de inversionista que permite residir legalmente en Estados Unidos vinculada a una inversión activa en un negocio americano. La ruta más directa y controlable hacia la residencia desde tu empresa.",
    desde: "Quieres vivir o tener presencia legal en Estados Unidos, pero las opciones de migración convencionales son lentas, inciertas o no aplican a tu perfil.",
    hacia: "Tú y tu familia tienen estatus legal en Estados Unidos, respaldado por una inversión activa y una empresa que genera valor en el mercado americano.",
    ganas: ["Residencia legal en Estados Unidos para ti y tu familia", "Autorización de trabajo vinculada a tu propia empresa", "Acceso al sistema de salud, educación y movilidad del país", "Una ruta migratoria bajo tu control, no a la espera de sorteos o loterías"],
    ticketMin: 0, ticketLabel: "Consultar", horizonte: "1-2 años",
    participacion: ["no-operar", "supervisar", "activo", "nosc"],
    objetivos: ["familia"],
    prioridades: ["migracion", "proteccion"],
    href: "/visa-e2-inversionista-usa", exclusivo: true,
  },
];

function rankVehicles(params: { objetivo: string; participacion: string; capital: string; prioridades: string[] }) {
  const userCapital = CAPITAL_MAP[params.capital] ?? 0;
  return VEHICLE_DATA
    .filter(v => v.id !== "membresia")
    .map(v => {
    let score = 0;
    if (v.objetivos.includes(params.objetivo)) score += 30;
    if (v.ticketMin === 0 || userCapital >= v.ticketMin) score += 25;
    if (v.participacion.includes(params.participacion)) score += 20;
    const prioMatches = params.prioridades.filter(p => v.prioridades.includes(p)).length;
    score += prioMatches * 12;
    return { ...v, score, pct: Math.min(99, score) };
  }).sort((a, b) => b.score - a.score);
}

/* ─── Icons ─── */
function IconRight({ color = GOLD }: { color?: string }) {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>;
}
function IconArrowLeft({ color = GOLD }: { color?: string }) {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>;
}
function IconCheck({ color = NAVY, size = 14 }: { color?: string; size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>;
}
function IconX({ color = "#6A8FAF" }: { color?: string }) {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>;
}
function IconCalendar({ color = NAVY }: { color?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}
function IconCompass({ color = GOLD }: { color?: string }) {
  return <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" /></svg>;
}
function IconPlay({ color = GOLD }: { color?: string }) {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill={color} stroke="none"><polygon points="5 3 19 12 5 21 5 3" /></svg>;
}
function IconBook({ color = GOLD }: { color?: string }) {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>;
}
function IconMic({ color = GOLD }: { color?: string }) {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" y1="19" x2="12" y2="23" /></svg>;
}
function IconBarChart({ color = GOLD }: { color?: string }) {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>;
}
function IconUser({ color = GOLD }: { color?: string }) {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>;
}
function IconPhone({ color = GOLD }: { color?: string }) {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.86 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.77 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.16 6.16l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" /></svg>;
}
function IconMail({ color = GOLD }: { color?: string }) {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>;
}
function IconShield({ color = GOLD }: { color?: string }) {
  return <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>;
}
function IconDollar({ color = GOLD }: { color?: string }) {
  return <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>;
}
function IconBuilding({ color = GOLD }: { color?: string }) {
  return <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>;
}
function IconFamily({ color = GOLD }: { color?: string }) {
  return <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>;
}
function IconSearch({ color = GOLD }: { color?: string }) {
  return <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>;
}

const ICON_MAP: Record<string, () => JSX.Element> = {
  patrimonio: () => <IconShield />,
  ingresos: () => <IconDollar />,
  empresa: () => <IconBuilding />,
  familia: () => <IconFamily />,
  explorar: () => <IconSearch />,
};

/* ─── Film grain ─── */
function FilmGrain() {
  return (
    <svg style={{ position: "fixed", inset: 0, width: "100%", height: "100%", zIndex: 1000, pointerEvents: "none", opacity: 0.025 }} aria-hidden="true">
      <filter id="gps-grain"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="4" stitchTiles="stitch" /></filter>
      <rect width="100%" height="100%" filter="url(#gps-grain)" />
    </svg>
  );
}

/* ─── Background photo ─── */
function CinematicPhotoBg({ src, intensity = 0.1 }: { src: string; intensity?: number }) {
  return (
    <>
      <img src={src} aria-hidden="true" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", opacity: intensity, zIndex: 0 }} />
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, ${NAVY}D0 0%, ${NAVY}80 50%, ${NAVY}E0 100%)`, zIndex: 0 }} />
    </>
  );
}

/* ─── Transition sound ─── */
function useTransitionSound() {
  const ctxRef = useRef<AudioContext | null>(null);
  const [enabled, setEnabled] = useState(true);
  function getCtx() {
    if (!ctxRef.current) ctxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    return ctxRef.current;
  }
  function beep(freq: number, dur: number, vol = 0.09, delay = 0) {
    try {
      const ctx = getCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.frequency.value = freq; osc.type = "sine";
      gain.gain.setValueAtTime(0, ctx.currentTime + delay);
      gain.gain.linearRampToValueAtTime(vol, ctx.currentTime + delay + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + dur);
      osc.start(ctx.currentTime + delay);
      osc.stop(ctx.currentTime + delay + dur + 0.01);
    } catch {}
  }
  function playForward() { if (!enabled) return; beep(880, 0.055, 0.09); beep(1100, 0.045, 0.07, 0.058); }
  function playBack() { if (!enabled) return; beep(660, 0.055, 0.08); beep(550, 0.045, 0.06, 0.058); }
  return { enabled, setEnabled, playForward, playBack };
}

/* ─── Sound toggle ─── */
function SoundToggle({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
  return (
    <button onClick={onToggle} title={enabled ? "Silenciar" : "Activar sonido"}
      style={{ position: "fixed", bottom: "28px", left: "24px", zIndex: 100, width: "44px", height: "44px", borderRadius: "50%", border: `1px solid ${enabled ? GOLD + "90" : NAVY_BORDER + "80"}`, background: enabled ? `${GOLD}18` : `${NAVY_CARD}CC`, backdropFilter: "blur(10px)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: enabled ? GOLD : "#4A6580", fontSize: "18px", transition: "all 0.25s", boxShadow: enabled ? `0 0 12px ${GOLD}30` : "none" }}>
      {enabled ? "♪" : "♪"}
      {!enabled && (
        <span style={{ position: "absolute", width: "28px", height: "1.5px", background: "#4A6580", borderRadius: "1px", transform: "rotate(-45deg)" }} />
      )}
    </button>
  );
}

/* ─── Top bar ─── */
function FlowTopBar({ screen, totalScreens, onBack }: { screen: number; totalScreens: number; onBack: () => void }) {
  const canGoBack = screen >= 2 && screen !== 6;
  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 80, padding: "14px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", background: `linear-gradient(to bottom, ${NAVY}E8 0%, ${NAVY}A0 70%, transparent 100%)`, pointerEvents: "none" }}>
      <a href="https://www.comprandoamerica.com" style={{ display: "flex", alignItems: "center", pointerEvents: "auto", textDecoration: "none" }}>
        <img src={LOGO_URL} alt="Comprando América" style={{ height: "32px", width: "auto", objectFit: "contain" }} />
      </a>
      {/* Step counter + back */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", pointerEvents: "auto" }}>
        {screen > 1 && screen <= 5 && (
          <span style={{ fontFamily: "'Inter',sans-serif", fontSize: "11px", fontWeight: 600, color: "#4A6580" }}>Paso {screen - 1} de 5</span>
        )}
        {canGoBack && (
          <button onClick={onBack} style={{ display: "flex", alignItems: "center", gap: "6px", background: `${NAVY_CARD}CC`, backdropFilter: "blur(8px)", border: `1px solid ${NAVY_BORDER}`, borderRadius: "20px", padding: "7px 14px", cursor: "pointer", color: "#8FA5C0", fontFamily: "'Inter',sans-serif", fontSize: "12px", fontWeight: 600, letterSpacing: "0.04em", transition: "all 0.2s" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = GOLD; (e.currentTarget as HTMLElement).style.borderColor = GOLD; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "#8FA5C0"; (e.currentTarget as HTMLElement).style.borderColor = NAVY_BORDER; }}>
            <IconArrowLeft color="currentColor" /> Volver
          </button>
        )}
      </div>
    </div>
  );
}

/* ─── Progress bar ─── */
function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div style={{ marginBottom: "32px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
        {Array.from({ length: total }, (_, i) => (
          <div key={i} style={{ height: "3px", flex: 1, borderRadius: "2px", background: i < current ? `linear-gradient(90deg,${GOLD},${GOLD_LIGHT})` : NAVY_BORDER, transition: "background 0.4s" }} />
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span style={{ fontFamily: "'Inter',sans-serif", fontSize: "11px", color: GOLD, fontWeight: 600 }}>Paso {current} de {total}</span>
        <span style={{ fontFamily: "'Inter',sans-serif", fontSize: "11px", color: "#4A6580" }}>~{Math.max(1, total - current + 1)} min restante{total - current !== 0 ? "s" : ""}</span>
      </div>
    </div>
  );
}

/* ─── GoldBtn ─── */
function GoldBtn({ children, onClick, style, disabled }: { children: React.ReactNode; onClick?: () => void; style?: React.CSSProperties; disabled?: boolean }) {
  return (
    <button onClick={onClick} disabled={disabled}
      style={{ padding: "15px 28px", background: disabled ? NAVY_BORDER : `linear-gradient(90deg,${GOLD},${GOLD_LIGHT})`, color: disabled ? "#4A6580" : NAVY, fontFamily: "'Inter',sans-serif", fontSize: "14px", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", border: "none", borderRadius: "10px", cursor: disabled ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", transition: "opacity 0.2s", ...style }}>
      {children}
    </button>
  );
}

/* ─── Journey strip ─── */
function JourneyStrip({ screen, objetivo, participacion, horizonte, capital }: { screen: number; objetivo: string | null; participacion: string | null; horizonte: string | null; capital: string | null }) {
  if (screen < 2 || screen > 7) return null;
  const crumbs = [
    objetivo ? OPCIONES_1.find(o => o.id === objetivo)?.label : null,
    participacion ? PARTICIPACION_LABELS[participacion] : null,
    horizonte ?? null,
    capital ? CAPITAL_LABELS[capital] : null,
  ].filter(Boolean) as string[];
  if (!crumbs.length) return null;
  return (
    <motion.div initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 60, opacity: 0 }}
      style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 90, pointerEvents: "none" }}>
      <div style={{ background: `linear-gradient(to top, ${NAVY}FA 0%, ${NAVY}CC 65%, transparent 100%)`, padding: "28px 16px 14px", display: "flex", justifyContent: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap", justifyContent: "center" }}>
          <span style={{ fontFamily: "'Inter',sans-serif", fontSize: "10px", fontWeight: 700, letterSpacing: "0.15em", color: `${GOLD}70`, textTransform: "uppercase", marginRight: "4px" }}>Tu ruta</span>
          {crumbs.map((c, i) => (
            <React.Fragment key={i}>
              <span style={{ color: `${GOLD}40`, fontSize: "11px" }}>›</span>
              <span style={{ fontFamily: "'Inter',sans-serif", fontSize: "11px", fontWeight: 500, color: "#8FA5C0", background: `${NAVY_CARD}CC`, border: `1px solid ${NAVY_BORDER}`, borderRadius: "20px", padding: "3px 10px" }}>{c}</span>
            </React.Fragment>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ─── SCREEN 1 — Objetivo ─── */
function Screen1({ onSelect, preQualified }: { onSelect: (id: string) => void; preQualified?: boolean }) {
  const [hovered, setHovered] = useState<string | null>(null);
  return (
    <div style={{ position: "relative", width: "100%", minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", background: NAVY }}>
      <img src={PHOTOS.hero} aria-hidden="true" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 30%", opacity: 0.28, zIndex: 0 }} />
      <div style={{ position: "absolute", inset: 0, zIndex: 1, background: `linear-gradient(180deg, ${NAVY}D0 0%, ${NAVY}80 40%, ${NAVY}A0 70%, ${NAVY}F0 100%)` }} />
      <div style={{ position: "absolute", inset: 0, zIndex: 2, background: `radial-gradient(ellipse at 50% 50%, transparent 40%, ${NAVY}C0 100%)` }} />
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "180px", zIndex: 2, background: `linear-gradient(to bottom, ${NAVY} 0%, transparent 100%)` }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "220px", zIndex: 2, background: `linear-gradient(to top, ${NAVY} 0%, transparent 100%)` }} />
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "52px", background: "#000", zIndex: 3, opacity: 0.55 }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "52px", background: "#000", zIndex: 3, opacity: 0.55 }} />

      <div style={{ position: "relative", zIndex: 5, width: "100%", maxWidth: "960px", padding: "clamp(72px,10dvh,96px) 20px clamp(60px,8dvh,80px)", textAlign: "center" }}>
        <div style={{ marginBottom: "32px", display: "flex", justifyContent: "center", alignItems: "center", gap: "16px" }}>
          <div style={{ width: "60px", height: "1px", background: `linear-gradient(90deg, transparent, ${GOLD}90)` }} />
          <span style={{ fontFamily: "'Inter',sans-serif", fontSize: "9px", fontWeight: 700, letterSpacing: "0.38em", color: `${GOLD}A0`, textTransform: "uppercase" }}>GPS Estratégico · Comprando América</span>
          <div style={{ width: "60px", height: "1px", background: `linear-gradient(90deg, ${GOLD}90, transparent)` }} />
        </div>

        {/* Reconocimiento cuando el usuario ya viene calificado desde el diagnóstico de LLC */}
        {preQualified && (
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: `${GOLD}18`, border: `1px solid ${GOLD}55`, borderRadius: "20px", padding: "6px 16px", marginBottom: "14px" }}>
            <span style={{ fontFamily: "'Inter',sans-serif", fontSize: "12px", color: GOLD_LIGHT }}>
              Vienes de tu diagnóstico de estructura · ya sabemos que buscas invertir
            </span>
          </div>
        )}

        {/* Duration indicator */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: `${NAVY_CARD}CC`, border: `1px solid ${NAVY_BORDER}`, borderRadius: "20px", padding: "6px 16px", marginBottom: "24px" }}>
          <span style={{ fontFamily: "'Inter',sans-serif", fontSize: "12px", color: "#6A8FAF" }}>
            {preQualified ? "Ahora definamos tu vehículo de inversión" : "5 preguntas · Menos de 2 minutos"}
          </span>
        </div>

        <h1 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: "clamp(28px,4.8vw,58px)", fontWeight: 700, color: "#fff", lineHeight: 1.15, marginBottom: "18px", textShadow: "0 4px 32px rgba(0,0,0,0.6)" }}>
          ¿Qué estás tratando de construir<br />
          <em style={{ color: GOLD_LIGHT, fontStyle: "italic" }}>en Estados Unidos?</em>
        </h1>
        <p style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: "clamp(15px,2vw,19px)", fontStyle: "italic", color: `${GOLD_LIGHT}BB`, marginBottom: "12px", lineHeight: 1.7, maxWidth: "520px", margin: "0 auto 24px" }}>
          "No necesitas más oportunidades.<br />Necesitas saber cuál tiene sentido para ti."
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,220px),1fr))", gap: "12px", textAlign: "left", marginTop: "36px" }}>
          {OPCIONES_1.map((op) => {
            const isH = hovered === op.id;
            return (
              <button key={op.id} onClick={() => onSelect(op.id)} onMouseEnter={() => setHovered(op.id)} onMouseLeave={() => setHovered(null)}
                style={{ background: isH ? `linear-gradient(135deg,rgba(26,53,88,0.95),rgba(18,38,68,0.98))` : `rgba(17,34,64,0.75)`, backdropFilter: "blur(16px)", border: `1px solid ${isH ? GOLD : "rgba(30,58,95,0.8)"}`, borderRadius: "12px", padding: "22px 18px", cursor: "pointer", transition: "all 0.3s", transform: isH ? "translateY(-4px)" : "none", boxShadow: isH ? `0 16px 40px rgba(0,0,0,0.4), 0 0 0 1px ${GOLD}20` : "0 4px 16px rgba(0,0,0,0.3)", display: "flex", flexDirection: "column", gap: "10px" }}>
                <div style={{ color: isH ? GOLD_LIGHT : GOLD }}>{(ICON_MAP[op.id] || (() => <IconCompass />))()}</div>
                <div>
                  <div style={{ fontFamily: "'Inter',sans-serif", fontSize: "15px", fontWeight: 600, color: isH ? "#fff" : "#E8ECF1", marginBottom: "4px" }}>{op.label}</div>
                  <div style={{ fontFamily: "'Inter',sans-serif", fontSize: "12px", color: "#6A8FAF", lineHeight: 1.5 }}>{op.sub}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ─── SCREEN 2 — Participación ─── */
function Screen2({ onNext }: { onNext: (id: string) => void }) {
  const [sel, setSel] = useState<string | null>(null);
  return (
    <div style={{ position: "relative", minHeight: "100dvh", background: NAVY, display: "flex", alignItems: "center", justifyContent: "center", padding: "88px 24px 120px", overflow: "hidden" }}>
      <CinematicPhotoBg src={PHOTOS.business} intensity={0.08} />
      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: "600px" }}>
        <StepIndicator current={1} total={5} />
        <p style={{ fontFamily: "'Inter',sans-serif", fontSize: "13px", fontWeight: 600, letterSpacing: "0.2em", color: GOLD, textTransform: "uppercase", marginBottom: "12px" }}>Entendido.</p>
        <h2 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: "clamp(22px,3.5vw,36px)", fontWeight: 700, color: "#fff", marginBottom: "12px", lineHeight: 1.25 }}>
          ¿Qué tan involucrado deseas estar?
        </h2>
        <p style={{ fontFamily: "'Inter',sans-serif", fontSize: "14px", color: "#6A8FAF", marginBottom: "36px", lineHeight: 1.7 }}>
          Tu nivel de participación define qué vehículos son reales para ti. No hay respuesta incorrecta — solo respuestas honestas.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "36px" }}>
          {OPCIONES_PARTICIPACION.map((op) => {
            const isSel = sel === op.id;
            return (
              <button key={op.id} onClick={() => setSel(op.id)}
                style={{ background: isSel ? `linear-gradient(135deg,#1A3558,#122644)` : NAVY_CARD, border: `2px solid ${isSel ? GOLD : NAVY_BORDER}`, borderRadius: "12px", padding: "18px 22px", cursor: "pointer", display: "flex", alignItems: "center", gap: "14px", transition: "all 0.2s", textAlign: "left" }}>
                <div style={{ width: "20px", height: "20px", borderRadius: "50%", border: `2px solid ${isSel ? GOLD : NAVY_BORDER}`, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: isSel ? GOLD : "transparent", transition: "all 0.2s" }}>
                  {isSel && <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: NAVY }} />}
                </div>
                <div>
                  <div style={{ fontFamily: "'Inter',sans-serif", fontSize: "14px", fontWeight: 600, color: isSel ? "#fff" : "#C8D6E8" }}>{op.label}</div>
                  <div style={{ fontFamily: "'Inter',sans-serif", fontSize: "12px", color: "#6A8FAF", marginTop: "2px" }}>{op.sub}</div>
                </div>
              </button>
            );
          })}
        </div>
        <GoldBtn onClick={() => sel && onNext(sel)} disabled={!sel} style={{ width: "100%" }}>
          Continuar <IconRight color={sel ? NAVY : "#4A6580"} />
        </GoldBtn>
      </div>
    </div>
  );
}

/* ─── SCREEN 3 — Horizonte (clarificado) ─── */
function Screen3({ onNext }: { onNext: (v: string) => void }) {
  const [sel, setSel] = useState<number | null>(null);
  const [touched, setTouched] = useState(false);
  return (
    <div style={{ position: "relative", minHeight: "100dvh", background: NAVY, display: "flex", alignItems: "center", justifyContent: "center", padding: "88px 24px 120px", overflow: "hidden" }}>
      <CinematicPhotoBg src={PHOTOS.realEstate} intensity={0.09} />
      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: "600px" }}>
        <StepIndicator current={2} total={5} />
        <h2 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: "clamp(22px,3.5vw,36px)", fontWeight: 700, color: "#fff", marginBottom: "12px" }}>
          ¿Cuánto tiempo planeas mantener tu dinero invertido?
        </h2>
        <p style={{ fontFamily: "'Inter',sans-serif", fontSize: "14px", color: "#6A8FAF", marginBottom: "12px", lineHeight: 1.7 }}>
          El <strong style={{ color: "#8FA5C0" }}>horizonte de inversión</strong> es el tiempo que tu capital permanecerá comprometido antes de que puedas recuperarlo. Cuanto más largo, mayores pueden ser los rendimientos.
        </p>
        <p style={{ fontFamily: "'Inter',sans-serif", fontSize: "12px", color: "#4A6580", marginBottom: "48px", lineHeight: 1.6 }}>
          Ejemplo: si eliges 5 años, significa que no necesitarás ese dinero disponible antes de esa fecha.
        </p>

        {/* Slider */}
        <div style={{ position: "relative", paddingBottom: "50px" }}>
          <div style={{ height: "4px", background: NAVY_BORDER, borderRadius: "2px", margin: "0 18px" }}>
            <div style={{ position: "absolute", left: "18px", top: 0, height: "4px", borderRadius: "2px", background: `linear-gradient(90deg,${GOLD},${GOLD_LIGHT})`, width: `${sel !== null ? (sel / (SLIDER_POINTS.length - 1)) * 100 : 0}%`, transition: "width 0.3s" }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", position: "absolute", top: "-13px", left: "18px", right: "18px" }}>
            {SLIDER_POINTS.map((_, i) => (
              <button key={i} onClick={() => { setSel(i); setTouched(true); }}
                style={{ width: "28px", height: "28px", borderRadius: "50%", border: `2px solid ${sel !== null && i <= sel ? GOLD : NAVY_BORDER}`, background: i === sel ? GOLD : sel !== null && i < sel ? "#1A3558" : NAVY_CARD, cursor: "pointer", transition: "all 0.25s", transform: i === sel ? "scale(1.3)" : "scale(1)", boxShadow: i === sel ? `0 0 16px ${GOLD}60` : "none", padding: 0 }} />
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "26px", padding: "0 4px" }}>
            {SLIDER_POINTS.map((p, i) => (
              <div key={i} style={{ textAlign: "center", minWidth: "56px" }}>
                <span style={{ fontFamily: "'Inter',sans-serif", fontSize: "12px", fontWeight: i === sel ? 700 : 400, color: i === sel ? GOLD : "#4A6580", display: "block" }}>{p.label}</span>
                <span style={{ fontFamily: "'Inter',sans-serif", fontSize: "10px", color: "#3A5570", display: "block" }}>{p.desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Selected value display */}
        <div style={{ textAlign: "center", marginBottom: "48px", padding: "20px", background: `${GOLD}10`, border: `1px solid ${GOLD}30`, borderRadius: "12px" }}>
          <span style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: "42px", fontWeight: 700, color: GOLD }}>{sel !== null ? SLIDER_POINTS[sel].label : "Desliza para elegir"}</span>
          <p style={{ fontFamily: "'Inter',sans-serif", fontSize: "13px", color: "#6A8FAF", marginTop: "6px", margin: "6px 0 0" }}>Tu capital permanecerá invertido aproximadamente este tiempo</p>
        </div>

        <GoldBtn onClick={() => { if (touched && sel !== null) onNext(SLIDER_POINTS[sel].label); }} disabled={!touched} style={{ width: "100%", opacity: touched ? 1 : 0.5 }}>
          Continuar <IconRight color={NAVY} />
        </GoldBtn>
      </div>
    </div>
  );
}

/* ─── SCREEN 4 — Capital ─── */
function Screen4Capital({ onNext }: { onNext: (id: string) => void }) {
  const [sel, setSel] = useState<string | null>(null);
  return (
    <div style={{ position: "relative", minHeight: "100dvh", background: NAVY, display: "flex", alignItems: "center", justifyContent: "center", padding: "88px 24px 120px", overflow: "hidden" }}>
      <CinematicPhotoBg src={PHOTOS.expansion} intensity={0.08} />
      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: "600px" }}>
        <StepIndicator current={3} total={5} />
        <h2 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: "clamp(22px,3.5vw,36px)", fontWeight: 700, color: "#fff", marginBottom: "10px", lineHeight: 1.25 }}>
          ¿Qué rango de inversión te sentirías cómodo evaluar hoy?
        </h2>
        <p style={{ fontFamily: "'Inter',sans-serif", fontSize: "14px", color: "#6A8FAF", marginBottom: "36px", lineHeight: 1.7 }}>
          El capital disponible no define si calificas. Nos ayuda a evitar recomendar oportunidades que no hagan sentido para tu estrategia.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "36px" }}>
          {OPCIONES_CAPITAL.map((op) => {
            const isSel = sel === op.id;
            return (
              <button key={op.id} onClick={() => setSel(op.id)}
                style={{ background: isSel ? `linear-gradient(135deg,#1A3558,#122644)` : NAVY_CARD, border: `2px solid ${isSel ? GOLD : op.info ? `${NAVY_BORDER}` : NAVY_BORDER}`, borderRadius: "12px", padding: "16px 22px", cursor: "pointer", display: "flex", alignItems: "center", gap: "16px", transition: "all 0.2s", textAlign: "left" }}>
                <div style={{ width: "20px", height: "20px", borderRadius: "50%", border: `2px solid ${isSel ? GOLD : NAVY_BORDER}`, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: isSel ? GOLD : "transparent" }}>
                  {isSel && <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: NAVY }} />}
                </div>
                <div style={{ flex: 1 }}>
                  <span style={{ fontFamily: "'Inter',sans-serif", fontSize: "15px", fontWeight: 600, color: isSel ? "#fff" : "#C8D6E8" }}>{op.label}</span>
                </div>
                {isSel && (
                  <div style={{ width: "22px", height: "22px", borderRadius: "50%", background: GOLD, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <IconCheck color={NAVY} size={13} />
                  </div>
                )}
              </button>
            );
          })}
        </div>
        <GoldBtn onClick={() => sel && onNext(sel)} disabled={!sel} style={{ width: "100%" }}>
          Continuar <IconRight color={sel ? NAVY : "#4A6580"} />
        </GoldBtn>
      </div>
    </div>
  );
}

/* ─── SCREEN 5 — Prioridades ─── */
function Screen5Priorities({ onNext }: { onNext: (ids: string[]) => void }) {
  const [sel, setSel] = useState<string[]>([]);
  const [shaking, setShaking] = useState(false);
  function toggle(id: string) {
    if (sel.includes(id)) { setSel(sel.filter(s => s !== id)); return; }
    if (sel.length >= 2) { setShaking(true); setTimeout(() => setShaking(false), 500); return; }
    setSel([...sel, id]);
  }
  return (
    <div style={{ position: "relative", minHeight: "100dvh", background: NAVY, display: "flex", alignItems: "center", justifyContent: "center", padding: "88px 24px 120px", overflow: "hidden" }}>
      <CinematicPhotoBg src={PHOTOS.visa} intensity={0.08} />
      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: "600px" }}>
        <StepIndicator current={4} total={5} />
        <h2 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: "clamp(22px,3.5vw,36px)", fontWeight: 700, color: "#fff", marginBottom: "10px" }}>
          ¿Qué pesa más en tu decisión?
        </h2>
        <p style={{ fontFamily: "'Inter',sans-serif", fontSize: "14px", color: "#6A8FAF", marginBottom: "8px", lineHeight: 1.7 }}>
          Cada inversionista tiene una brújula diferente. ¿Qué es lo que más importa en este momento de tu vida?
        </p>
        <p style={{ fontFamily: "'Inter',sans-serif", fontSize: "13px", color: "#4A6580", marginBottom: "28px" }}>
          Selecciona hasta <strong style={{ color: GOLD }}>2 opciones</strong>
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "10px", marginBottom: "36px" }}>
          {OPCIONES_4.map((op) => {
            const isSel = sel.includes(op.id);
            const isOther = !isSel && sel.length >= 2;
            return (
              <motion.button key={op.id} onClick={() => toggle(op.id)}
                animate={isOther && shaking ? { x: [0, -5, 5, -4, 4, 0] } : { x: 0 }}
                transition={{ duration: 0.4 }}
                style={{ background: isSel ? `linear-gradient(135deg,#1A3558,#0F2847)` : NAVY_CARD, border: `2px solid ${isSel ? GOLD : NAVY_BORDER}`, borderRadius: "12px", padding: "18px 14px", cursor: "pointer", textAlign: "left", opacity: isOther ? 0.45 : 1, transition: "border-color 0.2s,background 0.2s" }}>
                {isSel && (
                  <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "6px" }}>
                    <div style={{ width: "18px", height: "18px", borderRadius: "50%", background: GOLD, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <IconCheck color={NAVY} size={12} />
                    </div>
                  </div>
                )}
                <div style={{ fontFamily: "'Inter',sans-serif", fontSize: "13px", fontWeight: 600, color: isSel ? "#fff" : "#C8D6E8", marginBottom: "3px" }}>{op.label}</div>
                <div style={{ fontFamily: "'Inter',sans-serif", fontSize: "11px", color: "#4A6580" }}>{op.sub}</div>
              </motion.button>
            );
          })}
        </div>
        <GoldBtn onClick={() => sel.length > 0 && onNext(sel)} disabled={sel.length === 0} style={{ width: "100%" }}>
          Ver mi ruta estratégica <IconRight color={sel.length > 0 ? NAVY : "#4A6580"} />
        </GoldBtn>
      </div>
    </div>
  );
}

/* ─── SCREEN 6 — Loading con mensajes rotativos ─── */
const LOADING_MESSAGES = [
  "Analizando tus respuestas...",
  "Comparando las rutas disponibles...",
  "Evaluando tu perfil de inversionista...",
  "Preparando tu recomendación...",
  "Ajustando vehículos a tu capital...",
];
function Screen6Loading({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);
  const [msgIdx, setMsgIdx] = useState(0);

  useEffect(() => {
    const iv = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { clearInterval(iv); setTimeout(onDone, 300); return 100; }
        return p + 2.5;
      });
    }, 62);
    return () => clearInterval(iv);
  }, [onDone]);

  useEffect(() => {
    const mv = setInterval(() => {
      setMsgIdx(i => (i + 1) % LOADING_MESSAGES.length);
    }, 1200);
    return () => clearInterval(mv);
  }, []);

  return (
    <div style={{ minHeight: "100dvh", background: NAVY, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", padding: "40px 24px" }}>
      <div style={{ position: "relative", width: "112px", height: "112px", marginBottom: "48px" }}>
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "2px solid transparent", borderTopColor: GOLD, borderRightColor: GOLD }} />
        <motion.div animate={{ rotate: -360 }} transition={{ duration: 4.5, repeat: Infinity, ease: "linear" }}
          style={{ position: "absolute", inset: "14px", borderRadius: "50%", border: "1px solid transparent", borderTopColor: GOLD_LIGHT, opacity: 0.5 }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <IconCompass color={GOLD} />
        </div>
      </div>
      <h2 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: "clamp(20px,3vw,30px)", fontWeight: 600, color: "#fff", textAlign: "center", marginBottom: "12px" }}>
        Construyendo tu Ruta Estratégica...
      </h2>
      <AnimatePresence mode="wait">
        <motion.p key={msgIdx} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.35 }}
          style={{ fontFamily: "'Inter',sans-serif", fontSize: "14px", color: "#6A8FAF", marginBottom: "44px", textAlign: "center", height: "24px" }}>
          {LOADING_MESSAGES[msgIdx]}
        </motion.p>
      </AnimatePresence>
      <div style={{ width: "100%", maxWidth: "340px", height: "4px", background: NAVY_BORDER, borderRadius: "2px", overflow: "hidden" }}>
        <motion.div style={{ height: "100%", background: `linear-gradient(90deg,${GOLD},${GOLD_LIGHT})`, borderRadius: "2px" }} animate={{ width: `${progress}%` }} transition={{ ease: "easeOut" }} />
      </div>
      <div style={{ marginTop: "14px", fontFamily: "'Inter',sans-serif", fontSize: "13px", color: GOLD, fontWeight: 600 }}>{Math.round(progress)}%</div>
    </div>
  );
}

/* ─── SCREEN 7 — Route Preview (antes del formulario) ─── */
function Screen7Preview({ perfil, rankedVehicles, objetivo, capital, onContinue }: {
  perfil: (typeof PERFILES)[string];
  rankedVehicles: (VehicleEntry & { score: number; pct: number })[];
  objetivo: string | null;
  capital: string | null;
  onContinue: () => void;
}) {
  const top3 = rankedVehicles.slice(0, 3);
  const capitalLabel = CAPITAL_LABELS[capital ?? ""] ?? "";
  const isLowCapital = capital === "menos-100k";

  return (
    <div style={{ minHeight: "100dvh", background: NAVY, display: "flex", alignItems: "center", justifyContent: "center", padding: "88px 24px 120px" }}>
      <div style={{ width: "100%", maxWidth: "560px" }}>

        {/* Profile name */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
          <div style={{ width: "28px", height: "1px", background: GOLD }} />
          <span style={{ fontFamily: "'Inter',sans-serif", fontSize: "9px", fontWeight: 700, letterSpacing: "0.35em", color: GOLD, textTransform: "uppercase" }}>Tu perfil GPS</span>
        </div>
        <h1 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: "clamp(28px,5vw,52px)", fontWeight: 900, color: "#fff", lineHeight: 1.1, marginBottom: "12px" }}>
          {perfil.nombre}
        </h1>
        <p style={{ fontFamily: "'Inter',sans-serif", fontSize: "14px", color: "#6A8FAF", lineHeight: 1.75, marginBottom: "28px" }}>
          {perfil.porQueEncaja}
        </p>

        {/* Low capital notice */}
        {isLowCapital && (
          <div style={{ background: `${GOLD}10`, border: `1px solid ${GOLD}40`, borderRadius: "10px", padding: "14px 16px", marginBottom: "24px" }}>
            <p style={{ fontFamily: "'Inter',sans-serif", fontSize: "13px", color: `${GOLD}CC`, lineHeight: 1.65, margin: 0 }}>
              <strong>Tu próximo paso es la claridad, no la inversión.</strong> Con menos de $100k, construimos criterio, definimos estructura y preparamos el camino para cuando el capital esté listo.
            </p>
          </div>
        )}

        {/* Top vehicles preview */}
        {!isLowCapital && (
          <div style={{ marginBottom: "28px" }}>
            <p style={{ fontFamily: "'Inter',sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "0.18em", color: `${GOLD}80`, textTransform: "uppercase", marginBottom: "14px" }}>Vehículos compatibles con tu perfil</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {top3.map((v, i) => (
                <div key={v.id} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px", background: NAVY_CARD, border: `1px solid ${i === 0 ? GOLD + "50" : NAVY_BORDER}`, borderRadius: "10px" }}>
                  <div style={{ width: "26px", height: "26px", borderRadius: "50%", background: i === 0 ? `${GOLD}20` : `${NAVY_BORDER}60`, border: `1.5px solid ${i === 0 ? GOLD : NAVY_BORDER}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ fontFamily: "'Inter',sans-serif", fontSize: "11px", fontWeight: 700, color: i === 0 ? GOLD : "#4A6580" }}>{i + 1}</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontFamily: "'Inter',sans-serif", fontSize: "13px", fontWeight: 600, color: i === 0 ? "#fff" : "#C8D6E8" }}>{v.nombre}</span>
                    <span style={{ fontFamily: "'Inter',sans-serif", fontSize: "11px", color: "#4A6580", marginLeft: "8px" }}>{v.pct}% compatibilidad</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* What they'll receive */}
        <div style={{ background: `${NAVY_CARD}80`, border: `1px solid ${NAVY_BORDER}`, borderRadius: "12px", padding: "20px", marginBottom: "32px" }}>
          <p style={{ fontFamily: "'Inter',sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "0.18em", color: `${GOLD}80`, textTransform: "uppercase", marginBottom: "14px" }}>Al dejar tus datos recibirás</p>
          {[
            "Tu ficha de perfil GPS completa",
            "Análisis de compatibilidad por vehículo de inversión",
            "Una llamada de diagnóstico estratégico personalizado",
            "Seguimiento por WhatsApp y correo electrónico",
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px", marginBottom: "10px" }}>
              <div style={{ width: "18px", height: "18px", borderRadius: "50%", background: `${GOLD}20`, border: `1px solid ${GOLD}50`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "1px" }}>
                <IconCheck color={GOLD} size={10} />
              </div>
              <span style={{ fontFamily: "'Inter',sans-serif", fontSize: "13px", color: "#8FA5C0", lineHeight: 1.5 }}>{item}</span>
            </div>
          ))}
        </div>

        <GoldBtn onClick={onContinue} style={{ width: "100%" }}>
          Recibir mi perfil estratégico <IconRight color={NAVY} />
        </GoldBtn>
        <p style={{ fontFamily: "'Inter',sans-serif", fontSize: "11px", color: "#4A6580", textAlign: "center", marginTop: "12px" }}>
          Tus datos son confidenciales. No los compartimos con terceros.
        </p>
      </div>
    </div>
  );
}

/* ─── SCREEN 8 — Contact form ─── */
const COUNTRY_CODES = [
  { code: "+52", flag: "🇲🇽", name: "México" },
  { code: "+1", flag: "🇺🇸", name: "Estados Unidos" },
  { code: "+57", flag: "🇨🇴", name: "Colombia" },
  { code: "+54", flag: "🇦🇷", name: "Argentina" },
  { code: "+56", flag: "🇨🇱", name: "Chile" },
  { code: "+51", flag: "🇵🇪", name: "Perú" },
  { code: "+58", flag: "🇻🇪", name: "Venezuela" },
  { code: "+502", flag: "🇬🇹", name: "Guatemala" },
  { code: "+34", flag: "🇪🇸", name: "España" },
];

type ContactData = { nombre: string; countryCode: string; whatsapp: string; email: string };

function Screen8Contact({ onNext, partialSent, onPartialSent }: {
  onNext: (data: ContactData) => void;
  partialSent: boolean;
  onPartialSent: () => void;
}) {
  const [form, setForm] = useState<ContactData>({ nombre: "", countryCode: "+52", whatsapp: "", email: "" });
  const [errors, setErrors] = useState<Partial<Record<keyof ContactData, string>>>({});
  const [focused, setFocused] = useState<string | null>(null);
  const [honeypot, setHoneypot] = useState("");
  const createLead = trpc.leads.create.useMutation();
  const [submitting, setSubmitting] = useState(false);

  function validate() {
    const e: Partial<Record<keyof ContactData, string>> = {};
    if (!form.nombre.trim()) e.nombre = "Tu nombre es necesario";
    if (!form.whatsapp.trim() || form.whatsapp.replace(/\D/g, "").length < 7) e.whatsapp = "Ingresa un número válido";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Ingresa un correo válido";
    return e;
  }

  function handleSubmit() {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setSubmitting(true);
    // Envío interno best-effort
    createLead.mutate({
      nombreCompleto: form.nombre.trim(),
      whatsapp: `${form.countryCode} ${form.whatsapp.trim()}`,
      email: form.email.trim(),
      fuente: "gps-diagnostico",
    });
    // POST al CRM público — partial — solo si no se ha enviado antes
    if (!partialSent) {
      postCrmLead({
        name: form.nombre.trim(),
        email: form.email.trim(),
        phone: `${form.countryCode}${form.whatsapp.trim()}`,
        sourceSlug: "web_ca_gps",
        hito: "diagnostico_parcial",
        stage: "partial",
        gpsFicha: null,
      }, honeypot);
      onPartialSent();
    }
    setTimeout(() => onNext(form), 600);
  }

  function fieldStyle(id: string, hasErr: boolean): React.CSSProperties {
    const isFoc = focused === id;
    return { width: "100%", padding: "14px 16px", background: NAVY_CARD, border: `1.5px solid ${hasErr ? "#E05C5C" : isFoc ? GOLD : NAVY_BORDER}`, borderRadius: "10px", color: "#E8ECF1", fontFamily: "'Inter',sans-serif", fontSize: "15px", outline: "none", transition: "border-color 0.2s", boxSizing: "border-box" as const };
  }

  return (
    <div style={{ minHeight: "100dvh", background: NAVY, display: "flex", alignItems: "center", justifyContent: "center", padding: "88px 24px 120px" }}>
      <div style={{ width: "100%", maxWidth: "520px" }}>
        <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: `${GOLD}18`, border: `1.5px solid ${GOLD}50`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "28px" }}>
          <IconCompass color={GOLD} />
        </div>
        <h2 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: "clamp(22px,3.5vw,36px)", fontWeight: 700, color: "#fff", marginBottom: "10px", lineHeight: 1.2 }}>
          Tu ruta está lista.<br />
          <em style={{ color: GOLD_LIGHT, fontStyle: "italic" }}>¿A quién se la enviamos?</em>
        </h2>
        <p style={{ fontFamily: "'Inter',sans-serif", fontSize: "14px", color: "#6A8FAF", marginBottom: "36px", lineHeight: 1.7 }}>
          Recibirás tu perfil GPS y un asesor se contactará contigo por <strong style={{ color: "#8FA5C0" }}>WhatsApp y correo</strong> para agendar tu diagnóstico.
        </p>

        {/* Nombre */}
        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "8px", fontFamily: "'Inter',sans-serif", fontSize: "12px", fontWeight: 700, letterSpacing: "0.12em", color: errors.nombre ? "#E05C5C" : focused === "nombre" ? GOLD : "#6A8FAF", textTransform: "uppercase", marginBottom: "8px" }}>
            <IconUser /> Nombre completo
          </label>
          <input type="text" value={form.nombre} placeholder="Tu nombre completo"
            onFocus={() => { setFocused("nombre"); setErrors(p => ({ ...p, nombre: undefined })); }}
            onBlur={() => setFocused(null)}
            onChange={e => setForm(p => ({ ...p, nombre: e.target.value }))}
            style={fieldStyle("nombre", !!errors.nombre)} />
          {errors.nombre && <p style={{ fontFamily: "'Inter',sans-serif", fontSize: "12px", color: "#E05C5C", marginTop: "5px" }}>{errors.nombre}</p>}
        </div>

        {/* WhatsApp with country code */}
        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "8px", fontFamily: "'Inter',sans-serif", fontSize: "12px", fontWeight: 700, letterSpacing: "0.12em", color: errors.whatsapp ? "#E05C5C" : focused === "whatsapp" ? GOLD : "#6A8FAF", textTransform: "uppercase", marginBottom: "8px" }}>
            <IconPhone /> WhatsApp
          </label>
          <div style={{ display: "flex", gap: "8px" }}>
            <select value={form.countryCode}
              onChange={e => setForm(p => ({ ...p, countryCode: e.target.value }))}
              style={{ padding: "14px 10px", background: NAVY_CARD, border: `1.5px solid ${NAVY_BORDER}`, borderRadius: "10px", color: "#E8ECF1", fontFamily: "'Inter',sans-serif", fontSize: "14px", outline: "none", flexShrink: 0, cursor: "pointer" }}>
              {COUNTRY_CODES.map(c => (
                <option key={c.code} value={c.code}>{c.flag} {c.code}</option>
              ))}
            </select>
            <input type="tel" value={form.whatsapp} placeholder="33 1234 5678"
              onFocus={() => { setFocused("whatsapp"); setErrors(p => ({ ...p, whatsapp: undefined })); }}
              onBlur={() => setFocused(null)}
              onChange={e => setForm(p => ({ ...p, whatsapp: e.target.value }))}
              style={{ ...fieldStyle("whatsapp", !!errors.whatsapp), flex: 1 }} />
          </div>
          {errors.whatsapp && <p style={{ fontFamily: "'Inter',sans-serif", fontSize: "12px", color: "#E05C5C", marginTop: "5px" }}>{errors.whatsapp}</p>}
        </div>

        {/* Email */}
        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "8px", fontFamily: "'Inter',sans-serif", fontSize: "12px", fontWeight: 700, letterSpacing: "0.12em", color: errors.email ? "#E05C5C" : focused === "email" ? GOLD : "#6A8FAF", textTransform: "uppercase", marginBottom: "8px" }}>
            <IconMail /> Correo electrónico
          </label>
          <input type="email" value={form.email} placeholder="tu@correo.com"
            onFocus={() => { setFocused("email"); setErrors(p => ({ ...p, email: undefined })); }}
            onBlur={() => setFocused(null)}
            onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
            style={fieldStyle("email", !!errors.email)} />
          {errors.email && <p style={{ fontFamily: "'Inter',sans-serif", fontSize: "12px", color: "#E05C5C", marginTop: "5px" }}>{errors.email}</p>}
        </div>

        {/* Honeypot — invisible para humanos, bots lo llenan */}
        <div style={{ position: "absolute", left: "-9999px", top: "-9999px", width: "1px", height: "1px", overflow: "hidden" }} aria-hidden="true">
          <input type="text" name="website" tabIndex={-1} autoComplete="off" value={honeypot} onChange={e => setHoneypot(e.target.value)} />
        </div>

        {/* Privacy notice */}
        <p style={{ fontFamily: "'Inter',sans-serif", fontSize: "11px", color: "#4A6580", marginBottom: "24px", lineHeight: 1.7 }}>
          Al continuar aceptas nuestro{" "}
          <a href="/privacidad" style={{ color: `${GOLD}CC`, textDecoration: "underline" }}>aviso de privacidad</a>.
          {" "}Tus datos serán utilizados exclusivamente para darte seguimiento a tu solicitud de diagnóstico estratégico.
        </p>

        <motion.button onClick={handleSubmit} disabled={submitting} animate={{ opacity: submitting ? 0.7 : 1 }}
          style={{ width: "100%", padding: "16px", background: `linear-gradient(90deg,${GOLD},${GOLD_LIGHT})`, color: NAVY, fontFamily: "'Inter',sans-serif", fontSize: "14px", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", border: "none", borderRadius: "10px", cursor: submitting ? "wait" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
          {submitting ? (
            <>
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                style={{ width: "16px", height: "16px", borderRadius: "50%", border: `2px solid ${NAVY}40`, borderTopColor: NAVY }} />
              Procesando...
            </>
          ) : (
            <>Ver mi perfil estratégico <IconRight color={NAVY} /></>
          )}
        </motion.button>
      </div>
    </div>
  );
}

/* ─── Biblioteca data ─── */
const BIBLIOTECA = [
  { tipo: "video", titulo: "¿Qué es una LLC y para qué sirve?", meta: "7 min", cat: "Estructura" },
  { tipo: "guia", titulo: "Proteger tu patrimonio en Estados Unidos", meta: "12 min", cat: "Patrimonio" },
  { tipo: "podcast", titulo: "Renta garantizada con Section 8", meta: "45 min", cat: "Flujo" },
  { tipo: "caso", titulo: "Empresario colombiano expande a Texas", meta: "Caso de estudio", cat: "Empresa" },
  { tipo: "video", titulo: "Fondo de Tierra Estratégica: qué es y cómo funciona", meta: "12 min", cat: "Flujo" },
  { tipo: "guia", titulo: "Las 5 estructuras más usadas por inversionistas latinos", meta: "8 min", cat: "Estructura" },
];
const TIPO_ICONS: Record<string, () => JSX.Element> = {
  video: () => <IconPlay />,
  guia: () => <IconBook />,
  podcast: () => <IconMic />,
  caso: () => <IconBarChart />,
};
const TIPO_LABELS: Record<string, string> = { video: "Video", guia: "Guía", podcast: "Podcast", caso: "Caso" };

const VEHICULOS_CATEGORIAS = [
  {
    id: "flujo",
    titulo: "Generar flujo pasivo",
    items: [
      { id: "victory-capital", nombre: "Fondo de Tierra Estratégica", frase: "Flujo en dólares, apreciación patrimonial y gestión profesional", participacion: "Pasiva", horizonte: "5-7 años", ticket: "100k+", href: "/tierra-estrategica", exclusivo: false },
      { id: "section8", nombre: "Programa de Vivienda con Renta Respaldada por el Gobierno", frase: "Flujo inmobiliario respaldado por programas gubernamentales", participacion: "Semi-pasiva", horizonte: "Largo plazo", ticket: "90k+", href: "/renta-garantizada", exclusivo: false },
      { id: "coinversiones", nombre: "Oportunidades Privadas Curadas", frase: "Proyectos seleccionados para perfiles específicos de inversionista", participacion: "Flexible", horizonte: "2-4 años", ticket: "50k+", href: "/club-de-inversion-en-estados-unidos", exclusivo: true },
    ],
  },
  {
    id: "patrimonio",
    titulo: "Construir patrimonio",
    items: [
      { id: "real-estate", nombre: "Real Estate", frase: "Bienes raíces en mercados de alta demanda", participacion: "Semi-pasiva", horizonte: "Largo plazo", ticket: "150k+", href: "/activos-disponibles", exclusivo: false },
      { id: "estructura-llc", nombre: "Estructura para Invertir en Estados Unidos", frase: "Legal, fiscal, bancaria y patrimonial desde el primer día", participacion: "Pasiva", horizonte: "5-10 años", ticket: "25k+", href: "/estructura-de-inversion-en-usa", exclusivo: false },
      { id: "adquisiciones", nombre: "Negocios", frase: "Adquiere o construye un negocio americano", participacion: "Activa", horizonte: "3-5 años", ticket: "200k+", href: "", exclusivo: true },
    ],
  },
  {
    id: "empresa",
    titulo: "Expandir empresa",
    items: [
      { id: "americaniza", nombre: "Americaniza tu Operación", frase: "Lleva tu empresa al mercado americano", participacion: "Activa", horizonte: "1-3 años", ticket: "Consultar", href: "/expansion-internacional-empresas", exclusivo: true },
      { id: "adquisiciones-emp", nombre: "Adquisiciones", frase: "Compra una empresa americana en operación", participacion: "Activa", horizonte: "6-12 meses", ticket: "500k+", href: "", exclusivo: true },
      { id: "plan-migratorio", nombre: "Visa E-2", frase: "Expansión con opción a residencia vía inversión", participacion: "Activa", horizonte: "1-2 años", ticket: "100k+", href: "/visa-e2-inversionista-usa", exclusivo: true },
    ],
  },
];

const COMPARACION = {
  headers: ["Fondo de Tierra Estratégica", "Programa de Vivienda con Renta Respaldada por el Gobierno", "Grupo Empresarial de Edmundo Treviño"],
  rows: [
    { label: "Participación", values: ["Pasiva", "Semi-pasiva", "Estratégica"] },
    { label: "Horizonte", values: ["5-7 años", "Largo plazo", "Continuo"] },
    { label: "Ticket", values: ["100k+", "90k+", "10k"] },
    { label: "Visa", values: ["No directa", "No directa", "Puede explorar"] },
    { label: "Objetivo", values: ["Flujo", "Patrimonio", "Claridad"] },
  ],
};

/* ─── Biblioteca del Inversionista ─── */
function BibliotecaSection() {
  const [filtro, setFiltro] = useState<string>("todos");
  const tipos = ["todos", "video", "guia", "podcast", "caso"];
  const filtrados = filtro === "todos" ? BIBLIOTECA : BIBLIOTECA.filter(b => b.tipo === filtro);
  return (
    <div style={{ padding: "80px 24px", background: `${NAVY}F0`, borderTop: `1px solid ${NAVY_BORDER}` }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        <span style={{ fontFamily: "'Inter',sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "0.22em", color: GOLD, textTransform: "uppercase" as const, display: "block", marginBottom: "12px" }}>Biblioteca del Inversionista</span>
        <h2 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: "clamp(24px,3.5vw,40px)", fontWeight: 700, color: "#fff", lineHeight: 1.2, marginBottom: "14px" }}>Aprende a tu ritmo</h2>
        <p style={{ fontFamily: "'Inter',sans-serif", fontSize: "15px", color: "#6A8FAF", maxWidth: "520px", lineHeight: 1.7, marginBottom: "36px" }}>Contenido curado para empresarios latinos que quieren entender antes de decidir.</p>
        <div style={{ display: "flex", gap: "8px", marginBottom: "36px", flexWrap: "wrap" as const }}>
          {tipos.map(t => (
            <button key={t} onClick={() => setFiltro(t)}
              style={{ padding: "8px 16px", background: filtro === t ? GOLD : "transparent", color: filtro === t ? NAVY : "#6A8FAF", fontFamily: "'Inter',sans-serif", fontSize: "12px", fontWeight: filtro === t ? 700 : 500, border: `1px solid ${filtro === t ? GOLD : NAVY_BORDER}`, borderRadius: "20px", cursor: "pointer", textTransform: "capitalize" as const, transition: "all 0.2s" }}>
              {t === "todos" ? "Todo" : TIPO_LABELS[t] || t}
            </button>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(min(100%,280px),1fr))", gap: "16px" }}>
          {filtrados.map((item, i) => (
            <div key={i} style={{ background: NAVY_CARD, border: `1px solid ${NAVY_BORDER}`, borderRadius: "12px", padding: "20px", cursor: "pointer", transition: "border-color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = GOLD)}
              onMouseLeave={e => (e.currentTarget.style.borderColor = NAVY_BORDER)}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                <div style={{ width: "28px", height: "28px", borderRadius: "6px", background: `${GOLD}18`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {(TIPO_ICONS[item.tipo] || TIPO_ICONS.video)()}
                </div>
                <span style={{ fontFamily: "'Inter',sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", color: GOLD, textTransform: "uppercase" as const }}>{TIPO_LABELS[item.tipo] || item.tipo}</span>
                <span style={{ fontFamily: "'Inter',sans-serif", fontSize: "11px", color: "#4A6580", marginLeft: "auto" }}>{item.meta}</span>
              </div>
              <h4 style={{ fontFamily: "'Inter',sans-serif", fontSize: "14px", fontWeight: 600, color: "#E8ECF1", lineHeight: 1.5, marginBottom: "8px" }}>{item.titulo}</h4>
              <div style={{ display: "inline-block", padding: "3px 8px", background: `${NAVY}80`, borderRadius: "4px", fontFamily: "'Inter',sans-serif", fontSize: "11px", color: "#6A8FAF" }}>{item.cat}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── No Somos / Somos ─── */
function NoSomosSection() {
  return (
    <div style={{ background: NAVY, display: "flex", alignItems: "center", padding: "80px 24px", borderTop: `1px solid ${NAVY_BORDER}` }}>
      <div style={{ maxWidth: "960px", margin: "0 auto", width: "100%" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,400px),1fr))", gap: "64px" }}>
          <div>
            <div style={{ fontFamily: "'Inter',sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "0.25em", color: "#4A6580", textTransform: "uppercase" as const, marginBottom: "28px" }}>No somos</div>
            {["Un catálogo de inversiones.", "Un marketplace financiero.", "Un despacho migratorio.", "Una empresa de trámites."].map(t => (
              <div key={t} style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "16px" }}>
                <div style={{ width: "20px", height: "2px", background: "#4A6580", flexShrink: 0 }} />
                <span style={{ fontFamily: "'Inter',sans-serif", fontSize: "16px", color: "#4A6580", textDecoration: "line-through" }}>{t}</span>
              </div>
            ))}
          </div>
          <div>
            <div style={{ fontFamily: "'Inter',sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "0.25em", color: GOLD, textTransform: "uppercase" as const, marginBottom: "28px" }}>Somos</div>
            {["Arquitectos de decisiones.", "Constructores de criterio.", "Comunidad de empresarios.", "Curadores de oportunidades.", "Socios estratégicos."].map(t => (
              <div key={t} style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "16px" }}>
                <div style={{ width: "20px", height: "2px", background: GOLD, flexShrink: 0 }} />
                <span style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: "18px", fontWeight: 600, color: "#fff" }}>{t}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ marginTop: "64px", borderTop: `1px solid ${NAVY_BORDER}`, paddingTop: "48px", textAlign: "center" as const }}>
          <blockquote style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: "clamp(20px,2.5vw,28px)", fontStyle: "italic", color: GOLD_LIGHT, lineHeight: 1.5, maxWidth: "640px", margin: "0 auto" }}>
            "No necesitas más oportunidades.<br />Necesitas saber cuál tiene sentido para ti."
          </blockquote>
        </div>
      </div>
    </div>
  );
}

/* ─── Vehicle detail drawer ─── */
function VehicleDrawer({ vehicle, onClose }: { vehicle: (VehicleEntry & { pct: number }) | null; onClose: () => void }) {
  const isMobile = useIsMobile();
  const SECTION_LABEL: React.CSSProperties = {
    fontFamily: "'Inter',sans-serif", fontSize: "9px", fontWeight: 700,
    letterSpacing: "0.2em", textTransform: "uppercase" as const, marginBottom: "6px",
  };
  return (
    <AnimatePresence>
      {vehicle && (
        <>
          <motion.div key="ov" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)", zIndex: 400 }} />
          <motion.div key="dw" initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ type: "spring", damping: 28, stiffness: 260 }}
            style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: NAVY_CARD, borderTop: `1px solid ${NAVY_BORDER}`, borderRadius: "20px 20px 0 0", zIndex: 500, padding: "28px 24px 44px", maxHeight: "88vh", overflowY: "auto" }}>

            {/* Handle */}
            <div style={{ width: "40px", height: "4px", background: NAVY_BORDER, borderRadius: "2px", margin: "0 auto 24px" }} />

            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "'Inter',sans-serif", fontSize: "10px", fontWeight: 700, letterSpacing: "0.2em", color: GOLD, textTransform: "uppercase", marginBottom: "6px" }}>
                  {vehicle.pct}% compatibilidad con tu perfil
                </div>
                <h3 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: "26px", fontWeight: 700, color: "#fff", margin: 0, lineHeight: 1.2 }}>{vehicle.nombre}</h3>
                <p style={{ fontFamily: "'Inter',sans-serif", fontSize: "13px", color: "#5A7A99", margin: "6px 0 0", fontStyle: "italic" }}>{vehicle.frase}</p>
              </div>
              <button onClick={onClose} style={{ background: "transparent", border: "none", cursor: "pointer", padding: "4px", marginLeft: "12px", flexShrink: 0 }}><IconX /></button>
            </div>

            {/* ¿Qué es? */}
            <div style={{ marginBottom: "20px" }}>
              <div style={{ ...SECTION_LABEL, color: "#4A6580" }}>¿Qué es?</div>
              <p style={{ fontFamily: "'Inter',sans-serif", fontSize: "14px", color: "#A8BDD4", lineHeight: 1.7, margin: 0 }}>{vehicle.descripcion}</p>
            </div>

            {/* Separador */}
            <div style={{ height: "1px", background: NAVY_BORDER, marginBottom: "20px" }} />

            {/* Desde → Hacia */}
            <div style={{ marginBottom: "20px" }}>
              <div style={{ ...SECTION_LABEL, color: "#4A6580" }}>Tu transformación</div>
              <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: "10px", alignItems: isMobile ? "stretch" : "center" }}>
                <div style={{ background: `${NAVY}90`, border: `1px solid ${NAVY_BORDER}`, borderRadius: "10px", padding: "12px 14px", flex: 1 }}>
                  <div style={{ fontFamily: "'Inter',sans-serif", fontSize: "9px", fontWeight: 700, letterSpacing: "0.15em", color: "#4A6580", textTransform: "uppercase", marginBottom: "6px" }}>Dónde estás</div>
                  <p style={{ fontFamily: "'Inter',sans-serif", fontSize: "12px", color: "#7A9AB8", lineHeight: 1.55, margin: 0 }}>{vehicle.desde}</p>
                </div>
                <div style={{ fontSize: "20px", color: GOLD, fontWeight: 700, flexShrink: 0, textAlign: "center" }}>{isMobile ? "↓" : "→"}</div>
                <div style={{ background: `${GOLD}10`, border: `1px solid ${GOLD}30`, borderRadius: "10px", padding: "12px 14px", flex: 1 }}>
                  <div style={{ fontFamily: "'Inter',sans-serif", fontSize: "9px", fontWeight: 700, letterSpacing: "0.15em", color: GOLD, textTransform: "uppercase", marginBottom: "6px" }}>Hacia dónde vas</div>
                  <p style={{ fontFamily: "'Inter',sans-serif", fontSize: "12px", color: "#C8D6E8", lineHeight: 1.55, margin: 0 }}>{vehicle.hacia}</p>
                </div>
              </div>
            </div>

            {/* Separador */}
            <div style={{ height: "1px", background: NAVY_BORDER, marginBottom: "20px" }} />

            {/* Qué obtienes */}
            <div style={{ marginBottom: "24px" }}>
              <div style={{ ...SECTION_LABEL, color: "#4A6580" }}>Qué obtienes</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {vehicle.ganas.map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                    <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: `${GOLD}20`, border: `1px solid ${GOLD}50`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "1px" }}>
                      <IconCheck color={GOLD} size={10} />
                    </div>
                    <span style={{ fontFamily: "'Inter',sans-serif", fontSize: "13px", color: "#C8D6E8", lineHeight: 1.55 }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Specs */}
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "1fr 1fr 1fr", gap: "8px", marginBottom: "24px" }}>
              {[["Horizonte", vehicle.horizonte], ["Ticket mínimo", vehicle.ticketLabel], ["Participación", PARTICIPACION_LABELS[vehicle.participacion[0]] ?? vehicle.participacion[0]]].map(([k, v]) => (
                <div key={k} style={{ background: `${NAVY}80`, border: `1px solid ${NAVY_BORDER}`, borderRadius: "8px", padding: "12px 10px", textAlign: "center" }}>
                  <div style={{ fontFamily: "'Inter',sans-serif", fontSize: "9px", fontWeight: 700, letterSpacing: "0.15em", color: "#4A6580", textTransform: "uppercase", marginBottom: "4px" }}>{k}</div>
                  <div style={{ fontFamily: "'Inter',sans-serif", fontSize: "12px", fontWeight: 600, color: "#C8D6E8" }}>{v}</div>
                </div>
              ))}
            </div>

            {/* CTA */}
            {vehicle.exclusivo ? (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "14px", background: `${GOLD}12`, border: `1px solid ${GOLD}40`, borderRadius: "10px", color: `${GOLD}CC`, fontFamily: "'Inter',sans-serif", fontSize: "13px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", textAlign: "center" }}>
                Exclusivo para miembros · Agenda tu diagnóstico para acceder
              </div>
            ) : vehicle.href ? (
              <a href={vehicle.href}
                style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", padding: "14px", background: `linear-gradient(90deg,${GOLD},${GOLD_LIGHT})`, color: "#fff", fontFamily: "'Inter',sans-serif", fontSize: "13px", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", borderRadius: "10px", textDecoration: "none" }}>
                Explorar {vehicle.nombre} <IconRight color="#fff" />
              </a>
            ) : null}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ─── Social Proof ─── */
function SocialProofSection() {
  const STATS = [
    { value: "40+", label: "Miembros activos que participaron en un Deal Day" },
    { value: "53+", label: "LLCs estructuradas" },
    { value: "14+", label: "Visas tramitadas" },
    { value: "6", label: "Viajes de inspección" },
  ];
  return (
    <div style={{ borderTop: `1px solid ${NAVY_BORDER}`, padding: "56px 24px" }}>
      <div style={{ maxWidth: "680px", margin: "0 auto" }}>
        <h2 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: "clamp(22px,3.5vw,32px)", fontWeight: 700, color: "#fff", marginBottom: "8px" }}>
          Resultados. Números reales. Equipo real.
        </h2>
        <p style={{ fontFamily: "'Inter',sans-serif", fontSize: "14px", color: "#6A8FAF", marginBottom: "28px" }}>
          Con el apoyo de Comprando América hemos logrado:
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: "16px", marginBottom: "20px" }}>
          {STATS.map(s => (
            <div key={s.label}>
              <div style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: "32px", fontWeight: 700, color: GOLD }}>{s.value}</div>
              <div style={{ fontFamily: "'Inter',sans-serif", fontSize: "12px", color: "#8FA5C0" }}>{s.label}</div>
            </div>
          ))}
        </div>
        <p style={{ fontFamily: "'Inter',sans-serif", fontSize: "14px", color: "#C8D6E8" }}>
          En los últimos dos años, nuestros miembros han invertido <strong style={{ color: GOLD }}>$3,978,086 USD</strong>.
        </p>
      </div>
    </div>
  );
}

/* ─── RESULT SCREEN ─── */
function ResultScreen({ perfil, contactData, rankedVehicles, investorData, preQualified, onCompare }: {
  perfil: (typeof PERFILES)[string];
  contactData: ContactData | null;
  rankedVehicles: (VehicleEntry & { score: number; pct: number })[];
  investorData: { objetivo: string | null; participacion: string | null; horizonte: string | null; capital: string | null; prioridades: string[] };
  preQualified?: boolean;
  onCompare: () => void;
}) {
  // Etiqueta de página de interés (acumulable en el CRM). El GPS siempre representa interés de
  // inversión; si además llega pre-calificado desde el diagnóstico de LLC, se conserva el rastro.
  const crmTags = preQualified ? ["interes:inversion", "origen:llc-diagnostico"] : ["interes:inversion"];
  const [showConfirm, setShowConfirm] = useState(false);
  const [drawerVehicle, setDrawerVehicle] = useState<(VehicleEntry & { score: number; pct: number }) | null>(null);
  const confirmRef = useRef<HTMLDivElement>(null);
  // Identificador único de esta sesión de quiz — se genera una sola vez al montar y nunca cambia.
  const quizSessionIdRef = useRef<string | null>(null);
  if (quizSessionIdRef.current === null) quizSessionIdRef.current = crypto.randomUUID();
  const [diagAnswer, setDiagAnswer] = useState<string | null>(null);
  const [notas, setNotas] = useState("");
  const [patrimonioPct, setPatrimonioPct] = useState<string | null>(null);
  const [posicionRiesgo, setPosicionRiesgo] = useState<string | null>(null);
  const [composicionCapital, setComposicionCapital] = useState<string | null>(null);
  const [estructuraArea, setEstructuraArea] = useState<string[]>([]);
  const [showCriterio, setShowCriterio] = useState(false);
  const [vehiculosView, setVehiculosView] = useState<"perfil" | "todos">("perfil");
  const [selectedColumn, setSelectedColumn] = useState<number | null>(null);
  const [videoExpanded, setVideoExpanded] = useState(false);
  const [showEstructura, setShowEstructura] = useState(false);
  const [showDiag, setShowDiag] = useState(false);
  const [showVehiculos, setShowVehiculos] = useState(false);

  const firstName = contactData?.nombre?.trim().split(" ")[0] ?? "";
  const topVehicles = rankedVehicles.slice(0, 5);

  const objetivoLabel = OPCIONES_1.find(o => o.id === investorData.objetivo)?.label ?? "";
  const capitalLabel = CAPITAL_LABELS[investorData.capital ?? ""] ?? "";
  const participacionLabel = PARTICIPACION_LABELS[investorData.participacion ?? ""] ?? "";

  const fichaData = [
    { label: "Objetivo", value: objetivoLabel },
    { label: "Capital", value: capitalLabel },
    { label: "Rol", value: participacionLabel },
    { label: "Horizonte", value: investorData.horizonte ?? "" },
  ].filter(f => f.value);

  const prioridadesLabels = investorData.prioridades.map(id => OPCIONES_4.find(o => o.id === id)?.label ?? id);

  // Construye el mismo contenido —ya formateado en español— que se muestra en "Tu Ficha GPS Estratégica"
  function buildGpsFicha() {
    return {
      rutaTitulo: perfil.nombre,
      rutaDescripcion: perfil.descripcion,
      porQueEstaRuta: perfil.porQueEncaja,
      perfil: {
        objetivo: objetivoLabel,
        capital: capitalLabel,
        rol: participacionLabel,
        horizonte: investorData.horizonte ?? "",
        prioridades: prioridadesLabels,
      },
      respuestas: {
        patrimonioADolarizar: patrimonioPct,
        posicionDeRiesgo: posicionRiesgo,
        composicionDeCapital: composicionCapital,
        areasDeInteres: estructuraArea.map(id => AREA_LABELS[id] ?? id),
        queResolverPrimero: diagAnswer ? (DIAG_OPCIONES.find(o => o.id === diagAnswer)?.label ?? diagAnswer) : null,
        notasAdicionales: notas.trim() || null,
      },
      vehiculosRecomendados: topVehicles.slice(0, 3).map(v => ({
        nombre: v.nombre,
        descripcion: v.frase,
        compatibilidad: v.pct,
      })),
    };
  }

  // Red de seguridad: envía la ficha básica una sola vez al montar, por si el usuario
  // abandona antes de responder cualquier pregunta de criterio.
  useEffect(() => {
    if (!contactData) return;
    postCrmLead({
      name: contactData.nombre.trim(),
      email: contactData.email.trim(),
      phone: `${contactData.countryCode}${contactData.whatsapp.trim()}`,
      sourceSlug: "web_ca_gps",
      hito: "diagnostico_completo",
      stage: "complete",
      tags: crmTags,
      quizSessionId: quizSessionIdRef.current,
      gpsFicha: buildGpsFicha(),
    }, ""); // honeypot vacío — ya validado en Screen8
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Actualiza (upsert por email/teléfono) el mismo contacto con el criterio más reciente.
  // Debounce de 1500ms para no disparar una petición por cada cambio rápido.
  useEffect(() => {
    if (!contactData) return;
    const hayCriterio = patrimonioPct || posicionRiesgo || composicionCapital || estructuraArea.length > 0 || diagAnswer || notas.trim();
    if (!hayCriterio) return;
    const timer = setTimeout(() => {
      postCrmLead({
        name: contactData.nombre.trim(),
        email: contactData.email.trim(),
        phone: `${contactData.countryCode}${contactData.whatsapp.trim()}`,
        sourceSlug: "web_ca_gps",
        hito: "diagnostico_completo",
        stage: "complete",
        tags: crmTags,
        quizSessionId: quizSessionIdRef.current,
        gpsFicha: buildGpsFicha(),
      }, "");
    }, 1500);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contactData, patrimonioPct, posicionRiesgo, composicionCapital, estructuraArea, diagAnswer, notas]);

  function openConfirm() {
    setShowConfirm(true);
    setTimeout(() => confirmRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }), 80);
  }

  useEffect(() => { if (patrimonioPct && posicionRiesgo && composicionCapital) setShowEstructura(true); }, [patrimonioPct, posicionRiesgo, composicionCapital]);
  useEffect(() => { if (estructuraArea.length > 0) setShowDiag(true); }, [estructuraArea]);
  useEffect(() => { if (diagAnswer) setShowVehiculos(true); }, [diagAnswer]);

  function sendWhatsApp() {
    const nombre = contactData?.nombre ?? "";
    const firstName = nombre.trim().split(" ")[0];
    const whatsapp = `${contactData?.countryCode ?? ""}${contactData?.whatsapp ?? ""}`;
    const email = contactData?.email ?? "";

    const AREA_LABELS: Record<string, string> = {
      "estructura-legal": "Estructura legal y fiscal",
      "flujo-pasivo": "Flujo pasivo en dólares",
      "bienes-raices": "Bienes raíces",
      "expansion-empresa": "Expansión de empresa",
      "visa-residencia": "Visa o residencia",
    };

    const lines: string[] = [];

    // Saludo
    lines.push(`Hola, soy *${firstName}* y acabo de completar el GPS Estratégico de *Comprando América*.`);
    lines.push("");
    lines.push("Quiero entender mi ruta y explorar cómo puedo avanzar hacia Estados Unidos.");
    lines.push("");

    // Perfil
    lines.push("*📋 MI PERFIL GPS*");
    lines.push(`*${perfil.nombre}*`);
    lines.push("");
    lines.push(`_${perfil.descripcion}_`);
    lines.push("");

    // Datos del perfil
    lines.push("*Mis datos de perfil:*");
    fichaData.forEach(f => lines.push(`  • *${f.label}:* ${f.value}`));
    if (prioridadesLabels.length) {
      lines.push(`  • *Prioridades:* ${prioridadesLabels.join(", ")}`);
    }
    lines.push("");

    // Criterio (solo si respondió)
    const hayCriterio = patrimonioPct || posicionRiesgo || composicionCapital || estructuraArea.length > 0;
    if (hayCriterio) {
      lines.push("*Mi criterio de inversión:*");
      if (patrimonioPct) lines.push(`  • *Patrimonio a dolarizar:* ${patrimonioPct}`);
      if (posicionRiesgo) lines.push(`  • *Posición de riesgo:* ${posicionRiesgo}`);
      if (composicionCapital) lines.push(`  • *Capital disponible:* ${composicionCapital}`);
      if (estructuraArea.length) {
        lines.push(`  • *Áreas de interés:* ${estructuraArea.map(id => AREA_LABELS[id] ?? id).join(", ")}`);
      }
      lines.push("");
    }

    // Diagnóstico
    if (diagAnswer) {
      const diagLabel = DIAG_OPCIONES.find(o => o.id === diagAnswer)?.label ?? diagAnswer;
      lines.push("*Lo que quiero resolver primero:*");
      lines.push(`  "${diagLabel}"`);
      lines.push("");
    }

    // Notas
    if (notas.trim()) {
      lines.push("*Contexto adicional:*");
      lines.push(`  _${notas.trim()}_`);
      lines.push("");
    }

    // Vehículos
    lines.push("*Vehículos recomendados para mi perfil:*");
    topVehicles.slice(0, 3).forEach((v, i) => {
      const medal = i === 0 ? "1." : i === 1 ? "2." : "3.";
      lines.push(`  ${medal} *${v.nombre}* — ${v.pct}% compatibilidad`);
    });
    lines.push("");

    // Por qué encaja
    lines.push("*Por qué esta ruta tiene sentido para mí:*");
    lines.push(`_${perfil.porQueEncaja}_`);
    lines.push("");

    // Contacto
    lines.push("─────────────────────");
    lines.push("*Mis datos de contacto:*");
    lines.push(`  • *Nombre:* ${nombre}`);
    lines.push(`  • *WhatsApp:* ${whatsapp}`);
    lines.push(`  • *Correo:* ${email}`);
    lines.push("");
    lines.push("Me gustaría agendar un diagnóstico estratégico personalizado.");

    const msg = lines.join("\n");
    const waUrl = `https://wa.me/523346766178?text=${encodeURIComponent(msg)}`;
    sendCtaClick({ cta: "gps-diagnostico-whatsapp", location: "/gps", destination: waUrl });
    window.open(waUrl, "_blank");
  }

  return (
    <div style={{ minHeight: "100dvh", background: NAVY, overflowY: "auto" }}>

      {/* ── SECCIÓN 1: CLARIDAD ── */}
      <div style={{ position: "relative", background: `linear-gradient(180deg, #0A1A30 0%, ${NAVY} 100%)`, padding: "80px 24px 56px", overflow: "hidden" }}>
        <div aria-hidden="true" style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(${GOLD}08 1px, transparent 1px), linear-gradient(90deg, ${GOLD}08 1px, transparent 1px)`, backgroundSize: "60px 60px", zIndex: 0 }} />
        <div style={{ position: "relative", zIndex: 2, maxWidth: "680px", margin: "0 auto" }}>
          {/* Badge */}
          <div style={{ marginBottom: "16px" }}>
            <span style={{ fontFamily: "'Inter',sans-serif", fontSize: "9px", fontWeight: 700, letterSpacing: "0.3em", color: GOLD, textTransform: "uppercase" as const, background: `${GOLD}15`, border: `1px solid ${GOLD}40`, borderRadius: "20px", padding: "5px 14px" }}>Estación 1 · Claridad</span>
          </div>
          {/* Profile name */}
          <h1 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: "clamp(28px,5vw,52px)", fontWeight: 900, color: "#fff", lineHeight: 1.1, marginBottom: "10px" }}>
            {perfil.nombre}
          </h1>
          {/* Greeting */}
          <p style={{ fontFamily: "'Inter',sans-serif", fontSize: "15px", color: "#8FA5C0", marginBottom: "24px" }}>
            Hemos terminado de analizar tu perfil estratégico{firstName ? `, ${firstName}` : ""}.
          </p>
          {/* Razonamiento personalizado */}
          <div style={{ marginBottom: "24px" }}>
            <p style={{ fontFamily: "'Inter',sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "0.18em", color: `${GOLD}80`, textTransform: "uppercase" as const }}>
              Durante el diagnóstico identificamos que
            </p>
            <ul style={{ margin: "10px 0 0", paddingLeft: "20px", listStyle: "disc" }}>
              {objetivoLabel && <li style={{ fontFamily: "'Inter',sans-serif", fontSize: "14px", color: "#C8D6E8", marginBottom: "6px", lineHeight: 1.6 }}>Tu objetivo principal es {objetivoLabel.toLowerCase()}</li>}
              {participacionLabel && <li style={{ fontFamily: "'Inter',sans-serif", fontSize: "14px", color: "#C8D6E8", marginBottom: "6px", lineHeight: 1.6 }}>Prefieres un rol de "{participacionLabel}" en la gestión</li>}
              {investorData.horizonte && <li style={{ fontFamily: "'Inter',sans-serif", fontSize: "14px", color: "#C8D6E8", marginBottom: "6px", lineHeight: 1.6 }}>Tu horizonte de inversión es de {investorData.horizonte}</li>}
              {prioridadesLabels.length > 0 && <li style={{ fontFamily: "'Inter',sans-serif", fontSize: "14px", color: "#C8D6E8", lineHeight: 1.6 }}>Priorizas {prioridadesLabels.join(" y ")}</li>}
            </ul>
          </div>

          {/* fichaData grid compacto */}
          {fichaData.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))", gap: "1px", background: `${GOLD}20`, border: `1px solid ${GOLD}30`, borderRadius: "12px", overflow: "hidden", marginBottom: "32px" }}>
              {fichaData.map(({ label, value }) => (
                <div key={label} style={{ background: "rgba(10,26,48,0.9)", padding: "14px 12px" }}>
                  <div style={{ fontFamily: "'Inter',sans-serif", fontSize: "9px", fontWeight: 700, letterSpacing: "0.2em", color: `${GOLD}90`, textTransform: "uppercase" as const, marginBottom: "4px" }}>{label}</div>
                  <div style={{ fontFamily: "'Inter',sans-serif", fontSize: "12px", fontWeight: 600, color: "#E8ECF1" }}>{value}</div>
                </div>
              ))}
            </div>
          )}

          {/* Grupo Empresarial — contexto sin botón de salida */}
          <div style={{ background: `linear-gradient(135deg, #081628 0%, #0D2040 100%)`, border: `1.5px solid ${GOLD}40`, borderRadius: "14px", padding: "24px", marginBottom: "28px" }}>
            <p style={{ fontFamily: "'Inter',sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "0.18em", color: `${GOLD}80`, textTransform: "uppercase" as const, marginBottom: "10px" }}>Tu punto de partida recomendado</p>
            <p style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: "20px", fontWeight: 700, color: "#fff", marginBottom: "10px" }}>Grupo Empresarial de Edmundo</p>
            <p style={{ fontFamily: "'Inter',sans-serif", fontSize: "14px", color: "#8FA5C0", lineHeight: 1.7, margin: 0 }}>
              Aquí se construye la estrategia. Desde este espacio se validan oportunidades, estructuras fiscales, aspectos migratorios y decisiones patrimoniales antes de invertir.
            </p>
          </div>

          {/* VIDEO EXPANDIBLE */}
          <div
            style={{ marginBottom: "28px", borderRadius: "14px", border: `1px solid ${NAVY_BORDER}`, overflow: "hidden", cursor: videoExpanded ? "default" : "pointer" }}
            onClick={() => !videoExpanded && setVideoExpanded(true)}>
            {!videoExpanded ? (
              <div style={{ height: "200px", background: `linear-gradient(135deg, #081628 0%, #0D2040 100%)`, display: "flex", flexDirection: "column" as const, alignItems: "center", justifyContent: "center", gap: "14px" }}>
                <div style={{ width: "52px", height: "52px", borderRadius: "50%", background: `${GOLD}20`, border: `2px solid ${GOLD}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <IconPlay color={GOLD} />
                </div>
                <div style={{ textAlign: "center" as const }}>
                  <p style={{ fontFamily: "'Inter',sans-serif", fontSize: "13px", fontWeight: 700, color: "#fff", margin: "0 0 4px" }}>Edmundo te explica tu ruta · 60 seg</p>
                  <p style={{ fontFamily: "'Inter',sans-serif", fontSize: "11px", color: "#6A8FAF", margin: 0 }}>Haz clic para ver</p>
                </div>
              </div>
            ) : (
              <AnimatePresence>
                <motion.div key="video-expanded" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.35 }}
                  style={{ position: "relative", paddingBottom: "56.25%", background: `linear-gradient(135deg, #081628 0%, #0D2040 100%)` }}>
                  <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column" as const, alignItems: "center", justifyContent: "center", gap: "16px" }}>
                    <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: `${GOLD}20`, border: `2px solid ${GOLD}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <IconPlay color={GOLD} />
                    </div>
                    <p style={{ fontFamily: "'Inter',sans-serif", fontSize: "13px", fontWeight: 700, color: "#fff", margin: 0 }}>Edmundo te explica tu ruta</p>
                  </div>
                </motion.div>
              </AnimatePresence>
            )}
          </div>

          {/* Profile description */}
          <p style={{ fontFamily: "'Inter',sans-serif", fontSize: "15px", color: "#8FA5C0", lineHeight: 1.75, marginBottom: "28px", maxWidth: "520px" }}>{perfil.descripcion}</p>

          {/* CTA block */}
          {!showCriterio ? (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
              style={{ width: "100%", background: "linear-gradient(135deg, #0D2040 0%, #0F2847 100%)", border: `1.5px solid ${GOLD}40`, borderRadius: "16px", padding: "24px", textAlign: "center" as const }}>
              <p style={{ fontFamily: "'Inter',sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "0.18em", color: `${GOLD}90`, textTransform: "uppercase" as const, margin: "0 0 10px" }}>Tu diagnóstico no está completo</p>
              <p style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: "18px", fontWeight: 700, color: "#fff", margin: "0 0 8px", lineHeight: 1.35 }}>
                Afina tu perfil con 3 preguntas clave
              </p>
              <p style={{ fontFamily: "'Inter',sans-serif", fontSize: "13px", color: "#8FA5C0", lineHeight: 1.6, margin: "0 0 20px" }}>
                Responder tarda menos de 60 segundos y te dará una ruta de inversión mucho más precisa para tu situación actual.
              </p>
              <button
                onClick={() => setShowCriterio(true)}
                style={{ width: "100%", padding: "15px 24px", background: `linear-gradient(90deg,${GOLD},${GOLD_LIGHT})`, color: "#fff", fontFamily: "'Inter',sans-serif", fontSize: "14px", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" as const, border: "none", borderRadius: "10px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                Afinar mi diagnóstico <IconRight color="#fff" />
              </button>
            </motion.div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px 18px", background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.4)", borderRadius: "10px" }}>
              <div style={{ width: "18px", height: "18px", borderRadius: "50%", background: "rgba(16,185,129,0.3)", border: "1px solid rgba(16,185,129,0.6)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <IconCheck color="rgb(16,185,129)" size={10} />
              </div>
              <span style={{ fontFamily: "'Inter',sans-serif", fontSize: "13px", fontWeight: 600, color: "rgb(16,185,129)" }}>Perfil afinado — continúa tu diagnóstico</span>
            </div>
          )}
        </div>
      </div>

      {/* ── SECCIÓN 2: CRITERIO ── */}
      <AnimatePresence>
        {showCriterio && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <div style={{ borderTop: `1px solid ${NAVY_BORDER}`, background: `${NAVY_CARD}60`, padding: "56px 24px" }}>
              <div style={{ maxWidth: "680px", margin: "0 auto" }}>
                <div style={{ marginBottom: "16px" }}>
                  <span style={{ fontFamily: "'Inter',sans-serif", fontSize: "9px", fontWeight: 700, letterSpacing: "0.3em", color: GOLD, textTransform: "uppercase" as const, background: `${GOLD}15`, border: `1px solid ${GOLD}40`, borderRadius: "20px", padding: "5px 14px" }}>Estación 2 · Criterio</span>
                </div>
                <h2 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: "clamp(22px,3.5vw,36px)", fontWeight: 700, color: "#fff", lineHeight: 1.2, marginBottom: "6px" }}>Afina tu criterio</h2>
                <p style={{ fontFamily: "'Inter',sans-serif", fontSize: "14px", color: "#6A8FAF", marginBottom: "32px", lineHeight: 1.7 }}>No hay respuesta incorrecta — hay respuestas honestas.</p>

                {/* Q1 — siempre visible */}
                <div style={{ marginBottom: "24px" }}>
                  <p style={{ fontFamily: "'Inter',sans-serif", fontSize: "14px", fontWeight: 700, color: "#C8D6E8", marginBottom: "14px" }}>¿Qué porcentaje de tu patrimonio quieres dolarizar?</p>
                  <div style={{ display: "flex", flexWrap: "wrap" as const, gap: "8px" }}>
                    {["10 – 25%", "25 – 50%", "50 – 75%", "75%+"].map(v => (
                      <button key={v} onClick={() => setPatrimonioPct(patrimonioPct === v ? null : v)}
                        style={{ padding: "10px 20px", background: patrimonioPct === v ? GOLD : "transparent", color: patrimonioPct === v ? "#fff" : "#8FA5C0", fontFamily: "'Inter',sans-serif", fontSize: "13px", fontWeight: patrimonioPct === v ? 700 : 500, border: `1px solid ${patrimonioPct === v ? GOLD : NAVY_BORDER}`, borderRadius: "24px", cursor: "pointer", transition: "all 0.2s" }}>
                        {v}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Q2 — posición de riesgo, visible si patrimonioPct */}
                <AnimatePresence>
                  {patrimonioPct && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} style={{ marginBottom: "24px" }}>
                      <p style={{ fontFamily: "'Inter',sans-serif", fontSize: "14px", fontWeight: 700, color: "#C8D6E8", marginBottom: "6px" }}>¿Qué tanto representa esta inversión respecto a tu patrimonio total?</p>
                      <p style={{ fontFamily: "'Inter',sans-serif", fontSize: "12px", color: "#4A6580", marginBottom: "14px", lineHeight: 1.5 }}>Esto nos ayuda a entender tu posición de riesgo y el momento adecuado para cada vehículo.</p>
                      <div style={{ display: "flex", flexDirection: "column" as const, gap: "8px" }}>
                        {[
                          { v: "Es casi todo mi capital disponible", sub: "Posición crítica — priorizamos estructura y timing" },
                          { v: "Es una parte importante, tengo más respaldo", sub: "Posición moderada — podemos avanzar con criterio" },
                          { v: "Es una porción menor, no compromete mi patrimonio", sub: "Posición cómoda — mayor libertad para explorar" },
                          { v: "No tengo mucho efectivo, pero sí activos o propiedades", sub: "Capital en activos — exploramos cómo estructurarlo" },
                        ].map(({ v, sub }) => (
                          <button key={v} onClick={() => setPosicionRiesgo(posicionRiesgo === v ? null : v)}
                            style={{ padding: "12px 16px", background: posicionRiesgo === v ? `${GOLD}20` : "transparent", color: posicionRiesgo === v ? "#fff" : "#8FA5C0", fontFamily: "'Inter',sans-serif", fontSize: "13px", fontWeight: posicionRiesgo === v ? 700 : 500, border: `1px solid ${posicionRiesgo === v ? GOLD : NAVY_BORDER}`, borderRadius: "10px", cursor: "pointer", transition: "all 0.2s", textAlign: "left" as const }}>
                            <span style={{ display: "block", color: posicionRiesgo === v ? "#fff" : "#C8D6E8", fontWeight: 600 }}>{v}</span>
                            <span style={{ display: "block", fontSize: "11px", color: posicionRiesgo === v ? `${GOLD_LIGHT}CC` : "#4A6580", marginTop: "3px" }}>{sub}</span>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Q3 — composición del capital, visible si posicionRiesgo */}
                <AnimatePresence>
                  {posicionRiesgo && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} style={{ marginBottom: "24px" }}>
                      <p style={{ fontFamily: "'Inter',sans-serif", fontSize: "14px", fontWeight: 700, color: "#C8D6E8", marginBottom: "6px" }}>¿Cómo está compuesto principalmente el capital que planeas invertir?</p>
                      <p style={{ fontFamily: "'Inter',sans-serif", fontSize: "12px", color: "#4A6580", marginBottom: "14px", lineHeight: 1.5 }}>No importa si es una combinación — queremos entender con qué trabajamos.</p>
                      <div style={{ display: "flex", flexWrap: "wrap" as const, gap: "8px" }}>
                        {[
                          "Efectivo listo para invertir",
                          "Propiedades o bienes raíces que puedo liquidar",
                          "Mi empresa o negocio es mi principal activo",
                          "Una mezcla de efectivo y activos",
                          "Aún estoy estructurando cómo liberarlo",
                        ].map(v => (
                          <button key={v} onClick={() => setComposicionCapital(composicionCapital === v ? null : v)}
                            style={{ padding: "9px 16px", background: composicionCapital === v ? GOLD : "transparent", color: composicionCapital === v ? "#fff" : "#8FA5C0", fontFamily: "'Inter',sans-serif", fontSize: "13px", fontWeight: composicionCapital === v ? 700 : 500, border: `1px solid ${composicionCapital === v ? GOLD : NAVY_BORDER}`, borderRadius: "24px", cursor: "pointer", transition: "all 0.2s" }}>
                            {v}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Resumen cuando las 3 están respondidas */}
                <AnimatePresence>
                  {patrimonioPct && posicionRiesgo && composicionCapital && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} style={{ marginTop: "8px" }}>
                      <div style={{ display: "flex", flexWrap: "wrap" as const, gap: "8px", marginBottom: "12px" }}>
                        {[patrimonioPct, posicionRiesgo.split(" — ")[0], composicionCapital, participacionLabel].filter(Boolean).map(v => (
                          <span key={v} style={{ padding: "6px 14px", background: `${GOLD}15`, border: `1px solid ${GOLD}40`, borderRadius: "20px", fontFamily: "'Inter',sans-serif", fontSize: "12px", fontWeight: 600, color: GOLD_LIGHT }}>{v}</span>
                        ))}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ fontFamily: "'Inter',sans-serif", fontSize: "13px", color: "#6A8FAF" }}>Criterio definido — dinos en qué áreas quieres avanzar</span>
                        <motion.span animate={{ y: [0, 4, 0] }} transition={{ duration: 1.2, repeat: Infinity }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6A8FAF" strokeWidth="2" strokeLinecap="round"><polyline points="6 9 12 15 18 9" /></svg>
                        </motion.span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── SECCIÓN 3: ESTRUCTURA ── */}
      <AnimatePresence>
        {showEstructura && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <div style={{ borderTop: `1px solid ${NAVY_BORDER}`, padding: "56px 24px" }}>
              <div style={{ maxWidth: "680px", margin: "0 auto" }}>
                <div style={{ marginBottom: "16px" }}>
                  <span style={{ fontFamily: "'Inter',sans-serif", fontSize: "9px", fontWeight: 700, letterSpacing: "0.3em", color: GOLD, textTransform: "uppercase" as const, background: `${GOLD}15`, border: `1px solid ${GOLD}40`, borderRadius: "20px", padding: "5px 14px" }}>Estación 3 · Estructura</span>
                </div>
                <h2 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: "clamp(22px,3.5vw,36px)", fontWeight: 700, color: "#fff", lineHeight: 1.2, marginBottom: "6px" }}>¿En qué áreas quieres avanzar?</h2>
                <p style={{ fontFamily: "'Inter',sans-serif", fontSize: "14px", color: "#6A8FAF", marginBottom: "24px", lineHeight: 1.7 }}>Selecciona las que apliquen — guían tu ruta.</p>

                <div style={{ display: "flex", flexDirection: "column" as const, gap: "8px", marginBottom: "20px" }}>
                  {[
                    { id: "estructura-legal", label: "Estructura legal y fiscal", sub: "LLC, protección patrimonial, optimización." },
                    { id: "flujo-pasivo", label: "Flujo pasivo en dólares", sub: "Ingresos recurrentes sin gestión activa." },
                    { id: "bienes-raices", label: "Bienes raíces y activos tangibles", sub: "Propiedades con apreciación a largo plazo." },
                    { id: "expansion-empresa", label: "Expansión de mi empresa", sub: "Lleva tu operación al mercado americano." },
                    { id: "visa-residencia", label: "Visa o residencia", sub: "E-2, EB-5 según tu perfil y objetivo." },
                  ].map(({ id, label, sub }) => {
                    const sel = estructuraArea.includes(id);
                    return (
                      <button key={id} onClick={() => setEstructuraArea(sel ? estructuraArea.filter(x => x !== id) : [...estructuraArea, id])}
                        style={{ padding: "14px 16px", background: sel ? `${GOLD}18` : NAVY_CARD, border: `1.5px solid ${sel ? GOLD : NAVY_BORDER}`, borderRadius: "10px", cursor: "pointer", textAlign: "left" as const, transition: "all 0.2s", display: "flex", alignItems: "center", gap: "12px" }}>
                        <div style={{ width: "18px", height: "18px", borderRadius: "4px", border: `2px solid ${sel ? GOLD : NAVY_BORDER}`, background: sel ? GOLD : "transparent", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}>
                          {sel && <IconCheck color="#fff" size={10} />}
                        </div>
                        <div>
                          <div style={{ fontFamily: "'Inter',sans-serif", fontSize: "14px", fontWeight: 700, color: sel ? "#fff" : "#C8D6E8" }}>{label}</div>
                          <div style={{ fontFamily: "'Inter',sans-serif", fontSize: "12px", color: "#6A8FAF", lineHeight: 1.4 }}>{sub}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {estructuraArea.length > 0 && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    style={{ fontFamily: "'Inter',sans-serif", fontSize: "13px", color: "#6A8FAF", margin: 0 }}>
                    Listo — última pregunta para completar tu perfil
                  </motion.p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── SECCIÓN 4: DIAGNÓSTICO FINAL ── */}
      <AnimatePresence>
        {showDiag && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <div style={{ borderTop: `1px solid ${NAVY_BORDER}`, background: `${NAVY_CARD}60`, padding: "56px 24px" }}>
              <div style={{ maxWidth: "680px", margin: "0 auto" }}>
                <div style={{ marginBottom: "16px" }}>
                  <span style={{ fontFamily: "'Inter',sans-serif", fontSize: "9px", fontWeight: 700, letterSpacing: "0.3em", color: GOLD, textTransform: "uppercase" as const, background: `${GOLD}15`, border: `1px solid ${GOLD}40`, borderRadius: "20px", padding: "5px 14px" }}>Diagnóstico Final</span>
                </div>
                <h2 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: "clamp(22px,3vw,34px)", fontWeight: 700, color: "#fff", lineHeight: 1.2, marginBottom: "24px" }}>Tu siguiente paso</h2>

                <div style={{ display: "flex", flexDirection: "column" as const, gap: "14px" }}>
                  {/* Burbuja asesor */}
                  <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                    <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: `${GOLD}20`, border: `1px solid ${GOLD}50`, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <IconCompass color={GOLD} />
                    </div>
                    <div style={{ background: `${NAVY_CARD}CC`, border: `1px solid ${NAVY_BORDER}`, borderRadius: "0 14px 14px 14px", padding: "14px 18px", maxWidth: "420px" }}>
                      <p style={{ fontFamily: "'Inter',sans-serif", fontSize: "14px", color: "#E8ECF1", lineHeight: 1.7, margin: 0 }}>
                        Después de explorar tu ruta, ¿qué te gustaría resolver primero?
                      </p>
                    </div>
                  </div>

                  {!diagAnswer && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      style={{ paddingLeft: "48px", display: "flex", flexDirection: "column" as const, gap: "8px" }}>
                      {DIAG_OPCIONES.map(op => (
                        <button key={op.id} onClick={() => setDiagAnswer(op.id)}
                          style={{ padding: "11px 18px", background: "transparent", border: `1px solid ${NAVY_BORDER}`, borderRadius: "20px", color: "#C8D6E8", fontFamily: "'Inter',sans-serif", fontSize: "14px", cursor: "pointer", textAlign: "left" as const, transition: "all 0.2s" }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = GOLD; e.currentTarget.style.color = "#fff"; }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = NAVY_BORDER; e.currentTarget.style.color = "#C8D6E8"; }}>
                          {op.label}
                        </button>
                      ))}
                    </motion.div>
                  )}

                  {diagAnswer && (
                    <>
                      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                        style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "10px" }}>
                        <button onClick={() => { setDiagAnswer(null); setNotas(""); }}
                          style={{ background: "transparent", border: `1px solid ${NAVY_BORDER}`, borderRadius: "16px", padding: "5px 12px", cursor: "pointer", color: "#6A8FAF", fontFamily: "'Inter',sans-serif", fontSize: "11px", fontWeight: 600, display: "flex", alignItems: "center", gap: "5px", transition: "all 0.2s", flexShrink: 0 }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = GOLD; e.currentTarget.style.color = GOLD; }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = NAVY_BORDER; e.currentTarget.style.color = "#6A8FAF"; }}>
                          <IconArrowLeft color="currentColor" /> Cambiar
                        </button>
                        <div style={{ background: `${GOLD}20`, border: `1px solid ${GOLD}40`, borderRadius: "14px 0 14px 14px", padding: "12px 18px", maxWidth: "280px" }}>
                          <p style={{ fontFamily: "'Inter',sans-serif", fontSize: "14px", color: GOLD_LIGHT, margin: 0 }}>
                            {DIAG_OPCIONES.find(o => o.id === diagAnswer)?.label}
                          </p>
                        </div>
                      </motion.div>

                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
                        style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                        <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: `${GOLD}20`, border: `1px solid ${GOLD}50`, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <IconCompass color={GOLD} />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ background: `${NAVY_CARD}CC`, border: `1px solid ${NAVY_BORDER}`, borderRadius: "0 14px 14px 14px", padding: "14px 18px", marginBottom: "16px" }}>
                            <p style={{ fontFamily: "'Inter',sans-serif", fontSize: "14px", color: "#E8ECF1", lineHeight: 1.7, margin: 0 }}>
                              {DIAGNOSTICO_RESPUESTAS[diagAnswer]}
                            </p>
                          </div>
                          <div style={{ marginBottom: "12px" }}>
                            <label style={{ display: "block", fontFamily: "'Inter',sans-serif", fontSize: "12px", fontWeight: 700, letterSpacing: "0.12em", color: "#6A8FAF", textTransform: "uppercase" as const, marginBottom: "8px" }}>
                              ¿Algo más que quieras compartir? <span style={{ fontWeight: 400, color: "#4A6580" }}>(opcional)</span>
                            </label>
                            <textarea
                              value={notas}
                              onChange={e => setNotas(e.target.value)}
                              placeholder="Escribe cualquier contexto adicional..."
                              rows={3}
                              style={{ width: "100%", padding: "12px 14px", background: NAVY_CARD, border: `1.5px solid ${NAVY_BORDER}`, borderRadius: "10px", color: "#E8ECF1", fontFamily: "'Inter',sans-serif", fontSize: "14px", lineHeight: 1.6, outline: "none", resize: "vertical" as const, boxSizing: "border-box" as const }}
                            />
                          </div>
                        </div>
                      </motion.div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── SECCIÓN 5: TU RUTA RECOMENDADA ── */}
      <AnimatePresence>
        {showVehiculos && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <div style={{ borderTop: `1px solid ${NAVY_BORDER}`, padding: "56px 24px" }}>
              <div style={{ maxWidth: "680px", margin: "0 auto" }}>
                <div style={{ marginBottom: "16px" }}>
                  <span style={{ fontFamily: "'Inter',sans-serif", fontSize: "9px", fontWeight: 700, letterSpacing: "0.3em", color: GOLD, textTransform: "uppercase" as const, background: `${GOLD}15`, border: `1px solid ${GOLD}40`, borderRadius: "20px", padding: "5px 14px" }}>Estación 5 · Tu Ruta Recomendada</span>
                </div>
                <h2 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: "clamp(22px,3.5vw,36px)", fontWeight: 700, color: "#fff", lineHeight: 1.2, marginBottom: "6px" }}>Basado en tu perfil</h2>
                <p style={{ fontFamily: "'Inter',sans-serif", fontSize: "14px", color: "#6A8FAF", marginBottom: "28px", lineHeight: 1.7 }}>Estos son los vehículos más compatibles con tus respuestas.</p>

                {/* Top 3 vehículos — cards verticales compactos */}
                <div style={{ display: "flex", flexDirection: "column" as const, gap: "12px", marginBottom: "32px" }}>
                  {rankedVehicles.slice(0, 3).map((v, i) => (
                    <div key={v.id} style={{ background: NAVY_CARD, border: `1px solid ${i === 0 ? GOLD + "60" : NAVY_BORDER}`, borderRadius: "12px", padding: "18px 20px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "10px" }}>
                        <div style={{ width: "30px", height: "30px", borderRadius: "50%", background: i === 0 ? `${GOLD}20` : `${NAVY_BORDER}60`, border: `1.5px solid ${i === 0 ? GOLD : NAVY_BORDER}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <span style={{ fontFamily: "'Inter',sans-serif", fontSize: "12px", fontWeight: 700, color: i === 0 ? GOLD : "#4A6580" }}>{i + 1}</span>
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontFamily: "'Inter',sans-serif", fontSize: "14px", fontWeight: 700, color: "#fff" }}>{v.nombre}</div>
                          <div style={{ fontFamily: "'Inter',sans-serif", fontSize: "12px", color: "#6A8FAF" }}>{v.frase}</div>
                        </div>
                        <div style={{ textAlign: "center" as const, flexShrink: 0 }}>
                          <div style={{ fontFamily: "'Inter',sans-serif", fontSize: "16px", fontWeight: 700, color: i === 0 ? GOLD : "#6A8FAF" }}>{v.pct}%</div>
                          <div style={{ fontFamily: "'Inter',sans-serif", fontSize: "9px", color: "#4A6580" }}>compatibilidad</div>
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" as const, marginBottom: "12px" }}>
                        {[v.ticketLabel, v.horizonte].map((val, pi) => (
                          <div key={pi} style={{ background: `${NAVY}90`, border: `1px solid ${NAVY_BORDER}`, borderRadius: "6px", padding: "3px 10px", fontFamily: "'Inter',sans-serif", fontSize: "11px", fontWeight: 600, color: "#C8D6E8" }}>{val}</div>
                        ))}
                      </div>
                      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" as const }}>
                        <button onClick={() => setDrawerVehicle(v)}
                          style={{ padding: "8px 14px", background: i === 0 ? `${GOLD}15` : `${NAVY_BORDER}40`, border: `1px solid ${i === 0 ? GOLD + "50" : NAVY_BORDER}`, borderRadius: "8px", color: i === 0 ? GOLD : "#6A8FAF", fontFamily: "'Inter',sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" as const, cursor: "pointer" }}>
                          Ver detalle
                        </button>
                        {v.href && (
                          <a href={v.href}
                            style={{ padding: "8px 14px", background: "transparent", border: `1px solid ${NAVY_BORDER}`, borderRadius: "8px", color: "#8FA5C0", fontFamily: "'Inter',sans-serif", fontSize: "11px", fontWeight: 600, cursor: "pointer", textDecoration: "none" }}>
                            Conocer más
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Qué sigue */}
                <div style={{ marginBottom: "28px" }}>
                  <p style={{ fontFamily: "'Inter',sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "0.18em", color: `${GOLD}80`, textTransform: "uppercase" as const, marginBottom: "14px" }}>Qué sigue</p>
                  {[
                    "Validar tu estrategia patrimonial",
                    "Ingresar al Grupo Empresarial",
                    "Revisar oportunidades compatibles",
                    "Construir estructura legal y fiscal",
                    "Evaluar tu inversión específica",
                  ].map((step, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                      <span style={{ fontFamily: "'Inter',sans-serif", fontSize: "12px", fontWeight: 700, color: GOLD, flexShrink: 0 }}>Paso {i + 1}</span>
                      <span style={{ fontFamily: "'Inter',sans-serif", fontSize: "13px", color: "#C8D6E8" }}>{step}</span>
                    </div>
                  ))}
                  <a href="/grupo-empresarial-edmundo"
                    style={{ display: "inline-flex", alignItems: "center", gap: "8px", marginTop: "16px", padding: "12px 20px", background: `${GOLD}15`, border: `1px solid ${GOLD}50`, borderRadius: "10px", fontFamily: "'Inter',sans-serif", fontSize: "13px", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" as const, color: GOLD, textDecoration: "none" }}>
                    Explorar Grupo Empresarial <IconRight color={GOLD} />
                  </a>
                </div>

                {/* CTAs */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  <button onClick={openConfirm}
                    style={{ padding: "13px 18px", background: showConfirm ? `${GOLD}15` : "transparent", color: GOLD, fontFamily: "'Inter',sans-serif", fontSize: "13px", fontWeight: 600, border: `1px solid ${GOLD}`, borderRadius: "10px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                    <IconCalendar color={GOLD} /> Agendar diagnóstico
                  </button>
                  <button onClick={onCompare}
                    style={{ padding: "13px 18px", background: "transparent", color: "#6A8FAF", fontFamily: "'Inter',sans-serif", fontSize: "13px", fontWeight: 600, border: `1px solid ${NAVY_BORDER}`, borderRadius: "10px", cursor: "pointer" }}>
                    Comparar otra ruta
                  </button>
                </div>
                <p style={{ fontFamily: "'Inter',sans-serif", fontSize: "11px", color: "#4A6580", textAlign: "center" as const, marginTop: "10px" }}>
                  Las llamadas estratégicas se asignan conforme a disponibilidad del equipo.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── SOCIAL PROOF ── */}
      <SocialProofSection />

      {/* ── FICHA DE CONFIRMACIÓN ── */}
      <AnimatePresence>
        {showConfirm && contactData && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} transition={{ duration: 0.35 }}>
            <div style={{ padding: "0 24px 56px" }}>
              <div style={{ maxWidth: "680px", margin: "0 auto" }}>
                <div ref={confirmRef} style={{ background: `linear-gradient(145deg, #081628 0%, #0D2040 100%)`, border: `1.5px solid ${GOLD}50`, borderRadius: "18px", position: "relative" as const, overflow: "hidden" }}>
                  <div style={{ position: "absolute" as const, top: 0, left: 0, right: 0, height: "2px", background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)` }} />
                  {/* Header */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "24px 24px 0" }}>
                    <span style={{ fontFamily: "'Inter',sans-serif", fontSize: "9px", fontWeight: 700, letterSpacing: "0.25em", color: GOLD, textTransform: "uppercase" as const }}>Tu Ficha GPS Estratégica</span>
                    <button onClick={() => setShowConfirm(false)} style={{ background: "transparent", border: "none", cursor: "pointer", padding: "2px" }}><IconX color="#4A6580" /></button>
                  </div>
                  {/* Perfil */}
                  <div style={{ padding: "16px 24px 0" }}>
                    <p style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: "22px", fontWeight: 800, color: "#fff", margin: "0 0 6px", lineHeight: 1.2 }}>{perfil.nombre}</p>
                    <p style={{ fontFamily: "'Inter',sans-serif", fontSize: "13px", color: "#7A9AB8", lineHeight: 1.6, margin: 0 }}>{perfil.descripcion}</p>
                  </div>
                  {/* Por qué esta ruta */}
                  <div style={{ margin: "16px 24px 0", background: `${GOLD}0E`, border: `1px solid ${GOLD}25`, borderRadius: "10px", padding: "14px 16px" }}>
                    <div style={{ fontFamily: "'Inter',sans-serif", fontSize: "9px", fontWeight: 700, letterSpacing: "0.2em", color: GOLD, textTransform: "uppercase" as const, marginBottom: "6px" }}>Por qué esta ruta es para ti</div>
                    <p style={{ fontFamily: "'Inter',sans-serif", fontSize: "12px", color: "#C8D6E8", lineHeight: 1.6, margin: 0 }}>{perfil.porQueEncaja}</p>
                  </div>
                  {/* Datos del perfil */}
                  <div style={{ padding: "16px 24px 0" }}>
                    <div style={{ fontFamily: "'Inter',sans-serif", fontSize: "9px", fontWeight: 700, letterSpacing: "0.2em", color: "#4A6580", textTransform: "uppercase" as const, marginBottom: "10px" }}>Datos de tu perfil</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
                      {fichaData.map(({ label, value }) => (
                        <div key={label} style={{ background: `${NAVY}90`, border: `1px solid ${NAVY_BORDER}`, borderRadius: "8px", padding: "10px 12px" }}>
                          <div style={{ fontFamily: "'Inter',sans-serif", fontSize: "9px", color: `${GOLD}80`, textTransform: "uppercase" as const, letterSpacing: "0.12em", marginBottom: "3px" }}>{label}</div>
                          <div style={{ fontFamily: "'Inter',sans-serif", fontSize: "12px", fontWeight: 600, color: "#E8ECF1" }}>{value}</div>
                        </div>
                      ))}
                      {prioridadesLabels.length > 0 && (
                        <div style={{ gridColumn: "1 / -1", background: `${NAVY}90`, border: `1px solid ${NAVY_BORDER}`, borderRadius: "8px", padding: "10px 12px" }}>
                          <div style={{ fontFamily: "'Inter',sans-serif", fontSize: "9px", color: `${GOLD}80`, textTransform: "uppercase" as const, letterSpacing: "0.12em", marginBottom: "6px" }}>Prioridades</div>
                          <div style={{ display: "flex", flexWrap: "wrap" as const, gap: "5px" }}>
                            {prioridadesLabels.map(p => (
                              <span key={p} style={{ fontFamily: "'Inter',sans-serif", fontSize: "11px", color: "#A8BDD4", background: `${NAVY_BORDER}60`, borderRadius: "4px", padding: "2px 8px" }}>{p}</span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Tus respuestas */}
                  {(patrimonioPct || posicionRiesgo || composicionCapital || estructuraArea.length > 0 || diagAnswer || notas.trim()) && (
                    <div style={{ padding: "16px 24px 0" }}>
                      <div style={{ fontFamily: "'Inter',sans-serif", fontSize: "9px", fontWeight: 700, letterSpacing: "0.2em", color: "#4A6580", textTransform: "uppercase" as const, marginBottom: "10px" }}>Tus respuestas</div>
                      <div style={{ display: "flex", flexDirection: "column" as const, gap: "6px" }}>
                        {patrimonioPct && (
                          <div style={{ background: `${NAVY}90`, border: `1px solid ${NAVY_BORDER}`, borderRadius: "8px", padding: "10px 12px" }}>
                            <div style={{ fontFamily: "'Inter',sans-serif", fontSize: "9px", color: `${GOLD}80`, textTransform: "uppercase" as const, letterSpacing: "0.12em", marginBottom: "3px" }}>Patrimonio a dolarizar</div>
                            <div style={{ fontFamily: "'Inter',sans-serif", fontSize: "12px", fontWeight: 600, color: "#E8ECF1" }}>{patrimonioPct}</div>
                          </div>
                        )}
                        {posicionRiesgo && (
                          <div style={{ background: `${NAVY}90`, border: `1px solid ${NAVY_BORDER}`, borderRadius: "8px", padding: "10px 12px" }}>
                            <div style={{ fontFamily: "'Inter',sans-serif", fontSize: "9px", color: `${GOLD}80`, textTransform: "uppercase" as const, letterSpacing: "0.12em", marginBottom: "3px" }}>Posición de riesgo</div>
                            <div style={{ fontFamily: "'Inter',sans-serif", fontSize: "12px", fontWeight: 600, color: "#E8ECF1" }}>{posicionRiesgo.split(" — ")[0]}</div>
                          </div>
                        )}
                        {composicionCapital && (
                          <div style={{ background: `${NAVY}90`, border: `1px solid ${NAVY_BORDER}`, borderRadius: "8px", padding: "10px 12px" }}>
                            <div style={{ fontFamily: "'Inter',sans-serif", fontSize: "9px", color: `${GOLD}80`, textTransform: "uppercase" as const, letterSpacing: "0.12em", marginBottom: "3px" }}>Composición del capital</div>
                            <div style={{ fontFamily: "'Inter',sans-serif", fontSize: "12px", fontWeight: 600, color: "#E8ECF1" }}>{composicionCapital}</div>
                          </div>
                        )}
                        {estructuraArea.length > 0 && (
                          <div style={{ background: `${NAVY}90`, border: `1px solid ${NAVY_BORDER}`, borderRadius: "8px", padding: "10px 12px" }}>
                            <div style={{ fontFamily: "'Inter',sans-serif", fontSize: "9px", color: `${GOLD}80`, textTransform: "uppercase" as const, letterSpacing: "0.12em", marginBottom: "6px" }}>Áreas de interés</div>
                            <div style={{ display: "flex", flexWrap: "wrap" as const, gap: "5px" }}>
                              {estructuraArea.map(id => (
                                <span key={id} style={{ fontFamily: "'Inter',sans-serif", fontSize: "11px", color: "#A8BDD4", background: `${NAVY_BORDER}60`, borderRadius: "4px", padding: "2px 8px" }}>{AREA_LABELS[id] ?? id}</span>
                              ))}
                            </div>
                          </div>
                        )}
                        {diagAnswer && (
                          <div style={{ background: `${NAVY}90`, border: `1px solid ${NAVY_BORDER}`, borderRadius: "8px", padding: "10px 12px" }}>
                            <div style={{ fontFamily: "'Inter',sans-serif", fontSize: "9px", color: `${GOLD}80`, textTransform: "uppercase" as const, letterSpacing: "0.12em", marginBottom: "3px" }}>Qué resolver primero</div>
                            <div style={{ fontFamily: "'Inter',sans-serif", fontSize: "12px", fontWeight: 600, color: "#E8ECF1" }}>{DIAG_OPCIONES.find(o => o.id === diagAnswer)?.label ?? diagAnswer}</div>
                          </div>
                        )}
                        {notas.trim() && (
                          <div style={{ background: `${NAVY}90`, border: `1px solid ${NAVY_BORDER}`, borderRadius: "8px", padding: "10px 12px" }}>
                            <div style={{ fontFamily: "'Inter',sans-serif", fontSize: "9px", color: `${GOLD}80`, textTransform: "uppercase" as const, letterSpacing: "0.12em", marginBottom: "3px" }}>Notas adicionales</div>
                            <div style={{ fontFamily: "'Inter',sans-serif", fontSize: "12px", color: "#C8D6E8", lineHeight: 1.5 }}>{notas.trim()}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  {/* Top 3 vehículos compacto */}
                  <div style={{ padding: "16px 24px 0" }}>
                    <div style={{ fontFamily: "'Inter',sans-serif", fontSize: "9px", fontWeight: 700, letterSpacing: "0.2em", color: "#4A6580", textTransform: "uppercase" as const, marginBottom: "10px" }}>Vehículos recomendados para tu perfil</div>
                    <div style={{ display: "flex", flexDirection: "column" as const, gap: "6px" }}>
                      {rankedVehicles.slice(0, 3).map((v, i) => (
                        <div key={v.id} style={{ display: "flex", alignItems: "center", gap: "12px", background: i === 0 ? `${GOLD}10` : `${NAVY}80`, border: `1px solid ${i === 0 ? GOLD + "40" : NAVY_BORDER}`, borderRadius: "8px", padding: "10px 14px" }}>
                          <div style={{ fontFamily: "'Inter',sans-serif", fontSize: "11px", fontWeight: 700, color: i === 0 ? GOLD : "#4A6580", width: "16px", flexShrink: 0 }}>{i + 1}</div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontFamily: "'Inter',sans-serif", fontSize: "13px", fontWeight: 600, color: i === 0 ? "#fff" : "#C8D6E8" }}>{v.nombre}</div>
                            <div style={{ fontFamily: "'Inter',sans-serif", fontSize: "11px", color: "#4A6580", marginTop: "1px" }}>{v.frase}</div>
                          </div>
                          <div style={{ fontFamily: "'Inter',sans-serif", fontSize: "14px", fontWeight: 700, color: i === 0 ? GOLD : "#6A8FAF", flexShrink: 0 }}>{v.pct}%</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Datos de contacto */}
                  <div style={{ padding: "16px 24px 0" }}>
                    <div style={{ fontFamily: "'Inter',sans-serif", fontSize: "9px", fontWeight: 700, letterSpacing: "0.2em", color: "#4A6580", textTransform: "uppercase" as const, marginBottom: "10px" }}>Tus datos de contacto</div>
                    <div style={{ display: "flex", flexDirection: "column" as const, gap: "6px" }}>
                      {[
                        { label: "Nombre", value: contactData.nombre },
                        { label: "WhatsApp", value: `${contactData.countryCode} ${contactData.whatsapp}` },
                        { label: "Correo", value: contactData.email },
                      ].map(({ label, value }) => (
                        <div key={label} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "9px 14px", background: `${NAVY}80`, borderRadius: "8px" }}>
                          <div>
                            <div style={{ fontFamily: "'Inter',sans-serif", fontSize: "10px", color: "#4A6580", letterSpacing: "0.1em", textTransform: "uppercase" as const }}>{label}</div>
                            <div style={{ fontFamily: "'Inter',sans-serif", fontSize: "13px", fontWeight: 600, color: "#E8ECF1" }}>{value}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* WhatsApp CTA */}
                  <div style={{ padding: "20px 24px 28px" }}>
                    <button onClick={sendWhatsApp}
                      style={{ width: "100%", padding: "15px", background: `linear-gradient(90deg,${GOLD},${GOLD_LIGHT})`, color: "#fff", fontFamily: "'Inter',sans-serif", fontSize: "14px", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase" as const, border: "none", borderRadius: "12px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                      Enviar ficha y agendar por WhatsApp
                    </button>
                    <p style={{ fontFamily: "'Inter',sans-serif", fontSize: "11px", color: "#4A6580", textAlign: "center" as const, marginTop: "10px" }}>
                      Tu ficha completa se enviará directamente a nuestro equipo estratégico.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Biblioteca del Inversionista ── */}
      <BibliotecaSection />

      {/* ── No somos / Somos ── */}
      <NoSomosSection />

      {/* ── Footer ── */}
      <div style={{ maxWidth: "680px", margin: "0 auto", padding: "48px 24px 80px", textAlign: "center" as const }}>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
          <div style={{ width: "32px", height: "1px", background: `${GOLD}50` }} />
          <img src={LOGO_URL} alt="" style={{ height: "18px", width: "auto", opacity: 0.5 }} />
          <div style={{ width: "32px", height: "1px", background: `${GOLD}50` }} />
        </div>
        <p style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: "13px", fontStyle: "italic", color: `${GOLD}80`, lineHeight: 1.85, margin: 0 }}>
          Claridad antes de invertir.<br />Criterio antes de decidir.<br />Comunidad para ejecutar.
        </p>
      </div>

      {/* Vehicle detail drawer */}
      <VehicleDrawer vehicle={drawerVehicle} onClose={() => setDrawerVehicle(null)} />
    </div>
  );
}

/* ─── MAIN EXPORT ─── */
export default function GpsPage() {
  usePlayfairFont();
  useEffect(() => { trackPageVisit("gps"); }, []);
  const { enabled: soundEnabled, setEnabled: setSoundEnabled, playForward, playBack } = useTransitionSound();

  // Screens: 1=objetivo, 2=prioridades, 3=participacion, 4=horizonte, 5=capital, 6=loading, 7=preview, 8=contact, 9=result
  const [screen, setScreen] = useState(1);
  // El usuario llega pre-calificado desde el diagnóstico de estructura de LLC (intención de
  // inversión ya definida). Se usa para reconocer el contexto sin repetir la pregunta de propósito
  // y para etiquetar el lead como interes:inversion en el CRM.
  const [preQualified] = useState(() => {
    if (typeof window === "undefined") return false;
    const p = new URLSearchParams(window.location.search);
    return p.get("ref") === "llc-diagnostico" || p.get("intent") === "inversion";
  });
  const [objetivo, setObjetivo] = useState<string | null>(null);
  const [participacion, setParticipacion] = useState<string | null>(null);
  const [horizonte, setHorizonte] = useState<string | null>(null);
  const [capital, setCapital] = useState<string | null>(null);
  const [prioridades, setPrioridades] = useState<string[]>([]);
  const [contactData, setContactData] = useState<ContactData | null>(null);
  const [partialSent, setPartialSent] = useState(false);

  const perfil = objetivo ? PERFILES[objetivo] ?? null : null;

  const rankedVehicles = objetivo && capital && participacion
    ? rankVehicles({ objetivo, participacion, capital, prioridades })
    : [];

  function goScreen(n: number) {
    if (soundEnabled) { n > screen ? playForward() : playBack(); }
    setScreen(n);
    window.scrollTo({ top: 0, behavior: "instant" });
  }

  function handleBack() {
    // 9→8, 8→7, 7→5 (skip loading 6), 6→no back, 5→4, 4→3, 3→2, 2→1 (new order)
    const prev = screen === 9 ? 8 : screen === 8 ? 7 : screen === 7 ? 5 : screen === 5 ? 4 : screen === 4 ? 3 : screen === 3 ? 2 : 1;
    if (prev === 1) setObjetivo(null);
    goScreen(prev);
  }

  const tv = { initial: { opacity: 0, x: 40 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -40 } };
  const tt = { duration: 0.35, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] };

  return (
    <div style={{ background: NAVY, minHeight: "100dvh", position: "relative" }}>
      <FilmGrain />
      <FlowTopBar screen={screen} totalScreens={9} onBack={handleBack} />

      <AnimatePresence mode="wait">
        {screen === 1 && <motion.div key="s1" variants={tv} initial="initial" animate="animate" exit="exit" transition={tt}><Screen1 onSelect={id => { setObjetivo(id); goScreen(2); }} preQualified={preQualified} /></motion.div>}
        {screen === 2 && <motion.div key="s2" variants={tv} initial="initial" animate="animate" exit="exit" transition={tt}><Screen5Priorities onNext={ids => { setPrioridades(ids); goScreen(3); }} /></motion.div>}
        {screen === 3 && <motion.div key="s3" variants={tv} initial="initial" animate="animate" exit="exit" transition={tt}><Screen2 onNext={id => { setParticipacion(id); goScreen(4); }} /></motion.div>}
        {screen === 4 && <motion.div key="s4" variants={tv} initial="initial" animate="animate" exit="exit" transition={tt}><Screen3 onNext={v => { setHorizonte(v); goScreen(5); }} /></motion.div>}
        {screen === 5 && <motion.div key="s5" variants={tv} initial="initial" animate="animate" exit="exit" transition={tt}><Screen4Capital onNext={id => { setCapital(id); goScreen(6); }} /></motion.div>}
        {screen === 6 && <motion.div key="s6" variants={tv} initial="initial" animate="animate" exit="exit" transition={tt}><Screen6Loading onDone={() => goScreen(7)} /></motion.div>}
        {screen === 7 && perfil && <motion.div key="s7" variants={tv} initial="initial" animate="animate" exit="exit" transition={tt}><Screen7Preview perfil={perfil} rankedVehicles={rankedVehicles} objetivo={objetivo} capital={capital} onContinue={() => goScreen(8)} /></motion.div>}
        {screen === 8 && <motion.div key="s8" variants={tv} initial="initial" animate="animate" exit="exit" transition={tt}><Screen8Contact onNext={data => { setContactData(data); goScreen(9); }} partialSent={partialSent} onPartialSent={() => setPartialSent(true)} /></motion.div>}
        {screen === 9 && perfil && <motion.div key="s9" variants={tv} initial="initial" animate="animate" exit="exit" transition={tt}><ResultScreen perfil={perfil} contactData={contactData} rankedVehicles={rankedVehicles} investorData={{ objetivo, participacion, horizonte, capital, prioridades }} preQualified={preQualified} onCompare={() => { setObjetivo(null); goScreen(1); }} /></motion.div>}
      </AnimatePresence>

      <JourneyStrip screen={screen} objetivo={objetivo} participacion={participacion} horizonte={horizonte} capital={capital} />
      <SoundToggle enabled={soundEnabled} onToggle={() => setSoundEnabled(e => !e)} />
    </div>
  );
}
