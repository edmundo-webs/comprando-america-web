/**
 * SEO endpoints — dynamic sitemap, news sitemap (Google News namespace),
 * and RSS feed. Mounted at the root path BEFORE express.static so they
 * win over any prebuilt /sitemap.xml or /rss.xml in dist/public.
 *
 * Why dynamic: hardcoded XMLs in dist/public/ don't include news/blog
 * URLs and never refresh as new content gets published. These endpoints
 * pull from the DB on every request and cache for 10 minutes.
 */
import { and, desc, eq } from "drizzle-orm";
import { Router } from "express";
import { blogPosts, newsArticles } from "../../drizzle/schema";
import { getDb } from "../db";

const BASE = "https://comprandoamerica.com";
const SITE_NAME = "Comprando América";
const SITE_DESC =
  "Club privado de inversión para empresarios latinos. Análisis de visa E-2, LLC en EE.UU., bienes raíces en Texas y Florida, estrategia fiscal e inversiones.";

// Static landings to always include in the sitemap.
const STATIC_URLS: Array<{ loc: string; priority: string; changefreq: string }> = [
  { loc: "/", priority: "1.0", changefreq: "weekly" },
  { loc: "/club-de-inversion-en-estados-unidos", priority: "0.9", changefreq: "weekly" },
  { loc: "/oportunidades-de-inversion-en-estados-unidos", priority: "0.9", changefreq: "weekly" },
  { loc: "/visa-e2-inversionista-usa", priority: "0.9", changefreq: "monthly" },
  { loc: "/estructura-empresarial-en-estados-unidos", priority: "0.8", changefreq: "monthly" },
  { loc: "/estructura-de-inversion-en-usa", priority: "0.8", changefreq: "monthly" },
  { loc: "/bienes-raices-en-usa", priority: "0.8", changefreq: "weekly" },
  { loc: "/ruta-inmobiliaria-en-estados-unidos", priority: "0.7", changefreq: "monthly" },
  { loc: "/eventos", priority: "0.8", changefreq: "weekly" },
  { loc: "/investment-week", priority: "0.7", changefreq: "monthly" },
  { loc: "/formacion", priority: "0.7", changefreq: "monthly" },
  { loc: "/expansion-internacional-empresas", priority: "0.7", changefreq: "monthly" },
  { loc: "/podcast", priority: "0.6", changefreq: "monthly" },
  { loc: "/quienes-somos", priority: "0.6", changefreq: "monthly" },
  { loc: "/recursos", priority: "0.6", changefreq: "monthly" },
  { loc: "/membresia", priority: "0.7", changefreq: "monthly" },
  { loc: "/news", priority: "0.8", changefreq: "daily" },
  { loc: "/blog", priority: "0.7", changefreq: "weekly" },
  { loc: "/terminos", priority: "0.3", changefreq: "yearly" },
  { loc: "/privacidad", priority: "0.3", changefreq: "yearly" },
  { loc: "/disclaimers", priority: "0.3", changefreq: "yearly" },
];

interface SimplePost {
  slug: string;
  updatedAt: Date | null;
  publishedAt: Date | null;
  title?: string | null;
  description?: string | null;
  imageUrl?: string | null;
  category?: string | null;
}

// ─── small in-memory cache so we don't hammer the DB on every crawl ───
type CachedXml = { xml: string; expiresAt: number };
const CACHE_TTL_MS = 10 * 60 * 1000;
const cache: Record<string, CachedXml> = {};

function readCache(key: string): string | null {
  const hit = cache[key];
  if (hit && hit.expiresAt > Date.now()) return hit.xml;
  return null;
}

function writeCache(key: string, xml: string): void {
  cache[key] = { xml, expiresAt: Date.now() + CACHE_TTL_MS };
}

// ─── helpers ──────────────────────────────────────────────────────────
function xmlEscape(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function isoDate(d: Date | null | undefined): string {
  return (d ?? new Date()).toISOString().slice(0, 10);
}

function isoFullDate(d: Date | null | undefined): string {
  return (d ?? new Date()).toISOString();
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

// ─── data fetchers ────────────────────────────────────────────────────
async function fetchPublishedNews(limit = 1000): Promise<SimplePost[]> {
  const db = await getDb();
  if (!db) return [];
  const rows = await db
    .select({
      slug: newsArticles.slug,
      title: newsArticles.title,
      description: newsArticles.description,
      imageUrl: newsArticles.imageUrl,
      category: newsArticles.category,
      publishedAt: newsArticles.publishedAt,
      publishedAtInternal: newsArticles.publishedAtInternal,
      updatedAt: newsArticles.updatedAt,
    })
    .from(newsArticles)
    .where(eq(newsArticles.status, "published"))
    .orderBy(desc(newsArticles.publishedAtInternal), desc(newsArticles.publishedAt))
    .limit(limit);
  return rows.map((r) => ({
    slug: r.slug,
    title: r.title,
    description: r.description,
    imageUrl: r.imageUrl,
    category: r.category as string,
    // Prefer publishedAtInternal (when WE published) over the source's publishedAt
    publishedAt: r.publishedAtInternal ?? r.publishedAt,
    updatedAt: r.updatedAt,
  }));
}

async function fetchPublishedBlog(limit = 1000): Promise<SimplePost[]> {
  const db = await getDb();
  if (!db) return [];
  const rows = await db
    .select({
      slug: blogPosts.slug,
      title: blogPosts.title,
      publishedAt: blogPosts.publishedAt,
      updatedAt: blogPosts.updatedAt,
    })
    .from(blogPosts)
    .where(eq(blogPosts.status, "published"))
    .orderBy(desc(blogPosts.publishedAt))
    .limit(limit);
  return rows.map((r) => ({
    slug: r.slug,
    title: r.title,
    publishedAt: r.publishedAt,
    updatedAt: r.updatedAt,
  }));
}

// ─── xml builders ─────────────────────────────────────────────────────
function buildSitemap(news: SimplePost[], blog: SimplePost[]): string {
  const urls: string[] = [];

  for (const s of STATIC_URLS) {
    urls.push(
      `  <url>\n    <loc>${BASE}${s.loc}</loc>\n    <changefreq>${s.changefreq}</changefreq>\n    <priority>${s.priority}</priority>\n  </url>`
    );
  }
  for (const n of news) {
    if (!n.slug) continue;
    urls.push(
      `  <url>\n    <loc>${BASE}/news/${xmlEscape(n.slug)}</loc>\n    <lastmod>${isoDate(n.updatedAt ?? n.publishedAt)}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>\n  </url>`
    );
  }
  for (const b of blog) {
    if (!b.slug) continue;
    urls.push(
      `  <url>\n    <loc>${BASE}/blog/${xmlEscape(b.slug)}</loc>\n    <lastmod>${isoDate(b.updatedAt ?? b.publishedAt)}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.6</priority>\n  </url>`
    );
  }

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`;
}

function buildNewsSitemap(news: SimplePost[]): string {
  // Google News only accepts items from the last 48h. Filter accordingly.
  const cutoff = Date.now() - 48 * 60 * 60 * 1000;
  const recent = news.filter((n) => {
    const d = n.publishedAt ?? n.updatedAt;
    return d && d.getTime() >= cutoff;
  });

  const urls = recent.map((n) => {
    const title = xmlEscape((n.title ?? "").slice(0, 200));
    const pub = isoFullDate(n.publishedAt ?? n.updatedAt);
    return `  <url>
    <loc>${BASE}/news/${xmlEscape(n.slug)}</loc>
    <news:news>
      <news:publication>
        <news:name>${xmlEscape(SITE_NAME)}</news:name>
        <news:language>es</news:language>
      </news:publication>
      <news:publication_date>${pub}</news:publication_date>
      <news:title>${title}</news:title>
    </news:news>
  </url>`;
  });

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">\n${urls.join("\n")}\n</urlset>\n`;
}

function buildRss(news: SimplePost[]): string {
  const items = news.slice(0, 30).map((n) => {
    const link = `${BASE}/news/${xmlEscape(n.slug)}`;
    const title = xmlEscape((n.title ?? "").slice(0, 300));
    const desc = xmlEscape((n.description ?? "").slice(0, 500));
    const pub = (n.publishedAt ?? n.updatedAt ?? new Date()).toUTCString();
    const cat = xmlEscape(categoryLabel(n.category));
    const enclosure = n.imageUrl
      ? `      <enclosure url="${xmlEscape(n.imageUrl)}" type="image/jpeg" />\n`
      : "";
    return `    <item>
      <title>${title}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${pub}</pubDate>
      <category>${cat}</category>
${enclosure}      <description>${desc}</description>
    </item>`;
  });

  const lastBuild = new Date().toUTCString();
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${xmlEscape(SITE_NAME)} — Noticias</title>
    <link>${BASE}/news</link>
    <atom:link href="${BASE}/rss.xml" rel="self" type="application/rss+xml" />
    <description>${xmlEscape(SITE_DESC)}</description>
    <language>es-MX</language>
    <lastBuildDate>${lastBuild}</lastBuildDate>
${items.join("\n")}
  </channel>
</rss>
`;
}

// ─── router ───────────────────────────────────────────────────────────
export const seoRouter = Router();

seoRouter.get("/sitemap.xml", async (_req, res) => {
  try {
    const cached = readCache("sitemap");
    if (cached) {
      res.type("application/xml").send(cached);
      return;
    }
    const [news, blog] = await Promise.all([fetchPublishedNews(), fetchPublishedBlog()]);
    const xml = buildSitemap(news, blog);
    writeCache("sitemap", xml);
    res.type("application/xml").send(xml);
  } catch (err: any) {
    console.error("[seo] sitemap error:", err?.message);
    res.status(500).type("text/plain").send("sitemap error");
  }
});

seoRouter.get("/sitemap_news.xml", async (_req, res) => {
  try {
    const cached = readCache("sitemap_news");
    if (cached) {
      res.type("application/xml").send(cached);
      return;
    }
    const news = await fetchPublishedNews(200);
    const xml = buildNewsSitemap(news);
    writeCache("sitemap_news", xml);
    res.type("application/xml").send(xml);
  } catch (err: any) {
    console.error("[seo] sitemap_news error:", err?.message);
    res.status(500).type("text/plain").send("sitemap_news error");
  }
});

seoRouter.get(["/rss.xml", "/feed", "/feed.xml"], async (_req, res) => {
  try {
    const cached = readCache("rss");
    if (cached) {
      res.type("application/rss+xml").send(cached);
      return;
    }
    const news = await fetchPublishedNews(30);
    const xml = buildRss(news);
    writeCache("rss", xml);
    res.type("application/rss+xml").send(xml);
  } catch (err: any) {
    console.error("[seo] rss error:", err?.message);
    res.status(500).type("text/plain").send("rss error");
  }
});
