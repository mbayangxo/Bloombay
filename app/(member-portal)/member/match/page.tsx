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
    matchNote: "Yande thinks you'd love her energy — both early birds with an art habit.",
    color: "#8B5CF6", verified: true,
  },
  {
    id: 3, initial: "J", name: "Jade O.", neighborhood: "Crown Heights",
    clubs: ["Dinner Society", "Sunday Rooftop"],
    vibe: "Restaurants · Rooftops · Great tables",
    matchNote: "She's hosted two dinners you saved to your wishlist.",
    color: "#059669", verified: true,
  },
  {
    id: 4, initial: "N", name: "Naomi B.", neighborhood: "SoHo",
    clubs: ["Girl Tech Collective", "Jazz & Wine"],
    vibe: "Tech · Live music · Late dinners",
    matchNote: "Mutual connection through Jazz & Wine. 3 shared interests.",
    color: "#D97706", verified: false,
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
    color: "#6366F1",
    direction: "incoming", status: "pending",
  },
  {
    id: 3, initial: "F", name: "Fatima A.", neighborhood: "Harlem",
    clubs: ["African Girls Club"],
    color: "#059669",
    message: "Saw your Girl Picks — you have the best taste in hidden gems.",
    direction: "incoming", status: "pending",
  },
  {
    id: 4, initial: "C", name: "Ciara M.", neighborhood: "Brooklyn Heights",
    clubs: ["Dinner Society"],
    color: "#D97706",
    direction: "outgoing", status: "pending",
  },
  {
    id: 5, initial: "Z", name: "Zara F.", neighborhood: "DUMBO",
    clubs: ["Sunday Rooftop"],
    color: "#8B5CF6",
    direction: "outgoing", status: "pending",
  },
];

const FIND_PROFILES: GirlProfile[] = [
  { id: 10, initial: "T", name: "Tara L.", neighborhood: "West Village", clubs: ["Dinner Society"], vibe: "Food · Art · Walks", matchNote: "", color: "#FF1F7D", verified: true },
  { id: 11, initial: "Y", name: "Yemi O.", neighborhood: "SoHo", clubs: ["Jazz & Wine", "Creative Writing"], vibe: "Music · Writing · Culture", matchNote: "", color: "#8B5CF6", verified: true },
  { id: 12, initial: "P", name: "Priya S.", neighborhood: "Brooklyn Heights", clubs: ["Soft Life", "Pilates Club"], vibe: "Wellness · Slow living", matchNote: "", color: "#059669", verified: true },
  { id: 13, initial: "D", name: "Deja W.", neighborhood: "Prospect Heights", clubs: ["Book Club"], vibe: "Books · Coffee · Museums", matchNote: "", color: "#D97706", verified: false },
  { id: 14, initial: "L", name: "Leila M.", neighborhood: "Williamsburg", clubs: ["Sunday Rooftop", "Museum Girls"], vibe: "Rooftops · Art · Architecture", matchNote: "", color: "#EC4899", verified: true },
  { id: 15, initial: "B", name: "Bea T.", neighborhood: "Crown Heights", clubs: ["African Girls Club"], vibe: "Community · Culture · Food", matchNote: "", color: "#14B8A6", verified: true },
];

const FIND_FILTERS = ["Near Me", "Same Clubs", "New In Town", "Verified"] as const;

// ── Sub-components ────────────────────────────────────────────────────────────

function VerifiedBadge() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="#22A85A">
      <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
    </svg>
  );
}

function ProfileAvatar({ initial, color, size = 48 }: { initial: string; color: string; size?: number }) {
  return (
    <div
      className="rounded-full flex items-center justify-center font-bold text-white flex-shrink-0"
      style={{ width: size, height: size, background: color, fontSize: size / 2.8 }}
    >
      {initial}
    </div>
  );
}

// ── GirlMate Tab ─────────────────────────────────────────────────────────────

function GirlMateTab() {
  const [queue, setQueue] = useState(GIRL_MATE_QUEUE);
  const [connected, setConnected] = useState<Set<number>>(new Set());

  function connect(id: number) {
    setConnected((p) => new Set([...p, id]));
    setTimeout(() => setQueue((q) => q.filter((g) => g.id !== id)), 600);
  }
  function pass(id: number) {
    setQueue((q) => q.filter((g) => g.id !== id));
  }

  if (queue.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mb-5" style={{ background: "#FFF0F5" }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#FF1F7D" strokeWidth="1.8" strokeLinecap="round">
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
          </svg>
        </div>
        <p className="font-bold text-base mb-1" style={{ color: "#1A0514" }}>You&apos;re all caught up</p>
        <p className="text-sm text-gray-400">Yande is finding your next match. Check back soon.</p>
      </div>
    );
  }

  return (
    <div className="px-5 flex flex-col gap-4">
      <div className="rounded-2xl p-4 mb-1" style={{ background: "#FFF0F5" }}>
        <p className="text-xs font-bold tracking-widest uppercase mb-0.5" style={{ color: "#FF1F7D" }}>YANDE SAYS</p>
        <p className="text-sm text-gray-600">These women share your rhythm. Connect when it feels right — no pressure.</p>
      </div>

      {queue.map((girl) => (
        <div
          key={girl.id}
          className="bg-white rounded-3xl overflow-hidden"
          style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.07)" }}
        >
          {/* Top accent strip */}
          <div className="h-1.5" style={{ background: girl.color }} />

          <div className="p-5">
            <div className="flex items-start gap-4 mb-4">
              <ProfileAvatar initial={girl.initial} color={girl.color} size={52} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <p className="font-bold text-base" style={{ color: "#1A0514" }}>{girl.name}</p>
                  {girl.verified && <VerifiedBadge />}
                </div>
                <p className="text-sm text-gray-400">{girl.neighborhood}</p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {girl.clubs.map((c) => (
                    <span key={c} className="text-[11px] font-semibold px-2 py-0.5 rounded-full" style={{ background: `${girl.color}18`, color: girl.color }}>
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <p className="text-xs text-gray-500 italic mb-2" style={{ fontFamily: "var(--font-playfair)" }}>
              &ldquo;{girl.vibe}&rdquo;
            </p>

            <div className="rounded-xl p-3 mb-4" style={{ background: "#FFF5F8" }}>
              <p className="text-xs leading-relaxed" style={{ color: "#FF1F7D", fontWeight: 600 }}>
                ✦ {girl.matchNote}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => pass(girl.id)}
                className="flex-1 py-3 rounded-full text-sm font-semibold border transition-all active:scale-95"
                style={{ borderColor: "#E8E8E8", color: "#888" }}
              >
                Not now
              </button>
              <button
                onClick={() => connect(girl.id)}
                className="flex-1 py-3 rounded-full text-sm font-bold text-white transition-all active:scale-95"
                style={{ background: girl.color }}
              >
                {connected.has(girl.id) ? "Request sent ✓" : "Connect"}
              </button>
            </div>
          </div>
        </div>
      ))}
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
          <p className="text-sm text-gray-400 text-center py-8">No incoming requests right now.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {incoming.map((req) => (
              <div key={req.id} className="bg-white rounded-2xl p-4" style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.05)" }}>
                <div className="flex items-start gap-3 mb-3">
                  <ProfileAvatar initial={req.initial} color={req.color} size={44} />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm" style={{ color: "#1A0514" }}>{req.name}</p>
                    <p className="text-xs text-gray-400">{req.neighborhood}</p>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {req.clubs.map((c) => (
                        <span key={c} className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: "#FFF0F5", color: "#FF1F7D" }}>
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                {req.message && (
                  <div className="rounded-xl px-3 py-2.5 mb-3" style={{ background: "#FFF8F2" }}>
                    <p className="text-xs italic leading-relaxed text-gray-600" style={{ fontFamily: "var(--font-playfair)" }}>
                      &ldquo;{req.message}&rdquo;
                    </p>
                  </div>
                )}
                {req.status === "accepted" ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: "#22A85A" }}>
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round">
                        <path d="M1.5 5l2 2 5-4" />
                      </svg>
                    </div>
                    <span className="text-sm font-semibold" style={{ color: "#22A85A" }}>You&apos;re Bloomies now</span>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <button onClick={() => decline(req.id)}
                      className="flex-1 py-2.5 rounded-full text-sm font-semibold border"
                      style={{ borderColor: "#E8E8E8", color: "#888" }}>
                      Decline
                    </button>
                    <button onClick={() => accept(req.id)}
                      className="flex-1 py-2.5 rounded-full text-sm font-bold text-white"
                      style={{ background: "#FF1F7D" }}>
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
        <p className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: "#888" }}>
          SENT REQUESTS · {outgoing.length}
        </p>
        <div className="flex flex-col gap-3">
          {outgoing.map((req) => (
            <div key={req.id} className="bg-white rounded-2xl p-4 flex items-center gap-3" style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.05)" }}>
              <ProfileAvatar initial={req.initial} color={req.color} size={40} />
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm" style={{ color: "#1A0514" }}>{req.name}</p>
                <p className="text-xs text-gray-400">{req.neighborhood}</p>
              </div>
              <span className="text-xs font-semibold px-3 py-1.5 rounded-full" style={{ background: "#F5F5F5", color: "#888" }}>
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
      {/* Search */}
      <div className="relative mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or neighborhood..."
          className="w-full px-5 py-3.5 rounded-full border text-sm outline-none"
          style={{ borderColor: "#FFE0EE", paddingLeft: "44px" }}
        />
        <svg className="absolute left-4 top-1/2 -translate-y-1/2" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="2" strokeLinecap="round">
          <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </div>

      {/* Filter chips */}
      <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
        {FIND_FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => toggleFilter(f)}
            className="px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all"
            style={activeFilters.has(f)
              ? { background: "#FF1F7D", color: "white" }
              : { background: "white", color: "#555", border: "1.5px solid #E8E8E8" }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-3">
        {filtered.map((p) => (
          <div key={p.id} className="bg-white rounded-2xl p-4" style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.05)" }}>
            <div className="flex items-center gap-2 mb-2">
              <ProfileAvatar initial={p.initial} color={p.color} size={38} />
              {p.verified && <VerifiedBadge />}
            </div>
            <p className="font-bold text-sm leading-tight mb-0.5" style={{ color: "#1A0514" }}>{p.name}</p>
            <p className="text-xs text-gray-400 mb-2">{p.neighborhood}</p>
            <p className="text-[11px] text-gray-400 leading-snug mb-3">{p.vibe}</p>
            <button
              onClick={() => setConnected((prev) => new Set([...prev, p.id]))}
              className="w-full py-2 rounded-full text-xs font-bold transition-all"
              style={connected.has(p.id)
                ? { background: "#FFF0F5", color: "#FF1F7D" }
                : { background: "#FF1F7D", color: "white" }}
            >
              {connected.has(p.id) ? "Sent ✓" : "Connect"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

const TABS = ["GirlMate", "Requests", "Find"] as const;
type Tab = typeof TABS[number];

export default function MatchPage() {
  const [activeTab, setActiveTab] = useState<Tab>("GirlMate");
  const incomingCount = REQUESTS.filter((r) => r.direction === "incoming").length;

  return (
    <div className="min-h-screen pb-36 md:pb-10" style={{ background: "var(--pale-pink-bg)" }}>
      {/* Header */}
      <div className="px-5 pt-12 pb-4 md:px-8 md:pt-8">
        <p className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: "var(--bb-pink)" }}>MATCH</p>
        <h1 className="text-4xl font-bold" style={{ color: "var(--bb-black)" }}>Your Circle</h1>
        <p className="text-sm italic text-gray-400 mt-0.5" style={{ fontFamily: "var(--font-playfair)" }}>
          Find her. Connect. Build your world.
        </p>
      </div>

      {/* Tabs */}
      <div className="px-5 mb-5 overflow-x-auto md:px-8">
        <div className="flex gap-2 w-max pb-1">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all active:scale-95 relative"
              style={activeTab === tab
                ? { background: "#1A0514", color: "white" }
                : { background: "white", color: "#555", border: "1.5px solid #E8E8E8" }}
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

      {activeTab === "GirlMate"  && <GirlMateTab />}
      {activeTab === "Requests"  && <RequestsTab />}
      {activeTab === "Find"      && <FindTab />}

      {/* Bouquet note */}
      {activeTab === "GirlMate" && (
        <div className="mx-5 mt-6 rounded-2xl p-4 flex items-center gap-3" style={{ background: "#1A0514" }}>
          <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "rgba(255,31,125,0.2)" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF1F7D" strokeWidth="1.8" strokeLinecap="round">
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
            </svg>
          </div>
          <div>
            <p className="text-white text-sm font-bold">Ready for a Bouquet?</p>
            <p className="text-white/50 text-xs mt-0.5">Invite up to 12 Bloomies into your inner circle. Your private world, your rules.</p>
          </div>
        </div>
      )}
    </div>
  );
}
