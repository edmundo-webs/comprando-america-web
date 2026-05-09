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
import path from "node:path";
import { fileURLToPath } from "node:url";
import cron from "node-cron";

const TZ = "America/Chicago";
const TASK_TIMEOUT_MS = 20 * 60 * 1000; // 20 minutes per stage

let activeTasks = 0;

function runStage(name: string, scriptRelativeToRoot: string): Promise<void> {
  return new Promise((resolve) => {
    activeTasks++;
    console.log(`[cron] ▶ ${name}`);
    const start = Date.now();

    // Project root: cron/scheduler.ts → server/cron/ → server/ → project root
    const here = path.dirname(fileURLToPath(import.meta.url));
    const projectRoot = path.resolve(here, "..", "..");
    const scriptPath = path.resolve(projectRoot, scriptRelativeToRoot);
    // Use the local tsx binstub so we don't depend on pnpm being in PATH
    // at runtime (Render's prod image may not include it).
    const tsxBin = path.resolve(projectRoot, "node_modules", ".bin", "tsx");

    const child = spawn(tsxBin, [scriptPath], {
      cwd: projectRoot,
      env: process.env,
      stdio: "pipe",
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
