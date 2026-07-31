/*
 * Punto de entrada único para las guías de estructura (LLC e inversión).
 *
 * Dos puertas mutuamente excluyentes:
 *   1. Compra directa — solo estado, austera a propósito. Sin preguntas extra
 *      ni desvíos. Vive en este componente.
 *   2. Diagnóstico de estructura — seis preguntas como máximo, ninguna rama usa
 *      todas, y tres resultados posibles: ruta clara, requiere revisión, o no
 *      conviene abrir todavía. Vive en `DiagnosticoEstructura`.
 *
 * El diagnóstico no rutea hacia la compra: produce criterio. Solo cuando su
 * resultado es "ruta clara" ofrece iniciar la formación en línea —con el mismo
 * peso visual que la llamada— y ese camino entra aquí, en la pantalla de
 * confirmación, con el estado que la propia persona declaró.
 *
 * El alcance del checkout en línea (Texas y Florida) es una frontera de este
 * componente, no del diagnóstico: fuera de esos estados se resuelve con un
 * referido, no con una salida sin respuesta.
 */
import { useState, useEffect, useImperativeHandle, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, XCircle, ShoppingCart, Compass, MessageSquare, MapPin } from "lucide-react";
import { openWhatsApp, WHATSAPP_PHONE } from "@/lib/whatsapp";
import { type FichaContacto, postCrmLead, saveContact, getSavedContact, buildFichaTexto, origenCampos } from "@/lib/crm";
import AdvisoryDisclaimer from "@/components/AdvisoryDisclaimer";
import { FlowModal, OptionButton } from "@/components/FlowModal";
import DiagnosticoEstructura from "@/components/DiagnosticoEstructura";
import { ESTADO_INFO } from "@/lib/estados";
import { INCLUYE, NO_INCLUYE, CONFIRMACION_FAQ } from "@/lib/formacionLlc";

type Fase = "directo" | "confirmar" | "fuera-de-alcance";

/** Permite que un disparador externo (el CTA fijo móvil) abra el diagnóstico. */
export type EstructuraFlowHandle = { abrirDiagnostico: () => void };

const SALUDO = "Hola, vengo de la guía de estructura de Comprando América.";

export default function EstructuraFlow({
  sourceSlug,
  onCheckout,
  className = "",
  anchorId,
  variant = "dos-puertas",
  ref,
  onOpenChange,
}: {
  /** "web_ca_llc" | "web_ca_inversion" — de qué página viene el lead. */
  sourceSlug: string;
  /** Dispara el checkout real de la página (Clover). Solo Texas/Florida. */
  onCheckout: (estado: "texas" | "florida") => void;
  className?: string;
  /** Ancla opcional. Solo una instancia por página debe declararla (ids únicos). */
  anchorId?: string;
  /**
   * Jerarquía de la entrada. "dos-puertas" las presenta como equivalentes.
   * "diagnostico-primero" pone el diagnóstico al frente y deja la compra directa
   * como salida discreta: para heros que abren con una pregunta, no con una oferta.
   * Las dos puertas siguen existiendo en ambos casos.
   */
  variant?: "dos-puertas" | "diagnostico-primero";
  /** Handle opcional para abrir el diagnóstico desde fuera del componente. */
  ref?: React.Ref<EstructuraFlowHandle>;
  /**
   * Avisa cuando algún modal se abre o se cierra. La página lo usa para esconder
   * su CTA fijo de móvil: los modales viven dentro de un contenedor animado, así
   * que su z-index no alcanza a un elemento fijo de la página.
   */
  onOpenChange?: (abierto: boolean) => void;
}) {
  const [open, setOpen] = useState(false);
  const [diagOpen, setDiagOpen] = useState(false);
  const [fase, setFase] = useState<Fase>("directo");
  const [estado, setEstado] = useState("");
  const [estadoSolicitado, setEstadoSolicitado] = useState("");
  const [honeypot, setHoneypot] = useState("");

  const [contacto, setContacto] = useState<FichaContacto>({ name: "", email: "", phone: "", country: "" });
  /* Personalización solo con señal real: dato guardado por el propio usuario en este navegador. */
  const [knownName, setKnownName] = useState<string | null>(null);

  /* La etiqueta de interés depende de la página de origen, no se fija a LLC. */
  const tagInteres = sourceSlug === "web_ca_inversion" ? "interes:inversion" : "interes:llc";

  const submissionIdRef = useRef<string | null>(null);
  if (submissionIdRef.current === null) submissionIdRef.current = crypto.randomUUID();

  useEffect(() => {
    const saved = getSavedContact();
    if (!saved) return;
    setKnownName(saved.name || null);
    setContacto((p) => ({ ...p, name: p.name || saved.name || "", email: p.email || saved.email || "", phone: p.phone || saved.phone || "" }));
  }, []);

  /* El CTA fijo de móvil vive fuera de este componente y necesita abrir el
     diagnóstico de esta misma instancia (el modal es fixed: da igual el scroll). */
  useImperativeHandle(ref, () => ({ abrirDiagnostico }));

  useEffect(() => {
    onOpenChange?.(open || diagOpen);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, diagOpen]);

  /* ─── CRM ─── */
  function campos() {
    const estadoValue =
      estado === "otro"
        ? `No cubierto${estadoSolicitado.trim() ? ` — solicitó ${estadoSolicitado.trim()}` : ""}`
        : estado;
    return [
      { label: "Nombre", value: contacto.name },
      { label: "Correo", value: contacto.email },
      { label: "WhatsApp", value: contacto.phone },
      { label: "País", value: contacto.country },
      { label: "Estado elegido", value: estadoValue },
      ...origenCampos(),
    ].filter((c) => c.value.trim());
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
        notes: { ficha: buildFichaTexto(lista, SALUDO, extra?.nota) },
        formFields: lista,
      },
      honeypot,
    );
  }

  /* Fuera del alcance del checkout en línea: se registra al mostrarse la pantalla. */
  const alcanceRegistradoRef = useRef(false);
  useEffect(() => {
    if (!open || fase !== "fuera-de-alcance" || alcanceRegistradoRef.current) return;
    alcanceRegistradoRef.current = true;
    evento("estado_fuera_de_alcance", { tags: ["alcance:fuera-de-texas-florida"] });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, fase]);

  /* ─── Puertas ─── */
  function abrirDirecto() {
    setFase("directo");
    setEstado("");
    setEstadoSolicitado("");
    alcanceRegistradoRef.current = false;
    submissionIdRef.current = crypto.randomUUID();
    setDiagOpen(false);
    setOpen(true);
  }

  function abrirDiagnostico() {
    setOpen(false);
    setDiagOpen(true);
  }

  function elegirEstado(v: string) {
    setEstado(v);
    if (v === "otro") {
      alcanceRegistradoRef.current = false;
      setFase("fuera-de-alcance");
      return;
    }
    setFase("confirmar");
  }

  /* Resultado A del diagnóstico: la formación en línea entra por la pantalla de
     confirmación, con el estado donde va a ocurrir la operación ya declarado. */
  function formacionDesdeDiagnostico(v: "texas" | "florida") {
    setDiagOpen(false);
    setEstado(v === "texas" ? "Texas" : "Florida");
    setFase("confirmar");
    setOpen(true);
  }

  function pagar() {
    const destino = estado === "Florida" ? "florida" : "texas";
    evento("checkout_directo_iniciado", { stage: "complete", tags: ["checkout:directo"] });
    setOpen(false);
    onCheckout(destino);
  }

  function porWhatsApp(contexto: string, hito: string) {
    const lista = campos();
    openWhatsApp(WHATSAPP_PHONE, buildFichaTexto(lista, SALUDO, contexto));
    postCrmLead(
      {
        name: contacto.name, email: contacto.email, phone: contacto.phone,
        sourceSlug, hito, stage: "complete",
        tags: [tagInteres],
        submissionId: submissionIdRef.current,
        notes: { ficha: buildFichaTexto(lista, SALUDO, contexto) },
        formFields: lista,
      },
      honeypot,
    );
    if (!honeypot && (contacto.name || contacto.email || contacto.phone)) {
      saveContact({ name: contacto.name.trim(), email: contacto.email.trim(), phone: contacto.phone.trim() });
    }
    setOpen(false);
  }

  const tituloModal = fase === "fuera-de-alcance" ? "Antes de continuar" : "Iniciar mi LLC";

  return (
    <>
      {/* ─── Entrada ─── */}
      <div id={anchorId} className={`scroll-mt-24 ${className}`}>
        {variant === "diagnostico-primero" ? (
          /* El diagnóstico es la acción principal; comprar directo sigue a un clic. */
          <div className="max-w-xl">
            <button
              onClick={abrirDiagnostico}
              className="text-left bg-primary hover:bg-blue-600 rounded-2xl p-6 transition-all shadow-lg shadow-blue-600/20 w-full"
            >
              <Compass className="w-6 h-6 text-white mb-3" />
              <p className="text-white font-semibold mb-1">Hacer el diagnóstico</p>
              <p className="text-blue-100/80 text-sm leading-relaxed">
                Unas preguntas sobre tu caso y te decimos qué ruta corresponde hoy — incluso si esa ruta no es una LLC.
              </p>
              <span className="inline-flex items-center gap-1 text-white text-sm font-semibold mt-3">
                Comenzar <ArrowRight className="w-4 h-4" />
              </span>
            </button>
            <button
              onClick={abrirDirecto}
              className="text-slate-400 text-sm hover:text-white transition-colors underline underline-offset-4 mt-4 inline-flex items-center gap-1"
            >
              Ya sé que quiero mi LLC, ir directo al proceso <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
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
        )}
      </div>

      {/* ═══ PUERTA 1 — Compra directa ═══ */}
      <FlowModal open={open} onClose={() => setOpen(false)} title={tituloModal}>
        {fase === "directo" && (
          <>
            <p className="text-slate-400 text-sm">¿En qué estado quieres constituir?</p>
            <div className="flex flex-col gap-3">
              {["Texas", "Florida", "otro"].map((v) => (
                <OptionButton
                  key={v}
                  label={v === "otro" ? "Otro estado" : v}
                  desc={v === "otro" ? "Nuestro servicio en línea abre en Texas y Florida." : ESTADO_INFO[v].desc}
                  onClick={() => elegirEstado(v)}
                />
              ))}
            </div>
            <button
              onClick={abrirDiagnostico}
              className="text-slate-400 text-sm hover:text-white transition-colors underline underline-offset-2 w-full pt-1"
            >
              Prefiero hacer el diagnóstico antes de decidir
            </button>
          </>
        )}

        {/* Confirmación antes del pago — qué incluye / qué no incluye + FAQ */}
        {fase === "confirmar" && (
          <>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-white">USD 1,499</span>
              <span className="text-slate-400 text-sm">pago único · LLC en {estado}</span>
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
            <AdvisoryDisclaimer variant="short" className="pt-3 border-t border-[#1E3A5F]" />
          </>
        )}

        {/* ═══ Alcance del checkout en línea ═══
            El servicio en línea abre en Texas y Florida, y para el resto
            referimos a un proveedor que sí lo cubre. */}
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
            <div className="space-y-3">
              {knownName && (
                <p className="text-slate-400 text-sm">¿Sigues siendo tú, {knownName.split(" ")[0]}? Dejamos tus datos listos; corrige lo que haga falta.</p>
              )}
              {[
                { key: "name", type: "text", label: "Nombre", ph: "Tu nombre completo" },
                { key: "email", type: "email", label: "Correo", ph: "correo@ejemplo.com" },
                { key: "phone", type: "tel", label: "WhatsApp", ph: "+52 555 000 0000" },
                { key: "country", type: "text", label: "País de residencia", ph: "México, Colombia, etc." },
              ].map((f) => (
                <div key={f.key}>
                  <label className="text-slate-400 text-xs block mb-1">{f.label}</label>
                  <input
                    type={f.type}
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

      {/* ═══ PUERTA 2 — Diagnóstico de estructura ═══ */}
      <DiagnosticoEstructura
        open={diagOpen}
        onClose={() => setDiagOpen(false)}
        sourceSlug={sourceSlug}
        onFormacionEnLinea={formacionDesdeDiagnostico}
      />
    </>
  );
}
