import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { requireRole } from "@/lib/admin/require-staff";
import { writeAdminAuditLog } from "@/lib/admin/audit-log";

function admin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

const STAFF_READ = ["admin", "founder", "moderator", "curator"] as const;
const STAFF_REVIEW = ["admin", "founder", "curator"] as const;
const STAFF_MODERATE = ["admin", "founder", "moderator"] as const;

// GET /api/founder/pitches?status=pending&limit=50
export async function GET(req: NextRequest) {
  const guard = await requireRole(req, [...STAFF_READ]);
  if (guard.error) return guard.error;

  const status = req.nextUrl.searchParams.get("status") ?? "pending";
  const limit = Math.min(Number(req.nextUrl.searchParams.get("limit") ?? "50"), 100);

  const supabase = admin();
  let query = supabase
    .from("magazine_pitches")
    .select(`
      id, section, headline, pitch_body, image_url, status,
      reviewer_note, reviewed_at, created_at,
      submitted_by,
      author:profiles!submitted_by ( id, first_name, full_name )
    `)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (status !== "all") query = query.eq("status", status);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ pitches: data ?? [] });
}

// PATCH /api/founder/pitches — approve or reject
export async function PATCH(req: NextRequest) {
  const guard = await requireRole(req, [...STAFF_REVIEW]);
  if (guard.error) return guard.error;

  const body = await req.json() as { id: string; status: "approved" | "rejected"; reviewer_note?: string };
  if (!body.id || !["approved", "rejected"].includes(body.status)) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const supabase = admin();
  const { data: before } = await supabase
    .from("magazine_pitches")
    .select("id, status, reviewer_note")
    .eq("id", body.id)
    .maybeSingle();

  const reviewedAt = new Date().toISOString();
  const { error } = await supabase
    .from("magazine_pitches")
    .update({
      status: body.status,
      reviewer_note: body.reviewer_note ?? null,
      reviewed_by: guard.user.id,
      reviewed_at: reviewedAt,
    })
    .eq("id", body.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await writeAdminAuditLog({
    actorId: guard.user.id,
    actorRole: guard.role,
    action: `magazine_pitch.${body.status}`,
    resourceType: "magazine_pitch",
    resourceId: body.id,
    before: before as Record<string, unknown> | null,
    after: { status: body.status, reviewed_at: reviewedAt },
    req,
  });

  return NextResponse.json({ ok: true });
}
