"use client";

import React, { useState, use } from "react";
import Link from "next/link";

// ── Design tokens ──────────────────────────────────────────────────────────────
const PINK = "#FF1F7D";
const DARK_GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='160' height='160' fill='%23fff' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`;
const PAPER_TEX  = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch' result='t'/%3E%3CfeColorMatrix type='saturate' values='0' in='t'/%3E%3C/filter%3E%3Crect width='200' height='200' fill='%23000' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E")`;

// ── Demo profiles ──────────────────────────────────────────────────────────────
interface SocialLink { platform: string; handle: string; url: string; color: string }
interface Business { name: string; role: string; tagline: string; accent: string }
interface MoodItem {
  type: "photo" | "quote" | "voice" | "invitation";
  bg?: string;
  span?: "wide" | "tall" | "normal";
  quote?: string;
  author?: string;
  duration?: string;
  label?: string;
  emoji?: string;
  // invitation fields
  invEvent?: string;
  invFrom?: string;
  invDate?: string;
  invColor?: string;
}
interface Moment { location: string; neighborhood: string; caption: string; flowers: number; timeAgo: string; emoji: string; bgColor: string }
interface BloomNote { place: string; neighborhood: string; note: string; rating: number; timeAgo: string; category: "restaurant" | "bar" | "café" | "shop" | "park" | "bookshop" | "gallery" }

interface ProfileData {
  name: string;
  username: string;
  bio: string;
  location: string;
  neighborhood: string;
  coverGradient: string;
  avatarInitials: string;
  avatarGradient: string;
  isFounder: boolean;
  vibes: string[];
  stats: { moments: number; notes: number; saves: number };
  socials: SocialLink[];
  business?: Business;
  moodBoard: MoodItem[];
  moments: Moment[];
  bloomNotes: BloomNote[];
  // personal fields
  age?: number;
  likes?: string[];
  dislikes?: string[];
  favoriteMovies?: string[];
  favoriteTVShows?: string[];
  hobbies?: string[];
}

const PROFILES: Record<string, ProfileData> = {
  "sofia": {
    name: "Sofia",
    username: "sofia",
    bio: "Lover of late dinners, long books, and spontaneous weekends. West Village is my whole personality.",
    location: "New York City",
    neighborhood: "West Village",
    coverGradient: "linear-gradient(155deg, #2A0818 0%, #3A1020 50%, #FF1F7D 100%)",
    avatarInitials: "S",
    avatarGradient: "linear-gradient(135deg, #FF69B4, #FF1F7D)",
    isFounder: true,
    vibes: ["Late dinners", "Books", "Art galleries", "Natural wine"],
    stats: { moments: 34, notes: 12, saves: 87 },
    socials: [
      { platform: "Instagram", handle: "@sofiainyc", url: "#", color: "#E1306C" },
      { platform: "TikTok",    handle: "@sofiaclicks", url: "#", color: "#000000" },
      { platform: "Substack",  handle: "sofiawrites", url: "#", color: "#FF6719" },
    ],
    business: {
      name: "Studio Sofia",
      role: "Creative Director & Photographer",
      tagline: "Branding for women-led businesses. Campaigns, identity, editorial.",
      accent: "#FF1F7D",
    },
    age: 28,
    likes: ["Late dinners", "Serif fonts", "Espresso martinis", "Bookshop browsing", "Sunday markets"],
    dislikes: ["Being late", "Loud restaurants", "Wasted potential", "Small talk"],
    favoriteMovies: ["Portrait of a Lady on Fire", "Amélie", "Lost in Translation", "Licorice Pizza"],
    favoriteTVShows: ["The White Lotus", "The Sopranos", "Girls", "Industry"],
    hobbies: ["Film photography", "Ceramics", "Long walks", "Cooking for friends", "Reading in cafés"],
    moodBoard: [
      { type: "photo", bg: "linear-gradient(135deg, #FFB3D9 0%, #FF7BAC 100%)", span: "wide" },
      { type: "quote", quote: "The world is yours if you just sit still long enough to want it.", span: "normal" },
      { type: "invitation", invEvent: "Girls Dinner · Carbone", invFrom: "Aminah M.", invDate: "Tonight · 7:30 PM", invColor: "#FF69B4", span: "normal" },
      { type: "voice", duration: "0:42", label: "On finding your people in a big city", span: "wide" },
      { type: "photo", bg: "linear-gradient(160deg, #2A0818 0%, #FF1F7D 100%)", span: "tall" },
      { type: "quote", quote: "She wasn't looking for a knight. She was looking for a sword.", span: "normal" },
      { type: "invitation", invEvent: "MoMA + Froyo After", invFrom: "Girl Creatives Club", invDate: "Saturday · 2:00 PM", invColor: "#EC4899", span: "normal" },
      { type: "photo", bg: "linear-gradient(135deg, #C0E8FF 0%, #6BB5F5 100%)", span: "normal" },
    ],
    moments: [
      { location: "Bar Pisellino",    neighborhood: "West Village", caption: "6pm negroni before the crowd arrives.", flowers: 47, timeAgo: "2h",  emoji: "🍸", bgColor: "#FFE8F0" },
      { location: "Café Kitsuné",     neighborhood: "West Village", caption: "Matcha and a manuscript. Perfect morning.", flowers: 61, timeAgo: "1d",  emoji: "🍵", bgColor: "#E8F5E8" },
      { location: "The High Line",    neighborhood: "Chelsea",      caption: "Golden hour always wins.",                 flowers: 83, timeAgo: "3d",  emoji: "🌅", bgColor: "#FFF5E8" },
      { location: "McNally Jackson",  neighborhood: "Nolita",       caption: "Four hours, zero regrets.",                flowers: 38, timeAgo: "5d",  emoji: "📚", bgColor: "#E8E8FF" },
      { location: "Lilia",            neighborhood: "Williamsburg", caption: "The mafaldini. Every time.",               flowers: 112, timeAgo: "1w", emoji: "🍝", bgColor: "#FFF0F5" },
    ],
    bloomNotes: [
      { place: "Bar Pisellino",  neighborhood: "West Village",    note: "The marble bar, the negroni, the energy. Nothing comes close.", rating: 5, timeAgo: "2w",  category: "bar" },
      { place: "Via Carota",     neighborhood: "West Village",    note: "Insalata verde is worth the 45 min wait. No reservations needed.", rating: 5, timeAgo: "1mo", category: "restaurant" },
      { place: "Café Kitsuné",   neighborhood: "West Village",    note: "Sit in the garden with a journal. That's it.", rating: 5, timeAgo: "1mo", category: "café" },
      { place: "Estela",         neighborhood: "Nolita",          note: "Burrata with salsa verde changed my life. Not joking.", rating: 5, timeAgo: "2mo", category: "restaurant" },
      { place: "The Strand",     neighborhood: "Flatiron",        note: "Third floor rare books room. Go alone. Take your time.", rating: 4, timeAgo: "3mo", category: "bookshop" },
      { place: "Bemelmans Bar",  neighborhood: "Upper East Side", note: "Live piano, murals, and old New York in a glass. Unmissable.", rating: 5, timeAgo: "4mo", category: "bar" },
    ],
  },
  "maya": {
    name: "Maya",
    username: "maya",
    bio: "Brooklyn-born. Filmmaker, foodie, forever curious. I review every restaurant I visit. All 200 of them.",
    location: "New York City",
    neighborhood: "Williamsburg",
    coverGradient: "linear-gradient(155deg, #0A1A10 0%, #1A3020 50%, #A8C97A 100%)",
    avatarInitials: "M",
    avatarGradient: "linear-gradient(135deg, #A8C97A, #4A8A3A)",
    isFounder: false,
    vibes: ["Food", "Film", "Running", "Vintage"],
    stats: { moments: 78, notes: 43, saves: 156 },
    socials: [
      { platform: "Instagram", handle: "@maya.eats", url: "#", color: "#E1306C" },
      { platform: "TikTok",    handle: "@mayaeats", url: "#", color: "#000000" },
    ],
    business: {
      name: "Maya Eats",
      role: "Food Writer & Content Creator",
      tagline: "Honest NYC restaurant reviews. No paid placements. Just real food opinions.",
      accent: "#A8C97A",
    },
    age: 31,
    likes: ["Food", "Film", "Natural wine", "Vintage markets", "Running at dawn"],
    dislikes: ["Overpriced mediocre food", "Networking events", "Meal kits"],
    favoriteMovies: ["Babette's Feast", "Julie & Julia", "Chef", "Tampopo"],
    favoriteTVShows: ["The Bear", "Ugly Delicious", "Chef's Table", "Seinfeld"],
    hobbies: ["Restaurant reviewing", "Film photography", "Running", "Vintage thrifting"],
    moodBoard: [
      { type: "photo", bg: "linear-gradient(135deg, #E8FFF0 0%, #A8D898 100%)", span: "wide" },
      { type: "quote", quote: "Eat the expensive pasta. Drink the natural wine. Life is short.", span: "normal" },
      { type: "photo", bg: "linear-gradient(135deg, #FFF5E8 0%, #FFB830 100%)", span: "normal" },
      { type: "voice", duration: "1:04", label: "My top 5 restaurants you've never heard of", span: "wide" },
      { type: "invitation", invEvent: "Pilates + Matcha Morning", invFrom: "Sofia K.", invDate: "Sunday · 9:00 AM", invColor: "#FF1F7D", span: "normal" },
      { type: "quote", quote: "The best meals are the ones you didn't plan.", span: "normal" },
    ],
    moments: [
      { location: "Lilia",          neighborhood: "Williamsburg", caption: "Third time this month. No shame.",          flowers: 92, timeAgo: "1d",  emoji: "🍝", bgColor: "#FFF0F5" },
      { location: "Smorgasburg",    neighborhood: "Williamsburg", caption: "Saturday ritual. Never skipping.",          flowers: 55, timeAgo: "3d",  emoji: "🌮", bgColor: "#E8FFE8" },
      { location: "Russ & Daughters",neighborhood:"Lower East Side","caption":"The appetizing plate. Every. Time.", flowers: 78, timeAgo: "5d",  emoji: "🥯", bgColor: "#FFF5E8" },
    ],
    bloomNotes: [
      { place: "Lilia",          neighborhood: "Williamsburg",   note: "Mafaldini with pink peppercorns is the best pasta in NYC.", rating: 5, timeAgo: "1w",  category: "restaurant" },
      { place: "Marlow & Sons",  neighborhood: "Williamsburg",   note: "Sunday oysters at the bar. The vibe is perfect.",            rating: 5, timeAgo: "2w",  category: "restaurant" },
      { place: "Bonnie's",       neighborhood: "Williamsburg",   note: "Cantonese-American fusion done right. Get everything.",       rating: 4, timeAgo: "1mo", category: "restaurant" },
      { place: "Extra Fancy",    neighborhood: "Williamsburg",   note: "Best oyster happy hour in Brooklyn. $1 oysters until 6.",    rating: 5, timeAgo: "1mo", category: "bar" },
      { place: "Threes Brewing", neighborhood: "Gowanus",        note: "Outdoor space is perfect for a slow afternoon.",             rating: 4, timeAgo: "2mo", category: "bar" },
    ],
  },
};

const DEFAULT_PROFILE: ProfileData = {
  name: "Bloombay Member",
  username: "member",
  bio: "Part of the Bloombay community.",
  location: "New York City",
  neighborhood: "NYC",
  coverGradient: "linear-gradient(155deg, #1A0018 0%, #3A0026 100%)",
  avatarInitials: "B",
  avatarGradient: "linear-gradient(135deg, #FF69B4, #FF1F7D)",
  isFounder: false,
  vibes: [],
  stats: { moments: 0, notes: 0, saves: 0 },
  socials: [],
  moodBoard: [],
  moments: [],
  bloomNotes: [],
};

type Tab = "about" | "board";

// ── Star rating ────────────────────────────────────────────────────────────────
function Stars({ n }: { n: number }) {
  return (
    <span style={{ display: "inline-flex", gap: 2 }}>
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} width="9" height="9" viewBox="0 0 24 24"
          fill={i < n ? "#D4A853" : "none"} stroke="#D4A853" strokeWidth="2">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      ))}
    </span>
  );
}

// ── Mood board item ────────────────────────────────────────────────────────────
function MoodItem({ item }: { item: MoodItem }) {
  if (item.type === "photo") {
    return (
      <div style={{
        gridColumn: item.span === "wide" ? "span 2" : "span 1",
        gridRow: item.span === "tall" ? "span 2" : "span 1",
        borderRadius: 16,
        background: item.bg ?? "#FFE0EE",
        minHeight: item.span === "wide" ? 110 : 120,
        boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
        overflow: "hidden",
        position: "relative",
      }}>
        <div style={{ position: "absolute", inset: 0, background: "rgba(255,255,255,0.06)" }} />
      </div>
    );
  }
  if (item.type === "quote") {
    return (
      <div style={{
        gridColumn: item.span === "wide" ? "span 2" : "span 1",
        borderRadius: 16,
        backgroundImage: PAPER_TEX,
        backgroundSize: "200px 200px",
        backgroundColor: "#FEF8F0",
        padding: "18px 16px",
        boxShadow: "0 4px 16px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.9)",
        border: "1px solid rgba(255,0,144,0.08)",
        display: "flex", flexDirection: "column", justifyContent: "center",
      }}>
        <span style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontWeight: 300, fontSize: 15, color: "#1A0010", lineHeight: 1.5 }}>"{item.quote}"</span>
        {item.author && <span style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 700, color: "rgba(0,0,0,0.3)", letterSpacing: "0.08em", marginTop: 8 }}>— {item.author}</span>}
      </div>
    );
  }
  if (item.type === "invitation") {
    const c = item.invColor ?? PINK;
    return (
      <div style={{
        gridColumn: item.span === "wide" ? "span 2" : "span 1",
        borderRadius: 16,
        backgroundColor: "#FFFFFF",
        padding: "14px 14px 12px",
        boxShadow: `0 4px 20px ${c}22, 0 1px 4px rgba(0,0,0,0.08)`,
        border: `1px solid ${c}20`,
        display: "flex", flexDirection: "column", gap: 8,
        position: "relative", overflow: "hidden",
      }}>
        {/* Top ribbon */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${c}CC, ${c}, ${c}CC)` }} />
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
          {/* Wax seal mini */}
          <div style={{ width: 22, height: 22, borderRadius: "50%", background: `radial-gradient(circle at 38% 32%, ${c}, ${c}99)`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <span style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontWeight: 700, fontSize: 7, color: "white", letterSpacing: -0.5 }}>BB</span>
          </div>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.2em", color: `${c}BB`, textTransform: "uppercase" as const }}>INVITATION</p>
        </div>
        <p style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontWeight: 300, fontSize: 13, color: "#1A0010", lineHeight: 1.2 }}>{item.invEvent}</p>
        <div>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", color: "rgba(0,0,0,0.38)" }}>{item.invDate}</p>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 600, color: c }}>from {item.invFrom}</p>
        </div>
      </div>
    );
  }
  if (item.type === "voice") {
    return (
      <div style={{
        gridColumn: item.span === "wide" ? "span 2" : "span 1",
        borderRadius: 16,
        backgroundImage: DARK_GRAIN,
        backgroundSize: "160px 160px",
        backgroundColor: "#130810",
        padding: "16px 16px",
        border: `1px solid ${PINK}22`,
        boxShadow: `0 4px 20px rgba(0,0,0,0.3)`,
        display: "flex", flexDirection: "column", gap: 10,
      }}>
        {/* Waveform bars */}
        <div style={{ display: "flex", alignItems: "center", gap: 3, height: 28 }}>
          {[14,22,18,30,24,16,28,20,26,18,22,14,24,30,18,22,16,28,20,24].map((h, i) => (
            <div key={i} style={{ width: 3, height: h, borderRadius: 99, background: i < 12 ? PINK : "rgba(255,255,255,0.18)", flexShrink: 0 }} />
          ))}
          <div style={{ marginLeft: 4, width: 22, height: 22, borderRadius: "50%", background: PINK, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="8" height="8" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          </div>
        </div>
        {item.label && <p style={{ fontFamily: "var(--font-jost)", fontSize: "9px", color: "rgba(255,255,255,0.45)", lineHeight: 1.4 }}>{item.label}</p>}
        <span style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 700, color: "rgba(255,255,255,0.22)" }}>{item.duration}</span>
      </div>
    );
  }
  return null;
}

// ── Main page ──────────────────────────────────────────────────────────────────
export default function PublicProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = use(params);
  const profile = PROFILES[username] ?? { ...DEFAULT_PROFILE, name: username.charAt(0).toUpperCase() + username.slice(1), username };
  const [tab, setTab] = useState<Tab>("about");
  const [flowered, setFlowered] = useState<Set<number>>(new Set());

  function toggleFlower(id: number) {
    setFlowered(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  return (
    <div style={{
      backgroundImage: DARK_GRAIN,
      backgroundSize: "160px 160px",
      backgroundColor: "#070007",
      minHeight: "100vh",
      paddingBottom: 120,
    }}>

      {/* ── PHOTO HERO (matches own-view lounge style, no edit controls) ──── */}
      <div style={{ position: "relative", height: 360, overflow: "hidden" }}>
        {/* Cover gradient — uses profile's own gradient */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: `${DARK_GRAIN}, ${profile.coverGradient}`, backgroundSize: "160px 160px, 100% 100%" }} />
        {/* Texture glow */}
        <div style={{ position: "absolute", top: -40, right: -40, width: 180, height: 180, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,31,125,0.22) 0%, transparent 70%)", pointerEvents: "none" }} />

        {/* Back button */}
        <div style={{ position: "absolute", top: "calc(env(safe-area-inset-top, 0px) + 14px)", left: 16, zIndex: 10, display: "flex", gap: 8 }}>
          <Link href="/member/avenue" style={{ textDecoration: "none" }}>
            <div style={{
              background: "rgba(0,0,0,0.4)", backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.14)", borderRadius: 999,
              padding: "6px 13px", display: "flex", alignItems: "center", gap: 6,
            }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
              <span style={{ fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 700, color: "white", letterSpacing: "0.07em" }}>BACK</span>
            </div>
          </Link>
        </div>

        {/* Founding badge — tiny sticker, top-right corner of photo */}
        {profile.isFounder && (
          <div style={{ position: "absolute", top: "calc(env(safe-area-inset-top, 0px) + 54px)", right: 16, zIndex: 10 }}>
            <div style={{ background: "#D4A853", borderRadius: 6, padding: "3px 8px", boxShadow: "0 2px 10px rgba(212,168,83,0.6)" }}>
              <span style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 900, color: "white", letterSpacing: "0.12em", whiteSpace: "nowrap" as const }}>✦ FOUNDING</span>
            </div>
          </div>
        )}

        {/* Large avatar centered in hero */}
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{
            width: 140, height: 140, borderRadius: "50%",
            backgroundImage: `${DARK_GRAIN}, ${profile.avatarGradient}`,
            backgroundSize: "160px 160px, 100% 100%",
            border: "3px solid rgba(255,255,255,0.28)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <span style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontSize: 56, color: "white", fontWeight: 300 }}>{profile.avatarInitials}</span>
          </div>
        </div>

        {/* Name + neighbourhood overlaid at bottom */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          background: "linear-gradient(to top, rgba(7,0,7,0.9) 0%, rgba(7,0,7,0.4) 60%, transparent 100%)",
          padding: "48px 20px 18px",
        }}>
          <h1 style={{
            fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontWeight: 300,
            fontSize: "clamp(36px, 10vw, 52px)", color: "white",
            lineHeight: 0.95, margin: 0, letterSpacing: "-0.01em",
          }}>{profile.name}.</h1>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 700, letterSpacing: "0.18em", color: "rgba(255,255,255,0.45)", marginTop: 8 }}>{profile.neighborhood.toUpperCase()} · NYC</p>
        </div>
      </div>

      {/* ── BIO + VIBES (below hero) ─────────────────────────────────────────── */}
      <div style={{ padding: "20px 20px 0" }}>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: "13px", color: "rgba(255,255,255,0.55)", lineHeight: 1.6, maxWidth: 340, marginBottom: 16 }}>{profile.bio}</p>

        {/* Vibe chips */}
        <div style={{ display: "flex", gap: 7, flexWrap: "wrap" as const, marginBottom: 20 }}>
          {profile.vibes.map(v => (
            <div key={v} style={{ background: "rgba(255,0,144,0.12)", border: "1px solid rgba(255,0,144,0.25)", borderRadius: 999, padding: "4px 12px" }}>
              <span style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 700, color: PINK, letterSpacing: "0.06em" }}>{v}</span>
            </div>
          ))}
        </div>

        {/* Stats row */}
        <div style={{ display: "flex", gap: 0, marginBottom: 20 }}>
          {[
            { val: profile.stats.moments, label: "Moments" },
            { val: profile.stats.notes,   label: "Bloom Notes" },
            { val: profile.stats.saves,   label: "Saves" },
          ].map(({ val, label }, i) => (
            <React.Fragment key={i}>
              {i > 0 && <div style={{ width: 1, background: "rgba(255,255,255,0.08)", margin: "0 20px" }} />}
              <div style={{ textAlign: "center" as const }}>
                <p style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontWeight: 300, fontSize: 26, color: "white", lineHeight: 1 }}>{val}</p>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "7.5px", fontWeight: 700, letterSpacing: "0.1em", color: "rgba(255,255,255,0.3)", marginTop: 2 }}>{label.toUpperCase()}</p>
              </div>
            </React.Fragment>
          ))}
        </div>

        {/* Social links */}
        {profile.socials.length > 0 && (
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" as const, marginBottom: 20 }}>
            {profile.socials.map(s => (
              <a key={s.platform} href={s.url} style={{ textDecoration: "none" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 999, padding: "7px 14px" }}>
                  <span style={{ fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 700, color: "rgba(255,255,255,0.5)", letterSpacing: "0.06em" }}>{s.platform}</span>
                  <span style={{ fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 700, color: s.color === "#000000" ? "rgba(255,255,255,0.7)" : s.color }}>{s.handle}</span>
                </div>
              </a>
            ))}
          </div>
        )}

        {/* Business card */}
        {profile.business && (
          <div style={{
            backgroundImage: DARK_GRAIN,
            backgroundSize: "160px 160px",
            backgroundColor: "#130810",
            borderRadius: 20,
            padding: "18px 18px 16px",
            border: `1px solid ${profile.business.accent}22`,
            boxShadow: `0 6px 28px rgba(0,0,0,0.35), 0 0 0 1px ${profile.business.accent}11`,
            marginBottom: 24,
          }}>
            <div style={{ height: 2, background: `linear-gradient(90deg, ${profile.business.accent}, transparent)`, borderRadius: 99, marginBottom: 14 }} />
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "7.5px", fontWeight: 800, letterSpacing: "0.18em", color: profile.business.accent, marginBottom: 4 }}>HER BUSINESS</p>
            <p style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontWeight: 300, fontSize: 22, color: "white", lineHeight: 1.1, marginBottom: 4 }}>{profile.business.name}</p>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 700, color: "rgba(255,255,255,0.45)", letterSpacing: "0.04em", marginBottom: 10 }}>{profile.business.role}</p>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "11px", color: "rgba(255,255,255,0.4)", lineHeight: 1.6 }}>{profile.business.tagline}</p>
          </div>
        )}
      </div>

      {/* ── ABOUT / BOARD TOGGLE ─────────────────────────────────────────────── */}
      <div style={{
        display: "flex", borderBottom: "1px solid rgba(255,255,255,0.07)",
        position: "sticky", top: 0, zIndex: 40,
        backgroundColor: "rgba(7,0,7,0.94)", backdropFilter: "blur(12px)",
        padding: "0 20px",
      }}>
        {(["about", "board"] as Tab[]).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            flex: 1, padding: "14px 0 12px", background: "none", border: "none", cursor: "pointer",
            borderBottom: `2.5px solid ${tab === t ? PINK : "transparent"}`,
            WebkitTapHighlightColor: "transparent",
          }}>
            <span style={{
              fontFamily: "var(--font-jost)", fontSize: "10px", fontWeight: 800,
              letterSpacing: "0.12em", textTransform: "uppercase" as const,
              color: tab === t ? PINK : "rgba(255,255,255,0.25)",
            }}>
              {t === "about" ? "About" : "Her Board"}
            </span>
          </button>
        ))}
      </div>

      <div style={{ padding: "22px 16px 0" }}>

        {/* ── ABOUT TAB ────────────────────────────────────────────────────────── */}
        {tab === "about" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

            {/* Bio */}
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "13px", color: "rgba(255,255,255,0.6)", lineHeight: 1.7 }}>{profile.bio}</p>

            {/* Vibes */}
            {profile.vibes.length > 0 && (
              <div>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, letterSpacing: "0.16em", color: "rgba(255,255,255,0.28)", marginBottom: 10 }}>WHAT SHE'S INTO</p>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" as const }}>
                  {profile.vibes.map(v => (
                    <div key={v} style={{ background: "rgba(255,0,144,0.1)", border: "1px solid rgba(255,0,144,0.22)", borderRadius: 999, padding: "6px 14px" }}>
                      <span style={{ fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 700, color: PINK }}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Likes */}
            {profile.likes && profile.likes.length > 0 && (
              <div>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, letterSpacing: "0.16em", color: "rgba(255,255,255,0.28)", marginBottom: 8 }}>SHE LOVES</p>
                <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 6 }}>
                  {profile.likes.map(l => (
                    <div key={l} style={{ background: "rgba(255,0,144,0.08)", border: "1px solid rgba(255,0,144,0.18)", borderRadius: 999, padding: "5px 12px" }}>
                      <span style={{ fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 600, color: PINK }}>✦ {l}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Hobbies */}
            {profile.hobbies && profile.hobbies.length > 0 && (
              <div>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, letterSpacing: "0.16em", color: "rgba(255,255,255,0.28)", marginBottom: 8 }}>HOBBIES</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                  {profile.hobbies.map((h, i) => (
                    <div key={h} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 700, color: "rgba(255,0,144,0.5)", minWidth: 14, textAlign: "right" as const }}>{String(i + 1).padStart(2, "0")}</span>
                      <span style={{ fontFamily: "var(--font-jost)", fontSize: "11px", color: "rgba(255,255,255,0.55)" }}>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Social links */}
            {profile.socials.length > 0 && (
              <div>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, letterSpacing: "0.16em", color: "rgba(255,255,255,0.28)", marginBottom: 10 }}>FIND HER</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {profile.socials.map(s => (
                    <a key={s.platform} href={s.url} style={{ textDecoration: "none" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", backgroundImage: DARK_GRAIN, backgroundSize: "160px 160px", backgroundColor: "#130810", borderRadius: 14, padding: "13px 16px", border: "1px solid rgba(255,255,255,0.06)" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ width: 28, height: 28, borderRadius: "50%", background: `${s.color === "#000000" ? "#222" : s.color}22`, border: `1px solid ${s.color === "#000000" ? "#444" : s.color}44`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <span style={{ fontSize: 11 }}>{s.platform === "Instagram" ? "📸" : s.platform === "TikTok" ? "🎵" : s.platform === "Substack" ? "✍️" : "🔗"}</span>
                          </div>
                          <div>
                            <p style={{ fontFamily: "var(--font-jost)", fontSize: "7.5px", fontWeight: 800, color: "rgba(255,255,255,0.28)", letterSpacing: "0.1em" }}>{s.platform.toUpperCase()}</p>
                            <p style={{ fontFamily: "var(--font-jost)", fontSize: "11px", fontWeight: 700, color: "rgba(255,255,255,0.7)" }}>{s.handle}</p>
                          </div>
                        </div>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── BOARD TAB — mood board on the same page ───────────────────────── */}
        {tab === "board" && (
          <div>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, letterSpacing: "0.16em", color: "rgba(255,255,255,0.28)", marginBottom: 14 }}>HER BOARD · PHOTOS · QUOTES · VOICE NOTES</p>
            {profile.moodBoard.length > 0 ? (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {profile.moodBoard.map((item, i) => <MoodItem key={i} item={item} />)}
              </div>
            ) : (
              <div style={{ textAlign: "center" as const, padding: "48px 20px" }}>
                <p style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontSize: 20, color: "rgba(255,255,255,0.2)" }}>Nothing here yet.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
