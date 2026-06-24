import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getAuthUser } from "@/lib/auth/get-user";

export async function GET(req: NextRequest) {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const code = req.nextUrl.searchParams.get("code")?.trim().toUpperCase();
  if (!code) return NextResponse.json({ error: "code required" }, { status: 400 });

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_claim_details", { p_code: code });

  if (error) return NextResponse.json({ error: "lookup failed" }, { status: 500 });
  if (data?.error) return NextResponse.json(data, { status: 404 });

  return NextResponse.json(data);
}
