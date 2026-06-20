import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { logBehaviorSignal } from "@/lib/truth/behavior";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ ok: false, error: "Sign in required" }, { status: 401 });
  }

  let body: { status?: "accepted" | "declined" };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  if (body.status !== "accepted" && body.status !== "declined") {
    return NextResponse.json({ ok: false, error: "status must be accepted or declined" }, { status: 400 });
  }

  const { data: row, error: fetchErr } = await supabase
    .from("bloom_requests")
    .select("id, to_user_id, status")
    .eq("id", id)
    .maybeSingle();

  if (fetchErr || !row) {
    return NextResponse.json({ ok: false, error: "Request not found" }, { status: 404 });
  }

  if (row.to_user_id !== user.id) {
    return NextResponse.json({ ok: false, error: "Not your request to answer" }, { status: 403 });
  }

  const { error } = await supabase
    .from("bloom_requests")
    .update({ status: body.status, responded_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
  }

  await logBehaviorSignal(supabase, user.id, `bloom_request_${body.status}`, { requestId: id });

  return NextResponse.json({ ok: true, status: body.status });
}
