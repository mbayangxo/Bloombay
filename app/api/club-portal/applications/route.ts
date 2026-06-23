// GET  /api/club-portal/applications  – list applications for owner's club
// PATCH /api/club-portal/applications  – update status (accepted | rejected)

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

async function getOwnerClubId(supabase: Awaited<ReturnType<typeof createClient>>, userId: string) {
  const { data } = await supabase.from("clubs").select("id").eq("owner_id", userId).maybeSingle();
  return data?.id as string | null;
}

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const clubId = await getOwnerClubId(supabase, user.id);
  if (!clubId) return NextResponse.json({ error: "No club" }, { status: 404 });

  const { data: apps } = await supabase
    .from("club_applications")
    .select("id, user_id, status, message, created_at")
    .eq("club_id", clubId)
    .order("created_at", { ascending: false });

  if (!apps?.length) return NextResponse.json([]);

  const userIds = [...new Set(apps.map(a => a.user_id))];
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, full_name, first_name, avatar_url, neighborhood, bio")
    .in("id", userIds);

  const pm = new Map((profiles ?? []).map(p => [p.id, p]));

  return NextResponse.json(apps.map(a => ({
    id: a.id,
    user_id: a.user_id,
    status: a.status,
    message: a.message,
    created_at: a.created_at,
    profile: pm.get(a.user_id) ?? null,
  })));
}

export async function PATCH(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const clubId = await getOwnerClubId(supabase, user.id);
  if (!clubId) return NextResponse.json({ error: "No club" }, { status: 404 });

  const body = await req.json();
  const { application_id, status } = body as { application_id: string; status: string };

  if (!application_id || !["accepted", "rejected"].includes(status)) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  // Verify ownership
  const { data: app } = await supabase
    .from("club_applications")
    .select("user_id")
    .eq("id", application_id)
    .eq("club_id", clubId)
    .maybeSingle();

  if (!app) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await supabase
    .from("club_applications")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", application_id);

  if (status === "accepted") {
    const { data: club } = await supabase.from("clubs").select("slug").eq("id", clubId).maybeSingle();
    await supabase.from("club_memberships").upsert(
      { user_id: app.user_id, club_id: clubId, club_slug: club?.slug ?? null, joined_at: new Date().toISOString() },
      { onConflict: "user_id,club_id", ignoreDuplicates: true },
    );
    // Notify applicant
    await supabase.from("yande_messages").insert({
      user_id: app.user_id,
      message_type: "club_accepted",
      subject: "You're in.",
      body: "Your application was accepted. Welcome to the club.",
      is_read: false,
    }).select().maybeSingle();
  }

  return NextResponse.json({ ok: true });
}
