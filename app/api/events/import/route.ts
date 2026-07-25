import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseExternalEventUrl, detectEventSource } from "@/lib/events/parse-external-event";
import { scoreNightAesthetic } from "@/lib/nights/promote";
import { canAccessPortal, normalizeRole } from "@/lib/auth/roles";

/**
 * POST /api/events/import
 * Body: { url: string, publish?: boolean }
 * - Parses Luma / Partiful / Eventbrite URL
 * - Creates a night_submission (pending review) OR direct gathering if publish + host/club mama
 */
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await req.json()) as { url?: string; publish?: boolean; clubId?: string };
  const url = body.url?.trim();
  if (!url) return NextResponse.json({ error: "url required" }, { status: 400 });

  const sourceHint = detectEventSource(url);
  if (sourceHint === "other") {
    return NextResponse.json(
      { error: "Use a Luma, Partiful, or Eventbrite event link" },
      { status: 400 },
    );
  }

  let parsed;
  try {
    parsed = await parseExternalEventUrl(url);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Could not import that link" },
      { status: 422 },
    );
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();
  const role = normalizeRole(profile?.role as string | undefined);

  const { data: ownedClub } = await supabase
    .from("clubs")
    .select("id")
    .eq("owner_id", user.id)
    .limit(1)
    .maybeSingle();

  const isClubMama =
    canAccessPortal(role, "club_owner") || role === "founder" || !!ownedClub;
  const canPublish = body.publish === true && (isClubMama || role === "founder" || role === "member");

  const aesthetic = scoreNightAesthetic(parsed.title, parsed.description);

  // Always record as night submission for audit trail
  const { data: night, error: nightErr } = await supabase
    .from("night_submissions")
    .insert({
      title: parsed.title,
      description: parsed.description,
      starts_at: parsed.starts_at,
      venue: parsed.venue,
      neighborhood: null,
      city: parsed.city,
      image_url: parsed.image_url,
      external_url: parsed.url,
      external_source: parsed.source,
      category: "event",
      aesthetic_score: aesthetic.score,
      aesthetic_note: aesthetic.note,
      status: canPublish && aesthetic.keep ? "approved" : "pending",
      submitted_by: user.id,
    })
    .select("id")
    .single();

  if (nightErr) {
    return NextResponse.json({ error: nightErr.message }, { status: 500 });
  }

  let gatheringId: string | null = null;
  let gatheringSlug: string | null = null;

  if (canPublish && aesthetic.keep) {
    const slugBase = parsed.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 40);
    const slug = `${slugBase || "import"}-${Math.random().toString(36).slice(2, 8)}`;

    const { data: gathering, error: gErr } = await supabase
      .from("gatherings")
      .insert({
        title: parsed.title,
        description: parsed.description,
        starts_at: parsed.starts_at ?? new Date(Date.now() + 7 * 864e5).toISOString(),
        venue: parsed.venue,
        city: parsed.city,
        cover_url: parsed.image_url,
        host_id: user.id,
        slug,
        event_type: "gathering",
        external_url: parsed.url,
        club_id: body.clubId ?? ownedClub?.id ?? null,
      })
      .select("id, slug")
      .single();

    if (!gErr && gathering) {
      gatheringId = gathering.id as string;
      gatheringSlug = gathering.slug as string;
      await supabase
        .from("night_submissions")
        .update({ gathering_id: gatheringId, status: "approved" })
        .eq("id", night.id);
    }
  }

  return NextResponse.json({
    ok: true,
    source: parsed.source,
    preview: {
      title: parsed.title,
      description: parsed.description,
      starts_at: parsed.starts_at,
      venue: parsed.venue,
      image_url: parsed.image_url,
      url: parsed.url,
    },
    nightId: night.id,
    gatheringId,
    gatheringSlug,
    status: gatheringId ? "published" : "pending_review",
    message: gatheringId
      ? "Imported and published to Happenings"
      : "Imported — pending BloomBay review before it goes live",
  });
}

/** GET ?url= — preview only, no write */
export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = req.nextUrl.searchParams.get("url")?.trim();
  if (!url) return NextResponse.json({ error: "url required" }, { status: 400 });

  try {
    const parsed = await parseExternalEventUrl(url);
    return NextResponse.json({ ok: true, preview: parsed });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Could not parse" },
      { status: 422 },
    );
  }
}
