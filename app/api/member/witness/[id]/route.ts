// GET /api/member/witness/[id]
// Returns a single gathering_witnesses record with witness profile info

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: witness, error } = await supabase
    .from("gathering_witnesses")
    .select("id, note, created_at, witness_user_id, gathering_id, subject_user_id")
    .eq("id", params.id)
    // Only the subject (recipient) of the witness can view it
    .eq("subject_user_id", user.id)
    .maybeSingle();

  if (error || !witness) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Fetch the witness author's profile and the gathering title separately
  const [{ data: witnessProfile }, { data: gathering }] = await Promise.all([
    supabase.from("profiles").select("first_name, full_name, avatar_url, neighborhood").eq("id", witness.witness_user_id).maybeSingle(),
    supabase.from("gatherings").select("title").eq("id", witness.gathering_id).maybeSingle(),
  ]);

  const name = witnessProfile?.first_name || witnessProfile?.full_name?.split(" ")[0] || "Someone";
  const initial = name[0]?.toUpperCase() ?? "?";

  return NextResponse.json({
    id: witness.id,
    note: witness.note,
    created_at: witness.created_at,
    witness: {
      name,
      initial,
      avatar_url: witnessProfile?.avatar_url ?? null,
      neighborhood: witnessProfile?.neighborhood ?? null,
    },
    gathering_title: gathering?.title ?? null,
  });
}
