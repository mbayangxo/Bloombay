/** Single source of truth for member portal navigation. */

export type MemberNavItem = {
  id: string;
  label: string;
  href: string;
  short: string;
  match: (pathname: string) => boolean;
};

const cityMatch = (p: string) =>
  p.startsWith("/member/explore") ||
  p.startsWith("/member/discover") ||
  p.startsWith("/member/maps") ||
  p.startsWith("/member/eats");

const apartmentMatch = (p: string) =>
  p === "/member/lounge" ||
  p.startsWith("/member/bouquet") ||
  p.startsWith("/member/bloomies") ||
  p.startsWith("/member/vault") ||
  p.startsWith("/member/girl-code") ||
  p.startsWith("/member/profile/qr") ||
  p.startsWith("/member/plans");

const happeningsMatch = (p: string) =>
  p.startsWith("/member/happenings") ||
  p.startsWith("/member/calendar") ||
  p.startsWith("/member/tonight") ||
  p.startsWith("/member/plan");

const lobbyMatch = (p: string) =>
  p === "/member/room" ||
  p.startsWith("/member/bulletin") ||
  p.startsWith("/member/mailbox") ||
  p.startsWith("/member/settings") ||
  p.startsWith("/member/scan") ||
  p.startsWith("/member/check-in") ||
  p.startsWith("/member/safety");

const introsMatch = (p: string) =>
  p.startsWith("/member/intros") ||
  p.startsWith("/member/connect") ||
  p.startsWith("/member/bloom-request");

const homeMatch = (p: string) => p === "/member/home" || p === "/member/tonight";

/** Desktop sidebar — full place list */
export const MEMBER_SIDEBAR_NAV: MemberNavItem[] = [
  { id: "home", label: "Home", href: "/member/home", short: "Home", match: homeMatch },
  {
    id: "happenings",
    label: "Happenings",
    href: "/member/happenings",
    short: "Events",
    match: happeningsMatch,
  },
  {
    id: "calendar",
    label: "Calendar",
    href: "/member/calendar",
    short: "Calendar",
    match: (p) => p.startsWith("/member/calendar"),
  },
  { id: "clubs", label: "Clubs", href: "/member/clubs", short: "Clubs", match: (p) => p.startsWith("/member/clubs") },
  {
    id: "intros",
    label: "Introductions",
    href: "/member/intros",
    short: "Intros",
    match: introsMatch,
  },
  { id: "city", label: "City", href: "/member/explore", short: "City", match: cityMatch },
  { id: "apartment", label: "Apartment", href: "/member/lounge", short: "Apartment", match: apartmentMatch },
  { id: "lobby", label: "Lobby", href: "/member/room", short: "Lobby", match: lobbyMatch },
];

/** Mobile bottom bar — five primary places */
export const MEMBER_BOTTOM_TABS: MemberNavItem[] = [
  { id: "home", label: "Home", href: "/member/home", short: "Home", match: homeMatch },
  {
    id: "happenings",
    label: "Happenings",
    href: "/member/happenings",
    short: "Happenings",
    match: happeningsMatch,
  },
  { id: "clubs", label: "Clubs", href: "/member/clubs", short: "Clubs", match: (p) => p.startsWith("/member/clubs") },
  { id: "city", label: "City", href: "/member/explore", short: "City", match: cityMatch },
  { id: "intros", label: "Introductions", href: "/member/intros", short: "Intros", match: introsMatch },
];
