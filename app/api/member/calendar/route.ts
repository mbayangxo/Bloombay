import { NextResponse } from "next/server";
import { sendMemberSmsReminder } from "@/lib/sms/send-member-reminder";
import { createClient } from "@/lib/supabase/server";
import { logBehaviorSignal } from "@/lib/truth/behavior";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("member_calendar_plans")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    if (error.message.includes("does not exist")) {
      return NextResponse.json({ plans: [] });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const plans = (data ?? []).map((row) => ({
    id: row.id as string,
    sourceId: row.source_id as string,
    title: row.title as string,
    when: row.when_label as string,
    place: (row.place as string) ?? "",
    href: row.href as string,
    kind: row.kind as string,
    remind: row.remind as boolean,
    addedAt: row.created_at as string,
  }));

  return NextResponse.json({ plans });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ ok: false, error: "Sign in required" }, { status: 401 });
  }

  let body: {
    sourceId?: string;
    title?: string;
    when?: string;
    place?: string;
    href?: string;
    kind?: string;
    remind?: boolean;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.sourceId || !body.title || !body.when || !body.href || !body.kind) {
    return NextResponse.json({ ok: false, error: "Missing required fields" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("member_calendar_plans")
    .upsert(
      {
        user_id: user.id,
        source_id: body.sourceId,
        title: body.title,
        when_label: body.when,
        place: body.place ?? "",
        href: body.href,
        kind: body.kind,
        remind: body.remind ?? true,
      },
      { onConflict: "user_id,source_id" }
    )
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

  await logBehaviorSignal(supabase, user.id, "calendar_add", { sourceId: body.sourceId, title: body.title });

  if (body.remind ?? true) {
    void sendMemberSmsReminder(supabase, user.id, {
      kind: "calendar",
      title: body.title,
      when: body.when,
      place: body.place,
    });
  }

  return NextResponse.json({ ok: true, entry: data });
}

export async function PATCH(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ ok: false, error: "Sign in required" }, { status: 401 });
  }

  let body: { id?: string; remind?: boolean };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.id || body.remind === undefined) {
    return NextResponse.json({ ok: false, error: "id and remind required" }, { status: 400 });
  }

  const { data: existing, error: readErr } = await supabase
    .from("member_calendar_plans")
    .select("id, title, when_label, place, remind")
    .eq("id", body.id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (readErr || !existing) {
    return NextResponse.json({ ok: false, error: readErr?.message ?? "Plan not found" }, { status: 404 });
  }

  const { data, error } = await supabase
    .from("member_calendar_plans")
    .update({ remind: body.remind })
    .eq("id", body.id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
  }

  if (body.remind && !existing.remind) {
    void sendMemberSmsReminder(supabase, user.id, {
      kind: "calendar",
      title: existing.title as string,
      when: existing.when_label as string,
      place: (existing.place as string) ?? "",
    });
  }

  return NextResponse.json({ ok: true, entry: data });
}

export async function DELETE(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ ok: false, error: "Sign in required" }, { status: 401 });
  }

  const id = new URL(request.url).searchParams.get("id");
  if (!id) {
    return NextResponse.json({ ok: false, error: "id required" }, { status: 400 });
  }

  const { error } = await supabase
    .from("member_calendar_plans")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
