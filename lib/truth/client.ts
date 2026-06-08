/**
 * Client-side truth layer — every member action goes through these APIs.
 */

import { allowDemoFallback, isTruthfulMode } from "@/lib/truth/config";
import type { DiscoveryMoodId } from "@/lib/discovery-mood";
import type { CalendarEntryKind } from "@/lib/member-calendar-store";

export type TruthError = { ok: false; error: string; status?: number };
export type TruthOk<T> = { ok: true } & T;

async function postJson<T>(path: string, body: unknown): Promise<T & { ok: boolean; error?: string }> {
  const res = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const json = (await res.json()) as T & { ok: boolean; error?: string };
  if (!res.ok && !json.error) {
    return { ...json, ok: false, error: res.statusText } as T & { ok: boolean; error?: string };
  }
  return json;
}

async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(path);
  return (await res.json()) as T;
}

export async function truthReserveSeat(input: {
  gatheringId?: string;
  slug?: string;
  eventKey?: string;
}): Promise<{ ok: boolean; error?: string; gathering?: unknown }> {
  const body =
    input.gatheringId != null
      ? { gatheringId: input.gatheringId }
      : input.slug != null
        ? { slug: input.slug }
        : input.eventKey != null
          ? { eventKey: input.eventKey }
          : {};
  return postJson("/api/irl/reserve", body);
}

export async function truthCheckIn(input: {
  gatheringId?: string;
  slug?: string;
  eventKey?: string;
}): Promise<{ ok: boolean; error?: string }> {
  const body =
    input.gatheringId != null
      ? { gatheringId: input.gatheringId }
      : input.slug != null
        ? { slug: input.slug }
        : input.eventKey != null
          ? { eventKey: input.eventKey }
          : {};
  return postJson("/api/irl/check-in", body);
}

export async function truthJoinClub(clubSlug: string): Promise<{ ok: boolean; error?: string }> {
  return postJson("/api/irl/join-club", { clubSlug });
}

export async function truthCreateGathering(input: {
  title: string;
  startsAt: string;
  area?: string;
  capacity?: number;
  clubSlug?: string;
  venue?: string;
  neighborhood?: string;
}): Promise<{ ok: boolean; error?: string; gathering?: unknown }> {
  return postJson("/api/member/gatherings", input);
}

export async function truthSubmitClubApplication(input: {
  clubSlug: string;
  applicantName: string;
  city?: string;
  instagram?: string;
  why: string;
}): Promise<{ ok: boolean; error?: string; application?: unknown }> {
  return postJson("/api/member/club-applications", input);
}

export async function truthSendBloomRequest(input: {
  toUserId: string;
  context?: string;
  note?: string;
}): Promise<{ ok: boolean; error?: string; request?: unknown }> {
  return postJson("/api/member/bloom-requests", input);
}

export async function truthRespondBloomRequest(
  requestId: string,
  status: "accepted" | "declined"
): Promise<{ ok: boolean; error?: string }> {
  return postJson(`/api/member/bloom-requests/${requestId}/respond`, { status });
}

export async function truthAddCalendarPlan(input: {
  sourceId: string;
  title: string;
  when: string;
  place: string;
  href: string;
  kind: CalendarEntryKind;
  remind?: boolean;
}): Promise<{ ok: boolean; error?: string; entry?: unknown }> {
  return postJson("/api/member/calendar", input);
}

export async function truthListCalendar(): Promise<{ plans: unknown[] }> {
  return getJson("/api/member/calendar");
}

export async function truthRemoveCalendar(id: string): Promise<{ ok: boolean; error?: string }> {
  const res = await fetch(`/api/member/calendar?id=${encodeURIComponent(id)}`, { method: "DELETE" });
  return (await res.json()) as { ok: boolean; error?: string };
}

export async function truthToggleCalendarReminder(
  id: string,
  remind: boolean
): Promise<{ ok: boolean; error?: string; entry?: unknown }> {
  const res = await fetch("/api/member/calendar", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, remind }),
  });
  return (await res.json()) as { ok: boolean; error?: string; entry?: unknown };
}

export async function truthEarnStamp(input: {
  label: string;
  clubSlug?: string;
  gatheringId?: string;
}): Promise<{ ok: boolean; error?: string; stamp?: unknown }> {
  return postJson("/api/member/stamps", input);
}

export async function truthListStamps(): Promise<{ stamps: unknown[] }> {
  return getJson("/api/member/stamps");
}

export async function truthRecordWitness(input: {
  gatheringId: string;
  subjectUserId: string;
  note?: string;
}): Promise<{ ok: boolean; error?: string }> {
  return postJson("/api/member/witnesses", input);
}

export async function truthSetMood(mood: DiscoveryMoodId | null): Promise<{ ok: boolean; error?: string }> {
  return postJson("/api/member/preferences", { discoveryMood: mood });
}

export async function truthRecordBehavior(
  signalType: string,
  payload: Record<string, unknown>
): Promise<{ ok: boolean; error?: string }> {
  return postJson("/api/member/behavior", { signalType, payload });
}

/** Run a write; throw if truthful mode and write failed. */
export async function requireTruthWrite<T extends { ok: boolean; error?: string }>(
  label: string,
  fn: () => Promise<T>
): Promise<T> {
  const result = await fn();
  if (result.ok) return result;
  if (isTruthfulMode() && !allowDemoFallback()) {
    throw new Error(result.error ?? `${label} could not be saved. Sign in and run migration 006.`);
  }
  return result;
}
