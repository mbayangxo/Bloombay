/**
 * Club operations — teams, planner rooms, tasks, volunteers, resources,
 * templates, finances, comms, analytics, timeline, event archive.
 */

import { CLUBS } from "@/app/member/clubs/club-data";
import { listClubMembers, listCheckIns, type ClubMemberRecord } from "@/lib/club-owner-store";
import { listApplications, getHostClubId } from "@/lib/club-host-store";
import { listAllEvents } from "@/lib/bloombay-events-store";
import { getClubSignals } from "@/lib/club-signals";

export type ClubMemberRole = "owner" | "admin" | "moderator" | "member" | "volunteer";

export type ClubTeamKind = "events" | "marketing" | "volunteer" | "finance" | "custom";

export type ClubTeam = {
  id: string;
  clubId: string;
  name: string;
  kind: ClubTeamKind;
  permissions: string[];
  memberIds: string[];
  plannerRoomId?: string;
};

export type PlannerTaskStatus = "todo" | "in_progress" | "done" | "blocked";

export type PlannerTask = {
  id: string;
  title: string;
  assigneeMemberId?: string;
  assigneeName?: string;
  dueDate?: string;
  status: PlannerTaskStatus;
  notes?: string;
};

export type PlannerRoom = {
  id: string;
  clubId: string;
  name: string;
  teamId?: string;
  eventLabel?: string;
  tasks: PlannerTask[];
  createdAt: string;
};

export type VolunteerShift = {
  id: string;
  clubId: string;
  eventId: string;
  eventTitle: string;
  role: string;
  startsAt: string;
  endsAt: string;
  slots: number;
  signedUp: string[];
};

export type VolunteerCheckIn = {
  id: string;
  shiftId: string;
  memberId: string;
  memberName: string;
  checkedInAt: string;
  hours: number;
};

export type ClubResource = {
  id: string;
  clubId: string;
  title: string;
  kind: "flyer" | "cover" | "template" | "document" | "photo" | "sponsor";
  url?: string;
  notes?: string;
  uploadedAt: string;
};

export type EventTemplate = {
  id: string;
  clubId: string;
  name: string;
  timelineDays: { daysBefore: number; label: string }[];
  budgetEstimate: number;
  checklist: string[];
  coverUrl?: string;
  taxNotes?: string;
  volunteerNotes?: string;
};

export type EventExpenseLine = {
  id: string;
  clubId: string;
  eventId: string;
  eventTitle: string;
  label: string;
  amount: number;
  type: "deposit" | "sponsorship" | "expense" | "revenue";
  createdAt: string;
};

export type ClubAnnouncement = {
  id: string;
  clubId: string;
  title: string;
  body: string;
  channels: { push: boolean; email: boolean; sms: boolean };
  sentAt: string;
};

export type EventArchiveRecord = {
  id: string;
  clubId: string;
  title: string;
  completedAt: string;
  coverUrl?: string;
  attendance: number;
  rating?: number;
  notes?: string;
  lessonsLearned?: string;
  photos: string[];
};

const TEAMS_KEY = "bb_club_teams";
const ROOMS_KEY = "bb_club_planner_rooms";
const SHIFTS_KEY = "bb_club_volunteer_shifts";
const VOL_CHECKINS_KEY = "bb_club_volunteer_checkins";
const RESOURCES_KEY = "bb_club_resources";
const TEMPLATES_KEY = "bb_club_event_templates";
const EXPENSES_KEY = "bb_club_event_expenses";
const COMMS_KEY = "bb_club_comms";
const ARCHIVE_KEY = "bb_club_event_archive";
const ROLES_KEY = "bb_club_member_roles";

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
  window.dispatchEvent(new CustomEvent("bb-club-ops-updated"));
}

// ── Member roles ─────────────────────────────────────────────

type RoleMap = Record<string, ClubMemberRole>;

function readRoles(): RoleMap {
  return readJson<RoleMap>(ROLES_KEY, {});
}

function writeRoles(map: RoleMap) {
  writeJson(ROLES_KEY, map);
}

export function getMemberRole(memberId: string, clubId: string): ClubMemberRole {
  const map = readRoles();
  if (map[memberId]) return map[memberId];
  const members = listClubMembers(clubId);
  const idx = members.findIndex((m) => m.id === memberId);
  if (idx === 0) return "owner";
  if (idx === 1) return "admin";
  if (idx === 2) return "moderator";
  return "member";
}

export function setMemberRole(memberId: string, role: ClubMemberRole) {
  const map = readRoles();
  map[memberId] = role;
  writeRoles(map);
}

export function listMembersWithRoles(clubId: string): (ClubMemberRecord & { role: ClubMemberRole })[] {
  return listClubMembers(clubId).map((m) => ({
    ...m,
    role: getMemberRole(m.id, clubId),
  }));
}

export function getMemberAttendanceHistory(memberId: string, clubId: string) {
  return listCheckIns(clubId).filter((c) => c.memberId === memberId);
}

// ── Teams ────────────────────────────────────────────────────

const DEFAULT_TEAM_PERMS: Record<ClubTeamKind, string[]> = {
  events: ["planner", "gatherings", "volunteers", "finances"],
  marketing: ["planner", "comms", "branding"],
  volunteer: ["volunteers", "checkin"],
  finance: ["finances", "reports"],
  custom: ["planner"],
};

function seedTeams(clubId: string): ClubTeam[] {
  const teams: ClubTeam[] = [
    { id: `team-${clubId}-events`, clubId, name: "Events team", kind: "events", permissions: DEFAULT_TEAM_PERMS.events, memberIds: [] },
    { id: `team-${clubId}-mkt`, clubId, name: "Marketing team", kind: "marketing", permissions: DEFAULT_TEAM_PERMS.marketing, memberIds: [] },
    { id: `team-${clubId}-vol`, clubId, name: "Volunteer team", kind: "volunteer", permissions: DEFAULT_TEAM_PERMS.volunteer, memberIds: [] },
    { id: `team-${clubId}-fin`, clubId, name: "Finance team", kind: "finance", permissions: DEFAULT_TEAM_PERMS.finance, memberIds: [] },
  ];
  const members = listClubMembers(clubId);
  if (members[1]) teams[0].memberIds.push(members[1].id);
  if (members[2]) teams[1].memberIds.push(members[2].id);
  if (members[3]) teams[2].memberIds.push(members[3].id);
  return teams;
}

export function listTeams(clubId: string): ClubTeam[] {
  let all = readJson<ClubTeam[]>(TEAMS_KEY, []);
  if (!all.some((t) => t.clubId === clubId)) {
    all = [...all, ...seedTeams(clubId)];
    writeJson(TEAMS_KEY, all);
  }
  return all.filter((t) => t.clubId === clubId);
}

export function saveTeam(team: Omit<ClubTeam, "id"> & { id?: string }): ClubTeam {
  const all = readJson<ClubTeam[]>(TEAMS_KEY, []);
  if (team.id) {
    const idx = all.findIndex((t) => t.id === team.id);
    if (idx >= 0) {
      all[idx] = { ...all[idx], ...team, id: team.id };
      writeJson(TEAMS_KEY, all);
      return all[idx];
    }
  }
  const row: ClubTeam = { ...team, id: uid() };
  all.push(row);
  writeJson(TEAMS_KEY, all);
  return row;
}

export function assignMemberToTeam(teamId: string, memberId: string) {
  const all = readJson<ClubTeam[]>(TEAMS_KEY, []);
  const idx = all.findIndex((t) => t.id === teamId);
  if (idx < 0) return;
  if (!all[idx].memberIds.includes(memberId)) all[idx].memberIds.push(memberId);
  writeJson(TEAMS_KEY, all);
}

// ── Planner rooms & tasks ───────────────────────────────────

function seedPlannerRooms(clubId: string): PlannerRoom[] {
  const fallTasks: PlannerTask[] = [
    { id: uid(), title: "Book venue", status: "done", assigneeName: "Maya R.", dueDate: "2026-08-01", notes: "Rooftop confirmed" },
    { id: uid(), title: "Order supplies", status: "in_progress", assigneeName: "Zara L.", dueDate: "2026-09-15" },
    { id: uid(), title: "Recruit volunteers", status: "todo", dueDate: "2026-09-20" },
    { id: uid(), title: "Create flyer", status: "todo", dueDate: "2026-09-25" },
    { id: uid(), title: "Publish event", status: "todo", dueDate: "2026-10-01" },
  ];
  return [
    {
      id: `room-${clubId}-fall`,
      clubId,
      name: "Fall festival planner",
      eventLabel: "Fall festival",
      teamId: `team-${clubId}-events`,
      tasks: fallTasks,
      createdAt: new Date().toISOString(),
    },
  ];
}

export function listPlannerRooms(clubId: string): PlannerRoom[] {
  let all = readJson<PlannerRoom[]>(ROOMS_KEY, []);
  if (!all.some((r) => r.clubId === clubId)) {
    all = [...all, ...seedPlannerRooms(clubId)];
    writeJson(ROOMS_KEY, all);
  }
  return all.filter((r) => r.clubId === clubId);
}

export function getPlannerRoom(roomId: string): PlannerRoom | null {
  return readJson<PlannerRoom[]>(ROOMS_KEY, []).find((r) => r.id === roomId) ?? null;
}

export function savePlannerRoom(room: Omit<PlannerRoom, "id" | "createdAt"> & { id?: string }): PlannerRoom {
  const all = readJson<PlannerRoom[]>(ROOMS_KEY, []);
  if (room.id) {
    const idx = all.findIndex((r) => r.id === room.id);
    if (idx >= 0) {
      all[idx] = { ...all[idx], ...room, id: room.id };
      writeJson(ROOMS_KEY, all);
      return all[idx];
    }
  }
  const row: PlannerRoom = { ...room, id: uid(), createdAt: new Date().toISOString(), tasks: room.tasks ?? [] };
  all.push(row);
  writeJson(ROOMS_KEY, all);
  return row;
}

export function addPlannerTask(roomId: string, task: Omit<PlannerTask, "id">) {
  const all = readJson<PlannerRoom[]>(ROOMS_KEY, []);
  const idx = all.findIndex((r) => r.id === roomId);
  if (idx < 0) return;
  all[idx].tasks.push({ ...task, id: uid() });
  writeJson(ROOMS_KEY, all);
}

export function updatePlannerTask(roomId: string, taskId: string, patch: Partial<PlannerTask>) {
  const all = readJson<PlannerRoom[]>(ROOMS_KEY, []);
  const idx = all.findIndex((r) => r.id === roomId);
  if (idx < 0) return;
  all[idx].tasks = all[idx].tasks.map((t) => (t.id === taskId ? { ...t, ...patch } : t));
  writeJson(ROOMS_KEY, all);
}

// ── Volunteers ───────────────────────────────────────────────

export function listVolunteerShifts(clubId: string): VolunteerShift[] {
  let all = readJson<VolunteerShift[]>(SHIFTS_KEY, []);
  if (!all.some((s) => s.clubId === clubId)) {
    all.push({
      id: uid(),
      clubId,
      eventId: "g1",
      eventTitle: "Sunrise 5K",
      role: "Check-in desk",
      startsAt: new Date(Date.now() + 86400000 * 7).toISOString(),
      endsAt: new Date(Date.now() + 86400000 * 7 + 7200000).toISOString(),
      slots: 4,
      signedUp: [],
    });
    writeJson(SHIFTS_KEY, all);
  }
  return all.filter((s) => s.clubId === clubId);
}

export function signupVolunteer(shiftId: string, memberId: string, memberName: string) {
  const all = readJson<VolunteerShift[]>(SHIFTS_KEY, []);
  const idx = all.findIndex((s) => s.id === shiftId);
  if (idx < 0 || all[idx].signedUp.length >= all[idx].slots) return;
  if (!all[idx].signedUp.includes(memberId)) all[idx].signedUp.push(memberId);
  writeJson(SHIFTS_KEY, all);
  const checkins = readJson<VolunteerCheckIn[]>(VOL_CHECKINS_KEY, []);
  checkins.push({
    id: uid(),
    shiftId,
    memberId,
    memberName,
    checkedInAt: new Date().toISOString(),
    hours: 2,
  });
  writeJson(VOL_CHECKINS_KEY, checkins);
}

export function listVolunteerHours(clubId: string) {
  const shifts = listVolunteerShifts(clubId);
  const shiftIds = new Set(shifts.map((s) => s.id));
  return readJson<VolunteerCheckIn[]>(VOL_CHECKINS_KEY, []).filter((c) => shiftIds.has(c.shiftId));
}

// ── Resources ────────────────────────────────────────────────

export function listResources(clubId: string): ClubResource[] {
  let all = readJson<ClubResource[]>(RESOURCES_KEY, []);
  if (!all.some((r) => r.clubId === clubId)) {
    all.push(
      { id: uid(), clubId, title: "2025 Halloween flyer", kind: "flyer", uploadedAt: new Date().toISOString() },
      { id: uid(), clubId, title: "Event cover template", kind: "cover", uploadedAt: new Date().toISOString() },
      { id: uid(), clubId, title: "Sponsor deck — local brands", kind: "sponsor", uploadedAt: new Date().toISOString() }
    );
    writeJson(RESOURCES_KEY, all);
  }
  return all.filter((r) => r.clubId === clubId);
}

export function addResource(clubId: string, data: Omit<ClubResource, "id" | "clubId" | "uploadedAt">) {
  const all = readJson<ClubResource[]>(RESOURCES_KEY, []);
  const row: ClubResource = { ...data, id: uid(), clubId, uploadedAt: new Date().toISOString() };
  all.push(row);
  writeJson(RESOURCES_KEY, all);
  return row;
}

// ── Event templates ──────────────────────────────────────────

export function listEventTemplates(clubId: string): EventTemplate[] {
  let all = readJson<EventTemplate[]>(TEMPLATES_KEY, []);
  if (!all.some((t) => t.clubId === clubId)) {
    all.push({
      id: `tpl-${clubId}-halloween`,
      clubId,
      name: "Annual Halloween party",
      timelineDays: [
        { daysBefore: 90, label: "Reserve venue" },
        { daysBefore: 60, label: "Recruit volunteers" },
        { daysBefore: 30, label: "Publish event" },
        { daysBefore: 7, label: "Send reminders" },
      ],
      budgetEstimate: 2400,
      checklist: ["Venue contract", "DJ", "Decor", "Safety briefing", "Volunteer shifts"],
      taxNotes: "Collect W-9 for paid vendors",
      volunteerNotes: "4 check-in + 2 bar support",
    });
    writeJson(TEMPLATES_KEY, all);
  }
  return all.filter((t) => t.clubId === clubId);
}

export function duplicateTemplate(templateId: string, yearLabel: string): EventTemplate | null {
  const all = readJson<EventTemplate[]>(TEMPLATES_KEY, []);
  const src = all.find((t) => t.id === templateId);
  if (!src) return null;
  const copy: EventTemplate = { ...src, id: uid(), name: `${src.name} · ${yearLabel}` };
  all.push(copy);
  writeJson(TEMPLATES_KEY, all);
  const room = savePlannerRoom({
    clubId: src.clubId,
    name: `${copy.name} planner`,
    eventLabel: copy.name,
    tasks: copy.checklist.map((c) => ({ id: uid(), title: c, status: "todo" as const })),
  });
  void room;
  return copy;
}

// ── Finances ─────────────────────────────────────────────────

export function listEventExpenses(clubId: string): EventExpenseLine[] {
  let all = readJson<EventExpenseLine[]>(EXPENSES_KEY, []);
  if (!all.some((e) => e.clubId === clubId)) {
    all.push(
      { id: uid(), clubId, eventId: "g1", eventTitle: "Sunrise 5K", label: "Venue deposit", amount: 400, type: "deposit", createdAt: new Date().toISOString() },
      { id: uid(), clubId, eventId: "g1", eventTitle: "Sunrise 5K", label: "Local cafe sponsor", amount: 800, type: "sponsorship", createdAt: new Date().toISOString() },
      { id: uid(), clubId, eventId: "g1", eventTitle: "Sunrise 5K", label: "Supplies", amount: 220, type: "expense", createdAt: new Date().toISOString() },
      { id: uid(), clubId, eventId: "g1", eventTitle: "Sunrise 5K", label: "Ticket revenue", amount: 1200, type: "revenue", createdAt: new Date().toISOString() }
    );
    writeJson(EXPENSES_KEY, all);
  }
  return all.filter((e) => e.clubId === clubId);
}

export function getEventFinanceSummary(clubId: string, eventId: string) {
  const lines = listEventExpenses(clubId).filter((e) => e.eventId === eventId);
  const revenue = lines.filter((l) => l.type === "revenue" || l.type === "sponsorship").reduce((s, l) => s + l.amount, 0);
  const spent = lines.filter((l) => l.type === "expense" || l.type === "deposit").reduce((s, l) => s + l.amount, 0);
  return { revenue, spent, profit: revenue - spent, lines };
}

// ── Communication center ─────────────────────────────────────

export function listAnnouncements(clubId: string): ClubAnnouncement[] {
  return readJson<ClubAnnouncement[]>(COMMS_KEY, []).filter((a) => a.clubId === clubId);
}

export function sendAnnouncement(
  clubId: string,
  data: { title: string; body: string; channels: ClubAnnouncement["channels"] }
) {
  const all = readJson<ClubAnnouncement[]>(COMMS_KEY, []);
  const row: ClubAnnouncement = {
    id: uid(),
    clubId,
    ...data,
    sentAt: new Date().toISOString(),
  };
  all.unshift(row);
  writeJson(COMMS_KEY, all);
  return row;
}

// ── Analytics ────────────────────────────────────────────────

export type ClubGrowthMetrics = {
  newMembersThisMonth: number;
  activeMembers: number;
  attendanceRate: number;
  eventParticipation: number;
  retentionRate: number;
  pendingApplications: number;
};

export function getClubGrowthMetrics(clubId: string): ClubGrowthMetrics {
  const members = listClubMembers(clubId);
  const monthAgo = Date.now() - 86400000 * 30;
  const newMembers = members.filter((m) => new Date(m.joinedAt).getTime() > monthAgo).length;
  const active = members.filter((m) => m.lastActive === "Today" || m.lastActive?.includes("d ago")).length;
  const signals = getClubSignals(clubId);
  const pending = listApplications(clubId, "pending").length;
  const events = listAllEvents().filter((e) => e.clubId === clubId);
  return {
    newMembersThisMonth: newMembers || 2,
    activeMembers: active,
    attendanceRate: signals.attendanceRate,
    eventParticipation: events.length * 12 + members.length,
    retentionRate: signals.returnRate,
    pendingApplications: pending,
  };
}

export type EventAnalytics = {
  eventId: string;
  title: string;
  rsvps: number;
  checkedIn: number;
  noShows: number;
  rating: number;
};

export function getEventAnalytics(clubId: string): EventAnalytics[] {
  const events = listAllEvents().filter((e) => e.clubId === clubId);
  const checkins = listCheckIns(clubId);
  return events.slice(0, 6).map((e) => ({
    eventId: e.id,
    title: e.title,
    rsvps: e.capacity ?? 40,
    checkedIn: checkins.filter((c) => c.eventId === e.id).length || Math.floor(Math.random() * 20) + 8,
    noShows: 2,
    rating: e.ratingAvg ?? 4.5,
  }));
}

// ── Timeline (90/60/30/7) ────────────────────────────────────

export const DEFAULT_EVENT_MILESTONES = [
  { daysBefore: 90, label: "Reserve venue" },
  { daysBefore: 60, label: "Recruit volunteers" },
  { daysBefore: 30, label: "Publish event" },
  { daysBefore: 7, label: "Send reminders" },
] as const;

export function getEventTimelineForDate(eventDateIso: string) {
  const parsed = new Date(eventDateIso).getTime();
  const eventMs = Number.isFinite(parsed) ? parsed : Date.now() + 86400000 * 60;
  return DEFAULT_EVENT_MILESTONES.map((m) => ({
    ...m,
    dueAt: new Date(eventMs - m.daysBefore * 86400000).toISOString(),
    status: Date.now() > eventMs - m.daysBefore * 86400000 ? ("due" as const) : ("upcoming" as const),
  }));
}

// ── Event archive ────────────────────────────────────────────

export function listEventArchive(clubId: string): EventArchiveRecord[] {
  let all = readJson<EventArchiveRecord[]>(ARCHIVE_KEY, []);
  if (!all.some((a) => a.clubId === clubId)) {
    all.push({
      id: uid(),
      clubId,
      title: "Summer rooftop social",
      completedAt: new Date(Date.now() - 86400000 * 45).toISOString(),
      attendance: 38,
      rating: 4.8,
      notes: "Sold out. Extended bar tab.",
      lessonsLearned: "Start volunteer signup 60 days out — we were short 2 shifts.",
      photos: [],
    });
    writeJson(ARCHIVE_KEY, all);
  }
  return all.filter((a) => a.clubId === clubId);
}

export function archiveCompletedEvent(
  clubId: string,
  data: Omit<EventArchiveRecord, "id" | "clubId">
) {
  const all = readJson<EventArchiveRecord[]>(ARCHIVE_KEY, []);
  const row: EventArchiveRecord = { ...data, id: uid(), clubId };
  all.unshift(row);
  writeJson(ARCHIVE_KEY, all);
  return row;
}

// ── Multi-club portfolio (owner / founder) ───────────────────

export type PortfolioClubSummary = {
  clubId: string;
  clubName: string;
  upcomingEvents: number;
  newMembers: number;
  pendingApprovals: number;
  needsAttention: string[];
  healthScore: number;
};

export function getPortfolioSummaries(clubIds: string[]): PortfolioClubSummary[] {
  return clubIds.map((clubId) => {
    const club = CLUBS.find((c) => c.id === clubId);
    const metrics = getClubGrowthMetrics(clubId);
    const events = listAllEvents().filter((e) => e.clubId === clubId && e.status === "live");
    const signals = getClubSignals(clubId);
    const needs: string[] = [];
    if (metrics.pendingApplications > 0) needs.push(`${metrics.pendingApplications} pending applications`);
    if (signals.decayWarning) needs.push(signals.decayWarning);
    if (metrics.attendanceRate < 75) needs.push("Attendance below target");
    return {
      clubId,
      clubName: club?.name ?? clubId,
      upcomingEvents: events.length,
      newMembers: metrics.newMembersThisMonth,
      pendingApprovals: metrics.pendingApplications,
      needsAttention: needs,
      healthScore: signals.attendanceRate,
    };
  });
}

export function getDefaultPortfolioClubIds(): string[] {
  return CLUBS.slice(0, 4).map((c) => c.id);
}

export function getActivePortfolioClubId(): string {
  if (canUseStorage()) return getHostClubId();
  return CLUBS[0]?.id ?? "morning-run-club";
}
