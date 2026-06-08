import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { logBehaviorSignal } from "@/lib/truth/behavior";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("bloom_requests")
    .select("id, from_user_id, to_user_id, status, context, note, compatibility_score, created_at")
    .or(`to_user_id.eq.${user.id},from_user_id.eq.${user.id}`)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    if (error.message.includes("does not exist")) {
      return NextResponse.json({ requests: [], source: "demo" });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ requests: data ?? [], source: "db" });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ ok: false, error: "Sign in required" }, { status: 401 });
  }

  let body: { toUserId?: string; context?: string; note?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.toUserId) {
    return NextResponse.json({ ok: false, error: "toUserId required" }, { status: 400 });
  }

  if (body.toUserId === user.id) {
    return NextResponse.json({ ok: false, error: "Cannot bloom yourself" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("bloom_requests")
    .insert({
      from_user_id: user.id,
      to_user_id: body.toUserId,
      context: body.context ?? null,
      note: body.note ?? null,
      status: "pending",
    })
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

  await logBehaviorSignal(supabase, user.id, "bloom_request_sent", { requestId: data.id });

  return NextResponse.json({ ok: true, request: data });
}
