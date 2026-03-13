import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SectionHeading from "@/components/SectionHeading";

import { useInView } from "@/hooks/useInView";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AlertCircle, CheckCircle2, XCircle, ArrowRight } from "lucide-react";

// ─── Animated wrapper ───
function FadeIn({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
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

export default function EstructuraInversion() {
  const failureReasons = [
    {
      title: "Elegir estructura sin estrategia",
      description: "Elegir estructura legal sin entender implicaciones fiscales y de riesgo."
    },
    {
      title: "Registrar en estado incorrecto",
      description: "Registrar en un estado 'popular' que no necesariamente conviene a tu operación."
    },
    {
      title: "Operar sin cumplimiento",
      description: "Operar sin acuerdos internos claros (Operating Agreement), cuenta bancaria y cumplimiento básico."
    }
  ];

  const services = [
    "Definición de estructura adecuada (LLC, C-Corp, S-Corp, etc.) según el propósito de inversión.",
    "Selección del estado correcto (Delaware, Florida, Texas u otros, según caso).",
    "Documentación: Articles/Certificate, EIN, Operating Agreement y lineamientos de cumplimiento.",
    "Planeación fiscal y contable inicial (setup correcto para operar sin sorpresas).",
    "Estrategia migratoria (si aplica) evaluada con aliados legales, sin promesas ni atajos."
  ];

  const faqs = [
    {
      question: "¿Cuánto cuesta crear una empresa en Estados Unidos?",
      answer: "Depende del estado, tipo de entidad y servicios necesarios (registro, agente registrado, cumplimiento, contabilidad y asesoría legal). En nuestra membresía, el objetivo es estructurar bien desde el inicio para evitar costos repetidos. Nuestro servicio de apertura de LLC tiene un costo base de $1,500 dólares por entidad registrada."
    },
    {
      question: "¿Qué se necesita para abrir una empresa en Estados Unidos?",
      answer: "Los requisitos varían por entidad y estado. Normalmente se requiere identificación, agente registrado y documentación de constitución; además, es clave definir propósito y estructura de la entidad antes de registrarla. Nosotros te guiamos en el proceso completo."
    },
    {
      question: "¿Cuáles son los tipos de empresas en Estados Unidos?",
      answer: "LLC, S-Corp y C-Corp. La elección depende de riesgo, operación, estrategia fiscal y objetivos de inversión. Cada estructura tiene implicaciones diferentes en términos de responsabilidad personal, impuestos y flexibilidad operativa."
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />

      {/* ═══ HERO ═══ */}
      <section className="relative min-h-screen flex items-center pt-28 pb-20">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-r from-[oklch(0.08_0.03_250/0.92)] via-[oklch(0.10_0.03_250/0.85)] to-[oklch(0.08_0.03_250/0.70)]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.10_0.03_250)] via-transparent to-transparent" />
        </div>
        <div className="container relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <span className="inline-block text-primary text-sm font-semibold tracking-[0.25em] uppercase mb-6 font-mono">
                Asesoría Legal & Fiscal
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white leading-[1.1] mb-6">
                Estructura tu Vehículo de{" "}
                <span className="gradient-text-primary">Inversión en Estados Unidos</span> con Claridad y Estrategia
              </h1>
              <p className="text-lg md:text-xl text-white/70 leading-relaxed mb-6 max-w-2xl">
                Para invertir en Estados Unidos con seriedad, el primer paso no es "abrir una empresa": es <strong>estructurar correctamente tu vehículo legal y fiscal</strong> para ejecutar inversiones con control de riesgo, cumplimiento y claridad.
              </p>
              <p className="text-base text-white/60 leading-relaxed mb-8 max-w-2xl">
                En Comprando América ayudamos a inversionistas latinos a definir la estructura adecuada (LLC / C-Corp / S-Corp según el caso), el estado correcto y la documentación necesaria para operar con orden.
              </p>
              <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 mb-8">
                <p className="text-white font-semibold">
                  Este acompañamiento está disponible únicamente para miembros con capacidad de inversión desde <span className="text-primary">$100,000 USD</span>.
                </p>
              </div>
              <a href="#formulario">
                <Button className="bg-primary hover:bg-primary-dark text-white font-semibold px-8 py-6 text-base gap-2">
                  Solicitar Acceso <ArrowRight className="w-4 h-4" />
                </Button>
              </a>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              className="hidden lg:block"
            >
              <div className="relative rounded-2xl overflow-hidden border border-white/10">
                <img
                  src="https://res.cloudinary.com/dgruohz6f/image/upload/v1773439156/comprando-america/NxiBRNllQxYRemFM.jpg"
                  alt="Estructura de Inversión en Estados Unidos"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ POR QUÉ MUCHOS FALLAN ═══ */}
      <section className="section-darker py-24 md:py-32">
        <div className="container">
          <SectionHeading
            tag="Errores Comunes"
            title="Por Qué Muchos Fallan al Crear una Empresa en Estados Unidos"
            subtitle="El problema no es registrar una entidad. El problema es hacerlo sin estrategia."
          />
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {failureReasons.map((reason, i) => (
              <FadeIn key={reason.title} delay={i * 0.1}>
                <div className="bg-[oklch(0.15_0.03_250)] border border-red-500/20 rounded-xl p-8 hover:border-red-500/40 transition-all duration-500 h-full">
                  <div className="w-12 h-12 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center mb-6">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-serif text-white mb-4">{reason.title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed">{reason.description}</p>
                </div>
              </FadeIn>
            ))}
          </div>
          <FadeIn className="mt-12">
            <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-6 text-center max-w-3xl mx-auto">
              <p className="text-white/70">
                <strong className="text-white">Resultado:</strong> costos innecesarios, fricción bancaria, problemas fiscales y decisiones mal estructuradas.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ QUÉ INCLUYE ═══ */}
      <section className="section-dark py-24 md:py-32">
        <div className="container">
          <SectionHeading
            tag="Nuestro Acompañamiento"
            title="Qué Incluye Nuestro Servicio de Estructuración"
            subtitle="Un proceso integral diseñado para inversionistas que buscan estructura y claridad."
          />
          <div className="max-w-3xl mx-auto">
            <div className="space-y-4">
              {services.map((service, i) => (
                <FadeIn key={service} delay={i * 0.05}>
                  <div className="flex items-start gap-4 bg-[oklch(0.15_0.03_250)] border border-white/5 rounded-xl p-6 hover:border-primary/30 transition-all duration-500">
                    <CheckCircle2 className="w-6 h-6 text-primary shrink-0 mt-0.5" />
                    <p className="text-white/70 leading-relaxed">{service}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ PARA QUIÉN ═══ */}
      <section className="section-darker py-24 md:py-32">
        <div className="container">
          <SectionHeading
            tag="Elegibilidad"
            title="¿Para Quién es Este Servicio?"
            subtitle="Definimos claramente quién se beneficia de este acompañamiento."
          />
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <FadeIn>
              <div className="bg-emerald-500/5 border border-emerald-500/30 rounded-xl p-8">
                <h3 className="text-lg font-serif text-white mb-6 flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                  Para Ti Si:
                </h3>
                <ul className="space-y-3">
                  {[
                    "Tienes capacidad de inversión desde $100,000 USD",
                    "Buscas invertir en Estados Unidos con estructura",
                    "Deseas operar inversiones con entidad formal y cumplimiento",
                    "Quieres claridad legal, fiscal y operativa"
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-white/70">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-1" />
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>
            <FadeIn delay={0.1}>
              <div className="bg-red-500/5 border border-red-500/30 rounded-xl p-8">
                <h3 className="text-lg font-serif text-white mb-6 flex items-center gap-3">
                  <XCircle className="w-6 h-6 text-red-400" />
                  No Es Para Ti Si:
                </h3>
                <ul className="space-y-3">
                  {[
                    "Solo quieres 'probar' o 'explorar'",
                    "Buscas empezar a aprender sin capacidad de inversión",
                    "Necesitas soluciones rápidas sin estrategia",
                    "No tienes compromiso con estructura formal"
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-white/70">
                      <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-1" />
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section className="section-dark py-24 md:py-32">
        <div className="container">
          <SectionHeading
            tag="Preguntas Frecuentes"
            title="Dudas Comunes Sobre Estructuración"
            subtitle="Respuestas claras a las preguntas más frecuentes de inversionistas."
          />
          <div className="max-w-3xl mx-auto">
            <FadeIn>
              <Accordion type="single" collapsible className="space-y-4">
                {faqs.map((faq, i) => (
                  <AccordionItem
                    key={i}
                    value={`item-${i}`}
                    className="bg-[oklch(0.15_0.03_250)] border border-white/5 rounded-xl px-6 data-[state=open]:border-primary/30 transition-all duration-500"
                  >
                    <AccordionTrigger className="text-white hover:text-primary transition-colors py-4">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-white/70 pb-4">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ═══ CTA FINAL ═══ */}
      <section className="section-darker py-24 md:py-32">
        <div className="container">
          <FadeIn>
            <div className="bg-gradient-to-r from-primary/10 to-emerald/10 border border-primary/20 rounded-2xl p-12 md:p-16 text-center">
              <h2 className="text-3xl md:text-4xl font-serif text-white mb-6">
                No es solo crear una empresa en Estados Unidos
              </h2>
              <p className="text-white/70 text-lg mb-4 max-w-2xl mx-auto">
                Es estructurar una plataforma de inversión.
              </p>
              <p className="text-white/60 text-base mb-8 max-w-2xl mx-auto">
                Si cuentas con capacidad de inversión desde <strong>$100,000 USD</strong> y quieres invertir en <strong>Estados Unidos</strong> con claridad legal, fiscal y operativa, solicita acceso a la membresía para revisión de perfil.
              </p>
              <a href="#formulario">
                <Button className="bg-primary hover:bg-primary-dark text-white font-semibold px-8 py-6 text-base gap-2">
                  Solicitar Acceso a Membresía <ArrowRight className="w-4 h-4" />
                </Button>
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ FORMULARIO ═══ */}
      <section id="formulario" className="section-dark py-24 md:py-32">
        <div className="container">
          <div className="max-w-2xl mx-auto">
            <FadeIn>
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-serif text-white mb-4">
                  ¿Quieres Saber si Puedes Formar Parte?
                </h2>
                <p className="text-white/60">
                  Completa el formulario y déjanos acompañarte en tu ingreso al mercado estadounidense con estrategia, respaldo y visión a largo plazo.
                </p>
              </div>
              <div className="flex justify-center">
                <a href="/#membresia" className="inline-block">
                  <Button className="bg-primary hover:bg-primary-dark text-white font-semibold px-8 py-6 text-base gap-2">
                    Validar tu encaje <ArrowRight className="w-4 h-4" />
                  </Button>
                </a>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
