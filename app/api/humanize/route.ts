import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { humanize, HUMANIZER_MODES, type HumanizerMode } from "@/lib/humanize";

// POST /api/humanize
// Authenticated. Members use this for drafting messages (Girlmates, first messages, etc.)
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json() as {
    text: string;
    mode: HumanizerMode;
    context?: string;
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

  const result = await humanize(body.text, { mode: body.mode, context: body.context });
  if (!result) {
    return NextResponse.json({ error: "Humanization failed" }, { status: 500 });
  }

  return NextResponse.json(result);
}
