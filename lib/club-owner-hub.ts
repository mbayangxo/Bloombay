export type HubCard = {
  title: string;
  desc: string;
  href: string;
  accent: "hot" | "barbie" | "ink";
  badgeKey?: "apps" | "zones" | "notifs";
  external?: boolean;
};

/** Can I run a thriving club? — grouped mission for hosts */
export const CLUB_OWNER_HUB: HubCard[] = [
  { title: "Clubhouse", desc: "Pulse · growth · what needs you", href: "/club-owner/dashboard", accent: "hot" },
  { title: "Analytics", desc: "Women, attendance %, retention", href: "/club-owner/analytics", accent: "hot" },
  { title: "Health alerts", desc: "Weak signals before they spread", href: "/club-owner/alerts", accent: "hot" },
  { title: "Club name & join", desc: "Open, paid, landing", href: "/club-owner/settings", accent: "barbie" },
  { title: "Crest identity", desc: "Symbol + accent · auto crest", href: "/club-owner/crest", accent: "hot" },
  { title: "Photos & story", desc: "Hero, tagline, gallery", href: "/club-owner/branding", accent: "barbie" },
  { title: "Club Mama kit", desc: "Upload templates · BloomBay objects", href: "/club-owner/customize", accent: "hot" },
  { title: "House rules", desc: "Everyone accepts before join", href: "/club-owner/rules", accent: "barbie" },
  { title: "Planner room", desc: "Private drafts · ideas · publish", href: "/club-owner/planner-room", accent: "hot" },
  { title: "Event calendar", desc: "Month · year · long-term plan", href: "/club-owner/calendar", accent: "barbie" },
  { title: "Events studio", desc: "Covers · draft · publish · QR", href: "/club-owner/events-studio", accent: "hot" },
  { title: "Gatherings", desc: "Create gathering · series", href: "/club-owner/gatherings", accent: "barbie" },
  { title: "Events & QR", desc: "Seats · tickets · door codes", href: "/club-owner/events", accent: "barbie" },
  { title: "Scan check-in", desc: "QR at the door", href: "/club-owner/scan", accent: "ink" },
  { title: "Attendance", desc: "Who came · when · no-shows", href: "/club-owner/attendance", accent: "barbie" },
  { title: "Women", desc: "Directory · roles · attendance", href: "/club-owner/members", accent: "hot" },
  { title: "Applications", desc: "Approve or reject join requests", href: "/club-owner/applications", accent: "barbie", badgeKey: "apps" },
  { title: "Committee teams", desc: "Events · marketing · volunteer · finance", href: "/club-owner/teams", accent: "hot" },
  { title: "Planner rooms", desc: "Tasks · assignees · due dates", href: "/club-owner/planner", accent: "barbie" },
  { title: "Volunteers", desc: "Shifts · check-in · hours", href: "/club-owner/volunteers", accent: "ink" },
  { title: "Resource library", desc: "Flyers · templates · sponsors", href: "/club-owner/resources", accent: "barbie" },
  { title: "Event templates", desc: "Duplicate annual events", href: "/club-owner/templates", accent: "hot" },
  { title: "Budgets & expenses", desc: "Deposits · sponsorships · P&L", href: "/club-owner/finances", accent: "ink" },
  { title: "Communication hub", desc: "Announcements · push · email · SMS", href: "/club-owner/comms", accent: "hot" },
  { title: "Event timeline", desc: "90 · 60 · 30 · 7 day milestones", href: "/club-owner/timeline", accent: "barbie" },
  { title: "Event archive", desc: "Memory · lessons learned", href: "/club-owner/archive", accent: "ink" },
  { title: "Multi-club portfolio", desc: "All clubs · pending · performance", href: "/club-owner/portfolio", accent: "hot" },
  { title: "Co-hosts & mods", desc: "Legacy staff roles", href: "/club-owner/team", accent: "ink" },
  { title: "Announcements", desc: "Quick Bloom ping", href: "/club-owner/ping", accent: "hot" },
  { title: "Notifications", desc: "Alerts & email prefs", href: "/club-owner/notifications", accent: "barbie", badgeKey: "notifs" },
  { title: "Zone requests", desc: "New chapters", href: "/club-owner/zones", accent: "barbie", badgeKey: "zones" },
  { title: "Moderation", desc: "Flagged posts", href: "/club-owner/moderation", accent: "ink" },
  { title: "Payments", desc: "Stripe & payouts (demo)", href: "/club-owner/payments", accent: "ink" },
  { title: "Audit log", desc: "Who did what", href: "/club-owner/audit", accent: "ink" },
  { title: "Reports", desc: "Export CSV", href: "/club-owner/reports", accent: "barbie" },
  { title: "My clubs", desc: "Switch club", href: "/club-owner/clubs", accent: "ink" },
  { title: "Preview club", desc: "Member landing", href: "/member/clubs/morning-run-club", accent: "barbie", external: true },
];
