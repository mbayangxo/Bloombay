import type { NextRequest } from "next/server";
import { isFounderPasswordSessionFromRequest } from "@/lib/admin-auth";
import { normalizeRole } from "@/lib/auth/roles";

/** Founder QA API — founder password session or bb_role=founder|admin */
export function isFounderQaAuthorized(request: NextRequest): boolean {
  if (isFounderPasswordSessionFromRequest(request)) return true;
  const role = normalizeRole(request.cookies.get("bb_role")?.value);
  return role === "founder" || role === "admin";
}
