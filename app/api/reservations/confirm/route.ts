import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendSMS } from "@/lib/notifications/sms";

function admin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

export async function PATCH(req: NextRequest) {
  const secret = req.headers.get("x-admin-password");
  if (secret !== process.env.ADMIN_PASSWORD) {
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
    .select("*, profiles(first_name, full_name, phone_number)")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Notify user via SMS
  const res = reservation as {
    restaurant_name: string; date: string; time: string; party_size: number;
    profiles: { first_name: string | null; full_name: string | null; phone_number: string | null } | null;
  };
  const profile = res.profiles;
  if (profile?.phone_number) {
    const name = profile.first_name ?? profile.full_name?.split(" ")[0] ?? "Bloomie";
    const smsBody = body.status === "confirmed"
      ? `Hey ${name} 🌸\n\nYour table at ${res.restaurant_name} is confirmed! ✓\n\n📅 ${res.date} at ${res.time} for ${res.party_size}\n\nSee you there ✿\n\nbloombay.app`
      : `Hey ${name} 🌸\n\nUnfortunately ${res.restaurant_name} couldn't accommodate your request for ${res.date}. We're sorry!\n\nBrowse more options → bloombay.app/member/city`;
    await sendSMS(profile.phone_number, smsBody);
  }

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
