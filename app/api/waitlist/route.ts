import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendSMS } from "@/lib/notifications/sms";

function admin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// E.164-ish: optional + then 7-15 digits
const PHONE_RE = /^\+?[0-9]{7,15}$/;

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

  const email = body.email.trim().toLowerCase();
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
  }

  // Validate phone if provided
  const phone = body.phone?.trim() ?? null;
  if (phone && !PHONE_RE.test(phone)) {
    return NextResponse.json({ error: "Invalid phone number" }, { status: 400 });
  }

  // Sanitise string inputs
  const first_name = body.first_name?.trim().slice(0, 100) ?? null;
  const city = body.city?.trim().slice(0, 100) ?? null;
  const goals = Array.isArray(body.goals)
    ? body.goals.filter(g => typeof g === "string").slice(0, 10)
    : [];

  const db = admin();

  // Check if this email already exists — avoid duplicate SMS sends
  const { data: existing } = await db
    .from("waitlist")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  const { error } = await db.from("waitlist").upsert(
    { first_name, email, phone_number: phone, city, goals, status: "waiting" },
    { onConflict: "email" }
  );

  if (error) {
    console.error("[waitlist] insert error:", error.message);
  }

  // Send welcome SMS only for new signups (not updates), and only when phone is provided
  if (!existing && phone) {
    const name = first_name ?? "";
    const smsBody = `Hey ${name || "Bloomie"} 🌸\n\nYou're on the BloomBay waitlist! We'll text you the moment your city opens.\n\nWomen are gathering ✿\n\nbloombay.app`;
    await sendSMS(phone, smsBody);
  }

  return NextResponse.json({ ok: true });
}
