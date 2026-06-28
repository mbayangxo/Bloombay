import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getAuthUser } from "@/lib/auth/get-user";

function admin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

const STAFF_ROLES = ["admin", "founder", "moderator", "curator"];

async function checkAccess() {
  const user = await getAuthUser();
  if (!user) return { user: null, profile: null };
  const supabase = admin();
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();
  return { user, profile };
}

// GET /api/founder/moderation?verdict=needs_review&limit=50
export async function GET(req: NextRequest) {
  const { user, profile } = await checkAccess();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!STAFF_ROLES.includes(profile?.role ?? "")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const verdict = req.nextUrl.searchParams.get("verdict") ?? "needs_review";
  const limit = Math.min(Number(req.nextUrl.searchParams.get("limit") ?? "50"), 100);

  const supabase = admin();
  let query = supabase
    .from("content_moderation")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (verdict !== "all") query = query.eq("verdict", verdict);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ items: data ?? [] });
}

// PATCH /api/founder/moderation — update a verdict
export async function PATCH(req: NextRequest) {
  const { user, profile } = await checkAccess();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!["admin", "founder", "moderator"].includes(profile?.role ?? "")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json() as { id: string; verdict: "approved" | "rejected" };
  if (!body.id || !["approved", "rejected"].includes(body.verdict)) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const supabase = admin();
  const { error } = await supabase
    .from("content_moderation")
    .update({
      verdict: body.verdict,
      reviewed_by: user.id,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", body.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
