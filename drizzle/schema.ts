import { int, mysqlEnum, mysqlTable, text, timestamp, tinyint, uniqueIndex, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
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
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Blog posts table
 * Stores all blog content for the CMS
 */
export const blogPosts = mysqlTable("blog_posts", {
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
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = typeof blogPosts.$inferInsert;

/**
 * News articles table
 * Stores editorial news articles for the Comprando América portal.
 *
 * Workflow: candidate -> draft -> approved -> published (or rejected/archived)
 *  - candidate: just ingested from RSS, awaiting AI relevance scoring
 *  - draft: passed relevance threshold, rewritten by Gemini, awaiting image
 *  - approved: ready, queued for auto-publish window
 *  - published: visible in the public portal
 *  - rejected: filtered out by AI relevance score
 *  - archived: moved out of rotation manually
 */
export const newsArticles = mysqlTable("ca_news_articles", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 500 }).notNull(),
  slug: varchar("slug", { length: 500 }).notNull().unique(),
  description: text("description"),
  content: text("content"),
  body: text("body"), // Full HTML editorial content (rewritten by Gemini)
  url: varchar("url", { length: 1000 }).notNull(),
  source: varchar("source", { length: 255 }).notNull(),
  author: varchar("author", { length: 255 }).default("Equipo Comprando América").notNull(),
  category: mysqlEnum("category", ["visas-migracion", "economia-finanzas", "bienes-raices", "llc-negocios", "inversiones"]).notNull(),
  imageUrl: varchar("imageUrl", { length: 1000 }),
  ctaType: varchar("ctaType", { length: 100 }), // membresia, formacion, visa-e2, bienes-raices, estructura, expansion

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
  externalHash: varchar("externalHash", { length: 64 }), // SHA-256 of normalized URL, used for dedup
  feedId: int("feedId"), // FK to ca_news_feeds.id (soft reference, no DB constraint)

  // --- AI / image enrichment ---
  heroImagePrompt: text("heroImagePrompt"), // prompt used for Pexels search / Gemini fallback
  tags: text("tags"), // JSON array of editorial tags

  // --- Timestamps ---
  publishedAt: timestamp("publishedAt").notNull(), // original publish date from the source feed
  publishedAtInternal: timestamp("publishedAtInternal"), // when WE published it on Comprando América
  draftedAt: timestamp("draftedAt"),
  approvedAt: timestamp("approvedAt"),
  fetchedAt: timestamp("fetchedAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  externalHashIdx: uniqueIndex("ca_news_articles_externalHash_unique").on(table.externalHash),
}));

export type NewsArticle = typeof newsArticles.$inferSelect;
export type InsertNewsArticle = typeof newsArticles.$inferInsert;

/**
 * News feeds table
 * Stores RSS feed URLs and ingestion health metadata.
 */
export const newsFeeds = mysqlTable("ca_news_feeds", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }),
  url: varchar("url", { length: 1000 }),
  category: varchar("category", { length: 50 }),
  language: mysqlEnum("language", ["es", "en"]).default("es").notNull(),
  priority: tinyint("priority").default(5).notNull(), // 1 (low) - 10 (high), used for ranking when multiple candidates compete for the same slot
  isActive: varchar("isActive", { length: 5 }).default("true").notNull(),
  lastFetchedAt: timestamp("lastFetchedAt"),
  lastError: text("lastError"),
  consecutiveFailures: int("consecutiveFailures").default(0).notNull(), // auto-deactivate after 5 in a row
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow(),
});

export type NewsFeed = typeof newsFeeds.$inferSelect;
export type InsertNewsFeed = typeof newsFeeds.$inferInsert;

/**
 * News subscribers table
 * Stores email subscriptions for news notifications
 */
export const newsSubscribers = mysqlTable("ca_news_subscribers", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  categories: text("categories").notNull(), // JSON array of subscribed categories
  isActive: varchar("isActive", { length: 5 }).default("true"),
  verificationToken: varchar("verificationToken", { length: 255 }),
  isVerified: varchar("isVerified", { length: 5 }).default("false"),
  unsubscribeToken: varchar("unsubscribeToken", { length: 255 }).unique(),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export type NewsSubscriber = typeof newsSubscribers.$inferSelect;
export type InsertNewsSubscriber = typeof newsSubscribers.$inferInsert;

/**
 * Social posts table
 * Tracks every carousel/post scheduled to Metricool for the Comprando América brand,
 * keyed by article so we can detect duplicates and audit failures.
 */
export const socialPosts = mysqlTable("ca_social_posts", {
  id: int("id").autoincrement().primaryKey(),
  articleId: int("articleId"),
  network: mysqlEnum("network", ["facebook", "instagram", "tiktok", "linkedin", "threads", "x", "youtube"]).notNull(),
  postType: mysqlEnum("postType", ["carousel", "reel", "short", "post", "story"]).notNull(),
  language: mysqlEnum("language", ["es", "en"]).default("es").notNull(),
  caption: text("caption"),
  mediaUrls: text("mediaUrls"), // JSON array of Cloudinary URLs (slides for a carousel, single image for a post, etc.)
  metricoolId: varchar("metricoolId", { length: 128 }),
  scheduledAt: timestamp("scheduledAt"),
  postedAt: timestamp("postedAt"),
  status: mysqlEnum("status", ["queued", "scheduled", "posted", "failed"]).default("queued").notNull(),
  error: text("error"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SocialPost = typeof socialPosts.$inferSelect;
export type InsertSocialPost = typeof socialPosts.$inferInsert;

/**
 * Ingestion runs table
 * Observability log: one row per RSS feed fetch attempt.
 */
export const ingestionRuns = mysqlTable("ca_ingestion_runs", {
  id: int("id").autoincrement().primaryKey(),
  feedId: int("feedId"),
  startedAt: timestamp("startedAt").defaultNow().notNull(),
  finishedAt: timestamp("finishedAt"),
  itemsFound: int("itemsFound").default(0).notNull(),
  itemsNew: int("itemsNew").default(0).notNull(),
  itemsSkipped: int("itemsSkipped").default(0).notNull(),
  error: text("error"),
});

export type IngestionRun = typeof ingestionRuns.$inferSelect;
export type InsertIngestionRun = typeof ingestionRuns.$inferInsert;

/**
 * CRM Leads table
 * Stores pre-registrations and contacts from landing pages and forms.
 */
export const leads = mysqlTable("ca_leads", {
  id: int("id").autoincrement().primaryKey(),
  nombreCompleto: varchar("nombreCompleto", { length: 255 }).notNull(),
  whatsapp: varchar("whatsapp", { length: 50 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  fuente: varchar("fuente", { length: 100 }).notNull(), // e.g. "cumbre-digital"
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Lead = typeof leads.$inferSelect;
export type InsertLead = typeof leads.$inferInsert;
