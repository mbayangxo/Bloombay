/**
 * Staff role guards for admin API routes.
 * Wraps lib/auth/require-role.ts with admin-specific helpers.
 */
import type { NextRequest } from "next/server";
import { requireRole, requireAdmin as requireAdminRole } from "@/lib/auth/require-role";
import type { UserRole } from "@/lib/auth/roles";

export { requireAdminRole as requireAdmin };
export type { GuardResult } from "@/lib/auth/require-role";

/** Founder-only — destructive bulk actions (e.g. mass SMS). */
export async function requireFounder(req: NextRequest) {
  return requireRole(req, ["founder"]);
}

/** Admin, founder, or moderator — moderation queue access. */
export async function requireModeratorStaff(req: NextRequest) {
  return requireRole(req, ["admin", "founder", "moderator"]);
}

/** Extract client IP from proxy headers or fallback. */
export function getClientIp(req: NextRequest): string | null {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() ?? null;
  return req.headers.get("x-real-ip") ?? null;
}

/** Re-export for routes that need custom role sets (e.g. curator). */
export { requireRole };

export type StaffRole = Extract<UserRole, "admin" | "founder" | "moderator">;
