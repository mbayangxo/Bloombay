"use client";
import { useState, useRef } from "react";
import Link from "next/link";
import { BBLogo } from "./bb-logo";

const PINK = "#FF1F7D";

// ── Types ─────────────────────────────────────────────────────────────────────

interface ZonePost {
  id: string;
  author: { initial: string; name: string; color: string; role?: string };
  text: string;
  time: string;
  reactions: { emoji: string; count: number }[];
  replies: number;
  isPromptResponse?: boolean;
}

interface ZoneResource {
  id: string;
  type: "article" | "podcast" | "book" | "link" | "video";
  title: string;
  source?: string;
  saves: number;
  pinnedByMama?: boolean;
}

interface ZoneEvent {
  id: string;
  title: string;
  date: string;
  location?: string;
  seats: number;
  going: number;
  zoneOnly?: boolean;
}

interface ZoneData {
  id: string;
  clubName: string;
  name: string;
  emoji: string;
  color: string;
  darkColor: string;
  desc: string;
  memberCount: number;
  activeThisWeek: number;
  weeklyPrompt: { question: string; week: string; responses: number; postedBy: string };
  posts: ZonePost[];
  resources: ZoneResource[];
  events: ZoneEvent[];
  moderator: { initial: string; name: string; color: string };
}

// ── Mock data ─────────────────────────────────────────────────────────────────

const ZONE_MOCK: Record<string, ZoneData> = {
  z1: {
    id: "z1",
    clubName: "Museum Girls",
    name: "Slow Art Sundays",
    emoji: "🎨",
    color: "#7C3AED",
    darkColor: "#2D1B69",
    desc: "Unhurried Sunday gallery visits. No agenda, just looking.",
    memberCount: 48,
    activeThisWeek: 22,
    weeklyPrompt: {
      question: "What's one artwork you couldn't stop thinking about this week — and why?",
      week: "Week of May 19",
      responses: 14,
      postedBy: "Yande O.",
    },
    posts: [
      {
        id: "p1", author: { initial: "A", name: "Aminah C.", color: PINK },
        text: "The Degas pastel drawings at the Met — I never realized how textured they are in person. The photograph simply doesn't do it justice. I stood in front of one for 20 minutes and I think it changed something in me.",
        time: "2h ago", reactions: [{ emoji: "♡", count: 8 }, { emoji: "✦", count: 3 }], replies: 4, isPromptResponse: true,
      },
      {
        id: "p2", author: { initial: "K", name: "Kelechi O.", color: "#FF69B4" },
        text: "I finally did a 30-minute sit with one painting at the Frick — the Vermeer in the West Gallery. I noticed things I had never seen in 10 previous visits. Slow looking genuinely changes how you see. It's not a technique, it's a practice.",
        time: "4h ago", reactions: [{ emoji: "♡", count: 11 }, { emoji: "✦", count: 5 }], replies: 7, isPromptResponse: true,
      },
      {
        id: "p3", author: { initial: "B", name: "Bea T.", color: "#FF69B4" },
        text: "Anyone going to the Hopper show at the Whitney this Sunday? I heard they're doing a special early morning opening for members 🌅",
        time: "Yesterday", reactions: [{ emoji: "♡", count: 5 }], replies: 3,
      },
      {
        id: "p4", author: { initial: "Y", name: "Yande O.", color: PINK, role: "Moderator" },
        text: "Reminder: this Sunday's zone outing is at the Neue Galerie. We have 6 spots left — first come first in. This one is special: Klimt and coffee after. See you all there 🌸",
        time: "Yesterday", reactions: [{ emoji: "♡", count: 14 }, { emoji: "✦", count: 6 }], replies: 8,
      },
    ],
    resources: [
      { id: "r1", type: "article", title: "The Art of Slow Looking — How to See More in Museums", source: "The New Yorker", saves: 31, pinnedByMama: true },
      { id: "r2", type: "podcast", title: "The Lonely Palette — Making Art History Accessible", source: "Spotify Podcast", saves: 18 },
      { id: "r3", type: "article", title: "10 NYC Galleries Worth a Slow Solo Visit", source: "Artsy", saves: 24 },
      { id: "r4", type: "book", title: "Ways of Seeing — John Berger", source: "Penguin Modern Classics", saves: 15, pinnedByMama: true },
      { id: "r5", type: "link", title: "Frick Collection — Free Admission Days Guide", source: "frick.org", saves: 29 },
      { id: "r6", type: "video", title: "How to Look at Abstract Art — MoMA Guide", source: "YouTube · MoMA", saves: 12 },
    ],
    events: [
      { id: "e1", title: "Neue Galerie · Klimt + Coffee", date: "Sun, May 25 · 10:00 AM", location: "1048 Fifth Ave, New York", seats: 6, going: 9, zoneOnly: true },
      { id: "e2", title: "Slow Sunday at The Frick", date: "Sun, Jun 1 · 11:00 AM", location: "1 E 70th St, New York", seats: 8, going: 5, zoneOnly: true },
      { id: "e3", title: "Member Evening at The Armory Show", date: "Fri, Jun 6 · 6:00 PM", location: "Javits Center, NYC", seats: 12, going: 18 },
    ],
    moderator: { initial: "Y", name: "Yande O.", color: PINK },
  },
  z2: {
    id: "z2",
    clubName: "Museum Girls",
    name: "After Dark Openings",
    emoji: "🌙",
    color: "#0EA5E9",
    darkColor: "#0C2240",
    desc: "Evening preview openings and gallery events. Members-only access.",
    memberCount: 22,
    activeThisWeek: 15,
    weeklyPrompt: {
      question: "Which gallery opening this month surprised you most — and what made it unforgettable?",
      week: "Week of May 19",
      responses: 9,
      postedBy: "Yande O.",
    },
    posts: [
      {
        id: "p1", author: { initial: "T", name: "Temi A.", color: "#6b4fa0" },
        text: "The Gagosian opening Tuesday was incredible. The space was everything — and the work! I ended up in conversation with one of the artists for over an hour. That never happens at larger shows.",
        time: "3h ago", reactions: [{ emoji: "♡", count: 9 }, { emoji: "✦", count: 4 }], replies: 5, isPromptResponse: true,
      },
      {
        id: "p2", author: { initial: "F", name: "Fatima A.", color: PINK },
        text: "Pace Gallery has a members-only champagne preview Thursday evening. I have one spare ticket — who's joining me? DM me now 🥂",
        time: "1h ago", reactions: [{ emoji: "♡", count: 6 }], replies: 10,
      },
    ],
    resources: [
      { id: "r1", type: "link", title: "NYC Gallery Opening Calendar — May 2025", source: "Artsy Events", saves: 22, pinnedByMama: true },
      { id: "r2", type: "article", title: "How to Work a Gallery Opening — A Social Guide", source: "Harper's BAZAAR", saves: 14 },
      { id: "r3", type: "podcast", title: "Art Basel Conversations — Season 4", source: "Spotify Podcast", saves: 9 },
    ],
    events: [
      { id: "e1", title: "Pace Gallery Members Preview", date: "Thu, May 22 · 7:00 PM", location: "510 W 25th St, Chelsea", seats: 4, going: 7, zoneOnly: true },
      { id: "e2", title: "David Zwirner Opening Night", date: "Fri, May 30 · 6:30 PM", location: "525 W 19th St, Chelsea", seats: 6, going: 8, zoneOnly: true },
    ],
    moderator: { initial: "Y", name: "Yande O.", color: PINK },
  },
  z3: {
    id: "z3",
    clubName: "Museum Girls",
    name: "Museum + Lunch",
    emoji: "🥗",
    color: "#16A34A",
    darkColor: "#0D2B1E",
    desc: "Art followed by a long lunch. Culture + food, always together.",
    memberCount: 35,
    activeThisWeek: 18,
    weeklyPrompt: {
      question: "Best post-museum restaurant you've been to lately — what was on the menu and did it match the vibe of the show?",
      week: "Week of May 19",
      responses: 11,
      postedBy: "Yande O.",
    },
    posts: [
      {
        id: "p1", author: { initial: "O", name: "Olivia K.", color: "#3e7c6b" },
        text: "After the Hockney show we went to Cafe Sabarsky downstairs at the Neue Galerie. The schnitzel and the Viennese torte — I'm not over it. Art + food as one unified experience.",
        time: "5h ago", reactions: [{ emoji: "♡", count: 12 }, { emoji: "✦", count: 4 }], replies: 6, isPromptResponse: true,
      },
    ],
    resources: [
      { id: "r1", type: "link", title: "Best Museum Cafes in NYC — Ranked", source: "Eater New York", saves: 38, pinnedByMama: true },
      { id: "r2", type: "article", title: "How to Pair Art + Food for the Perfect Cultural Day", source: "Bon Appétit", saves: 17 },
    ],
    events: [
      { id: "e1", title: "Whitney + The Beatrice Inn Lunch", date: "Sat, May 24 · 12:00 PM", location: "The Whitney, then 285 W 12th", seats: 7, going: 11, zoneOnly: true },
    ],
    moderator: { initial: "Y", name: "Yande O.", color: PINK },
  },
  z4: {
    id: "z4",
    clubName: "Museum Girls",
    name: "Collectors Corner",
    emoji: "🖼️",
    color: "#B45309",
    darkColor: "#3B1A02",
    desc: "For the girls seriously exploring art collecting and acquisition.",
    memberCount: 11,
    activeThisWeek: 9,
    weeklyPrompt: {
      question: "If you had $5,000 to spend on your first (or next) piece, what would you look for and where would you start?",
      week: "Week of May 19",
      responses: 7,
      postedBy: "Yande O.",
    },
    posts: [
      {
        id: "p1", author: { initial: "C", name: "Chidera L.", color: "#0EA5E9" },
        text: "Started working with a private dealer last month — the access is completely different. She shows me things before they hit any fair. If you're serious about collecting and not just buying art, find a dealer who believes in your eye.",
        time: "6h ago", reactions: [{ emoji: "♡", count: 7 }, { emoji: "✦", count: 5 }], replies: 9, isPromptResponse: true,
      },
    ],
    resources: [
      { id: "r1", type: "book", title: "The $12 Million Stuffed Shark — The Curious Economics of Art", source: "Don Thompson", saves: 14, pinnedByMama: true },
      { id: "r2", type: "article", title: "How to Start Collecting Art Under $5,000", source: "Artsy Editorial", saves: 21 },
      { id: "r3", type: "link", title: "Artsy Price Database — See What Work Has Sold For", source: "artsy.net", saves: 16, pinnedByMama: true },
    ],
    events: [
      { id: "e1", title: "Private Dealer Studio Visit", date: "Wed, May 28 · 5:00 PM", location: "Location shared with members", seats: 5, going: 4, zoneOnly: true },
    ],
    moderator: { initial: "Y", name: "Yande O.", color: PINK },
  },
};

const FALLBACK_ZONE = ZONE_MOCK.z1;

const RESOURCE_ICONS: Record<ZoneResource["type"], string> = {
  article: "📄",
  podcast: "🎧",
  book: "📖",
  link: "🔗",
  video: "🎬",
};

// ── Main component ────────────────────────────────────────────────────────────

type ZoneTab = "feed" | "resources" | "events";

export function ZoneInteriorPage({ clubId = "", zoneId = "z1" }: { clubId?: string; zoneId?: string }) {
  const zone = ZONE_MOCK[zoneId] ?? FALLBACK_ZONE;
  const [tab, setTab] = useState<ZoneTab>("feed");
  const [saved, setSaved] = useState<Set<string>>(new Set());
  const [liked, setLiked] = useState<Set<string>>(new Set());
  const [respondingToPrompt, setRespondingToPrompt] = useState(false);
  const [promptResponse, setPromptResponse] = useState("");
  const [promptSubmitted, setPromptSubmitted] = useState(false);
  const [postInput, setPostInput] = useState("");
  const [showCompose, setShowCompose] = useState(false);
  const [composeImage, setComposeImage] = useState<string | null>(null);
  const composeFileRef = useRef<HTMLInputElement | null>(null);

  function toggleSave(id: string) {
    setSaved(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }
  function toggleLike(id: string) {
    setLiked(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }
  function submitPromptResponse() {
    if (!promptResponse.trim()) return;
    setPromptSubmitted(true);
    setTimeout(() => {
      setRespondingToPrompt(false);
      setPromptResponse("");
      setPromptSubmitted(false);
    }, 1800);
  }

  function parseDatePill(dateStr: string) {
    const parts = dateStr.split(/[\s,]+/).filter(Boolean);
    return { month: (parts[1] ?? "").toUpperCase().slice(0, 3), day: parts[2] ?? "" };
  }

  return (
    <div style={{ background: "#F7F7F7", minHeight: "100vh", fontFamily: "var(--font-jost)" }}>

      {/* ── ZONE HEADER ── */}
      <div style={{ background: `linear-gradient(155deg, ${zone.darkColor} 0%, ${zone.color} 100%)`, padding: "52px 20px 36px", position: "relative", overflow: "hidden" }}>
        {/* Nav */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, padding: "12px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", zIndex: 10 }}>
          <Link href={`/member/clubs/${clubId}`} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.65)", textDecoration: "none" }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 11.5L4.5 7 9 2.5" stroke="rgba(255,255,255,0.65)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
            {zone.clubName}
          </Link>
          <BBLogo size={26} light />
        </div>

        {/* Decorative orbs */}
        <div style={{ position: "absolute", top: -50, right: -50, width: 180, height: 180, borderRadius: "50%", background: "rgba(255,255,255,0.06)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -40, left: -30, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.05)", pointerEvents: "none" }} />

        {/* Zone identity */}
        <div style={{ textAlign: "center", position: "relative", zIndex: 2 }}>
          <div style={{ fontSize: 52, lineHeight: 1, marginBottom: 12, filter: "drop-shadow(0 4px 16px rgba(0,0,0,0.35))" }}>{zone.emoji}</div>
          <h1 style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 700, fontSize: "clamp(22px,7vw,32px)", color: "white", lineHeight: 1.12, margin: "0 0 6px" }}>{zone.name}</h1>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 20 }}>
            {zone.clubName} <span style={{ opacity: 0.4 }}>·</span> zone
          </p>

          {/* Stats row */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: 0, background: "rgba(0,0,0,0.25)", borderRadius: 20, overflow: "hidden" }}>
            {[
              { value: zone.memberCount, label: "members" },
              { value: zone.activeThisWeek, label: "active" },
              { value: zone.weeklyPrompt.responses, label: "responses" },
            ].map((stat, i) => (
              <div key={i} style={{ padding: "8px 18px", borderRight: i < 2 ? "1px solid rgba(255,255,255,0.15)" : "none", textAlign: "center" }}>
                <p style={{ fontSize: 18, fontWeight: 700, color: "white", lineHeight: 1 }}>{stat.value}</p>
                <p style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.1em", color: "rgba(255,255,255,0.45)", marginTop: 2 }}>{stat.label.toUpperCase()}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── TAB BAR ── */}
      <div style={{ display: "flex", background: "white", borderBottom: "1px solid rgba(0,0,0,0.07)", position: "sticky", top: 0, zIndex: 20, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
        {(["feed", "resources", "events"] as ZoneTab[]).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ flex: 1, padding: "13px 0", fontSize: 13, fontWeight: 600, border: "none", background: "none", cursor: "pointer", borderBottom: tab === t ? `2.5px solid ${zone.color}` : "2.5px solid transparent", color: tab === t ? zone.color : "rgba(0,0,0,0.35)" }}>
            {t === "feed" ? "Feed" : t === "resources" ? "Resources" : "Events"}
          </button>
        ))}
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          FEED TAB
      ══════════════════════════════════════════════════════════════════ */}
      {tab === "feed" && (
        <div style={{ padding: "20px 20px 110px", display: "flex", flexDirection: "column", gap: 14 }}>

          {/* Weekly Prompt card */}
          <div style={{ background: "#FFFBEB", border: "1.5px solid #FDE68A", borderRadius: 22, padding: "18px 18px 16px", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: 3, background: `linear-gradient(90deg, ${zone.color}, ${PINK})` }} />
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <div style={{ background: zone.color, borderRadius: 8, padding: "3px 9px" }}>
                <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", color: "white" }}>WEEKLY PROMPT</span>
              </div>
              <span style={{ fontSize: 10, color: "rgba(0,0,0,0.38)" }}>{zone.weeklyPrompt.week}</span>
            </div>
            <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 15, color: "#1C1B1C", lineHeight: 1.65, marginBottom: 14 }}>
              &ldquo;{zone.weeklyPrompt.question}&rdquo;
            </p>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
              <p style={{ fontSize: 11, color: "rgba(0,0,0,0.42)" }}>
                {promptSubmitted ? zone.weeklyPrompt.responses + 1 : zone.weeklyPrompt.responses} responses · by {zone.weeklyPrompt.postedBy}
              </p>
              <button onClick={() => setRespondingToPrompt(true)} style={{ padding: "7px 16px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: zone.color, color: "white", border: "none", cursor: "pointer", boxShadow: `0 2px 10px ${zone.color}44` }}>
                {promptSubmitted ? "Responded ✓" : "Share your take →"}
              </button>
            </div>
          </div>

          {/* Moderator info row */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", background: "white", borderRadius: 16, boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: zone.moderator.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "white", flexShrink: 0 }}>{zone.moderator.initial}</div>
            <div style={{ flex: 1 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#111" }}>{zone.moderator.name} </span>
              <span style={{ fontSize: 10, color: "rgba(0,0,0,0.38)" }}>runs this zone</span>
            </div>
            <button style={{ padding: "5px 12px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: `${zone.color}12`, color: zone.color, border: "none", cursor: "pointer" }}>Say hi</button>
          </div>

          {/* Section label */}
          <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", color: "rgba(0,0,0,0.28)", paddingLeft: 2 }}>RECENT ACTIVITY</p>

          {/* Posts */}
          {zone.posts.map(post => (
            <div key={post.id} style={{ background: "white", borderRadius: 20, padding: "16px 18px", boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}>
              {/* Post header */}
              <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: `radial-gradient(circle at 35% 35%, ${post.author.color}, ${post.author.color}99)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "white", flexShrink: 0 }}>{post.author.initial}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#111" }}>{post.author.name}</span>
                    {post.author.role && (
                      <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 7px", borderRadius: 20, background: `${zone.color}15`, color: zone.color }}>
                        {post.author.role.toUpperCase()}
                      </span>
                    )}
                    {post.isPromptResponse && (
                      <span style={{ fontSize: 9, fontWeight: 600, padding: "2px 7px", borderRadius: 20, background: "#FFFBEB", color: "#B45309" }}>prompt</span>
                    )}
                  </div>
                  <p style={{ fontSize: 10, color: "rgba(0,0,0,0.35)", marginTop: 2 }}>{post.time}</p>
                </div>
              </div>

              {/* Post text */}
              <p style={{ fontSize: 13, color: "rgba(0,0,0,0.72)", lineHeight: 1.7, marginBottom: 14 }}>{post.text}</p>

              {/* Reactions + replies */}
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {post.reactions.map(r => (
                  <button key={r.emoji} onClick={() => toggleLike(`${post.id}-${r.emoji}`)} style={{ display: "flex", alignItems: "center", gap: 4, padding: "5px 12px", borderRadius: 20, border: "none", cursor: "pointer", background: liked.has(`${post.id}-${r.emoji}`) ? `${zone.color}15` : "rgba(0,0,0,0.04)", color: liked.has(`${post.id}-${r.emoji}`) ? zone.color : "rgba(0,0,0,0.42)", fontSize: 12, fontWeight: 600, transition: "all 0.15s" }}>
                    {r.emoji} {liked.has(`${post.id}-${r.emoji}`) ? r.count + 1 : r.count}
                  </button>
                ))}
                <button style={{ display: "flex", alignItems: "center", gap: 5, marginLeft: "auto", fontSize: 12, fontWeight: 600, color: "rgba(0,0,0,0.32)", background: "none", border: "none", cursor: "pointer", padding: "5px 0" }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                  {post.replies}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          RESOURCES TAB
      ══════════════════════════════════════════════════════════════════ */}
      {tab === "resources" && (
        <div style={{ padding: "20px 20px 110px" }}>
          <div style={{ marginBottom: 16 }}>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", color: zone.color }}>ZONE RESOURCES</p>
            <p style={{ fontSize: 11, color: "rgba(0,0,0,0.4)", marginTop: 3 }}>Curated for this zone · save what resonates</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {zone.resources.map(r => (
              <div key={r.id} style={{ background: "white", borderRadius: 18, padding: "14px 14px 12px", boxShadow: "0 1px 6px rgba(0,0,0,0.05)", position: "relative", display: "flex", flexDirection: "column" }}>
                {r.pinnedByMama && (
                  <div style={{ position: "absolute", top: 10, right: 10, fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 10, background: `${zone.color}15`, color: zone.color }}>PINNED</div>
                )}
                <div style={{ fontSize: 24, marginBottom: 8, lineHeight: 1 }}>{RESOURCE_ICONS[r.type]}</div>
                <p style={{ fontSize: 12, fontWeight: 700, color: "#111", lineHeight: 1.45, marginBottom: 4, flex: 1 }}>{r.title}</p>
                {r.source && <p style={{ fontSize: 10, color: "rgba(0,0,0,0.38)", marginBottom: 10 }}>{r.source}</p>}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto" }}>
                  <span style={{ fontSize: 10, color: "rgba(0,0,0,0.32)" }}>{saved.has(r.id) ? r.saves + 1 : r.saves} saved</span>
                  <button onClick={() => toggleSave(r.id)} style={{ width: 30, height: 30, borderRadius: "50%", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", background: saved.has(r.id) ? `${zone.color}15` : "#F5F5F5", transition: "all 0.15s" }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill={saved.has(r.id) ? zone.color : "none"} stroke={saved.has(r.id) ? zone.color : "#999"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" /></svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════
          EVENTS TAB
      ══════════════════════════════════════════════════════════════════ */}
      {tab === "events" && (
        <div style={{ padding: "20px 20px 110px", display: "flex", flexDirection: "column", gap: 12 }}>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", color: zone.color, marginBottom: 2 }}>ZONE EVENTS</p>

          {zone.events.map(event => {
            const { month, day } = parseDatePill(event.date);
            return (
              <div key={event.id} style={{ background: "white", borderRadius: 20, padding: "16px 18px", boxShadow: "0 1px 6px rgba(0,0,0,0.05)", display: "flex", gap: 14, alignItems: "flex-start" }}>
                <div style={{ flexShrink: 0, width: 46, background: zone.color, display: "flex", flexDirection: "column", alignItems: "center", padding: "6px 0 8px", borderRadius: 14 }}>
                  <span style={{ fontSize: 7, fontWeight: 700, letterSpacing: "0.08em", color: "rgba(255,255,255,0.75)" }}>{month}</span>
                  <span style={{ fontSize: 22, fontWeight: 700, color: "white", lineHeight: 1.1 }}>{day}</span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                    <p style={{ fontSize: 13, fontWeight: 700, color: "#111" }}>{event.title}</p>
                    {event.zoneOnly && (
                      <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 7px", borderRadius: 20, background: `${zone.color}15`, color: zone.color }}>ZONE ONLY</span>
                    )}
                  </div>
                  {event.location && <p style={{ fontSize: 11, color: "rgba(0,0,0,0.4)", marginBottom: 4 }}>{event.location}</p>}
                  <p style={{ fontSize: 11, fontWeight: 600, color: "rgba(0,0,0,0.5)" }}>
                    {event.going} going · <span style={{ color: event.seats <= 5 ? "#EF4444" : "inherit" }}>{event.seats} seats left</span>
                  </p>
                </div>
                <button style={{ flexShrink: 0, padding: "8px 16px", borderRadius: 20, fontSize: 12, fontWeight: 700, color: "white", background: zone.color, border: "none", cursor: "pointer", boxShadow: `0 2px 8px ${zone.color}44` }}>RSVP</button>
              </div>
            );
          })}
        </div>
      )}

      {/* ── COMPOSE FAB ── */}
      {tab === "feed" && (
        <div style={{ position: "fixed", bottom: 90, right: 20, zIndex: 30 }}>
          <button onClick={() => setShowCompose(true)} style={{ width: 52, height: 52, borderRadius: "50%", background: zone.color, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 4px 20px ${zone.color}55` }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
          </button>
        </div>
      )}

      {/* ── PROMPT RESPONSE MODAL ── */}
      {respondingToPrompt && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50, background: "rgba(0,0,0,0.55)", display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
          <div style={{ width: "100%", maxWidth: 448, background: "white", borderRadius: "26px 26px 0 0", padding: "26px 24px 40px" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 18 }}>
              <div style={{ flex: 1, paddingRight: 12 }}>
                <div style={{ display: "inline-flex", background: zone.color, borderRadius: 8, padding: "3px 9px", marginBottom: 10 }}>
                  <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", color: "white" }}>WEEKLY PROMPT</span>
                </div>
                <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 14, color: "#111", lineHeight: 1.55 }}>
                  &ldquo;{zone.weeklyPrompt.question}&rdquo;
                </p>
              </div>
              <button onClick={() => setRespondingToPrompt(false)} style={{ width: 32, height: 32, borderRadius: "50%", border: "none", background: "#F0F0F0", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M1 1l10 10M11 1L1 11" stroke="#888" strokeWidth="1.8" strokeLinecap="round" /></svg>
              </button>
            </div>

            {promptSubmitted ? (
              <div style={{ textAlign: "center", padding: "24px 0" }}>
                <div style={{ fontSize: 36, marginBottom: 10 }}>🌸</div>
                <p style={{ fontWeight: 700, fontSize: 16, color: "#111", fontFamily: "var(--font-playfair)", fontStyle: "italic" }}>Response shared!</p>
                <p style={{ fontSize: 13, color: "rgba(0,0,0,0.42)", marginTop: 5 }}>Your zone can see it now.</p>
              </div>
            ) : (
              <>
                <textarea
                  rows={5}
                  value={promptResponse}
                  onChange={e => setPromptResponse(e.target.value)}
                  placeholder="Share your thoughts with the zone…"
                  style={{ width: "100%", background: "#F8F8F8", borderRadius: 18, padding: "14px 16px", fontSize: 14, lineHeight: 1.65, outline: "none", border: `2px solid ${promptResponse ? zone.color : "transparent"}`, resize: "none", color: "#111", boxSizing: "border-box" }}
                  onFocus={e => (e.target.style.borderColor = zone.color)}
                  onBlur={e => { if (!promptResponse) e.target.style.borderColor = "transparent"; }}
                />
                <button onClick={submitPromptResponse} disabled={!promptResponse.trim()} style={{ width: "100%", marginTop: 14, padding: "15px 0", borderRadius: 32, fontWeight: 700, fontSize: 14, color: "white", background: zone.color, border: "none", cursor: promptResponse.trim() ? "pointer" : "default", opacity: promptResponse.trim() ? 1 : 0.38, boxShadow: promptResponse.trim() ? `0 4px 16px ${zone.color}44` : "none" }}>
                  Post to Zone →
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── COMPOSE POST MODAL ── */}
      {showCompose && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50, background: "rgba(0,0,0,0.55)", display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
          <div style={{ width: "100%", maxWidth: 448, background: "white", borderRadius: "26px 26px 0 0", padding: "26px 24px 40px" }}>
            <input ref={composeFileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={e => {
              const f = e.target.files?.[0]; if (!f) return;
              const r = new FileReader(); r.onload = ev => { if (ev.target?.result) setComposeImage(ev.target.result as string); }; r.readAsDataURL(f); e.target.value = "";
            }} />
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
              <div>
                <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", color: zone.color, marginBottom: 3 }}>{zone.name.toUpperCase()}</p>
                <h3 style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 700, fontSize: 18, color: "#111" }}>Post to zone</h3>
              </div>
              <button onClick={() => { setShowCompose(false); setComposeImage(null); }} style={{ width: 32, height: 32, borderRadius: "50%", border: "none", background: "#F0F0F0", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M1 1l10 10M11 1L1 11" stroke="#888" strokeWidth="1.8" strokeLinecap="round" /></svg>
              </button>
            </div>
            <textarea
              rows={4}
              value={postInput}
              onChange={e => setPostInput(e.target.value)}
              placeholder={`Share something with ${zone.name}…`}
              style={{ width: "100%", background: "#F8F8F8", borderRadius: 18, padding: "14px 16px", fontSize: 14, lineHeight: 1.65, outline: "none", border: `2px solid ${postInput ? zone.color : "transparent"}`, resize: "none", color: "#111", boxSizing: "border-box" }}
              onFocus={e => (e.target.style.borderColor = zone.color)}
              onBlur={e => { if (!postInput) e.target.style.borderColor = "transparent"; }}
            />
            {/* Photo preview */}
            {composeImage && (
              <div style={{ position: "relative", marginTop: 10, borderRadius: 14, overflow: "hidden", maxHeight: 200 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={composeImage} alt="" style={{ width: "100%", objectFit: "cover", maxHeight: 200, display: "block" }} />
                <button onClick={() => setComposeImage(null)} style={{ position: "absolute", top: 8, right: 8, width: 24, height: 24, borderRadius: "50%", background: "rgba(0,0,0,0.6)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="8" height="8" viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="M1 1l10 10M11 1L1 11"/></svg>
                </button>
              </div>
            )}
            {/* Action row */}
            <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
              <button onClick={() => composeFileRef.current?.click()} style={{ width: 42, height: 42, borderRadius: "50%", border: "none", cursor: "pointer", background: `${zone.color}12`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={zone.color} strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
              </button>
              <button onClick={() => { setShowCompose(false); setPostInput(""); setComposeImage(null); }} disabled={!postInput.trim() && !composeImage} style={{ flex: 1, padding: "13px 0", borderRadius: 32, fontWeight: 700, fontSize: 14, color: "white", background: zone.color, border: "none", cursor: (postInput.trim() || composeImage) ? "pointer" : "default", opacity: (postInput.trim() || composeImage) ? 1 : 0.38 }}>
                Post →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
