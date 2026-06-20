import type { NextResponse } from "next/server";
import { ADMIN_COOKIE } from "@/lib/admin-auth";
import { clearRoleCookies } from "@/lib/auth/role-cookie";
import { createClient } from "@/lib/supabase/server";

/** Clears Supabase session + all portal auth cookies on a NextResponse. */
export async function applyServerSignOut(response: NextResponse) {
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
  } catch {
    /* missing env */
  }

  clearRoleCookies(response);
  response.cookies.set("bb_dev_role", "", { path: "/", maxAge: 0 });
  response.cookies.set(ADMIN_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}
