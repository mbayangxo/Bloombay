"use client";

import { useState } from "react";

// ── Types ──────────────────────────────────────────────────────────────────

type Tab =
  | "women"
  | "open-seats"
  | "applications"
  | "settings"
  | "form-builder"
  | "mailbox"
  | "gatherings"
  | "club-health"
  | "crest";

type AccessType = "free" | "one_time" | "subscription";
type EntryStyle = "open" | "application" | "approval_paywall";

// ── Mock data ──────────────────────────────────────────────────────────────

const MEMBERS = [
  { name: "Aaliyah M.", neighborhood: "Brooklyn", joined: "Jan 2025", attendance: 94, status: "Active" },
  { name: "Sofia K.", neighborhood: "SoHo", joined: "Feb 2025", attendance: 88, status: "Active" },
  { name: "Priya R.", neighborhood: "Williamsburg", joined: "Mar 2025", attendance: 72, status: "Active" },
  { name: "Camille T.", neighborhood: "Harlem", joined: "Mar 2025", attendance: 65, status: "Quiet" },
  { name: "Naomi B.", neighborhood: "Astoria", joined: "Apr 2025", attendance: 91, status: "Active" },
  { name: "Zara F.", neighborhood: "LES", joined: "Apr 2025", attendance: 58, status: "Quiet" },
  { name: "Deja W.", neighborhood: "Crown Heights", joined: "May 2025", attendance: 83, status: "Active" },
];

const OPEN_SEATS = [
  { title: "Girls Brunch", day: "Saturday", time: "11:00 AM", seats: 4, venue: "Ladurée SoHo" },
  { title: "Pilates + Matcha", day: "Sunday", time: "9:00 AM", seats: 3, venue: "Studio Bloom" },
  { title: "Book Club", day: "Friday", time: "7:00 PM", seats: 6, venue: "The Strand · Annex" },
];

const REQUESTS = [
  {
    name: "Imani J.",
    neighborhood: "Fort Greene",
    requestedAt: "2h ago",
    why: "I've been looking for a community that feels intentional. Soft life isn't just a vibe for me, it's a whole practice.",
  },
  {
    name: "Lena O.",
    neighborhood: "Park Slope",
    requestedAt: "8h ago",
    why: "I relocated from London and want to build genuine friendships in NYC. This club feels like home.",
  },
  {
    name: "Tia R.",
    neighborhood: "Bushwick",
    requestedAt: "1d ago",
    why: "My therapist told me to find my people. I think this might be them.",
  },
];

const APPLICATIONS = [
  {
    name: "Imani J.",
    neighborhood: "Fort Greene",
    age: "28",
    occupation: "Creative Director",
    verified: true,
    appliedAt: "2h ago",
    instagram: "@imanij.nyc",
    answers: [
      { q: "Why do you want to join?", a: "I've been looking for a community that feels intentional. Soft life isn't just a vibe for me, it's a whole practice." },
      { q: "What do you bring to the table?", a: "I bring warmth, honesty, and really good restaurant recommendations." },
    ],
  },
  {
    name: "Lena O.",
    neighborhood: "Park Slope",
    age: "31",
    occupation: "UX Researcher",
    verified: true,
    appliedAt: "8h ago",
    instagram: "@lena.o",
    answers: [
      { q: "Why do you want to join?", a: "I relocated from London and want to build genuine friendships in NYC. This club feels like home." },
      { q: "What do you bring to the table?", a: "I love hosting, I'm a great listener, and I know all the best hidden spots in the city." },
    ],
  },
  {
    name: "Tia R.",
    neighborhood: "Bushwick",
    age: "26",
    occupation: "Yoga Instructor",
    verified: false,
    appliedAt: "1d ago",
    instagram: "@tia.r",
    answers: [
      { q: "Why do you want to join?", a: "My therapist told me to find my people. I think this might be them." },
      { q: "What do you bring to the table?", a: "Good energy, herbal tea knowledge, and the ability to make anyone laugh." },
    ],
  },
];

const MESSAGES = [
  { from: "Aaliyah M.", preview: "Quick question about Saturday brunch", time: "20m ago", unread: true },
  { from: "BloomBay Team", preview: "Your club was featured this week", time: "3h ago", unread: true },
  { from: "Sofia K.", preview: "Can I bring a friend to the book club?", time: "1d ago", unread: true },
  { from: "Priya R.", preview: "Thank you for approving me!", time: "3d ago", unread: false },
];

const GATHERINGS_PAST = [
  { title: "Rooftop Sunset Brunch", date: "May 18, 2025", attendees: 14, rating: "4.9" },
  { title: "Pilates + Brunch", date: "May 4, 2025", attendees: 11, rating: "4.8" },
  { title: "Wine & Journaling", date: "Apr 20, 2025", attendees: 9, rating: "5.0" },
];

const GATHERINGS_UPCOMING = [
  { title: "Girls Brunch", date: "Jun 7, 2025", seats: 4, venue: "Ladurée SoHo" },
  { title: "Pilates + Matcha", date: "Jun 8, 2025", seats: 3, venue: "Studio Bloom" },
  { title: "Book Club", date: "Jun 13, 2025", seats: 6, venue: "The Strand" },
  { title: "Pottery Night", date: "Jun 21, 2025", seats: 8, venue: "Clayground NYC" },
  { title: "Sound Bath", date: "Jun 28, 2025", seats: 12, venue: "W Loft" },
];

// ── SVG Icons ──────────────────────────────────────────────────────────────

function IconUsers({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function IconCalendar({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function IconInbox({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
      <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
    </svg>
  );
}

function IconClipboard({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
    </svg>
  );
}

function IconActivity({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  );
}

function IconHeart({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function IconEdit({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

function IconCheck({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function IconX({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

// ── Club Crest SVG ─────────────────────────────────────────────────────────

function ClubCrestSVG({ symbol, color, size = 80 }: { symbol: "bouquet" | "door" | "crest"; color: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Outer ring */}
      <circle cx="40" cy="40" r="38" stroke={color} strokeWidth="2.5" fill="white" />
      <circle cx="40" cy="40" r="33" stroke={color} strokeWidth="0.75" strokeDasharray="2 3" fill="none" />
      {/* Inner fill */}
      <circle cx="40" cy="40" r="30" fill={color} fillOpacity="0.08" />
      {/* Symbol */}
      {symbol === "bouquet" && (
        <g transform="translate(40,40)">
          {/* Stems */}
          <line x1="0" y1="8" x2="-5" y2="18" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
          <line x1="0" y1="8" x2="0" y2="18" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
          <line x1="0" y1="8" x2="5" y2="18" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
          {/* Flowers */}
          <circle cx="-8" cy="-2" r="5" fill={color} fillOpacity="0.3" stroke={color} strokeWidth="1.2" />
          <circle cx="-8" cy="-2" r="2" fill={color} />
          <circle cx="0" cy="-8" r="5" fill={color} fillOpacity="0.3" stroke={color} strokeWidth="1.2" />
          <circle cx="0" cy="-8" r="2" fill={color} />
          <circle cx="8" cy="-2" r="5" fill={color} fillOpacity="0.3" stroke={color} strokeWidth="1.2" />
          <circle cx="8" cy="-2" r="2" fill={color} />
          {/* Ribbon */}
          <path d="M-6 18 Q0 22 6 18" stroke={color} strokeWidth="1.2" fill="none" strokeLinecap="round" />
        </g>
      )}
      {symbol === "door" && (
        <g transform="translate(40,40)">
          <rect x="-9" y="-16" width="18" height="28" rx="9" fill={color} fillOpacity="0.15" stroke={color} strokeWidth="1.5" />
          <circle cx="6" cy="0" r="1.5" fill={color} />
          <line x1="-9" y1="-3" x2="9" y2="-3" stroke={color} strokeWidth="0.8" strokeDasharray="1.5 2" />
        </g>
      )}
      {symbol === "crest" && (
        <g transform="translate(40,40)">
          {/* Shield */}
          <path d="M0 -16 L12 -10 L12 4 Q12 16 0 20 Q-12 16 -12 4 L-12 -10 Z" fill={color} fillOpacity="0.15" stroke={color} strokeWidth="1.5" />
          {/* Cross */}
          <line x1="0" y1="-10" x2="0" y2="12" stroke={color} strokeWidth="1.2" />
          <line x1="-8" y1="0" x2="8" y2="0" stroke={color} strokeWidth="1.2" />
        </g>
      )}
    </svg>
  );
}

// ── Tab Bar ────────────────────────────────────────────────────────────────

const TABS: { id: Tab; label: string; icon: React.ReactNode; badge?: number }[] = [
  { id: "women",        label: "Women",        icon: <IconUsers size={15} /> },
  { id: "open-seats",   label: "Open Seats",   icon: <IconCalendar size={15} /> },
  { id: "applications", label: "Applications", icon: <IconClipboard size={15} />, badge: 3 },
  { id: "settings",     label: "Club Settings",icon: <IconEdit size={15} /> },
  { id: "form-builder", label: "Apply Form",   icon: <IconClipboard size={15} /> },
  { id: "mailbox",      label: "Mailbox",      icon: <IconInbox size={15} />, badge: 3 },
  { id: "gatherings",   label: "Gatherings",   icon: <IconCalendar size={15} /> },
  { id: "club-health",  label: "Club Health",  icon: <IconActivity size={15} /> },
  { id: "crest",        label: "Crest",        icon: <IconHeart size={15} /> },
];

// ── Section Components ─────────────────────────────────────────────────────

function WomenSection() {
  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-lg font-bold" style={{ color: "#111111" }}>Members</h2>
          <p className="text-sm text-gray-400 mt-0.5">312 women in the club</p>
        </div>
        <button
          className="px-4 py-2 rounded-full text-sm font-semibold text-white"
          style={{ background: "#FF1F7D" }}
        >
          + Invite a woman
        </button>
      </div>

      {/* Column headers */}
      <div className="grid text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2 px-4"
        style={{ gridTemplateColumns: "1fr 140px 120px 100px" }}>
        <span>Name</span>
        <span>Neighborhood</span>
        <span>Joined</span>
        <span>Attendance</span>
      </div>

      <div className="flex flex-col gap-1">
        {MEMBERS.map((m, i) => (
          <div
            key={i}
            className="grid items-center px-4 py-3 rounded-2xl bg-white"
            style={{
              gridTemplateColumns: "1fr 140px 120px 100px",
              boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
            }}
          >
            {/* Name + avatar */}
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                style={{ background: "#FF1F7D" }}
              >
                {m.name[0]}
              </div>
              <span className="font-semibold text-sm" style={{ color: "#111111" }}>{m.name}</span>
            </div>

            <span className="text-sm text-gray-500">{m.neighborhood}</span>
            <span className="text-sm text-gray-500">{m.joined}</span>

            {/* Attendance + status */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold" style={{ color: "#111111" }}>{m.attendance}%</span>
              <span
                className="text-xs px-2 py-0.5 rounded-full font-medium"
                style={
                  m.status === "Active"
                    ? { background: "#FFF0F5", color: "#FF1F7D" }
                    : { background: "#F5F5F5", color: "#999" }
                }
              >
                {m.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function OpenSeatsSection() {
  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-lg font-bold" style={{ color: "#111111" }}>Open Seats</h2>
          <p className="text-sm text-gray-400 mt-0.5">8 upcoming gatherings</p>
        </div>
        <button
          className="px-4 py-2 rounded-full text-sm font-semibold text-white"
          style={{ background: "#FF1F7D" }}
        >
          + New gathering
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {OPEN_SEATS.map((s, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-5 flex items-center justify-between"
            style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}
          >
            <div>
              <p className="font-semibold text-base" style={{ color: "#111111" }}>{s.title}</p>
              <p className="text-sm text-gray-400 mt-0.5">{s.day} · {s.time} · {s.venue}</p>
            </div>
            <div className="text-right flex-shrink-0 ml-6">
              <p className="text-2xl font-bold" style={{ color: "#FF1F7D" }}>{s.seats}</p>
              <p className="text-xs text-gray-400 mt-0.5">seats open</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RequestsSection() {
  const [handled, setHandled] = useState<Set<number>>(new Set());

  return (
    <div>
      <div className="mb-5">
        <h2 className="text-lg font-bold" style={{ color: "#111111" }}>Join Requests</h2>
        <p className="text-sm text-gray-400 mt-0.5">{REQUESTS.length} pending approval</p>
      </div>

      <div className="flex flex-col gap-4">
        {REQUESTS.map((r, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-5"
            style={{
              boxShadow: "0 1px 6px rgba(0,0,0,0.05)",
              opacity: handled.has(i) ? 0.45 : 1,
              transition: "opacity 0.3s ease",
            }}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                  style={{ background: "#FF1F7D" }}
                >
                  {r.name[0]}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-sm" style={{ color: "#111111" }}>{r.name}</p>
                  <p className="text-xs text-gray-400">{r.neighborhood} · {r.requestedAt}</p>
                  <p
                    className="text-sm mt-2 leading-relaxed"
                    style={{ color: "#444", fontStyle: "italic" }}
                  >
                    &ldquo;{r.why}&rdquo;
                  </p>
                </div>
              </div>

              {!handled.has(i) && (
                <div className="flex gap-2 flex-shrink-0 mt-0.5">
                  <button
                    onClick={() => setHandled(prev => new Set([...prev, i]))}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-white"
                    style={{ background: "#FF1F7D" }}
                  >
                    <IconCheck size={12} />
                    Approve
                  </button>
                  <button
                    onClick={() => setHandled(prev => new Set([...prev, i]))}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
                    style={{ background: "#F5F5F5", color: "#999" }}
                  >
                    <IconX size={12} />
                    Decline
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MailboxSection() {
  const unread = MESSAGES.filter(m => m.unread).length;

  return (
    <div>
      <div className="mb-5">
        <h2 className="text-lg font-bold" style={{ color: "#111111" }}>Mailbox</h2>
        <p className="text-sm text-gray-400 mt-0.5">{unread} unread messages</p>
      </div>

      <div className="flex flex-col gap-2">
        {MESSAGES.map((m, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl px-5 py-4 flex items-center gap-4 cursor-pointer"
            style={{
              boxShadow: "0 1px 6px rgba(0,0,0,0.05)",
              borderLeft: m.unread ? "3px solid #FF1F7D" : "3px solid transparent",
            }}
          >
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
              style={{ background: m.unread ? "#FF1F7D" : "#E5C8D4" }}
            >
              {m.from[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p
                className="text-sm truncate"
                style={{ color: "#111111", fontWeight: m.unread ? 700 : 500 }}
              >
                {m.from}
              </p>
              <p className="text-xs text-gray-400 truncate mt-0.5">{m.preview}</p>
            </div>
            <div className="flex-shrink-0 flex flex-col items-end gap-1.5">
              <p className="text-xs text-gray-400">{m.time}</p>
              {m.unread && (
                <div className="w-2 h-2 rounded-full" style={{ background: "#FF1F7D" }} />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function GatheringsSection() {
  return (
    <div className="grid grid-cols-2 gap-6">
      {/* Upcoming */}
      <div>
        <h3 className="font-semibold text-sm uppercase tracking-wider text-gray-400 mb-3">Upcoming</h3>
        <div className="flex flex-col gap-2">
          {GATHERINGS_UPCOMING.map((g, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl px-4 py-3 flex items-center justify-between"
              style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}
            >
              <div>
                <p className="font-semibold text-sm" style={{ color: "#111111" }}>{g.title}</p>
                <p className="text-xs text-gray-400 mt-0.5">{g.date} · {g.venue}</p>
              </div>
              <span
                className="text-xs font-semibold px-2.5 py-1 rounded-full ml-3 flex-shrink-0"
                style={{ background: "#FFF0F5", color: "#FF1F7D" }}
              >
                {g.seats} seats
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Past */}
      <div>
        <h3 className="font-semibold text-sm uppercase tracking-wider text-gray-400 mb-3">Past</h3>
        <div className="flex flex-col gap-2">
          {GATHERINGS_PAST.map((g, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl px-4 py-3 flex items-center justify-between"
              style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}
            >
              <div>
                <p className="font-semibold text-sm" style={{ color: "#111111" }}>{g.title}</p>
                <p className="text-xs text-gray-400 mt-0.5">{g.date} · {g.attendees} women</p>
              </div>
              <div className="flex items-center gap-1 ml-3 flex-shrink-0">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="#FF1F7D">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
                <span className="text-xs font-semibold" style={{ color: "#111111" }}>{g.rating}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ClubHealthSection() {
  const stats = [
    { label: "Attendance Rate", value: "87%", sub: "last 30 days" },
    { label: "Retention Rate", value: "94%", sub: "members who stay" },
    { label: "Avg. Response Time", value: "2.4h", sub: "to join requests" },
    { label: "Active Members", value: "268", sub: "of 312 total" },
    { label: "Events This Month", value: "8", sub: "planned gatherings" },
    { label: "Approval Rate", value: "61%", sub: "of join requests" },
  ];

  return (
    <div>
      <div className="mb-5">
        <h2 className="text-lg font-bold" style={{ color: "#111111" }}>Club Health</h2>
        <p className="text-sm text-gray-400 mt-0.5">How the Soft Life Club is doing</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {stats.map((s, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-5"
            style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}
          >
            <p
              className="text-3xl font-bold"
              style={{ color: "#FF1F7D", fontFamily: "var(--font-playfair)" }}
            >
              {s.value}
            </p>
            <p className="font-semibold text-sm mt-1.5" style={{ color: "#111111" }}>{s.label}</p>
            <p className="text-xs text-gray-400 mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const SYMBOL_OPTIONS: { id: "bouquet" | "door" | "crest"; label: string }[] = [
  { id: "bouquet", label: "Bouquet" },
  { id: "door", label: "Door" },
  { id: "crest", label: "Crest" },
];

const COLOR_OPTIONS = [
  { hex: "#FF1F7D", label: "Hot Pink" },
  { hex: "#E8006F", label: "Deep Rose" },
  { hex: "#FF69B4", label: "Barbie Pink" },
  { hex: "#C9005A", label: "Crimson Rose" },
  { hex: "#FF8CB0", label: "Blush Pink" },
];

function CrestSection() {
  const [symbol, setSymbol] = useState<"bouquet" | "door" | "crest">("bouquet");
  const [color, setColor] = useState("#FF1F7D");
  const [motto, setMotto] = useState("Choose peace. Choose softness. Choose yourself.");

  return (
    <div className="max-w-xl">
      <div className="mb-5">
        <h2 className="text-lg font-bold" style={{ color: "#111111" }}>Edit Crest</h2>
        <p className="text-sm text-gray-400 mt-0.5">Your club's symbol, color, and motto</p>
      </div>

      {/* Preview */}
      <div
        className="rounded-3xl p-8 flex flex-col items-center gap-3 mb-6"
        style={{ background: "#FFF0F5" }}
      >
        <ClubCrestSVG symbol={symbol} color={color} size={100} />
        <p className="font-bold text-base text-center" style={{ color: "#111111" }}>Soft Life Club NYC</p>
        <p className="text-xs text-center text-gray-500 italic max-w-xs">{motto || "Your motto here..."}</p>
      </div>

      {/* Symbol */}
      <div className="bg-white rounded-2xl p-5 mb-4" style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}>
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">Club Symbol</p>
        <div className="flex gap-3">
          {SYMBOL_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setSymbol(opt.id)}
              className="flex-1 py-4 rounded-2xl flex flex-col items-center gap-2 border-2 transition-all"
              style={
                symbol === opt.id
                  ? { borderColor: "#FF1F7D", background: "#FFF0F5" }
                  : { borderColor: "#EEE", background: "white" }
              }
            >
              <ClubCrestSVG symbol={opt.id} color={symbol === opt.id ? "#FF1F7D" : "#CCC"} size={48} />
              <span className="text-xs font-semibold" style={{ color: symbol === opt.id ? "#FF1F7D" : "#999" }}>
                {opt.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Color */}
      <div className="bg-white rounded-2xl p-5 mb-4" style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}>
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">Accent Color</p>
        <div className="flex gap-3">
          {COLOR_OPTIONS.map((c) => (
            <button
              key={c.hex}
              onClick={() => setColor(c.hex)}
              className="flex flex-col items-center gap-1.5"
            >
              <div
                className="w-9 h-9 rounded-full border-2 transition-all"
                style={{
                  background: c.hex,
                  borderColor: color === c.hex ? "#111111" : "transparent",
                  boxShadow: color === c.hex ? "0 0 0 2px white, 0 0 0 4px #111111" : "none",
                }}
              />
              <span className="text-xs text-gray-400">{c.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Motto */}
      <div className="bg-white rounded-2xl p-5 mb-5" style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}>
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">Club Motto</p>
        <input
          type="text"
          value={motto}
          onChange={(e) => setMotto(e.target.value)}
          maxLength={80}
          className="w-full text-sm px-4 py-3 rounded-xl border outline-none"
          style={{
            borderColor: "#FFE0EE",
            color: "#111111",
            background: "#FFFAFA",
          }}
          placeholder="Your motto here..."
        />
        <p className="text-xs text-gray-300 mt-1.5 text-right">{motto.length}/80</p>
      </div>

      <button
        className="w-full py-3.5 rounded-full font-bold text-sm text-white"
        style={{ background: "#FF1F7D" }}
      >
        Save Crest
      </button>
    </div>
  );
}

// ── Applications Section ───────────────────────────────────────────────────

function ApplicationsSection() {
  const [filter, setFilter] = useState<"All" | "Pending" | "Accepted" | "Denied">("Pending");
  const [statuses, setStatuses] = useState<Record<number, "pending" | "accepted" | "denied">>(
    Object.fromEntries(APPLICATIONS.map((_, i) => [i, "pending"]))
  );
  const [expanded, setExpanded] = useState<Set<number>>(new Set());

  const filteredIndexes = APPLICATIONS.map((_, i) => i).filter((i) => {
    const s = statuses[i];
    if (filter === "All") return true;
    if (filter === "Pending") return s === "pending";
    if (filter === "Accepted") return s === "accepted";
    if (filter === "Denied") return s === "denied";
    return true;
  });

  const pendingCount = Object.values(statuses).filter((s) => s === "pending").length;

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-lg font-bold" style={{ color: "#111111" }}>Applications</h2>
          <p className="text-sm text-gray-400 mt-0.5">{pendingCount} pending review</p>
        </div>
      </div>

      <div className="flex gap-2 mb-5">
        {(["All", "Pending", "Accepted", "Denied"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="px-4 py-1.5 rounded-full text-sm font-semibold transition-all"
            style={filter === f ? { background: "#FF1F7D", color: "white" } : { background: "#F5F0F3", color: "#888" }}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-4">
        {filteredIndexes.map((realIdx) => {
          const app = APPLICATIONS[realIdx];
          const appStatus = statuses[realIdx];
          const isExpanded = expanded.has(realIdx);

          return (
            <div
              key={realIdx}
              className="bg-white rounded-2xl p-5 transition-all"
              style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.05)", opacity: appStatus !== "pending" ? 0.7 : 1 }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                    style={{ background: "#FF1F7D" }}
                  >
                    {app.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-sm" style={{ color: "#111111" }}>{app.name}</p>
                      {app.verified && (
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: "#FFE0EE", color: "#FF1F7D" }}>
                          Verified
                        </span>
                      )}
                      {appStatus === "accepted" && (
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: "#FFF0F5", color: "#FF1F7D" }}>
                          Accepted
                        </span>
                      )}
                      {appStatus === "denied" && (
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: "#F5F5F5", color: "#999" }}>
                          Denied
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {app.neighborhood} · {app.age} · {app.occupation} · Applied {app.appliedAt}
                    </p>
                    <p className="text-xs mt-1" style={{ color: "#FF1F7D" }}>{app.instagram}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    const next = new Set(expanded);
                    if (next.has(realIdx)) next.delete(realIdx); else next.add(realIdx);
                    setExpanded(next);
                  }}
                  className="text-xs font-semibold flex-shrink-0 mt-1"
                  style={{ color: "#FF1F7D" }}
                >
                  {isExpanded ? "Less" : "View answers"}
                </button>
              </div>

              {isExpanded && (
                <div className="mt-4 pt-4 flex flex-col gap-3" style={{ borderTop: "1px solid #FFF0F5" }}>
                  {app.answers.map((ans, ai) => (
                    <div key={ai}>
                      <p className="text-xs font-semibold text-gray-400 mb-1">{ans.q}</p>
                      <p className="text-sm leading-relaxed italic" style={{ color: "#444" }}>&ldquo;{ans.a}&rdquo;</p>
                    </div>
                  ))}
                </div>
              )}

              {appStatus === "pending" && (
                <div className="flex flex-wrap gap-2 mt-4 pt-3" style={{ borderTop: "1px solid #FFF0F5" }}>
                  <button
                    onClick={() => setStatuses((prev) => ({ ...prev, [realIdx]: "accepted" }))}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold text-white"
                    style={{ background: "#FF1F7D" }}
                  >
                    <IconCheck size={12} /> Accept
                  </button>
                  <button
                    onClick={() => setStatuses((prev) => ({ ...prev, [realIdx]: "denied" }))}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold"
                    style={{ background: "#F5F0F3", color: "#888" }}
                  >
                    <IconX size={12} /> Deny
                  </button>
                  <button
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold"
                    style={{ background: "#F5F0F3", color: "#888" }}
                  >
                    Request more info
                  </button>
                  <button
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold"
                    style={{ background: "#F5F0F3", color: "#888" }}
                  >
                    Message
                  </button>
                </div>
              )}
            </div>
          );
        })}

        {filteredIndexes.length === 0 && (
          <div className="rounded-2xl p-10 text-center" style={{ border: "2px dashed #FFE0EE" }}>
            <p className="text-sm text-gray-400">No {filter.toLowerCase()} applications.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Club Settings Section ──────────────────────────────────────────────────

function ClubSettingsSection() {
  const [accessType, setAccessType] = useState<AccessType>("one_time");
  const [entryStyle, setEntryStyle] = useState<EntryStyle>("application");
  const [price, setPrice] = useState("25");
  const [billingInterval, setBillingInterval] = useState<"monthly" | "annually">("monthly");
  const [saved, setSaved] = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  const ACCESS_OPTIONS: { id: AccessType; label: string; desc: string }[] = [
    { id: "free", label: "Free", desc: "Members join and attend at no cost." },
    { id: "one_time", label: "Pay per gathering", desc: "Members pay a fee for each seat they reserve." },
    { id: "subscription", label: "Membership subscription", desc: "Members pay a recurring fee (monthly or annually)." },
  ];

  const ENTRY_OPTIONS: { id: EntryStyle; label: string; desc: string }[] = [
    { id: "open", label: "Open", desc: "Anyone can join instantly with no approval needed." },
    { id: "application", label: "Application", desc: "Members submit an application. You review and approve." },
    { id: "approval_paywall", label: "Application + Payment", desc: "Members apply, you approve, then they're prompted to pay." },
  ];

  return (
    <div className="max-w-xl flex flex-col gap-5">
      <div>
        <h2 className="text-lg font-bold" style={{ color: "#111111" }}>Club Settings</h2>
        <p className="text-sm text-gray-400 mt-0.5">Configure how women join and pay for your club.</p>
      </div>

      <div className="bg-white rounded-2xl p-5" style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}>
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-4">Access Type</p>
        <div className="flex flex-col gap-3">
          {ACCESS_OPTIONS.map((opt) => (
            <label key={opt.id} className="flex items-start gap-3 cursor-pointer" onClick={() => setAccessType(opt.id)}>
              <div
                className="w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-all"
                style={{ borderColor: accessType === opt.id ? "#FF1F7D" : "#E0E0E0", background: accessType === opt.id ? "#FF1F7D" : "white" }}
              >
                {accessType === opt.id && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: "#111111" }}>{opt.label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{opt.desc}</p>
              </div>
            </label>
          ))}
        </div>

        {accessType !== "free" && (
          <div className="mt-4 pt-4 flex gap-3 items-end" style={{ borderTop: "1px solid #FFF0F5" }}>
            <div className="flex-1">
              <p className="text-xs font-semibold text-gray-400 mb-1.5">Price (USD)</p>
              <div className="flex items-center border rounded-xl overflow-hidden" style={{ borderColor: "#FFE0EE" }}>
                <span className="px-3 py-2.5 text-sm font-semibold" style={{ background: "#FFF5F8", color: "#FF1F7D" }}>$</span>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="flex-1 px-3 py-2.5 text-sm outline-none"
                  style={{ color: "#111111" }}
                  placeholder="0"
                  min="0"
                />
              </div>
            </div>
            {accessType === "subscription" && (
              <div className="flex-1">
                <p className="text-xs font-semibold text-gray-400 mb-1.5">Billing</p>
                <select
                  value={billingInterval}
                  onChange={(e) => setBillingInterval(e.target.value as "monthly" | "annually")}
                  className="w-full px-3 py-2.5 text-sm rounded-xl border outline-none"
                  style={{ borderColor: "#FFE0EE", color: "#111111", background: "white" }}
                >
                  <option value="monthly">Monthly</option>
                  <option value="annually">Annually</option>
                </select>
              </div>
            )}
            {accessType === "one_time" && (
              <div className="flex-1">
                <p className="text-xs font-semibold text-gray-400 mb-1.5">Charged</p>
                <div className="w-full px-3 py-2.5 text-sm rounded-xl border" style={{ borderColor: "#FFE0EE", color: "#888", background: "#FAFAFA" }}>
                  Per gathering
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl p-5" style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}>
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-4">Entry Style</p>
        <div className="flex flex-col gap-3">
          {ENTRY_OPTIONS.map((opt) => (
            <label key={opt.id} className="flex items-start gap-3 cursor-pointer" onClick={() => setEntryStyle(opt.id)}>
              <div
                className="w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-all"
                style={{ borderColor: entryStyle === opt.id ? "#FF1F7D" : "#E0E0E0", background: entryStyle === opt.id ? "#FF1F7D" : "white" }}
              >
                {entryStyle === opt.id && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>
              <div>
                <p className="text-sm font-semibold" style={{ color: "#111111" }}>{opt.label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{opt.desc}</p>
              </div>
            </label>
          ))}
        </div>
        {entryStyle === "approval_paywall" && (
          <div className="mt-4 pt-4 rounded-xl p-3 text-xs" style={{ borderTop: "1px solid #FFF0F5", background: "#FFF5F8", color: "#888" }}>
            Members complete your application form. After you approve them, BloomBay prompts them to pay before they access the Clubhouse.
          </div>
        )}
      </div>

      <button
        onClick={handleSave}
        className="px-8 py-3.5 rounded-full font-bold text-sm text-white transition-all self-start"
        style={{ background: saved ? "#FF1F7D" : "#FF1F7D" }}
      >
        {saved ? "Settings saved" : "Save Settings"}
      </button>
    </div>
  );
}

// ── Form Builder Section ───────────────────────────────────────────────────

type QuestionType = "short_answer" | "long_answer" | "multiple_choice" | "photo" | "social_link" | "rules_checkbox";

interface FormQuestion {
  id: string;
  type: QuestionType;
  label: string;
  required: boolean;
}

const QUESTION_PALETTE: { type: QuestionType; label: string; abbr: string; defaultLabel: string }[] = [
  { type: "short_answer",    label: "Short Answer",    abbr: "T",  defaultLabel: "Your question here" },
  { type: "long_answer",     label: "Long Answer",     abbr: "¶",  defaultLabel: "Tell us about yourself" },
  { type: "multiple_choice", label: "Multiple Choice", abbr: "◉",  defaultLabel: "Choose one" },
  { type: "photo",           label: "Photo Upload",    abbr: "⬛", defaultLabel: "Upload a photo" },
  { type: "social_link",     label: "Social Link",     abbr: "@",  defaultLabel: "Share your Instagram or LinkedIn" },
  { type: "rules_checkbox",  label: "Rules Checkbox",  abbr: "✓",  defaultLabel: "I agree to the club rules." },
];

const TYPE_LABEL: Record<QuestionType, string> = {
  short_answer: "Short answer",
  long_answer: "Long answer",
  multiple_choice: "Multiple choice",
  photo: "Photo upload",
  social_link: "Social link",
  rules_checkbox: "Checkbox",
};

function FormBuilderSection() {
  const [questions, setQuestions] = useState<FormQuestion[]>([
    { id: "default-1", type: "long_answer", label: "Why do you want to join this club?", required: true },
    { id: "default-2", type: "short_answer", label: "Where are you based in NYC?", required: true },
    { id: "default-3", type: "rules_checkbox", label: "I agree to respect all club rules and members.", required: true },
  ]);
  const [saved, setSaved] = useState(false);

  function addQuestion(type: QuestionType, defaultLabel: string) {
    setQuestions((prev) => [...prev, { id: `q-${Date.now()}`, type, label: defaultLabel, required: false }]);
  }

  function removeQuestion(id: string) {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  }

  function updateLabel(id: string, label: string) {
    setQuestions((prev) => prev.map((q) => (q.id === id ? { ...q, label } : q)));
  }

  function toggleRequired(id: string) {
    setQuestions((prev) => prev.map((q) => (q.id === id ? { ...q, required: !q.required } : q)));
  }

  return (
    <div className="flex gap-6">
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold" style={{ color: "#111111" }}>Application Form</h2>
            <p className="text-sm text-gray-400 mt-0.5">{questions.length} questions · shown to applicants</p>
          </div>
          <button
            onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2500); }}
            className="px-5 py-2 rounded-full text-sm font-bold text-white transition-all"
            style={{ background: saved ? "#FF1F7D" : "#FF1F7D" }}
          >
            {saved ? "Saved" : "Save Form"}
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {questions.map((q, i) => (
            <div key={q.id} className="bg-white rounded-2xl p-4" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}>
              <div className="flex items-start gap-3">
                <span className="text-xs font-bold flex-shrink-0 mt-2" style={{ color: "#FF1F7D" }}>
                  0{i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <input
                    type="text"
                    value={q.label}
                    onChange={(e) => updateLabel(q.id, e.target.value)}
                    className="w-full text-sm font-semibold outline-none bg-transparent"
                    style={{ color: "#111111" }}
                  />
                  <p className="text-xs text-gray-400 mt-1">{TYPE_LABEL[q.type]}</p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0 mt-1">
                  <label className="flex items-center gap-1.5 cursor-pointer" onClick={() => toggleRequired(q.id)}>
                    <div
                      className="w-4 h-4 rounded flex items-center justify-center"
                      style={{ background: q.required ? "#FF1F7D" : "white", border: `1.5px solid ${q.required ? "#FF1F7D" : "#E0E0E0"}` }}
                    >
                      {q.required && (
                        <svg width="8" height="8" viewBox="0 0 10 10" fill="none">
                          <path d="M1 5l2.5 2.5L9 1.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                    <span className="text-xs text-gray-400">Required</span>
                  </label>
                  <button onClick={() => removeQuestion(q.id)} className="text-gray-300 transition-colors hover:text-red-400">
                    <IconX size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {questions.length === 0 && (
            <div className="rounded-2xl p-10 text-center" style={{ border: "2px dashed #FFE0EE" }}>
              <p className="text-sm text-gray-400">No questions yet. Add from the palette.</p>
            </div>
          )}
        </div>
      </div>

      <div className="w-56 flex-shrink-0">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">Add Question</p>
        <div className="flex flex-col gap-2">
          {QUESTION_PALETTE.map((p) => (
            <button
              key={p.type}
              onClick={() => addQuestion(p.type, p.defaultLabel)}
              className="flex items-center gap-3 px-4 py-3 rounded-2xl text-left bg-white transition-all"
              style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.05)" }}
            >
              <span
                className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
                style={{ background: "#FFF0F5", color: "#FF1F7D" }}
              >
                {p.abbr}
              </span>
              <span className="text-xs font-semibold" style={{ color: "#111111" }}>{p.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Page Component ─────────────────────────────────────────────────────────

export default function TheClubhouse() {
  const [activeTab, setActiveTab] = useState<Tab>("women");

  const unreadMessages = MESSAGES.filter(m => m.unread).length;

  return (
    <div className="min-h-screen" style={{ background: "#FFF5F8" }}>
      {/* ── Header ── */}
      <div style={{ background: "#111111" }}>
        {/* Top crest area */}
        <div className="px-4 md:px-8 pt-8 pb-6 flex items-center gap-6">
          {/* Crest */}
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: "#FF1F7D" }}
          >
            <ClubCrestSVG symbol="bouquet" color="white" size={64} />
          </div>

          {/* Title block */}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] mb-1" style={{ color: "#FF1F7D" }}>
              The Clubhouse
            </p>
            <h1
              className="text-2xl font-bold leading-tight text-white"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Soft Life Club NYC
            </h1>
            <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.55)", fontStyle: "italic" }}>
              Choose peace. Choose softness. Choose yourself.
            </p>
          </div>

          {/* Quick stats */}
          <div className="flex gap-8 flex-shrink-0">
            {[
              { n: "312", l: "Women" },
              { n: "8", l: "Upcoming" },
              { n: "14", l: "Requests" },
              { n: "87%", l: "Attendance" },
            ].map((s) => (
              <div key={s.l} className="text-center">
                <p className="text-2xl font-bold text-white">{s.n}</p>
                <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.5)" }}>{s.l}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Tab Bar ── */}
        <div className="flex items-end px-6 gap-1 overflow-x-auto">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            const badgeCount = tab.id === "mailbox" ? unreadMessages : tab.badge;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="relative flex items-center gap-2 px-4 py-3 text-sm font-semibold whitespace-nowrap rounded-t-xl transition-all"
                style={
                  isActive
                    ? { background: "#FFF5F8", color: "#FF1F7D" }
                    : { background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.6)" }
                }
              >
                <span style={{ opacity: isActive ? 1 : 0.7 }}>{tab.icon}</span>
                {tab.label}
                {badgeCount && (
                  <span
                    className="text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center"
                    style={{
                      background: isActive ? "#FF1F7D" : "rgba(255,31,125,0.7)",
                      color: "white",
                      fontSize: "10px",
                    }}
                  >
                    {badgeCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Content ── */}
      <div className="px-4 md:px-8 py-6">
        {activeTab === "women" && <WomenSection />}
        {activeTab === "open-seats" && <OpenSeatsSection />}
        {activeTab === "applications" && <ApplicationsSection />}
        {activeTab === "settings" && <ClubSettingsSection />}
        {activeTab === "form-builder" && <FormBuilderSection />}
        {activeTab === "mailbox" && <MailboxSection />}
        {activeTab === "gatherings" && <GatheringsSection />}
        {activeTab === "club-health" && <ClubHealthSection />}
        {activeTab === "crest" && <CrestSection />}
      </div>
    </div>
  );
}
