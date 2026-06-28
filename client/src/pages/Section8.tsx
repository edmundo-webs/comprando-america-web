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
  CheckCircle2,
  ArrowRight,
  AlertTriangle,
  ChevronRight,
} from "lucide-react";

/* ─── constants ─── */
const GOLD = "#C9A84C";
const DARK = "#0B0B0B";
const WA_MSG = "Hola, me interesa conocer más sobre las propiedades con Section 8.";

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
      initial={{ opacity: 0, y: 28 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── GoldLine ─── */
function GoldLine() {
  return (
    <div
      className="w-16 h-[2px] mb-8"
      style={{ backgroundColor: GOLD }}
    />
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
          text: "No. Puedes adquirir y operar propiedades en Estados Unidos sin necesidad de residir allí.",
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

/* ─── Benefit cards ─── */
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

/* ─── Checklist items ─── */
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
  { label: "Ticket estimado", value: "Desde USD $100,000" },
  { label: "Horizonte sugerido", value: "5 años o más" },
  { label: "Participación", value: "Semi-pasiva" },
  { label: "Flujo", value: "Mensual" },
  { label: "Activo", value: "Bienes raíces residenciales" },
  { label: "Liquidez", value: "Media - Baja" },
  { label: "Nivel de riesgo", value: "Moderado" },
  { label: "Administración", value: "Profesional" },
  {
    label: "Compatible con estrategia migratoria",
    value: "Dependerá de cada caso",
  },
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
    <div
      className="min-h-screen text-white overflow-x-hidden"
      style={{ backgroundColor: DARK }}
    >
      <SEOHead {...PAGE_SEO} />
      <Navbar />

      {/* ══ 1. HERO ══ */}
      <section className="relative min-h-[90vh] flex items-center pt-20 pb-24 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={HERO_BG}
            alt="Propiedad Section 8 en Estados Unidos"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/85 to-black/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30" />
        </div>

        {/* top gold accent */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px]"
          style={{ backgroundColor: GOLD, opacity: 0.7 }}
        />

        <div className="container relative z-10">
          <FadeIn>
            <div className="max-w-3xl">
              <p
                className="text-xs font-semibold tracking-[0.3em] uppercase mb-6 font-mono"
                style={{ color: GOLD }}
              >
                Propiedades administradas bajo el programa Section 8
              </p>

              <h1 className="text-4xl md:text-5xl lg:text-6xl text-white leading-[1.1] font-bold mb-6">
                Genera ingresos en dólares a través de{" "}
                <span style={{ color: GOLD }}>
                  bienes raíces en Estados Unidos.
                </span>
              </h1>

              <p className="text-slate-300 text-lg md:text-xl leading-relaxed mb-10 max-w-2xl">
                Una estrategia patrimonial utilizada por inversionistas que
                buscan flujo, activos tangibles y diversificación internacional.
              </p>

              <div className="flex flex-wrap gap-4 mb-12">
                <Button
                  onClick={() => {
                    const el = document.getElementById("checklist");
                    el?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="text-black font-semibold px-8 py-6 text-base gap-2 rounded-none"
                  style={{ backgroundColor: GOLD }}
                >
                  Evaluar mi perfil <ArrowRight className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => openWhatsApp(WHATSAPP_PHONE, WA_MSG)}
                  className="border-white/30 text-white hover:bg-white/10 px-8 py-6 text-base rounded-none"
                >
                  Hablar con un asesor
                </Button>
              </div>

              <p
                className="text-sm italic"
                style={{ color: GOLD, opacity: 0.75 }}
              >
                Descubre si esta estrategia tiene sentido para ti.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ══ 2. EXPLÍCAMELO FÁCIL — BLANCO ══ */}
      <section className="bg-white py-20 md:py-28 text-black">
        <div className="container max-w-4xl">
          <FadeIn>
            <GoldLine />
            <h2 className="text-3xl md:text-4xl font-bold mb-10 text-black">
              ¿Qué es una propiedad con Section 8?
            </h2>
          </FadeIn>

          <FadeIn delay={0.1}>
            <p className="text-lg text-slate-700 leading-relaxed mb-6">
              Imagina que compras una propiedad en Estados Unidos para rentarla.
            </p>
            <p className="text-lg text-slate-700 leading-relaxed mb-6">
              En muchos casos, el gobierno ayuda a determinadas familias a
              cubrir una parte o la totalidad de la renta.
            </p>
            <p className="text-lg text-slate-700 leading-relaxed mb-6">
              Esto significa que, siempre que la propiedad cumpla los requisitos
              del programa y exista un inquilino aprobado, el propietario puede
              recibir pagos respaldados por el gobierno.
            </p>
            <p className="text-lg text-slate-700 leading-relaxed">
              Por esta razón, muchos inversionistas consideran esta estrategia
              cuando buscan generar ingresos en dólares mediante bienes raíces.
            </p>
          </FadeIn>

          {/* Flow animation */}
          <FadeIn delay={0.2} className="mt-16">
            <div className="flex flex-wrap items-center justify-center gap-3 md:gap-0">
              {[
                { label: "Propiedad", icon: "🏠" },
                { label: "Inquilino", icon: "👨‍👩‍👧" },
                { label: "Gobierno", icon: "🏛️" },
                { label: "Flujo mensual", icon: "💵" },
              ].map((step, i, arr) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="flex flex-col items-center">
                    <div
                      className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center text-2xl md:text-3xl border-2"
                      style={{ borderColor: GOLD, backgroundColor: "#f9f6ef" }}
                    >
                      {step.icon}
                    </div>
                    <p className="mt-2 text-xs md:text-sm font-semibold text-slate-700 text-center">
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

      {/* ══ 3. ¿POR QUÉ ALGUNOS LO CONSIDERAN? — NEGRO ══ */}
      <section className="py-20 md:py-28" style={{ backgroundColor: DARK }}>
        <div className="container">
          <FadeIn>
            <GoldLine />
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              ¿Por qué algunos inversionistas la consideran?
            </h2>
            <p className="text-slate-400 mb-14 max-w-xl">
              Cinco razones que llevan a los inversionistas a explorar esta estrategia.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {BENEFITS.map((b, i) => (
              <FadeIn key={i} delay={i * 0.08}>
                <div
                  className="group border p-8 cursor-default transition-all duration-300 hover:-translate-y-1"
                  style={{
                    borderColor: "rgba(201,168,76,0.25)",
                    backgroundColor: "rgba(255,255,255,0.03)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.borderColor =
                      "rgba(201,168,76,0.7)";
                    (e.currentTarget as HTMLDivElement).style.boxShadow =
                      `0 0 24px rgba(201,168,76,0.12)`;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.borderColor =
                      "rgba(201,168,76,0.25)";
                    (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
                  }}
                >
                  <b.icon
                    className="w-7 h-7 mb-5"
                    style={{ color: GOLD }}
                  />
                  <h3 className="text-white font-semibold text-lg mb-2">
                    {b.title}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    {b.desc}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 4. ¿CÓMO GANA DINERO? — BLANCO ══ */}
      <section className="bg-white py-20 md:py-28 text-black">
        <div className="container max-w-3xl">
          <FadeIn>
            <GoldLine />
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-black">
              ¿Cómo gana dinero el inversionista?
            </h2>
          </FadeIn>

          <div className="space-y-8">
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
                    <h3 className="text-xl font-semibold text-black mb-2">
                      {item.title}
                    </h3>
                    <p className="text-slate-600 leading-relaxed">{item.body}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={0.25} className="mt-14">
            <div className="flex items-start gap-3 p-5 border-l-2" style={{ borderColor: GOLD }}>
              <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: GOLD }} />
              <p className="text-sm text-slate-600 leading-relaxed">
                Ninguna inversión está libre de riesgos.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ══ 5. CHECKLIST — NEGRO ══ */}
      <section
        id="checklist"
        className="py-20 md:py-28"
        style={{ backgroundColor: DARK }}
      >
        <div className="container max-w-2xl">
          <FadeIn>
            <GoldLine />
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              ¿Esta estrategia podría tener sentido para ti?
            </h2>
            <p className="text-slate-400 mb-10">
              Selecciona las que te describen:
            </p>
          </FadeIn>

          <div className="space-y-4">
            {CHECKLIST.map((item, i) => (
              <FadeIn key={i} delay={i * 0.06}>
                <button
                  onClick={() => toggleCheck(i)}
                  className="w-full flex items-center gap-4 p-5 border text-left transition-all duration-200"
                  style={{
                    borderColor: checked[i]
                      ? "rgba(201,168,76,0.8)"
                      : "rgba(255,255,255,0.1)",
                    backgroundColor: checked[i]
                      ? "rgba(201,168,76,0.08)"
                      : "rgba(255,255,255,0.02)",
                  }}
                >
                  <div
                    className="w-5 h-5 flex-shrink-0 border-2 rounded-sm flex items-center justify-center transition-all"
                    style={{
                      borderColor: checked[i] ? GOLD : "rgba(255,255,255,0.3)",
                      backgroundColor: checked[i]
                        ? GOLD
                        : "transparent",
                    }}
                  >
                    {checked[i] && (
                      <svg
                        viewBox="0 0 10 8"
                        className="w-3 h-3"
                        fill="none"
                        stroke="black"
                        strokeWidth="2"
                      >
                        <path d="M1 4l3 3 5-6" />
                      </svg>
                    )}
                  </div>
                  <span
                    className="text-base font-medium transition-colors"
                    style={{ color: checked[i] ? "#fff" : "rgb(148,163,184)" }}
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
                className="mt-10 p-6 border"
                style={{ borderColor: GOLD, backgroundColor: "rgba(201,168,76,0.07)" }}
              >
                <p className="text-white font-semibold text-lg mb-1" style={{ color: GOLD }}>
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

      {/* ══ 6. FICHA TÉCNICA — BLANCO ══ */}
      <section className="bg-white py-20 md:py-28 text-black">
        <div className="container max-w-3xl">
          <FadeIn>
            <GoldLine />
            <h2 className="text-3xl md:text-4xl font-bold mb-10 text-black">
              Ficha técnica
            </h2>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="border" style={{ borderColor: "rgba(201,168,76,0.3)" }}>
              {FICHA.map((row, i) => (
                <div
                  key={i}
                  className="flex items-start justify-between p-5 text-sm"
                  style={{
                    borderBottom:
                      i < FICHA.length - 1
                        ? "1px solid rgba(201,168,76,0.15)"
                        : "none",
                    backgroundColor: i % 2 === 0 ? "transparent" : "rgba(201,168,76,0.03)",
                  }}
                >
                  <span className="text-slate-500 font-medium w-1/2">
                    {row.label}
                  </span>
                  <span className="text-black font-semibold text-right w-1/2">
                    {row.value}
                  </span>
                </div>
              ))}
            </div>

            <p className="mt-8 text-xs text-slate-500 leading-relaxed border-l-2 pl-4" style={{ borderColor: GOLD }}>
              Toda inversión implica riesgos y debe evaluarse de acuerdo con los
              objetivos, horizonte y situación patrimonial de cada inversionista.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ══ CIERRE — NEGRO ══ */}
      <section className="py-24 md:py-32" style={{ backgroundColor: DARK }}>
        <div className="container max-w-3xl text-center">
          <FadeIn>
            <p
              className="text-xs font-semibold tracking-[0.3em] uppercase mb-6 font-mono"
              style={{ color: GOLD }}
            >
              Comprando América · 2026
            </p>
            <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-6">
              No se trata de comprar una propiedad.
              <br />
              <span style={{ color: GOLD }}>
                Se trata de entender si este tipo de activo tiene sentido para
                tus objetivos.
              </span>
            </h2>
            <p className="text-slate-400 text-lg mb-12 max-w-xl mx-auto">
              En esta sesión evaluaremos si las propiedades administradas bajo el
              programa Section 8 forman parte de la ruta adecuada para tu
              patrimonio.
            </p>

            <Button
              onClick={() => openWhatsApp(WHATSAPP_PHONE, WA_MSG)}
              className="text-black font-semibold px-10 py-7 text-base gap-2 rounded-none mx-auto"
              style={{ backgroundColor: GOLD }}
            >
              Agendar Diagnóstico Estratégico <ArrowRight className="w-4 h-4" />
            </Button>
          </FadeIn>
        </div>
      </section>

      {/* ══ FAQ — BLANCO ══ */}
      <section className="bg-white py-20 md:py-28 text-black">
        <div className="container max-w-2xl">
          <FadeIn>
            <GoldLine />
            <h2 className="text-2xl md:text-3xl font-bold mb-10 text-black">
              Preguntas frecuentes
            </h2>
          </FadeIn>

          <FadeIn delay={0.1}>
            <Accordion type="single" collapsible className="space-y-2">
              {FAQS.map((faq, i) => (
                <AccordionItem
                  key={i}
                  value={`faq-${i}`}
                  className="border-b"
                  style={{ borderColor: "rgba(201,168,76,0.2)" }}
                >
                  <AccordionTrigger className="text-left text-black font-medium hover:no-underline py-5">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-600 pb-5 leading-relaxed">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </FadeIn>

          <FadeIn delay={0.2} className="mt-16 text-center">
            <p
              className="text-base italic font-medium"
              style={{ color: GOLD }}
            >
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
