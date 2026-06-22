// GET /api/clubs/[id]/membership
// Returns membership status and months_in_club for patch eligibility checks.

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const clubId = params.id;

  const { data: membership } = await supabase
    .from("club_memberships")
    .select("created_at")
    .eq("user_id", user.id)
    .eq("club_id", clubId)
    .maybeSingle();

  if (!membership) {
    return NextResponse.json({ is_member: false, months_in_club: 0 });
  }

  const months_in_club =
    (Date.now() - new Date(membership.created_at).getTime()) / (30 * 24 * 60 * 60 * 1000);

  return NextResponse.json({
    is_member: true,
    months_in_club,
    joined_at: membership.created_at,
  });
}
