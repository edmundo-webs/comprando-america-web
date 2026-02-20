import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SectionHeading from "@/components/SectionHeading";
import ProspectForm from "@/components/ProspectForm";
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

export default function VisaE2() {
  const errors = [
    "Presentar documentación débil o mal estructurada.",
    "Elegir una visa que no aplica para tu perfil.",
    "Inconsistencias en entrevista consular.",
    "No sustentar fondos, actividad económica o propósito de inversión."
  ];

  const services = [
    "Evaluación inicial del perfil migratorio y financiero.",
    "Guía para estructurar una inversión desde $100,000 USD con viabilidad migratoria (según el caso).",
    "Acompañamiento en documentación, estrategia y proceso.",
    "Ruta clara por etapas: preparación, ejecución y seguimiento.",
    "Red de aliados con experiencia real en inversión e inmigración.",
    "Acceso a trato y precios preferenciales con los expertos."
  ];

  const whyChoose = [
    {
      title: "Oportunidades Verificadas",
      description: "Acceso a oportunidades filtradas y analizadas en Estados Unidos."
    },
    {
      title: "Red Multidisciplinaria",
      description: "Inmigración, finanzas, derecho corporativo y operación en un solo lugar."
    },
    {
      title: "Criterio y Estructura",
      description: "Toma decisiones con respaldo profesional y análisis fundamentado."
    },
    {
      title: "Ética y Transparencia",
      description: "Información clara, sin esquemas dudosos ni falsas promesas."
    }
  ];

  const faqs = [
    {
      question: "¿Qué evalúan al solicitar una visa americana?",
      answer: "Las autoridades consulares evalúan historial migratorio, solvencia, vínculos con tu país, coherencia del propósito y veracidad documental. El objetivo es validar que tu solicitud es sólida y consistente."
    },
    {
      question: "¿Qué hace un asesor de visas americanas?",
      answer: "Un asesor te ayuda a definir la categoría correcta, estructurar documentación, preparar entrevista y evitar errores comunes que generan rechazos o inconsistencias. En Comprando América, este acompañamiento forma parte de la membresía."
    },
    {
      question: "¿Cómo demuestro fondos suficientes para una visa en Estados Unidos?",
      answer: "Con estados de cuenta, declaraciones fiscales, activos, ingresos comprobables y evidencia de estabilidad financiera. En procesos de inversión, lo más importante es que el origen de fondos sea legítimo, claro y defendible."
    },
    {
      question: "¿Quieres solicitar acceso a esta comunidad privada?",
      answer: "Esta membresía está diseñada para perfiles con capacidad de inversión desde $100,000 USD y un interés real en invertir en Estados Unidos con estructura y acompañamiento profesional. Completa el formulario para solicitar acceso y revisión de perfil."
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
                Asesoría Migratoria
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white leading-[1.1] mb-6">
                Visa E-2 Inversionista: Accede a <span className="gradient-text-primary">Estados Unidos</span> con Estrategia
              </h1>
              <p className="text-lg md:text-xl text-white/70 leading-relaxed mb-6 max-w-2xl">
                Accede a una asesoría profesional para visa americana como parte de nuestra membresía anual: un servicio diseñado para inversionistas latinos que buscan <strong>estructurar su entrada a Estados Unidos</strong> con claridad legal, estrategia financiera y acompañamiento experto.
              </p>
              <p className="text-base text-white/60 leading-relaxed mb-8 max-w-2xl">
                Esta asesoría está pensada para perfiles con capacidad de inversión <strong>desde $100,000 USD</strong>, y se brinda únicamente a miembros que cumplan con los criterios de selección.
              </p>
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
                  src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663291837994/CfxPxjlhrDPuEwyR.webp"
                  alt="Visa E-2 Inversionista"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ ERRORES QUE EVITAMOS ═══ */}
      <section className="section-darker py-24 md:py-32">
        <div className="container">
          <SectionHeading
            tag="Errores Comunes"
            title="Con Nuestra Membresía, Obtienes Asesoría para Evitar Estos Errores"
            subtitle="Una visa para Estados Unidos no se resuelve con un formulario. Se define con estrategia."
          />
          <p className="text-center text-white/70 mb-12 max-w-3xl mx-auto">
            Seleccionar la categoría correcta, presentar documentación sólida, construir una narrativa coherente y preparar el proceso consular con precisión son elementos clave para el éxito.
          </p>
          <div className="max-w-3xl mx-auto space-y-4">
            {errors.map((error, i) => (
              <FadeIn key={error} delay={i * 0.05}>
                <div className="flex items-start gap-4 bg-[oklch(0.15_0.03_250)] border border-red-500/20 rounded-xl p-6 hover:border-red-500/40 transition-all duration-500">
                  <XCircle className="w-6 h-6 text-red-400 shrink-0 mt-0.5" />
                  <p className="text-white/70 leading-relaxed">{error}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ QUÉ INCLUYE ═══ */}
      <section className="section-dark py-24 md:py-32">
        <div className="container">
          <SectionHeading
            tag="Nuestro Acompañamiento"
            title="¿Qué Incluye la Asesoría para Miembros?"
            subtitle="La mayoría de rechazos o retrasos ocurren por falta de criterio y estructura."
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

      {/* ═══ POR QUÉ ELEGIR ═══ */}
      <section className="section-darker py-24 md:py-32">
        <div className="container">
          <SectionHeading
            tag="Diferenciación"
            title="¿Por Qué Elegir Comprando América?"
            subtitle="En un mercado saturado de promesas, ofrecemos profesionalismo y transparencia."
          />
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {whyChoose.map((item, i) => (
              <FadeIn key={item.title} delay={i * 0.1}>
                <div className="bg-[oklch(0.15_0.03_250)] border border-white/5 rounded-xl p-8 hover:border-primary/30 transition-all duration-500 h-full">
                  <h3 className="text-lg font-serif text-white mb-4">{item.title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed">{item.description}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section className="section-dark py-24 md:py-32">
        <div className="container">
          <SectionHeading
            tag="Preguntas Frecuentes"
            title="Dudas Comunes Sobre Visa E-2"
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
                ¿Quieres Saber si Puedes Formar Parte de Esta Comunidad?
              </h2>
              <p className="text-white/70 text-lg mb-4 max-w-2xl mx-auto">
                Completa el formulario y déjanos acompañarte en tu ingreso al mercado estadounidense con estrategia, respaldo y visión a largo plazo.
              </p>
              <p className="text-white/60 text-base mb-8 max-w-2xl mx-auto">
                Capacidad de inversión desde <strong>$100,000 USD</strong> requerida.
              </p>
              <a href="#formulario">
                <Button className="bg-primary hover:bg-primary-dark text-white font-semibold px-8 py-6 text-base gap-2">
                  Solicitar Acceso <ArrowRight className="w-4 h-4" />
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
                  Solicita tu Acceso a la Membresía
                </h2>
                <p className="text-white/60">
                  Completa el formulario para que nuestro equipo revise tu perfil y te contacte con más detalles sobre cómo podemos acompañarte en tu proceso de visa E-2 e inversión en Estados Unidos.
                </p>
              </div>
              <ProspectForm title="" />
            </FadeIn>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
