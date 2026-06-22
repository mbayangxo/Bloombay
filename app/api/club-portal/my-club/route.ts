// GET /api/club-portal/my-club
// Returns the authenticated user's owned club with live stats.

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: club } = await supabase
    .from("clubs")
    .select("id, slug, name, tagline, description, primary_color, accent_color, membership_type, member_limit")
    .eq("owner_id", user.id)
    .maybeSingle();

  if (!club) return NextResponse.json({ error: "No club found" }, { status: 404 });

  const [memberRes, pendingRes, upcomingRes, ownerRes] = await Promise.all([
    supabase.from("club_memberships").select("*", { count: "exact", head: true }).eq("club_id", club.id),
    supabase.from("club_applications").select("*", { count: "exact", head: true }).eq("club_id", club.id).eq("status", "pending"),
    supabase.from("gatherings").select("*", { count: "exact", head: true }).eq("club_id", club.id).gte("starts_at", new Date().toISOString()),
    supabase.from("profiles").select("full_name, first_name, avatar_url").eq("id", user.id).maybeSingle(),
  ]);

  const ownerName = (ownerRes.data?.full_name as string | null) ?? (ownerRes.data?.first_name as string | null) ?? "";

  return NextResponse.json({
    id: club.id,
    slug: club.slug,
    name: club.name,
    tagline: club.tagline ?? "",
    description: club.description ?? "",
    primary_color: club.primary_color ?? "#FF1F7D",
    accent_color: club.accent_color ?? "#3a0018",
    membership_type: club.membership_type ?? "free",
    member_limit: club.member_limit ?? 0,
    member_count: memberRes.count ?? 0,
    pending_applications: pendingRes.count ?? 0,
    upcoming_gatherings: upcomingRes.count ?? 0,
    owner_name: ownerName,
    owner_avatar: ownerRes.data?.avatar_url ?? null,
  });
}
