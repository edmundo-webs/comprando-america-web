import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SectionHeading from "@/components/SectionHeading";
import ProspectForm from "@/components/ProspectForm";
import { useInView } from "@/hooks/useInView";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { BookOpen, Target, Briefcase, TrendingUp, CheckCircle2, ArrowRight } from "lucide-react";

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

// ─── Module Card ───
function ModuleCard({ number, title, topics }: { number: string; title: string; topics: string[] }) {
  return (
    <div className="group relative bg-[oklch(0.15_0.03_250)] border border-white/5 rounded-xl p-8 hover:border-primary/30 transition-all duration-500 h-full">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
      <div className="relative">
        <div className="w-14 h-14 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
          <span className="text-xl font-bold">{number}</span>
        </div>
        <h3 className="text-xl font-serif text-white mb-6">{title}</h3>
        <ul className="space-y-3">
          {topics.map((topic, i) => (
            <li key={i} className="flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-1" />
              <span className="text-white/70 text-sm">{topic}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function Formacion() {
  const modules = [
    {
      number: "01",
      title: "Detección de Oportunidades",
      icon: Target,
      topics: [
        "Encontrando 'la zona de genialidad'",
        "Dónde y cómo buscar oportunidades de compra de negocios",
        "Cómo abordar a dueños de negocios que no están en venta",
        "Especificaciones de compra y diferenciación de oportunidades",
        "Due diligence y pasos para comprar un negocio",
        "Cómo financiar un negocio que vas a adquirir"
      ]
    },
    {
      number: "02",
      title: "Evaluación de Oportunidades",
      icon: BookOpen,
      topics: [
        "Cómo conciliar la valuación antes de hacer una oferta",
        "Métodos para valuar una empresa",
        "Cómo calcular el SDE de un negocio",
        "10 indicadores de valor en un negocio",
        "Cuándo usar LOI vs APA en la oferta",
        "Pasos en la negociación y cierre de una oferta"
      ]
    },
    {
      number: "03",
      title: "Operación de Negocios Adquiridos",
      icon: Briefcase,
      topics: [
        "Claves para administrar tu negocio en Estados Unidos",
        "Cómo adquirir clientes para tu negocio según su giro",
        "Cómo aumentar el valor de los clientes actuales",
        "Internacionalización: reducir gastos fijos para eficientar operación",
        "Cómo encontrar a las personas correctas para la operación",
        "Delegar: cómo y cuándo operar tu negocio a distancia"
      ]
    },
    {
      number: "04",
      title: "Crecimiento de Negocios Adquiridos",
      icon: TrendingUp,
      topics: [
        "¿Para qué crecer tu negocio? Diferencias culturales Estados Unidos vs Latinoamérica",
        "Etapas de los negocios en Estados Unidos según su giro",
        "Traer el futuro al presente en la evolución de tu negocio",
        "Estrategias de financiamiento para el crecimiento",
        "Digitalización de procesos y adquisición de clientes",
        "Diferenciación de negocios y construcción de marca"
      ]
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
                Educación Estratégica
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white leading-[1.1] mb-6">
                Aprende Cómo Invertir en{" "}
                <span className="gradient-text-primary">Estados Unidos</span> con Expertos
              </h1>
              <p className="text-lg md:text-xl text-white/70 leading-relaxed mb-8 max-w-2xl">
                Como miembro de Comprando América, accedes a una formación estratégica diseñada exclusivamente para latinos que quieren invertir, expandirse o establecerse en Estados Unidos con respaldo y visión empresarial.
              </p>
              <p className="text-base text-white/60 leading-relaxed mb-10 max-w-2xl">
                Este contenido grabado forma parte de tu membresía anual y te entrega las bases que necesitas para tomar decisiones informadas, entender las estructuras legales y financieras del mercado, y avanzar con acompañamiento real.
              </p>
              <a href="#formulario">
                <Button className="bg-primary hover:bg-primary-dark text-white font-semibold px-8 py-6 text-base gap-2">
                  Solicita Más Información <ArrowRight className="w-4 h-4" />
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
                  src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663291837994/dfTXGLgkYJpoVIzE.png"
                  alt="Educación Estratégica"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ TEMARIO ═══ */}
      <section className="section-darker py-24 md:py-32">
        <div className="container">
          <SectionHeading
            tag="Contenido Grabado"
            title="Temario del Programa Educativo"
            subtitle="Cuatro módulos estratégicos que cubren todo lo que necesitas saber para invertir exitosamente en Estados Unidos."
          />
          <div className="grid md:grid-cols-2 gap-8">
            {modules.map((module, i) => (
              <FadeIn key={module.number} delay={i * 0.1}>
                <ModuleCard
                  number={module.number}
                  title={module.title}
                  topics={module.topics}
                />
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ BENEFICIOS ═══ */}
      <section className="section-dark py-24 md:py-32">
        <div className="container">
          <SectionHeading
            tag="Ventajas"
            title="¿Qué Obtienes con Esta Formación?"
            subtitle="Acceso a contenido exclusivo diseñado para acelerar tu aprendizaje y decisiones de inversión."
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                title: "Contenido Grabado",
                description: "Acceso a videos educativos que puedes ver a tu ritmo, en cualquier momento."
              },
              {
                title: "Estructura Legal & Fiscal",
                description: "Entiende cómo estructurar tus inversiones para optimizar resultados fiscales."
              },
              {
                title: "Análisis Financiero",
                description: "Aprende a evaluar oportunidades con criterios profesionales y verificados."
              },
              {
                title: "Acompañamiento Real",
                description: "Acceso a expertos y comunidad de inversionistas para resolver dudas."
              },
              {
                title: "Operación de Negocios",
                description: "Estrategias prácticas para administrar y crecer negocios adquiridos."
              },
              {
                title: "Red de Aliados",
                description: "Conexión con bancos, desarrolladores, operadores y property managers verificados."
              }
            ].map((benefit, i) => (
              <FadeIn key={benefit.title} delay={i * 0.05}>
                <div className="bg-[oklch(0.15_0.03_250)] border border-white/5 rounded-xl p-6 hover:border-primary/30 transition-all duration-500">
                  <h3 className="text-lg font-serif text-white mb-3">{benefit.title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed">{benefit.description}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="section-darker py-24 md:py-32">
        <div className="container">
          <FadeIn>
            <div className="bg-gradient-to-r from-primary/10 to-emerald/10 border border-primary/20 rounded-2xl p-12 md:p-16 text-center">
              <h2 className="text-3xl md:text-4xl font-serif text-white mb-6">
                ¿Listo para Comenzar tu Formación?
              </h2>
              <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
                Completa el formulario y accede a toda la información sobre nuestro programa educativo. Nuestro equipo se pondrá en contacto contigo para guiarte en el siguiente paso.
              </p>
              <a href="https://comprandoamerica.com/formacion/" target="_blank" rel="noopener noreferrer">
                <Button className="bg-primary hover:bg-primary-dark text-white font-semibold px-8 py-6 text-base gap-2">
                  Conoce el Programa Completo <ArrowRight className="w-4 h-4" />
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
              <ProspectForm title="" />
            </FadeIn>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
