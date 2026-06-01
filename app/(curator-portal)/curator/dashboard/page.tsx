"use client";

import { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Tab = "clubs" | "welcomed" | "gatherings" | "applications" | "growth" | "impact";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const CLUBS = [
  {
    id: 1,
    name: "Museum Club",
    members: 18,
    lastGathering: "Last Saturday",
    nextGathering: "This Friday",
    neighborhood: "Williamsburg",
    color: "#FF1F7D",
  },
  {
    id: 2,
    name: "Book Club",
    members: 24,
    lastGathering: "Last Thursday",
    nextGathering: "This Wednesday",
    neighborhood: "Williamsburg",
    color: "#111111",
  },
];

const WELCOMED_WOMEN = [
  { id: 1, name: "Kezia A.", initials: "KA", neighborhood: "Bushwick", dateWelcomed: "May 28", attended: true, club: "Museum Club" },
  { id: 2, name: "Priya S.", initials: "PS", neighborhood: "Crown Heights", dateWelcomed: "May 24", attended: true, club: "Book Club" },
  { id: 3, name: "Simone D.", initials: "SD", neighborhood: "Bed-Stuy", dateWelcomed: "May 21", attended: false, club: "Museum Club" },
  { id: 4, name: "Nadia L.", initials: "NL", neighborhood: "Greenpoint", dateWelcomed: "May 18", attended: true, club: "Book Club" },
  { id: 5, name: "Zoe M.", initials: "ZM", neighborhood: "Williamsburg", dateWelcomed: "May 15", attended: true, club: "Museum Club" },
  { id: 6, name: "Fatima O.", initials: "FO", neighborhood: "Clinton Hill", dateWelcomed: "May 10", attended: true, club: "Book Club" },
];

const GATHERINGS = [
  {
    id: 1,
    name: "MOMA After Hours",
    club: "Museum Club",
    date: "Fri, Jun 6",
    time: "7:00 PM",
    confirmed: 14,
    total: 18,
    status: "This week",
  },
  {
    id: 2,
    name: "Summer Reading Kickoff",
    club: "Book Club",
    date: "Wed, Jun 4",
    time: "6:30 PM",
    confirmed: 19,
    total: 24,
    status: "Tonight",
  },
  {
    id: 3,
    name: "Brooklyn Museum Rooftop",
    club: "Museum Club",
    date: "Sat, Jun 14",
    time: "5:00 PM",
    confirmed: 11,
    total: 18,
    status: "Next week",
  },
];

const APPLICATIONS = [
  {
    id: 1,
    name: "Isabelle C.",
    initials: "IC",
    neighborhood: "Park Slope",
    club: "Museum Club",
    quote: "I've been wanting to find a community of women who love art as much as I do. I moved to NYC six months ago and this feels like home.",
  },
  {
    id: 2,
    name: "Amara T.",
    initials: "AT",
    neighborhood: "Fort Greene",
    club: "Book Club",
    quote: "Reading is my daily ritual. I'm looking for women who love discussing ideas over wine.",
  },
  {
    id: 3,
    name: "Sofia R.",
    initials: "SR",
    neighborhood: "Astoria",
    club: "Museum Club",
    quote: "I'm an artist and I want to be around women who are curious about the world.",
  },
];

const RECENT_ACTIVITY = [
  { text: "Kezia joined Museum Club", time: "3 days ago" },
  { text: "Book Club RSVP milestone: 19 confirmed", time: "5 days ago" },
  { text: "Priya attended her first gathering", time: "1 week ago" },
  { text: "New application from Sofia R.", time: "1 week ago" },
  { text: "Museum Club reached 18 members", time: "2 weeks ago" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function statusColor(status: string) {
  if (status === "Tonight") return { bg: "#FF1F7D", text: "white" };
  if (status === "This week") return { bg: "rgba(255,31,125,0.12)", text: "#FF1F7D" };
  return { bg: "rgba(26,5,20,0.08)", text: "#111111" };
}

function Avatar({ initials, size = 40, bg = "#FF1F7D" }: { initials: string; size?: number; bg?: string }) {
  return (
    <div
      className="rounded-full flex items-center justify-center font-bold text-white flex-shrink-0"
      style={{ width: size, height: size, background: bg, fontSize: size * 0.35 }}
    >
      {initials}
    </div>
  );
}

// ─── Tab Components ───────────────────────────────────────────────────────────

function MyClubs() {
  return (
    <div>
      <div className="grid gap-5 md:grid-cols-2">
        {CLUBS.map((club) => (
          <div key={club.id} className="bg-white rounded-3xl p-6 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-bold text-lg" style={{ color: "#111111" }}>
                  {club.name}
                </h3>
                <p className="text-sm mt-0.5" style={{ color: "rgba(26,5,20,0.45)" }}>
                  {club.neighborhood}
                </p>
              </div>
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center"
                style={{ background: club.color }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                  <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
                </svg>
              </div>
            </div>

            <div
              className="text-3xl font-bold mb-1"
              style={{ color: "#111111" }}
            >
              {club.members}
            </div>
            <p className="text-xs font-semibold uppercase tracking-wider mb-5" style={{ color: "rgba(26,5,20,0.4)" }}>
              Women
            </p>

            <div className="grid grid-cols-2 gap-3">
              <div
                className="rounded-2xl px-4 py-3"
                style={{ background: "#FFF5F8" }}
              >
                <p className="text-xs" style={{ color: "rgba(26,5,20,0.45)" }}>
                  Last gathering
                </p>
                <p className="text-sm font-semibold mt-0.5" style={{ color: "#111111" }}>
                  {club.lastGathering}
                </p>
              </div>
              <div
                className="rounded-2xl px-4 py-3"
                style={{ background: "#FFF5F8" }}
              >
                <p className="text-xs" style={{ color: "rgba(26,5,20,0.45)" }}>
                  Next gathering
                </p>
                <p className="text-sm font-semibold mt-0.5" style={{ color: "#FF1F7D" }}>
                  {club.nextGathering}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        className="mt-6 w-full rounded-2xl py-4 font-bold text-sm tracking-wide border-2 transition-all"
        style={{
          borderColor: "#FF1F7D",
          color: "#FF1F7D",
          background: "transparent",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "#FF1F7D";
          e.currentTarget.style.color = "white";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.color = "#FF1F7D";
        }}
      >
        + Start a new club
      </button>
    </div>
  );
}

function WomenWelcomed() {
  return (
    <div>
      {/* Stats header */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total welcomed", value: "42" },
          { label: "This month", value: "6" },
          { label: "Active", value: "38" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl px-5 py-4 text-center shadow-sm">
            <div className="text-2xl font-bold" style={{ color: "#FF1F7D" }}>
              {stat.value}
            </div>
            <div className="text-xs mt-1" style={{ color: "rgba(26,5,20,0.5)" }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Feed */}
      <div className="flex flex-col gap-3">
        {WELCOMED_WOMEN.map((w) => (
          <div
            key={w.id}
            className="bg-white rounded-2xl px-5 py-4 flex items-center gap-4 shadow-sm"
          >
            <Avatar
              initials={w.initials}
              size={44}
              bg={w.attended ? "#FF1F7D" : "rgba(26,5,20,0.15)"}
            />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm" style={{ color: "#111111" }}>
                You welcomed{" "}
                <span style={{ color: "#FF1F7D" }}>{w.name}</span>{" "}
                to {w.club}
              </p>
              <p className="text-xs mt-0.5" style={{ color: "rgba(26,5,20,0.45)" }}>
                {w.neighborhood} · {w.dateWelcomed}
              </p>
            </div>
            <div
              className="px-2.5 py-1 rounded-full text-xs font-semibold flex-shrink-0"
              style={
                w.attended
                  ? { background: "rgba(255,31,125,0.1)", color: "#FF1F7D" }
                  : { background: "rgba(26,5,20,0.06)", color: "rgba(26,5,20,0.45)" }
              }
            >
              {w.attended ? "Attended" : "Invited"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function UpcomingGatherings() {
  return (
    <div className="flex flex-col gap-4">
      {GATHERINGS.map((g) => {
        const colors = statusColor(g.status);
        const seatsLeft = g.total - g.confirmed;
        return (
          <div key={g.id} className="bg-white rounded-3xl p-6 shadow-sm">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-bold text-base" style={{ color: "#111111" }}>
                  {g.name}
                </h3>
                <p className="text-xs mt-0.5" style={{ color: "rgba(26,5,20,0.45)" }}>
                  {g.club}
                </p>
              </div>
              <span
                className="px-3 py-1 rounded-full text-xs font-bold"
                style={{ background: colors.bg, color: colors.text }}
              >
                {g.status}
              </span>
            </div>

            <div className="flex items-center gap-4 text-sm" style={{ color: "rgba(26,5,20,0.55)" }}>
              <span className="flex items-center gap-1.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z" />
                </svg>
                {g.date}
              </span>
              <span>{g.time}</span>
            </div>

            {/* RSVP bar */}
            <div className="mt-4">
              <div className="flex justify-between text-xs mb-1.5" style={{ color: "rgba(26,5,20,0.5)" }}>
                <span>{g.confirmed} confirmed</span>
                <span>{seatsLeft} seats left</span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(26,5,20,0.08)" }}>
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${(g.confirmed / g.total) * 100}%`,
                    background: "#FF1F7D",
                  }}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Applications() {
  const [approved, setApproved] = useState<Set<number>>(new Set());

  return (
    <div className="flex flex-col gap-4">
      {APPLICATIONS.map((app) => {
        const isApproved = approved.has(app.id);
        return (
          <div key={app.id} className="bg-white rounded-3xl p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <Avatar initials={app.initials} size={48} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <h3 className="font-bold text-base" style={{ color: "#111111" }}>
                    {app.name}
                  </h3>
                  <span className="text-xs" style={{ color: "rgba(26,5,20,0.4)" }}>
                    {app.club}
                  </span>
                </div>
                <p className="text-xs mb-3" style={{ color: "rgba(26,5,20,0.45)" }}>
                  {app.neighborhood}
                </p>
                <p
                  className="text-sm italic leading-relaxed border-l-2 pl-3"
                  style={{
                    color: "rgba(26,5,20,0.65)",
                    borderColor: "rgba(255,31,125,0.25)",
                  }}
                >
                  "{app.quote}"
                </p>
              </div>
            </div>

            <div className="flex gap-3 mt-5">
              <button
                onClick={() => setApproved((prev) => new Set(prev).add(app.id))}
                disabled={isApproved}
                className="flex-1 py-3 rounded-2xl text-sm font-bold transition-all"
                style={
                  isApproved
                    ? { background: "rgba(255,31,125,0.1)", color: "#FF1F7D" }
                    : { background: "#FF1F7D", color: "white" }
                }
              >
                {isApproved ? "Welcomed" : "Approve"}
              </button>
              <button
                disabled={isApproved}
                className="flex-1 py-3 rounded-2xl text-sm font-bold border transition-all"
                style={
                  isApproved
                    ? { borderColor: "rgba(26,5,20,0.1)", color: "rgba(26,5,20,0.25)" }
                    : { borderColor: "rgba(26,5,20,0.15)", color: "rgba(26,5,20,0.55)" }
                }
              >
                Ask later
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ClubGrowth() {
  return (
    <div>
      {/* Key numbers */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {[
          { label: "Members joined this month", value: "6", sub: "+2 from last month" },
          { label: "Gatherings this month", value: "3", sub: "2 upcoming" },
          { label: "Response rate", value: "94%", sub: "Across all clubs" },
          { label: "Average attendance", value: "87%", sub: "Per gathering" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-3xl px-6 py-5 shadow-sm">
            <div className="text-3xl font-bold mb-1" style={{ color: "#FF1F7D" }}>
              {stat.value}
            </div>
            <p className="text-sm font-semibold" style={{ color: "#111111" }}>
              {stat.label}
            </p>
            <p className="text-xs mt-0.5" style={{ color: "rgba(26,5,20,0.4)" }}>
              {stat.sub}
            </p>
          </div>
        ))}
      </div>

      {/* Recent activity */}
      <div className="bg-white rounded-3xl p-6 shadow-sm">
        <h3 className="font-bold text-sm uppercase tracking-wider mb-4" style={{ color: "rgba(26,5,20,0.4)" }}>
          Recent Activity
        </h3>
        <div className="flex flex-col gap-0">
          {RECENT_ACTIVITY.map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-4 py-3"
              style={{
                borderBottom: i < RECENT_ACTIVITY.length - 1 ? "1px solid rgba(26,5,20,0.06)" : "none",
              }}
            >
              <div
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ background: "#FF1F7D" }}
              />
              <p className="flex-1 text-sm" style={{ color: "#111111" }}>
                {item.text}
              </p>
              <p className="text-xs flex-shrink-0" style={{ color: "rgba(26,5,20,0.35)" }}>
                {item.time}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MyImpact() {
  return (
    <div>
      {/* Hero stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {[
          { label: "Women welcomed", value: "42" },
          { label: "Events created", value: "14" },
          { label: "Attendance rate", value: "91%" },
          { label: "Trust score", value: "97" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-3xl px-6 py-6 text-center shadow-sm"
          >
            <div
              className="text-4xl font-bold mb-1"
              style={{ color: "#FF1F7D" }}
            >
              {stat.value}
            </div>
            <p className="text-sm" style={{ color: "rgba(26,5,20,0.55)" }}>
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Curator since */}
      <div className="bg-white rounded-3xl p-6 shadow-sm mb-4">
        <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: "rgba(26,5,20,0.35)" }}>
          Curator since
        </p>
        <p className="text-xl font-bold" style={{ color: "#111111" }}>
          January 2025
        </p>
        <div className="mt-3 flex items-center gap-2">
          <div
            className="px-3 py-1.5 rounded-full text-xs font-bold"
            style={{ background: "rgba(255,31,125,0.1)", color: "#FF1F7D" }}
          >
            Active curator
          </div>
          <div
            className="px-3 py-1.5 rounded-full text-xs font-bold"
            style={{ background: "rgba(26,5,20,0.07)", color: "#111111" }}
          >
            Williamsburg
          </div>
        </div>
      </div>

      {/* Yande AI insight */}
      <div
        className="rounded-3xl p-6 mb-4"
        style={{
          background: "linear-gradient(135deg, #111111 0%, #2d0a22 100%)",
        }}
      >
        <div className="flex items-center gap-2 mb-3">
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: "#FF1F7D" }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
              <path d="M12 2L9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61z" />
            </svg>
          </div>
          <p className="text-xs font-bold tracking-widest" style={{ color: "#FF1F7D" }}>
            BLOOMSIGHT
          </p>
        </div>
        <p className="text-white font-medium leading-relaxed">
          Your Museum Club has the highest retention in Williamsburg.
        </p>
        <p className="text-xs mt-2" style={{ color: "rgba(255,255,255,0.4)" }}>
          Based on attendance patterns over the last 90 days
        </p>
      </div>

      {/* Top gathering */}
      <div className="bg-white rounded-3xl p-6 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "rgba(26,5,20,0.35)" }}>
          Top gathering
        </p>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-bold text-base" style={{ color: "#111111" }}>
              Brooklyn Museum Rooftop
            </p>
            <p className="text-sm mt-0.5" style={{ color: "rgba(26,5,20,0.45)" }}>
              Museum Club · April 2025
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold" style={{ color: "#FF1F7D" }}>
              18/18
            </div>
            <p className="text-xs" style={{ color: "rgba(26,5,20,0.4)" }}>
              Full house
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const TABS: { id: Tab; label: string }[] = [
  { id: "clubs", label: "My Clubs" },
  { id: "welcomed", label: "Women Welcomed" },
  { id: "gatherings", label: "Upcoming Gatherings" },
  { id: "applications", label: "Applications" },
  { id: "growth", label: "Club Growth" },
  { id: "impact", label: "My Impact" },
];

export default function CuratorDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("clubs");

  return (
    <div className="min-h-screen" style={{ background: "#FFF5F8" }}>
      {/* Header */}
      <div
        className="sticky top-0 z-30 px-8 py-5 border-b"
        style={{
          background: "rgba(255,245,248,0.92)",
          backdropFilter: "blur(12px)",
          borderColor: "rgba(255,31,125,0.1)",
        }}
      >
        <div className="max-w-3xl">
          <p className="text-xs font-bold tracking-widest uppercase mb-0.5" style={{ color: "#FF1F7D" }}>
            CURATOR
          </p>
          <h1 className="text-2xl font-bold" style={{ color: "#111111" }}>
            Amanda R.&rsquo;s Culture
          </h1>
          <p className="text-sm mt-0.5" style={{ color: "rgba(26,5,20,0.45)" }}>
            Williamsburg · Trust Score 97
          </p>
        </div>

        {/* Tab nav */}
        <div className="flex gap-1 mt-5 overflow-x-auto pb-0.5 scrollbar-hide">
          {TABS.map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all flex-shrink-0"
                style={
                  active
                    ? { background: "#FF1F7D", color: "white" }
                    : {
                        background: "transparent",
                        color: "rgba(26,5,20,0.5)",
                      }
                }
              >
                {tab.label}
                {tab.id === "applications" && (
                  <span
                    className="ml-1.5 px-1.5 py-0.5 rounded-full text-xs font-bold"
                    style={{
                      background: active ? "rgba(255,255,255,0.3)" : "#FF1F7D",
                      color: "white",
                    }}
                  >
                    3
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="px-8 py-6 max-w-3xl">
        {activeTab === "clubs" && <MyClubs />}
        {activeTab === "welcomed" && <WomenWelcomed />}
        {activeTab === "gatherings" && <UpcomingGatherings />}
        {activeTab === "applications" && <Applications />}
        {activeTab === "growth" && <ClubGrowth />}
        {activeTab === "impact" && <MyImpact />}
      </div>
    </div>
  );
}
