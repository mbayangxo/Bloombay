import { NextResponse } from "next/server";
import { applyServerSignOut } from "@/lib/auth/sign-out-server";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  await applyServerSignOut(response);
  return response;
}
