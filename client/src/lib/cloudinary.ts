/**
 * Cloudinary URL helpers.
 *
 * Rewrites a Cloudinary URL to insert optimization transformations
 * (auto format, auto quality, target width, scale-down). Reduces image
 * bytes by 50-80% with no visual change for the user.
 *
 * Cloudinary URL shape:
 *   https://res.cloudinary.com/<cloud>/image/upload/v123/path/file.jpg
 *
 * We inject transforms BEFORE the `/v123/` version segment:
 *   https://res.cloudinary.com/<cloud>/image/upload/f_auto,q_auto,w_1600,c_limit/v123/path/file.jpg
 *
 * If the URL already has transforms (other params between `/upload/` and
 * `/v...`), we leave it alone — caller already opted in to specific
 * transforms.
 */

const CLOUDINARY_HOSTS = /^https?:\/\/res\.cloudinary\.com\//;

export interface CldOpts {
  /** Target rendered width in CSS px. The browser will scale down/up as needed. */
  width?: number;
  /** Crop / scaling strategy. Default `limit` (don't upscale, preserve aspect). */
  crop?: "limit" | "fill" | "fit" | "thumb" | "scale";
  /** Override automatic format. */
  format?: "auto" | "webp" | "avif" | "jpg" | "png";
  /** Quality (default `auto`). */
  quality?: "auto" | "auto:eco" | "auto:good" | "auto:best" | number;
}

/**
 * Rewrite a Cloudinary URL with optimization transforms.
 * Non-Cloudinary URLs pass through unchanged.
 */
export function cldUrl(url: string | null | undefined, opts: CldOpts = {}): string {
  if (!url || !CLOUDINARY_HOSTS.test(url)) return url || "";

  const marker = "/image/upload/";
  const idx = url.indexOf(marker);
  if (idx < 0) return url;

  const head = url.slice(0, idx + marker.length);
  const tail = url.slice(idx + marker.length);

  // If the next segment already has transforms (matches f_, q_, w_, c_,
  // h_, ar_, dpr_, e_, l_, etc.), assume caller wants those — leave it.
  const firstSeg = tail.split("/")[0] ?? "";
  if (/^(f_|q_|w_|h_|c_|ar_|dpr_|e_|l_|g_|x_|y_)/.test(firstSeg)) {
    return url;
  }

  const parts: string[] = [];
  parts.push(`f_${opts.format ?? "auto"}`);
  parts.push(`q_${opts.quality ?? "auto"}`);
  if (opts.width) parts.push(`w_${Math.round(opts.width)}`);
  parts.push(`c_${opts.crop ?? "limit"}`);
  const transform = parts.join(",");

  return `${head}${transform}/${tail}`;
}

/**
 * Build a srcset string for responsive images. Returns "" for non-Cloudinary
 * URLs (the caller can omit the srcset attribute entirely).
 *
 * Example:
 *   srcset = cldSrcSet(url, [640, 1024, 1600])
 *   → "https://.../w_640,.../file.jpg 640w, .../w_1024,.../file.jpg 1024w, ..."
 */
export function cldSrcSet(
  url: string | null | undefined,
  widths: number[] = [640, 1024, 1600, 2400],
  opts: Omit<CldOpts, "width"> = {}
): string {
  if (!url || !CLOUDINARY_HOSTS.test(url)) return "";
  return widths.map((w) => `${cldUrl(url, { ...opts, width: w })} ${w}w`).join(", ");
}
