import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const q = req.nextUrl.searchParams.get("q")?.trim() ?? "";
  const type = req.nextUrl.searchParams.get("type") ?? "all";

  if (!q || q.length < 2)
    return NextResponse.json({ members: [], clubs: [], events: [] });

  const pattern = `%${q}%`;
  const results: {
    members: unknown[];
    clubs: unknown[];
    events: unknown[];
  } = { members: [], clubs: [], events: [] };

  if (type === "all" || type === "members") {
    const { data } = await supabase
      .from("profiles")
      .select("id, first_name, full_name, avatar_url, neighborhood, bio")
      .or(
        `full_name.ilike.${pattern},first_name.ilike.${pattern},neighborhood.ilike.${pattern}`
      )
      .neq("id", user.id)
      .limit(12);
    results.members = data ?? [];
  }

  if (type === "all" || type === "clubs") {
    const { data } = await supabase
      .from("clubs")
      .select(
        "id, name, tagline, description, primary_color, cover_url, slug, neighborhood"
      )
      .or(
        `name.ilike.${pattern},tagline.ilike.${pattern},description.ilike.${pattern},neighborhood.ilike.${pattern}`
      )
      .limit(10);
    results.clubs = data ?? [];
  }

  if (type === "all" || type === "events") {
    const { data } = await supabase
      .from("gatherings")
      .select("id, title, starts_at, venue, neighborhood, description")
      .or(
        `title.ilike.${pattern},venue.ilike.${pattern},neighborhood.ilike.${pattern}`
      )
      .gte("starts_at", new Date().toISOString())
      .order("starts_at", { ascending: true })
      .limit(10);
    results.events = data ?? [];
  }

  return NextResponse.json(results);
}
