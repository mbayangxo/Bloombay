import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

// Legal consent types a member accepts during onboarding.
const ALLOWED_CONSENT_TYPES = [
  "terms",
  "privacy",
  "community_guidelines",
  "woman_affirmation",
] as const;
type ConsentType = (typeof ALLOWED_CONSENT_TYPES)[number];

function isConsentType(t: string): t is ConsentType {
  return (ALLOWED_CONSENT_TYPES as readonly string[]).includes(t);
}

// POST /api/member/consent
// Records legal consent for the authenticated member. Identity is taken from
// the session only; IP / user-agent are captured server-side from the request.
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: { types?: string[]; version?: string; source?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const types = (body.types ?? []).filter(isConsentType);
  if (types.length === 0) {
    return NextResponse.json({ error: "No valid consent types" }, { status: 400 });
  }

  const version =
    typeof body.version === "string" && body.version.trim() ? body.version.trim() : "1.0";
  const source =
    typeof body.source === "string" && body.source.trim() ? body.source.trim() : "onboarding";
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || null;
  const userAgent = req.headers.get("user-agent") || null;
  const acceptedAt = new Date().toISOString();

  // Write with the service role; user_id comes from the verified session,
  // never from the request body.
  const admin = createAdminClient();
  const rows = types.map((consent_type) => ({
    user_id: user.id,
    consent_type,
    version,
    accepted_at: acceptedAt,
    source,
    ip,
    user_agent: userAgent,
  }));

  const { error } = await admin.from("user_consents").insert(rows);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, recorded: types.length });
}
