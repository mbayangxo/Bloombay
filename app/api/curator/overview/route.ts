// GET /api/curator/overview
// Returns clubs, recent memberships, upcoming gatherings, and pending applications
// for curator dashboard. Curators see all clubs system-wide.

import { NextResponse } from "next/server";
import { getCuratorOverview } from "@/lib/curator/overview";

export async function GET() {
  const data = await getCuratorOverview();
  if (!data) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json(data);
}
