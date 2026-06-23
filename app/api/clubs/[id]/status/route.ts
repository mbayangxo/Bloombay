// POST /api/clubs/[id]/status — update club status (owner only)

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function POST(req: NextRequest, { params }: RouteContext) {
  const { id: clubId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Verify club ownership
  const { data: club, error: clubError } = await supabase
    .from("clubs")
    .select("id, owner_id, status")
    .eq("id", clubId)
    .maybeSingle();

  if (clubError) return NextResponse.json({ error: clubError.message }, { status: 500 });
  if (!club)     return NextResponse.json({ error: "Club not found" }, { status: 404 });
  if (club.owner_id !== user.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const { status } = body as { status: "active" | "draft" | "archived" };

  if (!["active", "draft", "archived"].includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const { data: updated, error: updateError } = await supabase
    .from("clubs")
    .update({ status })
    .eq("id", clubId)
    .select("id, status")
    .single();

  if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 });
  return NextResponse.json({ ok: true, club: updated });
}
