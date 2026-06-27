/**
 * Bot-aware meta middleware.
 *
 * When a known no-JS crawler (Facebook, WhatsApp, Twitter, LinkedIn, Slack,
 * Discord, Telegram, GPTBot, ClaudeBot, PerplexityBot, etc.) requests
 * /news/:slug or /blog/:slug, we intercept before serve-static and return
 * a tiny HTML stub with the per-article title / description / og:image
 * inlined. This is what these bots use to render link previews. Real
 * users still get the SPA — only crawlers see this shim.
 *
 * Why: the SPA injects meta tags via useEffect after JS loads. Crawlers
 * don't execute JS, so they always saw the global meta from index.html
 * → every shared link showed the same generic preview.
 */
import { eq } from "drizzle-orm";
import type { NextFunction, Request, Response } from "express";
import { blogPosts, newsArticles } from "../../drizzle/schema";
import { getDb } from "../db";

const BASE = "https://comprandoamerica.com";
const DEFAULT_IMAGE =
  "https://res.cloudinary.com/dgruohz6f/image/upload/v1773439317/comprando-america/smuMGomxJclpEXzg.png";

// User-agent fragments that identify crawlers that DON'T execute JS.
// (Googlebot and Bingbot do execute JS for indexing — they're omitted so they
// still get the SPA experience, which Google has explicitly said it prefers.)
const BOT_UA_PATTERNS = [
  "facebookexternalhit",
  "facebot",
  "twitterbot",
  "linkedinbot",
  "slackbot",
  "discordbot",
  "whatsapp",
  "telegrambot",
  "skypeuripreview",
  "embedly",
  "redditbot",
  "pinterest",
  "applebot",
  "msnbot",
  "gptbot",
  "chatgpt-user",
  "oai-searchbot",
  "claudebot",
  "claude-web",
  "anthropic-ai",
  "perplexitybot",
  "perplexity-user",
  "ccbot",
  "cohere-ai",
  "meta-externalagent",
  "amazonbot",
  "youbot",
  "diffbot",
];

function isBotUA(ua: string | undefined): boolean {
  if (!ua) return false;
  const lower = ua.toLowerCase();
  return BOT_UA_PATTERNS.some((p) => lower.includes(p));
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

interface MetaPayload {
  title: string;
  description: string;
  url: string;
  image: string;
  ogType: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  jsonLd?: Record<string, unknown>;
}

function renderShim(m: MetaPayload): string {
  const e = escapeHtml;
  const articleTags = m.ogType === "article"
    ? [
        m.publishedTime ? `<meta property="article:published_time" content="${e(m.publishedTime)}" />` : "",
        m.modifiedTime ? `<meta property="article:modified_time" content="${e(m.modifiedTime)}" />` : "",
        m.author ? `<meta property="article:author" content="${e(m.author)}" />` : "",
      ].filter(Boolean).join("\n    ")
    : "";

  const jsonLd = m.jsonLd
    ? `<script type="application/ld+json">${JSON.stringify(m.jsonLd)}</script>`
    : "";

  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8" />
<title>${e(m.title)}</title>
<meta name="description" content="${e(m.description)}" />
<link rel="canonical" href="${e(m.url)}" />
<meta property="og:type" content="${m.ogType}" />
<meta property="og:title" content="${e(m.title)}" />
<meta property="og:description" content="${e(m.description)}" />
<meta property="og:url" content="${e(m.url)}" />
<meta property="og:image" content="${e(m.image)}" />
<meta property="og:site_name" content="Comprando América" />
<meta property="og:locale" content="es_MX" />
${articleTags}
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${e(m.title)}" />
<meta name="twitter:description" content="${e(m.description)}" />
<meta name="twitter:image" content="${e(m.image)}" />
${jsonLd}
</head>
<body>
<h1>${e(m.title)}</h1>
<p>${e(m.description)}</p>
<p><a href="${e(m.url)}">Leer en Comprando América</a></p>
</body>
</html>`;
}

function categoryLabel(cat: string | null | undefined): string {
  switch (cat) {
    case "visas-migracion": return "Visas y Migración";
    case "economia-finanzas": return "Economía y Finanzas";
    case "bienes-raices": return "Bienes Raíces";
    case "llc-negocios": return "LLC y Negocios";
    case "inversiones": return "Inversiones";
    default: return "Noticias";
  }
}

async function metaForNews(slug: string): Promise<MetaPayload | null> {
  const db = await getDb();
  if (!db) return null;
  const rows = await db
    .select()
    .from(newsArticles)
    .where(eq(newsArticles.slug, slug))
    .limit(1);
  const row: any = rows[0];
  if (!row || row.status !== "published") return null;
  const url = `${BASE}/news/${slug}`;
  const image = row.imageUrl && /^https?:\/\//.test(row.imageUrl) ? row.imageUrl : DEFAULT_IMAGE;
  const description = (row.description || "").slice(0, 200) || "Noticias para inversionistas latinos en EE.UU.";
  const pub = row.publishedAtInternal || row.publishedAt;
  return {
    title: `${row.title} | Comprando América`,
    description,
    url,
    image,
    ogType: "article",
    publishedTime: pub ? new Date(pub).toISOString() : undefined,
    modifiedTime: row.updatedAt ? new Date(row.updatedAt).toISOString() : undefined,
    author: row.author || "Equipo Comprando América",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      headline: row.title,
      description,
      image: [image],
      datePublished: pub ? new Date(pub).toISOString() : undefined,
      dateModified: row.updatedAt ? new Date(row.updatedAt).toISOString() : undefined,
      author: { "@type": "Organization", name: row.author || "Equipo Comprando América" },
      publisher: {
        "@type": "Organization",
        name: "Comprando América",
        logo: { "@type": "ImageObject", url: DEFAULT_IMAGE },
      },
      mainEntityOfPage: { "@type": "WebPage", "@id": url },
      articleSection: categoryLabel(row.category),
    },
  };
}

async function metaForBlog(slug: string): Promise<MetaPayload | null> {
  const db = await getDb();
  if (!db) return null;
  const rows = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug)).limit(1);
  const row: any = rows[0];
  if (!row || row.status !== "published") return null;
  const url = `${BASE}/blog/${slug}`;
  const image = row.featuredImage && /^https?:\/\//.test(row.featuredImage) ? row.featuredImage : DEFAULT_IMAGE;
  const description = (row.excerpt || row.metaDescription || "").slice(0, 200) ||
    "Blog de Comprando América — análisis profundo de inversión y migración a EE.UU.";
  return {
    title: `${row.title} | Comprando América`,
    description,
    url,
    image,
    ogType: "article",
    publishedTime: row.publishedAt ? new Date(row.publishedAt).toISOString() : undefined,
    modifiedTime: row.updatedAt ? new Date(row.updatedAt).toISOString() : undefined,
    author: "Equipo Comprando América",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: row.title,
      description,
      image: [image],
      datePublished: row.publishedAt ? new Date(row.publishedAt).toISOString() : undefined,
      dateModified: row.updatedAt ? new Date(row.updatedAt).toISOString() : undefined,
      author: { "@type": "Organization", name: "Equipo Comprando América" },
      publisher: {
        "@type": "Organization",
        name: "Comprando América",
        logo: { "@type": "ImageObject", url: DEFAULT_IMAGE },
      },
      mainEntityOfPage: { "@type": "WebPage", "@id": url },
      inLanguage: row.language === "en" ? "en-US" : "es-MX",
    },
  };
}

/**
 * Express middleware. Only acts on /news/:slug and /blog/:slug requests
 * coming from known no-JS bots; everything else passes through.
 */
export async function botMetaMiddleware(req: Request, res: Response, next: NextFunction) {
  if (req.method !== "GET" && req.method !== "HEAD") return next();
  const ua = req.headers["user-agent"];
  if (!isBotUA(ua)) return next();

  const newsMatch = req.path.match(/^\/news\/([A-Za-z0-9-]+)\/?$/);
  const blogMatch = req.path.match(/^\/blog\/([A-Za-z0-9-]+)\/?$/);
  if (!newsMatch && !blogMatch) return next();

  try {
    const meta = newsMatch
      ? await metaForNews(newsMatch[1]!)
      : await metaForBlog(blogMatch![1]!);
    if (!meta) return next();
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=300");
    res.send(renderShim(meta));
  } catch (err: any) {
    console.error("[bot-meta] error:", err?.message);
    next();
  }
}
