/**
 * Detect + parse external event URLs (Luma, Partiful, Eventbrite).
 * Fetches public HTML when needed and reads Open Graph / JSON-LD.
 */

export type ExternalEventSource = "luma" | "partiful" | "eventbrite" | "other";

export type ParsedExternalEvent = {
  source: ExternalEventSource;
  url: string;
  title: string;
  description: string | null;
  starts_at: string | null;
  venue: string | null;
  city: string;
  image_url: string | null;
  external_id: string | null;
};

const SOURCE_HOSTS: { source: ExternalEventSource; match: RegExp }[] = [
  { source: "luma", match: /(^|\.)lu\.ma$/i },
  { source: "luma", match: /(^|\.)luma\.com$/i },
  { source: "partiful", match: /(^|\.)partiful\.com$/i },
  { source: "eventbrite", match: /(^|\.)eventbrite\.com$/i },
  { source: "eventbrite", match: /(^|\.)eventbrite\.[a-z.]+$/i },
];

export function detectEventSource(url: string): ExternalEventSource {
  try {
    const host = new URL(url).hostname.replace(/^www\./, "");
    for (const row of SOURCE_HOSTS) {
      if (row.match.test(host)) return row.source;
    }
  } catch {
    /* ignore */
  }
  return "other";
}

function metaContent(html: string, prop: string): string | null {
  const patterns = [
    new RegExp(`<meta[^>]+property=["']${prop}["'][^>]+content=["']([^"']+)["']`, "i"),
    new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+property=["']${prop}["']`, "i"),
    new RegExp(`<meta[^>]+name=["']${prop}["'][^>]+content=["']([^"']+)["']`, "i"),
    new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+name=["']${prop}["']`, "i"),
  ];
  for (const re of patterns) {
    const m = html.match(re);
    if (m?.[1]) return decodeHtml(m[1].trim());
  }
  return null;
}

function decodeHtml(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#x27;/g, "'");
}

function titleFromHtml(html: string): string | null {
  const og = metaContent(html, "og:title");
  if (og) return og;
  const m = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  return m?.[1] ? decodeHtml(m[1].trim()) : null;
}

function extractJsonLd(html: string): Record<string, unknown> | null {
  const blocks = [...html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  for (const block of blocks) {
    try {
      const raw = JSON.parse(block[1].trim()) as unknown;
      const candidates = Array.isArray(raw) ? raw : [raw];
      for (const c of candidates) {
        if (!c || typeof c !== "object") continue;
        const obj = c as Record<string, unknown>;
        const type = String(obj["@type"] ?? "");
        if (/Event/i.test(type)) return obj;
        if (Array.isArray(obj["@graph"])) {
          for (const g of obj["@graph"] as unknown[]) {
            if (g && typeof g === "object" && /Event/i.test(String((g as Record<string, unknown>)["@type"] ?? ""))) {
              return g as Record<string, unknown>;
            }
          }
        }
      }
    } catch {
      /* continue */
    }
  }
  return null;
}

function placeName(loc: unknown): string | null {
  if (!loc) return null;
  if (typeof loc === "string") return loc;
  if (typeof loc === "object") {
    const o = loc as Record<string, unknown>;
    if (typeof o.name === "string") return o.name;
    const addr = o.address;
    if (typeof addr === "string") return addr;
    if (addr && typeof addr === "object") {
      const a = addr as Record<string, unknown>;
      const parts = [a.streetAddress, a.addressLocality, a.addressRegion].filter(
        (x): x is string => typeof x === "string" && x.length > 0,
      );
      if (parts.length) return parts.join(", ");
    }
  }
  return null;
}

function eventbriteIdFromUrl(url: string): string | null {
  const m = url.match(/\/e\/[^/?#]*?-(\d+)(?:\/|$|\?)/i) ?? url.match(/events\/(\d+)/i);
  return m?.[1] ?? null;
}

async function fetchEventbriteById(eventId: string): Promise<Partial<ParsedExternalEvent> | null> {
  const key = process.env.EVENTBRITE_API_KEY;
  if (!key || key === "...") return null;
  try {
    const res = await fetch(
      `https://www.eventbriteapi.com/v3/events/${eventId}/?expand=venue`,
      { headers: { Authorization: `Bearer ${key}` }, next: { revalidate: 0 } },
    );
    if (!res.ok) return null;
    const ev = (await res.json()) as {
      name?: { text?: string };
      description?: { text?: string };
      start?: { utc?: string; local?: string };
      url?: string;
      logo?: { original?: { url?: string }; url?: string };
      venue?: { name?: string; address?: { city?: string; localized_address_display?: string } };
    };
    return {
      title: ev.name?.text ?? "Eventbrite event",
      description: ev.description?.text ?? null,
      starts_at: ev.start?.utc ?? ev.start?.local ?? null,
      venue: ev.venue?.name ?? ev.venue?.address?.localized_address_display ?? null,
      city: ev.venue?.address?.city ?? "New York",
      image_url: ev.logo?.original?.url ?? ev.logo?.url ?? null,
      external_id: eventId,
      url: ev.url,
    };
  } catch {
    return null;
  }
}

export async function parseExternalEventUrl(rawUrl: string): Promise<ParsedExternalEvent> {
  let url: URL;
  try {
    url = new URL(rawUrl.trim());
  } catch {
    throw new Error("That doesn’t look like a valid URL");
  }
  if (!/^https?:$/i.test(url.protocol)) {
    throw new Error("URL must start with http or https");
  }

  const source = detectEventSource(url.toString());
  const normalized = url.toString();

  if (source === "eventbrite") {
    const ebId = eventbriteIdFromUrl(normalized);
    if (ebId) {
      const fromApi = await fetchEventbriteById(ebId);
      if (fromApi?.title) {
        return {
          source,
          url: fromApi.url ?? normalized,
          title: fromApi.title,
          description: fromApi.description ?? null,
          starts_at: fromApi.starts_at ?? null,
          venue: fromApi.venue ?? null,
          city: fromApi.city ?? "New York",
          image_url: fromApi.image_url ?? null,
          external_id: ebId,
        };
      }
    }
  }

  const res = await fetch(normalized, {
    headers: {
      "User-Agent": "BloomBayBot/1.0 (+https://bloombay.app)",
      Accept: "text/html,application/xhtml+xml",
    },
    redirect: "follow",
    next: { revalidate: 0 },
  });
  if (!res.ok) {
    throw new Error(`Couldn’t open that link (${res.status}). Paste the public event URL.`);
  }
  const html = await res.text();
  const ld = extractJsonLd(html);

  const title =
    (typeof ld?.name === "string" ? ld.name : null) ??
    titleFromHtml(html) ??
    "Imported event";
  const description =
    (typeof ld?.description === "string" ? ld.description : null) ??
    metaContent(html, "og:description");
  const starts_at =
    (typeof ld?.startDate === "string" ? ld.startDate : null) ??
    metaContent(html, "event:start_time");
  const venue =
    placeName(ld?.location) ??
    metaContent(html, "og:street_address") ??
    null;
  const image_url =
    (typeof ld?.image === "string"
      ? ld.image
      : Array.isArray(ld?.image) && typeof (ld.image as unknown[])[0] === "string"
        ? (ld.image as string[])[0]
        : null) ?? metaContent(html, "og:image");

  let external_id: string | null = null;
  if (source === "luma") {
    external_id = url.pathname.replace(/^\//, "").split("/")[0] || null;
  } else if (source === "partiful") {
    external_id = url.pathname.match(/\/e\/([^/?#]+)/)?.[1] ?? null;
  } else if (source === "eventbrite") {
    external_id = eventbriteIdFromUrl(normalized);
  }

  return {
    source,
    url: normalized,
    title: title.slice(0, 200),
    description: description ? description.slice(0, 2000) : null,
    starts_at,
    venue,
    city: "New York",
    image_url,
    external_id,
  };
}
