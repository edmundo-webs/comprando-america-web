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
  for (const l of leads) {
    agregar({
      tabla: "ca_leads", fuente: l.fuente, fecha: l.createdAt?.toISOString?.() ?? l.createdAt,
      nombre: String(l.nombreCompleto ?? "").trim(), email: normalizarEmail(l.email),
      telefonoE164: e164SiYaLoEs(l.whatsapp), telefonoCrudo: String(l.whatsapp ?? "").trim(),
    });
  }
  const [diags] = await conn.query("SELECT nombre, whatsapp, email, profile, createdAt FROM ca_diagnostic_responses");
  for (const d of diags) {
    agregar({
      tabla: "ca_diagnostic_responses", fuente: d.profile, fecha: d.createdAt?.toISOString?.() ?? d.createdAt,
      nombre: String(d.nombre ?? "").trim(), email: normalizarEmail(d.email),
      telefonoE164: e164SiYaLoEs(d.whatsapp), telefonoCrudo: String(d.whatsapp ?? "").trim(),
    });
  }
  const [subs] = await conn.query("SELECT name, email, createdAt FROM ca_news_subscribers");
  for (const s of subs) {
    agregar({
      tabla: "ca_news_subscribers", fuente: "", fecha: s.createdAt?.toISOString?.() ?? s.createdAt,
      nombre: String(s.name ?? "").trim(), email: normalizarEmail(s.email), telefonoE164: "", telefonoCrudo: "",
    });
  }
  return { registros, sinContacto, totales: { ca_leads: leads.length, ca_diagnostic_responses: diags.length, ca_news_subscribers: subs.length } };
}

async function main() {
  const args = process.argv.slice(2);
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
