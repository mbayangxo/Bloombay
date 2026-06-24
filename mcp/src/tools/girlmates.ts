import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import { db, cap, fmt } from "../supabase.js";

export const girlmateTools: Tool[] = [
  {
    name: "find_girlmate_listings",
    description:
      "Search active Girlmate roommate listings. Filter by neighborhood, budget range, or active status.",
    inputSchema: {
      type: "object",
      properties: {
        neighborhood: { type: "string", description: "Partial match on any neighborhood in their list" },
        budget_min:   { type: "number", description: "Minimum monthly budget (USD)" },
        budget_max:   { type: "number", description: "Maximum monthly budget (USD)" },
        active_only:  { type: "boolean", description: "Only return active listings (default true)" },
        limit:        { type: "number" },
      },
    },
  },
  {
    name: "get_girlmate",
    description: "Get full Girlmate profile for a specific user.",
    inputSchema: {
      type: "object",
      required: ["user_id"],
      properties: {
        user_id: { type: "string", description: "User UUID" },
      },
    },
  },
  {
    name: "find_stale_girlmate_listings",
    description:
      "Find Girlmate profiles that haven't been updated in N days — good for reviewing whether listings are still active.",
    inputSchema: {
      type: "object",
      properties: {
        days:  { type: "number", description: "Not updated in this many days (default 60)" },
        limit: { type: "number" },
      },
    },
  },
  {
    name: "suggest_girlmate_matches",
    description:
      "Find compatible Girlmate profiles for a user based on overlapping neighborhoods and compatible budget.",
    inputSchema: {
      type: "object",
      required: ["user_id"],
      properties: {
        user_id: { type: "string", description: "User UUID to find matches for" },
        limit:   { type: "number" },
      },
    },
  },
];

type Args = Record<string, unknown>;

export async function handleGirlmateTool(
  name: string,
  args: Args
): Promise<{ content: { type: "text"; text: string }[] }> {
  const text = await dispatch(name, args);
  return { content: [{ type: "text", text }] };
}

async function dispatch(name: string, args: Args): Promise<string> {
  switch (name) {
    case "find_girlmate_listings":   return findGirlmateListings(args);
    case "get_girlmate":             return getGirlmate(args);
    case "find_stale_girlmate_listings": return findStaleListings(args);
    case "suggest_girlmate_matches": return suggestMatches(args);
    default: return `Unknown girlmate tool: ${name}`;
  }
}

async function findGirlmateListings(args: Args): Promise<string> {
  const activeOnly = args.active_only !== false;

  let q = db
    .from("girlmate_profiles")
    .select(`
      id, user_id, neighborhoods, budget_min, budget_max, move_in_date,
      bio, lifestyle_tags, pets, smoking, is_active, created_at,
      profile:profiles!user_id(full_name, first_name, city, verified)
    `)
    .order("created_at", { ascending: false })
    .limit(cap(Number(args.limit ?? 25)));

  if (activeOnly) q = q.eq("is_active", true);
  if (typeof args.budget_min === "number") q = q.gte("budget_max", args.budget_min);
  if (typeof args.budget_max === "number") q = q.lte("budget_min", args.budget_max);

  const { data, error } = await q;
  if (error) return `Error: ${error.message}`;

  // Client-side neighborhood filter (array contains)
  let results = data ?? [];
  if (args.neighborhood) {
    const needle = (args.neighborhood as string).toLowerCase();
    results = results.filter(r =>
      (r.neighborhoods ?? []).some((n: string) => n.toLowerCase().includes(needle))
    );
  }

  if (!results.length) return "No Girlmate listings match the filters.";
  return fmt(results);
}

async function getGirlmate(args: Args): Promise<string> {
  const { data, error } = await db
    .from("girlmate_profiles")
    .select(`
      id, user_id, neighborhoods, budget_min, budget_max, move_in_date,
      bio, lifestyle_tags, pets, smoking, is_active, created_at,
      profile:profiles!user_id(full_name, first_name, email, city, neighborhood, verified, bloom_points)
    `)
    .eq("user_id", args.user_id as string)
    .maybeSingle();

  if (error) return `Error: ${error.message}`;
  if (!data)  return "No Girlmate profile found for this user.";
  return JSON.stringify(data, null, 2);
}

async function findStaleListings(args: Args): Promise<string> {
  const days = Number(args.days ?? 60);
  const cutoff = new Date(Date.now() - days * 86400_000).toISOString();

  const { data, error } = await db
    .from("girlmate_profiles")
    .select(`
      id, user_id, neighborhoods, budget_min, budget_max, is_active, created_at,
      profile:profiles!user_id(full_name, email, city)
    `)
    .eq("is_active", true)
    .lte("created_at", cutoff)
    .order("created_at", { ascending: true })
    .limit(cap(Number(args.limit ?? 25)));

  if (error) return `Error: ${error.message}`;
  if (!data?.length) return `No stale listings found (active profiles created 60+ days ago).`;
  return `${data.length} active Girlmate listings not updated in ${days}+ days:\n${fmt(data)}`;
}

async function suggestMatches(args: Args): Promise<string> {
  const { data: target, error } = await db
    .from("girlmate_profiles")
    .select("user_id, neighborhoods, budget_min, budget_max, lifestyle_tags, pets, smoking")
    .eq("user_id", args.user_id as string)
    .maybeSingle();

  if (error) return `Error: ${error.message}`;
  if (!target) return "No Girlmate profile found for this user.";

  const { data: candidates } = await db
    .from("girlmate_profiles")
    .select(`
      user_id, neighborhoods, budget_min, budget_max, lifestyle_tags, pets, smoking, bio,
      profile:profiles!user_id(full_name, first_name, city)
    `)
    .eq("is_active", true)
    .neq("user_id", args.user_id as string)
    .limit(100);

  if (!candidates?.length) return "No other active Girlmate listings to compare.";

  type Candidate = typeof candidates[number] & { score?: number; shared_neighborhoods?: string[] };

  const scored: (Candidate & { score: number; shared_neighborhoods: string[] })[] = candidates
    .map(c => {
      const sharedNeighborhoods = (target.neighborhoods ?? []).filter((n: string) =>
        (c.neighborhoods ?? []).includes(n)
      );
      const budgetOverlap =
        (target.budget_min ?? 0) <= (c.budget_max ?? 99999) &&
        (c.budget_min ?? 0) <= (target.budget_max ?? 99999);
      const petMatch = target.pets === c.pets;
      const smokingMatch = target.smoking === c.smoking;
      const sharedTags = (target.lifestyle_tags ?? []).filter((t: string) =>
        (c.lifestyle_tags ?? []).includes(t)
      ).length;

      const score =
        sharedNeighborhoods.length * 30 +
        (budgetOverlap ? 25 : 0) +
        (petMatch ? 10 : 0) +
        (smokingMatch ? 10 : 0) +
        sharedTags * 5;

      return { ...c, score, shared_neighborhoods: sharedNeighborhoods };
    })
    .filter(c => c.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, cap(Number(args.limit ?? 10)));

  if (!scored.length) return "No compatible matches found based on neighborhood and budget overlap.";
  return `Top ${scored.length} Girlmate matches:\n${fmt(scored)}`;
}
