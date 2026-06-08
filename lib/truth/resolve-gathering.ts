import type { SupabaseClient } from "@supabase/supabase-js";
import { gatheringSlugForEventKey } from "@/lib/truth/gathering-slugs";

export async function resolveGatheringId(
  supabase: SupabaseClient,
  input: { gatheringId?: string; slug?: string; eventKey?: string }
): Promise<{ id: string; slug: string } | null> {
  if (input.gatheringId) {
    const { data } = await supabase
      .from("gatherings")
      .select("id, slug")
      .eq("id", input.gatheringId)
      .maybeSingle();
    return data ? { id: data.id as string, slug: data.slug as string } : null;
  }

  const slug = input.slug ?? (input.eventKey ? gatheringSlugForEventKey(input.eventKey) : null);
  if (!slug) {
    if (input.eventKey) {
      const { data } = await supabase
        .from("gatherings")
        .select("id, slug")
        .eq("event_key", input.eventKey)
        .maybeSingle();
      if (data) return { id: data.id as string, slug: data.slug as string };
    }
    return null;
  }

  const { data } = await supabase.from("gatherings").select("id, slug").eq("slug", slug).maybeSingle();
  return data ? { id: data.id as string, slug: data.slug as string } : null;
}
