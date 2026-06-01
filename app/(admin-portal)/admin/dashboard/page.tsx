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
  { name: "Chicago", status: "Coming Soon", women: 0, clubs: 0, seats: 0 },
  { name: "Atlanta", status: "Coming Soon", women: 0, clubs: 0, seats: 0 },
  { name: "London", status: "Coming Soon", women: 0, clubs: 0, seats: 0 },
];

const WOMEN_STATS = {
  verificationQueue: 17,
  pendingApplications: 24,
  memberGrowthThisWeek: 6,
  totalMembers: 94,
};

const HOSTS = [
  { name: "Ciara M.", venue: "The Parlour, SoHo", events: 4, rating: 4.9 },
  { name: "Nadia B.", venue: "Loft 19, Brooklyn", events: 2, rating: 4.7 },
  { name: "Tara L.", venue: "The Den, West Village", events: 3, rating: 4.8 },
];

const CLUBS = [
  { name: "Museum Club", city: "NYC", curator: "Amanda R.", members: 18, seats: 2 },
  { name: "Book Club", city: "NYC", curator: "Amanda R.", members: 14, seats: 1 },
  { name: "Jazz & Wine", city: "NYC", curator: "Yemi O.", members: 16, seats: 3 },
  { name: "Creative Writing", city: "NYC", curator: "Yemi O.", members: 12, seats: 0 },
  { name: "Soft Life", city: "NYC", curator: "Priya S.", members: 11, seats: 1 },
  { name: "Pilates Club", city: "NYC", curator: "Priya S.", members: 9, seats: 2 },
  { name: "Indigenous African NYC", city: "NYC", curator: "Sofia K.", members: 10, seats: 0 },
  { name: "Girl Tech Collective", city: "NYC", curator: "Kezia N.", members: 14, seats: 4 },
  { name: "The Artist Circle", city: "NYC", curator: "—", members: 0, seats: 0 },
  { name: "Wellness Circle", city: "NYC", curator: "—", members: 100, seats: 0 },
  { name: "Ladurée Society", city: "NYC", curator: "—", members: 6, seats: 2 },
  { name: "Sunday Rooftop", city: "NYC", curator: "—", members: 8, seats: 3 },
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
  | "cities"
  | "women"
  | "curators"
  | "hosts"
  | "clubs"
  | "open-seats"
  | "safety"
  | "mailroom";

const NAV: { id: Section; label: string; Icon: () => ReactElement; badge?: number }[] = [
  { id: "overview", label: "Overview", Icon: IconGrid },
  { id: "cities", label: "Cities", Icon: IconMap },
  { id: "women", label: "Women", Icon: IconUsers },
  { id: "curators", label: "Curators", Icon: IconStar },
  { id: "hosts", label: "Hosts", Icon: IconHome },
  { id: "clubs", label: "Clubs", Icon: IconDiamond },
  { id: "open-seats", label: "Open Seats", Icon: IconCalendar },
  { id: "safety", label: "Safety Center", Icon: IconShield, badge: 6 },
  { id: "mailroom", label: "Mailroom", Icon: IconMail, badge: 35 },
];

// ─── Shared sub-components ────────────────────────────────────────────────────

function StatCard({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div
      className="rounded-2xl px-5 py-5 flex flex-col gap-1"
      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)" }}
    >
      <p className="text-xs font-bold tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.35)" }}>
        {label}
      </p>
      <p className="text-4xl font-bold leading-none" style={{ color: "#FF1F7D" }}>
        {value}
      </p>
      <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
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

function SectionHeader({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold">{title}</h2>
      {sub && (
        <p className="text-sm mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>
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
      <SectionHeader title="Mission Control" sub="Live operations — BloomBay is growing." />

      {/* Live stat cards */}
      <div className="grid grid-cols-5 gap-3 mb-8">
        {LIVE_STATS.map((s) => (
          <StatCard key={s.label} label={s.label} value={s.value} sub={s.sub} />
        ))}
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
      <SectionHeader title="Cities" sub="Where BloomBay lives and where she's going next." />
      <div className="grid grid-cols-4 gap-4">
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

// ─── Section: Women ───────────────────────────────────────────────────────────

function WomenSection() {
  return (
    <div>
      <SectionHeader title="Women" sub="Verification queue, applications, and member growth." />

      <div className="grid grid-cols-4 gap-4 mb-8">
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
        <button
          className="mt-4 px-4 py-2 rounded-full text-sm font-bold text-white"
          style={{ background: "#FF1F7D" }}
        >
          Review Queue
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
      <SectionHeader title="Curators" sub="The women creating culture in BloomBay." />
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
  return (
    <div>
      <SectionHeader title="Hosts" sub="Venues and event hosts powering BloomBay gatherings." />
      <div className="grid grid-cols-3 gap-4">
        {HOSTS.map((h) => (
          <div
            key={h.name}
            className="rounded-2xl p-6"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-base font-bold mb-4"
              style={{ background: "rgba(255,31,125,0.15)", color: "#FF1F7D" }}
            >
              {h.name[0]}
            </div>
            <h3 className="text-base font-bold mb-1">{h.name}</h3>
            <p className="text-xs mb-4" style={{ color: "rgba(255,255,255,0.4)" }}>
              {h.venue}
            </p>
            <div className="flex gap-6">
              <div>
                <p className="text-xl font-bold" style={{ color: "#FF1F7D" }}>{h.events}</p>
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>Events hosted</p>
              </div>
              <div>
                <p className="text-xl font-bold">{h.rating}</p>
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>Rating</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Section: Clubs ───────────────────────────────────────────────────────────

function ClubsSection() {
  return (
    <div>
      <SectionHeader title="Clubs" sub={`${CLUBS.length} clubs across all cities.`} />
      <div
        className="rounded-2xl overflow-hidden"
        style={{ border: "1px solid rgba(255,255,255,0.07)" }}
      >
        {/* Table header */}
        <div
          className="grid grid-cols-[1fr_80px_160px_80px_80px] px-5 py-3 text-xs font-bold uppercase tracking-widest"
          style={{ background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.3)" }}
        >
          <span>Club</span>
          <span>City</span>
          <span>Curator</span>
          <span className="text-right">Members</span>
          <span className="text-right">Open Seats</span>
        </div>
        {CLUBS.map((club, i) => (
          <div
            key={club.name}
            className="grid grid-cols-[1fr_80px_160px_80px_80px] px-5 py-4 items-center"
            style={{
              background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.02)",
              borderTop: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            <span className="text-sm font-medium">{club.name}</span>
            <span className="text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>{club.city}</span>
            <span className="text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>{club.curator}</span>
            <span className="text-sm font-bold text-right">{club.members}</span>
            <span
              className="text-sm font-bold text-right"
              style={{ color: club.seats > 0 ? "#FF1F7D" : "rgba(255,255,255,0.2)" }}
            >
              {club.seats}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Section: Open Seats ──────────────────────────────────────────────────────

function OpenSeatsSection() {
  return (
    <div>
      <SectionHeader title="Open Seats" sub="Everything happening soon — upcoming gatherings with availability." />
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

// ─── Section: Safety Center ───────────────────────────────────────────────────

function SafetySection() {
  return (
    <div>
      <SectionHeader title="Safety Center" sub="Reports, flags, and issues that need attention." />
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
      <SectionHeader title="Mailroom" sub="Applications, club requests, and partner inquiries." />
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

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MissionControlPage() {
  const [active, setActive] = useState<Section>("overview");

  const renderSection = () => {
    switch (active) {
      case "overview":   return <OverviewSection />;
      case "cities":     return <CitiesSection />;
      case "women":      return <WomenSection />;
      case "curators":   return <CuratorsSection />;
      case "hosts":      return <HostsSection />;
      case "clubs":      return <ClubsSection />;
      case "open-seats": return <OpenSeatsSection />;
      case "safety":     return <SafetySection />;
      case "mailroom":   return <MailroomSection />;
    }
  };

  return (
    <div className="min-h-screen pb-16" style={{ background: "#111111", color: "white" }}>
      {/* Page header */}
      <div
        className="px-8 pt-8 pb-0"
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
      <div className="px-8 pt-8">
        {renderSection()}
      </div>
    </div>
  );
}
