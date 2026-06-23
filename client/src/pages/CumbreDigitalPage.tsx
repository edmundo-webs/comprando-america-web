import { useState } from "react";
import { trpc } from "@/lib/trpc";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { toast } from "sonner";

/* ─── Design tokens ─── */
const NAVY      = "#0B1F3A";
const NAVY_DEEP = "#061428";
const NAVY_MID  = "#132D52";
const GOLD      = "#C9A84C";
const GOLD_LIGHT = "#E8C97A";
const OFF_WHITE = "#F4F6F9";
const SLATE     = "#8EA3BF";
const DIVIDER   = "rgba(201, 168, 76, 0.2)";
const FD = "'Playfair Display', Georgia, serif";
const FB = "'Inter', system-ui, sans-serif";

/* ─── Country codes ─── */
const COUNTRY_CODES = [
  { code: "+52",  label: "🇲🇽 México (+52)" },
  { code: "+1",   label: "🇺🇸 EE.UU. (+1)" },
  { code: "+57",  label: "🇨🇴 Colombia (+57)" },
  { code: "+34",  label: "🇪🇸 España (+34)" },
  { code: "+54",  label: "🇦🇷 Argentina (+54)" },
  { code: "+56",  label: "🇨🇱 Chile (+56)" },
  { code: "+51",  label: "🇵🇪 Perú (+51)" },
  { code: "+58",  label: "🇻🇪 Venezuela (+58)" },
  { code: "+593", label: "🇪🇨 Ecuador (+593)" },
  { code: "+502", label: "🇬🇹 Guatemala (+502)" },
  { code: "+503", label: "🇸🇻 El Salvador (+503)" },
  { code: "+506", label: "🇨🇷 Costa Rica (+506)" },
  { code: "+507", label: "🇵🇦 Panamá (+507)" },
  { code: "+591", label: "🇧🇴 Bolivia (+591)" },
  { code: "+595", label: "🇵🇾 Paraguay (+595)" },
  { code: "+598", label: "🇺🇾 Uruguay (+598)" },
  { code: "+1CA", label: "🇨🇦 Canadá (+1)" },
];

/* ─── Speaker data ─── */
const PHOTOS = {
  edmundo: "/team/edmundo.jpg",
  tomas: "https://res.cloudinary.com/dgruohz6f/image/upload/v1773439328/comprando-america/ukgTQSSvdQDxOgaS.jpg",
  diego: "https://res.cloudinary.com/dgruohz6f/image/upload/v1781894896/tts-news/wjjnswgxf6mv7kml8j8m.jpg",
};

/* ─── Conversations data ─── */
const CONVERSATIONS = [
  {
    hora: "10:00 AM", num: "01",
    photo: PHOTOS.edmundo, photoPos: "top center",
    speakerLabel: "Edmundo Treviño",
    titulo: "De la Incertidumbre a la Oportunidad",
    sub: "Cómo construir tu próximo movimiento en Estados Unidos",
    desc: "La mayoría entra a Estados Unidos buscando oportunidades sin saber exactamente qué está buscando. Esta sesión abre con la pregunta que pocos se hacen: ¿cómo se crean realmente las oportunidades en el mercado estadounidense?",
    bullets: ["Tendencias de oportunidad real en el mercado actual", "Cómo piensan quienes ya construyen en EE.UU.", "Marco mental para detectar oportunidades estratégicas"],
  },
  {
    hora: "11:00 AM", num: "02",
    photo: PHOTOS.tomas, photoPos: "top center",
    speakerLabel: "Tomás Reséndez",
    titulo: "Vivir, Invertir y Expandirte en EE.UU.",
    sub: "Las rutas reales para construir tu futuro",
    desc: "Antes de elegir una ruta migratoria o de inversión, necesitas entender qué existe y para quién es cada opción. Esta sesión decodifica las alternativas disponibles hoy — sin tecnicismos innecesarios.",
    bullets: ["Rutas migratorias para empresarios e inversionistas", "Cómo relacionar migración con patrimonio", "Evaluar opciones según tus objetivos reales"],
  },
  {
    hora: "12:00 PM", num: "03",
    photo: PHOTOS.edmundo, photoPos: "top center",
    speakerLabel: "Edmundo Treviño + Diego",
    titulo: "Pensar Como Inversionista",
    sub: "El criterio detrás de las buenas decisiones",
    desc: "Las malas inversiones raramente se deben a mala suerte. Se deben a criterios equivocados. Esta sesión expone el proceso mental que usan inversionistas experimentados para evaluar antes de comprometer capital.",
    bullets: ["Criterios reales para evaluar oportunidades", "Señales de alerta antes de comprometer capital", "Decisiones con mayor confianza y menor riesgo"],
  },
  {
    hora: "1:00 PM", num: "04",
    photo: null, photoPos: "center",
    speakerLabel: "Speaker Invitado",
    titulo: "El Factor que Acelera Resultados",
    sub: "Lo que los empresarios exitosos hacen diferente",
    desc: "No hay sustituto para la experiencia de alguien que ya tomó las decisiones difíciles y vivió sus consecuencias. Una perspectiva externa sobre lo que nadie te dice en un libro sobre construir patrimonio en otro país.",
    bullets: ["Errores que otros ya cometieron por ti", "Marcos mentales de empresarios con trayectoria", "Las trampas más comunes del proceso de expansión"],
  },
  {
    hora: "2:00 PM", num: "05",
    photo: PHOTOS.diego, photoPos: "top center",
    speakerLabel: "Diego Alcalá + Edmundo",
    titulo: "Del Interés a la Acción",
    sub: "Casos reales, oportunidades reales y próximos pasos",
    desc: "Hay una gran diferencia entre lo que se promociona y lo que realmente genera valor. Esta sesión analiza oportunidades específicas con criterio real — no como pitch, sino como ejercicio de evaluación.",
    bullets: ["Casos reales con contexto y detalle suficiente", "Separar oportunidades sólidas de promesas vacías", "Marco para evaluar cualquier oportunidad futura"],
  },
  {
    hora: "2:45 PM", num: "06",
    photo: PHOTOS.edmundo, photoPos: "top center",
    speakerLabel: "Edmundo + Diego",
    titulo: "Tu Próximo Gran Paso",
    sub: "Cómo convertir claridad en acción",
    desc: "La información por sí sola no genera resultados. Esta sesión de cierre ayuda a cada asistente a traducir lo aprendido en decisiones concretas: qué conversaciones tener, qué preguntas hacerse.",
    bullets: ["Tus próximos pasos concretos definidos", "Qué tipo de acompañamiento necesitas", "Cómo Comprando América sigue siendo parte del proceso"],
  },
];

/* ─── Global CSS ─── */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=Inter:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; }

  .cd-section   { padding: 80px 24px; }
  .cd-wrap      { max-width: 960px; margin: 0 auto; }
  .cd-grid2     { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; }
  .cd-grid2c    { display: grid; grid-template-columns: 1fr 1px 1fr; gap: 0 40px; align-items: start; }
  .cd-grid4     { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
  .cd-grid5     { display: grid; grid-template-columns: repeat(5, 1fr); gap: 20px; }
  .cd-checklist { display: grid; grid-template-columns: 1fr 1fr; gap: 0 40px; }

  /* Flyer grid — 2 cols desktop */
  .cd-flyer-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2px;
  }

  /* Individual flyer card */
  .cd-flyer {
    position: relative;
    overflow: hidden;
    cursor: default;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
  }
  .cd-flyer:hover {
    transform: translateY(-4px);
    box-shadow: 0 24px 60px rgba(0,0,0,0.5), 0 0 0 1px ${GOLD}55;
    z-index: 2;
  }
  .cd-flyer-photo {
    width: 100%;
    height: 260px;
    object-fit: cover;
    object-position: top center;
    display: block;
    filter: grayscale(15%) brightness(0.72) contrast(1.05);
    transition: filter 0.4s ease, transform 0.4s ease;
  }
  .cd-flyer:hover .cd-flyer-photo {
    filter: grayscale(0%) brightness(0.8) contrast(1.05);
    transform: scale(1.03);
  }

  /* Placeholder for speaker TBD */
  .cd-flyer-placeholder {
    width: 100%;
    height: 260px;
    background: radial-gradient(ellipse at 50% 60%, #1a3a5c 0%, ${NAVY_DEEP} 70%);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .cd-btn:hover  { background: ${GOLD_LIGHT} !important; }

  details summary::-webkit-details-marker { display: none; }
  details > div  { padding: 16px 0 4px; font-size: 0.95rem; color: ${OFF_WHITE}; line-height: 1.75; }
  details[open] summary { color: ${GOLD}; }

  @media (max-width: 767px) {
    .cd-section   { padding: 48px 20px; }
    .cd-grid2, .cd-grid2c, .cd-grid4, .cd-grid5,
    .cd-checklist, .cd-flyer-grid { grid-template-columns: 1fr !important; gap: 2px; }
    .cd-vdivider  { display: none !important; }
    .cd-hero-h1   { font-size: 2rem !important; }
    .cd-flyer-photo, .cd-flyer-placeholder { height: 220px; }
  }

  @keyframes spin { to { transform: rotate(360deg); } }
`;

/* ─── Helpers ─── */
function GoldCheck() {
  return (
    <span style={{ color: GOLD, flexShrink: 0, marginTop: 3, display: "flex" }}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
    </span>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      display: "inline-flex", alignItems: "center",
      borderLeft: `3px solid ${GOLD}`, paddingLeft: 12,
      fontFamily: FB, fontSize: "0.72rem", letterSpacing: "0.2em",
      color: GOLD, textTransform: "uppercase", marginBottom: 20,
    }}>
      {children}
    </div>
  );
}

function GoldRule() {
  return (
    <div style={{
      width: 48, height: 2, background: `linear-gradient(90deg, ${GOLD}, transparent)`,
      margin: "20px 0",
    }}/>
  );
}

/* ─── Speaker Flyer Card ─── */
function FlyerCard({ c }: { c: typeof CONVERSATIONS[0] }) {
  return (
    <div className="cd-flyer" style={{ background: NAVY_DEEP }}>

      {/* Photo / Placeholder area */}
      <div style={{ position: "relative", overflow: "hidden" }}>
        {c.photo ? (
          <img
            src={c.photo}
            alt={c.speakerLabel}
            className="cd-flyer-photo"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
        ) : (
          <div className="cd-flyer-placeholder">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="0.8" opacity="0.4">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
        )}

        {/* Color overlay */}
        <div style={{
          position: "absolute", inset: 0,
          background: `linear-gradient(to bottom,
            rgba(6,20,40,0.15) 0%,
            rgba(6,20,40,0.25) 40%,
            rgba(6,20,40,0.75) 80%,
            ${NAVY_DEEP} 100%)`,
        }}/>

        {/* Large decorative number — background */}
        <div style={{
          position: "absolute", bottom: -16, right: 12,
          fontFamily: FD, fontSize: "9rem", fontWeight: 900,
          color: GOLD, opacity: 0.08, lineHeight: 1,
          userSelect: "none", letterSpacing: "-0.04em",
          pointerEvents: "none",
        }}>
          {c.num}
        </div>

        {/* Time badge — top left */}
        <div style={{
          position: "absolute", top: 18, left: 18,
          background: GOLD, color: NAVY,
          fontFamily: FB, fontWeight: 700,
          fontSize: "0.62rem", letterSpacing: "0.12em",
          padding: "4px 10px", borderRadius: 2,
          textTransform: "uppercase",
        }}>
          {c.hora}
        </div>

        {/* Conversation number — top right */}
        <div style={{
          position: "absolute", top: 18, right: 18,
          fontFamily: FB, fontSize: "0.62rem", letterSpacing: "0.2em",
          color: "rgba(255,255,255,0.45)",
          textTransform: "uppercase",
        }}>
          {c.num} / 06
        </div>

        {/* Speaker name — bottom left of photo */}
        <div style={{ position: "absolute", bottom: 20, left: 20 }}>
          <div style={{
            fontFamily: FB, fontSize: "0.62rem", letterSpacing: "0.2em",
            color: GOLD, textTransform: "uppercase", marginBottom: 5,
          }}>
            Conversación {c.num}
          </div>
          <div style={{
            fontFamily: FD, fontSize: "1.05rem", color: "#fff",
            fontWeight: 700, lineHeight: 1.2, textShadow: "0 1px 8px rgba(0,0,0,0.6)",
          }}>
            {c.speakerLabel}
          </div>
        </div>
      </div>

      {/* Content area */}
      <div style={{
        padding: "22px 24px 28px",
        borderLeft: `3px solid ${GOLD}`,
        borderBottom: `1px solid ${DIVIDER}`,
        borderRight: `1px solid ${DIVIDER}`,
      }}>
        <h3 style={{
          fontFamily: FD, fontSize: "1.15rem", color: "#fff",
          marginTop: 0, marginBottom: 6, lineHeight: 1.2,
        }}>
          {c.titulo}
        </h3>
        <p style={{
          fontSize: "0.8rem", color: GOLD, fontStyle: "italic",
          marginTop: 0, marginBottom: 14,
        }}>
          {c.sub}
        </p>
        <p style={{
          fontSize: "0.84rem", color: OFF_WHITE, lineHeight: 1.7,
          marginTop: 0, marginBottom: 18,
        }}>
          {c.desc}
        </p>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {c.bullets.map((b, j) => (
            <li key={j} style={{
              display: "flex", alignItems: "flex-start", gap: 10,
              fontSize: "0.79rem", color: SLATE, lineHeight: 1.6, marginBottom: 6,
            }}>
              <GoldCheck />{b}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ─── Props ─── */
interface Props {
  fuente: string;
  registroId: string;
  seoPath: string;
}

export function CumbreDigitalPage({ fuente, registroId, seoPath }: Props) {
  const [formData, setFormData] = useState({
    nombreCompleto: "", countryCode: "+52", whatsapp: "", email: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const registerMutation = trpc.leads.create.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      toast.success("¡Registro exitoso! Te esperamos el 22 de agosto.");
      setTimeout(() => { window.location.href = "https://chat.whatsapp.com/HIeLRj58zBsBweJuPjp2uN"; }, 1500);
    },
    onError: (err) => { toast.error(err.message || "Ocurrió un error. Intenta de nuevo."); },
  });

  const scrollToForm = () =>
    document.getElementById(registroId)?.scrollIntoView({ behavior: "smooth", block: "start" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nombreCompleto.trim()) { toast.error("Por favor ingresa tu nombre completo."); return; }
    if (!formData.whatsapp.trim())       { toast.error("Por favor ingresa tu número de WhatsApp."); return; }
    if (!formData.email.includes("@"))   { toast.error("Por favor ingresa un correo electrónico válido."); return; }
    registerMutation.mutate({
      nombreCompleto: formData.nombreCompleto.trim(),
      whatsapp: `${formData.countryCode.replace("CA", "")} ${formData.whatsapp.trim()}`,
      email: formData.email.trim(),
      fuente,
    });
  };

  return (
    <div style={{ fontFamily: FB, background: NAVY_DEEP, color: "#fff", overflowX: "hidden" }}>
      <style>{CSS}</style>
      <SEOHead
        title="Primera Cumbre Digital Comprando América"
        description="Por primera vez abrimos la Cumbre sin costo y en vivo. Sábado 22 de agosto, 2026. Estrategia, inversión y expansión a Estados Unidos."
        path={seoPath}
      />
      <Navbar />

      {/* ══════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════ */}
      <section style={{
        position: "relative",
        background: NAVY_DEEP,
        paddingTop: 120, paddingBottom: 80, paddingLeft: 24, paddingRight: 24,
        textAlign: "center",
        overflow: "hidden",
      }}>
        {/* Dot-grid texture */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: `radial-gradient(circle, rgba(201,168,76,0.18) 1px, transparent 1px)`,
          backgroundSize: "36px 36px",
          opacity: 0.45,
        }}/>
        {/* Radial glow */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: `radial-gradient(ellipse 80% 60% at 50% 30%, rgba(201,168,76,0.07) 0%, transparent 70%)`,
        }}/>

        <div className="cd-wrap" style={{ position: "relative" }}>
          <Eyebrow>Primera Cumbre Digital · Comprando América</Eyebrow>

          {/* Gold horizontal rule */}
          <div style={{
            width: 40, height: 1,
            background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`,
            margin: "0 auto 32px",
          }}/>

          <h1 className="cd-hero-h1" style={{
            fontFamily: FD,
            fontSize: "clamp(2rem, 5vw, 3.8rem)",
            fontWeight: 700, color: "#fff",
            lineHeight: 1.15, marginTop: 0, marginBottom: 24,
          }}>
            Las decisiones que tomes en Estados Unidos<br />
            durante los próximos años podrían definir<br />
            <span style={{ color: GOLD }}>tu patrimonio durante las próximas décadas.</span>
          </h1>

          <p style={{
            fontFamily: FB, fontSize: "1.1rem", color: OFF_WHITE,
            lineHeight: 1.75, maxWidth: 580, margin: "0 auto 32px",
          }}>
            Una mañana intensiva para empresarios e inversionistas
            que buscan construir, proteger y expandir su patrimonio
            en Estados Unidos con mayor criterio, contexto y estrategia.
          </p>

          {/* Value block */}
          <div style={{
            background: "rgba(201,168,76,0.07)",
            border: `1px solid ${DIVIDER}`,
            borderLeft: `3px solid ${GOLD}`,
            borderRadius: 4,
            padding: "20px 28px",
            maxWidth: 540, margin: "0 auto 40px",
            textAlign: "left",
            fontSize: "0.97rem", color: OFF_WHITE, lineHeight: 1.75,
          }}>
            Por primera vez abrimos esta cumbre sin costo y en vivo.<br />
            El mismo nivel de expertos. El mismo contenido.<br />
            <span style={{ color: GOLD, fontWeight: 500 }}>Ahora disponible para cualquier empresario serio.</span>
          </div>

          {/* Event data row */}
          <div style={{
            display: "flex", flexWrap: "wrap",
            justifyContent: "center", gap: "16px 40px", marginBottom: 44,
          }}>
            {[
              {
                icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.5">
                    <rect x="3" y="4" width="18" height="18" rx="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                ),
                text: "Sábado 22 de agosto, 2026",
              },
              {
                icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.5">
                    <circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15 15"/>
                  </svg>
                ),
                text: "10:00 AM Houston · 9:00 AM México",
              },
              {
                icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.5">
                    <rect x="2" y="3" width="20" height="14" rx="2"/>
                    <line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
                  </svg>
                ),
                text: "En vivo · YouTube + Facebook",
              },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: "0.88rem", color: SLATE }}>
                {item.icon}<span>{item.text}</span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <button
            className="cd-btn"
            onClick={scrollToForm}
            style={{
              background: GOLD, color: NAVY, fontFamily: FB, fontWeight: 700,
              fontSize: "0.9rem", letterSpacing: "0.1em",
              padding: "17px 44px", borderRadius: 3,
              border: "none", cursor: "pointer",
              transition: "background 0.2s ease",
              textTransform: "uppercase",
            }}
          >
            Reservar mi lugar sin costo
          </button>

          {/* Bottom line */}
          <p style={{ fontSize: "0.78rem", color: SLATE, marginTop: 16, marginBottom: 0 }}>
            Cupo ilimitado · Seguimiento exclusivo para registrados
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          EL PROBLEMA
      ══════════════════════════════════════════════ */}
      <section className="cd-section" style={{ background: NAVY }}>
        <div className="cd-wrap" style={{ textAlign: "center" }}>
          <h2 style={{
            fontFamily: FD, fontSize: "clamp(1.6rem, 3vw, 2.4rem)",
            color: "#fff", marginBottom: 8, marginTop: 0,
          }}>
            El problema no es la falta de oportunidades.
          </h2>
          <h2 style={{
            fontFamily: FD, fontSize: "clamp(1.6rem, 3vw, 2.4rem)",
            color: GOLD, fontStyle: "italic", marginBottom: 32, marginTop: 0,
          }}>
            Es la falta de claridad.
          </h2>
          <GoldRule />
          <p style={{
            fontFamily: FB, fontSize: "1.05rem", color: OFF_WHITE,
            lineHeight: 1.75, maxWidth: 640, margin: "0 auto",
          }}>
            La mayoría de los empresarios latinoamericanos que quieren operar en Estados Unidos
            no carecen de capital ni de ambición. Lo que les falta es contexto: saber qué rutas
            existen, qué errores evitar, cómo piensan los inversionistas que ya recorrieron ese camino.
            Esta cumbre no es un curso. Es una conversación honesta entre personas que ya tomaron
            decisiones difíciles y aprendieron de ellas.
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          ANTES / DESPUÉS
      ══════════════════════════════════════════════ */}
      <section className="cd-section" style={{ background: NAVY_MID }}>
        <div className="cd-wrap">
          <div style={{ marginBottom: 48 }}>
            <Eyebrow>La diferencia que hace un día</Eyebrow>
          </div>
          <div className="cd-grid2c">
            {/* ANTES */}
            <div>
              <div style={{ color: SLATE, marginBottom: 16 }}>
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                  <circle cx="12" cy="17" r=".5" fill="currentColor"/>
                  <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                </svg>
              </div>
              <div style={{
                fontSize: "0.68rem", letterSpacing: "0.2em",
                color: SLATE, textTransform: "uppercase", marginBottom: 16,
              }}>
                Antes de la cumbre
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {["Información fragmentada y contradictoria", "Incertidumbre sobre qué ruta tomar", "Decisiones basadas en suposiciones", "Sin red de contactos calificados", "Miedo a cometer errores costosos"].map((t, i) => (
                  <li key={i} style={{
                    display: "flex", alignItems: "flex-start", gap: 12,
                    color: SLATE, fontSize: "0.95rem", lineHeight: 1.8, marginBottom: 6,
                  }}>
                    <span style={{ flexShrink: 0 }}>—</span>{t}
                  </li>
                ))}
              </ul>
            </div>

            <div className="cd-vdivider" style={{ background: GOLD, opacity: 0.25, minHeight: 220 }}/>

            {/* DESPUÉS */}
            <div>
              <div style={{ color: GOLD, marginBottom: 16 }}>
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="10"/>
                  <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill={GOLD}/>
                </svg>
              </div>
              <div style={{
                fontSize: "0.68rem", letterSpacing: "0.2em",
                color: GOLD, textTransform: "uppercase", marginBottom: 16,
              }}>
                Después de la cumbre
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {["Claridad sobre opciones reales disponibles", "Criterio para evaluar oportunidades", "Contexto de quienes ya recorrieron el camino", "Conexiones con empresarios e inversionistas serios", "Próximos pasos concretos definidos"].map((t, i) => (
                  <li key={i} style={{
                    display: "flex", alignItems: "flex-start", gap: 12,
                    color: OFF_WHITE, fontSize: "0.95rem", lineHeight: 1.8, marginBottom: 6,
                  }}>
                    <GoldCheck />{t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          SECCIÓN DE SPEAKERS — 6 FLYER CARDS
      ══════════════════════════════════════════════ */}
      <section style={{ background: NAVY_DEEP, padding: "80px 0" }}>
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 24px", textAlign: "center", marginBottom: 56 }}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Eyebrow>Lo que vas a escuchar ese día</Eyebrow>
          </div>
          <h2 style={{
            fontFamily: FD, fontSize: "clamp(1.6rem, 3vw, 2.4rem)",
            color: "#fff", marginTop: 4, marginBottom: 16, lineHeight: 1.2,
          }}>
            Seis conversaciones estratégicas<br />
            <span style={{ color: GOLD, fontStyle: "italic" }}>que pueden cambiar cómo decides.</span>
          </h2>
          <p style={{ fontSize: "0.9rem", color: SLATE, maxWidth: 460, margin: "0 auto" }}>
            Empresarios e inversionistas que ya operan en EE.UU. — no teóricos,
            gente que tomó las decisiones difíciles y aprendió de ellas.
          </p>
        </div>

        {/* Flyer grid — full width, sin padding lateral */}
        <div className="cd-flyer-grid" style={{ maxWidth: 960, margin: "0 auto" }}>
          {CONVERSATIONS.map((c) => <FlyerCard key={c.num} c={c} />)}
        </div>

        {/* CTA debajo del grid */}
        <div style={{ textAlign: "center", marginTop: 48, padding: "0 24px" }}>
          <button
            className="cd-btn"
            onClick={scrollToForm}
            style={{
              background: "transparent", color: GOLD,
              fontFamily: FB, fontWeight: 600,
              fontSize: "0.88rem", letterSpacing: "0.1em",
              padding: "14px 36px", borderRadius: 3,
              border: `1px solid ${GOLD}`,
              cursor: "pointer", transition: "all 0.2s ease",
              textTransform: "uppercase",
            }}
          >
            Reservar lugar para las 6 conversaciones →
          </button>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          ESTA CUMBRE ES PARA TI SI…
      ══════════════════════════════════════════════ */}
      <section className="cd-section" style={{ background: NAVY }}>
        <div className="cd-wrap">
          <h2 style={{
            fontFamily: FD, fontSize: "clamp(1.6rem, 3vw, 2.4rem)",
            color: "#fff", textAlign: "center", marginTop: 0, marginBottom: 48,
          }}>
            Esta cumbre es para ti si...
          </h2>
          <div className="cd-checklist">
            {[
              "Tienes patrimonio acumulado y quieres protegerlo o expandirlo a Estados Unidos",
              "Estás evaluando opciones de inversión o migración pero no tienes claridad de ruta",
              "Has asistido a eventos o leído sobre el tema pero sientes que te falta contexto real",
              "Quieres tomar decisiones informadas antes de comprometer tiempo o capital",
              "Buscas relaciones con personas que están construyendo en el mismo camino",
              "Prefieres entender el panorama completo antes de dar el siguiente paso",
            ].map((t, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "flex-start", gap: 14,
                marginBottom: 22, fontSize: "0.97rem", color: OFF_WHITE, lineHeight: 1.65,
              }}>
                <GoldCheck />{t}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          POR QUÉ COMPRANDO AMÉRICA
      ══════════════════════════════════════════════ */}
      <section className="cd-section" style={{ background: NAVY_MID }}>
        <div className="cd-wrap">
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <Eyebrow>Por qué Comprando América</Eyebrow>
            <h2 style={{
              fontFamily: FD, fontSize: "clamp(1.6rem, 3vw, 2.4rem)",
              color: "#fff", marginTop: 8, marginBottom: 0,
            }}>
              No es un evento más.<br />
              <span style={{ color: GOLD, fontStyle: "italic" }}>Es una comunidad con criterio.</span>
            </h2>
          </div>
          <div className="cd-grid4">
            {[
              {
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <line x1="12" y1="3" x2="12" y2="21"/><path d="M5 21h14"/>
                    <path d="M5 9l7-6 7 6"/><path d="M3 9l4 8H3"/><path d="M17 9l4 8h-4"/>
                  </svg>
                ),
                title: "Criterio",
                text: "No hablamos de todo. Hablamos de lo que hemos validado y funciona en el mercado actual.",
              },
              {
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M3 12h18"/><path d="M3 6l9-3 9 3"/><path d="M3 18l9 3 9-3"/>
                  </svg>
                ),
                title: "Experiencia",
                text: "Nuestros speakers han invertido, migrado y construido en EE.UU. No teorizan desde afuera.",
              },
              {
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                ),
                title: "Comunidad",
                text: "Las mejores decisiones se toman rodeado de personas que entienden el mismo juego.",
              },
              {
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <polygon points="12 2 2 7 2 17 12 22 22 17 22 7 12 2"/>
                    <polyline points="2 7 12 12 22 7"/>
                    <line x1="12" y1="12" x2="12" y2="22"/>
                  </svg>
                ),
                title: "Oportunidades",
                text: "Seleccionamos oportunidades que hemos analizado. Mostramos opciones concretas, no esperanza.",
              },
            ].map((p, i) => (
              <div key={i} style={{
                borderTop: `2px solid ${GOLD}`,
                padding: "28px 20px",
                textAlign: "center",
              }}>
                <div style={{ color: GOLD, display: "flex", justifyContent: "center", marginBottom: 14 }}>{p.icon}</div>
                <h3 style={{ fontFamily: FD, fontSize: "1.2rem", color: "#fff", marginTop: 0, marginBottom: 8 }}>{p.title}</h3>
                <p style={{ fontSize: "0.86rem", color: SLATE, lineHeight: 1.7, margin: 0 }}>{p.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          ACCESO
      ══════════════════════════════════════════════ */}
      <section className="cd-section" style={{ background: NAVY_DEEP, textAlign: "center" }}>
        <div className="cd-wrap">
          <div className="cd-grid2" style={{ gap: 48, alignItems: "center", marginBottom: 32 }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "0.72rem", letterSpacing: "0.18em", color: SLATE, textTransform: "uppercase", marginBottom: 10 }}>Antes</div>
              <div style={{ fontFamily: FD, fontSize: "clamp(1.8rem, 4vw, 2.8rem)", color: SLATE, textDecoration: "line-through" }}>$549 USD</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "0.72rem", letterSpacing: "0.18em", color: GOLD, textTransform: "uppercase", marginBottom: 10 }}>Ahora</div>
              <div style={{ fontFamily: FD, fontSize: "clamp(1.8rem, 4vw, 2.8rem)", color: GOLD }}>Gratis y en vivo.</div>
            </div>
          </div>
          <div style={{ width: 40, height: 1, background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`, margin: "0 auto 28px" }}/>
          <p style={{ fontSize: "0.97rem", color: OFF_WHITE, maxWidth: 480, margin: "0 auto 40px", lineHeight: 1.75 }}>
            Por primera vez abrimos esta cumbre sin costo.<br />
            No es una promoción. Es una decisión de acceso.<br />
            El nivel de contenido y de expertos es exactamente el mismo.
          </p>
          <button className="cd-btn" onClick={scrollToForm} style={{
            background: GOLD, color: NAVY, fontFamily: FB, fontWeight: 700,
            fontSize: "0.9rem", letterSpacing: "0.1em",
            padding: "17px 44px", borderRadius: 3, border: "none",
            cursor: "pointer", transition: "background 0.2s ease",
            textTransform: "uppercase",
          }}>
            Reservar mi lugar sin costo
          </button>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          LO QUE OBTENDRÁS
      ══════════════════════════════════════════════ */}
      <section className="cd-section" style={{ background: NAVY }}>
        <div className="cd-wrap">
          <h2 style={{
            fontFamily: FD, fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
            color: "#fff", textAlign: "center", marginTop: 0, marginBottom: 44,
          }}>
            Al finalizar la cumbre tendrás:
          </h2>
          <div className="cd-grid5">
            {[
              { icon: <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.2"><path d="M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7z"/><line x1="9" y1="21" x2="15" y2="21"/><line x1="10" y1="17" x2="14" y2="17"/></svg>, title: "Mayor claridad" },
              { icon: <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.2"><line x1="12" y1="22" x2="12" y2="12"/><path d="M12 12L7 7"/><path d="M12 12l5-5"/><line x1="7" y1="7" x2="7" y2="2"/><line x1="17" y1="7" x2="17" y2="2"/></svg>, title: "Mejores decisiones" },
              { icon: <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.2"><path d="M17 11H7a4 4 0 0 0-4 4v1h18v-1a4 4 0 0 0-4-4z"/><path d="M9 11V7a3 3 0 0 1 6 0v4"/></svg>, title: "Nuevas relaciones" },
              { icon: <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.2"><line x1="2" y1="12" x2="22" y2="12"/><path d="M7 19l5-14 5 14"/></svg>, title: "Visión estratégica" },
              { icon: <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.2"><line x1="9" y1="12" x2="21" y2="12"/><line x1="9" y1="6" x2="21" y2="6"/><line x1="9" y1="18" x2="21" y2="18"/><polyline points="3 6 4 7 6 5"/><polyline points="3 12 4 13 6 11"/><polyline points="3 18 4 19 6 17"/></svg>, title: "Próximos pasos" },
            ].map((item, i) => (
              <div key={i} style={{
                border: `1px solid ${DIVIDER}`, borderRadius: 6,
                padding: "28px 20px", textAlign: "center",
              }}>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: 14 }}>{item.icon}</div>
                <h3 style={{ fontFamily: FD, fontSize: "1.05rem", color: "#fff", margin: 0 }}>{item.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          FAQ
      ══════════════════════════════════════════════ */}
      <section className="cd-section" style={{ background: NAVY_MID }}>
        <div className="cd-wrap" style={{ maxWidth: 720 }}>
          <h2 style={{
            fontFamily: FD, fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
            color: "#fff", textAlign: "center", marginTop: 0, marginBottom: 44,
          }}>
            Preguntas frecuentes
          </h2>
          {[
            { q: "¿Es realmente gratis?", a: "Completamente. No hay costo de entrada, no hay versión premium del mismo día, no hay trampa. Por primera vez abrimos la cumbre sin costo para empresarios e inversionistas que no pudieron asistir a ediciones anteriores." },
            { q: "¿Necesito tener dinero para invertir ya?", a: "No. La cumbre está diseñada para quienes están evaluando opciones, quieren entender el panorama o buscan claridad antes de tomar una decisión. El criterio que vas a adquirir tiene valor independientemente de tu momento actual." },
            { q: "¿Qué pasa si no puedo conectarme en vivo?", a: "La cumbre es en vivo. Si te registras, recibirás recordatorios para que puedas planear tu día con anticipación. Te recomendamos bloquear la mañana del 22 de agosto en tu agenda." },
            { q: "¿Es una presentación de ventas?", a: "No. Presentamos oportunidades de inversión reales porque eso es lo que hacemos, pero la cumbre es primero y principalmente contenido de valor. El objetivo es que salgas con más claridad y criterio, no con una promesa que no puedas evaluar." },
            { q: "¿Quiénes son los speakers?", a: "Empresarios e inversionistas que han operado, invertido y construido en Estados Unidos. No son conferencistas profesionales. Son personas con experiencia real en el mercado que están dispuestas a compartir lo que saben." },
            { q: "¿Cómo me conecto el día del evento?", a: "Al registrarte recibirás el enlace directo al canal de YouTube y Facebook donde se transmitirá en vivo. También te enviaremos recordatorio por WhatsApp." },
          ].map((faq, i) => (
            <details key={i} style={{ borderBottom: `1px solid ${DIVIDER}` }}>
              <summary style={{
                fontFamily: FB, fontSize: "1rem", fontWeight: 600, color: "#fff",
                cursor: "pointer", display: "flex", justifyContent: "space-between",
                alignItems: "center", padding: "20px 0", transition: "color 0.2s",
              }}>
                {faq.q}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="2">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </summary>
              <div>{faq.a}</div>
            </details>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          CTA FINAL + FORMULARIO
      ══════════════════════════════════════════════ */}
      <section
        id={registroId}
        className="cd-section"
        style={{
          background: `radial-gradient(ellipse 90% 70% at 50% 55%, rgba(201,168,76,0.07) 0%, ${NAVY_DEEP} 60%)`,
          paddingBottom: 100,
          scrollMarginTop: 80,
        }}
      >
        <div className="cd-wrap" style={{ textAlign: "center" }}>
          <h2 style={{
            fontFamily: FD, fontSize: "clamp(1.6rem, 3vw, 2.4rem)",
            color: "#fff", marginTop: 0, marginBottom: 8,
          }}>
            Tu próximo gran paso en Estados Unidos<br />comienza mucho antes de invertir.
          </h2>
          <h2 style={{
            fontFamily: FD, fontSize: "clamp(1.3rem, 2.5vw, 1.9rem)",
            color: GOLD, fontStyle: "italic", marginTop: 0, marginBottom: 12,
          }}>
            Comienza con una mejor decisión.
          </h2>
          <p style={{ color: SLATE, fontSize: "0.9rem", marginBottom: 48 }}>
            Regístrate hoy. El 22 de agosto es en vivo y sin repetición.
          </p>

          {submitted ? (
            <div style={{
              background: NAVY_MID, border: `1px solid ${DIVIDER}`,
              borderRadius: 10, padding: 48, maxWidth: 500, margin: "0 auto",
            }}>
              <div style={{ color: GOLD, display: "flex", justifyContent: "center", marginBottom: 20 }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
              </div>
              <h3 style={{ fontFamily: FD, fontSize: "1.6rem", color: "#fff", marginTop: 0, marginBottom: 12 }}>¡Ya estás registrado!</h3>
              <p style={{ color: OFF_WHITE, marginBottom: 8 }}>Te esperamos el sábado 22 de agosto.</p>
              <p style={{ color: SLATE, fontSize: "0.85rem", marginBottom: 28 }}>Uniéndote al grupo de WhatsApp en un momento…</p>
              <a
                href="https://chat.whatsapp.com/HIeLRj58zBsBweJuPjp2uN"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  background: "#25D366", color: "#fff", fontWeight: 600,
                  padding: "12px 24px", borderRadius: 40,
                  textDecoration: "none", fontSize: "0.9rem",
                }}
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Unirme al grupo de WhatsApp
              </a>
            </div>
          ) : (
            <div style={{
              background: NAVY_MID, border: `1px solid ${DIVIDER}`,
              borderLeft: `3px solid ${GOLD}`,
              borderRadius: 8, padding: "40px 44px",
              maxWidth: 500, margin: "0 auto", textAlign: "left",
            }}>
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {/* Nombre */}
                <div>
                  <label style={{ display: "block", fontFamily: FB, fontSize: "0.8rem", color: SLATE, marginBottom: 8, letterSpacing: "0.05em" }}>
                    Nombre completo <span style={{ color: GOLD }}>*</span>
                  </label>
                  <input
                    value={formData.nombreCompleto}
                    onChange={(e) => setFormData({ ...formData, nombreCompleto: e.target.value })}
                    placeholder="Tu nombre y apellido"
                    required
                    style={{
                      width: "100%", background: NAVY,
                      border: `1px solid rgba(142,163,191,0.25)`,
                      borderRadius: 3, padding: "12px 14px",
                      color: "#fff", fontFamily: FB, fontSize: "0.95rem", outline: "none",
                    }}
                  />
                </div>

                {/* WhatsApp */}
                <div>
                  <label style={{ display: "block", fontFamily: FB, fontSize: "0.8rem", color: SLATE, marginBottom: 8, letterSpacing: "0.05em" }}>
                    WhatsApp <span style={{ color: GOLD }}>*</span>
                  </label>
                  <div style={{ display: "flex", gap: 8 }}>
                    <div style={{ position: "relative", flexShrink: 0 }}>
                      <select
                        value={formData.countryCode}
                        onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
                        style={{
                          appearance: "none", background: NAVY,
                          border: `1px solid rgba(142,163,191,0.25)`,
                          borderRadius: 3, padding: "12px 30px 12px 12px",
                          color: "#fff", fontFamily: FB, fontSize: "0.82rem",
                          cursor: "pointer", outline: "none",
                        }}
                      >
                        {COUNTRY_CODES.map((c, i) => <option key={i} value={c.code}>{c.label}</option>)}
                      </select>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke={SLATE} strokeWidth="2"
                        style={{ position: "absolute", right: 9, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
                        <polyline points="6 9 12 15 18 9"/>
                      </svg>
                    </div>
                    <input
                      type="tel"
                      value={formData.whatsapp}
                      onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                      placeholder="123 456 7890"
                      required
                      style={{
                        flex: 1, background: NAVY,
                        border: `1px solid rgba(142,163,191,0.25)`,
                        borderRadius: 3, padding: "12px 14px",
                        color: "#fff", fontFamily: FB, fontSize: "0.95rem", outline: "none",
                      }}
                    />
                  </div>
                  <p style={{ fontSize: "0.72rem", color: SLATE, marginTop: 6, marginBottom: 0 }}>
                    Usaremos este número para enviarte el link del evento.
                  </p>
                </div>

                {/* Email */}
                <div>
                  <label style={{ display: "block", fontFamily: FB, fontSize: "0.8rem", color: SLATE, marginBottom: 8, letterSpacing: "0.05em" }}>
                    Correo electrónico <span style={{ color: GOLD }}>*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="tu@correo.com"
                    required
                    style={{
                      width: "100%", background: NAVY,
                      border: `1px solid rgba(142,163,191,0.25)`,
                      borderRadius: 3, padding: "12px 14px",
                      color: "#fff", fontFamily: FB, fontSize: "0.95rem", outline: "none",
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={registerMutation.isPending}
                  className="cd-btn"
                  style={{
                    background: GOLD, color: NAVY, fontFamily: FB, fontWeight: 700,
                    fontSize: "0.88rem", letterSpacing: "0.1em",
                    padding: "16px", borderRadius: 3, border: "none",
                    cursor: "pointer", transition: "background 0.2s ease",
                    width: "100%", opacity: registerMutation.isPending ? 0.7 : 1,
                    textTransform: "uppercase",
                  }}
                >
                  {registerMutation.isPending ? (
                    <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                      <span style={{
                        width: 14, height: 14,
                        border: `2px solid rgba(11,31,58,0.3)`, borderTopColor: NAVY,
                        borderRadius: "50%", display: "inline-block",
                        animation: "spin 0.7s linear infinite",
                      }}/>
                      Registrando...
                    </span>
                  ) : "Quiero mi lugar en la cumbre →"}
                </button>

                <p style={{ fontSize: "0.72rem", color: SLATE, textAlign: "center", margin: 0 }}>
                  Al registrarte recibirás el enlace directo al live y acceso al WhatsApp de seguimiento.
                </p>
              </form>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <div style={{
        background: NAVY_DEEP, textAlign: "center",
        padding: "24px", borderTop: `1px solid ${DIVIDER}`,
      }}>
        <p style={{ fontSize: "0.72rem", color: SLATE, margin: 0 }}>
          © 2026 Comprando América · Houston, TX · Todos los derechos reservados.
        </p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
