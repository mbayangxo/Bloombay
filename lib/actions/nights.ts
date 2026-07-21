"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireFounderOrAdmin } from "@/lib/auth/require-founder-admin";
import {
  promoteNightToGathering,
  scoreNightAesthetic,
  type NightRow,
} from "@/lib/nights/promote";

export type NightSubmission = NightRow & {
  status: "pending" | "approved" | "rejected";
  aesthetic_score: number | null;
  aesthetic_note: string | null;
  created_at: string;
  reject_reason: string | null;
};

export async function listNightSubmissions(
  status: "pending" | "approved" | "rejected" | "all" = "pending",
): Promise<NightSubmission[]> {
  const gate = await requireFounderOrAdmin();
  if (!gate.ok) return [];

  const supabase = await createClient();
  let q = supabase
    .from("night_submissions")
    .select(
      "id,title,description,starts_at,venue,neighborhood,city,image_url,external_url,external_source,category,status,aesthetic_score,aesthetic_note,gathering_id,created_at,reject_reason",
    )
    .order("created_at", { ascending: false })
    .limit(100);

  if (status !== "all") q = q.eq("status", status);

  const { data } = await q;
  return (data ?? []) as NightSubmission[];
}

export async function approveNight(id: string): Promise<{ ok: boolean; error?: string }> {
  const gate = await requireFounderOrAdmin();
  if (!gate.ok) return { ok: false, error: gate.error };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const admin = createAdminClient();
  const { data: night, error } = await admin
    .from("night_submissions")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !night) return { ok: false, error: error?.message ?? "Not found" };
  if (night.status === "approved" && night.gathering_id) {
    return { ok: true };
  }

  const result = await promoteNightToGathering(admin, night as NightRow, user?.id ?? null);
  if (result.error) return { ok: false, error: result.error };
  return { ok: true };
}

export async function rejectNight(
  id: string,
  reason?: string,
): Promise<{ ok: boolean; error?: string }> {
  const gate = await requireFounderOrAdmin();
  if (!gate.ok) return { ok: false, error: gate.error };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase
    .from("night_submissions")
    .update({
      status: "rejected",
      reject_reason: reason ?? null,
      reviewed_by: user?.id ?? null,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", id);

  return error ? { ok: false, error: error.message } : { ok: true };
}

export async function approveAllPendingNights(): Promise<{ ok: boolean; approved: number; error?: string }> {
  const gate = await requireFounderOrAdmin();
  if (!gate.ok) return { ok: false, approved: 0, error: gate.error };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const admin = createAdminClient();

  const { data: pending } = await admin
    .from("night_submissions")
    .select("*")
    .eq("status", "pending")
    .limit(100);

  let approved = 0;
  for (const night of pending ?? []) {
    const result = await promoteNightToGathering(admin, night as NightRow, user?.id ?? null);
    if (!result.error) approved++;
  }
  return { ok: true, approved };
}

export async function submitANight(input: {
  title: string;
  description?: string;
  starts_at?: string;
  venue?: string;
  neighborhood?: string;
  city?: string;
  external_url?: string;
  category?: string;
}): Promise<{ ok: boolean; error?: string; id?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Sign in to submit a night" };

  const title = input.title.trim();
  if (!title) return { ok: false, error: "Title is required" };

  const aesthetic = scoreNightAesthetic(title, input.description);

  const { data, error } = await supabase
    .from("night_submissions")
    .insert({
      title,
      description: input.description?.trim() || null,
      starts_at: input.starts_at || null,
      venue: input.venue?.trim() || null,
      neighborhood: input.neighborhood?.trim() || null,
      city: input.city?.trim() || "New York",
      external_url: input.external_url?.trim() || null,
      external_source: "manual",
      category: input.category || "event",
      aesthetic_score: aesthetic.score,
      aesthetic_note: aesthetic.note,
      status: "pending",
      submitted_by: user.id,
    })
    .select("id")
    .single();

  if (error) return { ok: false, error: error.message };
  return { ok: true, id: data.id as string };
}
