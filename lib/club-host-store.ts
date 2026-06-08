/**
 * Club host portal — prototype persistence (localStorage).
 * Owner settings, applications, and Bloom pings sync with the member app in the same browser.
 */

import type { ClubJoinSettings, ClubPricing, ClubJoinMode } from "@/lib/club-world-data";

export type { ClubJoinSettings, ClubPricing, ClubJoinMode };

export type ApplicationStatus = "pending" | "approved" | "denied";

export type ClubApplication = {
  id: string;
  clubId: string;
  applicantName: string;
  city: string;
  instagram?: string;
  why: string;
  status: ApplicationStatus;
  submittedAt: string;
  decidedAt?: string;
  /** Demo avatar — gradient or image URL */
  photoGradient?: string;
  photoUrl?: string;
  interests?: string[];
};

export type BloomPing = {
  id: string;
  clubId: string;
  message: string;
  sentAt: string;
  recipientCount: number;
};

const HOST_CLUB_KEY = "bb_host_club_id";
const HOST_OWNER_NAME_KEY = "bb_host_owner_name";
const JOIN_PREFIX = "bb_club_join_";
const APPS_KEY = "bb_club_applications";
const PINGS_KEY = "bb_club_pings";
const DEFAULT_HOST_CLUB = "morning-run-club";

function canUseStorage() {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function getHostClubId(): string {
  if (!canUseStorage()) return DEFAULT_HOST_CLUB;
  return localStorage.getItem(HOST_CLUB_KEY) ?? DEFAULT_HOST_CLUB;
}

export function setHostClubId(clubId: string) {
  if (!canUseStorage()) return;
  localStorage.setItem(HOST_CLUB_KEY, clubId);
}

/** Club owner display name (prototype: localStorage + member session fallback) */
export function getHostOwnerName(): string {
  if (!canUseStorage()) return "Maya";
  const stored = localStorage.getItem(HOST_OWNER_NAME_KEY);
  if (stored?.trim()) return stored.trim();
  const memberName = sessionStorage.getItem("gf_name");
  if (memberName?.trim()) {
    const first = memberName.trim().split(/\s+/)[0];
    if (first) return first;
  }
  return "Maya";
}

export function setHostOwnerName(name: string) {
  if (!canUseStorage()) return;
  const trimmed = name.trim();
  if (trimmed) localStorage.setItem(HOST_OWNER_NAME_KEY, trimmed);
}

/** Derive a friendly name from login email */
export function hostNameFromEmail(email: string): string {
  const local = email.split("@")[0]?.trim() ?? "";
  if (!local) return "Host";
  const word = local.replace(/[._-]+/g, " ").split(/\s+/)[0];
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

export function getStoredJoinSettings(clubId: string): ClubJoinSettings | null {
  if (!canUseStorage()) return null;
  const raw = localStorage.getItem(`${JOIN_PREFIX}${clubId}`);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as ClubJoinSettings;
  } catch {
    return null;
  }
}

export function saveJoinSettings(clubId: string, settings: ClubJoinSettings) {
  if (!canUseStorage()) return;
  localStorage.setItem(`${JOIN_PREFIX}${clubId}`, JSON.stringify(settings));
}

function readApplications(): ClubApplication[] {
  if (!canUseStorage()) return [];
  const raw = localStorage.getItem(APPS_KEY);
  if (!raw) return seedApplications();
  try {
    const list = JSON.parse(raw) as ClubApplication[];
    return Array.isArray(list) ? list : seedApplications();
  } catch {
    return seedApplications();
  }
}

function writeApplications(list: ClubApplication[]) {
  if (!canUseStorage()) return;
  localStorage.setItem(APPS_KEY, JSON.stringify(list));
}

function seedApplications(): ClubApplication[] {
  const seeded: ClubApplication[] = [
    {
      id: "app-demo-1",
      clubId: DEFAULT_HOST_CLUB,
      applicantName: "Jordan K.",
      city: "Hoboken",
      instagram: "@jordank",
      why: "I run 3x a week and want a crew that holds me accountable. I've done half-marathons and love sunrise miles by the river.",
      status: "pending",
      submittedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      photoGradient: "linear-gradient(135deg,#ffb7ce,#ff2d8a)",
      interests: ["Running", "Wellness", "Hoboken"],
    },
    {
      id: "app-demo-2",
      clubId: DEFAULT_HOST_CLUB,
      applicantName: "Simone T.",
      city: "Brooklyn",
      instagram: "@simone_moves",
      why: "Moving to NYC — looking for morning run friends and a soft community that feels like home.",
      status: "pending",
      submittedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
      photoGradient: "linear-gradient(135deg,#121212,#ff2d8a)",
      interests: ["Running", "New in city"],
    },
  ];
  if (canUseStorage()) localStorage.setItem(APPS_KEY, JSON.stringify(seeded));
  return seeded;
}

export function listApplications(clubId: string, status?: ApplicationStatus): ClubApplication[] {
  return readApplications()
    .filter((a) => a.clubId === clubId)
    .filter((a) => (status ? a.status === status : true))
    .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
}

export async function submitApplication(
  clubId: string,
  data: { applicantName: string; city: string; instagram?: string; why: string }
): Promise<ClubApplication> {
  try {
    await fetch("/api/member/club-applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clubSlug: clubId,
        applicantName: data.applicantName,
        city: data.city,
        instagram: data.instagram,
        why: data.why,
      }),
    });
  } catch {
    /* host panel may still use local cache */
  }

  const app: ClubApplication = {
    id: uid(),
    clubId,
    ...data,
    status: "pending",
    submittedAt: new Date().toISOString(),
  };
  const list = readApplications();
  list.push(app);
  writeApplications(list);
  if (canUseStorage()) {
    sessionStorage.setItem(`bb_my_app_${clubId}`, app.id);
  }
  return app;
}

export function getMyApplicationId(clubId: string): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(`bb_my_app_${clubId}`);
}

export function getApplicationById(id: string): ClubApplication | undefined {
  return readApplications().find((a) => a.id === id);
}

export function decideApplication(
  id: string,
  decision: "approved" | "denied"
): ClubApplication | undefined {
  const list = readApplications();
  const idx = list.findIndex((a) => a.id === id);
  if (idx < 0) return undefined;
  const updated: ClubApplication = {
    ...list[idx],
    status: decision,
    decidedAt: new Date().toISOString(),
  };
  list[idx] = updated;
  writeApplications(list);

  if (decision === "approved" && canUseStorage()) {
    sessionStorage.setItem(`bb_club_member_${updated.clubId}`, "1");
    sessionStorage.setItem(`bb_app_decision_${id}`, "approved");
  }
  if (decision === "denied" && canUseStorage()) {
    sessionStorage.setItem(`bb_app_decision_${id}`, "denied");
  }
  return updated;
}

function readPings(): BloomPing[] {
  if (!canUseStorage()) return [];
  const raw = localStorage.getItem(PINGS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as BloomPing[];
  } catch {
    return [];
  }
}

function writePings(list: BloomPing[]) {
  if (!canUseStorage()) return;
  localStorage.setItem(PINGS_KEY, JSON.stringify(list));
}

export function listPings(clubId: string): BloomPing[] {
  return readPings()
    .filter((p) => p.clubId === clubId)
    .sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime());
}

export function sendBloomPing(clubId: string, message: string, memberCount = 214): BloomPing {
  const ping: BloomPing = {
    id: uid(),
    clubId,
    message: message.trim(),
    sentAt: new Date().toISOString(),
    recipientCount: memberCount,
  };
  const list = readPings();
  list.unshift(ping);
  writePings(list.slice(0, 50));

  if (canUseStorage()) {
    const inbox = JSON.parse(localStorage.getItem("bb_member_pings") ?? "[]") as {
      clubId: string;
      clubName?: string;
      message: string;
      sentAt: string;
    }[];
    inbox.unshift({
      clubId,
      message: ping.message,
      sentAt: ping.sentAt,
    });
    localStorage.setItem("bb_member_pings", JSON.stringify(inbox.slice(0, 20)));
  }
  return ping;
}

export function buildPriceLabel(pricing: ClubPricing, amount: string, period: "once" | "month" | "year"): string | undefined {
  if (pricing === "free") return undefined;
  if (pricing === "one_time") return `$${amount} one-time`;
  if (period === "month") return `$${amount} / month`;
  return `$${amount} / year`;
}
