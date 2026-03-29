/*
 * Home 2026 — Premium Investment Club
 * Navy dark base (#0B1F3A) + Blue accent (#2563EB) + Inter/Manrope
 * Real event photos throughout for authenticity
 */

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
  CheckCircle2,
  Users,
  Globe,
  TrendingUp,
  Building2,
  MapPin,
  Mic,
  Newspaper,
  BookOpen,
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

/* ─── SEO ─── */
function SEOHead() {
  useEffect(() => {
    document.title = "Comprando América | Inversión y estructura en Estados Unidos";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "Club de inversión privado, oportunidades y estructura para invertir y expandirte en Estados Unidos. Evalúa tu perfil y accede a una comunidad con criterio.");
  }, []);
  return null;
}

/* ─── Photos ─── */
const HERO_IMAGE = "https://lh3.googleusercontent.com/d/1Um6fwMpl_mMyAZWmF1hWVdnLYpJCp0Kz=w1920"; // Edmundo rooftop
const AUDIENCE = "https://lh3.googleusercontent.com/d/1gnZX2RiYD4M29nQmqwcsN0k13db74LmV=w1920"; // packed room
const NETWORKING = "https://lh3.googleusercontent.com/d/1dOiMwsphB-MpHgpCDtufBtiqaycAIM8W=w1920"; // networking
const WORKSHOP = "https://lh3.googleusercontent.com/d/1mQWgGjGOCgTU8BsOl3Rgdh5mGR3eObRd=w1200"; // numbers on board
const VOTING = "https://lh3.googleusercontent.com/d/1WzKjPerMTX-RlLsJWxLegBkpn4_Ademp=w1920"; // hands raised
const EDMUNDO_PORTRAIT = "https://lh3.googleusercontent.com/d/1Um6fwMpl_mMyAZWmF1hWVdnLYpJCp0Kz=w800";
const DINNER = "https://lh3.googleusercontent.com/d/1VKFcr6XRJ81P6XX9JbQ_GQvTsQdcvsQC=w1920"; // private dinner
const AERIAL = "https://res.cloudinary.com/dofccqypz/image/upload/v1774537564/comprando-america/eventos/uefjxoxi5trojtoeivha.jpg"; // inspection

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
                Comunidad Exclusiva para Inversionistas
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-7xl text-white leading-[1.1] mb-6">
                Invierte en Estados Unidos con{" "}
                <span className="gradient-text-primary">criterio, estructura</span> y comunidad
              </h1>
              <p className="text-lg md:text-xl text-slate-300 leading-relaxed mb-6 max-w-2xl">
                Comprando América es una comunidad exclusiva para empresarios e inversionistas latinos que buscan oportunidades filtradas, acompañamiento estratégico y una ruta clara para ejecutar.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mb-8 max-w-2xl">
                {["Oportunidades presentadas en sesiones privadas", "Estructura empresarial desde el inicio", "Acceso por perfil (no por curiosidad)"].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-slate-300">
                    <CheckCircle2 className="w-5 h-5 text-blue-400 flex-shrink-0" />
                    <span className="text-sm">{item}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <a href="/quienes-somos">
                  <Button className="bg-primary hover:bg-blue-600 text-white font-semibold px-8 py-6 text-base gap-2 w-full sm:w-auto shadow-lg shadow-blue-600/25">
                    Quiénes Somos <ArrowRight className="w-4 h-4" />
                  </Button>
                </a>
                <a href="/perfil">
                  <Button variant="outline" className="border-slate-500 text-white hover:bg-white/10 px-8 py-6 text-base w-full sm:w-auto">
                    Evaluar mi Perfil
                  </Button>
                </a>
              </div>

              <a href="/oportunidades-de-inversion-en-estados-unidos" className="inline-flex items-center gap-1 text-blue-400 text-sm hover:text-blue-300 transition-colors">
                Ver oportunidades <ArrowRight className="w-3 h-3" />
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ 2. VITRINA — ☀️ BLANCO ═══ */}
      <section className="bg-[#F5F7FA] py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl lg:text-5xl text-[#0B1F3A]">¿Por dónde empezar?</h2>
            </div>
          </FadeIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              { icon: Users, title: "Club de inversión", desc: "Comunidad, criterio y oportunidades en espacios exclusivos.", cta: "Ver club de inversión", href: "/membresia", highlight: true },
              { icon: Globe, title: "Ruta migratoria", desc: "Entiende cómo se conecta inversión, negocio y viabilidad migratoria.", cta: "Ver guía", href: "/visa-e2-inversion-en-estados-unidos" },
              { icon: TrendingUp, title: "Oportunidades activas", desc: "Accede a oportunidades reales si tu perfil es el adecuado.", cta: "Ver oportunidades", href: "/oportunidades-de-inversion-en-estados-unidos" },
              { icon: Building2, title: "Estructura Empresarial", desc: "Abrir una empresa es el inicio. Estructurarla correctamente es la diferencia.", cta: "Ver Estructura", href: "/estructura-de-inversion-en-usa" },
            ].map((card, i) => (
              <FadeIn key={i} delay={i * 0.08}>
                <a href={card.href} className="block h-full">
                  <div className={`bg-white border rounded-xl p-6 h-full hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group ${card.highlight ? "border-primary/40 shadow-md ring-1 ring-primary/10" : "border-gray-200 shadow-sm"}`}>
                    <card.icon className="w-8 h-8 text-primary mb-4" />
                    <h3 className="text-lg font-bold text-[#0B1F3A] mb-2">{card.title}</h3>
                    <p className="text-[#6B7280] text-sm leading-relaxed mb-4">{card.desc}</p>
                    <span className="text-primary text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                      {card.cta} <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </a>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Photo break — sala llena ── */}
      <section className="relative h-72 md:h-96 overflow-hidden">
        <img src={AUDIENCE} alt="Sala llena de inversionistas" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#091A30] via-transparent to-[#F5F7FA]" />
      </section>

      {/* ═══ 3. CLUB — DEEP NAVY ═══ */}
      <section className="bg-[#091A30] py-20 md:py-28">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            <FadeIn>
              <div>
                <p className="text-blue-400 text-sm font-semibold tracking-[0.25em] uppercase mb-4 font-mono">La Red de Contactos</p>
                <h2 className="text-3xl md:text-4xl text-white mb-6">Comprando América es el núcleo del ecosistema</h2>
                <p className="text-slate-400 text-lg leading-relaxed mb-8">
                  La información no basta. La diferencia está en tener criterio, comunidad y una ruta clara para ejecutar. Dentro de la comunidad suceden las conversaciones que no se publican: acceso, análisis y decisiones.
                </p>
                <div className="space-y-3 mb-10">
                  {["Deal Day mensual: oportunidades presentadas en sesión privada", "Club de empresarios e inversionistas con intención real", "Acompañamiento estratégico para estructurar y avanzar"].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                      <p className="text-slate-300">{item}</p>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-4 mb-6">
                  <a href="/membresia">
                    <Button className="bg-primary hover:bg-blue-600 text-white px-8 py-6 text-base gap-2 shadow-lg shadow-blue-600/25">
                      Quiero conocer la Comunidad <ArrowRight className="w-4 h-4" />
                    </Button>
                  </a>
                  <a href="/perfil">
                    <Button variant="outline" className="border-slate-600 text-white hover:bg-white/10 px-8 py-6 text-base">Evaluar mi Perfil</Button>
                  </a>
                </div>
                <p className="text-slate-500 text-sm">El club de inversión es exclusivo. El acceso se valida por perfil.</p>
              </div>
            </FadeIn>
            <FadeIn delay={0.1}>
              <div className="rounded-2xl overflow-hidden border border-[#1E3A5F] shadow-lg">
                <img src={NETWORKING} alt="Networking entre miembros" className="w-full h-80 object-cover" />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ═══ 4. EDMUNDO CEO — ☀️ BLANCO ═══ */}
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
                <a href="https://edmundotrevino.com" target="_blank" rel="noopener noreferrer">
                  <Button className="bg-[#0B1F3A] hover:bg-[#0E2544] text-white gap-2">
                    Conoce más sobre Edmundo <ArrowRight className="w-4 h-4" />
                  </Button>
                </a>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── Photo break — workshop numbers ── */}
      <section className="relative h-64 md:h-80 overflow-hidden">
        <img src={WORKSHOP} alt="Sesión de análisis de inversión" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0E2544] via-transparent to-[#F5F7FA]" />
      </section>

      {/* ═══ 5. VISA E-2 FAQ — MEDIUM NAVY ═══ */}
      <section className="bg-[#0E2544] py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl text-white mb-4">Visa E-2: las 3 preguntas que más nos hacen</h2>
              <p className="text-slate-400 text-lg leading-relaxed mb-10">
                La visa E-2 no se "tramita" como un formulario. Se construye a partir de una estructura de inversión y negocio bien diseñada.
              </p>

              <Accordion type="single" collapsible className="space-y-4 mb-10">
                {[
                  { q: "¿Qué es la visa E-2 y para quién aplica?", a: "Es una vía para operar un negocio en Estados Unidos basada en inversión (según nacionalidad y caso). Requiere estructura y ejecución real." },
                  { q: "¿Cuál es la inversión mínima típica para una estrategia E-2?", a: "Depende del caso y del negocio, pero normalmente se evalúan estrategias desde montos relevantes para operar y demostrar actividad real." },
                  { q: "¿Abrir una LLC es suficiente para una E-2?", a: "No. La LLC es una parte. Lo importante es la estructura completa: inversión, operación y evidencia." },
                ].map((faq, i) => (
                  <AccordionItem key={i} value={`visa-faq-${i}`} className="bg-[#132D50] border border-[#1E3A5F] rounded-xl px-6">
                    <AccordionTrigger className="text-white text-left hover:no-underline py-5">{faq.q}</AccordionTrigger>
                    <AccordionContent className="text-slate-400 leading-relaxed pb-5">{faq.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>

              <div className="flex flex-wrap gap-4">
                <a href="/visa-e2-inversion-en-estados-unidos">
                  <Button className="bg-primary hover:bg-blue-600 text-white gap-2">Ver guía completa de Visa E-2 <ArrowRight className="w-4 h-4" /></Button>
                </a>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ 6. OPORTUNIDADES — ☀️ BLANCO ═══ */}
      <section className="bg-white py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl md:text-4xl text-[#0B1F3A] mb-4">Oportunidades de inversión en Estados Unidos</h2>
              <p className="text-[#4B5563] text-lg leading-relaxed">Mostramos oportunidades solo cuando tienen estructura y sentido. El capital importa, pero el perfil decide.</p>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-8">
            <FadeIn>
              <div className="bg-[#0B1F3A] border border-blue-500/30 rounded-xl overflow-hidden h-full">
                <img src={AERIAL} alt="Vista aérea de inspección inmobiliaria" className="w-full h-48 object-cover" />
                <div className="p-8">
                  <span className="inline-block bg-blue-500/15 text-blue-400 text-xs font-semibold px-3 py-1 rounded-full mb-4">Abierta ahora</span>
                  <h3 className="text-xl font-bold text-white mb-3">Fondo de Bienes Raíces en Estados Unidos</h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-6">Una vía patrimonial para inversionistas que buscan exposición inmobiliaria con estructura.</p>
                  <a href="/bienes-raices-en-usa">
                    <Button className="bg-primary hover:bg-blue-600 text-white gap-2 text-sm w-full">Ver detalles <ArrowRight className="w-3 h-3" /></Button>
                  </a>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.1}>
              <div className="bg-[#0B1F3A] border border-[#1E3A5F] rounded-xl overflow-hidden h-full">
                <img src={DINNER} alt="Cena privada de inversionistas" className="w-full h-48 object-cover" />
                <div className="p-8">
                  <span className="inline-block bg-blue-500/10 text-primary text-xs font-semibold px-3 py-1 rounded-full mb-4">Activa</span>
                  <h3 className="text-xl font-bold text-white mb-3">Inversión + Ruta migratoria</h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-6">Tienes $300,000 dólares y quieres migrar a Estados Unidos.</p>
                  <Button onClick={() => openWhatsApp(WHATSAPP_PHONE, "Hola, me interesa el modelo de Inversión + Ruta migratoria.")} className="bg-primary hover:bg-blue-600 text-white gap-2 text-sm w-full">
                    Evaluar si este modelo encaja contigo <ArrowRight className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ═══ 7. ESTRUCTURA — navy ═══ */}
      <section className="bg-[#0B1F3A] py-20 md:py-28">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            <FadeIn>
              <div>
                <h2 className="text-3xl md:text-4xl text-white mb-4">Estructura Empresarial en Estados Unidos</h2>
                <p className="text-primary text-sm font-semibold mb-6">Abrir una empresa no es el objetivo. Es el primer paso para operar o invertir con orden.</p>
                <p className="text-slate-400 text-lg leading-relaxed mb-8">
                  Te ayudamos a construir una base empresarial clara: desde abrir tu entidad, hasta preparar lo necesario para operar o invertir con estrategia.
                </p>
                <div className="space-y-3 mb-10">
                  {["LLC u otra estructura según el caso", "Texas o Florida con criterio", "EIN y base operativa", "Preparación para operar o invertir"].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                      <p className="text-slate-300">{item}</p>
                    </div>
                  ))}
                </div>
                <a href="/estructura-de-inversion-en-usa">
                  <Button className="bg-primary hover:bg-blue-600 text-white gap-2 shadow-lg shadow-blue-600/15">
                    Ver Estructura Empresarial <ArrowRight className="w-4 h-4" />
                  </Button>
                </a>
              </div>
            </FadeIn>
            <FadeIn delay={0.1}>
              <div className="rounded-2xl overflow-hidden border border-[#1E3A5F] shadow-lg">
                <img src={VOTING} alt="Miembros participando en sesión" className="w-full h-80 object-cover" />
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
              <p className="text-[#4B5563] text-lg">Hay decisiones que no se toman desde una pantalla. Se toman viendo activos, con contexto y con las personas correctas.</p>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <FadeIn>
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden h-full shadow-sm hover:shadow-lg transition-all">
                <img src="https://res.cloudinary.com/dofccqypz/image/upload/v1774537559/comprando-america/eventos/hpwrp8ofq5delfnpo9ro.jpg" alt="Ruta Inmobiliaria" className="w-full h-48 object-cover" />
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
                <img src={DINNER} alt="Florida Investment Week — cena privada" className="w-full h-48 object-cover" />
                <div className="p-8">
                  <Globe className="w-8 h-8 text-primary mb-4" />
                  <h3 className="text-xl font-bold text-[#0B1F3A] mb-3">Florida Investment Week</h3>
                  <p className="text-[#6B7280] text-sm leading-relaxed mb-6">Terreno real. Propiedades reales. Números reales. (Acceso por invitación)</p>
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
              <p className="text-slate-400 text-lg leading-relaxed">Contenido para empresarios e inversionistas que quieren claridad antes de ejecutar.</p>
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

      {/* ── Photo break — audience ── */}
      <section className="relative h-64 md:h-80 overflow-hidden">
        <img src="https://res.cloudinary.com/dofccqypz/image/upload/v1774537561/comprando-america/eventos/fou8skfadwce2lodr5yc.jpg" alt="Evento Comprando América" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#091A30] via-transparent to-[#0E2544]" />
      </section>

      {/* ═══ 10. CTA FINAL — DEEP NAVY ═══ */}
      <section className="bg-[#091A30] py-24 md:py-32">
        <div className="container">
          <FadeIn>
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl lg:text-5xl text-white mb-6">
                Si tu objetivo es invertir o expandirte en Estados Unidos, empieza por tu perfil
              </h2>
              <p className="text-slate-400 text-lg leading-relaxed mb-10">
                Te decimos con claridad si este camino hace sentido para ti y cuál sería el siguiente paso.
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
