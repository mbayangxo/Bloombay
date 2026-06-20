/**
 * Event RSVPs — Supabase seat_reservations via /api/irl/reserve (truth layer).
 * Local cache mirrors server for instant UI only.
 */

import { allowDemoFallback, isTruthfulMode } from "@/lib/truth/config";
import { truthCheckIn, truthReserveSeat } from "@/lib/truth/client";
import { getEvent, saveEvent } from "@/lib/bloombay-events-store";

export type EventRsvp = {
  id: string;
  eventId: string;
  memberId: string;
  memberName: string;
  paidDeposit: boolean;
  createdAt: string;
};

export type EventCheckIn = {
  id: string;
  eventId: string;
  memberId: string;
  memberName: string;
  checkedInAt: string;
};

const RSVP_KEY = "bb_event_rsvps_cache";
const CHECKIN_KEY = "bb_event_checkins_cache";

function canUseStorage() {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
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
  window.dispatchEvent(new CustomEvent("bb-events-updated"));
}

export function ensureEventQrCode(eventId: string): string {
  const ev = getEvent(eventId);
  if (!ev) return `BB-${eventId}`;
  if (ev.qrCode) return ev.qrCode;
  const qr = `BB-${eventId.slice(0, 8).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
  saveEvent({ ...ev, qrCode: qr });
  return qr;
}

export function listEventRsvps(): EventRsvp[] {
  return readJson<EventRsvp[]>(RSVP_KEY, []);
}

export function listRsvps(eventId: string): EventRsvp[] {
  return listEventRsvps().filter((r) => r.eventId === eventId);
}

export function hasRsvp(eventId: string, memberId: string): boolean {
  return listRsvps(eventId).some((r) => r.memberId === memberId);
}

export async function rsvpToEvent(
  eventId: string,
  memberName: string,
  memberId = "member-self",
  options?: { paidDeposit?: boolean }
) {
  if (hasRsvp(eventId, memberId)) {
    if (options?.paidDeposit) {
      const all = readJson<EventRsvp[]>(RSVP_KEY, []);
      const idx = all.findIndex((r) => r.eventId === eventId && r.memberId === memberId);
      if (idx >= 0) {
        all[idx] = { ...all[idx], paidDeposit: true };
        writeJson(RSVP_KEY, all);
      }
    }
    return;
  }

  const result = await truthReserveSeat({ eventKey: eventId, gatheringId: eventId });

  if (!result.ok) {
    if (isTruthfulMode() && !allowDemoFallback()) {
      throw new Error(result.error ?? "RSVP failed — sign in and run migration 006");
    }
  }

  const all = readJson<EventRsvp[]>(RSVP_KEY, []);
  all.push({
    id: `${Date.now()}-${eventId}`,
    eventId,
    memberId,
    memberName,
    paidDeposit: options?.paidDeposit ?? false,
    createdAt: new Date().toISOString(),
  });
  writeJson(RSVP_KEY, all);
}

export function getRsvp(eventId: string, memberId = "member-self"): EventRsvp | undefined {
  return listRsvps(eventId).find((r) => r.memberId === memberId);
}

export function canAccessPlanRoom(eventId: string, memberId = "member-self"): boolean {
  return hasRsvp(eventId, memberId);
}

export function listCheckIns(eventId: string): EventCheckIn[] {
  return readJson<EventCheckIn[]>(CHECKIN_KEY, []).filter((c) => c.eventId === eventId);
}

export async function checkInToEvent(eventId: string, memberName: string, memberId = "member-self") {
  const existing = listCheckIns(eventId).find((c) => c.memberId === memberId);
  if (existing) return existing;

  const result = await truthCheckIn({ eventKey: eventId, gatheringId: eventId });
  if (!result.ok && isTruthfulMode() && !allowDemoFallback()) {
    throw new Error(result.error ?? "Check-in failed");
  }

  const all = readJson<EventCheckIn[]>(CHECKIN_KEY, []);
  const row: EventCheckIn = {
    id: `${Date.now()}-${eventId}`,
    eventId,
    memberId,
    memberName,
    checkedInAt: new Date().toISOString(),
  };
  all.push(row);
  writeJson(CHECKIN_KEY, all);
  return row;
}

export type EventAttendanceStats = {
  rsvps: number;
  checkIns: number;
  noShows: number;
};

export function getEventAttendanceStats(eventId: string): EventAttendanceStats {
  const rsvps = listRsvps(eventId).length;
  const checkIns = listCheckIns(eventId).length;
  return {
    rsvps,
    checkIns,
    noShows: Math.max(0, rsvps - checkIns),
  };
}
