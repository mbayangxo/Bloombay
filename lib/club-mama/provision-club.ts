import type { SupabaseClient } from "@supabase/supabase-js";
import { slugifyClubName } from "@/lib/clubs/slug";

export interface ClubMamaApplicationRow {
  id: string;
  user_id: string | null;
  club_name: string;
  club_emoji: string | null;
  category: string | null;
  tagline: string | null;
  neighborhood: string | null;
  description: string | null;
  frequency: string | null;
  capacity: number | null;
  membership_type: string | null;
}

async function ensureUniqueSlug(
  supabase: SupabaseClient,
  base: string,
): Promise<string> {
  let slug = base;
  let suffix = 0;
  while (true) {
    const { count } = await supabase
      .from("clubs")
      .select("id", { count: "exact", head: true })
      .eq("slug", slug);
    if (!count) return slug;
    suffix += 1;
    slug = `${base}-${suffix}`;
  }
}

/** Core clubs columns present from 013_member_media.sql */
function coreClubFields(
  app: ClubMamaApplicationRow,
  ownerId: string,
): Record<string, unknown> {
  return {
    name: app.club_name,
    tagline: app.tagline,
    description: app.description,
    owner_id: ownerId,
    updated_at: new Date().toISOString(),
  };
}

/** Creates or updates the owner's club row from an approved Club Mama application. */
export async function provisionClubFromApplication(
  supabase: SupabaseClient,
  app: ClubMamaApplicationRow,
  ownerId: string,
): Promise<{ clubId: string; clubSlug: string; created: boolean }> {
  const baseSlug = await ensureUniqueSlug(supabase, slugifyClubName(app.club_name));
  const clubFields = coreClubFields(app, ownerId);

  const { data: existing } = await supabase
    .from("clubs")
    .select("id, slug")
    .eq("owner_id", ownerId)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from("clubs")
      .update(clubFields)
      .eq("id", existing.id);
    if (error) throw new Error(error.message);
    return { clubId: existing.id, clubSlug: existing.slug, created: false };
  }

  const { data: created, error } = await supabase
    .from("clubs")
    .insert({ ...clubFields, slug: baseSlug })
    .select("id, slug")
    .single();

  if (error || !created) {
    throw new Error(error?.message ?? "Failed to create club");
  }

  return { clubId: created.id, clubSlug: created.slug, created: true };
}
