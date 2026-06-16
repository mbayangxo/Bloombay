// Daily Wall Seeder — keeps The Wall alive before/between real posts
// Runs 3× daily (8am, 2pm, 9pm EST). Each run drops 1 Yande prompt.
// Topics: ~30% NYC-specific, ~70% universal girl life.
// These are clearly Yande's voice — conversation starters, not fake user posts.

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function admin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

const TOPICS = [
  // Universal — relationships & love
  "dating in your late 20s/early 30s — the actual experience",
  "what you learned from a friendship ending",
  "how you know someone is genuinely in your corner",
  "the moment you stopped explaining yourself to people who don't get it",
  "what you wish you'd said or done differently in a past relationship",
  "texting habits and what they actually mean",
  "how you handle feeling lonely even when you're not alone",
  "the unwritten rules of female friendship",
  "what 'soft life' actually means to you vs. what it looks like online",

  // Universal — career & money
  "the biggest professional risk you've taken and whether it was worth it",
  "your relationship with money and how it's changed",
  "something you learned in your first real job that nobody told you",
  "asking for more — raise, promotion, opportunity — what happened",
  "the Sunday scaries: real, manageable, or you've cured yours?",
  "work-life balance or work-life integration — which do you actually have",
  "something you're building right now, even slowly",

  // Universal — self & growth
  "a boundary you set this year that changed something",
  "what you stopped doing that made your life better",
  "the version of yourself you're actively growing into",
  "something you've changed your mind about completely",
  "what your 22-year-old self would not believe about your life now",
  "what rest actually looks like for you vs. what it used to look like",
  "something you're proud of that you haven't told anyone",
  "the thing you keep almost doing but haven't done yet",

  // Universal — culture & identity
  "a book, show, or song that rearranged something in you this year",
  "your relationship with your culture — complicated, easy, evolving?",
  "something about being a woman in 2026 that nobody talks about enough",
  "what home means to you right now",
  "something your mom was right about (even if it took years to admit)",

  // NYC-specific
  "the NYC neighborhood that actually matches your energy right now",
  "best coffee shop you've ever worked from in the city — name it",
  "a place in NYC that feels like it belongs to you",
  "something NYC taught you that you couldn't have learned anywhere else",
  "the best meal you've had in this city recently — where and what",
  "how NYC changed you since you arrived",
  "a spot in the city most people don't know about — share it",
  "the thing about NYC winters / summers nobody warns you about",
];

const CATEGORY_WEIGHTS: { category: string; weight: number }[] = [
  { category: "questions", weight: 40 },
  { category: "mood",      weight: 20 },
  { category: "rant",      weight: 15 },
  { category: "wins",      weight: 15 },
  { category: "connects",  weight: 10 },
];

function weightedCategory(): string {
  const total = CATEGORY_WEIGHTS.reduce((s, c) => s + c.weight, 0);
  let r = Math.random() * total;
  for (const c of CATEGORY_WEIGHTS) {
    r -= c.weight;
    if (r <= 0) return c.category;
  }
  return "questions";
}

export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-cron-secret");
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ skipped: "no anthropic key" });
  }

  const supabase = admin();

  // Pick a random topic and category for this run
  const topic = TOPICS[Math.floor(Math.random() * TOPICS.length)];
  const category = weightedCategory();

  const systemPrompt = `You are writing a single wall post for BloomBay — a social club for women in NYC (and beyond). The Wall is a community space where women share real thoughts, questions, wins, rants, and connections.

Write ONE short post (1-3 sentences max) in the first person or as a direct question/prompt. The post should:
- Feel like a real woman wrote it, not a brand
- Be honest, specific, and pull something out of people
- Invite a response without explicitly saying "comment below" or "share your thoughts"
- Sound like something you'd screenshot and text your best friend
- Use casual but real language — no corporate speak, no hashtags

The category is "${category}".
The topic is: ${topic}

Return ONLY the post text. No quotes, no labels, nothing else.`;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": process.env.ANTHROPIC_API_KEY!,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 150,
      system: systemPrompt,
      messages: [{ role: "user", content: "Write the wall post." }],
    }),
  });

  if (!res.ok) return NextResponse.json({ error: "Claude API error" }, { status: 500 });
  const data = await res.json() as { content: { type: string; text: string }[] };
  const text = data.content[0]?.text?.trim() ?? "";
  if (!text) return NextResponse.json({ skipped: "empty response" });

  const { error } = await supabase.from("wall_posts").insert({
    author_id:   null,
    category,
    text,
    is_seed:     true,
    seed_author: "Yande ✦",
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true, category, preview: text.slice(0, 80) });
}
