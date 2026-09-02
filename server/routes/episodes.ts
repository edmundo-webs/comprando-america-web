/**
 * Episodes endpoint — latest videos from the Comprando América YouTube
 * channel, via the public per-channel RSS feed (no API key, no quota):
 *   https://www.youtube.com/feeds/videos.xml?channel_id=<id>
 * The feed carries the 15 most recent uploads. Cached in memory for 30
 * minutes; on a fetch error we serve the stale cache when available so the
 * Podcast page never goes blank.
 */
import { Router } from "express";

export const episodesRouter = Router();

const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID || "UCXcY6ZvL0cBb9VNBMuOe5pg";
const CACHE_TTL_MS = 30 * 60_000;

interface Episode {
  id: string;
  title: string;
  url: string;
  thumbnail: string;
  publishedAt: string;
}

let cache: { at: number; episodes: Episode[] } | null = null;

function decodeEntities(s: string): string {
  return s
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

async function fetchFeed(): Promise<Episode[]> {
  const res = await fetch(
    `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`,
    { signal: AbortSignal.timeout(8000) },
  );
  if (!res.ok) throw new Error(`YouTube feed responded ${res.status}`);
  const xml = await res.text();

  return xml
    .split("<entry>")
    .slice(1)
    .map((entry) => {
      const id = entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/)?.[1] ?? "";
      const title = decodeEntities(entry.match(/<title>([^<]+)<\/title>/)?.[1] ?? "");
      const publishedAt = entry.match(/<published>([^<]+)<\/published>/)?.[1] ?? "";
      return {
        id,
        title,
        url: `https://www.youtube.com/watch?v=${id}`,
        thumbnail: `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
        publishedAt,
      };
    })
    .filter((e) => e.id && e.title);
}

episodesRouter.get("/api/episodes", async (_req, res) => {
  try {
    if (!cache || Date.now() - cache.at > CACHE_TTL_MS) {
      cache = { at: Date.now(), episodes: await fetchFeed() };
    }
    res.setHeader("Cache-Control", "public, max-age=600");
    res.json({ count: cache.episodes.length, episodes: cache.episodes });
  } catch (err: any) {
    console.error("[episodes] feed fetch failed:", err?.message);
    if (cache) {
      return res.json({ count: cache.episodes.length, episodes: cache.episodes, stale: true });
    }
    res.status(502).json({ count: 0, episodes: [], error: "No se pudieron cargar los episodios" });
  }
});
