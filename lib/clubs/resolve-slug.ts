import type { SupabaseClient } from "@supabase/supabase-js";

type ClubRow = { id: string; slug: string };

/** Resolve a clubs row from a route segment that may be UUID or slug. */
export async function resolveClubBySegment(
  supabase: SupabaseClient,
  segment: string,
): Promise<{ data: ClubRow | null }> {
  const isUuid = /^[0-9a-f-]{36}$/i.test(segment);
  const { data } = await supabase
    .from("clubs")
    .select("id, slug")
    .eq(isUuid ? "id" : "slug", segment)
    .maybeSingle();
  return { data: (data as ClubRow | null) ?? null };
}

/** Resolve club slug from UUID or slug segment. */
export async function resolveClubSlug(
  supabase: SupabaseClient,
  clubIdOrSlug: string,
): Promise<string | null> {
  const { data } = await resolveClubBySegment(supabase, clubIdOrSlug);
  return data?.slug ?? null;
}
