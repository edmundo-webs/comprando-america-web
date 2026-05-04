/**
 * RSS/Atom ingestion worker for the Comprando América news pipeline.
 *
 * For each active feed:
 *   1. Fetches & parses (rss-parser).
 *   2. Dedupes each item by sha256(externalUrl).
 *   3. Inserts new items as `ca_news_articles.status = 'candidate'`.
 *   4. Records an `ca_ingestion_runs` row for observability.
 *
 * A feed that errors 5 times in a row is auto-deactivated (isActive='false').
 *
 * Usage:
 *   pnpm news:ingest                  # all active feeds
 *   pnpm news:ingest <feed-name>      # only feeds whose name LIKE %<x>%
 */
import crypto from "node:crypto";
import { and, desc, eq, like } from "drizzle-orm";
import Parser from "rss-parser";
import {
  ingestionRuns,
  newsArticles,
  newsFeeds,
  type NewsFeed,
} from "../../drizzle/schema";
import { closeCliDb, getCliDb } from "../_core/dbClient";

const MAX_CONSECUTIVE_FAILURES = 5;
const FETCH_TIMEOUT_MS = 20_000;
const USER_AGENT =
  "ComprandoAmericaBot/1.0 (+https://comprandoamerica.com/news)";

const parser = new Parser({
  timeout: FETCH_TIMEOUT_MS,
  headers: {
    "User-Agent": USER_AGENT,
    Accept:
      "application/rss+xml, application/atom+xml, application/xml;q=0.9, */*;q=0.8",
  },
  customFields: {
    item: [
      ["media:content", "mediaContent"],
      ["media:thumbnail", "mediaThumbnail"],
      ["enclosure", "enclosure"],
      ["content:encoded", "contentEncoded"],
    ],
  },
});

function hashUrl(url: string): string {
  return crypto.createHash("sha256").update(url.trim().toLowerCase()).digest("hex");
}

function pickImage(item: any): string | null {
  if (item.enclosure?.url && typeof item.enclosure.url === "string") return item.enclosure.url;
  if (item.mediaContent?.$?.url) return item.mediaContent.$.url;
  if (item.mediaContent?.url) return item.mediaContent.url;
  if (item.mediaThumbnail?.$?.url) return item.mediaThumbnail.$.url;
  if (item.mediaThumbnail?.url) return item.mediaThumbnail.url;
  const html: string = item.contentEncoded || item.content || "";
  const m = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  return m ? m[1] : null;
}

function pickSummary(item: any): string {
  const raw: string = item.contentSnippet || item.summary || item.content || "";
  return raw.replace(/\s+/g, " ").trim().slice(0, 2000);
}

function pickContent(item: any): string {
  return (item.contentEncoded || item.content || "").slice(0, 65_000);
}

function parsePubDate(item: any): Date {
  const raw = item.isoDate || item.pubDate || item.published;
  if (raw) {
    const d = new Date(raw);
    if (!isNaN(d.getTime())) return d;
  }
  return new Date();
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 200);
}

interface IngestResult {
  found: number;
  inserted: number;
  skipped: number;
  error: string | null;
}

async function ingestFeed(feed: NewsFeed): Promise<IngestResult> {
  const db = getCliDb();
  const feedName = feed.name ?? `feed#${feed.id}`;
  const feedUrl = feed.url ?? "";

  let parsed: Parser.Output<any>;
  try {
    parsed = await parser.parseURL(feedUrl);
  } catch (err: any) {
    return { found: 0, inserted: 0, skipped: 0, error: err.message || String(err) };
  }

  const items = parsed.items || [];
  let inserted = 0;
  let skipped = 0;

  for (const item of items) {
    const url = (item.link || "").trim();
    if (!url) {
      skipped++;
      continue;
    }
    const hash = hashUrl(url);
    const title = (item.title || "").trim().slice(0, 480);
    if (!title) {
      skipped++;
      continue;
    }

    // Dedup probe by externalHash (covers re-runs for the same item)
    const existing = await db
      .select({ id: newsArticles.id })
      .from(newsArticles)
      .where(eq(newsArticles.externalHash, hash))
      .limit(1);
    if (existing.length > 0) {
      skipped++;
      continue;
    }

    const slug = `${slugify(title)}-${Date.now()}-${Math.floor(Math.random() * 10_000)}`;

    try {
      await db.insert(newsArticles).values({
        title,
        slug,
        description: pickSummary(item) || null,
        content: pickContent(item) || null,
        url: url.slice(0, 1000),
        source: feedName,
        category: feed.category as any,
        imageUrl: pickImage(item) ?? null,
        status: "candidate",
        rawTitle: title,
        rawSummary: pickSummary(item) || null,
        rawContent: pickContent(item) || null,
        rawAuthor: ((item.creator || (item as any).author || "") as string).slice(0, 256) || null,
        rawImageUrl: pickImage(item) ?? null,
        externalHash: hash,
        feedId: feed.id,
        publishedAt: parsePubDate(item),
      });
      inserted++;
    } catch (err: any) {
      // Most likely a unique-constraint race; just count as skipped.
      skipped++;
      const msg = err?.message || String(err);
      if (!/duplicate/i.test(msg)) {
        console.error(`[${feedName}] insert error for ${url}: ${msg}`);
      }
    }
  }

  return { found: items.length, inserted, skipped, error: null };
}

async function run(filter?: string) {
  const db = getCliDb();

  const baseConditions = [eq(newsFeeds.isActive, "true")];
  if (filter) baseConditions.push(like(newsFeeds.name, `%${filter}%`));

  const feeds = await db
    .select()
    .from(newsFeeds)
    .where(and(...baseConditions))
    .orderBy(desc(newsFeeds.priority));

  if (feeds.length === 0) {
    console.log(filter ? `No active feed matches "${filter}".` : "No active feeds.");
    return;
  }

  console.log(`Ingesting ${feeds.length} feed(s)…\n`);
  let totalInserted = 0;

  for (const feed of feeds) {
    const [{ insertId: runIdRaw }] = (await db.insert(ingestionRuns).values({
      feedId: feed.id,
    })) as any;
    const runId = Number(runIdRaw);

    const result = await ingestFeed(feed);
    totalInserted += result.inserted;

    await db
      .update(ingestionRuns)
      .set({
        finishedAt: new Date(),
        itemsFound: result.found,
        itemsNew: result.inserted,
        itemsSkipped: result.skipped,
        error: result.error,
      })
      .where(eq(ingestionRuns.id, runId));

    if (result.error) {
      const failures = (feed.consecutiveFailures ?? 0) + 1;
      const deactivate = failures >= MAX_CONSECUTIVE_FAILURES;
      await db
        .update(newsFeeds)
        .set({
          lastFetchedAt: new Date(),
          lastError: result.error.slice(0, 1000),
          consecutiveFailures: failures,
          isActive: deactivate ? "false" : feed.isActive,
        })
        .where(eq(newsFeeds.id, feed.id));
      console.log(
        `✘ ${(feed.name ?? `feed#${feed.id}`).padEnd(32)} ERROR: ${result.error}${deactivate ? " [deactivated]" : ` [${failures}/${MAX_CONSECUTIVE_FAILURES}]`}`
      );
    } else {
      await db
        .update(newsFeeds)
        .set({
          lastFetchedAt: new Date(),
          lastError: null,
          consecutiveFailures: 0,
        })
        .where(eq(newsFeeds.id, feed.id));
      console.log(
        `✔ ${(feed.name ?? `feed#${feed.id}`).padEnd(32)} found=${result.found}  new=${result.inserted}  skipped=${result.skipped}`
      );
    }
  }

  console.log(`\nDone. Total new candidates: ${totalInserted}`);
}

const filter = process.argv[2];
run(filter)
  .catch((err) => {
    console.error("Ingestion failed:", err);
    process.exitCode = 1;
  })
  .finally(() => closeCliDb());
