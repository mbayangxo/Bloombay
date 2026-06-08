/**
 * Yande MVP — rule-based “what to do next” (no AI APIs).
 */

import { GATHERINGS, INVITATIONS, SEATS_VENUES } from "@/lib/member-portal-data";
import { getTopDiscoveryPick, rankSuggestions } from "@/lib/discovery-rank";
import { moodById } from "@/lib/discovery-mood";
import { getDiscoveryMood } from "@/lib/discovery-mood-store";
import type { YandeMemberState } from "@/lib/yande-member-state";

export type YandeNudge = {
  kicker: string;
  title: string;
  preface?: string;
  message: string;
  cta: string;
  href: string;
};

function norm(s: string) {
  return s.toLowerCase().trim();
}

function isNycArea(city: string) {
  const c = norm(city);
  return c.includes("new york") || c === "nyc" || c.includes("brooklyn");
}

function isWilliamsburgArea(neighborhood: string, city: string) {
  const n = norm(neighborhood);
  const c = norm(city);
  return n.includes("williamsburg") || c.includes("williamsburg");
}

function bestNearbySeat(state: YandeMemberState) {
  const hood = norm(state.neighborhood);
  return (
    SEATS_VENUES.find((s) => norm(s.area).includes(hood) || hood.includes(norm(s.area))) ??
    SEATS_VENUES.find((s) => norm(s.area).includes("williamsburg")) ??
    SEATS_VENUES[0]
  );
}

function bestGatheringSeat(state: YandeMemberState) {
  const hood = norm(state.neighborhood);
  return (
    GATHERINGS.find((g) => norm(g.neighborhood).includes(hood) || hood.includes(norm(g.neighborhood))) ??
    GATHERINGS[0]
  );
}

/** Priority-ordered rules — first match wins. */
export function getYandeNudge(state: YandeMemberState): YandeNudge {
  if (!state.verified) {
    return {
      kicker: "From Yande",
      title: "Your Daily Bloom",
      preface: "A little nudge from Yande",
      message: "Complete verification to unlock Happenings, Seats, and club worlds.",
      cta: "Finish Verification",
      href: "/member/onboarding",
    };
  }

  if (state.clubsJoinedCount === 0) {
    return {
      kicker: "Yande noticed",
      title: "Your Daily Bloom",
      preface: "Yande says",
      message: "You haven't chosen a club yet. I saved three that match your energy.",
      cta: "Walk the houses",
      href: "/member/clubs/discover",
    };
  }

  const mood = typeof window !== "undefined" ? getDiscoveryMood() : null;
  const topPick = getTopDiscoveryPick({
    city: state.city,
    neighborhood: state.neighborhood,
  });
  if (mood && topPick) {
    const m = moodById(mood);
    return {
      kicker: "From Yande",
      title: "Your Daily Bloom",
      preface: "Matched to your mood",
      message: `${m?.emoji ?? ""} Feeling ${m?.label.toLowerCase() ?? mood}? ${topPick.title} — ${topPick.meta}.`,
      cta: topPick.kind === "seat" ? "See the Seat" : "View pick",
      href: topPick.href,
    };
  }

  if (state.upcomingPlansCount === 0 && topPick) {
    return {
      kicker: "From Yande",
      title: "Your Daily Bloom",
      preface: "Yande thinks you may like…",
      message: `Nothing on your Girl Calendar yet — start with ${topPick.title}.`,
      cta: "Add from Happenings",
      href: "/member/happenings",
    };
  }

  const nearbySeat = bestNearbySeat(state);
  const openInvites = INVITATIONS.filter((i) => i.status === "new").length;
  if (openInvites > 0 && isNycArea(state.city)) {
    return {
      kicker: "From Yande",
      title: "Your Daily Bloom",
      preface: "Yande thinks you may like…",
      message: `A new Seat is forming near you — ${nearbySeat.name} in ${nearbySeat.area}.`,
      cta: "See the Seat",
      href: "/member/happenings/seats",
    };
  }

  if (isWilliamsburgArea(state.neighborhood, state.city)) {
    const bookSeats = 3;
    return {
      kicker: "From Yande",
      title: "Your Daily Bloom",
      preface: "A little nudge from Yande",
      message: `${bookSeats} Book Club seats opened near Williamsburg.`,
      cta: "See the Seat",
      href: "/member/happenings/seats",
    };
  }

  const gathering = bestGatheringSeat(state);
  if (gathering && norm(gathering.neighborhood).includes("chelsea")) {
    return {
      kicker: "From Yande",
      title: "Your Daily Bloom",
      preface: "Yande thinks you may like…",
      message: "Dinner Circle is forming in Chelsea — soft evening, deep conversation.",
      cta: "See the Seat",
      href: `/member/happenings/gatherings/${gathering.id}`,
    };
  }

  if (state.bouquetFilled < state.bouquetMax) {
    const room = state.bouquetMax - state.bouquetFilled;
    return {
      kicker: "From Yande",
      title: "Your Daily Bloom",
      preface: "A little nudge from Yande",
      message: `Your Bouquet has room for ${room} more Bloomie${room === 1 ? "" : "s"}.`,
      cta: "Add Bloomies",
      href: "/member/bouquet",
    };
  }


  if (state.clubsJoinedCount > 0 && state.clubsJoinedCount < 2) {
    return {
      kicker: "From Yande",
      title: "Your Daily Bloom",
      preface: "Yande thinks you may like…",
      message: "Founder Girls has 2 women like you waiting — say hi in the club world.",
      cta: "Open Happenings",
      href: "/member/happenings?tab=gatherings",
    };
  }

  return {
    kicker: "From Yande",
    title: "Your Daily Bloom",
    preface: "Yande thinks you may like…",
    message: `${gathering.title} at ${gathering.venue} — ${gathering.neighborhood}, ${gathering.date}.`,
    cta: "See the Seat",
    href: `/member/happenings/gatherings/${gathering.id}`,
  };
}

export type YandeSuggestion = { label: string; href: string; kind: "seat" | "club" | "bloom" | "happening" };

/** Secondary picks shown under Daily Bloom */
export function getYandeSuggestions(state: YandeMemberState): YandeSuggestion[] {
  const gathering = bestGatheringSeat(state);
  const seat = bestNearbySeat(state);
  const ranked = rankSuggestions(
    { city: state.city, neighborhood: state.neighborhood },
    typeof window !== "undefined" ? getDiscoveryMood() : null,
    [],
    3
  );
  const fromRank: YandeSuggestion[] = ranked.map((p) => ({
    label: `${p.tag} · ${p.title}`,
    href: p.href,
    kind: p.kind === "seat" ? "seat" : p.kind === "connect" ? "bloom" : p.kind === "club" ? "club" : "happening",
  }));
  const fallback: YandeSuggestion[] = [
    { label: `Seat · ${seat.name}`, href: "/member/happenings/seats", kind: "seat" },
    { label: `Happening · ${gathering.title}`, href: `/member/happenings/gatherings/${gathering.id}`, kind: "happening" },
    { label: "Bloom request · Intros", href: "/member/intros", kind: "bloom" },
  ];
  if (!state.verified) return fallback.slice(1);
  return fromRank.length > 0 ? fromRank : fallback;
}

/** Default export for tests / Storybook later */
export const YANDE_MOCK_STATE: YandeMemberState = {
  verified: true,
  clubsJoinedCount: 1,
  bouquetFilled: 2,
  bouquetMax: 12,
  city: "New York",
  neighborhood: "Williamsburg",
  upcomingPlansCount: 2,
  onboardingComplete: true,
};
