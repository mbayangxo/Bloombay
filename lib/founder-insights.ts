/** Founder Mission Control — club health, hosts, Yande signals */

export type FounderClubHealth = {
  clubId: string;
  name: string;
  attendance: number;
  safety: number;
  hostResponse: number;
  growth: number;
  overall: number;
  noShowsLast30: number;
  members: number;
};

export const FOUNDER_CLUB_HEALTH: FounderClubHealth[] = [
  {
    clubId: "founders-club",
    name: "Founders Club",
    attendance: 92,
    safety: 100,
    hostResponse: 95,
    growth: 82,
    overall: 92,
    noShowsLast30: 4,
    members: 412,
  },
  {
    clubId: "book-club-harlem",
    name: "Book Club · Harlem",
    attendance: 88,
    safety: 100,
    hostResponse: 91,
    growth: 76,
    overall: 89,
    noShowsLast30: 6,
    members: 298,
  },
  {
    clubId: "morning-run-club",
    name: "Morning Run Club",
    attendance: 94,
    safety: 98,
    hostResponse: 88,
    growth: 91,
    overall: 93,
    noShowsLast30: 2,
    members: 521,
  },
  {
    clubId: "supper-society",
    name: "Supper Society",
    attendance: 71,
    safety: 96,
    hostResponse: 72,
    growth: 58,
    overall: 74,
    noShowsLast30: 18,
    members: 186,
  },
  {
    clubId: "wellness-circle",
    name: "Wellness Circle",
    attendance: 85,
    safety: 100,
    hostResponse: 90,
    growth: 68,
    overall: 86,
    noShowsLast30: 9,
    members: 244,
  },
];

export type HostLeaderboardEntry = {
  rank: number;
  name: string;
  club: string;
  attendanceRate: number;
  eventsHosted: number;
  members: number;
  badge: "top" | "active" | "rising";
};

export const HOST_LEADERBOARD: HostLeaderboardEntry[] = [
  { rank: 1, name: "Amanda R.", club: "Williamsburg Dinner", attendanceRate: 96, eventsHosted: 24, members: 842, badge: "top" },
  { rank: 2, name: "Maya K.", club: "Morning Run Club", attendanceRate: 94, eventsHosted: 31, members: 521, badge: "top" },
  { rank: 3, name: "Priya S.", club: "Book Club · Harlem", attendanceRate: 91, eventsHosted: 18, members: 298, badge: "active" },
  { rank: 4, name: "Zoe L.", club: "Founders Club", attendanceRate: 89, eventsHosted: 15, members: 412, badge: "active" },
  { rank: 5, name: "Chisom O.", club: "Supper Society", attendanceRate: 71, eventsHosted: 9, members: 186, badge: "rising" },
];

export const YANDE_MISSION = {
  topRequests: [
    { label: "Founders brunch · Chelsea", count: 412, trend: "+18%" },
    { label: "Book club · Harlem", count: 312, trend: "+12%" },
    { label: "Solo dinner · Williamsburg", count: 289, trend: "+9%" },
    { label: "Morning run · Hoboken", count: 241, trend: "+14%" },
  ],
  citiesMomentum: [
    { city: "NYC", score: 84, signal: "Strong — open more neighborhoods" },
    { city: "London", score: 52, signal: "Wait — host pipeline thin" },
    { city: "Toronto", score: 41, signal: "Wait — verification backlog" },
    { city: "LA", score: 38, signal: "Pilot — need 2 venue partners" },
  ],
  complaints: [
    { topic: "Wait time for verification", count: 34, severity: "medium" },
    { topic: "Can't find club in my city", count: 28, severity: "high" },
    { topic: "Event was full / no seats", count: 22, severity: "medium" },
    { topic: "Host didn't respond", count: 11, severity: "high" },
  ],
  communityHealth: {
    score: 86,
    label: "Healthy",
    activeWomenPct: 68,
    clubsThrivingPct: 72,
    safetyScore: 92,
  },
};

export const LAUNCH_READINESS = [
  { city: "New York City", women: 8750, clubs: 42, hosts: 110, partners: 58, readiness: 92, verdict: "Launch" },
  { city: "London", women: 1204, clubs: 8, hosts: 12, partners: 6, readiness: 48, verdict: "Wait" },
  { city: "Toronto", women: 882, clubs: 5, hosts: 9, partners: 4, readiness: 41, verdict: "Wait" },
  { city: "Los Angeles", women: 641, clubs: 3, hosts: 5, partners: 2, readiness: 35, verdict: "Wait" },
];
