import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isConfirmedGatheringParticipant } from "@/lib/happenings/attendee-gate";

/** GET /api/happenings/can-engage?gatheringId= — is viewer allowed to note/flower */
export async function GET(req: NextRequest) {
  const gatheringId = req.nextUrl.searchParams.get("gatheringId");
  if (!gatheringId) return NextResponse.json({ allowed: false }, { status: 400 });

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ allowed: false });

  const allowed = await isConfirmedGatheringParticipant(gatheringId, user.id);
  return NextResponse.json({ allowed });
}
