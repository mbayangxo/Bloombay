import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ ok: false, error: "Sign in required" }, { status: 401 });
  }

  let body: { subject_user_id: string; gathering_id: string; note: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.subject_user_id) {
    return NextResponse.json({ ok: false, error: "subject_user_id required" }, { status: 400 });
  }

  if (!body.gathering_id) {
    return NextResponse.json({ ok: false, error: "gathering_id required" }, { status: 400 });
  }

  if (!body.note || !body.note.trim()) {
    return NextResponse.json({ ok: false, error: "note required" }, { status: 400 });
  }

  if (body.note.length > 280) {
    return NextResponse.json({ ok: false, error: "Note must be 280 characters or fewer" }, { status: 400 });
  }

  const { data: witness, error } = await supabase
    .from("gathering_witnesses")
    .upsert(
      {
        gathering_id: body.gathering_id,
        witness_user_id: user.id,
        subject_user_id: body.subject_user_id,
        note: body.note,
      },
      { onConflict: "gathering_id,witness_user_id,subject_user_id" }
    )
    .select()
    .single();

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
  }

  const { data: senderProfile } = await supabase
    .from("profiles")
    .select("first_name, full_name")
    .eq("id", user.id)
    .maybeSingle();

  const senderName = senderProfile?.first_name || senderProfile?.full_name?.split(" ")[0] || "Someone";

  void supabase.from("notifications").insert({
    user_id: body.subject_user_id,
    type: "witness",
    title: `${senderName} witnessed something about you ✦`,
    link: `/member/witness/${witness.id}`,
    data: { witness_id: witness.id, sender_id: user.id },
  });

  void supabase.from("member_milestones").insert({
    user_id: body.subject_user_id,
    kind: "witnessed",
    title: "She was seen at an event ✦",
    meta: { witness_id: witness.id, gathering_id: body.gathering_id, witness_user_id: user.id },
  });

  return NextResponse.json({ ok: true });
}
