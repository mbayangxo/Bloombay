import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAuthUser } from "@/lib/auth/get-user";

// GET /api/yande/context?user_id=...
// Users can only read their own context; admins/founders can read any.
export async function GET(req: NextRequest) {
  const authUser = await getAuthUser();
  if (!authUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = req.nextUrl.searchParams.get("user_id");
  if (!userId) return NextResponse.json({ error: "user_id required" }, { status: 400 });

  const db = createAdminClient();

  // Enforce: users can only access their own context
  if (userId !== authUser.id) {
    const { data: actor } = await db.from("profiles").select("role").eq("id", authUser.id).single();
    if (!actor || !["admin", "founder"].includes(actor.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  const { data, error } = await db
    .from("yande_user_context")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? {});
}

// POST /api/yande/context — upsert context for a member
// Users can only write their own context; admins/founders can write any.
export async function POST(req: NextRequest) {
  const authUser = await getAuthUser();
  if (!authUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { user_id, ...updates } = body;

  if (!user_id) return NextResponse.json({ error: "user_id required" }, { status: 400 });

  const db = createAdminClient();

  if (user_id !== authUser.id) {
    const { data: actor } = await db.from("profiles").select("role").eq("id", authUser.id).single();
    if (!actor || !["admin", "founder"].includes(actor.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  const { data, error } = await db
    .from("yande_user_context")
    .upsert({ user_id, ...updates, last_updated: new Date().toISOString() }, { onConflict: "user_id" })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
