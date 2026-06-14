// ── Yande's City Intelligence Engine ─────────────────────────────────────────
// Runs weekly (Wednesday morning — mid-week, content stays fresh through weekend).
// Scrapes TikTok NYC hashtags, Eventbrite, Eater RSS, Time Out RSS.
// Claude AI writes Yande's one-sentence note for each spot.
// Results go into city_trending as status='pending' for curator review.
//
// Required env vars:
//   CRON_SECRET          — shared secret to authenticate Vercel cron calls
//   ANTHROPIC_API_KEY    — Claude AI for Yande notes
//   APIFY_API_KEY        — TikTok hashtag scraper (apify.com, ~$5/month)
//   EVENTBRITE_API_KEY   — Eventbrite event search (free tier)
//   SUPABASE_SERVICE_ROLE_KEY — bypasses RLS for server inserts

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// ── Auth ──────────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-cron-secret");
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  const results: { source: string; found: number; inserted: number }[] = [];

  // Run all sources in parallel for speed
  const [tiktokItems, yelpItems, googleItems, eventbriteItems, eaterItems, timeoutItems] = await Promise.all([
    scrapeTikTokNYC(),       // TikTok: trending hashtags → what women are posting about
    scrapeYelpNYC(),         // Yelp: top-rated & recently opened NYC spots
    scrapeGooglePlaces(),    // Google Places: trending NYC places by category
    scrapeEventbrite(),      // Eventbrite: pop-ups, festivals, brand activations
    scrapeEaterNYC(),        // Eater NYC: new openings + restaurant news
    scrapeTimeOut(),         // Time Out NYC: curated weekly picks
  ]);

  const [ti, yi, gi, ei, eati, toi] = await Promise.all([
    insertSpots(supabase, tiktokItems,     "TikTok NYC"),
    insertSpots(supabase, yelpItems,       "Yelp"),
    insertSpots(supabase, googleItems,     "Google Places"),
    insertSpots(supabase, eventbriteItems, "Eventbrite"),
    insertSpots(supabase, eaterItems,      "Eater NYC"),
    insertSpots(supabase, timeoutItems,    "Time Out NYC"),
  ]);

  results.push(
    { source: "TikTok NYC",    found: tiktokItems.length,     inserted: ti   },
    { source: "Yelp",          found: yelpItems.length,        inserted: yi   },
    { source: "Google Places", found: googleItems.length,      inserted: gi   },
    { source: "Eventbrite",    found: eventbriteItems.length,  inserted: ei   },
    { source: "Eater NYC",     found: eaterItems.length,       inserted: eati },
    { source: "Time Out NYC",  found: timeoutItems.length,     inserted: toi  },
  );

  return NextResponse.json({ ok: true, results, week_of: currentMonday() });
}

// ── TikTok via Apify ─────────────────────────────────────────────────────────
// Apify's TikTok Hashtag Scraper actor monitors NYC-specific hashtags.
// Free alternatives: manually monitor + submit via curator portal.
// Hashtags: #NYCpopup, #NYCfoodie, #NYCthingstodo, #NYCevents, #NYCbrunch,
//           #nycrestaurant, #nycfashion, #nycbeauty, #nycsamplesa le, #nycfestival

async function scrapeTikTokNYC(): Promise<RawSpot[]> {
  if (!process.env.APIFY_API_KEY) {
    console.log("[CityIntel] Apify key not set — skipping TikTok scrape");
    return [];
  }

  const hashtags = [
    // Food & dining — where people are actually eating
    "NYCfoodie", "nycrestaurant", "NYCeats", "nycfoodreview", "wheretoeatatnyc",
    "NYCbrunch", "nycfoodspot", "nycfoodscene", "nycfoodtour",
    // Pop-ups & activations — brand events, free stuff
    "NYCpopup", "nycpopups", "nycbrandactivation", "freenyc",
    // Events & experiences
    "NYCevents", "nycfestival", "NYCthingstodo", "nycthisweekend",
    "nycactivities", "nycmuseum", "nycart", "nycexhibit",
    // Fashion & beauty — sample sales, drops
    "nycfashion", "nycbeauty", "nycsamplesale", "nycshoppingfinds",
    // Wellness
    "NYCwellness", "NYCpilates", "nycgyms", "nycjuice",
    // Girls & women in the city
    "nycgirlthings", "nycwomen", "nycgirls",
  ];

  try {
    // Trigger Apify TikTok Hashtag Scraper
    const runRes = await fetch(
      `https://api.apify.com/v2/acts/clockworks~tiktok-hashtag-scraper/runs?token=${process.env.APIFY_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hashtags,
          resultsPerPage: 100,  // 100 per hashtag × 27 hashtags = up to 2700 videos
          shouldDownloadVideos: false,
          shouldDownloadCovers: false,
          maxItems: 3000,        // cap total — let the relevance filter do the work
        }),
      }
    );

    if (!runRes.ok) return [];
    const run = await runRes.json() as { data: { id: string } };
    const runId = run.data.id;

    // Poll for completion (max 2 min)
    let attempts = 0;
    while (attempts < 24) {
      await sleep(5000);
      const statusRes = await fetch(
        `https://api.apify.com/v2/acts/clockworks~tiktok-hashtag-scraper/runs/${runId}?token=${process.env.APIFY_API_KEY}`
      );
      const status = await statusRes.json() as { data: { status: string } };
      if (status.data.status === "SUCCEEDED") break;
      if (status.data.status === "FAILED") return [];
      attempts++;
    }

    // Fetch all results — skim widely across thousands of videos
    const itemsRes = await fetch(
      `https://api.apify.com/v2/acts/clockworks~tiktok-hashtag-scraper/runs/${runId}/dataset/items?token=${process.env.APIFY_API_KEY}&limit=3000`
    );
    const items = await itemsRes.json() as TikTokItem[];

    // Extract place/event names from video descriptions
    const spots = await extractSpotsFromTikTok(items);
    return spots;

  } catch (e) {
    console.error("[CityIntel] TikTok scrape failed:", e);
    return [];
  }
}

interface TikTokItem {
  desc: string;
  stats: { playCount: number; diggCount: number };
  authorMeta: { name: string };
  hashtags: Array<{ name: string }>;
}

// Score a video for how likely it is to mention a real NYC place or event.
// High score = likely useful. Low score = generic/filler/reaction content.
function relevanceScore(item: TikTokItem): number {
  const desc = (item.desc ?? "").toLowerCase();
  let score = 0;

  // NYC place signals
  const placeWords = ["restaurant", "spot", "cafe", "bar", "brunch", "popup", "pop-up", "pop up", "sample sale", "opening", "gallery", "museum", "festival", "market", "store", "shop", "studio", "lounge", "juice", "pilates", "gym", "event", "experience", "reservation", "must try", "must visit", "just opened", "go to", "went to", "tried", "ate at", "came here", "obsessed with", "new in nyc", "hidden gem", "underrated"];
  const placeHits = placeWords.filter(w => desc.includes(w)).length;
  score += placeHits * 3;

  // NYC location signals
  const nycWords = ["nyc", "new york", "manhattan", "brooklyn", "queens", "bronx", "williamsburg", "soho", "tribeca", "harlem", "chelsea", "west village", "east village", "lower east side", "midtown", "downtown", "uptown", "bed stuy", "bushwick", "astoria", "greenpoint", "dumbo", "fidi"];
  const nycHits = nycWords.filter(w => desc.includes(w)).length;
  score += nycHits * 2;

  // Engagement signal (viral but not just a meme)
  const plays = item.stats?.playCount ?? 0;
  if (plays > 500000) score += 2;
  if (plays > 100000) score += 1;

  // Penalize generic content
  const genericWords = ["pov:", "me when", "it's giving", "brat summer", "response to", "stitch", "duet", "reply to"];
  const genericHits = genericWords.filter(w => desc.includes(w)).length;
  score -= genericHits * 2;

  // Must have some description content
  if (desc.length < 20) score -= 5;

  return score;
}

async function extractSpotsFromTikTok(items: TikTokItem[]): Promise<RawSpot[]> {
  if (!process.env.ANTHROPIC_API_KEY || items.length === 0) return [];

  // Smart skim: score every video for NYC place/event relevance,
  // then take the top-scoring ones across thousands of scraped videos.
  const scored = items
    .map(item => ({ item, score: relevanceScore(item) }))
    .filter(({ score }) => score > 0)  // drop obviously irrelevant
    .sort((a, b) => b.score - a.score);

  // Take up to 500 high-relevance videos — then sample for Claude's context window
  const highRelevance = scored.slice(0, 500).map(({ item }) => item);

  // Claude can process ~800 descriptions before hitting context limits.
  // Send a mix: top 300 by relevance + 200 random from the high-relevance pool.
  const top300 = highRelevance.slice(0, 300);
  const randomMid = highRelevance.slice(300).sort(() => Math.random() - 0.5).slice(0, 200);
  const forClaude = [...top300, ...randomMid];

  const descriptions = forClaude
    .map(v => v.desc)
    .filter(Boolean)
    .join("\n---\n");

  const prompt = `You are extracting trending NYC spots and events from TikTok video descriptions.

Video descriptions:
${descriptions}

Extract up to 20 specific places, pop-ups, events, or experiences that are trending.
For each one, return JSON:
{
  "name": "specific name (e.g. 'Dior Beauty Pop-Up Madison Ave', 'Via Carota', 'Brooklyn Night Market')",
  "category": one of: dining | drinks | pop-up | art | nightlife | brunch | coffee | shopping | wellness | event | other,
  "neighborhood": "if mentioned, e.g. 'West Village'",
  "description": "1 sentence max — what makes it worth going. Specific, not generic.",
  "badge": "NEW" or "GOING VIRAL" or null
}

Return a JSON array. If you can't identify specific places (just general content), return [].`;

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 2048,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await res.json() as { content: Array<{ text: string }> };
    const text = data.content[0]?.text ?? "[]";
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) return [];
    return JSON.parse(jsonMatch[0]) as RawSpot[];
  } catch {
    return [];
  }
}

// ── Eventbrite ────────────────────────────────────────────────────────────────

async function scrapeEventbrite(): Promise<RawSpot[]> {
  if (!process.env.EVENTBRITE_API_KEY) {
    console.log("[CityIntel] Eventbrite key not set — skipping");
    return [];
  }

  try {
    const now = new Date();
    const weekOut = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);

    const res = await fetch(
      `https://www.eventbriteapi.com/v3/events/search/?` +
      `location.address=New York City&` +
      `location.within=10mi&` +
      `start_date.range_start=${now.toISOString()}&` +
      `start_date.range_end=${weekOut.toISOString()}&` +
      `categories=110,113,116&` + // food/drink, fashion, music
      `sort_by=best&` +
      `expand=venue&` +
      `token=${process.env.EVENTBRITE_API_KEY}`,
      { headers: { "Accept": "application/json" } }
    );

    if (!res.ok) return [];
    const data = await res.json() as { events: Array<{
      name: { text: string };
      description: { text: string };
      venue: { address: { localized_area_display: string } } | null;
      start: { local: string };
      url: string;
      is_free: boolean;
    }> };

    return (data.events ?? []).slice(0, 15).map(ev => ({
      name: ev.name.text,
      category: categorizeEventbrite(ev.name.text),
      neighborhood: ev.venue?.address?.localized_area_display ?? null,
      description: (ev.description?.text ?? "").slice(0, 120) || null,
      badge: ev.is_free ? "FREE" : null,
      source_url: ev.url,
    }));
  } catch (e) {
    console.error("[CityIntel] Eventbrite scrape failed:", e);
    return [];
  }
}

function categorizeEventbrite(name: string): string {
  const n = name.toLowerCase();
  if (n.includes("pop-up") || n.includes("popup") || n.includes("activation")) return "pop-up";
  if (n.includes("fashion") || n.includes("sample sale") || n.includes("vintage")) return "shopping";
  if (n.includes("festival") || n.includes("carnival") || n.includes("fair")) return "event";
  if (n.includes("brunch")) return "brunch";
  if (n.includes("dinner") || n.includes("restaurant") || n.includes("food")) return "dining";
  if (n.includes("art") || n.includes("exhibit") || n.includes("museum") || n.includes("gallery")) return "art";
  if (n.includes("concert") || n.includes("music") || n.includes("jazz") || n.includes("performance")) return "nightlife";
  if (n.includes("yoga") || n.includes("wellness") || n.includes("meditation")) return "wellness";
  if (n.includes("coffee") || n.includes("café") || n.includes("cafe")) return "coffee";
  return "event";
}

// ── Yelp Fusion API ───────────────────────────────────────────────────────────
// Free tier: 5,000 calls/day — more than enough.
// Required env var: YELP_API_KEY (create at yelp.com/developers)
// Pulls: top-rated + recently opened spots across dining, nightlife, beauty, wellness

const YELP_CATEGORIES = [
  { term: "restaurants",    label: "dining"   },
  { term: "bars",           label: "drinks"   },
  { term: "coffee",         label: "coffee"   },
  { term: "beauty",         label: "wellness" },
  { term: "yoga pilates",   label: "wellness" },
  { term: "art gallery",    label: "art"      },
  { term: "popup shop",     label: "pop-up"   },
];

async function scrapeYelpNYC(): Promise<RawSpot[]> {
  if (!process.env.YELP_API_KEY) {
    console.log("[CityIntel] Yelp key not set — skipping");
    return [];
  }

  const spots: RawSpot[] = [];

  for (const cat of YELP_CATEGORIES) {
    try {
      const res = await fetch(
        `https://api.yelp.com/v3/businesses/search?` +
        `location=New York City, NY&` +
        `term=${encodeURIComponent(cat.term)}&` +
        `sort_by=rating&` +
        `limit=10`,
        { headers: { Authorization: `Bearer ${process.env.YELP_API_KEY}` } }
      );
      if (!res.ok) continue;

      const data = await res.json() as {
        businesses: Array<{
          name: string;
          rating: number;
          review_count: number;
          location: { city: string; neighborhood?: string };
          categories: Array<{ title: string }>;
          url: string;
          is_closed: boolean;
        }>
      };

      for (const biz of (data.businesses ?? [])) {
        if (biz.is_closed) continue;
        if (biz.rating < 4.0) continue; // only quality spots

        spots.push({
          name: biz.name,
          category: cat.label,
          neighborhood: biz.location.neighborhood ?? biz.location.city ?? null,
          description: `${biz.rating}★ · ${biz.review_count} reviews · ${biz.categories.map(c => c.title).join(", ")}`,
          badge: biz.rating >= 4.5 ? "TOP RATED" : null,
          source_url: biz.url,
        });
      }
    } catch (e) {
      console.error("[CityIntel] Yelp fetch failed for", cat.term, e);
    }
  }

  return spots;
}

// ── Google Places API ─────────────────────────────────────────────────────────
// Free up to $200/month = ~40,000 place detail calls or ~120,000 search calls.
// Required env var: GOOGLE_PLACES_API_KEY
// Pulls: trending NYC spots by category using Nearby Search

const GOOGLE_PLACE_TYPES = [
  { type: "restaurant",   category: "dining"   },
  { type: "bar",          category: "drinks"   },
  { type: "cafe",         category: "coffee"   },
  { type: "art_gallery",  category: "art"      },
  { type: "beauty_salon", category: "wellness" },
  { type: "gym",          category: "wellness" },
  { type: "night_club",   category: "nightlife"},
];

// NYC center coordinates
const NYC_LAT = 40.7128;
const NYC_LNG = -74.0060;
const SEARCH_RADIUS = 8000; // 8km covers most of Manhattan + parts of Brooklyn

async function scrapeGooglePlaces(): Promise<RawSpot[]> {
  if (!process.env.GOOGLE_PLACES_API_KEY) {
    console.log("[CityIntel] Google Places key not set — skipping");
    return [];
  }

  const spots: RawSpot[] = [];

  for (const pt of GOOGLE_PLACE_TYPES) {
    try {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json?` +
        `location=${NYC_LAT},${NYC_LNG}&` +
        `radius=${SEARCH_RADIUS}&` +
        `type=${pt.type}&` +
        `rankby=prominence&` +
        `key=${process.env.GOOGLE_PLACES_API_KEY}`
      );
      if (!res.ok) continue;

      const data = await res.json() as {
        results: Array<{
          name: string;
          rating?: number;
          user_ratings_total?: number;
          vicinity: string;
          place_id: string;
        }>
      };

      for (const place of (data.results ?? []).slice(0, 8)) {
        if (!place.rating || place.rating < 4.0) continue;

        const neighborhood = place.vicinity.split(",").slice(-2, -1)[0]?.trim() ?? null;

        spots.push({
          name: place.name,
          category: pt.category,
          neighborhood,
          description: `${place.rating}★ · ${place.user_ratings_total ?? 0} reviews on Google`,
          badge: (place.rating ?? 0) >= 4.7 ? "HIGHLY RATED" : null,
          source_url: `https://www.google.com/maps/place/?q=place_id:${place.place_id}`,
        });
      }
    } catch (e) {
      console.error("[CityIntel] Google Places fetch failed for", pt.type, e);
    }
  }

  return spots;
}

// ── Eater NYC RSS ─────────────────────────────────────────────────────────────

async function scrapeEaterNYC(): Promise<RawSpot[]> {
  try {
    const res = await fetch("https://ny.eater.com/rss/index.xml", {
      headers: { "User-Agent": "BloomBay-CityIntel/1.0" },
    });
    if (!res.ok) return [];
    const xml = await res.text();
    return parseRSSToSpots(xml, "Eater NYC", 8);
  } catch (e) {
    console.error("[CityIntel] Eater scrape failed:", e);
    return [];
  }
}

// ── Time Out NYC RSS ──────────────────────────────────────────────────────────

async function scrapeTimeOut(): Promise<RawSpot[]> {
  try {
    const res = await fetch("https://www.timeout.com/newyork/rss/feed.xml", {
      headers: { "User-Agent": "BloomBay-CityIntel/1.0" },
    });
    if (!res.ok) return [];
    const xml = await res.text();
    return parseRSSToSpots(xml, "Time Out NYC", 8);
  } catch (e) {
    console.error("[CityIntel] Time Out scrape failed:", e);
    return [];
  }
}

function parseRSSToSpots(xml: string, source: string, limit: number): RawSpot[] {
  const items: RawSpot[] = [];
  const titleMatches = xml.matchAll(/<title><!\[CDATA\[(.*?)\]\]><\/title>|<title>(.*?)<\/title>/g);
  const linkMatches  = [...xml.matchAll(/<link>(https?:\/\/[^<]+)<\/link>/g)];
  const descMatches  = [...xml.matchAll(/<description><!\[CDATA\[(.*?)\]\]><\/description>/g)];

  let i = 0;
  for (const m of titleMatches) {
    if (i >= limit + 1) break; // +1 because first title is the feed title
    if (i === 0) { i++; continue; } // skip feed-level title

    const title  = (m[1] ?? m[2] ?? "").trim();
    const link   = linkMatches[i]?.[1] ?? null;
    const desc   = descMatches[i - 1]?.[1]?.replace(/<[^>]+>/g, "").slice(0, 120) ?? null;

    if (title) {
      items.push({
        name: title,
        category: categorizeByTitle(title),
        description: desc,
        badge: null,
        source_url: link,
      });
    }
    i++;
  }
  return items;
}

function categorizeByTitle(title: string): string {
  const t = title.toLowerCase();
  if (t.includes("pop-up") || t.includes("popup")) return "pop-up";
  if (t.includes("open") && (t.includes("restaurant") || t.includes("bar") || t.includes("café"))) return "dining";
  if (t.includes("sample sale") || t.includes("fashion") || t.includes("vintage")) return "shopping";
  if (t.includes("exhibit") || t.includes("museum") || t.includes("gallery") || t.includes("art")) return "art";
  if (t.includes("brunch")) return "brunch";
  if (t.includes("festival") || t.includes("market") || t.includes("carnival")) return "event";
  if (t.includes("bar") || t.includes("cocktail") || t.includes("wine")) return "drinks";
  if (t.includes("coffee") || t.includes("café")) return "coffee";
  return "other";
}

// ── Yande note generation ─────────────────────────────────────────────────────
// Generates Yande's one-sentence "why this matters" for a batch of spots.

async function addYandeNotes(spots: RawSpot[]): Promise<RawSpot[]> {
  if (!process.env.ANTHROPIC_API_KEY || spots.length === 0) return spots;

  const prompt = `You are Yande, BloomBay's AI hostess. Write a one-sentence note for each spot below that tells a young woman in NYC exactly why she should care. Be specific, warm, and a little witty. Never generic. Each note should feel like it was written by a well-connected girlfriend who knows the city.

Spots:
${spots.map((s, i) => `${i + 1}. ${s.name} (${s.category})${s.description ? `: ${s.description}` : ""}`).join("\n")}

Return a JSON array of ${spots.length} strings, one note per spot. Max 100 chars each. No "— Yande" signature (added separately).`;

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 1024,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await res.json() as { content: Array<{ text: string }> };
    const text = data.content[0]?.text ?? "[]";
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) return spots;
    const notes = JSON.parse(jsonMatch[0]) as string[];
    return spots.map((s, i) => ({ ...s, yande_note: notes[i] ?? null }));
  } catch {
    return spots;
  }
}

// ── Insert into city_trending ─────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Supabase = ReturnType<typeof createClient<any>>;

async function insertSpots(supabase: Supabase, spots: RawSpot[], source: string): Promise<number> {
  if (spots.length === 0) return 0;

  // Add Yande notes in batch
  const spotsWithNotes = await addYandeNotes(spots);

  const weekOf = currentMonday();
  let inserted = 0;

  for (const spot of spotsWithNotes) {
    const { error } = await supabase.from("city_trending").insert({
      city: "New York",
      name: spot.name,
      category: spot.category ?? "other",
      neighborhood: spot.neighborhood ?? null,
      description: spot.description ?? null,
      source,
      source_url: spot.source_url ?? null,
      badge: spot.badge ?? null,
      status: "pending",
      week_of: weekOf,
      rank_order: 99,
    });

    if (!error) inserted++;
  }

  return inserted;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

interface RawSpot {
  name: string;
  category: string;
  neighborhood?: string | null;
  description?: string | null;
  badge?: string | null;
  source_url?: string | null;
  yande_note?: string | null;
}

function currentMonday(): string {
  const d = new Date();
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(d.setDate(diff));
  return monday.toISOString().split("T")[0];
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
