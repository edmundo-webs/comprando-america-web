/**
 * Client-side helpers for internal analytics.
 *
 * `trackedRedirect(url, cta, location?)`
 *   Returns a URL you can drop in <a href=...>. When clicked, the request
 *   goes to /api/track/redirect which logs the click and 302s to `url`.
 *
 * `sendDiagnostic(payload)`
 *   Fire-and-forget beacon that persists a GPS-Estratégico completion.
 *   Uses navigator.sendBeacon when available so it survives page unload.
 *
 * `sendCtaClick({cta, location, destination})`
 *   Fire-and-forget POST for cases where you can't intercept the click
 *   with a redirect (e.g., internal navigation, modal-open buttons).
 *
 * `getOrCreateSessionId()`
 *   Persists a random 16-byte hex session id in localStorage so we can
 *   correlate events from the same visitor across pages.
 *
 * `readUtmParams()`
 *   Reads UTM query params from the current URL. Cached in sessionStorage
 *   so we still have them after client-side navigation.
 */

const SESSION_KEY = "ca_sid";
const UTM_KEY = "ca_utm";

/** 16-byte hex session id, generated on first call and cached in localStorage. */
export function getOrCreateSessionId(): string {
  if (typeof window === "undefined") return "";
  try {
    let sid = window.localStorage.getItem(SESSION_KEY);
    if (!sid) {
      const bytes = new Uint8Array(16);
      (window.crypto || (window as any).msCrypto).getRandomValues(bytes);
      sid = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
      window.localStorage.setItem(SESSION_KEY, sid);
    }
    return sid;
  } catch {
    return "";
  }
}

export interface UtmParams {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
}

export function readUtmParams(): UtmParams {
  if (typeof window === "undefined") return {};
  try {
    // Cached copy from any earlier hit (survives client-side nav)
    const cached = window.sessionStorage.getItem(UTM_KEY);
    if (cached) return JSON.parse(cached) as UtmParams;

    const q = new URLSearchParams(window.location.search);
    const out: UtmParams = {
      utmSource: q.get("utm_source") ?? undefined,
      utmMedium: q.get("utm_medium") ?? undefined,
      utmCampaign: q.get("utm_campaign") ?? undefined,
    };
    if (out.utmSource || out.utmMedium || out.utmCampaign) {
      window.sessionStorage.setItem(UTM_KEY, JSON.stringify(out));
    }
    return out;
  } catch {
    return {};
  }
}

/**
 * Wrap a URL so the click goes through /api/track/redirect. Non-http/https
 * URLs pass through unchanged (e.g., mailto: links go direct).
 */
export function trackedRedirect(url: string, cta: string, location?: string): string {
  if (typeof window === "undefined") return url;
  if (!url || !/^https?:/i.test(url)) return url;
  try {
    const q = new URLSearchParams();
    q.set("cta", cta);
    q.set("url", url);
    if (location) q.set("location", location);
    const sid = getOrCreateSessionId();
    if (sid) q.set("sid", sid);
    const utm = readUtmParams();
    if (utm.utmSource) q.set("utmSource", utm.utmSource);
    if (utm.utmCampaign) q.set("utmCampaign", utm.utmCampaign);
    return `/api/track/redirect?${q.toString()}`;
  } catch {
    return url;
  }
}

/** Fire-and-forget POST — never throws, never blocks the UI. */
export function sendCtaClick(payload: {
  cta: string;
  location?: string;
  destination?: string;
}): void {
  if (typeof window === "undefined") return;
  try {
    const body = JSON.stringify({
      ...payload,
      sessionId: getOrCreateSessionId(),
      ...readUtmParams(),
    });
    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: "application/json" });
      navigator.sendBeacon("/api/track/cta", blob);
    } else {
      fetch("/api/track/cta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        keepalive: true,
      }).catch(() => {});
    }
  } catch {
    /* swallow */
  }
}

/** Persist a diagnostic completion. Never blocks the UI. */
export function sendDiagnostic(payload: {
  profile?: string;
  responses?: Record<string, unknown>;
  nombre?: string;
  whatsapp?: string;
  email?: string;
  completed?: boolean;
}): void {
  if (typeof window === "undefined") return;
  try {
    const body = JSON.stringify({
      ...payload,
      sessionId: getOrCreateSessionId(),
      ...readUtmParams(),
    });
    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: "application/json" });
      navigator.sendBeacon("/api/track/diagnostic", blob);
    } else {
      fetch("/api/track/diagnostic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        keepalive: true,
      }).catch(() => {});
    }
  } catch {
    /* swallow */
  }
}
