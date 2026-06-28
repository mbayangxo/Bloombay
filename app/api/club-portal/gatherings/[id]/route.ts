import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createClient as createServerClient } from "@/lib/supabase/server";

function admin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

/** PATCH /api/club-portal/gatherings/[id] — cancel gathering */
export async function PATCH(
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
    .select("id, club_slug, title")
    .eq("id", id)
    .maybeSingle();

  if (!gathering) {
    return NextResponse.json({ error: "Gathering not found" }, { status: 404 });
  }

  if (!gathering.club_slug) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
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

  const { error } = await db
    .from("gatherings")
    .update({ publish_status: "cancelled" })
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await db.from("gathering_audit_log").insert({
    gathering_id: id,
    user_id: user.id,
    action: "gathering_cancelled",
    meta: { title: gathering.title },
  });

  return NextResponse.json({ ok: true, publish_status: "cancelled" });
}
