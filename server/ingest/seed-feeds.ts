/**
 * Seed / refresh ca_news_feeds from server/ingest/sources.ts.
 *
 * Idempotent: matches existing rows by URL. Updates name, category,
 * priority, language when the seed list changes; inserts new rows
 * otherwise. Existing rows that no longer appear in sources.ts are
 * left alone (they may be auto-deactivated by the ingestor on health).
 *
 * Two entry points:
 *   - CLI:  `pnpm news:seed-feeds`  (this file's main block)
 *   - HTTP: `POST /api/admin/seed-feeds`  (reuses seedFeeds() below)
 */
import { eq } from "drizzle-orm";
import { newsFeeds } from "../../drizzle/schema";
import { closeCliDb, getCliDb } from "../_core/dbClient";
import { SOURCES } from "./sources";

export interface SeedFeedsResult {
  inserted: number;
  updated: number;
  unchanged: number;
  total: number;
  details: { slug: string; action: "inserted" | "updated" | "unchanged"; category: string }[];
}

/**
 * Pure function callable from anywhere. Takes a Drizzle db instance so
 * the caller controls the lifecycle (CLI uses getCliDb + closeCliDb;
 * HTTP route uses the long-lived getDb pool).
 */
export async function seedFeeds(db: any): Promise<SeedFeedsResult> {
  const result: SeedFeedsResult = {
    inserted: 0,
    updated: 0,
    unchanged: 0,
    total: SOURCES.length,
    details: [],
  };

  for (const seed of SOURCES) {
    const existing = await db
      .select()
      .from(newsFeeds)
      .where(eq(newsFeeds.url, seed.feedUrl))
      .limit(1);

    if (existing.length === 0) {
      await db.insert(newsFeeds).values({
        name: seed.name,
        url: seed.feedUrl,
        category: seed.category,
        language: seed.language ?? "es",
        priority: seed.priority ?? 5,
        isActive: "true",
      });
      result.inserted++;
      result.details.push({ slug: seed.slug, action: "inserted", category: seed.category });
      continue;
    }

    const row = existing[0]!;
    const wantsUpdate =
      row.name !== seed.name ||
      row.category !== seed.category ||
      row.priority !== (seed.priority ?? 5) ||
      row.language !== (seed.language ?? "es");

    if (wantsUpdate) {
      await db
        .update(newsFeeds)
        .set({
          name: seed.name,
          category: seed.category,
          language: seed.language ?? "es",
          priority: seed.priority ?? 5,
        })
        .where(eq(newsFeeds.id, row.id));
      result.updated++;
      result.details.push({ slug: seed.slug, action: "updated", category: seed.category });
    } else {
      result.unchanged++;
      result.details.push({ slug: seed.slug, action: "unchanged", category: seed.category });
    }
  }

  return result;
}

// ─── CLI entry point ──────────────────────────────────────────────────
async function runCli() {
  const db = getCliDb();
  const r = await seedFeeds(db);
  for (const d of r.details) {
    const mark = d.action === "inserted" ? "+" : d.action === "updated" ? "~" : " ";
    console.log(`  ${mark} ${d.action.padEnd(9)} ${d.slug.padEnd(28)} [${d.category}]`);
  }
  console.log(
    `\nDone. inserted=${r.inserted}  updated=${r.updated}  unchanged=${r.unchanged}  total=${r.total}`
  );
}

// Only run the CLI body when this file is the entry point (not when
// imported by the admin route). Tsx passes the absolute path of the
// script as process.argv[1], which ends with "seed-feeds.ts".
if (process.argv[1] && process.argv[1].endsWith("seed-feeds.ts")) {
  runCli()
    .catch((err) => {
      console.error("seed-feeds failed:", err);
      process.exitCode = 1;
    })
    .finally(async () => {
      await closeCliDb();
      process.exit(process.exitCode ?? 0);
    });
}
