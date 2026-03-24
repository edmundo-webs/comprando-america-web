import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "@/hooks/useInView";
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
  MessageCircle,
} from "lucide-react";

/* ── animation helper ── */
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

/* ── constants ── */
const CLOVER_URL = "https://link.clover.com/urlshortener/Pk8sN9";
const YOUTUBE_CHANNEL =
  "https://www.youtube.com/@edmundotrevinousa1708/videos";
const VSL_VIDEO = "https://youtube.com/shorts/qTnLtfwUiOg?si=u1vlUb2PgDNSieF7";

/* ── tracking helper (Meta Pixel / dataLayer) ── */
function trackEvent(eventName: string) {
  try {
    if (typeof window !== "undefined") {
      // Meta Pixel
      if ((window as any).fbq) {
        (window as any).fbq("track", eventName);
      }
      // GTM dataLayer
      if ((window as any).dataLayer) {
        (window as any).dataLayer.push({ event: eventName });
      }
    }
  } catch {
    /* silent */
  }
}

/* ── agenda data ── */
const agendaMorning = [
  {
    title: "Dónde está el dinero hoy",
    desc: "Mapa de oportunidades por zona y motor de demanda en el mercado inmobiliario estadounidense.",
  },
  {
    title: "Cómo invertir desde Latinoamérica",
    desc: "Estructura legal/bancaria, compliance y errores caros que debes evitar.",
  },
  {
    title: "Impuestos y estrategia patrimonial",
    desc: "Principios para reinvertir y escalar sin perder control de tu patrimonio.",
  },
  {
    title: "Checklist de decisión",
    desc: "Preguntas clave antes de firmar o transferir capital.",
  },
];

const agendaAfternoon = [
  {
    title: "Fondo de Tierra Estratégica",
    desc: "Oportunidad en Florida y Arizona con enfoque patrimonial de largo plazo.",
  },
  {
    title: "Single Family Homes",
    desc: "Modelo pasivo de renta y resguardo de valor en New York.",
  },
  {
    title: "Perfil ideal y riesgos",
    desc: "Análisis de qué oportunidad se ajusta mejor a tu perfil y estrategia de salida.",
  },
  {
    title: "Siguientes pasos",
    desc: "Sesión 1:1 para dudas puntuales y cierre dirigido.",
  },
];

/* ── objeciones ── */
const objections = [
  {
    q: "¿Esto es fraude?",
    a: "No. Conocerás en persona a operadores y estructura.",
    icon: Shield,
  },
  {
    q: "¿Estoy obligado a invertir?",
    a: "No. Solo obtienes claridad.",
    icon: Lock,
  },
  {
    q: "¿Y si no me gusta?",
    a: "Te llevas conocimiento valioso.",
    icon: Eye,
  },
];

/* ════════════════════════════════════════════════════ */
export default function RutaInmobiliaria() {
  const [qualified, setQualified] = useState<boolean | null>(null);

  /* fire ViewContent on mount */
  useEffect(() => {
    trackEvent("ViewContent");
  }, []);

  /* when user qualifies → Lead event */
  useEffect(() => {
    if (qualified === true) trackEvent("Lead");
  }, [qualified]);

  /* ── rejected view ── */
  const RejectedGate = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex items-center justify-center bg-background"
    >
      <div className="max-w-xl mx-auto text-center px-6 py-20">
        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-8">
          <MessageCircle className="w-8 h-8 text-white/40" />
        </div>
        <p className="text-white/80 text-lg leading-relaxed mb-8">
          Este espacio está diseñado para inversionistas activos que buscan
          claridad antes de tomar decisiones.
          <br />
          <br />
          Si aún no estás en ese punto, te recomendamos comenzar con nuestro
          contenido educativo.
        </p>
        <a href={YOUTUBE_CHANNEL} target="_blank" rel="noopener noreferrer">
          <Button className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-base gap-2">
            Ver contenido educativo <ArrowRight className="w-4 h-4" />
          </Button>
        </a>
      </div>
    </motion.div>
  );

  if (qualified === false) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />
        <RejectedGate />
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />

      {/* ═══════════════════ SECCIÓN 1 – HERO + FILTRO ═══════════════════ */}
      <section className="relative isolate min-h-screen flex items-center pt-20 pb-20 overflow-hidden">
        {/* bg */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="h-full w-full object-cover"
          >
            <source
              src="https://res.cloudinary.com/dgruohz6f/video/upload/v1773439272/comprando-america/gyTEyuXRYfIMlAUS.mov"
              type="video/mp4"
            />
          </video>
          <div className="absolute inset-0 bg-gradient-to-r from-[oklch(0.08_0.03_250/0.95)] via-[oklch(0.10_0.03_250/0.85)] to-[oklch(0.08_0.03_250/0.70)] pointer-events-none" />
        </div>

        <div className="container relative z-10">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <span className="inline-block text-primary text-sm font-semibold tracking-[0.25em] uppercase mb-6 font-mono">
                Sala Privada · Presencial · Cupo Limitado
              </span>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white leading-[1.1] mb-6">
                Accede a oportunidades reales de inversión en{" "}
                <span className="gradient-text-primary">Estados Unidos</span>{" "}
                en una sala privada de empresarios
              </h1>

              <p className="text-lg md:text-xl text-white/70 leading-relaxed mb-10 max-w-2xl">
                Participa en la Ruta Inmobiliaria y conoce cómo empresarios
                están invirtiendo con estructura, estrategia y acompañamiento.
              </p>

              {/* ── FILTRO ── */}
              <AnimatePresence mode="wait">
                {qualified === null && (
                  <motion.div
                    key="filter"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.4 }}
                    className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 max-w-xl"
                  >
                    <p className="text-white font-semibold text-lg mb-6">
                      ¿Tienes $100,000 USD o más disponibles para invertir en
                      los próximos meses?
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button
                        onClick={() => setQualified(true)}
                        className="bg-primary hover:bg-primary/90 text-white font-semibold px-8 py-5 text-base flex-1"
                      >
                        Sí, estoy listo
                      </Button>
                      <Button
                        onClick={() => setQualified(false)}
                        variant="outline"
                        className="border-white/20 text-white hover:bg-white/5 px-8 py-5 text-base flex-1"
                      >
                        Aún no
                      </Button>
                    </div>
                  </motion.div>
                )}

                {qualified === true && (
                  <motion.div
                    key="cta-hero"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col sm:flex-row gap-4"
                  >
                    <a
                      href={CLOVER_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => trackEvent("InitiateCheckout")}
                    >
                      <Button className="bg-primary hover:bg-primary/90 text-white font-semibold px-8 py-6 text-base gap-2 w-full sm:w-auto">
                        Acceder a la sala privada{" "}
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </a>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ SECCIÓN 2 – VIDEO VSL ═══════════════════ */}
      {qualified && (
        <>
          <section className="section-darker py-24 md:py-32">
            <div className="container">
              <FadeIn>
                <div className="max-w-3xl mx-auto text-center">
                  <h2 className="text-3xl md:text-4xl font-serif text-white mb-10">
                    Antes de invertir en Estados Unidos, necesitas ver esto
                  </h2>

                  <div className="relative w-full max-w-md mx-auto aspect-[9/16] rounded-2xl overflow-hidden mb-10 shadow-2xl">
                    <iframe
                      src={`https://www.youtube.com/embed/qTnLtfwUiOg`}
                      title="Ruta Inmobiliaria – Video"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute inset-0 w-full h-full"
                    />
                  </div>

                  <div className="grid sm:grid-cols-3 gap-6 max-w-2xl mx-auto">
                    <div className="flex items-center gap-3 justify-center">
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                      <span className="text-white/70 text-sm">
                        No estás obligado a invertir
                      </span>
                    </div>
                    <div className="flex items-center gap-3 justify-center">
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                      <span className="text-white/70 text-sm">
                        Acceso a oportunidades reales
                      </span>
                    </div>
                    <div className="flex items-center gap-3 justify-center">
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                      <span className="text-white/70 text-sm">
                        Evento presencial con empresarios
                      </span>
                    </div>
                  </div>
                </div>
              </FadeIn>
            </div>
          </section>

          {/* ═══════════════════ SECCIÓN 3 – QUÉ ES ═══════════════════ */}
          <section className="section-dark py-24 md:py-32">
            <div className="container">
              <FadeIn>
                <div className="max-w-3xl mx-auto">
                  <h2 className="text-3xl md:text-4xl font-serif text-white mb-8">
                    No es un evento.{" "}
                    <span className="gradient-text-primary">
                      Es una sala privada de decisiones.
                    </span>
                  </h2>
                  <p className="text-white/70 text-lg leading-relaxed mb-8">
                    Aquí no vienes a escuchar teoría.
                  </p>
                  <p className="text-white/80 text-lg leading-relaxed">
                    Vienes a:
                  </p>
                  <ul className="mt-6 space-y-4">
                    {[
                      "Entender cómo funciona la inversión",
                      "Ver oportunidades reales",
                      "Conocer a quienes ya están invirtiendo",
                    ].map((item, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-4 text-white/70 text-lg"
                      >
                        <span className="text-primary mt-1">
                          <CheckCircle2 className="w-5 h-5" />
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </FadeIn>
            </div>
          </section>

          {/* ═══════════════════ SECCIÓN 4 – QUÉ VAS A VIVIR ═══════════════════ */}
          <section className="section-darker py-24 md:py-32">
            <div className="container">
              <FadeIn>
                <h2 className="text-3xl md:text-4xl font-serif text-white mb-12 text-center">
                  Lo que sucede dentro de la sala
                </h2>
                <div className="grid sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
                  {[
                    {
                      icon: Eye,
                      text: "Presentación de oportunidades reales",
                    },
                    {
                      icon: Scale,
                      text: "Explicación del modelo de inversión",
                    },
                    {
                      icon: Shield,
                      text: "Estructura legal y fiscal",
                    },
                    {
                      icon: Handshake,
                      text: "Networking con empresarios",
                    },
                  ].map((item, i) => (
                    <FadeIn key={i} delay={i * 0.1}>
                      <div className="flex items-start gap-4 bg-[oklch(0.15_0.03_250)] border border-white/5 rounded-xl p-6">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                          <item.icon className="w-5 h-5" />
                        </div>
                        <p className="text-white/80 text-lg">{item.text}</p>
                      </div>
                    </FadeIn>
                  ))}
                </div>
              </FadeIn>
            </div>
          </section>

          {/* ═══════════════════ SECCIÓN 5 – OBJECIONES ═══════════════════ */}
          <section className="section-dark py-24 md:py-32">
            <div className="container">
              <FadeIn>
                <h2 className="text-3xl md:text-4xl font-serif text-white mb-4 text-center">
                  Si tienes dudas, es completamente normal
                </h2>
                <div className="grid sm:grid-cols-3 gap-8 max-w-4xl mx-auto mt-12">
                  {objections.map((obj, i) => (
                    <FadeIn key={i} delay={i * 0.1}>
                      <div className="bg-[oklch(0.15_0.03_250)] border border-white/5 rounded-xl p-8 text-center">
                        <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-5">
                          <obj.icon className="w-6 h-6" />
                        </div>
                        <h3 className="text-white font-semibold mb-3">
                          {obj.q}
                        </h3>
                        <p className="text-white/60">{obj.a}</p>
                      </div>
                    </FadeIn>
                  ))}
                </div>
              </FadeIn>
            </div>
          </section>

          {/* ═══════════════════ SECCIÓN 6 – AUTORIDAD (EDMUNDO) ═══════════════════ */}
          <section className="section-darker py-24 md:py-32">
            <div className="container">
              <FadeIn>
                <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
                  {/* Foto – placeholder hasta que suba imagen */}
                  <div className="relative rounded-2xl overflow-hidden bg-[oklch(0.15_0.03_250)] min-h-[400px]">
                    <img
                      src="https://res.cloudinary.com/dofccqypz/image/upload/v1774380282/comprando-america/edmundo-trevino-professional.jpg"
                      alt="Edmundo Treviño"
                      className="w-full h-[400px] object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.08_0.03_250)] to-transparent" />
                  </div>

                  <div>
                    <h2 className="text-3xl md:text-4xl font-serif text-white mb-6">
                      Aprende de quien ya se equivocó para que tú no tengas que
                      hacerlo
                    </h2>
                    <div className="space-y-5 mt-8">
                      {[
                        "+20 años operando entre México y Estados Unidos",
                        "Experiencia real en inversión",
                        "Renovación de visas E2",
                        "Aprendizaje basado en errores reales",
                      ].map((item, i) => (
                        <div key={i} className="flex items-start gap-4">
                          <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                          <p className="text-white/70 text-lg">{item}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </FadeIn>
            </div>
          </section>

          {/* ═══════════════════ SECCIÓN 7 – EXCLUSIVIDAD ═══════════════════ */}
          <section className="section-dark py-24 md:py-32">
            <div className="container">
              <FadeIn>
                <div className="max-w-3xl mx-auto text-center">
                  <h2 className="text-3xl md:text-4xl font-serif text-white mb-8">
                    Un espacio pensado para quienes ya están en etapa de
                    decisión
                  </h2>
                  <p className="text-white/70 text-lg leading-relaxed mb-10">
                    La Ruta Inmobiliaria está diseñada para un grupo reducido de
                    personas que buscan claridad, contexto y acceso a
                    oportunidades reales.
                  </p>

                  <div className="grid sm:grid-cols-3 gap-6 mb-12">
                    {[
                      "Capital disponible",
                      "Interés en oportunidades reales",
                      "Búsqueda de decisiones informadas",
                    ].map((item, i) => (
                      <div
                        key={i}
                        className="bg-[oklch(0.15_0.03_250)] border border-white/5 rounded-xl p-6"
                      >
                        <CheckCircle2 className="w-6 h-6 text-primary mx-auto mb-3" />
                        <p className="text-white/80">{item}</p>
                      </div>
                    ))}
                  </div>

                  <div className="bg-gradient-to-r from-primary/10 to-transparent border border-primary/20 rounded-2xl p-8 inline-block">
                    <Users className="w-8 h-8 text-primary mx-auto mb-4" />
                    <p className="text-white text-lg font-semibold">
                      La sala está limitada a 25 asistentes
                    </p>
                    <p className="text-white/60 text-sm mt-2">
                      Para cuidar la calidad de la experiencia y el nivel de
                      conversación.
                    </p>
                  </div>
                </div>
              </FadeIn>
            </div>
          </section>

          {/* ═══════════════════ SECCIÓN 8 – DETALLES DEL EVENTO ═══════════════════ */}
          <section className="section-darker py-24 md:py-32">
            <div className="container">
              <FadeIn>
                <div className="max-w-4xl mx-auto">
                  {/* datos principales */}
                  <div className="grid sm:grid-cols-3 gap-8 mb-12 text-center">
                    <div className="bg-[oklch(0.15_0.03_250)] border border-white/5 rounded-xl p-8">
                      <Calendar className="w-8 h-8 text-primary mx-auto mb-4" />
                      <p className="text-white/50 text-sm mb-1">Fecha</p>
                      <p className="text-white font-serif text-2xl">
                        18 de abril
                      </p>
                    </div>
                    <div className="bg-[oklch(0.15_0.03_250)] border border-white/5 rounded-xl p-8">
                      <MapPin className="w-8 h-8 text-primary mx-auto mb-4" />
                      <p className="text-white/50 text-sm mb-1">Ciudad</p>
                      <p className="text-white font-serif text-2xl">
                        San Pedro, Nuevo León
                      </p>
                    </div>
                    <div className="bg-[oklch(0.15_0.03_250)] border border-white/5 rounded-xl p-8">
                      <Clock className="w-8 h-8 text-primary mx-auto mb-4" />
                      <p className="text-white/50 text-sm mb-1">Horario</p>
                      <p className="text-white font-serif text-2xl">
                        9:00 am – 6:00 pm
                      </p>
                    </div>
                  </div>

                  {/* programa desplegable */}
                  <Accordion type="single" collapsible>
                    <AccordionItem
                      value="programa"
                      className="bg-[oklch(0.15_0.03_250)] border border-white/5 rounded-xl px-6 data-[state=open]:border-primary/30"
                    >
                      <AccordionTrigger className="text-white hover:text-primary transition-colors py-6 text-lg font-semibold">
                        Ver programa
                      </AccordionTrigger>
                      <AccordionContent className="pb-8">
                        <p className="text-white/60 mb-8">
                          <strong className="text-white">
                            Agenda Orientada a Decisiones
                          </strong>{" "}
                          — Menos teoría. Más claridad: mercado, estructura,
                          riesgos, estrategia de salida y siguientes pasos.
                        </p>

                        <div className="grid md:grid-cols-2 gap-8">
                          {/* Mañana */}
                          <div>
                            <h4 className="text-white font-serif text-xl mb-2 flex items-center gap-2">
                              <span className="text-2xl">🕘</span> Mañana
                            </h4>
                            <p className="text-white/50 text-sm mb-6 font-semibold">
                              Claridad y Estructura (Educación Estratégica)
                            </p>
                            <ul className="space-y-5">
                              {agendaMorning.map((item, i) => (
                                <li
                                  key={i}
                                  className="border-l-2 border-primary/30 pl-4"
                                >
                                  <p className="text-white font-semibold mb-1">
                                    {item.title}
                                  </p>
                                  <p className="text-white/60 text-sm">
                                    {item.desc}
                                  </p>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Tarde */}
                          <div>
                            <h4 className="text-white font-serif text-xl mb-2 flex items-center gap-2">
                              <span className="text-2xl">🕓</span> Tarde
                            </h4>
                            <p className="text-white/50 text-sm mb-6 font-semibold">
                              Oportunidades y Decisiones (Presentación Real)
                            </p>
                            <ul className="space-y-5">
                              {agendaAfternoon.map((item, i) => (
                                <li
                                  key={i}
                                  className="border-l-2 border-primary/30 pl-4"
                                >
                                  <p className="text-white font-semibold mb-1">
                                    {item.title}
                                  </p>
                                  <p className="text-white/60 text-sm">
                                    {item.desc}
                                  </p>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </FadeIn>
            </div>
          </section>

          {/* ═══════════════════ SECCIÓN 9 – CTA DE COMPRA ═══════════════════ */}
          <section className="section-dark py-24 md:py-32">
            <div className="container">
              <FadeIn>
                <div className="max-w-2xl mx-auto text-center">
                  <h2 className="text-3xl md:text-4xl font-serif text-white mb-8">
                    Accede a la sala privada
                  </h2>

                  <a
                    href={CLOVER_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackEvent("InitiateCheckout")}
                  >
                    <Button className="bg-primary hover:bg-primary/90 text-white font-semibold px-10 py-6 text-lg gap-2">
                      Confirmar asistencia{" "}
                      <ArrowRight className="w-5 h-5" />
                    </Button>
                  </a>

                  <div className="flex flex-wrap justify-center gap-6 mt-8 text-white/50 text-sm">
                    <span className="flex items-center gap-2">
                      <Users className="w-4 h-4" /> Cupo limitado
                    </span>
                    <span className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" /> Evento presencial
                    </span>
                    <span className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" /> Acceso a
                      oportunidades reales
                    </span>
                  </div>
                </div>
              </FadeIn>
            </div>
          </section>

          {/* ═══════════════════ SECCIÓN 10 – URGENCIA ═══════════════════ */}
          <section className="section-darker py-16 md:py-20">
            <div className="container">
              <FadeIn>
                <div className="max-w-3xl mx-auto text-center">
                  <p className="text-white/60 text-lg leading-relaxed">
                    Los espacios son limitados y se asignan a perfiles que
                    cumplen con el criterio de inversión.
                  </p>
                </div>
              </FadeIn>
            </div>
          </section>

          {/* ═══════════════════ SECCIÓN 11 – CTA FINAL ═══════════════════ */}
          <section className="section-dark py-24 md:py-32">
            <div className="container">
              <FadeIn>
                <div className="max-w-2xl mx-auto text-center">
                  <h2 className="text-3xl md:text-4xl font-serif text-white mb-10">
                    Nos vemos dentro de la sala
                  </h2>
                  <a
                    href={CLOVER_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackEvent("InitiateCheckout")}
                  >
                    <Button className="bg-primary hover:bg-primary/90 text-white font-semibold px-10 py-6 text-lg gap-2">
                      Confirmar asistencia{" "}
                      <ArrowRight className="w-5 h-5" />
                    </Button>
                  </a>
                </div>
              </FadeIn>
            </div>
          </section>
        </>
      )}

      <Footer />
    </div>
  );
}
