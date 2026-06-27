import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { requireAdmin } from "@/lib/admin/require-staff";
import { writeAdminAuditLog } from "@/lib/admin/audit-log";
import { notFound, validationError } from "@/lib/api/error-response";
import { logInfo } from "@/lib/logger";
import { provisionClubFromApplication } from "@/lib/club-mama/provision-club";
import { createNotificationEvent } from "@/lib/notifications/notification-service";

function admin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

/** POST /api/admin/club-mama-applications/[id] — approve or decline */
export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const guard = await requireAdmin(req);
  if (guard.error) return guard.error;

  const { id } = await context.params;
  const body = (await req.json().catch(() => ({}))) as {
    action?: "approve" | "decline";
    declineNote?: string;
  };

  if (body.action !== "approve" && body.action !== "decline") {
    return validationError("action must be approve or decline");
  }

  const supabase = admin();

  const { data: app, error: fetchErr } = await supabase
    .from("club_mama_applications")
    .select("*")
    .eq("id", id)
    .single();

  if (fetchErr || !app) {
    return notFound("Application not found");
  }

  if (app.status !== "pending") {
    return validationError(`Application already ${app.status}`);
  }

  const now = new Date().toISOString();
  const beforeState = { status: app.status, reviewed_at: app.reviewed_at };

  if (body.action === "decline") {
    await supabase
      .from("club_mama_applications")
      .update({
        status: "declined",
        reviewed_at: now,
        reviewed_by: guard.user.id,
      })
      .eq("id", id);

    if (app.user_id) {
      await createNotificationEvent({
        userId: app.user_id,
        type: "club_application_rejected",
        channels: ["in_app", "email"],
        payload: {
          title: "Club Mama application update",
          body:
            body.declineNote?.trim() ||
            "Your Club Mama application wasn't approved this round. You can reapply when you're ready.",
          link: "/member/apply-club-mama",
          templateVars: { clubName: app.club_name as string },
        },
        actorId: guard.user.id,
        actorRole: guard.role,
      });
    }

    await writeAdminAuditLog({
      actorId: guard.user.id,
      actorRole: guard.role,
      action: "club_mama_application.decline",
      resourceType: "club_mama_application",
      resourceId: id,
      before: beforeState,
      after: { status: "declined", reviewed_at: now },
      req,
    });

    return NextResponse.json({ ok: true, status: "declined" });
  }

  if (!app.user_id) {
    return validationError(
      "Applicant must have a BloomBay account before approval. Ask them to sign up and reapply.",
    );
  }

  let clubId: string;
  let clubSlug: string;
  let created: boolean;
  try {
    ({ clubId, clubSlug, created } = await provisionClubFromApplication(
      supabase,
      app,
      app.user_id,
    ));
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to provision club";
    return NextResponse.json({ error: message }, { status: 500 });
  }

  await supabase
    .from("profiles")
    .update({ role: "club_owner" })
    .eq("id", app.user_id);

  await supabase
    .from("club_mama_applications")
    .update({
      status: "approved",
      reviewed_at: now,
      reviewed_by: guard.user.id,
    })
    .eq("id", id);

  await createNotificationEvent({
    userId: app.user_id,
    type: "club_application_approved",
    channels: ["in_app", "email"],
    payload: {
      title: `You're approved — ${app.club_name}`,
      body: created
        ? "Your Club Mama application was approved. Open the Club Mama portal to finish setup and plan your first gathering."
        : "Your Club Mama application was approved. Your club profile is updated — head to the Club Mama portal.",
      link: "/club-owner/dashboard",
      templateVars: { clubName: app.club_name as string },
      data: { club_id: clubId, club_slug: clubSlug, application_id: id },
    },
    actorId: guard.user.id,
    actorRole: guard.role,
  });

  await writeAdminAuditLog({
    actorId: guard.user.id,
    actorRole: guard.role,
    action: "club_mama_application.approve",
    resourceType: "club_mama_application",
    resourceId: id,
    before: beforeState,
    after: { status: "approved", reviewed_at: now, club_id: clubId, club_slug: clubSlug },
    req,
  });

  logInfo("admin", "Club Mama application approved", {
    applicationId: id,
    userId: app.user_id,
    clubId,
    clubSlug,
  });

  return NextResponse.json({ ok: true, status: "approved", clubId, clubSlug });
}
