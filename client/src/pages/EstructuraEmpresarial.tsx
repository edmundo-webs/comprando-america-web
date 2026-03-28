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
  MapPin,
  FileCheck,
  CreditCard,
  Shield,
  Briefcase,
  Users,
  MessageCircle,
  Landmark,
  Scale,
} from "lucide-react";

const CLOVER = {
  texas:
    "https://www.clover.com/pay-widgets/b3f65360-1554-4b11-9175-f415a63ff74a",
  florida: "https://link.clover.com/urlshortener/SFHYf2",
};

const WA_MSG =
  "Hola, me interesa estructurar mi empresa en Estados Unidos con Comprando América.";

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
      "Estructura Empresarial en Estados Unidos | LLC Texas & Florida | Comprando América";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute(
        "content",
        "Estructura tu empresa correctamente en Estados Unidos. LLC en Texas o Florida desde $1,499 USD con acompañamiento completo."
      );
    }
  }, []);
  return null;
}

/* ─── Checkout with Meta Pixel ─── */
function handleCheckout(state: "texas" | "florida") {
  if (typeof window !== "undefined" && (window as any).fbq) {
    (window as any).fbq("track", "InitiateCheckout", {
      value: 1499,
      currency: "USD",
    });
  }
  window.location.href = CLOVER[state];
}

/* ═══════════════════════════════════════════════════════ */

export default function EstructuraEmpresarial() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <SEOHead />
      <Navbar />

      {/* ═══ 1. HERO ═══ */}
      <section className="relative isolate min-h-[85vh] flex items-center pt-20 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0B1F3A] via-[#0B1F3A] to-[#0E2544]" />
        <div className="absolute top-1/4 right-0 w-[500px] h-[500px] rounded-full bg-blue-500/10 blur-3xl" />

        <div className="container relative z-10">
          <FadeIn>
            <div className="max-w-3xl">
              <p className="text-primary text-sm font-semibold tracking-[0.25em] uppercase mb-6 font-mono">
                Estructura Empresarial
              </p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl text-white leading-tight mb-6">
                No se trata solo de abrir una empresa en Estados Unidos.
                <br />
                <span className="text-primary">
                  Se trata de estructurarla correctamente desde el inicio.
                </span>
              </h1>
              <p className="text-white/60 text-lg md:text-xl leading-relaxed mb-8 max-w-2xl">
                Te ayudamos a construir la base legal y estratégica para operar
                o invertir en Estados Unidos, comenzando con la estructura
                adecuada.
              </p>

              <div className="flex flex-wrap gap-4 mb-10">
                <Button
                  onClick={() => handleCheckout("texas")}
                  className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-base gap-2 shadow-lg shadow-blue-600/20"
                >
                  Crear mi LLC <ArrowRight className="w-4 h-4" />
                </Button>
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
                  <CheckCircle2 className="w-4 h-4 text-primary" /> Estructura
                  correcta desde el inicio
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" /> Soporte en
                  español
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />{" "}
                  Acompañamiento estratégico
                </span>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ 2. EL PROBLEMA ═══ */}
      <section className="section-darker py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl text-white mb-6">
                Muchos empresarios abren una LLC…{" "}
                <span className="text-primary">
                  sin entender realmente cómo deben estructurarse
                </span>
              </h2>
              <p className="text-white/60 text-lg leading-relaxed mb-8">
                Abrir una empresa en Estados Unidos puede parecer sencillo. Pero
                hacerlo sin estrategia puede generar:
              </p>
              <div className="space-y-4 mb-10">
                {[
                  "Problemas fiscales por mala elección de estado o estructura",
                  "Dificultades para abrir cuentas bancarias",
                  "Estructuras mal diseñadas que limitan operación",
                  "Decisiones que frenan el crecimiento a largo plazo",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    <p className="text-white/60">{item}</p>
                  </div>
                ))}
              </div>
              <div className="bg-[#0F2847] border border-[#1E3A5F] rounded-xl p-8">
                <p className="text-white/80 text-lg font-serif">
                  Por eso, antes de abrir una LLC, es importante{" "}
                  <span className="text-primary font-semibold">
                    entender la estructura completa.
                  </span>
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ 3. CAMBIO DE ENFOQUE ═══ */}
      <section className="section-dark py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl text-white mb-6">
                La LLC es solo una parte de la estructura
              </h2>
              <p className="text-white/60 text-lg leading-relaxed mb-10">
                Una empresa en Estados Unidos no se trata solo de un registro
                legal. Implica:
              </p>
              <div className="grid sm:grid-cols-2 gap-6">
                {[
                  {
                    icon: MapPin,
                    title: "Dónde abrirla",
                    desc: "Elegir el estado correcto según tu operación y objetivos.",
                  },
                  {
                    icon: Briefcase,
                    title: "Cómo operarla",
                    desc: "Estructura operativa que permita crecer sin fricciones.",
                  },
                  {
                    icon: CreditCard,
                    title: "Cómo estructurar ingresos",
                    desc: "Planificación fiscal y bancaria desde el inicio.",
                  },
                  {
                    icon: Shield,
                    title: "Cómo preparar tu operación",
                    desc: "Base legal sólida para proteger tu patrimonio.",
                  },
                ].map((item, i) => (
                  <FadeIn key={i} delay={i * 0.1}>
                    <div className="bg-[#132D50] border border-[#1E3A5F] rounded-xl p-6 h-full hover:border-blue-500/20 transition-all">
                      <item.icon className="w-8 h-8 text-primary mb-4" />
                      <h3 className="text-lg text-white mb-2">
                        {item.title}
                      </h3>
                      <p className="text-white/50 text-sm leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </FadeIn>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ 4. ABRIR TU LLC ═══ */}
      <section className="section-darker py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="max-w-3xl mx-auto">
              <Building2 className="w-10 h-10 text-primary mb-4" />
              <h2 className="text-3xl md:text-4xl text-white mb-6">
                El primer paso: crear tu empresa en Estados Unidos
              </h2>
              <p className="text-white/60 text-lg leading-relaxed mb-8">
                La LLC (Limited Liability Company) es una de las estructuras más
                utilizadas por empresarios internacionales. Permite operar,
                facturar y estructurar actividades en Estados Unidos con
                protección patrimonial.
              </p>
              <Button
                onClick={() => handleCheckout("texas")}
                className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-base gap-2 shadow-lg shadow-blue-600/20"
              >
                Crear mi LLC <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ 5. TEXAS VS FLORIDA ═══ */}
      <section className="section-dark py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl text-white mb-4">
                Elegir el estado correcto cambia completamente la estructura
              </h2>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <FadeIn>
              <div className="bg-[#0F2847] border border-blue-500/20 rounded-2xl p-8 h-full">
                <div className="mb-6">
                  <h3 className="text-2xl font-serif text-white">Texas</h3>
                </div>
                <div className="space-y-3 mb-8">
                  {[
                    "Fuerte ecosistema empresarial",
                    "Ideal para operaciones comerciales",
                    "Comunidad empresarial latina sólida",
                    "Sin impuesto estatal sobre la renta",
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <p className="text-white/60 text-sm">{item}</p>
                    </div>
                  ))}
                </div>
                <Button
                  onClick={() => handleCheckout("texas")}
                  className="bg-primary hover:bg-primary/90 text-white gap-2 w-full"
                >
                  Crear mi LLC en Texas <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </FadeIn>

            <FadeIn delay={0.1}>
              <div className="bg-[#0F2847] border border-blue-500/20 rounded-2xl p-8 h-full">
                <div className="mb-6">
                  <h3 className="text-2xl font-serif text-white">Florida</h3>
                </div>
                <div className="space-y-3 mb-8">
                  {[
                    "Entorno fiscal atractivo para inversionistas",
                    "Ideal para negocios digitales y e-commerce",
                    "Conexión internacional fuerte (LATAM)",
                    "Sin impuesto estatal sobre la renta",
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <p className="text-white/60 text-sm">{item}</p>
                    </div>
                  ))}
                </div>
                <Button
                  onClick={() => handleCheckout("florida")}
                  className="bg-primary hover:bg-primary/90 text-white gap-2 w-full"
                >
                  Crear mi LLC en Florida <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ═══ 6. PREPARARTE PARA OPERAR ═══ */}
      <section className="section-darker py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl text-white mb-6">
                Abrir la empresa es solo el inicio.
                <br />
                <span className="text-primary">
                  Lo importante es cómo la usas.
                </span>
              </h2>
              <p className="text-white/60 text-lg leading-relaxed mb-8">
                Dependiendo de tu objetivo, la estructura cambia:
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  {
                    icon: Briefcase,
                    title: "Operar un negocio",
                    desc: "Estructura para facturar, contratar y crecer.",
                  },
                  {
                    icon: Landmark,
                    title: "Invertir en activos",
                    desc: "Vehículos para bienes raíces y fondos.",
                  },
                  {
                    icon: Shield,
                    title: "Estructurar patrimonio",
                    desc: "Protección y planificación sucesoria.",
                  },
                  {
                    icon: Users,
                    title: "Expansión empresarial",
                    desc: "Presencia en EE.UU. para empresas existentes.",
                  },
                ].map((item, i) => (
                  <FadeIn key={i} delay={i * 0.05}>
                    <div className="flex items-start gap-4 bg-[#132D50] border border-[#1E3A5F] rounded-xl p-5 hover:border-blue-500/20 transition-all">
                      <item.icon className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="text-white font-semibold text-sm mb-1">
                          {item.title}
                        </h3>
                        <p className="text-white/50 text-sm">{item.desc}</p>
                      </div>
                    </div>
                  </FadeIn>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ 7. BASE OPERATIVA ═══ */}
      <section className="section-dark py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="max-w-3xl mx-auto">
              <FileCheck className="w-10 h-10 text-primary mb-4" />
              <h2 className="text-3xl md:text-4xl text-white mb-8">
                La base para que tu empresa funcione correctamente
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  "EIN (número fiscal federal)",
                  "Preparación para cuenta bancaria",
                  "Estructura inicial completa",
                  "Documentación básica en orden",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <p className="text-white/60 text-lg">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ 8. CUÁNDO NECESITAS MÁS ═══ */}
      <section className="section-darker py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="max-w-3xl mx-auto">
              <Scale className="w-10 h-10 text-primary mb-4" />
              <h2 className="text-3xl md:text-4xl text-white mb-6">
                En algunos casos, una LLC no es suficiente
              </h2>
              <p className="text-white/60 text-lg leading-relaxed mb-8">
                Dependiendo de tu situación, puede ser necesario:
              </p>
              <div className="space-y-3 mb-8">
                {[
                  "Estructura fiscal más avanzada (holding, series LLC)",
                  "Acompañamiento estratégico para expansión",
                  "Planificación de inversión a largo plazo",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <p className="text-white/60">{item}</p>
                  </div>
                ))}
              </div>
              <p className="text-white/50 italic mb-8">
                Aquí es donde muchos empresarios cometen errores.
              </p>
              <div className="flex flex-wrap gap-4">
                <a href="/perfil">
                  <Button className="bg-primary hover:bg-primary/90 text-white gap-2">
                    Evaluar mi perfil <ArrowRight className="w-4 h-4" />
                  </Button>
                </a>
                <Button
                  variant="outline"
                  onClick={() => openWhatsApp(WHATSAPP_PHONE, WA_MSG)}
                  className="border-[#2A4A6B] text-white hover:bg-[#1E3A5F] gap-2"
                >
                  Hablar con un asesor
                </Button>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ 9. SERVICIO ═══ */}
      <section className="section-dark py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="max-w-3xl mx-auto">
              <p className="text-primary text-sm font-semibold tracking-[0.25em] uppercase mb-4 font-mono">
                Servicio
              </p>
              <h2 className="text-3xl md:text-4xl text-white mb-10">
                Nuestro servicio de estructura empresarial incluye
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  "Registro de LLC en Texas o Florida",
                  "Registered Agent incluido (1 año)",
                  "Solicitud de EIN (número fiscal)",
                  "Introducción bancaria",
                  "Asistencia para crédito empresarial",
                  "Virtual Office opcional",
                  "Acompañamiento durante todo el proceso",
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

      {/* ═══ 10. PRECIO ═══ */}
      <section className="section-darker py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="max-w-2xl mx-auto text-center">
              <p className="text-primary text-sm font-semibold tracking-[0.25em] uppercase mb-4 font-mono">
                Inversión
              </p>
              <h2 className="text-3xl md:text-4xl text-white mb-4">
                Costo del servicio
              </h2>
              <div className="inline-block bg-[#0F2847] border border-blue-500/30 rounded-2xl p-10 mb-10">
                <p className="text-5xl md:text-6xl font-serif text-white font-bold mb-2">
                  $1,499{" "}
                  <span className="text-white/50 text-2xl font-normal">
                    USD
                  </span>
                </p>
                <p className="text-white/50 text-sm">
                  Pago único · Estructura completa
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-4">
                <Button
                  onClick={() => handleCheckout("texas")}
                  className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-base gap-2 shadow-lg shadow-blue-600/20"
                >
                  Crear mi LLC en Texas <ArrowRight className="w-4 h-4" />
                </Button>
                <Button
                  onClick={() => handleCheckout("florida")}
                  className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-base gap-2 shadow-lg shadow-blue-600/20"
                >
                  Crear mi LLC en Florida <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ 11. TESTIMONIOS ═══ */}
      <section className="section-dark py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-serif text-white">
                Empresarios que ya estructuraron su empresa en Estados Unidos
              </h2>
            </div>
          </FadeIn>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              {
                name: "Carlos M.",
                from: "Monterrey, MX",
                text: "Estructurar mi LLC fue más sencillo de lo que esperaba. El equipo me guió en cada paso y hoy estoy operando desde Texas.",
              },
              {
                name: "Sofía R.",
                from: "Bogotá, CO",
                text: "Necesitaba una estructura para invertir en bienes raíces. Me ayudaron a elegir Florida y a tener todo en orden fiscal.",
              },
              {
                name: "Diego A.",
                from: "CDMX, MX",
                text: "No solo abrieron mi LLC — me explicaron cómo usarla correctamente. Eso marca la diferencia.",
              },
            ].map((t, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="bg-[#132D50] border border-[#1E3A5F] rounded-xl p-6 h-full">
                  <p className="text-white/60 text-sm leading-relaxed mb-6 italic">
                    "{t.text}"
                  </p>
                  <div>
                    <p className="text-white font-semibold text-sm">
                      {t.name}
                    </p>
                    <p className="text-white/50 text-xs">{t.from}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 12. FAQ ═══ */}
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
                    q: "¿Puedo abrir una LLC sin vivir en Estados Unidos?",
                    a: "Sí. No necesitas residencia, visa ni ciudadanía para abrir una LLC. Miles de empresarios internacionales operan empresas en EE.UU. de forma remota. Solo necesitas la estructura correcta desde el inicio.",
                  },
                  {
                    q: "¿Cuánto tarda el proceso?",
                    a: "El registro de la LLC toma entre 5-15 días hábiles dependiendo del estado. El EIN se gestiona inmediatamente después. El proceso completo (LLC + EIN + documentación) generalmente se completa en 2-3 semanas.",
                  },
                  {
                    q: "¿Qué incluye el servicio de $1,499?",
                    a: "Incluye registro de LLC, Registered Agent por un año, solicitud de EIN, introducción bancaria, asistencia para crédito empresarial, Virtual Office opcional y acompañamiento durante todo el proceso. Todo en español.",
                  },
                  {
                    q: "¿Texas o Florida? ¿Cuál me conviene?",
                    a: "Depende de tu objetivo. Texas es ideal si buscas operar un negocio con ecosistema empresarial fuerte. Florida es mejor para inversiones, e-commerce y conexión con Latinoamérica. Ambos estados no tienen impuesto estatal sobre la renta. Si no estás seguro, nuestro equipo te asesora.",
                  },
                  {
                    q: "¿Puedo abrir cuenta bancaria desde mi país?",
                    a: "Te preparamos toda la documentación necesaria y te damos introducción bancaria. Dependiendo del banco, algunos permiten apertura remota y otros requieren presencia. Te guiamos en ambos escenarios.",
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

      {/* ═══ 13. CTA FINAL ═══ */}
      <section className="section-dark py-24 md:py-32">
        <div className="container">
          <FadeIn>
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl text-white mb-6">
                Empieza a estructurar tu empresa correctamente
              </h2>
              <p className="text-white/60 text-lg mb-10">
                Evita errores y construye una base sólida desde el inicio.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button
                  onClick={() => handleCheckout("texas")}
                  className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-base gap-2 shadow-lg shadow-blue-600/20"
                >
                  Crear mi LLC <ArrowRight className="w-4 h-4" />
                </Button>
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

      </a>

      {/* ═══ STICKY CTA MOBILE ═══ */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden bg-background border-t border-[#1E3A5F] p-4 z-40">
        <button
          onClick={() => handleCheckout("texas")}
          className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 rounded-lg transition-all"
        >
          Crear mi LLC — $1,499 USD
        </button>
      </div>

      <Footer />
    </div>
  );
}
