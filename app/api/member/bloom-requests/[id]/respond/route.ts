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
    .select("id, to_user_id, from_user_id, status")
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

  if (body.status === "accepted") {
    try {
      const { data: questions } = await supabase
        .from("yande_questions")
        .select("id, prompt")
        .eq("kind", "bloom_pair");

      if (questions && questions.length > 0) {
        const question = questions[Math.floor(Math.random() * questions.length)];
        const fromUserId = row.from_user_id;
        const toUserId = user.id;

        void supabase.from("notifications").insert({
          user_id: toUserId,
          type: "yande_question",
          title: "Yande has a question for you two 🌸",
          body: question.prompt.slice(0, 140),
          data: { question_id: question.id, bloomie_id: fromUserId },
        });

        void supabase.from("notifications").insert({
          user_id: fromUserId,
          type: "yande_question",
          title: "Yande has a question for you two 🌸",
          body: question.prompt.slice(0, 140),
          data: { question_id: question.id, bloomie_id: toUserId },
        });
      }
    } catch {
      /* non-fatal */
    }
  }

  await logBehaviorSignal(supabase, user.id, `bloom_request_${body.status}`, { requestId: id });

  return NextResponse.json({ ok: true, status: body.status });
}
