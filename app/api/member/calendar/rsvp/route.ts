import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ ok: false, error: "Sign in required" }, { status: 401 });
  }

  let body: { gathering_id?: string; action?: "join" | "leave" };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.gathering_id || !body.action) {
    return NextResponse.json(
      { ok: false, error: "gathering_id and action required" },
      { status: 400 }
    );
  }

  if (body.action === "join") {
    // Upsert reservation
    const { error } = await supabase.from("seat_reservations").upsert(
      {
        gathering_id: body.gathering_id,
        user_id: user.id,
        status: "reserved",
      },
      { onConflict: "gathering_id,user_id" }
    );

    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
    }

    return NextResponse.json({ ok: true, is_rsvpd: true });
  }

  const { data: active } = await supabase
    .from("seat_reservations")
    .select("id")
    .eq("gathering_id", body.gathering_id)
    .eq("user_id", user.id)
    .eq("status", "reserved")
    .maybeSingle();

  if (!active) {
    return NextResponse.json({ ok: true, is_rsvpd: false });
  }

  const admin = createAdminClient();
  const { error } = await admin
    .from("seat_reservations")
    .update({ status: "cancelled" })
    .eq("id", active.id);

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true, is_rsvpd: false });
}
