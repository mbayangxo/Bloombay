import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@supabase/supabase-js";
import { getAuthUser } from "@/lib/auth/get-user";

function admin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

const SECTIONS = ["style", "culture", "love", "career", "wellness", "opinion"] as const;
type Section = typeof SECTIONS[number];

const COVER_PALETTES: Record<Section, [string, string]> = {
  style:    ["#1A0526", "#7B1FA2"],
  culture:  ["#0A2218", "#1A7A4A"],
  love:     ["#3A0A20", "#AD1457"],
  career:   ["#0A1535", "#1565C0"],
  wellness: ["#0D2218", "#2D6A4F"],
  opinion:  ["#2A0D00", "#BF360C"],
};

const SYSTEM_PROMPT = `You are the editor of Bloombay Magazine — a publication by women, for women navigating their city era. Think Vogue meets The Cut meets your most culturally switched-on friend.

Your editorial voice:
- Black women's experiences are centered, never an afterthought
- African and diaspora perspectives woven naturally throughout
- First person is allowed but not required
- No listicle energy ("10 ways to...") — write in paragraphs with actual ideas
- Opinion pieces have an actual opinion, not "on one hand / on the other"
- Never condescending, never basic
- Sources you'd draw from: The Cut, Vogue, Harper's Bazaar, Coveteur, Nigerian/Ghanaian publications, accessible sociology/psychology

Sections: style, culture, love, career, wellness, opinion

You write 5 articles per week — one per section (choose 5 of the 6).`;

const USER_PROMPT = (weekOf: string) => `Generate this week's 5 Bloombay Magazine articles for the week of ${weekOf}.

Return a JSON array of exactly 5 articles. Each article:
{
  "section": "style" | "culture" | "love" | "career" | "wellness" | "opinion",
  "headline": "compelling headline, editorial not listicle",
  "dek": "one sentence that makes you want to click",
  "author": "First name + last initial (invented, diverse)",
  "read_time": "X min read",
  "body": "3-4 substantial paragraphs in full editorial voice",
  "yande_note": "one personal sentence recommending this article to a Bloomie",
  "badge": "COVER STORY" | "EDITOR'S PICK" | "THIS WEEK" | "OPINION" | null,
  "featured": true (only for one article) | false
}

Exactly one article should have featured: true and badge: "COVER STORY".`;

// POST /api/avenue/magazine/generate
// Requires admin/founder/curator role. Generates 5 articles via Claude + inserts as 'pending'.
export async function POST() {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Check role
  const supabase = admin();
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile || !["admin", "founder", "curator"].includes(profile.role ?? "")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: "ANTHROPIC_API_KEY not configured" }, { status: 500 });
  }

  const weekOf = new Date().toISOString().split("T")[0];

  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 6000,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: USER_PROMPT(weekOf) }],
    });

    const raw = message.content[0].type === "text" ? message.content[0].text : "";
    const jsonMatch = raw.match(/\[[\s\S]*\]/);
    if (!jsonMatch) return NextResponse.json({ error: "Model did not return valid JSON" }, { status: 500 });

    const articles = JSON.parse(jsonMatch[0]) as Array<{
      section: Section;
      headline: string;
      dek: string;
      author: string;
      read_time: string;
      body: string;
      yande_note: string;
      badge: string | null;
      featured: boolean;
    }>;

    const rows = articles.map((a, i) => {
      const [cover_a, cover_b] = COVER_PALETTES[a.section] ?? ["#1A0526", "#7B1FA2"];
      return {
        room: "magazine",
        content_type: "article",
        title: a.headline,
        body: a.body,
        source: "AI-generated",
        meta: {
          section:    a.section,
          dek:        a.dek,
          read_time:  a.read_time,
          author:     a.author,
          cover_a,
          cover_b,
          featured:   a.featured ?? false,
        },
        yande_note:  a.yande_note,
        badge:       a.badge ?? null,
        week_of:     weekOf,
        rank_order:  i + 1,
        status:      "pending",
      };
    });

    const { data: inserted, error: insertError } = await supabase
      .from("avenue_content")
      .insert(rows)
      .select("id, title, meta, badge, status");

    if (insertError) return NextResponse.json({ error: insertError.message }, { status: 500 });

    return NextResponse.json({ generated: inserted?.length ?? 0, articles: inserted, week_of: weekOf });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Generation failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
