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
function SEOHead() {
  useEffect(() => {
    document.title = "Comprando América | Inversión y estructura en Estados Unidos";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "Club de inversión privado para empresarios latinos. Protege tu patrimonio o migra a Estados Unidos con inversión desde $100,000 USD. Comunidad exclusiva con criterio.");
  }, []);
  return null;
}

/* ─── Photos ─── */
const HERO_IMAGE = "https://lh3.googleusercontent.com/d/1Um6fwMpl_mMyAZWmF1hWVdnLYpJCp0Kz=w1920";
const AUDIENCE = "https://lh3.googleusercontent.com/d/1gnZX2RiYD4M29nQmqwcsN0k13db74LmV=w1920";
const NETWORKING = "https://lh3.googleusercontent.com/d/1dOiMwsphB-MpHgpCDtufBtiqaycAIM8W=w1920";
const EDMUNDO_PORTRAIT = "https://lh3.googleusercontent.com/d/1Um6fwMpl_mMyAZWmF1hWVdnLYpJCp0Kz=w800";
const PANEL = "https://lh3.googleusercontent.com/d/191DAUtt8vkLpZJatNDqvtYrRIc1Z-VHO=w1920";
const AERIAL = "https://res.cloudinary.com/dofccqypz/image/upload/v1774537564/comprando-america/eventos/uefjxoxi5trojtoeivha.jpg";
const RUTA_PHOTO = "https://lh3.googleusercontent.com/d/1jmPjN24MUpLYCLu2uizThN6ej938xfD3=w1200";
const INVEST_WEEK = "https://lh3.googleusercontent.com/d/14QiLZK8eOY1ikSQB3fQqPo3ocWhD77bE=w1200";
const MIGRAR_PHOTO = "https://lh3.googleusercontent.com/d/1CqOlO-lELT7-uQhCI26MjP19ibLQu95N=w1200";

/* ─── Experts ─── */
const EXPERTS = [
  { name: "Joe Farucci", role: "Bienes Raíces", img: "https://res.cloudinary.com/dgruohz6f/image/upload/v1773439239/comprando-america/YfxVlywHHLmCeDRI.png" },
  { name: "Tomás Resendez", role: "Inmigración", img: "https://res.cloudinary.com/dgruohz6f/image/upload/v1773439162/comprando-america/QGuNYwiuoAkxjDwj.png" },
  { name: "Daniel Palacios", role: "CPA & Fiscal", img: "https://res.cloudinary.com/dgruohz6f/image/upload/v1773439036/comprando-america/CPGtnnreqZlWVzgL.png" },
  { name: "Aubrey Dwyer", role: "Derecho Corporativo", img: "https://res.cloudinary.com/dgruohz6f/image/upload/v1773439166/comprando-america/QZAlYTAoaVokeCSo.jpg" },
  { name: "Destiny Bounds", role: "Corporativo & PI", img: "https://res.cloudinary.com/dgruohz6f/image/upload/v1773439040/comprando-america/EDQOyfeHfevdqerE.avif" },
  { name: "John McKee", role: "Estrategia Comercial", img: "https://res.cloudinary.com/dgruohz6f/image/upload/v1773439314/comprando-america/sZacCQEqvoOyeOMO.avif" },
];

/* ─── Testimonials ─── */
const TESTIMONIALS = [
  { name: "Carlos", city: "Monterrey", quote: "Entré buscando cómo estructurar mi expansión a Estados Unidos. El equipo me ayudó a abrir mi LLC correctamente y entender la estructura fiscal.", initials: "C" },
  { name: "Alejandro", city: "Ciudad de México", quote: "Lo que más valoré fue el acompañamiento del equipo multidisciplinario. No es teoría, es ejecución.", initials: "A" },
  { name: "Ricardo", city: "Monterrey", quote: "Después de asistir a la Cumbre entendí el valor del networking con empresarios que ya están invirtiendo.", initials: "R" },
];

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
                Empresario serial con más de dos décadas de experiencia operando entre México y Estados Unidos. Fundador y CEO de 9 empresas activas en EE.UU.
              </p>
              <div className="space-y-3 mb-8">
                {[
                  "MBA en Economía Industrial",
                  "Maestría en Sistema Fiscal en Estados Unidos",
                  "+20 años en comercio internacional",
                  "Más de 8 empresas operando en EE.UU. y México",
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
                        {["MBA en Economía Industrial", "Maestría en Sistema Fiscal en EE.UU.", "Formación continua en inversión inmobiliaria y corporativa"].map((item, i) => (
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
                        {["9+ empresas activas en EE.UU. y México", "Transporte, servicios financieros, bienes raíces", "Consultoría estratégica para inversionistas latinos", "50+ LLCs estructuradas para miembros de la comunidad"].map((item, i) => (
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

                <div className="mt-10 pt-8 border-t border-gray-100 text-center">
                  <a href="/quienes-somos">
                    <Button className="bg-[#0B1F3A] hover:bg-[#0E2544] text-white gap-2">
                      Conoce al equipo completo <ArrowRight className="w-4 h-4" />
                    </Button>
                  </a>
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

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0B1F3A] text-white overflow-x-hidden">
      <SEOHead />
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
          </div>

          <FadeIn>
            <div className="text-center mt-10">
              <a href="/perfil" className="inline-flex items-center gap-2 text-primary font-semibold hover:text-blue-700 transition-colors">
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
              <StatCounter value={38} suffix="+" label="Miembros activos" />
              <StatCounter value={50} suffix="+" label="LLCs estructuradas" />
              <StatCounter value={6} suffix="" label="Viajes de inspección" />
              <StatCounter value={11} suffix="+" label="Visas tramitadas" />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Photo break — sala llena ── */}
      <section className="relative h-64 md:h-80 overflow-hidden">
        <img src={AUDIENCE} alt="Sala llena de inversionistas" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F3A] via-transparent to-[#091A30]" />
      </section>

      {/* ═══ 4. EDMUNDO CEO — ☀️ BLANCO ═══ */}
      <EdmundoSection />

      {/* ═══ 5. EXPERTOS — navy ═══ */}
      <section className="bg-[#0E2544] py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="text-center mb-14">
              <p className="text-blue-400 text-sm font-semibold tracking-[0.25em] uppercase mb-4 font-mono">Equipo Multidisciplinario</p>
              <h2 className="text-3xl md:text-4xl text-white mb-4">Respaldado por expertos en cada área</h2>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto">Abogados, CPAs, inversionistas y estrategas que acompañan a cada miembro en su proceso.</p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-3 md:grid-cols-6 gap-6 max-w-4xl mx-auto mb-10">
            {EXPERTS.map((expert, i) => (
              <FadeIn key={i} delay={i * 0.05}>
                <div className="text-center group">
                  <div className="w-20 h-20 md:w-24 md:h-24 mx-auto rounded-full overflow-hidden border-2 border-[#1E3A5F] group-hover:border-primary/50 transition-all mb-3">
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
              <a href="/membresia">
                <Button variant="outline" className="border-slate-600 text-white hover:bg-white/10 gap-2">
                  Conocer al equipo completo <ArrowRight className="w-4 h-4" />
                </Button>
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

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

      {/* ── Photo break — panel de expertos ── */}
      <section className="relative h-64 md:h-80 overflow-hidden">
        <img src={PANEL} alt="Panel de expertos Comprando América" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F3A] via-transparent to-white/50" />
      </section>

      {/* ═══ 7. OPORTUNIDADES — navy ═══ */}
      <section className="bg-[#0B1F3A] py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl md:text-4xl text-white mb-4">Oportunidades activas</h2>
              <p className="text-slate-400 text-lg">Mostramos oportunidades solo cuando tienen estructura y sentido.</p>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <FadeIn>
              <div className="bg-[#0F2847] border border-blue-500/30 rounded-xl overflow-hidden h-full">
                <img src={AERIAL} alt="Inspección inmobiliaria" className="w-full h-48 object-cover" />
                <div className="p-8">
                  <span className="inline-block bg-blue-500/15 text-blue-400 text-xs font-semibold px-3 py-1 rounded-full mb-4">Abierta ahora</span>
                  <h3 className="text-xl font-bold text-white mb-3">Fondo de Bienes Raíces</h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-6">Exposición inmobiliaria patrimonial con estructura y acompañamiento.</p>
                  <a href="/bienes-raices-en-usa">
                    <Button className="bg-primary hover:bg-blue-600 text-white gap-2 text-sm w-full">Ver detalles <ArrowRight className="w-3 h-3" /></Button>
                  </a>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.1}>
              <div className="bg-[#0F2847] border border-[#1E3A5F] rounded-xl overflow-hidden h-full">
                <img src={MIGRAR_PHOTO} alt="Inversión y ruta migratoria" className="w-full h-48 object-cover" />
                <div className="p-8">
                  <span className="inline-block bg-blue-500/10 text-primary text-xs font-semibold px-3 py-1 rounded-full mb-4">Activa</span>
                  <h3 className="text-xl font-bold text-white mb-3">Inversión + Ruta migratoria</h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-6">Tienes $300,000 dólares y quieres migrar a Estados Unidos.</p>
                  <Button onClick={() => openWhatsApp(WHATSAPP_PHONE, "Hola, me interesa el modelo de Inversión + Ruta migratoria.")} className="bg-primary hover:bg-blue-600 text-white gap-2 text-sm w-full">
                    Evaluar si encaja contigo <ArrowRight className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </FadeIn>
          </div>
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

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
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
                <img src={INVEST_WEEK} alt="Florida Investment Week" className="w-full h-48 object-cover" />
                <div className="p-8">
                  <Globe className="w-8 h-8 text-primary mb-4" />
                  <h3 className="text-xl font-bold text-[#0B1F3A] mb-3">Florida Investment Week</h3>
                  <p className="text-[#6B7280] text-sm leading-relaxed mb-6">Terreno real. Propiedades reales. Números reales. Acceso por invitación.</p>
                  <a href="/investment-week">
                    <Button className="bg-primary hover:bg-blue-600 text-white gap-2 text-sm w-full">Ver Investment Week <ArrowRight className="w-3 h-3" /></Button>
                  </a>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ═══ 9. RECURSOS — navy ═══ */}
      <section className="bg-[#0E2544] py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl md:text-4xl text-white mb-4">Recursos para tomar mejores decisiones</h2>
              <p className="text-slate-400 text-lg">Contenido para empresarios e inversionistas que quieren claridad antes de ejecutar.</p>
            </div>
          </FadeIn>

          <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { icon: Mic, title: "Podcast", desc: "Conversaciones con expertos, casos y análisis.", cta: "Escuchar", href: "/podcast" },
              { icon: Newspaper, title: "News", desc: "Qué está pasando y cómo impacta tu inversión.", cta: "Leer noticias", href: "/news" },
              { icon: BookOpen, title: "Blog", desc: "Artículos y guías prácticas por el equipo.", cta: "Leer artículos", href: "/blog" },
            ].map((r, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <a href={r.href} className="block h-full">
                  <div className="bg-[#132D50] border border-[#1E3A5F] rounded-xl p-6 h-full hover:border-blue-500/30 transition-all group">
                    <r.icon className="w-8 h-8 text-blue-400 mb-4" />
                    <h3 className="text-lg font-bold text-white mb-2">{r.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed mb-4">{r.desc}</p>
                    <span className="text-blue-400 text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                      {r.cta} <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </a>
              </FadeIn>
            ))}
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
                <a href="/perfil">
                  <Button className="bg-primary hover:bg-blue-600 text-white px-8 py-6 text-base gap-2 shadow-lg shadow-blue-600/25">
                    Evaluar mi Perfil <ArrowRight className="w-4 h-4" />
                  </Button>
                </a>
                <a href="/membresia">
                  <Button variant="outline" className="border-slate-600 text-white hover:bg-white/10 px-8 py-6 text-base">
                    Conocer el Club de Inversión
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
