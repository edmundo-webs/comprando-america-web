/**
 * Idempotent creator for the analytics tables (ca_diagnostic_responses,
 * ca_cta_clicks). Runs on server boot so a fresh deploy can start writing
 * events without needing an out-of-band migration.
 *
 * Safe to re-run: every statement is a "create if not exists" or an
 * `SHOW INDEX` check before `CREATE INDEX`. Errors are logged and swallowed
 * so a DB glitch never blocks server startup.
 */
import { getDbPool } from "../db";

const DDL = {
  diagnosticResponses: `
    CREATE TABLE IF NOT EXISTS \`ca_diagnostic_responses\` (
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
  ctaClicks: `
    CREATE TABLE IF NOT EXISTS \`ca_cta_clicks\` (
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
};

const INDEXES: { table: string; name: string; sql: string }[] = [
  {
    table: "ca_diagnostic_responses",
    name: "ca_diagnostic_created_idx",
    sql: `CREATE INDEX \`ca_diagnostic_created_idx\` ON \`ca_diagnostic_responses\` (\`createdAt\`)`,
  },
  {
    table: "ca_diagnostic_responses",
    name: "ca_diagnostic_profile_idx",
    sql: `CREATE INDEX \`ca_diagnostic_profile_idx\` ON \`ca_diagnostic_responses\` (\`profile\`)`,
  },
  {
    table: "ca_cta_clicks",
    name: "ca_cta_clicks_cta_idx",
    sql: `CREATE INDEX \`ca_cta_clicks_cta_idx\` ON \`ca_cta_clicks\` (\`cta\`, \`createdAt\`)`,
  },
  {
    table: "ca_cta_clicks",
    name: "ca_cta_clicks_created_idx",
    sql: `CREATE INDEX \`ca_cta_clicks_created_idx\` ON \`ca_cta_clicks\` (\`createdAt\`)`,
  },
];

async function indexExists(pool: any, table: string, name: string): Promise<boolean> {
  const [rows] = await pool.execute(
    `SELECT 1 FROM information_schema.STATISTICS
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND INDEX_NAME = ? LIMIT 1`,
    [table, name]
  );
  return (rows as any[]).length > 0;
}

export async function ensureAnalyticsTables(): Promise<void> {
  const pool = await getDbPool();
  if (!pool) {
    console.warn("[analytics-bootstrap] DB unavailable — skipping ensureAnalyticsTables");
    return;
  }

  try {
    await pool.query(DDL.diagnosticResponses);
    await pool.query(DDL.ctaClicks);

    for (const idx of INDEXES) {
      try {
        if (await indexExists(pool, idx.table, idx.name)) continue;
        await pool.query(idx.sql);
      } catch (err: any) {
        // Duplicate index errors are expected on re-runs; anything else we log.
        if (!/duplicate|exists/i.test(err?.message ?? "")) {
          console.warn(`[analytics-bootstrap] index ${idx.name} failed:`, err?.message);
        }
      }
    }
    console.log("[analytics-bootstrap] tables and indexes ensured");
  } catch (err: any) {
    console.error("[analytics-bootstrap] failed:", err?.message);
  }
}
