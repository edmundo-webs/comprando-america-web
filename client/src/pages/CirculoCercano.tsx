import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useInView } from "@/hooks/useInView";
import { openWhatsApp, WHATSAPP_PHONE } from "@/lib/whatsapp";
import {
  ArrowRight, CheckCircle2, XCircle, ChevronDown, Play,
  Users, TrendingUp, Shield, Globe, BookOpen, Building2, Compass, Network,
} from "lucide-react";

function FadeIn({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const { ref, isInView } = useInView();
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 32 }} animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }} className={className}>
      {children}
    </motion.div>
  );
}

const VIDEO_URL = "https://res.cloudinary.com/dgruohz6f/video/upload/v1773439233/comprando-america/YalfpoAHGGBHORwE.mp4";
const VIDEO_POSTER = "https://res.cloudinary.com/dgruohz6f/video/upload/so_2,w_960,c_fill,q_auto,f_jpg/v1773439233/comprando-america/YalfpoAHGGBHORwE.jpg";
const EDMUNDO = "https://lh3.googleusercontent.com/d/1Um6fwMpl_mMyAZWmF1hWVdnLYpJCp0Kz=w800";
const WA = "Hola Edmundo, vi la página del Círculo Cercano y me gustaría agendar una sesión de diagnóstico estratégico.";

const situaciones = [
  { id: 1, text: "Tengo capital disponible, pero no sé cuál es la mejor alternativa." },
  { id: 2, text: "Quiero invertir, pero no sé en quién confiar." },
  { id: 3, text: "Quiero construir patrimonio en Estados Unidos." },
  { id: 4, text: "Quiero explorar opciones para mi familia." },
  { id: 5, text: "Ya invierto, pero quiero contrastar ideas con alguien que ya lo vivió." },
  { id: 6, text: "Quiero evitar los errores que otros ya cometieron antes que yo." },
];

const hitos = [
  { year: "2003", label: "Llegué a Estados Unidos", story: "Con sueños, incertidumbre y muchas preguntas. Sin mapa. Sin red de contactos. Sin saber exactamente qué construiría.", tag: "El inicio" },
  { year: "2004", label: "Abrí mis primeras empresas", story: "Aprendí sobre la marcha. Sin mentores. Cometiendo errores de principiante que hoy hubiera evitado con un solo consejo correcto.", tag: "Sin red" },
  { year: "2006", label: "Perdí dinero", story: "Confié en las personas equivocadas. No tenía instrumentos para evaluar oportunidades. Esa pérdida me enseñó más que cualquier éxito.", tag: "La lección" },
  { year: "2008", label: "Cometí errores costosos", story: "Decisiones que hoy haría diferente. Estructuras incorrectas, contratos mal negociados, socios mal elegidos.", tag: "El precio" },
  { year: "2005–2024", label: "Visa E-2 renovada por 20 años", story: "Negocios operando, creciendo y generando empleos reales en Estados Unidos. Continuamente.", tag: "20+ años" },
  { year: "2010", label: "Litigios y negociaciones difíciles", story: "Situaciones legales que nadie me avisó que podían ocurrir. Salí adelante. Y aprendí a estructurar mejor desde el inicio.", tag: "Protección" },
  { year: "2012", label: "Compré y vendí empresas", story: "Entendí los ciclos completos. Cómo valorar, negociar, salir. El proceso entero, no solo la entrada.", tag: "Ciclos" },
  { year: "2015", label: "Construí mi red de confianza", story: "Los mejores abogados, contadores y bancos no se encuentran en Google. Se consiguen con años de relaciones.", tag: "La red" },
  { year: "2020", label: "Descubrí patrones claros", story: "Después de ver decenas de historias, los patrones son evidentes. Hay errores que casi todos cometen. Y decisiones que casi siempre funcionan.", tag: "Criterio" },
  { year: "Hoy", label: "Acompaño a otros empresarios", story: "Decidí abrir mi círculo para empresarios que quieren construir en EE.UU. con más claridad y menos errores.", tag: "La misión" },
];

const ramas = [
  { id: "claridad", label: "Claridad", icon: <Compass className="w-5 h-5" />, desc: "Te ayudo a ordenar las ideas y definir qué tiene sentido para ti. No hay una sola respuesta correcta, pero hay preguntas que te llevan a la tuya." },
  { id: "criterio", label: "Criterio", icon: <Shield className="w-5 h-5" />, desc: "Aprenderás a identificar riesgos ocultos, hacer mejores preguntas y evaluar oportunidades más allá de una presentación comercial." },
  { id: "relaciones", label: "Relaciones", icon: <Network className="w-5 h-5" />, desc: "Acceso a mi red de abogados, contadores, bancos y operadores construida durante más de 20 años. No se consigue en Google." },
  { id: "comunidad", label: "Comunidad", icon: <Users className="w-5 h-5" />, desc: "40+ empresarios e inversionistas activos. Permanecen porque las mejores decisiones rara vez se toman solos." },
  { id: "oportunidades", label: "Oportunidades", icon: <TrendingUp className="w-5 h-5" />, desc: "Solo proyectos que yo mismo evalúo primero. Empresas, inmuebles, fondos y operaciones reales." },
  { id: "estructura", label: "Estructura", icon: <Building2 className="w-5 h-5" />, desc: "Legal, fiscal, migratoria. La estructura correcta desde el inicio evita años de problemas." },
  { id: "perspectiva", label: "Perspectiva", icon: <Globe className="w-5 h-5" />, desc: "El patrimonio no se construye en un trimestre. Aprenderás a pensar en décadas, no en meses." },
];

const expertos = [
  { name: "Joe Faraci", role: "Inversionista en Bienes Raíces", photo: "https://res.cloudinary.com/dgruohz6f/image/upload/v1773439239/comprando-america/YfxVlywHHLmCeDRI.png", bio: "Propietario de 250+ propiedades con 28 años de experiencia. Especialista en crear riqueza transgeneracional con Real Estate en Estados Unidos." },
  { name: "Tomás Resendez", role: "Abogado de Inmigración", photo: "https://res.cloudinary.com/dgruohz6f/image/upload/v1782674490/tts-news/eyuxiu9xuevkwulfcf2j.jpg", bio: "Especialista en inmigración corporativa con experiencia representando a Fortune 100. Bilingüe, garantiza asesoramiento legal claro y preciso." },
  { name: "Daniel Palacios", role: "Contador CPA y Fiscalista", photo: "https://res.cloudinary.com/dgruohz6f/image/upload/v1773439319/comprando-america/szrwwapkIJnWAmaW.png", bio: "Especialista en contabilidad empresarial y planeación fiscal. Experto asesorando a empresas y particulares con socios latinos." },
  { name: "Aubrey Dwyer", role: "Abogada Corporativa", photo: "https://res.cloudinary.com/dgruohz6f/image/upload/v1773439190/comprando-america/TehgUNVHXbrssxsK.jpg", bio: "Especializada en apertura de empresas, contratos y trademarks. Graduada de la Facultad de Derecho de la Universidad de Oklahoma." },
  { name: "Destiny Bounds", role: "Abogada Corporativa y PI", photo: "https://res.cloudinary.com/dgruohz6f/image/upload/v1773439307/comprando-america/pdCooMLqOfvqVFar.avif", bio: "Fundadora de Bounds Law LLC, especializada en derecho corporativo y propiedad intelectual. Autora y conferencista nacional." },
  { name: "Sebastián Jara", role: "Consultor de Marketing Digital", photo: "https://res.cloudinary.com/dgruohz6f/image/upload/v1773439309/comprando-america/qrZqfOUTzqKwJcYP.avif", bio: "15+ años optimizando estrategias digitales con IA para empresas en inmobiliario, educación y e-commerce." },
  { name: "John McKee", role: "Consultor Comercial", photo: "https://res.cloudinary.com/dgruohz6f/image/upload/v1773439314/comprando-america/sZacCQEqvoOyeOMO.avif", bio: "35+ años adaptando productos al mercado estadounidense en manufactura, consumo masivo y tecnología." },
];

const libros = [
  { title: "The E-Myth Revisited", author: "Michael E. Gerber", note: "La diferencia entre trabajar en tu negocio y trabajar para tu negocio." },
  { title: "Rich Dad Poor Dad", author: "Robert Kiyosaki", note: "La mentalidad que te enseñan vs. la que te hace libre financieramente." },
  { title: "Never Split the Difference", author: "Chris Voss", note: "Negociación real. No teoría. Técnicas de un ex-negociador del FBI." },
  { title: "The Millionaire Next Door", author: "Thomas Stanley", note: "Cómo realmente se construye patrimonio. Sin atajos." },
];

/* ════════════════════════════════════════════════════════ */
export default function CirculoCercano() {
  const [showVideo, setShowVideo] = useState(false);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [activeHito, setActiveHito] = useState<number | null>(null);
  const [activeRama, setActiveRama] = useState<string | null>(null);
  const [openLibro, setOpenLibro] = useState<number | null>(null);
  const [openTestimonio, setOpenTestimonio] = useState<number | null>(null);
  const [openExperto, setOpenExperto] = useState<number | null>(null);
  const [showPlanes, setShowPlanes] = useState(false);
  const [showBio, setShowBio] = useState(false);
  const [showEnfoque, setShowEnfoque] = useState(false);
  const [showMetodologia, setShowMetodologia] = useState(false);

  function toggle(id: number) {
    setSelected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }

  const activeRamaData = ramas.find(r => r.id === activeRama);

  return (
    <div className="min-h-screen bg-[#0B1F3A] text-white overflow-x-hidden">
      <Navbar />

      {/* ══ HERO ══════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Full bleed portrait — right half */}
        <div className="absolute right-0 inset-y-0 w-full md:w-[55%] pointer-events-none select-none">
          <img src={EDMUNDO} alt="" className="w-full h-full object-cover object-top" />
          {/* Left vignette */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B1F3A] via-[#0B1F3A]/80 to-transparent" />
          {/* Bottom vignette */}
          <div className="absolute bottom-0 inset-x-0 h-48 bg-gradient-to-t from-[#0B1F3A] to-transparent" />
        </div>

        {/* Blue radial behind text */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_80%_at_10%_50%,_#0F2E56_0%,_transparent_65%)]" />

        {/* Content */}
        <div className="relative z-10 w-full max-w-6xl mx-auto px-6 md:px-12 pt-32 pb-24">
          <div className="max-w-xl">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-0.5 bg-primary" />
                <span className="text-blue-400 text-xs font-mono font-semibold tracking-[0.3em] uppercase">
                  Círculo Cercano · Comprando América 2026
                </span>
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.0] tracking-tight mb-6">
                No tienes que
                <br />
                <span className="text-blue-400">recorrer este</span>
                <br />
                camino solo.
              </h1>

              <p className="text-slate-300 text-lg leading-relaxed mb-10 max-w-md">
                Si estás explorando Estados Unidos para invertir o proteger patrimonio,
                el verdadero reto no es encontrar oportunidades —
                <span className="text-white font-semibold"> es saber en quién confiar.</span>
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <motion.button
                  onClick={() => document.getElementById("diagnostico")?.scrollIntoView({ behavior: "smooth" })}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-blue-500 text-white font-bold px-8 py-4 rounded-xl text-sm tracking-wide shadow-2xl shadow-blue-700/40 transition-colors"
                >
                  Descubre si este círculo es para ti <ArrowRight className="w-4 h-4" />
                </motion.button>
                <button onClick={() => openWhatsApp(WHATSAPP_PHONE, WA)} className="text-slate-400 hover:text-white text-sm transition-colors self-center">
                  Hablar directamente →
                </button>
              </div>
            </motion.div>

            {/* Stat pills */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap gap-3 mt-12">
              {[["40+", "Miembros activos"], ["20+", "Años en EE.UU."], ["$10K", "Inversión de acceso"]].map(([n, l]) => (
                <div key={l} className="flex items-center gap-2.5 bg-white/5 border border-white/10 rounded-full px-4 py-2">
                  <span className="text-blue-400 font-bold text-sm">{n}</span>
                  <span className="text-slate-400 text-xs">{l}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Scroll hint */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
          animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="w-6 h-6 text-blue-400/50" />
        </motion.div>
      </section>

      {/* ══ VIDEO — MENSAJE DE EDMUNDO ═════════════════════════ */}
      <section className="bg-[#091A30] py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <FadeIn className="text-center mb-8">
            <span className="text-blue-400 text-xs font-mono font-semibold tracking-[0.3em] uppercase">Un mensaje personal</span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mt-3">
              — Edmundo Treviño —
            </h2>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="relative rounded-2xl overflow-hidden bg-[#0B1F3A] aspect-video border border-[#1E3A5F] shadow-2xl shadow-black/60">
              {!showVideo ? (
                <button onClick={() => setShowVideo(true)} className="group relative w-full h-full block" aria-label="Reproducir">
                  {/* BG */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#0F2847] to-[#091A30]" />
                  {/* Portrait right */}
                  <div className="absolute right-0 inset-y-0 w-[55%]">
                    <img src={EDMUNDO} alt="Edmundo Treviño" className="w-full h-full object-cover object-top opacity-70 group-hover:opacity-80 transition-opacity duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0F2847] via-[#0F2847]/50 to-transparent" />
                  </div>
                  {/* Left content */}
                  <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-14 max-w-[55%]">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-5 h-0.5 bg-primary" />
                      <span className="text-blue-400 text-[10px] font-mono tracking-[0.3em] uppercase">Círculo Cercano 2026</span>
                    </div>
                    <h3 className="text-white text-2xl md:text-3xl lg:text-4xl font-extrabold leading-tight mb-2">
                      Edmundo Treviño
                    </h3>
                    <p className="text-slate-400 text-sm mb-8">Fundador · Comprando América</p>
                    <motion.div whileHover={{ x: 4 }} className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-full bg-primary group-hover:bg-blue-500 transition-colors flex items-center justify-center shadow-xl shadow-blue-600/40">
                        <Play className="w-5 h-5 text-white ml-0.5" />
                      </div>
                      <span className="text-slate-300 text-sm font-medium group-hover:text-white transition-colors">Ver mensaje</span>
                    </motion.div>
                  </div>
                </button>
              ) : (
                <video src={VIDEO_URL} controls autoPlay className="w-full h-full" poster={VIDEO_POSTER} />
              )}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ══ MICRODIAGNÓSTICO ═══════════════════════════════════ */}
      <section id="diagnostico" className="bg-[#0B1F3A] py-28 px-4">
        <div className="max-w-4xl mx-auto">
          <FadeIn className="text-center mb-14">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-8 h-0.5 bg-primary/50" />
              <span className="text-blue-400 text-xs font-mono font-semibold tracking-[0.3em] uppercase">Microdiagnóstico</span>
              <div className="w-8 h-0.5 bg-primary/50" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
              ¿Te identificas con alguna<br />de estas situaciones?
            </h2>
            <p className="text-slate-400">Selecciona las que apliquen para ti.</p>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-3">
            {situaciones.map((s, i) => {
              const sel = selected.has(s.id);
              return (
                <FadeIn key={s.id} delay={i * 0.06}>
                  <motion.button onClick={() => toggle(s.id)} whileTap={{ scale: 0.99 }}
                    className={`w-full text-left rounded-xl border px-5 py-4 flex items-start gap-4 transition-all group ${
                      sel ? "bg-primary/10 border-primary/60 shadow-lg shadow-blue-600/10" : "bg-[#0F2542] border-[#1E3A5F] hover:border-blue-500/40"
                    }`}>
                    <div className={`w-5 h-5 rounded-full border-2 shrink-0 mt-0.5 flex items-center justify-center transition-all ${sel ? "border-primary bg-primary" : "border-slate-600 group-hover:border-blue-400/60"}`}>
                      {sel && <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 12 12"><path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                    </div>
                    <p className={`text-sm leading-relaxed ${sel ? "text-white" : "text-slate-400 group-hover:text-slate-300"}`}>{s.text}</p>
                  </motion.button>
                </FadeIn>
              );
            })}
          </div>

          <AnimatePresence>
            {selected.size >= 2 && (
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}
                className="mt-8 bg-primary/10 border border-primary/30 rounded-2xl p-8 text-center">
                <p className="text-white font-bold text-xl mb-2">Probablemente este círculo puede ayudarte.</p>
                <p className="text-slate-400 text-sm mb-6 max-w-md mx-auto">Te identificas con {selected.size} situaciones. El primer paso es una conversación honesta.</p>
                <button onClick={() => openWhatsApp(WHATSAPP_PHONE, WA)}
                  className="inline-flex items-center gap-2 bg-primary hover:bg-blue-500 text-white font-bold px-8 py-4 rounded-xl text-sm transition-all shadow-lg shadow-blue-600/25">
                  Solicitar sesión de diagnóstico <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ══ TIMELINE ══════════════════════════════════════════ */}
      <section className="bg-[#091A30] py-28 px-4">
        <div className="max-w-4xl mx-auto">
          <FadeIn className="mb-16">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-0.5 bg-primary/50" />
              <span className="text-blue-400 text-xs font-mono font-semibold tracking-[0.3em] uppercase">Mi historia en 20 años</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
              No aprendí haciendo cursos.
              <br /><span className="text-blue-400">Aprendí haciendo negocios.</span>
            </h2>
            <p className="text-slate-400 max-w-md">Haz clic en cada hito para conocer la historia detrás.</p>
          </FadeIn>

          <div className="relative">
            <div className="absolute left-[11px] top-3 bottom-3 w-px bg-gradient-to-b from-primary via-primary/30 to-transparent" />
            <div className="space-y-2">
              {hitos.map((h, i) => {
                const open = activeHito === i;
                return (
                  <FadeIn key={i} delay={i * 0.04}>
                    <div className="relative pl-10">
                      <div className={`absolute left-0 top-4 w-[23px] h-[23px] rounded-full border-2 flex items-center justify-center z-10 cursor-pointer transition-all ${open ? "bg-primary border-primary shadow-md shadow-blue-500/40" : "bg-[#091A30] border-[#1E3A5F] hover:border-primary/60"}`}
                        onClick={() => setActiveHito(open ? null : i)}>
                        {open && <div className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                      <button onClick={() => setActiveHito(open ? null : i)} className="w-full text-left">
                        <div className={`rounded-xl border transition-all ${open ? "bg-[#0F2542] border-primary/40" : "bg-[#0B1F3A] border-[#1E3A5F] hover:border-[#2A4A70]"}`}>
                          <div className="flex items-center gap-4 px-5 py-4">
                            <span className="text-blue-400 text-xs font-mono font-bold w-24 shrink-0">{h.year}</span>
                            <span className={`flex-1 text-sm font-semibold transition-colors ${open ? "text-white" : "text-slate-300"}`}>{h.label}</span>
                            <span className={`text-xs px-2.5 py-1 rounded-full font-medium shrink-0 hidden sm:block transition-all ${open ? "bg-primary/20 text-blue-300" : "bg-[#1E3A5F] text-slate-500"}`}>{h.tag}</span>
                            <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
                              <ChevronDown className="w-4 h-4 text-slate-600" />
                            </motion.div>
                          </div>
                          <AnimatePresence>
                            {open && (
                              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                                <div className="px-5 pb-5 border-t border-[#1E3A5F] pt-4">
                                  <p className="text-slate-400 text-sm leading-relaxed">{h.story}</p>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </button>
                    </div>
                  </FadeIn>
                );
              })}
            </div>
          </div>

          <FadeIn delay={0.5} className="mt-14">
            <div className="border-l-4 border-primary pl-6 py-2 max-w-2xl">
              <p className="text-slate-300 text-xl leading-relaxed italic font-light">
                "La mayoría de los errores se pueden evitar cuando tienes a las personas correctas a tu lado."
              </p>
              <p className="text-blue-400 text-sm mt-3 font-bold">— Edmundo Treviño</p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ══ MAPA CONCEPTUAL ════════════════════════════════════ */}
      <section className="bg-[#0B1F3A] py-28 px-4">
        <div className="max-w-5xl mx-auto">
          <FadeIn className="text-center mb-14">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-8 h-0.5 bg-primary/50" />
              <span className="text-blue-400 text-xs font-mono font-semibold tracking-[0.3em] uppercase">¿Cómo puedo ayudarte?</span>
              <div className="w-8 h-0.5 bg-primary/50" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
              Siete dimensiones donde
              <br />el círculo marca la diferencia.
            </h2>
            <p className="text-slate-400">Selecciona cada área para entender cómo aplica a tu situación.</p>
          </FadeIn>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {ramas.map((rama, i) => {
              const active = activeRama === rama.id;
              return (
                <FadeIn key={rama.id} delay={i * 0.05}>
                  <motion.button onClick={() => setActiveRama(active ? null : rama.id)} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                    className={`w-full rounded-2xl border p-5 flex flex-col items-center gap-3 text-center transition-all ${
                      active ? "bg-primary border-primary shadow-xl shadow-blue-600/25" : "bg-[#0F2542] border-[#1E3A5F] hover:border-blue-500/40"
                    }`}>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${active ? "bg-white/20 text-white" : "bg-[#1E3A5F] text-blue-400"}`}>
                      {rama.icon}
                    </div>
                    <span className={`font-bold text-sm ${active ? "text-white" : "text-slate-300"}`}>{rama.label}</span>
                  </motion.button>
                </FadeIn>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            {activeRamaData && (
              <motion.div key={activeRamaData.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}
                className="mt-4 bg-[#0F2542] border border-primary/40 rounded-2xl p-6 md:p-8 flex items-start gap-5 shadow-lg shadow-blue-600/10">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shrink-0">{activeRamaData.icon}</div>
                <div>
                  <h3 className="text-white font-bold text-lg mb-1.5">{activeRamaData.label}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{activeRamaData.desc}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <FadeIn delay={0.4} className="mt-8">
            <div className="flex items-center gap-5 bg-[#0F2542] border border-[#1E3A5F] rounded-2xl p-6">
              <img src={EDMUNDO} alt="Edmundo Treviño" className="w-14 h-14 rounded-full object-cover object-top border-2 border-primary/40 shrink-0" />
              <div className="flex-1">
                <p className="text-white font-bold">Edmundo Treviño</p>
                <p className="text-slate-400 text-sm mt-0.5">El centro del círculo — 20+ años de experiencia en negocios, inversiones y patrimonio en Estados Unidos.</p>
              </div>
              <button onClick={() => setShowBio(true)}
                className="shrink-0 inline-flex items-center gap-2 bg-[#0B1F3A] hover:bg-[#162E50] border border-[#1E3A5F] hover:border-primary/50 text-slate-300 hover:text-white font-semibold px-5 py-2.5 rounded-xl text-xs transition-all">
                Biografía <ChevronDown className="w-3.5 h-3.5 -rotate-90" />
              </button>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ══ RED DE EXPERTOS ════════════════════════════════════ */}
      <section className="bg-[#091A30] py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <FadeIn className="text-center mb-10">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-8 h-0.5 bg-primary/50" />
              <span className="text-blue-400 text-xs font-mono font-semibold tracking-[0.3em] uppercase">Lo que llevamos en el morral</span>
              <div className="w-8 h-0.5 bg-primary/50" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
              Una red construida durante 20 años.<br />
              <span className="text-blue-400">No se consigue en Google.</span>
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">Nuestros miembros pueden acceder a esta red o trabajar con sus propios asesores.</p>
          </FadeIn>

          {/* Compact expert grid — all 7 visible at a glance */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {expertos.map((e, i) => {
              const open = openExperto === i;
              return (
                <FadeIn key={i} delay={i * 0.05}>
                  <div className={`rounded-2xl border transition-all ${open ? "bg-[#0F2542] border-primary/40" : "bg-[#0B1F3A] border-[#1E3A5F] hover:border-primary/30"}`}>
                    <button onClick={() => setOpenExperto(open ? null : i)} className="w-full flex items-center gap-3 p-3 text-left group">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 bg-[#091A30]">
                        <img src={e.photo} alt={e.name} className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-bold text-sm leading-tight truncate">{e.name}</p>
                        <p className="text-blue-400 text-[11px] font-medium leading-snug mt-0.5 line-clamp-2">{e.role}</p>
                      </div>
                      <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} className="shrink-0">
                        <ChevronDown className="w-3.5 h-3.5 text-slate-600" />
                      </motion.div>
                    </button>
                    <AnimatePresence>
                      {open && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
                          <div className="px-3 pb-4 border-t border-[#1E3A5F] pt-3">
                            <p className="text-slate-400 text-xs leading-relaxed">{e.bio}</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══ EL CÍRCULO ════════════════════════════════════════ */}
      <section className="bg-[#0B1F3A] py-28 px-4">
        <div className="max-w-5xl mx-auto">
          <FadeIn className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-8 h-0.5 bg-primary/50" />
              <span className="text-blue-400 text-xs font-mono font-semibold tracking-[0.3em] uppercase">El Círculo</span>
              <div className="w-8 h-0.5 bg-primary/50" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
              40+ empresarios e<br />inversionistas activos.
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Muchos llegan buscando orientación. Otros, perspectivas.
              Permanecen porque <span className="text-white font-semibold">las mejores decisiones rara vez se toman solos.</span>
            </p>
          </FadeIn>

          {/* Ecosystem visual */}
          <FadeIn delay={0.1} className="relative flex items-center justify-center mb-14" style={{ minHeight: 340 }}>
            {[310, 230, 155].map((s, i) => (
              <motion.div key={i} className="absolute rounded-full border border-primary/10"
                style={{ width: s, height: s }}
                animate={{ rotate: i % 2 ? -360 : 360 }}
                transition={{ duration: 50 + i * 20, repeat: Infinity, ease: "linear" }}
              />
            ))}
            {/* Dot ring */}
            {Array.from({ length: 12 }).map((_, i) => {
              const angle = (i / 12) * 360;
              const r = 155;
              const x = Math.cos((angle - 90) * Math.PI / 180) * r;
              const y = Math.sin((angle - 90) * Math.PI / 180) * r;
              return (
                <div key={i} className="absolute w-1.5 h-1.5 rounded-full bg-primary/30"
                  style={{ left: "50%", top: "50%", transform: `translate(${x - 3}px, ${y - 3}px)` }} />
              );
            })}
            {/* Center */}
            <div className="relative z-10 w-24 h-24 rounded-full border-2 border-primary overflow-hidden shadow-2xl shadow-blue-600/30">
              <img src={EDMUNDO} alt="Edmundo" className="w-full h-full object-cover object-top" />
            </div>
            {/* Orbiting profiles */}
            {[
              { type: "Empresarios", count: "12+" },
              { type: "Desarrolladores", count: "8+" },
              { type: "Industriales", count: "5+" },
              { type: "Inversionistas", count: "9+" },
              { type: "Exportadores", count: "4+" },
              { type: "Profesionales", count: "6+" },
            ].map((p, i) => {
              const angle = (i / 6) * 360 - 90;
              const r = 125;
              const x = Math.cos(angle * Math.PI / 180) * r;
              const y = Math.sin(angle * Math.PI / 180) * r;
              return (
                <motion.div key={p.type} className="absolute z-10"
                  style={{ left: "50%", top: "50%", x: x - 38, y: y - 38 }}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}>
                  <div className="w-[76px] h-[76px] rounded-xl bg-[#0F2542] border border-[#1E3A5F] hover:border-primary/50 transition-colors flex flex-col items-center justify-center gap-1 cursor-default">
                    <span className="text-white text-[11px] font-bold text-center leading-tight px-1">{p.type}</span>
                    <span className="text-blue-400 text-xs font-bold font-mono">{p.count}</span>
                  </div>
                </motion.div>
              );
            })}
            <div style={{ width: 310, height: 310 }} />
          </FadeIn>

          {/* Stats row */}
          <FadeIn delay={0.2}>
            <div className="grid grid-cols-3 gap-4">
              {[
                { n: "40+", label: "Miembros activos", sub: "Empresarios e inversionistas" },
                { n: "20+", label: "Años en EE.UU.", sub: "En negocios reales" },
                { n: "$100K+", label: "Capital mínimo", sub: "Para inversionistas serios" },
              ].map((s, i) => (
                <div key={i} className="bg-[#0F2542] border border-[#1E3A5F] rounded-2xl p-6 text-center">
                  <p className="text-blue-400 text-3xl md:text-4xl font-extrabold mb-1">{s.n}</p>
                  <p className="text-white text-sm font-semibold mb-0.5">{s.label}</p>
                  <p className="text-slate-500 text-xs hidden md:block">{s.sub}</p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ══ TESTIMONIOS ════════════════════════════════════════ */}
      <section className="bg-[#091A30] py-28 px-4">
        <div className="max-w-4xl mx-auto">
          <FadeIn className="text-center mb-14">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-8 h-0.5 bg-primary/50" />
              <span className="text-blue-400 text-xs font-mono font-semibold tracking-[0.3em] uppercase">Lo que dicen los miembros</span>
              <div className="w-8 h-0.5 bg-primary/50" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
              No son testimonios de rentabilidad.
              <br /><span className="text-blue-400">Son de claridad.</span>
            </h2>
          </FadeIn>

          <div className="space-y-3">
            {[
              { name: "Miembro del Círculo", role: "Empresario industrial, México", text: "Llegué con muchas dudas sobre cómo estructurar mi inversión. No necesitaba que alguien me dijera qué comprar. Necesitaba criterio para decidir bien. Eso es exactamente lo que encontré." },
              { name: "Miembro del Círculo", role: "Inversionista de bienes raíces", text: "La sesión de diagnóstico me ahorró cometer un error de $200,000 dólares. No exagero. La conversación me ayudó a ver lo que yo no podía ver porque estaba demasiado cerca del proyecto." },
              { name: "Miembro del Círculo", role: "Empresario exportador", text: "Lo más valioso no es la red de expertos, aunque es excelente. Es la forma en que Edmundo te hace las preguntas correctas. Te obliga a pensar diferente." },
            ].map((t, i) => {
              const open = openTestimonio === i;
              return (
                <FadeIn key={i} delay={i * 0.08}>
                  <div className={`rounded-xl border transition-all ${open ? "bg-[#0F2542] border-primary/30" : "bg-[#0B1F3A] border-[#1E3A5F]"}`}>
                    <button onClick={() => setOpenTestimonio(open ? null : i)} className="w-full flex items-center gap-4 p-5 text-left">
                      <div className="w-9 h-9 rounded-full bg-[#1E3A5F] flex items-center justify-center shrink-0">
                        <Users className="w-4 h-4 text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-slate-200 font-semibold text-sm">{t.name}</p>
                        <p className="text-slate-500 text-xs">{t.role}</p>
                      </div>
                      <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
                        <ChevronDown className="w-4 h-4 text-slate-600" />
                      </motion.div>
                    </button>
                    <AnimatePresence>
                      {open && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                          <div className="px-5 pb-5 border-t border-[#1E3A5F] pt-4">
                            <p className="text-slate-300 text-sm leading-relaxed italic">"{t.text}"</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══ NÚMEROS REALES ════════════════════════════════════ */}
      <section className="bg-[#0B1F3A] py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <FadeIn className="text-center mb-12">
            <p className="text-slate-400 text-sm mb-2">Con apoyo de Comprando América hemos realizado</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white">Números reales. Equipo real.</h2>
          </FadeIn>
          <FadeIn delay={0.1}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {[
                { n: "40+", label: "Miembros activos" },
                { n: "53+", label: "LLCs estructuradas" },
                { n: "14+", label: "Visas tramitadas" },
                { n: "6", label: "Viajes de inspección" },
              ].map(({ n, label }) => (
                <div key={label}>
                  <p className="text-blue-400 text-4xl md:text-5xl font-extrabold mb-1">{n}</p>
                  <p className="text-slate-400 text-xs font-semibold tracking-widest uppercase">{label}</p>
                </div>
              ))}
            </div>
            <div className="mt-10 bg-primary/10 border border-primary/25 rounded-2xl py-6 px-8 text-center">
              <p className="text-slate-400 text-sm mb-1">Los miembros han invertido</p>
              <p className="text-white text-3xl md:text-4xl font-extrabold tracking-tight">$3,710,086 <span className="text-blue-400 text-xl font-bold">USD</span></p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ══ ENFOQUE & METODOLOGÍA ════════════════════════════ */}
      <section className="bg-[#091A30] py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <FadeIn className="text-center mb-10">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-8 h-0.5 bg-primary/50" />
              <span className="text-blue-400 text-xs font-mono font-semibold tracking-[0.3em] uppercase">Cómo trabajamos</span>
              <div className="w-8 h-0.5 bg-primary/50" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Estructura detrás del círculo.</h2>
            <p className="text-slate-400 text-sm">Explora nuestro enfoque y la metodología que aplicamos con cada miembro.</p>
          </FadeIn>
          <FadeIn delay={0.1} className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => setShowEnfoque(true)}
              className="inline-flex items-center justify-center gap-3 bg-[#0F2542] hover:bg-[#162E50] border border-[#1E3A5F] hover:border-primary/50 text-white font-bold px-8 py-5 rounded-2xl text-sm transition-all group">
              <div className="w-9 h-9 rounded-xl bg-primary/20 group-hover:bg-primary/30 flex items-center justify-center transition-colors">
                <Globe className="w-5 h-5 text-blue-400" />
              </div>
              <div className="text-left">
                <p className="font-bold">Nuestro Enfoque</p>
                <p className="text-slate-500 text-xs font-normal">5 áreas de acción en EE.UU.</p>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-500 ml-auto -rotate-90" />
            </button>
            <button onClick={() => setShowMetodologia(true)}
              className="inline-flex items-center justify-center gap-3 bg-[#0F2542] hover:bg-[#162E50] border border-[#1E3A5F] hover:border-primary/50 text-white font-bold px-8 py-5 rounded-2xl text-sm transition-all group">
              <div className="w-9 h-9 rounded-xl bg-primary/20 group-hover:bg-primary/30 flex items-center justify-center transition-colors">
                <Shield className="w-5 h-5 text-blue-400" />
              </div>
              <div className="text-left">
                <p className="font-bold">Metodología</p>
                <p className="text-slate-500 text-xs font-normal">6 pilares del sistema</p>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-500 ml-auto -rotate-90" />
            </button>
          </FadeIn>
        </div>
      </section>

      {/* ══ BIBLIOTECA ═════════════════════════════════════════ */}
      <section className="bg-[#0B1F3A] py-28 px-4">
        <div className="max-w-4xl mx-auto">
          <FadeIn className="text-center mb-14">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-8 h-0.5 bg-primary/50" />
              <span className="text-blue-400 text-xs font-mono font-semibold tracking-[0.3em] uppercase">Biblioteca de Edmundo</span>
              <div className="w-8 h-0.5 bg-primary/50" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
              Los libros que<br />transformaron mi visión.
            </h2>
            <p className="text-slate-400 max-w-md mx-auto">No son los más famosos. Son los que más me marcaron.</p>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-4">
            {libros.map((libro, i) => {
              const open = openLibro === i;
              return (
                <FadeIn key={i} delay={i * 0.07}>
                  <div className={`rounded-xl border transition-all ${open ? "bg-[#0F2542] border-primary/40" : "bg-[#091A30] border-[#1E3A5F] hover:border-[#2A4A70]"}`}>
                    <button onClick={() => setOpenLibro(open ? null : i)} className="w-full flex items-center gap-4 p-5 text-left">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${open ? "bg-primary text-white" : "bg-[#1E3A5F] text-blue-400"}`}>
                        <BookOpen className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-bold text-sm">{libro.title}</p>
                        <p className="text-slate-500 text-xs">{libro.author}</p>
                      </div>
                      <ChevronDown className={`w-4 h-4 text-slate-600 transition-transform ${open ? "rotate-180" : ""}`} />
                    </button>
                    <AnimatePresence>
                      {open && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                          <div className="px-5 pb-5 border-t border-[#1E3A5F] pt-4">
                            <p className="text-slate-400 text-sm leading-relaxed">
                              <span className="text-blue-400 font-semibold">Por qué lo recomiendo: </span>{libro.note}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══ FILTRO + INVERSIÓN ═════════════════════════════════ */}
      <section className="bg-[#091A30] py-28 px-4">
        <div className="max-w-4xl mx-auto">
          <FadeIn className="text-center mb-14">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-8 h-0.5 bg-primary/50" />
              <span className="text-blue-400 text-xs font-mono font-semibold tracking-[0.3em] uppercase">Filtro de acceso</span>
              <div className="w-8 h-0.5 bg-primary/50" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
              Este círculo<br />no es para todos.
            </h2>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-5 mb-10">
            <FadeIn>
              <div className="bg-[#061A0D] border border-emerald-500/20 rounded-2xl p-7">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-7 h-7 rounded-full bg-emerald-500/15 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </div>
                  <h3 className="text-emerald-400 font-bold text-sm">Sí puede ser para ti si:</h3>
                </div>
                <ul className="space-y-3">
                  {["Cuentas con al menos USD $100,000 para invertir.", "Quieres construir algo serio en Estados Unidos.", "Valoras la experiencia y las relaciones.", "Entiendes que el patrimonio se construye a largo plazo.", "Buscas acompañamiento y criterio."].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400/70 shrink-0 mt-0.5" />
                      <span className="text-slate-300 text-sm leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>

            <FadeIn delay={0.1}>
              <div className="bg-[#1A0A0A] border border-red-500/15 rounded-2xl p-7">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-7 h-7 rounded-full bg-red-500/15 flex items-center justify-center">
                    <XCircle className="w-4 h-4 text-red-400" />
                  </div>
                  <h3 className="text-red-400/80 font-bold text-sm">Probablemente no sea para ti si:</h3>
                </div>
                <ul className="space-y-3">
                  {["Buscas información gratuita.", "Quieres resultados inmediatos.", "No tienes intención real de actuar.", "Buscas recomendaciones rápidas sin involucrarte."].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <XCircle className="w-4 h-4 text-red-400/50 shrink-0 mt-0.5" />
                      <span className="text-slate-500 text-sm leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>
          </div>

          {/* Investment card */}
          <FadeIn delay={0.2}>
            <div className="relative bg-[#0F2542] border-2 border-primary/50 rounded-2xl p-8 md:p-10 shadow-xl shadow-blue-600/15">
              <div className="absolute -top-4 left-8">
                <span className="bg-primary text-white text-xs font-bold px-5 py-2 rounded-full tracking-wide shadow-lg shadow-blue-600/30">
                  Punto de entrada
                </span>
              </div>

              <div className="grid md:grid-cols-2 gap-8 items-start pt-3">
                <div>
                  <p className="text-blue-400 text-xs font-mono font-semibold tracking-[0.25em] uppercase mb-3">Inversión de acceso</p>
                  <p className="text-white text-5xl font-extrabold mb-1 tracking-tight">$10,000 <span className="text-slate-500 text-lg font-normal">USD</span></p>
                  <p className="text-slate-500 text-sm mb-5">Pago único · Sin anualidades</p>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    La inversión existe principalmente para proteger la calidad y exclusividad del círculo.
                    No buscamos curiosos. Buscamos empresarios comprometidos con construir proyectos reales.
                  </p>
                </div>
                <div className="md:border-l md:border-[#1E3A5F] md:pl-8">
                  <p className="text-slate-500 text-xs uppercase tracking-widest mb-4">El acceso incluye</p>
                  <ul className="space-y-3">
                    {["1 sesión de diagnóstico con Edmundo", "Acceso a la red de expertos", "Reuniones grupales para revisar proyectos", "Comunidad de 40+ miembros activos", "Oportunidades curadas y evaluadas"].map((item, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                        <span className="text-slate-300 text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-[#1E3A5F]">
                <button onClick={() => setShowPlanes(!showPlanes)} className="flex items-center gap-2 text-slate-400 hover:text-blue-400 text-sm transition-colors">
                  <span>{showPlanes ? "Ocultar opciones" : "Explorar más opciones"}</span>
                  <motion.span animate={{ rotate: showPlanes ? 180 : 0 }} transition={{ duration: 0.25 }} className="inline-block">
                    <ChevronDown className="w-4 h-4" />
                  </motion.span>
                </button>
              </div>
            </div>

            <AnimatePresence>
              {showPlanes && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.4, ease: "easeInOut" }} className="overflow-hidden">
                  <div className="pt-6">
                    <div className="text-center mb-8">
                      <p className="text-blue-400 text-xs font-mono tracking-[0.3em] uppercase mb-2">Planes de acceso</p>
                      <h3 className="text-white text-2xl font-bold">Elige el nivel que mejor se ajuste a tu estrategia.</h3>
                    </div>
                    <div className="grid md:grid-cols-3 gap-5">
                      {/* Entry */}
                      <div className="bg-[#0B1F3A] border border-[#1E3A5F] rounded-2xl p-6 flex flex-col">
                        <p className="text-slate-500 text-xs font-mono mb-1">Investor</p>
                        <p className="text-white text-xl font-extrabold mb-0.5">Entry</p>
                        <p className="text-white text-3xl font-extrabold mb-1">$10,000</p>
                        <p className="text-slate-500 text-xs mb-4">Primeros pasos en Estados Unidos</p>
                        <div className="flex flex-wrap gap-3 mb-5 text-xs">
                          <span className="text-slate-500">Valor: <span className="text-slate-300 font-semibold">$19,150</span></span>
                          <span className="text-blue-400 font-bold">Ahorro: $11,650</span>
                        </div>
                        <ul className="space-y-2.5 flex-1">
                          {["Deal Day & Deal Finding presencial", "Consulta de inmigración (1 hora)", "Sesiones Estratégicas", "Comunidad privada + eventos digitales", "Acceso VIP a eventos presenciales", "Ecosistema de Expertos"].map((f, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-slate-600 shrink-0 mt-0.5" />
                              <span className="text-slate-400 text-xs">{f}</span>
                            </li>
                          ))}
                        </ul>
                        <button onClick={() => openWhatsApp(WHATSAPP_PHONE, "Hola Edmundo, me interesa el plan Investor Entry del Círculo Cercano.")} className="mt-6 w-full py-3 rounded-xl border border-[#1E3A5F] hover:border-primary/40 text-slate-300 hover:text-white text-sm font-semibold transition-all">
                          Solicitar acceso
                        </button>
                      </div>

                      {/* Growth */}
                      <div className="relative bg-[#0F2542] border-2 border-primary rounded-2xl p-6 flex flex-col shadow-xl shadow-blue-600/20">
                        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                          <span className="bg-primary text-white text-xs font-bold px-4 py-1.5 rounded-full whitespace-nowrap shadow-lg">Mayor acceso</span>
                        </div>
                        <p className="text-blue-400 text-xs font-mono mb-1 mt-1">Investor</p>
                        <p className="text-white text-xl font-extrabold mb-0.5">Growth</p>
                        <p className="text-white text-3xl font-extrabold mb-1">$15,000</p>
                        <p className="text-slate-400 text-xs mb-4">Inversionistas con estrategia clara</p>
                        <div className="flex flex-wrap gap-3 mb-5 text-xs">
                          <span className="text-slate-500">Valor: <span className="text-slate-300 font-semibold">$25,000+</span></span>
                          <span className="text-blue-400 font-bold">Ahorro: $10,000+</span>
                        </div>
                        <ul className="space-y-2.5 flex-1">
                          {["Todo lo del Entry, más:", "Estrategia de acceso bancario personalizada", "Planeación patrimonial y de sucesión 1:1", "Acceso anticipado a oportunidades", "Mentoría en estructuras complejas", "Prioridad en Deal Day"].map((f, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${i === 0 ? "text-slate-500" : "text-blue-400"}`} />
                              <span className={`text-xs ${i === 0 ? "text-slate-500 font-semibold" : "text-slate-300"}`}>{f}</span>
                            </li>
                          ))}
                        </ul>
                        <button onClick={() => openWhatsApp(WHATSAPP_PHONE, "Hola Edmundo, me interesa el plan Investor Growth del Círculo Cercano.")} className="mt-6 w-full py-3 rounded-xl bg-primary hover:bg-blue-500 text-white text-sm font-bold transition-all shadow-lg shadow-blue-600/25">
                          Solicitar acceso
                        </button>
                      </div>

                      {/* Legacy */}
                      <div className="bg-[#0B1F3A] border border-[#1E3A5F] rounded-2xl p-6 flex flex-col">
                        <p className="text-slate-500 text-xs font-mono mb-1">Investor</p>
                        <p className="text-white text-xl font-extrabold mb-0.5">Legacy</p>
                        <p className="text-white text-3xl font-extrabold mb-1">$25,000</p>
                        <p className="text-slate-500 text-xs mb-4">Máximo acceso y acompañamiento</p>
                        <div className="flex flex-wrap gap-3 mb-5 text-xs">
                          <span className="text-slate-500">Valor: <span className="text-slate-300 font-semibold">$40,000+</span></span>
                          <span className="text-blue-400 font-bold">Ahorro: $15,000+</span>
                        </div>
                        <ul className="space-y-2.5 flex-1">
                          {["Todo lo del Growth, más:", "Acceso VIP a todas las oportunidades", "Mentoría exclusiva con fundadores", "Participación en decisiones estratégicas", "Networking prioritario alto nivel", "Asesoría personalizada continua"].map((f, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${i === 0 ? "text-slate-500" : "text-blue-400"}`} />
                              <span className={`text-xs ${i === 0 ? "text-slate-500 font-semibold" : "text-slate-400"}`}>{f}</span>
                            </li>
                          ))}
                        </ul>
                        <button onClick={() => openWhatsApp(WHATSAPP_PHONE, "Hola Edmundo, me interesa el plan Investor Legacy del Círculo Cercano.")} className="mt-6 w-full py-3 rounded-xl border border-[#1E3A5F] hover:border-primary/40 text-slate-300 hover:text-white text-sm font-semibold transition-all">
                          Solicitar acceso
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </FadeIn>
        </div>
      </section>

      {/* ══ CTA FINAL ══════════════════════════════════════════ */}
      <section className="relative bg-[#0B1F3A] py-36 px-4 overflow-hidden">
        {/* Full bleed bg portrait */}
        <div className="absolute inset-0 pointer-events-none">
          <img src={EDMUNDO} alt="" className="w-full h-full object-cover object-top opacity-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F3A] via-[#0B1F3A]/95 to-[#0B1F3A]" />
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_50%,_#0F2E56_0%,_transparent_70%)]" />

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <FadeIn>
            <div className="flex items-center justify-center gap-3 mb-10">
              <div className="w-12 h-0.5 bg-primary/60" />
              <span className="text-blue-400 text-xs font-mono font-semibold tracking-[0.35em] uppercase">Una última palabra</span>
              <div className="w-12 h-0.5 bg-primary/60" />
            </div>

            <img src={EDMUNDO} alt="Edmundo Treviño" className="w-20 h-20 rounded-full object-cover object-top border-2 border-primary mx-auto mb-8 shadow-xl shadow-blue-600/30" />

            <blockquote className="text-white text-3xl md:text-4xl font-light leading-tight mb-5">
              "Si pudiera regresar 20 años atrás,
              <br />le diría algo al Edmundo que apenas comenzaba:
              <br />
              <span className="font-extrabold text-blue-400">No intentes hacerlo solo."</span>
            </blockquote>
            <p className="text-blue-400 text-sm font-bold tracking-widest mb-14">— Edmundo Treviño</p>

            <div className="w-16 h-0.5 bg-primary/40 mx-auto mb-14" />

            <p className="text-slate-400 text-base mb-2">Hoy quiero extenderte esa misma mano.</p>
            <p className="text-white font-bold text-xl mb-10 max-w-xl mx-auto leading-relaxed">
              No estás comprando una membresía. Estás accediendo a años de experiencia, relaciones y criterio construidos haciendo negocios reales en Estados Unidos.
            </p>

            <div className="bg-[#0F2542] border border-[#1E3A5F] rounded-2xl p-7 mb-10 text-left max-w-xl mx-auto">
              <p className="text-white font-bold mb-2">Solicita una sesión de diagnóstico estratégico.</p>
              <p className="text-slate-400 text-sm leading-relaxed">
                Una conversación honesta donde evaluamos si el Círculo Cercano tiene sentido para tu situación. Sin compromiso. Sin presión.
              </p>
            </div>

            <button onClick={() => openWhatsApp(WHATSAPP_PHONE, WA)}
              className="inline-flex items-center gap-3 bg-primary hover:bg-blue-500 text-white font-bold px-10 py-5 rounded-xl text-base transition-all shadow-2xl shadow-blue-600/35 hover:scale-[1.02]">
              Solicitar sesión de diagnóstico
              <ArrowRight className="w-5 h-5" />
            </button>

            <p className="text-slate-600 text-xs mt-7 max-w-md mx-auto leading-relaxed">
              El Círculo Cercano no está diseñado para curiosos. Está diseñado para empresarios e inversionistas que están listos para actuar.
            </p>
          </FadeIn>
        </div>
      </section>

      <Footer />

      {/* ══ MODAL NUESTRO ENFOQUE ════════════════════════════ */}
      <AnimatePresence>
        {showEnfoque && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
            onClick={() => setShowEnfoque(false)}>
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, y: 20, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12, scale: 0.98 }} transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}>
              <button onClick={() => setShowEnfoque(false)} className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 transition-colors p-1.5 rounded-lg hover:bg-slate-100 z-10">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
              <div className="p-8 md:p-10">
                <p className="text-blue-600 text-xs font-mono font-semibold tracking-[0.25em] uppercase mb-2">Nuestro Enfoque</p>
                <h2 className="text-slate-900 text-2xl font-bold mb-2">Enfoque integral en Estados Unidos</h2>
                <p className="text-slate-500 text-sm mb-8">Cinco áreas donde el Círculo Cercano actúa con estructura y criterio.</p>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>, title: "Bienes Raíces Estratégicos", desc: "Single family homes y tierra estratégica con análisis real de entrada." },
                    { icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" /></svg>, title: "Migración con estructura", desc: "Visa E-1, E-2 o expansión empresarial alineada a inversión sostenible." },
                    { icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0 0 12 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 0 1-2.031.352 5.988 5.988 0 0 1-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971Zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 0 1-2.031.352 5.989 5.989 0 0 1-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971Z" /></svg>, title: "Estructuración LLC", desc: "Diseño correcto desde el inicio para proteger patrimonio." },
                    { icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60 60 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 3.741-1.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" /></svg>, title: "Educación Ejecutiva", desc: "Deal Days, mentorías y análisis práctico." },
                    { icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" /></svg>, title: "Red de Expertos", desc: "Abogados, contadores, brokers y consultores con experiencia real." },
                  ].map(item => (
                    <div key={item.title} className="bg-slate-50 border border-slate-100 rounded-xl p-5">
                      <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-3">{item.icon}</div>
                      <h3 className="text-slate-800 font-semibold text-sm mb-1.5">{item.title}</h3>
                      <p className="text-slate-500 text-xs leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══ MODAL METODOLOGÍA ════════════════════════════════ */}
      <AnimatePresence>
        {showMetodologia && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
            onClick={() => setShowMetodologia(false)}>
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, y: 20, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12, scale: 0.98 }} transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}>
              <button onClick={() => setShowMetodologia(false)} className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 transition-colors p-1.5 rounded-lg hover:bg-slate-100 z-10">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
              <div className="p-8 md:p-10">
                <p className="text-blue-600 text-xs font-mono font-semibold tracking-[0.25em] uppercase mb-2">Metodología</p>
                <h2 className="text-slate-900 text-2xl font-bold mb-1">El sistema detrás del Círculo Cercano</h2>
                <p className="text-slate-500 text-sm mb-8">6 pilares que transforman barreras en ventajas estratégicas</p>
                <div className="grid sm:grid-cols-2 gap-4 mb-8">
                  {[
                    { n: 1, title: "Criterio de Inversión", desc: "Decidimos con proceso, no con emoción." },
                    { n: 2, title: "Curación Estratégica", desc: "Descartamos la mayoría. Protegemos capital." },
                    { n: 3, title: "Acompañamiento Integral", desc: "Legal, fiscal, bancaria y migratoria desde el inicio." },
                    { n: 4, title: "Comunidad Ejecutora", desc: "Empresarios tomando acción comparten experiencia." },
                    { n: 5, title: "Velocidad de Activación", desc: "Inversión en 60–90 días cuando hay encaje." },
                    { n: 6, title: "Transferencia Patrimonial", desc: "Diversificación con visión de largo plazo." },
                  ].map(p => (
                    <div key={p.n} className="flex items-start gap-4 bg-slate-50 border border-slate-100 rounded-xl p-4">
                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 text-sm font-bold">{p.n}</div>
                      <div>
                        <h4 className="text-slate-800 font-semibold text-sm mb-0.5">{p.title}</h4>
                        <p className="text-slate-500 text-xs leading-relaxed">{p.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-slate-100 pt-6">
                  <p className="text-blue-600 text-xs font-mono font-semibold tracking-[0.25em] uppercase mb-4">¿Por qué es diferente?</p>
                  <h3 className="text-slate-900 font-bold text-lg mb-4">Somos sistema de inversión</h3>
                  <ul className="space-y-3 mb-6">
                    {[
                      "No vivimos de comisiones por vender activos.",
                      "No promovemos cualquier oportunidad.",
                      "No mezclamos migración con improvisación.",
                      "No dejamos que inviertas sin estructura bancaria y fiscal clara.",
                      "Solo el 20% de las oportunidades evaluadas son presentadas.",
                    ].map((d, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                        <span className="text-slate-600 text-sm">{d}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
                    <p className="text-slate-800 font-semibold text-sm mb-0.5">Somos sistema de inversión.</p>
                    <p className="text-slate-500 text-xs">No marketing de proyectos.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══ MODAL BIOGRAFÍA ═══════════════════════════════════ */}
      <AnimatePresence>
        {showBio && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
            onClick={() => setShowBio(false)}>
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, y: 20, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12, scale: 0.98 }} transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}>

              {/* Close */}
              <button onClick={() => setShowBio(false)} className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 transition-colors p-1.5 rounded-lg hover:bg-slate-100 z-10">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>

              <div className="p-8 md:p-10">
                <h2 className="text-slate-900 text-2xl font-bold mb-8">Biografía completa</h2>

                <div className="grid md:grid-cols-2 gap-10">
                  {/* Left — bio text */}
                  <div className="text-slate-600 text-sm leading-relaxed space-y-4">
                    <p>Edmundo Treviño es empresario, inversionista y fundador de Comprando América, una comunidad privada de empresarios e inversionistas latinos enfocada en crear, adquirir y escalar negocios en Estados Unidos.</p>
                    <p>Con más de 20 años de experiencia en comercio internacional y operaciones empresariales entre México y Estados Unidos, Edmundo ha fundado y operado más de 9 empresas activas en ambos países, abarcando sectores como transporte, servicios financieros, bienes raíces y consultoría estratégica.</p>
                    <p>Es egresado del MBA en Economía Industrial y cuenta con una Maestría en el Sistema Fiscal de Estados Unidos. Su enfoque se centra en la creación de riqueza patrimonial a través de estructura, criterio y ejecución — no de promesas.</p>
                    <p>A través de Comprando América, Edmundo ha acompañado a decenas de empresarios en la apertura de más de 50 LLCs, la evaluación de oportunidades de inversión y la estructuración de rutas migratorias basadas en inversión real.</p>
                  </div>

                  {/* Right — sections */}
                  <div className="space-y-7">
                    {[
                      {
                        icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60 60 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 3.741-1.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" /></svg>,
                        title: "Formación Académica",
                        items: ["MBA en Economía Industrial", "Maestría en Sistema Fiscal en Estados Unidos", "Formación continua en inversión inmobiliaria y corporativa"],
                      },
                      {
                        icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" /></svg>,
                        title: "Empresas y Operaciones",
                        items: ["9+ empresas activas en Estados Unidos y México", "Transporte, servicios financieros, bienes raíces", "Consultoría estratégica para inversionistas latinos", "50+ LLCs estructuradas para miembros de la comunidad"],
                      },
                      {
                        icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z" /></svg>,
                        title: "Enfoque Actual",
                        items: ["Comunidad de inversión Comprando América", "Cumbres y eventos presenciales de inversión", "Viajes de inspección inmobiliaria en Florida", "Acompañamiento estratégico E-2 y estructura empresarial"],
                      },
                    ].map(section => (
                      <div key={section.title}>
                        <div className="flex items-center gap-2.5 mb-3">
                          <div className="text-blue-600">{section.icon}</div>
                          <h3 className="text-slate-800 font-bold text-sm">{section.title}</h3>
                        </div>
                        <ul className="space-y-2 ml-6">
                          {section.items.map((item, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-blue-500 text-xs mt-1 shrink-0">•</span>
                              <span className="text-blue-600 text-sm">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
