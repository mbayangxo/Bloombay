import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { logBehaviorSignal } from "@/lib/truth/behavior";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ ok: false, error: "Sign in required" }, { status: 401 });
  }

  let body: {
    clubSlug?: string;
    applicantName?: string;
    city?: string;
    instagram?: string;
    why?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.clubSlug || !body.applicantName || !body.why) {
    return NextResponse.json({ ok: false, error: "clubSlug, applicantName, why required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("club_applications")
    .insert({
      user_id: user.id,
      club_slug: body.clubSlug,
      applicant_name: body.applicantName,
      city: body.city ?? null,
      instagram: body.instagram ?? null,
      why: body.why,
      status: "pending",
    })
    .select()
    .single();

  if (error) {
    if (error.message.includes("does not exist")) {
      return NextResponse.json(
        { ok: false, error: "Run supabase/migrations/006_member_truth_layer.sql" },
        { status: 503 }
      );
    }
    return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
  }

  await logBehaviorSignal(supabase, user.id, "club_application_submitted", { clubSlug: body.clubSlug });

  return NextResponse.json({ ok: true, application: data });
}
