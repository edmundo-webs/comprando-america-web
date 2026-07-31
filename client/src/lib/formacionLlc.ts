/*
 * Copy del servicio de formación de LLC — fuente única.
 *
 * Lo usa la pantalla de confirmación previa al pago: qué incluye el servicio,
 * qué no incluye y las dos preguntas que siempre aparecen ahí. Si cambia, cambia
 * aquí y no en la pantalla.
 *
 * El criterio de estado no vive aquí, vive en `lib/estados.ts`: lo comparten el
 * diagnóstico y las secciones educativas de la página.
 *
 * Las preguntas y la lógica del diagnóstico viven en `lib/diagnosticoEstructura.ts`.
 * Aquí no hay reglas: solo lo que el servicio es y hasta dónde llega.
 */

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
