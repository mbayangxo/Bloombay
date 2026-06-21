import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: cards } = await supabase
    .from("yande_questions")
    .select("id, prompt, sort_order")
    .eq("kind", "bloom_card")
    .order("sort_order", { ascending: true });

  return NextResponse.json({ cards: cards ?? [] });
}
