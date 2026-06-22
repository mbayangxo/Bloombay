// POST /api/member/scan
// Called when a member scans another member's QR bloomie code.
// Records the scan, updates streak, awards milestone stamps.

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const STREAK_WINDOW_DAYS = 7;
const MILESTONE_STAMPS: Record<number, string> = {
  3:  "Three Meets 🌸",
  7:  "Seven Connections ✦",
  10: "Ten Together 💐",
};

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const { scanned_user_id, event_id } = body as { scanned_user_id?: string; event_id?: string };

  if (!scanned_user_id || typeof scanned_user_id !== "string") {
    return NextResponse.json({ error: "scanned_user_id required" }, { status: 400 });
  }
  if (scanned_user_id === user.id) {
    return NextResponse.json({ error: "Cannot scan yourself" }, { status: 400 });
  }

  // Record the scan
  await supabase.from("friend_scans").insert({
    initiator_id: user.id,
    scanned_id: scanned_user_id,
    event_id: event_id ?? null,
  });

  // Canonical pair order
  const [ua, ub] = [user.id, scanned_user_id].sort();

  // Fetch current streak
  const { data: existing } = await supabase
    .from("bloom_scan_streaks")
    .select("streak_count, last_scan_at, longest_streak")
    .eq("user_a", ua)
    .eq("user_b", ub)
    .maybeSingle();

  const now = new Date();
  let newStreak = 1;
  let longestStreak = 1;

  if (existing) {
    const daysSinceLast = (now.getTime() - new Date(existing.last_scan_at).getTime()) / 86400000;
    newStreak = daysSinceLast <= STREAK_WINDOW_DAYS ? existing.streak_count + 1 : 1;
    longestStreak = Math.max(existing.longest_streak, newStreak);
  }

  // Upsert streak
  await supabase.from("bloom_scan_streaks").upsert({
    user_a: ua,
    user_b: ub,
    streak_count: newStreak,
    last_scan_at: now.toISOString(),
    longest_streak: longestStreak,
    updated_at: now.toISOString(),
  }, { onConflict: "user_a,user_b" });

  // Update friendship_scores.friend_scan_count
  const { data: fsRow } = await supabase
    .from("friendship_scores")
    .select("friend_scan_count, co_attendance_count")
    .eq("user_a", ua)
    .eq("user_b", ub)
    .maybeSingle();

  if (fsRow) {
    const newScanCount = (fsRow.friend_scan_count ?? 0) + 1;
    await supabase
      .from("friendship_scores")
      .update({
        friend_scan_count: newScanCount,
        score: (fsRow.co_attendance_count ?? 0) * 10 + newScanCount * 25,
        updated_at: now.toISOString(),
      })
      .eq("user_a", ua)
      .eq("user_b", ub);
  } else {
    await supabase.from("friendship_scores").upsert({
      user_a: ua,
      user_b: ub,
      friend_scan_count: 1,
      co_attendance_count: 0,
      score: 25,
      last_seen_together: now.toISOString(),
      updated_at: now.toISOString(),
    }, { onConflict: "user_a,user_b" });
  }

  // Award milestone stamp if applicable
  let milestoneStamp: string | null = null;
  if (MILESTONE_STAMPS[newStreak]) {
    milestoneStamp = MILESTONE_STAMPS[newStreak];

    // Check if already awarded to avoid duplicates
    const { data: existingStamp } = await supabase
      .from("member_stamps")
      .select("id")
      .eq("user_id", user.id)
      .eq("label", milestoneStamp)
      .maybeSingle();

    if (!existingStamp) {
      await supabase.from("member_stamps").insert({
        user_id: user.id,
        label: milestoneStamp,
      });
      // Also award to the other person
      await supabase.from("member_stamps").insert({
        user_id: scanned_user_id,
        label: milestoneStamp,
      });
    }
  }

  // Get scanned user's profile for the response
  const { data: scannedProfile } = await supabase
    .from("profiles")
    .select("first_name, full_name, avatar_url")
    .eq("id", scanned_user_id)
    .maybeSingle();

  const displayName = scannedProfile?.first_name || scannedProfile?.full_name?.split(" ")[0] || "Her";

  return NextResponse.json({
    ok: true,
    streak: newStreak,
    longest_streak: longestStreak,
    milestone_stamp: milestoneStamp,
    scanned_name: displayName,
    scanned_avatar: scannedProfile?.avatar_url ?? null,
  });
}
