/**
 * Blue Day — founder announcements to all platform users.
 */

import { listBlueDayEvents } from "@/lib/bloombay-events-store";
import { getEventAttendanceStats } from "@/lib/event-rsvp-store";

export type BlueDayAnnouncement = {
  id: string;
  eventId?: string;
  title: string;
  body: string;
  channels: { push: boolean; email: boolean; sms: boolean };
  sentAt: string;
  reach: number;
};

const ANNOUNCE_KEY = "bb_blueday_announcements";
const MEMBER_BLUEDAY_KEY = "bb_member_blueday_feed";

function canUseStorage() {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function readJson<T>(key: string, fallback: T): T {
  if (!canUseStorage()) return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, data: unknown) {
  if (!canUseStorage()) return;
  localStorage.setItem(key, JSON.stringify(data));
}

export function sendBlueDayAnnouncement(data: {
  title: string;
  body: string;
  eventId?: string;
  channels: BlueDayAnnouncement["channels"];
}) {
  const all = readJson<BlueDayAnnouncement[]>(ANNOUNCE_KEY, []);
  const row: BlueDayAnnouncement = {
    id: uid(),
    ...data,
    sentAt: new Date().toISOString(),
    reach: 2400,
  };
  all.unshift(row);
  writeJson(ANNOUNCE_KEY, all);

  const feed = readJson<{ id: string; title: string; body: string; at: string }[]>(MEMBER_BLUEDAY_KEY, []);
  feed.unshift({ id: row.id, title: row.title, body: row.body, at: row.sentAt });
  writeJson(MEMBER_BLUEDAY_KEY, feed.slice(0, 20));
  return row;
}

export function listBlueDayAnnouncements(): BlueDayAnnouncement[] {
  return readJson<BlueDayAnnouncement[]>(ANNOUNCE_KEY, []);
}

export type BlueDayPlatformAnalytics = {
  liveEvents: number;
  totalRsvps: number;
  totalCheckIns: number;
  freeEvents: number;
  paidEvents: number;
};

export function getBlueDayAnalytics(): BlueDayPlatformAnalytics {
  const events = listBlueDayEvents();
  const live = events.filter((e) => e.status === "live");
  let rsvps = 0;
  let checkIns = 0;
  for (const e of events) {
    const s = getEventAttendanceStats(e.id);
    rsvps += s.rsvps;
    checkIns += s.checkIns;
  }
  return {
    liveEvents: live.length,
    totalRsvps: rsvps,
    totalCheckIns: checkIns,
    freeEvents: events.filter((e) => e.ticket === 0 && e.deposit === 0).length,
    paidEvents: events.filter((e) => e.ticket > 0 || e.deposit > 0).length,
  };
}
