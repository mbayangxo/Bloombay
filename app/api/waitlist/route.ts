import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendSMS } from "@/lib/notifications/sms";

function admin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

export async function POST(req: NextRequest) {
  const body = await req.json() as {
    first_name: string;
    email: string;
    phone?: string;
    city?: string;
    goals?: string[];
  };

  if (!body.email?.trim()) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  const db = admin();
  const phone = body.phone?.trim();

  // This endpoint is unauthenticated, so dedup by email alone isn't enough —
  // without also checking the phone number, someone could POST unlimited
  // distinct emails all pointing at the same real phone number and trigger
  // an unlimited number of SMS sends to it. Check before the upsert so we
  // know whether this phone has already been texted.
  let phoneAlreadyTexted = false;
  if (phone) {
    const { count } = await db
      .from("waitlist")
      .select("id", { count: "exact", head: true })
      .eq("phone_number", phone);
    phoneAlreadyTexted = (count ?? 0) > 0;
  }

  // Upsert into waitlist table (or profiles with waitlisted flag)
  const { error } = await db.from("waitlist").upsert(
    {
      first_name: body.first_name?.trim() ?? null,
      email: body.email.trim().toLowerCase(),
      phone_number: phone ?? null,
      city: body.city ?? null,
      goals: body.goals ?? [],
      status: "waiting",
    },
    { onConflict: "email" }
  );

  if (error) {
    // If table doesn't exist yet, still return ok (migration pending)
    console.error("[waitlist] insert error:", error.message);
  }

  // Send welcome SMS only the first time we've seen this phone number.
  if (phone && !phoneAlreadyTexted) {
    const name = body.first_name?.trim() ?? "";
    const smsBody = `Hey ${name || "Bloomie"} 🌸\n\nYou're on the BloomBay waitlist! We'll text you the moment your city opens.\n\nWomen are gathering ✿\n\nbloombay.app`;
    await sendSMS(phone, smsBody);
  }

  return NextResponse.json({ ok: true });
}
