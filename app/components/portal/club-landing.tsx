"use client";

import { useState, useRef, useEffect, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { BBLogo } from "./bb-logo";
import { Tape, WashiTape } from "./scrapbook";
import { applyToClub } from "@/lib/actions/clubs";
import { ClubMediaSection } from "./club-media-section";
import { CrestSVG } from "./club-crest-generator";
import type { CrestConfig } from "./club-crest-generator";

const PINK = "#FF1F7D";
const DARK = "#1C1B1C";
const CREAM = "#F6F1EB";

const PAPER_TEX = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch' result='t'/%3E%3CfeColorMatrix type='saturate' values='0' in='t'/%3E%3C/filter%3E%3Crect width='200' height='200' fill='%23000' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E")`;

// ─── Types ────────────────────────────────────────────────────────────────────

export type ClubAccessType = "free" | "one_time" | "subscription";
export type ClubEntryStyle = "open" | "application" | "approval_paywall";

export interface ClubZone {
  id: string;
  name: string;
  emoji: string;
  desc: string;
  memberCount: number;
  price?: number;
  priceInterval?: "monthly" | "one_time";
  joinType?: "open" | "request";
  zoneColor?: string;
  activeThisWeek?: number;
  weeklyPrompt?: string;
  lastMessage?: string;
  lastMessageAuthor?: string;
}

export interface ClubPhoto {
  grad: string;
  label: string;
  date: string;
  rot?: number;
}

export interface ClubTestimonial {
  initial: string;
  name: string;
  neighborhood: string;
  color: string;
  quote: string;
  event: string;
}

export interface ClubTradition {
  id: string;
  name: string;
  description?: string;
  frequency: string;
  emoji: string;
  sinceYear?: number | null;
}

export interface ClubLandingData {
  id: string;
  name: string;
  tagline: string;
  about: string;
  aboutNote?: string;
  whoItsFor: string;
  whatMembersDo: string[];
  features?: { emoji: string; title: string; desc: string }[];
  tags: string[];
  city: string;
  neighborhood: string;
  memberCount: number;
  color: string;
  crestBg?: string;
  crestEmoji?: string;
  darkBg: boolean;
  mamaName: string;
  mamaTitle: string;
  mamaBio: string;
  mamaVoiceSeconds?: number;
  accessType: ClubAccessType;
  entryStyle: ClubEntryStyle;
  price?: number;
  billingInterval?: "monthly" | "seasonal" | "yearly";
  rules?: string[];
  upcomingSeats: { title: string; date: string; seats: number; price?: string; location?: string; going?: number }[];
  photos?: ClubPhoto[];
  testimonials?: ClubTestimonial[];
  zones?: ClubZone[];
  allowZoneRequests?: boolean;
  traditions?: ClubTradition[];
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const DEFAULT_CLUB: ClubLandingData = {
  id: "22222222-2222-2222-2222-222222222222",
  name: "Museum Girls",
  tagline: "art, culture + beautiful company",
  aboutNote: "come for the art,\nstay for the girls ♡",
  about:
    "Museum Girls is for women who find magic in the details. We believe in slow days, beautiful places, good conversations, and growing together.",
  whoItsFor:
    "Women who wander museums, find beauty in the city, and make every day a little more inspiring.",
  whatMembersDo: [
    "Museum visits, gallery tours, and cultural moments",
    "Small group outings — real friendships in the making",
    "Photography and shared memory-keeping",
    "Member-only events and exclusive evening previews",
  ],
  features: [
    { emoji: "🏛️", title: "Curated Experiences", desc: "Museum visits, gallery tours, cultural moments in the city." },
    { emoji: "♡",  title: "Meaningful Connections", desc: "Small groups, women building real friendships." },
    { emoji: "📷", title: "Beautiful Memories", desc: "Document, share, and keep the good times alive." },
    { emoji: "🎁", title: "Club Perks", desc: "Member-only events, exclusive surprise gifts + more." },
  ],
  tags: ["Art", "Culture", "NYC", "Social"],
  city: "New York",
  neighborhood: "All boroughs",
  memberCount: 1600,
  color: PINK,
  crestBg: "#5c1a3a",
  darkBg: false,
  mamaName: "Yande O.",
  mamaTitle: "Museum Girls Club Mama",
  mamaBio:
    "Art lover, slow wanderer, and firm believer that every museum visit deserves good company and a long lunch after.",
  mamaVoiceSeconds: 42,
  accessType: "free",
  entryStyle: "open",
  rules: [
    "Arrive with curiosity, leave with conversation",
    "No spoilers on what you've seen — let others discover",
    "Photography encouraged. Tags optional.",
    "Every woman here chose beauty. Honor that.",
  ],
  upcomingSeats: [
    { title: "The Met: Impressionism", date: "Sat, May 24 · 10:00 AM", seats: 8, location: "The Metropolitan Museum of Art", going: 9 },
    { title: "Coffee + Exhibit",       date: "Sat, May 31 · 11:00 AM", seats: 5, location: "The Whitney Museum", going: 6 },
    { title: "Architecture Walk",      date: "Sat, Jun 07 · 10:00 AM", seats: 6, location: "SoHo, New York", going: 11 },
  ],
  photos: [
    { grad: "linear-gradient(135deg,#6b4fa0 0%,#2d1a5e 100%)", label: "The Met Impressionism", date: "May 12", rot: -1.5 },
    { grad: "linear-gradient(135deg,#c9504a 0%,#7a1c2e 100%)", label: "Whitney Museum Night",  date: "Apr 28", rot: 1 },
    { grad: "linear-gradient(135deg,#4a6c8c 0%,#1a2d4a 100%)", label: "Architecture Walk",     date: "Apr 15", rot: -0.5 },
    { grad: "linear-gradient(135deg,#3e7c6b 0%,#1a3d31 100%)", label: "Brooklyn Museum",        date: "Apr 3",  rot: 1.5 },
    { grad: "linear-gradient(135deg,#b07856 0%,#7a3a1a 100%)", label: "Gallery Tour SoHo",      date: "Mar 22", rot: -1 },
    { grad: "linear-gradient(135deg,#c96b9e 0%,#7a2250 100%)", label: "Museum Brunch",          date: "Mar 8",  rot: 0.5 },
  ],
  testimonials: [
    {
      initial: "O", name: "Olivia, Brooklyn", neighborhood: "Brooklyn", color: PINK,
      quote: "I had no one to visit museums with. Museum Girls gave me my people, and now the city feels entirely different.",
      event: "Gallery Night · March",
    },
    {
      initial: "T", name: "Temi, Manhattan", neighborhood: "Manhattan", color: "#6b4fa0",
      quote: "The best part isn't just the museums; it's the conversations and the connections.",
      event: "Architecture Walk · April",
    },
    {
      initial: "A", name: "Ashley, West Village", neighborhood: "West Village", color: "#3e7c6b",
      quote: "Every event feels thoughtfully beautiful and so us.",
      event: "Met Impressionism · May",
    },
  ],
  zones: [
    { id: "z1", name: "Slow Art Sundays",    emoji: "🎨", desc: "Unhurried Sunday gallery visits. No agenda, just looking.",                     memberCount: 48, joinType: "open",    zoneColor: "#7C3AED", activeThisWeek: 22, weeklyPrompt: "What's one artwork you couldn't stop thinking about this week?", lastMessage: "The Degas pastels at the Met — I never realized how textured they are in person.", lastMessageAuthor: "Aminah" },
    { id: "z2", name: "After Dark Openings", emoji: "🌙", desc: "Evening preview openings and gallery events. Members-only access.",             memberCount: 22, price: 15, priceInterval: "monthly", joinType: "request", zoneColor: "#0EA5E9", activeThisWeek: 15, weeklyPrompt: "Which gallery opening this month surprised you most?", lastMessage: "Pace Gallery has a members-only preview Thursday — who's joining me?", lastMessageAuthor: "Fatima" },
    { id: "z3", name: "Museum + Lunch",      emoji: "🥗", desc: "Art followed by a long lunch. Culture + food, always together.",                memberCount: 35, joinType: "open",    zoneColor: "#16A34A", activeThisWeek: 18, weeklyPrompt: "Best post-museum restaurant you've been to lately?", lastMessage: "After the Hockney show we went to Cafe Sabarsky downstairs — I'm not over it.", lastMessageAuthor: "Olivia" },
    { id: "z4", name: "Collectors Corner",   emoji: "🖼️", desc: "For the girls seriously exploring art collecting and acquisition.",            memberCount: 11, price: 20, priceInterval: "monthly", joinType: "request", zoneColor: "#B45309", activeThisWeek: 9,  weeklyPrompt: "If you had $5K to spend on your first piece, where would you start?", lastMessage: "Started working with a private dealer last month — the access is completely different.", lastMessageAuthor: "Chidera" },
  ],
  allowZoneRequests: true,
  traditions: [
    { id: "t1", name: "The Long Friday Dinner", description: "Three courses, no phones, all conversation.", frequency: "Every third Friday", emoji: "🕯️", sinceYear: 2022 },
    { id: "t2", name: "Sunday Morning Walk",    description: "Coffee, city air, and good company.",         frequency: "Every Sunday · 9 AM", emoji: "🌸", sinceYear: 2023 },
    { id: "t3", name: "The Annual Evening",     description: "Our biggest night of the year.",              frequency: "Every December",       emoji: "✨", sinceYear: 2022 },
    { id: "t4", name: "First Wednesday Welcome",description: "New members celebrated over cake.",           frequency: "First Wed / month",    emoji: "🎀", sinceYear: 2023 },
  ],
};

// ─── Chat mock ────────────────────────────────────────────────────────────────

interface ChatMessage {
  id: number; author: string; initial: string; color: string;
  text: string; time: string; mine?: boolean;
  imageUrl?: string;
  reactions?: { emoji: string; count: number }[];
  type?: "welcome";
  welcomeTag?: string;
  welcomeInterests?: string[];
}

const CHAT_MESSAGES: ChatMessage[] = [
  { id: 0, type: "welcome", author: "Yande O.", initial: "Y", color: "#FF1F7D", text: "Say hi to Bea! She just joined Museum Girls — she's an art lover, gallery hopper, and always down for a long lunch 🎨 Welcome her to the club!", time: "Yesterday", welcomeTag: "Just joined", welcomeInterests: ["Gallery openings", "Art collecting", "Museum lunches"] },
  { id: 1, author: "Aminah C.", initial: "A", color: "#FF1F7D", text: "The Hockney retrospective at the Whitney is stunning. Has everyone been?", time: "2:14 PM" },
  { id: 2, author: "Kelechi O.", initial: "K", color: "#FF69B4", text: "YES the scale of those pool paintings in person 😭 I cried a little tbh", time: "2:16 PM", reactions: [{ emoji: "♡", count: 4 }] },
  { id: 3, author: "You", initial: "M", color: "#FF69B4", text: "Ok we need a club outing ASAP. I'm not missing this one", time: "2:17 PM", mine: true },
  { id: 4, author: "Aminah C.", initial: "A", color: "#FF1F7D", text: "Thursday evening has member tickets btw!! Yande just posted 🎉", time: "2:19 PM", reactions: [{ emoji: "♡", count: 8 }, { emoji: "✦", count: 3 }] },
  { id: 5, author: "Bea T.", initial: "B", color: "#FF69B4", text: "Thursday works! Are we doing dinner after?", time: "2:21 PM" },
  { id: 6, author: "You", initial: "M", color: "#FF69B4", text: "Obviously. I vote the little wine bar on 77th", time: "2:22 PM", mine: true },
  { id: 7, author: "Kelechi O.", initial: "K", color: "#FF69B4", text: "The one with the terrace? Perfect post-museum energy 🍷", time: "2:24 PM", reactions: [{ emoji: "♡", count: 5 }] },
  { id: 8, author: "Fatima A.", initial: "F", color: "#FF1F7D", text: "I'll grab the tickets now — the 6pm slot has space", time: "2:25 PM" },
  { id: 9, author: "Aminah C.", initial: "A", color: "#FF1F7D", text: "This is going to be so good. See everyone Thursday 🌸", time: "2:26 PM", reactions: [{ emoji: "♡", count: 11 }] },
];

const CLUB_MEMBERS = [
  { id: "m1", initial: "Y", name: "Yande O.",    color: "#FF1F7D", role: "Club Mama", reports: 0 },
  { id: "m2", initial: "A", name: "Aminah C.",   color: "#FF69B4", role: "Member",    reports: 0 },
  { id: "m3", initial: "K", name: "Kelechi O.", color: "#FF69B4", role: "Member",    reports: 0 },
  { id: "m4", initial: "B", name: "Bea T.",      color: "#FF69B4", role: "Member",    reports: 0 },
  { id: "m5", initial: "F", name: "Fatima A.",   color: "#FF1F7D", role: "Member",    reports: 3 },
  { id: "m6", initial: "T", name: "Temi A.",     color: "#6b4fa0", role: "Member",    reports: 1 },
  { id: "m7", initial: "O", name: "Olivia K.",   color: "#3e7c6b", role: "Member",    reports: 0 },
  { id: "m8", initial: "C", name: "Chidera L.",  color: "#0EA5E9", role: "Member",    reports: 0 },
];

type ClubTab = "about" | "chat" | "zones" | "events" | "members";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function parseDatePill(dateStr: string): { month: string; day: string } {
  const parts = dateStr.split(/[\s,]+/).filter(Boolean);
  return { month: (parts[1] ?? "").toUpperCase().slice(0, 3), day: parts[2] ?? "" };
}

function ClubCrest({ color, crestBg, size = 72 }: { name?: string; color: string; crestBg?: string; size?: number }) {
  const bg = crestBg ?? "#3a0018";
  const fs = Math.round(size * 0.3);
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: `radial-gradient(circle at 35% 35%, ${color}, ${bg})`, boxShadow: `0 4px 24px ${color}55`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, position: "relative" }}>
      <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "1.5px solid rgba(255,255,255,0.22)", transform: "scale(0.86)" }} />
      {/* Two B's facing each other */}
      <div style={{ display: "flex", alignItems: "center", gap: 2, position: "relative", zIndex: 1 }}>
        <span style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900, fontSize: fs, color: "white", lineHeight: 1, letterSpacing: 0 }}>B</span>
        <span style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900, fontSize: fs, color: "white", lineHeight: 1, letterSpacing: 0, display: "inline-block", transform: "scaleX(-1)" }}>B</span>
      </div>
    </div>
  );
}

function PriceBadge({ type, price, interval }: { type: ClubAccessType; price?: number; interval?: string }) {
  if (type === "free") return <span style={{ background: "#F0FFF4", color: "#16a34a", borderRadius: 20, padding: "5px 12px", fontSize: 11, fontWeight: 700 }}>Free to join</span>;
  if (type === "one_time") return <span style={{ background: "#FFF5F8", color: "#FF0055", borderRadius: 20, padding: "5px 12px", fontSize: 11, fontWeight: 700 }}>${price} one-time</span>;
  return <span style={{ background: "#FFF5F8", color: "#FF0055", borderRadius: 20, padding: "5px 12px", fontSize: 11, fontWeight: 700 }}>${price}/{interval ?? "mo"}</span>;
}

function EntryBadge({ style }: { style: ClubEntryStyle }) {
  if (style === "open") return <span style={{ background: "#F0FFF4", color: "#16a34a", borderRadius: 20, padding: "5px 12px", fontSize: 11, fontWeight: 600 }}>Open — join instantly</span>;
  if (style === "application") return <span style={{ background: "#FFF9E6", color: "#b45309", borderRadius: 20, padding: "5px 12px", fontSize: 11, fontWeight: 600 }}>Application required</span>;
  return <span style={{ background: "#FFF5F8", color: "#FF0055", borderRadius: 20, padding: "5px 12px", fontSize: 11, fontWeight: 600 }}>Apply → approve → pay</span>;
}

// ─── Peony decoration ─────────────────────────────────────────────────────────

function PeonyDecor({ style }: { style?: React.CSSProperties }) {
  return (
    <svg width="88" height="100" viewBox="0 0 88 100" fill="none" style={{ opacity: 0.32, pointerEvents: "none", ...style }}>
      <ellipse cx="44" cy="52" rx="24" ry="20" fill="#FFB5CC" />
      <ellipse cx="44" cy="46" rx="19" ry="15" fill="#FFD0DE" />
      <ellipse cx="37" cy="42" rx="13" ry="11" fill="#FFECF2" />
      <ellipse cx="51" cy="44" rx="11" ry="9"  fill="#FFECF2" />
      <ellipse cx="44" cy="40" rx="11" ry="8"  fill="#FFE0EB" />
      <ellipse cx="44" cy="36" rx="7"  ry="6"  fill="#FFD0DE" />
      <line x1="44" y1="72" x2="44" y2="100" stroke="#8BA888" strokeWidth="2.2" />
      <path d="M44 88 Q56 80 58 68 Q50 72 44 88Z" fill="#8BA888" />
      <path d="M44 82 Q32 75 30 63 Q38 67 44 82Z" fill="#8BA888" />
      <path d="M44 6 Q50 12 44 18 Q38 12 44 6Z" fill="#FFD0DE" opacity="0.6" />
      <path d="M36 10 Q30 18 36 24 Q40 16 36 10Z" fill="#FFB5CC" opacity="0.5" />
      <path d="M52 10 Q58 18 52 24 Q48 16 52 10Z" fill="#FFB5CC" opacity="0.5" />
    </svg>
  );
}

// ─── Voice Note Card ──────────────────────────────────────────────────────────

const WAVEFORM = [18, 28, 22, 36, 42, 30, 48, 38, 52, 40, 34, 46, 28, 44, 36, 26, 40, 32, 48, 22, 36, 42, 28, 38, 30];

function VoiceNoteCard({ mama, seconds, color }: { mama: string; seconds: number; color: string }) {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(() => {
        setProgress(p => { if (p >= 100) { setPlaying(false); return 0; } return p + (100 / (seconds * 10)); });
      }, 100);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [playing, seconds]);

  const played = Math.round((progress / 100) * WAVEFORM.length);
  const elapsed = Math.round((progress / 100) * seconds);
  const remaining = seconds - elapsed;
  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  return (
    <div style={{ margin: "0 20px", borderRadius: 24, overflow: "hidden", background: `linear-gradient(135deg, ${color} 0%, ${color}CC 100%)`, boxShadow: `0 8px 32px ${color}44` }}>
      <div style={{ padding: "16px 20px 8px" }}>
        <p style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.22em", color: "rgba(255,255,255,0.55)", marginBottom: 12 }}>A MESSAGE FROM YOUR CLUB MAMA</p>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14, color: "white", background: "rgba(255,255,255,0.2)", border: "1.5px solid rgba(255,255,255,0.3)" }}>{mama[0]}</div>
          <div>
            <p style={{ fontWeight: 700, fontSize: 14, color: "white" }}>{mama}</p>
            <p style={{ fontSize: 10, color: "rgba(255,255,255,0.55)" }}>Voice note · {fmt(seconds)}</p>
          </div>
        </div>
      </div>
      <div style={{ padding: "0 20px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={() => setPlaying(p => !p)} style={{ width: 40, height: 40, borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "white", border: "none", cursor: "pointer" }}>
            {playing ? (
              <svg width="12" height="14" viewBox="0 0 12 14" fill="none"><rect x="0" y="0" width="4" height="14" rx="1.5" fill={color} /><rect x="8" y="0" width="4" height="14" rx="1.5" fill={color} /></svg>
            ) : (
              <svg width="12" height="14" viewBox="0 0 12 14" fill="none"><path d="M1 1l10 6-10 6V1z" fill={color} /></svg>
            )}
          </button>
          <div style={{ flex: 1, display: "flex", alignItems: "flex-end", gap: 2, height: 40 }}>
            {WAVEFORM.map((h, i) => (
              <div key={i} style={{ width: 3, height: h, borderRadius: 2, flexShrink: 0, background: i < played ? "white" : "rgba(255,255,255,0.3)", transition: "background 0.1s" }} />
            ))}
          </div>
          <span style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.6)", flexShrink: 0, minWidth: 28 }}>{playing ? fmt(remaining) : fmt(seconds)}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Traditions ──────────────────────────────────────────────────────────────

function TraditionCard({ tradition, color }: { tradition: ClubTradition; color: string }) {
  return (
    <div style={{ flexShrink: 0, width: 128, background: "white", borderRadius: 20, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
      <div style={{ height: 3, background: `linear-gradient(90deg, ${color}, ${color}66)` }} />
      <div style={{ padding: "16px 12px 18px", textAlign: "center" }}>
        <div style={{ fontSize: 28, marginBottom: 10, lineHeight: 1 }}>{tradition.emoji}</div>
        <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 700, fontSize: 12, color: DARK, lineHeight: 1.35, marginBottom: 6 }}>{tradition.name}</p>
        <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.08em", color: color, textTransform: "uppercase" }}>{tradition.frequency}</p>
        {tradition.sinceYear && (
          <p style={{ fontFamily: "var(--font-caveat)", fontSize: 10, color: DARK, opacity: 0.38, marginTop: 4 }}>since {tradition.sinceYear}</p>
        )}
      </div>
    </div>
  );
}

function TraditionsSection({ club }: { club: ClubLandingData }) {
  const traditions = club.traditions ?? [];
  if (traditions.length === 0) return null;
  return (
    <div>
      <div style={{ padding: "0 20px 12px", display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.22em", color: club.color }}>OUR TRADITIONS</p>
          <p style={{ fontFamily: "var(--font-caveat)", fontSize: 13, color: "rgba(0,0,0,0.4)", marginTop: 2 }}>the rituals that make us, us ♡</p>
        </div>
        <span style={{ fontSize: 9, fontWeight: 700, padding: "3px 9px", borderRadius: 20, background: `${club.color}12`, color: club.color, flexShrink: 0 }}>
          {traditions.length} traditions
        </span>
      </div>
      <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingLeft: 20, paddingRight: 20, paddingBottom: 4, scrollbarWidth: "none" }}>
        {traditions.map(t => <TraditionCard key={t.id} tradition={t} color={club.color} />)}
      </div>
    </div>
  );
}

// ─── Girl Zones Section ───────────────────────────────────────────────────────

const ZONE_REQUEST_MIN_DAYS = 14;

function GirlZonesSection({ club, isMember, daysInClub = 0 }: { club: ClubLandingData; isMember: boolean; daysInClub?: number }) {
  const canRequestZone = isMember && daysInClub >= ZONE_REQUEST_MIN_DAYS && !!club.allowZoneRequests;
  const [joined, setJoined] = useState<Set<string>>(new Set());
  const [requested, setRequested] = useState<Set<string>>(new Set());
  const [showRequest, setShowRequest] = useState(false);
  const [zoneName, setZoneName] = useState("");
  const [zoneDesc, setZoneDesc] = useState("");
  const [zonePrice, setZonePrice] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const zones = club.zones ?? [];

  function toggle(id: string) {
    setJoined(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }
  function requestJoin(id: string) { setRequested(prev => new Set([...prev, id])); }
  function submitRequest() {
    if (!zoneName.trim()) return;
    setSubmitted(true);
    setTimeout(() => { setShowRequest(false); setZoneName(""); setZoneDesc(""); setZonePrice(""); setSubmitted(false); }, 1800);
  }

  return (
    <>
      <div style={{ background: "white", borderRadius: 24, overflow: "hidden", boxShadow: "0 1px 8px rgba(0,0,0,0.06)" }}>
        <div style={{ padding: "18px 20px 12px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", color: club.color }}>GIRL ZONES</p>
            <p style={{ fontSize: 11, color: "rgba(0,0,0,0.38)", marginTop: 2 }}>smaller circles, deeper connections</p>
          </div>
          <div style={{ fontSize: 10, fontWeight: 700, padding: "4px 10px", borderRadius: 20, background: `${club.color}15`, color: club.color }}>{zones.length} zones</div>
        </div>

        <div style={{ borderTop: "1px solid rgba(0,0,0,0.05)" }}>
          {zones.map((zone, i) => {
            const isBlurred = !isMember && i > 1;
            const isJoined = joined.has(zone.id);
            return (
              <div key={zone.id} style={{ padding: "14px 20px", display: "flex", alignItems: "center", gap: 14, borderBottom: i < zones.length - 1 ? "1px solid rgba(0,0,0,0.04)" : "none", filter: isBlurred ? "blur(3px)" : "none", userSelect: isBlurred ? "none" : "auto", pointerEvents: isBlurred ? "none" : "auto" }}>
                <div style={{ width: 40, height: 40, borderRadius: 14, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, background: `${club.color}10` }}>{zone.emoji}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                    <p style={{ fontWeight: 600, fontSize: 13, color: "#111" }}>{zone.name}</p>
                    {zone.price && <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 7px", borderRadius: 20, background: "#FFF9E6", color: "#b45309" }}>${zone.price}/{zone.priceInterval === "one_time" ? "once" : "mo"}</span>}
                  </div>
                  <p style={{ fontSize: 11, color: "rgba(0,0,0,0.45)", marginTop: 2, lineHeight: 1.45 }}>{zone.desc}</p>
                  <p style={{ fontSize: 10, fontWeight: 600, marginTop: 3, color: club.color }}>{zone.memberCount} members</p>
                </div>
                {isMember && (() => {
                  const isReq = zone.joinType === "request";
                  const hasPending = requested.has(zone.id);
                  if (isJoined) return <span style={{ flexShrink: 0, padding: "6px 12px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: `${club.color}15`, color: club.color, border: `1.5px solid ${club.color}40` }}>Joined ✓</span>;
                  if (isReq && hasPending) return <span style={{ flexShrink: 0, padding: "6px 12px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: "#FFF9E6", color: "#b45309" }}>Requested · pending</span>;
                  return (
                    <button onClick={() => isReq ? requestJoin(zone.id) : toggle(zone.id)} style={{ flexShrink: 0, padding: "6px 12px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: club.color, color: "white", border: "none", cursor: "pointer" }}>
                      {isReq ? (zone.price ? `Request · $${zone.price}/mo` : "Request to join") : (zone.price ? `Join · $${zone.price}/mo` : "Join")}
                    </button>
                  );
                })()}
              </div>
            );
          })}
        </div>

        {isMember && club.allowZoneRequests && (
          <div style={{ padding: "14px 20px", borderTop: `1px dashed ${club.color}25`, background: `${club.color}04` }}>
            {canRequestZone ? (
              <button onClick={() => setShowRequest(true)} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, fontWeight: 600, color: club.color, background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                <div style={{ width: 24, height: 24, borderRadius: "50%", background: `${club.color}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M5 1v8M1 5h8" stroke={club.color} strokeWidth="1.8" strokeLinecap="round" /></svg>
                </div>
                Suggest a new zone
              </button>
            ) : (
              <p style={{ fontSize: 11, color: "rgba(0,0,0,0.3)" }}>
                Zone suggestions unlock after 2 weeks in the club · <span style={{ color: club.color }}>{Math.max(0, ZONE_REQUEST_MIN_DAYS - daysInClub)}d to go</span>
              </p>
            )}
          </div>
        )}
      </div>

      {showRequest && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "flex-end", justifyContent: "center", background: "rgba(0,0,0,0.5)" }}>
          <div style={{ width: "100%", maxWidth: 448, borderRadius: "24px 24px 0 0", padding: "24px 24px 32px", background: "white", boxShadow: "0 -8px 32px rgba(0,0,0,0.15)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <div>
                <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.22em", color: club.color }}>SUGGEST A ZONE</p>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: "#111", fontFamily: "var(--font-playfair)" }}>New zone idea</h3>
              </div>
              <button onClick={() => setShowRequest(false)} style={{ width: 32, height: 32, borderRadius: "50%", background: "#F5F5F5", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M1 1l10 10M11 1L1 11" stroke="#888" strokeWidth="1.8" strokeLinecap="round" /></svg>
              </button>
            </div>
            {submitted ? (
              <div style={{ textAlign: "center", padding: "24px 0" }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>✦</div>
                <p style={{ fontWeight: 700, fontSize: 16, color: "#111", fontFamily: "var(--font-playfair)" }}>Suggestion sent!</p>
                <p style={{ fontSize: 13, color: "rgba(0,0,0,0.4)", marginTop: 4 }}>The Club Mama will review your idea.</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <label style={{ display: "block", fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", color: "rgba(0,0,0,0.4)", marginBottom: 8 }}>ZONE NAME</label>
                  <input type="text" value={zoneName} onChange={e => setZoneName(e.target.value)} placeholder="e.g. Coding Girls, Sunday Bakers…" style={{ width: "100%", background: "#F8F8F8", borderRadius: 16, padding: "12px 16px", fontSize: 14, outline: "none", border: `2px solid ${zoneName ? club.color : "transparent"}`, color: "#111", boxSizing: "border-box" }} onFocus={e => (e.target.style.borderColor = club.color)} onBlur={e => (e.target.style.borderColor = "transparent")} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", color: "rgba(0,0,0,0.4)", marginBottom: 8 }}>WHAT WOULD IT BE ABOUT?</label>
                  <textarea rows={2} value={zoneDesc} onChange={e => setZoneDesc(e.target.value)} placeholder="Describe the vibe and purpose…" style={{ width: "100%", background: "#F8F8F8", borderRadius: 16, padding: "12px 16px", fontSize: 14, outline: "none", border: "2px solid transparent", color: "#111", resize: "none", boxSizing: "border-box" }} onFocus={e => (e.target.style.borderColor = club.color)} onBlur={e => (e.target.style.borderColor = "transparent")} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", color: "rgba(0,0,0,0.4)", marginBottom: 4 }}>MONTHLY FEE (optional)</label>
                  <p style={{ fontSize: 10, color: "rgba(0,0,0,0.4)", marginBottom: 8 }}>If you'd like to charge for this zone, set a monthly fee below.</p>
                  <div style={{ position: "relative", marginBottom: zonePrice && parseFloat(zonePrice) > 0 ? 12 : 0 }}>
                    <span style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", fontSize: 14, fontWeight: 600, color: "rgba(0,0,0,0.4)" }}>$</span>
                    <input type="number" value={zonePrice} onChange={e => setZonePrice(e.target.value)} placeholder="0" style={{ width: "100%", background: "#F8F8F8", borderRadius: 16, paddingLeft: 32, paddingRight: 16, paddingTop: 12, paddingBottom: 12, fontSize: 14, outline: "none", border: "2px solid transparent", color: "#111", boxSizing: "border-box" }} onFocus={e => (e.target.style.borderColor = club.color)} onBlur={e => (e.target.style.borderColor = "transparent")} />
                  </div>
                  {zonePrice && parseFloat(zonePrice) > 0 && (
                    <div>
                      <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.15em", color: "rgba(0,0,0,0.35)", marginBottom: 8 }}>HOW THE REVENUE SPLITS</p>
                      <div style={{ display: "flex", gap: 6 }}>
                        <div style={{ flex: 1, padding: "10px 8px", borderRadius: 12, background: "#F0FDF4", textAlign: "center" }}>
                          <p style={{ fontSize: 18, fontWeight: 800, color: "#16A34A", lineHeight: 1 }}>60%</p>
                          <p style={{ fontSize: 9, fontWeight: 700, color: "#16A34A", marginTop: 3 }}>You</p>
                          <p style={{ fontSize: 8, color: "#16A34A", opacity: 0.7 }}>Zone Leader</p>
                        </div>
                        <div style={{ flex: 1, padding: "10px 8px", borderRadius: 12, background: `${club.color}10`, textAlign: "center" }}>
                          <p style={{ fontSize: 18, fontWeight: 800, color: club.color, lineHeight: 1 }}>25%</p>
                          <p style={{ fontSize: 9, fontWeight: 700, color: club.color, marginTop: 3 }}>Club Mama</p>
                          <p style={{ fontSize: 8, color: club.color, opacity: 0.7 }}>{club.mamaName.split(" ")[0]}</p>
                        </div>
                        <div style={{ flex: 1, padding: "10px 8px", borderRadius: 12, background: "#FFF0F8", textAlign: "center" }}>
                          <p style={{ fontSize: 18, fontWeight: 800, color: "#FF1F7D", lineHeight: 1 }}>15%</p>
                          <p style={{ fontSize: 9, fontWeight: 700, color: "#FF1F7D", marginTop: 3 }}>Bloombay</p>
                          <p style={{ fontSize: 8, color: "#FF1F7D", opacity: 0.7 }}>Platform</p>
                        </div>
                      </div>
                      <p style={{ fontSize: 10, color: "rgba(0,0,0,0.35)", marginTop: 8, textAlign: "center" }}>
                        You'd earn <strong style={{ color: "#16A34A" }}>${(parseFloat(zonePrice) * 0.6).toFixed(2)}/mo</strong> per member at ${parseFloat(zonePrice).toFixed(0)}/mo
                      </p>
                    </div>
                  )}
                </div>
                <button onClick={submitRequest} disabled={!zoneName.trim()} style={{ width: "100%", padding: "14px 0", borderRadius: 32, fontWeight: 700, fontSize: 14, color: "white", background: club.color, border: "none", cursor: zoneName.trim() ? "pointer" : "default", opacity: zoneName.trim() ? 1 : 0.4 }}>
                  Submit to Club Mama →
                </button>
                <p style={{ textAlign: "center", fontSize: 10, color: "rgba(0,0,0,0.35)", marginTop: -8 }}>The Club Mama approves or denies all zone suggestions.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

// ─── Club Chat ────────────────────────────────────────────────────────────────

function ClubChat({ club, daysInClub = 99 }: { club: ClubLandingData; daysInClub?: number }) {
  const [messages, setMessages] = useState<ChatMessage[]>(CHAT_MESSAGES);
  const [input, setInput] = useState("");
  const [likedIds, setLikedIds] = useState<Set<number>>(new Set());
  const [pendingImage, setPendingImage] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  function send() {
    if (!input.trim() && !pendingImage) return;
    setMessages(prev => [...prev, {
      id: Date.now(), author: "You", initial: "M", color: "#FF69B4",
      text: input.trim(), imageUrl: pendingImage ?? undefined,
      time: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
      mine: true,
    }]);
    setInput("");
    setPendingImage(null);
  }

  function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => { if (ev.target?.result) setPendingImage(ev.target.result as string); };
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 280px)", minHeight: 400 }}>
      <input ref={fileRef} type="file" accept="image/*" onChange={handlePhoto} style={{ display: "none" }} />

      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 20px", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
        <div style={{ display: "flex" }}>
          {CLUB_MEMBERS.slice(0, 5).map(m => (
            <div key={m.name} style={{ width: 24, height: 24, borderRadius: "50%", border: "2px solid white", marginLeft: -6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, color: "white", background: m.color, flexShrink: 0 }}>{m.initial}</div>
          ))}
        </div>
        <span style={{ fontSize: 12, color: "rgba(0,0,0,0.4)" }}>{CLUB_MEMBERS.length} members · <span style={{ color: club.color }}>5 online</span></span>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "20px", display: "flex", flexDirection: "column", gap: 16, background: "#FFF5F8" }}>

        {/* New member intro card — shown only in the first 7 days */}
        {daysInClub <= 7 && (
          <div style={{ borderRadius: 20, background: "linear-gradient(135deg, #FFF0F8 0%, #FFF9E6 100%)", border: `2px solid ${club.color}30`, padding: "16px 18px", boxShadow: "0 2px 16px rgba(255,31,125,0.08)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: club.color, color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700 }}>Y</div>
              <div>
                <p style={{ fontSize: 12, fontWeight: 700, color: "#111" }}>{club.mamaName}</p>
                <p style={{ fontSize: 10, color: "rgba(0,0,0,0.4)" }}>Club Mama · just now</p>
              </div>
              <div style={{ marginLeft: "auto", padding: "3px 10px", borderRadius: 20, background: `${club.color}15`, fontSize: 9, fontWeight: 700, color: club.color, letterSpacing: "0.1em" }}>NEW MEMBER</div>
            </div>
            <div style={{ background: "white", borderRadius: 14, padding: "12px 14px", marginBottom: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg, #FF1F7D, #FF69B4)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, flexShrink: 0 }}>M</div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 700, color: "#111", fontFamily: "var(--font-playfair)" }}>You</p>
                  <p style={{ fontSize: 11, color: "rgba(0,0,0,0.4)" }}>Just joined {club.name} 🌸</p>
                </div>
              </div>
              <p style={{ fontSize: 12, color: "rgba(0,0,0,0.6)", lineHeight: 1.55 }}>New to the club and excited to be here. Can't wait to meet everyone!</p>
            </div>
            <p style={{ fontSize: 13, color: "#111", lineHeight: 1.5 }}>Welcome to <strong>{club.name}</strong>! We're so happy you're here — say hi 🎉</p>
            <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
              {["♡ Welcome", "🌸 Say hi", "✦ Wave"].map(label => (
                <button key={label} style={{ padding: "6px 14px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: `${club.color}12`, color: club.color, border: `1px solid ${club.color}30`, cursor: "pointer" }}>{label}</button>
              ))}
            </div>
          </div>
        )}

        {messages.map(msg => {
          if (msg.type === "welcome") {
            return (
              <div key={msg.id} style={{ borderRadius: 18, background: "white", border: "1.5px solid rgba(0,0,0,0.06)", overflow: "hidden", boxShadow: "0 1px 8px rgba(0,0,0,0.04)" }}>
                <div style={{ padding: "10px 14px 8px", borderBottom: "1px solid rgba(0,0,0,0.05)", display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: msg.color, color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700 }}>{msg.initial}</div>
                  <div>
                    <span style={{ fontSize: 11, fontWeight: 700, color: msg.color }}>{msg.author}</span>
                    <span style={{ fontSize: 10, color: "rgba(0,0,0,0.35)", marginLeft: 6 }}>introduced a new member · {msg.time}</span>
                  </div>
                </div>
                <div style={{ padding: "12px 14px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg, #FF69B4, #FF1F7D)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700 }}>{msg.author.slice(-3, -2).toUpperCase() || "B"}</div>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 700, color: "#111" }}>{msg.author === "Yande O." ? "Bea T." : "New Member"}</p>
                      {msg.welcomeTag && <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", color: club.color, background: `${club.color}12`, padding: "2px 8px", borderRadius: 10 }}>{msg.welcomeTag.toUpperCase()}</span>}
                    </div>
                  </div>
                  <p style={{ fontSize: 12, color: "rgba(0,0,0,0.6)", lineHeight: 1.5, marginBottom: 8 }}>{msg.text}</p>
                  {msg.welcomeInterests && (
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {msg.welcomeInterests.map(i => (
                        <span key={i} style={{ fontSize: 10, fontWeight: 600, padding: "3px 10px", borderRadius: 20, background: `${club.color}10`, color: club.color }}>{i}</span>
                      ))}
                    </div>
                  )}
                </div>
                <div style={{ padding: "8px 14px 10px", borderTop: "1px solid rgba(0,0,0,0.04)", display: "flex", gap: 8 }}>
                  {["♡ Welcome her", "🌸 Say hi"].map(label => (
                    <button key={label} onClick={() => setLikedIds(p => { const n = new Set(p); n.has(msg.id) ? n.delete(msg.id) : n.add(msg.id); return n; })} style={{ padding: "6px 14px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: likedIds.has(msg.id) ? `${club.color}15` : "rgba(0,0,0,0.04)", color: likedIds.has(msg.id) ? club.color : "#888", border: "none", cursor: "pointer" }}>{label}</button>
                  ))}
                </div>
              </div>
            );
          }
          return (
          <div key={msg.id} style={{ display: "flex", alignItems: "flex-end", gap: 12, flexDirection: msg.mine ? "row-reverse" : "row" }}>
            {!msg.mine && <div style={{ width: 32, height: 32, borderRadius: "50%", background: msg.color, color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0, marginBottom: 4 }}>{msg.initial}</div>}
            <div style={{ display: "flex", flexDirection: "column", alignItems: msg.mine ? "flex-end" : "flex-start", maxWidth: "75%" }}>
              {!msg.mine && <span style={{ fontSize: 11, fontWeight: 700, marginBottom: 4, marginLeft: 4, color: msg.color }}>{msg.author}</span>}
              {msg.imageUrl && (
                <div style={{ borderRadius: msg.mine ? "16px 16px 4px 16px" : "16px 16px 16px 4px", overflow: "hidden", marginBottom: msg.text ? 6 : 0, maxWidth: 220, position: "relative", height: 200 }}>
                  <Image src={msg.imageUrl} alt="" fill unoptimized style={{ objectFit: "cover" }} />
                </div>
              )}
              {msg.text && (
                <div style={{ padding: "10px 16px", fontSize: 13, lineHeight: 1.5, background: msg.mine ? club.color : "white", color: msg.mine ? "white" : "#111", borderRadius: msg.mine ? "20px 20px 6px 20px" : "20px 20px 20px 6px", boxShadow: msg.mine ? `0 2px 12px ${club.color}40` : "0 1px 6px rgba(0,0,0,0.06)" }}>{msg.text}</div>
              )}
              {msg.reactions && (
                <div style={{ display: "flex", gap: 6, marginTop: 6, marginLeft: 4 }}>
                  {msg.reactions.map(r => (
                    <button key={r.emoji} onClick={() => setLikedIds(p => { const n = new Set(p); n.has(msg.id) ? n.delete(msg.id) : n.add(msg.id); return n; })} style={{ display: "flex", alignItems: "center", gap: 4, padding: "2px 8px", borderRadius: 20, fontSize: 11, fontWeight: 500, border: "none", cursor: "pointer", background: likedIds.has(msg.id) ? "#FFF0F5" : "rgba(0,0,0,0.05)", color: likedIds.has(msg.id) ? club.color : "#888" }}>
                      {r.emoji} {likedIds.has(msg.id) ? r.count + 1 : r.count}
                    </button>
                  ))}
                </div>
              )}
              <span style={{ fontSize: 10, color: "rgba(0,0,0,0.3)", marginTop: 4, marginLeft: 4 }}>{msg.time}</span>
            </div>
          </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Pending image preview */}
      {pendingImage && (
        <div style={{ padding: "8px 16px 0", background: "white" }}>
          <div style={{ position: "relative", width: 80, height: 80, borderRadius: 12, overflow: "hidden" }}>
            <Image src={pendingImage} alt="" fill unoptimized style={{ objectFit: "cover" }} />
            <button onClick={() => setPendingImage(null)} style={{ position: "absolute", top: 4, right: 4, width: 20, height: 20, borderRadius: "50%", background: "rgba(0,0,0,0.6)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="7" height="7" viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="M1 1l10 10M11 1L1 11"/></svg>
            </button>
          </div>
        </div>
      )}

      <div style={{ padding: "12px 16px", display: "flex", alignItems: "center", gap: 10, borderTop: "1px solid rgba(0,0,0,0.06)", background: "white" }}>
        {/* Photo button */}
        <button onClick={() => fileRef.current?.click()} style={{ width: 36, height: 36, borderRadius: "50%", background: `${club.color}12`, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={club.color} strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
        </button>
        <div style={{ flex: 1, display: "flex", alignItems: "center", borderRadius: 24, padding: "10px 16px", background: "#FFF5F8", border: "1.5px solid #FFE0EE" }}>
          <input type="text" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }} placeholder="Say something…" style={{ flex: 1, background: "transparent", fontSize: 14, outline: "none", border: "none", color: "#111" }} />
        </div>
        <button onClick={send} disabled={!input.trim() && !pendingImage} style={{ width: 40, height: 40, borderRadius: "50%", background: club.color, border: "none", cursor: (input.trim() || pendingImage) ? "pointer" : "default", opacity: (input.trim() || pendingImage) ? 1 : 0.3, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
        </button>
      </div>
    </div>
  );
}

// ─── Leave Club ───────────────────────────────────────────────────────────────

function LeaveClubButton({ clubName }: { clubName: string }) {
  const [confirm, setConfirm] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [left, setLeft] = useState(false);

  async function handleLeave() {
    setLeaving(true);
    try {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      // Try both membership tables (slug-based and id-based)
      await supabase.from("club_memberships").delete().eq("user_id", user.id);
      await supabase.from("user_clubs").delete().eq("user_id", user.id);
      setLeft(true);
    } catch {
      setLeaving(false);
    }
  }

  if (left) {
    return (
      <div style={{ textAlign: "center", padding: "20px 0", fontFamily: "var(--font-caveat)", fontSize: 16, color: "#aaa" }}>
        You&apos;ve left {clubName}. You can always come back.
      </div>
    );
  }

  return (
    <div style={{ marginTop: 8 }}>
      {!confirm ? (
        <button
          onClick={() => setConfirm(true)}
          style={{
            width: "100%", padding: "14px", background: "none",
            border: "1px solid rgba(0,0,0,0.08)", borderRadius: 16, cursor: "pointer",
            fontFamily: "var(--font-jost)", fontSize: 12, fontWeight: 600,
            color: "rgba(0,0,0,0.3)", letterSpacing: "0.02em",
          }}
        >
          Leave club
        </button>
      ) : (
        <div style={{ background: "#FFF5F5", border: "1px solid rgba(220,0,0,0.1)", borderRadius: 16, padding: "16px 18px" }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: 12, fontWeight: 700, color: "#333", marginBottom: 4 }}>
            Leave {clubName}?
          </p>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: 11, color: "#999", marginBottom: 14, lineHeight: 1.5 }}>
            You&apos;ll lose access to the chat, zones, and events. You can rejoin anytime if it&apos;s open.
          </p>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={handleLeave}
              disabled={leaving}
              style={{
                flex: 1, padding: "11px 0", borderRadius: 999,
                border: "none", background: "#CC0000", color: "white",
                fontFamily: "var(--font-jost)", fontSize: 12, fontWeight: 800,
                cursor: leaving ? "default" : "pointer", opacity: leaving ? 0.6 : 1,
              }}
            >
              {leaving ? "Leaving…" : "Yes, leave"}
            </button>
            <button
              onClick={() => setConfirm(false)}
              style={{
                padding: "11px 18px", borderRadius: 999,
                border: "1px solid rgba(0,0,0,0.1)", background: "white",
                fontFamily: "var(--font-jost)", fontSize: 12, fontWeight: 600,
                color: "#555", cursor: "pointer",
              }}
            >
              Stay
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Club Membership Card ────────────────────────────────────────────────────

function ClubMembershipCard({ club, memberName = "You", memberSince }: { club: ClubLandingData; memberName?: string; memberSince?: string }) {
  const cardNumber = `${club.id?.slice(0, 4).toUpperCase() ?? "BB00"}-${memberName.slice(0, 2).toUpperCase()}01`;
  const qrData = encodeURIComponent(`https://bloombay.app/scan?club=${club.id}&m=${cardNumber}`);
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=120x120&color=1A0010&bgcolor=FFFFFF&data=${qrData}&qzone=2`;

  return (
    <div style={{ width: "100%", maxWidth: 320, margin: "0 auto", borderRadius: 20, overflow: "hidden", background: `linear-gradient(135deg, ${club.color} 0%, ${club.color}CC 60%, ${club.color}88 100%)`, boxShadow: `0 16px 48px ${club.color}44, 0 4px 0 rgba(0,0,0,0.2)`, position: "relative" }}>
      {/* Noise texture overlay */}
      <div style={{ position: "absolute", inset: 0, background: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23n)' opacity='0.06'/%3E%3C/svg%3E\") repeat", pointerEvents: "none" }} />

      {/* Header */}
      <div style={{ padding: "20px 20px 14px", position: "relative" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <div>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.28em", color: "rgba(255,255,255,0.6)", marginBottom: 3 }}>BLOOMBAY · CLUB MEMBER</p>
            <h2 style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900, fontSize: 20, color: "white", lineHeight: 1 }}>{club.name}</h2>
          </div>
          {/* Club crest placeholder */}
          <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(255,255,255,0.18)", border: "1.5px solid rgba(255,255,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 22 }}>{club.crestEmoji ?? "✦"}</span>
          </div>
        </div>

        {/* Member name */}
        <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 26, fontWeight: 900, color: "white", lineHeight: 1.05 }}>{memberName}</p>
        {memberSince && <p style={{ fontFamily: "var(--font-jost)", fontSize: "9px", color: "rgba(255,255,255,0.55)", marginTop: 3 }}>Member since {memberSince}</p>}
      </div>

      {/* Divider */}
      <div style={{ height: 0, borderTop: "1.5px dashed rgba(255,255,255,0.25)", margin: "0 20px" }} />

      {/* Card body */}
      <div style={{ padding: "14px 20px 18px", display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 12 }}>
        <div>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.18em", color: "rgba(255,255,255,0.5)", marginBottom: 4 }}>CARD NUMBER</p>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: 13, fontWeight: 700, color: "white", letterSpacing: "0.12em" }}>{cardNumber}</p>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", color: "rgba(255,255,255,0.45)", marginTop: 6, letterSpacing: "0.08em" }}>SCAN AT DOOR · MEMBERS ONLY</p>
        </div>
        {/* QR code */}
        <div style={{ background: "white", borderRadius: 10, padding: 8, boxShadow: "0 4px 16px rgba(0,0,0,0.2)", flexShrink: 0 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={qrUrl} alt="Scan" width={80} height={80} style={{ display: "block", borderRadius: 4 }} />
        </div>
      </div>

      {/* Bottom accent stripe */}
      <div style={{ height: 6, background: "rgba(0,0,0,0.2)" }} />
    </div>
  );
}

// ─── Club Kit Sheet ──────────────────────────────────────────────────────────

function ClubKitSheet({ club, onClose }: { club: ClubLandingData; onClose: () => void }) {
  return (
    <>
      <div style={{ position: "fixed", inset: 0, zIndex: 70, background: "rgba(0,0,0,0.65)", backdropFilter: "blur(8px)" }} onClick={onClose} />
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 71, borderRadius: "24px 24px 0 0", background: "var(--bb-card, #FFF)", maxHeight: "90vh", overflowY: "auto", paddingBottom: "max(24px, env(safe-area-inset-bottom))", boxShadow: "0 -12px 48px rgba(0,0,0,0.2)" }}>
        <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 8px" }}>
          <div style={{ width: 36, height: 4, borderRadius: 999, background: "rgba(0,0,0,0.1)" }} />
        </div>
        <div style={{ padding: "4px 24px 20px" }}>
          {/* Header */}
          <div style={{ marginBottom: 20, textAlign: "center" as const }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.28em", color: `${club.color}99`, marginBottom: 6 }}>✦ WELCOME TO THE CLUB</p>
            <h2 style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900, fontSize: 28, color: "var(--bb-text, #111)", lineHeight: 1, marginBottom: 6 }}>Your Club Kit.</h2>
            <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 13, color: "var(--bb-text-3, #888)" }}>Everything you need to be part of {club.name}</p>
          </div>
          {/* The membership card */}
          <ClubMembershipCard club={club} memberSince={new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })} />
          {/* Info items */}
          <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { icon: "✦", label: "Scannable at the door", desc: "Show your card to access members-only events" },
              { icon: "🌸", label: "Exclusive access", desc: "Club events, zones, and member-only spaces" },
              { icon: "💌", label: "Card lives in your club", desc: "Always find it in the Members tab" },
            ].map(item => (
              <div key={item.label} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 14px", background: `${club.color}08`, borderRadius: 14, border: `1px solid ${club.color}15` }}>
                <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>{item.icon}</span>
                <div>
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: 12, fontWeight: 700, color: "var(--bb-text, #111)", marginBottom: 2 }}>{item.label}</p>
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: 11, color: "var(--bb-text-3, #888)" }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <button onClick={onClose} style={{ width: "100%", marginTop: 20, padding: "15px", borderRadius: 16, background: club.color, border: "none", cursor: "pointer", fontFamily: "var(--font-jost)", fontWeight: 700, fontSize: 14, color: "white", letterSpacing: "0.04em", boxShadow: `0 6px 24px ${club.color}44` }}>
            Enter the club →
          </button>
        </div>
      </div>
    </>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export interface ClubCustomization {
  crest_shape?: string;
  crest_symbol?: string;
  crest_color_primary?: string;
  crest_color_secondary?: string;
  crest_color_accent?: string;
  accent_color?: string;
  cover_url?: string;
}

export function ClubLandingPage({ club = DEFAULT_CLUB, isMember = false, daysInClub = 0, isOwner = false, customization }: { club?: ClubLandingData; isMember?: boolean; daysInClub?: number; isOwner?: boolean; customization?: ClubCustomization }) {
  const [brandPhotos, setBrandPhotos] = useState<string[]>([]);
  const brandPhotoInputRef = useRef<HTMLInputElement>(null);
  const [applied, setApplied] = useState(false);
  const [applying, setApplying] = useState(false);
  const [applyError, setApplyError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [clubTab, setClubTab] = useState<ClubTab>("about");
  const [introText, setIntroText] = useState("");
  const [, startT] = useTransition();
  const [kickedIds, setKickedIds] = useState<Set<string>>(new Set());
  const [blockedIds, setBlockedIds] = useState<Set<string>>(new Set());
  const [memberMenu, setMemberMenu] = useState<string | null>(null);
  const [showMyCard, setShowMyCard] = useState(false);
  const [showClubKit, setShowClubKit] = useState(false);
  const [memberSearch, setMemberSearch] = useState("");
  const [ownerFilter, setOwnerFilter] = useState<"all" | "flagged" | "blocked">("all");

  const brandColor = customization?.accent_color ?? club.color;
  const isPaid = club.accessType === "one_time" || club.accessType === "subscription";
  const ctaLabel = isPaid ? "JOIN · CHECKOUT →" : (club.entryStyle === "open" ? "JOIN THE CLUB" : "APPLY TO JOIN");

  async function handleCTA() {
    if (isPaid) {
      // Stripe checkout for paid clubs
      try {
        const res = await fetch("/api/payments/stripe/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "club", clubId: club.id }),
        });
        const { url, error } = await res.json();
        if (error) { setApplyError(error); return; }
        window.location.href = url;
      } catch {
        setApplyError("Checkout failed. Please try again.");
      }
      return;
    }
    setShowForm(true);
  }

  return (
    <div style={{ background: "linear-gradient(160deg, #FFF0F8 0%, #FFE8F4 30%, #FFF5F0 60%, #FFF0F8 100%)", minHeight: "100vh", fontFamily: "var(--font-jost)", paddingBottom: 120 }}>

      {/* ════════════════════════════════════════════════════════════════════
          NON-MEMBER LANDING
      ════════════════════════════════════════════════════════════════════ */}
      {!isMember && (
        <>
          {/* ── HERO ─────────────────────────────────────────────────────── */}
          <section style={{ background: "#FFF0F8", backgroundImage: PAPER_TEX, padding: "52px 20px 40px", position: "relative", overflow: "hidden" }}>
            {/* Back nav */}
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, padding: "12px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", zIndex: 10 }}>
              <Link href="/member/clubs" style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, fontWeight: 600, color: DARK, textDecoration: "none", opacity: 0.65 }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 11.5L4.5 7 9 2.5" stroke={DARK} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                Clubs
              </Link>
              <BBLogo size={26} />
            </div>

            {/* Two-column hero */}
            <div style={{ position: "relative", minHeight: 290 }}>

              {/* Left: text */}
              <div style={{ maxWidth: "56%", paddingTop: 8 }}>
                {/* Club Mama tag */}
                <div style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "rgba(255,31,125,0.08)", border: "1px solid rgba(255,31,125,0.22)", borderRadius: 20, padding: "3px 10px", marginBottom: 12 }}>
                  <span style={{ fontFamily: "var(--font-caveat)", fontSize: 13, color: PINK }}>club mama ♡</span>
                </div>

                {/* Club name */}
                <h1 style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 700, fontSize: "clamp(28px,9vw,40px)", lineHeight: 1.06, color: DARK, margin: "0 0 6px" }}>
                  {club.name}
                </h1>
                {/* Accent line */}
                <div style={{ width: 44, height: 3, background: club.color, borderRadius: 2, marginBottom: 10 }} />

                {/* Tagline */}
                <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 13, color: DARK, opacity: 0.62, marginBottom: 14, lineHeight: 1.5 }}>{club.tagline}</p>

                {/* About blurb */}
                <p style={{ fontSize: 11, lineHeight: 1.65, color: DARK, opacity: 0.52, marginBottom: 20 }}>
                  {club.about.length > 120 ? club.about.slice(0, 118) + "…" : club.about}
                </p>

                {/* CTA */}
                {applied ? (
                  <div style={{ display: "inline-block", padding: "10px 22px", borderRadius: 24, background: "#FFF9E6", color: "#b45309", fontSize: 11, fontWeight: 700 }}>Applied ✓</div>
                ) : (
                  <button onClick={handleCTA} style={{ padding: "10px 22px", borderRadius: 24, background: club.color, color: "white", fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", border: "none", cursor: "pointer", boxShadow: `0 4px 18px ${club.color}44` }}>
                    {ctaLabel}
                  </button>
                )}

                {/* Powered by */}
                <p style={{ fontFamily: "var(--font-caveat)", fontSize: 12, color: DARK, opacity: 0.42, marginTop: 10 }}>
                  powered by Club Mama ♡
                </p>

                {/* Member faces + live pulse */}
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 18 }}>
                  <div style={{ display: "flex" }}>
                    {(["A","K","F","T","O"] as string[]).map((init, i) => (
                      <div key={i} style={{ width: 24, height: 24, borderRadius: "50%", border: "2px solid #FFF0F8", marginLeft: i > 0 ? -7 : 0, background: [PINK,"#FF69B4","#6b4fa0","#3e7c6b","#b07856"][i], display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, fontWeight: 700, color: "white", flexShrink: 0 }}>{init}</div>
                    ))}
                    <div style={{ width: 24, height: 24, borderRadius: "50%", border: "2px solid #FFF0F8", marginLeft: -7, background: "rgba(0,0,0,0.07)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 7, fontWeight: 700, color: "rgba(0,0,0,0.4)", flexShrink: 0 }}>+{club.memberCount - 5}</div>
                  </div>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22C55E", flexShrink: 0 }} />
                      <p style={{ fontSize: 10, fontWeight: 600, color: "rgba(0,0,0,0.55)" }}>47 active this week</p>
                    </div>
                    <p style={{ fontSize: 10, color: "rgba(0,0,0,0.36)", marginTop: 1 }}>{club.memberCount.toLocaleString()} girls total</p>
                  </div>
                </div>
              </div>

              {/* Right: stacked polaroids */}
              <div style={{ position: "absolute", top: 0, right: 0, width: "42%" }}>
                {club.photos && club.photos[0] && (
                  <div style={{ width: "92%", marginLeft: "auto", background: "white", padding: "5px 5px 22px", boxShadow: "3px 6px 22px rgba(0,0,0,0.15)", transform: "rotate(3.5deg)", position: "relative", zIndex: 2 }}>
                    <div style={{ width: "100%", height: 118, background: club.photos[0].grad, borderRadius: 1 }} />
                    <p style={{ fontFamily: "var(--font-caveat)", fontSize: 9.5, color: DARK, opacity: 0.55, textAlign: "center", marginTop: 5, lineHeight: 1.3 }}>{club.photos[0].label} ♡</p>
                  </div>
                )}
                {club.photos && club.photos[1] && (
                  <div style={{ width: "80%", background: "white", padding: "5px 5px 18px", boxShadow: "3px 5px 18px rgba(0,0,0,0.12)", transform: "rotate(-2.2deg)", position: "relative", zIndex: 1, marginTop: -20 }}>
                    <div style={{ width: "100%", height: 96, background: club.photos[1].grad, borderRadius: 1 }} />
                    <p style={{ fontFamily: "var(--font-caveat)", fontSize: 9.5, color: DARK, opacity: 0.55, textAlign: "center", marginTop: 5, lineHeight: 1.3 }}>{club.photos[1].label}</p>
                  </div>
                )}
                {/* Sticky note */}
                <div style={{ position: "absolute", bottom: -24, right: -10, background: "#FFF8A0", padding: "7px 9px", transform: "rotate(2.5deg)", boxShadow: "1px 2px 8px rgba(0,0,0,0.13)", fontSize: 9, fontFamily: "var(--font-caveat)", lineHeight: 1.55, color: DARK, zIndex: 5, minWidth: 82 }}>
                  connection<br />community<br />inspiration ♡
                </div>
              </div>
            </div>

            {/* Peony decoration */}
            <PeonyDecor style={{ position: "absolute", bottom: -8, left: -10 }} />
          </section>

          {/* ── FEATURES ROW ─────────────────────────────────────────────── */}
          {(club.features ?? []).length > 0 && (
            <section style={{ background: "white", backgroundImage: PAPER_TEX, padding: "24px 20px 20px", borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px 20px" }}>
                {(club.features ?? []).map(f => (
                  <div key={f.title}>
                    <span style={{ fontSize: 22, display: "block", marginBottom: 5 }}>{f.emoji}</span>
                    <p style={{ fontWeight: 700, fontSize: 11, color: DARK, marginBottom: 3 }}>{f.title}</p>
                    <p style={{ fontSize: 10, color: DARK, opacity: 0.48, lineHeight: 1.55, fontFamily: "var(--font-playfair)", fontStyle: "italic" }}>{f.desc}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ── UPCOMING GATHERINGS ──────────────────────────────────────── */}
          <section style={{ padding: "24px 20px" }}>
            <div style={{ background: DARK, backgroundImage: PAPER_TEX, padding: "20px 18px 18px", position: "relative" }}>
              {/* Washi tape at top */}
              <div style={{ position: "absolute", top: -9, left: "50%", transform: "translateX(-50%) rotate(-1deg)", zIndex: 4 }}>
                <WashiTape color="yellow" width={80} height={18} />
              </div>
              <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.22em", color: "rgba(255,255,255,0.38)", marginBottom: 18 }}>UPCOMING GATHERINGS</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {club.upcomingSeats.map((event, i) => {
                  const { month, day } = parseDatePill(event.date);
                  return (
                    <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                      {/* Date pill */}
                      <div style={{ flexShrink: 0, width: 42, background: club.color, display: "flex", flexDirection: "column", alignItems: "center", padding: "5px 0 6px" }}>
                        <span style={{ fontSize: 7, fontWeight: 700, letterSpacing: "0.08em", color: "rgba(255,255,255,0.82)" }}>{month}</span>
                        <span style={{ fontSize: 20, fontWeight: 700, color: "white", lineHeight: 1.05 }}>{day}</span>
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 700, fontSize: 13, color: "white", lineHeight: 1.3 }}>{event.title}</p>
                        {event.location && <p style={{ fontSize: 10, color: "rgba(255,255,255,0.42)", marginTop: 2 }}>{event.location}</p>}
                        {event.going && <p style={{ fontSize: 10, fontWeight: 600, color: club.color, marginTop: 4 }}>{event.going} girls going →</p>}
                      </div>
                    </div>
                  );
                })}
              </div>
              <button style={{ marginTop: 18, fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", color: club.color, background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                VIEW ALL EVENTS →
              </button>
            </div>
          </section>

          {/* ── ABOUT US + NOTE CARD ─────────────────────────────────────── */}
          <section style={{ padding: "0 20px 24px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, alignItems: "start" }}>
            <div>
              <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.22em", color: DARK, opacity: 0.38, marginBottom: 10 }}>ABOUT US</p>
              <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 12, color: DARK, opacity: 0.68, lineHeight: 1.7 }}>{club.about}</p>
            </div>
            <div style={{ background: "rgba(255,248,210,0.85)", backgroundImage: PAPER_TEX, padding: "18px 14px 14px", transform: "rotate(-1.6deg)", boxShadow: "2px 4px 14px rgba(0,0,0,0.08)", position: "relative", display: "flex", flexDirection: "column", justifyContent: "center", minHeight: 120 }}>
              <Tape />
              <p style={{ fontFamily: "var(--font-caveat)", fontSize: 15, color: DARK, lineHeight: 1.6, textAlign: "center", marginTop: 4, whiteSpace: "pre-line" }}>
                {club.aboutNote ?? "come for the\nconnection ♡"}
              </p>
            </div>
          </section>

          {/* ── TRADITIONS ───────────────────────────────────────────────── */}
          {(club.traditions ?? []).length > 0 && (
            <section style={{ paddingBottom: 28 }}>
              <TraditionsSection club={club} />
            </section>
          )}

          {/* ── PAST EVENTS ──────────────────────────────────────────────── */}
          {(club.photos ?? []).length > 0 && (
            <section style={{ padding: "0 20px 24px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.22em", color: DARK, opacity: 0.38 }}>PAST EVENTS</p>
                <span style={{ fontFamily: "var(--font-caveat)", fontSize: 13, color: PINK }}>see more memories →</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                {(club.photos ?? []).slice(0, 4).map((photo, i) => (
                  <div key={i} style={{ aspectRatio: "1 / 1", background: photo.grad, position: "relative", overflow: "hidden" }}>
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.52) 0%, transparent 55%)" }} />
                    <p style={{ position: "absolute", bottom: 6, left: 7, right: 7, fontFamily: "var(--font-caveat)", fontSize: 10, color: "white", lineHeight: 1.3 }}>{photo.label}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ── VOICE NOTE ───────────────────────────────────────────────── */}
          {club.mamaVoiceSeconds && (
            <div style={{ paddingBottom: 28 }}>
              <VoiceNoteCard mama={club.mamaName} seconds={club.mamaVoiceSeconds} color={club.color} />
            </div>
          )}

          {/* ── OUR MOMENTS TOGETHER ─────────────────────────────────────── */}
          {(club.photos ?? []).length > 0 && (
            <section style={{ paddingBottom: 28 }}>
              <div style={{ padding: "0 20px 14px", display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                <div>
                  <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.22em", color: DARK, opacity: 0.38, marginBottom: 2 }}>OUR MOMENTS TOGETHER</p>
                  <p style={{ fontFamily: "var(--font-caveat)", fontSize: 14, color: DARK, opacity: 0.55 }}>every gathering, every memory ♡</p>
                </div>
                {/* Sticky sticker */}
                <div style={{ background: "#FFF8A0", padding: "6px 8px", transform: "rotate(3deg)", boxShadow: "1px 2px 6px rgba(0,0,0,0.1)", fontSize: 9, fontFamily: "var(--font-caveat)", lineHeight: 1.45, color: DARK, textAlign: "center", flexShrink: 0 }}>
                  add your<br />favorites ♡
                </div>
              </div>
              <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingLeft: 20, paddingRight: 20, paddingBottom: 6, scrollbarWidth: "none" }}>
                {(club.photos ?? []).map((photo, i) => (
                  <div key={i} style={{ flexShrink: 0, width: 96, height: 96, background: photo.grad, position: "relative" }}>
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.3) 0%, transparent 60%)" }} />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ── BRAND GALLERY ────────────────────────────────────────────── */}
          {(isOwner || brandPhotos.length > 0) && (
            <section style={{ padding: "0 20px 28px" }}>
              <input ref={brandPhotoInputRef} type="file" accept="image/*" multiple onChange={e => { Array.from(e.target.files ?? []).forEach(f => setBrandPhotos(prev => [...prev, URL.createObjectURL(f)])); e.target.value = ""; }} style={{ display: "none" }} />
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                <div>
                  <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.22em", color: DARK, opacity: 0.38, marginBottom: 2 }}>BRAND GALLERY</p>
                  <p style={{ fontFamily: "var(--font-caveat)", fontSize: 13, color: DARK, opacity: 0.45 }}>mood, moments & vibe ✦</p>
                </div>
                {isOwner && (
                  <button onClick={() => brandPhotoInputRef.current?.click()} style={{ padding: "6px 14px", borderRadius: 20, background: brandColor, border: "none", cursor: "pointer", fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 800, letterSpacing: "0.1em", color: "white" }}>+ ADD</button>
                )}
              </div>
              {brandPhotos.length === 0 ? (
                <button onClick={() => brandPhotoInputRef.current?.click()} style={{ width: "100%", background: "rgba(0,0,0,0.03)", border: `1.5px dashed ${brandColor}44`, borderRadius: 16, padding: "36px 20px", cursor: "pointer", fontFamily: "var(--font-caveat)", fontSize: 15, color: "rgba(0,0,0,0.25)", fontStyle: "italic" }}>
                  Add photos to showcase the club's aesthetic, mood, and brand
                </button>
              ) : (
                <div style={{ display: "flex", gap: 8, overflowX: "auto", marginLeft: -20, paddingLeft: 20, paddingRight: 20, paddingBottom: 4, scrollbarWidth: "none" as const }}>
                  {brandPhotos.map((url, i) => (
                    <div key={i} style={{ flexShrink: 0, position: "relative" }}>
                      <img src={url} alt="" style={{ width: 160, height: 200, borderRadius: 16, objectFit: "cover", display: "block", boxShadow: "0 4px 18px rgba(0,0,0,0.14)" }} />
                      {isOwner && (
                        <button onClick={() => setBrandPhotos(prev => prev.filter((_, j) => j !== i))} style={{ position: "absolute", top: 8, right: 8, width: 24, height: 24, borderRadius: "50%", background: "rgba(0,0,0,0.55)", border: "none", cursor: "pointer", color: "white", fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
                      )}
                    </div>
                  ))}
                  {isOwner && (
                    <button onClick={() => brandPhotoInputRef.current?.click()} style={{ flexShrink: 0, width: 100, height: 200, borderRadius: 16, border: `1.5px dashed ${brandColor}55`, background: `${brandColor}06`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: brandColor, fontSize: 28, fontWeight: 300 }}>+</button>
                  )}
                </div>
              )}
            </section>
          )}

          {/* ── MEMBER PHOTOS + VOICE NOTES ─────────────────────────────── */}
          <ClubMediaSection clubId={club.id} color={club.color} isMember={isMember} />

          {/* ── WHAT OUR GIRLS SAY ───────────────────────────────────────── */}
          {(club.testimonials ?? []).length > 0 && (
            <section style={{ background: "white", backgroundImage: PAPER_TEX, padding: "28px 20px 32px" }}>
              <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.22em", color: DARK, opacity: 0.38, marginBottom: 24 }}>WHAT OUR GIRLS SAY</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
                {(club.testimonials ?? []).map((t, i) => (
                  <div key={i}>
                    <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 36, color: t.color, lineHeight: 1, marginBottom: 2, opacity: 0.65 }}>&ldquo;</p>
                    <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 14, color: DARK, lineHeight: 1.65, marginBottom: 12 }}>{t.quote}</p>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 30, height: 30, borderRadius: "50%", background: `radial-gradient(circle at 35% 35%, ${t.color}, ${t.color}88)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "white", flexShrink: 0 }}>{t.initial}</div>
                      <div>
                        <p style={{ fontSize: 11, fontWeight: 700, color: DARK }}>{t.name}</p>
                        <p style={{ fontSize: 10, color: DARK, opacity: 0.38, fontFamily: "var(--font-playfair)", fontStyle: "italic" }}>{t.event}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ── INSIDE THE ZONES TEASER ──────────────────────────────────── */}
          <section style={{ padding: "0 20px 28px" }}>
            <div style={{ background: DARK, borderRadius: 24, overflow: "hidden", position: "relative" }}>
              {/* Top accent bar */}
              <div style={{ height: 3, background: `linear-gradient(90deg, ${club.color}, #FF69B4, #7C3AED)` }} />
              <div style={{ padding: "20px 18px 18px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                  <div>
                    <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.22em", color: "rgba(255,255,255,0.35)", marginBottom: 4 }}>HAPPENING IN THE ZONES</p>
                    <p style={{ fontFamily: "var(--font-caveat)", fontSize: 14, color: "rgba(255,255,255,0.55)" }}>right now, inside ♡</p>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22C55E" }} />
                    <span style={{ fontSize: 10, fontWeight: 600, color: "#22C55E" }}>live</span>
                  </div>
                </div>

                {/* Weekly prompt visible (read, to create FOMO) */}
                <div style={{ background: "rgba(255,248,210,0.10)", border: "1px solid rgba(255,248,210,0.18)", borderRadius: 16, padding: "12px 14px", marginBottom: 12 }}>
                  <div style={{ display: "inline-flex", background: `${club.color}`, borderRadius: 8, padding: "2px 8px", marginBottom: 8 }}>
                    <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.14em", color: "white" }}>THIS WEEK&apos;S PROMPT</span>
                  </div>
                  <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 13, color: "rgba(255,255,255,0.78)", lineHeight: 1.55, marginBottom: 8 }}>
                    &ldquo;{(club.zones ?? [])[0]?.weeklyPrompt ?? "What inspired you most this week?"}&rdquo;
                  </p>
                  <p style={{ fontSize: 10, color: "rgba(255,255,255,0.32)" }}>
                    14 zone members responded · <span style={{ color: club.color }}>join to read them</span>
                  </p>
                </div>

                {/* Blurred activity previews */}
                <div style={{ display: "flex", flexDirection: "column", gap: 8, filter: "blur(3px)", userSelect: "none", pointerEvents: "none" }}>
                  {[
                    { init: "A", col: PINK, lines: ["The Degas pastels at the Met — I never realized", "how textured they are in person. I stood there for", "20 minutes and it changed something in me."], len: [180, 168, 152] },
                    { init: "K", col: "#FF69B4", lines: ["I finally did a 30-minute sit with one painting at the", "Frick. Slow looking genuinely changes how you see."], len: [200, 175] },
                  ].map((item, idx) => (
                    <div key={idx} style={{ background: "rgba(255,255,255,0.06)", borderRadius: 14, padding: "10px 12px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                        <div style={{ width: 26, height: 26, borderRadius: "50%", background: item.col, flexShrink: 0 }} />
                        <div style={{ height: 8, width: 72, background: "rgba(255,255,255,0.25)", borderRadius: 4 }} />
                      </div>
                      {item.lines.map((_, li) => (
                        <div key={li} style={{ height: 8, width: item.len[li], maxWidth: "100%", background: "rgba(255,255,255,0.16)", borderRadius: 4, marginBottom: li < item.lines.length - 1 ? 5 : 0 }} />
                      ))}
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: 14, textAlign: "center" }}>
                  <p style={{ fontFamily: "var(--font-caveat)", fontSize: 13, color: "rgba(255,255,255,0.38)" }}>join to see what&apos;s inside ♡</p>
                </div>
              </div>
            </div>
          </section>

          {/* ── GIRL ZONES TEASER ────────────────────────────────────────── */}
          <section style={{ padding: "0 20px 28px" }}>
            <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.22em", color: DARK, opacity: 0.38, marginBottom: 14 }}>GIRL ZONES</p>
            <GirlZonesSection club={club} isMember={false} daysInClub={0} />
          </section>

          {/* ── BOTTOM CTA ───────────────────────────────────────────────── */}
          <section style={{ padding: "0 20px 48px" }}>
            {isOwner ? (
              <Link href={`/member/clubs/${club.id}/manage`} style={{ display: "block", width: "100%", padding: "16px 0", borderRadius: 32, background: club.color, color: "white", fontWeight: 700, fontSize: 14, letterSpacing: "0.06em", textAlign: "center", textDecoration: "none", boxShadow: `0 6px 24px ${club.color}44` }}>
                MANAGE CLUB ✦
              </Link>
            ) : applied ? (
              <div style={{ width: "100%", padding: "16px 0", borderRadius: 32, background: "#FFF9E6", color: "#b45309", fontWeight: 700, fontSize: 14, textAlign: "center" }}>Application Submitted ✓</div>
            ) : (
              <>
                <button onClick={handleCTA} style={{ width: "100%", padding: "16px 0", borderRadius: 32, background: club.color, color: "white", fontWeight: 700, fontSize: 14, letterSpacing: "0.06em", border: "none", cursor: "pointer", boxShadow: `0 6px 24px ${club.color}44` }}>
                  {ctaLabel}
                </button>
                {club.entryStyle !== "open" && (
                  <p style={{ textAlign: "center", fontSize: 11, color: DARK, opacity: 0.38, marginTop: 10 }}>
                    {club.entryStyle === "application" ? "The Club Mama reviews every application." : "Apply → Club Mama approves → pay to enter."}
                  </p>
                )}
              </>
            )}
          </section>

          {/* ── FOOTER ───────────────────────────────────────────────────── */}
          <footer style={{ background: "#FFF0F8", backgroundImage: PAPER_TEX, padding: "36px 20px 80px", position: "relative", borderTop: "1px solid rgba(0,0,0,0.07)", overflow: "hidden" }}>
            <PeonyDecor style={{ position: "absolute", bottom: 16, right: -12, transform: "scaleX(-1)" }} />
            <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 700, fontSize: 30, color: PINK, marginBottom: 4 }}>bloomBay*</p>
            <p style={{ fontFamily: "var(--font-caveat)", fontSize: 14, color: DARK, opacity: 0.5, marginBottom: 20 }}>Questions? We&apos;re here.</p>
            <p style={{ fontFamily: "var(--font-caveat)", fontSize: 12, color: DARK, opacity: 0.38 }}>she&apos;s blooming in the city ♡</p>
            <p style={{ fontFamily: "var(--font-caveat)", fontSize: 13, color: DARK, opacity: 0.52, textAlign: "right", marginTop: 24 }}>see you out there ♡</p>
          </footer>
        </>
      )}

      {/* ════════════════════════════════════════════════════════════════════
          MEMBER VIEW
      ════════════════════════════════════════════════════════════════════ */}
      {isMember && (
        <>
          {/* Compact header */}
          <div style={{ background: "#FFF0F8", backgroundImage: PAPER_TEX, padding: "52px 20px 20px", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, padding: "12px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <Link href="/member/clubs" style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, fontWeight: 600, color: DARK, textDecoration: "none", opacity: 0.65 }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 11.5L4.5 7 9 2.5" stroke={DARK} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                Clubs
              </Link>
              <BBLogo size={26} />
            </div>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginTop: 8 }}>
              {customization?.crest_shape ? (
                <CrestSVG
                  config={{
                    shape: (customization.crest_shape as CrestConfig["shape"]),
                    symbol: ((customization.crest_symbol ?? "flower") as CrestConfig["symbol"]),
                    font: "serif",
                    colorPrimary: customization.crest_color_primary ?? club.color,
                    colorSecondary: customization.crest_color_secondary ?? "#FEFCF7",
                    colorAccent: customization.crest_color_accent ?? "#D4A853",
                    showBannerText: true,
                    bannerText: "EST. 2026",
                  }}
                  clubName={club.name}
                  size={60}
                />
              ) : (
                <ClubCrest name={club.name} color={club.color} crestBg={club.crestBg} size={60} />
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 4, background: "rgba(255,31,125,0.08)", border: "1px solid rgba(255,31,125,0.2)", borderRadius: 20, padding: "2px 8px", marginBottom: 6 }}>
                  <span style={{ fontFamily: "var(--font-caveat)", fontSize: 11, color: PINK }}>club mama ♡</span>
                </div>
                <h1 style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 700, fontSize: 24, color: DARK, lineHeight: 1.12, margin: 0 }}>{club.name}</h1>
                <p style={{ fontSize: 11, color: DARK, opacity: 0.45, marginTop: 4 }}>{club.memberCount.toLocaleString()} members · {club.city}</p>
              </div>
            </div>
          </div>

          {/* Tab bar */}
          <div style={{ display: "flex", borderBottom: "1px solid rgba(0,0,0,0.07)", background: "white", overflowX: "auto", scrollbarWidth: "none" }}>
            {(["about", "chat", "zones", "events", "members"] as ClubTab[]).map(t => (
              <button key={t} onClick={() => setClubTab(t)} style={{ flex: 1, padding: "13px 12px", fontSize: 12, fontWeight: 600, border: "none", background: "none", cursor: "pointer", borderBottom: clubTab === t ? `2.5px solid ${brandColor}` : "2.5px solid transparent", color: clubTab === t ? brandColor : "rgba(0,0,0,0.35)", whiteSpace: "nowrap", minWidth: 64 }}>
                {t === "about" ? "About" : t === "chat" ? "Chat" : t === "zones" ? "Zones" : t === "events" ? "Events" : "Members"}
              </button>
            ))}
          </div>

          {/* ── About tab ── */}
          {clubTab === "about" && (
            <div style={{ padding: "24px 20px 80px", display: "flex", flexDirection: "column", gap: 20 }}>
              {/* ── Traditions ── */}
              {(club.traditions ?? []).length > 0 && (
                <div style={{ background: "white", borderRadius: 24, overflow: "hidden", boxShadow: "0 1px 8px rgba(0,0,0,0.05)", paddingTop: 18 }}>
                  <TraditionsSection club={club} />
                  <div style={{ height: 4 }} />
                </div>
              )}
              <div style={{ background: "white", borderRadius: 24, padding: "18px 20px", boxShadow: "0 1px 8px rgba(0,0,0,0.05)" }}>
                <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", color: club.color, marginBottom: 10 }}>ABOUT THIS CLUB</p>
                <p style={{ fontSize: 13, lineHeight: 1.65, color: "rgba(0,0,0,0.6)" }}>{club.about}</p>
              </div>
              <div style={{ background: `${club.color}10`, borderRadius: 24, padding: "18px 20px", border: `1px solid ${club.color}25` }}>
                <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", color: club.color, marginBottom: 8 }}>WHO IT&apos;S FOR</p>
                <p style={{ fontSize: 13, fontWeight: 500, lineHeight: 1.6, color: DARK }}>{club.whoItsFor}</p>
              </div>
              <div style={{ background: "white", borderRadius: 24, padding: "18px 20px", boxShadow: "0 1px 8px rgba(0,0,0,0.05)" }}>
                <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", color: club.color, marginBottom: 12 }}>WHAT MEMBERS DO</p>
                <ul style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {club.whatMembersDo.map((item, i) => (
                    <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, fontSize: 13, color: "rgba(0,0,0,0.6)" }}>
                      <div style={{ width: 20, height: 20, borderRadius: "50%", flexShrink: 0, background: `${club.color}18`, display: "flex", alignItems: "center", justifyContent: "center", marginTop: 1 }}>
                        <svg width="9" height="9" viewBox="0 0 9 9" fill="none"><path d="M1 4.5l2.5 2.5L8 1.5" stroke={club.color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <GirlZonesSection club={club} isMember={true} daysInClub={daysInClub} />
              {/* Club Mama */}
              <div style={{ background: "white", borderRadius: 24, padding: "18px 20px", boxShadow: "0 1px 8px rgba(0,0,0,0.05)" }}>
                <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", color: club.color, marginBottom: 14 }}>CLUB MAMA</p>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                  <div style={{ width: 52, height: 52, borderRadius: "50%", flexShrink: 0, background: `radial-gradient(circle at 35% 35%, ${club.color}, ${club.crestBg ?? "#3a0018"})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 700, color: "white" }}>{club.mamaName[0]}</div>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 700, color: DARK }}>{club.mamaName}</p>
                    <p style={{ fontSize: 11, fontWeight: 500, color: club.color, marginTop: 2 }}>{club.mamaTitle}</p>
                    <p style={{ fontSize: 12, color: "rgba(0,0,0,0.5)", marginTop: 8, lineHeight: 1.6 }}>{club.mamaBio}</p>
                  </div>
                </div>
              </div>
              {club.rules && club.rules.length > 0 && (
                <div style={{ background: DARK, borderRadius: 24, padding: "18px 20px" }}>
                  <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", color: "rgba(255,255,255,0.38)", marginBottom: 12 }}>HOUSE RULES</p>
                  <ul style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {club.rules.map((rule, i) => (
                      <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, fontSize: 13, color: "rgba(255,255,255,0.82)" }}>
                        <span style={{ fontWeight: 700, color: club.color, flexShrink: 0 }}>0{i + 1}</span>
                        {rule}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Leave club — quiet, at the bottom, requires confirmation */}
              <LeaveClubButton clubName={club.name} />
            </div>
          )}

          {/* ── Zones tab ── */}
          {clubTab === "zones" && (
            <div style={{ padding: "20px 20px 90px", display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ marginBottom: 4 }}>
                <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", color: club.color }}>GIRL ZONES</p>
                <p style={{ fontSize: 11, color: "rgba(0,0,0,0.4)", marginTop: 3 }}>smaller circles, deeper connections</p>
              </div>

              {(club.zones ?? []).map(zone => {
                const zc = zone.zoneColor ?? club.color;
                return (
                  <Link key={zone.id} href={`/member/clubs/${club.id}/zones/${zone.id}`} style={{ textDecoration: "none" }}>
                    <div style={{ background: "white", borderRadius: 22, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.07)", cursor: "pointer" }}>
                      {/* Zone color strip */}
                      <div style={{ height: 4, background: `linear-gradient(90deg, ${zc}, ${zc}99)` }} />
                      <div style={{ padding: "16px 18px 14px" }}>
                        {/* Header row */}
                        <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 12 }}>
                          <div style={{ width: 44, height: 44, borderRadius: 14, background: `${zc}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{zone.emoji}</div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                              <p style={{ fontSize: 14, fontWeight: 700, color: "#111" }}>{zone.name}</p>
                              {zone.price && <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 7px", borderRadius: 20, background: "#FFF9E6", color: "#b45309" }}>${zone.price}/mo</span>}
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                              <span style={{ fontSize: 11, color: "rgba(0,0,0,0.4)" }}>{zone.memberCount} members</span>
                              {zone.activeThisWeek && (
                                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                                  <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#22C55E" }} />
                                  <span style={{ fontSize: 11, color: "#22C55E", fontWeight: 600 }}>{zone.activeThisWeek} active</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: 4, color: zc, flexShrink: 0, paddingTop: 2 }}>
                            <span style={{ fontSize: 12, fontWeight: 700 }}>Enter</span>
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2.5 6h7M6.5 3l3 3-3 3" stroke={zc} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                          </div>
                        </div>

                        {/* Weekly prompt */}
                        {zone.weeklyPrompt && (
                          <div style={{ background: "#FFFBEB", borderRadius: 12, padding: "9px 12px", marginBottom: 10 }}>
                            <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", color: "#B45309", marginBottom: 4 }}>THIS WEEK</p>
                            <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 12, color: "#111", lineHeight: 1.5 }}>
                              &ldquo;{zone.weeklyPrompt.length > 70 ? zone.weeklyPrompt.slice(0, 68) + "…" : zone.weeklyPrompt}&rdquo;
                            </p>
                          </div>
                        )}

                        {/* Last message */}
                        {zone.lastMessage && (
                          <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                            <div style={{ width: 22, height: 22, borderRadius: "50%", background: zc, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, fontWeight: 700, color: "white", flexShrink: 0, marginTop: 1 }}>
                              {zone.lastMessageAuthor?.[0] ?? "?"}
                            </div>
                            <p style={{ fontSize: 11, color: "rgba(0,0,0,0.48)", lineHeight: 1.5, flex: 1, minWidth: 0 }}>
                              <span style={{ fontWeight: 700, color: "rgba(0,0,0,0.6)" }}>{zone.lastMessageAuthor}: </span>
                              {zone.lastMessage.length > 80 ? zone.lastMessage.slice(0, 78) + "…" : zone.lastMessage}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}

              {/* Suggest a zone CTA */}
              {club.allowZoneRequests && (
                <div style={{ background: `${club.color}08`, border: `1.5px dashed ${club.color}30`, borderRadius: 22, padding: "20px 18px", textAlign: "center" }}>
                  <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 15, color: DARK, marginBottom: 6 }}>Have an idea for a zone?</p>
                  <p style={{ fontSize: 12, color: "rgba(0,0,0,0.45)", marginBottom: 14, lineHeight: 1.5 }}>Zone suggestions open after 2 weeks. Your ideas shape this club.</p>
                  <button onClick={() => setClubTab("about")} style={{ padding: "8px 20px", borderRadius: 20, fontSize: 12, fontWeight: 700, background: club.color, color: "white", border: "none", cursor: "pointer" }}>
                    Suggest a zone →
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ── Chat tab ── */}
          {clubTab === "chat" && <ClubChat club={club} daysInClub={daysInClub} />}

          {/* ── Events tab ── */}
          {clubTab === "events" && (
            <div style={{ padding: "24px 20px 80px", display: "flex", flexDirection: "column", gap: 12 }}>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", color: club.color }}>OPEN SEATS</p>
              {club.upcomingSeats.map((seat, i) => (
                <div key={i} style={{ background: "white", borderRadius: 20, padding: "16px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 1px 8px rgba(0,0,0,0.05)" }}>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 700, color: DARK }}>{seat.title}</p>
                    <p style={{ fontSize: 11, color: "rgba(0,0,0,0.4)", marginTop: 2 }}>{seat.date}</p>
                    {seat.price && <p style={{ fontSize: 11, fontWeight: 600, marginTop: 3, color: club.color }}>{seat.price}</p>}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ textAlign: "right" }}>
                      <p style={{ fontSize: 22, fontWeight: 700, color: club.color, lineHeight: 1 }}>{seat.seats}</p>
                      <p style={{ fontSize: 10, color: "rgba(0,0,0,0.38)" }}>seats</p>
                    </div>
                    <button style={{ padding: "8px 16px", borderRadius: 20, fontSize: 12, fontWeight: 700, color: "white", background: club.color, border: "none", cursor: "pointer" }}>RSVP</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── Members tab ── */}
          {clubTab === "members" && (
            <div style={{ padding: "20px 20px 80px" }}>
              {/* My Club Card — shown only if non-owner member */}
              {isMember && !isOwner && (
                <div style={{ marginBottom: 20 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                    <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.2em", color: club.color }}>YOUR MEMBERSHIP CARD</p>
                    {!showMyCard && (
                      <button onClick={() => setShowMyCard(true)} style={{ padding: "5px 14px", borderRadius: 999, background: `${club.color}12`, border: `1px solid ${club.color}30`, cursor: "pointer" }}>
                        <p style={{ fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 700, color: club.color }}>View card</p>
                      </button>
                    )}
                  </div>
                  {showMyCard && (
                    <div style={{ marginBottom: 14 }}>
                      <ClubMembershipCard club={club} memberSince={new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })} />
                      <button onClick={() => setShowMyCard(false)} style={{ width: "100%", marginTop: 8, padding: "10px", borderRadius: 12, background: "rgba(0,0,0,0.05)", border: "none", cursor: "pointer" }}>
                        <p style={{ fontFamily: "var(--font-jost)", fontSize: 12, fontWeight: 600, color: "#888" }}>Hide card</p>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Search bar */}
              <div style={{ position: "relative" as const, marginBottom: 12 }}>
                <svg style={{ position: "absolute" as const, left: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.3)" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <input
                  type="text"
                  placeholder="Search members…"
                  value={memberSearch}
                  onChange={e => setMemberSearch(e.target.value)}
                  style={{ width: "100%", padding: "10px 14px 10px 34px", borderRadius: 14, border: "1.5px solid rgba(0,0,0,0.08)", background: "white", fontFamily: "var(--font-jost)", fontSize: 13, color: "#111", outline: "none", boxSizing: "border-box" as const }}
                />
              </div>

              {/* Owner filter tabs: All / Flagged / Blocked */}
              {isOwner && (() => {
                const flaggedCount = CLUB_MEMBERS.filter(m => m.reports > 0 && !kickedIds.has(m.id)).length;
                const blockedCount = CLUB_MEMBERS.filter(m => blockedIds.has(m.id) && !kickedIds.has(m.id)).length;
                const activeCount = CLUB_MEMBERS.filter(m => !kickedIds.has(m.id)).length;
                return (
                  <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
                    {([
                      { id: "all",     label: `All (${activeCount})`,          alert: false },
                      { id: "flagged", label: `Flagged (${flaggedCount})`,      alert: flaggedCount > 0 },
                      { id: "blocked", label: `Blocked (${blockedCount})`,      alert: blockedCount > 0 },
                    ] as { id: "all"|"flagged"|"blocked"; label: string; alert: boolean }[]).map(f => (
                      <button key={f.id} onClick={() => setOwnerFilter(f.id)}
                        style={{ padding: "6px 12px", borderRadius: 999, fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 800, letterSpacing: "0.06em", cursor: "pointer", border: "none", transition: "all 0.15s",
                          background: ownerFilter === f.id ? (f.id === "flagged" ? "#FEF2F2" : f.id === "blocked" ? "#FFF7ED" : club.color) : "rgba(0,0,0,0.05)",
                          color: ownerFilter === f.id ? (f.id === "flagged" ? "#ef4444" : f.id === "blocked" ? "#F59E0B" : "white") : (f.alert ? (f.id === "flagged" ? "#ef4444" : "#F59E0B") : "rgba(0,0,0,0.45)"),
                        }}>
                        {f.label}
                      </button>
                    ))}
                  </div>
                );
              })()}

              <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.2em", color: club.color, marginBottom: 12 }}>{club.memberCount.toLocaleString()} MEMBERS</p>

              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {CLUB_MEMBERS
                  .filter(m => !kickedIds.has(m.id))
                  .filter(m => memberSearch === "" || m.name.toLowerCase().includes(memberSearch.toLowerCase()))
                  .filter(m => {
                    if (!isOwner) return true;
                    if (ownerFilter === "flagged") return m.reports > 0;
                    if (ownerFilter === "blocked") return blockedIds.has(m.id);
                    return true;
                  })
                  .map(m => {
                    const isMenuOpen = memberMenu === m.id;
                    const isBlocked = blockedIds.has(m.id);
                    const isMama = m.role === "Club Mama";
                    const hasReports = m.reports > 0;
                    return (
                      <div key={m.name} style={{ background: "white", borderRadius: 20, padding: "14px 16px", display: "flex", alignItems: "center", gap: 12, boxShadow: isOwner && hasReports ? "0 0 0 1.5px rgba(239,68,68,0.3), 0 2px 12px rgba(239,68,68,0.08)" : "0 1px 6px rgba(0,0,0,0.04)", opacity: isBlocked ? 0.5 : 1, position: "relative" as const }}>
                        {/* Avatar with report badge */}
                        <div style={{ position: "relative" as const, flexShrink: 0 }}>
                          <div style={{ width: 40, height: 40, borderRadius: "50%", background: m.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "white" }}>{m.initial}</div>
                          {isOwner && hasReports && (
                            <div style={{ position: "absolute" as const, top: -3, right: -3, width: 17, height: 17, borderRadius: "50%", background: "#ef4444", border: "2px solid white", display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 900, color: "white", lineHeight: 1 }}>{m.reports}</p>
                            </div>
                          )}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" as const }}>
                            <p style={{ fontFamily: "var(--font-jost)", fontSize: 13, fontWeight: 600, color: "#111" }}>{m.name}</p>
                            {isBlocked && <span style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 700, color: "#F59E0B", background: "#FFF7ED", padding: "2px 7px", borderRadius: 999 }}>BLOCKED</span>}
                            {isOwner && hasReports && <span style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 700, color: "#ef4444", background: "#FEF2F2", padding: "2px 7px", borderRadius: 999 }}>{m.reports} REPORT{m.reports !== 1 ? "S" : ""}</span>}
                          </div>
                          {isMama && <span style={{ fontFamily: "var(--font-jost)", fontSize: 11, fontWeight: 700, color: club.color }}>Club Mama</span>}
                        </div>

                        {/* Owner ··· menu → Block + Remove */}
                        {isOwner && !isMama && (
                          <div style={{ position: "relative" as const }}>
                            <button onClick={() => setMemberMenu(isMenuOpen ? null : m.id)}
                              style={{ width: 32, height: 32, borderRadius: "50%", background: isMenuOpen ? "#F0F0F0" : "transparent", border: "1px solid rgba(0,0,0,0.1)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ color: "#888" }}><circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/></svg>
                            </button>
                            {isMenuOpen && (
                              <div style={{ position: "absolute" as const, right: 0, top: 36, background: "white", borderRadius: 14, boxShadow: "0 8px 32px rgba(0,0,0,0.14)", border: "1px solid rgba(0,0,0,0.08)", minWidth: 160, zIndex: 20, overflow: "hidden" }}>
                                <button onClick={() => { setBlockedIds(prev => { const n = new Set(prev); n.has(m.id) ? n.delete(m.id) : n.add(m.id); return n; }); setMemberMenu(null); }}
                                  style={{ width: "100%", padding: "12px 16px", textAlign: "left" as const, background: "none", border: "none", cursor: "pointer", borderBottom: "1px solid rgba(0,0,0,0.06)", display: "flex", alignItems: "center", gap: 10 }}>
                                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={isBlocked ? "#22c55e" : "#F59E0B"} strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
                                  <p style={{ fontFamily: "var(--font-jost)", fontSize: 12, fontWeight: 600, color: isBlocked ? "#22c55e" : "#F59E0B" }}>{isBlocked ? "Unblock" : "Block"}</p>
                                </button>
                                <button onClick={() => { setKickedIds(prev => new Set([...prev, m.id])); setMemberMenu(null); }}
                                  style={{ width: "100%", padding: "12px 16px", textAlign: "left" as const, background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}>
                                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="17" y1="11" x2="23" y2="11"/></svg>
                                  <p style={{ fontFamily: "var(--font-jost)", fontSize: 12, fontWeight: 600, color: "#ef4444" }}>Remove from club</p>
                                </button>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Regular member ··· menu */}
                        {!isOwner && !isMama && (
                          <div style={{ position: "relative" as const }}>
                            <button onClick={() => setMemberMenu(isMenuOpen ? null : m.id)}
                              style={{ width: 32, height: 32, borderRadius: "50%", background: isMenuOpen ? "#F0F0F0" : "transparent", border: "1px solid rgba(0,0,0,0.1)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ color: "#888" }}><circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/></svg>
                            </button>
                            {isMenuOpen && (
                              <div style={{ position: "absolute" as const, right: 0, top: 36, background: "white", borderRadius: 14, boxShadow: "0 8px 32px rgba(0,0,0,0.14)", border: "1px solid rgba(0,0,0,0.08)", minWidth: 140, zIndex: 20, overflow: "hidden" }}>
                                <button onClick={() => setMemberMenu(null)}
                                  style={{ width: "100%", padding: "11px 16px", textAlign: "left" as const, background: "none", border: "none", cursor: "pointer", borderBottom: "1px solid rgba(0,0,0,0.06)", display: "flex", alignItems: "center", gap: 10 }}>
                                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2" strokeLinecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                                  <p style={{ fontFamily: "var(--font-jost)", fontSize: 12, fontWeight: 600, color: "#111" }}>Connect</p>
                                </button>
                                <button onClick={() => { setBlockedIds(prev => { const n = new Set(prev); n.has(m.id) ? n.delete(m.id) : n.add(m.id); return n; }); setMemberMenu(null); }}
                                  style={{ width: "100%", padding: "11px 16px", textAlign: "left" as const, background: "none", border: "none", cursor: "pointer", borderBottom: "1px solid rgba(0,0,0,0.06)", display: "flex", alignItems: "center", gap: 10 }}>
                                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={isBlocked ? "#22c55e" : "#F59E0B"} strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
                                  <p style={{ fontFamily: "var(--font-jost)", fontSize: 12, fontWeight: 600, color: isBlocked ? "#22c55e" : "#F59E0B" }}>{isBlocked ? "Unblock" : "Block"}</p>
                                </button>
                                <button onClick={() => setMemberMenu(null)}
                                  style={{ width: "100%", padding: "11px 16px", textAlign: "left" as const, background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 10 }}>
                                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                                  <p style={{ fontFamily: "var(--font-jost)", fontSize: 12, fontWeight: 600, color: "#ef4444" }}>Report</p>
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                        {!isOwner && isMama && (
                          <button style={{ padding: "6px 14px", borderRadius: 20, fontSize: 11, fontWeight: 600, color: club.color, background: `${club.color}10`, border: "none", cursor: "pointer" }}>Connect</button>
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>
          )}
        </>
      )}

      {/* ── Club Kit Sheet ────────────────────────────────────────────────── */}
      {showClubKit && <ClubKitSheet club={club} onClose={() => setShowClubKit(false)} />}

      {/* ── Application Sheet ──────────────────────────────────────────────── */}
      {showForm && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "flex-end", justifyContent: "center", background: "rgba(0,0,0,0.5)" }}>
          <div style={{ width: "100%", maxWidth: 448, borderRadius: "24px 24px 0 0", padding: "24px", overflowY: "auto", background: "white", maxHeight: "90vh", boxSizing: "border-box" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <div>
                <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.22em", color: club.color }}>APPLY</p>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: DARK, fontFamily: "var(--font-playfair)" }}>{club.name}</h3>
              </div>
              <button onClick={() => setShowForm(false)} style={{ width: 36, height: 36, borderRadius: "50%", background: "#F5F5F5", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 1l12 12M13 1L1 13" stroke="#888" strokeWidth="1.8" strokeLinecap="round" /></svg>
              </button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={{ display: "block", fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", color: "rgba(0,0,0,0.38)", marginBottom: 8 }}>WHY DO YOU WANT TO JOIN?</label>
                <textarea rows={3} placeholder="Tell the Club Mama what draws you here…" style={{ width: "100%", background: "#F8F8F8", borderRadius: 16, padding: "12px 16px", fontSize: 13, outline: "none", border: "2px solid transparent", resize: "none", color: DARK, boxSizing: "border-box" }} onFocus={e => (e.target.style.borderColor = club.color)} onBlur={e => (e.target.style.borderColor = "transparent")} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", color: "rgba(0,0,0,0.38)", marginBottom: 8 }}>TELL US ABOUT YOURSELF</label>
                <textarea rows={3} value={introText} onChange={e => setIntroText(e.target.value)} placeholder="A little about you — work, vibe, what you love…" style={{ width: "100%", background: "#F8F8F8", borderRadius: 16, padding: "12px 16px", fontSize: 13, outline: "none", border: "2px solid transparent", resize: "none", color: DARK, boxSizing: "border-box" }} onFocus={e => (e.target.style.borderColor = club.color)} onBlur={e => (e.target.style.borderColor = "transparent")} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", color: "rgba(0,0,0,0.38)", marginBottom: 8 }}>INSTAGRAM (optional)</label>
                <input type="text" placeholder="@handle" style={{ width: "100%", background: "#F8F8F8", borderRadius: 16, padding: "12px 16px", fontSize: 13, outline: "none", border: "2px solid transparent", color: DARK, boxSizing: "border-box" }} onFocus={e => (e.target.style.borderColor = club.color)} onBlur={e => (e.target.style.borderColor = "transparent")} />
              </div>
              {club.rules && club.rules.length > 0 && (
                <label style={{ display: "flex", alignItems: "flex-start", gap: 12, cursor: "pointer" }}>
                  <input type="checkbox" style={{ accentColor: club.color, marginTop: 2 }} />
                  <span style={{ fontSize: 13, color: "rgba(0,0,0,0.5)" }}>I have read and accept the house rules.</span>
                </label>
              )}
            </div>
            {applyError && <p style={{ fontSize: 12, color: "#ef4444", marginTop: 8 }}>{applyError}</p>}
            <button
              disabled={applying}
              onClick={async () => {
                setApplying(true);
                setApplyError(null);
                try {
                  await applyToClub(club.id, introText || undefined);
                  setApplied(true);
                  setShowForm(false);
                  setShowClubKit(true);
                } catch (err) {
                  setApplyError((err as { message?: string })?.message ?? "Something went wrong. Try again.");
                } finally {
                  setApplying(false);
                }
              }}
              style={{ width: "100%", marginTop: 20, padding: "16px 0", borderRadius: 32, fontWeight: 700, fontSize: 14, color: "white", background: applying ? `${club.color}88` : club.color, border: "none", cursor: applying ? "default" : "pointer" }}
            >
              {applying ? "Submitting…" : "Submit Application"}
            </button>
            {club.accessType !== "free" && (
              <p style={{ textAlign: "center", fontSize: 11, color: "rgba(0,0,0,0.35)", marginTop: 12 }}>Payment is only collected after the Club Mama approves you.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
