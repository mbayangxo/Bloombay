import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { requireAdmin } from "@/lib/admin/require-staff";
import { createNotificationEvent } from "@/lib/notifications/notification-service";

function admin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

export async function PATCH(req: NextRequest) {
  const guard = await requireAdmin(req);
  if (guard.error) return guard.error;

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

  const resAny = reservation as { user_id: string; restaurant_name: string; date: string; time: string };
  void createNotificationEvent({
    userId: resAny.user_id,
    type: body.status === "confirmed" ? "reservation_confirmed" : "reservation_cancelled",
    channels: ["in_app", "email"],
    payload: {
      templateVars: {
        restaurantName: resAny.restaurant_name,
        date: resAny.date,
        time: resAny.time,
      },
      link: "/member/city",
    },
  });

  return NextResponse.json({ ok: true });
}
