// GET  /api/member/yande-question?kind=this_or_that|open_question
// POST /api/member/yande-question { question_id, answer }

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(req.url);
  const kind = url.searchParams.get("kind") ?? "this_or_that";

  // Pick question based on week number (deterministic rotation)
  const weekNum = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));

  const { data: questions } = await supabase
    .from("yande_questions")
    .select("id, kind, prompt, option_a, option_b, sort_order")
    .eq("kind", kind)
    .order("sort_order", { ascending: true });

  if (!questions || questions.length === 0) {
    return NextResponse.json({ question: null });
  }

  const question = questions[weekNum % questions.length];
  const weekOf = new Date();
  weekOf.setDate(weekOf.getDate() - weekOf.getDay()); // Monday
  const weekOfStr = weekOf.toISOString().split("T")[0];

  // Check if user already answered this week
  const { data: existing } = await supabase
    .from("member_question_responses")
    .select("answer")
    .eq("user_id", user.id)
    .eq("question_id", question.id)
    .eq("week_of", weekOfStr)
    .maybeSingle();

  // Get community counts for this_or_that
  let counts: { a: number; b: number } | null = null;
  if (kind === "this_or_that") {
    const { data: responses } = await supabase
      .from("member_question_responses")
      .select("answer")
      .eq("question_id", question.id)
      .eq("week_of", weekOfStr);

    if (responses) {
      counts = { a: 0, b: 0 };
      for (const r of responses) {
        if (r.answer === "a") counts.a++;
        else if (r.answer === "b") counts.b++;
      }
    }
  }

  return NextResponse.json({
    question,
    my_answer: existing?.answer ?? null,
    counts,
    week_of: weekOfStr,
  });
}

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { question_id, answer } = await req.json().catch(() => ({})) as { question_id?: string; answer?: string };
  if (!question_id || !answer) return NextResponse.json({ error: "question_id and answer required" }, { status: 400 });

  const weekOf = new Date();
  weekOf.setDate(weekOf.getDate() - weekOf.getDay());
  const weekOfStr = weekOf.toISOString().split("T")[0];

  await supabase.from("member_question_responses").upsert({
    user_id: user.id,
    question_id,
    answer: answer.trim().slice(0, 500),
    week_of: weekOfStr,
  }, { onConflict: "user_id,question_id,week_of" });

  return NextResponse.json({ ok: true });
}
