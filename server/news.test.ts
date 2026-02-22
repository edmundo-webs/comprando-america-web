import { describe, it, expect, beforeAll, afterAll } from "vitest";
import * as db from "./db";
import { InsertNewsArticle } from "../drizzle/schema";

describe("News Router", () => {
  const testArticle: InsertNewsArticle = {
    title: "Test Article: Visa E-2 Approved",
    description: "New updates on E-2 visa approvals",
    content: "Full content about E-2 visa updates",
    url: "https://example.com/test-article",
    source: "USCIS",
    category: "visas-migracion",
    imageUrl: "https://example.com/image.jpg",
    publishedAt: new Date(),
  };

  let createdArticleId: number;

  beforeAll(async () => {
    // Create test article
    try {
      const uniqueUrl = `https://example.com/test-article-${Date.now()}`;
      const result = await db.createNewsArticle({
        ...testArticle,
        url: uniqueUrl,
      });
      if (result) {
        createdArticleId = result.id;
      }
    } catch (error) {
      console.error("Error creating test article:", error);
    }
  });

  afterAll(async () => {
    // Clean up test article
    if (createdArticleId) {
      try {
        await db.deleteNewsArticle(createdArticleId);
      } catch (error) {
        console.error("Error deleting test article:", error);
      }
    }
  });

  it("should create a news article", async () => {
    const uniqueUrl = `https://example.com/test-article-${Date.now()}`;
    const article = await db.createNewsArticle({
      ...testArticle,
      title: "Test Article 2",
      url: uniqueUrl,
    });

    expect(article).toBeDefined();
    expect(article?.title).toBe("Test Article 2");
    expect(article?.category).toBe("visas-migracion");

    if (article?.id) {
      await db.deleteNewsArticle(article.id);
    }
  });

  it("should get latest news articles", async () => {
    const articles = await db.getLatestNewsArticles(10);
    expect(Array.isArray(articles)).toBe(true);
  });

  it("should get news articles by category", async () => {
    const articles = await db.getNewsArticlesByCategory("visas-migracion", 10);
    expect(Array.isArray(articles)).toBe(true);

    // All articles should be from the specified category
    articles.forEach((article) => {
      expect(article.category).toBe("visas-migracion");
    });
  });

  it("should search news articles", async () => {
    const articles = await db.searchNewsArticles("visa", 10);
    expect(Array.isArray(articles)).toBe(true);
  });

  it("should get a single news article by id", async () => {
    if (createdArticleId) {
      const article = await db.getNewsArticleById(createdArticleId);
      expect(article).toBeDefined();
      expect(article?.id).toBe(createdArticleId);
    }
  });

  it("should delete a news article", async () => {
    const uniqueUrl = `https://example.com/delete-me-${Date.now()}`;
    const article = await db.createNewsArticle({
      ...testArticle,
      title: "Article to Delete",
      url: uniqueUrl,
    });

    if (article?.id) {
      await db.deleteNewsArticle(article.id);
      const deleted = await db.getNewsArticleById(article.id);
      expect(deleted).toBeUndefined();
    }
  });

  it("should create a news feed", async () => {
    const uniqueUrl = `https://example.com/feed-${Date.now()}.xml`;
    const feed = await db.createNewsFeed({
      name: "Test Feed",
      url: uniqueUrl,
      category: "economia-finanzas",
      isActive: "true",
    });

    expect(feed).toBeDefined();
    expect(feed?.name).toBe("Test Feed");

    if (feed?.id) {
      await db.deleteNewsFeed(feed.id);
    }
  });

  it("should get all news feeds", async () => {
    const feeds = await db.getAllNewsFeeds();
    expect(Array.isArray(feeds)).toBe(true);
  });

  it("should get active news feeds", async () => {
    const feeds = await db.getActiveNewsFeeds();
    expect(Array.isArray(feeds)).toBe(true);

    // All feeds should be active
    feeds.forEach((feed) => {
      expect(feed.isActive).toBe("true");
    });
  });

  it("should delete old news articles", async () => {
    // Create an old article (31 days ago)
    const oldDate = new Date();
    oldDate.setDate(oldDate.getDate() - 31);
    const uniqueUrl = `https://example.com/old-article-${Date.now()}`;

    const oldArticle = await db.createNewsArticle({
      ...testArticle,
      title: "Old Article",
      url: uniqueUrl,
      publishedAt: oldDate,
    });

    if (oldArticle?.id) {
      // Delete articles older than 30 days
      await db.deleteOldNewsArticles(30);

      // The old article should be deleted
      const deleted = await db.getNewsArticleById(oldArticle.id);
      expect(deleted).toBeUndefined();
    }
  });
});
