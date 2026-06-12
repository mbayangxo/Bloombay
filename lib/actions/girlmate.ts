"use server";

import { createClient } from "@/lib/supabase/server";

export interface GirlmateProfile {
  id: string;
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  neighborhoods: string[];
  budget_min: number | null;
  budget_max: number | null;
  move_in_date: string | null;
  bio: string | null;
  lifestyle_tags: string[];
  pets: boolean;
  smoking: boolean;
  created_at: string;
}

export interface CreateGirlmateInput {
  neighborhoods: string[];
  budget_min?: number;
  budget_max?: number;
  move_in_date?: string;
  bio?: string;
  lifestyle_tags?: string[];
  pets?: boolean;
  smoking?: boolean;
}

export async function getGirlmateProfiles(): Promise<GirlmateProfile[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("girlmate_profiles")
    .select("*, profiles(display_name, avatar_url)")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(50);
  return (data ?? []).map((r: {
    id: string; user_id: string; neighborhoods: string[]; budget_min: number | null;
    budget_max: number | null; move_in_date: string | null; bio: string | null;
    lifestyle_tags: string[]; pets: boolean; smoking: boolean; created_at: string;
    profiles: { display_name: string | null; avatar_url: string | null } | null;
  }) => ({
    id: r.id, user_id: r.user_id, neighborhoods: r.neighborhoods,
    budget_min: r.budget_min, budget_max: r.budget_max, move_in_date: r.move_in_date,
    bio: r.bio, lifestyle_tags: r.lifestyle_tags, pets: r.pets, smoking: r.smoking,
    created_at: r.created_at,
    display_name: r.profiles?.display_name ?? null,
    avatar_url: r.profiles?.avatar_url ?? null,
  }));
}

export async function getMyGirlmateProfile(): Promise<GirlmateProfile | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase
    .from("girlmate_profiles")
    .select("*, profiles(display_name, avatar_url)")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!data) return null;
  const r = data as {
    id: string; user_id: string; neighborhoods: string[]; budget_min: number | null;
    budget_max: number | null; move_in_date: string | null; bio: string | null;
    lifestyle_tags: string[]; pets: boolean; smoking: boolean; created_at: string;
    profiles: { display_name: string | null; avatar_url: string | null } | null;
  };
  return {
    id: r.id, user_id: r.user_id, neighborhoods: r.neighborhoods,
    budget_min: r.budget_min, budget_max: r.budget_max, move_in_date: r.move_in_date,
    bio: r.bio, lifestyle_tags: r.lifestyle_tags, pets: r.pets, smoking: r.smoking,
    created_at: r.created_at,
    display_name: r.profiles?.display_name ?? null,
    avatar_url: r.profiles?.avatar_url ?? null,
  };
}

export async function upsertGirlmateProfile(input: CreateGirlmateInput): Promise<{ ok: boolean; error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not signed in." };

  const { error } = await supabase.from("girlmate_profiles").upsert({
    user_id: user.id,
    neighborhoods: input.neighborhoods,
    budget_min: input.budget_min ?? null,
    budget_max: input.budget_max ?? null,
    move_in_date: input.move_in_date ?? null,
    bio: input.bio?.trim() ?? null,
    lifestyle_tags: input.lifestyle_tags ?? [],
    pets: input.pets ?? false,
    smoking: input.smoking ?? false,
    is_active: true,
  }, { onConflict: "user_id" });
  return error ? { ok: false, error: error.message } : { ok: true };
}

export async function deactivateGirlmateProfile(): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  await supabase.from("girlmate_profiles").update({ is_active: false }).eq("user_id", user.id);
}
