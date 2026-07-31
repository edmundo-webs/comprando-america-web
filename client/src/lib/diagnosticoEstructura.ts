/*
 * Diagnóstico de estructura — preguntas, bloques informativos y lógica de resultado.
 *
 * Principio de diseño (gobierna todo lo que hay aquí):
 *   1. El diagnóstico no rutea hacia un producto, ubica a la persona. Ninguna
 *      pregunta ofrece como opción los estados donde se vende el servicio: Texas
 *      y Florida solo aparecen en el resultado, como una de varias salidas.
 *   2. "No conviene abrir todavía" es un resultado de primera clase, no un error.
 *   3. Cada resultado declara explícitamente lo que Comprando América no hace.
 *
 * Si una decisión de implementación entra en conflicto con esos tres puntos,
 * gana el principio.
 *
 * La composición del párrafo de apertura es una biblioteca de fragmentos, no
 * plantillas completas: se ensambla con las respuestas y se recorta a cuatro
 * oraciones como máximo.
 *
 * El criterio de estado no se redacta aquí: vive en `lib/estados.ts`, que lo
 * comparte con la FAQ y la sección educativa de la página.
 */
import { REGISTRO_FUERA_DEL_ESTADO } from "./estados";

/* ─── Vocabulario ─── */
export type Objetivo = "operar" | "invertir" | "visa" | "explorando";
export type TipoOperacion = "servicios" | "productos" | "presencia" | "cliente";
export type TipoInversion = "renta" | "uso-personal" | "proyecto-terceros" | "resguardo";
export type Acompanamiento = "con-abogado" | "sin-abogado" | "no-sabe";
export type Etapa = "facturando" | "identificado" | "capital-sin-operacion" | "investigando";
export type Lugar = "texas" | "florida" | "otro-estado" | "sin-definir" | "solo-digital";
export type Decision = "solo-yo" | "conyuge" | "socios" | "inversionistas" | "profesional";
export type Documentos = "ssn" | "itin" | "ninguno" | "no-sabe";

export type Respuestas = {
  objetivo?: Objetivo;
  tipoOperacion?: TipoOperacion;
  tipoInversion?: TipoInversion;
  acompanamiento?: Acompanamiento;
  etapa?: Etapa;
  lugar?: Lugar;
  /** Texto libre capturado cuando `lugar = otro-estado`. */
  estadoLibre?: string;
  decision?: Decision[];
  documentos?: Documentos;
};

export type PreguntaId =
  | "objetivo" | "tipoOperacion" | "tipoInversion" | "acompanamiento"
  | "etapa" | "lugar" | "decision" | "documentos";

export type Opcion = { value: string; label: string; desc?: string };

export type Pregunta = {
  id: PreguntaId;
  /** Etiqueta con la que la respuesta llega al CRM. */
  label: string;
  q: string;
  subtexto?: string;
  tipo: "unica" | "multiple";
  options: Opcion[];
  /** Si la pregunta forma parte de la rama que revelaron las respuestas previas. */
  aplica: (r: Respuestas) => boolean;
};

/* ─── P1 · Objetivo (todas las ramas) ───
   Las descripciones de esta pregunta ya están en producción: se conservan tal
   cual, no se reescriben. */
const P1: Pregunta = {
  id: "objetivo",
  label: "Objetivo",
  q: "¿Cuál es tu objetivo con la LLC?",
  tipo: "unica",
  aplica: () => true,
  options: [
    {
      value: "operar",
      label: "Operar",
      desc: "Prestar servicios, facturar, vender productos o iniciar una operación en Estados Unidos. Aquí la LLC suele ser la herramienta correcta y el proceso es directo.",
    },
    {
      value: "invertir",
      label: "Invertir",
      desc: "Estructurar capital para adquirir activos o participar en proyectos. Antes de constituir conviene definir el vehículo de inversión, no solo la entidad.",
    },
    {
      value: "visa",
      label: "Visa",
      desc: "Una empresa vinculada a una estrategia migratoria, como la E-2. La estructura y el capital deben ser coherentes con ese proceso desde el inicio.",
    },
    {
      value: "explorando",
      label: "Todavía estoy explorando",
      desc: "No necesitas claridad para empezar. Vamos paso a paso y te mostramos lo que conviene saber antes de decidir.",
    },
  ],
};

/* ─── P2a · Tipo de operación (solo si P1 = operar) ─── */
const P2A: Pregunta = {
  id: "tipoOperacion",
  label: "Tipo de operación",
  q: "¿Qué tipo de operación va a tener la empresa?",
  tipo: "unica",
  aplica: (r) => r.objetivo === "operar",
  options: [
    { value: "servicios", label: "Servicios profesionales", desc: "Consultoría, desarrollo, diseño, asesoría — trabajo que facturas a clientes." },
    { value: "productos", label: "Productos o e-commerce", desc: "Venta de productos físicos, propios o de terceros, con o sin inventario en EE.UU." },
    { value: "presencia", label: "Operación con presencia física", desc: "Local, oficina, personal contratado o inventario en un lugar determinado." },
    { value: "cliente", label: "Recibir pagos de un cliente específico", desc: "Ya tienes a quién facturar y necesitas la estructura para poder hacerlo." },
  ],
};

/* ─── P2b · Tipo de inversión (solo si P1 = invertir) ─── */
const P2B: Pregunta = {
  id: "tipoInversion",
  label: "Tipo de inversión",
  q: "¿Qué tipo de inversión tienes en mente?",
  tipo: "unica",
  aplica: (r) => r.objetivo === "invertir",
  options: [
    { value: "renta", label: "Propiedad para renta", desc: "Generar ingreso con uno o varios inmuebles." },
    { value: "uso-personal", label: "Propiedad para uso personal", desc: "Casa o departamento para uso propio, con o sin renta ocasional." },
    { value: "proyecto-terceros", label: "Participar en un proyecto de alguien más", desc: "Entrar como socio o inversionista en algo que otro opera." },
    { value: "resguardo", label: "Resguardar capital", desc: "Proteger patrimonio o diversificar fuera de tu país." },
  ],
};

/* ─── P2c · Acompañamiento migratorio (solo si P1 = visa) ─── */
const P2C: Pregunta = {
  id: "acompanamiento",
  label: "Acompañamiento migratorio",
  q: "¿Ya cuentas con acompañamiento migratorio?",
  tipo: "unica",
  aplica: (r) => r.objetivo === "visa",
  options: [
    { value: "con-abogado", label: "Sí, ya trabajo con un abogado" },
    { value: "sin-abogado", label: "No, apenas investigo" },
    { value: "no-sabe", label: "No sé si lo necesito" },
  ],
};

/* ─── P3 · Etapa (todas las ramas) ─── */
const P3: Pregunta = {
  id: "etapa",
  label: "Etapa",
  q: "¿En qué punto estás hoy?",
  tipo: "unica",
  aplica: () => true,
  options: [
    { value: "facturando", label: "Ya estoy facturando o generando ingresos", desc: "La actividad existe y necesitas formalizarla o reestructurarla." },
    { value: "identificado", label: "Tengo clientes o el proyecto identificado", desc: "Sabes qué vas a hacer y con quién, falta constituir." },
    { value: "capital-sin-operacion", label: "Tengo el capital, no la operación", desc: "Hay recursos disponibles pero el destino aún no está definido." },
    { value: "investigando", label: "Apenas estoy investigando", desc: "Quieres entender antes de decidir cualquier cosa." },
  ],
};

/* ─── P4 · Dónde va a operar (todas las ramas) ───
   Texas y Florida no son opciones de esta pregunta: aquí se declara dónde ocurre
   la operación, no dónde se compra el servicio. */
const P4: Pregunta = {
  id: "lugar",
  label: "Dónde va a ocurrir la operación",
  q: "¿Dónde va a ocurrir la operación?",
  subtexto: "Donde estarán los clientes, el personal, las propiedades o la administración del día a día.",
  tipo: "unica",
  aplica: () => true,
  options: [
    { value: "texas", label: "Texas" },
    { value: "florida", label: "Florida" },
    { value: "otro-estado", label: "Otro estado de EE.UU." },
    { value: "sin-definir", label: "Aún no lo defino" },
    { value: "solo-digital", label: "Solo digital, sin presencia física" },
  ],
};

/* ─── P5 · Quién participa en la decisión (todas las ramas, selección múltiple) ─── */
const P5: Pregunta = {
  id: "decision",
  label: "Quién participa en la decisión",
  q: "¿Quién más participa en esta decisión?",
  tipo: "multiple",
  aplica: () => true,
  options: [
    { value: "solo-yo", label: "Solo yo" },
    { value: "conyuge", label: "Mi cónyuge" },
    { value: "socios", label: "Uno o más socios" },
    { value: "inversionistas", label: "Inversionistas externos" },
    { value: "profesional", label: "Un abogado o contador ya involucrado" },
  ],
};

/* ─── P6 · Documentos fiscales (solo si P1 = operar o invertir) ───
   No cambia el resultado: solo determina si el resultado menciona el paquete de
   infraestructura (agente registrado y dirección comercial para el registro).
   No se pregunta residencia fiscal: es una determinación legal que no le
   corresponde autoevaluar a la persona ni a Comprando América actuar sobre ella. */
const P6: Pregunta = {
  id: "documentos",
  label: "Documentos fiscales",
  q: "¿Cuentas con número de seguro social (SSN) o ITIN?",
  tipo: "unica",
  aplica: (r) => r.objetivo === "operar" || r.objetivo === "invertir",
  options: [
    { value: "ssn", label: "Sí, tengo SSN" },
    { value: "itin", label: "Sí, tengo ITIN" },
    { value: "ninguno", label: "No tengo ninguno" },
    { value: "no-sabe", label: "No sé qué es" },
  ],
};

/** Orden canónico. Cada rama es un subconjunto: ninguna usa todas. */
export const PREGUNTAS: Pregunta[] = [P1, P2A, P2B, P2C, P3, P4, P5, P6];

/** Preguntas que corresponden a la rama revelada por las respuestas de hoy. */
export function pasosDe(r: Respuestas): Pregunta[] {
  return PREGUNTAS.filter((p) => p.aplica(r));
}

/** `solo-yo` es mutuamente excluyente con el resto. */
export function alternarDecision(actual: Decision[] | undefined, valor: Decision): Decision[] {
  const previo = actual ?? [];
  if (valor === "solo-yo") return previo.includes("solo-yo") ? [] : ["solo-yo"];
  const sinSoloYo = previo.filter((v) => v !== "solo-yo");
  return sinSoloYo.includes(valor) ? sinSoloYo.filter((v) => v !== valor) : [...sinSoloYo, valor];
}

/* ─── Bloques inline ───
   Aparecen dentro del flujo, sin interrumpir el avance: son información, no
   error. Nunca se convierten en modales que bloqueen el paso siguiente. */
export type BloqueInline = { titulo: string; parrafos: string[] };

/* El argumento no se redacta aquí: es el mismo que la FAQ y la sección educativa,
   en su versión para este bloque. Vive en `lib/estados.ts` — ver la nota de las
   tres extensiones antes de editarlo o de creer que alguna es duplicado. */
export const BLOQUE_ESTADOS_MENCIONADOS: BloqueInline = {
  titulo: "Sobre Wyoming, Delaware y Nevada",
  parrafos: REGISTRO_FUERA_DEL_ESTADO.corta,
};

export const BLOQUE_SOLO_DIGITAL: BloqueInline = {
  titulo: "Sin presencia física",
  parrafos: [
    "No tener oficina ni personal en un estado determinado no elimina el criterio, solo cambia qué pesa más: dónde están tus clientes, dónde se administra el negocio en el día a día, y tu situación personal de residencia. Es un caso frecuente y tiene respuesta — solo no la tiene un formulario.",
  ],
};

export const BLOQUE_VISA_SIN_ABOGADO: BloqueInline = {
  titulo: "Sobre el orden de las cosas",
  parrafos: [
    "Cuando la empresa está vinculada a un proceso migratorio, la estructura y el capital tienen que ser coherentes con ese proceso desde el inicio. Esa coherencia la define tu abogado migratorio; nosotros trabajamos a partir de sus requisitos, no al revés. Si todavía no tienes uno, ese es el primer paso — antes de constituir.",
  ],
};

export const BLOQUE_ITIN: BloqueInline = {
  titulo: "Qué es el ITIN",
  parrafos: [
    "El ITIN es un número que emite el IRS para que una persona sin seguro social pueda cumplir con obligaciones fiscales en Estados Unidos. No es un permiso de trabajo ni un estatus migratorio. No necesitas tenerlo para constituir con nosotros — si no lo tienes, es parte de lo que resolvemos.",
  ],
};

/* Estados que más circulan en redes. El bloque informativo aparece cuando el
   texto libre los menciona, y nunca bloquea el avance. */
const ESTADOS_MENCIONADOS = ["wyoming", "delaware", "nevada"];

export function normalizarEstado(valor: string): string {
  return valor
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export function mencionaEstadoDeRedes(valor?: string): boolean {
  if (!valor) return false;
  const n = normalizarEstado(valor);
  return ESTADOS_MENCIONADOS.some((e) => n.includes(e));
}

/** Bloque informativo que corresponde a la respuesta actual de una pregunta. */
export function bloqueDe(id: PreguntaId, r: Respuestas): BloqueInline | null {
  if (id === "acompanamiento" && (r.acompanamiento === "sin-abogado" || r.acompanamiento === "no-sabe")) {
    return BLOQUE_VISA_SIN_ABOGADO;
  }
  if (id === "lugar" && r.lugar === "solo-digital") return BLOQUE_SOLO_DIGITAL;
  if (id === "lugar" && r.lugar === "otro-estado" && mencionaEstadoDeRedes(r.estadoLibre)) {
    return BLOQUE_ESTADOS_MENCIONADOS;
  }
  if (id === "documentos" && r.documentos === "no-sabe") return BLOQUE_ITIN;
  return null;
}

/* ─── Composición del párrafo de apertura ───
   Plantilla: `Buscas {objetivo}. {etapa} {lugar} {decision}`. Se omiten los
   fragmentos vacíos y se recorta a cuatro oraciones. */

const FRAGMENTO_OBJETIVO: Record<string, string> = {
  "operar:servicios": "prestar servicios profesionales y facturarlos desde Estados Unidos",
  "operar:productos": "vender productos en el mercado estadounidense",
  "operar:presencia": "montar una operación con presencia física",
  "operar:cliente": "poder facturarle a un cliente que ya tienes",
  "invertir:renta": "adquirir propiedad para generar ingreso por renta",
  "invertir:uso-personal": "adquirir una propiedad para uso personal",
  "invertir:proyecto-terceros": "participar como inversionista en un proyecto que opera alguien más",
  "invertir:resguardo": "resguardar capital fuera de tu país",
  visa: "una estructura vinculada a un proceso migratorio",
  explorando: "entender qué opciones tienes antes de decidir",
};

const FRAGMENTO_ETAPA: Record<Etapa, string> = {
  facturando: "La actividad ya existe y genera ingresos.",
  identificado: "Ya sabes qué vas a hacer y con quién.",
  "capital-sin-operacion": "Tienes los recursos, pero el destino todavía no está definido.",
  investigando: "Todavía estás en etapa de investigación.",
};

const FRAGMENTO_DECISION: Partial<Record<Decision, string>> = {
  conyuge: "La decisión la tomas junto con tu cónyuge.",
  socios: "Hay socios involucrados en la decisión.",
  inversionistas: "Hay inversionistas externos involucrados.",
  profesional: "Ya hay un profesional acompañándote.",
  /* `solo-yo` se omite a propósito: no agrega nada al párrafo. */
};

/** Prioridad cuando hay varias personas en la decisión. */
const PRIORIDAD_DECISION: Decision[] = ["inversionistas", "socios", "conyuge", "profesional"];

export const NOMBRE_ESTADO: Record<"texas" | "florida", "Texas" | "Florida"> = {
  texas: "Texas",
  florida: "Florida",
};

function fragmentoObjetivo(r: Respuestas): string {
  if (!r.objetivo) return "";
  const clave =
    r.objetivo === "operar" && r.tipoOperacion ? `operar:${r.tipoOperacion}`
    : r.objetivo === "invertir" && r.tipoInversion ? `invertir:${r.tipoInversion}`
    : r.objetivo;
  const frag = FRAGMENTO_OBJETIVO[clave];
  return frag ? `Buscas ${frag}.` : "";
}

function fragmentoLugar(r: Respuestas): string {
  switch (r.lugar) {
    case "texas":
    case "florida":
      return `La operación va a ocurrir en ${NOMBRE_ESTADO[r.lugar]}.`;
    case "otro-estado":
      return `Mencionas ${r.estadoLibre?.trim() || "otro estado"} como lugar de registro.`;
    case "sin-definir":
      return "Todavía no está definido dónde va a ocurrir la operación.";
    case "solo-digital":
      return "No habrá presencia física en un estado determinado.";
    default:
      return "";
  }
}

function fragmentosDecision(r: Respuestas): string[] {
  const sel = r.decision ?? [];
  return PRIORIDAD_DECISION.filter((d) => sel.includes(d))
    .map((d) => FRAGMENTO_DECISION[d]!)
    .slice(0, 2);
}

/** Máximo cuatro oraciones: si al ensamblar suena redundante, gana la brevedad. */
export function parrafoSituacion(r: Respuestas): string {
  /* "Todavía estás en etapa de investigación. Todavía no está definido dónde va
     a ocurrir la operación." dice dos veces lo mismo y con la misma palabra: en
     ese par se queda el fragmento más concreto. */
  const etapaRedundante = r.etapa === "investigando" && r.lugar === "sin-definir";
  const oraciones = [
    fragmentoObjetivo(r),
    r.etapa && !etapaRedundante ? FRAGMENTO_ETAPA[r.etapa] : "",
    fragmentoLugar(r),
    ...fragmentosDecision(r),
  ].filter(Boolean);
  return oraciones.slice(0, 4).join(" ");
}

/* ─── Lógica de resultado ───
   Se evalúa en orden: C, luego B, luego A. El primero que se cumple gana, y
   cualquier combinación que no caiga limpia en A o C es B.
   Regla dura: ante duda, revisión. Nunca "ruta clara" por descarte. */
export type Resultado = "A" | "B" | "C";
export type RazonId = "B1" | "B2" | "B3" | "B4" | "B5";

export type Diagnostico = {
  resultado: Resultado;
  /** Todos los disparadores de revisión que se cumplen. */
  disparadores: RazonId[];
  /** Los que se muestran: máximo dos, el más específico primero. */
  razones: { id: RazonId; texto: string }[];
  parrafo: string;
  /** Estado de la operación cuando el resultado A lo tiene definido. */
  estado: "Texas" | "Florida" | null;
  /** El resultado menciona el paquete de infraestructura (P6 = ninguno). */
  mencionaInfraestructura: boolean;
  /** Bloque de derivación: solo en el resultado B, cuando hay visa u otro estado. */
  mostrarDerivacion: boolean;
};

const DECISION_COMPATIBLE_A: Decision[] = ["solo-yo", "conyuge", "profesional"];

/** Orden de prioridad al comunicar: el más específico primero. */
const PRIORIDAD_RAZONES: RazonId[] = ["B3", "B1", "B2", "B5", "B4"];

const RAZON_TEXTO: Record<Exclude<RazonId, "B4">, string> = {
  B1: "Cuando hay más de un dueño, el acuerdo entre socios y la distribución de participación se definen antes de constituir. Corregirlo después es posible pero costoso.",
  B2: "En inversión, el vehículo se define antes que la entidad. Una LLC puede ser parte de la respuesta, pero rara vez es la respuesta completa — y el orden en que se arma cambia el resultado.",
  B3: "Cuando la empresa está vinculada a un proceso migratorio, la estructura y el capital tienen que ser coherentes con ese proceso desde el inicio. Esa coherencia la define tu abogado migratorio; nosotros trabajamos a partir de sus requisitos, no al revés.",
  B5: "Cuando hay recursos pero el destino no está definido, constituir primero suele ser el orden equivocado. La entidad se elige en función del activo, y el activo todavía no está decidido.",
};

/* B4 cubre tres respuestas distintas de P4 y la razón se redacta según cuál sea:
   "el estado que mencionas" no aplica a quien contestó que aún no lo define o
   que no habrá presencia física. El motivo de fondo es el mismo en los tres. */
function razonB4(lugar?: Lugar): string {
  if (lugar === "sin-definir") {
    return "Todavía no está definido dónde va a ocurrir la operación, y ese es justamente el criterio que determina el estado — no al revés. Conviene resolverlo antes de constituir, porque cambiarlo después significa registrar de nuevo.";
  }
  if (lugar === "solo-digital") {
    return "Sin presencia física en un estado determinado, el criterio no desaparece: pesa dónde están tus clientes, dónde se administra el negocio y tu situación personal de residencia. Eso se revisa en una conversación, no en un formulario.";
  }
  return "El estado que mencionas requiere revisión, y no porque sea una mala opción — sino porque conviene confirmar que responde a dónde va a ocurrir la operación y no a lo que suele circular en redes.";
}

function textoRazon(id: RazonId, r: Respuestas): string {
  return id === "B4" ? razonB4(r.lugar) : RAZON_TEXTO[id];
}

export function evaluarDiagnostico(r: Respuestas): Diagnostico {
  const decision = r.decision ?? [];

  const disparadores: RazonId[] = [];
  if (decision.includes("socios") || decision.includes("inversionistas")) disparadores.push("B1");
  if (r.objetivo === "invertir" && r.tipoInversion !== "renta") disparadores.push("B2");
  if (r.objetivo === "visa") disparadores.push("B3");
  if (r.lugar === "otro-estado" || r.lugar === "sin-definir" || r.lugar === "solo-digital") disparadores.push("B4");
  if (r.etapa === "capital-sin-operacion") disparadores.push("B5");

  /* Resultado C — no conviene aún. Se evalúa primero: es un resultado de
     primera clase, no la salida de error de los otros dos. */
  const esC = r.etapa === "investigando" && (r.objetivo === "explorando" || r.lugar === "sin-definir");

  /* Resultado A — ruta clara. Solo si todas las condiciones se cumplen. */
  const esA =
    r.objetivo === "operar" &&
    (r.etapa === "facturando" || r.etapa === "identificado") &&
    (r.lugar === "texas" || r.lugar === "florida") &&
    decision.length > 0 &&
    decision.every((d) => DECISION_COMPATIBLE_A.includes(d));

  const resultado: Resultado = esC ? "C" : disparadores.length ? "B" : esA ? "A" : "B";

  const razones =
    resultado === "B"
      ? PRIORIDAD_RAZONES.filter((id) => disparadores.includes(id))
          .slice(0, 2)
          .map((id) => ({ id, texto: textoRazon(id, r) }))
      : [];

  return {
    resultado,
    disparadores,
    razones,
    parrafo: parrafoSituacion(r),
    estado: r.lugar === "texas" || r.lugar === "florida" ? NOMBRE_ESTADO[r.lugar] : null,
    mencionaInfraestructura: r.documentos === "ninguno",
    mostrarDerivacion: resultado === "B" && (disparadores.includes("B3") || disparadores.includes("B4")),
  };
}

/* ─── Copy de las pantallas de resultado ───
   Vive aquí y no en el componente para que la regla dura del resultado C —
   ninguna llamada a formación en línea, en ningún lugar de la pantalla — sea
   verificable, y para que el bloque de alcance sea literalmente el mismo texto
   en las tres pantallas. */

export const RESULTADO_A = {
  titulo: "Tu caso tiene una ruta definida",
  decidir: (estado: string) => [
    `Lo que importa definir bien es el estado, y el criterio es dónde va a ocurrir la operación, no qué estado tiene mejor reputación. Por lo que describes, ese criterio apunta a ${estado}.`,
    "Lo segundo es el orden: cuenta bancaria, EIN y obligaciones anuales de cumplimiento. Constituir es el primer paso de varios, y los siguientes tienen fechas.",
  ],
  /* Solo si P6 = ninguno. Se inserta antes de "Qué sigue". */
  infraestructura:
    "Como no cuentas con SSN ni ITIN, el servicio incluye el agente registrado y la dirección comercial para el registro — que es justamente la infraestructura que se necesita para poder constituir y cumplir.",
  sigueIntro: "Tienes dos caminos y ninguno es mejor que el otro:",
  caminoFormacion: (estado: string) => `Iniciar la formación en línea en ${estado}, si ya tienes claridad y prefieres avanzar por tu cuenta.`,
  caminoLlamada: "Agendar la llamada de diagnóstico, si quieres validar el detalle antes de constituir.",
  llamadaTitulo: "La llamada",
  llamada:
    "Es una conversación para revisar lo que un formulario no alcanza a ver: cómo vas a cobrar, tu situación personal, si hay socios en otro país. Sirve también para confirmar que este es el momento correcto. No hay nada que comprar en la llamada.",
};

export const RESULTADO_B = {
  titulo: "Tu caso conviene revisarlo antes de constituir",
  razonesTitulo: "Por qué recomendamos revisión",
  sigue:
    "Agendar la llamada de diagnóstico. Es donde se resuelve lo anterior. Si al final resulta que tu caso es más simple de lo que parece, te lo decimos y puedes formar en línea sin más.",
};

export const RESULTADO_C = {
  titulo: "Por ahora, abrir una empresa no es el siguiente paso",
  porQueTitulo: "Por qué te lo decimos",
  porQue:
    "Con lo que nos compartes, constituir una entidad todavía no resolvería nada — y sí empezaría a generar obligaciones anuales desde el primer día: reportes estatales, declaraciones informativas, un agente registrado. Todo eso corre aunque la empresa no facture.",
  primeroTitulo: "Lo que conviene resolver primero",
  primero: [
    "Dónde va a ocurrir la actividad y quiénes van a ser los clientes.",
    "Cómo va a generar ingresos y con qué recursos arranca.",
    "Si necesitas una entidad o si por ahora puedes operar de otra forma.",
  ],
  cierre: "Cuando eso esté claro, la estructura se decide rápido. Es la parte fácil.",
  sigue: [
    "Revisar los recursos de la sección educativa, sin costo ni registro.",
    "Si quieres conversarlo de todos modos, la llamada existe para eso. No hay nada que comprar en esta etapa.",
  ],
};

/** Bloque de alcance — idéntico y sin variación en las tres pantallas. */
export const ALCANCE = {
  titulo: "Hasta dónde llegamos",
  hacemos:
    "constituir la entidad en Texas o Florida, agente registrado, dirección comercial para el registro, obtención de EIN, orientación para la apertura de cuenta bancaria, y el calendario de obligaciones anuales que te corresponden.",
  nota: "La dirección sirve para el registro y las notificaciones oficiales. No determina dónde pagas impuestos.",
  noHacemos:
    "no presentamos declaraciones de impuestos, no emitimos opiniones ni dictámenes fiscales, no te representamos ante el IRS y no llevamos procesos migratorios. Cuando tu caso requiere alguno de estos, te decimos qué perfil profesional necesitas y en qué momento del año conviene buscarlo.",
};

/** Bloque de derivación — solo resultado B, con consentimiento explícito. */
export const DERIVACION = {
  titulo: "Si tu caso está fuera de lo que cubrimos",
  cuerpo:
    "No todos los casos caen dentro de nuestro alcance, y preferimos decirlo antes que después. Cuando eso pasa, no te dejamos sin siguiente paso: trabajamos con un abogado de migración que atiende casos en todos los estados y podemos compartirle tu caso.",
  /* Casilla desmarcada por defecto. El abogado no se describe como parte del
     equipo y no se promete ningún resultado: solo el contacto. */
  consentimiento: "Autorizo que compartan mi información con el abogado de migración",
};

/* ─── Ficha para el CRM ───
   Registro del lead: el conjunto de respuestas más el resultado calculado,
   incluido el estado capturado en texto libre. Sirve para calificar y para
   detectar patrones (por ejemplo, cuántos llegan pidiendo Wyoming). */
export const RESULTADO_ETIQUETA: Record<Resultado, string> = {
  A: "A — Ruta clara",
  B: "B — Requiere revisión",
  C: "C — No conviene aún",
};

function etiquetaOpcion(p: Pregunta, valor: string): string {
  return p.options.find((o) => o.value === valor)?.label ?? valor;
}

export function camposDiagnostico(
  r: Respuestas,
  d: Diagnostico,
  extra?: { autorizaDerivacion?: boolean },
): { label: string; value: string }[] {
  const campos: { label: string; value: string }[] = [];

  for (const p of PREGUNTAS) {
    if (!p.aplica(r)) continue;
    if (p.tipo === "multiple") {
      const sel = (r.decision ?? []) as string[];
      if (sel.length) campos.push({ label: p.label, value: sel.map((v) => etiquetaOpcion(p, v)).join(", ") });
      continue;
    }
    const valor = r[p.id] as string | undefined;
    if (valor) campos.push({ label: p.label, value: etiquetaOpcion(p, valor) });
  }

  if (r.lugar === "otro-estado" && r.estadoLibre?.trim()) {
    campos.push({ label: "Estado mencionado", value: r.estadoLibre.trim() });
  }
  campos.push({ label: "Resultado del diagnóstico", value: RESULTADO_ETIQUETA[d.resultado] });
  if (d.disparadores.length) {
    campos.push({ label: "Disparadores de revisión", value: d.disparadores.join(" · ") });
  }
  campos.push({ label: "Cómo entendemos su situación", value: d.parrafo });
  if (d.mostrarDerivacion) {
    campos.push({
      label: "Autoriza compartir con el abogado de migración",
      value: extra?.autorizaDerivacion ? "Sí" : "No",
    });
  }
  return campos.filter((c) => c.value.trim());
}
