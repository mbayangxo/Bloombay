import {
  canAccessPortal,
  homeForRole,
  roleToPortal,
  type PortalId,
  type UserRole,
} from "@/lib/auth/roles";

function nextMatchesPortal(next: string, portal: PortalId): boolean {
  if (portal === "member") return next.startsWith("/member");
  if (portal === "founder") return next.startsWith("/founder");
  if (portal === "admin") return next.startsWith("/admin");
  if (portal === "club_owner") return next.startsWith("/club-owner");
  if (portal === "partner") return next.startsWith("/partner");
  if (portal === "curator") return next.startsWith("/curator");
  return false;
}

export function safePathAfterLogin(
  role: UserRole,
  portal: PortalId,
  next?: string | null
): string {
  if (!canAccessPortal(role, portal)) {
    return homeForRole(role);
  }

  const home = homeForRole(role);
  const appPortal = roleToPortal(role);
  if (!next || !next.startsWith("/")) return home;
  if (!nextMatchesPortal(next, appPortal)) return home;
  return next;
}

/** Company portal — route by profile role only (no portal picker). */
export function homeAfterCompanyLogin(role: UserRole, next?: string | null): string {
  const home = homeForRole(role);
  const appPortal = roleToPortal(role);
  if (!next || !next.startsWith("/")) return home;
  if (!nextMatchesPortal(next, appPortal)) return home;
  return next;
}
