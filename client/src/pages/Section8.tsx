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
  ChevronRight,
} from "lucide-react";

/* ─── Brand tokens — idénticos al resto del sitio ─── */
const NAVY      = "#0B1F3A";
const NAVY_CARD = "#0F2847";
const NAVY_DARK = "#091A30";
const BORDER    = "#1E3A5F";
const GOLD      = "#C9A84C";
const GOLD_LIGHT = "#E2C06E";

const WA_MSG =
  "Hola, me interesa conocer más sobre las propiedades con Section 8.";

const HERO_BG =
  "https://res.cloudinary.com/dgruohz6f/image/upload/v1773439251/comprando-america/fUiLqaRcYvhafLZf.webp";

/* ─── FadeIn — mismo patrón que BienesRaices / ClubInversion ─── */
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

/* ─── SEO ─── */
const PAGE_SEO = {
  title:
    "Propiedades Section 8 en Estados Unidos | Inversión Inmobiliaria | Comprando América",
  description:
    "Genera ingresos en dólares a través de bienes raíces administrados bajo el programa Section 8 en Estados Unidos. Estrategia patrimonial para inversionistas.",
  path: "/vc-8",
  schema: {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "¿Necesito vivir en Estados Unidos para invertir en Section 8?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. Puedes adquirir y operar propiedades sin necesidad de residir allí.",
        },
      },
      {
        "@type": "Question",
        name: "¿Necesito administrar personalmente la propiedad?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No necesariamente. La administración puede delegarse a operadores especializados.",
        },
      },
      {
        "@type": "Question",
        name: "¿Puedo perder dinero invirtiendo en Section 8?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Sí. Toda inversión implica riesgos que deben evaluarse de acuerdo con los objetivos y situación patrimonial de cada inversionista.",
        },
      },
    ],
  },
};

/* ─── Beneficios ─── */
const BENEFITS = [
  {
    icon: DollarSign,
    title: "Flujo en dólares",
    desc: "Ingresos mensuales provenientes de la renta.",
  },
  {
    icon: Building2,
    title: "Activos tangibles",
    desc: "Inviertes en bienes raíces físicos.",
  },
  {
    icon: Globe,
    title: "Diversificación internacional",
    desc: "Construyes patrimonio fuera de tu país de origen.",
  },
  {
    icon: Users,
    title: "Administración profesional",
    desc: "Gran parte de la operación puede ser delegada.",
  },
  {
    icon: TrendingUp,
    title: "Patrimonio a largo plazo",
    desc: "Posibilidad de apreciación del activo con el tiempo.",
  },
];

/* ─── Checklist ─── */
const CHECKLIST = [
  "Quiero ingresos en dólares.",
  "Quiero diversificar mi patrimonio.",
  "Busco activos tangibles.",
  "No quiero depender únicamente de mi negocio.",
  "Estoy dispuesto a invertir a largo plazo.",
  "Quiero delegar gran parte de la operación.",
];

/* ─── Ficha técnica ─── */
const FICHA = [
  { label: "Ticket estimado",                 value: "Desde USD $100,000" },
  { label: "Horizonte sugerido",              value: "5 años o más" },
  { label: "Participación",                   value: "Semi-pasiva" },
  { label: "Flujo",                           value: "Mensual" },
  { label: "Activo",                          value: "Bienes raíces residenciales" },
  { label: "Liquidez",                        value: "Media - Baja" },
  { label: "Nivel de riesgo",                 value: "Moderado" },
  { label: "Administración",                  value: "Profesional" },
  { label: "Compatible con estrategia migratoria", value: "Dependerá de cada caso" },
];

/* ─── FAQ ─── */
const FAQS = [
  {
    q: "¿Necesito vivir en Estados Unidos?",
    a: "No.",
  },
  {
    q: "¿Necesito administrar personalmente la propiedad?",
    a: "No necesariamente. La administración puede delegarse a operadores especializados.",
  },
  {
    q: "¿Cuándo empiezo a recibir ingresos?",
    a: "Dependerá de la ocupación de la propiedad, la operación y otros factores específicos de cada activo.",
  },
  {
    q: "¿Puedo perder dinero?",
    a: "Sí. Toda inversión implica riesgos.",
  },
  {
    q: "¿Necesito una empresa en Estados Unidos?",
    a: "Dependerá de la estrategia patrimonial y estructura recomendada para cada inversionista.",
  },
];

/* ══════════════════════════════════════════════════════
   PAGE
══════════════════════════════════════════════════════ */
export default function Section8() {
  const [checked, setChecked] = useState<boolean[]>(
    Array(CHECKLIST.length).fill(false)
  );
  const checkedCount = checked.filter(Boolean).length;

  function toggleCheck(i: number) {
    setChecked((prev) => prev.map((v, idx) => (idx === i ? !v : v)));
  }

  return (
    <div className="min-h-screen bg-[#0B1F3A] text-white overflow-x-hidden">
      <SEOHead {...PAGE_SEO} />
      <Navbar />

      {/* ══ 1. HERO ══ */}
      <section className="relative min-h-[88vh] flex items-center pt-20 pb-24 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={HERO_BG}
            alt="Propiedad Section 8 en Estados Unidos"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B1F3A]/95 via-[#0B1F3A]/85 to-[#0B1F3A]/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F3A] via-transparent to-[#0B1F3A]/30" />
        </div>

        <div className="container relative z-10">
          <FadeIn>
            <div className="max-w-3xl">
              {/* eyebrow igual al resto del sitio */}
              <p className="text-sm font-semibold tracking-[0.25em] uppercase mb-6 font-mono"
                 style={{ color: GOLD }}>
                Propiedades · Programa Section 8
              </p>

              <h1 className="text-4xl md:text-5xl lg:text-6xl text-white leading-tight mb-6 font-bold">
                Genera ingresos en dólares a través de{" "}
                <span className="gradient-text-primary">
                  bienes raíces en Estados Unidos.
                </span>
              </h1>

              <p className="text-slate-400 text-lg md:text-xl leading-relaxed mb-10 max-w-2xl">
                Una estrategia patrimonial utilizada por inversionistas que
                buscan flujo, activos tangibles y diversificación internacional.
              </p>

              <div className="flex flex-wrap gap-4 mb-10">
                <Button
                  onClick={() => {
                    document.getElementById("checklist")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="bg-primary hover:bg-blue-600 text-white px-8 py-6 text-base gap-2 shadow-lg shadow-blue-600/25"
                >
                  Evaluar mi perfil <ArrowRight className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => openWhatsApp(WHATSAPP_PHONE, WA_MSG)}
                  className="border-slate-600 text-white hover:bg-white/10 px-8 py-6 text-base"
                >
                  Hablar con un asesor
                </Button>
              </div>

              <p className="text-slate-500 text-sm italic">
                Descubre si esta estrategia tiene sentido para ti.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ══ 2. EXPLÍCAMELO FÁCIL — sección clara (igual que otras páginas) ══ */}
      <section className="bg-[#F5F7FA] py-20 md:py-28">
        <div className="container max-w-4xl">
          <FadeIn>
            {/* acento dorado sutil — marca Section 8 sin romper el sitio */}
            <div className="w-12 h-[3px] mb-6 rounded-full" style={{ backgroundColor: GOLD }} />
            <h2 className="text-3xl md:text-4xl font-bold mb-10 text-[#0B1F3A]">
              ¿Qué es una propiedad con Section 8?
            </h2>
          </FadeIn>

          <div className="space-y-5">
            {[
              "Imagina que compras una propiedad en Estados Unidos para rentarla.",
              "En muchos casos, el gobierno ayuda a determinadas familias a cubrir una parte o la totalidad de la renta.",
              "Esto significa que, siempre que la propiedad cumpla los requisitos del programa y exista un inquilino aprobado, el propietario puede recibir pagos respaldados por el gobierno.",
              "Por esta razón, muchos inversionistas consideran esta estrategia cuando buscan generar ingresos en dólares mediante bienes raíces.",
            ].map((text, i) => (
              <FadeIn key={i} delay={i * 0.08}>
                <p className="text-lg text-slate-700 leading-relaxed">{text}</p>
              </FadeIn>
            ))}
          </div>

          {/* Flujo visual */}
          <FadeIn delay={0.3} className="mt-16">
            <div className="flex flex-wrap items-center justify-center gap-2 md:gap-0">
              {[
                { emoji: "🏠", label: "Propiedad" },
                { emoji: "👨‍👩‍👧", label: "Inquilino" },
                { emoji: "🏛️", label: "Gobierno" },
                { emoji: "💵", label: "Flujo mensual" },
              ].map((step, i, arr) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="flex flex-col items-center">
                    <div
                      className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center text-2xl md:text-3xl border-2 bg-white shadow-sm"
                      style={{ borderColor: GOLD }}
                    >
                      {step.emoji}
                    </div>
                    <p className="mt-2 text-xs md:text-sm font-semibold text-slate-600 text-center">
                      {step.label}
                    </p>
                  </div>
                  {i < arr.length - 1 && (
                    <ChevronRight
                      className="w-5 h-5 flex-shrink-0 -mt-5"
                      style={{ color: GOLD }}
                    />
                  )}
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ══ 3. ¿POR QUÉ LO CONSIDERAN? — navy ══ */}
      <section className="bg-[#0B1F3A] py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="w-12 h-[3px] mb-6 rounded-full" style={{ backgroundColor: GOLD }} />
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              ¿Por qué algunos inversionistas la consideran?
            </h2>
            <p className="text-slate-400 mb-12 max-w-xl">
              Cinco razones que llevan a los inversionistas a explorar esta estrategia.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {BENEFITS.map((b, i) => (
              <FadeIn key={i} delay={i * 0.08}>
                <div
                  className="group p-8 rounded-xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                  style={{
                    backgroundColor: NAVY_CARD,
                    borderColor: BORDER,
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = `${GOLD}55`;
                    (e.currentTarget as HTMLDivElement).style.boxShadow = `0 16px 40px rgba(11,31,58,0.6)`;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = BORDER;
                    (e.currentTarget as HTMLDivElement).style.boxShadow = "";
                  }}
                >
                  <div
                    className="w-11 h-11 rounded-lg flex items-center justify-center mb-5"
                    style={{ backgroundColor: `${GOLD}18` }}
                  >
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

      {/* ══ 4. CÓMO GANA DINERO — claro ══ */}
      <section className="bg-[#F5F7FA] py-20 md:py-28">
        <div className="container max-w-3xl">
          <FadeIn>
            <div className="w-12 h-[3px] mb-6 rounded-full" style={{ backgroundColor: GOLD }} />
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-[#0B1F3A]">
              ¿Cómo gana dinero el inversionista?
            </h2>
          </FadeIn>

          <div className="space-y-10">
            {[
              {
                num: "01",
                title: "Flujo mensual",
                body: "La propiedad genera renta. Después de cubrir gastos operativos, el inversionista recibe el flujo neto correspondiente.",
              },
              {
                num: "02",
                title: "Crecimiento patrimonial",
                body: "Con el tiempo la propiedad puede incrementar su valor. Sin embargo, la apreciación nunca está garantizada.",
              },
            ].map((item, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="flex gap-8 items-start">
                  <span
                    className="text-4xl font-bold flex-shrink-0 leading-none"
                    style={{ color: GOLD }}
                  >
                    {item.num}
                  </span>
                  <div>
                    <h3 className="text-xl font-semibold text-[#0B1F3A] mb-2">{item.title}</h3>
                    <p className="text-slate-600 leading-relaxed">{item.body}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={0.25} className="mt-14">
            <div
              className="flex items-start gap-3 p-5 rounded-lg border-l-4 bg-amber-50"
              style={{ borderColor: GOLD }}
            >
              <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: GOLD }} />
              <p className="text-sm text-slate-600 leading-relaxed">
                Ninguna inversión está libre de riesgos.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ══ 5. CHECKLIST — navy oscuro ══ */}
      <section id="checklist" className="py-20 md:py-28" style={{ backgroundColor: NAVY_DARK }}>
        <div className="container max-w-2xl">
          <FadeIn>
            <div className="w-12 h-[3px] mb-6 rounded-full" style={{ backgroundColor: GOLD }} />
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              ¿Esta estrategia podría tener sentido para ti?
            </h2>
            <p className="text-slate-400 mb-10">
              Selecciona las que te describen:
            </p>
          </FadeIn>

          <div className="space-y-3">
            {CHECKLIST.map((item, i) => (
              <FadeIn key={i} delay={i * 0.06}>
                <button
                  onClick={() => toggleCheck(i)}
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
                  <span
                    className="text-base font-medium transition-colors"
                    style={{ color: checked[i] ? "#E8ECF1" : "#94A3B8" }}
                  >
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
                  Esta estrategia podría valer la pena explorar.
                </p>
                <p className="text-slate-400 text-sm">
                  Agenda un diagnóstico para entender si encaja con tus objetivos.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ══ 6. FICHA TÉCNICA — navy ══ */}
      <section className="bg-[#0B1F3A] py-20 md:py-28">
        <div className="container max-w-3xl">
          <FadeIn>
            <div className="w-12 h-[3px] mb-6 rounded-full" style={{ backgroundColor: GOLD }} />
            <h2 className="text-3xl md:text-4xl font-bold mb-10 text-white">
              Ficha técnica
            </h2>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="rounded-2xl border overflow-hidden" style={{ borderColor: BORDER }}>
              {FICHA.map((row, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between px-6 py-4 text-sm"
                  style={{
                    borderBottom: i < FICHA.length - 1 ? `1px solid ${BORDER}` : "none",
                    backgroundColor: i % 2 === 0 ? NAVY_CARD : `${NAVY_CARD}88`,
                  }}
                >
                  <span className="text-slate-400 font-medium">{row.label}</span>
                  <span className="text-white font-semibold text-right">{row.value}</span>
                </div>
              ))}
            </div>

            <p className="mt-8 text-xs text-slate-500 leading-relaxed border-l-2 pl-4" style={{ borderColor: GOLD }}>
              Toda inversión implica riesgos y debe evaluarse de acuerdo con los objetivos,
              horizonte y situación patrimonial de cada inversionista.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ══ CIERRE — navy oscuro ══ */}
      <section className="py-24 md:py-32" style={{ backgroundColor: NAVY_DARK }}>
        <div className="container max-w-3xl text-center">
          <FadeIn>
            <p
              className="text-xs font-semibold tracking-[0.25em] uppercase mb-6 font-mono"
              style={{ color: GOLD }}
            >
              Comprando América · 2026
            </p>
            <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-6">
              No se trata de comprar una propiedad.{" "}
              <span className="gradient-text-primary">
                Se trata de entender si este tipo de activo tiene sentido para tus objetivos.
              </span>
            </h2>
            <p className="text-slate-400 text-lg mb-12 max-w-xl mx-auto leading-relaxed">
              En esta sesión evaluaremos si las propiedades administradas bajo el programa
              Section 8 forman parte de la ruta adecuada para tu patrimonio.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Button
                onClick={() => openWhatsApp(WHATSAPP_PHONE, WA_MSG)}
                className="bg-primary hover:bg-blue-600 text-white px-10 py-6 text-base gap-2 shadow-lg shadow-blue-600/25"
              >
                Agendar Diagnóstico Estratégico <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ══ FAQ — claro ══ */}
      <section className="bg-[#F5F7FA] py-20 md:py-28">
        <div className="container max-w-2xl">
          <FadeIn>
            <div className="w-12 h-[3px] mb-6 rounded-full" style={{ backgroundColor: GOLD }} />
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
                  className="rounded-xl border px-2"
                  style={{ borderColor: "#E2E8F0", backgroundColor: "white" }}
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

          <FadeIn delay={0.2} className="mt-16 text-center">
            <blockquote
              className="text-base md:text-lg italic font-medium leading-relaxed"
              style={{ color: GOLD }}
            >
              "La mejor inversión no siempre es la que promete más.
              <br />
              Muchas veces es la que mejor se adapta a tu estrategia patrimonial."
            </blockquote>
          </FadeIn>
        </div>
      </section>

      <Footer />
    </div>
  );
}
