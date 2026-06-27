import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const SELECT =
  "id, slug, title, starts_at, area, venue, neighborhood, capacity, spots_left, club_slug, event_type, poster_variant, image_url, description, price_cents, host_name, publish_status";

export async function GET(
  _request: Request,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug: slugOrId } = await context.params;
  const supabase = await createClient();

  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slugOrId);

  let query = supabase.from("gatherings").select(SELECT);
  query = isUuid ? query.eq("id", slugOrId) : query.eq("slug", slugOrId);

  const { data, error } = await query.maybeSingle();

  if (error) {
    if (error.message.includes("does not exist")) {
      return NextResponse.json({ gathering: null, source: "demo" });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data || data.publish_status !== "live") {
    return NextResponse.json({ gathering: null, source: "none" }, { status: 404 });
  }

  const { publish_status: _status, ...publicGathering } = data;
  return NextResponse.json({ gathering: publicGathering, source: "db" });
}
