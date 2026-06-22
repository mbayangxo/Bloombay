import { NextResponse } from "next/server";

interface EBVenue { name?: string; address?: { city?: string; localized_address_display?: string } }
interface EBOrganizer { name?: string }
interface EBEvent {
  id: string;
  name: { text: string };
  start: { local: string };
  end: { local: string };
  url: string;
  description?: { text?: string };
  logo?: { url?: string; original?: { url?: string } };
  venue?: EBVenue;
  organizer?: EBOrganizer;
  capacity?: number;
}
interface EBResponse { events?: EBEvent[]; error?: string }

export async function GET() {
  const key = process.env.EVENTBRITE_API_KEY;
  if (!key || key === "...") {
    return NextResponse.json({ events: [], source: "no_key" });
  }

  try {
    const now = new Date().toISOString().replace(/\.\d+Z$/, "Z");
    const url = new URL("https://www.eventbriteapi.com/v3/events/search/");
    url.searchParams.set("q", "women");
    url.searchParams.set("location.address", "New York, NY");
    url.searchParams.set("location.within", "10mi");
    url.searchParams.set("start_date.range_start", now);
    url.searchParams.set("expand", "venue,organizer");
    url.searchParams.set("sort_by", "date");
    url.searchParams.set("page_size", "20");

    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${key}` },
      next: { revalidate: 3600 }, // cache 1h
    });

    if (!res.ok) {
      return NextResponse.json({ events: [], source: "api_error", status: res.status });
    }

    const data = (await res.json()) as EBResponse;
    const events = (data.events ?? []).map((ev: EBEvent) => ({
      id: `eb_${ev.id}`,
      title: ev.name.text,
      starts_at: ev.start.local,
      ends_at: ev.end.local,
      venue: ev.venue?.name ?? ev.venue?.address?.city ?? "New York",
      city: "New York",
      neighborhood: ev.venue?.address?.city ?? null,
      host_name: ev.organizer?.name ?? null,
      cover_url: ev.logo?.original?.url ?? ev.logo?.url ?? null,
      attending_count: null,
      spots_left: ev.capacity ?? null,
      event_type: "gathering",
      slug: ev.id,
      accent_color: null,
      badge: null,
      source: "eventbrite" as const,
      href: ev.url,
    }));

    return NextResponse.json({ events, source: "eventbrite" });
  } catch (err) {
    console.error("Eventbrite fetch error:", err);
    return NextResponse.json({ events: [], source: "error" });
  }
}
