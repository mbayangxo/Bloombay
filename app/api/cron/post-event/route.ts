import { NextResponse } from "next/server";
import { processPostEventFollowups } from "@/lib/yande/post-event";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await processPostEventFollowups();
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    console.error("[post-event cron]", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
