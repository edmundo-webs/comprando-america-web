import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useInView } from "@/hooks/useInView";
import { openWhatsApp, WHATSAPP_PHONE } from "@/lib/whatsapp";
import { motion } from "framer-motion";
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
} from "lucide-react";

/* ─── Animated wrapper ─── */
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

/* ─── SEO Head ─── */
function SEOHead() {
  useEffect(() => {
    document.title =
      "Oportunidades de Inversión en Estados Unidos | Comprando América";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute(
        "content",
        "Accede a oportunidades de inversión filtradas y evaluadas en Estados Unidos. Inversión desde $100,000 USD con estructura profesional."
      );
    }
  }, []);
  return null;
}

/* ═══════════════════════════════════════════════════════ */

export default function Oportunidades() {
  const scrollToFilter = () => {
    document
      .getElementById("filtro")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <SEOHead />
      <Navbar />

      {/* ═══ 1. HERO ═══ */}
      <section className="relative isolate min-h-[85vh] flex items-center pt-20 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://lh3.googleusercontent.com/d/1uOK0Jci_KGtDiBIInQTZ846vel77scKF=w1920" alt="Presentación de oportunidades de inversión" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B1F3A]/90 via-[#0B1F3A]/80 to-[#0B1F3A]/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F3A] via-transparent to-[#0B1F3A]/30" />
        </div>

        <div className="container relative z-10">
          <FadeIn>
            <div className="max-w-3xl">
              <p className="text-primary text-sm font-semibold tracking-[0.25em] uppercase mb-6 font-mono">
                Acceso Privado
              </p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl text-white leading-tight mb-6">
                Accede a oportunidades de inversión en Estados Unidos que no
                están en el mercado abierto
              </h1>
              <p className="text-white/60 text-lg md:text-xl leading-relaxed mb-8 max-w-2xl">
                Comprando América conecta empresarios e inversionistas con
                oportunidades previamente evaluadas, presentadas en espacios
                privados.
              </p>

              <div className="flex flex-wrap gap-4 mb-10">
                <Button
                  onClick={scrollToFilter}
                  className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-base gap-2 shadow-lg shadow-blue-600/20"
                >
                  Ver oportunidades disponibles{" "}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex flex-wrap gap-6 text-white/50 text-sm">
                <span className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-primary" /> Oportunidades
                  filtradas
                </span>
                <span className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-primary" /> Acceso privado
                </span>
                <span className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" /> Empresarios e
                  inversionistas
                </span>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ 2. EL PROBLEMA ═══ */}
      <section className="section-darker py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="max-w-3xl mx-auto">
              <p className="text-primary text-sm font-semibold tracking-[0.25em] uppercase mb-4 font-mono">
                El Problema
              </p>
              <h2 className="text-3xl md:text-4xl text-white mb-6">
                El problema no es invertir en Estados Unidos…
                <br />
                <span className="text-primary">
                  Es no saber en qué invertir
                </span>
              </h2>
              <p className="text-white/60 text-lg leading-relaxed mb-8">
                Hoy existe demasiada información y demasiadas opciones. Pero
                pocas están realmente estructuradas para inversionistas. Muchos
                terminan:
              </p>
              <div className="space-y-4">
                {[
                  "Invirtiendo sin contexto ni análisis real",
                  "Confiando en intermediarios sin experiencia comprobada",
                  "Tomando decisiones sin red de respaldo profesional",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <p className="text-white/60">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ 3. EL CAMBIO ═══ */}
      <section className="section-dark py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl text-white mb-6">
                Las mejores oportunidades no se publican…
                <br />
                <span className="text-primary">
                  se comparten dentro de redes
                </span>
              </h2>
              <p className="text-white/60 text-lg leading-relaxed mb-10">
                Las oportunidades más interesantes rara vez están abiertas al
                público. Se encuentran dentro de:
              </p>
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  {
                    icon: Users,
                    title: "Comunidades",
                    desc: "Grupos cerrados de empresarios con experiencia real en el mercado.",
                  },
                  {
                    icon: TrendingUp,
                    title: "Redes empresariales",
                    desc: "Conexiones profesionales que generan acceso a oportunidades filtradas.",
                  },
                  {
                    icon: Lock,
                    title: "Círculos privados",
                    desc: "Espacios donde se analiza, discute y ejecuta con criterio.",
                  },
                ].map((item, i) => (
                  <FadeIn key={i} delay={i * 0.1}>
                    <div className="bg-[#132D50] border border-[#1E3A5F] rounded-xl p-6 h-full hover:border-blue-500/20 transition-all">
                      <item.icon className="w-8 h-8 text-primary mb-4" />
                      <h3 className="text-lg text-white mb-2">
                        {item.title}
                      </h3>
                      <p className="text-white/50 text-sm leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </FadeIn>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Photo break ── */}
      <section className="relative h-64 md:h-80 overflow-hidden">
        <img src="https://lh3.googleusercontent.com/d/1WzKjPerMTX-RlLsJWxLegBkpn4_Ademp=w1920" alt="Miembros votando en sesión de análisis" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F3A] via-[#0B1F3A]/30 to-[#0B1F3A]" />
      </section>

      {/* ═══ 4. DEAL DAY ═══ */}
      <section className="section-darker py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="text-center mb-12">
              <p className="text-primary text-sm font-semibold tracking-[0.25em] uppercase mb-4 font-mono">
                Cómo funciona
              </p>
              <h2 className="text-3xl md:text-4xl font-serif text-white">
                Así acceden los miembros a oportunidades
              </h2>
            </div>
          </FadeIn>

          <FadeIn>
            <div className="max-w-3xl mx-auto">
              {/* Deal Day Card — Premium exclusive feel */}
              <div className="relative group">
                {/* Glow effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-amber-500/20 to-primary/20 rounded-2xl blur-lg opacity-60 group-hover:opacity-100 transition-opacity" />

                <div className="relative bg-gradient-to-br from-[oklch(0.14_0.03_250)] to-[oklch(0.11_0.02_260)] border border-blue-500/30 rounded-2xl p-10 md:p-14">
                  {/* Badge */}
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-primary text-xs font-semibold tracking-wider uppercase mb-8">
                    <Calendar className="w-3.5 h-3.5" />
                    Sesión mensual exclusiva
                  </div>

                  <h3 className="text-3xl md:text-4xl text-white mb-4">
                    Deal Day
                  </h3>
                  <p className="text-white/60 text-lg leading-relaxed mb-8 max-w-xl">
                    Cada mes presentamos oportunidades de inversión en sesiones
                    privadas exclusivas para miembros de Comprando América.
                  </p>

                  <div className="space-y-4">
                    {[
                      "Se presentan oportunidades previamente filtradas y evaluadas",
                      "Se analiza la estructura legal, fiscal y operativa de cada deal",
                      "Se discuten escenarios, riesgos y potencial de retorno",
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <p className="text-white/60">{item}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-10 pt-8 border-t border-[#1E3A5F]">
                    <p className="text-white/50 text-sm italic">
                      El acceso a Deal Day es exclusivo para miembros activos de
                      la comunidad.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ 5. FILTRO ═══ */}
      <section id="filtro" className="section-dark py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="max-w-3xl mx-auto">
              <p className="text-primary text-sm font-semibold tracking-[0.25em] uppercase mb-4 font-mono">
                Criterio de Acceso
              </p>
              <h2 className="text-3xl md:text-4xl text-white mb-6">
                No todas las personas pueden participar
              </h2>
              <p className="text-white/60 text-lg leading-relaxed mb-10">
                El acceso a oportunidades no depende solo del capital. Depende
                del perfil.
              </p>

              <div className="space-y-4 mb-10">
                {[
                  "Inversión desde $100,000 USD o más",
                  "Perfil empresarial o de inversionista activo",
                  "Alineación con el tipo de oportunidad presentada",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <p className="text-white/60 text-lg">{item}</p>
                  </div>
                ))}
              </div>

              <div className="bg-[#0F2847] border border-[#1E3A5F] rounded-xl p-8">
                <p className="text-white/80 text-lg font-serif leading-relaxed">
                  Incluso si alguien tiene el capital,{" "}
                  <span className="text-primary font-semibold">
                    si no cumple el perfil, no participa.
                  </span>
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ 6. OPORTUNIDADES DISPONIBLES ═══ */}
      <section className="section-darker py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="text-center mb-12">
              <p className="text-primary text-sm font-semibold tracking-[0.25em] uppercase mb-4 font-mono">
                Oportunidades
              </p>
              <h2 className="text-3xl md:text-4xl font-serif text-white">
                Oportunidades activas actualmente
              </h2>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Card 1 — Active */}
            <FadeIn>
              <div className="relative bg-[#0F2847] border border-blue-500/20 rounded-2xl p-8 h-full group hover:border-primary/40 transition-all">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-primary text-xs font-semibold uppercase tracking-wider mb-6">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  Activa
                </div>

                <Building2 className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-2xl text-white mb-4">
                  Fondo de bienes raíces en Estados Unidos
                </h3>

                <div className="space-y-3 mb-8">
                  {[
                    "Inversión desde $100,000 USD",
                    "Estructura profesional completa",
                    "Enfoque patrimonial a largo plazo",
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <p className="text-white/60 text-sm">{item}</p>
                    </div>
                  ))}
                </div>

                <a href="/bienes-raices-en-usa">
                  <Button className="bg-primary hover:bg-primary/90 text-white gap-2 w-full">
                    Ver detalles <ArrowRight className="w-4 h-4" />
                  </Button>
                </a>
              </div>
            </FadeIn>

            {/* Card 2 — Coming Soon */}
            <FadeIn delay={0.1}>
              <div className="relative bg-[oklch(0.13_0.02_250)] border border-[#1E3A5F] rounded-2xl p-8 h-full opacity-80">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0F2847]/5 text-white/50 text-xs font-semibold uppercase tracking-wider mb-6">
                  <span className="w-2 h-2 rounded-full bg-[#0F2847]/30" />
                  Próximamente
                </div>

                <TrendingUp className="w-10 h-10 text-white/40 mb-4" />
                <h3 className="text-2xl font-serif text-white/50 mb-4">
                  Growth Partner
                </h3>

                <p className="text-white/50 text-sm leading-relaxed mb-8">
                  Oportunidad en preparación. Acceso exclusivo para miembros
                  activos de la comunidad.
                </p>

                <Button
                  disabled
                  className="w-full opacity-50 cursor-not-allowed"
                >
                  En desarrollo
                </Button>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ═══ 7. FILOSOFÍA ═══ */}
      <section className="section-dark py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl text-white mb-6">
                No se trata de cantidad de oportunidades…
                <br />
                <span className="text-primary">
                  Se trata de calidad y criterio
                </span>
              </h2>
              <p className="text-white/60 text-lg leading-relaxed">
                En Comprando América no presentamos todo lo que vemos. Filtramos
                oportunidades y priorizamos estructura. Solo lo que cumple con
                nuestros estándares llega a la comunidad.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Photo break ── */}
      <section className="relative h-64 md:h-80 overflow-hidden">
        <img src="https://lh3.googleusercontent.com/d/12leYCR8tlXXxZ6jeBlgthhmUqcyEmtoz=w1920" alt="Panel de expertos Comprando América" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F3A] via-[#0B1F3A]/30 to-[#0B1F3A]" />
      </section>

      {/* ═══ 8. CONEXIÓN CON MEMBRESÍA ═══ */}
      <section className="section-darker py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="max-w-3xl mx-auto text-center">
              <p className="text-primary text-sm font-semibold tracking-[0.25em] uppercase mb-4 font-mono">
                Membresía
              </p>
              <h2 className="text-3xl md:text-4xl text-white mb-6">
                La mayoría de las oportunidades se presentan dentro de la
                membresía
              </h2>
              <p className="text-white/60 text-lg leading-relaxed mb-10">
                La comunidad es el espacio donde se presentan oportunidades, se
                discuten con expertos y se toman decisiones con respaldo
                profesional.
              </p>
              <a href="/membresia">
                <Button className="bg-primary hover:bg-primary/90 text-white px-10 py-6 text-base gap-2 shadow-lg shadow-blue-600/20">
                  Conocer la membresía <ArrowRight className="w-4 h-4" />
                </Button>
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ 9–10. PARA QUIÉN ES / NO ES ═══ */}
      <section className="section-dark py-20 md:py-28">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Para quién es */}
            <FadeIn>
              <div className="bg-[#132D50] border border-blue-500/20 rounded-xl p-8 h-full">
                <Eye className="w-8 h-8 text-primary mb-4" />
                <h3 className="text-2xl text-white mb-6">
                  Estas oportunidades están diseñadas para:
                </h3>
                <div className="space-y-3">
                  {[
                    "Empresarios con operaciones activas",
                    "Inversionistas con capital disponible",
                    "Perfiles con visión patrimonial a largo plazo",
                    "Personas con criterio y capacidad de decisión",
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <p className="text-white/60 text-sm">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>

            {/* Para quién NO es */}
            <FadeIn delay={0.1}>
              <div className="bg-[oklch(0.12_0.02_250)] border border-[#1E3A5F] rounded-xl p-8 h-full">
                <XCircle className="w-8 h-8 text-white/40 mb-4" />
                <h3 className="text-2xl font-serif text-white/60 mb-6">
                  No es para quienes:
                </h3>
                <div className="space-y-3">
                  {[
                    "Buscan inversiones rápidas sin análisis",
                    "No tienen capital disponible para invertir",
                    "No valoran el análisis estratégico previo",
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <XCircle className="w-4 h-4 text-red-400/60 flex-shrink-0 mt-0.5" />
                      <p className="text-white/50 text-sm">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ═══ 11. CTA INTERMEDIO ═══ */}
      <section className="section-darker py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl text-white mb-8">
                ¿Tu perfil puede encajar en este tipo de oportunidades?
              </h2>
              <div className="flex flex-wrap justify-center gap-4">
                <a href="/perfil">
                  <Button className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-base gap-2 shadow-lg shadow-blue-600/20">
                    Evaluar mi perfil <ArrowRight className="w-4 h-4" />
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
                  className="border-[#2A4A6B] text-white hover:bg-[#1E3A5F] px-8 py-6 text-base gap-2"
                >
                  <MessageSquare className="w-4 h-4" /> Hablar con un asesor
                </Button>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ 12. RELACIÓN CON ESTRUCTURA ═══ */}
      <section className="section-dark py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="max-w-3xl mx-auto text-center">
              <p className="text-primary text-sm font-semibold tracking-[0.25em] uppercase mb-4 font-mono">
                Estructura
              </p>
              <h2 className="text-3xl md:text-4xl text-white mb-6">
                Antes de invertir, necesitas una estructura correcta
              </h2>
              <p className="text-white/60 text-lg leading-relaxed mb-10">
                Una LLC bien estructurada protege tu capital, optimiza tu carga
                fiscal y te posiciona correctamente ante el mercado
                estadounidense.
              </p>
              <a href="/llc">
                <Button className="bg-primary hover:bg-primary/90 text-white px-10 py-6 text-base gap-2 shadow-lg shadow-blue-600/20">
                  Estructurar mi empresa <ArrowRight className="w-4 h-4" />
                </Button>
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ 13. FAQ ═══ */}
      <section className="section-darker py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-serif text-white text-center mb-12">
                Preguntas frecuentes
              </h2>
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
                    className="bg-[#132D50] border border-[#1E3A5F] rounded-xl px-6"
                  >
                    <AccordionTrigger className="text-white text-left hover:no-underline py-5">
                      {faq.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-white/60 leading-relaxed pb-5">
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ 14. CTA FINAL ═══ */}
      <section className="section-dark py-24 md:py-32">
        <div className="container">
          <FadeIn>
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl text-white mb-6">
                Accede a oportunidades con criterio y estructura
              </h2>
              <p className="text-white/60 text-lg leading-relaxed mb-4">
                Las oportunidades no están abiertas a todos.
              </p>
              <p className="text-white/50 text-sm mb-10">
                Pero pueden estar disponibles para el perfil correcto.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a href="/perfil">
                  <Button className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-base gap-2 shadow-lg shadow-blue-600/20">
                    Evaluar mi perfil <ArrowRight className="w-4 h-4" />
                  </Button>
                </a>
                <a href="/membresia">
                  <Button
                    variant="outline"
                    className="border-[#2A4A6B] text-white hover:bg-[#1E3A5F] px-8 py-6 text-base gap-2"
                  >
                    Conocer membresía
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
                  className="border-[#2A4A6B] text-white hover:bg-[#1E3A5F] px-8 py-6 text-base gap-2"
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
