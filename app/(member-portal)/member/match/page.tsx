"use client";

import { useState } from "react";

// ── Data ──────────────────────────────────────────────────────────────────────

const BLOOM_REQUESTS = [
  { id: 1, initial: "R", name: "Remi O.", neighborhood: "Williamsburg", color: "#FF1F7D",
    clubs: ["Book Club"],
    message: "We kept almost sitting next to each other at the last Book Club. Finally doing this." },
  { id: 2, initial: "K", name: "Kezia N.", neighborhood: "Chelsea", color: "#FF1F7D",
    clubs: ["Girl Tech Collective", "Museum Girls"], message: undefined as string | undefined },
  { id: 3, initial: "F", name: "Fatima A.", neighborhood: "Harlem", color: "#FF69B4",
    clubs: ["African Girls Club"],
    message: "Saw your Girl Picks — you have the best taste in hidden gems." },
];

const SENT_REQUESTS = [
  { id: 4, initial: "C", name: "Ciara M.", neighborhood: "Brooklyn Heights", color: "#FF69B4", sentDays: 2 },
  { id: 5, initial: "Z", name: "Zara F.", neighborhood: "DUMBO", color: "#FF69B4", sentDays: 5 },
];

const IN_YOUR_ORBIT = [
  { id: 1, initial: "A", name: "Aminah C.", neighborhood: "Bed-Stuy", color: "#FF1F7D",
    clubs: ["African Girls Club", "Book Club"], vibe: "Cultural events · Sunday markets",
    yandeNote: "You've attended 3 of the same events. She doesn't know you exist yet." },
  { id: 2, initial: "S", name: "Sofia K.", neighborhood: "Greenpoint", color: "#FF69B4",
    clubs: ["Pilates Club", "Museum Girls"], vibe: "Wellness · Art · Long walks",
    yandeNote: "Early birds who love art and the same hidden café in DUMBO." },
  { id: 3, initial: "J", name: "Jade O.", neighborhood: "Crown Heights", color: "#FF69B4",
    clubs: ["Dinner Society"], vibe: "Restaurants · Rooftops",
    yandeNote: "She hosted two dinners you saved to your wishlist. Coincidence?" },
  { id: 4, initial: "N", name: "Naomi B.", neighborhood: "SoHo", color: "#C084FC",
    clubs: ["Girl Tech Collective", "Jazz & Wine"], vibe: "Tech · Live music",
    yandeNote: "Both founders. Both obsessed with jazz. Different industries." },
  { id: 5, initial: "T", name: "Tara L.", neighborhood: "West Village", color: "#FB923C",
    clubs: ["Dinner Society"], vibe: "Food · Art · Walks",
    yandeNote: "Her book recommendations have been in your saved list for months." },
];

const COME_WITH_ME = [
  { id: 1, initial: "L", name: "Leila M.", neighborhood: "Williamsburg", color: "#FF1F7D",
    emoji: "🏛", activity: "Museum",
    post: "Going to the Met this Saturday morning. I love going with someone — we share the experience, then split off whenever. No pressure.",
    when: "Saturday · 10AM", timeAgo: "2h" },
  { id: 2, initial: "P", name: "Priya S.", neighborhood: "Brooklyn Heights", color: "#FF69B4",
    emoji: "☕", activity: "Coffee",
    post: "Looking for someone to explore Nolita with me. Just moved here and want to find all the good spots with a local.",
    when: "Sunday afternoon", timeAgo: "5h" },
  { id: 3, initial: "Y", name: "Yemi O.", neighborhood: "SoHo", color: "#C084FC",
    emoji: "🏃‍♀️", activity: "Run",
    post: "Starting a Sunday morning run in Prospect Park. Slow pace, good energy, pastries after. One spot open.",
    when: "Every Sunday · 8AM", timeAgo: "8h" },
  { id: 4, initial: "D", name: "Deja W.", neighborhood: "Prospect Heights", color: "#FB923C",
    emoji: "🎨", activity: "Event",
    post: "Have an extra ticket to the Whitney members' evening next Friday. Looking for someone who'd actually want to be there.",
    when: "Next Friday · 6PM", timeAgo: "1d" },
];

const INTEREST_CLUSTERS = [
  { id: 1, label: "Fashion Girls", emoji: "👗", color: "#FF1F7D", bg: "#FFF0F5", count: 24,
    desc: "Style-obsessed. Thrifters to designers.",
    avatars: [{ initial: "T", color: "#FF1F7D" }, { initial: "B", color: "#FF69B4" }, { initial: "M", color: "#FF1F7D" }],
    profiles: [
      { id: 101, initial: "T", name: "Tara L.", neighborhood: "West Village", color: "#FF1F7D", vibe: "Vintage · High street · Always dressed." },
      { id: 102, initial: "B", name: "Bea T.", neighborhood: "Crown Heights", color: "#FF69B4", vibe: "Thrift queen. Community style." },
      { id: 103, initial: "M", name: "Maya K.", neighborhood: "SoHo", color: "#FF1F7D", vibe: "Runway adjacent. Always first." },
    ]},
  { id: 2, label: "Museum Girls", emoji: "🏛", color: "#8B5CF6", bg: "#F5F0FF", count: 31,
    desc: "Art, culture, and quiet mornings.",
    avatars: [{ initial: "S", color: "#8B5CF6" }, { initial: "K", color: "#C084FC" }, { initial: "N", color: "#8B5CF6" }],
    profiles: [
      { id: 201, initial: "S", name: "Sofia K.", neighborhood: "Greenpoint", color: "#8B5CF6", vibe: "Membership card always in her wallet." },
      { id: 202, initial: "K", name: "Kezia N.", neighborhood: "Chelsea", color: "#C084FC", vibe: "Art history degree. Never brags about it." },
      { id: 203, initial: "N", name: "Naomi B.", neighborhood: "SoHo", color: "#8B5CF6", vibe: "Galleries, jazz, and long walks after." },
    ]},
  { id: 3, label: "Founders", emoji: "✦", color: "#D97706", bg: "#FFFBEB", count: 18,
    desc: "Building things. In public.",
    avatars: [{ initial: "N", color: "#D97706" }, { initial: "Y", color: "#FBBF24" }, { initial: "A", color: "#D97706" }],
    profiles: [
      { id: 301, initial: "N", name: "Naomi B.", neighborhood: "SoHo", color: "#D97706", vibe: "B2B SaaS. Also really into ceramics." },
      { id: 302, initial: "Y", name: "Yemi O.", neighborhood: "SoHo", color: "#FBBF24", vibe: "Creative studio, 2 years in." },
      { id: 303, initial: "A", name: "Aaliyah M.", neighborhood: "Crown Heights", color: "#D97706", vibe: "Building community-first." },
    ]},
  { id: 4, label: "Readers", emoji: "📚", color: "#059669", bg: "#ECFDF5", count: 42,
    desc: "Book clubs, quiet cafés, long lists.",
    avatars: [{ initial: "D", color: "#059669" }, { initial: "R", color: "#34D399" }, { initial: "L", color: "#059669" }],
    profiles: [
      { id: 401, initial: "D", name: "Deja W.", neighborhood: "Prospect Heights", color: "#059669", vibe: "Literary fiction. Annotates everything." },
      { id: 402, initial: "R", name: "Remi O.", neighborhood: "Williamsburg", color: "#34D399", vibe: "Sci-fi and Toni Morrison in equal parts." },
      { id: 403, initial: "L", name: "Leila M.", neighborhood: "Williamsburg", color: "#059669", vibe: "Runs the book club. Always finishes first." },
    ]},
  { id: 5, label: "Travel Girls", emoji: "✈️", color: "#2563EB", bg: "#EFF6FF", count: 29,
    desc: "Always somewhere. Always planning.",
    avatars: [{ initial: "Z", color: "#2563EB" }, { initial: "P", color: "#60A5FA" }, { initial: "F", color: "#2563EB" }],
    profiles: [
      { id: 501, initial: "Z", name: "Zara F.", neighborhood: "DUMBO", color: "#2563EB", vibe: "Morocco planned. Bali next." },
      { id: 502, initial: "P", name: "Priya S.", neighborhood: "Brooklyn Heights", color: "#60A5FA", vibe: "Slow travel. One city, one month." },
      { id: 503, initial: "F", name: "Fatima A.", neighborhood: "Harlem", color: "#2563EB", vibe: "West Africa every summer. Always." },
    ]},
  { id: 6, label: "Wellness Girls", emoji: "🧘", color: "#EC4899", bg: "#FDF2F8", count: 37,
    desc: "Pilates, rituals, slow mornings.",
    avatars: [{ initial: "S", color: "#EC4899" }, { initial: "P", color: "#F472B6" }, { initial: "A", color: "#EC4899" }],
    profiles: [
      { id: 601, initial: "S", name: "Sofia K.", neighborhood: "Greenpoint", color: "#EC4899", vibe: "6AM pilates, 7AM matcha." },
      { id: 602, initial: "P", name: "Priya S.", neighborhood: "Brooklyn Heights", color: "#F472B6", vibe: "Slow mornings are sacred." },
      { id: 603, initial: "A", name: "Aminah C.", neighborhood: "Bed-Stuy", color: "#EC4899", vibe: "Sound baths and Sunday markets." },
    ]},
];

// ── Sub-components ────────────────────────────────────────────────────────────

function ProfileAvatar({ initial, color, size = 44 }: { initial: string; color: string; size?: number }) {
  return (
    <div className="rounded-full flex items-center justify-center font-bold text-white flex-shrink-0"
      style={{ width: size, height: size, background: `linear-gradient(135deg, ${color} 0%, ${color}CC 100%)`,
        fontSize: size / 2.6, boxShadow: `0 3px 10px ${color}44` }}>
      {initial}
    </div>
  );
}

function SectionHeader({ eyebrow, title, note }: { eyebrow: string; title: string; note?: string }) {
  return (
    <div className="mb-4">
      <p className="text-[9px] font-bold tracking-[0.22em] uppercase" style={{ color: "#FF1F7D" }}>✦ {eyebrow}</p>
      <p className="font-black italic text-lg leading-tight mt-0.5" style={{ fontFamily: "var(--font-playfair)", color: "#111" }}>{title}</p>
      {note && <p className="text-xs italic mt-0.5" style={{ fontFamily: "var(--font-instrument)", color: "#aaa" }}>{note}</p>}
    </div>
  );
}

// ── Bloom Request Card ────────────────────────────────────────────────────────

function BloomRequestCard({ req, accepted, onAccept, onDecline }: {
  req: typeof BLOOM_REQUESTS[0]; accepted: boolean;
  onAccept: () => void; onDecline: () => void;
}) {
  return (
    <div className="bg-white rounded-2xl p-5" style={{ boxShadow: "0 2px 14px rgba(255,31,125,0.08)", borderLeft: "3px solid #FF1F7D" }}>
      <div className="flex items-start gap-3 mb-3">
        <ProfileAvatar initial={req.initial} color={req.color} size={44} />
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm" style={{ color: "#111" }}>
            <span style={{ color: "#FF1F7D" }}>{req.name.split(" ")[0]}</span>{" "}would like to meet you.
          </p>
          <p className="text-xs mt-0.5" style={{ color: "#aaa" }}>{req.neighborhood}</p>
          <div className="flex flex-wrap gap-1 mt-2">
            {req.clubs.map(c => (
              <span key={c} className="text-[9px] font-semibold px-2 py-0.5 rounded-full" style={{ background: "#FFF0F5", color: "#FF1F7D" }}>{c}</span>
            ))}
          </div>
        </div>
      </div>
      {req.message && (
        <div className="rounded-xl px-4 py-3 mb-3" style={{ background: "#FFF5F8" }}>
          <p className="text-xs italic leading-relaxed" style={{ fontFamily: "var(--font-playfair)", color: "#555" }}>
            &ldquo;{req.message}&rdquo;
          </p>
        </div>
      )}
      {accepted ? (
        <p className="text-sm font-bold" style={{ color: "#FF1F7D" }}>You&apos;re Bloomies now ✦</p>
      ) : (
        <div className="flex gap-2">
          <button onClick={onDecline}
            className="flex-1 py-3 rounded-full text-sm font-semibold border transition-all active:scale-[0.97]"
            style={{ borderColor: "#E8E8E8", color: "#888" }}>
            Not now
          </button>
          <button onClick={onAccept}
            className="flex-1 py-3 rounded-full text-sm font-bold text-white transition-all active:scale-[0.97]"
            style={{ background: "#FF1F7D", boxShadow: "0 4px 14px rgba(255,31,125,0.3)" }}>
            Accept
          </button>
        </div>
      )}
    </div>
  );
}

// ── Orbit Card (horizontal scroll) ───────────────────────────────────────────

function OrbitCard({ girl, connected, shaking, onConnect }: {
  girl: typeof IN_YOUR_ORBIT[0]; connected: boolean; shaking: boolean; onConnect: () => void;
}) {
  return (
    <div className="rounded-3xl overflow-hidden flex-shrink-0" style={{ width: 210, background: "white", boxShadow: "0 4px 20px rgba(255,31,125,0.10)" }}>
      <div className="h-[68px] relative" style={{ background: `linear-gradient(135deg, ${girl.color} 0%, ${girl.color}88 100%)` }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 80% 20%, rgba(255,255,255,0.12) 0%, transparent 60%)" }} />
        <p className="absolute top-2.5 right-3 text-[7px] font-bold tracking-wider uppercase" style={{ color: "rgba(255,255,255,0.65)" }}>IN YOUR ORBIT</p>
        <div className="absolute bottom-0 left-4" style={{ transform: "translateY(50%)" }}>
          <ProfileAvatar initial={girl.initial} color={girl.color} size={44} />
        </div>
      </div>
      <div className="px-4 pt-8 pb-4">
        <p className="font-black text-sm italic leading-tight" style={{ fontFamily: "var(--font-playfair)", color: "#111" }}>{girl.name}</p>
        <p className="text-[10px] mt-0.5 mb-1.5" style={{ color: "#aaa" }}>{girl.neighborhood}</p>
        <div className="flex flex-wrap gap-1 mb-2.5">
          {girl.clubs.slice(0, 2).map(c => (
            <span key={c} className="text-[8px] font-semibold px-1.5 py-0.5 rounded-full" style={{ background: `${girl.color}14`, color: girl.color }}>{c}</span>
          ))}
        </div>
        <p className="text-[10px] mb-3 leading-snug italic" style={{ fontFamily: "var(--font-playfair)", color: "#777", borderLeft: `2px solid ${girl.color}33`, paddingLeft: "8px" }}>
          ✦ {girl.yandeNote}
        </p>
        <button
          onClick={() => !connected && onConnect()}
          className="w-full py-2.5 rounded-full text-[11px] font-bold"
          style={
            connected
              ? { background: "#eee", color: "#aaa", transition: "all 0.2s ease" }
              : shaking
                ? { background: girl.color, color: "white", boxShadow: `0 4px 12px ${girl.color}44`, animation: "shakePop 0.65s cubic-bezier(0.36,0.07,0.19,0.97) both" }
                : { background: girl.color, color: "white", boxShadow: `0 4px 12px ${girl.color}44`, transition: "transform 0.18s cubic-bezier(0.34,1.56,0.64,1)" }
          }
        >
          {connected ? "Sent ✓" : "Introduce me"}
        </button>
      </div>
    </div>
  );
}

// ── Come With Me Card ─────────────────────────────────────────────────────────

function ComeWithMeCard({ post, joined, onJoin }: {
  post: typeof COME_WITH_ME[0]; joined: boolean; onJoin: () => void;
}) {
  return (
    <div className="bg-white rounded-2xl p-4" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)", borderLeft: `3px solid ${post.color}` }}>
      <div className="flex items-start gap-3 mb-3">
        <ProfileAvatar initial={post.initial} color={post.color} size={40} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-bold text-sm" style={{ color: "#111" }}>{post.name}</p>
            <span className="text-[8px] font-bold px-2 py-0.5 rounded-full" style={{ background: `${post.color}15`, color: post.color }}>
              {post.emoji} {post.activity}
            </span>
          </div>
          <p className="text-[10px] mt-0.5" style={{ color: "#bbb" }}>{post.neighborhood} · {post.timeAgo}</p>
        </div>
      </div>
      <p className="text-sm italic leading-relaxed mb-3" style={{ fontFamily: "var(--font-playfair)", color: "#444" }}>
        &ldquo;{post.post}&rdquo;
      </p>
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold px-3 py-1.5 rounded-full" style={{ background: "rgba(0,0,0,0.04)", color: "#888" }}>
          {post.when}
        </span>
        <button onClick={onJoin}
          className="px-4 py-2 rounded-full text-xs font-bold transition-all active:scale-95"
          style={joined ? { background: "#FFF0F5", color: "#FF1F7D" } : { background: "#111", color: "white" }}>
          {joined ? "You&apos;re in ✓" : "Join her →"}
        </button>
      </div>
    </div>
  );
}

// ── Interest Cluster Tile ─────────────────────────────────────────────────────

function InterestClusterTile({ cluster, onOpen }: {
  cluster: typeof INTEREST_CLUSTERS[0]; onOpen: () => void;
}) {
  return (
    <button onClick={onOpen}
      className="rounded-3xl p-4 text-left transition-transform active:scale-[0.97]"
      style={{ background: cluster.bg, boxShadow: `0 2px 14px ${cluster.color}15` }}>
      <div className="flex items-center gap-2 mb-2">
        <span style={{ fontSize: "20px" }}>{cluster.emoji}</span>
        <span className="text-[8px] font-bold tracking-wider uppercase" style={{ color: cluster.color }}>{cluster.count} women</span>
      </div>
      <p className="font-black italic text-base leading-tight" style={{ fontFamily: "var(--font-playfair)", color: "#111" }}>{cluster.label}</p>
      <p className="text-[10px] mt-0.5 mb-3" style={{ color: "#aaa" }}>{cluster.desc}</p>
      <div className="flex">
        {cluster.avatars.map((a, i) => (
          <div key={i} className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white border-2 border-white"
            style={{ background: a.color, marginLeft: i > 0 ? "-7px" : "0", zIndex: cluster.avatars.length - i }}>
            {a.initial}
          </div>
        ))}
        <div className="w-7 h-7 rounded-full flex items-center justify-center text-[8px] font-bold border-2 border-white" style={{ background: "#f5f5f5", color: "#aaa", marginLeft: "-7px" }}>
          +{cluster.count - 3}
        </div>
      </div>
    </button>
  );
}

// ── Cluster Bottom Sheet ──────────────────────────────────────────────────────

function ClusterSheet({ cluster, onClose, connected, shaking, onConnect }: {
  cluster: typeof INTEREST_CLUSTERS[0]; onClose: () => void;
  connected: Set<number>; shaking: Set<number>;
  onConnect: (id: number, name: string) => void;
}) {
  return (
    <>
      <div className="fixed inset-0 z-40" style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }} onClick={onClose} />
      <div className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl overflow-hidden" style={{ background: "#FDFAF5", boxShadow: "0 -8px 40px rgba(0,0,0,0.18)", maxHeight: "80vh", overflowY: "auto" }}>
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-9 h-1 rounded-full" style={{ background: "rgba(0,0,0,0.12)" }} />
        </div>
        <div className="px-6 pb-3 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span style={{ fontSize: "22px" }}>{cluster.emoji}</span>
              <p className="text-[9px] font-bold tracking-[0.2em] uppercase" style={{ color: cluster.color }}>{cluster.count} women</p>
            </div>
            <p className="font-black italic text-xl" style={{ fontFamily: "var(--font-playfair)", color: "#111" }}>{cluster.label}</p>
            <p className="text-xs mt-0.5" style={{ color: "#aaa" }}>{cluster.desc}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "rgba(0,0,0,0.07)" }}>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="#666" strokeWidth="1.8" strokeLinecap="round"><path d="M1 1l8 8M9 1l-8 8"/></svg>
          </button>
        </div>
        <div className="px-6 pb-8 flex flex-col gap-3 mt-2">
          {cluster.profiles.map(p => (
            <div key={p.id} className="bg-white rounded-2xl p-4 flex items-center gap-3" style={{ boxShadow: "0 2px 10px rgba(0,0,0,0.05)", borderLeft: `3px solid ${p.color}` }}>
              <ProfileAvatar initial={p.initial} color={p.color} size={44} />
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm" style={{ color: "#111" }}>{p.name}</p>
                <p className="text-xs mt-0.5" style={{ color: "#aaa" }}>{p.neighborhood}</p>
                <p className="text-[10px] mt-1 italic" style={{ color: "#bbb", fontFamily: "var(--font-instrument)" }}>{p.vibe}</p>
              </div>
              <button
                onClick={() => !connected.has(p.id) && onConnect(p.id, p.name)}
                className="flex-shrink-0 px-3 py-2 rounded-full text-[11px] font-bold transition-all"
                style={
                  connected.has(p.id)
                    ? { background: "#eee", color: "#aaa" }
                    : shaking.has(p.id)
                      ? { background: p.color, color: "white", animation: "shakePop 0.65s cubic-bezier(0.36,0.07,0.19,0.97) both" }
                      : { background: p.color, color: "white", boxShadow: `0 3px 10px ${p.color}33` }
                }>
                {connected.has(p.id) ? "Sent ✓" : "Introduce me"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function IntroductionsPage() {
  const [requests, setRequests] = useState(
    BLOOM_REQUESTS.map(r => ({ ...r, accepted: false }))
  );
  const [joined, setJoined] = useState<Set<number>>(new Set());
  const [orbitConnected, setOrbitConnected] = useState<Set<number>>(new Set());
  const [orbitShaking, setOrbitShaking] = useState<Set<number>>(new Set());
  const [clusterConnected, setClusterConnected] = useState<Set<number>>(new Set());
  const [clusterShaking, setClusterShaking] = useState<Set<number>>(new Set());
  const [activeCluster, setActiveCluster] = useState<typeof INTEREST_CLUSTERS[0] | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [notifyGirlmates, setNotifyGirlmates] = useState(false);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2800);
  }

  function introduceOrbit(id: number, name: string) {
    setOrbitConnected(p => new Set([...p, id]));
    setOrbitShaking(p => new Set([...p, id]));
    showToast(`Bloombay request sent to ${name.split(" ")[0]} ✓`);
    setTimeout(() => setOrbitShaking(p => { const n = new Set(p); n.delete(id); return n; }), 650);
  }

  function introduceCluster(id: number, name: string) {
    setClusterConnected(p => new Set([...p, id]));
    setClusterShaking(p => new Set([...p, id]));
    showToast(`Bloombay request sent to ${name.split(" ")[0]} ✓`);
    setTimeout(() => setClusterShaking(p => { const n = new Set(p); n.delete(id); return n; }), 650);
  }

  const pendingRequests = requests.filter(r => !r.accepted);
  const acceptedRequests = requests.filter(r => r.accepted);
  const incomingCount = pendingRequests.length;

  return (
    <div className="min-h-screen pb-28" style={{ background: "#FDFAF5" }}>
      <style>{`
        @keyframes slideUpToast { from { opacity:0; transform:translateX(-50%) translateY(14px) } to { opacity:1; transform:translateX(-50%) translateY(0) } }
        @keyframes fadeSlideIn  { from { opacity:0; transform:translateY(8px) } to { opacity:1; transform:translateY(0) } }
        @keyframes shakePop {
          0%   { transform: scale(1)    translateX(0); }
          12%  { transform: scale(1.08) translateX(-5px); }
          24%  { transform: scale(1.08) translateX(5px); }
          36%  { transform: scale(1.05) translateX(-4px); }
          48%  { transform: scale(1.05) translateX(4px); }
          60%  { transform: scale(1.03) translateX(-2px); }
          72%  { transform: scale(1.03) translateX(2px); }
          86%  { transform: scale(1.01) translateX(-1px); }
          100% { transform: scale(1)    translateX(0); }
        }
      `}</style>

      {/* ── Page Header ── */}
      <div className="px-5 pt-14 pb-6" style={{ animation: "fadeSlideIn 0.25s ease-out" }}>
        <p className="text-[9px] font-bold tracking-[0.25em] uppercase mb-2" style={{ color: "#FF1F7D" }}>✦ INTRODUCTIONS</p>
        <h1 className="font-black italic leading-tight mb-2" style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(28px,6vw,40px)", color: "#111" }}>
          Women who may belong<br/>in your story.
        </h1>
        <p className="text-xs italic" style={{ fontFamily: "var(--font-instrument)", color: "#bbb" }}>
          Not dating. Not swiping. Relationship-building.
        </p>
      </div>

      <div className="flex flex-col gap-10 pb-4">

        {/* ── 1. BLOOM REQUESTS ── */}
        <section className="px-5">
          <div className="flex items-start justify-between mb-4">
            <SectionHeader
              eyebrow={`BLOOM REQUESTS${incomingCount > 0 ? ` · ${incomingCount}` : ""}`}
              title="Women intentionally reaching out."
            />
          </div>

          {pendingRequests.length === 0 && acceptedRequests.length === 0 ? (
            <div className="rounded-2xl p-5 text-center" style={{ background: "#FFF5F8" }}>
              <p className="text-sm italic" style={{ color: "#FF1F7D", fontFamily: "var(--font-caveat)", fontSize: "17px" }}>
                The invitations are coming. Your energy precedes you.
              </p>
              <p className="text-xs mt-1" style={{ color: "#bbb" }}>— Yande</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {pendingRequests.map(req => (
                <BloomRequestCard key={req.id} req={req}
                  accepted={req.accepted}
                  onAccept={() => setRequests(rs => rs.map(r => r.id === req.id ? { ...r, accepted: true } : r))}
                  onDecline={() => setRequests(rs => rs.filter(r => r.id !== req.id))}
                />
              ))}
              {acceptedRequests.map(req => (
                <BloomRequestCard key={req.id} req={req} accepted onAccept={() => {}} onDecline={() => {}} />
              ))}
            </div>
          )}

          {SENT_REQUESTS.length > 0 && (
            <div className="mt-4">
              <p className="text-[9px] font-bold tracking-[0.2em] uppercase mb-2" style={{ color: "#ccc" }}>WAITING FOR REPLY</p>
              <div className="flex flex-col gap-2">
                {SENT_REQUESTS.map(r => (
                  <div key={r.id} className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3" style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.04)" }}>
                    <ProfileAvatar initial={r.initial} color={r.color} size={36} />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm" style={{ color: "#111" }}>{r.name}</p>
                      <p className="text-[10px]" style={{ color: "#bbb" }}>{r.neighborhood}</p>
                    </div>
                    <span className="text-[9px] font-bold px-2.5 py-1 rounded-full" style={{ background: "#F5F5F5", color: "#ccc" }}>
                      {r.sentDays}d ago
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* ── 2. IN YOUR ORBIT ── */}
        <section>
          <div className="px-5">
            <SectionHeader
              eyebrow="IN YOUR ORBIT"
              title="Discovery. Serendipity."
              note="Not active searching."
            />
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 px-5" style={{ scrollbarWidth: "none" }}>
            {IN_YOUR_ORBIT.map(girl => (
              <OrbitCard key={girl.id} girl={girl}
                connected={orbitConnected.has(girl.id)}
                shaking={orbitShaking.has(girl.id)}
                onConnect={() => introduceOrbit(girl.id, girl.name)}
              />
            ))}
          </div>
        </section>

        {/* ── 3. COME WITH ME ── */}
        <section className="px-5">
          <SectionHeader
            eyebrow="COME WITH ME"
            title="Activity companions."
            note="Women looking for someone to go with."
          />
          <div className="flex flex-col gap-3">
            {COME_WITH_ME.map(post => (
              <ComeWithMeCard key={post.id} post={post}
                joined={joined.has(post.id)}
                onJoin={() => {
                  setJoined(p => new Set([...p, post.id]));
                  showToast("You&apos;re in ✓");
                }}
              />
            ))}
          </div>
        </section>

        {/* ── 4. YOUR KIND OF GIRLS ── */}
        <section className="px-5">
          <SectionHeader
            eyebrow="YOUR KIND OF GIRLS"
            title="Interest-based discovery."
            note="Women intentionally looking for more women like themselves."
          />
          <div className="grid grid-cols-2 gap-3">
            {INTEREST_CLUSTERS.map(cluster => (
              <InterestClusterTile key={cluster.id} cluster={cluster} onOpen={() => setActiveCluster(cluster)} />
            ))}
          </div>
        </section>

        {/* ── 5. GIRLMATES ── */}
        <section className="px-5">
          <SectionHeader eyebrow="GIRLMATES" title="Roommate matching." />
          <div className="rounded-3xl overflow-hidden" style={{ background: "#111", boxShadow: "0 8px 32px rgba(0,0,0,0.2)" }}>
            <div className="p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-36 h-36 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, #FF1F7D, transparent 70%)", opacity: 0.13, transform: "translate(30%,-30%)" }} />
              <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, #FF69B4, transparent 70%)", opacity: 0.1, transform: "translate(-30%,30%)" }} />
              <div className="relative">
                <span className="inline-block text-[9px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full mb-4" style={{ background: "rgba(255,105,180,0.15)", color: "#FF69B4" }}>
                  COMING SOON
                </span>
                <h3 className="font-black italic text-2xl leading-tight mb-2" style={{ fontFamily: "var(--font-playfair)", color: "white" }}>
                  GirlMates.
                </h3>
                <p className="text-sm leading-relaxed mb-1" style={{ color: "rgba(255,255,255,0.45)" }}>
                  Housing compatibility. Lifestyle compatibility.
                </p>
                <p className="text-xs italic mb-5" style={{ fontFamily: "var(--font-instrument)", color: "rgba(255,255,255,0.25)" }}>
                  For when you want to share more than a city.
                </p>
                <button
                  onClick={() => { setNotifyGirlmates(true); showToast("We&apos;ll let you know when GirlMates launches ✦"); }}
                  className="px-5 py-2.5 rounded-full text-xs font-bold transition-all active:scale-95"
                  style={notifyGirlmates
                    ? { background: "rgba(255,105,180,0.15)", color: "#FF69B4" }
                    : { background: "rgba(255,105,180,0.15)", color: "#FF69B4", border: "1px solid rgba(255,105,180,0.25)" }}>
                  {notifyGirlmates ? "You&apos;re on the list ✦" : "Notify me when it&apos;s ready →"}
                </button>
              </div>
            </div>
          </div>
        </section>

      </div>

      {/* Cluster sheet */}
      {activeCluster && (
        <ClusterSheet
          cluster={activeCluster}
          onClose={() => setActiveCluster(null)}
          connected={clusterConnected}
          shaking={clusterShaking}
          onConnect={introduceCluster}
        />
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-24 left-1/2 z-50 px-5 py-3.5 rounded-full text-sm font-semibold text-white"
          style={{ background: "#111", transform: "translateX(-50%)", boxShadow: "0 8px 24px rgba(0,0,0,0.28)", animation: "slideUpToast 0.28s cubic-bezier(0.34,1.56,0.64,1)", whiteSpace: "nowrap" }}>
          {toast}
        </div>
      )}
    </div>
  );
}
