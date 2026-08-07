/**
 * Bot-aware meta middleware.
 *
 * When a known no-JS crawler (Facebook, WhatsApp, Twitter, LinkedIn, Slack,
 * Discord, Telegram, GPTBot, ClaudeBot, PerplexityBot, etc.) requests
 * /news/:slug or /blog/:slug, we intercept before serve-static and return
 * a stub HTML that includes the FULL article body inline (plain text) so
 * AI crawlers can actually read the piece — not just the title + link.
 * Real users still get the SPA — only crawlers see this shim.
 *
 * Why: the SPA injects meta tags via useEffect after JS loads. Crawlers
 * don't execute JS, so they always saw the global meta from index.html
 * → every shared link showed the same generic preview AND every AI crawler
 * could only see two lines of text about the article.
 */
import { eq } from "drizzle-orm";
import type { NextFunction, Request, Response } from "express";
import { blogPosts, newsArticles, users } from "../../drizzle/schema";
import { getDb } from "../db";

const BASE = "https://comprandoamerica.com";
const DEFAULT_IMAGE =
  "https://res.cloudinary.com/dgruohz6f/image/upload/v1773439317/comprando-america/smuMGomxJclpEXzg.png";
const DEFAULT_AUTHOR = "Equipo Comprando América";

// Cap on the plain-text body we inline. ~50k chars ≈ 15–25 pages, plenty
// for any real article without shipping megabytes to bots.
const MAX_BODY_CHARS = 50_000;

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

/**
 * Turn stored article HTML/Markdown into plain text a crawler can read.
 * - Drops <script>, <style>, and HTML comments entirely.
 * - Converts <p>, <br>, <li>, <h1..6>, <div> boundaries to newlines so
 *   paragraph structure survives.
 * - Strips remaining tags.
 * - Decodes the most common entities.
 * - Collapses runs of whitespace (but keeps blank-line separators).
 * - Truncates to MAX_BODY_CHARS.
 * Works on Markdown too: Markdown without HTML just falls through the
 * strip pass unchanged (there are no tags to strip), so images and links
 * only leave their alt/anchor text after a final Markdown cleanup pass.
 */
function htmlToText(raw: string | null | undefined): string {
  if (!raw) return "";
  let s = String(raw);

  // Drop script/style blocks including their content.
  s = s.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ");
  s = s.replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ");
  // Drop HTML comments.
  s = s.replace(/<!--[\s\S]*?-->/g, " ");

  // Preserve paragraph structure: replace block-level closers/opens with \n.
  s = s.replace(/<\s*(\/?p|br\s*\/?|\/li|\/h[1-6]|\/div|\/tr)[^>]*>/gi, "\n");
  s = s.replace(/<\s*(li|h[1-6]|div|tr|section|article)[^>]*>/gi, "\n");
  // Strip everything else.
  s = s.replace(/<[^>]+>/g, "");

  // Markdown fallbacks: images ![alt](url), links [text](url), bold, italics, headings.
  s = s.replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1");
  s = s.replace(/\[([^\]]+)\]\([^)]*\)/g, "$1");
  s = s.replace(/^\s{0,3}#{1,6}\s+/gm, "");
  s = s.replace(/(\*\*|__)(.*?)\1/g, "$2");
  s = s.replace(/(\*|_)(.*?)\1/g, "$2");
  s = s.replace(/`([^`]+)`/g, "$1");

  // Decode a handful of common entities.
  s = s
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&mdash;/gi, "—")
    .replace(/&ndash;/gi, "–")
    .replace(/&hellip;/gi, "…")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCharCode(parseInt(n, 16)));

  // Normalize whitespace but keep blank-line separators.
  s = s.replace(/\r\n?/g, "\n");
  s = s.replace(/[ \t]+/g, " ");
  s = s.replace(/\n[ \t]+/g, "\n");
  s = s.replace(/[ \t]+\n/g, "\n");
  s = s.replace(/\n{3,}/g, "\n\n");
  s = s.trim();

  if (s.length > MAX_BODY_CHARS) {
    s = s.slice(0, MAX_BODY_CHARS).replace(/\s+\S*$/, "") + "…";
  }
  return s;
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
  /** Full article body as plain text, already truncated. */
  bodyText?: string;
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

  // Body: paragraphs, each in its own <p>, with the article header + author
  // + published date, so an AI crawler sees a complete, readable article.
  const paragraphs = (m.bodyText || "")
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => `<p>${e(p).replace(/\n/g, "<br />")}</p>`)
    .join("\n");

  const bylineBits = [
    m.author ? `Por ${e(m.author)}` : "",
    m.publishedTime ? new Date(m.publishedTime).toISOString().slice(0, 10) : "",
  ].filter(Boolean).join(" · ");
  const byline = bylineBits ? `<p><em>${bylineBits}</em></p>` : "";

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
<article>
<h1>${e(m.title)}</h1>
${byline}
<p>${e(m.description)}</p>
${paragraphs}
<p><a href="${e(m.url)}">Leer en Comprando América</a></p>
</article>
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
  const bodyText = htmlToText(row.body || row.content || row.rawContent);
  const author = row.author || DEFAULT_AUTHOR;
  return {
    title: `${row.title} | Comprando América`,
    description,
    url,
    image,
    ogType: "article",
    publishedTime: pub ? new Date(pub).toISOString() : undefined,
    modifiedTime: row.updatedAt ? new Date(row.updatedAt).toISOString() : undefined,
    author,
    bodyText,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      headline: row.title,
      description,
      image: [image],
      datePublished: pub ? new Date(pub).toISOString() : undefined,
      dateModified: row.updatedAt ? new Date(row.updatedAt).toISOString() : undefined,
      author: { "@type": "Organization", name: author },
      publisher: {
        "@type": "Organization",
        name: "Comprando América",
        logo: { "@type": "ImageObject", url: DEFAULT_IMAGE },
      },
      mainEntityOfPage: { "@type": "WebPage", "@id": url },
      articleSection: categoryLabel(row.category),
      articleBody: bodyText || undefined,
    },
  };
}

async function metaForBlog(slug: string): Promise<MetaPayload | null> {
  const db = await getDb();
  if (!db) return null;
  const rows = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug)).limit(1);
  const row: any = rows[0];
  if (!row || row.status !== "published") return null;

  // Look up the real author from `users` when the post has a `createdBy` FK.
  // Diego (and anyone else with a byline) shows up correctly; the "Equipo"
  // label stays as fallback for legacy or unclaimed posts.
  let authorName: string | undefined;
  if (row.createdBy) {
    try {
      const authorRows = await db
        .select({ name: users.name })
        .from(users)
        .where(eq(users.id, row.createdBy))
        .limit(1);
      const rawName = (authorRows[0] as any)?.name;
      if (rawName && String(rawName).trim().length > 0) {
        authorName = String(rawName).trim();
      }
    } catch (err: any) {
      console.warn("[bot-meta] author lookup failed:", err?.message);
    }
  }
  const author = authorName || DEFAULT_AUTHOR;
  const authorIsPerson = author !== DEFAULT_AUTHOR;

  const url = `${BASE}/blog/${slug}`;
  const image = row.featuredImage && /^https?:\/\//.test(row.featuredImage) ? row.featuredImage : DEFAULT_IMAGE;
  const description = (row.excerpt || row.metaDescription || "").slice(0, 200) ||
    "Blog de Comprando América — análisis profundo de inversión y migración a EE.UU.";
  // Prefer pre-rendered htmlContent (already sanitized/rendered), fall back
  // to the raw content field (Markdown or HTML — htmlToText handles both).
  const bodyText = htmlToText(row.htmlContent || row.content);
  return {
    title: `${row.title} | Comprando América`,
    description,
    url,
    image,
    ogType: "article",
    publishedTime: row.publishedAt ? new Date(row.publishedAt).toISOString() : undefined,
    modifiedTime: row.updatedAt ? new Date(row.updatedAt).toISOString() : undefined,
    author,
    bodyText,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: row.title,
      description,
      image: [image],
      datePublished: row.publishedAt ? new Date(row.publishedAt).toISOString() : undefined,
      dateModified: row.updatedAt ? new Date(row.updatedAt).toISOString() : undefined,
      author: { "@type": authorIsPerson ? "Person" : "Organization", name: author },
      publisher: {
        "@type": "Organization",
        name: "Comprando América",
        logo: { "@type": "ImageObject", url: DEFAULT_IMAGE },
      },
      mainEntityOfPage: { "@type": "WebPage", "@id": url },
      inLanguage: row.language === "en" ? "en-US" : "es-MX",
      articleBody: bodyText || undefined,
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

// Exported for unit-test / debugging use only.
export { htmlToText };
