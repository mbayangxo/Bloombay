import type { BloomBayEvent } from "@/lib/bloombay-events-store";

/** Shape member happenings UI expects (extends seed GATHERINGS). */
export type MemberHappeningEvent = {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  time: string;
  venue: string;
  neighborhood: string;
  coverUrl: string;
  chemistry: number;
  attendees: string[];
  extra: number;
  deposit: number;
  ticket: number;
  minSpend: number;
  total: number;
  table: string;
  kind: BloomBayEvent["kind"];
  clubId: string | null;
};

export function eventToMemberHappening(e: BloomBayEvent): MemberHappeningEvent {
  const d = new Date(e.startAt);
  const date = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const time = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  const initials = ["A", "M", "K", "P", "J", "S"].slice(0, Math.min(6, e.rsvpCount));
  return {
    id: e.id,
    title: e.title,
    subtitle: e.subtitle,
    date,
    time,
    venue: e.venue,
    neighborhood: e.neighborhood,
    coverUrl: e.coverUrl,
    chemistry: e.chemistry,
    attendees: initials,
    extra: Math.max(0, e.rsvpCount - initials.length),
    deposit: e.deposit,
    ticket: e.ticket,
    minSpend: 0,
    total: e.ticket + e.deposit,
    table: "—",
    kind: e.kind,
    clubId: e.clubId,
  };
}

import { GATHERINGS } from "@/lib/member-portal-data";
import { getEvent } from "@/lib/bloombay-events-store";

export function getMemberHappeningById(id: string): MemberHappeningEvent | null {
  const ev = getEvent(id);
  if (ev && ev.status === "live") return eventToMemberHappening(ev);
  const g = GATHERINGS.find((x) => x.id === id);
  if (!g) return null;
  return {
    id: g.id,
    title: g.title,
    subtitle: g.subtitle,
    date: g.date,
    time: g.time,
    venue: g.venue,
    neighborhood: g.neighborhood,
    coverUrl: "",
    chemistry: g.chemistry,
    attendees: g.attendees,
    extra: g.extra,
    deposit: g.deposit,
    ticket: g.ticket,
    minSpend: g.minSpend,
    total: g.total,
    table: g.table,
    kind: "regular",
    clubId: null,
  };
}

export function liveEventsForMemberFeed(
  events: BloomBayEvent[],
  joinedClubIds: string[] = []
): MemberHappeningEvent[] {
  return events
    .filter((e) => {
      if (e.status !== "live") return false;
      if (e.visibility === "all") return true;
      return e.clubId != null && joinedClubIds.includes(e.clubId);
    })
    .sort((a, b) => a.startAt.localeCompare(b.startAt))
    .map(eventToMemberHappening);
}
