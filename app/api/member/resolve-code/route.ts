// GET /api/member/resolve-code?code=BB-A1B2
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(req.url);
  const code = url.searchParams.get("code")?.trim().toUpperCase();
  if (!code) return NextResponse.json({ error: "code required" }, { status: 400 });

  // code format: BB-XXXX where XXXX is first 4 chars of UUID
  const prefix = code.startsWith("BB-") ? code.slice(3).toLowerCase() : code.toLowerCase();
  if (prefix.length !== 4) return NextResponse.json({ error: "Invalid code format" }, { status: 400 });

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, first_name, full_name, avatar_url, neighborhood")
    .ilike("id", `${prefix}%`)
    .limit(5);

  if (!profiles || profiles.length === 0) {
    return NextResponse.json({ error: "Member not found" }, { status: 404 });
  }

  // Filter out self
  const match = profiles.find(p => p.id !== user.id);
  if (!match) return NextResponse.json({ error: "Cannot scan yourself" }, { status: 400 });

  const name = match.first_name || match.full_name?.split(" ")[0] || "Her";
  return NextResponse.json({
    user_id: match.id,
    name,
    avatar_url: match.avatar_url ?? null,
    neighborhood: match.neighborhood ?? null,
  });
}
