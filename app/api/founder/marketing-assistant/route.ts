import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getMissionControlRole } from "@/lib/auth/get-mc-role";
import { canSignInFounderPortal } from "@/lib/auth/mission-control";

function admin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

const SYSTEM_PROMPT = `You are Yande's marketing side — the brand intelligence behind BloomBay. You interview the founder to understand her vision, taste, and goals so you can help her create content that feels true to BloomBay.

Your job: ask the founder one focused question at a time. Listen carefully. After 6-8 questions, you'll have enough to start suggesting content ideas.

Interview areas to cover (pick the most relevant next question based on what you don't know yet):
1. Brand voice: How would she describe BloomBay in 3 words?
2. The woman: Who is the woman BloomBay is for — who is she specifically?
3. Aesthetic: What images, objects, moods come to mind when she thinks of BloomBay?
4. Content goal: What does she want women to feel when they see BloomBay content?
5. What's working: Is there any content or messaging that has landed particularly well?
6. What to avoid: What would feel off-brand or wrong for BloomBay?
7. Upcoming: What events, campaigns, or seasons need content support right now?
8. Inspiration: What other brands or creators make content she admires?

Rules:
- Ask one question at a time. Never list multiple questions.
- Be warm but direct. Not corporate. Like a brilliant colleague who gets it.
- If the founder's answer is vague, ask a follow-up to go deeper before moving on.
- After 6+ questions are answered, if the founder asks for content ideas, generate 5 specific content ideas in this format:
  ✦ [Platform/Format]: [Headline or concept] — [One sentence on the angle]
- BloomBay brand colors: hot pink (#FF1F7D), black, white. No other colors.
- BloomBay is for Black women who want real community — not a dating app, not LinkedIn. Think: warm, beautiful, intentional.
- Never use the word "algorithm" or "engagement." Speak in human terms.

Start by introducing yourself briefly and asking the first question.`;

export async function POST(req: NextRequest) {
  // Auth check
  const role = await getMissionControlRole();
  if (!role || !canSignInFounderPortal(role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { message, session_id: incomingSession } = await req.json().catch(() => ({})) as {
    message?: string;
    session_id?: string;
  };

  const session_id = incomingSession ?? crypto.randomUUID();
  const supabase = admin();

  // Fetch existing history
  const { data: history } = await supabase
    .from("founder_brand_interviews")
    .select("role, content")
    .eq("session_id", session_id)
    .order("created_at", { ascending: true });

  // If no message yet (initial load), trigger the assistant's opening
  const isInitial = !message || message.trim() === "";

  if (!isInitial) {
    // Store user message
    await supabase.from("founder_brand_interviews").insert({
      session_id,
      role: "user",
      content: message!.trim(),
    });
  }

  // Build messages array for Claude
  const messages: { role: "user" | "assistant"; content: string }[] = (history ?? []).map((h) => ({
    role: h.role as "user" | "assistant",
    content: h.content,
  }));

  if (!isInitial) {
    messages.push({ role: "user", content: message!.trim() });
  } else if (messages.length === 0) {
    // Trigger initial greeting
    messages.push({ role: "user", content: "Hello, I'm ready to start." });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({
      reply: "Marketing assistant isn't configured yet — add your ANTHROPIC_API_KEY to get started.",
      session_id,
    });
  }

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 600,
      system: SYSTEM_PROMPT,
      messages,
    }),
  });

  if (!res.ok) {
    return NextResponse.json({ error: "AI error" }, { status: 500 });
  }

  const aiData = (await res.json()) as { content: { type: string; text: string }[] };
  const reply = aiData.content[0]?.text?.trim() ?? "";

  // Store assistant response
  await supabase.from("founder_brand_interviews").insert({
    session_id,
    role: "assistant",
    content: reply,
  });

  return NextResponse.json({ reply, session_id });
}
