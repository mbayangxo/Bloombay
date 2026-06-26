import type { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getClientIp } from "@/lib/admin/require-staff";

function admin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } },
  );
}

export interface AdminAuditLogInput {
  actorId: string;
  actorRole?: string;
  action: string;
  resourceType?: string;
  resourceId?: string;
  before?: Record<string, unknown> | null;
  after?: Record<string, unknown> | null;
  req?: NextRequest;
  metadata?: Record<string, unknown>;
}

/** Best-effort audit write — never throws. */
export async function writeAdminAuditLog(input: AdminAuditLogInput): Promise<void> {
  try {
    const db = admin();
    await db.from("admin_audit_logs").insert({
      actor_id:      input.actorId,
      actor_role:    input.actorRole ?? null,
      action:        input.action,
      resource_type: input.resourceType ?? null,
      resource_id:   input.resourceId ?? null,
      before_state:  input.before ?? null,
      after_state:   input.after ?? null,
      ip_address:    input.req ? getClientIp(input.req) : null,
      user_agent:    input.req?.headers.get("user-agent") ?? null,
      metadata:      input.metadata ?? {},
    });
  } catch {
    // Audit failure must not block the admin action
  }
}
