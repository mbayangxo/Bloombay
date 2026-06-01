"use client";

import { useState } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────

type RoomKey = "lobby" | "wall" | "closet" | "vanity" | "exchange" | "keys" | "office" | "girlbar";

interface RoomDef {
  key: Exclude<RoomKey, "lobby">;
  name: string;
  tagline: string;
  darkBg?: boolean;
  live?: boolean;
}

// ── Mock data ─────────────────────────────────────────────────────────────────

const ROOMS: RoomDef[] = [
  { key: "wall",     name: "The Wall",     tagline: "General community. What's on your mind." },
  { key: "closet",   name: "The Closet",   tagline: "Fashion. Style. Outfits. What to wear." },
  { key: "vanity",   name: "The Vanity",   tagline: "Beauty. Hair. Skin. Nails. Products." },
  { key: "exchange", name: "The Exchange", tagline: "Buy. Sell. Trade. Borrow. Give away." },
  { key: "keys",     name: "New Keys",     tagline: "Apartments. Moving. Subleases. Neighborhoods." },
  { key: "office",   name: "The Office",   tagline: "Careers. Business. Mentorship. Coworking." },
  { key: "girlbar",  name: "Girl Bar",     tagline: "Late night conversations. The most social room.", live: true },
];

const WALL_POSTS = [
  { id: 1, author: "Aaliyah M.", initial: "A", time: "2h ago", text: "Anyone going to the Carbone dinner tonight? Let's meet beforehand for drinks at Don Ciccio.", likes: 12, replies: 4, pinned: true },
  { id: 2, author: "Sofia K.",   initial: "S", time: "4h ago", text: "PSA: The pilates class on Sunday has 3 spots left. Worth every penny. DM me if you want the link.", likes: 8, replies: 2, pinned: false },
  { id: 3, author: "Priya R.",   initial: "P", time: "6h ago", text: "Just discovered the best matcha in Williamsburg — not telling you where until you come with me.", likes: 23, replies: 9, pinned: false },
  { id: 4, author: "Kezia N.",   initial: "K", time: "Yesterday", text: "Reminder that the Soft Life Club brunch is this Saturday 11AM. Hoboken girls, this one's for you.", likes: 17, replies: 6, pinned: false },
];

const CLOSET_POSTS = [
  { id: 1, author: "Deja W.",  initial: "D", time: "1h ago",    text: "What do we think of ballet flats in 2025? I have been debating all week.", likes: 31, replies: 14 },
  { id: 2, author: "Imani J.", initial: "I", time: "3h ago",    text: "Found a tailor in Williamsburg who does alterations for $15. Sending the address to whoever asks.", likes: 44, replies: 22 },
  { id: 3, author: "Lena O.",  initial: "L", time: "5h ago",    text: "Selling two barely worn Nanushka dresses, size XS. $120 each. DM me.", likes: 8, replies: 5 },
  { id: 4, author: "Tia R.",   initial: "T", time: "Yesterday", text: "The Zara blazer everyone is wearing — yes or no? I feel like we all showed up in the same jacket last week.", likes: 19, replies: 11 },
];

const VANITY_POSTS = [
  { id: 1, author: "Sofia K.", initial: "S", time: "30m ago", text: "Shoutout to the woman who recommended the nail salon on Smith Street — I have been going every two weeks.", likes: 28, replies: 7 },
  { id: 2, author: "Naomi B.", initial: "N", time: "2h ago",  text: "Asking for my scalp: anyone else struggling with winter dryness? What oil are you using?", likes: 15, replies: 18 },
  { id: 3, author: "Priya R.", initial: "P", time: "4h ago",  text: "Just got a keratin treatment at a spot in Greenpoint. Completely changed my life. DM for the name.", likes: 37, replies: 9 },
];

const EXCHANGE_POSTS = [
  { id: 1, author: "Camille T.", initial: "C", time: "1h ago",   text: "Giving away a barely used Vitamix. Free to whoever picks it up in Crown Heights this weekend.", likes: 14, replies: 9 },
  { id: 2, author: "Zara F.",   initial: "Z", time: "4h ago",   text: "Anyone want to trade Pilates classes? I have 5 credits at Figure 8, looking for SoulCycle.", likes: 6, replies: 3 },
  { id: 3, author: "Aaliyah M.", initial: "A", time: "Yesterday", text: "Selling my Dyson Airwrap, barely used, $300. Brooklyn only. DM.", likes: 22, replies: 15 },
];

const KEYS_POSTS = [
  { id: 1, author: "Lena O.",   initial: "L", time: "2h ago",   text: "Looking for a 1BR under $2,800 in Williamsburg or Greenpoint for May. Send me anything you see.", likes: 5, replies: 12 },
  { id: 2, author: "Kezia N.",  initial: "K", time: "Yesterday", text: "My roommate moved out of a Fort Greene 2BR. $1,600/room, available March. Women-only building. DM.", likes: 11, replies: 8 },
  { id: 3, author: "Deja W.",   initial: "D", time: "2d ago",   text: "Park Slope is still underrated. I pay $1,900 for a beautiful 1BR with natural light. Come here.", likes: 34, replies: 6 },
];

const OFFICE_POSTS = [
  { id: 1, author: "Imani J.", initial: "I", time: "3h ago",   text: "I just negotiated a $40K raise. The best thing I ever did was stop treating my salary as a fixed number.", likes: 87, replies: 23 },
  { id: 2, author: "Sofia K.", initial: "S", time: "1d ago",   text: "Looking for a cofounder. I have the product, need someone with growth/marketing expertise. DM me.", likes: 14, replies: 7 },
  { id: 3, author: "Naomi B.", initial: "N", time: "2d ago",   text: "Anyone here have experience pitching to female investors? About to raise a seed round and want to connect.", likes: 19, replies: 11 },
];

const GIRL_BAR_ROOMS = [
  { id: 1, name: "Morning Room",   desc: "Coffee talk, soft energy",        women: 8,  live: true  },
  { id: 2, name: "Night Owl",      desc: "Late night conversations",        women: 14, live: true  },
  { id: 3, name: "Study With Me",  desc: "Silent co-working vibes",         women: 5,  live: true  },
  { id: 4, name: "Vent Room",      desc: "Private, supportive space",       women: 3,  live: false },
];

// ── Shared post list component ────────────────────────────────────────────────

function PostList({ posts }: { posts: { id: number; author: string; initial: string; time: string; text: string; likes: number; replies: number; pinned?: boolean }[] }) {
  const [liked, setLiked] = useState<Set<number>>(new Set());

  return (
    <div className="flex flex-col gap-4">
      {/* Compose */}
      <div className="bg-white rounded-2xl p-4" style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.05)" }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0" style={{ background: "var(--bb-pink)" }}>
            M
          </div>
          <div className="flex-1 px-4 py-2.5 rounded-full text-sm text-gray-400" style={{ background: "var(--pale-pink-bg)" }}>
            Post something to the board…
          </div>
          <button className="px-4 py-2 rounded-full text-xs font-bold text-white" style={{ background: "var(--bb-pink)" }}>
            Post
          </button>
        </div>
      </div>

      {posts.map((post) => (
        <div key={post.id} className="bg-white rounded-2xl p-4" style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.05)" }}>
          {post.pinned && (
            <div className="flex items-center gap-1 mb-2">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="var(--bb-pink)">
                <path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z" />
              </svg>
              <span className="text-xs font-bold" style={{ color: "var(--bb-pink)" }}>PINNED</span>
            </div>
          )}
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0" style={{ background: "var(--bb-pink)" }}>
              {post.initial}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-bold text-sm" style={{ color: "var(--bb-black)" }}>{post.author}</p>
                <p className="text-xs text-gray-400">{post.time}</p>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">{post.text}</p>
              <div className="flex items-center gap-4 mt-3">
                <button
                  onClick={() => {
                    const n = new Set(liked);
                    if (n.has(post.id)) n.delete(post.id); else n.add(post.id);
                    setLiked(n);
                  }}
                  className="flex items-center gap-1.5 text-xs font-semibold"
                  style={{ color: liked.has(post.id) ? "var(--bb-pink)" : "rgba(0,0,0,0.3)" }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill={liked.has(post.id) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
                  </svg>
                  {post.likes + (liked.has(post.id) ? 1 : 0)}
                </button>
                <button className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: "rgba(0,0,0,0.3)" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
                  </svg>
                  {post.replies}
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Room Lobby ────────────────────────────────────────────────────────────────

function RoomLobby({ onEnter }: { onEnter: (room: Exclude<RoomKey, "lobby">) => void }) {
  return (
    <div>
      <div className="rounded-3xl p-5 mb-5" style={{ background: "#1A0514" }}>
        <p className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: "var(--mid-pink)" }}>BLOOMBAY</p>
        <p className="text-white text-2xl font-bold italic mb-1" style={{ fontFamily: "var(--font-playfair)", fontWeight: 500 }}>
          You have entered The Room.
        </p>
        <p className="text-white/50 text-sm">Choose a space. Women are inside.</p>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {ROOMS.map((room) => (
          <button
            key={room.key}
            onClick={() => onEnter(room.key)}
            className="bg-white rounded-2xl p-5 flex items-center gap-4 text-left transition-all active:scale-[0.98]"
            style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.05)" }}
          >
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ background: room.live ? "#1A0514" : "var(--pale-pink-bg)" }}
            >
              {room.live ? (
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "var(--bb-pink)" }} />
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="var(--bb-pink)">
                    <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"/>
                  </svg>
                </div>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--bb-pink)" strokeWidth="1.8" strokeLinecap="round">
                  <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
                </svg>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-bold text-base" style={{ color: "var(--bb-black)" }}>{room.name}</p>
                {room.live && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: "#FFF0F5", color: "var(--bb-pink)" }}>
                    LIVE
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-400 mt-0.5 leading-snug">{room.tagline}</p>
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="2">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function TheRoomPage() {
  const [room, setRoom] = useState<RoomKey>("lobby");

  const activeRoom = ROOMS.find((r) => r.key === room);

  return (
    <div className="min-h-screen pb-36 md:pb-10" style={{ background: "var(--pale-pink-bg)" }}>
      {/* Header */}
      <div className="px-5 pt-12 pb-4 md:px-8 md:pt-8 flex items-center gap-3">
        {room !== "lobby" && (
          <button
            onClick={() => setRoom("lobby")}
            className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: "white" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>
        )}
        <div>
          <p className="text-xs font-semibold tracking-widest uppercase mb-0.5" style={{ color: "var(--bb-pink)" }}>
            {room === "lobby" ? "BLOOMBAY" : "THE ROOM"}
          </p>
          <h1 className="text-3xl font-bold leading-tight" style={{ color: "var(--bb-black)" }}>
            {room === "lobby" ? "The Room" : activeRoom?.name ?? ""}
          </h1>
          {room !== "lobby" && activeRoom && (
            <p className="text-xs text-gray-400 mt-0.5 italic" style={{ fontFamily: "var(--font-playfair)" }}>
              {activeRoom.tagline}
            </p>
          )}
        </div>
      </div>

      <div className="px-5 md:px-8 md:grid md:grid-cols-[1fr_320px] md:gap-6">
        <div>
          {room === "lobby"   && <RoomLobby onEnter={setRoom} />}
          {room === "wall"    && <PostList posts={WALL_POSTS} />}
          {room === "closet"  && <PostList posts={CLOSET_POSTS} />}
          {room === "vanity"  && <PostList posts={VANITY_POSTS} />}
          {room === "exchange" && <PostList posts={EXCHANGE_POSTS} />}
          {room === "keys"    && <PostList posts={KEYS_POSTS} />}
          {room === "office"  && <PostList posts={OFFICE_POSTS} />}
          {room === "girlbar" && (
            <div className="flex flex-col gap-4">
              <div className="rounded-3xl p-5" style={{ background: "#1A0514" }}>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: "var(--bb-pink)" }} />
                  <p className="text-xs font-bold tracking-widest uppercase" style={{ color: "var(--mid-pink)" }}>GIRL BAR · LIVE</p>
                </div>
                <p className="text-white text-2xl font-bold italic mb-1" style={{ fontFamily: "var(--font-playfair)", fontWeight: 500 }}>
                  Girls Talk Late.
                </p>
                <p className="text-white/50 text-sm">Live audio rooms for women only. Tap in, drop out, no recordings.</p>
              </div>

              <div className="flex flex-col gap-3">
                {GIRL_BAR_ROOMS.map((r) => (
                  <div key={r.id} className="bg-white rounded-2xl p-4 flex items-center gap-4" style={{ boxShadow: "0 1px 8px rgba(0,0,0,0.05)" }}>
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                      style={{ background: r.live ? "var(--bb-pink)" : "var(--light-pink)" }}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill={r.live ? "white" : "var(--bb-pink)"}>
                        <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"/>
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-sm" style={{ color: "var(--bb-black)" }}>{r.name}</p>
                        {r.live && <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "var(--bb-pink)" }} />}
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">{r.desc}</p>
                      <p className="text-xs font-semibold mt-1" style={{ color: "var(--bb-pink)" }}>
                        {r.women} women {r.live ? "listening" : "waiting"}
                      </p>
                    </div>
                    <button
                      className="flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all active:scale-95"
                      style={r.live ? { background: "var(--bb-pink)", color: "white" } : { background: "var(--light-pink)", color: "var(--bb-pink)" }}
                    >
                      {r.live ? "Join" : "Notify me"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Desktop sidebar: rooms list when inside a room */}
        {room !== "lobby" && (
          <div className="hidden md:flex flex-col gap-2 pt-1">
            <p className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-2">All Rooms</p>
            {ROOMS.map((r) => (
              <button
                key={r.key}
                onClick={() => setRoom(r.key)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all"
                style={
                  room === r.key
                    ? { background: "var(--bb-pink)", color: "white" }
                    : { background: "white", color: "var(--bb-black)" }
                }
              >
                <span className="text-sm font-semibold">{r.name}</span>
                {r.live && (
                  <div className="w-1.5 h-1.5 rounded-full ml-auto" style={{ background: room === r.key ? "white" : "var(--bb-pink)", animation: "pulse 2s infinite" }} />
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
