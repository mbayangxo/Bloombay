import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function admin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

// GET /api/avenue/top-posts — top 4 wall posts by bloom count
export async function GET() {
  const supabase = admin();

  const { data, error } = await supabase
    .from("wall_posts")
    .select(`
      id, text, blooms, category, created_at, is_seed, seed_author,
      author:profiles!author_id ( id, first_name, full_name )
    `)
    .order("blooms", { ascending: false })
    .limit(4);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}
