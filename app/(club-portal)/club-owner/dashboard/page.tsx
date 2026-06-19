"use client";

import { useState, useEffect, useCallback } from "react";
import { ClubPhotoUpload } from "@/app/components/shared/club-photo-upload";

// ── Real data types ────────────────────────────────────────────────────────

interface ClubInfo {
  id: string;
  name: string;
  tagline: string;
  primary_color: string;
  member_count: number;
  pending_applications: number;
  upcoming_gatherings: number;
  owner_name: string;
  owner_avatar: string | null;
  membership_type: string;
}

interface RealMember {
  user_id: string;
  name: string;
  neighborhood: string;
  avatar_url: string | null;
  joined_at: string;
  joined_label: string;
}

interface RealApplication {
  id: string;
  user_id: string;
  status: "pending" | "accepted" | "rejected";
  message: string | null;
  created_at: string;
  profile: { full_name: string | null; first_name: string | null; avatar_url: string | null; neighborhood: string | null; bio: string | null } | null;
}

interface RealGathering {
  id: string;
  title: string;
  date: string;
  venue: string;
  seats?: number;
}

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
  | "crest"
  | "photos";

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

const TABS: { id: Tab; label: string; badge?: number }[] = [
  { id: "women",        label: "OUR WOMEN" },
  { id: "open-seats",   label: "SEATS" },
  { id: "applications", label: "LETTERS",  badge: 3 },
  { id: "gatherings",   label: "GATHERINGS" },
  { id: "mailbox",      label: "MESSAGES",  badge: 3 },
  { id: "club-health",  label: "PULSE" },
  { id: "crest",        label: "CREST" },
  { id: "photos",       label: "PHOTOS" },
  { id: "form-builder", label: "THE FORM" },
  { id: "settings",     label: "SETTINGS" },
];

// Replace with real club ID from session once club pages are wired to DB
const MOCK_CLUB_ID = "demo-club-id";

function PhotosSection() {
  const [coverUrl, setCoverUrl] = useState<string | null>(null);

  return (
    <div className="max-w-xl">
      <div className="mb-6">
        <p className="text-xs font-bold tracking-[0.2em] uppercase mb-1" style={{ color: "#FF1F7D" }}>PHOTOS</p>
        <h2 className="text-2xl font-bold leading-none" style={{ color: "#111111", fontFamily: "var(--font-playfair)" }}>
          Your club&apos;s cover photo
        </h2>
        <p className="text-sm mt-2" style={{ color: "#888" }}>
          This photo appears on your club card and landing page. Choose something that captures the vibe of your club.
        </p>
      </div>

      <ClubPhotoUpload
        clubId={MOCK_CLUB_ID}
        currentUrl={coverUrl}
        onUpdate={(url) => setCoverUrl(url)}
      />

      {coverUrl && (
        <div
          className="mt-6 rounded-2xl p-4 flex items-start gap-3"
          style={{ background: "#FFF5F8", border: "1px solid rgba(255,31,125,0.12)" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF1F7D" strokeWidth="2" strokeLinecap="round" className="flex-shrink-0 mt-0.5">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          <div>
            <p className="text-sm font-bold" style={{ color: "#111111" }}>Photo saved</p>
            <p className="text-xs mt-0.5" style={{ color: "#888" }}>
              Your members will see this photo on your club card. It may take a moment to appear.
            </p>
          </div>
        </div>
      )}

      <div
        className="mt-6 rounded-2xl p-5"
        style={{ background: "white", boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}
      >
        <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "#bbb" }}>Tips for a great club photo</p>
        <ul className="flex flex-col gap-2">
          {[
            "Use a real photo from a gathering — authenticity beats stock photos",
            "Warm lighting and candid moments feel most inviting",
            "Avoid text overlays — your club name is already displayed separately",
            "Landscape (wider than tall) photos work best",
          ].map((tip, i) => (
            <li key={i} className="flex items-start gap-2.5">
              <span className="text-xs font-bold flex-shrink-0 mt-0.5" style={{ color: "#FF1F7D" }}>·</span>
              <span className="text-sm" style={{ color: "#555" }}>{tip}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// ── Section Components ─────────────────────────────────────────────────────

function WomenSection({ showToast, members }: { showToast: (msg: string) => void; members: RealMember[] }) {
  const displayMembers = members;
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs font-bold tracking-[0.2em] uppercase mb-1" style={{ color: "#FF1F7D" }}>OUR WOMEN</p>
          <h2 className="text-2xl font-bold leading-none" style={{ color: "#111111", fontFamily: "var(--font-playfair)" }}>
            {displayMembers.length} {displayMembers.length === 1 ? "woman" : "women"} strong
          </h2>
        </div>
        <button
          className="px-4 py-2.5 rounded-full text-sm font-bold text-white"
          style={{ background: "#FF1F7D" }}
          onClick={() => {
            navigator.clipboard?.writeText("https://bloombay.app/waitlist").catch(() => {});
            showToast("Invite link copied!");
          }}
        >
          + Invite her
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {displayMembers.map((m, i) => (
          <div
            key={m.user_id ?? i}
            className="rounded-2xl p-4 flex items-center gap-4 bg-white"
            style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.05)" }}
          >
            <div
              className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0 overflow-hidden"
              style={{ background: `radial-gradient(circle at 35% 35%, #FF1F7D, #7F0028)`, boxShadow: "0 2px 8px rgba(255,31,125,0.3)" }}
            >
              {m.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={m.avatar_url} alt={m.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (m.name[0] ?? "?")}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm leading-none" style={{ color: "#111111" }}>{m.name}</p>
              <p className="text-xs text-gray-400 mt-1">{m.neighborhood ? `${m.neighborhood} · ` : ""}since {m.joined_label}</p>
            </div>
            <div className="flex-shrink-0 text-right">
              <p className="text-[10px] font-semibold mt-0.5" style={{ color: "#FF1F7D" }}>member</p>
            </div>
          </div>
        ))}
        {displayMembers.length === 0 && (
          <div className="col-span-2 rounded-2xl p-12 text-center" style={{ border: "2px dashed #FFE0EE" }}>
            <p className="font-bold italic text-base" style={{ color: "#ccc", fontFamily: "var(--font-playfair)" }}>
              The first women are on their way.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function OpenSeatsSection() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs font-bold tracking-[0.2em] uppercase mb-1" style={{ color: "#FF1F7D" }}>SEATS</p>
          <h2 className="text-2xl font-bold leading-none" style={{ color: "#111111", fontFamily: "var(--font-playfair)" }}>
            8 gatherings planned
          </h2>
        </div>
        <button
          className="px-4 py-2.5 rounded-full text-sm font-bold text-white"
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
            style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.05)" }}
          >
            <div>
              <p className="font-bold text-base" style={{ color: "#111111", fontFamily: "var(--font-playfair)" }}>{s.title}</p>
              <p className="text-xs text-gray-400 mt-1">{s.day} · {s.time} · {s.venue}</p>
            </div>
            <div className="text-right flex-shrink-0 ml-6">
              <p className="text-2xl font-bold" style={{ color: "#FF1F7D", fontFamily: "var(--font-playfair)" }}>{s.seats}</p>
              <p className="text-[10px] text-gray-400 mt-0.5 uppercase tracking-wider">seats open</p>
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
      <div className="mb-6">
        <p className="text-xs font-bold tracking-[0.2em] uppercase mb-1" style={{ color: "#FF1F7D" }}>AT THE DOOR</p>
        <h2 className="text-2xl font-bold leading-none" style={{ color: "#111111", fontFamily: "var(--font-playfair)" }}>
          {REQUESTS.length} women waiting
        </h2>
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
      <div className="mb-6">
        <p className="text-xs font-bold tracking-[0.2em] uppercase mb-1" style={{ color: "#FF1F7D" }}>MESSAGES</p>
        <h2 className="text-2xl font-bold leading-none" style={{ color: "#111111", fontFamily: "var(--font-playfair)" }}>
          {unread} {unread === 1 ? "message" : "messages"} waiting
        </h2>
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

const GATHERING_GRADIENTS = [
  "linear-gradient(160deg, #FF1F7D 0%, #111111 100%)",
  "linear-gradient(160deg, #FF69B4 0%, #FF1F7D 100%)",
  "linear-gradient(160deg, #111111 0%, #FF1F7D 100%)",
  "linear-gradient(160deg, #FF1F7D 0%, #FF69B4 100%)",
  "linear-gradient(160deg, #111111 0%, #FF69B4 100%)",
];

function GatheringsSection({ upcoming, past }: { upcoming: RealGathering[]; past: RealGathering[] }) {
  const displayUpcoming = upcoming;
  const displayPast = past;
  return (
    <div className="flex flex-col gap-8">
      {/* Upcoming — editorial poster cards */}
      <div>
        <p className="text-xs font-bold tracking-[0.2em] uppercase mb-4" style={{ color: "#FF1F7D" }}>COMING UP</p>
        {displayUpcoming.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {displayUpcoming.map((g, i) => (
              <div
                key={g.id}
                className="rounded-2xl overflow-hidden relative"
                style={{
                  height: "140px",
                  background: GATHERING_GRADIENTS[i % GATHERING_GRADIENTS.length],
                  boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
                }}
              >
                <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 30%, rgba(0,0,0,0.55) 100%)" }} />
                <div className="absolute inset-0 p-3.5 flex flex-col justify-between">
                  {(g.seats ?? 0) > 0 && (
                    <span
                      className="text-[9px] font-bold px-2 py-0.5 rounded-full self-start"
                      style={{ background: "rgba(255,255,255,0.15)", color: "white", backdropFilter: "blur(6px)" }}
                    >
                      {g.seats} SEATS
                    </span>
                  )}
                  <div>
                    <p className="text-[10px] mb-1" style={{ color: "rgba(255,255,255,0.55)" }}>{g.date}</p>
                    <p className="font-bold text-white text-xs leading-snug" style={{ fontFamily: "var(--font-playfair)" }}>
                      {g.title}
                    </p>
                    <p className="text-[9px] mt-0.5" style={{ color: "rgba(255,255,255,0.5)" }}>{g.venue}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl p-10 text-center" style={{ border: "2px dashed #FFE0EE" }}>
            <p className="text-sm text-gray-400">No upcoming gatherings yet. Plan your first one.</p>
          </div>
        )}
      </div>

      {/* Past — editorial list */}
      {displayPast.length > 0 && (
        <div>
          <p className="text-xs font-bold tracking-[0.2em] uppercase mb-4" style={{ color: "rgba(0,0,0,0.3)" }}>MEMORIES</p>
          <div className="flex flex-col gap-2">
            {displayPast.map((g) => (
              <div
                key={g.id}
                className="bg-white rounded-2xl px-5 py-4 flex items-center justify-between"
                style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.04)" }}
              >
                <div>
                  <p className="font-bold text-sm" style={{ color: "#111111", fontFamily: "var(--font-playfair)" }}>{g.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{g.date} · {g.venue}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ClubHealthSection({ memberCount, upcomingGatherings, pendingApps }: {
  memberCount: number; upcomingGatherings: number; pendingApps: number;
}) {
  const stats = [
    { value: memberCount > 0 ? String(memberCount) : "—", headline: "women in the club", detail: "total members" },
    { value: upcomingGatherings > 0 ? String(upcomingGatherings) : "—", headline: "gatherings coming up", detail: "planned & confirmed" },
    { value: pendingApps > 0 ? String(pendingApps) : "0", headline: "letters waiting", detail: "pending applications" },
    { value: "—", headline: "attendance rate", detail: "coming soon" },
    { value: "—", headline: "retention rate", detail: "coming soon" },
    { value: "—", headline: "response time", detail: "coming soon" },
  ];

  return (
    <div>
      <div className="mb-6">
        <p className="text-xs font-bold tracking-[0.2em] uppercase mb-1" style={{ color: "#FF1F7D" }}>PULSE</p>
        <h2 className="text-2xl font-bold leading-none" style={{ color: "#111111", fontFamily: "var(--font-playfair)" }}>
          The club is thriving
        </h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {stats.map((s, i) => (
          <div
            key={i}
            className="rounded-2xl p-5"
            style={{
              background: i === 0 ? "#111111" : "white",
              boxShadow: i === 0 ? "0 4px 20px rgba(0,0,0,0.15)" : "0 1px 8px rgba(0,0,0,0.05)",
            }}
          >
            <p
              className="font-bold leading-none"
              style={{
                color: i === 0 ? "#FF1F7D" : "#FF1F7D",
                fontFamily: "var(--font-playfair)",
                fontSize: "36px",
              }}
            >
              {s.value}
            </p>
            <p
              className="font-bold text-sm mt-2 leading-snug"
              style={{ color: i === 0 ? "white" : "#111111" }}
            >
              {s.headline}
            </p>
            <p className="text-[10px] mt-1 uppercase tracking-wider" style={{ color: i === 0 ? "rgba(255,255,255,0.35)" : "#bbb" }}>
              {s.detail}
            </p>
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
      <div className="mb-6">
        <p className="text-xs font-bold tracking-[0.2em] uppercase mb-1" style={{ color: "#FF1F7D" }}>CREST</p>
        <h2 className="text-2xl font-bold leading-none" style={{ color: "#111111", fontFamily: "var(--font-playfair)" }}>
          Your club&apos;s identity
        </h2>
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

function ApplicationsSection({ applications, onStatusChange }: {
  applications: RealApplication[];
  onStatusChange: (id: string, status: "accepted" | "rejected") => void;
}) {
  const [filter, setFilter] = useState<"All" | "Pending" | "Accepted" | "Denied">("Pending");
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [localStatuses, setLocalStatuses] = useState<Record<string, string>>({});

  const getStatus = (app: RealApplication) => localStatuses[app.id] ?? app.status;

  const filteredApps = applications.filter((app) => {
    const s = getStatus(app);
    if (filter === "All") return true;
    if (filter === "Pending") return s === "pending";
    if (filter === "Accepted") return s === "accepted";
    if (filter === "Denied") return s === "rejected";
    return true;
  });

  const pendingCount = applications.filter(a => getStatus(a) === "pending").length;

  function handleAction(app: RealApplication, newStatus: "accepted" | "rejected") {
    setLocalStatuses(prev => ({ ...prev, [app.id]: newStatus }));
    onStatusChange(app.id, newStatus);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs font-bold tracking-[0.2em] uppercase mb-1" style={{ color: "#FF1F7D" }}>LETTERS OF INTRODUCTION</p>
          <h2 className="text-2xl font-bold leading-none" style={{ color: "#111111", fontFamily: "var(--font-playfair)" }}>
            {pendingCount} women want in
          </h2>
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        {(["All", "Pending", "Accepted", "Denied"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="px-4 py-1.5 rounded-full text-xs font-bold transition-all tracking-wide"
            style={filter === f ? { background: "#FF1F7D", color: "white" } : { background: "rgba(0,0,0,0.05)", color: "#888" }}
          >
            {f.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-5">
        {filteredApps.map((app) => {
          const appStatus = getStatus(app);
          const isExpanded = expanded.has(app.id);
          const displayName = (app.profile?.full_name as string | null) ?? (app.profile?.first_name as string | null) ?? "Applicant";
          const neighborhood = (app.profile?.neighborhood as string | null) ?? "";
          const appliedAt = app.created_at ? new Date(app.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "";

          return (
            <div
              key={app.id}
              className="rounded-3xl overflow-hidden transition-all"
              style={{
                background: "#FDFAF5",
                border: "1px solid rgba(0,0,0,0.07)",
                boxShadow: appStatus === "pending"
                  ? "0 4px 24px rgba(255,31,125,0.08), 0 1px 6px rgba(0,0,0,0.05)"
                  : "0 1px 6px rgba(0,0,0,0.04)",
                opacity: appStatus !== "pending" ? 0.65 : 1,
              }}
            >
              {/* Top strip */}
              <div className="px-6 py-2.5 flex items-center justify-between" style={{ background: "#F5EDE5", borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
                <span className="text-[9px] font-bold tracking-widest uppercase" style={{ color: "#bbb" }}>
                  {[neighborhood, appliedAt].filter(Boolean).join(" · ")}
                </span>
                <div className="flex items-center gap-2">
                  {appStatus === "accepted" && (
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full" style={{ background: "#FF1F7D", color: "white" }}>
                      WELCOMED
                    </span>
                  )}
                  {appStatus === "rejected" && (
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full" style={{ background: "#F0F0F0", color: "#aaa" }}>
                      NOT THIS TIME
                    </span>
                  )}
                </div>
              </div>

              {/* Letter body */}
              <div className="px-6 pt-5 pb-5">
                <div className="flex items-start gap-4 mb-4">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-base font-bold text-white flex-shrink-0 overflow-hidden"
                    style={{ background: `radial-gradient(circle at 35% 35%, #FF1F7D, #7F0028)`, boxShadow: "0 2px 10px rgba(255,31,125,0.3)" }}
                  >
                    {app.profile?.avatar_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={app.profile.avatar_url} alt={displayName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : displayName[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-base" style={{ color: "#111111", fontFamily: "var(--font-playfair)" }}>{displayName}</p>
                    {app.message && (
                      <p className="text-sm leading-relaxed mt-2 italic" style={{ color: "#555", fontFamily: "var(--font-playfair)" }}>
                        &ldquo;{app.message}&rdquo;
                      </p>
                    )}
                    {app.profile?.bio && !app.message && (
                      <p className="text-sm leading-relaxed mt-2 italic" style={{ color: "#555", fontFamily: "var(--font-playfair)" }}>
                        &ldquo;{app.profile.bio}&rdquo;
                      </p>
                    )}
                  </div>
                  {(app.message ?? app.profile?.bio) && (
                    <button
                      onClick={() => {
                        const next = new Set(expanded);
                        if (next.has(app.id)) next.delete(app.id); else next.add(app.id);
                        setExpanded(next);
                      }}
                      className="text-[11px] font-bold flex-shrink-0"
                      style={{ color: "#FF1F7D" }}
                    >
                      {isExpanded ? "Less" : "Read all"}
                    </button>
                  )}
                </div>

                {isExpanded && app.profile?.bio && app.message && (
                  <div className="flex flex-col gap-4 mb-4 pt-4" style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">About her</p>
                      <p className="text-sm leading-relaxed italic" style={{ color: "#555", fontFamily: "var(--font-playfair)" }}>
                        &ldquo;{app.profile.bio}&rdquo;
                      </p>
                    </div>
                  </div>
                )}

                {appStatus === "pending" && (
                  <div className="flex flex-wrap gap-2 pt-4" style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}>
                    <button
                      onClick={() => handleAction(app, "accepted")}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold text-white"
                      style={{ background: "#FF1F7D" }}
                    >
                      <IconCheck size={12} /> Welcome her
                    </button>
                    <button
                      onClick={() => handleAction(app, "rejected")}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold"
                      style={{ background: "rgba(0,0,0,0.06)", color: "#888" }}
                    >
                      <IconX size={12} /> Not this time
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {filteredApps.length === 0 && (
          <div className="rounded-3xl p-12 text-center" style={{ border: "2px dashed #FFE0EE" }}>
            <p className="text-base font-bold italic" style={{ fontFamily: "var(--font-playfair)", color: "#ccc" }}>
              The circle is quiet right now.
            </p>
            <p className="text-sm text-gray-400 mt-1">No {filter.toLowerCase()} letters.</p>
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
        <p className="text-xs font-bold tracking-[0.2em] uppercase mb-1" style={{ color: "#FF1F7D" }}>SETTINGS</p>
        <h2 className="text-2xl font-bold leading-none mb-1" style={{ color: "#111111", fontFamily: "var(--font-playfair)" }}>
          How women join
        </h2>
        <p className="text-sm text-gray-400">Configure entry and access for your club.</p>
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
            <p className="text-xs font-bold tracking-[0.2em] uppercase mb-1" style={{ color: "#FF1F7D" }}>THE FORM</p>
            <h2 className="text-2xl font-bold leading-none" style={{ color: "#111111", fontFamily: "var(--font-playfair)" }}>
              {questions.length} questions
            </h2>
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
  const [toast, setToast] = useState<string | null>(null);

  // Real data
  const [clubInfo, setClubInfo] = useState<ClubInfo | null>(null);
  const [realMembers, setRealMembers] = useState<RealMember[]>([]);
  const [realApplications, setRealApplications] = useState<RealApplication[]>([]);
  const [upcomingGatherings, setUpcomingGatherings] = useState<RealGathering[]>([]);
  const [pastGatherings, setPastGatherings] = useState<RealGathering[]>([]);
  const [dataLoaded, setDataLoaded] = useState(false);

  const unreadMessages = MESSAGES.filter(m => m.unread).length;

  useEffect(() => {
    async function load() {
      const [clubRes, membersRes, appsRes, gatheringsRes] = await Promise.all([
        fetch("/api/club-portal/my-club"),
        fetch("/api/club-portal/members"),
        fetch("/api/club-portal/applications"),
        fetch("/api/club-portal/gatherings"),
      ]);
      if (clubRes.ok) {
        const d = await clubRes.json();
        setClubInfo(d);
      }
      if (membersRes.ok) {
        const d = await membersRes.json();
        if (Array.isArray(d)) setRealMembers(d);
      }
      if (appsRes.ok) {
        const d = await appsRes.json();
        if (Array.isArray(d)) setRealApplications(d);
      }
      if (gatheringsRes.ok) {
        const d = await gatheringsRes.json();
        if (d.upcoming) setUpcomingGatherings(d.upcoming);
        if (d.past) setPastGatherings(d.past);
      }
      setDataLoaded(true);
    }
    load();
  }, []);

  const handleApplicationStatusChange = useCallback(async (applicationId: string, status: "accepted" | "rejected") => {
    await fetch("/api/club-portal/applications", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ application_id: applicationId, status }),
    });
    // Update local applications state to reflect the change
    setRealApplications(prev =>
      prev.map(a => a.id === applicationId ? { ...a, status } : a)
    );
    if (clubInfo) {
      setClubInfo(prev => prev ? { ...prev, pending_applications: Math.max(0, prev.pending_applications - 1) } : prev);
    }
    showToast(status === "accepted" ? "She's in. Welcome sent. ✦" : "Application declined.");
  }, [clubInfo]);

  function showToast(message: string) {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  }

  const clubName = clubInfo?.name ?? "Your Club";
  const clubTagline = clubInfo?.tagline ?? "";
  const memberCount = clubInfo?.member_count ?? 0;
  const pendingApps = clubInfo?.pending_applications ?? 0;
  const pendingCount = dataLoaded ? pendingApps : (APPLICATIONS.length);

  return (
    <div className="min-h-screen" style={{ background: "#FFF5F8" }}>
      {/* ── Header ── */}
      <div style={{ background: "#111111" }}>
        {/* Top crest area */}
        <div className="px-4 md:px-8 pt-8 pb-6 flex items-center gap-6">
          {/* Crest */}
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: clubInfo?.primary_color ?? "#FF1F7D" }}
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
              {clubName}
            </h1>
            {clubTagline && (
              <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.55)", fontStyle: "italic" }}>
                {clubTagline}
              </p>
            )}
          </div>

          {/* Quick stats */}
          <div className="hidden md:flex gap-8 flex-shrink-0">
            {[
              { n: dataLoaded ? String(memberCount) : "—", l: "Women" },
              { n: dataLoaded ? String(clubInfo?.upcoming_gatherings ?? 0) : "—", l: "Upcoming" },
              { n: dataLoaded ? String(pendingCount) : "—", l: "Letters" },
            ].map((s) => (
              <div key={s.l} className="text-center">
                <p
                  className="font-bold leading-none"
                  style={{ color: "white", fontFamily: "var(--font-playfair)", fontSize: "28px" }}
                >
                  {s.n}
                </p>
                <p className="text-[10px] mt-1 uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.35)" }}>{s.l}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Tab Bar ── */}
        <div className="flex items-end px-6 gap-0 overflow-x-auto" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            const badgeCount = tab.id === "applications" ? (dataLoaded && pendingCount > 0 ? pendingCount : tab.badge) : tab.id === "mailbox" ? unreadMessages : tab.badge;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="relative flex items-center gap-1.5 px-4 py-3.5 whitespace-nowrap transition-all"
                style={{
                  fontSize: "10px",
                  fontWeight: 700,
                  letterSpacing: "0.18em",
                  borderBottom: isActive ? "2px solid #FF1F7D" : "2px solid transparent",
                  color: isActive ? "#FF1F7D" : "rgba(255,255,255,0.4)",
                  background: "transparent",
                }}
              >
                {tab.label}
                {badgeCount && (
                  <span
                    className="font-bold px-1.5 py-0.5 rounded-full leading-none"
                    style={{
                      background: isActive ? "#FF1F7D" : "rgba(255,31,125,0.5)",
                      color: "white",
                      fontSize: "9px",
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
        {activeTab === "women" && <WomenSection showToast={showToast} members={realMembers} />}
        {activeTab === "open-seats" && <OpenSeatsSection />}
        {activeTab === "applications" && (
          <ApplicationsSection
            applications={dataLoaded && realApplications.length > 0 ? realApplications : APPLICATIONS.map((a, i) => ({
              id: String(i),
              user_id: String(i),
              status: "pending" as const,
              message: a.answers[0]?.a ?? null,
              created_at: new Date().toISOString(),
              profile: { full_name: a.name, first_name: null, avatar_url: null, neighborhood: a.neighborhood, bio: a.answers[1]?.a ?? null },
            }))}
            onStatusChange={handleApplicationStatusChange}
          />
        )}
        {activeTab === "settings" && <ClubSettingsSection />}
        {activeTab === "form-builder" && <FormBuilderSection />}
        {activeTab === "mailbox" && <MailboxSection />}
        {activeTab === "gatherings" && <GatheringsSection upcoming={upcomingGatherings} past={pastGatherings} />}
        {activeTab === "club-health" && (
          <ClubHealthSection
            memberCount={memberCount}
            upcomingGatherings={clubInfo?.upcoming_gatherings ?? 0}
            pendingApps={pendingApps}
          />
        )}
        {activeTab === "crest" && <CrestSection />}
        {activeTab === "photos" && <PhotosSection />}
      </div>
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 px-5 py-3 rounded-full text-sm font-bold text-white z-50" style={{ background: "#FF1F7D", boxShadow: "0 4px 20px rgba(255,31,125,0.4)" }}>
          {toast}
        </div>
      )}
    </div>
  );
}
