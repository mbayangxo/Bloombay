import { NextRequest } from "next/server";
import { reviewPendingReports } from "@/lib/yande/safety";
import { runCronJob } from "@/lib/cron-guard";

export async function POST(req: NextRequest) {
  return runCronJob(req, "safety-monitor", async (ctx) => {
    if (ctx.dryRun) {
      return { recordsProcessed: 0, dry_run: true, message: "Dry run — no data written" };
    }

    const result = await reviewPendingReports(ctx.maxRecords);
    return {
      recordsProcessed: result.reviewed + result.escalated,
      ...result,
    };
  });
}
