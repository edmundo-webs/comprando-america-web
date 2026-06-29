import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { useInView } from "@/hooks/useInView";
import { openWhatsApp, WHATSAPP_PHONE } from "@/lib/whatsapp";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  DollarSign,
  Building2,
  Globe,
  Users,
  TrendingUp,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  MapPin,
  ShieldCheck,
  ClipboardList,
} from "lucide-react";

/* ─── Brand tokens ─── */
const NAVY      = "#0B1F3A";
const NAVY_CARD = "#0F2847";
const NAVY_DARK = "#091A30";
const BORDER    = "#1E3A5F";
const GOLD      = "#C9A84C";
const GOLD_LIGHT = "#E2C06E";

const WA_MSG =
  "Hola, me interesa conocer más sobre las propiedades con Section 8 en Estados Unidos.";

const HERO_BG =
  "https://res.cloudinary.com/dgruohz6f/image/upload/v1773439251/comprando-america/fUiLqaRcYvhafLZf.webp";

/* ─── FadeIn ─── */
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

/* ─── Acento dorado ─── */
function GoldAccent() {
  return <div className="w-12 h-[3px] mb-6 rounded-full" style={{ backgroundColor: GOLD }} />;
}

/* ─── SEO ─── */
const PAGE_SEO = {
  title:
    "Propiedades Section 8 en Estados Unidos | Ingresos en Dólares y Patrimonio | Comprando América",
  description:
    "Descubre cómo invertir en propiedades administradas bajo el programa Section 8 en Estados Unidos. Genera ingresos en dólares, diversifica tu patrimonio y evalúa si esta estrategia tiene sentido para tus objetivos.",
  path: "/vc-8",
  schema: {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "¿Necesito vivir en Estados Unidos para invertir en Section 8?",
        acceptedAnswer: { "@type": "Answer", text: "No." },
      },
      {
        "@type": "Question",
        name: "¿Puedo comprar más de una propiedad con Section 8?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Sí. La estrategia normalmente busca construir un portafolio de propiedades a largo plazo.",
        },
      },
      {
        "@type": "Question",
        name: "¿Qué porcentaje de la renta proviene del gobierno en Section 8?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "En muchos casos se busca trabajar con vouchers que cubran el 100% de la renta. Algunos casos pueden representar aproximadamente el 80%.",
        },
      },
    ],
  },
};

/* ─── Beneficios ─── */
const BENEFITS = [
  { icon: DollarSign, title: "Flujo en dólares",             desc: "Ingresos mensuales provenientes de la renta." },
  { icon: Building2,  title: "Activos reales",               desc: "Posees una propiedad física en Estados Unidos." },
  { icon: TrendingUp, title: "Patrimonio a largo plazo",     desc: "El inmueble puede apreciarse con el tiempo." },
  { icon: Globe,      title: "Diversificación internacional", desc: "No dependes únicamente de un país o un negocio." },
  { icon: Users,      title: "Operación delegada",           desc: "Puedes invertir sin vivir en Estados Unidos." },
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

/* ─── Admin tasks ─── */
const ADMIN_TASKS = [
  "Cobranza de rentas.",
  "Atención al inquilino.",
  "Coordinación de reparaciones.",
  "Supervisión operativa.",
  "Reportes periódicos.",
  "Gestión documental.",
  "Comunicación continua con el propietario.",
];

/* ─── Riesgos ─── */
const RISKS = [
  "Vacancia.",
  "Costos de mantenimiento.",
  "Cambios regulatorios.",
  "Cambios en el programa Section 8.",
  "Condiciones del mercado inmobiliario.",
  "Riesgos operativos propios de cualquier propiedad.",
];

/* ─── Checklist ─── */
const CHECKLIST = [
  "Quiero generar ingresos en dólares.",
  "Quiero diversificar fuera de mi país.",
  "Prefiero activos tangibles.",
  "No quiero administrar personalmente.",
  "Busco construir patrimonio a largo plazo.",
  "Estoy dispuesto a mantener la inversión varios años.",
];

/* ─── FAQ ─── */
const FAQS = [
  { q: "¿Necesito vivir en Estados Unidos?", a: "No." },
  { q: "¿Necesito administrar personalmente la propiedad?", a: "No necesariamente." },
  {
    q: "¿Puedo comprar más de una propiedad?",
    a: "Sí. La estrategia normalmente busca construir un portafolio de propiedades a largo plazo.",
  },
  {
    q: "¿Cuánto dura normalmente un inquilino?",
    a: "Los contratos Section 8 presentan una permanencia promedio aproximada de tres años.",
  },
  {
    q: "¿Qué porcentaje de la renta proviene del gobierno?",
    a: "En muchos casos se busca trabajar con vouchers que cubran el 100% de la renta. Algunos casos pueden representar aproximadamente el 80%.",
  },
  {
    q: "¿Qué reportes recibe el inversionista?",
    a: "Reportes mensuales, información anual fiscal y acceso a plataforma de seguimiento en tiempo real.",
  },
];

/* ══════════════════════════════════════════════════════
   PAGE
══════════════════════════════════════════════════════ */
export default function Section8() {
  const [checked, setChecked] = useState<boolean[]>(Array(CHECKLIST.length).fill(false));
  const checkedCount = checked.filter(Boolean).length;

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
                Propiedades · Programa Section 8
              </p>

              <h1 className="text-3xl md:text-4xl text-white font-bold leading-tight mb-4">
                Construye patrimonio en Estados Unidos a través de{" "}
                <span className="gradient-text-primary">
                  propiedades administradas profesionalmente.
                </span>
              </h1>

              <p className="text-slate-300 text-base leading-relaxed mb-1 max-w-xl">
                Genera ingresos en dólares mediante bienes raíces respaldados por una necesidad básica: vivienda.
              </p>
              <p className="text-slate-400 text-sm leading-relaxed mb-7 max-w-xl">
                Sin necesidad de vivir en Estados Unidos ni administrar personalmente la propiedad.
              </p>

              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={() => document.getElementById("checklist")?.scrollIntoView({ behavior: "smooth" })}
                  className="bg-primary hover:bg-blue-600 text-white px-6 py-5 text-sm gap-2 shadow-lg shadow-blue-600/25"
                >
                  Descubrir si esta estrategia tiene sentido para mí <ArrowRight className="w-4 h-4" />
                </Button>
                <a href="/propiedades">
                  <Button
                    variant="outline"
                    className="border-slate-600 text-white hover:bg-white/10 px-6 py-5 text-sm gap-2"
                  >
                    <Building2 className="w-4 h-4" /> Ver propiedades disponibles
                  </Button>
                </a>
                <Button
                  variant="ghost"
                  onClick={() => openWhatsApp(WHATSAPP_PHONE, WA_MSG)}
                  className="text-slate-400 hover:text-white hover:bg-white/10 px-6 py-5 text-sm"
                >
                  Hablar con un asesor
                </Button>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ══ BANNER — VIAJE A TAMPA ══ */}
      <a href="/investment-week" className="block group">
        <div
          className="relative overflow-hidden"
          style={{ backgroundColor: GOLD }}
        >
          <div className="container py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-xl">✈️</span>
              <div>
                <p className="font-bold text-[#0B1F3A] text-sm leading-tight">
                  Viaja a Tampa y conoce las propiedades en persona.
                </p>
                <p className="text-[#0B1F3A]/70 text-xs">
                  Investment Week · St. Petersburg, Florida
                </p>
              </div>
            </div>
            <span
              className="flex-shrink-0 flex items-center gap-2 bg-[#0B1F3A] text-white text-xs font-semibold px-4 py-2 rounded-full group-hover:bg-[#091A30] transition-colors"
            >
              Ver detalles <ArrowRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </a>

      {/* ══ BLOQUE 2 — ¿QUÉ ES SECTION 8? ══ */}
      <section className="bg-[#F5F7FA] py-20 md:py-28">
        <div className="container max-w-4xl">
          <FadeIn>
            <GoldAccent />
            <h2 className="text-3xl md:text-4xl font-bold mb-10 text-[#0B1F3A]">
              ¿Qué es Section 8?
            </h2>
          </FadeIn>

          <div className="space-y-5">
            {[
              "Imagina que compras una propiedad para rentarla.",
              "Ahora imagina que gran parte de la renta no depende del bolsillo del inquilino, sino de un programa respaldado por el gobierno de Estados Unidos.",
              "Eso es Section 8.",
              "El gobierno ayuda a determinadas familias a cubrir una parte o incluso la totalidad de la renta y realiza el pago directamente al propietario de la vivienda.",
            ].map((text, i) => (
              <FadeIn key={i} delay={i * 0.07}>
                <p className={`text-lg leading-relaxed ${i === 2 ? "font-bold text-[#0B1F3A] text-xl" : "text-slate-700"}`}>
                  {text}
                </p>
              </FadeIn>
            ))}
          </div>

          {/* Visual: Flujo de pago */}
          <FadeIn delay={0.32} className="mt-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { emoji: "🏛️", label: "Gobierno de EE.UU.", sub: "Aprueba el voucher" },
                { emoji: "💵", label: "Pago directo", sub: "Al propietario" },
                { emoji: "🏠", label: "Tu propiedad", sub: "Genera renta mensual" },
              ].map((step, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center text-center p-6 rounded-xl border bg-white shadow-sm"
                  style={{ borderColor: `${GOLD}44` }}
                >
                  <span className="text-4xl mb-3">{step.emoji}</span>
                  <p className="font-semibold text-[#0B1F3A] text-sm">{step.label}</p>
                  <p className="text-slate-500 text-xs mt-1">{step.sub}</p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ══ BLOQUE 3 — ¿POR QUÉ LO CONSIDERAN? ══ */}
      <section className="bg-[#0B1F3A] py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <GoldAccent />
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              ¿Por qué algunos inversionistas consideran esta estrategia?
            </h2>
            <p className="text-slate-400 mb-12 max-w-xl">
              Cinco razones que llevan a los inversionistas a explorar este modelo.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {BENEFITS.map((b, i) => (
              <FadeIn key={i} delay={i * 0.08}>
                <div
                  className="p-8 rounded-xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-default"
                  style={{ backgroundColor: NAVY_CARD, borderColor: BORDER }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = `${GOLD}55`;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = BORDER;
                  }}
                >
                  <div className="w-11 h-11 rounded-lg flex items-center justify-center mb-5" style={{ backgroundColor: `${GOLD}18` }}>
                    <b.icon className="w-5 h-5" style={{ color: GOLD }} />
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-2">{b.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{b.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ══ BLOQUE 4 — MERCADOS ══ */}
      <section className="bg-[#F5F7FA] py-20 md:py-28">
        <div className="container max-w-4xl">
          <FadeIn>
            <GoldAccent />
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#0B1F3A]">
              ¿Dónde se encuentran actualmente las oportunidades?
            </h2>
            <p className="text-slate-500 mb-12 max-w-xl">
              Mercados activos en los que el equipo opera directamente.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {MARKETS.map((m, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="rounded-2xl border bg-white shadow-sm overflow-hidden" style={{ borderColor: `${GOLD}33` }}>
                  <div className="px-7 py-5 border-b flex items-center justify-between" style={{ borderColor: `${GOLD}22`, backgroundColor: `${GOLD}08` }}>
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5" style={{ color: GOLD }} />
                      <div>
                        <p className="font-bold text-[#0B1F3A] text-lg leading-tight">{m.city}</p>
                        <p className="text-slate-500 text-sm">{m.state}</p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold px-3 py-1 rounded-full" style={{ color: GOLD, backgroundColor: `${GOLD}15` }}>
                      {m.price}
                    </span>
                  </div>
                  <ul className="px-7 py-5 space-y-3">
                    {m.highlights.map((h, j) => (
                      <li key={j} className="flex items-start gap-3 text-sm text-slate-600">
                        <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5 text-primary" />
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

      {/* ══ BLOQUE 5 — CÓMO GANA DINERO ══ */}
      <section className="bg-[#091A30] py-20 md:py-28">
        <div className="container max-w-3xl">
          <FadeIn>
            <GoldAccent />
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-white">
              ¿Cómo gana dinero el inversionista?
            </h2>
          </FadeIn>

          <div className="space-y-10">
            {/* Flujo mensual */}
            <FadeIn delay={0.08}>
              <div className="rounded-2xl border p-8" style={{ backgroundColor: NAVY_CARD, borderColor: BORDER }}>
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-3xl font-bold" style={{ color: GOLD }}>01</span>
                  <h3 className="text-xl font-semibold text-white">Flujo mensual</h3>
                </div>
                <p className="text-slate-400 leading-relaxed mb-8">
                  La propiedad genera renta. Después de gastos operativos y administración, el inversionista recibe el flujo neto correspondiente.
                </p>

                <div className="flex items-start gap-4 p-5 rounded-xl border-l-4" style={{ borderColor: GOLD, backgroundColor: `${GOLD}08` }}>
                  <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: GOLD }} />
                  <p className="text-sm text-slate-300 leading-relaxed">
                    El flujo neto depende de cada propiedad, mercado, nivel de ocupación y gastos operativos específicos. Estos números se analizan caso por caso durante el diagnóstico.
                  </p>
                </div>
              </div>
            </FadeIn>

            {/* Crecimiento patrimonial */}
            <FadeIn delay={0.16}>
              <div className="rounded-2xl border p-8" style={{ backgroundColor: NAVY_CARD, borderColor: BORDER }}>
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-3xl font-bold" style={{ color: GOLD }}>02</span>
                  <h3 className="text-xl font-semibold text-white">Crecimiento patrimonial</h3>
                </div>
                <p className="text-slate-400 leading-relaxed">
                  Con el tiempo la propiedad puede aumentar su valor. Sin embargo, la apreciación nunca está garantizada y depende del mercado, la zona y las condiciones económicas de cada momento.
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ══ BLOQUE 6 — ADMINISTRACIÓN ══ */}
      <section className="bg-[#F5F7FA] py-20 md:py-28">
        <div className="container max-w-4xl">
          <FadeIn>
            <GoldAccent />
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[#0B1F3A]">
              ¿Quién administra la propiedad?
            </h2>
            <p className="text-slate-600 text-lg leading-relaxed mb-3 max-w-2xl">
              Uno de los mayores retos para un inversionista internacional es la operación.
            </p>
            <p className="text-slate-600 leading-relaxed mb-12 max-w-2xl">
              Por ello, los inversionistas pueden acceder a empresas especializadas en administración inmobiliaria.
            </p>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="rounded-2xl border bg-white shadow-sm overflow-hidden" style={{ borderColor: `${GOLD}33` }}>
              {/* Header empresa */}
              <div className="px-8 py-6 border-b flex items-center gap-4" style={{ borderColor: `${GOLD}22`, backgroundColor: `${GOLD}07` }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${GOLD}18` }}>
                  <ClipboardList className="w-6 h-6" style={{ color: GOLD }} />
                </div>
                <div>
                  <p className="font-bold text-[#0B1F3A] text-lg">Global Choice Property Management</p>
                  <p className="text-slate-500 text-sm">Costo estimado: 10% del valor anual de la renta</p>
                </div>
              </div>

              {/* Servicios */}
              <div className="px-8 py-6">
                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-5">¿Qué hace el administrador?</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {ADMIN_TASKS.map((task, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm text-slate-700">
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-primary" />
                      {task}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ══ BLOQUE 7 — EXPERIENCIA OPERATIVA ══ */}
      <section className="bg-[#0B1F3A] py-20 md:py-28">
        <div className="container max-w-3xl text-center">
          <FadeIn>
            <div className="flex justify-center mb-6">
              <GoldAccent />
            </div>
            <p className="text-slate-400 text-base mb-2 uppercase tracking-widest text-xs font-semibold font-mono">Experiencia operativa</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-3 text-white">
              No solo hablamos de Section 8.
            </h2>
            <h2 className="text-3xl md:text-4xl font-bold mb-12" style={{ color: GOLD_LIGHT }}>
              Lo operamos.
            </h2>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                { num: "29", label: "Años en el mercado inmobiliario estadounidense" },
                { num: "18", label: "Años administrando propiedades bajo Section 8" },
                { num: "150+", label: "Unidades administradas bajo este modelo" },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="rounded-2xl border p-8 flex flex-col items-center"
                  style={{ backgroundColor: NAVY_CARD, borderColor: BORDER }}
                >
                  <p className="text-5xl font-bold mb-2" style={{ color: GOLD }}>{stat.num}</p>
                  <p className="text-slate-400 text-sm leading-relaxed text-center">{stat.label}</p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ══ BLOQUE 8 — CASO HIPOTÉTICO ══ */}
      <section className="bg-[#F5F7FA] py-20 md:py-28">
        <div className="container max-w-3xl">
          <FadeIn>
            <GoldAccent />
            <h2 className="text-3xl md:text-4xl font-bold mb-10 text-[#0B1F3A]">
              Juan, empresario en Monterrey.
            </h2>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="rounded-2xl border bg-white shadow-sm p-8 md:p-10" style={{ borderColor: `${GOLD}33` }}>
              <div className="space-y-5 text-slate-700 text-lg leading-relaxed">
                <p>Juan construyó una empresa durante veinte años.</p>
                <p>Su patrimonio depende principalmente de su negocio.</p>
                <p>
                  Hoy busca diversificar parte de su capital y generar ingresos en dólares sin involucrarse en la operación diaria.
                </p>
                <p className="font-medium text-[#0B1F3A] border-l-4 pl-5" style={{ borderColor: GOLD }}>
                  Después de evaluar diferentes alternativas decide incorporar propiedades administradas bajo el programa Section 8 como parte de su estrategia patrimonial.
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ══ BLOQUE 9 — CHECKLIST ══ */}
      <section id="checklist" className="bg-[#091A30] py-20 md:py-28">
        <div className="container max-w-2xl">
          <FadeIn>
            <GoldAccent />
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              ¿Esta estrategia podría tener sentido para ti?
            </h2>
            <p className="text-slate-400 mb-10">Selecciona las frases que mejor te describen:</p>
          </FadeIn>

          <div className="space-y-3">
            {CHECKLIST.map((item, i) => (
              <FadeIn key={i} delay={i * 0.06}>
                <button
                  onClick={() => setChecked((prev) => prev.map((v, idx) => (idx === i ? !v : v)))}
                  className="w-full flex items-center gap-4 p-5 rounded-xl border text-left transition-all duration-200"
                  style={{
                    borderColor: checked[i] ? `${GOLD}99` : BORDER,
                    backgroundColor: checked[i] ? `${GOLD}10` : NAVY_CARD,
                  }}
                >
                  <div
                    className="w-5 h-5 flex-shrink-0 border-2 rounded flex items-center justify-center transition-all"
                    style={{
                      borderColor: checked[i] ? GOLD : "#1E3A5F",
                      backgroundColor: checked[i] ? GOLD : "transparent",
                    }}
                  >
                    {checked[i] && (
                      <svg viewBox="0 0 10 8" className="w-3 h-3" fill="none" stroke="#0B1F3A" strokeWidth="2.5">
                        <path d="M1 4l3 3 5-6" />
                      </svg>
                    )}
                  </div>
                  <span className="text-base font-medium transition-colors" style={{ color: checked[i] ? "#E8ECF1" : "#94A3B8" }}>
                    {item}
                  </span>
                </button>
              </FadeIn>
            ))}
          </div>

          <AnimatePresence>
            {checkedCount >= 4 && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 16 }}
                transition={{ duration: 0.4 }}
                className="mt-8 p-6 rounded-xl border"
                style={{ borderColor: `${GOLD}55`, backgroundColor: `${GOLD}0D` }}
              >
                <p className="font-semibold text-lg mb-1" style={{ color: GOLD_LIGHT }}>
                  Esta estrategia podría merecer una evaluación más profunda.
                </p>
                <p className="text-slate-400 text-sm">
                  Agenda un diagnóstico para entender si encaja con tus objetivos patrimoniales.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ══ BLOQUE 10 — RIESGOS ══ */}
      <section className="bg-[#0B1F3A] py-20 md:py-28">
        <div className="container max-w-3xl">
          <FadeIn>
            <GoldAccent />
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              Riesgos que debes conocer
            </h2>
            <p className="text-slate-400 mb-10 max-w-xl leading-relaxed">
              En Comprando América creemos que la transparencia genera confianza. Toda inversión implica riesgos. Entre los principales identificamos:
            </p>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="rounded-2xl border p-8" style={{ backgroundColor: NAVY_CARD, borderColor: BORDER }}>
              <div className="flex items-start gap-3 mb-7 p-4 rounded-xl" style={{ backgroundColor: `${GOLD}0D`, borderLeft: `3px solid ${GOLD}` }}>
                <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: GOLD }} />
                <p className="text-sm text-slate-300 leading-relaxed">
                  La siguiente información es orientativa. Los riesgos reales pueden variar según cada caso, mercado y estructura de inversión.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {RISKS.map((risk, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm text-slate-400">
                    <ShieldCheck className="w-4 h-4 flex-shrink-0 mt-0.5 text-slate-500" />
                    {risk}
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ══ BLOQUE 11 — FAQ ══ */}
      <section className="bg-[#F5F7FA] py-20 md:py-28">
        <div className="container max-w-2xl">
          <FadeIn>
            <GoldAccent />
            <h2 className="text-2xl md:text-3xl font-bold mb-10 text-[#0B1F3A]">
              Preguntas frecuentes
            </h2>
          </FadeIn>

          <FadeIn delay={0.1}>
            <Accordion type="single" collapsible className="space-y-2">
              {FAQS.map((faq, i) => (
                <AccordionItem
                  key={i}
                  value={`faq-${i}`}
                  className="rounded-xl border px-2 bg-white"
                  style={{ borderColor: "#E2E8F0" }}
                >
                  <AccordionTrigger className="text-left text-[#0B1F3A] font-medium hover:no-underline px-4 py-5">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-600 pb-5 px-4 leading-relaxed">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </FadeIn>
        </div>
      </section>

      {/* ══ BLOQUE FINAL — CIERRE ══ */}
      <section className="bg-[#091A30] py-24 md:py-32">
        <div className="container max-w-3xl text-center">
          <FadeIn>
            <p className="text-xs font-semibold tracking-[0.3em] uppercase mb-6 font-mono" style={{ color: GOLD }}>
              Comprando América · 2026
            </p>
            <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-6">
              No se trata de comprar una propiedad.{" "}
              <span className="gradient-text-primary">
                Se trata de entender si este tipo de activo tiene sentido para tu patrimonio.
              </span>
            </h2>
            <p className="text-slate-400 text-lg mb-12 max-w-xl mx-auto leading-relaxed">
              En esta sesión evaluaremos si las propiedades administradas bajo el programa Section 8 forman parte de la ruta correcta para tus objetivos patrimoniales.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Button
                onClick={() => openWhatsApp(WHATSAPP_PHONE, WA_MSG)}
                className="bg-primary hover:bg-blue-600 text-white px-10 py-6 text-base gap-2 shadow-lg shadow-blue-600/25"
              >
                Agendar Diagnóstico Estratégico <ArrowRight className="w-4 h-4" />
              </Button>
            </div>

            <p className="mt-16 text-base italic font-medium" style={{ color: GOLD }}>
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
