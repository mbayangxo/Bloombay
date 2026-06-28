import type { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth/require-role";

// ── Legacy password-session stubs ─────────────────────────────────────────────
// Password-based admin login is disabled — /api/admin/login returns 410.
// These stubs satisfy imports across the codebase without re-enabling auth.

/** Cookie name kept for sign-out cleanup only. */
export const ADMIN_COOKIE = "bb_admin_session";

/** Placeholder UID — never matches a real profile. */
export const FOUNDER_PASSWORD_UID = "00000000-0000-0000-0000-000000000000";

/** Always false — password session auth is permanently disabled. */
export function isFounderPasswordSession(_value: string | undefined): boolean {
  return false;
}

/** Always false — password session auth is permanently disabled. */
export function isFounderPasswordSessionFromRequest(_req: NextRequest): boolean {
  return false;
}

// ── Active auth ───────────────────────────────────────────────────────────────

/** Verify admin via Supabase session — user must have role admin or founder. */
export async function verifyAdminRequest(req: NextRequest): Promise<boolean> {
  const guard = await requireAdmin(req);
  return guard.error === null;
}
