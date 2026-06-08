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

  const { data } = await supabase
    .from("member_preferences")
    .select("discovery_mood, theme_preference, updated_at")
    .eq("user_id", user.id)
    .maybeSingle();

  return NextResponse.json({
    discoveryMood: data?.discovery_mood ?? null,
    themePreference: data?.theme_preference ?? "auto",
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

  let body: { discoveryMood?: string | null; themePreference?: string | null };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const theme =
    body.themePreference === "day" || body.themePreference === "night" || body.themePreference === "auto"
      ? body.themePreference
      : undefined;

  const { error } = await supabase.from("member_preferences").upsert({
    user_id: user.id,
    discovery_mood: body.discoveryMood ?? null,
    ...(theme ? { theme_preference: theme } : {}),
    updated_at: new Date().toISOString(),
  });

  if (error) {
    if (error.message.includes("does not exist")) {
      return NextResponse.json(
        { ok: false, error: "Run supabase/migrations/006_member_truth_layer.sql" },
        { status: 503 }
      );
    }
    return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
  }

  if (body.discoveryMood) {
    await logBehaviorSignal(supabase, user.id, "mood_set", { mood: body.discoveryMood });
  }

  return NextResponse.json({ ok: true });
}
