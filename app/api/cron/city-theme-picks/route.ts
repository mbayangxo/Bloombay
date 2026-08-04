// ── Weekly City theme spotlights ─────────────────────────────────────────────
// Groups REAL approved city_trending + restaurant_partners rows into themed
// picks ("Best Croissants This Week", "Best Matcha This Month") for the Eat,
// Go, and Solo pages. Pure keyword matching against real rows — never
// invents a place. A theme is skipped entirely for the week if there isn't
// enough real data to back it up, so nothing fabricated ever ships.

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

interface Theme {
  page: "eat" | "go" | "solo";
  theme: string;
  blurb: string;
  keywords: string[];
}

const THEMES: Theme[] = [
  { page: "eat", theme: "Best Croissants This Week", blurb: "Flaky, buttery, worth the carbs.", keywords: ["croissant", "boulangerie", "patisserie", "pastry"] },
  { page: "eat", theme: "Best Bagels This Week", blurb: "The city's yummiest bagels, per the Bloomies.", keywords: ["bagel"] },
  { page: "eat", theme: "Best Matcha This Month", blurb: "Where to get the good green stuff.", keywords: ["matcha"] },
  { page: "eat", theme: "Cutest Breakfast Spots", blurb: "Morning plans, sorted.", keywords: ["breakfast", "brunch", "pancake", "bagels and coffee"] },
  { page: "go", theme: "Best Ways to Spend Summer", blurb: "Warm-weather, girl-coded plans.", keywords: ["outdoor", "rooftop", "park", "garden", "beach", "picnic"] },
  { page: "go", theme: "Best Museums Right Now", blurb: "Culture, but make it cute.", keywords: ["museum", "gallery", "exhibit", "exhibition"] },
  { page: "go", theme: "Free This Week", blurb: "Zero-dollar plans that still feel special.", keywords: ["free"] },
  { page: "solo", theme: "Best Solo Coffee Spots", blurb: "A table for one, please.", keywords: ["coffee", "café", "cafe", "espresso"] },
  { page: "solo", theme: "Quietest Corners to Read", blurb: "Bring a book, stay a while.", keywords: ["library", "book", "quiet", "reading"] },
];

const MIN_MATCHES = 3;

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");
  const secret = req.headers.get("x-cron-secret");
  if (!process.env.CRON_SECRET || (auth !== `Bearer ${process.env.CRON_SECRET}` && secret !== process.env.CRON_SECRET)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  const [{ data: trending }, { data: partners }] = await Promise.all([
    supabase.from("city_trending").select("id,name,category,description").eq("status", "approved").limit(200),
    supabase.from("restaurant_partners").select("id,name,restaurant_type,tagline,about").limit(200),
  ]);

  const trendingRows = (trending ?? []) as { id: string; name: string; category: string; description: string | null }[];
  const partnerRows = (partners ?? []) as { id: string; name: string; restaurant_type: string; tagline: string | null; about: string | null }[];

  const weekOf = new Date().toISOString().slice(0, 10);
  const results: { theme: string; page: string; matches: number; created: boolean }[] = [];

  for (const t of THEMES) {
    const matchedTrending = trendingRows.filter((r) => {
      const haystack = `${r.name} ${r.category} ${r.description ?? ""}`.toLowerCase();
      return t.keywords.some((k) => haystack.includes(k));
    }).slice(0, 6);

    const matchedPartners = partnerRows.filter((r) => {
      const haystack = `${r.name} ${r.restaurant_type} ${r.tagline ?? ""} ${r.about ?? ""}`.toLowerCase();
      return t.keywords.some((k) => haystack.includes(k));
    }).slice(0, 6);

    const totalMatches = matchedTrending.length + matchedPartners.length;

    if (totalMatches < MIN_MATCHES) {
      results.push({ theme: t.theme, page: t.page, matches: totalMatches, created: false });
      continue;
    }

    await supabase.from("city_spotlights").upsert({
      page: t.page,
      theme: t.theme,
      blurb: t.blurb,
      trending_ids: matchedTrending.map((r) => r.id),
      partner_ids: matchedPartners.map((r) => r.id),
      week_of: weekOf,
    }, { onConflict: "page,theme,week_of" });

    results.push({ theme: t.theme, page: t.page, matches: totalMatches, created: true });
  }

  return NextResponse.json({ ok: true, weekOf, results });
}
