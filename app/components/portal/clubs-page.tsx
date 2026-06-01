"use client";

import { useState } from "react";
import Link from "next/link";

const TABS = ["All", "My Clubs", "Popular", "New"];

type Club = {
  id: number;
  name: string;
  women: number;
  desc: string;
  color: string;
  curator: string;
  tags: string[];
};

const FEATURED: Club = {
  id: 0,
  name: "Soft Life Club NYC",
  women: 312,
  desc: "For women who choose peace, softness, and intention. Brunches, spa days, rooftop hangs, slow mornings.",
  color: "#FF1F7D",
  curator: "Amanda R.",
  tags: ["Lifestyle", "Wellness", "Social"],
};

const CLUBS: Club[] = [
  { id: 1, name: "Girl Tech Collective", women: 89, desc: "Tech, startups, side projects. Monthly hackathons and mentorship.", color: "#FF1F7D", curator: "Sofia K.", tags: ["Tech", "Career"] },
  { id: 2, name: "Girls Who Move", women: 142, desc: "Run clubs, gym check-ins, yoga flows, hikes. Move together.", color: "#FF69B4", curator: "Priya R.", tags: ["Fitness", "Outdoor"] },
  { id: 3, name: "Indigenous African NYC", women: 54, desc: "Culture, community, and joy for African women in the city.", color: "#FF1F7D", curator: "Kezia N.", tags: ["Culture", "Community"] },
  { id: 4, name: "Muslim Women NYC", women: 76, desc: "Faith, fashion, food, and sisterhood. Halal outings every week.", color: "#FF1F7D", curator: "Fatima A.", tags: ["Faith", "Social"] },
  { id: 5, name: "Girl Creatives", women: 98, desc: "Writers, artists, photographers. Monthly showcases and collabs.", color: "#FF69B4", curator: "Yemi O.", tags: ["Art", "Creative"] },
  { id: 6, name: "Jazz & Wine Girls", women: 61, desc: "Jazz nights, wine bars, vinyl listening sessions.", color: "#FF1F7D", curator: "Amanda R.", tags: ["Music", "Social"] },
];

export function ClubsPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [joined, setJoined] = useState<Set<number>>(new Set());
  const [joiningId, setJoiningId] = useState<number | null>(null);
  const [womenCounts, setWomenCounts] = useState<Record<number, number>>(
    Object.fromEntries([FEATURED, ...CLUBS].map((c) => [c.id, c.women]))
  );

  function joinClub(id: number) {
    if (joined.has(id)) return;
    setJoiningId(id);
    setTimeout(() => {
      setJoined((prev) => new Set([...prev, id]));
      setWomenCounts((prev) => ({ ...prev, [id]: prev[id] + 1 }));
      setJoiningId(null);
    }, 280);
  }

  function leaveClub(id: number) {
    setJoined((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    setWomenCounts((prev) => ({ ...prev, [id]: prev[id] - 1 }));
  }

  const myClubs = [FEATURED, ...CLUBS].filter((c) => joined.has(c.id));

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
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: "rgba(255,255,255,0.2)", color: "white" }}>MEMBER</span>
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

              {/* Featured club */}
              <div className="rounded-3xl overflow-hidden" style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.08)" }}>
                <div className="h-32 flex items-end p-4 relative" style={{ background: `linear-gradient(135deg,${FEATURED.color},#FF1F7D,#111111)` }}>
                  <span className="absolute top-3 right-3 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1" style={{ background: "rgba(255,255,255,0.2)", color: "white" }}>
                    <span className="w-1.5 h-1.5 rounded-full inline-block animate-pulse" style={{ background: "white" }} />
                    FEATURED
                  </span>
                  <div>
                    <p className="text-white font-bold text-xl italic leading-snug" style={{ fontFamily: "var(--font-playfair)", fontWeight: 500 }}>
                      {FEATURED.name}
                    </p>
                    <p className="text-white/60 text-xs">Curated by {FEATURED.curator}</p>
                  </div>
                </div>
                <div className="p-4" style={{ background: "var(--bb-pink)" }}>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <p className="text-white/80 text-sm leading-relaxed flex-1">{FEATURED.desc}</p>
                    <button
                      onClick={() => joined.has(FEATURED.id) ? leaveClub(FEATURED.id) : joinClub(FEATURED.id)}
                      className="flex-shrink-0 px-4 py-2 rounded-full text-sm font-bold transition-all active:scale-90"
                      style={
                        joiningId === FEATURED.id
                          ? { background: "rgba(255,255,255,0.5)", color: "#FF1F7D", transform: "scale(0.92)" }
                          : joined.has(FEATURED.id)
                          ? { background: "rgba(255,255,255,0.2)", color: "white", border: "1.5px solid rgba(255,255,255,0.4)" }
                          : { background: "white", color: "var(--bb-pink)" }
                      }
                    >
                      {joiningId === FEATURED.id ? "…" : joined.has(FEATURED.id) ? "Member ✓" : "Join"}
                    </button>
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
                      <div className="h-16 flex items-end p-2" style={{ background: `linear-gradient(135deg,${club.color},#111111)` }}>
                        {joined.has(club.id) && (
                          <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: "rgba(255,255,255,0.25)", color: "white" }}>✓</span>
                        )}
                      </div>
                      <div className="p-3">
                        <p className="font-bold text-sm leading-snug mb-1" style={{ color: "var(--bb-black)" }}>{club.name}</p>
                        <p className="text-xs text-gray-400 mb-2 leading-relaxed line-clamp-2">{club.desc}</p>
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-semibold" style={{ color: "var(--bb-pink)" }}>{womenCounts[club.id]} women</p>
                          <button
                            onClick={() => joined.has(club.id) ? leaveClub(club.id) : joinClub(club.id)}
                            className="text-xs font-bold px-3 py-1 rounded-full transition-all active:scale-90"
                            style={
                              joiningId === club.id
                                ? { background: "var(--bb-pink)", color: "white", transform: "scale(0.9)" }
                                : joined.has(club.id)
                                ? { background: "var(--light-pink)", color: "var(--bb-pink)", border: "1px solid var(--bb-pink)" }
                                : { background: "var(--light-pink)", color: "var(--bb-pink)" }
                            }
                          >
                            {joiningId === club.id ? "…" : joined.has(club.id) ? "✓ In" : "Join"}
                          </button>
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
                        <p className="text-xs font-semibold" style={{ color: "var(--bb-black)" }}>{c.name}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
