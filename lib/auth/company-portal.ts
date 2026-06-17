import type { UserRole } from "@/lib/auth/roles";

/** Roles that use /company — not community members. */
export const COMPANY_PORTAL_ROLES: UserRole[] = [
  "founder",
  "admin",
  "club_owner",
  "partner",
  "moderator",
  "curator",
];

export function canUseCompanyPortal(role: UserRole): boolean {
  return role !== "member";
}
