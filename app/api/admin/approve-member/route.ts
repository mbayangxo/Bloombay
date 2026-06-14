import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";

function admin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

async function verifyAdmin(req: NextRequest): Promise<boolean> {
  if (req.headers.get("x-admin-password") === process.env.ADMIN_PASSWORD) return true;
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll() { return req.cookies.getAll(); }, setAll() {} } }
  );
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  return ["admin", "founder"].includes(profile?.role ?? "");
}

async function yandeWelcome(app: {
  first_name?: string | null;
  neighborhood?: string | null;
  vibe?: string | null;
  goals?: string[] | null;
  interests?: string[] | null;
  city?: string | null;
}): Promise<string> {
  const fallback = "You're officially a BloomBay member. Your city just got a little smaller — in the best way. Explore The Avenue and find your table.";

  if (!process.env.ANTHROPIC_API_KEY) return fallback;

  const context = [
    app.first_name ? `Name: ${app.first_name}` : null,
    app.neighborhood ? `Neighborhood: ${app.neighborhood}` : null,
    app.city && app.city !== "New York City" ? `City: ${app.city}` : null,
    app.vibe ? `Vibe: ${app.vibe}` : null,
    app.goals?.length ? `Goals: ${app.goals.join(", ")}` : null,
    app.interests?.length ? `Interests: ${app.interests.join(", ")}` : null,
  ].filter(Boolean).join("\n");

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 80,
        system: `You are Yande, BloomBay's AI. Write a 1-2 sentence welcome message for a newly approved member.
Warm, personal, specific — reference their neighborhood or interests if you have them.
Sound like a friend who already knows them, not a brand. No emojis. No "Welcome to BloomBay!" openers.`,
        messages: [{ role: "user", content: context || "New member, no extra details." }],
      }),
    });

    if (!res.ok) return fallback;
    const data = await res.json() as { content: { type: string; text: string }[] };
    return data.content[0]?.text?.trim() || fallback;
  } catch {
    return fallback;
  }
}

// POST /api/admin/approve-member
export async function POST(req: NextRequest) {
  if (!await verifyAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json() as {
    applicationId: string;
    action: "approve" | "decline";
    declineNote?: string;
  };

  const supabase = admin();

  const { data: app, error: fetchErr } = await supabase
    .from("member_applications")
    .select("*")
    .eq("id", body.applicationId)
    .single();

  if (fetchErr || !app) {
    return NextResponse.json({ error: "Application not found" }, { status: 404 });
  }

  const now = new Date().toISOString();

  if (body.action === "approve") {
    await supabase
      .from("member_applications")
      .update({ status: "approved", reviewed_at: now })
      .eq("id", body.applicationId);

    if (app.user_id) {
      await supabase
        .from("profiles")
        .update({
          is_member:             true,
          membership_started_at: now,
          membership_type:       "platform",
        })
        .eq("id", app.user_id);

      // Yande writes a personalised welcome
      const welcomeBody = await yandeWelcome(app);

      await supabase.from("notifications").insert({
        user_id: app.user_id,
        type:    "celebrate",
        title:   "You're in. ✦",
        body:    welcomeBody,
        link:    "/member/home",
      });
    }
  } else {
    await supabase
      .from("member_applications")
      .update({
        status:       "declined",
        reviewed_at:  now,
        decline_note: body.declineNote ?? null,
      })
      .eq("id", body.applicationId);
  }

  return NextResponse.json({ ok: true });
}

// GET /api/admin/approve-member — list applications
export async function GET(req: NextRequest) {
  if (!await verifyAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const status = req.nextUrl.searchParams.get("status") ?? "pending";
  const { data, error } = await admin()
    .from("member_applications")
    .select("*")
    .eq("status", status)
    .order("submitted_at", { ascending: false })
    .limit(50);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}
