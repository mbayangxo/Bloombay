import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  const [witnessesResult, flowersCountResult, flowersSendersResult] = await Promise.all([
    supabase
      .from("gathering_witnesses")
      .select(`
        id,
        note,
        created_at,
        gatherings!gathering_id ( title ),
        profiles!witness_user_id ( first_name, full_name, avatar_url, neighborhood )
      `)
      .eq("subject_user_id", userId)
      .order("created_at", { ascending: false })
      .limit(6),

    supabase
      .from("bloom_flowers")
      .select("id", { count: "exact", head: true })
      .eq("to_user_id", userId),

    supabase
      .from("bloom_flowers")
      .select(`
        from_user_id,
        profiles!from_user_id ( first_name, full_name, avatar_url )
      `)
      .eq("to_user_id", userId)
      .order("sent_at", { ascending: false })
      .limit(3),
  ]);

  const witnesses = (witnessesResult.data ?? []).map((w: Record<string, unknown>) => {
    const gathering = w.gatherings as { title?: string } | null;
    const profile = w.profiles as { first_name?: string; full_name?: string; avatar_url?: string; neighborhood?: string } | null;
    return {
      id: w.id,
      note: w.note,
      created_at: w.created_at,
      gathering_title: gathering?.title ?? null,
      witness: {
        first_name: profile?.first_name ?? null,
        full_name: profile?.full_name ?? null,
        avatar_url: profile?.avatar_url ?? null,
        neighborhood: profile?.neighborhood ?? null,
      },
    };
  });

  const flowerCount = flowersCountResult.count ?? 0;
  const recentSenders = (flowersSendersResult.data ?? []).map((f: Record<string, unknown>) => {
    const profile = f.profiles as { first_name?: string; full_name?: string; avatar_url?: string } | null;
    return {
      first_name: profile?.first_name ?? null,
      full_name: profile?.full_name ?? null,
      avatar_url: profile?.avatar_url ?? null,
    };
  });

  return NextResponse.json({
    witnesses,
    flowers: {
      count: flowerCount,
      recent_senders: recentSenders,
    },
  });
}
