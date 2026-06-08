/** Explore — girl gems, guides, favorites (universe, not city calendar). */

import { CLUBS } from "@/app/member/clubs/club-data";
import { partnerPageHref } from "@/lib/partner-brand/catalog";
import { GATHERINGS } from "@/lib/member-portal-data";
import { isClubDiscoverable } from "@/lib/club-signals";

export type ExploreGem = {
  id: string;
  title: string;
  meta: string;
  tag: string;
  href: string;
};

export const EXPLORE_GIRL_GEMS: ExploreGem[] = [
  { id: "gg1", title: "The Rose Room", meta: "Girl-tested · intimate dinner · West Village", tag: "Hidden gem", href: partnerPageHref("The Rose Room") },
  { id: "gg2", title: "Lella fez", meta: "First-date approved · candlelight · Nolita", tag: "Date night", href: "/member/eats" },
  { id: "gg3", title: "Brooklyn Art Haus", meta: "Solo-friendly gallery walk · DUMBO", tag: "Culture", href: "/member/happenings" },
];

export const EXPLORE_NEIGHBORHOOD_GUIDES: ExploreGem[] = [
  { id: "ng1", title: "Williamsburg primer", meta: "Coffee, runs, supper clubs", tag: "Brooklyn", href: "/member/explore" },
  { id: "ng2", title: "Harlem & Uptown", meta: "Wellness, books, founder dinners", tag: "Manhattan", href: "/member/explore" },
  { id: "ng3", title: "New to NYC — week one", meta: "Seats, clubs, and The Room wall", tag: "New arrivals", href: "/member/room" },
];

export const EXPLORE_NYC_NEW: ExploreGem[] = [
  { id: "nyc1", title: "Your first 30 days", meta: "Welcome seat + new in town club", tag: "BloomBay", href: "/member/home" },
  { id: "nyc2", title: "Starter gatherings", meta: "Low-pressure first events", tag: "Events", href: "/member/happenings" },
];

export const EXPLORE_WORK_CAFE: ExploreGem[] = [
  { id: "wc1", title: "La Bodega Cafe", meta: "Work-friendly · outlets · soft music", tag: "Cafe", href: partnerPageHref("La Bodega Cafe") },
  { id: "wc2", title: "BloomBay HQ lounge", meta: "Members-only cowork hours", tag: "Founder favorite", href: "/member/happenings" },
];

export const EXPLORE_FOUNDER_FAVES: ExploreGem[] = [
  { id: "ff1", title: "Founding Mothers salon", meta: "Invite-only mentorship", tag: "Founder", href: "/member/lounge" },
  { id: "ff2", title: "Sunday founder breakfast", meta: "SoHo · monthly", tag: "Flagship", href: "/member/happenings" },
];

export const EXPLORE_WELLNESS: ExploreGem[] = [
  { id: "we1", title: "Sunrise pilates pier", meta: "Girl-tested instructors", tag: "Wellness", href: "/member/happenings?tab=solo" },
  { id: "we2", title: "Sound bath circle", meta: "Thursday evenings · Chelsea", tag: "Restore", href: "/member/happenings" },
];

export const EXPLORE_CLUBS = CLUBS.filter((c) => isClubDiscoverable(c.id)).map((c) => ({
  id: c.id,
  title: c.name,
  meta: `${c.category} · ${c.members.toLocaleString()} members`,
  href: `/member/clubs/${c.id}`,
}));

export const EXPLORE_GATHERINGS = GATHERINGS.slice(0, 6).map((g) => ({
  id: g.id,
  title: g.title,
  meta: `${g.date} · ${g.neighborhood}`,
  href: `/member/happenings/gatherings/${g.id}`,
}));

export const EXPLORE_QUICK = [
  { label: "The Lobby", href: "/member/room" },
  { label: "Happenings", href: "/member/happenings" },
  { label: "Introductions", href: "/member/intros" },
  { label: "Clubs", href: "/member/clubs" },
] as const;

export const EXPLORE_SECTIONS = [
  { id: "girl-gems", title: "Girl-tested gems", sub: "Hidden favorites vetted by women", items: EXPLORE_GIRL_GEMS },
  { id: "guides", title: "Neighborhood guides", sub: "City blocks & rhythms", items: EXPLORE_NEIGHBORHOOD_GUIDES },
  { id: "nyc", title: "New to New York", sub: "First wins & arrivals", items: EXPLORE_NYC_NEW },
  { id: "cafes", title: "Work-friendly cafes", sub: "Laptop-approved spots", items: EXPLORE_WORK_CAFE },
  { id: "founder", title: "Founder favorites", sub: "Builder energy", items: EXPLORE_FOUNDER_FAVES },
  { id: "wellness", title: "Wellness favorites", sub: "Restore & move", items: EXPLORE_WELLNESS },
] as const;
