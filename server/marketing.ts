/**
 * Base de audiencias compartida entre los 3 sitios (Comprando América,
 * Edmundo Treviño, Garantías Extraordinarias).
 *
 * Todos los formularios (newsletter, leads, contacto, conferencista,
 * diagnóstico) escriben aquí además de sus tablas locales, marcando el
 * sitio y el formulario de origen para poder segmentar los envíos.
 *
 * Tablas (en la base apuntada por MARKETING_DATABASE_URL, TiDB Cloud):
 *   mk_subscribers  — maestro de contactos, dedupe por email. Guarda el
 *                     primer origen (firstSite/firstForm), la lista de
 *                     sitios donde ha aparecido (sites, JSON) y sus
 *                     intereses (interests, JSON).
 *   mk_events       — bitácora de cada captura (alta, lead, contacto,
 *                     verificación, baja) con el payload completo del
 *                     formulario. Permite segmentar por "llegó por X"
 *                     sin perder historial cuando el email se repite.
 *
 * El módulo es tolerante a fallos: si MARKETING_DATABASE_URL no está
 * configurada, o la base compartida falla, se loguea y el flujo del sitio
 * continúa — la captura local nunca se bloquea por la compartida.
 *
 * Env vars:
 *   MARKETING_DATABASE_URL  — mysql://... de la base compartida (TiDB, SSL)
 *   RESEND_API_KEY          — API key de Resend para doble opt-in
 *   RESEND_FROM             — remitente, ej. "Comprando América <news@dominio.com>"
 *   SITE_BASE_URL           — URL pública del sitio, para links de verificación/baja
 */
import mysql from "mysql2/promise";
import crypto from "crypto";
import { Router } from "express";

// ── Identidad de este sitio dentro de la base compartida ────────────────
export const MARKETING_SITE = "comprando-america";
export const MARKETING_SITE_NAME = "Comprando América";

const RESEND_ENDPOINT = "https://api.resend.com/emails";

function env(name: string): string {
  return process.env[name] ?? "";
}

// ── Pool hacia la base compartida (TiDB requiere SSL) ───────────────────
let _mkPool: mysql.Pool | null = null;

export function getMarketingPool(): mysql.Pool | null {
  if (!_mkPool && env("MARKETING_DATABASE_URL")) {
    _mkPool = mysql.createPool({
      uri: env("MARKETING_DATABASE_URL"),
      ssl: { rejectUnauthorized: true },
      connectionLimit: 3,
    });
  }
  return _mkPool;
}

// ── DDL idempotente (mismo patrón que ensureAnalyticsTables) ────────────
const DDL = {
  subscribers: `
    CREATE TABLE IF NOT EXISTS \`mk_subscribers\` (
      \`id\` int AUTO_INCREMENT NOT NULL,
      \`email\` varchar(320) NOT NULL,
      \`name\` varchar(255),
      \`whatsapp\` varchar(50),
      \`firstSite\` varchar(100) NOT NULL,
      \`firstForm\` varchar(100) NOT NULL,
      \`sites\` text NOT NULL,
      \`interests\` text,
      \`status\` varchar(20) NOT NULL DEFAULT 'active',
      \`isVerified\` varchar(5) NOT NULL DEFAULT 'false',
      \`verificationToken\` varchar(64),
      \`unsubscribeToken\` varchar(64) NOT NULL,
      \`utmSource\` varchar(100),
      \`utmMedium\` varchar(100),
      \`utmCampaign\` varchar(100),
      \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
      \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      CONSTRAINT \`mk_subscribers_id\` PRIMARY KEY(\`id\`),
      CONSTRAINT \`mk_subscribers_email_unique\` UNIQUE(\`email\`),
      CONSTRAINT \`mk_subscribers_unsub_unique\` UNIQUE(\`unsubscribeToken\`)
    )`,
  events: `
    CREATE TABLE IF NOT EXISTS \`mk_events\` (
      \`id\` int AUTO_INCREMENT NOT NULL,
      \`email\` varchar(320) NOT NULL,
      \`site\` varchar(100) NOT NULL,
      \`form\` varchar(100) NOT NULL,
      \`eventType\` varchar(50) NOT NULL,
      \`payload\` text,
      \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT \`mk_events_id\` PRIMARY KEY(\`id\`)
    )`,
};

const INDEXES: { table: string; name: string; sql: string }[] = [
  {
    table: "mk_events",
    name: "mk_events_email_idx",
    sql: `CREATE INDEX \`mk_events_email_idx\` ON \`mk_events\` (\`email\`)`,
  },
  {
    table: "mk_events",
    name: "mk_events_site_idx",
    sql: `CREATE INDEX \`mk_events_site_idx\` ON \`mk_events\` (\`site\`, \`createdAt\`)`,
  },
];

async function indexExists(pool: mysql.Pool, table: string, name: string): Promise<boolean> {
  const [rows] = await pool.execute(
    `SELECT 1 FROM information_schema.STATISTICS
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND INDEX_NAME = ? LIMIT 1`,
    [table, name]
  );
  return (rows as unknown[]).length > 0;
}

export async function ensureMarketingTables(): Promise<void> {
  const pool = getMarketingPool();
  if (!pool) {
    console.warn("[marketing] MARKETING_DATABASE_URL no configurada — base compartida deshabilitada");
    return;
  }
  try {
    await pool.query(DDL.subscribers);
    await pool.query(DDL.events);
    for (const idx of INDEXES) {
      try {
        if (await indexExists(pool, idx.table, idx.name)) continue;
        await pool.query(idx.sql);
      } catch (err: any) {
        if (!/duplicate|exists/i.test(err?.message ?? "")) {
          console.warn(`[marketing] índice ${idx.name} falló:`, err?.message);
        }
      }
    }
    console.log("[marketing] tablas compartidas listas");
  } catch (err: any) {
    console.error("[marketing] ensureMarketingTables falló:", err?.message);
  }
}

// ── Captura de contactos ────────────────────────────────────────────────
export type MarketingEventType = "subscribe" | "lead" | "contact";

export interface CaptureInput {
  email: string;
  name?: string | null;
  whatsapp?: string | null;
  /** Formulario de origen: "newsletter", "conferencista", "contacto", "diagnostico", o la fuente del lead. */
  form: string;
  eventType: MarketingEventType;
  interests?: string[];
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  /** Payload completo del formulario; se guarda en mk_events para no perder campos. */
  payload?: Record<string, unknown>;
  /** true en formularios de newsletter: dispara el correo de doble opt-in vía Resend. */
  sendVerification?: boolean;
}

function newToken(): string {
  return crypto.randomBytes(24).toString("base64url");
}

function mergeJsonList(current: string | null | undefined, additions: string[]): string {
  let list: string[] = [];
  try {
    const parsed = JSON.parse(current ?? "[]");
    if (Array.isArray(parsed)) list = parsed.filter((x) => typeof x === "string");
  } catch {
    /* lista corrupta: se reconstruye */
  }
  for (const item of additions) {
    if (item && !list.includes(item)) list.push(item);
  }
  return JSON.stringify(list);
}

/**
 * Registra un contacto en la base compartida: upsert en mk_subscribers
 * (dedupe por email, acumulando sitios e intereses) + evento en mk_events.
 * Nunca lanza — cualquier error se loguea y se devuelve null.
 */
export async function captureAudienceContact(input: CaptureInput): Promise<{ created: boolean } | null> {
  const pool = getMarketingPool();
  if (!pool) return null;

  const email = input.email.trim().toLowerCase();
  if (!email || !email.includes("@")) return null;

  try {
    const [rows] = await pool.execute(
      "SELECT id, name, whatsapp, sites, interests, status, isVerified, verificationToken, unsubscribeToken FROM mk_subscribers WHERE email = ? LIMIT 1",
      [email]
    );
    const existing = (rows as any[])[0];
    let created = false;
    let verificationToken: string | null = null;
    let unsubscribeToken: string;

    if (!existing) {
      created = true;
      verificationToken = newToken();
      unsubscribeToken = newToken();
      await pool.execute(
        `INSERT INTO mk_subscribers
          (email, name, whatsapp, firstSite, firstForm, sites, interests, status, isVerified,
           verificationToken, unsubscribeToken, utmSource, utmMedium, utmCampaign)
         VALUES (?, ?, ?, ?, ?, ?, ?, 'active', 'false', ?, ?, ?, ?, ?)`,
        [
          email,
          input.name ?? null,
          input.whatsapp ?? null,
          MARKETING_SITE,
          input.form,
          JSON.stringify([MARKETING_SITE]),
          input.interests?.length ? JSON.stringify(input.interests) : null,
          verificationToken,
          unsubscribeToken,
          input.utmSource ?? null,
          input.utmMedium ?? null,
          input.utmCampaign ?? null,
        ]
      );
    } else {
      unsubscribeToken = existing.unsubscribeToken;
      // Una re-suscripción explícita reactiva a un dado de baja; un lead o
      // contacto no revierte la baja (respeta la decisión del usuario).
      const reactivate = input.eventType === "subscribe" && existing.status === "unsubscribed";
      if (reactivate || (input.sendVerification && existing.isVerified !== "true")) {
        verificationToken = existing.verificationToken || newToken();
      }
      await pool.execute(
        `UPDATE mk_subscribers SET
           name = COALESCE(name, ?),
           whatsapp = COALESCE(whatsapp, ?),
           sites = ?,
           interests = ?,
           status = ?,
           verificationToken = COALESCE(?, verificationToken)
         WHERE id = ?`,
        [
          input.name ?? null,
          input.whatsapp ?? null,
          mergeJsonList(existing.sites, [MARKETING_SITE]),
          mergeJsonList(existing.interests, input.interests ?? []),
          reactivate ? "active" : existing.status,
          verificationToken,
          existing.id,
        ]
      );
    }

    await recordMarketingEvent(email, input.form, input.eventType, input.payload);

    if (input.sendVerification && verificationToken) {
      // Fire-and-forget: el correo de confirmación nunca bloquea la respuesta.
      sendVerificationEmail(email, input.name ?? null, verificationToken, unsubscribeToken).catch((err) =>
        console.error("[marketing] envío de verificación falló:", err?.message)
      );
    }

    return { created };
  } catch (err: any) {
    console.error("[marketing] captureAudienceContact falló:", err?.message, err?.code);
    return null;
  }
}

export async function recordMarketingEvent(
  email: string,
  form: string,
  eventType: string,
  payload?: Record<string, unknown>
): Promise<void> {
  const pool = getMarketingPool();
  if (!pool) return;
  try {
    await pool.execute(
      "INSERT INTO mk_events (email, site, form, eventType, payload) VALUES (?, ?, ?, ?, ?)",
      [
        email.trim().toLowerCase(),
        MARKETING_SITE,
        form,
        eventType,
        payload ? JSON.stringify(payload).slice(0, 65_000) : null,
      ]
    );
  } catch (err: any) {
    console.error("[marketing] recordMarketingEvent falló:", err?.message);
  }
}

/** Marca la baja global (afecta los envíos de los 3 sitios). */
export async function unsubscribeByEmail(email: string, form = "unsubscribe"): Promise<void> {
  const pool = getMarketingPool();
  if (!pool) return;
  try {
    await pool.execute("UPDATE mk_subscribers SET status = 'unsubscribed' WHERE email = ?", [
      email.trim().toLowerCase(),
    ]);
    await recordMarketingEvent(email, form, "unsubscribe");
  } catch (err: any) {
    console.error("[marketing] unsubscribeByEmail falló:", err?.message);
  }
}

// ── Resend ──────────────────────────────────────────────────────────────
async function sendResendEmail(to: string, subject: string, html: string): Promise<boolean> {
  const apiKey = env("RESEND_API_KEY");
  if (!apiKey) {
    console.warn("[marketing] RESEND_API_KEY no configurada — no se envía correo");
    return false;
  }
  const from = env("RESEND_FROM") || `${MARKETING_SITE_NAME} <onboarding@resend.dev>`;
  const res = await fetch(RESEND_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to: [to], subject, html }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    console.error(`[marketing] Resend respondió ${res.status}:`, body.slice(0, 500));
    return false;
  }
  return true;
}

function siteBaseUrl(): string {
  return env("SITE_BASE_URL").replace(/\/+$/, "");
}

export async function sendVerificationEmail(
  email: string,
  name: string | null,
  verificationToken: string,
  unsubscribeToken: string
): Promise<boolean> {
  const base = siteBaseUrl();
  if (!base) {
    console.warn("[marketing] SITE_BASE_URL no configurada — no se puede armar el link de verificación");
    return false;
  }
  const verifyUrl = `${base}/api/marketing/verify?token=${encodeURIComponent(verificationToken)}`;
  const unsubUrl = `${base}/api/marketing/unsubscribe?token=${encodeURIComponent(unsubscribeToken)}`;
  const saludo = name ? `Hola ${name},` : "Hola,";
  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#1a1a2e">
      <h2 style="color:#16213e">Confirma tu suscripción</h2>
      <p>${saludo}</p>
      <p>Gracias por suscribirte al newsletter de <strong>${MARKETING_SITE_NAME}</strong>.
         Para completar tu suscripción y empezar a recibir contenido, confirma tu correo:</p>
      <p style="text-align:center;margin:32px 0">
        <a href="${verifyUrl}"
           style="background:#16213e;color:#ffffff;padding:14px 28px;border-radius:6px;text-decoration:none;display:inline-block">
          Confirmar suscripción
        </a>
      </p>
      <p style="font-size:13px;color:#555">Si no solicitaste esta suscripción, ignora este correo.</p>
      <hr style="border:none;border-top:1px solid #eee;margin:24px 0" />
      <p style="font-size:12px;color:#888">
        ¿No quieres recibir más correos? <a href="${unsubUrl}" style="color:#888">Darme de baja</a>
      </p>
    </div>`;
  return sendResendEmail(email, `Confirma tu suscripción a ${MARKETING_SITE_NAME}`, html);
}

// ── Rutas públicas para los links del correo (verificar / baja) ─────────
function htmlPage(title: string, message: string): string {
  return `<!doctype html><html lang="es"><head><meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>${title}</title></head>
    <body style="font-family:Arial,Helvetica,sans-serif;background:#f5f5f7;margin:0;padding:48px 16px">
      <div style="max-width:480px;margin:0 auto;background:#fff;border-radius:12px;padding:40px;text-align:center;box-shadow:0 2px 12px rgba(0,0,0,.06)">
        <h1 style="color:#16213e;font-size:22px">${title}</h1>
        <p style="color:#444;line-height:1.6">${message}</p>
        <p style="margin-top:32px"><a href="/" style="color:#16213e">Volver al sitio</a></p>
      </div>
    </body></html>`;
}

export function marketingRouter(): Router {
  const router = Router();

  // GET /api/marketing/verify?token=...  (link del correo de doble opt-in)
  router.get("/api/marketing/verify", async (req, res) => {
    const token = typeof req.query.token === "string" ? req.query.token.slice(0, 64) : "";
    const pool = getMarketingPool();
    if (!token || !pool) {
      return res.status(400).send(htmlPage("Link inválido", "El link de verificación no es válido o el servicio no está disponible."));
    }
    try {
      const [rows] = await pool.execute(
        "SELECT id, email FROM mk_subscribers WHERE verificationToken = ? LIMIT 1",
        [token]
      );
      const sub = (rows as any[])[0];
      if (!sub) {
        return res.status(404).send(htmlPage("Link inválido", "Este link de verificación no existe o ya fue utilizado."));
      }
      await pool.execute(
        "UPDATE mk_subscribers SET isVerified = 'true', verificationToken = NULL, status = 'active' WHERE id = ?",
        [sub.id]
      );
      await recordMarketingEvent(sub.email, "verify-link", "verify");
      return res.send(htmlPage("Suscripción confirmada", "Tu correo quedó verificado. Ya estás dentro del newsletter. ¡Gracias!"));
    } catch (err: any) {
      console.error("[marketing] verify falló:", err?.message);
      return res.status(500).send(htmlPage("Error", "No pudimos procesar la verificación. Intenta de nuevo más tarde."));
    }
  });

  // GET /api/marketing/unsubscribe?token=...  (link de baja en cada correo)
  router.get("/api/marketing/unsubscribe", async (req, res) => {
    const token = typeof req.query.token === "string" ? req.query.token.slice(0, 64) : "";
    const pool = getMarketingPool();
    if (!token || !pool) {
      return res.status(400).send(htmlPage("Link inválido", "El link de baja no es válido o el servicio no está disponible."));
    }
    try {
      const [rows] = await pool.execute(
        "SELECT id, email FROM mk_subscribers WHERE unsubscribeToken = ? LIMIT 1",
        [token]
      );
      const sub = (rows as any[])[0];
      if (!sub) {
        return res.status(404).send(htmlPage("Link inválido", "Este link de baja no existe."));
      }
      await pool.execute("UPDATE mk_subscribers SET status = 'unsubscribed' WHERE id = ?", [sub.id]);
      await recordMarketingEvent(sub.email, "unsubscribe-link", "unsubscribe");
      return res.send(htmlPage("Baja confirmada", "No recibirás más correos del newsletter. Puedes volver a suscribirte cuando quieras."));
    } catch (err: any) {
      console.error("[marketing] unsubscribe falló:", err?.message);
      return res.status(500).send(htmlPage("Error", "No pudimos procesar la baja. Intenta de nuevo más tarde."));
    }
  });

  return router;
}
