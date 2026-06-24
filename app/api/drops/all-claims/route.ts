import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getAuthUser } from "@/lib/auth/get-user";

export async function GET() {
  const user = await getAuthUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_all_drop_claims");

  if (error) return NextResponse.json({ error: "lookup failed" }, { status: 500 });

  return NextResponse.json({ claims: data ?? [] });
}
