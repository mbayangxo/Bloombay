// Yande Messages Cron — runs daily at 11am EST
// Sends re-engagement messages to members going quiet,
// and celebration messages for recent milestones.

import { NextRequest } from "next/server";
import { runReEngagementBatch, sendYandeMessage } from "@/lib/yande/messages";
import { createClient } from "@supabase/supabase-js";
import { runCronJob } from "@/lib/cron-guard";

function admin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

export async function POST(req: NextRequest) {
  return runCronJob(req, "yande-messages", async (ctx) => {
    if (ctx.dryRun) {
      return { recordsProcessed: 0, dry_run: true, message: "Dry run — no data written" };
    }

    const supabase = admin();
    const batchLimit = Math.min(ctx.maxRecords, 20);
    // ── 1. Re-engagement batch ─────────────────────────────────────────────────
    const reEngagement = await runReEngagementBatch();

    // ── 2. Celebrate first-event milestones ───────────────────────────────────
    const yesterday = new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString();

    const { data: firstTimers } = await supabase
      .from("member_memory_graph")
      .select("user_id, milestones")
      .gte("first_event_at", yesterday)
      .limit(batchLimit);

    let celebrated = 0;
    for (const member of (firstTimers ?? [])) {
      const { data: existing } = await supabase
        .from("yande_messages")
        .select("id")
        .eq("user_id", member.user_id)
        .eq("message_type", "milestone")
        .maybeSingle();

      if (existing) continue;

      try {
        await sendYandeMessage(member.user_id, "milestone", {
          milestone_label:  "attended your first BloomBay event",
          milestone_detail: "first time going out with us",
        });
        celebrated++;
        await new Promise(r => setTimeout(r, 300));
      } catch {
        // continue
      }
    }

    // ── 3. Welcome bloomie messages ───────────────────────────────────────────
    const { data: newBloomies } = await supabase
      .from("member_memory_graph")
      .select("user_id, milestones")
      .not("milestones->first_bloomie", "is", null)
      .gte("updated_at", yesterday)
      .limit(batchLimit);

    let newBloomieMessages = 0;
    for (const member of (newBloomies ?? [])) {
      const milestones = member.milestones as Record<string, string>;
      const firstBloomieAt = milestones?.first_bloomie;
      if (!firstBloomieAt || new Date(firstBloomieAt) < new Date(yesterday)) continue;

      const { data: existing } = await supabase
        .from("yande_messages")
        .select("id")
        .eq("user_id", member.user_id)
        .eq("message_type", "celebration")
        .gte("created_at", yesterday)
        .maybeSingle();

      if (existing) continue;

      try {
        await sendYandeMessage(member.user_id, "celebration", {
          milestone: "made your first bloomie connection",
        });
        newBloomieMessages++;
        await new Promise(r => setTimeout(r, 300));
      } catch {
        // continue
      }
    }

    return {
      recordsProcessed: celebrated + newBloomieMessages,
      re_engagement: reEngagement,
      milestones_celebrated: celebrated,
      new_bloomie_messages: newBloomieMessages,
    };
  });
}
