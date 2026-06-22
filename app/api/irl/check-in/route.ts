import { NextResponse } from "next/server";
import { getMemberPhone } from "@/lib/irl/member-phone";
import { createClient } from "@/lib/supabase/server";
import { logBehaviorSignal } from "@/lib/truth/behavior";
import { resolveGatheringId } from "@/lib/truth/resolve-gathering";

/** Mark attended IRL — used after QR / host scan (MVP: member self check-in). */
export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ ok: false, error: "Sign in required" }, { status: 401 });
  }

  let body: { gatheringId?: string; slug?: string; eventKey?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const resolved = await resolveGatheringId(supabase, body);
  if (!resolved) {
    return NextResponse.json({ ok: false, error: "Gathering not found" }, { status: 404 });
  }

  const gatheringId = resolved.id;
  const phone = await getMemberPhone(supabase, user.id, user.phone);

  const { error } = await supabase.from("gathering_attendance").upsert(
    {
      gathering_id: gatheringId,
      user_id: user.id,
      phone,
      checked_in_at: new Date().toISOString(),
    },
    { onConflict: "gathering_id,user_id" }
  );

  if (error) {
    if (error.message.includes("does not exist")) {
      return NextResponse.json(
        { ok: false, error: "Run supabase/migrations/003_irl_core.sql first" },
        { status: 503 }
      );
    }
    return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
  }

  const STREAK_WINDOW_DAYS = 7;

  const { data: coAttendees } = await supabase
    .from("gathering_attendance")
    .select("user_id")
    .eq("gathering_id", gatheringId)
    .neq("user_id", user.id)
    .limit(50);

  if (coAttendees && coAttendees.length > 0) {
    void (async () => {
      try {
        await Promise.all(
          coAttendees.map(async (coAttendee) => {
            const [ua, ub] = [user.id, coAttendee.user_id].sort();

            const coAttendanceUpdate = supabase.rpc("increment_co_attendance", {
              uid_a: ua,
              uid_b: ub,
            }).then(() => null).catch(() => null);

            const streakUpdate = (async () => {
              const { data: existing } = await supabase
                .from("bloom_scan_streaks")
                .select("streak_count, last_scan_at")
                .eq("user_a", ua)
                .eq("user_b", ub)
                .maybeSingle();

              const now = new Date();
              let newCount = 1;

              if (existing?.last_scan_at) {
                const lastScan = new Date(existing.last_scan_at);
                const diffDays = (now.getTime() - lastScan.getTime()) / (1000 * 60 * 60 * 24);
                newCount = diffDays <= STREAK_WINDOW_DAYS ? (existing.streak_count ?? 0) + 1 : 1;
              }

              await supabase
                .from("bloom_scan_streaks")
                .upsert(
                  { user_a: ua, user_b: ub, streak_count: newCount, last_scan_at: now.toISOString() },
                  { onConflict: "user_a,user_b" }
                );
            })().catch(() => null);

            await Promise.all([coAttendanceUpdate, streakUpdate]);
          })
        );
      } catch {
        /* non-fatal */
      }
    })();
  }

  await logBehaviorSignal(supabase, user.id, "attended_irl", {
    gatheringId,
    slug: resolved.slug,
  });

  const { error: stampErr } = await supabase.from("member_stamps").insert({
    user_id: user.id,
    label: "Showed up IRL",
    gathering_id: gatheringId,
  });
  if (stampErr && !stampErr.message.includes("does not exist")) {
    /* non-fatal */
  }

  return NextResponse.json({ ok: true, gatheringId });
}
