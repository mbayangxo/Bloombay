import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/admin/require-staff";
import { createClient } from "@/lib/supabase/server";

// GET /api/curator/overview
export async function GET(req: NextRequest) {
  const guard = await requireRole(req, ["curator", "admin", "founder"]);
  if (guard.error) return guard.error;

  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name, first_name, neighborhood, created_at")
    .eq("id", guard.user.id)
    .single();

  const now = new Date().toISOString();

  const [clubsRes, membershipsRes, appsRes, gatheringsRes] = await Promise.all([
    supabase
      .from("clubs")
      .select("id, name, primary_color, tagline, member_limit")
      .order("created_at", { ascending: false })
      .limit(20),

    supabase
      .from("club_memberships")
      .select("user_id, club_id, joined_at, created_at")
      .order("created_at", { ascending: false })
      .limit(20),

    supabase
      .from("club_applications")
      .select("id, club_id, user_id, status, message, created_at")
      .eq("status", "pending")
      .order("created_at", { ascending: false })
      .limit(20),

    supabase
      .from("gatherings")
      .select("id, club_id, title, starts_at, venue, capacity")
      .gte("starts_at", now)
      .order("starts_at", { ascending: true })
      .limit(20),
  ]);

  const clubs = clubsRes.data ?? [];
  const clubIds = clubs.map(c => c.id);

  const memberCountMap: Record<string, number> = {};
  const upcomingCountMap: Record<string, number> = {};

  if (clubIds.length > 0) {
    const { data: memberCounts } = await supabase
      .from("club_memberships")
      .select("club_id")
      .in("club_id", clubIds);
    (memberCounts ?? []).forEach(m => {
      memberCountMap[m.club_id] = (memberCountMap[m.club_id] ?? 0) + 1;
    });

    const { data: upcomingCounts } = await supabase
      .from("gatherings")
      .select("club_id")
      .in("club_id", clubIds)
      .gte("starts_at", now);
    (upcomingCounts ?? []).forEach(g => {
      upcomingCountMap[g.club_id] = (upcomingCountMap[g.club_id] ?? 0) + 1;
    });
  }

  const memberships = membershipsRes.data ?? [];
  const memberUserIds = [...new Set(memberships.map(m => m.user_id))];
  let memberProfileMap: Record<string, { full_name: string | null; first_name: string | null; neighborhood: string | null }> = {};
  if (memberUserIds.length > 0) {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, full_name, first_name, neighborhood")
      .in("id", memberUserIds);
    memberProfileMap = Object.fromEntries((profiles ?? []).map(p => [p.id, p]));
  }

  const apps = appsRes.data ?? [];
  const appUserIds = [...new Set(apps.map(a => a.user_id))];
  let appProfileMap: Record<string, { full_name: string | null; first_name: string | null; neighborhood: string | null }> = {};
  if (appUserIds.length > 0) {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, full_name, first_name, neighborhood")
      .in("id", appUserIds);
    appProfileMap = Object.fromEntries((profiles ?? []).map(p => [p.id, p]));
  }

  const clubNameMap = Object.fromEntries(clubs.map(c => [c.id, c.name]));

  function ago(iso: string) {
    const diff = Date.now() - new Date(iso).getTime();
    const h = Math.floor(diff / 3600000);
    const d = Math.floor(diff / 86400000);
    if (h < 1) return "just now";
    if (h < 24) return `${h}h ago`;
    return `${d}d ago`;
  }

  function fmtDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  }

  const curatorSince = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : "";

  return NextResponse.json({
    curator: {
      name: (profile?.full_name as string | null) ?? (profile?.first_name as string | null) ?? "",
      neighborhood: (profile?.neighborhood as string | null) ?? "",
      since: curatorSince,
    },
    clubs: clubs.map(c => ({
      id: c.id,
      name: c.name,
      color: (c.primary_color as string | null) ?? "#FF1F7D",
      members: memberCountMap[c.id] ?? 0,
      upcoming: upcomingCountMap[c.id] ?? 0,
    })),
    welcomed: memberships.map(m => {
      const p = memberProfileMap[m.user_id];
      return {
        name: (p?.full_name as string | null) ?? (p?.first_name as string | null) ?? "Member",
        neighborhood: (p?.neighborhood as string | null) ?? "",
        club: clubNameMap[m.club_id] ?? "",
        dateWelcomed: ago(m.joined_at ?? m.created_at),
      };
    }),
    applications: apps.map(a => {
      const p = appProfileMap[a.user_id];
      return {
        id: a.id,
        name: (p?.full_name as string | null) ?? (p?.first_name as string | null) ?? "Applicant",
        neighborhood: (p?.neighborhood as string | null) ?? "",
        club: clubNameMap[a.club_id] ?? "",
        message: a.message ?? "",
        appliedAt: ago(a.created_at),
      };
    }),
    gatherings: (gatheringsRes.data ?? []).map(g => ({
      id: g.id,
      name: g.title,
      club: clubNameMap[g.club_id] ?? "",
      date: fmtDate(g.starts_at),
      total: g.capacity ?? 0,
    })),
    stats: {
      total_members: Object.values(memberCountMap).reduce((a, b) => a + b, 0),
      total_clubs: clubs.length,
      pending_applications: apps.length,
      upcoming_gatherings: (gatheringsRes.data ?? []).length,
    },
  });
}
