import { NextResponse } from "next/server";
import { fetchPortalClubBySlug } from "@/lib/clubs/fetch-clubs";

/** GET /api/clubs/[id] — fetch club by slug (id param accepts slug or UUID) */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const club = await fetchPortalClubBySlug(id);

  if (!club) {
    return NextResponse.json({ error: "Club not found" }, { status: 404 });
  }

  return NextResponse.json({ club });
}
