/*
 * Todo lo que decimos sobre el estado de constitución, en un solo lugar.
 *
 * Vive aparte de `diagnostico.ts` porque lo consumen tanto el diagnóstico como
 * las secciones educativas de la página, y porque el mismo argumento aparece en
 * tres extensiones distintas. Si cada superficie guardara su propia versión, la
 * primera edición las desincronizaría.
 *
 * ⚠️ Contenido con afirmaciones fiscales: requiere revisión de Edmundo antes de
 * publicar. No afirma ni insinúa capacidad de asesoría fiscal, dictamen o
 * representación ante el IRS, y no usa "domicilio fiscal" — la dirección que el
 * servicio provee es una dirección comercial para el registro.
 */

/* ─── Criterio de estado (bloque "Texas o Florida" + paso de estado del diagnóstico) ───
   Instala el criterio; no argumenta ventajas. La versión explicativa con datos
   es ESTADOS_POPULARES, más abajo: los dos bloques hacen trabajos distintos y no
   deben repetir frases. */
export const ESTADO_INFO: Record<string, { desc: string; argumentos: string[] }> = {
  Texas: {
    desc: "Cuando la operación, los clientes, el personal o la administración van a estar en suelo texano.",
    /* `argumentos` NO se muestra al elegir el estado: a esa altura la persona
       decide dónde ocurre su operación, no qué estado es "mejor". Su lugar es la
       página de cada estado, después de que el diagnóstico rutea. */
    argumentos: ["Ecosistema empresarial sólido", "Comunidad latina activa", "Ideal para operaciones comerciales"],
  },
  Florida: {
    desc: "Cuando el mercado, las propiedades o la presencia principal van a estar allá.",
    argumentos: ["Fuerte conexión con Latinoamérica", "Mercado inmobiliario activo", "Ideal para negocios digitales y bienes raíces"],
  },
};

/* Premisa de la decisión de estado. */
export const ESTADO_HEADER =
  "El estado no se elige por sus ventajas. Se elige por dónde ocurre realmente la operación.";

/* Lo único que los dos estados comparten y que sí conviene decir de entrada,
   porque es la creencia que más gente trae equivocada. */
export const ESTADO_SIN_IMPUESTO = "Ninguno de los dos cobra impuesto estatal sobre la renta.";

/* ─── Registrar fuera del estado donde ocurre la operación ───
   El mismo argumento en tres extensiones, una por superficie: `corta` en el
   bloque inline del diagnóstico, `media` en la FAQ, `larga` en la sección
   educativa. Se edita aquí, no en cada pantalla.

   ⚠️ Las tres son intencionales y NINGUNA es duplicado de otra. Comparten
   afirmaciones porque son el mismo argumento, pero cada superficie llega con un
   contexto distinto: en el diagnóstico la persona acaba de escribir el nombre de
   un estado y necesita entender por qué eso se va a revisar; en la FAQ está
   comparando estados en frío; en la sección educativa está leyendo. Borrar una
   por parecerse a las otras deja esa superficie sin respuesta.

   Si cambia una afirmación de fondo (el nexo fiscal, la aritmética de los dos
   registros, la privacidad), cambia en las tres. */
export const REGISTRO_FUERA_DEL_ESTADO = {
  /**
   * Versión corta — bloque inline del paso de estado del diagnóstico
   * (spec del diagnóstico, §2.2), cuando el estado capturado en texto libre es
   * Wyoming, Delaware o Nevada.
   *
   * Es la única de las tres que además de la aritmética cubre privacidad y la
   * infraestructura de agente registrado y dirección: aparece justo cuando la
   * persona nombró uno de esos estados, y son las dos razones por las que suele
   * nombrarlos.
   */
  corta: [
    "Son los estados más mencionados en redes, y no por casualidad: tienen usos legítimos. Pero casi siempre en contextos distintos al de quien está abriendo su primera empresa.",
    "La razón de fondo es que la obligación fiscal sigue a la actividad, no al estado de registro. Si constituyes en Wyoming y operas en Texas, Texas te va a exigir registrarte también como entidad foránea: dos registros, dos agentes, dos calendarios de cumplimiento — y sin ahorro, porque el impuesto federal se paga igual y el estatal se determina por dónde operas.",
    "Sobre privacidad: es cierto que esos estados no publican a los miembros. También es cierto que no es la única forma de lograrlo, y que la privacidad frente al registro público no es privacidad frente al IRS ni frente al banco donde abras la cuenta.",
    "Hay algo práctico además: si no tienes SSN ni ITIN, constituir en cualquier estado requiere que alguien te resuelva agente registrado y dirección. Nosotros lo sostenemos en Texas y Florida. En otros estados necesitas un despacho que lo ofrezca ahí — y si tu caso lo justifica, te decimos con quién.",
  ],

  /** Versión media — FAQ "¿En qué estado debo abrir mi LLC?". */
  media: [
    "En el estado donde va a ocurrir la operación. Esa es la respuesta en la mayoría de los casos, aunque circule mucho contenido que sugiere lo contrario.",
    "Registrar en un estado distinto al que operas no elimina obligaciones: las duplica, porque el estado donde realmente operas te va a exigir registrarte de todas formas. Hay casos donde constituir en otro estado tiene sentido —estructuras con varios socios, ciertos vehículos de inversión, planeación patrimonial— pero son la excepción y se identifican antes de constituir, no después.",
  ],

  /** Versión larga — sección educativa, con la aritmética completa. */
  larga: [
    "Este es el punto que casi nunca aparece en los videos. Donde operas, tienes clientes, personal o propiedades, hay nexo fiscal — y el estado donde presentaste el papel no lo cambia.",
    "La consecuencia es concreta y aritmética. Si constituyes en Wyoming pero tu operación ocurre en Texas, Texas te va a exigir registrarte como entidad foránea. A partir de ahí mantienes: agente registrado en Wyoming, reporte anual de Wyoming, registro en Texas, agente registrado en Texas y el reporte de franquicia de Texas.",
    "Dos jurisdicciones, dos calendarios de cumplimiento, dos costos anuales. El impuesto federal se paga igual. El estatal se determina por dónde operas. El ahorro es cero y la complejidad se duplica.",
  ],
};

/* ─── Sección educativa "¿Y Wyoming, Delaware o Nevada?" ───
   Desmonta la desinformación con datos. Los párrafos admiten **énfasis** puntual
   (ver el componente EstadosPopulares); no es markdown completo. */
export const ESTADOS_POPULARES = {
  eyebrow: "Estados",
  titulo: "¿Y Wyoming, Delaware o Nevada?",
  intro:
    "Es la pregunta que más nos hacen, y viene casi siempre del mismo lugar: contenido en redes que presenta esos estados como la decisión inteligente por defecto. Vale la pena responderla con calma, porque la respuesta corta —“depende”— no le sirve a nadie.",
  bloques: [
    {
      titulo: "Esos estados no son un error. Son una herramienta para otro problema.",
      parrafos: [
        "Wyoming, Delaware y Nevada tienen usos legítimos y bien documentados. Delaware es el estándar para empresas que van a levantar capital de riesgo o tener múltiples clases de acciones, por su tribunal especializado en derecho corporativo y por décadas de jurisprudencia predecible. Wyoming y Nevada ofrecen registros donde los miembros no se publican.",
        "Ninguno de esos escenarios describe a la mayoría de quienes están constituyendo su primera empresa para operar o invertir.",
      ],
    },
    {
      titulo: "La obligación fiscal sigue a la actividad, no al registro.",
      parrafos: REGISTRO_FUERA_DEL_ESTADO.larga,
    },
    {
      titulo: "Sobre privacidad: lo que es cierto y lo que no.",
      parrafos: [
        "Es cierto que esos estados no publican a los miembros ni a los administradores en el registro público. Eso existe y para algunos casos importa.",
        "Lo que no es cierto es que sea la única forma de conseguirlo. Y hay una distinción que conviene tener clara: privacidad frente al registro público no es privacidad frente al IRS ni frente al banco. En la apertura de cuenta vas a identificar a los beneficiarios de todos modos — es requisito del banco, no del estado.",
      ],
    },
    {
      /* Este bloque es el que sostiene la credibilidad de todo lo anterior: no se
         recorta por longitud. */
      titulo: "Cuándo sí tiene sentido",
      parrafos: [
        "Cuando hay varios socios con participaciones distintas y se anticipa entrada de inversionistas. Cuando la estructura forma parte de planeación patrimonial. Cuando existe una razón específica que resiste el análisis de costo y cumplimiento duplicado.",
        "Son casos reales. También son la excepción, y se identifican **antes** de constituir — no después de haber pagado dos registros.",
      ],
    },
    {
      titulo: "Por qué nuestro servicio en línea es Texas y Florida",
      parrafos: [
        "Porque el servicio no es solo presentar el documento de constitución. Para un extranjero sin número de seguro social ni ITIN, constituir requiere que alguien resuelva el agente registrado y la dirección comercial para el registro. Esa infraestructura la sostenemos completa en Texas y Florida.",
        "En otros estados hace falta un despacho que la ofrezca localmente. Si tu caso lo justifica, te lo decimos y te indicamos con quién — no te dejamos sin siguiente paso.",
      ],
    },
  ],
};

export type Faq = { q: string; a: string | string[]; modal?: string };

/* ─── Preguntas frecuentes sobre el estado ───
   Van al inicio de la sección de FAQ: son las de mayor volumen de búsqueda. */
export const FAQ_ESTADOS_PRIORITARIAS: Faq[] = [
  {
    q: "¿En qué estado debo abrir mi LLC?",
    a: REGISTRO_FUERA_DEL_ESTADO.media,
  },
  {
    q: "¿Es cierto que si me registro en Delaware no pago impuestos?",
    a: [
      "No. Delaware no cobra impuesto estatal sobre la renta a entidades que no operan en Delaware, y de ahí viene la confusión.",
      "Pero una LLC es transparente para efectos fiscales: sus ingresos se atribuyen a los socios y se gravan en función de dónde se genera la actividad y de la situación fiscal de cada socio. El impuesto federal se paga igual. Además Delaware cobra su propio impuesto anual de franquicia, y si operas en otro estado pagas también allá. Terminas con dos jurisdicciones y ningún ahorro.",
    ],
  },
];

/* Cubren huecos que la sección no tenía. Entran o salen como bloque: quitar esta
   constante de la lista de FAQ las remueve sin tocar nada más. */
export const FAQ_ESTADOS_SUGERIDAS: Faq[] = [
  {
    q: "¿Puedo abrir una LLC si no tengo número de seguro social ni ITIN?",
    a: [
      "Sí. Es el caso más común entre quienes nos buscan y no es un obstáculo.",
      "Lo que hace falta resolver es la infraestructura: un agente registrado en el estado y una dirección comercial para el registro. Eso está incluido en el servicio. El ITIN, si tu situación lo requiere, se puede gestionar después de constituir — no es un requisito previo.",
    ],
  },
  {
    q: "Si abro mi LLC en Texas pero vivo en otro país, ¿dónde pago impuestos?",
    a: [
      "Depende de tu situación personal y del tipo de ingreso, y es precisamente el tipo de pregunta que no se puede contestar bien de forma general.",
      "Lo que sí podemos decirte: la dirección comercial que usamos para el registro sirve para notificaciones oficiales y no determina dónde pagas impuestos. Tampoco te crea residencia fiscal en Estados Unidos. Para la determinación de tu caso necesitas un profesional autorizado para presentar declaraciones — nosotros no lo hacemos, pero te decimos qué perfil buscar y en qué momento del año.",
    ],
  },
];
