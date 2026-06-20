/**
 * Dedicated planner room per club — private planning before publish.
 */

import {
  getEvent,
  saveEvent,
  type BloomBayEvent,
  type EventKind,
  type EventVisibility,
} from "@/lib/bloombay-events-store";
import { listPlannerRooms, savePlannerRoom, type PlannerRoom } from "@/lib/club-operations-store";

export type EventPlanDraft = {
  id: string;
  clubId: string;
  roomId: string;
  title: string;
  notes: string;
  concept?: string;
  month?: string;
  season?: string;
  category?: string;
  coverUrl?: string;
  visibility: EventVisibility;
  plannedStartAt?: string;
  ticket: number;
  deposit: number;
  status: "idea" | "draft" | "published";
  linkedEventId?: string;
  createdAt: string;
  updatedAt: string;
};

const PLANS_KEY = "bb_club_event_plans";
const ROOM_META_KEY = "bb_club_planner_meta";

export type PlannerRoomMeta = {
  clubId: string;
  roomId: string;
  privateNotes: string;
  updatedAt: string;
};

function canUseStorage() {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function readJson<T>(key: string, fallback: T): T {
  if (!canUseStorage()) return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, data: unknown) {
  if (!canUseStorage()) return;
  localStorage.setItem(key, JSON.stringify(data));
  window.dispatchEvent(new CustomEvent("bb-planner-updated"));
}

/** Every club gets one default private planner room. */
export function ensureClubPlannerRoom(clubId: string): PlannerRoom {
  const rooms = listPlannerRooms(clubId);
  const existing = rooms.find((r) => r.name.includes("Planner room") || r.id.includes("planner-main"));
  if (existing) return existing;
  return savePlannerRoom({
    clubId,
    name: `${clubId} · Planner room`,
    eventLabel: "Private planning workspace",
    tasks: [],
  });
}

export function getPlannerRoomMeta(clubId: string, roomId: string): PlannerRoomMeta {
  const all = readJson<PlannerRoomMeta[]>(ROOM_META_KEY, []);
  return (
    all.find((m) => m.clubId === clubId && m.roomId === roomId) ?? {
      clubId,
      roomId,
      privateNotes: "",
      updatedAt: new Date().toISOString(),
    }
  );
}

export function savePlannerRoomMeta(clubId: string, roomId: string, privateNotes: string) {
  const all = readJson<PlannerRoomMeta[]>(ROOM_META_KEY, []);
  const idx = all.findIndex((m) => m.clubId === clubId && m.roomId === roomId);
  const row: PlannerRoomMeta = {
    clubId,
    roomId,
    privateNotes,
    updatedAt: new Date().toISOString(),
  };
  if (idx >= 0) all[idx] = row;
  else all.push(row);
  writeJson(ROOM_META_KEY, all);
}

export function listEventPlans(clubId: string, roomId?: string): EventPlanDraft[] {
  let list = readJson<EventPlanDraft[]>(PLANS_KEY, []).filter((p) => p.clubId === clubId);
  if (roomId) list = list.filter((p) => p.roomId === roomId);
  return list.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function listPlansByMonth(clubId: string, month: string) {
  return listEventPlans(clubId).filter((p) => p.month === month || p.plannedStartAt?.startsWith(month));
}

export function saveEventPlan(
  input: Omit<EventPlanDraft, "id" | "createdAt" | "updatedAt"> & { id?: string }
): EventPlanDraft {
  const all = readJson<EventPlanDraft[]>(PLANS_KEY, []);
  const now = new Date().toISOString();
  if (input.id) {
    const idx = all.findIndex((p) => p.id === input.id);
    if (idx >= 0) {
      all[idx] = { ...all[idx], ...input, id: input.id, updatedAt: now };
      writeJson(PLANS_KEY, all);
      return all[idx];
    }
  }
  const row: EventPlanDraft = {
    ...input,
    id: uid(),
    status: input.status ?? "idea",
    createdAt: now,
    updatedAt: now,
  };
  all.unshift(row);
  writeJson(PLANS_KEY, all);
  return row;
}

export function convertPlanToOfficialEvent(
  planId: string,
  opts?: { publish?: boolean; kind?: EventKind }
): BloomBayEvent | null {
  const all = readJson<EventPlanDraft[]>(PLANS_KEY, []);
  const plan = all.find((p) => p.id === planId);
  if (!plan) return null;

  const startAt =
    plan.plannedStartAt ??
    new Date(Date.now() + 86400000 * 30).toISOString();

  const ev = saveEvent({
    id: plan.linkedEventId,
    kind: opts?.kind ?? "regular",
    title: plan.title,
    subtitle: plan.notes.slice(0, 120),
    startAt,
    venue: "TBD",
    neighborhood: "TBD",
    coverUrl: plan.coverUrl ?? "",
    visibility: plan.visibility,
    clubId: plan.visibility === "club" ? plan.clubId : plan.visibility === "all" ? null : plan.clubId,
    status: opts?.publish ? "live" : "draft",
    capacity: 40,
    rsvpCount: 0,
    ratingAvg: 0,
    ratingCount: 0,
    chemistry: 90,
    ticket: plan.ticket,
    deposit: plan.deposit,
    plannerPlanId: plan.id,
  });

  const idx = all.findIndex((p) => p.id === planId);
  if (idx >= 0) {
    all[idx] = {
      ...all[idx],
      status: opts?.publish ? "published" : "draft",
      linkedEventId: ev.id,
      updatedAt: new Date().toISOString(),
    };
    writeJson(PLANS_KEY, all);
  }
  return ev;
}

export function getPlan(planId: string): EventPlanDraft | undefined {
  return readJson<EventPlanDraft[]>(PLANS_KEY, []).find((p) => p.id === planId);
}
