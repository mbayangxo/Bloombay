import { NextRequest } from "next/server";
import { processEventWaitlists, checkCapacityAlerts } from "@/lib/yande/operations";
import { runCronJob } from "@/lib/cron-guard";

export async function POST(req: NextRequest) {
  return runCronJob(req, "operations", async (ctx) => {
    if (ctx.dryRun) {
      return { recordsProcessed: 0, dry_run: true, message: "Dry run — no data written" };
    }

    const [waitlists, capacity] = await Promise.all([
      processEventWaitlists(),
      checkCapacityAlerts(),
    ]);

    const processed = waitlists.processed + capacity.alerted;

    return { recordsProcessed: processed, waitlists, capacity };
  });
}
