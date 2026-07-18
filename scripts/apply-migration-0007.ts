/**
 * Idempotent runner for the 0007 migration (analytics tables).
 * Adds two tables:
 *   - ca_diagnostic_responses (GPS Estratégico completions)
 *   - ca_cta_clicks (outbound link click tracking)
 *
 * Same pattern as apply-migration-0006.ts: checks INFORMATION_SCHEMA
 * before each CREATE so re-runs are safe.
 *
 * Usage:  pnpm tsx scripts/apply-migration-0007.ts
 *         pnpm tsx scripts/apply-migration-0007.ts --dry
 */
import "dotenv/config";
import mysql from "mysql2/promise";

async function tableExists(conn: mysql.Pool, schema: string, table: string): Promise<boolean> {
  const [rows] = await conn.query(
    `SELECT 1 FROM information_schema.TABLES WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? LIMIT 1`,
    [schema, table]
  );
  return (rows as any[]).length > 0;
}

async function exec(conn: mysql.Pool, sql: string, dryRun: boolean) {
  if (dryRun) {
    console.log("  [dry] " + sql.split("\n")[0]!.slice(0, 100));
    return;
  }
  await conn.query(sql);
  console.log("  ✔ " + sql.split("\n")[0]!.slice(0, 100));
}

async function main() {
  const dryRun = process.argv.includes("--dry");
  const pool = mysql.createPool({
    uri: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: true },
    connectionLimit: 2,
  });

  try {
    const [[{ db }]]: any = await pool.query("SELECT DATABASE() AS db");
    console.log(`Connected. Schema: ${db}${dryRun ? "  [DRY RUN]" : ""}\n`);

    // ─── ca_diagnostic_responses ───
    console.log("Creating ca_diagnostic_responses…");
    if (await tableExists(pool, db, "ca_diagnostic_responses")) {
      console.log("  ⏭ ca_diagnostic_responses already exists");
    } else {
      await exec(
        pool,
        `CREATE TABLE \`ca_diagnostic_responses\` (
          \`id\` int AUTO_INCREMENT NOT NULL,
          \`sessionId\` varchar(64),
          \`profile\` varchar(32),
          \`responses\` text,
          \`nombre\` varchar(255),
          \`whatsapp\` varchar(50),
          \`email\` varchar(320),
          \`utmSource\` varchar(100),
          \`utmMedium\` varchar(100),
          \`utmCampaign\` varchar(100),
          \`referrer\` varchar(500),
          \`userAgent\` varchar(500),
          \`completed\` varchar(5) NOT NULL DEFAULT 'false',
          \`createdAt\` timestamp NOT NULL DEFAULT (now()),
          CONSTRAINT \`ca_diagnostic_responses_id\` PRIMARY KEY(\`id\`)
        )`,
        dryRun
      );
      if (!dryRun) {
        await exec(pool, `CREATE INDEX \`ca_diagnostic_created_idx\` ON \`ca_diagnostic_responses\` (\`createdAt\`)`, dryRun);
        await exec(pool, `CREATE INDEX \`ca_diagnostic_profile_idx\` ON \`ca_diagnostic_responses\` (\`profile\`)`, dryRun);
      }
    }

    // ─── ca_cta_clicks ───
    console.log(`\nCreating ca_cta_clicks…`);
    if (await tableExists(pool, db, "ca_cta_clicks")) {
      console.log("  ⏭ ca_cta_clicks already exists");
    } else {
      await exec(
        pool,
        `CREATE TABLE \`ca_cta_clicks\` (
          \`id\` int AUTO_INCREMENT NOT NULL,
          \`cta\` varchar(64) NOT NULL,
          \`location\` varchar(128),
          \`destination\` varchar(1000),
          \`sessionId\` varchar(64),
          \`referrer\` varchar(500),
          \`userAgent\` varchar(500),
          \`utmSource\` varchar(100),
          \`utmCampaign\` varchar(100),
          \`createdAt\` timestamp NOT NULL DEFAULT (now()),
          CONSTRAINT \`ca_cta_clicks_id\` PRIMARY KEY(\`id\`)
        )`,
        dryRun
      );
      if (!dryRun) {
        await exec(pool, `CREATE INDEX \`ca_cta_clicks_cta_idx\` ON \`ca_cta_clicks\` (\`cta\`, \`createdAt\`)`, dryRun);
        await exec(pool, `CREATE INDEX \`ca_cta_clicks_created_idx\` ON \`ca_cta_clicks\` (\`createdAt\`)`, dryRun);
      }
    }

    console.log(`\n${dryRun ? "Dry run complete." : "Migration 0007 applied."}`);
  } finally {
    await pool.end();
  }
}

main().catch((err) => {
  console.error("\nMigration failed:", err.message);
  process.exit(1);
});
