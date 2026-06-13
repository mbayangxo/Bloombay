"use server";

import { createClient } from "@/lib/supabase/server";

export type PlanType = "dinner" | "birthday" | "hangout" | "trip" | "brunch" | "other";
export type RSVPStatus = "pending" | "yes" | "maybe" | "no";

export interface BloomiesPlan {
  id: string;
  creator_id: string;
  creator_name: string | null;
  creator_avatar: string | null;
  title: string;
  plan_type: PlanType;
  description: string | null;
  date_time: string | null;
  venue: string | null;
  status: "active" | "cancelled" | "completed";
  created_at: string;
  my_rsvp: RSVPStatus;
  invites: {
    invitee_id: string;
    display_name: string | null;
    avatar_url: string | null;
    rsvp_status: RSVPStatus;
  }[];
  message_count: number;
}

export interface PlanMessage {
  id: string;
  plan_id: string;
  sender_id: string;
  sender_name: string | null;
  sender_avatar: string | null;
  content: string;
  created_at: string;
}

const INVITE_SELECT = `
  invitee_id, rsvp_status,
  profiles ( display_name, avatar_url )
`;

type InviteRow = {
  invitee_id: string;
  rsvp_status: string;
  profiles: { display_name: string | null; avatar_url: string | null } | { display_name: string | null; avatar_url: string | null }[] | null;
};

function rowToInvite(row: InviteRow) {
  const p = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles;
  return {
    invitee_id: row.invitee_id,
    display_name: p?.display_name ?? null,
    avatar_url: p?.avatar_url ?? null,
    rsvp_status: row.rsvp_status as RSVPStatus,
  };
}

type PlanRow = {
  id: string;
  creator_id: string;
  title: string;
  plan_type: string;
  description: string | null;
  date_time: string | null;
  venue: string | null;
  status: string;
  created_at: string;
  profiles: { display_name: string | null; avatar_url: string | null } | { display_name: string | null; avatar_url: string | null }[] | null;
  bloomies_plan_invites: InviteRow[];
  message_count?: { count: number }[];
};

function rowToPlan(row: PlanRow, userId: string): BloomiesPlan {
  const p = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles;
  const myInvite = row.bloomies_plan_invites.find(i => i.invitee_id === userId);
  const msgCount = row.message_count?.[0]?.count ?? 0;
  return {
    id: row.id,
    creator_id: row.creator_id,
    creator_name: p?.display_name ?? null,
    creator_avatar: p?.avatar_url ?? null,
    title: row.title,
    plan_type: row.plan_type as PlanType,
    description: row.description,
    date_time: row.date_time,
    venue: row.venue,
    status: row.status as BloomiesPlan["status"],
    created_at: row.created_at,
    my_rsvp: row.creator_id === userId ? "yes" : (myInvite?.rsvp_status as RSVPStatus ?? "pending"),
    invites: row.bloomies_plan_invites.map(rowToInvite),
    message_count: msgCount,
  };
}

const PLAN_SELECT = `
  id, creator_id, title, plan_type, description, date_time, venue, status, created_at,
  profiles ( display_name, avatar_url ),
  bloomies_plan_invites ( ${INVITE_SELECT} ),
  message_count:bloomies_plan_messages(count)
`;

export async function getMyBloomiesPlans(): Promise<BloomiesPlan[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("bloomies_plans")
    .select(PLAN_SELECT)
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(30);

  if (error || !data) return [];
  return (data as unknown as PlanRow[]).map(r => rowToPlan(r, user.id));
}

export async function getBloomiesPlanById(planId: string): Promise<BloomiesPlan | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("bloomies_plans")
    .select(PLAN_SELECT)
    .eq("id", planId)
    .single();

  if (error || !data) return null;
  return rowToPlan(data as unknown as PlanRow, user.id);
}

export async function createBloomiesPlan(input: {
  title: string;
  plan_type: PlanType;
  description?: string;
  date_time?: string;
  venue?: string;
  invitee_ids: string[];
}): Promise<{ ok: boolean; plan_id?: string; error?: string }> {
  if (!input.title.trim()) return { ok: false, error: "Give your plan a title." };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not signed in." };

  const { data: plan, error } = await supabase
    .from("bloomies_plans")
    .insert({
      creator_id: user.id,
      title: input.title.trim(),
      plan_type: input.plan_type,
      description: input.description?.trim() || null,
      date_time: input.date_time || null,
      venue: input.venue?.trim() || null,
    })
    .select("id")
    .single();

  if (error || !plan) return { ok: false, error: error?.message ?? "Failed to create plan." };

  if (input.invitee_ids.length > 0) {
    await supabase.from("bloomies_plan_invites").insert(
      input.invitee_ids.map(id => ({ plan_id: plan.id, invitee_id: id, rsvp_status: "pending" }))
    );
  }

  return { ok: true, plan_id: plan.id };
}

export async function updateRSVP(planId: string, status: RSVPStatus): Promise<{ ok: boolean }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false };

  const { error } = await supabase
    .from("bloomies_plan_invites")
    .update({ rsvp_status: status, updated_at: new Date().toISOString() })
    .eq("plan_id", planId)
    .eq("invitee_id", user.id);

  return { ok: !error };
}

export async function getPlanMessages(planId: string, limit = 50): Promise<PlanMessage[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("bloomies_plan_messages")
    .select(`id, plan_id, sender_id, content, created_at, profiles ( display_name, avatar_url )`)
    .eq("plan_id", planId)
    .order("created_at", { ascending: true })
    .limit(limit);

  if (error || !data) return [];
  return (data as unknown as {
    id: string; plan_id: string; sender_id: string; content: string; created_at: string;
    profiles: { display_name: string | null; avatar_url: string | null } | { display_name: string | null; avatar_url: string | null }[] | null;
  }[]).map(r => {
    const p = Array.isArray(r.profiles) ? r.profiles[0] : r.profiles;
    return {
      id: r.id, plan_id: r.plan_id, sender_id: r.sender_id,
      sender_name: p?.display_name ?? null,
      sender_avatar: p?.avatar_url ?? null,
      content: r.content, created_at: r.created_at,
    };
  });
}

export async function sendPlanMessage(planId: string, content: string): Promise<{ ok: boolean }> {
  const trimmed = content.trim();
  if (!trimmed) return { ok: false };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false };

  const { error } = await supabase
    .from("bloomies_plan_messages")
    .insert({ plan_id: planId, sender_id: user.id, content: trimmed });

  return { ok: !error };
}

export async function getBloomiesFriends(): Promise<{ id: string; display_name: string | null; avatar_url: string | null }[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  // Friends = people in shared gathering_attendance or bloomies connections
  // For now, return active members (users who have profiles with display names)
  const { data } = await supabase
    .from("profiles")
    .select("id, display_name, avatar_url")
    .neq("id", user.id)
    .not("display_name", "is", null)
    .limit(50);

  return (data ?? []) as { id: string; display_name: string | null; avatar_url: string | null }[];
}

export const PLAN_TYPE_LABELS: Record<PlanType, string> = {
  dinner:   "Dinner",
  birthday: "Birthday",
  hangout:  "Hangout",
  trip:     "Trip",
  brunch:   "Brunch",
  other:    "Other",
};

export const PLAN_TYPE_EMOJIS: Record<PlanType, string> = {
  dinner:   "🍽️",
  birthday: "🎂",
  hangout:  "🌸",
  trip:     "✈️",
  brunch:   "☕",
  other:    "💫",
};
