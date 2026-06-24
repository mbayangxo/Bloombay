import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getAuthUser } from "@/lib/auth/get-user";

function admin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

// GET /api/avenue/magazine — approved magazine articles, most recent week first
export async function GET() {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = admin();

  const { data, error } = await supabase
    .from("avenue_content")
    .select("id, title, body, meta, yande_note, badge, week_of, rank_order, like_count, save_count")
    .eq("room", "magazine")
    .eq("status", "approved")
    .order("rank_order", { ascending: true })
    .order("week_of", { ascending: false })
    .limit(12);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const content = (data ?? []).map(row => ({
    id:            row.id,
    headline:      row.title,
    dek:           row.meta?.dek ?? "",
    section:       row.meta?.section ?? "culture",
    body:          row.body ?? "",
    read_time:     row.meta?.read_time ?? "",
    author:        row.meta?.author ?? "BloomBay",
    cover_a:       row.meta?.cover_a ?? "#1A0526",
    cover_b:       row.meta?.cover_b ?? "#7B1FA2",
    featured:      row.meta?.featured ?? false,
    yande_note:    row.yande_note ?? null,
    badge:         row.badge ?? null,
    week_of:       row.week_of,
    blooms:        row.like_count ?? 0,
  }));

  return NextResponse.json({ content });
}
