import { NextResponse } from "next/server";
import { getMemberPhone } from "@/lib/irl/member-phone";
import { createClient } from "@/lib/supabase/server";
import { getAdminClient } from "@/lib/supabase-admin";

const DEFAULT_CLUB = "morning-run-club";
const DEFAULT_GATHERING_SLUG = "sant-ambroeus-soho";

function funnelDemoAllowed() {
  return (
    process.env.NODE_ENV === "development" ||
    process.env.ALLOW_FUNNEL_DEMO === "1"
  );
}

/** Dev/demo: verified → join club → reserve seat → attend (updates founder 14-day cohort). */
export async function POST() {
  if (!funnelDemoAllowed()) {
    return NextResponse.json({ ok: false, error: "Not available in production" }, { status: 403 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ ok: false, error: "Sign in at /member/login first" }, { status: 401 });
  }

  const steps: string[] = [];

  try {
    const admin = getAdminClient();

    const { error: verifyErr } = await admin
      .from("profiles")
      .update({ verified: true })
      .eq("id", user.id);

    if (verifyErr && !verifyErr.message.includes("does not exist")) {
      return NextResponse.json({ ok: false, error: verifyErr.message }, { status: 500 });
    }
    if (!verifyErr) steps.push("verified");

    const { error: clubErr } = await supabase.from("club_memberships").upsert(
      { user_id: user.id, club_slug: DEFAULT_CLUB },
      { onConflict: "user_id,club_slug" }
    );
    if (clubErr?.message.includes("does not exist")) {
      return NextResponse.json(
        { ok: false, error: "Run supabase/migrations/003_irl_core.sql first" },
        { status: 503 }
      );
    }
    if (clubErr) return NextResponse.json({ ok: false, error: clubErr.message }, { status: 400 });
    steps.push("joined_club");

    const { data: gathering } = await supabase
      .from("gatherings")
      .select("id, slug")
      .eq("slug", DEFAULT_GATHERING_SLUG)
      .maybeSingle();

    if (!gathering) {
      return NextResponse.json({ ok: false, error: "Demo gathering missing — run 003 migration" }, { status: 404 });
    }

    const gatheringId = gathering.id as string;
    const phone = await getMemberPhone(supabase, user.id, user.phone);

    const { data: existingSeat } = await supabase
      .from("seat_reservations")
      .select("id")
      .eq("gathering_id", gatheringId)
      .eq("user_id", user.id)
      .eq("status", "reserved")
      .maybeSingle();

    if (!existingSeat) {
      const { error: seatErr } = await supabase.from("seat_reservations").insert({
        gathering_id: gatheringId,
        user_id: user.id,
        status: "reserved",
        phone,
      });
      if (seatErr) return NextResponse.json({ ok: false, error: seatErr.message }, { status: 400 });
    }
    steps.push("reserved_seat");

    const { error: attendErr } = await supabase.from("gathering_attendance").upsert(
      {
        gathering_id: gatheringId,
        user_id: user.id,
        phone,
        checked_in_at: new Date().toISOString(),
      },
      { onConflict: "gathering_id,user_id" }
    );
    if (attendErr) return NextResponse.json({ ok: false, error: attendErr.message }, { status: 400 });
    steps.push("attended");

    return NextResponse.json({
      ok: true,
      steps,
      message: "IRL funnel complete. Refresh Mission Control → Overview to see cohort update.",
      gatheringSlug: DEFAULT_GATHERING_SLUG,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Funnel failed";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
