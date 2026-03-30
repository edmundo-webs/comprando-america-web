import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import { initializeRssScheduler } from "../rss-sync";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  const server = createServer(app);
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  // Initialize RSS feed scheduler
  initializeRssScheduler();
  // OAuth callback under /api/oauth/callback
  registerOAuthRoutes(app);

  // ═══ IMAGE UPLOAD ENDPOINT ═══
  app.post("/api/upload", async (req, res) => {
    try {
      // Verify auth via cookie (reuse tRPC context pattern)
      const ctx = await createContext({ req, res } as any);
      if (!ctx.user || (ctx.user.role !== "admin" && ctx.user.role !== "user")) {
        return res.status(401).json({ error: "No autorizado" });
      }

      const { data, filename, contentType } = req.body;
      if (!data || !filename) {
        return res.status(400).json({ error: "Falta data o filename" });
      }

      // data is base64
      const buffer = Buffer.from(data, "base64");
      const { storagePut } = await import("../storage");
      const key = `comprando-america/blog/${Date.now()}-${filename.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
      const result = await storagePut(key, buffer, contentType || "image/jpeg");
      return res.json({ url: result.url });
    } catch (err: any) {
      console.error("Upload error:", err);
      return res.status(500).json({ error: err.message || "Error al subir imagen" });
    }
  });

  // ═══ AI IMAGE GENERATION ENDPOINT ═══
  app.post("/api/generate-image", async (req, res) => {
    try {
      // Verify auth
      const ctx = await createContext({ req, res } as any);
      if (!ctx.user || (ctx.user.role !== "admin" && ctx.user.role !== "user")) {
        return res.status(401).json({ error: "No autorizado" });
      }

      const { title, excerpt } = req.body;
      if (!title) {
        return res.status(400).json({ error: "Falta el título del blog" });
      }

      const { ENV: envVars } = await import("./env");
      if (!envVars.openaiApiKey) {
        return res.status(503).json({ error: "API key de OpenAI no configurada. Agrega OPENAI_API_KEY en las variables de entorno." });
      }

      // Generate image with DALL-E 3
      const prompt = `Professional, modern blog header image for a premium Latin American investment club. Topic: "${title}"${excerpt ? `. Context: ${excerpt.slice(0, 200)}` : ""}. Style: clean, corporate, navy blue and white tones, subtle gold accents. No text or words in the image. Photorealistic, editorial quality. 16:9 aspect ratio composition.`;

      const openaiRes = await fetch("https://api.openai.com/v1/images/generations", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${envVars.openaiApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "dall-e-3",
          prompt,
          n: 1,
          size: "1792x1024",
          quality: "standard",
          response_format: "b64_json",
        }),
      });

      if (!openaiRes.ok) {
        const err = await openaiRes.json().catch(() => ({}));
        console.error("OpenAI error:", err);
        return res.status(502).json({ error: err?.error?.message || "Error generando imagen con OpenAI" });
      }

      const openaiData = await openaiRes.json();
      const b64 = openaiData.data?.[0]?.b64_json;
      if (!b64) {
        return res.status(502).json({ error: "OpenAI no retornó imagen" });
      }

      // Upload to Cloudinary
      const buffer = Buffer.from(b64, "base64");
      const { storagePut } = await import("../storage");
      const slug = title
        .toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
        .slice(0, 60);
      const key = `comprando-america/blog/ai-${slug}-${Date.now()}`;
      const result = await storagePut(key, buffer, "image/png");

      return res.json({ url: result.url, revised_prompt: openaiData.data?.[0]?.revised_prompt });
    } catch (err: any) {
      console.error("Generate image error:", err);
      return res.status(500).json({ error: err.message || "Error generando imagen" });
    }
  });

  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
