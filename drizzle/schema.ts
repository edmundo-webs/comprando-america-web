import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

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
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  excerpt: text("excerpt"),
  content: text("content").notNull(),
  featuredImage: varchar("featured_image", { length: 500 }),
  authorId: int("author_id").notNull(),
  status: mysqlEnum("status", ["draft", "published", "archived"]).default("draft").notNull(),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = typeof blogPosts.$inferInsert;

/**
 * News articles table
 * Stores editorial news articles written by the Comprando América team
 */
export const newsArticles = mysqlTable("news_articles", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 500 }).notNull(),
  slug: varchar("slug", { length: 500 }).notNull().unique(),
  description: text("description"),
  content: text("content"),
  body: text("body"), // Full HTML editorial content
  url: varchar("url", { length: 1000 }).notNull(),
  source: varchar("source", { length: 255 }).notNull(),
  author: varchar("author", { length: 255 }).default("Equipo Comprando América").notNull(),
  category: mysqlEnum("category", ["visas-migracion", "economia-finanzas", "bienes-raices", "llc-negocios", "inversiones"]).notNull(),
  imageUrl: varchar("image_url", { length: 1000 }),
  ctaType: varchar("cta_type", { length: 100 }), // membresia, formacion, visa-e2, bienes-raices, estructura, expansion
  publishedAt: timestamp("published_at").notNull(),
  fetchedAt: timestamp("fetched_at").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type NewsArticle = typeof newsArticles.$inferSelect;
export type InsertNewsArticle = typeof newsArticles.$inferInsert;

/**
 * News feeds table
 * Stores RSS feed URLs and configuration
 */
export const newsFeeds = mysqlTable("ca_news_feeds", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  url: varchar("url", { length: 1000 }).notNull().unique(),
  category: mysqlEnum("category", ["visas-migracion", "economia-finanzas", "bienes-raices", "llc-negocios", "inversiones"]).notNull(),
  isActive: mysqlEnum("is_active", ["true", "false"]).default("true").notNull(),
  lastFetchedAt: timestamp("last_fetched_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
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
  isActive: mysqlEnum("is_active", ["true", "false"]).default("true").notNull(),
  verificationToken: varchar("verification_token", { length: 255 }),
  isVerified: mysqlEnum("is_verified", ["true", "false"]).default("false").notNull(),
  unsubscribeToken: varchar("unsubscribe_token", { length: 255 }).unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type NewsSubscriber = typeof newsSubscribers.$inferSelect;
export type InsertNewsSubscriber = typeof newsSubscribers.$inferInsert;
