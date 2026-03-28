import { useEffect } from "react";
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
function SEOHead() {
  useEffect(() => {
    document.title = "Florida Investment Week | Comprando América";
    let meta = document.querySelector('meta[name="robots"]');
    if (!meta) { meta = document.createElement("meta"); meta.setAttribute("name", "robots"); document.head.appendChild(meta); }
    meta.setAttribute("content", "noindex, nofollow");
  }, []);
  return null;
}

/* ─── Photos ─── */
const HERO_IMAGE = "https://lh3.googleusercontent.com/d/1VKFcr6XRJ81P6XX9JbQ_GQvTsQdcvsQC=w1920"; // cena privada
const INSPECTION_IMAGE = "https://res.cloudinary.com/dofccqypz/image/upload/v1774537564/comprando-america/eventos/uefjxoxi5trojtoeivha.jpg"; // aerial
const AUDIENCE_IMAGE = "https://lh3.googleusercontent.com/d/1gnZX2RiYD4M29nQmqwcsN0k13db74LmV=w1920"; // packed room
const WORKSHOP_IMAGE = "https://lh3.googleusercontent.com/d/1mQWgGjGOCgTU8BsOl3Rgdh5mGR3eObRd=w1200"; // numbers on board

const WA_APPLY = "Hola, me interesa aplicar a la Florida Investment Week (1-4 mayo 2026).";

export default function InvestmentWeek() {
  const scrollToApply = () => {
    document.getElementById("aplicar")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-[#0B1F3A] text-white overflow-x-hidden">
      <SEOHead />
      <Navbar />

      {/* ═══ BANNER ACCESO RESTRINGIDO ═══ */}
      <div className="bg-[#132D50] border-b border-blue-500/20 pt-20">
        <div className="container py-4">
          <div className="flex items-center justify-center gap-3 text-center">
            <Lock className="w-4 h-4 text-primary flex-shrink-0" />
            <p className="text-slate-400 text-sm">
              <span className="text-primary font-semibold">Exclusivo por invitación.</span>{" "}
              Solo para inversionistas que ya tuvieron entrevista sobre el fondo y cumplen con el perfil.
            </p>
          </div>
        </div>
      </div>

      {/* ═══ 1. HERO — cena privada ═══ */}
      <section className="relative min-h-[80vh] flex items-center py-20 overflow-hidden">
        <div className="absolute inset-0">
          <img src={HERO_IMAGE} alt="Cena privada de inversionistas" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B1F3A]/95 via-[#0B1F3A]/85 to-[#0B1F3A]/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F3A] via-transparent to-[#0B1F3A]/40" />
        </div>

        <div className="container relative z-10">
          <FadeIn>
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-primary text-xs font-semibold tracking-wider uppercase mb-8">
                <Shield className="w-3.5 h-3.5" /> Experiencia por invitación
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl text-white leading-tight mb-4">
                Florida Investment Week
              </h1>
              <p className="text-xl md:text-2xl text-slate-400 mb-6">
                Acceso directo a activos, estructura y decisiones reales en Estados Unidos
              </p>
              <p className="text-slate-500 text-lg leading-relaxed mb-8 max-w-2xl">
                Un viaje de inspección diseñado para inversionistas que buscan entender, analizar y ejecutar oportunidades directamente en terreno.
              </p>

              <div className="flex flex-wrap gap-3 text-slate-400 text-sm mb-8">
                <span className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10">
                  <MapPin className="w-4 h-4 text-primary" /> Tampa · St. Pete · Clearwater
                </span>
                <span className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10">
                  <CalendarDays className="w-4 h-4 text-primary" /> 1–4 mayo 2026
                </span>
                <span className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10">
                  <Users className="w-4 h-4 text-primary" /> Cupo limitado
                </span>
              </div>

              <div className="flex flex-wrap gap-4">
                <Button onClick={scrollToApply} className="bg-primary hover:bg-blue-600 text-white px-8 py-6 text-base gap-2 shadow-lg shadow-blue-600/25">
                  Aplicar al viaje <ArrowRight className="w-4 h-4" />
                </Button>
                <Button variant="outline" onClick={() => openWhatsApp(WHATSAPP_PHONE, WA_APPLY)} className="border-slate-600 text-white hover:bg-white/10 px-8 py-6 text-base gap-2">
                  Confirmar interés
                </Button>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ 2. QUÉ ES — ☀️ BLANCO ═══ */}
      <section className="bg-[#F5F7FA] py-20 md:py-28">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            <FadeIn>
              <div>
                <h2 className="text-3xl md:text-4xl text-[#0B1F3A] mb-6">
                  No es un seminario. <span className="text-primary">Es una experiencia en terreno</span>
                </h2>
                <p className="text-[#4B5563] text-lg leading-relaxed mb-8">Durante 4 días:</p>
                <div className="space-y-4">
                  {[
                    "Visitas activos reales en operación",
                    "Analizas oportunidades directamente en sitio",
                    "Entiendes estructuras con contexto completo",
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
              <div className="bg-[#132D50] border border-blue-500/20 rounded-xl p-8">
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
                day: "Día 1", title: "Bienvenida", date: "1 de mayo, 2026",
                items: ["Llegada a Tampa", "Sesión estratégica de apertura", "Tendencias del mercado inmobiliario", "Presentación del equipo y aliados", "Análisis preliminar de activos", "Cena privada de networking"],
              },
              {
                day: "Día 2", title: "Residencial", date: "2 de mayo, 2026",
                morning: "Sesión teórica",
                morningItems: ["Cómo funciona el mercado residencial", "Cómo leer un deal (NOI, Cap Rate, Cash-on-Cash)", "Financiamiento y estructura", "Estrategia fiscal para inversionistas"],
                afternoon: "Recorrido en campo",
                afternoonItems: ["Visitas a propiedades residenciales", "Análisis en vivo de oportunidades"],
              },
              {
                day: "Día 3", title: "Mobile Home Parks", date: "3 de mayo, 2026",
                morning: "Análisis estratégico",
                morningItems: ["Por qué este activo es resiliente", "Cómo se valúa un mobile home park", "Palancas de valor y optimización", "Estructura del fondo de inversión"],
                afternoon: "Inspección en campo",
                afternoonItems: ["Visita a parques activos en operación", "Análisis real de métricas y condiciones", "Comparativa de activos en terreno"],
              },
              {
                day: "Día 4", title: "Regreso", date: "4 de mayo, 2026",
                items: ["Salida libre desde Tampa u Orlando", "Cierre de conclusiones y próximos pasos individuales"],
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

      {/* ── Photo break ── */}
      <section className="relative h-64 md:h-80 overflow-hidden">
        <img src={AUDIENCE_IMAGE} alt="Comunidad de inversionistas" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0E2544] via-transparent to-[#F5F7FA]" />
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
                <div className="bg-[#132D50] border border-[#1E3A5F] rounded-xl p-6 h-full hover:border-blue-500/30 transition-all">
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

                {/* Opción A — Tampa */}
                <h3 className="text-lg text-[#0B1F3A] font-semibold mb-4">Opción A — Tampa (TPA)</h3>
                <div className="space-y-3 mb-8">
                  {[
                    { icon: Plane, title: "Llegada", desc: "Tampa (TPA) — 20 min a St. Petersburg" },
                    { icon: Hotel, title: "Hospedaje sugerido", desc: "St. Petersburg — opciones compartidas en privado" },
                    { icon: Car, title: "Transporte", desc: "Independiente" },
                    { icon: Clock, title: "Agenda", desc: "Intensiva — 3 días completos de actividades" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3 bg-[#F5F7FA] border border-gray-200 rounded-xl p-4">
                      <item.icon className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-[#0B1F3A] font-semibold text-sm">{item.title}</h4>
                        <p className="text-[#6B7280] text-sm">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Opción B — Orlando */}
                <h3 className="text-lg text-[#0B1F3A] font-semibold mb-4">Opción B — Orlando (MCO)</h3>
                <div className="space-y-3">
                  {[
                    { icon: Plane, title: "Llegada", desc: "Orlando (MCO) — más frecuencias desde México, ~2 hrs en auto a St. Pete" },
                    { icon: Hotel, title: "Hospedaje sugerido", desc: "St. Petersburg — opciones compartidas en privado" },
                    { icon: Car, title: "Transporte", desc: "Independiente" },
                    { icon: Clock, title: "Agenda", desc: "Intensiva — 3 días completos de actividades" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3 bg-[#F5F7FA] border border-gray-200 rounded-xl p-4">
                      <item.icon className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-[#0B1F3A] font-semibold text-sm">{item.title}</h4>
                        <p className="text-[#6B7280] text-sm">{item.desc}</p>
                      </div>
                    </div>
                  ))}
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

      {/* ═══ 8. CONEXIÓN FONDO — ☀️ BLANCO ═══ */}
      <section className="bg-[#F5F7FA] py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl text-[#0B1F3A] mb-6">
                Esta experiencia conecta directamente con oportunidades reales
              </h2>
              <p className="text-[#4B5563] text-lg leading-relaxed mb-8">
                Durante el viaje analizas activos en operación, entiendes la estructura del fondo y evalúas tu participación con información directa y completa.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a href="/oportunidades-de-inversion-en-estados-unidos">
                  <Button className="bg-[#0B1F3A] hover:bg-[#0E2544] text-white px-8 py-6 text-base gap-2">
                    Ver oportunidades <ArrowRight className="w-4 h-4" />
                  </Button>
                </a>
                <a href="/membresia">
                  <Button variant="outline" className="border-gray-300 text-[#0B1F3A] hover:bg-gray-50 px-8 py-6 text-base">
                    Conoce la Membresía
                  </Button>
                </a>
              </div>
            </div>
          </FadeIn>
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
