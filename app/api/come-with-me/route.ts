import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(_req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data } = await supabase
    .from("come_with_me_posts")
    .select("id, post, activity, when_text, emoji, spots_left, created_at, user_id, profiles!inner(first_name, full_name, avatar_url, neighborhood)")
    .gt("expires_at", new Date().toISOString())
    .order("created_at", { ascending: false })
    .limit(15);

  return NextResponse.json(data ?? []);
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { post, activity, when_text, emoji, spots_left } = body;
  if (!post || !activity) return NextResponse.json({ error: "post and activity required" }, { status: 400 });

  const { data, error } = await supabase
    .from("come_with_me_posts")
    .insert({ user_id: user.id, post, activity, when_text, emoji: emoji ?? "🌸", spots_left: spots_left ?? 1 })
    .select("id").single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, id: data.id });
}
