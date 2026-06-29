import type { SupabaseClient } from "@supabase/supabase-js";

/** Resolve a clubs row from a route segment that may be UUID or slug. */
export async function resolveClubBySegment(
  supabase: SupabaseClient,
  segment: string,
  columns = "id, slug",
) {
  const isUuid = /^[0-9a-f-]{36}$/i.test(segment);
  return supabase
    .from("clubs")
    .select(columns)
    .eq(isUuid ? "id" : "slug", segment)
    .maybeSingle();
}

/** Resolve club slug from UUID or slug segment. */
export async function resolveClubSlug(
  supabase: SupabaseClient,
  clubIdOrSlug: string,
): Promise<string | null> {
  const { data } = await resolveClubBySegment(supabase, clubIdOrSlug, "slug");
  return (data?.slug as string | null) ?? null;
}
