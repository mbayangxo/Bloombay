"use client";

import { useCallback, useEffect, useState } from "react";
import { GATHERINGS } from "@/lib/member-portal-data";
import {
  eventToMemberHappening,
  liveEventsForMemberFeed,
  type MemberHappeningEvent,
} from "@/lib/bloombay-events-member";
import { listAllEvents } from "@/lib/bloombay-events-store";
import { fetchPublishedGatherings } from "@/lib/gatherings-feed";

const JOINED_CLUBS_KEY = "bb_member_joined_clubs";

function seedFromGatherings(): MemberHappeningEvent[] {
  return GATHERINGS.map((g) => ({
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
    kind: "regular" as const,
    clubId: null,
  }));
}

function getJoinedClubIds(): string[] {
  if (typeof window === "undefined") return ["morning-run-club", "the-page-turners"];
  try {
    const raw = localStorage.getItem(JOINED_CLUBS_KEY);
    if (raw) return JSON.parse(raw) as string[];
  } catch {
    /* ignore */
  }
  return ["morning-run-club", "the-page-turners"];
}

function mergeFeeds(
  local: MemberHappeningEvent[],
  remote: MemberHappeningEvent[]
): MemberHappeningEvent[] {
  const byId = new Map<string, MemberHappeningEvent>();
  for (const item of remote) byId.set(item.id, item);
  for (const item of local) {
    if (!byId.has(item.id)) byId.set(item.id, item);
  }
  return [...byId.values()].sort((a, b) => {
    const da = new Date(`${a.date} ${a.time}`).getTime();
    const db = new Date(`${b.date} ${b.time}`).getTime();
    if (!Number.isNaN(da) && !Number.isNaN(db)) return da - db;
    return a.title.localeCompare(b.title);
  });
}

export function useLiveHappenings(): MemberHappeningEvent[] {
  const [items, setItems] = useState<MemberHappeningEvent[]>(seedFromGatherings);

  const refresh = useCallback(() => {
    const live = liveEventsForMemberFeed(listAllEvents(), getJoinedClubIds());
    const base = live.length > 0 ? live : seedFromGatherings();
    void fetchPublishedGatherings().then(({ items: remote }) => {
      setItems(remote.length > 0 ? mergeFeeds(base, remote) : base);
    });
  }, []);

  useEffect(() => {
    refresh();
    window.addEventListener("bb-events-updated", refresh);
    return () => window.removeEventListener("bb-events-updated", refresh);
  }, [refresh]);

  return items;
}
