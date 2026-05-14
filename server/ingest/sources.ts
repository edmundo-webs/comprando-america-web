/**
 * RSS source catalog for the Comprando América news pipeline.
 *
 * Audience: Latin American investor (typically Mexican, $150k-$500k capacity)
 * evaluating an E-2 visa, US LLC structuring, real estate diversification
 * (Texas / Florida), and US tax strategy as wealth-protection levers.
 *
 * Notes:
 *   - Feed URLs occasionally rename or rate-limit; the ingestor logs
 *     `lastError` per feed and auto-deactivates after 5 consecutive failures.
 *   - Priority is 1 (low) to 10 (high). Higher-priority sources win when
 *     multiple candidates compete for the same daily slot.
 *   - `language` is informational only; the rewrite pipeline emits Spanish
 *     for the published article regardless of the source language.
 *
 * To re-seed `ca_news_feeds` from this list run:  pnpm news:seed-feeds
 */

export type CaCategory =
  | "visas-migracion"
  | "economia-finanzas"
  | "bienes-raices"
  | "llc-negocios"
  | "inversiones";

export type CaLanguage = "es" | "en";

export interface SourceSeed {
  slug: string;
  name: string;
  homepage: string;
  feedUrl: string;
  category: CaCategory;
  language?: CaLanguage;
  priority?: number; // 1-10
}

export const SOURCES: SourceSeed[] = [
  // ─────────────── VISAS Y MIGRACIÓN ───────────────
  // Note: USCIS, State Department, Univision, Voz de América and Boundless
  // were dropped here — the official .gov feeds 404 (RSS discontinued) and
  // the news outlets' feeds either malformed XML or blocked the bot UA.
  // Replaced with the two largest US immigration law firms' blogs, which
  // publish detailed E-2 / treaty-investor analyses regularly.
  {
    slug: "murthy-law",
    name: "Murthy Law Firm — Immigration",
    homepage: "https://www.murthy.com/",
    feedUrl: "https://www.murthy.com/feed/",
    category: "visas-migracion",
    language: "en",
    priority: 9,
  },
  {
    slug: "bal-immigration",
    name: "Berry Appleman & Leiden — Immigration",
    homepage: "https://www.bal.com/",
    feedUrl: "https://www.bal.com/feed/",
    category: "visas-migracion",
    language: "en",
    priority: 9,
  },

  // ─────────────── ECONOMÍA Y FINANZAS ───────────────
  {
    slug: "wsj-markets",
    name: "WSJ — Markets",
    homepage: "https://www.wsj.com/news/markets",
    feedUrl: "https://feeds.a.dj.com/rss/RSSMarketsMain.xml",
    category: "economia-finanzas",
    language: "en",
    priority: 9,
  },
  {
    slug: "cnbc-top",
    name: "CNBC — Top News",
    homepage: "https://www.cnbc.com",
    feedUrl: "https://www.cnbc.com/id/100003114/device/rss/rss.html",
    category: "economia-finanzas",
    language: "en",
    priority: 8,
  },
  {
    slug: "marketwatch-top",
    name: "MarketWatch — Top Stories",
    homepage: "https://www.marketwatch.com",
    feedUrl: "http://feeds.marketwatch.com/marketwatch/topstories/",
    category: "economia-finanzas",
    language: "en",
    priority: 7,
  },
  {
    slug: "el-financiero",
    name: "El Financiero (México)",
    homepage: "https://www.elfinanciero.com.mx",
    feedUrl: "https://www.elfinanciero.com.mx/rss/",
    category: "economia-finanzas",
    language: "es",
    priority: 8,
  },
  {
    slug: "expansion-economia",
    name: "Expansión — Economía",
    homepage: "https://expansion.mx/economia",
    feedUrl: "https://expansion.mx/rss/economia",
    category: "economia-finanzas",
    language: "es",
    priority: 7,
  },

  // ─────────────── BIENES RAÍCES (Texas-heavy + Florida) ───────────────
  {
    slug: "texas-realtors",
    name: "Texas REALTORS",
    homepage: "https://www.texasrealestate.com/about-us/news-and-events/",
    feedUrl: "https://www.texasrealestate.com/feed/",
    category: "bienes-raices",
    language: "en",
    priority: 10,
  },
  {
    slug: "florida-realtors",
    name: "Florida Realtors",
    homepage: "https://www.floridarealtors.org/news-media",
    feedUrl: "https://www.floridarealtors.org/news-media/rss.xml",
    category: "bienes-raices",
    language: "en",
    priority: 10,
  },
  {
    slug: "housingwire",
    name: "HousingWire",
    homepage: "https://www.housingwire.com",
    feedUrl: "https://www.housingwire.com/feed/",
    category: "bienes-raices",
    language: "en",
    priority: 8,
  },
  {
    slug: "realtor-com-news",
    name: "Realtor.com News",
    homepage: "https://www.realtor.com/news/",
    feedUrl: "https://www.realtor.com/news/feed/",
    category: "bienes-raices",
    language: "en",
    priority: 7,
  },
  // Bisnow Texas + South Florida dropped (404 on /feed). Replaced with Redfin
  // News (data-rich, market reports) and Real Estate News by Mike Sumsky.
  {
    slug: "redfin-news",
    name: "Redfin News",
    homepage: "https://www.redfin.com/news",
    feedUrl: "https://www.redfin.com/news/feed/",
    category: "bienes-raices",
    language: "en",
    priority: 8,
  },
  {
    slug: "real-estate-news-blog",
    name: "Real Estate News Blog",
    homepage: "https://realestatenewsblog.com/",
    feedUrl: "https://feeds.feedburner.com/RealEstateNewsBlog",
    category: "bienes-raices",
    language: "en",
    priority: 6,
  },

  // ─────────────── LLC Y NEGOCIOS (estructura + fiscal) ───────────────
  // IRS, Treasury and SBA RSS feeds were all 404 — those agencies stopped
  // publishing public RSS in favor of GovDelivery email. Tax Foundation,
  // Kiplinger Taxes plus the addition of CNBC Personal Finance carry the
  // category instead.
  {
    slug: "cnbc-personal-finance",
    name: "CNBC — Personal Finance",
    homepage: "https://www.cnbc.com/personal-finance/",
    feedUrl: "https://www.cnbc.com/id/10000115/device/rss/rss.html",
    category: "llc-negocios",
    language: "en",
    priority: 8,
  },
  {
    slug: "tax-foundation",
    name: "Tax Foundation",
    homepage: "https://taxfoundation.org",
    feedUrl: "https://taxfoundation.org/feed/",
    category: "llc-negocios",
    language: "en",
    priority: 8,
  },
  {
    slug: "kiplinger-tax",
    name: "Kiplinger — Taxes",
    homepage: "https://www.kiplinger.com/taxes",
    feedUrl: "https://www.kiplinger.com/feed/all",
    category: "llc-negocios",
    language: "en",
    priority: 7,
  },

  // ─────────────── INVERSIONES ───────────────
  {
    slug: "cnbc-investing",
    name: "CNBC — Investing",
    homepage: "https://www.cnbc.com/investing/",
    feedUrl: "https://www.cnbc.com/id/15839069/device/rss/rss.html",
    category: "inversiones",
    language: "en",
    priority: 9,
  },
  {
    slug: "yahoo-finance",
    name: "Yahoo Finance — News",
    homepage: "https://finance.yahoo.com/news/",
    feedUrl: "https://finance.yahoo.com/news/rssindex",
    category: "inversiones",
    language: "en",
    priority: 7,
  },
  {
    slug: "cnbc-markets",
    name: "CNBC — Markets",
    homepage: "https://www.cnbc.com/markets/",
    feedUrl: "https://www.cnbc.com/id/15839135/device/rss/rss.html",
    category: "inversiones",
    language: "en",
    priority: 8,
  },
  {
    slug: "motley-fool",
    name: "The Motley Fool",
    homepage: "https://www.fool.com/",
    feedUrl: "https://www.fool.com/feeds/index.aspx",
    category: "inversiones",
    language: "en",
    priority: 7,
  },
  {
    slug: "seeking-alpha",
    name: "Seeking Alpha — Latest Articles",
    homepage: "https://seekingalpha.com",
    feedUrl: "https://seekingalpha.com/feed.xml",
    category: "inversiones",
    language: "en",
    priority: 6,
  },
];
