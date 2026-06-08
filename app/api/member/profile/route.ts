import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type MemberProfile = {
  fullName: string | null;
  city: string | null;
  state: string | null;
  neighborhood: string | null;
  email: string | null;
};

function mapProfile(row: Record<string, unknown> | null): MemberProfile {
  return {
    fullName: (row?.full_name as string | null) ?? null,
    city: (row?.city as string | null) ?? null,
    state: (row?.state as string | null) ?? null,
    neighborhood: (row?.neighborhood as string | null) ?? null,
    email: (row?.email as string | null) ?? null,
  };
}

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("full_name, city, state, neighborhood, email")
    .eq("id", user.id)
    .maybeSingle();

  if (error) {
    if (error.message.includes("does not exist")) {
      return NextResponse.json({
        ...mapProfile(null),
        email: user.email ?? null,
        warning: "Run supabase/migrations/010_profiles_state.sql",
      });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const profile = mapProfile(data);
  if (!profile.email) profile.email = user.email ?? null;
  return NextResponse.json(profile);
}

export async function PATCH(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ ok: false, error: "Sign in required" }, { status: 401 });
  }

  let body: {
    fullName?: string;
    city?: string;
    state?: string;
    neighborhood?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const fullName = body.fullName?.trim();
  if (fullName !== undefined && !fullName) {
    return NextResponse.json({ ok: false, error: "Name cannot be empty" }, { status: 400 });
  }

  const patch: Record<string, string | null> = {
    updated_at: new Date().toISOString(),
  };

  if (fullName !== undefined) patch.full_name = fullName;
  if (body.city !== undefined) patch.city = body.city.trim() || null;
  if (body.state !== undefined) patch.state = body.state.trim() || null;
  if (body.neighborhood !== undefined) patch.neighborhood = body.neighborhood.trim() || null;

  if (Object.keys(patch).length === 1) {
    return NextResponse.json({ ok: false, error: "Nothing to update" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("profiles")
    .update(patch)
    .eq("id", user.id)
    .select("full_name, city, state, neighborhood, email")
    .maybeSingle();

  if (error) {
    if (error.message.includes("does not exist")) {
      return NextResponse.json(
        { ok: false, error: "Run supabase/migrations/010_profiles_state.sql" },
        { status: 503 }
      );
    }
    return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
  }

  const profile = mapProfile(data);
  if (!profile.email) profile.email = user.email ?? null;

  return NextResponse.json({ ok: true, ...profile });
}
