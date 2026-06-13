import { NextRequest, NextResponse } from "next/server";
import { chargeClubMembership } from "@/lib/payments";
import { getAuthUser } from "@/lib/auth/get-user";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { clubId } = await req.json();
  if (!clubId) return NextResponse.json({ error: "clubId required" }, { status: 400 });

  const supabase = await createClient();
  const { data: club } = await supabase
    .from("clubs")
    .select("id, name, price_cents, is_paid")
    .eq("id", clubId)
    .single();

  if (!club) return NextResponse.json({ error: "Club not found" }, { status: 404 });
  if (!club.is_paid) return NextResponse.json({ error: "Club is free" }, { status: 400 });

  const { url } = await chargeClubMembership({
    clubId: club.id,
    clubName: club.name,
    priceCents: club.price_cents ?? 1000,
    userId: user.id,
    userEmail: user.email ?? "",
  });

  return NextResponse.json({ url });
}
