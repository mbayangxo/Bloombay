import { NextResponse } from "next/server";
import { applyServerSignOut } from "@/lib/auth/sign-out-server";

/** Full portal sign-out — Supabase, role cookies, founder password, dev role. */
export async function POST() {
  const response = NextResponse.json({ ok: true });
  await applyServerSignOut(response);
  return response;
}
