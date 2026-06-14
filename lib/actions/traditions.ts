"use server";

import { createClient } from "@/lib/supabase/server";

export interface Tradition {
  id: string;
  host_id: string;
  name: string;
  slug: string;
  description: string | null;
  frequency: string;
  neighborhood: string | null;
  cover_url: string | null;
  primary_color: string;
  status: string;
  club_id: string | null;
  gathering_count: number;
  follower_count: number;
  created_at: string;
  is_following?: boolean;
  host_name?: string | null;
}

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export async function getTraditions(limit = 20): Promise<Tradition[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data } = await supabase
    .from("traditions")
    .select("*, profiles!host_id(first_name, full_name)")
    .eq("status", "active")
    .order("follower_count", { ascending: false })
    .limit(limit);

  const followedIds = new Set<string>();
  if (user && data?.length) {
    const { data: follows } = await supabase
      .from("tradition_followers")
      .select("tradition_id")
      .eq("user_id", user.id)
      .in("tradition_id", (data as { id: string }[]).map(t => t.id));
    (follows ?? []).forEach((f: { tradition_id: string }) => followedIds.add(f.tradition_id));
  }

  return (data ?? []).map((t: Record<string, unknown>) => {
    const profile = t.profiles as { first_name?: string; full_name?: string } | null;
    return {
      ...(t as unknown as Tradition),
      host_name: profile?.full_name ?? profile?.first_name ?? null,
      is_following: followedIds.has(t.id as string),
    };
  });
}

export async function getMyTraditions(): Promise<Tradition[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("traditions")
    .select("*")
    .eq("host_id", user.id)
    .order("created_at", { ascending: false });

  return (data ?? []) as Tradition[];
}

export async function createTradition(input: {
  name: string;
  description?: string;
  frequency: string;
  neighborhood?: string;
  primary_color?: string;
}): Promise<{ ok: boolean; tradition?: Tradition; error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not authenticated" };

  const slug = slugify(input.name) + "-" + Math.random().toString(36).slice(2, 6);

  const { data, error } = await supabase.from("traditions").insert({
    host_id: user.id,
    name: input.name,
    slug,
    description: input.description ?? null,
    frequency: input.frequency,
    neighborhood: input.neighborhood ?? null,
    primary_color: input.primary_color ?? "#FF1F7D",
  }).select().single();

  if (error) return { ok: false, error: error.message };
  return { ok: true, tradition: data as Tradition };
}

export async function toggleFollowTradition(traditionId: string): Promise<{ following: boolean }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { following: false };

  const { data: existing } = await supabase
    .from("tradition_followers")
    .select("tradition_id")
    .eq("tradition_id", traditionId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (existing) {
    await supabase.from("tradition_followers").delete()
      .eq("tradition_id", traditionId).eq("user_id", user.id);
    return { following: false };
  }
  await supabase.from("tradition_followers").insert({ tradition_id: traditionId, user_id: user.id });
  return { following: true };
}

export async function linkGatheringToTradition(gatheringId: string, traditionId: string): Promise<{ ok: boolean }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false };

  const { data: trad } = await supabase
    .from("traditions").select("host_id").eq("id", traditionId).single();
  if (!trad || (trad as { host_id: string }).host_id !== user.id) return { ok: false };

  const { error } = await supabase
    .from("gatherings")
    .update({ tradition_id: traditionId })
    .eq("id", gatheringId)
    .eq("host_id", user.id);

  return { ok: !error };
}

export async function getTraditionBySlug(slug: string): Promise<(Tradition & { gatherings?: unknown[] }) | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: tradition } = await supabase
    .from("traditions")
    .select("*, profiles!host_id(first_name, full_name)")
    .eq("slug", slug)
    .single();

  if (!tradition) return null;

  const { data: gatherings } = await supabase
    .from("gatherings")
    .select("id, title, starts_at, venue, neighborhood, attending_count, spots_left")
    .eq("tradition_id", tradition.id)
    .order("starts_at", { ascending: false })
    .limit(20);

  let is_following = false;
  if (user) {
    const { data: f } = await supabase.from("tradition_followers")
      .select("tradition_id").eq("tradition_id", tradition.id).eq("user_id", user.id).maybeSingle();
    is_following = !!f;
  }

  const profile = (tradition as Record<string, unknown>).profiles as { first_name?: string; full_name?: string } | null;
  return {
    ...(tradition as unknown as Tradition),
    host_name: profile?.full_name ?? profile?.first_name ?? null,
    is_following,
    gatherings: gatherings ?? [],
  };
}
