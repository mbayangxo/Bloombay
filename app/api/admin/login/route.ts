import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  createSessionToken,
  FOUNDER_PASSWORD_UID,
  getAdminSecret,
  isValidAdminPassword,
} from "@/lib/admin-auth";
import { applyRoleCookies } from "@/lib/auth/role-cookie";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { password?: string };
  const password = body.password ?? "";

  if (!getAdminSecret()) {
    return NextResponse.json(
      {
        error:
          "Founder dashboard password is not configured. Add ADMIN_PASSWORD to .env.local and restart npm run dev.",
      },
      { status: 503 }
    );
  }

  if (!isValidAdminPassword(password)) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  const token = createSessionToken();
  const response = NextResponse.json({ ok: true });
  applyRoleCookies(response, FOUNDER_PASSWORD_UID, "founder");
  response.cookies.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
  });
  return response;
}
