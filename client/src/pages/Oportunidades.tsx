import { useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useInView } from "@/hooks/useInView";
import { openWhatsApp, WHATSAPP_PHONE } from "@/lib/whatsapp";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ArrowRight,
  ShieldCheck,
  Lock,
  Users,
  TrendingUp,
  Building2,
  CheckCircle2,
  XCircle,
  Calendar,
  Eye,
  MessageSquare,
  Star,
  Filter,
  Globe,
  Zap,
} from "lucide-react";
import SEOHead from "@/components/SEOHead";

/* ─── Brand ─── */
const GOLD = "#C9A84C";
const GOLD_LIGHT = "#E2C06E";
const NAVY = "#0B1F3A";
const NAVY_MID = "#0E2544";
const NAVY_DEEP = "#091A30";
const NAVY_CARD = "#112240";
const NAVY_BORDER = "#1E3A5F";

/* ─── SEO ─── */
const PAGE_SEO = {
  title: "Oportunidades de Inversión en Estados Unidos | Comprando América",
  description: "Accede a oportunidades de inversión filtradas y evaluadas en Estados Unidos. Inversión desde $100,000 USD con estructura profesional.",
  path: "/oportunidades-de-inversion-en-estados-unidos",
  schema: {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "¿Qué tipo de oportunidades ofrece Comprando América?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Bienes raíces, adquisición de negocios, franquicias y rutas migratorias con visa E-2. Cada oportunidad es filtrada con soporte legal y financiero.",
        },
      },
      {
        "@type": "Question",
        name: "¿Cuánto necesito para invertir?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Desde $100,000 USD para protección patrimonial. Desde $150,000 USD para ruta migratoria con visa E-2.",
        },
      },
    ],
  },
};

/* ─── Photos ─── */
const HERO_IMAGE = "https://lh3.googleusercontent.com/d/1uOK0Jci_KGtDiBIInQTZ846vel77scKF=w1920";
const VOTING_IMAGE = "https://lh3.googleusercontent.com/d/1WzKjPerMTX-RlLsJWxLegBkpn4_Ademp=w1920";
const PANEL_IMAGE = "https://lh3.googleusercontent.com/d/12leYCR8tlXXxZ6jeBlgthhmUqcyEmtoz=w1920";

/* ─── FadeIn ─── */
function FadeIn({
  children,
  className = "",
  delay = 0,
  direction = "up",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "left" | "right" | "none";
}) {
  const { ref, isInView } = useInView();
  const initial =
    direction === "up"
      ? { opacity: 0, y: 40 }
      : direction === "left"
      ? { opacity: 0, x: -40 }
      : direction === "right"
      ? { opacity: 0, x: 40 }
      : { opacity: 0 };
  const animate = isInView ? { opacity: 1, y: 0, x: 0 } : {};
  return (
    <motion.div
      ref={ref}
      initial={initial}
      animate={animate}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── Counter ─── */
function Counter({ value, suffix = "", prefix = "" }: { value: number; suffix?: string; prefix?: string }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v));
  const { ref, isInView } = useInView();
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (isInView && !hasAnimated.current) {
      hasAnimated.current = true;
      animate(count, value, { duration: 2, ease: "easeOut" });
    }
  }, [isInView, value, count]);

  return (
    <span ref={ref}>
      {prefix}
      <motion.span>{rounded}</motion.span>
      {suffix}
    </span>
  );
}

/* ─── Gold divider ─── */
function GoldDivider() {
  return (
    <div className="flex items-center justify-center gap-3 my-6">
      <div className="h-px w-16 bg-gradient-to-r from-transparent to-amber-500/60" />
      <div className="w-1.5 h-1.5 rounded-full bg-amber-500/80" />
      <div className="h-px w-16 bg-gradient-to-l from-transparent to-amber-500/60" />
    </div>
  );
}

/* ─── Section label ─── */
function SectionLabel({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <p
      className={`text-xs font-bold tracking-[0.3em] uppercase mb-4 font-mono ${
        light ? "text-amber-400" : "text-amber-600"
      }`}
    >
      {children}
    </p>
  );
}

export default function Oportunidades() {
  const scrollToFilter = () => {
    document.getElementById("filtro")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-[#0B1F3A] text-white overflow-x-hidden">
      <SEOHead {...PAGE_SEO} />
      <Navbar />

      {/* ═══════════════════════════════════════════════
          1. HERO
      ═══════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <img
            src={HERO_IMAGE}
            alt="Presentación de oportunidades de inversión"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#091A30]/98 via-[#0B1F3A]/90 to-[#0B1F3A]/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F3A] via-transparent to-transparent" />
        </div>

        {/* Gold accent lines */}
        <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-amber-500/30 to-transparent" />

        <div className="container relative z-10">
          <div className="max-w-3xl">
            <FadeIn delay={0.1}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-amber-500/30 bg-amber-500/10 mb-8">
                <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span className="text-amber-400 text-xs font-bold tracking-[0.2em] uppercase font-mono">
                  Acceso Privado · Solo para Inversionistas Calificados
                </span>
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.1] mb-6">
                Oportunidades de inversión en{" "}
                <span
                  className="italic"
                  style={{
                    background: `linear-gradient(135deg, ${GOLD_LIGHT}, ${GOLD})`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Estados Unidos
                </span>{" "}
                que no están en el mercado abierto
              </h1>
            </FadeIn>

            <FadeIn delay={0.3}>
              <p className="text-slate-300 text-lg md:text-xl leading-relaxed mb-10 max-w-2xl">
                Comprando América conecta empresarios e inversionistas con oportunidades previamente
                evaluadas, presentadas en espacios privados con soporte legal y financiero.
              </p>
            </FadeIn>

            <FadeIn delay={0.4}>
              <div className="flex flex-wrap gap-4 mb-12">
                <Button
                  onClick={scrollToFilter}
                  className="group px-8 py-6 text-base gap-2 font-semibold text-white rounded-full shadow-xl"
                  style={{
                    background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`,
                    boxShadow: `0 0 40px ${GOLD}40`,
                  }}
                >
                  Ver oportunidades disponibles
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() =>
                    openWhatsApp(WHATSAPP_PHONE, "Hola, quiero conocer las oportunidades de inversión.")
                  }
                  className="px-8 py-6 text-base border-white/20 text-white hover:bg-white/10 rounded-full gap-2"
                >
                  <MessageSquare className="w-4 h-4" /> Hablar con un asesor
                </Button>
              </div>
            </FadeIn>

            <FadeIn delay={0.5}>
              <div className="flex flex-wrap gap-6 text-slate-400 text-sm">
                <span className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-400" /> Oportunidades filtradas
                </span>
                <span className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-amber-400" /> Acceso privado
                </span>
                <span className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-amber-400" /> Solo 20% de lo evaluado llega a la comunidad
                </span>
              </div>
            </FadeIn>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0B1F3A] to-transparent" />
      </section>

      {/* ═══════════════════════════════════════════════
          2. STATS
      ═══════════════════════════════════════════════ */}
      <section className="bg-[#091A30] py-16 border-y border-amber-500/10">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: 100, suffix: "k+", prefix: "$", label: "Inversión mínima", sublabel: "USD" },
              { value: 20, suffix: "%", prefix: "", label: "Deals presentados", sublabel: "del total evaluado" },
              { value: 10, suffix: "+", prefix: "", label: "Países en la comunidad", sublabel: "Latinoamérica y más" },
              { value: 1, suffix: " / mes", prefix: "", label: "Deal Day exclusivo", sublabel: "Sesión privada mensual" },
            ].map((stat, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="text-center">
                  <div
                    className="text-3xl md:text-4xl font-bold mb-1"
                    style={{ color: GOLD_LIGHT }}
                  >
                    <Counter value={stat.value} suffix={stat.suffix} prefix={stat.prefix} />
                  </div>
                  <p className="text-white font-semibold text-sm mb-0.5">{stat.label}</p>
                  <p className="text-slate-500 text-xs">{stat.sublabel}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          3. EL PROBLEMA
      ═══════════════════════════════════════════════ */}
      <section className="bg-[#F5F7FA] py-24 md:py-32">
        <div className="container">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <FadeIn direction="left">
                <SectionLabel>El Problema</SectionLabel>
                <h2 className="text-3xl md:text-4xl font-bold text-[#0B1F3A] leading-tight mb-6">
                  El problema no es invertir en Estados Unidos…{" "}
                  <span style={{ color: GOLD }}>Es no saber en qué invertir</span>
                </h2>
                <p className="text-[#4B5563] text-lg leading-relaxed">
                  Hoy existe demasiada información y demasiadas opciones. Pero pocas están realmente
                  estructuradas para inversionistas serios.
                </p>
              </FadeIn>

              <FadeIn direction="right" delay={0.2}>
                <div className="space-y-4">
                  {[
                    {
                      icon: XCircle,
                      color: "text-red-500",
                      bg: "bg-red-50",
                      border: "border-red-100",
                      text: "Invertir sin contexto ni análisis real del mercado",
                    },
                    {
                      icon: XCircle,
                      color: "text-red-500",
                      bg: "bg-red-50",
                      border: "border-red-100",
                      text: "Confiar en intermediarios sin experiencia comprobada",
                    },
                    {
                      icon: XCircle,
                      color: "text-red-500",
                      bg: "bg-red-50",
                      border: "border-red-100",
                      text: "Tomar decisiones sin red de respaldo profesional",
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className={`flex items-start gap-4 p-5 rounded-xl border ${item.bg} ${item.border}`}
                    >
                      <item.icon className={`w-5 h-5 ${item.color} flex-shrink-0 mt-0.5`} />
                      <p className="text-[#374151] font-medium">{item.text}</p>
                    </div>
                  ))}
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          4. LAS MEJORES OPORTUNIDADES
      ═══════════════════════════════════════════════ */}
      <section className="bg-[#0E2544] py-24 md:py-32 relative overflow-hidden">
        {/* Decorative gold gradient orb */}
        <div
          className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-5 blur-3xl"
          style={{ background: GOLD }}
        />

        <div className="container relative z-10">
          <FadeIn>
            <div className="text-center mb-16">
              <SectionLabel light>La Solución</SectionLabel>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 max-w-3xl mx-auto">
                Las mejores oportunidades no se publican…{" "}
                <span style={{ color: GOLD_LIGHT }}>se comparten dentro de redes</span>
              </h2>
              <GoldDivider />
              <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                Las oportunidades más interesantes rara vez están abiertas al público. Se encuentran dentro de:
              </p>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                icon: Users,
                title: "Comunidades cerradas",
                desc: "Grupos de empresarios con experiencia real, donde la confianza es la moneda de entrada.",
                num: "01",
              },
              {
                icon: TrendingUp,
                title: "Redes empresariales",
                desc: "Conexiones profesionales que generan acceso preferente a oportunidades antes de que sean públicas.",
                num: "02",
              },
              {
                icon: Star,
                title: "Círculos privados",
                desc: "Espacios donde se analiza, discute y ejecuta con criterio y asesoría de expertos.",
                num: "03",
              },
            ].map((item, i) => (
              <FadeIn key={i} delay={i * 0.15}>
                <div className="relative group bg-[#132D50] border border-[#1E3A5F] rounded-2xl p-8 h-full hover:border-amber-500/30 transition-all duration-300 overflow-hidden">
                  {/* Number watermark */}
                  <div
                    className="absolute -top-4 -right-2 text-8xl font-black opacity-5 select-none"
                    style={{ color: GOLD }}
                  >
                    {item.num}
                  </div>
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-6"
                    style={{ background: `${GOLD}15`, border: `1px solid ${GOLD}30` }}
                  >
                    <item.icon className="w-6 h-6" style={{ color: GOLD_LIGHT }} />
                  </div>
                  <h3 className="text-xl text-white font-bold mb-3">{item.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════════════
          5. DEAL DAY
      ═══════════════════════════════════════════════ */}
      <section className="bg-[#F5F7FA] py-24 md:py-32">
        <div className="container">
          <FadeIn>
            <div className="text-center mb-16">
              <SectionLabel>Cómo Funciona</SectionLabel>
              <h2 className="text-3xl md:text-4xl font-bold text-[#0B1F3A]">
                Así acceden los miembros a oportunidades
              </h2>
              <GoldDivider />
            </div>
          </FadeIn>

          <div className="max-w-4xl mx-auto">
            <FadeIn delay={0.1}>
              <div className="relative group">
                {/* Glow */}
                <div
                  className="absolute -inset-1 rounded-3xl blur-xl opacity-40 group-hover:opacity-70 transition-opacity duration-500"
                  style={{ background: `linear-gradient(135deg, ${GOLD}40, #3B82F640, ${GOLD}30)` }}
                />

                <div
                  className="relative rounded-3xl overflow-hidden"
                  style={{ background: `linear-gradient(135deg, ${NAVY_DEEP}, ${NAVY_CARD})` }}
                >
                  {/* Gold top border */}
                  <div
                    className="h-1 w-full"
                    style={{ background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)` }}
                  />

                  <div className="p-10 md:p-14">
                    <div className="flex flex-col md:flex-row gap-10">
                      {/* Left */}
                      <div className="flex-1">
                        <div
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold tracking-wider uppercase mb-6"
                          style={{
                            background: `${GOLD}20`,
                            border: `1px solid ${GOLD}40`,
                            color: GOLD_LIGHT,
                          }}
                        >
                          <Calendar className="w-3.5 h-3.5" />
                          Sesión mensual exclusiva
                        </div>

                        <h3
                          className="text-4xl md:text-5xl font-black mb-2"
                          style={{
                            background: `linear-gradient(135deg, white, ${GOLD_LIGHT})`,
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                          }}
                        >
                          Deal Day
                        </h3>
                        <p className="text-slate-300 text-lg leading-relaxed mb-8">
                          Cada mes presentamos oportunidades de inversión en sesiones privadas exclusivas
                          para miembros de Comprando América.
                        </p>

                        <a href="/membresia">
                          <Button
                            className="group px-6 py-5 rounded-full font-semibold gap-2"
                            style={{
                              background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`,
                              color: NAVY,
                            }}
                          >
                            Acceder al Círculo Cercano
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </Button>
                        </a>
                      </div>

                      {/* Right — checklist */}
                      <div className="flex-1">
                        <div className="space-y-4">
                          {[
                            { step: "01", text: "Oportunidades previamente filtradas y evaluadas por expertos" },
                            { step: "02", text: "Se analiza la estructura legal, fiscal y operativa de cada deal" },
                            { step: "03", text: "Se discuten escenarios, riesgos y potencial de retorno real" },
                            { step: "04", text: "Solo miembros activos tienen acceso a los deals presentados" },
                          ].map((item, i) => (
                            <div
                              key={i}
                              className="flex items-start gap-4 p-4 rounded-xl"
                              style={{ background: `${GOLD}08`, border: `1px solid ${GOLD}15` }}
                            >
                              <span
                                className="text-xs font-black font-mono flex-shrink-0 mt-0.5"
                                style={{ color: GOLD }}
                              >
                                {item.step}
                              </span>
                              <p className="text-slate-300 text-sm leading-relaxed">{item.text}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div
                      className="mt-10 pt-8 border-t"
                      style={{ borderColor: `${GOLD}20` }}
                    >
                      <p className="text-slate-500 text-sm italic text-center">
                        El acceso a Deal Day es exclusivo para miembros activos del Círculo Cercano de
                        Edmundo Treviño.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          6. CRITERIO DE ACCESO
      ═══════════════════════════════════════════════ */}
      <section id="filtro" className="bg-[#0B1F3A] py-24 md:py-32 relative overflow-hidden">
        <div
          className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full opacity-5 blur-3xl"
          style={{ background: GOLD }}
        />

        <div className="container relative z-10">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <FadeIn direction="left">
                <SectionLabel light>Criterio de Acceso</SectionLabel>
                <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-6">
                  No todas las personas pueden participar
                </h2>
                <p className="text-slate-400 text-lg leading-relaxed mb-8">
                  El acceso a oportunidades no depende solo del capital. Depende del perfil. Buscamos
                  inversionistas con criterio, no solo con dinero.
                </p>

                <div className="space-y-4">
                  {[
                    "Inversión disponible desde $100,000 USD",
                    "Perfil empresarial o de inversionista activo",
                    "Alineación con el tipo de oportunidad presentada",
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ background: `${GOLD}20`, border: `1px solid ${GOLD}40` }}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" style={{ color: GOLD_LIGHT }} />
                      </div>
                      <p className="text-slate-300">{item}</p>
                    </div>
                  ))}
                </div>
              </FadeIn>

              <FadeIn direction="right" delay={0.2}>
                <div
                  className="rounded-2xl p-8 relative overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, ${NAVY_CARD}, ${NAVY_MID})`,
                    border: `1px solid ${GOLD}25`,
                  }}
                >
                  <div
                    className="absolute top-0 left-0 right-0 h-1"
                    style={{ background: `linear-gradient(90deg, transparent, ${GOLD}60, transparent)` }}
                  />
                  <Lock className="w-10 h-10 mb-6" style={{ color: GOLD }} />
                  <p className="text-white text-xl font-bold leading-relaxed mb-4">
                    Incluso si alguien tiene el capital,{" "}
                    <span style={{ color: GOLD_LIGHT }}>si no cumple el perfil, no participa.</span>
                  </p>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Este filtro protege la calidad de la comunidad y la seriedad de cada oportunidad
                    presentada.
                  </p>

                  <div className="mt-8 pt-6" style={{ borderTop: `1px solid ${GOLD}15` }}>
                    <Button
                      onClick={() =>
                        openWhatsApp(
                          WHATSAPP_PHONE,
                          "Hola, quiero saber si califico para acceder a las oportunidades de inversión."
                        )
                      }
                      className="w-full rounded-xl py-5 font-semibold gap-2"
                      style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`, color: NAVY }}
                    >
                      Evaluar si califico <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          7. OPORTUNIDADES ACTIVAS
      ═══════════════════════════════════════════════ */}
      <section className="bg-white py-24 md:py-32">
        <div className="container">
          <FadeIn>
            <div className="text-center mb-16">
              <SectionLabel>Oportunidades</SectionLabel>
              <h2 className="text-3xl md:text-4xl font-bold text-[#0B1F3A]">
                Oportunidades activas actualmente
              </h2>
              <GoldDivider />
              <p className="text-[#6B7280] max-w-xl mx-auto">
                Cada oportunidad pasa por un filtro riguroso antes de ser presentada a la comunidad.
              </p>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Card 1 — Bienes raíces */}
            <FadeIn>
              <div
                className="relative rounded-2xl p-8 h-full group transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${NAVY_DEEP}, ${NAVY_CARD})`,
                  border: `1px solid ${GOLD}25`,
                }}
              >
                {/* Gold top bar */}
                <div
                  className="absolute top-0 left-0 right-0 h-1"
                  style={{ background: `linear-gradient(90deg, transparent, ${GOLD}80, transparent)` }}
                />

                <div className="flex items-center justify-between mb-6">
                  <div
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider"
                    style={{ background: `${GOLD}15`, border: `1px solid ${GOLD}35`, color: GOLD_LIGHT }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" /> Activa
                  </div>
                  <span className="text-slate-500 text-xs font-mono">DEAL #001</span>
                </div>

                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-6"
                  style={{ background: `${GOLD}15`, border: `1px solid ${GOLD}30` }}
                >
                  <Building2 className="w-7 h-7" style={{ color: GOLD_LIGHT }} />
                </div>

                <h3 className="text-2xl text-white font-bold mb-2">
                  Fondo de bienes raíces en Estados Unidos
                </h3>
                <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                  Acceso a portafolio diversificado de propiedades en mercados de alta demanda con
                  estructura legal completa.
                </p>

                <div className="space-y-3 mb-8">
                  {[
                    "Inversión desde $100,000 USD",
                    "Estructura profesional completa — LLC + fiscal",
                    "Enfoque patrimonial a largo plazo en dólares",
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: GOLD }} />
                      <p className="text-slate-300 text-sm">{item}</p>
                    </div>
                  ))}
                </div>

                <a href="/bienes-raices-en-usa">
                  <Button
                    className="w-full rounded-xl py-5 font-semibold gap-2"
                    style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`, color: NAVY }}
                  >
                    Ver detalles <ArrowRight className="w-4 h-4" />
                  </Button>
                </a>
              </div>
            </FadeIn>

            {/* Card 2 — Inversión + Ruta migratoria */}
            <FadeIn delay={0.15}>
              <div
                className="relative rounded-2xl p-8 h-full group transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${NAVY_DEEP}, ${NAVY_CARD})`,
                  border: `1px solid ${GOLD}25`,
                }}
              >
                <div
                  className="absolute top-0 left-0 right-0 h-1"
                  style={{ background: `linear-gradient(90deg, transparent, ${GOLD}80, transparent)` }}
                />

                <div className="flex items-center justify-between mb-6">
                  <div
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider"
                    style={{ background: `${GOLD}15`, border: `1px solid ${GOLD}35`, color: GOLD_LIGHT }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" /> Activa
                  </div>
                  <span className="text-slate-500 text-xs font-mono">DEAL #002</span>
                </div>

                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-6"
                  style={{ background: `${GOLD}15`, border: `1px solid ${GOLD}30` }}
                >
                  <Globe className="w-7 h-7" style={{ color: GOLD_LIGHT }} />
                </div>

                <h3 className="text-2xl text-white font-bold mb-2">Inversión + Ruta migratoria</h3>
                <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                  Para quienes tienen $300,000 USD o más y quieren migrar a Estados Unidos con una
                  estructura de inversión real.
                </p>

                <div className="space-y-3 mb-8">
                  {[
                    "Capital desde $300,000 USD disponible",
                    "Estrategia de visa E-2 integrada",
                    "Inversión productiva + residencia legal",
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: GOLD }} />
                      <p className="text-slate-300 text-sm">{item}</p>
                    </div>
                  ))}
                </div>

                <Button
                  onClick={() =>
                    openWhatsApp(
                      WHATSAPP_PHONE,
                      "Hola, me interesa el modelo de Inversión + Ruta migratoria."
                    )
                  }
                  className="w-full rounded-xl py-5 font-semibold gap-2"
                  style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`, color: NAVY }}
                >
                  Evaluar si encaja conmigo <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </FadeIn>
          </div>

          {/* Coming soon teaser */}
          <FadeIn delay={0.3}>
            <div className="max-w-4xl mx-auto mt-6">
              <div
                className="rounded-2xl p-6 text-center"
                style={{ background: "#F9FAFB", border: "1px dashed #D1D5DB" }}
              >
                <Zap className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">
                  Nuevas oportunidades se presentan mensualmente en el{" "}
                  <a href="/membresia" className="font-semibold underline underline-offset-2" style={{ color: GOLD }}>
                    Círculo Cercano
                  </a>
                  . El acceso es exclusivo para miembros.
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          8. FILOSOFÍA
      ═══════════════════════════════════════════════ */}
      <section className="bg-[#0E2544] py-24 md:py-32">
        <div className="container">
          <FadeIn>
            <div className="max-w-4xl mx-auto">
              <div
                className="rounded-3xl p-12 md:p-16 text-center relative overflow-hidden"
                style={{ background: `linear-gradient(135deg, ${NAVY_DEEP}, ${NAVY_CARD})` }}
              >
                <div
                  className="absolute inset-0 opacity-30"
                  style={{
                    background: `radial-gradient(circle at 50% 0%, ${GOLD}20 0%, transparent 70%)`,
                  }}
                />
                <div className="relative z-10">
                  <div className="flex justify-center mb-6">
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center"
                      style={{ background: `${GOLD}15`, border: `1px solid ${GOLD}30` }}
                    >
                      <Star className="w-8 h-8" style={{ color: GOLD_LIGHT }} />
                    </div>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
                    No se trata de cantidad de oportunidades…{" "}
                    <span style={{ color: GOLD_LIGHT }}>se trata de calidad y criterio</span>
                  </h2>
                  <GoldDivider />
                  <p className="text-slate-400 text-lg leading-relaxed max-w-2xl mx-auto">
                    En Comprando América no presentamos todo lo que vemos. Filtramos oportunidades y
                    priorizamos estructura. Solo lo que cumple con nuestros estándares llega a la comunidad.
                  </p>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>


      {/* ═══════════════════════════════════════════════
          9. MEMBRESÍA
      ═══════════════════════════════════════════════ */}
      <section className="bg-[#F5F7FA] py-24 md:py-32">
        <div className="container">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <FadeIn direction="left">
                <SectionLabel>Círculo Cercano</SectionLabel>
                <h2 className="text-3xl md:text-4xl font-bold text-[#0B1F3A] mb-6 leading-tight">
                  La mayoría de oportunidades se presentan dentro del{" "}
                  <span style={{ color: GOLD }}>Círculo Cercano</span>
                </h2>
                <p className="text-[#4B5563] text-lg leading-relaxed mb-8">
                  La comunidad es el espacio donde se presentan oportunidades, se discuten con expertos y
                  se toman decisiones con respaldo profesional.
                </p>
                <a href="/membresia">
                  <Button
                    className="px-8 py-6 text-base gap-2 rounded-full font-semibold shadow-lg"
                    style={{
                      background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`,
                      color: NAVY,
                      boxShadow: `0 8px 32px ${GOLD}40`,
                    }}
                  >
                    Conocer el Círculo Cercano <ArrowRight className="w-4 h-4" />
                  </Button>
                </a>
              </FadeIn>

              <FadeIn direction="right" delay={0.2}>
                <div className="space-y-4">
                  {[
                    { icon: Calendar, title: "Deal Day mensual", desc: "Sesiones privadas con oportunidades presentadas en vivo" },
                    { icon: Users, title: "Red de empresarios", desc: "Comunidad de inversionistas serios en toda Latinoamérica" },
                    { icon: ShieldCheck, title: "Respaldo profesional", desc: "Acceso a expertos legales, fiscales y operativos" },
                    { icon: Zap, title: "Acceso prioritario", desc: "Los miembros ven las oportunidades antes que nadie" },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-4 p-4 rounded-xl bg-white shadow-sm border border-gray-100"
                    >
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: `${GOLD}15`, border: `1px solid ${GOLD}30` }}
                      >
                        <item.icon className="w-5 h-5" style={{ color: GOLD }} />
                      </div>
                      <div>
                        <p className="text-[#0B1F3A] font-semibold text-sm mb-0.5">{item.title}</p>
                        <p className="text-[#6B7280] text-sm leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          10. PARA QUIÉN ES / NO ES
      ═══════════════════════════════════════════════ */}
      <section className="bg-[#0E2544] py-24 md:py-32">
        <div className="container">
          <FadeIn>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                ¿Este es tu perfil?
              </h2>
              <GoldDivider />
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <FadeIn direction="left">
              <div
                className="rounded-2xl p-8 h-full"
                style={{
                  background: `linear-gradient(135deg, ${NAVY_CARD}, #0B2040)`,
                  border: `1px solid ${GOLD}25`,
                }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-6"
                  style={{ background: `${GOLD}15`, border: `1px solid ${GOLD}30` }}
                >
                  <Eye className="w-6 h-6" style={{ color: GOLD_LIGHT }} />
                </div>
                <h3 className="text-2xl text-white font-bold mb-6">Estas oportunidades son para ti si:</h3>
                <div className="space-y-3">
                  {[
                    "Eres empresario con operaciones activas",
                    "Tienes capital disponible para invertir",
                    "Tienes visión patrimonial a largo plazo",
                    "Tomas decisiones con criterio y análisis",
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ background: `${GOLD}20`, border: `1px solid ${GOLD}40` }}
                      >
                        <CheckCircle2 className="w-3 h-3" style={{ color: GOLD_LIGHT }} />
                      </div>
                      <p className="text-slate-300 text-sm">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>

            <FadeIn direction="right" delay={0.1}>
              <div
                className="rounded-2xl p-8 h-full"
                style={{ background: "#0F2847", border: "1px solid #1E3A5F" }}
              >
                <XCircle className="w-10 h-10 text-slate-600 mb-6" />
                <h3 className="text-2xl text-slate-500 font-bold mb-6">No es para quienes:</h3>
                <div className="space-y-3">
                  {[
                    "Buscan inversiones rápidas sin análisis",
                    "No tienen capital disponible para invertir",
                    "No valoran el proceso de due diligence",
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <XCircle className="w-4 h-4 text-red-400/50 flex-shrink-0" />
                      <p className="text-slate-600 text-sm">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          11. ESTRUCTURA
      ═══════════════════════════════════════════════ */}
      <section className="bg-white py-24 md:py-32">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div
              className="rounded-3xl p-10 md:p-14 relative overflow-hidden"
              style={{
                background: `linear-gradient(135deg, ${NAVY_DEEP}, ${NAVY_CARD})`,
              }}
            >
              <div
                className="absolute top-0 left-0 right-0 h-1"
                style={{ background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)` }}
              />
              <div className="grid md:grid-cols-2 gap-10 items-center">
                <div>
                  <SectionLabel light>Estructura</SectionLabel>
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                    Antes de invertir, necesitas una{" "}
                    <span style={{ color: GOLD_LIGHT }}>estructura correcta</span>
                  </h2>
                  <p className="text-slate-400 leading-relaxed mb-8">
                    Una LLC bien estructurada protege tu capital, optimiza tu carga fiscal y te posiciona
                    correctamente ante el mercado estadounidense.
                  </p>
                  <a href="/estructura-de-inversion-en-usa">
                    <Button
                      className="rounded-full px-8 py-5 gap-2 font-semibold"
                      style={{ background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`, color: NAVY }}
                    >
                      Estructurar mi empresa <ArrowRight className="w-4 h-4" />
                    </Button>
                  </a>
                </div>
                <div className="space-y-3">
                  {[
                    { icon: ShieldCheck, label: "Protección patrimonial legal" },
                    { icon: TrendingUp, label: "Optimización fiscal en USA" },
                    { icon: Globe, label: "Operación desde cualquier país" },
                    { icon: Lock, label: "Blindaje ante riesgos legales" },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-3 rounded-xl"
                      style={{ background: `${GOLD}08`, border: `1px solid ${GOLD}15` }}
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0" style={{ color: GOLD }} />
                      <p className="text-slate-300 text-sm font-medium">{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          12. FAQ
      ═══════════════════════════════════════════════ */}
      <section className="bg-[#0B1F3A] py-24 md:py-32">
        <div className="container">
          <FadeIn>
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-16">
                <SectionLabel light>FAQ</SectionLabel>
                <h2 className="text-3xl md:text-4xl font-bold text-white">Preguntas frecuentes</h2>
                <GoldDivider />
              </div>

              <Accordion type="single" collapsible className="space-y-4">
                {[
                  {
                    q: "¿Cuál es el monto mínimo de inversión?",
                    a: "El punto de entrada es $100,000 USD. Este monto permite acceder a oportunidades con estructura profesional completa — legal, fiscal y operativa. No es un monto arbitrario: es el nivel donde la diversificación internacional tiene sentido real.",
                  },
                  {
                    q: "¿Las oportunidades están garantizadas?",
                    a: "Ninguna inversión tiene garantía de retorno — y quien te diga lo contrario no es confiable. Lo que sí garantizamos es el proceso: cada oportunidad pasa por un filtro riguroso de análisis, estructura y viabilidad antes de ser presentada a la comunidad.",
                  },
                  {
                    q: "¿Puedo invertir desde cualquier país?",
                    a: "Sí. Nuestra comunidad incluye empresarios de México, Colombia, Chile, Argentina y otros países de América Latina. La estructura de LLC y la operación en Estados Unidos se puede gestionar de forma remota con el equipo correcto.",
                  },
                  {
                    q: "¿Cómo se seleccionan las oportunidades?",
                    a: "Cada oportunidad es evaluada por nuestro equipo multidisciplinario: análisis financiero, due diligence legal, viabilidad operativa y alineación con los perfiles de nuestros miembros. Solo el 20% de lo que evaluamos llega a ser presentado.",
                  },
                ].map((faq, i) => (
                  <AccordionItem
                    key={i}
                    value={`faq-${i}`}
                    className="rounded-xl px-6 border"
                    style={{ background: "#0F2847", borderColor: `${GOLD}15` }}
                  >
                    <AccordionTrigger className="text-white text-left hover:no-underline py-5 gap-4">
                      {faq.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-slate-400 leading-relaxed pb-5">
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          13. CTA FINAL
      ═══════════════════════════════════════════════ */}
      <section
        className="py-28 md:py-36 relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${NAVY_DEEP}, ${NAVY})` }}
      >
        {/* Gold radial glow */}
        <div
          className="absolute inset-0 opacity-20"
          style={{ background: `radial-gradient(ellipse at 50% 0%, ${GOLD}40 0%, transparent 65%)` }}
        />
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{ background: `linear-gradient(90deg, transparent, ${GOLD}60, transparent)` }}
        />

        <div className="container relative z-10">
          <FadeIn>
            <div className="max-w-2xl mx-auto text-center">
              <div className="flex justify-center mb-6">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center"
                  style={{ background: `${GOLD}20`, border: `1px solid ${GOLD}40` }}
                >
                  <Star className="w-8 h-8" style={{ color: GOLD_LIGHT }} />
                </div>
              </div>

              <h2
                className="text-3xl md:text-5xl font-black mb-4 leading-tight"
                style={{
                  background: `linear-gradient(135deg, white 40%, ${GOLD_LIGHT})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Accede a oportunidades con criterio y estructura
              </h2>

              <p className="text-slate-400 text-lg mb-2">
                Las oportunidades no están abiertas a todos.
              </p>
              <p className="text-slate-600 text-sm mb-12">
                Pero pueden estar disponibles para el perfil correcto.
              </p>

              <div className="flex flex-wrap justify-center gap-4">
                <a href="/tu-ruta">
                  <Button
                    className="px-8 py-6 text-base gap-2 rounded-full font-bold shadow-2xl"
                    style={{
                      background: `linear-gradient(135deg, ${GOLD}, ${GOLD_LIGHT})`,
                      color: NAVY,
                      boxShadow: `0 8px 48px ${GOLD}50`,
                    }}
                  >
                    Evaluar mi perfil <ArrowRight className="w-4 h-4" />
                  </Button>
                </a>
                <a href="/membresia">
                  <Button
                    variant="outline"
                    className="px-8 py-6 text-base rounded-full"
                    style={{ borderColor: `${GOLD}40`, color: GOLD_LIGHT }}
                  >
                    Conocer el Círculo Cercano
                  </Button>
                </a>
                <Button
                  variant="outline"
                  onClick={() =>
                    openWhatsApp(
                      WHATSAPP_PHONE,
                      "Hola, me interesa conocer las oportunidades de inversión en Estados Unidos."
                    )
                  }
                  className="px-8 py-6 text-base rounded-full border-slate-700 text-slate-300 hover:bg-white/10 gap-2"
                >
                  <MessageSquare className="w-4 h-4" /> WhatsApp
                </Button>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      <Footer />
    </div>
  );
}
