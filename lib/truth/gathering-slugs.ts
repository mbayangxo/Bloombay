/** Map member UI event ids to Supabase gathering slugs (003 seed + 006 event_key). */

export const EVENT_KEY_TO_SLUG: Record<string, string> = {
  g1: "sant-ambroeus-soho",
  g2: "cafe-lume-williamsburg",
  inv1: "sant-ambroeus-soho",
  inv2: "cafe-lume-williamsburg",
};

export function gatheringSlugForEventKey(eventKey: string): string | null {
  return EVENT_KEY_TO_SLUG[eventKey] ?? null;
}
