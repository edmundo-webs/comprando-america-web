/**
 * Auto-publish: promotes top-scoring drafts to `status='published'` while
 * enforcing two rules:
 *
 *   1. Daily cap of 4 articles total.
 *   2. 4-of-5 category rotation — each calendar day "rests" one category
 *      so we publish across all 5 over a 5-day cycle.
 *
 * Rotation table (resting category by epoch-day mod 5):
 *   day%5=0  → rests inversiones      (visas, economía, bienes, llc)
 *   day%5=1  → rests visas-migracion  (economía, bienes, llc, inversiones)
 *   day%5=2  → rests economia-finanzas (bienes, llc, inversiones, visas)
 *   day%5=3  → rests bienes-raices    (llc, inversiones, visas, economía)
 *   day%5=4  → rests llc-negocios     (inversiones, visas, economía, bienes)
 *
 * Each cron tick (4×/day) tries to publish 1 article. Within the day's
 * 4 active categories, we round-robin: pick the top-scoring draft from
 * the under-represented category first, breaking ties by relevance score
 * then by id.
 *
 * Published timestamp is staggered across a 30-minute window per tick so
 * the portal looks organic instead of dropping articles all at once.
 *
 * Usage: pnpm news:auto-publish
 */
import { and, eq, gte } from "drizzle-orm";
import { newsArticles } from "../../drizzle/schema";
import { closeCliDb, getCliDb } from "../_core/dbClient";

const DAILY_CAP = 4;
const PER_RUN_CAP = 1;
const RUN_SPREAD_MINUTES = 30;

const CATEGORIES = [
  "visas-migracion",
  "economia-finanzas",
  "bienes-raices",
  "llc-negocios",
  "inversiones",
] as const;
type Category = (typeof CATEGORIES)[number];

function epochDay(d: Date = new Date()): number {
  // Days since 1970-01-01 UTC. Stable across timezones because we round
  // toward the nearest day at UTC.
  return Math.floor(d.getTime() / 86_400_000);
}

function getRestingCategory(d: Date = new Date()): Category {
  return CATEGORIES[epochDay(d) % CATEGORIES.length]!;
}

function startOfTodayUtc(): Date {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}

async function run() {
  const db = getCliDb();
  const todayStart = startOfTodayUtc();
  const restingCategory = getRestingCategory();
  const activeCategories = CATEGORIES.filter((c) => c !== restingCategory);

  // 1. How many have we published today?
  const todayRows = await db
    .select({ category: newsArticles.category })
    .from(newsArticles)
    .where(
      and(
        eq(newsArticles.status, "published"),
        gte(newsArticles.publishedAtInternal, todayStart)
      )
    );
  const todayCount = todayRows.length;
  const remainingToday = Math.max(0, DAILY_CAP - todayCount);

  console.log(
    `Today: ${todayCount}/${DAILY_CAP} published. Resting category today: ${restingCategory}.`
  );

  if (remainingToday === 0) {
    console.log("Daily cap reached. Skipping.");
    return;
  }

  const toPublish = Math.min(PER_RUN_CAP, remainingToday);

  // 2. Count today's published per category (for balancing).
  const countByCat: Record<string, number> = {};
  for (const r of todayRows) countByCat[r.category as string] = (countByCat[r.category as string] || 0) + 1;

  // 3. Fetch all drafts that have a real CDN image (no point publishing
  //    something with the raw RSS image still attached).
  const drafts = await db
    .select({
      id: newsArticles.id,
      category: newsArticles.category,
      relevanceScore: newsArticles.relevanceScore,
      imageUrl: newsArticles.imageUrl,
    })
    .from(newsArticles)
    .where(eq(newsArticles.status, "draft"));

  // Only publish drafts that already have a Cloudinary CDN image — never
  // promote an article with the raw RSS source's hotlinked image (those
  // expire / get blocked / serve different sizes per visitor).
  const ready = drafts.filter(
    (d) => activeCategories.includes(d.category as Category) && (d.imageUrl ?? "").includes("res.cloudinary.com")
  );

  if (ready.length === 0) {
    console.log("No publishable drafts in active categories.");
    return;
  }

  // 4. Rank: under-represented category first, then highest score, then oldest id.
  ready.sort((a, b) => {
    const aTodayCount = countByCat[a.category as string] || 0;
    const bTodayCount = countByCat[b.category as string] || 0;
    if (aTodayCount !== bTodayCount) return aTodayCount - bTodayCount;
    const aScore = a.relevanceScore ?? 0;
    const bScore = b.relevanceScore ?? 0;
    if (aScore !== bScore) return bScore - aScore;
    return a.id - b.id;
  });

  const picks = ready.slice(0, toPublish);
  let affected = 0;

  // 5. Stagger publishedAtInternal so multiple articles don't drop on the
  //    same second when a single tick happens to publish > 1.
  const gapMin = Math.max(1, Math.floor(RUN_SPREAD_MINUTES / picks.length));

  for (let i = 0; i < picks.length; i++) {
    const pick = picks[i]!;
    const offsetMinutes = i * gapMin + Math.floor(Math.random() * Math.min(gapMin, 5));
    const publishAt = new Date(Date.now() + offsetMinutes * 60_000);

    await db
      .update(newsArticles)
      .set({
        status: "published",
        approvedAt: new Date(),
        publishedAtInternal: publishAt,
      })
      .where(eq(newsArticles.id, pick.id));
    affected++;
    console.log(
      `  ✔ Published [${pick.id}] cat=${pick.category} score=${pick.relevanceScore} at +${offsetMinutes}min`
    );
  }

  console.log(`\nDone. Published ${affected}. Today total: ${todayCount + affected}/${DAILY_CAP}`);
}

run()
  .catch((err) => {
    console.error("Auto-publish failed:", err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await closeCliDb();
    process.exit(process.exitCode ?? 0);
  });

