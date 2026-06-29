// GET /api/club-portal/members
// Returns member list for the authenticated club owner's club.

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: club } = await supabase.from("clubs").select("id, slug").eq("owner_id", user.id).maybeSingle();
  if (!club?.slug) return NextResponse.json({ error: "No club" }, { status: 404 });

  const { data: memberships } = await supabase
    .from("club_memberships")
    .select("user_id, joined_at")
    .eq("club_slug", club.slug)
    .order("joined_at", { ascending: true });

  if (!memberships?.length) return NextResponse.json([]);

  const userIds = memberships.map(m => m.user_id);
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, full_name, first_name, avatar_url, neighborhood")
    .in("id", userIds);

  const pm = new Map((profiles ?? []).map(p => [p.id, p]));

  return NextResponse.json(memberships.map(m => {
    const p = pm.get(m.user_id);
    const joinedAt = m.joined_at;
    return {
      user_id: m.user_id,
      name: (p?.full_name as string | null) ?? (p?.first_name as string | null) ?? "Member",
      neighborhood: (p?.neighborhood as string | null) ?? "",
      avatar_url: (p?.avatar_url as string | null) ?? null,
      joined_at: joinedAt,
      joined_label: joinedAt ? new Date(joinedAt).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "",
    };
  }));
}
