import { NextRequest, NextResponse } from "next/server";
import { nudgeClubsWithNoUpcomingEvents, suggestRecurringEvents } from "@/lib/yande/scheduling";

export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-cron-secret");
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [clubs, recurring] = await Promise.all([
    nudgeClubsWithNoUpcomingEvents(),
    suggestRecurringEvents(),
  ]);

  return NextResponse.json({ ok: true, clubs, recurring });
}
