import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SectionHeading from "@/components/SectionHeading";
import { useInView } from "@/hooks/useInView";
import { IMAGES, EXTERNAL_LINKS } from "@/lib/constants";
import { openWhatsApp, WHATSAPP_PHONE, WHATSAPP_MESSAGE } from "@/lib/whatsapp";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CheckCircle2, ArrowRight, Users, Briefcase, TrendingUp, Calendar, MessageSquare, Handshake } from "lucide-react";

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

// ─── Pillar Icon ───
function PillarIcon({ icon }: { icon: string }) {
  const icons: Record<string, React.ReactNode> = {
    deal: <Briefcase className="w-6 h-6" />,
    expert: <Users className="w-6 h-6" />,
    event: <Calendar className="w-6 h-6" />,
    mentor: <MessageSquare className="w-6 h-6" />,
    conversation: <TrendingUp className="w-6 h-6" />,
    community: <Handshake className="w-6 h-6" />,
  };
  return <>{icons[icon]}</>;
}

export default function Membresia() {
  const membership_features = [
    {
      icon: "deal",
      title: "Deal Day",
      description: "De manera constante analizamos en vivo oportunidades de inversión en Estados Unidos. Cada oportunidad es filtrada por el equipo y presentada con soporte legal y financiero.",
    },
    {
      icon: "expert",
      title: "Sesiones con Expertos",
      description: "De manera mensual accedes a nuestras asambleas para resolver dudas específicas sobre inversión, estructuras legales, estrategias fiscales y análisis de proyectos.",
    },
    {
      icon: "event",
      title: "Eventos Presenciales",
      description: "Reunimos inversionistas, abogados, banqueros y especialistas para fortalecer relaciones y acelerar decisiones de nuestros miembros a lo largo del año.",
    },
    {
      icon: "mentor",
      title: "Mentorías en Tiempo Real",
      description: "Aprende directamente de inversionistas que ya han invertido en Estados Unidos. Resuelve dudas en sesiones privadas presenciales y digitales.",
    },
    {
      icon: "conversation",
      title: "Conversaciones Exclusivas",
      description: "Accede a conversaciones con empresarios, compradores de franquicias y expertos del ecosistema que comparten sus estrategias y resultados.",
    },
    {
      icon: "community",
      title: "Mesa de Dueños",
      description: "Grupo privado donde miembros con experiencia ayudan a evaluar y mejorar negociaciones con criterio operativo y financiero.",
    },
  ];

  const investment_areas = [
    {
      title: "Negocios en Funcionamiento",
      description: "Negocios operativos en sectores como servicios, distribución de autopartes y maquinaria, listos para adquirirse o escalarse con participación estratégica.",
    },
    {
      title: "Franquicias Validadas",
      description: "Con potencial de expansión, soporte de marca y procesos estandarizados, para inversionistas que buscan modelos probados.",
    },
    {
      title: "Bienes Raíces",
      description: "Oportunidades en mercados de nicho con alto potencial de crecimiento: single family homes, parques de casas móviles, mini storage y más.",
    },
  ];

  const plans = [
    {
      name: "Entry",
      price: "$10,000",
      ideal: "Empresarios que están dando sus primeros pasos en Estados Unidos",
      features: [
        "Constitución de LLC (Texas o Florida) + Registered Agent",
        "Deal Day & Deal Finding: taller intensivo presencial",
        "Estrategia de Apertura bancaria y obtención de ITIN",
        "Consulta inicial de inmigración (1 hora)",
        "Plan de negocios para Visa E-2 (USCIS-ready)",
        "Tres módulos de formación especializados",
        "Sesiones individuales con expertos",
        "Comunidad privada + eventos digitales mensuales",
        "Acceso a eventos presenciales anuales",
        "Red de beneficios y descuentos",
      ],
      value: "$19,150",
      savings: "$11,650",
    },
    {
      name: "Growth",
      price: "$15,000",
      ideal: "Inversionistas con claridad sobre su estrategia",
      features: [
        "Todo lo del Entry, más:",
        "Estrategia personalizada de acceso bancario",
        "Estrategia 1:1 para planeación patrimonial y de sucesión",
        "Acceso anticipado a oportunidades",
        "Mentoría especializada en estructuras complejas",
        "Prioridad en Deal Day",
      ],
      value: "Desde $25,000",
      savings: "$10,000+",
    },
    {
      name: "Legacy",
      price: "$25,000",
      ideal: "Inversionistas activos que buscan máximo acceso",
      features: [
        "Todo lo del Growth, más:",
        "Acceso VIP a todas las oportunidades",
        "Mentoría exclusiva con fundadores",
        "Participación en decisiones estratégicas del club",
        "Networking prioritario con inversionistas de alto nivel",
        "Asesoría personalizada continua",
      ],
      value: "Desde $40,000",
      savings: "$15,000+",
    },
  ];

  const faqs = [
    {
      question: "¿Qué tipo de oportunidades de inversión se presentan dentro de la membresía?",
      answer: "Accederás a negocios en funcionamiento, franquicias validadas y bienes raíces de diversos tipos como single family homes en mercados de alto crecimiento, parques de casas móviles en lugares estratégicos, mini storage, etc. Todas presentadas con análisis legal y financiero realizado previo a ser presentado a la comunidad.",
    },
    {
      question: "¿Cuál es la inversión mínima para participar en estas oportunidades?",
      answer: "Las oportunidades dentro del club están diseñadas para inversionistas con capacidad de inversión desde $100,000 USD, dependiendo del tipo de inversión, estructura y objetivo de la misma.",
    },
    {
      question: "¿Qué diferencia esta membresía de un curso o consultoría tradicional?",
      answer: "Esto no es formación aislada. Es una estructura de acompañamiento continuo que combina deal flow filtrado, networking, análisis real, acompañamiento experto y una red privada de inversionistas activos en Estados Unidos.",
    },
    {
      question: "¿Cómo se seleccionan los miembros?",
      answer: "Todas las solicitudes de ingreso son revisadas por nuestro equipo para mantener la exclusividad, valores e integridad del grupo. Los cupos de nuestra comunidad son limitados.",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />

      {/* ═══ HERO ═══ */}
      <section className="relative min-h-[60vh] flex items-center pt-32 pb-20">
        <div className="absolute inset-0 -z-10">
          <img src={IMAGES.hero} alt="Membresía" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[oklch(0.08_0.03_250/0.92)] via-[oklch(0.10_0.03_250/0.85)] to-[oklch(0.08_0.03_250/0.70)]" />
        </div>

        <div className="container relative z-10">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <span className="inline-block text-primary text-sm font-semibold tracking-[0.25em] uppercase mb-6 font-mono">
                Membresía Vitalicia
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white leading-[1.1] mb-6">
                Club Privado de Inversionistas en <span className="gradient-text-primary">Estados Unidos</span>
              </h1>
              <p className="text-lg md:text-xl text-white/70 leading-relaxed mb-10 max-w-2xl">
                Forma parte de una comunidad exclusiva diseñada para inversionistas que cuentan con capacidad real de inversión y buscan acceder a oportunidades filtradas con acompañamiento legal, migratorio y estratégico.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={() => openWhatsApp(WHATSAPP_PHONE, WHATSAPP_MESSAGE)}
                  className="bg-primary hover:bg-primary-dark text-white font-semibold px-8 py-6 text-base gap-2 w-full sm:w-auto"
                >
                  Solicitar Acceso <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ WHAT'S INCLUDED ═══ */}
      <section className="section-darker py-24 md:py-32">
        <div className="container">
          <SectionHeading
            tag="Estructura del Club"
            title="¿Qué Incluye tu Membresía?"
            subtitle="Una estructura integral diseñada para avanzar con claridad, estrategia y seguimiento real."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {membership_features.map((feature, i) => (
              <FadeIn key={feature.title} delay={i * 0.1}>
                <div className="group relative bg-[oklch(0.15_0.03_250)] border border-white/5 rounded-xl p-6 hover:border-primary/30 transition-all duration-500 h-full">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
                  <div className="relative">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                      <PillarIcon icon={feature.icon} />
                    </div>
                    <h3 className="text-xl font-serif text-white mb-3">{feature.title}</h3>
                    <p className="text-white/50 text-sm leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ INVESTMENT AREAS ═══ */}
      <section className="section-dark py-24 md:py-32">
        <div className="container">
          <SectionHeading
            tag="Oportunidades"
            title="Áreas de Inversión"
            subtitle="Accede a oportunidades previamente filtradas y validadas desde $100,000 USD"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {investment_areas.map((area, i) => (
              <FadeIn key={area.title} delay={i * 0.1}>
                <div className="bg-[oklch(0.15_0.03_250)] border border-white/5 rounded-xl p-8 hover:border-primary/30 transition-all duration-500">
                  <h3 className="text-2xl font-serif text-white mb-4">{area.title}</h3>
                  <p className="text-white/60 leading-relaxed">{area.description}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ MEMBERSHIP PLANS ═══ */}
      <section className="section-darker py-24 md:py-32">
        <div className="container">
          <SectionHeading
            tag="Planes"
            title="Elige tu Plan de Membresía"
            subtitle="Cada plan está diseñado para diferentes etapas de tu viaje como inversionista"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, i) => (
              <FadeIn key={plan.name} delay={i * 0.1}>
                <div className={`relative rounded-2xl p-8 border transition-all duration-500 h-full flex flex-col ${
                  plan.name === "Growth"
                    ? "bg-gradient-to-br from-primary/20 to-primary/5 border-primary/40 ring-2 ring-primary/30 scale-105 md:scale-100"
                    : "bg-[oklch(0.15_0.03_250)] border-white/5 hover:border-primary/30"
                }`}>
                  {plan.name === "Growth" && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-white px-4 py-1 rounded-full text-sm font-semibold">
                      Más Popular
                    </div>
                  )}
                  <h3 className="text-3xl font-serif text-white mb-2">Investor <span className="text-primary">{plan.name}</span></h3>
                  <div className="mb-6">
                    <div className="text-4xl font-bold text-primary mb-2">{plan.price}</div>
                    <p className="text-white/60 text-sm">{plan.ideal}</p>
                  </div>
                  <div className="mb-8 pb-8 border-b border-white/10">
                    <p className="text-white/70 text-sm"><strong>Valor total:</strong> {plan.value}</p>
                    <p className="text-primary text-sm"><strong>Ahorro:</strong> {plan.savings}</p>
                  </div>
                  <ul className="space-y-3 mb-8 flex-grow">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-white/70 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    onClick={() => openWhatsApp(WHATSAPP_PHONE, WHATSAPP_MESSAGE)}
                    className={`w-full py-3 font-semibold gap-2 ${
                      plan.name === "Growth"
                        ? "bg-primary hover:bg-primary-dark text-white"
                        : "bg-white/10 hover:bg-white/20 text-white border border-white/20"
                    }`}
                  >
                    Elegir {plan.name} <ArrowRight className="w-4 h-4" />
                  </Button>
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
            tag="Dudas Comunes"
            title="Preguntas Frecuentes"
            subtitle="Resuelve tus dudas sobre la membresía y cómo funciona el club"
          />
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, i) => (
                <AccordionItem key={i} value={`item-${i}`} className="border border-white/10 rounded-lg px-6 data-[state=open]:bg-[oklch(0.15_0.03_250)]">
                  <AccordionTrigger className="text-white hover:text-primary transition-colors py-4">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-white/60 pb-4">
                    {faq.answer}
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
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-serif text-white mb-6">
                ¿Listo para Unirte al Club?
              </h2>
              <p className="text-white/60 text-lg mb-10 leading-relaxed">
                Todas las solicitudes de ingreso son revisadas por nuestro equipo para mantener la exclusividad, valores e integridad del grupo. Los cupos son limitados.
              </p>
              <Button
                onClick={() => openWhatsApp(WHATSAPP_PHONE, WHATSAPP_MESSAGE)}
                className="bg-primary hover:bg-primary-dark text-white font-semibold px-10 py-6 text-lg gap-2"
              >
                Solicitar Acceso Ahora <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          </FadeIn>
        </div>
      </section>

      <Footer />
    </div>
  );
}
