import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, countries, sectors } = body;

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    const supabase = await createClient();

    const { error } = await supabase
      .from("feed_subscriptions")
      .upsert(
        {
          email: email.trim().toLowerCase(),
          countries: Array.isArray(countries) ? countries : [],
          sectors: Array.isArray(sectors) ? sectors : [],
          frequency: "weekly",
          confirmed: false,
        },
        { onConflict: "email" }
      );

    if (error) {
      console.error("[feed/subscribe] Supabase error:", error);
      // If it's a duplicate, treat as success
      if (error.code === "23505") {
        return NextResponse.json({ success: true, message: "Already subscribed" });
      }
      return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Subscribed successfully. You will receive your first update within the week.",
    });
  } catch (error) {
    console.error("[feed/subscribe] Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
