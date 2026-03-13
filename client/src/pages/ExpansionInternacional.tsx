import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SectionHeading from "@/components/SectionHeading";

import { useInView } from "@/hooks/useInView";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowRight, Globe, TrendingUp, Briefcase, Shield, CheckCircle2, Users, Zap } from "lucide-react";

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

export default function ExpansionInternacional() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />

      {/* ═══ HERO ═══ */}
      <section className="relative min-h-screen flex items-center">
        <div className="absolute inset-0">
          <div className="w-full h-full bg-gradient-to-r from-[oklch(0.08_0.03_250/0.92)] via-[oklch(0.10_0.03_250/0.85)] to-[oklch(0.08_0.03_250/0.70)]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.10_0.03_250)] via-transparent to-transparent" />
        </div>
        <div className="container relative z-10 pt-28 pb-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <span className="inline-block text-primary text-sm font-semibold tracking-[0.25em] uppercase mb-6 font-mono">
                Internacionalización
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white leading-[1.1] mb-6">
                Expansión Internacional: Lleva tu Negocio más Allá de las Fronteras
              </h1>
              <p className="text-lg md:text-xl text-white/70 leading-relaxed mb-10 max-w-2xl">
                El crecimiento local tiene límites. Si ya consolidaste tu modelo y estás buscando nuevas oportunidades, la expansión internacional es el siguiente paso lógico y estratégico.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="bg-primary hover:bg-primary-dark text-white font-semibold px-8 py-6 text-base gap-2 w-full sm:w-auto">
                  Evalúa tu Potencial Ahora <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              className="hidden lg:block"
            >
              <div className="relative rounded-2xl overflow-hidden border-4 border-primary/30">
                <img
                  src="https://res.cloudinary.com/dgruohz6f/image/upload/v1773439196/comprando-america/UuPRQKelKRuzBwXd.jpg"
                  alt="Expansión Internacional de Empresas"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" className="w-full">
            <path d="M0 80L1440 20V80H0Z" fill="oklch(0.12 0.03 250)" />
          </svg>
        </div>
      </section>

      {/* ═══ ¿POR QUÉ APOSTAR? ═══ */}
      <section className="section-dark py-24 md:py-32">
        <div className="container">
          <SectionHeading
            tag="Oportunidad Global"
            title="¿Por Qué Apostar por la Expansión Internacional Hoy?"
            subtitle="Las empresas que crecen globalmente tienen mayor capacidad de diversificación, resistencia económica y retorno de inversión."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <TrendingUp className="w-6 h-6" />, title: "Reducir Dependencia Local", desc: "Diversifica tus ingresos en múltiples mercados" },
              { icon: <Zap className="w-6 h-6" />, title: "Multiplicar Ingresos", desc: "Accede a divisas fuertes y nuevas fuentes de revenue" },
              { icon: <Globe className="w-6 h-6" />, title: "Posicionamiento Global", desc: "Posiciona tu marca como referente internacional" },
              { icon: <Shield className="w-6 h-6" />, title: "Acceso a Recursos", desc: "Talento, tecnología y condiciones fiscales favorables" },
            ].map((item, i) => (
              <FadeIn key={item.title} delay={i * 0.1}>
                <div className="group relative bg-[oklch(0.15_0.03_250)] border border-white/5 rounded-xl p-6 hover:border-primary/30 transition-all duration-500 h-full">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
                  <div className="relative">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                      {item.icon}
                    </div>
                    <h3 className="text-lg font-serif text-white mb-3">{item.title}</h3>
                    <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ ESTRATEGIAS ═══ */}
      <section className="section-darker py-24 md:py-32">
        <div className="container">
          <SectionHeading
            tag="Metodología Probada"
            title="Estrategias de Expansión Internacional para Inversores Visionarios"
            subtitle="No todas las empresas están listas para crecer globalmente. Por eso es fundamental contar con un plan que combine datos, estructura legal y proyecciones claras."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { num: "01", title: "Diseñar Estrategias", desc: "Estrategias ajustadas a tu industria y perfil de inversión" },
              { num: "02", title: "Estudiar Viabilidad", desc: "Análisis profundo de riesgos antes de decisiones críticas" },
              { num: "03", title: "Programas de Incentivo", desc: "Acceso a visas empresariales y programas especiales" },
              { num: "04", title: "Estructura Legal", desc: "Alianzas y estructuras legales en el nuevo país" },
            ].map((item, i) => (
              <FadeIn key={item.num} delay={i * 0.1}>
                <div className="relative bg-[oklch(0.15_0.03_250)] border border-white/5 rounded-xl p-8 hover:border-primary/30 transition-all duration-500 group">
                  <span className="stat-number text-5xl text-white/5 absolute top-4 right-4 group-hover:text-primary/10 transition-colors">{item.num}</span>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
                    <Briefcase className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-serif text-white mb-3">{item.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PASOS ═══ */}
      <section className="section-dark py-24 md:py-32">
        <div className="container">
          <SectionHeading
            tag="Proceso Estructurado"
            title="Cómo Internacionalizar una Empresa Paso a Paso"
            subtitle="Internacionalizar tu empresa requiere decisión, pero también método. Te guiamos en cada etapa del proceso."
          />
          <div className="space-y-6 max-w-3xl mx-auto">
            {[
              { step: 1, title: "Diagnóstico de Preparación Interna", desc: "¿Tu empresa está lista operativa y financieramente para expandirse?" },
              { step: 2, title: "Estudio de Mercados Objetivos", desc: "Investigación profunda de mercados adecuados para tu sector" },
              { step: 3, title: "Plan Financiero y Legal", desc: "Costos, riesgos, marcos regulatorios y estrategia fiscal" },
              { step: 4, title: "Constitución Legal y Adaptación", desc: "Registro de entidad, contratación y localización del producto" },
              { step: 5, title: "Lanzamiento Controlado", desc: "Inicio de operaciones piloto con ajustes progresivos" },
            ].map((item, i) => (
              <FadeIn key={item.step} delay={i * 0.1}>
                <div className="flex gap-6 items-start">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary/20 text-primary font-serif font-bold text-lg">
                      {item.step}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-serif text-white mb-2">{item.title}</h3>
                    <p className="text-white/60 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ INVERSIONISTAS ═══ */}
      <section className="section-darker py-24 md:py-32">
        <div className="container">
          <FadeIn>
            <div className="bg-gradient-to-r from-emerald/10 to-gold/10 border border-primary/20 rounded-2xl p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-2xl md:text-3xl font-serif text-white mb-6">Inversionistas: Conviertan la Expansión en su Ventaja</h3>
                  <p className="text-white/70 mb-6 leading-relaxed">
                    Invertir en empresas en fase de crecimiento empresarial global permite entrar en etapas estratégicas con gran potencial de retorno.
                  </p>
                  <ul className="space-y-4">
                    {[
                      "Nuevas aperturas en mercados emergentes",
                      "Franquicias internacionales",
                      "Reestructuración y relocalización de operaciones",
                      "Creación de holdings y plataformas regionales",
                    ].map((benefit) => (
                      <li key={benefit} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-white/70">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex flex-col justify-center items-center">
                  <h3 className="text-2xl md:text-3xl font-serif text-white mb-6 text-center">¿Quieres Explorar Oportunidades?</h3>
                  <a href="/#membresia" className="inline-block">
                    <Button className="bg-primary hover:bg-primary-dark text-white font-semibold px-8 py-6 text-base gap-2">
                      Validar tu encaje <ArrowRight className="w-4 h-4" />
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section className="section-dark py-24 md:py-32">
        <div className="container">
          <SectionHeading
            tag="Preguntas Frecuentes"
            title="Dudas Comunes sobre Expansión Internacional"
            subtitle="Resolvemos tus preguntas sobre el proceso de internacionalización de empresas."
          />
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              {[
                {
                  q: "¿Qué es la expansión internacional?",
                  a: "Es el proceso mediante el cual una empresa extiende sus operaciones, productos o servicios más allá de su país de origen, estableciendo presencia activa en otros mercados globales.",
                },
                {
                  q: "¿Qué es la expansión del comercio internacional?",
                  a: "Se refiere al aumento del intercambio de bienes, servicios y capital entre países. Esta expansión permite mayor acceso a mercados, proveedores y clientes a nivel global.",
                },
                {
                  q: "¿Cuáles son las 4 estrategias de expansión?",
                  a: "Las principales son: Exportación directa, Licencias/franquicias, Joint ventures o asociaciones locales, e Inversión directa extranjera (IDE). Cada una tiene ventajas y niveles de riesgo distintos.",
                },
              ].map((item, i) => (
                <AccordionItem key={i} value={`item-${i}`}>
                  <AccordionTrigger className="text-white hover:text-primary transition-colors">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-white/70">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="section-darker py-24 md:py-32">
        <div className="container">
          <FadeIn>
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-serif text-white mb-6">
                No Esperes a que el Mercado Cambie: Anticípate con Expansión Internacional
              </h2>
              <p className="text-white/70 text-lg leading-relaxed mb-10">
                Si estás pensando en llevar tu empresa a otro nivel o buscas en qué invertir con proyección real, la expansión internacional puede ser tu mayor acierto. En Comprando América, ayudamos a inversores y empresarios latinoamericanos a preparar, estructurar y ejecutar su salto al mercado global.
              </p>
              <Button className="bg-primary hover:bg-primary-dark text-white font-semibold px-8 py-6 text-base gap-2">
                Agendar Consultoría <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </FadeIn>
        </div>
      </section>

      <Footer />
    </div>
  );
}
