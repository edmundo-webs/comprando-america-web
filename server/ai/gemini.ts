/**
 * Text generation client for the Comprando América news pipeline.
 *
 * Two backends, auto-selected at runtime:
 *
 *   1. OpenAI-compatible (Ollama / GLM cloud / OpenRouter / vLLM / etc.)
 *      Activated when LLM_BASE_URL is set. Uses /v1/chat/completions.
 *
 *   2. Google Gemini REST (legacy path).
 *      Activated when GEMINI_API_KEY is set and LLM_BASE_URL is not.
 *
 * The exported function is still called `geminiGenerate` so callers
 * (rewrite.ts, prompts.ts) don't need any changes during the swap.
 *
 * Image generation (geminiGenerateImage) still requires GEMINI_API_KEY
 * because Ollama-style endpoints don't speak the Imagen API. The image
 * pipeline (generate-images.ts) was rewritten to skip it entirely in
 * favor of free sources (raw RSS image → og:image → Pexels).
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

interface OpenAiChatResponse {
  choices?: { message?: { content?: string } }[];
  error?: { message?: string };
}

interface GenerateOpts {
  temperature?: number;
  maxOutputTokens?: number;
  jsonMode?: boolean;
  model?: string;
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

/**
 * Public entry point. Routes to the OpenAI-compatible backend if
 * LLM_BASE_URL is configured; otherwise uses Gemini.
 */
export async function geminiGenerate(
  systemInstruction: string,
  userPrompt: string,
  opts?: GenerateOpts
): Promise<string> {
  if (process.env.LLM_BASE_URL) {
    return openaiGenerate(systemInstruction, userPrompt, opts);
  }
  if (process.env.GEMINI_API_KEY) {
    return geminiGenerateLegacy(systemInstruction, userPrompt, opts);
  }
  throw new Error(
    "No LLM configured. Set LLM_BASE_URL (OpenAI-compatible) or GEMINI_API_KEY (legacy)."
  );
}

// ──────────────────────────────────────────────────────────────────────
// OpenAI-compatible backend (Ollama, GLM cloud, OpenRouter, vLLM, etc.)
// ──────────────────────────────────────────────────────────────────────

async function openaiGenerate(
  systemInstruction: string,
  userPrompt: string,
  opts?: GenerateOpts
): Promise<string> {
  const baseUrl = (process.env.LLM_BASE_URL || "").replace(/\/$/, "");
  const apiKey = process.env.LLM_API_KEY || "";
  const model = opts?.model || process.env.LLM_DEFAULT_MODEL || "glm-5.1:cloud";

  const body: Record<string, any> = {
    model,
    messages: [
      { role: "system", content: systemInstruction },
      { role: "user", content: userPrompt },
    ],
    temperature: opts?.temperature ?? 0.7,
    // GLM cloud was truncating responses at 4096 — bumping to 8192 gives
    // the rewrite stage room for a 600-1100 word body in JSON format.
    max_tokens: opts?.maxOutputTokens ?? 8192,
  };
  // response_format=json_object isn't universally supported. Some Ollama
  // backends return empty bodies when it's set on a model that doesn't
  // implement it. Allow disabling via env var (LLM_DISABLE_JSON_MODE=true).
  if (opts?.jsonMode && process.env.LLM_DISABLE_JSON_MODE !== "true") {
    body.response_format = { type: "json_object" };
  }

  let lastError: string | null = null;
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const res = await fetch(`${baseUrl}/v1/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
        },
        body: JSON.stringify(body),
      });

      if (res.status === 429 || res.status === 503) {
        const delay = RETRY_DELAY_MS * (attempt + 1);
        console.warn(`[llm] HTTP ${res.status} on ${model} attempt ${attempt + 1} — retry in ${delay}ms`);
        await sleep(delay);
        continue;
      }

      const json = (await res.json()) as OpenAiChatResponse;

      if (!res.ok || json.error) {
        throw new Error(json.error?.message || `HTTP ${res.status}`);
      }

      const text = json.choices?.[0]?.message?.content?.trim();
      if (!text) throw new Error("LLM returned empty response");
      return text;
    } catch (err: any) {
      lastError = err?.message || String(err);
      // Network-level failures are also worth retrying.
      if (attempt < MAX_RETRIES - 1) {
        await sleep(RETRY_DELAY_MS * (attempt + 1));
        continue;
      }
    }
  }
  throw new Error(`LLM (${model}) exhausted retries: ${lastError ?? "unknown error"}`);
}

// ──────────────────────────────────────────────────────────────────────
// Gemini backend (legacy path — still used when LLM_BASE_URL is unset)
// ──────────────────────────────────────────────────────────────────────

async function geminiGenerateLegacy(
  systemInstruction: string,
  userPrompt: string,
  opts?: GenerateOpts
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY!;

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
 * Generate an editorial image with Gemini Imagen ("Nano Banana").
 * Only available when GEMINI_API_KEY is set — the OpenAI-compatible
 * backends don't speak the Imagen API.
 *
 * NOTE: generate-images.ts was rewritten to NOT call this in the normal
 * pipeline (it uses raw RSS image → og:image → Pexels instead). This
 * function is kept for ad-hoc tooling and Web-News-TTS parity.
 */
export async function geminiGenerateImage(
  prompt: string,
  opts?: { aspectRatio?: "1:1" | "9:16" | "16:9" | "4:3" | "3:4" }
): Promise<{ base64: string; mimeType: string }> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Image generation requires GEMINI_API_KEY (Imagen has no OpenAI-compatible equivalent)");
  }

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
