import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getAuthUser } from "@/lib/auth/get-user";

export async function GET() {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = await createClient();

  const [{ data: drops }, { data: myClaims }] = await Promise.all([
    supabase
      .from("bloom_drops")
      .select("id, title, description, partner_name, partner_type, neighborhood, total_qty, claimed_qty, valid_until, cover_color_a, cover_color_b, instructions, category, badge_text, is_featured")
      .eq("is_active", true)
      .order("is_featured", { ascending: false })
      .order("created_at", { ascending: false }),
    supabase
      .from("drop_claims")
      .select("drop_id, claim_code")
      .eq("user_id", user.id),
  ]);

  const claimedMap = Object.fromEntries(
    (myClaims ?? []).map(c => [c.drop_id, c.claim_code])
  );

  const enriched = (drops ?? []).map(d => ({
    ...d,
    remaining: d.total_qty - d.claimed_qty,
    my_code: claimedMap[d.id] ?? null,
  }));

  return NextResponse.json({ drops: enriched });
}
