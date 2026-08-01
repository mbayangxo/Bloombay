// Real "chemistry preview" for a happening: averages the existing pairwise
// compatibility scorer (lib/yande/matching.ts) across the viewer and every
// other member with a reserved seat. No fabricated numbers — if nobody else
// has RSVP'd yet, there's nothing to average and this returns null.

import { createClient } from "@supabase/supabase-js";
import { scoreCompatibility } from "@/lib/yande/matching";

function admin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

export interface GatheringChemistry {
  score: number;          // 0–100, averaged across other confirmed attendees
  attendee_count: number; // how many other attendees this is averaged over
  breakdown: {
    values_pct: number;
    vibe_pct: number;
    interests_pct: number;
    energy_pct: number;
  };
}

export async function getGatheringChemistry(
  gatheringId: string,
  viewerUserId: string,
): Promise<GatheringChemistry | null> {
  const supabase = admin();

  const { data: seats } = await supabase
    .from("seat_reservations")
    .select("user_id")
    .eq("gathering_id", gatheringId)
    .eq("status", "reserved")
    .neq("user_id", viewerUserId);

  const otherIds = [...new Set((seats ?? []).map((s: { user_id: string }) => s.user_id))];
  if (otherIds.length === 0) return null;

  const scores = (
    await Promise.all(otherIds.map(id => scoreCompatibility(viewerUserId, id)))
  ).filter((s): s is NonNullable<typeof s> => s !== null);

  if (scores.length === 0) return null;

  const avg = (nums: number[]) => Math.round(nums.reduce((a, b) => a + b, 0) / nums.length);

  return {
    score: avg(scores.map(s => s.score)),
    attendee_count: scores.length,
    breakdown: {
      values_pct:    avg(scores.map(s => s.breakdown.values_pct)),
      vibe_pct:      avg(scores.map(s => s.breakdown.vibe_pct)),
      interests_pct: avg(scores.map(s => s.breakdown.interests_pct)),
      energy_pct:    avg(scores.map(s => s.breakdown.energy_pct)),
    },
  };
}
