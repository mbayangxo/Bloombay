/** Single source for portal nav + footer links (no hardcoded paths in UI). */

import type { StaffBase } from "@/lib/mc-paths";
import { mcPath } from "@/lib/mc-paths";
import type { MissionControlCapability } from "@/lib/auth/mission-control";
import { COMPANY_LOGIN, type PortalId } from "@/lib/auth/roles";
import { PORTALS } from "@/lib/portal-identity";

export type NavLink = { label: string; href: string; external?: boolean };

export const MEMBER_NAV: NavLink[] = [
  { label: "Home", href: "/member/home" },
  { label: "Clubs", href: "/member/clubs" },
  { label: "Happenings", href: "/member/happenings" },
  { label: "Introductions", href: "/member/intros" },
  { label: "Apartment", href: "/member/lounge" },
  { label: "Lobby", href: "/member/room" },
  { label: "The City", href: "/member/explore" },
];

export const CLUB_OWNER_NAV: NavLink[] = [
  { label: "Home", href: "/club-owner/dashboard" },
  { label: "Events studio", href: "/club-owner/events-studio" },
  { label: "Gatherings", href: "/club-owner/gatherings" },
  { label: "Women", href: "/club-owner/members" },
  { label: "Applications", href: "/club-owner/applications" },
  { label: "Tickets & QR", href: "/club-owner/events" },
  { label: "Settings", href: "/club-owner/settings" },
];

export const PARTNER_NAV: NavLink[] = [
  { label: "Dashboard", href: "/partner" },
  { label: "Brand", href: "/partner/brand" },
  { label: "Boom drops", href: "/partner/drops" },
  { label: "Profile", href: "/partner/profile" },
  { label: "Availability", href: "/partner/availability" },
  { label: "Bookings", href: "/partner/bookings" },
  { label: "Revenue", href: "/partner/revenue" },
  { label: "Messages", href: "/partner/messages" },
  { label: "Reviews", href: "/partner/reviews" },
];

export const CURATOR_NAV: NavLink[] = [
  { label: "Home", href: "/curator/dashboard" },
  { label: "Gatherings", href: "/curator/gatherings" },
  { label: "Women", href: "/curator/women" },
  { label: "Pay", href: "/curator/pay" },
];

/** Mission Control sidebar items (path suffix + capability). */
export const MC_NAV: {
  title: string;
  items: { label: string; path: string; cap: MissionControlCapability }[];
}[] = [
  {
    title: "Mission",
    items: [
      { label: "Overview", path: "/dashboard", cap: "overview" },
      { label: "Women", path: "/people", cap: "women" },
      { label: "Cities", path: "/cities", cap: "cities" },
      { label: "Clubs", path: "/clubs", cap: "clubs" },
      { label: "Happenings", path: "/events", cap: "happenings" },
      { label: "Bloom requests", path: "/bloom-requests", cap: "bloom_requests" },
    ],
  },
  {
    title: "People & trust",
    items: [
      { label: "Curators & pay", path: "/team", cap: "team_pay" },
      { label: "Portal invites", path: "/invites", cap: "team_pay" },
      { label: "Hosts", path: "/club-hosts", cap: "hosts" },
      { label: "Verification", path: "/verification", cap: "verification" },
      { label: "Safety", path: "/safety", cap: "safety" },
    ],
  },
  {
    title: "Operations",
    items: [
      { label: "Applications", path: "/applications", cap: "applications" },
      { label: "Partners", path: "/partners", cap: "partners" },
      { label: "Mailroom", path: "/inbox", cap: "inbox" },
      { label: "Messaging Studio", path: "/messaging", cap: "messaging" },
      { label: "Girls Working", path: "/girls-working", cap: "girls_working" },
      { label: "Submissions", path: "/submissions", cap: "submissions" },
      { label: "Careers", path: "/careers", cap: "careers" },
    ],
  },
  {
    title: "Create",
    items: [{ label: "Create space", path: "/create", cap: "create_space" }],
  },
  {
    title: "System",
    items: [
      { label: "Live preview & QA", path: "/qa-lab", cap: "qa_lab" },
      { label: "Reports", path: "/reports", cap: "reports" },
      { label: "Yande", path: "/yande", cap: "yande" },
      { label: "Markets", path: "/markets", cap: "markets" },
      { label: "Neighborhoods", path: "/neighborhoods", cap: "neighborhoods" },
    ],
  },
];

export function mcNavLinks(base: StaffBase): NavLink[] {
  return MC_NAV.flatMap((s) =>
    s.items.map((i) => ({ label: i.label, href: `${base}${i.path}` }))
  );
}

export type LoginVariant =
  | "member"
  | "founder"
  | "admin"
  | "club_owner"
  | "partner";

const LOGIN_VARIANT_PORTAL: Record<LoginVariant, PortalId> = {
  member: "member",
  founder: "founder",
  admin: "admin",
  club_owner: "club_owner",
  partner: "partner",
};

export function portalFromLoginVariant(variant: LoginVariant): PortalId {
  return LOGIN_VARIANT_PORTAL[variant];
}

export function portalFromStaffBase(base: "/founder" | "/admin"): PortalId {
  return base === "/founder" ? "founder" : "admin";
}

export const LOGIN_CROSS_LINKS: Record<LoginVariant, NavLink[]> = {
  member: [
    { label: "Company sign-in (staff)", href: COMPANY_LOGIN },
    { label: "BloomBay home", href: "/" },
  ],
  founder: [
    { label: "All portals", href: "/portals" },
    { label: "BloomBay home", href: "/" },
  ],
  admin: [
    { label: "All portals", href: "/portals" },
    { label: "BloomBay home", href: "/" },
  ],
  club_owner: [
    { label: "All portals", href: "/portals" },
    { label: "BloomBay home", href: "/" },
  ],
  partner: [
    { label: "All portals", href: "/portals" },
    { label: "BloomBay home", href: "/" },
  ],
};

/** Footer quick links per portal (subset of main nav). */
export function portalFooterLinks(
  portal: "member" | "club_owner" | "partner" | "curator" | "founder" | "admin"
): NavLink[] {
  switch (portal) {
    case "member":
      return MEMBER_NAV;
    case "club_owner":
      return CLUB_OWNER_NAV;
    case "partner":
      return PARTNER_NAV;
    case "curator":
      return CURATOR_NAV;
    case "founder":
      return mcNavLinks("/founder");
    case "admin":
      return mcNavLinks("/admin");
    default:
      return [];
  }
}

export function mcAdminHref(path: string, base: StaffBase = "/admin"): string {
  return mcPath(path.startsWith("/admin") ? path : `/admin${path}`, base);
}
