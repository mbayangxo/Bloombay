import type { NextRequest } from "next/server";
import { requireRole } from "@/lib/auth/require-role";

/** Founder QA API — DB-backed admin/founder role from profiles. */
export async function isFounderQaAuthorized(request: NextRequest): Promise<boolean> {
  const guard = await requireRole(request, ["founder", "admin"]);
  return guard.error === null;
}
