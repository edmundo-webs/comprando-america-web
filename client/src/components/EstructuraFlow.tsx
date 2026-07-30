/*
 * Punto de entrada único para las guías de estructura (LLC e inversión).
 * Reemplaza los dos CTA paralelos del hero y la tarjeta de 3 opciones que estaba
 * duplicada en ambas páginas.
 *
 * Dos puertas mutuamente excluyentes:
 *   1. Compra directa — solo estado, austera a propósito. Sin preguntas extra
 *      ni desvíos hacia inversión.
 *   2. Diagnóstico integral — objetivo → preguntas por rama → horizonte →
 *      resultado por capas, con el contenido educativo embebido en cada paso.
 *
 * El resultado se entrega en capas (ver lib/motorRuta.ts):
 *   Capa A — visible para todos, antes de pedir contacto.
 *   Capa B — ampliación después de capturar contacto.
 *   Capa C — interno, solo al CRM. Nunca se renderiza.
 *
 * El diagnóstico no aprueba ni rechaza a nadie: siempre entrega una ruta. La
 * única frontera que existe es de alcance del servicio en línea (Texas/Florida),
 * y se resuelve con un referido, no con una salida sin respuesta.
 *
 * "Solo quiero mi LLC" es una salida válida y sin fricción en cualquier punto.
 */
import { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, X, CheckCircle2, XCircle, ShoppingCart, Compass, MessageSquare, AlertTriangle, MapPin, Target, ListChecks } from "lucide-react";
import { openWhatsApp, WHATSAPP_PHONE } from "@/lib/whatsapp";
import { postCrmLead, saveContact, getSavedContact } from "@/lib/crm";
import AdvisoryDisclaimer from "@/components/AdvisoryDisclaimer";
import {
  type Objetivo, type Urgencia, type Pregunta, type FichaContacto,
  OBJETIVO_OPCIONES, URGENCIA_OPCIONES, ESTADO_INFO, SENALES_OTRA_ESTRUCTURA, SENALES_NOTA,
  INCLUYE, NO_INCLUYE, CONFIRMACION_FAQ, INVERSION_ERRORES, INVERSION_PREGUNTAS_CLAVE,
  EXPLORANDO_RESUMEN, pasosDeRama, preguntaAplica,
  fichaCampos, origenCampos, buildFichaTexto,
} from "@/lib/diagnostico";
import { type Cta, type Retroalimentacion, recomendarRuta, ramaEfectiva, capaCCampos } from "@/lib/motorRuta";

/* "resultado" = Capa A · "ampliado" = Capa B · "fuera-de-alcance" solo aplica al
   checkout en línea, no al diagnóstico. */
type Fase = "directo" | "confirmar" | "objetivo" | "preguntas" | "urgencia" | "resultado" | "cierre" | "ampliado" | "fuera-de-alcance";

const GRUPO_EMPRESARIAL_URL = "/grupo-empresarial-edmundo";

const RETRO_OPCIONES: { value: Retroalimentacion; label: string }[] = [
  { value: "si", label: "Sí, quiero avanzar" },
  { value: "parcial", label: "Parcialmente, necesito aclarar algo" },
  { value: "no", label: "No, mi caso es diferente" },
];

const SALUDO = "Hola, vengo del diagnóstico de estructura de Comprando América.";

/* ─── Modal ─── */
function FlowModal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            className="relative bg-[#0F2847] border border-[#1E3A5F] rounded-2xl max-w-lg w-full max-h-[88vh] overflow-y-auto shadow-2xl"
            initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-between p-6 border-b border-[#1E3A5F] sticky top-0 bg-[#0F2847] z-10">
              <h3 className="text-white font-semibold text-lg pr-4">{title}</h3>
              <button onClick={onClose} aria-label="Cerrar" className="text-slate-400 hover:text-white transition-colors flex-shrink-0">
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

function OptionButton({ label, desc, selected, onClick }: { label: string; desc?: string; selected?: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`text-left rounded-xl px-5 py-4 border transition-all w-full ${
        selected ? "bg-primary/10 border-primary text-white" : "bg-[#0B1F3A] border-[#1E3A5F] text-slate-300 hover:border-primary/60 hover:text-white"
      }`}
    >
      <span className="block text-sm font-medium text-white">{label}</span>
      {desc && <span className="block text-slate-400 text-xs mt-1 leading-relaxed">{desc}</span>}
    </button>
  );
}

export default function EstructuraFlow({
  sourceSlug,
  onCheckout,
  className = "",
  anchorId,
}: {
  /** "web_ca_llc" | "web_ca_inversion" — de qué página viene el lead. */
  sourceSlug: string;
  /** Dispara el checkout real de la página (Clover). Solo Texas/Florida. */
  onCheckout: (estado: "texas" | "florida") => void;
  className?: string;
  /** Ancla opcional. Solo una instancia por página debe declararla (ids únicos). */
  anchorId?: string;
}) {
  const [open, setOpen] = useState(false);
  const [fase, setFase] = useState<Fase>("objetivo");
  const [objetivo, setObjetivo] = useState<Objetivo | null>(null);
  const [respuestas, setRespuestas] = useState<Record<string, string>>({});
  const [estadoSolicitado, setEstadoSolicitado] = useState("");
  const [urgencia, setUrgencia] = useState<Urgencia | null>(null);
  const [idx, setIdx] = useState(0);
  const [pasos, setPasos] = useState(0);
  const [enviado, setEnviado] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [retro, setRetro] = useState<Retroalimentacion | null>(null);

  const [contacto, setContacto] = useState<FichaContacto>({ name: "", email: "", phone: "", country: "" });
  /* Personalización solo con señal real: dato guardado por el propio usuario en este navegador. */
  const [knownName, setKnownName] = useState<string | null>(null);

  /* La etiqueta de interés depende de la página de origen, no se fija a LLC. */
  const tagInteres = sourceSlug === "web_ca_inversion" ? "interes:inversion" : "interes:llc";

  const submissionIdRef = useRef<string | null>(null);
  if (submissionIdRef.current === null) submissionIdRef.current = crypto.randomUUID();
  const completadoRef = useRef(false);
  const iniciadoRef = useRef(false);

  useEffect(() => {
    const saved = getSavedContact();
    if (!saved) return;
    setKnownName(saved.name || null);
    setContacto((p) => ({ ...p, name: p.name || saved.name || "", email: p.email || saved.email || "", phone: p.phone || saved.phone || "" }));
  }, []);

  /* ─── Motor de Recomendación de Ruta ───
     Se recalcula con cada respuesta; solo se muestra a partir de la Capa A. */
  const rec = useMemo(
    () => (objetivo ? recomendarRuta({ objetivo, respuestas, urgencia }) : null),
    [objetivo, respuestas, urgencia],
  );

  /* ─── CRM ─── */
  /* Capa A/B declaradas por el usuario + Capa C interna (nivel, banderas, guion). */
  function campos() {
    return [
      ...fichaCampos({ contacto, objetivo, respuestas, urgencia, estadoSolicitado, pasosCompletados: pasos }),
      ...(rec ? capaCCampos(rec, retro) : []),
      ...origenCampos(),
    ];
  }

  /* Etiquetas de ruta para el CRM — nunca se muestran en pantalla. */
  const tagsRuta = () => (rec ? [`nivel-ruta:${rec.routeLevel}`, `rama:${rec.rama}`, ...(rec.varianteNivel3 ? [`variante:${rec.varianteNivel3}`] : [])] : []);

  function evento(hito: string, extra?: { stage?: "partial" | "complete"; tags?: string[]; nota?: string }) {
    const lista = campos();
    postCrmLead(
      {
        name: contacto.name, email: contacto.email, phone: contacto.phone,
        sourceSlug,
        hito,
        stage: extra?.stage ?? "partial",
        tags: [tagInteres, ...(extra?.tags ?? [])],
        submissionId: submissionIdRef.current,
        notes: { ficha: buildFichaTexto(lista, SALUDO, extra?.nota), pasosCompletados: pasos },
        formFields: lista,
      },
      honeypot,
    );
  }

  /* Abandono: si cierra sin completar, registramos el último paso alcanzado. */
  function cerrar() {
    if (iniciadoRef.current && !completadoRef.current) evento("diagnostico_abandonado");
    setOpen(false);
  }

  useEffect(() => {
    function onUnload() {
      if (open && iniciadoRef.current && !completadoRef.current) evento("diagnostico_abandonado");
    }
    window.addEventListener("beforeunload", onUnload);
    return () => window.removeEventListener("beforeunload", onUnload);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, pasos, objetivo, respuestas, urgencia]);

  /* Registra el resultado al llegar a la Capa A, no solo si el usuario actúa.
     Así queda la ruta recomendada aunque abandone en esa pantalla. */
  const resultadoRegistradoRef = useRef(false);
  useEffect(() => {
    if (fase !== "resultado" || !rec || resultadoRegistradoRef.current) return;
    resultadoRegistradoRef.current = true;
    evento("resultado_mostrado", { tags: tagsRuta() });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fase, rec]);

  /* Fuera del alcance del checkout en línea (puerta de compra directa). */
  const alcanceRegistradoRef = useRef(false);
  useEffect(() => {
    if (fase !== "fuera-de-alcance" || alcanceRegistradoRef.current) return;
    alcanceRegistradoRef.current = true;
    evento("estado_fuera_de_alcance", { tags: ["alcance:fuera-de-texas-florida"] });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fase]);

  /* ─── Puertas ─── */
  function abrirDirecto() {
    setFase("directo");
    setObjetivo(null);
    setRespuestas({});
    setEstadoSolicitado("");
    setPasos(0);
    setEnviado(false);
    setRetro(null);
    resultadoRegistradoRef.current = false;
    alcanceRegistradoRef.current = false;
    completadoRef.current = false;
    iniciadoRef.current = false;
    setOpen(true);
  }

  function abrirDiagnostico() {
    setFase("objetivo");
    setObjetivo(null);
    setRespuestas({});
    setUrgencia(null);
    setEstadoSolicitado("");
    setIdx(0);
    setPasos(0);
    setEnviado(false);
    setRetro(null);
    resultadoRegistradoRef.current = false;
    alcanceRegistradoRef.current = false;
    completadoRef.current = false;
    iniciadoRef.current = false;
    setOpen(true);
  }

  /* ─── Elección de estado para el checkout ───
     Se usa en la puerta directa y también cuando el resultado del diagnóstico
     llega a constituir sin que se haya preguntado el estado (rama Invertir).
     Conserva las respuestas del diagnóstico para no perder la ficha. */
  function elegirEstadoDirecto(v: string) {
    setRespuestas((prev) => ({ ...prev, estado: v }));
    if (v === "otro") {
      alcanceRegistradoRef.current = false;
      setFase("fuera-de-alcance");
      return;
    }
    setFase("confirmar");
  }

  function pagar() {
    const estado = respuestas.estado === "Florida" ? "florida" : "texas";
    completadoRef.current = true;
    evento("checkout_directo_iniciado", { stage: "complete", tags: ["checkout:directo"] });
    setOpen(false);
    onCheckout(estado);
  }

  /* ─── Diagnóstico integral ───
     La lista de pasos se recalcula con cada respuesta: la rama "Explorando" puede
     reasignar al usuario a otra rama y agregar sus preguntas al final. */
  const listaPasos: Pregunta[] = objetivo ? pasosDeRama(objetivo, respuestas).filter((p) => preguntaAplica(p, respuestas)) : [];
  const preguntaActual = listaPasos[idx];

  function elegirObjetivo(v: Objetivo) {
    setObjetivo(v);
    setIdx(0);
    setPasos(1);
    iniciadoRef.current = true;
    postCrmLead(
      {
        name: contacto.name, email: contacto.email, phone: contacto.phone,
        sourceSlug, hito: "diagnostico_iniciado", stage: "partial",
        tags: [tagInteres, `objetivo:${v}`],
        submissionId: submissionIdRef.current,
        formFields: [{ label: "Objetivo", value: OBJETIVO_OPCIONES.find((o) => o.value === v)?.label ?? v }, ...origenCampos()],
      },
      honeypot,
    );
    setFase("preguntas");
  }

  /* Ninguna respuesta interrumpe el diagnóstico: ni el estado, ni el capital, ni la
     falta de proyecto. Todas cambian la ruta recomendada, y el usuario siempre
     llega al resultado. */
  function responder(v: string) {
    const next = { ...respuestas, [preguntaActual.id]: v };
    setRespuestas(next);
    setPasos(pasos + 1);

    const lista = pasosDeRama(objetivo!, next).filter((p) => preguntaAplica(p, next));
    evento("diagnostico_paso_completado");
    if (idx + 1 < lista.length) setIdx(idx + 1);
    else setFase("urgencia");
  }

  function elegirUrgencia(v: Urgencia) {
    setUrgencia(v);
    setPasos(pasos + 1);
    /* Capa A antes de pedir contacto: primero la claridad, después los datos. */
    setFase("resultado");
  }

  /* ─── Ejecución del CTA recomendado (Capa B) ─── */
  function ejecutarCta(cta: Cta) {
    switch (cta.action) {
      case "checkout":
        setFase("confirmar");
        return;
      case "estado":
        // Nivel 1 sin estado declarado (p. ej. rama Invertir): falta esa decisión.
        setFase("directo");
        return;
      case "grupo":
        completadoRef.current = true;
        evento("grupo_empresarial_solicitado", { stage: "complete", tags: [...tagsRuta(), "ruta:grupo-empresarial"] });
        setOpen(false);
        window.location.href = GRUPO_EMPRESARIAL_URL;
        return;
      default:
        porWhatsApp(cta.contexto, "orientacion_solicitada");
    }
  }

  /* Retroalimentación sobre el resultado — calidad de datos y prioridad de seguimiento. */
  function responderRetro(v: Retroalimentacion) {
    setRetro(v);
    const lista = [
      ...fichaCampos({ contacto, objetivo, respuestas, urgencia, estadoSolicitado, pasosCompletados: pasos }),
      ...(rec ? capaCCampos(rec, v) : []),
      ...origenCampos(),
    ];
    postCrmLead(
      {
        name: contacto.name, email: contacto.email, phone: contacto.phone,
        sourceSlug, hito: "retroalimentacion_resultado", stage: "complete",
        tags: [tagInteres, ...tagsRuta(), `retroalimentacion:${v}`],
        submissionId: submissionIdRef.current,
        notes: { ficha: buildFichaTexto(lista, SALUDO), pasosCompletados: pasos },
        formFields: lista,
      },
      honeypot,
    );
  }

  /* Cierre: envía la ficha completa (incluida la Capa C) y abre la Capa B. */
  function enviarCierre(e: React.FormEvent) {
    e.preventDefault();
    if (enviado) return;
    completadoRef.current = true;
    const lista = campos();
    postCrmLead(
      {
        name: contacto.name, email: contacto.email, phone: contacto.phone,
        sourceSlug, hito: "diagnostico_completado", stage: "complete",
        tags: [tagInteres, `objetivo:${objetivo}`, ...tagsRuta(), ...(urgencia ? [`urgencia:${urgencia}`] : [])],
        submissionId: submissionIdRef.current,
        notes: { ficha: buildFichaTexto(lista, SALUDO), pasosCompletados: pasos },
        formFields: lista,
      },
      honeypot,
    );
    if (!honeypot && (contacto.name || contacto.email || contacto.phone)) {
      saveContact({ name: contacto.name.trim(), email: contacto.email.trim(), phone: contacto.phone.trim() });
    }
    setEnviado(true);
    setFase("ampliado");
  }

  /* Salida a WhatsApp con la ficha completa — el setter no repregunta. */
  function porWhatsApp(contexto?: string, hito = "llamada_solicitada") {
    completadoRef.current = true;
    const lista = campos();
    openWhatsApp(WHATSAPP_PHONE, buildFichaTexto(lista, SALUDO, contexto));
    postCrmLead(
      {
        name: contacto.name, email: contacto.email, phone: contacto.phone,
        sourceSlug, hito, stage: "complete",
        tags: [tagInteres, ...(objetivo ? [`objetivo:${objetivo}`] : []), ...tagsRuta()],
        submissionId: submissionIdRef.current,
        notes: { ficha: buildFichaTexto(lista, SALUDO, contexto), pasosCompletados: pasos },
        formFields: lista,
      },
      honeypot,
    );
    if (!honeypot && (contacto.name || contacto.email || contacto.phone)) {
      saveContact({ name: contacto.name.trim(), email: contacto.email.trim(), phone: contacto.phone.trim() });
    }
    setOpen(false);
  }

  /* Rama efectiva: la declarada, o la que reveló el camino de exploración. */
  const rutaEfectiva = objetivo ? ramaEfectiva(objetivo, respuestas) : null;

  /* Campos de contacto — compartidos por el cierre y la pantalla de alcance. */
  const camposContacto = (soloCorreo = false) => (
    <div className="space-y-3">
      {knownName && (
        <p className="text-slate-400 text-sm">¿Sigues siendo tú, {knownName.split(" ")[0]}? Dejamos tus datos listos; corrige lo que haga falta.</p>
      )}
      {(soloCorreo
        ? [{ key: "email", type: "email", label: "Correo", ph: "correo@ejemplo.com" }]
        : [
            { key: "name", type: "text", label: "Nombre", ph: "Tu nombre completo" },
            { key: "email", type: "email", label: "Correo", ph: "correo@ejemplo.com" },
            { key: "phone", type: "tel", label: "WhatsApp", ph: "+52 555 000 0000" },
            { key: "country", type: "text", label: "País de residencia", ph: "México, Colombia, etc." },
          ]
      ).map((f) => (
        <div key={f.key}>
          <label className="text-slate-400 text-xs block mb-1">{f.label}</label>
          <input
            type={f.type}
            required={f.key === "email"}
            placeholder={f.ph}
            value={(contacto as any)[f.key]}
            onChange={(e) => setContacto({ ...contacto, [f.key]: e.target.value })}
            className="w-full bg-[#091A30] border border-[#1E3A5F] rounded-lg px-4 py-3 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>
      ))}
      <div style={{ position: "absolute", left: "-9999px", top: "-9999px", width: "1px", height: "1px", overflow: "hidden" }} aria-hidden="true">
        <input type="text" name="website" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
      </div>
    </div>
  );

  const tituloModal =
    fase === "directo" || fase === "confirmar" ? "Iniciar mi LLC"
    : fase === "fuera-de-alcance" ? "Antes de continuar"
    : fase === "resultado" || fase === "ampliado" ? "Tu resultado"
    : "Diagnóstico de estructura";

  return (
    <>
      {/* ─── Dos puertas ─── */}
      <div id={anchorId} className={`scroll-mt-24 ${className}`}>
        <div className="grid sm:grid-cols-2 gap-4">
          <button
            onClick={abrirDirecto}
            className="text-left bg-primary hover:bg-blue-600 rounded-2xl p-6 transition-all shadow-lg shadow-blue-600/20"
          >
            <ShoppingCart className="w-6 h-6 text-white mb-3" />
            <p className="text-white font-semibold mb-1">Ya sé que quiero mi LLC</p>
            <p className="text-blue-100/80 text-sm leading-relaxed">Eliges estado y pasas al pago. Sin más preguntas.</p>
            <span className="inline-flex items-center gap-1 text-white text-sm font-semibold mt-3">
              Continuar <ArrowRight className="w-4 h-4" />
            </span>
          </button>

          <button
            onClick={abrirDiagnostico}
            className="text-left bg-[#0F2847] border border-[#1E3A5F] hover:border-primary rounded-2xl p-6 transition-all"
          >
            <Compass className="w-6 h-6 text-primary mb-3" />
            <p className="text-white font-semibold mb-1">No sé qué estructura necesito</p>
            <p className="text-slate-400 text-sm leading-relaxed">Un diagnóstico corto que aclara tu caso antes de decidir.</p>
            <span className="inline-flex items-center gap-1 text-primary text-sm font-semibold mt-3">
              Hacer el diagnóstico <ArrowRight className="w-4 h-4" />
            </span>
          </button>
        </div>
      </div>

      <FlowModal open={open} onClose={cerrar} title={tituloModal}>
        {/* ═══ PUERTA 1 — Compra directa: solo estado ═══ */}
        {fase === "directo" && (
          <>
            <p className="text-slate-400 text-sm">{ESTADO_INFO.Texas ? "¿En qué estado quieres constituir?" : ""}</p>
            <div className="flex flex-col gap-3">
              {["Texas", "Florida", "otro"].map((v) => (
                <OptionButton
                  key={v}
                  label={v === "otro" ? "Otro estado" : v}
                  desc={v === "otro" ? "Nuestro servicio en línea abre en Texas y Florida." : ESTADO_INFO[v].desc}
                  onClick={() => elegirEstadoDirecto(v)}
                />
              ))}
            </div>
          </>
        )}

        {/* Confirmación antes del pago — qué incluye / qué no incluye + FAQ */}
        {fase === "confirmar" && (
          <>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-white">USD 1,499</span>
              <span className="text-slate-400 text-sm">pago único · LLC en {respuestas.estado}</span>
            </div>
            <div className="grid sm:grid-cols-2 gap-4 pt-2">
              <div>
                <p className="text-primary text-xs font-bold tracking-wider uppercase mb-2">Incluye</p>
                {INCLUYE.map((i) => (
                  <div key={i} className="flex items-start gap-2 mb-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-slate-300 text-xs leading-relaxed">{i}</span>
                  </div>
                ))}
              </div>
              <div>
                <p className="text-amber-400/90 text-xs font-bold tracking-wider uppercase mb-2">No incluye</p>
                {NO_INCLUYE.map((i) => (
                  <div key={i} className="flex items-start gap-2 mb-1.5">
                    <XCircle className="w-3.5 h-3.5 text-slate-500 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-500 text-xs leading-relaxed">{i}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="border-t border-[#1E3A5F] pt-3 space-y-2">
              {CONFIRMACION_FAQ.map((f) => (
                <details key={f.q} className="text-xs">
                  <summary className="text-slate-400 cursor-pointer hover:text-white transition-colors">{f.q}</summary>
                  <p className="text-slate-500 mt-1 leading-relaxed">{f.a}</p>
                </details>
              ))}
            </div>
            <Button onClick={pagar} className="bg-primary hover:bg-blue-600 text-white gap-2 rounded-xl py-4 w-full font-semibold">
              Continuar al pago <ArrowRight className="w-4 h-4" />
            </Button>
            <button onClick={() => setFase("directo")} className="text-slate-500 hover:text-white text-xs transition-colors w-full">
              ← Cambiar de estado
            </button>
          </>
        )}

        {/* ═══ PUERTA 2 — Paso 1: objetivo ═══ */}
        {fase === "objetivo" && (
          <>
            <p className="text-white font-medium">¿Cuál es tu objetivo con la LLC?</p>
            <div className="flex flex-col gap-3">
              {OBJETIVO_OPCIONES.map((o) => (
                <OptionButton key={o.value} label={o.label} desc={o.contexto} onClick={() => elegirObjetivo(o.value)} />
              ))}
            </div>
            {/* Salida sin fricción, disponible en cualquier punto */}
            <button onClick={abrirDirecto} className="text-slate-400 text-sm hover:text-white transition-colors underline underline-offset-2 w-full pt-1">
              Solo quiero mi LLC, no me interesa invertir
            </button>
          </>
        )}

        {/* ═══ Pasos 2 y 3 — claridad y diagnóstico por rama ═══ */}
        {fase === "preguntas" && preguntaActual && (
          <>
            <div className="flex items-center justify-between">
              <p className="text-slate-400 text-xs">Paso {idx + 2} de {listaPasos.length + 2}</p>
              {idx > 0 && (
                <button onClick={() => setIdx(idx - 1)} className="text-slate-500 hover:text-white text-xs transition-colors">← Anterior</button>
              )}
            </div>
            <div className="h-1 bg-[#1E3A5F] rounded-full overflow-hidden">
              <div className="h-full bg-primary transition-all duration-300" style={{ width: `${((idx + 2) / (listaPasos.length + 2)) * 100}%` }} />
            </div>

            {/* Contenido embebido de apoyo, según la rama */}
            {objetivo === "explorando" && idx === 0 && (
              <div className="bg-[#0B1F3A] border border-primary/20 rounded-xl p-4 space-y-2">
                {EXPLORANDO_RESUMEN.map((t) => <p key={t} className="text-slate-400 text-xs leading-relaxed">{t}</p>)}
              </div>
            )}
            {rutaEfectiva === "invertir" && preguntaActual.id === "capital" && (
              <div className="bg-[#0B1F3A] border border-primary/20 rounded-xl p-4">
                <p className="text-primary text-xs font-bold tracking-wider uppercase mb-2">Errores comunes</p>
                {INVERSION_ERRORES.map((t) => <p key={t} className="text-slate-400 text-xs leading-relaxed mb-1">· {t}</p>)}
              </div>
            )}

            {preguntaActual.help && <p className="text-slate-400 text-xs italic leading-relaxed">{preguntaActual.help}</p>}
            <p className="text-white font-medium">{preguntaActual.q}</p>
            <div className="flex flex-col gap-3">
              {preguntaActual.options.map((o) => (
                <OptionButton key={o.value} label={o.label} desc={o.desc} selected={respuestas[preguntaActual.id] === o.value} onClick={() => responder(o.value)} />
              ))}
            </div>

            {/* Autochequeo "antes de contratar" — antes de dejar pasar a checkout en Operar */}
            {rutaEfectiva === "operar" && preguntaActual.id === "socios" && (
              <details className="text-xs pt-1">
                <summary className="text-slate-400 cursor-pointer hover:text-white transition-colors">
                  ¿Cuándo conviene revisar la estructura antes de constituir?
                </summary>
                <div className="mt-2 space-y-1">
                  {SENALES_OTRA_ESTRUCTURA.map((s) => <p key={s} className="text-slate-500 leading-relaxed">· {s}</p>)}
                  <p className="text-slate-500 leading-relaxed pt-1 italic">{SENALES_NOTA}</p>
                </div>
              </details>
            )}

            <button onClick={abrirDirecto} className="text-slate-500 text-xs hover:text-white transition-colors underline underline-offset-2 w-full pt-1">
              Solo quiero mi LLC, sáltate el diagnóstico
            </button>
          </>
        )}

        {/* ═══ Último paso de preguntas — horizonte ═══ */}
        {fase === "urgencia" && (
          <>
            <div className="h-1 bg-[#1E3A5F] rounded-full overflow-hidden">
              <div className="h-full bg-primary" style={{ width: "90%" }} />
            </div>
            {rutaEfectiva === "invertir" && (
              <div className="bg-[#0B1F3A] border border-primary/20 rounded-xl p-4">
                <p className="text-primary text-xs font-bold tracking-wider uppercase mb-2">Lo que revisamos contigo</p>
                {INVERSION_PREGUNTAS_CLAVE.map((t) => <p key={t} className="text-slate-400 text-xs leading-relaxed mb-1">· {t}</p>)}
              </div>
            )}
            <p className="text-white font-medium">¿Estás listo para iniciar en las próximas 2 o 3 semanas?</p>
            <div className="flex flex-col gap-3">
              {URGENCIA_OPCIONES.map((u) => (
                <OptionButton key={u.value} label={u.label} desc={u.desc} onClick={() => elegirUrgencia(u.value)} />
              ))}
            </div>
          </>
        )}

        {/* ═══ Capa A — resultado visible para todos, antes de pedir contacto ═══ */}
        {fase === "resultado" && rec && (
          <>
            <div className="h-1 bg-[#1E3A5F] rounded-full overflow-hidden">
              <div className="h-full bg-primary" style={{ width: "100%" }} />
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <Target className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-slate-500 text-[11px] font-bold tracking-wider uppercase">Tu objetivo</p>
                  <p className="text-slate-300 text-sm leading-relaxed">{rec.objetivoTexto}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Compass className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-slate-500 text-[11px] font-bold tracking-wider uppercase">Tu perfil orientativo</p>
                  <p className="text-slate-300 text-sm leading-relaxed">{rec.perfil}</p>
                </div>
              </div>
            </div>

            {/* La ruta recomendada, sin porcentajes de viabilidad y sin la receta técnica */}
            <div className="bg-[#0B1F3A] border border-primary/30 rounded-xl p-4 space-y-2">
              <p className="text-primary text-[11px] font-bold tracking-wider uppercase">Tu ruta recomendada</p>
              <p className="text-white font-semibold leading-snug">{rec.mensajeNivel}</p>
              <p className="text-slate-400 text-sm leading-relaxed">{rec.parrafo}</p>
            </div>

            {rec.hallazgo && (
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-slate-500 text-[11px] font-bold tracking-wider uppercase">Hallazgo principal</p>
                  <p className="text-slate-300 text-sm leading-relaxed">{rec.hallazgo}</p>
                </div>
              </div>
            )}

            <div>
              <p className="text-slate-500 text-[11px] font-bold tracking-wider uppercase mb-2">Ruta general</p>
              <ol className="space-y-1.5">
                {rec.rutaGeneral.map((paso, i) => (
                  <li key={paso} className="flex items-start gap-2">
                    <span className="text-primary text-xs font-bold mt-0.5">{i + 1}.</span>
                    <span className="text-slate-400 text-xs leading-relaxed">{paso}</span>
                  </li>
                ))}
              </ol>
            </div>

            <Button onClick={() => setFase("cierre")} className="bg-primary hover:bg-blue-600 text-white gap-2 rounded-xl py-4 w-full font-semibold">
              {rec.cta.label} <ArrowRight className="w-4 h-4" />
            </Button>
            {rec.ctaSecundario && (
              <button onClick={() => setFase("cierre")} className="text-slate-400 text-sm hover:text-white transition-colors underline underline-offset-2 w-full">
                {rec.ctaSecundario.label}
              </button>
            )}
            <p className="text-slate-500 text-xs leading-relaxed">
              En el siguiente paso te mostramos el detalle: qué favorece tu caso, qué conviene revisar y el material que corresponde.
            </p>
            <AdvisoryDisclaimer variant="short" className="pt-3 border-t border-[#1E3A5F]" />
          </>
        )}

        {/* ═══ Captura de contacto — entre la Capa A y la Capa B ═══ */}
        {fase === "cierre" && (
          <form onSubmit={enviarCierre} className="space-y-3">
            <p className="text-white font-medium">
              {urgencia === "investigando" ? "Guardamos tu avance" : "Últimos datos y listo"}
            </p>
            <p className="text-slate-400 text-sm">
              {urgencia === "investigando"
                ? "Déjanos tus datos para ver el detalle de tu resultado y poder continuar después desde donde quedaste."
                : "Con esto ves el detalle de tu resultado y el equipo llega a la conversación con tu caso ya leído."}
            </p>
            {/* Estado fuera de Texas y Florida: el diagnóstico sigue, solo necesitamos saber cuál */}
            {respuestas.estado === "otro" && (
              <div>
                <label className="text-slate-400 text-xs block mb-1">¿En qué estado necesitas constituir?</label>
                <input
                  type="text"
                  value={estadoSolicitado}
                  onChange={(e) => setEstadoSolicitado(e.target.value)}
                  placeholder="California, Nueva York, etc."
                  className="w-full bg-[#091A30] border border-[#1E3A5F] rounded-lg px-4 py-3 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>
            )}
            {camposContacto()}
            <Button type="submit" className="bg-primary hover:bg-blue-600 text-white rounded-xl py-4 w-full font-semibold gap-2">
              Ver el detalle de mi resultado <ArrowRight className="w-4 h-4" />
            </Button>
            <AdvisoryDisclaimer variant="short" className="pt-3 border-t border-[#1E3A5F]" />
          </form>
        )}

        {/* ═══ Capa B — ampliación después de capturar contacto ═══ */}
        {fase === "ampliado" && rec && (
          <>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-white font-semibold">{rec.mensajeNivel}</p>
                <p className="text-slate-400 text-xs leading-relaxed mt-1">
                  {urgencia === "investigando"
                    ? "Guardamos tu avance: puedes volver a esta página y continuar donde quedaste."
                    : urgencia === "1-2-meses"
                    ? "Te damos seguimiento cuando se acerque tu fecha estimada."
                    : "Revisaremos tu caso y te indicaremos los siguientes pasos."}
                </p>
              </div>
            </div>

            <div>
              <p className="text-primary text-[11px] font-bold tracking-wider uppercase mb-2">Lo que favorece tu caso</p>
              {rec.factores.map((f) => (
                <div key={f} className="flex items-start gap-2 mb-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-slate-300 text-xs leading-relaxed">{f}</span>
                </div>
              ))}
            </div>

            {rec.temasPendientes.length > 0 && (
              <div>
                <p className="text-amber-400/90 text-[11px] font-bold tracking-wider uppercase mb-2">Temas pendientes</p>
                <p className="text-slate-400 text-xs leading-relaxed mb-2">
                  Identificamos {rec.temasPendientes.length}{" "}
                  {rec.temasPendientes.length === 1 ? "elemento que conviene revisar" : "elementos que conviene revisar"} antes de constituir:
                </p>
                {rec.temasPendientes.map((t) => (
                  <div key={t} className="flex items-start gap-2 mb-1.5">
                    <ListChecks className="w-3.5 h-3.5 text-slate-500 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-400 text-xs leading-relaxed">{t}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="bg-[#0B1F3A] border border-[#1E3A5F] rounded-xl p-4">
              <p className="text-slate-500 text-[11px] font-bold tracking-wider uppercase mb-1.5">Por qué esta recomendación</p>
              <p className="text-slate-400 text-xs leading-relaxed">{rec.motivo}</p>
            </div>

            {/* Recursos educativos: el material que corresponde a los pendientes detectados */}
            <div className="border-t border-[#1E3A5F] pt-3 space-y-2">
              <p className="text-slate-500 text-[11px] font-bold tracking-wider uppercase">Material que conviene leer</p>
              {rec.recursos.map((r) => (
                <details key={r.q} className="text-xs">
                  <summary className="text-slate-400 cursor-pointer hover:text-white transition-colors">{r.q}</summary>
                  <p className="text-slate-500 mt-1 leading-relaxed">{r.a}</p>
                </details>
              ))}
            </div>

            <div className="flex flex-col gap-3 pt-1">
              <Button onClick={() => ejecutarCta(rec.cta)} className="bg-primary hover:bg-blue-600 text-white gap-2 rounded-xl py-4 w-full font-semibold">
                {rec.cta.label} <ArrowRight className="w-4 h-4" />
              </Button>
              {rec.ctaSecundario && (
                <Button onClick={() => ejecutarCta(rec.ctaSecundario!)} variant="outline" className="border-slate-600 text-white hover:bg-white/10 rounded-xl py-4 w-full gap-2">
                  {rec.ctaSecundario.label} <ArrowRight className="w-4 h-4" />
                </Button>
              )}
              {rec.cta.action !== "whatsapp" && (
                <Button onClick={() => porWhatsApp()} variant="outline" className="border-slate-600 text-white hover:bg-white/10 rounded-xl py-4 w-full gap-2">
                  <MessageSquare className="w-4 h-4" /> Solicitar llamada de orientación
                </Button>
              )}
              {rutaEfectiva === "invertir" && (
                <a href="/gps?ref=diagnostico-estructura&intent=inversion" className="text-primary text-xs font-semibold underline underline-offset-2 hover:text-blue-300 transition-colors text-center">
                  Continuar al perfilador de inversión →
                </a>
              )}
            </div>

            {/* Retroalimentación: calidad de datos y prioridad de seguimiento (Capa C) */}
            <div className="border-t border-[#1E3A5F] pt-3">
              {retro ? (
                <p className="text-slate-400 text-xs leading-relaxed">
                  {retro === "no"
                    ? "Gracias. Revisaremos tu caso a mano: si el diagnóstico no lo refleja, la conversación empieza por ahí."
                    : "Gracias, lo tomamos en cuenta para la conversación."}
                </p>
              ) : (
                <>
                  <p className="text-white text-sm font-medium mb-2">¿Esta recomendación refleja tu situación?</p>
                  <div className="flex flex-col gap-2">
                    {RETRO_OPCIONES.map((o) => (
                      <button
                        key={o.value}
                        onClick={() => responderRetro(o.value)}
                        className="text-left rounded-lg px-4 py-2.5 border border-[#1E3A5F] bg-[#0B1F3A] text-slate-300 text-xs hover:border-primary/60 hover:text-white transition-all"
                      >
                        {o.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            <AdvisoryDisclaimer variant="short" className="pt-3 border-t border-[#1E3A5F]" />
          </>
        )}

        {/* ═══ Alcance del checkout en línea ═══
            No es una salida del diagnóstico: el servicio en línea abre en Texas y
            Florida, y para el resto referimos a un proveedor que sí lo cubre. */}
        {fase === "fuera-de-alcance" && (
          <>
            <div className="flex items-center gap-2">
              <MapPin className="w-6 h-6 text-amber-400" />
              <p className="text-white font-semibold">Actualmente solo abrimos en Texas y Florida</p>
            </div>
            <p>
              No queremos venderte un servicio que no cubre tu caso. Si necesitas constituir en otro estado,
              te ponemos en contacto con un proveedor externo que sí lo cubre.
            </p>
            <div>
              <label className="text-slate-400 text-xs block mb-1">¿En qué estado necesitas constituir?</label>
              <input
                type="text"
                autoFocus
                value={estadoSolicitado}
                onChange={(e) => setEstadoSolicitado(e.target.value)}
                placeholder="California, Nueva York, etc."
                className="w-full bg-[#091A30] border border-[#1E3A5F] rounded-lg px-4 py-3 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>
            {camposContacto()}
            <Button
              onClick={() => porWhatsApp(`Necesito constituir en ${estadoSolicitado.trim() || "un estado fuera de Texas y Florida"}.`, "referido_estado_solicitado")}
              disabled={!estadoSolicitado.trim()}
              className="bg-primary hover:bg-blue-600 text-white gap-2 rounded-xl py-4 w-full disabled:opacity-50"
            >
              <MessageSquare className="w-4 h-4" /> Quiero el referido
            </Button>
            <AdvisoryDisclaimer variant="short" className="pt-3 border-t border-[#1E3A5F]" />
          </>
        )}
      </FlowModal>
    </>
  );
}
