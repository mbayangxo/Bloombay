/**
 * Gathering RSVPs saved to Plans (local cache + server reserve for "going").
 */

import type { DbGathering } from "@/lib/happenings/gathering-to-poster";

export type GatheringCommitment = "going" | "debating";

export type GatheringPlan = {
  id: string;
  gatheringId: string;
  slug: string;
  title: string;
  when: string;
  place: string;
  commitment: GatheringCommitment;
  createdAt: string;
  planRoomHref: string;
  ticketHref: string;
  chatHref: string;
};

const KEY = "bb_gathering_plans";

function canUseStorage() {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

function read(): GatheringPlan[] {
  if (!canUseStorage()) return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as GatheringPlan[]) : [];
  } catch {
    return [];
  }
}

function write(rows: GatheringPlan[]) {
  if (!canUseStorage()) return;
  localStorage.setItem(KEY, JSON.stringify(rows));
  window.dispatchEvent(new CustomEvent("bb-gathering-plans-updated"));
}

function formatWhen(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function gatheringPlanFromDb(
  g: DbGathering,
  commitment: GatheringCommitment
): GatheringPlan {
  const place = [g.venue, g.neighborhood ?? g.area].filter(Boolean).join(" · ") || "NYC";
  return {
    id: `gp-${g.id}`,
    gatheringId: g.id,
    slug: g.slug,
    title: g.title,
    when: formatWhen(g.starts_at),
    place,
    commitment,
    createdAt: new Date().toISOString(),
    planRoomHref: `/member/plan/${g.slug}`,
    ticketHref: `/member/plans?ticket=${g.slug}`,
    chatHref: `/member/messages?plan=${g.slug}`,
  };
}

export function saveGatheringPlan(plan: GatheringPlan) {
  const all = read().filter((p) => p.gatheringId !== plan.gatheringId);
  all.unshift(plan);
  write(all);
}

export function listGatheringPlans(): GatheringPlan[] {
  return read().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function getGatheringPlan(gatheringId: string): GatheringPlan | undefined {
  return read().find((p) => p.gatheringId === gatheringId);
}

export function hasPlanRoomAccess(gatheringId: string): boolean {
  const p = getGatheringPlan(gatheringId);
  return p?.commitment === "going";
}
