// Exporta al CMS los leads que quedaron en la base de este sitio antes de la
// Tanda 1 (ca_leads, ca_diagnostic_responses y ca_news_subscribers), sin
// duplicar por email o teléfono. Las tablas NO se modifican ni se borran.
//
// Por omisión NO ENVÍA NADA: solo cuenta y muestra el resumen, sin datos
// personales. Para enviar de verdad hay que pasar --enviar.
//
//   node scripts/exportar-leads-a-cms.mjs                 # solo resumen
//   node scripts/exportar-leads-a-cms.mjs --enviar --limite 3   # prueba con 3
//   node scripts/exportar-leads-a-cms.mjs --enviar        # todos
//   node scripts/exportar-leads-a-cms.mjs --csv           # tabla para el importador
//
// --csv imprime en pantalla, separado por tabuladores, lo que pide el
// importador de contactos del CMS (COLUMNAS_CSV), una fila por contacto único,
// y al final el resumen tras una línea en blanco y la palabra RESUMEN. Con
// --csv NUNCA se envía nada, aunque también se pase --enviar.
//
// Teléfonos (CLAUDE.md §5): nunca se completa un código de país. Un teléfono
// que no esté en E.164 válido se manda como está, con la marca "código de país
// pendiente", y no se usa para comparar duplicados (solo el email).
//
// Destinos, los mismos que usa el sitio (server/_core/cmsLead.ts):
//   leads y diagnósticos → CMS_API_URL/api/public/leads
//   suscriptores         → CMS_API_URL/api/public/v1/leads (exige CMS_API_KEY)
import { parsePhoneNumberFromString } from "libphonenumber-js/max";
import { pathToFileURL } from "node:url";

export const ETIQUETA_PAIS_PENDIENTE = "Código de país del teléfono";

/** Encabezados exactos del importador del CMS, en su orden. */
export const COLUMNAS_CSV = [
  "Nombre", "Apellido", "Email", "Teléfono", "WhatsApp",
  "Fecha de primer contacto", "Fuente del lead", "Etiquetas", "Nota",
];
export const FUENTE_CSV = "Web CA";
export const ETIQUETA_CSV_PAIS_PENDIENTE = "codigo-pais-pendiente";

export function normalizarEmail(v) {
  const t = String(v ?? "").trim().toLowerCase();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t) ? t : "";
}

/**
 * Devuelve el teléfono en E.164 solo si YA trae código de país y es válido.
 * Quitar espacios o guiones no cambia el número; agregar un código sí, y eso
 * no se hace nunca.
 */
export function e164SiYaLoEs(v) {
  const t = String(v ?? "").replace(/[\s().-]/g, "");
  if (!/^\+[1-9]\d{6,14}$/.test(t)) return "";
  const p = parsePhoneNumberFromString(t);
  return p?.isValid() ? p.number : "";
}

/**
 * Une registros de las tres tablas en contactos únicos: dos registros son el
 * mismo contacto si comparten email o teléfono E.164.
 */
export function agruparContactos(registros) {
  const padre = registros.map((_, i) => i);
  const raiz = (i) => (padre[i] === i ? i : (padre[i] = raiz(padre[i])));
  const unir = (a, b) => {
    const ra = raiz(a), rb = raiz(b);
    if (ra !== rb) padre[rb] = ra;
  };
  const porClave = new Map();
  registros.forEach((r, i) => {
    for (const clave of [r.email && `e:${r.email}`, r.telefonoE164 && `t:${r.telefonoE164}`]) {
      if (!clave) continue;
      if (porClave.has(clave)) unir(porClave.get(clave), i);
      else porClave.set(clave, i);
    }
  });
  const grupos = new Map();
  registros.forEach((r, i) => {
    const k = raiz(i);
    if (!grupos.has(k)) grupos.set(k, []);
    grupos.get(k).push(r);
  });
  return [...grupos.values()];
}

/** Un contacto único → cuerpo(s) para el CMS. */
export function cuerposParaCms(grupo) {
  const primero = (f) => grupo.map(f).find(Boolean) ?? "";
  const nombre = primero((r) => r.nombre);
  const email = primero((r) => r.email);
  const telefonoE164 = primero((r) => r.telefonoE164);
  const telefonoCrudo = telefonoE164 ? "" : primero((r) => r.telefonoCrudo);
  const origenes = [...new Set(grupo.map((r) => `${r.tabla}${r.fuente ? ` (${r.fuente})` : ""}`))];
  const fechas = grupo.map((r) => r.fecha).filter(Boolean).sort();

  const formFields = [
    { label: "Origen", value: `Exportación del sitio web: ${origenes.join(", ")}` },
    ...(fechas.length ? [{ label: "Fecha de registro en el sitio", value: String(fechas[0]).slice(0, 10) }] : []),
    ...(telefonoCrudo ? [{ label: ETIQUETA_PAIS_PENDIENTE, value: `pendiente (llegó como: ${telefonoCrudo})` }] : []),
  ];

  const cuerpos = [];
  const esLead = grupo.some((r) => r.tabla !== "ca_news_subscribers");
  if (esLead) {
    cuerpos.push({
      ruta: "/api/public/leads",
      cuerpo: {
        name: nombre || (email ? email.split("@")[0] : "Sin nombre"),
        ...(email ? { email } : {}),
        ...((telefonoE164 || telefonoCrudo) ? { phone: telefonoE164 || telefonoCrudo } : {}),
        sourceSlug: "web_ca_exportacion",
        formFields,
      },
    });
  }
  if (email && grupo.some((r) => r.tabla === "ca_news_subscribers")) {
    cuerpos.push({
      ruta: "/api/public/v1/leads",
      cuerpo: {
        email,
        ...(nombre ? { name: nombre } : {}),
        formSlug: "newsletter",
        site: "comprandoamerica.com",
        consent: true,
      },
    });
  }
  return cuerpos;
}

/**
 * La misma etiqueta `form:<slug>` que pone hoy la API del CMS
 * (formOriginTagName en el CMS): minúsculas, sin acentos, guiones.
 */
export function etiquetaFormulario(slug) {
  const s = String(slug ?? "")
    .trim()
    .toLowerCase()
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return s ? `form:${s}` : "";
}

/** Formulario de origen de un registro: `fuente` en ca_leads; /diagnostico en los diagnósticos. */
function slugFormulario(r) {
  if (r.tabla === "ca_leads") return r.fuente;
  if (r.tabla === "ca_diagnostic_responses") return "diagnostico";
  return "";
}

/** Una celda en una sola línea: sin tabuladores ni saltos de línea. */
export function celdaCsv(v) {
  return String(v ?? "").replace(/[\t\r\n]+/g, " ").replace(/ {2,}/g, " ").trim();
}

function textoDato(v) {
  if (v === null || v === undefined || v === "") return "";
  if (Array.isArray(v)) return v.map(textoDato).filter(Boolean).join(", ");
  if (typeof v === "object") {
    return Object.entries(v).map(([k, x]) => (textoDato(x) ? `${k}: ${textoDato(x)}` : "")).filter(Boolean).join(", ");
  }
  return String(v);
}

/** Lo que dejó un registro, además de nombre, email y teléfono. */
function detalleRegistro(r) {
  const fecha = r.fecha ? ` (${String(r.fecha).slice(0, 10)})` : "";
  const datos = Object.entries(r.datos ?? {})
    .map(([k, v]) => (textoDato(v) ? `${k}: ${textoDato(v)}` : ""))
    .filter(Boolean)
    .join(", ");
  const titulo =
    r.tabla === "ca_leads" ? `Formulario ${r.fuente || "sin nombre"}`
    : r.tabla === "ca_diagnostic_responses" ? "Diagnóstico /diagnostico"
    : "Boletín /news";
  return `${titulo}${fecha}${datos ? `: ${datos}` : ""}`;
}

/** Un contacto único → una fila del importador, con las columnas de COLUMNAS_CSV. */
export function filaCsv(grupo) {
  const ordenado = [...grupo].sort((a, b) => String(a.fecha ?? "￿").localeCompare(String(b.fecha ?? "￿")));
  const distintos = (f) => [...new Set(ordenado.map(f).filter(Boolean))];

  const nombres = distintos((r) => r.nombre);
  const emails = distintos((r) => r.email);
  // Cada teléfono en E.164 si ya lo está; si no, tal como llegó.
  const telefonos = distintos((r) => r.telefonoE164 || r.telefonoCrudo);
  const sinCodigo = distintos((r) => (r.telefonoE164 ? "" : r.telefonoCrudo));
  const fechas = ordenado.map((r) => r.fecha).filter(Boolean);

  const etiquetas = [];
  if (grupo.some((r) => r.tabla === "ca_news_subscribers")) etiquetas.push("newsletter");
  for (const r of ordenado) {
    const e = etiquetaFormulario(slugFormulario(r));
    if (e && !etiquetas.includes(e)) etiquetas.push(e);
  }
  if (sinCodigo.length) etiquetas.push(ETIQUETA_CSV_PAIS_PENDIENTE);

  const nota = [
    "Exportación del sitio web comprandoamerica.com",
    ...ordenado.map(detalleRegistro),
    ...(sinCodigo.length ? [`${ETIQUETA_PAIS_PENDIENTE}: pendiente (llegó como: ${sinCodigo.join(", ")})`] : []),
    ...(nombres.length > 1 ? [`Otros nombres: ${nombres.slice(1).join(", ")}`] : []),
    ...(emails.length > 1 ? [`Otros emails: ${emails.slice(1).join(", ")}`] : []),
    ...(telefonos.length > 1 ? [`Otros teléfonos: ${telefonos.slice(1).join(", ")}`] : []),
  ].join(" | ");

  const telefono = telefonos[0] ?? "";
  return [
    nombres[0] ?? "",
    "", // Apellido: no se parten nombres.
    emails[0] ?? "",
    telefono,
    telefono,
    fechas.length ? String(fechas[0]).slice(0, 10) : "",
    FUENTE_CSV,
    etiquetas.join(","),
    nota,
  ].map(celdaCsv);
}

/** Encabezados + una fila por contacto, separados por tabuladores. */
export function tablaCsv(grupos) {
  return [COLUMNAS_CSV, ...grupos.map(filaCsv)].map((fila) => fila.join("\t")).join("\n");
}

async function leerTablas(conn) {
  const registros = [];
  const sinContacto = { ca_leads: 0, ca_diagnostic_responses: 0, ca_news_subscribers: 0 };
  const agregar = (r) => {
    if (!r.email && !r.telefonoE164 && !r.telefonoCrudo) {
      sinContacto[r.tabla] += 1;
      return;
    }
    registros.push(r);
  };
  const [leads] = await conn.query("SELECT nombreCompleto, whatsapp, email, fuente, createdAt FROM ca_leads");
  const json = (t) => {
    try {
      return t ? JSON.parse(t) : null;
    } catch {
      return t;
    }
  };
  for (const l of leads) {
    agregar({
      tabla: "ca_leads", fuente: l.fuente, fecha: l.createdAt?.toISOString?.() ?? l.createdAt,
      nombre: String(l.nombreCompleto ?? "").trim(), email: normalizarEmail(l.email),
      telefonoE164: e164SiYaLoEs(l.whatsapp), telefonoCrudo: String(l.whatsapp ?? "").trim(),
    });
  }
  const [diags] = await conn.query(
    "SELECT nombre, whatsapp, email, profile, responses, completed, utmSource, utmMedium, utmCampaign, referrer, createdAt FROM ca_diagnostic_responses",
  );
  for (const d of diags) {
    agregar({
      tabla: "ca_diagnostic_responses", fuente: d.profile, fecha: d.createdAt?.toISOString?.() ?? d.createdAt,
      nombre: String(d.nombre ?? "").trim(), email: normalizarEmail(d.email),
      telefonoE164: e164SiYaLoEs(d.whatsapp), telefonoCrudo: String(d.whatsapp ?? "").trim(),
      datos: {
        perfil: d.profile, respuestas: json(d.responses), completado: d.completed === "true" ? "sí" : "no",
        utm_source: d.utmSource, utm_medium: d.utmMedium, utm_campaign: d.utmCampaign, "página de procedencia": d.referrer,
      },
    });
  }
  const [subs] = await conn.query("SELECT name, email, categories, createdAt FROM ca_news_subscribers");
  for (const s of subs) {
    agregar({
      tabla: "ca_news_subscribers", fuente: "", fecha: s.createdAt?.toISOString?.() ?? s.createdAt,
      nombre: String(s.name ?? "").trim(), email: normalizarEmail(s.email), telefonoE164: "", telefonoCrudo: "",
      datos: { "categorías": json(s.categories) },
    });
  }
  return { registros, sinContacto, totales: { ca_leads: leads.length, ca_diagnostic_responses: diags.length, ca_news_subscribers: subs.length } };
}

async function main() {
  const args = process.argv.slice(2);
  const csv = args.includes("--csv");
  const enviar = args.includes("--enviar");
  const iLimite = args.indexOf("--limite");
  const limite = iLimite >= 0 ? Number(args[iLimite + 1]) : Infinity;

  if (!process.env.DATABASE_URL) {
    console.error("Falta DATABASE_URL.");
    process.exit(1);
  }
  const { default: mysql } = await import("mysql2/promise");
  const conn = await mysql.createConnection({ uri: process.env.DATABASE_URL, ssl: { rejectUnauthorized: true } });
  try {
    await conn.query("SET SESSION TRANSACTION READ ONLY");
  } catch {
    /* solo se hacen SELECT de todos modos */
  }
  const { registros, sinContacto, totales } = await leerTablas(conn);
  await conn.end();

  const grupos = agruparContactos(registros);

  if (csv) {
    console.log(tablaCsv(grupos));
    console.log("\nRESUMEN");
    console.log("Registros por tabla:", JSON.stringify(totales));
    console.log("Sin email ni teléfono (no se exportan):", JSON.stringify(sinContacto));
    console.log(`Filas de datos (contactos únicos después de quitar duplicados): ${grupos.length}`);
    console.log(`Con teléfono sin código de país (etiqueta ${ETIQUETA_CSV_PAIS_PENDIENTE}): ${grupos.filter((g) => g.some((r) => r.telefonoCrudo && !r.telefonoE164)).length}`);
    console.log("No se envió nada al CMS (--csv nunca envía).");
    return;
  }

  const envios = grupos.flatMap(cuerposParaCms);
  const pendientes = envios.filter((e) => (e.cuerpo.formFields ?? []).some((f) => f.label === ETIQUETA_PAIS_PENDIENTE)).length;

  console.log("Registros por tabla:", JSON.stringify(totales));
  console.log("Sin email ni teléfono (no se exportan):", JSON.stringify(sinContacto));
  console.log(`Contactos únicos después de quitar duplicados: ${grupos.length}`);
  console.log(`Envíos al CMS: ${envios.length} (formularios: ${envios.filter((e) => e.ruta === "/api/public/leads").length}, boletín: ${envios.filter((e) => e.ruta === "/api/public/v1/leads").length})`);
  console.log(`Con teléfono sin código de país (se mandan marcados, sin completar): ${pendientes}`);

  if (!enviar) {
    console.log("\nNo se envió nada. Para enviar: node scripts/exportar-leads-a-cms.mjs --enviar [--limite N]");
    return;
  }

  const base = (process.env.CMS_API_URL || process.env.VITE_CRM_API_URL || "https://ca-cms.onrender.com").replace(/\/+$/, "");
  const token = process.env.CMS_API_KEY;
  if (envios.some((e) => e.ruta === "/api/public/v1/leads") && !token) {
    console.error("Falta CMS_API_KEY: el boletín del CMS la exige. No se envió nada.");
    process.exit(1);
  }

  let ok = 0, fallidos = 0;
  const lote = envios.slice(0, limite);
  for (const [i, e] of lote.entries()) {
    try {
      const res = await fetch(`${base}${e.ruta}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(token ? { "x-api-key": token } : {}) },
        body: JSON.stringify(e.cuerpo),
        signal: AbortSignal.timeout(15_000),
      });
      if (res.ok) ok += 1;
      else {
        fallidos += 1;
        console.log(`#${i + 1} ${e.ruta} rechazado: ${res.status}`);
      }
    } catch (err) {
      fallidos += 1;
      console.log(`#${i + 1} ${e.ruta} sin respuesta: ${err.message}`);
    }
    if ((i + 1) % 10 === 0) console.log(`${i + 1}/${lote.length}`);
    // /api/public/leads admite 20 por minuto: 3.2 s entre envíos lo respeta.
    await new Promise((r) => setTimeout(r, 3_200));
  }
  console.log(`\nListo: ${ok} enviados, ${fallidos} fallidos de ${lote.length}.`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((err) => {
    console.error("Error:", err.message);
    process.exit(1);
  });
}
