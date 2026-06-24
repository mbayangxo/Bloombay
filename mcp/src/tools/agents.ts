import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import Anthropic from "@anthropic-ai/sdk";
import { db } from "../supabase.js";

// ── Phase 4: Autonomous Yande Agent Tools ─────────────────────────────────────
// These tools gather data from multiple sources and use Claude Sonnet
// (not Haiku) to produce deep, thoughtful analysis reports.
// They don't take actions — they surface insights and draft recommendations.

export const agentTools: Tool[] = [
  {
    name: "run_community_health_check",
    description:
      "Full community pulse report: new members, activity trends, club health, pending issues, and Yande's honest take on what needs attention this week.",
    inputSchema: {
      type: "object",
      properties: {
        city: { type: "string", description: "Narrow to a specific city (default: all)" },
      },
    },
  },
  {
    name: "run_host_coaching",
    description:
      "Deep coaching analysis for a specific club. Surfaces growth opportunities, attendance patterns, member engagement, and honest suggestions for the host.",
    inputSchema: {
      type: "object",
      required: ["club_slug"],
      properties: {
        club_slug: { type: "string" },
      },
    },
  },
  {
    name: "triage_open_reports",
    description:
      "Analyze all pending member reports, safety reports, and support tickets. Prioritizes by urgency, identifies patterns, and drafts suggested responses for each.",
    inputSchema: {
      type: "object",
      properties: {
        limit: { type: "number", description: "Max reports to analyze (default 20)" },
      },
    },
  },
  {
    name: "generate_weekly_digest",
    description:
      "Generate a comprehensive founder-facing weekly digest: community metrics, notable moments, what worked, what needs attention, and recommended actions for next week.",
    inputSchema: {
      type: "object",
      properties: {
        city: { type: "string", description: "Narrow to a specific city (default: all cities)" },
      },
    },
  },
];

type Args = Record<string, unknown>;

export async function handleAgentTool(
  name: string,
  args: Args
): Promise<{ content: { type: "text"; text: string }[] }> {
  const text = await dispatch(name, args);
  return { content: [{ type: "text", text }] };
}

async function dispatch(name: string, args: Args): Promise<string> {
  switch (name) {
    case "run_community_health_check": return communityHealthCheck(args);
    case "run_host_coaching":          return hostCoaching(args);
    case "triage_open_reports":        return triageReports(args);
    case "generate_weekly_digest":     return weeklyDigest(args);
    default: return `Unknown agent tool: ${name}`;
  }
}

async function getSonnet(system: string, userMsg: string, maxTokens = 1200): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return "Error: ANTHROPIC_API_KEY not set.";

  const client = new Anthropic({ apiKey });
  const msg = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: maxTokens,
    system,
    messages: [{ role: "user", content: userMsg }],
  });

  return msg.content[0].type === "text" ? msg.content[0].text.trim() : "";
}

// ── Agent: Community Health Check ─────────────────────────────────────────────

async function communityHealthCheck(args: Args): Promise<string> {
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 86400_000).toISOString();
  const monthAgo = new Date(now.getTime() - 30 * 86400_000).toISOString();
  const cutoff14d = new Date(now.getTime() - 14 * 86400_000).toISOString();

  const [
    totalMembers, newThisWeek,
    upcomingEvents, pastWeekEvents,
    wallPostsWeek,
    pendingReports, openTickets, contentFlags,
    girlmateActive,
    pitchesPending,
  ] = await Promise.all([
    db.from("profiles").select("id", { count: "exact" }).eq("role", "member"),
    db.from("profiles").select("id", { count: "exact" }).eq("role", "member").gte("created_at", weekAgo),
    db.from("events").select("id", { count: "exact" }).gte("date_time", now.toISOString()).eq("is_published", true),
    db.from("events").select("id, title, attending_count, capacity").gte("date_time", weekAgo).lte("date_time", now.toISOString()),
    db.from("wall_posts").select("id", { count: "exact" }).gte("created_at", weekAgo),
    db.from("member_reports").select("id", { count: "exact" }).eq("status", "pending"),
    db.from("support_tickets").select("id", { count: "exact" }).in("status", ["open", "in_progress"]),
    db.from("content_moderation").select("id", { count: "exact" }).eq("verdict", "needs_review"),
    db.from("girlmate_profiles").select("id", { count: "exact" }).eq("is_active", true),
    db.from("magazine_pitches").select("id", { count: "exact" }).eq("status", "pending"),
  ]);

  // Member activity analysis
  const allMemberIds = (await db.from("profiles").select("id").eq("role", "member")).data?.map(p => p.id) ?? [];
  const activeUsers = (await db.from("seat_reservations").select("user_id").gte("created_at", monthAgo)).data ?? [];
  const activeSet = new Set(activeUsers.map(r => r.user_id));
  const inactiveCount = allMemberIds.filter(id => !activeSet.has(id)).length;

  // Top clubs by membership
  const topClubs = (await db.from("club_memberships").select("club_slug")
    .then(({ data }) => {
      const counts: Record<string, number> = {};
      (data ?? []).forEach(r => { counts[r.club_slug] = (counts[r.club_slug] ?? 0) + 1; });
      return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 5);
    }));

  // Members joined but never reserved
  const neverReserved = (await (async () => {
    const { data: recent } = await db.from("profiles")
      .select("id").eq("role", "member").lte("created_at", cutoff14d);
    if (!recent?.length) return 0;
    const ids = recent.map(p => p.id);
    const { data: hasReserved } = await db.from("seat_reservations")
      .select("user_id").in("user_id", ids);
    const reservedSet = new Set((hasReserved ?? []).map(r => r.user_id));
    return ids.filter(id => !reservedSet.has(id)).length;
  })());

  const data = {
    members: { total: totalMembers.count, new_this_week: newThisWeek.count, inactive_30d: inactiveCount, joined_never_attended: neverReserved },
    content: { wall_posts_this_week: wallPostsWeek.count, upcoming_events: upcomingEvents.count, events_last_week: pastWeekEvents.data?.length ?? 0 },
    girlmates: { active_listings: girlmateActive.count },
    magazine: { pending_pitches: pitchesPending.count },
    issues: { pending_reports: pendingReports.count, open_support_tickets: openTickets.count, content_flags: contentFlags.count },
    top_clubs_by_membership: topClubs.map(([slug, count]) => ({ slug, members: count })),
  };

  const report = await getSonnet(
    `You are Yande, BloomBay's AI community manager. You write weekly community health reports for the founder. Be direct, specific, and honest. Celebrate wins, flag concerns clearly. You sound like a smart colleague who actually cares about the community — not a business analyst. Structure your report with clear sections but write in your natural voice.`,
    `Write a community health check based on this week's data:\n${JSON.stringify(data, null, 2)}\n\nCover: overall health, what's going well, what needs attention, and your top 3 recommended actions. Be specific.`,
    1000
  );

  return `🌸 Community Health Check — ${now.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}\n\n${report}`;
}

// ── Agent: Host Coaching ──────────────────────────────────────────────────────

async function hostCoaching(args: Args): Promise<string> {
  const slug = args.club_slug as string;

  const { data: club } = await db.from("clubs")
    .select("name, city, category, owner_id, created_at, tagline, description").eq("slug", slug).maybeSingle();
  if (!club) return `Club '${slug}' not found.`;

  const [members, gatherings, applications, recentReservations] = await Promise.all([
    db.from("club_memberships").select("user_id, joined_at").eq("club_slug", slug),
    db.from("gatherings").select("id, title, starts_at, capacity, spots_left").eq("club_slug", slug).order("starts_at", { ascending: false }).limit(20),
    db.from("club_applications").select("id, status, created_at").eq("club_slug", slug).order("created_at", { ascending: false }).limit(20),
    db.from("seat_reservations").select("user_id, status, created_at")
      .in("gathering_id", (await db.from("gatherings").select("id").eq("club_slug", slug)).data?.map(g => g.id) ?? [])
      .gte("created_at", new Date(Date.now() - 60 * 86400_000).toISOString()),
  ]);

  const now = new Date();
  const g = gatherings.data ?? [];
  const past = g.filter(ev => new Date(ev.starts_at) < now);
  const upcoming = g.filter(ev => new Date(ev.starts_at) >= now);

  const avgFillRate = past.length
    ? (past.reduce((s, ev) => s + (1 - (ev.spots_left ?? 0) / (ev.capacity || 1)), 0) / past.length * 100).toFixed(1)
    : "N/A";

  const memberGrowth = (members.data ?? [])
    .filter(m => new Date(m.joined_at) > new Date(Date.now() - 30 * 86400_000)).length;

  const pendingApps = (applications.data ?? []).filter(a => a.status === "pending").length;
  const approvalRate = applications.data?.length
    ? ((applications.data.filter(a => a.status === "approved").length / applications.data.length) * 100).toFixed(0) + "%"
    : "N/A";

  const data = {
    club: { name: club.name, city: club.city, category: club.category, tagline: club.tagline },
    membership: { total: members.data?.length ?? 0, joined_last_30d: memberGrowth },
    events: {
      total: g.length, past: past.length, upcoming: upcoming.length,
      avg_fill_rate: avgFillRate + "%",
      recent_past: past.slice(0, 5).map(ev => ({ title: ev.title, date: ev.starts_at, fill: `${Math.round((1 - (ev.spots_left ?? 0) / (ev.capacity || 1)) * 100)}%` })),
      next_up: upcoming.slice(0, 3).map(ev => ({ title: ev.title, date: ev.starts_at })),
    },
    applications: { total: applications.data?.length ?? 0, pending: pendingApps, approval_rate: approvalRate },
  };

  const coaching = await getSonnet(
    `You are Yande, BloomBay's host coach. You write honest, warm, actionable coaching notes for club hosts. You speak like a mentor who genuinely wants their clubs to thrive — not like a performance review. Be specific. Acknowledge what's working. Be direct about gaps. End with 2-3 concrete suggestions the host can act on this week.`,
    `Write a coaching session for the host of ${club.name}:\n${JSON.stringify(data, null, 2)}`,
    900
  );

  return `✦ Host Coaching: ${club.name}\n\n${coaching}`;
}

// ── Agent: Triage Open Reports ────────────────────────────────────────────────

async function triageReports(args: Args): Promise<string> {
  const limit = Math.min(Number(args.limit ?? 20), 50);

  const [memberReports, safetyReports, supportTickets] = await Promise.all([
    db.from("member_reports")
      .select("id, reason, details, severity, created_at, reporter:profiles!reporter_id(full_name), reported:profiles!reported_id(full_name)")
      .eq("status", "pending").order("created_at", { ascending: false }).limit(limit),
    db.from("safety_reports")
      .select("id, category, body, created_at, email")
      .eq("status", "open").order("created_at", { ascending: false }).limit(limit),
    db.from("support_tickets")
      .select("id, subject, message, category, needs_human, created_at, user:profiles!user_id(full_name, email)")
      .in("status", ["open", "in_progress"]).order("created_at", { ascending: false }).limit(limit),
  ]);

  const total = (memberReports.data?.length ?? 0) + (safetyReports.data?.length ?? 0) + (supportTickets.data?.length ?? 0);
  if (total === 0) return "All clear — no open reports or tickets right now. ✦";

  const data = {
    member_reports: memberReports.data ?? [],
    safety_reports: safetyReports.data ?? [],
    support_tickets: supportTickets.data ?? [],
  };

  const triage = await getSonnet(
    `You are Yande, BloomBay's safety and support assistant. You triage community reports for the founder. For each item: assess urgency (high/medium/low), identify the core issue, and draft a brief suggested response or resolution path. Group by severity. Be direct — the founder needs to act, not read prose. Format clearly with headers.`,
    `Triage these open reports:\n${JSON.stringify(data, null, 2)}\n\nFor each, give: urgency, what's happening, suggested next action.`,
    1200
  );

  return `🔍 Report Triage — ${total} open items\n\n${triage}`;
}

// ── Agent: Weekly Digest ──────────────────────────────────────────────────────

async function weeklyDigest(args: Args): Promise<string> {
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 86400_000);
  const twoWeeksAgo = new Date(now.getTime() - 14 * 86400_000);

  const [
    newMembers, previousWeekMembers,
    eventsThisWeek, gatheringsThisWeek,
    wallPosts, girlmateListings,
    newClubs, magazinePitches,
    pendingAll,
  ] = await Promise.all([
    db.from("profiles").select("id, city, created_at", { count: "exact" }).eq("role", "member").gte("created_at", weekAgo.toISOString()),
    db.from("profiles").select("id", { count: "exact" }).eq("role", "member").gte("created_at", twoWeeksAgo.toISOString()).lte("created_at", weekAgo.toISOString()),
    db.from("events").select("id, title, attending_count, capacity, city").gte("date_time", weekAgo.toISOString()).lte("date_time", now.toISOString()),
    db.from("gatherings").select("id, title, club_slug, spots_left, capacity").gte("starts_at", weekAgo.toISOString()).lte("starts_at", now.toISOString()),
    db.from("wall_posts").select("id", { count: "exact" }).gte("created_at", weekAgo.toISOString()),
    db.from("girlmate_profiles").select("id", { count: "exact" }).gte("created_at", weekAgo.toISOString()),
    db.from("clubs").select("id, name, city", { count: "exact" }).gte("created_at", weekAgo.toISOString()),
    db.from("magazine_pitches").select("id", { count: "exact" }).gte("created_at", weekAgo.toISOString()),
    Promise.all([
      db.from("member_reports").select("id", { count: "exact" }).eq("status", "pending"),
      db.from("safety_reports").select("id", { count: "exact" }).eq("status", "open"),
      db.from("support_tickets").select("id", { count: "exact" }).in("status", ["open", "in_progress"]),
      db.from("content_moderation").select("id", { count: "exact" }).eq("verdict", "needs_review"),
    ]).then(([mr, sr, st, cf]) => ({
      member_reports: mr.count ?? 0,
      safety_reports: sr.count ?? 0,
      support_tickets: st.count ?? 0,
      content_flags: cf.count ?? 0,
    })),
  ]);

  const memberGrowthDelta = (newMembers.count ?? 0) - (previousWeekMembers.count ?? 0);
  const evData = eventsThisWeek.data ?? [];
  const avgAttendance = evData.length
    ? (evData.reduce((s, e) => s + (e.attending_count ?? 0), 0) / evData.length).toFixed(1)
    : "N/A";

  const data = {
    week_of: weekAgo.toLocaleDateString("en-US", { month: "short", day: "numeric" }) + " – " + now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    growth: { new_members: newMembers.count, vs_previous_week: memberGrowthDelta > 0 ? `+${memberGrowthDelta}` : String(memberGrowthDelta) },
    events: { count: evData.length, avg_attendance: avgAttendance, gatherings: gatheringsThisWeek.data?.length ?? 0 },
    community: { wall_posts: wallPosts.count, new_girlmate_listings: girlmateListings.count, new_clubs: newClubs.count, magazine_pitches: magazinePitches.count },
    pending_review: pendingAll,
    top_events: evData.sort((a, b) => (b.attending_count ?? 0) - (a.attending_count ?? 0)).slice(0, 3).map(e => ({ title: e.title, attendance: e.attending_count, city: e.city })),
    new_clubs: (newClubs.data ?? []).map(c => ({ name: c.name, city: c.city })),
  };

  const digest = await getSonnet(
    `You are Yande, writing the weekly digest for BloomBay's founder. This is a private report — be honest, specific, and direct. Celebrate real wins. Flag real concerns. Think like a COO briefing a CEO: cover what happened, what it means, and what to do next. Format clearly but write with personality. No corporate-speak.`,
    `Write the weekly founder digest:\n${JSON.stringify(data, null, 2)}\n\nCover: growth, community activity, standout moments, issues to address, and your top 3 recommended priorities for next week.`,
    1200
  );

  return `📊 Weekly Digest — ${data.week_of}\n\n${digest}`;
}
