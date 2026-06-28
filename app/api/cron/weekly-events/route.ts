// Weekly event digest — SMS removed per product decision.
// SMS is only permitted for waitlist acceptance and app-launch notifications.

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-cron-secret");
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({ sent: 0, message: "Weekly digest SMS disabled" });
}
