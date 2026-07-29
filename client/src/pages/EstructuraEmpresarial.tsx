/*
 * /estructura-empresarial-en-estados-unidos — URL canónica del servicio LLC
 * /llc redirige aquí con 301 permanente
 */
import { useState, useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useInView } from "@/hooks/useInView";
import { openWhatsApp, WHATSAPP_PHONE } from "@/lib/whatsapp";
import { postCrmLead, saveContact, getSavedContact } from "@/lib/crm";
import { trackPageVisit, getJourney } from "@/lib/journey";
import EstructuraIntentSelector from "@/components/EstructuraIntentSelector";
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
  MessageSquare,
  Compass,
  UserCheck,
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

/* ─── Diagnóstico de estructura de LLC ───
   Único punto de entrada para la duda "no sé qué necesito": consolida el antiguo modal
   binario y el selector de intención en un solo árbol. Solo indaga variables de FORMACIÓN
   de empresa (situación, operación, socios, empresa previa, objetivo de inversión, estado).
   Nunca pregunta capital, ticket ni horizonte — esas variables son exclusivas del GPS. */
type DiagQuestion = { q: string; options: string[] };
const DIAGNOSTIC: DiagQuestion[] = [
  {
    q: "¿Qué describe mejor tu situación?",
    options: [
      "Quiero prestar servicios o facturar",
      "Quiero iniciar una operación",
      "Quiero comprar una propiedad o activo",
      "Quiero vender productos",
      "Quiero dar presencia a mi empresa actual",
      "Todavía no estoy seguro",
    ],
  },
  {
    q: "¿Dónde vas a operar principalmente tu negocio?",
    options: ["Estados Unidos", "Mi país actual", "Remoto / digital, sin ubicación fija", "Varios países"],
  },
  {
    q: "¿Cuántos socios o dueños tendrá la empresa?",
    options: ["Solo yo", "2 socios", "3 o más socios", "Socios más inversionistas externos"],
  },
  {
    q: "¿Ya tienes una empresa activa en otro país relacionada con esta?",
    options: ["Sí", "No"],
  },
  {
    q: "¿Tu objetivo incluye, a mediano plazo, atraer capital de inversionistas externos o aplicar a una visa de inversionista (E-2)?",
    options: ["Sí, ya es un objetivo definido", "Tal vez más adelante, aún no lo sé", "No, solo quiero operar o facturar"],
  },
  {
    q: "¿En qué estado de Estados Unidos vas a operar o tienes tu residencia principal?",
    options: ["Texas", "Florida", "Otro estado", "No estoy seguro"],
  },
];

/* Índices con nombre — evita números mágicos si el árbol vuelve a reordenarse. */
const Q_SITUACION = 0;
const Q_SOCIOS = 2;
const Q_EMPRESA_PREVIA = 3;
const Q_OBJETIVO_INVERSION = 4;
const Q_ESTADO = 5;
const OPT_OTRO_ESTADO = 2; // índice de "Otro estado" en la pregunta de estado

/* Contexto por situación — proviene del antiguo selector de intención de la página.
   No se pierde: se muestra en la pantalla de resultado como "Contexto para tu caso". */
const SITUACION_CONTEXT: string[] = [
  "Una LLC puede ayudarte a separar tu actividad comercial de tus operaciones personales y establecer una entidad para celebrar contratos o recibir ingresos.",
  "Puedes usar una LLC para iniciar operaciones comerciales en Estados Unidos, contratar, tener presencia legal y facturar a clientes locales o internacionales.",
  "La LLC puede servir como vehículo de propiedad, pero conviene revisar el tipo de activo, el número de participantes y la estrategia de salida antes de constituirla.",
  "Una LLC te permite vender productos en Estados Unidos con estructura legal clara, recolección de impuestos y cuentas bancarias en dólares.",
  "Es importante distinguir entre crear una LLC independiente y establecer una subsidiaria o extensión de una empresa existente en otro país. Son rutas distintas.",
  "No hay problema. Puedes comenzar el proceso y nuestro equipo revisará contigo cuál es el uso más adecuado antes de constituir.",
];

type DiagResult = "inversion" | "asesor" | "llc" | "otro_estado";

/* Resultado del diagnóstico. El orden de las reglas importa:
   1) Estado fuera de Texas/Florida → derivación al equipo por WhatsApp.
   2) Objetivo de inversión definido → GPS.
   3) Inversionistas externos o empresa previa en otro país → sugerir asesor
      (inline, sin bloquear el flujo de compra).
   4) Cualquier otro caso → formación de LLC estándar. */
function computeDiagResult(answers: (number | null)[]): DiagResult {
  if (answers[Q_ESTADO] === OPT_OTRO_ESTADO) return "otro_estado";
  if (answers[Q_OBJETIVO_INVERSION] === 0) return "inversion"; // "Sí, ya es un objetivo definido"
  if (answers[Q_SOCIOS] === 3 || answers[Q_EMPRESA_PREVIA] === 0) return "asesor";
  return "llc";
}

/* Convierte las respuestas del diagnóstico al formato genérico de formFields del CRM,
   para que se registren como nota "Datos recibidos del formulario" junto al contacto. */
function diagFormFields(answers: (number | null)[], otroEstadoTexto?: string) {
  return DIAGNOSTIC.map((item, i) => {
    const base = answers[i] != null ? item.options[answers[i]!] : "";
    // En la pregunta de estado, anexa el estado escrito a mano cuando eligió "Otro estado".
    const value =
      i === Q_ESTADO && answers[i] === OPT_OTRO_ESTADO && otroEstadoTexto?.trim()
        ? `${base} (${otroEstadoTexto.trim()})`
        : base;
    return { label: item.q, value };
  }).filter((f) => f.value);
}

/* Handoff al GPS cuando el usuario ya viene calificado con intención de inversión.
   El GPS lee estos parámetros para no repetir la pregunta de propósito. */
const GPS_QUALIFIED_URL = "/gps?ref=llc-diagnostico&intent=inversion";

/* ─── Form fields ─── */
const OTRO_ESTADO = "Otro estado";
const STATE_OPTIONS = ["Texas", "Florida", OTRO_ESTADO, "No estoy seguro"];

/* ─── Ficha unificada ───
   Un solo builder, dos destinos: el mensaje precargado de WhatsApp y las notas del CRM.
   Así el asesor en WhatsApp y el registro del CRM dicen exactamente lo mismo. */
type FichaValues = {
  name: string; email: string; whatsapp: string; country: string;
  state: string; otherStateText: string; objective: string; partners: string; timeline: string;
};

function fichaFields(form: FichaValues): { label: string; value: string }[] {
  const estado = form.state === OTRO_ESTADO && form.otherStateText.trim()
    ? `${form.state} (${form.otherStateText.trim()})`
    : form.state;
  return [
    { label: "Nombre", value: form.name },
    { label: "Correo", value: form.email },
    { label: "WhatsApp", value: form.whatsapp },
    { label: "País de residencia", value: form.country },
    { label: "Estado de interés", value: estado },
    { label: "Objetivo principal", value: form.objective },
    { label: "Número de socios", value: form.partners },
    { label: "Fecha estimada para comenzar", value: form.timeline },
  ];
}

function buildFicha(form: FichaValues): string {
  return [
    "Cuéntanos sobre tu caso — Nuevo prospecto LLC",
    "",
    ...fichaFields(form).map((f) => `${f.label}: ${f.value}`),
  ].join("\n");
}
const OBJECTIVE_OPTIONS = ["Prestar servicios o facturar", "Iniciar una operación", "Comprar una propiedad", "Vender productos", "Crear presencia empresarial", "Otro"];
const PARTNER_OPTIONS = ["Solo yo", "2 personas", "3 o más", "No estoy seguro"];
const TIMELINE_OPTIONS = ["En las próximas 2 semanas", "Este mes", "En los próximos 3 meses", "Solo estoy explorando"];

export default function EstructuraEmpresarial() {
  /* Modals */
  const [modal, setModal] = useState<string | null>(null);
  const openModal = (id: string) => setModal(id);
  const closeModal = () => setModal(null);

  /* Diagnóstico de estructura de LLC — único punto de entrada para la duda */
  const [diagStep, setDiagStep] = useState<number>(0);
  const [diagAnswers, setDiagAnswers] = useState<(number | null)[]>(Array(DIAGNOSTIC.length).fill(null));
  const [diagResult, setDiagResult] = useState<DiagResult | null>(null);
  // Estado escrito a mano cuando elige "Otro estado" en la pregunta de estado.
  const [otroEstado, setOtroEstado] = useState("");

  function startDiagnostic() {
    setDiagStep(0);
    setDiagAnswers(Array(DIAGNOSTIC.length).fill(null));
    setDiagResult(null);
    setOtroEstado("");
    openModal("diagnostico");
  }

  function answerDiag(optionIdx: number) {
    // Registra el inicio del diagnóstico una sola vez (primera respuesta del árbol).
    if (diagStep === 0 && !diagStartedPosted) {
      setDiagStartedPosted(true);
      postCrmLead({ sourceSlug: "web_ca_llc", hito: "diagnostico_iniciado", stage: "partial", tags: ["interes:llc"] }, "");
    }
    const next = [...diagAnswers];
    next[diagStep] = optionIdx;
    setDiagAnswers(next);
    // Al elegir "Otro estado" no avanzamos: primero pedimos cuál estado (campo inline).
    if (diagStep === Q_ESTADO && optionIdx === OPT_OTRO_ESTADO) return;
    // Sincroniza la respuesta de estado con el formulario, para no volver a preguntarla abajo.
    if (diagStep === Q_ESTADO) {
      setFormData((prev) => ({ ...prev, state: DIAGNOSTIC[Q_ESTADO].options[optionIdx] }));
    }
    if (diagStep < DIAGNOSTIC.length - 1) {
      setDiagStep(diagStep + 1);
    } else {
      setDiagResult(computeDiagResult(next));
    }
  }

  /* Confirma "Otro estado" con el texto escrito y cierra el árbol. */
  function confirmOtroEstado() {
    if (!otroEstado.trim()) return;
    setFormData((prev) => ({ ...prev, state: OTRO_ESTADO, otherStateText: otroEstado.trim() }));
    setDiagResult(computeDiagResult(diagAnswers));
  }

  /* Form */
  const [formData, setFormData] = useState<FichaValues>({ name: "", email: "", whatsapp: "", country: "", state: "", otherStateText: "", objective: "", partners: "", timeline: "" });
  const [formSent, setFormSent] = useState(false);
  const [formHoneypot, setFormHoneypot] = useState("");
  const [formSubmitting, setFormSubmitting] = useState(false);

  /* Continuidad entre guías: si el mismo visitante ya revisó la guía de inversión,
     lo reconocemos en vez de tratarlo como un lead nuevo. */
  const [visitedInversion, setVisitedInversion] = useState(false);
  const [knownName, setKnownName] = useState<string | null>(null);
  const [diagStartedPosted, setDiagStartedPosted] = useState(false);
  // El diagnóstico capta los datos personales (comparte formData con el formulario final,
  // para no pedir los mismos datos dos veces). Se envía un solo lead completo.
  const [diagLeadPosted, setDiagLeadPosted] = useState(false);
  // Identificador único de esta sesión en la página: el diagnóstico y el formulario final
  // lo comparten para que el CRM actualice la MISMA nota en vez de crear una duplicada.
  const submissionIdRef = useRef<string | null>(null);
  if (submissionIdRef.current === null) submissionIdRef.current = crypto.randomUUID();

  useEffect(() => {
    trackPageVisit("llc");
    // Pre-llena el contacto si ya lo conocemos (del diagnóstico, de la otra guía o de una visita previa).
    const saved = getSavedContact();
    if (saved) {
      setKnownName(saved.name || null);
      setFormData((prev) => ({
        ...prev,
        name: prev.name || saved.name || "",
        email: prev.email || saved.email || "",
        whatsapp: prev.whatsapp || saved.phone || "",
      }));
    }
    // Si además ya revisó la guía de inversión, lo marcamos como el mismo contacto (no dos leads).
    if (getJourney().some((e) => e.page === "inversion")) {
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

  /* Envía UN lead completo con el contacto capturado en el diagnóstico + las respuestas
     del árbol. No bloquea el flujo de compra: se dispara al continuar y una sola vez. */
  function finishDiagnosticLead() {
    if (diagLeadPosted) return;
    setDiagLeadPosted(true);
    // La rama "otro_estado" se deriva al equipo: se marca con su propio tag e hito.
    const esOtroEstado = diagResult === "otro_estado";
    postCrmLead(
      {
        name: formData.name,
        email: formData.email,
        phone: formData.whatsapp,
        sourceSlug: "web_ca_llc",
        hito: esOtroEstado ? "llamada_solicitada" : "diagnostico_completo",
        stage: "complete",
        tags: esOtroEstado ? ["interes:llc", "derivado_despacho_asociado"] : ["interes:llc"],
        submissionId: submissionIdRef.current,
        // Misma ficha que se precarga en WhatsApp — un solo builder, dos destinos.
        notes: { ficha: buildFicha(formData) },
        formFields: [
          ...fichaFields(formData).filter((f) => f.value),
          ...diagFormFields(diagAnswers, formData.otherStateText),
        ],
      },
      formHoneypot,
    );
    if (!formHoneypot && (formData.name || formData.email || formData.whatsapp)) {
      saveContact({ name: formData.name.trim(), email: formData.email.trim(), phone: formData.whatsapp.trim() });
    }
  }

  function handleForm(e: React.FormEvent) {
    e.preventDefault();
    if (formSubmitting) return;
    setFormSubmitting(true);

    // Misma ficha en WhatsApp y en el CRM — un solo builder, dos destinos.
    const ficha = buildFicha(formData);
    openWhatsApp(WHATSAPP_PHONE, ficha);

    postCrmLead({
      name: formData.name,
      email: formData.email,
      phone: formData.whatsapp,
      sourceSlug: "web_ca_llc",
      // Si el usuario completó el diagnóstico, es un cierre de diagnóstico; si llenó el
      // formulario sin diagnosticar, se registra como parcial.
      hito: diagResult ? "diagnostico_completo" : "diagnostico_parcial",
      stage: "complete",
      // Etiqueta de página de interés (acumulable en el CRM). Esta página es la de LLC,
      // por lo que siempre etiqueta interes:llc; la ruta de inversión la etiqueta el GPS.
      tags: formData.state === OTRO_ESTADO ? ["interes:llc", "derivado_despacho_asociado"] : ["interes:llc"],
      // Mismo submissionId que el diagnóstico: el CRM actualiza la nota existente.
      submissionId: submissionIdRef.current,
      notes: { ficha },
      formFields: [
        ...fichaFields(formData).filter((f) => f.value),
        // Si el usuario completó el diagnóstico, adjunta sus respuestas al mismo contacto.
        ...(diagResult ? diagFormFields(diagAnswers, formData.otherStateText) : []),
      ],
    }, formHoneypot);

    // Recuerda el contacto para pre-llenar la otra guía sin volver a pedir todo.
    if (!formHoneypot) {
      saveContact({ name: formData.name.trim(), email: formData.email.trim(), phone: formData.whatsapp.trim() });
    }

    setFormSent(true);
  }

  /* Contexto de la situación elegida en la pregunta 1 — contenido que antes vivía en el
     selector de intención de la página. Se muestra en la pantalla de resultado. */
  const situacionIdx = diagAnswers[Q_SITUACION];
  const situacionContextBlock = situacionIdx != null ? (
    <div className="bg-[#0B1F3A] border border-primary/20 rounded-xl p-4 text-slate-300 text-sm leading-relaxed">
      <p className="font-semibold text-primary mb-1 text-xs uppercase tracking-wider">Contexto para tu caso</p>
      {SITUACION_CONTEXT[situacionIdx]}
    </div>
  ) : null;

  /* Campos de contacto dentro del diagnóstico. Escriben en el MISMO formData que el
     formulario final, así que lo capturado aquí ya queda pre-llenado allá (y viceversa). */
  const contactFieldsBlock = (
    <div className="space-y-3">
      {[
        { key: "name", type: "text", label: "Nombre", placeholder: "Tu nombre completo" },
        { key: "email", type: "email", label: "Correo", placeholder: "correo@ejemplo.com" },
        { key: "whatsapp", type: "tel", label: "WhatsApp", placeholder: "+52 555 000 0000" },
      ].map((f) => (
        <div key={f.key}>
          <label className="text-slate-400 text-xs block mb-1">{f.label}</label>
          <input
            type={f.type}
            placeholder={f.placeholder}
            value={(formData as any)[f.key]}
            onChange={(e) => setFormData({ ...formData, [f.key]: e.target.value })}
            className="w-full bg-[#091A30] border border-[#1E3A5F] rounded-lg px-4 py-3 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>
      ))}
      {/* Honeypot — invisible para humanos, bots lo llenan */}
      <div style={{ position: "absolute", left: "-9999px", top: "-9999px", width: "1px", height: "1px", overflow: "hidden" }} aria-hidden="true">
        <input type="text" name="website" tabIndex={-1} autoComplete="off" value={formHoneypot} onChange={(e) => setFormHoneypot(e.target.value)} />
      </div>
    </div>
  );

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
              <h1 className="text-4xl md:text-5xl lg:text-6xl text-white leading-[1.1] mb-6 font-bold">
                Abre tu LLC en Texas o Florida{" "}
                <span className="text-primary">con claridad desde el inicio</span>
              </h1>
              <p className="text-slate-300 text-lg md:text-xl leading-relaxed mb-8 max-w-2xl">
                Registro estatal, EIN y Registered Agent por un año. Si aún no sabes en qué estado
                conviene constituir o si tu caso necesita otra estructura, el diagnóstico lo resuelve
                en un par de minutos.
              </p>

              {/* Price */}
              <div className="inline-flex items-baseline gap-2 mb-8">
                <span className="text-4xl font-bold text-white">USD 1,499</span>
                <span className="text-slate-400 text-sm">pago único</span>
              </div>

              <div className="flex flex-wrap gap-4 mb-10">
                <Button
                  onClick={() => openModal("iniciar")}
                  className="bg-primary hover:bg-blue-600 text-white px-8 py-6 text-base gap-2 rounded-full shadow-lg shadow-blue-600/25 font-semibold"
                >
                  Iniciar mi LLC <ArrowRight className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  onClick={startDiagnostic}
                  className="border-slate-600 text-white hover:bg-white/10 px-8 py-6 text-base rounded-full"
                >
                  No sé qué estructura necesito
                </Button>
              </div>

              {/* Selector de intención cruzado — resuelve la indecisión desde el primer scroll */}
              <EstructuraIntentSelector currentPage="llc" onOpenDiagnostic={startDiagnostic} className="mb-10 max-w-2xl" />

              <div className="flex flex-wrap gap-6 text-slate-400 text-sm">
                <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> Registro estatal incluido</span>
                <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> EIN federal</span>
                <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary" /> Registered Agent 1 año</span>
              </div>
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
                <Button
                  variant="outline"
                  onClick={startDiagnostic}
                  className="border-gray-300 text-[#374151] hover:bg-gray-100 gap-2 rounded-full px-8 py-5"
                >
                  Revisar si mi caso necesita otra estructura
                </Button>
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
          10. CIERRE + FORMULARIO
      ══════════════════════════════════════════ */}
      <section className="bg-[#091A30] py-24 md:py-32">
        <div className="container">
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12 items-start">
            <FadeIn>
              <div>
                <h2 className="text-3xl md:text-4xl text-white font-bold mb-4">Tu empresa debe comenzar con claridad</h2>
                <p className="text-slate-400 leading-relaxed mb-8">
                  Cuando una LLC corresponde a tu objetivo, el proceso no tiene por qué ser complicado. Te ayudamos a
                  constituirla en Texas o Florida, organizar su documentación y entender los pasos que continúan.
                </p>
                <div className="text-4xl font-bold text-white mb-2">USD 1,499</div>
                <p className="text-slate-500 text-sm mb-8">Pago único por la formación de la LLC y los servicios incluidos.</p>
                <div className="flex flex-col gap-3">
                  <Button onClick={() => handleCheckout("texas")} className="bg-primary hover:bg-blue-600 text-white gap-2 rounded-full py-5 font-semibold shadow-lg shadow-blue-600/20">
                    Comenzar la formación de mi LLC <ArrowRight className="w-4 h-4" />
                  </Button>
                  <a href="/estructura-de-inversion-en-usa" className="text-slate-400 text-sm text-center hover:text-white transition-colors underline underline-offset-2">
                    Primero quiero revisar mi estructura
                  </a>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={0.1}>
              <div className="bg-[#0F2847] border border-[#1E3A5F] rounded-2xl p-8">
                {formSent ? (
                  <div className="text-center py-6">
                    <CheckCircle2 className="w-12 h-12 text-primary mx-auto mb-4" />
                    <h3 className="text-white font-semibold text-lg mb-3">Información recibida</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      Antes de iniciar, revisaremos que el servicio corresponda a tu necesidad y te indicaremos los siguientes pasos.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleForm} className="space-y-4">
                    <h3 className="text-white font-semibold mb-6">
                      {diagResult ? "Confirma tus datos" : "Cuéntanos sobre tu caso"}
                    </h3>
                    {/* Si ya hizo el diagnóstico, no repetimos las preguntas que ya respondió. */}
                    {diagResult ? (
                      <p className="text-slate-400 text-sm -mt-4 mb-2">
                        Ya tenemos las respuestas de tu diagnóstico. Solo confirma tus datos de contacto
                        {knownName ? `, ${knownName.split(" ")[0]}` : ""}.
                      </p>
                    ) : knownName ? (
                      <p className="text-slate-400 text-sm -mt-4 mb-2">¿Sigues siendo tú, {knownName.split(" ")[0]}? Dejamos tus datos listos; corrige lo que haga falta.</p>
                    ) : null}
                    {[
                      { label: "Nombre", key: "name", type: "text", placeholder: "Tu nombre completo" },
                      { label: "Correo", key: "email", type: "email", placeholder: "correo@ejemplo.com" },
                      { label: "WhatsApp", key: "whatsapp", type: "tel", placeholder: "+52 555 000 0000" },
                      { label: "País de residencia", key: "country", type: "text", placeholder: "México, Colombia, etc." },
                    ].map((field) => (
                      <div key={field.key}>
                        <label className="text-slate-400 text-xs block mb-1">{field.label}</label>
                        <input
                          type={field.type}
                          placeholder={field.placeholder}
                          value={(formData as any)[field.key]}
                          onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                          className="w-full bg-[#091A30] border border-[#1E3A5F] rounded-lg px-4 py-3 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-primary/50 transition-colors"
                        />
                      </div>
                    ))}
                    {(diagResult
                      // El diagnóstico ya cubrió estado, objetivo y socios: solo falta la fecha.
                      ? [{ label: "Fecha estimada para comenzar", key: "timeline", options: TIMELINE_OPTIONS }]
                      : [
                          { label: "Estado de interés", key: "state", options: STATE_OPTIONS },
                          { label: "Objetivo principal", key: "objective", options: OBJECTIVE_OPTIONS },
                          { label: "Número de socios", key: "partners", options: PARTNER_OPTIONS },
                          { label: "Fecha estimada para comenzar", key: "timeline", options: TIMELINE_OPTIONS },
                        ]
                    ).map((field) => (
                      <div key={field.key}>
                        <label className="text-slate-400 text-xs block mb-1">{field.label}</label>
                        <select
                          value={(formData as any)[field.key]}
                          onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                          className="w-full bg-[#091A30] border border-[#1E3A5F] rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-primary/50 transition-colors"
                        >
                          <option value="">Seleccionar…</option>
                          {field.options.map((o) => <option key={o} value={o}>{o}</option>)}
                        </select>
                        {/* Mismo campo de texto libre que en el diagnóstico, para no duplicar lógica */}
                        {field.key === "state" && formData.state === OTRO_ESTADO && (
                          <input
                            type="text"
                            value={formData.otherStateText}
                            onChange={(e) => setFormData({ ...formData, otherStateText: e.target.value })}
                            placeholder="¿Cuál estado? California, Nueva York, etc."
                            className="w-full bg-[#091A30] border border-[#1E3A5F] rounded-lg px-4 py-3 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-primary/50 transition-colors mt-2"
                          />
                        )}
                      </div>
                    ))}

                    {/* Honeypot — invisible para humanos, bots lo llenan */}
                    <div style={{ position: "absolute", left: "-9999px", top: "-9999px", width: "1px", height: "1px", overflow: "hidden" }} aria-hidden="true">
                      <input type="text" name="website" tabIndex={-1} autoComplete="off" value={formHoneypot} onChange={(e) => setFormHoneypot(e.target.value)} />
                    </div>

                    <Button type="submit" disabled={formSubmitting} className="w-full bg-primary hover:bg-blue-600 text-white rounded-xl py-5 font-semibold gap-2 mt-2 disabled:opacity-70">
                      <MessageSquare className="w-4 h-4" /> Enviar información
                    </Button>
                  </form>
                )}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ── Aviso de cumplimiento ── */}
      <section className="bg-[#0B1F3A] pb-16">
        <div className="container">
          <AdvisoryDisclaimer variant="box" className="max-w-3xl mx-auto" />
        </div>
      </section>

      {/* ── Sticky mobile CTA ── */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden bg-[#0B1F3A] border-t border-[#1E3A5F] p-4 z-40">
        <button onClick={() => handleCheckout("texas")} className="w-full bg-primary hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition-all text-sm">
          Iniciar mi LLC — $1,499 USD
        </button>
      </div>

      <Footer />

      {/* ══════════════════════════════════════════
          MODALS
      ══════════════════════════════════════════ */}

      {/* Iniciar */}
      <Modal open={modal === "iniciar"} onClose={closeModal} title="¿En qué estado quieres constituir tu LLC?">
        <div className="grid gap-4">
          <button onClick={() => { closeModal(); handleCheckout("texas"); }} className="bg-[#0B1F3A] border border-primary/40 hover:border-primary text-white rounded-xl p-5 text-left transition-all">
            <p className="font-semibold mb-1">Texas</p>
            <p className="text-slate-400 text-sm">Ideal para operaciones comerciales, servicios y presencia empresarial.</p>
          </button>
          <button onClick={() => { closeModal(); handleCheckout("florida"); }} className="bg-[#0B1F3A] border border-primary/40 hover:border-primary text-white rounded-xl p-5 text-left transition-all">
            <p className="font-semibold mb-1">Florida</p>
            <p className="text-slate-400 text-sm">Ideal para bienes raíces, negocios digitales y conexión con Latinoamérica.</p>
          </button>
          <button onClick={() => { closeModal(); openWhatsApp(WHATSAPP_PHONE, "Hola, no estoy seguro de qué estado elegir para mi LLC. ¿Me pueden orientar?"); }} className="bg-[#0B1F3A] border border-[#1E3A5F] hover:border-primary/40 text-slate-400 hover:text-white rounded-xl p-5 text-left transition-all">
            <p className="font-semibold mb-1">No estoy seguro</p>
            <p className="text-sm">Habla con el equipo antes de elegir.</p>
          </button>
        </div>
      </Modal>

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

      {/* Diagnóstico de estructura de LLC */}
      <Modal open={modal === "diagnostico"} onClose={closeModal} title="Diagnóstico de estructura">
        {visitedInversion && (
          <div className="bg-[#0B1F3A] border border-primary/30 rounded-xl p-4 mb-5 text-slate-300 text-sm leading-relaxed">
            Vimos que también revisaste la guía de estructura de inversión. Vamos directo a lo que falta por resolver de este lado.
          </div>
        )}
        {diagResult === null && (
          <>
            <div className="flex items-center justify-between mb-4">
              <p className="text-slate-400 text-xs">Pregunta {diagStep + 1} de {DIAGNOSTIC.length}</p>
              {diagStep > 0 && (
                <button onClick={() => setDiagStep(diagStep - 1)} className="text-slate-500 hover:text-white text-xs transition-colors">
                  ← Anterior
                </button>
              )}
            </div>
            {/* Barra de progreso */}
            <div className="h-1 bg-[#1E3A5F] rounded-full mb-6 overflow-hidden">
              <div className="h-full bg-primary transition-all duration-300" style={{ width: `${((diagStep + 1) / DIAGNOSTIC.length) * 100}%` }} />
            </div>
            <p className="text-white font-medium mb-6">{DIAGNOSTIC[diagStep].q}</p>
            <div className="flex flex-col gap-3">
              {DIAGNOSTIC[diagStep].options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => answerDiag(i)}
                  className={`text-left rounded-xl px-5 py-4 text-sm border transition-all ${
                    diagAnswers[diagStep] === i
                      ? "bg-primary/10 border-primary text-white"
                      : "bg-[#0B1F3A] border-[#1E3A5F] text-slate-300 hover:border-primary/60 hover:text-white"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>

            {/* "Otro estado": pide cuál antes de continuar al resultado */}
            {diagStep === Q_ESTADO && diagAnswers[Q_ESTADO] === OPT_OTRO_ESTADO && (
              <div className="mt-4">
                <label className="text-slate-400 text-xs block mb-1">¿Cuál estado?</label>
                <input
                  type="text"
                  autoFocus
                  value={otroEstado}
                  onChange={(e) => setOtroEstado(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); confirmOtroEstado(); } }}
                  placeholder="California, Nueva York, etc."
                  className="w-full bg-[#091A30] border border-[#1E3A5F] rounded-lg px-4 py-3 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-primary/50 transition-colors"
                />
                <Button
                  onClick={confirmOtroEstado}
                  disabled={!otroEstado.trim()}
                  className="bg-primary hover:bg-blue-600 text-white gap-2 rounded-xl py-4 w-full mt-3 disabled:opacity-50"
                >
                  Continuar <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </>
        )}

        {/* Resultado: estado fuera de Texas/Florida → derivación al equipo por WhatsApp */}
        {diagResult === "otro_estado" && (
          <>
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-6 h-6 text-primary" />
              <p className="text-white font-semibold">Tu caso requiere constituir en {formData.otherStateText || "otro estado"}</p>
            </div>
            <p>
              Nuestro servicio en línea cubre Texas y Florida. Para constituir en{" "}
              <strong className="text-white">{formData.otherStateText || "otro estado"}</strong> te conectamos
              por WhatsApp con nuestro equipo, que coordina esa formación directamente contigo.
            </p>
            <div className="pt-2">
              <p className="text-slate-400 text-sm mb-3">
                {knownName ? `¿Sigues siendo tú, ${knownName.split(" ")[0]}? Confirma tus datos y te contactamos.` : "Déjanos tus datos y te contactamos para coordinar."}
              </p>
              {contactFieldsBlock}
            </div>
            <Button
              onClick={() => { finishDiagnosticLead(); closeModal(); openWhatsApp(WHATSAPP_PHONE, buildFicha(formData)); }}
              className="bg-primary hover:bg-blue-600 text-white gap-2 rounded-xl py-4 w-full mt-4"
            >
              <MessageSquare className="w-4 h-4" /> Coordinar por WhatsApp
            </Button>
          </>
        )}

        {/* Resultado: objetivo de inversión definido → GPS */}
        {diagResult === "inversion" && (
          <>
            <div className="flex items-center gap-2 mb-4">
              <Compass className="w-6 h-6 text-primary" />
              <p className="text-white font-semibold">Tu objetivo ya contempla inversión</p>
            </div>
            <p>
              Como tu meta a mediano plazo incluye atraer capital externo o una visa de inversionista,
              conviene definir primero el <strong className="text-white">vehículo de inversión</strong> correcto,
              no solo la LLC. Nuestro GPS Estratégico te perfila en menos de 2 minutos — sin volver a
              preguntarte lo que ya sabemos de tu caso.
            </p>
            <div className="pt-2">
              <p className="text-slate-400 text-sm mb-3">
                {knownName ? `¿Sigues siendo tú, ${knownName.split(" ")[0]}? Confirma tus datos para guardar tu diagnóstico.` : "Déjanos tus datos para guardar tu diagnóstico y darle seguimiento."}
              </p>
              {contactFieldsBlock}
            </div>
            <a href={GPS_QUALIFIED_URL} onClick={finishDiagnosticLead}>
              <Button className="bg-primary hover:bg-blue-600 text-white gap-2 rounded-xl py-4 w-full mt-4">
                Ir a mi GPS de inversión <ArrowRight className="w-4 h-4" />
              </Button>
            </a>
            <button
              onClick={() => { finishDiagnosticLead(); closeModal(); openModal("iniciar"); }}
              className="text-slate-400 text-sm text-center hover:text-white transition-colors underline underline-offset-2 w-full mt-3"
            >
              Prefiero solo formar la LLC por ahora
            </button>
          </>
        )}

        {/* Resultado: inversionistas externos o empresa previa → sugerir asesor (no bloquea) */}
        {diagResult === "asesor" && (
          <>
            <div className="flex items-center gap-2 mb-4">
              <UserCheck className="w-6 h-6 text-primary" />
              <p className="text-white font-semibold">Puedes continuar, y además vale la pena una revisión</p>
            </div>
            {/* Mismo patrón que el bloque "Contexto para tu caso": tarjeta contextual, inline, sin forzar salida */}
            <div className="bg-[#0B1F3A] border border-primary/30 rounded-xl p-5 text-slate-300 text-sm leading-relaxed">
              <p className="font-semibold text-primary mb-1 text-xs uppercase tracking-wider">Contexto para tu caso</p>
              Como tu empresa involucrará inversionistas externos o se relaciona con una empresa que ya tienes
              en otro país, hablar con un asesor <strong className="text-white">antes de constituir</strong> ayuda
              a elegir bien la estructura y evitar reorganizarla después. Es una opción adicional — no un requisito.
            </div>
            <div className="pt-2">
              <p className="text-slate-400 text-sm mb-3">
                {knownName ? `¿Sigues siendo tú, ${knownName.split(" ")[0]}? Confirma tus datos para guardar tu diagnóstico.` : "Déjanos tus datos para guardar tu diagnóstico y darle seguimiento."}
              </p>
              {contactFieldsBlock}
            </div>
            <div className="flex flex-col gap-3 pt-2">
              <Button
                onClick={() => { finishDiagnosticLead(); closeModal(); openModal("iniciar"); }}
                className="bg-primary hover:bg-blue-600 text-white gap-2 rounded-xl py-4 w-full"
              >
                Continuar con mi LLC <ArrowRight className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                onClick={() => { finishDiagnosticLead(); closeModal(); openWhatsApp(WHATSAPP_PHONE, "Hola, antes de constituir mi LLC quiero revisar mi caso con un asesor. Mi empresa involucra socios/inversionistas externos o una empresa que ya tengo en otro país."); }}
                className="border-slate-600 text-white hover:bg-white/10 rounded-xl py-4 w-full gap-2"
              >
                <MessageSquare className="w-4 h-4" /> Hablar con un asesor primero
              </Button>
            </div>
          </>
        )}

        {/* Resultado: LLC estándar */}
        {diagResult === "llc" && (
          <>
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 className="w-6 h-6 text-primary" />
              <p className="text-white font-semibold">Una LLC estándar encaja con tu caso</p>
            </div>
            <p>
              Por lo que nos compartes, el servicio de formación de LLC ($1,499) cubre lo que necesitas.
              Nuestro equipo revisará tu caso antes de iniciar el proceso.
            </p>
            {situacionContextBlock}
            <div className="pt-2">
              <p className="text-slate-400 text-sm mb-3">
                {knownName ? `¿Sigues siendo tú, ${knownName.split(" ")[0]}? Confirma tus datos para guardar tu diagnóstico.` : "Déjanos tus datos para guardar tu diagnóstico y darle seguimiento."}
              </p>
              {contactFieldsBlock}
            </div>
            <Button onClick={() => { finishDiagnosticLead(); closeModal(); openModal("iniciar"); }} className="bg-primary hover:bg-blue-600 text-white gap-2 rounded-xl py-4 w-full mt-4">
              Continuar con mi LLC <ArrowRight className="w-4 h-4" />
            </Button>
          </>
        )}
      </Modal>
    </div>
  );
}
