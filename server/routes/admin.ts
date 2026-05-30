/**
 * Admin REST API for the external editor agent (OpenClaw / Yael).
 *
 * Auth model: a single shared bearer token (ADMIN_TOKEN env var) accepted
 * either as Authorization: Bearer <token> header or as ?token=<token>
 * query param. The token is rejected at module load if not configured —
 * we don't want to ship an "open" admin API by accident.
 *
 * All endpoints are mounted under /api/admin in server/_core/index.ts.
 *
 * Endpoints:
 *   GET    /articles              List with filters (status, category, search, limit)
 *   GET    /articles/:id          Full row for one article
 *   PUT    /articles/:id          Edit allowed fields (title, body, imageUrl, etc.)
 *   DELETE /articles/:id          Soft delete (status = 'archived')
 *   POST   /articles/:id/publish  Promote draft/approved -> published
 *   POST   /articles/:id/approve  Promote draft -> approved
 *   POST   /articles/:id/reject   Mark as rejected (with optional reason)
 *   POST   /articles/:id/rewrite  Run the AI rewrite stage on one article
 *
 *   GET    /candidates            Pending items awaiting AI review
 *   GET    /sources               All RSS feeds + their health
 *   POST   /run-pipeline          Trigger the full ingest -> publish chain now
 *   POST   /seed-feeds            (Re)seed ca_news_feeds from sources.ts
 */
import { and, desc, eq, like, type SQL } from "drizzle-orm";
import { Router, type NextFunction, type Request, type Response } from "express";
import { blogPosts, newsArticles, newsFeeds, socialPosts } from "../../drizzle/schema";
import { ENV } from "../_core/env";
import { regenerateImageNow, rewriteArticleNow, runStageNow, triggerPipelineNow } from "../cron/scheduler";
import { getDb } from "../db";
import { seedFeeds } from "../ingest/seed-feeds";
import { schedulePost, type Brand, type Network } from "../social/metricool";

// ---- Allow-lists for the agent's PUT payload ----
const ALLOWED_CATEGORIES = new Set([
  "visas-migracion",
  "economia-finanzas",
  "bienes-raices",
  "llc-negocios",
  "inversiones",
]);
const ALLOWED_STATUSES = new Set([
  "candidate",
  "draft",
  "approved",
  "published",
  "rejected",
  "archived",
]);
const ALLOWED_CTA = new Set([
  "visa-e2",
  "bienes-raices",
  "estructura",
  "expansion",
  "formacion",
  "membresia",
]);

// title, description, body, imageUrl, category, status, tags, ctaType, slug
const EDITABLE_FIELDS = new Set([
  "title",
  "slug",
  "description",
  "body",
  "imageUrl",
  "category",
  "status",
  "tags",
  "ctaType",
  "rejectionReason",
  "heroImagePrompt",
]);

// ─────────────────────────────────────────────────────
// Auth middleware
// ─────────────────────────────────────────────────────
function requireToken(req: Request, res: Response, next: NextFunction) {
  const expected = ENV.adminToken;
  if (!expected) {
    return res.status(503).json({
      error: "Admin API disabled: set ADMIN_TOKEN in the environment to enable.",
    });
  }
  const header = req.header("authorization") || "";
  const bearer = header.toLowerCase().startsWith("bearer ") ? header.slice(7).trim() : null;
  const queryToken =
    typeof req.query.token === "string" ? req.query.token : null;
  const supplied = bearer || queryToken;
  if (!supplied || supplied !== expected) {
    return res.status(401).json({ error: "Invalid or missing admin token" });
  }
  next();
}

// ─────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────
function asInt(v: unknown, fallback?: number): number | undefined {
  if (typeof v === "string" && v.trim() !== "") {
    const n = parseInt(v, 10);
    if (!Number.isNaN(n)) return n;
  }
  if (typeof v === "number") return v;
  return fallback;
}

function pickEditable(body: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(body)) {
    if (!EDITABLE_FIELDS.has(k)) continue;
    if (v === undefined) continue;
    out[k] = v;
  }
  return out;
}

function validateUpdate(patch: Record<string, unknown>): string | null {
  if (typeof patch.category === "string" && !ALLOWED_CATEGORIES.has(patch.category)) {
    return `Invalid category. Allowed: ${Array.from(ALLOWED_CATEGORIES).join(", ")}`;
  }
  if (typeof patch.status === "string" && !ALLOWED_STATUSES.has(patch.status)) {
    return `Invalid status. Allowed: ${Array.from(ALLOWED_STATUSES).join(", ")}`;
  }
  if (typeof patch.ctaType === "string" && patch.ctaType && !ALLOWED_CTA.has(patch.ctaType)) {
    return `Invalid ctaType. Allowed: ${Array.from(ALLOWED_CTA).join(", ")}`;
  }
  // tags should be JSON-serialized string OR an array we serialize for them
  if (Array.isArray(patch.tags)) {
    patch.tags = JSON.stringify(patch.tags);
  }
  return null;
}

// ─────────────────────────────────────────────────────
// Router
// ─────────────────────────────────────────────────────
export const adminRouter = Router();
adminRouter.use(requireToken);

// ---- LIST ----
adminRouter.get("/articles", async (req, res) => {
  try {
    const db = await getDb();
    if (!db) return res.status(503).json({ error: "Database not available" });

    const status = typeof req.query.status === "string" ? req.query.status : undefined;
    const category = typeof req.query.category === "string" ? req.query.category : undefined;
    const search = typeof req.query.search === "string" ? req.query.search.trim() : "";
    const limit = Math.min(asInt(req.query.limit, 20) ?? 20, 100);

    const conditions: SQL[] = [];
    if (status && ALLOWED_STATUSES.has(status)) {
      conditions.push(eq(newsArticles.status, status as any));
    }
    if (category && ALLOWED_CATEGORIES.has(category)) {
      conditions.push(eq(newsArticles.category, category as any));
    }
    if (search) {
      conditions.push(like(newsArticles.title, `%${search}%`));
    }

    const rows = await db
      .select()
      .from(newsArticles)
      .where(conditions.length ? and(...conditions) : undefined)
      .orderBy(desc(newsArticles.publishedAtInternal), desc(newsArticles.publishedAt))
      .limit(limit);
    res.json({ count: rows.length, articles: rows });
  } catch (err: any) {
    console.error("[admin] list articles error:", err);
    res.status(500).json({ error: err.message || "Internal error" });
  }
});

// ---- DETAIL ----
adminRouter.get("/articles/:id", async (req, res) => {
  try {
    const id = asInt(req.params.id);
    if (!id) return res.status(400).json({ error: "Invalid id" });
    const db = await getDb();
    if (!db) return res.status(503).json({ error: "Database not available" });

    const row = await db.select().from(newsArticles).where(eq(newsArticles.id, id)).limit(1);
    if (row.length === 0) return res.status(404).json({ error: "Not found" });
    res.json(row[0]);
  } catch (err: any) {
    console.error("[admin] get article error:", err);
    res.status(500).json({ error: err.message || "Internal error" });
  }
});

// ---- UPDATE ----
adminRouter.put("/articles/:id", async (req, res) => {
  try {
    const id = asInt(req.params.id);
    if (!id) return res.status(400).json({ error: "Invalid id" });
    if (!req.body || typeof req.body !== "object") {
      return res.status(400).json({ error: "Body must be a JSON object" });
    }

    const patch = pickEditable(req.body);
    if (Object.keys(patch).length === 0) {
      return res.status(400).json({
        error: `No editable fields supplied. Allowed: ${Array.from(EDITABLE_FIELDS).join(", ")}`,
      });
    }
    const validationError = validateUpdate(patch);
    if (validationError) return res.status(400).json({ error: validationError });

    const db = await getDb();
    if (!db) return res.status(503).json({ error: "Database not available" });

    await db.update(newsArticles).set(patch as any).where(eq(newsArticles.id, id));
    const refreshed = await db.select().from(newsArticles).where(eq(newsArticles.id, id)).limit(1);
    if (refreshed.length === 0) return res.status(404).json({ error: "Not found after update" });
    res.json({ updated: Object.keys(patch), article: refreshed[0] });
  } catch (err: any) {
    console.error("[admin] update article error:", err);
    res.status(500).json({ error: err.message || "Internal error" });
  }
});

// ---- SOFT DELETE (archive) ----
adminRouter.delete("/articles/:id", async (req, res) => {
  try {
    const id = asInt(req.params.id);
    if (!id) return res.status(400).json({ error: "Invalid id" });
    const db = await getDb();
    if (!db) return res.status(503).json({ error: "Database not available" });

    await db.update(newsArticles).set({ status: "archived" }).where(eq(newsArticles.id, id));
    res.json({ archived: true, id });
  } catch (err: any) {
    console.error("[admin] archive article error:", err);
    res.status(500).json({ error: err.message || "Internal error" });
  }
});

// ---- WORKFLOW ACTIONS ----
adminRouter.post("/articles/:id/publish", async (req, res) => {
  try {
    const id = asInt(req.params.id);
    if (!id) return res.status(400).json({ error: "Invalid id" });
    const db = await getDb();
    if (!db) return res.status(503).json({ error: "Database not available" });

    await db
      .update(newsArticles)
      .set({
        status: "published",
        publishedAtInternal: new Date(),
        approvedAt: new Date(),
      })
      .where(eq(newsArticles.id, id));
    res.json({ published: true, id });
  } catch (err: any) {
    console.error("[admin] publish error:", err);
    res.status(500).json({ error: err.message || "Internal error" });
  }
});

adminRouter.post("/articles/:id/approve", async (req, res) => {
  try {
    const id = asInt(req.params.id);
    if (!id) return res.status(400).json({ error: "Invalid id" });
    const db = await getDb();
    if (!db) return res.status(503).json({ error: "Database not available" });

    await db
      .update(newsArticles)
      .set({ status: "approved", approvedAt: new Date() })
      .where(eq(newsArticles.id, id));
    res.json({ approved: true, id });
  } catch (err: any) {
    console.error("[admin] approve error:", err);
    res.status(500).json({ error: err.message || "Internal error" });
  }
});

// Run the rewrite stage on a single article right now (fire-and-forget).
// Lets the editor / Nikki re-evaluate an article — useful when threshold
// changed, or when a candidate is buried behind the regular batch order.
adminRouter.post("/articles/:id/rewrite", async (req, res) => {
  try {
    const id = asInt(req.params.id);
    if (!id) return res.status(400).json({ error: "Invalid id" });
    const result = await rewriteArticleNow(id);
    if (!result.started) {
      return res.status(409).json({ started: false, reason: result.reason });
    }
    res.json({ started: true, id, message: "Rewrite launched in background. Tail Render logs for progress." });
  } catch (err: any) {
    console.error("[admin] rewrite trigger error:", err);
    res.status(500).json({ error: err.message || "Internal error" });
  }
});

// Force-regenerate the hero image for a single article. Use when a draft
// is stuck without imageUrl (auto-publish skips it). Runs the same image
// cascade as the cron `images` stage including the new category fallback.
adminRouter.post("/articles/:id/regenerate-image", async (req, res) => {
  try {
    const id = asInt(req.params.id);
    if (!id) return res.status(400).json({ error: "Invalid id" });
    const result = await regenerateImageNow(id);
    if (!result.started) {
      return res.status(409).json({ started: false, reason: result.reason });
    }
    res.json({ started: true, id, message: "Image generation launched in background." });
  } catch (err: any) {
    console.error("[admin] regenerate-image trigger error:", err);
    res.status(500).json({ error: err.message || "Internal error" });
  }
});

adminRouter.post("/articles/:id/reject", async (req, res) => {
  try {
    const id = asInt(req.params.id);
    if (!id) return res.status(400).json({ error: "Invalid id" });
    const reason =
      typeof req.body?.reason === "string" && req.body.reason.trim()
        ? req.body.reason.trim().slice(0, 256)
        : "Rejected by editor";
    const db = await getDb();
    if (!db) return res.status(503).json({ error: "Database not available" });

    await db
      .update(newsArticles)
      .set({ status: "rejected", rejectionReason: reason })
      .where(eq(newsArticles.id, id));
    res.json({ rejected: true, id, reason });
  } catch (err: any) {
    console.error("[admin] reject error:", err);
    res.status(500).json({ error: err.message || "Internal error" });
  }
});

// ---- CANDIDATES (pending AI review) ----
adminRouter.get("/candidates", async (req, res) => {
  try {
    const limit = Math.min(asInt(req.query.limit, 50) ?? 50, 200);
    const db = await getDb();
    if (!db) return res.status(503).json({ error: "Database not available" });

    const rows = await db
      .select()
      .from(newsArticles)
      .where(eq(newsArticles.status, "candidate"))
      .orderBy(desc(newsArticles.fetchedAt))
      .limit(limit);
    res.json({ count: rows.length, candidates: rows });
  } catch (err: any) {
    console.error("[admin] candidates error:", err);
    res.status(500).json({ error: err.message || "Internal error" });
  }
});

// ---- SOURCES ----
adminRouter.get("/sources", async (_req, res) => {
  try {
    const db = await getDb();
    if (!db) return res.status(503).json({ error: "Database not available" });
    const rows = await db.select().from(newsFeeds).orderBy(desc(newsFeeds.priority));
    res.json({ count: rows.length, sources: rows });
  } catch (err: any) {
    console.error("[admin] sources error:", err);
    res.status(500).json({ error: err.message || "Internal error" });
  }
});

// ---- HEALTH (which env vars are wired up; no values exposed) ----
adminRouter.get("/health", async (_req, res) => {
  const present = (v: string | undefined) => !!(v && v.length > 0);
  res.json({
    ok: true,
    timestamp: new Date().toISOString(),
    env: {
      DATABASE_URL: present(process.env.DATABASE_URL),
      ADMIN_TOKEN: present(process.env.ADMIN_TOKEN),
      LLM_BASE_URL: present(process.env.LLM_BASE_URL),
      LLM_API_KEY: present(process.env.LLM_API_KEY),
      LLM_DEFAULT_MODEL: process.env.LLM_DEFAULT_MODEL || null,
      LLM_DISABLE_JSON_MODE: process.env.LLM_DISABLE_JSON_MODE === "true",
      GEMINI_API_KEY: present(process.env.GEMINI_API_KEY),
      PEXELS_API_KEY: present(process.env.PEXELS_API_KEY),
      CLOUDINARY_CLOUD_NAME: present(process.env.CLOUDINARY_CLOUD_NAME),
      CLOUDINARY_API_KEY: present(process.env.CLOUDINARY_API_KEY),
      CLOUDINARY_API_SECRET: present(process.env.CLOUDINARY_API_SECRET),
      METRICOOL_API_KEY: present(process.env.METRICOOL_API_KEY),
      METRICOOL_USER_ID: present(process.env.METRICOOL_USER_ID),
      METRICOOL_BLOG_CA: present(process.env.METRICOOL_BLOG_CA || process.env.METRICOOL_BLOG_ID),
      METRICOOL_BLOG_ET: present(process.env.METRICOOL_BLOG_ET),
      METRICOOL_BLOG_TUM: present(process.env.METRICOOL_BLOG_TUM),
    },
  });
});

// ---- TRIGGER PIPELINE ----
adminRouter.post("/run-pipeline", async (_req, res) => {
  try {
    const result = await triggerPipelineNow();
    if (!result.started) {
      return res.status(409).json({ started: false, reason: result.reason });
    }
    res.json({ started: true, message: "Pipeline launched in background. Tail Render logs for progress." });
  } catch (err: any) {
    console.error("[admin] run-pipeline error:", err);
    res.status(500).json({ error: err.message || "Internal error" });
  }
});

// ---- INDIVIDUAL STAGE (agent-driven, granular control) ----
// Lets the external agent run one stage at a time instead of the full chain.
// Valid stages: ingest | rewrite | images | auto-publish
adminRouter.post("/pipeline/:stage", async (req, res) => {
  try {
    const stage = String(req.params.stage || "").toLowerCase();
    const result = await runStageNow(stage);
    if (!result.started) {
      const code = (result.reason || "").startsWith("unknown") ? 400 : 409;
      return res.status(code).json(result);
    }
    res.json({ ...result, message: `Stage "${stage}" launched in background.` });
  } catch (err: any) {
    console.error("[admin] pipeline/:stage error:", err);
    res.status(500).json({ error: err.message || "Internal error" });
  }
});

// ---- SEED FEEDS (one-shot bootstrap / refresh of ca_news_feeds) ----
// Reuses the same idempotent logic as `pnpm news:seed-feeds`. Safe to
// call repeatedly — existing rows are updated only when their seed
// definition changed, new rows are inserted, nothing is deleted.
adminRouter.post("/seed-feeds", async (_req, res) => {
  try {
    const db = await getDb();
    if (!db) return res.status(503).json({ error: "Database not available" });
    const result = await seedFeeds(db);
    res.json(result);
  } catch (err: any) {
    console.error("[admin] seed-feeds error:", err);
    res.status(500).json({ error: err.message || "Internal error" });
  }
});

// ═══════════════════════════════════════════════════════════════════
// BLOG POSTS — separate table from news articles. The agent (Nikki)
// uses these endpoints to author and manage long-form editorial blog
// content (vs. the news pipeline which is automated from RSS).
// ═══════════════════════════════════════════════════════════════════

const ALLOWED_BLOG_LANGUAGES = new Set(["es", "en"]);
const ALLOWED_BLOG_STATUSES = new Set(["draft", "published", "archived"]);
const EDITABLE_BLOG_FIELDS = new Set([
  "title",
  "slug",
  "content",
  "htmlContent",
  "excerpt",
  "featuredImage",
  "language",
  "status",
  "metaDescription",
  "category",
  "tags",
  "publishedAt",
]);

function pickEditableBlog(body: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(body)) {
    if (!EDITABLE_BLOG_FIELDS.has(k)) continue;
    if (v === undefined) continue;
    out[k] = v;
  }
  if (Array.isArray(out.tags)) out.tags = JSON.stringify(out.tags);
  if (typeof out.publishedAt === "string") out.publishedAt = new Date(out.publishedAt);
  return out;
}

function validateBlogPatch(patch: Record<string, unknown>): string | null {
  if (typeof patch.language === "string" && !ALLOWED_BLOG_LANGUAGES.has(patch.language)) {
    return `Invalid language. Allowed: ${Array.from(ALLOWED_BLOG_LANGUAGES).join(", ")}`;
  }
  if (typeof patch.status === "string" && !ALLOWED_BLOG_STATUSES.has(patch.status)) {
    return `Invalid status. Allowed: ${Array.from(ALLOWED_BLOG_STATUSES).join(", ")}`;
  }
  return null;
}

function slugifyTitle(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 100);
}

// ---- LIST blog posts ----
adminRouter.get("/blog/posts", async (req, res) => {
  try {
    const db = await getDb();
    if (!db) return res.status(503).json({ error: "Database not available" });

    const status = typeof req.query.status === "string" ? req.query.status : undefined;
    const language = typeof req.query.language === "string" ? req.query.language : undefined;
    const search = typeof req.query.search === "string" ? req.query.search.trim() : "";
    const limit = Math.min(asInt(req.query.limit, 20) ?? 20, 100);

    const conditions: SQL[] = [];
    if (status && ALLOWED_BLOG_STATUSES.has(status)) {
      conditions.push(eq(blogPosts.status, status as any));
    }
    if (language && ALLOWED_BLOG_LANGUAGES.has(language)) {
      conditions.push(eq(blogPosts.language, language as any));
    }
    if (search) {
      conditions.push(like(blogPosts.title, `%${search}%`));
    }

    const rows = await db
      .select()
      .from(blogPosts)
      .where(conditions.length ? and(...conditions) : undefined)
      .orderBy(desc(blogPosts.publishedAt), desc(blogPosts.createdAt))
      .limit(limit);
    res.json({ count: rows.length, posts: rows });
  } catch (err: any) {
    console.error("[admin] list blog posts error:", err);
    res.status(500).json({ error: err.message || "Internal error" });
  }
});

// ---- DETAIL blog post ----
adminRouter.get("/blog/posts/:id", async (req, res) => {
  try {
    const id = asInt(req.params.id);
    if (!id) return res.status(400).json({ error: "Invalid id" });
    const db = await getDb();
    if (!db) return res.status(503).json({ error: "Database not available" });

    const row = await db.select().from(blogPosts).where(eq(blogPosts.id, id)).limit(1);
    if (row.length === 0) return res.status(404).json({ error: "Not found" });
    res.json(row[0]);
  } catch (err: any) {
    console.error("[admin] get blog post error:", err);
    res.status(500).json({ error: err.message || "Internal error" });
  }
});

// ---- CREATE blog post ----
adminRouter.post("/blog/posts", async (req, res) => {
  try {
    if (!req.body || typeof req.body !== "object") {
      return res.status(400).json({ error: "Body must be a JSON object" });
    }
    const patch = pickEditableBlog(req.body);
    if (typeof patch.title !== "string" || !patch.title.trim()) {
      return res.status(400).json({ error: "title is required" });
    }
    if (typeof patch.content !== "string" || !patch.content.trim()) {
      return res.status(400).json({ error: "content is required" });
    }
    const validationError = validateBlogPatch(patch);
    if (validationError) return res.status(400).json({ error: validationError });

    if (typeof patch.slug !== "string" || !patch.slug.trim()) {
      patch.slug = `${slugifyTitle(patch.title as string)}-${Date.now()}`;
    }

    const db = await getDb();
    if (!db) return res.status(503).json({ error: "Database not available" });

    const result = await db.insert(blogPosts).values(patch as any);
    const id = Number((result as any)[0]?.insertId);
    const created = await db.select().from(blogPosts).where(eq(blogPosts.id, id)).limit(1);
    res.status(201).json({ created: true, post: created[0] });
  } catch (err: any) {
    console.error("[admin] create blog post error:", err);
    if (/duplicate.*slug/i.test(err.message || "")) {
      return res.status(409).json({ error: "slug already exists" });
    }
    res.status(500).json({ error: err.message || "Internal error" });
  }
});

// ---- UPDATE blog post ----
adminRouter.put("/blog/posts/:id", async (req, res) => {
  try {
    const id = asInt(req.params.id);
    if (!id) return res.status(400).json({ error: "Invalid id" });
    if (!req.body || typeof req.body !== "object") {
      return res.status(400).json({ error: "Body must be a JSON object" });
    }
    const patch = pickEditableBlog(req.body);
    if (Object.keys(patch).length === 0) {
      return res.status(400).json({
        error: `No editable fields supplied. Allowed: ${Array.from(EDITABLE_BLOG_FIELDS).join(", ")}`,
      });
    }
    const validationError = validateBlogPatch(patch);
    if (validationError) return res.status(400).json({ error: validationError });

    const db = await getDb();
    if (!db) return res.status(503).json({ error: "Database not available" });

    await db.update(blogPosts).set(patch as any).where(eq(blogPosts.id, id));
    const refreshed = await db.select().from(blogPosts).where(eq(blogPosts.id, id)).limit(1);
    if (refreshed.length === 0) return res.status(404).json({ error: "Not found after update" });
    res.json({ updated: Object.keys(patch), post: refreshed[0] });
  } catch (err: any) {
    console.error("[admin] update blog post error:", err);
    res.status(500).json({ error: err.message || "Internal error" });
  }
});

// ---- SOFT DELETE blog post (archive) ----
adminRouter.delete("/blog/posts/:id", async (req, res) => {
  try {
    const id = asInt(req.params.id);
    if (!id) return res.status(400).json({ error: "Invalid id" });
    const db = await getDb();
    if (!db) return res.status(503).json({ error: "Database not available" });

    await db.update(blogPosts).set({ status: "archived" }).where(eq(blogPosts.id, id));
    res.json({ archived: true, id });
  } catch (err: any) {
    console.error("[admin] archive blog post error:", err);
    res.status(500).json({ error: err.message || "Internal error" });
  }
});

// ---- PUBLISH blog post ----
adminRouter.post("/blog/posts/:id/publish", async (req, res) => {
  try {
    const id = asInt(req.params.id);
    if (!id) return res.status(400).json({ error: "Invalid id" });
    const db = await getDb();
    if (!db) return res.status(503).json({ error: "Database not available" });

    await db
      .update(blogPosts)
      .set({ status: "published", publishedAt: new Date() })
      .where(eq(blogPosts.id, id));
    res.json({ published: true, id });
  } catch (err: any) {
    console.error("[admin] publish blog post error:", err);
    res.status(500).json({ error: err.message || "Internal error" });
  }
});

// ═══════════════════════════════════════════════════════════════════
// SOCIAL POSTING — Metricool, multi-brand
// The agent (Nikki) calls these to publish or schedule across
// Comprando América and Edmundo Treviño accounts.
// ═══════════════════════════════════════════════════════════════════

const ALLOWED_BRANDS = new Set<Brand>([
  "comprando-america",
  "edmundo-trevino",
  "theusmarketer",
]);
const ALLOWED_NETWORKS = new Set<Network>([
  "facebook",
  "instagram",
  "tiktok",
  "linkedin",
  "threads",
  "twitter",
  "youtube",
]);

// POST /api/admin/social/publish — publish now (or schedule with scheduledAt)
// Body: {
//   brand:       "comprando-america" | "edmundo-trevino",
//   networks:    ["facebook","instagram",...],
//   caption:     "Post text",
//   mediaUrls:   ["https://...","https://..."],
//   scheduledAt: "2026-05-17T15:00:00.000Z",   // optional, ISO. omit = now+2min
//   timezone:    "America/Mexico_City",         // optional
//   postType:    "post" | "reel" | "story" | "carousel" | "short",  // optional
//   articleId:   12345                          // optional, for tracking
// }
adminRouter.post("/social/publish", async (req, res) => {
  try {
    const body = (req.body ?? {}) as Record<string, any>;
    const brand = String(body.brand || "");
    if (!ALLOWED_BRANDS.has(brand as Brand)) {
      return res.status(400).json({
        error: `Invalid brand. Allowed: ${Array.from(ALLOWED_BRANDS).join(", ")}`,
      });
    }
    if (typeof body.caption !== "string" || !body.caption.trim()) {
      return res.status(400).json({ error: "caption (string) is required" });
    }
    if (!Array.isArray(body.networks) || body.networks.length === 0) {
      return res.status(400).json({ error: "networks (non-empty array) is required" });
    }
    const networks = body.networks
      .map((n: any) => String(n).toLowerCase())
      .filter((n: string) => ALLOWED_NETWORKS.has(n as Network)) as Network[];
    if (networks.length === 0) {
      return res.status(400).json({
        error: `No valid networks. Allowed: ${Array.from(ALLOWED_NETWORKS).join(", ")}`,
      });
    }
    const mediaUrls = Array.isArray(body.mediaUrls)
      ? body.mediaUrls.map((u: any) => String(u)).filter(Boolean)
      : [];

    const postType = ["post", "reel", "story", "carousel", "short"].includes(body.postType)
      ? body.postType
      : mediaUrls.length > 1
        ? "carousel"
        : "post";

    const metricoolId = await schedulePost({
      brand: brand as Brand,
      networks,
      text: body.caption,
      mediaUrls,
      dateTime: typeof body.scheduledAt === "string" ? body.scheduledAt : undefined,
      timezone: typeof body.timezone === "string" ? body.timezone : undefined,
      postType,
      youtubeTitle: typeof body.youtubeTitle === "string" ? body.youtubeTitle : undefined,
    });

    // Log every dispatched post in ca_social_posts. We tag the brand by
    // prefixing metricoolId — avoids a schema migration to add a column.
    const db = await getDb();
    let localId: number | null = null;
    if (db) {
      const inserted = await db.insert(socialPosts).values({
        articleId: typeof body.articleId === "number" ? body.articleId : null,
        network: networks[0] as any,
        postType: postType as any,
        language: "es",
        caption: body.caption.slice(0, 65000),
        mediaUrls: JSON.stringify(mediaUrls),
        metricoolId: `${brand}:${metricoolId}`,
        scheduledAt: body.scheduledAt ? new Date(body.scheduledAt) : new Date(Date.now() + 120000),
        status: "scheduled",
      });
      localId = Number((inserted as any)?.[0]?.insertId || 0) || null;
    }

    res.json({
      ok: true,
      brand,
      networks,
      metricoolId,
      localId,
      message: `Post dispatched to Metricool for ${brand}`,
    });
  } catch (err: any) {
    console.error("[admin] social/publish error:", err?.message);
    res.status(500).json({ error: err?.message || "Internal error" });
  }
});

// GET /api/admin/social/posts — list dispatched social posts (brand parsed
// out of metricoolId prefix). Query: status, brand, network, limit
adminRouter.get("/social/posts", async (req, res) => {
  try {
    const db = await getDb();
    if (!db) return res.status(503).json({ error: "Database not available" });

    const status = typeof req.query.status === "string" ? req.query.status : undefined;
    const brandFilter = typeof req.query.brand === "string" ? req.query.brand : undefined;
    const networkFilter = typeof req.query.network === "string" ? req.query.network : undefined;
    const limit = Math.min(asInt(req.query.limit, 20) ?? 20, 100);

    const conditions: SQL[] = [];
    if (status) conditions.push(eq(socialPosts.status, status as any));
    if (networkFilter && ALLOWED_NETWORKS.has(networkFilter as Network)) {
      conditions.push(eq(socialPosts.network, networkFilter as any));
    }
    if (brandFilter && ALLOWED_BRANDS.has(brandFilter as Brand)) {
      conditions.push(like(socialPosts.metricoolId, `${brandFilter}:%`));
    }

    const rows = await db
      .select()
      .from(socialPosts)
      .where(conditions.length ? and(...conditions) : undefined)
      .orderBy(desc(socialPosts.createdAt))
      .limit(limit);

    // Split brand prefix out of metricoolId for the response
    const posts = rows.map((r: any) => {
      const mid: string = r.metricoolId ?? "";
      const colon = mid.indexOf(":");
      const brand = colon > 0 ? mid.slice(0, colon) : null;
      const realId = colon > 0 ? mid.slice(colon + 1) : mid;
      return { ...r, brand, metricoolId: realId };
    });

    res.json({ count: posts.length, posts });
  } catch (err: any) {
    console.error("[admin] social/posts list error:", err?.message);
    res.status(500).json({ error: err?.message || "Internal error" });
  }
});

// GET /api/admin/social/posts/:id — single dispatched social post
adminRouter.get("/social/posts/:id", async (req, res) => {
  try {
    const id = asInt(req.params.id);
    if (!id) return res.status(400).json({ error: "Invalid id" });
    const db = await getDb();
    if (!db) return res.status(503).json({ error: "Database not available" });

    const rows = await db.select().from(socialPosts).where(eq(socialPosts.id, id)).limit(1);
    if (rows.length === 0) return res.status(404).json({ error: "Not found" });

    const r: any = rows[0];
    const mid: string = r.metricoolId ?? "";
    const colon = mid.indexOf(":");
    const brand = colon > 0 ? mid.slice(0, colon) : null;
    const realId = colon > 0 ? mid.slice(colon + 1) : mid;
    res.json({ ...r, brand, metricoolId: realId });
  } catch (err: any) {
    console.error("[admin] social/posts get error:", err?.message);
    res.status(500).json({ error: err?.message || "Internal error" });
  }
});
