import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as adminClient } from "@supabase/supabase-js";

function admin() {
  return adminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

// GET /api/wall/posts?category=all&limit=30&offset=0
export async function GET(req: NextRequest) {
  const category = req.nextUrl.searchParams.get("category") ?? "all";
  const limit = Math.min(Number(req.nextUrl.searchParams.get("limit") ?? "30"), 50);
  const offset = Number(req.nextUrl.searchParams.get("offset") ?? "0");

  const supabase = admin();
  let query = supabase
    .from("wall_posts")
    .select(`
      id, category, text, blooms, created_at, is_seed, seed_author,
      author:profiles!author_id ( id, first_name, full_name )
    `)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (category !== "all") query = query.eq("category", category);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

// POST /api/wall/posts — create a post (requires auth)
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json() as { category: string; text: string };
  if (!body.text?.trim()) return NextResponse.json({ error: "Text required" }, { status: 400 });

  const { data, error } = await supabase
    .from("wall_posts")
    .insert({ author_id: user.id, category: body.category ?? "mood", text: body.text.trim() })
    .select(`id, category, text, blooms, created_at, author:profiles!author_id ( id, first_name, full_name )`)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
