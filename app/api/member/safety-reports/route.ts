import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let body: { email?: string; category?: string; body?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const categories = ["support", "safety", "billing", "clubs"] as const;
  const category = body.category as (typeof categories)[number];
  if (!categories.includes(category)) {
    return NextResponse.json({ ok: false, error: "Invalid category" }, { status: 400 });
  }
  if (!body.body?.trim()) {
    return NextResponse.json({ ok: false, error: "Message required" }, { status: 400 });
  }

  const { error } = await supabase.from("safety_reports").insert({
    user_id: user?.id ?? null,
    email: body.email?.trim() || null,
    category,
    body: body.body.trim(),
    status: "open",
  });

  if (error) {
    if (error.message.includes("does not exist")) {
      return NextResponse.json(
        { ok: false, error: "Run supabase/migrations/007_community_theme_safety.sql" },
        { status: 503 }
      );
    }
    return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
