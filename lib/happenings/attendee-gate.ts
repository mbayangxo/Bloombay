import { createClient } from "@/lib/supabase/server";

/**
 * Confirmed engagement on a happening:
 * - reserved a seat (going), OR
 * - checked in / attended, OR
 * - paid ticket confirmed
 */
export async function isConfirmedGatheringParticipant(
  gatheringId: string,
  userId?: string | null,
): Promise<boolean> {
  if (!userId) return false;
  const supabase = await createClient();

  const [seat, attended, ticket] = await Promise.all([
    supabase
      .from("seat_reservations")
      .select("id")
      .eq("gathering_id", gatheringId)
      .eq("user_id", userId)
      .eq("status", "reserved")
      .maybeSingle(),
    supabase
      .from("gathering_attendance")
      .select("id")
      .eq("gathering_id", gatheringId)
      .eq("user_id", userId)
      .maybeSingle(),
    supabase
      .from("tickets")
      .select("id")
      .eq("event_id", gatheringId)
      .eq("user_id", userId)
      .eq("status", "confirmed")
      .maybeSingle(),
  ]);

  return !!(seat.data || attended.data || ticket.data);
}

export async function requireConfirmedGatheringParticipant(
  gatheringId: string,
): Promise<{ ok: true; userId: string } | { ok: false; error: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Sign in to continue." };

  const allowed = await isConfirmedGatheringParticipant(gatheringId, user.id);
  if (!allowed) {
    return {
      ok: false,
      error: "Only women who are going or who went can leave notes, flowers, or comments here.",
    };
  }
  return { ok: true, userId: user.id };
}
