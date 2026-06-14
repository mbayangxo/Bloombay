import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function admin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

function verifyAdmin(req: NextRequest): boolean {
  const auth = req.headers.get("x-admin-password");
  return auth === process.env.ADMIN_PASSWORD;
}

// POST /api/admin/approve-member
// Body: { applicationId: string, action: "approve" | "decline", declineNote?: string }
export async function POST(req: NextRequest) {
  if (!verifyAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json() as {
    applicationId: string;
    action: "approve" | "decline";
    declineNote?: string;
  };

  const supabase = admin();

  // Fetch the application
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
    // Update application status
    await supabase
      .from("member_applications")
      .update({ status: "approved", reviewed_at: now })
      .eq("id", body.applicationId);

    // If there's a linked user, grant membership
    if (app.user_id) {
      await supabase
        .from("profiles")
        .update({
          is_member: true,
          membership_started_at: now,
          membership_type: "platform",
        })
        .eq("id", app.user_id);

      // Send in-app notification
      await supabase.from("notifications").insert({
        user_id: app.user_id,
        type: "membership_confirmed",
        title: "You're in. Welcome to BloomBay.",
        body: "Your application was approved. The Avenue is yours — explore, connect, and bloom.",
        link: "/member/avenue",
      });
    }
  } else {
    await supabase
      .from("member_applications")
      .update({
        status: "declined",
        reviewed_at: now,
        decline_note: body.declineNote ?? null,
      })
      .eq("id", body.applicationId);
  }

  return NextResponse.json({ ok: true });
}

// GET /api/admin/approve-member — list pending applications
export async function GET(req: NextRequest) {
  if (!verifyAdmin(req)) {
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
