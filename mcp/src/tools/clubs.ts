import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import { db, cap, fmt } from "../supabase.js";

export const clubTools: Tool[] = [
  {
    name: "find_clubs",
    description: "List BloomBay clubs with optional filters. Returns name, city, category, member count.",
    inputSchema: {
      type: "object",
      properties: {
        city:     { type: "string", description: "Filter by city" },
        category: { type: "string", description: "e.g. 'fitness', 'arts', 'social'" },
        owner_id: { type: "string", description: "Filter by owner user ID" },
        limit:    { type: "number" },
      },
    },
  },
  {
    name: "get_club",
    description: "Get full details for a specific club including member count and recent activity.",
    inputSchema: {
      type: "object",
      properties: {
        slug: { type: "string", description: "Club slug (URL identifier)" },
        id:   { type: "string", description: "Club UUID" },
      },
    },
  },
  {
    name: "find_inactive_clubs",
    description:
      "Find clubs that have had no gatherings in the last N days. Useful for host outreach.",
    inputSchema: {
      type: "object",
      properties: {
        days:  { type: "number", description: "No gatherings in this many days (default 30)" },
        city:  { type: "string" },
        limit: { type: "number" },
      },
    },
  },
  {
    name: "get_club_members",
    description: "List members of a specific club.",
    inputSchema: {
      type: "object",
      required: ["club_slug"],
      properties: {
        club_slug: { type: "string" },
        limit:     { type: "number" },
      },
    },
  },
  {
    name: "generate_host_report",
    description:
      "Generate a summary report for a club host: member count, total gatherings, avg attendance, last event date, pending applications.",
    inputSchema: {
      type: "object",
      required: ["club_slug"],
      properties: {
        club_slug: { type: "string" },
      },
    },
  },
];

type Args = Record<string, unknown>;

export async function handleClubTool(
  name: string,
  args: Args
): Promise<{ content: { type: "text"; text: string }[] }> {
  const text = await dispatch(name, args);
  return { content: [{ type: "text", text }] };
}

async function dispatch(name: string, args: Args): Promise<string> {
  switch (name) {
    case "find_clubs":          return findClubs(args);
    case "get_club":            return getClub(args);
    case "find_inactive_clubs": return findInactiveClubs(args);
    case "get_club_members":    return getClubMembers(args);
    case "generate_host_report": return generateHostReport(args);
    default: return `Unknown club tool: ${name}`;
  }
}

async function findClubs(args: Args): Promise<string> {
  let q = db
    .from("clubs")
    .select("id, slug, name, city, category, neighborhood, membership_type, created_at, owner_id")
    .order("created_at", { ascending: false })
    .limit(cap(Number(args.limit ?? 20)));

  if (args.city)     q = q.ilike("city", `%${args.city}%`);
  if (args.category) q = q.ilike("category", `%${args.category}%`);
  if (args.owner_id) q = q.eq("owner_id", args.owner_id as string);

  const { data, error } = await q;
  if (error) return `Error: ${error.message}`;

  // Enrich with member counts
  if (data?.length) {
    const slugs = data.map(c => c.slug);
    const { data: counts } = await db
      .from("club_memberships")
      .select("club_slug")
      .in("club_slug", slugs);

    const memberCount: Record<string, number> = {};
    (counts ?? []).forEach(r => {
      memberCount[r.club_slug] = (memberCount[r.club_slug] ?? 0) + 1;
    });

    const enriched = data.map(c => ({ ...c, member_count: memberCount[c.slug] ?? 0 }));
    return fmt(enriched);
  }
  return "No clubs found.";
}

async function getClub(args: Args): Promise<string> {
  if (!args.slug && !args.id) return "Error: provide slug or id";

  let q = db
    .from("clubs")
    .select("id, slug, name, tagline, description, city, neighborhood, category, frequency, capacity, membership_type, instagram, website, created_at, owner_id");

  if (args.slug) q = q.eq("slug", args.slug as string);
  if (args.id)   q = q.eq("id", args.id as string);

  const { data, error } = await q.maybeSingle();
  if (error) return `Error: ${error.message}`;
  if (!data)  return "Club not found.";

  const [members, gatherings, apps] = await Promise.all([
    db.from("club_memberships").select("id", { count: "exact" }).eq("club_slug", data.slug),
    db.from("gatherings").select("id, title, starts_at").eq("club_slug", data.slug).order("starts_at", { ascending: false }).limit(5),
    db.from("club_applications").select("id", { count: "exact" }).eq("club_slug", data.slug).eq("status", "pending"),
  ]);

  return JSON.stringify({
    ...data,
    member_count: members.count ?? 0,
    pending_applications: apps.count ?? 0,
    recent_gatherings: gatherings.data ?? [],
  }, null, 2);
}

async function findInactiveClubs(args: Args): Promise<string> {
  const days = Number(args.days ?? 30);
  const cutoff = new Date(Date.now() - days * 86400_000).toISOString();
  const limit = cap(Number(args.limit ?? 20));

  let clubQ = db
    .from("clubs")
    .select("id, slug, name, city, category, owner_id, created_at")
    .order("created_at", { ascending: false })
    .limit(limit * 3);

  if (args.city) clubQ = clubQ.ilike("city", `%${args.city}%`);

  const { data: clubs, error } = await clubQ;
  if (error) return `Error: ${error.message}`;
  if (!clubs?.length) return "No clubs found.";

  const slugs = clubs.map(c => c.slug);
  const { data: recentGatherings } = await db
    .from("gatherings")
    .select("club_slug")
    .in("club_slug", slugs)
    .gte("starts_at", cutoff);

  const activeSlugs = new Set((recentGatherings ?? []).map(g => g.club_slug));
  const inactive = clubs.filter(c => !activeSlugs.has(c.slug)).slice(0, limit);

  if (!inactive.length) return `All clubs have had a gathering in the last ${days} days.`;
  return `${inactive.length} clubs with no gatherings in the last ${days} days:\n${fmt(inactive)}`;
}

async function getClubMembers(args: Args): Promise<string> {
  const { data, error } = await db
    .from("club_memberships")
    .select("user_id, joined_at, profiles:profiles!user_id(full_name, first_name, email, city)")
    .eq("club_slug", args.club_slug as string)
    .order("joined_at", { ascending: false })
    .limit(cap(Number(args.limit ?? 30)));

  if (error) return `Error: ${error.message}`;
  return fmt(data ?? []);
}

async function generateHostReport(args: Args): Promise<string> {
  const slug = args.club_slug as string;

  const { data: club } = await db
    .from("clubs")
    .select("name, city, category, owner_id, created_at")
    .eq("slug", slug)
    .maybeSingle();

  if (!club) return `Club '${slug}' not found.`;

  const [members, gatherings, pendingApps, allAttendances] = await Promise.all([
    db.from("club_memberships").select("id", { count: "exact" }).eq("club_slug", slug),
    db.from("gatherings").select("id, title, starts_at, capacity, spots_left").eq("club_slug", slug).order("starts_at", { ascending: false }),
    db.from("club_applications").select("id", { count: "exact" }).eq("club_slug", slug).eq("status", "pending"),
    db.from("seat_reservations").select("gathering_id, status").in("gathering_id",
      (await db.from("gatherings").select("id").eq("club_slug", slug)).data?.map(g => g.id) ?? []
    ),
  ]);

  const g = gatherings.data ?? [];
  const now = new Date();
  const past = g.filter(ev => new Date(ev.starts_at) < now);
  const upcoming = g.filter(ev => new Date(ev.starts_at) >= now);

  const reservationsByGathering: Record<string, number> = {};
  (allAttendances.data ?? [])
    .filter(r => r.status === "reserved")
    .forEach(r => { reservationsByGathering[r.gathering_id] = (reservationsByGathering[r.gathering_id] ?? 0) + 1; });

  const totalReservations = Object.values(reservationsByGathering).reduce((a, b) => a + b, 0);
  const avgAttendance = past.length > 0 ? (totalReservations / past.length).toFixed(1) : "N/A";

  return JSON.stringify({
    club: slug,
    name: club.name,
    city: club.city,
    category: club.category,
    member_count: members.count ?? 0,
    total_gatherings: g.length,
    past_gatherings: past.length,
    upcoming_gatherings: upcoming.length,
    avg_reservations_per_gathering: avgAttendance,
    pending_applications: pendingApps.count ?? 0,
    last_gathering: past[0] ? { title: past[0].title, date: past[0].starts_at } : null,
    next_gathering: upcoming[0] ? { title: upcoming[0].title, date: upcoming[0].starts_at } : null,
  }, null, 2);
}
