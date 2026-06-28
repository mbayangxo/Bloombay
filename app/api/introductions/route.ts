// GET: fetch introductions feed (verified + onboarded only)
// POST: upsert own introduction (verified + onboarded; edit cooldown applies)
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isBlocked } from "@/lib/auth/block-check";

const BIO_MIN              = 10;
const BIO_MAX              = 500;
const NEIGHBORHOOD_MAX     = 80;
const INTERESTS_MAX_ITEMS  = 10;
const INTEREST_MAX_LEN     = 30;
const EDIT_COOLDOWN_MS     = 30 * 60 * 1000; // 30 minutes between edits

const VALID_ARRIVAL_STATUSES = new Set([
  "just_moved", "new_6mo", "fresh_start", "local", "native",
]);

export async function GET(_req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("onboarding_completed, verification_status")
    .eq("id", user.id)
    .single();
  if (!profile?.onboarding_completed) {
    return NextResponse.json({ error: "Complete onboarding first" }, { status: 403 });
  }
  if (profile.verification_status !== "verified") {
    return NextResponse.json({ error: "Verified members only" }, { status: 403 });
  }

  const { data } = await supabase
    .from("introductions")
    .select("id, bio, arrival_status, neighborhood, interests, flower_count, created_at, user_id, profiles!inner(first_name, full_name, avatar_url)")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(20);

  const rows = data ?? [];
  const filtered = [];
  for (const row of rows) {
    const otherId = row.user_id as string;
    if (otherId !== user.id && await isBlocked(supabase, user.id, otherId)) continue;
    filtered.push(row);
  }

  return NextResponse.json(filtered);
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("onboarding_completed, verification_status")
    .eq("id", user.id)
    .single();
  if (!profile?.onboarding_completed) {
    return NextResponse.json({ error: "Complete onboarding first" }, { status: 403 });
  }
  if (profile.verification_status !== "verified") {
    return NextResponse.json({ error: "Verified members only" }, { status: 403 });
  }

  let body: { bio?: string; arrival_status?: string; neighborhood?: string; interests?: unknown };
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const bio            = body.bio?.trim() ?? "";
  const arrivalStatus  = body.arrival_status ?? "local";
  const neighborhood   = body.neighborhood?.trim() ?? null;
  const rawInterests   = Array.isArray(body.interests) ? body.interests : [];

  // Bio validation
  if (bio.length < BIO_MIN) {
    return NextResponse.json({ error: `Bio must be at least ${BIO_MIN} characters` }, { status: 400 });
  }
  if (bio.length > BIO_MAX) {
    return NextResponse.json({ error: `Bio must be ${BIO_MAX} characters or fewer` }, { status: 400 });
  }

  // arrival_status must be a known enum value
  if (!VALID_ARRIVAL_STATUSES.has(arrivalStatus)) {
    return NextResponse.json(
      { error: `arrival_status must be one of: ${[...VALID_ARRIVAL_STATUSES].join(", ")}` },
      { status: 400 }
    );
  }

  // Neighborhood length
  if (neighborhood && neighborhood.length > NEIGHBORHOOD_MAX) {
    return NextResponse.json(
      { error: `Neighborhood must be ${NEIGHBORHOOD_MAX} characters or fewer` },
      { status: 400 }
    );
  }

  // Interests: max 10 items, each max 30 chars
  if (rawInterests.length > INTERESTS_MAX_ITEMS) {
    return NextResponse.json(
      { error: `Maximum ${INTERESTS_MAX_ITEMS} interests allowed` },
      { status: 400 }
    );
  }
  const interests = rawInterests
    .filter((i): i is string => typeof i === "string")
    .map((i) => i.trim())
    .filter(Boolean);
  const longInterest = interests.find((i) => i.length > INTEREST_MAX_LEN);
  if (longInterest) {
    return NextResponse.json(
      { error: `Each interest must be ${INTEREST_MAX_LEN} characters or fewer` },
      { status: 400 }
    );
  }

  // Edit cooldown: check if an existing intro was updated recently
  const cooldownCutoff = new Date(Date.now() - EDIT_COOLDOWN_MS).toISOString();
  const { data: existing } = await supabase
    .from("introductions")
    .select("id, updated_at")
    .eq("user_id", user.id)
    .maybeSingle();

  if (existing?.updated_at && new Date(existing.updated_at) > new Date(cooldownCutoff)) {
    return NextResponse.json(
      { error: "Wait 30 minutes before editing your introduction again" },
      { status: 429 }
    );
  }

  const { data, error } = await supabase
    .from("introductions")
    .upsert(
      {
        user_id:        user.id,
        bio,
        arrival_status: arrivalStatus,
        neighborhood,
        interests,
        updated_at:     new Date().toISOString(),
      },
      { onConflict: "user_id" }
    )
    .select("id")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, id: data.id });
}
