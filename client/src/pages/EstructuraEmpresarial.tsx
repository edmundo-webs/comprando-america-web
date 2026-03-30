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
  Landmark,
  Scale,
} from "lucide-react";

const CLOVER = {
  texas: "https://www.clover.com/pay-widgets/b3f65360-1554-4b11-9175-f415a63ff74a",
  florida: "https://link.clover.com/urlshortener/SFHYf2",
};

const WA_MSG = "Hola, me interesa estructurar mi empresa en Estados Unidos con Comprando América.";

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
import SEOHead from "@/components/SEOHead";
const PAGE_SEO = {
  title: "Estructura Empresarial en Estados Unidos | LLC Texas & Florida | Comprando Am\u00e9rica",
  description: "Estructura tu empresa correctamente en Estados Unidos. LLC en Texas o Florida desde $1,499 USD con acompa\u00f1amiento completo.",
  path: "/estructura-empresarial-en-estados-unidos",
  schema: {"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": "\u00bfQu\u00e9 es una LLC y para qu\u00e9 sirve?", "acceptedAnswer": {"@type": "Answer", "text": "Una LLC protege tu patrimonio personal, permite abrir cuentas bancarias e invertir en d\u00f3lares desde cualquier pa\u00eds."}}, {"@type": "Question", "name": "\u00bfEs mejor LLC en Texas o Florida?", "acceptedAnswer": {"@type": "Answer", "text": "Ambos estados no tienen impuesto estatal sobre la renta. Texas ofrece mayor protecci\u00f3n patrimonial. Florida es ideal para bienes ra\u00edces."}}, {"@type": "Question", "name": "\u00bfPuedo abrir una LLC sin vivir en Estados Unidos?", "acceptedAnswer": {"@type": "Answer", "text": "S\u00ed. No necesitas visa ni residencia. Con pasaporte y un Registered Agent puedes estructurar tu LLC de forma remota."}}]},
};

/* ─── Checkout with Meta Pixel ─── */
function handleCheckout(state: "texas" | "florida") {
  if (typeof window !== "undefined" && (window as any).fbq) {
    (window as any).fbq("track", "InitiateCheckout", { value: 1499, currency: "USD" });
  }
  window.location.href = CLOVER[state];
}

/* ─── Photos ─── */
const HERO_IMAGE = "https://lh3.googleusercontent.com/d/1RK1ICQKrETpZBFYH_NoZmnYzMULHREYu=w1920"; // rooftop team
const TAX_SLIDE = "https://lh3.googleusercontent.com/d/1rvNkomqY_CrfxTge9dQJBT1RdPdw08hM=w1920"; // tax presentation
const AUDIENCE = "https://lh3.googleusercontent.com/d/1gnZX2RiYD4M29nQmqwcsN0k13db74LmV=w1920"; // packed room

export default function EstructuraEmpresarial() {
  return (
    <div className="min-h-screen bg-[#0B1F3A] text-white overflow-x-hidden">
      <SEOHead {...PAGE_SEO} />
      <Navbar />

      {/* ═══ 1. HERO ═══ */}
      <section className="relative min-h-[85vh] flex items-center pt-20 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <img src={HERO_IMAGE} alt="Equipo empresarial Comprando América" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B1F3A]/95 via-[#0B1F3A]/80 to-[#0B1F3A]/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F3A] via-transparent to-[#0B1F3A]/30" />
        </div>

        <div className="container relative z-10">
          <FadeIn>
            <div className="max-w-3xl">
              <p className="text-blue-400 text-sm font-semibold tracking-[0.25em] uppercase mb-6 font-mono">Estructura Empresarial</p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl text-white leading-tight mb-6">
                No se trata solo de abrir una empresa en Estados Unidos.
                <br />
                <span className="text-primary">Se trata de estructurarla correctamente desde el inicio.</span>
              </h1>
              <p className="text-slate-400 text-lg md:text-xl leading-relaxed mb-8 max-w-2xl">
                Te ayudamos a construir la base legal y estratégica para operar o invertir en Estados Unidos, comenzando con la estructura adecuada.
              </p>

              <div className="flex flex-wrap gap-4 mb-10">
                <Button onClick={() => handleCheckout("texas")} className="bg-primary hover:bg-blue-600 text-white px-8 py-6 text-base gap-2 shadow-lg shadow-blue-600/25">
                  Crear mi LLC <ArrowRight className="w-4 h-4" />
                </Button>
                <Button variant="outline" onClick={() => openWhatsApp(WHATSAPP_PHONE, WA_MSG)} className="border-slate-600 text-white hover:bg-white/10 px-8 py-6 text-base gap-2">
                  Hablar con un asesor
                </Button>
              </div>

              <div className="flex flex-wrap gap-6 text-slate-500 text-sm">
                <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> Estructura correcta desde el inicio</span>
                <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> Soporte en español</span>
                <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> Acompañamiento estratégico</span>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ 2. EL PROBLEMA — ☀️ BLANCO ═══ */}
      <section className="bg-[#F5F7FA] py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl text-[#0B1F3A] mb-6">
                Muchos empresarios abren una LLC… <span className="text-primary">sin entender realmente cómo deben estructurarse</span>
              </h2>
              <p className="text-[#4B5563] text-lg leading-relaxed mb-8">
                Abrir una empresa en Estados Unidos puede parecer sencillo. Pero hacerlo sin estrategia puede generar:
              </p>
              <div className="space-y-4 mb-10">
                {[
                  "Problemas fiscales por mala elección de estado o estructura",
                  "Dificultades para abrir cuentas bancarias",
                  "Estructuras mal diseñadas que limitan operación",
                  "Decisiones que frenan el crecimiento a largo plazo",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-[#4B5563]">{item}</p>
                  </div>
                ))}
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
                <p className="text-[#0B1F3A] text-lg">
                  Por eso, antes de abrir una LLC, es importante <span className="text-primary font-semibold">entender la estructura completa.</span>
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ 3. CAMBIO DE ENFOQUE — navy ═══ */}
      <section className="bg-[#0E2544] py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl text-white mb-4">La LLC es solo una parte de la estructura</h2>
              <p className="text-slate-400 text-lg leading-relaxed max-w-2xl mx-auto">
                Una empresa en Estados Unidos no se trata solo de un registro legal. Implica:
              </p>
            </div>
          </FadeIn>

          <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              { icon: MapPin, title: "Dónde abrirla", desc: "Elegir el estado correcto según tu operación y objetivos." },
              { icon: Briefcase, title: "Cómo operarla", desc: "Estructura operativa que permita crecer sin fricciones." },
              { icon: CreditCard, title: "Cómo estructurar ingresos", desc: "Planificación fiscal y bancaria desde el inicio." },
              { icon: Shield, title: "Cómo preparar tu operación", desc: "Base legal sólida para proteger tu patrimonio." },
            ].map((item, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="bg-[#132D50] border border-[#1E3A5F] rounded-xl p-6 h-full hover:border-blue-500/30 transition-all">
                  <item.icon className="w-8 h-8 text-blue-400 mb-4" />
                  <h3 className="text-lg text-white font-semibold mb-2">{item.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 4. PRIMER PASO — ☀️ BLANCO ═══ */}
      <section className="bg-white py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="max-w-3xl mx-auto">
              <Building2 className="w-10 h-10 text-primary mb-4" />
              <h2 className="text-3xl md:text-4xl text-[#0B1F3A] mb-6">
                El primer paso: crear tu empresa en Estados Unidos
              </h2>
              <p className="text-[#4B5563] text-lg leading-relaxed mb-8">
                La LLC (Limited Liability Company) es una de las estructuras más utilizadas por empresarios internacionales. Permite operar, facturar y estructurar actividades en Estados Unidos con protección patrimonial.
              </p>
              <Button onClick={() => handleCheckout("texas")} className="bg-primary hover:bg-blue-600 text-white px-8 py-6 text-base gap-2 shadow-lg shadow-blue-600/20">
                Crear mi LLC <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Photo break — tax slide ── */}
      <section className="relative h-64 md:h-80 overflow-hidden">
        <img src={TAX_SLIDE} alt="Presentación sobre estructura fiscal" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0E2544] via-transparent to-white/80" />
      </section>

      {/* ═══ 5. TEXAS VS FLORIDA — navy ═══ */}
      <section className="bg-[#0E2544] py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl text-white">Elegir el estado correcto cambia completamente la estructura</h2>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <FadeIn>
              <div className="bg-[#132D50] border border-blue-500/20 rounded-2xl p-8 h-full">
                <h3 className="text-2xl text-white font-bold mb-6">Texas</h3>
                <div className="space-y-3 mb-8">
                  {["Fuerte ecosistema empresarial", "Ideal para operaciones comerciales", "Comunidad empresarial latina sólida", "Sin impuesto estatal sobre la renta"].map((item, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                      <p className="text-slate-300 text-sm">{item}</p>
                    </div>
                  ))}
                </div>
                <Button onClick={() => handleCheckout("texas")} className="bg-primary hover:bg-blue-600 text-white gap-2 w-full">
                  Crear mi LLC en Texas <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </FadeIn>

            <FadeIn delay={0.1}>
              <div className="bg-[#132D50] border border-blue-500/20 rounded-2xl p-8 h-full">
                <h3 className="text-2xl text-white font-bold mb-6">Florida</h3>
                <div className="space-y-3 mb-8">
                  {["Entorno fiscal atractivo para inversionistas", "Ideal para negocios digitales y e-commerce", "Conexión internacional fuerte (LATAM)", "Sin impuesto estatal sobre la renta"].map((item, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                      <p className="text-slate-300 text-sm">{item}</p>
                    </div>
                  ))}
                </div>
                <Button onClick={() => handleCheckout("florida")} className="bg-primary hover:bg-blue-600 text-white gap-2 w-full">
                  Crear mi LLC en Florida <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ═══ 6. CÓMO LA USAS — ☀️ BLANCO ═══ */}
      <section className="bg-[#F5F7FA] py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl text-[#0B1F3A] mb-6">
                Abrir la empresa es solo el inicio. <span className="text-primary">Lo importante es cómo la usas.</span>
              </h2>
              <p className="text-[#4B5563] text-lg leading-relaxed mb-8">Dependiendo de tu objetivo, la estructura cambia:</p>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { icon: Briefcase, title: "Operar un negocio", desc: "Estructura para facturar, contratar y crecer." },
                  { icon: Landmark, title: "Invertir en activos", desc: "Vehículos para bienes raíces y fondos." },
                  { icon: Shield, title: "Estructurar patrimonio", desc: "Protección y planificación sucesoria." },
                  { icon: Users, title: "Expansión empresarial", desc: "Presencia en EE.UU. para empresas existentes." },
                ].map((item, i) => (
                  <FadeIn key={i} delay={i * 0.05}>
                    <div className="flex items-start gap-4 bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-all shadow-sm">
                      <item.icon className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="text-[#0B1F3A] font-semibold text-sm mb-1">{item.title}</h3>
                        <p className="text-[#6B7280] text-sm">{item.desc}</p>
                      </div>
                    </div>
                  </FadeIn>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ 7. BASE OPERATIVA + CUÁNDO NECESITAS MÁS — navy ═══ */}
      <section className="bg-[#0B1F3A] py-20 md:py-28">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <FadeIn>
              <div>
                <FileCheck className="w-8 h-8 text-primary mb-4" />
                <h2 className="text-2xl text-white font-semibold mb-6">La base para que tu empresa funcione</h2>
                <div className="space-y-3">
                  {["EIN (número fiscal federal)", "Preparación para cuenta bancaria", "Estructura inicial completa", "Documentación básica en orden"].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                      <p className="text-slate-300">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.1}>
              <div>
                <Scale className="w-8 h-8 text-primary mb-4" />
                <h2 className="text-2xl text-white font-semibold mb-6">En algunos casos, una LLC no es suficiente</h2>
                <div className="space-y-3 mb-6">
                  {["Estructura fiscal más avanzada (holding, series LLC)", "Acompañamiento estratégico para expansión", "Planificación de inversión a largo plazo"].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                      <p className="text-slate-300">{item}</p>
                    </div>
                  ))}
                </div>
                <p className="text-slate-500 italic text-sm">Aquí es donde muchos empresarios cometen errores.</p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ═══ 8. SERVICIO — ☀️ BLANCO ═══ */}
      <section className="bg-white py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="max-w-3xl mx-auto">
              <p className="text-primary text-sm font-semibold tracking-[0.25em] uppercase mb-4 font-mono">Servicio</p>
              <h2 className="text-3xl md:text-4xl text-[#0B1F3A] mb-10">Nuestro servicio de estructura empresarial incluye</h2>
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
                    <p className="text-[#374151]">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ 9. PRECIO — navy ═══ */}
      <section className="bg-[#0E2544] py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="max-w-2xl mx-auto text-center">
              <p className="text-blue-400 text-sm font-semibold tracking-[0.25em] uppercase mb-4 font-mono">Inversión</p>
              <h2 className="text-3xl md:text-4xl text-white mb-6">Costo del servicio</h2>
              <div className="inline-block bg-[#132D50] border border-blue-500/30 rounded-2xl p-10 mb-10">
                <p className="text-5xl md:text-6xl text-white font-bold mb-2">
                  $1,499 <span className="text-slate-500 text-2xl font-normal">USD</span>
                </p>
                <p className="text-slate-500 text-sm">Pago único · Estructura completa</p>
              </div>
              <div className="flex flex-wrap justify-center gap-4">
                <Button onClick={() => handleCheckout("texas")} className="bg-primary hover:bg-blue-600 text-white px-8 py-6 text-base gap-2 shadow-lg shadow-blue-600/25">
                  Crear mi LLC en Texas <ArrowRight className="w-4 h-4" />
                </Button>
                <Button onClick={() => handleCheckout("florida")} className="bg-primary hover:bg-blue-600 text-white px-8 py-6 text-base gap-2 shadow-lg shadow-blue-600/25">
                  Crear mi LLC en Florida <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Photo break — audience ── */}
      <section className="relative h-64 md:h-80 overflow-hidden">
        <img src={AUDIENCE} alt="Comunidad de empresarios" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#F5F7FA] via-transparent to-[#0E2544]" />
      </section>

      {/* ═══ 10. TESTIMONIOS — ☀️ BLANCO ═══ */}
      <section className="bg-[#F5F7FA] py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl text-[#0B1F3A]">Empresarios que ya estructuraron su empresa</h2>
            </div>
          </FadeIn>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { name: "Carlos M.", from: "Monterrey, MX", text: "Estructurar mi LLC fue más sencillo de lo que esperaba. El equipo me guió en cada paso y hoy estoy operando desde Texas." },
              { name: "Sofía R.", from: "Bogotá, CO", text: "Necesitaba una estructura para invertir en bienes raíces. Me ayudaron a elegir Florida y a tener todo en orden fiscal." },
              { name: "Diego A.", from: "CDMX, MX", text: "No solo abrieron mi LLC — me explicaron cómo usarla correctamente. Eso marca la diferencia." },
            ].map((t, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="bg-white border border-gray-200 rounded-xl p-6 h-full shadow-sm hover:shadow-md transition-all">
                  <p className="text-[#4B5563] text-sm leading-relaxed mb-6 italic">"{t.text}"</p>
                  <div>
                    <p className="text-[#0B1F3A] font-semibold text-sm">{t.name}</p>
                    <p className="text-[#6B7280] text-xs">{t.from}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 11. FAQ — navy ═══ */}
      <section className="bg-[#0B1F3A] py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl text-white text-center mb-12">Preguntas frecuentes</h2>
              <Accordion type="single" collapsible className="space-y-4">
                {[
                  { q: "¿Puedo abrir una LLC sin vivir en Estados Unidos?", a: "Sí. No necesitas residencia, visa ni ciudadanía para abrir una LLC. Miles de empresarios internacionales operan empresas en EE.UU. de forma remota. Solo necesitas la estructura correcta desde el inicio." },
                  { q: "¿Cuánto tarda el proceso?", a: "El registro de la LLC toma entre 5-15 días hábiles dependiendo del estado. El EIN se gestiona inmediatamente después. El proceso completo (LLC + EIN + documentación) generalmente se completa en 2-3 semanas." },
                  { q: "¿Qué incluye el servicio de $1,499?", a: "Incluye registro de LLC, Registered Agent por un año, solicitud de EIN, introducción bancaria, asistencia para crédito empresarial, Virtual Office opcional y acompañamiento durante todo el proceso. Todo en español." },
                  { q: "¿Texas o Florida? ¿Cuál me conviene?", a: "Depende de tu objetivo. Texas es ideal si buscas operar un negocio con ecosistema empresarial fuerte. Florida es mejor para inversiones, e-commerce y conexión con Latinoamérica. Ambos estados no tienen impuesto estatal sobre la renta. Si no estás seguro, nuestro equipo te asesora." },
                  { q: "¿Puedo abrir cuenta bancaria desde mi país?", a: "Te preparamos toda la documentación necesaria y te damos introducción bancaria. Dependiendo del banco, algunos permiten apertura remota y otros requieren presencia. Te guiamos en ambos escenarios." },
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

      {/* ═══ 12. CTA FINAL — deep navy ═══ */}
      <section className="bg-[#091A30] py-24 md:py-32">
        <div className="container">
          <FadeIn>
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl text-white mb-6">Empieza a estructurar tu empresa correctamente</h2>
              <p className="text-slate-400 text-lg mb-10">Evita errores y construye una base sólida desde el inicio.</p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button onClick={() => handleCheckout("texas")} className="bg-primary hover:bg-blue-600 text-white px-8 py-6 text-base gap-2 shadow-lg shadow-blue-600/25">
                  Crear mi LLC <ArrowRight className="w-4 h-4" />
                </Button>
                <Button variant="outline" onClick={() => openWhatsApp(WHATSAPP_PHONE, WA_MSG)} className="border-slate-600 text-white hover:bg-white/10 px-8 py-6 text-base gap-2">
                  Hablar con un asesor
                </Button>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ STICKY CTA MOBILE ═══ */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden bg-[#0B1F3A] border-t border-[#1E3A5F] p-4 z-40">
        <button onClick={() => handleCheckout("texas")} className="w-full bg-primary hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition-all">
          Crear mi LLC — $1,499 USD
        </button>
      </div>

      <Footer />
    </div>
  );
}
