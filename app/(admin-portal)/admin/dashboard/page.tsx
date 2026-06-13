"use client";

import { useState, type ReactElement } from "react";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const LIVE_STATS = [
  { label: "Women Waiting", value: "94", sub: "Join queue" },
  { label: "Welcomed Today", value: "3", sub: "New members" },
  { label: "Clubs Launched", value: "12", sub: "All time" },
  { label: "Open Seats", value: "8", sub: "This week" },
  { label: "Cities Near Launch", value: "3", sub: "Chicago · Atlanta · London" },
];

const CURATORS = [
  {
    name: "Amanda R.",
    neighborhood: "Williamsburg",
    clubs: ["Museum Club", "Book Club"],
    welcomed: 42,
    gatherings: 14,
    trust: 97,
    attendance: 91,
    status: "Active",
  },
  {
    name: "Yemi O.",
    neighborhood: "SoHo",
    clubs: ["Jazz & Wine", "Creative Writing"],
    welcomed: 38,
    gatherings: 11,
    trust: 94,
    attendance: 88,
    status: "Active",
  },
  {
    name: "Priya S.",
    neighborhood: "Brooklyn Heights",
    clubs: ["Soft Life", "Pilates Club"],
    welcomed: 29,
    gatherings: 8,
    trust: 91,
    attendance: 95,
    status: "Active",
  },
  {
    name: "Sofia K.",
    neighborhood: "Greenpoint",
    clubs: ["Indigenous African NYC"],
    welcomed: 24,
    gatherings: 6,
    trust: 89,
    attendance: 82,
    status: "Active",
  },
  {
    name: "Kezia N.",
    neighborhood: "Chelsea",
    clubs: ["Girl Tech Collective"],
    welcomed: 31,
    gatherings: 9,
    trust: 85,
    attendance: 90,
    status: "Pending",
  },
];

const CITIES = [
  { name: "NYC", status: "Active", women: 94, clubs: 12, seats: 8 },
  { name: "Chicago", status: "Opening Soon", women: 0, clubs: 0, seats: 0 },
  { name: "Atlanta", status: "Opening Soon", women: 0, clubs: 0, seats: 0 },
  { name: "London", status: "Opening Soon", women: 0, clubs: 0, seats: 0 },
];

const WOMEN_STATS = {
  verificationQueue: 17,
  pendingApplications: 24,
  memberGrowthThisWeek: 6,
  totalMembers: 94,
};

const HOSTS = [
  { name: "Ciara M.", venue: "The Parlour, SoHo",    events: 4, rating: 4.9, warnings: 0, archived: false },
  { name: "Nadia B.", venue: "Loft 19, Brooklyn",     events: 2, rating: 4.7, warnings: 1, archived: false },
  { name: "Tara L.",  venue: "The Den, West Village", events: 3, rating: 4.8, warnings: 0, archived: false },
  { name: "Dawn K.",  venue: "Studio K, Midtown",     events: 1, rating: 2.1, warnings: 2, archived: false },
];

const CLUBS = [
  { name: "African Girls Club",    city: "NYC", curator: "BloomBay",  members: 284, seats: 3, type: "hq",   attendance: 91, growth: "+18%", events: 12 },
  { name: "Soft Life Club NYC",    city: "NYC", curator: "BloomBay",  members: 312, seats: 1, type: "hq",   attendance: 87, growth: "+24%", events: 18 },
  { name: "Muslim Women NYC",      city: "NYC", curator: "BloomBay",  members: 76,  seats: 0, type: "hq",   attendance: 93, growth: "+9%",  events: 7  },
  { name: "Museum Club",           city: "NYC", curator: "Amanda R.", members: 18,  seats: 2, type: "user", attendance: 85, growth: "+5%",  events: 4  },
  { name: "Book Club",             city: "NYC", curator: "Amanda R.", members: 14,  seats: 1, type: "user", attendance: 80, growth: "+3%",  events: 6  },
  { name: "Jazz & Wine",           city: "NYC", curator: "Yemi O.",   members: 16,  seats: 3, type: "user", attendance: 78, growth: "+12%", events: 5  },
  { name: "Creative Writing",      city: "NYC", curator: "Yemi O.",   members: 12,  seats: 0, type: "user", attendance: 82, growth: "+7%",  events: 3  },
  { name: "Girl Tech Collective",  city: "NYC", curator: "Kezia N.",  members: 14,  seats: 4, type: "user", attendance: 70, growth: "+2%",  events: 2  },
  { name: "Pilates Club",          city: "NYC", curator: "Priya S.",  members: 9,   seats: 2, type: "user", attendance: 88, growth: "+15%", events: 8  },
  { name: "The Artist Circle",     city: "NYC", curator: "—",         members: 0,   seats: 0, type: "user", attendance: 0,  growth: "new",  events: 0  },
  { name: "Ladurée Society",       city: "NYC", curator: "—",         members: 6,   seats: 2, type: "user", attendance: 60, growth: "+1%",  events: 1  },
  { name: "Sunday Rooftop",        city: "NYC", curator: "—",         members: 8,   seats: 3, type: "user", attendance: 75, growth: "+4%",  events: 2  },
];

const OPEN_SEATS = [
  { club: "Jazz & Wine", date: "Jun 3", time: "7:00 PM", venue: "The Parlour, SoHo", seats: 3, curator: "Yemi O." },
  { club: "Girl Tech Collective", date: "Jun 4", time: "6:30 PM", venue: "Loft 19, Brooklyn", seats: 4, curator: "Kezia N." },
  { club: "Book Club", date: "Jun 5", time: "5:00 PM", venue: "The Den, West Village", seats: 1, curator: "Amanda R." },
  { club: "Soft Life", date: "Jun 7", time: "4:00 PM", venue: "Studio A, Brooklyn Heights", seats: 1, curator: "Priya S." },
  { club: "Sunday Rooftop", date: "Jun 8", time: "3:00 PM", venue: "Rooftop at 88, NYC", seats: 3, curator: "—" },
  { club: "Ladurée Society", date: "Jun 9", time: "7:30 PM", venue: "Ladurée SoHo", seats: 2, curator: "—" },
  { club: "Museum Club", date: "Jun 10", time: "2:00 PM", venue: "MoMA, NYC", seats: 2, curator: "Amanda R." },
  { club: "Pilates Club", date: "Jun 11", time: "8:00 AM", venue: "Studio Move, Brooklyn", seats: 2, curator: "Priya S." },
];

const PENDING_MEMBERS = [
  {
    id: 1, name: "Simone T.", neighborhood: "Crown Heights, Brooklyn", age: "28", city: "New York City",
    bio: "I'm a marketing director who moved to Brooklyn two years ago. Still finding my people here — I know they exist.",
    vibe: "The warm one — everyone feels safe around me",
    goals: ["Find my people in NYC", "Build real friendships"],
    interests: ["Brunch and dinners", "Museums and culture", "Fashion and style"],
    foundingMother: true, photo: null, submittedAt: "2h ago",
  },
  {
    id: 2, name: "Anya M.", neighborhood: "Williamsburg, Brooklyn", age: "25", city: "New York City",
    bio: "Software engineer, new to NYC from Toronto. I work remotely so it's harder to meet people. Looking for a real community.",
    vibe: "The driven one — always building something",
    goals: ["Network with ambitious women", "Get out of my routine"],
    interests: ["Building and tech", "City walks and cafés", "Gym and fitness"],
    foundingMother: false, photo: null, submittedAt: "4h ago",
  },
  {
    id: 3, name: "Remi O.", neighborhood: "Harlem, NYC", age: "31", city: "New York City",
    bio: "Nurse practitioner. I work nights and weekends so my social life has shrunk. I want to meet women who understand that.",
    vibe: "The calm one — peaceful vibes only",
    goals: ["Build real friendships", "Find my girl group"],
    interests: ["Wellness", "Faith community", "Brunch and dinners"],
    foundingMother: false, photo: null, submittedAt: "6h ago",
  },
  {
    id: 4, name: "Fatima A.", neighborhood: "Upper East Side, NYC", age: "29", city: "New York City",
    bio: "Architect and part-time ceramics artist. I have a good life but I want women to share it with. Food, culture, conversation.",
    vibe: "The thoughtful one — deep conversations always",
    goals: ["Find my people in NYC", "Get out of my routine"],
    interests: ["Museums and culture", "Fashion and style", "Brunch and dinners"],
    foundingMother: true, photo: null, submittedAt: "Yesterday",
  },
  {
    id: 5, name: "Zara W.", neighborhood: "Chelsea, NYC", age: "33", city: "New York City",
    bio: "Finance by day, Afrobeats at night. I'm Nigerian-British and moved here 3 years ago. Still feel like a transplant.",
    vibe: "The energetic one — always down for something",
    goals: ["Find my girl group", "Build real friendships"],
    interests: ["Afrobeats and events", "Fashion and style", "Brunch and dinners"],
    foundingMother: true, photo: null, submittedAt: "Yesterday",
  },
];

const SAFETY = [
  { type: "Reports", count: 3, items: ["Inappropriate behavior · Chelsea", "No-show host · SoHo", "Concern raised · Brooklyn"] },
  { type: "Flags", count: 2, items: ["Profile mismatch · Williamsburg", "Duplicate account · Midtown"] },
  { type: "Issues", count: 1, items: ["Payment dispute · West Village"] },
];

const MAILROOM = [
  { type: "Applications", unread: 24, items: ["Simone T. — wants to join", "Anya M. — wants to join", "Remi O. — wants to join", "Fatima A. — wants to join"] },
  { type: "Club Requests", unread: 7, items: ["New club: 'Ceramics & Chill'", "New club: 'Afrobeats Fitness'", "New club: 'Sunday Brunch Crew'"] },
  { type: "Partner Requests", unread: 4, items: ["Sézane NYC · Brand collab", "Cozy Co · Workspace partner", "The Wing revival · Events"] },
];

// ─── SVG Icons ────────────────────────────────────────────────────────────────

function IconGrid() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="1" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="9" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="1" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="9" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function IconMap() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M8 1C5.79 1 4 2.79 4 5c0 3.25 4 9 4 9s4-5.75 4-9c0-2.21-1.79-4-4-4z" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="8" cy="5" r="1.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function IconUsers() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="6" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M1 14c0-2.76 2.24-5 5-5s5 2.24 5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M11 7.5c1.38 0 2.5 1.12 2.5 2.5v1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M13.5 4.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function IconStar() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M8 1.5l1.85 3.74 4.15.6-3 2.93.71 4.12L8 10.77l-3.71 1.95.71-4.12L2 5.84l4.15-.6L8 1.5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

function IconCalendar() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="1.5" y="3" width="13" height="11.5" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M5 1.5V4M11 1.5V4M1.5 7h13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function IconEdit() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <path d="M11.5 2.5l2 2L5 13H3v-2L11.5 2.5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

function IconShield() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M8 1.5L2 4v4c0 3.31 2.67 6.4 6 7 3.33-.6 6-3.69 6-7V4L8 1.5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

function IconMail() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="1.5" y="3.5" width="13" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M1.5 5.5l6.5 4.5 6.5-4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function IconHome() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M8 1.5L1.5 7V14.5h4.5v-4h4v4h4.5V7L8 1.5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

function IconDiamond() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M8 1.5L14.5 8 8 14.5 1.5 8 8 1.5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

// ─── Nav config ───────────────────────────────────────────────────────────────

type Section =
  | "overview"
  | "pending"
  | "cities"
  | "women"
  | "curators"
  | "hosts"
  | "clubs"
  | "open-seats"
  | "happenings"
  | "safety"
  | "mailroom"
  | "city-trending";

const NAV: { id: Section; label: string; Icon: () => ReactElement; badge?: number }[] = [
  { id: "overview", label: "Overview", Icon: IconGrid },
  { id: "pending", label: "Member Queue", Icon: IconUsers, badge: 24 },
  { id: "cities", label: "Cities", Icon: IconMap },
  { id: "women", label: "Women", Icon: IconUsers },
  { id: "curators", label: "Curators", Icon: IconStar },
  { id: "hosts", label: "Hosts", Icon: IconHome },
  { id: "clubs", label: "Clubs", Icon: IconDiamond },
  { id: "open-seats", label: "Open Seats", Icon: IconCalendar },
  { id: "happenings", label: "Happenings", Icon: IconCalendar },
  { id: "city-trending", label: "City Trending", Icon: IconCalendar, badge: 0 },
  { id: "safety", label: "Safety Center", Icon: IconShield, badge: 6 },
  { id: "mailroom", label: "Mailroom", Icon: IconMail, badge: 35 },
];

// ─── Shared sub-components ────────────────────────────────────────────────────

function StatCard({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div
      className="rounded-2xl px-5 py-5 flex flex-col gap-1"
      style={{
        background: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(255,255,255,0.07)",
        boxShadow: "0 2px 12px rgba(0,0,0,0.3)",
      }}
    >
      <p className="text-[11px] font-bold tracking-wider uppercase" style={{ color: "rgba(255,255,255,0.35)" }}>
        {label}
      </p>
      <p className="text-4xl font-bold leading-none mt-1" style={{ color: "#FF1F7D" }}>
        {value}
      </p>
      <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>
        {sub}
      </p>
    </div>
  );
}

function ScoreBar({ score, color = "#FF1F7D" }: { score: number; color?: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 rounded-full h-1.5" style={{ background: "rgba(255,255,255,0.1)" }}>
        <div
          className="h-1.5 rounded-full"
          style={{ width: `${score}%`, background: color }}
        />
      </div>
      <span className="text-xs font-bold w-7 text-right" style={{ color }}>
        {score}
      </span>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const isActive = status === "Active";
  return (
    <span
      className="text-xs font-bold px-2.5 py-1 rounded-full"
      style={{
        background: isActive ? "rgba(255,31,125,0.15)" : "rgba(255,255,255,0.08)",
        color: isActive ? "#FF1F7D" : "rgba(255,255,255,0.4)",
        border: isActive ? "1px solid rgba(255,31,125,0.3)" : "1px solid rgba(255,255,255,0.1)",
      }}
    >
      {status}
    </span>
  );
}

function SectionHeader({ title, sub, category }: { title: string; sub?: string; category?: string }) {
  return (
    <div className="mb-6">
      {category && (
        <span
          className="inline-block text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full mb-3"
          style={{ background: "rgba(255,31,125,0.15)", color: "#FF1F7D", border: "1px solid rgba(255,31,125,0.25)" }}
        >
          {category}
        </span>
      )}
      <h2 className="text-2xl font-bold leading-tight">{title}</h2>
      {sub && (
        <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.4)" }}>
          {sub}
        </p>
      )}
    </div>
  );
}

// ─── Section: Overview ────────────────────────────────────────────────────────

function OverviewSection() {
  return (
    <div>
      <SectionHeader
        title="Mission Control"
        sub="Live operations — BloomBay is growing."
        category="Overview"
      />

      {/* Live stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3 px-0 md:px-0">
        {LIVE_STATS.slice(0, 4).map((s) => (
          <StatCard key={s.label} label={s.label} value={s.value} sub={s.sub} />
        ))}
      </div>
      <div className="mb-8">
        <StatCard label={LIVE_STATS[4].label} value={LIVE_STATS[4].value} sub={LIVE_STATS[4].sub} />
      </div>

      {/* Curator Leaderboard */}
      <div
        className="rounded-2xl p-6"
        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
      >
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-base font-bold tracking-wide uppercase" style={{ color: "rgba(255,255,255,0.7)" }}>
            Curator Leaderboard
          </h3>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: "rgba(255,31,125,0.15)", color: "#FF1F7D" }}>
            Top 5
          </span>
        </div>
        <p className="text-xs mb-5" style={{ color: "rgba(255,255,255,0.3)" }}>
          The women creating culture — ranked by Trust Score
        </p>

        <div className="flex flex-col gap-0">
          {CURATORS.map((c, i) => (
            <div
              key={c.name}
              className="flex items-center gap-5 py-4"
              style={{ borderBottom: i < CURATORS.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none" }}
            >
              {/* Rank */}
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                style={
                  i === 0
                    ? { background: "#FF1F7D", color: "white" }
                    : { background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.4)" }
                }
              >
                {i + 1}
              </div>

              {/* Name + neighborhood */}
              <div className="w-44 flex-shrink-0">
                <p className="text-sm font-semibold">{c.name}</p>
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
                  {c.neighborhood}
                </p>
              </div>

              {/* Clubs */}
              <div className="flex-1 flex flex-wrap gap-1">
                {c.clubs.map((club) => (
                  <span
                    key={club}
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{ background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.5)" }}
                  >
                    {club}
                  </span>
                ))}
              </div>

              {/* Stats */}
              <div className="flex gap-6 flex-shrink-0 text-center">
                <div>
                  <p className="text-sm font-bold" style={{ color: "#FF1F7D" }}>{c.welcomed}</p>
                  <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>welcomed</p>
                </div>
                <div>
                  <p className="text-sm font-bold">{c.gatherings}</p>
                  <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>gatherings</p>
                </div>
              </div>

              {/* Trust score */}
              <div className="w-28 flex-shrink-0">
                <p className="text-xs mb-1" style={{ color: "rgba(255,255,255,0.35)" }}>Trust</p>
                <ScoreBar score={c.trust} />
              </div>

              {/* Status */}
              <div className="flex-shrink-0">
                <StatusBadge status={c.status} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Section: Cities ──────────────────────────────────────────────────────────

function CitiesSection() {
  return (
    <div>
      <SectionHeader title="Cities" sub="Where BloomBay lives and where she's going next." category="Geography" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {CITIES.map((city) => (
          <div
            key={city.name}
            className="rounded-2xl p-6 flex flex-col gap-4"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: city.status === "Active" ? "1px solid rgba(255,31,125,0.3)" : "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <div className="flex items-start justify-between">
              <h3 className="text-xl font-bold">{city.name}</h3>
              <StatusBadge status={city.status} />
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-baseline">
                <span className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>Women</span>
                <span className="text-2xl font-bold" style={{ color: city.women > 0 ? "#FF1F7D" : "rgba(255,255,255,0.2)" }}>
                  {city.women}
                </span>
              </div>
              <div className="h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
              <div className="flex justify-between items-baseline">
                <span className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>Clubs</span>
                <span className="text-xl font-bold" style={{ color: city.clubs > 0 ? "white" : "rgba(255,255,255,0.2)" }}>
                  {city.clubs}
                </span>
              </div>
              <div className="h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
              <div className="flex justify-between items-baseline">
                <span className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>Open Seats</span>
                <span className="text-xl font-bold" style={{ color: city.seats > 0 ? "white" : "rgba(255,255,255,0.2)" }}>
                  {city.seats}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Section: Pending Members ─────────────────────────────────────────────────

function PendingSection() {
  const [members, setMembers] = useState(PENDING_MEMBERS.map((m) => ({ ...m, status: "pending" as "pending" | "approved" | "declined" })));
  const [expanded, setExpanded] = useState<number | null>(null);
  const [declineNote, setDeclineNote] = useState<Record<number, string>>({});
  const [toast, setToast] = useState<string | null>(null);

  const pending = members.filter((m) => m.status === "pending");
  const reviewed = members.filter((m) => m.status !== "pending");

  function showToast(message: string) {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  }

  function approve(id: number) {
    const member = members.find((m) => m.id === id);
    const name = member ? member.name.split(" ")[0] : "her";
    setMembers((prev) => prev.map((m) => m.id === id ? { ...m, status: "approved" } : m));
    setExpanded(null);
    showToast("✓ Approved — invite sent to " + name);
  }

  function decline(id: number) {
    setMembers((prev) => prev.map((m) => m.id === id ? { ...m, status: "declined" } : m));
    setExpanded(null);
    showToast("Application declined");
  }

  return (
    <div>
      <SectionHeader
        title="Member Queue"
        sub={`${pending.length} pending review · ${reviewed.filter((m) => m.status === "approved").length} approved today`}
        category="Applications"
      />

      {/* Stats strip */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {[
          { label: "Pending Review", value: String(pending.length), sub: "Awaiting Yande" },
          { label: "Approved Today", value: String(reviewed.filter((m) => m.status === "approved").length), sub: "Sent welcome email" },
          { label: "Total Waitlist", value: "1,847", sub: "NYC" },
        ].map((s) => <StatCard key={s.label} {...s} />)}
      </div>

      {/* Review note */}
      <div
        className="rounded-2xl px-5 py-4 mb-6 flex items-start gap-3"
        style={{ background: "rgba(255,31,125,0.08)", border: "1px solid rgba(255,31,125,0.2)" }}
      >
        <div className="w-2 h-2 rounded-full mt-1 flex-shrink-0 animate-pulse" style={{ background: "#FF1F7D" }} />
        <div>
          <p className="text-sm font-bold" style={{ color: "#FF1F7D" }}>Review every member personally</p>
          <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.5)" }}>
            Check photo clarity, bio authenticity, and profile completeness. Approved women receive an immediate email + SMS invite to sign in.
          </p>
        </div>
      </div>

      {/* Pending cards */}
      <div className="flex flex-col gap-4 mb-8">
        {pending.length === 0 ? (
          <div className="rounded-2xl p-8 text-center" style={{ background: "rgba(255,255,255,0.04)" }}>
            <p className="text-white/40 text-sm">No pending applications — queue is clear.</p>
          </div>
        ) : pending.map((m) => {
          const isOpen = expanded === m.id;
          return (
            <div
              key={m.id}
              className="rounded-2xl overflow-hidden"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderLeft: "4px solid #FF1F7D",
                boxShadow: "0 2px 16px rgba(0,0,0,0.25)",
              }}
            >
              {/* Summary row */}
              <button
                onClick={() => setExpanded(isOpen ? null : m.id)}
                className="w-full px-5 py-4 flex items-center gap-4 text-left"
              >
                {/* Photo placeholder */}
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold"
                  style={{ background: "#FF1F7D", color: "white" }}
                >
                  {m.name[0]}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="font-bold text-sm text-white">{m.name}</p>
                    {m.foundingMother && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: "#FF1F7D", color: "white" }}>
                        FOUNDING MOTHER
                      </span>
                    )}
                  </div>
                  <p className="text-xs truncate" style={{ color: "rgba(255,255,255,0.4)" }}>
                    {m.neighborhood} · {m.age}yo · {m.submittedAt}
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={(e) => { e.stopPropagation(); approve(m.id); }}
                    className="px-3 py-1.5 rounded-full text-xs font-bold transition-all"
                    style={{ background: "#FF1F7D", color: "white" }}
                  >
                    Approve
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); decline(m.id); }}
                    className="px-3 py-1.5 rounded-full text-xs font-bold transition-all"
                    style={{ background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)" }}
                  >
                    Decline
                  </button>
                  <svg
                    width="12" height="12" viewBox="0 0 12 12" fill="none"
                    style={{ color: "rgba(255,255,255,0.3)", transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}
                  >
                    <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </div>
              </button>

              {/* Expanded detail */}
              {isOpen && (
                <div className="px-5 pb-5 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                  <div className="pt-4 grid md:grid-cols-2 gap-5">
                    {/* Left: photo + bio */}
                    <div className="flex flex-col gap-4">
                      {/* Photo area */}
                      <div>
                        <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: "rgba(255,255,255,0.35)" }}>PHOTO</p>
                        <div
                          className="w-full h-48 rounded-2xl flex flex-col items-center justify-center gap-2"
                          style={{ background: "rgba(255,255,255,0.04)", border: "1px dashed rgba(255,255,255,0.15)" }}
                        >
                          <div
                            className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold"
                            style={{ background: "#FF1F7D", color: "white" }}
                          >
                            {m.name[0]}
                          </div>
                          <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>Photo submitted — {m.name.split(" ")[0]}</p>
                          <p className="text-[10px] px-4 text-center" style={{ color: "rgba(255,255,255,0.2)" }}>Photo submitted for review</p>
                        </div>
                      </div>

                      {/* Bio */}
                      <div>
                        <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: "rgba(255,255,255,0.35)" }}>BIO</p>
                        <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.7)" }}>&ldquo;{m.bio}&rdquo;</p>
                      </div>

                      <div>
                        <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: "rgba(255,255,255,0.35)" }}>VIBE</p>
                        <p className="text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>{m.vibe}</p>
                      </div>
                    </div>

                    {/* Right: profile details */}
                    <div className="flex flex-col gap-4">
                      <div>
                        <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: "rgba(255,255,255,0.35)" }}>GOALS</p>
                        <div className="flex flex-wrap gap-1.5">
                          {m.goals.map((g) => (
                            <span key={g} className="text-xs px-2.5 py-1 rounded-full" style={{ background: "rgba(255,31,125,0.15)", color: "#FF1F7D" }}>{g}</span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: "rgba(255,255,255,0.35)" }}>INTERESTS</p>
                        <div className="flex flex-wrap gap-1.5">
                          {m.interests.map((i) => (
                            <span key={i} className="text-xs px-2.5 py-1 rounded-full" style={{ background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.5)" }}>{i}</span>
                          ))}
                        </div>
                      </div>
                      {m.foundingMother && (
                        <div
                          className="rounded-xl px-4 py-3"
                          style={{ background: "rgba(255,31,125,0.1)", border: "1px solid rgba(255,31,125,0.2)" }}
                        >
                          <p className="text-xs font-bold" style={{ color: "#FF1F7D" }}>★ Founding Mother candidate</p>
                          <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>She checked the Founding Mothers box on the waitlist.</p>
                        </div>
                      )}

                      {/* Decision */}
                      <div className="flex flex-col gap-2 pt-2">
                        <button
                          onClick={() => approve(m.id)}
                          className="w-full py-3 rounded-full font-bold text-sm"
                          style={{ background: "#FF1F7D", color: "white" }}
                        >
                          ✓ Approve — send her invite
                        </button>
                        <div className="flex flex-col gap-1.5">
                          <textarea
                            value={declineNote[m.id] ?? ""}
                            onChange={(e) => setDeclineNote((p) => ({ ...p, [m.id]: e.target.value }))}
                            placeholder="Optional note for declining (not shown to applicant)…"
                            rows={2}
                            className="w-full px-3 py-2.5 rounded-xl text-xs resize-none outline-none"
                            style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.1)" }}
                          />
                          <button
                            onClick={() => decline(m.id)}
                            className="w-full py-2.5 rounded-full text-xs font-bold"
                            style={{ background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.5)" }}
                          >
                            Decline application
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Reviewed */}
      {reviewed.length > 0 && (
        <div>
          <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "rgba(255,255,255,0.3)" }}>REVIEWED TODAY</p>
          <div className="flex flex-col gap-2">
            {reviewed.map((m) => (
              <div
                key={m.id}
                className="rounded-xl px-4 py-3 flex items-center gap-3"
                style={{ background: "rgba(255,255,255,0.03)" }}
              >
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ background: "#FF1F7D", color: "white" }}>
                  {m.name[0]}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white">{m.name}</p>
                  <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>{m.neighborhood}</p>
                </div>
                <span
                  className="text-xs font-bold px-2.5 py-1 rounded-full"
                  style={m.status === "approved"
                    ? { background: "rgba(255,31,125,0.15)", color: "#FF1F7D" }
                    : { background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.35)" }
                  }
                >
                  {m.status === "approved" ? "Approved ✓" : "Declined"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 px-5 py-3 rounded-full text-sm font-bold text-white z-50" style={{ background: "#FF1F7D", boxShadow: "0 4px 20px rgba(255,31,125,0.4)" }}>
          {toast}
        </div>
      )}
    </div>
  );
}

// ─── Section: Women ───────────────────────────────────────────────────────────

function WomenSection() {
  return (
    <div>
      <SectionHeader title="Women" sub="Verification queue, applications, and member growth." category="Community" />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 px-0 md:px-0">
        {[
          { label: "Total Members", value: String(WOMEN_STATS.totalMembers), sub: "Active in BloomBay" },
          { label: "Verification Queue", value: String(WOMEN_STATS.verificationQueue), sub: "Awaiting review" },
          { label: "Applications", value: String(WOMEN_STATS.pendingApplications), sub: "Pending approval" },
          { label: "Growth This Week", value: `+${WOMEN_STATS.memberGrowthThisWeek}`, sub: "New members" },
        ].map((s) => (
          <StatCard key={s.label} label={s.label} value={s.value} sub={s.sub} />
        ))}
      </div>

      {/* Verification queue */}
      <div
        className="rounded-2xl p-6 mb-4"
        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.5)" }}>
            Verification Queue
          </h3>
          <span
            className="text-xs font-bold px-2.5 py-1 rounded-full"
            style={{ background: "rgba(255,31,125,0.15)", color: "#FF1F7D" }}
          >
            {WOMEN_STATS.verificationQueue} pending
          </span>
        </div>
        <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
          17 women are awaiting identity verification before they can access clubs and open seats.
        </p>
        <button className="text-xs font-bold px-3 py-1.5 rounded-full mt-2 inline-block" style={{ background: "#FF1F7D", color: "white" }}>
          Review Queue →
        </button>
      </div>

      {/* Applications */}
      <div
        className="rounded-2xl p-6"
        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.5)" }}>
            Applications
          </h3>
          <span
            className="text-xs font-bold px-2.5 py-1 rounded-full"
            style={{ background: "rgba(255,31,125,0.15)", color: "#FF1F7D" }}
          >
            {WOMEN_STATS.pendingApplications} unread
          </span>
        </div>
        <div className="flex flex-col gap-2">
          {["Simone T.", "Anya M.", "Remi O.", "Fatima A.", "Ciara P."].map((name, i) => (
            <div
              key={i}
              className="flex items-center justify-between py-2.5"
              style={{ borderBottom: i < 4 ? "1px solid rgba(255,255,255,0.06)" : "none" }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{ background: "rgba(255,31,125,0.15)", color: "#FF1F7D" }}
                >
                  {name[0]}
                </div>
                <span className="text-sm font-medium">{name}</span>
              </div>
              <span className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>Wants to join</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Section: Curators ────────────────────────────────────────────────────────

function CuratorsSection() {
  return (
    <div>
      <SectionHeader title="Curators" sub="The women creating culture in BloomBay." category="Community" />
      <div className="grid grid-cols-1 gap-4">
        {CURATORS.map((c) => (
          <div
            key={c.name}
            className="rounded-2xl p-6"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <div className="flex items-start gap-6">
              {/* Avatar */}
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0"
                style={{ background: "rgba(255,31,125,0.15)", color: "#FF1F7D" }}
              >
                {c.name[0]}
              </div>

              {/* Main info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-base font-bold">{c.name}</h3>
                  <StatusBadge status={c.status} />
                </div>
                <p className="text-xs mb-3" style={{ color: "rgba(255,255,255,0.4)" }}>
                  {c.neighborhood}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {c.clubs.map((club) => (
                    <span
                      key={club}
                      className="text-xs px-2.5 py-1 rounded-full"
                      style={{ background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.55)" }}
                    >
                      {club}
                    </span>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="flex gap-8 flex-shrink-0 text-center">
                <div>
                  <p className="text-2xl font-bold" style={{ color: "#FF1F7D" }}>{c.welcomed}</p>
                  <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>Women Welcomed</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">{c.gatherings}</p>
                  <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>Gatherings</p>
                </div>
              </div>

              {/* Scores */}
              <div className="w-36 flex-shrink-0 flex flex-col gap-3">
                <div>
                  <p className="text-xs mb-1.5" style={{ color: "rgba(255,255,255,0.35)" }}>Trust Score</p>
                  <ScoreBar score={c.trust} color="#FF1F7D" />
                </div>
                <div>
                  <p className="text-xs mb-1.5" style={{ color: "rgba(255,255,255,0.35)" }}>Attendance</p>
                  <ScoreBar score={c.attendance} color="rgba(255,255,255,0.5)" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Section: Hosts ───────────────────────────────────────────────────────────

function HostsSection() {
  type HostRecord = typeof HOSTS[number] & { warnings: number; archived: boolean };
  const [hosts, setHosts] = useState<HostRecord[]>(HOSTS as HostRecord[]);
  const [toast, setToast] = useState<string | null>(null);
  function showToast(msg: string) { setToast(msg); setTimeout(() => setToast(null), 3000); }

  function warnHost(name: string) {
    setHosts((prev) => prev.map((h) => {
      if (h.name !== name) return h;
      const next = h.warnings + 1;
      return { ...h, warnings: next, archived: next >= 3 };
    }));
  }

  function unarchiveHost(name: string) {
    setHosts((prev) => prev.map((h) => h.name === name ? { ...h, archived: false, warnings: 0 } : h));
  }

  return (
    <div>
      <SectionHeader title="Hosts" sub="Venues and event hosts. 3 warnings = soft archive." category="Community" />

      <div className="grid grid-cols-2 gap-4">
        {hosts.map((h) => {
          const isAtRisk = h.warnings >= 1 && !h.archived;
          const isArchived = h.archived;
          return (
            <div
              key={h.name}
              className="rounded-2xl p-6"
              style={{
                background: isArchived ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.05)",
                border: isArchived ? "1px solid rgba(255,255,255,0.05)" : isAtRisk ? "1px solid rgba(255,100,0,0.25)" : "1px solid rgba(255,255,255,0.07)",
                opacity: isArchived ? 0.6 : 1,
              }}
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-base font-bold"
                  style={{ background: isArchived ? "rgba(255,255,255,0.06)" : "rgba(255,31,125,0.15)", color: isArchived ? "rgba(255,255,255,0.3)" : "#FF1F7D" }}
                >
                  {h.name[0]}
                </div>
                <div className="flex items-center gap-2">
                  {/* Warning pips */}
                  {h.warnings > 0 && (
                    <div className="flex gap-1">
                      {[1, 2, 3].map((n) => (
                        <div
                          key={n}
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ background: n <= h.warnings ? (h.warnings >= 3 ? "#FF1F7D" : "#FF1F7D") : "rgba(255,255,255,0.1)" }}
                        />
                      ))}
                    </div>
                  )}
                  {isArchived && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.4)" }}>
                      ARCHIVED
                    </span>
                  )}
                </div>
              </div>

              <h3 className="text-base font-bold mb-0.5">{h.name}</h3>
              <p className="text-xs mb-4" style={{ color: "rgba(255,255,255,0.4)" }}>{h.venue}</p>

              <div className="flex gap-6 mb-4">
                <div>
                  <p className="text-xl font-bold" style={{ color: "#FF1F7D" }}>{h.events}</p>
                  <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>Events</p>
                </div>
                <div>
                  <p className="text-xl font-bold" style={{ color: h.rating < 3.5 ? "#FF1F7D" : "white" }}>{h.rating}</p>
                  <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>Rating</p>
                </div>
                <div>
                  <p className="text-xl font-bold" style={{ color: h.warnings > 0 ? "#FF1F7D" : "rgba(255,255,255,0.2)" }}>{h.warnings}/3</p>
                  <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>Warnings</p>
                </div>
              </div>

              {isArchived ? (
                <div className="flex flex-col gap-2">
                  <p className="text-xs rounded-xl p-3" style={{ background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.5)" }}>
                    This host has been soft archived after 3 warnings. They have been notified.
                  </p>
                  <button
                    onClick={() => unarchiveHost(h.name)}
                    className="px-4 py-2 rounded-full text-xs font-bold transition-all"
                    style={{ background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.1)" }}
                  >
                    Reinstate Host
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => warnHost(h.name)}
                    className="flex-1 py-2 rounded-full text-xs font-bold transition-all"
                    style={h.warnings >= 2
                      ? { background: "#FF1F7D", color: "white" }
                      : { background: "rgba(255,31,125,0.15)", color: "#FF1F7D", border: "1px solid rgba(255,31,125,0.3)" }}
                  >
                    {h.warnings >= 2 ? "Archive Host" : `Warn (${h.warnings + 1} of 3)`}
                  </button>
                  <button
                    onClick={() => {}}
                    className="px-4 py-2 rounded-full text-xs font-bold transition-all"
                    style={{ background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.1)" }}
                  >
                    Message
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 px-5 py-3 rounded-full text-sm font-bold text-white z-50" style={{ background: "#FF1F7D", boxShadow: "0 4px 20px rgba(255,31,125,0.4)" }}>
          {toast}
        </div>
      )}
    </div>
  );
}

// ─── Section: Clubs ───────────────────────────────────────────────────────────

function ClubsSection() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "hq" | "user">("all");
  const [toast, setToast] = useState<string | null>(null);
  function showToast(msg: string) { setToast(msg); setTimeout(() => setToast(null), 3000); }

  const shown = filter === "all" ? CLUBS : CLUBS.filter((c) => c.type === filter);
  const hqCount   = CLUBS.filter((c) => c.type === "hq").length;
  const userCount = CLUBS.filter((c) => c.type === "user").length;

  return (
    <div>
      <SectionHeader title="Clubs" sub={`${CLUBS.length} clubs · ${hqCount} HQ · ${userCount} user-created`} category="Community" />

      {/* Filter chips */}
      <div className="flex gap-2 mb-5">
        {(["all", "hq", "user"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="px-4 py-1.5 rounded-full text-xs font-bold capitalize transition-all"
            style={filter === f
              ? { background: "#FF1F7D", color: "white" }
              : { background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            {f === "all" ? "All Clubs" : f === "hq" ? "✦ HQ (Official)" : "User-Created"}
          </button>
        ))}
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
        {/* Table header */}
        <div
          className="grid grid-cols-[28px_1fr_80px_140px_70px_70px] px-5 py-3 text-xs font-bold uppercase tracking-widest"
          style={{ background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.3)" }}
        >
          <span />
          <span>Club</span>
          <span>City</span>
          <span>Curator</span>
          <span className="text-right">Members</span>
          <span className="text-right">Seats</span>
        </div>
        {shown.map((club, i) => (
          <div key={club.name}>
            <div
              className="grid grid-cols-[28px_1fr_80px_140px_70px_70px] px-5 py-4 items-center cursor-pointer transition-all"
              style={{
                background: expanded === club.name
                  ? "rgba(255,31,125,0.08)"
                  : i % 2 === 0
                    ? "transparent"
                    : "rgba(255,31,125,0.03)",
                borderTop: "1px solid rgba(255,255,255,0.05)",
              }}
              onClick={() => setExpanded(expanded === club.name ? null : club.name)}
            >
              {/* Expand chevron */}
              <svg
                width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5"
                style={{ transform: expanded === club.name ? "rotate(90deg)" : "none", transition: "transform 0.2s" }}
              >
                <polyline points="4 2 8 6 4 10" />
              </svg>

              <div className="flex items-center gap-2 min-w-0">
                <span className="text-sm font-medium truncate">{club.name}</span>
                {club.type === "hq" && (
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0" style={{ background: "rgba(255,31,125,0.2)", color: "#FF1F7D" }}>✦ HQ</span>
                )}
              </div>
              <span className="text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>{club.city}</span>
              <span className="text-sm truncate" style={{ color: "rgba(255,255,255,0.45)" }}>{club.curator}</span>
              <span className="text-sm font-bold text-right">{club.members}</span>
              <span className="text-sm font-bold text-right" style={{ color: club.seats > 0 ? "#FF1F7D" : "rgba(255,255,255,0.2)" }}>
                {club.seats}
              </span>
            </div>

            {/* Analytics panel */}
            {expanded === club.name && (
              <div
                className="px-8 py-5 grid grid-cols-4 gap-4"
                style={{ background: "rgba(255,31,125,0.05)", borderTop: "1px solid rgba(255,31,125,0.15)" }}
              >
                <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                  <p className="text-xs uppercase tracking-widest mb-1" style={{ color: "rgba(255,255,255,0.35)" }}>Members</p>
                  <p className="text-2xl font-bold" style={{ color: "#FF1F7D" }}>{club.members}</p>
                  <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>Growth {club.growth}</p>
                </div>
                <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                  <p className="text-xs uppercase tracking-widest mb-1" style={{ color: "rgba(255,255,255,0.35)" }}>Events Run</p>
                  <p className="text-2xl font-bold">{club.events}</p>
                  <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>All time</p>
                </div>
                <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                  <p className="text-xs uppercase tracking-widest mb-1" style={{ color: "rgba(255,255,255,0.35)" }}>Attendance</p>
                  <p className="text-2xl font-bold" style={{ color: club.attendance >= 80 ? "#FF1F7D" : "rgba(255,255,255,0.6)" }}>{club.attendance}%</p>
                  <ScoreBar score={club.attendance} color="#FF1F7D" />
                </div>
                <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                  <p className="text-xs uppercase tracking-widest mb-1" style={{ color: "rgba(255,255,255,0.35)" }}>Open Seats</p>
                  <p className="text-2xl font-bold" style={{ color: club.seats > 0 ? "#FF1F7D" : "rgba(255,255,255,0.2)" }}>{club.seats}</p>
                  <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>Available now</p>
                </div>
                <div className="col-span-4 flex gap-2 mt-1">
                  <span className="text-xs px-3 py-1.5 rounded-full font-semibold" style={{ background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.5)" }}>
                    Type: {club.type === "hq" ? "✦ HQ Official" : "User-Created"}
                  </span>
                  <span className="text-xs px-3 py-1.5 rounded-full font-semibold" style={{ background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.5)" }}>
                    Curator: {club.curator}
                  </span>
                  <button onClick={() => {}} className="text-xs px-3 py-1.5 rounded-full font-semibold transition-all" style={{ background: "rgba(255,31,125,0.15)", color: "#FF1F7D", border: "1px solid rgba(255,31,125,0.3)" }}>
                    Edit Club
                  </button>
                  <button onClick={() => {}} className="text-xs px-3 py-1.5 rounded-full font-semibold transition-all" style={{ background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.4)", border: "1px solid rgba(255,255,255,0.1)" }}>
                    Archive
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 px-5 py-3 rounded-full text-sm font-bold text-white z-50" style={{ background: "#FF1F7D", boxShadow: "0 4px 20px rgba(255,31,125,0.4)" }}>
          {toast}
        </div>
      )}
    </div>
  );
}

// ─── Section: Open Seats ──────────────────────────────────────────────────────

const EVENT_ANALYTICS = {
  totalOpenSeats:   OPEN_SEATS.reduce((s, e) => s + e.seats, 0),
  totalEvents:      OPEN_SEATS.length,
  avgSeats:         Math.round(OPEN_SEATS.reduce((s, e) => s + e.seats, 0) / OPEN_SEATS.length),
  topEvent:         [...OPEN_SEATS].sort((a, b) => b.seats - a.seats)[0],
  lowestEvent:      [...OPEN_SEATS].sort((a, b) => a.seats - b.seats)[0],
};

function OpenSeatsSection() {
  return (
    <div>
      <SectionHeader title="Events & Open Seats" sub="Live analytics — upcoming gatherings and availability." category="Operations" />

      {/* Analytics summary row */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        <div className="rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)" }}>
          <p className="text-xs uppercase tracking-widest mb-1" style={{ color: "rgba(255,255,255,0.35)" }}>Open Seats</p>
          <p className="text-4xl font-bold" style={{ color: "#FF1F7D" }}>{EVENT_ANALYTICS.totalOpenSeats}</p>
          <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>Across {EVENT_ANALYTICS.totalEvents} events</p>
        </div>
        <div className="rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)" }}>
          <p className="text-xs uppercase tracking-widest mb-1" style={{ color: "rgba(255,255,255,0.35)" }}>Avg Seats/Event</p>
          <p className="text-4xl font-bold">{EVENT_ANALYTICS.avgSeats}</p>
          <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>Per gathering</p>
        </div>
        <div className="rounded-2xl p-5" style={{ background: "rgba(255,31,125,0.08)", border: "1px solid rgba(255,31,125,0.2)" }}>
          <p className="text-xs uppercase tracking-widest mb-1" style={{ color: "rgba(255,255,255,0.35)" }}>Most Available</p>
          <p className="text-sm font-bold truncate" style={{ color: "#FF1F7D" }}>{EVENT_ANALYTICS.topEvent.club}</p>
          <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.35)" }}>{EVENT_ANALYTICS.topEvent.seats} seats open</p>
        </div>
        <div className="rounded-2xl p-5" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)" }}>
          <p className="text-xs uppercase tracking-widest mb-1" style={{ color: "rgba(255,255,255,0.35)" }}>Filling Fast</p>
          <p className="text-sm font-bold truncate" style={{ color: "rgba(255,255,255,0.8)" }}>{EVENT_ANALYTICS.lowestEvent.club}</p>
          <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.35)" }}>{EVENT_ANALYTICS.lowestEvent.seats} seat left</p>
        </div>
      </div>

      {/* Top curators (by events in open seats) */}
      <div className="rounded-2xl p-5 mb-6" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
        <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "rgba(255,255,255,0.4)" }}>Top Curators This Cycle</p>
        <div className="flex gap-4">
          {Object.entries(
            OPEN_SEATS.reduce<Record<string, number>>((acc, e) => {
              if (e.curator !== "—") acc[e.curator] = (acc[e.curator] || 0) + 1;
              return acc;
            }, {})
          ).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([name, count]) => (
            <div key={name} className="flex items-center gap-2 px-3 py-2 rounded-full" style={{ background: "rgba(255,255,255,0.07)" }}>
              <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0" style={{ background: "rgba(255,31,125,0.2)", color: "#FF1F7D" }}>
                {name[0]}
              </div>
              <span className="text-xs font-semibold">{name}</span>
              <span className="text-xs font-bold" style={{ color: "#FF1F7D" }}>{count}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-3">
        {OPEN_SEATS.map((s, i) => (
          <div
            key={i}
            className="rounded-2xl px-6 py-5 flex items-center gap-6"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            {/* Date block */}
            <div
              className="w-16 h-16 rounded-xl flex flex-col items-center justify-center flex-shrink-0"
              style={{ background: "rgba(255,31,125,0.12)", border: "1px solid rgba(255,31,125,0.2)" }}
            >
              <p className="text-xs font-bold" style={{ color: "#FF1F7D" }}>
                {s.date.split(" ")[0].toUpperCase()}
              </p>
              <p className="text-2xl font-bold leading-none" style={{ color: "#FF1F7D" }}>
                {s.date.split(" ")[1]}
              </p>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-bold">{s.club}</h3>
              <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>
                {s.venue} · {s.time}
              </p>
            </div>

            {/* Curator */}
            <div className="flex-shrink-0 text-right">
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>Curator</p>
              <p className="text-sm font-medium">{s.curator}</p>
            </div>

            {/* Seats badge */}
            <div
              className="flex-shrink-0 w-16 h-16 rounded-xl flex flex-col items-center justify-center"
              style={{ background: "rgba(255,255,255,0.05)" }}
            >
              <p className="text-2xl font-bold" style={{ color: "#FF1F7D" }}>{s.seats}</p>
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>seats</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Section: City Trending ───────────────────────────────────────────────────
// Yande's AI curator submits spots here every Wednesday.
// Founder approves, denies, or reorders before they go live on the City page.

const CATEGORY_COLORS: Record<string, string> = {
  "pop-up": "#FF1F7D", dining: "#E65C00", drinks: "#7B1FA2",
  art: "#1565C0", nightlife: "#C62828", shopping: "#2E7D32",
  brunch: "#F9A825", coffee: "#5D4037", wellness: "#388E3C",
  event: "#FF7744", other: "#888",
};

function CityTrendingSection() {
  const [items, setItems] = useState([
    { id: "1", name: "Soft-Serve & Frozen Yogurt Wave",      category: "dining",   source: "TikTok NYC",    badge: "GOING VIRAL", status: "pending" as const, description: "Every shop in lower Manhattan is packed right now. The queue at Morgenstern's has been wild all week.", yandeNote: "The city is in its soft-serve era. If you haven't been to Morgenstern's yet, this is your sign." },
    { id: "2", name: "Dior Beauty Pop-Up — Madison Ave",     category: "pop-up",   source: "Instagram",     badge: "FREE",         status: "pending" as const, description: "Free fragrance sampling, mini makeovers, and a photo moment. Running through June 22.", yandeNote: "Free Dior. You can literally walk in and walk out smelling like money. Go." },
    { id: "3", name: "Brooklyn Night Market",                category: "event",    source: "Eventbrite",    badge: null,           status: "pending" as const, description: "Williamsburg waterfront. 60+ vendors, live music, golden hour views.", yandeNote: "Saturday golden hour at the waterfront with 60 food vendors. Bring your situationship." },
    { id: "4", name: "Sample Sale: Sandro & Maje",          category: "shopping", source: "Time Out NYC",  badge: "NEW",          status: "pending" as const, description: "Up to 70% off. SoHo, this weekend only.", yandeNote: "70% off Sandro. You know what to do." },
    { id: "5", name: "MoMA: Yoko Ono Retrospective",        category: "art",      source: "Eater NYC",     badge: null,           status: "pending" as const, description: "Opens June 15. Major retrospective, tickets selling fast.", yandeNote: "This one is going to be everywhere. See it before everyone else does." },
    { id: "6", name: "Jazz at Lincoln Center Rooftop",      category: "nightlife", source: "TikTok NYC",   badge: null,           status: "pending" as const, description: "Friday night series, $15 entry. Views are insane.", yandeNote: "Friday jazz on a rooftop with Central Park below you. $15. BloomBay-coded." },
  ]);

  const [toast, setToast] = useState<string | null>(null);
  const PINK = "#FF1F7D";

  function showToast(msg: string) { setToast(msg); setTimeout(() => setToast(null), 3000); }

  function approve(id: string, rank: number) {
    setItems(prev => prev.map(i => i.id === id ? { ...i, status: "approved" as const } : i));
    showToast(`✦ Approved — goes live as #${rank + 1} on the City page`);
  }

  function deny(id: string) {
    setItems(prev => prev.filter(i => i.id !== id));
    showToast("Removed from queue");
  }

  const pending  = items.filter(i => i.status === "pending");
  const approved = items.filter(i => i.status === "approved");

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 800, letterSpacing: "0.22em", color: PINK, marginBottom: 4 }}>✦ YANDE&apos;S CITY INTELLIGENCE</p>
        <h2 style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 26, color: "white", lineHeight: 1.1, marginBottom: 6 }}>What&apos;s Hot This Week</h2>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: 11, color: "rgba(255,255,255,0.4)", lineHeight: 1.5 }}>
          Yande scraped TikTok, Eventbrite, Eater, and Time Out. These are her picks for NYC this week.<br/>
          Approve what goes live. Deny what doesn&apos;t. Runs automatically every Wednesday 8am.
        </p>
      </div>

      {/* Pending queue */}
      {pending.length > 0 && (
        <div className="mb-8">
          <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 800, letterSpacing: "0.18em", color: "rgba(255,255,255,0.35)", marginBottom: 12 }}>
            PENDING REVIEW — {pending.length} spots
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {pending.map((item, i) => {
              const catColor = CATEGORY_COLORS[item.category] ?? "#888";
              return (
                <div key={item.id} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 18, overflow: "hidden" }}>
                  <div style={{ height: 3, background: catColor }} />
                  <div style={{ padding: "16px 18px" }}>
                    {/* Top row */}
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 8 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4, flexWrap: "wrap" }}>
                          <span style={{ fontFamily: "var(--font-jost)", fontSize: 8, fontWeight: 800, letterSpacing: "0.12em", color: catColor, background: `${catColor}18`, borderRadius: 999, padding: "2px 8px" }}>
                            {item.category.toUpperCase()}
                          </span>
                          {item.badge && (
                            <span style={{ fontFamily: "var(--font-jost)", fontSize: 8, fontWeight: 800, letterSpacing: "0.1em", color: PINK, background: `${PINK}18`, borderRadius: 999, padding: "2px 8px" }}>
                              {item.badge}
                            </span>
                          )}
                          <span style={{ fontFamily: "var(--font-jost)", fontSize: 8, color: "rgba(255,255,255,0.25)" }}>via {item.source}</span>
                        </div>
                        <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 16, fontWeight: 700, color: "white", lineHeight: 1.2, marginBottom: 4 }}>{item.name}</p>
                        <p style={{ fontFamily: "var(--font-jost)", fontSize: 11, color: "rgba(255,255,255,0.45)", lineHeight: 1.5, marginBottom: 8 }}>{item.description}</p>
                      </div>
                    </div>

                    {/* Yande's note */}
                    <div style={{ background: "rgba(255,31,125,0.07)", border: `1px solid ${PINK}22`, borderRadius: 12, padding: "10px 14px", marginBottom: 12 }}>
                      <p style={{ fontFamily: "var(--font-jost)", fontSize: 8, fontWeight: 800, letterSpacing: "0.14em", color: PINK, marginBottom: 4 }}>YANDE&apos;S NOTE</p>
                      <p style={{ fontFamily: "var(--font-caveat)", fontSize: 14, color: "rgba(255,255,255,0.7)", lineHeight: 1.5 }}>&ldquo;{item.yandeNote}&rdquo;</p>
                    </div>

                    {/* Actions */}
                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        onClick={() => approve(item.id, approved.length)}
                        style={{
                          flex: 1, padding: "11px 0", borderRadius: 999, border: "none",
                          background: PINK, color: "white",
                          fontFamily: "var(--font-jost)", fontSize: 11, fontWeight: 800, cursor: "pointer",
                          letterSpacing: "0.04em",
                        }}
                      >
                        ✦ Approve — goes live
                      </button>
                      <button
                        onClick={() => deny(item.id)}
                        style={{
                          padding: "11px 18px", borderRadius: 999,
                          border: "1px solid rgba(255,255,255,0.1)",
                          background: "rgba(255,255,255,0.04)",
                          color: "rgba(255,255,255,0.4)",
                          fontFamily: "var(--font-jost)", fontSize: 11, fontWeight: 600, cursor: "pointer",
                        }}
                      >
                        Skip
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Approved this week */}
      {approved.length > 0 && (
        <div>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 800, letterSpacing: "0.18em", color: "rgba(255,255,255,0.35)", marginBottom: 12 }}>
            LIVE THIS WEEK — {approved.length} spots
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {approved.map((item, i) => (
              <div key={item.id} style={{ background: "rgba(255,31,125,0.06)", border: `1px solid ${PINK}22`, borderRadius: 14, padding: "12px 16px", display: "flex", alignItems: "center", gap: 12 }}>
                <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.7)", lineHeight: 1, minWidth: 20 }}>#{i + 1}</p>
                <p style={{ flex: 1, fontFamily: "var(--font-jost)", fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.8)" }}>{item.name}</p>
                <span style={{ fontFamily: "var(--font-jost)", fontSize: 8, fontWeight: 800, color: "#22c55e", letterSpacing: "0.1em" }}>LIVE ●</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {pending.length === 0 && approved.length === 0 && (
        <div style={{ textAlign: "center", padding: "48px 0" }}>
          <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 18, color: "rgba(255,255,255,0.2)", marginBottom: 8 }}>Nothing in the queue yet.</p>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: 11, color: "rgba(255,255,255,0.2)" }}>Yande runs every Wednesday at 8am. Check back then.</p>
        </div>
      )}

      {toast && (
        <div style={{ position: "fixed", bottom: 32, left: "50%", transform: "translateX(-50%)", background: "#111", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 999, padding: "10px 20px", fontFamily: "var(--font-jost)", fontSize: 12, color: "white", zIndex: 999 }}>
          {toast}
        </div>
      )}
    </div>
  );
}

// ─── Section: Safety Center ───────────────────────────────────────────────────

function SafetySection() {
  const [toast, setToast] = useState<string | null>(null);
  function showToast(msg: string) { setToast(msg); setTimeout(() => setToast(null), 3000); }
  return (
    <div>
      <SectionHeader title="Safety Center" sub="Reports, flags, and issues that need attention." category="Operations" />
      <div className="grid grid-cols-3 gap-4">
        {SAFETY.map((s) => (
          <div
            key={s.type}
            className="rounded-2xl p-6"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.5)" }}>
                {s.type}
              </h3>
              <span
                className="text-xs font-bold px-2.5 py-1 rounded-full"
                style={{ background: "rgba(255,31,125,0.15)", color: "#FF1F7D", border: "1px solid rgba(255,31,125,0.3)" }}
              >
                {s.count}
              </span>
            </div>
            <div className="flex flex-col gap-2.5">
              {s.items.map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2.5 py-2"
                  style={{ borderBottom: i < s.items.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}
                >
                  <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: "#FF1F7D" }} />
                  <p className="text-sm" style={{ color: "rgba(255,255,255,0.65)" }}>{item}</p>
                </div>
              ))}
            </div>
            <button
              onClick={() => {}}
              className="mt-5 w-full py-2 rounded-full text-xs font-bold"
              style={{ background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.5)" }}
            >
              Review all {s.type}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Section: Mailroom ────────────────────────────────────────────────────────

function MailroomSection() {
  return (
    <div>
      <SectionHeader title="Mailroom" sub="Applications, club requests, and partner inquiries." category="Operations" />
      <div className="grid grid-cols-3 gap-4">
        {MAILROOM.map((m) => (
          <div
            key={m.type}
            className="rounded-2xl p-6"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.5)" }}>
                {m.type}
              </h3>
              <span
                className="text-xs font-bold px-2.5 py-1 rounded-full"
                style={{ background: "#FF1F7D", color: "white" }}
              >
                {m.unread} new
              </span>
            </div>
            <div className="flex flex-col gap-2">
              {m.items.map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2.5 py-2.5"
                  style={{ borderBottom: i < m.items.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}
                >
                  <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: "#FF1F7D" }} />
                  <p className="text-sm" style={{ color: "rgba(255,255,255,0.65)" }}>{item}</p>
                </div>
              ))}
            </div>
            <button
              className="mt-5 w-full py-2 rounded-full text-xs font-bold text-white"
              style={{ background: "#FF1F7D" }}
            >
              Open {m.type}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Section: Happenings ─────────────────────────────────────────────────────

type HappeningAdminType = "gallery" | "popup" | "rooftop" | "workshop" | "class" | "festival";
type PlaceAdminType = "place" | "eat" | "gem";

interface AdminEvent {
  id: number;
  type: HappeningAdminType;
  title: string;
  venue: string;
  neighborhood: string;
  time: string;
  price: string;
}

interface AdminPopup {
  id: number;
  title: string;
  submittedBy: string;
  time: string;
  featured: boolean;
}

interface AdminPlace {
  id: number;
  type: PlaceAdminType;
  name: string;
  neighborhood: string;
  submittedBy: string;
  flowers: number;
  featured: boolean;
}

const ADMIN_EVENTS: AdminEvent[] = [
  { id: 1, type: "gallery",  title: "Soft Opening: Women in Lens",       venue: "The Parlor Gallery",    neighborhood: "Bushwick",     time: "Tonight · 7PM",           price: "Free" },
  { id: 2, type: "workshop", title: "Wheel Throwing for Beginners",       venue: "Brooklyn Clay",         neighborhood: "Williamsburg", time: "Tonight · 6:30PM",        price: "$45" },
  { id: 3, type: "rooftop",  title: "Golden Hour at Westlight",           venue: "Westlight Hotel",       neighborhood: "Williamsburg", time: "Tonight · 8PM",           price: "$20" },
  { id: 4, type: "popup",    title: "Local Designers Pop-Up Market",      venue: "The Canvas Space",      neighborhood: "SoHo",         time: "This Weekend · Sat 12–6PM", price: "Free" },
  { id: 5, type: "festival", title: "Brooklyn Night Bazaar",              venue: "Industry City",         neighborhood: "Sunset Park",  time: "This Weekend · Sat–Sun",  price: "Free" },
];

const ADMIN_POPUPS: AdminPopup[] = [
  { id: 1, title: "Ceramics Pop-Up in the Village",   submittedBy: "Mia T.",    time: "Sat · 2PM–6PM",    featured: false },
  { id: 2, title: "Vintage Market · Brooklyn",        submittedBy: "Remi O.",   time: "Sun · 11AM–4PM",   featured: true  },
  { id: 3, title: "Art Book Fair · Lower East Side",  submittedBy: "Yara L.",   time: "Fri · 6PM–9PM",    featured: false },
];

const ADMIN_PLACES: AdminPlace[] = [
  { id: 1, type: "place", name: "The High Line",            neighborhood: "Chelsea",         submittedBy: "Sofia K.",   flowers: 127, featured: false },
  { id: 2, type: "place", name: "Brooklyn Bridge Park",     neighborhood: "DUMBO",           submittedBy: "Priya R.",   flowers: 203, featured: false },
  { id: 3, type: "eat",   name: "Sadelle's",                neighborhood: "SoHo",            submittedBy: "Aaliyah M.", flowers: 89,  featured: true  },
  { id: 4, type: "eat",   name: "Bangkok Supper Club",      neighborhood: "Lower East Side", submittedBy: "Jade O.",    flowers: 64,  featured: false },
  { id: 5, type: "gem",   name: "McNally Jackson Café",     neighborhood: "Nolita",          submittedBy: "Rachel M.",  flowers: 71,  featured: false },
  { id: 6, type: "gem",   name: "Russ & Daughters Café",    neighborhood: "Lower East Side", submittedBy: "Deja W.",    flowers: 55,  featured: false },
];

const ADMIN_TYPE_LABELS: Record<HappeningAdminType, string> = {
  gallery: "GALLERY", popup: "POP-UP", rooftop: "ROOFTOP",
  workshop: "WORKSHOP", class: "CLASS", festival: "FESTIVAL",
};

const ADMIN_PLACE_LABELS: Record<PlaceAdminType, string> = {
  place: "PLACE", eat: "EAT", gem: "GEM",
};

function HappeningsSection() {
  const [subTab, setSubTab] = useState<"events" | "popups" | "girl-picks">("events");
  const [events, setEvents]   = useState<AdminEvent[]>(ADMIN_EVENTS);
  const [popups, setPopups]   = useState<AdminPopup[]>(ADMIN_POPUPS);
  const [places, setPlaces]   = useState<AdminPlace[]>(ADMIN_PLACES);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  function showToast(msg: string) { setToast(msg); setTimeout(() => setToast(null), 3000); }

  // Add event form state
  const [newType, setNewType]           = useState<HappeningAdminType>("popup");
  const [newTitle, setNewTitle]         = useState("");
  const [newVenue, setNewVenue]         = useState("");
  const [newNeighborhood, setNewNeighborhood] = useState("");
  const [newTime, setNewTime]           = useState("");
  const [newPrice, setNewPrice]         = useState("");

  const eventTypes: HappeningAdminType[] = ["gallery", "popup", "workshop", "rooftop", "class", "festival"];

  function handlePostEvent() {
    if (!newTitle.trim()) return;
    const e: AdminEvent = {
      id: Date.now(),
      type: newType,
      title: newTitle.trim(),
      venue: newVenue.trim() || "TBD",
      neighborhood: newNeighborhood.trim() || "NYC",
      time: newTime.trim() || "TBD",
      price: newPrice.trim() || "Free",
    };
    setEvents((prev) => [e, ...prev]);
    setNewTitle(""); setNewVenue(""); setNewNeighborhood(""); setNewTime(""); setNewPrice("");
    setShowAddEvent(false);
  }

  function removeEvent(id: number) { setEvents((prev) => prev.filter((e) => e.id !== id)); }
  function removePopup(id: number) { setPopups((prev) => prev.filter((p) => p.id !== id)); }
  function featurePopup(id: number) { setPopups((prev) => prev.map((p) => p.id === id ? { ...p, featured: !p.featured } : p)); }
  function removePlace(id: number) { setPlaces((prev) => prev.filter((p) => p.id !== id)); }
  function featurePlace(id: number) { setPlaces((prev) => prev.map((p) => p.id === id ? { ...p, featured: !p.featured } : p)); }

  const subTabStyle = (t: string) => ({
    borderBottomColor: subTab === t ? "#FF1F7D" : "transparent" as const,
    color: subTab === t ? "#FF1F7D" : "rgba(255,255,255,0.4)",
  });

  return (
    <div>
      <SectionHeader title="Happenings" sub="Content management — events, pop-ups, and Girl Picks." category="Content" />

      {/* Sub-tabs */}
      <div className="flex gap-0 mb-6 border-b" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
        {(["events", "popups", "girl-picks"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setSubTab(t)}
            className="px-5 py-3 text-sm font-medium capitalize border-b-2 transition-all"
            style={subTabStyle(t)}
          >
            {t === "events" ? "Events" : t === "popups" ? "Pop-ups" : "Girl Picks"}
          </button>
        ))}
      </div>

      {/* ── Events sub-tab ── */}
      {subTab === "events" && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>{events.length} events</p>
            <button
              onClick={() => setShowAddEvent((v) => !v)}
              className="px-4 py-2 rounded-full text-sm font-bold text-white"
              style={{ background: "#FF1F7D" }}
            >
              {showAddEvent ? "Cancel" : "+ Add Event"}
            </button>
          </div>

          {/* Inline add form */}
          {showAddEvent && (
            <div
              className="rounded-2xl p-5 mb-5 flex flex-col gap-4"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,31,125,0.25)" }}
            >
              <p className="text-sm font-bold" style={{ color: "#FF1F7D" }}>New Event</p>

              {/* Type chips */}
              <div>
                <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "rgba(255,255,255,0.3)" }}>Type</p>
                <div className="flex flex-wrap gap-2">
                  {eventTypes.map((t) => (
                    <button key={t} onClick={() => setNewType(t)}
                      className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all capitalize"
                      style={newType === t
                        ? { background: "#FF1F7D", color: "white" }
                        : { background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.5)" }}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest mb-1.5" style={{ color: "rgba(255,255,255,0.3)" }}>Title</p>
                  <input type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Event title"
                    className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                    style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", color: "white" }} />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest mb-1.5" style={{ color: "rgba(255,255,255,0.3)" }}>Venue</p>
                  <input type="text" value={newVenue} onChange={(e) => setNewVenue(e.target.value)}
                    placeholder="Venue name"
                    className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                    style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", color: "white" }} />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest mb-1.5" style={{ color: "rgba(255,255,255,0.3)" }}>Neighborhood</p>
                  <input type="text" value={newNeighborhood} onChange={(e) => setNewNeighborhood(e.target.value)}
                    placeholder="e.g. SoHo"
                    className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                    style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", color: "white" }} />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest mb-1.5" style={{ color: "rgba(255,255,255,0.3)" }}>Time</p>
                  <input type="text" value={newTime} onChange={(e) => setNewTime(e.target.value)}
                    placeholder="Tonight · 7PM"
                    className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                    style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", color: "white" }} />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest mb-1.5" style={{ color: "rgba(255,255,255,0.3)" }}>Price</p>
                  <input type="text" value={newPrice} onChange={(e) => setNewPrice(e.target.value)}
                    placeholder="Free or $25"
                    className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                    style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", color: "white" }} />
                </div>
              </div>

              <button onClick={handlePostEvent}
                className="self-start px-6 py-2.5 rounded-full text-sm font-bold text-white"
                style={{ background: "#FF1F7D" }}>
                Post Event
              </button>
            </div>
          )}

          {/* Events list */}
          <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.07)" }}>
            {events.map((ev, i) => (
              <div
                key={ev.id}
                className="flex items-center gap-4 px-5 py-4"
                style={{
                  background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.02)",
                  borderTop: i > 0 ? "1px solid rgba(255,255,255,0.05)" : "none",
                }}
              >
                <span
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 tracking-wider"
                  style={{ background: "rgba(255,31,125,0.15)", color: "#FF1F7D" }}
                >
                  {ADMIN_TYPE_LABELS[ev.type]}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{ev.title}</p>
                  <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>
                    {ev.neighborhood} · {ev.time}
                  </p>
                </div>
                <span className="text-sm font-bold flex-shrink-0" style={{ color: "rgba(255,255,255,0.6)" }}>{ev.price}</span>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => {}}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
                    style={{ background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.1)" }}
                  >
                    <IconEdit /> Edit
                  </button>
                  <button
                    onClick={() => removeEvent(ev.id)}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
                    style={{ background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.4)", border: "1px solid rgba(255,255,255,0.1)" }}
                  >
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                      <line x1="1" y1="1" x2="9" y2="9" /><line x1="9" y1="1" x2="1" y2="9" />
                    </svg>
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Pop-ups sub-tab ── */}
      {subTab === "popups" && (
        <div className="flex flex-col gap-3">
          {popups.map((p) => (
            <div
              key={p.id}
              className="rounded-2xl px-5 py-4 flex items-center gap-4"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0"
                style={{ background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)" }}
              >
                USER SUBMITTED
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{p.title}</p>
                <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>
                  by {p.submittedBy} · {p.time}
                </p>
              </div>
              {p.featured && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0"
                  style={{ background: "rgba(255,31,125,0.2)", color: "#FF1F7D", border: "1px solid rgba(255,31,125,0.3)" }}>
                  Featured
                </span>
              )}
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={() => featurePopup(p.id)}
                  className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
                  style={p.featured
                    ? { background: "rgba(255,31,125,0.15)", color: "#FF1F7D", border: "1px solid rgba(255,31,125,0.3)" }
                    : { background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.1)" }}
                >
                  {p.featured ? "Unfeature" : "Feature"}
                </button>
                <button
                  onClick={() => removePopup(p.id)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold"
                  style={{ background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.4)", border: "1px solid rgba(255,255,255,0.1)" }}
                >
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                    <line x1="1" y1="1" x2="9" y2="9" /><line x1="9" y1="1" x2="1" y2="9" />
                  </svg>
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Girl Picks sub-tab ── */}
      {subTab === "girl-picks" && (
        <div className="flex flex-col gap-3">
          {places.map((p) => (
            <div
              key={p.id}
              className="rounded-2xl px-5 py-4 flex items-center gap-4"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0"
                style={{ background: "rgba(255,31,125,0.15)", color: "#FF1F7D" }}
              >
                {ADMIN_PLACE_LABELS[p.type]}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{p.name}</p>
                <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>
                  {p.neighborhood} · by {p.submittedBy}
                </p>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="#FF1F7D">
                  <path d="M12 2C9.795 2 8 3.795 8 6c0 1.856 1.297 3.41 3.055 3.875.28 1.16 1.31 2.025 2.555 2.075C15.385 12 17 10.432 17 8.5c0-1.036-.43-1.97-1.121-2.637C15.866 3.8 14.08 2 12 2z" />
                </svg>
                <span className="text-xs font-semibold" style={{ color: "rgba(255,255,255,0.6)" }}>🌸 {p.flowers}</span>
              </div>
              {p.featured && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0"
                  style={{ background: "rgba(255,31,125,0.2)", color: "#FF1F7D", border: "1px solid rgba(255,31,125,0.3)" }}>
                  Featured
                </span>
              )}
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={() => featurePlace(p.id)}
                  className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
                  style={p.featured
                    ? { background: "rgba(255,31,125,0.15)", color: "#FF1F7D", border: "1px solid rgba(255,31,125,0.3)" }
                    : { background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.1)" }}
                >
                  {p.featured ? "Unfeature" : "Feature"}
                </button>
                <button
                  onClick={() => removePlace(p.id)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold"
                  style={{ background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.4)", border: "1px solid rgba(255,255,255,0.1)" }}
                >
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                    <line x1="1" y1="1" x2="9" y2="9" /><line x1="9" y1="1" x2="1" y2="9" />
                  </svg>
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MissionControlPage() {
  const [active, setActive] = useState<Section>("overview");

  const renderSection = () => {
    switch (active) {
      case "overview":   return <OverviewSection />;
      case "pending":    return <PendingSection />;
      case "cities":     return <CitiesSection />;
      case "women":      return <WomenSection />;
      case "curators":   return <CuratorsSection />;
      case "hosts":      return <HostsSection />;
      case "clubs":      return <ClubsSection />;
      case "open-seats":  return <OpenSeatsSection />;
      case "happenings":  return <HappeningsSection />;
      case "city-trending": return <CityTrendingSection />;
      case "safety":      return <SafetySection />;
      case "mailroom":    return <MailroomSection />;
    }
  };

  return (
    <div className="min-h-screen pb-16" style={{ background: "#111111", color: "white" }}>
      {/* Page header */}
      <div
        className="px-4 md:px-8 pt-8 pb-0"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="text-xs font-bold tracking-widest uppercase mb-1.5" style={{ color: "#FF1F7D" }}>
              FOUNDER PORTAL
            </p>
            <h1 className="text-4xl font-bold leading-none tracking-tight">Mission Control</h1>
            <p
              className="text-base italic mt-1.5"
              style={{ fontFamily: "var(--font-playfair)", color: "rgba(255,255,255,0.4)", fontWeight: 400 }}
            >
              We build belonging
            </p>
          </div>

          {/* Live indicator */}
          <div className="flex items-center gap-2 mb-2">
            <div
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ background: "#FF1F7D" }}
            />
            <span className="text-xs font-bold tracking-widest" style={{ color: "#FF1F7D" }}>
              LIVE
            </span>
          </div>
        </div>

        {/* Internal nav tabs */}
        <nav className="flex gap-0 -mb-px overflow-x-auto">
          {NAV.map(({ id, label, Icon, badge }) => {
            const isActive = active === id;
            return (
              <button
                key={id}
                onClick={() => setActive(id)}
                className="flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-all border-b-2 relative"
                style={{
                  borderBottomColor: isActive ? "#FF1F7D" : "transparent",
                  color: isActive ? "#FF1F7D" : "rgba(255,255,255,0.4)",
                  background: "transparent",
                }}
              >
                <span style={{ color: isActive ? "#FF1F7D" : "rgba(255,255,255,0.35)" }}>
                  <Icon />
                </span>
                {label}
                {badge != null && (
                  <span
                    className="text-xs font-bold px-1.5 py-0.5 rounded-full"
                    style={{ background: "#FF1F7D", color: "white", lineHeight: "1" }}
                  >
                    {badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Section content */}
      <div className="px-4 md:px-8 pt-8">
        {renderSection()}
      </div>
    </div>
  );
}
