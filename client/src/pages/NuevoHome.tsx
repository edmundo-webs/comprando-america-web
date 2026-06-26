// NUEVO-HOME STAGING
// Ruta independiente de staging — no modifica ningún componente del sitio actual

import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";

/* ─────────────────────────────────────────
   Playfair Display font injection
───────────────────────────────────────── */
function usePlayfairFont() {
  useEffect(() => {
    if (document.getElementById("playfair-font-nh")) return;
    const link = document.createElement("link");
    link.id = "playfair-font-nh";
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,900;1,400;1,700&display=swap";
    document.head.appendChild(link);
  }, []);
}

/* ─────────────────────────────────────────
   Brand tokens
───────────────────────────────────────── */
const NAVY = "#0B1F3A";
const GOLD = "#C9A84C";
const GOLD_LIGHT = "#E2C06E";
const NAVY_CARD = "#112240";
const NAVY_BORDER = "#1E3A5F";

/* ─────────────────────────────────────────
   Profile definitions
───────────────────────────────────────── */
const PERFILES: Record<
  string,
  {
    nombre: string;
    descripcion: string;
    vehiculos: string[];
    descripcionCorta: string;
  }
> = {
  patrimonio: {
    nombre: "PROTECTOR PATRIMONIAL",
    descripcion:
      "Tu enfoque es blindar lo que has construido. Buscas estructuras legales sólidas en Estados Unidos que pongan distancia entre tu patrimonio y los riesgos de tu país de origen.",
    descripcionCorta: "Blindaje legal y fiscal para tu patrimonio",
    vehiculos: ["LLC de Wyoming", "Trust Revocable", "Bienes Raíces", "Cuenta Bancaria en EE.UU."],
  },
  ingresos: {
    nombre: "GENERADOR DE FLUJO",
    descripcion:
      "Quieres que tu dinero trabaje y genere ingresos constantes en dólares. Tu ruta combina activos productivos con estructuras eficientes que maximizan el retorno mensual.",
    descripcionCorta: "Activos productivos que generan dólares cada mes",
    vehiculos: ["Bienes Raíces en Renta", "Franquicia Activa", "LLC Operativa", "Portafolio de Dividendos"],
  },
  empresa: {
    nombre: "EMPRESARIO EXPANSIVO",
    descripcion:
      "Tienes una empresa funcionando y quieres llevarla al mercado más grande del mundo. Tu ruta contempla la expansión operativa, fiscal y migratoria hacia Estados Unidos.",
    descripcionCorta: "Expansión de tu empresa al mercado norteamericano",
    vehiculos: ["Expansión Empresarial", "Visa E-2", "LLC Multi-Estado", "Estructura Fiscal EE.UU."],
  },
  familia: {
    nombre: "ARQUITECTO FAMILIAR",
    descripcion:
      "Tu inversión está diseñada para abrir puertas a tu familia. Combinas estrategia migratoria con estructuras patrimoniales que protegen a las personas que más importan.",
    descripcionCorta: "Estructura de inversión para el futuro de tu familia",
    vehiculos: ["Visa E-2 Familiar", "Trust de Familia", "Cuenta Bancaria EE.UU.", "Plan de Sucesión"],
  },
  explorar: {
    nombre: "EXPLORADOR ESTRATÉGICO",
    descripcion:
      "Sabes que quieres estar en Estados Unidos pero aún estás definiendo tu camino. Tu ruta comienza con claridad: un diagnóstico personalizado que mapea tus opciones reales.",
    descripcionCorta: "Tu ruta comienza con claridad y orientación",
    vehiculos: ["Diagnóstico Personalizado", "Mapa de Rutas", "Comunidad Comprando América", "Membresía Base"],
  },
};

/* ─────────────────────────────────────────
   SVG icons
───────────────────────────────────────── */
function IconShield({ color = GOLD }: { color?: string }) {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}
function IconDollar({ color = GOLD }: { color?: string }) {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}
function IconBuilding({ color = GOLD }: { color?: string }) {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  );
}
function IconFamily({ color = GOLD }: { color?: string }) {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
function IconCompass({ color = GOLD }: { color?: string }) {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </svg>
  );
}
function IconCheck({ color = GOLD }: { color?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
function IconChevronRight({ color = GOLD }: { color?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}
function IconMap({ color = GOLD }: { color?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
      <line x1="9" y1="3" x2="9" y2="18" />
      <line x1="15" y1="6" x2="15" y2="21" />
    </svg>
  );
}
function IconX({ color = "#fff" }: { color?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
function IconCalendar({ color = NAVY }: { color?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

/* ─────────────────────────────────────────
   Metro line SVG for result
───────────────────────────────────────── */
function MetroLine() {
  const stations = ["Claridad", "Comunidad", "Estructura", "Vehículos", "Ejecución"];
  return (
    <svg width="48" height="280" viewBox="0 0 48 280" fill="none" aria-label="Ruta estratégica">
      <line x1="24" y1="16" x2="24" y2="264" stroke={NAVY_BORDER} strokeWidth="3" />
      <line x1="24" y1="16" x2="24" y2="264" stroke={GOLD} strokeWidth="3" strokeDasharray="240" strokeDashoffset="0" />
      {stations.map((_, i) => (
        <circle key={i} cx="24" cy={16 + i * 62} r="10" fill={NAVY_CARD} stroke={GOLD} strokeWidth="2.5" />
      ))}
      {stations.map((_, i) => (
        <circle key={i + 10} cx="24" cy={16 + i * 62} r="5" fill={GOLD} />
      ))}
    </svg>
  );
}
function MetroLabels() {
  const stations = ["Claridad", "Comunidad", "Estructura", "Vehículos", "Ejecución"];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0, justifyContent: "space-between", height: "280px", paddingTop: "6px" }}>
      {stations.map((s, i) => (
        <div key={i} style={{ height: "56px", display: "flex", alignItems: "center" }}>
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "15px", fontWeight: 600, color: i === 0 ? GOLD : "#9BAEC8", letterSpacing: "0.03em" }}>
            {s}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────
   Screen 1 — La pregunta central
───────────────────────────────────────── */
const opciones1 = [
  { id: "patrimonio", label: "Proteger mi patrimonio", sub: "Blindaje legal y fiscal fuera de mi país", icon: <IconShield /> },
  { id: "ingresos", label: "Generar ingresos en dólares", sub: "Activos que producen flujo constante", icon: <IconDollar /> },
  { id: "empresa", label: "Expandir mi empresa", sub: "Llevar mi negocio al mercado norteamericano", icon: <IconBuilding /> },
  { id: "familia", label: "Crear opciones para mi familia", sub: "Migración, educación y futuro", icon: <IconFamily /> },
  { id: "explorar", label: "Todavía no lo tengo claro", sub: "Quiero explorar mis posibilidades", icon: <IconCompass /> },
];

function Screen1({ onSelect }: { onSelect: (id: string) => void }) {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        minHeight: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        background: NAVY,
      }}
    >
      {/* Video background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="none"
        aria-hidden="true"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.18 }}
      >
        <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
      </video>

      {/* Gradient overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(135deg, ${NAVY}F5 0%, #0D2545F0 50%, ${NAVY}F8 100%)`,
          backdropFilter: "blur(1px)",
        }}
      />

      {/* Decorative gold line */}
      <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: "2px", height: "80px", background: `linear-gradient(to bottom, transparent, ${GOLD})` }} />

      <div style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: "900px", padding: "60px 24px 80px", textAlign: "center" }}>
        {/* Logo mark */}
        <div style={{ marginBottom: "40px", display: "flex", justifyContent: "center" }}>
          <div style={{ width: "48px", height: "2px", background: GOLD, margin: "0 12px" }} />
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "0.25em", color: GOLD, textTransform: "uppercase" }}>
            Comprando América
          </span>
          <div style={{ width: "48px", height: "2px", background: GOLD, margin: "0 12px", alignSelf: "center" }} />
        </div>

        <h1
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "clamp(28px, 4.5vw, 52px)",
            fontWeight: 700,
            color: "#FFFFFF",
            lineHeight: 1.2,
            marginBottom: "16px",
            letterSpacing: "-0.01em",
          }}
        >
          ¿Qué estás tratando de construir
          <br />
          <em style={{ color: GOLD_LIGHT, fontStyle: "italic" }}>en Estados Unidos?</em>
        </h1>

        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "16px", color: "#8FA5C0", marginBottom: "52px", letterSpacing: "0.01em" }}>
          Selecciona tu objetivo principal y te mostraremos la ruta exacta
        </p>

        {/* Option cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 240px), 1fr))",
            gap: "16px",
            textAlign: "left",
          }}
        >
          {opciones1.map((op) => {
            const isHovered = hovered === op.id;
            return (
              <button
                key={op.id}
                onClick={() => onSelect(op.id)}
                onMouseEnter={() => setHovered(op.id)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  background: isHovered ? `linear-gradient(135deg, #122644, #1A3558)` : NAVY_CARD,
                  border: `1px solid ${isHovered ? GOLD : NAVY_BORDER}`,
                  borderRadius: "12px",
                  padding: "24px 20px",
                  cursor: "pointer",
                  transition: "all 0.25s ease",
                  transform: isHovered ? "translateY(-3px)" : "none",
                  boxShadow: isHovered ? `0 12px 32px rgba(201,168,76,0.15)` : "none",
                  textAlign: "left",
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                <div style={{ color: isHovered ? GOLD_LIGHT : GOLD, transition: "color 0.2s" }}>
                  {op.icon}
                </div>
                <div>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "15px", fontWeight: 600, color: "#E8ECF1", marginBottom: "4px" }}>
                    {op.label}
                  </div>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", color: "#6A8FAF", lineHeight: 1.5 }}>
                    {op.sub}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Screen 2 — Nivel de involucramiento
───────────────────────────────────────── */
const opciones2 = [
  { id: "activo", label: "Muy activo", sub: "Quiero participar en cada decisión" },
  { id: "semipasivo", label: "Semipasivo", sub: "Participo en decisiones estratégicas, no operativas" },
  { id: "pasivo", label: "Pasivo", sub: "Prefiero delegar y recibir reportes" },
  { id: "nosc", label: "Aún no lo sé", sub: "Quiero orientación para decidir" },
];

function Screen2({ onNext }: { onNext: (id: string) => void }) {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div style={{ minHeight: "100dvh", background: NAVY, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
      <div style={{ width: "100%", maxWidth: "640px" }}>
        <StepIndicator current={2} total={4} />
        <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(24px, 3.5vw, 38px)", fontWeight: 700, color: "#FFFFFF", marginBottom: "12px", lineHeight: 1.25 }}>
          ¿Qué tan involucrado deseas estar?
        </h2>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "15px", color: "#6A8FAF", marginBottom: "40px" }}>
          Tu nivel de participación define el tipo de estructura más adecuado para ti
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "40px" }}>
          {opciones2.map((op) => {
            const isSel = selected === op.id;
            return (
              <button
                key={op.id}
                onClick={() => setSelected(op.id)}
                style={{
                  background: isSel ? `linear-gradient(135deg, #1A3558, #122644)` : NAVY_CARD,
                  border: `2px solid ${isSel ? GOLD : NAVY_BORDER}`,
                  borderRadius: "12px",
                  padding: "20px 24px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  transition: "all 0.2s ease",
                  textAlign: "left",
                }}
              >
                {/* Radio circle */}
                <div style={{
                  width: "22px", height: "22px", borderRadius: "50%",
                  border: `2px solid ${isSel ? GOLD : NAVY_BORDER}`,
                  flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all 0.2s",
                  background: isSel ? GOLD : "transparent",
                }}>
                  {isSel && <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: NAVY }} />}
                </div>
                <div>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "15px", fontWeight: 600, color: isSel ? "#FFFFFF" : "#C8D6E8" }}>
                    {op.label}
                  </div>
                  <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", color: "#6A8FAF", marginTop: "2px" }}>
                    {op.sub}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <motion.button
          onClick={() => selected && onNext(selected)}
          animate={{ opacity: selected ? 1 : 0.35, y: selected ? 0 : 6 }}
          transition={{ duration: 0.25 }}
          disabled={!selected}
          style={{
            width: "100%",
            padding: "16px",
            background: selected ? `linear-gradient(90deg, ${GOLD}, ${GOLD_LIGHT})` : "#1E3A5F",
            color: selected ? NAVY : "#4A6580",
            fontFamily: "'Inter', sans-serif",
            fontSize: "15px",
            fontWeight: 700,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            border: "none",
            borderRadius: "10px",
            cursor: selected ? "pointer" : "not-allowed",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            transition: "background 0.3s",
          }}
        >
          Continuar
          <IconChevronRight color={selected ? NAVY : "#4A6580"} />
        </motion.button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Screen 3 — Horizonte de tiempo
───────────────────────────────────────── */
const sliderPoints = ["1 año", "3 años", "5 años", "10+ años"];

function Screen3({ onNext }: { onNext: (v: string) => void }) {
  const [selected, setSelected] = useState<number>(1);

  return (
    <div style={{ minHeight: "100dvh", background: NAVY, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
      <div style={{ width: "100%", maxWidth: "640px" }}>
        <StepIndicator current={3} total={4} />
        <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(24px, 3.5vw, 38px)", fontWeight: 700, color: "#FFFFFF", marginBottom: "12px" }}>
          ¿Cuál es tu horizonte de tiempo?
        </h2>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "15px", color: "#6A8FAF", marginBottom: "64px" }}>
          ¿En cuánto tiempo esperas ver resultados concretos de tu inversión?
        </p>

        {/* Slider */}
        <div style={{ position: "relative", padding: "0 0 60px" }}>
          {/* Track */}
          <div style={{ position: "relative", height: "4px", background: NAVY_BORDER, borderRadius: "2px", margin: "0 24px" }}>
            {/* Gold fill */}
            <div style={{
              position: "absolute",
              left: 0,
              top: 0,
              height: "4px",
              borderRadius: "2px",
              background: `linear-gradient(90deg, ${GOLD}, ${GOLD_LIGHT})`,
              width: `${(selected / (sliderPoints.length - 1)) * 100}%`,
              transition: "width 0.3s ease",
            }} />
          </div>

          {/* Points */}
          <div style={{ display: "flex", justifyContent: "space-between", position: "absolute", top: "-13px", left: "24px", right: "24px" }}>
            {sliderPoints.map((p, i) => (
              <button
                key={i}
                onClick={() => setSelected(i)}
                style={{
                  width: "30px",
                  height: "30px",
                  borderRadius: "50%",
                  border: `2px solid ${i <= selected ? GOLD : NAVY_BORDER}`,
                  background: i === selected ? GOLD : i < selected ? "#1A3558" : NAVY_CARD,
                  cursor: "pointer",
                  transition: "all 0.25s ease",
                  transform: i === selected ? "scale(1.3)" : "scale(1)",
                  boxShadow: i === selected ? `0 0 16px ${GOLD}60` : "none",
                  padding: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {i < selected && <IconCheck color={GOLD} />}
              </button>
            ))}
          </div>

          {/* Labels */}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "28px", padding: "0 8px" }}>
            {sliderPoints.map((p, i) => (
              <span key={i} style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "13px",
                fontWeight: i === selected ? 700 : 400,
                color: i === selected ? GOLD : "#4A6580",
                transition: "all 0.2s",
                minWidth: "50px",
                textAlign: "center",
              }}>
                {p}
              </span>
            ))}
          </div>
        </div>

        {/* Selected value display */}
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <span style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "48px",
            fontWeight: 700,
            color: GOLD,
          }}>
            {sliderPoints[selected]}
          </span>
        </div>

        <button
          onClick={() => onNext(sliderPoints[selected])}
          style={{
            width: "100%",
            padding: "16px",
            background: `linear-gradient(90deg, ${GOLD}, ${GOLD_LIGHT})`,
            color: NAVY,
            fontFamily: "'Inter', sans-serif",
            fontSize: "15px",
            fontWeight: 700,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            border: "none",
            borderRadius: "10px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
          }}
        >
          Continuar
          <IconChevronRight color={NAVY} />
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Screen 4 — Prioridades
───────────────────────────────────────── */
const opciones4 = [
  { id: "seguridad", label: "Seguridad jurídica", sub: "Protección legal sólida" },
  { id: "rentabilidad", label: "Rentabilidad", sub: "Retornos atractivos" },
  { id: "migracion", label: "Migración", sub: "Opciones de residencia" },
  { id: "privacidad", label: "Privacidad", sub: "Discreción patrimonial" },
  { id: "velocidad", label: "Velocidad de ejecución", sub: "Resultados en el menor tiempo" },
  { id: "legado", label: "Legado", sub: "Construir para generaciones futuras" },
];

function Screen4({ onNext }: { onNext: (ids: string[]) => void }) {
  const [selected, setSelected] = useState<string[]>([]);
  const [shaking, setShaking] = useState(false);

  function toggle(id: string) {
    if (selected.includes(id)) {
      setSelected(selected.filter((s) => s !== id));
    } else if (selected.length < 2) {
      setSelected([...selected, id]);
    } else {
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
    }
  }

  return (
    <div style={{ minHeight: "100dvh", background: NAVY, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
      <div style={{ width: "100%", maxWidth: "640px" }}>
        <StepIndicator current={4} total={4} />
        <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(24px, 3.5vw, 38px)", fontWeight: 700, color: "#FFFFFF", marginBottom: "12px" }}>
          ¿Cuáles son tus prioridades?
        </h2>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "15px", color: "#6A8FAF", marginBottom: "8px" }}>
          Selecciona hasta <strong style={{ color: GOLD }}>2 opciones</strong> que representen lo más importante para ti
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px", marginBottom: "40px", marginTop: "32px" }}>
          {opciones4.map((op) => {
            const isSel = selected.includes(op.id);
            const isOther = !isSel && selected.length >= 2;
            return (
              <motion.button
                key={op.id}
                onClick={() => toggle(op.id)}
                animate={isOther && shaking ? { x: [0, -5, 5, -4, 4, 0] } : { x: 0 }}
                transition={{ duration: 0.4 }}
                style={{
                  background: isSel ? `linear-gradient(135deg, #1A3558, #112240)` : NAVY_CARD,
                  border: `2px solid ${isSel ? GOLD : NAVY_BORDER}`,
                  borderRadius: "12px",
                  padding: "20px 16px",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "border-color 0.2s, background 0.2s",
                  opacity: isOther ? 0.55 : 1,
                }}
              >
                {isSel && (
                  <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "8px" }}>
                    <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: GOLD, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <IconCheck color={NAVY} />
                    </div>
                  </div>
                )}
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", fontWeight: 600, color: isSel ? "#FFFFFF" : "#C8D6E8", marginBottom: "4px" }}>
                  {op.label}
                </div>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", color: "#4A6580" }}>
                  {op.sub}
                </div>
              </motion.button>
            );
          })}
        </div>

        <motion.button
          onClick={() => selected.length > 0 && onNext(selected)}
          animate={{ opacity: selected.length > 0 ? 1 : 0.35 }}
          disabled={selected.length === 0}
          style={{
            width: "100%",
            padding: "16px",
            background: selected.length > 0 ? `linear-gradient(90deg, ${GOLD}, ${GOLD_LIGHT})` : "#1E3A5F",
            color: selected.length > 0 ? NAVY : "#4A6580",
            fontFamily: "'Inter', sans-serif",
            fontSize: "15px",
            fontWeight: 700,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            border: "none",
            borderRadius: "10px",
            cursor: selected.length > 0 ? "pointer" : "not-allowed",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
          }}
        >
          Ver mi ruta estratégica
          <IconChevronRight color={selected.length > 0 ? NAVY : "#4A6580"} />
        </motion.button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Screen 5 — Cálculo del perfil
───────────────────────────────────────── */
function Screen5({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(onDone, 300);
          return 100;
        }
        return p + 2.5;
      });
    }, 60);
    return () => clearInterval(interval);
  }, [onDone]);

  return (
    <div style={{ minHeight: "100dvh", background: NAVY, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", padding: "40px 24px" }}>
      {/* Animated rings */}
      <div style={{ position: "relative", width: "120px", height: "120px", marginBottom: "48px" }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          style={{ position: "absolute", inset: 0, borderRadius: "50%", border: `2px solid transparent`, borderTopColor: GOLD, borderRightColor: GOLD }}
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "linear" }}
          style={{ position: "absolute", inset: "12px", borderRadius: "50%", border: `1px solid transparent`, borderTopColor: GOLD_LIGHT, opacity: 0.5 }}
        />
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <IconCompass color={GOLD} />
        </div>
      </div>

      <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 600, color: "#FFFFFF", textAlign: "center", marginBottom: "8px" }}>
        Construyendo tu Ruta Estratégica...
      </h2>
      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", color: "#6A8FAF", marginBottom: "48px", textAlign: "center" }}>
        Analizando tu perfil de inversionista
      </p>

      {/* Progress bar */}
      <div style={{ width: "100%", maxWidth: "360px", height: "4px", background: NAVY_BORDER, borderRadius: "2px", overflow: "hidden" }}>
        <motion.div
          style={{ height: "100%", background: `linear-gradient(90deg, ${GOLD}, ${GOLD_LIGHT})`, borderRadius: "2px" }}
          animate={{ width: `${progress}%` }}
          transition={{ ease: "easeOut" }}
        />
      </div>

      <div style={{ marginTop: "16px", fontFamily: "'Inter', sans-serif", fontSize: "13px", color: GOLD, fontWeight: 600 }}>
        {Math.round(progress)}%
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Result Screen
───────────────────────────────────────── */
function ResultScreen({ perfil }: { perfil: typeof PERFILES[keyof typeof PERFILES] }) {
  return (
    <div style={{ minHeight: "100dvh", background: NAVY, padding: "60px 24px 100px", overflowY: "auto" }}>
      <div style={{ maxWidth: "700px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: "8px" }}>
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "0.25em", color: GOLD, textTransform: "uppercase" }}>
            Tu perfil
          </span>
        </div>
        <h1 style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: "clamp(28px, 5vw, 52px)",
          fontWeight: 900,
          color: "#FFFFFF",
          lineHeight: 1.1,
          marginBottom: "24px",
          letterSpacing: "-0.01em",
        }}>
          {perfil.nombre}
        </h1>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: "16px", color: "#8FA5C0", lineHeight: 1.75, marginBottom: "56px", maxWidth: "560px" }}>
          {perfil.descripcion}
        </p>

        {/* Metro line + labels */}
        <div style={{ marginBottom: "56px" }}>
          <h3 style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", fontWeight: 700, letterSpacing: "0.2em", color: GOLD, textTransform: "uppercase", marginBottom: "28px" }}>
            Tu Ruta Estratégica
          </h3>
          <div style={{ display: "flex", gap: "24px", alignItems: "flex-start" }}>
            <MetroLine />
            <MetroLabels />
          </div>
        </div>

        {/* Vehicles */}
        <div style={{ marginBottom: "48px" }}>
          <h3 style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", fontWeight: 700, letterSpacing: "0.2em", color: GOLD, textTransform: "uppercase", marginBottom: "20px" }}>
            Vehículos Recomendados
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 200px), 1fr))", gap: "12px" }}>
            {perfil.vehiculos.map((v) => (
              <div
                key={v}
                style={{
                  background: NAVY_CARD,
                  border: `1px solid ${NAVY_BORDER}`,
                  borderRadius: "10px",
                  padding: "16px 16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <div style={{ width: "22px", height: "22px", borderRadius: "50%", background: `${GOLD}20`, border: `1px solid ${GOLD}60`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <IconCheck color={GOLD} />
                </div>
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", fontWeight: 500, color: "#C8D6E8" }}>
                  {v}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <button
            onClick={() => window.location.href = "/"}
            style={{
              padding: "16px 24px",
              background: `linear-gradient(90deg, ${GOLD}, ${GOLD_LIGHT})`,
              color: NAVY,
              fontFamily: "'Inter', sans-serif",
              fontSize: "15px",
              fontWeight: 700,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
          >
            <IconCalendar color={NAVY} />
            Agendar Diagnóstico
          </button>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <button
              onClick={() => window.location.href = "/"}
              style={{
                padding: "14px 20px",
                background: "transparent",
                color: GOLD,
                fontFamily: "'Inter', sans-serif",
                fontSize: "14px",
                fontWeight: 600,
                border: `1px solid ${GOLD}`,
                borderRadius: "10px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
              }}
            >
              <IconMap color={GOLD} />
              Entender esta ruta
            </button>
            <button
              onClick={() => window.location.href = "/nuevo-home"}
              style={{
                padding: "14px 20px",
                background: "transparent",
                color: "#6A8FAF",
                fontFamily: "'Inter', sans-serif",
                fontSize: "14px",
                fontWeight: 600,
                border: `1px solid ${NAVY_BORDER}`,
                borderRadius: "10px",
                cursor: "pointer",
              }}
            >
              Comparar otra ruta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Step indicator
───────────────────────────────────────── */
function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "40px" }}>
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          style={{
            height: "3px",
            flex: 1,
            borderRadius: "2px",
            background: i < current ? `linear-gradient(90deg, ${GOLD}, ${GOLD_LIGHT})` : NAVY_BORDER,
            transition: "background 0.4s",
          }}
        />
      ))}
      <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", color: "#4A6580", marginLeft: "4px", whiteSpace: "nowrap" }}>
        {current} / {total}
      </span>
    </div>
  );
}

/* ─────────────────────────────────────────
   Floating "¿Dónde estoy?" button + panel
───────────────────────────────────────── */
function WhereAmIButton({ onClick }: { onClick: () => void }) {
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      style={{
        position: "fixed",
        bottom: "28px",
        right: "24px",
        zIndex: 100,
        background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`,
        color: NAVY,
        fontFamily: "'Inter', sans-serif",
        fontSize: "13px",
        fontWeight: 700,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        border: "none",
        borderRadius: "50px",
        padding: "12px 20px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: "6px",
        boxShadow: `0 8px 24px rgba(201,168,76,0.35)`,
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
    >
      <IconMap color={NAVY} />
      ¿Dónde estoy?
    </motion.button>
  );
}

function WhereAmIPanel({
  open,
  onClose,
  screen,
  objetivo,
  perfil,
}: {
  open: boolean;
  onClose: () => void;
  screen: number;
  objetivo: string | null;
  perfil: typeof PERFILES[keyof typeof PERFILES] | null;
}) {
  const progressPercent = Math.round(((screen - 1) / 4) * 100);
  const filled = Math.round(progressPercent / 10);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 200 }}
          />
          <motion.div
            key="panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            style={{
              position: "fixed",
              top: 0,
              right: 0,
              bottom: 0,
              width: "min(360px, 92vw)",
              background: NAVY_CARD,
              borderLeft: `1px solid ${NAVY_BORDER}`,
              zIndex: 300,
              padding: "32px 24px",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: "24px",
            }}
          >
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "0.2em", color: GOLD, textTransform: "uppercase", marginBottom: "4px" }}>
                  Tu progreso
                </div>
                <div style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "20px", fontWeight: 700, color: "#FFFFFF" }}>
                  Ruta en construcción
                </div>
              </div>
              <button onClick={onClose} style={{ background: "transparent", border: "none", cursor: "pointer", padding: "4px" }}>
                <IconX />
              </button>
            </div>

            {/* Progress bar */}
            <div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "12px", color: "#6A8FAF", marginBottom: "8px" }}>
                {"█".repeat(filled)}{"░".repeat(10 - filled)} {progressPercent}%
              </div>
              <div style={{ height: "4px", background: NAVY_BORDER, borderRadius: "2px" }}>
                <div style={{ height: "100%", width: `${progressPercent}%`, background: `linear-gradient(90deg, ${GOLD}, ${GOLD_LIGHT})`, borderRadius: "2px", transition: "width 0.4s" }} />
              </div>
            </div>

            {/* Objective */}
            {objetivo && (
              <div style={{ background: `${NAVY}80`, borderRadius: "10px", padding: "16px", border: `1px solid ${NAVY_BORDER}` }}>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "0.15em", color: GOLD, textTransform: "uppercase", marginBottom: "8px" }}>
                  Tu objetivo
                </div>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "14px", color: "#C8D6E8" }}>
                  {opciones1.find((o) => o.id === objetivo)?.label ?? objetivo}
                </div>
              </div>
            )}

            {/* Compatible vehicles */}
            {perfil && (
              <div>
                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "0.15em", color: GOLD, textTransform: "uppercase", marginBottom: "12px" }}>
                  Vehículos compatibles
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {perfil.vehiculos.map((v) => (
                    <div key={v} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: GOLD, flexShrink: 0 }} />
                      <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", color: "#8FA5C0" }}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Steps */}
            <div>
              <div style={{ fontFamily: "'Inter', sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "0.15em", color: GOLD, textTransform: "uppercase", marginBottom: "12px" }}>
                Pasos completados
              </div>
              {["Objetivo principal", "Nivel de involucramiento", "Horizonte de tiempo", "Prioridades"].map((step, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px", opacity: i < screen - 1 ? 1 : 0.35 }}>
                  <div style={{
                    width: "20px", height: "20px", borderRadius: "50%",
                    background: i < screen - 1 ? GOLD : NAVY_BORDER,
                    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
                  }}>
                    {i < screen - 1 && <IconCheck color={NAVY} />}
                  </div>
                  <span style={{ fontFamily: "'Inter', sans-serif", fontSize: "13px", color: i < screen - 1 ? "#C8D6E8" : "#4A6580" }}>
                    {step}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ─────────────────────────────────────────
   Main NuevoHome component
───────────────────────────────────────── */
export default function NuevoHome() {
  usePlayfairFont();

  const [screen, setScreen] = useState<number>(1);
  const [objetivo, setObjetivo] = useState<string | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const perfil = objetivo ? PERFILES[objetivo] ?? null : null;

  function goToScreen(n: number) {
    setScreen(n);
    window.scrollTo({ top: 0, behavior: "instant" });
  }

  const screenVariants = {
    initial: { opacity: 0, x: 40 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -40 },
  };

  const transition = { duration: 0.35, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] };

  return (
    <div style={{ background: NAVY, minHeight: "100dvh", position: "relative" }}>
      <AnimatePresence mode="wait">
        {screen === 1 && (
          <motion.div key="s1" variants={screenVariants} initial="initial" animate="animate" exit="exit" transition={transition}>
            <Screen1
              onSelect={(id) => {
                setObjetivo(id);
                goToScreen(2);
              }}
            />
          </motion.div>
        )}

        {screen === 2 && (
          <motion.div key="s2" variants={screenVariants} initial="initial" animate="animate" exit="exit" transition={transition}>
            <Screen2 onNext={() => goToScreen(3)} />
          </motion.div>
        )}

        {screen === 3 && (
          <motion.div key="s3" variants={screenVariants} initial="initial" animate="animate" exit="exit" transition={transition}>
            <Screen3 onNext={() => goToScreen(4)} />
          </motion.div>
        )}

        {screen === 4 && (
          <motion.div key="s4" variants={screenVariants} initial="initial" animate="animate" exit="exit" transition={transition}>
            <Screen4 onNext={() => goToScreen(5)} />
          </motion.div>
        )}

        {screen === 5 && (
          <motion.div key="s5" variants={screenVariants} initial="initial" animate="animate" exit="exit" transition={transition}>
            <Screen5 onDone={() => goToScreen(6)} />
          </motion.div>
        )}

        {screen === 6 && perfil && (
          <motion.div key="s6" variants={screenVariants} initial="initial" animate="animate" exit="exit" transition={transition}>
            <ResultScreen perfil={perfil} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating button visible from screen 2 */}
      {screen >= 2 && screen <= 5 && (
        <WhereAmIButton onClick={() => setPanelOpen(true)} />
      )}

      <WhereAmIPanel
        open={panelOpen}
        onClose={() => setPanelOpen(false)}
        screen={screen}
        objetivo={objetivo}
        perfil={perfil}
      />
    </div>
  );
}
