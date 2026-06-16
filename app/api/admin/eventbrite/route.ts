import { NextRequest, NextResponse } from "next/server";

const EVENTBRITE_TOKEN = process.env.EVENTBRITE_API_KEY;

export async function GET(req: NextRequest) {
  const secret = req.headers.get("x-admin-password");
  if (secret !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!EVENTBRITE_TOKEN) {
    return NextResponse.json({ error: "EVENTBRITE_API_KEY not set" }, { status: 503 });
  }

  const { searchParams } = new URL(req.url);
  const q          = searchParams.get("q") ?? "women";
  const city       = searchParams.get("city") ?? "London";
  const startDate  = searchParams.get("start_date") ?? new Date().toISOString();

  const params = new URLSearchParams({
    q,
    "location.address":      city,
    "location.within":       "25mi",
    "start_date.range_start": startDate,
    "categories":            "110,116,105,103,111", // Charity, Food, Nightlife, Music, Lifestyle
    "sort_by":               "date",
    "expand":                "venue,ticket_availability,logo",
    "page_size":             "20",
  });

  const res = await fetch(
    `https://www.eventbriteapi.com/v3/events/search/?${params.toString()}`,
    { headers: { "Authorization": `Bearer ${EVENTBRITE_TOKEN}` }, next: { revalidate: 300 } }
  );

  if (!res.ok) {
    const err = await res.text();
    return NextResponse.json({ error: err }, { status: res.status });
  }

  const data = await res.json() as {
    events?: Array<{
      id: string;
      name: { text: string };
      description?: { text: string | null };
      url: string;
      start: { utc: string; local: string };
      end: { utc: string };
      is_free: boolean;
      logo?: { url: string } | null;
      venue?: { name: string; address: { city: string; localized_address_display: string } } | null;
      ticket_availability?: { minimum_ticket_price?: { major_value: string; currency: string } | null } | null;
    }>;
    pagination?: { page_count: number; object_count: number };
  };

  const events = (data.events ?? []).map(e => ({
    id:          e.id,
    title:       e.name.text,
    description: e.description?.text ?? null,
    url:         e.url,
    starts_at:   e.start.utc,
    ends_at:     e.end.utc,
    is_free:     e.is_free,
    image_url:   e.logo?.url ?? null,
    venue:       e.venue?.name ?? null,
    address:     e.venue?.address?.localized_address_display ?? city,
    city:        e.venue?.address?.city ?? city,
    price_label: e.is_free ? "Free" : (e.ticket_availability?.minimum_ticket_price ? `${e.ticket_availability.minimum_ticket_price.currency} ${e.ticket_availability.minimum_ticket_price.major_value}+` : "Paid"),
  }));

  return NextResponse.json({ events, total: data.pagination?.object_count ?? events.length });
}
