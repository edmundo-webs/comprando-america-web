import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useInView } from "@/hooks/useInView";
import { openWhatsApp, WHATSAPP_PHONE } from "@/lib/whatsapp";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  CheckCircle2,
  Play,
  XCircle,
  ChevronDown,
  ChevronRight,
  Users,
  TrendingUp,
  Shield,
  Globe,
  BookOpen,
  Lightbulb,
  Star,
  Building2,
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

/* ── timeline data ── */
const hitos = [
  {
    year: "2003",
    label: "Llegué a Estados Unidos",
    icon: "✈️",
    story:
      "Con sueños, incertidumbre y muchas preguntas. Sin mapa. Sin red de contactos. Sin saber exactamente qué construiría.",
    highlight: "El inicio del camino.",
  },
  {
    year: "2004",
    label: "Abrí mis primeras empresas",
    icon: "🏢",
    story:
      "Aprendí sobre la marcha. Sin mentores locales. Cometiendo errores de principiante que hoy hubiera evitado con un solo consejo correcto.",
    highlight: "Aprendiendo sin red.",
  },
  {
    year: "2006",
    label: "Perdí dinero",
    icon: "📉",
    story:
      "Confié en las personas equivocadas. No tenía los instrumentos para evaluar oportunidades correctamente. Esa pérdida me enseñó más que cualquier éxito.",
    highlight: "El error más valioso.",
  },
  {
    year: "2008",
    label: "Cometí errores costosos",
    icon: "⚠️",
    story:
      "Decisiones que hoy haría completamente diferente. Estructuras incorrectas, contratos mal negociados, socios mal elegidos.",
    highlight: "Lecciones que duelen.",
  },
  {
    year: "2005–2024",
    label: "Renovando visa E-2",
    icon: "🛂",
    story:
      "Durante más de 20 años mantuve activa mi visa E-2. Eso significa negocios operando, creciendo y generando empleos reales en Estados Unidos.",
    highlight: "20+ años de operación.",
  },
  {
    year: "2010",
    label: "Litigios y negociaciones difíciles",
    icon: "⚖️",
    story:
      "Enfrenté situaciones legales que nadie me dijo que podían ocurrir. Salí adelante. Y con eso aprendí a estructurar mejor desde el inicio.",
    highlight: "Proteger el patrimonio.",
  },
  {
    year: "2012",
    label: "Compré y vendí empresas",
    icon: "🔄",
    story:
      "Empecé a entender los ciclos de negocios. Cómo valorar, cómo negociar, cómo salir. El proceso completo, no solo la entrada.",
    highlight: "Ciclos completos.",
  },
  {
    year: "2015",
    label: "Construí relaciones de confianza",
    icon: "🤝",
    story:
      "Los mejores abogados, contadores, asesores migratorios y bancos no se encuentran en Google. Se consiguen con años de relaciones construidas.",
    highlight: "La red más valiosa.",
  },
  {
    year: "2020",
    label: "Descubrí patrones de éxito y fracaso",
    icon: "🔭",
    story:
      "Después de ver decenas de historias, empecé a ver patrones claros. Hay errores que casi todos cometen. Y hay decisiones que casi siempre funcionan.",
    highlight: "El criterio como activo.",
  },
  {
    year: "Hoy",
    label: "Hoy acompaño a otros empresarios",
    icon: "🌐",
    story:
      "Decidí abrir mi círculo más cercano para empresarios e inversionistas que quieren construir en Estados Unidos con más claridad y menos errores.",
    highlight: "Pasando la antorcha.",
  },
];

/* ── concept map data ── */
const ramas = [
  {
    id: "claridad",
    label: "Claridad",
    icon: <Lightbulb className="w-5 h-5" />,
    color: "from-blue-500/20 to-blue-600/10",
    borderColor: "border-blue-500/40",
    desc: "Te ayudo a ordenar las ideas y definir qué tiene sentido para ti específicamente. No hay una sola respuesta correcta. Pero hay preguntas correctas que te llevan a la tuya.",
    angle: -90,
  },
  {
    id: "criterio",
    label: "Criterio",
    icon: <Shield className="w-5 h-5" />,
    color: "from-indigo-500/20 to-indigo-600/10",
    borderColor: "border-indigo-500/40",
    desc: "Aprenderás a identificar riesgos ocultos, hacer mejores preguntas y evaluar oportunidades más allá de una presentación comercial.",
    angle: -30,
  },
  {
    id: "relaciones",
    label: "Relaciones",
    icon: <Users className="w-5 h-5" />,
    color: "from-cyan-500/20 to-cyan-600/10",
    borderColor: "border-cyan-500/40",
    desc: "Acceso a mi red de abogados, contadores, bancos y operadores construida durante más de 20 años. No se consigue en Google.",
    angle: 30,
  },
  {
    id: "comunidad",
    label: "Comunidad",
    icon: <Globe className="w-5 h-5" />,
    color: "from-teal-500/20 to-teal-600/10",
    borderColor: "border-teal-500/40",
    desc: "40+ empresarios e inversionistas activos. Algunos llegan buscando orientación. Otros, perspectivas. Muchos permanecen porque las mejores decisiones rara vez se toman solos.",
    angle: 90,
  },
  {
    id: "oportunidades",
    label: "Oportunidades",
    icon: <TrendingUp className="w-5 h-5" />,
    color: "from-emerald-500/20 to-emerald-600/10",
    borderColor: "border-emerald-500/40",
    desc: "No todo llega aquí. Solo proyectos que yo mismo evalúo primero. Empresas, inmuebles, fondos y operaciones reales.",
    angle: 150,
  },
  {
    id: "estructura",
    label: "Estructura",
    icon: <Building2 className="w-5 h-5" />,
    color: "from-violet-500/20 to-violet-600/10",
    borderColor: "border-violet-500/40",
    desc: "Legal, fiscal, migratoria. La estructura correcta desde el inicio evita años de problemas. Te guío para que no improvises.",
    angle: 210,
  },
  {
    id: "perspectiva",
    label: "Perspectiva",
    icon: <BookOpen className="w-5 h-5" />,
    color: "from-pink-500/20 to-pink-600/10",
    borderColor: "border-pink-500/40",
    desc: "Visión de largo plazo. El patrimonio no se construye en un trimestre. Aprenderás a pensar en décadas, no en meses.",
    angle: 270,
  },
];

/* ── expert network ── */
const expertos = [
  {
    name: "Joe Faraci",
    role: "Inversionista en Bienes Raíces",
    photo: "https://res.cloudinary.com/dgruohz6f/image/upload/v1773439239/comprando-america/YfxVlywHHLmCeDRI.png",
    bio: "Propietario de 250+ propiedades con 28 años de experiencia. Especialista en crear riqueza transgeneracional con Real Estate en Estados Unidos.",
  },
  {
    name: "Tomás Resendez",
    role: "Abogado de Inmigración",
    photo: "https://res.cloudinary.com/dgruohz6f/image/upload/v1782674490/tts-news/eyuxiu9xuevkwulfcf2j.jpg",
    bio: "Especialista en inmigración corporativa con experiencia representando a Fortune 100. Bilingüe (inglés–español), garantiza asesoramiento legal claro y preciso.",
  },
  {
    name: "Daniel Palacios",
    role: "Contador CPA y Fiscalista",
    photo: "https://res.cloudinary.com/dgruohz6f/image/upload/v1773439319/comprando-america/szrwwapkIJnWAmaW.png",
    bio: "Especialista en contabilidad empresarial y planeación fiscal. Experto asesorando a empresas y particulares con socios latinos.",
  },
  {
    name: "Aubrey Dwyer",
    role: "Abogada Corporativa",
    photo: "https://res.cloudinary.com/dgruohz6f/image/upload/v1773439190/comprando-america/TehgUNVHXbrssxsK.jpg",
    bio: "Especializada en apertura de empresas, contratos y trademarks. Graduada de la Facultad de Derecho de la Universidad de Oklahoma.",
  },
  {
    name: "Destiny Bounds",
    role: "Abogada Corporativa y PI",
    photo: "https://res.cloudinary.com/dgruohz6f/image/upload/v1773439307/comprando-america/pdCooMLqOfvqVFar.avif",
    bio: "Fundadora de Bounds Law LLC, especializada en derecho corporativo, pequeñas empresas y propiedad intelectual. Autora y conferencista nacional.",
  },
  {
    name: "Sebastián Jara",
    role: "Consultor de Marketing Digital",
    photo: "https://res.cloudinary.com/dgruohz6f/image/upload/v1773439309/comprando-america/qrZqfOUTzqKwJcYP.avif",
    bio: "15+ años optimizando estrategias digitales y procesos de marketing con automatización e IA para empresas en inmobiliario, educación y e-commerce.",
  },
  {
    name: "John McKee",
    role: "Consultor Comercial",
    photo: "https://res.cloudinary.com/dgruohz6f/image/upload/v1773439319/comprando-america/szrwwapkIJnWAmaW.png",
    bio: "Experto en Estrategia Comercial con 35+ años adaptando productos al mercado estadounidense en manufactura, consumo masivo y tecnología.",
  },
];

/* ── member profiles ── */
const perfiles = [
  { type: "Empresarios", icon: "🏢", count: "12+" },
  { type: "Desarrolladores", icon: "🏗️", count: "8+" },
  { type: "Industriales", icon: "⚙️", count: "5+" },
  { type: "Inversionistas", icon: "📈", count: "9+" },
  { type: "Exportadores", icon: "🌎", count: "4+" },
  { type: "Profesionales", icon: "👔", count: "6+" },
];

/* ── books ── */
const libros = [
  {
    title: "The E-Myth Revisited",
    author: "Michael E. Gerber",
    note: "Entender la diferencia entre trabajar en tu negocio y trabajar para tu negocio.",
  },
  {
    title: "Rich Dad Poor Dad",
    author: "Robert Kiyosaki",
    note: "La mentalidad que te enseñan vs. la que te hace libre financieramente.",
  },
  {
    title: "Never Split the Difference",
    author: "Chris Voss",
    note: "Negociación real. No teoría. Técnicas de un ex-negociador del FBI.",
  },
  {
    title: "The Millionaire Next Door",
    author: "Thomas Stanley",
    note: "Cómo realmente se construye patrimonio. Sin atajos.",
  },
];

/* ── situaciones ── */
const situaciones = [
  { id: 1, text: "Tengo capital pero no sé por dónde empezar." },
  { id: 2, text: "Quiero invertir pero no sé en quién confiar." },
  { id: 3, text: "Quiero construir patrimonio en Estados Unidos." },
  { id: 4, text: "Quiero explorar opciones para mi familia." },
  { id: 5, text: "Ya invierto, pero quiero contrastar ideas." },
  { id: 6, text: "Quiero evitar errores costosos." },
];

/* ════════════════════════════════════════════════════════ */
export default function CirculoCercano() {
  const [showHeroVideo, setShowHeroVideo] = useState(false);
  const [selectedCards, setSelectedCards] = useState<Set<number>>(new Set());
  const [activeHito, setActiveHito] = useState<number | null>(null);
  const [activeRama, setActiveRama] = useState<string | null>(null);
  const [openLibro, setOpenLibro] = useState<number | null>(null);
  const [showPlanes, setShowPlanes] = useState(false);
  const [openTestimonio, setOpenTestimonio] = useState<number | null>(null);
  const [openExperto, setOpenExperto] = useState<number | null>(null);
  const heroRef = useRef<HTMLElement>(null);

  function toggleCard(id: number) {
    setSelectedCards((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function scrollToHero() {
    heroRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  const activeRamaData = ramas.find((r) => r.id === activeRama);

  return (
    <div className="min-h-screen bg-[#0B1F3A] text-white overflow-x-hidden">
      <Navbar />

      {/* ══════════════════════════════════════
          PANTALLA 1 — HERO
      ══════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex flex-col items-center justify-center pt-28 pb-20 px-4"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#132D50_0%,_#0B1F3A_65%)] pointer-events-none" />
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-blue-500/5"
              style={{
                width: `${200 + i * 80}px`,
                height: `${200 + i * 80}px`,
                left: "50%",
                top: "50%",
                x: "-50%",
                y: "-50%",
              }}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
            />
          ))}
        </div>

        <div className="relative z-10 w-full max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="inline-block text-blue-400 text-xs font-semibold tracking-[0.3em] uppercase mb-8 font-mono">
              Edmundo Treviño · Comprando América 2026
            </span>

            <h1 className="text-4xl md:text-5xl lg:text-6xl text-white leading-[1.1] mb-6 font-light">
              Quiero invitarte personalmente
              <br />
              <span className="font-bold">a mi Círculo Cercano.</span>
            </h1>

            <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
              Si estás explorando Estados Unidos para invertir, proteger patrimonio o construir opciones
              para tu familia, el verdadero reto no es encontrar oportunidades.
              <br />
              <span className="text-slate-300 font-medium">Es saber en quién confiar y qué camino tiene sentido para ti.</span>
            </p>

            <motion.button
              onClick={() => {
                const el = document.getElementById("situaciones");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-3 bg-primary hover:bg-blue-600 text-white font-semibold px-10 py-5 rounded-xl text-base shadow-xl shadow-blue-600/30 transition-colors mb-12"
            >
              Descubre si este círculo es para ti <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>

          {/* Hero video */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="relative rounded-2xl overflow-hidden border border-[#1E3A5F] bg-black aspect-video shadow-2xl shadow-black/60"
          >
            {!showHeroVideo ? (
              <button
                onClick={() => setShowHeroVideo(true)}
                className="group relative w-full h-full block"
                aria-label="Reproducir video de Edmundo Treviño"
              >
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#0B1F3A] via-[#0d2a4a] to-[#091A30]" />

                {/* Decorative rings */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-64 h-64 rounded-full border border-blue-500/10" />
                  <div className="absolute w-48 h-48 rounded-full border border-blue-500/15" />
                  <div className="absolute w-32 h-32 rounded-full border border-blue-500/20" />
                </div>

                {/* Edmundo portrait — right side */}
                <div className="absolute right-0 bottom-0 h-full flex items-end justify-end overflow-hidden">
                  <img
                    src={EDMUNDO_PORTRAIT}
                    alt="Edmundo Treviño"
                    className="h-full object-cover object-top opacity-60 group-hover:opacity-70 transition-opacity duration-500"
                    style={{ maxWidth: "55%" }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#0B1F3A] via-[#0B1F3A]/60 to-transparent" />
                </div>

                {/* Text + play — left side */}
                <div className="absolute inset-0 flex flex-col items-start justify-center px-10 gap-6">
                  <div>
                    <p className="text-blue-400 text-xs font-semibold tracking-[0.25em] uppercase font-mono mb-3">
                      Círculo Cercano · 2026
                    </p>
                    <h3 className="text-white text-2xl md:text-3xl font-light leading-snug max-w-xs">
                      Edmundo te habla
                      <br />
                      <span className="font-bold">directamente.</span>
                    </h3>
                  </div>

                  <motion.div
                    className="flex items-center gap-4"
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="w-16 h-16 rounded-full bg-primary group-hover:bg-blue-500 transition-colors flex items-center justify-center shadow-2xl shadow-blue-600/50">
                      <Play className="w-6 h-6 text-white ml-1" />
                    </div>
                    <span className="text-white/70 text-sm font-medium group-hover:text-white transition-colors">
                      Ver mensaje
                    </span>
                  </motion.div>
                </div>
              </button>
            ) : (
              <video src={VIDEO_URL} controls autoPlay className="w-full h-full" poster={VIDEO_POSTER} />
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
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
          PANTALLA 2 — ¿TE IDENTIFICAS?
      ══════════════════════════════════════ */}
      <section id="situaciones" className="bg-[#091A30] py-24 md:py-32 px-4">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <div className="text-center mb-16">
              <span className="text-blue-400 text-xs font-semibold tracking-[0.3em] uppercase font-mono">
                Microdiagnóstico
              </span>
              <h2 className="text-3xl md:text-4xl text-white mt-4 mb-4 leading-tight">
                ¿Te identificas con alguna de estas situaciones?
              </h2>
              <p className="text-slate-400 max-w-xl mx-auto text-base">
                Selecciona las que apliquen para ti.
              </p>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-4">
            {situaciones.map((s, i) => {
              const selected = selectedCards.has(s.id);
              return (
                <FadeIn key={s.id} delay={i * 0.07}>
                  <motion.button
                    onClick={() => toggleCard(s.id)}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className={`w-full text-left rounded-xl p-6 border transition-all duration-200 group ${
                      selected
                        ? "bg-primary/10 border-primary/60 shadow-lg shadow-blue-600/10"
                        : "bg-[#0F2542] border-[#1E3A5F] hover:border-blue-500/30"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-5 h-5 rounded-full border-2 shrink-0 mt-0.5 flex items-center justify-center transition-all ${
                          selected ? "border-primary bg-primary" : "border-slate-600 group-hover:border-blue-500/50"
                        }`}
                      >
                        {selected && (
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 12 12">
                            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                      <p className={`text-sm leading-relaxed transition-colors ${selected ? "text-white" : "text-slate-300"}`}>
                        {s.text}
                      </p>
                    </div>
                  </motion.button>
                </FadeIn>
              );
            })}
          </div>

          <AnimatePresence>
            {selectedCards.size >= 2 && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.4 }}
                className="mt-10 bg-primary/10 border border-primary/30 rounded-xl p-8 text-center"
              >
                <p className="text-white font-semibold text-lg mb-2">
                  Probablemente este círculo puede ayudarte.
                </p>
                <p className="text-slate-400 text-sm mb-6 max-w-lg mx-auto">
                  Te identificas con {selectedCards.size} situaciones. El primer paso es una conversación honesta.
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
          PANTALLA 3 — TIMELINE INTERACTIVA
      ══════════════════════════════════════ */}
      <section className="bg-[#0B1F3A] py-24 md:py-32 px-4">
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <div className="mb-16 max-w-2xl">
              <span className="text-blue-400 text-xs font-semibold tracking-[0.3em] uppercase font-mono">
                Mi historia en 20 años
              </span>
              <h2 className="text-3xl md:text-4xl text-white mt-4 mb-4 leading-tight">
                No aprendí haciendo cursos.
                <br />
                <span className="text-blue-400">Aprendí haciendo negocios.</span>
              </h2>
              <p className="text-slate-400 text-lg leading-relaxed">
                Haz clic en cada hito para conocer la historia detrás de él.
              </p>
            </div>
          </FadeIn>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-6 md:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-blue-500/60 via-blue-500/20 to-transparent" />

            <div className="space-y-3">
              {hitos.map((h, i) => {
                const isOpen = activeHito === i;
                return (
                  <FadeIn key={i} delay={i * 0.05}>
                    <div className="relative pl-16 md:pl-20">
                      {/* Node */}
                      <motion.div
                        className={`absolute left-4 md:left-6 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all cursor-pointer z-10 ${
                          isOpen
                            ? "bg-primary border-primary shadow-lg shadow-blue-500/40"
                            : "bg-[#0B1F3A] border-blue-500/50 hover:border-blue-400"
                        }`}
                        style={{ top: "1.25rem" }}
                        onClick={() => setActiveHito(isOpen ? null : i)}
                        whileHover={{ scale: 1.2 }}
                      >
                        {isOpen && <div className="w-2 h-2 rounded-full bg-white" />}
                      </motion.div>

                      <button
                        onClick={() => setActiveHito(isOpen ? null : i)}
                        className="w-full text-left"
                      >
                        <div
                          className={`rounded-xl border transition-all duration-200 ${
                            isOpen
                              ? "bg-[#0F2542] border-blue-500/40"
                              : "bg-[#091A30] border-[#1E3A5F] hover:border-blue-500/30"
                          }`}
                        >
                          <div className="flex items-center gap-4 p-4 md:p-5">
                            <span className="text-xl shrink-0">{h.icon}</span>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-3">
                                <span className="text-blue-400 text-xs font-mono font-bold">{h.year}</span>
                                <span className="text-white font-medium text-sm md:text-base">{h.label}</span>
                              </div>
                            </div>
                            <motion.div
                              animate={{ rotate: isOpen ? 180 : 0 }}
                              transition={{ duration: 0.2 }}
                              className="shrink-0"
                            >
                              <ChevronDown className="w-4 h-4 text-slate-500" />
                            </motion.div>
                          </div>

                          <AnimatePresence>
                            {isOpen && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                className="overflow-hidden"
                              >
                                <div className="px-4 md:px-5 pb-5 border-t border-[#1E3A5F] pt-4">
                                  <p className="text-slate-300 text-sm leading-relaxed mb-3">{h.story}</p>
                                  <span className="inline-flex items-center gap-2 text-blue-400 text-xs font-semibold bg-blue-500/10 px-3 py-1.5 rounded-full">
                                    <Star className="w-3 h-3" /> {h.highlight}
                                  </span>
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

          <FadeIn delay={0.6}>
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
          PANTALLA 4 — MAPA CONCEPTUAL
      ══════════════════════════════════════ */}
      <section className="bg-[#091A30] py-24 md:py-32 px-4">
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <div className="text-center mb-16">
              <span className="text-blue-400 text-xs font-semibold tracking-[0.3em] uppercase font-mono">
                ¿Cómo puedo ayudarte?
              </span>
              <h2 className="text-3xl md:text-4xl text-white mt-4 mb-4 leading-tight">
                Siete dimensiones donde el círculo
                <br className="hidden md:block" /> marca la diferencia.
              </h2>
              <p className="text-slate-400 text-base max-w-xl mx-auto">
                Haz clic en cada área para entender cómo aplica a tu situación.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {ramas.map((rama, i) => {
              const isActive = activeRama === rama.id;
              return (
                <FadeIn key={rama.id} delay={i * 0.06}>
                  <motion.button
                    onClick={() => setActiveRama(isActive ? null : rama.id)}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className={`w-full rounded-2xl border p-5 flex flex-col items-center gap-3 transition-all duration-200 text-center ${
                      isActive
                        ? `bg-gradient-to-br ${rama.color} ${rama.borderColor} shadow-lg`
                        : "bg-[#0F2542] border-[#1E3A5F] hover:border-blue-500/30"
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        isActive ? "bg-white/10" : "bg-[#132D50]"
                      }`}
                    >
                      {rama.icon}
                    </div>
                    <span className={`font-semibold text-sm transition-colors ${isActive ? "text-white" : "text-slate-300"}`}>
                      {rama.label}
                    </span>
                  </motion.button>
                </FadeIn>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            {activeRamaData && (
              <motion.div
                key={activeRamaData.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className={`mt-6 bg-gradient-to-br ${activeRamaData.color} border ${activeRamaData.borderColor} rounded-2xl p-6 md:p-8`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                    {activeRamaData.icon}
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg mb-2">{activeRamaData.label}</h3>
                    <p className="text-slate-300 text-sm leading-relaxed">{activeRamaData.desc}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Central idea */}
          <FadeIn delay={0.5}>
            <div className="mt-14 bg-[#0B1F3A] border border-[#1E3A5F] rounded-2xl p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center mx-auto mb-4">
                <img
                  src={EDMUNDO_PORTRAIT}
                  alt="Edmundo Treviño"
                  className="w-12 h-12 rounded-full object-cover object-top"
                />
              </div>
              <p className="text-white font-semibold text-xl mb-2">Edmundo Treviño</p>
              <p className="text-slate-400 text-sm max-w-md mx-auto">
                El centro del círculo. 20+ años de experiencia en negocios, inversiones y patrimonio en Estados Unidos.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ══════════════════════════════════════
          PANTALLA 5 — RED DE EXPERTOS
      ══════════════════════════════════════ */}
      <section className="bg-[#0B1F3A] py-24 md:py-32 px-4">
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <div className="text-center mb-16">
              <span className="text-blue-400 text-xs font-semibold tracking-[0.3em] uppercase font-mono">
                Lo que llevamos en el morral
              </span>
              <h2 className="text-3xl md:text-4xl text-white mt-4 mb-4 leading-tight">
                Una red construida durante 20 años.
                <br />No se consigue en Google.
              </h2>
              <p className="text-slate-400 max-w-xl mx-auto text-base leading-relaxed">
                Nuestros miembros pueden acceder a esta red o trabajar con sus propios asesores.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {expertos.map((e, i) => {
              const isOpen = openExperto === i;
              return (
                <FadeIn key={i} delay={i * 0.07}>
                  <motion.div
                    whileHover={{ y: -3 }}
                    className="bg-[#0F2542] border border-[#1E3A5F] hover:border-blue-500/30 rounded-2xl overflow-hidden transition-all group"
                  >
                    {/* Photo */}
                    <div className="relative h-52 overflow-hidden bg-[#091A30]">
                      <img
                        src={e.photo}
                        alt={e.name}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0F2542] via-transparent to-transparent" />
                    </div>

                    {/* Info */}
                    <div className="p-5">
                      <h3 className="text-white font-semibold text-base mb-0.5">{e.name}</h3>
                      <p className="text-blue-400 text-xs font-medium mb-3">{e.role}</p>

                      <button
                        onClick={() => setOpenExperto(isOpen ? null : i)}
                        className="flex items-center gap-1.5 text-slate-500 hover:text-slate-300 text-xs transition-colors"
                      >
                        <span>{isOpen ? "Ocultar" : "Ver reseña"}</span>
                        <motion.span
                          animate={{ rotate: isOpen ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                          className="inline-block"
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </motion.span>
                      </button>

                      <AnimatePresence>
                        {isOpen && (
                          <motion.p
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="overflow-hidden text-slate-400 text-xs leading-relaxed mt-3"
                          >
                            {e.bio}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                </FadeIn>
              );
            })}
          </div>

          <FadeIn delay={0.5}>
            <div className="mt-12 bg-[#091A30] border border-[#1E3A5F] rounded-2xl p-8">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <img
                  src={EDMUNDO_PORTRAIT}
                  alt="Edmundo Treviño"
                  className="w-16 h-16 rounded-full object-cover object-top border-2 border-[#1E3A5F] shrink-0"
                />
                <p className="text-slate-300 text-base leading-relaxed italic text-center md:text-left">
                  "Durante más de 20 años hemos construido relaciones basadas en confianza, ética y resultados.
                  No en comisiones. No en conveniencia. En resultados reales."
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ══════════════════════════════════════
          PANTALLA 6 — EL CÍRCULO (ecosistema)
      ══════════════════════════════════════ */}
      <section className="bg-[#091A30] py-24 md:py-32 px-4">
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <div className="text-center mb-16">
              <span className="text-blue-400 text-xs font-semibold tracking-[0.3em] uppercase font-mono">
                El Círculo
              </span>
              <h2 className="text-3xl md:text-4xl text-white mt-4 mb-4 leading-tight">
                40+ empresarios e inversionistas activos.
              </h2>
              <p className="text-slate-400 max-w-xl mx-auto text-base leading-relaxed">
                Muchos miembros llegan buscando orientación. Otros llegan buscando perspectivas.
                Sin embargo, permanecen porque{" "}
                <span className="text-white font-medium">
                  las mejores decisiones rara vez se toman solos.
                </span>
              </p>
            </div>
          </FadeIn>

          {/* Ecosystem visual */}
          <FadeIn delay={0.1}>
            <div className="relative flex items-center justify-center mb-12">
              {/* Outer ring decoration */}
              <div className="absolute w-72 h-72 md:w-96 md:h-96 rounded-full border border-blue-500/10" />
              <div className="absolute w-52 h-52 md:w-72 md:h-72 rounded-full border border-blue-500/15" />

              {/* Center */}
              <div className="relative z-10 w-24 h-24 rounded-full bg-primary/20 border-2 border-primary/50 flex flex-col items-center justify-center shadow-xl shadow-blue-600/20">
                <img
                  src={EDMUNDO_PORTRAIT}
                  alt="Edmundo"
                  className="w-16 h-16 rounded-full object-cover object-top"
                />
              </div>

              {/* Orbiting profiles */}
              {perfiles.map((p, i) => {
                const angle = (i / perfiles.length) * 360 - 90;
                const rad = (angle * Math.PI) / 180;
                const r = 140;
                const x = Math.cos(rad) * r;
                const y = Math.sin(rad) * r;
                return (
                  <motion.div
                    key={p.type}
                    className="absolute z-10"
                    style={{ left: "50%", top: "50%", x: x - 40, y: y - 40 }}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                  >
                    <div className="w-20 h-20 rounded-xl bg-[#0F2542] border border-[#1E3A5F] hover:border-blue-500/40 transition-all flex flex-col items-center justify-center gap-1 cursor-default">
                      <span className="text-xl">{p.icon}</span>
                      <span className="text-white text-xs font-semibold text-center leading-tight px-1">
                        {p.type}
                      </span>
                      <span className="text-blue-400 text-xs font-bold font-mono">{p.count}</span>
                    </div>
                  </motion.div>
                );
              })}

              <div className="w-72 h-72 md:w-96 md:h-96" />
            </div>
          </FadeIn>

          {/* Stats */}
          <FadeIn delay={0.3}>
            <div className="grid grid-cols-3 gap-4 mt-8">
              {[
                { n: "40+", label: "Miembros activos" },
                { n: "20+", label: "Años de experiencia" },
                { n: "100K+", label: "USD mínimo para actuar" },
              ].map((s, i) => (
                <div key={i} className="bg-[#0F2542] border border-[#1E3A5F] rounded-xl p-5 text-center">
                  <p className="text-white text-2xl md:text-3xl font-bold mb-1">{s.n}</p>
                  <p className="text-slate-500 text-xs">{s.label}</p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ══════════════════════════════════════
          TESTIMONIOS
      ══════════════════════════════════════ */}
      <section className="bg-[#0B1F3A] py-24 md:py-32 px-4">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <div className="text-center mb-16">
              <span className="text-blue-400 text-xs font-semibold tracking-[0.3em] uppercase font-mono">
                Lo que dicen los miembros
              </span>
              <h2 className="text-3xl md:text-4xl text-white mt-4 mb-4 leading-tight">
                No son testimonios de rentabilidad.
                <br />Son testimonios de <span className="text-blue-400">claridad.</span>
              </h2>
            </div>
          </FadeIn>

          <div className="space-y-4">
            {[
              {
                name: "Miembro del Círculo",
                role: "Empresario industrial, México",
                text: "Llegué con muchas dudas sobre cómo estructurar mi inversión. No necesitaba que alguien me dijera qué comprar. Necesitaba criterio para decidir bien. Eso es exactamente lo que encontré.",
              },
              {
                name: "Miembro del Círculo",
                role: "Inversionista de bienes raíces",
                text: "La sesión de diagnóstico me ahorró cometer un error de $200,000 dólares. No exagero. La conversación me ayudó a ver lo que yo no podía ver porque estaba demasiado cerca del proyecto.",
              },
              {
                name: "Miembro del Círculo",
                role: "Empresario exportador",
                text: "Lo más valioso no es la red de expertos, aunque es excelente. Es la forma en que Edmundo te hace las preguntas correctas. Te obliga a pensar diferente.",
              },
            ].map((t, i) => {
              const isOpen = openTestimonio === i;
              return (
                <FadeIn key={i} delay={i * 0.1}>
                  <div
                    className={`rounded-xl border transition-all ${
                      isOpen ? "bg-[#0F2542] border-blue-500/30" : "bg-[#091A30] border-[#1E3A5F]"
                    }`}
                  >
                    <button
                      onClick={() => setOpenTestimonio(isOpen ? null : i)}
                      className="w-full flex items-center gap-4 p-5 text-left"
                    >
                      <div className="w-10 h-10 rounded-full bg-[#132D50] border border-[#1E3A5F] flex items-center justify-center shrink-0">
                        <Users className="w-4 h-4 text-blue-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium text-sm">{t.name}</p>
                        <p className="text-slate-500 text-xs">{t.role}</p>
                      </div>
                      <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                        <ChevronDown className="w-4 h-4 text-slate-500" />
                      </motion.div>
                    </button>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="px-5 pb-5 pt-1 border-t border-[#1E3A5F]">
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

      {/* ══════════════════════════════════════
          BIBLIOTECA RECOMENDADA
      ══════════════════════════════════════ */}
      <section className="bg-[#091A30] py-24 md:py-32 px-4">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <div className="text-center mb-16">
              <span className="text-blue-400 text-xs font-semibold tracking-[0.3em] uppercase font-mono">
                Biblioteca de Edmundo
              </span>
              <h2 className="text-3xl md:text-4xl text-white mt-4 mb-4 leading-tight">
                Los libros que transformaron mi visión.
              </h2>
              <p className="text-slate-400 text-base max-w-lg mx-auto">
                No son los libros más famosos. Son los que más me han marcado. Haz clic para ver por qué.
              </p>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-4">
            {libros.map((libro, i) => {
              const isOpen = openLibro === i;
              return (
                <FadeIn key={i} delay={i * 0.08}>
                  <div
                    className={`rounded-xl border transition-all ${
                      isOpen ? "bg-[#0F2542] border-blue-500/30" : "bg-[#0B1F3A] border-[#1E3A5F] hover:border-blue-500/20"
                    }`}
                  >
                    <button
                      onClick={() => setOpenLibro(isOpen ? null : i)}
                      className="w-full flex items-center gap-4 p-5 text-left"
                    >
                      <div className="w-10 h-10 rounded-lg bg-[#132D50] flex items-center justify-center shrink-0">
                        <BookOpen className="w-5 h-5 text-blue-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-semibold text-sm">{libro.title}</p>
                        <p className="text-slate-500 text-xs">{libro.author}</p>
                      </div>
                      <ChevronRight
                        className={`w-4 h-4 text-slate-500 shrink-0 transition-transform ${isOpen ? "rotate-90" : ""}`}
                      />
                    </button>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="px-5 pb-5 border-t border-[#1E3A5F] pt-4">
                            <p className="text-slate-300 text-sm leading-relaxed">
                              <span className="text-blue-400 font-semibold">Por qué lo recomiendo: </span>
                              {libro.note}
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

      {/* ══════════════════════════════════════
          PANTALLA 7 — ¿ES PARA TI?
      ══════════════════════════════════════ */}
      <section className="bg-[#0B1F3A] py-24 md:py-32 px-4">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <div className="text-center mb-16">
              <span className="text-blue-400 text-xs font-semibold tracking-[0.3em] uppercase font-mono">
                Filtro de acceso
              </span>
              <h2 className="text-3xl md:text-4xl text-white mt-4 mb-4 leading-tight">
                Este círculo no es para todos.
              </h2>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-6">
            {/* SÍ */}
            <FadeIn>
              <div className="bg-[#0A1E35] border border-green-500/20 rounded-2xl p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                  </div>
                  <h3 className="text-green-400 font-semibold">Sí puede ser para ti si:</h3>
                </div>
                <ul className="space-y-3">
                  {[
                    "Cuentas con al menos USD $100,000 para invertir.",
                    "Quieres construir algo serio en Estados Unidos.",
                    "Valoras la experiencia y las relaciones.",
                    "Entiendes que el patrimonio se construye a largo plazo.",
                    "Buscas acompañamiento y criterio.",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                      <span className="text-slate-300 text-sm leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>

            {/* NO */}
            <FadeIn delay={0.1}>
              <div className="bg-[#1A0E0E] border border-red-500/15 rounded-2xl p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                    <XCircle className="w-4 h-4 text-red-400" />
                  </div>
                  <h3 className="text-red-400 font-semibold">Probablemente no sea para ti si:</h3>
                </div>
                <ul className="space-y-3">
                  {[
                    "Buscas información gratuita.",
                    "Quieres resultados inmediatos.",
                    "No tienes intención real de actuar.",
                    "Buscas recomendaciones rápidas sin involucrarte.",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <XCircle className="w-4 h-4 text-red-400/70 shrink-0 mt-0.5" />
                      <span className="text-slate-400 text-sm leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>
          </div>

          {/* Investment box */}
          <FadeIn delay={0.3}>
            <div className="mt-10">
              {/* Main recommended plan */}
              <div className="relative bg-[#0E2544] border-2 border-primary/50 rounded-2xl p-8 md:p-10 shadow-xl shadow-blue-600/10">
                {/* Recommended badge */}
                <div className="absolute -top-3.5 left-8">
                  <span className="bg-primary text-white text-xs font-bold px-4 py-1.5 rounded-full tracking-wide shadow-lg">
                    Recomendado
                  </span>
                </div>

                <div className="grid md:grid-cols-2 gap-8 items-start pt-2">
                  <div>
                    <p className="text-blue-400 text-xs font-semibold tracking-[0.2em] uppercase font-mono mb-4">
                      Inversión de acceso
                    </p>
                    <p className="text-white text-4xl font-bold mb-1">USD $10,000</p>
                    <p className="text-slate-500 text-sm mb-5">Pago único · Sin anualidades</p>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      La inversión de acceso existe principalmente para proteger la calidad y exclusividad del círculo.
                      No buscamos curiosos. Buscamos empresarios e inversionistas comprometidos con construir proyectos reales.
                    </p>
                  </div>
                  <div className="md:border-l md:border-[#1E3A5F] md:pl-8">
                    <p className="text-slate-400 text-sm mb-4">El acceso incluye:</p>
                    <ul className="space-y-2.5">
                      {[
                        "Sesión de diagnóstico estratégico",
                        "Acceso a la red de expertos",
                        "Reuniones privadas con Edmundo",
                        "Comunidad de 40+ miembros",
                        "Oportunidades curadas",
                      ].map((item, i) => (
                        <li key={i} className="flex items-center gap-2.5">
                          <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                          <span className="text-slate-300 text-sm">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Expandir planes */}
                <div className="mt-8 pt-6 border-t border-[#1E3A5F]">
                  <button
                    onClick={() => setShowPlanes(!showPlanes)}
                    className="flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors group"
                  >
                    <span>{showPlanes ? "Ocultar opciones" : "Explorar más opciones"}</span>
                    <motion.span
                      animate={{ rotate: showPlanes ? 180 : 0 }}
                      transition={{ duration: 0.25 }}
                      className="inline-block"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </motion.span>
                  </button>
                </div>
              </div>

              {/* Planes expandibles */}
              <AnimatePresence>
                {showPlanes && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="pt-6">
                      <p className="text-slate-400 text-xs font-semibold tracking-[0.25em] uppercase font-mono text-center mb-2">
                        Planes de acceso
                      </p>
                      <h3 className="text-white text-2xl font-semibold text-center mb-8">
                        Elige el nivel que mejor se ajuste a tu estrategia.
                      </h3>

                      <div className="grid md:grid-cols-3 gap-5">
                        {/* Entry */}
                        <div className="bg-[#0B1F3A] border border-[#1E3A5F] rounded-2xl p-6 flex flex-col">
                          <p className="text-slate-400 text-xs font-mono mb-2">Investor</p>
                          <p className="text-white text-xl font-bold mb-0.5">Entry</p>
                          <p className="text-white text-3xl font-bold mb-1">$10,000</p>
                          <p className="text-slate-500 text-xs mb-4">Primeros pasos en Estados Unidos</p>
                          <div className="flex gap-3 mb-5 text-xs">
                            <span className="text-slate-400">Valor: <span className="text-white font-medium">$19,150</span></span>
                            <span className="text-blue-400 font-semibold">Ahorro: $11,650</span>
                          </div>
                          <ul className="space-y-2.5 flex-1">
                            {[
                              "Deal Day & Deal Finding presencial",
                              "Consulta de inmigración (1 hora)",
                              "Sesiones Estratégicas",
                              "Comunidad privada de inversionistas + eventos digitales",
                              "Acceso VIP a eventos presenciales: Cumbres, eventos de networking",
                              "Ecosistema de Expertos",
                            ].map((f, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                                <span className="text-slate-400 text-xs leading-relaxed">{f}</span>
                              </li>
                            ))}
                          </ul>
                          <button
                            onClick={() => openWhatsApp(WHATSAPP_PHONE, "Hola Edmundo, me interesa el plan Investor Entry del Círculo Cercano.")}
                            className="mt-6 w-full py-3 rounded-xl border border-[#1E3A5F] hover:border-blue-500/40 text-slate-300 hover:text-white text-sm font-medium transition-all"
                          >
                            Solicitar acceso
                          </button>
                        </div>

                        {/* Growth — destacado */}
                        <div className="relative bg-[#0E2544] border-2 border-primary/60 rounded-2xl p-6 flex flex-col shadow-xl shadow-blue-600/15">
                          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                            <span className="bg-primary text-white text-xs font-bold px-4 py-1.5 rounded-full whitespace-nowrap">
                              Más Popular
                            </span>
                          </div>
                          <p className="text-blue-400 text-xs font-mono mb-2 mt-1">Investor</p>
                          <p className="text-white text-xl font-bold mb-0.5">Growth</p>
                          <p className="text-white text-3xl font-bold mb-1">$15,000</p>
                          <p className="text-slate-400 text-xs mb-4">Inversionistas con estrategia clara</p>
                          <div className="flex gap-3 mb-5 text-xs">
                            <span className="text-slate-400">Valor: <span className="text-white font-medium">$25,000+</span></span>
                            <span className="text-blue-400 font-semibold">Ahorro: $10,000+</span>
                          </div>
                          <ul className="space-y-2.5 flex-1">
                            {[
                              "Todo lo del Entry, más:",
                              "Estrategia de acceso bancario personalizada",
                              "Planeación patrimonial y de sucesión 1:1",
                              "Acceso anticipado a oportunidades",
                              "Mentoría en estructuras complejas",
                              "Prioridad en Deal Day",
                            ].map((f, i) => (
                              <li key={i} className={`flex items-start gap-2 ${i === 0 ? "mb-1" : ""}`}>
                                <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${i === 0 ? "text-slate-500" : "text-blue-400"}`} />
                                <span className={`text-xs leading-relaxed ${i === 0 ? "text-slate-500 font-medium" : "text-slate-300"}`}>{f}</span>
                              </li>
                            ))}
                          </ul>
                          <button
                            onClick={() => openWhatsApp(WHATSAPP_PHONE, "Hola Edmundo, me interesa el plan Investor Growth del Círculo Cercano.")}
                            className="mt-6 w-full py-3 rounded-xl bg-primary hover:bg-blue-500 text-white text-sm font-semibold transition-all shadow-lg shadow-blue-600/30"
                          >
                            Solicitar acceso
                          </button>
                        </div>

                        {/* Legacy */}
                        <div className="bg-[#0B1F3A] border border-[#1E3A5F] rounded-2xl p-6 flex flex-col">
                          <p className="text-slate-400 text-xs font-mono mb-2">Investor</p>
                          <p className="text-white text-xl font-bold mb-0.5">Legacy</p>
                          <p className="text-white text-3xl font-bold mb-1">$25,000</p>
                          <p className="text-slate-500 text-xs mb-4">Máximo acceso y acompañamiento</p>
                          <div className="flex gap-3 mb-5 text-xs">
                            <span className="text-slate-400">Valor: <span className="text-white font-medium">$40,000+</span></span>
                            <span className="text-blue-400 font-semibold">Ahorro: $15,000+</span>
                          </div>
                          <ul className="space-y-2.5 flex-1">
                            {[
                              "Todo lo del Growth, más:",
                              "Acceso VIP a todas las oportunidades",
                              "Mentoría exclusiva con fundadores",
                              "Participación en decisiones estratégicas",
                              "Networking prioritario alto nivel",
                              "Asesoría personalizada continua",
                            ].map((f, i) => (
                              <li key={i} className={`flex items-start gap-2 ${i === 0 ? "mb-1" : ""}`}>
                                <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${i === 0 ? "text-slate-500" : "text-blue-400"}`} />
                                <span className={`text-xs leading-relaxed ${i === 0 ? "text-slate-500 font-medium" : "text-slate-400"}`}>{f}</span>
                              </li>
                            ))}
                          </ul>
                          <button
                            onClick={() => openWhatsApp(WHATSAPP_PHONE, "Hola Edmundo, me interesa el plan Investor Legacy del Círculo Cercano.")}
                            className="mt-6 w-full py-3 rounded-xl border border-[#1E3A5F] hover:border-blue-500/40 text-slate-300 hover:text-white text-sm font-medium transition-all"
                          >
                            Solicitar acceso
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ══════════════════════════════════════
          BLOQUE FINAL — CTA
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
                  "Si pudiera regresar 20 años atrás, le diría algo al Edmundo que apenas comenzaba:{" "}
                  <span className="font-bold">No intentes hacerlo solo."</span>
                </blockquote>
                <p className="text-slate-400 text-base mt-6 leading-relaxed">
                  Hoy quiero extenderte esa misma mano.
                </p>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.15}>
            <div className="border-t border-[#1E3A5F] pt-14">
              <div className="bg-[#0F2542] border border-[#1E3A5F] rounded-xl p-7 mb-10">
                <p className="text-white font-semibold text-lg mb-2">
                  Solicita una sesión de diagnóstico estratégico.
                </p>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Una conversación honesta donde evaluamos si el Círculo Cercano tiene sentido para tu situación específica.
                  Sin compromiso. Sin presión. Solo claridad.
                </p>
              </div>

              <p className="text-slate-300 text-base mb-3">
                No estás comprando una membresía.
              </p>
              <p className="text-white font-semibold text-xl mb-10">
                Estás accediendo a años de experiencia, relaciones y criterio construidos haciendo negocios reales en Estados Unidos.
              </p>

              <div className="flex flex-wrap gap-4">
                <Button
                  onClick={() => openWhatsApp(WHATSAPP_PHONE, WA_MESSAGE)}
                  className="bg-primary hover:bg-blue-600 text-white font-semibold px-10 py-6 text-base gap-2 shadow-xl shadow-blue-600/30"
                >
                  Solicitar sesión de diagnóstico <ArrowRight className="w-5 h-5" />
                </Button>
              </div>

              <p className="text-slate-600 text-xs mt-6 max-w-md leading-relaxed">
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
