import { NextRequest, NextResponse } from "next/server";
import { processEventWaitlists, checkCapacityAlerts } from "@/lib/yande/operations";

export async function GET(req: NextRequest) {
  // Vercel Cron sends GET with `Authorization: Bearer <CRON_SECRET>`.
  // Also accept the legacy x-cron-secret header for manual triggers.
  const auth = req.headers.get("authorization");
  const secret = req.headers.get("x-cron-secret");
  if (!process.env.CRON_SECRET || (auth !== `Bearer ${process.env.CRON_SECRET}` && secret !== process.env.CRON_SECRET)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [waitlists, capacity] = await Promise.all([
    processEventWaitlists(),
    checkCapacityAlerts(),
  ]);

  return NextResponse.json({ ok: true, waitlists, capacity });
}
