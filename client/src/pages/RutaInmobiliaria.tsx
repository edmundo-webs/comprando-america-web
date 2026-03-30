import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useInView } from "@/hooks/useInView";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  MapPin,
  Calendar,
  Clock,
  Users,
  CheckCircle2,
  ArrowRight,
  Shield,
  Lock,
  Eye,
  Scale,
  Handshake,
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
import SEOHead from "@/components/SEOHead";
const PAGE_SEO = {
  title: "Ruta Inmobiliaria en Estados Unidos | Comprando Am\u00e9rica",
  description: "Sala privada presencial para empresarios e inversionistas. Oportunidades reales de inversi\u00f3n inmobiliaria. Monterrey, 18 de abril 2026.",
  path: "/ruta-inmobiliaria-en-estados-unidos",
};

/* ─── Constants ─── */
const CLOVER_URL = "https://link.clover.com/urlshortener/Pk8sN9";

function trackEvent(eventName: string) {
  try {
    if (typeof window !== "undefined") {
      if ((window as any).fbq) (window as any).fbq("track", eventName);
      if ((window as any).dataLayer) (window as any).dataLayer.push({ event: eventName });
    }
  } catch { /* silent */ }
}

/* ─── Photos ─── */
const AUDIENCE = "https://lh3.googleusercontent.com/d/1gnZX2RiYD4M29nQmqwcsN0k13db74LmV=w1920";
const EDMUNDO = "https://res.cloudinary.com/dofccqypz/image/upload/v1774380282/comprando-america/edmundo-trevino-professional.jpg";
const WORKSHOP = "https://lh3.googleusercontent.com/d/1mQWgGjGOCgTU8BsOl3Rgdh5mGR3eObRd=w1200";

/* ─── Agenda ─── */
const agendaMorning = [
  { title: "Dónde está el dinero hoy", desc: "Mapa de oportunidades por zona y motor de demanda en el mercado inmobiliario estadounidense." },
  { title: "Cómo invertir desde Latinoamérica", desc: "Estructura legal/bancaria, compliance y errores caros que debes evitar." },
  { title: "Impuestos y estrategia patrimonial", desc: "Principios para reinvertir y escalar sin perder control de tu patrimonio." },
  { title: "Checklist de decisión", desc: "Preguntas clave antes de firmar o transferir capital." },
];
const agendaAfternoon = [
  { title: "Fondo de Tierra Estratégica", desc: "Oportunidad en Florida y Arizona con enfoque patrimonial de largo plazo." },
  { title: "Single Family Homes", desc: "Modelo pasivo de renta y resguardo de valor en New York." },
  { title: "Perfil ideal y riesgos", desc: "Análisis de qué oportunidad se ajusta mejor a tu perfil y estrategia de salida." },
  { title: "Siguientes pasos", desc: "Sesión 1:1 para dudas puntuales y cierre dirigido." },
];

export default function RutaInmobiliaria() {
  useEffect(() => { trackEvent("ViewContent"); }, []);

  return (
    <div className="min-h-screen bg-[#0B1F3A] text-white overflow-x-hidden">
      <SEOHead {...PAGE_SEO} />
      <Navbar />

      {/* ═══ 1. HERO — video bg ═══ */}
      <section className="relative min-h-[85vh] flex items-center pt-20 pb-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <video autoPlay muted loop playsInline preload="auto" className="h-full w-full object-cover">
            <source src="https://res.cloudinary.com/dgruohz6f/video/upload/v1773439272/comprando-america/gyTEyuXRYfIMlAUS.mov" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B1F3A]/95 via-[#0B1F3A]/85 to-[#0B1F3A]/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F3A] via-transparent to-[#0B1F3A]/30" />
        </div>

        <div className="container relative z-10">
          <FadeIn>
            <div className="max-w-3xl">
              <p className="text-blue-400 text-sm font-semibold tracking-[0.25em] uppercase mb-6 font-mono">
                Sala Privada · Presencial · Cupo Limitado
              </p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl text-white leading-tight mb-6">
                Accede a oportunidades reales de inversión en{" "}
                <span className="gradient-text-primary">Estados Unidos</span> en una sala privada de empresarios
              </h1>
              <p className="text-slate-400 text-lg md:text-xl leading-relaxed mb-10 max-w-2xl">
                Participa en la Ruta Inmobiliaria y conoce cómo empresarios están invirtiendo con estructura, estrategia y acompañamiento.
              </p>

              <div className="flex flex-wrap gap-3 text-slate-400 text-sm mb-8">
                <span className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10">
                  <Calendar className="w-4 h-4 text-primary" /> 18 de abril 2026
                </span>
                <span className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10">
                  <MapPin className="w-4 h-4 text-primary" /> San Pedro, Nuevo León
                </span>
                <span className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10">
                  <Users className="w-4 h-4 text-primary" /> 25 lugares
                </span>
              </div>

              <a href="/perfil">
                <Button className="bg-primary hover:bg-blue-600 text-white px-8 py-6 text-base gap-2 shadow-lg shadow-blue-600/25">
                  Evaluar mi perfil para asistir <ArrowRight className="w-4 h-4" />
                </Button>
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ 2. VIDEO VSL — ☀️ BLANCO ═══ */}
      <section className="bg-[#F5F7FA] py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl text-[#0B1F3A] mb-10">Antes de invertir en Estados Unidos, necesitas ver esto</h2>
              <div className="relative w-full max-w-md mx-auto aspect-[9/16] rounded-2xl overflow-hidden shadow-lg border border-gray-200">
                <iframe
                  src="https://www.youtube.com/embed/qTnLtfwUiOg"
                  title="Ruta Inmobiliaria – Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                />
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ 3. QUÉ ES — navy ═══ */}
      <section className="bg-[#0E2544] py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl text-white mb-6">
                No es un evento. <span className="text-primary">Es una sala privada de decisiones.</span>
              </h2>
              <p className="text-slate-400 text-lg leading-relaxed mb-8">Aquí no vienes a escuchar teoría. Vienes a:</p>
              <div className="space-y-4">
                {["Entender cómo funciona la inversión inmobiliaria en EE.UU.", "Ver oportunidades reales con estructura y análisis", "Conocer a quienes ya están invirtiendo"].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <p className="text-slate-300 text-lg">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ 4. QUÉ SUCEDE — ☀️ BLANCO ═══ */}
      <section className="bg-white py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl text-[#0B1F3A] mb-12 text-center">Lo que sucede dentro de la sala</h2>
          </FadeIn>
          <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              { icon: Eye, text: "Presentación de oportunidades reales" },
              { icon: Scale, text: "Explicación del modelo de inversión" },
              { icon: Shield, text: "Estructura legal y fiscal" },
              { icon: Handshake, text: "Networking con empresarios" },
            ].map((item, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="flex items-start gap-4 bg-[#F5F7FA] border border-gray-200 rounded-xl p-6 hover:shadow-md transition-all">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 text-primary flex items-center justify-center shrink-0">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <p className="text-[#0B1F3A] text-lg font-medium">{item.text}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 5. OBJECIONES — navy ═══ */}
      <section className="bg-[#0B1F3A] py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl text-white mb-12 text-center">Si tienes dudas, es completamente normal</h2>
          </FadeIn>
          <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { q: "¿Esto es fraude?", a: "No. Conocerás en persona a operadores y estructura.", icon: Shield },
              { q: "¿Estoy obligado a invertir?", a: "No. Solo obtienes claridad.", icon: Lock },
              { q: "¿Y si no me gusta?", a: "Te llevas conocimiento valioso.", icon: Eye },
            ].map((obj, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="bg-[#0F2847] border border-[#1E3A5F] rounded-xl p-8 text-center h-full">
                  <div className="w-12 h-12 rounded-full bg-blue-500/10 text-primary flex items-center justify-center mx-auto mb-5">
                    <obj.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-white font-semibold mb-3">{obj.q}</h3>
                  <p className="text-slate-400">{obj.a}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Photo break — workshop ── */}
      <section className="relative h-64 md:h-80 overflow-hidden">
        <img src={WORKSHOP} alt="Taller de inversión" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#F5F7FA] via-transparent to-[#0B1F3A]/60" />
      </section>

      {/* ═══ 6. EDMUNDO — ☀️ BLANCO ═══ */}
      <section className="bg-[#F5F7FA] py-20 md:py-28">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            <FadeIn>
              <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-200">
                <img src={EDMUNDO} alt="Edmundo Treviño" className="w-full h-[400px] object-cover" />
              </div>
            </FadeIn>
            <FadeIn delay={0.1}>
              <div>
                <h2 className="text-3xl md:text-4xl text-[#0B1F3A] mb-6">Aprende de quien ya se equivocó para que tú no tengas que hacerlo</h2>
                <div className="space-y-4">
                  {["+20 años operando entre México y Estados Unidos", "Experiencia real en inversión", "Renovación de visas E2", "Aprendizaje basado en errores reales"].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <p className="text-[#4B5563] text-lg">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ═══ 7. EXCLUSIVIDAD — navy ═══ */}
      <section className="bg-[#0E2544] py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl text-white mb-6">Un espacio pensado para quienes ya están en etapa de decisión</h2>
              <p className="text-slate-400 text-lg leading-relaxed mb-10">
                La Ruta Inmobiliaria está diseñada para un grupo reducido de personas que buscan claridad, contexto y acceso a oportunidades reales.
              </p>

              <div className="grid sm:grid-cols-3 gap-6 mb-12">
                {["Capital disponible", "Interés en oportunidades reales", "Búsqueda de decisiones informadas"].map((item, i) => (
                  <div key={i} className="bg-[#132D50] border border-[#1E3A5F] rounded-xl p-6">
                    <CheckCircle2 className="w-6 h-6 text-blue-400 mx-auto mb-3" />
                    <p className="text-slate-300">{item}</p>
                  </div>
                ))}
              </div>

              <div className="bg-[#132D50] border border-blue-500/20 rounded-2xl p-8 inline-block">
                <Users className="w-8 h-8 text-primary mx-auto mb-4" />
                <p className="text-white text-lg font-semibold">La sala está limitada a 25 asistentes</p>
                <p className="text-slate-500 text-sm mt-2">Para cuidar la calidad de la experiencia y el nivel de conversación.</p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ 8. DETALLES + AGENDA — ☀️ BLANCO ═══ */}
      <section className="bg-white py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="max-w-4xl mx-auto">
              <div className="grid sm:grid-cols-3 gap-6 mb-12">
                {[
                  { icon: Calendar, label: "Fecha", value: "18 de abril 2026" },
                  { icon: MapPin, label: "Ciudad", value: "San Pedro, Nuevo León" },
                  { icon: Clock, label: "Horario", value: "9:00 am – 6:00 pm" },
                ].map((item, i) => (
                  <div key={i} className="bg-[#0B1F3A] rounded-xl p-8 text-center">
                    <item.icon className="w-8 h-8 text-primary mx-auto mb-4" />
                    <p className="text-slate-500 text-sm mb-1">{item.label}</p>
                    <p className="text-white text-xl font-semibold">{item.value}</p>
                  </div>
                ))}
              </div>

              <Accordion type="single" collapsible>
                <AccordionItem value="programa" className="bg-[#F5F7FA] border border-gray-200 rounded-xl px-6">
                  <AccordionTrigger className="text-[#0B1F3A] hover:text-primary transition-colors py-6 text-lg font-semibold hover:no-underline">
                    Ver programa completo
                  </AccordionTrigger>
                  <AccordionContent className="pb-8">
                    <div className="grid md:grid-cols-2 gap-8">
                      <div>
                        <h4 className="text-[#0B1F3A] text-xl font-semibold mb-2">🕘 Mañana</h4>
                        <p className="text-[#6B7280] text-sm mb-6">Claridad y Estructura (Educación Estratégica)</p>
                        <div className="space-y-5">
                          {agendaMorning.map((item, i) => (
                            <div key={i} className="border-l-2 border-primary/30 pl-4">
                              <p className="text-[#0B1F3A] font-semibold mb-1">{item.title}</p>
                              <p className="text-[#6B7280] text-sm">{item.desc}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-[#0B1F3A] text-xl font-semibold mb-2">🕓 Tarde</h4>
                        <p className="text-[#6B7280] text-sm mb-6">Oportunidades y Decisiones (Presentación Real)</p>
                        <div className="space-y-5">
                          {agendaAfternoon.map((item, i) => (
                            <div key={i} className="border-l-2 border-primary/30 pl-4">
                              <p className="text-[#0B1F3A] font-semibold mb-1">{item.title}</p>
                              <p className="text-[#6B7280] text-sm">{item.desc}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Photo break — audience ── */}
      <section className="relative h-64 md:h-80 overflow-hidden">
        <img src={AUDIENCE} alt="Comunidad de inversionistas" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#091A30] via-transparent to-white/80" />
      </section>

      {/* ═══ 9. CTA FINAL — deep navy ═══ */}
      <section className="bg-[#091A30] py-24 md:py-32">
        <div className="container">
          <FadeIn>
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl text-white mb-4">¿Quieres asistir a la Ruta Inmobiliaria?</h2>
              <p className="text-slate-400 mb-2">El primer paso es evaluar tu perfil.</p>
              <p className="text-slate-500 text-sm mb-10">Los espacios son limitados y se asignan a perfiles que cumplen con el criterio de inversión.</p>

              <div className="flex flex-wrap justify-center gap-4">
                <a href="/perfil">
                  <Button className="bg-primary hover:bg-blue-600 text-white px-10 py-6 text-lg gap-2 shadow-lg shadow-blue-600/25">
                    Evaluar mi perfil <ArrowRight className="w-5 h-5" />
                  </Button>
                </a>
              </div>

              <div className="flex flex-wrap justify-center gap-6 mt-8 text-slate-500 text-sm">
                <span className="flex items-center gap-2"><Users className="w-4 h-4" /> Cupo limitado</span>
                <span className="flex items-center gap-2"><MapPin className="w-4 h-4" /> Evento presencial</span>
                <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Acceso a oportunidades reales</span>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      <Footer />
    </div>
  );
}
