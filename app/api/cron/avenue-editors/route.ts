// ── Avenue Editors: AI content for each room, every week ─────────────────────
// Runs every Tuesday morning. Each room has its own AI editor persona.
// Results go into avenue_content as status='pending' for human curator review.
//
// Room editors:
//   Magazine   → editorial voice, culture/career/love/opinion
//   Book       → literary curator, reading recommendations
//   Screening  → film & TV editor, what to watch this week
//   Wellness   → wellness guide, pilates/gym spots + recipes + tips
//   Hanger     → fashion editor, trends + NYC sample sales + vintage finds
//   Vanity     → beauty editor, skincare + makeup + product recs
//   Wall       → community editor, weekly prompts + conversation starters
//   Shop       → commerce editor, finds + sales + new arrivals
//   City       → extends City Intelligence with wellness/beauty venues

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-cron-secret");
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );

  const results: Record<string, number> = {};

  await Promise.all([
    runEditor(supabase, MAGAZINE_EDITOR).then(n  => { results.magazine  = n; }),
    runEditor(supabase, BOOK_EDITOR).then(n       => { results.book      = n; }),
    runEditor(supabase, SCREENING_EDITOR).then(n  => { results.screening = n; }),
    runEditor(supabase, WELLNESS_EDITOR).then(n   => { results.wellness  = n; }),
    runEditor(supabase, HANGER_EDITOR).then(n     => { results.hanger    = n; }),
    runEditor(supabase, VANITY_EDITOR).then(n     => { results.vanity    = n; }),
    runEditor(supabase, WALL_EDITOR).then(n       => { results.wall      = n; }),
    runEditor(supabase, SHOP_EDITOR).then(n       => { results.shop      = n; }),
  ]);

  return NextResponse.json({ ok: true, results, week_of: currentMonday() });
}

// ── Room editor configs ───────────────────────────────────────────────────────

interface RoomEditor {
  room: string;
  contentType: string;
  persona: string;
  prompt: string;
  sources?: string[];
  count: number;  // how many items to generate per week
}

const MAGAZINE_EDITOR: RoomEditor = {
  room: "magazine",
  contentType: "article",
  persona: "BloomBay Magazine — a publication by women, for women in their city era",
  count: 5,
  prompt: `Generate 5 magazine article ideas for BloomBay's weekly issue. BloomBay is a women's social club in NYC — members are 22–38, ambitious, culturally curious, building their lives.

Sections: culture | wellness | career | love | style | opinion

For each article return JSON:
{
  "title": "compelling headline",
  "meta": {
    "section": "culture|wellness|career|love|style|opinion",
    "dek": "one-sentence subtitle that makes you want to read it",
    "read_time": "3 min read",
    "author": "a realistic woman's name"
  },
  "body": "opening paragraph only (2-3 sentences). Hook the reader.",
  "yande_note": "why Yande thinks this member should read it (1 sentence, specific)",
  "badge": "COVER STORY" | "THIS WEEK" | null
}

Topics this week should feel timely — think: career pivots after 28, navigating dating in your late 20s, the softlife aesthetic vs real ambition, African diaspora in NYC, what therapy actually changed, building a friend group as an adult.`,
};

const BOOK_EDITOR: RoomEditor = {
  room: "book",
  contentType: "book_rec",
  persona: "A literary Bloomie who reads everything and remembers every line",
  count: 4,
  prompt: `Recommend 4 books for BloomBay women this week. Mix genres: fiction, nonfiction, self-growth, AfrоLit, romance.

For each book return JSON:
{
  "title": "book title",
  "meta": {
    "book_author": "Author Name",
    "category": "fiction|nonfiction|self-growth|romance|afrolit",
    "rating": 4 or 5,
    "why": "2 sentences — why THIS woman should read THIS book right now"
  },
  "yande_note": "Yande's one-liner rec (warm, specific, not generic)",
  "badge": "STAFF PICK" | "TRENDING" | null
}

Prioritize books by women of color, books about identity, diaspora, ambition, love, friendship, and books that are actually being talked about right now.`,
};

const SCREENING_EDITOR: RoomEditor = {
  room: "screening",
  contentType: "film_rec",
  persona: "The Bloomie who always knows what to watch and has strong opinions",
  count: 4,
  prompt: `Recommend 4 films or TV shows for BloomBay women this week. Mix: theatrical, streaming, classics, international.

For each return JSON:
{
  "title": "film or show title",
  "meta": {
    "where_to_watch": "Netflix|Hulu|Prime|A24|In Theaters|etc",
    "genre": "drama|comedy|documentary|thriller|romance|etc",
    "runtime": "1h 45m" or "Series · 8 episodes"
  },
  "body": "2 sentences on what it's about and why it resonates",
  "yande_note": "1 sentence — Yande's specific reason you need to watch this",
  "badge": "NEW THIS WEEK" | "WATCH NOW" | null
}

Bias toward films centering women, Black stories, diaspora narratives, international cinema, and things that are actually being talked about.`,
};

const WELLNESS_EDITOR: RoomEditor = {
  room: "wellness",
  contentType: "wellness_tip",
  persona: "A holistic wellness guide who knows every pilates studio, juice bar, and gym in the city — and actually goes to them",
  count: 6,
  sources: ["TikTok wellness NYC", "Eater healthy restaurants", "ClassPass trending studios"],
  prompt: `Generate 6 pieces of wellness content for BloomBay women this week. Mix: recipes, pilates/gym spots, wellness tips, skincare from within, mental health.

Include 2 NYC wellness spots (pilates studios, gyms, juice bars, wellness eateries that are trending right now) and 4 recipes/tips.

For each return JSON:
{
  "title": "title",
  "content_type": "wellness_tip|place",
  "meta": {
    "category": "juice|smoothie|meal|tip|skincare|pilates|gym|wellness_eatery",
    "ingredients": ["for recipes only"],
    "steps": ["for recipes only"],
    "neighborhood": "for places",
    "why_trending": "for places — why it's hot right now"
  },
  "body": "2-3 sentences. What it is, why it works.",
  "yande_note": "1 sentence why this matters specifically for her body/life right now",
  "badge": "TRENDING" | "TRY THIS WEEK" | null
}

NYC wellness spots to consider this week: what's viral on TikTok fitness (#NYCpilates, #NYCwellness), which studios just opened, which juiceries are getting talked about. Real, specific, current.`,
};

const HANGER_EDITOR: RoomEditor = {
  room: "hanger",
  contentType: "style_pick",
  persona: "A fashion editor who knows every sample sale, vintage find, and trend before it hits the mainstream",
  count: 5,
  sources: ["NYC sample sales this week", "TikTok fashion", "Vogue, Refinery29"],
  prompt: `Generate 5 fashion/style content pieces for BloomBay women this week.

Mix: sample sales happening in NYC this week, style trends, vintage finds, seasonal outfit formulas.

For each return JSON:
{
  "title": "title",
  "meta": {
    "type": "sample_sale|trend|outfit_formula|vintage_find|brand_spotlight",
    "price_range": "$" | "$$" | "$$$" | "free" (for sample sales: "up to X% off"),
    "neighborhood": "if relevant",
    "dates": "if it's a sale — when it runs",
    "buy_url": "brand website or sale URL if known"
  },
  "body": "2-3 sentences. What it is, why it's worth attention right now.",
  "yande_note": "1 sentence — Yande's take on why THIS member needs to see this",
  "badge": "SAMPLE SALE" | "TRENDING" | "THIS WEEKEND" | null
}

Prioritize: NYC-specific sample sales running this week, what's going viral on fashion TikTok, what women are actually wearing on the streets of NYC right now. No generic fashion advice.`,
};

const VANITY_EDITOR: RoomEditor = {
  room: "vanity",
  contentType: "beauty_tip",
  persona: "A beauty editor who loves skincare science, melanin-inclusive beauty, and honest product reviews",
  count: 4,
  sources: ["TikTok beauty", "Allure, Vogue Beauty", "Black beauty creators"],
  prompt: `Generate 4 beauty content pieces for BloomBay women this week.

Mix: skincare routines, trending products, DIY treatments, ingredient spotlights.

For each return JSON:
{
  "title": "title",
  "meta": {
    "category": "skincare|makeup|haircare|nails|fragrance|wellness_beauty",
    "skin_focus": "melanin-inclusive description if relevant",
    "price_range": "$" | "$$" | "$$$" | "drugstore" | "DIY"
  },
  "body": "2-3 sentences. What it is, how to use it, what makes it different.",
  "yande_note": "1 sentence — specific, not generic (e.g. 'This one is genuinely good for hyperpigmentation, not just 'brightening' marketing copy')",
  "badge": "VIRAL" | "EDITOR PICK" | "DIY" | null
}

Bias toward: melanin skin, textured hair, ingredients that actually work, honest assessments over hype, Black and Brown beauty creators, things going viral on BeautyTok right now.`,
};

const WALL_EDITOR: RoomEditor = {
  room: "wall",
  contentType: "community_prompt",
  persona: "The kind of friend who asks the questions that start real conversations",
  count: 3,
  prompt: `Generate 3 community prompts for BloomBay's Wall this week. These go out to all members and spark real conversation.

For each return JSON:
{
  "title": "the prompt as a question",
  "body": "optional 1-sentence context that makes it feel less random and more intentional",
  "meta": {
    "vibe": "reflective|fun|vulnerable|opinion|story-sharing"
  },
  "yande_note": "why Yande is asking this now — what she hopes members will share",
  "badge": "THIS WEEK'S PROMPT" | null
}

Avoid: generic icebreakers, LinkedIn-style 'what's your biggest lesson' questions.
Go for: questions women actually want to answer with a glass of wine — funny, a little vulnerable, specific to this stage of life.`,
};

const SHOP_EDITOR: RoomEditor = {
  room: "shop",
  contentType: "product_rec",
  persona: "A shopping editor who only recommends things she actually loves",
  count: 4,
  prompt: `Generate 4 product recommendations for BloomBay's shop section this week.

Mix: home, lifestyle, wellness tools, books, experiences — things women actually want.

For each return JSON:
{
  "title": "product name or category find",
  "meta": {
    "category": "home|lifestyle|wellness|beauty|fashion|experience|food",
    "price": "$XX",
    "buy_url": "if known",
    "brand": "brand name"
  },
  "body": "2 sentences. What it is, why it's great.",
  "yande_note": "1 sentence — specific to why a BloomBay woman would love this",
  "badge": "STAFF PICK" | "LIMITED" | "NEW" | null
}

Bias toward: Black-owned brands, woman-founded, quality over fast fashion, things you'd genuinely gift your best friend.`,
};

// ── Core runner ───────────────────────────────────────────────────────────────

type Supabase = ReturnType<typeof createClient>;

async function runEditor(supabase: Supabase, editor: RoomEditor): Promise<number> {
  if (!process.env.ANTHROPIC_API_KEY) return 0;

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 2048,
        system: `You are the ${editor.persona}. You write for BloomBay, a curated women's social club in NYC. Everything you generate is culturally aware, specific, and written for women 22–38 who want real recommendations from someone with actual taste. Never generic. Never corporate.`,
        messages: [{ role: "user", content: editor.prompt }],
      }),
    });

    if (!res.ok) return 0;
    const data = await res.json() as { content: Array<{ text: string }> };
    const text = data.content[0]?.text ?? "[]";

    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) return 0;

    const items = JSON.parse(jsonMatch[0]) as Array<Record<string, unknown>>;
    const weekOf = currentMonday();
    let inserted = 0;

    for (const item of items) {
      const { error } = await supabase.from("avenue_content").insert({
        room: editor.room,
        content_type: (item.content_type as string) ?? editor.contentType,
        title: item.title as string,
        body: (item.body as string) ?? null,
        source: "Yande AI",
        meta: (item.meta as object) ?? {},
        yande_note: (item.yande_note as string) ?? null,
        badge: (item.badge as string) ?? null,
        week_of: weekOf,
        status: "pending",
      });
      if (!error) inserted++;
    }

    return inserted;
  } catch (e) {
    console.error(`[AvenueEditors] ${editor.room} failed:`, e);
    return 0;
  }
}

function currentMonday(): string {
  const d = new Date();
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(d.setDate(diff));
  return monday.toISOString().split("T")[0];
}
