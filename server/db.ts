import { eq, desc, and, like, inArray, lt } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { InsertUser, users, blogPosts, BlogPost, InsertBlogPost, newsArticles, NewsArticle, InsertNewsArticle, newsFeeds, NewsFeed, InsertNewsFeed, newsSubscribers, NewsSubscriber, InsertNewsSubscriber } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: any = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
// TiDB requires SSL connections.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      const pool = mysql.createPool({
        uri: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: true },
        connectionLimit: 5,
      });
      // Test the connection to ensure it's not silently failing later
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

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ═══ AUTH QUERIES ═══
export async function getUserByEmail(email: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user by email: database not available");
    return undefined;
  }
  const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createCmsUser(data: { name: string; email: string; passwordHash: string; role: "admin" | "user" }) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create CMS user: database not available");
    return undefined;
  }
  const { nanoid } = await import("nanoid");
  const openId = `cms_${nanoid(16)}`;
  const result = await db.insert(users).values({
    openId,
    name: data.name,
    email: data.email,
    passwordHash: data.passwordHash,
    loginMethod: "email",
    role: data.role,
    lastSignedIn: new Date(),
  });
  return { id: Number(result[0].insertId), openId };
}

// ═══ USERS QUERIES ═══
export async function getAllUsers() {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get users: database not available");
    return [];
  }
  return await db.select().from(users);
}

export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateUser(id: number, data: Partial<InsertUser>) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update user: database not available");
    return;
  }
  await db.update(users).set(data).where(eq(users.id, id));
}

export async function deleteUser(id: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot delete user: database not available");
    return;
  }
  await db.delete(users).where(eq(users.id, id));
}

// ═══ BLOG POSTS QUERIES ═══
export async function getAllBlogPosts() {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get blog posts: database not available");
    return [];
  }
  return await db.select().from(blogPosts);
}

export async function getPublishedBlogPosts() {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get published blog posts: database not available");
    return [];
  }
  return await db.select().from(blogPosts).where(eq(blogPosts.status, "published"));
}

export async function getBlogPostById(id: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get blog post: database not available");
    return undefined;
  }
  const result = await db.select().from(blogPosts).where(eq(blogPosts.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getBlogPostBySlug(slug: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get blog post: database not available");
    return undefined;
  }
  const result = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createBlogPost(data: InsertBlogPost) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create blog post: database not available");
    return;
  }
  const result = await db.insert(blogPosts).values(data);
  return result;
}

export async function updateBlogPost(id: number, data: Partial<InsertBlogPost>) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update blog post: database not available");
    return;
  }
  await db.update(blogPosts).set(data).where(eq(blogPosts.id, id));
}

export async function deleteBlogPost(id: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot delete blog post: database not available");
    return;
  }
  await db.delete(blogPosts).where(eq(blogPosts.id, id));
}

// ═══ NEWS ARTICLES QUERIES ═══
export async function getLatestNewsArticles(limit: number = 20) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get news articles: database not available");
    return [];
  }
  return await db.select().from(newsArticles).orderBy(desc(newsArticles.publishedAt)).limit(limit);
}

export async function getNewsArticlesByCategory(category: string, limit: number = 20) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get news articles: database not available");
    return [];
  }
  return await db.select().from(newsArticles)
    .where(eq(newsArticles.category, category as any))
    .orderBy(desc(newsArticles.publishedAt))
    .limit(limit);
}

export async function searchNewsArticles(query: string, limit: number = 20) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot search news articles: database not available");
    return [];
  }
  return await db.select().from(newsArticles)
    .where(like(newsArticles.title, `%${query}%`))
    .orderBy(desc(newsArticles.publishedAt))
    .limit(limit);
}

export async function getNewsArticleById(id: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get news article: database not available");
    return undefined;
  }
  const result = await db.select().from(newsArticles).where(eq(newsArticles.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getNewsArticleBySlug(slug: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get news article: database not available");
    return undefined;
  }
  const result = await db.select().from(newsArticles).where(eq(newsArticles.slug, slug)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createNewsArticle(data: InsertNewsArticle) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create news article: database not available");
    return;
  }
  try {
    await db.insert(newsArticles).values(data);
    // Fetch the created article to return it
    const result = await db.select().from(newsArticles).where(eq(newsArticles.url, data.url)).limit(1);
    return result.length > 0 ? result[0] : undefined;
  } catch (error) {
    // Handle duplicate URL constraint
    console.warn("[Database] Article URL already exists:", data.url);
    return null;
  }
}

export async function updateNewsArticle(id: number, data: Partial<InsertNewsArticle>) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update news article: database not available");
    return;
  }
  await db.update(newsArticles).set(data).where(eq(newsArticles.id, id));
}

export async function deleteNewsArticle(id: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot delete news article: database not available");
    return;
  }
  await db.delete(newsArticles).where(eq(newsArticles.id, id));
}

export async function deleteOldNewsArticles(daysOld: number = 30) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot delete old news articles: database not available");
    return;
  }
  const cutoffDate = new Date(Date.now() - daysOld * 24 * 60 * 60 * 1000);
  await db.delete(newsArticles).where(lt(newsArticles.publishedAt, cutoffDate));
}

// ═══ NEWS FEEDS QUERIES ═══
export async function getAllNewsFeeds() {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get news feeds: database not available");
    return [];
  }
  return await db.select().from(newsFeeds);
}

export async function getActiveNewsFeeds() {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get active news feeds: database not available");
    return [];
  }
  return await db.select().from(newsFeeds);
}

export async function getNewsFeedsByCategory(category: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get news feeds: database not available");
    return [];
  }
  return await db.select().from(newsFeeds)
    .where(and(eq(newsFeeds.category, category as any), eq(newsFeeds.isActive, "true" as any)));
}

export async function getNewsFeedById(id: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get news feed: database not available");
    return undefined;
  }
  const result = await db.select().from(newsFeeds).where(eq(newsFeeds.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createNewsFeed(data: InsertNewsFeed) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create news feed: database not available");
    return;
  }
  await db.insert(newsFeeds).values(data);
  // Fetch the created feed to return it
  const result = await db.select().from(newsFeeds).where(eq(newsFeeds.url, data.url)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateNewsFeed(id: number, data: Partial<InsertNewsFeed>) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update news feed: database not available");
    return;
  }
  await db.update(newsFeeds).set(data).where(eq(newsFeeds.id, id));
}

export async function deleteNewsFeed(id: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot delete news feed: database not available");
    return;
  }
  await db.delete(newsFeeds).where(eq(newsFeeds.id, id));
}

// ═══ NEWS SUBSCRIBERS QUERIES ═══
export async function createNewsSubscriber(
  email: string,
  name: string | undefined,
  categories: string[]
) {
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
    isVerified: "false",
  });
  return result;
}

export async function getNewsSubscriber(email: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get news subscriber: database not available");
    return undefined;
  }
  const result = await db.select().from(newsSubscribers).where(eq(newsSubscribers.email, email)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function verifyNewsSubscriber(token: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot verify news subscriber: database not available");
    return undefined;
  }
  const subscriber = await db.select().from(newsSubscribers).where(eq(newsSubscribers.verificationToken, token)).limit(1);

  if (subscriber.length === 0) return null;

  await db
    .update(newsSubscribers)
    .set({ isVerified: "true", verificationToken: null })
    .where(eq(newsSubscribers.id, subscriber[0].id));

  // Fetch and return the updated subscriber
  const updated = await db.select().from(newsSubscribers).where(eq(newsSubscribers.id, subscriber[0].id)).limit(1);
  return updated.length > 0 ? updated[0] : subscriber[0];
}

export async function updateSubscriberCategories(
  email: string,
  categories: string[]
) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update subscriber categories: database not available");
    return;
  }
  return await db
    .update(newsSubscribers)
    .set({ categories: JSON.stringify(categories) })
    .where(eq(newsSubscribers.email, email));
}

export async function unsubscribeNewsSubscriber(token: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot unsubscribe news subscriber: database not available");
    return undefined;
  }
  const subscriber = await db.select().from(newsSubscribers).where(eq(newsSubscribers.unsubscribeToken, token)).limit(1);

  if (subscriber.length === 0) return null;

  await db
    .update(newsSubscribers)
    .set({ isActive: "false" })
    .where(eq(newsSubscribers.id, subscriber[0].id));

  // Fetch and return the updated subscriber
  const updated = await db.select().from(newsSubscribers).where(eq(newsSubscribers.id, subscriber[0].id)).limit(1);
  return updated.length > 0 ? updated[0] : subscriber[0];
}

export async function getVerifiedSubscribersByCategory(category: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get verified subscribers: database not available");
    return [];
  }
  const subscribers = await db.select().from(newsSubscribers).where(
    and(
      eq(newsSubscribers.isVerified, "true"),
      eq(newsSubscribers.isActive, "true")
    )
  );

  return subscribers.filter((sub: any) => {
    const categories = JSON.parse(sub.categories);
    return categories.includes(category) || categories.includes("all");
  });
}
