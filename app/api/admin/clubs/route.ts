// GET /api/admin/clubs
// Returns all clubs with member counts and owner info for admin dashboard.

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
  if (!["admin", "founder", "curator"].includes(profile?.role ?? "")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { data: clubs } = await supabase
    .from("clubs")
    .select("id, slug, name, tagline, primary_color, membership_type, owner_id, member_limit, category")
    .order("created_at", { ascending: false });

  if (!clubs?.length) return NextResponse.json([]);

  // Get member counts per club
  const { data: allMemberships } = await supabase
    .from("club_memberships")
    .select("club_id");

  const memberCounts: Record<string, number> = {};
  (allMemberships ?? []).forEach(m => {
    memberCounts[m.club_id] = (memberCounts[m.club_id] ?? 0) + 1;
  });

  // Get upcoming gathering counts per club
  const now = new Date().toISOString();
  const { data: upcomingGatherings } = await supabase
    .from("gatherings")
    .select("club_id")
    .gte("starts_at", now);

  const upcomingCounts: Record<string, number> = {};
  (upcomingGatherings ?? []).forEach(g => {
    upcomingCounts[g.club_id] = (upcomingCounts[g.club_id] ?? 0) + 1;
  });

  // Get owner names
  const ownerIds = [...new Set(clubs.map(c => c.owner_id).filter(Boolean))];
  const { data: owners } = ownerIds.length > 0
    ? await supabase.from("profiles").select("id, full_name, first_name").in("id", ownerIds)
    : { data: [] };

  const ownerMap = Object.fromEntries((owners ?? []).map(o => [o.id, (o.full_name as string | null) ?? (o.first_name as string | null) ?? ""]));

  return NextResponse.json(clubs.map(c => ({
    id: c.id,
    slug: c.slug,
    name: c.name,
    tagline: c.tagline,
    color: (c.primary_color as string | null) ?? "#FF1F7D",
    membership_type: c.membership_type ?? "free",
    category: c.category,
    owner_name: ownerMap[c.owner_id] ?? "BloomBay",
    members: memberCounts[c.id] ?? 0,
    upcoming_gatherings: upcomingCounts[c.id] ?? 0,
    member_limit: c.member_limit ?? 0,
  })));
}
