import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

// GET /api/avenue/top-posts — top 4 wall posts by bloom count
// Requires sign-in; author id is never returned to the client.
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Sign in required" }, { status: 401 });

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("wall_posts")
    .select(`
      id, text, blooms, category, is_seed, seed_author,
      author:profiles!author_id ( first_name, full_name )
    `)
    .order("blooms", { ascending: false })
    .limit(4);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}
