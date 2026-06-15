import { NextRequest, NextResponse } from "next/server";
import { processEventWaitlists, checkCapacityAlerts } from "@/lib/yande/operations";

export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-cron-secret");
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [waitlists, capacity] = await Promise.all([
    processEventWaitlists(),
    checkCapacityAlerts(),
  ]);

  return NextResponse.json({ ok: true, waitlists, capacity });
}
