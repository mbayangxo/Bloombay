// Yande Community Coordinator — runs daily at 10am EST
// Sends day-3 and day-7 nudges to members who are due for them.
// Protected by CRON_SECRET header.

import { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { runCronJob, type CronContext, type CronJobResult } from "@/lib/cron-guard";
import { createNotificationEvent } from "@/lib/notifications/notification-service";

function admin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

type Profile = { id: string; first_name: string | null; full_name: string | null; phone: string | null };

function firstName(p: Profile): string {
  const name = p.full_name ?? p.first_name ?? "";
  return name.split(" ")[0] || "hey";
}

async function logAction(supabase: ReturnType<typeof admin>, input: Record<string, unknown>) {
  await supabase.from("yande_actions").insert({
    agent: "community_coordinator",
    risk_level: "low",
    status: "completed",
    triggered_by: "scheduled",
    ...input,
  });
}

async function recordTouch(supabase: ReturnType<typeof admin>, userId: string, touchType: string, actionId?: string) {
  const { error } = await supabase.from("yande_member_touches").insert({
    user_id: userId,
    touch_type: touchType,
    yande_action_id: actionId ?? null,
  });
  // Unique constraint violation (already recorded) is expected — ignore it
  if (error && !error.message.includes("unique")) {
    console.error("[Community Coordinator] recordTouch error:", error.message);
  }
}

export async function POST(req: NextRequest) {
  return runCronJob(req, "community-coordinator", runCommunityCoordinator);
}

async function runCommunityCoordinator(ctx: CronContext): Promise<CronJobResult> {
  if (ctx.dryRun) {
    return { recordsProcessed: 0, dry_run: true, message: "Dry run — no data written" };
  }

  const supabase = admin();
  const now = new Date();
  const max = ctx.maxRecords;

  const day3Start = new Date(now.getTime() - 3.5 * 86400000).toISOString();
  const day3End = new Date(now.getTime() - 2.5 * 86400000).toISOString();
  const day7Start = new Date(now.getTime() - 7.5 * 86400000).toISOString();
  const day7End = new Date(now.getTime() - 6.5 * 86400000).toISOString();

    const [{ data: day3 }, { data: day7 }] = await Promise.all([
      supabase
        .from("profiles")
        .select("id, first_name, full_name, phone")
        .eq("onboarding_completed", true)
        .gte("created_at", day3Start)
        .lt("created_at", day3End)
        .limit(max),
      supabase
        .from("profiles")
        .select("id, first_name, full_name, phone")
        .eq("onboarding_completed", true)
        .gte("created_at", day7Start)
        .lt("created_at", day7End)
        .limit(max),
    ]);

    // Filter out anyone who already received the touch
    const [{ data: existing3 }, { data: existing7 }] = await Promise.all([
      supabase.from("yande_member_touches").select("user_id").eq("touch_type", "day3_nudge").in("user_id", (day3 ?? []).map(p => p.id)),
      supabase.from("yande_member_touches").select("user_id").eq("touch_type", "day7_nudge").in("user_id", (day7 ?? []).map(p => p.id)),
    ]);

    const sent3 = new Set((existing3 ?? []).map((r: { user_id: string }) => r.user_id));
    const sent7 = new Set((existing7 ?? []).map((r: { user_id: string }) => r.user_id));

    const pending3 = (day3 ?? []).filter(p => !sent3.has(p.id)) as Profile[];
    const pending7 = (day7 ?? []).filter(p => !sent7.has(p.id)) as Profile[];

    let processed = 0;
    let errors = 0;

    // ── Day-3 nudges ─────────────────────────────────────────────────────────
    for (const p of pending3) {
      try {
        const name = firstName(p);

        await createNotificationEvent({
          userId: p.id,
          type: "day3_nudge",
          channels: ["in_app"],
          payload: {
            templateVars: { name },
            link: "/member/clubs",
          },
        });

        const { data: action } = await supabase.from("yande_actions").insert({
          agent: "community_coordinator",
          action_type: "day3_nudge",
          risk_level: "low",
          status: "completed",
          target_user_id: p.id,
          triggered_by: "scheduled",
          metadata: { name },
        }).select("id").single();

        await recordTouch(supabase, p.id, "day3_nudge", (action as { id: string } | null)?.id);
        processed++;
      } catch (err) {
        console.error("[Community Coordinator] day3 error for", p.id, err);
        errors++;
      }
    }

    // ── Day-7 nudges ─────────────────────────────────────────────────────────
    for (const p of pending7) {
      try {
        const name = firstName(p);

        await createNotificationEvent({
          userId: p.id,
          type: "day7_nudge",
          channels: ["in_app"],
          payload: {
            title: `One week in, ${name}. ✦`,
            body: "You made it through your first week. There are gatherings this weekend — one of them has your name on it.",
            link: "/member/happenings",
          },
        });

        const { data: action } = await supabase.from("yande_actions").insert({
          agent: "community_coordinator",
          action_type: "day7_nudge",
          risk_level: "low",
          status: "completed",
          target_user_id: p.id,
          triggered_by: "scheduled",
          metadata: { name },
        }).select("id").single();

        await recordTouch(supabase, p.id, "day7_nudge", (action as { id: string } | null)?.id);
        processed++;
      } catch (err) {
        console.error("[Community Coordinator] day7 error for", p.id, err);
        errors++;
      }
    }

    await logAction(supabase, {
      action_type: "daily_nudge_batch",
      metadata: { processed, errors, day3_candidates: pending3.length, day7_candidates: pending7.length },
    });

  return {
    recordsProcessed: processed,
    processed,
    errors,
    day3: pending3.length,
    day7: pending7.length,
  };
}
