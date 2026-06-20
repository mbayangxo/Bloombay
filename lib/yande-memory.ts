/**
 * Yande memory — preferences learned from real behavior (not a chatbot).
 * Persists via Supabase when truthful mode is on; local cache for instant UI.
 */

import { isTruthfulMode } from "@/lib/truth/config";

export type YandeMemory = {
  prefersBrunch: boolean;
  declinesNightlife: boolean;
  dinnerCount: number;
  lastUpdated: string;
};

const KEY = "bb_yande_memory";

const DEFAULT: YandeMemory = {
  prefersBrunch: false,
  declinesNightlife: false,
  dinnerCount: 0,
  lastUpdated: new Date().toISOString(),
};

export function readYandeMemory(): YandeMemory {
  if (typeof window === "undefined") return DEFAULT;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULT;
    return { ...DEFAULT, ...(JSON.parse(raw) as YandeMemory) };
  } catch {
    return DEFAULT;
  }
}

export function writeYandeMemory(patch: Partial<YandeMemory>) {
  if (typeof window === "undefined") return;
  const next = { ...readYandeMemory(), ...patch, lastUpdated: new Date().toISOString() };
  localStorage.setItem(KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent("bb-yande-memory-updated"));
}

/** Record attendance pattern for recommendations. */
export function yandeRecordDinnerAttended() {
  const m = readYandeMemory();
  writeYandeMemory({ dinnerCount: m.dinnerCount + 1 });
  if (isTruthfulMode()) {
    void fetch("/api/yande/memory", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dinnerCount: m.dinnerCount + 1 }),
    }).catch(() => {});
  }
}

export function yandeLineFromMemory(): string | null {
  const m = readYandeMemory();
  if (m.dinnerCount >= 5 && m.declinesNightlife) {
    return "You've been to five dinners — I'll keep brunches and tables, not late nightlife.";
  }
  if (m.prefersBrunch) return "You lean brunch — I'll surface morning tables first.";
  return null;
}
