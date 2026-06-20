/** BloomBay Mission Control — UI seed data (no Supabase schema) */

import type { GrowthTrend } from "./portal-dashboard-data";

export const MISSION_KPI = {
  totalWomen: { total: 8750, today: 48, week: 312, month: 1842, trend: "up" as GrowthTrend },
  clubHosts: { total: 1100, today: 6, week: 28, month: 142, trend: "up" as GrowthTrend },
  partners: { total: 582, today: 2, week: 9, month: 48, trend: "up" as GrowthTrend },
  pendingVerification: { total: 127, today: 23, week: 89, month: 127, trend: "up" as GrowthTrend },
  activeThisWeek: { total: 614, today: 89, week: 614, month: 2104, trend: "up" as GrowthTrend },
};

export const WOMEN_WAITING = [
  { label: "Waiting verification", count: 127, href: "/admin/verification", urgent: true },
  { label: "Waiting approval", count: 34, href: "/admin/applications?type=member", urgent: true },
  { label: "Waiting for club", count: 89, href: "/admin/clubs", urgent: false },
  { label: "Waiting for city launch", count: 412, href: "/admin/dashboard", urgent: false },
  { label: "Waiting for response", count: 18, href: "/admin/inbox", urgent: true },
];

export const REFERRAL_SOURCES = [
  { source: "Friend invites", count: 4211, percent: 40 },
  { source: "Organic", count: 2104, percent: 20 },
  { source: "Instagram", count: 1892, percent: 18 },
  { source: "TikTok", count: 982, percent: 9 },
  { source: "Website", count: 721, percent: 7 },
  { source: "Partner referral", count: 522, percent: 5 },
];

export const EVENTS_LIGHT = {
  thisWeek: 12,
  createdThisWeek: 4,
  seatsReserved: 186,
  attendanceRate: 78,
};

export const TOP_EVENTS = [
  { name: "Williamsburg Dinner Circle", metric: "Most viewed", value: 842 },
  { name: "Founders Brunch · Chelsea", metric: "Most joined", value: 124 },
  { name: "Book Club · Harlem", metric: "Most attended", value: 98 },
];

export const FUTURE_CURATORS = [
  { name: "Amanda R.", location: "Williamsburg", bloomScore: 94, role: "Club Host", factors: "12 referrals · verified" },
  { name: "Jordan T.", location: "Chelsea", bloomScore: 91, role: "Ambassador", factors: "High activity · 3 clubs" },
  { name: "Leila S.", location: "Harlem", bloomScore: 88, role: "Community Leader", factors: "Profile complete · faith club" },
  { name: "Morgan K.", location: "Brooklyn", bloomScore: 86, role: "Curator", factors: "Partner referrals · events" },
];

export const BLOOM_SCORES = {
  cities: [
    { name: "NYC", score: 84 },
    { name: "London", score: 52 },
    { name: "Toronto", score: 41 },
  ],
  clubs: [
    { name: "Book Club", score: 86 },
    { name: "Travel Club", score: 92 },
    { name: "Founders Club", score: 78 },
  ],
  sampleMember: { name: "Amanda R.", score: 94 },
  samplePartner: { name: "The Rose Room", score: 81 },
};

export const CLUB_CATALOG = [
  { name: "Book Clubs", interested: 1204, weekGrowth: 12, readiness: 86, trend: "up" as GrowthTrend },
  { name: "Dinner Clubs", interested: 998, weekGrowth: 9, readiness: 74, trend: "up" as GrowthTrend },
  { name: "Wellness", interested: 882, weekGrowth: 11, readiness: 65, trend: "up" as GrowthTrend },
  { name: "Founders", interested: 998, weekGrowth: 18, readiness: 78, trend: "up" as GrowthTrend },
  { name: "Travel", interested: 641, weekGrowth: 14, readiness: 68, trend: "up" as GrowthTrend },
  { name: "Faith", interested: 882, weekGrowth: 9, readiness: 71, trend: "up" as GrowthTrend },
  { name: "Creative Women", interested: 512, weekGrowth: 8, readiness: 72, trend: "up" as GrowthTrend },
  { name: "Muslim Women", interested: 441, weekGrowth: 10, readiness: 69, trend: "up" as GrowthTrend },
  { name: "Mothers", interested: 398, weekGrowth: 7, readiness: 66, trend: "steady" as GrowthTrend },
  { name: "Career Women", interested: 611, weekGrowth: 13, readiness: 75, trend: "up" as GrowthTrend },
];

export const CLUBS_WAITING_DETAIL = [
  { name: "Founders Club", women: 398, host: "Need Host", venue: "Need Venue", readiness: 78 },
  { name: "Faith Club", women: 127, host: "Need Host", venue: "Need Venue", readiness: 71 },
  { name: "Travel Club", women: 221, host: "Confirmed", venue: "Confirmed", readiness: 92 },
  { name: "Book Club", women: 312, host: "Confirmed", venue: "Searching", readiness: 88 },
];

export const SAFETY_REPORT_TYPES = [
  "Harassment",
  "Inappropriate Messages",
  "Fake Profile",
  "Spam",
  "Bullying",
  "Safety Concern",
  "Impersonation",
] as const;

export const TODAYS_BLOOM_LINES = [
  "48 women joined today.",
  "Williamsburg crossed 500 members.",
  "Faith club reached launch threshold.",
  "Three partner applications are waiting.",
  "Seven safety reports need review.",
] as const;

export const TAB_SHORTCUTS = [
  { label: "Applications waiting", count: 34, href: "/admin/applications?type=member" },
  { label: "Verification waiting", count: 127, href: "/admin/verification" },
  { label: "Safety concerns", count: 7, href: "/admin/safety" },
  { label: "Inbox messages", count: 18, href: "/admin/inbox" },
  { label: "Partner applications", count: 9, href: "/admin/partners" },
  { label: "Clubs waiting", count: 4, href: "/admin/clubs" },
] as const;

export const SAFETY_REPORT_COUNTS = [
  { type: "Harassment", count: 2 },
  { type: "Fake Profile", count: 1 },
  { type: "Safety Concern", count: 1 },
  { type: "Inappropriate Messages", count: 2 },
  { type: "Spam", count: 0 },
  { type: "Bullying", count: 1 },
  { type: "Impersonation", count: 0 },
] as const;

export const SAFETY_QUEUE = [
  {
    id: "s1",
    type: "Harassment",
    reporter: "Maya K.",
    reported: "Jordan T.",
    evidence: "Screenshot thread · 3 messages",
    date: "May 28",
    status: "open",
  },
  {
    id: "s2",
    type: "Fake Profile",
    reporter: "Priya L.",
    reported: "Alex R.",
    evidence: "Reverse image match flagged",
    date: "May 27",
    status: "open",
  },
  {
    id: "s3",
    type: "Safety Concern",
    reporter: "Amanda R. (Club Host)",
    reported: "Guest · Brooklyn dinner",
    evidence: "Venue incident report",
    date: "May 26",
    status: "reviewing",
  },
];

export const BLOCKED_MEMBERS = [
  { name: "Alex R.", reason: "Fake profile", date: "May 27", status: "Banned" },
  { name: "Chris M.", reason: "Harassment", date: "May 14", status: "Suspended" },
  { name: "Taylor S.", reason: "Spam", date: "Apr 30", status: "Restricted" },
];

export const TOP_CLUBS_PREVIEW = [
  { name: "Travel Club", score: 92 },
  { name: "Book Club", score: 88 },
  { name: "Founders Club", score: 78 },
] as const;

export const SAFETY_HEALTH = {
  openReports: 7,
  resolvedReports: 142,
  avgResolutionHours: 6.4,
  repeatOffenders: 2,
  safetyScore: 92,
};

export const INBOX_THREADS = [
  {
    id: "i1",
    name: "Sarah M.",
    category: "Verification",
    source: "Verification Questions",
    date: "Today",
    priority: "high",
    status: "unread",
    preview: "Submitted selfie — can you confirm?",
  },
  {
    id: "i2",
    name: "The Rose Room",
    category: "Partner",
    source: "Partner Questions",
    date: "Yesterday",
    priority: "medium",
    status: "open",
    preview: "Capacity for 40 — weekend availability?",
  },
  {
    id: "i3",
    name: "Amanda R.",
    category: "Club",
    source: "Club Questions",
    date: "May 26",
    priority: "medium",
    status: "open",
    preview: "Founders Club host onboarding",
  },
  {
    id: "i4",
    name: "Jordan T.",
    category: "Club",
    source: "Support Requests",
    date: "May 25",
    priority: "low",
    status: "resolved",
    preview: "Neighborhood not listed — resolved",
  },
  {
    id: "i5",
    name: "Anonymous",
    category: "Safety",
    source: "Safety Reports",
    date: "May 28",
    priority: "high",
    status: "unread",
    preview: "Linked to open safety queue item",
  },
  {
    id: "i6",
    name: "Maya K.",
    category: "Member",
    source: "Member Messages",
    date: "Today",
    priority: "medium",
    status: "unread",
    preview: "Can't find seats for Friday dinner",
  },
  {
    id: "i7",
    name: "Leila S.",
    category: "Curator",
    source: "Team · Girl curator",
    date: "Yesterday",
    priority: "medium",
    status: "open",
    preview: "Payment via Zelle — ready for May events",
  },
  {
    id: "i8",
    name: "Jordan T.",
    category: "Moderator",
    source: "Team · Moderator",
    date: "May 27",
    priority: "low",
    status: "open",
    preview: "Book club applications queue cleared",
  },
];

export const INBOX_STATS = {
  unread: 12,
  open: 28,
  resolved: 184,
  openMessages: 18,
  avgResponseHours: 3.8,
  oldestUnansweredHours: 14,
};

export const INBOX_SOURCES = [
  "Support Requests",
  "Safety Reports",
  "Verification Questions",
  "Club Questions",
  "Partner Questions",
  "General Feedback",
];
