import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import { db, cap, fmt } from "../supabase.js";

export const eventTools: Tool[] = [
  {
    name: "find_events",
    description:
      "Find official BloomBay events (the `events` table — ticketed/curated). Filter by date range, city, or category.",
    inputSchema: {
      type: "object",
      properties: {
        city:        { type: "string" },
        category:    { type: "string", description: "dinner, party, brunch, wellness, culture, social, rooftop, walk, art, sports" },
        date_from:   { type: "string", description: "ISO date string" },
        date_to:     { type: "string", description: "ISO date string" },
        published:   { type: "boolean", description: "Filter by published status (default: all)" },
        limit:       { type: "number" },
      },
    },
  },
  {
    name: "find_gatherings",
    description:
      "Find club gatherings (the `gatherings` table — club-hosted events). Filter by club, date, or area.",
    inputSchema: {
      type: "object",
      properties: {
        club_slug:  { type: "string" },
        area:       { type: "string", description: "Neighborhood or area" },
        date_from:  { type: "string", description: "ISO date string" },
        date_to:    { type: "string", description: "ISO date string" },
        limit:      { type: "number" },
      },
    },
  },
  {
    name: "find_upcoming_events",
    description:
      "Find all events and gatherings happening in the next N days. Good for 'what's this weekend' queries.",
    inputSchema: {
      type: "object",
      properties: {
        days:  { type: "number", description: "How many days ahead to look (default 7)" },
        city:  { type: "string" },
        limit: { type: "number" },
      },
    },
  },
  {
    name: "get_event",
    description: "Get full details for a single event including attendee count.",
    inputSchema: {
      type: "object",
      required: ["id"],
      properties: {
        id:   { type: "string", description: "Event UUID" },
        type: { type: "string", enum: ["event", "gathering"], description: "Which table (default: event)" },
      },
    },
  },
  {
    name: "find_events_low_attendance",
    description:
      "Find upcoming official events where confirmed attendees are below a threshold. Useful for promotions.",
    inputSchema: {
      type: "object",
      properties: {
        threshold: { type: "number", description: "Attendee count below this triggers flag (default 5)" },
        days_ahead:{ type: "number", description: "Look N days ahead (default 14)" },
        limit:     { type: "number" },
      },
    },
  },
];

type Args = Record<string, unknown>;

export async function handleEventTool(
  name: string,
  args: Args
): Promise<{ content: { type: "text"; text: string }[] }> {
  const text = await dispatch(name, args);
  return { content: [{ type: "text", text }] };
}

async function dispatch(name: string, args: Args): Promise<string> {
  switch (name) {
    case "find_events":              return findEvents(args);
    case "find_gatherings":          return findGatherings(args);
    case "find_upcoming_events":     return findUpcomingEvents(args);
    case "get_event":                return getEvent(args);
    case "find_events_low_attendance": return findEventsLowAttendance(args);
    default: return `Unknown event tool: ${name}`;
  }
}

async function findEvents(args: Args): Promise<string> {
  let q = db
    .from("events")
    .select("id, title, city, category, date_time, end_time, venue, neighborhood, attending_count, capacity, price_cents, is_official, is_published, badge")
    .order("date_time", { ascending: true })
    .limit(cap(Number(args.limit ?? 20)));

  if (args.city)      q = q.ilike("city", `%${args.city}%`);
  if (args.category)  q = q.eq("category", args.category as string);
  if (args.date_from) q = q.gte("date_time", args.date_from as string);
  if (args.date_to)   q = q.lte("date_time", args.date_to as string);
  if (typeof args.published === "boolean") q = q.eq("is_published", args.published);

  const { data, error } = await q;
  if (error) return `Error: ${error.message}`;
  return fmt(data ?? []);
}

async function findGatherings(args: Args): Promise<string> {
  let q = db
    .from("gatherings")
    .select("id, slug, title, club_slug, starts_at, area, neighborhood, venue, capacity, spots_left, created_at")
    .order("starts_at", { ascending: true })
    .limit(cap(Number(args.limit ?? 20)));

  if (args.club_slug) q = q.eq("club_slug", args.club_slug as string);
  if (args.area)      q = q.ilike("area", `%${args.area}%`);
  if (args.date_from) q = q.gte("starts_at", args.date_from as string);
  if (args.date_to)   q = q.lte("starts_at", args.date_to as string);

  const { data, error } = await q;
  if (error) return `Error: ${error.message}`;
  return fmt(data ?? []);
}

async function findUpcomingEvents(args: Args): Promise<string> {
  const days = Number(args.days ?? 7);
  const now = new Date().toISOString();
  const future = new Date(Date.now() + days * 86400_000).toISOString();
  const limit = cap(Number(args.limit ?? 30));

  let evQ = db
    .from("events")
    .select("id, title, city, category, date_time, venue, attending_count, capacity, is_published")
    .gte("date_time", now)
    .lte("date_time", future)
    .eq("is_published", true)
    .order("date_time", { ascending: true })
    .limit(limit);

  let gaQ = db
    .from("gatherings")
    .select("id, title, club_slug, starts_at, area, venue, capacity, spots_left")
    .gte("starts_at", now)
    .lte("starts_at", future)
    .order("starts_at", { ascending: true })
    .limit(limit);

  if (args.city) evQ = evQ.ilike("city", `%${args.city}%`);

  const [events, gatherings] = await Promise.all([evQ, gaQ]);

  const result = {
    events:     (events.data ?? []).map(e => ({ ...e, _type: "event" })),
    gatherings: (gatherings.data ?? []).map(g => ({ ...g, _type: "gathering" })),
    total: (events.data?.length ?? 0) + (gatherings.data?.length ?? 0),
  };

  if (result.total === 0) return `No events or gatherings in the next ${days} days.`;
  return JSON.stringify(result, null, 2);
}

async function getEvent(args: Args): Promise<string> {
  const type = (args.type as string) ?? "event";

  if (type === "gathering") {
    const { data, error } = await db
      .from("gatherings")
      .select("id, slug, title, club_slug, starts_at, area, neighborhood, venue, capacity, spots_left, event_key, created_by, created_at")
      .eq("id", args.id as string)
      .maybeSingle();

    if (error) return `Error: ${error.message}`;
    if (!data)  return "Gathering not found.";

    const { count } = await db
      .from("seat_reservations")
      .select("id", { count: "exact" })
      .eq("gathering_id", args.id as string)
      .eq("status", "reserved");

    return JSON.stringify({ ...data, reservation_count: count ?? 0 }, null, 2);
  }

  const { data, error } = await db
    .from("events")
    .select("id, title, description, city, category, date_time, end_time, venue, neighborhood, attending_count, capacity, price_cents, is_official, is_published, host_note, badge, created_by, created_at")
    .eq("id", args.id as string)
    .maybeSingle();

  if (error) return `Error: ${error.message}`;
  if (!data)  return "Event not found.";

  const { data: attendees } = await db
    .from("event_attendees")
    .select("user_id, profiles:profiles!user_id(full_name, first_name, city)")
    .eq("event_id", args.id as string)
    .limit(50);

  return JSON.stringify({ ...data, attendees: attendees ?? [] }, null, 2);
}

async function findEventsLowAttendance(args: Args): Promise<string> {
  const threshold = Number(args.threshold ?? 5);
  const daysAhead = Number(args.days_ahead ?? 14);
  const now = new Date().toISOString();
  const future = new Date(Date.now() + daysAhead * 86400_000).toISOString();

  const { data, error } = await db
    .from("events")
    .select("id, title, city, category, date_time, venue, attending_count, capacity, is_published")
    .eq("is_published", true)
    .gte("date_time", now)
    .lte("date_time", future)
    .lt("attending_count", threshold)
    .order("date_time", { ascending: true })
    .limit(cap(Number(args.limit ?? 20)));

  if (error) return `Error: ${error.message}`;
  if (!data?.length) return `No upcoming events with fewer than ${threshold} attendees.`;
  return `${data.length} events with under ${threshold} attendees:\n${fmt(data)}`;
}
