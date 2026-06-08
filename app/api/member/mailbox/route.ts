import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

function mapRow(row: Record<string, unknown>) {
  return {
    id: row.id as string,
    from: row.from_name as string,
    subject: row.subject as string,
    body: row.body as string,
    type: row.message_type as string,
    href: (row.href as string | null) ?? "/member/home",
    unread: !row.read_at,
    createdAt: row.created_at as string,
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
    .from("member_mailbox_messages")
    .select("id, from_name, subject, body, message_type, href, read_at, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    if (error.message.includes("does not exist")) {
      return NextResponse.json({ messages: [], unreadCount: 0 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const messages = (data ?? []).map((row) => mapRow(row as Record<string, unknown>));
  const unreadCount = messages.filter((m) => m.unread).length;

  return NextResponse.json({ messages, unreadCount });
}

export async function PATCH(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ ok: false, error: "Sign in required" }, { status: 401 });
  }

  let body: { markAllRead?: boolean; id?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const now = new Date().toISOString();

  if (body.markAllRead) {
    const { error } = await supabase
      .from("member_mailbox_messages")
      .update({ read_at: now })
      .eq("user_id", user.id)
      .is("read_at", null);

    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
    }
    return NextResponse.json({ ok: true });
  }

  if (!body.id) {
    return NextResponse.json({ ok: false, error: "id or markAllRead required" }, { status: 400 });
  }

  const { error } = await supabase
    .from("member_mailbox_messages")
    .update({ read_at: now })
    .eq("id", body.id)
    .eq("user_id", user.id);

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
