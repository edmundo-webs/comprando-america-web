/**
 * Seed / refresh ca_news_feeds from server/ingest/sources.ts.
 *
 * Idempotent: matches existing rows by URL. Updates name, category,
 * priority, language, isActive when the seed list changes; inserts
 * new rows otherwise.
 *
 * Usage:  pnpm news:seed-feeds
 */
import { eq } from "drizzle-orm";
import { newsFeeds } from "../../drizzle/schema";
import { closeCliDb, getCliDb } from "../_core/dbClient";
import { SOURCES } from "./sources";

async function run() {
  const db = getCliDb();
  let inserted = 0;
  let updated = 0;
  let unchanged = 0;

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
      inserted++;
      console.log(`  + inserted  ${seed.slug.padEnd(28)}  [${seed.category}]`);
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
      updated++;
      console.log(`  ~ updated   ${seed.slug.padEnd(28)}  [${seed.category}]`);
    } else {
      unchanged++;
    }
  }

  console.log(
    `\nDone. inserted=${inserted}  updated=${updated}  unchanged=${unchanged}  total=${SOURCES.length}`
  );
}

run()
  .catch((err) => {
    console.error("seed-feeds failed:", err);
    process.exitCode = 1;
  })
  .finally(() => closeCliDb());
