import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { logBehaviorSignal } from "@/lib/truth/behavior";

export async function GET(request: Request) {
  const supabase = await createClient();
  const { searchParams } = new URL(request.url);
  const kind = searchParams.get("kind");

  let query = supabase
    .from("community_posts")
    .select(
      "id, author_user_id, author_name, kind, title, neighborhood, city, budget, move_in, body, reply_count, created_at"
    )
    .order("created_at", { ascending: false })
    .limit(80);

  if (kind && kind !== "all") {
    query = query.eq("kind", kind);
  }

  const { data, error } = await query;

  if (error) {
    if (error.message.includes("does not exist")) {
      return NextResponse.json({ posts: [], source: "demo" });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ posts: data ?? [], source: "db" });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ ok: false, error: "Sign in required" }, { status: 401 });
  }

  let body: {
    kind?: string;
    title?: string;
    authorName?: string;
    neighborhood?: string;
    city?: string;
    budget?: string;
    moveIn?: string;
    body?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const kinds = ["roommate", "question", "sublease", "favor"] as const;
  if (!body.kind || !kinds.includes(body.kind as (typeof kinds)[number])) {
    return NextResponse.json({ ok: false, error: "Invalid kind" }, { status: 400 });
  }
  if (!body.body?.trim() || !body.title?.trim()) {
    return NextResponse.json({ ok: false, error: "title and body required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("community_posts")
    .insert({
      author_user_id: user.id,
      author_name: body.authorName?.trim() || "You",
      kind: body.kind,
      title: body.title.trim(),
      neighborhood: body.neighborhood?.trim() || null,
      city: body.city?.trim() || "New York",
      budget: body.budget?.trim() || null,
      move_in: body.moveIn?.trim() || null,
      body: body.body.trim(),
    })
    .select()
    .single();

  if (error) {
    if (error.message.includes("does not exist")) {
      return NextResponse.json(
        { ok: false, error: "Run supabase/migrations/007_community_theme_safety.sql" },
        { status: 503 }
      );
    }
    return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
  }

  await logBehaviorSignal(supabase, user.id, "community_post_created", { postId: data.id, kind: body.kind });

  return NextResponse.json({ ok: true, post: data });
}
