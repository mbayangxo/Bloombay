/**
 * POST /api/admin/waitlist/notify
 * Admin/founder-only. Send an approved SMS template to waitlist members.
 *
 * body: {
 *   template: "private_beta_accepted" | "launch_announcement"
 *   user_ids?: string[]   // if omitted: all matching status rows
 *   status_filter?: "waiting" | "private_beta_accepted"
 *   dry_run?: boolean      // returns who would be texted without sending
 * }
 */
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendSMS } from "@/lib/notifications/sms";
import type { AllowedSmsType } from "@/lib/sms/policy";
import { verifyAdminRequest } from "@/lib/admin-auth";

function admin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}

const TEMPLATES: Record<string, (name: string) => string> = {
  private_beta_accepted: (name) =>
    `Hey ${name || "Bloomie"} 🌸\n\nYou're in — BloomBay private beta is open for you. Join here: bloombay.app/join\n\nWomen are gathering ✿`,
  launch_announcement: (name) =>
    `Hey ${name || "Bloomie"} 🌸\n\nBloomBay is officially live in your city. Come find your people: bloombay.app\n\nWomen are gathering ✿`,
};

const SMS_TYPE_BY_TEMPLATE: Record<keyof typeof TEMPLATES, AllowedSmsType> = {
  private_beta_accepted: "private_beta_accepted",
  launch_announcement: "app_launch",
};

const BATCH_LIMIT = 500; // max sends per invocation

export async function POST(req: NextRequest) {
  if (!await verifyAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json() as {
    template?: string;
    user_ids?: string[];
    status_filter?: string;
    dry_run?: boolean;
  };

  if (!body.template || !TEMPLATES[body.template]) {
    return NextResponse.json(
      { error: `template must be one of: ${Object.keys(TEMPLATES).join(", ")}` },
      { status: 400 }
    );
  }

  const db = admin();
  const buildTemplate = TEMPLATES[body.template];

  // Fetch target rows
  let query = db
    .from("waitlist")
    .select("id, first_name, email, phone_number, status")
    .not("phone_number", "is", null)
    .limit(BATCH_LIMIT);

  if (body.user_ids?.length) {
    query = query.in("id", body.user_ids);
  } else if (body.status_filter) {
    query = query.eq("status", body.status_filter);
  } else {
    query = query.eq("status", "waiting");
  }

  const { data: rows, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const targets = (rows ?? []) as { id: string; first_name: string | null; email: string; phone_number: string | null; status: string }[];

  if (body.dry_run) {
    return NextResponse.json({
      dry_run: true,
      would_send: targets.length,
      targets: targets.map(r => ({ id: r.id, email: r.email, has_phone: !!r.phone_number })),
    });
  }

  // Send and log
  let sent = 0;
  let failed = 0;
  const errors: string[] = [];

  for (const row of targets) {
    if (!row.phone_number) continue;
    const name = row.first_name ?? "";
    const result = await sendSMS(
      row.phone_number,
      buildTemplate(name),
      SMS_TYPE_BY_TEMPLATE[body.template as keyof typeof TEMPLATES],
    );

    if (result.ok) {
      sent++;
      // Update status if template implies acceptance
      if (body.template === "private_beta_accepted") {
        await db.from("waitlist").update({ status: "private_beta_accepted" }).eq("id", row.id);
      }
    } else {
      failed++;
      errors.push(`${row.email}: ${result.error}`);
    }
  }

  // Log in cron_logs for audit trail
  await db.from("cron_logs").insert({
    job: `admin-waitlist-notify:${body.template}`,
    result: failed === 0 ? "ok" : "error",
    details: { sent, failed, errors: errors.slice(0, 20) },
    ran_at: new Date().toISOString(),
  }).maybeSingle();

  return NextResponse.json({ ok: true, sent, failed, errors: errors.slice(0, 10) });
}
