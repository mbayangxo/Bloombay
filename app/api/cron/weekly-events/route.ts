// Weekly event digest SMS — fires every Monday morning
// Trigger: Vercel Cron (vercel.json) or Supabase Edge Functions schedule
// Authorization: CRON_SECRET env variable

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendSMS, formatWeeklyDigest } from "@/lib/notifications/sms";

export async function POST(req: NextRequest) {
  // Protect from unauthorized invocations
  const secret = req.headers.get("x-cron-secret");
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  // Fetch events for the next 7 days
  const now  = new Date();
  const week = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const { data: events } = await supabase
    .from("gatherings")
    .select("title, starts_at, venue, neighborhood, city")
    .gte("starts_at", now.toISOString())
    .lte("starts_at", week.toISOString())
    .order("starts_at", { ascending: true })
    .limit(10);

  if (!events || events.length === 0) {
    return NextResponse.json({ sent: 0, message: "No events this week" });
  }

  // Fetch users who have opted into SMS (profiles.sms_opt_in = true, phone_number set)
  const { data: users } = await supabase
    .from("profiles")
    .select("id, first_name, full_name, phone_number")
    .eq("sms_opt_in", true)
    .not("phone_number", "is", null);

  if (!users || users.length === 0) {
    return NextResponse.json({ sent: 0, message: "No opted-in users" });
  }

  const eventSummary = events.map((e: { title: string; starts_at: string; venue: string | null; neighborhood: string | null; city: string }) => ({
    title: e.title,
    date: new Date(e.starts_at).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }),
    location: e.venue ?? e.neighborhood ?? e.city,
  }));

  let sent = 0;
  let failed = 0;

  for (const user of users) {
    const name = user.first_name ?? user.full_name?.split(" ")[0] ?? "";
    const message = formatWeeklyDigest(name, eventSummary);
    const result = await sendSMS(user.phone_number, message);
    if (result.ok) sent++;
    else failed++;
  }

  return NextResponse.json({ sent, failed, total: users.length });
}
