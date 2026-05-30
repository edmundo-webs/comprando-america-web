/**
 * Metricool API client — multi-brand.
 *
 * Used by the admin POST /api/admin/social/publish endpoint so the external
 * agent (Nikki on OpenClaw/Telegram) can post or schedule across both
 * Comprando América and Edmundo Treviño accounts from a single API.
 *
 * Required env vars:
 *   METRICOOL_API_KEY     X-Mc-Auth token from Metricool > Account > API
 *   METRICOOL_USER_ID     numeric user id (from Metricool dashboard URL)
 *   METRICOOL_BLOG_CA     blogId for the Comprando América brand (4294668)
 *                         (or legacy METRICOOL_BLOG_ID fallback)
 *   METRICOOL_BLOG_ET     blogId for the Edmundo Treviño brand (2116706)
 *   METRICOOL_BLOG_TUM    blogId for the TheUsMarketer brand (2116739)
 *
 * Docs: https://static.metricool.com/API+DOC/API+English.pdf (lightly outdated;
 * payload below was reverse-engineered from the Metricool web UI calls).
 */

const BASE = "https://app.metricool.com/api";

export type Brand = "comprando-america" | "edmundo-trevino" | "theusmarketer";

export type Network =
  | "facebook"
  | "instagram"
  | "tiktok"
  | "linkedin"
  | "threads"
  | "twitter"
  | "youtube";

interface MetricoolAuth {
  apiKey: string;
  userId: string;
  blogId: string;
}

function getAuth(brand: Brand): MetricoolAuth {
  const apiKey = process.env.METRICOOL_API_KEY;
  const userId = process.env.METRICOOL_USER_ID;
  if (!apiKey || !userId) {
    throw new Error("METRICOOL_API_KEY and METRICOOL_USER_ID must be set");
  }
  // Brand → env-var name. CA also accepts the legacy METRICOOL_BLOG_ID as
  // a fallback so the user doesn't have to rename anything for that account.
  const envNames: Record<Brand, string[]> = {
    "comprando-america": ["METRICOOL_BLOG_CA", "METRICOOL_BLOG_ID"],
    "edmundo-trevino": ["METRICOOL_BLOG_ET"],
    theusmarketer: ["METRICOOL_BLOG_TUM"],
  };
  const tries = envNames[brand];
  let blogId: string | undefined;
  for (const name of tries) {
    const v = process.env[name];
    if (v) {
      blogId = v;
      break;
    }
  }
  if (!blogId) {
    throw new Error(`${tries[0]} not set (required to post as ${brand})`);
  }
  return { apiKey, userId, blogId };
}

function headers(auth: MetricoolAuth): Record<string, string> {
  return {
    "X-Mc-Auth": auth.apiKey,
    "Content-Type": "application/json",
  };
}

/**
 * Normalize a public image URL through Metricool so they accept it as media.
 * Returns the normalized URL/id that should go in the post body.
 */
export async function normalizeImage(imageUrl: string, brand: Brand): Promise<string> {
  const auth = getAuth(brand);
  const url =
    `${BASE}/actions/normalize/image/url` +
    `?url=${encodeURIComponent(imageUrl)}` +
    `&blogId=${auth.blogId}&userId=${auth.userId}`;

  const res = await fetch(url, { method: "GET", headers: headers(auth) });
  const rawBody = await res.text();

  if (!res.ok) {
    throw new Error(`Metricool normalize failed ${res.status}: ${rawBody.slice(0, 300)}`);
  }

  try {
    const data = JSON.parse(rawBody);
    const mediaId = data.mediaId || data.id || data.media?.mediaId || data.url;
    if (mediaId) return String(mediaId);
  } catch {
    // not JSON — fall through to plain text
  }

  const trimmed = rawBody.trim().replace(/^"|"$/g, "");
  if (trimmed) return trimmed;

  throw new Error("Metricool normalize returned empty response");
}

export async function normalizeImages(imageUrls: string[], brand: Brand): Promise<string[]> {
  const ids: string[] = [];
  for (const url of imageUrls) {
    const id = await normalizeImage(url, brand);
    ids.push(id);
  }
  return ids;
}

export interface SchedulePostOpts {
  brand: Brand;
  /** Social networks to post to */
  networks: Network[];
  /** Caption / description */
  text: string;
  /** ISO 8601 datetime. If omitted, defaults to now + 2 minutes. */
  dateTime?: string;
  /** IANA timezone (default America/Mexico_City) */
  timezone?: string;
  /** Already-normalized media URLs/IDs */
  mediaIds?: string[];
  /** Or raw public URLs — will be normalized for you. Either field works. */
  mediaUrls?: string[];
  /** Post type hint */
  postType?: "post" | "reel" | "story" | "carousel" | "short";
  /** YouTube Shorts title (max 100 chars, falls back to caption) */
  youtubeTitle?: string;
  /** When the uploaded video already carries its own audio track */
  hasOwnAudio?: boolean;
}

/**
 * Schedule (or publish) a post via Metricool. Returns the Metricool post id.
 */
export async function schedulePost(opts: SchedulePostOpts): Promise<string> {
  const auth = getAuth(opts.brand);

  // Normalize raw URLs if the caller didn't pre-normalize.
  let mediaList: string[] = opts.mediaIds ?? [];
  if (mediaList.length === 0 && opts.mediaUrls && opts.mediaUrls.length > 0) {
    mediaList = await normalizeImages(opts.mediaUrls, opts.brand);
  }

  // Default schedule: 2 minutes from now (gives Metricool a moment to ingest).
  // Metricool insists on `yyyy-MM-ddTHH:mm:ss` (NO milliseconds, NO trailing Z).
  // toISOString() returns "2026-05-30T06:23:45.123Z" — strip the .NNNZ.
  const toMetricoolDate = (iso: string) => iso.replace(/\.\d{3}Z?$/, "").replace(/Z$/, "");
  const dt = toMetricoolDate(
    opts.dateTime || new Date(Date.now() + 2 * 60 * 1000).toISOString()
  );
  const tz = opts.timezone || "America/Mexico_City";

  const body: Record<string, any> = {
    text: opts.text,
    firstCommentText: "",
    publicationDate: { dateTime: dt, timezone: tz },
    providers: opts.networks.map((n) => ({ network: n })),
    media: mediaList,
    mediaAltText: mediaList.map(() => null),
    autoPublish: true,
    shortener: false,
    draft: false,
    hasNotReadNotes: false,
    descendants: [],
    performanceDashboardIds: [],
    smartLinkData: { ids: [] },
  };

  const isReel = opts.postType === "reel";
  const isShort = opts.postType === "short";
  if (opts.networks.includes("facebook")) {
    body.facebookData = { type: isReel ? "REEL" : "POST" };
  }
  if (opts.networks.includes("instagram")) {
    body.instagramData = {
      type: isReel ? "REEL" : "POST",
      showReelOnFeed: true,
      collaborators: [],
      shareTrialAutomatically: false,
    };
  }
  if (opts.networks.includes("tiktok")) {
    body.tiktokData = {
      disableComment: false,
      disableDuet: false,
      disableStitch: false,
      autoAddMusic: !opts.hasOwnAudio,
    };
  }
  if (opts.networks.includes("youtube")) {
    body.youtubeData = {
      type: isShort ? "SHORT" : "VIDEO",
      title: (opts.youtubeTitle || opts.text).slice(0, 100),
      madeForKids: false,
    };
  }

  const url = `${BASE}/v2/scheduler/posts?blogId=${auth.blogId}&userId=${auth.userId}`;
  const res = await fetch(url, {
    method: "POST",
    headers: headers(auth),
    body: JSON.stringify(body),
  });

  const resBody = await res.text();
  if (!res.ok) {
    throw new Error(`Metricool schedule failed ${res.status}: ${resBody.slice(0, 400)}`);
  }

  try {
    const data = JSON.parse(resBody);
    return String(data.id || data.postId || "scheduled");
  } catch {
    return resBody.trim() || "scheduled";
  }
}
