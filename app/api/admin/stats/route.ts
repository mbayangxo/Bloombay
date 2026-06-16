import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function admin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

function verifyAdmin(req: NextRequest) {
  return req.headers.get("x-admin-password") === process.env.ADMIN_PASSWORD;
}

export async function GET(req: NextRequest) {
  if (!verifyAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = admin();
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const [
    { count: totalMembers },
    { count: newMembersWeek },
    { count: pendingApps },
    { count: activeClubs },
    { count: wallPosts },
    { count: wallPostsWeek },
    { count: girlmateListings },
    { data: topClubs },
    { data: recentApps },
  ] = await Promise.all([
    supabase.from("profiles").select("id", { count: "exact", head: true }).eq("is_member", true),
    supabase.from("profiles").select("id", { count: "exact", head: true }).eq("is_member", true).gte("membership_started_at", weekAgo),
    supabase.from("member_applications").select("id", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("clubs").select("id", { count: "exact", head: true }).eq("is_active", true),
    supabase.from("wall_posts").select("id", { count: "exact", head: true }),
    supabase.from("wall_posts").select("id", { count: "exact", head: true }).gte("created_at", weekAgo),
    supabase.from("girlmate_profiles").select("id", { count: "exact", head: true }).eq("is_active", true),
    supabase.from("clubs").select("id, name, member_count, is_active").eq("is_active", true).order("member_count", { ascending: false }).limit(8),
    supabase.from("member_applications").select("id, first_name, name, neighborhood, city, submitted_at, founding_mother").eq("status", "pending").order("submitted_at", { ascending: false }).limit(10),
  ]);

  return NextResponse.json({
    members: {
      total:       totalMembers ?? 0,
      new_week:    newMembersWeek ?? 0,
      pending:     pendingApps ?? 0,
    },
    clubs: {
      active:      activeClubs ?? 0,
      top:         topClubs ?? [],
    },
    wall: {
      total_posts: wallPosts ?? 0,
      posts_week:  wallPostsWeek ?? 0,
    },
    girlmate: {
      active_listings: girlmateListings ?? 0,
    },
    recent_applications: recentApps ?? [],
  });
}
