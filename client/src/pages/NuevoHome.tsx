// NUEVO-HOME STAGING
// Ruta independiente de staging — no modifica ningún componente del sitio actual

import React, { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";

/* ─── Brand ─── */
const NAVY = "#0B1F3A";
const GOLD = "#2563EB";
const GOLD_LIGHT = "#3B82F6";
const NAVY_CARD = "#0F2847";
const NAVY_BORDER = "#1E3A5F";

function usePlayfairFont() {
  useEffect(() => {
    if (document.getElementById("playfair-font-nh")) return;
    const link = document.createElement("link");
    link.id = "playfair-font-nh";
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,900;1,400;1,700&display=swap";
    document.head.appendChild(link);
  }, []);
}

/* ─── Data ─── */
const PERFILES: Record<string, { nombre: string; descripcion: string; vehiculos: string[] }> = {
  patrimonio: {
    nombre: "PROTECTOR PATRIMONIAL",
    descripcion: "Tu prioridad parece estar enfocada en preservar patrimonio, diversificar riesgos y construir activos en dólares con visión de largo plazo.",
    vehiculos: ["Membresía Comprando América", "Victory Capital", "Propiedades individuales", "Estructura LLC"],
  },
  ingresos: {
    nombre: "GENERADOR DE FLUJO",
    descripcion: "Tu enfoque principal es construir una fuente de ingresos constante en dólares con activos que trabajan por ti.",
    vehiculos: ["Victory Capital", "Section 8", "Coinversiones", "Membresía Comprando América"],
  },
  empresa: {
    nombre: "EMPRESARIO EXPANSIVO",
    descripcion: "Tienes una empresa funcionando y quieres llevarla al mercado más grande del mundo con estructura legal y fiscal correcta.",
    vehiculos: ["Americaniza tu Operación", "Estructura LLC", "Adquisiciones", "Membresía Comprando América"],
  },
  familia: {
    nombre: "ARQUITECTO FAMILIAR",
    descripcion: "Tu inversión está diseñada para abrir puertas a tu familia combinando estrategia migratoria con estructuras patrimoniales.",
    vehiculos: ["Membresía Comprando América", "Estructura LLC", "Propiedades individuales", "Plan Migratorio"],
  },
  explorar: {
    nombre: "EXPLORADOR ESTRATÉGICO",
    descripcion: "Sabes que quieres estar en Estados Unidos pero aún estás definiendo tu camino. Tu ruta comienza con claridad.",
    vehiculos: ["Membresía Comprando América", "Diagnóstico Personalizado", "Mapa de Rutas", "Comunidad"],
  },
};

const OPCIONES_1 = [
  { id: "patrimonio", label: "Proteger mi patrimonio", sub: "Blindaje legal y fiscal fuera de mi país" },
  { id: "ingresos", label: "Generar ingresos en dólares", sub: "Activos que producen flujo constante" },
  { id: "empresa", label: "Expandir mi empresa", sub: "Llevar mi negocio al mercado norteamericano" },
  { id: "familia", label: "Crear opciones para mi familia", sub: "Migración, educación y futuro" },
  { id: "explorar", label: "Todavía no lo tengo claro", sub: "Quiero explorar mis posibilidades" },
];

const OPCIONES_4 = [
  { id: "flujo", label: "Flujo en dólares", sub: "Ingresos constantes y predecibles" },
  { id: "proteccion", label: "Protección patrimonial", sub: "Blindaje legal y fiscal" },
  { id: "crecimiento", label: "Crecimiento empresarial", sub: "Expansión y escala" },
  { id: "migracion", label: "Estrategia migratoria", sub: "Opciones de residencia" },
  { id: "apreciacion", label: "Apreciación del activo", sub: "Crecimiento de valor a largo plazo" },
  { id: "acceso", label: "Acceso a oportunidades", sub: "Red, comunidad y dealflow" },
];

const VEHICULOS_CATEGORIAS = [
  {
    id: "flujo",
    titulo: "Generar flujo pasivo",
    items: [
      { id: "victory-capital", nombre: "Victory Capital", frase: "Retornos en dólares con gestión profesional", participacion: "Pasiva", horizonte: "5-7 años", ticket: "100k+", href: "/fondo", exclusivo: false },
      { id: "section8", nombre: "Section 8", frase: "Renta garantizada con subsidio federal", participacion: "Semi-pasiva", horizonte: "Largo plazo", ticket: "90k+", href: "/vc-8", exclusivo: false },
      { id: "coinversiones", nombre: "Coinversiones", frase: "Participa en proyectos con socios estratégicos", participacion: "Flexible", horizonte: "2-4 años", ticket: "50k+", href: "/club-de-inversion-en-estados-unidos", exclusivo: true },
    ],
  },
  {
    id: "patrimonio",
    titulo: "Construir patrimonio",
    items: [
      { id: "real-estate", nombre: "Real Estate", frase: "Bienes raíces en mercados de alta demanda", participacion: "Semi-pasiva", horizonte: "Largo plazo", ticket: "150k+", href: "/propiedades", exclusivo: false },
      { id: "estructura-llc", nombre: "Fondos & Estructuras", frase: "Diversificación en activos americanos con protección legal", participacion: "Pasiva", horizonte: "5-10 años", ticket: "25k+", href: "/estructura-de-inversion-en-usa", exclusivo: false },
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
  headers: ["Victory Capital", "Section 8", "Círculo Cercano"],
  rows: [
    { label: "Participación", values: ["Pasiva", "Semi-pasiva", "Estratégica"] },
    { label: "Horizonte", values: ["5-7 años", "Largo plazo", "Continuo"] },
    { label: "Ticket", values: ["100k+", "90k+", "10k"] },
    { label: "Visa", values: ["No directa", "No directa", "Puede explorar"] },
    { label: "Objetivo", values: ["Flujo", "Patrimonio", "Claridad"] },
  ],
};

const BIBLIOTECA = [
  { tipo: "video", titulo: "¿Qué es una LLC y para qué sirve?", meta: "7 min", cat: "Estructura" },
  { tipo: "guia", titulo: "Proteger tu patrimonio en Estados Unidos", meta: "12 min", cat: "Patrimonio" },
  { tipo: "podcast", titulo: "Renta garantizada con Section 8", meta: "45 min", cat: "Flujo" },
  { tipo: "caso", titulo: "Empresario colombiano expande a Texas", meta: "Caso de estudio", cat: "Empresa" },
  { tipo: "video", titulo: "Victory Capital: qué es y cómo funciona", meta: "12 min", cat: "Flujo" },
  { tipo: "guia", titulo: "Las 5 estructuras más usadas por inversionistas latinos", meta: "8 min", cat: "Estructura" },
];

/* ─── Vehicle master data + ranking ─── */
type VehicleEntry = {
  id: string;
  nombre: string;
  frase: string;
  ticketMin: number; // in thousands USD, 0 = no min / consultar
  ticketLabel: string;
  horizonte: string;
  participacion: string[];
  objetivos: string[];
  prioridades: string[];
  href?: string;
};

const VEHICLE_DATA: VehicleEntry[] = [
  { id: "membresia", nombre: "Membresía Comprando América", frase: "Acceso a comunidad, red y dealflow estratégico", ticketMin: 10, ticketLabel: "$10k", horizonte: "Inmediato", participacion: ["no-operar", "supervisar", "activo", "nosc"], objetivos: ["patrimonio", "ingresos", "empresa", "familia", "explorar"], prioridades: ["acceso", "flujo", "proteccion", "crecimiento", "migracion", "apreciacion"], href: "/circulo-cercano" },
  { id: "victory-capital", nombre: "Victory Capital", frase: "Retornos en dólares con gestión profesional", ticketMin: 100, ticketLabel: "$100k+", horizonte: "5-7 años", participacion: ["no-operar", "supervisar"], objetivos: ["patrimonio", "ingresos", "explorar"], prioridades: ["flujo", "apreciacion", "proteccion"], href: "/fondo" },
  { id: "section8", nombre: "Section 8", frase: "Renta garantizada con subsidio federal", ticketMin: 90, ticketLabel: "$90k+", horizonte: "Largo plazo", participacion: ["no-operar", "supervisar"], objetivos: ["ingresos", "patrimonio"], prioridades: ["flujo", "proteccion", "apreciacion"], href: "/vc-8" },
  { id: "coinversiones", nombre: "Coinversiones", frase: "Participa en proyectos con socios estratégicos", ticketMin: 50, ticketLabel: "$50k+", horizonte: "2-4 años", participacion: ["supervisar", "activo", "nosc"], objetivos: ["ingresos", "patrimonio", "explorar"], prioridades: ["flujo", "apreciacion", "acceso"], href: "/club-de-inversion-en-estados-unidos" },
  { id: "real-estate", nombre: "Real Estate", frase: "Bienes raíces en mercados de alta demanda", ticketMin: 150, ticketLabel: "$150k+", horizonte: "Largo plazo", participacion: ["supervisar", "activo"], objetivos: ["patrimonio", "familia", "ingresos"], prioridades: ["apreciacion", "proteccion", "flujo"], href: "/propiedades" },
  { id: "estructura-llc", nombre: "Estructura LLC", frase: "Entidad legal para operar y proteger activos en USA", ticketMin: 5, ticketLabel: "$5k", horizonte: "Corto plazo", participacion: ["no-operar", "supervisar", "activo", "nosc"], objetivos: ["empresa", "familia", "patrimonio", "ingresos"], prioridades: ["proteccion", "crecimiento", "migracion"], href: "/estructura-de-inversion-en-usa" },
  { id: "americaniza", nombre: "Americaniza tu Operación", frase: "Lleva tu empresa al mercado americano", ticketMin: 0, ticketLabel: "Consultar", horizonte: "1-3 años", participacion: ["activo", "supervisar"], objetivos: ["empresa"], prioridades: ["crecimiento", "acceso", "flujo"], href: "/expansion-internacional-empresas" },
  { id: "adquisiciones", nombre: "Adquisiciones", frase: "Compra una empresa americana en operación", ticketMin: 500, ticketLabel: "$500k+", horizonte: "6-12 meses", participacion: ["activo"], objetivos: ["empresa"], prioridades: ["crecimiento", "flujo"] },
  { id: "plan-migratorio", nombre: "Plan Migratorio", frase: "Residencia con base en estructura de inversión", ticketMin: 0, ticketLabel: "Consultar", horizonte: "1-3 años", participacion: ["no-operar", "supervisar", "activo", "nosc"], objetivos: ["familia"], prioridades: ["migracion", "proteccion"], href: "/visa-e2-inversionista-usa" },
];

const CAPITAL_MAP: Record<string, number> = {
  "100k-250k": 250, "250k-500k": 500, "500k-1m": 750, "mas-1m": 1500,
};

function rankVehicles(params: { objetivo: string; participacion: string; capital: string; prioridades: string[] }) {
  const userCapital = CAPITAL_MAP[params.capital] ?? 0;
  return VEHICLE_DATA.map(v => {
    let score = 0;
    if (v.objetivos.includes(params.objetivo)) score += 30;
    if (v.ticketMin === 0 || userCapital >= v.ticketMin) score += 25;
    if (v.participacion.includes(params.participacion)) score += 20;
    const prioMatches = params.prioridades.filter(p => v.prioridades.includes(p)).length;
    score += prioMatches * 12;
    const pct = Math.min(99, score);
    return { ...v, score, pct };
  }).sort((a, b) => b.score - a.score);
}

const DIAGNOSTICO_RESPUESTAS: Record<string, string> = {
  patrimonio: "Tu siguiente paso es entender la estructura correcta para tu patrimonio. Recomendamos comenzar con una evaluación de Estructura LLC y Victory Capital.",
  invertir: "Tu siguiente paso es explorar Victory Capital o Section 8, según tu horizonte y nivel de participación deseado.",
  expandir: "Tu siguiente paso es el programa Americaniza tu Operación. Creamos el puente entre tu empresa actual y el mercado americano.",
  familia: "Tu siguiente paso incluye una evaluación de opciones migratorias y las estructuras que benefician directamente a tu familia.",
  nosc: "Eso está bien. Tu siguiente paso es un diagnóstico estratégico donde exploramos juntos tus opciones reales, sin compromisos.",
};

/* ─── SVG Icons ─── */
function IconShield({ color = GOLD }: { color?: string }) {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}
function IconDollar({ color = GOLD }: { color?: string }) {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}
function IconBuilding({ color = GOLD }: { color?: string }) {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  );
}
function IconFamily({ color = GOLD }: { color?: string }) {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
function IconCompass({ color = GOLD }: { color?: string }) {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </svg>
  );
}
function IconCheck({ color = GOLD, size = 18 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
function IconRight({ color = GOLD }: { color?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}
function IconX({ color = "#fff" }: { color?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
function IconMap({ color = GOLD }: { color?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
      <line x1="9" y1="3" x2="9" y2="18" /><line x1="15" y1="6" x2="15" y2="21" />
    </svg>
  );
}
function IconPlay({ color = GOLD }: { color?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill={color} stroke="none">
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  );
}
function IconBook({ color = GOLD }: { color?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  );
}
function IconMic({ color = GOLD }: { color?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" y1="19" x2="12" y2="23" />
    </svg>
  );
}
function IconBarChart({ color = GOLD }: { color?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  );
}
function IconCalendar({ color = NAVY }: { color?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function IconArrowLeft({ color = GOLD }: { color?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
    </svg>
  );
}

const ICON_MAP: Record<string, (p?: { color?: string }) => JSX.Element> = {
  shield: (p) => <IconShield {...p} />,
  dollar: (p) => <IconDollar {...p} />,
  building: (p) => <IconBuilding {...p} />,
  family: (p) => <IconFamily {...p} />,
  compass: (p) => <IconCompass {...p} />,
};

const LOGO_URL = "https://res.cloudinary.com/dgruohz6f/image/upload/v1773438699/comprando-america/logo.png";

/* ─── Cinematic photo catalog ─── */
const PHOTOS = {
  hero:      "https://res.cloudinary.com/dgruohz6f/image/upload/v1773438702/comprando-america/hero.webp",
  business:  "https://res.cloudinary.com/dgruohz6f/image/upload/v1773438705/comprando-america/investmentBusiness.webp",
  realEstate:"https://res.cloudinary.com/dgruohz6f/image/upload/v1773438708/comprando-america/realEstate.webp",
  expansion: "https://res.cloudinary.com/dgruohz6f/image/upload/v1773438714/comprando-america/expansion.webp",
  visa:      "https://res.cloudinary.com/dgruohz6f/image/upload/v1773438711/comprando-america/visa.webp",
  edmundo:   "https://res.cloudinary.com/dofccqypz/image/upload/v1774380282/comprando-america/edmundo-trevino-professional.jpg",
  eventos: [
    "https://res.cloudinary.com/dofccqypz/image/upload/c_fill,w_480,h_320,g_auto,q_auto,f_auto/v1774537558/comprando-america/eventos/xvdkaaxpavgr9lrybk8g.jpg",
    "https://res.cloudinary.com/dofccqypz/image/upload/c_fill,w_480,h_320,g_auto,q_auto,f_auto/v1774537561/comprando-america/eventos/fou8skfadwce2lodr5yc.jpg",
    "https://res.cloudinary.com/dofccqypz/image/upload/c_fill,w_480,h_320,g_auto,q_auto,f_auto/v1774537564/comprando-america/eventos/uefjxoxi5trojtoeivha.jpg",
    "https://res.cloudinary.com/dofccqypz/image/upload/c_fill,w_480,h_320,g_auto,q_auto,f_auto/v1774537570/comprando-america/eventos/vjyyrtfskd3w7nmklbt3.jpg",
  ],
};

/* ─── Film grain overlay (global) ─── */
function FilmGrain() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed", inset: 0, zIndex: 600, pointerEvents: "none",
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='320' height='320'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.78' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='320' height='320' filter='url(%23g)' opacity='1'/%3E%3C/svg%3E")`,
        backgroundSize: "320px 320px",
        opacity: 0.038,
      }}
    />
  );
}

/* ─── Atmospheric photo background for flow screens ─── */
function CinematicPhotoBg({ src, intensity = 0.09 }: { src: string; intensity?: number }) {
  return (
    <img
      src={src}
      aria-hidden="true"
      style={{
        position: "absolute", inset: 0, width: "100%", height: "100%",
        objectFit: "cover", objectPosition: "center",
        filter: "grayscale(85%) contrast(115%) brightness(35%)",
        opacity: intensity, zIndex: 0,
      }}
    />
  );
}

/* ─── Flow top bar — logo + back button ─── */
function FlowTopBar({ screen, onBack }: { screen: number; onBack: () => void }) {
  const canGoBack = screen >= 2 && screen !== 6;
  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 80, padding: "14px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", background: `linear-gradient(to bottom, ${NAVY}E8 0%, ${NAVY}A0 70%, transparent 100%)`, pointerEvents: "none" }}>
      {/* Logo — home link */}
      <a href="https://www.comprandoamerica.com" style={{ display: "flex", alignItems: "center", gap: "10px", pointerEvents: "auto", textDecoration: "none" }}>
        <img src={LOGO_URL} alt="Comprando América" style={{ height: "38px", width: "38px", borderRadius: "6px", objectFit: "contain" }} />
        <span style={{ fontFamily: "'Inter',sans-serif", fontSize: "13px", fontWeight: 700, letterSpacing: "0.06em", color: "#fff" }}>Comprando América</span>
      </a>
      {/* Back button */}
      {canGoBack && (
        <button onClick={onBack} style={{ pointerEvents: "auto", display: "flex", alignItems: "center", gap: "6px", background: `${NAVY_CARD}CC`, backdropFilter: "blur(8px)", border: `1px solid ${NAVY_BORDER}`, borderRadius: "20px", padding: "7px 14px", cursor: "pointer", color: "#8FA5C0", fontFamily: "'Inter',sans-serif", fontSize: "12px", fontWeight: 600, letterSpacing: "0.04em", transition: "all 0.2s" }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = GOLD; (e.currentTarget as HTMLElement).style.borderColor = GOLD; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "#8FA5C0"; (e.currentTarget as HTMLElement).style.borderColor = NAVY_BORDER; }}>
          <IconArrowLeft color="currentColor" /> Volver
        </button>
      )}
    </div>
  );
}

/* ─── Shared sub-components ─── */
function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "40px" }}>
      {Array.from({ length: total }, (_, i) => (
        <div key={i} style={{ height: "3px", flex: 1, borderRadius: "2px", background: i < current ? `linear-gradient(90deg,${GOLD},${GOLD_LIGHT})` : NAVY_BORDER, transition: "background 0.4s" }} />
      ))}
      <span style={{ fontFamily: "'Inter',sans-serif", fontSize: "12px", color: "#4A6580", marginLeft: "4px", whiteSpace: "nowrap" }}>{current} / {total}</span>
    </div>
  );
}

function GoldBtn({ children, onClick, style }: { children: React.ReactNode; onClick?: () => void; style?: React.CSSProperties }) {
  return (
    <button onClick={onClick} style={{ padding: "15px 28px", background: `linear-gradient(90deg,${GOLD},${GOLD_LIGHT})`, color: NAVY, fontFamily: "'Inter',sans-serif", fontSize: "14px", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", border: "none", borderRadius: "10px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", ...style }}>
      {children}
    </button>
  );
}

/* ─── SCREEN 1 ─── */
function Screen1({ onSelect }: { onSelect: (id: string) => void }) {
  const [hovered, setHovered] = useState<string | null>(null);
  return (
    <div style={{ position: "relative", width: "100%", minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", background: NAVY }}>

      {/* Real CA hero photo */}
      <img
        src={PHOTOS.hero}
        aria-hidden="true"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 30%", opacity: 0.28, zIndex: 0 }}
      />

      {/* Multi-layer cinematic overlay */}
      <div style={{ position: "absolute", inset: 0, zIndex: 1, background: `linear-gradient(180deg, ${NAVY}D0 0%, ${NAVY}80 40%, ${NAVY}A0 70%, ${NAVY}F0 100%)` }} />
      {/* Vignette */}
      <div style={{ position: "absolute", inset: 0, zIndex: 2, background: `radial-gradient(ellipse at 50% 50%, transparent 40%, ${NAVY}C0 100%)` }} />
      {/* Horizontal light leak top */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "180px", zIndex: 2, background: `linear-gradient(to bottom, ${NAVY} 0%, transparent 100%)` }} />
      {/* Horizontal light leak bottom */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "220px", zIndex: 2, background: `linear-gradient(to top, ${NAVY} 0%, transparent 100%)` }} />

      {/* Cinematic letterbox bars */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "52px", background: "#000", zIndex: 3, opacity: 0.55 }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "52px", background: "#000", zIndex: 3, opacity: 0.55 }} />

      {/* Gold top accent line */}
      <div style={{ position: "absolute", top: "52px", left: 0, right: 0, height: "1px", background: `linear-gradient(90deg, transparent 0%, ${GOLD}60 30%, ${GOLD}60 70%, transparent 100%)`, zIndex: 4 }} />
      <div style={{ position: "absolute", bottom: "52px", left: 0, right: 0, height: "1px", background: `linear-gradient(90deg, transparent 0%, ${GOLD}40 30%, ${GOLD}40 70%, transparent 100%)`, zIndex: 4 }} />

      {/* Content */}
      <div style={{ position: "relative", zIndex: 5, width: "100%", maxWidth: "960px", padding: "96px 24px 80px", textAlign: "center" }}>
        {/* Film title treatment */}
        <div style={{ marginBottom: "40px", display: "flex", justifyContent: "center", alignItems: "center", gap: "16px" }}>
          <div style={{ width: "60px", height: "1px", background: `linear-gradient(90deg, transparent, ${GOLD}90)` }} />
          <span style={{ fontFamily: "'Inter',sans-serif", fontSize: "9px", fontWeight: 700, letterSpacing: "0.38em", color: `${GOLD}A0`, textTransform: "uppercase" }}>GPS Estratégico · Comprando América</span>
          <div style={{ width: "60px", height: "1px", background: `linear-gradient(90deg, ${GOLD}90, transparent)` }} />
        </div>

        <h1 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: "clamp(28px,4.8vw,58px)", fontWeight: 700, color: "#fff", lineHeight: 1.15, marginBottom: "18px", textShadow: "0 4px 32px rgba(0,0,0,0.6)" }}>
          ¿Qué estás tratando de construir<br />
          <em style={{ color: GOLD_LIGHT, fontStyle: "italic" }}>en Estados Unidos?</em>
        </h1>
        {/* Brand mantra */}
        <p style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: "clamp(15px,2vw,19px)", fontStyle: "italic", color: `${GOLD_LIGHT}BB`, marginBottom: "12px", lineHeight: 1.7, maxWidth: "520px", margin: "0 auto 12px" }}>
          "No necesitas más oportunidades.<br />Necesitas saber cuál tiene sentido para ti."
        </p>
        <p style={{ fontFamily: "'Inter',sans-serif", fontSize: "13px", color: "#5A7090", marginBottom: "44px", letterSpacing: "0.01em" }}>
          Selecciona tu objetivo y construimos tu ruta exacta
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,220px),1fr))", gap: "12px", textAlign: "left" }}>
          {OPCIONES_1.map((op) => {
            const isH = hovered === op.id;
            return (
              <button key={op.id} onClick={() => onSelect(op.id)} onMouseEnter={() => setHovered(op.id)} onMouseLeave={() => setHovered(null)}
                style={{
                  background: isH ? `linear-gradient(135deg,rgba(26,53,88,0.95),rgba(18,38,68,0.98))` : `rgba(17,34,64,0.75)`,
                  backdropFilter: "blur(16px)",
                  border: `1px solid ${isH ? GOLD : "rgba(30,58,95,0.8)"}`,
                  borderRadius: "12px", padding: "22px 18px", cursor: "pointer", transition: "all 0.3s",
                  transform: isH ? "translateY(-4px)" : "none",
                  boxShadow: isH ? `0 16px 40px rgba(0,0,0,0.4), 0 0 0 1px ${GOLD}20` : "0 4px 16px rgba(0,0,0,0.3)",
                  display: "flex", flexDirection: "column", gap: "10px"
                }}>
                <div style={{ color: isH ? GOLD_LIGHT : GOLD }}>{(ICON_MAP[op.id] || ICON_MAP.compass)()}</div>
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

/* ─── SCREEN 2 ─── */
const OPCIONES_2 = [
  { id: "no-operar", label: "No quiero operar", sub: "Prefiero delegar y recibir reportes" },
  { id: "supervisar", label: "Quiero supervisar", sub: "Decisiones estratégicas, no operativas" },
  { id: "activo", label: "Quiero participar activamente", sub: "Involucrado en cada decisión" },
  { id: "nosc", label: "Todavía no lo sé", sub: "Quiero orientación para decidir" },
];
function Screen2({ onNext }: { onNext: (id: string) => void }) {
  const [sel, setSel] = useState<string | null>(null);
  return (
    <div style={{ position: "relative", minHeight: "100dvh", background: NAVY, display: "flex", alignItems: "center", justifyContent: "center", padding: "88px 24px 120px", overflow: "hidden" }}>
      <CinematicPhotoBg src={PHOTOS.business} intensity={0.08} />
      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: "600px" }}>
        <StepIndicator current={2} total={5} />
        <p style={{ fontFamily: "'Inter',sans-serif", fontSize: "13px", fontWeight: 600, letterSpacing: "0.2em", color: GOLD, textTransform: "uppercase", marginBottom: "12px" }}>Entendido.</p>
        <h2 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: "clamp(22px,3.5vw,36px)", fontWeight: 700, color: "#fff", marginBottom: "12px", lineHeight: 1.25 }}>
          ¿Qué tan involucrado deseas estar?
        </h2>
        <p style={{ fontFamily: "'Inter',sans-serif", fontSize: "14px", color: "#6A8FAF", marginBottom: "36px", lineHeight: 1.7 }}>Tu nivel de participación cambia todo. No hay respuesta incorrecta — hay respuestas honestas.</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "36px" }}>
          {OPCIONES_2.map((op) => {
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
        <motion.div animate={{ opacity: sel ? 1 : 0.3 }}>
          <GoldBtn onClick={() => sel && onNext(sel)} style={{ width: "100%", opacity: sel ? 1 : 0.4, cursor: sel ? "pointer" : "not-allowed" }}>
            Continuar <IconRight color={NAVY} />
          </GoldBtn>
        </motion.div>
      </div>
    </div>
  );
}

/* ─── SCREEN 3 ─── */
const SLIDER_POINTS = ["1 año", "3 años", "5 años", "10+ años"];
function Screen3({ onNext }: { onNext: (v: string) => void }) {
  const [sel, setSel] = useState(1);
  return (
    <div style={{ position: "relative", minHeight: "100dvh", background: NAVY, display: "flex", alignItems: "center", justifyContent: "center", padding: "88px 24px 120px", overflow: "hidden" }}>
      <CinematicPhotoBg src={PHOTOS.realEstate} intensity={0.09} />
      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: "600px" }}>
        <StepIndicator current={3} total={5} />
        <h2 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: "clamp(22px,3.5vw,36px)", fontWeight: 700, color: "#fff", marginBottom: "12px" }}>¿Qué horizonte imaginas?</h2>
        <p style={{ fontFamily: "'Inter',sans-serif", fontSize: "14px", color: "#6A8FAF", marginBottom: "64px", lineHeight: 1.7 }}>El tiempo cambia completamente la estrategia. ¿En qué momento de tu vida financiera estás hoy?</p>
        <div style={{ position: "relative", paddingBottom: "50px" }}>
          <div style={{ height: "4px", background: NAVY_BORDER, borderRadius: "2px", margin: "0 18px" }}>
            <div style={{ position: "absolute", left: "18px", top: 0, height: "4px", borderRadius: "2px", background: `linear-gradient(90deg,${GOLD},${GOLD_LIGHT})`, width: `${(sel / 3) * 100}%`, transition: "width 0.3s" }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", position: "absolute", top: "-13px", left: "18px", right: "18px" }}>
            {SLIDER_POINTS.map((_, i) => (
              <button key={i} onClick={() => setSel(i)}
                style={{ width: "28px", height: "28px", borderRadius: "50%", border: `2px solid ${i <= sel ? GOLD : NAVY_BORDER}`, background: i === sel ? GOLD : i < sel ? "#1A3558" : NAVY_CARD, cursor: "pointer", transition: "all 0.25s", transform: i === sel ? "scale(1.3)" : "scale(1)", boxShadow: i === sel ? `0 0 16px ${GOLD}60` : "none", padding: 0 }} />
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "26px", padding: "0 4px" }}>
            {SLIDER_POINTS.map((p, i) => (
              <span key={i} style={{ fontFamily: "'Inter',sans-serif", fontSize: "12px", fontWeight: i === sel ? 700 : 400, color: i === sel ? GOLD : "#4A6580", transition: "all 0.2s", minWidth: "44px", textAlign: "center" }}>{p}</span>
            ))}
          </div>
        </div>
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <span style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: "52px", fontWeight: 700, color: GOLD }}>{SLIDER_POINTS[sel]}</span>
        </div>
        <GoldBtn onClick={() => onNext(SLIDER_POINTS[sel])} style={{ width: "100%" }}>
          Continuar <IconRight color={NAVY} />
        </GoldBtn>
      </div>
    </div>
  );
}

/* ─── SCREEN 4 — Capital disponible ─── */
const OPCIONES_CAPITAL = [
  { id: "100k-250k", label: "$100k – $250k USD", sub: "Vehículos de flujo, coinversiones y bienes raíces" },
  { id: "250k-500k", label: "$250k – $500k USD", sub: "Estrategias de alto impacto patrimonial" },
  { id: "500k-1m", label: "$500k – $1M USD", sub: "Adquisiciones, fondos y estructuras avanzadas" },
  { id: "mas-1m", label: "Más de $1M USD", sub: "Estructuras institucionales y portafolios complejos" },
];
function Screen4Capital({ onNext }: { onNext: (id: string) => void }) {
  const [sel, setSel] = useState<string | null>(null);
  return (
    <div style={{ position: "relative", minHeight: "100dvh", background: NAVY, display: "flex", alignItems: "center", justifyContent: "center", padding: "88px 24px 120px", overflow: "hidden" }}>
      <CinematicPhotoBg src={PHOTOS.expansion} intensity={0.08} />
      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: "600px" }}>
        <StepIndicator current={4} total={5} />
        <h2 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: "clamp(22px,3.5vw,36px)", fontWeight: 700, color: "#fff", marginBottom: "10px", lineHeight: 1.25, position: "relative", zIndex: 1 }}>
          ¿Cuánto capital tienes disponible?
        </h2>
        <p style={{ fontFamily: "'Inter',sans-serif", fontSize: "14px", color: "#6A8FAF", marginBottom: "36px", lineHeight: 1.7 }}>
          No estamos evaluando tu patrimonio. Estamos mapeando desde dónde empezar para mostrarte solo lo que hoy es posible para ti.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "36px" }}>
          {OPCIONES_CAPITAL.map((op) => {
            const isSel = sel === op.id;
            return (
              <button key={op.id} onClick={() => setSel(op.id)}
                style={{ background: isSel ? `linear-gradient(135deg,#1A3558,#122644)` : NAVY_CARD, border: `2px solid ${isSel ? GOLD : NAVY_BORDER}`, borderRadius: "12px", padding: "16px 22px", cursor: "pointer", display: "flex", alignItems: "center", gap: "16px", transition: "all 0.2s", textAlign: "left" }}>
                <div style={{ width: "20px", height: "20px", borderRadius: "50%", border: `2px solid ${isSel ? GOLD : NAVY_BORDER}`, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: isSel ? GOLD : "transparent", transition: "all 0.2s" }}>
                  {isSel && <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: NAVY }} />}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: "'Inter',sans-serif", fontSize: "15px", fontWeight: 600, color: isSel ? "#fff" : "#C8D6E8" }}>{op.label}</div>
                  <div style={{ fontFamily: "'Inter',sans-serif", fontSize: "12px", color: "#6A8FAF", marginTop: "2px" }}>{op.sub}</div>
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
        <motion.div animate={{ opacity: sel ? 1 : 0.3 }}>
          <GoldBtn onClick={() => sel && onNext(sel)} style={{ width: "100%", opacity: sel ? 1 : 0.4, cursor: sel ? "pointer" : "not-allowed" }}>
            Continuar <IconRight color={NAVY} />
          </GoldBtn>
        </motion.div>
      </div>
    </div>
  );
}

/* ─── SCREEN 5 (prioridades, was Screen 4) ─── */
function Screen4({ onNext }: { onNext: (ids: string[]) => void }) {
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
        <StepIndicator current={5} total={5} />
        <h2 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: "clamp(22px,3.5vw,36px)", fontWeight: 700, color: "#fff", marginBottom: "10px" }}>¿Qué pesa más en tu decisión?</h2>
        <p style={{ fontFamily: "'Inter',sans-serif", fontSize: "14px", color: "#6A8FAF", marginBottom: "8px", lineHeight: 1.7 }}>Cada inversionista tiene una brújula diferente. ¿Qué es lo que más importa en este momento de tu vida?</p>
        <p style={{ fontFamily: "'Inter',sans-serif", fontSize: "13px", color: "#4A6580", marginBottom: "28px" }}>Selecciona hasta <strong style={{ color: GOLD }}>2 opciones</strong></p>
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
        <motion.div animate={{ opacity: sel.length > 0 ? 1 : 0.3 }}>
          <GoldBtn onClick={() => sel.length > 0 && onNext(sel)} style={{ width: "100%", cursor: sel.length > 0 ? "pointer" : "not-allowed" }}>
            Ver mi ruta estratégica <IconRight color={NAVY} />
          </GoldBtn>
        </motion.div>
      </div>
    </div>
  );
}

/* ─── SCREEN 5 ─── */
function Screen5({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const iv = setInterval(() => {
      setProgress(p => { if (p >= 100) { clearInterval(iv); setTimeout(onDone, 300); return 100; } return p + 2.5; });
    }, 62);
    return () => clearInterval(iv);
  }, [onDone]);
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
      <h2 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: "clamp(20px,3vw,30px)", fontWeight: 600, color: "#fff", textAlign: "center", marginBottom: "8px" }}>
        Construyendo tu Ruta Estratégica...
      </h2>
      <p style={{ fontFamily: "'Inter',sans-serif", fontSize: "14px", color: "#6A8FAF", marginBottom: "44px", textAlign: "center" }}>Analizando tu perfil de inversionista</p>
      <div style={{ width: "100%", maxWidth: "340px", height: "4px", background: NAVY_BORDER, borderRadius: "2px", overflow: "hidden" }}>
        <motion.div style={{ height: "100%", background: `linear-gradient(90deg,${GOLD},${GOLD_LIGHT})`, borderRadius: "2px" }} animate={{ width: `${progress}%` }} transition={{ ease: "easeOut" }} />
      </div>
      <div style={{ marginTop: "14px", fontFamily: "'Inter',sans-serif", fontSize: "13px", color: GOLD, fontWeight: 600 }}>{Math.round(progress)}%</div>
    </div>
  );
}

/* ─── SCREEN 6 — Contact form ─── */
function IconUser({ color = GOLD }: { color?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
  );
}
function IconPhone({ color = GOLD }: { color?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.86 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.77 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.16 6.16l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}
function IconMail({ color = GOLD }: { color?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
    </svg>
  );
}

type ContactData = { nombre: string; whatsapp: string; email: string };

function Screen6Contact({ onNext }: { onNext: (data: ContactData) => void }) {
  const [form, setForm] = useState<ContactData>({ nombre: "", whatsapp: "", email: "" });
  const [errors, setErrors] = useState<Partial<ContactData>>({});
  const [focused, setFocused] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function validate() {
    const e: Partial<ContactData> = {};
    if (!form.nombre.trim()) e.nombre = "Tu nombre es necesario";
    if (!form.whatsapp.trim() || form.whatsapp.replace(/\D/g, "").length < 7) e.whatsapp = "Ingresa un número válido";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Ingresa un correo válido";
    return e;
  }

  function handleSubmit() {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setSubmitting(true);
    // Small delay for perceived processing
    setTimeout(() => onNext(form), 600);
  }

  function field(id: keyof ContactData, label: string, placeholder: string, icon: JSX.Element, type = "text") {
    const isFoc = focused === id;
    const hasErr = !!errors[id];
    return (
      <div style={{ marginBottom: "20px" }}>
        <label style={{ display: "flex", alignItems: "center", gap: "8px", fontFamily: "'Inter',sans-serif", fontSize: "12px", fontWeight: 700, letterSpacing: "0.12em", color: hasErr ? "#E05C5C" : isFoc ? GOLD : "#6A8FAF", textTransform: "uppercase", marginBottom: "8px", transition: "color 0.2s" }}>
          {icon} {label}
        </label>
        <input
          type={type}
          value={form[id]}
          placeholder={placeholder}
          onFocus={() => { setFocused(id); setErrors(prev => ({ ...prev, [id]: undefined })); }}
          onBlur={() => setFocused(null)}
          onChange={e => setForm(prev => ({ ...prev, [id]: e.target.value }))}
          style={{ width: "100%", padding: "14px 16px", background: NAVY_CARD, border: `1.5px solid ${hasErr ? "#E05C5C" : isFoc ? GOLD : NAVY_BORDER}`, borderRadius: "10px", color: "#E8ECF1", fontFamily: "'Inter',sans-serif", fontSize: "15px", outline: "none", transition: "border-color 0.2s", boxSizing: "border-box" }}
        />
        {hasErr && <p style={{ fontFamily: "'Inter',sans-serif", fontSize: "12px", color: "#E05C5C", marginTop: "5px", marginLeft: "2px" }}>{errors[id]}</p>}
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100dvh", background: NAVY, display: "flex", alignItems: "center", justifyContent: "center", padding: "88px 24px 120px" }}>
      <div style={{ width: "100%", maxWidth: "520px" }}>
        {/* Icon */}
        <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: `${GOLD}18`, border: `1.5px solid ${GOLD}50`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "28px" }}>
          <IconCompass color={GOLD} />
        </div>

        <h2 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: "clamp(22px,3.5vw,36px)", fontWeight: 700, color: "#fff", marginBottom: "10px", lineHeight: 1.2 }}>
          Tu ruta está lista.<br />
          <em style={{ color: GOLD_LIGHT, fontStyle: "italic" }}>¿A quién se la enviamos?</em>
        </h2>
        <p style={{ fontFamily: "'Inter',sans-serif", fontSize: "14px", color: "#6A8FAF", marginBottom: "36px", lineHeight: 1.7 }}>
          Ingresa tus datos para recibir tu perfil y ruta estratégica personalizada.
        </p>

        {/* Form */}
        <div>
          {field("nombre", "Nombre", "Tu nombre completo", <IconUser />, "text")}
          {field("whatsapp", "WhatsApp", "+52 55 1234 5678", <IconPhone />, "tel")}
          {field("email", "Correo electrónico", "tu@correo.com", <IconMail />, "email")}
        </div>

        <p style={{ fontFamily: "'Inter',sans-serif", fontSize: "11px", color: "#4A6580", marginBottom: "24px", lineHeight: 1.6 }}>
          Tu información es confidencial. No compartimos datos con terceros.
        </p>

        <motion.button
          onClick={handleSubmit}
          disabled={submitting}
          animate={{ opacity: submitting ? 0.7 : 1 }}
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

/* ─── METRO LINE ─── */
const METRO_STATIONS = ["Claridad", "Comunidad", "Estructura", "Vehículos", "Ejecución"];
function MetroLine() {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
      <svg width="40" height="264" viewBox="0 0 40 264" fill="none">
        <line x1="20" y1="12" x2="20" y2="252" stroke={NAVY_BORDER} strokeWidth="3" />
        <line x1="20" y1="12" x2="20" y2="252" stroke={GOLD} strokeWidth="3" />
        {METRO_STATIONS.map((_, i) => (
          <g key={i}>
            <circle cx="20" cy={12 + i * 60} r="9" fill={NAVY_CARD} stroke={GOLD} strokeWidth="2" />
            <circle cx="20" cy={12 + i * 60} r="4" fill={GOLD} />
          </g>
        ))}
      </svg>
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "264px", paddingTop: "4px" }}>
        {METRO_STATIONS.map((s, i) => (
          <div key={i} style={{ height: "52px", display: "flex", alignItems: "center" }}>
            <span style={{ fontFamily: "'Inter',sans-serif", fontSize: "14px", fontWeight: i === 0 ? 700 : 500, color: i === 0 ? GOLD : "#8FA5C0" }}>{s}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── RESULT SCREEN ─── */
const PARTICIPACION_LABELS: Record<string, string> = {
  "no-operar": "Delegar", "supervisar": "Supervisar", "activo": "Activo", "nosc": "Por definir",
};
const CAPITAL_LABELS: Record<string, string> = {
  "100k-250k": "$100k–$250k", "250k-500k": "$250k–$500k", "500k-1m": "$500k–$1M", "mas-1m": "+$1M",
};

function ResultScreen({ perfil, contactData, rankedVehicles, investorData, onUnderstandRoute, onCompare }: {
  perfil: (typeof PERFILES)[string];
  contactData: ContactData | null;
  rankedVehicles: (VehicleEntry & { score: number; pct: number })[];
  investorData: { objetivo: string | null; participacion: string | null; horizonte: string | null; capital: string | null; prioridades: string[] };
  onUnderstandRoute: () => void;
  onCompare: () => void;
}) {
  const [showConfirm, setShowConfirm] = useState(false);
  const confirmRef = useRef<HTMLDivElement>(null);

  const firstName = contactData?.nombre?.trim().split(" ")[0] ?? "";
  const topVehicles = rankedVehicles.slice(0, 5);

  const objetivoLabel = OPCIONES_1.find(o => o.id === investorData.objetivo)?.label ?? "";
  const capitalLabel = CAPITAL_LABELS[investorData.capital ?? ""] ?? "";
  const participacionLabel = PARTICIPACION_LABELS[investorData.participacion ?? ""] ?? "";
  const horizonteLabel = investorData.horizonte ?? "";

  const fichaData = [
    { label: "Objetivo", value: objetivoLabel },
    { label: "Capital", value: capitalLabel },
    { label: "Rol", value: participacionLabel },
    { label: "Horizonte", value: horizonteLabel },
  ].filter(f => f.value);

  function openConfirm() {
    setShowConfirm(true);
    setTimeout(() => confirmRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }), 80);
  }

  function sendWhatsApp() {
    const nombre = contactData?.nombre ?? "";
    const whatsapp = contactData?.whatsapp ?? "";
    const email = contactData?.email ?? "";
    const msg = [
      `Hola, soy ${nombre}. Acabo de completar el GPS Estratégico de Comprando América.`,
      "",
      "── FICHA DE PERFIL ──",
      `Perfil: ${perfil.nombre}`,
      fichaData.map(f => `${f.label}: ${f.value}`).join(" · "),
      "",
      perfil.descripcion,
      "",
      "── VEHÍCULOS COMPATIBLES ──",
      ...topVehicles.slice(0, 3).map((v) => `• ${v.nombre} — ${v.pct}% compatibilidad`),
      "",
      "── MIS DATOS DE CONTACTO ──",
      `Nombre: ${nombre}`,
      `WhatsApp: ${whatsapp}`,
      `Correo: ${email}`,
      "",
      "Me gustaría agendar un diagnóstico estratégico.",
    ].join("\n");
    window.open(`https://wa.me/523346766178?text=${encodeURIComponent(msg)}`, "_blank");
  }

  return (
    <div style={{ minHeight: "100dvh", background: NAVY, overflowY: "auto" }}>

      {/* ── FICHA DE PERFIL GPS ── */}
      <div style={{ position: "relative", background: `linear-gradient(180deg, #0A1A30 0%, ${NAVY} 100%)`, padding: "80px 24px 0", overflow: "hidden" }}>
        {/* Decorative background grid lines */}
        <div aria-hidden="true" style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(${GOLD}08 1px, transparent 1px), linear-gradient(90deg, ${GOLD}08 1px, transparent 1px)`, backgroundSize: "60px 60px", zIndex: 0 }} />
        {/* Top gold accent line */}
        <div style={{ position: "absolute", top: "80px", left: 0, right: 0, height: "1px", background: `linear-gradient(90deg, transparent 0%, ${GOLD}70 20%, ${GOLD}70 80%, transparent 100%)`, zIndex: 1 }} />

        <div style={{ position: "relative", zIndex: 2, maxWidth: "680px", margin: "0 auto" }}>
          {/* Label row */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
            <div style={{ width: "28px", height: "1px", background: GOLD }} />
            <span style={{ fontFamily: "'Inter',sans-serif", fontSize: "9px", fontWeight: 700, letterSpacing: "0.35em", color: GOLD, textTransform: "uppercase" }}>GPS · Comprando América</span>
          </div>

          {/* Profile name — dramatic cinematic heading */}
          <h1 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: "clamp(32px,6vw,64px)", fontWeight: 900, color: "#fff", lineHeight: 1.05, marginBottom: "16px", letterSpacing: "-0.01em" }}>
            {perfil.nombre}
          </h1>

          {firstName && (
            <p style={{ fontFamily: "'Inter',sans-serif", fontSize: "15px", color: "#8FA5C0", marginBottom: "32px" }}>
              Hola, <span style={{ color: "#fff", fontWeight: 600 }}>{firstName}</span> — esta es tu ruta estratégica.
            </p>
          )}

          {/* Ficha data — investor's own answers as summary */}
          {fichaData.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: `repeat(${fichaData.length}, 1fr)`, gap: "1px", background: `${GOLD}20`, border: `1px solid ${GOLD}30`, borderRadius: "12px", overflow: "hidden", marginBottom: "0" }}>
              {fichaData.map(({ label, value }) => (
                <div key={label} style={{ background: `rgba(10,26,48,0.9)`, padding: "16px 14px" }}>
                  <div style={{ fontFamily: "'Inter',sans-serif", fontSize: "9px", fontWeight: 700, letterSpacing: "0.2em", color: `${GOLD}90`, textTransform: "uppercase", marginBottom: "6px" }}>{label}</div>
                  <div style={{ fontFamily: "'Inter',sans-serif", fontSize: "13px", fontWeight: 600, color: "#E8ECF1", lineHeight: 1.3 }}>{value}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom fade into main content */}
        <div style={{ height: "48px", background: `linear-gradient(to bottom, transparent, ${NAVY})`, marginTop: "0" }} />
      </div>

      <div style={{ maxWidth: "680px", margin: "0 auto", padding: "0 24px 100px" }}>
        {/* Description */}
        <p style={{ fontFamily: "'Inter',sans-serif", fontSize: "16px", color: "#8FA5C0", lineHeight: 1.75, marginBottom: "48px", maxWidth: "520px" }}>{perfil.descripcion}</p>
        <div style={{ marginBottom: "48px" }}>
          <h3 style={{ fontFamily: "'Inter',sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", color: GOLD, textTransform: "uppercase", marginBottom: "24px" }}>Tu Ruta Recomendada</h3>
          <MetroLine />
        </div>
        <div style={{ marginBottom: "44px" }}>
          <h3 style={{ fontFamily: "'Inter',sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", color: GOLD, textTransform: "uppercase", marginBottom: "6px" }}>Vehículos recomendados</h3>
          <p style={{ fontFamily: "'Inter',sans-serif", fontSize: "12px", color: "#4A6580", marginBottom: "18px" }}>Ordenados por compatibilidad con tu perfil y capital disponible</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {topVehicles.map((v, i) => (
              <div key={v.id} style={{ background: NAVY_CARD, border: `1px solid ${i === 0 ? GOLD + "60" : NAVY_BORDER}`, borderRadius: "12px", padding: "16px 18px", display: "flex", flexDirection: "column", gap: "12px" }}>
                {/* Top row: rank + info + pct */}
                <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                  <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: i === 0 ? `${GOLD}20` : `${NAVY_BORDER}60`, border: `1.5px solid ${i === 0 ? GOLD : NAVY_BORDER}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ fontFamily: "'Inter',sans-serif", fontSize: "12px", fontWeight: 700, color: i === 0 ? GOLD : "#4A6580" }}>{i + 1}</span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "2px", flexWrap: "wrap" }}>
                      <span style={{ fontFamily: "'Inter',sans-serif", fontSize: "14px", fontWeight: 600, color: i === 0 ? "#fff" : "#C8D6E8" }}>{v.nombre}</span>
                      {i === 0 && <span style={{ fontFamily: "'Inter',sans-serif", fontSize: "9px", fontWeight: 700, letterSpacing: "0.15em", color: NAVY, background: GOLD, borderRadius: "4px", padding: "2px 6px", textTransform: "uppercase" }}>Mejor match</span>}
                    </div>
                    <div style={{ fontFamily: "'Inter',sans-serif", fontSize: "11px", color: "#4A6580" }}>{v.frase}</div>
                    <div style={{ display: "flex", gap: "8px", marginTop: "6px", flexWrap: "wrap" }}>
                      <span style={{ fontFamily: "'Inter',sans-serif", fontSize: "10px", color: "#6A8FAF", background: `${NAVY_BORDER}80`, borderRadius: "4px", padding: "2px 7px" }}>{v.ticketLabel}</span>
                      <span style={{ fontFamily: "'Inter',sans-serif", fontSize: "10px", color: "#6A8FAF", background: `${NAVY_BORDER}80`, borderRadius: "4px", padding: "2px 7px" }}>{v.horizonte}</span>
                    </div>
                  </div>
                  <div style={{ flexShrink: 0, textAlign: "center" }}>
                    <div style={{ fontFamily: "'Inter',sans-serif", fontSize: "17px", fontWeight: 700, color: i === 0 ? GOLD : "#6A8FAF" }}>{v.pct}%</div>
                    <div style={{ fontFamily: "'Inter',sans-serif", fontSize: "9px", color: "#4A6580", letterSpacing: "0.05em" }}>compatibilidad</div>
                  </div>
                </div>
                {/* Explorar link */}
                {v.href && (
                  <a href={v.href}
                    style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", padding: "9px 0", background: i === 0 ? `${GOLD}15` : `${NAVY_BORDER}40`, border: `1px solid ${i === 0 ? GOLD + "50" : NAVY_BORDER}`, borderRadius: "8px", color: i === 0 ? GOLD : "#6A8FAF", fontFamily: "'Inter',sans-serif", fontSize: "12px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", textDecoration: "none", transition: "background 0.2s" }}>
                    Conocer más <IconRight color={i === 0 ? GOLD : "#6A8FAF"} />
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
        {/* ── Grupo Empresarial de Edmundo ── */}
        <div style={{ marginBottom: "44px" }}>
          <h3 style={{ fontFamily: "'Inter',sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", color: GOLD, textTransform: "uppercase", marginBottom: "18px" }}>Próximo Paso Recomendado</h3>
          <div style={{ background: `linear-gradient(135deg, #0D1F3C 0%, #0F2847 100%)`, border: `1px solid ${GOLD}50`, borderRadius: "16px", padding: "28px 24px", position: "relative", overflow: "hidden" }}>
            {/* Gold accent line */}
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)` }} />
            {/* Premium badge */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <img src={LOGO_URL} alt="" style={{ height: "28px", width: "28px", borderRadius: "6px", opacity: 0.9 }} />
                <div>
                  <div style={{ fontFamily: "'Inter',sans-serif", fontSize: "9px", fontWeight: 700, letterSpacing: "0.25em", color: `${GOLD}90`, textTransform: "uppercase" }}>Comprando América</div>
                  <div style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: "17px", fontWeight: 700, color: "#fff", lineHeight: 1.2 }}>Grupo Empresarial de Edmundo</div>
                </div>
              </div>
              <span style={{ fontFamily: "'Inter',sans-serif", fontSize: "9px", fontWeight: 700, letterSpacing: "0.15em", color: NAVY, background: GOLD, borderRadius: "4px", padding: "3px 8px", textTransform: "uppercase", flexShrink: 0 }}>Exclusivo</span>
            </div>
            <p style={{ fontFamily: "'Inter',sans-serif", fontSize: "14px", color: "#8FA5C0", lineHeight: 1.75, marginBottom: "20px" }}>
              Antes de invertir, lo más valioso es tener claridad. En el Círculo exploramos tus opciones, desarrollamos criterio, definimos el momento correcto y estructuramos una ruta para Estados Unidos — con opción a visa, según tu capital y caso particular.
            </p>
            {/* Ficha del diagnóstico */}
            {fichaData.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "20px" }}>
                {fichaData.map(({ label, value }) => (
                  <div key={label} style={{ background: `${NAVY}90`, border: `1px solid ${NAVY_BORDER}`, borderRadius: "8px", padding: "6px 12px" }}>
                    <span style={{ fontFamily: "'Inter',sans-serif", fontSize: "10px", color: `${GOLD}80`, textTransform: "uppercase", letterSpacing: "0.12em" }}>{label}: </span>
                    <span style={{ fontFamily: "'Inter',sans-serif", fontSize: "11px", fontWeight: 600, color: "#C8D6E8" }}>{value}</span>
                  </div>
                ))}
              </div>
            )}
            <div style={{ display: "flex", gap: "10px" }}>
              <a href="/membresia-2" style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "12px 22px", background: `linear-gradient(90deg,${GOLD},${GOLD_LIGHT})`, color: NAVY, fontFamily: "'Inter',sans-serif", fontSize: "13px", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", border: "none", borderRadius: "9px", cursor: "pointer", textDecoration: "none" }}>
                Explorar Grupo Empresarial de Edmundo <IconRight color={NAVY} />
              </a>
            </div>
          </div>
        </div>

        {/* ── CTA principal ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "16px" }}>
          <GoldBtn onClick={onUnderstandRoute} style={{ width: "100%" }}>
            Quiero entender esta ruta <IconRight color={NAVY} />
          </GoldBtn>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            <button onClick={openConfirm}
              style={{ padding: "13px 18px", background: showConfirm ? `${GOLD}15` : "transparent", color: GOLD, fontFamily: "'Inter',sans-serif", fontSize: "13px", fontWeight: 600, border: `1px solid ${GOLD}`, borderRadius: "10px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", transition: "background 0.2s" }}>
              <IconCalendar color={GOLD} /> Agendar diagnóstico
            </button>
            <button onClick={onCompare}
              style={{ padding: "13px 18px", background: "transparent", color: "#6A8FAF", fontFamily: "'Inter',sans-serif", fontSize: "13px", fontWeight: 600, border: `1px solid ${NAVY_BORDER}`, borderRadius: "10px", cursor: "pointer" }}>
              Comparar otra ruta
            </button>
          </div>
        </div>

        {/* ── Tarjeta de confirmación ── */}
        <AnimatePresence>
          {showConfirm && contactData && (
            <motion.div ref={confirmRef}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.3 }}
              style={{ background: `linear-gradient(135deg, #091830 0%, #0D1F3C 100%)`, border: `1.5px solid ${GOLD}50`, borderRadius: "16px", padding: "28px 24px", marginBottom: "16px", position: "relative", overflow: "hidden" }}>
              {/* Top gold bar */}
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)` }} />

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "22px" }}>
                <p style={{ fontFamily: "'Inter',sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "0.22em", color: GOLD, textTransform: "uppercase", margin: 0 }}>Confirma tu solicitud</p>
                <button onClick={() => setShowConfirm(false)}
                  style={{ background: "transparent", border: "none", cursor: "pointer", color: "#4A6580", padding: "2px", lineHeight: 1 }}>
                  <IconX color="#4A6580" />
                </button>
              </div>

              {/* Perfil GPS */}
              <div style={{ marginBottom: "18px" }}>
                <p style={{ fontFamily: "'Inter',sans-serif", fontSize: "10px", fontWeight: 700, letterSpacing: "0.18em", color: `${GOLD}80`, textTransform: "uppercase", marginBottom: "8px" }}>Tu perfil GPS</p>
                <p style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: "16px", fontWeight: 700, color: "#fff", marginBottom: "10px" }}>{perfil.nombre}</p>
                {fichaData.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                    {fichaData.map(({ label, value }) => (
                      <span key={label} style={{ fontFamily: "'Inter',sans-serif", fontSize: "11px", background: `${NAVY_CARD}CC`, border: `1px solid ${NAVY_BORDER}`, borderRadius: "20px", padding: "4px 10px", color: "#8FA5C0" }}>
                        <span style={{ color: `${GOLD}90` }}>{label}:</span> <strong style={{ color: "#C8D6E8" }}>{value}</strong>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Separador */}
              <div style={{ height: "1px", background: `${NAVY_BORDER}80`, marginBottom: "18px" }} />

              {/* Datos de contacto */}
              <div style={{ marginBottom: "22px" }}>
                <p style={{ fontFamily: "'Inter',sans-serif", fontSize: "10px", fontWeight: 700, letterSpacing: "0.18em", color: `${GOLD}80`, textTransform: "uppercase", marginBottom: "12px" }}>Datos de contacto</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {[
                    { label: "Nombre", value: contactData.nombre, icon: "👤" },
                    { label: "WhatsApp", value: contactData.whatsapp, icon: "📱" },
                    { label: "Correo", value: contactData.email, icon: "✉️" },
                  ].map(({ label, value, icon }) => (
                    <div key={label} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 14px", background: `${NAVY}80`, borderRadius: "8px" }}>
                      <span style={{ fontSize: "14px", flexShrink: 0 }}>{icon}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontFamily: "'Inter',sans-serif", fontSize: "10px", color: "#4A6580", letterSpacing: "0.1em", textTransform: "uppercase" }}>{label}</div>
                        <div style={{ fontFamily: "'Inter',sans-serif", fontSize: "13px", fontWeight: 600, color: "#E8ECF1", wordBreak: "break-all" }}>{value}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Confirm CTA */}
              <button onClick={sendWhatsApp}
                style={{ width: "100%", padding: "15px", background: `linear-gradient(90deg,${GOLD},${GOLD_LIGHT})`, color: NAVY, fontFamily: "'Inter',sans-serif", fontSize: "14px", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", border: "none", borderRadius: "10px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill={NAVY}><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                Confirmar y agendar por WhatsApp
              </button>
              <p style={{ fontFamily: "'Inter',sans-serif", fontSize: "11px", color: "#4A6580", textAlign: "center", marginTop: "10px" }}>
                Esta información se enviará directamente a nuestro equipo.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Institutional phrase */}
        <div style={{ marginTop: "56px", paddingTop: "32px", borderTop: `1px solid ${NAVY_BORDER}`, textAlign: "center" }}>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "12px", marginBottom: "14px" }}>
            <div style={{ width: "32px", height: "1px", background: `${GOLD}50` }} />
            <img src={LOGO_URL} alt="" style={{ height: "22px", width: "22px", opacity: 0.6, borderRadius: "4px" }} />
            <div style={{ width: "32px", height: "1px", background: `${GOLD}50` }} />
          </div>
          <p style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: "13px", fontStyle: "italic", color: `${GOLD}80`, lineHeight: 1.85, margin: 0 }}>
            Claridad antes de invertir.<br />Criterio antes de decidir.<br />Comunidad para ejecutar.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─── MAIN CONTENT — STICKY NAV ─── */
const NAV_ITEMS = [
  { id: "ruta", label: "Mi Ruta" },
  { id: "vehiculos", label: "Explorar Vehículos" },
  { id: "comparar", label: "Comparar Estrategias" },
  { id: "biblioteca", label: "Biblioteca" },
  { id: "diagnostico", label: "Diagnóstico" },
];
function StickyNav({ active, onNav }: { active: string; onNav: (id: string) => void }) {
  return (
    <nav style={{ position: "sticky", top: 0, zIndex: 50, background: `${NAVY}F2`, backdropFilter: "blur(16px)", borderBottom: `1px solid ${NAVY_BORDER}`, padding: "0 24px" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto", display: "flex", alignItems: "center", gap: "4px", overflowX: "auto", scrollbarWidth: "none" }}>
        <span style={{ fontFamily: "'Inter',sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "0.18em", color: GOLD, textTransform: "uppercase", paddingRight: "20px", whiteSpace: "nowrap", paddingTop: "16px", paddingBottom: "16px", borderRight: `1px solid ${NAVY_BORDER}`, marginRight: "8px" }}>GPS</span>
        {NAV_ITEMS.map((item) => (
          <button key={item.id} onClick={() => onNav(item.id)}
            style={{ fontFamily: "'Inter',sans-serif", fontSize: "13px", fontWeight: active === item.id ? 700 : 500, color: active === item.id ? GOLD : "#6A8FAF", background: "transparent", border: "none", cursor: "pointer", padding: "16px 14px", whiteSpace: "nowrap", borderBottom: `2px solid ${active === item.id ? GOLD : "transparent"}`, transition: "all 0.2s" }}>
            {item.label}
          </button>
        ))}
      </div>
    </nav>
  );
}

/* ─── SECTION HEADER ─── */
function SectionHeader({ label, title, sub }: { label: string; title: string; sub?: string }) {
  return (
    <div style={{ marginBottom: "48px" }}>
      <span style={{ fontFamily: "'Inter',sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "0.22em", color: GOLD, textTransform: "uppercase", display: "block", marginBottom: "12px" }}>{label}</span>
      <h2 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: "clamp(24px,3.5vw,40px)", fontWeight: 700, color: "#fff", lineHeight: 1.2, marginBottom: sub ? "14px" : 0 }}>{title}</h2>
      {sub && <p style={{ fontFamily: "'Inter',sans-serif", fontSize: "15px", color: "#6A8FAF", maxWidth: "520px", lineHeight: 1.7 }}>{sub}</p>}
    </div>
  );
}

/* ─── MAPA ESTRATÉGICO (Mi Ruta) ─── */
function StationDot({ n, active }: { n: number; active: boolean }) {
  return (
    <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: active ? GOLD : NAVY_CARD, border: `2px solid ${active ? GOLD : NAVY_BORDER}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <span style={{ fontFamily: "'Inter',sans-serif", fontSize: "13px", fontWeight: 700, color: active ? NAVY : "#4A6580" }}>{n}</span>
    </div>
  );
}

const ESTRUCTURA_CARDS = [
  { id: "patrimonio", label: "Patrimonio", desc: "¿Quién será el propietario del activo?" },
  { id: "fiscal", label: "Fiscal", desc: "Optimiza la carga impositiva de tus operaciones" },
  { id: "legal", label: "Legal", desc: "Protege tu empresa con estructuras sólidas" },
  { id: "sucesion", label: "Sucesión", desc: "Transfiere tu patrimonio con claridad" },
  { id: "migracion", label: "Migración", desc: "Abre puertas a la residencia desde tu inversión" },
];

const CRITERIO_QS = [
  { id: "pct", pregunta: "¿Qué porcentaje de tu patrimonio quieres dolarizar?", opciones: ["10 - 25%", "25 - 50%", "50 - 75%", "75%+"] },
  { id: "liq", pregunta: "¿Qué tan importante es la liquidez?", opciones: ["Crítica", "Importante", "Secundaria"] },
  { id: "op", pregunta: "¿Quieres operar o delegar?", opciones: ["Operar", "Supervisar", "Delegar totalmente"] },
];

function MiRutaSection({ objetivo }: { objetivo: string | null }) {
  const [criterio, setCriterio] = useState<Record<string, string>>({});
  const [estructuraSel, setEstructuraSel] = useState<string | null>(null);
  const [activeStation, setActiveStation] = useState(1);
  const perfil = objetivo ? PERFILES[objetivo] : null;

  return (
    <div style={{ padding: "80px 24px" }}>
      <div style={{ maxWidth: "860px", margin: "0 auto" }}>
        <SectionHeader label="Estación 1 · Claridad" title="¿Dónde estás hoy?" />

        {/* Station 1: Claridad */}
        <div style={{ background: NAVY_CARD, border: `1px solid ${NAVY_BORDER}`, borderRadius: "16px", padding: "32px", marginBottom: "16px" }}>
          {perfil && (
            <>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "20px", marginBottom: "24px" }}>
                <StationDot n={1} active={activeStation >= 1} />
                <div>
                  <div style={{ fontFamily: "'Inter',sans-serif", fontSize: "12px", fontWeight: 700, letterSpacing: "0.15em", color: GOLD, textTransform: "uppercase", marginBottom: "8px" }}>Claridad</div>
                  <p style={{ fontFamily: "'Inter',sans-serif", fontSize: "15px", color: "#C8D6E8", lineHeight: 1.7, maxWidth: "520px" }}>
                    Eres un <strong style={{ color: "#fff" }}>{perfil.nombre.toLowerCase().replace(" patrimonial", "").replace(" de flujo", "").replace(" expansivo", "").replace(" familiar", "").replace(" estratégico", "")}</strong> con visión de largo plazo en Estados Unidos. Antes de invertir, es importante definir la estructura correcta.
                  </p>
                </div>
              </div>
              {/* Video placeholder */}
              <div style={{ background: `${NAVY}80`, borderRadius: "12px", border: `1px solid ${NAVY_BORDER}`, padding: "24px", display: "flex", alignItems: "center", gap: "16px", marginBottom: "20px", cursor: "pointer" }}>
                <div style={{ width: "52px", height: "52px", borderRadius: "50%", background: `${GOLD}20`, border: `1px solid ${GOLD}50`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <IconPlay color={GOLD} />
                </div>
                <div>
                  <div style={{ fontFamily: "'Inter',sans-serif", fontSize: "14px", fontWeight: 600, color: "#E8ECF1", marginBottom: "4px" }}>Edmundo te explica tu ruta en 60 segundos</div>
                  <div style={{ fontFamily: "'Inter',sans-serif", fontSize: "12px", color: "#6A8FAF" }}>Video — 1:00 min</div>
                </div>
              </div>
              <button onClick={() => setActiveStation(Math.max(activeStation, 2))}
                style={{ background: "transparent", border: `1px solid ${GOLD}`, color: GOLD, fontFamily: "'Inter',sans-serif", fontSize: "13px", fontWeight: 600, padding: "10px 20px", borderRadius: "8px", cursor: "pointer" }}>
                Esto describe mi situación
              </button>
            </>
          )}
        </div>

        {/* Station 2: Criterio */}
        <AnimatePresence>
          {activeStation >= 2 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
              style={{ background: NAVY_CARD, border: `1px solid ${NAVY_BORDER}`, borderRadius: "16px", padding: "32px", marginBottom: "16px" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "20px", marginBottom: "28px" }}>
                <StationDot n={2} active={activeStation >= 2} />
                <div>
                  <div style={{ fontFamily: "'Inter',sans-serif", fontSize: "12px", fontWeight: 700, letterSpacing: "0.15em", color: GOLD, textTransform: "uppercase", marginBottom: "8px" }}>Criterio</div>
                  <div style={{ fontFamily: "'Inter',sans-serif", fontSize: "14px", color: "#6A8FAF" }}>Cada respuesta calibra tu experiencia</div>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                {CRITERIO_QS.map((q, qi) => (
                  <div key={q.id}>
                    <div style={{ fontFamily: "'Inter',sans-serif", fontSize: "14px", fontWeight: 600, color: "#C8D6E8", marginBottom: "10px" }}>{q.pregunta}</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                      {q.opciones.map((op) => {
                        const isSel = criterio[q.id] === op;
                        return (
                          <button key={op} onClick={() => { setCriterio(c => ({ ...c, [q.id]: op })); if (qi === CRITERIO_QS.length - 1) setActiveStation(Math.max(activeStation, 3)); }}
                            style={{ padding: "8px 16px", background: isSel ? GOLD : "transparent", color: isSel ? NAVY : "#8FA5C0", fontFamily: "'Inter',sans-serif", fontSize: "13px", fontWeight: isSel ? 700 : 400, border: `1px solid ${isSel ? GOLD : NAVY_BORDER}`, borderRadius: "6px", cursor: "pointer", transition: "all 0.2s" }}>
                            {op}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Station 3: Estructura */}
        <AnimatePresence>
          {activeStation >= 3 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
              style={{ background: NAVY_CARD, border: `1px solid ${NAVY_BORDER}`, borderRadius: "16px", padding: "32px", marginBottom: "16px" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "20px", marginBottom: "28px" }}>
                <StationDot n={3} active={activeStation >= 3} />
                <div>
                  <div style={{ fontFamily: "'Inter',sans-serif", fontSize: "12px", fontWeight: 700, letterSpacing: "0.15em", color: GOLD, textTransform: "uppercase", marginBottom: "8px" }}>Estructura</div>
                  <p style={{ fontFamily: "'Inter',sans-serif", fontSize: "14px", color: "#6A8FAF", maxWidth: "440px", lineHeight: 1.6 }}>Antes de invertir, es importante definir la estructura correcta. Selecciona el área que más te interesa explorar.</p>
                </div>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                {ESTRUCTURA_CARDS.map((c) => {
                  const isSel = estructuraSel === c.id;
                  return (
                    <button key={c.id} onClick={() => { setEstructuraSel(isSel ? null : c.id); setActiveStation(Math.max(activeStation, 4)); }}
                      style={{ background: isSel ? `linear-gradient(135deg,#1A3558,#0F2847)` : `${NAVY}80`, border: `1px solid ${isSel ? GOLD : NAVY_BORDER}`, borderRadius: "10px", padding: "14px 18px", cursor: "pointer", textAlign: "left", transition: "all 0.2s", minWidth: "140px" }}>
                      <div style={{ fontFamily: "'Inter',sans-serif", fontSize: "13px", fontWeight: 700, color: isSel ? GOLD : "#C8D6E8", marginBottom: "4px" }}>{c.label}</div>
                      <div style={{ fontFamily: "'Inter',sans-serif", fontSize: "11px", color: "#4A6580" }}>{c.desc}</div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stations 4 & 5 teasers */}
        {[
          { n: 4, label: "Vehículos", desc: "Explora los instrumentos de inversión disponibles para tu perfil" },
          { n: 5, label: "Ejecución", desc: "Define tu próximo paso concreto hacia el mercado americano" },
        ].map((s) => (
          <div key={s.n} style={{ background: `${NAVY_CARD}80`, border: `1px solid ${NAVY_BORDER}40`, borderRadius: "16px", padding: "24px 32px", marginBottom: "16px", display: "flex", alignItems: "center", gap: "20px", opacity: activeStation >= s.n ? 1 : 0.4 }}>
            <StationDot n={s.n} active={activeStation >= s.n} />
            <div>
              <div style={{ fontFamily: "'Inter',sans-serif", fontSize: "12px", fontWeight: 700, letterSpacing: "0.15em", color: GOLD, textTransform: "uppercase", marginBottom: "4px" }}>{s.label}</div>
              <div style={{ fontFamily: "'Inter',sans-serif", fontSize: "13px", color: "#4A6580" }}>{s.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── EXPLORAR VEHÍCULOS ─── */
function VehiculoCard({ v, recommended, categoriaTag }: { v: typeof VEHICULOS_CATEGORIAS[0]["items"][0]; recommended?: boolean; categoriaTag?: string }) {
  return (
    <div style={{ background: NAVY_CARD, border: `1px solid ${recommended ? GOLD + "70" : NAVY_BORDER}`, borderRadius: "14px", padding: "22px", minWidth: "230px", maxWidth: "255px", flexShrink: 0, display: "flex", flexDirection: "column", gap: "11px", position: "relative", overflow: "hidden" }}>
      {recommended && (
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: `linear-gradient(90deg,${GOLD},${GOLD_LIGHT})` }} />
      )}
      {/* Header badges */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "8px" }}>
        {categoriaTag && (
          <span style={{ fontFamily: "'Inter',sans-serif", fontSize: "9px", fontWeight: 700, letterSpacing: "0.14em", color: "#6A8FAF", background: `${NAVY_BORDER}80`, borderRadius: "4px", padding: "2px 7px", textTransform: "uppercase", whiteSpace: "nowrap" }}>{categoriaTag}</span>
        )}
        {!categoriaTag && <div style={{ height: "3px", background: recommended ? `linear-gradient(90deg,${GOLD},${GOLD_LIGHT})` : NAVY_BORDER, borderRadius: "2px", width: recommended ? "36px" : "20px" }} />}
        {recommended && (
          <span style={{ fontFamily: "'Inter',sans-serif", fontSize: "9px", fontWeight: 700, letterSpacing: "0.15em", color: NAVY, background: GOLD, borderRadius: "4px", padding: "2px 7px", textTransform: "uppercase", whiteSpace: "nowrap" }}>Tu perfil</span>
        )}
      </div>
      <h4 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: "17px", fontWeight: 700, color: recommended ? "#fff" : "#C8D6E8", lineHeight: 1.2, margin: 0 }}>{v.nombre}</h4>
      <p style={{ fontFamily: "'Inter',sans-serif", fontSize: "12px", color: "#6A8FAF", lineHeight: 1.6, flex: 1, margin: 0 }}>{v.frase}</p>
      <div style={{ borderTop: `1px solid ${NAVY_BORDER}`, paddingTop: "10px", display: "flex", flexDirection: "column", gap: "5px" }}>
        {[["Participación", v.participacion], ["Horizonte", v.horizonte], ["Ticket mínimo", v.ticket]].map(([k, val]) => (
          <div key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontFamily: "'Inter',sans-serif", fontSize: "10px", color: "#4A6580" }}>{k}</span>
            <span style={{ fontFamily: "'Inter',sans-serif", fontSize: "11px", fontWeight: 600, color: "#C8D6E8" }}>{val}</span>
          </div>
        ))}
      </div>
      {v.exclusivo ? (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", padding: "9px", background: `${GOLD}12`, border: `1px solid ${GOLD}40`, color: `${GOLD}CC`, fontFamily: "'Inter',sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", borderRadius: "8px" }}>
          ✦ Exclusivo
        </div>
      ) : v.href ? (
        <a href={v.href} style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", padding: "9px", background: recommended ? `linear-gradient(90deg,${GOLD},${GOLD_LIGHT})` : "transparent", border: recommended ? "none" : `1px solid ${GOLD}`, color: recommended ? NAVY : GOLD, fontFamily: "'Inter',sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", borderRadius: "8px", cursor: "pointer", textDecoration: "none" }}>
          Explorar
        </a>
      ) : null}
    </div>
  );
}

function ExplorarVehiculosSection({ rankedIds }: { rankedIds?: string[] }) {
  const [vista, setVista] = useState<"perfil" | "explorar">("perfil");
  const [tabIdx, setTabIdx] = useState(0);
  const top3Ids = (rankedIds ?? []).slice(0, 3);
  const top3Set = new Set(top3Ids);

  // Build "Tu perfil" cards: up to 3 matched, ordered by rank, with category tag
  const perfilCards: { item: typeof VEHICULOS_CATEGORIAS[0]["items"][0]; cat: typeof VEHICULOS_CATEGORIAS[0] }[] = [];
  for (const id of top3Ids) {
    for (const cat of VEHICULOS_CATEGORIAS) {
      const item = cat.items.find(i => i.id === id);
      if (item) { perfilCards.push({ item, cat }); break; }
    }
  }

  const activeCat = VEHICULOS_CATEGORIAS[tabIdx];

  const btnBase: React.CSSProperties = { fontFamily: "'Inter',sans-serif", fontSize: "12px", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", padding: "9px 22px", borderRadius: "22px", cursor: "pointer", transition: "all 0.2s", border: "none" };
  const btnActive: React.CSSProperties = { ...btnBase, background: GOLD, color: NAVY };
  const btnInactive: React.CSSProperties = { ...btnBase, background: "transparent", color: "#6A8FAF", border: `1px solid ${NAVY_BORDER}` };

  const tabBase: React.CSSProperties = { fontFamily: "'Inter',sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: "8px 16px", borderRadius: "6px", cursor: "pointer", transition: "all 0.2s", border: "none", whiteSpace: "nowrap" };

  return (
    <div style={{ padding: "72px 0 60px", background: `${NAVY_CARD}40`, borderTop: `1px solid ${NAVY_BORDER}`, borderBottom: `1px solid ${NAVY_BORDER}` }}>
      <div style={{ padding: "0 24px", maxWidth: "1100px", margin: "0 auto" }}>
        <SectionHeader label="Vehículos Estratégicos" title="Explora tus instrumentos" sub="Cada instrumento está diseñado para un perfil específico de inversionista." />

        {/* Toggle buttons */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "36px" }}>
          <button onClick={() => setVista("perfil")} style={vista === "perfil" ? btnActive : btnInactive}>
            Tu Perfil
          </button>
          <button onClick={() => setVista("explorar")} style={vista === "explorar" ? btnActive : btnInactive}>
            Explorar todos
          </button>
        </div>

        {/* ── Tu Perfil view ── */}
        {vista === "perfil" && (
          perfilCards.length > 0 ? (
            <div>
              <p style={{ fontFamily: "'Inter',sans-serif", fontSize: "13px", color: `${GOLD}CC`, marginBottom: "24px", display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ display: "inline-block", width: "7px", height: "7px", borderRadius: "50%", background: GOLD }} />
                Mostrando los instrumentos que mejor encajan con tu perfil GPS Estratégico
              </p>
              <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
                {perfilCards.map(({ item, cat }) => (
                  <VehiculoCard key={item.id} v={item} recommended categoriaTag={cat.titulo} />
                ))}
              </div>
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "48px 0", color: "#4A6580", fontFamily: "'Inter',sans-serif", fontSize: "14px" }}>
              Completa el GPS Estratégico para ver tus instrumentos recomendados.
            </div>
          )
        )}

        {/* ── Explorar view ── */}
        {vista === "explorar" && (
          <div>
            {/* Category tabs */}
            <div style={{ display: "flex", gap: "8px", marginBottom: "28px", overflowX: "auto", scrollbarWidth: "none", paddingBottom: "4px" }}>
              {VEHICULOS_CATEGORIAS.map((cat, i) => (
                <button key={cat.id} onClick={() => setTabIdx(i)}
                  style={{ ...tabBase, background: tabIdx === i ? `${GOLD}18` : "transparent", color: tabIdx === i ? GOLD : "#6A8FAF", border: tabIdx === i ? `1px solid ${GOLD}50` : `1px solid ${NAVY_BORDER}` }}>
                  — {cat.titulo}
                </button>
              ))}
            </div>
            {/* Cards for selected category */}
            <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
              {activeCat.items.map((v) => (
                <VehiculoCard key={v.id} v={v} recommended={top3Set.has(v.id)} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── COMPARAR ─── */
function CompararSection() {
  const [highlighted, setHighlighted] = useState<number | null>(null);
  return (
    <div style={{ padding: "80px 24px", background: NAVY }}>
      <div style={{ maxWidth: "860px", margin: "0 auto" }}>
        <SectionHeader label="Comparador Inteligente" title="Compara estrategias" sub="Elige el vehículo que mejor se adapta a tu horizonte, nivel de participación y objetivo principal." />
        <div style={{ overflowX: "auto", borderRadius: "16px", border: `1px solid ${NAVY_BORDER}` }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "500px" }}>
            <thead>
              <tr style={{ background: NAVY_CARD }}>
                <th style={{ padding: "16px 20px", textAlign: "left", fontFamily: "'Inter',sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "0.15em", color: "#4A6580", textTransform: "uppercase", borderBottom: `1px solid ${NAVY_BORDER}` }} />
                {COMPARACION.headers.map((h, i) => (
                  <th key={h} onClick={() => setHighlighted(highlighted === i ? null : i)}
                    style={{ padding: "16px 20px", textAlign: "center", fontFamily: "'Playfair Display',Georgia,serif", fontSize: "16px", fontWeight: 700, color: highlighted === i ? GOLD : "#fff", borderBottom: `1px solid ${NAVY_BORDER}`, cursor: "pointer", background: highlighted === i ? `${GOLD}10` : "transparent", transition: "all 0.2s", borderRight: i < COMPARACION.headers.length - 1 ? `1px solid ${NAVY_BORDER}` : "none" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COMPARACION.rows.map((row, ri) => (
                <tr key={row.label} style={{ background: ri % 2 === 0 ? `${NAVY}80` : NAVY_CARD }}>
                  <td style={{ padding: "14px 20px", fontFamily: "'Inter',sans-serif", fontSize: "13px", fontWeight: 600, color: "#6A8FAF", borderBottom: `1px solid ${NAVY_BORDER}40` }}>{row.label}</td>
                  {row.values.map((val, i) => (
                    <td key={i} style={{ padding: "14px 20px", textAlign: "center", fontFamily: "'Inter',sans-serif", fontSize: "13px", fontWeight: highlighted === i ? 700 : 500, color: highlighted === i ? GOLD : "#C8D6E8", background: highlighted === i ? `${GOLD}08` : "transparent", borderBottom: `1px solid ${NAVY_BORDER}40`, borderRight: i < row.values.length - 1 ? `1px solid ${NAVY_BORDER}20` : "none", transition: "all 0.2s" }}>
                      {val}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{ fontFamily: "'Inter',sans-serif", fontSize: "12px", color: "#4A6580", marginTop: "16px", textAlign: "center" }}>Haz clic en el nombre de un vehículo para resaltar su columna</p>
      </div>
    </div>
  );
}

/* ─── BIBLIOTECA ─── */
const TIPO_ICONS: Record<string, () => JSX.Element> = {
  video: () => <IconPlay />,
  guia: () => <IconBook />,
  podcast: () => <IconMic />,
  caso: () => <IconBarChart />,
};
const TIPO_LABELS: Record<string, string> = { video: "Video", guia: "Guía", podcast: "Podcast", caso: "Caso" };

function BibliotecaSection({ objetivo }: { objetivo: string | null }) {
  const [filtro, setFiltro] = useState<string>("todos");
  const tipos = ["todos", "video", "guia", "podcast", "caso"];
  const filtrados = filtro === "todos" ? BIBLIOTECA : BIBLIOTECA.filter(b => b.tipo === filtro);
  return (
    <div style={{ padding: "80px 24px", background: `${NAVY_CARD}40`, borderTop: `1px solid ${NAVY_BORDER}` }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        <SectionHeader label="Biblioteca del Inversionista" title="Aprende a tu ritmo" sub="Contenido curado para empresarios latinos que quieren entender antes de decidir." />
        <div style={{ display: "flex", gap: "8px", marginBottom: "36px", flexWrap: "wrap" }}>
          {tipos.map((t) => (
            <button key={t} onClick={() => setFiltro(t)}
              style={{ padding: "8px 16px", background: filtro === t ? GOLD : "transparent", color: filtro === t ? NAVY : "#6A8FAF", fontFamily: "'Inter',sans-serif", fontSize: "12px", fontWeight: filtro === t ? 700 : 500, border: `1px solid ${filtro === t ? GOLD : NAVY_BORDER}`, borderRadius: "20px", cursor: "pointer", textTransform: "capitalize", transition: "all 0.2s" }}>
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
                <span style={{ fontFamily: "'Inter',sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", color: GOLD, textTransform: "uppercase" }}>{TIPO_LABELS[item.tipo] || item.tipo}</span>
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

/* ─── NO SOMOS ─── */
function NoSomosSection() {
  return (
    <div style={{ minHeight: "80vh", background: NAVY, display: "flex", alignItems: "center", padding: "80px 24px", borderTop: `1px solid ${NAVY_BORDER}` }}>
      <div style={{ maxWidth: "960px", margin: "0 auto", width: "100%" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,400px),1fr))", gap: "64px" }}>
          <div>
            <div style={{ fontFamily: "'Inter',sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "0.25em", color: "#4A6580", textTransform: "uppercase", marginBottom: "28px" }}>No somos</div>
            {["Un catálogo de inversiones.", "Un marketplace financiero.", "Un despacho migratorio.", "Una empresa de trámites."].map((t) => (
              <div key={t} style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "16px" }}>
                <div style={{ width: "20px", height: "2px", background: "#4A6580", flexShrink: 0 }} />
                <span style={{ fontFamily: "'Inter',sans-serif", fontSize: "16px", color: "#4A6580", textDecoration: "line-through" }}>{t}</span>
              </div>
            ))}
          </div>
          <div>
            <div style={{ fontFamily: "'Inter',sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "0.25em", color: GOLD, textTransform: "uppercase", marginBottom: "28px" }}>Somos</div>
            {["Arquitectos de decisiones.", "Constructores de criterio.", "Comunidad de empresarios.", "Curadores de oportunidades.", "Socios estratégicos."].map((t) => (
              <div key={t} style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "16px" }}>
                <div style={{ width: "20px", height: "2px", background: GOLD, flexShrink: 0 }} />
                <span style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: "18px", fontWeight: 600, color: "#fff" }}>{t}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ marginTop: "64px", borderTop: `1px solid ${NAVY_BORDER}`, paddingTop: "48px", textAlign: "center" }}>
          <blockquote style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: "clamp(20px,2.5vw,28px)", fontStyle: "italic", color: GOLD_LIGHT, lineHeight: 1.5, maxWidth: "640px", margin: "0 auto" }}>
            "No necesitas más oportunidades.<br />Necesitas saber cuál tiene sentido para ti."
          </blockquote>
        </div>
      </div>
    </div>
  );
}

/* ─── DIAGNÓSTICO ─── */
const DIAG_OPCIONES = [
  { id: "patrimonio", label: "Proteger mi patrimonio" },
  { id: "invertir", label: "Invertir" },
  { id: "expandir", label: "Expandirme" },
  { id: "familia", label: "Explorar opciones familiares" },
  { id: "nosc", label: "No estoy seguro" },
];
function DiagnosticoSection() {
  const [answer, setAnswer] = useState<string | null>(null);
  return (
    <div style={{ padding: "80px 24px 100px", background: NAVY_CARD, borderTop: `1px solid ${NAVY_BORDER}` }}>
      <div style={{ maxWidth: "640px", margin: "0 auto" }}>
        <SectionHeader label="Diagnóstico Final" title="Tu siguiente paso" />
        {/* Chat UI */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Bot message */}
          <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: `${GOLD}20`, border: `1px solid ${GOLD}50`, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <IconCompass color={GOLD} />
            </div>
            <div style={{ background: `${NAVY}80`, border: `1px solid ${NAVY_BORDER}`, borderRadius: "0 14px 14px 14px", padding: "16px 20px", maxWidth: "460px" }}>
              <p style={{ fontFamily: "'Inter',sans-serif", fontSize: "15px", color: "#E8ECF1", lineHeight: 1.7, margin: 0 }}>
                Después de explorar tu ruta, ¿qué te gustaría resolver primero?
              </p>
            </div>
          </div>

          {/* Options */}
          {!answer && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ paddingLeft: "48px", display: "flex", flexDirection: "column", gap: "8px" }}>
              {DIAG_OPCIONES.map((op) => (
                <button key={op.id} onClick={() => setAnswer(op.id)}
                  style={{ padding: "11px 18px", background: "transparent", border: `1px solid ${NAVY_BORDER}`, borderRadius: "20px", color: "#C8D6E8", fontFamily: "'Inter',sans-serif", fontSize: "14px", cursor: "pointer", textAlign: "left", transition: "all 0.2s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = GOLD; e.currentTarget.style.color = "#fff"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = NAVY_BORDER; e.currentTarget.style.color = "#C8D6E8"; }}>
                  {op.label}
                </button>
              ))}
            </motion.div>
          )}

          {/* User answer bubble */}
          {answer && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "10px" }}>
              <button onClick={() => setAnswer(null)}
                style={{ background: "transparent", border: `1px solid ${NAVY_BORDER}`, borderRadius: "16px", padding: "5px 12px", cursor: "pointer", color: "#6A8FAF", fontFamily: "'Inter',sans-serif", fontSize: "11px", fontWeight: 600, display: "flex", alignItems: "center", gap: "5px", transition: "all 0.2s", flexShrink: 0 }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = GOLD; e.currentTarget.style.color = GOLD; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = NAVY_BORDER; e.currentTarget.style.color = "#6A8FAF"; }}>
                <IconArrowLeft color="currentColor" /> Cambiar
              </button>
              <div style={{ background: `${GOLD}20`, border: `1px solid ${GOLD}40`, borderRadius: "14px 0 14px 14px", padding: "12px 18px", maxWidth: "340px" }}>
                <p style={{ fontFamily: "'Inter',sans-serif", fontSize: "14px", color: GOLD_LIGHT, margin: 0 }}>
                  {DIAG_OPCIONES.find(o => o.id === answer)?.label}
                </p>
              </div>
            </motion.div>
          )}

          {/* Bot recommendation */}
          {answer && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
              <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: `${GOLD}20`, border: `1px solid ${GOLD}50`, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <IconCompass color={GOLD} />
              </div>
              <div>
                <div style={{ background: `${NAVY}80`, border: `1px solid ${NAVY_BORDER}`, borderRadius: "0 14px 14px 14px", padding: "16px 20px", maxWidth: "460px", marginBottom: "16px" }}>
                  <p style={{ fontFamily: "'Inter',sans-serif", fontSize: "15px", color: "#E8ECF1", lineHeight: 1.7, margin: 0 }}>
                    {DIAGNOSTICO_RESPUESTAS[answer]}
                  </p>
                </div>
                <GoldBtn onClick={() => window.location.href = "/"}>
                  <IconCalendar color={NAVY} /> Agendar Diagnóstico Estratégico
                </GoldBtn>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── TRANSITION SOUND ─── */
function useTransitionSound() {
  const ctxRef = useRef<AudioContext | null>(null);
  const [enabled, setEnabled] = useState(false);

  function getCtx() {
    if (!ctxRef.current || ctxRef.current.state === 'closed') {
      ctxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return ctxRef.current;
  }

  function beep(freq: number, dur: number, vol = 0.09, delay = 0) {
    const ctx = getCtx();
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    g.gain.setValueAtTime(0, ctx.currentTime + delay);
    g.gain.linearRampToValueAtTime(vol, ctx.currentTime + delay + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + delay + dur);
    osc.connect(g);
    g.connect(ctx.destination);
    osc.start(ctx.currentTime + delay);
    osc.stop(ctx.currentTime + delay + dur + 0.01);
  }

  function playForward() { if (!enabled) return; beep(880, 0.055, 0.09); beep(1100, 0.045, 0.07, 0.058); }
  function playBack()    { if (!enabled) return; beep(660, 0.055, 0.08); beep(550, 0.045, 0.06, 0.058); }

  useEffect(() => () => { ctxRef.current?.close(); }, []);

  return { enabled, setEnabled, playForward, playBack };
}

function IconVolumeOn({ color = GOLD }: { color?: string }) {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" /><path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
    </svg>
  );
}
function IconVolumeOff({ color = "#4A6580" }: { color?: string }) {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <line x1="23" y1="9" x2="17" y2="15" /><line x1="17" y1="9" x2="23" y2="15" />
    </svg>
  );
}

function SoundToggle({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.92 }}
      onClick={onToggle}
      title={enabled ? "Silenciar efectos" : "Activar sonidos de transición"}
      style={{ position: "fixed", bottom: "28px", left: "24px", zIndex: 100, width: "42px", height: "42px", borderRadius: "50%", background: `${NAVY_CARD}EC`, backdropFilter: "blur(14px)", border: `1px solid ${enabled ? GOLD + "55" : NAVY_BORDER}`, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: enabled ? `0 0 18px ${GOLD}22` : "0 2px 10px rgba(0,0,0,0.35)", transition: "border-color 0.3s, box-shadow 0.3s" }}>
      {enabled ? <IconVolumeOn color={GOLD} /> : <IconVolumeOff />}
    </motion.button>
  );
}

/* ─── JOURNEY BREADCRUMB STRIP ─── */
const PARTICIPACION_SHORT: Record<string, string> = {
  "no-operar": "Delegar", "supervisar": "Supervisar", "activo": "Activo", "nosc": "Por definir",
};
const CAPITAL_SHORT: Record<string, string> = {
  "100k-250k": "$100k–250k", "250k-500k": "$250k–500k", "500k-1m": "$500k–1M", "mas-1m": "+$1M",
};

function JourneyStrip({ screen, objetivo, participacion, horizonte, capital }: {
  screen: number; objetivo: string | null; participacion: string | null; horizonte: string | null; capital: string | null;
}) {
  if (screen < 2 || screen > 7) return null;
  const crumbs = [
    objetivo ? OPCIONES_1.find(o => o.id === objetivo)?.label ?? objetivo : null,
    participacion ? PARTICIPACION_SHORT[participacion] ?? participacion : null,
    horizonte ?? null,
    capital ? CAPITAL_SHORT[capital] ?? capital : null,
  ].filter(Boolean) as string[];
  if (!crumbs.length) return null;
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
      style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 90, pointerEvents: "none" }}>
      <div style={{ background: `linear-gradient(to top, ${NAVY}FA 0%, ${NAVY}CC 65%, transparent 100%)`, padding: "28px 80px 14px", display: "flex", justifyContent: "center" }}>
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

/* ─── FLOATING PANEL ─── */
function WhereAmIButton({ onClick }: { onClick: () => void }) {
  return (
    <motion.button initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}
      onClick={onClick}
      style={{ position: "fixed", bottom: "28px", right: "24px", zIndex: 100, background: `linear-gradient(135deg,${GOLD},${GOLD_LIGHT})`, color: NAVY, fontFamily: "'Inter',sans-serif", fontSize: "12px", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", border: "none", borderRadius: "50px", padding: "12px 18px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", boxShadow: `0 8px 24px rgba(201,168,76,0.35)` }}>
      <IconMap color={NAVY} /> ¿Dónde estoy?
    </motion.button>
  );
}

function WhereAmIPanel({ open, onClose, screen, objetivo, perfil }: { open: boolean; onClose: () => void; screen: number; objetivo: string | null; perfil: (typeof PERFILES)[string] | null }) {
  const pct = Math.min(100, Math.round(((screen - 1) / 6) * 100));
  const filled = Math.min(10, Math.max(0, Math.round(pct / 10)));
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div key="ov" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 200 }} />
          <motion.div key="pn" initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 28, stiffness: 280 }}
            style={{ position: "fixed", top: 0, right: 0, bottom: 0, width: "min(360px,92vw)", background: NAVY_CARD, borderLeft: `1px solid ${NAVY_BORDER}`, zIndex: 300, padding: "32px 24px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontFamily: "'Inter',sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", color: GOLD, textTransform: "uppercase", marginBottom: "6px" }}>Tu progreso</div>
                <div style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: "18px", fontWeight: 700, color: "#fff" }}>Ruta en construcción</div>
              </div>
              <button onClick={onClose} style={{ background: "transparent", border: "none", cursor: "pointer", padding: "4px" }}><IconX /></button>
            </div>
            <div>
              <div style={{ fontFamily: "'Inter',sans-serif", fontSize: "12px", color: "#6A8FAF", marginBottom: "8px", fontVariantNumeric: "tabular-nums" }}>
                {"█".repeat(filled)}{"░".repeat(10 - filled)} {pct}%
              </div>
              <div style={{ height: "4px", background: NAVY_BORDER, borderRadius: "2px" }}>
                <div style={{ height: "100%", width: `${pct}%`, background: `linear-gradient(90deg,${GOLD},${GOLD_LIGHT})`, borderRadius: "2px", transition: "width 0.4s" }} />
              </div>
            </div>
            {objetivo && (
              <div style={{ background: `${NAVY}80`, borderRadius: "10px", padding: "14px 16px", border: `1px solid ${NAVY_BORDER}` }}>
                <div style={{ fontFamily: "'Inter',sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "0.15em", color: GOLD, textTransform: "uppercase", marginBottom: "8px" }}>Tu objetivo</div>
                <div style={{ fontFamily: "'Inter',sans-serif", fontSize: "13px", color: "#C8D6E8" }}>
                  {OPCIONES_1.find(o => o.id === objetivo)?.label ?? objetivo}
                </div>
              </div>
            )}
            {perfil && (
              <div>
                <div style={{ fontFamily: "'Inter',sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "0.15em", color: GOLD, textTransform: "uppercase", marginBottom: "12px" }}>Vehículos compatibles</div>
                {perfil.vehiculos.map(v => (
                  <div key={v} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                    <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: GOLD, flexShrink: 0 }} />
                    <span style={{ fontFamily: "'Inter',sans-serif", fontSize: "13px", color: "#8FA5C0" }}>{v}</span>
                  </div>
                ))}
              </div>
            )}
            {perfil && (
              <div style={{ background: `${GOLD}10`, border: `1px solid ${GOLD}30`, borderRadius: "10px", padding: "14px 16px" }}>
                <div style={{ fontFamily: "'Inter',sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", color: GOLD, textTransform: "uppercase", marginBottom: "4px" }}>Tu perfil</div>
                <div style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: "16px", fontWeight: 700, color: "#fff" }}>{perfil.nombre}</div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ─── MAIN EXPORT ─── */
export default function NuevoHome() {
  usePlayfairFont();
  const { enabled: soundEnabled, setEnabled: setSoundEnabled, playForward, playBack } = useTransitionSound();

  const [screen, setScreen] = useState(1);
  const [showMain, setShowMain] = useState(false);
  const [objetivo, setObjetivo] = useState<string | null>(null);
  const [participacion, setParticipacion] = useState<string | null>(null);
  const [horizonte, setHorizonte] = useState<string | null>(null);
  const [capital, setCapital] = useState<string | null>(null);
  const [prioridades, setPrioridades] = useState<string[]>([]);
  const [contactData, setContactData] = useState<ContactData | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("ruta");

  const rutaRef = useRef<HTMLDivElement>(null);
  const vehiculosRef = useRef<HTMLDivElement>(null);
  const compararRef = useRef<HTMLDivElement>(null);
  const bibliotecaRef = useRef<HTMLDivElement>(null);
  const diagnosticoRef = useRef<HTMLDivElement>(null);

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
    // Screen 8 (result) → 7 (contact)
    // Screen 7 (contact) → 5 (priorities), skipping loading
    // Screen 6 (loading) → no back (auto-advancing)
    const prev = screen === 8 ? 7 : screen === 7 ? 5 : screen - 1;
    if (prev === 1) setObjetivo(null);
    goScreen(prev);
  }

  function handleNav(id: string) {
    setActiveNav(id);
    const refs: Record<string, React.RefObject<HTMLDivElement | null>> = { ruta: rutaRef, vehiculos: vehiculosRef, comparar: compararRef, biblioteca: bibliotecaRef, diagnostico: diagnosticoRef };
    refs[id]?.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const tv = { initial: { opacity: 0, x: 40 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -40 } };
  const tt = { duration: 0.35, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] };

  return (
    <div style={{ background: NAVY, minHeight: "100dvh", position: "relative" }}>
      <FilmGrain />
      {/* Fixed brand header — visible during flow only */}
      {!showMain && <FlowTopBar screen={screen} onBack={handleBack} />}

      <AnimatePresence mode="wait">
        {!showMain && (
          <motion.div key="flow" initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
            <AnimatePresence mode="wait">
              {screen === 1 && <motion.div key="s1" variants={tv} initial="initial" animate="animate" exit="exit" transition={tt}><Screen1 onSelect={(id) => { setObjetivo(id); goScreen(2); }} /></motion.div>}
              {screen === 2 && <motion.div key="s2" variants={tv} initial="initial" animate="animate" exit="exit" transition={tt}><Screen2 onNext={(id) => { setParticipacion(id); goScreen(3); }} /></motion.div>}
              {screen === 3 && <motion.div key="s3" variants={tv} initial="initial" animate="animate" exit="exit" transition={tt}><Screen3 onNext={(v) => { setHorizonte(v); goScreen(4); }} /></motion.div>}
              {screen === 4 && <motion.div key="s4" variants={tv} initial="initial" animate="animate" exit="exit" transition={tt}><Screen4Capital onNext={(id) => { setCapital(id); goScreen(5); }} /></motion.div>}
              {screen === 5 && <motion.div key="s5" variants={tv} initial="initial" animate="animate" exit="exit" transition={tt}><Screen4 onNext={(ids) => { setPrioridades(ids); goScreen(6); }} /></motion.div>}
              {screen === 6 && <motion.div key="s6" variants={tv} initial="initial" animate="animate" exit="exit" transition={tt}><Screen5 onDone={() => goScreen(7)} /></motion.div>}
              {screen === 7 && (
                <motion.div key="s7" variants={tv} initial="initial" animate="animate" exit="exit" transition={tt}>
                  <Screen6Contact onNext={(data) => { setContactData(data); goScreen(8); }} />
                </motion.div>
              )}
              {screen === 8 && perfil && (
                <motion.div key="s8" variants={tv} initial="initial" animate="animate" exit="exit" transition={tt}>
                  <ResultScreen perfil={perfil} contactData={contactData} rankedVehicles={rankedVehicles} investorData={{ objetivo, participacion, horizonte, capital, prioridades }} onUnderstandRoute={() => { setShowMain(true); window.scrollTo({ top: 0, behavior: "instant" }); }} onCompare={() => { setObjetivo(null); goScreen(1); }} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {showMain && (
          <motion.div key="main" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <StickyNav active={activeNav} onNav={handleNav} />
            <div ref={rutaRef}><MiRutaSection objetivo={objetivo} /></div>
            <div ref={vehiculosRef}><ExplorarVehiculosSection rankedIds={rankedVehicles.map(v => v.id)} /></div>
            <div ref={compararRef}><CompararSection /></div>
            <div ref={bibliotecaRef}><BibliotecaSection objetivo={objetivo} /></div>
            <NoSomosSection />
            <div ref={diagnosticoRef}><DiagnosticoSection /></div>
          </motion.div>
        )}
      </AnimatePresence>

      {(screen >= 2 && screen !== 7 || showMain) && <WhereAmIButton onClick={() => setPanelOpen(true)} />}
      <WhereAmIPanel open={panelOpen} onClose={() => setPanelOpen(false)} screen={screen} objetivo={objetivo} perfil={perfil} />
      <SoundToggle enabled={soundEnabled} onToggle={() => setSoundEnabled(e => !e)} />
      {!showMain && <JourneyStrip screen={screen} objetivo={objetivo} participacion={participacion} horizonte={horizonte} capital={capital} />}
    </div>
  );
}
