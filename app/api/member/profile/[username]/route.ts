import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// GET /api/member/profile/[username]
// `username` is, in practice, a profile id (callers pass seller_id/author_id).
// Members only. Looks up the profiles table directly — never enumerates
// auth.users via listUsers (which leaked emails and broke past 1000 users).
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;

  // Require a signed-in member.
  const authed = await createClient();
  const { data: { user } } = await authed.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const admin = createAdminClient();
  const cols =
    "id, full_name, first_name, bio, avatar_url, neighborhood, city, role, show_socials, instagram, tiktok, twitter, pinterest, spotify, website";

  // Resolve by id when the segment is a UUID; otherwise by email prefix
  // (username = the part before @), matched on the profiles table directly.
  const query = admin.from("profiles").select(cols);
  const { data: p } = UUID_RE.test(username)
    ? await query.eq("id", username).maybeSingle()
    : await query.ilike("email", `${username.replace(/[%,]/g, "")}@%`).maybeSingle();

  if (!p) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  const row = p as {
    id: string; full_name: string | null; first_name: string | null; bio: string | null;
    avatar_url: string | null; neighborhood: string | null; city: string | null; role: string | null;
    show_socials: boolean | null; instagram: string | null; tiktok: string | null;
    twitter: string | null; pinterest: string | null; spotify: string | null; website: string | null;
  };

  return NextResponse.json({
    id: row.id,
    name: row.full_name || row.first_name || username,
    username,
    bio: row.bio ?? "",
    avatar_url: row.avatar_url ?? null,
    neighborhood: row.neighborhood ?? "",
    city: row.city ?? "",
    isFounder: row.role === "founder" || row.role === "admin",
    socials: row.show_socials ? {
      instagram:  row.instagram  ?? null,
      tiktok:     row.tiktok     ?? null,
      twitter:    row.twitter    ?? null,
      pinterest:  row.pinterest  ?? null,
      spotify:    row.spotify    ?? null,
      website:    row.website    ?? null,
    } : null,
  });
}
