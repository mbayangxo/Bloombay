import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdmin } from "@supabase/supabase-js";

function adminClient() {
  return createAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

export async function GET(_req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (!["admin", "founder"].includes(profile?.role ?? "")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const admin = adminClient();
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const now = new Date().toISOString();

  const [
    { count: totalMembers },
    { count: pendingApplications },
    { count: activeClubs },
    { count: newThisWeek },
    { count: upcomingEvents },
  ] = await Promise.all([
    admin.from("profiles").select("id", { count: "exact", head: true }).eq("is_member", true),
    admin.from("member_applications").select("id", { count: "exact", head: true }).eq("status", "pending"),
    admin.from("clubs").select("id", { count: "exact", head: true }).eq("is_active", true),
    admin.from("profiles").select("id", { count: "exact", head: true }).eq("is_member", true).gte("membership_started_at", weekAgo),
    admin
      .from("gatherings")
      .select("id", { count: "exact", head: true })
      .eq("publish_status", "live")
      .gt("starts_at", now),
  ]);

  return NextResponse.json({
    totalMembers: totalMembers ?? 0,
    pendingApplications: pendingApplications ?? 0,
    activeClubs: activeClubs ?? 0,
    newThisWeek: newThisWeek ?? 0,
    upcomingEvents: upcomingEvents ?? 0,
  });
}
