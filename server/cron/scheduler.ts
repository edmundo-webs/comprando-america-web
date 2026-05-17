/**
 * In-process cron scheduler for the news pipeline.
 *
 * This runs inside the long-lived Render web service. It replaces the
 * GitHub Actions schedule we used in Fase 1 — Render is now the single
 * source of truth so we don't pay GH Actions minutes for cron, and the
 * pipeline's logs land in Render's tail UI alongside the rest of the app.
 *
 * Each cron tick spawns a child process via tsx so a crash in any one
 * stage can't take the web server down. (We deliberately do NOT import
 * the stage modules — they call process.exit on completion.)
 *
 * Schedule (America/Chicago):
 *   - Pipeline tick: every 6 hours at 06:00, 12:00, 18:00, 00:00 CT.
 *     Runs ingest → rewrite → images → auto-publish (1 article max).
 *
 * Disable the scheduler by setting DISABLE_NEWS_CRON=true.
 */
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import cron from "node-cron";

const TZ = "America/Chicago";
const TASK_TIMEOUT_MS = 20 * 60 * 1000; // 20 minutes per stage

let activeTasks = 0;

/**
 * Resolve project root reliably. We can't trust import.meta.url because
 * esbuild bundles this module into dist/index.js — the path of the bundle
 * is two levels off from where the source file lives. process.cwd() is
 * what `pnpm start` uses, which IS the project root on Render.
 */
function findProjectRoot(): string {
  return process.cwd();
}

/**
 * Find the tsx binary. Prefer the local pnpm-style location, fall back to
 * letting the OS resolve "tsx" from PATH (the env shell pnpm sets up).
 */
function findTsx(projectRoot: string): string {
  const candidates = [
    path.join(projectRoot, "node_modules", ".bin", "tsx"),
    path.join(projectRoot, "node_modules", ".pnpm", "node_modules", ".bin", "tsx"),
  ];
  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }
  // Last resort: rely on PATH. pnpm exposes binstubs for installed deps so
  // when this process was started via `pnpm start`, "tsx" should resolve.
  return "tsx";
}

function runStage(name: string, scriptRelativeToRoot: string, extraArgs: string[] = []): Promise<void> {
  return new Promise((resolve) => {
    activeTasks++;
    console.log(`[cron] ▶ ${name}${extraArgs.length ? " " + extraArgs.join(" ") : ""}`);
    const start = Date.now();

    const projectRoot = findProjectRoot();
    const scriptPath = path.resolve(projectRoot, scriptRelativeToRoot);
    const tsxBin = findTsx(projectRoot);

    const child = spawn(tsxBin, [scriptPath, ...extraArgs], {
      cwd: projectRoot,
      env: process.env,
      stdio: "pipe",
      shell: tsxBin === "tsx", // need a shell only if we're falling back to PATH lookup
    });

    const killer = setTimeout(() => {
      console.warn(`[cron] ⏰ ${name} timed out after ${TASK_TIMEOUT_MS / 1000}s — killing`);
      child.kill("SIGKILL");
    }, TASK_TIMEOUT_MS);

    child.stdout?.on("data", (d) => process.stdout.write(`[${name}] ${d}`));
    child.stderr?.on("data", (d) => process.stderr.write(`[${name}] ${d}`));

    child.on("exit", (code, signal) => {
      clearTimeout(killer);
      activeTasks--;
      const elapsed = ((Date.now() - start) / 1000).toFixed(1);
      console.log(
        `[cron] ${code === 0 ? "✔" : "✘"} ${name} exited code=${code}${signal ? ` signal=${signal}` : ""} in ${elapsed}s`
      );
      resolve();
    });

    child.on("error", (err) => {
      clearTimeout(killer);
      activeTasks--;
      console.error(`[cron] ✘ ${name} failed to spawn: ${err.message}`);
      resolve();
    });
  });
}

async function runPipeline() {
  if (activeTasks > 0) {
    console.log(`[cron] ⏭ pipeline tick skipped — ${activeTasks} task(s) still running`);
    return;
  }
  await runStage("ingest", "server/ingest/fetch.ts");
  await runStage("rewrite", "server/ai/rewrite.ts");
  await runStage("images", "server/ai/generate-images.ts");
  await runStage("auto-publish", "server/ai/auto-publish.ts");
  console.log("[cron] ✔ pipeline tick complete");
}

/**
 * Trigger the rewrite stage for a single article id. Used by the admin
 * endpoint POST /api/admin/articles/:id/rewrite so the editor (or Nikki)
 * can force a re-evaluation without queueing behind the normal batch.
 *
 * Spawns `tsx server/ai/rewrite.ts --id N` and returns immediately
 * (fire-and-forget — caller can tail logs).
 */
export async function rewriteArticleNow(id: number): Promise<{ started: boolean; reason?: string }> {
  if (activeTasks >= 3) {
    return { started: false, reason: `too many concurrent tasks (${activeTasks})` };
  }
  void runStage(`rewrite[id=${id}]`, "server/ai/rewrite.ts", ["--id", String(id)]);
  return { started: true };
}

/**
 * Trigger the hero-image resolver for a single article id. Lets the editor
 * unstick a draft whose imageUrl ended up null (rawImageUrl missing,
 * og:image failed, Pexels found no title match — common for niche legal
 * notes like USCIS form changes). The image stage will now also fall back
 * to category-based Pexels queries.
 */
export async function regenerateImageNow(id: number): Promise<{ started: boolean; reason?: string }> {
  if (activeTasks >= 3) {
    return { started: false, reason: `too many concurrent tasks (${activeTasks})` };
  }
  void runStage(`images[id=${id}]`, "server/ai/generate-images.ts", ["--id", String(id)]);
  return { started: true };
}

/**
 * Manual trigger used by POST /api/admin/run-pipeline. Exposed here so the
 * route handler doesn't have to know about the spawning mechanics.
 */
export async function triggerPipelineNow(): Promise<{ started: boolean; reason?: string }> {
  if (activeTasks > 0) {
    return { started: false, reason: `pipeline busy (${activeTasks} task(s) running)` };
  }
  // Fire-and-forget; the response returns immediately so the agent isn't
  // blocked for 5+ minutes waiting for the full chain to finish.
  void runPipeline();
  return { started: true };
}

export function startScheduler(): void {
  if (process.env.DISABLE_NEWS_CRON === "true") {
    console.log("[cron] DISABLE_NEWS_CRON=true — scheduler not started");
    return;
  }

  // Skip in dev so `pnpm dev` doesn't kick off ingest runs while you code.
  if (process.env.NODE_ENV !== "production" && process.env.ENABLE_NEWS_CRON !== "true") {
    console.log("[cron] dev environment — scheduler not started (set ENABLE_NEWS_CRON=true to override)");
    return;
  }

  // Pipeline tick: 4×/day at 06,12,18,00 CT.
  cron.schedule(
    "0 0,6,12,18 * * *",
    () => {
      runPipeline().catch((err) => console.error("[cron] pipeline crashed:", err));
    },
    { timezone: TZ }
  );

  console.log(`[cron] Scheduler started — jobs registered (TZ=${TZ})`);
  console.log("[cron]   • pipeline tick: 00:00, 06:00, 12:00, 18:00 CT");
}
