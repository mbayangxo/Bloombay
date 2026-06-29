import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/auth/require-role";
import {
  companySignupUrl,
  createPortalInvite,
  roleLabelForInvite,
} from "@/lib/auth/portal-invites";
import { signPortalInviteToken } from "@/lib/auth/portal-invite-crypto";
import { COMPANY_LOGIN } from "@/lib/auth/roles";
import type { UserRole } from "@/lib/auth/roles";

export async function POST(req: NextRequest) {
  const guard = await requireRole(req, ["founder", "admin"]);
  if (guard.error) return guard.error;

  let body: { role?: UserRole; email?: string; label?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.role) {
    return NextResponse.json({ error: "role required" }, { status: 400 });
  }

  try {
    const payload = createPortalInvite({
      role: body.role,
      email: body.email,
      label: body.label,
    });
    const token = signPortalInviteToken(payload);
    const origin = req.nextUrl.origin;
    const signup = `${origin}${companySignupUrl(token)}`;
    const signin = `${origin}${COMPANY_LOGIN}?invite=${encodeURIComponent(token)}`;

    return NextResponse.json({
      token,
      signup,
      signin,
      payload: {
        role: payload.role,
        email: payload.email ?? null,
        label: payload.label ?? roleLabelForInvite(payload.role),
        exp: payload.exp,
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Could not create invite";
    return NextResponse.json({ error: message }, { status: 503 });
  }
}
