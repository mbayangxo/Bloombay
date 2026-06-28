// Memory Keeper Cron — runs daily at 3am EST
// Processes unprocessed memory_events and updates member_memory_graph.
// This is the heartbeat of Yande's understanding of each member.

import { NextRequest } from "next/server";
import { runMemoryKeeper } from "@/lib/yande/memory-keeper";
import { createClient } from "@supabase/supabase-js";
import { runCronJob } from "@/lib/cron-guard";

function admin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

export async function POST(req: NextRequest) {
  return runCronJob(req, "memory-keeper", async (ctx) => {
    if (ctx.dryRun) {
      return { recordsProcessed: 0, dry_run: true, message: "Dry run — no data written" };
    }

    const result = await runMemoryKeeper();

    await admin().from("yande_actions").insert({
      agent: "memory_keeper",
      action_type: "daily_memory_sweep",
      risk_level: "low",
      status: "completed",
      triggered_by: "scheduled",
      metadata: result,
    });

    const r = result as Record<string, unknown>;
    const processed =
      typeof r.processed === "number"
        ? r.processed
        : typeof r.records_processed === "number"
          ? r.records_processed
          : 0;

    return { recordsProcessed: processed, ...result };
  });
}
