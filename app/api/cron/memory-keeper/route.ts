// Memory Keeper Cron — runs daily at 3am EST
// Processes unprocessed memory_events and updates member_memory_graph.
// This is the heartbeat of Yande's understanding of each member.

import { NextRequest, NextResponse } from "next/server";
import { runMemoryKeeper } from "@/lib/yande/memory-keeper";
import { createClient } from "@supabase/supabase-js";
import { cronGuard, isDryRun, logCronRun } from "@/lib/cron-guard";

function admin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

export async function POST(req: NextRequest) {
  const guard = cronGuard(req, "memory-keeper");
  if (guard) return guard;

  if (isDryRun()) {
    return NextResponse.json({ ok: true, dry_run: true, message: "Dry run — no data written" });
  }

  try {
    const result = await runMemoryKeeper();

    await admin().from("yande_actions").insert({
      agent: "memory_keeper",
      action_type: "daily_memory_sweep",
      risk_level: "low",
      status: "completed",
      triggered_by: "scheduled",
      metadata: result,
    });

    await logCronRun("memory-keeper", "ok", result as Record<string, unknown>);
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    await logCronRun("memory-keeper", "error", { error: String(err) });
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
