// POST /api/member/safety-pings — quietly ping every member of the caller's
// bouquet (their safety circle). Inserts one safety_pings row per member.
// Returns how many pings were actually sent so the UI never claims success
// when the bouquet is empty.

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

  let eventName: string | null = null;
  try {
    const body = (await request.json()) as { eventName?: string };
    eventName = body.eventName?.trim() || null;
  } catch {
    // no body is fine — eventName stays null
  }

  // Read the real bouquet (safety circle).
  const { data: bouquet, error: bouquetErr } = await supabase
    .from("bloom_bouquet")
    .select("member_id")
    .eq("owner_id", user.id);

  if (bouquetErr) {
    if (bouquetErr.message.includes("does not exist")) {
      return NextResponse.json(
        { ok: false, error: "Run supabase/migrations/041_bouquet_checkins_safety.sql" },
        { status: 503 }
      );
    }
    return NextResponse.json({ ok: false, error: bouquetErr.message }, { status: 400 });
  }

  const memberIds = (bouquet ?? []).map((r) => (r as { member_id: string }).member_id);
  if (memberIds.length === 0) {
    // Honest: nobody to ping. UI must not show "they know".
    return NextResponse.json({ ok: true, pinged: 0 });
  }

  const rows = memberIds.map((recipientId) => ({
    sender_id: user.id,
    recipient_id: recipientId,
    status: "sent" as const,
    event_name: eventName,
  }));

  const { error: pingErr } = await supabase.from("safety_pings").insert(rows);
  if (pingErr) {
    if (pingErr.message.includes("does not exist")) {
      return NextResponse.json(
        { ok: false, error: "Run supabase/migrations/041_bouquet_checkins_safety.sql" },
        { status: 503 }
      );
    }
    return NextResponse.json({ ok: false, error: pingErr.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true, pinged: rows.length });
}
