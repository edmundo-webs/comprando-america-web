/**
 * AI rewrite pipeline (Fase 1, pass 2 of the Comprando América news flow).
 *
 * Two-pass per candidate article:
 *   Pass 1 — RELEVANCE: score 1-10 + best category + cta target + tags.
 *            Articles scoring below MIN_RELEVANCE are auto-rejected.
 *   Pass 2 — REWRITE: full Spanish editorial body + image prompt.
 *            Result lands as `status='draft'`, ready for image generation.
 *
 * Usage:
 *   pnpm news:rewrite              # process up to BATCH_SIZE candidates
 *   pnpm news:rewrite --dry        # relevance pass only
 *   pnpm news:rewrite --id 42      # single article
 */
import { desc, eq } from "drizzle-orm";
import { newsArticles, newsFeeds } from "../../drizzle/schema";
import { closeCliDb, getCliDb } from "../_core/dbClient";
import { geminiGenerate } from "./gemini";
import {
  SYSTEM_RELEVANCE,
  SYSTEM_REWRITE,
  buildRelevancePrompt,
  buildRewritePrompt,
} from "./prompts";

const BATCH_SIZE = 10;
const MIN_RELEVANCE = 8; // strict — anything below 8/10 is rejected. Quality over volume.
const DELAY_MS = 1500;

const ALLOWED_CATEGORIES = new Set([
  "visas-migracion",
  "economia-finanzas",
  "bienes-raices",
  "llc-negocios",
  "inversiones",
]);
const ALLOWED_CTA = new Set(["visa-e2", "bienes-raices", "estructura", "expansion", "formacion", "membresia"]);

/**
 * Cheap Spanish-language check used to reject LLM outputs that came back
 * in English (the original feeds are mostly English; some LLM backends
 * silently ignore "respond in Spanish" instructions when the source is
 * English-heavy).
 *
 * Heuristic: count the share of common Spanish-only words and accented
 * characters. Genuine Spanish articles score >0.8 typically; English
 * outputs score <0.2.
 */
function spanishConfidence(text: string): number {
  if (!text) return 0;
  const t = text.toLowerCase();
  // Strong signals: Spanish stop-words + accented vowels + ñ
  const esWords = [
    " el ", " la ", " los ", " las ", " un ", " una ", " unos ", " unas ",
    " de ", " del ", " que ", " con ", " para ", " por ", " pero ", " como ",
    " es ", " son ", " está ", " están ", " ser ", " ha ", " he ", " hay ",
    "ción", "sión", "más ", "según", " año ", "mexicano", "inversión",
  ];
  const enWords = [
    " the ", " of ", " and ", " is ", " are ", " was ", " were ", " in ", " on ",
    " for ", " that ", " this ", " with ", " from ", " by ", " be ", " been ",
    " have ", " has ", " will ", " would ", " could ", " should ",
  ];
  const accentMatches = (t.match(/[áéíóúñ¿¡]/g) || []).length;
  const esHits = esWords.reduce((n, w) => n + (t.includes(w) ? 1 : 0), 0);
  const enHits = enWords.reduce((n, w) => n + (t.includes(w) ? 1 : 0), 0);
  // Normalize: each ES hit + accents counts toward Spanish; EN hits counts against.
  const score = esHits * 1.0 + Math.min(accentMatches / 5, 5) - enHits * 1.0;
  // Map roughly to [0, 1]
  return Math.max(0, Math.min(1, score / 12));
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function safeJsonParse(text: string): any {
  const cleaned = text
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/```\s*$/, "")
    .trim();
  return JSON.parse(cleaned);
}

interface RelevanceResult {
  relevance_score: number;
  best_category: string;
  cta_target: string;
  suggested_tags: string[];
}

interface RewriteResult {
  title_es: string;
  slug: string;
  excerpt_es: string;
  body_es: string;
  seo_title?: string;
  seo_description?: string;
  tags: string[];
  read_time?: string;
  image_prompt: string;
}

async function scoreRelevance(article: {
  rawTitle: string;
  rawSummary: string;
  feedName: string;
  category: string;
}): Promise<RelevanceResult> {
  const prompt = buildRelevancePrompt({
    title: article.rawTitle,
    summary: article.rawSummary,
    sourceSlug: article.feedName,
    category: article.category,
  });

  const raw = await geminiGenerate(SYSTEM_RELEVANCE, prompt, {
    temperature: 0.2,
    maxOutputTokens: 512,
    jsonMode: true,
    // No `model` override — let the backend pick:
    //   - LLM_BASE_URL set: uses LLM_DEFAULT_MODEL (e.g. glm-5.1:cloud)
    //   - GEMINI_API_KEY: walks the gemini-2.5-flash → flash-lite fallback
    // Hardcoding "gemini-2.5-flash-lite" here used to break the OpenAI-
    // compatible backend with "model not found" 404s.
  });

  return safeJsonParse(raw) as RelevanceResult;
}

async function rewriteArticle(article: {
  rawTitle: string;
  rawSummary: string;
  rawContent: string;
  url: string;
  category: string;
  tags: string[];
  ctaTarget: string;
}): Promise<RewriteResult> {
  const prompt = buildRewritePrompt({
    title: article.rawTitle,
    summary: article.rawSummary,
    content: article.rawContent || article.rawSummary,
    sourceUrl: article.url,
    category: article.category,
    tags: article.tags,
    ctaTarget: article.ctaTarget,
  });

  const raw = await geminiGenerate(SYSTEM_REWRITE, prompt, {
    temperature: 0.7,
    maxOutputTokens: 3500,
    jsonMode: true,
  });

  return safeJsonParse(raw) as RewriteResult;
}

function uniqueSlug(base: string, articleId: number): string {
  const cleaned = (base || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 100);
  return cleaned ? `${cleaned}-${articleId}` : `articulo-${articleId}`;
}

async function run() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry");
  const idIdx = args.indexOf("--id");
  const singleId = idIdx >= 0 ? parseInt(args[idIdx + 1] ?? "", 10) : null;

  const db = getCliDb();

  // Pull candidates joined with feed name (used as sourceSlug for the prompt)
  const baseSelect = db
    .select({
      id: newsArticles.id,
      url: newsArticles.url,
      category: newsArticles.category,
      rawTitle: newsArticles.rawTitle,
      rawSummary: newsArticles.rawSummary,
      rawContent: newsArticles.rawContent,
      feedId: newsArticles.feedId,
      feedName: newsFeeds.name,
      feedPriority: newsFeeds.priority,
      publishedAt: newsArticles.publishedAt,
    })
    .from(newsArticles)
    .leftJoin(newsFeeds, eq(newsArticles.feedId, newsFeeds.id));

  const rows = singleId
    ? await baseSelect.where(eq(newsArticles.id, singleId)).limit(1)
    : await baseSelect
        .where(eq(newsArticles.status, "candidate"))
        .orderBy(desc(newsFeeds.priority), desc(newsArticles.publishedAt))
        .limit(BATCH_SIZE);

  if (rows.length === 0) {
    console.log("No candidates to process.");
    return;
  }

  console.log(`Processing ${rows.length} candidate(s)…\n`);

  let scored = 0;
  let rewritten = 0;
  let rejected = 0;

  for (const row of rows) {
    const label = `[${row.id}] ${(row.rawTitle ?? "").slice(0, 60)}`;

    try {
      // Pass 1 — Relevance
      const relevance = await scoreRelevance({
        rawTitle: row.rawTitle ?? "",
        rawSummary: row.rawSummary ?? "",
        feedName: row.feedName ?? "",
        category: row.category as string,
      });
      scored++;

      // Category is LOCKED to the feed's category. We don't let the LLM
      // change it — every feed is already pre-classified into one of the
      // 5 brand categories, and that's the editorial source of truth.
      // (Web-News-TTS lets the LLM pick because its 7 categories overlap;
      // ours are disjoint enough that "the feed knows best.")
      const finalCategory = (row.category ?? "economia-finanzas") as any;
      const finalCta = ALLOWED_CTA.has(relevance.cta_target)
        ? relevance.cta_target
        : "membresia";

      console.log(
        `  ${relevance.relevance_score >= MIN_RELEVANCE ? "✔" : "✘"} ${label}  → score=${relevance.relevance_score}  cat=${finalCategory}  cta=${finalCta}`
      );

      await db
        .update(newsArticles)
        .set({
          relevanceScore: relevance.relevance_score,
          category: finalCategory,
          ctaType: finalCta,
          tags: JSON.stringify(relevance.suggested_tags || []),
        })
        .where(eq(newsArticles.id, row.id));

      if (relevance.relevance_score < MIN_RELEVANCE) {
        await db
          .update(newsArticles)
          .set({
            status: "rejected",
            rejectionReason: `Low relevance (${relevance.relevance_score}/10)`,
          })
          .where(eq(newsArticles.id, row.id));
        rejected++;
        await sleep(DELAY_MS);
        continue;
      }

      if (dryRun) {
        await sleep(DELAY_MS);
        continue;
      }

      // Pass 2 — Spanish rewrite
      await sleep(DELAY_MS);
      const result = await rewriteArticle({
        rawTitle: row.rawTitle ?? "",
        rawSummary: row.rawSummary ?? "",
        rawContent: row.rawContent ?? "",
        url: row.url ?? "",
        category: finalCategory,
        tags: relevance.suggested_tags || [],
        ctaTarget: finalCta,
      });

      // Validate the output is actually Spanish. Some LLM backends ignore
      // "respond in Spanish" when the source content is English-heavy and
      // happily echo back English text. Reject those instead of publishing
      // mojibake on the live portal.
      const langSample = `${result.title_es ?? ""} ${result.excerpt_es ?? ""} ${(result.body_es ?? "").slice(0, 1500)}`;
      const langScore = spanishConfidence(langSample);
      if (langScore < 0.4) {
        await db
          .update(newsArticles)
          .set({
            status: "rejected",
            rejectionReason: `LLM output not Spanish (confidence=${langScore.toFixed(2)})`,
          })
          .where(eq(newsArticles.id, row.id));
        rejected++;
        console.log(`    ✘ rejected: not Spanish (confidence=${langScore.toFixed(2)})`);
        await sleep(DELAY_MS);
        continue;
      }

      // Use the AI-suggested slug if it's clean; otherwise derive one and
      // disambiguate with the article id so we never collide on the unique
      // ca_news_articles.slug constraint.
      const slug = uniqueSlug(result.slug || result.title_es, row.id);

      await db
        .update(newsArticles)
        .set({
          title: result.title_es.slice(0, 500),
          slug,
          description: (result.excerpt_es || "").slice(0, 1000),
          body: result.body_es,
          tags: JSON.stringify(result.tags || relevance.suggested_tags || []),
          // Store the image prompt in heroImagePrompt; generate-images will
          // populate imageUrl with a Cloudinary CDN URL on the next pass.
          heroImagePrompt: result.image_prompt,
          status: "draft",
          draftedAt: new Date(),
        })
        .where(eq(newsArticles.id, row.id));

      rewritten++;
      console.log(`    ✎ Reescrito → "${result.title_es.slice(0, 60)}…"`);
    } catch (err: any) {
      console.error(`  ✘ ${label}  ERROR: ${err.message}`);
    }

    await sleep(DELAY_MS);
  }

  console.log(`\nDone. Scored: ${scored}  Rewritten: ${rewritten}  Rejected: ${rejected}`);
}

run()
  .catch((err) => {
    console.error("Rewrite pipeline failed:", err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await closeCliDb();
    // Force exit: keep-alive sockets from the LLM client (fetch) can hold
    // the event loop open after the work is done.
    process.exit(process.exitCode ?? 0);
  });

