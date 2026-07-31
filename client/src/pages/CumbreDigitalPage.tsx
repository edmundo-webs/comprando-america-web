import { useEffect, useRef, useState } from "react";
import { trpc } from "@/lib/trpc";
import { postCrmLead } from "@/lib/crm";
import Navbar from "@/components/Navbar";
import SEOHead from "@/components/SEOHead";
import { toast } from "sonner";

/* ─── Destinos post-registro ─── */
const WHATSAPP_GRUPO = "https://chat.whatsapp.com/HIeLRj58zBsBweJuPjp2uN";
const YOUTUBE_CANAL = "https://www.youtube.com/@ComprandoAmerica";

/* ─── Datos del evento ───
   El horario se menciona una sola vez en toda la página: aquí, en el HERO. */
const EVENTO = "Sábado 22 de agosto de 2026 · 6 horas · 10:00 AM Houston / 9:00 AM México · En vivo por Facebook y YouTube";

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

/* ─── Fotos de ponentes ─── */
const PHOTOS = {
  edmundo: "https://res.cloudinary.com/dgruohz6f/image/upload/v1782675101/tts-news/n1gic0tylj2r8b4gscrf.jpg",
  tomas:   "https://res.cloudinary.com/dgruohz6f/image/upload/v1782675101/tts-news/yh1xr8s1syprrlhblcbo.jpg",
  edmundoDiego03: "https://res.cloudinary.com/dgruohz6f/image/upload/v1782675100/tts-news/xpto1gompkv2f4lwqon4.jpg",
  edmundoDiego05: "https://res.cloudinary.com/dgruohz6f/image/upload/v1782675101/tts-news/kvqowamn1xqniqa0b6to.jpg",
  edmundoDiego06: "https://res.cloudinary.com/dgruohz6f/image/upload/v1782675101/tts-news/kfoeo1dlbkugilwhidl3.jpg",
};

/* ─── Programa ───
   Sin hora por bloque: la duración la comunica «Bloques de 45 minutos
   aproximados» y el horario vive únicamente en el HERO. */
const PROGRAMA = [
  {
    num: "01",
    titulo: "Apertura y creación de oportunidades",
    ponente: "Edmundo Treviño",
    avatars: [PHOTOS.edmundo],
    valor: "Las oportunidades no se encuentran: se construyen.",
  },
  {
    num: "02",
    titulo: "Opciones migratorias reales (entorno 2026)",
    ponente: "Tomás Reséndez",
    avatars: [PHOTOS.tomas],
    valor: "Cuándo una visa tiene sentido para un proyecto… y cuándo no.",
  },
  {
    num: "03",
    titulo: "Oportunidades de inversión en EE. UU.",
    ponente: "E. Treviño & D. Alcalá",
    avatars: [PHOTOS.edmundoDiego03],
    valor: "Cómo analizar una oportunidad más allá del rendimiento.",
  },
  {
    num: "04",
    titulo: "Qué esperar al migrar a EE. UU.",
    ponente: "T. Reséndez & E. Treviño",
    avatars: [PHOTOS.tomas, PHOTOS.edmundo],
    valor: "Expectativas reales frente a la idea que solemos tener.",
  },
  {
    num: "05",
    titulo: "Oportunidades + casos de éxito",
    ponente: "E. Treviño & D. Alcalá",
    avatars: [PHOTOS.edmundoDiego05],
    valor: "Qué decidieron otros empresarios y qué aprendieron.",
  },
  {
    num: "06",
    titulo: "¿Cómo ser parte de Comprando América?",
    ponente: "E. Treviño & D. Alcalá",
    avatars: [PHOTOS.edmundoDiego06],
    valor: "Cómo continúa el camino después de la Cumbre.",
  },
];

/* ─── Sección 3 · columnas ─── */
const COLUMNAS = [
  {
    titulo: "Si alguna vez has pensado…",
    tipo: "check" as const,
    items: [
      "Primero abro la LLC, después veo en qué invertir.",
      "Con una empresa ya puedo sacar la visa.",
      "Florida siempre conviene más.",
      "Después resuelvo los impuestos.",
    ],
  },
  {
    titulo: "Esta Cumbre es para ti si…",
    tipo: "check" as const,
    items: [
      "Estás pensando en invertir en Estados Unidos.",
      "Quieres abrir una empresa correctamente.",
      "Buscas una visa basada en un proyecto empresarial.",
      "Prefieres entender antes de ejecutar.",
    ],
  },
  {
    titulo: "Lo que no vas a encontrar",
    tipo: "cross" as const,
    items: [
      "Promesas de dinero fácil.",
      "Inversiones «perfectas».",
      "Visas garantizadas.",
      "Soluciones universales.",
    ],
  },
];

/* ─── Global CSS ─── */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=Inter:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; }

  .cd-section   { padding: 46px 24px; }
  .cd-wrap      { max-width: 1060px; margin: 0 auto; }

  /* HERO — mensaje a la izquierda, formulario a la derecha */
  .cd-hero-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; align-items: center; }

  /* Programa — cuadrícula compacta */
  .cd-prog-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
  .cd-prog-card {
    background: ${NAVY_MID};
    border: 1px solid ${DIVIDER};
    border-top: 2px solid ${GOLD};
    border-radius: 6px;
    padding: 16px 18px 18px;
    display: flex; flex-direction: column;
    transition: transform 0.25s ease, border-color 0.25s ease;
  }
  .cd-prog-card:hover { transform: translateY(-3px); border-color: ${GOLD}55; }

  /* Sección 3 — tres columnas */
  .cd-cols3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px; }

  /* Sin esto, el ancho mínimo intrínseco del <select> de ladas (marcado por su
     opción más larga) estira la columna del grid y desborda en móvil. */
  .cd-hero-grid > *, .cd-prog-grid > *, .cd-cols3 > * { min-width: 0; }

  .cd-btn:hover  { background: ${GOLD_LIGHT} !important; }

  @media (max-width: 1023px) {
    .cd-prog-grid { grid-template-columns: repeat(2, 1fr); }
  }

  @media (max-width: 767px) {
    .cd-section    { padding: 40px 20px; }
    .cd-hero       { padding: 92px 20px 36px !important; }
    .cd-hero-grid  { grid-template-columns: 1fr !important; gap: 20px; }
    .cd-prog-grid  { grid-template-columns: 1fr !important; }
    .cd-cols3      { grid-template-columns: 1fr !important; gap: 24px; }
    .cd-hero-h1    { font-size: 1.5rem !important; margin-bottom: 12px !important; }
    /* El formulario manda en la primera pantalla: el eyebrow de marca se
       omite en móvil para que los campos suban por encima del pliegue. */
    .cd-hero-eyebrow { display: none !important; }
    .cd-hero-sub     { margin-bottom: 16px !important; }
    /* Se acota la lada para que el número de WhatsApp quepa completo. */
    .cd-lada         { max-width: 152px; }
  }

  @keyframes spin { to { transform: rotate(360deg); } }
`;

/* ─── Helpers ─── */
function GoldCheck() {
  return (
    <span style={{ color: GOLD, flexShrink: 0, marginTop: 4, display: "flex" }}>
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
    </span>
  );
}

function GrayCross() {
  return (
    <span style={{ color: SLATE, flexShrink: 0, marginTop: 4, display: "flex" }}>
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
      </svg>
    </span>
  );
}

/* ─── Tarjeta de programa ─── */
function ProgramCard({ c }: { c: typeof PROGRAMA[0] }) {
  return (
    <div className="cd-prog-card">
      <div style={{
        fontFamily: FD, fontSize: "0.9rem", fontWeight: 700,
        color: GOLD, letterSpacing: "0.08em", marginBottom: 8,
      }}>
        {c.num}
      </div>

      <h3 style={{
        fontFamily: FD, fontSize: "1.05rem", color: "#fff",
        marginTop: 0, marginBottom: 10, lineHeight: 1.25,
      }}>
        {c.titulo}
      </h3>

      {/* Ponente */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <div style={{ display: "flex", flexShrink: 0 }}>
          {c.avatars.map((src, i) => (
            <img
              key={i}
              src={src}
              alt=""
              style={{
                width: 26, height: 26, borderRadius: "50%",
                objectFit: "cover", objectPosition: "top center",
                border: `1px solid ${GOLD}66`,
                marginLeft: i === 0 ? 0 : -8,
                background: NAVY_DEEP,
              }}
            />
          ))}
        </div>
        <span style={{ fontFamily: FB, fontSize: "0.76rem", color: OFF_WHITE, fontWeight: 500 }}>
          {c.ponente}
        </span>
      </div>

      <p style={{
        fontFamily: FB, fontSize: "0.82rem", color: SLATE,
        lineHeight: 1.6, marginTop: "auto", marginBottom: 0,
      }}>
        {c.valor}
      </p>
    </div>
  );
}

/* ─── Formulario de registro ───
   Mismos campos, mismo orden, mismas validaciones y mismo destino de datos que
   antes. Se renderiza dos veces (HERO y cierre) compartiendo el estado del
   contenedor, así que ambas instancias van siempre sincronizadas. */
interface FormProps {
  formData: { nombreCompleto: string; countryCode: string; whatsapp: string; email: string };
  setFormData: (d: FormProps["formData"]) => void;
  onSubmit: (e: React.FormEvent) => void;
  enviando: boolean;
  submitted: boolean;
}

function RegistroForm({ formData, setFormData, onSubmit, enviando, submitted }: FormProps) {
  const formRef = useRef<HTMLFormElement>(null);

  // Red de seguridad contra el submit nativo: si por cualquier motivo el
  // handler delegado de React no llegara a correr, este listener nativo evita
  // que el navegador recargue la página y borre lo que el visitante escribió.
  useEffect(() => {
    const form = formRef.current;
    if (!form) return;
    const blockNativeSubmit = (ev: Event) => ev.preventDefault();
    form.addEventListener("submit", blockNativeSubmit);
    return () => form.removeEventListener("submit", blockNativeSubmit);
  }, [submitted]);

  const inputStyle = {
    width: "100%", background: NAVY,
    border: `1px solid rgba(142,163,191,0.25)`,
    borderRadius: 3, padding: "11px 13px",
    color: "#fff", fontFamily: FB, fontSize: "0.92rem", outline: "none",
  } as const;

  if (submitted) {
    return (
      <div style={{
        background: NAVY_MID, border: `1px solid ${DIVIDER}`,
        borderLeft: `3px solid ${GOLD}`,
        borderRadius: 8, padding: "32px 28px", textAlign: "center",
      }}>
        <div style={{ color: GOLD, display: "flex", justifyContent: "center", marginBottom: 14 }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
        </div>
        <h3 style={{ fontFamily: FD, fontSize: "1.35rem", color: "#fff", marginTop: 0, marginBottom: 8 }}>
          ¡Ya estás registrado!
        </h3>
        <p style={{ color: SLATE, fontSize: "0.85rem", marginTop: 0, marginBottom: 20 }}>
          Uniéndote al grupo de WhatsApp en un momento…
        </p>
        <a
          href={WHATSAPP_GRUPO}
          style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "#25D366", color: "#fff", fontWeight: 600,
            padding: "11px 22px", borderRadius: 40,
            textDecoration: "none", fontSize: "0.88rem",
          }}
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          Unirme al grupo de WhatsApp
        </a>
        <div style={{ marginTop: 14 }}>
          <a
            href={YOUTUBE_CANAL}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              color: OFF_WHITE, fontWeight: 500,
              padding: "9px 18px", borderRadius: 40,
              border: `1px solid ${DIVIDER}`,
              textDecoration: "none", fontSize: "0.82rem",
            }}
          >
            <svg viewBox="0 0 24 24" width="15" height="15" fill="#FF0000">
              <path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.5A3.02 3.02 0 0 0 .5 6.19C0 8.08 0 12 0 12s0 3.92.5 5.81a3.02 3.02 0 0 0 2.12 2.14c1.88.5 9.38.5 9.38.5s7.5 0 9.38-.5a3.02 3.02 0 0 0 2.12-2.14C24 15.92 24 12 24 12s0-3.92-.5-5.81zM9.55 15.57V8.43L15.82 12l-6.27 3.57z"/>
            </svg>
            Suscribirme al canal de YouTube
          </a>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      background: NAVY_MID, border: `1px solid ${DIVIDER}`,
      borderLeft: `3px solid ${GOLD}`,
      borderRadius: 8, padding: "22px 22px 20px",
      textAlign: "left",
    }}>
      <p style={{
        fontFamily: FB, fontSize: "0.82rem", color: GOLD,
        marginTop: 0, marginBottom: 15, fontWeight: 500,
      }}>
        Registro gratuito. Te enviamos el acceso por WhatsApp.
      </p>

      <form ref={formRef} onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {/* Nombre */}
        <div>
          <label style={{ display: "block", fontFamily: FB, fontSize: "0.76rem", color: SLATE, marginBottom: 6, letterSpacing: "0.05em" }}>
            Nombre completo <span style={{ color: GOLD }}>*</span>
          </label>
          <input
            value={formData.nombreCompleto}
            onChange={(e) => setFormData({ ...formData, nombreCompleto: e.target.value })}
            placeholder="Tu nombre y apellido"
            required
            style={inputStyle}
          />
        </div>

        {/* WhatsApp */}
        <div>
          <label style={{ display: "block", fontFamily: FB, fontSize: "0.76rem", color: SLATE, marginBottom: 6, letterSpacing: "0.05em" }}>
            WhatsApp <span style={{ color: GOLD }}>*</span>
          </label>
          <div style={{ display: "flex", gap: 8 }}>
            <div className="cd-lada" style={{ position: "relative", flex: "0 1 auto", minWidth: 0 }}>
              <select
                value={formData.countryCode}
                onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
                style={{
                  appearance: "none", background: NAVY,
                  width: "100%", maxWidth: "100%",
                  border: `1px solid rgba(142,163,191,0.25)`,
                  borderRadius: 3, padding: "11px 28px 11px 11px",
                  color: "#fff", fontFamily: FB, fontSize: "0.8rem",
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
              style={{ ...inputStyle, flex: 1, width: "auto", minWidth: 0 }}
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label style={{ display: "block", fontFamily: FB, fontSize: "0.76rem", color: SLATE, marginBottom: 6, letterSpacing: "0.05em" }}>
            Correo electrónico <span style={{ color: GOLD }}>*</span>
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="tu@correo.com"
            required
            style={inputStyle}
          />
        </div>

        <button
          type="submit"
          disabled={enviando}
          className="cd-btn"
          style={{
            background: GOLD, color: NAVY, fontFamily: FB, fontWeight: 700,
            fontSize: "0.85rem", letterSpacing: "0.1em",
            padding: "15px", borderRadius: 3, border: "none",
            cursor: enviando ? "wait" : "pointer", transition: "background 0.2s ease",
            width: "100%", opacity: enviando ? 0.7 : 1,
            textTransform: "uppercase", marginTop: 4,
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
      </form>
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

  const registerMutation = trpc.leads.create.useMutation();

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

  const formProps = { formData, setFormData, onSubmit: handleSubmit, enviando, submitted };

  return (
    <div style={{ fontFamily: FB, background: NAVY_DEEP, color: "#fff", overflowX: "hidden" }}>
      <style>{CSS}</style>
      <SEOHead
        title="Primera Cumbre Digital Comprando América"
        description="6 horas que podrían ahorrarte años de prueba y error. Sábado 22 de agosto de 2026, 10:00 AM Houston / 9:00 AM México, en vivo. Criterio para decidir antes de invertir, abrir empresa o migrar a Estados Unidos."
        path={seoPath}
      />
      <Navbar />

      {/* ══════════════════════════════════════════════
          1 · HERO + REGISTRO
          El formulario va en la primera pantalla, sin scroll.
      ══════════════════════════════════════════════ */}
      <section style={{
        position: "relative",
        background: NAVY_DEEP,
        overflow: "hidden",
        padding: "104px 24px 44px",
      }} className="cd-hero">
        {/* Dot-grid texture */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: `radial-gradient(circle, rgba(201,168,76,0.15) 1px, transparent 1px)`,
          backgroundSize: "36px 36px", opacity: 0.4, zIndex: 0,
        }}/>

        <div className="cd-hero-grid" style={{ position: "relative", zIndex: 1, maxWidth: 1060, margin: "0 auto" }}>
          {/* ── Mensaje ── */}
          <div>
            <div style={{
              display: "inline-flex", alignItems: "center",
              borderLeft: `3px solid ${GOLD}`, paddingLeft: 12,
              fontFamily: FB, fontSize: "0.68rem", letterSpacing: "0.2em",
              color: GOLD, textTransform: "uppercase", marginBottom: 18,
            }} className="cd-hero-eyebrow">
              Primera Cumbre Digital · Comprando América
            </div>

            <h1 className="cd-hero-h1" style={{
              fontFamily: FD,
              fontSize: "clamp(1.6rem, 2.6vw, 2.35rem)",
              fontWeight: 700, color: "#fff",
              lineHeight: 1.2, marginTop: 0, marginBottom: 16,
            }}>
              6 horas que podrían ahorrarte{" "}
              <span style={{ color: GOLD }}>años de prueba y error.</span>
            </h1>

            <p style={{
              fontFamily: FB, fontSize: "0.95rem", color: OFF_WHITE,
              lineHeight: 1.65, marginTop: 0, marginBottom: 22,
            }} className="cd-hero-sub">
              Antes de invertir, abrir una empresa o iniciar una ruta migratoria en Estados
              Unidos, conviene entender qué decisiones pesan más en tu patrimonio.
            </p>

            {/* Datos del evento — única mención de horario en la página */}
            <div style={{
              background: "rgba(37,99,235,0.08)",
              border: `1px solid ${DIVIDER}`,
              borderLeft: `3px solid ${GOLD}`,
              borderRadius: 3,
              padding: "13px 16px",
              fontFamily: FB, fontSize: "0.86rem", fontWeight: 500,
              color: "#fff", lineHeight: 1.6,
            }}>
              {EVENTO}
            </div>
          </div>

          {/* ── Registro ── */}
          <div>
            <RegistroForm {...formProps} />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          2 · PROGRAMA
      ══════════════════════════════════════════════ */}
      <section className="cd-section" style={{ background: NAVY }}>
        <div className="cd-wrap">
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <h2 style={{
              fontFamily: FD, fontSize: "clamp(1.5rem, 2.6vw, 2.1rem)",
              color: "#fff", marginTop: 0, marginBottom: 8,
            }}>
              Las 6 conversaciones de la Cumbre
            </h2>
            <p style={{ fontFamily: FB, fontSize: "0.84rem", color: SLATE, margin: 0 }}>
              Bloques de 45 minutos aproximados
            </p>
          </div>

          <div className="cd-prog-grid">
            {PROGRAMA.map((c) => <ProgramCard key={c.num} c={c} />)}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          3 · POR QUÉ Y PARA QUIÉN
      ══════════════════════════════════════════════ */}
      <section className="cd-section" style={{ background: NAVY_MID }}>
        <div className="cd-wrap">
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <h2 style={{
              fontFamily: FD, fontSize: "clamp(1.5rem, 2.6vw, 2.1rem)",
              color: "#fff", marginTop: 0, marginBottom: 16,
            }}>
              Por qué y para quién
            </h2>
            <p style={{
              fontFamily: FB, fontSize: "0.95rem", color: OFF_WHITE,
              lineHeight: 1.7, maxWidth: 700, margin: "0 auto",
            }}>
              La mayoría no empieza por la decisión: empieza por el trámite. Abren una LLC antes
              de tener proyecto, buscan una visa antes de definir el negocio, invierten antes de
              entender la estructura.
            </p>
          </div>

          <div className="cd-cols3">
            {COLUMNAS.map((col, i) => (
              <div key={i}>
                <h3 style={{
                  fontFamily: FB, fontSize: "0.7rem", letterSpacing: "0.16em",
                  color: col.tipo === "cross" ? SLATE : GOLD, textTransform: "uppercase",
                  marginTop: 0, marginBottom: 16, fontWeight: 600,
                }}>
                  {col.titulo}
                </h3>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {col.items.map((t, j) => (
                    <li key={j} style={{
                      display: "flex", alignItems: "flex-start", gap: 10,
                      fontFamily: FB, fontSize: "0.88rem",
                      color: col.tipo === "cross" ? SLATE : OFF_WHITE,
                      lineHeight: 1.55, marginBottom: 9,
                      fontStyle: col.tipo === "cross" ? "normal" : "normal",
                    }}>
                      {col.tipo === "cross" ? <GrayCross /> : <GoldCheck />}{t}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <p style={{
            fontFamily: FD, fontSize: "clamp(1.05rem, 2vw, 1.35rem)",
            color: GOLD, textAlign: "center",
            marginTop: 28, marginBottom: 0,
          }}>
            Experiencia, casos reales y criterio para decidir mejor.
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          4 · CIERRE + REGISTRO
          Formulario y CTA idénticos a los del HERO.
      ══════════════════════════════════════════════ */}
      <section
        id={registroId}
        className="cd-section"
        style={{
          background: `radial-gradient(ellipse 90% 70% at 50% 40%, rgba(37,99,235,0.08) 0%, ${NAVY_DEEP} 60%)`,
          scrollMarginTop: 80,
        }}
      >
        <div style={{ maxWidth: 520, margin: "0 auto", textAlign: "center" }}>
          <h2 style={{
            fontFamily: FD, fontSize: "clamp(1.35rem, 2.4vw, 1.85rem)",
            color: "#fff", marginTop: 0, marginBottom: 22, lineHeight: 1.3,
          }}>
            Seis horas antes de una decisión que puede acompañarte años.
          </h2>
          <RegistroForm {...formProps} />
        </div>
      </section>

      {/* Footer */}
      <div style={{
        background: NAVY_DEEP, textAlign: "center",
        padding: "14px", borderTop: `1px solid ${DIVIDER}`,
      }}>
        <p style={{ fontSize: "0.72rem", color: SLATE, margin: 0 }}>
          © 2026 Comprando América · Houston, TX · Todos los derechos reservados.
        </p>
      </div>
    </div>
  );
}
