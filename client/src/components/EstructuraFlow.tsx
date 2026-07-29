/*
 * Punto de entrada único para las guías de estructura (LLC e inversión).
 * Reemplaza los dos CTA paralelos del hero y la tarjeta de 3 opciones que estaba
 * duplicada en ambas páginas.
 *
 * Dos puertas mutuamente excluyentes:
 *   1. Compra directa — solo estado, austera a propósito. Sin preguntas de
 *      calificación ni desvíos hacia inversión.
 *   2. Diagnóstico integral — objetivo → claridad → diagnóstico por rama →
 *      calificación económica, con el contenido educativo embebido en cada paso.
 *
 * "Solo quiero mi LLC" es una salida válida y sin fricción en cualquier punto.
 */
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, X, CheckCircle2, XCircle, ShoppingCart, Compass, MessageSquare, AlertTriangle, MapPin } from "lucide-react";
import { openWhatsApp, WHATSAPP_PHONE } from "@/lib/whatsapp";
import { postCrmLead, saveContact, getSavedContact } from "@/lib/crm";
import AdvisoryDisclaimer from "@/components/AdvisoryDisclaimer";
import {
  type Objetivo, type Urgencia, type Descalificacion, type Pregunta, type FichaContacto,
  OBJETIVO_OPCIONES, URGENCIA_OPCIONES, ESTADO_INFO, SENALES_OTRA_ESTRUCTURA, SENALES_NOTA,
  INCLUYE, NO_INCLUYE, CONFIRMACION_FAQ, INVERSION_ERRORES, INVERSION_PREGUNTAS_CLAVE,
  EXPLORANDO_RESUMEN, pasosDeRama, preguntaAplica, evaluarDescalificacion,
  fichaCampos, origenCampos, buildFichaTexto,
} from "@/lib/diagnostico";

type Fase = "directo" | "confirmar" | "objetivo" | "preguntas" | "urgencia" | "cierre" | "descalificado";

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
  const [descalificacion, setDescalificacion] = useState<Descalificacion | null>(null);
  const [idx, setIdx] = useState(0);
  const [pasos, setPasos] = useState(0);
  const [enviado, setEnviado] = useState(false);
  const [honeypot, setHoneypot] = useState("");

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

  /* ─── CRM ─── */
  function campos() {
    return [
      ...fichaCampos({ contacto, objetivo, respuestas, urgencia, estadoSolicitado, pasosCompletados: pasos, descalificacion }),
      ...origenCampos(),
    ];
  }

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

  /* Registra la descalificación al llegar a la pantalla, no solo si el usuario actúa.
     Así queda el motivo aunque abandone ahí mismo. */
  const descalifRegistradaRef = useRef<Descalificacion | null>(null);
  useEffect(() => {
    if (fase !== "descalificado" || !descalificacion) return;
    if (descalifRegistradaRef.current === descalificacion) return;
    descalifRegistradaRef.current = descalificacion;
    evento(descalificacion === "estado" ? "descalificado_estado" : "descalificado_capital", {
      tags: [`descalificado:${descalificacion}`],
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fase, descalificacion]);

  /* ─── Puertas ─── */
  function abrirDirecto() {
    setFase("directo");
    setObjetivo(null);
    setRespuestas({});
    setDescalificacion(null);
    setEstadoSolicitado("");
    setPasos(0);
    setEnviado(false);
    completadoRef.current = false;
    iniciadoRef.current = false;
    setOpen(true);
  }

  function abrirDiagnostico() {
    setFase("objetivo");
    setObjetivo(null);
    setRespuestas({});
    setUrgencia(null);
    setDescalificacion(null);
    setEstadoSolicitado("");
    setIdx(0);
    setPasos(0);
    setEnviado(false);
    completadoRef.current = false;
    iniciadoRef.current = false;
    setOpen(true);
  }

  /* ─── Compra directa: solo estado ─── */
  function elegirEstadoDirecto(v: string) {
    if (v === "otro") {
      setRespuestas({ estado: "otro" });
      setDescalificacion("estado");
      setFase("descalificado");
      return;
    }
    setRespuestas({ estado: v });
    setFase("confirmar");
  }

  function pagar() {
    const estado = respuestas.estado === "Florida" ? "florida" : "texas";
    completadoRef.current = true;
    evento("checkout_directo_iniciado", { stage: "complete", tags: ["checkout:directo"] });
    setOpen(false);
    onCheckout(estado);
  }

  /* ─── Diagnóstico integral ─── */
  const listaPasos: Pregunta[] = objetivo ? pasosDeRama(objetivo, respuestas.rutaExplorando).filter((p) => preguntaAplica(p, respuestas)) : [];
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

  function responder(v: string) {
    const next = { ...respuestas, [preguntaActual.id]: v };
    setRespuestas(next);
    const nuevosPasos = pasos + 1;
    setPasos(nuevosPasos);

    // Estado no cubierto: pide cuál antes de descalificar, para poder referir.
    if (preguntaActual.id === "estado" && v === "otro") {
      setDescalificacion("estado");
      setFase("descalificado");
      return;
    }
    // Capital insuficiente: no pasa al perfilador, se le ofrece la ruta de operar.
    const desc = evaluarDescalificacion(objetivo!, next);
    if (desc === "capital") {
      setDescalificacion("capital");
      setFase("descalificado");
      return;
    }

    const lista = pasosDeRama(objetivo!, next.rutaExplorando).filter((p) => preguntaAplica(p, next));
    if (idx + 1 < lista.length) {
      setIdx(idx + 1);
      evento("diagnostico_paso_completado");
    } else {
      evento("diagnostico_paso_completado");
      setFase("urgencia");
    }
  }

  function elegirUrgencia(v: Urgencia) {
    setUrgencia(v);
    setPasos(pasos + 1);
    setFase("cierre");
  }

  /* Cierre: envía la ficha completa. La rama invertir calificada pasa al perfilador. */
  function enviarCierre(e: React.FormEvent) {
    e.preventDefault();
    if (enviado) return;
    completadoRef.current = true;
    const lista = campos();
    postCrmLead(
      {
        name: contacto.name, email: contacto.email, phone: contacto.phone,
        sourceSlug, hito: "diagnostico_completado", stage: "complete",
        tags: [tagInteres, `objetivo:${objetivo}`, ...(urgencia ? [`urgencia:${urgencia}`] : [])],
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
        tags: [tagInteres, ...(objetivo ? [`objetivo:${objetivo}`] : []), ...(descalificacion ? [`descalificado:${descalificacion}`] : [])],
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

  const rutaEfectiva = objetivo === "explorando" ? respuestas.rutaExplorando : objetivo;

  /* Campos de contacto — compartidos por el cierre y las descalificaciones. */
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
    : fase === "descalificado" ? "Antes de continuar"
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

        {/* ═══ Paso 4 — calificación económica ═══ */}
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

        {/* ═══ Cierre ═══ */}
        {fase === "cierre" && (
          <>
            {enviado ? (
              <div className="py-2">
                <div className="text-center mb-4">
                  <CheckCircle2 className="w-10 h-10 text-primary mx-auto mb-3" />
                  <p className="text-white font-semibold mb-2">
                    {urgencia === "investigando" ? "Avance guardado" : "Información recibida"}
                  </p>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    {urgencia === "investigando"
                      ? "Puedes volver a esta página y continuar donde quedaste. El contenido está aquí, no te enviamos nada aparte."
                      : urgencia === "1-2-meses"
                      ? "Te damos seguimiento cuando se acerque tu fecha estimada."
                      : "Revisaremos tu caso y te indicaremos los siguientes pasos."}
                  </p>
                </div>
                {/* Invertir calificado: el paso lógico es el perfilador */}
                {rutaEfectiva === "invertir" && (
                  <a href="/gps?ref=diagnostico-estructura&intent=inversion">
                    <Button className="bg-primary hover:bg-blue-600 text-white gap-2 rounded-xl py-4 w-full mb-3">
                      Continuar al perfilador de inversión <ArrowRight className="w-4 h-4" />
                    </Button>
                  </a>
                )}
                {rutaEfectiva === "operar" && respuestas.estado && respuestas.estado !== "otro" && respuestas.estado !== "no-seguro" && (
                  <Button onClick={() => { setFase("confirmar"); }} className="bg-primary hover:bg-blue-600 text-white gap-2 rounded-xl py-4 w-full mb-3">
                    Continuar con mi LLC en {respuestas.estado} <ArrowRight className="w-4 h-4" />
                  </Button>
                )}
                <Button onClick={() => porWhatsApp()} variant="outline" className="border-slate-600 text-white hover:bg-white/10 rounded-xl py-4 w-full gap-2">
                  <MessageSquare className="w-4 h-4" /> Solicitar llamada de orientación
                </Button>
              </div>
            ) : (
              <form onSubmit={enviarCierre} className="space-y-3">
                <p className="text-white font-medium">
                  {urgencia === "investigando" ? "Guardamos tu avance" : "Últimos datos y listo"}
                </p>
                <p className="text-slate-400 text-sm">
                  {urgencia === "investigando"
                    ? "Déjanos tu correo para que puedas continuar después desde donde quedaste."
                    : "Con esto el equipo llega a la conversación con tu caso ya leído."}
                </p>
                {camposContacto(urgencia === "investigando")}
                <Button type="submit" className="bg-primary hover:bg-blue-600 text-white rounded-xl py-4 w-full font-semibold gap-2">
                  {urgencia === "investigando" ? "Guardar mi avance" : "Enviar mi diagnóstico"} <ArrowRight className="w-4 h-4" />
                </Button>
              </form>
            )}
            <AdvisoryDisclaimer variant="short" className="pt-3 border-t border-[#1E3A5F]" />
          </>
        )}

        {/* ═══ Descalificaciones ═══ */}
        {fase === "descalificado" && descalificacion === "estado" && (
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
              onClick={() => porWhatsApp(`Necesito constituir en ${estadoSolicitado.trim() || "un estado fuera de Texas y Florida"}.`, "descalificado_estado")}
              disabled={!estadoSolicitado.trim()}
              className="bg-primary hover:bg-blue-600 text-white gap-2 rounded-xl py-4 w-full disabled:opacity-50"
            >
              <MessageSquare className="w-4 h-4" /> Quiero el referido
            </Button>
            <AdvisoryDisclaimer variant="short" className="pt-3 border-t border-[#1E3A5F]" />
          </>
        )}

        {fase === "descalificado" && descalificacion === "capital" && (
          <>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-amber-400" />
              <p className="text-white font-semibold">Hoy no calificas para el club de inversión</p>
            </div>
            <p>
              Seremos claros: la estructura de inversión requiere una capacidad desde $100,000 USD. Eso no cierra
              la puerta — puedes estructurar tu LLC para operar mientras construyes capital, y volver cuando estés listo.
            </p>
            <div className="flex flex-col gap-3 pt-1">
              <Button
                onClick={() => { setDescalificacion(null); setObjetivo("operar"); setRespuestas({}); setIdx(0); setFase("preguntas"); }}
                className="bg-primary hover:bg-blue-600 text-white gap-2 rounded-xl py-4 w-full"
              >
                Estructurar mi LLC para operar <ArrowRight className="w-4 h-4" />
              </Button>
              <Button
                onClick={() => porWhatsApp("Mi capacidad de inversión es menor a $100,000 USD y quiero orientación sobre por dónde empezar.", "descalificado_capital")}
                variant="outline"
                className="border-slate-600 text-white hover:bg-white/10 rounded-xl py-4 w-full gap-2"
              >
                <MessageSquare className="w-4 h-4" /> Quiero orientación
              </Button>
            </div>
            <AdvisoryDisclaimer variant="short" className="pt-3 border-t border-[#1E3A5F]" />
          </>
        )}
      </FlowModal>
    </>
  );
}
