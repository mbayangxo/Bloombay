import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const SELECT =
  "id, slug, title, starts_at, area, venue, neighborhood, capacity, spots_left, club_slug, event_type, poster_variant, image_url, description, price_cents, host_name";

export async function GET(
  _request: Request,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("gatherings")
    .select(SELECT)
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    if (error.message.includes("does not exist")) {
      return NextResponse.json({ gathering: null, source: "demo" });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ gathering: data, source: data ? "db" : "none" });
}
