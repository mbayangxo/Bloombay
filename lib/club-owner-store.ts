/**
 * Club owner portal — members, branding, gatherings, notifications, audit, check-ins.
 */

import { CLUBS } from "@/app/member/clubs/club-data";
import { DEMO_HOST_EVENTS } from "@/lib/qr-codes";
import { MEMBER_UI_REFS } from "@/lib/member-ui-assets";
import { getHostOwnerName, listPings } from "@/lib/club-host-store";

export type MemberStatus = "active" | "blocked" | "removed";

export type ClubMemberRecord = {
  id: string;
  clubId: string;
  name: string;
  city: string;
  joinedAt: string;
  status: MemberStatus;
  instagram?: string;
  photoGradient?: string;
  lastActive?: string;
};

export type ClubBranding = {
  heroImage: string;
  tagline?: string;
  description?: string;
  welcomeLine?: string;
  gallery: { id: string; caption: string; imageUrl: string }[];
  /** Branding kit */
  logoUrl?: string;
  bannerUrl?: string;
  coverImage?: string;
  primaryColor?: string;
  accentColor?: string;
  instagram?: string;
  website?: string;
  tiktok?: string;
};

export type HostGathering = {
  id: string;
  clubId: string;
  title: string;
  date: string;
  location: string;
  capacity: number;
  waitlist: number;
  paid: boolean;
  price?: number;
  status: "scheduled" | "cancelled";
  createdAt: string;
};

export type HostNotification = {
  id: string;
  clubId: string;
  type: "application" | "zone" | "gathering" | "health" | "moderation";
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
};

export type AuditLogEntry = {
  id: string;
  clubId: string;
  actor: string;
  action: string;
  target?: string;
  createdAt: string;
};

export type CheckInRecord = {
  id: string;
  clubId: string;
  eventId: string;
  eventTitle: string;
  memberId: string;
  memberName: string;
  checkedInAt: string;
};

export type ModerationItem = {
  id: string;
  clubId: string;
  author: string;
  excerpt: string;
  status: "open" | "dismissed" | "removed";
  createdAt: string;
};

export type PaymentSettings = {
  stripeConnected: boolean;
  payoutsEnabled: boolean;
};

const MEMBERS_KEY = "bb_club_members";
const BRANDING_PREFIX = "bb_club_branding_";
const GATHERINGS_KEY = "bb_club_gatherings";
const NOTIFS_KEY = "bb_club_owner_notifs";
const AUDIT_KEY = "bb_club_audit";
const CHECKINS_KEY = "bb_club_checkins";
const MOD_KEY = "bb_club_moderation";
const PAYMENTS_PREFIX = "bb_club_payments_";
const NOTIF_PREFS_PREFIX = "bb_club_notif_prefs_";

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
}

const DEFAULT_GALLERY = [
  { id: "g1", caption: "Sunrise run crew", imageUrl: MEMBER_UI_REFS.homeHero },
  { id: "g2", caption: "After the 5K", imageUrl: MEMBER_UI_REFS.tonight },
  { id: "g3", caption: "Club vibes", imageUrl: MEMBER_UI_REFS.lounge },
  { id: "g4", caption: "Our city", imageUrl: MEMBER_UI_REFS.zones },
  { id: "g5", caption: "Planning IRL", imageUrl: MEMBER_UI_REFS.planner },
];

export function defaultBranding(clubId: string): ClubBranding {
  const club = CLUBS.find((c) => c.id === clubId);
  return {
    heroImage: MEMBER_UI_REFS.homeHero,
    tagline: club?.tagline,
    description: club?.description,
    welcomeLine: club?.welcomeMessage,
    gallery: DEFAULT_GALLERY,
  };
}

export function getClubBranding(clubId: string): ClubBranding {
  const stored = readJson<ClubBranding | null>(`${BRANDING_PREFIX}${clubId}`, null);
  if (stored?.gallery?.length) return { ...defaultBranding(clubId), ...stored, gallery: stored.gallery };
  return defaultBranding(clubId);
}

export function saveClubBranding(clubId: string, branding: Partial<ClubBranding>) {
  const current = getClubBranding(clubId);
  writeJson(`${BRANDING_PREFIX}${clubId}`, { ...current, ...branding });
  if (typeof window !== "undefined") {
    void import("@/lib/club-registry").then(({ syncClubOwnerBrandingToDiscovery }) => {
      syncClubOwnerBrandingToDiscovery(clubId);
    });
  }
}

function seedMembers(clubId: string): ClubMemberRecord[] {
  const names = [
    { name: "Maya R.", city: "SoHo", g: "linear-gradient(135deg,#ffb7ce,#ff2d8a)" },
    { name: "Zara L.", city: "Brooklyn", g: "linear-gradient(135deg,#121212,#ff2d8a)" },
    { name: "Priya S.", city: "UES", g: "linear-gradient(135deg,#ff2d8a,#ffb7ce)" },
    { name: "Monique T.", city: "Harlem", g: "linear-gradient(135deg,#ffe4ec,#121212)" },
    { name: "Rina K.", city: "Hoboken", g: "linear-gradient(135deg,#ffb7ce,#121212)" },
    { name: "Simone W.", city: "Williamsburg", g: "linear-gradient(135deg,#121212,#ffb7ce)" },
  ];
  return names.map((m, i) => ({
    id: `mem-${clubId}-${i}`,
    clubId,
    name: m.name,
    city: m.city,
    joinedAt: new Date(Date.now() - 86400000 * (i + 3)).toISOString(),
    status: "active" as const,
    photoGradient: m.g,
    lastActive: i < 2 ? "Today" : `${i}d ago`,
  }));
}

export function listClubMembers(clubId: string, opts?: { q?: string; includeBlocked?: boolean }) {
  let list = readJson<ClubMemberRecord[]>(MEMBERS_KEY, []);
  if (!list.some((m) => m.clubId === clubId)) {
    list = [...list, ...seedMembers(clubId)];
    writeJson(MEMBERS_KEY, list);
  }
  list = list.filter((m) => m.clubId === clubId && m.status !== "removed");
  if (!opts?.includeBlocked) list = list.filter((m) => m.status !== "blocked");
  if (opts?.q?.trim()) {
    const q = opts.q.toLowerCase();
    list = list.filter(
      (m) => m.name.toLowerCase().includes(q) || m.city.toLowerCase().includes(q)
    );
  }
  return list.sort((a, b) => a.name.localeCompare(b.name));
}

export function addClubMember(
  clubId: string,
  data: { name: string; city: string; instagram?: string }
) {
  const member: ClubMemberRecord = {
    id: uid(),
    clubId,
    name: data.name,
    city: data.city,
    instagram: data.instagram,
    joinedAt: new Date().toISOString(),
    status: "active",
    photoGradient: "linear-gradient(135deg,#ffb7ce,#ff2d8a)",
    lastActive: "Today",
  };
  const list = readJson<ClubMemberRecord[]>(MEMBERS_KEY, []);
  list.push(member);
  writeJson(MEMBERS_KEY, list);
  return member;
}

export function setMemberStatus(memberId: string, status: MemberStatus) {
  const list = readJson<ClubMemberRecord[]>(MEMBERS_KEY, []);
  const idx = list.findIndex((m) => m.id === memberId);
  if (idx < 0) return;
  list[idx] = { ...list[idx], status };
  writeJson(MEMBERS_KEY, list);
  if (status === "blocked" && canUseStorage()) {
    sessionStorage.removeItem(`bb_club_member_${list[idx].clubId}`);
  }
}

export function exportMembersCsv(clubId: string): string {
  const rows = listClubMembers(clubId, { includeBlocked: true });
  const header = "name,city,status,joinedAt,lastActive";
  const body = rows
    .map((m) =>
      [m.name, m.city, m.status, m.joinedAt, m.lastActive ?? ""]
        .map((c) => `"${String(c).replace(/"/g, '""')}"`)
        .join(",")
    )
    .join("\n");
  return `${header}\n${body}`;
}

export function listGatherings(clubId: string): HostGathering[] {
  let list = readJson<HostGathering[]>(GATHERINGS_KEY, []);
  if (!list.some((g) => g.clubId === clubId)) {
    const seeded = DEMO_HOST_EVENTS.map((ev) => ({
      id: ev.id,
      clubId,
      title: ev.title,
      date: ev.date,
      location: "NYC",
      capacity: 40,
      waitlist: 3,
      paid: ev.title.includes("Wine"),
      price: ev.title.includes("Wine") ? 25 : undefined,
      status: "scheduled" as const,
      createdAt: new Date().toISOString(),
    }));
    list = [...list, ...seeded];
    writeJson(GATHERINGS_KEY, list);
  }
  return list
    .filter((g) => g.clubId === clubId && g.status !== "cancelled")
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function saveGathering(
  clubId: string,
  data: Omit<HostGathering, "id" | "clubId" | "createdAt" | "status"> & { id?: string }
): HostGathering {
  const list = readJson<HostGathering[]>(GATHERINGS_KEY, []);
  if (data.id) {
    const idx = list.findIndex((g) => g.id === data.id);
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...data, clubId, status: "scheduled" };
      writeJson(GATHERINGS_KEY, list);
      return list[idx];
    }
  }
  const g: HostGathering = {
    ...data,
    id: uid(),
    clubId,
    status: "scheduled",
    createdAt: new Date().toISOString(),
    waitlist: data.waitlist ?? 0,
  };
  list.unshift(g);
  writeJson(GATHERINGS_KEY, list);
  pushNotification(clubId, "gathering", "Gathering scheduled", g.title);
  return g;
}

export function cancelGathering(id: string) {
  const list = readJson<HostGathering[]>(GATHERINGS_KEY, []);
  const idx = list.findIndex((g) => g.id === id);
  if (idx < 0) return;
  list[idx] = { ...list[idx], status: "cancelled" };
  writeJson(GATHERINGS_KEY, list);
}

export function logAudit(clubId: string, action: string, target?: string) {
  const entry: AuditLogEntry = {
    id: uid(),
    clubId,
    actor: getHostOwnerName(),
    action,
    target,
    createdAt: new Date().toISOString(),
  };
  const list = readJson<AuditLogEntry[]>(AUDIT_KEY, []);
  list.unshift(entry);
  writeJson(AUDIT_KEY, list.slice(0, 200));
}

export function listAuditLog(clubId: string) {
  return readJson<AuditLogEntry[]>(AUDIT_KEY, [])
    .filter((e) => e.clubId === clubId)
    .slice(0, 50);
}

export function recordCheckIn(
  clubId: string,
  data: { eventId: string; eventTitle: string; memberId: string; memberName: string }
) {
  const record: CheckInRecord = {
    id: uid(),
    clubId,
    ...data,
    checkedInAt: new Date().toISOString(),
  };
  const list = readJson<CheckInRecord[]>(CHECKINS_KEY, []);
  list.unshift(record);
  writeJson(CHECKINS_KEY, list.slice(0, 500));
  return record;
}

export function listCheckIns(clubId: string, eventId?: string) {
  return readJson<CheckInRecord[]>(CHECKINS_KEY, [])
    .filter((c) => c.clubId === clubId && (eventId ? c.eventId === eventId : true))
    .slice(0, 100);
}

function seedNotifications(clubId: string): HostNotification[] {
  return [
    {
      id: "n1",
      clubId,
      type: "application",
      title: "New application",
      body: "Jordan K. wants to join",
      read: false,
      createdAt: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: "n2",
      clubId,
      type: "zone",
      title: "Zone request",
      body: "Sunrise Hoboken chapter pending",
      read: false,
      createdAt: new Date(Date.now() - 7200000).toISOString(),
    },
  ];
}

export function pushNotification(
  clubId: string,
  type: HostNotification["type"],
  title: string,
  body: string
) {
  const n: HostNotification = {
    id: uid(),
    clubId,
    type,
    title,
    body,
    read: false,
    createdAt: new Date().toISOString(),
  };
  const list = readJson<HostNotification[]>(NOTIFS_KEY, []);
  list.unshift(n);
  writeJson(NOTIFS_KEY, list.slice(0, 80));
}

export function listNotifications(clubId: string) {
  let list = readJson<HostNotification[]>(NOTIFS_KEY, []);
  if (!list.some((n) => n.clubId === clubId)) {
    list = [...seedNotifications(clubId), ...list];
    writeJson(NOTIFS_KEY, list);
  }
  return list.filter((n) => n.clubId === clubId);
}

export function markNotificationRead(id: string) {
  const list = readJson<HostNotification[]>(NOTIFS_KEY, []);
  const idx = list.findIndex((n) => n.id === id);
  if (idx >= 0) {
    list[idx] = { ...list[idx], read: true };
    writeJson(NOTIFS_KEY, list);
  }
}

export type NotificationPrefs = {
  emailApplications: boolean;
  emailZones: boolean;
  emailGatherings: boolean;
  pushApplications: boolean;
};

export function getNotificationPrefs(clubId: string): NotificationPrefs {
  return readJson(`${NOTIF_PREFS_PREFIX}${clubId}`, {
    emailApplications: true,
    emailZones: true,
    emailGatherings: true,
    pushApplications: true,
  });
}

export function saveNotificationPrefs(clubId: string, prefs: NotificationPrefs) {
  writeJson(`${NOTIF_PREFS_PREFIX}${clubId}`, prefs);
}

export function getPaymentSettings(clubId: string): PaymentSettings {
  return readJson(`${PAYMENTS_PREFIX}${clubId}`, {
    stripeConnected: false,
    payoutsEnabled: false,
  });
}

export function savePaymentSettings(clubId: string, settings: PaymentSettings) {
  writeJson(`${PAYMENTS_PREFIX}${clubId}`, settings);
}

function seedModeration(clubId: string): ModerationItem[] {
  return [
    {
      id: "mod-1",
      clubId,
      author: "Anonymous",
      excerpt: "Spam link in zone chat — needs review",
      status: "open",
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
  ];
}

export function listModeration(clubId: string) {
  let list = readJson<ModerationItem[]>(MOD_KEY, []);
  if (!list.some((m) => m.clubId === clubId)) {
    list = [...seedModeration(clubId), ...list];
    writeJson(MOD_KEY, list);
  }
  return list.filter((m) => m.clubId === clubId);
}

export function resolveModeration(id: string, status: "dismissed" | "removed") {
  const list = readJson<ModerationItem[]>(MOD_KEY, []);
  const idx = list.findIndex((m) => m.id === id);
  if (idx >= 0) {
    list[idx] = { ...list[idx], status };
    writeJson(MOD_KEY, list);
    logAudit(list[idx].clubId, `Moderation ${status}`, list[idx].excerpt);
  }
}

export function getHealthAlerts(clubId: string) {
  const analytics = { score: 88, weeklyDrop: false };
  const alerts: { id: string; level: "info" | "warn"; message: string; action?: string; href?: string }[] = [];
  if (listClubMembers(clubId).filter((m) => m.lastActive?.includes("d ago")).length > 3) {
    alerts.push({
      id: "churn",
      level: "warn",
      message: "Several members inactive 7+ days — send a Bloom ping?",
      action: "Open ping",
      href: "/club-owner/ping",
    });
  }
  alerts.push({
    id: "health",
    level: "info",
    message: `Club health ${analytics.score}% — strong week for gatherings`,
    href: "/club-owner/analytics",
  });
  return alerts;
}

export type OnboardingStep = {
  id: string;
  label: string;
  done: boolean;
  href: string;
};

export function getOnboardingSteps(clubId: string): OnboardingStep[] {
  const branding = getClubBranding(clubId);
  const gatherings = listGatherings(clubId).length;
  const pings = listPings(clubId).length;
  return [
    { id: "join", label: "Set join & paywall rules", done: true, href: "/club-owner/settings" },
    {
      id: "brand",
      label: "Customize landing photos & copy",
      done: branding.gallery.length >= 4,
      href: "/club-owner/branding",
    },
    {
      id: "gathering",
      label: "Schedule your first gathering",
      done: gatherings > 0,
      href: "/club-owner/gatherings",
    },
    { id: "mods", label: "Invite a moderator", done: false, href: "/club-owner/moderators" },
    { id: "ping", label: "Send your first Bloom ping", done: pings > 0, href: "/club-owner/ping" },
  ];
}

export function listHostClubs() {
  return CLUBS.map((c) => ({ id: c.id, name: c.name, members: c.members }));
}

export function exportRevenueCsv(clubId: string): string {
  return "source,amount_mtd\nsubscriptions,1840\njoin_fees,348\npaid_gatherings,520\n";
}
