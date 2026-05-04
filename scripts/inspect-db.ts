import "dotenv/config";
import mysql from "mysql2/promise";

async function main() {
  const pool = mysql.createPool({
    uri: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: true },
  });

  try {
    const [dbInfo] = await pool.query("SELECT DATABASE() as db, CURRENT_USER() as user");
    console.log("DB:", dbInfo);

    const [tables] = await pool.query("SHOW TABLES");
    const all = (tables as any[]).map((r) => Object.values(r)[0] as string);
    const interesting = all.filter((n) => /news|ca_|social|ingestion|blog|users|subscribers/i.test(n));
    console.log("\nRELEVANT TABLES:");
    interesting.forEach((t) => console.log("  -", t));

    for (const t of interesting) {
      console.log(`\n--- ${t} ---`);
      const [cols] = await pool.query(`SHOW COLUMNS FROM \`${t}\``);
      (cols as any[]).forEach((c) => console.log(`  ${c.Field.padEnd(28)} ${c.Type}${c.Null === "NO" ? " NOT NULL" : ""}${c.Key ? ` [${c.Key}]` : ""}`));
    }
  } finally {
    await pool.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
