import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SectionHeading from "@/components/SectionHeading";
import ProspectForm from "@/components/ProspectForm";
import { useInView } from "@/hooks/useInView";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Home, TrendingUp, DollarSign, Globe, Building2, Users, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";

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

// ─── Pillar Card ───
function PillarCard({ icon: Icon, title, description }: { icon: React.ElementType; title: string; description: string }) {
  return (
    <div className="group relative bg-[oklch(0.15_0.03_250)] border border-white/5 rounded-xl p-6 hover:border-primary/30 transition-all duration-500 h-full">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
      <div className="relative">
        <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
          <Icon className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-serif text-white mb-3">{title}</h3>
        <p className="text-white/50 text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

export default function BienesRaices() {
  const pillars = [
    {
      icon: Building2,
      title: "Estabilidad del Mercado",
      description: "Estados Unidos ofrece un entorno económico y legal confiable, ideal para proteger tu capital y obtener rendimientos sostenibles."
    },
    {
      icon: Home,
      title: "Diversidad de Opciones",
      description: "Desde propiedades residenciales hasta complejos comerciales, terrenos o desarrollos inmobiliarios adaptables a distintos perfiles."
    },
    {
      icon: TrendingUp,
      title: "Flexibilidad en la Inversión",
      description: "Invierte de manera directa, a través de sociedades, o mediante fondos especializados como REITs con optimización fiscal."
    },
    {
      icon: DollarSign,
      title: "Alta Demanda en Alquiler",
      description: "Las principales ciudades mantienen demanda constante de vivienda en renta, generando ingresos pasivos recurrentes."
    },
    {
      icon: Globe,
      title: "Ciudades con Alto Potencial",
      description: "Zonas emergentes y desarrolladas ofrecen condiciones atractivas por crecimiento demográfico y proyecciones económicas."
    },
    {
      icon: Users,
      title: "Accesibilidad para Extranjeros",
      description: "A diferencia de otros países, en Estados Unidos los extranjeros pueden adquirir propiedades sin restricciones complejas."
    }
  ];

  const commonMistakes = [
    {
      title: "Comprar sin Tesis de Inversión",
      description: "Muchos inversionistas adquieren propiedades sin criterios claros ni análisis previo de viabilidad."
    },
    {
      title: "No Diferenciar Riesgos por Zona",
      description: "Cada zona, tipo de activo y operación tiene riesgos específicos que deben evaluarse cuidadosamente."
    },
    {
      title: "Ignorar Estructura Legal y Fiscal",
      description: "La estructura legal y fiscal debe definirse antes de comprometer capital para optimizar resultados."
    },
    {
      title: "Invertir sin Due Diligence",
      description: "Falta de análisis profesional y acompañamiento experto en decisiones críticas de inversión."
    }
  ];

  const faqs = [
    {
      question: "¿Qué tipos de propiedades se pueden adquirir?",
      answer: "Casas unifamiliares, parques de casas móviles, mini storage y otras opciones residenciales y comerciales adaptadas a tu perfil de inversión."
    },
    {
      question: "¿Cómo está el mercado de bienes raíces en Estados Unidos?",
      answer: "Es dinámico. La clave no es \"el mercado\" en general, sino seleccionar el mercado correcto, la clase de activo, validar supuestos y estructurar la inversión de la mejor manera para cada caso."
    },
    {
      question: "¿Pueden los extranjeros invertir en bienes raíces en Estados Unidos?",
      answer: "Sí. La diferencia la hace la estructura legal, fiscal y el proceso de compra profesional que garantiza cumplimiento normativo."
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />

      {/* ═══ HERO ═══ */}
      <section className="relative min-h-screen flex items-center pt-28 pb-20">
        <div className="absolute inset-0 -z-10">
          <img
            src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663291837994/UEcLjYyFixTUEbdp.jpeg"
            alt="Bienes Raices en Estados Unidos"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[oklch(0.08_0.03_250/0.92)] via-[oklch(0.10_0.03_250/0.85)] to-[oklch(0.08_0.03_250/0.70)]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.10_0.03_250)] via-transparent to-transparent" />
        </div>
        <div className="container relative z-10">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <span className="inline-block text-primary text-sm font-semibold tracking-[0.25em] uppercase mb-6 font-mono">
                Inversión Inmobiliaria
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-serif text-white leading-[1.1] mb-6">
                Bienes Raíces en{" "}
                <span className="gradient-text-primary">Estados Unidos</span>:{" "}
                Acceso a Oportunidades Filtradas
              </h1>
              <p className="text-lg md:text-xl text-white/70 leading-relaxed mb-10 max-w-2xl">
                Invertir en bienes raíces en Estados Unidos no se trata de "empezar": se trata de asignar capital con criterios. Desde $100,000 USD, accede a oportunidades con estructura legal, fiscal, análisis financiero y acompañamiento estratégico.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="#formulario">
                  <Button className="bg-primary hover:bg-primary-dark text-white font-semibold px-8 py-6 text-base gap-2 w-full sm:w-auto">
                    Solicitar Acceso <ArrowRight className="w-4 h-4" />
                  </Button>
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ PILARES ═══ */}
      <section className="section-darker py-24 md:py-32">
        <div className="container">
          <SectionHeading
            tag="Ventajas de Inversión"
            title="¿Por Qué Invertir en Bienes Raíces en Estados Unidos?"
            subtitle="Descubre los factores clave que hacen de Estados Unidos un destino atractivo para inversionistas latinos."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pillars.map((pillar, i) => (
              <FadeIn key={pillar.title} delay={i * 0.1}>
                <PillarCard {...pillar} />
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ ACOMPAÑAMIENTO ═══ */}
      <section className="section-dark py-24 md:py-32">
        <div className="container">
          <SectionHeading
            tag="Proceso Profesional"
            title="Acompañamiento Experto en Inversión Inmobiliaria"
            subtitle="Convertimos complejidad en decisiones claras a través de un proceso profesional y verificado."
          />
          <div className="grid md:grid-cols-2 gap-8 items-start">
            <FadeIn>
              <div className="space-y-6">
                {[
                  "Identificación de oportunidades alineadas a tu perfil (desde $100,000 USD)",
                  "Estructuración legal y fiscal antes de comprometer capital",
                  "Red verificada de aliados: bancos, desarrolladores, operadores y property managers",
                  "Revisión de variables clave: zonas, regulaciones, costos, supuestos de flujo y riesgos"
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <CheckCircle2 className="w-6 h-6 text-primary shrink-0 mt-1" />
                    <p className="text-white/70 text-lg">{item}</p>
                  </div>
                ))}
              </div>
            </FadeIn>
            <FadeIn delay={0.2}>
              <div className="bg-gradient-to-br from-primary/10 to-emerald/10 border border-primary/20 rounded-2xl p-8">
                <h3 className="text-2xl font-serif text-white mb-4">Inversión Mínima</h3>
                <div className="text-5xl font-bold text-primary mb-2">$100,000</div>
                <p className="text-white/70 mb-6">USD para acceder a oportunidades filtradas y acompañamiento profesional</p>
                <p className="text-white/50 text-sm">Todos nuestros miembros cuentan con estructura legal y fiscal optimizada para maximizar retornos.</p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ═══ ERRORES COMUNES ═══ */}
      <section className="section-darker py-24 md:py-32">
        <div className="container">
          <SectionHeading
            tag="Evita Errores"
            title="Errores Comunes que Evitamos"
            subtitle="Muchos inversionistas se equivocan no por falta de oportunidades, sino por falta de proceso e información."
          />
          <div className="grid md:grid-cols-2 gap-6">
            {commonMistakes.map((mistake, i) => (
              <FadeIn key={mistake.title} delay={i * 0.1}>
                <div className="bg-[oklch(0.15_0.03_250)] border border-red-500/20 rounded-xl p-6 hover:border-red-500/40 transition-all duration-500">
                  <div className="flex items-start gap-4">
                    <AlertCircle className="w-6 h-6 text-red-500 shrink-0 mt-1" />
                    <div>
                      <h3 className="text-lg font-serif text-white mb-2">{mistake.title}</h3>
                      <p className="text-white/60 text-sm">{mistake.description}</p>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section className="section-dark py-24 md:py-32">
        <div className="container max-w-3xl">
          <SectionHeading
            tag="Preguntas Frecuentes"
            title="Respuestas a Tus Dudas"
            subtitle="Conoce más sobre inversión inmobiliaria en Estados Unidos."
          />
          <FadeIn>
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, i) => (
                <AccordionItem key={i} value={`item-${i}`} className="bg-[oklch(0.15_0.03_250)] border border-white/5 rounded-lg px-6">
                  <AccordionTrigger className="text-white hover:text-primary transition-colors py-4">
                    <span className="text-left font-serif text-lg">{faq.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-white/70 pb-4">{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </FadeIn>
        </div>
      </section>

      {/* ═══ CRITERIOS ═══ */}
      <section className="section-darker py-24 md:py-32">
        <div className="container">
          <SectionHeading
            tag="Membresía"
            title="¿Esta Comunidad es Para Ti?"
            subtitle="Verifica si cumples con los criterios para formar parte de nuestra comunidad exclusiva."
          />
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <FadeIn>
              <div className="space-y-4">
                <h3 className="text-xl font-serif text-white mb-6">✅ Eres Candidato Si:</h3>
                {[
                  "Cuentas con capacidad de inversión desde $100,000 USD",
                  "Buscas invertir en bienes raíces en Estados Unidos",
                  "Quieres evaluar oportunidades con análisis financiero y criterios",
                  "Valoras una comunidad privada con inversionistas activos"
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <p className="text-white/70">{item}</p>
                  </div>
                ))}
              </div>
            </FadeIn>
            <FadeIn delay={0.2}>
              <div className="space-y-4">
                <h3 className="text-xl font-serif text-white mb-6">❌ No es Para Ti Si:</h3>
                {[
                  "Aún estás explorando sin capital disponible",
                  "Buscas inversiones con retorno inmediato",
                  "No tienes capacidad de inversión mínima de $100,000",
                  "Prefieres no tener acompañamiento profesional"
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    <p className="text-white/70">{item}</p>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
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
              <ProspectForm title="" />
            </FadeIn>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
