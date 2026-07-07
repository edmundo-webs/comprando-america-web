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
  Filter,
  Globe,
  Zap,
  Star,
} from "lucide-react";
import SEOHead from "@/components/SEOHead";

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
  const anim = isInView ? { opacity: 1, y: 0, x: 0 } : {};
  return (
    <motion.div
      ref={ref}
      initial={initial}
      animate={anim}
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

/* ─── Section label ─── */
function SectionLabel({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <p className={`text-xs font-bold tracking-[0.3em] uppercase mb-4 font-mono ${light ? "text-blue-400" : "text-primary"}`}>
      {children}
    </p>
  );
}

/* ─── Divider ─── */
function Divider() {
  return (
    <div className="flex items-center justify-center gap-3 my-6">
      <div className="h-px w-16 bg-gradient-to-r from-transparent to-blue-500/50" />
      <div className="w-1.5 h-1.5 rounded-full bg-blue-500/70" />
      <div className="h-px w-16 bg-gradient-to-l from-transparent to-blue-500/50" />
    </div>
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
        <div className="absolute inset-0">
          <img src={HERO_IMAGE} alt="Presentación de oportunidades de inversión" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#091A30]/98 via-[#0B1F3A]/90 to-[#0B1F3A]/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F3A] via-transparent to-transparent" />
        </div>
        <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-blue-500/20 to-transparent" />

        <div className="container relative z-10">
          <div className="max-w-3xl">
            <FadeIn delay={0.1}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/30 bg-blue-500/10 mb-8">
                <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                <span className="text-blue-400 text-xs font-bold tracking-[0.2em] uppercase font-mono">
                  Acceso Privado · Solo para Inversionistas Calificados
                </span>
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.1] mb-6">
                Oportunidades de inversión en{" "}
                <span className="gradient-text-primary">Estados Unidos</span>{" "}
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
                  className="bg-primary hover:bg-blue-600 text-white px-8 py-6 text-base gap-2 rounded-full shadow-lg shadow-blue-600/25"
                >
                  Ver oportunidades disponibles <ArrowRight className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => openWhatsApp(WHATSAPP_PHONE, "Hola, quiero conocer las oportunidades de inversión.")}
                  className="px-8 py-6 text-base border-white/20 text-white hover:bg-white/10 rounded-full gap-2"
                >
                  <MessageSquare className="w-4 h-4" /> Hablar con un asesor
                </Button>
              </div>
            </FadeIn>

            <FadeIn delay={0.5}>
              <div className="flex flex-wrap gap-6 text-slate-400 text-sm">
                <span className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-primary" /> Oportunidades filtradas</span>
                <span className="flex items-center gap-2"><Lock className="w-4 h-4 text-primary" /> Acceso privado</span>
                <span className="flex items-center gap-2"><Filter className="w-4 h-4 text-primary" /> Solo 20% de lo evaluado llega a la comunidad</span>
              </div>
            </FadeIn>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0B1F3A] to-transparent" />
      </section>

      {/* ═══════════════════════════════════════════════
          2. STATS
      ═══════════════════════════════════════════════ */}
      <section className="bg-[#091A30] py-16 border-y border-blue-500/10">
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
                  <div className="text-3xl md:text-4xl font-bold text-primary mb-1">
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
                  <span className="text-primary">Es no saber en qué invertir</span>
                </h2>
                <p className="text-[#4B5563] text-lg leading-relaxed">
                  Hoy existe demasiada información y demasiadas opciones. Pero pocas están realmente
                  estructuradas para inversionistas serios.
                </p>
              </FadeIn>

              <FadeIn direction="right" delay={0.2}>
                <div className="space-y-4">
                  {[
                    "Invertir sin contexto ni análisis real del mercado",
                    "Confiar en intermediarios sin experiencia comprobada",
                    "Tomar decisiones sin red de respaldo profesional",
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-4 p-5 rounded-xl border bg-red-50 border-red-100">
                      <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                      <p className="text-[#374151] font-medium">{item}</p>
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
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-5 blur-3xl bg-blue-500" />

        <div className="container relative z-10">
          <FadeIn>
            <div className="text-center mb-16">
              <SectionLabel light>La Solución</SectionLabel>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 max-w-3xl mx-auto">
                Las mejores oportunidades no se publican…{" "}
                <span className="text-blue-400">se comparten dentro de redes</span>
              </h2>
              <Divider />
              <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                Las oportunidades más interesantes rara vez están abiertas al público. Se encuentran dentro de:
              </p>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { icon: Users, title: "Comunidades cerradas", desc: "Grupos de empresarios con experiencia real, donde la confianza es la moneda de entrada.", num: "01" },
              { icon: TrendingUp, title: "Redes empresariales", desc: "Conexiones profesionales que generan acceso preferente a oportunidades antes de que sean públicas.", num: "02" },
              { icon: Star, title: "Círculos privados", desc: "Espacios donde se analiza, discute y ejecuta con criterio y asesoría de expertos.", num: "03" },
            ].map((item, i) => (
              <FadeIn key={i} delay={i * 0.15}>
                <div className="relative group bg-[#0F2847] border border-[#1E3A5F] rounded-2xl p-8 h-full hover:border-blue-500/30 transition-all duration-300 overflow-hidden">
                  <div className="absolute -top-4 -right-2 text-8xl font-black opacity-5 select-none text-blue-400">
                    {item.num}
                  </div>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 bg-blue-500/10 border border-blue-500/20">
                    <item.icon className="w-6 h-6 text-blue-400" />
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
              <h2 className="text-3xl md:text-4xl font-bold text-[#0B1F3A]">Así acceden los miembros a oportunidades</h2>
              <Divider />
            </div>
          </FadeIn>

          <div className="max-w-4xl mx-auto">
            <FadeIn delay={0.1}>
              <div className="relative group">
                <div className="absolute -inset-1 rounded-3xl blur-xl opacity-40 group-hover:opacity-70 transition-opacity duration-500 bg-gradient-to-r from-blue-600/20 via-blue-400/15 to-blue-600/20" />

                <div className="relative bg-[#091A30] border border-blue-500/20 rounded-3xl overflow-hidden">
                  <div className="h-1 w-full bg-gradient-to-r from-transparent via-blue-500 to-transparent" />

                  <div className="p-10 md:p-14">
                    <div className="flex flex-col md:flex-row gap-10">
                      <div className="flex-1">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold tracking-wider uppercase mb-6 bg-blue-500/10 border border-blue-500/20 text-blue-400">
                          <Calendar className="w-3.5 h-3.5" />
                          Sesión mensual exclusiva
                        </div>

                        <h3 className="text-4xl md:text-5xl font-black mb-2 text-white">Deal Day</h3>
                        <p className="text-slate-300 text-lg leading-relaxed mb-8">
                          Cada mes presentamos oportunidades de inversión en sesiones privadas exclusivas
                          para miembros de Comprando América.
                        </p>

                        <a href="/membresia">
                          <Button className="bg-primary hover:bg-blue-600 text-white px-6 py-5 rounded-full font-semibold gap-2 shadow-lg shadow-blue-600/25">
                            Acceder al Grupo Empresarial de Edmundo <ArrowRight className="w-4 h-4" />
                          </Button>
                        </a>
                      </div>

                      <div className="flex-1">
                        <div className="space-y-4">
                          {[
                            { step: "01", text: "Oportunidades previamente filtradas y evaluadas por expertos" },
                            { step: "02", text: "Se analiza la estructura legal, fiscal y operativa de cada deal" },
                            { step: "03", text: "Se discuten escenarios, riesgos y potencial de retorno real" },
                            { step: "04", text: "Solo miembros activos tienen acceso a los deals presentados" },
                          ].map((item, i) => (
                            <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-blue-500/5 border border-blue-500/10">
                              <span className="text-xs font-black font-mono flex-shrink-0 mt-0.5 text-blue-400">{item.step}</span>
                              <p className="text-slate-300 text-sm leading-relaxed">{item.text}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-10 pt-8 border-t border-blue-500/10">
                      <p className="text-slate-500 text-sm italic text-center">
                        El acceso a Deal Day es exclusivo para miembros activos del Grupo Empresarial de Edmundo Treviño.
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
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full opacity-5 blur-3xl bg-blue-500" />

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
                      <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 bg-blue-500/15 border border-blue-500/30">
                        <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                      </div>
                      <p className="text-slate-300">{item}</p>
                    </div>
                  ))}
                </div>
              </FadeIn>

              <FadeIn direction="right" delay={0.2}>
                <div className="bg-[#0F2847] border border-blue-500/20 rounded-2xl p-8 relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-500/60 to-transparent" />
                  <Lock className="w-10 h-10 text-primary mb-6" />
                  <p className="text-white text-xl font-bold leading-relaxed mb-4">
                    Incluso si alguien tiene el capital,{" "}
                    <span className="text-blue-400">si no cumple el perfil, no participa.</span>
                  </p>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Este filtro protege la calidad de la comunidad y la seriedad de cada oportunidad
                    presentada.
                  </p>

                  <div className="mt-8 pt-6 border-t border-blue-500/10">
                    <Button
                      onClick={() => openWhatsApp(WHATSAPP_PHONE, "Hola, quiero saber si califico para acceder a las oportunidades de inversión.")}
                      className="w-full bg-primary hover:bg-blue-600 text-white rounded-xl py-5 font-semibold gap-2 shadow-lg shadow-blue-600/20"
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
            <div className="max-w-3xl mx-auto text-center">
              <p className="text-primary text-sm font-semibold tracking-[0.25em] uppercase mb-4 font-mono">Grupo Empresarial de Edmundo</p>
              <h2 className="text-3xl md:text-4xl text-[#0B1F3A] mb-6">
                La mayoría de las oportunidades se presentan dentro de el Grupo Empresarial de Edmundo
              </h2>
              <p className="text-[#4B5563] text-lg leading-relaxed mb-10">
                La comunidad es el espacio donde se presentan oportunidades, se discuten con expertos y se toman decisiones con respaldo profesional.
              </p>
              <a href="/membresia">
                <Button className="bg-primary hover:bg-blue-600 text-white px-10 py-6 text-base gap-2 shadow-lg shadow-blue-600/20">
                  Conocer el Grupo Empresarial de Edmundo <ArrowRight className="w-4 h-4" />
                </Button>
              </a>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <FadeIn>
              <div className="relative bg-[#0B1F3A] border border-[#1E3A5F] rounded-2xl p-8 h-full group hover:border-blue-500/40 transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-500/60 to-transparent" />

                <div className="flex items-center justify-between mb-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-500/10 border border-blue-500/25 text-blue-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" /> Activa
                  </div>
                  <span className="text-slate-500 text-xs font-mono">DEAL #001</span>
                </div>

                <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 bg-blue-500/10 border border-blue-500/20">
                  <Building2 className="w-7 h-7 text-blue-400" />
                </div>

                <h3 className="text-2xl text-white font-bold mb-2">Fondo de bienes raíces en Estados Unidos</h3>
                <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                  Acceso a portafolio diversificado de propiedades en mercados de alta demanda con estructura legal completa.
                </p>

                <div className="space-y-3 mb-8">
                  {[
                    "Inversión desde $100,000 USD",
                    "Estructura profesional completa — LLC + fiscal",
                    "Enfoque patrimonial a largo plazo en dólares",
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-primary" />
                      <p className="text-slate-300 text-sm">{item}</p>
                    </div>
                  ))}
                </div>

                <a href="/bienes-raices-en-usa">
                  <Button className="w-full bg-primary hover:bg-blue-600 text-white rounded-xl py-5 font-semibold gap-2">
                    Ver detalles <ArrowRight className="w-4 h-4" />
                  </Button>
                </a>
              </div>
            </FadeIn>

            <FadeIn delay={0.15}>
              <div className="relative bg-[#0B1F3A] border border-[#1E3A5F] rounded-2xl p-8 h-full group hover:border-blue-500/40 transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-500/60 to-transparent" />

                <div className="flex items-center justify-between mb-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-500/10 border border-blue-500/25 text-blue-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" /> Activa
                  </div>
                  <span className="text-slate-500 text-xs font-mono">DEAL #002</span>
                </div>

                <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-6 bg-blue-500/10 border border-blue-500/20">
                  <Globe className="w-7 h-7 text-blue-400" />
                </div>

                <h3 className="text-2xl text-white font-bold mb-2">Inversión + Ruta migratoria</h3>
                <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                  Para quienes tienen $300,000 USD o más y quieren migrar a Estados Unidos con una estructura de inversión real.
                </p>

                <div className="space-y-3 mb-8">
                  {[
                    "Capital desde $300,000 USD disponible",
                    "Estrategia de visa E-2 integrada",
                    "Inversión productiva + residencia legal",
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2.5">
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-primary" />
                      <p className="text-slate-300 text-sm">{item}</p>
                    </div>
                  ))}
                </div>

                <Button
                  onClick={() => openWhatsApp(WHATSAPP_PHONE, "Hola, me interesa el modelo de Inversión + Ruta migratoria.")}
                  className="w-full bg-primary hover:bg-blue-600 text-white rounded-xl py-5 font-semibold gap-2"
                >
                  Evaluar si encaja conmigo <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </FadeIn>
          </div>

          <FadeIn delay={0.3}>
            <div className="max-w-4xl mx-auto mt-6">
              <div className="rounded-2xl p-6 text-center bg-[#F9FAFB] border border-dashed border-gray-200">
                <Zap className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">
                  Nuevas oportunidades se presentan mensualmente en el{" "}
                  <a href="/grupo-empresarial-edmundo" className="font-semibold underline underline-offset-2 text-primary">
                    Grupo Empresarial de Edmundo
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
              <div className="bg-[#091A30] border border-blue-500/15 rounded-3xl p-12 md:p-16 text-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-20" style={{ background: "radial-gradient(circle at 50% 0%, rgba(37,99,235,0.2) 0%, transparent 70%)" }} />
                <div className="relative z-10">
                  <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-blue-500/10 border border-blue-500/20">
                      <Star className="w-8 h-8 text-blue-400" />
                    </div>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
                    No se trata de cantidad de oportunidades…{" "}
                    <span className="text-blue-400">se trata de calidad y criterio</span>
                  </h2>
                  <Divider />
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
          9. MEMBRESÍA — CÍRCULO CERCANO
      ═══════════════════════════════════════════════ */}
      <section className="bg-[#F5F7FA] py-24 md:py-32">
        <div className="container">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <FadeIn direction="left">
                <SectionLabel>Grupo Empresarial de Edmundo</SectionLabel>
                <h2 className="text-3xl md:text-4xl font-bold text-[#0B1F3A] mb-6 leading-tight">
                  La mayoría de oportunidades se presentan dentro del{" "}
                  <span className="text-primary">Grupo Empresarial de Edmundo</span>
                </h2>
                <p className="text-[#4B5563] text-lg leading-relaxed mb-8">
                  La comunidad es el espacio donde se presentan oportunidades, se discuten con expertos y
                  se toman decisiones con respaldo profesional.
                </p>
                <a href="/grupo-empresarial-edmundo">
                  <Button className="bg-primary hover:bg-blue-600 text-white px-8 py-6 text-base gap-2 rounded-full font-semibold shadow-lg shadow-blue-600/20">
                    Conocer el Grupo Empresarial de Edmundo <ArrowRight className="w-4 h-4" />
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
                    <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-white shadow-sm border border-gray-100">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-blue-500/10 border border-blue-500/20">
                        <item.icon className="w-5 h-5 text-primary" />
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
              <h2 className="text-3xl md:text-4xl font-bold text-white">¿Este es tu perfil?</h2>
              <Divider />
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <FadeIn direction="left">
              <div className="bg-[#0F2847] border border-blue-500/20 rounded-2xl p-8 h-full">
                <Eye className="w-8 h-8 text-primary mb-6" />
                <h3 className="text-2xl text-white font-bold mb-6">Estas oportunidades son para ti si:</h3>
                <div className="space-y-3">
                  {["Eres empresario con operaciones activas", "Tienes capital disponible para invertir", "Tienes visión patrimonial a largo plazo", "Tomas decisiones con criterio y análisis"].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 bg-blue-500/15 border border-blue-500/30">
                        <CheckCircle2 className="w-3 h-3 text-blue-400" />
                      </div>
                      <p className="text-slate-300 text-sm">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>

            <FadeIn direction="right" delay={0.1}>
              <div className="bg-[#0F2847] border border-[#1E3A5F] rounded-2xl p-8 h-full">
                <XCircle className="w-10 h-10 text-slate-600 mb-6" />
                <h3 className="text-2xl text-slate-500 font-bold mb-6">No es para quienes:</h3>
                <div className="space-y-3">
                  {["Buscan inversiones rápidas sin análisis", "No tienen capital disponible para invertir", "No valoran el proceso de due diligence"].map((item, i) => (
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
            <div className="bg-[#091A30] border border-blue-500/15 rounded-3xl p-10 md:p-14 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
              <div className="grid md:grid-cols-2 gap-10 items-center">
                <div>
                  <SectionLabel light>Estructura</SectionLabel>
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                    Antes de invertir, necesitas una{" "}
                    <span className="text-blue-400">estructura correcta</span>
                  </h2>
                  <p className="text-slate-400 leading-relaxed mb-8">
                    Una LLC bien estructurada protege tu capital, optimiza tu carga fiscal y te posiciona
                    correctamente ante el mercado estadounidense.
                  </p>
                  <a href="/estructura-de-inversion-en-usa">
                    <Button className="bg-primary hover:bg-blue-600 text-white rounded-full px-8 py-5 gap-2 font-semibold shadow-lg shadow-blue-600/20">
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
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-blue-500/5 border border-blue-500/10">
                      <item.icon className="w-5 h-5 flex-shrink-0 text-blue-400" />
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
                <Divider />
              </div>

              <Accordion type="single" collapsible className="space-y-4">
                {[
                  { q: "¿Cuál es el monto mínimo de inversión?", a: "El punto de entrada es $100,000 USD. Este monto permite acceder a oportunidades con estructura profesional completa — legal, fiscal y operativa. No es un monto arbitrario: es el nivel donde la diversificación internacional tiene sentido real." },
                  { q: "¿Las oportunidades están garantizadas?", a: "Ninguna inversión tiene garantía de retorno — y quien te diga lo contrario no es confiable. Lo que sí garantizamos es el proceso: cada oportunidad pasa por un filtro riguroso de análisis, estructura y viabilidad antes de ser presentada a la comunidad." },
                  { q: "¿Puedo invertir desde cualquier país?", a: "Sí. Nuestra comunidad incluye empresarios de México, Colombia, Chile, Argentina y otros países de América Latina. La estructura de LLC y la operación en Estados Unidos se puede gestionar de forma remota con el equipo correcto." },
                  { q: "¿Cómo se seleccionan las oportunidades?", a: "Cada oportunidad es evaluada por nuestro equipo multidisciplinario: análisis financiero, due diligence legal, viabilidad operativa y alineación con los perfiles de nuestros miembros. Solo el 20% de lo que evaluamos llega a ser presentado." },
                ].map((faq, i) => (
                  <AccordionItem key={i} value={`faq-${i}`} className="bg-[#0F2847] border border-[#1E3A5F] rounded-xl px-6">
                    <AccordionTrigger className="text-white text-left hover:no-underline py-5">{faq.q}</AccordionTrigger>
                    <AccordionContent className="text-slate-400 leading-relaxed pb-5">{faq.a}</AccordionContent>
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
      <section className="bg-[#091A30] py-28 md:py-36 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(37,99,235,0.5) 0%, transparent 65%)" }} />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

        <div className="container relative z-10">
          <FadeIn>
            <div className="max-w-2xl mx-auto text-center">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-blue-500/10 border border-blue-500/20">
                  <Star className="w-8 h-8 text-blue-400" />
                </div>
              </div>

              <h2 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight">
                Accede a oportunidades con criterio y estructura
              </h2>
              <p className="text-slate-400 text-lg mb-2">Las oportunidades no están abiertas a todos.</p>
              <p className="text-slate-600 text-sm mb-12">Pero pueden estar disponibles para el perfil correcto.</p>

              <div className="flex flex-wrap justify-center gap-4">
                <a href="/tu-ruta">
                  <Button className="bg-primary hover:bg-blue-600 text-white px-8 py-6 text-base gap-2 rounded-full font-bold shadow-2xl shadow-blue-600/30">
                    Evaluar mi perfil <ArrowRight className="w-4 h-4" />
                  </Button>
                </a>
                <a href="/membresia">
                  <Button variant="outline" className="border-slate-600 text-white hover:bg-white/10 px-8 py-6 text-base">
                    Conocer el Grupo Empresarial de Edmundo
                  </Button>
                </a>
                <Button
                  variant="outline"
                  onClick={() => openWhatsApp(WHATSAPP_PHONE, "Hola, me interesa conocer las oportunidades de inversión en Estados Unidos.")}
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
