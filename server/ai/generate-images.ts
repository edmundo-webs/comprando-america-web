/**
 * Image generation pass for drafted articles.
 *
 * Picks drafts whose heroImagePrompt is set but imageUrl is not yet a CDN
 * URL, runs Pexels (free) → Gemini (paid) fallback, uploads the result to
 * Cloudinary via storagePut(), and writes the secure CDN URL to imageUrl.
 *
 * Usage:
 *   pnpm news:images           # process up to BATCH_SIZE drafts
 *   pnpm news:images --id 42   # single article
 */
import { and, asc, eq, isNotNull } from "drizzle-orm";
import { newsArticles } from "../../drizzle/schema";
import { closeCliDb, getCliDb } from "../_core/dbClient";
import { storagePut } from "../storage";
import { getHeroImage } from "./image-source";

const BATCH_SIZE = 8;
const DELAY_MS = 2000;

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function uploadHero(base64: string, articleId: number, mimeType: string): Promise<string> {
  const ext = mimeType.includes("png") ? "png" : "jpg";
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

  // Pick drafts that have a prompt but no CDN URL yet.
  // Cloudinary URLs always start with https://res.cloudinary.com — anything
  // else (raw RSS image URL or null) means we still owe a generated hero.
  const rows = singleId
    ? await db.select().from(newsArticles).where(eq(newsArticles.id, singleId)).limit(1)
    : await db
        .select()
        .from(newsArticles)
        .where(
          and(
            eq(newsArticles.status, "draft"),
            isNotNull(newsArticles.heroImagePrompt)
          )
        )
        .orderBy(asc(newsArticles.id))
        .limit(BATCH_SIZE);
  // Note: rows where imageUrl is already a Cloudinary CDN URL are filtered
  // out inside the loop (cheap), so we don't bother adding a NOT LIKE here.

  if (rows.length === 0) {
    console.log("No drafts need image generation.");
    return;
  }

  console.log(`Generating hero images for ${rows.length} article(s)…\n`);
  let generated = 0;

  for (const row of rows) {
    const label = `[${row.id}] ${(row.title ?? "").slice(0, 50)}`;
    const prompt = row.heroImagePrompt ?? "";

    // Skip if imageUrl already points to Cloudinary (already done).
    if (row.imageUrl && row.imageUrl.includes("res.cloudinary.com")) {
      console.log(`  ⏭ ${label}  already on Cloudinary`);
      continue;
    }

    if (!prompt) {
      console.log(`  ⏭ ${label}  no prompt`);
      continue;
    }

    try {
      console.log(`  ⏳ ${label}`);
      const result = await getHeroImage(prompt);
      const mime = result.source === "pexels" ? "image/jpeg" : "image/png";
      const cdnUrl = await uploadHero(result.base64, row.id, mime);

      await db.update(newsArticles).set({ imageUrl: cdnUrl }).where(eq(newsArticles.id, row.id));

      generated++;
      console.log(`  ✔ ${label} → ${cdnUrl}  (${result.source})`);
    } catch (err: any) {
      console.error(`  ✘ ${label}  ERROR: ${err.message}`);
    }

    await sleep(DELAY_MS);
  }

  console.log(`\nDone. Images generated: ${generated}`);
}

run()
  .catch((err) => {
    console.error("Image generation failed:", err);
    process.exitCode = 1;
  })
  .finally(() => closeCliDb());
