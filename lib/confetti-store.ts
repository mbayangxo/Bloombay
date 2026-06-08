/**
 * Confetti responses — accept (join her) or wish (celebrate from afar).
 */

export type ConfettiResponse = "accepted" | "wished";

export type ConfettiResponseRow = {
  confettiId: string;
  response: ConfettiResponse;
  wishText?: string;
  updatedAt: string;
};

const KEY = "bb_confetti_responses";

function canUseStorage() {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

function readAll(): ConfettiResponseRow[] {
  if (!canUseStorage()) return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    return JSON.parse(raw) as ConfettiResponseRow[];
  } catch {
    return [];
  }
}

function writeAll(rows: ConfettiResponseRow[]) {
  if (!canUseStorage()) return;
  localStorage.setItem(KEY, JSON.stringify(rows));
  window.dispatchEvent(new CustomEvent("bb-confetti-updated"));
}

export function getConfettiResponse(confettiId: string): ConfettiResponseRow | undefined {
  return readAll().find((r) => r.confettiId === confettiId);
}

export function acceptConfetti(confettiId: string) {
  const all = readAll().filter((r) => r.confettiId !== confettiId);
  all.push({
    confettiId,
    response: "accepted",
    updatedAt: new Date().toISOString(),
  });
  writeAll(all);
}

export function wishConfetti(confettiId: string, wishText: string) {
  const all = readAll().filter((r) => r.confettiId !== confettiId);
  all.push({
    confettiId,
    response: "wished",
    wishText,
    updatedAt: new Date().toISOString(),
  });
  writeAll(all);
}
