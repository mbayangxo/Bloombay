import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as adminClient } from "@supabase/supabase-js";
import {
  humanize, HUMANIZER_MODES,
  type HumanizerMode, type RelationshipStage, type YandeUserContext,
} from "@/lib/humanize";

function admin() {
  return adminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}

// POST /api/humanize
// Authenticated. Supports new modes, relationship stage, and memory injection.
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json() as {
    text: string;
    mode: HumanizerMode;
    context?: string;
    stage?: RelationshipStage;
    recipient_user_id?: string;
    use_memory?: boolean;
  };

  if (!body.text?.trim()) {
    return NextResponse.json({ error: "text is required" }, { status: 400 });
  }
  if (!HUMANIZER_MODES.includes(body.mode)) {
    return NextResponse.json(
      { error: `mode must be one of: ${HUMANIZER_MODES.join(", ")}` },
      { status: 400 }
    );
  }
  if (body.text.length > 2000) {
    return NextResponse.json({ error: "text too long (max 2000 chars)" }, { status: 400 });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "AI not configured" }, { status: 503 });
  }

  // Fetch memory context if requested
  let userMemory: YandeUserContext | undefined;
  if (body.use_memory && body.recipient_user_id) {
    const { data } = await admin()
      .from("yande_user_context")
      .select("interests, life_stage, social_comfort, group_size_pref, neighborhoods, notes")
      .eq("user_id", body.recipient_user_id)
      .maybeSingle();
    if (data) userMemory = data as YandeUserContext;
  }

  const result = await humanize(body.text, {
    mode:       body.mode,
    context:    body.context,
    stage:      body.stage,
    userMemory,
  });

  if (!result) {
    return NextResponse.json({ error: "Humanization failed" }, { status: 500 });
  }

  return NextResponse.json(result);
}
