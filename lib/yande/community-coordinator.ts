// Yande — Community Coordinator
//
// Responsibilities:
//   1. Welcome new members when they complete onboarding (SMS + in-app notification)
//   2. Day-3 nudge: "Have you found a club yet?"
//   3. Day-7 nudge: "Your first week — here's what's happening"
//
// All actions are logged to yande_actions.
// Member touches are deduplicated via yande_member_touches (idempotent).

"use server";

import { createClient } from "@/lib/supabase/server";
import { sendSMS } from "@/lib/notifications/sms";
import { logAction, recordMemberTouch, hasReceivedTouch } from "./core";

const AGENT = "community_coordinator";

interface MemberProfile {
  id: string;
  first_name: string | null;
  full_name: string | null;
  phone: string | null;
  neighborhood: string | null;
  created_at: string;
}

function firstName(profile: MemberProfile): string {
  const name = profile.full_name ?? profile.first_name ?? "";
  return name.split(" ")[0] || "hey";
}

// ── 1. Welcome message ────────────────────────────────────────────────────────
// Called right after onboarding completes. Sends SMS + in-app notification.

export async function welcomeNewMember(userId: string): Promise<void> {
  const alreadySent = await hasReceivedTouch(userId, "welcome_sms");
  if (alreadySent) return;

  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, first_name, full_name, phone, neighborhood, created_at")
    .eq("id", userId)
    .single();

  if (!profile) return;
  const p = profile as MemberProfile;
  const name = firstName(p);

  // In-app notification (always sent)
  await supabase.from("notifications").insert({
    user_id: userId,
    type: "intro",
    title: `Welcome to BloomBay, ${name}. ✦`,
    body: "Your apartment is ready. Explore your clubs, find a gathering, and say hello to your bloomies.",
    action_url: "/member/home",
  });

  // SMS (only if phone on file)
  let smsOk = false;
  if (p.phone) {
    const message = `Hey ${name} ✦ Welcome to BloomBay. You're officially part of the first women building something real in NYC. Explore your clubs → bloombay.app/member/clubs`;
    const result = await sendSMS(p.phone, message);
    smsOk = result.ok;
  }

  const actionId = await logAction({
    agent: AGENT,
    action_type: "welcome_message",
    risk_level: "low",
    target_user_id: userId,
    metadata: {
      name,
      sms_sent: smsOk,
      notification_sent: true,
      phone_on_file: !!p.phone,
    },
    triggered_by: "onboarding_complete",
  });

  await recordMemberTouch(userId, "welcome_sms", actionId);
}

// ── 2. Day-3 nudge: find a club ───────────────────────────────────────────────
// Run this from a scheduled job (cron or Supabase pg_cron).

export async function nudgeDay3(userId: string): Promise<void> {
  const alreadySent = await hasReceivedTouch(userId, "day3_nudge");
  if (alreadySent) return;

  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, first_name, full_name, phone")
    .eq("id", userId)
    .single();

  if (!profile) return;
  const p = profile as MemberProfile;
  const name = firstName(p);

  await supabase.from("notifications").insert({
    user_id: userId,
    type: "intro",
    title: "Find your people. 🌺",
    body: "You've been here 3 days — have you joined a club yet? Women who join a club in their first week are 3× more likely to attend a gathering.",
    action_url: "/member/clubs",
  });

  let smsOk = false;
  if (p.phone) {
    const message = `${name}, you've been on BloomBay for 3 days 🌸 Have you found your club yet? Women who join a club in week 1 stay 3× longer → bloombay.app/member/clubs`;
    const result = await sendSMS(p.phone, message);
    smsOk = result.ok;
  }

  const actionId = await logAction({
    agent: AGENT,
    action_type: "day3_nudge",
    risk_level: "low",
    target_user_id: userId,
    metadata: { name, sms_sent: smsOk },
    triggered_by: "scheduled",
  });

  await recordMemberTouch(userId, "day3_nudge", actionId);
}

// ── 3. Day-7 nudge: first week recap ─────────────────────────────────────────

export async function nudgeDay7(userId: string): Promise<void> {
  const alreadySent = await hasReceivedTouch(userId, "day7_nudge");
  if (alreadySent) return;

  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, first_name, full_name, phone")
    .eq("id", userId)
    .single();

  if (!profile) return;
  const p = profile as MemberProfile;
  const name = firstName(p);

  await supabase.from("notifications").insert({
    user_id: userId,
    type: "celebrate",
    title: `One week in, ${name}. ✦`,
    body: "You made it through your first week. There are gatherings this weekend — one of them has your name on it.",
    action_url: "/member/happenings",
  });

  let smsOk = false;
  if (p.phone) {
    const message = `${name} ✦ One week on BloomBay. There are women in NYC gathering this weekend — come find them → bloombay.app/member/happenings`;
    const result = await sendSMS(p.phone, message);
    smsOk = result.ok;
  }

  const actionId = await logAction({
    agent: AGENT,
    action_type: "day7_nudge",
    risk_level: "low",
    target_user_id: userId,
    metadata: { name, sms_sent: smsOk },
    triggered_by: "scheduled",
  });

  await recordMemberTouch(userId, "day7_nudge", actionId);
}

// ── Batch runner ──────────────────────────────────────────────────────────────
// Call this from a daily cron/API route. Finds all members due for day-3 or
// day-7 nudges who haven't received them yet, and sends in batches.

export async function runDailyNudges(): Promise<{ processed: number; errors: number }> {
  const supabase = await createClient();

  const now = new Date();
  const day3Start = new Date(now.getTime() - 4 * 86400000).toISOString(); // 4 days ago
  const day3End   = new Date(now.getTime() - 3 * 86400000).toISOString(); // 3 days ago
  const day7Start = new Date(now.getTime() - 8 * 86400000).toISOString(); // 8 days ago
  const day7End   = new Date(now.getTime() - 7 * 86400000).toISOString(); // 7 days ago

  const { data: day3Candidates } = await supabase
    .from("profiles")
    .select("id")
    .eq("onboarding_completed", true)
    .gte("created_at", day3Start)
    .lt("created_at", day3End);

  const { data: day7Candidates } = await supabase
    .from("profiles")
    .select("id")
    .eq("onboarding_completed", true)
    .gte("created_at", day7Start)
    .lt("created_at", day7End);

  let processed = 0;
  let errors = 0;

  for (const { id } of (day3Candidates ?? [])) {
    try { await nudgeDay3(id); processed++; } catch { errors++; }
  }

  for (const { id } of (day7Candidates ?? [])) {
    try { await nudgeDay7(id); processed++; } catch { errors++; }
  }

  await logAction({
    agent: AGENT,
    action_type: "daily_nudge_batch",
    risk_level: "low",
    metadata: { processed, errors, day3_count: day3Candidates?.length ?? 0, day7_count: day7Candidates?.length ?? 0 },
    triggered_by: "scheduled",
  });

  return { processed, errors };
}
