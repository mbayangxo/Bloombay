import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Fetch plans where user is creator or invitee
  const { data: created } = await supabase
    .from("bloomies_plans")
    .select("id, title, plan_type, description, date_time, venue, status, created_at, emoji")
    .eq("creator_id", user.id)
    .eq("status", "active")
    .order("date_time", { ascending: true, nullsFirst: false });

  const { data: invitedRows } = await supabase
    .from("bloomies_plan_invites")
    .select("plan_id")
    .eq("invitee_id", user.id)
    .in("rsvp_status", ["pending", "yes", "maybe"]);

  const invitedIds = (invitedRows ?? []).map(r => r.plan_id);

  let invited: typeof created = [];
  if (invitedIds.length > 0) {
    const { data } = await supabase
      .from("bloomies_plans")
      .select("id, title, plan_type, description, date_time, venue, status, created_at, emoji")
      .in("id", invitedIds)
      .eq("status", "active")
      .order("date_time", { ascending: true, nullsFirst: false });
    invited = data ?? [];
  }

  // Merge + dedupe
  const seen = new Set<string>();
  const plans: NonNullable<typeof created> = [];
  for (const p of [...(created ?? []), ...invited]) {
    if (!seen.has(p.id)) { seen.add(p.id); plans.push(p); }
  }

  // Get member counts per plan
  const planIds = plans.map(p => p.id);
  let memberCounts: Record<string, number> = {};
  if (planIds.length > 0) {
    const { data: invites } = await supabase
      .from("bloomies_plan_invites")
      .select("plan_id")
      .in("plan_id", planIds)
      .in("rsvp_status", ["yes", "maybe", "pending"]);
    for (const inv of invites ?? []) {
      memberCounts[inv.plan_id] = (memberCounts[inv.plan_id] ?? 0) + 1;
    }
  }

  // Get unread message counts (messages since user last viewed — approximate with last 24h)
  let unreadCounts: Record<string, number> = {};
  if (planIds.length > 0) {
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { data: msgs } = await supabase
      .from("bloomies_plan_messages")
      .select("plan_id")
      .in("plan_id", planIds)
      .neq("sender_id", user.id)
      .gte("created_at", since);
    for (const m of msgs ?? []) {
      unreadCounts[m.plan_id] = (unreadCounts[m.plan_id] ?? 0) + 1;
    }
  }

  const PLAN_TYPE_EMOJI: Record<string, string> = {
    dinner: "🍽️", birthday: "🎂", hangout: "☕", trip: "✈️", brunch: "🥂", other: "✦",
  };

  const result = plans.map(p => ({
    id: p.id,
    name: p.title,
    emoji: (p as { emoji?: string }).emoji ?? PLAN_TYPE_EMOJI[p.plan_type] ?? "✦",
    bg: "#18080F",
    accent: "#FF1F7D",
    unread: unreadCounts[p.id] ?? 0,
    members: memberCounts[p.id] ?? 1,
    date: p.date_time ? new Date(p.date_time).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "TBD",
    venue: p.venue ?? undefined,
    time: p.date_time ? new Date(p.date_time).toLocaleString("en-US", { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }) : undefined,
    plan_type: p.plan_type,
    description: p.description ?? undefined,
    status: p.status,
  }));

  // Fetch past gatherings the user attended (memories)
  const { data: attendanceRows } = await supabase
    .from("gathering_attendance")
    .select("checked_in_at, gatherings(id, title, starts_at, image_url, venue, neighborhood)")
    .eq("user_id", user.id)
    .order("checked_in_at", { ascending: false })
    .limit(12);

  type GatheringRow = { id: string; title: string; starts_at: string; image_url: string | null; venue: string | null; neighborhood: string | null };
  const memories = (attendanceRows ?? [])
    .map(row => {
      const raw = (row as unknown as { gatherings: GatheringRow | GatheringRow[] | null }).gatherings;
      const g = Array.isArray(raw) ? raw[0] ?? null : raw;
      if (!g) return null;
      return {
        id: g.id,
        name: g.title,
        date: new Date(g.starts_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        poster: g.image_url ?? null,
        note: g.venue ?? g.neighborhood ?? "",
      };
    })
    .filter(Boolean);

  return NextResponse.json({ plans: result, memories });
}

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json() as {
    title?: string; plan_type?: string; description?: string;
    date_time?: string; venue?: string; emoji?: string; invitee_ids?: string[];
  };

  if (!body.title?.trim()) return NextResponse.json({ error: "Title is required" }, { status: 400 });

  const { data: plan, error } = await supabase
    .from("bloomies_plans")
    .insert({
      creator_id: user.id,
      title: body.title.trim(),
      plan_type: body.plan_type ?? "hangout",
      description: body.description ?? null,
      date_time: body.date_time ?? null,
      venue: body.venue ?? null,
      emoji: body.emoji ?? null,
    })
    .select("id, title, plan_type, created_at")
    .single();

  if (error || !plan) return NextResponse.json({ error: error?.message ?? "Failed to create plan" }, { status: 500 });

  if (body.invitee_ids?.length) {
    await supabase.from("bloomies_plan_invites").insert(
      body.invitee_ids.map(id => ({ plan_id: plan.id, invitee_id: id }))
    );
  }

  return NextResponse.json({ plan }, { status: 201 });
}
