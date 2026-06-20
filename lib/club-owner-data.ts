/**
 * Club owner portal — demo analytics, moderators, zone requests (localStorage).
 */

import { getHostClubId } from "@/lib/club-host-store";
import { getClubProfile } from "@/lib/club-world-data";

export type ZoneRequestStatus = "pending" | "approved" | "denied";

export type ZoneRequest = {
  id: string;
  clubId: string;
  zoneName: string;
  requestedBy: string;
  reason: string;
  status: ZoneRequestStatus;
  submittedAt: string;
  decidedAt?: string;
};

export type ClubModerator = {
  id: string;
  clubId: string;
  name: string;
  handle: string;
  role: "moderator" | "admin" | "co_host";
  permissions: ("applications" | "zones" | "gatherings" | "scan" | "ping")[];
};

export type ClubAnalyticsSnapshot = {
  healthScore: number;
  healthLabel: string;
  activeDaily: number;
  activeWeekly: number;
  activeMonthly: number;
  membersTotal: number;
  membersNewWeek: number;
  membersBlocked: number;
  applicationsPending: number;
  zonesPending: number;
  revenue: {
    subscriptionsMtd: number;
    joinOneTimeMtd: number;
    paidGatheringsMtd: number;
    totalMtd: number;
  };
  engagement: {
    momentsToday: number;
    messagesWeek: number;
    gatheringsHosted: number;
    checkInsWeek: number;
  };
  retention: {
    returnRate7d: number;
    avgSessionsPerMember: number;
  };
};

const ZONES_KEY = "bb_club_zone_requests";
const MODS_KEY = "bb_club_moderators";

function canUseStorage() {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function seedZoneRequests(clubId: string): ZoneRequest[] {
  return [
    {
      id: "zr-1",
      clubId,
      zoneName: "Sunrise Hoboken",
      requestedBy: "Rina M.",
      reason: "We have 40+ runners in Hoboken asking for their own chapter.",
      status: "pending",
      submittedAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: "zr-2",
      clubId,
      zoneName: "Recovery & stretch",
      requestedBy: "Alex P.",
      reason: "Post-run mobility sessions — low lift, high retention.",
      status: "pending",
      submittedAt: new Date(Date.now() - 3600000 * 8).toISOString(),
    },
  ];
}

function readZones(): ZoneRequest[] {
  if (!canUseStorage()) return seedZoneRequests(getHostClubId());
  const raw = localStorage.getItem(ZONES_KEY);
  if (!raw) {
    const seeded = seedZoneRequests(getHostClubId());
    localStorage.setItem(ZONES_KEY, JSON.stringify(seeded));
    return seeded;
  }
  try {
    const list = JSON.parse(raw) as ZoneRequest[];
    return Array.isArray(list) ? list : seedZoneRequests(getHostClubId());
  } catch {
    return seedZoneRequests(getHostClubId());
  }
}

function writeZones(list: ZoneRequest[]) {
  if (!canUseStorage()) return;
  localStorage.setItem(ZONES_KEY, JSON.stringify(list));
}

export function listZoneRequests(clubId: string, status?: ZoneRequestStatus): ZoneRequest[] {
  return readZones()
    .filter((z) => z.clubId === clubId)
    .filter((z) => (status ? z.status === status : true))
    .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
}

export function decideZoneRequest(id: string, decision: "approved" | "denied"): ZoneRequest | undefined {
  const list = readZones();
  const idx = list.findIndex((z) => z.id === id);
  if (idx < 0) return undefined;
  const updated: ZoneRequest = {
    ...list[idx],
    status: decision,
    decidedAt: new Date().toISOString(),
  };
  list[idx] = updated;
  writeZones(list);
  return updated;
}

function seedModerators(clubId: string): ClubModerator[] {
  return [
    {
      id: "mod-1",
      clubId,
      name: "Zoe Hart",
      handle: "@zoehart",
      role: "admin",
      permissions: ["applications", "zones", "gatherings", "scan", "ping"],
    },
    {
      id: "mod-2",
      clubId,
      name: "Priya N.",
      handle: "@priya_nyc",
      role: "moderator",
      permissions: ["applications", "scan", "gatherings"],
    },
  ];
}

function readModerators(): ClubModerator[] {
  if (!canUseStorage()) return seedModerators(getHostClubId());
  const raw = localStorage.getItem(MODS_KEY);
  if (!raw) {
    const seeded = seedModerators(getHostClubId());
    localStorage.setItem(MODS_KEY, JSON.stringify(seeded));
    return seeded;
  }
  try {
    const list = JSON.parse(raw) as ClubModerator[];
    return Array.isArray(list) ? list : seedModerators(getHostClubId());
  } catch {
    return seedModerators(getHostClubId());
  }
}

function writeModerators(list: ClubModerator[]) {
  if (!canUseStorage()) return;
  localStorage.setItem(MODS_KEY, JSON.stringify(list));
}

export function listModerators(clubId: string): ClubModerator[] {
  return readModerators().filter((m) => m.clubId === clubId);
}

export function addModerator(
  clubId: string,
  data: {
    name: string;
    handle: string;
    permissions: ClubModerator["permissions"];
    role?: ClubModerator["role"];
  }
): ClubModerator {
  const mod: ClubModerator = {
    id: uid(),
    clubId,
    name: data.name,
    handle: data.handle,
    role: data.role ?? "moderator",
    permissions: data.permissions,
  };
  const list = readModerators();
  list.push(mod);
  writeModerators(list);
  return mod;
}

export function removeModerator(id: string) {
  writeModerators(readModerators().filter((m) => m.id !== id));
}

/** Demo analytics derived from club profile + host activity */
export function getClubAnalytics(clubId: string, pendingApps: number): ClubAnalyticsSnapshot {
  const club = getClubProfile(clubId);
  const members = club?.members ?? 214;
  const pendingZones = listZoneRequests(clubId, "pending").length;
  const join = club?.join;

  const subscriptionsMtd = join?.pricing === "subscription" ? 1840 : join?.pricing === "one_time" ? 0 : 0;
  const joinOneTimeMtd = join?.pricing === "one_time" ? 348 : 0;
  const paidGatheringsMtd = 520;

  return {
    healthScore: club?.healthScore ?? 88,
    healthLabel: club?.healthLabel ?? "Very active",
    activeDaily: club?.hereNow ?? 18,
    activeWeekly: Math.round(members * 0.22),
    activeMonthly: Math.round(members * 0.61),
    membersTotal: members,
    membersNewWeek: 12,
    membersBlocked: 2,
    applicationsPending: pendingApps,
    zonesPending: pendingZones,
    revenue: {
      subscriptionsMtd,
      joinOneTimeMtd,
      paidGatheringsMtd,
      totalMtd: subscriptionsMtd + joinOneTimeMtd + paidGatheringsMtd,
    },
    engagement: {
      momentsToday: club?.momentsToday ?? 24,
      messagesWeek: 186,
      gatheringsHosted: 4,
      checkInsWeek: 47,
    },
    retention: {
      returnRate7d: 74,
      avgSessionsPerMember: 3.2,
    },
  };
}
