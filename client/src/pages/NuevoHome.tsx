// NUEVO-HOME STAGING
// Ruta independiente de staging — no modifica ningún componente del sitio actual

import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";

/* ─── Brand ─── */
const NAVY = "#0B1F3A";
const GOLD = "#C9A84C";
const GOLD_LIGHT = "#E2C06E";
const NAVY_CARD = "#112240";
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
    titulo: "Generar Flujo Pasivo",
    items: [
      { nombre: "Victory Capital", frase: "Retornos en dólares con gestión profesional", participacion: "Pasiva", horizonte: "5-7 años", ticket: "100k+" },
      { nombre: "Section 8", frase: "Renta garantizada con subsidio federal", participacion: "Semi-pasiva", horizonte: "Largo plazo", ticket: "90k+" },
      { nombre: "Coinversiones", frase: "Participa en proyectos con socios estratégicos", participacion: "Flexible", horizonte: "2-4 años", ticket: "50k+" },
    ],
  },
  {
    titulo: "Construir Patrimonio",
    items: [
      { nombre: "Real Estate", frase: "Bienes raíces en mercados de alta demanda", participacion: "Semi-pasiva", horizonte: "Largo plazo", ticket: "150k+" },
      { nombre: "Fondos", frase: "Diversificación en activos americanos", participacion: "Pasiva", horizonte: "5-10 años", ticket: "25k+" },
      { nombre: "Negocios", frase: "Adquiere o construye un negocio americano", participacion: "Activa", horizonte: "3-5 años", ticket: "200k+" },
    ],
  },
  {
    titulo: "Expandir Empresa",
    items: [
      { nombre: "Americaniza tu Operación", frase: "Lleva tu empresa al mercado americano", participacion: "Activa", horizonte: "1-3 años", ticket: "Consultar" },
      { nombre: "Adquisiciones", frase: "Compra una empresa americana en operación", participacion: "Activa", horizonte: "6-12 meses", ticket: "500k+" },
      { nombre: "Expansión", frase: "Abre operaciones en Estados Unidos", participacion: "Activa", horizonte: "1-2 años", ticket: "100k+" },
    ],
  },
];

const COMPARACION = {
  headers: ["Victory Capital", "Section 8", "Membresía"],
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

const ICON_MAP: Record<string, (p?: { color?: string }) => JSX.Element> = {
  shield: (p) => <IconShield {...p} />,
  dollar: (p) => <IconDollar {...p} />,
  building: (p) => <IconBuilding {...p} />,
  family: (p) => <IconFamily {...p} />,
  compass: (p) => <IconCompass {...p} />,
};

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
      <video autoPlay loop muted playsInline preload="none" aria-hidden="true" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.15 }}>
        <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
      </video>
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(135deg,${NAVY}F5 0%,#0D2545F0 50%,${NAVY}F8 100%)` }} />
      <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: "2px", height: "80px", background: `linear-gradient(to bottom,transparent,${GOLD})` }} />
      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: "920px", padding: "60px 24px 80px", textAlign: "center" }}>
        <div style={{ marginBottom: "36px", display: "flex", justifyContent: "center", alignItems: "center", gap: "12px" }}>
          <div style={{ width: "48px", height: "2px", background: GOLD }} />
          <span style={{ fontFamily: "'Inter',sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "0.25em", color: GOLD, textTransform: "uppercase" }}>Comprando América</span>
          <div style={{ width: "48px", height: "2px", background: GOLD }} />
        </div>
        <h1 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: "clamp(26px,4.5vw,52px)", fontWeight: 700, color: "#fff", lineHeight: 1.2, marginBottom: "16px" }}>
          ¿Qué estás tratando de construir<br />
          <em style={{ color: GOLD_LIGHT, fontStyle: "italic" }}>en Estados Unidos?</em>
        </h1>
        <p style={{ fontFamily: "'Inter',sans-serif", fontSize: "16px", color: "#8FA5C0", marginBottom: "52px" }}>
          Selecciona tu objetivo y te mostraremos la ruta exacta
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,220px),1fr))", gap: "14px", textAlign: "left" }}>
          {OPCIONES_1.map((op) => {
            const isH = hovered === op.id;
            return (
              <button key={op.id} onClick={() => onSelect(op.id)} onMouseEnter={() => setHovered(op.id)} onMouseLeave={() => setHovered(null)}
                style={{ background: isH ? `linear-gradient(135deg,#122644,#1A3558)` : NAVY_CARD, border: `1px solid ${isH ? GOLD : NAVY_BORDER}`, borderRadius: "12px", padding: "22px 18px", cursor: "pointer", transition: "all 0.25s", transform: isH ? "translateY(-3px)" : "none", boxShadow: isH ? `0 12px 32px rgba(201,168,76,0.15)` : "none", display: "flex", flexDirection: "column", gap: "10px" }}>
                <div style={{ color: GOLD }}>{(ICON_MAP[op.id] || ICON_MAP.compass)()}</div>
                <div>
                  <div style={{ fontFamily: "'Inter',sans-serif", fontSize: "15px", fontWeight: 600, color: "#E8ECF1", marginBottom: "4px" }}>{op.label}</div>
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
    <div style={{ minHeight: "100dvh", background: NAVY, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
      <div style={{ width: "100%", maxWidth: "600px" }}>
        <StepIndicator current={2} total={4} />
        <p style={{ fontFamily: "'Inter',sans-serif", fontSize: "13px", fontWeight: 600, letterSpacing: "0.2em", color: GOLD, textTransform: "uppercase", marginBottom: "12px" }}>Entendido.</p>
        <h2 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: "clamp(22px,3.5vw,36px)", fontWeight: 700, color: "#fff", marginBottom: "12px", lineHeight: 1.25 }}>
          ¿Qué tan involucrado deseas estar?
        </h2>
        <p style={{ fontFamily: "'Inter',sans-serif", fontSize: "14px", color: "#6A8FAF", marginBottom: "36px" }}>Tu nivel de participación define el vehículo más adecuado para ti</p>
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
    <div style={{ minHeight: "100dvh", background: NAVY, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
      <div style={{ width: "100%", maxWidth: "600px" }}>
        <StepIndicator current={3} total={4} />
        <h2 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: "clamp(22px,3.5vw,36px)", fontWeight: 700, color: "#fff", marginBottom: "12px" }}>¿Qué horizonte imaginas?</h2>
        <p style={{ fontFamily: "'Inter',sans-serif", fontSize: "14px", color: "#6A8FAF", marginBottom: "64px" }}>¿En cuánto tiempo esperas ver resultados concretos de tu inversión?</p>
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

/* ─── SCREEN 4 (updated options) ─── */
function Screen4({ onNext }: { onNext: (ids: string[]) => void }) {
  const [sel, setSel] = useState<string[]>([]);
  const [shaking, setShaking] = useState(false);
  function toggle(id: string) {
    if (sel.includes(id)) { setSel(sel.filter(s => s !== id)); return; }
    if (sel.length >= 2) { setShaking(true); setTimeout(() => setShaking(false), 500); return; }
    setSel([...sel, id]);
  }
  return (
    <div style={{ minHeight: "100dvh", background: NAVY, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
      <div style={{ width: "100%", maxWidth: "600px" }}>
        <StepIndicator current={4} total={4} />
        <h2 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: "clamp(22px,3.5vw,36px)", fontWeight: 700, color: "#fff", marginBottom: "10px" }}>¿Qué pesa más en tu decisión?</h2>
        <p style={{ fontFamily: "'Inter',sans-serif", fontSize: "14px", color: "#6A8FAF", marginBottom: "32px" }}>Selecciona hasta <strong style={{ color: GOLD }}>2 opciones</strong></p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "10px", marginBottom: "36px" }}>
          {OPCIONES_4.map((op) => {
            const isSel = sel.includes(op.id);
            const isOther = !isSel && sel.length >= 2;
            return (
              <motion.button key={op.id} onClick={() => toggle(op.id)}
                animate={isOther && shaking ? { x: [0, -5, 5, -4, 4, 0] } : { x: 0 }}
                transition={{ duration: 0.4 }}
                style={{ background: isSel ? `linear-gradient(135deg,#1A3558,#112240)` : NAVY_CARD, border: `2px solid ${isSel ? GOLD : NAVY_BORDER}`, borderRadius: "12px", padding: "18px 14px", cursor: "pointer", textAlign: "left", opacity: isOther ? 0.45 : 1, transition: "border-color 0.2s,background 0.2s" }}>
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
function ResultScreen({ perfil, onUnderstandRoute, onCompare }: { perfil: (typeof PERFILES)[string]; onUnderstandRoute: () => void; onCompare: () => void }) {
  return (
    <div style={{ minHeight: "100dvh", background: NAVY, padding: "60px 24px 100px", overflowY: "auto" }}>
      <div style={{ maxWidth: "680px", margin: "0 auto" }}>
        <div style={{ marginBottom: "6px" }}>
          <span style={{ fontFamily: "'Inter',sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "0.25em", color: GOLD, textTransform: "uppercase" }}>Tu perfil</span>
        </div>
        <h1 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: "clamp(26px,5vw,50px)", fontWeight: 900, color: "#fff", lineHeight: 1.1, marginBottom: "20px" }}>{perfil.nombre}</h1>
        <p style={{ fontFamily: "'Inter',sans-serif", fontSize: "16px", color: "#8FA5C0", lineHeight: 1.75, marginBottom: "52px", maxWidth: "520px" }}>{perfil.descripcion}</p>
        <div style={{ marginBottom: "48px" }}>
          <h3 style={{ fontFamily: "'Inter',sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", color: GOLD, textTransform: "uppercase", marginBottom: "24px" }}>Tu Ruta Recomendada</h3>
          <MetroLine />
        </div>
        <div style={{ marginBottom: "44px" }}>
          <h3 style={{ fontFamily: "'Inter',sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", color: GOLD, textTransform: "uppercase", marginBottom: "16px" }}>Vehículos sugeridos</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,195px),1fr))", gap: "10px" }}>
            {perfil.vehiculos.map((v) => (
              <div key={v} style={{ background: NAVY_CARD, border: `1px solid ${NAVY_BORDER}`, borderRadius: "10px", padding: "14px 16px", display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: `${GOLD}20`, border: `1px solid ${GOLD}60`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <IconCheck color={GOLD} size={12} />
                </div>
                <span style={{ fontFamily: "'Inter',sans-serif", fontSize: "13px", fontWeight: 500, color: "#C8D6E8" }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <GoldBtn onClick={onUnderstandRoute} style={{ width: "100%" }}>
            Quiero entender esta ruta <IconRight color={NAVY} />
          </GoldBtn>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            <button onClick={() => window.location.href = "/"} style={{ padding: "13px 18px", background: "transparent", color: GOLD, fontFamily: "'Inter',sans-serif", fontSize: "13px", fontWeight: 600, border: `1px solid ${GOLD}`, borderRadius: "10px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
              <IconCalendar color={GOLD} /> Agendar diagnóstico
            </button>
            <button onClick={onCompare} style={{ padding: "13px 18px", background: "transparent", color: "#6A8FAF", fontFamily: "'Inter',sans-serif", fontSize: "13px", fontWeight: 600, border: `1px solid ${NAVY_BORDER}`, borderRadius: "10px", cursor: "pointer" }}>
              Comparar otra ruta
            </button>
          </div>
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
                      style={{ background: isSel ? `linear-gradient(135deg,#1A3558,#112240)` : `${NAVY}80`, border: `1px solid ${isSel ? GOLD : NAVY_BORDER}`, borderRadius: "10px", padding: "14px 18px", cursor: "pointer", textAlign: "left", transition: "all 0.2s", minWidth: "140px" }}>
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
function VehiculoCard({ v }: { v: typeof VEHICULOS_CATEGORIAS[0]["items"][0] }) {
  return (
    <div style={{ background: NAVY_CARD, border: `1px solid ${NAVY_BORDER}`, borderRadius: "14px", padding: "24px", minWidth: "240px", maxWidth: "260px", flexShrink: 0, display: "flex", flexDirection: "column", gap: "12px" }}>
      <div style={{ height: "3px", background: `linear-gradient(90deg,${GOLD},${GOLD_LIGHT})`, borderRadius: "2px", marginBottom: "4px" }} />
      <h4 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: "18px", fontWeight: 700, color: "#fff", lineHeight: 1.2 }}>{v.nombre}</h4>
      <p style={{ fontFamily: "'Inter',sans-serif", fontSize: "13px", color: "#6A8FAF", lineHeight: 1.6, flex: 1 }}>{v.frase}</p>
      <div style={{ borderTop: `1px solid ${NAVY_BORDER}`, paddingTop: "12px", display: "flex", flexDirection: "column", gap: "6px" }}>
        {[["Participación", v.participacion], ["Horizonte", v.horizonte], ["Ticket mínimo", v.ticket]].map(([k, val]) => (
          <div key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontFamily: "'Inter',sans-serif", fontSize: "11px", color: "#4A6580" }}>{k}</span>
            <span style={{ fontFamily: "'Inter',sans-serif", fontSize: "12px", fontWeight: 600, color: "#C8D6E8" }}>{val}</span>
          </div>
        ))}
      </div>
      <button style={{ width: "100%", padding: "10px", background: "transparent", border: `1px solid ${GOLD}`, color: GOLD, fontFamily: "'Inter',sans-serif", fontSize: "12px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", borderRadius: "8px", cursor: "pointer" }}>
        Explorar
      </button>
    </div>
  );
}

function ExplorarVehiculosSection() {
  return (
    <div style={{ padding: "80px 0", background: `${NAVY_CARD}40`, borderTop: `1px solid ${NAVY_BORDER}`, borderBottom: `1px solid ${NAVY_BORDER}` }}>
      <div style={{ padding: "0 24px", maxWidth: "1100px", margin: "0 auto" }}>
        <SectionHeader label="Vehículos Estratégicos" title="Explora tus instrumentos" sub="Cada vehículo está diseñado para un tipo específico de inversionista. Encuentra el que se alinea con tu perfil." />
      </div>
      {VEHICULOS_CATEGORIAS.map((cat) => (
        <div key={cat.titulo} style={{ marginBottom: "48px" }}>
          <div style={{ padding: "0 24px", maxWidth: "1100px", margin: "0 auto 20px" }}>
            <h3 style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: "22px", fontWeight: 700, color: "#fff" }}>{cat.titulo}</h3>
          </div>
          <div style={{ display: "flex", gap: "14px", overflowX: "auto", padding: "4px 24px 16px", scrollbarWidth: "none" }}>
            {cat.items.map((v) => <VehiculoCard key={v.nombre} v={v} />)}
          </div>
        </div>
      ))}
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
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} style={{ display: "flex", justifyContent: "flex-end" }}>
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
  const pct = Math.round(((screen - 1) / 4) * 100);
  const filled = Math.round(pct / 10);
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

  const [screen, setScreen] = useState(1);
  const [showMain, setShowMain] = useState(false);
  const [objetivo, setObjetivo] = useState<string | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("ruta");

  const rutaRef = useRef<HTMLDivElement>(null);
  const vehiculosRef = useRef<HTMLDivElement>(null);
  const compararRef = useRef<HTMLDivElement>(null);
  const bibliotecaRef = useRef<HTMLDivElement>(null);
  const diagnosticoRef = useRef<HTMLDivElement>(null);

  const perfil = objetivo ? PERFILES[objetivo] ?? null : null;

  function goScreen(n: number) { setScreen(n); window.scrollTo({ top: 0, behavior: "instant" }); }

  function handleNav(id: string) {
    setActiveNav(id);
    const refs: Record<string, React.RefObject<HTMLDivElement | null>> = { ruta: rutaRef, vehiculos: vehiculosRef, comparar: compararRef, biblioteca: bibliotecaRef, diagnostico: diagnosticoRef };
    refs[id]?.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const tv = { initial: { opacity: 0, x: 40 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -40 } };
  const tt = { duration: 0.35, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] };

  return (
    <div style={{ background: NAVY, minHeight: "100dvh", position: "relative" }}>
      <AnimatePresence mode="wait">
        {!showMain && (
          <motion.div key="flow" initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
            <AnimatePresence mode="wait">
              {screen === 1 && <motion.div key="s1" variants={tv} initial="initial" animate="animate" exit="exit" transition={tt}><Screen1 onSelect={(id) => { setObjetivo(id); goScreen(2); }} /></motion.div>}
              {screen === 2 && <motion.div key="s2" variants={tv} initial="initial" animate="animate" exit="exit" transition={tt}><Screen2 onNext={() => goScreen(3)} /></motion.div>}
              {screen === 3 && <motion.div key="s3" variants={tv} initial="initial" animate="animate" exit="exit" transition={tt}><Screen3 onNext={() => goScreen(4)} /></motion.div>}
              {screen === 4 && <motion.div key="s4" variants={tv} initial="initial" animate="animate" exit="exit" transition={tt}><Screen4 onNext={() => goScreen(5)} /></motion.div>}
              {screen === 5 && <motion.div key="s5" variants={tv} initial="initial" animate="animate" exit="exit" transition={tt}><Screen5 onDone={() => goScreen(6)} /></motion.div>}
              {screen === 6 && perfil && (
                <motion.div key="s6" variants={tv} initial="initial" animate="animate" exit="exit" transition={tt}>
                  <ResultScreen perfil={perfil} onUnderstandRoute={() => { setShowMain(true); window.scrollTo({ top: 0, behavior: "instant" }); }} onCompare={() => { setObjetivo(null); goScreen(1); }} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {showMain && (
          <motion.div key="main" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <StickyNav active={activeNav} onNav={handleNav} />
            <div ref={rutaRef}><MiRutaSection objetivo={objetivo} /></div>
            <div ref={vehiculosRef}><ExplorarVehiculosSection /></div>
            <div ref={compararRef}><CompararSection /></div>
            <div ref={bibliotecaRef}><BibliotecaSection objetivo={objetivo} /></div>
            <NoSomosSection />
            <div ref={diagnosticoRef}><DiagnosticoSection /></div>
          </motion.div>
        )}
      </AnimatePresence>

      {(screen >= 2 || showMain) && <WhereAmIButton onClick={() => setPanelOpen(true)} />}
      <WhereAmIPanel open={panelOpen} onClose={() => setPanelOpen(false)} screen={screen} objetivo={objetivo} perfil={perfil} />
    </div>
  );
}
