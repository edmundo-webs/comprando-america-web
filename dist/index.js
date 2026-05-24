var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/_core/env.ts
var env_exports = {};
__export(env_exports, {
  ENV: () => ENV
});
var ENV;
var init_env = __esm({
  "server/_core/env.ts"() {
    "use strict";
    ENV = {
      appId: process.env.VITE_APP_ID ?? "comprando-america",
      cookieSecret: process.env.JWT_SECRET ?? "",
      databaseUrl: process.env.DATABASE_URL ?? "",
      ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
      isProduction: process.env.NODE_ENV === "production",
      // Cloudinary
      cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME ?? "",
      cloudinaryApiKey: process.env.CLOUDINARY_API_KEY ?? "",
      cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET ?? "",
      // OpenAI (for AI image generation in CMS — separate from the news pipeline)
      openaiApiKey: process.env.OPENAI_API_KEY ?? "",
      // News publishing pipeline — LLM (OpenAI-compatible: Ollama / GLM cloud).
      // If LLM_BASE_URL is set, the pipeline routes all text generation through it.
      // Otherwise it falls back to GEMINI_API_KEY (legacy path).
      llmBaseUrl: process.env.LLM_BASE_URL ?? "",
      llmApiKey: process.env.LLM_API_KEY ?? "",
      llmDefaultModel: process.env.LLM_DEFAULT_MODEL ?? "glm-5.1:cloud",
      geminiApiKey: process.env.GEMINI_API_KEY ?? "",
      pexelsApiKey: process.env.PEXELS_API_KEY ?? "",
      // Admin REST API token for the external editor agent (OpenClaw / Yael)
      adminToken: process.env.ADMIN_TOKEN ?? "",
      // Metricool — social distribution
      metricoolApiKey: process.env.METRICOOL_API_KEY ?? "",
      metricoolUserId: process.env.METRICOOL_USER_ID ?? "1748825",
      metricoolBlogId: process.env.METRICOOL_BLOG_ID ?? "4294668"
    };
  }
});

// server/storage.ts
var storage_exports = {};
__export(storage_exports, {
  storageGet: () => storageGet,
  storagePut: () => storagePut
});
function getStorageConfig() {
  const cloudName = ENV.cloudinaryCloudName;
  const apiKey = ENV.cloudinaryApiKey;
  const apiSecret = ENV.cloudinaryApiSecret;
  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error(
      "Cloudinary credentials missing: set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET"
    );
  }
  return { cloudName, apiKey, apiSecret };
}
async function storagePut(relKey, data, contentType = "application/octet-stream") {
  const { cloudName, apiKey, apiSecret } = getStorageConfig();
  const timestamp2 = Math.floor(Date.now() / 1e3);
  const publicId = relKey.replace(/\.[^.]+$/, "").replace(/^\/+/, "");
  const { createHash } = await import("crypto");
  const signatureStr = `public_id=${publicId}&timestamp=${timestamp2}${apiSecret}`;
  const signature = createHash("sha1").update(signatureStr).digest("hex");
  const formData = new FormData();
  const blob = typeof data === "string" ? new Blob([data], { type: contentType }) : new Blob([data], { type: contentType });
  formData.append("file", blob, relKey.split("/").pop() ?? "file");
  formData.append("public_id", publicId);
  formData.append("timestamp", String(timestamp2));
  formData.append("api_key", apiKey);
  formData.append("signature", signature);
  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
    { method: "POST", body: formData }
  );
  if (!response.ok) {
    const message = await response.text().catch(() => response.statusText);
    throw new Error(
      `Cloudinary upload failed (${response.status}): ${message}`
    );
  }
  const result = await response.json();
  return { key: publicId, url: result.secure_url };
}
async function storageGet(relKey) {
  const { cloudName } = getStorageConfig();
  const key = relKey.replace(/^\/+/, "");
  return {
    key,
    url: `https://res.cloudinary.com/${cloudName}/image/upload/${key}`
  };
}
var init_storage = __esm({
  "server/storage.ts"() {
    "use strict";
    init_env();
  }
});

// server/_core/index.ts
import "dotenv/config";
import express2 from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";

// server/_core/oauth.ts
function registerOAuthRoutes(app) {
  app.get("/api/oauth/callback", (_req, res) => {
    res.redirect(302, "/cms/login");
  });
}

// shared/const.ts
var COOKIE_NAME = "app_session_id";
var ONE_YEAR_MS = 1e3 * 60 * 60 * 24 * 365;
var UNAUTHED_ERR_MSG = "Please login (10001)";
var NOT_ADMIN_ERR_MSG = "You do not have required permission (10002)";

// server/_core/cookies.ts
function isSecureRequest(req) {
  if (req.protocol === "https") return true;
  const forwardedProto = req.headers["x-forwarded-proto"];
  if (!forwardedProto) return false;
  const protoList = Array.isArray(forwardedProto) ? forwardedProto : forwardedProto.split(",");
  return protoList.some((proto) => proto.trim().toLowerCase() === "https");
}
function getSessionCookieOptions(req) {
  return {
    httpOnly: true,
    path: "/",
    sameSite: "none",
    secure: isSecureRequest(req)
  };
}

// server/_core/systemRouter.ts
import { z } from "zod";

// server/_core/notification.ts
import { TRPCError } from "@trpc/server";
async function notifyOwner(payload) {
  if (!payload.title?.trim() || !payload.content?.trim()) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Notification title and content are required."
    });
  }
  console.log("[Notification] Owner notification:", payload.title);
  return true;
}

// server/_core/trpc.ts
import { initTRPC, TRPCError as TRPCError2 } from "@trpc/server";
import superjson from "superjson";
var t = initTRPC.context().create({
  transformer: superjson
});
var router = t.router;
var publicProcedure = t.procedure;
var requireUser = t.middleware(async (opts) => {
  const { ctx, next } = opts;
  if (!ctx.user) {
    throw new TRPCError2({ code: "UNAUTHORIZED", message: UNAUTHED_ERR_MSG });
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.user
    }
  });
});
var protectedProcedure = t.procedure.use(requireUser);
var adminProcedure = t.procedure.use(
  t.middleware(async (opts) => {
    const { ctx, next } = opts;
    if (!ctx.user || ctx.user.role !== "admin") {
      throw new TRPCError2({ code: "FORBIDDEN", message: NOT_ADMIN_ERR_MSG });
    }
    return next({
      ctx: {
        ...ctx,
        user: ctx.user
      }
    });
  })
);

// server/_core/systemRouter.ts
var systemRouter = router({
  health: publicProcedure.input(
    z.object({
      timestamp: z.number().min(0, "timestamp cannot be negative")
    })
  ).query(() => ({
    ok: true
  })),
  notifyOwner: adminProcedure.input(
    z.object({
      title: z.string().min(1, "title is required"),
      content: z.string().min(1, "content is required")
    })
  ).mutation(async ({ input }) => {
    const delivered = await notifyOwner(input);
    return {
      success: delivered
    };
  })
});

// server/routers.ts
import { z as z2 } from "zod";

// server/db.ts
import { eq, desc, and, like, lt } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

// drizzle/schema.ts
import { int, mysqlEnum, mysqlTable, text, timestamp, tinyint, uniqueIndex, varchar } from "drizzle-orm/mysql-core";
var users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  passwordHash: varchar("passwordHash", { length: 255 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull()
});
var blogPosts = mysqlTable("blog_posts", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 500 }).notNull(),
  slug: varchar("slug", { length: 500 }).notNull().unique(),
  content: text("content").notNull(),
  htmlContent: text("htmlContent"),
  excerpt: text("excerpt"),
  featuredImage: text("featuredImage"),
  language: mysqlEnum("language", ["es", "en"]).default("es").notNull(),
  status: mysqlEnum("status", ["draft", "published", "archived"]).default("draft").notNull(),
  metaDescription: varchar("metaDescription", { length: 160 }),
  category: varchar("category", { length: 100 }),
  tags: text("tags"),
  newsletterId: int("newsletterId"),
  publishedAt: timestamp("publishedAt"),
  createdBy: int("createdBy"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
});
var newsArticles = mysqlTable("ca_news_articles", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 500 }).notNull(),
  slug: varchar("slug", { length: 500 }).notNull().unique(),
  description: text("description"),
  content: text("content"),
  body: text("body"),
  // Full HTML editorial content (rewritten by Gemini)
  url: varchar("url", { length: 1e3 }).notNull(),
  source: varchar("source", { length: 255 }).notNull(),
  author: varchar("author", { length: 255 }).default("Equipo Comprando Am\xE9rica").notNull(),
  category: mysqlEnum("category", ["visas-migracion", "economia-finanzas", "bienes-raices", "llc-negocios", "inversiones"]).notNull(),
  imageUrl: varchar("imageUrl", { length: 1e3 }),
  ctaType: varchar("ctaType", { length: 100 }),
  // membresia, formacion, visa-e2, bienes-raices, estructura, expansion
  // --- Editorial workflow ---
  status: mysqlEnum("status", ["candidate", "draft", "approved", "published", "rejected", "archived"]).default("published").notNull(),
  relevanceScore: tinyint("relevanceScore"),
  rejectionReason: varchar("rejectionReason", { length: 256 }),
  // --- Raw payload captured from feed (kept verbatim for re-processing) ---
  rawTitle: text("rawTitle"),
  rawSummary: text("rawSummary"),
  rawContent: text("rawContent"),
  rawAuthor: varchar("rawAuthor", { length: 256 }),
  rawImageUrl: varchar("rawImageUrl", { length: 1024 }),
  externalHash: varchar("externalHash", { length: 64 }),
  // SHA-256 of normalized URL, used for dedup
  feedId: int("feedId"),
  // FK to ca_news_feeds.id (soft reference, no DB constraint)
  // --- AI / image enrichment ---
  heroImagePrompt: text("heroImagePrompt"),
  // prompt used for Pexels search / Gemini fallback
  tags: text("tags"),
  // JSON array of editorial tags
  // --- Timestamps ---
  publishedAt: timestamp("publishedAt").notNull(),
  // original publish date from the source feed
  publishedAtInternal: timestamp("publishedAtInternal"),
  // when WE published it on Comprando América
  draftedAt: timestamp("draftedAt"),
  approvedAt: timestamp("approvedAt"),
  fetchedAt: timestamp("fetchedAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
}, (table) => ({
  externalHashIdx: uniqueIndex("ca_news_articles_externalHash_unique").on(table.externalHash)
}));
var newsFeeds = mysqlTable("ca_news_feeds", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }),
  url: varchar("url", { length: 1e3 }),
  category: varchar("category", { length: 50 }),
  language: mysqlEnum("language", ["es", "en"]).default("es").notNull(),
  priority: tinyint("priority").default(5).notNull(),
  // 1 (low) - 10 (high), used for ranking when multiple candidates compete for the same slot
  isActive: varchar("isActive", { length: 5 }).default("true").notNull(),
  lastFetchedAt: timestamp("lastFetchedAt"),
  lastError: text("lastError"),
  consecutiveFailures: int("consecutiveFailures").default(0).notNull(),
  // auto-deactivate after 5 in a row
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow()
});
var newsSubscribers = mysqlTable("ca_news_subscribers", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  categories: text("categories").notNull(),
  // JSON array of subscribed categories
  isActive: varchar("isActive", { length: 5 }).default("true"),
  verificationToken: varchar("verificationToken", { length: 255 }),
  isVerified: varchar("isVerified", { length: 5 }).default("false"),
  unsubscribeToken: varchar("unsubscribeToken", { length: 255 }).unique(),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow()
});
var socialPosts = mysqlTable("ca_social_posts", {
  id: int("id").autoincrement().primaryKey(),
  articleId: int("articleId"),
  network: mysqlEnum("network", ["facebook", "instagram", "tiktok", "linkedin", "threads", "x", "youtube"]).notNull(),
  postType: mysqlEnum("postType", ["carousel", "reel", "short", "post", "story"]).notNull(),
  language: mysqlEnum("language", ["es", "en"]).default("es").notNull(),
  caption: text("caption"),
  mediaUrls: text("mediaUrls"),
  // JSON array of Cloudinary URLs (slides for a carousel, single image for a post, etc.)
  metricoolId: varchar("metricoolId", { length: 128 }),
  scheduledAt: timestamp("scheduledAt"),
  postedAt: timestamp("postedAt"),
  status: mysqlEnum("status", ["queued", "scheduled", "posted", "failed"]).default("queued").notNull(),
  error: text("error"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
});
var ingestionRuns = mysqlTable("ca_ingestion_runs", {
  id: int("id").autoincrement().primaryKey(),
  feedId: int("feedId"),
  startedAt: timestamp("startedAt").defaultNow().notNull(),
  finishedAt: timestamp("finishedAt"),
  itemsFound: int("itemsFound").default(0).notNull(),
  itemsNew: int("itemsNew").default(0).notNull(),
  itemsSkipped: int("itemsSkipped").default(0).notNull(),
  error: text("error")
});

// server/db.ts
init_env();
var _db = null;
async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      const pool = mysql.createPool({
        uri: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: true },
        connectionLimit: 5
      });
      const conn = await pool.getConnection();
      conn.release();
      _db = drizzle(pool);
    } catch (error) {
      console.error("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}
async function upsertUser(user) {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }
  try {
    const values = {
      openId: user.openId
    };
    const updateSet = {};
    const textFields = ["name", "email", "loginMethod"];
    const assignNullable = (field) => {
      const value = user[field];
      if (value === void 0) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };
    textFields.forEach(assignNullable);
    if (user.lastSignedIn !== void 0) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== void 0) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }
    if (!values.lastSignedIn) {
      values.lastSignedIn = /* @__PURE__ */ new Date();
    }
    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = /* @__PURE__ */ new Date();
    }
    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}
async function getUserByOpenId(openId) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return void 0;
  }
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : void 0;
}
async function getUserByEmail(email) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user by email: database not available");
    return void 0;
  }
  const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
  return result.length > 0 ? result[0] : void 0;
}
async function createCmsUser(data) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create CMS user: database not available");
    return void 0;
  }
  const { nanoid: nanoid2 } = await import("nanoid");
  const openId = `cms_${nanoid2(16)}`;
  const result = await db.insert(users).values({
    openId,
    name: data.name,
    email: data.email,
    passwordHash: data.passwordHash,
    loginMethod: "email",
    role: data.role,
    lastSignedIn: /* @__PURE__ */ new Date()
  });
  return { id: Number(result[0].insertId), openId };
}
async function getAllUsers() {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get users: database not available");
    return [];
  }
  return await db.select().from(users);
}
async function getUserById(id) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return void 0;
  }
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result.length > 0 ? result[0] : void 0;
}
async function updateUser(id, data) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update user: database not available");
    return;
  }
  await db.update(users).set(data).where(eq(users.id, id));
}
async function deleteUser(id) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot delete user: database not available");
    return;
  }
  await db.delete(users).where(eq(users.id, id));
}
async function getAllBlogPosts() {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get blog posts: database not available");
    return [];
  }
  return await db.select().from(blogPosts);
}
async function getPublishedBlogPosts() {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get published blog posts: database not available");
    return [];
  }
  return await db.select().from(blogPosts).where(eq(blogPosts.status, "published"));
}
async function getBlogPostById(id) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get blog post: database not available");
    return void 0;
  }
  const result = await db.select().from(blogPosts).where(eq(blogPosts.id, id)).limit(1);
  return result.length > 0 ? result[0] : void 0;
}
async function getBlogPostBySlug(slug) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get blog post: database not available");
    return void 0;
  }
  const result = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug)).limit(1);
  return result.length > 0 ? result[0] : void 0;
}
async function createBlogPost(data) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create blog post: database not available");
    return;
  }
  const result = await db.insert(blogPosts).values(data);
  return result;
}
async function updateBlogPost(id, data) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update blog post: database not available");
    return;
  }
  await db.update(blogPosts).set(data).where(eq(blogPosts.id, id));
}
async function deleteBlogPost(id) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot delete blog post: database not available");
    return;
  }
  await db.delete(blogPosts).where(eq(blogPosts.id, id));
}
async function getLatestNewsArticles(limit = 20) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get news articles: database not available");
    return [];
  }
  return await db.select().from(newsArticles).where(eq(newsArticles.status, "published")).orderBy(desc(newsArticles.publishedAt)).limit(limit);
}
async function getNewsArticlesByCategory(category, limit = 20) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get news articles: database not available");
    return [];
  }
  return await db.select().from(newsArticles).where(and(eq(newsArticles.category, category), eq(newsArticles.status, "published"))).orderBy(desc(newsArticles.publishedAt)).limit(limit);
}
async function searchNewsArticles(query, limit = 20) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot search news articles: database not available");
    return [];
  }
  return await db.select().from(newsArticles).where(and(like(newsArticles.title, `%${query}%`), eq(newsArticles.status, "published"))).orderBy(desc(newsArticles.publishedAt)).limit(limit);
}
async function getNewsArticleById(id) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get news article: database not available");
    return void 0;
  }
  const result = await db.select().from(newsArticles).where(eq(newsArticles.id, id)).limit(1);
  return result.length > 0 ? result[0] : void 0;
}
async function getNewsArticleBySlug(slug) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get news article: database not available");
    return void 0;
  }
  const result = await db.select().from(newsArticles).where(eq(newsArticles.slug, slug)).limit(1);
  return result.length > 0 ? result[0] : void 0;
}
async function createNewsArticle(data) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create news article: database not available");
    return;
  }
  try {
    await db.insert(newsArticles).values(data);
    const result = await db.select().from(newsArticles).where(eq(newsArticles.url, data.url)).limit(1);
    return result.length > 0 ? result[0] : void 0;
  } catch (error) {
    console.warn("[Database] Article URL already exists:", data.url);
    return null;
  }
}
async function deleteNewsArticle(id) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot delete news article: database not available");
    return;
  }
  await db.delete(newsArticles).where(eq(newsArticles.id, id));
}
async function getAllNewsFeeds() {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get news feeds: database not available");
    return [];
  }
  return await db.select().from(newsFeeds);
}
async function createNewsFeed(data) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create news feed: database not available");
    return;
  }
  await db.insert(newsFeeds).values(data);
  const result = await db.select().from(newsFeeds).where(eq(newsFeeds.url, data.url)).limit(1);
  return result.length > 0 ? result[0] : void 0;
}
async function deleteNewsFeed(id) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot delete news feed: database not available");
    return;
  }
  await db.delete(newsFeeds).where(eq(newsFeeds.id, id));
}
async function createNewsSubscriber(email, name, categories) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create news subscriber: database not available");
    return;
  }
  const verificationToken = Math.random().toString(36).substring(2, 15);
  const unsubscribeToken = Math.random().toString(36).substring(2, 15);
  const result = await db.insert(newsSubscribers).values({
    email,
    name,
    categories: JSON.stringify(categories),
    verificationToken,
    unsubscribeToken,
    isActive: "true",
    isVerified: "false"
  });
  return result;
}
async function getNewsSubscriber(email) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get news subscriber: database not available");
    return void 0;
  }
  const result = await db.select().from(newsSubscribers).where(eq(newsSubscribers.email, email)).limit(1);
  return result.length > 0 ? result[0] : void 0;
}
async function verifyNewsSubscriber(token) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot verify news subscriber: database not available");
    return void 0;
  }
  const subscriber = await db.select().from(newsSubscribers).where(eq(newsSubscribers.verificationToken, token)).limit(1);
  if (subscriber.length === 0) return null;
  await db.update(newsSubscribers).set({ isVerified: "true", verificationToken: null }).where(eq(newsSubscribers.id, subscriber[0].id));
  const updated = await db.select().from(newsSubscribers).where(eq(newsSubscribers.id, subscriber[0].id)).limit(1);
  return updated.length > 0 ? updated[0] : subscriber[0];
}
async function unsubscribeNewsSubscriber(token) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot unsubscribe news subscriber: database not available");
    return void 0;
  }
  const subscriber = await db.select().from(newsSubscribers).where(eq(newsSubscribers.unsubscribeToken, token)).limit(1);
  if (subscriber.length === 0) return null;
  await db.update(newsSubscribers).set({ isActive: "false" }).where(eq(newsSubscribers.id, subscriber[0].id));
  const updated = await db.select().from(newsSubscribers).where(eq(newsSubscribers.id, subscriber[0].id)).limit(1);
  return updated.length > 0 ? updated[0] : subscriber[0];
}

// server/routers.ts
import { TRPCError as TRPCError3 } from "@trpc/server";
init_env();
import bcrypt from "bcryptjs";

// shared/_core/errors.ts
var HttpError = class extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.name = "HttpError";
  }
};
var ForbiddenError = (msg) => new HttpError(403, msg);

// server/_core/sdk.ts
import { parse as parseCookieHeader } from "cookie";
import { SignJWT, jwtVerify } from "jose";
init_env();
var isNonEmptyString = (value) => typeof value === "string" && value.length > 0;
var SDKServer = class {
  parseCookies(cookieHeader) {
    if (!cookieHeader) {
      return /* @__PURE__ */ new Map();
    }
    const parsed = parseCookieHeader(cookieHeader);
    return new Map(Object.entries(parsed));
  }
  getSessionSecret() {
    const secret = ENV.cookieSecret;
    return new TextEncoder().encode(secret);
  }
  async createSessionToken(openId, options = {}) {
    return this.signSession(
      {
        openId,
        appId: ENV.appId,
        name: options.name || ""
      },
      options
    );
  }
  async signSession(payload, options = {}) {
    const issuedAt = Date.now();
    const expiresInMs = options.expiresInMs ?? 7 * 24 * 60 * 60 * 1e3;
    const expirationSeconds = Math.floor((issuedAt + expiresInMs) / 1e3);
    const secretKey = this.getSessionSecret();
    return new SignJWT({
      openId: payload.openId,
      appId: payload.appId,
      name: payload.name
    }).setProtectedHeader({ alg: "HS256", typ: "JWT" }).setExpirationTime(expirationSeconds).sign(secretKey);
  }
  async verifySession(cookieValue) {
    if (!cookieValue) {
      return null;
    }
    try {
      const secretKey = this.getSessionSecret();
      const { payload } = await jwtVerify(cookieValue, secretKey, {
        algorithms: ["HS256"]
      });
      const { openId, appId, name } = payload;
      if (!isNonEmptyString(openId) || !isNonEmptyString(appId) || !isNonEmptyString(name)) {
        return null;
      }
      return { openId, appId, name };
    } catch {
      return null;
    }
  }
  async authenticateRequest(req) {
    const cookies = this.parseCookies(req.headers.cookie);
    const sessionCookie = cookies.get(COOKIE_NAME);
    const session = await this.verifySession(sessionCookie);
    if (!session) {
      throw ForbiddenError("Invalid session cookie");
    }
    const user = await getUserByOpenId(session.openId);
    if (!user) {
      throw ForbiddenError("User not found");
    }
    await upsertUser({
      openId: user.openId,
      lastSignedIn: /* @__PURE__ */ new Date()
    });
    return user;
  }
};
var sdk = new SDKServer();

// server/routers.ts
async function createCmsSessionToken(user) {
  const token = await sdk.signSession({
    openId: user.openId,
    appId: ENV.appId,
    name: user.name || user.email || "CMS User"
  }, { expiresInMs: 7 * 24 * 60 * 60 * 1e3 });
  return token;
}
function requireCmsAccess(role) {
  if (role !== "admin" && role !== "user") {
    throw new TRPCError3({ code: "FORBIDDEN", message: "Acceso denegado al CMS" });
  }
}
var appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true };
    })
  }),
  // ═══ CMS AUTH ROUTER ═══
  cmsAuth: router({
    login: publicProcedure.input(z2.object({
      email: z2.string().email("Email inv\xE1lido"),
      password: z2.string().min(1, "La contrase\xF1a es requerida")
    })).mutation(async ({ ctx, input }) => {
      const user = await getUserByEmail(input.email);
      if (!user || !user.passwordHash) {
        throw new TRPCError3({ code: "UNAUTHORIZED", message: "Email o contrase\xF1a incorrectos" });
      }
      const valid = await bcrypt.compare(input.password, user.passwordHash);
      if (!valid) {
        throw new TRPCError3({ code: "UNAUTHORIZED", message: "Email o contrase\xF1a incorrectos" });
      }
      await updateUser(user.id, { lastSignedIn: /* @__PURE__ */ new Date() });
      const token = await createCmsSessionToken(user);
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.cookie(COOKIE_NAME, token, {
        ...cookieOptions,
        maxAge: 7 * 24 * 60 * 60 * 1e3
        // 7 days
      });
      return {
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      };
    }),
    register: publicProcedure.input(z2.object({
      name: z2.string().min(2, "El nombre debe tener al menos 2 caracteres"),
      email: z2.string().email("Email inv\xE1lido"),
      password: z2.string().min(6, "La contrase\xF1a debe tener al menos 6 caracteres"),
      role: z2.enum(["admin", "user"]).default("user")
    })).mutation(async ({ input }) => {
      const existing = await getUserByEmail(input.email);
      if (existing) {
        throw new TRPCError3({ code: "CONFLICT", message: "Ya existe un usuario con este email" });
      }
      const passwordHash = await bcrypt.hash(input.password, 12);
      const result = await createCmsUser({
        name: input.name,
        email: input.email,
        passwordHash,
        role: input.role
      });
      if (!result) {
        throw new TRPCError3({ code: "INTERNAL_SERVER_ERROR", message: "Error al crear usuario" });
      }
      return { success: true, userId: result.id };
    })
  }),
  // ═══ USERS ROUTER ═══
  users: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      requireCmsAccess(ctx.user.role);
      const allUsers = await getAllUsers();
      return allUsers.map(({ passwordHash, ...rest }) => rest);
    }),
    getById: protectedProcedure.input(z2.object({ id: z2.number() })).query(async ({ ctx, input }) => {
      requireCmsAccess(ctx.user.role);
      const user = await getUserById(input.id);
      if (user) {
        const { passwordHash, ...rest } = user;
        return rest;
      }
      return void 0;
    }),
    create: protectedProcedure.input(z2.object({
      name: z2.string().min(2),
      email: z2.string().email(),
      password: z2.string().min(6),
      role: z2.enum(["admin", "user"]).default("user")
    })).mutation(async ({ ctx, input }) => {
      requireCmsAccess(ctx.user.role);
      const existing = await getUserByEmail(input.email);
      if (existing) {
        throw new TRPCError3({ code: "CONFLICT", message: "Ya existe un usuario con este email" });
      }
      const passwordHash = await bcrypt.hash(input.password, 12);
      const result = await createCmsUser({
        name: input.name,
        email: input.email,
        passwordHash,
        role: input.role
      });
      if (!result) {
        throw new TRPCError3({ code: "INTERNAL_SERVER_ERROR", message: "Error al crear usuario" });
      }
      return { success: true, userId: result.id };
    }),
    update: protectedProcedure.input(z2.object({
      id: z2.number(),
      name: z2.string().optional(),
      email: z2.string().email().optional(),
      role: z2.enum(["user", "admin"]).optional(),
      password: z2.string().min(6).optional()
    })).mutation(async ({ ctx, input }) => {
      requireCmsAccess(ctx.user.role);
      const { id, password, ...data } = input;
      const updateData = { ...data };
      if (password) {
        updateData.passwordHash = await bcrypt.hash(password, 12);
      }
      await updateUser(id, updateData);
      return { success: true };
    }),
    delete: protectedProcedure.input(z2.object({ id: z2.number() })).mutation(async ({ ctx, input }) => {
      requireCmsAccess(ctx.user.role);
      if (ctx.user.id === input.id) {
        throw new TRPCError3({ code: "BAD_REQUEST", message: "No puedes eliminar tu propia cuenta" });
      }
      await deleteUser(input.id);
      return { success: true };
    })
  }),
  // ═══ BLOG POSTS ROUTER ═══
  blogPosts: router({
    // Public: list published posts
    listPublished: publicProcedure.query(async () => {
      return await getPublishedBlogPosts();
    }),
    // Public: get post by slug
    getBySlug: publicProcedure.input(z2.object({ slug: z2.string() })).query(async ({ input }) => {
      return await getBlogPostBySlug(input.slug);
    }),
    // CMS: list all posts
    listAll: protectedProcedure.query(async ({ ctx }) => {
      requireCmsAccess(ctx.user.role);
      return await getAllBlogPosts();
    }),
    // CMS: get post by id
    getById: protectedProcedure.input(z2.object({ id: z2.number() })).query(async ({ ctx, input }) => {
      requireCmsAccess(ctx.user.role);
      return await getBlogPostById(input.id);
    }),
    // CMS: create post
    create: protectedProcedure.input(z2.object({
      title: z2.string(),
      slug: z2.string(),
      excerpt: z2.string().optional(),
      content: z2.string(),
      featuredImage: z2.string().optional(),
      status: z2.enum(["draft", "published", "archived"]).default("draft"),
      publishedAt: z2.date().optional()
    })).mutation(async ({ ctx, input }) => {
      requireCmsAccess(ctx.user.role);
      await createBlogPost({ ...input, createdBy: ctx.user.id });
      return { success: true };
    }),
    // CMS: update post
    update: protectedProcedure.input(z2.object({
      id: z2.number(),
      title: z2.string().optional(),
      slug: z2.string().optional(),
      excerpt: z2.string().optional(),
      content: z2.string().optional(),
      featuredImage: z2.string().optional(),
      status: z2.enum(["draft", "published", "archived"]).optional(),
      publishedAt: z2.date().optional()
    })).mutation(async ({ ctx, input }) => {
      requireCmsAccess(ctx.user.role);
      const { id, ...data } = input;
      await updateBlogPost(id, data);
      return { success: true };
    }),
    // CMS: delete post
    delete: protectedProcedure.input(z2.object({ id: z2.number() })).mutation(async ({ ctx, input }) => {
      requireCmsAccess(ctx.user.role);
      await deleteBlogPost(input.id);
      return { success: true };
    })
  }),
  // ═══ NEWS ROUTER ═══
  news: router({
    // Public: get latest news
    getLatest: publicProcedure.input(z2.object({ limit: z2.number().default(20) })).query(async ({ input }) => {
      return await getLatestNewsArticles(input.limit);
    }),
    // Public: get news by category
    getByCategory: publicProcedure.input(z2.object({ category: z2.string(), limit: z2.number().default(20) })).query(async ({ input }) => {
      return await getNewsArticlesByCategory(input.category, input.limit);
    }),
    // Public: search news
    search: publicProcedure.input(z2.object({ query: z2.string(), limit: z2.number().default(20) })).query(async ({ input }) => {
      return await searchNewsArticles(input.query, input.limit);
    }),
    // Public: get single article by id
    getById: publicProcedure.input(z2.object({ id: z2.number() })).query(async ({ input }) => {
      return await getNewsArticleById(input.id);
    }),
    // Public: get single article by slug
    getBySlug: publicProcedure.input(z2.object({ slug: z2.string() })).query(async ({ input }) => {
      return await getNewsArticleBySlug(input.slug);
    }),
    // Admin: create article (manual)
    create: protectedProcedure.input(z2.object({
      title: z2.string(),
      slug: z2.string().optional(),
      description: z2.string().optional(),
      content: z2.string().optional(),
      body: z2.string().optional(),
      url: z2.string(),
      source: z2.string(),
      author: z2.string().optional(),
      category: z2.string(),
      imageUrl: z2.string().optional(),
      ctaType: z2.string().optional(),
      publishedAt: z2.date()
    })).mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError3({ code: "FORBIDDEN", message: NOT_ADMIN_ERR_MSG });
      }
      const slug = input.slug || input.title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      await createNewsArticle({ ...input, slug });
      return { success: true };
    }),
    // Admin: delete article
    delete: protectedProcedure.input(z2.object({ id: z2.number() })).mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError3({ code: "FORBIDDEN", message: NOT_ADMIN_ERR_MSG });
      }
      await deleteNewsArticle(input.id);
      return { success: true };
    }),
    // Admin: get all feeds
    getFeeds: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError3({ code: "FORBIDDEN", message: NOT_ADMIN_ERR_MSG });
      }
      return await getAllNewsFeeds();
    }),
    // Admin: create feed
    createFeed: protectedProcedure.input(z2.object({
      name: z2.string(),
      url: z2.string(),
      category: z2.string()
    })).mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError3({ code: "FORBIDDEN", message: NOT_ADMIN_ERR_MSG });
      }
      await createNewsFeed({ ...input, isActive: "true" });
      return { success: true };
    }),
    // Admin: delete feed
    deleteFeed: protectedProcedure.input(z2.object({ id: z2.number() })).mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError3({ code: "FORBIDDEN", message: NOT_ADMIN_ERR_MSG });
      }
      await deleteNewsFeed(input.id);
      return { success: true };
    })
  }),
  // NEWS SUBSCRIBERS ROUTER
  newsSubscriber: router({
    // Public: subscribe to news
    subscribe: publicProcedure.input(z2.object({
      email: z2.string().email("Email invalido"),
      name: z2.string().optional(),
      categories: z2.array(z2.string()).default(["all"])
    })).mutation(async ({ input }) => {
      const existing = await getNewsSubscriber(input.email);
      if (existing) {
        throw new TRPCError3({ code: "CONFLICT", message: "Este email ya esta suscrito" });
      }
      await createNewsSubscriber(input.email, input.name, input.categories);
      return { success: true, message: "Verifica tu email para confirmar la suscripcion" };
    }),
    // Public: verify subscription
    verify: publicProcedure.input(z2.object({ token: z2.string() })).mutation(async ({ input }) => {
      const subscriber = await verifyNewsSubscriber(input.token);
      if (!subscriber) {
        throw new TRPCError3({ code: "NOT_FOUND", message: "Token de verificacion invalido" });
      }
      return { success: true, message: "Suscripcion verificada" };
    }),
    // Public: unsubscribe
    unsubscribe: publicProcedure.input(z2.object({ token: z2.string() })).mutation(async ({ input }) => {
      const subscriber = await unsubscribeNewsSubscriber(input.token);
      if (!subscriber) {
        throw new TRPCError3({ code: "NOT_FOUND", message: "Token de desuscripcion invalido" });
      }
      return { success: true, message: "Te has desuscrito correctamente" };
    })
  })
});

// server/_core/context.ts
async function createContext(opts) {
  let user = null;
  try {
    user = await sdk.authenticateRequest(opts.req);
  } catch (error) {
    user = null;
  }
  return {
    req: opts.req,
    res: opts.res,
    user
  };
}

// server/_core/vite.ts
import express from "express";
import fs from "fs";
import { nanoid } from "nanoid";
import path2 from "path";
import { createServer as createViteServer } from "vite";

// vite.config.ts
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig } from "vite";
var plugins = [react(), tailwindcss()];
var vite_config_default = defineConfig({
  plugins,
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  envDir: path.resolve(import.meta.dirname),
  root: path.resolve(import.meta.dirname, "client"),
  publicDir: path.resolve(import.meta.dirname, "client", "public"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    host: true,
    allowedHosts: true
  }
});

// server/_core/vite.ts
async function setupVite(app, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    server: serverOptions,
    appType: "custom"
  });
  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "../..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app) {
  const distPath = process.env.NODE_ENV === "development" ? path2.resolve(import.meta.dirname, "../..", "dist", "public") : path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    console.error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app.use(express.static(distPath));
  app.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/rss-sync.ts
function initializeRssScheduler() {
  console.log(
    "[rss-sync] DEPRECATED initializer. The scheduler has moved to GitHub Actions; this is a no-op."
  );
}

// server/cron/scheduler.ts
import { spawn } from "node:child_process";
import fs2 from "node:fs";
import path3 from "node:path";
import cron from "node-cron";
var TZ = "America/Chicago";
var TASK_TIMEOUT_MS = 20 * 60 * 1e3;
var activeTasks = 0;
function findProjectRoot() {
  return process.cwd();
}
function findTsx(projectRoot) {
  const candidates = [
    path3.join(projectRoot, "node_modules", ".bin", "tsx"),
    path3.join(projectRoot, "node_modules", ".pnpm", "node_modules", ".bin", "tsx")
  ];
  for (const c of candidates) {
    if (fs2.existsSync(c)) return c;
  }
  return "tsx";
}
function runStage(name, scriptRelativeToRoot, extraArgs = []) {
  return new Promise((resolve) => {
    activeTasks++;
    console.log(`[cron] \u25B6 ${name}${extraArgs.length ? " " + extraArgs.join(" ") : ""}`);
    const start = Date.now();
    const projectRoot = findProjectRoot();
    const scriptPath = path3.resolve(projectRoot, scriptRelativeToRoot);
    const tsxBin = findTsx(projectRoot);
    const child = spawn(tsxBin, [scriptPath, ...extraArgs], {
      cwd: projectRoot,
      env: process.env,
      stdio: "pipe",
      shell: tsxBin === "tsx"
      // need a shell only if we're falling back to PATH lookup
    });
    const killer = setTimeout(() => {
      console.warn(`[cron] \u23F0 ${name} timed out after ${TASK_TIMEOUT_MS / 1e3}s \u2014 killing`);
      child.kill("SIGKILL");
    }, TASK_TIMEOUT_MS);
    child.stdout?.on("data", (d) => process.stdout.write(`[${name}] ${d}`));
    child.stderr?.on("data", (d) => process.stderr.write(`[${name}] ${d}`));
    child.on("exit", (code, signal) => {
      clearTimeout(killer);
      activeTasks--;
      const elapsed = ((Date.now() - start) / 1e3).toFixed(1);
      console.log(
        `[cron] ${code === 0 ? "\u2714" : "\u2718"} ${name} exited code=${code}${signal ? ` signal=${signal}` : ""} in ${elapsed}s`
      );
      resolve();
    });
    child.on("error", (err) => {
      clearTimeout(killer);
      activeTasks--;
      console.error(`[cron] \u2718 ${name} failed to spawn: ${err.message}`);
      resolve();
    });
  });
}
async function runPipeline() {
  if (activeTasks > 0) {
    console.log(`[cron] \u23ED pipeline tick skipped \u2014 ${activeTasks} task(s) still running`);
    return;
  }
  await runStage("ingest", "server/ingest/fetch.ts");
  await runStage("rewrite", "server/ai/rewrite.ts");
  await runStage("images", "server/ai/generate-images.ts");
  await runStage("auto-publish", "server/ai/auto-publish.ts");
  console.log("[cron] \u2714 pipeline tick complete");
}
async function rewriteArticleNow(id) {
  if (activeTasks >= 3) {
    return { started: false, reason: `too many concurrent tasks (${activeTasks})` };
  }
  void runStage(`rewrite[id=${id}]`, "server/ai/rewrite.ts", ["--id", String(id)]);
  return { started: true };
}
async function regenerateImageNow(id) {
  if (activeTasks >= 3) {
    return { started: false, reason: `too many concurrent tasks (${activeTasks})` };
  }
  void runStage(`images[id=${id}]`, "server/ai/generate-images.ts", ["--id", String(id)]);
  return { started: true };
}
async function triggerPipelineNow() {
  if (activeTasks > 0) {
    return { started: false, reason: `pipeline busy (${activeTasks} task(s) running)` };
  }
  void runPipeline();
  return { started: true };
}
function startScheduler() {
  if (process.env.DISABLE_NEWS_CRON === "true") {
    console.log("[cron] DISABLE_NEWS_CRON=true \u2014 scheduler not started");
    return;
  }
  if (process.env.NODE_ENV !== "production" && process.env.ENABLE_NEWS_CRON !== "true") {
    console.log("[cron] dev environment \u2014 scheduler not started (set ENABLE_NEWS_CRON=true to override)");
    return;
  }
  cron.schedule(
    "0 0,6,12,18 * * *",
    () => {
      runPipeline().catch((err) => console.error("[cron] pipeline crashed:", err));
    },
    { timezone: TZ }
  );
  console.log(`[cron] Scheduler started \u2014 jobs registered (TZ=${TZ})`);
  console.log("[cron]   \u2022 pipeline tick: 00:00, 06:00, 12:00, 18:00 CT");
}

// server/routes/admin.ts
import { and as and2, desc as desc2, eq as eq3, like as like2 } from "drizzle-orm";
import { Router } from "express";
init_env();

// server/ingest/seed-feeds.ts
import { eq as eq2 } from "drizzle-orm";

// server/_core/dbClient.ts
import "dotenv/config";
import { drizzle as drizzle2 } from "drizzle-orm/mysql2";
import mysql2 from "mysql2/promise";
var _pool = null;
var _db2 = null;
function getCliDb() {
  if (_db2) return _db2;
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is required");
  _pool = mysql2.createPool({
    uri: url,
    ssl: { rejectUnauthorized: true },
    connectionLimit: 4
  });
  _db2 = drizzle2(_pool);
  return _db2;
}
async function closeCliDb() {
  if (_pool) {
    await _pool.end();
    _pool = null;
    _db2 = null;
  }
}

// server/ingest/sources.ts
var SOURCES = [
  // ─────────────── VISAS Y MIGRACIÓN ───────────────
  // Note: USCIS, State Department, Univision, Voz de América and Boundless
  // were dropped here — the official .gov feeds 404 (RSS discontinued) and
  // the news outlets' feeds either malformed XML or blocked the bot UA.
  // Replaced with the two largest US immigration law firms' blogs, which
  // publish detailed E-2 / treaty-investor analyses regularly.
  {
    slug: "murthy-law",
    name: "Murthy Law Firm \u2014 Immigration",
    homepage: "https://www.murthy.com/",
    feedUrl: "https://www.murthy.com/feed/",
    category: "visas-migracion",
    language: "en",
    priority: 9
  },
  {
    slug: "bal-immigration",
    name: "Berry Appleman & Leiden \u2014 Immigration",
    homepage: "https://www.bal.com/",
    feedUrl: "https://www.bal.com/feed/",
    category: "visas-migracion",
    language: "en",
    priority: 9
  },
  // ─────────────── ECONOMÍA Y FINANZAS ───────────────
  {
    slug: "wsj-markets",
    name: "WSJ \u2014 Markets",
    homepage: "https://www.wsj.com/news/markets",
    feedUrl: "https://feeds.a.dj.com/rss/RSSMarketsMain.xml",
    category: "economia-finanzas",
    language: "en",
    priority: 9
  },
  {
    slug: "cnbc-top",
    name: "CNBC \u2014 Top News",
    homepage: "https://www.cnbc.com",
    feedUrl: "https://www.cnbc.com/id/100003114/device/rss/rss.html",
    category: "economia-finanzas",
    language: "en",
    priority: 8
  },
  {
    slug: "marketwatch-top",
    name: "MarketWatch \u2014 Top Stories",
    homepage: "https://www.marketwatch.com",
    feedUrl: "http://feeds.marketwatch.com/marketwatch/topstories/",
    category: "economia-finanzas",
    language: "en",
    priority: 7
  },
  {
    slug: "el-financiero",
    name: "El Financiero (M\xE9xico)",
    homepage: "https://www.elfinanciero.com.mx",
    feedUrl: "https://www.elfinanciero.com.mx/rss/",
    category: "economia-finanzas",
    language: "es",
    priority: 8
  },
  {
    slug: "expansion-economia",
    name: "Expansi\xF3n \u2014 Econom\xEDa",
    homepage: "https://expansion.mx/economia",
    feedUrl: "https://expansion.mx/rss/economia",
    category: "economia-finanzas",
    language: "es",
    priority: 7
  },
  // ─────────────── BIENES RAÍCES (Texas-heavy + Florida) ───────────────
  {
    slug: "texas-realtors",
    name: "Texas REALTORS",
    homepage: "https://www.texasrealestate.com/about-us/news-and-events/",
    feedUrl: "https://www.texasrealestate.com/feed/",
    category: "bienes-raices",
    language: "en",
    priority: 10
  },
  {
    slug: "florida-realtors",
    name: "Florida Realtors",
    homepage: "https://www.floridarealtors.org/news-media",
    feedUrl: "https://www.floridarealtors.org/news-media/rss.xml",
    category: "bienes-raices",
    language: "en",
    priority: 10
  },
  {
    slug: "housingwire",
    name: "HousingWire",
    homepage: "https://www.housingwire.com",
    feedUrl: "https://www.housingwire.com/feed/",
    category: "bienes-raices",
    language: "en",
    priority: 8
  },
  {
    slug: "realtor-com-news",
    name: "Realtor.com News",
    homepage: "https://www.realtor.com/news/",
    feedUrl: "https://www.realtor.com/news/feed/",
    category: "bienes-raices",
    language: "en",
    priority: 7
  },
  // Bisnow Texas + South Florida dropped (404 on /feed). Replaced with Redfin
  // News (data-rich, market reports) and Real Estate News by Mike Sumsky.
  {
    slug: "redfin-news",
    name: "Redfin News",
    homepage: "https://www.redfin.com/news",
    feedUrl: "https://www.redfin.com/news/feed/",
    category: "bienes-raices",
    language: "en",
    priority: 8
  },
  {
    slug: "real-estate-news-blog",
    name: "Real Estate News Blog",
    homepage: "https://realestatenewsblog.com/",
    feedUrl: "https://feeds.feedburner.com/RealEstateNewsBlog",
    category: "bienes-raices",
    language: "en",
    priority: 6
  },
  // ─────────────── LLC Y NEGOCIOS (estructura + fiscal) ───────────────
  // IRS, Treasury and SBA RSS feeds were all 404 — those agencies stopped
  // publishing public RSS in favor of GovDelivery email. Tax Foundation,
  // Kiplinger Taxes plus the addition of CNBC Personal Finance carry the
  // category instead.
  {
    slug: "cnbc-personal-finance",
    name: "CNBC \u2014 Personal Finance",
    homepage: "https://www.cnbc.com/personal-finance/",
    feedUrl: "https://www.cnbc.com/id/10000115/device/rss/rss.html",
    category: "llc-negocios",
    language: "en",
    priority: 8
  },
  {
    slug: "tax-foundation",
    name: "Tax Foundation",
    homepage: "https://taxfoundation.org",
    feedUrl: "https://taxfoundation.org/feed/",
    category: "llc-negocios",
    language: "en",
    priority: 8
  },
  {
    slug: "kiplinger-tax",
    name: "Kiplinger \u2014 Taxes",
    homepage: "https://www.kiplinger.com/taxes",
    feedUrl: "https://www.kiplinger.com/feed/all",
    category: "llc-negocios",
    language: "en",
    priority: 7
  },
  // ─────────────── INVERSIONES ───────────────
  {
    slug: "cnbc-investing",
    name: "CNBC \u2014 Investing",
    homepage: "https://www.cnbc.com/investing/",
    feedUrl: "https://www.cnbc.com/id/15839069/device/rss/rss.html",
    category: "inversiones",
    language: "en",
    priority: 9
  },
  {
    slug: "yahoo-finance",
    name: "Yahoo Finance \u2014 News",
    homepage: "https://finance.yahoo.com/news/",
    feedUrl: "https://finance.yahoo.com/news/rssindex",
    category: "inversiones",
    language: "en",
    priority: 7
  },
  {
    slug: "cnbc-markets",
    name: "CNBC \u2014 Markets",
    homepage: "https://www.cnbc.com/markets/",
    feedUrl: "https://www.cnbc.com/id/15839135/device/rss/rss.html",
    category: "inversiones",
    language: "en",
    priority: 8
  },
  {
    slug: "motley-fool",
    name: "The Motley Fool",
    homepage: "https://www.fool.com/",
    feedUrl: "https://www.fool.com/feeds/index.aspx",
    category: "inversiones",
    language: "en",
    priority: 7
  },
  {
    slug: "seeking-alpha",
    name: "Seeking Alpha \u2014 Latest Articles",
    homepage: "https://seekingalpha.com",
    feedUrl: "https://seekingalpha.com/feed.xml",
    category: "inversiones",
    language: "en",
    priority: 6
  }
];

// server/ingest/seed-feeds.ts
async function seedFeeds(db) {
  const result = {
    inserted: 0,
    updated: 0,
    unchanged: 0,
    total: SOURCES.length,
    details: []
  };
  for (const seed of SOURCES) {
    const existing = await db.select().from(newsFeeds).where(eq2(newsFeeds.url, seed.feedUrl)).limit(1);
    if (existing.length === 0) {
      await db.insert(newsFeeds).values({
        name: seed.name,
        url: seed.feedUrl,
        category: seed.category,
        language: seed.language ?? "es",
        priority: seed.priority ?? 5,
        isActive: "true"
      });
      result.inserted++;
      result.details.push({ slug: seed.slug, action: "inserted", category: seed.category });
      continue;
    }
    const row = existing[0];
    const wantsUpdate = row.name !== seed.name || row.category !== seed.category || row.priority !== (seed.priority ?? 5) || row.language !== (seed.language ?? "es");
    if (wantsUpdate) {
      await db.update(newsFeeds).set({
        name: seed.name,
        category: seed.category,
        language: seed.language ?? "es",
        priority: seed.priority ?? 5
      }).where(eq2(newsFeeds.id, row.id));
      result.updated++;
      result.details.push({ slug: seed.slug, action: "updated", category: seed.category });
    } else {
      result.unchanged++;
      result.details.push({ slug: seed.slug, action: "unchanged", category: seed.category });
    }
  }
  return result;
}
async function runCli() {
  const db = getCliDb();
  const r = await seedFeeds(db);
  for (const d of r.details) {
    const mark = d.action === "inserted" ? "+" : d.action === "updated" ? "~" : " ";
    console.log(`  ${mark} ${d.action.padEnd(9)} ${d.slug.padEnd(28)} [${d.category}]`);
  }
  console.log(
    `
Done. inserted=${r.inserted}  updated=${r.updated}  unchanged=${r.unchanged}  total=${r.total}`
  );
}
if (process.argv[1] && process.argv[1].endsWith("seed-feeds.ts")) {
  runCli().catch((err) => {
    console.error("seed-feeds failed:", err);
    process.exitCode = 1;
  }).finally(async () => {
    await closeCliDb();
    process.exit(process.exitCode ?? 0);
  });
}

// server/routes/admin.ts
var ALLOWED_CATEGORIES = /* @__PURE__ */ new Set([
  "visas-migracion",
  "economia-finanzas",
  "bienes-raices",
  "llc-negocios",
  "inversiones"
]);
var ALLOWED_STATUSES = /* @__PURE__ */ new Set([
  "candidate",
  "draft",
  "approved",
  "published",
  "rejected",
  "archived"
]);
var ALLOWED_CTA = /* @__PURE__ */ new Set([
  "visa-e2",
  "bienes-raices",
  "estructura",
  "expansion",
  "formacion",
  "membresia"
]);
var EDITABLE_FIELDS = /* @__PURE__ */ new Set([
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
  "heroImagePrompt"
]);
function requireToken(req, res, next) {
  const expected = ENV.adminToken;
  if (!expected) {
    return res.status(503).json({
      error: "Admin API disabled: set ADMIN_TOKEN in the environment to enable."
    });
  }
  const header = req.header("authorization") || "";
  const bearer = header.toLowerCase().startsWith("bearer ") ? header.slice(7).trim() : null;
  const queryToken = typeof req.query.token === "string" ? req.query.token : null;
  const supplied = bearer || queryToken;
  if (!supplied || supplied !== expected) {
    return res.status(401).json({ error: "Invalid or missing admin token" });
  }
  next();
}
function asInt(v, fallback) {
  if (typeof v === "string" && v.trim() !== "") {
    const n = parseInt(v, 10);
    if (!Number.isNaN(n)) return n;
  }
  if (typeof v === "number") return v;
  return fallback;
}
function pickEditable(body) {
  const out = {};
  for (const [k, v] of Object.entries(body)) {
    if (!EDITABLE_FIELDS.has(k)) continue;
    if (v === void 0) continue;
    out[k] = v;
  }
  return out;
}
function validateUpdate(patch) {
  if (typeof patch.category === "string" && !ALLOWED_CATEGORIES.has(patch.category)) {
    return `Invalid category. Allowed: ${Array.from(ALLOWED_CATEGORIES).join(", ")}`;
  }
  if (typeof patch.status === "string" && !ALLOWED_STATUSES.has(patch.status)) {
    return `Invalid status. Allowed: ${Array.from(ALLOWED_STATUSES).join(", ")}`;
  }
  if (typeof patch.ctaType === "string" && patch.ctaType && !ALLOWED_CTA.has(patch.ctaType)) {
    return `Invalid ctaType. Allowed: ${Array.from(ALLOWED_CTA).join(", ")}`;
  }
  if (Array.isArray(patch.tags)) {
    patch.tags = JSON.stringify(patch.tags);
  }
  return null;
}
var adminRouter = Router();
adminRouter.use(requireToken);
adminRouter.get("/articles", async (req, res) => {
  try {
    const db = await getDb();
    if (!db) return res.status(503).json({ error: "Database not available" });
    const status = typeof req.query.status === "string" ? req.query.status : void 0;
    const category = typeof req.query.category === "string" ? req.query.category : void 0;
    const search = typeof req.query.search === "string" ? req.query.search.trim() : "";
    const limit = Math.min(asInt(req.query.limit, 20) ?? 20, 100);
    const conditions = [];
    if (status && ALLOWED_STATUSES.has(status)) {
      conditions.push(eq3(newsArticles.status, status));
    }
    if (category && ALLOWED_CATEGORIES.has(category)) {
      conditions.push(eq3(newsArticles.category, category));
    }
    if (search) {
      conditions.push(like2(newsArticles.title, `%${search}%`));
    }
    const rows = await db.select().from(newsArticles).where(conditions.length ? and2(...conditions) : void 0).orderBy(desc2(newsArticles.publishedAtInternal), desc2(newsArticles.publishedAt)).limit(limit);
    res.json({ count: rows.length, articles: rows });
  } catch (err) {
    console.error("[admin] list articles error:", err);
    res.status(500).json({ error: err.message || "Internal error" });
  }
});
adminRouter.get("/articles/:id", async (req, res) => {
  try {
    const id = asInt(req.params.id);
    if (!id) return res.status(400).json({ error: "Invalid id" });
    const db = await getDb();
    if (!db) return res.status(503).json({ error: "Database not available" });
    const row = await db.select().from(newsArticles).where(eq3(newsArticles.id, id)).limit(1);
    if (row.length === 0) return res.status(404).json({ error: "Not found" });
    res.json(row[0]);
  } catch (err) {
    console.error("[admin] get article error:", err);
    res.status(500).json({ error: err.message || "Internal error" });
  }
});
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
        error: `No editable fields supplied. Allowed: ${Array.from(EDITABLE_FIELDS).join(", ")}`
      });
    }
    const validationError = validateUpdate(patch);
    if (validationError) return res.status(400).json({ error: validationError });
    const db = await getDb();
    if (!db) return res.status(503).json({ error: "Database not available" });
    await db.update(newsArticles).set(patch).where(eq3(newsArticles.id, id));
    const refreshed = await db.select().from(newsArticles).where(eq3(newsArticles.id, id)).limit(1);
    if (refreshed.length === 0) return res.status(404).json({ error: "Not found after update" });
    res.json({ updated: Object.keys(patch), article: refreshed[0] });
  } catch (err) {
    console.error("[admin] update article error:", err);
    res.status(500).json({ error: err.message || "Internal error" });
  }
});
adminRouter.delete("/articles/:id", async (req, res) => {
  try {
    const id = asInt(req.params.id);
    if (!id) return res.status(400).json({ error: "Invalid id" });
    const db = await getDb();
    if (!db) return res.status(503).json({ error: "Database not available" });
    await db.update(newsArticles).set({ status: "archived" }).where(eq3(newsArticles.id, id));
    res.json({ archived: true, id });
  } catch (err) {
    console.error("[admin] archive article error:", err);
    res.status(500).json({ error: err.message || "Internal error" });
  }
});
adminRouter.post("/articles/:id/publish", async (req, res) => {
  try {
    const id = asInt(req.params.id);
    if (!id) return res.status(400).json({ error: "Invalid id" });
    const db = await getDb();
    if (!db) return res.status(503).json({ error: "Database not available" });
    await db.update(newsArticles).set({
      status: "published",
      publishedAtInternal: /* @__PURE__ */ new Date(),
      approvedAt: /* @__PURE__ */ new Date()
    }).where(eq3(newsArticles.id, id));
    res.json({ published: true, id });
  } catch (err) {
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
    await db.update(newsArticles).set({ status: "approved", approvedAt: /* @__PURE__ */ new Date() }).where(eq3(newsArticles.id, id));
    res.json({ approved: true, id });
  } catch (err) {
    console.error("[admin] approve error:", err);
    res.status(500).json({ error: err.message || "Internal error" });
  }
});
adminRouter.post("/articles/:id/rewrite", async (req, res) => {
  try {
    const id = asInt(req.params.id);
    if (!id) return res.status(400).json({ error: "Invalid id" });
    const result = await rewriteArticleNow(id);
    if (!result.started) {
      return res.status(409).json({ started: false, reason: result.reason });
    }
    res.json({ started: true, id, message: "Rewrite launched in background. Tail Render logs for progress." });
  } catch (err) {
    console.error("[admin] rewrite trigger error:", err);
    res.status(500).json({ error: err.message || "Internal error" });
  }
});
adminRouter.post("/articles/:id/regenerate-image", async (req, res) => {
  try {
    const id = asInt(req.params.id);
    if (!id) return res.status(400).json({ error: "Invalid id" });
    const result = await regenerateImageNow(id);
    if (!result.started) {
      return res.status(409).json({ started: false, reason: result.reason });
    }
    res.json({ started: true, id, message: "Image generation launched in background." });
  } catch (err) {
    console.error("[admin] regenerate-image trigger error:", err);
    res.status(500).json({ error: err.message || "Internal error" });
  }
});
adminRouter.post("/articles/:id/reject", async (req, res) => {
  try {
    const id = asInt(req.params.id);
    if (!id) return res.status(400).json({ error: "Invalid id" });
    const reason = typeof req.body?.reason === "string" && req.body.reason.trim() ? req.body.reason.trim().slice(0, 256) : "Rejected by editor";
    const db = await getDb();
    if (!db) return res.status(503).json({ error: "Database not available" });
    await db.update(newsArticles).set({ status: "rejected", rejectionReason: reason }).where(eq3(newsArticles.id, id));
    res.json({ rejected: true, id, reason });
  } catch (err) {
    console.error("[admin] reject error:", err);
    res.status(500).json({ error: err.message || "Internal error" });
  }
});
adminRouter.get("/candidates", async (req, res) => {
  try {
    const limit = Math.min(asInt(req.query.limit, 50) ?? 50, 200);
    const db = await getDb();
    if (!db) return res.status(503).json({ error: "Database not available" });
    const rows = await db.select().from(newsArticles).where(eq3(newsArticles.status, "candidate")).orderBy(desc2(newsArticles.fetchedAt)).limit(limit);
    res.json({ count: rows.length, candidates: rows });
  } catch (err) {
    console.error("[admin] candidates error:", err);
    res.status(500).json({ error: err.message || "Internal error" });
  }
});
adminRouter.get("/sources", async (_req, res) => {
  try {
    const db = await getDb();
    if (!db) return res.status(503).json({ error: "Database not available" });
    const rows = await db.select().from(newsFeeds).orderBy(desc2(newsFeeds.priority));
    res.json({ count: rows.length, sources: rows });
  } catch (err) {
    console.error("[admin] sources error:", err);
    res.status(500).json({ error: err.message || "Internal error" });
  }
});
adminRouter.get("/health", async (_req, res) => {
  const present = (v) => !!(v && v.length > 0);
  res.json({
    ok: true,
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
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
      METRICOOL_API_KEY: present(process.env.METRICOOL_API_KEY)
    }
  });
});
adminRouter.post("/run-pipeline", async (_req, res) => {
  try {
    const result = await triggerPipelineNow();
    if (!result.started) {
      return res.status(409).json({ started: false, reason: result.reason });
    }
    res.json({ started: true, message: "Pipeline launched in background. Tail Render logs for progress." });
  } catch (err) {
    console.error("[admin] run-pipeline error:", err);
    res.status(500).json({ error: err.message || "Internal error" });
  }
});
adminRouter.post("/seed-feeds", async (_req, res) => {
  try {
    const db = await getDb();
    if (!db) return res.status(503).json({ error: "Database not available" });
    const result = await seedFeeds(db);
    res.json(result);
  } catch (err) {
    console.error("[admin] seed-feeds error:", err);
    res.status(500).json({ error: err.message || "Internal error" });
  }
});
var ALLOWED_BLOG_LANGUAGES = /* @__PURE__ */ new Set(["es", "en"]);
var ALLOWED_BLOG_STATUSES = /* @__PURE__ */ new Set(["draft", "published", "archived"]);
var EDITABLE_BLOG_FIELDS = /* @__PURE__ */ new Set([
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
  "publishedAt"
]);
function pickEditableBlog(body) {
  const out = {};
  for (const [k, v] of Object.entries(body)) {
    if (!EDITABLE_BLOG_FIELDS.has(k)) continue;
    if (v === void 0) continue;
    out[k] = v;
  }
  if (Array.isArray(out.tags)) out.tags = JSON.stringify(out.tags);
  if (typeof out.publishedAt === "string") out.publishedAt = new Date(out.publishedAt);
  return out;
}
function validateBlogPatch(patch) {
  if (typeof patch.language === "string" && !ALLOWED_BLOG_LANGUAGES.has(patch.language)) {
    return `Invalid language. Allowed: ${Array.from(ALLOWED_BLOG_LANGUAGES).join(", ")}`;
  }
  if (typeof patch.status === "string" && !ALLOWED_BLOG_STATUSES.has(patch.status)) {
    return `Invalid status. Allowed: ${Array.from(ALLOWED_BLOG_STATUSES).join(", ")}`;
  }
  return null;
}
function slugifyTitle(title) {
  return title.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 100);
}
adminRouter.get("/blog/posts", async (req, res) => {
  try {
    const db = await getDb();
    if (!db) return res.status(503).json({ error: "Database not available" });
    const status = typeof req.query.status === "string" ? req.query.status : void 0;
    const language = typeof req.query.language === "string" ? req.query.language : void 0;
    const search = typeof req.query.search === "string" ? req.query.search.trim() : "";
    const limit = Math.min(asInt(req.query.limit, 20) ?? 20, 100);
    const conditions = [];
    if (status && ALLOWED_BLOG_STATUSES.has(status)) {
      conditions.push(eq3(blogPosts.status, status));
    }
    if (language && ALLOWED_BLOG_LANGUAGES.has(language)) {
      conditions.push(eq3(blogPosts.language, language));
    }
    if (search) {
      conditions.push(like2(blogPosts.title, `%${search}%`));
    }
    const rows = await db.select().from(blogPosts).where(conditions.length ? and2(...conditions) : void 0).orderBy(desc2(blogPosts.publishedAt), desc2(blogPosts.createdAt)).limit(limit);
    res.json({ count: rows.length, posts: rows });
  } catch (err) {
    console.error("[admin] list blog posts error:", err);
    res.status(500).json({ error: err.message || "Internal error" });
  }
});
adminRouter.get("/blog/posts/:id", async (req, res) => {
  try {
    const id = asInt(req.params.id);
    if (!id) return res.status(400).json({ error: "Invalid id" });
    const db = await getDb();
    if (!db) return res.status(503).json({ error: "Database not available" });
    const row = await db.select().from(blogPosts).where(eq3(blogPosts.id, id)).limit(1);
    if (row.length === 0) return res.status(404).json({ error: "Not found" });
    res.json(row[0]);
  } catch (err) {
    console.error("[admin] get blog post error:", err);
    res.status(500).json({ error: err.message || "Internal error" });
  }
});
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
      patch.slug = `${slugifyTitle(patch.title)}-${Date.now()}`;
    }
    const db = await getDb();
    if (!db) return res.status(503).json({ error: "Database not available" });
    const result = await db.insert(blogPosts).values(patch);
    const id = Number(result[0]?.insertId);
    const created = await db.select().from(blogPosts).where(eq3(blogPosts.id, id)).limit(1);
    res.status(201).json({ created: true, post: created[0] });
  } catch (err) {
    console.error("[admin] create blog post error:", err);
    if (/duplicate.*slug/i.test(err.message || "")) {
      return res.status(409).json({ error: "slug already exists" });
    }
    res.status(500).json({ error: err.message || "Internal error" });
  }
});
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
        error: `No editable fields supplied. Allowed: ${Array.from(EDITABLE_BLOG_FIELDS).join(", ")}`
      });
    }
    const validationError = validateBlogPatch(patch);
    if (validationError) return res.status(400).json({ error: validationError });
    const db = await getDb();
    if (!db) return res.status(503).json({ error: "Database not available" });
    await db.update(blogPosts).set(patch).where(eq3(blogPosts.id, id));
    const refreshed = await db.select().from(blogPosts).where(eq3(blogPosts.id, id)).limit(1);
    if (refreshed.length === 0) return res.status(404).json({ error: "Not found after update" });
    res.json({ updated: Object.keys(patch), post: refreshed[0] });
  } catch (err) {
    console.error("[admin] update blog post error:", err);
    res.status(500).json({ error: err.message || "Internal error" });
  }
});
adminRouter.delete("/blog/posts/:id", async (req, res) => {
  try {
    const id = asInt(req.params.id);
    if (!id) return res.status(400).json({ error: "Invalid id" });
    const db = await getDb();
    if (!db) return res.status(503).json({ error: "Database not available" });
    await db.update(blogPosts).set({ status: "archived" }).where(eq3(blogPosts.id, id));
    res.json({ archived: true, id });
  } catch (err) {
    console.error("[admin] archive blog post error:", err);
    res.status(500).json({ error: err.message || "Internal error" });
  }
});
adminRouter.post("/blog/posts/:id/publish", async (req, res) => {
  try {
    const id = asInt(req.params.id);
    if (!id) return res.status(400).json({ error: "Invalid id" });
    const db = await getDb();
    if (!db) return res.status(503).json({ error: "Database not available" });
    await db.update(blogPosts).set({ status: "published", publishedAt: /* @__PURE__ */ new Date() }).where(eq3(blogPosts.id, id));
    res.json({ published: true, id });
  } catch (err) {
    console.error("[admin] publish blog post error:", err);
    res.status(500).json({ error: err.message || "Internal error" });
  }
});

// server/_core/index.ts
function isPortAvailable(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}
async function findAvailablePort(startPort = 3e3) {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}
async function startServer() {
  const app = express2();
  const server = createServer(app);
  app.use(express2.json({ limit: "50mb" }));
  app.use(express2.urlencoded({ limit: "50mb", extended: true }));
  initializeRssScheduler();
  registerOAuthRoutes(app);
  app.use("/api/admin", adminRouter);
  app.post("/api/upload", async (req, res) => {
    try {
      const ctx = await createContext({ req, res });
      if (!ctx.user || ctx.user.role !== "admin" && ctx.user.role !== "user") {
        return res.status(401).json({ error: "No autorizado" });
      }
      const { data, filename, contentType } = req.body;
      if (!data || !filename) {
        return res.status(400).json({ error: "Falta data o filename" });
      }
      const buffer = Buffer.from(data, "base64");
      const { storagePut: storagePut2 } = await Promise.resolve().then(() => (init_storage(), storage_exports));
      const key = `comprando-america/blog/${Date.now()}-${filename.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
      const result = await storagePut2(key, buffer, contentType || "image/jpeg");
      return res.json({ url: result.url });
    } catch (err) {
      console.error("Upload error:", err);
      return res.status(500).json({ error: err.message || "Error al subir imagen" });
    }
  });
  app.post("/api/generate-image", async (req, res) => {
    try {
      const ctx = await createContext({ req, res });
      if (!ctx.user || ctx.user.role !== "admin" && ctx.user.role !== "user") {
        return res.status(401).json({ error: "No autorizado" });
      }
      const { title, excerpt } = req.body;
      if (!title) {
        return res.status(400).json({ error: "Falta el t\xEDtulo del blog" });
      }
      const { ENV: envVars } = await Promise.resolve().then(() => (init_env(), env_exports));
      if (!envVars.openaiApiKey) {
        return res.status(503).json({ error: "API key de OpenAI no configurada. Agrega OPENAI_API_KEY en las variables de entorno." });
      }
      const prompt = `Professional, modern blog header image for a premium Latin American investment club. Topic: "${title}"${excerpt ? `. Context: ${excerpt.slice(0, 200)}` : ""}. Style: clean, corporate, navy blue and white tones, subtle gold accents. No text or words in the image. Photorealistic, editorial quality. 16:9 aspect ratio composition.`;
      const openaiRes = await fetch("https://api.openai.com/v1/images/generations", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${envVars.openaiApiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "dall-e-3",
          prompt,
          n: 1,
          size: "1792x1024",
          quality: "standard",
          response_format: "b64_json"
        })
      });
      if (!openaiRes.ok) {
        const err = await openaiRes.json().catch(() => ({}));
        console.error("OpenAI error:", err);
        return res.status(502).json({ error: err?.error?.message || "Error generando imagen con OpenAI" });
      }
      const openaiData = await openaiRes.json();
      const b64 = openaiData.data?.[0]?.b64_json;
      if (!b64) {
        return res.status(502).json({ error: "OpenAI no retorn\xF3 imagen" });
      }
      const buffer = Buffer.from(b64, "base64");
      const { storagePut: storagePut2 } = await Promise.resolve().then(() => (init_storage(), storage_exports));
      const slug = title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 60);
      const key = `comprando-america/blog/ai-${slug}-${Date.now()}`;
      const result = await storagePut2(key, buffer, "image/png");
      return res.json({ url: result.url, revised_prompt: openaiData.data?.[0]?.revised_prompt });
    } catch (err) {
      console.error("Generate image error:", err);
      return res.status(500).json({ error: err.message || "Error generando imagen" });
    }
  });
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext
    })
  );
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);
  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }
  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
    startScheduler();
  });
}
startServer().catch(console.error);
