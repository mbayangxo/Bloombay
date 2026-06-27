import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createClient as createServerClient } from "@/lib/supabase/server";

function admin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

/** GET /api/club-portal/gatherings/[id]/attendees — reserved seats for club owner */
export async function GET(
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
    .select("id, club_slug")
    .eq("id", id)
    .maybeSingle();

  if (!gathering?.club_slug) {
    return NextResponse.json({ error: "Gathering not found" }, { status: 404 });
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

  const { data: reservations, error } = await db
    .from("seat_reservations")
    .select("user_id, created_at, status")
    .eq("gathering_id", id)
    .eq("status", "reserved")
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const userIds = (reservations ?? []).map((r) => r.user_id as string);
  let profiles: Record<string, { first_name?: string; full_name?: string }> = {};
  if (userIds.length > 0) {
    const { data: profileRows } = await db
      .from("profiles")
      .select("id, first_name, full_name")
      .in("id", userIds);
    profiles = Object.fromEntries(
      (profileRows ?? []).map((p) => [p.id as string, p as { first_name?: string; full_name?: string }]),
    );
  }

  const attendees = (reservations ?? []).map((r) => {
    const profile = profiles[r.user_id as string];
    const name =
      profile?.full_name?.trim() ||
      profile?.first_name?.trim() ||
      "";
    return {
      user_id: r.user_id as string,
      name,
      reserved_at: r.created_at as string,
    };
  });

  return NextResponse.json({ attendees, count: attendees.length });
}
