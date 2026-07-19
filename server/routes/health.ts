/**
 * Public health-check endpoint for uptime monitors (UptimeRobot, BetterStack,
 * Pingdom, etc.). No auth — safe to expose because it never returns anything
 * beyond a rough liveness signal and a DB round-trip result. Env presence
 * flags stay behind the token-gated /api/admin/health.
 *
 *   GET /api/health          → shallow: only checks the process is alive.
 *   GET /api/health?deep=1   → also runs `SELECT 1` against the DB pool.
 *
 * Response body is JSON:
 *   200 { ok: true,  service: "comprando-america", db: "up"|"skipped", uptimeSec }
 *   503 { ok: false, service: "comprando-america", db: "down"|"unavailable" }
 *
 * UptimeRobot triggers alerts on any non-2xx, so DB failure → 503 → alert.
 */
import { Router } from "express";
import { getDbPool } from "../db";

export const healthRouter = Router();

healthRouter.get("/api/health", async (req, res) => {
  const deep = req.query.deep === "1" || req.query.deep === "true";
  res.setHeader("Cache-Control", "no-store");

  if (!deep) {
    return res.json({
      ok: true,
      service: "comprando-america",
      db: "skipped",
      uptimeSec: Math.round(process.uptime()),
    });
  }

  try {
    const pool = await getDbPool();
    if (!pool) {
      return res.status(503).json({
        ok: false,
        service: "comprando-america",
        db: "unavailable",
      });
    }

    // 2-second cap so a hung DB doesn't stall the health check.
    const ping = pool.query("SELECT 1 AS ok");
    const timeout = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("db ping timeout")), 2000)
    );
    await Promise.race([ping, timeout]);

    res.json({
      ok: true,
      service: "comprando-america",
      db: "up",
      uptimeSec: Math.round(process.uptime()),
    });
  } catch (err: any) {
    console.error("[health] deep check failed:", err?.message);
    res.status(503).json({
      ok: false,
      service: "comprando-america",
      db: "down",
      error: err?.message?.slice(0, 200) ?? "unknown",
    });
  }
});
