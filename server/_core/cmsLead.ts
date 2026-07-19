import { ENV } from "./env";

export interface CmsLeadPayload {
  email: string;
  name?: string;
  interests?: string[];
  formSlug?: string;
  consent?: boolean;
}

/**
 * Best-effort forward of a captured lead to the central CMS
 * (Community Management Services) public API. The local subscriber
 * record is the source of truth for this site; the CMS copy feeds
 * the CRM pipeline. Failures are logged, never surfaced to the user.
 */
export function forwardLeadToCms(payload: CmsLeadPayload): void {
  if (!ENV.cmsApiUrl || !ENV.cmsApiKey) {
    console.warn("[cms-lead] CMS_API_URL / CMS_API_KEY not configured, skipping forward");
    return;
  }

  fetch(`${ENV.cmsApiUrl}/api/public/v1/leads`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": ENV.cmsApiKey,
    },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(8000),
  })
    .then(async (response) => {
      if (!response.ok) {
        const body = await response.text().catch(() => "");
        console.error(`[cms-lead] CMS responded ${response.status}: ${body}`);
      }
    })
    .catch((err) => {
      console.error("[cms-lead] failed to forward lead to CMS:", err);
    });
}
