import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ ok: false, error: "Sign in required" }, { status: 401 });
  }

  let body: { gathering_id?: string; action?: "add" | "remove" };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.gathering_id || !body.action) {
    return NextResponse.json(
      { ok: false, error: "gathering_id and action required" },
      { status: 400 }
    );
  }

  if (body.action === "add") {
    const { error } = await supabase.from("gathering_permanent_rsvp").upsert(
      {
        gathering_id: body.gathering_id,
        user_id: user.id,
      },
      { onConflict: "user_id,gathering_id" }
    );

    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
    }

    return NextResponse.json({ ok: true, is_permanent: true });
  } else {
    const { error } = await supabase
      .from("gathering_permanent_rsvp")
      .delete()
      .eq("gathering_id", body.gathering_id)
      .eq("user_id", user.id);

    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
    }

    return NextResponse.json({ ok: true, is_permanent: false });
  }
}
