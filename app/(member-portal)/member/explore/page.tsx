"use client";

import { useState } from "react";
import Link from "next/link";

const LIVE_ROOMS = [
  { id: 1, name: "Morning Room",  women: 8,  live: true  },
  { id: 2, name: "Night Owl",     women: 14, live: true  },
  { id: 3, name: "Study With Me", women: 5,  live: true  },
];

const TRENDING_POSTS = [
  { id: 5, author: "Imani J.",  initial: "I", color: "#FF1F7D", text: "I just negotiated a $40K raise. The best thing I ever did was stop treating my salary as a fixed number.", likes: 87, category: "Career"    },
  { id: 9, author: "Jade O.",   initial: "J", color: "#FF1F7D", text: "Anyone else building a capsule wardrobe? I've been wearing only 12 pieces for a month and I feel so free.", likes: 41, category: "Style"     },
  { id: 3, author: "Priya R.",  initial: "P", color: "#FF69B4", text: "Just discovered the best matcha in Williamsburg — not telling you where until you come with me.",           likes: 23, category: "Style"     },
  { id: 8, author: "Temi A.",   initial: "T", color: "#FF69B4", text: "Hot take: The best wellness ritual isn't a $200 facial. It's 8 hours of sleep and a slow morning.",          likes: 34, category: "Wellness"  },
];

const OPEN_SEATS = [
  { id: 1, title: "Girls dinner · Carbone",    host: "Aaliyah M.", time: "Tonight 7:30PM", seats: 2, color: "#FF1F7D" },
  { id: 2, title: "Pilates + matcha morning",  host: "Sofia K.",   time: "Sunday 9AM",     seats: 3, color: "#FF69B4" },
  { id: 3, title: "MoMA + froyo after",        host: "Priya R.",   time: "Saturday 2PM",   seats: 4, color: "#FF1F7D" },
];

const FEATURED_CLUBS = [
  { id: 0, name: "African Girls Club",    women: 284, color: "#FF1F7D", hq: true  },
  { id: 1, name: "Soft Life Club NYC",    women: 312, color: "#FF69B4", hq: true  },
  { id: 3, name: "Girl Tech Collective",  women: 89,  color: "#FF1F7D", hq: false },
  { id: 5, name: "Girl Creatives",        women: 98,  color: "#FF69B4", hq: false },
];

const NEW_BLOOMIES = [
  { id: 1, initial: "R", name: "Remi O.",   neighborhood: "Williamsburg", color: "#FF1F7D" },
  { id: 2, initial: "K", name: "Kezia N.",  neighborhood: "Chelsea",      color: "#FF69B4" },
  { id: 3, initial: "F", name: "Fatima A.", neighborhood: "Harlem",       color: "#FF1F7D" },
  { id: 4, initial: "N", name: "Naomi B.",  neighborhood: "SoHo",         color: "#FF69B4" },
];

const GIRL_PICKS = [
  { id: 1, name: "Brooklyn Bridge Park", type: "Place",  neighborhood: "DUMBO",          stamps: 203 },
  { id: 2, name: "Sadelle's",            type: "Eat",    neighborhood: "SoHo",           stamps: 89  },
  { id: 3, name: "McNally Jackson Café", type: "Gem",    neighborhood: "Nolita",         stamps: 71  },
];

export default function ExplorePage() {
  const [waved,    setWaved]    = useState<Set<number>>(new Set());
  const [reserved, setReserved] = useState<Set<number>>(new Set());

  return (
    <div className="min-h-screen pb-36 md:pb-10" style={{ background: "var(--pale-pink-bg)" }}>

      {/* Header */}
      <div className="px-5 pt-12 pb-4 md:px-8 md:pt-8">
        <p className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: "var(--bb-pink)" }}>BLOOMBAY</p>
        <h1 className="text-4xl font-bold leading-tight" style={{ color: "var(--bb-black)" }}>Explore</h1>
        <p className="italic text-sm text-gray-400 mt-0.5" style={{ fontFamily: "var(--font-playfair)" }}>
          Everything happening right now in BloomBay.
        </p>
      </div>

      <div className="px-5 md:px-8 flex flex-col gap-9">

        {/* ── Live Girl Bar ── */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: "var(--bb-pink)" }} />
              <p className="text-xs font-bold tracking-widest uppercase" style={{ color: "var(--bb-pink)" }}>GIRL BAR · LIVE NOW</p>
            </div>
            <Link href="/member/room" className="text-xs font-semibold" style={{ color: "var(--bb-pink)" }}>Enter →</Link>
          </div>
          <div className="rounded-3xl p-4" style={{ background: "#111111" }}>
            <div className="flex items-center gap-2 flex-wrap mb-2">
              {LIVE_ROOMS.map((r) => (
                <Link
                  key={r.id}
                  href="/member/room"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full transition-all"
                  style={{ background: "rgba(255,31,125,0.15)" }}
                >
                  <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "var(--bb-pink)" }} />
                  <span className="text-white text-xs font-semibold">{r.name}</span>
                  <span className="text-xs font-bold" style={{ color: "var(--bb-pink)" }}>{r.women}</span>
                </Link>
              ))}
            </div>
            <p className="text-white/40 text-xs">
              {LIVE_ROOMS.reduce((s, r) => s + r.women, 0)} women listening right now
            </p>
          </div>
        </section>

        {/* ── Trending on The Wall ── */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold tracking-widest uppercase" style={{ color: "var(--bb-pink)" }}>🔥 TRENDING ON THE WALL</p>
            <Link href="/member/room" className="text-xs font-semibold" style={{ color: "var(--bb-pink)" }}>All posts →</Link>
          </div>
          <div className="flex flex-col gap-2">
            {TRENDING_POSTS.map((post) => (
              <Link
                key={post.id}
                href="/member/room"
                className="bg-white rounded-2xl p-4 flex items-start gap-3 block"
                style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.05)" }}
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                  style={{ background: post.color }}
                >
                  {post.initial}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-bold text-xs" style={{ color: "var(--bb-black)" }}>{post.author}</p>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase" style={{ background: "var(--light-pink)", color: "var(--bb-pink)" }}>
                      {post.category}
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed line-clamp-2" style={{ color: "#555" }}>{post.text}</p>
                </div>
                <span className="text-xs font-bold flex-shrink-0" style={{ color: "var(--bb-pink)" }}>♥ {post.likes}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* ── Open Seats ── */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold tracking-widest uppercase" style={{ color: "var(--bb-pink)" }}>OPEN SEATS NEAR YOU</p>
            <Link href="/member/happenings" className="text-xs font-semibold" style={{ color: "var(--bb-pink)" }}>See all →</Link>
          </div>
          <div className="flex flex-col gap-2">
            {OPEN_SEATS.map((seat) => (
              <div
                key={seat.id}
                className="bg-white rounded-2xl p-4 flex items-center gap-3"
                style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.05)" }}
              >
                <div
                  className="w-11 h-11 rounded-xl flex flex-col items-center justify-center flex-shrink-0"
                  style={{ background: seat.color }}
                >
                  <p className="text-white text-lg font-bold leading-none">{seat.seats}</p>
                  <p className="text-white/70 text-[9px]">seats</p>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm" style={{ color: "var(--bb-black)" }}>{seat.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{seat.host} · {seat.time}</p>
                </div>
                <button
                  onClick={() => setReserved((p) => new Set([...p, seat.id]))}
                  className="flex-shrink-0 px-3 py-2 rounded-full text-xs font-bold transition-all active:scale-90"
                  style={reserved.has(seat.id)
                    ? { background: "var(--light-pink)", color: "var(--bb-pink)" }
                    : { background: "var(--bb-pink)", color: "white" }}
                >
                  {reserved.has(seat.id) ? "Reserved ✓" : "Grab seat"}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* ── Girl Clubs ── */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold tracking-widest uppercase" style={{ color: "var(--bb-pink)" }}>GIRL CLUBS</p>
            <Link href="/member/clubs" className="text-xs font-semibold" style={{ color: "var(--bb-pink)" }}>All clubs →</Link>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {FEATURED_CLUBS.map((club) => (
              <Link
                key={club.id}
                href="/member/clubs"
                className="bg-white rounded-2xl overflow-hidden block"
                style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.05)" }}
              >
                <div className="h-12" style={{ background: `linear-gradient(135deg,${club.color},#111111)` }}>
                  {club.hq && (
                    <div className="flex justify-end p-1.5">
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: "rgba(0,0,0,0.5)", color: "white" }}>✦</span>
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <p className="font-bold text-xs leading-snug" style={{ color: "var(--bb-black)" }}>{club.name}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{club.women} women</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── New Bloomies to Meet ── */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold tracking-widest uppercase" style={{ color: "var(--bb-pink)" }}>NEW BLOOMIES TO MEET</p>
            <Link href="/member/match" className="text-xs font-semibold" style={{ color: "var(--bb-pink)" }}>See all →</Link>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
            {NEW_BLOOMIES.map((b) => (
              <div
                key={b.id}
                className="flex-shrink-0 w-36 bg-white rounded-2xl p-4 flex flex-col items-center text-center"
                style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.05)" }}
              >
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold text-white mb-2"
                  style={{ background: b.color }}
                >
                  {b.initial}
                </div>
                <p className="font-bold text-sm leading-tight" style={{ color: "var(--bb-black)" }}>{b.name}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">{b.neighborhood}</p>
                <button
                  onClick={() => setWaved((p) => new Set([...p, b.id]))}
                  className="mt-3 w-full py-2 rounded-full text-xs font-bold transition-all active:scale-90"
                  style={waved.has(b.id)
                    ? { background: "var(--light-pink)", color: "var(--bb-pink)" }
                    : { background: "var(--bb-pink)", color: "white" }}
                >
                  {waved.has(b.id) ? "Waved ✓" : "Wave"}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* ── Girl Picks Spotlight ── */}
        <section className="pb-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold tracking-widest uppercase" style={{ color: "var(--bb-pink)" }}>GIRL PICKS SPOTLIGHT</p>
            <Link href="/member/happenings" className="text-xs font-semibold" style={{ color: "var(--bb-pink)" }}>All picks →</Link>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {GIRL_PICKS.map((pick) => (
              <Link
                key={pick.id}
                href="/member/happenings"
                className="bg-white rounded-2xl overflow-hidden block"
                style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.05)" }}
              >
                <div className="h-14" style={{ background: "linear-gradient(135deg,var(--bb-pink),#111111)" }} />
                <div className="p-2.5">
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase" style={{ background: "var(--light-pink)", color: "var(--bb-pink)" }}>
                    {pick.type}
                  </span>
                  <p className="font-bold text-xs leading-snug mt-1" style={{ color: "var(--bb-black)" }}>{pick.name}</p>
                  <p className="text-[10px] text-gray-400">{pick.neighborhood}</p>
                  <p className="text-[10px] font-bold mt-1" style={{ color: "var(--bb-pink)" }}>♡ {pick.stamps}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
