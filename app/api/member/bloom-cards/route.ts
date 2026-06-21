import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(req.url);
  const context = url.searchParams.get("context") ?? "attendee";

  const { data: cards } = await supabase
    .from("yande_questions")
    .select("id, prompt, sort_order")
    .eq("kind", "bloom_card")
    .eq("bloom_context", context)
    .order("sort_order", { ascending: true });

  // Shuffle so each load is random
  const shuffled = (cards ?? []).sort(() => Math.random() - 0.5);

  return NextResponse.json({ cards: shuffled, context });
}
