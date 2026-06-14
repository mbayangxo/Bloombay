// Memory Layer — runs 1st of every month at 6am EST
// For each active member, summarises their social activity into a Yande memory.
// Powers personalisation: match notes, friendship health, event suggestions.

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function admin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
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
  const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const monthOf  = new Date().toISOString().slice(0, 7); // "2026-06"

  // Fetch active members
  const { data: members, error: membersErr } = await supabase
    .from("profiles")
    .select("id, first_name, full_name")
    .eq("is_member", true)
    .limit(200);

  if (membersErr || !members?.length) {
    return NextResponse.json({ skipped: "no members", error: membersErr?.message });
  }

  let processed = 0;
  let skipped   = 0;

  for (const member of members) {
    try {
      // Already wrote a memory for this member this month?
      const { data: existing } = await supabase
        .from("yande_memories")
        .select("id")
        .eq("user_id", member.id)
        .eq("month_of", monthOf)
        .single();
      if (existing) { skipped++; continue; }

      // Pull activity
      const [
        { data: wallPosts },
        { data: blooms },
        { data: clubMemberships },
      ] = await Promise.all([
        supabase.from("wall_posts")
          .select("category, text")
          .eq("author_id", member.id)
          .eq("is_seed", false)
          .gte("created_at", monthAgo)
          .limit(10),

        supabase.from("wall_post_blooms")
          .select("post_id")
          .eq("user_id", member.id)
          .gte("created_at", monthAgo)
          .limit(20),

        supabase.from("club_memberships")
          .select("club:clubs!club_id ( name )")
          .eq("user_id", member.id)
          .limit(10),
      ]);

      const clubNames = (clubMemberships ?? [])
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .map((m: any) => (Array.isArray(m.club) ? m.club[0]?.name : m.club?.name) as string | undefined)
        .filter(Boolean)
        .join(", ");

      const postSummary = (wallPosts ?? []).length > 0
        ? `Posted ${wallPosts!.length} times on The Wall (topics: ${[...new Set(wallPosts!.map(p => p.category))].join(", ")})`
        : "No Wall posts this month";

      const bloomCount = (blooms ?? []).length;

      // Skip entirely silent members — nothing to write about
      if (!wallPosts?.length && bloomCount === 0 && !clubNames) {
        skipped++;
        continue;
      }

      const context = `
Member: ${member.first_name ?? member.full_name ?? "a member"}
Clubs: ${clubNames || "none"}
Wall activity: ${postSummary}
Reactions given: ${bloomCount} blooms this month
`.trim();

      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "x-api-key": process.env.ANTHROPIC_API_KEY!,
          "anthropic-version": "2023-06-01",
          "content-type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 120,
          system: `You are Yande, BloomBay's AI. Write a 1-2 sentence memory note about this member's social life this month.
Warm, observational, specific. Like a friend who's been paying attention.
No labels or prefixes — just the note itself.`,
          messages: [{ role: "user", content: context }],
        }),
      });

      if (!res.ok) { skipped++; continue; }

      const aiData = await res.json() as { content: { type: string; text: string }[] };
      const note = aiData.content[0]?.text?.trim();
      if (!note) { skipped++; continue; }

      await supabase.from("yande_memories").insert({
        user_id:  member.id,
        month_of: monthOf,
        note,
        raw_data: { clubs: clubNames, wall_posts: wallPosts?.length ?? 0, blooms: bloomCount },
      });

      processed++;

      // Small delay to avoid rate limits
      await new Promise(r => setTimeout(r, 300));

    } catch {
      skipped++;
    }
  }

  return NextResponse.json({ ok: true, processed, skipped, month_of: monthOf });
}
