import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const VALID_REASONS = [
  "harassment", "spam", "fake_profile", "inappropriate_content",
  "hate_speech", "scam", "other",
] as const;

// POST /api/member/report — report a user
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json() as {
    reported_id?: string;
    reason?: string;
    details?: string;
    source_type?: string;
    source_id?: string;
  };

  if (!body.reported_id) return NextResponse.json({ error: "reported_id required" }, { status: 400 });
  if (body.reported_id === user.id) return NextResponse.json({ error: "Cannot report yourself" }, { status: 400 });
  if (!body.reason || !VALID_REASONS.includes(body.reason as typeof VALID_REASONS[number])) {
    return NextResponse.json({ error: `reason must be one of: ${VALID_REASONS.join(", ")}` }, { status: 400 });
  }

  const { error } = await supabase.from("user_reports").insert({
    reporter_id: user.id,
    reported_id: body.reported_id,
    reason:      body.reason,
    details:     body.details?.trim().slice(0, 1000) ?? null,
    source_type: body.source_type ?? null,
    source_id:   body.source_id ?? null,
    status:      "pending",
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
