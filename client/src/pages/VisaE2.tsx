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
  Shield,
  Target,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";

const WA_MSG = "Hola, me interesa saber más sobre el proceso de visa E-2 y estructura de inversión.";

/* ─── FadeIn ─── */
function FadeIn({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const { ref, isInView } = useInView();
  return (
    <motion.div ref={ref} initial={false} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay, ease: "easeOut" }} className={className}>
      {children}
    </motion.div>
  );
}

/* ─── SEO ─── */
import SEOHead from "@/components/SEOHead";
import { INVESTOR_SEO, INVESTOR_FAQS, INVESTOR_SCHEMA } from "@shared/investor-search";
const PAGE_SEO = { ...INVESTOR_SEO, schema: INVESTOR_SCHEMA };

/* ─── Photos ─── */
const HERO_IMAGE = "https://lh3.googleusercontent.com/d/1OUXlN1giz2Et67lrb9L1oQNwQsBCqmGo=w1920";
const E2_SLIDE = "https://lh3.googleusercontent.com/d/18YEBJnh06dYaZ8ZsvxqEpcuFtaikz5-x=w1920"; // E-2 requirements slide
const AUDIENCE = "https://lh3.googleusercontent.com/d/1gnZX2RiYD4M29nQmqwcsN0k13db74LmV=w1920"; // packed room

export default function VisaE2() {
  return (
    <div className="min-h-screen bg-[#0B1F3A] text-white overflow-x-hidden">
      <SEOHead {...PAGE_SEO} />
      <Navbar />

      {/* ═══ 1. HERO ═══ */}
      <section className="relative min-h-[85vh] flex items-center pt-20 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <img src={HERO_IMAGE} alt="Joven empresario en evento de inversión" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B1F3A]/95 via-[#0B1F3A]/80 to-[#0B1F3A]/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F3A] via-transparent to-[#0B1F3A]/30" />
        </div>

        <div className="container relative z-10">
          <FadeIn>
            <div className="max-w-3xl">
              <p className="text-blue-400 text-sm font-semibold tracking-[0.25em] uppercase mb-6 font-mono">Visa E-2 · Inversión</p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl text-white leading-tight mb-6">
                Visa E-2 para empresarios mexicanos
                <br />
                <span className="text-sky-300">Evalúa el negocio antes de mudarte a Estados Unidos</span>
              </h1>
              <p className="text-slate-200 text-lg md:text-xl leading-relaxed mb-8 max-w-2xl">
                Si eres empresario mexicano o latino y quieres invertir y vivir en Estados Unidos, empieza por evaluar el negocio, tu papel como operador y la viabilidad del proyecto migratorio. Comprando América te ayuda a ordenar las decisiones empresariales; la elegibilidad y el trámite se revisan con un abogado de inmigración.
              </p>

              <div className="flex flex-wrap gap-4 mb-10">
                <a href="https://comprandoamerica.com/gps">
                  <Button className="bg-primary hover:bg-blue-600 text-white px-8 py-6 text-base gap-2 shadow-lg shadow-blue-600/25">
                    Evaluar mi perfil <ArrowRight className="w-4 h-4" />
                  </Button>
                </a>
                <Button variant="outline" onClick={() => openWhatsApp(WHATSAPP_PHONE, WA_MSG, "visa-e2-hero-whatsapp", "/visa-e2")} className="border-slate-600 text-white hover:bg-white/10 px-8 py-6 text-base gap-2">
                  Hablar con un asesor
                </Button>
              </div>

              <div className="flex flex-wrap gap-6 text-slate-500 text-sm">
                <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> Información clara</span>
                <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> Enfoque estratégico</span>
                <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> Sin promesas irreales</span>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ 2. EL ERROR COMÚN — ☀️ BLANCO ═══ */}
      <section className="bg-[#F5F7FA] py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl text-[#0B1F3A] mb-6">Muchos creen que la visa E-2 es un trámite migratorio</h2>
              <p className="text-[#4B5563] text-lg leading-relaxed mb-8">Y ese es el primer error. La visa E-2 no se trata de llenar formularios. Se trata de:</p>
              <div className="space-y-4 mb-10">
                {[
                  "Tener una inversión real y documentable",
                  "Estructurar correctamente un negocio en Estados Unidos",
                  "Demostrar intención operativa clara",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <p className="text-[#374151] text-lg">{item}</p>
                  </div>
                ))}
              </div>
              <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
                <p className="text-[#0B1F3A] text-lg">
                  La visa es <span className="text-primary font-semibold">consecuencia</span>, no punto de partida.
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ 3. QUÉ ES REALMENTE — navy ═══ */}
      <section className="bg-[#0E2544] py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl text-white mb-4">La visa E-2 es una visa basada en inversión</h2>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto">Permite a empresarios operar un negocio en Estados Unidos siempre que exista:</p>
            </div>
          </FadeIn>

          <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { icon: DollarSign, title: "Inversión real", desc: "Capital comprometido en un negocio activo en Estados Unidos" },
              { icon: Building2, title: "Negocio activo", desc: "Empresa operando o lista para operar con plan claro." },
              { icon: FileCheck, title: "Estructura clara", desc: "Documentación legal y fiscal organizada correctamente." },
            ].map((item, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="bg-[#0F2847] border border-[#1E3A5F] rounded-xl p-6 text-center h-full hover:border-blue-500/30 transition-all">
                  <item.icon className="w-8 h-8 text-blue-400 mx-auto mb-4" />
                  <h3 className="text-white text-lg font-semibold mb-2">{item.title}</h3>
                  <p className="text-slate-400 text-sm">{item.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 4. QUÉ NO ES — ☀️ BLANCO ═══ */}
      <section className="bg-white py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl text-[#0B1F3A] mb-8">
                Lo que la visa E-2 <span className="text-red-500">NO</span> es
              </h2>
              <div className="space-y-4">
                {[
                  "No es automática — requiere cumplir con criterios específicos",
                  "No es comprar una visa — no existe esa opción",
                  "No es solo abrir una LLC — la empresa es solo una parte",
                  "No garantiza aprobación — cada caso es diferente",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-[#4B5563] text-lg">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>


      {/* ═══ 5. CÓMO SE CONSTRUYE — navy ═══ */}
      <section className="bg-[#0E2544] py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl text-white">Cómo se construye una visa E-2</h2>
            </div>
          </FadeIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { step: "1", icon: Building2, title: "Estructura empresarial", desc: "Crear la base legal correcta para operar." },
              { step: "2", icon: DollarSign, title: "Inversión real", desc: "Capital comprometido y documentado." },
              { step: "3", icon: Briefcase, title: "Operación del negocio", desc: "Demostrar actividad e intención operativa." },
              { step: "4", icon: FileCheck, title: "Proceso migratorio", desc: "La visa como resultado natural del proceso." },
            ].map((item, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="relative bg-[#0F2847] border border-[#1E3A5F] rounded-xl p-6 text-center h-full hover:border-blue-500/30 transition-all">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-primary text-white text-sm font-bold flex items-center justify-center">{item.step}</div>
                  <item.icon className="w-8 h-8 text-blue-400 mx-auto mb-3 mt-4" />
                  <h3 className="text-white text-base font-semibold mb-2">{item.title}</h3>
                  <p className="text-slate-400 text-sm">{item.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 6. DÓNDE FALLA + ENFOQUE — ☀️ BLANCO ═══ */}
      <section className="bg-[#F5F7FA] py-20 md:py-28">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <FadeIn>
              <div>
                <AlertTriangle className="w-8 h-8 text-blue-500 mb-4" />
                <h2 className="text-2xl text-[#0B1F3A] font-semibold mb-6">Por qué muchas personas fallan</h2>
                <div className="space-y-4">
                  {[
                    "Elegir mal el tipo de negocio o inversión",
                    "Crear una estructura legal inadecuada",
                    "No tener estrategia de operación clara",
                    "Pensar solo en la visa, no en el negocio",
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                      <p className="text-[#4B5563]">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.1}>
              <div>
                <Target className="w-8 h-8 text-primary mb-4" />
                <h2 className="text-2xl text-[#0B1F3A] font-semibold mb-6">El enfoque correcto</h2>
                <p className="text-[#4B5563] text-lg leading-relaxed mb-4">
                  Una empresa bien diseñada ayuda a sustentar el proyecto. La elegibilidad y la aprobación migratoria requieren una evaluación independiente y nunca son automáticas.
                </p>
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                  <p className="text-[#0B1F3A] font-semibold">El objetivo es construir algo sólido — no perseguir un documento.</p>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ═══ 7. COMPRANDO AMÉRICA — navy ═══ */}
      <section className="bg-[#0B1F3A] py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl text-white mb-6">Dónde entra Comprando América en este proceso</h2>
              <p className="text-slate-400 text-lg leading-relaxed mb-8">
                Comprando América no es una agencia migratoria. Es un ecosistema donde empresarios pueden:
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  "Acceder a oportunidades de inversión filtradas",
                  "Estructurar su empresa correctamente",
                  "Conectar con expertos y comunidad",
                  "Tomar decisiones informadas",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <p className="text-slate-300">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ 8. PARA QUIÉN ES / NO ES — ☀️ BLANCO ═══ */}
      <section className="bg-white py-20 md:py-28">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <FadeIn>
              <div className="bg-[#0B1F3A] border border-[#1E3A5F] rounded-2xl p-8 h-full">
                <h2 className="text-2xl text-white font-semibold mb-6">Este proceso es para personas que:</h2>
                <div className="space-y-4">
                  {["Tienen capital disponible para invertir", "Buscan operar o expandirse en Estados Unidos", "Entienden que es un proceso estratégico", "Están dispuestas a construir algo real"].map((item, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                      <p className="text-slate-300 text-sm">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.1}>
              <div className="bg-[#F5F7FA] border border-gray-200 rounded-2xl p-8 h-full">
                <h2 className="text-2xl text-[#6B7280] font-semibold mb-6">No es para quienes:</h2>
                <div className="space-y-4">
                  {["Buscan soluciones rápidas o atajos", "No tienen intención real de invertir", "Quieren \"comprar una visa\"", "No están dispuestos a seguir un proceso"].map((item, i) => (
                    <div key={i} className="flex items-start gap-2">
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

      {/* ═══ 9. CAMINOS — navy ═══ */}
      <section className="bg-[#0E2544] py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl text-white">Dependiendo de tu perfil, existen diferentes caminos</h2>
            </div>
          </FadeIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { icon: TrendingUp, title: "Inversión en negocio", desc: "Adquirir o crear un negocio operativo en Estados Unidos" },
              { icon: Building2, title: "Adquisición", desc: "Comprar un negocio existente con historial." },
              { icon: Shield, title: "Estructura empresarial", desc: "LLC + operación + base fiscal desde cero." },
              { icon: Users, title: "Comunidad estratégica", desc: "Oportunidades dentro de redes de inversionistas." },
            ].map((item, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="bg-[#0F2847] border border-[#1E3A5F] rounded-xl p-6 text-center h-full hover:border-blue-500/30 transition-all">
                  <item.icon className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                  <h3 className="text-white text-base font-semibold mb-2">{item.title}</h3>
                  <p className="text-slate-400 text-sm">{item.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>


      {/* ═══ 10. CONEXIONES — ☀️ BLANCO ═══ */}
      <section className="bg-[#F5F7FA] py-20 md:py-28">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <FadeIn>
              <div className="bg-white border border-gray-200 rounded-xl p-8 h-full shadow-sm">
                <h3 className="text-xl text-[#0B1F3A] font-semibold mb-4">La inversión es la base del proceso</h3>
                <p className="text-[#4B5563] text-sm leading-relaxed mb-6">
                  Muchos empresarios acceden a oportunidades de inversión dentro de redes estratégicas que les permiten tomar decisiones con mayor criterio.
                </p>
                <a href="/oportunidades-de-inversion-en-estados-unidos">
                  <Button className="bg-[#0B1F3A] hover:bg-[#0E2544] text-white gap-2 w-full">Ver oportunidades <ArrowRight className="w-4 h-4" /></Button>
                </a>
              </div>
            </FadeIn>
            <FadeIn delay={0.1}>
              <div className="bg-white border border-gray-200 rounded-xl p-8 h-full shadow-sm">
                <h3 className="text-xl text-[#0B1F3A] font-semibold mb-4">La estructura es el punto de partida</h3>
                <p className="text-[#4B5563] text-sm leading-relaxed mb-6">
                  Antes de pensar en la visa, necesitas una empresa bien estructurada. Ese es el primer paso concreto.
                </p>
                <a href="/estructura-empresarial-en-estados-unidos">
                  <Button className="bg-[#0B1F3A] hover:bg-[#0E2544] text-white gap-2 w-full">Crear mi empresa <ArrowRight className="w-4 h-4" /></Button>
                </a>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ═══ 11. FAQ — navy ═══ */}
      <section className="bg-[#0B1F3A] py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl text-white text-center mb-12">Preguntas frecuentes</h2>
              <div className="space-y-4">{INVESTOR_FAQS.map(faq => (
                <details key={faq.q} className="bg-[#0F2847] border border-[#1E3A5F] rounded-xl p-6">
                  <summary className="cursor-pointer text-white font-semibold">{faq.q}</summary>
                  <p className="text-slate-300 leading-relaxed mt-4">{faq.a}</p>
                </details>
              ))}</div>
              <p className="mt-8 text-sm text-slate-300">Información revisada el 19 de septiembre de 2026. Fuentes: <a className="underline" href="https://travel.state.gov/content/travel/en/us-visas/employment/treaty-trader-investor-visa-e.html">Departamento de Estado: visa E-2</a> y <a className="underline" href="https://travel.state.gov/content/travel/en/us-visas/visa-information-resources/fees/treaty.html">países con tratado</a>. Información general; no sustituye asesoría legal individual.</p>
              <p className="mt-4 text-sm text-slate-300">Conoce <a className="underline" href="/quienes-somos">quiénes somos</a> y escucha nuestras conversaciones sobre inversión en el <a className="underline" href="/podcast">podcast de Comprando América</a>.</p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ 12. CTA FINAL — deep navy ═══ */}
      <section className="bg-[#091A30] py-24 md:py-32">
        <div className="container">
          <FadeIn>
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl text-white mb-4">Entiende si este camino puede aplicar para ti</h2>
              <p className="text-slate-400 mb-2">La visa E-2 no es para todos.</p>
              <p className="text-slate-500 text-sm mb-10">Pero cuando existe la estructura correcta, puede ser una opción viable.</p>
              <div className="flex flex-wrap justify-center gap-4">
                <a href="https://comprandoamerica.com/gps">
                  <Button className="bg-primary hover:bg-blue-600 text-white px-8 py-6 text-base gap-2 shadow-lg shadow-blue-600/25">
                    Evaluar mi perfil <ArrowRight className="w-4 h-4" />
                  </Button>
                </a>
                <Button variant="outline" onClick={() => openWhatsApp(WHATSAPP_PHONE, WA_MSG, "visa-e2-bottom-whatsapp", "/visa-e2")} className="border-slate-600 text-white hover:bg-white/10 px-8 py-6 text-base gap-2">
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
