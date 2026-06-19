// GET: fetch introductions feed (newest first, 20 limit)
// POST: upsert own introduction (unique per user)
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(_req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data } = await supabase
    .from("introductions")
    .select("id, bio, arrival_status, neighborhood, interests, flower_count, created_at, user_id, profiles!inner(first_name, full_name, avatar_url)")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(20);

  return NextResponse.json(data ?? []);
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { bio, arrival_status, neighborhood, interests } = body;
  if (!bio || bio.length < 10) return NextResponse.json({ error: "Bio too short." }, { status: 400 });

  const { data, error } = await supabase
    .from("introductions")
    .upsert({ user_id: user.id, bio, arrival_status: arrival_status ?? "local", neighborhood, interests: interests ?? [] }, { onConflict: "user_id" })
    .select("id")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, id: data.id });
}
