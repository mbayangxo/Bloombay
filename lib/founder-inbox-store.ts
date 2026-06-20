/**
 * Founder inbox — message members, clubs, partners, curators, and club posts.
 */

import { INBOX_THREADS } from "@/lib/mission-control-data";

export type FounderInboxCategory =
  | "Member"
  | "Club"
  | "Partner"
  | "Curator"
  | "Moderator"
  | "Verification"
  | "Safety"
  | "Club post";

export type FounderPortalTarget =
  | "member"
  | "club-owner"
  | "partner"
  | "curator"
  | "admin";

export type FounderInboxMessage = {
  id: string;
  from: "founder" | "them";
  body: string;
  at: string;
};

export type FounderInboxThread = {
  id: string;
  name: string;
  category: FounderInboxCategory;
  portal: FounderPortalTarget;
  targetHref?: string;
  date: string;
  priority: "high" | "medium" | "low";
  status: "unread" | "open" | "resolved";
  preview: string;
  messages: FounderInboxMessage[];
};

const KEY = "bb_founder_inbox";

function seedMessages(preview: string): FounderInboxMessage[] {
  return [
    {
      id: "m0",
      from: "them",
      body: preview,
      at: new Date().toISOString(),
    },
  ];
}

function portalForCategory(cat: string): FounderPortalTarget {
  if (cat === "Club" || cat === "Club post") return "club-owner";
  if (cat === "Partner") return "partner";
  if (cat === "Curator" || cat === "Moderator") return "curator";
  return "member";
}

function hrefForThread(id: string, cat: string, name: string): string | undefined {
  if (cat === "Club" && name.includes("Rose")) return "/club-owner/dashboard";
  if (cat === "Member") return "/member/mailbox";
  if (cat === "Partner") return "/partner/messages";
  if (cat === "Curator") return "/curator/dashboard";
  if (cat === "Safety") return "/founder/safety";
  return undefined;
}

function seedThreads(): FounderInboxThread[] {
  return INBOX_THREADS.map((t) => ({
    id: t.id,
    name: t.name,
    category: t.category as FounderInboxCategory,
    portal: portalForCategory(t.category),
    targetHref: hrefForThread(t.id, t.category, t.name),
    date: t.date,
    priority: t.priority as FounderInboxThread["priority"],
    status: t.status as FounderInboxThread["status"],
    preview: t.preview,
    messages: seedMessages(t.preview),
  }));
}

function read(): FounderInboxThread[] {
  if (typeof window === "undefined") return seedThreads();
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return seedThreads();
    const parsed = JSON.parse(raw) as FounderInboxThread[];
    return parsed.length ? parsed : seedThreads();
  } catch {
    return seedThreads();
  }
}

function write(threads: FounderInboxThread[]) {
  if (typeof window !== "undefined") localStorage.setItem(KEY, JSON.stringify(threads));
}

export function listFounderInboxThreads(): FounderInboxThread[] {
  return read();
}

export function getFounderThread(id: string): FounderInboxThread | undefined {
  return read().find((t) => t.id === id);
}

const MEMBER_BRIDGE_KEY = "bb_member_founder_messages";

function pushToMemberMailbox(name: string, body: string) {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(MEMBER_BRIDGE_KEY);
    const list = raw ? (JSON.parse(raw) as { from: string; subject: string; at: string }[]) : [];
    list.unshift({
      from: "BloomBay",
      subject: `From founder · ${name}: ${body.slice(0, 60)}`,
      at: new Date().toISOString(),
    });
    localStorage.setItem(MEMBER_BRIDGE_KEY, JSON.stringify(list.slice(0, 20)));
    window.dispatchEvent(new Event("bb-member-mail-updated"));
  } catch {
    /* ignore */
  }
}

export function listMemberFounderMessages(): { from: string; subject: string; at: string }[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(MEMBER_BRIDGE_KEY) ?? "[]") as {
      from: string;
      subject: string;
      at: string;
    }[];
  } catch {
    return [];
  }
}

export function replyToFounderThread(threadId: string, body: string) {
  const all = read();
  const idx = all.findIndex((t) => t.id === threadId);
  if (idx < 0) return;
  const msg: FounderInboxMessage = {
    id: `m-${Date.now()}`,
    from: "founder",
    body: body.trim(),
    at: new Date().toISOString(),
  };
  all[idx] = {
    ...all[idx],
    status: "open",
    preview: body.trim().slice(0, 80),
    messages: [...all[idx].messages, msg],
  };
  write(all);
  const t = all[idx];
  if (t.category === "Member" || t.category === "Club" || t.category === "Club post") {
    pushToMemberMailbox(t.name, body);
  }
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("bb-founder-inbox-updated"));
  }
}

export function resolveFounderThread(threadId: string) {
  const all = read();
  const idx = all.findIndex((t) => t.id === threadId);
  if (idx < 0) return;
  all[idx] = { ...all[idx], status: "resolved" };
  write(all);
  window.dispatchEvent?.(new Event("bb-founder-inbox-updated"));
}

export function composeFounderThread(input: {
  name: string;
  category: FounderInboxCategory;
  body: string;
  portal?: FounderPortalTarget;
}) {
  const all = read();
  const id = `fi-${Date.now()}`;
  const thread: FounderInboxThread = {
    id,
    name: input.name,
    category: input.category,
    portal: input.portal ?? portalForCategory(input.category),
    date: "Just now",
    priority: "medium",
    status: "open",
    preview: input.body.slice(0, 80),
    messages: [
      {
        id: `${id}-m1`,
        from: "founder",
        body: input.body.trim(),
        at: new Date().toISOString(),
      },
    ],
  };
  all.unshift(thread);
  write(all);
  if (input.category === "Member" || input.category === "Club" || input.category === "Club post") {
    pushToMemberMailbox(input.name, input.body);
  }
  window.dispatchEvent?.(new Event("bb-founder-inbox-updated"));
  return thread;
}
