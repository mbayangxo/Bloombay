import { NextResponse } from "next/server";

// Password-only admin login has been removed.
// Admins must sign in via Supabase Auth at /admin/login.
export async function POST() {
  return NextResponse.json(
    { error: "Password login is disabled. Sign in with your account at /admin/login." },
    { status: 410 }
  );
}
