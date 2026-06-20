/** Rich club profiles — landing, join rules, zones, world UI */

import { CLUBS, type Club } from "@/app/member/clubs/club-data";
import { awardMemberCrest, removeMemberCrest } from "@/lib/crest-system";

export type ClubPricing = "free" | "one_time" | "subscription";
export type ClubJoinMode = "open" | "request" | "invite";

export type ClubJoinSettings = {
  mode: ClubJoinMode;
  pricing: ClubPricing;
  priceLabel?: string;
  payTiming: "before" | "after";
  autoApprove: boolean;
  /** Full marketing landing vs minimal hero + join only */
  useLandingPage?: boolean;
};

export type ClubLeaderboardStat = {
  label: string;
  rank: number;
  hint?: string;
};

export type ClubZone = {
  id: string;
  name: string;
  tagline: string;
  members: number;
  hereNow: number;
  tone: string;
  joined?: boolean;
};

export type ClubPhoto = {
  id: string;
  caption: string;
  gradient: string;
  imageUrl?: string;
};

export type ClubBrandingFields = {
  heroImage?: string;
  tagline?: string;
  description?: string;
  welcomeLine?: string;
};

export type ClubProfile = Club & {
  city: string;
  hereNow: number;
  momentsToday: number;
  healthScore: number;
  healthLabel: string;
  rankPopular: number;
  lastActive: string;
  leaderboardBlurb: string;
  leaderboards: ClubLeaderboardStat[];
  photos: ClubPhoto[];
  landingHeroImage?: string;
  join: ClubJoinSettings;
  zones: ClubZone[];
  pinnedNote?: string;
};

const DEFAULT_JOIN: ClubJoinSettings = {
  mode: "open",
  pricing: "free",
  payTiming: "after",
  autoApprove: true,
  useLandingPage: true,
};

const DEFAULT_LEADERBOARDS: ClubLeaderboardStat[] = [
  { label: "Popular", rank: 3, hint: "city-wide" },
  { label: "Events", rank: 5, hint: "this month" },
  { label: "Engagement", rank: 2, hint: "7-day" },
];

function photosFor(club: Club): ClubPhoto[] {
  return [
    { id: "1", caption: "Last gathering", gradient: club.gradient },
    { id: "2", caption: "The vibe", gradient: "linear-gradient(135deg,#ffb7ce,#ff2d8a)" },
    { id: "3", caption: "Our city", gradient: "linear-gradient(135deg,#121212,#ff2d8a)" },
    { id: "4", caption: "Members IRL", gradient: "linear-gradient(160deg,#ffe4ec,#ffb7ce)" },
  ];
}

function zonesFor(club: Club): ClubZone[] {
  const base = club.category;
  if (base === "Entrepreneurship" || club.name.includes("Founder")) {
    return [
      { id: "founders", name: "Founders NYC", tagline: "Build in public", members: 412, hereNow: 12, tone: "#121212", joined: true },
      { id: "coders", name: "Coders", tagline: "Ship together", members: 186, hereNow: 5, tone: "#ff2d8a", joined: true },
      { id: "biz", name: "Entrepreneurs", tagline: "Scale & support", members: 298, hereNow: 8, tone: "#ff2d8a", joined: true },
    ];
  }
  return [
    { id: "main", name: club.name, tagline: "Main chapter", members: club.members, hereNow: 8, tone: "#121212", joined: true },
    { id: "social", name: "Social circle", tagline: "Plans & dinners", members: Math.round(club.members * 0.4), hereNow: 4, tone: "#ff2d8a" },
    { id: "creators", name: "Creative souls", tagline: "Make & share", members: Math.round(club.members * 0.25), hereNow: 3, tone: "#121212" },
  ];
}

const OVERRIDES: Partial<Record<string, Partial<ClubProfile>>> = {
  "morning-run-club": {
    join: { mode: "open", pricing: "free", payTiming: "after", autoApprove: true },
    healthScore: 92,
    healthLabel: "Very active",
    rankPopular: 3,
    lastActive: "2 hours ago",
  },
  "the-page-turners": {
    join: { mode: "request", pricing: "one_time", priceLabel: "$12 / year", payTiming: "after", autoApprove: false },
    healthScore: 78,
    healthLabel: "Steady",
    rankPopular: 8,
  },
  "wander-women": {
    join: { mode: "open", pricing: "subscription", priceLabel: "$8 / month", payTiming: "before", autoApprove: true },
    healthScore: 88,
    healthLabel: "Buzzing",
    rankPopular: 2,
  },
};

function defaultJoinFor(id: string): ClubJoinSettings {
  const o = OVERRIDES[id];
  return o?.join ?? DEFAULT_JOIN;
}

/** Base profile (server-safe). Client pages should merge join via `mergeStoredJoinSettings`. */
export function getClubProfile(id: string): ClubProfile | undefined {
  const club = CLUBS.find((c) => c.id === id);
  if (!club) return undefined;
  const o = OVERRIDES[id] ?? {};
  const members = club.members;
  return {
    ...club,
    city: "New York, NY",
    hereNow: o.hereNow ?? Math.max(4, Math.round(members / 40)),
    momentsToday: o.momentsToday ?? Math.max(12, Math.round(members / 15)),
    healthScore: o.healthScore ?? 70 + (members % 25),
    healthLabel: o.healthLabel ?? (members > 200 ? "Active" : "Growing"),
    rankPopular: o.rankPopular ?? Math.max(1, 15 - Math.floor(members / 50)),
    lastActive: o.lastActive ?? "Today",
    leaderboardBlurb: "Top 10% for events created this month",
    leaderboards: (() => {
      const popular = o.rankPopular ?? Math.max(1, 15 - Math.floor(members / 50));
      if (o.leaderboards) return o.leaderboards;
      return [
        { label: "Popular", rank: popular, hint: "city-wide" },
        { label: "Events", rank: Math.max(1, popular + 2), hint: "this month" },
        { label: "Engagement", rank: Math.max(1, popular - 1), hint: "7-day" },
      ];
    })(),
    photos: o.photos ?? photosFor(club),
    join: defaultJoinFor(id),
    zones: o.zones ?? zonesFor(club),
    pinnedNote: "Girls dinner in SoHo this Friday — view happening →",
  };
}

export function mergeStoredJoinSettings(profile: ClubProfile, stored: ClubJoinSettings | null): ClubProfile {
  if (!stored) return profile;
  return { ...profile, join: stored };
}

export function mergeClubBranding(
  profile: ClubProfile,
  branding: {
    heroImage: string;
    tagline?: string;
    description?: string;
    welcomeLine?: string;
    gallery: { id: string; caption: string; imageUrl: string }[];
  }
): ClubProfile {
  const photos: ClubPhoto[] = branding.gallery.map((g) => ({
    id: g.id,
    caption: g.caption,
    gradient: profile.gradient,
    imageUrl: g.imageUrl,
  }));
  return {
    ...profile,
    landingHeroImage: branding.heroImage,
    tagline: branding.tagline ?? profile.tagline,
    description: branding.description ?? profile.description,
    welcomeMessage: branding.welcomeLine ?? profile.welcomeMessage,
    photos: photos.length ? photos : profile.photos,
  };
}

export function isClubMember(id: string): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(`bb_club_member_${id}`) === "1";
}

export function setClubMember(id: string, value: boolean) {
  if (typeof window === "undefined") return;
  if (value) {
    sessionStorage.setItem(`bb_club_member_${id}`, "1");
    const profile = getClubProfile(id);
    awardMemberCrest(id, profile?.name);
  } else {
    sessionStorage.removeItem(`bb_club_member_${id}`);
    removeMemberCrest(id);
  }
}
