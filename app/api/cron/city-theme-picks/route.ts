// ── Weekly City theme spotlights ─────────────────────────────────────────────
// Groups REAL approved city_trending + restaurant_partners rows into themed
// picks ("Best Croissants This Week", "Most Rated Girl Gems") for the Eat,
// Go, and Solo pages. Every mode below only selects among real existing
// rows — keyword/category matching or real rating/save-count ranking —
// never invents a place. Rows with a real photo on file are preferred so
// spotlights actually have something worth looking at; a theme is skipped
// entirely for the week if there isn't enough real (photographed) data to
// back it up.

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

type SupaClient = ReturnType<typeof createClient<any>>;

interface TrendingRow { id: string; name: string; category: string; description: string | null; image_url: string | null; save_count: number; created_at: string }
interface PartnerRow { id: string; name: string; restaurant_type: string; tagline: string | null; about: string | null; cover_url: string | null; photo_urls: string[] | null; bloom_rating: number | null; bloom_notes: number | null; poem: string | null; bloom_tips: string[] | null }

interface ThemeResult { trendingIds: string[]; partnerIds: string[] }

interface Theme {
  page: "eat" | "go" | "solo";
  theme: string;
  blurb: string;
  resolve: (trending: TrendingRow[], partners: PartnerRow[]) => ThemeResult;
}

function byKeyword(keywords: string[]) {
  return (trending: TrendingRow[], partners: PartnerRow[]): ThemeResult => {
    const matchedTrending = trending
      .filter((r) => keywords.some((k) => `${r.name} ${r.category} ${r.description ?? ""}`.toLowerCase().includes(k)))
      .sort((a, b) => Number(!!b.image_url) - Number(!!a.image_url))
      .slice(0, 6);
    const matchedPartners = partners
      .filter((r) => keywords.some((k) => `${r.name} ${r.restaurant_type} ${r.tagline ?? ""} ${r.about ?? ""}`.toLowerCase().includes(k)))
      .sort((a, b) => Number(!!(b.cover_url || b.photo_urls?.[0])) - Number(!!(a.cover_url || a.photo_urls?.[0])))
      .slice(0, 6);
    return { trendingIds: matchedTrending.map((r) => r.id), partnerIds: matchedPartners.map((r) => r.id) };
  };
}

function byCategory(category: string) {
  return (trending: TrendingRow[]): ThemeResult => {
    const matched = trending
      .filter((r) => r.category === category)
      .sort((a, b) => Number(!!b.image_url) - Number(!!a.image_url))
      .slice(0, 8);
    return { trendingIds: matched.map((r) => r.id), partnerIds: [] };
  };
}

function mostRecentTrending(trending: TrendingRow[]): ThemeResult {
  const matched = [...trending]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .filter((r) => !!r.image_url)
    .slice(0, 8);
  return { trendingIds: matched.map((r) => r.id), partnerIds: [] };
}

function mostSavedTrending(trending: TrendingRow[]): ThemeResult {
  const matched = trending
    .filter((r) => r.save_count > 0 && r.image_url)
    .sort((a, b) => b.save_count - a.save_count)
    .slice(0, 8);
  return { trendingIds: matched.map((r) => r.id), partnerIds: [] };
}

function topRatedGirlGems(_trending: TrendingRow[], partners: PartnerRow[]): ThemeResult {
  const matched = partners
    .filter((r) => (r.poem || (r.bloom_tips && r.bloom_tips.length > 0)) && (r.cover_url || r.photo_urls?.[0]))
    .sort((a, b) => (b.bloom_rating ?? 0) - (a.bloom_rating ?? 0))
    .slice(0, 6);
  return { trendingIds: [], partnerIds: matched.map((r) => r.id) };
}

function hottestGirlFavs(_trending: TrendingRow[], partners: PartnerRow[]): ThemeResult {
  const matched = partners
    .filter((r) => (r.bloom_rating ?? 0) > 0 && (r.cover_url || r.photo_urls?.[0]))
    .sort((a, b) => (b.bloom_rating ?? 0) - (a.bloom_rating ?? 0) || (b.bloom_notes ?? 0) - (a.bloom_notes ?? 0))
    .slice(0, 6);
  return { trendingIds: [], partnerIds: matched.map((r) => r.id) };
}

function girlsAreLoving(trending: TrendingRow[], partners: PartnerRow[]): ThemeResult {
  const savedTrending = trending.filter((r) => r.save_count > 0 && r.image_url).sort((a, b) => b.save_count - a.save_count).slice(0, 4);
  const notedPartners = partners.filter((r) => (r.bloom_notes ?? 0) > 0 && (r.cover_url || r.photo_urls?.[0])).sort((a, b) => (b.bloom_notes ?? 0) - (a.bloom_notes ?? 0)).slice(0, 4);
  return { trendingIds: savedTrending.map((r) => r.id), partnerIds: notedPartners.map((r) => r.id) };
}

const THEMES: Theme[] = [
  { page: "eat", theme: "Best Croissants This Week", blurb: "Flaky, buttery, worth the carbs.", resolve: byKeyword(["croissant", "boulangerie", "patisserie", "pastry"]) },
  { page: "eat", theme: "Best Bagels This Week", blurb: "The city's yummiest bagels, per the Bloomies.", resolve: byKeyword(["bagel"]) },
  { page: "eat", theme: "Best Matcha This Month", blurb: "Where to get the good green stuff.", resolve: byKeyword(["matcha"]) },
  { page: "eat", theme: "Cutest Breakfast Spots", blurb: "Morning plans, sorted.", resolve: byKeyword(["breakfast", "brunch", "pancake", "bagels and coffee"]) },
  { page: "eat", theme: "Most Rated Girl Gems", blurb: "The highest-rated hidden spots, per real reviews.", resolve: topRatedGirlGems },
  { page: "eat", theme: "Hottest Girl Favs", blurb: "The best-rated favorites right now.", resolve: hottestGirlFavs },
  { page: "eat", theme: "What The Girls Are Loving This Week", blurb: "Most saved and most talked about, this week.", resolve: girlsAreLoving },
  { page: "go", theme: "Best Ways to Spend Summer", blurb: "Warm-weather, girl-coded plans.", resolve: byKeyword(["outdoor", "rooftop", "park", "garden", "beach", "picnic"]) },
  { page: "go", theme: "Best Museums Right Now", blurb: "Culture, but make it cute.", resolve: byKeyword(["museum", "gallery", "exhibit", "exhibition"]) },
  { page: "go", theme: "Free This Week", blurb: "Zero-dollar plans that still feel special.", resolve: byKeyword(["free"]) },
  { page: "go", theme: "Pop-Ups This Week", blurb: "Here today, gone soon — don't miss it.", resolve: byCategory("pop-up") },
  { page: "go", theme: "What's Happening in the City This Week", blurb: "Fresh picks, hot off the feed.", resolve: mostRecentTrending },
  { page: "solo", theme: "Best Solo Coffee Spots", blurb: "A table for one, please.", resolve: byKeyword(["coffee", "café", "cafe", "espresso"]) },
  { page: "solo", theme: "Quietest Corners to Read", blurb: "Bring a book, stay a while.", resolve: byKeyword(["library", "book", "quiet", "reading"]) },
];

const MIN_MATCHES = 3;

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");
  const secret = req.headers.get("x-cron-secret");
  if (!process.env.CRON_SECRET || (auth !== `Bearer ${process.env.CRON_SECRET}` && secret !== process.env.CRON_SECRET)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase: SupaClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  const [{ data: trending }, { data: partners }] = await Promise.all([
    supabase.from("city_trending").select("id,name,category,description,image_url,save_count,created_at").eq("status", "approved").limit(300),
    supabase.from("restaurant_partners").select("id,name,restaurant_type,tagline,about,cover_url,photo_urls,bloom_rating,bloom_notes,poem,bloom_tips").limit(300),
  ]);

  const trendingRows = (trending ?? []) as TrendingRow[];
  const partnerRows = (partners ?? []) as PartnerRow[];

  const weekOf = new Date().toISOString().slice(0, 10);
  const results: { theme: string; page: string; matches: number; created: boolean }[] = [];

  for (const t of THEMES) {
    const { trendingIds, partnerIds } = t.resolve(trendingRows, partnerRows);
    const totalMatches = trendingIds.length + partnerIds.length;

    if (totalMatches < MIN_MATCHES) {
      results.push({ theme: t.theme, page: t.page, matches: totalMatches, created: false });
      continue;
    }

    await supabase.from("city_spotlights").upsert({
      page: t.page,
      theme: t.theme,
      blurb: t.blurb,
      trending_ids: trendingIds,
      partner_ids: partnerIds,
      week_of: weekOf,
    }, { onConflict: "page,theme,week_of" });

    results.push({ theme: t.theme, page: t.page, matches: totalMatches, created: true });
  }

  return NextResponse.json({ ok: true, weekOf, results });
}
