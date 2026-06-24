import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { logBehaviorSignal } from "@/lib/truth/behavior";
import { isBlocked } from "@/lib/auth/block-check";

type ProfileRow = {
  id: string;
  first_name: string | null;
  full_name: string | null;
  avatar_url: string | null;
  neighborhood: string | null;
};

type RequestRow = {
  id: string;
  from_user_id: string;
  to_user_id: string;
  status: "pending" | "accepted" | "declined" | "cancelled";
  context: string | null;
  note: string | null;
  compatibility_score: number | null;
  created_at: string;
  data: { template?: string } | null;
  sender: ProfileRow | null;
  recipient: ProfileRow | null;
};

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  const { data: rows, error } = await supabase
    .from("bloom_requests")
    .select("id, from_user_id, to_user_id, status, context, note, compatibility_score, created_at, data")
    .or(`to_user_id.eq.${user.id},from_user_id.eq.${user.id}`)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    if (error.message.includes("does not exist")) {
      return NextResponse.json({ incoming: [], sent: [], accepted: [], source: "demo" });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const requests = rows ?? [];
  if (requests.length === 0) {
    return NextResponse.json({ incoming: [], sent: [], accepted: [], source: "db" });
  }

  // Gather all user IDs and fetch profiles in one query
  const userIds = [...new Set([
    ...requests.map((r) => r.from_user_id),
    ...requests.map((r) => r.to_user_id),
  ])];

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, first_name, full_name, avatar_url, neighborhood")
    .in("id", userIds);

  const profileMap = new Map<string, ProfileRow>(
    (profiles ?? []).map((p: ProfileRow) => [p.id, p])
  );

  const enriched: RequestRow[] = requests.map((r) => ({
    ...r,
    data: (r.data as { template?: string } | null) ?? null,
    sender: profileMap.get(r.from_user_id) ?? null,
    recipient: profileMap.get(r.to_user_id) ?? null,
  }));

  const incoming = enriched.filter((r) => r.to_user_id === user.id && r.status === "pending");
  const sent = enriched.filter((r) => r.from_user_id === user.id && r.status === "pending");
  const accepted = enriched.filter((r) => r.status === "accepted");

  return NextResponse.json({ incoming, sent, accepted, source: "db" });
}

const BLOOM_RATE_LIMIT_PER_DAY = 10;
const NOTE_MAX_LENGTH = 200;

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ ok: false, error: "Sign in required" }, { status: 401 });
  }

  let body: { toUserId?: string; context?: string; note?: string; template?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.toUserId) {
    return NextResponse.json({ ok: false, error: "toUserId required" }, { status: 400 });
  }

  if (body.toUserId === user.id) {
    return NextResponse.json({ ok: false, error: "Cannot bloom yourself" }, { status: 400 });
  }

  // Block check — don't allow blooms between blocked users
  if (await isBlocked(supabase, user.id, body.toUserId)) {
    return NextResponse.json({ ok: false, error: "Cannot send bloom request" }, { status: 403 });
  }

  if (body.note && body.note.length > NOTE_MAX_LENGTH) {
    return NextResponse.json({ ok: false, error: `Note too long (max ${NOTE_MAX_LENGTH} chars)` }, { status: 400 });
  }

  // Daily rate limit
  const dayStart = new Date();
  dayStart.setHours(0, 0, 0, 0);
  const { count: dailyCount } = await supabase
    .from("bloom_requests")
    .select("id", { count: "exact", head: true })
    .eq("from_user_id", user.id)
    .gte("created_at", dayStart.toISOString());

  if ((dailyCount ?? 0) >= BLOOM_RATE_LIMIT_PER_DAY) {
    return NextResponse.json({ ok: false, error: "Daily bloom limit reached. Try again tomorrow." }, { status: 429 });
  }

  // Prevent duplicate pending requests to the same person
  const { data: existing } = await supabase
    .from("bloom_requests")
    .select("id")
    .eq("from_user_id", user.id)
    .eq("to_user_id", body.toUserId)
    .eq("status", "pending")
    .maybeSingle();

  if (existing) {
    return NextResponse.json({ ok: false, error: "You already have a pending request with this person" }, { status: 409 });
  }

  const validTemplates = ["classic", "dark", "cream", "minimal"];
  const template = body.template && validTemplates.includes(body.template) ? body.template : "classic";

  const { data, error } = await supabase
    .from("bloom_requests")
    .insert({
      from_user_id: user.id,
      to_user_id: body.toUserId,
      context: body.context ?? null,
      note: body.note ?? null,
      status: "pending",
      data: { template },
    })
    .select()
    .single();

  if (error) {
    if (error.message.includes("does not exist")) {
      return NextResponse.json(
        { ok: false, error: "Run supabase/migrations/006_member_truth_layer.sql" },
        { status: 503 }
      );
    }
    return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
  }

  await logBehaviorSignal(supabase, user.id, "bloom_request_sent", { requestId: data.id });

  // Send notification to recipient
  const { data: senderProfile } = await supabase
    .from("profiles")
    .select("first_name, full_name")
    .eq("id", user.id)
    .maybeSingle();

  const senderName = senderProfile?.first_name || senderProfile?.full_name?.split(" ")[0] || "Someone";

  await supabase.from("notifications").insert({
    user_id: body.toUserId,
    type: "bloom_request",
    title: `${senderName} sent you a bloom request 🌸`,
    body: body.note ? `"${body.note.slice(0, 80)}${body.note.length > 80 ? "…" : ""}"` : "She sees something in you.",
    link: "/member/introductions",
    data: { request_id: data.id, sender_id: user.id },
  }).maybeSingle();

  return NextResponse.json({ ok: true, request: data });
}
