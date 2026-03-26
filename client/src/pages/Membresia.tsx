import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AlliesSection from "@/components/AlliesSection";
import MemberTestimonialSlider from "@/components/MemberTestimonialSlider";

import { useInView } from "@/hooks/useInView";
import { useCountUp } from "@/hooks/useCountUp";
import { openWhatsApp, WHATSAPP_PHONE, WHATSAPP_MESSAGE } from "@/lib/whatsapp";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  CheckCircle2,
  ArrowRight,
  Users,
  Briefcase,
  Home,
  Scale,
  GraduationCap,
  Handshake,
  Shield,
  Target,
  Zap,
  BarChart3,
  Globe,
  Lock,
  Play,

  MapPin,
  Calendar,
  X,
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

/* ── data ── */
const VIDEO_URL =
  "https://res.cloudinary.com/dgruohz6f/video/upload/v1773439233/comprando-america/YalfpoAHGGBHORwE.mp4";
const VIDEO_POSTER =
  "https://res.cloudinary.com/dgruohz6f/video/upload/so_2,w_960,c_fill,q_auto,f_jpg/v1773439233/comprando-america/YalfpoAHGGBHORwE.jpg";

const enfoque = [
  {
    icon: Home,
    title: "Bienes Raíces Estratégicos",
    desc: "Single family homes y tierra estratégica con análisis real de entrada.",
  },
  {
    icon: Globe,
    title: "Migración con estructura",
    desc: "Visa E-1, E-2 o expansión empresarial alineada a inversión sostenible.",
  },
  {
    icon: Scale,
    title: "Estructuración LLC",
    desc: "Diseño correcto desde el inicio para proteger patrimonio.",
  },
  {
    icon: GraduationCap,
    title: "Educación Ejecutiva",
    desc: "Deal Days, mentorías y análisis práctico.",
  },
  {
    icon: Handshake,
    title: "Red de Expertos",
    desc: "Abogados, contadores, brokers y consultores con experiencia real.",
  },
];

const pilares = [
  {
    n: 1,
    title: "Criterio de Inversión",
    desc: "Decidimos con proceso, no con emoción. Analizamos tesis, números, riesgos y escenarios.",
  },
  {
    n: 2,
    title: "Curación Estratégica",
    desc: "Descartamos la mayoría de oportunidades. Protegemos capital, no vendemos proyectos.",
  },
  {
    n: 3,
    title: "Acompañamiento Integral",
    desc: "Estructura legal, fiscal, bancaria y migratoria alineada desde el inicio.",
  },
  {
    n: 4,
    title: "Comunidad Ejecutora",
    desc: "Empresarios que ya están tomando acción comparten experiencia real.",
  },
  {
    n: 5,
    title: "Velocidad de Activación",
    desc: "Diagnóstico claro y plan estructurado. Inversión en 60–90 días cuando hay encaje.",
  },
  {
    n: 6,
    title: "Transferencia Patrimonial",
    desc: "Diversificación internacional con visión de largo plazo y protección estructurada.",
  },
];

const diferenciadores = [
  "No vivimos de comisiones por vender activos.",
  "No promovemos cualquier oportunidad.",
  "No mezclamos migración con improvisación.",
  "No dejamos que inviertas sin estructura bancaria y fiscal clara.",
  "Solo el 20% de las oportunidades evaluadas son presentadas.",
];

const stats = [
  { value: 38, suffix: "+", label: "Miembros activos" },
  { value: 50, suffix: "+", label: "LLCs estructuradas" },
  { value: 6, suffix: "", label: "Viajes de inspección" },
  { value: 7, suffix: "", label: "Eventos presenciales" },
  { value: 11, suffix: "+", label: "Visas tramitadas" },
  { value: 7, suffix: "", label: "Visas en proceso" },
];

function StatCounter({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const { ref, isInView } = useInView();
  const count = useCountUp(value, 2000, isInView);
  return (
    <div ref={ref} className="text-center">
      <div className="text-primary font-serif text-3xl md:text-4xl lg:text-5xl font-bold mb-2">
        {count}{suffix}
      </div>
      <p className="text-white/50 text-xs mt-1">{label}</p>
    </div>
  );
}

const perfilSi = [
  "Puedes invertir $100,000 USD o más",
  "Buscas diversificación internacional estructurada",
  "Valoras proceso sobre improvisación",
  "Entiendes que proteger capital es prioridad",
  "Quieres acompañamiento real, no teoría",
  "Buscas ejecutar con orden y criterio",
];

const perfilNo = [
  "Buscas oportunidades rápidas sin análisis",
  "Esperas que otros tomen decisiones por ti",
  "No tienes capital disponible",
  "Quieres comisiones o intermediarios",
  "Buscas cursos o mentoría genérica",
  "Buscas resultados inmediatos sin estructura",
];

const plans = [
  {
    name: "Entry",
    price: "$10,000",
    ideal: "Empresarios dando sus primeros pasos en Estados Unidos",
    features: [
      "Constitución de LLC (Texas o Florida) + Registered Agent",
      "Deal Day & Deal Finding: taller intensivo presencial",
      "Estrategia de apertura bancaria y obtención de ITIN",
      "Consulta inicial de inmigración (1 hora)",
      "Plan de negocios para Visa E-2 (USCIS-ready)",
      "Tres módulos de formación especializados",
      "Sesiones individuales con expertos",
      "Comunidad privada + eventos digitales mensuales",
      "Acceso a eventos presenciales anuales",
      "Red de beneficios y descuentos",
    ],
    value: "$19,150",
    savings: "$11,650",
  },
  {
    name: "Growth",
    price: "$15,000",
    ideal: "Inversionistas con claridad sobre su estrategia",
    popular: true,
    features: [
      "Todo lo del Entry, más:",
      "Estrategia personalizada de acceso bancario",
      "Estrategia 1:1 para planeación patrimonial y de sucesión",
      "Acceso anticipado a oportunidades",
      "Mentoría especializada en estructuras complejas",
      "Prioridad en Deal Day",
    ],
    value: "Desde $25,000",
    savings: "$10,000+",
  },
  {
    name: "Legacy",
    price: "$25,000",
    ideal: "Inversionistas activos que buscan máximo acceso",
    features: [
      "Todo lo del Growth, más:",
      "Acceso VIP a todas las oportunidades",
      "Mentoría exclusiva con fundadores",
      "Participación en decisiones estratégicas del club",
      "Networking prioritario con inversionistas de alto nivel",
      "Asesoría personalizada continua",
    ],
    value: "Desde $40,000",
    savings: "$15,000+",
  },
];

/* ════════════════════════════════════════════════════════ */
export default function Membresia() {
  const [showVideo, setShowVideo] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />

      {/* ═══ HERO ═══ */}
      <section
        className="relative min-h-[60vh] flex items-center pt-32 pb-20"
        style={{
          backgroundImage:
            "url(https://res.cloudinary.com/dgruohz6f/image/upload/v1773439191/comprando-america/TjZnphAlUUQxwTMg.webp)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 -z-10 bg-black/40" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[oklch(0.08_0.03_250/0.92)] via-[oklch(0.10_0.03_250/0.85)] to-[oklch(0.08_0.03_250/0.70)]" />

        <div className="container relative z-10">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <span className="inline-block text-primary text-sm font-semibold tracking-[0.25em] uppercase mb-6 font-mono">
                Membresía Vitalicia
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white leading-[1.1] mb-6">
                Club Privado de Inversionistas en{" "}
                <span className="gradient-text-primary">Estados Unidos</span>
              </h1>
              <p className="text-lg md:text-xl text-white/70 leading-relaxed mb-10 max-w-2xl">
                Comunidad exclusiva para inversionistas con capacidad real que
                buscan oportunidades filtradas con acompañamiento legal,
                migratorio y estratégico.
              </p>
              <Button
                onClick={() =>
                  openWhatsApp(WHATSAPP_PHONE, WHATSAPP_MESSAGE)
                }
                className="bg-primary hover:bg-primary/90 text-white font-semibold px-8 py-6 text-base gap-2"
              >
                Solicitar Acceso <ArrowRight className="w-4 h-4" />
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ VIDEO (siempre visible con poster) ═══ */}
      <section className="section-dark py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-10">
                <h2 className="text-3xl md:text-4xl font-serif text-white mb-4">
                  Descubre Cómo Funciona
                </h2>
                <p className="text-white/60 text-lg max-w-2xl mx-auto">
                  Mira cómo nuestros miembros acceden a oportunidades de
                  inversión exclusivas y reciben acompañamiento estratégico.
                </p>
              </div>

              <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-black aspect-video">
                {!showVideo ? (
                  <button
                    onClick={() => setShowVideo(true)}
                    className="group relative w-full h-full"
                  >
                    <img
                      src={VIDEO_POSTER}
                      alt="Conoce la membresía"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-20 h-20 rounded-full bg-primary/90 group-hover:bg-primary group-hover:scale-110 transition-all flex items-center justify-center shadow-2xl">
                        <Play className="w-8 h-8 text-white ml-1" />
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
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ NUESTRO ENFOQUE ═══ */}
      <section className="section-darker py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="text-center mb-12">
              <p className="text-primary text-sm font-semibold tracking-[0.2em] uppercase mb-4 font-mono">
                Nuestro Enfoque
              </p>
              <h2 className="text-3xl md:text-4xl font-serif text-white">
                Enfoque integral en Estados Unidos
              </h2>
            </div>
          </FadeIn>

          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 max-w-5xl mx-auto">
            {enfoque.map((item, i) => (
              <FadeIn key={i} delay={i * 0.05}>
                <div className="bg-[oklch(0.15_0.03_250)] border border-white/5 rounded-xl p-5 text-center hover:border-primary/30 transition-all h-full">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-white font-semibold text-sm mb-2">
                    {item.title}
                  </h3>
                  <p className="text-white/50 text-xs leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ METODOLOGÍA + POR QUÉ ES DIFERENTE (combinadas) ═══ */}
      <section className="section-dark py-20 md:py-28">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Metodología */}
            <FadeIn>
              <div>
                <p className="text-primary text-sm font-semibold tracking-[0.2em] uppercase mb-4 font-mono">
                  Metodología
                </p>
                <h2 className="text-3xl font-serif text-white mb-3">
                  El sistema detrás de la membresía
                </h2>
                <p className="text-white/50 text-sm mb-8">
                  6 pilares que transforman barreras en ventajas estratégicas
                </p>

                <div className="space-y-4">
                  {pilares.map((p) => (
                    <div
                      key={p.n}
                      className="flex items-start gap-4 group"
                    >
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 text-sm font-bold group-hover:bg-primary/20 transition-colors">
                        {p.n}
                      </div>
                      <div>
                        <h4 className="text-white font-semibold text-sm">
                          {p.title}
                        </h4>
                        <p className="text-white/50 text-xs leading-relaxed">
                          {p.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <p className="text-white/40 text-sm mt-8 italic">
                  No vendemos promesas. Construimos estructura.
                </p>
              </div>
            </FadeIn>

            {/* Por qué es diferente */}
            <FadeIn delay={0.1}>
              <div>
                <p className="text-primary text-sm font-semibold tracking-[0.2em] uppercase mb-4 font-mono">
                  ¿Por qué es diferente?
                </p>
                <h2 className="text-3xl font-serif text-white mb-8">
                  Somos sistema de inversión
                </h2>

                <div className="space-y-4 mb-10">
                  {diferenciadores.map((d, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <p className="text-white/70 text-sm">{d}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-gradient-to-r from-primary/10 to-transparent border border-primary/20 rounded-xl p-6">
                  <p className="text-white font-semibold mb-1">
                    Somos sistema de inversión.
                  </p>
                  <p className="text-white/60 text-sm">
                    No marketing de proyectos.
                  </p>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ═══ AUTORIDAD (STATS) ═══ */}
      <section className="section-darker py-16 md:py-20">
        <div className="container">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-serif text-white text-center mb-12">
              Ejecutamos. No solo analizamos.
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-5xl mx-auto">
              {stats.map((s, i) => (
                <FadeIn key={i} delay={i * 0.05}>
                  <StatCounter {...s} />
                </FadeIn>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ PERFIL IDEAL ═══ */}
      <section className="section-dark py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-serif text-white mb-12 text-center">
              ¿Es para ti?
            </h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Sí */}
              <div className="bg-[oklch(0.15_0.03_250)] border border-primary/20 rounded-xl p-8">
                <h3 className="text-white font-semibold mb-6 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  Es para ti si:
                </h3>
                <ul className="space-y-3">
                  {perfilSi.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="text-primary font-bold text-sm mt-0.5">
                        ✓
                      </span>
                      <span className="text-white/70 text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* No */}
              <div className="bg-[oklch(0.15_0.03_250)] border border-white/5 rounded-xl p-8">
                <h3 className="text-white font-semibold mb-6 flex items-center gap-2">
                  <X className="w-5 h-5 text-white/50" />
                  No es para ti si:
                </h3>
                <ul className="space-y-3">
                  {perfilNo.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="text-white/40 text-sm mt-0.5">✕</span>
                      <span className="text-white/50 text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="max-w-2xl mx-auto text-center mt-10">
              <p className="text-white/60 leading-relaxed">
                Esto no es para todos.{" "}
                <span className="text-white">
                  Es para quien entiende que estructurar bien es más importante
                  que entrar rápido.
                </span>
              </p>
              <p className="text-white/40 text-sm mt-4">
                El siguiente paso no es pagar. Es validar si tu perfil encaja.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ PLANES ═══ */}
      <section className="section-darker py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="text-center mb-12">
              <p className="text-primary text-sm font-semibold tracking-[0.2em] uppercase mb-4 font-mono">
                Planes
              </p>
              <h2 className="text-3xl md:text-4xl font-serif text-white">
                Elige tu Plan de Membresía
              </h2>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {plans.map((plan, i) => (
              <FadeIn key={plan.name} delay={i * 0.1}>
                <div
                  className={`relative rounded-2xl p-6 border transition-all duration-500 h-full flex flex-col ${
                    plan.popular
                      ? "bg-gradient-to-br from-primary/20 to-primary/5 border-primary/40 ring-2 ring-primary/30"
                      : "bg-[oklch(0.15_0.03_250)] border-white/5 hover:border-primary/30"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white px-3 py-0.5 rounded-full text-xs font-semibold">
                      Más Popular
                    </div>
                  )}
                  <h3 className="text-2xl font-serif text-white mb-1">
                    Investor{" "}
                    <span className="text-primary">{plan.name}</span>
                  </h3>
                  <div className="mb-4">
                    <div className="text-3xl font-bold text-primary mb-1">
                      {plan.price}
                    </div>
                    <p className="text-white/50 text-xs">{plan.ideal}</p>
                  </div>
                  <div className="mb-4 pb-4 border-b border-white/10 text-xs">
                    <p className="text-white/60">
                      <strong>Valor:</strong> {plan.value}
                    </p>
                    <p className="text-primary">
                      <strong>Ahorro:</strong> {plan.savings}
                    </p>
                  </div>

                  {/* Features in accordion for compactness */}
                  <Accordion type="single" collapsible className="mb-4 flex-grow">
                    <AccordionItem
                      value="features"
                      className="border-0"
                    >
                      <AccordionTrigger className="text-white/60 text-sm py-2 hover:text-primary">
                        Ver beneficios incluidos
                      </AccordionTrigger>
                      <AccordionContent>
                        <ul className="space-y-2">
                          {plan.features.map((f, fi) => (
                            <li
                              key={fi}
                              className="flex items-start gap-2"
                            >
                              <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                              <span className="text-white/60 text-xs">
                                {f}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>

                  <Button
                    onClick={() =>
                      openWhatsApp(WHATSAPP_PHONE, WHATSAPP_MESSAGE)
                    }
                    className={`w-full py-3 font-semibold gap-2 text-sm ${
                      plan.popular
                        ? "bg-primary hover:bg-primary/90 text-white"
                        : "bg-white/10 hover:bg-white/20 text-white border border-white/20"
                    }`}
                  >
                    Elegir {plan.name}{" "}
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ EVENTOS ═══ */}
      <section className="section-dark py-20 md:py-28">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <FadeIn>
              <div className="bg-[oklch(0.15_0.03_250)] border border-primary/20 rounded-xl p-8 h-full">
                <Calendar className="w-8 h-8 text-primary mb-4" />
                <h3 className="text-2xl font-serif text-white mb-3">
                  Eventos y Networking
                </h3>
                <p className="text-white/60 text-sm leading-relaxed mb-6">
                  Encuentros presenciales donde empresarios comparten
                  experiencias, cierran negocios y construyen relaciones.
                </p>
                <div className="space-y-3">
                  {[
                    {
                      title: "Cumbres Presenciales",
                      desc: "Eventos anuales en diferentes ciudades.",
                    },
                    {
                      title: "Viajes de Inspección",
                      desc: "Visitas guiadas a oportunidades en EE.UU.",
                    },
                    {
                      title: "Networking Exclusivo",
                      desc: "Comunidad de empresarios y expertos.",
                    },
                  ].map((e, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <span className="text-primary font-bold text-sm mt-0.5">
                        0{i + 1}
                      </span>
                      <div>
                        <p className="text-white text-sm font-semibold">
                          {e.title}
                        </p>
                        <p className="text-white/50 text-xs">{e.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ═══ EDMUNDO TREVIÑO – CEO ═══ */}
      <section className="section-dark py-24 md:py-32">
        <div className="container">
          <FadeIn>
            <div className="text-center mb-16">
              <p className="text-primary text-sm font-semibold tracking-[0.25em] uppercase mb-6 font-mono">
                Liderazgo
              </p>
              <h2 className="text-4xl md:text-5xl font-serif text-white">
                Quién está al frente
              </h2>
            </div>
          </FadeIn>

          <FadeIn>
            <div className="max-w-5xl mx-auto bg-gradient-to-br from-[oklch(0.15_0.03_250)] to-[oklch(0.12_0.03_250)] border border-primary/20 rounded-2xl p-8 md:p-12">
              <div className="flex flex-col md:flex-row gap-10 items-start">
                {/* Photo */}
                <div className="flex-shrink-0 mx-auto md:mx-0">
                  <img
                    src="https://res.cloudinary.com/dgruohz6f/image/upload/v1773439317/comprando-america/smuMGomxJclpEXzg.png"
                    alt="Edmundo Treviño"
                    className="w-48 h-56 md:w-56 md:h-64 rounded-xl object-cover border-2 border-primary/20 shadow-lg shadow-primary/10"
                  />
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="text-3xl md:text-4xl font-serif text-white mb-2">
                    Edmundo Treviño
                  </h3>
                  <p className="text-primary text-sm font-semibold tracking-[0.2em] uppercase mb-6">
                    Director General
                  </p>
                  <p className="text-white/70 text-lg leading-relaxed mb-8">
                    Empresario serial, fundador y CEO de 9 empresas operando en Estados Unidos. Apasionado por trascender conquistando el mercado americano.
                  </p>

                  <ul className="space-y-3 mb-10">
                    {[
                      "Ingeniero Mecánico Administrador con MBA en Economía Industrial",
                      "Maestría en Sistema Fiscal en Estados Unidos",
                      "10 años de experiencia en contabilidad y administración de empresas",
                      "20 años de experiencia en comercio internacional",
                      "Más de 8 empresas operando en Estados Unidos y México",
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-5 h-5 rounded-full border border-primary/40 flex items-center justify-center mt-0.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                        </span>
                        <span className="text-white/70 text-sm leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex flex-wrap gap-4">
                    <a href="https://edmundotrevino.com" target="_blank" rel="noopener noreferrer">
                      <Button className="bg-primary hover:bg-primary/90 text-white px-6 py-3 text-sm gap-2">
                        Conoce más <ArrowRight className="w-4 h-4" />
                      </Button>
                    </a>
                    <a href="https://edmundotrevino.com" target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" className="border-white/20 text-white hover:bg-white/5 px-6 py-3 text-sm gap-2">
                        Agendar Asesoría 1:1 <ArrowRight className="w-4 h-4" />
                      </Button>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ ALIADOS EXPERTOS ═══ */}
      <AlliesSection />

      {/* ═══ TESTIMONIOS ═══ */}
      <MemberTestimonialSlider />

      {/* ═══ CTA FINAL ═══ */}
      <section className="section-dark py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-serif text-white mb-4">
                ¿Estás listo?
              </h2>
              <p className="text-white/60 leading-relaxed mb-4">
                Si entiendes que invertir en Estados Unidos requiere estructura,
                el siguiente paso es validar tu encaje.
              </p>
              <p className="text-white/40 text-sm mb-10">
                No es pagar. Es evaluar si perteneces al grupo.
              </p>
              <Button
                onClick={() =>
                  openWhatsApp(WHATSAPP_PHONE, WHATSAPP_MESSAGE)
                }
                className="bg-primary hover:bg-primary/90 text-white font-semibold px-10 py-6 text-lg gap-2"
              >
                Solicitar Evaluación{" "}
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          </FadeIn>
        </div>
      </section>

      <Footer />
    </div>
  );
}
