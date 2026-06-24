import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { data: flower, error } = await supabase
    .from("bloom_flowers")
    .select("id, note, sent_at, from_user_id, gathering_id")
    .eq("id", id)
    .eq("to_user_id", user.id)
    .maybeSingle();

  if (error || !flower) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const [{ data: senderProfile }, { data: gathering }] = await Promise.all([
    supabase.from("profiles").select("first_name, full_name, avatar_url, neighborhood").eq("id", flower.from_user_id).maybeSingle(),
    flower.gathering_id ? supabase.from("gatherings").select("title").eq("id", flower.gathering_id).maybeSingle() : Promise.resolve({ data: null }),
  ]);

  const name = senderProfile?.first_name || senderProfile?.full_name?.split(" ")[0] || "Someone";

  return NextResponse.json({
    id: flower.id,
    note: flower.note ?? null,
    sent_at: flower.sent_at,
    sender: {
      name,
      initial: name[0]?.toUpperCase() ?? "?",
      avatar_url: senderProfile?.avatar_url ?? null,
      neighborhood: senderProfile?.neighborhood ?? null,
    },
    gathering_title: gathering?.title ?? null,
  });
}
