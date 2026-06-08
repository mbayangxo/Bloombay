/** Host review warnings — prototype localStorage until DB. */

export type HostReviewRecord = {
  hostId: string;
  hostName: string;
  badReviewCount: number;
  warnings: number;
  archivedUntil?: string;
  note?: string;
};

const KEY = "bb_host_reviews";

function read(): HostReviewRecord[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]") as HostReviewRecord[];
  } catch {
    return [];
  }
}

function write(rows: HostReviewRecord[]) {
  if (typeof window !== "undefined") localStorage.setItem(KEY, JSON.stringify(rows));
}

export function recordBadHostReview(hostId: string, hostName: string): HostReviewRecord {
  const all = read();
  let row = all.find((r) => r.hostId === hostId);
  if (!row) {
    row = { hostId, hostName, badReviewCount: 0, warnings: 0 };
    all.push(row);
  }
  row.badReviewCount += 1;
  if (row.badReviewCount >= 3 && row.warnings < 2) {
    row.warnings += 1;
    row.note = `Warning ${row.warnings}: address quality with ${hostName}.`;
  } else if (row.warnings >= 2 && row.badReviewCount >= 5) {
    const until = new Date();
    until.setMonth(until.getMonth() + 2);
    row.archivedUntil = until.toISOString();
    row.note = `Soft-archived until ${until.toLocaleDateString()}. We emailed the host.`;
  }
  write(all);
  return row;
}

export function listHostReviewRecords(): HostReviewRecord[] {
  return read();
}
