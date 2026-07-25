"use server";

import { createClient } from "@/lib/supabase/server";
import type { GiftKind } from "@/lib/bloom-gifts";
import { unitsForKind } from "@/lib/bloom-gifts";

export async function givePlaceGift(
  placeSlug: string,
  kind: GiftKind
): Promise<{ gave: boolean; kind: GiftKind | null; units: number }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { gave: false, kind: null, units: 0 };

  const units = unitsForKind(kind);
  const { data: existing } = await supabase
    .from("place_flowers")
    .select("place_slug, gift_kind")
    .eq("place_slug", placeSlug)
    .eq("user_id", user.id)
    .maybeSingle();

  if (existing) {
    if ((existing as { gift_kind?: string }).gift_kind === kind) {
      await supabase
        .from("place_flowers")
        .delete()
        .eq("place_slug", placeSlug)
        .eq("user_id", user.id);
      return { gave: false, kind: null, units: 0 };
    }
    await supabase
      .from("place_flowers")
      .update({ gift_kind: kind, units, updated_at: new Date().toISOString() })
      .eq("place_slug", placeSlug)
      .eq("user_id", user.id);
    return { gave: true, kind, units };
  }

  await supabase.from("place_flowers").insert({
    place_slug: placeSlug,
    user_id: user.id,
    gift_kind: kind,
    units,
  });
  return { gave: true, kind, units };
}

export async function takeBackPlaceGift(placeSlug: string): Promise<{ gave: boolean }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { gave: false };
  await supabase
    .from("place_flowers")
    .delete()
    .eq("place_slug", placeSlug)
    .eq("user_id", user.id);
  return { gave: false };
}

export async function getPlaceGiftsForUser(
  placeSlugs: string[]
): Promise<Record<string, { units: number; myKind: GiftKind | null }>> {
  if (!placeSlugs.length) return {};
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: rows } = await supabase
    .from("place_flowers")
    .select("place_slug, user_id, gift_kind, units")
    .in("place_slug", placeSlugs);

  const result: Record<string, { units: number; myKind: GiftKind | null }> = {};
  for (const row of (rows ?? []) as {
    place_slug: string;
    user_id: string;
    gift_kind?: string;
    units?: number;
  }[]) {
    const u = row.units ?? (row.gift_kind === "bouquet" ? 12 : 1);
    const cur = result[row.place_slug] ?? { units: 0, myKind: null };
    cur.units += u;
    if (user && row.user_id === user.id) {
      cur.myKind = row.gift_kind === "bouquet" ? "bouquet" : "flower";
    }
    result[row.place_slug] = cur;
  }
  return result;
}
