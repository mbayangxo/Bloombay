/** Personal day notes + images on Girl Calendar (local prototype). */

export type CalendarJournalEntry = {
  date: string; // YYYY-MM-DD
  note: string;
  imageUrl: string;
  updatedAt: string;
};

const KEY = "bb_calendar_journal";

function canUse() {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

function readAll(): Record<string, CalendarJournalEntry> {
  if (!canUse()) return {};
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, CalendarJournalEntry>;
  } catch {
    return {};
  }
}

function writeAll(map: Record<string, CalendarJournalEntry>) {
  if (!canUse()) return;
  localStorage.setItem(KEY, JSON.stringify(map));
  window.dispatchEvent(new CustomEvent("bb-calendar-journal-updated"));
}

export function getCalendarJournal(date: string): CalendarJournalEntry | null {
  return readAll()[date] ?? null;
}

export function saveCalendarJournal(
  date: string,
  patch: { note?: string; imageUrl?: string }
): CalendarJournalEntry {
  const map = readAll();
  const prev = map[date];
  const row: CalendarJournalEntry = {
    date,
    note: patch.note ?? prev?.note ?? "",
    imageUrl: patch.imageUrl ?? prev?.imageUrl ?? "",
    updatedAt: new Date().toISOString(),
  };
  map[date] = row;
  writeAll(map);
  return row;
}
