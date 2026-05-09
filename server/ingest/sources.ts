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
  {
    slug: "uscis-newsroom",
    name: "USCIS Newsroom",
    homepage: "https://www.uscis.gov/newsroom",
    feedUrl: "https://www.uscis.gov/news/rss-feeds/uscis-rss-feed",
    category: "visas-migracion",
    language: "en",
    priority: 10,
  },
  {
    slug: "state-dept-press",
    name: "U.S. Department of State Press Releases",
    homepage: "https://www.state.gov/press-releases/",
    feedUrl: "https://www.state.gov/rss-feed/press-releases/feed/",
    category: "visas-migracion",
    language: "en",
    priority: 9,
  },
  {
    slug: "univision-inmigracion",
    name: "Univision Noticias — Inmigración",
    homepage: "https://www.univision.com/noticias/inmigracion",
    feedUrl: "https://feeds.univision.com/feeds/rss/news/inmigracion",
    category: "visas-migracion",
    language: "es",
    priority: 8,
  },
  {
    slug: "voa-inmigracion",
    name: "Voz de América — Inmigración",
    homepage: "https://www.vozdeamerica.com/z/3470",
    feedUrl: "https://www.vozdeamerica.com/api/zybmoer",
    category: "visas-migracion",
    language: "es",
    priority: 7,
  },
  {
    slug: "boundless-blog",
    name: "Boundless — Immigration News",
    homepage: "https://www.boundless.com/blog/",
    feedUrl: "https://www.boundless.com/blog/feed/",
    category: "visas-migracion",
    language: "en",
    priority: 6,
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
  {
    slug: "bisnow-texas",
    name: "Bisnow — Texas",
    homepage: "https://www.bisnow.com/texas",
    feedUrl: "https://www.bisnow.com/texas/feed",
    category: "bienes-raices",
    language: "en",
    priority: 7,
  },
  {
    slug: "bisnow-south-florida",
    name: "Bisnow — South Florida",
    homepage: "https://www.bisnow.com/south-florida",
    feedUrl: "https://www.bisnow.com/south-florida/feed",
    category: "bienes-raices",
    language: "en",
    priority: 7,
  },

  // ─────────────── LLC Y NEGOCIOS (estructura + fiscal) ───────────────
  {
    slug: "irs-newsroom",
    name: "IRS Newsroom",
    homepage: "https://www.irs.gov/newsroom",
    feedUrl: "https://www.irs.gov/pub/irs-utl/rss/news-releases.xml",
    category: "llc-negocios",
    language: "en",
    priority: 10,
  },
  {
    slug: "treasury-press",
    name: "U.S. Treasury — Press Releases",
    homepage: "https://home.treasury.gov/news/press-releases",
    feedUrl: "https://home.treasury.gov/system/files/126/press-releases.rss",
    category: "llc-negocios",
    language: "en",
    priority: 9,
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
  {
    slug: "sba-press",
    name: "SBA — Press Releases",
    homepage: "https://www.sba.gov/about-sba/sba-newsroom",
    feedUrl: "https://www.sba.gov/feeds/press-releases",
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
    slug: "investopedia-markets",
    name: "Investopedia — Markets",
    homepage: "https://www.investopedia.com/markets-news-4427704",
    feedUrl: "https://www.investopedia.com/feedbuilder/feed/getfeed/?feedName=rss_articles",
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
