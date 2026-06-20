import { readMailboxUnreadCount } from "@/lib/member-mailbox";

/** Unread counts for member header badges (prototype). */

const READ_KEY = "bb_notif_read_ids";

function readIds(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(READ_KEY);
    return new Set(raw ? (JSON.parse(raw) as string[]) : []);
  } catch {
    return new Set();
  }
}

export function markNotificationRead(id: string) {
  const set = readIds();
  set.add(id);
  localStorage.setItem(READ_KEY, JSON.stringify([...set]));
}

export function countUnreadNotifications(): number {
  if (typeof window === "undefined") return 2;
  const read = readIds();
  const base = ["n-happening-1", "n-bloom-1", "n-invite-1"].filter((id) => !read.has(id));
  let pings = 0;
  try {
    const raw = localStorage.getItem("bb_member_pings");
    if (raw) {
      const arr = JSON.parse(raw) as unknown[];
      pings = Array.isArray(arr) ? arr.length : 0;
    }
  } catch {
    /* ignore */
  }
  return base.length + Math.min(pings, 3);
}

export function countUnreadMailbox(): number {
  if (typeof window === "undefined") return 0;
  let n = readMailboxUnreadCount();
  try {
    const raw = localStorage.getItem("bb_member_pings");
    if (raw) {
      const arr = JSON.parse(raw) as unknown[];
      n += Array.isArray(arr) ? arr.length : 0;
    }
  } catch {
    /* ignore */
  }
  return n;
}

export function markMailboxRead() {
  if (typeof window === "undefined") return;
  localStorage.setItem("bb_mail_read_inv1", "1");
}
