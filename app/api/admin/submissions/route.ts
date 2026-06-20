import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth-server";
import { fetchAllWaitlistRows } from "@/lib/supabase-admin";
import {
  filterRows,
  type SignupType,
  type WaitlistFilters,
  type WaitlistStatus,
} from "@/lib/waitlist-admin";

export async function GET(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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
