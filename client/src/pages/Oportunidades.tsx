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

/* ─── FadeIn ─── */
function FadeIn({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const { ref, isInView } = useInView();
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay, ease: "easeOut" }} className={className}>
      {children}
    </motion.div>
  );
}

/* ─── SEO ─── */
function SEOHead() {
  useEffect(() => {
    document.title = "Oportunidades de Inversión en Estados Unidos | Comprando América";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "Accede a oportunidades de inversión filtradas y evaluadas en Estados Unidos. Inversión desde $100,000 USD con estructura profesional.");
  }, []);
  return null;
}

/* ─── Photos ─── */
const HERO_IMAGE = "https://lh3.googleusercontent.com/d/1uOK0Jci_KGtDiBIInQTZ846vel77scKF=w1920"; // dual presenters
const VOTING_IMAGE = "https://lh3.googleusercontent.com/d/1WzKjPerMTX-RlLsJWxLegBkpn4_Ademp=w1920"; // hands raised
const PANEL_IMAGE = "https://lh3.googleusercontent.com/d/12leYCR8tlXXxZ6jeBlgthhmUqcyEmtoz=w1920"; // expert panel

export default function Oportunidades() {
  const scrollToFilter = () => {
    document.getElementById("filtro")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-[#0B1F3A] text-white overflow-x-hidden">
      <SEOHead />
      <Navbar />

      {/* ═══ 1. HERO ═══ */}
      <section className="relative min-h-[85vh] flex items-center pt-20 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <img src={HERO_IMAGE} alt="Presentación de oportunidades de inversión" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B1F3A]/95 via-[#0B1F3A]/80 to-[#0B1F3A]/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F3A] via-transparent to-[#0B1F3A]/30" />
        </div>

        <div className="container relative z-10">
          <FadeIn>
            <div className="max-w-3xl">
              <p className="text-blue-400 text-sm font-semibold tracking-[0.25em] uppercase mb-6 font-mono">Acceso Privado</p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl text-white leading-tight mb-6">
                Accede a oportunidades de inversión en Estados Unidos que no están en el mercado abierto
              </h1>
              <p className="text-slate-400 text-lg md:text-xl leading-relaxed mb-8 max-w-2xl">
                Comprando América conecta empresarios e inversionistas con oportunidades previamente evaluadas, presentadas en espacios privados.
              </p>

              <div className="flex flex-wrap gap-4 mb-10">
                <Button onClick={scrollToFilter} className="bg-primary hover:bg-blue-600 text-white px-8 py-6 text-base gap-2 shadow-lg shadow-blue-600/25">
                  Ver oportunidades disponibles <ArrowRight className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex flex-wrap gap-6 text-slate-500 text-sm">
                <span className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-primary" /> Oportunidades filtradas</span>
                <span className="flex items-center gap-2"><Lock className="w-4 h-4 text-primary" /> Acceso privado</span>
                <span className="flex items-center gap-2"><Users className="w-4 h-4 text-primary" /> Empresarios e inversionistas</span>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ 2. EL PROBLEMA — ☀️ BLANCO ═══ */}
      <section className="bg-[#F5F7FA] py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="max-w-3xl mx-auto">
              <p className="text-primary text-sm font-semibold tracking-[0.25em] uppercase mb-4 font-mono">El Problema</p>
              <h2 className="text-3xl md:text-4xl text-[#0B1F3A] mb-6">
                El problema no es invertir en Estados Unidos… <span className="text-primary">Es no saber en qué invertir</span>
              </h2>
              <p className="text-[#4B5563] text-lg leading-relaxed mb-8">
                Hoy existe demasiada información y demasiadas opciones. Pero pocas están realmente estructuradas para inversionistas. Muchos terminan:
              </p>
              <div className="space-y-4">
                {[
                  "Invirtiendo sin contexto ni análisis real",
                  "Confiando en intermediarios sin experiencia comprobada",
                  "Tomando decisiones sin red de respaldo profesional",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-[#4B5563]">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ 3. EL CAMBIO — navy ═══ */}
      <section className="bg-[#0E2544] py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl text-white mb-4">
                Las mejores oportunidades no se publican… <span className="text-primary">se comparten dentro de redes</span>
              </h2>
              <p className="text-slate-400 text-lg leading-relaxed max-w-2xl mx-auto">
                Las oportunidades más interesantes rara vez están abiertas al público. Se encuentran dentro de:
              </p>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { icon: Users, title: "Comunidades", desc: "Grupos cerrados de empresarios con experiencia real en el mercado." },
              { icon: TrendingUp, title: "Redes empresariales", desc: "Conexiones profesionales que generan acceso a oportunidades filtradas." },
              { icon: Lock, title: "Círculos privados", desc: "Espacios donde se analiza, discute y ejecuta con criterio." },
            ].map((item, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="bg-[#132D50] border border-[#1E3A5F] rounded-xl p-6 h-full hover:border-blue-500/30 transition-all">
                  <item.icon className="w-8 h-8 text-blue-400 mb-4" />
                  <h3 className="text-lg text-white font-semibold mb-2">{item.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Photo break — voting ── */}
      <section className="relative h-64 md:h-80 overflow-hidden">
        <img src={VOTING_IMAGE} alt="Miembros votando en sesión de análisis" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#F5F7FA] via-transparent to-[#0E2544]" />
      </section>

      {/* ═══ 4. DEAL DAY — ☀️ BLANCO ═══ */}
      <section className="bg-[#F5F7FA] py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="text-center mb-12">
              <p className="text-primary text-sm font-semibold tracking-[0.25em] uppercase mb-4 font-mono">Cómo Funciona</p>
              <h2 className="text-3xl md:text-4xl text-[#0B1F3A]">Así acceden los miembros a oportunidades</h2>
            </div>
          </FadeIn>

          <FadeIn>
            <div className="max-w-3xl mx-auto">
              {/* Deal Day Card — premium */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-amber-500/15 to-primary/20 rounded-2xl blur-lg opacity-60 group-hover:opacity-100 transition-opacity" />
                <div className="relative bg-[#0B1F3A] border border-blue-500/30 rounded-2xl p-10 md:p-14">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-primary text-xs font-semibold tracking-wider uppercase mb-8">
                    <Calendar className="w-3.5 h-3.5" /> Sesión mensual exclusiva
                  </div>

                  <h3 className="text-3xl md:text-4xl text-white mb-4">Deal Day</h3>
                  <p className="text-slate-400 text-lg leading-relaxed mb-8 max-w-xl">
                    Cada mes presentamos oportunidades de inversión en sesiones privadas exclusivas para miembros de Comprando América.
                  </p>

                  <div className="space-y-4">
                    {[
                      "Se presentan oportunidades previamente filtradas y evaluadas",
                      "Se analiza la estructura legal, fiscal y operativa de cada deal",
                      "Se discuten escenarios, riesgos y potencial de retorno",
                    ].map((item, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                        <p className="text-slate-300">{item}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-10 pt-8 border-t border-[#1E3A5F]">
                    <p className="text-slate-500 text-sm italic">El acceso a Deal Day es exclusivo para miembros activos de la comunidad.</p>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ 5. FILTRO — navy ═══ */}
      <section id="filtro" className="bg-[#0E2544] py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="max-w-3xl mx-auto">
              <p className="text-blue-400 text-sm font-semibold tracking-[0.25em] uppercase mb-4 font-mono">Criterio de Acceso</p>
              <h2 className="text-3xl md:text-4xl text-white mb-6">No todas las personas pueden participar</h2>
              <p className="text-slate-400 text-lg leading-relaxed mb-10">
                El acceso a oportunidades no depende solo del capital. Depende del perfil.
              </p>

              <div className="space-y-4 mb-10">
                {[
                  "Inversión desde $100,000 USD o más",
                  "Perfil empresarial o de inversionista activo",
                  "Alineación con el tipo de oportunidad presentada",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <p className="text-slate-300 text-lg">{item}</p>
                  </div>
                ))}
              </div>

              <div className="bg-[#132D50] border border-blue-500/20 rounded-xl p-8">
                <p className="text-white text-lg leading-relaxed">
                  Incluso si alguien tiene el capital, <span className="text-primary font-semibold">si no cumple el perfil, no participa.</span>
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ 6. OPORTUNIDADES — ☀️ BLANCO ═══ */}
      <section className="bg-white py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="text-center mb-12">
              <p className="text-primary text-sm font-semibold tracking-[0.25em] uppercase mb-4 font-mono">Oportunidades</p>
              <h2 className="text-3xl md:text-4xl text-[#0B1F3A]">Oportunidades activas actualmente</h2>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Card 1 — Active */}
            <FadeIn>
              <div className="relative bg-[#0B1F3A] border border-[#1E3A5F] rounded-2xl p-8 h-full group hover:border-primary/40 transition-all">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-primary text-xs font-semibold uppercase tracking-wider mb-6">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" /> Activa
                </div>
                <Building2 className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-2xl text-white font-semibold mb-4">Fondo de bienes raíces en Estados Unidos</h3>
                <div className="space-y-3 mb-8">
                  {["Inversión desde $100,000 USD", "Estructura profesional completa", "Enfoque patrimonial a largo plazo"].map((item, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                      <p className="text-slate-400 text-sm">{item}</p>
                    </div>
                  ))}
                </div>
                <a href="/bienes-raices-en-usa">
                  <Button className="bg-primary hover:bg-blue-600 text-white gap-2 w-full">Ver detalles <ArrowRight className="w-4 h-4" /></Button>
                </a>
              </div>
            </FadeIn>

            {/* Card 2 — Inversión + Ruta migratoria */}
            <FadeIn delay={0.1}>
              <div className="relative bg-[#0B1F3A] border border-[#1E3A5F] rounded-2xl p-8 h-full group hover:border-primary/40 transition-all">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-primary text-xs font-semibold uppercase tracking-wider mb-6">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" /> Activa
                </div>
                <TrendingUp className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-2xl text-white font-semibold mb-4">Inversión + Ruta migratoria</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-8">
                  Tienes $300,000 dólares y quieres migrar a Estados Unidos.
                </p>
                <Button onClick={() => openWhatsApp(WHATSAPP_PHONE, "Hola, me interesa el modelo de Inversión + Ruta migratoria.")} className="bg-primary hover:bg-blue-600 text-white gap-2 w-full">
                  Evaluar si este modelo encaja contigo <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ═══ 7. FILOSOFÍA — navy ═══ */}
      <section className="bg-[#0B1F3A] py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl text-white mb-6">
                No se trata de cantidad de oportunidades… <span className="text-primary">Se trata de calidad y criterio</span>
              </h2>
              <p className="text-slate-400 text-lg leading-relaxed">
                En Comprando América no presentamos todo lo que vemos. Filtramos oportunidades y priorizamos estructura. Solo lo que cumple con nuestros estándares llega a la comunidad.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Photo break — panel ── */}
      <section className="relative h-64 md:h-80 overflow-hidden">
        <img src={PANEL_IMAGE} alt="Panel de expertos Comprando América" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#F5F7FA] via-transparent to-[#0B1F3A]/60" />
      </section>

      {/* ═══ 8. MEMBRESÍA — ☀️ BLANCO ═══ */}
      <section className="bg-[#F5F7FA] py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="max-w-3xl mx-auto text-center">
              <p className="text-primary text-sm font-semibold tracking-[0.25em] uppercase mb-4 font-mono">Club de Inversión</p>
              <h2 className="text-3xl md:text-4xl text-[#0B1F3A] mb-6">
                La mayoría de las oportunidades se presentan dentro de el club de inversión
              </h2>
              <p className="text-[#4B5563] text-lg leading-relaxed mb-10">
                La comunidad es el espacio donde se presentan oportunidades, se discuten con expertos y se toman decisiones con respaldo profesional.
              </p>
              <a href="/membresia">
                <Button className="bg-primary hover:bg-blue-600 text-white px-10 py-6 text-base gap-2 shadow-lg shadow-blue-600/20">
                  Conocer el club de inversión <ArrowRight className="w-4 h-4" />
                </Button>
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ 9. PARA QUIÉN ES / NO ES — navy ═══ */}
      <section className="bg-[#0E2544] py-20 md:py-28">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <FadeIn>
              <div className="bg-[#132D50] border border-blue-500/20 rounded-xl p-8 h-full">
                <Eye className="w-8 h-8 text-primary mb-4" />
                <h3 className="text-2xl text-white font-semibold mb-6">Estas oportunidades están diseñadas para:</h3>
                <div className="space-y-3">
                  {["Empresarios con operaciones activas", "Inversionistas con capital disponible", "Perfiles con visión patrimonial a largo plazo", "Personas con criterio y capacidad de decisión"].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                      <p className="text-slate-300 text-sm">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
            <FadeIn delay={0.1}>
              <div className="bg-[#0F2847] border border-[#1E3A5F] rounded-xl p-8 h-full">
                <XCircle className="w-8 h-8 text-slate-500 mb-4" />
                <h3 className="text-2xl text-slate-400 font-semibold mb-6">No es para quienes:</h3>
                <div className="space-y-3">
                  {["Buscan inversiones rápidas sin análisis", "No tienen capital disponible para invertir", "No valoran el análisis estratégico previo"].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <XCircle className="w-4 h-4 text-red-400/60 flex-shrink-0 mt-0.5" />
                      <p className="text-slate-500 text-sm">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ═══ 10. ESTRUCTURA — ☀️ BLANCO ═══ */}
      <section className="bg-white py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="max-w-3xl mx-auto text-center">
              <p className="text-primary text-sm font-semibold tracking-[0.25em] uppercase mb-4 font-mono">Estructura</p>
              <h2 className="text-3xl md:text-4xl text-[#0B1F3A] mb-6">
                Antes de invertir, necesitas una estructura correcta
              </h2>
              <p className="text-[#4B5563] text-lg leading-relaxed mb-10">
                Una LLC bien estructurada protege tu capital, optimiza tu carga fiscal y te posiciona correctamente ante el mercado estadounidense.
              </p>
              <a href="/estructura-de-inversion-en-usa">
                <Button className="bg-[#0B1F3A] hover:bg-[#0E2544] text-white px-10 py-6 text-base gap-2">
                  Estructurar mi empresa <ArrowRight className="w-4 h-4" />
                </Button>
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ 11. FAQ — navy ═══ */}
      <section className="bg-[#0B1F3A] py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl text-white text-center mb-12">Preguntas frecuentes</h2>
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

      {/* ═══ 12. CTA FINAL — deep navy ═══ */}
      <section className="bg-[#091A30] py-24 md:py-32">
        <div className="container">
          <FadeIn>
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl text-white mb-4">
                Accede a oportunidades con criterio y estructura
              </h2>
              <p className="text-slate-400 mb-2">Las oportunidades no están abiertas a todos.</p>
              <p className="text-slate-500 text-sm mb-10">Pero pueden estar disponibles para el perfil correcto.</p>
              <div className="flex flex-wrap justify-center gap-4">
                <a href="/perfil">
                  <Button className="bg-primary hover:bg-blue-600 text-white px-8 py-6 text-base gap-2 shadow-lg shadow-blue-600/25">
                    Evaluar mi perfil <ArrowRight className="w-4 h-4" />
                  </Button>
                </a>
                <a href="/membresia">
                  <Button variant="outline" className="border-slate-600 text-white hover:bg-white/10 px-8 py-6 text-base">
                    Conocer el club de inversión
                  </Button>
                </a>
                <Button variant="outline" onClick={() => openWhatsApp(WHATSAPP_PHONE, "Hola, me interesa conocer las oportunidades de inversión en Estados Unidos.")} className="border-slate-600 text-white hover:bg-white/10 px-8 py-6 text-base gap-2">
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
