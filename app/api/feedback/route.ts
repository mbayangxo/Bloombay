import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";

function admin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

// POST /api/feedback — submit user feedback / bug report
export async function POST(req: NextRequest) {
  let supabaseResponse = NextResponse.next({ request: req });
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return req.cookies.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => req.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request: req });
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options));
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  const body = await req.json() as {
    category?: string;
    message: string;
    page_url?: string;
    device_info?: string;
  };

  if (!body.message?.trim()) {
    return NextResponse.json({ error: "Message is required" }, { status: 400 });
  }

  const db = admin();
  const { error } = await db.from("user_feedback").insert({
    user_id:     user?.id ?? null,
    category:    body.category ?? "bug",
    message:     body.message.trim(),
    page_url:    body.page_url ?? null,
    device_info: body.device_info ?? null,
    priority:    "normal",
    status:      "open",
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

// GET /api/feedback — admin only, list feedback
export async function GET(req: NextRequest) {
  const secret = req.headers.get("x-admin-password");
  if (secret !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") ?? "open";

  const db = admin();
  const query = db
    .from("user_feedback")
    .select("*, profiles(first_name, full_name, email)")
    .order("created_at", { ascending: false })
    .limit(100);

  if (status !== "all") query.eq("status", status);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

// PATCH /api/feedback — admin update status/notes
export async function PATCH(req: NextRequest) {
  const secret = req.headers.get("x-admin-password");
  if (secret !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json() as {
    id: string;
    status?: string;
    admin_notes?: string;
    assigned_to?: string;
  };

  if (!body.id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const db = admin();
  const update: Record<string, unknown> = {};
  if (body.status)      update.status = body.status;
  if (body.admin_notes) update.admin_notes = body.admin_notes;
  if (body.assigned_to) update.assigned_to = body.assigned_to;
  if (body.status === "resolved") update.resolved_at = new Date().toISOString();

  const { error } = await db.from("user_feedback").update(update).eq("id", body.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
