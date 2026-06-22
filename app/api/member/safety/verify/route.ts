import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(req.url);
  const code = url.searchParams.get("code")?.toUpperCase();
  const gatheringId = url.searchParams.get("gatheringId");

  if (!code || !gatheringId) return NextResponse.json({ error: "code and gatheringId required" }, { status: 400 });

  // Resolve bloom code → user
  const suffix = code.replace("BB-", "").toLowerCase();
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, first_name, full_name, avatar_url, neighborhood")
    .ilike("id", `${suffix}%`)
    .maybeSingle();

  if (!profile) return NextResponse.json({ error: "Member not found" }, { status: 404 });

  // Check if on RSVP / attendance list
  const { data: attendance } = await supabase
    .from("gathering_attendance")
    .select("checked_in_at")
    .eq("gathering_id", gatheringId)
    .eq("user_id", profile.id)
    .maybeSingle();

  // Also check event_attendees (open seat RSVPs)
  const { data: eventAttendee } = await supabase
    .from("event_attendees")
    .select("joined_at")
    .eq("user_id", profile.id)
    .maybeSingle();

  const expected = !!(attendance || eventAttendee);
  const already_checked_in = !!attendance?.checked_in_at;
  const name = profile.first_name || profile.full_name?.split(" ")[0] || "Her";

  return NextResponse.json({
    name,
    avatar_url: profile.avatar_url ?? null,
    neighborhood: profile.neighborhood ?? null,
    expected,
    already_checked_in,
    rsvp_status: expected ? "confirmed" : null,
  });
}
