import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getAuthUser } from "@/lib/auth/get-user";

export async function GET(req: NextRequest, { params }: { params: Promise<{ room: string }> }) {
  const { room } = await params;
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("avenue_content")
    .select("id, content_type, title, body, author, meta, published_at, created_at")
    .eq("room", room)
    .eq("status", "approved")
    .order("published_at", { ascending: false })
    .limit(20);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ content: data ?? [] });
}
