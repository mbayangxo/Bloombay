/**
 * Bloom requests — Supabase feed with demo seed fallback.
 */

import { BLOOM_REQUEST_PREVIEWS, type BloomRequestPreview } from "@/lib/member-connect-data";
import { allowDemoFallback } from "@/lib/truth/config";

export type BloomRequestFeedItem = BloomRequestPreview & {
  requestId: string;
  toUserId?: string;
  fromUserId?: string;
};

type ApiRow = {
  id: string;
  from_user_id: string;
  to_user_id: string;
  status: string;
  context: string | null;
  note: string | null;
  created_at: string;
};

const DEMO_NAMES: Record<string, { name: string; initial: string }> = {
  "demo-amanda": { name: "Amanda", initial: "A" },
  "demo-lexi": { name: "Lexi", initial: "L" },
};

function nameForUserId(id: string, fallback = "A member") {
  if (DEMO_NAMES[id]) return DEMO_NAMES[id];
  const initial = id.slice(0, 1).toUpperCase();
  return { name: fallback, initial };
}

function mapRow(row: ApiRow, selfId: string | null): BloomRequestFeedItem | null {
  const incoming = selfId ? row.to_user_id === selfId : true;
  const outgoing = selfId ? row.from_user_id === selfId : false;
  const otherId = incoming ? row.from_user_id : row.to_user_id;
  const { name, initial } = nameForUserId(otherId);
  const status = row.status as BloomRequestPreview["status"];
  if (!["pending", "accepted", "declined"].includes(status)) return null;

  return {
    requestId: row.id,
    id: row.id,
    fromUserId: row.from_user_id,
    toUserId: row.to_user_id,
    fromName: outgoing ? `You → ${name}` : name,
    fromInitial: initial,
    note: row.note ?? "",
    status,
    direction: incoming ? "incoming" : "outgoing",
    href: `/member/bloom-request?id=${row.id}`,
    context: row.context ?? "Intros",
  };
}

function seedAsFeed(): BloomRequestFeedItem[] {
  return BLOOM_REQUEST_PREVIEWS.map((p) => ({
    ...p,
    requestId: p.id,
    href: p.href || `/member/bloom-request?id=${p.id}`,
  }));
}

export async function fetchBloomRequestsFeed(selfId: string | null = "member-self"): Promise<{
  items: BloomRequestFeedItem[];
  source: "db" | "seed";
}> {
  try {
    const res = await fetch("/api/member/bloom-requests");
    if (!res.ok) throw new Error("fetch failed");
    const json = (await res.json()) as { requests?: ApiRow[]; source?: string };
    const rows = json.requests ?? [];
    if (rows.length === 0 && (json.source === "demo" || allowDemoFallback())) {
      return { items: seedAsFeed(), source: "seed" };
    }
    const items = rows
      .map((r) => mapRow(r, selfId))
      .filter((x): x is BloomRequestFeedItem => x != null);
    if (items.length === 0 && allowDemoFallback()) {
      return { items: seedAsFeed(), source: "seed" };
    }
    return { items, source: "db" };
  } catch {
    return { items: seedAsFeed(), source: "seed" };
  }
}
