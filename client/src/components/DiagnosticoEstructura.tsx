/*
 * Modal "Diagnóstico de estructura".
 *
 * El diagnóstico no rutea hacia un producto: ubica a la persona. Produce
 * criterio; la llamada valida. Tres consecuencias que gobiernan este componente:
 *
 *   1. Ninguna pregunta ofrece elegir dónde constituir. P4 pregunta dónde va a
 *      ocurrir la operación —un hecho de la vida de quien contesta— y Texas o
 *      Florida solo reaparecen en el resultado, como una de varias salidas.
 *   2. "No conviene abrir todavía" (resultado C) es un resultado de primera
 *      clase, no una pantalla de error. No lleva ningún CTA de formación en
 *      línea: ni secundario, ni al pie.
 *   3. Las tres pantallas declaran, con el mismo texto, lo que no hacemos.
 *
 * Los bloques informativos aparecen dentro del flujo y nunca bloquean el avance:
 * son información, no advertencia. Por eso no llevan ícono ni color de alerta.
 *
 * Las preguntas y la lógica de resultado viven en `lib/diagnosticoEstructura.ts`.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FlowModal, OptionButton } from "@/components/FlowModal";
import AdvisoryDisclaimer from "@/components/AdvisoryDisclaimer";
import { openWhatsApp, WHATSAPP_PHONE } from "@/lib/whatsapp";
import { type FichaContacto, postCrmLead, saveContact, getSavedContact, buildFichaTexto, origenCampos } from "@/lib/crm";
import {
  type Decision, type Pregunta, type Respuestas,
  ALCANCE, DERIVACION, RESULTADO_A, RESULTADO_B, RESULTADO_C, RESULTADO_ETIQUETA,
  alternarDecision, bloqueDe, camposDiagnostico, evaluarDiagnostico, pasosDe,
} from "@/lib/diagnosticoEstructura";

const SALUDO = "Hola, vengo del diagnóstico de estructura de Comprando América.";
const RECURSOS_URL = "/recursos";

type Fase = "preguntas" | "resultado" | "llamada" | "enviado";

/* ─── Bloque informativo dentro del flujo ───
   Card de fondo tenue, sin ícono y sin color de advertencia: informa, no alerta. */
function BloqueInformativo({ titulo, parrafos }: { titulo: string; parrafos: string[] }) {
  return (
    <div className="bg-[#0B1F3A] border border-[#1E3A5F] rounded-xl p-4 space-y-2">
      <p className="text-white text-sm font-medium">{titulo}</p>
      {parrafos.map((t) => (
        <p key={t} className="text-slate-400 text-xs leading-relaxed">{t}</p>
      ))}
    </div>
  );
}

function Seccion({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <p className="text-primary text-[11px] font-bold tracking-wider uppercase">{titulo}</p>
      {children}
    </div>
  );
}

/** Viñeta sin ícono de check: son criterios de decisión, no una lista de beneficios. */
function Vineta({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-slate-300 text-sm leading-relaxed flex gap-2">
      <span className="text-primary flex-shrink-0" aria-hidden="true">·</span>
      <span>{children}</span>
    </p>
  );
}

/** Alcance — idéntico en las tres pantallas. Requisito, no adorno. */
function BloqueAlcance() {
  return (
    <div className="bg-[#0B1F3A] border border-[#1E3A5F] rounded-xl p-4 space-y-2">
      <p className="text-white text-sm font-medium">{ALCANCE.titulo}</p>
      <p className="text-slate-400 text-xs leading-relaxed">
        <span className="text-slate-300 font-medium">Lo que hacemos:</span> {ALCANCE.hacemos}
      </p>
      <p className="text-slate-400 text-xs leading-relaxed">{ALCANCE.nota}</p>
      <p className="text-slate-400 text-xs leading-relaxed">
        <span className="text-slate-300 font-medium">Lo que no hacemos:</span> {ALCANCE.noHacemos}
      </p>
    </div>
  );
}

export default function DiagnosticoEstructura({
  open,
  onClose,
  sourceSlug,
  onFormacionEnLinea,
}: {
  open: boolean;
  onClose: () => void;
  /** "web_ca_llc" | "web_ca_inversion" — de qué página viene el lead. */
  sourceSlug: string;
  /**
   * Resultado A: iniciar la formación en línea en el estado donde va a ocurrir
   * la operación. Solo se ofrece en esa pantalla.
   */
  onFormacionEnLinea: (estado: "texas" | "florida") => void;
}) {
  const [fase, setFase] = useState<Fase>("preguntas");
  const [respuestas, setRespuestas] = useState<Respuestas>({});
  const [idx, setIdx] = useState(0);
  const [autoriza, setAutoriza] = useState(false);
  const [contacto, setContacto] = useState<FichaContacto>({ name: "", email: "", phone: "", country: "" });
  const [honeypot, setHoneypot] = useState("");
  const [knownName, setKnownName] = useState<string | null>(null);

  const tagInteres = sourceSlug === "web_ca_inversion" ? "interes:inversion" : "interes:llc";

  const submissionIdRef = useRef<string | null>(null);
  if (submissionIdRef.current === null) submissionIdRef.current = crypto.randomUUID();
  const iniciadoRef = useRef(false);
  const completadoRef = useRef(false);
  /** Último resultado registrado en el CRM: si la persona corrige y cambia, se registra de nuevo. */
  const resultadoRegistradoRef = useRef<string | null>(null);

  /* Personalización solo con señal real: dato guardado por el propio usuario. */
  useEffect(() => {
    const saved = getSavedContact();
    if (!saved) return;
    setKnownName(saved.name || null);
    setContacto((p) => ({ ...p, name: p.name || saved.name || "", email: p.email || saved.email || "", phone: p.phone || saved.phone || "" }));
  }, []);

  /* Al abrir, el diagnóstico empieza limpio: sus respuestas son de este momento. */
  useEffect(() => {
    if (!open) return;
    setFase("preguntas");
    setRespuestas({});
    setIdx(0);
    setAutoriza(false);
    iniciadoRef.current = false;
    completadoRef.current = false;
    resultadoRegistradoRef.current = null;
    submissionIdRef.current = crypto.randomUUID();
  }, [open]);

  const pasos = useMemo(() => pasosDe(respuestas), [respuestas]);
  const pregunta: Pregunta | undefined = pasos[idx];
  const diagnostico = useMemo(() => evaluarDiagnostico(respuestas), [respuestas]);

  /* Cambiar de rama acorta la lista de preguntas: el índice nunca debe quedar
     apuntando fuera de ella. */
  useEffect(() => {
    if (idx > pasos.length - 1) setIdx(Math.max(0, pasos.length - 1));
  }, [pasos.length, idx]);

  /* ─── CRM ───
     Se guarda el conjunto de respuestas más el resultado calculado: sirve para
     calificar y para detectar patrones (cuántos llegan pidiendo Wyoming). */
  function campos(autorizaDerivacion = autoriza) {
    return [
      { label: "Nombre", value: contacto.name },
      { label: "Correo", value: contacto.email },
      { label: "WhatsApp", value: contacto.phone },
      { label: "País", value: contacto.country },
      ...camposDiagnostico(respuestas, diagnostico, { autorizaDerivacion }),
      ...origenCampos(),
    ].filter((c) => c.value.trim());
  }

  const tagsResultado = () => [`resultado:${diagnostico.resultado}`, ...diagnostico.disparadores.map((d) => `revision:${d}`)];

  function evento(hito: string, extra?: { stage?: "partial" | "complete"; tags?: string[]; nota?: string; autorizaDerivacion?: boolean }) {
    const lista = campos(extra?.autorizaDerivacion ?? autoriza);
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

  function cerrar() {
    if (iniciadoRef.current && !completadoRef.current) evento("diagnostico_abandonado");
    onClose();
  }

  useEffect(() => {
    function onUnload() {
      if (open && iniciadoRef.current && !completadoRef.current) evento("diagnostico_abandonado");
    }
    window.addEventListener("beforeunload", onUnload);
    return () => window.removeEventListener("beforeunload", onUnload);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, respuestas, fase]);

  /* El resultado se registra al mostrarse, no solo si la persona actúa. Si vuelve
     a corregir respuestas y el resultado cambia, se registra el nuevo. */
  const claveResultado = `${diagnostico.resultado}|${diagnostico.disparadores.join(",")}`;
  useEffect(() => {
    if (fase !== "resultado" || resultadoRegistradoRef.current === claveResultado) return;
    resultadoRegistradoRef.current = claveResultado;
    evento("diagnostico_resultado", { tags: tagsResultado() });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fase, claveResultado]);

  /* ─── Avance ───
     Una respuesta que abre un bloque informativo o un campo de texto no avanza
     sola: el bloque se lee en su lugar y la persona continúa cuando quiere. */
  function requiereConfirmacion(p: Pregunta, r: Respuestas): boolean {
    if (p.tipo === "multiple") return true;
    if (p.id === "lugar" && r.lugar === "otro-estado") return true;
    return bloqueDe(p.id, r) !== null;
  }

  function avanzar(r: Respuestas) {
    const lista = pasosDe(r);
    if (idx + 1 < lista.length) {
      setIdx(idx + 1);
      return;
    }
    setFase("resultado");
  }

  function responder(p: Pregunta, valor: string) {
    /* Cambiar el objetivo cambia la rama: las respuestas de la rama anterior
       dejan de aplicar y no deben viajar al resultado ni al CRM. */
    const base: Respuestas =
      p.id === "objetivo" && respuestas.objetivo && respuestas.objetivo !== valor
        ? { ...respuestas, tipoOperacion: undefined, tipoInversion: undefined, acompanamiento: undefined, documentos: undefined }
        : respuestas;
    const next = { ...base, [p.id]: valor } as Respuestas;
    setRespuestas(next);

    if (p.id === "objetivo" && !iniciadoRef.current) {
      iniciadoRef.current = true;
      postCrmLead(
        {
          name: contacto.name, email: contacto.email, phone: contacto.phone,
          sourceSlug, hito: "diagnostico_iniciado", stage: "partial",
          tags: [tagInteres, `objetivo:${valor}`],
          submissionId: submissionIdRef.current,
          formFields: origenCampos(),
        },
        honeypot,
      );
    }

    if (requiereConfirmacion(p, next)) return;
    avanzar(next);
  }

  function elegirLugarLibre(texto: string) {
    setRespuestas((prev) => ({ ...prev, estadoLibre: texto }));
  }

  /* ─── Salidas del resultado ─── */
  function iniciarFormacion() {
    if (!diagnostico.estado) return;
    completadoRef.current = true;
    evento("formacion_en_linea_desde_diagnostico", { stage: "complete", tags: [...tagsResultado(), "ruta:formacion-en-linea"] });
    onFormacionEnLinea(diagnostico.estado === "Texas" ? "texas" : "florida");
  }

  function pedirLlamada() {
    setFase("llamada");
  }

  function enviarLlamada(e: React.FormEvent) {
    e.preventDefault();
    completadoRef.current = true;
    const lista = campos();
    const contexto = `Resultado del diagnóstico: ${RESULTADO_ETIQUETA[diagnostico.resultado]}.${
      autoriza ? " Autorizo que compartan mi información con el abogado de migración." : ""
    }`;
    openWhatsApp(WHATSAPP_PHONE, buildFichaTexto(lista, SALUDO, contexto));
    postCrmLead(
      {
        name: contacto.name, email: contacto.email, phone: contacto.phone,
        sourceSlug, hito: "llamada_diagnostico_solicitada", stage: "complete",
        tags: [tagInteres, ...tagsResultado(), ...(autoriza ? ["derivacion:autorizada"] : [])],
        submissionId: submissionIdRef.current,
        notes: { ficha: buildFichaTexto(lista, SALUDO, contexto) },
        formFields: lista,
      },
      honeypot,
    );
    if (!honeypot && (contacto.name || contacto.email || contacto.phone)) {
      saveContact({ name: contacto.name.trim(), email: contacto.email.trim(), phone: contacto.phone.trim() });
    }
    setFase("enviado");
  }

  function cambiarAutorizacion(v: boolean) {
    setAutoriza(v);
    if (v) evento("derivacion_autorizada", { tags: [...tagsResultado(), "derivacion:autorizada"], autorizaDerivacion: true });
  }

  /* ─── Indicador de progreso ───
     Las ramas tienen distinto largo. Mientras el objetivo no está declarado no se
     conoce el total de la rama, así que se muestra solo el número de pregunta:
     un "2 de 6" cuando la ruta real tiene 4 se lee como engaño justo en la pieza
     donde se construye confianza. */
  const totalRama = respuestas.objetivo ? pasos.length : null;

  const bloque = pregunta ? bloqueDe(pregunta.id, respuestas) : null;
  const decisionSel: Decision[] = respuestas.decision ?? [];

  return (
    <FlowModal open={open} onClose={cerrar} title="Diagnóstico de estructura">
      {/* ═══ Preguntas ═══ */}
      {fase === "preguntas" && pregunta && (
        <>
          <div className="flex items-center justify-between">
            <p className="text-slate-400 text-xs">
              Pregunta {idx + 1}{totalRama ? ` de ${totalRama}` : ""}
            </p>
            {idx > 0 && (
              <button onClick={() => setIdx(idx - 1)} className="text-slate-500 hover:text-white text-xs transition-colors">
                ← Anterior
              </button>
            )}
          </div>
          {totalRama && (
            <div className="h-1 bg-[#1E3A5F] rounded-full overflow-hidden">
              <div className="h-full bg-primary transition-all duration-300" style={{ width: `${((idx + 1) / totalRama) * 100}%` }} />
            </div>
          )}

          <p className="text-white font-medium">{pregunta.q}</p>
          {pregunta.subtexto && <p className="text-slate-400 text-xs leading-relaxed">{pregunta.subtexto}</p>}

          <div className="flex flex-col gap-3">
            {pregunta.options.map((o) =>
              pregunta.tipo === "multiple" ? (
                <OptionButton
                  key={o.value}
                  label={o.label}
                  desc={o.desc}
                  selected={decisionSel.includes(o.value as Decision)}
                  onClick={() => setRespuestas({ ...respuestas, decision: alternarDecision(decisionSel, o.value as Decision) })}
                />
              ) : (
                <OptionButton
                  key={o.value}
                  label={o.label}
                  desc={o.desc}
                  selected={(respuestas[pregunta.id] as string | undefined) === o.value}
                  onClick={() => responder(pregunta, o.value)}
                />
              ),
            )}
          </div>

          {pregunta.tipo === "multiple" && <p className="text-slate-500 text-xs">Puedes elegir más de una.</p>}

          {/* Texto libre del estado. No bloquea el avance: se puede continuar sin llenarlo. */}
          {pregunta.id === "lugar" && respuestas.lugar === "otro-estado" && (
            <div>
              <label className="text-slate-400 text-xs block mb-1" htmlFor="estado-libre">¿Cuál?</label>
              <input
                id="estado-libre"
                type="text"
                autoFocus
                value={respuestas.estadoLibre ?? ""}
                onChange={(e) => elegirLugarLibre(e.target.value)}
                placeholder="California, Nueva York, Wyoming…"
                className="w-full bg-[#091A30] border border-[#1E3A5F] rounded-lg px-4 py-3 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-primary/50 transition-colors"
              />
            </div>
          )}

          {bloque && <BloqueInformativo {...bloque} />}

          {requiereConfirmacion(pregunta, respuestas) && (respuestas[pregunta.id] !== undefined || decisionSel.length > 0) && (
            <Button
              onClick={() => avanzar(respuestas)}
              disabled={pregunta.tipo === "multiple" && decisionSel.length === 0}
              className="bg-primary hover:bg-blue-600 text-white gap-2 rounded-xl py-4 w-full font-semibold disabled:opacity-50"
            >
              Continuar <ArrowRight className="w-4 h-4" />
            </Button>
          )}
        </>
      )}

      {/* ═══ Resultado A — ruta clara ═══ */}
      {fase === "resultado" && diagnostico.resultado === "A" && diagnostico.estado && (
        <>
          <h4 className="text-white font-semibold text-lg leading-snug">{RESULTADO_A.titulo}</h4>

          <Seccion titulo="Cómo entendemos tu situación">
            <p className="text-slate-300 text-sm leading-relaxed">{diagnostico.parrafo}</p>
          </Seccion>

          <Seccion titulo="Lo que realmente hay que decidir">
            {RESULTADO_A.decidir(diagnostico.estado).map((t) => (
              <p key={t} className="text-slate-300 text-sm leading-relaxed">{t}</p>
            ))}
          </Seccion>

          {diagnostico.mencionaInfraestructura && (
            <p className="text-slate-300 text-sm leading-relaxed">{RESULTADO_A.infraestructura}</p>
          )}

          <Seccion titulo="Qué sigue">
            <p className="text-slate-300 text-sm leading-relaxed">{RESULTADO_A.sigueIntro}</p>
            {/* Los dos caminos van con el mismo peso visual: si uno fuera botón
                sólido y el otro un enlace, la jerarquía contradiría el copy. */}
            <div className="grid gap-3">
              <button
                onClick={iniciarFormacion}
                className="text-left rounded-xl px-5 py-4 border border-primary/60 bg-primary/10 hover:bg-primary/20 transition-all"
              >
                <span className="text-white text-sm font-semibold">Iniciar la formación en línea en {diagnostico.estado}</span>
                <span className="block text-slate-400 text-xs mt-1 leading-relaxed">
                  Si ya tienes claridad y prefieres avanzar por tu cuenta.
                </span>
              </button>
              <button
                onClick={pedirLlamada}
                className="text-left rounded-xl px-5 py-4 border border-primary/60 bg-primary/10 hover:bg-primary/20 transition-all"
              >
                <span className="text-white text-sm font-semibold">Agendar la llamada de diagnóstico</span>
                <span className="block text-slate-400 text-xs mt-1 leading-relaxed">
                  Si quieres validar el detalle antes de constituir.
                </span>
              </button>
            </div>
          </Seccion>

          <BloqueAlcance />

          <Seccion titulo={RESULTADO_A.llamadaTitulo}>
            <p className="text-slate-300 text-sm leading-relaxed">{RESULTADO_A.llamada}</p>
          </Seccion>

          <PieResultado onRevisar={() => setFase("preguntas")} />
        </>
      )}

      {/* ═══ Resultado B — requiere revisión ═══ */}
      {fase === "resultado" && diagnostico.resultado === "B" && (
        <>
          <h4 className="text-white font-semibold text-lg leading-snug">{RESULTADO_B.titulo}</h4>

          <Seccion titulo="Cómo entendemos tu situación">
            <p className="text-slate-300 text-sm leading-relaxed">{diagnostico.parrafo}</p>
          </Seccion>

          <Seccion titulo={RESULTADO_B.razonesTitulo}>
            {diagnostico.razones.map((r) => (
              <p key={r.id} className="text-slate-300 text-sm leading-relaxed">{r.texto}</p>
            ))}
          </Seccion>

          <Seccion titulo="Qué sigue">
            <p className="text-slate-300 text-sm leading-relaxed">{RESULTADO_B.sigue}</p>
            <Button onClick={pedirLlamada} className="bg-primary hover:bg-blue-600 text-white gap-2 rounded-xl py-4 w-full font-semibold">
              Agendar la llamada de diagnóstico <ArrowRight className="w-4 h-4" />
            </Button>
          </Seccion>

          {/* Derivación: el abogado no es parte del equipo y no se promete
              resultado — solo el contacto, y con consentimiento explícito. */}
          {diagnostico.mostrarDerivacion && (
            <div className="bg-[#0B1F3A] border border-[#1E3A5F] rounded-xl p-4 space-y-3">
              <p className="text-white text-sm font-medium">{DERIVACION.titulo}</p>
              <p className="text-slate-400 text-xs leading-relaxed">{DERIVACION.cuerpo}</p>
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoriza}
                  onChange={(e) => cambiarAutorizacion(e.target.checked)}
                  className="mt-0.5 h-4 w-4 flex-shrink-0 rounded border-[#1E3A5F] bg-[#091A30] accent-blue-500"
                />
                <span className="text-slate-300 text-xs leading-relaxed">{DERIVACION.consentimiento}</span>
              </label>
            </div>
          )}

          <BloqueAlcance />
          <PieResultado onRevisar={() => setFase("preguntas")} />
        </>
      )}

      {/* ═══ Resultado C — no conviene aún ═══
          Restricción dura: ningún CTA de formación en línea en esta pantalla. */}
      {fase === "resultado" && diagnostico.resultado === "C" && (
        <>
          <h4 className="text-white font-semibold text-lg leading-snug">{RESULTADO_C.titulo}</h4>

          <Seccion titulo="Cómo entendemos tu situación">
            <p className="text-slate-300 text-sm leading-relaxed">{diagnostico.parrafo}</p>
          </Seccion>

          <Seccion titulo={RESULTADO_C.porQueTitulo}>
            <p className="text-slate-300 text-sm leading-relaxed">{RESULTADO_C.porQue}</p>
          </Seccion>

          <Seccion titulo={RESULTADO_C.primeroTitulo}>
            {RESULTADO_C.primero.map((t) => <Vineta key={t}>{t}</Vineta>)}
            <p className="text-slate-300 text-sm leading-relaxed pt-1">{RESULTADO_C.cierre}</p>
          </Seccion>

          <Seccion titulo="Qué sigue">
            <Vineta>
              <a href={RECURSOS_URL} className="text-primary underline underline-offset-2 hover:text-blue-300 transition-colors">
                {RESULTADO_C.sigue[0]}
              </a>
            </Vineta>
            <Vineta>
              {RESULTADO_C.sigue[1]}{" "}
              <button onClick={pedirLlamada} className="text-primary underline underline-offset-2 hover:text-blue-300 transition-colors">
                Agendar la llamada
              </button>
            </Vineta>
          </Seccion>

          <BloqueAlcance />
          <PieResultado onRevisar={() => setFase("preguntas")} />
        </>
      )}

      {/* ═══ Llamada de diagnóstico ═══ */}
      {fase === "llamada" && (
        <form onSubmit={enviarLlamada} className="space-y-3">
          <p className="text-white font-medium">Agendar la llamada de diagnóstico</p>
          <p className="text-slate-400 text-sm">
            Con esto llegamos a la conversación con tu caso ya leído. No hay nada que comprar en la llamada.
          </p>
          {knownName && (
            <p className="text-slate-400 text-sm">
              ¿Sigues siendo tú, {knownName.split(" ")[0]}? Dejamos tus datos listos; corrige lo que haga falta.
            </p>
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
          <Button type="submit" className="bg-primary hover:bg-blue-600 text-white rounded-xl py-4 w-full font-semibold gap-2">
            <MessageSquare className="w-4 h-4" /> Continuar por WhatsApp
          </Button>
          <button type="button" onClick={() => setFase("resultado")} className="text-slate-500 hover:text-white text-xs transition-colors w-full">
            ← Volver a mi resultado
          </button>
          <AdvisoryDisclaimer variant="short" className="pt-3 border-t border-[#1E3A5F]" />
        </form>
      )}

      {fase === "enviado" && (
        <>
          <p className="text-white font-medium">Tu caso ya está con el equipo</p>
          <p className="text-slate-300 text-sm leading-relaxed">
            Abrimos WhatsApp con el resumen de tus respuestas para que no tengas que repetirlo. Si la ventana no se
            abrió, escríbenos y retomamos desde ahí.
          </p>
          <button onClick={() => setFase("resultado")} className="text-slate-400 text-sm hover:text-white transition-colors underline underline-offset-2">
            Volver a mi resultado
          </button>
          <AdvisoryDisclaimer variant="short" className="pt-3 border-t border-[#1E3A5F]" />
        </>
      )}
    </FlowModal>
  );
}

/* Volver a las respuestas es parte del diseño: un formulario que no deja volver
   es un embudo, uno que sí es una guía. */
function PieResultado({ onRevisar }: { onRevisar: () => void }) {
  return (
    <div className="pt-3 border-t border-[#1E3A5F] space-y-2">
      <button onClick={onRevisar} className="text-slate-500 hover:text-white text-xs transition-colors">
        ← Revisar o corregir mis respuestas
      </button>
      <AdvisoryDisclaimer variant="short" />
    </div>
  );
}
