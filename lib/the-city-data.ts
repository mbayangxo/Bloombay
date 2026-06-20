/** The City — what should I do today? (not a friend-finder; a living guide) */

import type { CityMomentTie } from "@/lib/city-moment-ties";
import { partnerPageHref } from "@/lib/partner-brand/catalog";

export type CitySectionId = "eat" | "go" | "solo" | "moments" | "trending";

export type CityPick = {
  id: string;
  line: string;
  sub: string;
  href: string;
  accent?: "hot" | "barbie" | "rose";
};

export type CityCard = {
  id: string;
  title: string;
  meta: string;
  detail?: string;
  tag: string;
  href: string;
  womenRated?: boolean;
};

export type CityMoment = {
  id: string;
  place: string;
  caption: string;
  author: string;
  when: string;
  href: string;
  tie: CityMomentTie;
};

/** Jump nav — Moments first, visible without scrolling. */
export const CITY_NAV = [
  { id: "moments", label: "Moments", href: "#moments" },
  { id: "eat", label: "Eat", href: "#eat" },
  { id: "go", label: "Go", href: "#go" },
  { id: "solo", label: "Solo", href: "#solo" },
  { id: "pins", label: "Pins", href: "#pins" },
  { id: "trending", label: "Trending", href: "#trending" },
] as const;

export type CityNavId = (typeof CITY_NAV)[number]["id"];

export const CITY_HERO = {
  eyebrow: "Utility · city guide",
  title: "What should I do today?",
  whisper: "Eat, go, wander solo, and see what women are loving right now — opens from your apartment when you need it.",
};

export const CITY_PICKS: CityPick[] = [
  {
    id: "brunch",
    line: "Best solo brunch this week",
    sub: "Girls are loving this corner table",
    href: "/member/eats",
    accent: "barbie",
  },
  {
    id: "cocktail",
    line: "Safest cocktail bar this month",
    sub: "Host-verified · well-lit exits",
    href: "/member/maps",
    accent: "hot",
  },
  {
    id: "rooftop",
    line: "New rooftop everyone is talking about",
    sub: "Williamsburg · golden hour",
    href: "/member/happenings",
    accent: "rose",
  },
  {
    id: "solo",
    line: "Safest spaces to go alone",
    sub: "Women-rated · staff who get it",
    href: "#solo",
    accent: "barbie",
  },
  {
    id: "hood",
    line: "Trending neighborhood",
    sub: "Fort Greene · coffee → supper",
    href: "#trending",
    accent: "hot",
  },
];

export const CITY_SECTIONS: {
  id: CitySectionId;
  title: string;
  sub: string;
  objectLabel: string;
}[] = [
  {
    id: "eat",
    title: "Eat",
    sub: "Women-rated restaurants, dishes, and menu items worth ordering.",
    objectLabel: "Taste",
  },
  {
    id: "go",
    title: "Go",
    sub: "Museums, parks, events, and experiences women are actually booking.",
    objectLabel: "Wander",
  },
  {
    id: "solo",
    title: "Solo",
    sub: "Places you can walk into alone and still feel held.",
    objectLabel: "Alone, not lonely",
  },
  {
    id: "trending",
    title: "Trending",
    sub: "What women in the city are talking about this week.",
    objectLabel: "Pulse",
  },
];

export const CITY_EAT: CityCard[] = [
  {
    id: "e1",
    title: "The Rose Room",
    meta: "West Village · intimate dinner",
    detail: "Women-rated dish: burrata & fire-roasted peppers",
    tag: "Girl-tested",
    href: partnerPageHref("The Rose Room"),
    womenRated: true,
  },
  {
    id: "e2",
    title: "Lella",
    meta: "Nolita · candlelight",
    detail: "Most-ordered: saffron pasta, no-phone tables",
    tag: "Date night",
    href: "/member/eats",
    womenRated: true,
  },
  {
    id: "e3",
    title: "Sant Ambroeus",
    meta: "SoHo · Saturday seats",
    detail: "Best solo brunch · corner banquette",
    tag: "Brunch",
    href: partnerPageHref("Sant Ambroeus"),
    womenRated: true,
  },
  {
    id: "e4",
    title: "Café Gitane",
    meta: "Nolita · morning light",
    detail: "Women-rated: almond croissant + almond milk cortado",
    tag: "Café",
    href: partnerPageHref("Café Gitane"),
    womenRated: true,
  },
];

export const CITY_GO: CityCard[] = [
  {
    id: "g1",
    title: "Brooklyn Art Haus",
    meta: "DUMBO · gallery walk",
    detail: "Solo-friendly · women host tours Fri",
    tag: "Culture",
    href: "/member/happenings",
  },
  {
    id: "g2",
    title: "Sunset pier pilates",
    meta: "East River · this week",
    detail: "Open mat · come alone, leave with three names",
    tag: "Move",
    href: "/member/happenings?tab=solo",
  },
  {
    id: "g3",
    title: "Fort Greene Park reading hour",
    meta: "Sunday · Page Turners club",
    detail: "Bring a book — no performance required",
    tag: "Park",
    href: "/member/clubs/the-page-turners",
  },
  {
    id: "g4",
    title: "Gallery opening — Emerging Black Artists",
    meta: "Fotografiska · Thu 7pm",
    detail: "After Dark club · dress up optional",
    tag: "Night",
    href: "/member/happenings",
  },
];

export const CITY_SOLO: CityCard[] = [
  {
    id: "s1",
    title: "La Bodega Cafe",
    meta: "Williamsburg · laptop OK",
    detail: "Solo bar seats · barista remembers your order",
    tag: "Work & wander",
    href: "/member/maps",
    womenRated: true,
  },
  {
    id: "s2",
    title: "The Light Studio",
    meta: "Chelsea · sound bath",
    detail: "Women-only floor · shoes off, phones away",
    tag: "Restore",
    href: "/member/happenings?tab=solo",
  },
  {
    id: "s3",
    title: "BloomBay reading nook",
    meta: "Members lounge hour",
    detail: "Host on site · no awkward solo stigma",
    tag: "BloomBay",
    href: "/member/lounge",
  },
  {
    id: "s4",
    title: "Prospect Park loop",
    meta: "Morning Run Club route",
    detail: "6am group — or walk it alone after",
    tag: "Outside",
    href: "/member/clubs/morning-run-club",
  },
];

export const CITY_MOMENTS: CityMoment[] = [
  {
    id: "m1",
    place: "Café Gitane · Nolita",
    caption: "Almond croissant + rain on the window — staying another hour.",
    author: "Zara",
    when: "2h ago",
    href: "/member/eats",
    tie: { kind: "cafe", label: "Café Gitane", neighborhood: "Nolita" },
  },
  {
    id: "m2",
    place: "Fort Greene Park",
    caption: "Book, blanket, no plans. This is the afternoon.",
    author: "Imani",
    when: "Yesterday",
    href: "/member/maps#pins",
    tie: { kind: "place", label: "Fort Greene Park", neighborhood: "Brooklyn" },
  },
  {
    id: "m3",
    place: "Wythe Hotel rooftop",
    caption: "Golden hour mocktail — girls at the next table adopted me.",
    author: "Kemi",
    when: "3d ago",
    href: "/member/happenings",
    tie: { kind: "feeling", label: "Golden hour", at: "Wythe rooftop", neighborhood: "Williamsburg" },
  },
];

export const CITY_TRENDING: CityCard[] = [
  {
    id: "t1",
    title: "“Where do you feel safe after 10pm?”",
    meta: "412 women answered · After Dark",
    detail: "Thread pinned in the lobby",
    tag: "Talking",
    href: "/member/room",
  },
  {
    id: "t2",
    title: "Fort Greene is having a moment",
    meta: "Coffee → vintage → supper in one walk",
    tag: "Neighborhood",
    href: "/member/explore#eat",
  },
  {
    id: "t3",
    title: "Lisbon trip filling fast",
    meta: "Wander Women · 12 seats left",
    tag: "Travel",
    href: "/member/clubs/wander-women",
  },
  {
    id: "t4",
    title: "Sound bath waitlist opened",
    meta: "Wellness Circle · Thu release",
    tag: "Restore",
    href: "/member/happenings",
  },
];

export function cityCardsForSection(id: CitySectionId): CityCard[] {
  switch (id) {
    case "eat":
      return CITY_EAT;
    case "go":
      return CITY_GO;
    case "solo":
      return CITY_SOLO;
    case "trending":
      return CITY_TRENDING;
    default:
      return [];
  }
}
