/**
 * Member happenings feed — Supabase gatherings with local/event fallback.
 */

import type { MemberHappeningEvent } from "@/lib/bloombay-events-member";

export type GatheringRow = {
  id: string;
  slug: string;
  title: string;
  starts_at: string;
  area: string | null;
  venue: string | null;
  neighborhood: string | null;
  capacity: number;
  spots_left: number;
  club_slug: string | null;
  event_key: string | null;
};

export function gatheringRowToMemberHappening(row: GatheringRow): MemberHappeningEvent {
  const d = new Date(row.starts_at);
  const date = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const time = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  const going = Math.max(0, row.capacity - row.spots_left);
  const initials = ["A", "M", "K", "P", "J", "S"].slice(0, Math.min(6, going));
  return {
    id: row.event_key || row.slug,
    title: row.title,
    subtitle: row.area ?? row.neighborhood ?? "BloomBay gathering",
    date,
    time,
    venue: row.venue ?? "Venue TBA",
    neighborhood: row.neighborhood ?? row.area ?? "NYC",
    coverUrl: "",
    chemistry: 0,
    attendees: initials,
    extra: Math.max(0, going - initials.length),
    deposit: 0,
    ticket: 0,
    minSpend: 0,
    total: 0,
    table: "—",
    kind: "regular",
    clubId: row.club_slug,
  };
}

export async function fetchPublishedGatherings(): Promise<{
  items: MemberHappeningEvent[];
  source: "db" | "none";
}> {
  try {
    const res = await fetch("/api/member/gatherings");
    if (!res.ok) return { items: [], source: "none" };
    const json = (await res.json()) as { gatherings?: GatheringRow[] };
    const rows = json.gatherings ?? [];
    return {
      items: rows.map(gatheringRowToMemberHappening),
      source: rows.length > 0 ? "db" : "none",
    };
  } catch {
    return { items: [], source: "none" };
  }
}
