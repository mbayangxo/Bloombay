import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getAuthUser } from "@/lib/auth/get-user";
import { ClubLandingPage } from "@/app/components/portal/club-landing";
import type { ClubLandingData, ClubTradition } from "@/app/components/portal/club-landing";

export default async function ClubPage({ params }: { params: { id: string } }) {
  const user = await getAuthUser();
  if (!user) redirect("/member/login");

  const supabase = await createClient();

  // Support both UUID-format IDs (legacy seed clubs) and slug-format IDs (Cursor clubs)
  const isUuid = /^[0-9a-f-]{36}$/i.test(params.id);
  const query = supabase
    .from("clubs")
    .select("id, slug, name, description, tagline, primary_color, accent_color, color, dark_bg, member_count, owner_id, category, membership_type, cover_url, crest_symbol, crest_accent, layout_key, welcome_line");

  const { data: club, error: clubError } = await (
    isUuid
      ? query.eq("id", params.id).single()
      : query.eq("slug", params.id).single()
  );

  if (clubError || !club) notFound();

  // Fetch owner profile — check both full_name (Cursor) and first_name (schema.sql)
  const { data: owner } = await supabase
    .from("profiles")
    .select("full_name, first_name, bio, avatar_url")
    .eq("id", club.owner_id)
    .single();

  // Check membership via Cursor's club_memberships (slug-based) or legacy user_clubs (id-based)
  const clubSlug = (club.slug as string | null) ?? params.id;
  const [{ data: membershipBySlug }, { data: membershipById }] = await Promise.all([
    supabase
      .from("club_memberships")
      .select("joined_at")
      .eq("user_id", user.id)
      .eq("club_slug", clubSlug)
      .maybeSingle(),
    supabase
      .from("user_clubs")
      .select("joined_at")
      .eq("user_id", user.id)
      .eq("club_id", club.id)
      .maybeSingle(),
  ]);

  const membership = membershipBySlug ?? membershipById;

  // Traditions
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

  // Resolve column names across both schemas
  const clubColor = (club.primary_color as string | null) ?? (club.color as string | null) ?? "#FF1F7D";
  const accentColor = (club.accent_color as string | null) ?? "#3a0018";
  const clubTagline = (club.tagline as string | null) ?? extractTagline(club.description as string | null);
  const mamaName = (owner?.full_name as string | null) ?? (owner?.first_name as string | null) ?? "Club Mama";

  const clubData: ClubLandingData = {
    id: club.id,
    name: club.name,
    tagline: clubTagline,
    about: (club.description as string | null) ?? "",
    whoItsFor: (club.description as string | null) ?? "",
    whatMembersDo: [],
    tags: ([club.category] as (string | null)[]).filter(Boolean) as string[],
    city: "New York",
    neighborhood: "",
    memberCount: (club.member_count as number | null) ?? 0,
    color: clubColor,
    crestBg: accentColor,
    darkBg: !!(club.dark_bg as boolean | null),
    mamaName,
    mamaTitle: `${club.name} Club Mama`,
    mamaBio: (owner?.bio as string | null) ?? "",
    accessType: resolveAccessType(club.membership_type as string | null),
    entryStyle: "open",
    upcomingSeats: [],
    traditions,
    aboutNote: (club.welcome_line as string | null) ?? undefined,
  };

  return <ClubLandingPage club={clubData} isMember={isMember} daysInClub={daysInClub} />;
}

function extractTagline(description: string | null): string {
  if (!description) return "";
  const first = description.split(/[.!?]/)[0].trim();
  return first.length > 80 ? first.slice(0, 78) + "…" : first;
}

function resolveAccessType(membershipType: string | null): "free" | "one_time" | "subscription" {
  if (membershipType === "subscription") return "subscription";
  if (membershipType === "paid" || membershipType === "one_time") return "one_time";
  return "free";
}
