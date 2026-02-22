import Parser from "rss-parser";
import * as cron from "node-cron";
import * as db from "./db";
import { InsertNewsArticle } from "../drizzle/schema";

const parser = new Parser({
  customFields: {
    item: [
      ["media:content", "mediaContent"],
      ["media:thumbnail", "mediaThumbnail"],
      ["enclosure", "enclosure"],
    ],
  },
});

export interface RssFeed {
  id: number;
  name: string;
  url: string;
  category: string;
}

/**
 * Extract image URL from various RSS feed formats
 */
function extractImageUrl(item: any): string | undefined {
  // Try media:content
  if (item.mediaContent?.url) {
    return item.mediaContent.url;
  }
  // Try media:thumbnail
  if (item.mediaThumbnail?.url) {
    return item.mediaThumbnail.url;
  }
  // Try enclosure
  if (item.enclosure?.url && item.enclosure.type?.startsWith("image")) {
    return item.enclosure.url;
  }
  // Try image tag
  if (item.image?.url) {
    return item.image.url;
  }
  return undefined;
}

/**
 * Fetch and parse a single RSS feed
 */
export async function fetchAndParseFeed(feed: RssFeed): Promise<void> {
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
        // Skip items without title or link
        if (!item.title || !item.link) {
          continue;
        }

        // Generate slug from title
        const slugify = (text: string) => text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').substring(0, 200);
        const slug = `${slugify(item.title)}-${Date.now()}`;

        const article: InsertNewsArticle = {
          title: item.title,
          slug,
          description: item.contentSnippet || (item as any).summary || "",
          content: item.content || (item as any).description || "",
          url: item.link,
          source: feed.name,
          category: feed.category as any,
          imageUrl: extractImageUrl(item),
          publishedAt: item.pubDate ? new Date(item.pubDate) : new Date(),
        };

        const result = await db.createNewsArticle(article);
        if (result) {
          successCount++;
        } else {
          duplicateCount++;
        }
      } catch (error) {
        console.warn(`[RSS] Error processing item from ${feed.name}:`, error);
      }
    }

    // Update last fetched timestamp
    await db.updateNewsFeed(feed.id, { lastFetchedAt: new Date() });

    console.log(
      `[RSS] Feed ${feed.name}: ${successCount} new articles, ${duplicateCount} duplicates`
    );
  } catch (error) {
    console.error(`[RSS] Error fetching feed ${feed.name}:`, error);
  }
}

/**
 * Sync all active RSS feeds
 */
export async function syncAllFeeds(): Promise<void> {
  try {
    console.log("[RSS] Starting feed synchronization...");
    const feeds = await db.getActiveNewsFeeds();

    if (!feeds || feeds.length === 0) {
      console.warn("[RSS] No active feeds found");
      return;
    }

    console.log(`[RSS] Found ${feeds.length} active feeds`);

    // Process feeds sequentially to avoid overwhelming the server
    for (const feed of feeds) {
      await fetchAndParseFeed(feed as RssFeed);
      // Add delay between feeds to be respectful to servers
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    // Clean up old articles (older than 30 days)
    await db.deleteOldNewsArticles(30);

    console.log("[RSS] Feed synchronization completed");
  } catch (error) {
    console.error("[RSS] Error during feed synchronization:", error);
  }
}

/**
 * Initialize RSS feed sync scheduler
 */
export function initializeRssScheduler(): void {
  try {
    // Run every 4 hours
    cron.schedule("0 */4 * * *", async () => {
      console.log("[RSS] Running scheduled feed sync...");
      await syncAllFeeds();
    });

    console.log("[RSS] RSS scheduler initialized (runs every 4 hours)");

    // Also run once on startup (after a short delay to ensure DB is ready)
    setTimeout(() => {
      console.log("[RSS] Running initial feed sync on startup...");
      syncAllFeeds().catch((error) =>
        console.error("[RSS] Error in initial sync:", error)
      );
    }, 5000);
  } catch (error) {
    console.error("[RSS] Error initializing scheduler:", error);
  }
}
