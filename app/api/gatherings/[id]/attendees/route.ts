// Real attendee roster for a gathering: everyone with a reserved seat, plus
// the caller's own seat/table assignment. RLS (migration 105) lets any
// reserved attendee see the other reserved rows for the same gathering.

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("seat_reservations")
    .select("user_id, seat_number, table_number, created_at, profiles!user_id(first_name, full_name, avatar_url)")
    .eq("gathering_id", id)
    .eq("status", "reserved")
    .order("created_at", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const rows = data ?? [];
  const me = rows.find(r => r.user_id === user.id) ?? null;

  return NextResponse.json({
    attendees: rows,
    mySeat: me ? { seat_number: me.seat_number, table_number: me.table_number } : null,
    count: rows.length,
  });
}
