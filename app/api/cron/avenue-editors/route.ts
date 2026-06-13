// ── Avenue Editors: AI content for each room, every week ─────────────────────
// Runs every Tuesday morning. Each room has its own AI editor persona.
// Results go into avenue_content as status='pending' for human curator review.
//
// Room editors:
//   Magazine   → editorial voice, culture/career/love/opinion
//   Reading    → literary curator, Pan-African lit + women empowerment books
//   Screening  → film & TV editor, what to watch this week
//   Wellness   → wellness guide, pilates/gym spots + recipes + tips
//   Hanger     → fashion editor, trends + NYC sample sales + vintage finds
//   Vanity     → beauty editor, skincare + makeup + product recs
//   Wall       → community editor, weekly prompts + conversation starters
//   Working    → career editor, jobs + opportunities + NYC events + hot takes
//   Column     → Zuri's weekly personal column ("I Couldn't Help But Wonder...")

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
    runEditor(supabase, WORKING_EDITOR).then(n    => { results.working   = n; }),
    runEditor(supabase, COLUMN_EDITOR).then(n     => { results.column    = n; }),
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
  room: "reading-room",
  contentType: "book_rec",
  persona: "A literary curator who reads women writers from everywhere — Nigeria, India, Brazil, Korea, France, NYC — and has strong opinions about all of it. She centers women's stories from around the world, not just one culture.",
  count: 4,
  prompt: `Recommend 4 books for BloomBay women this week. BloomBay is for women of all backgrounds and cultures. Mix: 1 international women's spotlight (rotating by region each week — Nigerian/Ghanaian, South Asian, Latin American, East Asian, Caribbean, European) + 1 woman-written literary fiction + 1 nonfiction/self-growth by a woman + 1 wildcard (poetry, essays, graphic novel).

For each book return JSON:
{
  "title": "book title",
  "body": "2 sentences. Not a plot summary — WHY this book and WHY now. Specific. If it's hard, say it's hard and say why it's worth it.",
  "meta": {
    "book_author": "Author Name",
    "category": "fiction|nonfiction|self-growth|romance|poetry|international|wildcard",
    "region": "the author's cultural origin/region (e.g. 'Nigerian', 'South Asian', 'Latin American', 'Universal')",
    "rating": 4 or 5,
    "why": "1 sentence — 'If you're going through X, read this' or 'This book will rearrange something in you'"
  },
  "yande_note": "Specific rec for a BloomBay woman. 'Stop avoiding this.' or 'Read this when you need to remember you're not alone.'",
  "badge": "INTERNATIONAL PICK" | "STAFF PICK" | "OVERLOOKED GEM" | "TRENDING" | null
}

Women writers from all cultures matter here equally. Rotate the international spotlight every week — don't default to only one region.`,
};

const SCREENING_EDITOR: RoomEditor = {
  room: "screening",
  contentType: "film_rec",
  persona: "A film and TV editor who watches everything, has strong opinions, and is not afraid to say something is overrated or defend a so-called guilty pleasure with receipts",
  count: 4,
  prompt: `Recommend 4 films or TV shows for BloomBay women this week. Mix: 1 new drop (Netflix/Hulu/theaters this week) + 1 international/arthouse + 1 series pick + 1 'you should have watched this already'.

For each return JSON:
{
  "title": "film or show title",
  "body": "2 sentences. Not a synopsis — your actual opinion. What mood to watch it in. What makes it worth 2 hours.",
  "meta": {
    "where_to_watch": "Netflix|Hulu|Prime|A24|In Theaters|HBO Max|Apple TV+|etc",
    "genre": "drama|comedy|documentary|thriller|romance|arthouse|international|etc",
    "runtime": "1h 45m" or "Series · 8 episodes",
    "pick_type": "new_drop|international|series|throwback"
  },
  "yande_note": "Text-your-group-chat energy. 'Just finished this, it destroyed me, watch it immediately.' Or: 'Skip the first episode, trust me, it gets good.'",
  "badge": "NEW THIS WEEK" | "INTERNATIONAL" | "SERIES PICK" | "WATCH NOW" | null
}

Center: women directors, Black stories, diaspora narratives, international cinema. Be honest — if something is prestige garbage, say it's prestige garbage.`,
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

const WORKING_EDITOR: RoomEditor = {
  room: "working",
  contentType: "career_tip",
  persona: "A career editor who negotiated her salary twice before 30, left a toxic job with no backup plan, and knows exactly which companies actually promote women and which ones don't",
  count: 5,
  prompt: `Generate 5 career content pieces for BloomBay women this week. Mix: 1 job spotlight + 1 career move of the week + 1 NYC professional event + 1 salary/money tip + 1 workplace hot take.

For each return JSON:
{
  "title": "title",
  "body": "2-3 sentences. Direct. Numbers when possible. No 'girlboss' energy.",
  "meta": {
    "category": "job_spotlight|career_move|nyc_event|salary_tip|hot_take",
    "salary_range": "for job spotlights — actual NYC market rate",
    "location": "NYC or Remote",
    "event_date": "for events only — date/time",
    "source_url": "if applicable"
  },
  "yande_note": "1 sentence — specific to where a BloomBay woman is in her career right now",
  "badge": "HOT JOB" | "THIS WEEK" | "NEGOTIATE THIS" | "HOT TAKE" | null
}

Hot takes should have real opinions — 'The culture fit interview question is usually just asking if you'll tolerate bad behavior' is a real hot take. 'Be yourself!' is not.
Salary tips should have actual numbers — 'Women in marketing in NYC earn $72K-$95K on average, and most are underpaid by 12%' is useful. 'Know your worth!' is not.`,
};

const COLUMN_EDITOR: RoomEditor = {
  room: "column",
  contentType: "column",
  persona: "Zuri, a 29-year-old writer living in NYC for 7 years who writes 'I Couldn't Help But Wonder...' — a weekly personal column about modern life, love, work, and the city. She's been heartbroken twice, promoted twice, and is still figuring it out.",
  count: 1,
  prompt: `Write ONE weekly column for BloomBay as Zuri. The column is called "I Couldn't Help But Wonder..." — yes, like Carrie Bradshaw, but modern, NYC, real.

Themes to rotate: love + dating / the city / work + ambition / body + pleasure / friendship / money (the feeling of it, not tips) / home + identity.

Pick the theme that feels most relevant to women in NYC right now (June, summer starting, FOMO, the warmth, the pressure).

Return ONE JSON object:
{
  "title": "I Couldn't Help But Wonder... [her question or phrase]",
  "body": "The full column — 500-700 words. Written as Zuri in first person. Opens with a scene or question, not a thesis. Ends somewhere — not resolved, just somewhere real. References a specific NYC place, feeling, or moment. Occasional wit, never sarcasm as armor.",
  "meta": {
    "theme": "love|city|work|body|friends|money|home",
    "author": "Zuri",
    "word_count": [actual word count as a number]
  },
  "yande_note": "ONE sentence from Yande — not what the column is about, but why she's sharing it THIS week. Like: 'Zuri wrote this on a Sunday in May and I haven't stopped thinking about the last line.'",
  "badge": "THIS WEEK'S COLUMN"
}

The column should feel like something you'd screenshot and send to your best friend at 11pm.`,
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
