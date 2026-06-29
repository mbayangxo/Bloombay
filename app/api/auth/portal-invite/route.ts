import { NextRequest, NextResponse } from "next/server";
import { verifyPortalInviteToken } from "@/lib/auth/portal-invite-crypto";
import { roleLabelForInvite } from "@/lib/auth/portal-invites";

/** GET /api/auth/portal-invite?token=... — validate a signed staff invite (server-only verify). */
export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  const payload = verifyPortalInviteToken(token);

  if (!payload) {
    return NextResponse.json({ valid: false, error: "Invalid or expired invite" }, { status: 400 });
  }

  return NextResponse.json({
    valid: true,
    role: payload.role,
    email: payload.email ?? null,
    label: payload.label ?? roleLabelForInvite(payload.role),
    exp: payload.exp,
  });
}
