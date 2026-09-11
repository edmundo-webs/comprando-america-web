import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { useInView } from "@/hooks/useInView";
import { openWhatsApp, WHATSAPP_PHONE } from "@/lib/whatsapp";
import { sendCtaClick } from "@/lib/tracking";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ArrowRight,
  AlertTriangle,
  Building2,
  Calculator,
  CheckCircle2,
  ClipboardList,
  Coins,
  Home,
  Landmark,
  MapPin,
  Minus,
  Network,
  ShieldCheck,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";

/* ─── Brand tokens ─── */
const NAVY_CARD = "#0F2847";
const BORDER    = "#1E3A5F";
const GOLD      = "#2563EB";
const GOLD_LIGHT = "#3B82F6";

/* ══════════════════════════════════════════════════════
   ANALÍTICA
   Cada apertura de tarjeta, modal o acordeón se registra
   como un evento independiente en /api/track/cta y aparece
   agrupado por nombre en el panel de /cms.
══════════════════════════════════════════════════════ */
const TRACK_LOCATION = "/renta-garantizada";

const EVENTS = {
  ejemploNumeros:   "s8-ver-ejemplo-numeros",
  comoFunciona:     "s8-como-funciona-section8",
  riesgos:          "s8-riesgos",
  queHaceCA:        "s8-que-hace-comprando-america",
  esParaMi:         "s8-es-para-mi",
  revisarOportunidad: "s8-revisar-oportunidad",
  hablarAsesor:     "s8-hablar-asesor",
  faq:              "s8-todavia-tengo-preguntas",
} as const;

function track(cta: string) {
  sendCtaClick({ cta, location: TRACK_LOCATION });
}

/* ─── Mensajes de WhatsApp ─── */
const MSG_OPORTUNIDAD =
  "Hola, ya revisé la información sobre la estrategia de renta de vivienda y quiero conocer una oportunidad disponible para evaluar sus números.";
const MSG_ASESOR =
  "Hola, me interesa conocer más sobre la estrategia de renta de vivienda en Estados Unidos.";

const HERO_BG =
  "https://res.cloudinary.com/dgruohz6f/image/upload/v1773439251/comprando-america/fUiLqaRcYvhafLZf.webp";

/* ══════════════════════════════════════════════════════
   EJEMPLO CON NÚMEROS
   ──────────────────────────────────────────────────────
   Para publicar cifras reales:
     1. Pon `publicado: true`.
     2. Llena precioAdquisicion, rentaMensual y los gastos anuales.
   Los totales (ingreso bruto, gastos, flujo neto y rendimiento)
   se calculan solos: no hay que tocar el diseño ni la maquetación.
   Mientras `publicado` sea false la tabla se muestra con guiones,
   explicando que los números se revisan sobre una oportunidad vigente.

   Los números deben corresponder a una oportunidad vigente y aprobada.
══════════════════════════════════════════════════════ */
const EJEMPLO = {
  publicado: false,
  precioAdquisicion: 0,
  rentaMensual: 0,
  gastos: [
    { label: "Administración",        monto: 0 },
    { label: "Property Tax",          monto: 0 },
    { label: "Seguro",                monto: 0 },
    { label: "Mantenimiento / otros", monto: 0 },
  ],
};

const money = (n: number) => `$${n.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
const DASH = "$ ——————";

function calcularEjemplo() {
  const ingresoAnualBruto = EJEMPLO.rentaMensual * 12;
  const totalGastos = EJEMPLO.gastos.reduce((sum, g) => sum + g.monto, 0);
  const flujoNeto = ingresoAnualBruto - totalGastos;
  const rendimiento =
    EJEMPLO.precioAdquisicion > 0 ? (flujoNeto / EJEMPLO.precioAdquisicion) * 100 : 0;
  return { ingresoAnualBruto, totalGastos, flujoNeto, rendimiento };
}

/* ─── SEO ─── */
const PAGE_SEO = {
  title:
    "Programa de Vivienda con Renta Respaldada por el Gobierno | Ingresos en Dólares y Patrimonio | Comprando América",
  description:
    "Estrategia de adquisición de vivienda en Estados Unidos orientada a generar flujo por renta. Entiende la inversión, revisa los riesgos y evalúa si tiene sentido para tus objetivos.",
  path: "/renta-garantizada",
  schema: {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "¿Necesito vivir en Estados Unidos para invertir?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "La estructura dependerá del perfil y situación de cada inversionista. Comprando América puede orientarte sobre los siguientes pasos y conectarte con los especialistas correspondientes.",
        },
      },
      {
        "@type": "Question",
        name: "¿El gobierno garantiza toda mi renta?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No debe interpretarse así. La participación y proporción cubierta dependen del programa, elegibilidad, propiedad, inquilino y condiciones aplicables.",
        },
      },
      {
        "@type": "Question",
        name: "¿La propiedad será mía?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "En el modelo de adquisición individual presentado por Comprando América, el inversionista adquiere el activo; no debe confundirse con una participación en un fondo.",
        },
      },
    ],
  },
};

/* ─── Bloque 1: la inversión en 30 segundos ─── */
const QUICK_FACTS: {
  eyebrow: string;
  icon: LucideIcon;
  pre?: string;
  value: string;
  desc: string;
}[] = [
  {
    eyebrow: "Inversión",
    icon: Coins,
    pre: "Desde aproximadamente",
    value: "USD $90,000–$100,000*",
    desc: "El monto depende de la propiedad y el mercado.",
  },
  {
    eyebrow: "Activo",
    icon: Home,
    value: "Propiedad residencial",
    desc: "El inversionista adquiere el inmueble.",
  },
  {
    eyebrow: "Ingreso",
    icon: Coins,
    value: "Renta mensual",
    desc: "El ingreso proviene del arrendamiento de la propiedad.",
  },
  {
    eyebrow: "Estrategia",
    icon: TrendingUp,
    value: "Flujo + patrimonio",
    desc: "Buscamos que los números funcionen por renta, sin depender únicamente de una futura apreciación.",
  },
  {
    eyebrow: "Operación",
    icon: ClipboardList,
    value: "Administración local",
    desc: "La operación cotidiana puede realizarse mediante administración especializada.",
  },
];

const FLUJO_INGRESO = [
  "Compras una propiedad",
  "Recibes renta",
  "Pagas gastos de operación",
  "Conservas el flujo neto",
];

/* ─── Mercados ─── */
const MARKETS = [
  {
    city: "Niagara Falls",
    state: "Nueva York",
    price: "Desde USD $110,000",
    highlights: [
      "Mercado conocido y operado por el equipo.",
      "Cercanía con Buffalo y frontera con Canadá.",
      "Alta demanda de vivienda accesible.",
    ],
  },
  {
    city: "St. Petersburg",
    state: "Florida",
    price: "Aprox. USD $325,000",
    highlights: [
      "Mercado operado activamente por el equipo.",
      "Cercanía estratégica con Tampa.",
      "Demanda estable de vivienda.",
    ],
  },
];

/* ─── Contenido de las tarjetas desplegables ─── */
const RIESGOS = [
  { t: "Vacancia",            d: "Puede existir un periodo sin un inquilino adecuado." },
  { t: "Mantenimiento",       d: "Reparaciones y conservación pueden reducir el flujo de la propiedad." },
  { t: "Impuestos y seguros", d: "Estos costos pueden cambiar con el tiempo." },
  { t: "Cumplimiento",        d: "Participar en programas de asistencia de vivienda requiere cumplir las condiciones aplicables a la propiedad y operación." },
  { t: "Valor del inmueble",  d: "La apreciación futura no está garantizada." },
  { t: "Liquidez",            d: "Una propiedad inmobiliaria no se convierte inmediatamente en efectivo; vender requiere tiempo y un comprador." },
];

const QUE_HACE_CA = [
  { t: "Identificar oportunidades",     d: "Buscar activos alineados con la estrategia." },
  { t: "Analizar los números",          d: "Entender adquisición, renta, gastos y flujo." },
  { t: "Experiencia local",             d: "Apoyarse en personas que ya conocen estos mercados y su operación." },
  { t: "Administración y proveedores",  d: "Acceso a una red para apoyar la operación cotidiana del inmueble." },
  { t: "Estructura",                    d: "Conectar al inversionista con especialistas cuando requiera apoyo corporativo, fiscal, legal o patrimonial." },
];

/* ─── ¿Es para mí? ─── */
const PERFIL_SI = [
  "Buscas construir patrimonio en dólares.",
  "Quieres exposición a bienes raíces en Estados Unidos.",
  "Te interesa generar flujo mediante renta.",
  "Tienes una visión de mediano o largo plazo.",
  "Prefieres apoyarte en experiencia y operación local.",
];

const PERFIL_NO = [
  "Necesitas recuperar tu capital inmediatamente.",
  "Buscas comprar y vender rápidamente.",
  "Esperas que una inversión inmobiliaria no tenga riesgos.",
  "Tu decisión depende exclusivamente de que la propiedad aumente de valor.",
  "Esperas un rendimiento o renta garantizados.",
];

const PERFIL_RESULTADOS = [
  {
    key: "alto",
    min: 4,
    label: "Alineación alta",
    title: "Tu perfil parece alineado con esta estrategia.",
    body: "El siguiente paso es revisar una oportunidad concreta y analizar sus números: adquisición, renta, gastos y flujo.",
    cta: "Quiero revisar una oportunidad disponible",
  },
  {
    key: "media",
    min: 2,
    label: "Alineación parcial",
    title: "Hay coincidencias, pero falta contexto.",
    body: "Varias piezas encajan y otras no. Vale la pena una conversación breve para entender si conviene esta estrategia, otra ruta o una combinación.",
    cta: "Hablar con un asesor",
  },
  {
    key: "baja",
    min: 1,
    label: "Alineación baja",
    title: "Probablemente otra ruta encaje mejor.",
    body: "Este modelo está pensado para quien busca flujo en dólares y patrimonio a mediano o largo plazo. Si ese no es tu caso, existen otras rutas que pueden ajustarse mejor.",
    cta: "Explorar otras rutas con un asesor",
  },
];

/* ─── FAQ ─── */
const FAQS = [
  {
    q: "¿Necesito vivir en Estados Unidos?",
    a: "La estructura dependerá del perfil y situación de cada inversionista. Comprando América puede orientarte sobre los siguientes pasos y conectarte con los especialistas correspondientes.",
  },
  {
    q: "¿Tengo que administrar personalmente la propiedad?",
    a: "No necesariamente. Las oportunidades pueden apoyarse en administración local para gestionar la operación cotidiana. Los gastos y responsabilidades correspondientes al propietario permanecen a cargo del propietario.",
  },
  {
    q: "¿El gobierno garantiza toda mi renta?",
    a: "No debe interpretarse así. La participación y proporción cubierta dependen del programa, elegibilidad, propiedad, inquilino y condiciones aplicables.",
  },
  {
    q: "¿La propiedad será mía?",
    a: "En el modelo de adquisición individual presentado por Comprando América, el inversionista adquiere el activo; no debe confundirse con una participación en un fondo.",
  },
  {
    q: "¿Comprando América me vende simplemente una casa?",
    a: "No es la propuesta de valor. La oportunidad inmobiliaria es una parte; el diferencial es el ecosistema de experiencia, análisis, administración, proveedores y especialistas alrededor de la inversión.",
  },
];

/* ══════════════════════════════════════════════════════
   PIEZAS REUTILIZABLES
══════════════════════════════════════════════════════ */
function FadeIn({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const { ref, isInView } = useInView();
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function GoldAccent({ centered = false }: { centered?: boolean }) {
  return (
    <div
      className={`w-12 h-[3px] mb-6 rounded-full ${centered ? "mx-auto" : ""}`}
      style={{ backgroundColor: GOLD }}
    />
  );
}

/** Botón principal: pasa de entender la estrategia a evaluar una propiedad. */
function BotonOportunidad({
  label = "Quiero revisar una oportunidad disponible",
  className = "",
}: {
  label?: string;
  className?: string;
}) {
  return (
    <Button
      onClick={() =>
        openWhatsApp(WHATSAPP_PHONE, MSG_OPORTUNIDAD, EVENTS.revisarOportunidad, TRACK_LOCATION)
      }
      className={`bg-primary hover:bg-blue-600 text-white px-7 py-6 text-sm md:text-base gap-2 shadow-lg shadow-blue-600/25 ${className}`}
    >
      {label} <ArrowRight className="w-4 h-4" />
    </Button>
  );
}

/** Tarjeta que abre una ventana con la información de profundidad. */
function DeepDiveCard({
  icon: Icon,
  title,
  subtitle,
  event,
  children,
}: {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  event: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setOpen(true);
          track(event);
        }}
        className="group w-full h-full text-left rounded-2xl border p-7 flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
        style={{ backgroundColor: NAVY_CARD, borderColor: BORDER }}
      >
        <div
          className="w-11 h-11 rounded-lg flex items-center justify-center mb-5"
          style={{ backgroundColor: `${GOLD}18` }}
        >
          <Icon className="w-5 h-5" style={{ color: GOLD }} />
        </div>
        <h3 className="text-white font-semibold text-lg mb-2">{title}</h3>
        <p className="text-slate-400 text-sm leading-relaxed mb-6 flex-1">{subtitle}</p>
        <span
          className="inline-flex items-center gap-2 text-sm font-semibold"
          style={{ color: GOLD_LIGHT }}
        >
          Abrir <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </span>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-[calc(100%-2rem)] sm:max-w-2xl max-h-[85vh] overflow-y-auto border-[#1E3A5F] bg-[#0F2847] text-white">
          <DialogHeader className="text-left">
            <DialogTitle className="text-xl md:text-2xl font-bold text-white pr-8">
              {title}
            </DialogTitle>
            <DialogDescription className="text-slate-400">{subtitle}</DialogDescription>
          </DialogHeader>
          <div className="space-y-5">{children}</div>
        </DialogContent>
      </Dialog>
    </>
  );
}

/** Cierre destacado dentro de una ventana. */
function ModalCierre({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="text-sm md:text-base font-medium leading-relaxed border-l-4 pl-5 py-1 text-white"
      style={{ borderColor: GOLD }}
    >
      {children}
    </p>
  );
}

/** Renglón de la tabla del ejemplo con números. */
function Row({
  label,
  value,
  divider = false,
  strong = false,
  muted = false,
}: {
  label: string;
  value: string;
  divider?: boolean;
  strong?: boolean;
  muted?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between gap-4 px-5 ${muted ? "py-2.5" : "py-3.5"} ${divider ? "border-t" : ""}`}
      style={{ borderColor: BORDER }}
    >
      <span className={`text-sm ${muted ? "text-slate-400" : "text-slate-300"}`}>{label}</span>
      <span
        className={`text-sm font-mono ${strong ? "font-bold text-white" : muted ? "text-slate-300" : "font-semibold text-white"}`}
      >
        {value}
      </span>
    </div>
  );
}

/** Lista título + descripción usada dentro de las ventanas. */
function ModalList({
  items,
  icon: Icon = CheckCircle2,
  iconColor = GOLD_LIGHT,
}: {
  items: { t: string; d: string }[];
  icon?: LucideIcon;
  iconColor?: string;
}) {
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.t} className="flex items-start gap-3">
          <Icon className="w-4 h-4 flex-shrink-0 mt-1" style={{ color: iconColor }} />
          <div>
            <p className="text-white font-semibold text-sm">{item.t}</p>
            <p className="text-slate-400 text-sm leading-relaxed">{item.d}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   PAGE
══════════════════════════════════════════════════════ */
export default function Section8() {
  const [checked, setChecked] = useState<boolean[]>(Array(PERFIL_SI.length).fill(false));
  const [perfilAbierto, setPerfilAbierto] = useState(false);
  const [faqAbierta, setFaqAbierta] = useState(false);
  const [ejemploAbierto, setEjemploAbierto] = useState(false);

  const checkedCount = checked.filter(Boolean).length;
  const resultado = PERFIL_RESULTADOS.find((r) => checkedCount >= r.min);
  const seleccionadas = PERFIL_SI.filter((_, i) => checked[i]).map((s) => s.replace(/\.$/, ""));
  const msgPerfil = seleccionadas.length
    ? `${MSG_OPORTUNIDAD} En la autoevaluación me identifiqué con: ${seleccionadas.join("; ")}.`
    : MSG_OPORTUNIDAD;

  const { ingresoAnualBruto, totalGastos, flujoNeto, rendimiento } = calcularEjemplo();
  const val = (n: number) => (EJEMPLO.publicado ? money(n) : DASH);

  /** Abre la autoevaluación y lleva al usuario hasta ella. */
  const irAPerfil = () => {
    if (!perfilAbierto) {
      setPerfilAbierto(true);
      track(EVENTS.esParaMi);
    }
    document.getElementById("es-para-mi")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#0B1F3A] text-white overflow-x-hidden">
      <SEOHead {...PAGE_SEO} />
      <Navbar />

      {/* ══ BLOQUE 1 — HERO ══ */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0">
          <img src={HERO_BG} alt="Propiedades Section 8 en Estados Unidos" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B1F3A]/95 via-[#0B1F3A]/85 to-[#0B1F3A]/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F3A] via-transparent to-[#0B1F3A]/30" />
        </div>

        <div className="container relative z-10 py-12">
          <FadeIn>
            <div className="max-w-2xl">
              <p className="text-xs font-semibold tracking-[0.3em] uppercase mb-4 font-mono" style={{ color: GOLD }}>
                Propiedades · Programa de Vivienda con Renta Respaldada por el Gobierno
              </p>

              <h1 className="text-3xl md:text-4xl text-white font-bold leading-tight mb-2">
                Programa de Vivienda con Renta Respaldada por el Gobierno
              </h1>

              <p className="text-lg font-medium mb-4" style={{ color: GOLD_LIGHT }}>
                Flujo inmobiliario respaldado por programas gubernamentales
              </p>

              <p className="text-slate-300 text-base leading-relaxed mb-1 max-w-xl">
                Genera ingresos en dólares mediante bienes raíces respaldados por una necesidad básica: vivienda.
              </p>
              <p className="text-slate-400 text-sm leading-relaxed mb-7 max-w-xl">
                Sin necesidad de vivir en Estados Unidos ni administrar personalmente la propiedad.
              </p>

              <div className="flex flex-wrap gap-3">
                <BotonOportunidad className="px-6 py-5 text-sm" />
                <Button
                  variant="outline"
                  onClick={irAPerfil}
                  className="border-slate-600 text-white hover:bg-white/10 px-6 py-5 text-sm gap-2"
                >
                  ¿Esta estrategia es para mí?
                </Button>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ══ BLOQUE 2 — LA INVERSIÓN EN 30 SEGUNDOS ══ */}
      <section className="bg-[#F5F7FA] py-20 md:py-24">
        <div className="container">
          <FadeIn>
            <GoldAccent />
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#0B1F3A]">
              La inversión en 30 segundos
            </h2>
            <p className="text-slate-600 leading-relaxed mb-12 max-w-3xl">
              Una estrategia de adquisición de vivienda en Estados Unidos orientada a generar flujo por renta,
              incluyendo propiedades que pueden participar en programas gubernamentales de asistencia de vivienda.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {QUICK_FACTS.map((f, i) => (
              <FadeIn key={f.eyebrow} delay={i * 0.06} className="h-full">
                <div
                  className="h-full rounded-xl border bg-white shadow-sm p-6 flex flex-col"
                  style={{ borderColor: `${GOLD}33` }}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <f.icon className="w-4 h-4" style={{ color: GOLD }} />
                    <p className="text-[11px] font-semibold tracking-[0.15em] uppercase font-mono text-slate-500">
                      {f.eyebrow}
                    </p>
                  </div>
                  {f.pre && <p className="text-slate-500 text-xs mb-1">{f.pre}</p>}
                  <p className="font-bold text-[#0B1F3A] text-base leading-snug mb-2">{f.value}</p>
                  <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={0.2}>
            <p className="text-slate-500 text-xs leading-relaxed mt-8 max-w-3xl">
              *El precio depende de la propiedad, ciudad, mercado y disponibilidad. Durante la Cumbre se mencionaron
              oportunidades aproximadamente desde los USD $90,000 y rentas que, en ciertos ejemplos de ese rango,
              rondaban USD $900–$1,200 mensuales. Estas cifras son referenciales: no representan disponibilidad
              actual ni un rendimiento garantizado.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ══ BLOQUE 3 — MERCADOS ══ */}
      <section className="bg-[#0B1F3A] py-20 md:py-24">
        <div className="container max-w-4xl">
          <FadeIn>
            <GoldAccent />
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              ¿Dónde se encuentran actualmente las oportunidades?
            </h2>
            <p className="text-slate-400 mb-3 max-w-xl">
              Mercados activos en los que el equipo opera directamente.
            </p>
            <p className="text-slate-500 text-sm mb-12 max-w-xl">
              Las propiedades concretas que están a la venta en estos mercados se publican en{" "}
              <a href="/activos-disponibles" className="font-semibold underline" style={{ color: GOLD_LIGHT }}>
                activos disponibles
              </a>
              , con su precio y estatus actualizados.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {MARKETS.map((m, i) => (
              <FadeIn key={m.city} delay={i * 0.1}>
                <div className="rounded-2xl border overflow-hidden h-full" style={{ backgroundColor: NAVY_CARD, borderColor: BORDER }}>
                  <div className="px-7 py-5 border-b flex items-center justify-between gap-3" style={{ borderColor: BORDER, backgroundColor: `${GOLD}0D` }}>
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 flex-shrink-0" style={{ color: GOLD_LIGHT }} />
                      <div>
                        <p className="font-bold text-white text-lg leading-tight">{m.city}</p>
                        <p className="text-slate-400 text-sm">{m.state}</p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap" style={{ color: GOLD_LIGHT, backgroundColor: `${GOLD}1A` }}>
                      {m.price}
                    </span>
                  </div>
                  <ul className="px-7 py-5 space-y-3">
                    {m.highlights.map((h) => (
                      <li key={h} className="flex items-start gap-3 text-sm text-slate-400">
                        <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: GOLD_LIGHT }} />
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ══ BLOQUE 4 — ¿CÓMO SE GENERA EL INGRESO? ══ */}
      <section className="bg-[#F5F7FA] py-20 md:py-24">
        <div className="container max-w-4xl">
          <FadeIn>
            <GoldAccent />
            <h2 className="text-3xl md:text-4xl font-bold mb-10 text-[#0B1F3A]">
              ¿Cómo se genera el ingreso?
            </h2>
          </FadeIn>

          {/* Flujo en cuatro pasos */}
          <FadeIn delay={0.08}>
            <div className="flex flex-wrap items-stretch gap-3 mb-8">
              {FLUJO_INGRESO.map((paso, i) => (
                <div key={paso} className="flex items-center gap-3">
                  <div
                    className="rounded-xl border bg-white shadow-sm px-5 py-4 flex items-center gap-3"
                    style={{ borderColor: `${GOLD}33` }}
                  >
                    <span className="text-xs font-bold font-mono" style={{ color: GOLD }}>
                      0{i + 1}
                    </span>
                    <span className="text-sm font-medium text-[#0B1F3A]">{paso}</span>
                  </div>
                  {i < FLUJO_INGRESO.length - 1 && (
                    <ArrowRight className="w-4 h-4 flex-shrink-0 text-slate-400" />
                  )}
                </div>
              ))}
            </div>
          </FadeIn>

          <FadeIn delay={0.14}>
            <p className="text-slate-600 leading-relaxed mb-8 max-w-2xl">
              Además del flujo por renta, el inmueble puede aumentar de valor con el tiempo.{" "}
              <span className="font-semibold text-[#0B1F3A]">La apreciación no está garantizada.</span>
            </p>
          </FadeIn>

          <FadeIn delay={0.2}>
            <Button
              onClick={() => {
                setEjemploAbierto(true);
                track(EVENTS.ejemploNumeros);
              }}
              variant="outline"
              className="border-[#0B1F3A]/20 bg-white text-[#0B1F3A] hover:bg-[#0B1F3A] hover:text-white px-7 py-6 text-sm gap-2"
            >
              <Calculator className="w-4 h-4" /> Ver un ejemplo con números
            </Button>
          </FadeIn>

          {/* Ventana: así analizamos una propiedad */}
          <Dialog open={ejemploAbierto} onOpenChange={setEjemploAbierto}>
            <DialogContent className="max-w-[calc(100%-2rem)] sm:max-w-lg max-h-[85vh] overflow-y-auto border-[#1E3A5F] bg-[#0F2847] text-white">
              <DialogHeader className="text-left">
                <DialogTitle className="text-xl md:text-2xl font-bold text-white pr-8">
                  Así analizamos una propiedad
                </DialogTitle>
                <DialogDescription className="text-slate-400">
                  La estructura del análisis que se aplica a cada oportunidad.
                </DialogDescription>
              </DialogHeader>

              <div className="rounded-xl border overflow-hidden" style={{ borderColor: BORDER }}>
                <Row label="Precio de adquisición" value={val(EJEMPLO.precioAdquisicion)} />
                <Row label="Renta mensual" value={val(EJEMPLO.rentaMensual)} divider />
                <Row label="Ingreso anual bruto" value={val(ingresoAnualBruto)} divider strong />

                <div className="px-5 pt-4 pb-2 border-t" style={{ borderColor: BORDER }}>
                  <p className="text-[11px] font-semibold tracking-[0.15em] uppercase font-mono text-slate-500">
                    Menos
                  </p>
                </div>
                {EJEMPLO.gastos.map((g) => (
                  <Row key={g.label} label={g.label} value={val(g.monto)} muted />
                ))}
                <Row label="Total de gastos" value={val(totalGastos)} divider />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="rounded-xl border p-5" style={{ borderColor: `${GOLD}55`, backgroundColor: `${GOLD}12` }}>
                  <p className="text-[11px] font-semibold tracking-[0.15em] uppercase font-mono text-slate-400 mb-2">
                    Flujo neto estimado
                  </p>
                  <p className="text-xl font-bold font-mono" style={{ color: GOLD_LIGHT }}>
                    {val(flujoNeto)}
                    {EJEMPLO.publicado && <span className="text-sm font-normal text-slate-400"> / año</span>}
                  </p>
                </div>
                <div className="rounded-xl border p-5" style={{ borderColor: `${GOLD}55`, backgroundColor: `${GOLD}12` }}>
                  <p className="text-[11px] font-semibold tracking-[0.15em] uppercase font-mono text-slate-400 mb-2">
                    Rendimiento estimado
                  </p>
                  <p className="text-xl font-bold font-mono" style={{ color: GOLD_LIGHT }}>
                    {EJEMPLO.publicado ? `${rendimiento.toFixed(1)}%` : "—— %"}
                  </p>
                </div>
              </div>

              <p className="text-slate-400 text-sm leading-relaxed">
                No evaluamos una propiedad solamente por cuánto cuesta o cuánto podría aumentar de valor. Analizamos
                cuánto ingresa, cuánto cuesta operarla y cuánto flujo puede quedar después de gastos.
              </p>

              {!EJEMPLO.publicado && (
                <div
                  className="flex items-start gap-3 p-4 rounded-xl border-l-4"
                  style={{ borderColor: GOLD, backgroundColor: `${GOLD}0D` }}
                >
                  <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: GOLD_LIGHT }} />
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Los importes se llenan con los de una oportunidad vigente al momento de revisarla contigo. No
                    publicamos cifras de ejemplo que no correspondan a una propiedad real y disponible.
                  </p>
                </div>
              )}

              <BotonOportunidad className="w-full justify-center px-6 py-5 text-sm" />
            </DialogContent>
          </Dialog>
        </div>
      </section>

      {/* ══ BLOQUE 5 — QUIERO ENTENDER MÁS ══ */}
      <section className="bg-[#0B1F3A] py-20 md:py-24">
        <div className="container max-w-5xl">
          <FadeIn>
            <GoldAccent />
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Quiero entender más</h2>
            <p className="text-slate-400 mb-12 max-w-xl">
              Abre solamente lo que necesites para decidir. Cada tarjeta se despliega aquí mismo.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <FadeIn delay={0.06} className="h-full">
              <DeepDiveCard
                icon={Landmark}
                title="¿Cómo funciona Section 8?"
                subtitle="Entender el programa."
                event={EVENTS.comoFunciona}
              >
                <p className="text-slate-300 text-sm leading-relaxed">
                  Section 8 es un programa de asistencia de vivienda en Estados Unidos para personas y familias que
                  cumplen determinados criterios.
                </p>
                <p className="text-slate-300 text-sm leading-relaxed">
                  El inversionista continúa siendo propietario del inmueble. Cuando la propiedad y el inquilino
                  cumplen los requisitos correspondientes, una parte del pago de la renta puede provenir del programa
                  y el inquilino cubre la parte que le corresponda.
                </p>
                <p className="text-slate-300 text-sm leading-relaxed">
                  La proporción cubierta no es igual en todos los casos. Depende del inquilino, propiedad, ubicación,
                  autoridad correspondiente y requisitos aplicables. En el material de Comprando América se explica
                  expresamente que la participación puede variar y que existen reglas que deben cumplirse.
                </p>
                <ModalCierre>
                  El objetivo no es comprar porque existe un subsidio. Es encontrar una propiedad cuyos números hagan
                  sentido como inversión.
                </ModalCierre>
              </DeepDiveCard>
            </FadeIn>

            <FadeIn delay={0.12} className="h-full">
              <DeepDiveCard
                icon={ShieldCheck}
                title="¿Qué riesgos debo considerar?"
                subtitle="Lo que debes evaluar antes de decidir."
                event={EVENTS.riesgos}
              >
                <p className="text-slate-300 text-sm leading-relaxed">
                  Toda inversión inmobiliaria implica riesgos.
                </p>
                <ModalList items={RIESGOS} icon={AlertTriangle} iconColor="#94A3B8" />
                <ModalCierre>
                  No buscamos decirte que una inversión no tiene riesgo. Buscamos ayudarte a entender qué estás
                  comprando y qué debes evaluar antes de decidir.
                </ModalCierre>
              </DeepDiveCard>
            </FadeIn>

            <FadeIn delay={0.18} className="h-full">
              <DeepDiveCard
                icon={Network}
                title="¿Qué hace Comprando América?"
                subtitle="La diferencia entre encontrar una casa y construir una estrategia."
                event={EVENTS.queHaceCA}
              >
                <p className="text-slate-300 text-sm leading-relaxed">
                  Puedes comprar una propiedad por tu cuenta.
                </p>
                <p className="text-slate-300 text-sm leading-relaxed">
                  El valor de Comprando América está en ayudarte a conectar las piezas que existen alrededor de esa
                  inversión:
                </p>
                <ModalList items={QUE_HACE_CA} />
                <ModalCierre>
                  No se trata solamente de encontrar una propiedad. Se trata de tener la estructura, experiencia y red
                  para evaluarla y operarla correctamente.
                </ModalCierre>
              </DeepDiveCard>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ══ BLOQUE 6 — EXPERIENCIA OPERATIVA ══ */}
      <section className="bg-[#091A30] py-16 md:py-20">
        <div className="container max-w-3xl text-center">
          <FadeIn>
            <p className="text-xs mb-8 uppercase tracking-widest font-semibold font-mono text-slate-400">
              No solo hablamos de Section 8. Lo operamos.
            </p>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                { num: "29", label: "Años en el mercado inmobiliario estadounidense" },
                { num: "18", label: "Años administrando propiedades bajo Section 8" },
                { num: "150+", label: "Unidades administradas bajo este modelo" },
              ].map((stat) => (
                <div
                  key={stat.num}
                  className="rounded-2xl border p-7 flex flex-col items-center"
                  style={{ backgroundColor: NAVY_CARD, borderColor: BORDER }}
                >
                  <p className="text-4xl font-bold mb-2" style={{ color: GOLD }}>{stat.num}</p>
                  <p className="text-slate-400 text-sm leading-relaxed text-center">{stat.label}</p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ══ BLOQUE 7 — ¿ESTA ESTRATEGIA ES PARA MÍ? ══ */}
      <section id="es-para-mi" className="bg-[#0B1F3A] py-20 md:py-24">
        <div className="container max-w-3xl">
          <FadeIn>
            <div
              className="rounded-2xl border p-6 md:p-7 mb-5"
              style={{ backgroundColor: NAVY_CARD, borderColor: BORDER }}
            >
              <p className="text-[11px] font-semibold tracking-[0.2em] uppercase font-mono mb-3 text-slate-500">
                Caso hipotético
              </p>
              <p className="text-slate-300 leading-relaxed text-sm md:text-base">
                <span className="font-semibold text-white">Juan, empresario en Monterrey.</span> Construyó una empresa
                durante veinte años y su patrimonio depende principalmente de ese negocio. Hoy busca diversificar parte
                de su capital y generar ingresos en dólares sin involucrarse en la operación diaria.
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.08}>
            <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: NAVY_CARD, borderColor: BORDER }}>
              <button
                type="button"
                aria-expanded={perfilAbierto}
                aria-controls="panel-es-para-mi"
                onClick={() => {
                  const next = !perfilAbierto;
                  setPerfilAbierto(next);
                  if (next) track(EVENTS.esParaMi);
                }}
                className="w-full flex flex-wrap items-center justify-between gap-4 px-7 py-7 md:px-9 md:py-8 text-left transition-colors hover:bg-white/[0.03]"
              >
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-white">
                    ¿Esta estrategia es para mí?
                  </h2>
                  <p className="text-slate-400 text-sm mt-1">
                    Autoevaluación de 5 preguntas. Nada se envía ni se registra.
                  </p>
                </div>
                <span
                  className="inline-flex items-center gap-2 text-sm font-semibold tracking-wide uppercase font-mono whitespace-nowrap"
                  style={{ color: GOLD_LIGHT }}
                >
                  {perfilAbierto ? "Cerrar" : "Descubrirlo"}
                  <ArrowRight
                    className={`w-4 h-4 transition-transform ${perfilAbierto ? "rotate-90" : ""}`}
                  />
                </span>
              </button>

              <AnimatePresence initial={false}>
                {perfilAbierto && (
                  <motion.div
                    id="panel-es-para-mi"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="px-7 pb-8 md:px-9 md:pb-10 border-t" style={{ borderColor: BORDER }}>
                      {/* Puede hacer sentido si… */}
                      <p className="text-[11px] font-semibold tracking-[0.2em] uppercase font-mono mt-8 mb-4" style={{ color: GOLD_LIGHT }}>
                        Puede hacer sentido si…
                      </p>
                      <div className="space-y-3">
                        {PERFIL_SI.map((item, i) => (
                          <button
                            key={item}
                            type="button"
                            aria-pressed={checked[i]}
                            onClick={() =>
                              setChecked((prev) => prev.map((v, idx) => (idx === i ? !v : v)))
                            }
                            className="w-full flex items-center gap-4 p-4 rounded-xl border text-left transition-all duration-200"
                            style={{
                              borderColor: checked[i] ? `${GOLD}99` : BORDER,
                              backgroundColor: checked[i] ? `${GOLD}12` : "#0B1F3A",
                            }}
                          >
                            <div
                              className="w-5 h-5 flex-shrink-0 border-2 rounded flex items-center justify-center transition-all"
                              style={{
                                borderColor: checked[i] ? GOLD : BORDER,
                                backgroundColor: checked[i] ? GOLD : "transparent",
                              }}
                            >
                              {checked[i] && (
                                <svg viewBox="0 0 10 8" className="w-3 h-3" fill="none" stroke="#fff" strokeWidth="2.5">
                                  <path d="M1 4l3 3 5-6" />
                                </svg>
                              )}
                            </div>
                            <span
                              className="text-sm md:text-base font-medium transition-colors"
                              style={{ color: checked[i] ? "#E8ECF1" : "#94A3B8" }}
                            >
                              {item}
                            </span>
                          </button>
                        ))}
                      </div>

                      {/* Probablemente no es para ti si… */}
                      <p className="text-[11px] font-semibold tracking-[0.2em] uppercase font-mono mt-10 mb-4 text-slate-500">
                        Probablemente no es para ti si…
                      </p>
                      <div className="space-y-2.5">
                        {PERFIL_NO.map((item) => (
                          <div key={item} className="flex items-start gap-3 text-sm text-slate-500 leading-relaxed">
                            <Minus className="w-4 h-4 flex-shrink-0 mt-0.5 text-slate-600" />
                            {item}
                          </div>
                        ))}
                      </div>

                      {/* Resultado */}
                      <AnimatePresence mode="wait">
                        {resultado && (
                          <motion.div
                            key={resultado.key}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 12 }}
                            transition={{ duration: 0.3 }}
                            className="mt-8 p-6 rounded-xl border"
                            style={{ borderColor: `${GOLD}55`, backgroundColor: `${GOLD}0D` }}
                          >
                            <p className="text-[11px] font-semibold tracking-[0.15em] uppercase font-mono mb-3 text-slate-400">
                              {checkedCount} de {PERFIL_SI.length} coincidencias · {resultado.label}
                            </p>
                            <p className="font-semibold text-lg mb-2" style={{ color: GOLD_LIGHT }}>
                              {resultado.title}
                            </p>
                            <p className="text-slate-300 text-sm leading-relaxed mb-6">{resultado.body}</p>
                            <Button
                              onClick={() =>
                                openWhatsApp(
                                  WHATSAPP_PHONE,
                                  checkedCount >= 4 ? msgPerfil : MSG_ASESOR,
                                  checkedCount >= 4 ? EVENTS.revisarOportunidad : EVENTS.hablarAsesor,
                                  TRACK_LOCATION
                                )
                              }
                              className="bg-primary hover:bg-blue-600 text-white px-6 py-5 text-sm gap-2 shadow-lg shadow-blue-600/25"
                            >
                              {resultado.cta} <ArrowRight className="w-4 h-4" />
                            </Button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ══ BLOQUE 8 — CTA PRINCIPAL + PREGUNTAS ══ */}
      <section className="bg-[#091A30] py-20 md:py-28">
        <div className="container max-w-3xl">
          <FadeIn>
            <div className="text-center">
              <GoldAccent centered />
              <h2 className="text-2xl md:text-4xl font-bold text-white leading-tight mb-4">
                ¿Quieres pasar de entender la estrategia a evaluar una propiedad?
              </h2>
              <p className="text-slate-400 text-base md:text-lg mb-10 max-w-xl mx-auto leading-relaxed">
                Revisa una oportunidad disponible y analiza sus números antes de decidir.
              </p>

              <div className="flex flex-wrap justify-center gap-3">
                <BotonOportunidad />
                <a href="/activos-disponibles">
                  <Button
                    variant="outline"
                    className="border-slate-600 text-white hover:bg-white/10 px-7 py-6 text-sm md:text-base gap-2"
                  >
                    <Building2 className="w-4 h-4" /> Ver propiedades disponibles
                  </Button>
                </a>
              </div>
            </div>
          </FadeIn>

          {/* CTA secundario — preguntas */}
          <FadeIn delay={0.12}>
            <div className="mt-14 text-center">
              <button
                type="button"
                aria-expanded={faqAbierta}
                aria-controls="panel-faq"
                onClick={() => {
                  const next = !faqAbierta;
                  setFaqAbierta(next);
                  if (next) track(EVENTS.faq);
                }}
                className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors underline underline-offset-4"
              >
                {faqAbierta ? "Ocultar preguntas" : "Todavía tengo preguntas"}
                <ArrowRight className={`w-4 h-4 transition-transform ${faqAbierta ? "rotate-90" : ""}`} />
              </button>
            </div>

            <AnimatePresence initial={false}>
              {faqAbierta && (
                <motion.div
                  id="panel-faq"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <Accordion type="single" collapsible className="space-y-2 mt-8">
                    {FAQS.map((faq, i) => (
                      <AccordionItem
                        key={faq.q}
                        value={`faq-${i}`}
                        className="rounded-xl border last:border-b px-2"
                        style={{ backgroundColor: NAVY_CARD, borderColor: BORDER }}
                      >
                        <AccordionTrigger className="text-left text-white font-medium hover:no-underline px-4 py-5">
                          {faq.q}
                        </AccordionTrigger>
                        <AccordionContent className="text-slate-400 pb-5 px-4 leading-relaxed">
                          {faq.a}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </motion.div>
              )}
            </AnimatePresence>
          </FadeIn>

          <FadeIn delay={0.2}>
            <p className="mt-16 text-center text-base italic font-medium" style={{ color: GOLD }}>
              "La mejor inversión no siempre es la que promete más.
              <br />
              Muchas veces es la que mejor se adapta a tu estrategia patrimonial."
            </p>
          </FadeIn>
        </div>
      </section>

      <Footer />
    </div>
  );
}
