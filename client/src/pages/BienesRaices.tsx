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
  Home,
  TrendingUp,
  DollarSign,
  Globe,
  Building2,
  Users,
  CheckCircle2,
  XCircle,
  ArrowRight,
  AlertTriangle,
} from "lucide-react";

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
function SEOHead() {
  useEffect(() => {
    document.title = "Bienes Raíces en Estados Unidos | Inversión Inmobiliaria | Comprando América";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "Inversión inmobiliaria en Estados Unidos desde $100,000 USD. Accede a oportunidades filtradas con estructura legal, fiscal y acompañamiento estratégico.");
  }, []);
  return null;
}

const WA_MSG = "Hola, me interesa invertir en bienes raíces en Estados Unidos.";

/* ─── Photos ─── */
const HERO_BG = "https://res.cloudinary.com/dgruohz6f/image/upload/v1773439251/comprando-america/fUiLqaRcYvhafLZf.webp";
const INSPECTION = "https://res.cloudinary.com/dofccqypz/image/upload/v1774537564/comprando-america/eventos/uefjxoxi5trojtoeivha.jpg"; // aerial
const AUDIENCE = "https://lh3.googleusercontent.com/d/1gnZX2RiYD4M29nQmqwcsN0k13db74LmV=w1920";

export default function BienesRaices() {
  return (
    <div className="min-h-screen bg-[#0B1F3A] text-white overflow-x-hidden">
      <SEOHead />
      <Navbar />

      {/* ═══ 1. HERO ═══ */}
      <section className="relative min-h-[85vh] flex items-center pt-20 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <img src={HERO_BG} alt="Inversión inmobiliaria en Estados Unidos" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B1F3A]/95 via-[#0B1F3A]/85 to-[#0B1F3A]/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F3A] via-transparent to-[#0B1F3A]/30" />
        </div>

        <div className="container relative z-10">
          <FadeIn>
            <div className="max-w-3xl">
              <p className="text-blue-400 text-sm font-semibold tracking-[0.25em] uppercase mb-6 font-mono">Inversión Inmobiliaria</p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl text-white leading-tight mb-6">
                Bienes Raíces en <span className="gradient-text-primary">Estados Unidos</span>: Acceso a Oportunidades Filtradas
              </h1>
              <p className="text-slate-400 text-lg md:text-xl leading-relaxed mb-8 max-w-2xl">
                Invertir en bienes raíces en Estados Unidos no se trata de "empezar": se trata de asignar capital con criterios. Desde $100,000 USD, accede a oportunidades con estructura profesional.
              </p>

              <div className="flex flex-wrap gap-4 mb-10">
                <a href="/perfil">
                  <Button className="bg-primary hover:bg-blue-600 text-white px-8 py-6 text-base gap-2 shadow-lg shadow-blue-600/25">
                    Evaluar mi perfil <ArrowRight className="w-4 h-4" />
                  </Button>
                </a>
                <Button variant="outline" onClick={() => openWhatsApp(WHATSAPP_PHONE, WA_MSG)} className="border-slate-600 text-white hover:bg-white/10 px-8 py-6 text-base gap-2">
                  Hablar con un asesor
                </Button>
              </div>

              <div className="flex flex-wrap gap-6 text-slate-500 text-sm">
                <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> Oportunidades filtradas</span>
                <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> Estructura legal y fiscal</span>
                <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> Desde $100,000 USD</span>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ 2. VIDEO — ☀️ BLANCO ═══ */}
      <section className="bg-[#F5F7FA] py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="text-center mb-10">
              <p className="text-primary text-sm font-semibold tracking-[0.2em] uppercase mb-4 font-mono">Oportunidades Reales</p>
              <h2 className="text-3xl md:text-4xl text-[#0B1F3A]">Explora el Mercado Inmobiliario</h2>
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <div className="max-w-4xl mx-auto">
              <div className="rounded-2xl overflow-hidden border border-gray-200 bg-black shadow-lg">
                <video
                  src="https://res.cloudinary.com/dgruohz6f/video/upload/v1773439533/comprando-america/GmMnpoMeKYAWvyKd.mp4"
                  controls
                  className="w-full h-auto"
                />
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ 3. POR QUÉ EE.UU. — navy ═══ */}
      <section className="bg-[#0E2544] py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="text-center mb-12">
              <p className="text-blue-400 text-sm font-semibold tracking-[0.2em] uppercase mb-4 font-mono">Ventajas de Inversión</p>
              <h2 className="text-3xl md:text-4xl text-white">¿Por qué invertir en bienes raíces en Estados Unidos?</h2>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { icon: Building2, title: "Estabilidad del mercado", desc: "Entorno económico y legal confiable, ideal para proteger tu capital y obtener rendimientos sostenibles." },
              { icon: Home, title: "Diversidad de opciones", desc: "Desde propiedades residenciales hasta complejos comerciales, terrenos o desarrollos adaptables a tu perfil." },
              { icon: TrendingUp, title: "Flexibilidad en la inversión", desc: "Invierte de manera directa, a través de sociedades, o mediante fondos especializados." },
              { icon: DollarSign, title: "Alta demanda en alquiler", desc: "Las principales ciudades mantienen demanda constante de vivienda en renta, generando ingresos pasivos." },
              { icon: Globe, title: "Ciudades con alto potencial", desc: "Zonas emergentes y desarrolladas con condiciones atractivas por crecimiento demográfico y económico." },
              { icon: Users, title: "Accesibilidad para extranjeros", desc: "En Estados Unidos los extranjeros pueden adquirir propiedades sin restricciones complejas." },
            ].map((item, i) => (
              <FadeIn key={i} delay={i * 0.08}>
                <div className="bg-[#132D50] border border-[#1E3A5F] rounded-xl p-6 h-full hover:border-blue-500/30 transition-all">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center mb-4">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">{item.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 4. ACOMPAÑAMIENTO — ☀️ BLANCO ═══ */}
      <section className="bg-white py-20 md:py-28">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            <FadeIn>
              <div>
                <p className="text-primary text-sm font-semibold tracking-[0.2em] uppercase mb-4 font-mono">Proceso Profesional</p>
                <h2 className="text-3xl md:text-4xl text-[#0B1F3A] mb-8">Acompañamiento experto en inversión inmobiliaria</h2>
                <div className="space-y-5">
                  {[
                    "Identificación de oportunidades alineadas a tu perfil (desde $100,000 USD)",
                    "Estructuración legal y fiscal antes de comprometer capital",
                    "Red verificada de aliados: bancos, desarrolladores, operadores",
                    "Revisión de variables clave: zonas, regulaciones, flujo y riesgos",
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <p className="text-[#374151]">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.1}>
              <div className="bg-[#0B1F3A] border border-[#1E3A5F] rounded-2xl p-10 text-center">
                <p className="text-blue-400 text-sm font-semibold tracking-[0.2em] uppercase mb-4 font-mono">Inversión Mínima</p>
                <p className="text-5xl md:text-6xl font-bold text-white mb-2">$100,000</p>
                <p className="text-slate-500 text-sm mb-6">USD para acceder a oportunidades filtradas</p>
                <p className="text-slate-400 text-sm leading-relaxed">Todos nuestros miembros cuentan con estructura legal y fiscal optimizada para maximizar retornos.</p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── Photo break — aerial inspection ── */}
      <section className="relative h-64 md:h-80 overflow-hidden">
        <img src={INSPECTION} alt="Vista aérea viaje de inspección inmobiliaria" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0E2544] via-transparent to-white/80" />
      </section>

      {/* ═══ 5. ERRORES COMUNES — navy ═══ */}
      <section className="bg-[#0E2544] py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="text-center mb-12">
              <p className="text-blue-400 text-sm font-semibold tracking-[0.2em] uppercase mb-4 font-mono">Evita Errores</p>
              <h2 className="text-3xl md:text-4xl text-white">Errores comunes que evitamos</h2>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              { title: "Comprar sin tesis de inversión", desc: "Muchos inversionistas adquieren propiedades sin criterios claros ni análisis previo de viabilidad." },
              { title: "No diferenciar riesgos por zona", desc: "Cada zona, tipo de activo y operación tiene riesgos específicos que deben evaluarse cuidadosamente." },
              { title: "Ignorar estructura legal y fiscal", desc: "La estructura legal y fiscal debe definirse antes de comprometer capital para optimizar resultados." },
              { title: "Invertir sin due diligence", desc: "Falta de análisis profesional y acompañamiento experto en decisiones críticas de inversión." },
            ].map((item, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="bg-[#132D50] border border-red-500/20 rounded-xl p-6 hover:border-red-500/30 transition-all">
                  <div className="flex items-start gap-4">
                    <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-white font-semibold mb-2">{item.title}</h3>
                      <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 6. PARA QUIÉN — ☀️ BLANCO ═══ */}
      <section className="bg-[#F5F7FA] py-20 md:py-28">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <FadeIn>
              <div className="bg-[#0B1F3A] border border-[#1E3A5F] rounded-2xl p-8 h-full">
                <h3 className="text-2xl text-white font-semibold mb-6">Eres candidato si:</h3>
                <div className="space-y-4">
                  {[
                    "Cuentas con capacidad de inversión desde $100,000 USD",
                    "Buscas invertir en bienes raíces en Estados Unidos",
                    "Quieres evaluar oportunidades con análisis y criterios",
                    "Valoras una comunidad privada con inversionistas activos",
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                      <p className="text-slate-300 text-sm">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.1}>
              <div className="bg-white border border-gray-200 rounded-2xl p-8 h-full shadow-sm">
                <h3 className="text-2xl text-[#6B7280] font-semibold mb-6">No es para ti si:</h3>
                <div className="space-y-4">
                  {[
                    "Aún estás explorando sin capital disponible",
                    "Buscas inversiones con retorno inmediato",
                    "No tienes capacidad de inversión mínima de $100,000",
                    "Prefieres no tener acompañamiento profesional",
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                      <p className="text-[#6B7280] text-sm">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ═══ 7. FAQ — navy ═══ */}
      <section className="bg-[#0B1F3A] py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl text-white text-center mb-12">Preguntas frecuentes</h2>
              <Accordion type="single" collapsible className="space-y-4">
                {[
                  { q: "¿Qué tipos de propiedades se pueden adquirir?", a: "Casas unifamiliares, parques de casas móviles, mini storage y otras opciones residenciales y comerciales adaptadas a tu perfil de inversión." },
                  { q: "¿Cómo está el mercado de bienes raíces en Estados Unidos?", a: "Es dinámico. La clave no es \"el mercado\" en general, sino seleccionar el mercado correcto, la clase de activo, validar supuestos y estructurar la inversión de la mejor manera para cada caso." },
                  { q: "¿Pueden los extranjeros invertir en bienes raíces en Estados Unidos?", a: "Sí. La diferencia la hace la estructura legal, fiscal y el proceso de compra profesional que garantiza cumplimiento normativo." },
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

      {/* ── Photo break — audience ── */}
      <section className="relative h-64 md:h-80 overflow-hidden">
        <img src={AUDIENCE} alt="Comunidad de inversionistas" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#F5F7FA] via-transparent to-[#0B1F3A]/60" />
      </section>

      {/* ═══ 8. CONEXIONES — ☀️ BLANCO ═══ */}
      <section className="bg-[#F5F7FA] py-20 md:py-28">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <FadeIn>
              <div className="bg-white border border-gray-200 rounded-xl p-8 h-full shadow-sm">
                <h3 className="text-xl text-[#0B1F3A] font-semibold mb-4">Oportunidades de inversión</h3>
                <p className="text-[#4B5563] text-sm leading-relaxed mb-6">
                  Accede a oportunidades filtradas y evaluadas dentro de la comunidad de inversionistas.
                </p>
                <a href="/oportunidades-de-inversion-en-estados-unidos">
                  <Button className="bg-[#0B1F3A] hover:bg-[#0E2544] text-white gap-2 w-full">Ver oportunidades <ArrowRight className="w-4 h-4" /></Button>
                </a>
              </div>
            </FadeIn>
            <FadeIn delay={0.1}>
              <div className="bg-white border border-gray-200 rounded-xl p-8 h-full shadow-sm">
                <h3 className="text-xl text-[#0B1F3A] font-semibold mb-4">Conoce el club de inversión</h3>
                <p className="text-[#4B5563] text-sm leading-relaxed mb-6">
                  La comunidad es el espacio donde se presentan y discuten oportunidades con respaldo profesional.
                </p>
                <a href="/membresia">
                  <Button className="bg-[#0B1F3A] hover:bg-[#0E2544] text-white gap-2 w-full">Ver club de inversión <ArrowRight className="w-4 h-4" /></Button>
                </a>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ═══ 9. CTA FINAL — deep navy ═══ */}
      <section className="bg-[#091A30] py-24 md:py-32">
        <div className="container">
          <FadeIn>
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl text-white mb-4">¿Listo para invertir con criterio y estructura?</h2>
              <p className="text-slate-400 mb-2">Inversión inmobiliaria en Estados Unidos desde $100,000 USD.</p>
              <p className="text-slate-500 text-sm mb-10">Estructura legal, fiscal y acompañamiento profesional incluido.</p>
              <div className="flex flex-wrap justify-center gap-4">
                <a href="/perfil">
                  <Button className="bg-primary hover:bg-blue-600 text-white px-8 py-6 text-base gap-2 shadow-lg shadow-blue-600/25">
                    Evaluar mi perfil <ArrowRight className="w-4 h-4" />
                  </Button>
                </a>
                <Button variant="outline" onClick={() => openWhatsApp(WHATSAPP_PHONE, WA_MSG)} className="border-slate-600 text-white hover:bg-white/10 px-8 py-6 text-base gap-2">
                  WhatsApp
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
