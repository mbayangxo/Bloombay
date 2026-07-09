// Memory Keeper Cron — runs daily at 3am EST
// Processes unprocessed memory_events and updates member_memory_graph.
// This is the heartbeat of Yande's understanding of each member.

import { NextRequest, NextResponse } from "next/server";
import { runMemoryKeeper } from "@/lib/yande/memory-keeper";
import { createClient } from "@supabase/supabase-js";

function admin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

export async function GET(req: NextRequest) {
  // Vercel Cron sends GET with `Authorization: Bearer <CRON_SECRET>`.
  // Also accept the legacy x-cron-secret header for manual triggers.
  const auth = req.headers.get("authorization");
  const secret = req.headers.get("x-cron-secret");
  if (!process.env.CRON_SECRET || (auth !== `Bearer ${process.env.CRON_SECRET}` && secret !== process.env.CRON_SECRET)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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

  return NextResponse.json({ ok: true, ...result });
}
