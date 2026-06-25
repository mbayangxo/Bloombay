// Founder Analyst — runs Monday 9am EST
// Pulls a week of real data from Supabase, writes a Yande-voiced digest,
// stores it in founder_analyst_reports, then sends to founder via notification.

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { cronGuard, isDryRun, logCronRun } from "@/lib/cron-guard";

function admin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

export async function POST(req: NextRequest) {
  const guard = cronGuard(req, "founder-analyst");
  if (guard) return guard;

  if (isDryRun()) {
    return NextResponse.json({ ok: true, dry_run: true, message: "Dry run — no data written" });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ skipped: "no anthropic key" });
  }

  const supabase = admin();
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  try {
    // ── Pull raw data ──────────────────────────────────────────────────────────
    const [
      { count: newMembers },
      { count: pendingApps },
      { count: newPosts },
      { count: newBlooms },
      { data: topCities },
      { data: recentApps },
    ] = await Promise.all([
      supabase.from("profiles").select("id", { count: "exact", head: true })
        .eq("is_member", true).gte("membership_started_at", weekAgo),

      supabase.from("member_applications").select("id", { count: "exact", head: true })
        .eq("status", "pending"),

      supabase.from("wall_posts").select("id", { count: "exact", head: true })
        .gte("created_at", weekAgo),

      supabase.from("wall_post_blooms").select("post_id", { count: "exact", head: true })
        .gte("created_at", weekAgo),

      supabase.from("girlmate_profiles")
        .select("city")
        .eq("is_active", true),

      supabase.from("member_applications")
        .select("first_name, neighborhood, city, submitted_at")
        .eq("status", "pending")
        .order("submitted_at", { ascending: false })
        .limit(5),
    ]);

    const cityMap: Record<string, number> = {};
    for (const row of (topCities ?? [])) {
      cityMap[row.city] = (cityMap[row.city] ?? 0) + 1;
    }
    const topGirlMateCities = Object.entries(cityMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([city, count]) => `${city} (${count})`);

    const pendingNames = (recentApps ?? [])
      .map(a => `${a.first_name ?? "Someone"} from ${a.neighborhood ?? a.city}`)
      .join(", ");

    const dataContext = `
WEEK: ${new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}

MEMBERS:
- New members approved this week: ${newMembers ?? 0}
- Applications waiting for review: ${pendingApps ?? 0}
- Pending applicants: ${pendingNames || "none listed"}

THE WALL:
- Posts this week (real + Yande seeds): ${newPosts ?? 0}
- Bloom reactions this week: ${newBlooms ?? 0}

GIRLMATE:
- Active listings by city: ${topGirlMateCities.join(", ") || "none yet"}
`.trim();

    const systemPrompt = `You are Yande, BloomBay's AI co-founder. Every Monday you send the founder a short, honest weekly digest.

Your voice: warm, direct, smart. Not corporate. Not cheerful-filler. Like a brilliant friend who runs ops for you and notices everything.

Write a digest with these sections:
1. One opening sentence that captures the week's energy (not stats, just feeling).
2. MEMBERS — what's happening with growth and the waitlist.
3. THE WALL — is the community talking? What does engagement say?
4. GIRLMATE — where's the demand?
5. One thing you'd do this week if you were the founder.

Use plain text. No markdown headers. Short paragraphs. Real talk. Under 280 words total.`;

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": process.env.ANTHROPIC_API_KEY!,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 400,
        system: systemPrompt,
        messages: [{ role: "user", content: `Here's the data:\n\n${dataContext}\n\nWrite the digest.` }],
      }),
    });

    if (!res.ok) {
      await logCronRun("founder-analyst", "error", { error: "Claude API error" });
      return NextResponse.json({ error: "Claude API error" }, { status: 500 });
    }

    const aiData = await res.json() as { content: { type: string; text: string }[] };
    const report = aiData.content[0]?.text?.trim() ?? "";
    if (!report) {
      await logCronRun("founder-analyst", "skipped", { reason: "empty response" });
      return NextResponse.json({ skipped: "empty response" });
    }

    const weekOf = new Date().toISOString().split("T")[0];

    const { error: insertError } = await supabase
      .from("founder_analyst_reports")
      .upsert({
        week_of: weekOf,
        report_text: report,
        raw_data: {
          new_members: newMembers,
          pending_apps: pendingApps,
          wall_posts: newPosts,
          wall_blooms: newBlooms,
          girlmate_cities: cityMap,
        },
        created_at: new Date().toISOString(),
      }, { onConflict: "week_of" });

    if (insertError) {
      await logCronRun("founder-analyst", "error", { error: insertError.message });
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    if (process.env.FOUNDER_USER_ID) {
      await supabase.from("notifications").insert({
        user_id:    process.env.FOUNDER_USER_ID,
        type:       "celebrate",
        title:      "Yande's weekly digest is ready ✦",
        body:       report.slice(0, 140),
        link:       "/admin/dashboard",
      });
    }

    await logCronRun("founder-analyst", "ok", { records_processed: 1, week_of: weekOf });
    return NextResponse.json({ ok: true, week_of: weekOf, preview: report.slice(0, 120) });
  } catch (err) {
    await logCronRun("founder-analyst", "error", { error: String(err) });
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
