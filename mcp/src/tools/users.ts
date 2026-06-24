import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import { db, cap, fmt } from "../supabase.js";

export const userTools: Tool[] = [
  {
    name: "find_users",
    description:
      "Search BloomBay members with optional filters. Returns name, email, city, role, verified status, join date, and score fields.",
    inputSchema: {
      type: "object",
      properties: {
        city:          { type: "string", description: "Filter by city (e.g. 'NYC', 'London')" },
        role:          { type: "string", enum: ["member","founder","admin","club_owner","partner","moderator","curator"] },
        verified:      { type: "boolean", description: "Filter by verified status" },
        joined_after:  { type: "string", description: "ISO date — only users who joined after this date" },
        joined_before: { type: "string", description: "ISO date — only users who joined before this date" },
        limit:         { type: "number", description: "Max results (default 20, max 50)" },
      },
    },
  },
  {
    name: "get_user",
    description: "Get full profile for a single BloomBay member by user ID or email address.",
    inputSchema: {
      type: "object",
      properties: {
        id:    { type: "string", description: "User UUID" },
        email: { type: "string", description: "User email address" },
      },
    },
  },
  {
    name: "find_inactive_users",
    description:
      "Find members who signed up but have never reserved a seat at a gathering or attended an event. Good for re-engagement.",
    inputSchema: {
      type: "object",
      properties: {
        city:           { type: "string" },
        min_days_since: { type: "number", description: "Only users who joined at least N days ago (default 14)" },
        limit:          { type: "number" },
      },
    },
  },
  {
    name: "get_user_activity",
    description:
      "Get activity summary for a user: events attended, gatherings reserved, clubs joined, bloom requests sent/received, Girlmate status.",
    inputSchema: {
      type: "object",
      required: ["user_id"],
      properties: {
        user_id: { type: "string", description: "User UUID" },
      },
    },
  },
  {
    name: "find_new_members",
    description: "Find recently joined members, optionally filtered by city.",
    inputSchema: {
      type: "object",
      properties: {
        days:  { type: "number", description: "Joined in the last N days (default 7)" },
        city:  { type: "string" },
        limit: { type: "number" },
      },
    },
  },
];

type Args = Record<string, unknown>;

export async function handleUserTool(
  name: string,
  args: Args
): Promise<{ content: { type: "text"; text: string }[] }> {
  const text = await dispatch(name, args);
  return { content: [{ type: "text", text }] };
}

async function dispatch(name: string, args: Args): Promise<string> {
  switch (name) {
    case "find_users":        return findUsers(args);
    case "get_user":          return getUser(args);
    case "find_inactive_users": return findInactiveUsers(args);
    case "get_user_activity": return getUserActivity(args);
    case "find_new_members":  return findNewMembers(args);
    default: return `Unknown user tool: ${name}`;
  }
}

async function findUsers(args: Args): Promise<string> {
  let q = db
    .from("profiles")
    .select("id, full_name, first_name, email, city, role, verified, verification_status, bloom_points, trust_score, attendance_score, created_at")
    .order("created_at", { ascending: false })
    .limit(cap(Number(args.limit ?? 20)));

  if (args.city)          q = q.ilike("city", `%${args.city}%`);
  if (args.role)          q = q.eq("role", args.role as string);
  if (typeof args.verified === "boolean") q = q.eq("verified", args.verified);
  if (args.joined_after)  q = q.gte("created_at", args.joined_after as string);
  if (args.joined_before) q = q.lte("created_at", args.joined_before as string);

  const { data, error } = await q;
  if (error) return `Error: ${error.message}`;
  return fmt(data ?? []);
}

async function getUser(args: Args): Promise<string> {
  if (!args.id && !args.email) return "Error: provide id or email";

  let q = db
    .from("profiles")
    .select("id, full_name, first_name, email, phone, city, neighborhood, borough, role, verified, verification_status, host_level, trust_score, attendance_score, community_score, bloom_points, onboarding_completed, bio, created_at");

  if (args.id)    q = q.eq("id", args.id as string);
  if (args.email) q = q.eq("email", args.email as string);

  const { data, error } = await q.maybeSingle();
  if (error) return `Error: ${error.message}`;
  if (!data)  return "User not found.";
  return JSON.stringify(data, null, 2);
}

async function findInactiveUsers(args: Args): Promise<string> {
  const days = Number(args.min_days_since ?? 14);
  const cutoff = new Date(Date.now() - days * 86400_000).toISOString();
  const limit = cap(Number(args.limit ?? 20));

  // Users who joined before cutoff and have no seat reservations
  let q = db
    .from("profiles")
    .select("id, full_name, email, city, created_at")
    .eq("role", "member")
    .lte("created_at", cutoff)
    .order("created_at", { ascending: false })
    .limit(limit * 3); // over-fetch to allow filtering

  if (args.city) q = q.ilike("city", `%${args.city}%`);

  const { data: users, error } = await q;
  if (error) return `Error: ${error.message}`;
  if (!users?.length) return "No users found.";

  const ids = users.map(u => u.id);

  const { data: active } = await db
    .from("seat_reservations")
    .select("user_id")
    .in("user_id", ids);

  const activeSet = new Set((active ?? []).map(r => r.user_id));
  const inactive = users.filter(u => !activeSet.has(u.id)).slice(0, limit);

  if (!inactive.length) return "All matched users have at least one reservation.";
  return `${inactive.length} inactive users (joined 14+ days ago, never reserved a seat):\n${fmt(inactive)}`;
}

async function getUserActivity(args: Args): Promise<string> {
  const uid = args.user_id as string;

  const [profile, reservations, attended, memberships, girlmate, pitches] =
    await Promise.all([
      db.from("profiles").select("full_name, email, city, role, verified, bloom_points, trust_score, created_at").eq("id", uid).maybeSingle(),
      db.from("seat_reservations").select("id, status, created_at", { count: "exact" }).eq("user_id", uid),
      db.from("event_attendees").select("event_id", { count: "exact" }).eq("user_id", uid),
      db.from("club_memberships").select("club_slug, joined_at").eq("user_id", uid),
      db.from("girlmate_profiles").select("is_active, neighborhoods, budget_min, budget_max").eq("user_id", uid).maybeSingle(),
      db.from("magazine_pitches").select("id, section, headline, status, created_at").eq("submitted_by", uid),
    ]);

  const p = profile.data;
  if (!p) return "User not found.";

  return JSON.stringify({
    profile: p,
    gathering_reservations: reservations.count ?? 0,
    events_attended: attended.count ?? 0,
    clubs: memberships.data ?? [],
    girlmate: girlmate.data ?? null,
    magazine_pitches: pitches.data ?? [],
  }, null, 2);
}

async function findNewMembers(args: Args): Promise<string> {
  const days = Number(args.days ?? 7);
  const cutoff = new Date(Date.now() - days * 86400_000).toISOString();

  let q = db
    .from("profiles")
    .select("id, full_name, first_name, email, city, verified, onboarding_completed, created_at")
    .eq("role", "member")
    .gte("created_at", cutoff)
    .order("created_at", { ascending: false })
    .limit(cap(Number(args.limit ?? 25)));

  if (args.city) q = q.ilike("city", `%${args.city}%`);

  const { data, error } = await q;
  if (error) return `Error: ${error.message}`;
  return `${data?.length ?? 0} new members in the last ${days} days:\n${fmt(data ?? [])}`;
}
