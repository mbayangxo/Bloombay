/**
 * QA Lab routes — driven by portal identity + Mission Control nav (not hardcoded page lists in UI).
 */

import { canMissionControl } from "@/lib/auth/mission-control";
import type { UserRole } from "@/lib/auth/roles";
import { PORTALS } from "@/lib/portal-identity";
import { MC_NAV } from "@/lib/portal-navigation";

export type QaViewportId = "mobile" | "tablet" | "desktop";

export type QaPortalId =
  | "member"
  | "founder"
  | "admin"
  | "club_owner"
  | "partner"
  | "curator"
  | "public";

export type QaRoute = {
  id: string;
  label: string;
  path: string;
  portal: QaPortalId;
};

export const QA_VIEWPORTS: Record<
  QaViewportId,
  { label: string; width: number; height: number }
> = {
  mobile: { label: "Mobile", width: 390, height: 844 },
  tablet: { label: "Tablet", width: 834, height: 1112 },
  desktop: { label: "Desktop", width: 1280, height: 800 },
};

export const QA_PORTAL_OPTIONS: { id: QaPortalId; label: string; hint: string }[] = [
  { id: "member", label: "Member", hint: "Women in the city — clubs, happenings, apartment" },
  { id: "founder", label: "Founder", hint: "Mission Control — Yande, markets, QA" },
  { id: "admin", label: "Operations", hint: "Admin / moderator tooling" },
  { id: "club_owner", label: "Clubhouse", hint: "Club hosts — events, members" },
  { id: "partner", label: "Partner", hint: "Venues — bookings & revenue" },
  { id: "curator", label: "Curator", hint: "Field curators — gatherings & women" },
  { id: "public", label: "Public & logins", hint: "Portals index and sign-in screens" },
];

function staffQaRoutes(
  base: "/founder" | "/admin",
  portal: "founder" | "admin",
  role: UserRole
): QaRoute[] {
  return MC_NAV.flatMap((section) =>
    section.items
      .filter((item) => canMissionControl(role, item.cap))
      .map((item) => ({
        id: `${portal}${item.path.replace(/\//g, "-")}`,
        label: item.label,
        path: `${base}${item.path}`,
        portal,
      }))
  );
}

const MEMBER_QA_ROUTES: QaRoute[] = [
  { id: "m-home", label: "Home", path: PORTALS.member.home, portal: "member" },
  { id: "m-city", label: "The City", path: "/member/explore", portal: "member" },
  { id: "m-clubs", label: "Clubs", path: "/member/clubs", portal: "member" },
  { id: "m-happenings", label: "Happenings", path: "/member/happenings", portal: "member" },
  { id: "m-confetti", label: "Confetti", path: "/member/happenings/confetti/cf-birthday-lexi", portal: "member" },
  { id: "m-plans", label: "Plans", path: "/member/plans", portal: "member" },
  { id: "m-calendar", label: "Girl Calendar", path: "/member/calendar", portal: "member" },
  { id: "m-intros", label: "Introductions", path: "/member/intros", portal: "member" },
  { id: "m-apartment", label: "Apartment", path: "/member/lounge", portal: "member" },
  { id: "m-lobby", label: "Lobby", path: "/member/room", portal: "member" },
  { id: "m-mailbox", label: "Mailbox", path: "/member/mailbox", portal: "member" },
  { id: "m-ping", label: "Ping", path: "/member/notifications", portal: "member" },
  { id: "m-settings", label: "Settings", path: "/member/settings", portal: "member" },
  { id: "m-login", label: "Login", path: PORTALS.member.login, portal: "member" },
];

const CLUB_OWNER_QA_ROUTES: QaRoute[] = [
  { id: "co-home", label: "Dashboard", path: PORTALS.clubhouse.home, portal: "club_owner" },
  { id: "co-events", label: "Events studio", path: "/club-owner/events-studio", portal: "club_owner" },
  { id: "co-gatherings", label: "Gatherings", path: "/club-owner/gatherings", portal: "club_owner" },
  { id: "co-members", label: "Women", path: "/club-owner/members", portal: "club_owner" },
  { id: "co-login", label: "Login", path: PORTALS.clubhouse.login, portal: "club_owner" },
];

const PARTNER_QA_ROUTES: QaRoute[] = [
  { id: "p-home", label: "Dashboard", path: PORTALS.partner.home, portal: "partner" },
  { id: "p-bookings", label: "Bookings", path: "/partner/bookings", portal: "partner" },
  { id: "p-profile", label: "Profile", path: "/partner/profile", portal: "partner" },
  { id: "p-login", label: "Login", path: PORTALS.partner.login, portal: "partner" },
];

const CURATOR_QA_ROUTES: QaRoute[] = [
  { id: "cu-home", label: "Dashboard", path: PORTALS.curator.home, portal: "curator" },
  { id: "cu-gatherings", label: "Gatherings", path: "/curator/gatherings", portal: "curator" },
  { id: "cu-women", label: "Women", path: "/curator/women", portal: "curator" },
  { id: "cu-login", label: "Login (Operations)", path: PORTALS.curator.login, portal: "curator" },
];

const PUBLIC_QA_ROUTES: QaRoute[] = [
  { id: "pub-portals", label: "All portals", path: "/portals", portal: "public" },
  { id: "pub-founder-login", label: "Founder login", path: PORTALS.founder.login, portal: "public" },
  { id: "pub-admin-login", label: "Operations login", path: PORTALS.admin.login, portal: "public" },
  { id: "pub-club-login", label: "Clubhouse login", path: PORTALS.clubhouse.login, portal: "public" },
  { id: "pub-partner-login", label: "Partner login", path: PORTALS.partner.login, portal: "public" },
  { id: "pub-member-landing", label: "Member landing", path: "/member", portal: "public" },
];

export const QA_ROUTES_BY_PORTAL: Record<QaPortalId, QaRoute[]> = {
  member: MEMBER_QA_ROUTES,
  founder: staffQaRoutes("/founder", "founder", "founder"),
  admin: staffQaRoutes("/admin", "admin", "admin"),
  club_owner: CLUB_OWNER_QA_ROUTES,
  partner: PARTNER_QA_ROUTES,
  curator: CURATOR_QA_ROUTES,
  public: PUBLIC_QA_ROUTES,
};

export const ALL_QA_ROUTES: QaRoute[] = [
  ...MEMBER_QA_ROUTES,
  ...QA_ROUTES_BY_PORTAL.founder,
  ...QA_ROUTES_BY_PORTAL.admin,
  ...CLUB_OWNER_QA_ROUTES,
  ...PARTNER_QA_ROUTES,
  ...CURATOR_QA_ROUTES,
  ...PUBLIC_QA_ROUTES,
];

export function routesForPortal(portal: QaPortalId): QaRoute[] {
  return QA_ROUTES_BY_PORTAL[portal] ?? [];
}

export function defaultRouteForPortal(portal: QaPortalId): string {
  const routes = routesForPortal(portal);
  return routes[0]?.path ?? "/portals";
}

/** @deprecated use QA_ROUTES_BY_PORTAL.member */
export const MEMBER_QA_ROUTES_LEGACY = MEMBER_QA_ROUTES;

export const QA_BRAND_CHECKLIST = [
  "Palette: white, Barbie pink (#ffe4ec), hot pink (#ff0055), black (#1a0514) — no stray blue/plum/brown UI",
  "Typography: Barlow Condensed headlines, DM Sans UI, Cormorant accents",
  "Each portal has a distinct login skin (rose / plum / ticket / venue) — not one generic form",
  "Layout: content flush to nav on desktop — no dead white gutters",
  "Member: Ping + Mailbox labels (not “notifications” in UI)",
  "Headers small; primary content (doors, cards, calendar) dominates",
] as const;
