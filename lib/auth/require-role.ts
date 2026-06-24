/**
 * Centralised server-side role guards for API route handlers.
 *
 * Usage:
 *   const guard = await requireRole(req, ["admin", "founder"]);
 *   if (guard.error) return guard.error;   // NextResponse 401/403
 *   const { user, role } = guard;
 */
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import type { UserRole } from "@/lib/auth/roles";
import { normalizeRole } from "@/lib/auth/roles";

type GuardSuccess = { user: { id: string; email?: string }; role: UserRole; error: null };
type GuardFailure = { user: null; role: null; error: NextResponse };
type GuardResult = GuardSuccess | GuardFailure;

function supabaseFromRequest(req: NextRequest) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return req.cookies.getAll(); },
        setAll() {},
      },
    }
  );
}

/**
 * Verify the caller is authenticated and has one of the required roles.
 * Fetches the user's role from profiles.role.
 */
export async function requireRole(
  req: NextRequest,
  allowed: UserRole[]
): Promise<GuardResult> {
  const supabase = supabaseFromRequest(req);
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return {
      user: null,
      role: null,
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const role = normalizeRole(profile?.role);

  if (!allowed.includes(role)) {
    return {
      user: null,
      role: null,
      error: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    };
  }

  return { user: { id: user.id, email: user.email }, role, error: null };
}

/** Require any authenticated user (role doesn't matter). */
export async function requireAuth(req: NextRequest): Promise<GuardResult> {
  const supabase = supabaseFromRequest(req);
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return {
      user: null,
      role: null,
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const role = normalizeRole(profile?.role);
  return { user: { id: user.id, email: user.email }, role, error: null };
}

/** Shorthand: require admin or founder. Replaces verifyAdminRequest(). */
export async function requireAdmin(req: NextRequest): Promise<GuardResult> {
  return requireRole(req, ["admin", "founder"]);
}
