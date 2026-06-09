/** Single source of truth for member portal navigation (V1 launch). */

export type MemberNavItem = {
  id: string;
  label: string;
  href: string;
  short: string;
  match: (pathname: string) => boolean;
};

const homeMatch = (p: string) => p === "/member/home" || p === "/member/tonight";

const cityMatch = (p: string) =>
  p.startsWith("/member/city") ||
  p.startsWith("/member/explore") ||
  p.startsWith("/member/discover") ||
  p.startsWith("/member/maps") ||
  p.startsWith("/member/eats");

const clubsMatch = (p: string) => p.startsWith("/member/clubs");

const plansMatch = (p: string) =>
  p.startsWith("/member/plans") ||
  p.startsWith("/member/calendar") ||
  p.startsWith("/member/plan");

const happeningsMatch = (p: string) =>
  p.startsWith("/member/happenings") ||
  p.startsWith("/member/tonight");

const apartmentMatch = (p: string) =>
  p === "/member/lounge" ||
  p.startsWith("/member/bouquet") ||
  p.startsWith("/member/bloomies") ||
  p.startsWith("/member/vault") ||
  p.startsWith("/member/girl-code") ||
  p.startsWith("/member/profile/qr");

/** Desktop sidebar — five primary places */
export const MEMBER_SIDEBAR_NAV: MemberNavItem[] = [
  { id: "tonight", label: "Tonight", href: "/member/home", short: "Tonight", match: homeMatch },
  { id: "city", label: "The City", href: "/member/city", short: "City", match: cityMatch },
  { id: "clubs", label: "Clubs", href: "/member/clubs", short: "Clubs", match: clubsMatch },
  { id: "plans", label: "Plans", href: "/member/plans", short: "Plans", match: plansMatch },
  {
    id: "happenings",
    label: "Happenings",
    href: "/member/happenings",
    short: "Events",
    match: happeningsMatch,
  },
];

/** Mobile bottom bar — five primary places */
export const MEMBER_BOTTOM_TABS: MemberNavItem[] = [
  { id: "tonight", label: "Tonight", href: "/member/home", short: "Tonight", match: homeMatch },
  { id: "city", label: "The City", href: "/member/city", short: "City", match: cityMatch },
  { id: "clubs", label: "Clubs", href: "/member/clubs", short: "Clubs", match: clubsMatch },
  { id: "plans", label: "Plans", href: "/member/plans", short: "Plans", match: plansMatch },
  {
    id: "happenings",
    label: "Happenings",
    href: "/member/happenings",
    short: "Happenings",
    match: happeningsMatch,
  },
];

/** Utility rail — upper right icons */
export const MEMBER_UTILITY_NAV = [
  { id: "pin-drops", label: "Pin drops", href: "/member/pin-drops" },
  { id: "mailbox", label: "Mailbox", href: "/member/notifications" },
  { id: "chats", label: "Chats", href: "/member/messages" },
  { id: "apartment", label: "My apartment", href: "/member/lounge" },
] as const;

/** Pages where mobile bottom nav is hidden (studio flows) */
export const HIDE_BOTTOM_NAV_PREFIXES = [
  "/member/clubs/create",
  "/member/happenings/create",
];

export function shouldHideBottomNav(pathname: string): boolean {
  return HIDE_BOTTOM_NAV_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );
}

/** @deprecated V1 — apartment via utility icons only */
export { apartmentMatch };
