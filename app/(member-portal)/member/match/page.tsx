"use client";

import { useState } from "react";

// ── Types ────────────────────────────────────────────────────────────────────

interface GirlProfile {
  id: number;
  initial: string;
  name: string;
  neighborhood: string;
  clubs: string[];
  vibe: string;
  matchNote: string;
  color: string;
  verified: boolean;
}

interface Request {
  id: number;
  initial: string;
  name: string;
  neighborhood: string;
  clubs: string[];
  color: string;
  message?: string;
  direction: "incoming" | "outgoing";
  status: "pending" | "accepted";
}

// ── Mock Data ────────────────────────────────────────────────────────────────

const GIRL_MATE_QUEUE: GirlProfile[] = [
  {
    id: 1, initial: "A", name: "Aminah C.", neighborhood: "Bed-Stuy",
    clubs: ["African Girls Club", "Book Club"],
    vibe: "Cultural events · Sunday markets · Slow mornings",
    matchNote: "You're both in African Girls Club and love the same neighborhood spots.",
    color: "#FF1F7D", verified: true,
  },
  {
    id: 2, initial: "S", name: "Sofia K.", neighborhood: "Greenpoint",
    clubs: ["Pilates Club", "Museum Girls"],
    vibe: "Wellness · Art · Long walks",
    matchNote: "Both early birds who love art and wellness. 3 shared interests.",
    color: "#FF69B4", verified: true,
  },
  {
    id: 3, initial: "J", name: "Jade O.", neighborhood: "Crown Heights",
    clubs: ["Dinner Society", "Sunday Rooftop"],
    vibe: "Restaurants · Rooftops · Great tables",
    matchNote: "She's hosted two dinners you saved to your wishlist.",
    color: "#FF69B4", verified: true,
  },
  {
    id: 4, initial: "N", name: "Naomi B.", neighborhood: "SoHo",
    clubs: ["Girl Tech Collective", "Jazz & Wine"],
    vibe: "Tech · Live music · Late dinners",
    matchNote: "Mutual connection through Jazz & Wine. 3 shared interests.",
    color: "#FF69B4", verified: false,
  },
];

const REQUESTS: Request[] = [
  {
    id: 1, initial: "R", name: "Remi O.", neighborhood: "Williamsburg",
    clubs: ["Book Club"],
    color: "#FF1F7D",
    message: "We kept almost sitting next to each other at the last Book Club. Finally doing this.",
    direction: "incoming", status: "pending",
  },
  {
    id: 2, initial: "K", name: "Kezia N.", neighborhood: "Chelsea",
    clubs: ["Girl Tech Collective", "Museum Girls"],
    color: "#FF1F7D",
    direction: "incoming", status: "pending",
  },
  {
    id: 3, initial: "F", name: "Fatima A.", neighborhood: "Harlem",
    clubs: ["African Girls Club"],
    color: "#FF69B4",
    message: "Saw your Girl Picks — you have the best taste in hidden gems.",
    direction: "incoming", status: "pending",
  },
  {
    id: 4, initial: "C", name: "Ciara M.", neighborhood: "Brooklyn Heights",
    clubs: ["Dinner Society"],
    color: "#FF69B4",
    direction: "outgoing", status: "pending",
  },
  {
    id: 5, initial: "Z", name: "Zara F.", neighborhood: "DUMBO",
    clubs: ["Sunday Rooftop"],
    color: "#FF69B4",
    direction: "outgoing", status: "pending",
  },
];

const FIND_PROFILES: GirlProfile[] = [
  { id: 10, initial: "T", name: "Tara L.", neighborhood: "West Village", clubs: ["Dinner Society"], vibe: "Food · Art · Walks", matchNote: "", color: "#FF1F7D", verified: true },
  { id: 11, initial: "Y", name: "Yemi O.", neighborhood: "SoHo", clubs: ["Jazz & Wine", "Creative Writing"], vibe: "Music · Writing · Culture", matchNote: "", color: "#FF69B4", verified: true },
  { id: 12, initial: "P", name: "Priya S.", neighborhood: "Brooklyn Heights", clubs: ["Soft Life", "Pilates Club"], vibe: "Wellness · Slow living", matchNote: "", color: "#FF69B4", verified: true },
  { id: 13, initial: "D", name: "Deja W.", neighborhood: "Prospect Heights", clubs: ["Book Club"], vibe: "Books · Coffee · Museums", matchNote: "", color: "#FF69B4", verified: false },
  { id: 14, initial: "L", name: "Leila M.", neighborhood: "Williamsburg", clubs: ["Sunday Rooftop", "Museum Girls"], vibe: "Rooftops · Art · Architecture", matchNote: "", color: "#FF69B4", verified: true },
  { id: 15, initial: "B", name: "Bea T.", neighborhood: "Crown Heights", clubs: ["African Girls Club"], vibe: "Community · Culture · Food", matchNote: "", color: "#FF1F7D", verified: true },
];

const FIND_FILTERS = ["Near Me", "Same Clubs", "New In Town", "Verified"] as const;

// ── Sub-components ────────────────────────────────────────────────────────────

function VerifiedBadge() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="#FF1F7D">
      <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
    </svg>
  );
}

function ProfileAvatar({ initial, color, size = 48 }: { initial: string; color: string; size?: number }) {
  return (
    <div
      className="rounded-full flex items-center justify-center font-bold text-white flex-shrink-0"
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, ${color} 0%, ${color}CC 100%)`,
        fontSize: size / 2.6,
        boxShadow: `0 4px 12px ${color}55`,
      }}
    >
      {initial}
    </div>
  );
}

// ── Shared Moments ───────────────────────────────────────────────────────────

const SHARED_MOMENTS = [
  {
    id: 1,
    emoji: "✈️",
    title: "Morocco in October",
    story: "7 women are planning a trip. Amina is building the itinerary. Sofia already booked her flights.",
    action: "Join the conversation",
    avatars: ["A", "S", "P", "K", "N", "Z", "J"],
    gradient: "linear-gradient(135deg, #FF1F7D 0%, #111111 100%)",
  },
  {
    id: 2,
    emoji: "☕",
    title: "Matcha Thursdays, Williamsburg",
    story: "A standing ritual Aaliyah started 3 weeks ago. 4 women show up every week. One spot opened up.",
    action: "Reserve a seat",
    avatars: ["A", "J", "Z", "T"],
    gradient: "linear-gradient(135deg, #111111 0%, #FF69B4 100%)",
  },
  {
    id: 3,
    emoji: "📚",
    title: "Book Club · West Village",
    story: "Naomi is organizing. First pick: Parable of the Sower. First meeting is next Thursday. 3 spots left.",
    action: "Claim your spot",
    avatars: ["N", "T", "P", "R"],
    gradient: "linear-gradient(135deg, #FF69B4 0%, #FF1F7D 100%)",
  },
  {
    id: 4,
    emoji: "🏃‍♀️",
    title: "Sunday Run · Prospect Park",
    story: "Priya started this 2 Sundays ago. 6 women came last week. They always get pastries after.",
    action: "Run with them",
    avatars: ["P", "K", "S", "A", "B"],
    gradient: "linear-gradient(135deg, #FF1F7D 0%, #FF69B4 100%)",
  },
];

function MomentCard({ moment, joined, onJoin }: {
  moment: typeof SHARED_MOMENTS[0];
  joined: boolean;
  onJoin: () => void;
}) {
  return (
    <div className="rounded-3xl overflow-hidden" style={{ boxShadow: "0 4px 24px rgba(255,31,125,0.14)" }}>
      <div className="relative p-5 pb-4" style={{ background: moment.gradient, minHeight: "130px" }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: "rgba(0,0,0,0.12)" }} />
        <div className="relative">
          <p className="text-3xl mb-2">{moment.emoji}</p>
          <p className="text-white font-bold text-lg italic leading-snug" style={{ fontFamily: "var(--font-playfair)" }}>
            {moment.title}
          </p>
        </div>
      </div>
      <div className="bg-white p-4">
        <p className="text-sm leading-relaxed mb-3" style={{ color: "#555" }}>{moment.story}</p>
        <div className="flex items-center justify-between gap-3">
          {/* Avatar stack */}
          <div className="flex items-center">
            {moment.avatars.slice(0, 5).map((a, i) => (
              <div
                key={i}
                className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white border-2 border-white"
                style={{ background: i % 2 === 0 ? "#FF1F7D" : "#FF69B4", marginLeft: i > 0 ? "-8px" : "0", zIndex: 5 - i }}
              >
                {a}
              </div>
            ))}
            {moment.avatars.length > 5 && (
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white border-2 border-white" style={{ background: "#111", marginLeft: "-8px" }}>
                +{moment.avatars.length - 5}
              </div>
            )}
          </div>
          <button
            onClick={onJoin}
            className="flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all active:scale-90"
            style={joined
              ? { background: "var(--light-pink)", color: "var(--bb-pink)" }
              : { background: "#111111", color: "white" }}
          >
            {joined ? "Joined ✓" : moment.action}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Connect Tab ─────────────────────────────────────────────────────────────

function ConnectTab() {
  const [queue, setQueue] = useState(GIRL_MATE_QUEUE);
  const [connected, setConnected] = useState<Set<number>>(new Set());
  const [joinedMoments, setJoinedMoments] = useState<Set<number>>(new Set());

  function connect(id: number) {
    setConnected((p) => new Set([...p, id]));
    setTimeout(() => setQueue((q) => q.filter((g) => g.id !== id)), 700);
  }
  function pass(id: number) {
    setQueue((q) => q.filter((g) => g.id !== id));
  }

  return (
    <div className="px-5 flex flex-col gap-6">
      {/* Shared Moments — lead with what's happening */}
      <div>
        <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "var(--bb-pink)" }}>
          HAPPENING IN YOUR CITY
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SHARED_MOMENTS.map((moment) => (
            <MomentCard
              key={moment.id}
              moment={moment}
              joined={joinedMoments.has(moment.id)}
              onJoin={() => setJoinedMoments((p) => new Set([...p, moment.id]))}
            />
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-4">
        <div className="flex-1 h-px" style={{ background: "#F0E0E8" }} />
        <p className="text-xs font-bold tracking-widest uppercase" style={{ color: "#ddd" }}>YANDE PICKS FOR YOU</p>
        <div className="flex-1 h-px" style={{ background: "#F0E0E8" }} />
      </div>

      {/* Individual recommendations */}
      {queue.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
          <p className="text-xl font-bold italic mb-2" style={{ color: "#111111", fontFamily: "var(--font-playfair)" }}>
            All caught up.
          </p>
          <p className="text-sm italic leading-relaxed" style={{ color: "#FF1F7D", fontFamily: "var(--font-caveat)", fontSize: "17px" }}>
            Yande says: I&apos;m always looking. Your next match is closer than you think.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {queue.map((girl) => (
          <div key={girl.id} className="rounded-2xl overflow-hidden" style={{ background: "white", boxShadow: "0 4px 20px rgba(255,31,125,0.10)" }}>
            {/* Compact gradient banner */}
            <div className="h-20 relative" style={{ background: `linear-gradient(135deg, ${girl.color} 0%, ${girl.color}88 100%)` }}>
              <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 80% 20%, rgba(255,255,255,0.12) 0%, transparent 60%)" }} />
              {/* Category label top-right */}
              <p className="absolute top-2.5 right-3 text-[8px] font-bold tracking-wider uppercase" style={{ color: "rgba(255,255,255,0.7)" }}>
                YANDE PICK
              </p>
              {/* Avatar anchored bottom-left */}
              <div className="absolute bottom-0 left-3" style={{ transform: "translateY(50%)" }}>
                <div className="relative">
                  <ProfileAvatar initial={girl.initial} color={girl.color} size={44} />
                  {girl.verified && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center" style={{ background: "white" }}>
                      <VerifiedBadge />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="px-3.5 pt-7 pb-4">
              <p className="font-bold text-sm italic leading-tight" style={{ color: "#111111", fontFamily: "var(--font-playfair)" }}>
                {girl.name}
              </p>
              <p className="text-[11px] mt-0.5 mb-2" style={{ color: "#aaa" }}>{girl.neighborhood}</p>

              <div className="flex flex-wrap gap-1 mb-2.5">
                {girl.clubs.slice(0, 2).map((c) => (
                  <span key={c} className="text-[9px] font-semibold px-2 py-1 rounded-full" style={{ background: `${girl.color}15`, color: girl.color }}>
                    {c}
                  </span>
                ))}
              </div>

              <p className="text-[10px] mb-3 leading-snug" style={{ color: "#888", borderLeft: `2px solid ${girl.color}44`, paddingLeft: "8px" }}>
                ✦ {girl.matchNote.slice(0, 60)}{girl.matchNote.length > 60 ? "…" : ""}
              </p>

              <button
                onClick={() => connect(girl.id)}
                className="w-full py-2.5 rounded-full text-[11px] font-bold text-white transition-all active:scale-[0.97]"
                style={connected.has(girl.id)
                  ? { background: "#eee", color: "#aaa" }
                  : { background: girl.color, boxShadow: `0 4px 12px ${girl.color}44` }}
              >
                {connected.has(girl.id) ? "Sent ✓" : `Connect`}
              </button>
              <button onClick={() => pass(girl.id)} className="w-full text-center text-[10px] py-1.5 mt-1" style={{ color: "#ccc" }}>
                Not now
              </button>
            </div>
          </div>
        ))}
        </div>
      )}
    </div>
  );
}

// ── Requests Tab ──────────────────────────────────────────────────────────────

function RequestsTab() {
  const [requests, setRequests] = useState(REQUESTS);

  const incoming = requests.filter((r) => r.direction === "incoming");
  const outgoing  = requests.filter((r) => r.direction === "outgoing");

  function accept(id: number) {
    setRequests((prev) => prev.map((r) => r.id === id ? { ...r, status: "accepted" as const } : r));
  }
  function decline(id: number) {
    setRequests((prev) => prev.filter((r) => r.id !== id));
  }

  return (
    <div className="px-5 flex flex-col gap-8">
      {/* Incoming */}
      <div>
        <p className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: "#FF1F7D" }}>
          BLOOM REQUESTS · {incoming.length}
        </p>
        {incoming.length === 0 ? (
          <div className="rounded-2xl p-6 text-center" style={{ background: "#FFF5F8" }}>
            <p className="text-sm italic leading-relaxed" style={{ color: "#FF1F7D", fontFamily: "var(--font-caveat)", fontSize: "17px" }}>
              The invitations are coming. Your energy precedes you.
            </p>
            <p className="text-xs mt-1" style={{ color: "#bbb" }}>— Yande</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {incoming.map((req) => (
              <div
                key={req.id}
                className="bg-white rounded-2xl p-4"
                style={{ boxShadow: "0 2px 12px rgba(255,31,125,0.08)", borderLeft: "3px solid #FF1F7D" }}
              >
                <div className="flex items-start gap-3 mb-3">
                  <ProfileAvatar initial={req.initial} color={req.color} size={48} />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm" style={{ color: "#111111" }}>{req.name}</p>
                    <p className="text-xs mt-0.5" style={{ color: "#aaa" }}>{req.neighborhood}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {req.clubs.map((c) => (
                        <span key={c} className="text-[10px] font-semibold px-2.5 py-1 rounded-full" style={{ background: "#FFF0F5", color: "#FF1F7D" }}>
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                {req.message && (
                  <div className="rounded-xl px-4 py-3 mb-3" style={{ background: "#FFF5F8", borderLeft: "3px solid #FFB6D0" }}>
                    <p className="text-xs italic leading-relaxed" style={{ color: "#555", fontFamily: "var(--font-playfair)" }}>
                      &ldquo;{req.message}&rdquo;
                    </p>
                  </div>
                )}
                {req.status === "accepted" ? (
                  <div className="flex items-center gap-2 py-1">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: "#FF1F7D" }}>
                      <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                        <path d="M1.5 5.5l2.5 2.5 5-5" />
                      </svg>
                    </div>
                    <span className="text-sm font-bold" style={{ color: "#FF1F7D" }}>You&apos;re Bloomies now ✦</span>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => decline(req.id)}
                      className="flex-1 py-3 rounded-full text-sm font-semibold border transition-all active:scale-[0.97]"
                      style={{ borderColor: "#E8E8E8", color: "#888" }}
                    >
                      Decline
                    </button>
                    <button
                      onClick={() => accept(req.id)}
                      className="flex-1 py-3 rounded-full text-sm font-bold text-white transition-all active:scale-[0.97]"
                      style={{ background: "#FF1F7D", boxShadow: "0 4px 14px rgba(255,31,125,0.35)" }}
                    >
                      Accept
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Outgoing */}
      <div>
        <p className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: "#AAAAAA" }}>
          SENT REQUESTS · {outgoing.length}
        </p>
        <div className="flex flex-col gap-3">
          {outgoing.map((req) => (
            <div
              key={req.id}
              className="bg-white rounded-2xl p-4 flex items-center gap-3"
              style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.05)" }}
            >
              <ProfileAvatar initial={req.initial} color={req.color} size={44} />
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm" style={{ color: "#111111" }}>{req.name}</p>
                <p className="text-xs mt-0.5" style={{ color: "#aaa" }}>{req.neighborhood}</p>
              </div>
              <span
                className="text-xs font-semibold px-3 py-1.5 rounded-full"
                style={{ background: "#F5F5F5", color: "#999" }}
              >
                Pending
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Find Tab ──────────────────────────────────────────────────────────────────

function FindTab() {
  const [search, setSearch] = useState("");
  const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set());
  const [connected, setConnected] = useState<Set<number>>(new Set());
  const [focused, setFocused] = useState(false);

  function toggleFilter(f: string) {
    setActiveFilters((prev) => {
      const next = new Set(prev);
      if (next.has(f)) next.delete(f); else next.add(f);
      return next;
    });
  }

  const filtered = FIND_PROFILES.filter((p) =>
    !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.neighborhood.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="px-5">
      {/* Search — pink focus ring */}
      <div className="relative mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Search by name or neighborhood..."
          className="w-full py-4 rounded-2xl text-sm outline-none transition-all"
          style={{
            paddingLeft: "48px",
            paddingRight: "20px",
            border: focused ? "2px solid #FF1F7D" : "2px solid #FFE0EE",
            boxShadow: focused ? "0 0 0 4px rgba(255,31,125,0.10), 0 2px 12px rgba(255,31,125,0.08)" : "0 2px 8px rgba(0,0,0,0.04)",
            background: "white",
          }}
        />
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors"
          width="16" height="16" viewBox="0 0 24 24" fill="none"
          stroke={focused ? "#FF1F7D" : "#C8C8C8"} strokeWidth="2.2" strokeLinecap="round"
        >
          <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </div>

      {/* Filter chips */}
      <div className="flex gap-2 mb-5 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
        {FIND_FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => toggleFilter(f)}
            className="px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all active:scale-95"
            style={
              activeFilters.has(f)
                ? { background: "#FF1F7D", color: "white", boxShadow: "0 2px 8px rgba(255,31,125,0.3)" }
                : { background: "white", color: "#666", border: "1.5px solid #E8E8E8" }
            }
          >
            {f}
          </button>
        ))}
      </div>

      {/* Grid — taller cards with gradient banner */}
      <div className="grid grid-cols-2 gap-3">
        {filtered.map((p) => (
          <div
            key={p.id}
            className="bg-white rounded-2xl overflow-hidden"
            style={{ boxShadow: "0 4px 16px rgba(255,31,125,0.10)" }}
          >
            {/* Taller gradient banner */}
            <div
              className="h-24 relative flex items-end px-3 pb-3"
              style={{
                background: `linear-gradient(135deg, ${p.color}CC 0%, ${p.color}66 60%, #FFE0EE 100%)`,
              }}
            >
              {/* Bloom orb decoration */}
              <div
                className="absolute top-0 right-0 w-20 h-20 rounded-full opacity-20 pointer-events-none"
                style={{
                  background: `radial-gradient(circle, ${p.color} 0%, transparent 70%)`,
                  transform: "translate(25%, -25%)",
                }}
              />
              <div className="relative flex items-end gap-1.5">
                <ProfileAvatar initial={p.initial} color={p.color} size={42} />
                {p.verified && (
                  <div
                    className="mb-0.5 w-4 h-4 rounded-full flex items-center justify-center"
                    style={{ background: "white" }}
                  >
                    <VerifiedBadge />
                  </div>
                )}
              </div>
            </div>

            <div className="p-3.5">
              <p className="font-bold text-sm leading-tight mb-0.5" style={{ color: "#111111" }}>{p.name}</p>
              <p className="text-xs mb-2" style={{ color: "#AAAAAA" }}>{p.neighborhood}</p>
              <p className="text-[11px] leading-snug mb-3" style={{ color: "#BBBBBB" }}>{p.vibe}</p>
              {/* Full-width connect button */}
              <button
                onClick={() => setConnected((prev) => new Set([...prev, p.id]))}
                className="w-full py-2.5 rounded-full text-xs font-bold transition-all active:scale-[0.97]"
                style={
                  connected.has(p.id)
                    ? { background: "#FFF0F5", color: "#FF1F7D" }
                    : { background: "#FF1F7D", color: "white", boxShadow: "0 3px 10px rgba(255,31,125,0.3)" }
                }
              >
                {connected.has(p.id) ? "Sent ✓" : "Connect"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

const TABS = ["Connect", "Requests", "Find"] as const;
type Tab = typeof TABS[number];

export default function MatchPage() {
  const [activeTab, setActiveTab] = useState<Tab>("Connect");
  const incomingCount = REQUESTS.filter((r) => r.direction === "incoming").length;

  return (
    <div className="min-h-screen pb-24 md:pb-12" style={{ background: "var(--pale-pink-bg)" }}>
      {/* Header — large Playfair italic headline */}
      <div className="px-5 pt-14 pb-6 md:px-10 md:pt-10">
        <p
          className="text-xs font-bold tracking-widest uppercase mb-3"
          style={{ color: "var(--bb-pink)" }}
        >
          CONNECT
        </p>
        <h1
          className="font-bold italic leading-none mb-3"
          style={{
            color: "var(--bb-black)",
            fontFamily: "var(--font-playfair)",
            fontSize: "clamp(52px, 14vw, 72px)",
          }}
        >
          Find Her.
        </h1>
        <p className="text-sm font-semibold" style={{ color: "var(--bb-pink)" }}>
          Real plans. Real women. Your city.
        </p>
      </div>

      {/* Tabs — pill buttons: active = solid black + white, inactive = white + border */}
      <div className="px-5 mb-7 md:px-10">
        <div className="flex gap-2">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all active:scale-[0.96] relative"
              style={
                activeTab === tab
                  ? { background: "#111111", color: "white", boxShadow: "0 3px 10px rgba(0,0,0,0.20)" }
                  : { background: "white", color: "#555555", border: "1.5px solid #E0E0E0" }
              }
            >
              {tab}
              {tab === "Requests" && incomingCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center text-white"
                  style={{ background: "#FF1F7D" }}
                >
                  {incomingCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "Connect"  && <ConnectTab />}
      {activeTab === "Requests" && <RequestsTab />}
      {activeTab === "Find"     && <FindTab />}

      {/* Bouquet banner — elegant dark layout */}
      {activeTab === "Connect" && (
        <div
          className="mx-5 mt-10 rounded-3xl p-7 relative overflow-hidden"
          style={{ background: "#111111" }}
        >
          {/* Decorative orbs */}
          <div
            className="absolute top-0 right-0 w-48 h-48 rounded-full pointer-events-none"
            style={{
              background: "radial-gradient(circle, #FF1F7D 0%, transparent 70%)",
              opacity: 0.18,
              transform: "translate(30%, -30%)",
            }}
          />
          <div
            className="absolute bottom-0 left-0 w-32 h-32 rounded-full pointer-events-none"
            style={{
              background: "radial-gradient(circle, #FF69B4 0%, transparent 70%)",
              opacity: 0.12,
              transform: "translate(-30%, 30%)",
            }}
          />

          <div className="relative">
            <p className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: "#FF69B4" }}>
              YOUR BOUQUET
            </p>
            <div className="flex items-start gap-4">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(255,31,125,0.18)" }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FF1F7D" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                </svg>
              </div>
              <div>
                <p
                  className="text-white font-bold italic mb-2"
                  style={{ fontFamily: "var(--font-playfair)", fontSize: "22px" }}
                >
                  Ready for a Bouquet?
                </p>
                <p className="leading-relaxed text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>
                  Invite up to 12 Bloomies into your inner circle.
                  <br />
                  Your private world, your rules.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
