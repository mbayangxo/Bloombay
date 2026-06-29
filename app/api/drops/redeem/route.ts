import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth/require-role";

export async function POST(req: NextRequest) {
  const guard = await requireRole(req, ["partner", "admin", "founder"]);
  if (guard.error) return guard.error;

  const { code } = await req.json() as { code?: string };
  if (!code) return NextResponse.json({ error: "code required" }, { status: 400 });

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("redeem_drop_code", { p_code: code.trim().toUpperCase() });

  if (error) return NextResponse.json({ error: "redemption failed" }, { status: 500 });

  const statusMap: Record<string, number> = {
    code_not_found:   404,
    already_redeemed: 409,
    expired:          410,
  };

  if (data?.error) {
    return NextResponse.json(data, { status: statusMap[data.error] ?? 400 });
  }

  return NextResponse.json(data);
}
