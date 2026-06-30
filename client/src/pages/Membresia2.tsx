import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useInView } from "@/hooks/useInView";
import { openWhatsApp, WHATSAPP_PHONE } from "@/lib/whatsapp";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Play } from "lucide-react";

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
      initial={{ opacity: 0, y: 28 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ── assets ── */
const VIDEO_URL =
  "https://res.cloudinary.com/dgruohz6f/video/upload/v1773439233/comprando-america/YalfpoAHGGBHORwE.mp4";
const VIDEO_POSTER =
  "https://res.cloudinary.com/dgruohz6f/video/upload/so_2,w_960,c_fill,q_auto,f_jpg/v1773439233/comprando-america/YalfpoAHGGBHORwE.jpg";
const EDMUNDO_PORTRAIT =
  "https://lh3.googleusercontent.com/d/1Um6fwMpl_mMyAZWmF1hWVdnLYpJCp0Kz=w800";
const DINNER_IMAGE =
  "https://lh3.googleusercontent.com/d/1VKFcr6XRJ81P6XX9JbQ_GQvTsQdcvsQC=w1200";

const WA_MESSAGE =
  "Hola Edmundo, vi la página del Círculo Cercano y me gustaría agendar una sesión de diagnóstico estratégico.";

/* ── data ── */
const hitos = [
  { n: "01", label: "Llegué a Estados Unidos", desc: "Con sueños, incertidumbre y muchas preguntas." },
  { n: "02", label: "Construí empresas", desc: "Aprendiendo sobre la marcha, sin mapa." },
  { n: "03", label: "Perdí dinero", desc: "Confié en las personas equivocadas. Pagué el precio." },
  { n: "04", label: "Cometí errores", desc: "Decisiones que hoy habría hecho completamente diferente." },
  { n: "05", label: "Protegí mi patrimonio", desc: "Renovando mi visa E-2 durante más de dos décadas." },
  { n: "06", label: "Hoy acompaño a otros", desc: "Compartiendo el camino para que no lo recorras solo." },
];

const situaciones = [
  { id: 1, text: "Tengo capital disponible, pero no sé cuál es la mejor alternativa." },
  { id: 2, text: "Quiero invertir, pero no sé en quién confiar." },
  { id: 3, text: "Quiero explorar Estados Unidos, pero no sé por dónde empezar." },
  { id: 4, text: "Quiero proteger a mi familia y mi patrimonio." },
  { id: 5, text: "Quiero evitar errores costosos." },
  { id: 6, text: "Quiero escuchar a alguien que ya recorrió el camino." },
];

const beneficios = [
  "Mi experiencia personal como empresario e inversionista.",
  "Acceso a empresarios e inversionistas serios.",
  "Oportunidades curadas. No todo llega aquí.",
  "Reuniones privadas y seguimiento real.",
  "Especialistas que han trabajado conmigo durante años.",
  "Conversaciones honestas sobre negocios, patrimonio e inversión.",
  "Un lugar donde contrastar ideas antes de tomar decisiones importantes.",
];

/* ════════════════════════════════════════════════════════ */
export default function Membresia2() {
  const [showVideo, setShowVideo] = useState(false);
  const [showVideo2, setShowVideo2] = useState(false);
  const [selectedCards, setSelectedCards] = useState<Set<number>>(new Set());

  function toggleCard(id: number) {
    setSelectedCards((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className="min-h-screen bg-[#0B1F3A] text-white overflow-x-hidden">
      <Navbar />

      {/* ══════════════════════════════════════
          PANTALLA 1 — VIDEO HERO
      ══════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-28 pb-20 px-4">
        {/* Subtle radial glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#0F2847_0%,_#0B1F3A_65%)] pointer-events-none" />

        <div className="relative z-10 w-full max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="inline-block text-blue-400 text-xs font-semibold tracking-[0.3em] uppercase mb-8 font-mono">
              Edmundo Treviño · Círculo Cercano
            </span>

            <h1 className="text-4xl md:text-5xl lg:text-6xl text-white leading-[1.1] mb-6 font-light">
              No tienes que recorrer
              <br />
              <span className="font-bold">este camino solo.</span>
            </h1>

            <p className="text-slate-400 text-lg md:text-xl max-w-xl mx-auto mb-12 leading-relaxed">
              Quiero invitarte personalmente a mi círculo cercano.
            </p>
          </motion.div>

          {/* Video player */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
            className="relative rounded-2xl overflow-hidden border border-[#1E3A5F] shadow-2xl shadow-black/60"
          >
            {!showVideo ? (
              <button
                onClick={() => setShowVideo(true)}
                className="group relative w-full block"
                aria-label="Reproducir video de Edmundo Treviño"
              >
                {/* Split layout: left text / right photo */}
                <div className="flex h-[340px] md:h-[420px]">
                  {/* Left panel — dark navy with text */}
                  <div className="relative flex-1 bg-[#071628] flex flex-col justify-end p-8 md:p-12">
                    {/* Subtle blue glow top-left */}
                    <div className="absolute top-0 left-0 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
                    {/* Label */}
                    <div className="flex items-center gap-2 mb-5">
                      <div className="w-6 h-px bg-blue-400" />
                      <span className="text-blue-400 text-xs font-semibold tracking-[0.25em] uppercase font-mono">
                        Círculo Cercano 2026
                      </span>
                    </div>
                    <h2 className="text-white text-3xl md:text-4xl font-bold leading-tight mb-1 text-left">
                      Edmundo Treviño
                    </h2>
                    <p className="text-slate-400 text-sm mb-8 text-left">Fundador · Comprando América</p>
                    {/* Play CTA */}
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary group-hover:bg-blue-500 group-hover:scale-110 transition-all flex items-center justify-center shadow-lg shadow-blue-600/40 shrink-0">
                        <Play className="w-5 h-5 text-white ml-0.5" />
                      </div>
                      <span className="text-white font-medium text-sm group-hover:text-blue-300 transition-colors">
                        Ver mensaje
                      </span>
                    </div>
                  </div>

                  {/* Right panel — Edmundo photo */}
                  <div className="relative w-[45%] md:w-[48%] shrink-0">
                    <img
                      src={EDMUNDO_PORTRAIT}
                      alt="Edmundo Treviño"
                      className="w-full h-full object-cover object-top"
                    />
                    {/* Gradient fade left to blend with navy panel */}
                    <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#071628] to-transparent" />
                    {/* Dark overlay on hover */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                  </div>
                </div>
              </button>
            ) : (
              <video
                src={VIDEO_URL}
                controls
                autoPlay
                className="w-full aspect-video"
                poster={VIDEO_POSTER}
              />
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-10"
          >
            <button
              onClick={() => openWhatsApp(WHATSAPP_PHONE, WA_MESSAGE)}
              className="text-slate-400 hover:text-white text-sm underline underline-offset-4 transition-colors"
            >
              ¿Prefieres hablar directamente? Escríbeme →
            </button>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          PANTALLA 2 — MI HISTORIA: 6 HITOS
      ══════════════════════════════════════ */}
      <section className="bg-[#091A30] py-24 md:py-32 px-4">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <div className="mb-16 max-w-2xl">
              <span className="text-blue-400 text-xs font-semibold tracking-[0.3em] uppercase font-mono">
                Mi historia
              </span>
              <h2 className="text-3xl md:text-4xl text-white mt-4 mb-4 leading-tight">
                Hace más de 20 años llegué a Estados Unidos.
              </h2>
              <p className="text-slate-400 text-lg leading-relaxed">
                Lo que construí, lo que perdí, y lo que aprendí en el camino.
              </p>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-5">
            {hitos.map((h, i) => (
              <FadeIn key={h.n} delay={i * 0.08}>
                <div className="flex items-start gap-5 bg-[#0F2847] border border-[#1E3A5F] hover:border-blue-500/30 rounded-xl p-6 transition-all group">
                  <span className="text-blue-400 font-bold text-2xl font-mono shrink-0 group-hover:text-blue-300 transition-colors">
                    {h.n}
                  </span>
                  <div>
                    <h3 className="text-white font-semibold text-base mb-1">{h.label}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{h.desc}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={0.5}>
            <div className="mt-14 border-l-2 border-blue-500/40 pl-6 max-w-2xl">
              <p className="text-slate-300 text-lg leading-relaxed italic">
                "La mayoría de los errores se pueden evitar cuando tienes a las personas correctas a tu lado."
              </p>
              <p className="text-blue-400 text-sm mt-4 font-semibold">— Edmundo Treviño</p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ══════════════════════════════════════
          PANTALLA 3 — ¿TE IDENTIFICAS?
      ══════════════════════════════════════ */}
      <section className="bg-[#0B1F3A] py-24 md:py-32 px-4">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <div className="text-center mb-4">
              <span className="text-blue-400 text-xs font-semibold tracking-[0.3em] uppercase font-mono">
                ¿Resonas con esto?
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl text-white text-center mb-4 leading-tight">
              ¿Te identificas con alguna de estas situaciones?
            </h2>
            <p className="text-slate-400 text-center max-w-xl mx-auto mb-12 text-base">
              Selecciona las que apliquen para ti.
            </p>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-4">
            {situaciones.map((s, i) => {
              const selected = selectedCards.has(s.id);
              return (
                <FadeIn key={s.id} delay={i * 0.07}>
                  <button
                    onClick={() => toggleCard(s.id)}
                    className={`w-full text-left rounded-xl p-6 border transition-all duration-200 group ${
                      selected
                        ? "bg-primary/10 border-primary/60 shadow-lg shadow-blue-600/10"
                        : "bg-[#0F2847] border-[#1E3A5F] hover:border-blue-500/30"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-5 h-5 rounded-full border-2 shrink-0 mt-0.5 flex items-center justify-center transition-all ${
                          selected
                            ? "border-primary bg-primary"
                            : "border-slate-600 group-hover:border-blue-500/50"
                        }`}
                      >
                        {selected && (
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 12 12">
                            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </div>
                      <p className={`text-sm leading-relaxed transition-colors ${selected ? "text-white" : "text-slate-300"}`}>
                        {s.text}
                      </p>
                    </div>
                  </button>
                </FadeIn>
              );
            })}
          </div>

          <AnimatePresence>
            {selectedCards.size > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.4 }}
                className="mt-10 bg-primary/10 border border-primary/30 rounded-xl p-6 text-center"
              >
                <p className="text-white font-medium mb-4">
                  Si alguna de estas situaciones resuena contigo, este círculo podría tener sentido para ti.
                </p>
                <Button
                  onClick={() => openWhatsApp(WHATSAPP_PHONE, WA_MESSAGE)}
                  className="bg-primary hover:bg-blue-600 text-white font-semibold px-8 py-5 gap-2 shadow-lg shadow-blue-600/25"
                >
                  Solicitar sesión de diagnóstico <ArrowRight className="w-4 h-4" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ══════════════════════════════════════
          PANTALLA 4 — ¿CÓMO PUEDO AYUDARTE?
      ══════════════════════════════════════ */}
      <section className="bg-[#091A30] py-24 md:py-32 px-4">
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <span className="text-blue-400 text-xs font-semibold tracking-[0.3em] uppercase font-mono">
              ¿Cómo puedo ayudarte?
            </span>
            <h2 className="text-3xl md:text-4xl text-white mt-4 mb-4 leading-tight max-w-2xl">
              Porque entiendo el juego.
              <br />
              Y quiero que tú también lo entiendas.
            </h2>
          </FadeIn>

          <div className="grid lg:grid-cols-2 gap-10 items-center mt-12">
            {/* Video secundario */}
            <FadeIn>
              <div className="relative rounded-2xl overflow-hidden border border-[#1E3A5F] bg-black aspect-video shadow-xl shadow-black/40">
                {!showVideo2 ? (
                  <button
                    onClick={() => setShowVideo2(true)}
                    className="group relative w-full h-full block"
                  >
                    <img
                      src={EDMUNDO_PORTRAIT}
                      alt="Edmundo Treviño"
                      className="w-full h-full object-cover object-top"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-primary/90 group-hover:bg-primary group-hover:scale-110 transition-all flex items-center justify-center shadow-xl">
                        <Play className="w-6 h-6 text-white ml-1" />
                      </div>
                    </div>
                  </button>
                ) : (
                  <video
                    src={VIDEO_URL}
                    controls
                    autoPlay
                    className="w-full h-full"
                    poster={VIDEO_POSTER}
                  />
                )}
              </div>
            </FadeIn>

            {/* Puntos clave */}
            <FadeIn delay={0.1}>
              <div className="space-y-6">
                {[
                  { title: "No basta con tener capital.", desc: "Necesitas entender dónde y cómo desplegarlo." },
                  { title: "No basta con encontrar oportunidades.", desc: "Necesitas criterio para evaluarlas." },
                  { title: "No basta con abrir una empresa.", desc: "Necesitas estructura legal, fiscal y estratégica." },
                  { title: "Necesitas hacer las preguntas correctas.", desc: "Las que evitan los errores más costosos." },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2.5 shrink-0" />
                    <div>
                      <p className="text-white font-semibold text-base">{item.title}</p>
                      <p className="text-slate-400 text-sm mt-1 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>

          <FadeIn delay={0.2}>
            <div className="mt-14 text-center">
              <p className="text-slate-300 text-lg max-w-2xl mx-auto leading-relaxed">
                Por eso decidí abrir mi{" "}
                <span className="text-white font-semibold">Círculo Cercano.</span>
                {" "}Un espacio privado para empresarios e inversionistas que desean construir patrimonio en Estados Unidos con mayor claridad y menos errores.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ══════════════════════════════════════
          PANTALLA 5 — LO QUE ENCONTRARÁS
      ══════════════════════════════════════ */}
      <section className="bg-[#0B1F3A] py-24 md:py-32 px-4">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <div className="text-center mb-16">
              <span className="text-blue-400 text-xs font-semibold tracking-[0.3em] uppercase font-mono">
                El círculo
              </span>
              <h2 className="text-3xl md:text-4xl text-white mt-4 mb-4">
                ¿Qué encontrarás dentro?
              </h2>
              <p className="text-slate-400 max-w-xl mx-auto text-base leading-relaxed">
                No es un curso. No es una membresía genérica. Es acceso a criterio.
              </p>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-4 mb-14">
            {beneficios.map((b, i) => (
              <FadeIn key={i} delay={i * 0.06}>
                <div className="flex items-start gap-4 bg-[#0F2847] border border-[#1E3A5F] rounded-xl p-5 hover:border-blue-500/20 transition-all">
                  <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                  <p className="text-slate-300 text-sm leading-relaxed">{b}</p>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={0.4}>
            <div className="bg-[#0E2544] border border-blue-500/20 rounded-2xl p-8 md:p-10">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <p className="text-blue-400 text-xs font-semibold tracking-[0.2em] uppercase font-mono mb-4">
                    Lo más valioso
                  </p>
                  <p className="text-white text-xl md:text-2xl font-light leading-relaxed">
                    Lo más valioso del círculo no son las oportunidades.
                  </p>
                  <p className="text-white text-xl md:text-2xl font-bold mt-2">
                    Es el criterio.
                  </p>
                  <p className="text-slate-400 text-sm mt-4 leading-relaxed">
                    Porque una buena decisión puede cambiar tu patrimonio. Pero una mala decisión también.
                  </p>
                </div>

                <div className="border-l border-[#1E3A5F] pl-8">
                  <p className="text-slate-400 text-sm mb-2">El círculo es para:</p>
                  <p className="text-white font-semibold text-base mb-1">Empresarios e inversionistas listos para actuar.</p>
                  <p className="text-slate-400 text-sm mb-6">
                    Personas que cuentan con al menos{" "}
                    <span className="text-white font-semibold">USD $100,000</span>{" "}
                    para invertir en Estados Unidos y desean construir algo serio.
                  </p>
                  <div className="border-t border-[#1E3A5F] pt-6">
                    <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Inversión de acceso</p>
                    <p className="text-white text-3xl font-bold">USD $10,000</p>
                    <p className="text-slate-500 text-xs mt-1">Pago único · Sin anualidades</p>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ══════════════════════════════════════
          PANTALLA 6 — CTA FINAL
      ══════════════════════════════════════ */}
      <section className="bg-[#091A30] py-28 md:py-40 px-4">
        <div className="max-w-3xl mx-auto">
          <FadeIn>
            <div className="flex flex-col md:flex-row gap-8 items-start mb-16">
              <img
                src={EDMUNDO_PORTRAIT}
                alt="Edmundo Treviño"
                className="w-20 h-20 rounded-full object-cover object-top border-2 border-[#1E3A5F] shrink-0 mx-auto md:mx-0"
              />
              <div>
                <p className="text-slate-400 text-sm font-semibold tracking-[0.2em] uppercase font-mono mb-4">
                  Edmundo Treviño
                </p>
                <blockquote className="text-white text-2xl md:text-3xl font-light leading-relaxed">
                  "Si pudiera regresar 20 años atrás y hablar con el Edmundo que apenas comenzaba, le diría algo muy simple:
                  <span className="font-bold"> No intentes hacerlo solo."</span>
                </blockquote>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.15}>
            <div className="border-t border-[#1E3A5F] pt-14">
              <p className="text-slate-300 text-lg leading-relaxed mb-4 max-w-2xl">
                Hoy quiero extenderte esa misma mano.
              </p>
              <p className="text-white font-semibold text-xl mb-10 max-w-2xl">
                Bienvenido al Círculo Cercano de Edmundo Treviño.
              </p>

              <div className="bg-[#0F2847] border border-[#1E3A5F] rounded-xl p-7 mb-10 max-w-2xl">
                <p className="text-slate-400 text-sm leading-relaxed">
                  El primer paso es una{" "}
                  <span className="text-white font-semibold">sesión de diagnóstico estratégico</span>.{" "}
                  Una conversación honesta donde evaluamos si este círculo tiene sentido para tu situación específica.
                  Sin compromiso. Sin presión.
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <Button
                  onClick={() => openWhatsApp(WHATSAPP_PHONE, WA_MESSAGE)}
                  className="bg-primary hover:bg-blue-600 text-white font-semibold px-10 py-6 text-base gap-2 shadow-xl shadow-blue-600/30"
                >
                  Solicitar sesión de diagnóstico <ArrowRight className="w-5 h-5" />
                </Button>
              </div>

              <p className="text-slate-600 text-xs mt-6 max-w-md">
                El Círculo Cercano no está diseñado para curiosos. Está diseñado para empresarios e inversionistas que están listos para actuar.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      <Footer />
    </div>
  );
}
