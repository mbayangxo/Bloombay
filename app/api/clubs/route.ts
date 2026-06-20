import { NextResponse } from "next/server";
import { fetchPortalClubs } from "@/lib/clubs/fetch-clubs";

export async function GET() {
  const { clubs, onboardedCount, source } = await fetchPortalClubs();
  return NextResponse.json({
    clubs,
    onboardedCount,
    officialCount: clubs.filter((c) => c.isOfficial).length,
    total: clubs.length,
    source,
  });
}
