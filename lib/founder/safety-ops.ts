import { getAdminClient } from "@/lib/supabase-admin";

export type FounderSafetyReport = {
  id: string;
  userId: string | null;
  email: string | null;
  category: string;
  body: string;
  status: string;
  createdAt: string;
};

export type FounderSafetyPing = {
  id: string;
  senderId: string;
  recipientId: string;
  senderName: string;
  recipientName: string;
  status: string;
  eventName: string | null;
  createdAt: string;
};

export type FounderSafetySnapshot = {
  reports: FounderSafetyReport[];
  pings: FounderSafetyPing[];
  openReports: number;
  recentPings: number;
  warning: string | null;
};

async function profileNames(ids: string[]): Promise<Map<string, string>> {
  const unique = [...new Set(ids.filter(Boolean))];
  if (unique.length === 0) return new Map();

  const admin = getAdminClient();
  const { data } = await admin
    .from("profiles")
    .select("id, first_name, display_name, email")
    .in("id", unique);

  const map = new Map<string, string>();
  for (const row of data ?? []) {
    const r = row as { id: string; first_name: string | null; display_name: string | null; email: string | null };
    const name =
      r.display_name?.trim() ||
      r.first_name?.trim() ||
      r.email?.split("@")[0] ||
      "Member";
    map.set(r.id, name);
  }
  return map;
}

export async function fetchFounderSafetySnapshot(): Promise<FounderSafetySnapshot> {
  const admin = getAdminClient();
  let warning: string | null = null;

  const { data: reportRows, error: reportErr } = await admin
    .from("safety_reports")
    .select("id, user_id, email, category, body, status, created_at")
    .order("created_at", { ascending: false })
    .limit(100);

  if (reportErr) {
    if (reportErr.message.includes("does not exist")) {
      warning = "Run supabase/migrations/007_community_theme_safety.sql";
    } else {
      throw new Error(reportErr.message);
    }
  }

  const { data: pingRows, error: pingErr } = await admin
    .from("safety_pings")
    .select("id, sender_id, recipient_id, status, event_name, created_at")
    .order("created_at", { ascending: false })
    .limit(100);

  if (pingErr && !warning) {
    if (pingErr.message.includes("does not exist")) {
      warning = "Run supabase/migrations/041_bouquet_checkins_safety.sql";
    } else {
      throw new Error(pingErr.message);
    }
  }

  const reports: FounderSafetyReport[] = (reportRows ?? []).map((row) => {
    const r = row as Record<string, unknown>;
    return {
      id: String(r.id),
      userId: r.user_id != null ? String(r.user_id) : null,
      email: r.email != null ? String(r.email) : null,
      category: String(r.category),
      body: String(r.body),
      status: String(r.status),
      createdAt: String(r.created_at),
    };
  });

  const pingList = pingRows ?? [];
  const pingIds = pingList.flatMap((row) => {
    const r = row as { sender_id: string; recipient_id: string };
    return [r.sender_id, r.recipient_id];
  });
  const names = await profileNames(pingIds);

  const pings: FounderSafetyPing[] = pingList.map((row) => {
    const r = row as Record<string, unknown>;
    const senderId = String(r.sender_id);
    const recipientId = String(r.recipient_id);
    return {
      id: String(r.id),
      senderId,
      recipientId,
      senderName: names.get(senderId) ?? "Member",
      recipientName: names.get(recipientId) ?? "Member",
      status: String(r.status),
      eventName: r.event_name != null ? String(r.event_name) : null,
      createdAt: String(r.created_at),
    };
  });

  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const recentPings = pings.filter((p) => new Date(p.createdAt).getTime() >= weekAgo).length;

  return {
    reports,
    pings,
    openReports: reports.filter((r) => r.status === "open").length,
    recentPings,
    warning,
  };
}

export async function updateSafetyReportStatus(
  id: string,
  status: "open" | "reviewed" | "closed"
): Promise<void> {
  const admin = getAdminClient();
  const { error } = await admin.from("safety_reports").update({ status }).eq("id", id);
  if (error) throw new Error(error.message);
}
