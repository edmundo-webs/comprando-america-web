import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useInView } from "@/hooks/useInView";
import { openWhatsApp, WHATSAPP_PHONE } from "@/lib/whatsapp";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Building2,
  Shield,
  FileCheck,
  DollarSign,
  Scale,
  X,
  Compass,
  TrendingUp,
  UserCheck,
  MessageSquare,
} from "lucide-react";
import { postCrmLead, saveContact, getSavedContact } from "@/lib/crm";
import { trackPageVisit, getJourney } from "@/lib/journey";
import EstructuraIntentSelector from "@/components/EstructuraIntentSelector";
import AdvisoryDisclaimer from "@/components/AdvisoryDisclaimer";

const WA_MSG = "Hola, me interesa estructurar mi vehículo de inversión en Estados Unidos.";

/* ─── Modal wrapper (mismo estilo que la guía de LLC) ─── */
function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
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

/* ─── Diagnóstico de estructura de inversión ───
   Espejo funcional del diagnóstico de LLC. Lógica de árbol determinística,
   sin IA generativa. Nunca promete retornos ni asesora visas directamente. */
type InvObjetivo = "capital" | "expansion" | "visa" | "explorando";
type InvResult = "calificado" | "capital_insuficiente" | "expansion" | "visa" | "explorando";

const INV_Q1_OPTIONS: { label: string; value: InvObjetivo }[] = [
  { label: "Tengo capital y quiero estructurar cómo invertirlo", value: "capital" },
  { label: "Ya tengo una empresa fuera de Estados Unidos y quiero expandirla", value: "expansion" },
  { label: "Estoy evaluando una visa ligada a mi inversión", value: "visa" },
  { label: "Todavía estoy explorando, sin nada decidido", value: "explorando" },
];

const INV_Q2_OPTIONS: { label: string; value: "menos" | "mas" }[] = [
  { label: "Menos de $100,000 USD", value: "menos" },
  { label: "$100,000 USD o más", value: "mas" },
];

/* Formulario de contacto del resultado (mismo patrón que la guía de LLC) */
function InvContactForm({
  form, setForm, honeypot, setHoneypot, onSubmit, submitting, sent, ctaLabel, knownName,
}: {
  form: { name: string; email: string; phone: string };
  setForm: (f: { name: string; email: string; phone: string }) => void;
  honeypot: string;
  setHoneypot: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  submitting: boolean;
  sent: boolean;
  ctaLabel: string;
  knownName: string | null;
}) {
  if (sent) {
    return (
      <div className="text-center py-4">
        <CheckCircle2 className="w-10 h-10 text-primary mx-auto mb-3" />
        <p className="text-white font-semibold mb-2">Información recibida</p>
        <p className="text-slate-400 text-sm leading-relaxed">
          Revisaremos tu caso y te contactaremos para coordinar los siguientes pasos.
        </p>
      </div>
    );
  }
  return (
    <form onSubmit={onSubmit} className="space-y-3 pt-2">
      {knownName && (
        <p className="text-slate-400 text-sm">¿Sigues siendo tú, {knownName.split(" ")[0]}? Dejamos tus datos listos; corrige lo que haga falta.</p>
      )}
      {[
        { key: "name", type: "text", label: "Nombre completo", placeholder: "Tu nombre completo" },
        { key: "email", type: "email", label: "Correo", placeholder: "correo@ejemplo.com" },
        { key: "phone", type: "tel", label: "WhatsApp (con código de país)", placeholder: "+52 555 000 0000" },
      ].map((f) => (
        <div key={f.key}>
          <label className="text-slate-400 text-xs block mb-1">{f.label}</label>
          <input
            type={f.type}
            required
            placeholder={f.placeholder}
            value={(form as any)[f.key]}
            onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
            className="w-full bg-[#091A30] border border-[#1E3A5F] rounded-lg px-4 py-3 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>
      ))}
      {/* Honeypot — invisible para humanos */}
      <div style={{ position: "absolute", left: "-9999px", top: "-9999px", width: "1px", height: "1px", overflow: "hidden" }} aria-hidden="true">
        <input type="text" name="website" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
      </div>
      <Button type="submit" disabled={submitting} className="w-full bg-primary hover:bg-blue-600 text-white rounded-xl py-4 font-semibold gap-2 mt-1 disabled:opacity-70">
        <MessageSquare className="w-4 h-4" /> {ctaLabel}
      </Button>
    </form>
  );
}

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
  title: "Estructura de Inversi\u00f3n en Estados Unidos | Comprando Am\u00e9rica",
  description: "Estructura tu veh\u00edculo de inversi\u00f3n en Estados Unidos con claridad y estrategia. LLC, C-Corp, S-Corp seg\u00fan tu caso.",
  path: "/estructura-de-inversion-en-usa",
};

/* ─── Photos ─── */
const HERO_IMAGE = "https://res.cloudinary.com/dgruohz6f/image/upload/v1773439156/comprando-america/NxiBRNllQxYRemFM.jpg";
const TAX_SLIDE = "https://lh3.googleusercontent.com/d/1rvNkomqY_CrfxTge9dQJBT1RdPdw08hM=w1920";
const AUDIENCE = "https://lh3.googleusercontent.com/d/1gnZX2RiYD4M29nQmqwcsN0k13db74LmV=w1920";

export default function EstructuraInversion() {
  /* Diagnóstico */
  const [diagOpen, setDiagOpen] = useState(false);
  const [step, setStep] = useState<"q1" | "q2" | "result">("q1");
  const [objetivo, setObjetivo] = useState<InvObjetivo | null>(null);
  const [capital, setCapital] = useState<"menos" | "mas" | null>(null);
  const [result, setResult] = useState<InvResult | null>(null);
  const [diagStartedPosted, setDiagStartedPosted] = useState(false);

  /* Formulario de contacto del resultado */
  const [invForm, setInvForm] = useState({ name: "", email: "", phone: "" });
  const [invHoneypot, setInvHoneypot] = useState("");
  const [invSent, setInvSent] = useState(false);
  const [invSubmitting, setInvSubmitting] = useState(false);

  /* Continuidad entre guías */
  const [visitedLlc, setVisitedLlc] = useState(false);
  const [knownName, setKnownName] = useState<string | null>(null);

  useEffect(() => {
    trackPageVisit("inversion");
    const visitedOther = getJourney().some((e) => e.page === "llc");
    if (!visitedOther) return;
    setVisitedLlc(true);
    const saved = getSavedContact();
    if (saved) {
      setKnownName(saved.name || null);
      setInvForm((prev) => ({
        name: prev.name || saved.name || "",
        email: prev.email || saved.email || "",
        phone: prev.phone || saved.phone || "",
      }));
    }
    postCrmLead(
      {
        ...(saved ? { name: saved.name, email: saved.email, phone: saved.phone } : {}),
        sourceSlug: "web_ca_inversion",
        hito: "cruce_de_pagina",
        stage: "partial",
        tags: ["interes:inversion"],
      },
      "",
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function openDiagnostic() {
    setStep("q1");
    setObjetivo(null);
    setCapital(null);
    setResult(null);
    setInvSent(false);
    setDiagOpen(true);
  }

  function postDiagStartedOnce() {
    if (diagStartedPosted) return;
    setDiagStartedPosted(true);
    postCrmLead({ sourceSlug: "web_ca_inversion", hito: "diagnostico_iniciado", stage: "partial", tags: ["interes:inversion"] }, "");
  }

  // Registra que el usuario llegó al resultado (aún sin dejar contacto; se une por visitorId).
  function reachResult(r: InvResult, obj: InvObjetivo, cap: "menos" | "mas" | null) {
    setResult(r);
    setStep("result");
    postCrmLead(
      {
        sourceSlug: "web_ca_inversion",
        hito: "diagnostico_completo",
        stage: "partial",
        tags: ["interes:inversion", `resultado:${r}`],
        notes: { objetivo: obj, capital: cap, resultado: r },
      },
      "",
    );
  }

  function handleQ1(value: InvObjetivo) {
    postDiagStartedOnce();
    setObjetivo(value);
    if (value === "capital") {
      setStep("q2");
    } else {
      reachResult(value as InvResult, value, null);
    }
  }

  function handleQ2(value: "menos" | "mas") {
    setCapital(value);
    reachResult(value === "menos" ? "capital_insuficiente" : "calificado", "capital", value);
  }

  function handleInvForm(e: React.FormEvent) {
    e.preventDefault();
    if (invSubmitting) return;
    setInvSubmitting(true);

    const tags =
      result === "expansion"
        ? ["interes:inversion", "interes:expansion", "resultado:expansion"]
        : result === "visa"
        ? ["interes:inversion", "interes:visa", "resultado:visa"]
        : ["interes:inversion", "resultado:calificado"];

    const notes: Record<string, unknown> = { objetivo, capital, resultado: result };
    if (result === "visa") notes.nota = "requiere coordinar con asesor migratorio externo";

    postCrmLead(
      {
        name: invForm.name,
        email: invForm.email,
        phone: invForm.phone,
        sourceSlug: "web_ca_inversion",
        // El resultado calificado solicita agendar orientación; los demás cierran el diagnóstico.
        hito: result === "calificado" ? "llamada_solicitada" : "diagnostico_completo",
        stage: "complete",
        tags,
        notes,
      },
      invHoneypot,
    );

    if (!invHoneypot) {
      saveContact({ name: invForm.name.trim(), email: invForm.email.trim(), phone: invForm.phone.trim() });
    }
    setInvSent(true);
  }

  return (
    <div className="min-h-screen bg-[#0B1F3A] text-white overflow-x-hidden">
      <SEOHead {...PAGE_SEO} />
      <Navbar />

      {/* ═══ 1. HERO ═══ */}
      <section className="relative min-h-[85vh] flex items-center pt-20 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <img src={HERO_IMAGE} alt="Estructura de inversión en Estados Unidos" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B1F3A]/95 via-[#0B1F3A]/85 to-[#0B1F3A]/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F3A] via-transparent to-[#0B1F3A]/30" />
        </div>

        <div className="container relative z-10">
          <FadeIn>
            <div className="max-w-3xl">
              <p className="text-blue-400 text-sm font-semibold tracking-[0.25em] uppercase mb-6 font-mono">Estrategia de Inversión</p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl text-white leading-tight mb-6">
                Estructura tu Vehículo de <span className="gradient-text-primary">Inversión en Estados Unidos</span> con Claridad y Estrategia
              </h1>
              <p className="text-slate-400 text-lg md:text-xl leading-relaxed mb-6 max-w-2xl">
                Para invertir en Estados Unidos con seriedad, el primer paso no es "abrir una empresa": es <strong className="text-white">estructurar correctamente tu vehículo legal y fiscal</strong> para ejecutar inversiones con control de riesgo y cumplimiento.
              </p>

              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mb-8 max-w-xl">
                <p className="text-white font-semibold text-sm">
                  Disponible para miembros con capacidad de inversión desde <span className="text-primary">$100,000 USD</span>.
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <Button onClick={openDiagnostic} className="bg-primary hover:bg-blue-600 text-white px-8 py-6 text-base gap-2 shadow-lg shadow-blue-600/25">
                  Iniciar diagnóstico <ArrowRight className="w-4 h-4" />
                </Button>
                <a href="https://comprandoamerica.com/gps">
                  <Button variant="outline" className="border-slate-600 text-white hover:bg-white/10 px-8 py-6 text-base gap-2">
                    Evaluar mi perfil <ArrowRight className="w-4 h-4" />
                  </Button>
                </a>
                <Button variant="outline" onClick={() => openWhatsApp(WHATSAPP_PHONE, WA_MSG)} className="border-slate-600 text-white hover:bg-white/10 px-8 py-6 text-base gap-2">
                  Hablar con un asesor
                </Button>
              </div>

              {/* Selector de intención cruzado — resuelve la indecisión desde el primer scroll */}
              <EstructuraIntentSelector currentPage="inversion" onOpenDiagnostic={openDiagnostic} className="mt-8 max-w-2xl" />

              <AdvisoryDisclaimer variant="inline" className="mt-6 max-w-2xl" />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ 2. POR QUÉ FALLAN — ☀️ BLANCO ═══ */}
      <section className="bg-[#F5F7FA] py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="text-center mb-12">
              <p className="text-primary text-sm font-semibold tracking-[0.2em] uppercase mb-4 font-mono">Errores Comunes</p>
              <h2 className="text-3xl md:text-4xl text-[#0B1F3A]">Por qué muchos fallan al crear una empresa en Estados Unidos</h2>
              <p className="text-[#4B5563] text-lg mt-4 max-w-2xl mx-auto">El problema no es registrar una entidad. El problema es hacerlo sin estrategia.</p>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-10">
            {[
              { title: "Elegir estructura sin estrategia", desc: "Elegir estructura legal sin entender implicaciones fiscales y de riesgo." },
              { title: "Registrar en estado incorrecto", desc: "Registrar en un estado 'popular' que no necesariamente conviene a tu operación." },
              { title: "Operar sin cumplimiento", desc: "Operar sin acuerdos internos claros, cuenta bancaria y cumplimiento básico." },
            ].map((item, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="bg-white border border-red-200 rounded-xl p-6 hover:shadow-md transition-all h-full shadow-sm">
                  <AlertTriangle className="w-8 h-8 text-red-500 mb-4" />
                  <h3 className="text-[#0B1F3A] font-semibold mb-2">{item.title}</h3>
                  <p className="text-[#6B7280] text-sm leading-relaxed">{item.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn>
            <div className="bg-white border border-red-200 rounded-xl p-6 text-center max-w-3xl mx-auto shadow-sm">
              <p className="text-[#4B5563]">
                <strong className="text-[#0B1F3A]">Resultado:</strong> costos innecesarios, fricción bancaria, problemas fiscales y decisiones mal estructuradas.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ 3. PREGUNTAS CLAVE — navy ═══ */}
      <section className="bg-[#0E2544] py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="text-center mb-12">
              <p className="text-blue-400 text-sm font-semibold tracking-[0.2em] uppercase mb-4 font-mono">Antes de Constituir</p>
              <h2 className="text-3xl md:text-4xl text-white">Las preguntas que esta revisión ayuda a responder</h2>
              <p className="text-slate-400 mt-4 max-w-xl mx-auto text-base">
                Una estructura de inversión se define respondiendo las preguntas correctas, no eligiendo un tipo de entidad por popularidad.
              </p>
            </div>
          </FadeIn>

          <div className="max-w-3xl mx-auto space-y-4">
            {[
              { icon: Scale, text: "¿Qué quiero hacer? Operar, invertir, expandir, migrar o una combinación de estas.", exclusive: false },
              { icon: Building2, text: "¿Qué activos, socios u operaciones estarán involucrados?", exclusive: false },
              { icon: FileCheck, text: "¿Qué riesgos necesito separar de mi patrimonio personal?", exclusive: false },
              { icon: Shield, text: "¿Una sola entidad es suficiente o necesito varias?", exclusive: false },
              { icon: DollarSign, text: "¿Qué profesionales deben intervenir: abogado, contador, asesor fiscal?", exclusive: false },
              { icon: Scale, text: "¿Cuál es el siguiente paso lógico según mi perfil y capital disponible?", exclusive: false },
            ].map((item, i) => (
              <FadeIn key={i} delay={i * 0.05}>
                <div className={`flex items-start gap-4 rounded-xl p-6 transition-all ${item.exclusive ? "bg-[#0F2847] border border-primary/40 hover:border-primary/60" : "bg-[#0F2847] border border-[#1E3A5F] hover:border-blue-500/30"}`}>
                  <item.icon className="w-6 h-6 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-300 leading-relaxed">{item.text}</p>
                    {item.exclusive && (
                      <span className="inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 rounded-full text-xs font-bold tracking-wide bg-primary/10 border border-primary/30 text-primary">
                        ★ Exclusivo para miembros
                      </span>
                    )}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>


      {/* ═══ 4. PARA QUIÉN — ☀️ BLANCO ═══ */}
      <section className="bg-[#F5F7FA] py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="text-center mb-12">
              <p className="text-primary text-sm font-semibold tracking-[0.2em] uppercase mb-4 font-mono">Elegibilidad</p>
              <h2 className="text-3xl md:text-4xl text-[#0B1F3A]">¿Para quién es este servicio?</h2>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <FadeIn>
              <div className="bg-[#0B1F3A] border border-[#1E3A5F] rounded-2xl p-8 h-full">
                <h3 className="text-xl text-white font-semibold mb-6 flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-blue-400" /> Para ti si:
                </h3>
                <div className="space-y-3">
                  {[
                    "Tienes capacidad de inversión desde $100,000 USD",
                    "Buscas invertir en Estados Unidos con estructura",
                    "Deseas operar inversiones con entidad formal",
                    "Quieres claridad legal, fiscal y operativa",
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                      <p className="text-slate-300 text-sm">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.1}>
              <div className="bg-white border border-gray-200 rounded-2xl p-8 h-full shadow-sm">
                <h3 className="text-xl text-[#6B7280] font-semibold mb-6 flex items-center gap-3">
                  <XCircle className="w-6 h-6 text-red-400" /> No es para ti si:
                </h3>
                <div className="space-y-3">
                  {[
                    "Solo quieres 'probar' o 'explorar'",
                    "Buscas empezar sin capacidad de inversión",
                    "Necesitas soluciones rápidas sin estrategia",
                    "No tienes compromiso con estructura formal",
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
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

      {/* ═══ 5. FAQ — navy ═══ */}
      <section className="bg-[#0B1F3A] py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl text-white text-center mb-12">Preguntas frecuentes</h2>
              <Accordion type="single" collapsible className="space-y-4">
                {[
                  { q: "¿Cuándo necesito más que una LLC?", a: "Cuando participan varios socios, cuando se recibirá inversión de terceros, cuando hay múltiples activos o propiedades, cuando existe una empresa activa en otro país relacionada, o cuando se evalúa una visa vinculada a la operación. En esos casos, una revisión de estructura antes de constituir evita problemas posteriores." },
                  { q: "¿Cuáles son los tipos de entidades más usados en inversión?", a: "LLC, S-Corp, C-Corp, series LLC y holdings. La elección depende del propósito: operar, invertir, proteger patrimonio, incorporar socios o escalar internacionalmente. Cada estructura tiene implicaciones distintas en responsabilidad, impuestos y flexibilidad." },
                  { q: "¿Por qué no basta con abrir una LLC sin revisión previa?", a: "Una LLC creada sin considerar el número de socios, la naturaleza de los activos, la estrategia fiscal y los objetivos a largo plazo puede limitar decisiones posteriores: atraer inversión, transferir activos, escalar o reorganizarse. La revisión previa cuesta mucho menos que corregir después." },
                  { q: "¿Necesito vivir en Estados Unidos para tener una estructura allá?", a: "No. Una LLC o holding en EE.UU. puede ser administrada de forma remota desde cualquier país. Lo importante es que la estructura esté correctamente registrada, cumpla sus obligaciones fiscales y tenga el soporte profesional adecuado." },
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

      {/* ═══ 6. DOS RUTAS — ☀️ BLANCO ═══ */}
      <section className="bg-white py-20 md:py-28">
        <div className="container">
          <FadeIn>
            <div className="max-w-3xl mx-auto text-center mb-10">
              <h2 className="text-2xl md:text-3xl text-[#0B1F3A] font-bold">¿Cuál es tu siguiente paso?</h2>
              <p className="text-[#6B7280] mt-3">Elige la ruta que corresponde a donde estás ahora.</p>
            </div>
          </FadeIn>
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <FadeIn>
              <div className="bg-[#F5F7FA] border border-gray-200 rounded-2xl p-8 h-full flex flex-col">
                <h3 className="text-[#0B1F3A] font-bold text-lg mb-3">Mi caso requiere una revisión estratégica</h3>
                <p className="text-[#6B7280] text-sm leading-relaxed flex-1 mb-6">
                  Tengo socios, múltiples activos, capital de terceros, una empresa en otro país o evalúo una visa vinculada a la operación.
                </p>
                <a href="https://comprandoamerica.com/gps">
                  <Button className="w-full bg-primary hover:bg-blue-600 text-white gap-2 rounded-xl py-5">
                    Evaluar mi perfil <ArrowRight className="w-4 h-4" />
                  </Button>
                </a>
              </div>
            </FadeIn>
            <FadeIn delay={0.1}>
              <div className="bg-[#F5F7FA] border border-gray-200 rounded-2xl p-8 h-full flex flex-col">
                <h3 className="text-[#0B1F3A] font-bold text-lg mb-3">Solo necesito constituir una LLC</h3>
                <p className="text-[#6B7280] text-sm leading-relaxed flex-1 mb-6">
                  Quiero operar, facturar o tener presencia en EE.UU. Mi caso es sencillo y ya tengo claridad sobre lo que necesito.
                </p>
                <a href="/estructura-empresarial-en-estados-unidos">
                  <Button variant="outline" className="w-full border-gray-300 text-[#374151] hover:bg-gray-100 gap-2 rounded-xl py-5">
                    Formar mi LLC <ArrowRight className="w-4 h-4" />
                  </Button>
                </a>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>


      {/* ═══ 7. CTA FINAL — deep navy ═══ */}
      <section className="bg-[#091A30] py-24 md:py-32">
        <div className="container">
          <FadeIn>
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl text-white mb-4">No es solo crear una empresa en Estados Unidos</h2>
              <p className="text-slate-400 mb-2">Es estructurar una plataforma de inversión.</p>
              <p className="text-slate-500 text-sm mb-10">
                Si cuentas con capacidad de inversión desde <strong className="text-white">$100,000 USD</strong> y quieres invertir con claridad legal, fiscal y operativa.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a href="https://comprandoamerica.com/gps">
                  <Button className="bg-primary hover:bg-blue-600 text-white px-8 py-6 text-base gap-2 shadow-lg shadow-blue-600/25">
                    Evaluar mi perfil <ArrowRight className="w-4 h-4" />
                  </Button>
                </a>
                <a href="/membresia">
                  <Button variant="outline" className="border-slate-600 text-white hover:bg-white/10 px-8 py-6 text-base">
                    Conocer el club de inversión
                  </Button>
                </a>
              </div>

              <AdvisoryDisclaimer variant="box" className="mt-12 text-left" />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ DIAGNÓSTICO DE ESTRUCTURA DE INVERSIÓN ═══ */}
      <Modal open={diagOpen} onClose={() => setDiagOpen(false)} title="Diagnóstico de estructura de inversión">
        {visitedLlc && (
          <div className="bg-[#0B1F3A] border border-primary/30 rounded-xl p-4 mb-2 text-slate-300 text-sm leading-relaxed">
            Vimos que también revisaste la guía de formación de LLC. Vamos directo a lo que falta por resolver de este lado.
          </div>
        )}

        {/* Pregunta 1 — Objetivo */}
        {step === "q1" && (
          <>
            <p className="text-white font-medium mb-6">¿Qué describe mejor tu situación?</p>
            <div className="flex flex-col gap-3">
              {INV_Q1_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleQ1(opt.value)}
                  className="text-left rounded-xl px-5 py-4 text-sm border bg-[#0B1F3A] border-[#1E3A5F] text-slate-300 hover:border-primary/60 hover:text-white transition-all"
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </>
        )}

        {/* Pregunta 2 — Capital (solo si "tengo capital") */}
        {step === "q2" && (
          <>
            <button onClick={() => setStep("q1")} className="text-slate-500 hover:text-white text-xs transition-colors mb-4">← Anterior</button>
            <p className="text-white font-medium mb-6">¿Con qué nivel de capital cuentas para esta inversión?</p>
            <div className="flex flex-col gap-3">
              {INV_Q2_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleQ2(opt.value)}
                  className="text-left rounded-xl px-5 py-4 text-sm border bg-[#0B1F3A] border-[#1E3A5F] text-slate-300 hover:border-primary/60 hover:text-white transition-all"
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </>
        )}

        {/* Resultados */}
        {step === "result" && result === "calificado" && (
          <>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-6 h-6 text-primary" />
              <p className="text-white font-semibold">Tiene sentido revisar una estructura a tu medida</p>
            </div>
            <p>
              Con ese nivel de capital, vale la pena definir una estructura de inversión pensada para tu caso
              antes de constituir cualquier entidad. Agenda un diagnóstico de estructura para revisarlo a fondo.
            </p>
            <InvContactForm form={invForm} setForm={setInvForm} honeypot={invHoneypot} setHoneypot={setInvHoneypot} onSubmit={handleInvForm} submitting={invSubmitting} sent={invSent} ctaLabel="Agendar diagnóstico de estructura" knownName={knownName} />
          </>
        )}

        {step === "result" && result === "expansion" && (
          <>
            <div className="flex items-center gap-2 mb-3">
              <Building2 className="w-6 h-6 text-primary" />
              <p className="text-white font-semibold">Tu caso es de expansión empresarial</p>
            </div>
            <p>
              Más que estructurar capital nuevo, tu punto de partida es llevar una empresa que ya opera fuera de
              Estados Unidos hacia este mercado. Déjanos tus datos y revisamos la ruta de expansión que corresponde.
            </p>
            <InvContactForm form={invForm} setForm={setInvForm} honeypot={invHoneypot} setHoneypot={setInvHoneypot} onSubmit={handleInvForm} submitting={invSubmitting} sent={invSent} ctaLabel="Solicitar orientación" knownName={knownName} />
          </>
        )}

        {step === "result" && result === "visa" && (
          <>
            <div className="flex items-center gap-2 mb-3">
              <UserCheck className="w-6 h-6 text-primary" />
              <p className="text-white font-semibold">Hay un componente migratorio en tu caso</p>
            </div>
            <p>
              Comprando América no asesora visas directamente, pero sí puede alinear la estructura de inversión con
              ese proceso para que ambas partes sean coherentes.
            </p>
            <div className="bg-[#0B1F3A] border border-primary/30 rounded-xl p-4 text-slate-300 text-sm leading-relaxed">
              <p className="font-semibold text-primary mb-1 text-xs uppercase tracking-wider">Importante</p>
              El componente migratorio requiere coordinar con un asesor migratorio externo. Nosotros nos enfocamos en la estructura de inversión.
            </div>
            <InvContactForm form={invForm} setForm={setInvForm} honeypot={invHoneypot} setHoneypot={setInvHoneypot} onSubmit={handleInvForm} submitting={invSubmitting} sent={invSent} ctaLabel="Solicitar orientación" knownName={knownName} />
          </>
        )}

        {step === "result" && result === "explorando" && (
          <>
            <div className="flex items-center gap-2 mb-3">
              <Compass className="w-6 h-6 text-primary" />
              <p className="text-white font-semibold">Está bien no tener claridad todavía</p>
            </div>
            <p>
              No necesitas tener todo decidido para dar el primer paso. El diagnóstico general te ayuda a ubicar
              qué ruta tiene sentido para tu perfil, sin ningún compromiso.
            </p>
            <a href="/gps">
              <Button className="bg-primary hover:bg-blue-600 text-white gap-2 rounded-xl py-4 w-full mt-2">
                Hacer el diagnóstico general <ArrowRight className="w-4 h-4" />
              </Button>
            </a>
          </>
        )}

        {step === "result" && result === "capital_insuficiente" && (
          <>
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-6 h-6 text-amber-400" />
              <p className="text-white font-semibold">Este vehículo requiere un mínimo distinto</p>
            </div>
            <p>
              Seremos transparentes: la estructura de inversión de la que trata esta guía está pensada para un
              capital desde $100,000 USD. Con un ticket menor, tiene más sentido explorar estas alternativas:
            </p>
            <div className="flex flex-col gap-3 pt-1">
              <a href="/renta-garantizada">
                <Button className="bg-primary hover:bg-blue-600 text-white gap-2 rounded-xl py-4 w-full">
                  Renta respaldada por el gobierno <ArrowRight className="w-4 h-4" />
                </Button>
              </a>
              <a href="/activos-disponibles">
                <Button variant="outline" className="border-slate-600 text-white hover:bg-white/10 gap-2 rounded-xl py-4 w-full">
                  Ver activos disponibles <ArrowRight className="w-4 h-4" />
                </Button>
              </a>
              <Button
                variant="outline"
                onClick={() => openWhatsApp(WHATSAPP_PHONE, "Hola, tengo dudas sobre opciones de inversión en Estados Unidos con un ticket menor a $100,000 USD.")}
                className="border-slate-600 text-white hover:bg-white/10 gap-2 rounded-xl py-4 w-full"
              >
                <MessageSquare className="w-4 h-4" /> Tengo dudas, quiero escribir
              </Button>
            </div>
          </>
        )}

        {step === "result" && (
          <AdvisoryDisclaimer variant="inline" className="mt-2 pt-4 border-t border-[#1E3A5F]" />
        )}
      </Modal>

      <Footer />
    </div>
  );
}
