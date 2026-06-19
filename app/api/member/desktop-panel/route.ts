import { NextResponse } from "next/server";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { createClient as createAdmin } from "@supabase/supabase-js";

function admin() {
  return createAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

// GET /api/member/desktop-panel
// Returns data for the desktop right rail:
//   - upcoming: next 3 events (today + tomorrow)
//   - posts: top 3 wall posts by blooms
//   - stats: member count (approx)
export async function GET() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({}, { status: 401 });

  const db = admin();

  const now = new Date().toISOString();
  const soon = new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString();

  const [eventsRes, postsRes, statsRes] = await Promise.all([
    db
      .from("events")
      .select("id, title, venue, neighborhood, date_time, accent_color, attending_count, category")
      .gte("date_time", now)
      .lte("date_time", soon)
      .order("date_time", { ascending: true })
      .limit(3),
    db
      .from("wall_posts")
      .select("id, text, blooms, category, seed_author, author:profiles!author_id(first_name, full_name)")
      .order("blooms", { ascending: false })
      .limit(3),
    db
      .from("profiles")
      .select("id", { count: "exact", head: true }),
  ]);

  return NextResponse.json({
    upcoming: eventsRes.data ?? [],
    posts: postsRes.data ?? [],
    memberCount: statsRes.count ?? 0,
  });
}
