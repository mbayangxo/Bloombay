import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/require-staff";
import { fetchAllWaitlistRows } from "@/lib/supabase-admin";
import {
  filterRows,
  type SignupType,
  type WaitlistFilters,
  type WaitlistStatus,
} from "@/lib/waitlist-admin";

export async function GET(request: NextRequest) {
  const guard = await requireAdmin(request);
  if (guard.error) return guard.error;

  const { searchParams } = new URL(request.url);
  const filters: WaitlistFilters = {
    type: (searchParams.get("type") as SignupType | "all" | null) ?? "all",
    status: (searchParams.get("status") as WaitlistStatus | "all" | null) ?? "all",
    city: searchParams.get("city") ?? undefined,
    interest: searchParams.get("interest") ?? undefined,
  };

  try {
    const rows = await fetchAllWaitlistRows();
    const filtered = filterRows(rows, filters);
    return NextResponse.json({ rows: filtered, total: rows.length });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
