"use server";

import { createClient } from "@/lib/supabase/server";

export interface CityMoment {
  id: string;
  author_id: string;
  author_name: string | null;
  author_avatar: string | null;
  caption: string | null;
  location_name: string | null;
  photo_urls: string[];
  created_at: string;
  flowers: number;
  myFlower: boolean;
}

export async function getCityMoments(limit = 40): Promise<CityMoment[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("moments")
    .select("id, author_id, caption, location_name, photo_urls, created_at, profiles!author_id(full_name, first_name, avatar_url)")
    .eq("status", "published")
    .in("moment_type", ["place", "event", "meetup"])
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !data) {
    console.error("getCityMoments error:", error?.message);
    return [];
  }

  const ids = data.map((m) => m.id as string);
  const counts: Record<string, number> = {};
  const mine = new Set<string>();

  if (ids.length > 0) {
    const { data: flowerRows } = await supabase
      .from("moment_flowers")
      .select("moment_id, user_id")
      .in("moment_id", ids);
    for (const row of (flowerRows ?? []) as { moment_id: string; user_id: string }[]) {
      counts[row.moment_id] = (counts[row.moment_id] ?? 0) + 1;
      if (user && row.user_id === user.id) mine.add(row.moment_id);
    }
  }

  return data.map((m: Record<string, unknown>) => {
    const p = m.profiles as { full_name?: string; first_name?: string; avatar_url?: string } | null;
    return {
      id: m.id as string,
      author_id: m.author_id as string,
      author_name: p?.full_name ?? p?.first_name ?? null,
      author_avatar: p?.avatar_url ?? null,
      caption: m.caption as string | null,
      location_name: m.location_name as string | null,
      photo_urls: (m.photo_urls as string[]) ?? [],
      created_at: m.created_at as string,
      flowers: counts[m.id as string] ?? 0,
      myFlower: mine.has(m.id as string),
    };
  });
}

export async function flowerMoment(momentId: string): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  await supabase.from("moment_flowers").insert({ moment_id: momentId, user_id: user.id });
}

export async function unflowerMoment(momentId: string): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  await supabase.from("moment_flowers").delete().eq("moment_id", momentId).eq("user_id", user.id);
}

export async function postCityMoment(input: {
  caption: string;
  locationName?: string;
  photoUrl: string;
}): Promise<{ ok: boolean; error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Sign in to continue." };

  const { error } = await supabase.from("moments").insert({
    author_id: user.id,
    template_id: "standard",
    moment_type: "place",
    caption: input.caption.trim() || null,
    location_name: input.locationName?.trim() || null,
    photo_urls: [input.photoUrl],
  });

  if (error) return { ok: false, error: error.message };
  return { ok: true };
}
