/**
 * Deprecated: the in-process RSS scheduler has been replaced by the
 * GitHub-Actions-driven pipeline:
 *
 *   ingest → rewrite → images → auto-publish
 *
 * Triggered 4×/day from .github/workflows/news-pipeline.yml.
 * See server/ingest/fetch.ts and server/ai/*.ts.
 *
 * The functions below are kept as a no-op so that any code still calling
 * `initializeRssScheduler()` (e.g. older deploys that haven't picked up
 * the index.ts edit yet) doesn't crash. They will be removed once we
 * confirm no caller remains.
 */

export async function syncAllFeeds(): Promise<void> {
  console.log(
    "[rss-sync] DEPRECATED. The RSS pipeline now runs from GitHub Actions (see .github/workflows/news-pipeline.yml). This in-process call is a no-op."
  );
}

export function initializeRssScheduler(): void {
  console.log(
    "[rss-sync] DEPRECATED initializer. The scheduler has moved to GitHub Actions; this is a no-op."
  );
}
