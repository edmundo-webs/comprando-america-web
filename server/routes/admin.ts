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
 *
 *   GET    /candidates            Pending items awaiting AI review
 *   GET    /sources               All RSS feeds + their health
 *   POST   /run-pipeline          Trigger the full ingest -> publish chain now
 */
import { and, desc, eq, like, type SQL } from "drizzle-orm";
import { Router, type NextFunction, type Request, type Response } from "express";
import { newsArticles, newsFeeds } from "../../drizzle/schema";
import { ENV } from "../_core/env";
import { triggerPipelineNow } from "../cron/scheduler";
import { getDb } from "../db";

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
