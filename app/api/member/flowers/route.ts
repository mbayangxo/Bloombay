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

  let body: { to_user_id: string; gathering_id?: string; note?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.to_user_id) {
    return NextResponse.json({ ok: false, error: "to_user_id required" }, { status: 400 });
  }

  if (body.to_user_id === user.id) {
    return NextResponse.json({ ok: false, error: "Cannot send flowers to yourself" }, { status: 400 });
  }

  if (body.note && body.note.length > 120) {
    return NextResponse.json({ ok: false, error: "Note must be 120 characters or fewer" }, { status: 400 });
  }

  const { data: flowers, error } = await supabase
    .from("bloom_flowers")
    .insert({
      from_user_id: user.id,
      to_user_id: body.to_user_id,
      gathering_id: body.gathering_id ?? null,
      note: body.note ?? null,
    })
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
    user_id: body.to_user_id,
    type: "flower",
    title: `${senderName} sent you flowers 🌸`,
    link: "/member/notifications",
    data: { sender_id: user.id, flower_id: flowers.id },
  });

  const { data: existingFlowers } = await supabase
    .from("bloom_flowers")
    .select("id")
    .eq("to_user_id", body.to_user_id)
    .limit(2);

  if (existingFlowers && existingFlowers.length === 1) {
    void supabase.from("member_milestones").insert({
      user_id: body.to_user_id,
      kind: "flower_received",
      title: "Someone noticed you 🌸",
      meta: { sender_id: user.id },
    });
  }

  return NextResponse.json({ ok: true, flowers });
}
