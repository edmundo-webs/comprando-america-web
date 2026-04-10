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
      // OpenAI (for AI image generation)
      openaiApiKey: process.env.OPENAI_API_KEY ?? ""
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
import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";
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
  // Full HTML editorial content
  url: varchar("url", { length: 1e3 }).notNull(),
  source: varchar("source", { length: 255 }).notNull(),
  author: varchar("author", { length: 255 }).default("Equipo Comprando Am\xE9rica").notNull(),
  category: mysqlEnum("category", ["visas-migracion", "economia-finanzas", "bienes-raices", "llc-negocios", "inversiones"]).notNull(),
  imageUrl: varchar("imageUrl", { length: 1e3 }),
  ctaType: varchar("ctaType", { length: 100 }),
  // membresia, formacion, visa-e2, bienes-raices, estructura, expansion
  publishedAt: timestamp("publishedAt").notNull(),
  fetchedAt: timestamp("fetchedAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
});
var newsFeeds = mysqlTable("ca_news_feeds", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }),
  url: varchar("url", { length: 1e3 }),
  category: varchar("category", { length: 50 }),
  createdAt: timestamp("createdAt").defaultNow()
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
  return await db.select().from(newsArticles).orderBy(desc(newsArticles.publishedAt)).limit(limit);
}
async function getNewsArticlesByCategory(category, limit = 20) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get news articles: database not available");
    return [];
  }
  return await db.select().from(newsArticles).where(eq(newsArticles.category, category)).orderBy(desc(newsArticles.publishedAt)).limit(limit);
}
async function searchNewsArticles(query, limit = 20) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot search news articles: database not available");
    return [];
  }
  return await db.select().from(newsArticles).where(like(newsArticles.title, `%${query}%`)).orderBy(desc(newsArticles.publishedAt)).limit(limit);
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
async function deleteOldNewsArticles(daysOld = 30) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot delete old news articles: database not available");
    return;
  }
  const cutoffDate = new Date(Date.now() - daysOld * 24 * 60 * 60 * 1e3);
  await db.delete(newsArticles).where(lt(newsArticles.publishedAt, cutoffDate));
}
async function getAllNewsFeeds() {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get news feeds: database not available");
    return [];
  }
  return await db.select().from(newsFeeds);
}
async function getActiveNewsFeeds() {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get active news feeds: database not available");
    return [];
  }
  return await db.select().from(newsFeeds).where(eq(newsFeeds.isActive, "true"));
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
async function updateNewsFeed(id, data) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update news feed: database not available");
    return;
  }
  await db.update(newsFeeds).set(data).where(eq(newsFeeds.id, id));
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
import Parser from "rss-parser";
import * as cron from "node-cron";
var parser = new Parser({
  customFields: {
    item: [
      ["media:content", "mediaContent"],
      ["media:thumbnail", "mediaThumbnail"],
      ["enclosure", "enclosure"]
    ]
  }
});
function extractImageUrl(item) {
  if (item.mediaContent?.url) {
    return item.mediaContent.url;
  }
  if (item.mediaThumbnail?.url) {
    return item.mediaThumbnail.url;
  }
  if (item.enclosure?.url && item.enclosure.type?.startsWith("image")) {
    return item.enclosure.url;
  }
  if (item.image?.url) {
    return item.image.url;
  }
  return void 0;
}
async function fetchAndParseFeed(feed) {
  try {
    console.log(`[RSS] Fetching feed: ${feed.name} (${feed.url})`);
    const parsedFeed = await parser.parseURL(feed.url);
    if (!parsedFeed.items || parsedFeed.items.length === 0) {
      console.warn(`[RSS] No items found in feed: ${feed.name}`);
      return;
    }
    let successCount = 0;
    let duplicateCount = 0;
    for (const item of parsedFeed.items) {
      try {
        if (!item.title || !item.link) {
          continue;
        }
        const slugify = (text2) => text2.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").substring(0, 200);
        const slug = `${slugify(item.title)}-${Date.now()}`;
        const article = {
          title: item.title,
          slug,
          description: item.contentSnippet || item.summary || "",
          content: item.content || item.description || "",
          url: item.link,
          source: feed.name,
          category: feed.category,
          imageUrl: extractImageUrl(item),
          publishedAt: item.pubDate ? new Date(item.pubDate) : /* @__PURE__ */ new Date()
        };
        const result = await createNewsArticle(article);
        if (result) {
          successCount++;
        } else {
          duplicateCount++;
        }
      } catch (error) {
        console.warn(`[RSS] Error processing item from ${feed.name}:`, error);
      }
    }
    await updateNewsFeed(feed.id, {});
    console.log(
      `[RSS] Feed ${feed.name}: ${successCount} new articles, ${duplicateCount} duplicates`
    );
  } catch (error) {
    console.error(`[RSS] Error fetching feed ${feed.name}:`, error);
  }
}
async function syncAllFeeds() {
  try {
    console.log("[RSS] Starting feed synchronization...");
    const feeds = await getActiveNewsFeeds();
    if (!feeds || feeds.length === 0) {
      console.warn("[RSS] No active feeds found");
      return;
    }
    console.log(`[RSS] Found ${feeds.length} active feeds`);
    for (const feed of feeds) {
      await fetchAndParseFeed(feed);
      await new Promise((resolve) => setTimeout(resolve, 1e3));
    }
    await deleteOldNewsArticles(30);
    console.log("[RSS] Feed synchronization completed");
  } catch (error) {
    console.error("[RSS] Error during feed synchronization:", error);
  }
}
function initializeRssScheduler() {
  try {
    cron.schedule("0 */4 * * *", async () => {
      console.log("[RSS] Running scheduled feed sync...");
      await syncAllFeeds();
    });
    console.log("[RSS] RSS scheduler initialized (runs every 4 hours)");
    setTimeout(() => {
      console.log("[RSS] Running initial feed sync on startup...");
      syncAllFeeds().catch(
        (error) => console.error("[RSS] Error in initial sync:", error)
      );
    }, 5e3);
  } catch (error) {
    console.error("[RSS] Error initializing scheduler:", error);
  }
}

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
  });
}
startServer().catch(console.error);
