// Yande Messages
//
// Generates and delivers personalized messages from Yande to individual members.
// Uses Claude Haiku to write warm, observational messages grounded in the
// member's memory graph. Delivers via yande_messages table + in-app notification.

import { createClient } from "@supabase/supabase-js";
import { yandeRandom } from "./voice";

function admin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

export type YandeMessageType =
  | "check_in"
  | "celebration"
  | "suggestion"
  | "introduction"
  | "milestone"
  | "community_insight"
  | "re_engagement";

interface MemberGraph {
  user_id: string;
  attendance_count: number;
  clubs_joined: number;
  bloom_given: number;
  bloom_received: number;
  friendship_score: number;
  churn_risk: number;
  last_active_at: string | null;
  first_event_at: string | null;
  milestones: Record<string, string>;
  ai_profile: string | null;
}

interface Profile {
  id: string;
  first_name: string | null;
  full_name: string | null;
  phone: string | null;
  neighborhood: string | null;
}

function firstName(p: Profile): string {
  const name = p.full_name ?? p.first_name ?? "";
  return name.split(" ")[0] || "hey";
}

async function callClaude(system: string, user: string): Promise<string | null> {
  if (!process.env.ANTHROPIC_API_KEY) return null;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 180,
      system,
      messages: [{ role: "user", content: user }],
    }),
  });

  if (!res.ok) return null;
  const data = await res.json() as { content: { type: string; text: string }[] };
  return data.content[0]?.text?.trim() ?? null;
}

// Generate and deliver one Yande message to a member.
export async function sendYandeMessage(
  userId: string,
  type: YandeMessageType,
  context: Record<string, unknown> = {},
): Promise<boolean> {
  const supabase = admin();

  const [{ data: profile }, { data: graph }] = await Promise.all([
    supabase.from("profiles").select("id, first_name, full_name, phone, neighborhood").eq("id", userId).maybeSingle(),
    supabase.from("member_memory_graph").select("*").eq("user_id", userId).maybeSingle(),
  ]);

  if (!profile) return false;
  const p = profile as Profile;
  const g = graph as MemberGraph | null;
  const name = firstName(p);

  const systemPrompt = `You are Yande, BloomBay's AI. You know ${name} personally.
Write a short, warm, specific message to her — like a brilliant friend who pays attention.
No labels, no "Hi ${name}", no sign-off. Just the message body. 2-3 sentences maximum.
Tone: direct, caring, not corporate. She should feel seen.`;

  const userPrompt = buildPrompt(type, name, g, context);
  const body = await callClaude(systemPrompt, userPrompt) ?? fallbackMessage(type, name);

  const subject = subjectLine(type, name);
  const actionUrl = (context.action_url as string) ?? actionForType(type);

  // Store in yande_messages inbox
  const { data: msg } = await supabase
    .from("yande_messages")
    .insert({ user_id: userId, message_type: type, subject, body, action_url: actionUrl, metadata: context })
    .select("id")
    .single();

  // Also push as an in-app notification
  await supabase.from("notifications").insert({
    user_id: userId,
    type: "intro",
    title: subject,
    body: body.slice(0, 140),
    action_url: `/member/messages`,
  });

  await supabase.from("yande_actions").insert({
    agent: "yande_messages",
    action_type: `message_${type}`,
    risk_level: "low",
    status: "completed",
    target_user_id: userId,
    triggered_by: "scheduled",
    metadata: { message_id: (msg as { id: string } | null)?.id, type },
  });

  return true;
}

function buildPrompt(
  type: YandeMessageType,
  name: string,
  graph: MemberGraph | null,
  context: Record<string, unknown>,
): string {
  const g = graph;
  const attended   = g?.attendance_count ?? 0;
  const clubs      = g?.clubs_joined ?? 0;
  const blooms     = g?.bloom_given ?? 0;
  const score      = g?.friendship_score ?? 0;
  const daysSilent = g?.last_active_at
    ? Math.round((Date.now() - new Date(g.last_active_at).getTime()) / 86400000)
    : null;

  switch (type) {
    case "check_in":
      return `${name} has been quiet for ${daysSilent ?? "a few"} days. She's attended ${attended} events and is in ${clubs} clubs. Her friendship score is ${score}/100. Write a gentle check-in.`;

    case "celebration":
      return `${name} just hit a milestone: ${context.milestone ?? "something worth celebrating"}. She's been active and has ${score}/100 connection score. Celebrate her genuinely.`;

    case "suggestion":
      return `${name} is in ${clubs} clubs and has been to ${attended} events. She has ${score}/100 connection score. Suggest she ${context.suggestion ?? "explore something new"}. Be specific.`;

    case "introduction":
      return `${name} might connect with ${context.other_name ?? "another member"}. They share: ${context.shared_interests ?? "similar energy and neighborhoods"}. Write an intro note for ${name}.`;

    case "milestone":
      return `${name} just ${context.milestone_label ?? "reached a milestone"} on BloomBay. This is her ${context.milestone_detail ?? "first time doing this"}. Acknowledge it warmly.`;

    case "community_insight":
      return `${name} is one of ${context.community_count ?? "many"} bloomies who ${context.insight ?? "have something in common"}. Share this with her in a way that makes her feel part of something.`;

    case "re_engagement":
      return `${name} has been quiet for ${daysSilent ?? "a while"}. She has ${blooms} blooms given, ${clubs} clubs, ${attended} events. Write a warm re-engagement message that doesn't feel like spam.`;

    default:
      return `Write a short warm message for ${name} about her BloomBay experience.`;
  }
}

function fallbackMessage(type: YandeMessageType, name: string): string {
  switch (type) {
    case "re_engagement": return `${name}, the city has been busy. Just checking in to make sure you're good. — Yande ✦`;
    case "celebration":   return `You've been doing the thing. I noticed. — Yande ✦`;
    case "introduction":  return `${yandeRandom("friends")} — Yande ✦`;
    default:              return `${yandeRandom("short")} — Yande ✦`;
  }
}

function subjectLine(type: YandeMessageType, name: string): string {
  switch (type) {
    case "check_in":           return `Hey ${name}. ✦`;
    case "celebration":        return `You did something worth noting. ✦`;
    case "suggestion":         return `Something caught my eye for you.`;
    case "introduction":       return `I thought you two should know each other.`;
    case "milestone":          return `A first worth remembering.`;
    case "community_insight":  return `Something I noticed about your circle.`;
    case "re_engagement":      return `It's been a minute.`;
    default:                   return `From Yande ✦`;
  }
}

function actionForType(type: YandeMessageType): string {
  switch (type) {
    case "suggestion":    return "/member/happenings";
    case "introduction":  return "/member/introductions";
    default:              return "/member/home";
  }
}

// Batch runner: find members who need re-engagement and send messages.
export async function runReEngagementBatch(): Promise<{ sent: number; skipped: number }> {
  const supabase = admin();

  // Members quiet 14–28 days with moderate connection history
  const { data: at_risk } = await supabase
    .from("member_memory_graph")
    .select("user_id, churn_risk, friendship_score")
    .gt("churn_risk", 0.4)
    .lt("churn_risk", 0.9)
    .gt("friendship_score", 10)  // not brand new
    .limit(50);

  if (!at_risk?.length) return { sent: 0, skipped: 0 };

  // Filter: haven't received re_engagement in 14 days
  const userIds = at_risk.map(r => r.user_id);
  const cutoff  = new Date(Date.now() - 14 * 86400000).toISOString();

  const { data: recentMessages } = await supabase
    .from("yande_messages")
    .select("user_id")
    .in("user_id", userIds)
    .eq("message_type", "re_engagement")
    .gte("created_at", cutoff);

  const recentlySent = new Set((recentMessages ?? []).map(m => m.user_id));
  const pending = at_risk.filter(r => !recentlySent.has(r.user_id));

  let sent = 0;
  for (const member of pending) {
    try {
      await sendYandeMessage(member.user_id, "re_engagement");
      sent++;
      await new Promise(r => setTimeout(r, 300));
    } catch {
      // continue
    }
  }

  return { sent, skipped: at_risk.length - sent };
}
