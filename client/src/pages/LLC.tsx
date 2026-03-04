import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CheckCircle2, ArrowRight, AlertCircle, Zap, Users, FileCheck, DollarSign, Clock, Shield, Briefcase } from "lucide-react";

export default function LLC() {
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
    viewport: { once: true }
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />

      {/* ═══ HERO SECTION ═══ */}
      <section className="relative min-h-screen flex items-center pt-20 pb-20">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-[oklch(0.12_0.03_250)] via-[oklch(0.10_0.03_250)] to-[oklch(0.08_0.03_250)]" />
        </div>
        
        <div className="container">
          <div className="max-w-3xl">
            <motion.div {...fadeInUp}>
              <span className="inline-block text-primary text-sm font-semibold tracking-[0.25em] uppercase mb-6 font-mono">
                Solución Empresarial
              </span>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif text-white leading-[1.1] mb-6">
                Abre tu LLC en Estados Unidos de forma <span className="gradient-text-primary">correcta</span> desde el inicio
              </h1>
              
              <p className="text-lg md:text-xl text-white/70 leading-relaxed mb-8 max-w-2xl">
                Estructuramos tu empresa en Texas o Florida con cumplimiento legal, preparación bancaria y asesoría estratégica.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10 max-w-2xl">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-1" />
                  <span className="text-white/80">Constitución de LLC</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-1" />
                  <span className="text-white/80">EIN federal</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-1" />
                  <span className="text-white/80">Preparación para cuenta bancaria</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-1" />
                  <span className="text-white/80">Asesoría inicial</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <a href="https://link.clover.com/urlshortener/8nf2xj" target="_blank" rel="noopener noreferrer">
                  <Button className="bg-primary hover:bg-primary-dark text-white font-semibold px-8 py-6 text-base gap-2 w-full sm:w-auto">
                    Crear mi LLC ahora <ArrowRight className="w-4 h-4" />
                  </Button>
                </a>
                <a href="https://wa.me/5213346766178" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="border-white/20 text-white hover:bg-white/5 px-8 py-6 text-base w-full sm:w-auto">
                    Agendar llamada estratégica
                  </Button>
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ SECCIÓN PROBLEMA ═══ */}
      <section className="py-24 md:py-32 bg-[oklch(0.12_0.03_250)]">
        <div className="container">
          <motion.div {...fadeInUp}>
            <h2 className="text-4xl md:text-5xl font-serif text-white mb-6 max-w-2xl">
              Abrir una LLC no es solo llenar un formulario
            </h2>
            
            <p className="text-lg text-white/70 leading-relaxed mb-12 max-w-2xl">
              La mayoría de las personas abre una LLC pensando que es un trámite sencillo. Pero una mala estructura puede generar:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
              {[
                { icon: AlertCircle, text: "Problemas fiscales" },
                { icon: AlertCircle, text: "Dificultad para abrir cuentas bancarias" },
                { icon: AlertCircle, text: "Riesgos legales" },
                { icon: AlertCircle, text: "Pérdida de oportunidades migratorias" }
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <item.icon className="w-6 h-6 text-red-500 shrink-0 mt-1" />
                  <span className="text-white/80">{item.text}</span>
                </div>
              ))}
            </div>

            <p className="text-white/70 mt-12 font-semibold">
              Por eso es importante hacerlo correctamente desde el inicio.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ═══ SECCIÓN SOLUCIÓN ═══ */}
      <section className="py-24 md:py-32">
        <div className="container">
          <motion.div {...fadeInUp}>
            <h2 className="text-4xl md:text-5xl font-serif text-white mb-16 text-center">
              Así estructuramos tu LLC correctamente
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {[
                { num: "1", title: "Definición estratégica del estado", desc: "Texas o Florida según objetivo" },
                { num: "2", title: "Constitución legal de la LLC", desc: "Documentación completa y legal" },
                { num: "3", title: "Obtención del EIN federal", desc: "Número fiscal federal" },
                { num: "4", title: "Preparación para apertura bancaria", desc: "Documentos listos para banco" },
                { num: "5", title: "Recomendaciones fiscales iniciales", desc: "Asesoría estratégica inicial" }
              ].map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="relative bg-[oklch(0.15_0.03_250)] border border-white/5 rounded-xl p-6 hover:border-primary/30 transition-all duration-500"
                >
                  <div className="text-4xl font-serif text-primary/30 mb-3">{step.num}</div>
                  <h3 className="text-lg font-serif text-white mb-2">{step.title}</h3>
                  <p className="text-white/60 text-sm">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ TEXAS VS FLORIDA ═══ */}
      <section className="py-24 md:py-32 bg-[oklch(0.12_0.03_250)]">
        <div className="container">
          <motion.div {...fadeInUp}>
            <h2 className="text-4xl md:text-5xl font-serif text-white mb-16 text-center">
              Texas vs Florida
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {[
                {
                  state: "Texas",
                  benefits: [
                    "Ecosistema empresarial fuerte",
                    "Sin impuesto estatal corporativo para muchas estructuras",
                    "Gran comunidad latina"
                  ]
                },
                {
                  state: "Florida",
                  benefits: [
                    "Ambiente fiscal competitivo",
                    "Ideal para negocios digitales y comercio internacional",
                    "Alta apertura bancaria"
                  ]
                }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: i === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                  className="bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 rounded-xl p-8"
                >
                  <h3 className="text-2xl font-serif text-white mb-6">{item.state}</h3>
                  <ul className="space-y-4">
                    {item.benefits.map((benefit, j) => (
                      <li key={j} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-1" />
                        <span className="text-white/80">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>

            <div className="text-center">
              <a href="https://link.clover.com/urlshortener/8nf2xj" target="_blank" rel="noopener noreferrer">
                <Button className="bg-primary hover:bg-primary-dark text-white font-semibold px-8 py-6 text-base">
                  Elegir estado y comenzar
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ BENEFICIOS ═══ */}
      <section className="py-24 md:py-32">
        <div className="container">
          <motion.div {...fadeInUp}>
            <h2 className="text-4xl md:text-5xl font-serif text-white mb-16 text-center">
              Lo que incluye nuestro servicio
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {[
                { icon: FileCheck, text: "Registro oficial de LLC" },
                { icon: DollarSign, text: "EIN federal" },
                { icon: Briefcase, text: "Documentos operativos" },
                { icon: Users, text: "Asesoría estratégica inicial" },
                { icon: Shield, text: "Recomendaciones para cuenta bancaria" },
                { icon: Zap, text: "Guía de cumplimiento básico" }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-start gap-4 bg-[oklch(0.15_0.03_250)] border border-white/5 rounded-xl p-6"
                >
                  <item.icon className="w-6 h-6 text-primary shrink-0 mt-1" />
                  <span className="text-white/80">{item.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ PROCESO ═══ */}
      <section className="py-24 md:py-32 bg-[oklch(0.12_0.03_250)]">
        <div className="container">
          <motion.div {...fadeInUp}>
            <h2 className="text-4xl md:text-5xl font-serif text-white mb-16 text-center">
              Tu LLC lista en 4 pasos
            </h2>

            <div className="max-w-3xl mx-auto">
              {[
                { num: "1", title: "Contacto inicial", time: "" },
                { num: "2", title: "Constitución legal", time: "" },
                { num: "3", title: "Documentos y EIN", time: "" },
                { num: "4", title: "Entrega de empresa lista", time: "" }
              ].map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-start gap-6 mb-8 last:mb-0"
                >
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-serif text-xl font-bold mb-4">
                      {step.num}
                    </div>
                    {i < 3 && <div className="w-1 h-12 bg-primary/30" />}
                  </div>
                  <div className="pt-2">
                    <h3 className="text-xl font-serif text-white mb-1">{step.title}</h3>
                    {step.time && <p className="text-white/60 text-sm">{step.time}</p>}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ AUTORIDAD ═══ */}
      <section className="py-24 md:py-32">
        <div className="container">
          <motion.div {...fadeInUp} className="max-w-2xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-serif text-white mb-8">
              Respaldado por expertos
            </h2>
            
            <p className="text-lg text-white/70 mb-8 leading-relaxed">
              Edmundo Treviño, empresario binacional con +9 empresas operando en Estados Unidos, lidera Comprando América. Una comunidad que conecta inversionistas latinos con oportunidades reales en Estados Unidos.
            </p>

            <div className="bg-gradient-to-r from-primary/10 to-transparent border border-primary/20 rounded-xl p-8">
              <p className="text-white/80 font-semibold">
                Más de 500 empresarios e inversionistas confían en nuestra asesoría para estructurar sus negocios correctamente.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section className="py-24 md:py-32 bg-[oklch(0.12_0.03_250)]">
        <div className="container">
          <motion.div {...fadeInUp} className="max-w-2xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-serif text-white mb-16 text-center">
              Preguntas frecuentes
            </h2>

            <Accordion type="single" collapsible className="space-y-4">
              {[
                {
                  q: "¿Puedo abrir una LLC sin vivir en Estados Unidos?",
                  a: "Sí, absolutamente. No necesitas residencia ni visa. Puedes abrirla completamente de forma remota desde cualquier país."
                },
                {
                  q: "¿Cuánto tarda el proceso?",
                  a: "La constitución legal toma 24-72 horas. El EIN federal puede tardar 8-12 semanas si eres extranjero. Todo el proceso está coordinado por nosotros."
                },
                {
                  q: "¿Puedo abrir cuenta bancaria con mi LLC?",
                  a: "Sí. Preparamos toda la documentación necesaria para que abras cuenta bancaria empresarial. Te conectamos con bancos que trabajan con extranjeros."
                },
                {
                  q: "¿La LLC sirve para visa E-2?",
                  a: "Una LLC no es una visa, pero es el primer paso serio para operar en Estados Unidos. Puede ser parte de una estrategia migratoria más amplia."
                }
              ].map((item, i) => (
                <AccordionItem key={i} value={`item-${i}`} className="border border-white/10 rounded-lg px-6">
                  <AccordionTrigger className="text-white hover:text-primary transition-colors">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-white/70">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>

      {/* ═══ CTA FINAL ═══ */}
      <section className="py-24 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
        </div>

        <div className="container">
          <motion.div {...fadeInUp} className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white mb-8 leading-[1.1]">
              Empieza tu empresa en Estados Unidos hoy
            </h2>

            <p className="text-lg text-white/70 mb-12 leading-relaxed">
              Desde $1,499 USD. Disponible para Texas y Florida. Si necesitas otro estado, contáctanos por WhatsApp.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="https://link.clover.com/urlshortener/8nf2xj" target="_blank" rel="noopener noreferrer">
                <Button className="bg-primary hover:bg-primary-dark text-white font-semibold px-8 py-6 text-base gap-2 w-full sm:w-auto">
                  Crear mi LLC <ArrowRight className="w-4 h-4" />
                </Button>
              </a>
              <a href="https://wa.me/5213346766178" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/5 px-8 py-6 text-base w-full sm:w-auto">
                  Hablar con un asesor
                </Button>
              </a>
            </div>

            <div className="mt-12 pt-12 border-t border-white/10">
              <p className="text-white/60 text-sm">
                Una LLC no es una visa. No sustituye asesoría legal o fiscal. Sí es el primer paso serio para operar en Estados Unidos.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
