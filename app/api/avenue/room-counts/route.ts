// GET /api/avenue/room-counts
// Real per-room post counts for the Avenue hub's room list badges.
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const AI_EDITORIAL_ROOMS = ["reading-room", "screening", "working"] as const;

export async function GET() {
  const supabase = await createClient();

  const [wall, closet, vanity, wellness, ...editorial] = await Promise.all([
    supabase.from("wall_posts").select("id", { count: "exact", head: true }),
    supabase.from("fashion_posts").select("id", { count: "exact", head: true }).eq("context", "avenue").eq("status", "published"),
    supabase.from("vanity_posts").select("id", { count: "exact", head: true }),
    supabase.from("wellness_posts").select("id", { count: "exact", head: true }),
    ...AI_EDITORIAL_ROOMS.map(room =>
      supabase.from("avenue_content").select("id", { count: "exact", head: true }).eq("room", room).eq("status", "approved")
    ),
  ]);

  const counts: Record<string, number> = {
    wall: wall.count ?? 0,
    closet: closet.count ?? 0,
    vanity: vanity.count ?? 0,
    wellness: wellness.count ?? 0,
  };
  AI_EDITORIAL_ROOMS.forEach((room, i) => { counts[room] = editorial[i]?.count ?? 0; });

  return NextResponse.json({ counts });
}
