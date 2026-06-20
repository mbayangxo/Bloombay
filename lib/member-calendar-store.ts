/**
 * Girl Calendar — Supabase is source of truth (006). Local cache for instant UI.
 */

import { allowDemoFallback, isTruthfulMode } from "@/lib/truth/config";
import {
  truthAddCalendarPlan,
  truthListCalendar,
  truthRemoveCalendar,
  truthToggleCalendarReminder,
} from "@/lib/truth/client";

export type CalendarEntryKind = "happening" | "seat" | "partner" | "gem" | "solo";

export type CalendarEntry = {
  id: string;
  sourceId: string;
  title: string;
  when: string;
  place: string;
  href: string;
  kind: CalendarEntryKind;
  remind: boolean;
  addedAt: string;
};

const CACHE_KEY = "bb_girl_calendar_cache";

function canUse() {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

function readCache(): CalendarEntry[] {
  if (!canUse()) return [];
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw) as CalendarEntry[];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function writeCache(entries: CalendarEntry[]) {
  if (!canUse()) return;
  localStorage.setItem(CACHE_KEY, JSON.stringify(entries));
  window.dispatchEvent(new CustomEvent("bb-calendar-updated"));
}

export async function syncCalendarFromServer(): Promise<CalendarEntry[]> {
  try {
    const { plans } = await truthListCalendar();
    const rows = (plans as CalendarEntry[]) ?? [];
    writeCache(rows);
    return rows;
  } catch {
    return readCache();
  }
}

export function listCalendarEntries(): CalendarEntry[] {
  return readCache();
}

export function countCalendarEntries(): number {
  return readCache().length;
}

export function isOnCalendar(sourceId: string): boolean {
  return readCache().some((e) => e.sourceId === sourceId);
}

export async function addToGirlCalendar(
  input: Omit<CalendarEntry, "id" | "addedAt">
): Promise<CalendarEntry> {
  const result = await truthAddCalendarPlan({
    sourceId: input.sourceId,
    title: input.title,
    when: input.when,
    place: input.place,
    href: input.href,
    kind: input.kind,
    remind: input.remind,
  });

  if (!result.ok) {
    if (isTruthfulMode() && !allowDemoFallback()) {
      throw new Error(result.error ?? "Could not save to Girl Calendar");
    }
    const dup = readCache().find((e) => e.sourceId === input.sourceId);
    if (dup) return dup;
    const row: CalendarEntry = {
      ...input,
      id: `cal-cache-${input.sourceId}`,
      addedAt: new Date().toISOString(),
    };
    writeCache([row, ...readCache()]);
    return row;
  }

  const entry = result.entry as CalendarEntry | undefined;
  const row: CalendarEntry = entry ?? {
    ...input,
    id: `cal-${input.sourceId}`,
    addedAt: new Date().toISOString(),
  };
  const cache = readCache().filter((e) => e.sourceId !== input.sourceId);
  writeCache([row, ...cache]);
  return row;
}

export async function removeFromCalendar(id: string) {
  const result = await truthRemoveCalendar(id);
  if (!result.ok && isTruthfulMode() && !allowDemoFallback()) {
    throw new Error(result.error ?? "Could not remove plan");
  }
  writeCache(readCache().filter((e) => e.id !== id));
}

export async function toggleCalendarReminder(id: string, remind: boolean) {
  const result = await truthToggleCalendarReminder(id, remind);
  if (!result.ok && isTruthfulMode() && !allowDemoFallback()) {
    throw new Error(result.error ?? "Could not update reminder");
  }
  writeCache(readCache().map((e) => (e.id === id ? { ...e, remind } : e)));
}

export function connectShareHref(title: string, when: string, href: string): string {
  const note = encodeURIComponent(`Want to go to ${title} (${when})?`);
  return `/member/intros?share=${note}&plan=${encodeURIComponent(href)}`;
}
