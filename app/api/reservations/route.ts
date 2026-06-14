import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { sendSMS } from "@/lib/notifications/sms";
import { getAuthUser } from "@/lib/auth/get-user";

function admin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

// POST — create a reservation request
export async function POST(req: NextRequest) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json() as {
    restaurant_id: string;
    restaurant_name: string;
    date: string;         // ISO date "2026-06-15"
    time: string;         // "7:00 PM"
    party_size: number;
    notes?: string;
  };

  if (!body.restaurant_id || !body.restaurant_name || !body.date || !body.time) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const db = admin();

  const { data, error } = await db.from("table_reservations").insert({
    user_id:         user.id,
    restaurant_id:   body.restaurant_id,
    restaurant_name: body.restaurant_name,
    date:            body.date,
    time:            body.time,
    party_size:      body.party_size ?? 2,
    notes:           body.notes?.trim() ?? null,
    status:          "pending",
  }).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Insert in-app notification
  void db.from("notifications").insert({
    user_id: user.id,
    type: "reservation_requested",
    title: `Reservation request sent`,
    body: `We've sent your request to ${body.restaurant_name} for ${body.date} at ${body.time}. We'll confirm within 24h.`,
    link: "/member/lounge",
  });

  // Fetch user phone for SMS confirmation
  const { data: profile } = await db
    .from("profiles")
    .select("first_name, full_name, phone_number")
    .eq("id", user.id)
    .single();

  if (profile?.phone_number) {
    const name = profile.first_name ?? profile.full_name?.split(" ")[0] ?? "Bloomie";
    const smsBody = `Hey ${name} 🌸\n\nYour table request at ${body.restaurant_name} for ${body.party_size} on ${body.date} at ${body.time} is in!\n\nWe'll confirm within 24 hours.\n\nbloombay.app`;
    await sendSMS(profile.phone_number, smsBody);
  }

  return NextResponse.json({ ok: true, id: (data as { id: string }).id });
}

// GET — user's reservation history
export async function GET(req: NextRequest) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let supabaseResponse = NextResponse.next({ request: req });
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return req.cookies.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => req.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request: req });
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options));
        },
      },
    }
  );

  const { data, error } = await supabase
    .from("table_reservations")
    .select("*")
    .eq("user_id", user.id)
    .order("date", { ascending: false })
    .limit(50);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}
