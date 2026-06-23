import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;
  const admin = createAdminClient();

  // Look up auth.users by email prefix (username = email before @)
  const { data: listData } = await admin.auth.admin.listUsers({ perPage: 1000 });
  const authUser = listData?.users.find(u => u.email?.split("@")[0] === username);

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

  return NextResponse.json({
    id: authUser.id,
    name: p.full_name || p.first_name || username,
    username,
    bio: p.bio ?? "",
    avatar_url: p.avatar_url ?? null,
    neighborhood: p.neighborhood ?? "",
    city: p.city ?? "",
    isFounder: p.role === "founder" || p.role === "admin",
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
