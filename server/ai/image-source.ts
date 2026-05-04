/**
 * Unified image source for article hero images.
 *
 * Priority:
 *   1. Pexels stock photo (free, ~80% of articles get a clean editorial match)
 *   2. Gemini Nano Banana fallback (when Pexels has no good keyword match)
 *
 * Gemini calls cost real money, so we burn the Pexels free quota first.
 */
import { getPexelsHeroBase64, isPexelsConfigured } from "./pexels";
import { geminiGenerateImage } from "./gemini";

/**
 * Heuristic: extract 2-4 search keywords from a scene description without
 * spending another Gemini call. Strips fillers and keeps meaningful nouns.
 */
function sceneToKeywords(scene: string): string {
  const stopWords = new Set([
    "a", "an", "the", "and", "or", "of", "for", "in", "on", "at", "to", "with", "from",
    "is", "are", "was", "were", "be", "been", "being", "that", "this", "it", "its",
    "by", "as", "up", "about", "into", "over", "after", "very", "just", "also", "so",
    "not", "no", "but", "than", "then", "too", "only", "will", "can", "could", "would",
    "should", "has", "have", "had", "do", "does", "did", "shall", "may", "might",
    "must", "need", "scene", "showing", "shows", "featuring", "depicts", "image",
    "photo", "photograph", "view", "shot",
  ]);
  return scene
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !stopWords.has(w))
    .slice(0, 4)
    .join(" ") || scene.split(/\s+/).slice(0, 3).join(" ");
}

export async function getHeroImage(
  scene: string,
  opts?: { forceGemini?: boolean }
): Promise<{ base64: string; source: "pexels" | "gemini"; sourceUrl?: string; photographer?: string }> {
  // 1. Pexels first (free, fast)
  if (!opts?.forceGemini && isPexelsConfigured()) {
    const keywords = sceneToKeywords(scene);
    const result = await getPexelsHeroBase64(keywords);
    if (result) {
      console.log(`[image-source] pexels: "${keywords}" by ${result.photographer}`);
      return {
        base64: result.base64,
        source: "pexels",
        sourceUrl: result.sourceUrl,
        photographer: result.photographer,
      };
    }
  }

  // 2. Gemini fallback (paid)
  const result = await geminiGenerateImage(
    `Editorial news photography, photorealistic, 16:9, cinematic, dramatic lighting. NO text, NO logos, NO readable signs, NO recognizable faces. SCENE: ${scene}`
  );
  console.log(`[image-source] gemini (fallback)`);
  return { base64: result.base64, source: "gemini" };
}
