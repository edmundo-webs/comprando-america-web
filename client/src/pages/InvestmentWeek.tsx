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
  MapPin,
  CalendarDays,
  Users,
  CheckCircle2,
  Lock,
  Shield,
  Eye,
  Plane,
  Hotel,
  Car,
  Clock,
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

/* ─── Head (noindex) ─── */
import SEOHead from "@/components/SEOHead";
const PAGE_SEO = {
  title: "Florida Investment Weekend II | Comprando América",
  description: "Evento privado de inversión en Tampa, St. Pete y Clearwater. Solo por invitación. 24-27 julio 2026.",
  path: "/investment-week",
};

/* ─── Photos ─── */
const INSPECTION_IMAGE = "https://res.cloudinary.com/dofccqypz/image/upload/v1774537564/comprando-america/eventos/uefjxoxi5trojtoeivha.jpg";
const AUDIENCE_IMAGE = "https://res.cloudinary.com/dofccqypz/image/upload/c_fill,w_1600,h_600,g_auto,q_auto,f_auto/v1774537558/comprando-america/eventos/xvdkaaxpavgr9lrybk8g.jpg";
const PROPERTY_BG = "https://res.cloudinary.com/dofccqypz/image/upload/v1774537570/comprando-america/eventos/vjyyrtfskd3w7nmklbt3.jpg";
const INVEST_WEEK_IMG = "https://res.cloudinary.com/dgruohz6f/image/upload/c_fill,w_900,h_1100,g_auto,q_auto,f_auto/v1782675101/tts-news/kvqowamn1xqniqa0b6to.jpg";

const TEAM = [
  { name: "Diego", role: "Operaciones", photo: "/team/diego.jpg" },
  { name: "Edmundo Treviño", role: "CEO & Fundador", photo: "/team/edmundo.jpg" },
  { name: "Joe", role: "Inversiones", photo: "/team/joe.jpg" },
];

const WA_APPLY = "Hola, me interesa aplicar al Florida Investment Weekend II (24-27 julio 2026).";

export default function InvestmentWeek() {
  const scrollToApply = () => {
    document.getElementById("aplicar")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-[#0B1F3A] text-white overflow-x-hidden">
      <SEOHead {...PAGE_SEO} />
      <Navbar />

      {/* ═══ 1. HERO ═══ */}
      <section className="relative bg-[#0B1F3A] overflow-hidden pt-20" style={{ minHeight: "calc(100svh - 70px)" }}>
        {/* dot grid bg */}
        <div className="absolute inset-0 opacity-[0.035] pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle at 1px 1px,rgba(255,255,255,.8) 1px,transparent 0)", backgroundSize: "32px 32px" }} />

        <div className="container relative z-10 py-10 md:py-14">
          <div className="grid lg:grid-cols-[1fr_420px] xl:grid-cols-[1fr_460px] gap-8 xl:gap-12 items-center">

            {/* ── LEFT ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: "easeOut" }}
            >
              {/* Meta pills: fecha · lugar · acceso */}
              <div className="flex flex-wrap items-center gap-2 mb-5">
                <span className="flex items-center gap-1.5 bg-blue-500/15 border border-blue-500/25 text-blue-300 text-[11px] font-semibold px-2.5 py-1 rounded-full">
                  <CalendarDays className="w-3 h-3" /> 24–27 jul 2026
                </span>
                <span className="flex items-center gap-1.5 bg-white/5 border border-white/10 text-slate-400 text-[11px] px-2.5 py-1 rounded-full">
                  <MapPin className="w-3 h-3 text-primary" /> Tampa · St. Pete · Clearwater
                </span>
                <span className="flex items-center gap-1.5 bg-white/5 border border-white/10 text-slate-400 text-[11px] px-2.5 py-1 rounded-full">
                  <Lock className="w-3 h-3 text-blue-400" /> Solo por invitación
                </span>
              </div>

              {/* Título */}
              <h1 className="text-[2.5rem] md:text-5xl lg:text-[3rem] font-bold text-white leading-[1.08] mb-3">
                Florida Investment<br />
                <span className="text-primary">Weekend II</span>
              </h1>

              {/* Subtítulo */}
              <p className="text-base md:text-lg text-slate-400 leading-snug mb-5 max-w-lg">
                Visita en terreno:{" "}
                <span className="text-white font-medium">Casas Unifamiliares</span> y{" "}
                <span className="text-white font-medium">Parques de Casas Móviles</span> en operación.
              </p>

              {/* Duración + cupo */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-white leading-none">4</p>
                    <p className="text-slate-500 text-[10px] mt-0.5">días</p>
                  </div>
                  <div className="w-px h-8 bg-white/10" />
                  <span className="flex items-center gap-1.5 text-slate-400 text-xs">
                    <Users className="w-3.5 h-3.5 text-primary" /> Cupo limitado
                  </span>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap gap-3 mb-7">
                <Button
                  onClick={scrollToApply}
                  className="bg-primary hover:bg-blue-600 text-white px-7 py-5 text-sm font-semibold gap-2 shadow-lg shadow-blue-600/30"
                >
                  Aplicar al viaje <ArrowRight className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => openWhatsApp(WHATSAPP_PHONE, WA_APPLY)}
                  className="border-slate-600 text-white hover:bg-white/10 px-7 py-5 text-sm"
                >
                  Confirmar interés
                </Button>
              </div>

              {/* Equipo */}
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {TEAM.map((member, i) => (
                    <div
                      key={i}
                      className="w-9 h-9 rounded-full border-2 border-[#0B1F3A] overflow-hidden flex-shrink-0"
                      style={{ zIndex: TEAM.length - i }}
                    >
                      <img src={member.photo} alt={member.name} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-white text-xs font-semibold leading-tight">
                    {TEAM.map(m => m.name.split(" ")[0]).join(", ")}
                  </p>
                  <p className="text-slate-500 text-[11px]">Team Comprando América</p>
                </div>
              </div>
            </motion.div>

            {/* ── RIGHT: foto ── */}
            <motion.div
              className="hidden lg:block"
              initial={{ opacity: 0, x: 28 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
            >
              <div
                className="relative rounded-2xl overflow-hidden shadow-2xl shadow-black/60"
                style={{ height: "min(560px, calc(100svh - 240px))" }}
              >
                <img
                  src={INVEST_WEEK_IMG}
                  alt="Florida Investment Weekend"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F3A]/70 via-transparent to-transparent" />

                {/* Chip */}
                <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-black/45 backdrop-blur-sm border border-white/10 rounded-full px-3 py-1.5">
                  <Eye className="w-3.5 h-3.5 text-blue-300" />
                  <span className="text-white text-[11px] font-semibold">Viaje de inspección</span>
                </div>

                {/* Strip inferior */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="bg-[#0B1F3A]/80 backdrop-blur-sm rounded-xl border border-white/10 px-4 py-3 flex items-center justify-between">
                    <div>
                      <p className="text-white text-xs font-semibold">Florida, Estados Unidos</p>
                      <p className="text-slate-400 text-[11px]">Tampa · St. Pete · Clearwater</p>
                    </div>
                    <div className="text-right">
                      <p className="text-primary text-xs font-bold">Jul 24–27</p>
                      <p className="text-slate-500 text-[11px]">2026</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ═══ ALERTA ACCESO RESTRINGIDO ═══ */}
      <div className="bg-blue-400 border-y border-blue-300">
        <div className="container py-3">
          <div className="flex items-center justify-center gap-2.5 text-center">
            <Lock className="w-4 h-4 text-amber-900 flex-shrink-0" />
            <p className="text-sm text-amber-900">
              <span className="font-bold">Nota importante:</span>{" "}
              Exclusivo por invitación. Solo para inversionistas que ya tuvieron entrevista sobre el fondo y cumplen con el perfil.
            </p>
          </div>
        </div>
      </div>

      {/* ═══ 2. QUÉ ES — ☀️ BLANCO ═══ */}
      <section className="bg-[#F5F7FA] py-20 md:py-28">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            <FadeIn>
              <div>
                <h2 className="text-3xl md:text-4xl text-[#0B1F3A] mb-6">
                  No es un seminario. <span className="text-primary">Es una experiencia en terreno</span>
                </h2>
                <p className="text-[#4B5563] text-lg leading-relaxed mb-8">Durante el fin de semana:</p>
                <div className="space-y-4">
                  {[
                    "Visitas parques de casas móviles y casas unifamiliares en operación",
                    "Analizas oportunidades directamente en sitio con el equipo",
                    "Entiendes la estructura legal, fiscal y operativa de cada activo",
                    "Conectas con inversionistas que ya están ejecutando",
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <p className="text-[#374151]">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
            <FadeIn delay={0.1}>
              <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-200">
                <img src={INSPECTION_IMAGE} alt="Vista aérea viaje de inspección" className="w-full h-72 object-cover" />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ═══ 3. A QUIÉN — navy ═══ */}
      <section className="bg-[#0E2544] py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl text-white mb-8">
                ¿Quién puede asistir?
              </h2>
              <p className="text-slate-400 text-lg mb-8">Este viaje no está abierto al público. Para participar necesitas cumplir tres condiciones:</p>
              <div className="space-y-4 mb-10">
                {[
                  "Haber completado una entrevista previa sobre el fondo de inversión",
                  "Cumplir con el perfil de inversionista requerido",
                  "Recibir invitación directa del equipo de Comprando América",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <p className="text-slate-300 text-lg">{item}</p>
                  </div>
                ))}
              </div>
              <div className="bg-[#0F2847] border border-blue-500/20 rounded-xl p-8">
                <p className="text-white text-lg">
                  Si no has tenido entrevista con el equipo, <span className="text-primary font-semibold">el primer paso es agendar una.</span>
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ 4. AGENDA — ☀️ BLANCO ═══ */}
      <section className="bg-[#F5F7FA] py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="text-center mb-12">
              <p className="text-primary text-sm font-semibold tracking-[0.25em] uppercase mb-4 font-mono">Agenda</p>
              <h2 className="text-3xl md:text-4xl text-[#0B1F3A]">4 días de experiencia intensiva</h2>
            </div>
          </FadeIn>

          <div className="max-w-4xl mx-auto space-y-6">
            {[
              {
                day: "Día 1", title: "Llegada y Bienvenida", date: "Viernes 24 de julio, 2026",
                items: ["Llegada a Tampa — Alojamiento recomendado en St. Petersburg", "5:30 PM — Sesión de bienvenida", "¿Por qué Florida? Tendencias del mercado inmobiliario 2026", "Presentación del equipo", "Los dos activos que analizaremos y por qué complementan un portafolio", "7:30 PM — Cena de networking con el equipo y otros inversionistas"],
              },
              {
                day: "Día 2", title: "Parques de Casas Móviles", date: "Sábado 25 de julio, 2026",
                morning: "Teoría",
                morningItems: ["Por qué los Mobile Home Parks son el activo más resiliente", "Cómo se valúa un parque", "Palancas de valor: infill, submetering, rent-to-own, estabilización", "Estructura del fondo y cómo participar", "Escenarios de retorno ilustrativos", "Eficiencia fiscal del fondo"],
                afternoon: "Campo",
                afternoonItems: ["Visita a parques activos adquiridos por el fondo en Clearwater, Largo y Tampa", "Ver parques antes y después de la operación", "Sesión de preguntas sobre la operación de los parques", "Comparativa: residencial vs parques — ¿cuál es para ti?"],
              },
              {
                day: "Día 3", title: "Casas Unifamiliares, Zonas y Sección 8", date: "Domingo 26 de julio, 2026",
                morning: "Teoría",
                morningItems: ["Cómo funciona el mercado residencial en Florida: demanda, migración, zonas clave", "Cómo leer un deal: NOI, Cap Rate, Cash-on-Cash con ejemplos reales", "Cómo comprar siendo extranjero: DSCR loans, financiamiento, LLC", "Estrategia fiscal: depreciación, FIRPTA — lo que necesitas saber antes de comprar"],
                afternoon: "Campo",
                afternoonItems: ["Recorrido por las zonas de inversión en St. Petersburg", "Visitas a propiedades: casas y condos disponibles", "Análisis en vivo con el equipo frente al activo", "Sesiones 1 a 1 disponibles para interesados"],
              },
              {
                day: "Día 4", title: "Regreso", date: "Lunes 27 de julio, 2026",
                items: ["Regreso libre desde el aeropuerto de Tampa o de Orlando (2 horas de distancia)"],
              },
            ].map((d, i) => (
              <FadeIn key={i} delay={i * 0.05}>
                <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all">
                  <div className="grid lg:grid-cols-[220px_1fr]">
                    <div className="bg-[#0B1F3A] p-6 lg:p-8 flex flex-col justify-center">
                      <p className="text-blue-400 text-xs font-semibold tracking-[0.3em] uppercase mb-2 font-mono">{d.day}</p>
                      <h3 className="text-xl font-bold text-white">{d.title}</h3>
                      <p className="text-slate-500 text-sm mt-1">{d.date}</p>
                    </div>
                    <div className="p-6 lg:p-8">
                      {d.morning ? (
                        <>
                          <p className="text-primary text-xs font-semibold tracking-wider uppercase mb-3">Mañana — {d.morning}</p>
                          <div className="grid sm:grid-cols-2 gap-2 mb-5">
                            {d.morningItems?.map((item, j) => (
                              <div key={j} className="flex items-start gap-2">
                                <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                                <p className="text-[#4B5563] text-sm">{item}</p>
                              </div>
                            ))}
                          </div>
                          <p className="text-primary text-xs font-semibold tracking-wider uppercase mb-3">Tarde — {d.afternoon}</p>
                          <div className="grid sm:grid-cols-2 gap-2">
                            {d.afternoonItems?.map((item, j) => (
                              <div key={j} className="flex items-start gap-2">
                                <Eye className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                                <p className="text-[#4B5563] text-sm">{item}</p>
                              </div>
                            ))}
                          </div>
                        </>
                      ) : (
                        <div className="grid sm:grid-cols-2 gap-2">
                          {d.items?.map((item, j) => (
                            <div key={j} className="flex items-start gap-2">
                              <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                              <p className="text-[#4B5563] text-sm">{item}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Franja de contexto: por qué Florida ── */}
      <section className="bg-[#0B1F3A] py-16 md:py-20 relative overflow-hidden">
        {/* fondo sutil */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle at 1px 1px,rgba(255,255,255,.9) 1px,transparent 0)", backgroundSize: "28px 28px" }} />
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-primary to-transparent" />

        <div className="container relative z-10">
          {/* Frase central */}
          <FadeIn>
            <p className="text-center text-slate-500 text-xs font-semibold tracking-[0.3em] uppercase mb-4 font-mono">
              Por qué Florida
            </p>
            <h2 className="text-center text-2xl md:text-3xl lg:text-4xl text-white font-bold max-w-2xl mx-auto leading-tight mb-14">
              Florida no es una apuesta.{" "}
              <span className="text-primary">Es matemática.</span>
            </h2>
          </FadeIn>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/5 rounded-2xl overflow-hidden max-w-4xl mx-auto">
            {[
              { n: "#1", label: "destino de migración interna", sub: "en EE.UU." },
              { n: "0%", label: "impuesto estatal sobre", sub: "ingresos personales" },
              { n: "1,000+", label: "personas se mudan a", sub: "Florida cada día" },
              { n: "12%+", label: "apreciación promedio anual", sub: "últimos 5 años" },
            ].map((s, i) => (
              <FadeIn key={i} delay={i * 0.08}>
                <div className="bg-[#0D2245] px-6 py-7 text-center hover:bg-[#0F2850] transition-colors">
                  <p className="text-3xl md:text-4xl font-bold text-primary leading-none mb-2">{s.n}</p>
                  <p className="text-white text-xs font-medium leading-snug">{s.label}</p>
                  <p className="text-slate-500 text-[11px] mt-0.5">{s.sub}</p>
                </div>
              </FadeIn>
            ))}
          </div>

          {/* Nota al pie */}
          <FadeIn delay={0.2}>
            <p className="text-center text-slate-600 text-xs mt-8 max-w-xl mx-auto">
              Durante el viaje analizas activos reales en este mercado — con números, contratos y propiedades físicas sobre la mesa.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ═══ 5. QUÉ HACE DIFERENTE — navy ═══ */}
      <section className="bg-[#0E2544] py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl text-white">
                Aquí no vienes a escuchar… <span className="text-primary">vienes a ver, analizar y decidir</span>
              </h2>
            </div>
          </FadeIn>

          <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              { title: "Activos reales", desc: "Visitas propiedades y parques en operación, no presentaciones teóricas." },
              { title: "Contexto completo", desc: "Entiendes la estructura legal, fiscal y operativa de cada oportunidad." },
              { title: "Acceso directo", desc: "Conectas con el equipo, los aliados y los activos sin intermediarios." },
              { title: "Sesiones 1 a 1", desc: "Espacio para analizar tu caso particular con los expertos." },
            ].map((item, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="bg-[#0F2847] border border-[#1E3A5F] rounded-xl p-6 h-full hover:border-blue-500/30 transition-all">
                  <CheckCircle2 className="w-6 h-6 text-blue-400 mb-3" />
                  <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 6. FILTRO + LOGÍSTICA — ☀️ BLANCO ═══ */}
      <section className="bg-white py-20 md:py-28">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <FadeIn>
              <div>
                <Lock className="w-8 h-8 text-primary mb-4" />
                <h2 className="text-3xl text-[#0B1F3A] mb-6">Requisitos de acceso</h2>
                <div className="space-y-4 mb-8">
                  {[
                    "Entrevista completada sobre el fondo de inversión",
                    "Perfil de inversionista aprobado por el equipo",
                    "Invitación directa de Comprando América",
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <p className="text-[#4B5563]">{item}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-[#F5F7FA] border border-gray-200 rounded-xl p-6">
                  <p className="text-[#0B1F3A] font-semibold">Sin entrevista previa no es posible participar.</p>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.1}>
              <div>
                <p className="text-primary text-sm font-semibold tracking-[0.2em] uppercase mb-6 font-mono">Logística del Viaje</p>
                <p className="text-[#6B7280] text-sm mb-6">Elige tu punto de llegada según precio y disponibilidad de vuelos desde tu ciudad:</p>

                <Accordion type="single" collapsible className="space-y-3">
                  <AccordionItem value="tampa" className="bg-[#F5F7FA] border border-gray-200 rounded-xl px-5">
                    <AccordionTrigger className="text-[#0B1F3A] font-semibold text-sm hover:no-underline py-4 gap-3">
                      <span className="flex items-center gap-3"><Plane className="w-5 h-5 text-primary" /> Llegada: Tampa (TPA)</span>
                    </AccordionTrigger>
                    <AccordionContent className="pb-4 space-y-3">
                      {[
                        { icon: Plane, label: "Vuelo", desc: "20 min a St. Petersburg. Vuelos directos desde CDMX." },
                        { icon: Hotel, label: "Hospedaje sugerido", desc: "St. Petersburg — opciones compartidas en privado" },
                        { icon: Car, label: "Transporte", desc: "Independiente" },
                        { icon: Clock, label: "Agenda", desc: "Intensiva — 3 días completos" },
                      ].map((item, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <item.icon className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                          <div>
                            <span className="text-[#0B1F3A] font-semibold text-xs">{item.label}</span>
                            <p className="text-[#6B7280] text-sm">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="orlando" className="bg-[#F5F7FA] border border-gray-200 rounded-xl px-5">
                    <AccordionTrigger className="text-[#0B1F3A] font-semibold text-sm hover:no-underline py-4 gap-3">
                      <span className="flex items-center gap-3"><Plane className="w-5 h-5 text-primary" /> Llegada: Orlando (MCO)</span>
                    </AccordionTrigger>
                    <AccordionContent className="pb-4 space-y-3">
                      {[
                        { icon: Plane, label: "Vuelo", desc: "Más frecuencias desde México. ~2 horas en auto a St. Pete." },
                        { icon: Hotel, label: "Hospedaje sugerido", desc: "St. Petersburg — opciones compartidas en privado" },
                        { icon: Car, label: "Transporte", desc: "Independiente" },
                        { icon: Clock, label: "Agenda", desc: "Intensiva — 3 días completos" },
                      ].map((item, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <item.icon className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                          <div>
                            <span className="text-[#0B1F3A] font-semibold text-xs">{item.label}</span>
                            <p className="text-[#6B7280] text-sm">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ═══ 7. CTA INTERMEDIO — navy ═══ */}
      <section id="aplicar" className="bg-[#0B1F3A] py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl text-white mb-4">¿Quieres aplicar a esta experiencia?</h2>
              <p className="text-slate-400 mb-8">El cupo es limitado. La selección es por perfil.</p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button onClick={() => openWhatsApp(WHATSAPP_PHONE, WA_APPLY)} className="bg-primary hover:bg-blue-600 text-white px-10 py-6 text-lg gap-2 shadow-lg shadow-blue-600/25">
                  Aplicar al viaje <ArrowRight className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ 8. CONEXIÓN OPORTUNIDADES ═══ */}
      <section className="bg-[#F5F7FA] py-20 md:py-24">
        <div className="container">
          <FadeIn>
            <div className="text-center mb-10">
              <p className="text-primary text-xs font-semibold tracking-[0.25em] uppercase mb-3 font-mono">Lo que analizas en el viaje</p>
              <h2 className="text-3xl md:text-4xl text-[#0B1F3A] font-bold max-w-2xl mx-auto">
                Dos oportunidades reales sobre la mesa
              </h2>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">

            {/* Tarjeta 1: Fondo */}
            <FadeIn delay={0.05}>
              <a href="/fondo" className="group block">
                <div className="bg-white border border-gray-200 rounded-2xl p-8 h-full shadow-sm hover:shadow-xl hover:border-primary/30 transition-all duration-300">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                    <Shield className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-[11px] font-semibold text-primary tracking-[0.2em] uppercase mb-2 font-mono">Fondo de Inversión</p>
                  <h3 className="text-xl font-bold text-[#0B1F3A] mb-3 leading-snug">
                    Invierte en parques de casas móviles junto con el fondo
                  </h3>
                  <p className="text-[#6B7280] text-sm leading-relaxed mb-6">
                    Participa como co-inversionista en activos adquiridos y operados por el equipo. Sin gestión directa, con retornos distribuidos y estructura fiscal optimizada.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {["Parques de casas móviles", "Fondo estructurado", "Sin gestión activa"].map((tag, i) => (
                      <span key={i} className="text-[11px] bg-[#F5F7FA] border border-gray-200 text-[#6B7280] px-2.5 py-1 rounded-full">{tag}</span>
                    ))}
                  </div>
                  <span className="flex items-center gap-2 text-primary text-sm font-semibold group-hover:gap-3 transition-all">
                    Ver el Fondo <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </a>
            </FadeIn>

            {/* Tarjeta 2: Programa Section 8 */}
            <FadeIn delay={0.1}>
              <a href="/vc-8" className="group block">
                <div className="bg-[#0B1F3A] border border-[#1E3A5F] rounded-2xl p-8 h-full shadow-sm hover:shadow-xl hover:border-blue-500/40 transition-all duration-300">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/15 flex items-center justify-center mb-5">
                    <Hotel className="w-5 h-5 text-blue-400" />
                  </div>
                  <p className="text-[11px] font-semibold text-blue-400 tracking-[0.2em] uppercase mb-2 font-mono">Programa Section 8</p>
                  <h3 className="text-xl font-bold text-white mb-3 leading-snug">
                    Casas unifamiliares con renta garantizada por el gobierno federal
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-6">
                    El programa HUD Section 8 paga directamente al propietario. Flujo constante, inquilinos certificados y propiedades en zonas de alta demanda en Florida.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {["Renta garantizada HUD", "Casas unifamiliares", "Florida"].map((tag, i) => (
                      <span key={i} className="text-[11px] bg-white/5 border border-white/10 text-slate-400 px-2.5 py-1 rounded-full">{tag}</span>
                    ))}
                  </div>
                  <span className="flex items-center gap-2 text-blue-400 text-sm font-semibold group-hover:gap-3 transition-all">
                    Ver el Programa <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </a>
            </FadeIn>

          </div>
        </div>
      </section>

      {/* ═══ 9. CTA FINAL — deep navy ═══ */}
      <section className="bg-[#091A30] py-24 md:py-32">
        <div className="container">
          <FadeIn>
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl text-white mb-4">
                Si este tipo de experiencias hace sentido para ti
              </h2>
              <p className="text-slate-500 text-sm mb-10">Exclusivo por invitación. Requiere entrevista previa sobre el fondo y perfil aprobado.</p>
              <Button onClick={() => openWhatsApp(WHATSAPP_PHONE, WA_APPLY)} className="bg-primary hover:bg-blue-600 text-white font-semibold px-10 py-6 text-lg gap-2 shadow-lg shadow-blue-600/25">
                Aplicar <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          </FadeIn>
        </div>
      </section>

      <Footer />
    </div>
  );
}
