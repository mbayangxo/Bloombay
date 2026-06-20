/** Founder QA Lab — session notes (local + optional server sync) */

import type { SmokeResult } from "@/lib/founder-qa-engine";

export type QaSessionEntry = {
  id: string;
  createdAt: string;
  viewport: string;
  route: string;
  question: string;
  report: string;
  cursorPrompt: string;
  smoke?: SmokeResult[];
};

const KEY = "bb_founder_qa_sessions";

function canUse() {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

export function listQaSessions(): QaSessionEntry[] {
  if (!canUse()) return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw) as QaSessionEntry[];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

export function saveQaSession(entry: Omit<QaSessionEntry, "id" | "createdAt">): QaSessionEntry {
  const full: QaSessionEntry = {
    ...entry,
    id: `qa-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  if (canUse()) {
    const prev = listQaSessions();
    localStorage.setItem(KEY, JSON.stringify([full, ...prev].slice(0, 40)));
    window.dispatchEvent(new CustomEvent("bb-founder-qa-updated"));
  }
  return full;
}

export function clearQaSessions() {
  if (!canUse()) return;
  localStorage.removeItem(KEY);
  window.dispatchEvent(new CustomEvent("bb-founder-qa-updated"));
}
