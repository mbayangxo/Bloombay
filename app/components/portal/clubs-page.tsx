"use client";

import { useState } from "react";
import Link from "next/link";

const TABS = ["All", "My Clubs"];

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
  activity: string;
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
  activity: "🎉 Event coming up Friday",
};

const CLUBS: Club[] = [
  { id: 1, name: "Soft Life Club NYC",      women: 312, desc: "For women who choose peace, softness, and intention. Brunches, spa days, rooftop hangs.",  color: "#FF1F7D", curator: "BloomBay",  tags: ["Lifestyle", "Wellness"], type: "hq",   activity: "🔥 12 women online now" },
  { id: 2, name: "Muslim Women NYC",         women: 76,  desc: "Faith, fashion, food, and sisterhood. Halal outings every week.",                            color: "#FF1F7D", curator: "BloomBay",  tags: ["Faith", "Social"],      type: "hq",   activity: "Planning Thursday meetup" },
  { id: 3, name: "Girl Tech Collective",     women: 89,  desc: "Tech, startups, side projects. Monthly hackathons and mentorship.",                          color: "#FF1F7D", curator: "Sofia K.",  tags: ["Tech", "Career"],       type: "user", activity: "⚡ 5 women active" },
  { id: 4, name: "Girls Who Move",           women: 142, desc: "Run clubs, gym check-ins, yoga flows, hikes. Move together.",                                color: "#FF69B4", curator: "Priya R.",  tags: ["Fitness", "Outdoor"],   type: "user", activity: "🏃‍♀️ Sunday run confirmed" },
  { id: 5, name: "Girl Creatives",           women: 98,  desc: "Writers, artists, photographers. Monthly showcases and collabs.",                             color: "#FF69B4", curator: "Yemi O.",   tags: ["Art", "Creative"],      type: "user", activity: "New showcase posted" },
  { id: 6, name: "Jazz & Wine Girls",        women: 61,  desc: "Jazz nights, wine bars, vinyl listening sessions.",                                           color: "#FF1F7D", curator: "Amanda R.", tags: ["Music", "Social"],      type: "user", activity: "Friday night plans" },
];

const ALL_CLUBS_RANKED = [FEATURED, ...CLUBS].sort((a, b) => b.women - a.women);

const INITIAL_JOINED = new Set<number>([1, 2]);

function HQBadge() {
  return (
    <span className="inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide flex-shrink-0"
      style={{ background: "#111111", color: "white" }}>
      ✦ Official
    </span>
  );
}

function RankedBoardView({ onBack }: { onBack: () => void }) {
  return (
    <div className="min-h-screen pb-36 md:pb-10" style={{ background: "var(--pale-pink-bg)" }}>
      {/* Header */}
      <div className="px-5 pt-12 pb-6 md:px-8 md:pt-8 flex items-center gap-4">
        <button onClick={onBack}
          className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: "white", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FF1F7D" strokeWidth="2.5" strokeLinecap="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
        <div>
          <p className="text-[10px] font-bold tracking-widest uppercase" style={{ color: "#FF1F7D" }}>GIRL CLUBS</p>
          <h1 className="text-3xl font-bold italic leading-tight"
            style={{ fontFamily: "var(--font-playfair)", color: "#111111" }}>
            Club Board
          </h1>
        </div>
        {/* Crest */}
        <div className="ml-auto w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: "#111111" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
            <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
          </svg>
        </div>
      </div>

      <div className="px-5 md:px-8 flex flex-col gap-3">
        {ALL_CLUBS_RANKED.map((club, i) => {
          const rank = i + 1;
          const isTop3 = rank <= 3;
          return (
            <Link key={club.id} href={`/member/clubs/${club.id}`}
              className="flex items-center gap-4 rounded-2xl p-4"
              style={{
                background: "white",
                boxShadow: isTop3 ? "0 4px 20px rgba(255,31,125,0.1)" : "0 1px 8px rgba(0,0,0,0.05)",
                border: isTop3 ? "1.5px solid rgba(255,31,125,0.15)" : "1.5px solid transparent",
                textDecoration: "none",
              }}>
              {/* Rank number */}
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-lg"
                style={
                  rank === 1 ? { background: "linear-gradient(135deg,#FF1F7D,#FF69B4)", color: "white" }
                  : rank === 2 ? { background: "#111111", color: "white" }
                  : rank === 3 ? { background: "linear-gradient(135deg,#FF69B4,#111111)", color: "white" }
                  : { background: "#F5F5F5", color: "#999" }
                }>
                {rank === 1 ? "✦" : `${rank}`}
              </div>

              {/* Club color swatch */}
              <div className="w-10 h-10 rounded-xl flex-shrink-0"
                style={{ background: `linear-gradient(135deg,${club.color},#111111)` }} />

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <p className="font-bold text-sm truncate" style={{ color: "#111111" }}>{club.name}</p>
                  {club.type === "hq" && <span className="text-[8px] font-bold flex-shrink-0" style={{ color: "#FF1F7D" }}>✦</span>}
                </div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  {/🔥|⚡|🎉/.test(club.activity) && (
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 animate-pulse" style={{ background: "#FF1F7D" }} />
                  )}
                  <p className="text-xs font-medium truncate"
                    style={{ color: /🔥|⚡|🎉/.test(club.activity) ? "#FF1F7D" : "#999" }}>
                    {club.activity}
                  </p>
                </div>
                <p className="text-[10px] mt-0.5" style={{ color: "#ccc" }}>{club.women} women</p>
              </div>

              {/* Arrow */}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FF1F7D" strokeWidth="2" strokeLinecap="round" className="flex-shrink-0">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export function ClubsPage() {
  const [activeTab, setActiveTab]     = useState(0);
  const [joined, setJoined]           = useState<Set<number>>(INITIAL_JOINED);
  const [requested, setRequested]     = useState<Set<number>>(new Set());
  const [joiningId, setJoiningId]     = useState<number | null>(null);
  const [womenCounts, setWomenCounts] = useState<Record<number, number>>(
    Object.fromEntries([FEATURED, ...CLUBS].map((c) => [c.id, c.women]))
  );
  const [query, setQuery]     = useState("");
  const [showBoard, setShowBoard] = useState(false);

  if (showBoard) return <RankedBoardView onBack={() => setShowBoard(false)} />;

  const q = query.toLowerCase();
  const filteredClubs = q
    ? CLUBS.filter((c) => c.name.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q) || c.tags.some((t) => t.toLowerCase().includes(q)))
    : CLUBS;
  const showFeatured = !q || FEATURED.name.toLowerCase().includes(q) || FEATURED.desc.toLowerCase().includes(q);

  function joinClub(id: number, type: ClubType) {
    if (type === "hq") { setRequested((prev) => new Set([...prev, id])); return; }
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

  const myClubs = [FEATURED, ...CLUBS].filter((c) => joined.has(c.id) || requested.has(c.id));

  function ClubJoinButton({ club }: { club: Club }) {
    const isJoined    = joined.has(club.id);
    const isRequested = requested.has(club.id);
    const isLoading   = joiningId === club.id;
    if (club.type === "hq") {
      if (isJoined)    return <span className="text-xs font-bold px-3 py-1.5 rounded-full" style={{ background: "#FFE0EC", color: "#FF1F7D", border: "1px solid #FF1F7D" }}>Joined ✓</span>;
      if (isRequested) return <span className="text-xs font-semibold px-3 py-1.5 rounded-full" style={{ background: "#FFE0EC", color: "#FF1F7D" }}>Requested ·</span>;
      return <button onClick={() => joinClub(club.id, "hq")} className="text-xs font-bold px-3 py-1.5 rounded-full transition-all active:scale-90" style={{ background: "#111111", color: "white" }}>Request</button>;
    }
    if (isJoined) return <button onClick={() => leaveClub(club.id)} className="text-xs font-bold px-3 py-1.5 rounded-full transition-all active:scale-90" style={{ background: "#FF1F7D", color: "white" }}>Joined ✓</button>;
    return <button onClick={() => joinClub(club.id, "user")} className="text-xs font-bold px-3 py-1.5 rounded-full transition-all active:scale-90"
      style={isLoading ? { background: "#FF1F7D", color: "white", transform: "scale(0.9)" } : { background: "#FFE0EC", color: "#FF1F7D" }}>
      {isLoading ? "…" : "Join"}
    </button>;
  }

  return (
    <div className="min-h-screen pb-36 md:pb-10" style={{ background: "var(--pale-pink-bg)" }}>

      {/* ── HEADER ── */}
      <div className="px-5 pt-12 pb-3 md:px-8 md:pt-8">
        {/* Title row */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <div>
            <p className="text-[10px] font-bold tracking-widest uppercase mb-0.5" style={{ color: "#FF1F7D" }}>BLOOMBAY</p>
            <h1 className="text-4xl font-bold italic leading-none" style={{ fontFamily: "var(--font-playfair)", color: "#111111", fontWeight: 600 }}>
              Girl Clubs
            </h1>
          </div>
          {/* Ranked crest button */}
          <button
            onClick={() => setShowBoard(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-2xl transition-all active:scale-95"
            style={{ background: "#111111", color: "white" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
            </svg>
            <span className="text-xs font-bold tracking-wide">Ranked</span>
          </button>
        </div>

        {/* Search + discover on same row */}
        <div className="bg-white rounded-2xl px-4 py-3 flex items-center gap-3 mb-4"
          style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.06)", border: "1.5px solid #FFE0EE" }}>
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#FF1F7D" strokeWidth={2} className="flex-shrink-0">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input type="text" value={query} onChange={(e) => setQuery(e.target.value)}
            placeholder="Discover clubs…"
            className="flex-1 text-sm outline-none bg-transparent" style={{ color: "#111111" }} />
          {query && (
            <button onClick={() => setQuery("")} style={{ color: "#ccc" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
          {TABS.map((tab, i) => (
            <button key={tab} onClick={() => setActiveTab(i)}
              className="px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all active:scale-95"
              style={activeTab === i
                ? { background: "#111111", color: "white" }
                : { background: "white", color: "#111111", border: "1.5px solid #E8E8E8" }}>
              {tab}
              {tab === "My Clubs" && myClubs.length > 0 && (
                <span className="ml-1.5 text-xs px-1.5 py-0.5 rounded-full" style={{ background: "#FF1F7D", color: "white" }}>
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
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ background: "#FFE0EC" }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="#FF1F7D">
                  <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold italic mb-2" style={{ fontFamily: "var(--font-playfair)", color: "#111111" }}>No clubs yet</h3>
              <p className="text-sm mb-6" style={{ color: "#aaa" }}>Join a club and find your people</p>
              <button onClick={() => setActiveTab(0)} className="px-6 py-3 rounded-full text-white font-bold text-sm" style={{ background: "#FF1F7D" }}>
                Explore clubs
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {myClubs.map((club) => (
                <div key={club.id} className="bg-white rounded-3xl overflow-hidden" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
                  <div className="h-20 flex items-end p-3 relative" style={{ background: `linear-gradient(135deg,${club.color},#111111)` }}>
                    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 80% 20%, white 0%, transparent 60%)" }} />
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: "rgba(255,255,255,0.2)", color: "white" }}>JOINED ✓</span>
                      {club.type === "hq" && <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: "rgba(0,0,0,0.4)", color: "white" }}>✦ Official</span>}
                    </div>
                  </div>
                  <div className="p-4 flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm" style={{ color: "#111111" }}>{club.name}</p>
                      <div className="flex items-center gap-1.5 mt-1">
                        {/🔥|⚡|🎉/.test(club.activity) && (
                          <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 animate-pulse" style={{ background: "#FF1F7D" }} />
                        )}
                        <p className="text-xs font-medium"
                          style={{ color: /🔥|⚡|🎉/.test(club.activity) ? "#FF1F7D" : "#888" }}>
                          {club.activity}
                        </p>
                      </div>
                      <p className="text-[10px] mt-0.5" style={{ color: "#ccc" }}>{womenCounts[club.id]} women</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {club.tags.map((tag) => (
                          <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ background: "#FFF0F5", color: "#FF1F7D" }}>{tag}</span>
                        ))}
                      </div>
                    </div>
                    {club.type !== "hq" && (
                      <button onClick={() => leaveClub(club.id)} className="flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold border-2 transition-all active:scale-95" style={{ borderColor: "#E0E0E0", color: "#999" }}>Leave</button>
                    )}
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
              {showFeatured && (
                <div className="rounded-3xl overflow-hidden" style={{ boxShadow: "0 4px 24px rgba(255,31,125,0.18)" }}>
                  <div className="relative flex flex-col justify-between p-5"
                    style={{ height: "200px", background: "linear-gradient(145deg,#FF1F7D 0%,#FF69B4 40%,#111111 100%)" }}>
                    <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-20" style={{ background: "white", transform: "translate(30%,-30%)" }} />
                    <div className="flex items-start justify-between gap-2 relative">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold px-3 py-1 rounded-full" style={{ background: "rgba(0,0,0,0.45)", color: "white" }}>✦ Official</span>
                        <span className="text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1" style={{ background: "rgba(255,255,255,0.18)", color: "white" }}>
                          <span className="w-1.5 h-1.5 rounded-full inline-block animate-pulse" style={{ background: "white" }} />
                          FEATURED
                        </span>
                      </div>
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: "rgba(255,255,255,0.2)", color: "white" }}>
                        {womenCounts[FEATURED.id]} women
                      </span>
                    </div>
                    <div className="relative">
                      <p className="text-white text-2xl font-bold italic leading-snug mb-1"
                        style={{ fontFamily: "var(--font-playfair)", fontWeight: 500 }}>
                        {FEATURED.name}
                      </p>
                      <p className="text-xs" style={{ color: "rgba(255,255,255,0.6)" }}>BloomBay Official · {FEATURED.activity}</p>
                    </div>
                  </div>
                  <div className="p-5 bg-white">
                    <p className="text-sm leading-relaxed mb-4" style={{ color: "#888" }}>{FEATURED.desc}</p>
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex flex-wrap gap-1.5">
                        {FEATURED.tags.map((tag) => (
                          <span key={tag} className="text-xs px-2.5 py-0.5 rounded-full font-medium" style={{ background: "#FFF0F5", color: "#FF1F7D" }}>{tag}</span>
                        ))}
                      </div>
                      <Link href="/member/clubs/0"
                        className="flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-bold transition-all active:scale-90"
                        style={{ background: "#FF1F7D", color: "white", textDecoration: "none" }}>
                        Discover →
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* Lobby teaser */}
              <Link href="/member/room" className="rounded-3xl p-4 flex items-center gap-4"
                style={{ background: "#111111", boxShadow: "0 2px 12px rgba(0,0,0,0.1)", textDecoration: "none" }}>
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(255,31,125,0.2)" }}>
                  <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#FF1F7D" }} />
                </div>
                <div className="flex-1">
                  <p className="text-white font-bold text-sm">Girl Bar is live now</p>
                  <p className="text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>8 women in Morning Room · Enter the Lobby →</p>
                </div>
              </Link>

              {/* Club grid */}
              <div>
                <p className="text-base font-bold italic mb-3" style={{ fontFamily: "var(--font-playfair)", color: "#111111" }}>All Clubs</p>
                <div className="grid grid-cols-2 gap-3">
                  {filteredClubs.map((club) => {
                    const isJoinedCard = joined.has(club.id);
                    return (
                      <Link key={club.id} href={`/member/clubs/${club.id}`}
                        className="rounded-2xl overflow-hidden bg-white block"
                        style={{
                          boxShadow: isJoinedCard ? "0 2px 12px rgba(255,31,125,0.12)" : "0 1px 8px rgba(0,0,0,0.05)",
                          transform: joiningId === club.id ? "scale(0.97)" : "scale(1)",
                          transition: "transform 0.25s cubic-bezier(0.34,1.56,0.64,1)",
                          border: isJoinedCard ? "1.5px solid #FF1F7D" : "1.5px solid transparent",
                          textDecoration: "none",
                        }}>
                        <div className="h-20 flex items-end p-2 relative overflow-hidden"
                          style={{ background: `linear-gradient(135deg,${club.color},#111111)` }}>
                          <div className="absolute inset-0 opacity-15" style={{ backgroundImage: "radial-gradient(circle at 75% 25%, white 0%, transparent 55%)" }} />
                          {club.type === "hq" && (
                            <span className="absolute top-1.5 right-1.5 text-[8px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: "rgba(0,0,0,0.55)", color: "white" }}>✦</span>
                          )}
                          {isJoinedCard && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: "rgba(255,255,255,0.25)", color: "white" }}>Joined ✓</span>
                          )}
                        </div>
                        <div className="p-3">
                          <p className="font-bold text-sm leading-snug mb-2" style={{ color: "#111111" }}>{club.name}</p>
                          {club.type === "hq" && <div className="mb-1.5"><HQBadge /></div>}
                          {/* Activity — the life signal */}
                          <div className="flex items-center gap-1.5 mb-2">
                            {/🔥|⚡|🎉/.test(club.activity) && (
                              <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 animate-pulse" style={{ background: "#FF1F7D" }} />
                            )}
                            <p className="text-xs font-medium leading-snug"
                              style={{ color: /🔥|⚡|🎉/.test(club.activity) ? "#FF1F7D" : "#888" }}>
                              {club.activity}
                            </p>
                          </div>
                          <p className="text-[10px] mb-2" style={{ color: "#ccc" }}>{womenCounts[club.id]} women</p>
                          <div className="flex justify-end">
                            <span className="text-xs font-bold px-3 py-1.5 rounded-full"
                              style={{ background: isJoinedCard ? "#FFE0EC" : "#111111", color: isJoinedCard ? "#FF1F7D" : "white" }}>
                              {isJoinedCard ? "Joined ✓" : "Discover →"}
                            </span>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Desktop sidebar */}
            <div className="hidden md:flex flex-col gap-4">
              <div className="rounded-2xl p-4 bg-white" style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.05)" }}>
                <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "#FF1F7D" }}>YOUR CLUBS</p>
                {myClubs.length === 0 ? (
                  <p className="text-xs" style={{ color: "#aaa" }}>Join a club to see it here.</p>
                ) : (
                  <div className="flex flex-col gap-2">
                    {myClubs.map((c) => (
                      <div key={c.id} className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full flex-shrink-0" style={{ background: `linear-gradient(135deg,${c.color},#111111)` }} />
                        <p className="text-xs font-semibold flex-1" style={{ color: "#111111" }}>{c.name}</p>
                        {c.type === "hq" && <span className="text-[9px] font-bold" style={{ color: "#FF1F7D" }}>✦</span>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {/* Club Board entry */}
              <button onClick={() => setShowBoard(true)}
                className="rounded-2xl p-4 flex items-center gap-3 w-full transition-all active:scale-95"
                style={{ background: "#111111", textAlign: "left" }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(255,31,125,0.2)" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#FF1F7D">
                    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
                  </svg>
                </div>
                <div>
                  <p className="text-white font-bold text-sm">Club Board</p>
                  <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>Ranked by members</p>
                </div>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" className="ml-auto">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </button>
              {/* HQ legend */}
              <div className="rounded-2xl p-4" style={{ background: "white", boxShadow: "0 1px 8px rgba(0,0,0,0.05)" }}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: "#111111", color: "white" }}>✦ Official</span>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: "#aaa" }}>
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
