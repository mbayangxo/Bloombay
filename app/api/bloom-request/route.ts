import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { recipient_id, message } = await req.json();
  if (!recipient_id) return NextResponse.json({ error: "recipient_id required" }, { status: 400 });
  if (recipient_id === user.id) return NextResponse.json({ error: "Cannot send to yourself" }, { status: 400 });

  // Upsert so duplicate taps don't throw
  const { error } = await supabase.from("bloom_requests").upsert(
    { sender_id: user.id, recipient_id, message: message ?? null },
    { onConflict: "sender_id,recipient_id", ignoreDuplicates: true }
  );
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Notify recipient
  await supabase.from("notifications").insert({
    user_id:    recipient_id,
    type:       "flower",
    title:      "Someone sent you a Bloom Request ✦",
    body:       message ? `"${message.slice(0, 80)}"` : "She sees something in you.",
    action_url: "/member/introductions",
  });

  return NextResponse.json({ ok: true });
}
