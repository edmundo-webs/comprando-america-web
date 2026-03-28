/*
 * Home 2026 — Premium Investment Club
 * Navy dark base (#0B1F3A) + Blue accent (#2563EB) + Inter/Manrope
 * Alternating: deep navy → medium navy → light break → navy
 */

import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useInView } from "@/hooks/useInView";
import { openWhatsApp, WHATSAPP_PHONE } from "@/lib/whatsapp";
import { IMAGES } from "@/lib/constants";
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
  MessageCircle,
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

/* ─── SEO ─── */
function SEOHead() {
  useEffect(() => {
    document.title =
      "Comprando América | Inversión y estructura en Estados Unidos";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute(
        "content",
        "Membresía privada, oportunidades y estructura para invertir y expandirte en Estados Unidos. Evalúa tu perfil y accede a una comunidad con criterio."
      );
    }
  }, []);
  return null;
}

/* ═══════════════════════════════════════════════════════ */

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0B1F3A] text-white overflow-x-hidden">
      <SEOHead />
      <Navbar />

      {/* ═══ 1. HERO ═══ */}
      <section className="relative min-h-screen flex items-center">
        <div className="absolute inset-0">
          <img src={IMAGES.hero} alt="Skyline" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B1F3A]/95 via-[#0B1F3A]/85 to-[#0B1F3A]/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F3A] via-transparent to-transparent" />
        </div>

        <div className="container relative z-10 pt-28 pb-20">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <span className="inline-block text-blue-400 text-sm font-semibold tracking-[0.25em] uppercase mb-6 font-mono">
                Membresía Privada para Inversionistas
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-7xl text-white leading-[1.1] mb-6">
                Invierte en Estados Unidos con{" "}
                <span className="gradient-text-primary">criterio, estructura</span>{" "}
                y comunidad
              </h1>
              <p className="text-lg md:text-xl text-slate-300 leading-relaxed mb-6 max-w-2xl">
                Comprando América es una membresía privada para empresarios e
                inversionistas latinos que buscan oportunidades filtradas,
                acompañamiento estratégico y una ruta clara para ejecutar.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mb-8 max-w-2xl">
                {[
                  "Oportunidades presentadas en sesiones privadas",
                  "Estructura empresarial desde el inicio",
                  "Acceso por perfil (no por curiosidad)",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-slate-300">
                    <CheckCircle2 className="w-5 h-5 text-blue-400 flex-shrink-0" />
                    <span className="text-sm">{item}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                <a href="/membresia">
                  <Button className="bg-primary hover:bg-blue-600 text-white font-semibold px-8 py-6 text-base gap-2 w-full sm:w-auto shadow-lg shadow-blue-600/25">
                    Conocer la Membresía <ArrowRight className="w-4 h-4" />
                  </Button>
                </a>
                <a href="/perfil">
                  <Button variant="outline" className="border-slate-500 text-white hover:bg-white/10 px-8 py-6 text-base w-full sm:w-auto">
                    Evaluar mi Perfil
                  </Button>
                </a>
              </div>

              <a href="/bienes-raices-en-usa" className="inline-flex items-center gap-1 text-blue-400 text-sm hover:text-blue-300 transition-colors">
                Ver oportunidades abiertas <ArrowRight className="w-3 h-3" />
              </a>

              <p className="text-slate-500 text-xs mt-6 max-w-lg">
                Acceso sujeto a criterios de perfil. Sin promesas irreales: claridad primero, estrategia después.
              </p>
            </motion.div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" className="w-full">
            <path d="M0 80L1440 20V80H0Z" fill="#F5F7FA" />
          </svg>
        </div>
      </section>

      {/* ═══ 2. VITRINA — LIGHT BREAK ═══ */}
      <section className="bg-[#F5F7FA] py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl lg:text-5xl text-[#0B1F3A]">
                Elige tu ruta en 30 segundos
              </h2>
            </div>
          </FadeIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              { icon: Users, title: "Membresía privada", desc: "Comunidad, criterio y oportunidades en espacios exclusivos.", cta: "Ver Membresía", href: "/membresia", highlight: true },
              { icon: Globe, title: "Visa E-2 (Inversionista)", desc: "Entiende cómo se conecta inversión, negocio y viabilidad migratoria.", cta: "Ver guía", href: "/visa-e2-inversion-en-estados-unidos" },
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

      {/* ═══ 3. MEMBRESÍA — DEEP NAVY ═══ */}
      <section className="bg-[#091A30] py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="max-w-3xl mx-auto">
              <p className="text-blue-400 text-sm font-semibold tracking-[0.25em] uppercase mb-4 font-mono">
                Producto estrella
              </p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl text-white mb-6">
                La Membresía es el núcleo del ecosistema
              </h2>
              <p className="text-slate-400 text-lg leading-relaxed mb-8">
                La información no basta. La diferencia está en tener criterio,
                comunidad y una ruta clara para ejecutar. Dentro de la Membresía
                suceden las conversaciones que no se publican: acceso, análisis y decisiones.
              </p>

              <div className="space-y-3 mb-10">
                {[
                  "Deal Day mensual: oportunidades presentadas en sesión privada",
                  "Comunidad de empresarios e inversionistas con intención real",
                  "Acompañamiento estratégico para estructurar y avanzar",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <p className="text-slate-300">{item}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-4 mb-6">
                <a href="/membresia">
                  <Button className="bg-primary hover:bg-blue-600 text-white px-8 py-6 text-base gap-2 shadow-lg shadow-blue-600/25">
                    Quiero conocer la Membresía <ArrowRight className="w-4 h-4" />
                  </Button>
                </a>
                <a href="/perfil">
                  <Button variant="outline" className="border-slate-600 text-white hover:bg-white/10 px-8 py-6 text-base">
                    Evaluar mi Perfil
                  </Button>
                </a>
              </div>
              <p className="text-slate-500 text-sm">La Membresía es privada. El acceso se valida por perfil.</p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ 4. VISA E-2 FAQ — MEDIUM NAVY ═══ */}
      <section className="bg-[#0E2544] py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl text-white mb-4">
                Visa E-2: las 3 preguntas que más nos hacen
              </h2>
              <p className="text-slate-400 text-lg leading-relaxed mb-10">
                La visa E-2 no se "tramita" como un formulario. Se construye a
                partir de una estructura de inversión y negocio bien diseñada.
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
                  <Button className="bg-primary hover:bg-blue-600 text-white gap-2">
                    Ver guía completa de Visa E-2 <ArrowRight className="w-4 h-4" />
                  </Button>
                </a>
                <a href="/perfil" className="inline-flex items-center gap-1 text-blue-400 text-sm hover:text-blue-300 transition-colors self-center">
                  Evaluar mi Perfil para este camino <ArrowRight className="w-3 h-3" />
                </a>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ 5. OPORTUNIDADES — NAVY ═══ */}
      <section className="bg-[#0B1F3A] py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl md:text-4xl text-white mb-4">
                Oportunidades de inversión en Estados Unidos
              </h2>
              <p className="text-slate-400 text-lg leading-relaxed">
                Mostramos oportunidades solo cuando tienen estructura y sentido. El capital importa, pero el perfil decide.
              </p>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-8">
            <FadeIn>
              <div className="bg-[#0F2847] border border-blue-500/30 rounded-xl p-8 h-full">
                <span className="inline-block bg-blue-500/15 text-blue-400 text-xs font-semibold px-3 py-1 rounded-full mb-4">Abierta ahora</span>
                <h3 className="text-xl font-bold text-white mb-3">Fondo de Bienes Raíces en Estados Unidos</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">Una vía patrimonial para inversionistas que buscan exposición inmobiliaria con estructura y acompañamiento.</p>
                <div className="flex flex-wrap gap-3">
                  <a href="/bienes-raices-en-usa">
                    <Button className="bg-primary hover:bg-blue-600 text-white gap-2 text-sm">Ver detalles del fondo <ArrowRight className="w-3 h-3" /></Button>
                  </a>
                  <a href="/perfil" className="inline-flex items-center gap-1 text-blue-400 text-sm hover:text-blue-300 transition-colors self-center">
                    Evaluar mi Perfil <ArrowRight className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.1}>
              <div className="bg-[#0F2847] border border-[#1E3A5F] rounded-xl p-8 h-full">
                <span className="inline-block bg-[#132D50] text-slate-500 text-xs font-semibold px-3 py-1 rounded-full mb-4">Próximamente</span>
                <h3 className="text-xl font-bold text-white mb-3">Growth Partner</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">Oportunidad en desarrollo. Acceso sujeto a perfil y alineación con la estrategia.</p>
                <a href="/perfil">
                  <Button variant="outline" className="border-[#2A4A6B] text-white hover:bg-[#1E3A5F] gap-2 text-sm">
                    Sumarme a lista prioritaria <ArrowRight className="w-3 h-3" />
                  </Button>
                </a>
              </div>
            </FadeIn>
          </div>

          <FadeIn>
            <p className="text-slate-500 text-sm text-center max-w-xl mx-auto">
              Acceso sujeto a criterios de perfil, experiencia e intención (aun con capital disponible).
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ═══ 6. ESTRUCTURA — LIGHT BREAK ═══ */}
      <section className="bg-[#F5F7FA] py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl text-[#0B1F3A] mb-4">
                Estructura Empresarial en Estados Unidos
              </h2>
              <p className="text-primary text-sm font-semibold mb-6">
                Abrir una empresa no es el objetivo. Es el primer paso para operar o invertir con orden.
              </p>
              <p className="text-[#4B5563] text-lg leading-relaxed mb-8">
                Te ayudamos a construir una base empresarial clara: desde abrir tu entidad, hasta preparar lo necesario para operar o invertir con estrategia.
              </p>

              <div className="space-y-3 mb-10">
                {[
                  "Abrir tu entidad (LLC u otra estructura según el caso)",
                  "Elegir Texas o Florida con criterio",
                  "EIN y base operativa",
                  "Preparación para operar o invertir",
                  "Identificar cuándo necesitas estrategia más avanzada",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <p className="text-[#374151]">{item}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-4">
                <a href="/estructura-de-inversion-en-usa">
                  <Button className="bg-primary hover:bg-blue-600 text-white gap-2 shadow-lg shadow-blue-600/15">
                    Ver Estructura Empresarial <ArrowRight className="w-4 h-4" />
                  </Button>
                </a>
                <Button variant="outline" onClick={() => openWhatsApp(WHATSAPP_PHONE, "Hola, me interesa estructurar mi empresa en Estados Unidos.")} className="border-[#D1D5DB] text-[#0B1F3A] hover:bg-white gap-2">
                  Evaluar mi Perfil
                </Button>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ 7. EVENTOS — MEDIUM NAVY ═══ */}
      <section className="bg-[#0E2544] py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl md:text-4xl text-white mb-4">Eventos y experiencias en terreno</h2>
              <p className="text-slate-400 text-lg leading-relaxed">
                Hay decisiones que no se toman desde una pantalla. Se toman viendo activos, con contexto y con las personas correctas.
              </p>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <FadeIn>
              <div className="bg-[#132D50] border border-[#1E3A5F] rounded-xl p-8 h-full hover:border-blue-500/30 transition-all">
                <MapPin className="w-8 h-8 text-blue-400 mb-4" />
                <h3 className="text-xl font-bold text-white mb-3">Ruta Inmobiliaria en Estados Unidos</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">Un evento presencial para entender oportunidades de bienes raíces con estructura, criterio y networking.</p>
                <a href="/ruta-inmobiliaria-en-estados-unidos">
                  <Button className="bg-primary hover:bg-blue-600 text-white gap-2 text-sm">Ver Ruta Inmobiliaria <ArrowRight className="w-3 h-3" /></Button>
                </a>
              </div>
            </FadeIn>

            <FadeIn delay={0.1}>
              <div className="bg-[#132D50] border border-[#1E3A5F] rounded-xl p-8 h-full hover:border-blue-500/30 transition-all">
                <Globe className="w-8 h-8 text-blue-400 mb-4" />
                <h3 className="text-xl font-bold text-white mb-3">Florida Investment Week</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">Terreno real. Propiedades reales. Números reales. (Acceso por invitación/perfil)</p>
                <div className="flex flex-wrap gap-3">
                  <a href="/investment-week">
                    <Button className="bg-primary hover:bg-blue-600 text-white gap-2 text-sm">Ver Investment Week <ArrowRight className="w-3 h-3" /></Button>
                  </a>
                  <button onClick={() => openWhatsApp(WHATSAPP_PHONE, "Hola, me interesa la Florida Investment Week.")} className="inline-flex items-center gap-1 text-blue-400 text-sm hover:text-blue-300 transition-colors">
                    Solicitar invitación <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ═══ 8. RECURSOS — NAVY ═══ */}
      <section className="bg-[#0B1F3A] py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl md:text-4xl text-white mb-4">Recursos educativos para tomar mejores decisiones</h2>
              <p className="text-slate-400 text-lg leading-relaxed">Contenido para empresarios e inversionistas que quieren claridad antes de ejecutar.</p>
            </div>
          </FadeIn>

          <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
            {[
              { icon: Mic, title: "Podcast", desc: "Conversaciones con expertos, casos y análisis.", cta: "Escuchar episodios", href: "/podcast" },
              { icon: Newspaper, title: "News", desc: "Qué está pasando y cómo impacta tu inversión.", cta: "Leer noticias", href: "/news" },
              { icon: BookOpen, title: "Blog", desc: "Artículos y guías prácticas por el equipo.", cta: "Leer artículos", href: "/blog" },
            ].map((r, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <a href={r.href} className="block h-full">
                  <div className="bg-[#0F2847] border border-[#1E3A5F] rounded-xl p-6 h-full hover:border-blue-500/30 transition-all group">
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

          <FadeIn>
            <div className="text-center">
              <p className="text-slate-500 mb-6">¿Listo para pasar de información a acción?</p>
              <a href="/perfil">
                <Button className="bg-primary hover:bg-blue-600 text-white gap-2">Evaluar mi Perfil <ArrowRight className="w-4 h-4" /></Button>
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ 9. AUTORIDAD — LIGHT BREAK ═══ */}
      <section className="bg-[#F5F7FA] py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl text-[#0B1F3A] mb-6">Quiénes somos</h2>
              <p className="text-[#4B5563] text-lg leading-relaxed mb-8">
                Comprando América es una comunidad privada de empresarios e inversionistas latinos enfocada en estructura, estrategia y ejecución en Estados Unidos.
              </p>
              <a href="/quienes-somos">
                <Button variant="outline" className="border-[#D1D5DB] text-[#0B1F3A] hover:bg-white gap-2">
                  Conocer la historia y el equipo <ArrowRight className="w-4 h-4" />
                </Button>
              </a>
            </div>
          </FadeIn>
        </div>
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
                    Conocer la Membresía
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

      {/* ═══ WHATSAPP FLOTANTE ═══ */}
      <a href={`https://wa.me/${WHATSAPP_PHONE}`} target="_blank" rel="noopener noreferrer" className="fixed bottom-6 right-6 z-40 bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg transition-all" title="Hablar con un asesor">
        <MessageCircle className="w-6 h-6" />
      </a>

      <Footer />
    </div>
  );
}
