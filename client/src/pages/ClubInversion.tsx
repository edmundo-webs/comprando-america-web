/*
 * Club de Inversión 2026 — Simplified, fear-resolving structure
 * /club-de-inversion-en-estados-unidos
 * 8 sections, dynamic tabs, no scroll fatigue
 */

import { useEffect, useState } from "react";
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
  UserCheck,
  Users,
  Scale,
  FileCheck,
  Rocket,
  X,
  Play,
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
function StatCounter({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const { ref, isInView } = useInView();
  useEffect(() => {
    if (!isInView) return;
    const el = document.querySelector(`[data-stat="${label}"]`);
    if (!el) return;
    let start = 0;
    const step = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / 2000, 1);
      el.textContent = String(Math.floor(progress * value));
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = String(value);
    };
    requestAnimationFrame(step);
  }, [isInView, value, label]);
  return (
    <div ref={ref} className="text-center">
      <div className="text-primary text-3xl md:text-4xl font-bold mb-1"><span data-stat={label}>0</span>{suffix}</div>
      <p className="text-slate-400 text-xs uppercase tracking-wider">{label}</p>
    </div>
  );
}

/* ─── SEO ─── */
function SEOHead() {
  useEffect(() => {
    document.title = "Club de Inversión en Estados Unidos | Comprando América";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "Club privado de inversión para empresarios latinos. Protege tu patrimonio o migra a Estados Unidos con inversión desde $100,000 USD. Acompañamiento legal, fiscal y migratorio.");
  }, []);
  return null;
}

/* ─── Photos ─── */
const HERO = "https://lh3.googleusercontent.com/d/1rbRZbnInyEGqnf51XjSXo_5HsBp81dUc=w1920";
const PANEL = "https://lh3.googleusercontent.com/d/191DAUtt8vkLpZJatNDqvtYrRIc1Z-VHO=w1920";

/* ─── Experts ─── */
const EXPERTS = [
  { name: "Joe Farucci", role: "Bienes Raíces", img: "https://res.cloudinary.com/dgruohz6f/image/upload/v1773439239/comprando-america/YfxVlywHHLmCeDRI.png" },
  { name: "Tomás Resendez", role: "Inmigración", img: "https://res.cloudinary.com/dgruohz6f/image/upload/v1773439162/comprando-america/QGuNYwiuoAkxjDwj.png" },
  { name: "Daniel Palacios", role: "CPA & Fiscal", img: "https://res.cloudinary.com/dgruohz6f/image/upload/v1773439036/comprando-america/CPGtnnreqZlWVzgL.png" },
  { name: "Aubrey Dwyer", role: "Derecho Corporativo", img: "https://res.cloudinary.com/dgruohz6f/image/upload/v1773439166/comprando-america/QZAlYTAoaVokeCSo.jpg" },
  { name: "Destiny Bounds", role: "Corporativo & PI", img: "https://res.cloudinary.com/dgruohz6f/image/upload/v1773439040/comprando-america/EDQOyfeHfevdqerE.avif" },
  { name: "John McKee", role: "Estrategia Comercial", img: "https://res.cloudinary.com/dgruohz6f/image/upload/v1773439314/comprando-america/sZacCQEqvoOyeOMO.avif" },
];

/* ─── Plans ─── */
const PLANS = [
  {
    name: "Entry",
    price: "$10,000",
    ideal: "Primeros pasos en Estados Unidos",
    features: [
      "LLC (Texas o Florida) + Registered Agent",
      "Deal Day & Deal Finding presencial",
      "Apertura bancaria + ITIN",
      "Consulta de inmigración (1 hora)",
      "Plan de negocios E-2 (USCIS-ready)",
      "3 módulos de formación",
      "Sesiones 1:1 con expertos",
      "Comunidad privada + eventos digitales",
      "Eventos presenciales anuales",
    ],
    value: "$19,150",
    savings: "$11,650",
  },
  {
    name: "Growth",
    price: "$15,000",
    ideal: "Inversionistas con estrategia clara",
    popular: true,
    features: [
      "Todo lo del Entry, más:",
      "Estrategia de acceso bancario personalizada",
      "Planeación patrimonial y de sucesión 1:1",
      "Acceso anticipado a oportunidades",
      "Mentoría en estructuras complejas",
      "Prioridad en Deal Day",
    ],
    value: "$25,000+",
    savings: "$10,000+",
  },
  {
    name: "Legacy",
    price: "$25,000",
    ideal: "Máximo acceso y acompañamiento",
    features: [
      "Todo lo del Growth, más:",
      "Acceso VIP a todas las oportunidades",
      "Mentoría exclusiva con fundadores",
      "Participación en decisiones estratégicas",
      "Networking prioritario alto nivel",
      "Asesoría personalizada continua",
    ],
    value: "$40,000+",
    savings: "$15,000+",
  },
];

/* ═══════════════════════════════════════════════════════ */

export default function ClubInversion() {
  const [activeTab, setActiveTab] = useState<"patrimonio" | "migrar">("patrimonio");

  return (
    <div className="min-h-screen bg-[#0B1F3A] text-white overflow-x-hidden">
      <SEOHead />
      <Navbar />

      {/* ═══ 1. HERO ═══ */}
      <section className="relative min-h-[75vh] flex items-center pt-28 pb-20">
        <div className="absolute inset-0">
          <img src={HERO} alt="Comunidad Comprando América" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B1F3A]/95 via-[#0B1F3A]/80 to-[#0B1F3A]/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F3A] via-transparent to-[#0B1F3A]/30" />
        </div>

        <div className="container relative z-10">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-3xl">
            <span className="inline-block text-blue-400 text-sm font-semibold tracking-[0.25em] uppercase mb-6 font-mono">
              Club Privado · Desde $100,000 USD
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl text-white leading-[1.1] mb-6">
              Tu inversión merece{" "}
              <span className="gradient-text-primary">estructura</span>, no improvisación
            </h1>
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed mb-8 max-w-2xl">
              Acompañamos a empresarios latinos a invertir en Estados Unidos con criterio, equipo real y un sistema probado. No vendemos sueños — construimos estructura.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="/perfil">
                <Button className="bg-primary hover:bg-blue-600 text-white font-semibold px-8 py-6 text-base gap-2 shadow-lg shadow-blue-600/25">
                  Evaluar mi Perfil <ArrowRight className="w-4 h-4" />
                </Button>
              </a>
              <Button variant="outline" onClick={() => openWhatsApp(WHATSAPP_PHONE, "Hola, me interesa el club de inversión de Comprando América.")} className="border-slate-500 text-white hover:bg-white/10 px-8 py-6 text-base">
                Hablar con un asesor
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ 2. LAS 2 RUTAS — ☀️ BLANCO ═══ */}
      <section className="bg-[#F5F7FA] py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl text-[#0B1F3A] mb-4">¿Cuál es tu objetivo?</h2>
              <p className="text-[#6B7280] text-lg">Cada ruta tiene un proceso diferente. Identifica la tuya.</p>
            </div>
          </FadeIn>

          {/* Tab buttons */}
          <FadeIn>
            <div className="flex justify-center gap-3 mb-10">
              <button
                onClick={() => setActiveTab("patrimonio")}
                className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-all ${
                  activeTab === "patrimonio"
                    ? "bg-primary text-white shadow-lg shadow-blue-600/20"
                    : "bg-white text-[#6B7280] hover:bg-gray-100 border border-gray-200"
                }`}
              >
                <Shield className="w-4 h-4" /> Proteger patrimonio
              </button>
              <button
                onClick={() => setActiveTab("migrar")}
                className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-all ${
                  activeTab === "migrar"
                    ? "bg-primary text-white shadow-lg shadow-blue-600/20"
                    : "bg-white text-[#6B7280] hover:bg-gray-100 border border-gray-200"
                }`}
              >
                <Globe className="w-4 h-4" /> Migrar con inversión
              </button>
            </div>
          </FadeIn>

          {/* Tab content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="max-w-3xl mx-auto"
            >
              {activeTab === "patrimonio" ? (
                <div className="bg-white border border-gray-200 rounded-2xl p-8 md:p-10 shadow-sm">
                  <h3 className="text-2xl font-bold text-[#0B1F3A] mb-4">Quiero proteger y diversificar mi patrimonio</h3>
                  <p className="text-[#4B5563] leading-relaxed mb-6">
                    Tienes capital en tu país y quieres moverlo a un entorno más estable. Buscas invertir en dólares con estructura legal, sin improvisación, y con acompañamiento real.
                  </p>
                  <div className="grid sm:grid-cols-2 gap-3 mb-8">
                    {[
                      "Inversión desde $100,000 USD",
                      "Estructura LLC + cuenta bancaria",
                      "Bienes raíces con análisis previo",
                      "Planeación fiscal y patrimonial",
                      "No necesitas migrar",
                      "Acompañamiento continuo",
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                        <span className="text-[#4B5563] text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                  <a href="/oportunidades-de-inversion-en-estados-unidos">
                    <Button className="bg-primary hover:bg-blue-600 text-white gap-2 w-full sm:w-auto">
                      Ver opciones de inversión <ArrowRight className="w-4 h-4" />
                    </Button>
                  </a>
                </div>
              ) : (
                <div className="bg-white border border-gray-200 rounded-2xl p-8 md:p-10 shadow-sm">
                  <h3 className="text-2xl font-bold text-[#0B1F3A] mb-4">Quiero migrar a Estados Unidos con inversión</h3>
                  <p className="text-[#4B5563] leading-relaxed mb-6">
                    Tienes capital y quieres una ruta migratoria real. Buscas conectar tu inversión con una visa de inversionista (E-2) y operar un negocio real en Estados Unidos.
                  </p>
                  <div className="grid sm:grid-cols-2 gap-3 mb-8">
                    {[
                      "Inversión desde $150,000 USD",
                      "Visa E-2 de inversionista",
                      "Negocio real en operación",
                      "Estructura legal completa",
                      "Plan de negocios USCIS-ready",
                      "Acompañamiento migratorio",
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                        <span className="text-[#4B5563] text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                  <a href="/visa-e2-inversion-en-estados-unidos">
                    <Button className="bg-primary hover:bg-blue-600 text-white gap-2 w-full sm:w-auto">
                      Ver ruta migratoria <ArrowRight className="w-4 h-4" />
                    </Button>
                  </a>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ═══ 3. CÓMO FUNCIONA — navy ═══ */}
      <section className="bg-[#091A30] py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl text-white mb-4">¿Cómo funciona?</h2>
              <p className="text-slate-400 text-lg">No tienes que saber todo. Nosotros te guiamos paso a paso.</p>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              { icon: UserCheck, step: "01", title: "Evalúas tu perfil", desc: "Respondemos si este camino es viable para ti. Sin compromisos." },
              { icon: Users, step: "02", title: "Te asignamos equipo", desc: "Abogados, CPA, estrategas. Tu equipo desde el día 1." },
              { icon: FileCheck, step: "03", title: "Estructuramos", desc: "LLC, cuentas, estrategia fiscal y migratoria diseñadas para ti." },
              { icon: Rocket, step: "04", title: "Ejecutas", desc: "Inviertes o migras con estructura clara y acompañamiento continuo." },
            ].map((item, i) => (
              <FadeIn key={i} delay={i * 0.08}>
                <div className="text-center">
                  <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center mx-auto mb-4">
                    <item.icon className="w-7 h-7 text-blue-400" />
                  </div>
                  <span className="text-blue-400 text-xs font-mono font-bold">{item.step}</span>
                  <h3 className="text-white font-semibold mt-2 mb-2">{item.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 4. POR QUÉ CONFIAR — ☀️ BLANCO ═══ */}
      <section className="bg-white py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl text-[#0B1F3A] mb-4">¿Por qué confiar en Comprando América?</h2>
              <p className="text-[#6B7280] text-lg">Números reales. Equipo real. Resultados reales.</p>
            </div>
          </FadeIn>

          {/* Stats */}
          <FadeIn>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto mb-16">
              <StatCounter value={38} suffix="+" label="Miembros activos" />
              <StatCounter value={50} suffix="+" label="LLCs estructuradas" />
              <StatCounter value={11} suffix="+" label="Visas tramitadas" />
              <StatCounter value={6} suffix="" label="Viajes de inspección" />
            </div>
          </FadeIn>

          {/* Experts mini-grid */}
          <FadeIn>
            <div className="text-center mb-8">
              <p className="text-primary text-sm font-semibold tracking-[0.25em] uppercase font-mono">Equipo Multidisciplinario</p>
            </div>
          </FadeIn>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-6 max-w-4xl mx-auto">
            {EXPERTS.map((expert, i) => (
              <FadeIn key={i} delay={i * 0.05}>
                <div className="text-center">
                  <div className="w-20 h-20 md:w-24 md:h-24 mx-auto rounded-full overflow-hidden border-2 border-gray-200 hover:border-primary/40 transition-all mb-3">
                    <img src={expert.img} alt={expert.name} className="w-full h-full object-cover" />
                  </div>
                  <p className="text-[#0B1F3A] text-xs font-semibold">{expert.name}</p>
                  <p className="text-[#9CA3AF] text-[10px]">{expert.role}</p>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn>
            <div className="text-center mt-10">
              <a href="/quienes-somos">
                <Button variant="outline" className="border-gray-300 text-[#0B1F3A] hover:bg-gray-50 gap-2">
                  Conocer al equipo completo <ArrowRight className="w-4 h-4" />
                </Button>
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ 5. TESTIMONIOS VIDEO — navy ═══ */}
      <section className="bg-[#0E2544] py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl text-white mb-4">Historias reales de miembros</h2>
              <p className="text-slate-400 text-lg">Empresarios que ya están invirtiendo con estructura.</p>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              { name: "Arturo Orozco", videoId: "WYNwoTzG8Ss" },
              { name: "Gerardo Bejarano", videoId: "6J6IIPFsTD0" },
            ].map((t, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="bg-[#132D50] border border-[#1E3A5F] rounded-xl overflow-hidden">
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
                    <p className="text-white font-semibold">{t.name}</p>
                    <p className="text-slate-500 text-xs">Miembro de Comprando América</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 6. PERFIL IDEAL — ☀️ BLANCO ═══ */}
      <section className="bg-[#F5F7FA] py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl text-[#0B1F3A] mb-12 text-center">¿Es para ti?</h2>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <FadeIn>
              <div className="bg-white border border-green-200 rounded-xl p-8 h-full">
                <h3 className="text-[#0B1F3A] font-semibold mb-6 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500" /> Es para ti si:
                </h3>
                <ul className="space-y-3">
                  {[
                    "Puedes invertir $100,000 USD o más",
                    "Buscas diversificación internacional",
                    "Valoras proceso sobre improvisación",
                    "Entiendes que proteger capital es prioridad",
                    "Quieres acompañamiento real, no teoría",
                    "Buscas ejecutar con orden y criterio",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="text-green-500 font-bold text-sm mt-0.5">✓</span>
                      <span className="text-[#374151] text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>

            <FadeIn delay={0.1}>
              <div className="bg-white border border-gray-200 rounded-xl p-8 h-full">
                <h3 className="text-[#0B1F3A] font-semibold mb-6 flex items-center gap-2">
                  <X className="w-5 h-5 text-[#9CA3AF]" /> No es para ti si:
                </h3>
                <ul className="space-y-3">
                  {[
                    "Buscas oportunidades rápidas sin análisis",
                    "Esperas que otros decidan por ti",
                    "No tienes capital disponible",
                    "Quieres comisiones o intermediarios",
                    "Buscas cursos o mentoría genérica",
                    "Esperas resultados sin estructura",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="text-[#D1D5DB] text-sm mt-0.5">✕</span>
                      <span className="text-[#6B7280] text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>
          </div>

          <FadeIn>
            <p className="text-center text-[#4B5563] mt-10 max-w-xl mx-auto">
              Esto no es para todos. <span className="text-[#0B1F3A] font-semibold">Es para quien entiende que estructurar bien es más importante que entrar rápido.</span>
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ═══ 7. PLANES — navy ═══ */}
      <section className="bg-[#0B1F3A] py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl text-white mb-4">Planes de acceso</h2>
              <p className="text-slate-400 text-lg">Elige el nivel que mejor se ajuste a tu estrategia.</p>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {PLANS.map((plan, i) => (
              <FadeIn key={plan.name} delay={i * 0.1}>
                <div className={`relative rounded-2xl p-6 border h-full flex flex-col ${
                  plan.popular
                    ? "bg-[#0F2847] border-primary/40 ring-2 ring-primary/20 shadow-xl shadow-blue-600/10"
                    : "bg-[#0F2847] border-[#1E3A5F]"
                }`}>
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white px-3 py-0.5 rounded-full text-xs font-semibold">
                      Más Popular
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-white mb-1">
                    Investor <span className="text-primary">{plan.name}</span>
                  </h3>
                  <div className="mb-4">
                    <div className="text-3xl font-bold text-primary mb-1">{plan.price}</div>
                    <p className="text-slate-500 text-xs">{plan.ideal}</p>
                  </div>
                  <div className="mb-4 pb-4 border-b border-[#1E3A5F] text-xs">
                    <p className="text-slate-300"><strong>Valor:</strong> {plan.value}</p>
                    <p className="text-blue-400"><strong>Ahorro:</strong> {plan.savings}</p>
                  </div>

                  {/* Features VISIBLE — no accordion */}
                  <ul className="space-y-2 mb-6 flex-grow">
                    {plan.features.map((f, fi) => (
                      <li key={fi} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                        <span className="text-slate-300 text-xs">{f}</span>
                      </li>
                    ))}
                  </ul>

                  <a href="/perfil">
                    <Button className={`w-full py-3 font-semibold gap-2 text-sm ${
                      plan.popular
                        ? "bg-primary hover:bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                        : "bg-[#1E3A5F] hover:bg-[#2A4A6B] text-white"
                    }`}>
                      Evaluar mi Perfil <ArrowRight className="w-4 h-4" />
                    </Button>
                  </a>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 8. CTA FINAL — deep navy ═══ */}
      <section className="bg-[#091A30] py-24 md:py-32">
        <div className="container">
          <FadeIn>
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl text-white mb-4">
                El primer paso es evaluar si este camino es para ti
              </h2>
              <p className="text-slate-500 text-sm mb-10">
                No es pagar. Es validar si perteneces al grupo.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a href="/perfil">
                  <Button className="bg-primary hover:bg-blue-600 text-white font-semibold px-10 py-6 text-lg gap-2 shadow-lg shadow-blue-600/25">
                    Evaluar mi Perfil <ArrowRight className="w-5 h-5" />
                  </Button>
                </a>
                <Button variant="outline" onClick={() => openWhatsApp(WHATSAPP_PHONE, "Hola, quiero saber si el club de inversión es para mi perfil.")} className="border-slate-600 text-white hover:bg-white/10 px-8 py-6 text-base">
                  Hablar con un asesor
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
