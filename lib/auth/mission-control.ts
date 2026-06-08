import type { PortalId, UserRole } from "@/lib/auth/roles";

export const FOUNDER_LOGIN_ROLES: UserRole[] = ["founder"];
/** Shared login at /admin/login — curator app is separate after sign-in. */
export const ADMIN_LOGIN_ROLES: UserRole[] = ["admin", "moderator", "curator"];
/** @deprecated use ADMIN_LOGIN_ROLES */
export const CURATOR_LOGIN_ROLES: UserRole[] = ["curator"];

export function canSignInFounderPortal(role: UserRole): boolean {
  return FOUNDER_LOGIN_ROLES.includes(role);
}

export function canSignInAdminPortal(role: UserRole): boolean {
  return ADMIN_LOGIN_ROLES.includes(role);
}

export function canSignInCuratorPortal(role: UserRole): boolean {
  return role === "curator";
}

export function isFounder(role: UserRole): boolean {
  return role === "founder";
}

export function isAdminStaff(role: UserRole): boolean {
  return role === "admin";
}

export function isModerator(role: UserRole): boolean {
  return role === "moderator";
}

export type MissionControlCapability =
  | "overview"
  | "women"
  | "cities"
  | "clubs"
  | "happenings"
  | "bloom_requests"
  | "hosts"
  | "verification"
  | "safety"
  | "applications"
  | "partners"
  | "inbox"
  | "submissions"
  | "careers"
  | "reports"
  | "team_pay"
  | "yande"
  | "markets"
  | "neighborhoods"
  | "qa_lab"
  | "create_space"
  | "messaging"
  | "girls_working";

const CAPS: Record<MissionControlCapability, UserRole[]> = {
  overview: ["founder", "admin", "moderator"],
  women: ["founder", "admin"],
  cities: ["founder", "admin"],
  clubs: ["founder", "admin"],
  happenings: ["founder", "admin"],
  bloom_requests: ["founder", "admin", "moderator"],
  hosts: ["founder", "admin"],
  verification: ["founder", "admin", "moderator"],
  safety: ["founder", "admin", "moderator"],
  applications: ["founder", "admin"],
  partners: ["founder", "admin"],
  inbox: ["founder", "admin", "moderator"],
  submissions: ["founder", "admin"],
  careers: ["founder"],
  reports: ["founder", "admin"],
  team_pay: ["founder"],
  yande: ["founder"],
  markets: ["founder"],
  neighborhoods: ["founder"],
  qa_lab: ["founder", "admin"],
  create_space: ["founder"],
  messaging: ["founder", "admin"],
  girls_working: ["founder", "admin"],
};

export type CuratorCapability = "overview" | "gatherings" | "women" | "events";

const CURATOR_CAPS: Record<CuratorCapability, boolean> = {
  overview: true,
  gatherings: true,
  women: true,
  events: true,
};

export function canMissionControl(role: UserRole, cap: MissionControlCapability): boolean {
  if (!canSignInFounderPortal(role) && !canSignInAdminPortal(role)) return false;
  return CAPS[cap].includes(role);
}

export function canCuratorPortal(_role: UserRole, cap: CuratorCapability): boolean {
  return CURATOR_CAPS[cap];
}

function pathToMcCap(pathname: string, prefix: "/founder" | "/admin"): string {
  return pathname.replace(prefix, "/admin");
}

export function capabilityForStaffPath(
  pathname: string,
  portal: "founder" | "admin"
): MissionControlCapability | null {
  const p = pathToMcCap(pathname, portal === "founder" ? "/founder" : "/admin");
  if (p.startsWith("/admin/dashboard")) return "overview";
  if (p.startsWith("/admin/people")) return "women";
  if (p.startsWith("/admin/cities")) return "cities";
  if (p.startsWith("/admin/clubs")) return "clubs";
  if (p.startsWith("/admin/events")) return "happenings";
  if (p.startsWith("/admin/bloom-requests")) return "bloom_requests";
  if (p.startsWith("/admin/team")) return "team_pay";
  if (p.startsWith("/admin/invites")) return "team_pay";
  if (p.startsWith("/admin/club-hosts")) return "hosts";
  if (p.startsWith("/admin/verification")) return "verification";
  if (p.startsWith("/admin/safety")) return "safety";
  if (p.startsWith("/admin/applications")) return "applications";
  if (p.startsWith("/admin/partners")) return "partners";
  if (p.startsWith("/admin/inbox")) return "inbox";
  if (p.startsWith("/admin/messaging")) return "messaging";
  if (p.startsWith("/admin/girls-working")) return "girls_working";
  if (p.startsWith("/admin/submissions")) return "submissions";
  if (p.startsWith("/admin/careers")) return "careers";
  if (p.startsWith("/admin/reports")) return "reports";
  if (p.startsWith("/admin/yande")) return "yande";
  if (p.startsWith("/admin/markets")) return "markets";
  if (p.startsWith("/admin/neighborhoods")) return "neighborhoods";
  if (p.startsWith("/admin/qa-lab")) return "qa_lab";
  if (p.startsWith("/admin/create")) return "create_space";
  return null;
}

/** @deprecated use capabilityForStaffPath */
export function capabilityForAdminPath(pathname: string): MissionControlCapability | null {
  if (pathname.startsWith("/founder")) return capabilityForStaffPath(pathname, "founder");
  return capabilityForStaffPath(pathname, "admin");
}

export const ROLE_DISPLAY: Record<UserRole, string> = {
  founder: "Founder",
  admin: "Admin",
  moderator: "Moderator",
  member: "Member",
  club_owner: "Club owner",
  partner: "Partner",
  curator: "Curator",
};
