/*
 * Motor del diagnóstico integral de estructura — compartido por
 * /estructura-empresarial-en-estados-unidos y /estructura-de-inversion-en-usa.
 *
 * Reemplaza los dos CTA paralelos del hero y la tarjeta de 3 opciones que estaba
 * duplicada en ambas páginas, por un único punto de entrada de dos puertas:
 *   - "directo": el usuario ya sabe que quiere su LLC. Solo se le pregunta el estado.
 *     Se mantiene austero a propósito: ninguna pregunta de calificación extra.
 *   - "diagnostico": objetivo → claridad → diagnóstico por rama → calificación económica.
 *
 * El contenido educativo NO se redacta de nuevo ni se envía como PDF: se reubica el
 * que ya existe en ambas páginas como apoyo contextual dentro de cada paso.
 */

export type Objetivo = "operar" | "invertir" | "visa" | "explorando";
export type Urgencia = "listo" | "1-2-meses" | "investigando";
export type Descalificacion = "estado" | "capital";

/* ─── Puerta 1: compra directa ───
   Solo estado. "Otro estado" descalifica del checkout (alcance real del servicio). */
export const ESTADOS_CUBIERTOS = ["Texas", "Florida"] as const;

/* Descripciones de estado, reubicadas desde la sección "Texas o Florida" de la
   página de LLC. Se muestran junto a cada opción, donde se toma la decisión. */
export const ESTADO_INFO: Record<string, { desc: string; puntos: string[] }> = {
  Texas: {
    desc: "Puede tener sentido cuando la operación, presencia comercial, clientes, personal o administración estarán principalmente en Texas.",
    puntos: ["Sin impuesto estatal sobre la renta", "Ecosistema empresarial sólido", "Comunidad latina activa", "Ideal para operaciones comerciales"],
  },
  Florida: {
    desc: "Puede tener sentido cuando la actividad, propiedades, mercado o presencia principal se encontrarán en Florida.",
    puntos: ["Sin impuesto estatal sobre la renta", "Fuerte conexión con Latinoamérica", "Mercado inmobiliario activo", "Ideal para negocios digitales y bienes raíces"],
  },
};

/* Encabezado de la pregunta de estado — reubicado desde la misma sección. */
export const ESTADO_HEADER =
  "No elegimos el estado por popularidad. Lo elegimos con base en dónde y cómo funcionará la empresa.";

/* "Antes de contratar": señales de que conviene revisar la estructura. Se usa como
   autochequeo en la rama Operar, antes de dejar pasar a checkout. Une el bloque
   "Antes de contratar" con la FAQ "¿cuándo necesito una estructura más avanzada?". */
export const SENALES_OTRA_ESTRUCTURA = [
  "Participarán varios socios.",
  "Recibirás dinero de inversionistas.",
  "Comprarás diferentes propiedades o negocios.",
  "Ya tienes una empresa en otro país.",
  "Buscas una visa relacionada con la operación.",
  "Necesitas separar diferentes activos o riesgos.",
];

export const SENALES_NOTA =
  "Cuando participan varios socios, cuando se recibirá inversión de terceros, cuando hay múltiples propiedades o activos, cuando existe una empresa en otro país relacionada, o cuando se evalúa una visa vinculada a la operación, conviene una revisión de estructura antes de constituir.";

/* "Qué incluye / qué no incluye" + FAQ de EIN y cuenta bancaria — se muestran en el
   paso de confirmación, justo antes del pago. */
export const INCLUYE = [
  "Constitución de LLC en Texas o Florida",
  "Registered Agent durante el primer año",
  "Obtención del EIN",
  "Organización de documentación",
  "Orientación de cierre sobre los pasos que siguen",
];

export const NO_INCLUYE = [
  "Apertura bancaria garantizada",
  "Aprobación de crédito",
  "Reducción automática de impuestos",
  "Elegibilidad o aprobación de visa",
  "Asesoría legal o fiscal especializada",
  "Contratos personalizados",
  "Contabilidad o declaraciones recurrentes",
  "Estructuras internacionales complejas",
];

export const CONFIRMACION_FAQ = [
  {
    q: "¿Qué es el EIN?",
    a: "Es el Employer Identification Number: el número de identificación fiscal federal de la empresa. Es necesario para abrir cuentas bancarias, contratar y cumplir obligaciones fiscales ante el IRS.",
  },
  {
    q: "¿La cuenta bancaria está incluida?",
    a: "No. Te entregamos orientación inicial y la documentación necesaria para el proceso bancario, pero la apertura de cuenta es un proceso independiente que depende del banco.",
  },
];

/* FAQ "¿la LLC me da visa?" — aclaración obligatoria en la rama Visa. */
export const VISA_ACLARACION =
  "Una LLC puede formar parte de una operación utilizada dentro de una estrategia migratoria, como la visa E-2. Sin embargo, constituir la empresa por sí sola no crea elegibilidad ni garantiza ninguna visa. Si tu objetivo incluye residencia o visa, conviene revisar la estructura antes de constituir.";

/* FAQ "¿puedo incluir socios?" — junto a la pregunta de socios. */
export const SOCIOS_ACLARACION =
  "Si la LLC tendrá más de un miembro, es importante que el Operating Agreement refleje claramente los derechos, responsabilidades y porcentajes de participación de cada socio. Cuando hay socios, conviene revisar la estructura con más detalle antes de constituir.";

/* Bloque de elegibilidad de la guía de inversión — filtro de entrada de la rama Invertir. */
export const INVERSION_MINIMO = "Disponible para miembros con capacidad de inversión desde $100,000 USD.";

export const INVERSION_ERRORES = [
  "Elegir estructura legal sin entender implicaciones fiscales y de riesgo.",
  "Registrar en un estado ‘popular’ que no necesariamente conviene a tu operación.",
  "Operar sin acuerdos internos claros, cuenta bancaria y cumplimiento básico.",
];

/* "Preguntas que esta revisión ayuda a responder" — se muestran como apoyo en la rama Invertir. */
export const INVERSION_PREGUNTAS_CLAVE = [
  "¿Qué quiero hacer? Operar, invertir, expandir, migrar o una combinación de estas.",
  "¿Qué activos, socios u operaciones estarán involucrados?",
  "¿Qué riesgos necesito separar de mi patrimonio personal?",
  "¿Una sola entidad es suficiente o necesito varias?",
  "¿Cuál es el siguiente paso lógico según mi perfil y capital disponible?",
];

/* Resumen ejecutivo para la rama Explorando — se distribuye en sus pasos. */
export const EXPLORANDO_RESUMEN = [
  "Una LLC es una herramienta. Para algunas personas una LLC sencilla es exactamente lo que necesitan; para otras, abrirla sin revisar su operación, sus socios o sus inversiones puede crear problemas posteriores.",
  "La estructura correcta no es la más compleja: es la que corresponde a lo que realmente vas a hacer.",
  "Operar y facturar es una ruta. Estructurar capital para invertir es otra. Conviene saber en cuál estás antes de constituir.",
];

/* ─── Objetivo (paso 1) ───
   Contexto breve por opción: por qué importa la distinción. */
export const OBJETIVO_OPCIONES: { value: Objetivo; label: string; contexto: string }[] = [
  {
    value: "operar",
    label: "Operar",
    contexto: "Prestar servicios, facturar, vender productos o iniciar una operación en Estados Unidos. Aquí la LLC suele ser la herramienta correcta y el proceso es directo.",
  },
  {
    value: "invertir",
    label: "Invertir",
    contexto: "Estructurar capital para adquirir activos o participar en proyectos. Antes de constituir conviene definir el vehículo de inversión, no solo la entidad.",
  },
  {
    value: "visa",
    label: "Visa",
    contexto: "Una empresa vinculada a una estrategia migratoria, como la E-2. La estructura y el capital deben ser coherentes con ese proceso desde el inicio.",
  },
  {
    value: "explorando",
    label: "Todavía estoy explorando",
    contexto: "No necesitas claridad para empezar. Vamos paso a paso y te mostramos lo que conviene saber antes de decidir.",
  },
];

/* ─── Calificación económica (paso final, común a todas las ramas) ─── */
export const URGENCIA_OPCIONES: { value: Urgencia; label: string; desc: string }[] = [
  { value: "listo", label: "Sí, en las próximas 2 o 3 semanas", desc: "Continuamos al cierre y los siguientes pasos." },
  { value: "1-2-meses", label: "En 1 o 2 meses", desc: "Te damos seguimiento cuando se acerque tu fecha." },
  { value: "investigando", label: "Todavía estoy investigando", desc: "Guardamos tu avance para que puedas continuar después." },
];

/* ─── Preguntas por rama (paso 2 claridad + paso 3 diagnóstico) ─── */
export type Pregunta = {
  id: string;
  /** Etiqueta con la que el campo llega al CRM y a la ficha del setter. */
  label: string;
  q: string;
  /** Encabezado o aclaración embebida, mostrada sobre las opciones. */
  help?: string;
  options: { value: string; label: string; desc?: string }[];
};

const P_ESTADO: Pregunta = {
  id: "estado",
  label: "Estado elegido",
  q: "¿En qué estado vas a operar o tienes tu residencia principal?",
  help: ESTADO_HEADER,
  options: [
    { value: "Texas", label: "Texas", desc: ESTADO_INFO.Texas.desc },
    { value: "Florida", label: "Florida", desc: ESTADO_INFO.Florida.desc },
    { value: "otro", label: "Otro estado", desc: "Nuestro servicio en línea abre en Texas y Florida." },
    { value: "no-seguro", label: "Todavía no lo sé", desc: "Lo revisamos contigo antes de constituir." },
  ],
};

const P_ACTIVIDAD: Pregunta = {
  id: "actividad",
  label: "Actividad definida",
  q: "¿Ya tienes definida la actividad de la empresa?",
  options: [
    { value: "si", label: "Sí, sé a qué se va a dedicar" },
    { value: "no", label: "Todavía no lo tengo definido" },
  ],
};

const P_SOCIOS: Pregunta = {
  id: "socios",
  label: "Tiene socios",
  q: "¿La empresa tendrá socios además de ti?",
  help: SOCIOS_ACLARACION,
  options: [
    { value: "no", label: "No, solo yo" },
    { value: "si", label: "Sí, tendrá socios" },
  ],
};

const P_SOCIOS_EXTRANJEROS: Pregunta = {
  id: "sociosExtranjeros",
  label: "Socios extranjeros",
  q: "¿Alguno de los socios es extranjero o reside fuera de Estados Unidos?",
  options: [
    { value: "si", label: "Sí" },
    { value: "no", label: "No, todos residen en Estados Unidos" },
  ],
};

const P_CAPITAL: Pregunta = {
  id: "capital",
  label: "Rango de inversión",
  q: "¿Tu capacidad de inversión es mayor a $100,000 USD?",
  help: INVERSION_MINIMO,
  options: [
    { value: "mas", label: "Sí, $100,000 USD o más" },
    { value: "menos", label: "Todavía no, es menor a $100,000 USD" },
  ],
};

const P_CAPITAL_VISA: Pregunta = {
  id: "capital",
  label: "Rango de inversión",
  q: "¿Ya tienes capital disponible para estructurar la inversión?",
  help: VISA_ACLARACION,
  options: [
    { value: "mas", label: "Sí, $100,000 USD o más" },
    { value: "menos", label: "Sí, pero menor a $100,000 USD" },
    { value: "no", label: "Todavía no tengo el capital disponible" },
  ],
};

const P_TIPO_VISA: Pregunta = {
  id: "tipoVisa",
  label: "Tipo de visa objetivo",
  q: "¿Qué tipo de visa estás evaluando?",
  options: [
    { value: "E-2", label: "E-2 (inversionista por tratado)" },
    { value: "L-1", label: "L-1 (traslado dentro de mi empresa)" },
    { value: "no-seguro", label: "No estoy seguro todavía" },
  ],
};

/* Rama Explorando: en vez de una pregunta de claridad, una pregunta de ruta.
   Según lo que revele, continúa por el diagnóstico de Operar o de Invertir. */
const P_RUTA_EXPLORANDO: Pregunta = {
  id: "rutaExplorando",
  label: "Ruta revelada al explorar",
  q: "¿Qué se parece más a lo que quieres lograr primero?",
  options: [
    { value: "operar", label: "Tener una empresa para trabajar, facturar o vender" },
    { value: "invertir", label: "Poner capital a trabajar en un activo o proyecto" },
    { value: "no-seguro", label: "Sigo sin tenerlo claro" },
  ],
};

/* Pasos por rama. El paso de urgencia se agrega al final en el componente. */
export function pasosDeRama(objetivo: Objetivo, rutaExplorando?: string): Pregunta[] {
  switch (objetivo) {
    case "operar":
      return [P_ESTADO, P_ACTIVIDAD, P_SOCIOS, P_SOCIOS_EXTRANJEROS];
    case "invertir":
      return [P_CAPITAL];
    case "visa":
      return [P_CAPITAL_VISA, P_TIPO_VISA];
    case "explorando":
      // Primero revela la ruta; luego hereda el diagnóstico de esa rama.
      if (rutaExplorando === "operar") return [P_RUTA_EXPLORANDO, P_ESTADO, P_ACTIVIDAD, P_SOCIOS, P_SOCIOS_EXTRANJEROS];
      if (rutaExplorando === "invertir") return [P_RUTA_EXPLORANDO, P_CAPITAL];
      return [P_RUTA_EXPLORANDO];
  }
}

/* Preguntas que solo aplican según respuestas previas. */
export function preguntaAplica(p: Pregunta, respuestas: Record<string, string>): boolean {
  // Solo preguntamos por socios extranjeros si declaró tener socios.
  if (p.id === "sociosExtranjeros") return respuestas.socios === "si";
  return true;
}

/* ─── Descalificación ───
   Estado no cubierto (rama Operar) y capital insuficiente (rama Invertir). */
export function evaluarDescalificacion(
  objetivo: Objetivo,
  respuestas: Record<string, string>,
): Descalificacion | null {
  const rutaEfectiva = objetivo === "explorando" ? respuestas.rutaExplorando : objetivo;
  if (rutaEfectiva === "operar" && respuestas.estado === "otro") return "estado";
  if (rutaEfectiva === "invertir" && respuestas.capital === "menos") return "capital";
  return null;
}

/* ─── Ficha para el setter ───
   Mismos campos al CRM y al mensaje de WhatsApp, para que no se repregunte en la llamada. */
export type FichaContacto = { name: string; email: string; phone: string; country: string };

export function fichaCampos(args: {
  contacto: FichaContacto;
  objetivo: Objetivo | null;
  respuestas: Record<string, string>;
  urgencia: Urgencia | null;
  estadoSolicitado?: string;
  pasosCompletados: number;
  descalificacion: Descalificacion | null;
}): { label: string; value: string }[] {
  const { contacto, objetivo, respuestas, urgencia, estadoSolicitado, pasosCompletados, descalificacion } = args;

  const objetivoLabel = objetivo ? OBJETIVO_OPCIONES.find((o) => o.value === objetivo)?.label ?? objetivo : "";
  const urgenciaLabel = urgencia ? URGENCIA_OPCIONES.find((u) => u.value === urgencia)?.label ?? urgencia : "";

  // El estado se reporta como el elegido, o como "no cubierto" con el que pidió.
  const estadoValue =
    respuestas.estado === "otro"
      ? `No cubierto${estadoSolicitado?.trim() ? ` — solicitó ${estadoSolicitado.trim()}` : ""}`
      : respuestas.estado === "no-seguro"
      ? "Todavía no lo sabe"
      : respuestas.estado ?? "";

  const campos: { label: string; value: string }[] = [
    { label: "Nombre", value: contacto.name },
    { label: "Correo", value: contacto.email },
    { label: "WhatsApp", value: contacto.phone },
    { label: "País", value: contacto.country },
    { label: "Objetivo", value: objetivoLabel },
  ];

  if (objetivo === "explorando" && respuestas.rutaExplorando) {
    const r = P_RUTA_EXPLORANDO.options.find((o) => o.value === respuestas.rutaExplorando);
    campos.push({ label: "Ruta revelada al explorar", value: r?.label ?? respuestas.rutaExplorando });
  }
  if (estadoValue) campos.push({ label: "Estado elegido", value: estadoValue });
  if (respuestas.actividad) campos.push({ label: "Actividad definida", value: respuestas.actividad === "si" ? "Sí" : "No" });
  if (respuestas.socios) campos.push({ label: "Tiene socios", value: respuestas.socios === "si" ? "Sí" : "No" });
  if (respuestas.sociosExtranjeros) campos.push({ label: "Socios extranjeros", value: respuestas.sociosExtranjeros === "si" ? "Sí" : "No" });
  if (respuestas.capital) {
    const fuente = objetivo === "visa" ? P_CAPITAL_VISA : P_CAPITAL;
    const c = fuente.options.find((o) => o.value === respuestas.capital);
    campos.push({ label: "Rango de inversión", value: c?.label ?? respuestas.capital });
  }
  if (respuestas.tipoVisa) {
    const v = P_TIPO_VISA.options.find((o) => o.value === respuestas.tipoVisa);
    campos.push({ label: "Tipo de visa objetivo", value: v?.label ?? respuestas.tipoVisa });
  }
  if (urgenciaLabel) campos.push({ label: "Urgencia", value: urgenciaLabel });
  if (descalificacion) {
    campos.push({
      label: "Descalificación",
      value: descalificacion === "estado" ? "Estado no cubierto" : "Capital menor al mínimo",
    });
  }
  campos.push({ label: "Pasos completados del diagnóstico", value: String(pasosCompletados) });

  return campos.filter((c) => c.value.trim());
}

/* Origen del lead: UTM + referrer, para la ficha del setter. */
export function origenCampos(): { label: string; value: string }[] {
  if (typeof window === "undefined") return [];
  const p = new URLSearchParams(window.location.search);
  const campos = [
    { label: "utm_source", value: p.get("utm_source") ?? "" },
    { label: "utm_medium", value: p.get("utm_medium") ?? "" },
    { label: "utm_campaign", value: p.get("utm_campaign") ?? "" },
    { label: "utm_content", value: p.get("utm_content") ?? "" },
    { label: "Referrer", value: typeof document !== "undefined" ? document.referrer : "" },
  ];
  return campos.filter((c) => c.value.trim());
}

/* Mensaje precargado de WhatsApp — mismo contenido que las notas del CRM. */
export function buildFichaTexto(
  campos: { label: string; value: string }[],
  saludo: string,
  contexto?: string,
): string {
  return [
    saludo,
    ...(contexto ? ["", contexto] : []),
    ...(campos.length ? ["", ...campos.map((c) => `${c.label}: ${c.value}`)] : []),
  ].join("\n");
}
