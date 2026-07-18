/**
 * Internal analytics endpoints.
 *
 *   POST /api/track/diagnostic     Save a GPS-Estratégico completion.
 *   POST /api/track/cta            Log a click on a tracked CTA (fire-and-forget).
 *   GET  /api/track/redirect       Log a click AND 302 to the destination in one shot.
 *
 * All three are public — anyone can hit them. That's intentional so we can
 * point <a href="/api/track/redirect?..."> at real WhatsApp links without
 * gating auth. The tables are write-only from the internet; reads go
 * through /api/admin/analytics (token-gated).
 */
import { Router } from "express";
import { ctaClicks, diagnosticResponses } from "../../drizzle/schema";
import { getDb } from "../db";

export const trackRouter = Router();

// Simple safeguards so a bot can't DoS us into an insert loop.
const MAX_STR = (s: unknown, n: number) =>
  typeof s === "string" ? s.slice(0, n) : null;

function isSafeRedirectTarget(url: string): boolean {
  // Accept https://, mailto:, tel:, whatsapp: — reject javascript:, data:, etc.
  return /^(https?:|mailto:|tel:|whatsapp:)/i.test(url);
}

// ── POST /api/track/diagnostic ─────────────────────────────────────────
// Body: { sessionId, profile, responses (obj), nombre?, whatsapp?, email?,
//         utmSource?, utmMedium?, utmCampaign?, completed? }
trackRouter.post("/api/track/diagnostic", async (req, res) => {
  try {
    const b = (req.body ?? {}) as Record<string, unknown>;
    const db = await getDb();
    if (!db) return res.status(200).json({ ok: false, reason: "db unavailable" });

    await db.insert(diagnosticResponses).values({
      sessionId: MAX_STR(b.sessionId, 64),
      profile: MAX_STR(b.profile, 32),
      responses: typeof b.responses === "object" && b.responses !== null
        ? JSON.stringify(b.responses).slice(0, 65_000)
        : MAX_STR(b.responses, 65_000),
      nombre: MAX_STR(b.nombre, 255),
      whatsapp: MAX_STR(b.whatsapp, 50),
      email: MAX_STR(b.email, 320),
      utmSource: MAX_STR(b.utmSource, 100),
      utmMedium: MAX_STR(b.utmMedium, 100),
      utmCampaign: MAX_STR(b.utmCampaign, 100),
      referrer: MAX_STR(b.referrer ?? req.get("referer"), 500),
      userAgent: MAX_STR(req.get("user-agent"), 500),
      completed: b.completed === true || b.completed === "true" ? "true" : "false",
    });
    res.json({ ok: true });
  } catch (err: any) {
    console.error("[track/diagnostic] error:", err?.message);
    // Never fail the client — analytics losses shouldn't break UX.
    res.status(200).json({ ok: false, reason: "internal" });
  }
});

// ── POST /api/track/cta ────────────────────────────────────────────────
// Fire-and-forget log for a CTA click (client can use this if it doesn't
// need the redirect built-in — e.g., a button that opens a modal locally).
trackRouter.post("/api/track/cta", async (req, res) => {
  try {
    const b = (req.body ?? {}) as Record<string, unknown>;
    const cta = MAX_STR(b.cta, 64);
    if (!cta) return res.status(400).json({ ok: false, reason: "cta required" });

    const db = await getDb();
    if (!db) return res.status(200).json({ ok: false, reason: "db unavailable" });

    await db.insert(ctaClicks).values({
      cta,
      location: MAX_STR(b.location, 128),
      destination: MAX_STR(b.destination, 1000),
      sessionId: MAX_STR(b.sessionId, 64),
      referrer: MAX_STR(b.referrer ?? req.get("referer"), 500),
      userAgent: MAX_STR(req.get("user-agent"), 500),
      utmSource: MAX_STR(b.utmSource, 100),
      utmCampaign: MAX_STR(b.utmCampaign, 100),
    });
    res.json({ ok: true });
  } catch (err: any) {
    console.error("[track/cta] error:", err?.message);
    res.status(200).json({ ok: false, reason: "internal" });
  }
});

// ── GET /api/track/redirect ────────────────────────────────────────────
// Query: ?cta=hero-whatsapp&location=/&url=https%3A%2F%2Fwa.me%2F123%3Ftext%3Dhola
// Logs the click and 302s to `url`. This is what you drop into <a href=...>
// on the site so every CTA click is recorded even though the user leaves.
trackRouter.get("/api/track/redirect", async (req, res) => {
  const cta = MAX_STR(req.query.cta, 64) || "unknown";
  const location = MAX_STR(req.query.location, 128);
  const url = MAX_STR(req.query.url, 1000) || "/";

  if (!isSafeRedirectTarget(url)) {
    return res.status(400).type("text/plain").send("invalid redirect target");
  }

  // Insert in the background so we don't slow the redirect down.
  (async () => {
    try {
      const db = await getDb();
      if (!db) return;
      await db.insert(ctaClicks).values({
        cta,
        location,
        destination: url,
        sessionId: MAX_STR(req.query.sid, 64),
        referrer: MAX_STR(req.get("referer"), 500),
        userAgent: MAX_STR(req.get("user-agent"), 500),
        utmSource: MAX_STR(req.query.utmSource, 100),
        utmCampaign: MAX_STR(req.query.utmCampaign, 100),
      });
    } catch (err: any) {
      console.error("[track/redirect] insert error:", err?.message);
    }
  })();

  // Don't cache the redirect at any layer — every hit should log.
  res.setHeader("Cache-Control", "no-store");
  res.redirect(302, url);
});
