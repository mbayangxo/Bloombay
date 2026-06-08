import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { logBehaviorSignal } from "@/lib/truth/behavior";
import { resolveGatheringId } from "@/lib/truth/resolve-gathering";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ ok: false, error: "Sign in required" }, { status: 401 });
  }

  let body: {
    gatheringId?: string;
    slug?: string;
    eventKey?: string;
    subjectUserId?: string;
    note?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.subjectUserId) {
    return NextResponse.json({ ok: false, error: "subjectUserId required" }, { status: 400 });
  }

  const resolved = await resolveGatheringId(supabase, body);
  if (!resolved) {
    return NextResponse.json({ ok: false, error: "Gathering not found" }, { status: 404 });
  }

  const { data, error } = await supabase
    .from("gathering_witnesses")
    .upsert(
      {
        gathering_id: resolved.id,
        witness_user_id: user.id,
        subject_user_id: body.subjectUserId,
        note: body.note ?? null,
      },
      { onConflict: "gathering_id,witness_user_id,subject_user_id" }
    )
    .select()
    .single();

  if (error) {
    if (error.message.includes("does not exist")) {
      return NextResponse.json(
        { ok: false, error: "Run supabase/migrations/006_member_truth_layer.sql" },
        { status: 503 }
      );
    }
    return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
  }

  await logBehaviorSignal(supabase, user.id, "witness_recorded", {
    gatheringId: resolved.id,
    subjectUserId: body.subjectUserId,
  });

  return NextResponse.json({ ok: true, witness: data });
}
