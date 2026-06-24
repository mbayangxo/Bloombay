import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  // Member-only: require sign-in before returning any profile data
  const supabase = await createClient();
  const { data: { user: viewer } } = await supabase.auth.getUser();
  if (!viewer) return NextResponse.json({ error: "Sign in required" }, { status: 401 });

  const { username } = await params;
  if (!username || username.length > 100) {
    return NextResponse.json({ error: "Invalid username" }, { status: 400 });
  }

  const admin = createAdminClient();

  // TODO: once a `username` column exists on profiles, replace this with a
  // direct .from("profiles").eq("username", username) query.
  // For now: paginate auth.users and match by email prefix.
  const { data: listData } = await admin.auth.admin.listUsers({ perPage: 500 });
  const authUser = (listData?.users ?? []).find(
    u => u.email?.split("@")[0] === username
  );

  if (!authUser) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  const { data: p } = await admin
    .from("profiles")
    .select("full_name, first_name, bio, avatar_url, neighborhood, city, role, show_socials, instagram, tiktok, twitter, pinterest, spotify, website")
    .eq("id", authUser.id)
    .single();

  if (!p) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  // Do not expose role value — return a safe boolean instead
  const isVerified = p.role === "founder" || p.role === "admin";

  return NextResponse.json({
    id: authUser.id,
    name: p.full_name || p.first_name || username,
    username,
    bio: p.bio ?? "",
    avatar_url: p.avatar_url ?? null,
    neighborhood: p.neighborhood ?? "",
    city: p.city ?? "",
    isVerified,
    socials: p.show_socials ? {
      instagram:  p.instagram  ?? null,
      tiktok:     p.tiktok     ?? null,
      twitter:    p.twitter    ?? null,
      pinterest:  p.pinterest  ?? null,
      spotify:    p.spotify    ?? null,
      website:    p.website    ?? null,
    } : null,
  });
}
