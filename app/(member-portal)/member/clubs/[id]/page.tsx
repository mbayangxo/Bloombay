import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getAuthUser } from "@/lib/auth/get-user";
import { ClubLandingPage } from "@/app/components/portal/club-landing";
import type { ClubLandingData, ClubTradition } from "@/app/components/portal/club-landing";

export default async function ClubPage({ params }: { params: { id: string } }) {
  const user = await getAuthUser();
  if (!user) redirect("/member/login");

  const supabase = await createClient();

  // Fetch club — only columns that definitely exist in the base schema
  const { data: club, error: clubError } = await supabase
    .from("clubs")
    .select("id, name, description, color, dark_bg, member_count, owner_id, neighborhood, emoji, category, membership_type")
    .eq("id", params.id)
    .single();

  if (clubError || !club) notFound();

  // Fetch owner profile
  const { data: owner } = await supabase
    .from("profiles")
    .select("first_name, bio, avatar_url")
    .eq("id", club.owner_id)
    .single();

  // Check if current user is a member
  const { data: membership } = await supabase
    .from("user_clubs")
    .select("joined_at")
    .eq("user_id", user.id)
    .eq("club_id", params.id)
    .maybeSingle();

  // Fetch traditions (table may not exist yet — fail silently)
  let traditions: ClubTradition[] = [];
  try {
    const { data: rows } = await supabase
      .from("club_traditions")
      .select("id, name, description, frequency, emoji, since_year")
      .eq("club_id", params.id)
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

  // Map DB row to ClubLandingData
  const mamaName = owner?.first_name ? `${owner.first_name}.` : "Club Mama";
  const accessType =
    club.membership_type === "subscription" ? "subscription" as const
    : club.membership_type === "paid" ? "one_time" as const
    : "free" as const;

  const clubData: ClubLandingData = {
    id: club.id,
    name: club.name,
    tagline: extractTagline(club.description),
    about: club.description ?? "",
    whoItsFor: club.description ?? "",
    whatMembersDo: [],
    tags: ([club.category, club.neighborhood] as (string | null)[]).filter(Boolean) as string[],
    city: "New York",
    neighborhood: (club.neighborhood as string | null) ?? "",
    memberCount: (club.member_count as number | null) ?? 0,
    color: (club.color as string | null) ?? "#FF1F7D",
    darkBg: !!(club.dark_bg as boolean | null),
    mamaName,
    mamaTitle: `${club.name} Club Mama`,
    mamaBio: owner?.bio ?? "",
    accessType,
    entryStyle: "open",
    upcomingSeats: [],
    traditions,
  };

  return <ClubLandingPage club={clubData} isMember={isMember} daysInClub={daysInClub} />;
}

function extractTagline(description: string | null): string {
  if (!description) return "";
  const first = description.split(/[.!?]/)[0].trim();
  return first.length > 80 ? first.slice(0, 78) + "…" : first;
}
