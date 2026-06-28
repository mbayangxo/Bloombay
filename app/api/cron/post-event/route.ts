import { processPostEventFollowups } from "@/lib/yande/post-event";
import { runCronJob } from "@/lib/cron-guard";

export const runtime = "nodejs";

// Uses GET + Bearer auth to match original Vercel cron config — do not change to POST
// without updating vercel.json.
export async function GET(req: Request) {
  return runCronJob(req, "post-event", async (ctx) => {
    if (ctx.dryRun) {
      return { recordsProcessed: 0, dry_run: true, message: "Dry run — no data written" };
    }

    const result = await processPostEventFollowups();
    const r = result as Record<string, unknown>;
    const processed =
      typeof r.records_processed === "number"
        ? r.records_processed
        : typeof r.processed === "number"
          ? r.processed
          : 0;

    return { recordsProcessed: processed, ...result };
  });
}
