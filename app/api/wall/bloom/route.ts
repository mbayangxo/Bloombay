import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// POST /api/wall/bloom — toggle bloom on a post
// Body: { postId: string, bloomed: boolean }
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { postId, bloomed } = await req.json() as { postId: string; bloomed: boolean };

  if (bloomed) {
    await supabase
      .from("wall_post_blooms")
      .insert({ post_id: postId, user_id: user.id })
      .throwOnError();
  } else {
    await supabase
      .from("wall_post_blooms")
      .delete()
      .eq("post_id", postId)
      .eq("user_id", user.id)
      .throwOnError();
  }

  // Fetch updated bloom count
  const { data } = await supabase
    .from("wall_posts")
    .select("blooms")
    .eq("id", postId)
    .single();

  return NextResponse.json({ blooms: data?.blooms ?? 0 });
}

// GET /api/wall/bloom?postId=xxx — check if current user bloomed a post
export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ bloomed: false });

  const postId = req.nextUrl.searchParams.get("postId");
  if (!postId) return NextResponse.json({ bloomed: false });

  const { data } = await supabase
    .from("wall_post_blooms")
    .select("post_id")
    .eq("post_id", postId)
    .eq("user_id", user.id)
    .maybeSingle();

  return NextResponse.json({ bloomed: !!data });
}
