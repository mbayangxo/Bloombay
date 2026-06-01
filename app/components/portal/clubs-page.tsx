"use client";

import { useState } from "react";
import Link from "next/link";

const TABS = ["All", "My Clubs", "Popular", "New"];

type ClubType = "hq" | "user";

type Club = {
  id: number;
  name: string;
  women: number;
  desc: string;
  color: string;
  curator: string;
  tags: string[];
  type: ClubType;
};

const FEATURED: Club = {
  id: 0,
  name: "African Girls Club",
  women: 284,
  desc: "Culture, community, and joy for African women in NYC. Weekly dinners, events, and sisterhood that feels like home.",
  color: "#FF1F7D",
  curator: "BloomBay",
  tags: ["Culture", "Community", "Social"],
  type: "hq",
};

const CLUBS: Club[] = [
  { id: 1, name: "Soft Life Club NYC",      women: 312, desc: "For women who choose peace, softness, and intention. Brunches, spa days, rooftop hangs.",     color: "#FF1F7D", curator: "BloomBay",  tags: ["Lifestyle", "Wellness"],    type: "hq"   },
  { id: 2, name: "Muslim Women NYC",         women: 76,  desc: "Faith, fashion, food, and sisterhood. Halal outings every week.",                               color: "#FF1F7D", curator: "BloomBay",  tags: ["Faith", "Social"],          type: "hq"   },
  { id: 3, name: "Girl Tech Collective",     women: 89,  desc: "Tech, startups, side projects. Monthly hackathons and mentorship.",                             color: "#FF1F7D", curator: "Sofia K.",  tags: ["Tech", "Career"],           type: "user" },
  { id: 4, name: "Girls Who Move",           women: 142, desc: "Run clubs, gym check-ins, yoga flows, hikes. Move together.",                                  color: "#FF69B4", curator: "Priya R.",  tags: ["Fitness", "Outdoor"],       type: "user" },
  { id: 5, name: "Girl Creatives",           women: 98,  desc: "Writers, artists, photographers. Monthly showcases and collabs.",                               color: "#FF69B4", curator: "Yemi O.",   tags: ["Art", "Creative"],          type: "user" },
  { id: 6, name: "Jazz & Wine Girls",        women: 61,  desc: "Jazz nights, wine bars, vinyl listening sessions.",                                             color: "#FF1F7D", curator: "Amanda R.", tags: ["Music", "Social"],          type: "user" },
];

function HQBadge() {
  return (
    <span
      className="inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide flex-shrink-0"
      style={{ background: "#111111", color: "white" }}
    >
      ✦ Official
    </span>
  );
}

export function ClubsPage() {
  const [activeTab, setActiveTab]         = useState(0);
  const [joined, setJoined]               = useState<Set<number>>(new Set());
  const [requested, setRequested]         = useState<Set<number>>(new Set());
  const [joiningId, setJoiningId]         = useState<number | null>(null);
  const [womenCounts, setWomenCounts]     = useState<Record<number, number>>(
    Object.fromEntries([FEATURED, ...CLUBS].map((c) => [c.id, c.women]))
  );

  function joinClub(id: number, type: ClubType) {
    if (type === "hq") {
      setRequested((prev) => new Set([...prev, id]));
      return;
    }
    if (joined.has(id)) return;
    setJoiningId(id);
    setTimeout(() => {
      setJoined((prev) => new Set([...prev, id]));
      setWomenCounts((prev) => ({ ...prev, [id]: prev[id] + 1 }));
      setJoiningId(null);
    }, 280);
  }

  function leaveClub(id: number) {
    setJoined((prev) => { const n = new Set(prev); n.delete(id); return n; });
    setWomenCounts((prev) => ({ ...prev, [id]: prev[id] - 1 }));
  }

  const myClubs = [FEATURED, ...CLUBS].filter((c) => joined.has(c.id));

  function ClubJoinButton({ club }: { club: Club }) {
    const isJoined    = joined.has(club.id);
    const isRequested = requested.has(club.id);
    const isLoading   = joiningId === club.id;

    if (club.type === "hq") {
      if (isJoined)    return <span className="text-xs font-bold px-3 py-1.5 rounded-full" style={{ background: "var(--light-pink)", color: "var(--bb-pink)", border: "1px solid var(--bb-pink)" }}>Member ✓</span>;
      if (isRequested) return <span className="text-xs font-semibold px-3 py-1.5 rounded-full" style={{ background: "var(--light-pink)", color: "var(--bb-pink)" }}>Requested ·</span>;
      return (
        <button onClick={() => joinClub(club.id, "hq")} className="text-xs font-bold px-3 py-1.5 rounded-full transition-all active:scale-90" style={{ background: "#111111", color: "white" }}>
          Request
        </button>
      );
    }

    if (isJoined) return (
      <button onClick={() => leaveClub(club.id)} className="text-xs font-bold px-3 py-1.5 rounded-full transition-all active:scale-90" style={{ background: "var(--light-pink)", color: "var(--bb-pink)", border: "1px solid var(--bb-pink)" }}>
        ✓ In
      </button>
    );
    return (
      <button
        onClick={() => joinClub(club.id, "user")}
        className="text-xs font-bold px-3 py-1.5 rounded-full transition-all active:scale-90"
        style={isLoading
          ? { background: "var(--bb-pink)", color: "white", transform: "scale(0.9)" }
          : { background: "var(--light-pink)", color: "var(--bb-pink)" }}
      >
        {isLoading ? "…" : "Join"}
      </button>
    );
  }

  return (
    <div className="min-h-screen pb-36 md:pb-10" style={{ background: "var(--pale-pink-bg)" }}>
      {/* Header */}
      <div className="px-5 pt-12 pb-4 md:px-8 md:pt-8">
        <p className="text-xs font-semibold tracking-widest uppercase mb-1" style={{ color: "var(--bb-pink)" }}>BLOOMBAY</p>
        <h1 className="text-4xl font-bold" style={{ color: "var(--bb-black)" }}>Girl Clubs</h1>
        <p className="italic text-gray-400 mt-1 text-sm" style={{ fontFamily: "var(--font-playfair)" }}>Find your people</p>
      </div>

      {/* Search */}
      <div className="px-5 mb-4 md:px-8">
        <div className="bg-white rounded-2xl px-4 py-3 flex items-center gap-3" style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.06)" }}>
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="flex-shrink-0" style={{ color: "#aaa" }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input type="text" placeholder="Search clubs…" className="flex-1 text-sm outline-none bg-transparent" style={{ color: "var(--bb-black)" }} />
        </div>
      </div>

      {/* Tabs */}
      <div className="px-5 mb-5 overflow-x-auto md:px-8">
        <div className="flex gap-2 w-max pb-1">
          {TABS.map((tab, i) => (
            <button
              key={tab}
              onClick={() => setActiveTab(i)}
              className="px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all active:scale-95"
              style={
                activeTab === i
                  ? { background: "var(--bb-black)", color: "white" }
                  : { background: "white", color: "var(--bb-black)", border: "1.5px solid #E8E8E8" }
              }
            >
              {tab}
              {tab === "My Clubs" && myClubs.length > 0 && (
                <span className="ml-1.5 text-xs px-1.5 py-0.5 rounded-full" style={{ background: "var(--bb-pink)", color: "white" }}>
                  {myClubs.length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 md:px-8">

        {/* MY CLUBS */}
        {activeTab === 1 && (
          myClubs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ background: "var(--light-pink)" }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="var(--bb-pink)">
                  <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold italic mb-2" style={{ fontFamily: "var(--font-playfair)", color: "var(--bb-black)" }}>No clubs yet</h3>
              <p className="text-gray-400 text-sm mb-6">Join a club and find your people</p>
              <button onClick={() => setActiveTab(0)} className="px-6 py-3 rounded-full text-white font-bold text-sm" style={{ background: "var(--bb-pink)" }}>
                Explore clubs
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {myClubs.map((club) => (
                <div key={club.id} className="bg-white rounded-3xl overflow-hidden" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
                  <div className="h-20 flex items-end p-3" style={{ background: `linear-gradient(135deg,${club.color},#111111)` }}>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: "rgba(255,255,255,0.2)", color: "white" }}>MEMBER</span>
                      {club.type === "hq" && <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: "rgba(0,0,0,0.4)", color: "white" }}>✦ Official</span>}
                    </div>
                  </div>
                  <div className="p-4 flex items-center justify-between gap-3">
                    <div>
                      <p className="font-bold text-sm" style={{ color: "var(--bb-black)" }}>{club.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{womenCounts[club.id]} women · {club.curator}</p>
                    </div>
                    <button onClick={() => leaveClub(club.id)} className="px-4 py-2 rounded-full text-xs font-bold border-2 transition-all active:scale-95" style={{ borderColor: "#E0E0E0", color: "#999" }}>
                      Leave
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {/* ALL / POPULAR / NEW */}
        {(activeTab === 0 || activeTab === 2 || activeTab === 3) && (
          <div className="flex flex-col gap-5 md:grid md:grid-cols-[1fr_300px] md:items-start">
            <div className="flex flex-col gap-5">

              {/* Featured club (always HQ) */}
              <div className="rounded-3xl overflow-hidden" style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.08)" }}>
                <div className="h-32 flex items-end p-4 relative" style={{ background: `linear-gradient(135deg,${FEATURED.color},#FF1F7D,#111111)` }}>
                  <div className="absolute top-3 right-3 flex gap-2">
                    <span className="text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1" style={{ background: "rgba(0,0,0,0.6)", color: "white" }}>
                      ✦ Official
                    </span>
                    <span className="text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1" style={{ background: "rgba(255,255,255,0.2)", color: "white" }}>
                      <span className="w-1.5 h-1.5 rounded-full inline-block animate-pulse" style={{ background: "white" }} />
                      FEATURED
                    </span>
                  </div>
                  <div>
                    <p className="text-white font-bold text-xl italic leading-snug" style={{ fontFamily: "var(--font-playfair)", fontWeight: 500 }}>
                      {FEATURED.name}
                    </p>
                    <p className="text-white/60 text-xs">BloomBay Official</p>
                  </div>
                </div>
                <div className="p-4" style={{ background: "var(--bb-pink)" }}>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <p className="text-white/80 text-sm leading-relaxed flex-1">{FEATURED.desc}</p>
                    {requested.has(FEATURED.id) ? (
                      <span className="flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold" style={{ background: "rgba(255,255,255,0.2)", color: "white" }}>
                        Requested ·
                      </span>
                    ) : (
                      <button
                        onClick={() => joinClub(FEATURED.id, "hq")}
                        className="flex-shrink-0 px-4 py-2 rounded-full text-sm font-bold transition-all active:scale-90"
                        style={{ background: "white", color: "var(--bb-pink)" }}
                      >
                        Request to Join
                      </button>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1.5">
                      {FEATURED.tags.map((tag) => (
                        <span key={tag} className="text-xs px-2.5 py-0.5 rounded-full font-medium" style={{ background: "rgba(255,255,255,0.2)", color: "white" }}>{tag}</span>
                      ))}
                    </div>
                    <p className="text-white/70 text-xs font-semibold">{womenCounts[FEATURED.id]} women</p>
                  </div>
                </div>
              </div>

              {/* The Room teaser */}
              <Link href="/member/room" className="rounded-3xl p-4 flex items-center gap-4 block" style={{ background: "#111111", boxShadow: "0 2px 12px rgba(0,0,0,0.1)" }}>
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(255,31,125,0.2)" }}>
                  <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#FF1F7D" }} />
                </div>
                <div className="flex-1">
                  <p className="text-white font-bold text-sm">Girl Bar is live now</p>
                  <p className="text-white/50 text-xs">8 women in Morning Room · The Room →</p>
                </div>
              </Link>

              {/* All clubs grid */}
              <div>
                <p className="text-base font-bold italic mb-3" style={{ fontFamily: "var(--font-playfair)", color: "var(--bb-black)" }}>All Clubs</p>
                <div className="grid grid-cols-2 gap-3">
                  {CLUBS.map((club) => (
                    <div
                      key={club.id}
                      className="rounded-2xl overflow-hidden bg-white"
                      style={{
                        boxShadow: "0 1px 8px rgba(0,0,0,0.05)",
                        transform: joiningId === club.id ? "scale(0.97)" : "scale(1)",
                        transition: "transform 0.25s cubic-bezier(0.34,1.56,0.64,1)",
                      }}
                    >
                      <div className="h-16 flex items-end p-2 relative" style={{ background: `linear-gradient(135deg,${club.color},#111111)` }}>
                        {club.type === "hq" && (
                          <span className="absolute top-1.5 right-1.5 text-[8px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: "rgba(0,0,0,0.6)", color: "white" }}>
                            ✦
                          </span>
                        )}
                        {joined.has(club.id) && (
                          <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: "rgba(255,255,255,0.25)", color: "white" }}>✓</span>
                        )}
                      </div>
                      <div className="p-3">
                        <div className="flex items-start gap-1 mb-1">
                          <p className="font-bold text-sm leading-snug flex-1" style={{ color: "var(--bb-black)" }}>{club.name}</p>
                        </div>
                        {club.type === "hq" && (
                          <div className="mb-1">
                            <HQBadge />
                          </div>
                        )}
                        <p className="text-xs text-gray-400 mb-2 leading-relaxed line-clamp-2">{club.desc}</p>
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-semibold" style={{ color: "var(--bb-pink)" }}>{womenCounts[club.id]} women</p>
                          <ClubJoinButton club={club} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Desktop sidebar */}
            <div className="hidden md:flex flex-col gap-4">
              <div className="rounded-2xl p-4 bg-white" style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.05)" }}>
                <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "var(--bb-pink)" }}>YOUR CLUBS</p>
                {myClubs.length === 0 ? (
                  <p className="text-xs text-gray-400">Join a club to see it here.</p>
                ) : (
                  <div className="flex flex-col gap-2">
                    {myClubs.map((c) => (
                      <div key={c.id} className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full flex-shrink-0" style={{ background: `linear-gradient(135deg,${c.color},#111111)` }} />
                        <p className="text-xs font-semibold flex-1" style={{ color: "var(--bb-black)" }}>{c.name}</p>
                        {c.type === "hq" && <span className="text-[9px] font-bold" style={{ color: "var(--bb-pink)" }}>✦</span>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {/* HQ legend */}
              <div className="rounded-2xl p-4" style={{ background: "#111111" }}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: "rgba(255,255,255,0.15)", color: "white" }}>✦ Official</span>
                </div>
                <p className="text-white/60 text-xs leading-relaxed">
                  Official BloomBay clubs are curated by us. Request to join — we review every member.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
