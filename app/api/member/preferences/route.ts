// POST /api/member/preferences
// Saves or updates a member's preference profile.
// Called from the preferences onboarding step.

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();

  const {
    age_group, is_mother, relationship_status,
    faith, faith_important,
    lifestyle_tags, lifestyle_tags_weighted,
    activity_types, core_values,
    friendship_style, avoid_vibes,
    seeking, life_chapter, availability,
    connection_frequency, aspirations,
  } = body;

  const { error } = await supabase
    .from("member_preferences")
    .upsert({
      user_id:              user.id,
      age_group:            age_group            || null,
      is_mother:            is_mother            ?? null,
      relationship_status:  relationship_status  || null,
      faith:                faith                || null,
      faith_important:      faith_important      ?? false,
      lifestyle_tags:       lifestyle_tags       ?? [],
      lifestyle_tags_weighted: lifestyle_tags_weighted ?? [],
      activity_types:       activity_types       ?? [],
      core_values:          core_values          ?? [],
      friendship_style:     friendship_style     || null,
      avoid_vibes:          avoid_vibes          ?? [],
      seeking:              seeking              ?? [],
      life_chapter:         life_chapter         || null,
      availability:         availability         ?? [],
      connection_frequency: connection_frequency || null,
      aspirations:          aspirations          ?? [],
      updated_at:           new Date().toISOString(),
    }, { onConflict: "user_id" });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("member_preferences")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? {});
}
