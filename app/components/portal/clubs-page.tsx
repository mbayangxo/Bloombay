"use client";

import { useState } from "react";
import Link from "next/link";

// ─── Types ─────────────────────────────────────────────────────────────────────

type ClubType = "hq" | "user";
type JourneyLevel = "member" | "regular" | "insider";

interface World {
  id: number;
  name: string;
  emoji: string;
  bg: string;
  accent: string;
  vibe: string;
  activeNow: number;
}

interface Whisper {
  id: number;
  initial: string;
  color: string;
  text: string;
  time: string;
  rotation: number;
  col: 0 | 1;
}

type Zone = {
  id: number;
  name: string;
  desc: string;
  emoji: string;
  members: number;
  status: "open" | "invite" | "mama-run";
};

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
  worlds: World[];
  zones?: Zone[];
};

// ─── Data ──────────────────────────────────────────────────────────────────────

const CLUBS: Club[] = [
  {
    id: 0, name: "African Girls Club", women: 284,
    desc: "Culture, community, and joy for African women in NYC.",
    color: "#FF1F7D", crestBg: "#7F0030", curator: "BloomBay",
    tags: ["Culture", "Community"], type: "hq",
    activity: "Jollof + Movie Night · Friday", live: true,
    vibe: "Dinner parties that feel like home.",
    worlds: [
      { id: 1, name: "Culture & Roots", emoji: "🪘", bg: "#0F0805", accent: "#FF8C42", vibe: "home recipes, music, language", activeNow: 8 },
      { id: 2, name: "Win of the Week", emoji: "✨", bg: "#070A0F", accent: "#FFD700", vibe: "celebrate each other", activeNow: 3 },
      { id: 3, name: "Back Home Thoughts", emoji: "🌍", bg: "#080F08", accent: "#83C5A0", vibe: "diaspora feelings, nostalgia", activeNow: 5 },
      { id: 4, name: "Sunday Vibes", emoji: "🌅", bg: "#0F080A", accent: "#FF69B4", vibe: "what are you doing today", activeNow: 12 },
    ],
  },
  {
    id: 1, name: "Soft Life Club NYC", women: 312,
    desc: "For women who choose peace, softness, and intention.",
    color: "#FF69B4", crestBg: "#C51B7A", curator: "BloomBay",
    tags: ["Lifestyle", "Wellness"], type: "hq",
    activity: "12 women online now", live: true,
    vibe: "Brunches, spa days, rooftop hangs.",
    worlds: [
      { id: 1, name: "Night Moods", emoji: "🌙", bg: "#080610", accent: "#C4B5FD", vibe: "music, feelings, stillness", activeNow: 14 },
      { id: 2, name: "Sunday Kitchen", emoji: "🍳", bg: "#0F0905", accent: "#FCD34D", vibe: "recipes, food moments", activeNow: 6 },
      { id: 3, name: "Manifestation Board", emoji: "🌸", bg: "#0F050A", accent: "#FF69B4", vibe: "goals, dreams, vision", activeNow: 9 },
      { id: 4, name: "Soft Talk", emoji: "💆", bg: "#050F0D", accent: "#6EE7B7", vibe: "gentle check-ins, support", activeNow: 4 },
    ],
  },
  {
    id: 2, name: "Muslim Women NYC", women: 76,
    desc: "Faith, fashion, food, and sisterhood.",
    color: "#A855F7", crestBg: "#6B21A8", curator: "BloomBay",
    tags: ["Faith", "Social"], type: "hq",
    activity: "Thursday meetup in planning", live: false,
    vibe: "Halal outings every week.",
    worlds: [
      { id: 1, name: "Deen & Daily Life", emoji: "🌙", bg: "#0A050F", accent: "#A855F7", vibe: "faith, intention, balance", activeNow: 7 },
      { id: 2, name: "Modest Mood", emoji: "✨", bg: "#0F0A05", accent: "#F59E0B", vibe: "style, finds, inspo", activeNow: 4 },
      { id: 3, name: "Halal Table", emoji: "🍽️", bg: "#050F08", accent: "#6EE7B7", vibe: "recipes, restaurants, shared meals", activeNow: 5 },
    ],
  },
  {
    id: 3, name: "Girl Tech Collective", women: 89,
    desc: "Tech, startups, side projects.",
    color: "#0EA5E9", crestBg: "#0369A1", curator: "Sofia K.",
    tags: ["Tech", "Career"], type: "user",
    activity: "5 women active", live: true,
    vibe: "Monthly hackathons and mentorship.",
    worlds: [
      { id: 1, name: "Build Log", emoji: "💻", bg: "#050A0F", accent: "#0EA5E9", vibe: "what we're shipping", activeNow: 5 },
      { id: 2, name: "Founder Feels", emoji: "🚀", bg: "#0A050F", accent: "#C084FC", vibe: "the honest startup moments", activeNow: 3 },
      { id: 3, name: "Resources Drop", emoji: "📌", bg: "#050F0A", accent: "#34D399", vibe: "links, tools, opportunities", activeNow: 2 },
    ],
    zones: [
      { id: 1, name: "Coders", desc: "Engineering, dev tools, code reviews, pair programming", emoji: "💻", members: 34, status: "open" },
      { id: 2, name: "Founders", desc: "Startups, fundraising, pitch prep, investor connections", emoji: "🚀", members: 18, status: "invite" },
      { id: 3, name: "Designers", desc: "UI/UX, product design, portfolio critiques", emoji: "🎨", members: 12, status: "open" },
      { id: 4, name: "PM & Strategy", desc: "Product management, road-mapping, strategy chats", emoji: "📋", members: 9, status: "mama-run" },
    ],
  },
  {
    id: 4, name: "Girls Who Move", women: 142,
    desc: "Run clubs, gym check-ins, yoga flows, hikes.",
    color: "#F59E0B", crestBg: "#92400E", curator: "Priya R.",
    tags: ["Fitness", "Outdoor"], type: "user",
    activity: "Sunday run confirmed", live: false,
    vibe: "Move together.",
    worlds: [
      { id: 1, name: "Morning Run", emoji: "🌄", bg: "#0F0A05", accent: "#F59E0B", vibe: "early risers, routes, check-ins", activeNow: 11 },
      { id: 2, name: "Gym Glow", emoji: "💪", bg: "#0A050F", accent: "#F472B6", vibe: "workouts, form, progress", activeNow: 6 },
      { id: 3, name: "Nature & Trails", emoji: "🌿", bg: "#050F05", accent: "#4ADE80", vibe: "hikes, parks, outdoor plans", activeNow: 4 },
    ],
  },
  {
    id: 5, name: "Girl Creatives", women: 98,
    desc: "Writers, artists, photographers.",
    color: "#EC4899", crestBg: "#9D174D", curator: "Yemi O.",
    tags: ["Art", "Creative"], type: "user",
    activity: "New showcase posted", live: false,
    vibe: "Monthly showcases and collabs.",
    worlds: [
      { id: 1, name: "Mood Board", emoji: "🎨", bg: "#0F050A", accent: "#EC4899", vibe: "visuals, colors, inspiration", activeNow: 9 },
      { id: 2, name: "Written Words", emoji: "✍️", bg: "#05080F", accent: "#818CF8", vibe: "poetry, prose, shared writing", activeNow: 5 },
      { id: 3, name: "Lens & Light", emoji: "📷", bg: "#080F05", accent: "#A3E635", vibe: "photography, shots, critique", activeNow: 3 },
      { id: 4, name: "Collab Corner", emoji: "🤝", bg: "#0F0F05", accent: "#FCD34D", vibe: "find your creative partner", activeNow: 7 },
    ],
  },
  {
    id: 6, name: "Jazz & Wine Girls", women: 61,
    desc: "Jazz nights, wine bars, vinyl listening sessions.",
    color: "#8B5CF6", crestBg: "#5B21B6", curator: "Amanda R.",
    tags: ["Music", "Social"], type: "user",
    activity: "Friday night plans", live: false,
    vibe: "Jazz, wine, and good company.",
    worlds: [
      { id: 1, name: "Now Playing", emoji: "🎷", bg: "#0A0510", accent: "#8B5CF6", vibe: "what's on the record tonight", activeNow: 8 },
      { id: 2, name: "Wine Diaries", emoji: "🍷", bg: "#0F0508", accent: "#FB7185", vibe: "bottles, pairings, discoveries", activeNow: 5 },
      { id: 3, name: "The Velvet Room", emoji: "🕯️", bg: "#0A0A0F", accent: "#C4B5FD", vibe: "slow evenings, ambient moods", activeNow: 11 },
    ],
  },
];

const MEMBERSHIP: Record<number, { events: number; since: string }> = {
  1: { events: 4, since: "Mar 2024" },
  2: { events: 1, since: "Apr 2024" },
};

const INITIAL_JOINED = new Set<number>([1, 2]);
const JOURNEY: JourneyLevel[] = ["member", "regular", "insider"];

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

// ─── World Whispers data ───────────────────────────────────────────────────────

const WORLD_WHISPERS: Record<number, Record<number, Whisper[]>> = {
  // African Girls Club
  0: {
    1: [
      { id: 1, initial: "A", color: "#FF8C42", text: "Made egusi soup for the first time without calling my mum. She'd be proud.", time: "2h ago", rotation: -2, col: 0 },
      { id: 2, initial: "Z", color: "#FFD700", text: "Afrobeats playlist drop — 43 songs, zero skips. Trust me.", time: "4h ago", rotation: 3, col: 1 },
      { id: 3, initial: "N", color: "#83C5A0", text: "Learning Twi on Duolingo. Anyone else doing this?", time: "5h ago", rotation: -1, col: 0 },
      { id: 4, initial: "K", color: "#FF69B4", text: "My grandmother's jollof recipe is a secret I finally wrote down.", time: "1h ago", rotation: 2, col: 1 },
      { id: 5, initial: "T", color: "#FF8C42", text: "Ankara fabric haul just arrived. My wardrobe is ready.", time: "30m ago", rotation: -3, col: 0 },
    ],
    2: [
      { id: 1, initial: "O", color: "#FFD700", text: "Got the promotion. My ancestors were cheering louder than anyone.", time: "3h ago", rotation: 1, col: 0 },
      { id: 2, initial: "A", color: "#FF8C42", text: "First paycheck at my dream job. I cried in the bathroom.", time: "6h ago", rotation: -2, col: 1 },
      { id: 3, initial: "F", color: "#83C5A0", text: "My business made its first $1000 this week. Soft launch, big feelings.", time: "1h ago", rotation: 3, col: 0 },
      { id: 4, initial: "M", color: "#FF69B4", text: "Finished my thesis. Four years. It's done.", time: "2h ago", rotation: -1, col: 1 },
    ],
    3: [
      { id: 1, initial: "D", color: "#83C5A0", text: "Sometimes I miss the sound of rain back home. NYC rain is different.", time: "5h ago", rotation: 2, col: 0 },
      { id: 2, initial: "L", color: "#FF8C42", text: "My mum sent me a voice note and I replayed it five times.", time: "3h ago", rotation: -3, col: 1 },
      { id: 3, initial: "S", color: "#FFD700", text: "Between two worlds and somehow belonging to both. It's a gift.", time: "7h ago", rotation: 1, col: 0 },
      { id: 4, initial: "Y", color: "#FF69B4", text: "Made my grandma's soup recipe last night. The whole apartment smelled like home.", time: "2h ago", rotation: -2, col: 1 },
      { id: 5, initial: "B", color: "#83C5A0", text: "Watching Nigerian movies with my American friends. They're hooked.", time: "1h ago", rotation: 4, col: 0 },
    ],
    4: [
      { id: 1, initial: "R", color: "#FF69B4", text: "Sunday morning playlist, shea butter, no plans. Perfect.", time: "1h ago", rotation: -1, col: 0 },
      { id: 2, initial: "C", color: "#FFD700", text: "Church then brunch with the girls. God is good.", time: "3h ago", rotation: 3, col: 1 },
      { id: 3, initial: "P", color: "#FF8C42", text: "Cooking for no reason other than because I want to. Joy.", time: "2h ago", rotation: -2, col: 0 },
      { id: 4, initial: "E", color: "#83C5A0", text: "Phone off until noon. Today belongs to me.", time: "30m ago", rotation: 2, col: 1 },
    ],
  },
  // Soft Life Club NYC
  1: {
    1: [
      { id: 1, initial: "M", color: "#C4B5FD", text: "2am and this playlist has me in my feelings in the best way.", time: "2h ago", rotation: -2, col: 0 },
      { id: 2, initial: "J", color: "#FCD34D", text: "Turned my phone off and just listened to Sade for an hour. Necessary.", time: "4h ago", rotation: 3, col: 1 },
      { id: 3, initial: "R", color: "#6EE7B7", text: "There's something about Sunday night that feels like velvet.", time: "1h ago", rotation: -1, col: 0 },
      { id: 4, initial: "A", color: "#C4B5FD", text: "Candles lit, bath drawn, week over. This is the soft life.", time: "5h ago", rotation: 2, col: 1 },
      { id: 5, initial: "T", color: "#FCD34D", text: "Late night feelings are best processed with lo-fi and herbal tea.", time: "30m ago", rotation: -3, col: 0 },
    ],
    2: [
      { id: 1, initial: "S", color: "#FCD34D", text: "Made banana bread from scratch. The apartment smells like a hug.", time: "3h ago", rotation: 1, col: 0 },
      { id: 2, initial: "N", color: "#C4B5FD", text: "Sunday Kitchen is my favorite ritual. Coffee, quiet, good food.", time: "2h ago", rotation: -2, col: 1 },
      { id: 3, initial: "L", color: "#6EE7B7", text: "Shakshuka for brunch. The eggs were perfect. I felt powerful.", time: "6h ago", rotation: 3, col: 0 },
      { id: 4, initial: "V", color: "#FCD34D", text: "Finally made my grandmother's stew from memory. I cried a little.", time: "1h ago", rotation: -1, col: 1 },
    ],
    3: [
      { id: 1, initial: "B", color: "#FF69B4", text: "My vision board said Europe trip by June. Booking flights today.", time: "2h ago", rotation: -2, col: 0 },
      { id: 2, initial: "K", color: "#C4B5FD", text: "I wrote down 10 things I'm calling in this year. Signed it like a contract.", time: "5h ago", rotation: 3, col: 1 },
      { id: 3, initial: "D", color: "#6EE7B7", text: "Soft life isn't lazy. It's intentional. I manifest from a place of peace.", time: "3h ago", rotation: -1, col: 0 },
      { id: 4, initial: "F", color: "#FF69B4", text: "Everything on my 2023 board happened. Everything on my 2024 board is happening.", time: "1h ago", rotation: 2, col: 1 },
      { id: 5, initial: "G", color: "#C4B5FD", text: "New affirmation: I receive easily. Letting that one land.", time: "4h ago", rotation: -3, col: 0 },
    ],
    4: [
      { id: 1, initial: "H", color: "#6EE7B7", text: "Just checking in. How are you, really?", time: "1h ago", rotation: 1, col: 0 },
      { id: 2, initial: "I", color: "#FF69B4", text: "Had a hard week. Being soft with myself this weekend.", time: "3h ago", rotation: -2, col: 1 },
      { id: 3, initial: "O", color: "#C4B5FD", text: "Reminder: you don't have to explain your rest to anyone.", time: "2h ago", rotation: 3, col: 0 },
      { id: 4, initial: "P", color: "#FCD34D", text: "Therapy was good today. Growth is not linear but it is real.", time: "5h ago", rotation: -1, col: 1 },
    ],
  },
};

// Fallback whispers for worlds without specific data
function getFallbackWhispers(worldName: string, accent: string): Whisper[] {
  return [
    { id: 1, initial: "A", color: accent, text: `Something about ${worldName} that makes this space feel like home.`, time: "2h ago", rotation: -2, col: 0 },
    { id: 2, initial: "M", color: accent, text: "This community holds something I didn't know I was looking for.", time: "4h ago", rotation: 3, col: 1 },
    { id: 3, initial: "J", color: accent, text: "Grateful for this space. Needed it today more than I expected.", time: "1h ago", rotation: -1, col: 0 },
    { id: 4, initial: "S", color: accent, text: "Just came to share this feeling with people who get it.", time: "5h ago", rotation: 2, col: 1 },
  ];
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

// ─── World Card ────────────────────────────────────────────────────────────────

function WorldCard({ world, onEnter }: { world: World; onEnter: () => void }) {
  return (
    <button
      onClick={onEnter}
      className="flex-shrink-0 flex flex-col items-center justify-center rounded-2xl p-4"
      style={{
        width: 140,
        minHeight: 160,
        background: world.bg,
        border: `1px solid ${world.accent}22`,
        boxShadow: `0 4px 24px ${world.accent}18`,
        cursor: "pointer",
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: 34, marginBottom: 10 }}>{world.emoji}</div>
      <p className="font-bold text-xs leading-snug mb-1"
        style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", color: "rgba(255,255,255,0.88)" }}>
        {world.name}
      </p>
      <p className="text-[10px] leading-snug mb-3"
        style={{ color: "rgba(255,255,255,0.38)", fontFamily: "var(--font-instrument)", fontStyle: "italic" }}>
        {world.vibe}
      </p>
      <div className="flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: world.accent }} />
        <span className="text-[10px] font-bold" style={{ color: world.accent }}>{world.activeNow} active</span>
      </div>
    </button>
  );
}

// ─── Zones Section ────────────────────────────────────────────────────────────

function ZonesSection({ club }: { club: Club }) {
  const [joined, setJoined] = useState<Set<number>>(new Set());
  const [requested, setRequested] = useState<Set<number>>(new Set());
  const [showRequest, setShowRequest] = useState(false);
  const [newZoneName, setNewZoneName] = useState("");
  const [newZoneDesc, setNewZoneDesc] = useState("");

  const statusLabel = (z: Zone) => {
    if (z.status === "mama-run") return { text: "Club Mama", color: "#D4A853" };
    if (z.status === "invite") return { text: "Invite Only", color: "#A78BFA" };
    return { text: "Open", color: "#4ADE80" };
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-[10px] font-bold tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.3)" }}>ZONES</p>
          <p className="text-[11px] mt-0.5" style={{ color: "rgba(255,255,255,0.2)", fontFamily: "var(--font-instrument)", fontStyle: "italic" }}>
            Niche spaces within the club
          </p>
        </div>
        <button
          onClick={() => setShowRequest(true)}
          className="px-3 py-1.5 rounded-full text-[10px] font-bold transition-all active:scale-95"
          style={{ background: `${club.color}22`, color: club.color, border: `1px solid ${club.color}44` }}>
          + Request a Zone
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {club.zones!.map(z => {
          const s = statusLabel(z);
          const isJoined = joined.has(z.id);
          const isRequested = requested.has(z.id);
          return (
            <div key={z.id} className="rounded-2xl p-4"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-lg"
                  style={{ background: `${club.color}18` }}>
                  {z.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <p className="font-bold text-sm" style={{ color: "rgba(255,238,220,0.9)" }}>{z.name}</p>
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full"
                      style={{ background: `${s.color}18`, color: s.color }}>
                      {s.text}
                    </span>
                  </div>
                  <p className="text-[11px] mb-2 leading-relaxed" style={{ color: "rgba(255,255,255,0.4)", fontFamily: "var(--font-instrument)", fontStyle: "italic" }}>{z.desc}</p>
                  <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.22)" }}>{z.members} women in this zone</p>
                </div>
                <button
                  onClick={() => {
                    if (isJoined) {
                      setJoined(p => { const n = new Set(p); n.delete(z.id); return n; });
                    } else if (z.status === "open") {
                      setJoined(p => new Set([...p, z.id]));
                    } else {
                      setRequested(p => new Set([...p, z.id]));
                    }
                  }}
                  className="flex-shrink-0 px-3 py-1.5 rounded-full text-[10px] font-bold transition-all active:scale-95"
                  style={isJoined
                    ? { background: `${club.color}22`, color: club.color, border: `1px solid ${club.color}44` }
                    : isRequested
                      ? { background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.3)", border: "1px solid rgba(255,255,255,0.1)" }
                      : z.status === "open"
                        ? { background: club.color, color: "white", boxShadow: `0 4px 12px ${club.color}44` }
                        : { background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.12)" }
                  }>
                  {isJoined ? "✓ In Zone" : isRequested ? "Requested" : z.status === "open" ? "Join" : "Request"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Request new zone sheet */}
      {showRequest && (
        <>
          <div className="fixed inset-0 z-40" style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
            onClick={() => setShowRequest(false)} />
          <div className="fixed inset-x-0 bottom-0 z-50 rounded-t-3xl p-6 pb-10"
            style={{ background: "#111111", boxShadow: "0 -16px 48px rgba(0,0,0,0.5)" }}>
            <div className="flex justify-center mb-4">
              <div className="w-10 h-1 rounded-full" style={{ background: "rgba(255,255,255,0.12)" }} />
            </div>
            <p className="text-[9px] font-bold tracking-[0.25em] uppercase mb-1" style={{ color: club.color }}>✦ PROPOSE A ZONE</p>
            <h3 className="font-bold italic mb-1" style={{ fontFamily: "var(--font-playfair)", fontSize: "22px", color: "rgba(255,238,220,0.9)" }}>
              Request a Zone
            </h3>
            <p className="text-xs mb-5" style={{ color: "rgba(255,255,255,0.35)" }}>
              The Club Mama will review and approve your request.
            </p>
            <div className="flex flex-col gap-3">
              <input
                value={newZoneName}
                onChange={e => setNewZoneName(e.target.value)}
                placeholder="Zone name (e.g. Coders, Wellness, Books)"
                className="w-full px-4 py-3.5 rounded-2xl text-sm outline-none"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,238,220,0.9)" }}
              />
              <textarea
                value={newZoneDesc}
                onChange={e => setNewZoneDesc(e.target.value)}
                placeholder="What will this zone be about? Who's it for?"
                rows={3}
                className="w-full px-4 py-3.5 rounded-2xl text-sm outline-none resize-none"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,238,220,0.9)" }}
              />
              <button
                onClick={() => { if (newZoneName.trim()) { setShowRequest(false); setNewZoneName(""); setNewZoneDesc(""); } }}
                disabled={!newZoneName.trim()}
                className="w-full py-4 rounded-2xl font-bold text-sm transition-all active:scale-[0.98] disabled:opacity-40"
                style={{ background: club.color, color: "white", boxShadow: `0 8px 24px ${club.color}44` }}>
                Submit Request to Club Mama
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Club Detail Page ──────────────────────────────────────────────────────────

function ClubDetailPage({ club, onBack, onEnterWorld }: {
  club: Club;
  onBack: () => void;
  onEnterWorld: (w: World) => void;
}) {
  return (
    <div className="min-h-screen pb-24" style={{ background: "#0A0A0A" }}>
      {/* Banner */}
      <div className="relative"
        style={{
          background: `linear-gradient(150deg, ${club.color} 0%, ${club.crestBg} 100%)`,
          minHeight: 200,
        }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-72 h-72 rounded-full"
            style={{ background: "rgba(255,255,255,0.06)", transform: "translate(35%,-35%)" }} />
          <div className="absolute bottom-0 left-0 w-44 h-44 rounded-full"
            style={{ background: "rgba(255,255,255,0.04)", transform: "translate(-30%,30%)" }} />
        </div>
        {/* Back button */}
        <button onClick={onBack}
          className="absolute z-20 flex items-center justify-center rounded-full"
          style={{
            top: "calc(env(safe-area-inset-top,0px) + 60px)",
            left: 20,
            width: 36, height: 36,
            background: "rgba(0,0,0,0.35)",
            border: "1px solid rgba(255,255,255,0.18)",
          }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <div className="relative z-10 px-5 flex flex-col items-center justify-end"
          style={{ paddingTop: "calc(env(safe-area-inset-top,0px) + 60px)", paddingBottom: 32 }}>
          <ClubCrest name={club.name} color={club.color} crestBg={club.crestBg} size={72} />
          <h2 className="text-2xl font-bold italic text-white mt-4 text-center"
            style={{ fontFamily: "var(--font-playfair)" }}>{club.name}</h2>
          <p className="text-sm text-white/60 mt-1">{club.women} women</p>
        </div>
      </div>

      <div className="px-5 py-6 flex flex-col gap-8">
        {/* Worlds section */}
        <div>
          <p className="text-[10px] font-bold tracking-widest uppercase mb-4"
            style={{ color: "rgba(255,255,255,0.3)" }}>WORLDS</p>
          <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
            {club.worlds.map(w => (
              <WorldCard key={w.id} world={w} onEnter={() => onEnterWorld(w)} />
            ))}
          </div>
        </div>

        {/* Zones section */}
        {club.zones && club.zones.length > 0 && (
          <ZonesSection club={club} />
        )}

        {/* About section */}
        <div>
          <p className="text-[10px] font-bold tracking-widest uppercase mb-3"
            style={{ color: "rgba(255,255,255,0.3)" }}>ABOUT</p>
          <div className="rounded-2xl p-5"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <p className="text-sm leading-relaxed mb-4"
              style={{ color: "rgba(255,255,255,0.72)", fontFamily: "var(--font-instrument)", fontStyle: "italic" }}>
              {club.desc}
            </p>
            <div className="flex flex-wrap gap-2">
              {club.tags.map(tag => (
                <span key={tag} className="text-[11px] font-bold px-3 py-1 rounded-full"
                  style={{ background: `${club.color}22`, color: club.color }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── World Entry Page ──────────────────────────────────────────────────────────

function WorldEntryPage({ world, club, onBack }: {
  world: World;
  club: Club;
  onBack: () => void;
}) {
  const [composing, setComposing] = useState(false);
  const [draft, setDraft] = useState("");

  const whispers =
    WORLD_WHISPERS[club.id]?.[world.id] ??
    getFallbackWhispers(world.name, world.accent);

  const leftCol = whispers.filter(w => w.col === 0);
  const rightCol = whispers.filter(w => w.col === 1);

  return (
    <div className="min-h-screen relative overflow-hidden pb-28"
      style={{ background: world.bg }}>
      {/* Atmospheric glow */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: `radial-gradient(ellipse 80% 40% at 50% 0%, ${world.accent}4D 0%, transparent 70%)`,
      }} />

      {/* Back button */}
      <button onClick={onBack}
        className="absolute z-20 flex items-center justify-center rounded-full"
        style={{
          top: "calc(env(safe-area-inset-top,0px) + 60px)",
          left: 20,
          width: 36, height: 36,
          background: "rgba(255,255,255,0.08)",
          border: "1px solid rgba(255,255,255,0.14)",
        }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      {/* Header */}
      <div className="relative z-10 flex flex-col items-center text-center px-6"
        style={{ paddingTop: "calc(env(safe-area-inset-top,0px) + 60px)", paddingBottom: 32 }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>{world.emoji}</div>
        <h2 className="text-2xl font-bold italic mb-2"
          style={{ fontFamily: "var(--font-playfair)", color: "rgba(255,255,255,0.92)", fontWeight: 300 }}>
          {world.name}
        </h2>
        <p className="text-sm mb-5"
          style={{ color: "rgba(255,255,255,0.38)", fontFamily: "var(--font-instrument)", fontStyle: "italic" }}>
          {world.vibe}
        </p>
        {/* Active count */}
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: world.accent }} />
          <span className="text-xs font-bold" style={{ color: world.accent }}>
            {world.activeNow} women here now
          </span>
        </div>
      </div>

      {/* Whispers — two-column masonry */}
      <div className="relative z-10 px-4 flex gap-3">
        {/* Left column */}
        <div className="flex-1 flex flex-col gap-3">
          {leftCol.map(w => (
            <WhisperCard key={w.id} whisper={w} />
          ))}
        </div>
        {/* Right column */}
        <div className="flex-1 flex flex-col gap-3" style={{ paddingTop: 28 }}>
          {rightCol.map(w => (
            <WhisperCard key={w.id} whisper={w} />
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 z-30 flex justify-center px-6"
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom,0px) + 20px)", paddingTop: 12 }}>
        <button
          onClick={() => setComposing(true)}
          className="flex items-center justify-center px-6 py-4 rounded-full"
          style={{
            background: "rgba(10,10,10,0.80)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            border: "1px solid rgba(255,255,255,0.10)",
            color: "rgba(255,255,255,0.38)",
            fontSize: "14px",
            fontFamily: "var(--font-instrument)",
            fontStyle: "italic",
            minWidth: 240,
            boxShadow: `0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px ${world.accent}22`,
          }}>
          Leave a thought ✦
        </button>
      </div>

      {/* Compose overlay */}
      {composing && (
        <div className="fixed inset-0 z-40 flex flex-col justify-end"
          style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
          onClick={e => { if (e.target === e.currentTarget) setComposing(false); }}>
          <div className="rounded-t-3xl p-6 flex flex-col gap-4"
            style={{
              background: world.bg,
              border: "1px solid rgba(255,255,255,0.10)",
              borderBottom: "none",
              paddingBottom: "calc(env(safe-area-inset-bottom,0px) + 24px)",
            }}>
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs font-bold tracking-widest uppercase"
                style={{ color: "rgba(255,255,255,0.35)" }}>
                {world.emoji} {world.name}
              </p>
              <button onClick={() => setComposing(false)}
                style={{ color: "rgba(255,255,255,0.35)", fontSize: 20 }}>×</button>
            </div>
            <textarea
              value={draft}
              onChange={e => setDraft(e.target.value)}
              placeholder="Drop a thought into this world…"
              rows={4}
              className="w-full outline-none resize-none rounded-2xl p-4 text-sm"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "rgba(255,255,255,0.82)",
                fontFamily: "var(--font-instrument)",
                fontStyle: "italic",
              }}
              autoFocus
            />
            <button
              onClick={() => { setDraft(""); setComposing(false); }}
              className="w-full py-3.5 rounded-full font-bold text-sm"
              style={{ background: world.accent, color: "#0A0A0A" }}>
              Send ✦
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Whisper Card ─────────────────────────────────────────────────────────────

function WhisperCard({ whisper }: { whisper: Whisper }) {
  return (
    <div
      className="rounded-2xl p-3.5"
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.06)",
        transform: `rotate(${whisper.rotation}deg)`,
        transformOrigin: "center",
      }}>
      <div className="flex items-center gap-2 mb-2">
        <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: whisper.color, fontSize: 11, color: "#0A0A0A", fontWeight: 700 }}>
          {whisper.initial}
        </div>
      </div>
      <p className="text-sm italic leading-relaxed mb-2"
        style={{ color: "rgba(255,255,255,0.78)", fontFamily: "var(--font-instrument)" }}>
        {whisper.text}
      </p>
      <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.22)" }}>{whisper.time}</p>
    </div>
  );
}

// ─── Featured Door ─────────────────────────────────────────────────────────────

function FeaturedDoor({ club, onSelect }: { club: Club; onSelect: () => void }) {
  return (
    <button onClick={onSelect} style={{ textDecoration: "none", display: "block", width: "100%", textAlign: "left" }}>
      <div className="relative rounded-3xl overflow-hidden" style={{
        background: `linear-gradient(150deg, ${club.color} 0%, ${club.crestBg} 100%)`,
        boxShadow: `0 12px 40px ${club.color}40`,
        minHeight: "220px",
      }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-72 h-72 rounded-full"
            style={{ background: "rgba(255,255,255,0.07)", transform: "translate(35%,-35%)" }} />
          <div className="absolute bottom-0 left-0 w-44 h-44 rounded-full"
            style={{ background: "rgba(255,255,255,0.04)", transform: "translate(-30%,30%)" }} />
        </div>
        <div className="relative z-10 p-6 flex flex-col justify-between" style={{ minHeight: "220px" }}>
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
    </button>
  );
}

// ─── Discover Card ─────────────────────────────────────────────────────────────

function DiscoverCard({ club, isJoined, isRequested, onSelect }: {
  club: Club; isJoined: boolean; isRequested: boolean; onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      className="flex items-center gap-4 px-4 py-3.5 w-full"
      style={{ borderBottom: "1px solid rgba(0,0,0,0.04)", textDecoration: "none", background: "none", textAlign: "left" }}>
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
    </button>
  );
}

// ─── Club Cover Card ──────────────────────────────────────────────────────────

function ClubCoverCard({ club, isJoined, onSelect }: {
  club: Club; isJoined: boolean; onSelect: () => void;
}) {
  return (
    <button onClick={onSelect} className="relative rounded-2xl overflow-hidden text-left w-full transition-all active:scale-[0.97]"
      style={{
        background: `linear-gradient(150deg, ${club.color}CC 0%, ${club.crestBg} 100%)`,
        minHeight: 150,
        boxShadow: `0 6px 20px ${club.color}30`,
        animation: club.live ? "clubShake 5s ease-in-out 1s infinite" : undefined,
      }}>
      {/* Decorative circle */}
      <div className="absolute top-0 right-0 w-32 h-32 rounded-full pointer-events-none"
        style={{ background: "rgba(255,255,255,0.06)", transform: "translate(40%,-40%)" }} />
      {/* Live badge */}
      {club.live && (
        <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2 py-1 rounded-full"
          style={{ background: "rgba(0,0,0,0.3)" }}>
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "white" }} />
          <span className="text-[8px] font-bold text-white/80">LIVE</span>
        </div>
      )}
      {/* Official badge */}
      {club.type === "hq" && !club.live && (
        <div className="absolute top-3 right-3">
          <span className="text-[8px] font-bold px-2 py-1 rounded-full"
            style={{ background: "rgba(0,0,0,0.3)", color: "white" }}>✦ Official</span>
        </div>
      )}
      <div className="relative z-10 p-4 flex flex-col justify-between" style={{ minHeight: 150 }}>
        <div>
          <p className="text-[9px] font-bold tracking-widest uppercase mb-1.5"
            style={{ color: "rgba(255,255,255,0.5)" }}>{club.tags.join(" · ")}</p>
          <h3 className="text-base font-bold italic text-white leading-snug"
            style={{ fontFamily: "var(--font-playfair)" }}>
            {club.name}
          </h3>
          <p className="text-[11px] mt-1 leading-snug"
            style={{ color: "rgba(255,255,255,0.55)", fontFamily: "var(--font-instrument)", fontStyle: "italic" }}>
            {club.vibe}
          </p>
        </div>
        <div className="flex items-center justify-between mt-4">
          <span className="text-[10px] font-bold" style={{ color: "rgba(255,255,255,0.6)" }}>{club.women} women</span>
          <span className="text-[10px] font-bold px-3 py-1.5 rounded-full"
            style={{ background: isJoined ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.35)", color: "white" }}>
            {isJoined ? "In ✓" : "Enter →"}
          </span>
        </div>
      </div>
    </button>
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

function BoardRow({ club, rank, onSelect }: { club: Club; rank: number; onSelect: () => void }) {
  const isTop = rank <= 3;
  return (
    <button
      onClick={onSelect}
      className="flex items-center gap-3 px-4 py-3 rounded-2xl w-full"
      style={{
        background: "white",
        border: isTop ? "1px solid rgba(255,31,125,0.10)" : "1px solid transparent",
        boxShadow: isTop ? "0 2px 12px rgba(255,31,125,0.06)" : "0 1px 4px rgba(0,0,0,0.04)",
        textDecoration: "none",
        textAlign: "left",
      }}>
      <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
        style={rank === 1
          ? { background: "linear-gradient(135deg,#FF1F7D,#FF69B4)", color: "white" }
          : rank === 2 ? { background: "#111111", color: "white" }
          : rank === 3 ? { background: "#F5ECE8", color: "#FF1F7D" }
          : { background: "#F5F5F5", color: "#bbb" }}>
        {rank === 1 ? "✦" : rank}
      </div>
      <ClubCrest name={club.name} color={club.color} crestBg={club.crestBg} size={32} />
      <div className="flex-1 min-w-0">
        <p className="font-bold text-sm truncate" style={{ color: "#111111" }}>{club.name}</p>
        <p className="text-[11px]" style={{ color: "#ccc" }}>{club.women} women</p>
      </div>
      {club.live && <span className="w-1.5 h-1.5 rounded-full animate-pulse flex-shrink-0" style={{ background: "#FF1F7D" }} />}
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#FF1F7D" strokeWidth="2.5" strokeLinecap="round">
        <polyline points="9 18 15 12 9 6" />
      </svg>
    </button>
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

function PassportStamp({ club, events, since, isPending, onSelect }: {
  club: Club; events: number; since: string; isPending?: boolean; onSelect: () => void;
}) {
  const level = getLevel(events);
  const levelIdx = getLevelIdx(level);

  return (
    <div className="rounded-3xl overflow-hidden"
      style={{ background: "#FDFAF5", border: "1.5px solid rgba(0,0,0,0.06)", boxShadow: "0 2px 16px rgba(0,0,0,0.04)" }}>
      <div style={{ height: "4px", background: `linear-gradient(90deg, ${club.color}, ${club.crestBg})` }} />
      <div className="p-5">
        {/* Header */}
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
              Your application is with the host. You'll hear back within 48 hours.
            </p>
          </div>
        ) : (
          <>
            {/* Journey */}
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

            {/* Stats */}
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
              <button
                onClick={onSelect}
                className="font-bold text-xs px-4 py-2.5 rounded-full"
                style={{ background: club.color, color: "white", textDecoration: "none" }}>
                Enter →
              </button>
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
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);
  const [selectedWorld, setSelectedWorld] = useState<World | null>(null);

  const q = query.toLowerCase();
  const filtered = q
    ? CLUBS.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.vibe.toLowerCase().includes(q) ||
        c.tags.some(t => t.toLowerCase().includes(q))
      )
    : CLUBS;

  const featured = CLUBS[0];
  const rest = filtered.filter(c => c.id !== 0);
  const ranked = [...CLUBS].sort((a, b) => b.women - a.women);
  const myClubs = CLUBS.filter(c => joined.has(c.id) || requested.has(c.id));

  const handleSelectClub = (club: Club) => {
    setSelectedClub(club);
    setSelectedWorld(null);
  };

  // ── World Entry view ──
  if (selectedWorld && selectedClub) {
    return (
      <WorldEntryPage
        world={selectedWorld}
        club={selectedClub}
        onBack={() => setSelectedWorld(null)}
      />
    );
  }

  // ── Club Detail view ──
  if (selectedClub) {
    return (
      <ClubDetailPage
        club={selectedClub}
        onBack={() => setSelectedClub(null)}
        onEnterWorld={w => setSelectedWorld(w)}
      />
    );
  }

  // ── Main listing ──
  return (
    <div className="min-h-screen pb-24 md:pb-10" style={{ background: "var(--pale-pink-bg)" }}>

      {/* ── Header ── */}
      <div className="px-5 pt-12 pb-4 md:px-8 md:pt-8">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-[10px] font-bold tracking-widest uppercase mb-1" style={{ color: "#FF1F7D" }}>BLOOMBAY</p>
            <h1 className="text-4xl font-bold italic leading-none" style={{ fontFamily: "var(--font-playfair)", color: "var(--heading-color, #111111)" }}>
              Club House
            </h1>
            <p className="text-sm mt-1.5" style={{ fontFamily: "var(--font-instrument)", fontStyle: "italic", color: "#bbb" }}>
              {CLUBS.length} circles · {CLUBS.reduce((a, c) => a + c.women, 0).toLocaleString()} women
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

        {/* Search */}
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

        {/* Tabs */}
        <div className="flex items-center gap-2">
          {["DISCOVER"].map((label, i) => (
            <button key={i} onClick={() => setActiveTab(i)}
              className="px-4 py-2 rounded-full text-xs font-bold tracking-wider whitespace-nowrap transition-all"
              style={activeTab === i
                ? { background: "#111111", color: "white" }
                : { background: "white", color: "#888", border: "1.5px solid #E8E8E8" }}>
              {label}
            </button>
          ))}
          <Link href="/member/lounge"
            className="px-4 py-2 rounded-full text-xs font-bold tracking-wider whitespace-nowrap transition-all"
            style={{ background: "white", color: "#888", border: "1.5px solid #E8E8E8" }}>
            MY PASSPORT →
          </Link>
        </div>
      </div>

      <div className="px-5 pb-8 md:px-8 md:max-w-[820px] md:mx-auto">

        {/* ── DISCOVER ── */}
        {activeTab === 0 && (
          <div className="flex flex-col gap-5">
            <YandeRec />

            {/* Featured door */}
            {(!q || featured.name.toLowerCase().includes(q)) && (
              <FeaturedDoor club={featured} onSelect={() => handleSelectClub(featured)} />
            )}

            {/* Club list */}
            <div>
              <p className="text-[10px] font-bold tracking-widest uppercase mb-3" style={{ color: "#bbb" }}>
                {q ? `${filtered.length} clubs` : "ALL CLUBS"}
              </p>
              <div className="grid grid-cols-2 gap-3">
                {rest.map(club => (
                  <ClubCoverCard
                    key={club.id}
                    club={club}
                    isJoined={joined.has(club.id)}
                    onSelect={() => handleSelectClub(club)}
                  />
                ))}
                {rest.length === 0 && (
                  <div className="col-span-2 py-12 text-center rounded-2xl" style={{ background: "white" }}>
                    <p className="text-sm italic" style={{ fontFamily: "var(--font-instrument)", color: "#bbb" }}>
                      No clubs match that search.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Club Board */}
            {!q && (
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <p className="text-[10px] font-bold tracking-widest uppercase" style={{ color: "#bbb" }}>CLUB BOARD</p>
                  <div className="flex-1 h-px" style={{ background: "rgba(0,0,0,0.06)" }} />
                  <p style={{ fontFamily: "var(--font-caveat)", fontSize: "13px", color: "#bbb" }}>ranked by the city</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {ranked.map((club, i) => (
                    <BoardRow key={club.id} club={club} rank={i + 1} onSelect={() => handleSelectClub(club)} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Passport has moved to your Lounge profile */}
      </div>

      <style>{`
        @keyframes clubShake {
          0%, 85%, 100% { transform: translateX(0) rotate(0deg); }
          87% { transform: translateX(-3px) rotate(-0.8deg); }
          89% { transform: translateX(3px) rotate(0.8deg); }
          91% { transform: translateX(-2px) rotate(-0.4deg); }
          93% { transform: translateX(2px) rotate(0.4deg); }
          95% { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
