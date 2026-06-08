import { NextResponse } from "next/server";
import { fetchPortalClubBySlug } from "@/lib/clubs/fetch-clubs";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const club = await fetchPortalClubBySlug(slug);

  if (!club) {
    return NextResponse.json({ error: "Club not found" }, { status: 404 });
  }

  return NextResponse.json({ club });
}
