"use server";

import { createClient } from "@/lib/supabase/server";

export type SavedHappening = {
  kind: "happening";
  id: string;
  slug: string;
  title: string;
  starts_at: string;
  venue: string | null;
  neighborhood: string | null;
  area: string | null;
  image_url: string | null;
  event_type: string | null;
  saved_at: string;
};

export type SavedPlace = {
  kind: "place";
  id: string;
  name: string;
  category: string;
  neighborhood: string | null;
  description: string | null;
  image_url: string | null;
  badge: string | null;
  saved_at: string;
};

export type SavedGem = SavedHappening | SavedPlace;

export async function toggleGatheringSave(
  gatheringId: string,
): Promise<{ saved: boolean; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { saved: false, error: "Not authenticated" };

  const { data: existing } = await supabase
    .from("gathering_saves")
    .select("gathering_id")
    .eq("gathering_id", gatheringId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from("gathering_saves")
      .delete()
      .eq("gathering_id", gatheringId)
      .eq("user_id", user.id);
    if (error) return { saved: true, error: error.message };
    return { saved: false };
  }

  const { error } = await supabase.from("gathering_saves").insert({
    gathering_id: gatheringId,
    user_id: user.id,
  });
  if (error) return { saved: false, error: error.message };
  return { saved: true };
}

export async function isGatheringSaved(gatheringId: string): Promise<boolean> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;

  const { data } = await supabase
    .from("gathering_saves")
    .select("gathering_id")
    .eq("gathering_id", gatheringId)
    .eq("user_id", user.id)
    .maybeSingle();

  return Boolean(data);
}

export async function getMySavedGatheringIds(): Promise<string[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("gathering_saves")
    .select("gathering_id")
    .eq("user_id", user.id);

  return (data ?? []).map((r) => r.gathering_id as string);
}

export async function getMyGems(): Promise<SavedGem[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const [happeningRes, placeRes] = await Promise.all([
    supabase
      .from("gathering_saves")
      .select(
        "saved_at, gatherings(id, slug, title, starts_at, venue, neighborhood, area, image_url, event_type)",
      )
      .eq("user_id", user.id)
      .order("saved_at", { ascending: false }),
    supabase
      .from("city_trending_saves")
      .select(
        "saved_at, city_trending(id, name, category, neighborhood, description, image_url, badge)",
      )
      .eq("user_id", user.id)
      .order("saved_at", { ascending: false }),
  ]);

  const happenings: SavedHappening[] = (happeningRes.data ?? [])
    .map((row) => {
      const g = row.gatherings as
        | {
            id: string;
            slug: string;
            title: string;
            starts_at: string;
            venue: string | null;
            neighborhood: string | null;
            area: string | null;
            image_url: string | null;
            event_type: string | null;
          }
        | null
        | Array<{
            id: string;
            slug: string;
            title: string;
            starts_at: string;
            venue: string | null;
            neighborhood: string | null;
            area: string | null;
            image_url: string | null;
            event_type: string | null;
          }>;
      const gathering = Array.isArray(g) ? g[0] : g;
      if (!gathering) return null;
      return {
        kind: "happening" as const,
        id: gathering.id,
        slug: gathering.slug,
        title: gathering.title,
        starts_at: gathering.starts_at,
        venue: gathering.venue,
        neighborhood: gathering.neighborhood,
        area: gathering.area,
        image_url: gathering.image_url,
        event_type: gathering.event_type,
        saved_at: row.saved_at as string,
      };
    })
    .filter((x): x is SavedHappening => Boolean(x));

  const places: SavedPlace[] = (placeRes.data ?? [])
    .map((row) => {
      const p = row.city_trending as
        | {
            id: string;
            name: string;
            category: string;
            neighborhood: string | null;
            description: string | null;
            image_url: string | null;
            badge: string | null;
          }
        | null
        | Array<{
            id: string;
            name: string;
            category: string;
            neighborhood: string | null;
            description: string | null;
            image_url: string | null;
            badge: string | null;
          }>;
      const place = Array.isArray(p) ? p[0] : p;
      if (!place) return null;
      return {
        kind: "place" as const,
        id: place.id,
        name: place.name,
        category: place.category,
        neighborhood: place.neighborhood,
        description: place.description,
        image_url: place.image_url,
        badge: place.badge,
        saved_at: row.saved_at as string,
      };
    })
    .filter((x): x is SavedPlace => Boolean(x));

  return [...happenings, ...places].sort(
    (a, b) => new Date(b.saved_at).getTime() - new Date(a.saved_at).getTime(),
  );
}
