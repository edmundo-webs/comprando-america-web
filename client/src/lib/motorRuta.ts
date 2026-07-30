/*
 * Motor de Recomendación de Ruta
 * (antes, internamente: "calificación de leads" / "lead qualification").
 *
 * El sistema NO aprueba ni rechaza personas: clasifica necesidades y recomienda
 * una de cuatro rutas. Ninguna de las cuatro es un rechazo — cada una es la ruta
 * correcta para la etapa en la que está la persona hoy. Por eso aquí no existe
 * ningún concepto de "descalificación": el capital, el estado o la falta de
 * proyecto son señales que cambian la ruta, nunca criterios de exclusión.
 *
 * Dos ejes distintos, que no deben confundirse:
 *   - `routeLevel` (1-4): qué ruta se recomienda.
 *   - `visibilityTier` (A/B/C): quién ve qué.
 *       A — visible para todos, antes de pedir contacto.
 *       B — después de capturar contacto.
 *       C — interno (CRM). Nunca se renderiza al usuario.
 *
 * Reglas de salida obligatorias:
 *   - Nunca un porcentaje de viabilidad.
 *   - Nunca la receta completa (estado exacto + administración + tributación + secuencia).
 *   - Nunca las etiquetas internas (niveles como "Nivel 3" sí; banderas F1-F15 no).
 *   - Nunca lenguaje de calificar / aprobar / rechazar.
 */
import {
  type Objetivo, type Urgencia,
  ESTADO_HEADER, ESTADO_INFO, ESTADO_SIN_IMPUESTO, INVERSION_ERRORES, NO_INCLUYE,
  SENALES_NOTA, SOCIOS_ACLARACION, VISA_ACLARACION, EXPLORANDO_RESUMEN,
} from "./diagnostico";

export type RouteLevel = 1 | 2 | 3 | 4;
export type VisibilityTier = "A" | "B" | "C";
/** Variante de copy dentro del Nivel 3. Misma ruta, mismo nivel: nunca un rechazo aparte. */
export type VarianteNivel3 = "A" | "B" | "grupo" | "definicion";
/** Qué hace el CTA cuando el usuario lo ejecuta (en la Capa B). */
export type CtaAction = "checkout" | "estado" | "whatsapp" | "grupo";
export type Retroalimentacion = "si" | "parcial" | "no";

export type Cta = { label: string; action: CtaAction; contexto?: string };

/** Rama efectiva del diagnóstico, ya resuelta la reasignación de "Explorando". */
export type Rama = "operar" | "invertir" | "visa" | "explorando";

export const NIVEL_MENSAJE: Record<RouteLevel, string> = {
  1: "Puedes avanzar con la constitución de tu LLC.",
  2: "La LLC parece adecuada, pero primero conviene validar algunos elementos.",
  3: "Antes de abrir una empresa conviene definir la estrategia.",
  4: "Tu caso requiere una estrategia más amplia.",
};

const RUTA_GENERAL: Record<RouteLevel, string[]> = {
  1: [
    "Constitución de la LLC en el estado que corresponde a tu operación.",
    "Obtención del EIN y organización de la documentación base.",
    "Orientación de cierre sobre los pasos que siguen.",
  ],
  2: [
    "Revisión de los elementos que todavía conviene definir.",
    "Definición de la estructura que corresponde a tu caso.",
    "Constitución y documentación, una vez validada la estructura.",
  ],
  3: [
    "Definición del objetivo y del vehículo que dará sentido a la estructura.",
    "Revisión de las opciones que corresponden a tu situación.",
    "Constitución de la estructura legal, solo cuando ya tenga una función clara.",
  ],
  4: [
    "Evaluación estratégica del caso completo.",
    "Diseño de la estructura y de su secuencia.",
    "Ejecución acompañada, por etapas.",
  ],
};

/* ─── Párrafos de nivel ───
   Explican la ruta. Ninguno describe la receta técnica ni juzga a la persona. */
const PARRAFO: Record<RouteLevel, string> = {
  1: "Por lo que nos compartiste, tu caso corresponde a una constitución directa: la operación está definida y no aparecen elementos que convenga resolver antes. La decisión del estado y de la administración se confirma con la información que ya nos diste.",
  2: "La LLC parece la herramienta correcta para lo que quieres lograr. Antes de constituir conviene validar algunos elementos de tu caso, porque corregirlos después suele costar más que definirlos ahora.",
  3: "", // el Nivel 3 siempre usa una de sus variantes
  4: "Tu caso involucra más de una decisión estructural a la vez. No es una LLC más grande: es una arquitectura que conviene diseñar completa antes de constituir la primera entidad, para que cada pieza tenga una función clara.",
};

const PARRAFO_N3: Record<VarianteNivel3, string> = {
  A: "Tu objetivo todavía puede construirse. Hoy tu presupuesto probablemente no corresponde al tipo de oportunidades que analizamos dentro del Grupo Empresarial. Eso no significa que debas detenerte. La prioridad es ayudarte a construir una estrategia para llegar al tipo de inversión que buscas.",
  B: "Ya cuentas con el capital para analizar oportunidades. Lo que todavía no conviene hacer es abrir una empresa sin haber definido primero qué papel jugará dentro de tu estrategia patrimonial. Antes de decidir una estructura, conviene responder preguntas como: ¿qué tipo de activos quieres construir?, ¿qué nivel de participación buscas?, ¿qué horizonte tienes?, ¿qué riesgo estás dispuesto a asumir?",
  grupo: "Tu objetivo es claro. Lo que todavía falta definir es el proyecto que dará sentido a la estructura. Dentro del Grupo Empresarial existen oportunidades ya estructuradas — incluidas algunas con opción de aplicar a visa — y ese es el lugar correcto para revisar si alguna se ajusta a tu caso antes de constituir cualquier entidad.",
  definicion: "Tu objetivo es claro: quieres construir patrimonio en Estados Unidos. Lo que todavía falta definir es el vehículo que dará sentido a esa estructura. Constituir una LLC antes de definir la inversión o la actividad probablemente agregaría costos y responsabilidades sin acercarte a tu objetivo. Nuestra recomendación es comenzar por construir la estrategia.",
};

const CTA_NIVEL: Record<RouteLevel, Cta> = {
  1: { label: "Constituir LLC", action: "checkout" },
  2: { label: "Agendar orientación", action: "whatsapp", contexto: "Quiero orientación para validar mi estructura antes de constituir." },
  3: { label: "Preparar mi ruta", action: "whatsapp", contexto: "Quiero preparar mi ruta antes de constituir una empresa." },
  4: { label: "Agendar evaluación estratégica", action: "whatsapp", contexto: "Mi caso requiere una estrategia más amplia y quiero una evaluación estratégica." },
};

const CTA_N3: Record<VarianteNivel3, Cta> = {
  A: { label: "Preparar mi ruta", action: "whatsapp", contexto: "Quiero preparar mi ruta para llegar al tipo de inversión que busco." },
  B: { label: "Construir mi estrategia patrimonial", action: "whatsapp", contexto: "Ya tengo capital disponible y quiero definir mi estrategia patrimonial antes de constituir." },
  grupo: { label: "Conocer el Grupo Empresarial", action: "grupo" },
  definicion: { label: "Preparar mi ruta", action: "whatsapp", contexto: "Quiero definir mi proyecto antes de constituir la empresa." },
};

/* ─── Banderas internas (Capa C) ───
   Nunca se muestran al usuario, ni por su clave ni por su etiqueta. */
export const BANDERAS: Record<string, string> = {
  F1: "Actividad de la empresa sin definir",
  F2: "Estado fuera del alcance estándar (Texas / Florida)",
  F3: "Estado de la operación sin determinar",
  F4: "Socios en la estructura, sin acuerdo documentado confirmado",
  F5: "Socios extranjeros o no residentes",
  F6: "Inversionistas externos u operador de por medio",
  F7: "Empresa en otro país relacionada con la operación",
  F8: "Objetivo migratorio vinculado a la estructura",
  F9: "Capital por debajo del rango de oportunidades del Grupo Empresarial",
  F10: "Sin capital disponible todavía",
  F11: "Tipo de visa sin definir",
  F12: "Estrategia migratoria sin proyecto que la sostenga",
  F13: "Sin inversión u oportunidad identificada",
  F14: "Participación pasiva o sin definir",
  F15: "Expectativa incorrecta sobre lo que resuelve una LLC",
};

/** Preguntas sugeridas para la llamada, según la bandera activada. */
const GUION_POR_BANDERA: Record<string, string> = {
  F1: "¿Qué actividad concreta va a realizar la empresa y para qué cliente?",
  F2: "¿Por qué ese estado? ¿Dónde estarán realmente los clientes, el personal y la administración?",
  F3: "¿Dónde va a existir la operación real: clientes, personal, domicilio, propiedades?",
  F4: "¿Ya definieron porcentajes, aportaciones y responsabilidades entre los socios?",
  F5: "¿Qué socios residen fuera de Estados Unidos y qué papel tendrán en la operación?",
  F6: "¿Quién pone el capital, quién opera y cómo se reparten decisiones y utilidades?",
  F7: "¿Qué relación tendrá la empresa nueva con la que ya existe en el otro país?",
  F8: "¿Qué proceso migratorio se está evaluando y con qué abogado se está trabajando?",
  F9: "¿En qué plazo espera llegar al monto de inversión que busca y con qué fuente?",
  F10: "¿De dónde vendría el capital y en qué plazo estaría disponible?",
  F11: "¿Con qué abogado migratorio se está evaluando el tipo de visa?",
  F12: "¿Qué proyecto concreto sostendría la operación y el empleo requerido?",
  F13: "¿Qué tipo de activo le interesa y qué ha descartado hasta ahora?",
  F14: "¿Busca administrar o solo participar del rendimiento? ¿Qué horizonte tiene?",
  F15: "¿Qué espera obtener de la LLC que en realidad depende de un tercero (banco, buró, consulado)?",
};

export type Recomendacion = {
  /** Eje 1: qué ruta se recomienda. */
  routeLevel: RouteLevel;
  varianteNivel3: VarianteNivel3 | null;
  rama: Rama;
  /** Si "Explorando" se reasignó a otra rama, cuál. */
  ramaReasignada: Rama | null;

  /* ── Capa A — visible para todos ── */
  objetivoTexto: string;
  perfil: string;
  mensajeNivel: string;
  parrafo: string;
  hallazgo: string;
  rutaGeneral: string[];
  cta: Cta;
  ctaSecundario: Cta | null;

  /* ── Capa B — después de capturar contacto ── */
  factores: string[];
  temasPendientes: string[];
  recursos: { q: string; a: string }[];
  motivo: string;

  /* ── Capa C — interno, nunca en pantalla ── */
  banderas: { id: string; label: string }[];
  capacidadEconomica: string;
  prioridadComercial: "alta" | "media" | "baja";
  potencialMembresia: "alto" | "medio" | "bajo";
  guionLlamada: string[];
  recomendacionTecnica: string;
  compraDirectaPosible: boolean;
};

type Entrada = {
  objetivo: Objetivo | null;
  respuestas: Record<string, string>;
  urgencia?: Urgencia | null;
};

/* ─── Reasignación de la rama "Explorando" ───
   Solo cuando el motivo declarado revela una intención clara (Caso A del
   microdiagnóstico). Si no la revela, no se insiste: se resuelve con E2/E3. */
export function ramaDesdeExploracion(respuestas: Record<string, string>): Rama | null {
  switch (respuestas.exploraMotivo) {
    case "negocio": return "operar";
    case "visa": return "visa";
    case "invertir": return "invertir";
    default: return null;
  }
}

/** Rama efectiva: la declarada, o la revelada dentro de "Explorando". */
export function ramaEfectiva(objetivo: Objetivo | null, respuestas: Record<string, string>): Rama {
  if (objetivo !== "explorando") return (objetivo ?? "explorando") as Rama;
  if (respuestas.rutaExplorando === "operar") return "operar";
  if (respuestas.rutaExplorando === "invertir") return "invertir";
  return ramaDesdeExploracion(respuestas) ?? "explorando";
}

const ESTADO_CUBIERTO = (v?: string) => v === "Texas" || v === "Florida";

/* Expectativas que la LLC no resuelve por sí sola — activan recurso correctivo. */
const EXPECTATIVA_INCORRECTA = ["credito", "banco", "visa"];

export function recomendarRuta({ objetivo, respuestas: r, urgencia }: Entrada): Recomendacion {
  const rama = ramaEfectiva(objetivo, r);
  const reasignada = objetivo === "explorando" && r.rutaExplorando === "no-seguro" ? ramaDesdeExploracion(r) : null;

  const banderas: string[] = [];
  const marcar = (id: string) => { if (!banderas.includes(id)) banderas.push(id); };

  let nivel: RouteLevel = 2;
  let variante: VarianteNivel3 | null = null;
  let hallazgo = "";

  /* ── Señales transversales ── */
  if (r.estado === "otro") marcar("F2");
  if (r.estado === "no-seguro") marcar("F3");
  if (r.actividad === "no") marcar("F1");
  if (r.socios === "si") marcar("F4");
  if (r.sociosExtranjeros === "si") marcar("F5");
  if (r.capital === "menos") marcar("F9");
  if (r.capital === "no") marcar("F10");
  if (rama === "visa" || r.exploraDuda === "visa" || r.exploraExpectativa === "visa") marcar("F8");
  if (EXPECTATIVA_INCORRECTA.includes(r.exploraExpectativa ?? "") || r.exploraMotivo === "cuenta-dolares" || r.exploraMotivo === "historial") marcar("F15");

  /* ═══ Rama Operar ═══
     La actividad sin definir domina: sin saber qué hará la empresa, validar
     estado o socios es prematuro. */
  if (rama === "operar") {
    if (r.actividad === "no") {
      nivel = 3;
      variante = "definicion";
      hallazgo = "Todavía no está definida la actividad de la empresa. Antes de constituir conviene definir qué va a hacer: abrir antes suele generar correcciones posteriores.";
    } else if (r.estado === "otro") {
      nivel = 2;
      hallazgo = "El estado que consideras está fuera de nuestro alcance estándar (Texas y Florida). Conviene revisar si aplica igual o si conviene otra ruta.";
    } else if (r.socios === "si" || r.sociosExtranjeros === "si") {
      nivel = 2;
      hallazgo = r.sociosExtranjeros === "si"
        ? "Al tener socios que residen fuera de Estados Unidos, conviene definir porcentajes, responsabilidades y su papel en la operación antes de constituir."
        : "Al tener socios, conviene definir porcentajes y responsabilidades antes de constituir.";
    } else if (r.estado === "no-seguro") {
      nivel = 2;
      hallazgo = "Aún no se ha determinado en qué estado existirá la operación real. Esa decisión conviene tomarla antes de constituir, no después.";
    } else {
      nivel = 1;
      hallazgo = "No detectamos elementos que convenga resolver antes de constituir.";
    }
  }

  /* ═══ Rama Visa ═══
     Regla dura: nunca Nivel 1. Constituir la LLC no crea elegibilidad migratoria. */
  if (rama === "visa") {
    if (r.tipoVisa === "L-1") marcar("F7");
    if (r.tipoVisa === "no-seguro") marcar("F11");
    if (r.proyectoVisa === "no") marcar("F12");

    if (r.proyectoVisa === "no") {
      nivel = 3;
      variante = "grupo";
      hallazgo = "Una LLC por sí sola no crea un proyecto elegible para visa. Dentro del Grupo Empresarial existen proyectos ya estructurados con esa opción — antes de constituir, vale la pena revisar si alguno se ajusta a tu caso.";
    } else if (r.capital === "menos" || r.capital === "no") {
      nivel = 3;
      variante = r.capital === "menos" ? "A" : "definicion";
      hallazgo = "Antes de la estructura, conviene definir el capital y el proyecto que sostendrán la estrategia migratoria.";
    } else if (r.tipoVisa === "no-seguro") {
      nivel = 3;
      variante = "definicion";
      hallazgo = "El tipo de visa cambia por completo la estructura recomendada; conviene definirlo primero, con apoyo migratorio.";
    } else if (r.tipoVisa === "L-1") {
      nivel = 4;
      hallazgo = "La L-1 depende de la relación con tu empresa actual, no solo del capital disponible. Esa relación corporativa se diseña antes de constituir.";
    } else {
      nivel = 2;
      hallazgo = "El capital es coherente con una E-2, pero la estructura y el proyecto deben validarse juntos antes de constituir.";
      if (r.proyectoVisa === "parcial") {
        hallazgo = "El capital es coherente con una E-2, pero el proyecto todavía no está completamente definido: estructura y proyecto se validan juntos antes de constituir.";
      }
    }
  }

  /* ═══ Rama Invertir ═══
     El capital nunca decide por sí solo: se combina con la existencia de una
     inversión concreta y con la participación buscada. */
  if (rama === "invertir") {
    const sinInversion = ["no-se", "poner-a-trabajar", "conocer-oportunidades"].includes(r.inversionDefinida ?? "");
    const categoria = r.inversionDefinida === "categoria";
    const especifico = r.inversionDefinida === "especifico";
    const pasivaOnd = r.participacion === "pasiva" || r.participacion === "no-se" || !r.participacion;
    /* Ruta A / Ruta B: misma ruta y mismo nivel, distinto punto de partida. */
    const varianteCapital: VarianteNivel3 = r.capital === "mas" ? "B" : "A";

    if (sinInversion) marcar("F13");
    if (pasivaOnd) marcar("F14");
    if (r.participacion === "socio-operador") marcar("F6");

    if (sinInversion || (categoria && pasivaOnd)) {
      nivel = 3;
      variante = varianteCapital;
      hallazgo = categoria
        ? "Tienes definida la categoría de inversión, pero todavía no la oportunidad ni el papel que quieres tener en ella. Esa definición precede a la estructura."
        : "Hay intención de invertir, pero todavía no hay una inversión identificada. La estructura se decide después de la inversión, no antes.";
    } else if (especifico && pasivaOnd) {
      nivel = 3;
      variante = r.participacion === "pasiva" ? "grupo" : varianteCapital;
      hallazgo = r.participacion === "pasiva"
        ? "Buscas una participación completamente pasiva. En ese escenario una LLC no siempre es necesaria: lo que corresponde revisar primero son las oportunidades y su vehículo."
        : "Ya tienes la oportunidad identificada, pero todavía no está definido tu nivel de participación — y de eso depende la estructura.";
    } else if (categoria) {
      nivel = 2;
      hallazgo = "Tienes definida la categoría de inversión y tu forma de participar. Antes de constituir conviene cerrar la oportunidad concreta, porque el activo determina la estructura.";
    } else if (especifico && r.participacion === "socio-operador") {
      nivel = banderas.filter((f) => ["F5", "F6", "F7", "F8"].includes(f)).length >= 2 ? 4 : 2;
      hallazgo = "Habrá un socio u operador de por medio: conviene definir funciones, porcentajes y responsabilidades antes de constituir.";
    } else if (especifico && r.participacion === "decisiones") {
      nivel = 2;
      hallazgo = "Quieres participar en las decisiones sin operar el día a día. Ese arreglo se documenta en el gobierno de la estructura, y conviene definirlo antes de constituir.";
    } else if (especifico && r.participacion === "operar") {
      const complejidad = banderas.filter((f) => ["F5", "F6", "F7", "F8"].includes(f)).length > 0;
      nivel = complejidad ? 2 : 1;
      hallazgo = complejidad
        ? "Vas a operar directamente una inversión ya identificada, pero hay elementos de la estructura que conviene validar antes de constituir."
        : "Tienes la inversión identificada y vas a operarla directamente: el caso corresponde a una constitución directa.";
    } else {
      nivel = 3;
      variante = varianteCapital;
      hallazgo = "Todavía falta definir la inversión y tu forma de participar en ella. Esa definición precede a la estructura.";
    }
  }

  /* ═══ Rama Explorando (sin reasignación) ═══
     Microdiagnóstico E1-E2-E3. Nunca Nivel 1: no hay información suficiente
     para recomendar una constitución directa, y tampoco se sigue preguntando. */
  if (rama === "explorando") {
    const exp = r.exploraExpectativa;
    if (exp === "operar") {
      nivel = 2;
      hallazgo = "Quieres empezar a operar, pero todavía falta definir la actividad y el estado donde existirá la operación. Conviene cerrar esas dos definiciones antes de constituir.";
    } else if (exp === "credito" || exp === "banco") {
      nivel = 3;
      variante = "definicion";
      hallazgo = "Lo que esperas obtener depende de terceros (bancos y otorgantes de crédito), no de la constitución en sí. Conviene partir de tu objetivo real y no de la entidad.";
    } else if (exp === "visa") {
      nivel = 3;
      variante = "grupo";
      hallazgo = "Una LLC por sí sola no crea elegibilidad migratoria ni un proyecto elegible para visa. Dentro del Grupo Empresarial existen proyectos ya estructurados con esa opción.";
    } else if (exp === "activos") {
      nivel = 3;
      variante = r.capital === "mas" ? "B" : "grupo";
      hallazgo = "Tu objetivo es adquirir o invertir en activos. Ese objetivo define la estructura, no al revés: primero la oportunidad, después la entidad.";
    } else if (exp === "estructura-futuro") {
      nivel = 3;
      variante = "definicion";
      hallazgo = "Quieres tener una estructura lista para el futuro. Una empresa abierta sin actividad genera obligaciones anuales desde el primer día, así que conviene abrirla cuando ya tenga una función.";
    } else {
      /* Caso E: sigue sin definirse después de las tres preguntas. No se insiste. */
      nivel = 3;
      variante = "definicion";
      hallazgo = "Después de revisar tu caso, lo que corresponde hoy no es una estructura sino una orientación inicial que ordene el objetivo y los pasos.";
    }
    /* Ninguna salida del microdiagnóstico llega a Nivel 1: con una expectativa
       incorrecta de por medio, mucho menos. */
  }

  /* Nada, en ninguna rama, puede llevar a Nivel 1 con objetivo migratorio de por medio. */
  if (nivel === 1 && banderas.includes("F8")) nivel = 2;

  /* ── Textos de encabezado (Capa A) ── */
  const objetivoTexto = textoObjetivo(rama, r);
  const perfil = textoPerfil(rama, r, nivel);

  const parrafo = nivel === 3 ? PARRAFO_N3[variante ?? "definicion"] : PARRAFO[nivel];
  /* Nivel 1 sin estado declarado (p. ej. rama Invertir): el CTA es el mismo, pero
     antes de cobrar hay que preguntar el estado. */
  const cta: Cta =
    nivel === 3 ? CTA_N3[variante ?? "definicion"]
    : nivel === 1 && !ESTADO_CUBIERTO(r.estado) ? { label: "Constituir LLC", action: "estado" }
    : CTA_NIVEL[nivel];
  const ctaSecundario: Cta | null =
    nivel === 3 && variante === "B" ? { label: "Conocer el Grupo Empresarial", action: "grupo" } : null;

  return {
    routeLevel: nivel,
    varianteNivel3: nivel === 3 ? variante ?? "definicion" : null,
    rama,
    ramaReasignada: reasignada,

    objetivoTexto,
    perfil,
    mensajeNivel: NIVEL_MENSAJE[nivel],
    parrafo,
    hallazgo,
    rutaGeneral: RUTA_GENERAL[nivel],
    cta,
    ctaSecundario,

    factores: factoresFavorables(rama, r, urgencia),
    temasPendientes: banderas.map((f) => TEMA_PENDIENTE[f]).filter(Boolean),
    recursos: recursosDe(rama, r, banderas),
    motivo: motivoDe(nivel, rama, variante),

    banderas: banderas.map((id) => ({ id, label: BANDERAS[id] })),
    capacidadEconomica: capacidadEconomica(r),
    prioridadComercial: prioridad(nivel, r, urgencia),
    potencialMembresia: potencialMembresia(nivel, variante, r),
    guionLlamada: banderas.map((f) => GUION_POR_BANDERA[f]).filter(Boolean),
    recomendacionTecnica: recomendacionTecnica(nivel, variante, rama, r),
    compraDirectaPosible: nivel === 1 && ESTADO_CUBIERTO(r.estado),
  };
}

/* ─── "Temas pendientes" (Capa B) ───
   Lista, no explicación extensa. Es la cara visible de cada bandera interna,
   redactada como pendiente del caso, nunca como falta de la persona. */
const TEMA_PENDIENTE: Record<string, string> = {
  F1: "La actividad de la empresa todavía no está completamente definida.",
  F2: "El estado que consideras está fuera de nuestro alcance estándar.",
  F3: "Aún no se ha determinado en qué estado existirá la operación real.",
  F4: "Hay socios: conviene definir porcentajes y responsabilidades por escrito.",
  F5: "Hay socios que residen fuera de Estados Unidos.",
  F6: "Habrá un socio u operador con funciones que conviene delimitar.",
  F7: "Existe una empresa en otro país relacionada con la operación.",
  F8: "La estructura forma parte de un posible objetivo migratorio.",
  F9: "El presupuesto disponible todavía no corresponde al rango de oportunidades del Grupo Empresarial.",
  F10: "El capital todavía no está disponible.",
  F11: "El tipo de visa todavía no está definido.",
  F12: "Todavía no hay un proyecto que sostenga la estrategia migratoria.",
  F13: "Todavía no hay una inversión u oportunidad identificada.",
  F14: "El nivel de participación que buscas todavía no está definido.",
  F15: "Hay expectativas sobre la LLC que en realidad dependen de terceros.",
};

function textoObjetivo(rama: Rama, r: Record<string, string>): string {
  switch (rama) {
    case "operar":
      return "Quieres establecer una operación en Estados Unidos para trabajar, facturar o vender.";
    case "visa":
      return "Quieres establecer una operación en Estados Unidos y relacionarla con un posible objetivo migratorio.";
    case "invertir":
      return r.participacion === "pasiva"
        ? "Quieres poner capital a trabajar en Estados Unidos sin involucrarte en la operación."
        : "Quieres estructurar capital para invertir o adquirir activos en Estados Unidos.";
    default:
      return "Estás evaluando si una empresa en Estados Unidos es la herramienta correcta para lo que quieres lograr.";
  }
}

function textoPerfil(rama: Rama, r: Record<string, string>, nivel: RouteLevel): string {
  const migratorio = rama === "visa" ? " con componente migratorio" : "";
  switch (rama) {
    case "operar":
      if (r.socios === "si") return "Empresario iniciando operación en Estados Unidos, con socios.";
      return nivel === 1
        ? "Empresario listo para operar con una estructura sencilla."
        : "Empresario iniciando operación en Estados Unidos.";
    case "visa":
      return `Empresario en expansión${migratorio}.`;
    case "invertir":
      switch (r.participacion) {
        case "operar": return "Inversionista dueño-operador.";
        case "decisiones": return "Inversionista con participación en decisiones.";
        case "socio-operador": return "Inversionista con socio u operador.";
        case "pasiva": return "Inversionista patrimonial con enfoque pasivo.";
        default: return "Inversionista definiendo su estrategia patrimonial.";
      }
    default:
      return "Exploración temprana: definiendo el objetivo antes de la estructura.";
  }
}

function factoresFavorables(rama: Rama, r: Record<string, string>, urgencia?: Urgencia | null): string[] {
  const f: string[] = [];
  if (ESTADO_CUBIERTO(r.estado)) f.push(`El estado que consideras (${r.estado}) está dentro de nuestro alcance directo.`);
  if (r.actividad === "si") f.push("La actividad de la empresa ya está definida.");
  if (r.socios === "no") f.push("Al ser un solo miembro, la estructura y los acuerdos internos son más simples.");
  if (r.capital === "mas") f.push("El capital disponible es coherente con el tipo de oportunidades que analizamos.");
  if (r.proyectoVisa === "si") f.push("Ya existe un proyecto definido sobre el cual construir la estrategia.");
  if (r.inversionDefinida === "especifico") f.push("Ya tienes identificada una oportunidad concreta.");
  if (r.inversionDefinida === "categoria") f.push("Ya tienes definida la categoría de inversión que te interesa.");
  if (r.participacion === "operar" || r.participacion === "decisiones") f.push("Tu forma de participar en el proyecto ya está definida.");
  if (urgencia === "listo") f.push("Tienes una fecha próxima para avanzar, lo que facilita ordenar los pasos.");
  if (rama === "explorando" && r.exploraMotivo) f.push("Identificaste con claridad qué te llevó a investigar el tema, y eso ya ordena la conversación.");
  if (!f.length) f.push("Estás revisando la estructura antes de constituir, que es el orden correcto.");
  return f;
}

/* ─── Recursos educativos (Capa B) ───
   Reutilizan el contenido que ya existe en las guías. No es el diagnóstico
   completo: es el material que corresponde a los pendientes detectados. */
function recursosDe(rama: Rama, r: Record<string, string>, banderas: string[]): { q: string; a: string }[] {
  const out: { q: string; a: string }[] = [];
  const add = (q: string, a: string) => { if (!out.some((o) => o.q === q)) out.push({ q, a }); };

  if (banderas.includes("F2") || banderas.includes("F3") || !r.estado) {
    add(
      "¿Cómo se elige el estado?",
      `${ESTADO_HEADER} ${ESTADO_SIN_IMPUESTO} Texas: ${ESTADO_INFO.Texas.desc.toLowerCase()} Florida: ${ESTADO_INFO.Florida.desc.toLowerCase()}`,
    );
  }
  if (banderas.includes("F4") || banderas.includes("F5") || banderas.includes("F6")) {
    add("¿Qué cambia cuando hay socios u operador?", SOCIOS_ACLARACION);
  }
  if (banderas.includes("F8") || banderas.includes("F11") || banderas.includes("F12")) {
    add("¿La LLC me da la visa?", VISA_ACLARACION);
  }
  if (banderas.includes("F15")) {
    add("¿Qué no resuelve por sí sola una LLC?", `La constitución no incluye ni garantiza: ${NO_INCLUYE.slice(0, 5).join(", ").toLowerCase()}. Son procesos independientes que dependen de terceros.`);
  }
  if (rama === "invertir" || banderas.includes("F13") || banderas.includes("F14")) {
    add("Errores comunes al estructurar una inversión", INVERSION_ERRORES.join(" "));
  }
  if (banderas.includes("F1") || rama === "explorando") {
    add("¿Cuándo una LLC sencilla es suficiente?", EXPLORANDO_RESUMEN.join(" "));
  }
  add("¿Cuándo conviene revisar la estructura antes de constituir?", SENALES_NOTA);
  return out;
}

function motivoDe(nivel: RouteLevel, rama: Rama, variante: VarianteNivel3 | null): string {
  if (nivel === 1) {
    return "Recomendamos avanzar porque tu caso reúne las condiciones que hacen previsible el resultado: la actividad está definida, la operación tiene un lugar claro y no aparecen terceros ni objetivos paralelos que cambien la estructura. Eso hace que constituir ahora sea el paso más eficiente.";
  }
  if (nivel === 2) {
    return "Recomendamos validar antes de constituir porque los elementos pendientes de tu caso son de los que cambian decisiones de fondo — cómo se administra la empresa, quién decide qué, dónde existe la operación. Definirlos ahora cuesta una conversación; corregirlos después cuesta una reestructura.";
  }
  if (nivel === 4) {
    return "Recomendamos una evaluación estratégica porque tu caso involucra varias decisiones que se afectan entre sí: la relación con empresas o socios existentes, el destino del capital y, en su caso, el componente migratorio. Diseñar el conjunto antes de constituir evita entidades que después hay que deshacer.";
  }
  if (variante === "grupo") {
    return "Recomendamos empezar por las oportunidades y no por la entidad porque la estructura correcta depende del proyecto que va a sostener. Dentro del Grupo Empresarial ese análisis ya está hecho sobre proyectos concretos, y desde ahí la decisión de estructura se vuelve simple.";
  }
  if (variante === "A") {
    return "Recomendamos comenzar por la estrategia porque el objetivo que describes es alcanzable, pero el camino más corto hoy no pasa por abrir una empresa: pasa por ordenar la ruta hacia el tipo de inversión que buscas. Una entidad abierta antes de tiempo solo agrega costos anuales.";
  }
  if (variante === "B") {
    return "Recomendamos definir primero la estrategia patrimonial porque el capital ya está, pero la función de la empresa dentro de esa estrategia no. Es la definición que determina cuántas entidades necesitas, dónde y con qué forma de administración.";
  }
  return "Recomendamos definir primero el objetivo porque la estructura es una consecuencia de lo que vas a hacer, no un requisito previo. Con la actividad y el destino definidos, la decisión de estructura suele resolverse en una sola conversación.";
}

function capacidadEconomica(r: Record<string, string>): string {
  switch (r.capital) {
    case "mas": return "USD 100,000 o más";
    case "menos": return "Menor a USD 100,000";
    case "no": return "Sin capital disponible todavía";
    default: return "No declarada en este flujo";
  }
}

function prioridad(nivel: RouteLevel, r: Record<string, string>, urgencia?: Urgencia | null): "alta" | "media" | "baja" {
  if (nivel === 1 && urgencia === "listo") return "alta";
  if (nivel === 4) return "alta";
  if (nivel === 3 && r.capital === "mas") return "alta";
  if (urgencia === "investigando" && nivel === 3 && r.capital !== "mas") return "baja";
  if (nivel === 3 && r.capital !== "mas") return "media";
  return urgencia === "investigando" ? "media" : "alta";
}

function potencialMembresia(nivel: RouteLevel, variante: VarianteNivel3 | null, r: Record<string, string>): "alto" | "medio" | "bajo" {
  if (r.capital === "mas") return "alto";
  if (nivel === 4) return "alto";
  if (variante === "grupo") return "medio";
  if (r.capital === "menos" || r.capital === "no") return "bajo";
  return "medio";
}

/* Recomendación técnica exacta del equipo — Capa C. Aquí sí se nombra la receta,
   porque nunca sale de la ficha interna. */
function recomendacionTecnica(nivel: RouteLevel, variante: VarianteNivel3 | null, rama: Rama, r: Record<string, string>): string {
  if (nivel === 1) {
    return `LLC de un solo miembro en ${r.estado ?? "el estado que se confirme"}, administrada por miembro, tributación por defecto. Checkout directo viable sin revisión previa.`;
  }
  if (rama === "visa" && r.tipoVisa === "L-1") {
    return "No constituir LLC standalone. Requiere análisis de la relación matriz–subsidiaria con la empresa extranjera y del expediente laboral del trasladado, con abogado migratorio.";
  }
  if (nivel === 4) {
    return "Diseño de arquitectura antes de constituir: número de entidades, holding vs. operativas, separación de activos y secuencia de constitución. Coordinar con fiscal y, si aplica, migratorio.";
  }
  if (variante === "grupo") {
    return "Enrutar a Grupo Empresarial: presentar oportunidades ya estructuradas (incluidas las que admiten opción de visa). La estructura se define después de elegir proyecto.";
  }
  if (variante === "A") {
    return "No ofrecer LLC ni membresía de inversión todavía. Ruta de preparación: plan de acumulación y criterio de inversión. Reevaluar cuando cambie el capital o aparezca un proyecto.";
  }
  if (variante === "B") {
    return "Conversación patrimonial antes de estructura: tipo de activo, horizonte, riesgo y participación. Candidato a Grupo Empresarial por capacidad económica declarada.";
  }
  if (variante === "definicion") {
    return "Sin definición de actividad o proyecto: no constituir. Orientación de definición y hoja de preparación; reevaluar cuando exista actividad concreta.";
  }
  if (rama === "visa") {
    return "Revisión conjunta de estructura y proyecto E-2 antes de constituir (montos, empleos, sustancia operativa). Requiere validación con abogado migratorio.";
  }
  if (rama === "invertir") {
    return "Definir el activo concreto y el vehículo antes de la entidad. Revisar si conviene una LLC por activo o una estructura con holding.";
  }
  return `Revisión de estructura antes de constituir: ${r.socios === "si" ? "acuerdo entre socios, administración y porcentajes" : "estado de operación real y forma de administración"}.`;
}

/* ─── Capa C — campos para el CRM ───
   Nunca se renderizan en pantalla. Van a la ficha del lead. */
export function capaCCampos(rec: Recomendacion, retro?: Retroalimentacion | null): { label: string; value: string }[] {
  const campos = [
    { label: "Nivel de ruta recomendada", value: `Nivel ${rec.routeLevel} — ${rec.mensajeNivel}` },
    { label: "Rama del diagnóstico", value: rec.rama },
    { label: "Rama reasignada desde exploración", value: rec.ramaReasignada ?? "" },
    { label: "Variante Nivel 3", value: rec.varianteNivel3 ?? "" },
    { label: "Perfil orientativo", value: rec.perfil },
    { label: "Hallazgo principal", value: rec.hallazgo },
    { label: "Banderas activadas", value: rec.banderas.map((b) => `${b.id} ${b.label}`).join(" · ") },
    { label: "Capacidad económica", value: rec.capacidadEconomica },
    { label: "Prioridad comercial", value: rec.prioridadComercial },
    { label: "Potencial de membresía", value: rec.potencialMembresia },
    { label: "Posibilidad de compra directa", value: rec.compraDirectaPosible ? "Sí" : "No" },
    { label: "Recomendación técnica del equipo", value: rec.recomendacionTecnica },
    { label: "Guion sugerido para la llamada", value: rec.guionLlamada.join(" · ") },
    { label: "Temas pendientes comunicados", value: rec.temasPendientes.join(" · ") },
  ];
  if (retro) {
    campos.push({
      label: "¿La recomendación refleja su situación?",
      value: retro === "si" ? "Sí, quiere avanzar" : retro === "parcial" ? "Parcialmente, necesita aclarar algo" : "No, su caso es diferente",
    });
  }
  return campos.filter((c) => c.value.trim());
}
