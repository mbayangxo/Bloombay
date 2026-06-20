import { NextResponse } from "next/server";
import { profileFromAuthUser, profileFromSignUpInput } from "@/lib/auth/profile-from-metadata";
import { upsertProfileRow } from "@/lib/auth/upsert-profile";
import { getAdminClient } from "@/lib/supabase-admin";
import { createClient } from "@/lib/supabase/server";

type BootstrapBody = {
  fullName?: string;
  phone?: string;
  city?: string;
  neighborhood?: string;
  email?: string;
};

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ ok: false, error: "Sign in required" }, { status: 401 });
  }

  let body: BootstrapBody = {};
  try {
    body = (await request.json()) as BootstrapBody;
  } catch {
    /* optional body */
  }

  const fields =
    body.fullName || body.phone || body.city || body.neighborhood || body.email
      ? profileFromSignUpInput(user, {
          email: body.email ?? user.email ?? "",
          fullName: body.fullName ?? "",
          phone: body.phone ?? "",
          city: body.city ?? "",
          neighborhood: body.neighborhood ?? "",
        })
      : profileFromAuthUser(user);

  const admin = getAdminClient();
  const result = await upsertProfileRow(admin, user.id, fields);

  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error }, { status: 500 });
  }

  return NextResponse.json({ ok: true, profile: fields });
}
