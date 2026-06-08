/** Member mailbox — Supabase-backed inbox with local cache for badges. */

const UNREAD_CACHE_KEY = "bb_mailbox_unread_count";

export type MailboxItem = {
  id: string;
  from: string;
  subject: string;
  body?: string;
  type: "invitation" | "ping" | "message" | "welcome";
  unread: boolean;
  href: string;
  createdAt?: string;
};

export function cacheMailboxUnreadCount(count: number) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(UNREAD_CACHE_KEY, String(count));
  window.dispatchEvent(new Event("bb-member-mail-updated"));
}

export function readMailboxUnreadCount(): number {
  if (typeof window === "undefined") return 0;
  const raw = sessionStorage.getItem(UNREAD_CACHE_KEY);
  if (!raw) return 0;
  const n = Number(raw);
  return Number.isFinite(n) ? n : 0;
}

export async function syncMailboxFromServer(): Promise<{
  messages: MailboxItem[];
  unreadCount: number;
}> {
  const res = await fetch("/api/member/mailbox");
  if (!res.ok) {
    return { messages: [], unreadCount: readMailboxUnreadCount() };
  }
  const json = (await res.json()) as { messages?: MailboxItem[]; unreadCount?: number };
  const messages = json.messages ?? [];
  const unreadCount = json.unreadCount ?? messages.filter((m) => m.unread).length;
  cacheMailboxUnreadCount(unreadCount);
  return { messages, unreadCount };
}

export async function markAllMailboxRead() {
  await fetch("/api/member/mailbox", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ markAllRead: true }),
  });
  cacheMailboxUnreadCount(0);
}
