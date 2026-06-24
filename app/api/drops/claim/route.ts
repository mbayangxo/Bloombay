import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getAuthUser } from "@/lib/auth/get-user";

// Unambiguous chars — easy to read aloud at a cafe counter
const CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function generateCode(): string {
  const bytes = new Uint8Array(6);
  crypto.getRandomValues(bytes);
  return "BB" + Array.from(bytes).map(b => CHARS[b % CHARS.length]).join("");
}

export async function POST(req: NextRequest) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { dropId } = await req.json() as { dropId: string };
  if (!dropId) return NextResponse.json({ error: "dropId required" }, { status: 400 });

  const supabase = await createClient();
  const code = generateCode();

  const { data, error } = await supabase.rpc("claim_bloom_drop", {
    p_drop_id: dropId,
    p_user_id: user.id,
    p_code: code,
  });

  if (error) {
    if (error.message?.includes("drop_not_found")) {
      return NextResponse.json({ error: "Drop not found or no longer active" }, { status: 404 });
    }
    if (error.message?.includes("drop_sold_out")) {
      return NextResponse.json({ error: "All coffees have been claimed — check back for the next drop!" }, { status: 409 });
    }
    return NextResponse.json({ error: "Could not claim" }, { status: 500 });
  }

  return NextResponse.json({ code: data as string });
}
