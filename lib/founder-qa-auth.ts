import type { NextRequest } from "next/server";
import { requireRole } from "@/lib/auth/require-role";

/** Founder QA / create-space APIs — Supabase session with founder or admin role. */
export async function requireFounderQaAccess(req: NextRequest) {
  return requireRole(req, ["founder", "admin"]);
}
