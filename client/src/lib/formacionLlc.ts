/*
 * Copy del servicio de formación de LLC — fuente única.
 *
 * Lo usan la sección "Texas o Florida" de la página (componente
 * EstadoTexasFlorida) y la pantalla de confirmación previa al pago. Si cambia,
 * cambia en los dos lugares a la vez: no debe haber dos versiones de este
 * criterio.
 *
 * Las preguntas y la lógica del diagnóstico viven en `lib/diagnosticoEstructura.ts`.
 * Aquí no hay reglas: solo lo que el servicio es y hasta dónde llega.
 */

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
