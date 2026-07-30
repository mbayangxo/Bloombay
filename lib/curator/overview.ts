import { createClient } from "@/lib/supabase/server";

export type CuratorOverview = Awaited<ReturnType<typeof getCuratorOverview>>;

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

/**
 * Real clubs/memberships/applications/gatherings for the curator dashboard,
 * gatherings page, and women page — shared so all three surfaces show the
 * same numbers instead of drifting from separately-written queries.
 */
export async function getCuratorOverview(): Promise<{
  ok: boolean;
  curator: { name: string; neighborhood: string; since: string };
  clubs: { id: string; name: string; color: string; members: number; upcoming: number }[];
  welcomed: { name: string; neighborhood: string; club: string; dateWelcomed: string }[];
  applications: { id: string; name: string; neighborhood: string; club: string; message: string; appliedAt: string }[];
  gatherings: { id: string; name: string; club: string; date: string; venue: string; total: number }[];
  stats: { total_members: number; total_clubs: number; pending_applications: number; upcoming_gatherings: number };
} | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name, first_name, neighborhood, created_at")
    .eq("id", user.id)
    .single();

  const role = profile?.role as string | null;
  if (!role || !["curator", "admin", "founder"].includes(role)) return null;

  const now = new Date().toISOString();

  const [clubsRes, membershipsRes, appsRes, gatheringsRes] = await Promise.all([
    supabase
      .from("clubs")
      .select("id, slug, name, primary_color, tagline, member_limit")
      .order("created_at", { ascending: false })
      .limit(20),
    supabase
      .from("club_memberships")
      .select("user_id, club_slug, joined_at")
      .order("joined_at", { ascending: false })
      .limit(20),
    supabase
      .from("club_applications")
      .select("id, club_slug, user_id, status, why, applicant_name, created_at")
      .eq("status", "pending")
      .order("created_at", { ascending: false })
      .limit(20),
    supabase
      .from("gatherings")
      .select("id, club_slug, title, starts_at, venue, capacity")
      .gte("starts_at", now)
      .order("starts_at", { ascending: true })
      .limit(20),
  ]);

  const clubs = clubsRes.data ?? [];
  const slugToClub = Object.fromEntries(clubs.map((c) => [c.slug as string, c]));
  const clubSlugs = clubs.map((c) => c.slug as string).filter(Boolean);

  const memberCountMap: Record<string, number> = {};
  const upcomingCountMap: Record<string, number> = {};

  if (clubSlugs.length > 0) {
    const { data: memberCounts } = await supabase
      .from("club_memberships")
      .select("club_slug")
      .in("club_slug", clubSlugs);
    (memberCounts ?? []).forEach((m) => {
      const club = slugToClub[m.club_slug as string];
      if (club) memberCountMap[club.id] = (memberCountMap[club.id] ?? 0) + 1;
    });

    const { data: upcomingCounts } = await supabase
      .from("gatherings")
      .select("club_slug")
      .in("club_slug", clubSlugs)
      .gte("starts_at", now);
    (upcomingCounts ?? []).forEach((g) => {
      const club = slugToClub[g.club_slug as string];
      if (club) upcomingCountMap[club.id] = (upcomingCountMap[club.id] ?? 0) + 1;
    });
  }

  const clubNameBySlug = Object.fromEntries(clubs.map((c) => [c.slug, c.name]));

  const memberships = membershipsRes.data ?? [];
  const memberUserIds = [...new Set(memberships.map((m) => m.user_id))];
  let memberProfileMap: Record<string, { full_name: string | null; first_name: string | null; neighborhood: string | null }> = {};
  if (memberUserIds.length > 0) {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, full_name, first_name, neighborhood")
      .in("id", memberUserIds);
    memberProfileMap = Object.fromEntries((profiles ?? []).map((p) => [p.id, p]));
  }

  const apps = appsRes.data ?? [];
  const appUserIds = [...new Set(apps.map((a) => a.user_id))];
  let appProfileMap: Record<string, { full_name: string | null; first_name: string | null; neighborhood: string | null }> = {};
  if (appUserIds.length > 0) {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, full_name, first_name, neighborhood")
      .in("id", appUserIds);
    appProfileMap = Object.fromEntries((profiles ?? []).map((p) => [p.id, p]));
  }

  const curatorSince = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : "";

  return {
    ok: true,
    curator: {
      name: (profile?.full_name as string | null) ?? (profile?.first_name as string | null) ?? "",
      neighborhood: (profile?.neighborhood as string | null) ?? "",
      since: curatorSince,
    },
    clubs: clubs.map((c) => ({
      id: c.id,
      name: c.name,
      color: (c.primary_color as string | null) ?? "#FF1F7D",
      members: memberCountMap[c.id] ?? 0,
      upcoming: upcomingCountMap[c.id] ?? 0,
    })),
    welcomed: memberships.map((m) => {
      const p = memberProfileMap[m.user_id];
      return {
        name: (p?.full_name as string | null) ?? (p?.first_name as string | null) ?? "Member",
        neighborhood: (p?.neighborhood as string | null) ?? "",
        club: clubNameBySlug[m.club_slug as string] ?? "",
        dateWelcomed: ago(m.joined_at),
      };
    }),
    applications: apps.map((a) => {
      const p = appProfileMap[a.user_id];
      return {
        id: a.id,
        name: (p?.full_name as string | null) ?? (p?.first_name as string | null) ?? a.applicant_name ?? "Applicant",
        neighborhood: (p?.neighborhood as string | null) ?? "",
        club: clubNameBySlug[a.club_slug as string] ?? "",
        message: a.why ?? "",
        appliedAt: ago(a.created_at),
      };
    }),
    gatherings: (gatheringsRes.data ?? []).map((g) => ({
      id: g.id,
      name: g.title,
      club: clubNameBySlug[g.club_slug as string] ?? "",
      date: fmtDate(g.starts_at),
      venue: (g.venue as string | null) ?? "",
      total: g.capacity ?? 0,
    })),
    stats: {
      total_members: Object.values(memberCountMap).reduce((a, b) => a + b, 0),
      total_clubs: clubs.length,
      pending_applications: apps.length,
      upcoming_gatherings: (gatheringsRes.data ?? []).length,
    },
  };
}
