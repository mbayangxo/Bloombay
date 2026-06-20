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
    .from("member_stamps")
    .select("id, label, club_slug, gathering_id, earned_at")
    .eq("user_id", user.id)
    .order("earned_at", { ascending: false });

  if (error) {
    if (error.message.includes("does not exist")) {
      return NextResponse.json({ stamps: [] });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    stamps: (data ?? []).map((s) => ({
      id: s.id,
      label: s.label,
      earnedAt: s.earned_at,
      club: s.club_slug,
    })),
  });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ ok: false, error: "Sign in required" }, { status: 401 });
  }

  let body: { label?: string; clubSlug?: string; gatheringId?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.label?.trim()) {
    return NextResponse.json({ ok: false, error: "label required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("member_stamps")
    .insert({
      user_id: user.id,
      label: body.label.trim(),
      club_slug: body.clubSlug ?? null,
      gathering_id: body.gatheringId ?? null,
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

  await logBehaviorSignal(supabase, user.id, "stamp_earned", { label: body.label });

  return NextResponse.json({ ok: true, stamp: data });
}
