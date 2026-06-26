import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { requireAdmin } from "@/lib/admin/require-staff";

function admin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

// GET /api/admin/club-mama-applications?status=pending
export async function GET(req: NextRequest) {
  const guard = await requireAdmin(req);
  if (guard.error) return guard.error;

  const status = req.nextUrl.searchParams.get("status") ?? "pending";
  const { data, error } = await admin()
    .from("club_mama_applications")
    .select(
      `
      id,
      user_id,
      club_name,
      club_emoji,
      category,
      tagline,
      neighborhood,
      description,
      frequency,
      capacity,
      membership_type,
      status,
      submitted_at,
      reviewed_at,
      profiles:user_id (full_name, email)
    `,
    )
    .eq("status", status)
    .order("submitted_at", { ascending: false })
    .limit(50);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}
