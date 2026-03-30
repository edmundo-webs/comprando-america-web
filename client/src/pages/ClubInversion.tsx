/*
 * Club de Inversión 2026 — Central product page
 * /club-de-inversion-en-estados-unidos
 * No external navigation — everything stays on page
 * Pillars + authority + fear-resolving
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
  FileCheck,
  Rocket,
  X,
  CalendarDays,
  Presentation,
  MessageSquare,
  Crown,
  Handshake,
  ChevronDown,
  Star,
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

/* ─── StatCounter ─── */
function StatCounter({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const { ref, isInView } = useInView();
  useEffect(() => {
    if (!isInView) return;
    const el = document.querySelector(`[data-stat="${label}"]`);
    if (!el) return;
    let start = 0;
    const step = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / 2000, 1);
      el.textContent = String(Math.floor(p * value));
      if (p < 1) requestAnimationFrame(step);
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
import SEOHead from "@/components/SEOHead";
const PAGE_SEO = {
  title: "Club de Inversión en Estados Unidos | Comprando América",
  description: "Club privado de inversión para empresarios latinos. Protege tu patrimonio o migra a Estados Unidos con inversión desde $100,000 USD. Acompañamiento legal, fiscal y migratorio.",
  path: "/club-de-inversion-en-estados-unidos",
  schema: [
    { "@context": "https://schema.org", "@type": "Product", "name": "Club de Inversión Comprando América", "description": "Club privado de inversión para empresarios latinos en Estados Unidos", "brand": { "@type": "Brand", "name": "Comprando América" }, "offers": { "@type": "AggregateOffer", "lowPrice": "10000", "highPrice": "25000", "priceCurrency": "USD" } },
    { "@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [
      { "@type": "Question", "name": "¿Qué incluye el club de inversión?", "acceptedAnswer": { "@type": "Answer", "text": "Deal Day mensual, sesiones con expertos, mentorías en tiempo real, eventos presenciales VIP, conversaciones exclusivas y Mesa de Dueños." } },
      { "@type": "Question", "name": "¿Cuánto cuesta la membresía?", "acceptedAnswer": { "@type": "Answer", "text": "Desde $10,000 USD (Investor Entry) hasta $25,000 USD (Investor Legacy) con diferentes niveles de acceso y acompañamiento." } },
      { "@type": "Question", "name": "¿Para quién es este club?", "acceptedAnswer": { "@type": "Answer", "text": "Empresarios latinos que pueden invertir desde $100,000 USD, buscan diversificación con estructura y valoran el acompañamiento profesional." } }
    ] }
  ],
};

/* ─── Photos ─── */
const HERO = "https://lh3.googleusercontent.com/d/1rbRZbnInyEGqnf51XjSXo_5HsBp81dUc=w1920";
const PANEL = "https://lh3.googleusercontent.com/d/191DAUtt8vkLpZJatNDqvtYrRIc1Z-VHO=w1920";
const NETWORKING = "https://lh3.googleusercontent.com/d/1dOiMwsphB-MpHgpCDtufBtiqaycAIM8W=w1200";

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
      "Acceso VIP a eventos presenciales",
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
  return (
    <div className="min-h-screen bg-[#0B1F3A] text-white overflow-x-hidden">
      <SEOHead {...PAGE_SEO} />
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
              El club de inversión para latinos en{" "}
              <span className="gradient-text-primary">Estados Unidos</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed mb-4 max-w-2xl">
              No es solo encontrar oportunidades — es encontrar las que realmente te hacen sentido. Con estructura, criterio y una comunidad de empresarios que están en el mismo camino que tú.
            </p>
            <p className="text-slate-500 text-sm mb-8">
              No es una carrera. Es un proceso con acompañamiento real.
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

      {/* ═══ 2. QUÉ RESOLVEMOS — ☀️ BLANCO ═══ */}
      <section className="bg-[#F5F7FA] py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl text-[#0B1F3A] mb-4">¿Qué resuelve este club?</h2>
              <p className="text-[#6B7280] text-lg max-w-2xl mx-auto">
                Formar parte del club no solo te conecta a oportunidades — te integra a una estructura diseñada para avanzar con claridad, estrategia y seguimiento real.
              </p>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <FadeIn>
              <div className="bg-white border border-gray-200 rounded-xl p-6 h-full">
                <Shield className="w-8 h-8 text-primary mb-4" />
                <h3 className="text-lg font-bold text-[#0B1F3A] mb-3">Proteger patrimonio</h3>
                <p className="text-[#4B5563] text-sm leading-relaxed mb-4">
                  Inversión en dólares con estructura legal, diversificación fuera de tu país y bienes raíces con análisis previo.
                </p>
                <div className="space-y-2">
                  {["Desde $100,000 USD", "LLC + cuenta bancaria", "Bienes raíces con criterio", "Sin necesidad de migrar"].map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                      <span className="text-[#6B7280] text-xs">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.1}>
              <div className="bg-white border border-gray-200 rounded-xl p-6 h-full">
                <Globe className="w-8 h-8 text-primary mb-4" />
                <h3 className="text-lg font-bold text-[#0B1F3A] mb-3">Migrar con inversión</h3>
                <p className="text-[#4B5563] text-sm leading-relaxed mb-4">
                  Ruta migratoria real conectando tu inversión con visa E-2, negocio en operación y estructura completa.
                </p>
                <div className="space-y-2">
                  {["Desde $150,000 USD", "Visa E-2 de inversionista", "Negocio real en operación", "Plan USCIS-ready"].map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                      <span className="text-[#6B7280] text-xs">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ═══ 3. PILARES — navy ═══ */}
      <section className="bg-[#091A30] py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="text-center mb-14">
              <p className="text-blue-400 text-sm font-semibold tracking-[0.25em] uppercase mb-4 font-mono">Estructura del Club</p>
              <h2 className="text-3xl md:text-4xl text-white mb-4">¿Qué incluye tu membresía?</h2>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                Una estructura integral diseñada para avanzar con claridad, estrategia y seguimiento real.
              </p>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                icon: Presentation,
                title: "Deal Day",
                desc: "De manera constante analizamos en vivo oportunidades de inversión en Estados Unidos. Cada oportunidad es filtrada por el equipo y presentada con soporte legal y financiero.",
              },
              {
                icon: CalendarDays,
                title: "Sesiones con Expertos",
                desc: "De manera mensual accedes a nuestras asambleas para resolver dudas específicas sobre inversión, estructuras legales, estrategias fiscales y análisis de proyectos.",
              },
              {
                icon: Star,
                title: "Eventos Presenciales",
                desc: "Reunimos inversionistas, abogados, banqueros y especialistas para fortalecer relaciones y acelerar decisiones de nuestros miembros a lo largo del año.",
              },
              {
                icon: MessageSquare,
                title: "Mentorías en Tiempo Real",
                desc: "Aprende directamente de inversionistas que ya han invertido en Estados Unidos. Resuelve dudas en sesiones privadas presenciales y digitales.",
              },
              {
                icon: Handshake,
                title: "Conversaciones Exclusivas",
                desc: "Accede a conversaciones con empresarios, compradores de franquicias y expertos del ecosistema que comparten sus estrategias y resultados.",
              },
              {
                icon: Crown,
                title: "Mesa de Dueños",
                desc: "Grupo privado donde miembros con experiencia ayudan a evaluar y mejorar negociaciones con criterio operativo y financiero.",
              },
            ].map((pilar, i) => (
              <FadeIn key={i} delay={i * 0.06}>
                <div className="bg-[#0F2847] border border-[#1E3A5F] rounded-xl p-6 h-full hover:border-blue-500/30 transition-all">
                  <pilar.icon className="w-8 h-8 text-blue-400 mb-4" />
                  <h3 className="text-white font-semibold mb-3">{pilar.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{pilar.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>

          {/* ── Plataforma digital — compact block ── */}
          <FadeIn>
            <div className="max-w-4xl mx-auto mt-14 bg-[#0F2847] border border-blue-500/20 rounded-2xl p-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-6">
                <div>
                  <p className="text-blue-400 text-xs font-semibold tracking-[0.2em] uppercase font-mono mb-2">Plataforma Digital</p>
                  <h3 className="text-xl text-white font-semibold mb-2">Todo queda grabado. Aprende a tu ritmo.</h3>
                  <p className="text-slate-400 text-sm">Si no puedes asistir, lo ves cuando puedas. Toda la experiencia en un solo lugar.</p>
                </div>
              </div>

              {/* 5 programs grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
                {[
                  { title: "Deal Finding", desc: "Programa educativo de 4 módulos para detectar, evaluar, operar y escalar negocios." },
                  { title: "Americaniza tu Empresa", desc: "Curso completo de +70 videos grabados para operar en EE.UU." },
                  { title: "Asamblea de Miembros", desc: "Archivo completo de todas las sesiones mensuales." },
                  { title: "Cumbre de Emprendimiento", desc: "Grabaciones de todas las cumbres presenciales." },
                  { title: "Deal Day", desc: "Historial de sesiones de oportunidades de inversión presentadas." },
                ].map((prog, i) => (
                  <div key={i} className="bg-[#132D50] border border-[#1E3A5F] rounded-lg p-4">
                    <p className="text-white text-sm font-semibold mb-1">{prog.title}</p>
                    <p className="text-slate-500 text-xs leading-relaxed">{prog.desc}</p>
                  </div>
                ))}
              </div>


            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ 4. CÓMO FUNCIONA — white ═══ */}
      <section className="bg-white py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl text-[#0B1F3A] mb-4">¿Cómo funciona?</h2>
              <p className="text-[#6B7280] text-lg">No tienes que saber todo. Nosotros te guiamos paso a paso.</p>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {[
              { icon: UserCheck, step: "01", title: "Evalúas tu perfil", desc: "Te decimos con claridad si este camino es viable para ti." },
              { icon: Users, step: "02", title: "Te asignamos equipo", desc: "Abogados, CPA, estrategas. Tu equipo desde el día 1." },
              { icon: FileCheck, step: "03", title: "Estructuramos", desc: "LLC, cuentas, estrategia fiscal y migratoria diseñadas para ti." },
              { icon: Rocket, step: "04", title: "Ejecutas con criterio", desc: "Inviertes cuando hay encaje real. Sin presión. Sin carreras." },
            ].map((item, i) => (
              <FadeIn key={i} delay={i * 0.08}>
                <div className="text-center">
                  <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mx-auto mb-4">
                    <item.icon className="w-7 h-7 text-primary" />
                  </div>
                  <span className="text-primary text-xs font-mono font-bold">{item.step}</span>
                  <h3 className="text-[#0B1F3A] font-semibold mt-2 mb-2">{item.title}</h3>
                  <p className="text-[#6B7280] text-sm leading-relaxed">{item.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 5. CONFIANZA — navy ═══ */}
      <section className="bg-[#0E2544] py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl text-white mb-4">Números reales. Equipo real.</h2>
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

          {/* Experts */}
          <FadeIn>
            <p className="text-center text-blue-400 text-sm font-semibold tracking-[0.25em] uppercase font-mono mb-8">Equipo Multidisciplinario</p>
          </FadeIn>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-6 max-w-4xl mx-auto mb-10">
            {EXPERTS.map((expert, i) => (
              <FadeIn key={i} delay={i * 0.05}>
                <div className="text-center">
                  <div className="w-20 h-20 md:w-24 md:h-24 mx-auto rounded-full overflow-hidden border-2 border-[#1E3A5F] hover:border-primary/50 transition-all mb-3">
                    <img src={expert.img} alt={expert.name} className="w-full h-full object-cover" />
                  </div>
                  <p className="text-white text-xs font-semibold">{expert.name}</p>
                  <p className="text-slate-500 text-[10px]">{expert.role}</p>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn>
            <div className="text-center">
              <a href="/quienes-somos">
                <Button variant="outline" className="border-slate-600 text-white hover:bg-white/10 gap-2">
                  Conocer al equipo completo <ArrowRight className="w-4 h-4" />
                </Button>
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Photo break ── */}
      <section className="relative h-56 md:h-72 overflow-hidden">
        <img src={PANEL} alt="Panel de expertos" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#F5F7FA] via-transparent to-[#0E2544]" />
      </section>

      {/* ═══ 6. TESTIMONIOS VIDEO — ☀️ BLANCO ═══ */}
      <section className="bg-[#F5F7FA] py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl text-[#0B1F3A] mb-4">Miembros que ya están invirtiendo</h2>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              { name: "Arturo Orozco", videoId: "WYNwoTzG8Ss" },
              { name: "Gerardo Bejarano", videoId: "6J6IIPFsTD0" },
            ].map((t, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
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

      {/* ═══ 7. PERFIL IDEAL — navy ═══ */}
      <section className="bg-[#0B1F3A] py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl text-white mb-12 text-center">¿Es para ti?</h2>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <FadeIn>
              <div className="bg-[#0F2847] border border-blue-500/20 rounded-xl p-8 h-full">
                <h3 className="text-white font-semibold mb-6 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-blue-400" /> Es para ti si:
                </h3>
                <ul className="space-y-3">
                  {[
                    "Puedes invertir $100,000 USD o más",
                    "Buscas diversificación con estructura",
                    "Valoras proceso sobre improvisación",
                    "Entiendes que proteger capital es prioridad",
                    "Quieres acompañamiento real, no teoría",
                    "Buscas una comunidad, no un curso",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="text-blue-400 font-bold text-sm mt-0.5">✓</span>
                      <span className="text-slate-300 text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>

            <FadeIn delay={0.1}>
              <div className="bg-[#0F2847] border border-[#1E3A5F] rounded-xl p-8 h-full">
                <h3 className="text-white font-semibold mb-6 flex items-center gap-2">
                  <X className="w-5 h-5 text-slate-500" /> No es para ti si:
                </h3>
                <ul className="space-y-3">
                  {[
                    "Buscas oportunidades rápidas sin análisis",
                    "Esperas que otros decidan por ti",
                    "No tienes capital disponible",
                    "Quieres comisiones o intermediarios",
                    "Buscas cursos genéricos",
                    "Esperas resultados sin estructura",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="text-slate-500 text-sm mt-0.5">✕</span>
                      <span className="text-slate-400 text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>
          </div>

          <FadeIn>
            <p className="text-center text-slate-300 mt-10 max-w-xl mx-auto">
              Esto no es para todos. <span className="text-white font-semibold">Es para quien entiende que estructurar bien es más importante que entrar rápido.</span>
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ═══ 8. PLANES — ☀️ BLANCO ═══ */}
      <section className="bg-white py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl text-[#0B1F3A] mb-4">Planes de acceso</h2>
              <p className="text-[#6B7280] text-lg">Elige el nivel que mejor se ajuste a tu estrategia.</p>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {PLANS.map((plan, i) => (
              <FadeIn key={plan.name} delay={i * 0.1}>
                <div className={`relative rounded-2xl p-6 border h-full flex flex-col ${
                  plan.popular
                    ? "bg-white border-primary/40 ring-2 ring-primary/20 shadow-xl shadow-blue-600/10"
                    : "bg-white border-gray-200 shadow-sm"
                }`}>
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white px-3 py-0.5 rounded-full text-xs font-semibold">Más Popular</div>
                  )}
                  <h3 className="text-xl font-bold text-[#0B1F3A] mb-1">
                    Investor <span className="text-primary">{plan.name}</span>
                  </h3>
                  <div className="mb-4">
                    <div className="text-3xl font-bold text-primary mb-1">{plan.price}</div>
                    <p className="text-[#9CA3AF] text-xs">{plan.ideal}</p>
                  </div>
                  <div className="mb-4 pb-4 border-b border-gray-100 text-xs">
                    <p className="text-[#374151]"><strong>Valor:</strong> {plan.value}</p>
                    <p className="text-primary"><strong>Ahorro:</strong> {plan.savings}</p>
                  </div>

                  <ul className="space-y-2 mb-6 flex-grow">
                    {plan.features.map((f, fi) => (
                      <li key={fi} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <span className="text-[#4B5563] text-xs">{f}</span>
                      </li>
                    ))}
                  </ul>

                  <a href="/perfil">
                    <Button className={`w-full py-3 font-semibold gap-2 text-sm ${
                      plan.popular
                        ? "bg-primary hover:bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                        : "bg-[#0B1F3A] hover:bg-[#0E2544] text-white"
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

      {/* ═══ 9. CTA FINAL — deep navy ═══ */}
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
