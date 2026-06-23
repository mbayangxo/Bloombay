import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as adminClient } from "@supabase/supabase-js";

function admin() {
  return adminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

// POST /api/comment-flower — toggle a flower on a comment
// Body: { comment_id }
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { comment_id } = await req.json() as { comment_id: string };
  if (!comment_id) return NextResponse.json({ error: "Missing comment_id" }, { status: 400 });

  const db = admin();
  const { data: existing } = await db.from("comment_flowers").select("id").match({ user_id: user.id, comment_id }).maybeSingle();

  let gave: boolean;
  if (existing) {
    await db.from("comment_flowers").delete().eq("id", existing.id);
    gave = false;
  } else {
    await db.from("comment_flowers").insert({ user_id: user.id, comment_id });
    gave = true;
  }

  const { count } = await db.from("comment_flowers").select("id", { count: "exact", head: true }).eq("comment_id", comment_id);
  return NextResponse.json({ ok: true, gave, count: count ?? 0 });
}
