/**
 * BloomBay events — founder HQ, regular city events, club-scoped happenings.
 * Persists in localStorage; dispatches bb-events-updated for member happenings sync.
 */

import { CLUBS } from "@/app/member/clubs/club-data";
import { GATHERINGS } from "@/lib/member-portal-data";
import { publishGatheringFromEvent } from "@/lib/gatherings-sync";

export type EventKind = "current" | "regular" | "hq" | "blueday";
/** all = public platform-wide · group = selected group · club = members of one club */
export type EventVisibility = "all" | "group" | "club";
export type EventStatus = "draft" | "live" | "cancelled";

export type BloomBayEvent = {
  id: string;
  kind: EventKind;
  title: string;
  subtitle: string;
  startAt: string;
  endAt?: string;
  venue: string;
  neighborhood: string;
  coverUrl: string;
  visibility: EventVisibility;
  clubId: string | null;
  status: EventStatus;
  capacity: number;
  rsvpCount: number;
  ratingAvg: number;
  ratingCount: number;
  chemistry: number;
  ticket: number;
  deposit: number;
  qrCode?: string;
  checkInCount?: number;
  groupLabel?: string;
  plannerPlanId?: string;
  cancelledAt?: string;
  announcementSentAt?: string;
  createdAt: string;
  updatedAt: string;
};

export type ClubMonthlyPlan = {
  clubId: string;
  month: string;
  managerName: string;
  overview: string;
  themes: string;
  weeklyRhythm: string;
  goals: string;
  updatedAt: string;
};

export type ClubEventIdea = {
  id: string;
  clubId: string;
  title: string;
  notes: string;
  season?: string;
  createdAt: string;
};

export type ClubPortalBranding = {
  clubId: string;
  bannerUrl: string;
  logoUrl: string;
  tagline: string;
  landingHeadline: string;
  landingSubcopy: string;
  welcomeMessage: string;
  updatedAt: string;
};

const EVENTS_KEY = "bb_bloombay_events";
const PLANS_KEY = "bb_club_monthly_plans";
const IDEAS_KEY = "bb_club_event_ideas";
const BRANDING_KEY = "bb_club_portal_branding";

export const EVENT_KIND_META: Record<
  EventKind,
  { title: string; kicker: string; blurb: string; icon: string }
> = {
  current: {
    kicker: "Now",
    title: "Current events",
    blurb: "Live and happening this week — push to Happenings when ready.",
    icon: "◎",
  },
  regular: {
    kicker: "City",
    title: "Regular events",
    blurb: "Recurring gatherings open to all women on BloomBay.",
    icon: "✦",
  },
  hq: {
    kicker: "HQ",
    title: "BloomBay HQ events",
    blurb: "Flagship experiences run by the BloomBay team.",
    icon: "♛",
  },
  blueday: {
    kicker: "Blue Day",
    title: "Blue Day events",
    blurb: "App-wide gatherings open to every member — free or paid, RSVP & QR check-in.",
    icon: "💙",
  },
};

export const VISIBILITY_LABELS: Record<EventVisibility, string> = {
  all: "Public — all BloomBay members",
  group: "Group — selected audience",
  club: "Private — club members only",
};

function canUseStorage() {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

function uid() {
  return `ev-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
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
}

export function notifyEventsUpdated() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("bb-events-updated"));
}

function seedEvents(): BloomBayEvent[] {
  const now = new Date();
  const inDays = (d: number) => {
    const x = new Date(now);
    x.setDate(x.getDate() + d);
    x.setHours(19, 0, 0, 0);
    return x.toISOString();
  };

  const mapped: BloomBayEvent[] = GATHERINGS.map((g, i) => ({
    id: g.id,
    kind: (i === 0 ? "current" : "regular") as EventKind,
    title: g.title,
    subtitle: g.subtitle,
    startAt: inDays(i + 2),
    venue: g.venue,
    neighborhood: g.neighborhood,
    coverUrl: "",
    visibility: "all" as EventVisibility,
    clubId: i === 1 ? "the-page-turners" : null,
    status: "live" as EventStatus,
    capacity: 24,
    rsvpCount: g.attendees.length + g.extra,
    ratingAvg: 4.6 + i * 0.1,
    ratingCount: 12 + i * 4,
    chemistry: g.chemistry,
    ticket: g.ticket,
    deposit: g.deposit,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  }));
  mapped.push({
    id: "blueday-welcome",
    kind: "blueday",
    title: "Blue Day · City Welcome Brunch",
    subtitle: "Open to all members — no club required",
    startAt: inDays(14),
    venue: "The Garden Room",
    neighborhood: "SoHo",
    coverUrl: "",
    visibility: "all",
    clubId: null,
    status: "live",
    capacity: 80,
    rsvpCount: 42,
    ratingAvg: 4.9,
    ratingCount: 8,
    chemistry: 94,
    ticket: 0,
    deposit: 0,
    qrCode: "BB-BLUEDAY-WELCOME",
    checkInCount: 0,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  });
  mapped.push({
    id: "hq-flagship",
    kind: "hq",
    title: "BloomBay HQ · Founders Supper",
    subtitle: "Flagship table run by the BloomBay team",
    startAt: inDays(10),
    venue: "The Rose Room",
    neighborhood: "West Village",
    coverUrl: "",
    visibility: "all",
    clubId: null,
    status: "live",
    capacity: 40,
    rsvpCount: 18,
    ratingAvg: 4.9,
    ratingCount: 22,
    chemistry: 96,
    ticket: 85,
    deposit: 25,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  });
  return mapped;
}

export function listAllEvents(): BloomBayEvent[] {
  const stored = readJson<BloomBayEvent[] | null>(EVENTS_KEY, null);
  if (stored?.length) return stored;
  const seed = seedEvents();
  writeJson(EVENTS_KEY, seed);
  return seed;
}

export function listEventsByKind(kind: EventKind): BloomBayEvent[] {
  return listAllEvents().filter((e) => e.kind === kind);
}

export function listBlueDayEvents(): BloomBayEvent[] {
  return listEventsByKind("blueday");
}

export function listEventsForClub(clubId: string): BloomBayEvent[] {
  return listAllEvents().filter((e) => e.clubId === clubId);
}

export function listLiveEventsForMember(memberClubIds: string[] = []): BloomBayEvent[] {
  return listAllEvents().filter((e) => {
    if (e.status !== "live") return false;
    if (e.kind === "blueday") return true;
    if (e.visibility === "all") return true;
    if (e.visibility === "group") return true;
    if (e.visibility === "club" && e.clubId && memberClubIds.includes(e.clubId)) return true;
    return false;
  });
}

export function getEvent(id: string): BloomBayEvent | undefined {
  return listAllEvents().find((e) => e.id === id);
}

export function saveEvent(
  input: Omit<BloomBayEvent, "id" | "createdAt" | "updatedAt"> & { id?: string }
): BloomBayEvent {
  const all = listAllEvents();
  const now = new Date().toISOString();
  if (input.id) {
    const idx = all.findIndex((e) => e.id === input.id);
    const prev = all[idx];
    const next: BloomBayEvent = {
      ...prev,
      ...input,
      id: input.id,
      updatedAt: now,
    };
    if (idx >= 0) all[idx] = next;
    else all.unshift(next);
    writeJson(EVENTS_KEY, all);
    notifyEventsUpdated();
    if (typeof window !== "undefined" && next.status === "live") {
      void publishGatheringFromEvent(next);
    }
    return next;
  }
  const row: BloomBayEvent = {
    ...input,
    id: uid(),
    rsvpCount: input.rsvpCount ?? 0,
    ratingAvg: input.ratingAvg ?? 0,
    ratingCount: input.ratingCount ?? 0,
    chemistry: input.chemistry ?? 90,
    createdAt: now,
    updatedAt: now,
  };
  all.unshift(row);
  writeJson(EVENTS_KEY, all);
  notifyEventsUpdated();
  if (typeof window !== "undefined" && row.status === "live") {
    void publishGatheringFromEvent(row);
  }
  return row;
}

export function deleteEvent(id: string) {
  const all = listAllEvents().filter((e) => e.id !== id);
  writeJson(EVENTS_KEY, all);
  notifyEventsUpdated();
}

export function setEventStatus(id: string, status: EventStatus) {
  const ev = getEvent(id);
  if (!ev) return;
  const patch: Partial<BloomBayEvent> = { status };
  if (status === "cancelled") patch.cancelledAt = new Date().toISOString();
  saveEvent({ ...ev, ...patch });
}

export function cancelEvent(id: string) {
  setEventStatus(id, "cancelled");
}

export function publishEvent(id: string, sendAnnouncement = false) {
  const ev = getEvent(id);
  if (!ev) return;
  saveEvent({
    ...ev,
    status: "live",
    announcementSentAt: sendAnnouncement ? new Date().toISOString() : ev.announcementSentAt,
  });
}

export function listEventsForClubByMonth(clubId: string, month: string): BloomBayEvent[] {
  return listEventsForClub(clubId).filter((e) => e.startAt.startsWith(month));
}

export function listEventsInMonth(month: string, clubId?: string): BloomBayEvent[] {
  let list = listAllEvents().filter((e) => e.startAt.startsWith(month));
  if (clubId) list = list.filter((e) => e.clubId === clubId);
  return list;
}

export function listClubsForPortal() {
  return CLUBS.map((c) => ({
    id: c.id,
    name: c.name,
    tagline: c.tagline,
    category: c.category,
    members: c.members,
    gradient: c.gradient,
  }));
}

export function getClubBranding(clubId: string): ClubPortalBranding {
  const all = readJson<ClubPortalBranding[]>(BRANDING_KEY, []);
  const found = all.find((b) => b.clubId === clubId);
  const club = CLUBS.find((c) => c.id === clubId);
  if (found) return found;
  return {
    clubId,
    bannerUrl: "",
    logoUrl: "",
    tagline: club?.tagline ?? "",
    landingHeadline: club?.name ?? "",
    landingSubcopy: club?.description ?? "",
    welcomeMessage: club?.welcomeMessage ?? "",
    updatedAt: new Date().toISOString(),
  };
}

export function saveClubBranding(clubId: string, patch: Partial<ClubPortalBranding>) {
  const all = readJson<ClubPortalBranding[]>(BRANDING_KEY, []);
  const prev = getClubBranding(clubId);
  const next = { ...prev, ...patch, clubId, updatedAt: new Date().toISOString() };
  const idx = all.findIndex((b) => b.clubId === clubId);
  if (idx >= 0) all[idx] = next;
  else all.push(next);
  writeJson(BRANDING_KEY, all);
  notifyEventsUpdated();
}

export function listMonthlyPlans(clubId: string): ClubMonthlyPlan[] {
  return readJson<ClubMonthlyPlan[]>(PLANS_KEY, []).filter((p) => p.clubId === clubId);
}

export function saveMonthlyPlan(
  clubId: string,
  month: string,
  patch: Partial<Omit<ClubMonthlyPlan, "clubId" | "month">>
) {
  const all = readJson<ClubMonthlyPlan[]>(PLANS_KEY, []);
  const idx = all.findIndex((p) => p.clubId === clubId && p.month === month);
  const row: ClubMonthlyPlan = {
    clubId,
    month,
    managerName: patch.managerName ?? "",
    overview: patch.overview ?? "",
    themes: patch.themes ?? "",
    weeklyRhythm: patch.weeklyRhythm ?? "",
    goals: patch.goals ?? "",
    updatedAt: new Date().toISOString(),
    ...(idx >= 0 ? all[idx] : {}),
    ...patch,
  };
  if (idx >= 0) all[idx] = row;
  else all.push(row);
  writeJson(PLANS_KEY, all);
}

export function listEventIdeas(clubId: string): ClubEventIdea[] {
  return readJson<ClubEventIdea[]>(IDEAS_KEY, [])
    .filter((i) => i.clubId === clubId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function addEventIdea(clubId: string, title: string, notes: string, season?: string) {
  const all = readJson<ClubEventIdea[]>(IDEAS_KEY, []);
  const row: ClubEventIdea = {
    id: uid(),
    clubId,
    title,
    notes,
    season,
    createdAt: new Date().toISOString(),
  };
  all.unshift(row);
  writeJson(IDEAS_KEY, all);
  return row;
}

export function removeEventIdea(id: string) {
  writeJson(
    IDEAS_KEY,
    readJson<ClubEventIdea[]>(IDEAS_KEY, []).filter((i) => i.id !== id)
  );
}

export type ClubEventAnalytics = {
  clubId: string;
  liveEvents: number;
  draftEvents: number;
  totalRsvps: number;
  avgRating: number;
  ratingCount: number;
  memberCount: number;
};

export function getClubAnalytics(clubId: string): ClubEventAnalytics {
  const club = CLUBS.find((c) => c.id === clubId);
  const events = listEventsForClub(clubId);
  const live = events.filter((e) => e.status === "live");
  const rated = events.filter((e) => e.ratingCount > 0);
  const avgRating =
    rated.length > 0
      ? rated.reduce((s, e) => s + e.ratingAvg, 0) / rated.length
      : 0;
  return {
    clubId,
    liveEvents: live.length,
    draftEvents: events.filter((e) => e.status === "draft").length,
    totalRsvps: events.reduce((s, e) => s + e.rsvpCount, 0),
    avgRating: Math.round(avgRating * 10) / 10,
    ratingCount: rated.reduce((s, e) => s + e.ratingCount, 0),
    memberCount: club?.members ?? 0,
  };
}

export function formatEventDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function monthKey(d = new Date()): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}
