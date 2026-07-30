/*
 * /estructura-empresarial-en-estados-unidos — URL canónica del servicio LLC
 * /llc redirige aquí con 301 permanente
 */
import { useState, useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useInView } from "@/hooks/useInView";
import { postCrmLead, getSavedContact } from "@/lib/crm";
import { trackPageVisit, visitedRecently } from "@/lib/journey";
import EstructuraFlow, { type EstructuraFlowHandle } from "@/components/EstructuraFlow";
import AdvisoryDisclaimer from "@/components/AdvisoryDisclaimer";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ArrowRight,
  X,
  CheckCircle2,
  XCircle,
  Building2,
  MapPin,
  FileCheck,
  Shield,
  Users,
  BookOpen,
  AlertTriangle,
} from "lucide-react";
import SEOHead from "@/components/SEOHead";

/* ─── Clover checkout links ─── */
const CLOVER = {
  texas: "https://www.clover.com/pay-widgets/b3f65360-1554-4b11-9175-f415a63ff74a",
  florida: "https://link.clover.com/urlshortener/SFHYf2",
};

function handleCheckout(state: "texas" | "florida") {
  if (typeof window !== "undefined" && (window as any).fbq) {
    (window as any).fbq("track", "InitiateCheckout", { value: 1499, currency: "USD" });
  }
  window.location.href = CLOVER[state];
}

/* ─── SEO ─── */
const PAGE_SEO = {
  title: "Crear una LLC en Texas o Florida | Comprando América",
  description:
    "Forma tu LLC en Texas o Florida con registro estatal, Registered Agent, EIN y una guía clara para comenzar a operar en Estados Unidos.",
  path: "/estructura-empresarial-en-estados-unidos",
  schema: {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      { "@type": "Question", name: "¿Un extranjero puede ser propietario de una LLC?", acceptedAnswer: { "@type": "Answer", text: "Sí. No se requiere ciudadanía, visa ni residencia. Solo pasaporte y un Registered Agent." } },
      { "@type": "Question", name: "¿Cuánto cuesta formar una LLC en Texas o Florida?", acceptedAnswer: { "@type": "Answer", text: "El servicio de Comprando América tiene un costo de $1,499 USD, pago único, e incluye registro estatal, Registered Agent por un año, EIN y documentación organizada." } },
      { "@type": "Question", name: "¿Qué es el EIN?", acceptedAnswer: { "@type": "Answer", text: "Es el Employer Identification Number: el número de identificación fiscal federal de la empresa. Es necesario para abrir cuentas bancarias, contratar y cumplir obligaciones fiscales." } },
    ],
  },
};

/* ─── FadeIn ─── */
function FadeIn({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const { ref, isInView } = useInView();
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay, ease: "easeOut" }} className={className}>
      {children}
    </motion.div>
  );
}

/* ─── Modal wrapper ─── */
function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            className="relative bg-[#0F2847] border border-[#1E3A5F] rounded-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto shadow-2xl"
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-between p-6 border-b border-[#1E3A5F]">
              <h3 className="text-white font-semibold text-lg">{title}</h3>
              <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 text-slate-300 leading-relaxed space-y-4">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─── Contextual link ─── */
function ContextLink({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} className="text-primary text-xs font-semibold underline underline-offset-2 hover:text-blue-300 transition-colors mt-1 block">
      {children} →
    </button>
  );
}

export default function EstructuraEmpresarial() {
  /* Modals */
  const [modal, setModal] = useState<string | null>(null);
  const openModal = (id: string) => setModal(id);
  const closeModal = () => setModal(null);

  /* Continuidad entre guías — personalización solo con señal real y reciente.
     El pre-llenado del contacto lo maneja EstructuraFlow con el dato guardado localmente. */
  const [visitedInversion, setVisitedInversion] = useState(false);

  /* El CTA fijo de móvil abre el diagnóstico de la entrada del hero, y se esconde
     mientras el flujo está abierto para no quedar encima del modal. */
  const entradaHero = useRef<EstructuraFlowHandle>(null);
  const [flujoAbierto, setFlujoAbierto] = useState(false);

  useEffect(() => {
    trackPageVisit("llc");
    const saved = getSavedContact();
    // El mensaje de continuidad solo aplica si la visita a la otra guía es RECIENTE:
    // una visita de hace semanas no es "la misma exploración" y se sentía falsa.
    if (visitedRecently("inversion")) {
      setVisitedInversion(true);
      postCrmLead(
        {
          ...(saved ? { name: saved.name, email: saved.email, phone: saved.phone } : {}),
          sourceSlug: "web_ca_llc",
          hito: "cruce_de_pagina",
          stage: "partial",
          tags: ["interes:llc"],
        },
        "",
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-[#0B1F3A] text-white overflow-x-hidden">
      <SEOHead {...PAGE_SEO} />
      <Navbar />

      {/* ══════════════════════════════════════════
          1. HERO
      ══════════════════════════════════════════ */}
      <section className="relative min-h-[90vh] flex items-center pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://lh3.googleusercontent.com/d/1RK1ICQKrETpZBFYH_NoZmnYzMULHREYu=w1920" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B1F3A]/97 via-[#0B1F3A]/85 to-[#0B1F3A]/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F3A] via-transparent to-transparent" />
        </div>

        <div className="container relative z-10">
          <FadeIn>
            <div className="max-w-3xl">
              <p className="text-primary text-xs font-bold tracking-[0.3em] uppercase mb-6 font-mono">
                Estructura Empresarial · Texas & Florida
              </p>
              {/* El hero abre con la pregunta, no con la oferta: quien llega aquí todavía
                  está decidiendo. El precio y lo que incluye el servicio viven más abajo,
                  en las secciones que corresponden. */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl text-white leading-[1.15] mb-6 font-bold">
                Hay una pregunta que casi nadie se hace antes de abrir una empresa en Estados Unidos:{" "}
                <span className="text-primary">¿realmente necesitas una?</span>
              </h1>
              <div className="space-y-4 mb-8 max-w-2xl">
                <p className="text-slate-300 text-lg md:text-xl leading-relaxed">
                  Miles de empresarios comienzan buscando una LLC. Muy pocos comienzan preguntándose si
                  esa es realmente la estructura correcta para el proyecto que quieren construir.
                </p>
                <p className="text-slate-300 text-lg md:text-xl leading-relaxed">
                  En Comprando América desarrollamos un diagnóstico para ayudarte a responder esa
                  pregunta antes de tomar una decisión.
                </p>
              </div>

              {/* Continuidad: solo con señal real y reciente (ver lib/journey) */}
              {visitedInversion && (
                <p className="text-slate-400 text-sm mb-4 max-w-2xl">
                  Vimos que hace un momento revisaste la guía de estructura de inversión. Retomamos desde aquí.
                </p>
              )}
              {/* Mismo punto de entrada de dos puertas de toda la página, con el diagnóstico
                  al frente: aquí la decisión todavía no está tomada. */}
              <EstructuraFlow
                ref={entradaHero}
                sourceSlug="web_ca_llc"
                onCheckout={handleCheckout}
                className="max-w-2xl"
                variant="diagnostico-primero"
                onOpenChange={setFlujoAbierto}
              />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          3. QUÉ INCLUYE
      ══════════════════════════════════════════ */}
      <section className="bg-[#0E2544] py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="text-center mb-12">
              <p className="text-primary text-xs font-bold tracking-[0.3em] uppercase mb-3 font-mono">Qué incluye</p>
              <h2 className="text-3xl md:text-4xl text-white font-bold">Tu LLC, lista para comenzar correctamente</h2>
            </div>
          </FadeIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {[
              {
                icon: Building2,
                title: "Registro estatal",
                desc: "Constitución de la LLC en Texas o Florida.",
                link: "Ver qué documento se recibe",
                modal: "doc-registro",
              },
              {
                icon: MapPin,
                title: "Registered Agent por un año",
                desc: "Domicilio y representación registrada conforme a los requisitos estatales.",
                link: "Entender su función",
                modal: "registered-agent",
              },
              {
                icon: FileCheck,
                title: "EIN federal",
                desc: "Solicitud del número de identificación fiscal de la empresa.",
                link: "¿Para qué se utiliza?",
                modal: "ein",
              },
              {
                icon: BookOpen,
                title: "Documentación de constitución",
                desc: "Entrega organizada de los documentos generados durante el proceso.",
                link: "Ver documentos incluidos",
                modal: "documentacion",
              },
              {
                icon: Shield,
                title: "Orientación de cierre",
                desc: "Al entregar tu expediente, aclaramos las preguntas más comunes sobre los pasos que siguen: cumplimiento, banca y operación.",
                link: "¿Qué ocurre después?",
                modal: "guia",
              },
            ].map((item, i) => (
              <FadeIn key={i} delay={i * 0.08}>
                <div className="bg-[#0F2847] border border-[#1E3A5F] rounded-2xl p-6 h-full hover:border-blue-500/30 transition-all flex flex-col">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 bg-blue-500/10 border border-blue-500/20 flex-shrink-0">
                    <item.icon className="w-5 h-5 text-blue-400" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">{item.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed flex-1">{item.desc}</p>
                  <ContextLink onClick={() => openModal(item.modal)}>{item.link}</ContextLink>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          4. TEXAS O FLORIDA
      ══════════════════════════════════════════ */}
      <section className="bg-white py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-10">
                <p className="text-primary text-xs font-bold tracking-[0.3em] uppercase mb-3 font-mono">Estado</p>
                <h2 className="text-3xl md:text-4xl text-[#0B1F3A] font-bold">Texas o Florida</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {[
                  {
                    state: "Texas",
                    desc: "Puede tener sentido cuando la operación, presencia comercial, clientes, personal o administración estarán principalmente en Texas.",
                    points: ["Sin impuesto estatal sobre la renta", "Ecosistema empresarial sólido", "Comunidad latina activa", "Ideal para operaciones comerciales"],
                    checkout: "texas" as const,
                  },
                  {
                    state: "Florida",
                    desc: "Puede tener sentido cuando la actividad, propiedades, mercado o presencia principal se encontrarán en Florida.",
                    points: ["Sin impuesto estatal sobre la renta", "Fuerte conexión con Latinoamérica", "Mercado inmobiliario activo", "Ideal para negocios digitales y bienes raíces"],
                    checkout: "florida" as const,
                  },
                ].map((item) => (
                  <div key={item.state} className="bg-[#F5F7FA] border border-gray-200 rounded-2xl p-8">
                    <h3 className="text-2xl font-bold text-[#0B1F3A] mb-3">{item.state}</h3>
                    <p className="text-[#6B7280] text-sm mb-5 leading-relaxed">{item.desc}</p>
                    <div className="space-y-2 mb-6">
                      {item.points.map((p, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-[#374151]">
                          <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                          {p}
                        </div>
                      ))}
                    </div>
                    <Button onClick={() => handleCheckout(item.checkout)} className="w-full bg-primary hover:bg-blue-600 text-white gap-2 rounded-xl py-4">
                      Iniciar LLC en {item.state} <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <div className="text-center">
                <p className="text-[#6B7280] text-sm mb-4 italic">
                  No elegimos el estado por popularidad. Lo elegimos con base en dónde y cómo funcionará la empresa.
                </p>
                <Button variant="outline" onClick={() => openModal("comparar-estados")} className="border-gray-300 text-[#374151] hover:bg-gray-100 gap-2 rounded-full">
                  Comparar Texas y Florida
                </Button>
                <p className="text-[#9CA3AF] text-xs mt-4 max-w-xl mx-auto">
                  La selección del estado no constituye asesoría fiscal o legal especializada. Cuando el caso tiene implicaciones más amplias, se recomendará consultar al especialista correspondiente.
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          5. PROCESO
      ══════════════════════════════════════════ */}
      <section className="bg-[#0B1F3A] py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <p className="text-primary text-xs font-bold tracking-[0.3em] uppercase mb-3 font-mono">Proceso</p>
                <h2 className="text-3xl md:text-4xl text-white font-bold">Un proceso claro, sin hacerlo más complicado de lo necesario</h2>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { step: "01", title: "Compártenos tu información", desc: "Datos del propietario, nombre propuesto, actividad y estado." },
                  { step: "02", title: "Revisamos la solicitud", desc: "Validamos que la información sea suficiente y que el servicio corresponda al caso." },
                  { step: "03", title: "Constituimos la LLC", desc: "Realizamos el registro estatal y gestionamos los elementos incluidos." },
                  { step: "04", title: "Recibes tu expediente y guía", desc: "Entregamos la documentación organizada y los pasos recomendados para continuar." },
                ].map((item, i) => (
                  <FadeIn key={i} delay={i * 0.1}>
                    <div className="relative">
                      <div className="text-6xl font-black text-blue-500/10 select-none mb-2">{item.step}</div>
                      <h3 className="text-white font-semibold mb-2 text-sm">{item.title}</h3>
                      <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </FadeIn>
                ))}
              </div>

              <FadeIn delay={0.4}>
                <div className="mt-10 text-center">
                  <p className="text-slate-500 text-sm italic">
                    Tiempo habitual estimado: entre dos y cuatro semanas, sujeto a procesamiento estatal y federal.
                  </p>
                </div>
              </FadeIn>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          6. FILTRO ESTRATÉGICO
      ══════════════════════════════════════════ */}
      <section className="bg-[#F5F7FA] py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-10">
                <p className="text-primary text-xs font-bold tracking-[0.3em] uppercase mb-3 font-mono">Antes de contratar</p>
                <h2 className="text-2xl md:text-3xl font-bold text-[#0B1F3A]">Una LLC puede ser suficiente. A veces no lo es.</h2>
                <p className="text-[#6B7280] mt-3 text-sm max-w-xl mx-auto">
                  Conviene revisar tu estructura antes de contratar cuando alguna de estas señales aplica a tu caso:
                </p>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
                {[
                  { icon: Users, text: "Participarán varios socios." },
                  { icon: AlertTriangle, text: "Recibirás dinero de inversionistas." },
                  { icon: Building2, text: "Comprarás diferentes propiedades o negocios." },
                  { icon: MapPin, text: "Ya tienes una empresa en otro país." },
                  { icon: Shield, text: "Buscas una visa relacionada con la operación." },
                  { icon: FileCheck, text: "Necesitas separar diferentes activos o riesgos." },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                    <item.icon className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <p className="text-[#374151] text-sm">{item.text}</p>
                  </div>
                ))}
              </div>

              <div className="text-center">
                <a href="#entrada-estructura">
                  <Button
                    variant="outline"
                    className="border-gray-300 text-[#374151] hover:bg-gray-100 gap-2 rounded-full px-8 py-5"
                  >
                    Revisar si mi caso necesita otra estructura
                  </Button>
                </a>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          7. ALCANCES Y LÍMITES
      ══════════════════════════════════════════ */}
      <section className="bg-[#0E2544] py-20 md:py-28">
        <div className="container">
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-10">
            <FadeIn>
              <div>
                <p className="text-primary text-xs font-bold tracking-[0.3em] uppercase mb-4 font-mono">Lo que incluye</p>
                <div className="space-y-3">
                  {[
                    "Constitución de LLC en Texas o Florida",
                    "Registered Agent durante el primer año",
                    "Obtención del EIN",
                    "Organización de documentación",
                    "Orientación de cierre sobre los pasos que siguen",
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                      <p className="text-slate-300 text-sm">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.1}>
              <div>
                <p className="text-amber-400 text-xs font-bold tracking-[0.3em] uppercase mb-4 font-mono">Lo que no incluye</p>
                <div className="space-y-3 mb-6">
                  {[
                    "Apertura bancaria garantizada",
                    "Aprobación de crédito",
                    "Reducción automática de impuestos",
                    "Elegibilidad o aprobación de visa",
                    "Asesoría legal o fiscal especializada",
                    "Contratos personalizados",
                    "Contabilidad o declaraciones recurrentes",
                    "Estructuras internacionales complejas",
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <XCircle className="w-4 h-4 text-slate-500 flex-shrink-0" />
                      <p className="text-slate-500 text-sm">{item}</p>
                    </div>
                  ))}
                </div>
                <p className="text-slate-400 text-sm italic border-l-2 border-primary/40 pl-4">
                  Preferimos decirte con claridad qué resuelve una LLC y qué requiere la intervención de otro especialista.
                </p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          8. AUTORIDAD
      ══════════════════════════════════════════ */}
      <section className="bg-white py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="max-w-3xl mx-auto">
              <p className="text-primary text-xs font-bold tracking-[0.3em] uppercase mb-4 font-mono">Nuestra postura</p>
              <h2 className="text-2xl md:text-3xl font-bold text-[#0B1F3A] mb-6">
                No vendemos una LLC como respuesta para todo
              </h2>
              <p className="text-[#4B5563] text-lg leading-relaxed mb-8">
                En Comprando América entendemos que una empresa es una herramienta. Para algunas personas, una LLC
                sencilla es exactamente lo que necesitan. Para otras, abrirla sin revisar primero su operación, sus
                socios o sus inversiones puede crear problemas posteriores.
              </p>
              <p className="text-[#4B5563] text-lg leading-relaxed mb-8">
                Por eso ofrecemos el servicio de formación de LLC de manera independiente, pero conservamos una
                revisión inicial para confirmar que el trámite corresponda a la necesidad real.
              </p>
              <div className="bg-[#F5F7FA] border-l-4 border-primary rounded-r-xl p-6">
                <p className="text-[#0B1F3A] font-semibold text-lg italic">
                  "La estructura correcta no es la más compleja. Es la que corresponde a lo que realmente vas a hacer."
                </p>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          9. FAQ
      ══════════════════════════════════════════ */}
      <section className="bg-[#0B1F3A] py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="max-w-3xl mx-auto">
              <p className="text-primary text-xs font-bold tracking-[0.3em] uppercase mb-3 font-mono text-center">FAQ</p>
              <h2 className="text-3xl md:text-4xl text-white font-bold text-center mb-12">Preguntas frecuentes</h2>
              <Accordion type="single" collapsible className="space-y-4">
                {[
                  { q: "¿Un extranjero puede ser propietario de una LLC?", a: "Sí. No se requiere ciudadanía, visa ni residencia. Solo se necesita un pasaporte válido y un Registered Agent en el estado donde se constituye la LLC." },
                  { q: "¿Necesito vivir en Estados Unidos?", a: "No. Puedes constituir y operar una LLC de forma remota desde cualquier país. Muchos empresarios latinoamericanos operan empresas en Estados Unidos sin residir allí." },
                  { q: "¿Cuál es la diferencia entre una LLC en Texas y Florida?", a: "Ambos estados no tienen impuesto estatal sobre la renta. Texas es favorable para operaciones comerciales y tiene un ecosistema empresarial sólido. Florida es preferida para bienes raíces, negocios digitales y por su conexión con Latinoamérica. La elección depende de dónde estará el centro de tu operación." },
                  { q: "¿Qué es el EIN?", a: "El Employer Identification Number es el número de identificación fiscal federal de tu empresa. Es necesario para abrir cuentas bancarias, contratar empleados, celebrar contratos y cumplir con obligaciones fiscales ante el IRS." },
                  { q: "¿La cuenta bancaria está incluida?", a: "No. Te entregamos orientación inicial y la documentación necesaria para el proceso bancario, pero la apertura de cuenta es un proceso independiente que depende del banco. Te guiamos en los pasos siguientes." },
                  { q: "¿La LLC me permite obtener una visa?", a: "Una LLC puede formar parte de una operación utilizada dentro de una estrategia migratoria, como la visa E-2. Sin embargo, constituir la empresa por sí sola no crea elegibilidad ni garantiza ninguna visa. Si tu objetivo incluye residencia o visa, conviene revisar la estructura antes de constituir." },
                  { q: "¿Qué obligaciones continúan después de formar la empresa?", a: "Después del primer año, la LLC genera obligaciones de mantenimiento: renovación del Registered Agent, reportes estatales según el estado, cumplimiento fiscal federal (declaraciones de información), y en algunos casos reportes de beneficiarios (BOI). Al cerrar el proceso, aclaramos las más comunes para que sepas qué esperar." },
                  { q: "¿Puedo incluir socios?", a: "Sí. Si la LLC tendrá más de un miembro, es importante que el Operating Agreement refleje claramente los derechos, responsabilidades y porcentajes de participación de cada socio. Cuando hay socios, conviene revisar la estructura con más detalle antes de constituir." },
                  { q: "¿Cuándo necesito una estructura más avanzada?", a: "Cuando participan varios socios, cuando se recibirá inversión de terceros, cuando hay múltiples propiedades o activos, cuando existe una empresa en otro país relacionada, o cuando se evalúa una visa vinculada a la operación. En esos casos, conviene una revisión de estructura antes de constituir." },
                  { q: "¿Qué pasa después del primer año del Registered Agent?", a: "El Registered Agent debe renovarse anualmente. Al acercarse el vencimiento, te informamos sobre las opciones de renovación. No renovarlo puede causar problemas de estatus de la LLC ante el estado." },
                ].map((faq, i) => (
                  <AccordionItem key={i} value={`faq-${i}`} className="bg-[#0F2847] border border-[#1E3A5F] rounded-xl px-6">
                    <AccordionTrigger className="text-white text-left hover:no-underline py-5 text-sm">{faq.q}</AccordionTrigger>
                    <AccordionContent className="text-slate-400 leading-relaxed pb-5 text-sm">{faq.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          10. CIERRE
      ══════════════════════════════════════════ */}
      <section className="bg-[#091A30] py-24 md:py-32">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <FadeIn>
              <h2 className="text-3xl md:text-4xl text-white font-bold mb-4">Tu empresa debe comenzar con claridad</h2>
              <p className="text-slate-400 leading-relaxed mb-8">
                Cuando una LLC corresponde a tu objetivo, el proceso no tiene por qué ser complicado. Te ayudamos a
                constituirla en Texas o Florida, organizar su documentación y entender los pasos que continúan.
              </p>
              <div className="text-4xl font-bold text-white mb-2">USD 1,499</div>
              <p className="text-slate-500 text-sm mb-10">Pago único por la formación de la LLC y los servicios incluidos.</p>
              {/* Misma puerta de entrada del hero — un solo mecanismo en toda la página */}
              <EstructuraFlow sourceSlug="web_ca_llc" onCheckout={handleCheckout} className="text-left" anchorId="entrada-estructura" onOpenChange={setFlujoAbierto} />
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── Aviso de cumplimiento ── */}
      <section className="bg-[#0B1F3A] pb-16">
        <div className="container">
          <AdvisoryDisclaimer className="max-w-3xl mx-auto" />
        </div>
      </section>

      {/* ── CTA fijo en móvil ──
          Antes saltaba al checkout de Texas sin preguntar el estado, incluso a quien
          iba a operar en Florida. Ahora abre el diagnóstico; la compra directa sigue
          a un toque desde dentro ("Solo quiero mi LLC" está en cada paso). */}
      {/* El pr- deja libre la esquina donde flota el botón de WhatsApp (bottom-6 right-6),
          que antes tapaba el final de la etiqueta. */}
      <div className={`fixed bottom-0 left-0 right-0 bg-[#0B1F3A] border-t border-[#1E3A5F] p-4 pr-[92px] z-40 ${flujoAbierto ? "hidden" : "md:hidden"}`}>
        <button
          onClick={() => entradaHero.current?.abrirDiagnostico()}
          className="w-full bg-primary hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition-all text-sm inline-flex items-center justify-center gap-2"
        >
          Hacer el diagnóstico <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <Footer />

      {/* ══════════════════════════════════════════
          MODALS
      ══════════════════════════════════════════ */}

      {/* Comparar estados */}
      <Modal open={modal === "comparar-estados"} onClose={closeModal} title="Texas vs Florida — Comparación operativa">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1E3A5F]">
                <th className="text-left text-slate-400 pb-3 font-normal">Criterio</th>
                <th className="text-left text-white pb-3 pl-4">Texas</th>
                <th className="text-left text-white pb-3 pl-4">Florida</th>
              </tr>
            </thead>
            <tbody className="space-y-2">
              {[
                ["Cuota estatal inicial", "~$300 USD", "~$125 USD"],
                ["Reportes recurrentes", "Reporte anual", "Reporte anual"],
                ["Impuesto estatal renta", "No aplica", "No aplica"],
                ["Presencia física requerida", "No", "No"],
                ["Tipo de actividad común", "Operaciones, servicios, comercio", "Bienes raíces, digital, LATAM"],
                ["Registered Agent requerido", "Sí", "Sí"],
                ["Consideraciones clave", "Mayor protección patrimonial", "Mercado inmobiliario activo"],
              ].map(([crit, tx, fl], i) => (
                <tr key={i} className="border-b border-[#1E3A5F]/50">
                  <td className="py-3 text-slate-400">{crit}</td>
                  <td className="py-3 pl-4 text-white">{tx}</td>
                  <td className="py-3 pl-4 text-white">{fl}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-slate-500 text-xs italic mt-2">
          La selección del estado no constituye asesoría fiscal o legal especializada.
        </p>
      </Modal>

      {/* Registro doc */}
      <Modal open={modal === "doc-registro"} onClose={closeModal} title="¿Qué documento se recibe con el registro?">
        <p>Al completar el registro estatal recibes el <strong className="text-white">Certificate of Formation</strong> (Texas) o el <strong className="text-white">Articles of Organization</strong> (Florida), emitido por la Secretaría de Estado correspondiente.</p>
        <p>Este documento acredita la existencia legal de la LLC y es necesario para abrir cuentas bancarias, celebrar contratos y operar oficialmente.</p>
      </Modal>

      {/* Registered Agent */}
      <Modal open={modal === "registered-agent"} onClose={closeModal} title="¿Qué es el Registered Agent?">
        <p>El Registered Agent es la persona o entidad designada para recibir documentos legales, notificaciones oficiales y correspondencia del gobierno en nombre de la LLC.</p>
        <p>Todos los estados de Estados Unidos exigen que cada LLC tenga un Registered Agent con dirección física en el estado donde está registrada.</p>
        <p>El servicio incluye un año de Registered Agent. Después del primer año debe renovarse.</p>
      </Modal>

      {/* EIN */}
      <Modal open={modal === "ein"} onClose={closeModal} title="¿Qué es el EIN y para qué se utiliza?">
        <p>El <strong className="text-white">Employer Identification Number (EIN)</strong> es el número de identificación fiscal federal de tu empresa, emitido por el IRS.</p>
        <p>Es necesario para:</p>
        <ul className="list-disc pl-4 space-y-1">
          <li>Abrir cuentas bancarias empresariales</li>
          <li>Contratar empleados</li>
          <li>Celebrar contratos con clientes en Estados Unidos</li>
          <li>Cumplir obligaciones fiscales ante el IRS</li>
          <li>Solicitar crédito empresarial</li>
        </ul>
        <p>Los extranjeros sin SSN pueden obtener el EIN a través del proceso de solicitud correspondiente.</p>
      </Modal>

      {/* Documentación */}
      <Modal open={modal === "documentacion"} onClose={closeModal} title="Documentos incluidos en el expediente">
        <ul className="space-y-2">
          {["Certificate of Formation o Articles of Organization", "Operating Agreement básico", "EIN del IRS", "Confirmación del Registered Agent"].map((doc, i) => (
            <li key={i} className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
              <span>{doc}</span>
            </li>
          ))}
        </ul>
        <p className="text-slate-400 text-sm">Todos los documentos se entregan organizados en formato digital.</p>
      </Modal>

      {/* Guía */}
      <Modal open={modal === "guia"} onClose={closeModal} title="¿Qué ocurre después de formar la LLC?">
        <p>Al entregar el expediente, aclaramos las preguntas más comunes que surgen en ese momento: qué sigue con la cuenta bancaria, cuáles son las obligaciones de mantenimiento anuales y cuándo conviene contactar a un contador o abogado.</p>
        <p>Esta orientación no es un documento entregable ni una asesoría formal. Es la claridad práctica que corresponde al cierre del proceso de constitución.</p>
        <p className="text-slate-400 text-sm">Para cumplimiento contable, fiscal o legal recurrente, recomendamos trabajar con el especialista correspondiente según el caso.</p>
      </Modal>

    </div>
  );
}
