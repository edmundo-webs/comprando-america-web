/**
 * Idempotent runner for drizzle/0006_news_publishing_pipeline.sql.
 *
 * Why a custom runner instead of `pnpm drizzle-kit migrate`?
 *   The repo carries historical drift between schema.ts and the snapshot
 *   meta files (see Fase 0 commit). drizzle-kit migrate would happily try
 *   to apply the SQL but might also surface that drift; this runner stays
 *   focused on just the columns/tables this migration introduces, and
 *   is safe to re-run because it checks INFORMATION_SCHEMA before each
 *   ALTER / CREATE.
 *
 * Usage:  pnpm tsx scripts/apply-migration-0006.ts
 *         pnpm tsx scripts/apply-migration-0006.ts --dry      # plan only
 *
 * Reads DATABASE_URL from the environment.
 */
import "dotenv/config";
import mysql from "mysql2/promise";

const ARTICLES_TABLE_CANDIDATES = ["ca_news_articles", "news_articles"];
const FEEDS_TABLE_CANDIDATES = ["ca_news_feeds", "news_feeds"];

async function detectTable(conn: mysql.Pool, schema: string, candidates: string[]): Promise<string | null> {
  for (const t of candidates) {
    const [rows] = await conn.query(
      `SELECT 1 FROM information_schema.TABLES WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? LIMIT 1`,
      [schema, t]
    );
    if ((rows as any[]).length > 0) return t;
  }
  return null;
}

async function columnExists(conn: mysql.Pool, schema: string, table: string, column: string): Promise<boolean> {
  const [rows] = await conn.query(
    `SELECT 1 FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND COLUMN_NAME = ? LIMIT 1`,
    [schema, table, column]
  );
  return (rows as any[]).length > 0;
}

async function tableExists(conn: mysql.Pool, schema: string, table: string): Promise<boolean> {
  const [rows] = await conn.query(
    `SELECT 1 FROM information_schema.TABLES WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? LIMIT 1`,
    [schema, table]
  );
  return (rows as any[]).length > 0;
}

async function indexExists(conn: mysql.Pool, schema: string, table: string, index: string): Promise<boolean> {
  const [rows] = await conn.query(
    `SELECT 1 FROM information_schema.STATISTICS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND INDEX_NAME = ? LIMIT 1`,
    [schema, table, index]
  );
  return (rows as any[]).length > 0;
}

async function exec(conn: mysql.Pool, sql: string, dryRun: boolean) {
  if (dryRun) {
    console.log("  [dry] " + sql);
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

    const articlesTable = await detectTable(pool, db, ARTICLES_TABLE_CANDIDATES);
    const feedsTable = await detectTable(pool, db, FEEDS_TABLE_CANDIDATES);

    if (!articlesTable) {
      throw new Error(`Could not find news articles table (looked for ${ARTICLES_TABLE_CANDIDATES.join(", ")})`);
    }
    if (!feedsTable) {
      throw new Error(`Could not find news feeds table (looked for ${FEEDS_TABLE_CANDIDATES.join(", ")})`);
    }

    console.log(`Detected tables:`);
    console.log(`  articles → ${articlesTable}`);
    console.log(`  feeds    → ${feedsTable}\n`);

    const drift = articlesTable !== "ca_news_articles" || feedsTable !== "ca_news_feeds";
    if (drift) {
      console.log("⚠  Table names differ from drizzle/schema.ts (which expects ca_*).");
      console.log("⚠  Applying ALTERs to the *actual* names. After this migration is");
      console.log("⚠  applied you'll still need to either rename to ca_* or update");
      console.log("⚠  schema.ts to match — otherwise runtime queries will fail.\n");
    }

    // ─────────── ca_news_articles columns ───────────
    type ColSpec = { name: string; sql: string };
    const articleColumns: ColSpec[] = [
      { name: "status", sql: `ALTER TABLE \`${articlesTable}\` ADD \`status\` enum('candidate','draft','approved','published','rejected','archived') NOT NULL DEFAULT 'published'` },
      { name: "relevanceScore", sql: `ALTER TABLE \`${articlesTable}\` ADD \`relevanceScore\` tinyint` },
      { name: "rejectionReason", sql: `ALTER TABLE \`${articlesTable}\` ADD \`rejectionReason\` varchar(256)` },
      { name: "rawTitle", sql: `ALTER TABLE \`${articlesTable}\` ADD \`rawTitle\` text` },
      { name: "rawSummary", sql: `ALTER TABLE \`${articlesTable}\` ADD \`rawSummary\` text` },
      { name: "rawContent", sql: `ALTER TABLE \`${articlesTable}\` ADD \`rawContent\` text` },
      { name: "rawAuthor", sql: `ALTER TABLE \`${articlesTable}\` ADD \`rawAuthor\` varchar(256)` },
      { name: "rawImageUrl", sql: `ALTER TABLE \`${articlesTable}\` ADD \`rawImageUrl\` varchar(1024)` },
      { name: "externalHash", sql: `ALTER TABLE \`${articlesTable}\` ADD \`externalHash\` varchar(64)` },
      { name: "feedId", sql: `ALTER TABLE \`${articlesTable}\` ADD \`feedId\` int` },
      { name: "heroImagePrompt", sql: `ALTER TABLE \`${articlesTable}\` ADD \`heroImagePrompt\` text` },
      { name: "tags", sql: `ALTER TABLE \`${articlesTable}\` ADD \`tags\` text` },
      { name: "publishedAtInternal", sql: `ALTER TABLE \`${articlesTable}\` ADD \`publishedAtInternal\` timestamp NULL` },
      { name: "draftedAt", sql: `ALTER TABLE \`${articlesTable}\` ADD \`draftedAt\` timestamp NULL` },
      { name: "approvedAt", sql: `ALTER TABLE \`${articlesTable}\` ADD \`approvedAt\` timestamp NULL` },
    ];

    console.log(`Adding columns to ${articlesTable}…`);
    for (const c of articleColumns) {
      if (await columnExists(pool, db, articlesTable, c.name)) {
        console.log(`  ⏭ column ${c.name} already exists`);
      } else {
        await exec(pool, c.sql, dryRun);
      }
    }

    // unique index on externalHash
    const externalHashIdx = `${articlesTable === "ca_news_articles" ? "ca_news_articles" : "news_articles"}_externalHash_unique`;
    if (await indexExists(pool, db, articlesTable, externalHashIdx)) {
      console.log(`  ⏭ unique index ${externalHashIdx} already exists`);
    } else if (await columnExists(pool, db, articlesTable, "externalHash")) {
      await exec(
        pool,
        `ALTER TABLE \`${articlesTable}\` ADD CONSTRAINT \`${externalHashIdx}\` UNIQUE(\`externalHash\`)`,
        dryRun
      );
    }

    // workflow query indexes
    const workflowIndexes: { name: string; sql: string }[] = [
      { name: `${articlesTable}_status_idx`, sql: `CREATE INDEX \`${articlesTable}_status_idx\` ON \`${articlesTable}\` (\`status\`)` },
      { name: `${articlesTable}_cat_status_idx`, sql: `CREATE INDEX \`${articlesTable}_cat_status_idx\` ON \`${articlesTable}\` (\`category\`, \`status\`)` },
      { name: `${articlesTable}_published_internal_idx`, sql: `CREATE INDEX \`${articlesTable}_published_internal_idx\` ON \`${articlesTable}\` (\`publishedAtInternal\`)` },
    ];
    for (const ix of workflowIndexes) {
      if (await indexExists(pool, db, articlesTable, ix.name)) {
        console.log(`  ⏭ index ${ix.name} already exists`);
      } else {
        await exec(pool, ix.sql, dryRun);
      }
    }

    // ─────────── ca_news_feeds columns ───────────
    const feedColumns: ColSpec[] = [
      { name: "language", sql: `ALTER TABLE \`${feedsTable}\` ADD \`language\` enum('es','en') NOT NULL DEFAULT 'es'` },
      { name: "priority", sql: `ALTER TABLE \`${feedsTable}\` ADD \`priority\` tinyint NOT NULL DEFAULT 5` },
      { name: "isActive", sql: `ALTER TABLE \`${feedsTable}\` ADD \`isActive\` varchar(5) NOT NULL DEFAULT 'true'` },
      { name: "lastFetchedAt", sql: `ALTER TABLE \`${feedsTable}\` ADD \`lastFetchedAt\` timestamp NULL` },
      { name: "lastError", sql: `ALTER TABLE \`${feedsTable}\` ADD \`lastError\` text` },
      { name: "consecutiveFailures", sql: `ALTER TABLE \`${feedsTable}\` ADD \`consecutiveFailures\` int NOT NULL DEFAULT 0` },
      { name: "updatedAt", sql: `ALTER TABLE \`${feedsTable}\` ADD \`updatedAt\` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP` },
    ];

    console.log(`\nAdding columns to ${feedsTable}…`);
    for (const c of feedColumns) {
      if (await columnExists(pool, db, feedsTable, c.name)) {
        console.log(`  ⏭ column ${c.name} already exists`);
      } else {
        await exec(pool, c.sql, dryRun);
      }
    }

    // ─────────── ca_social_posts ───────────
    const socialTable = "ca_social_posts";
    console.log(`\nCreating ${socialTable}…`);
    if (await tableExists(pool, db, socialTable)) {
      console.log(`  ⏭ table ${socialTable} already exists`);
    } else {
      await exec(
        pool,
        `CREATE TABLE \`${socialTable}\` (
          \`id\` int AUTO_INCREMENT NOT NULL,
          \`articleId\` int,
          \`network\` enum('facebook','instagram','tiktok','linkedin','threads','x','youtube') NOT NULL,
          \`postType\` enum('carousel','reel','short','post','story') NOT NULL,
          \`language\` enum('es','en') NOT NULL DEFAULT 'es',
          \`caption\` text,
          \`mediaUrls\` text,
          \`metricoolId\` varchar(128),
          \`scheduledAt\` timestamp NULL,
          \`postedAt\` timestamp NULL,
          \`status\` enum('queued','scheduled','posted','failed') NOT NULL DEFAULT 'queued',
          \`error\` text,
          \`createdAt\` timestamp NOT NULL DEFAULT (now()),
          \`updatedAt\` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
          CONSTRAINT \`${socialTable}_id\` PRIMARY KEY(\`id\`)
        )`,
        dryRun
      );
      if (!dryRun) {
        await exec(pool, `CREATE INDEX \`${socialTable}_article_idx\` ON \`${socialTable}\` (\`articleId\`)`, dryRun);
        await exec(pool, `CREATE INDEX \`${socialTable}_status_idx\` ON \`${socialTable}\` (\`status\`)`, dryRun);
      }
    }

    // ─────────── ca_ingestion_runs ───────────
    const runsTable = "ca_ingestion_runs";
    console.log(`\nCreating ${runsTable}…`);
    if (await tableExists(pool, db, runsTable)) {
      console.log(`  ⏭ table ${runsTable} already exists`);
    } else {
      await exec(
        pool,
        `CREATE TABLE \`${runsTable}\` (
          \`id\` int AUTO_INCREMENT NOT NULL,
          \`feedId\` int,
          \`startedAt\` timestamp NOT NULL DEFAULT (now()),
          \`finishedAt\` timestamp NULL,
          \`itemsFound\` int NOT NULL DEFAULT 0,
          \`itemsNew\` int NOT NULL DEFAULT 0,
          \`itemsSkipped\` int NOT NULL DEFAULT 0,
          \`error\` text,
          CONSTRAINT \`${runsTable}_id\` PRIMARY KEY(\`id\`)
        )`,
        dryRun
      );
      if (!dryRun) {
        await exec(pool, `CREATE INDEX \`${runsTable}_feed_idx\` ON \`${runsTable}\` (\`feedId\`, \`startedAt\`)`, dryRun);
      }
    }

    console.log(`\n${dryRun ? "Dry run complete." : "Migration applied."}`);
  } finally {
    await pool.end();
  }
}

main().catch((err) => {
  console.error("\nMigration failed:", err.message);
  process.exit(1);
});
