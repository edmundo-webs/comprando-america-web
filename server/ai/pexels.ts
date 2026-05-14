/**
 * Pexels API client — free editorial stock photos.
 *
 * Used as the PRIMARY image source for article hero images, with Gemini
 * Nano Banana as fallback. Free tier: 200 req/hour, 20K/month.
 *
 * Env: PEXELS_API_KEY
 */

const BASE = "https://api.pexels.com/v1";

interface PexelsPhoto {
  id: number;
  width: number;
  height: number;
  url: string;
  photographer: string;
  src: {
    original: string;
    large2x: string;
    large: string;
    medium: string;
    small: string;
    portrait: string;
    landscape: string;
    tiny: string;
  };
}

interface PexelsSearchResponse {
  total_results: number;
  page: number;
  per_page: number;
  photos: PexelsPhoto[];
}

export function isPexelsConfigured(): boolean {
  return !!process.env.PEXELS_API_KEY;
}

export async function searchPexels(
  query: string,
  opts?: { perPage?: number; orientation?: "landscape" | "portrait" | "square" }
): Promise<PexelsPhoto | null> {
  const key = process.env.PEXELS_API_KEY;
  if (!key) return null;

  const params = new URLSearchParams({
    query,
    per_page: String(opts?.perPage ?? 15),
    orientation: opts?.orientation ?? "landscape",
  });

  try {
    const res = await fetch(`${BASE}/search?${params}`, {
      headers: { Authorization: key },
    });
    if (!res.ok) {
      console.warn(`[pexels] HTTP ${res.status} for "${query}"`);
      return null;
    }
    const data = (await res.json()) as PexelsSearchResponse;
    if (!data.photos || data.photos.length === 0) return null;
    const idx = Math.floor(Math.random() * Math.min(data.photos.length, 10));
    return data.photos[idx];
  } catch (err: any) {
    console.warn(`[pexels] error for "${query}": ${err.message}`);
    return null;
  }
}

export async function downloadPexelsPhoto(photo: PexelsPhoto): Promise<{ base64: string; url: string }> {
  const url = photo.src.large2x || photo.src.large;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to download Pexels photo: ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  return { base64: buf.toString("base64"), url };
}

/**
 * One-shot helper: search + download. Returns base64 + the original Pexels
 * URL so we can attribute the photographer if needed.
 */
export async function getPexelsHeroBase64(
  query: string
): Promise<{ base64: string; sourceUrl: string; photographer: string } | null> {
  const photo = await searchPexels(query, { orientation: "landscape", perPage: 15 });
  if (!photo) return null;
  try {
    const { base64, url } = await downloadPexelsPhoto(photo);
    return { base64, sourceUrl: url, photographer: photo.photographer };
  } catch {
    return null;
  }
}
