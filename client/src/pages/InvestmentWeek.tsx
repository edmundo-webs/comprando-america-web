import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useInView } from "@/hooks/useInView";
import { openWhatsApp, WHATSAPP_PHONE } from "@/lib/whatsapp";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  MapPin,
  CalendarDays,
  Users,
  CheckCircle2,
  Lock,
  Shield,
  Eye,
  Hotel,
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
/* Fechas y agendas viven en lib/eventos.ts, que es la fuente que también usa
   el carrusel del home. Estaban duplicadas y se desfasaron una vez. */
import { EDICIONES } from "@/lib/eventos";
const PAGE_SEO = {
  title: "Investment Week | Comprando América",
  description: "Una semana en terreno con el equipo. Niagara Falls, Nueva York: 2 al 6 de octubre de 2026, casas unifamiliares y sección 8. Las Vegas, Nevada: 3 al 7 de noviembre de 2026, AAPEX y SEMA show. Solo por invitación.",
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

const WA_APPLY = "Hola, me interesa aplicar a Investment Week (Niagara Falls 2-6 oct o Las Vegas 3-7 nov 2026).";

export default function InvestmentWeek() {
  const [edicion, setEdicion] = useState(EDICIONES[0].id);
  const edicionActiva = EDICIONES.find((e) => e.id === edicion);

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
                {EDICIONES.map((e) => (
                  <span
                    key={e.id}
                    className="flex items-center gap-1.5 bg-blue-500/15 border border-blue-500/25 text-blue-300 text-[11px] font-semibold px-2.5 py-1 rounded-full"
                  >
                    <CalendarDays className="w-3 h-3" /> {e.lugar} · {e.fecha}
                  </span>
                ))}
                <span className="flex items-center gap-1.5 bg-white/5 border border-white/10 text-slate-400 text-[11px] px-2.5 py-1 rounded-full">
                  <Lock className="w-3 h-3 text-blue-400" /> Solo por invitación
                </span>
              </div>

              {/* Título */}
              <h1 className="text-[2.5rem] md:text-5xl lg:text-[3rem] font-bold text-white leading-[1.08] mb-3">
                Investment<br />
                <span className="text-primary">Week</span>
              </h1>

              {/* Subtítulo */}
              <p className="text-base md:text-lg text-slate-400 leading-snug mb-5 max-w-lg">
                Dos ediciones este año.{" "}
                <span className="text-white font-medium">Niagara Falls</span> en octubre, sobre
                renta residencial y sección 8.{" "}
                <span className="text-white font-medium">Las Vegas</span> en noviembre, sobre la
                industria del transporte en el AAPEX y el SEMA.
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
                  alt="Investment Week — viaje de inspección"
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
                  <div className="bg-[#0B1F3A]/80 backdrop-blur-sm rounded-xl border border-white/10 px-4 py-3 flex items-stretch gap-3">
                    {EDICIONES.map((e) => (
                      <div
                        key={e.id}
                        className="flex-1 min-w-0 border-l border-white/10 pl-3 first:border-0 first:pl-0"
                      >
                        <p className="text-white text-xs font-semibold truncate">
                          {e.lugar}
                        </p>
                        <p className="text-primary text-[11px] font-bold mt-0.5">
                          {e.fecha}
                        </p>
                      </div>
                    ))}
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

      {/* ═══ 4. AGENDA — ☀️ BLANCO ═══
          Una agenda por edición, con selector. Antes vivía aquí la del
          Florida Investment Weekend II, que ya pasó; la de cada ciudad viene
          de su flyer oficial y no se rellena con supuestos: si el flyer sólo
          dice "Día 1 de Expo", eso es lo que se muestra. */}
      <section className="bg-[#F5F7FA] py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="text-center mb-10">
              <p className="text-primary text-sm font-semibold tracking-[0.25em] uppercase mb-4 font-mono">
                Agenda
              </p>
              <h2 className="text-3xl md:text-4xl text-[#0B1F3A] mb-4">
                Dos ediciones, dos objetivos distintos
              </h2>
              <p className="text-[#6B7280] max-w-2xl mx-auto">
                No son la misma semana repetida en otra ciudad. Elige la edición
                para ver su programa completo.
              </p>
            </div>
          </FadeIn>

          {/* Selector de edición */}
          <FadeIn>
            <div className="max-w-4xl mx-auto grid sm:grid-cols-2 gap-3 mb-8">
              {EDICIONES.map((e) => {
                const activa = e.id === edicion;
                return (
                  <button
                    key={e.id}
                    onClick={() => setEdicion(e.id)}
                    aria-pressed={activa}
                    className={`rounded-2xl border p-5 text-left transition-all ${
                      activa
                        ? "bg-[#0B1F3A] border-[#0B1F3A] shadow-lg"
                        : "bg-white border-gray-200 hover:border-blue-300 hover:shadow-md"
                    }`}
                  >
                    <p
                      className={`text-xs font-mono uppercase tracking-[0.2em] mb-1.5 ${
                        activa ? "text-blue-400" : "text-primary"
                      }`}
                    >
                      {e.fecha}
                    </p>
                    <p
                      className={`text-lg font-bold leading-tight ${
                        activa ? "text-white" : "text-[#0B1F3A]"
                      }`}
                    >
                      {e.lugar}
                    </p>
                    <p
                      className={`text-sm mt-1 ${
                        activa ? "text-slate-400" : "text-[#6B7280]"
                      }`}
                    >
                      {e.rango}
                    </p>
                  </button>
                );
              })}
            </div>
          </FadeIn>

          {edicionActiva && (
            <div className="max-w-4xl mx-auto">
              {/* Objetivo de la edición */}
              <FadeIn>
                <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 mb-6 shadow-sm">
                  <p className="text-primary text-xs font-semibold tracking-wider uppercase mb-3">
                    Objetivo de la edición
                  </p>
                  <p className="text-[#0B1F3A] text-lg leading-relaxed">
                    {edicionActiva.objetivo}
                  </p>
                </div>
              </FadeIn>

              {/* Días */}
              <div className="space-y-3">
                {edicionActiva.agenda.map((d, i) => (
                  <FadeIn key={`${edicionActiva.id}-${i}`} delay={i * 0.05}>
                    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all">
                      <div className="grid sm:grid-cols-[220px_1fr] items-stretch">
                        <div className="bg-[#0B1F3A] p-5 sm:p-6 flex flex-col justify-center">
                          <p className="text-blue-400 text-xs font-semibold tracking-[0.3em] uppercase mb-1 font-mono">
                            Día {i + 1}
                          </p>
                          <p className="text-white text-sm font-medium">
                            {d.fecha}
                          </p>
                        </div>
                        <div className="p-5 sm:p-6 flex items-center gap-3">
                          <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                          <p className="text-[#0B1F3A] text-base md:text-lg font-semibold">
                            {d.titulo}
                          </p>
                        </div>
                      </div>
                    </div>
                  </FadeIn>
                ))}
              </div>
            </div>
          )}
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

      {/* ═══ 6. REQUISITOS DE ACCESO — ☀️ BLANCO ═══
          La logística del viaje vivía aquí, en la columna derecha, con
          aeropuertos y hospedaje de Florida que ya no corresponden a ninguna
          edición. Se retira: se comparte en privado con quien queda aprobado. */}
      <section className="bg-white py-20 md:py-28">
        <div className="container">
          <div className="max-w-2xl mx-auto">
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
              <a href="/tierra-estrategica" className="group block">
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
              <a href="/renta-garantizada" className="group block">
                <div className="bg-[#0B1F3A] border border-[#1E3A5F] rounded-2xl p-8 h-full shadow-sm hover:shadow-xl hover:border-blue-500/40 transition-all duration-300">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/15 flex items-center justify-center mb-5">
                    <Hotel className="w-5 h-5 text-blue-400" />
                  </div>
                  <p className="text-[11px] font-semibold text-blue-400 tracking-[0.2em] uppercase mb-2 font-mono">Programa Section 8</p>
                  <h3 className="text-xl font-bold text-white mb-3 leading-snug">
                    Casas unifamiliares con renta respaldada por el gobierno federal
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-6">
                    El programa HUD Section 8 paga directamente al propietario. Flujo constante, inquilinos certificados y propiedades en zonas de alta demanda en Florida.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {["Renta respaldada por HUD", "Casas unifamiliares", "Florida"].map((tag, i) => (
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
