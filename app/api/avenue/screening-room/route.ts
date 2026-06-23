import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function admin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

// GET /api/avenue/screening-room — current approved film picks ordered by rank
export async function GET() {
  const supabase = admin();

  const { data, error } = await supabase
    .from("avenue_content")
    .select("id, title, body, meta, badge, week_of, rank_order, like_count, save_count")
    .eq("room", "screening")
    .eq("status", "approved")
    .order("rank_order", { ascending: true })
    .limit(8);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}
