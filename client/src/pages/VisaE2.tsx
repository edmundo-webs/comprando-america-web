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
  XCircle,
  CheckCircle2,
  Building2,
  DollarSign,
  Briefcase,
  FileCheck,
  Users,
  MessageCircle,
  Shield,
  Target,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";

const WA_MSG =
  "Hola, me interesa saber más sobre el proceso de visa E-2 y estructura de inversión.";

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
      "Visa E-2 Inversión en Estados Unidos | Guía Estratégica | Comprando América";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute(
        "content",
        "La visa E-2 no es un trámite. Es el resultado de una estructura de inversión bien diseñada. Entiende cómo funciona realmente y si aplica para tu perfil."
      );
    }
  }, []);
  return null;
}

/* ═══════════════════════════════════════════════════════ */

export default function VisaE2() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <SEOHead />
      <Navbar />

      {/* ═══ 1. HERO ═══ */}
      <section className="relative isolate min-h-[85vh] flex items-center pt-20 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://lh3.googleusercontent.com/d/1g5ApkdXmFYicSGapOeC8pji80OYNhTyi=w1920" alt="Joven empresario en evento de inversión" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B1F3A]/90 via-[#0B1F3A]/80 to-[#0B1F3A]/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F3A] via-transparent to-[#0B1F3A]/30" />
        </div>

        <div className="container relative z-10">
          <FadeIn>
            <div className="max-w-3xl">
              <p className="text-primary text-sm font-semibold tracking-[0.25em] uppercase mb-6 font-mono">
                Visa E-2 · Inversión
              </p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl text-white leading-tight mb-6">
                La visa E-2 no se obtiene aplicando…
                <br />
                <span className="text-primary">
                  Se obtiene estructurando correctamente tu inversión en Estados
                  Unidos
                </span>
              </h1>
              <p className="text-white/60 text-lg md:text-xl leading-relaxed mb-8 max-w-2xl">
                Entiende cómo funciona realmente la visa E-2 y cómo se conecta
                con inversión, empresa y estrategia.
              </p>

              <div className="flex flex-wrap gap-4 mb-10">
                <a href="/perfil">
                  <Button className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-base gap-2 shadow-lg shadow-blue-600/20">
                    Evaluar mi perfil <ArrowRight className="w-4 h-4" />
                  </Button>
                </a>
                <Button
                  variant="outline"
                  onClick={() => openWhatsApp(WHATSAPP_PHONE, WA_MSG)}
                  className="border-[#2A4A6B] text-white hover:bg-[#1E3A5F] px-8 py-6 text-base gap-2"
                >
                  Hablar con un asesor
                </Button>
              </div>

              <div className="flex flex-wrap gap-6 text-white/50 text-sm">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" /> Información
                  clara
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" /> Enfoque
                  estratégico
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" /> Sin
                  promesas irreales
                </span>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ 2. EL ERROR COMÚN ═══ */}
      <section className="section-darker py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl text-white mb-6">
                Muchos creen que la visa E-2 es un trámite migratorio
              </h2>
              <p className="text-white/60 text-lg leading-relaxed mb-8">
                Y ese es el primer error. La visa E-2 no se trata de llenar
                formularios. Se trata de:
              </p>
              <div className="space-y-4 mb-10">
                {[
                  "Tener una inversión real y documentable",
                  "Estructurar correctamente un negocio en EE.UU.",
                  "Demostrar intención operativa clara",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <p className="text-white/60 text-lg">{item}</p>
                  </div>
                ))}
              </div>
              <div className="bg-[#0F2847] border border-blue-500/20 rounded-xl p-8">
                <p className="text-white/80 text-lg font-serif">
                  La visa es{" "}
                  <span className="text-primary font-semibold">
                    consecuencia
                  </span>
                  , no punto de partida.
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ 3. QUÉ ES REALMENTE ═══ */}
      <section className="section-dark py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl text-white mb-6">
                La visa E-2 es una visa basada en inversión
              </h2>
              <p className="text-white/60 text-lg leading-relaxed mb-8">
                Permite a empresarios operar un negocio en Estados Unidos
                siempre que exista:
              </p>
              <div className="grid sm:grid-cols-3 gap-6">
                {[
                  {
                    icon: DollarSign,
                    title: "Inversión real",
                    desc: "Capital comprometido en un negocio activo en EE.UU.",
                  },
                  {
                    icon: Building2,
                    title: "Negocio activo",
                    desc: "Empresa operando o lista para operar con plan claro.",
                  },
                  {
                    icon: FileCheck,
                    title: "Estructura clara",
                    desc: "Documentación legal y fiscal organizada correctamente.",
                  },
                ].map((item, i) => (
                  <FadeIn key={i} delay={i * 0.1}>
                    <div className="bg-[#132D50] border border-[#1E3A5F] rounded-xl p-6 text-center h-full hover:border-blue-500/20 transition-all">
                      <item.icon className="w-8 h-8 text-primary mx-auto mb-4" />
                      <h3 className="text-white text-lg mb-2">
                        {item.title}
                      </h3>
                      <p className="text-white/50 text-sm">{item.desc}</p>
                    </div>
                  </FadeIn>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ 4. QUÉ NO ES ═══ */}
      <section className="section-darker py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl text-white mb-8">
                Lo que la visa E-2{" "}
                <span className="text-red-400">NO</span> es
              </h2>
              <div className="space-y-4">
                {[
                  "No es automática — requiere cumplir con criterios específicos",
                  "No es comprar una visa — no existe esa opción",
                  "No es solo abrir una LLC — la empresa es solo una parte",
                  "No garantiza aprobación — cada caso es diferente",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <p className="text-white/60 text-lg">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Photo break ── */}
      <section className="relative h-64 md:h-80 overflow-hidden">
        <img src="https://lh3.googleusercontent.com/d/18YEBJnh06dYaZ8ZsvxqEpcuFtaikz5-x=w1920" alt="Presentación sobre requisitos de visa E-2 y exportación" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F3A] via-[#0B1F3A]/30 to-[#0B1F3A]" />
      </section>

      {/* ═══ 5. CÓMO FUNCIONA ═══ */}
      <section className="section-dark py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-serif text-white">
                Cómo se construye una visa E-2
              </h2>
            </div>
          </FadeIn>

          <div className="max-w-4xl mx-auto">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  step: "1",
                  icon: Building2,
                  title: "Estructura empresarial",
                  desc: "Crear la base legal correcta para operar.",
                },
                {
                  step: "2",
                  icon: DollarSign,
                  title: "Inversión real",
                  desc: "Capital comprometido y documentado.",
                },
                {
                  step: "3",
                  icon: Briefcase,
                  title: "Operación del negocio",
                  desc: "Demostrar actividad e intención operativa.",
                },
                {
                  step: "4",
                  icon: FileCheck,
                  title: "Proceso migratorio",
                  desc: "La visa como resultado natural del proceso.",
                },
              ].map((item, i) => (
                <FadeIn key={i} delay={i * 0.1}>
                  <div className="relative bg-[#132D50] border border-[#1E3A5F] rounded-xl p-6 text-center h-full hover:border-blue-500/20 transition-all">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-primary text-white text-sm font-bold flex items-center justify-center">
                      {item.step}
                    </div>
                    <item.icon className="w-8 h-8 text-primary mx-auto mb-3 mt-4" />
                    <h3 className="text-white text-base mb-2">
                      {item.title}
                    </h3>
                    <p className="text-white/50 text-sm">{item.desc}</p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 6. DÓNDE FALLA LA MAYORÍA ═══ */}
      <section className="section-darker py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="max-w-3xl mx-auto">
              <AlertTriangle className="w-10 h-10 text-amber-400 mb-4" />
              <h2 className="text-3xl md:text-4xl text-white mb-8">
                Por qué muchas personas fallan en el proceso
              </h2>
              <div className="space-y-4">
                {[
                  "Elegir mal el tipo de negocio o inversión",
                  "Crear una estructura legal inadecuada",
                  "No tener estrategia de operación clara",
                  "Pensar solo en la visa, no en el negocio",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <p className="text-white/60 text-lg">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ 7. EL ENFOQUE CORRECTO ═══ */}
      <section className="section-dark py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="max-w-3xl mx-auto text-center">
              <Target className="w-10 h-10 text-primary mx-auto mb-4" />
              <h2 className="text-3xl md:text-4xl text-white mb-6">
                El enfoque no es la visa…{" "}
                <span className="text-primary">es la estructura</span>
              </h2>
              <p className="text-white/60 text-lg leading-relaxed">
                Cuando la inversión y la empresa están bien diseñadas, la visa
                se vuelve una consecuencia natural. El objetivo es construir
                algo sólido — no perseguir un documento.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ 8. COMPRANDO AMÉRICA ═══ */}
      <section className="section-darker py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl text-white mb-6">
                Dónde entra Comprando América en este proceso
              </h2>
              <p className="text-white/60 text-lg leading-relaxed mb-8">
                Comprando América no es una agencia migratoria. Es un ecosistema
                donde empresarios pueden:
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  "Acceder a oportunidades de inversión filtradas",
                  "Estructurar su empresa correctamente",
                  "Conectar con expertos y comunidad",
                  "Tomar decisiones informadas",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <p className="text-white/60">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ 9-10. PARA QUIÉN ES / NO ES ═══ */}
      <section className="section-dark py-20 md:py-28">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <FadeIn>
              <div className="bg-[#132D50] border border-blue-500/20 rounded-2xl p-8 h-full">
                <h2 className="text-2xl text-white mb-6">
                  Este proceso es para personas que:
                </h2>
                <div className="space-y-4">
                  {[
                    "Tienen capital disponible para invertir",
                    "Buscan operar o expandirse en EE.UU.",
                    "Entienden que es un proceso estratégico",
                    "Están dispuestas a construir algo real",
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <p className="text-white/60 text-sm">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.1}>
              <div className="bg-[#132D50] border border-red-500/20 rounded-2xl p-8 h-full">
                <h2 className="text-2xl text-white mb-6">
                  No es para quienes:
                </h2>
                <div className="space-y-4">
                  {[
                    "Buscan soluciones rápidas o atajos",
                    "No tienen intención real de invertir",
                    'Quieren "comprar una visa"',
                    "No están dispuestos a seguir un proceso",
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <XCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                      <p className="text-white/60 text-sm">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ═══ 11. CTA INTERMEDIO ═══ */}
      <section className="section-darker py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl text-white mb-6">
                ¿Tu perfil puede encajar en este tipo de estructura?
              </h2>
              <p className="text-white/60 text-lg mb-10">
                Evalúa tu situación antes de tomar decisiones.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a href="/perfil">
                  <Button className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-base gap-2 shadow-lg shadow-blue-600/20">
                    Evaluar mi perfil <ArrowRight className="w-4 h-4" />
                  </Button>
                </a>
                <Button
                  variant="outline"
                  onClick={() => openWhatsApp(WHATSAPP_PHONE, WA_MSG)}
                  className="border-[#2A4A6B] text-white hover:bg-[#1E3A5F] px-8 py-6 text-base gap-2"
                >
                  Hablar por WhatsApp
                </Button>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ 12. CAMINOS POSIBLES ═══ */}
      <section className="section-dark py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-serif text-white">
                Dependiendo de tu perfil, existen diferentes caminos
              </h2>
            </div>
          </FadeIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              {
                icon: TrendingUp,
                title: "Inversión en negocio",
                desc: "Adquirir o crear un negocio operativo en EE.UU.",
              },
              {
                icon: Building2,
                title: "Adquisición",
                desc: "Comprar un negocio existente con historial.",
              },
              {
                icon: Shield,
                title: "Estructura empresarial",
                desc: "LLC + operación + base fiscal desde cero.",
              },
              {
                icon: Users,
                title: "Comunidad estratégica",
                desc: "Oportunidades dentro de redes de inversionistas.",
              },
            ].map((item, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="bg-[#132D50] border border-[#1E3A5F] rounded-xl p-6 text-center h-full hover:border-blue-500/20 transition-all">
                  <item.icon className="w-8 h-8 text-primary mx-auto mb-3" />
                  <h3 className="text-white text-base mb-2">
                    {item.title}
                  </h3>
                  <p className="text-white/50 text-sm">{item.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 13. CONEXIÓN OPORTUNIDADES ═══ */}
      <section className="section-darker py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl text-white mb-6">
                La inversión es la base del proceso
              </h2>
              <p className="text-white/60 text-lg leading-relaxed mb-8">
                Muchos empresarios acceden a oportunidades de inversión dentro
                de redes estratégicas que les permiten tomar decisiones con
                mayor criterio y respaldo.
              </p>
              <a href="/oportunidades-de-inversion-en-estados-unidos">
                <Button className="bg-primary hover:bg-primary/90 text-white gap-2">
                  Ver oportunidades disponibles{" "}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ 14. CONEXIÓN LLC ═══ */}
      <section className="section-dark py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl text-white mb-6">
                La estructura empresarial es el punto de partida
              </h2>
              <p className="text-white/60 text-lg leading-relaxed mb-8">
                Antes de pensar en la visa, necesitas una empresa bien
                estructurada. Ese es el primer paso concreto.
              </p>
              <a href="/estructura-empresarial-en-estados-unidos">
                <Button className="bg-primary hover:bg-primary/90 text-white gap-2">
                  Crear mi empresa en Estados Unidos{" "}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ 15. FAQ ═══ */}
      <section className="section-darker py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-serif text-white text-center mb-12">
                Preguntas frecuentes
              </h2>
              <Accordion type="single" collapsible className="space-y-4">
                {[
                  {
                    q: "¿Cuánto dinero se necesita para una visa E-2?",
                    a: "No existe un monto mínimo oficial. Sin embargo, la inversión debe ser 'sustancial' en relación con el costo total del negocio. En la práctica, inversiones por debajo de $80,000–$100,000 USD suelen ser difíciles de sustentar. Lo importante no es solo el monto — es cómo se estructura y documenta la inversión.",
                  },
                  {
                    q: "¿La visa E-2 está garantizada?",
                    a: "No. Ninguna visa está garantizada. La visa E-2 depende de múltiples factores: el tipo de inversión, la estructura del negocio, la documentación presentada y la evaluación del oficial consular. Por eso es fundamental tener una estructura sólida antes de aplicar.",
                  },
                  {
                    q: "¿Necesito vivir en Estados Unidos para aplicar?",
                    a: "No necesitas vivir en EE.UU. para iniciar el proceso. Puedes estructurar la empresa y la inversión de forma remota. Sin embargo, la visa E-2 sí requiere que tengas intención de dirigir y desarrollar el negocio en territorio estadounidense.",
                  },
                  {
                    q: "¿Qué tipo de negocio funciona para la visa E-2?",
                    a: "La visa E-2 aplica para diversos tipos de negocios: restaurantes, franquicias, servicios profesionales, e-commerce, bienes raíces operativos, entre otros. Lo fundamental es que sea un negocio real, activo y con potencial de generar empleos e ingresos.",
                  },
                ].map((faq, i) => (
                  <AccordionItem
                    key={i}
                    value={`faq-${i}`}
                    className="bg-[#132D50] border border-[#1E3A5F] rounded-xl px-6"
                  >
                    <AccordionTrigger className="text-white text-left hover:no-underline py-5">
                      {faq.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-white/60 leading-relaxed pb-5">
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ 16. CTA FINAL ═══ */}
      <section className="section-dark py-24 md:py-32">
        <div className="container">
          <FadeIn>
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl text-white mb-6">
                Entiende si este camino puede aplicar para ti
              </h2>
              <p className="text-white/60 text-lg mb-4">
                La visa E-2 no es para todos.
              </p>
              <p className="text-white/50 mb-10">
                Pero cuando existe la estructura correcta, puede ser una opción
                viable.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a href="/perfil">
                  <Button className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-base gap-2 shadow-lg shadow-blue-600/20">
                    Evaluar mi perfil <ArrowRight className="w-4 h-4" />
                  </Button>
                </a>
                <Button
                  variant="outline"
                  onClick={() => openWhatsApp(WHATSAPP_PHONE, WA_MSG)}
                  className="border-[#2A4A6B] text-white hover:bg-[#1E3A5F] px-8 py-6 text-base gap-2"
                >
                  Hablar con un asesor
                </Button>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      <Footer />
    </div>
  );
}
