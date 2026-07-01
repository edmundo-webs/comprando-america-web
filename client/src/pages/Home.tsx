/*
 * Home 2026 — Premium Investment Club
 * Profiling-first: 2 paths (Proteger patrimonio / Migrar con inversión)
 * Stats + Edmundo CEO + Experts + Testimonials + Events
 */

import { useEffect, useRef, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useInView } from "@/hooks/useInView";
import { openWhatsApp, WHATSAPP_PHONE } from "@/lib/whatsapp";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  CheckCircle2,
  Shield,
  Globe,
  MapPin,
  Mic,
  Newspaper,
  BookOpen,
  Quote,
  ChevronDown,
  X,
  Briefcase,
  GraduationCap,
  Building,
  Building2,
  Monitor,
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

/* ─── CountUp ─── */
function useCountUp(target: number, duration: number, trigger: boolean) {
  const ref = useRef(0);
  const frameRef = useRef<number>();
  const [count, setCount] = [ref.current, (v: number) => { ref.current = v; }];
  useEffect(() => {
    if (!trigger) return;
    let start = 0;
    const step = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const value = Math.floor(progress * target);
      setCount(value);
      document.querySelectorAll(`[data-count="${target}"]`).forEach(el => { el.textContent = String(value); });
      if (progress < 1) frameRef.current = requestAnimationFrame(step);
      else document.querySelectorAll(`[data-count="${target}"]`).forEach(el => { el.textContent = String(target); });
    };
    frameRef.current = requestAnimationFrame(step);
    return () => { if (frameRef.current) cancelAnimationFrame(frameRef.current); };
  }, [trigger, target, duration]);
}

function StatCounter({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const { ref, isInView } = useInView();
  useCountUp(value, 2000, isInView);
  return (
    <div ref={ref} className="text-center">
      <div className="text-primary text-3xl md:text-4xl font-bold mb-1"><span data-count={value}>0</span>{suffix}</div>
      <p className="text-slate-400 text-xs uppercase tracking-wider">{label}</p>
    </div>
  );
}

/* ─── SEO ─── */
import SEOHead from "@/components/SEOHead";
const PAGE_SEO = {
  title: "Comprando América | Inversión y estructura en Estados Unidos",
  description: "Grupo Empresarial de Edmundo: la comunidad privada para empresarios latinos que invierten, estructuran y crecen en Estados Unidos. Acceso por aplicación desde $100,000 USD.",
  path: "/",
  schema: {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      { "@type": "Question", "name": "¿Cómo invertir en Estados Unidos desde México?", "acceptedAnswer": { "@type": "Answer", "text": "Con Comprando América puedes invertir desde $100,000 USD a través de una LLC en Texas o Florida, con estructura legal, fiscal y acompañamiento para bienes raíces o adquisición de negocios." } },
      { "@type": "Question", "name": "¿Qué es la visa E-2 de inversionista?", "acceptedAnswer": { "@type": "Answer", "text": "La visa E-2 permite a inversionistas extranjeros vivir y trabajar en Estados Unidos operando un negocio real. Requiere inversión sustancial (desde $150,000 USD) y un plan de negocios aprobado por USCIS." } },
      { "@type": "Question", "name": "¿Necesito vivir en Estados Unidos para invertir?", "acceptedAnswer": { "@type": "Answer", "text": "No. Puedes proteger tu patrimonio invirtiendo en dólares con una LLC y cuenta bancaria en Estados Unidos sin necesidad de residir o migrar." } },
      { "@type": "Question", "name": "¿Qué incluye el Grupo Empresarial de Edmundo de Comprando América?", "acceptedAnswer": { "@type": "Answer", "text": "Deal Day mensual, sesiones con expertos, mentorías, eventos presenciales VIP, conversaciones exclusivas con inversionistas activos y la Mesa de Dueños — comunidad privada de evaluación." } },
      { "@type": "Question", "name": "¿Es mejor invertir en Texas o Florida?", "acceptedAnswer": { "@type": "Answer", "text": "Depende de tu objetivo. Texas ofrece protección patrimonial fuerte y sin impuesto estatal sobre la renta. Florida tiene ventajas para bienes raíces y clima favorable. Analizamos tu caso específico." } }
    ]
  }
};

/* ─── Photos ─── */
const HERO_IMAGE = "https://lh3.googleusercontent.com/d/1Um6fwMpl_mMyAZWmF1hWVdnLYpJCp0Kz=w1920";
const AUDIENCE = "https://lh3.googleusercontent.com/d/1gnZX2RiYD4M29nQmqwcsN0k13db74LmV=w1920";
const NETWORKING = "https://lh3.googleusercontent.com/d/1dOiMwsphB-MpHgpCDtufBtiqaycAIM8W=w1920";
const EDMUNDO_PORTRAIT = "https://lh3.googleusercontent.com/d/1Um6fwMpl_mMyAZWmF1hWVdnLYpJCp0Kz=w800";
const PANEL = "https://lh3.googleusercontent.com/d/191DAUtt8vkLpZJatNDqvtYrRIc1Z-VHO=w1920";
const AERIAL = "https://res.cloudinary.com/dofccqypz/image/upload/v1774537564/comprando-america/eventos/uefjxoxi5trojtoeivha.jpg";
const RUTA_PHOTO = "https://res.cloudinary.com/dofccqypz/image/upload/c_fill,w_800,h_480,g_auto,q_auto,f_auto/v1774537570/comprando-america/eventos/vjyyrtfskd3w7nmklbt3.jpg";
const INVEST_WEEK = "https://lh3.googleusercontent.com/d/14QiLZK8eOY1ikSQB3fQqPo3ocWhD77bE=w1200";
const CUMBRE_DIGITAL_PHOTO = "https://res.cloudinary.com/dgruohz6f/image/upload/v1782675102/tts-news/qsqtimcq0kinkp5j6gcs.jpg";
const MIGRAR_PHOTO = "https://lh3.googleusercontent.com/d/1CqOlO-lELT7-uQhCI26MjP19ibLQu95N=w1200";

/* ─── Experts ─── */
const EXPERTS = [
  {
    name: "Joe Faraci",
    role: "Inversionista en Bienes Raíces",
    img: "https://res.cloudinary.com/dgruohz6f/image/upload/v1773439239/comprando-america/YfxVlywHHLmCeDRI.png",
    bio: "Propietario de 250+ propiedades con 28 años de experiencia. Especialista en crear riqueza transgeneracional con Real Estate en Estados Unidos.",
  },
  {
    name: "Tomás Resendez",
    role: "Abogado de Inmigración",
    img: "https://res.cloudinary.com/dgruohz6f/image/upload/v1773439162/comprando-america/QGuNYwiuoAkxjDwj.png",
    bio: "Especialista en inmigración corporativa con experiencia representando a Fortune 100. Bilingüe (inglés-español), garantiza asesoramiento legal claro y preciso.",
  },
  {
    name: "Daniel Palacios",
    role: "Contador CPA y Fiscalista",
    img: "https://res.cloudinary.com/dgruohz6f/image/upload/v1773439036/comprando-america/CPGtnnreqZlWVzgL.png",
    bio: "Especialista en contabilidad empresarial y planeación fiscal. Experto asesorando a empresas y particulares con socios latinos.",
  },
  {
    name: "Aubrey Dwyer",
    role: "Abogada Corporativa",
    img: "https://res.cloudinary.com/dgruohz6f/image/upload/v1773439166/comprando-america/QZAlYTAoaVokeCSo.jpg",
    bio: "Especializada en apertura de empresas, contratos y trademarks. Graduada de la Facultad de Derecho de la Universidad de Oklahoma.",
  },
  {
    name: "Destiny Bounds",
    role: "Abogada Corporativa y PI",
    img: "https://res.cloudinary.com/dgruohz6f/image/upload/v1773439040/comprando-america/EDQOyfeHfevdqerE.avif",
    bio: "Fundadora de Bounds Law LLC, especializada en derecho corporativo, pequeñas empresas y propiedad intelectual. Autora y conferencista nacional.",
  },
  {
    name: "Sebastián Jara",
    role: "Consultor de Marketing Digital",
    img: "https://res.cloudinary.com/dgruohz6f/image/upload/v1773439309/comprando-america/qrZqfOUTzqKwJcYP.avif",
    bio: "15+ años optimizando estrategias digitales y procesos de marketing con automatización e IA para empresas en inmobiliario, educación y e-commerce.",
  },
  {
    name: "John McKee",
    role: "Consultor Comercial",
    img: "https://res.cloudinary.com/dgruohz6f/image/upload/v1773439314/comprando-america/sZacCQEqvoOyeOMO.avif",
    bio: "Experto en Estrategia Comercial con 35+ años adaptando productos al mercado estadounidense en manufactura, consumo masivo y tecnología.",
  },
];

/* ─── Testimonials ─── */
const TESTIMONIALS = [
  { name: "Carlos", city: "Monterrey", quote: "Entré buscando cómo estructurar mi expansión a Estados Unidos. El equipo me ayudó a abrir mi LLC correctamente y entender la estructura fiscal.", initials: "C" },
  { name: "Alejandro", city: "Ciudad de México", quote: "Lo que más valoré fue el acompañamiento del equipo multidisciplinario. No es teoría, es ejecución.", initials: "A" },
  { name: "Ricardo", city: "Monterrey", quote: "Después de asistir a la Cumbre entendí el valor del networking con empresarios que ya están invirtiendo.", initials: "R" },
];

/* ─── Experts Section ─── */
function ExpertsSection() {
  const [activeExpert, setActiveExpert] = useState<number | null>(null);

  return (
    <section className="bg-[#0E2544] py-20 md:py-28">
      <div className="container">
        <FadeIn>
          <div className="text-center mb-14">
            <p className="text-blue-400 text-sm font-semibold tracking-[0.25em] uppercase mb-4 font-mono">Equipo Multidisciplinario</p>
            <h2 className="text-3xl md:text-4xl text-white mb-4">Respaldado por expertos en cada área</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">Abogados, CPAs, inversionistas y estrategas que acompañan a cada miembro en su proceso.</p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5 max-w-5xl mx-auto mb-6">
          {EXPERTS.map((expert, i) => {
            const isActive = activeExpert === i;
            return (
              <FadeIn key={i} delay={i * 0.05}>
                <motion.button
                  onClick={() => setActiveExpert(isActive ? null : i)}
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.97 }}
                  className={`w-full text-left rounded-2xl p-5 border transition-all duration-300 ${
                    isActive
                      ? "bg-primary/10 border-primary/50 shadow-lg shadow-blue-600/10"
                      : "bg-[#0F2847] border-[#1E3A5F] hover:border-blue-500/30"
                  }`}
                >
                  <div className="flex flex-col items-center text-center gap-3">
                    <div className={`w-20 h-20 rounded-full overflow-hidden border-2 transition-all ${isActive ? "border-primary" : "border-[#1E3A5F]"}`}>
                      <img src={expert.img} alt={expert.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <p className="text-white text-sm font-bold leading-tight">{expert.name}</p>
                      <p className="text-blue-400 text-xs mt-0.5">{expert.role}</p>
                    </div>
                  </div>

                  <AnimatePresence>
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <p className="text-slate-300 text-xs leading-relaxed mt-4 pt-4 border-t border-white/10 text-left">
                          {expert.bio}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              </FadeIn>
            );
          })}
        </div>

      </div>
    </section>
  );
}

/* ─── Edmundo Expandable Section ─── */
function EdmundoSection() {
  const [expanded, setExpanded] = useState(false);

  return (
    <section className="bg-[#F5F7FA] py-20 md:py-28">
      <div className="container">
        <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
          <FadeIn>
            <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-200">
              <img src={EDMUNDO_PORTRAIT} alt="Edmundo Treviño — CEO Comprando América" className="w-full h-[450px] object-cover object-top" />
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <div>
              <p className="text-primary text-sm font-semibold tracking-[0.25em] uppercase mb-4 font-mono">Liderazgo</p>
              <h2 className="text-3xl md:text-4xl text-[#0B1F3A] mb-4">Edmundo Treviño</h2>
              <p className="text-primary font-semibold text-sm tracking-wider uppercase mb-6">Fundador y CEO · Comprando América</p>
              <p className="text-[#4B5563] text-lg leading-relaxed mb-6">
                Empresario serial con más de dos décadas de experiencia operando entre México y Estados Unidos. Fundador y CEO de 9 empresas activas en Estados Unidos
              </p>
              <div className="space-y-3 mb-8">
                {[
                  "MBA en Economía Industrial",
                  "Maestría en Sistema Fiscal en Estados Unidos",
                  "+20 años en comercio internacional",
                  "Más de 8 empresas operando en Estados Unidos y México",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-[#374151] text-sm">{item}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setExpanded(!expanded)}
                className="inline-flex items-center gap-2 text-primary font-semibold text-sm hover:text-blue-700 transition-colors"
              >
                {expanded ? "Cerrar" : "Conocer más sobre Edmundo"}
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${expanded ? "rotate-180" : ""}`} />
              </button>
            </div>
          </FadeIn>
        </div>

        {/* ─── Expandable bio panel ─── */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="max-w-5xl mx-auto mt-12 bg-white border border-gray-200 rounded-2xl p-8 md:p-12 shadow-lg">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-bold text-[#0B1F3A]">Biografía completa</h3>
                  <button onClick={() => setExpanded(false)} className="text-[#9CA3AF] hover:text-[#0B1F3A] transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-10">
                  {/* Left column — narrative */}
                  <div className="space-y-4 text-[#4B5563] text-sm leading-relaxed">
                    <p>
                      Edmundo Treviño es empresario, inversionista y fundador de Comprando América, una comunidad privada de empresarios e inversionistas latinos enfocada en crear, adquirir y escalar negocios en Estados Unidos.
                    </p>
                    <p>
                      Con más de 20 años de experiencia en comercio internacional y operaciones empresariales entre México y Estados Unidos, Edmundo ha fundado y operado más de 9 empresas activas en ambos países, abarcando sectores como transporte, servicios financieros, bienes raíces y consultoría estratégica.
                    </p>
                    <p>
                      Es egresado del MBA en Economía Industrial y cuenta con una Maestría en el Sistema Fiscal de Estados Unidos. Su enfoque se centra en la creación de riqueza patrimonial a través de estructura, criterio y ejecución — no de promesas.
                    </p>
                    <p>
                      A través de Comprando América, Edmundo ha acompañado a decenas de empresarios en la apertura de más de 50 LLCs, la evaluación de oportunidades de inversión y la estructuración de rutas migratorias basadas en inversión real.
                    </p>
                  </div>

                  {/* Right column — structured info */}
                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <GraduationCap className="w-5 h-5 text-primary" />
                        <h4 className="text-[#0B1F3A] font-semibold text-sm">Formación Académica</h4>
                      </div>
                      <div className="space-y-2 pl-7">
                        {["MBA en Economía Industrial", "Maestría en Sistema Fiscal en Estados Unidos", "Formación continua en inversión inmobiliaria y corporativa"].map((item, i) => (
                          <p key={i} className="text-[#6B7280] text-sm">• {item}</p>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Building className="w-5 h-5 text-primary" />
                        <h4 className="text-[#0B1F3A] font-semibold text-sm">Empresas y Operaciones</h4>
                      </div>
                      <div className="space-y-2 pl-7">
                        {["9+ empresas activas en Estados Unidos y México", "Transporte, servicios financieros, bienes raíces", "Consultoría estratégica para inversionistas latinos", "50+ LLCs estructuradas para miembros de la comunidad"].map((item, i) => (
                          <p key={i} className="text-[#6B7280] text-sm">• {item}</p>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Briefcase className="w-5 h-5 text-primary" />
                        <h4 className="text-[#0B1F3A] font-semibold text-sm">Enfoque Actual</h4>
                      </div>
                      <div className="space-y-2 pl-7">
                        {["Comunidad de inversión Comprando América", "Cumbres y eventos presenciales de inversión", "Viajes de inspección inmobiliaria en Florida", "Acompañamiento estratégico E-2 y estructura empresarial"].map((item, i) => (
                          <p key={i} className="text-[#6B7280] text-sm">• {item}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════ */

const SITUACIONES = [
  { id: 1, text: "Tengo capital pero no sé por dónde empezar." },
  { id: 2, text: "Quiero invertir pero no sé en quién confiar." },
  { id: 3, text: "Quiero construir patrimonio en Estados Unidos." },
  { id: 4, text: "Quiero explorar opciones para mi familia." },
  { id: 5, text: "Ya invierto, pero quiero contrastar ideas." },
  { id: 6, text: "Quiero evitar errores costosos." },
];

export default function Home() {
  const [selectedCards, setSelectedCards] = useState<Set<number>>(new Set());

  function toggleCard(id: number) {
    setSelectedCards((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  return (
    <div className="min-h-screen bg-[#0B1F3A] text-white overflow-x-hidden">
      <SEOHead {...PAGE_SEO} />
      <Navbar />

      {/* ═══ 1. HERO — Edmundo rooftop ═══ */}
      <section className="relative min-h-screen flex items-center">
        <div className="absolute inset-0">
          <img src={HERO_IMAGE} alt="Edmundo Treviño — Comprando América" className="w-full h-full object-cover object-top" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B1F3A]/95 via-[#0B1F3A]/85 to-[#0B1F3A]/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F3A] via-transparent to-transparent" />
        </div>

        <div className="container relative z-10 pt-28 pb-20">
          <div className="max-w-3xl">
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: "easeOut" }}>
              <span className="inline-block text-blue-400 text-sm font-semibold tracking-[0.25em] uppercase mb-6 font-mono">
                Club Privado de Inversión · Desde $100,000 USD
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl text-white leading-[1.1] mb-6">
                Invierte en Estados Unidos con{" "}
                <span className="gradient-text-primary">criterio, estructura</span> y comunidad
              </h1>
              <p className="text-lg md:text-xl text-slate-300 leading-relaxed mb-8 max-w-2xl">
                Comunidad exclusiva para empresarios e inversionistas latinos que buscan proteger su patrimonio o construir una ruta migratoria a través de inversión real en Estados Unidos.
              </p>
              <p className="text-slate-500 text-xs mb-2">Acceso sujeto a criterios de perfil. Sin promesas irreales.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ BANNER PROMOCIONAL — Florida Investment Weekend II ═══ */}
      <a
        href="/investment-week"
        className="block w-full bg-gradient-to-r from-[#1D4ED8] via-[#2563EB] to-[#1D4ED8] hover:from-[#1E40AF] hover:to-[#1E40AF] transition-colors duration-300 group"
      >
        <div className="container flex items-center justify-center gap-3 py-3 px-4 text-center">
          <span className="inline-flex items-center gap-1.5 bg-white/20 text-white text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full">
            Próximo evento
          </span>
          <p className="text-white text-sm font-medium">
            <span className="font-bold">Florida Investment Weekend II</span>
            {" — "}Terreno real. Propiedades reales. Números reales.
          </p>
          <span className="hidden sm:inline-flex items-center gap-1 text-white font-semibold text-sm underline underline-offset-2 group-hover:gap-2 transition-all">
            Ver detalles <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </a>

      {/* ═══ BANNER PROMOCIONAL — Cumbre Digital ═══ */}
      <a
        href="/cumbre-digital"
        className="block w-full bg-gradient-to-r from-[#0B1F3A] via-[#132D52] to-[#0B1F3A] hover:from-[#061428] hover:to-[#061428] transition-colors duration-300 group border-t border-white/10"
      >
        <div className="container flex items-center justify-center gap-3 py-3 px-4 text-center">
          <span className="inline-flex items-center gap-1.5 bg-yellow-400/20 text-yellow-300 text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full">
            Evento online
          </span>
          <p className="text-white text-sm font-medium">
            <span className="font-bold">Cumbre Digital</span>
            {" — "}Una mañana intensiva para construir y proteger tu patrimonio en EE.UU.
          </p>
          <span className="hidden sm:inline-flex items-center gap-1 text-yellow-300 font-semibold text-sm underline underline-offset-2 group-hover:gap-2 transition-all">
            Ver detalles <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </a>

      {/* ═══ 2. PERFILAMIENTO — ☀️ BLANCO ═══ */}
      <section className="bg-[#F5F7FA] py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl lg:text-5xl text-[#0B1F3A] mb-4">¿Qué estás buscando?</h2>
              <p className="text-[#6B7280] text-lg max-w-xl mx-auto">Identifica tu objetivo y te mostramos la ruta más clara.</p>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Card 1 — Proteger patrimonio */}
            <FadeIn>
              <div className="bg-white border border-gray-200 rounded-2xl p-8 h-full shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                <div className="w-14 h-14 rounded-xl bg-blue-50 flex items-center justify-center mb-6">
                  <Shield className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-[#0B1F3A] mb-3">Proteger mi patrimonio</h3>
                <p className="text-[#4B5563] leading-relaxed mb-6">
                  Quiero invertir en dólares con estructura legal, diversificar fuera de mi país y construir patrimonio en bienes raíces o negocios en Estados Unidos.
                </p>
                <div className="space-y-2 mb-8">
                  {["Inversión desde $100,000 USD", "Estructura empresarial (LLC)", "Bienes raíces con acompañamiento", "Sin necesidad de migrar"].map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                      <span className="text-[#6B7280] text-sm">{item}</span>
                    </div>
                  ))}
                </div>
                <a href="/oportunidades-de-inversion-en-estados-unidos">
                  <Button className="bg-primary hover:bg-blue-600 text-white gap-2 w-full py-6 text-base shadow-lg shadow-blue-600/15">
                    Ver opciones de inversión <ArrowRight className="w-4 h-4" />
                  </Button>
                </a>
              </div>
            </FadeIn>

            {/* Card 2 — Migrar con inversión */}
            <FadeIn delay={0.1}>
              <div className="bg-white border border-gray-200 rounded-2xl p-8 h-full shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                <div className="w-14 h-14 rounded-xl bg-blue-50 flex items-center justify-center mb-6">
                  <Globe className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-[#0B1F3A] mb-3">Migrar con inversión</h3>
                <p className="text-[#4B5563] leading-relaxed mb-6">
                  Tengo capital y quiero una ruta migratoria real hacia Estados Unidos. Busco conectar inversión con una visa de inversionista (E-2) y estructura de negocio.
                </p>
                <div className="space-y-2 mb-8">
                  {["Inversión desde $150,000 USD", "Visa E-2 de inversionista", "Negocio real en operación", "Ruta migratoria estructurada"].map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                      <span className="text-[#6B7280] text-sm">{item}</span>
                    </div>
                  ))}
                </div>
                <a href="/visa-e2-inversion-en-estados-unidos">
                  <Button className="bg-primary hover:bg-blue-600 text-white gap-2 w-full py-6 text-base shadow-lg shadow-blue-600/15">
                    Ver ruta migratoria <ArrowRight className="w-4 h-4" />
                  </Button>
                </a>
              </div>
            </FadeIn>

            {/* Card 3 — Estructura empresarial */}
            <FadeIn delay={0.2}>
              <div className="bg-white border border-gray-200 rounded-2xl p-8 h-full shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                <div className="w-14 h-14 rounded-xl bg-blue-50 flex items-center justify-center mb-6">
                  <Building2 className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-[#0B1F3A] mb-3">Estructura empresarial</h3>
                <p className="text-[#4B5563] leading-relaxed mb-6">
                  Quiero constituir mi empresa en Estados Unidos con la estructura legal y fiscal correcta para operar, proteger activos y optimizar impuestos.
                </p>
                <div className="space-y-2 mb-8">
                  {["LLC o corporación en USA", "Estructura fiscal optimizada", "Apertura de cuenta bancaria", "Cumplimiento legal y contable"].map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                      <span className="text-[#6B7280] text-sm">{item}</span>
                    </div>
                  ))}
                </div>
                <a href="https://comprandoamerica.com/estructura-de-inversion-en-usa">
                  <Button className="bg-primary hover:bg-blue-600 text-white gap-2 w-full py-6 text-base shadow-lg shadow-blue-600/15">
                    Ver estructura empresarial <ArrowRight className="w-4 h-4" />
                  </Button>
                </a>
              </div>
            </FadeIn>
          </div>

          <FadeIn>
            <div className="text-center mt-10">
              <a href="/tu-ruta" className="inline-flex items-center gap-2 text-primary font-semibold hover:text-blue-700 transition-colors">
                ¿No estás seguro? Evalúa tu perfil y te orientamos <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ 3. STATS — navy ═══ */}
      <section className="bg-[#091A30] py-16 md:py-20">
        <div className="container">
          <FadeIn>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
              <StatCounter value={40} suffix="+" label="Miembros activos" />
              <StatCounter value={53} suffix="+" label="LLCs estructuradas" />
              <StatCounter value={6} suffix="" label="Viajes de inspección" />
              <StatCounter value={14} suffix="+" label="Visas tramitadas" />
            </div>
          </FadeIn>
        </div>
      </section>


      {/* ═══ 4. EDMUNDO CEO — ☀️ BLANCO ═══ */}
      <EdmundoSection />

      {/* ═══ 5. EXPERTOS — navy ═══ */}
      <ExpertsSection />

      {/* ═══ 6. TESTIMONIOS VIDEO — ☀️ BLANCO ═══ */}
      <section className="bg-white py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl text-[#0B1F3A] mb-4">Lo que dicen nuestros miembros</h2>
              <p className="text-[#6B7280] text-lg">Testimonios reales de empresarios que ya están invirtiendo.</p>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              { name: "Arturo Orozco", videoId: "WYNwoTzG8Ss" },
              { name: "Gerardo Bejarano", videoId: "6J6IIPFsTD0" },
            ].map((t, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="bg-[#F5F7FA] border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                  <div className="aspect-video">
                    <iframe
                      src={`https://www.youtube.com/embed/${t.videoId}?rel=0&modestbranding=1`}
                      title={`Testimonio de ${t.name}`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                    />
                  </div>
                  <div className="p-4 text-center">
                    <p className="text-[#0B1F3A] font-semibold">{t.name}</p>
                    <p className="text-[#9CA3AF] text-xs">Miembro de Comprando América</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 7. OPORTUNIDADES — navy ═══ */}
      <section className="bg-[#0B1F3A] py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl md:text-4xl text-white mb-4">Si estás explorando Estados Unidos para invertir, proteger patrimonio o construir opciones para tu familia, el verdadero reto no es encontrar oportunidades.</h2>
              <p className="text-slate-400 text-lg">Es saber en quién confiar y qué camino tiene sentido para ti.</p>
            </div>
          </FadeIn>

        </div>
      </section>


      {/* ═══ 8. EVENTOS — ☀️ BLANCO ═══ */}
      <section className="bg-[#F5F7FA] py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl text-[#0B1F3A] mb-4">Eventos y experiencias en terreno</h2>
              <p className="text-[#4B5563] text-lg">Hay decisiones que no se toman desde una pantalla.</p>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <FadeIn>
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden h-full shadow-sm hover:shadow-lg transition-all">
                <img src={RUTA_PHOTO} alt="Ruta Inmobiliaria" className="w-full h-48 object-cover" />
                <div className="p-8">
                  <MapPin className="w-8 h-8 text-primary mb-4" />
                  <h3 className="text-xl font-bold text-[#0B1F3A] mb-3">Ruta Inmobiliaria</h3>
                  <p className="text-[#6B7280] text-sm leading-relaxed mb-6">Evento presencial para entender oportunidades de bienes raíces con estructura y criterio.</p>
                  <a href="/ruta-inmobiliaria-en-estados-unidos">
                    <Button className="bg-primary hover:bg-blue-600 text-white gap-2 text-sm w-full">Ver Ruta Inmobiliaria <ArrowRight className="w-3 h-3" /></Button>
                  </a>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.1}>
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden h-full shadow-sm hover:shadow-lg transition-all">
                <img src={INVEST_WEEK} alt="Florida Investment Weekend II" className="w-full h-48 object-cover" />
                <div className="p-8">
                  <Globe className="w-8 h-8 text-primary mb-4" />
                  <h3 className="text-xl font-bold text-[#0B1F3A] mb-3">Florida Investment Weekend II</h3>
                  <p className="text-[#6B7280] text-sm leading-relaxed mb-6">Terreno real. Propiedades reales. Números reales. Acceso por invitación.</p>
                  <a href="/investment-week">
                    <Button className="bg-primary hover:bg-blue-600 text-white gap-2 text-sm w-full">Ver Investment Weekend II <ArrowRight className="w-3 h-3" /></Button>
                  </a>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden h-full shadow-sm hover:shadow-lg transition-all">
                <img src={CUMBRE_DIGITAL_PHOTO} alt="Cumbre Digital" className="w-full h-48 object-cover object-top" />
                <div className="p-8">
                  <Monitor className="w-8 h-8 text-primary mb-4" />
                  <h3 className="text-xl font-bold text-[#0B1F3A] mb-3">Cumbre Digital</h3>
                  <p className="text-[#6B7280] text-sm leading-relaxed mb-6">Una mañana intensiva para construir, proteger y expandir tu patrimonio en Estados Unidos con criterio y estrategia.</p>
                  <a href="/cumbre-digital">
                    <Button className="bg-primary hover:bg-blue-600 text-white gap-2 text-sm w-full">Ver Cumbre Digital <ArrowRight className="w-3 h-3" /></Button>
                  </a>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ═══ MICRODIAGNÓSTICO ═══ */}
      <section className="bg-[#091A30] py-24 md:py-32 px-4">
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
            {SITUACIONES.map((s, i) => {
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
                        : "bg-[#0F2847] border-[#1E3A5F] hover:border-blue-500/30"
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
                  onClick={() => openWhatsApp(WHATSAPP_PHONE, "Hola, me identifico con varias situaciones y quiero una sesión de diagnóstico.")}
                  className="bg-primary hover:bg-blue-600 text-white font-semibold px-8 py-5 gap-2 shadow-lg shadow-blue-600/25"
                >
                  Solicitar sesión de diagnóstico <ArrowRight className="w-4 h-4" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ═══ 9. RECURSOS — navy ═══ */}
      <section className="bg-[#0B1F3A] py-20 md:py-28">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            <FadeIn>
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
                <div>
                  <span className="text-blue-400 text-xs font-semibold tracking-[0.3em] uppercase font-mono block mb-3">Aprende · Analiza · Decide</span>
                  <h2 className="text-3xl md:text-4xl text-white leading-tight">Explora las rutas para<br className="hidden md:block" /> nutrirse de información</h2>
                </div>
                <p className="text-slate-400 text-base max-w-xs leading-relaxed">Contenido real para inversionistas que quieren claridad antes de ejecutar.</p>
              </div>
            </FadeIn>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  label: "Podcast",
                  tag: "Audio · Episodios nuevos cada semana",
                  title: "Conversaciones que mueven el criterio",
                  desc: "Casos reales, expertos en activo y análisis del mercado americano. Escucha mientras construyes tu próxima decisión.",
                  cta: "Escuchar episodios",
                  href: "/podcast",
                  image: "https://img.youtube.com/vi/iFx3QusSR90/maxresdefault.jpg",
                  playIcon: true,
                },
                {
                  label: "News",
                  tag: "Noticias · Actualización continua",
                  title: "Lo que está pasando y cómo te afecta",
                  desc: "Noticias del mercado inmobiliario, migración y economía en EE.UU. filtradas para inversionistas latinos.",
                  cta: "Leer noticias",
                  href: "/news",
                  image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=450&fit=crop",
                  playIcon: false,
                },
                {
                  label: "Blog",
                  tag: "Artículos · Guías prácticas",
                  title: "Análisis y guías para tomar mejores decisiones",
                  desc: "Artículos escritos por el equipo de Comprando América sobre inversión, estructura legal y patrimonio en EE.UU.",
                  cta: "Leer artículos",
                  href: "/blog",
                  image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=450&fit=crop",
                  playIcon: false,
                },
              ].map((r, i) => (
                <FadeIn key={i} delay={i * 0.1}>
                  <a href={r.href} className="block h-full group">
                    <div className="h-full rounded-2xl border border-[#1E3A5F] hover:border-blue-500/40 bg-[#0F2847] overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-blue-900/20 flex flex-col">
                      {/* Image */}
                      <div className="relative overflow-hidden h-48 shrink-0">
                        <img
                          src={r.image}
                          alt={r.label}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0F2847] via-transparent to-transparent" />
                        {r.playIcon && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                              <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                              </svg>
                            </div>
                          </div>
                        )}
                        <span className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
                          {r.label}
                        </span>
                      </div>
                      {/* Content */}
                      <div className="p-6 flex flex-col flex-1">
                        <p className="text-blue-400/70 text-xs font-mono uppercase tracking-widest mb-3">{r.tag}</p>
                        <h3 className="text-lg font-bold text-white mb-2 leading-snug">{r.title}</h3>
                        <p className="text-slate-400 text-sm leading-relaxed flex-1 mb-5">{r.desc}</p>
                        <span className="inline-flex items-center gap-2 text-sm font-semibold text-blue-400 group-hover:text-blue-300 transition-colors">
                          {r.cta} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </div>
                    </div>
                  </a>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 10. CTA FINAL — deep navy ═══ */}
      <section className="bg-[#091A30] py-24 md:py-32">
        <div className="container">
          <FadeIn>
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl lg:text-5xl text-white mb-6">
                ¿Tu objetivo es invertir o migrar a Estados Unidos?
              </h2>
              <p className="text-slate-400 text-lg leading-relaxed mb-10">
                Empieza por evaluar tu perfil. Te decimos con claridad si este camino hace sentido para ti.
              </p>
              <div className="flex flex-wrap justify-center gap-4 mb-6">
                <a href="/tu-ruta">
                  <Button className="bg-primary hover:bg-blue-600 text-white px-8 py-6 text-base gap-2 shadow-lg shadow-blue-600/25">
                    Evaluar mi Perfil <ArrowRight className="w-4 h-4" />
                  </Button>
                </a>
                <a href="/membresia">
                  <Button variant="outline" className="border-slate-600 text-white hover:bg-white/10 px-8 py-6 text-base">
                    Conocer el Grupo Empresarial de Edmundo
                  </Button>
                </a>
              </div>
              <button onClick={() => openWhatsApp(WHATSAPP_PHONE, "Hola, vi Comprando América y me gustaría saber más.")} className="inline-flex items-center gap-1 text-blue-400 text-sm hover:text-blue-300 transition-colors">
                Hablar por WhatsApp <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </FadeIn>
        </div>
      </section>

      <Footer />
    </div>
  );
}
