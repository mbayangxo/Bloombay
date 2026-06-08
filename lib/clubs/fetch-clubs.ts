import { createClient } from "@/lib/supabase/server";
import { getAesthetic } from "./aesthetic-presets";
import { OFFICIAL_CLUBS, getOfficialClub } from "./official-clubs";
import type { PortalClub } from "./types";

type DbClub = {
  slug: string;
  name: string;
  tagline: string | null;
  description: string | null;
  cover_url: string | null;
  banner_url: string | null;
  logo_url: string | null;
  logo_template: string | null;
  logo_text: string | null;
  crest_image_url: string | null;
  welcome_line: string | null;
  primary_color: string | null;
  accent_color: string | null;
  crest_symbol: string | null;
  crest_accent: string | null;
  aesthetic_key: string | null;
  category: string | null;
  layout_key: string | null;
  default_happening_template: string | null;
};

function mapDbClub(row: DbClub): PortalClub {
  const aesthetic = getAesthetic(row.aesthetic_key ?? "bloombay-rose");
  return {
    slug: row.slug,
    name: row.name,
    tagline: row.tagline ?? "",
    description: row.description ?? "",
    category: row.category ?? "Club",
    isOfficial: false,
    memberCount: 0,
    color: row.primary_color ?? aesthetic.primaryColor,
    accentColor: row.accent_color ?? aesthetic.accentColor,
    crestBg: aesthetic.crestBg,
    curator: "Club Mama",
    tags: row.category ? [row.category] : [],
    vibe: row.tagline ?? "Member-led club on BloomBay.",
    coverUrl: row.cover_url,
    bannerUrl: row.banner_url,
    logoUrl: row.logo_url,
    logoTemplate: row.logo_template,
    logoText: row.logo_text,
    crestImageUrl: row.crest_image_url,
    welcomeLine: row.welcome_line,
    crestSymbol: row.crest_symbol,
    crestAccent: row.crest_accent,
    aestheticKey: row.aesthetic_key,
    layoutKey: row.layout_key,
    defaultHappeningTemplate: row.default_happening_template,
    source: "database",
  };
}

/** Official clubs + onboarded clubs from DB (no fake demo clubs). */
export async function fetchPortalClubs(): Promise<{
  clubs: PortalClub[];
  onboardedCount: number;
  source: "db" | "official-only";
}> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("clubs")
    .select(
      "slug, name, tagline, description, cover_url, banner_url, logo_url, logo_template, logo_text, crest_image_url, welcome_line, primary_color, accent_color, crest_symbol, crest_accent, aesthetic_key, category, layout_key, default_happening_template"
    )
    .order("updated_at", { ascending: false });

  if (error?.message.includes("does not exist")) {
    return { clubs: [...OFFICIAL_CLUBS], onboardedCount: 0, source: "official-only" };
  }

  const officialSlugs = new Set(OFFICIAL_CLUBS.map((c) => c.slug));
  const onboarded = (data ?? [])
    .filter((row) => !officialSlugs.has(row.slug))
    .map((row) => mapDbClub(row as DbClub));

  // Merge official with DB overrides (cover, etc.)
  const mergedOfficial = OFFICIAL_CLUBS.map((official) => {
    const db = data?.find((r) => r.slug === official.slug);
    if (!db) return official;
    const mapped = mapDbClub(db as DbClub);
    return {
      ...official,
      ...mapped,
      isOfficial: true,
      source: "official" as const,
      coverUrl: mapped.coverUrl ?? official.coverUrl,
      bannerUrl: mapped.bannerUrl ?? official.bannerUrl,
    };
  });

  return {
    clubs: [...mergedOfficial, ...onboarded],
    onboardedCount: onboarded.length,
    source: "db",
  };
}

export async function fetchPortalClubBySlug(slug: string): Promise<PortalClub | null> {
  const official = getOfficialClub(slug);
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("clubs")
    .select(
      "slug, name, tagline, description, cover_url, banner_url, logo_url, logo_template, logo_text, crest_image_url, welcome_line, primary_color, accent_color, crest_symbol, crest_accent, aesthetic_key, category, layout_key, default_happening_template"
    )
    .eq("slug", slug)
    .maybeSingle();

  if (error?.message.includes("does not exist")) {
    return official ?? null;
  }

  if (data) {
    const mapped = mapDbClub(data as DbClub);
    if (official) return { ...official, ...mapped, isOfficial: true, source: "official" };
    return mapped;
  }

  return official ?? null;
}
