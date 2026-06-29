// GET  /api/club-portal/applications  – list applications for owner's club
// PATCH /api/club-portal/applications  – update status (approved | denied)

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

async function getOwnerClub(supabase: Awaited<ReturnType<typeof createClient>>, userId: string) {
  const { data } = await supabase
    .from("clubs")
    .select("id, slug")
    .eq("owner_id", userId)
    .maybeSingle();
  return data as { id: string; slug: string } | null;
}

function normalizeDecision(status: string): "approved" | "denied" | null {
  if (status === "approved" || status === "accepted") return "approved";
  if (status === "denied" || status === "rejected") return "denied";
  return null;
}

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const club = await getOwnerClub(supabase, user.id);
  if (!club?.slug) return NextResponse.json({ error: "No club" }, { status: 404 });

  const statusFilter = new URL(req.url).searchParams.get("status") ?? "pending";

  let query = supabase
    .from("club_applications")
    .select("id, user_id, status, why, applicant_name, city, instagram, created_at")
    .eq("club_slug", club.slug)
    .order("created_at", { ascending: false });

  if (statusFilter !== "all") {
    query = query.eq("status", statusFilter);
  }

  const { data: apps } = await query;

  if (!apps?.length) return NextResponse.json([]);

  const userIds = [...new Set(apps.map((a) => a.user_id))];
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, full_name, first_name, avatar_url, neighborhood, bio")
    .in("id", userIds);

  const pm = new Map((profiles ?? []).map((p) => [p.id, p]));

  return NextResponse.json(
    apps.map((a) => ({
      id: a.id,
      user_id: a.user_id,
      status: a.status,
      message: a.why ?? "",
      applicant_name: a.applicant_name,
      city: a.city,
      instagram: a.instagram,
      created_at: a.created_at,
      name: a.applicant_name,
      applied_at: a.created_at,
      profile: pm.get(a.user_id) ?? null,
    })),
  );
}

export async function PATCH(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const club = await getOwnerClub(supabase, user.id);
  if (!club?.slug) return NextResponse.json({ error: "No club" }, { status: 404 });

  const body = await req.json();
  const { application_id, status } = body as { application_id: string; status: string };

  const decision = normalizeDecision(status);
  if (!application_id || !decision) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const { data: app } = await supabase
    .from("club_applications")
    .select("user_id")
    .eq("id", application_id)
    .eq("club_slug", club.slug)
    .maybeSingle();

  if (!app) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await supabase
    .from("club_applications")
    .update({ status: decision, reviewed_at: new Date().toISOString() })
    .eq("id", application_id);

  if (decision === "approved") {
    await supabase.from("club_memberships").upsert(
      {
        user_id: app.user_id,
        club_slug: club.slug,
        joined_at: new Date().toISOString(),
      },
      { onConflict: "user_id,club_slug", ignoreDuplicates: true },
    );
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
