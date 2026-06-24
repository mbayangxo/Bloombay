import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getAuthUser } from "@/lib/auth/get-user";
import { ClubLandingPage } from "@/app/components/portal/club-landing";
import type { ClubLandingData, ClubTradition, ClubCustomization } from "@/app/components/portal/club-landing";

export default async function ClubPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getAuthUser();
  if (!user) redirect("/member/login");

  const supabase = await createClient();

  const { id } = await params;
  // Support both UUID-format IDs (legacy seed data) and slug-format
  const isUuid = /^[0-9a-f-]{36}$/i.test(id);
  const baseQuery = supabase
    .from("clubs")
    .select(`
      id, slug, owner_id, name, tagline, description, welcome_line,
      primary_color, accent_color, category, membership_type,
      cover_url, crest_symbol, crest_accent, layout_key,
      is_paid, price_cents, member_limit,
      landing_copy, inside_copy, logo_typography, brand_display_mode
    `);

  const { data: club, error: clubError } = isUuid
    ? await baseQuery.eq("id", id).single()
    : await baseQuery.eq("slug", id).single();

  if (clubError || !club) notFound();

  // Fetch owner profile — full_name is primary (Cursor), first_name as fallback
  const { data: owner } = await supabase
    .from("profiles")
    .select("full_name, first_name, bio, avatar_url")
    .eq("id", club.owner_id)
    .single();

  // Check membership via club_memberships (Cursor's table, keyed by club_slug)
  const clubSlug = (club.slug as string | null) ?? id;
  const { data: membership } = await supabase
    .from("club_memberships")
    .select("joined_at")
    .eq("user_id", user.id)
    .eq("club_slug", clubSlug)
    .maybeSingle();

  // Club customization (crest, colors, layout)
  let customization: ClubCustomization | undefined;
  try {
    const { data: cx } = await supabase
      .from("club_customization")
      .select("crest_shape, crest_symbol, crest_color_primary, crest_color_secondary, crest_color_accent, accent_color, cover_url")
      .eq("club_id", club.id)
      .maybeSingle();
    if (cx) customization = cx as ClubCustomization;
  } catch {}

  // Traditions (new table from migration 025)
  let traditions: ClubTradition[] = [];
  try {
    const { data: rows } = await supabase
      .from("club_traditions")
      .select("id, name, description, frequency, emoji, since_year")
      .eq("club_id", club.id)
      .order("sort_order", { ascending: true });
    traditions = (rows ?? []).map(r => ({
      id: r.id,
      name: r.name,
      description: r.description ?? undefined,
      frequency: r.frequency,
      emoji: r.emoji ?? "✨",
      sinceYear: r.since_year ?? null,
    }));
  } catch {}

  const isMember = !!membership;
  const daysInClub = membership?.joined_at
    ? Math.floor((Date.now() - new Date(membership.joined_at).getTime()) / 86400000)
    : 0;

  const clubColor = (club.primary_color as string | null) ?? "#FF1F7D";
  const accentColor = (club.accent_color as string | null) ?? "#3a0018";
  const mamaName = (owner?.full_name as string | null)
    ?? (owner?.first_name as string | null)
    ?? "Club Mama";

  const clubData: ClubLandingData = {
    id: club.id,
    name: club.name,
    tagline: (club.tagline as string | null) ?? extractTagline(club.description as string | null),
    about: (club.description as string | null) ?? "",
    whoItsFor: (club.landing_copy as string | null) ?? (club.description as string | null) ?? "",
    whatMembersDo: [],
    tags: ([club.category] as (string | null)[]).filter(Boolean) as string[],
    city: "New York",
    neighborhood: "",
    memberCount: (club.member_limit as number | null) ?? 0,
    color: clubColor,
    crestBg: accentColor,
    darkBg: false,
    mamaName,
    mamaTitle: `${club.name} Club Mama`,
    mamaBio: (owner?.bio as string | null) ?? "",
    accessType: resolveAccessType(club.membership_type as string | null, club.is_paid as boolean | null),
    entryStyle: "open",
    upcomingSeats: [],
    traditions,
    aboutNote: (club.welcome_line as string | null) ?? undefined,
  };

  const isOwner = club.owner_id === user.id;
  return <ClubLandingPage club={clubData} isMember={isMember} daysInClub={daysInClub} isOwner={isOwner} customization={customization} />;
}

function extractTagline(description: string | null): string {
  if (!description) return "";
  const first = description.split(/[.!?]/)[0].trim();
  return first.length > 80 ? first.slice(0, 78) + "…" : first;
}

function resolveAccessType(
  membershipType: string | null,
  isPaid: boolean | null
): "free" | "one_time" | "subscription" {
  if (membershipType === "subscription") return "subscription";
  if (isPaid || membershipType === "paid") return "one_time";
  return "free";
}
