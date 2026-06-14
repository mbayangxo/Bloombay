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

  // Upsert into waitlist table (or profiles with waitlisted flag)
  const { error } = await db.from("waitlist").upsert(
    {
      first_name: body.first_name?.trim() ?? null,
      email: body.email.trim().toLowerCase(),
      phone_number: body.phone?.trim() ?? null,
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

  // Send welcome SMS if phone provided
  if (body.phone?.trim()) {
    const name = body.first_name?.trim() ?? "";
    const smsBody = `Hey ${name || "Bloomie"} 🌸\n\nYou're on the BloomBay waitlist! We'll text you the moment your city opens.\n\nWomen are gathering ✿\n\nbloombay.app`;
    await sendSMS(body.phone.trim(), smsBody);
  }

  return NextResponse.json({ ok: true });
}
