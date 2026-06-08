import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { GatheringRow } from "@/lib/irl/types";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  const { data: gatherings, error } = await supabase
    .from("gatherings")
    .select("id, slug, title, starts_at, area, capacity, spots_left, club_slug")
    .gte("starts_at", new Date().toISOString())
    .order("starts_at", { ascending: true });

  if (error) {
    if (error.message.includes("does not exist")) {
      return NextResponse.json({ gatherings: [], source: "demo" });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data: mine } = await supabase
    .from("seat_reservations")
    .select("gathering_id")
    .eq("user_id", user.id)
    .eq("status", "reserved");

  const reserved = new Set((mine ?? []).map((r) => r.gathering_id as string));

  const rows = (gatherings ?? []).map((g) => ({
    ...(g as GatheringRow),
    saved: reserved.has(g.id as string),
  }));

  return NextResponse.json({ gatherings: rows, source: "db" });
}
