import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { CheckCircle2, ArrowRight, AlertCircle, Zap, Users, FileCheck, DollarSign, Clock, Shield, Briefcase, MessageCircle } from "lucide-react";

// Links de pago Clover
const CLOVER_LINKS = {
  texas: "https://www.clover.com/pay-widgets/b3f65360-1554-4b11-9175-f415a63ff74a",
  florida: "https://link.clover.com/urlshortener/SFHYf2"
};

// Notificaciones simuladas de prueba social
const SOCIAL_PROOF_NOTIFICATIONS = [
  { name: "Carlos", city: "Monterrey", action: "acaba de crear una LLC en Texas" },
  { name: "María", city: "Guadalajara", action: "acaba de iniciar su empresa en Florida" },
  { name: "Juan", city: "México City", action: "completó su LLC en Texas" },
  { name: "Sofia", city: "Bogotá", action: "estructuró su empresa en Florida" },
  { name: "Diego", city: "Lima", action: "registró su LLC en Texas" }
];

export default function LLC() {
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [selectedObjective, setSelectedObjective] = useState<string | null>(null);
  const [calculatorStep, setCalculatorStep] = useState<number>(1);
  const [calculatorLocation, setCalculatorLocation] = useState<string | null>(null);
  const [calculatorActivity, setCalculatorActivity] = useState<string | null>(null);
  const [currentNotification, setCurrentNotification] = useState(0);

  // Rotación de notificaciones de prueba social
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentNotification((prev) => (prev + 1) % SOCIAL_PROOF_NOTIFICATIONS.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  // Meta Pixel tracking
  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).fbq) {
      (window as any).fbq("track", "ViewContent");
    }
  }, []);

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
    viewport: { once: true }
  };

  const handleCheckout = (state: "texas" | "florida") => {
    if (typeof window !== "undefined" && (window as any).fbq) {
      (window as any).fbq("track", "InitiateCheckout", { value: 1499, currency: "USD" });
    }
    window.location.href = CLOVER_LINKS[state];
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="max-w-3xl">
            <motion.div {...fadeInUp}>
              <span className="inline-block text-primary text-sm font-semibold tracking-[0.25em] uppercase mb-6 font-mono">
                Solución Empresarial
              </span>
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif text-[#0B1F3A] leading-[1.2] mb-6">
                Abre tu empresa en Estados Unidos de forma <span className="gradient-text-primary">correcta</span> desde el inicio
              </h1>
              
              <p className="text-lg md:text-xl text-gray-500 leading-relaxed mb-8 max-w-2xl">
                Constituimos tu LLC en Texas o Florida, con EIN federal y acompañamiento estratégico.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10 max-w-2xl">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-1" />
                  <span className="text-gray-700">Registro de LLC</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-1" />
                  <span className="text-gray-700">EIN (número fiscal federal)</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-1" />
                  <span className="text-gray-700">Introducción bancaria</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-1" />
                  <span className="text-gray-700">Acompañamiento paso a paso</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <Button 
                  onClick={() => handleCheckout("texas")}
                  className="bg-primary hover:bg-primary-dark text-white font-semibold px-8 py-6 text-base gap-2 w-full sm:w-auto"
                >
                  Crear mi LLC en Texas <ArrowRight className="w-4 h-4" />
                </Button>
                <Button 
                  onClick={() => handleCheckout("florida")}
                  className="bg-primary/80 hover:bg-primary text-white font-semibold px-8 py-6 text-base gap-2 w-full sm:w-auto"
                >
                  Crear mi LLC en Florida <ArrowRight className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex flex-col sm:flex-row gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  <span>Proceso guiado</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  <span>Soporte en español</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  <span>Servicio especializado</span>
                </div>
              </div>
            </motion.div>
            </div>

            {/* Imagen del hero */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="hidden lg:block"
            >
              <img
                src="https://res.cloudinary.com/dgruohz6f/image/upload/v1773439143/comprando-america/LnzdkgpluenSsqmO.jpg"
                alt="Documentos de incorporación LLC"
                className="w-full h-auto rounded-xl shadow-2xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ COMPARADOR INTERACTIVO ═══ */}
      <section className="py-24 md:py-32 bg-white">
        <div className="container">
          <motion.div {...fadeInUp} className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-serif text-[#0B1F3A] mb-4 text-center">
              ¿Qué estado es mejor para tu LLC?
            </h2>
            
            <p className="text-lg text-gray-500 mb-12 text-center">
              Selecciona tu objetivo y te mostramos la mejor opción.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
              {[
                { id: "physical", label: "Operar negocio físico", icon: "🏢" },
                { id: "digital", label: "Negocio digital", icon: "💻" },
                { id: "investment", label: "Inversión / estructura", icon: "📈" }
              ].map((option) => (
                <button
                  key={option.id}
                  onClick={() => setSelectedObjective(option.id)}
                  className={`p-6 rounded-xl border-2 transition-all ${
                    selectedObjective === option.id
                      ? "border-primary bg-blue-50"
                      : "border-gray-200 bg-[#F5F7FA] hover:border-primary/50"
                  }`}
                >
                  <div className="text-3xl mb-3">{option.icon}</div>
                  <p className="text-white font-semibold">{option.label}</p>
                </button>
              ))}
            </div>

            {selectedObjective === "physical" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-r from-primary/10 to-transparent border border-blue-200 rounded-xl p-8 mb-8">
                <h3 className="text-2xl font-serif text-[#0B1F3A] mb-4">Texas</h3>
                <p className="text-gray-700 mb-6">Texas es uno de los ecosistemas empresariales más fuertes de Estados Unidos, ideal para operaciones comerciales.</p>
                <Button onClick={() => handleCheckout("texas")} className="bg-primary hover:bg-primary-dark text-white">
                  Crear mi LLC en Texas
                </Button>
              </motion.div>
            )}

            {selectedObjective === "digital" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-r from-primary/10 to-transparent border border-blue-200 rounded-xl p-8 mb-8">
                <h3 className="text-2xl font-serif text-[#0B1F3A] mb-4">Florida</h3>
                <p className="text-gray-700 mb-6">Florida es ampliamente utilizado para negocios digitales y comercio internacional.</p>
                <Button onClick={() => handleCheckout("florida")} className="bg-primary hover:bg-primary-dark text-white">
                  Crear mi LLC en Florida
                </Button>
              </motion.div>
            )}

            {selectedObjective === "investment" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <div className="bg-gradient-to-r from-primary/10 to-transparent border border-blue-200 rounded-xl p-8">
                  <h3 className="text-2xl font-serif text-[#0B1F3A] mb-4">Texas</h3>
                  <p className="text-gray-700 mb-6">Gran ecosistema empresarial, comunidad latina fuerte, excelente para operación comercial.</p>
                  <Button onClick={() => handleCheckout("texas")} className="bg-primary hover:bg-primary-dark text-white">
                    Crear mi LLC en Texas
                  </Button>
                </div>
                <div className="bg-gradient-to-r from-primary/10 to-transparent border border-blue-200 rounded-xl p-8">
                  <h3 className="text-2xl font-serif text-[#0B1F3A] mb-4">Florida</h3>
                  <p className="text-gray-700 mb-6">Ambiente fiscal competitivo, ideal para negocios digitales, excelente conexión internacional.</p>
                  <Button onClick={() => handleCheckout("florida")} className="bg-primary hover:bg-primary-dark text-white">
                    Crear mi LLC en Florida
                  </Button>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* ═══ PRUEBA SOCIAL DINÁMICA ═══ */}
      <section className="py-16 bg-[#F5F7FA]">
        <div className="container">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl mx-auto text-center"
          >
            <p className="text-gray-500 text-sm mb-4">Empresarios están creando empresas en Estados Unidos</p>
            <motion.div
              key={currentNotification}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-blue-50 border border-blue-200 rounded-lg p-4 inline-block"
            >
              <p className="text-white font-semibold">
                {SOCIAL_PROOF_NOTIFICATIONS[currentNotification].name} — {SOCIAL_PROOF_NOTIFICATIONS[currentNotification].city}
              </p>
              <p className="text-gray-500 text-sm">
                {SOCIAL_PROOF_NOTIFICATIONS[currentNotification].action}
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══ SECCIÓN PROBLEMA ═══ */}
      <section className="py-24 md:py-32">
        <div className="container">
          <motion.div {...fadeInUp}>
            <h2 className="text-4xl md:text-5xl font-serif text-[#0B1F3A] mb-6 max-w-2xl">
              Abrir una LLC no es solo llenar un formulario
            </h2>
            
            <p className="text-lg text-gray-500 leading-relaxed mb-12 max-w-2xl">
              Muchos empresarios abren una empresa pensando que es solo un trámite. Pero una mala estructura puede generar:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
              {[
                { icon: AlertCircle, text: "Problemas fiscales" },
                { icon: AlertCircle, text: "Dificultad para abrir cuenta bancaria" },
                { icon: AlertCircle, text: "Errores legales" },
                { icon: AlertCircle, text: "Costos innecesarios" }
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <item.icon className="w-6 h-6 text-red-500 shrink-0 mt-1" />
                  <span className="text-gray-700">{item.text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ CALCULADORA SIMPLE ═══ */}
      <section className="py-24 md:py-32 bg-white">
        <div className="container">
          <motion.div {...fadeInUp} className="max-w-2xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-serif text-[#0B1F3A] mb-4 text-center">
              ¿Qué estructura necesitas para operar en Estados Unidos?
            </h2>
            
            <p className="text-lg text-gray-500 mb-12 text-center">
              Responde estas preguntas rápidas.
            </p>

            {calculatorStep === 1 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <p className="text-white font-semibold mb-6">¿Dónde operarás principalmente?</p>
                {["En Estados Unidos", "Desde otro país"].map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      setCalculatorLocation(option);
                      setCalculatorStep(2);
                    }}
                    className="w-full p-4 bg-[#F5F7FA] border border-gray-200 rounded-lg text-white hover:border-primary/50 transition-all text-left"
                  >
                    {option}
                  </button>
                ))}
              </motion.div>
            )}

            {calculatorStep === 2 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <p className="text-white font-semibold mb-6">Tipo de actividad:</p>
                {["Comercio", "Servicios", "Negocio digital", "Inversión"].map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      setCalculatorActivity(option);
                      setCalculatorStep(3);
                    }}
                    className="w-full p-4 bg-[#F5F7FA] border border-gray-200 rounded-lg text-white hover:border-primary/50 transition-all text-left"
                  >
                    {option}
                  </button>
                ))}
              </motion.div>
            )}

            {calculatorStep === 3 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-gradient-to-r from-primary/10 to-transparent border border-blue-200 rounded-xl p-8">
                <h3 className="text-2xl font-serif text-[#0B1F3A] mb-4">Tu resultado</h3>
                <p className="text-gray-700 mb-6">
                  LLC en Texas o Florida puede ser una estructura adecuada para tu caso. Nuestro equipo puede ayudarte a estructurarla correctamente.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button onClick={() => handleCheckout("texas")} className="bg-primary hover:bg-primary-dark text-white">
                    Crear mi LLC en Texas
                  </Button>
                  <Button onClick={() => handleCheckout("florida")} className="bg-primary/80 hover:bg-primary text-white">
                    Crear mi LLC en Florida
                  </Button>
                </div>
                <button
                  onClick={() => {
                    setCalculatorStep(1);
                    setCalculatorLocation(null);
                    setCalculatorActivity(null);
                  }}
                  className="mt-4 text-primary hover:text-primary-dark text-sm"
                >
                  Volver a empezar
                </button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* ═══ LO QUE INCLUYE ═══ */}
      <section className="py-24 md:py-32">
        <div className="container">
          <motion.div {...fadeInUp} className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-serif text-[#0B1F3A] mb-16 text-center">
              Tu LLC incluye
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {[
                "Registro de tu LLC en Texas o Florida",
                "Registered Agent (1 año)",
                "Solicitud de EIN (número fiscal federal)",
                "Introducción bancaria para cuenta empresarial",
                "Asistencia para tarjeta de crédito garantizada",
                "Virtual Office (opcional)",
                "Acompañamiento completo"
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-start gap-4 bg-[#F5F7FA] border border-gray-200 rounded-xl p-6"
                >
                  <CheckCircle2 className="w-6 h-6 text-primary shrink-0 mt-1" />
                  <span className="text-gray-700">{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ PRECIO ═══ */}
      <section className="py-24 md:py-32 bg-white">
        <div className="container">
          <motion.div {...fadeInUp} className="max-w-2xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-serif text-[#0B1F3A] mb-8">
              Costo del servicio
            </h2>
            
            <div className="mb-12">
              <div className="text-6xl font-serif text-primary mb-4">$1,499 USD</div>
              <p className="text-gray-500">Servicio completo de formación de LLC en Texas o Florida.</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => handleCheckout("texas")}
                className="bg-primary hover:bg-primary-dark text-white font-semibold px-8 py-6 text-base"
              >
                Crear mi LLC en Texas
              </Button>
              <Button 
                onClick={() => handleCheckout("florida")}
                className="bg-primary/80 hover:bg-primary text-white font-semibold px-8 py-6 text-base"
              >
                Crear mi LLC en Florida
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ PROCESO ═══ */}
      <section className="py-24 md:py-32">
        <div className="container">
          <motion.div {...fadeInUp}>
            <h2 className="text-4xl md:text-5xl font-serif text-[#0B1F3A] mb-16 text-center">
              Tu empresa lista en pocos pasos
            </h2>

            <div className="max-w-3xl mx-auto">
              {[
                { num: "1", title: "Completa tu compra", desc: "" },
                { num: "2", title: "Registramos tu LLC", desc: "" },
                { num: "3", title: "Tramitamos EIN", desc: "" },
                { num: "4", title: "Entregamos documentos", desc: "" }
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
                    <h3 className="text-xl font-serif text-[#0B1F3A] mb-1">{step.title}</h3>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section className="py-24 md:py-32 bg-white">
        <div className="container">
          <motion.div {...fadeInUp} className="max-w-2xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-serif text-[#0B1F3A] mb-16 text-center">
              Preguntas frecuentes
            </h2>

            <Accordion type="single" collapsible className="space-y-4">
              {[
                {
                  q: "¿Puedo abrir una LLC si no vivo en Estados Unidos?",
                  a: "Sí, absolutamente. No necesitas residencia ni visa. Puedes abrirla completamente de forma remota desde cualquier país."
                },
                {
                  q: "¿Cuánto tarda el proceso?",
                  a: "La constitución legal toma 24-72 horas. El EIN federal puede tardar 8-12 semanas si eres extranjero. Todo el proceso está coordinado por nosotros."
                },
                {
                  q: "¿La LLC incluye EIN?",
                  a: "Sí, incluye la solicitud del EIN (número fiscal federal). Es parte integral del servicio."
                },
                {
                  q: "¿Texas o Florida cuál me conviene?",
                  a: "Depende de tu objetivo. Texas es mejor para operaciones comerciales, Florida para negocios digitales. Usa nuestro comparador interactivo arriba."
                },
                {
                  q: "¿Puedo abrir cuenta bancaria?",
                  a: "Sí. Te preparamos toda la documentación necesaria y te conectamos con bancos que trabajan con extranjeros."
                }
              ].map((item, i) => (
                <AccordionItem key={i} value={`item-${i}`} className="border border-gray-200 rounded-lg px-6">
                  <AccordionTrigger className="text-white hover:text-primary transition-colors">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-500">
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
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#0B1F3A] mb-8 leading-[1.1]">
              Empieza tu empresa en Estados Unidos hoy
            </h2>

            <p className="text-lg text-gray-500 mb-12 leading-relaxed">
              Estructura tu empresa correctamente desde el inicio.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => handleCheckout("texas")}
                className="bg-primary hover:bg-primary-dark text-white font-semibold px-8 py-6 text-base gap-2"
              >
                Crear mi LLC en Texas <ArrowRight className="w-4 h-4" />
              </Button>
              <Button 
                onClick={() => handleCheckout("florida")}
                className="bg-primary/80 hover:bg-primary text-white font-semibold px-8 py-6 text-base gap-2"
              >
                Crear mi LLC en Florida <ArrowRight className="w-4 h-4" />
              </Button>
            </div>

            <div className="mt-12 pt-12 border-t border-gray-200">
              <p className="text-gray-500 text-sm">
                Una LLC no es una visa. No sustituye asesoría legal o fiscal. Sí es el primer paso serio para operar en Estados Unidos.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ BOTÓN FLOTANTE WHATSAPP ═══ */}
      <a
        href="https://wa.me/5213346766178"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg transition-all"
        title="Hablar con un asesor"
      >
        <MessageCircle className="w-6 h-6" />
      </a>

      {/* ═══ BOTÓN STICKY MOBILE ═══ */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden bg-background border-t border-gray-200 p-4 z-40">
        <button
          onClick={() => handleCheckout("texas")}
          className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 rounded-lg transition-all"
        >
          Crear mi LLC
        </button>
      </div>

      <Footer />
    </div>
  );
}
