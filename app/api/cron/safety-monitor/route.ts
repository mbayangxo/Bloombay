import { NextRequest, NextResponse } from "next/server";
import { reviewPendingReports } from "@/lib/yande/safety";

export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-cron-secret");
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const result = await reviewPendingReports();
  return NextResponse.json({ ok: true, ...result });
}
