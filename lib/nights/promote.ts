/**
 * Promote an approved night_submission into a Happenings gathering.
 * Shared by cron auto-approve and founder Approve actions.
 */

import type { SupabaseClient } from "@supabase/supabase-js";

export type NightRow = {
  id: string;
  title: string;
  description: string | null;
  starts_at: string | null;
  venue: string | null;
  neighborhood: string | null;
  city: string;
  image_url: string | null;
  external_url: string | null;
  external_source: string;
  category: string;
  gathering_id?: string | null;
};

const CATEGORY_TO_EVENT_TYPE: Record<string, string> = {
  dining: "dinner",
  brunch: "dinner",
  drinks: "aperitivo",
  nightlife: "party",
  art: "museum",
  wellness: "wellness",
  shopping: "cafe",
  coffee: "cafe",
  "pop-up": "party",
  event: "party",
  other: "party",
};

function slugify(title: string): string {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
  const suffix = Math.random().toString(36).slice(2, 8);
  return `${base || "night"}-${suffix}`;
}

/** Soft girl-oriented + BloomBay aesthetic gate. Returns score 0–100. */
export function scoreNightAesthetic(title: string, description?: string | null): {
  score: number;
  keep: boolean;
  note: string;
} {
  const text = `${title} ${description ?? ""}`.toLowerCase();

  const block = [
    "frat", "bachelor", "bachelors", "guys night", "mens only", "men's only",
    "crypto meetup", "poker night", "sports bar crawl", "bro ", "hackathon",
    "startup pitch", "networking for founders",
  ];
  for (const b of block) {
    if (text.includes(b)) {
      return { score: 10, keep: false, note: `Blocked theme: ${b}` };
    }
  }

  const boost = [
    "women", "woman", "girls", "girl ", "ladies", "sisterhood", "femme",
    "brunch", "wellness", "pilates", "yoga", "beauty", "book club",
    "gallery", "museum", "wine", "dinner", "soft life", "self-care",
    "fashion", "sample sale", "floral", "matcha", "café", "cafe",
    "rooftop girls", "girls night", "ladies night", "women's", "womens",
  ];
  let score = 45;
  const hits: string[] = [];
  for (const w of boost) {
    if (text.includes(w)) {
      score += 8;
      hits.push(w.trim());
    }
  }
  score = Math.min(100, score);
  const keep = score >= 50;
  return {
    score,
    keep,
    note: hits.length ? `Matched: ${hits.slice(0, 4).join(", ")}` : "Neutral — review manually",
  };
}

export async function promoteNightToGathering(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: SupabaseClient<any>,
  night: NightRow,
  reviewedBy?: string | null,
): Promise<{ gatheringId: string | null; error?: string }> {
  if (night.gathering_id) {
    return { gatheringId: night.gathering_id };
  }

  const startsAt =
    night.starts_at && !Number.isNaN(Date.parse(night.starts_at))
      ? night.starts_at
      : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

  const eventType = CATEGORY_TO_EVENT_TYPE[night.category] ?? "party";
  const capacity = 24;

  const { data: gathering, error } = await supabase
    .from("gatherings")
    .insert({
      slug: slugify(night.title),
      title: night.title,
      description: night.description,
      starts_at: startsAt,
      venue: night.venue,
      neighborhood: night.neighborhood,
      area: night.neighborhood ?? night.city,
      capacity,
      spots_left: capacity,
      event_type: eventType,
      image_url: night.image_url,
      host_name: night.external_source === "manual" ? "Bloomie pick" : "BloomBay City",
      price_cents: 0,
      curated_by_admin: true,
      external_source: night.external_source,
      external_url: night.external_url,
    })
    .select("id")
    .single();

  if (error || !gathering) {
    return { gatheringId: null, error: error?.message ?? "Insert failed" };
  }

  await supabase
    .from("night_submissions")
    .update({
      status: "approved",
      gathering_id: gathering.id,
      reviewed_by: reviewedBy ?? null,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", night.id);

  return { gatheringId: gathering.id as string };
}
