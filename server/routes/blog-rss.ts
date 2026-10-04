/** RSS 2.0 for public Spanish blog articles. No news or podcast entries. */
export interface BlogFeedPost {
  slug: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  category: string | null;
  publishedAt: Date | null;
}
const BASE = 'https://comprandoamerica.com';
const escapeXml = (value: string) => value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
export function buildBlogRss(posts: BlogFeedPost[], now = new Date()): string {
  const seen = new Set<string>();
  const eligible = posts.filter(p => {
    if (!p.slug || !p.title || !p.publishedAt || !Number.isFinite(p.publishedAt.getTime()) || p.publishedAt > now || seen.has(p.slug)) return false;
    seen.add(p.slug); return true;
  }).sort((a, b) => b.publishedAt!.getTime() - a.publishedAt!.getTime()).slice(0, 50);
  const items = eligible.map(p => {
    const link = escapeXml(`${BASE}/blog/${encodeURIComponent(p.slug)}`);
    const image = p.imageUrl && /^https?:\/\//i.test(p.imageUrl) ? `<media:content url="${escapeXml(p.imageUrl)}" medium="image" />` : '';
    return `<item><title>${escapeXml(p.title)}</title><link>${link}</link><guid isPermaLink="true">${link}</guid><pubDate>${p.publishedAt!.toUTCString()}</pubDate><description>${escapeXml(p.description ?? '')}</description>${p.category ? `<category>${escapeXml(p.category)}</category>` : ''}${image}</item>`;
  });
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:media="http://search.yahoo.com/mrss/">
<channel><title>Comprando América — Blog</title><link>${BASE}/blog</link><description>Artículos de Comprando América sobre negocios, inversión y patrimonio en Estados Unidos.</description><language>es-MX</language><atom:link href="${BASE}/blog/rss.xml" rel="self" type="application/rss+xml"/><lastBuildDate>${now.toUTCString()}</lastBuildDate><ttl>10</ttl>${items.join('\n')}</channel></rss>`;
}
