import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import { db } from "../supabase.js";

// ── Yande Memory Layer ────────────────────────────────────────────────────────
// Persistent context about each member: interests, life stage, personality.
// Every draft tool reads this automatically when use_memory: true.

export const memoryTools: Tool[] = [
  {
    name: "get_member_context",
    description:
      "Fetch Yande's saved context for a member: interests, life stage, social comfort, group size preference, neighborhoods, relationship stage, and freeform notes. Returns empty object if no context exists yet.",
    inputSchema: {
      type: "object",
      required: ["user_id"],
      properties: {
        user_id: { type: "string", description: "Member UUID" },
      },
    },
  },
  {
    name: "set_member_context",
    description:
      "Create or update Yande's context for a member. Only the fields you provide are updated — others are left unchanged. Use this to record what you learn about a member over time.",
    inputSchema: {
      type: "object",
      required: ["user_id"],
      properties: {
        user_id:            { type: "string" },
        interests:          { type: "array", items: { type: "string" }, description: "e.g. ['museums','pottery','wellness']" },
        life_stage:         { type: "string", enum: ["new_in_city","settled","relocating","exploring","transitioning"] },
        social_comfort:     { type: "string", enum: ["shy","introvert","ambivert","extrovert"] },
        group_size_pref:    { type: "string", enum: ["small","medium","large","any"] },
        neighborhoods:      { type: "array", items: { type: "string" } },
        relationship_stage: { type: "string", enum: ["stranger","new_friend","friend","close_friend","club_member","host"] },
        notes:              { type: "string", description: "Freeform notes about this person (appended to existing, not replaced)" },
      },
    },
  },
  {
    name: "enrich_member_context",
    description:
      "Auto-derive and save context for a member from their existing BloomBay data: interests from club memberships and event attendance, life stage from join date, relationship stage from activity. Saves to yande_user_context. Returns the enriched context.",
    inputSchema: {
      type: "object",
      required: ["user_id"],
      properties: {
        user_id: { type: "string" },
      },
    },
  },
];

type Args = Record<string, unknown>;

export async function handleMemoryTool(
  name: string,
  args: Args
): Promise<{ content: { type: "text"; text: string }[] }> {
  const text = await dispatch(name, args);
  return { content: [{ type: "text", text }] };
}

async function dispatch(name: string, args: Args): Promise<string> {
  switch (name) {
    case "get_member_context":    return getMemberContext(args);
    case "set_member_context":    return setMemberContext(args);
    case "enrich_member_context": return enrichMemberContext(args);
    default: return `Unknown memory tool: ${name}`;
  }
}

async function getMemberContext(args: Args): Promise<string> {
  const { data, error } = await db
    .from("yande_user_context")
    .select("*")
    .eq("user_id", args.user_id as string)
    .maybeSingle();

  if (error) return `Error: ${error.message}`;
  if (!data) return "No context saved for this member yet. Use set_member_context or enrich_member_context to build it.";

  return JSON.stringify(data, null, 2);
}

async function setMemberContext(args: Args): Promise<string> {
  const userId = args.user_id as string;

  // Fetch existing context so we can append notes rather than replace
  const { data: existing } = await db
    .from("yande_user_context")
    .select("notes")
    .eq("user_id", userId)
    .maybeSingle();

  const updates: Record<string, unknown> = { user_id: userId, last_updated: new Date().toISOString() };

  if (args.interests !== undefined)          updates.interests = args.interests;
  if (args.life_stage !== undefined)         updates.life_stage = args.life_stage;
  if (args.social_comfort !== undefined)     updates.social_comfort = args.social_comfort;
  if (args.group_size_pref !== undefined)    updates.group_size_pref = args.group_size_pref;
  if (args.neighborhoods !== undefined)      updates.neighborhoods = args.neighborhoods;
  if (args.relationship_stage !== undefined) updates.relationship_stage = args.relationship_stage;

  // Notes: append to existing rather than replace
  if (args.notes) {
    const existingNotes = existing?.notes ?? "";
    const timestamp = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    updates.notes = existingNotes
      ? `${existingNotes}\n[${timestamp}] ${args.notes}`
      : `[${timestamp}] ${args.notes}`;
  }

  const { data, error } = await db
    .from("yande_user_context")
    .upsert(updates, { onConflict: "user_id" })
    .select()
    .single();

  if (error) return `Error: ${error.message}`;
  return `✓ Context saved for member.\n\n${JSON.stringify(data, null, 2)}`;
}

async function enrichMemberContext(args: Args): Promise<string> {
  const userId = args.user_id as string;
  const now = new Date();
  const monthAgo = new Date(now.getTime() - 30 * 86400_000).toISOString();

  // Gather data from multiple sources in parallel
  const [profile, clubMemberships, reservations, girlmate] = await Promise.all([
    db.from("profiles")
      .select("created_at, city, role")
      .eq("id", userId)
      .maybeSingle(),
    db.from("club_memberships")
      .select("club_slug, clubs(category, name)")
      .eq("user_id", userId),
    db.from("seat_reservations")
      .select("id, created_at")
      .eq("user_id", userId),
    db.from("girlmate_profiles")
      .select("neighborhoods, tags, budget_min, budget_max, pets, smoking")
      .eq("user_id", userId)
      .maybeSingle(),
  ]);

  const p = profile.data;
  if (!p) return "Member not found.";

  // Derive interests from club categories + names
  const clubData = (clubMemberships.data ?? []) as unknown as Array<{ club_slug: string; clubs: { category: string; name: string } | null }>;
  const interests: string[] = [];
  const seenCategories = new Set<string>();
  clubData.forEach(cm => {
    const cat = cm.clubs?.category;
    if (cat && !seenCategories.has(cat)) { interests.push(cat); seenCategories.add(cat); }
  });

  // Add girlmate lifestyle tags
  const gmTags = (girlmate.data?.tags as string[] | null) ?? [];
  gmTags.forEach(t => { if (!interests.includes(t)) interests.push(t); });

  // Derive life stage from join date and city
  const joinedMonthsAgo = (now.getTime() - new Date(p.created_at).getTime()) / (30 * 86400_000);
  const life_stage =
    joinedMonthsAgo < 2 ? "new_in_city" :
    joinedMonthsAgo < 8 ? "exploring" :
    "settled";

  // Derive relationship stage from event attendance frequency
  const totalReservations = reservations.data?.length ?? 0;
  const recentReservations = (reservations.data ?? []).filter(r => r.created_at >= monthAgo).length;
  const relationship_stage =
    totalReservations === 0           ? "stranger" :
    totalReservations <= 2            ? "new_friend" :
    recentReservations === 0          ? "friend" :  // was active, less so now
    totalReservations >= 10           ? "close_friend" :
    "friend";

  // Neighborhoods from girlmate profile
  const neighborhoods: string[] = (girlmate.data?.neighborhoods as string[] | null) ?? [];

  // Derive group_size_pref from event capacity patterns (small clubs = small pref)
  const clubCount = clubData.length;
  const group_size_pref = clubCount === 0 ? "any" : clubCount <= 2 ? "small" : "medium";

  // Compose enriched context
  const enriched = {
    user_id: userId,
    interests: interests.slice(0, 8),
    life_stage,
    relationship_stage,
    neighborhoods,
    group_size_pref,
    last_updated: now.toISOString(),
  };

  const { data, error } = await db
    .from("yande_user_context")
    .upsert(enriched, { onConflict: "user_id" })
    .select()
    .single();

  if (error) return `Error saving enriched context: ${error.message}`;

  const summary = [
    `✓ Context enriched for member from existing data:`,
    `  Interests derived: ${interests.join(", ") || "none found"}`,
    `  Life stage: ${life_stage} (joined ${Math.round(joinedMonthsAgo)} months ago)`,
    `  Relationship stage: ${relationship_stage} (${totalReservations} total reservations)`,
    `  Neighborhoods: ${neighborhoods.join(", ") || "not set"}`,
    `  Group size preference: ${group_size_pref}`,
  ].join("\n");

  return `${summary}\n\nFull context:\n${JSON.stringify(data, null, 2)}`;
}
