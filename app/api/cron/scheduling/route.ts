import { NextRequest } from "next/server";
import { nudgeClubsWithNoUpcomingEvents, suggestRecurringEvents } from "@/lib/yande/scheduling";
import { runCronJob } from "@/lib/cron-guard";

export async function POST(req: NextRequest) {
  return runCronJob(req, "scheduling", async (ctx) => {
    if (ctx.dryRun) {
      return { recordsProcessed: 0, dry_run: true, message: "Dry run — no data written" };
    }

    const [clubs, recurring] = await Promise.all([
      nudgeClubsWithNoUpcomingEvents(),
      suggestRecurringEvents(),
    ]);

    const processed = clubs.nudged + recurring.suggested;

    return { recordsProcessed: processed, clubs, recurring };
  });
}
