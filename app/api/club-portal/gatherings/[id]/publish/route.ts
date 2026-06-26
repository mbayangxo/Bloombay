import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createClient as createServerClient } from "@/lib/supabase/server";

function admin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

/** POST /api/club-portal/gatherings/[id]/publish — go live (gov-ID gate) */
export async function POST(
  _req: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = admin();

  const { data: gathering } = await db
    .from("gatherings")
    .select("id, title, club_slug, publish_status")
    .eq("id", id)
    .maybeSingle();

  if (!gathering) {
    return NextResponse.json({ error: "Gathering not found" }, { status: 404 });
  }

  if (!gathering.club_slug) {
    return NextResponse.json({ error: "Gathering has no club" }, { status: 400 });
  }

  const { data: club } = await db
    .from("clubs")
    .select("id")
    .eq("slug", gathering.club_slug)
    .eq("owner_id", user.id)
    .maybeSingle();

  if (!club) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { data: profile } = await db
    .from("profiles")
    .select("gov_id_verification_status")
    .eq("id", user.id)
    .single();

  const govStatus = (profile?.gov_id_verification_status as string | null) ?? "not_submitted";
  if (govStatus !== "verified") {
    return NextResponse.json(
      {
        error: "Government ID verification required before publishing",
        gov_id_verification_status: govStatus,
      },
      { status: 403 },
    );
  }

  if (gathering.publish_status === "live") {
    return NextResponse.json({ ok: true, publish_status: "live", alreadyLive: true });
  }

  const { error: updateErr } = await db
    .from("gatherings")
    .update({
      publish_status: "live",
      event_type: "club_gathering",
    })
    .eq("id", id);

  if (updateErr) {
    return NextResponse.json({ error: updateErr.message }, { status: 500 });
  }

  await db.from("gathering_audit_log").insert({
    gathering_id: id,
    user_id: user.id,
    action: "gathering_published",
    meta: { gov_id_verification_status: govStatus },
  });

  return NextResponse.json({ ok: true, publish_status: "live" });
}
