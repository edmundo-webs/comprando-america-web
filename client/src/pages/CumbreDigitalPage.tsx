import { useEffect, useRef, useState } from "react";
import { trpc } from "@/lib/trpc";
import { postCrmLead } from "@/lib/crm";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { toast } from "sonner";

/* ─── Destinos post-registro ─── */
const WHATSAPP_GRUPO = "https://chat.whatsapp.com/HIeLRj58zBsBweJuPjp2uN";
const YOUTUBE_CANAL = "https://www.youtube.com/@ComprandoAmerica";

/* ─── Design tokens ─── */
const NAVY      = "#0B1F3A";
const NAVY_DEEP = "#061428";
const NAVY_MID  = "#132D52";
const GOLD      = "#2563EB";
const GOLD_LIGHT = "#E8C97A";
const OFF_WHITE = "#F4F6F9";
const SLATE     = "#8EA3BF";
const DIVIDER   = "rgba(201, 168, 76, 0.2)";
const FD = "'Playfair Display', Georgia, serif";
const FB = "'Inter', system-ui, sans-serif";

/* ─── Country codes ─── */
const COUNTRY_CODES = [
  { code: "+52",  label: "🇲🇽 México (+52)" },
  { code: "+1",   label: "🇺🇸 Estados Unidos (+1)" },
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

/* ─── Datos del evento ───
   El evento arranca 9:00 AM de México (22 ago 2026). Los horarios de cada
   conversación en CONVERSATIONS están expresados en hora de Houston, que ese
   día va una hora adelante de Ciudad de México. */
const HORARIOS_PAIS = [
  { pais: "México",                    hora: "9:00 AM" },
  { pais: "Houston · Texas",           hora: "10:00 AM" },
  { pais: "Colombia, Perú y Ecuador",  hora: "10:00 AM" },
  { pais: "Miami · Nueva York",        hora: "11:00 AM" },
  { pais: "Chile",                     hora: "11:00 AM" },
  { pais: "Argentina",                 hora: "12:00 PM" },
  { pais: "España",                    hora: "5:00 PM" },
];

/* ─── Speaker data ─── */
const PHOTOS = {
  edmundo: "https://res.cloudinary.com/dgruohz6f/image/upload/v1782675101/tts-news/n1gic0tylj2r8b4gscrf.jpg",
  tomas:   "https://res.cloudinary.com/dgruohz6f/image/upload/v1782675101/tts-news/yh1xr8s1syprrlhblcbo.jpg",
  edmundoDiego03: "https://res.cloudinary.com/dgruohz6f/image/upload/v1782675100/tts-news/xpto1gompkv2f4lwqon4.jpg",
  edmundoDiego05: "https://res.cloudinary.com/dgruohz6f/image/upload/v1782675101/tts-news/kvqowamn1xqniqa0b6to.jpg",
  edmundoDiego06: "https://res.cloudinary.com/dgruohz6f/image/upload/v1782675101/tts-news/kfoeo1dlbkugilwhidl3.jpg",
};

/* ─── Conversations data ───
   Títulos, ponentes y la línea del problema que resuelve cada bloque vienen
   del brief de la Cumbre. Los horarios no se modifican. */
const CONVERSATIONS = [
  {
    hora: "10:00 AM", num: "01",
    speakers: [{ photo: PHOTOS.edmundo, name: "Edmundo Treviño" }],
    titulo: "Apertura + creación de oportunidades desde Estados Unidos",
    sub: "Por qué las mejores oportunidades no aparecen: se construyen, y qué hace falta para empezar a crearlas.",
    desc: "La mayoría espera encontrar la oportunidad correcta. Los empresarios que ya operan en Estados Unidos la construyen, y lo hacen tomando ciertas decisiones en cierto orden.",
    bullets: ["Entender cómo se construye una oportunidad.", "Reconocer el orden que sostiene las decisiones.", "Ubicar tu punto de partida real."],
    badges: ["Empresarios", "Inversionistas"],
  },
  {
    hora: "11:00 AM", num: "02",
    speakers: [{ photo: PHOTOS.tomas, name: "Tomás Reséndez", photoPos: "top center" }],
    titulo: "Opciones migratorias reales para inversionistas (entorno 2026)",
    sub: "Comprender cuándo una visa tiene sentido para un proyecto… y cuándo no, en el entorno migratorio actual.",
    desc: "Muchos buscan la visa antes de definir el negocio. Esta conversación ordena la relación entre proyecto empresarial y ruta migratoria en el entorno de 2026.",
    bullets: ["Distinguir las rutas que existen hoy.", "Ver cuándo una visa sostiene un proyecto.", "Reconocer cuándo conviene esperar."],
    badges: ["Migración", "Inversionistas"],
  },
  {
    hora: "12:00 PM", num: "03",
    speakers: [{ photo: PHOTOS.edmundoDiego03, name: "Edmundo Treviño · Diego Alcalá" }],
    titulo: "Oportunidades de inversión en Estados Unidos (I)",
    sub: "Cómo analizar una oportunidad más allá del rendimiento esperado.",
    desc: "El rendimiento es lo primero que se mira y casi nunca lo que define el resultado. Aquí se revisa qué más conviene leer antes de comprometer capital.",
    bullets: ["Leer la oportunidad completa, no solo el número.", "Identificar los riesgos que no se anuncian.", "Comparar opciones con un mismo criterio."],
    badges: ["Inversionistas", "Patrimonio"],
  },
  {
    hora: "1:00 PM", num: "04",
    speakers: [
      { photo: PHOTOS.tomas, name: "Tomás Reséndez", photoPos: "top center" },
      { photo: PHOTOS.edmundo, name: "Edmundo Treviño" },
    ],
    titulo: "Qué puedes esperar al migrar a Estados Unidos",
    sub: "Lo que conviene saber antes de mudarse: expectativas reales frente a la idea que solemos tener del proceso.",
    desc: "Entre la idea del proceso y el proceso hay una distancia que casi nadie anticipa. Esta conversación la nombra con casos concretos.",
    bullets: ["Anticipar lo que cambia al mudarse.", "Separar la expectativa de la realidad.", "Preparar a la familia y al negocio."],
    badges: ["Migración", "Empresarios"],
  },
  {
    hora: "2:00 PM", num: "05",
    speakers: [{ photo: PHOTOS.edmundoDiego05, name: "Edmundo Treviño · Diego Alcalá" }],
    titulo: "Presentación de oportunidades de inversión + casos de éxito",
    sub: "Qué decisiones tomaron otros empresarios y qué aprendieron durante el proceso.",
    desc: "Oportunidades concretas, junto con los casos de quienes ya recorrieron el camino — incluyendo lo que hoy harían distinto.",
    bullets: ["Ver oportunidades analizadas, no promesas.", "Conocer decisiones reales y sus resultados.", "Reconocer errores antes de cometerlos."],
    badges: ["Inversionistas", "Empresarios"],
  },
  {
    hora: "2:45 PM", num: "06",
    speakers: [{ photo: PHOTOS.edmundoDiego06, name: "Edmundo Treviño · Diego Alcalá" }],
    titulo: "¿Cómo ser parte de Comprando América?",
    sub: "Con quién quieres construir ese camino, y cómo continúa el recorrido después de la Cumbre.",
    desc: "Las decisiones difíciles se sostienen mejor acompañadas. Aquí explicamos cómo sigue el recorrido para quien quiera continuarlo con nosotros.",
    bullets: ["Entender cómo trabajamos.", "Definir tu siguiente conversación.", "Decidir con quién avanzar."],
    badges: ["Empresarios", "Inversionistas", "Patrimonio"],
  },
];

/* ─── Global CSS ─── */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=Inter:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; }

  .cd-section   { padding: 80px 24px; }
  .cd-wrap      { max-width: 960px; margin: 0 auto; }
  .cd-grid4     { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
  .cd-grid5     { display: grid; grid-template-columns: repeat(5, 1fr); gap: 20px; }
  .cd-checklist { display: grid; grid-template-columns: 1fr 1fr; gap: 0 40px; }
  .cd-horarios  { display: grid; grid-template-columns: repeat(7, 1fr); gap: 16px; }

  /* Flyer grid — 2 cols desktop, gap intencional */
  .cd-flyer-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 28px;
  }

  /* Individual flyer card */
  .cd-flyer {
    position: relative;
    overflow: hidden;
    cursor: default;
    border-radius: 8px;
    border: 1px solid rgba(201,168,76,0.12);
    box-shadow: 0 8px 32px rgba(0,0,0,0.35);
    transition: transform 0.35s ease, box-shadow 0.35s ease, border-color 0.35s ease;
  }
  .cd-flyer:hover {
    transform: translateY(-6px);
    box-shadow: 0 24px 64px rgba(0,0,0,0.55), 0 0 0 1px ${GOLD}66;
    border-color: ${GOLD}44;
    z-index: 2;
  }
  .cd-flyer-photo {
    width: 100%;
    height: 300px;
    object-fit: cover;
    object-position: top center;
    display: block;
    filter: grayscale(20%) brightness(0.68) contrast(1.08) saturate(0.85);
    transition: filter 0.45s ease, transform 0.45s ease;
  }
  .cd-flyer:hover .cd-flyer-photo {
    filter: grayscale(0%) brightness(0.78) contrast(1.05) saturate(1.1);
    transform: scale(1.04);
  }

  /* Placeholder for speaker TBD */
  .cd-flyer-placeholder {
    width: 100%;
    height: 300px;
    background: radial-gradient(ellipse at 50% 55%, #1c3f66 0%, ${NAVY_DEEP} 68%);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .cd-btn:hover  { background: ${GOLD_LIGHT} !important; }

  details summary::-webkit-details-marker { display: none; }
  details > div  { padding: 16px 0 4px; font-size: 0.95rem; color: ${OFF_WHITE}; line-height: 1.75; }
  details[open] summary { color: ${GOLD}; }

  @media (max-width: 1023px) {
    .cd-horarios { grid-template-columns: repeat(4, 1fr); }
  }

  @media (max-width: 767px) {
    .cd-section   { padding: 48px 20px; }
    .cd-grid4, .cd-grid5,
    .cd-checklist { grid-template-columns: 1fr !important; gap: 20px; }
    .cd-horarios  { grid-template-columns: 1fr 1fr !important; gap: 18px 12px; }
    .cd-flyer-grid { grid-template-columns: 1fr !important; gap: 20px; }
    .cd-hero-h1   { font-size: 1.7rem !important; }
    .cd-flyer-photo, .cd-flyer-placeholder { height: 220px; }
    .cd-hero-grid { grid-template-columns: 1fr !important; }
    .cd-hero-grid > div:first-child { min-height: 320px !important; }
    .cd-hero-grid > div:first-child img { object-position: top center !important; }
    .cd-hero-grid > div:first-child > div:first-of-type {
      background: linear-gradient(to bottom, transparent 50%, #061428 100%) !important;
    }
    .cd-hero-grid > div:last-child { padding: 32px 24px 60px !important; }
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

/* ─── Speaker photo slot (single half or full width) ─── */
function SpeakerSlot({ spk, half }: { spk: { photo: string | null; name: string; photoPos?: string }; half: boolean }) {
  return (
    <div style={{ position: "relative", flex: half ? "0 0 50%" : "0 0 100%", overflow: "hidden" }}>
      {spk.photo ? (
        <img
          src={spk.photo}
          alt={spk.name}
          className="cd-flyer-photo"
          style={spk.photoPos ? { objectPosition: spk.photoPos } : undefined}
          onError={(e) => {
            const img = e.target as HTMLImageElement;
            img.style.display = "none";
            const ph = img.nextElementSibling as HTMLElement | null;
            if (ph) ph.style.display = "flex";
          }}
        />
      ) : null}
      {/* Placeholder */}
      <div className="cd-flyer-placeholder" style={{ display: spk.photo ? "none" : "flex" }}>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="0.8" opacity="0.4">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
      </div>
      {/* Per-slot gradient */}
      <div style={{
        position: "absolute", inset: 0,
        background: `linear-gradient(to bottom,
          rgba(6,20,40,0.05) 0%,
          rgba(6,20,40,0.3) 55%,
          rgba(6,20,40,0.82) 100%)`,
      }}/>
      {/* Speaker name at bottom of slot */}
      <div style={{
        position: "absolute", bottom: 10, left: 0, right: 0,
        textAlign: "center", padding: "0 6px",
      }}>
        <div style={{
          fontFamily: FD, fontSize: half ? "0.78rem" : "1.05rem",
          color: "#fff", fontWeight: 700, lineHeight: 1.2,
          textShadow: "0 1px 8px rgba(0,0,0,0.7)",
        }}>
          {spk.name}
        </div>
      </div>
    </div>
  );
}

/* ─── Speaker Flyer Card ─── */
function FlyerCard({ c }: { c: typeof CONVERSATIONS[0] }) {
  const dual = c.speakers.length === 2;
  return (
    <div className="cd-flyer" style={{ background: NAVY_DEEP }}>

      {/* Photo area — single or split */}
      <div style={{ position: "relative", overflow: "hidden" }}>
        <div style={{ display: "flex", gap: dual ? 2 : 0 }}>
          {c.speakers.map((spk, i) => (
            <SpeakerSlot key={i} spk={spk} half={dual} />
          ))}
        </div>

        {/* Decorative number overlay — spans full width */}
        <div style={{
          position: "absolute", bottom: -16, right: 12,
          fontFamily: FD, fontSize: "9rem", fontWeight: 900,
          color: GOLD, opacity: 0.07, lineHeight: 1,
          userSelect: "none", letterSpacing: "-0.04em",
          pointerEvents: "none",
        }}>
          {c.num}
        </div>

        {/* Time badge — top left */}
        <div style={{
          position: "absolute", top: 14, left: 14,
          background: GOLD, color: NAVY,
          fontFamily: FB, fontWeight: 700,
          fontSize: "0.62rem", letterSpacing: "0.12em",
          padding: "4px 10px", borderRadius: 2,
          textTransform: "uppercase",
          zIndex: 2,
        }}>
          {c.hora}
        </div>

        {/* Conversation counter — top right */}
        <div style={{
          position: "absolute", top: 14, right: 14,
          fontFamily: FB, fontSize: "0.62rem", letterSpacing: "0.2em",
          color: "rgba(255,255,255,0.45)",
          textTransform: "uppercase",
          zIndex: 2,
        }}>
          {c.num} / 06
        </div>
      </div>

      {/* Content area */}
      <div style={{
        padding: "24px 26px 28px",
        background: NAVY_MID,
        borderTop: `3px solid ${GOLD}`,
        display: "flex", flexDirection: "column", gap: 0,
      }}>
        {/* Title */}
        <h3 style={{
          fontFamily: FD, fontSize: "1.15rem", color: "#fff",
          marginTop: 0, marginBottom: 6, lineHeight: 1.2,
        }}>
          {c.titulo}
        </h3>

        {/* Subtitle */}
        <p style={{
          fontSize: "0.8rem", color: GOLD, fontStyle: "italic",
          marginTop: 0, marginBottom: 12,
        }}>
          {c.sub}
        </p>

        {/* Description */}
        <p style={{
          fontSize: "0.84rem", color: OFF_WHITE, lineHeight: 1.7,
          marginTop: 0, marginBottom: 18,
        }}>
          {c.desc}
        </p>

        {/* Results */}
        <div style={{
          fontSize: "0.65rem", letterSpacing: "0.18em",
          color: SLATE, textTransform: "uppercase",
          marginBottom: 10, fontFamily: FB,
        }}>
          Al finalizar esta sesión:
        </div>
        <ul style={{ listStyle: "none", padding: 0, margin: "0 0 20px" }}>
          {c.bullets.map((b, j) => (
            <li key={j} style={{
              display: "flex", alignItems: "flex-start", gap: 10,
              fontSize: "0.79rem", color: SLATE, lineHeight: 1.6, marginBottom: 6,
            }}>
              <GoldCheck />{b}
            </li>
          ))}
        </ul>

        {/* Ideal para badges */}
        <div style={{ marginTop: "auto" }}>
          <div style={{
            fontSize: "0.62rem", letterSpacing: "0.15em",
            color: SLATE, textTransform: "uppercase",
            marginBottom: 8, fontFamily: FB,
          }}>
            Ideal para:
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {c.badges.map((badge, j) => (
              <span key={j} style={{
                fontFamily: FB, fontSize: "0.65rem",
                letterSpacing: "0.1em", textTransform: "uppercase",
                color: GOLD, border: `1px solid ${GOLD}44`,
                padding: "3px 9px", borderRadius: 2,
                background: `${GOLD}0D`,
              }}>
                {badge}
              </span>
            ))}
          </div>
        </div>
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
  const [enviando, setEnviando] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const registerMutation = trpc.leads.create.useMutation();

  const scrollToForm = () =>
    document.getElementById(registroId)?.scrollIntoView({ behavior: "smooth", block: "start" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (enviando) return;
    if (!formData.nombreCompleto.trim()) { toast.error("Por favor ingresa tu nombre completo."); return; }
    if (!formData.whatsapp.trim())       { toast.error("Por favor ingresa tu número de WhatsApp."); return; }
    if (!formData.email.includes("@"))   { toast.error("Por favor ingresa un correo electrónico válido."); return; }

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
        .catch((err) => { console.error("[cumbre] no se pudo guardar en ca_leads:", err); return false; }),
      postCrmLead(
        {
          name: nombreCompleto,
          email,
          phone: `${lada}${numero}`,
          sourceSlug: "web_ca_cumbre",
          hito: "registro_cumbre",
          stage: "partial",
          tags: [`fuente:${fuente}`],
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
    toast.success("¡Registro exitoso! Te esperamos el 22 de agosto.");
    setTimeout(() => { window.location.href = WHATSAPP_GRUPO; }, 1500);
  };

  // Red de seguridad contra el submit nativo del formulario: si por cualquier
  // motivo el handler delegado de React no llegara a correr, este listener
  // nativo evita que el navegador recargue la página y borre lo que el
  // visitante escribió. handleSubmit ya hace preventDefault por su cuenta.
  useEffect(() => {
    const form = formRef.current;
    if (!form) return;
    const blockNativeSubmit = (ev: Event) => ev.preventDefault();
    form.addEventListener("submit", blockNativeSubmit);
    return () => form.removeEventListener("submit", blockNativeSubmit);
  }, [submitted]);

  return (
    <div style={{ fontFamily: FB, background: NAVY_DEEP, color: "#fff", overflowX: "hidden" }}>
      <style>{CSS}</style>
      <SEOHead
        title="Primera Cumbre Digital Comprando América"
        description="6 horas que podrían ahorrarte años de prueba, error y malas decisiones. Sábado 22 de agosto de 2026, 9:00 AM México, en vivo. Criterio para decidir antes de invertir, abrir empresa o migrar a Estados Unidos."
        path={seoPath}
      />
      <Navbar />

      {/* ══════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════ */}
      <section style={{
        position: "relative",
        background: NAVY_DEEP,
        overflow: "hidden",
        height: "100vh",
        minHeight: 580,
        maxHeight: 900,
        paddingTop: 64,
      }}>
        {/* Dot-grid texture */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: `radial-gradient(circle, rgba(201,168,76,0.15) 1px, transparent 1px)`,
          backgroundSize: "36px 36px", opacity: 0.4, zIndex: 0,
        }}/>

        <div style={{
          position: "relative", zIndex: 1,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          height: "100%",
          maxWidth: 1100, margin: "0 auto",
        }} className="cd-hero-grid">

          {/* ── Left: Edmundo editorial photo ── */}
          <div style={{ position: "relative", overflow: "hidden", height: "100%" }}>
            <img
              src="https://res.cloudinary.com/dgruohz6f/image/upload/v1782675102/tts-news/qsqtimcq0kinkp5j6gcs.jpg"
              alt="Edmundo Treviño"
              style={{
                width: "100%", height: "100%",
                objectFit: "cover", objectPosition: "top center",
                display: "block",
                filter: "grayscale(8%) brightness(0.72) contrast(1.05)",
              }}
            />
            {/* Fade right */}
            <div style={{
              position: "absolute", inset: 0,
              background: `linear-gradient(to right, transparent 45%, ${NAVY_DEEP} 100%)`,
            }}/>
            {/* Fade bottom */}
            <div style={{
              position: "absolute", inset: 0,
              background: `linear-gradient(to bottom, transparent 65%, ${NAVY_DEEP} 100%)`,
            }}/>
          </div>

          {/* ── Right: copy ── */}
          <div style={{
            padding: "60px 44px 48px 28px",
            display: "flex", flexDirection: "column", justifyContent: "center",
            overflowY: "auto",
          }}>
            <Eyebrow>Primera Cumbre Digital · Comprando América</Eyebrow>

            <h1 className="cd-hero-h1" style={{
              fontFamily: FD,
              fontSize: "clamp(1.25rem, 2vw, 2rem)",
              fontWeight: 700, color: "#fff",
              lineHeight: 1.25, marginTop: 0, marginBottom: 16,
            }}>
              6 horas que podrían ahorrarte{" "}
              <span style={{ color: GOLD }}>años de prueba, error y malas decisiones.</span>
            </h1>

            <p style={{
              fontFamily: FB, fontSize: "0.88rem", color: OFF_WHITE,
              lineHeight: 1.7, marginTop: 0, marginBottom: 20,
            }}>
              Antes de invertir, abrir una empresa o iniciar una ruta migratoria en Estados Unidos,
              conviene entender qué decisiones tienen mayor impacto en tu patrimonio. Esta Cumbre
              fue diseñada para ayudarte a construir ese criterio.
            </p>

            {/* Value block */}
            <div style={{
              background: "rgba(201,168,76,0.06)",
              border: `1px solid ${DIVIDER}`,
              borderLeft: `3px solid ${GOLD}`,
              borderRadius: 3,
              padding: "14px 18px",
              marginBottom: 20,
              fontSize: "0.82rem", color: OFF_WHITE, lineHeight: 1.75,
            }}>
              Por primera vez abrimos nuestra Cumbre de Inversiones al público.<br />
              <span style={{ color: SLATE }}>El mismo nivel de expertos y de contenido que en las ediciones privadas.</span><br />
              <span style={{ color: GOLD, fontWeight: 600 }}>Claridad y criterio, de la mano de personas que ya invierten y operan en Estados Unidos.</span>
            </div>

            {/* Event data */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
              {[
                {
                  icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.8"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
                  text: "Sábado 22 de agosto de 2026 · 6 horas",
                },
                {
                  icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.8"><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15 15"/></svg>,
                  text: "9:00 AM México · 10:00 AM Houston y Colombia",
                },
                {
                  icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.8"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>,
                  text: "En vivo por YouTube y Facebook",
                },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.8rem", color: SLATE }}>
                  {item.icon}<span>{item.text}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div>
              <button
                className="cd-btn"
                onClick={scrollToForm}
                style={{
                  background: GOLD, color: NAVY, fontFamily: FB, fontWeight: 700,
                  fontSize: "0.82rem", letterSpacing: "0.12em",
                  padding: "14px 36px", borderRadius: 3,
                  border: "none", cursor: "pointer",
                  transition: "background 0.2s ease",
                  textTransform: "uppercase",
                }}
              >
                Reservar mi lugar
              </button>
              <p style={{ fontSize: "0.72rem", color: SLATE, marginTop: 10, marginBottom: 0 }}>
                Cupo ilimitado · Seguimiento exclusivo para registrados
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          BLOQUE 2 — ¿POR QUÉ EXISTE ESTA CUMBRE?
      ══════════════════════════════════════════════ */}
      <section className="cd-section" style={{ background: NAVY }}>
        <div className="cd-wrap" style={{ textAlign: "center" }}>
          <h2 style={{
            fontFamily: FD, fontSize: "clamp(1.6rem, 3vw, 2.4rem)",
            color: "#fff", marginBottom: 8, marginTop: 0,
          }}>
            ¿Por qué existe esta Cumbre?
          </h2>
          <h2 style={{
            fontFamily: FD, fontSize: "clamp(1.3rem, 2.5vw, 1.9rem)",
            color: GOLD, fontStyle: "italic", marginBottom: 32, marginTop: 0,
          }}>
            No empiezan por la decisión, empiezan por el trámite.
          </h2>
          <GoldRule />
          <div style={{ maxWidth: 640, margin: "0 auto" }}>
            <p style={{
              fontFamily: FB, fontSize: "1.05rem", color: OFF_WHITE,
              lineHeight: 1.75, marginTop: 0, marginBottom: 20,
            }}>
              Durante años hemos visto a empresarios cometer el mismo error: no empiezan por la
              decisión, empiezan por el trámite.
            </p>
            <p style={{
              fontFamily: FB, fontSize: "1.05rem", color: OFF_WHITE,
              lineHeight: 1.75, marginTop: 0, marginBottom: 20,
            }}>
              Unos abren una LLC antes de tener un proyecto. Otros buscan una visa antes de definir
              el negocio. Otros invierten antes de entender la estructura. Y muchos descubren,
              demasiado tarde, que el problema nunca fue la oportunidad: fue el orden en que
              tomaron las decisiones.
            </p>
            <p style={{
              fontFamily: FB, fontSize: "1.05rem", color: GOLD,
              lineHeight: 1.75, marginTop: 0, marginBottom: 0,
            }}>
              Esta Cumbre nace precisamente para ayudarte a evitar esos errores.
            </p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          BLOQUE 3 — SI ALGUNA VEZ HAS PENSADO…
      ══════════════════════════════════════════════ */}
      <section className="cd-section" style={{ background: NAVY_MID }}>
        <div className="cd-wrap">
          <h2 style={{
            fontFamily: FD, fontSize: "clamp(1.6rem, 3vw, 2.4rem)",
            color: "#fff", textAlign: "center", marginTop: 0, marginBottom: 44,
          }}>
            Si alguna vez has pensado…
          </h2>
          <div className="cd-checklist">
            {[
              "Primero abro una LLC y después veo en qué invertir.",
              "Con una empresa ya puedo sacar la visa.",
              "Florida siempre conviene más.",
              "Solo necesito abrir una cuenta bancaria.",
              "Quiero generar historial empresarial.",
              "Después resuelvo los impuestos.",
            ].map((t, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "flex-start", gap: 14,
                marginBottom: 22, fontSize: "0.97rem", color: OFF_WHITE,
                lineHeight: 1.65, fontStyle: "italic",
              }}>
                <GoldCheck />{t}
              </div>
            ))}
          </div>
          <p style={{
            fontFamily: FD, fontSize: "clamp(1.2rem, 2.2vw, 1.6rem)",
            color: GOLD, fontStyle: "italic", textAlign: "center",
            marginTop: 24, marginBottom: 0,
          }}>
            …entonces esta Cumbre fue diseñada para ti.
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          BLOQUE 4 — LO QUE REALMENTE OBTENDRÁS
      ══════════════════════════════════════════════ */}
      <section className="cd-section" style={{ background: NAVY }}>
        <div className="cd-wrap">
          <h2 style={{
            fontFamily: FD, fontSize: "clamp(1.6rem, 3vw, 2.4rem)",
            color: "#fff", textAlign: "center", marginTop: 0, marginBottom: 36,
          }}>
            Lo que realmente obtendrás
          </h2>
          <div style={{ maxWidth: 640, margin: "0 auto 48px", textAlign: "center" }}>
            {[
              "No aprenderás únicamente sobre LLC.",
              "No aprenderás únicamente sobre visas.",
              "No aprenderás únicamente sobre inversiones.",
            ].map((t, i) => (
              <p key={i} style={{
                fontFamily: FB, fontSize: "1.05rem", color: SLATE,
                lineHeight: 1.75, marginTop: 0, marginBottom: 6,
              }}>
                {t}
              </p>
            ))}
            <div style={{ display: "flex", justifyContent: "center" }}><GoldRule /></div>
            <p style={{
              fontFamily: FD, fontSize: "clamp(1.15rem, 2.2vw, 1.5rem)",
              color: GOLD, lineHeight: 1.5, marginTop: 0, marginBottom: 0,
            }}>
              Aprenderás a tomar decisiones con mayor criterio antes de comprometer tiempo,
              dinero y patrimonio.
            </p>
          </div>
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
          BLOQUE 5 — LAS CONVERSACIONES DE LA CUMBRE
          (agenda, ponentes y horarios se conservan tal cual)
      ══════════════════════════════════════════════ */}
      <section style={{ background: NAVY, padding: "88px 32px" }}>
        <div style={{ maxWidth: 1040, margin: "0 auto" }}>

          {/* Section header */}
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 style={{
              fontFamily: FD, fontSize: "clamp(1.6rem, 3vw, 2.4rem)",
              color: "#fff", marginTop: 4, marginBottom: 10, lineHeight: 1.2,
            }}>
              Estas son las conversaciones<br />
              <span style={{ color: GOLD, fontStyle: "italic" }}>que tendremos durante la Cumbre.</span>
            </h2>
            <p style={{ fontSize: "0.85rem", color: SLATE, marginTop: 0, marginBottom: 16 }}>
              (Bloques de 45 minutos aproximados)
            </p>
            <p style={{ fontSize: "0.9rem", color: SLATE, maxWidth: 460, margin: "0 auto" }}>
              Empresarios e inversionistas que ya operan en Estados Unidos — no teóricos,
              gente que tomó las decisiones difíciles y aprendió de ellas.
            </p>
          </div>

          {/* Horarios por país */}
          <div style={{
            border: `1px solid ${DIVIDER}`, borderRadius: 6,
            padding: "22px 24px", marginBottom: 56,
            background: "rgba(201,168,76,0.04)",
          }}>
            <div style={{
              fontFamily: FB, fontSize: "0.65rem", letterSpacing: "0.18em",
              color: GOLD, textTransform: "uppercase", textAlign: "center", marginBottom: 16,
            }}>
              Hora de inicio en tu país
            </div>
            <div className="cd-horarios">
              {HORARIOS_PAIS.map((h, i) => (
                <div key={i} style={{ textAlign: "center" }}>
                  <div style={{ fontFamily: FD, fontSize: "1.05rem", color: "#fff", lineHeight: 1.2 }}>{h.hora}</div>
                  <div style={{ fontFamily: FB, fontSize: "0.72rem", color: SLATE, marginTop: 4 }}>{h.pais}</div>
                </div>
              ))}
            </div>
            <p style={{
              fontSize: "0.72rem", color: SLATE, textAlign: "center",
              marginTop: 18, marginBottom: 0,
            }}>
              Los horarios de cada conversación se muestran en hora de Houston.
            </p>
          </div>

          {/* Flyer grid */}
          <div className="cd-flyer-grid">
            {CONVERSATIONS.map((c) => <FlyerCard key={c.num} c={c} />)}
          </div>

          {/* CTA debajo del grid */}
          <div style={{ textAlign: "center", marginTop: 56 }}>
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

        </div>
      </section>

      {/* ══════════════════════════════════════════════
          BLOQUE 6 — ¿QUIÉN OBTENDRÁ MÁS VALOR?
      ══════════════════════════════════════════════ */}
      <section className="cd-section" style={{ background: NAVY }}>
        <div className="cd-wrap">
          <h2 style={{
            fontFamily: FD, fontSize: "clamp(1.6rem, 3vw, 2.4rem)",
            color: "#fff", textAlign: "center", marginTop: 0, marginBottom: 12,
          }}>
            ¿Quién obtendrá más valor?
          </h2>
          <p style={{
            fontFamily: FD, fontSize: "clamp(1.1rem, 2vw, 1.4rem)",
            color: GOLD, fontStyle: "italic", textAlign: "center",
            marginTop: 0, marginBottom: 44,
          }}>
            Probablemente disfrutarás esta Cumbre si…
          </p>
          <div className="cd-checklist">
            {[
              "Estás pensando en invertir en Estados Unidos.",
              "Quieres abrir una empresa correctamente.",
              "Buscas una visa basada en un proyecto empresarial.",
              "Quieres expandir tu negocio.",
              "Prefieres entender antes de ejecutar.",
              "Valoras aprender de empresarios que ya operan e invierten en Estados Unidos.",
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
          BLOQUE 7 — LO QUE NO ENCONTRARÁS
      ══════════════════════════════════════════════ */}
      <section className="cd-section" style={{ background: NAVY_MID }}>
        <div className="cd-wrap">
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <h2 style={{
              fontFamily: FD, fontSize: "clamp(1.6rem, 3vw, 2.4rem)",
              color: "#fff", marginTop: 0, marginBottom: 20,
            }}>
              Lo que NO encontrarás
            </h2>
            <p style={{
              fontFamily: FB, fontSize: "1.05rem", color: SLATE,
              lineHeight: 1.75, maxWidth: 620, margin: "0 auto 24px",
            }}>
              No encontrarás promesas de dinero fácil, inversiones «perfectas», visas garantizadas
              ni soluciones universales.
            </p>
            <p style={{
              fontFamily: FD, fontSize: "clamp(1.15rem, 2.2vw, 1.5rem)",
              color: GOLD, lineHeight: 1.5, maxWidth: 620, margin: "0 auto",
            }}>
              Encontrarás experiencia, casos reales, distintas perspectivas y criterio para
              tomar mejores decisiones.
            </p>
          </div>
          <div className="cd-grid4">
            {[
              {
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M3 12h18"/><path d="M3 6l9-3 9 3"/><path d="M3 18l9 3 9-3"/>
                  </svg>
                ),
                title: "Experiencia",
                text: "Quienes hablan han invertido, migrado y construido en Estados Unidos. No teorizan desde afuera.",
              },
              {
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <polygon points="12 2 2 7 2 17 12 22 22 17 22 7 12 2"/>
                    <polyline points="2 7 12 12 22 7"/>
                    <line x1="12" y1="12" x2="12" y2="22"/>
                  </svg>
                ),
                title: "Casos reales",
                text: "Decisiones que otros empresarios ya tomaron, con sus resultados y lo que hoy harían distinto.",
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
                title: "Distintas perspectivas",
                text: "Ninguna decisión sirve para todas las personas. Escucharás más de una forma de leer lo mismo.",
              },
              {
                icon: (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <line x1="12" y1="3" x2="12" y2="21"/><path d="M5 21h14"/>
                    <path d="M5 9l7-6 7 6"/><path d="M3 9l4 8H3"/><path d="M17 9l4 8h-4"/>
                  </svg>
                ),
                title: "Criterio",
                text: "El objetivo no es que salgas con una respuesta, sino con la capacidad de evaluar las tuyas.",
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
            { q: "¿Cuánto dura y a qué hora empieza?", a: "Son 6 horas, en bloques de 45 minutos aproximados. Empieza a las 9:00 AM de México — 10:00 AM en Houston y Colombia, 11:00 AM en Miami y Nueva York, 12:00 PM en Argentina y 5:00 PM en España." },
            { q: "¿Tiene algún costo?", a: "No. Por primera vez abrimos la Cumbre al público, con el mismo nivel de expertos y de contenido que en las ediciones privadas." },
            { q: "¿Necesito tener dinero para invertir ya?", a: "No. La Cumbre está pensada para quienes están evaluando opciones o buscan entender el panorama antes de tomar una decisión. El criterio tiene valor independientemente de tu momento actual." },
            { q: "¿Qué pasa si no puedo conectarme en vivo?", a: "La Cumbre es en vivo y no hay repetición. Si te registras, recibirás recordatorios para que puedas planear el día con anticipación. Conviene bloquear el sábado 22 de agosto en tu agenda." },
            { q: "¿Es una presentación de ventas?", a: "No. Presentamos oportunidades de inversión reales porque eso es lo que hacemos, pero la Cumbre es primero y principalmente contenido de valor. El objetivo es que salgas con más criterio, no con una promesa que no puedas evaluar." },
            { q: "¿Quiénes son los ponentes?", a: "Edmundo Treviño, Tomás Reséndez y Diego Alcalá: empresarios e inversionistas que han operado, invertido y construido en Estados Unidos. No son conferencistas profesionales." },
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
          BLOQUE 8 — CIERRE: CTA + FORMULARIO
          (formulario, CTA e integraciones sin cambios)
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
            Antes de comprometer tiempo, dinero y patrimonio,<br />conviene tener el criterio para decidir.
          </h2>
          <h2 style={{
            fontFamily: FD, fontSize: "clamp(1.3rem, 2.5vw, 1.9rem)",
            color: GOLD, fontStyle: "italic", marginTop: 0, marginBottom: 12,
          }}>
            Estas 6 horas existen para eso.
          </h2>
          <p style={{ color: SLATE, fontSize: "0.9rem", marginBottom: 48 }}>
            Sábado 22 de agosto de 2026 · 9:00 AM México. En vivo, sin repetición.
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
                href={WHATSAPP_GRUPO}
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
              {/* El día del evento la transmisión es por YouTube: dejamos el
                  canal a la vista para que se suscriban desde ya. El redirect
                  automático sigue siendo únicamente el grupo de WhatsApp. */}
              <div style={{ marginTop: 18 }}>
                <a
                  href={YOUTUBE_CANAL}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 8,
                    color: OFF_WHITE, fontWeight: 500,
                    padding: "10px 20px", borderRadius: 40,
                    border: `1px solid ${DIVIDER}`,
                    textDecoration: "none", fontSize: "0.85rem",
                  }}
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="#FF0000">
                    <path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.5A3.02 3.02 0 0 0 .5 6.19C0 8.08 0 12 0 12s0 3.92.5 5.81a3.02 3.02 0 0 0 2.12 2.14c1.88.5 9.38.5 9.38.5s7.5 0 9.38-.5a3.02 3.02 0 0 0 2.12-2.14C24 15.92 24 12 24 12s0-3.92-.5-5.81zM9.55 15.57V8.43L15.82 12l-6.27 3.57z"/>
                  </svg>
                  Suscribirme al canal de YouTube
                </a>
              </div>
            </div>
          ) : (
            <div style={{
              background: NAVY_MID, border: `1px solid ${DIVIDER}`,
              borderLeft: `3px solid ${GOLD}`,
              borderRadius: 8, padding: "40px 44px",
              maxWidth: 500, margin: "0 auto", textAlign: "left",
            }}>
              <form ref={formRef} onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
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
                  disabled={enviando}
                  className="cd-btn"
                  style={{
                    background: GOLD, color: NAVY, fontFamily: FB, fontWeight: 700,
                    fontSize: "0.88rem", letterSpacing: "0.1em",
                    padding: "16px", borderRadius: 3, border: "none",
                    cursor: enviando ? "wait" : "pointer", transition: "background 0.2s ease",
                    width: "100%", opacity: enviando ? 0.7 : 1,
                    textTransform: "uppercase",
                  }}
                >
                  {enviando ? (
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
