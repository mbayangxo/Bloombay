import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as adminClient } from "@supabase/supabase-js";

function admin() {
  return adminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

// POST /api/flowers — toggle a flower on a post
// Body: { fashion_post_id? | wall_post_id? | avenue_content_id? }
// Returns: { ok, gave: boolean, count: number }
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { fashion_post_id, wall_post_id, avenue_content_id } = body;

  if (!fashion_post_id && !wall_post_id && !avenue_content_id) {
    return NextResponse.json({ error: "Missing post reference" }, { status: 400 });
  }

  const db = admin();

  // Build filter for the existing flower check
  const filter: Record<string, string> = { user_id: user.id };
  if (fashion_post_id)   filter["fashion_post_id"]   = fashion_post_id;
  if (wall_post_id)      filter["wall_post_id"]       = wall_post_id;
  if (avenue_content_id) filter["avenue_content_id"]  = avenue_content_id;

  const { data: existing } = await db.from("post_flowers").select("id").match(filter).maybeSingle();

  let gave: boolean;
  if (existing) {
    // Un-flower
    await db.from("post_flowers").delete().eq("id", existing.id);
    gave = false;
  } else {
    // Give flower
    await db.from("post_flowers").insert({
      user_id: user.id,
      fashion_post_id:  fashion_post_id  ?? null,
      wall_post_id:     wall_post_id     ?? null,
      avenue_content_id: avenue_content_id ?? null,
    });
    gave = true;
  }

  // Return updated count
  let countQuery = db.from("post_flowers").select("id", { count: "exact", head: true });
  if (fashion_post_id)   countQuery = countQuery.eq("fashion_post_id",   fashion_post_id);
  if (wall_post_id)      countQuery = countQuery.eq("wall_post_id",       wall_post_id);
  if (avenue_content_id) countQuery = countQuery.eq("avenue_content_id",  avenue_content_id);

  const { count } = await countQuery;
  return NextResponse.json({ ok: true, gave, count: count ?? 0 });
}
