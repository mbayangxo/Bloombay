// GET /api/member/bouquet — returns the member's bouquet (inner circle)

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data } = await supabase
    .from("bloom_bouquet")
    .select(`
      position,
      profiles!bloom_bouquet_member_id_fkey (
        id, first_name, full_name, avatar_url, neighborhood
      )
    `)
    .eq("owner_id", user.id)
    .order("position", { ascending: true });

  type BouquetRow = {
    position: number;
    profiles: {
      id: string;
      first_name: string | null;
      full_name: string | null;
      avatar_url: string | null;
      neighborhood: string | null;
    } | null;
  };

  const members = ((data ?? []) as unknown as BouquetRow[])
    .filter((r) => r.profiles !== null)
    .map((r) => ({
      id: r.profiles!.id,
      first_name: r.profiles!.first_name,
      full_name: r.profiles!.full_name,
      avatar_url: r.profiles!.avatar_url,
      neighborhood: r.profiles!.neighborhood,
      position: r.position,
    }));

  return NextResponse.json({ members, count: members.length });
}
