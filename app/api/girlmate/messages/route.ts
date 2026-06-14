import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/girlmate/messages — inbox for current user
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("girlmate_messages")
    .select(`
      id, body, read, created_at,
      from_user:profiles!from_user_id ( id, first_name, full_name ),
      to_user:profiles!to_user_id ( id, first_name, full_name ),
      listing:girlmate_profiles!listing_id ( id, listing_type, neighborhood_name, city )
    `)
    .or(`from_user_id.eq.${user.id},to_user_id.eq.${user.id}`)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

// POST /api/girlmate/messages — send a message
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json() as { to_user_id: string; listing_id?: string; body: string };
  if (!body.to_user_id || !body.body?.trim()) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }
  if (body.to_user_id === user.id) {
    return NextResponse.json({ error: "Cannot message yourself" }, { status: 400 });
  }

  const { error } = await supabase.from("girlmate_messages").insert({
    from_user_id: user.id,
    to_user_id:   body.to_user_id,
    listing_id:   body.listing_id ?? null,
    body:         body.body.trim(),
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
