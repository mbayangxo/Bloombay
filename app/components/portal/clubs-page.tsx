"use client";

import { useState } from "react";
import Link from "next/link";

// ─── Types ─────────────────────────────────────────────────────────────────────

type ClubType = "hq" | "user";
type JourneyLevel = "member" | "regular" | "insider";

type Club = {
  id: number;
  name: string;
  women: number;
  desc: string;
  color: string;
  crestBg: string;
  curator: string;
  tags: string[];
  type: ClubType;
  activity: string;
  live: boolean;
  vibe: string;
};

// ─── Data ──────────────────────────────────────────────────────────────────────

const CLUBS: Club[] = [
  { id: 0, name: "African Girls Club",    women: 284, desc: "Culture, community, and joy for African women in NYC.",  color: "#FF1F7D", crestBg: "#7F0030", curator: "BloomBay",  tags: ["Culture","Community"], type: "hq",   activity: "Jollof + Movie Night · Friday", live: true,  vibe: "Dinner parties that feel like home."     },
  { id: 1, name: "Soft Life Club NYC",    women: 312, desc: "For women who choose peace, softness, and intention.",   color: "#FF69B4", crestBg: "#C51B7A", curator: "BloomBay",  tags: ["Lifestyle","Wellness"],type: "hq",   activity: "12 women online now",              live: true,  vibe: "Brunches, spa days, rooftop hangs."      },
  { id: 2, name: "Muslim Women NYC",      women: 76,  desc: "Faith, fashion, food, and sisterhood.",                  color: "#A855F7", crestBg: "#6B21A8", curator: "BloomBay",  tags: ["Faith","Social"],      type: "hq",   activity: "Thursday meetup in planning",      live: false, vibe: "Halal outings every week."              },
  { id: 3, name: "Girl Tech Collective",  women: 89,  desc: "Tech, startups, side projects.",                         color: "#0EA5E9", crestBg: "#0369A1", curator: "Sofia K.", tags: ["Tech","Career"],       type: "user", activity: "5 women active",                   live: true,  vibe: "Monthly hackathons and mentorship."      },
  { id: 4, name: "Girls Who Move",        women: 142, desc: "Run clubs, gym check-ins, yoga flows, hikes.",           color: "#F59E0B", crestBg: "#92400E", curator: "Priya R.", tags: ["Fitness","Outdoor"],   type: "user", activity: "Sunday run confirmed",             live: false, vibe: "Move together."                         },
  { id: 5, name: "Girl Creatives",        women: 98,  desc: "Writers, artists, photographers.",                       color: "#EC4899", crestBg: "#9D174D", curator: "Yemi O.",  tags: ["Art","Creative"],      type: "user", activity: "New showcase posted",              live: false, vibe: "Monthly showcases and collabs."          },
  { id: 6, name: "Jazz & Wine Girls",     women: 61,  desc: "Jazz nights, wine bars, vinyl listening sessions.",      color: "#8B5CF6", crestBg: "#5B21B6", curator: "Amanda R.",tags: ["Music","Social"],      type: "user", activity: "Friday night plans",               live: false, vibe: "Jazz, wine, and good company."           },
];

const MEMBERSHIP: Record<number, { events: number; since: string }> = {
  1: { events: 4, since: "Mar 2024" },
  2: { events: 1, since: "Apr 2024" },
};

const INITIAL_JOINED = new Set<number>([1, 2]);
const JOURNEY: JourneyLevel[] = ["member", "regular", "insider"];

const CATEGORY_FILTERS = ["All", "Culture", "Wellness", "Tech", "Fitness", "Art", "Music", "Faith"];

function getLevel(events: number): JourneyLevel {
  if (events >= 5) return "insider";
  if (events >= 2) return "regular";
  return "member";
}
function getLabel(level: JourneyLevel) {
  return level === "insider" ? "Insider" : level === "regular" ? "Regular" : "Member";
}
function getFill(level: JourneyLevel) {
  return level === "insider" ? "100%" : level === "regular" ? "66%" : "33%";
}
function getLevelIdx(level: JourneyLevel) {
  return JOURNEY.indexOf(level);
}

// ─── Club Crest ────────────────────────────────────────────────────────────────

function ClubCrest({ name, color, crestBg, size = 52 }: {
  name: string; color: string; crestBg: string; size?: number;
}) {
  const initials = name.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase();
  return (
    <div className="flex-shrink-0 relative rounded-full flex items-center justify-center font-bold text-white"
      style={{
        width: size, height: size,
        background: `radial-gradient(circle at 35% 35%, ${color}, ${crestBg})`,
        boxShadow: `0 4px 16px ${color}44, inset 0 1px 0 rgba(255,255,255,0.2)`,
        fontSize: size / 3.2,
      }}>
      <div className="absolute inset-0 rounded-full pointer-events-none"
        style={{ border: "1.5px solid rgba(255,255,255,0.22)", transform: "scale(0.86)" }} />
      <span className="relative z-10">{initials}</span>
    </div>
  );
}

// ─── Journey Row ──────────────────────────────────────────────────────────────

function JourneyRow({ level, color }: { level: JourneyLevel; color: string }) {
  const idx = getLevelIdx(level);
  return (
    <div className="flex items-center gap-1.5">
      {JOURNEY.map((_, i) => (
        <div key={i} className="w-2 h-2 rounded-full transition-all"
          style={{ background: i <= idx ? color : "rgba(0,0,0,0.10)", transform: i <= idx ? "scale(1)" : "scale(0.75)" }} />
      ))}
      <span className="text-[10px] font-bold tracking-wide ml-0.5" style={{ color }}>{getLabel(level)}</span>
    </div>
  );
}

// ─── Featured Door ─────────────────────────────────────────────────────────────

function FeaturedDoor({ club, tall }: { club: Club; tall?: boolean }) {
  return (
    <Link href={`/member/clubs/${club.id}`} style={{ textDecoration: "none" }}>
      <div className="relative rounded-3xl overflow-hidden" style={{
        background: `linear-gradient(150deg, ${club.color} 0%, ${club.crestBg} 100%)`,
        boxShadow: `0 12px 40px ${club.color}40`,
        minHeight: tall ? "280px" : "220px",
      }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-72 h-72 rounded-full"
            style={{ background: "rgba(255,255,255,0.07)", transform: "translate(35%,-35%)" }} />
          <div className="absolute bottom-0 left-0 w-44 h-44 rounded-full"
            style={{ background: "rgba(255,255,255,0.04)", transform: "translate(-30%,30%)" }} />
        </div>
        <div className="relative z-10 p-6 flex flex-col justify-between" style={{ minHeight: tall ? "280px" : "220px" }}>
          <div className="flex items-start justify-between">
            <div className="flex gap-2">
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full"
                style={{ background: "rgba(0,0,0,0.3)", color: "white" }}>✦ Official</span>
              <span className="flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full"
                style={{ background: "rgba(255,255,255,0.12)", color: "white" }}>
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "white" }} />
                FEATURED
              </span>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full"
              style={{ background: "rgba(255,255,255,0.12)", color: "white" }}>{club.women} women</span>
          </div>
          <div>
            <p style={{ fontFamily: "var(--font-caveat)", fontSize: "17px", color: "rgba(255,255,255,0.55)", marginBottom: "4px" }}>
              {club.activity}
            </p>
            <h2 className="text-3xl font-bold italic text-white leading-tight mb-4"
              style={{ fontFamily: "var(--font-playfair)" }}>{club.name}</h2>
            <span className="inline-flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-full"
              style={{ background: "rgba(255,255,255,0.18)", color: "white" }}>
              Enter the Clubhouse →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

// ─── Mobile: Discover Card ──────────────────────────────────────────────────────

function DiscoverCard({ club, isJoined, isRequested }: {
  club: Club; isJoined: boolean; isRequested: boolean;
}) {
  return (
    <Link href={`/member/clubs/${club.id}`}
      className="flex items-center gap-4 px-4 py-3.5"
      style={{ borderBottom: "1px solid rgba(0,0,0,0.04)", textDecoration: "none" }}>
      <ClubCrest name={club.name} color={club.color} crestBg={club.crestBg} size={50} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          <p className="font-bold text-sm leading-snug" style={{ color: "#111111" }}>{club.name}</p>
          {club.type === "hq" && (
            <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0"
              style={{ background: "#111111", color: "white" }}>✦</span>
          )}
        </div>
        <p className="text-xs mb-1.5 leading-snug" style={{ color: "#999" }}>{club.vibe}</p>
        <div className="flex items-center gap-1.5">
          {club.live && <span className="w-1.5 h-1.5 rounded-full animate-pulse flex-shrink-0" style={{ background: "#FF1F7D" }} />}
          <p className="text-[11px]" style={{ color: club.live ? "#FF1F7D" : "#ccc" }}>{club.activity}</p>
        </div>
      </div>
      <div className="flex-shrink-0">
        {isJoined ? (
          <span className="text-[11px] font-bold px-3 py-1.5 rounded-full" style={{ background: "#FFF0F5", color: "#FF1F7D" }}>In ✓</span>
        ) : isRequested ? (
          <span className="text-[11px] font-semibold px-3 py-1.5 rounded-full" style={{ background: "#FFF9E6", color: "#B45309" }}>Pending</span>
        ) : (
          <span className="text-[11px] font-bold px-3 py-1.5 rounded-full" style={{ background: "#F5F5F5", color: "#555" }}>
            {club.type === "hq" ? "Apply" : "Join"} →
          </span>
        )}
      </div>
    </Link>
  );
}

// ─── Desktop: Club Poster Card ─────────────────────────────────────────────────

function DesktopClubPoster({ club, isJoined, isRequested }: {
  club: Club; isJoined: boolean; isRequested: boolean;
}) {
  return (
    <Link href={`/member/clubs/${club.id}`} style={{ textDecoration: "none" }}>
      <div className="rounded-2xl overflow-hidden flex flex-col h-full transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
        style={{ background: "white", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: "1px solid rgba(0,0,0,0.04)" }}>
        {/* Gradient header */}
        <div className="relative flex items-center justify-center flex-shrink-0"
          style={{ height: "90px", background: `linear-gradient(135deg, ${club.color}22 0%, ${club.crestBg}38 100%)` }}>
          <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 60% 30%, ${club.color}18, transparent 70%)` }} />
          {club.live && (
            <div className="absolute top-2.5 right-2.5 flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold"
              style={{ background: `${club.color}22`, color: club.color }}>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: club.color }} />
              LIVE
            </div>
          )}
          {club.type === "hq" && (
            <div className="absolute top-2.5 left-2.5 text-[8px] font-bold px-1.5 py-0.5 rounded-full"
              style={{ background: "#111111", color: "white" }}>✦</div>
          )}
          <ClubCrest name={club.name} color={club.color} crestBg={club.crestBg} size={50} />
        </div>
        {/* Content */}
        <div className="p-4 flex flex-col flex-1">
          <p className="font-bold text-sm leading-snug mb-1" style={{ color: "#111111" }}>{club.name}</p>
          <p className="text-[11px] mb-3 flex-1 leading-relaxed" style={{ color: "#aaa" }}>{club.vibe}</p>
          <div className="flex items-center justify-between mt-auto">
            <span className="text-[10px]" style={{ color: "#ccc" }}>{club.women.toLocaleString()} women</span>
            {isJoined ? (
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full" style={{ background: "#FFF0F5", color: "#FF1F7D" }}>In ✓</span>
            ) : isRequested ? (
              <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full" style={{ background: "#FFF9E6", color: "#B45309" }}>Pending</span>
            ) : (
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full text-white" style={{ background: club.color }}>
                {club.type === "hq" ? "Apply" : "Join"} →
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

// ─── Desktop: Compact Club Row (sidebar) ──────────────────────────────────────

function CompactClubRow({ club }: { club: Club }) {
  const m = MEMBERSHIP[club.id];
  const level = m ? getLevel(m.events) : "member";
  return (
    <Link href={`/member/clubs/${club.id}`} style={{ textDecoration: "none" }}>
      <div className="flex items-center gap-2.5 px-2 py-2.5 rounded-xl transition-colors hover:bg-pink-50">
        <ClubCrest name={club.name} color={club.color} crestBg={club.crestBg} size={34} />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold truncate leading-snug mb-0.5" style={{ color: "#111111" }}>{club.name}</p>
          <JourneyRow level={level} color={club.color} />
        </div>
        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#ddd" strokeWidth="2.5" strokeLinecap="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </div>
    </Link>
  );
}

// ─── Yande Recommendation ─────────────────────────────────────────────────────

function YandeRec() {
  return (
    <div className="rounded-2xl px-4 py-3.5 flex items-center gap-3.5" style={{ background: "#111111" }}>
      <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ background: "rgba(255,31,125,0.15)", border: "1px solid rgba(255,31,125,0.25)" }}>
        <span style={{ color: "#FF1F7D", fontSize: "13px" }}>✦</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[12px] font-bold leading-snug" style={{ color: "rgba(255,255,255,0.9)" }}>
          Yande found 3 clubs for your energy.
        </p>
        <p style={{ fontFamily: "var(--font-caveat)", fontSize: "14px", color: "rgba(255,255,255,0.38)", lineHeight: 1.3 }}>
          Soft Life, Girl Creatives, Jazz & Wine Girls
        </p>
      </div>
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#FF1F7D" strokeWidth="2.5" strokeLinecap="round">
        <polyline points="9 18 15 12 9 6" />
      </svg>
    </div>
  );
}

// ─── Club Board Row ───────────────────────────────────────────────────────────

function BoardRow({ club, rank }: { club: Club; rank: number }) {
  const isTop = rank <= 3;
  return (
    <Link href={`/member/clubs/${club.id}`}
      className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors hover:bg-pink-50"
      style={{ textDecoration: "none" }}>
      <div className="w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold flex-shrink-0"
        style={rank === 1
          ? { background: "linear-gradient(135deg,#FF1F7D,#FF69B4)", color: "white" }
          : rank === 2 ? { background: "#111111", color: "white" }
          : rank === 3 ? { background: "#F5ECE8", color: "#FF1F7D" }
          : { background: "#F5F5F5", color: "#bbb" }}>
        {rank === 1 ? "✦" : rank}
      </div>
      <ClubCrest name={club.name} color={club.color} crestBg={club.crestBg} size={30} />
      <div className="flex-1 min-w-0">
        <p className="font-bold text-xs truncate" style={{ color: "#111111" }}>{club.name}</p>
        <p className="text-[10px]" style={{ color: "#ccc" }}>{club.women} women</p>
      </div>
      {club.live && <span className="w-1.5 h-1.5 rounded-full animate-pulse flex-shrink-0" style={{ background: "#FF1F7D" }} />}
    </Link>
  );
}

// ─── Passport Cover ───────────────────────────────────────────────────────────

function PassportCover({ count }: { count: number }) {
  return (
    <div className="rounded-3xl p-6 relative overflow-hidden" style={{ background: "#111111" }}>
      <div className="absolute top-0 right-0 w-56 h-56 rounded-full pointer-events-none"
        style={{ background: "rgba(255,31,125,0.07)", transform: "translate(30%,-30%)" }} />
      <div className="absolute bottom-0 left-0 w-36 h-36 rounded-full pointer-events-none"
        style={{ background: "rgba(255,105,180,0.05)", transform: "translate(-30%,30%)" }} />
      <div className="relative">
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-[9px] font-bold tracking-[0.35em] uppercase mb-4"
              style={{ color: "rgba(255,255,255,0.2)" }}>BLOOMBAY · NYC · ESTD. 2024</p>
            <p className="text-xs font-bold tracking-widest uppercase mb-1"
              style={{ color: "rgba(255,31,125,0.7)" }}>CLUB PASSPORT</p>
            <h2 className="text-3xl font-bold italic text-white" style={{ fontFamily: "var(--font-playfair)" }}>
              My Clubs
            </h2>
          </div>
          <span style={{ color: "#FF1F7D", fontSize: "32px", lineHeight: 1 }}>✦</span>
        </div>
        <div className="flex items-center gap-3 pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
          <div>
            <p className="text-2xl font-bold text-white" style={{ fontFamily: "var(--font-playfair)" }}>{count}</p>
            <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.25)" }}>
              {count === 1 ? "membership" : "memberships"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Passport Stamp ───────────────────────────────────────────────────────────

function PassportStamp({ club, events, since, isPending }: {
  club: Club; events: number; since: string; isPending?: boolean;
}) {
  const level = getLevel(events);
  const levelIdx = getLevelIdx(level);

  return (
    <div className="rounded-3xl overflow-hidden"
      style={{ background: "#FDFAF5", border: "1.5px solid rgba(0,0,0,0.06)", boxShadow: "0 2px 16px rgba(0,0,0,0.04)" }}>
      <div style={{ height: "4px", background: `linear-gradient(90deg, ${club.color}, ${club.crestBg})` }} />
      <div className="p-5">
        <div className="flex items-start gap-4 mb-5">
          <ClubCrest name={club.name} color={club.color} crestBg={club.crestBg} size={60} />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                {club.type === "hq" && (
                  <p className="text-[9px] font-bold tracking-widest uppercase mb-0.5" style={{ color: club.color }}>✦ BLOOMBAY OFFICIAL</p>
                )}
                <p className="font-bold leading-snug" style={{ fontFamily: "var(--font-playfair)", fontSize: "17px", color: "#111111" }}>
                  {club.name}
                </p>
              </div>
              <span className="flex-shrink-0 text-[10px] font-bold px-2.5 py-1 rounded-full"
                style={isPending ? { background: "#FFF9E6", color: "#B45309" } : { background: "#FFF0F5", color: "#FF1F7D" }}>
                {isPending ? "Pending" : "Joined ✓"}
              </span>
            </div>
            <p className="text-[11px] mt-1" style={{ color: "#ccc" }}>Member since {since}</p>
          </div>
        </div>

        {isPending ? (
          <div className="flex items-start gap-3 rounded-2xl px-4 py-3" style={{ background: "#FFF9E6" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#B45309" strokeWidth="2" className="flex-shrink-0 mt-0.5">
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><circle cx="12" cy="16.5" r="0.5" fill="#B45309" />
            </svg>
            <p className="text-xs leading-relaxed" style={{ color: "#92400E" }}>
              Your application is with the host. You&apos;ll hear back within 48 hours.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2.5">
                <p className="text-[10px] font-bold tracking-widest uppercase" style={{ color: "#ccc" }}>YOUR JOURNEY</p>
                <JourneyRow level={level} color={club.color} />
              </div>
              <div className="relative h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(0,0,0,0.07)" }}>
                <div className="absolute inset-y-0 left-0 rounded-full"
                  style={{ background: `linear-gradient(90deg, ${club.color}, ${club.crestBg})`, width: getFill(level) }} />
              </div>
              <div className="flex justify-between mt-1.5 px-0.5">
                {["Member", "Regular", "Insider"].map((l, i) => (
                  <span key={l} className="text-[9px] font-bold"
                    style={{ color: i <= levelIdx ? club.color : "#ddd" }}>{l}</span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-5 pt-3" style={{ borderTop: "1px solid rgba(0,0,0,0.05)" }}>
              <div>
                <p className="font-bold text-xl" style={{ fontFamily: "var(--font-playfair)", color: "#111111" }}>{events}</p>
                <p className="text-[10px]" style={{ color: "#bbb" }}>events</p>
              </div>
              <div>
                <p className="font-bold text-xl" style={{ fontFamily: "var(--font-playfair)", color: "#111111" }}>{club.women}</p>
                <p className="text-[10px]" style={{ color: "#bbb" }}>women</p>
              </div>
              <div className="flex-1" />
              <Link href={`/member/clubs/${club.id}`}
                className="font-bold text-xs px-4 py-2.5 rounded-full"
                style={{ background: club.color, color: "white", textDecoration: "none" }}>
                Enter →
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Main ──────────────────────────────────────────────────────────────────────

export function ClubsPage() {
  const [activeTab, setActiveTab] = useState(0);
  const [joined] = useState<Set<number>>(INITIAL_JOINED);
  const [requested] = useState<Set<number>>(new Set());
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const q = query.toLowerCase();
  const filtered = CLUBS.filter(c => {
    const matchesQuery = !q || c.name.toLowerCase().includes(q) || c.vibe.toLowerCase().includes(q) || c.tags.some(t => t.toLowerCase().includes(q));
    const matchesCategory = categoryFilter === "All" || c.tags.some(t => t.toLowerCase().includes(categoryFilter.toLowerCase()));
    return matchesQuery && matchesCategory;
  });

  const featured = CLUBS[0];
  const rest = filtered.filter(c => c.id !== 0);
  const ranked = [...CLUBS].sort((a, b) => b.women - a.women);
  const myClubs = CLUBS.filter(c => joined.has(c.id) || requested.has(c.id));

  const totalWomen = CLUBS.reduce((a, c) => a + c.women, 0);

  return (
    <div className="min-h-screen" style={{ background: "var(--pale-pink-bg)" }}>

      {/* ══════════════════════════════════════════════════════════════
          MOBILE LAYOUT (hidden on md+)
      ══════════════════════════════════════════════════════════════ */}
      <div className="md:hidden pb-24">
        {/* Mobile Header */}
        <div className="px-5 pt-12 pb-4">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-[10px] font-bold tracking-widest uppercase mb-1" style={{ color: "#FF1F7D" }}>BLOOMBAY</p>
              <h1 className="text-4xl font-bold italic leading-none" style={{ fontFamily: "var(--font-playfair)", color: "#111111" }}>
                Club House
              </h1>
              <p className="text-sm mt-1.5" style={{ fontFamily: "var(--font-instrument)", fontStyle: "italic", color: "#bbb" }}>
                {CLUBS.length} circles · {totalWomen.toLocaleString()} women
              </p>
            </div>
            {myClubs.length > 0 && (
              <button onClick={() => setActiveTab(1)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold mt-1"
                style={{ background: "#111111", color: "white" }}>
                ✦ {myClubs.length} clubs
              </button>
            )}
          </div>

          <div className="bg-white rounded-2xl px-4 py-3 flex items-center gap-3 mb-4"
            style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.05)", border: "1.5px solid #FFE0EE" }}>
            <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="#FF1F7D" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input type="text" value={query} onChange={e => setQuery(e.target.value)}
              placeholder="Search by name, vibe, or interest…"
              className="flex-1 text-sm outline-none bg-transparent" style={{ color: "#111111" }} />
            {query && (
              <button onClick={() => setQuery("")} style={{ color: "#ccc" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>

          <div className="flex gap-2">
            {["DISCOVER", myClubs.length > 0 ? `PASSPORT · ${myClubs.length}` : "PASSPORT"].map((label, i) => (
              <button key={i} onClick={() => setActiveTab(i)}
                className="px-4 py-2 rounded-full text-xs font-bold tracking-wider whitespace-nowrap transition-all"
                style={activeTab === i
                  ? { background: "#111111", color: "white" }
                  : { background: "white", color: "#888", border: "1.5px solid #E8E8E8" }}>
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="px-5 pb-8">
          {activeTab === 0 && (
            <div className="flex flex-col gap-5">
              {(!q || featured.name.toLowerCase().includes(q)) && <FeaturedDoor club={featured} />}
              <div>
                <p className="text-[10px] font-bold tracking-widest uppercase mb-3" style={{ color: "#bbb" }}>
                  {q ? `${filtered.length} clubs` : "ALL CLUBS"}
                </p>
                <div className="rounded-2xl overflow-hidden" style={{ background: "white", boxShadow: "0 1px 10px rgba(0,0,0,0.06)" }}>
                  {rest.map(club => (
                    <DiscoverCard key={club.id} club={club}
                      isJoined={joined.has(club.id)} isRequested={requested.has(club.id)} />
                  ))}
                  {rest.length === 0 && (
                    <div className="py-12 text-center">
                      <p className="text-sm italic" style={{ fontFamily: "var(--font-instrument)", color: "#bbb" }}>
                        No clubs match that search.
                      </p>
                    </div>
                  )}
                </div>
              </div>
              <YandeRec />
            </div>
          )}

          {activeTab === 1 && (
            <div className="flex flex-col gap-4">
              <PassportCover count={myClubs.length} />
              {myClubs.length === 0 ? (
                <div className="flex flex-col items-center text-center py-12">
                  <p className="text-lg font-bold italic mb-2" style={{ fontFamily: "var(--font-playfair)", color: "#111111" }}>
                    Your passport is empty.
                  </p>
                  <p className="mb-6" style={{ fontFamily: "var(--font-caveat)", fontSize: "17px", color: "#FF1F7D" }}>
                    Yande is ready to help you find your people.
                  </p>
                  <button onClick={() => setActiveTab(0)} className="px-6 py-3 rounded-full font-bold text-sm text-white" style={{ background: "#FF1F7D" }}>
                    Find My Clubs →
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {myClubs.map(club => {
                    const isPending = requested.has(club.id) && !joined.has(club.id);
                    const m = MEMBERSHIP[club.id];
                    return <PassportStamp key={club.id} club={club} events={m?.events ?? 0} since={m?.since ?? "2024"} isPending={isPending} />;
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          DESKTOP LAYOUT (hidden on mobile, shown on md+)
          True 3-panel app layout: left nav | main content | right panel
      ══════════════════════════════════════════════════════════════ */}
      <div className="hidden md:flex md:flex-col" style={{ height: "100vh" }}>

        {/* ── Top Bar ── */}
        <div className="flex items-center gap-6 px-8 flex-shrink-0"
          style={{
            height: "64px",
            background: "var(--pale-pink-bg)",
            borderBottom: "1px solid rgba(0,0,0,0.05)",
          }}>
          {/* Brand */}
          <div className="flex-shrink-0">
            <p className="text-[9px] font-bold tracking-widest uppercase leading-none mb-0.5" style={{ color: "#FF1F7D" }}>BLOOMBAY</p>
            <h1 className="text-lg font-bold italic leading-none" style={{ fontFamily: "var(--font-playfair)", color: "#111111" }}>
              Club House
            </h1>
          </div>

          {/* Divider */}
          <div className="w-px h-6 flex-shrink-0" style={{ background: "rgba(0,0,0,0.08)" }} />

          {/* Search */}
          <div className="flex-1 max-w-lg">
            <div className="rounded-xl px-4 py-2 flex items-center gap-2.5"
              style={{ background: "white", border: "1.5px solid #FFE0EE", boxShadow: "0 1px 6px rgba(0,0,0,0.04)" }}>
              <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="#FF1F7D" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input type="text" value={query} onChange={e => setQuery(e.target.value)}
                placeholder="Search clubs by name, vibe, or interest…"
                className="flex-1 text-sm outline-none bg-transparent" style={{ color: "#111111" }} />
              {query && (
                <button onClick={() => setQuery("")} style={{ color: "#ccc" }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6 ml-auto flex-shrink-0">
            <div>
              <p className="text-sm font-bold leading-none" style={{ fontFamily: "var(--font-playfair)", color: "#111111" }}>{CLUBS.length}</p>
              <p className="text-[10px]" style={{ color: "#ccc" }}>circles</p>
            </div>
            <div>
              <p className="text-sm font-bold leading-none" style={{ fontFamily: "var(--font-playfair)", color: "#111111" }}>{totalWomen.toLocaleString()}</p>
              <p className="text-[10px]" style={{ color: "#ccc" }}>women</p>
            </div>
            <div className="flex gap-1.5">
              {[0, 1].map(i => (
                <button key={i} onClick={() => setActiveTab(i)}
                  className="px-3.5 py-1.5 rounded-full text-[11px] font-bold tracking-wide transition-all"
                  style={activeTab === i
                    ? { background: "#111111", color: "white" }
                    : { background: "white", color: "#888", border: "1px solid #E8E8E8" }}>
                  {i === 0 ? "DISCOVER" : `PASSPORT${myClubs.length > 0 ? ` · ${myClubs.length}` : ""}`}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── 3-Column Body ── */}
        <div className="flex flex-1 overflow-hidden">

          {/* LEFT PANEL: My Clubs + Category Filter */}
          <div className="flex-shrink-0 overflow-y-auto py-6 px-4"
            style={{ width: "220px", borderRight: "1px solid rgba(0,0,0,0.05)" }}>

            {/* My Clubs */}
            <p className="text-[9px] font-bold tracking-widest uppercase mb-3 px-2" style={{ color: "#bbb" }}>MY CLUBS</p>
            {myClubs.length > 0 ? (
              myClubs.map(club => <CompactClubRow key={club.id} club={club} />)
            ) : (
              <p className="text-xs px-2 pb-4 leading-relaxed" style={{ color: "#ddd", fontStyle: "italic" }}>
                No clubs yet — discover your first circle below.
              </p>
            )}

            <div className="my-5 mx-2 h-px" style={{ background: "rgba(0,0,0,0.06)" }} />

            {/* Category Filter */}
            <p className="text-[9px] font-bold tracking-widest uppercase mb-3 px-2" style={{ color: "#bbb" }}>FILTER BY</p>
            {CATEGORY_FILTERS.map(cat => (
              <button key={cat} onClick={() => setCategoryFilter(cat)}
                className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold mb-0.5 transition-all"
                style={categoryFilter === cat
                  ? { background: "#FF1F7D", color: "white" }
                  : { background: "transparent", color: "#888" }}>
                {cat}
              </button>
            ))}

            <div className="my-5 mx-2 h-px" style={{ background: "rgba(0,0,0,0.06)" }} />

            {/* Live now indicator */}
            <p className="text-[9px] font-bold tracking-widest uppercase mb-3 px-2" style={{ color: "#bbb" }}>LIVE NOW</p>
            {CLUBS.filter(c => c.live).map(club => (
              <div key={club.id} className="flex items-center gap-2 px-2 py-1.5 mb-1">
                <span className="w-1.5 h-1.5 rounded-full animate-pulse flex-shrink-0" style={{ background: "#FF1F7D" }} />
                <p className="text-xs truncate" style={{ color: "#111111" }}>{club.name}</p>
              </div>
            ))}
          </div>

          {/* CENTER PANEL: Discover or Passport */}
          <div className="flex-1 overflow-y-auto">
            {activeTab === 0 ? (
              <div className="p-6">
                {/* Featured hero */}
                {(!q && categoryFilter === "All") && <FeaturedDoor club={featured} tall />}

                {/* All clubs grid */}
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-[10px] font-bold tracking-widest uppercase" style={{ color: "#bbb" }}>
                      {q || categoryFilter !== "All" ? `${filtered.length} CLUBS` : "ALL CLUBS"}
                    </p>
                    {filtered.length > 0 && (
                      <p className="text-[10px]" style={{ color: "#ddd" }}>
                        {filtered.reduce((a, c) => a + c.women, 0).toLocaleString()} women
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    {rest.map(club => (
                      <DesktopClubPoster key={club.id} club={club}
                        isJoined={joined.has(club.id)} isRequested={requested.has(club.id)} />
                    ))}
                    {rest.length === 0 && (
                      <div className="col-span-3 py-16 text-center rounded-2xl" style={{ background: "white" }}>
                        <p className="text-sm italic" style={{ fontFamily: "var(--font-instrument)", color: "#bbb" }}>
                          No clubs match that search or filter.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              /* Passport view */
              <div className="p-6">
                <div className="max-w-2xl">
                  <PassportCover count={myClubs.length} />
                  {myClubs.length === 0 ? (
                    <div className="flex flex-col items-center text-center py-16">
                      <p className="text-xl font-bold italic mb-3" style={{ fontFamily: "var(--font-playfair)", color: "#111111" }}>
                        Your passport is empty.
                      </p>
                      <p className="mb-6" style={{ fontFamily: "var(--font-caveat)", fontSize: "18px", color: "#FF1F7D" }}>
                        Yande is ready to help you find your people.
                      </p>
                      <button onClick={() => setActiveTab(0)}
                        className="px-8 py-3 rounded-full font-bold text-sm text-white"
                        style={{ background: "#FF1F7D" }}>
                        Discover Clubs →
                      </button>
                    </div>
                  ) : (
                    <div className="mt-6 grid grid-cols-2 gap-4">
                      {myClubs.map(club => {
                        const isPending = requested.has(club.id) && !joined.has(club.id);
                        const m = MEMBERSHIP[club.id];
                        return <PassportStamp key={club.id} club={club} events={m?.events ?? 0} since={m?.since ?? "2024"} isPending={isPending} />;
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT PANEL: Yande + Club Board */}
          <div className="flex-shrink-0 overflow-y-auto py-6 px-4"
            style={{ width: "260px", borderLeft: "1px solid rgba(0,0,0,0.05)" }}>
            <YandeRec />

            <div className="my-5 h-px" style={{ background: "rgba(0,0,0,0.06)" }} />

            <p className="text-[9px] font-bold tracking-widest uppercase mb-3" style={{ color: "#bbb" }}>CLUB BOARD</p>
            <div className="flex flex-col gap-1">
              {ranked.map((club, i) => <BoardRow key={club.id} club={club} rank={i + 1} />)}
            </div>

            <div className="my-5 h-px" style={{ background: "rgba(0,0,0,0.06)" }} />

            {/* Quick stats */}
            <p className="text-[9px] font-bold tracking-widest uppercase mb-3" style={{ color: "#bbb" }}>THIS WEEK</p>
            <div className="rounded-2xl p-4" style={{ background: "white", boxShadow: "0 1px 8px rgba(0,0,0,0.04)" }}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xl font-bold" style={{ fontFamily: "var(--font-playfair)", color: "#111111" }}>14</p>
                  <p className="text-[10px]" style={{ color: "#ccc" }}>events planned</p>
                </div>
                <div>
                  <p className="text-xl font-bold" style={{ fontFamily: "var(--font-playfair)", color: "#FF1F7D" }}>3</p>
                  <p className="text-[10px]" style={{ color: "#ccc" }}>clubs live</p>
                </div>
                <div>
                  <p className="text-xl font-bold" style={{ fontFamily: "var(--font-playfair)", color: "#111111" }}>28</p>
                  <p className="text-[10px]" style={{ color: "#ccc" }}>new members</p>
                </div>
                <div>
                  <p className="text-xl font-bold" style={{ fontFamily: "var(--font-playfair)", color: "#111111" }}>6</p>
                  <p className="text-[10px]" style={{ color: "#ccc" }}>new clubs</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
