import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { useInView } from "@/hooks/useInView";
import {
  MapPin, Calendar, Clock, Users, DollarSign, CheckCircle2,
  ArrowRight, Shield, TrendingUp, Briefcase, Home,
  AlertCircle, Zap, Target
} from "lucide-react";

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

const WHATSAPP_URL = "https://wa.me/523346766178?text=Hola%2C%20me%20interesa%20conocer%20m%C3%A1s%20sobre%20la%20Ruta%20Inmobiliaria%20en%20Estados%20Unidos";
const CLOVER_PAYMENT_URL = "https://www.clover.com/pay-widgets/c07f3d3b-e33e-4bc0-aa6c-b89c70d30844";

export default function RutaInmobiliaria() {
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  const faqItems = [
    {
      id: "1",
      question: "¿La compra del ticket me garantiza inversión?",
      answer: "No. El ticket es un filtro de compromiso que te da acceso al evento y al proceso de evaluación. La compra del ticket no garantiza acceso a oportunidades de inversión. Cada perfil es evaluado individualmente para determinar si califica para las oportunidades presentadas."
    },
    {
      id: "2",
      question: "¿Cómo es el proceso de registro?",
      answer: "El proceso es simple: (1) Contacta por WhatsApp escribiendo tu ciudad, (2) Validamos tu perfil y disponibilidad de cupo, (3) Si calificas, recibes un link de pago seguro con Clover, (4) Después del pago, confirmas tu asistencia. El cupo es limitado a 16 inversionistas."
    },
    {
      id: "3",
      question: "¿Se comparte la sede exacta?",
      answer: "La ubicación exacta se comparte únicamente después de confirmar el pago. Esto garantiza que solo asistan inversionistas comprometidos con el proceso. Recibirás todos los detalles logísticos por correo y WhatsApp una vez confirmado tu cupo."
    },
    {
      id: "4",
      question: "¿Puedo asistir con socio o familiar?",
      answer: "Sí, puedes asistir con un socio o familiar. Cada persona debe adquirir su propio ticket. Recomendamos que ambos pasen por el proceso de validación de perfil para optimizar la experiencia. El cupo es limitado, así que te sugerimos registrarte lo antes posible."
    },
    {
      id: "5",
      question: "¿Qué incluye el ticket?",
      answer: "El ticket incluye: acceso a la jornada completa (mañana y tarde), presentación de oportunidades inmobiliarias, sesión 1:1 para dudas puntuales, materiales de referencia, y acceso al proceso de evaluación para inversión. No incluye comidas, pero se proporcionarán bebidas y snacks."
    },
    {
      id: "6",
      question: "¿Hay opciones de financiamiento?",
      answer: "Sí. Ofrecemos opciones de financiamiento flexible para el ticket. Contacta por WhatsApp para conocer las modalidades disponibles. También puedes pagar el monto completo con Clover de forma segura."
    }
  ];

  const agendaMañana = [
    {
      title: "Dónde está el dinero hoy",
      description: "Mapa de oportunidades por zona y motor de demanda en el mercado inmobiliario estadounidense."
    },
    {
      title: "Cómo invertir desde Latinoamérica",
      description: "Estructura legal/bancaria, compliance y errores caros que debes evitar."
    },
    {
      title: "Impuestos y estrategia patrimonial",
      description: "Principios para reinvertir y escalar sin perder control de tu patrimonio."
    },
    {
      title: "Checklist de decisión",
      description: "Preguntas clave antes de firmar o transferir capital."
    }
  ];

  const agendaTarde = [
    {
      title: "Fondo de Tierra Estratégica",
      description: "Oportunidad en Florida y Arizona con enfoque patrimonial de largo plazo."
    },
    {
      title: "Single Family Homes",
      description: "Modelo pasivo de renta y resguardo de valor en New York."
    },
    {
      title: "Perfil ideal y riesgos",
      description: "Análisis de qué oportunidad se ajusta mejor a tu perfil y estrategia de salida."
    },
    {
      title: "Siguientes pasos",
      description: "Sesión 1:1 para dudas puntuales y cierre dirigido."
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />

      {/* ═══ HERO ═══ */}
      <section className="relative min-h-screen flex items-center pt-20 pb-20">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-r from-[oklch(0.08_0.03_250/0.95)] via-[oklch(0.10_0.03_250/0.85)] to-[oklch(0.08_0.03_250/0.70)]" />
        </div>
        <div className="container relative z-10">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <span className="inline-block text-primary text-sm font-semibold tracking-[0.25em] uppercase mb-6 font-mono">
                Evento Privado · Presencial · Cupo Limitado
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-serif text-white leading-[1.1] mb-6">
                Ruta Inmobiliaria en{" "}
                <span className="gradient-text-primary">Estados Unidos</span>
              </h1>
              <p className="text-lg md:text-xl text-white/70 leading-relaxed mb-8 max-w-2xl">
                Estrategias inmobiliarias pasivas y conservadoras para empresarios e inversionistas latinoamericanos que buscan proteger y diversificar su patrimonio.
              </p>

              {/* Event Details */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary shrink-0 mt-1" />
                  <div>
                    <p className="text-white/50 text-sm">Ubicación</p>
                    <p className="text-white font-semibold">Monterrey</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-primary shrink-0 mt-1" />
                  <div>
                    <p className="text-white/50 text-sm">Fecha</p>
                    <p className="text-white font-semibold">28 Mar 2026</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-primary shrink-0 mt-1" />
                  <div>
                    <p className="text-white/50 text-sm">Hora</p>
                    <p className="text-white font-semibold">09:00 a.m.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-primary shrink-0 mt-1" />
                  <div>
                    <p className="text-white/50 text-sm">Cupo</p>
                    <p className="text-white font-semibold">16 inversionistas</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                  <Button className="bg-primary hover:bg-primary-dark text-white font-semibold px-8 py-6 text-base gap-2 w-full sm:w-auto">
                    Reservar por WhatsApp <ArrowRight className="w-4 h-4" />
                  </Button>
                </a>
                <a href={CLOVER_PAYMENT_URL} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="border-white/20 text-white hover:bg-white/5 px-8 py-6 text-base w-full sm:w-auto">
                    Confirmar Acceso
                  </Button>
                </a>
              </div>

              <p className="text-white/50 text-sm mt-8 max-w-2xl">
                <AlertCircle className="w-4 h-4 inline mr-2" />
                Dirigido a empresarios e inversionistas con capital disponible desde <strong>$100,000 USD</strong>
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ CLARIDAD ═══ */}
      <section className="section-darker py-24 md:py-32">
        <div className="container">
          <FadeIn>
            <div className="max-w-3xl mb-12">
              <h2 className="text-3xl md:text-4xl font-serif text-white mb-6">¿De qué trata este evento?</h2>
              <p className="text-white/70 text-lg leading-relaxed mb-8">
                Una jornada presencial, privada y estratégica para empresarios e inversionistas que buscan proteger, diversificar y estructurar su patrimonio en Estados Unidos a través de vehículos inmobiliarios pasivos y conservadores.
              </p>

              <div className="bg-[oklch(0.15_0.03_250)] border border-white/5 rounded-xl p-8 mb-8">
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-primary" />
                  Esto NO es:
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="text-primary mt-1">✕</span>
                    <span className="text-white/70">Un curso teórico o capacitación masiva</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary mt-1">✕</span>
                    <span className="text-white/70">Un evento para empezar "con poco"</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary mt-1">✕</span>
                    <span className="text-white/70">Una promesa de rendimientos garantizados</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-r from-primary/10 to-transparent border border-primary/20 rounded-xl p-8">
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-primary" />
                  Es una sala cerrada para tomar decisiones con información real
                </h3>
                <p className="text-white/70">
                  Formato privado con pocos asistentes, preguntas puntuales, siguientes pasos claros y validación de perfil para cierre dirigido.
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ PERFIL IDEAL ═══ */}
      <section className="section-dark py-24 md:py-32">
        <div className="container">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-serif text-white mb-12 text-center">¿Es para ti?</h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="bg-[oklch(0.15_0.03_250)] border border-primary/20 rounded-xl p-8">
                <h3 className="text-white font-semibold mb-6 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  Perfil Ideal
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold">✓</span>
                    <span className="text-white/70">Buscas invertir en bienes raíces en USA</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold">✓</span>
                    <span className="text-white/70">Deseas proteger patrimonio fuera de Latinoamérica</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold">✓</span>
                    <span className="text-white/70">Prefieres estructuras 100% pasivas y patrimoniales</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold">✓</span>
                    <span className="text-white/70">Quieres claridad legal/bancaria antes de firmar</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-primary font-bold">✓</span>
                    <span className="text-white/70">Tienes capital disponible desde $100,000 USD</span>
                  </li>
                </ul>
              </div>

              <div className="bg-[oklch(0.15_0.03_250)] border border-white/5 rounded-xl p-8">
                <h3 className="text-white font-semibold mb-6 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-white/50" />
                  No es para ti si:
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <span className="text-white/50">✕</span>
                    <span className="text-white/50">Buscas cursos teóricos o educación básica</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-white/50">✕</span>
                    <span className="text-white/50">Quieres empezar "con poco" o sin capital</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-white/50">✕</span>
                    <span className="text-white/50">Esperas promesas de rendimientos altos</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-white/50">✕</span>
                    <span className="text-white/50">No tienes disponibilidad para el 28 de marzo</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-white/50">✕</span>
                    <span className="text-white/50">Prefieres inversiones especulativas o de alto riesgo</span>
                  </li>
                </ul>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ AGENDA ═══ */}
      <section className="section-darker py-24 md:py-32">
        <div className="container">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-serif text-white mb-4 text-center">Agenda Orientada a Decisiones</h2>
            <p className="text-white/60 text-center mb-12 max-w-2xl mx-auto">Menos teoría. Más claridad: mercado, estructura, riesgos, estrategia de salida y siguientes pasos.</p>

            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {/* Mañana */}
              <FadeIn delay={0.1}>
                <div className="bg-[oklch(0.15_0.03_250)] border border-white/5 rounded-xl p-8">
                  <h3 className="text-white font-serif text-2xl mb-8 flex items-center gap-3">
                    <span className="text-3xl">🕘</span>
                    Mañana
                  </h3>
                  <p className="text-white/60 text-sm mb-6 font-semibold">Claridad y Estructura (Educación Estratégica)</p>
                  <ul className="space-y-6">
                    {agendaMañana.map((item, i) => (
                      <li key={i} className="border-l-2 border-primary/30 pl-4">
                        <p className="text-white font-semibold mb-1">{item.title}</p>
                        <p className="text-white/60 text-sm">{item.description}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </FadeIn>

              {/* Tarde */}
              <FadeIn delay={0.2}>
                <div className="bg-[oklch(0.15_0.03_250)] border border-primary/20 rounded-xl p-8">
                  <h3 className="text-white font-serif text-2xl mb-8 flex items-center gap-3">
                    <span className="text-3xl">🕓</span>
                    Tarde
                  </h3>
                  <p className="text-white/60 text-sm mb-6 font-semibold">Oportunidades y Decisiones (Presentación Real)</p>
                  <ul className="space-y-6">
                    {agendaTarde.map((item, i) => (
                      <li key={i} className="border-l-2 border-primary/30 pl-4">
                        <p className="text-white font-semibold mb-1">{item.title}</p>
                        <p className="text-white/60 text-sm">{item.description}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </FadeIn>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ OPORTUNIDADES ═══ */}
      <section className="section-dark py-24 md:py-32">
        <div className="container">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-serif text-white mb-12 text-center">Oportunidades que se Presentarán</h2>
            <p className="text-white/60 text-center mb-12 max-w-2xl mx-auto">Enfoque 100% pasivo, conservador y patrimonial. El acceso al evento no garantiza inversión, solo acceso al proceso de evaluación.</p>

            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {/* Fondo de Tierra */}
              <FadeIn delay={0.1}>
                <Card className="bg-[oklch(0.15_0.03_250)] border-white/5 hover:border-primary/30 transition-all overflow-hidden">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663291837994/AJaAcwphYIqTLsYA.jpg"
                      alt="Fondo de Tierra Estratégica"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.08_0.03_250/0.2)] to-transparent" />
                  </div>
                  <CardContent className="p-8">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
                      <Home className="w-6 h-6" />
                    </div>
                    <h3 className="text-white font-serif text-2xl mb-3">Fondo de Tierra Estratégica</h3>
                    <p className="text-white/70 mb-6">
                      Visión de largo plazo, conservación de capital y estrategia patrimonial en Florida y Arizona.
                    </p>
                    <div className="space-y-2">
                      <p className="text-primary text-sm font-semibold">📍 Ubicaciones</p>
                      <p className="text-white/60 text-sm">Florida · Arizona</p>
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>

              {/* Single Family Homes */}
              <FadeIn delay={0.2}>
                <Card className="bg-[oklch(0.15_0.03_250)] border-primary/20 hover:border-primary/50 transition-all overflow-hidden">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663291837994/VtIUGxjVltVLlaTv.jpg"
                      alt="Single Family Homes"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.08_0.03_250/0.2)] to-transparent" />
                  </div>
                  <CardContent className="p-8">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-4">
                      <Briefcase className="w-6 h-6" />
                    </div>
                    <h3 className="text-white font-serif text-2xl mb-3">Single Family Homes</h3>
                    <p className="text-white/70 mb-6">
                      Modelo pasivo orientado a renta y resguardo de valor para capital conservador en New York.
                    </p>
                    <div className="space-y-2">
                      <p className="text-primary text-sm font-semibold">💰 Enfoque</p>
                      <p className="text-white/60 text-sm">Renta + Resguardo de Valor</p>
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ PRECIOS ═══ */}
      <section className="section-darker py-24 md:py-32">
        <div className="container">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-serif text-white mb-12 text-center">Acceso Privado</h2>

            <div className="max-w-2xl mx-auto mb-12">
              <Card className="bg-gradient-to-r from-primary/10 to-transparent border-primary/20">
                <CardContent className="p-8">
                  <p className="text-white/70 mb-6">
                    El ticket funciona como filtro de compromiso. Cupo limitado a <strong>16 inversionistas</strong>.
                  </p>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <p className="text-white/50 text-sm mb-1">Valor Real</p>
                      <p className="text-white font-serif text-2xl">$500 USD</p>
                    </div>
                    <div>
                      <p className="text-white/50 text-sm mb-1">Precio Preferencial</p>
                      <p className="text-primary font-serif text-2xl">$199-299 USD</p>
                    </div>
                  </div>
                  <div className="bg-black/30 rounded-lg p-4 mb-6">
                    <p className="text-white/60 text-sm">
                      <strong>Hasta 15 de marzo:</strong> $199 USD<br/>
                      <strong>A partir del 16 de marzo:</strong> $299 USD
                    </p>
                  </div>
                  <p className="text-white/50 text-xs">
                    La compra del ticket no garantiza acceso a inversión. Acceso a oportunidades sujeto a evaluación de perfil.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Registro WhatsApp */}
              <FadeIn delay={0.1}>
                <div className="bg-[oklch(0.15_0.03_250)] border border-white/5 rounded-xl p-8 text-center">
                  <h3 className="text-white font-semibold mb-4">Paso 1: Validar Perfil</h3>
                  <p className="text-white/70 text-sm mb-6">
                    Escribe tu ciudad por WhatsApp para validar tu perfil y recibir confirmación de cupo.
                  </p>
                  <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                    <Button className="bg-primary hover:bg-primary-dark text-white w-full">
                      Contactar por WhatsApp
                    </Button>
                  </a>
                </div>
              </FadeIn>

              {/* Pago Clover */}
              <FadeIn delay={0.2}>
                <div className="bg-[oklch(0.15_0.03_250)] border border-primary/20 rounded-xl p-8 text-center">
                  <h3 className="text-white font-semibold mb-4">Paso 2: Confirmar Acceso</h3>
                  <p className="text-white/70 text-sm mb-6">
                    Adquiere tu acceso con pago seguro mediante Clover después de validar tu perfil.
                  </p>
                  <a href={CLOVER_PAYMENT_URL} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" className="border-white/20 text-white hover:bg-white/5 w-full">
                      Pagar con Clover
                    </Button>
                  </a>
                </div>
              </FadeIn>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ EDMUNDO ═══ */}
      <section className="section-dark py-24 md:py-32">
        <div className="container">
          <FadeIn>
            <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
              <div className="relative rounded-2xl overflow-hidden">
                <img
                  src="/edmundo-trevino.jpg"
                  alt="Edmundo Treviño"
                  className="w-full h-[400px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.08_0.03_250)] to-transparent" />
              </div>

              <div>
                <h2 className="text-3xl md:text-4xl font-serif text-white mb-6">Edmundo Treviño</h2>
                <p className="text-white/70 text-lg leading-relaxed mb-8">
                  Empresario binacional y fundador de Comprando América. Su enfoque se centra en estrategia patrimonial, estructura legal y ejecución real.
                </p>

                <div className="space-y-4 mb-8">
                  <div className="flex items-start gap-4">
                    <Shield className="w-5 h-5 text-primary shrink-0 mt-1" />
                    <div>
                      <p className="text-white font-semibold">Enfoque</p>
                      <p className="text-white/60 text-sm">Pasivo · Conservador · Patrimonial</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <DollarSign className="w-5 h-5 text-primary shrink-0 mt-1" />
                    <div>
                      <p className="text-white font-semibold">Capital Mínimo</p>
                      <p className="text-white/60 text-sm">Desde $100,000 USD</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <Users className="w-5 h-5 text-primary shrink-0 mt-1" />
                    <div>
                      <p className="text-white font-semibold">Cupo Limitado</p>
                      <p className="text-white/60 text-sm">16 inversionistas por evento</p>
                    </div>
                  </div>
                </div>

                <p className="text-white/50 text-sm italic">
                  "Esta es una sala privada para alinear expectativas, evaluar perfil y definir siguientes pasos reales."
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section className="section-darker py-24 md:py-32">
        <div className="container">
          <FadeIn>
            <h2 className="text-3xl md:text-4xl font-serif text-white mb-4 text-center">Preguntas Frecuentes</h2>
            <p className="text-white/60 text-center mb-12 max-w-2xl mx-auto">Respuestas claras para un evento privado de alto perfil.</p>

            <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="space-y-4">
                {faqItems.map((item) => (
                  <AccordionItem
                    key={item.id}
                    value={item.id}
                    className="bg-[oklch(0.15_0.03_250)] border border-white/5 rounded-lg px-6 data-[state=open]:border-primary/30"
                  >
                    <AccordionTrigger className="text-white hover:text-primary transition-colors py-4">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-white/70 pb-4">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ CTA FINAL ═══ */}
      <section className="section-dark py-24 md:py-32">
        <div className="container">
          <FadeIn>
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-serif text-white mb-6">¿Listo para Proteger tu Patrimonio?</h2>
              <p className="text-white/70 text-lg leading-relaxed mb-10">
                El cupo es limitado y se asigna por orden de validación de perfil. Si calificas, tendrás acceso a una sala privada con información real y oportunidades concretas.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                  <Button className="bg-primary hover:bg-primary-dark text-white font-semibold px-8 py-6 text-base gap-2">
                    Reservar Ahora <ArrowRight className="w-4 h-4" />
                  </Button>
                </a>
                <a href={CLOVER_PAYMENT_URL} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="border-white/20 text-white hover:bg-white/5 px-8 py-6 text-base">
                    Confirmar Acceso
                  </Button>
                </a>
              </div>

              <p className="text-white/50 text-sm mt-8">
                La compra del ticket no garantiza inversión. Acceso a oportunidades sujeto a evaluación de perfil.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      <Footer />
    </div>
  );
}
