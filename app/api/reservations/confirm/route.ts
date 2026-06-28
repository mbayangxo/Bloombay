import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { verifyAdminRequest } from "@/lib/admin-auth";

function admin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

export async function PATCH(req: NextRequest) {
  if (!await verifyAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json() as { id: string; status: "confirmed" | "cancelled" };
  if (!body.id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const db = admin();
  const update: Record<string, unknown> = { status: body.status };
  if (body.status === "confirmed") update.confirmed_at = new Date().toISOString();
  if (body.status === "cancelled") update.cancelled_at = new Date().toISOString();

  const { data: reservation, error } = await db
    .from("table_reservations")
    .update(update)
    .eq("id", body.id)
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // In-app notification
  const resAny = reservation as { user_id: string; restaurant_name: string; date: string; time: string };
  void db.from("notifications").insert({
    user_id: resAny.user_id,
    type: body.status === "confirmed" ? "reservation_confirmed" : "reservation_cancelled",
    title: body.status === "confirmed" ? `Table confirmed at ${resAny.restaurant_name}!` : `Reservation update`,
    body: body.status === "confirmed"
      ? `Your table for ${resAny.date} at ${resAny.time} is confirmed. See you there ✦`
      : `Your request at ${resAny.restaurant_name} for ${resAny.date} couldn't be accommodated.`,
    link: "/member/city",
  });

  return NextResponse.json({ ok: true });
}
