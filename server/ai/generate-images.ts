/**
 * Hero image resolver for drafted articles. Free-source cascade:
 *
 *   1. rawImageUrl  — captured from the RSS item during ingest
 *   2. og:image     — fetched from the source page <meta>
 *   3. Pexels       — stock photo search using the article title
 *
 * The chosen source is downloaded and re-uploaded to Cloudinary so the
 * portal serves a stable CDN URL we control. No paid AI image generation
 * (no Gemini Imagen / DALL-E) — that path is only reachable from ad-hoc
 * tooling now.
 *
 * Usage:
 *   pnpm news:images           # process up to BATCH_SIZE drafts
 *   pnpm news:images --id 42   # single article
 */
import { and, asc, eq, isNotNull } from "drizzle-orm";
import { newsArticles } from "../../drizzle/schema";
import { closeCliDb, getCliDb } from "../_core/dbClient";
import { storagePut } from "../storage";
import { getPexelsHeroBase64 } from "./pexels";

const BATCH_SIZE = 8;
const DELAY_MS = 1500;
const OG_FETCH_TIMEOUT_MS = 8000;
const USER_AGENT =
  "ComprandoAmericaBot/1.0 (+https://comprandoamerica.com/news)";

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

/**
 * Best-effort fetch of og:image from the source HTML.
 * Returns the absolute URL or null on any failure (timeout, 4xx, no tag).
 */
async function fetchOgImage(pageUrl: string): Promise<string | null> {
  try {
    const res = await fetch(pageUrl, {
      headers: { "User-Agent": USER_AGENT, Accept: "text/html,*/*;q=0.8" },
      signal: AbortSignal.timeout(OG_FETCH_TIMEOUT_MS),
      redirect: "follow",
    });
    if (!res.ok) return null;
    const ctype = res.headers.get("content-type") || "";
    if (!ctype.toLowerCase().includes("html")) return null;
    const html = (await res.text()).slice(0, 200_000); // first 200KB is plenty for <head>

    // Try og:image first, then twitter:image as a backup. Order is content/property agnostic.
    const candidates = [
      /<meta\s+(?:property|name)=["']og:image(?::secure_url)?["']\s+content=["']([^"']+)["']/i,
      /<meta\s+content=["']([^"']+)["']\s+(?:property|name)=["']og:image(?::secure_url)?["']/i,
      /<meta\s+(?:property|name)=["']twitter:image["']\s+content=["']([^"']+)["']/i,
    ];
    for (const re of candidates) {
      const m = html.match(re);
      if (m?.[1]) {
        return absolutize(m[1].trim(), pageUrl);
      }
    }
    return null;
  } catch {
    return null;
  }
}

function absolutize(maybeRelative: string, base: string): string {
  try {
    return new URL(maybeRelative, base).toString();
  } catch {
    return maybeRelative;
  }
}

async function downloadAsBase64(url: string): Promise<{ base64: string; mimeType: string } | null> {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": USER_AGENT },
      signal: AbortSignal.timeout(OG_FETCH_TIMEOUT_MS),
      redirect: "follow",
    });
    if (!res.ok) return null;
    const ctype = (res.headers.get("content-type") || "image/jpeg").split(";")[0]!.trim();
    if (!ctype.startsWith("image/")) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < 1024) return null; // too tiny to be a real hero image
    return { base64: buf.toString("base64"), mimeType: ctype };
  } catch {
    return null;
  }
}

interface ResolvedImage {
  base64: string;
  mimeType: string;
  source: "raw-feed" | "og-image" | "pexels";
}

async function resolveHeroImage(row: {
  id: number;
  title: string | null;
  rawImageUrl: string | null;
  url: string | null;
}): Promise<ResolvedImage | null> {
  // 1) Raw RSS image — already discovered during ingest
  if (row.rawImageUrl) {
    const downloaded = await downloadAsBase64(row.rawImageUrl);
    if (downloaded) {
      return { ...downloaded, source: "raw-feed" };
    }
  }

  // 2) og:image from the source page
  if (row.url) {
    const ogUrl = await fetchOgImage(row.url);
    if (ogUrl) {
      const downloaded = await downloadAsBase64(ogUrl);
      if (downloaded) {
        return { ...downloaded, source: "og-image" };
      }
    }
  }

  // 3) Pexels search by title
  if (row.title) {
    const result = await getPexelsHeroBase64(row.title);
    if (result) {
      return { base64: result.base64, mimeType: "image/jpeg", source: "pexels" };
    }
  }

  return null;
}

async function uploadHero(base64: string, articleId: number, mimeType: string): Promise<string> {
  const ext = mimeType.includes("png") ? "png" : mimeType.includes("webp") ? "webp" : "jpg";
  const key = `comprando-america/news/article-${articleId}.${ext}`;
  const buffer = Buffer.from(base64, "base64");
  const result = await storagePut(key, buffer, mimeType);
  return result.url;
}

async function run() {
  const args = process.argv.slice(2);
  const idIdx = args.indexOf("--id");
  const singleId = idIdx >= 0 ? parseInt(args[idIdx + 1] ?? "", 10) : null;

  const db = getCliDb();

  // Pick drafts that don't already have a Cloudinary CDN URL.
  // We filter inside the loop (cheap) so the SQL stays simple.
  const rows = singleId
    ? await db.select().from(newsArticles).where(eq(newsArticles.id, singleId)).limit(1)
    : await db
        .select()
        .from(newsArticles)
        .where(and(eq(newsArticles.status, "draft"), isNotNull(newsArticles.title)))
        .orderBy(asc(newsArticles.id))
        .limit(BATCH_SIZE);

  if (rows.length === 0) {
    console.log("No drafts need image resolution.");
    return;
  }

  console.log(`Resolving hero images for ${rows.length} article(s)…\n`);
  let resolved = 0;
  let failed = 0;

  for (const row of rows) {
    const label = `[${row.id}] ${(row.title ?? "").slice(0, 50)}`;

    if (row.imageUrl && row.imageUrl.includes("res.cloudinary.com")) {
      console.log(`  ⏭ ${label}  already on Cloudinary`);
      continue;
    }

    try {
      const result = await resolveHeroImage({
        id: row.id,
        title: row.title,
        rawImageUrl: row.rawImageUrl,
        url: row.url,
      });

      if (!result) {
        failed++;
        console.warn(`  ✘ ${label}  no image source found`);
        continue;
      }

      const cdnUrl = await uploadHero(result.base64, row.id, result.mimeType);
      await db.update(newsArticles).set({ imageUrl: cdnUrl }).where(eq(newsArticles.id, row.id));
      resolved++;
      console.log(`  ✔ ${label}  (${result.source}) → ${cdnUrl}`);
    } catch (err: any) {
      failed++;
      console.error(`  ✘ ${label}  ERROR: ${err.message}`);
    }

    await sleep(DELAY_MS);
  }

  console.log(`\nDone. Resolved: ${resolved}  Failed: ${failed}`);
}

run()
  .catch((err) => {
    console.error("Image resolution failed:", err);
    process.exitCode = 1;
  })
  .finally(() => closeCliDb());
