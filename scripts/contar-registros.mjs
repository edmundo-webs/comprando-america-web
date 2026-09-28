// Cuenta los registros de las tablas de negocio que el sitio dejó de escribir
// (CLAUDE.md §1). SOLO LECTURA: únicamente SELECT COUNT, y la sesión se abre
// en modo de solo lectura. No muestra ningún dato personal, solo números.
//
// Uso, en la Shell de Render del servicio comprando-america-web:
//   node scripts/contar-registros.mjs
import mysql from "mysql2/promise";

if (!process.env.DATABASE_URL) {
  console.error("Falta DATABASE_URL.");
  process.exit(1);
}

const conn = await mysql.createConnection({ uri: process.env.DATABASE_URL, ssl: { rejectUnauthorized: true } });
try {
  await conn.query("SET SESSION TRANSACTION READ ONLY");
} catch {
  // Si el servidor no lo admite, igual solo se hacen SELECT.
}

const lleno = (col) => `(${col} IS NOT NULL AND TRIM(${col}) <> '')`;

const tablas = [
  { tabla: "ca_leads", email: "email", telefono: "whatsapp" },
  { tabla: "ca_diagnostic_responses", email: "email", telefono: "whatsapp" },
  { tabla: "ca_news_subscribers", email: "email", telefono: null },
];

for (const t of tablas) {
  const tel = t.telefono ? lleno(t.telefono) : "FALSE";
  try {
    const [[r]] = await conn.query(
      `SELECT COUNT(*) AS total,
              SUM(${lleno(t.email)}) AS con_email,
              SUM(${tel}) AS con_telefono,
              SUM(${lleno(t.email)} OR ${tel}) AS con_email_o_telefono,
              SUM(NOT (${lleno(t.email)} OR ${tel})) AS sin_contacto
         FROM \`${t.tabla}\``,
    );
    console.log(
      `${t.tabla}: total=${Number(r.total)} con_email=${Number(r.con_email ?? 0)} ` +
        `con_telefono=${t.telefono ? Number(r.con_telefono ?? 0) : "n/a (la tabla no guarda teléfono)"} ` +
        `con_email_o_telefono=${Number(r.con_email_o_telefono ?? 0)} sin_contacto=${Number(r.sin_contacto ?? 0)}`,
    );
  } catch (err) {
    console.log(`${t.tabla}: no se pudo contar (${err.code ?? err.message})`);
  }
}

await conn.end();
