import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CheckCircle2, ArrowRight, Info } from "lucide-react";
import { useState } from "react";

export default function LLC() {
  const [selectedState, setSelectedState] = useState("texas");

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />

      {/* ═══ HERO ═══ */}
      <section className="relative isolate min-h-screen flex items-center pt-20 pb-20 overflow-hidden">
        <div className="absolute inset-0 z-0 bg-gradient-to-r from-[oklch(0.08_0.03_250)] via-[oklch(0.10_0.03_250)] to-[oklch(0.08_0.03_250)]" />
        <div className="container relative z-10">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <span className="inline-block text-primary text-sm font-semibold tracking-[0.25em] uppercase mb-6 font-mono">
                Solución Empresarial
              </span>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif text-white leading-[1.1] mb-6">
                Abre tu Empresa en{" "}
                <span className="gradient-text-primary">Estados Unidos</span>
              </h1>
              <p className="text-lg md:text-xl text-white/70 leading-relaxed mb-8 max-w-2xl">
                De forma legal, simple y segura. Nosotros registramos tu LLC y la dejamos lista para operar.
              </p>

              {/* Si quieres section */}
              <div className="bg-white/5 border border-white/10 rounded-lg p-8 mb-10 backdrop-blur-sm">
                <h3 className="text-white font-semibold mb-4">Si quieres:</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    "Operar un negocio",
                    "Comprar un inmueble",
                    "Invertir en Estados Unidos",
                    "Separar tus activos personales",
                    "Empezar a construir crédito",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                      <span className="text-white/80">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="bg-primary hover:bg-primary-dark text-white font-semibold px-8 py-6 text-base gap-2 w-full sm:w-auto">
                  Solicitar Información <ArrowRight className="w-4 h-4" />
                </Button>
                <a href="https://wa.me/5213346766178" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="border-white/20 text-white hover:bg-white/5 px-8 py-6 text-base w-full sm:w-auto">
                    Contactar por WhatsApp
                  </Button>
                </a>
              </div>

              <p className="text-white/50 text-sm mt-8">
                <strong>Probablemente necesitas una LLC.</strong> Nosotros la abrimos por ti. <strong>Sin complicaciones.</strong> ✓
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ ¿QUÉ ES UNA LLC? ═══ */}
      <section className="section-darker py-24 md:py-32">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-serif text-white mb-8">
                ¿Qué es una LLC y por qué la necesitas?
              </h2>

              <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-2xl p-8 md:p-12 mb-12">
                <p className="text-lg text-white/90 leading-relaxed mb-6">
                  Una LLC es la estructura más utilizada por extranjeros para hacer negocios en Estados Unidos.
                </p>

                <h3 className="text-2xl font-serif text-white mb-6">Te permite:</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {[
                    "Proteger tu patrimonio personal",
                    "Operar legalmente",
                    "Abrir cuentas bancarias empresariales",
                    "Facturar y firmar contratos",
                    "Construir crédito comercial",
                    "Acceder a beneficios fiscales (según tu actividad)",
                  ].map((benefit) => (
                    <div key={benefit} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-1" />
                      <span className="text-white/80">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { title: "No necesitas residencia", desc: "Puedes vivir en cualquier país" },
                  { title: "No necesitas vivir en EE.UU.", desc: "Operación 100% remota" },
                  { title: "Abre de manera remota", desc: "Proceso completamente digital" },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="bg-white/5 border border-white/10 rounded-lg p-6 hover:border-primary/30 transition-colors"
                  >
                    <h4 className="font-semibold text-white mb-2">{item.title}</h4>
                    <p className="text-white/60 text-sm">{item.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ QUÉ INCLUYE ═══ */}
      <section className="section-dark py-24 md:py-32">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-serif text-white mb-4 text-center">
              ¿Qué incluye nuestro servicio?
            </h2>
            <p className="text-center text-white/60 mb-12 text-lg">
              Desde <span className="text-primary font-semibold">$1,499 USD</span>
            </p>

            <div className="max-w-3xl mx-auto bg-gradient-to-br from-primary/15 to-primary/5 border border-primary/20 rounded-2xl p-8 md:p-12 mb-12">
              <div className="space-y-4">
                {[
                  "Registro de tu LLC en Texas o Florida",
                  "Registered Agent (1 año)",
                  "Solicitud de EIN (número fiscal federal)",
                  "Introducción bancaria para cuenta empresarial",
                  "Asistencia para tarjeta de crédito garantizada",
                  "Virtual Office (opcional) - Te acompañamos en todo el proceso",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-4">
                    <CheckCircle2 className="w-6 h-6 text-primary shrink-0 mt-0.5" />
                    <span className="text-white/90 text-lg">{item}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-8 border-t border-white/10">
                <p className="text-white font-semibold text-lg">
                  🎯 NO SOLO LA REGISTRAMOS. LA DEJAMOS LISTA PARA OPERAR.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ CÓMO FUNCIONA ═══ */}
      <section className="section-darker py-24 md:py-32">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-serif text-white mb-12 text-center">
              ¿Cómo funciona?
            </h2>

            <div className="max-w-4xl mx-auto">
              <div className="space-y-6">
                {[
                  { num: "1", title: "Confirmas tu pago", desc: "" },
                  { num: "2", title: "Llenas nuestro formulario", desc: "(5-10 minutos)" },
                  { num: "3", title: "Registramos tu LLC", desc: "(24-72 hrs)" },
                  { num: "4", title: "Tramitamos tu EIN", desc: "(8-12 semanas si eres extranjero)" },
                  { num: "5", title: "Te conectamos con banco", desc: "" },
                  { num: "6", title: "Empiezas a operar", desc: "" },
                ].map((step) => (
                  <div key={step.num} className="flex gap-6">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary text-white font-bold text-lg">
                        {step.num}
                      </div>
                    </div>
                    <div className="flex-1 pt-1">
                      <h4 className="text-xl font-semibold text-white mb-1">{step.title}</h4>
                      {step.desc && <p className="text-white/60">{step.desc}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ IMPORTANTE ═══ */}
      <section className="section-dark py-24 md:py-32">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="max-w-3xl mx-auto bg-white/5 border border-primary/30 rounded-2xl p-8 md:p-12">
              <div className="flex items-start gap-4 mb-6">
                <Info className="w-8 h-8 text-primary shrink-0 mt-1" />
                <h2 className="text-3xl md:text-4xl font-serif text-white">Importante</h2>
              </div>

              <div className="space-y-4 mb-8">
                {[
                  "Una LLC no es una visa.",
                  "No sustituye asesoría legal o fiscal.",
                  "Sí es el primer paso serio para operar en Estados Unidos.",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                    <p className="text-white/80 text-lg">{item}</p>
                  </div>
                ))}
              </div>

              <div className="bg-primary/20 border border-primary/40 rounded-lg p-6">
                <p className="text-white/90 text-lg leading-relaxed mb-6">
                  Si quieres operar, invertir o proteger activos en Estados Unidos, es momento de hacerlo bien.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <a href="https://wa.me/5213346766178" target="_blank" rel="noopener noreferrer">
                    <Button className="bg-primary hover:bg-primary-dark text-white font-semibold px-8 py-6 text-base w-full sm:w-auto">
                      Escribir por WhatsApp
                    </Button>
                  </a>
                  <Button variant="outline" className="border-white/20 text-white hover:bg-white/5 px-8 py-6 text-base w-full sm:w-auto">
                    contact@comprandoamerica.com
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
