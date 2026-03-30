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
