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

/* ─── Head (noindex) ─── */
function SEOHead() {
  useEffect(() => {
    document.title = "Florida Investment Week | Comprando América";
    // noindex
    let meta = document.querySelector('meta[name="robots"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "robots");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", "noindex, nofollow");

    const desc = document.querySelector('meta[name="description"]');
    if (desc) {
      desc.setAttribute(
        "content",
        "Viaje de inspección privado para inversionistas. Tampa, Florida. Acceso por invitación."
      );
    }
  }, []);
  return null;
}

/* ─── Photos ─── */
const CLOUD = "https://res.cloudinary.com/dofccqypz/image/upload";
function cImg(id: string, v: string, w = 1200, h = 600) {
  return `${CLOUD}/c_fill,w_${w},h_${h},g_auto,q_auto,f_auto/v${v}/comprando-america/eventos/${id}.jpg`;
}

const PHOTOS = {
  inspeccion: cImg("uefjxoxi5trojtoeivha", "1774537564"),
  propiedad: cImg("vjyyrtfskd3w7nmklbt3", "1774537570"),
  cena: cImg("n8lkmvpmlrnco9etkxfb", "1774537526"),
  trabajo: cImg("v7r3cxs7gg19ktnwniis", "1774537541"),
};

const WA_APPLY = "Hola, me interesa aplicar a la Florida Investment Week (1-4 mayo 2026).";

/* ═══════════════════════════════════════════════════════ */

export default function InvestmentWeek() {
  const scrollToApply = () => {
    document
      .getElementById("aplicar")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <SEOHead />
      <Navbar />

      {/* ═══ BANNER ACCESO RESTRINGIDO ═══ */}
      <div className="bg-[#132D50] border-b border-blue-500/20 pt-20">
        <div className="container py-4">
          <div className="flex items-center justify-center gap-3 text-center">
            <Lock className="w-4 h-4 text-primary flex-shrink-0" />
            <p className="text-white/60 text-sm">
              <span className="text-primary font-semibold">
                Acceso restringido.
              </span>{" "}
              Esta experiencia es por invitación y perfil aprobado. La
              información no es pública.
            </p>
          </div>
        </div>
      </div>

      {/* ═══ 1. HERO ═══ */}
      <section className="relative isolate min-h-[80vh] flex items-center py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[oklch(0.08_0.02_260)] via-background to-[oklch(0.10_0.04_250)]" />
        <div className="absolute top-1/4 right-0 w-[500px] h-[500px] rounded-full bg-primary/3 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-amber-500/3 blur-3xl" />

        <div className="container relative z-10">
          <FadeIn>
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-primary text-xs font-semibold tracking-wider uppercase mb-8">
                <Shield className="w-3.5 h-3.5" />
                Experiencia por invitación
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white leading-tight mb-4">
                Florida Investment Week
              </h1>
              <p className="text-xl md:text-2xl font-serif text-white/60 mb-6">
                Acceso directo a activos, estructura y decisiones reales en
                Estados Unidos
              </p>
              <p className="text-white/50 text-lg leading-relaxed mb-8 max-w-2xl">
                Un viaje de inspección diseñado para inversionistas que buscan
                entender, analizar y ejecutar oportunidades directamente en
                terreno.
              </p>

              <div className="flex flex-wrap gap-4 text-white/60 text-sm mb-8">
                <span className="flex items-center gap-2 bg-[#0F2847]/5 px-4 py-2 rounded-full">
                  <MapPin className="w-4 h-4 text-primary" /> Tampa · St.
                  Petersburg · Clearwater
                </span>
                <span className="flex items-center gap-2 bg-[#0F2847]/5 px-4 py-2 rounded-full">
                  <CalendarDays className="w-4 h-4 text-primary" /> 1–4 mayo
                  2026
                </span>
                <span className="flex items-center gap-2 bg-[#0F2847]/5 px-4 py-2 rounded-full">
                  <Users className="w-4 h-4 text-primary" /> Cupo limitado
                </span>
              </div>

              <div className="flex flex-wrap gap-4 mb-10">
                <Button
                  onClick={scrollToApply}
                  className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-base gap-2 shadow-lg shadow-blue-600/20"
                >
                  Aplicar al viaje <ArrowRight className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => openWhatsApp(WHATSAPP_PHONE, WA_APPLY)}
                  className="border-[#2A4A6B] text-white hover:bg-[#1E3A5F] px-8 py-6 text-base gap-2"
                >
                  Confirmar interés
                </Button>
              </div>

              <div className="flex flex-wrap gap-6 text-white/50 text-sm">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" /> Terreno
                  real
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" /> Propiedades
                  reales
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" /> Números
                  reales
                </span>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ 2. QUÉ ES ═══ */}
      <section className="section-darker py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-serif text-white mb-6">
                No es un seminario.{" "}
                <span className="text-primary">
                  Es una experiencia en terreno
                </span>
              </h2>
              <p className="text-white/60 text-lg leading-relaxed mb-8">
                Durante 4 días:
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  "Visitas activos reales en operación",
                  "Analizas oportunidades directamente en sitio",
                  "Entiendes estructuras con contexto completo",
                  "Conectas con inversionistas que ya están ejecutando",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <p className="text-white/60">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ 3. A QUIÉN ESTÁ DIRIGIDO ═══ */}
      <section className="section-dark py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-serif text-white mb-6">
                Esta experiencia es para perfiles específicos
              </h2>
              <div className="space-y-4 mb-10">
                {[
                  "Inversionistas con capital disponible para actuar",
                  "Empresarios en proceso de expansión hacia EE.UU.",
                  "Personas que ya conocen el fondo o han interactuado con el equipo",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <p className="text-white/60 text-lg">{item}</p>
                  </div>
                ))}
              </div>
              <div className="bg-[#0F2847] border border-[#1E3A5F] rounded-xl p-8">
                <p className="text-white/80 text-lg font-serif">
                  No es un evento abierto.{" "}
                  <span className="text-primary font-semibold">
                    El acceso se valida previamente.
                  </span>
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ 4. AGENDA ═══ */}
      <section className="section-darker py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="text-center mb-16">
              <p className="text-primary text-sm font-semibold tracking-[0.25em] uppercase mb-4 font-mono">
                Agenda
              </p>
              <h2 className="text-3xl md:text-4xl font-serif text-white">
                4 días de experiencia intensiva
              </h2>
            </div>
          </FadeIn>

          <div className="max-w-5xl mx-auto space-y-8">
            {/* DÍA 1 */}
            <FadeIn>
              <div className="relative bg-gradient-to-br from-[oklch(0.14_0.03_250)] to-[oklch(0.11_0.02_260)] border border-blue-500/20 rounded-2xl overflow-hidden">
                <div className="grid lg:grid-cols-[280px_1fr]">
                  <div className="bg-blue-500/10 p-8 flex flex-col justify-center border-r border-primary/10">
                    <p className="text-primary text-xs font-semibold tracking-[0.3em] uppercase mb-2 font-mono">
                      Día 1
                    </p>
                    <h3 className="text-2xl font-serif text-white">
                      Bienvenida
                    </h3>
                    <p className="text-white/50 text-sm mt-2">
                      1 de mayo, 2026
                    </p>
                  </div>
                  <div className="p-8">
                    <div className="grid sm:grid-cols-2 gap-4">
                      {[
                        "Llegada a Tampa",
                        "Sesión estratégica de apertura",
                        "Tendencias del mercado inmobiliario",
                        "Presentación del equipo y aliados",
                        "Análisis preliminar de activos",
                        "Cena privada de networking",
                      ].map((item, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                          <p className="text-white/60 text-sm">{item}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>

            {/* DÍA 2 */}
            <FadeIn>
              <div className="relative bg-gradient-to-br from-[oklch(0.14_0.03_250)] to-[oklch(0.11_0.02_260)] border border-blue-500/20 rounded-2xl overflow-hidden">
                <div className="grid lg:grid-cols-[280px_1fr]">
                  <div className="bg-blue-500/10 p-8 flex flex-col justify-center border-r border-primary/10">
                    <p className="text-primary text-xs font-semibold tracking-[0.3em] uppercase mb-2 font-mono">
                      Día 2
                    </p>
                    <h3 className="text-2xl font-serif text-white">
                      Residencial
                    </h3>
                    <p className="text-white/50 text-sm mt-2">
                      2 de mayo, 2026
                    </p>
                  </div>
                  <div className="p-8">
                    <p className="text-primary text-xs font-semibold tracking-wider uppercase mb-3">
                      Mañana — Sesión teórica
                    </p>
                    <div className="grid sm:grid-cols-2 gap-3 mb-6">
                      {[
                        "Cómo funciona el mercado residencial",
                        "Cómo leer un deal (NOI, Cap Rate, Cash-on-Cash)",
                        "Financiamiento y estructura",
                        "Estrategia fiscal para inversionistas",
                      ].map((item, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                          <p className="text-white/60 text-sm">{item}</p>
                        </div>
                      ))}
                    </div>
                    <p className="text-primary text-xs font-semibold tracking-wider uppercase mb-3">
                      Tarde — Recorrido en campo
                    </p>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {[
                        "Visitas a propiedades residenciales",
                        "Análisis en vivo de oportunidades",
                      ].map((item, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <Eye className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                          <p className="text-white/60 text-sm">{item}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>

            {/* DÍA 3 */}
            <FadeIn>
              <div className="relative bg-gradient-to-br from-[oklch(0.14_0.03_250)] to-[oklch(0.11_0.02_260)] border border-blue-500/20 rounded-2xl overflow-hidden">
                <div className="grid lg:grid-cols-[280px_1fr]">
                  <div className="bg-blue-500/10 p-8 flex flex-col justify-center border-r border-primary/10">
                    <p className="text-primary text-xs font-semibold tracking-[0.3em] uppercase mb-2 font-mono">
                      Día 3
                    </p>
                    <h3 className="text-2xl font-serif text-white">
                      Mobile Home Parks
                    </h3>
                    <p className="text-white/50 text-sm mt-2">
                      3 de mayo, 2026
                    </p>
                  </div>
                  <div className="p-8">
                    <p className="text-primary text-xs font-semibold tracking-wider uppercase mb-3">
                      Mañana — Análisis estratégico
                    </p>
                    <div className="grid sm:grid-cols-2 gap-3 mb-6">
                      {[
                        "Por qué este activo es resiliente",
                        "Cómo se valúa un mobile home park",
                        "Palancas de valor y optimización",
                        "Estructura del fondo de inversión",
                      ].map((item, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                          <p className="text-white/60 text-sm">{item}</p>
                        </div>
                      ))}
                    </div>
                    <p className="text-primary text-xs font-semibold tracking-wider uppercase mb-3">
                      Tarde — Inspección en campo
                    </p>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {[
                        "Visita a parques activos en operación",
                        "Análisis real de métricas y condiciones",
                        "Comparativa de activos en terreno",
                      ].map((item, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <Eye className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                          <p className="text-white/60 text-sm">{item}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>

            {/* DÍA 4 */}
            <FadeIn>
              <div className="relative bg-[oklch(0.13_0.02_250)] border border-[#1E3A5F] rounded-2xl overflow-hidden">
                <div className="grid lg:grid-cols-[280px_1fr]">
                  <div className="bg-[#0F2847]/5 p-8 flex flex-col justify-center border-r border-[#1E3A5F]">
                    <p className="text-primary text-xs font-semibold tracking-[0.3em] uppercase mb-2 font-mono">
                      Día 4
                    </p>
                    <h3 className="text-2xl font-serif text-white">Regreso</h3>
                    <p className="text-white/50 text-sm mt-2">
                      4 de mayo, 2026
                    </p>
                  </div>
                  <div className="p-8 flex items-center">
                    <p className="text-white/60">
                      Salida libre desde Tampa u Orlando. Cierre de conclusiones
                      y próximos pasos individuales.
                    </p>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ═══ 5. QUÉ HACE DIFERENTE ═══ */}
      <section className="section-dark py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-serif text-white mb-6">
                Aquí no vienes a escuchar…
                <br />
                <span className="text-primary">
                  vienes a ver, analizar y decidir
                </span>
              </h2>
              <div className="grid sm:grid-cols-2 gap-6 mt-10 text-left">
                {[
                  {
                    title: "Activos reales",
                    desc: "Visitas propiedades y parques en operación, no presentaciones teóricas.",
                  },
                  {
                    title: "Contexto completo",
                    desc: "Entiendes la estructura legal, fiscal y operativa de cada oportunidad.",
                  },
                  {
                    title: "Acceso directo",
                    desc: "Conectas con el equipo, los aliados y los activos sin intermediarios.",
                  },
                  {
                    title: "Sesiones 1 a 1",
                    desc: "Espacio para analizar tu caso particular con los expertos.",
                  },
                ].map((item, i) => (
                  <FadeIn key={i} delay={i * 0.1}>
                    <div className="bg-[#132D50] border border-[#1E3A5F] rounded-xl p-6 h-full hover:border-blue-500/20 transition-all">
                      <CheckCircle2 className="w-6 h-6 text-primary mb-3" />
                      <h3 className="text-lg font-serif text-white mb-2">
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

      {/* ═══ 6. FILTRO ═══ */}
      <section className="section-darker py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="max-w-3xl mx-auto">
              <Lock className="w-10 h-10 text-primary mb-4" />
              <h2 className="text-3xl md:text-4xl font-serif text-white mb-6">
                El acceso es limitado y filtrado
              </h2>
              <p className="text-white/60 text-lg leading-relaxed mb-8">
                Para participar en esta experiencia:
              </p>
              <div className="space-y-4 mb-10">
                {[
                  "Haber interactuado previamente con el fondo o el equipo",
                  "Cumplir con el perfil de inversión requerido",
                  "Contar con intención real de participar",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <p className="text-white/60 text-lg">{item}</p>
                  </div>
                ))}
              </div>
              <div className="bg-[#132D50] border border-blue-500/20 rounded-xl p-8">
                <p className="text-white/80 text-lg font-serif">
                  No todas las personas que aplican son aceptadas.
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ 7. CTA INTERMEDIO ═══ */}
      <section id="aplicar" className="section-dark py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-serif text-white mb-8">
                ¿Quieres aplicar a esta experiencia?
              </h2>
              <div className="flex flex-wrap justify-center gap-4">
                <Button
                  onClick={() => openWhatsApp(WHATSAPP_PHONE, WA_APPLY)}
                  className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-base gap-2 shadow-lg shadow-blue-600/20"
                >
                  Aplicar al viaje <ArrowRight className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => openWhatsApp(WHATSAPP_PHONE, WA_APPLY)}
                  className="border-[#2A4A6B] text-white hover:bg-[#1E3A5F] px-8 py-6 text-base gap-2"
                >
                  Hablar por WhatsApp
                </Button>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ 8. LOGÍSTICA ═══ */}
      <section className="section-darker py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="max-w-3xl mx-auto">
              <p className="text-primary text-sm font-semibold tracking-[0.25em] uppercase mb-4 font-mono">
                Logística
              </p>
              <h2 className="text-3xl md:text-4xl font-serif text-white mb-10">
                Información general
              </h2>
              <div className="grid sm:grid-cols-2 gap-6">
                {[
                  {
                    icon: Plane,
                    title: "Llegada",
                    desc: "Aeropuerto de Tampa (TPA)",
                  },
                  {
                    icon: Hotel,
                    title: "Hospedaje sugerido",
                    desc: "St. Petersburg — opciones cercanas a las visitas",
                  },
                  {
                    icon: Car,
                    title: "Transporte",
                    desc: "Independiente — se recomienda renta de auto",
                  },
                  {
                    icon: Clock,
                    title: "Agenda",
                    desc: "Intensiva — 3 días completos de actividades",
                  },
                ].map((item, i) => (
                  <FadeIn key={i} delay={i * 0.05}>
                    <div className="flex items-start gap-4 bg-[#132D50] border border-[#1E3A5F] rounded-xl p-5">
                      <item.icon className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="text-white font-semibold text-sm mb-1">
                          {item.title}
                        </h3>
                        <p className="text-white/50 text-sm">{item.desc}</p>
                      </div>
                    </div>
                  </FadeIn>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ 9. CONEXIÓN CON EL FONDO ═══ */}
      <section className="section-dark py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-serif text-white mb-6">
                Esta experiencia conecta directamente con oportunidades reales
              </h2>
              <p className="text-white/60 text-lg leading-relaxed mb-8">
                Durante el viaje analizas activos en operación, entiendes la
                estructura del fondo y evalúas tu participación con información
                directa y completa.
              </p>
              <a href="/oportunidades-de-inversion-en-estados-unidos">
                <Button
                  variant="outline"
                  className="border-[#2A4A6B] text-white hover:bg-[#1E3A5F] px-8 py-6 text-base gap-2"
                >
                  Ver oportunidades <ArrowRight className="w-4 h-4" />
                </Button>
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ 10. CTA FINAL ═══ */}
      <section className="section-darker py-24 md:py-32">
        <div className="container">
          <FadeIn>
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-serif text-white mb-6">
                Si este tipo de experiencias hace sentido para ti, puedes
                aplicar
              </h2>
              <p className="text-white/50 text-sm mb-10">
                El cupo es limitado. La selección es por perfil.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button
                  onClick={() => openWhatsApp(WHATSAPP_PHONE, WA_APPLY)}
                  className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-base gap-2 shadow-lg shadow-blue-600/20"
                >
                  Aplicar <ArrowRight className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => openWhatsApp(WHATSAPP_PHONE, WA_APPLY)}
                  className="border-[#2A4A6B] text-white hover:bg-[#1E3A5F] px-8 py-6 text-base gap-2"
                >
                  WhatsApp
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
