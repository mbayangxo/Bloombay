// Weekly event digest — SMS removed per product decision.
// SMS is only permitted for waitlist acceptance and app-launch notifications.
// Crons must not send SMS; in-app notifications only.

import { NextRequest } from "next/server";
import { runCronJob } from "@/lib/cron-guard";

export async function POST(req: NextRequest) {
  return runCronJob(req, "weekly-events", async () => ({
    recordsProcessed: 0,
    sent: 0,
    message: "Weekly digest SMS disabled",
  }));
}
