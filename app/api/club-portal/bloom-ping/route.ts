// POST /api/club-portal/bloom-ping – send a real notification to every member
//      of the authenticated owner's club.
// GET  /api/club-portal/bloom-ping – recent ping history for that club.

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

async function getOwnerClub(supabase: Awaited<ReturnType<typeof createClient>>, userId: string) {
  const { data } = await supabase
    .from("clubs")
    .select("slug, name")
    .eq("owner_id", userId)
    .maybeSingle();
  return data as { slug: string; name: string | null } | null;
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const club = await getOwnerClub(supabase, user.id);
  if (!club?.slug) return NextResponse.json({ error: "No club" }, { status: 404 });

  const body = await req.json().catch(() => ({}));
  const message = typeof body?.message === "string" ? body.message.trim() : "";
  if (!message) return NextResponse.json({ error: "Message required" }, { status: 400 });

  const { data: memberships } = await supabase
    .from("club_memberships")
    .select("user_id")
    .eq("club_slug", club.slug);

  const memberIds = [...new Set((memberships ?? []).map((m) => m.user_id as string))];
  if (!memberIds.length) {
    return NextResponse.json({ ok: true, recipientCount: 0 });
  }

  // The owner is inserting notification rows for OTHER users (their club's
  // members), not themselves — notifs_insert_service RLS only allows
  // auth.uid() = user_id, so this needs the service-role client (same
  // pattern as the Stripe webhook and the applications PATCH route).
  const rows = memberIds.map((memberId) => ({
    user_id: memberId,
    type: "club",
    title: `Bloom ping from ${club.name ?? "your club"}`,
    body: message,
    link: `/member/clubs/${club.slug}`,
    data: { clubSlug: club.slug, clubName: club.name ?? null },
  }));

  const { error } = await createAdminClient().from("notifications").insert(rows);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true, recipientCount: memberIds.length });
}

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const club = await getOwnerClub(supabase, user.id);
  if (!club?.slug) return NextResponse.json([]);

  // Reading rows that belong to OTHER users (the club's members), so this
  // also needs the service-role client — notifs_read_own RLS only allows a
  // user to read their own rows.
  const { data: rows } = await createAdminClient()
    .from("notifications")
    .select("body, created_at, data")
    .eq("type", "club")
    .contains("data", { clubSlug: club.slug })
    .order("created_at", { ascending: false })
    .limit(300);

  // One row was inserted per recipient in a single INSERT statement, so all
  // rows from the same ping share an identical created_at — group by
  // (created_at, body) to reconstruct "one ping, N recipients".
  const seen = new Map<string, { message: string; sentAt: string; recipientCount: number }>();
  for (const r of rows ?? []) {
    const key = `${r.created_at}|${r.body}`;
    const existing = seen.get(key);
    if (existing) existing.recipientCount += 1;
    else seen.set(key, { message: (r.body as string) ?? "", sentAt: r.created_at as string, recipientCount: 1 });
  }

  return NextResponse.json([...seen.values()].slice(0, 20));
}
