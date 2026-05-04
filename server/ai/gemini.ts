/**
 * Minimal Gemini REST client (no SDK dependency).
 *
 * Mirrors Web-News-TTS/server/ai/gemini.ts: same auto-fallback chain
 * (gemini-2.5-flash → gemini-2.5-flash-lite) and same retry policy on
 * 429/503 / "high demand" errors.
 */

const GEMINI_BASE = "https://generativelanguage.googleapis.com/v1beta";

const TEXT_MODELS = ["gemini-2.5-flash", "gemini-2.5-flash-lite"];
const IMAGE_MODEL = "gemini-2.5-flash-image";

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 4000;

interface GeminiResponse {
  candidates?: {
    content?: { parts?: { text?: string; inlineData?: { data: string; mimeType: string } }[] };
    finishReason?: string;
  }[];
  error?: { message: string; code: number };
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export async function geminiGenerate(
  systemInstruction: string,
  userPrompt: string,
  opts?: { temperature?: number; maxOutputTokens?: number; jsonMode?: boolean; model?: string }
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY not set");

  const generationConfig: Record<string, any> = {
    temperature: opts?.temperature ?? 0.7,
    maxOutputTokens: opts?.maxOutputTokens ?? 8192,
    thinkingConfig: { thinkingBudget: 0 },
  };
  if (opts?.jsonMode) {
    generationConfig.responseMimeType = "application/json";
  }

  const requestBody = {
    system_instruction: { parts: [{ text: systemInstruction }] },
    contents: [{ role: "user" as const, parts: [{ text: userPrompt }] }],
    generationConfig,
  };

  const models = opts?.model ? [opts.model] : TEXT_MODELS;

  for (const model of models) {
    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      const url = `${GEMINI_BASE}/models/${model}:generateContent?key=${apiKey}`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      const json = (await res.json()) as GeminiResponse;

      if (json.error && (res.status === 429 || res.status === 503 || json.error.message.includes("high demand"))) {
        const delay = RETRY_DELAY_MS * (attempt + 1);
        console.warn(`[gemini] ${model} attempt ${attempt + 1}: ${json.error.message.slice(0, 80)} — retrying in ${delay}ms`);
        await sleep(delay);
        continue;
      }

      if (json.error || !res.ok) {
        console.warn(`[gemini] ${model}: ${json.error?.message || `HTTP ${res.status}`}`);
        break;
      }

      const parts = json.candidates?.[0]?.content?.parts ?? [];
      const text = parts.map((p) => p.text ?? "").join("");
      if (!text) throw new Error("Gemini returned empty response");
      return text;
    }
  }

  throw new Error("All Gemini models/retries exhausted");
}

/**
 * Generate an image with Gemini Imagen ("Nano Banana"). Used as the
 * fallback when Pexels has no good match for the editorial scene.
 */
export async function geminiGenerateImage(
  prompt: string,
  opts?: { aspectRatio?: "1:1" | "9:16" | "16:9" | "4:3" | "3:4" }
): Promise<{ base64: string; mimeType: string }> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY not set");

  const aspectNote = opts?.aspectRatio
    ? ` Render the image in ${opts.aspectRatio} aspect ratio.`
    : "";

  const body = {
    contents: [{ role: "user", parts: [{ text: prompt + aspectNote }] }],
    generationConfig: {
      responseModalities: ["IMAGE", "TEXT"],
    },
  };

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    const url = `${GEMINI_BASE}/models/${IMAGE_MODEL}:generateContent?key=${apiKey}`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const json = (await res.json()) as GeminiResponse;

    if (json.error && (res.status === 429 || res.status === 503 || json.error.message.includes("high demand"))) {
      await sleep(RETRY_DELAY_MS * (attempt + 1));
      continue;
    }

    if (json.error || !res.ok) {
      throw new Error(`Gemini Imagen: ${json.error?.message || `HTTP ${res.status}`}`);
    }

    const parts = json.candidates?.[0]?.content?.parts;
    if (!parts) throw new Error("Gemini Imagen returned no parts");

    for (const part of parts) {
      if (part.inlineData) {
        return {
          base64: part.inlineData.data,
          mimeType: part.inlineData.mimeType || "image/png",
        };
      }
    }
    throw new Error("Gemini Imagen returned no image data");
  }

  throw new Error("Gemini Imagen retries exhausted");
}
