// Yande Community Coordinator — runs daily at 10am EST
// Sends day-3 and day-7 nudges to members who are due for them.
// Protected by CRON_SECRET header.

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendSMS } from "@/lib/notifications/sms";

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
  const secret = req.headers.get("x-cron-secret");
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = admin();
  const now = new Date();

  // Members who joined 3 days ago (±12h window)
  const day3Start = new Date(now.getTime() - 3.5 * 86400000).toISOString();
  const day3End   = new Date(now.getTime() - 2.5 * 86400000).toISOString();

  // Members who joined 7 days ago (±12h window)
  const day7Start = new Date(now.getTime() - 7.5 * 86400000).toISOString();
  const day7End   = new Date(now.getTime() - 6.5 * 86400000).toISOString();

  const [{ data: day3 }, { data: day7 }] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, first_name, full_name, phone")
      .eq("onboarding_completed", true)
      .gte("created_at", day3Start)
      .lt("created_at", day3End),
    supabase
      .from("profiles")
      .select("id, first_name, full_name, phone")
      .eq("onboarding_completed", true)
      .gte("created_at", day7Start)
      .lt("created_at", day7End),
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

      await supabase.from("notifications").insert({
        user_id: p.id,
        type: "intro",
        title: "Find your people. 🌺",
        body: "You've been here 3 days — have you joined a club yet? Women who join a club in their first week are 3× more likely to attend a gathering.",
        action_url: "/member/clubs",
      });

      let smsOk = false;
      if (p.phone) {
        const msg = `${name}, you've been on BloomBay for 3 days 🌸 Have you found your club yet? Women who join in week 1 stay 3× longer → bloombay.app/member/clubs`;
        const result = await sendSMS(p.phone, msg);
        smsOk = result.ok;
      }

      const { data: action } = await supabase.from("yande_actions").insert({
        agent: "community_coordinator",
        action_type: "day3_nudge",
        risk_level: "low",
        status: "completed",
        target_user_id: p.id,
        triggered_by: "scheduled",
        metadata: { name, sms_sent: smsOk, phone_on_file: !!p.phone },
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

      await supabase.from("notifications").insert({
        user_id: p.id,
        type: "celebrate",
        title: `One week in, ${name}. ✦`,
        body: "You made it through your first week. There are gatherings this weekend — one of them has your name on it.",
        action_url: "/member/happenings",
      });

      let smsOk = false;
      if (p.phone) {
        const msg = `${name} ✦ One week on BloomBay. There are women in NYC gathering this weekend — come find them → bloombay.app/member/happenings`;
        const result = await sendSMS(p.phone, msg);
        smsOk = result.ok;
      }

      const { data: action } = await supabase.from("yande_actions").insert({
        agent: "community_coordinator",
        action_type: "day7_nudge",
        risk_level: "low",
        status: "completed",
        target_user_id: p.id,
        triggered_by: "scheduled",
        metadata: { name, sms_sent: smsOk, phone_on_file: !!p.phone },
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
    metadata: {
      processed,
      errors,
      day3_candidates: pending3.length,
      day7_candidates: pending7.length,
    },
  });

  return NextResponse.json({ ok: true, processed, errors });
}
