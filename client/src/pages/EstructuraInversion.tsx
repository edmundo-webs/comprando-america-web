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
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Building2,
  Shield,
  FileCheck,
  DollarSign,
  Scale,
} from "lucide-react";

const WA_MSG = "Hola, me interesa estructurar mi vehículo de inversión en Estados Unidos.";

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
    document.title = "Estructura de Inversión en USA | Comprando América";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "Estructura tu vehículo de inversión en Estados Unidos con claridad y estrategia. LLC, C-Corp, S-Corp según tu caso. Inversión desde $100,000 USD.");
  }, []);
  return null;
}

/* ─── Photos ─── */
const HERO_IMAGE = "https://res.cloudinary.com/dgruohz6f/image/upload/v1773439156/comprando-america/NxiBRNllQxYRemFM.jpg";
const TAX_SLIDE = "https://lh3.googleusercontent.com/d/1rvNkomqY_CrfxTge9dQJBT1RdPdw08hM=w1920";
const AUDIENCE = "https://lh3.googleusercontent.com/d/1gnZX2RiYD4M29nQmqwcsN0k13db74LmV=w1920";

export default function EstructuraInversion() {
  return (
    <div className="min-h-screen bg-[#0B1F3A] text-white overflow-x-hidden">
      <SEOHead />
      <Navbar />

      {/* ═══ 1. HERO ═══ */}
      <section className="relative min-h-[85vh] flex items-center pt-20 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <img src={HERO_IMAGE} alt="Estructura de inversión en Estados Unidos" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B1F3A]/95 via-[#0B1F3A]/85 to-[#0B1F3A]/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F3A] via-transparent to-[#0B1F3A]/30" />
        </div>

        <div className="container relative z-10">
          <FadeIn>
            <div className="max-w-3xl">
              <p className="text-blue-400 text-sm font-semibold tracking-[0.25em] uppercase mb-6 font-mono">Asesoría Legal & Fiscal</p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl text-white leading-tight mb-6">
                Estructura tu Vehículo de <span className="gradient-text-primary">Inversión en Estados Unidos</span> con Claridad y Estrategia
              </h1>
              <p className="text-slate-400 text-lg md:text-xl leading-relaxed mb-6 max-w-2xl">
                Para invertir en Estados Unidos con seriedad, el primer paso no es "abrir una empresa": es <strong className="text-white">estructurar correctamente tu vehículo legal y fiscal</strong> para ejecutar inversiones con control de riesgo y cumplimiento.
              </p>

              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-8 max-w-xl">
                <p className="text-white font-semibold text-sm">
                  Disponible para miembros con capacidad de inversión desde <span className="text-primary">$100,000 USD</span>.
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <a href="/perfil">
                  <Button className="bg-primary hover:bg-blue-600 text-white px-8 py-6 text-base gap-2 shadow-lg shadow-blue-600/25">
                    Evaluar mi perfil <ArrowRight className="w-4 h-4" />
                  </Button>
                </a>
                <Button variant="outline" onClick={() => openWhatsApp(WHATSAPP_PHONE, WA_MSG)} className="border-slate-600 text-white hover:bg-white/10 px-8 py-6 text-base gap-2">
                  Hablar con un asesor
                </Button>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ 2. POR QUÉ FALLAN — ☀️ BLANCO ═══ */}
      <section className="bg-[#F5F7FA] py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="text-center mb-12">
              <p className="text-primary text-sm font-semibold tracking-[0.2em] uppercase mb-4 font-mono">Errores Comunes</p>
              <h2 className="text-3xl md:text-4xl text-[#0B1F3A]">Por qué muchos fallan al crear una empresa en EE.UU.</h2>
              <p className="text-[#4B5563] text-lg mt-4 max-w-2xl mx-auto">El problema no es registrar una entidad. El problema es hacerlo sin estrategia.</p>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-10">
            {[
              { title: "Elegir estructura sin estrategia", desc: "Elegir estructura legal sin entender implicaciones fiscales y de riesgo." },
              { title: "Registrar en estado incorrecto", desc: "Registrar en un estado 'popular' que no necesariamente conviene a tu operación." },
              { title: "Operar sin cumplimiento", desc: "Operar sin acuerdos internos claros, cuenta bancaria y cumplimiento básico." },
            ].map((item, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="bg-white border border-red-200 rounded-xl p-6 hover:shadow-md transition-all h-full shadow-sm">
                  <AlertTriangle className="w-8 h-8 text-red-500 mb-4" />
                  <h3 className="text-[#0B1F3A] font-semibold mb-2">{item.title}</h3>
                  <p className="text-[#6B7280] text-sm leading-relaxed">{item.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn>
            <div className="bg-white border border-red-200 rounded-xl p-6 text-center max-w-3xl mx-auto shadow-sm">
              <p className="text-[#4B5563]">
                <strong className="text-[#0B1F3A]">Resultado:</strong> costos innecesarios, fricción bancaria, problemas fiscales y decisiones mal estructuradas.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ 3. QUÉ INCLUYE — navy ═══ */}
      <section className="bg-[#0E2544] py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="text-center mb-12">
              <p className="text-blue-400 text-sm font-semibold tracking-[0.2em] uppercase mb-4 font-mono">Nuestro Acompañamiento</p>
              <h2 className="text-3xl md:text-4xl text-white">Qué incluye nuestro servicio de estructuración</h2>
            </div>
          </FadeIn>

          <div className="max-w-3xl mx-auto space-y-4">
            {[
              { icon: Scale, text: "Definición de estructura adecuada (LLC, C-Corp, S-Corp) según el propósito de inversión." },
              { icon: Building2, text: "Selección del estado correcto (Delaware, Florida, Texas u otros, según caso)." },
              { icon: FileCheck, text: "Documentación: Articles/Certificate, EIN, Operating Agreement y cumplimiento." },
              { icon: DollarSign, text: "Planeación fiscal y contable inicial (setup correcto para operar sin sorpresas)." },
              { icon: Shield, text: "Estrategia migratoria (si aplica) evaluada con aliados legales, sin promesas ni atajos." },
            ].map((item, i) => (
              <FadeIn key={i} delay={i * 0.05}>
                <div className="flex items-start gap-4 bg-[#132D50] border border-[#1E3A5F] rounded-xl p-6 hover:border-blue-500/30 transition-all">
                  <item.icon className="w-6 h-6 text-blue-400 flex-shrink-0 mt-0.5" />
                  <p className="text-slate-300 leading-relaxed">{item.text}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Photo break — tax presentation ── */}
      <section className="relative h-64 md:h-80 overflow-hidden">
        <img src={TAX_SLIDE} alt="Presentación sobre estructura fiscal" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#F5F7FA] via-transparent to-[#0E2544]" />
      </section>

      {/* ═══ 4. PARA QUIÉN — ☀️ BLANCO ═══ */}
      <section className="bg-[#F5F7FA] py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="text-center mb-12">
              <p className="text-primary text-sm font-semibold tracking-[0.2em] uppercase mb-4 font-mono">Elegibilidad</p>
              <h2 className="text-3xl md:text-4xl text-[#0B1F3A]">¿Para quién es este servicio?</h2>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <FadeIn>
              <div className="bg-[#0B1F3A] border border-[#1E3A5F] rounded-2xl p-8 h-full">
                <h3 className="text-xl text-white font-semibold mb-6 flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-blue-400" /> Para ti si:
                </h3>
                <div className="space-y-3">
                  {[
                    "Tienes capacidad de inversión desde $100,000 USD",
                    "Buscas invertir en Estados Unidos con estructura",
                    "Deseas operar inversiones con entidad formal",
                    "Quieres claridad legal, fiscal y operativa",
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                      <p className="text-slate-300 text-sm">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.1}>
              <div className="bg-white border border-gray-200 rounded-2xl p-8 h-full shadow-sm">
                <h3 className="text-xl text-[#6B7280] font-semibold mb-6 flex items-center gap-3">
                  <XCircle className="w-6 h-6 text-red-400" /> No es para ti si:
                </h3>
                <div className="space-y-3">
                  {[
                    "Solo quieres 'probar' o 'explorar'",
                    "Buscas empezar sin capacidad de inversión",
                    "Necesitas soluciones rápidas sin estrategia",
                    "No tienes compromiso con estructura formal",
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                      <p className="text-[#6B7280] text-sm">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ═══ 5. FAQ — navy ═══ */}
      <section className="bg-[#0B1F3A] py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl text-white text-center mb-12">Preguntas frecuentes</h2>
              <Accordion type="single" collapsible className="space-y-4">
                {[
                  { q: "¿Cuánto cuesta crear una empresa en Estados Unidos?", a: "Depende del estado, tipo de entidad y servicios necesarios (registro, agente registrado, cumplimiento, contabilidad y asesoría legal). En nuestra club de inversión, el objetivo es estructurar bien desde el inicio para evitar costos repetidos. Nuestro servicio de apertura de LLC tiene un costo base de $1,500 dólares por entidad registrada." },
                  { q: "¿Qué se necesita para abrir una empresa en Estados Unidos?", a: "Los requisitos varían por entidad y estado. Normalmente se requiere identificación, agente registrado y documentación de constitución; además, es clave definir propósito y estructura de la entidad antes de registrarla. Nosotros te guiamos en el proceso completo." },
                  { q: "¿Cuáles son los tipos de empresas en Estados Unidos?", a: "LLC, S-Corp y C-Corp. La elección depende de riesgo, operación, estrategia fiscal y objetivos de inversión. Cada estructura tiene implicaciones diferentes en términos de responsabilidad personal, impuestos y flexibilidad operativa." },
                ].map((faq, i) => (
                  <AccordionItem key={i} value={`faq-${i}`} className="bg-[#0F2847] border border-[#1E3A5F] rounded-xl px-6">
                    <AccordionTrigger className="text-white text-left hover:no-underline py-5">{faq.q}</AccordionTrigger>
                    <AccordionContent className="text-slate-400 leading-relaxed pb-5">{faq.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ 6. SOLO LLC — ☀️ BLANCO ═══ */}
      <section className="bg-white py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl text-[#0B1F3A] mb-4">¿Solo necesitas abrir tu empresa en Estados Unidos?</h2>
              <p className="text-[#4B5563] text-lg leading-relaxed mb-8">
                Si tu objetivo por ahora es crear tu LLC para operar o facturar en Estados Unidos, puedes hacerlo directamente. Te ayudamos a estructurarla correctamente desde el inicio.
              </p>
              <div className="grid sm:grid-cols-2 gap-3 mb-10">
                {[
                  "Registro de LLC en Texas o Florida",
                  "EIN (número fiscal federal)",
                  "Registered Agent incluido",
                  "Introducción bancaria",
                  "Acompañamiento en español",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <p className="text-[#374151]">{item}</p>
                  </div>
                ))}
              </div>
              <a href="/estructura-empresarial-en-estados-unidos">
                <Button className="bg-[#0B1F3A] hover:bg-[#0E2544] text-white px-8 py-6 text-base gap-2">
                  Crear mi LLC <ArrowRight className="w-4 h-4" />
                </Button>
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Photo break — audience ── */}
      <section className="relative h-64 md:h-80 overflow-hidden">
        <img src={AUDIENCE} alt="Comunidad de inversionistas" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#091A30] via-transparent to-white/80" />
      </section>

      {/* ═══ 7. CTA FINAL — deep navy ═══ */}
      <section className="bg-[#091A30] py-24 md:py-32">
        <div className="container">
          <FadeIn>
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl text-white mb-4">No es solo crear una empresa en Estados Unidos</h2>
              <p className="text-slate-400 mb-2">Es estructurar una plataforma de inversión.</p>
              <p className="text-slate-500 text-sm mb-10">
                Si cuentas con capacidad de inversión desde <strong className="text-white">$100,000 USD</strong> y quieres invertir con claridad legal, fiscal y operativa.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a href="/perfil">
                  <Button className="bg-primary hover:bg-blue-600 text-white px-8 py-6 text-base gap-2 shadow-lg shadow-blue-600/25">
                    Evaluar mi perfil <ArrowRight className="w-4 h-4" />
                  </Button>
                </a>
                <a href="/membresia">
                  <Button variant="outline" className="border-slate-600 text-white hover:bg-white/10 px-8 py-6 text-base">
                    Conocer el club de inversión
                  </Button>
                </a>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      <Footer />
    </div>
  );
}
