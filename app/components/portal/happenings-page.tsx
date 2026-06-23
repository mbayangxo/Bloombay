"use client";

import "@/app/styles/bloom-entrance.css";
import { useState, useEffect, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { getEvents, getJoinedEventIds, joinEvent, leaveEvent, type Event } from "@/lib/actions/events";
import { EventCard, type EventCardData, type EventType } from "@/app/components/portal/event-card-templates";
import {
  joinWaitlist, leaveWaitlist, getWaitlistCounts, getMyWaitlistIds,
  witnessAttendee, getWitnessedIds,
  leaveHostReview, getMyReviewedEventIds, getMyHostedCount,
  toggleGatheringFlower, getGatheringFlowersForUser,
} from "@/lib/actions/happenings";
import { getTraditions, toggleFollowTradition, type Tradition } from "@/lib/actions/traditions";
import { coverUrl } from "@/lib/images/supabase-transform";
import { getIntros, postIntro, flowerIntro, type IntroPost } from "@/lib/actions/introductions";

const PINK   = "#FF1F7D";
const DARK   = "#1C1B1C";
const CREAM  = "#F6F1EB";
const NAV_BG = "#F6F1EB";

// Map DB event_type + title → EventType for template dispatch
function inferEventType(ev: Event): EventType {
  const t  = (ev.event_type ?? "").toLowerCase();
  const tt = (ev.title ?? "").toLowerCase();
  const s  = `${t} ${tt}`;
  // Ticket / concert
  if (/concert|live music|vinyl night|jazz night|performance|gig|music show|afrobeats night|dance.*show/.test(s)) return "concert";
  // Party poster
  if (/\bparty\b|girls night|birthday bash|girls.night.out|rooftop.*party|dance all night|night out|noche|rave|social night/.test(s)) return "party";
  // Invitation
  if (/\binvit(ation|e)\b|private.*invite/.test(s)) return "invitation";
  // Open seats (last minute)
  if (/open.?seat|last.?seat|open.?table|seat.?available/.test(s)) return "open_seats";
  // Private dinner table card
  if (/private dinner|reserved table|members.table|dinner.*table|table.*dinner/.test(s)) return "table";
  // Supper club / intimate dinners → handwritten note card
  if (/supper club|supper|intimate dinner|dinner party|dinner society|italian dinner/.test(s)) return "supper";
  // Cocktails / drinks / aperitivo → vintage poster card
  if (/cocktail|aperitivo|wine night|wine.*tasting|bar night|drinks night|happy hour|champagne|rosé|rose|spirits|martini|negroni/.test(s)) return "drinks";
  // Bakery / patisserie
  if (/bakery|boulangerie|pastry|croissant|peko|bread|pâtisserie/.test(s)) return "bakery";
  // Food pop-up / café
  if (/pop.?up|café|coffee.*event|bites|brunch.*event/.test(s)) return "popup";
  // Food editorial
  if (/food.*partner|tasting menu|culinary|feast|dining.*experience/.test(s)) return "food";
  // Brunch
  if (/\bbrunch\b|sunday.*brunch|brunch.*club|mimosa|bagels/.test(s)) return "brunch";
  // Dinner that didn't match above
  if (/\bdinner\b|\blunch\b|\bmeal\b|restaurant/.test(s)) return "supper";
  // Walk / outdoor / active
  if (/\bwalk\b|outdoor|hike|run club|morning.*walk|stroll|trail/.test(s)) return "walk";
  // Museum / gallery / art
  if (/museum|gallery|exhibition|moma|the met|\bart show\b|art.*night/.test(s)) return "museum";
  return "gathering";
}

function toCardData(ev: Event): EventCardData {
  const d = new Date(ev.starts_at);
  const dateStr = d.toLocaleDateString("en-US", { month: "short", day: "numeric" }).toUpperCase();
  const timeStr = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
  return {
    id: ev.id,
    type: inferEventType(ev),
    title: ev.title,
    host: ev.host_name ?? undefined,
    location: ev.venue ?? ev.neighborhood ?? ev.city,
    date: dateStr,
    time: timeStr,
    spotsLeft: ev.spots_left ?? undefined,
    going: ev.attending_count,
    accentColor: ev.accent_color ?? undefined,
    href: `/member/happenings/${ev.slug ?? ev.id}`,
  };
}

function getPageBg(): string {
  const h = new Date().getHours();
  if (h >= 5  && h < 12) return "linear-gradient(170deg, #FF1F7D 0%, #FF69A8 45%, #FFB3D4 100%)";
  if (h >= 12 && h < 17) return "linear-gradient(170deg, #E8006A 0%, #FF4499 45%, #FF9CC8 100%)";
  if (h >= 17 && h < 21) return "linear-gradient(170deg, #C0004A 0%, #E8006A 45%, #FF4499 100%)";
  return "linear-gradient(170deg, #3A0018 0%, #720034 45%, #C0004A 100%)";
}

function getNavBg(): string {
  const h = new Date().getHours();
  if (h >= 21 || h < 5) return "rgba(58,0,24,0.96)";
  return "rgba(232,0,106,0.96)";
}

const POSTER_IMGS = [
  "/happenings/posters/01_Girls_Night.png",
  "/happenings/posters/02_Save_The_Date_Aperitivo.png",
  "/happenings/posters/03_Vinyl_Night_Jazz.png",
  "/happenings/posters/04_Italian_Dinner_Society.png",
  "/happenings/posters/05_Film_Club.png",
  "/happenings/posters/06_Dance_All_Night.png",
  "/happenings/posters/07_Sunday_Brunch_Club.png",
  "/happenings/posters/08_Rooftop_Sessions.png",
  "/happenings/posters/09_Bagels_And_Books.png",
  "/happenings/posters/10_Ladies_First_Road_Trip.png",
];

const TICKET_IMGS = [
  "/tickets templates/Ticket_Dinner_Society.png",
  "/tickets templates/Ticket_Girls_Night.png",
  "/tickets templates/Ticket_Museum_Exhibition.png",
  "/tickets templates/Ticket_NYC_Marrakech.png",
];

const CLUB_IMGS = [
  "/club gatherings,casual gatherings templates/Event_Book_Society.png",
  "/club gatherings,casual gatherings templates/Event_Dinner_Society.png",
  "/club gatherings,casual gatherings templates/Event_Museum_Girls.png",
  "/club gatherings,casual gatherings templates/Event_Sunday_Walk.png",
];

const AV_COLORS = ["#FF1F7D","#FF5BAD","#E8006A","#C80060","#A8004C","#FF85C0","#FF3D94"];

const CSS = `
@keyframes ticker {
  0%   { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
@keyframes livePulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50%       { opacity: 0.4; transform: scale(0.7); }
}
@keyframes shimmer {
  0%   { background-position: -400px 0; }
  100% { background-position: 400px 0; }
}
@keyframes fabPop {
  0%   { transform: scale(1); }
  50%  { transform: scale(1.12); }
  100% { transform: scale(1); }
}
.sign-s1 { transform-origin: center center; animation: swayS1 3.2s ease-in-out infinite; }
.sign-s2 { transform-origin: center center; animation: swayS2 2.9s ease-in-out 0.5s infinite; }
.sign-s3 { transform-origin: center center; animation: swayS3 3.5s ease-in-out 0.2s infinite; }
.sign-s4 { transform-origin: center center; animation: swayS4 2.7s ease-in-out 0.8s infinite; }
.sign-s5 { transform-origin: center center; animation: swayS5 3.1s ease-in-out 0.3s infinite; }
.sign-s6 { transform-origin: center center; animation: swayS6 2.8s ease-in-out 0.7s infinite; }
.sign-s7 { transform-origin: center center; animation: swayS7 3.3s ease-in-out 0.1s infinite; }
@keyframes swayS1 { 0%,100% { transform: rotate(-2deg); } 50% { transform: rotate(-4.5deg) translateY(1px); } }
@keyframes swayS2 { 0%,100% { transform: rotate(2.5deg); } 50% { transform: rotate(4.5deg) translateY(1px); } }
@keyframes swayS3 { 0%,100% { transform: rotate(-1.5deg); } 50% { transform: rotate(-3.5deg) translateY(1px); } }
@keyframes swayS4 { 0%,100% { transform: rotate(1deg); } 50% { transform: rotate(3deg) translateY(1px); } }
@keyframes swayS5 { 0%,100% { transform: rotate(-3deg); } 50% { transform: rotate(-5.5deg) translateY(1px); } }
@keyframes swayS6 { 0%,100% { transform: rotate(2deg); } 50% { transform: rotate(4.5deg) translateY(1px); } }
@keyframes swayS7 { 0%,100% { transform: rotate(-1deg); } 50% { transform: rotate(-3deg) translateY(1px); } }
.type-scroll::-webkit-scrollbar { display: none; }
.filter-scroll::-webkit-scrollbar { display: none; }
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
`;

type HapTab = "happenings" | "intros" | "map" | "scene" | "calendar";
type Filter = "All" | "Parties" | "Dinners" | "Gatherings" | "Club Gatherings" | "Invitations" | "Open Seats" | "Tables" | "Confetti" | "Events";
type CategoryFilter = "all" | "arts" | "eat" | "music" | "books" | "active" | "drinks" | "film" | "dance";

const FILTERS: Filter[] = ["All", "Parties", "Dinners", "Gatherings", "Club Gatherings", "Invitations", "Open Seats", "Tables", "Confetti", "Events"];

const CATEGORY_CHIPS: { id: CategoryFilter; emoji: string; label: string }[] = [
  { id: "arts",   emoji: "🎨", label: "Arts"   },
  { id: "eat",    emoji: "🍽️", label: "Eat"    },
  { id: "music",  emoji: "🎵", label: "Music"  },
  { id: "books",  emoji: "📚", label: "Books"  },
  { id: "active", emoji: "🏃", label: "Active" },
  { id: "drinks", emoji: "🍷", label: "Drinks" },
  { id: "film",   emoji: "🎬", label: "Film"   },
  { id: "dance",  emoji: "💃", label: "Dance"  },
];

/* ── helpers ──────────────────────────────────────────────── */

function getBadge(ev: Event): string {
  if (ev.badge) return ev.badge;
  const dt = new Date(ev.starts_at);
  const now = new Date();
  const diffH = (dt.getTime() - now.getTime()) / 36e5;
  if (diffH <= 0 && diffH > -6) return "TONIGHT";
  if (diffH > 0 && diffH <= 10) return "TONIGHT";
  if (diffH > 0 && diffH <= 60) return "THIS WEEKEND";
  return "";
}

function matchesFilter(ev: Event, filter: Filter): boolean {
  if (filter === "All" || filter === "Events") return true;
  if (filter === "Dinners") return ev.event_type === "dinner" || ev.event_type === "brunch";
  if (filter === "Parties") return ev.event_type === "party" || ev.event_type === "rooftop" || ev.event_type === "social";
  if (filter === "Gatherings") return ev.event_type === "gathering" || ev.event_type === "casual" || ev.event_type === "walk";
  if (filter === "Club Gatherings") return ev.event_type === "club" || ev.event_type === "club_event";
  if (filter === "Invitations") return ev.event_type === "invitation" || ev.event_type === "private";
  if (filter === "Open Seats") return ev.event_type === "open_seat";
  if (filter === "Tables") return ev.event_type === "table" || ev.event_type === "reservation";
  if (filter === "Confetti") return ev.event_type === "confetti" || ev.event_type === "spontaneous";
  return true;
}

function matchesCategoryFilter(ev: Event, cat: CategoryFilter): boolean {
  if (cat === "all") return true;
  const t = ((ev.event_type ?? "") + " " + ev.title).toLowerCase();
  if (cat === "arts")   return /museum|gallery|art|exhibition|creative|design|craft/.test(t);
  if (cat === "eat")    return /brunch|dinner|lunch|meal|food|restaurant|dining|tasting|breakfast|supper|feast/.test(t);
  if (cat === "music")  return /concert|music|show|performance|vinyl|jazz|festival|dj|band|live/.test(t);
  if (cat === "books")  return /book|reading|writing|literary|poetry|bagels|literature/.test(t);
  if (cat === "active") return /walk|run|hike|outdoor|fitness|yoga|sports|trip|road|cycling|bike/.test(t);
  if (cat === "drinks") return /wine|cocktail|bar|drinking|aperitivo|happy hour|rosé|spirits|champagne|prosecco/.test(t);
  if (cat === "film")   return /film|movie|cinema|screening|documentary|watch/.test(t);
  if (cat === "dance")  return /dance|dancing|club|nightlife|party|rave/.test(t);
  return true;
}

function fmtTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("en-US", { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}

function fmtShort(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}

/* ── Skeleton ─────────────────────────────────────────────── */
function Skeleton({ h, br = 12, dark }: { h: number; br?: number; dark?: boolean }) {
  return (
    <div style={{
      height: h, borderRadius: br,
      background: dark
        ? "linear-gradient(90deg, #fce4f0 25%, #fff0f8 50%, #fce4f0 75%)"
        : "linear-gradient(90deg, #eee 25%, #f5f5f5 50%, #eee 75%)",
      backgroundSize: "400px 100%",
      animation: "shimmer 1.4s ease-in-out infinite",
    }}/>
  );
}

/* ── Type carousel ─────────────────────────────────────────── */
const TYPE_CARDS = [
  {
    label: "Parties",
    emoji: "✦",
    bg: "#FFF0F8",
    color: "#FF1F7D",
    border: "1px solid rgba(255,31,125,0.18)",
    glow: "0 4px 16px rgba(255,31,125,0.1)",
    font: "var(--font-jost)",
    weight: 900,
    size: 11,
    spacing: "0.14em",
    sub: "Tonight",
    subColor: "rgba(255,31,125,0.45)",
  },
  {
    label: "Dinners",
    emoji: "🕯",
    bg: "#FFF5F8",
    color: "#C80060",
    border: "1px solid rgba(200,0,96,0.15)",
    glow: "0 4px 16px rgba(200,0,96,0.08)",
    font: "var(--font-playfair)",
    weight: 900,
    size: 13,
    spacing: "0.01em",
    sub: "& Brunches",
    subColor: "rgba(200,0,96,0.45)",
  },
  {
    label: "Gatherings",
    emoji: "☀",
    bg: "#FFF0F5",
    color: "#E8006A",
    border: "1px solid rgba(232,0,106,0.15)",
    glow: "0 4px 16px rgba(232,0,106,0.08)",
    font: "var(--font-caveat)",
    weight: 700,
    size: 15,
    spacing: "0em",
    sub: "casual & fun",
    subColor: "rgba(232,0,106,0.45)",
  },
  {
    label: "Club Gatherings",
    emoji: "◆",
    bg: "#FFECF4",
    color: "#B8005A",
    border: "1px solid rgba(184,0,90,0.15)",
    glow: "0 4px 16px rgba(184,0,90,0.08)",
    font: "var(--font-jost)",
    weight: 800,
    size: 10,
    spacing: "0.12em",
    sub: "Members only",
    subColor: "rgba(184,0,90,0.45)",
  },
  {
    label: "Invitations",
    emoji: "💌",
    bg: "#FFF0F8",
    color: "#FF1F7D",
    border: "1px solid rgba(255,31,125,0.18)",
    glow: "0 4px 16px rgba(255,31,125,0.1)",
    font: "var(--font-playfair)",
    weight: 400,
    size: 14,
    spacing: "0em",
    sub: "You're invited",
    subColor: "rgba(255,31,125,0.45)",
  },
  {
    label: "Open Seats",
    emoji: "🪑",
    bg: "#FFF5FA",
    color: "#CC0058",
    border: "1px solid rgba(204,0,88,0.15)",
    glow: "0 4px 16px rgba(204,0,88,0.08)",
    font: "var(--font-jost)",
    weight: 800,
    size: 10,
    spacing: "0.1em",
    sub: "Last spots",
    subColor: "rgba(204,0,88,0.45)",
  },
  {
    label: "Tables",
    emoji: "🥂",
    bg: "#F5F8FF",
    color: "#3A5BBF",
    border: "1px solid rgba(58,91,191,0.2)",
    glow: "0 4px 16px rgba(58,91,191,0.1)",
    font: "var(--font-playfair)",
    weight: 400,
    size: 15,
    spacing: "0em",
    sub: "reserve your seat",
    subColor: "rgba(58,91,191,0.5)",
  },
  {
    label: "Confetti",
    emoji: "🎊",
    bg: "#FFFBEC",
    color: "#B87A00",
    border: "1px solid rgba(184,122,0,0.2)",
    glow: "0 4px 16px rgba(184,122,0,0.1)",
    font: "var(--font-caveat)",
    weight: 700,
    size: 16,
    spacing: "0em",
    sub: "spontaneous joy",
    subColor: "rgba(184,122,0,0.5)",
  },
  {
    label: "Events",
    emoji: "🎭",
    bg: "#FFEEF6",
    color: "#A8004C",
    border: "1px solid rgba(168,0,76,0.15)",
    glow: "0 4px 16px rgba(168,0,76,0.08)",
    font: "var(--font-jost)",
    weight: 800,
    size: 10,
    spacing: "0.1em",
    sub: "Experiences",
    subColor: "rgba(168,0,76,0.45)",
  },
];

function TypeCarousel({ onSelect }: { onSelect: (label: string) => void }) {
  return (
    <div
      className="type-scroll"
      style={{
        display: "flex", gap: 10, overflowX: "auto",
        padding: "12px 16px 14px",
        scrollbarWidth: "none",
      }}
    >
      {TYPE_CARDS.map(tc => (
        <button
          key={tc.label}
          onClick={() => onSelect(tc.label as Filter)}
          style={{
            flexShrink: 0,
            width: 100,
            height: 80,
            borderRadius: 12,
            background: tc.bg,
            border: tc.border,
            boxShadow: tc.glow,
            padding: "10px 10px 8px",
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "space-between",
          }}
        >
          <span style={{ fontSize: 18, lineHeight: 1 }}>{tc.emoji}</span>
          <div>
            <p style={{
              fontFamily: tc.font,
              fontSize: tc.size,
              fontWeight: tc.weight,
              letterSpacing: tc.spacing,
              color: tc.color,
              lineHeight: 1.1,
              fontStyle: tc.font === "var(--font-playfair)" ? "italic" : "normal",
            }}>
              {tc.label}
            </p>
            <p style={{
              fontFamily: "var(--font-jost)",
              fontSize: 8,
              fontWeight: 600,
              color: tc.subColor,
              marginTop: 2,
            }}>
              {tc.sub}
            </p>
          </div>
        </button>
      ))}
    </div>
  );
}

/* ── Tonight strip ────────────────────────────────────────── */
function TonightStrip({ events, joined, onToggle }: { events: Event[]; joined: Set<string>; onToggle: (id: string) => void }) {
  const tonight = events.filter(ev => {
    const diffH = (new Date(ev.starts_at).getTime() - Date.now()) / 36e5;
    return diffH >= 0 && diffH <= 8;
  });
  if (tonight.length === 0) return null;
  return (
    <div style={{ margin: "12px 14px 4px", borderRadius: 14, background: "rgba(255,31,125,0.12)", border: "1px solid rgba(255,31,125,0.25)", padding: "12px 12px 14px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10 }}>
        <div style={{ width: 7, height: 7, borderRadius: "50%", background: PINK, animation: "livePulse 1.2s ease-in-out infinite" }}/>
        <span style={{ fontFamily: "var(--font-jost)", fontSize: "8.5px", fontWeight: 800, letterSpacing: "0.2em", color: "rgba(255,255,255,0.9)" }}>TONIGHT</span>
        <span style={{ fontFamily: "var(--font-caveat)", fontSize: 13, color: "rgba(255,255,255,0.4)" }}>— happening now</span>
      </div>
      <div style={{ display: "flex", gap: 10, overflowX: "auto", scrollbarWidth: "none" as const }}>
        {tonight.map(ev => (
          <div key={ev.id} style={{ flexShrink: 0, width: 160, background: "rgba(255,255,255,0.08)", borderRadius: 10, padding: "10px 12px", border: "1px solid rgba(255,255,255,0.1)" }}>
            <p style={{ fontFamily: "var(--font-playfair)", fontSize: 13, fontWeight: 900, fontStyle: "italic", color: "white", lineHeight: 1.2, marginBottom: 4 }}>{ev.title}</p>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", color: "rgba(255,255,255,0.45)", marginBottom: 8 }}>{ev.venue ?? ev.neighborhood} · {new Date(ev.starts_at).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}</p>
            {ev.spots_left !== null && ev.spots_left > 0 && (
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, color: PINK, marginBottom: 6 }}>{ev.spots_left} seats left</p>
            )}
            <button onClick={() => onToggle(ev.id)} style={{
              width: "100%", padding: "6px 0", borderRadius: 6, border: "none",
              background: joined.has(ev.id) ? "rgba(255,255,255,0.12)" : PINK,
              color: "white", fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800,
              cursor: "pointer",
            }}>
              {joined.has(ev.id) ? "Going ✓" : "Going →"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Bring a Friend sheet ──────────────────────────────────── */
function InviteFriendSheet({ ev, onClose }: { ev: Event; onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  const link = typeof window !== "undefined" ? `${window.location.origin}/member/happenings/${ev.slug ?? ev.id}` : "";

  function copy() {
    navigator.clipboard.writeText(link).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  }

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 80, display: "flex", flexDirection: "column", justifyContent: "flex-end" }} onClick={onClose}>
      <div style={{ background: "rgba(0,0,0,0.5)", position: "absolute", inset: 0 }}/>
      <div style={{ position: "relative", background: "#FFF8F2", borderRadius: "20px 20px 0 0", padding: "20px 20px 40px", zIndex: 1 }} onClick={e => e.stopPropagation()}>
        <div style={{ width: 36, height: 4, borderRadius: 2, background: "rgba(0,0,0,0.15)", margin: "0 auto 16px" }}/>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, letterSpacing: "0.18em", color: PINK, marginBottom: 4 }}>BRING A FRIEND</p>
        <p style={{ fontFamily: "var(--font-playfair)", fontSize: 20, fontWeight: 900, fontStyle: "italic", color: "#1C1B1C", marginBottom: 6 }}>{ev.title}</p>
        <p style={{ fontFamily: "var(--font-caveat)", fontSize: 14, color: "#9A8070", marginBottom: 18, lineHeight: 1.4 }}>Women only. Your friend will need to verify she's a woman to join Bloombay.</p>
        <div style={{ background: "white", borderRadius: 10, padding: "12px 14px", border: "1px solid rgba(0,0,0,0.08)", marginBottom: 12, wordBreak: "break-all" as const }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "9px", color: "#999", marginBottom: 4, letterSpacing: "0.08em" }}>INVITE LINK</p>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "10px", color: "#444" }}>{link}</p>
        </div>
        <button onClick={copy} style={{
          width: "100%", padding: "14px", borderRadius: 999,
          background: copied ? "#22C55E" : PINK, color: "white", border: "none",
          fontFamily: "var(--font-jost)", fontSize: "12px", fontWeight: 800, letterSpacing: "0.08em",
          cursor: "pointer", boxShadow: copied ? "0 4px 18px rgba(34,197,94,0.35)" : `0 4px 18px ${PINK}55`,
        }}>
          {copied ? "COPIED ✓" : "COPY LINK"}
        </button>
      </div>
    </div>
  );
}

/* ── Post-event witness sheet ──────────────────────────────── */
function WitnessSheet({ ev, onClose }: { ev: Event; onClose: () => void }) {
  const [witnessed, setWitnessed] = useState<Set<string>>(new Set());
  const DEMO_ATTENDEES = [
    { id: "a1", name: "Mia", color: PINK },
    { id: "a2", name: "Zara", color: "#C084FC" },
    { id: "a3", name: "Sofia", color: "#FF69B4" },
  ];

  useEffect(() => {
    getWitnessedIds(ev.id).then(ids => setWitnessed(new Set(ids)));
  }, [ev.id]);

  async function toggle(userId: string) {
    setWitnessed(prev => { const s = new Set(prev); s.has(userId) ? s.delete(userId) : s.add(userId); return s; });
    await witnessAttendee(ev.id, userId);
  }

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 80, display: "flex", flexDirection: "column", justifyContent: "flex-end" }} onClick={onClose}>
      <div style={{ background: "rgba(0,0,0,0.5)", position: "absolute", inset: 0 }}/>
      <div style={{ position: "relative", background: "#FFF8F2", borderRadius: "20px 20px 0 0", padding: "20px 20px 40px", zIndex: 1 }} onClick={e => e.stopPropagation()}>
        <div style={{ width: 36, height: 4, borderRadius: 2, background: "rgba(0,0,0,0.15)", margin: "0 auto 16px" }}/>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, letterSpacing: "0.18em", color: PINK, marginBottom: 4 }}>WHO DID YOU MEET?</p>
        <p style={{ fontFamily: "var(--font-playfair)", fontSize: 18, fontWeight: 900, fontStyle: "italic", color: "#1C1B1C", marginBottom: 16 }}>{ev.title}</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {DEMO_ATTENDEES.map(a => (
            <button key={a.id} onClick={() => toggle(a.id)} style={{
              display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 12,
              background: witnessed.has(a.id) ? `${PINK}15` : "white",
              border: witnessed.has(a.id) ? `1.5px solid ${PINK}` : "1px solid rgba(0,0,0,0.08)",
              cursor: "pointer", textAlign: "left" as const,
            }}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: `linear-gradient(135deg, ${a.color}, ${a.color}88)`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <span style={{ fontFamily: "var(--font-jost)", fontSize: 13, fontWeight: 800, color: "white" }}>{a.name[0]}</span>
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: 13, fontWeight: 700, color: "#1C1B1C" }}>{a.name}</p>
                <p style={{ fontFamily: "var(--font-caveat)", fontSize: 12, color: "#9A8070", marginTop: 1 }}>was there with you</p>
              </div>
              {witnessed.has(a.id) && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={PINK} strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Host review sheet ─────────────────────────────────────── */
function HostReviewSheet({ ev, onClose, onDone }: { ev: Event; onClose: () => void; onDone: (id: string) => void }) {
  const [rating, setRating]   = useState(0);
  const [content, setContent] = useState("");
  const [saving, setSaving]   = useState(false);

  async function submit() {
    if (!rating || saving || !ev.host_name) return;
    setSaving(true);
    // host_id would come from event data in a real system; for now use event id as proxy
    const res = await leaveHostReview(ev.id, ev.id, rating, content);
    if (res.ok) onDone(ev.id);
    setSaving(false);
  }

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 80, display: "flex", flexDirection: "column", justifyContent: "flex-end" }} onClick={onClose}>
      <div style={{ background: "rgba(0,0,0,0.5)", position: "absolute", inset: 0 }}/>
      <div style={{ position: "relative", background: "#FFF8F2", borderRadius: "20px 20px 0 0", padding: "20px 20px 40px", zIndex: 1 }} onClick={e => e.stopPropagation()}>
        <div style={{ width: 36, height: 4, borderRadius: 2, background: "rgba(0,0,0,0.15)", margin: "0 auto 16px" }}/>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, letterSpacing: "0.18em", color: PINK, marginBottom: 4 }}>RATE THE HOST</p>
        {ev.host_id ? (
          <Link href={`/member/host/${ev.host_id}`} style={{ textDecoration: "none" }}>
            <p style={{ fontFamily: "var(--font-playfair)", fontSize: 18, fontWeight: 900, fontStyle: "italic", color: PINK, marginBottom: 4 }}>{ev.host_name ?? "The host"} →</p>
          </Link>
        ) : (
          <p style={{ fontFamily: "var(--font-playfair)", fontSize: 18, fontWeight: 900, fontStyle: "italic", color: "#1C1B1C", marginBottom: 4 }}>{ev.host_name ?? "The host"}</p>
        )}
        <p style={{ fontFamily: "var(--font-caveat)", fontSize: 14, color: "#9A8070", marginBottom: 18 }}>{ev.title}</p>
        <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
          {[1,2,3,4,5].map(n => (
            <button key={n} onClick={() => setRating(n)} style={{
              width: 44, height: 44, borderRadius: 10, border: "none",
              background: n <= rating ? PINK : "rgba(0,0,0,0.06)",
              fontSize: 20, cursor: "pointer",
              boxShadow: n <= rating ? `0 3px 12px ${PINK}44` : "none",
            }}>⭐</button>
          ))}
        </div>
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Say something about her hosting… (optional)"
          rows={3}
          maxLength={300}
          style={{
            width: "100%", borderRadius: 10, border: "1px solid rgba(0,0,0,0.1)",
            padding: "12px 14px", fontFamily: "var(--font-caveat)", fontSize: 16,
            color: "#3A2A1A", resize: "none", outline: "none", background: "white",
            marginBottom: 14,
          }}
        />
        <button onClick={submit} disabled={!rating || saving} style={{
          width: "100%", padding: "14px", borderRadius: 999,
          background: rating ? PINK : "rgba(0,0,0,0.08)",
          color: rating ? "white" : "#AAA", border: "none",
          fontFamily: "var(--font-jost)", fontSize: "12px", fontWeight: 800, letterSpacing: "0.08em",
          cursor: rating ? "pointer" : "default",
          boxShadow: rating ? `0 4px 18px ${PINK}55` : "none",
        }}>
          {saving ? "SAVING…" : "LEAVE REVIEW ✦"}
        </button>
      </div>
    </div>
  );
}

/* ── Poster Card (full-width, tall, image-forward) ────────── */
function PosterCard({ ev, posterIdx, joined, onToggle, fullWidth = false, waitlistCount = 0, onWaitlist = false, onJoinWaitlist, onInvite }: {
  ev: Event; posterIdx: number; joined: boolean; onToggle: () => void; fullWidth?: boolean;
  waitlistCount?: number; onWaitlist?: boolean; onJoinWaitlist?: () => void; onInvite?: () => void;
}) {
  const badge  = getBadge(ev);
  const poster = ev.image_url ?? POSTER_IMGS[posterIdx % POSTER_IMGS.length];

  return (
    <div style={{
      borderRadius: 14,
      overflow: "hidden",
      position: "relative",
      height: fullWidth ? 230 : 168,
      boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
    }}>
      <Image src={poster} alt={ev.title} fill unoptimized style={{ objectFit: "cover" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0) 25%, rgba(0,0,0,0.75) 65%, rgba(0,0,0,0.92) 100%)" }}/>

      {/* Top badges */}
      <div style={{ position: "absolute", top: 12, left: 12, display: "flex", gap: 6 }}>
        {badge && (
          <div style={{ display: "flex", alignItems: "center", gap: 5, background: "rgba(0,0,0,0.6)", borderRadius: 999, padding: "4px 10px", backdropFilter: "blur(8px)" }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: PINK, animation: "livePulse 1.4s ease-in-out infinite" }}/>
            <span style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, color: "white", letterSpacing: "0.1em" }}>{badge}</span>
          </div>
        )}
        {ev.is_official && (
          <div style={{ background: PINK, borderRadius: 999, padding: "4px 10px" }}>
            <span style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, color: "white", letterSpacing: "0.06em" }}>✦ OFFICIAL</span>
          </div>
        )}
      </div>

      {/* Going count badge */}
      {(ev as { going_count?: number }).going_count && (ev as { going_count?: number }).going_count! > 0 && (
        <div style={{ position: "absolute", top: 12, right: 12, background: "rgba(0,0,0,0.6)", borderRadius: 999, padding: "4px 10px", backdropFilter: "blur(8px)" }}>
          <span style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 700, color: "white" }}>{(ev as { going_count?: number }).going_count} going</span>
        </div>
      )}

      {/* Bottom */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "12px 14px 12px" }}>
        <p style={{ fontFamily: "var(--font-playfair)", fontSize: fullWidth ? 22 : 16, fontWeight: 900, fontStyle: "italic", color: "white", lineHeight: 1.05, marginBottom: 4, textShadow: "0 2px 12px rgba(0,0,0,0.7)", letterSpacing: "-0.01em" }}>
          {ev.title}
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 5 }}>
          <span style={{ fontFamily: "var(--font-jost)", fontSize: "7px", color: "rgba(255,255,255,0.5)", letterSpacing: "0.04em", flex: 1 }}>
            {ev.venue ?? ""}{ev.neighborhood ? ` · ${ev.neighborhood}` : ""}
            {ev.spots_left === 0 && waitlistCount > 0 && (
              <span style={{ color: "rgba(255,200,100,0.9)", marginLeft: 4 }}>· Full · {waitlistCount} waiting</span>
            )}
          </span>
          {onInvite && (
            <button onClick={e => { e.stopPropagation(); onInvite(); }} style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.25)", borderRadius: 999, padding: "5px 10px", color: "rgba(255,255,255,0.8)", fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 700, cursor: "pointer", flexShrink: 0 }}>
              👯
            </button>
          )}
          {ev.spots_left === 0 ? (
            <button onClick={onJoinWaitlist} style={{
              background: onWaitlist ? "rgba(255,255,255,0.12)" : "rgba(255,180,50,0.85)",
              color: "white", border: onWaitlist ? "1.5px solid rgba(255,255,255,0.35)" : "none",
              borderRadius: 999, padding: "5px 12px",
              fontFamily: "var(--font-jost)", fontSize: "7.5px", fontWeight: 800, letterSpacing: "0.05em",
              cursor: "pointer", flexShrink: 0,
            }}>
              {onWaitlist ? "You're next ✓" : "Next to attend"}
            </button>
          ) : (
            <button onClick={onToggle} style={{
              background: joined ? "rgba(255,255,255,0.12)" : PINK,
              color: "white", border: joined ? "1.5px solid rgba(255,255,255,0.35)" : "none",
              borderRadius: 999, padding: "5px 14px",
              fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, letterSpacing: "0.06em",
              cursor: "pointer", flexShrink: 0,
              boxShadow: joined ? "none" : `0 3px 14px ${PINK}66`,
            }}>
              {joined ? "Going ✓" : "Going →"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Ticket Card (perforated stub look) ───────────────────── */
function TicketCard({ ev, ticketIdx, joined, onToggle, waitlistCount = 0, onWaitlist = false, onJoinWaitlist, onInvite }: {
  ev: Event; ticketIdx: number; joined: boolean; onToggle: () => void;
  waitlistCount?: number; onWaitlist?: boolean; onJoinWaitlist?: () => void; onInvite?: () => void;
}) {
  const img = TICKET_IMGS[ticketIdx % TICKET_IMGS.length];
  const badge = getBadge(ev);

  return (
    <div style={{
      borderRadius: 10,
      overflow: "hidden",
      position: "relative",
      background: "rgba(255,255,255,0.85)",
      boxShadow: "0 6px 24px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.05)",
      display: "flex",
      flexDirection: "column",
    }}>
      {/* Ticket image */}
      <div style={{ position: "relative", height: 130, overflow: "hidden" }}>
        <Image src={img} alt={ev.title} fill unoptimized style={{ objectFit: "cover" }} />
        {badge && (
          <div style={{ position: "absolute", top: 8, left: 8, display: "flex", alignItems: "center", gap: 4, background: "rgba(0,0,0,0.6)", borderRadius: 999, padding: "3px 8px", backdropFilter: "blur(6px)" }}>
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: PINK, animation: "livePulse 1.4s ease-in-out infinite" }}/>
            <span style={{ fontFamily: "var(--font-jost)", fontSize: "6.5px", fontWeight: 800, color: "white", letterSpacing: "0.1em" }}>{badge}</span>
          </div>
        )}
      </div>

      {/* Perforated divider */}
      <div style={{ height: 1, background: "repeating-linear-gradient(to right, transparent, transparent 4px, rgba(0,0,0,0.15) 4px, rgba(0,0,0,0.15) 8px)", margin: "0 12px" }}/>

      {/* Stub */}
      <div style={{ padding: "10px 12px 12px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 3 }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "6.5px", fontWeight: 800, letterSpacing: "0.18em", color: "rgba(0,0,0,0.35)" }}>ADMIT ONE</p>
          {onInvite && (
            <button onClick={e => { e.stopPropagation(); onInvite(); }} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13, padding: 0, lineHeight: 1 }}>👯</button>
          )}
        </div>
        <p style={{ fontFamily: "var(--font-playfair)", fontSize: 13, fontWeight: 900, fontStyle: "italic", color: "#1A1A1A", lineHeight: 1.2, marginBottom: 4 }}>{ev.title}</p>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", color: "rgba(0,0,0,0.45)", letterSpacing: "0.04em", marginBottom: ev.spots_left === 0 && waitlistCount > 0 ? 3 : 8 }}>{fmtShort(ev.starts_at)}</p>
        {ev.spots_left === 0 && waitlistCount > 0 && (
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, color: "#D97706", marginBottom: 6 }}>Full · {waitlistCount} women waiting</p>
        )}
        {ev.spots_left === 0 ? (
          <button onClick={onJoinWaitlist} style={{
            width: "100%", padding: "7px 0",
            background: onWaitlist ? "rgba(0,0,0,0.06)" : "#D97706",
            color: onWaitlist ? "rgba(0,0,0,0.5)" : "white",
            border: "none", borderRadius: 6,
            fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, letterSpacing: "0.08em",
            cursor: "pointer",
          }}>
            {onWaitlist ? "You're next ✓" : "Next to sit →"}
          </button>
        ) : (
          <button onClick={onToggle} style={{
            width: "100%", padding: "7px 0",
            background: joined ? "rgba(0,0,0,0.06)" : PINK,
            color: joined ? "rgba(0,0,0,0.5)" : "white",
            border: "none", borderRadius: 6,
            fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, letterSpacing: "0.08em",
            cursor: "pointer",
          }}>
            {joined ? "Going ✓" : "Going →"}
          </button>
        )}
      </div>
    </div>
  );
}

/* ── Club Card (dark, editorial) ──────────────────────────── */
function ClubCard({ ev, clubIdx, joined, onToggle }: {
  ev: Event; clubIdx: number; joined: boolean; onToggle: () => void;
}) {
  const img   = ev.image_url ?? CLUB_IMGS[clubIdx % CLUB_IMGS.length];
  const badge = getBadge(ev);

  return (
    <div style={{
      borderRadius: 10,
      overflow: "hidden",
      position: "relative",
      height: 200,
      background: "#0A0A0A",
      boxShadow: "0 6px 24px rgba(0,0,0,0.5)",
    }}>
      <Image src={img} alt={ev.title} fill unoptimized style={{ objectFit: "cover", opacity: 0.75 }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(160deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.0) 40%, rgba(0,0,0,0.8) 100%)" }}/>

      {/* Pink corner accent */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(to right, ${PINK}, transparent)` }}/>

      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "12px" }}>
        {badge && (
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "6.5px", fontWeight: 800, letterSpacing: "0.18em", color: PINK, marginBottom: 4 }}>{badge} ✦</p>
        )}
        <p style={{ fontFamily: "var(--font-playfair)", fontSize: 14, fontWeight: 900, fontStyle: "italic", color: "white", lineHeight: 1.2, marginBottom: 6 }}>{ev.title}</p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontFamily: "var(--font-jost)", fontSize: "7px", color: "rgba(255,255,255,0.45)", letterSpacing: "0.04em" }}>{ev.neighborhood ?? ev.city}</span>
          <button onClick={onToggle} style={{
            background: joined ? "rgba(255,255,255,0.12)" : PINK,
            border: joined ? `1px solid rgba(255,255,255,0.3)` : "none",
            color: "white", borderRadius: 999, padding: "5px 12px",
            fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.08em",
            cursor: "pointer",
            boxShadow: joined ? "none" : `0 2px 10px ${PINK}55`,
          }}>
            {joined ? "Going ✓" : "Going →"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Paper Card (casual, warm, handwritten) ───────────────── */
function PaperCard({ ev, joined, onToggle }: { ev: Event; joined: boolean; onToggle: () => void }) {
  const badge  = getBadge(ev);
  const accent = ev.accent_color ?? PINK;

  return (
    <div style={{
      borderRadius: 10,
      background: "rgba(255,255,255,0.85)",
      backgroundImage: "repeating-linear-gradient(transparent, transparent 20px, rgba(0,0,0,0.04) 20px, rgba(0,0,0,0.04) 21px)",
      boxShadow: "0 6px 24px rgba(0,0,0,0.35), inset 0 0 0 1px rgba(0,0,0,0.05)",
      padding: "12px 12px 12px",
      position: "relative",
      display: "flex",
      flexDirection: "column",
    }}>
      {/* Tape strip at top */}
      <div style={{ position: "absolute", top: -4, left: "50%", transform: "translateX(-50%) rotate(-1deg)", width: 40, height: 12, background: "rgba(255,252,195,0.85)", boxShadow: "0 1px 4px rgba(0,0,0,0.12)" }}/>

      {ev.image_url && (
        <div style={{ position: "relative", width: "100%", height: 80, borderRadius: 6, overflow: "hidden", marginBottom: 8 }}>
          <Image src={coverUrl(ev.image_url) ?? ""} alt={ev.title} fill unoptimized style={{ objectFit: "cover" }} />
        </div>
      )}
      {!ev.image_url && (
        <div style={{ width: "100%", height: 60, borderRadius: 6, marginBottom: 8, background: `${accent}22`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: 28 }}>✿</span>
        </div>
      )}

      {badge && (
        <p style={{ fontFamily: "var(--font-jost)", fontSize: "6px", fontWeight: 800, letterSpacing: "0.18em", color: `${accent}`, marginBottom: 3 }}>{badge}</p>
      )}
      <p style={{ fontFamily: "var(--font-caveat)", fontSize: 14, fontWeight: 700, color: "#1A1A1A", lineHeight: 1.3, flex: 1, marginBottom: 4 }}>{ev.title}</p>
      <p style={{ fontFamily: "var(--font-caveat)", fontSize: 11, color: "rgba(0,0,0,0.45)", marginBottom: 8 }}>{ev.venue ?? fmtShort(ev.starts_at)}</p>
      <button onClick={onToggle} style={{
        background: joined ? "rgba(0,0,0,0.06)" : accent,
        color: joined ? "rgba(0,0,0,0.4)" : "white",
        border: "none", borderRadius: 6, padding: "6px 0", width: "100%",
        fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, letterSpacing: "0.07em",
        cursor: "pointer",
      }}>
        {joined ? "Going ✓" : "Going →"}
      </button>
    </div>
  );
}

/* ── Static poster (no real event) ───────────────────────── */
function StaticPosterCard({ img, title, sub }: { img: string; title: string; sub: string; wide?: boolean }) {
  return (
    <div style={{
      borderRadius: 14,
      overflow: "hidden",
      position: "relative",
      height: 160,
      boxShadow: "0 5px 20px rgba(0,0,0,0.4)",
    }}>
      <Image src={img} alt={title} fill style={{ objectFit: "cover" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0) 35%, rgba(0,0,0,0.82) 100%)" }}/>
      <div style={{ position: "absolute", bottom: 10, left: 10, right: 10 }}>
        <p style={{ fontFamily: "var(--font-playfair)", fontSize: 13, fontWeight: 900, fontStyle: "italic", color: "white", lineHeight: 1.2, textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}>{title}</p>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", color: "rgba(255,255,255,0.6)", letterSpacing: "0.05em", marginTop: 2 }}>{sub}</p>
      </div>
    </div>
  );
}

/* ── Event templates strip (real events) ────────────────── */
function EventTemplatesStrip({ events, joined, waitlistCounts, myWaitlist, onToggle, onWaitlist, onInvite, flowers, onFlower }: {
  events: Event[];
  joined: Set<string>;
  waitlistCounts: Record<string, number>;
  myWaitlist: Set<string>;
  onToggle: (id: string) => void;
  onWaitlist: (id: string) => void;
  onInvite: (ev: Event) => void;
  flowers: Record<string, { count: number; gave: boolean }>;
  onFlower: (id: string) => void;
}) {
  if (events.length === 0) return null;
  return (
    <div>
      <div style={{ padding: "0 14px 10px", display: "flex", alignItems: "center", gap: 6 }}>
        <div style={{ width: 5, height: 5, borderRadius: "50%", background: PINK }} />
        <span style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, letterSpacing: "0.18em", color: "rgba(255,255,255,0.6)" }}>YOUR EVENTS</span>
      </div>
      <div className="bloom-stagger" style={{ display: "flex", gap: 12, overflowX: "auto", padding: "0 14px 16px", scrollbarWidth: "none" as const }}>
        {events.map(ev => {
          const isFull = ev.spots_left !== null && ev.spots_left !== undefined && ev.spots_left <= 0;
          const wCount = waitlistCounts[ev.id] ?? 0;
          const onList = myWaitlist.has(ev.id);
          return (
            <div key={ev.id} className="bloom-lift bloom-card-enter" style={{ flexShrink: 0, display: "flex", flexDirection: "column" }}>
              <EventCard ev={toCardData(ev)} />
              {/* Action row below card */}
              <div style={{ display: "flex", gap: 5, marginTop: 6, alignItems: "center" }}>
                {/* Flower button */}
                {(() => {
                  const fl = flowers[ev.id] ?? { count: 0, gave: false };
                  return (
                    <button onClick={() => onFlower(ev.id)} style={{
                      display: "flex", alignItems: "center", gap: 3,
                      background: fl.gave ? "rgba(255,31,125,0.3)" : "rgba(255,255,255,0.1)",
                      border: `1px solid ${fl.gave ? "rgba(255,31,125,0.5)" : "rgba(255,255,255,0.15)"}`,
                      borderRadius: 999, padding: "4px 9px", cursor: "pointer",
                      color: "white", fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800,
                      transition: "all 0.18s",
                    }}>
                      <span style={{ fontSize: 11 }}>🌸</span>
                      {fl.count > 0 && <span>{fl.count}</span>}
                    </button>
                  );
                })()}
                <button onClick={() => onInvite(ev)} style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 999, padding: "4px 9px", color: "rgba(255,255,255,0.65)", fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 700, cursor: "pointer" }}>
                  👯 Invite
                </button>
                <div style={{ flex: 1 }} />
                {isFull ? (
                  <button onClick={() => onWaitlist(ev.id)} style={{ background: onList ? "rgba(255,255,255,0.1)" : "#D97706", border: "none", borderRadius: 999, padding: "4px 10px", color: "white", fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, cursor: "pointer" }}>
                    {onList ? "You're next ✓" : "Next to attend"}
                  </button>
                ) : (
                  <button onClick={() => onToggle(ev.id)} style={{ background: joined.has(ev.id) ? "rgba(255,255,255,0.1)" : PINK, border: "none", borderRadius: 999, padding: "4px 12px", color: "white", fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, cursor: "pointer", boxShadow: joined.has(ev.id) ? "none" : `0 2px 10px ${PINK}55` }}>
                    {joined.has(ev.id) ? "Going ✓" : "Going →"}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Invitation RSVP sheet ─────────────────────────────────── */
function InvitationRsvpSheet({ ev, onClose }: { ev: Event; onClose: () => void }) {
  const [choice, setChoice] = useState<"going" | "maybe" | "cant" | null>(null);
  const [msg, setMsg] = useState("");
  const [confettiSent, setConfettiSent] = useState(false);
  const [done, setDone] = useState(false);

  function sendConfetti() {
    setConfettiSent(true);
  }

  function submit() {
    setDone(true);
  }

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 80, display: "flex", flexDirection: "column", justifyContent: "flex-end" }} onClick={onClose}>
      <div style={{ background: "rgba(0,0,0,0.55)", position: "absolute", inset: 0, backdropFilter: "blur(4px)" }} />
      <div style={{ position: "relative", background: "#FFF8F0", borderRadius: "22px 22px 0 0", padding: "20px 20px calc(env(safe-area-inset-bottom, 0px) + 32px)", zIndex: 1, maxHeight: "88vh", overflowY: "auto" }} onClick={e => e.stopPropagation()}>
        <div style={{ width: 36, height: 4, borderRadius: 2, background: "rgba(0,0,0,0.14)", margin: "0 auto 18px" }} />

        {done ? (
          <div style={{ textAlign: "center", padding: "16px 0 8px" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>{confettiSent ? "🎊" : choice === "going" ? "🌸" : choice === "maybe" ? "🤞" : "💌"}</div>
            <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900, fontSize: 22, color: "#111", marginBottom: 6 }}>
              {confettiSent ? "Confetti sent!" : choice === "going" ? "You're going!" : choice === "maybe" ? "Noted!" : "They know you care."}
            </p>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 12, color: "#999" }}>
              {choice === "going" ? "She'll see you there." : "You can always send her confetti later."}
            </p>
          </div>
        ) : (
          <>
            {/* Event name */}
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "7.5px", fontWeight: 800, letterSpacing: "0.18em", color: `${PINK}99`, marginBottom: 4 }}>💌 YOU WERE INVITED</p>
            <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900, fontSize: 20, color: "#111", lineHeight: 1.15, marginBottom: 4 }}>{ev.title}</p>
            {ev.host_name && (
              <p style={{ fontFamily: "var(--font-jost)", fontSize: 11, color: "#888", marginBottom: 16 }}>Hosted by {ev.host_name}</p>
            )}

            {/* 3-option picker */}
            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
              {([
                { key: "going",  label: "I'm going",           emoji: "🌸" },
                { key: "maybe",  label: "I'll try to make it", emoji: "🤞" },
                { key: "cant",   label: "Can't make it",        emoji: "💌" },
              ] as { key: "going" | "maybe" | "cant"; label: string; emoji: string }[]).map(opt => (
                <button
                  key={opt.key}
                  onClick={() => setChoice(opt.key)}
                  style={{
                    flex: 1, padding: "12px 6px", borderRadius: 14, border: "none", cursor: "pointer",
                    background: choice === opt.key ? `${PINK}18` : "white",
                    outline: choice === opt.key ? `2px solid ${PINK}` : "1px solid rgba(0,0,0,0.1)",
                    display: "flex", flexDirection: "column", alignItems: "center", gap: 5,
                    transition: "all 0.15s",
                  }}
                >
                  <span style={{ fontSize: 20 }}>{opt.emoji}</span>
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: "8.5px", fontWeight: 800, color: choice === opt.key ? PINK : "#555", textAlign: "center", lineHeight: 1.3 }}>{opt.label}</p>
                </button>
              ))}
            </div>

            {/* Message input — always shown */}
            <div style={{ background: "white", borderRadius: 14, border: "1px solid rgba(0,0,0,0.1)", padding: "12px 14px", marginBottom: 12 }}>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "7.5px", fontWeight: 800, letterSpacing: "0.12em", color: "#999", marginBottom: 6 }}>SEND A MESSAGE</p>
              <textarea
                value={msg}
                onChange={e => setMsg(e.target.value)}
                placeholder={choice === "cant" ? "Let her know you're thinking of her…" : choice === "maybe" ? "Let her know you'll try…" : "Can't wait to celebrate you!"}
                rows={2}
                style={{ width: "100%", border: "none", outline: "none", fontFamily: "var(--font-jost)", fontSize: 13, color: "#111", resize: "none", background: "transparent" }}
              />
            </div>

            {/* Send confetti option */}
            <button
              onClick={sendConfetti}
              style={{ width: "100%", padding: "12px", borderRadius: 14, border: `1.5px solid ${confettiSent ? PINK : "rgba(255,31,125,0.25)"}`, background: confettiSent ? `${PINK}12` : "transparent", cursor: "pointer", display: "flex", alignItems: "center", gap: 10, marginBottom: 12, transition: "all 0.15s" }}
            >
              <span style={{ fontSize: 20 }}>🎊</span>
              <div style={{ flex: 1, textAlign: "left" as const }}>
                <p style={{ fontFamily: "var(--font-jost)", fontWeight: 800, fontSize: 12, color: PINK }}>
                  {confettiSent ? "Confetti sent! 🎊" : "Send her confetti"}
                </p>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: 10, color: "#999", marginTop: 1 }}>A little celebration, whether you&apos;re going or not</p>
              </div>
              {confettiSent && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={PINK} strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
              )}
            </button>

            {/* Submit */}
            <button
              onClick={submit}
              disabled={!choice}
              style={{ width: "100%", padding: "15px", borderRadius: 18, background: choice ? PINK : "rgba(0,0,0,0.08)", border: "none", cursor: choice ? "pointer" : "default", fontFamily: "var(--font-jost)", fontWeight: 800, fontSize: 13, letterSpacing: "0.08em", color: choice ? "white" : "rgba(0,0,0,0.3)", boxShadow: choice ? `0 6px 22px ${PINK}44` : "none", transition: "all 0.15s" }}
            >
              {choice === "going" ? "I'm going 🌸" : choice === "maybe" ? "I'll try to make it 🤞" : choice === "cant" ? "Send my love 💌" : "Choose one above"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

/* ── Invitation card (envelope look) ───────────────────────── */
function EnvelopeInviteCard({ c, onOpen }: { c: typeof INVITE_DEMO[0]; onOpen: () => void }) {
  const [opened, setOpened] = useState(false);

  function handleOpen() {
    setOpened(true);
    onOpen();
  }

  return (
    <div style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 20, overflow: "hidden", position: "relative" }}>
      {/* Top color band */}
      <div style={{ height: 4, background: `linear-gradient(90deg, ${c.color}, ${c.color}55)` }} />

      {/* Envelope flap graphic */}
      {!opened && (
        <div style={{ padding: "16px 16px 0" }}>
          <div style={{ position: "relative", height: 54, background: `linear-gradient(145deg, ${c.color}22, ${c.color}08)`, border: `1px solid ${c.color}30`, borderRadius: "14px 14px 0 0", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {/* Envelope V flap */}
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "60%", clipPath: "polygon(0 0, 50% 100%, 100% 0)", background: `${c.color}18`, borderBottom: `1px solid ${c.color}22` }} />
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "50%", clipPath: "polygon(0 0, 50% 100%, 100% 0)", background: `${c.color}12` }} />
            <span style={{ fontSize: 18, zIndex: 1 }}>💌</span>
          </div>
          <div style={{ height: 32, background: `${c.color}08`, border: `1px solid ${c.color}22`, borderTop: "none", borderRadius: "0 0 10px 10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, letterSpacing: "0.14em", color: `${c.color}99` }}>SEALED WITH LOVE</p>
          </div>
        </div>
      )}

      <div style={{ padding: opened ? "16px 16px 14px" : "12px 16px 14px" }}>
        {/* Type + date */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
          <div style={{ background: `${c.color}22`, border: `1px solid ${c.color}44`, borderRadius: 999, padding: "3px 8px", display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ fontSize: 10 }}>{c.type === "Birthday" ? "🎂" : c.type === "Wins" ? "✨" : "🌸"}</span>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, color: c.color, letterSpacing: "0.08em" }}>{c.type.toUpperCase()}</p>
          </div>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", color: "rgba(255,255,255,0.4)" }}>{c.date} · {c.time}</p>
        </div>

        {/* Host + event */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
          <div style={{ width: 40, height: 40, borderRadius: "50%", background: `linear-gradient(135deg, ${c.color}, ${c.color}88)`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, border: "2px solid rgba(255,255,255,0.15)" }}>
            <span style={{ fontFamily: "var(--font-jost)", fontSize: 12, fontWeight: 900, color: "white" }}>{c.initials}</span>
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 700, color: "rgba(255,255,255,0.55)", marginBottom: 2 }}>{c.name} is celebrating</p>
            <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900, fontSize: 17, color: "white", lineHeight: 1.1 }}>{c.what}</p>
          </div>
        </div>

        <p style={{ fontFamily: "var(--font-jost)", fontSize: "9px", color: "rgba(255,255,255,0.38)", marginBottom: 12 }}>{c.venue}</p>

        {/* Attendees */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 14 }}>
          {[0,1,2].map(i => (
            <div key={i} style={{ width: 24, height: 24, borderRadius: "50%", background: `linear-gradient(135deg, ${c.color}AA, ${c.color}55)`, border: "1.5px solid rgba(255,255,255,0.15)", marginLeft: i > 0 ? -10 : 0 }} />
          ))}
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", color: "rgba(255,255,255,0.45)", marginLeft: 4 }}>{c.confirmed} showing up for her</p>
        </div>

        {/* Open invite button (triggers RSVP sheet) */}
        <button
          onClick={handleOpen}
          style={{ width: "100%", padding: "11px", borderRadius: 14, background: opened ? `${c.color}22` : c.color, border: opened ? `1.5px solid ${c.color}55` : "none", cursor: "pointer", fontFamily: "var(--font-jost)", fontWeight: 800, fontSize: 11, letterSpacing: "0.08em", color: opened ? c.color : "white", boxShadow: opened ? "none" : `0 4px 18px ${c.color}55`, transition: "all 0.18s" }}
        >
          {opened ? "Invitation opened ✓" : "Open the invitation →"}
        </button>
      </div>
    </div>
  );
}

const INVITE_DEMO = [
  { id: "c1", type: "Birthday" as const,   name: "Sofia K.",  what: "30th Birthday Dinner",   venue: "Carbone, West Village",   date: "SAT JUL 5",  time: "8 PM",    initials: "SK", color: "#FF1F7D", confirmed: 12 },
  { id: "c2", type: "Wins" as const,       name: "Amara T.",  what: "New Job Celebration",     venue: "Ladurée SoHo",            date: "FRI JUL 11", time: "7:30 PM", initials: "AT", color: "#FF69B4", confirmed: 8  },
  { id: "c3", type: "Milestones" as const, name: "Nadia O.",  what: "New Apartment Warming",   venue: "Her new place · Tribeca", date: "SUN JUL 13", time: "3 PM",    initials: "NO", color: "#E8006A", confirmed: 18 },
  { id: "c4", type: "Birthday" as const,   name: "Lena R.",   what: "Birthday Brunch",         venue: "Sadelle's, SoHo",         date: "SUN JUL 20", time: "11 AM",   initials: "LR", color: "#C80060", confirmed: 7  },
  { id: "c5", type: "Wins" as const,       name: "Zora M.",   what: "Book Deal Dinner",        venue: "Via Carota",              date: "THU JUL 24", time: "7 PM",    initials: "ZM", color: "#FF1F7D", confirmed: 5  },
  { id: "c6", type: "Milestones" as const, name: "Fatima A.", what: "Engagement Dinner",       venue: "The Jane NYC",            date: "SAT JUL 26", time: "6 PM",    initials: "FA", color: "#A8004C", confirmed: 22 },
] as const;
type InviteType = "All" | "Birthday" | "Wins" | "Milestones";

function CelebrationInvitationsView({ events, joined, onToggle }: {
  events: Event[];
  joined: Set<string>;
  onToggle: (id: string) => void;
}) {
  const [typeFilter, setTypeFilter] = useState<InviteType>("All");
  const [rsvpEv, setRsvpEv] = useState<Event | null>(null);
  const [rsvpDemo, setRsvpDemo] = useState<string | null>(null);

  const demo = typeFilter === "All" ? INVITE_DEMO : INVITE_DEMO.filter(c => c.type === typeFilter);

  const demoAsEvent = (c: typeof INVITE_DEMO[0]): Event => ({
    id: c.id, title: c.what, host_name: c.name, venue: c.venue, starts_at: new Date().toISOString(),
    event_type: "invitation", attending_count: c.confirmed, spots_left: null, neighborhood: null, city: null,
    slug: null, badge: null, image_url: null, accent_color: c.color,
  } as unknown as Event);

  return (
    <div style={{ padding: "0 0 24px" }}>
      {/* RSVP sheet */}
      {rsvpEv && <InvitationRsvpSheet ev={rsvpEv} onClose={() => setRsvpEv(null)} />}
      {rsvpDemo && <InvitationRsvpSheet ev={demoAsEvent((INVITE_DEMO.find(c => c.id === rsvpDemo) ?? INVITE_DEMO[0]) as typeof INVITE_DEMO[0])} onClose={() => setRsvpDemo(null)} />}

      {/* Header */}
      <div style={{ padding: "18px 16px 14px" }}>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, letterSpacing: "0.28em", color: "rgba(255,255,255,0.4)", marginBottom: 8 }}>💌 INVITATIONS</p>
        <h2 style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900, fontSize: "clamp(24px, 7vw, 30px)", color: "rgba(255,238,220,0.96)", lineHeight: 1.0, margin: "0 0 6px" }}>
          We show up for our girls.
        </h2>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: 11, color: "rgba(255,255,255,0.38)" }}>
          Birthdays, wins & the moments that matter — open an invite, let her know you&apos;re coming, and send confetti no matter what.
        </p>
      </div>

      {/* Type tabs */}
      <div style={{ display: "flex", gap: 6, padding: "0 14px 16px", overflowX: "auto", scrollbarWidth: "none" as const }}>
        {(["All", "Birthday", "Wins", "Milestones"] as InviteType[]).map(t => (
          <button key={t} onClick={() => setTypeFilter(t)} style={{ flexShrink: 0, padding: "7px 16px", borderRadius: 999, border: "none", cursor: "pointer", background: typeFilter === t ? PINK : "rgba(255,255,255,0.1)", color: typeFilter === t ? "white" : "rgba(255,255,255,0.55)", fontFamily: "var(--font-jost)", fontSize: "10px", fontWeight: 800, letterSpacing: "0.06em", boxShadow: typeFilter === t ? `0 3px 14px ${PINK}55` : "none", transition: "all 0.15s" }}>
            {t === "Birthday" ? "🎂 " : t === "Wins" ? "✨ " : t === "Milestones" ? "🌸 " : ""}{t}
          </button>
        ))}
      </div>

      {/* Real invitation events with RSVP options */}
      {events.length > 0 && (
        <div style={{ padding: "0 14px 14px" }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "7.5px", fontWeight: 800, letterSpacing: "0.2em", color: "rgba(255,255,255,0.35)", marginBottom: 10 }}>YOUR INVITATIONS</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {events.map(ev => (
              <div key={ev.id} style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 18, overflow: "hidden" }}>
                <div style={{ height: 3, background: `linear-gradient(90deg, ${PINK}, ${PINK}44)` }} />
                <div style={{ padding: "14px 16px" }}>
                  <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 17, fontWeight: 900, color: "white", lineHeight: 1.1, marginBottom: 4 }}>{ev.title}</p>
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: "8.5px", color: "rgba(255,255,255,0.45)", marginBottom: 14 }}>{ev.venue ?? ev.neighborhood} · {new Date(ev.starts_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</p>
                  <div style={{ display: "flex", gap: 7 }}>
                    <button onClick={() => { onToggle(ev.id); }} style={{ flex: 1, padding: "9px 6px", borderRadius: 10, border: "none", cursor: "pointer", background: joined.has(ev.id) ? PINK : "rgba(255,255,255,0.12)", color: "white", fontFamily: "var(--font-jost)", fontSize: "8.5px", fontWeight: 800 }}>
                      {joined.has(ev.id) ? "I'm going ✓" : "I'm going"}
                    </button>
                    <button onClick={() => setRsvpEv(ev)} style={{ flex: 1, padding: "9px 6px", borderRadius: 10, border: "none", cursor: "pointer", background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.75)", fontFamily: "var(--font-jost)", fontSize: "8.5px", fontWeight: 800 }}>
                      Can&apos;t make it
                    </button>
                    <button onClick={() => setRsvpEv(ev)} style={{ flex: 1, padding: "9px 6px", borderRadius: 10, border: "none", cursor: "pointer", background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.75)", fontFamily: "var(--font-jost)", fontSize: "8.5px", fontWeight: 800 }}>
                      I&apos;ll try 🤞
                    </button>
                  </div>
                  <button onClick={() => setRsvpEv(ev)} style={{ width: "100%", marginTop: 7, padding: "8px", borderRadius: 10, border: `1px solid ${PINK}33`, background: `${PINK}12`, cursor: "pointer", fontFamily: "var(--font-jost)", fontSize: "8.5px", fontWeight: 800, color: PINK }}>
                    🎊 Send confetti
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Demo invitation cards (envelope look) */}
      <div style={{ padding: "0 14px" }}>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: "7.5px", fontWeight: 800, letterSpacing: "0.2em", color: "rgba(255,255,255,0.35)", marginBottom: 12 }}>OPEN INVITATIONS</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {(demo as typeof INVITE_DEMO[number][]).map(c => (
            <EnvelopeInviteCard key={c.id} c={c as typeof INVITE_DEMO[0]} onOpen={() => setRsvpDemo(c.id)} />
          ))}
        </div>
      </div>

      {/* Confetti strip — recently sent */}
      <div style={{ margin: "20px 14px 0", padding: "16px", background: "rgba(255,255,255,0.06)", borderRadius: 18, border: "1px solid rgba(255,255,255,0.1)" }}>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: "7.5px", fontWeight: 800, letterSpacing: "0.22em", color: "rgba(255,255,255,0.35)", marginBottom: 12 }}>🎊 CONFETTI SENT</p>
        <div style={{ display: "flex", gap: 10, overflowX: "auto", scrollbarWidth: "none" as const }}>
          {[
            { name: "Maya B.", what: "New job 🎉", color: "#FF1F7D" },
            { name: "Temi O.", what: "Birthday 🎂", color: "#FF69B4" },
            { name: "Jade R.", what: "New keys 🏠", color: "#E8006A" },
            { name: "Sade L.", what: "Book deal 📚", color: "#C80060" },
          ].map((r, i) => (
            <div key={i} style={{ flexShrink: 0, width: 90, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <div style={{ width: 44, height: 44, borderRadius: "50%", background: `linear-gradient(135deg, ${r.color}, ${r.color}66)`, display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid rgba(255,255,255,0.12)" }}>
                <span style={{ fontFamily: "var(--font-jost)", fontSize: 13, fontWeight: 900, color: "white" }}>{r.name[0]}</span>
              </div>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 700, color: "rgba(255,255,255,0.75)", textAlign: "center", lineHeight: 1.2 }}>{r.name}</p>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "7.5px", color: "rgba(255,255,255,0.38)", textAlign: "center", lineHeight: 1.3 }}>{r.what}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Drop confetti CTA */}
      <div style={{ margin: "14px 14px 0", padding: "14px 16px", background: `${PINK}18`, border: `1px solid ${PINK}28`, borderRadius: 16, display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ fontSize: 22 }}>🎊</span>
        <div style={{ flex: 1 }}>
          <p style={{ fontFamily: "var(--font-jost)", fontWeight: 800, fontSize: 12, color: "rgba(255,255,255,0.85)", marginBottom: 2 }}>Drop confetti on her</p>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "9px", color: "rgba(255,255,255,0.4)" }}>Birthdays, wins, new keys, new chapters</p>
        </div>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={PINK} strokeWidth="2.2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
      </div>
    </div>
  );
}

/* ── Static collage (no events yet) ─────────────────────── */
function StaticCollage() {
  const DEMO_EVENTS: EventCardData[] = [
    { id: "d1",  type: "concert",    title: "Vinyl Night & Jazz",        host: "Girl Creatives",  location: "Elsewhere, Bushwick",  date: "SAT JUL 12", time: "9 PM",    spotsLeft: 12, accentColor: "#1C1B1C" },
    { id: "d2",  type: "party",      title: "Girls Night Out",           host: "BloomBay",        location: "SoHo",                 date: "FRI JUL 11", time: "10 PM",   spotsLeft: 6,  accentColor: PINK },
    { id: "d3",  type: "supper",     title: "Italian Dinner Society",    host: "Yande M.",        location: "Carbone, West Village",date: "THU JUL 17", time: "7:30 PM", going: 8 },
    { id: "d4",  type: "invitation", title: "Pilates + Matcha Morning",  host: "Sofia K.",        location: "Williamsburg",         date: "SUN JUL 13", time: "9 AM",    spotsLeft: 3 },
    { id: "d5",  type: "open_seats", title: "Sunday Supper",             host: "Natalie M.",      location: "West Village",         date: "SUN JUL 13", time: "7 PM",    spotsLeft: 2,  going: 6 },
    { id: "d6",  type: "table",      title: "Private Dinner Party",      host: "House of Flora",  location: "NoHo",                 date: "SAT JUL 19", time: "8 PM",    spotsLeft: 4,  accentColor: "#1A3A1A" },
    { id: "d7",  type: "drinks",     title: "Aperitivo Hour",            host: "Valentini's",     location: "Nolita",               date: "FRI JUL 18", time: "6 PM",    spotsLeft: 8,  accentColor: "#C84030" },
    { id: "d8",  type: "museum",     title: "MoMA + Froyo After",        host: "Museum Girls",    location: "Midtown",              date: "SAT JUL 19", time: "2 PM",    spotsLeft: 5 },
    { id: "d9",  type: "brunch",     title: "Sunday Brunch Club",        host: "BloomBay",        location: "Ladurée SoHo",         date: "SUN JUL 20", time: "11 AM",   going: 14 },
    { id: "d10", type: "bakery",     title: "Croissant Morning",         host: "Flour & Stone",   location: "Lower East Side",      date: "SAT JUL 12", time: "9 AM",    spotsLeft: 10, accentColor: "#8B3A2A" },
    { id: "d11", type: "walk",       title: "Brooklyn Bridge Walk",      host: "Walk & Talk Club",location: "Brooklyn Bridge Park", date: "SUN JUL 13", time: "8 AM",    going: 22 },
    { id: "d12", type: "food",       title: "Wine & Cheese Tasting",     host: "Buvette",         location: "West Village",         date: "WED JUL 16", time: "7 PM",    spotsLeft: 6,  accentColor: "#C8860A" },
  ];

  return (
    <>
      {/* Template showcase — one of each type */}
      <div style={{ padding: "0 14px 8px" }}>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, letterSpacing: "0.18em", color: "rgba(255,255,255,0.5)", marginBottom: 10 }}>HAPPENING SOON</p>
        <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 12, scrollbarWidth: "none" as const }}>
          {DEMO_EVENTS.map(ev => (
            <EventCard key={ev.id} ev={ev} />
          ))}
        </div>
      </div>
      {/* Photo poster strip */}
      <div style={{ display: "flex", gap: 10, overflowX: "auto", padding: "0 12px 12px", scrollbarWidth: "none" as const }}>
        {[
          { img: POSTER_IMGS[0], title: "Girls Night Out", sub: "This weekend · SoHo" },
          { img: POSTER_IMGS[7], title: "Rooftop Sessions", sub: "Fri · 8PM · Williamsburg" },
          { img: POSTER_IMGS[5], title: "Dance All Night", sub: "Sat · Midnight · DUMBO" },
        ].map((item, i) => (
          <div key={i} style={{ flexShrink: 0, width: 150, height: 190, borderRadius: 14, overflow: "hidden", position: "relative", boxShadow: "0 6px 22px rgba(0,0,0,0.45)" }}>
            <Image src={item.img} alt={item.title} fill style={{ objectFit: "cover" }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0) 40%, rgba(0,0,0,0.85) 100%)" }}/>
            <div style={{ position: "absolute", bottom: 10, left: 10, right: 10 }}>
              <p style={{ fontFamily: "var(--font-playfair)", fontSize: 13, fontWeight: 900, fontStyle: "italic", color: "white", lineHeight: 1.2 }}>{item.title}</p>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", color: "rgba(255,255,255,0.6)", letterSpacing: "0.05em", marginTop: 2 }}>{item.sub}</p>
            </div>
          </div>
        ))}
      </div>
      {/* Dense grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, padding: "0 12px" }}>
        <StaticPosterCard img={POSTER_IMGS[3]} title="Italian Dinner Society" sub="Fri · Carbone · 7PM"/>
        <StaticPosterCard img={POSTER_IMGS[6]} title="Sunday Brunch Club" sub="Sun · 11AM · Ladurée"/>
        <StaticPosterCard img={POSTER_IMGS[2]} title="Vinyl Night & Jazz" sub="Sat · 9PM · Bushwick"/>
        <StaticPosterCard img={POSTER_IMGS[4]} title="Film Club" sub="Sun · 3PM · Lower East Side"/>
        <StaticPosterCard img={POSTER_IMGS[8]} title="Bagels & Books" sub="Sun · 10AM · Prospect Park"/>
        <StaticPosterCard img={POSTER_IMGS[9]} title="Ladies First Road Trip" sub="Weekend Getaway"/>
      </div>
    </>
  );
}

/* ── Scene buildings (city guide categories) ─────────────── */
const SCENE_CATS = [
  { label: "EAT",        sub: "tables for one or ten",    color: "#FF1F7D", icon: "🍽",  pct: 88, href: "/member/city/eat" },
  { label: "GO",         sub: "places to be seen",        color: "#E07040", icon: "🗺",  pct: 76, href: "/member/city/go" },
  { label: "SOLO",       sub: "her solo scene",           color: "#5070C8", icon: "🎧",  pct: 83, href: "/member/city/solo" },
  { label: "GIRL GEMS",  sub: "curated by Bloomies",      color: "#C040A8", icon: "💎",  pct: 70, href: "/member/city/gems" },
  { label: "TRENDING",   sub: "what's hot right now",     color: "#E040B0", icon: "✦",   pct: 79, href: "/member/city/trending" },
];

function SceneBuilding({ cat, idx }: { cat: typeof SCENE_CATS[number]; idx: number }) {
  return (
    <Link href={cat.href} style={{ textDecoration: "none", display: "block" }}>
      <div style={{
        width: `${cat.pct}%`,
        height: 78,
        background: cat.color,
        backgroundImage: "radial-gradient(rgba(255,255,255,0.18) 1.5px, transparent 1.5px)",
        backgroundSize: "10px 10px",
        borderRadius: "0 18px 18px 0",
        display: "flex", alignItems: "center",
        padding: "0 18px 0 20px",
        gap: 14,
        boxShadow: `0 5px 22px ${cat.color}44, inset 0 1px 0 rgba(255,255,255,0.22), inset 0 -1px 0 rgba(0,0,0,0.1)`,
        position: "relative", overflow: "hidden",
        transition: "transform 0.18s",
        cursor: "pointer",
      }}>
        {/* Gloss */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "42%", background: "linear-gradient(to bottom, rgba(255,255,255,0.2), transparent)", pointerEvents: "none" }}/>
        {/* Icon box */}
        <div style={{ width: 44, height: 44, borderRadius: 11, flexShrink: 0, background: "rgba(0,0,0,0.22)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: 21 }}>{cat.icon}</span>
        </div>
        {/* Labels */}
        <div style={{ flex: 1 }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: 15, fontWeight: 900, color: "white", letterSpacing: "0.07em", lineHeight: 1 }}>{cat.label}</p>
          <p style={{ fontFamily: "var(--font-caveat)", fontSize: 13, color: "rgba(255,255,255,0.72)", marginTop: 3 }}>{cat.sub}</p>
        </div>
        {/* Arrow */}
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
      </div>
    </Link>
  );
}

/* ── FAB ─────────────────────────────────────────────────── */
function CreateFAB() {
  return (
    <Link href="/member/host" style={{ textDecoration: "none" }}>
      <div style={{
        position: "fixed",
        bottom: "calc(env(safe-area-inset-bottom, 0px) + 155px)",
        right: 18,
        zIndex: 60,
        width: 52,
        height: 52,
        borderRadius: "50%",
        background: PINK,
        boxShadow: `0 4px 20px ${PINK}77, 0 2px 8px rgba(0,0,0,0.3)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        animation: "fabPop 3s ease-in-out infinite",
      }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
          <line x1="12" y1="5" x2="12" y2="19"/>
          <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
      </div>
    </Link>
  );
}

/* ── Traditions strip ────────────────────────────────────── */
function TraditionsStrip({ traditions, onFollow }: {
  traditions: Tradition[];
  onFollow: (id: string) => void;
}) {
  if (traditions.length === 0) return null;
  const FREQ_LABEL: Record<string, string> = { weekly: "Weekly", biweekly: "Bi-weekly", monthly: "Monthly", seasonal: "Seasonal", irregular: "Recurring" };
  return (
    <div style={{ padding: "0 0 8px" }}>
      <div style={{ padding: "8px 14px 10px", display: "flex", alignItems: "center", gap: 6 }}>
        <div style={{ width: 4, height: 4, borderRadius: "50%", background: PINK }} />
        <span style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, letterSpacing: "0.22em", color: "rgba(255,255,255,0.5)" }}>TRADITIONS</span>
        <span style={{ fontFamily: "var(--font-caveat)", fontSize: 11, color: "rgba(255,255,255,0.25)", marginLeft: 4 }}>recurring series by Bloomies</span>
      </div>
      <div style={{ display: "flex", gap: 10, overflowX: "auto", padding: "0 14px 8px", scrollbarWidth: "none" as const }}>
        {traditions.map(t => (
          <div key={t.id} style={{
            flexShrink: 0, width: 160, borderRadius: 16,
            background: `linear-gradient(145deg, ${t.primary_color}22, ${t.primary_color}44)`,
            border: `1px solid ${t.primary_color}44`,
            padding: "14px 14px 12px",
            position: "relative", overflow: "hidden",
          }}>
            <div style={{ position: "absolute", top: -16, right: -16, width: 60, height: 60, borderRadius: "50%", background: `${t.primary_color}22` }} />
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.12em", color: t.primary_color, marginBottom: 4 }}>{FREQ_LABEL[t.frequency] ?? "RECURRING"} · {t.neighborhood ?? "NYC"}</p>
            <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900, fontSize: 14, color: "white", lineHeight: 1.2, marginBottom: 6 }}>{t.name}</p>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "7.5px", color: "rgba(255,255,255,0.45)", marginBottom: 10 }}>by {t.host_name ?? "A Bloomie"} · {t.follower_count} following</p>
            <button onClick={() => onFollow(t.id)} style={{
              background: t.is_following ? "rgba(255,255,255,0.12)" : t.primary_color,
              border: "none", borderRadius: 999, padding: "5px 12px",
              color: "white", fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800,
              cursor: "pointer", transition: "all 0.18s",
            }}>
              {t.is_following ? "FOLLOWING ✓" : "FOLLOW →"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Main ────────────────────────────────────────────────── */
export function HappeningsPage({ standalone = true }: { standalone?: boolean }) {
  const [tab,            setTab]           = useState<HapTab>("happenings");
  const [filter,         setFilter]        = useState<Filter>("All");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");
  const [filterOpen,     setFilterOpen]    = useState(false);
  const [searchOpen,     setSearchOpen]    = useState(false);
  const [searchQuery,    setSearchQuery]   = useState("");
  const [gatheringFlowers, setGatheringFlowers] = useState<Record<string, { count: number; gave: boolean }>>({});
  const [traditions,   setTraditions]   = useState<Tradition[]>([]);
  const [events,     setEvents]    = useState<Event[]>([]);
  const [joined,     setJoined]    = useState<Set<string>>(new Set());
  const [loading,    setLoading]   = useState(true);
  const [, startTransition] = useTransition();

  // Waitlist
  const [waitlistCounts, setWaitlistCounts] = useState<Record<string, number>>({});
  const [myWaitlist,     setMyWaitlist]     = useState<Set<string>>(new Set());

  // Host streak
  const [hostedCount, setHostedCount] = useState(0);

  // Review tracking
  const [reviewedIds, setReviewedIds] = useState<Set<string>>(new Set());

  // Introductions
  const [intros,        setIntros]        = useState<IntroPost[]>([]);
  const [introsLoading, setIntrosLoading] = useState(false);
  const [showIntroPost, setShowIntroPost] = useState(false);

  // Sheets
  const [inviteEv,   setInviteEv]   = useState<Event | null>(null);
  const [witnessEv,  setWitnessEv]  = useState<Event | null>(null);
  const [reviewEv,   setReviewEv]   = useState<Event | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const [evs, ids] = await Promise.all([getEvents(), getJoinedEventIds()]);
      setEvents(evs);
      setJoined(new Set(ids));
      setLoading(false);

      // Load ancillary data in background
      const eventIds = evs.map(e => e.id);
      Promise.all([
        getWaitlistCounts(eventIds),
        getMyWaitlistIds(),
        getMyHostedCount(),
        getMyReviewedEventIds(),
        getGatheringFlowersForUser(eventIds),
        getTraditions(8),
      ]).then(([wCounts, wIds, hCount, rIds, flowers, trads]) => {
        setWaitlistCounts(wCounts);
        setMyWaitlist(new Set(wIds));
        setHostedCount(hCount);
        setReviewedIds(new Set(rIds));
        setGatheringFlowers(flowers as Record<string, { count: number; gave: boolean }>);
        setTraditions(trads as Tradition[]);
      }).catch(() => {});
    }
    load();
  }, []);

  useEffect(() => {
    if (tab !== "intros") return;
    setIntrosLoading(true);
    getIntros().then(data => { setIntros(data); setIntrosLoading(false); }).catch(() => setIntrosLoading(false));
  }, [tab]);

  function toggleJoin(eventId: string) {
    const isJoined = joined.has(eventId);
    setJoined(prev => {
      const next = new Set(prev);
      isJoined ? next.delete(eventId) : next.add(eventId);
      return next;
    });
    startTransition(async () => {
      if (isJoined) await leaveEvent(eventId);
      else await joinEvent(eventId);
    });
  }

  function toggleWaitlist(eventId: string) {
    const onList = myWaitlist.has(eventId);
    setMyWaitlist(prev => { const s = new Set(prev); onList ? s.delete(eventId) : s.add(eventId); return s; });
    setWaitlistCounts(prev => ({ ...prev, [eventId]: Math.max(0, (prev[eventId] ?? 0) + (onList ? -1 : 1)) }));
    startTransition(async () => {
      if (onList) await leaveWaitlist(eventId);
      else await joinWaitlist(eventId);
    });
  }

  // Past events you attended (ended within last 48 hours)
  const now = Date.now();
  const recentPast = events.filter(ev => {
    const ended = new Date(ev.starts_at).getTime();
    const diffH = (now - ended) / 36e5;
    return diffH >= 0 && diffH <= 48 && joined.has(ev.id);
  });

  const filtered = events.filter(ev => {
    if (!matchesFilter(ev, filter) || !matchesCategoryFilter(ev, categoryFilter)) return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return ev.title.toLowerCase().includes(q) ||
      (ev.venue ?? ev.neighborhood ?? ev.city).toLowerCase().includes(q) ||
      (ev.host_name ?? "").toLowerCase().includes(q);
  });

  function toggleEventFlower(eventId: string) {
    setGatheringFlowers(prev => {
      const cur = prev[eventId] ?? { count: 0, gave: false };
      return { ...prev, [eventId]: { count: cur.count + (cur.gave ? -1 : 1), gave: !cur.gave } };
    });
    void toggleGatheringFlower(eventId);
  }

  function handleFollowTradition(id: string) {
    setTraditions(prev => prev.map(t => t.id === id
      ? { ...t, is_following: !t.is_following, follower_count: t.follower_count + (t.is_following ? -1 : 1) }
      : t
    ));
    void toggleFollowTradition(id);
  }

  const tickerItems = events.length > 0
    ? events.map(ev => `${ev.title.toUpperCase()} · ${ev.neighborhood ?? ev.city} · ${fmtTime(ev.starts_at)}`)
    : ["GIRLS NIGHT OUT ✦ ITALIAN DINNER SOCIETY ✦ ROOFTOP SESSIONS ✦ VINYL NIGHT ✦ SUNDAY BRUNCH CLUB ✦ FILM NIGHT ✦ DANCE ALL NIGHT"];

  return (
    <div className="bloom-world-enter" style={{ background: getPageBg(), minHeight: standalone ? "100vh" : "auto", paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 130px)" }}>
      <style>{CSS}</style>


      {/* ── Fixed top bar ── */}
      {/* tablet: top-[60px] clears the fixed desktop top-nav; desktop: top-0 + left-60 clears the sidebar */}
      {standalone && <div className="md:top-[60px] lg:top-0 lg:left-60 lg:right-[280px]" style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 51,
        background: getNavBg(),
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.1)",
        paddingTop: "env(safe-area-inset-top, 0px)",
      }}>
        {/* Row 1: toggle + search */}
        <div style={{ height: 50, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 14px" }}>
          {/* Tab toggle */}
          <div style={{ display: "inline-flex", background: "rgba(255,255,255,0.08)", borderRadius: 999, padding: "3px" }}>
            {([["happenings","Happenings"],["intros","Intros"],["map","Map"],["scene","City"]] as [HapTab, string][]).map(([t, label]) => (
              <button key={t} onClick={() => { setTab(t); setSearchOpen(false); setSearchQuery(""); }} style={{
                padding: "5px 10px", borderRadius: 999, border: "none",
                background: tab === t ? "rgba(255,255,255,0.95)" : "transparent",
                color: tab === t ? PINK : "rgba(255,255,255,0.85)",
                fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 800,
                letterSpacing: "0.06em", cursor: "pointer", transition: "all 0.18s",
                boxShadow: tab === t ? "0 2px 10px rgba(0,0,0,0.18)" : "none",
              }}>
                {label}
              </button>
            ))}
          </div>
          {/* Search icon */}
          <button onClick={() => setSearchOpen(o => !o)} style={{ display: "flex", padding: 6, background: searchOpen ? "rgba(255,255,255,0.15)" : "none", border: "none", cursor: "pointer", borderRadius: 999 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={searchOpen ? PINK : "rgba(255,255,255,0.75)"} strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
          </button>
        </div>
      </div>}

      {/* ── Filter toggle — floating left pill ── */}
      {standalone && tab === "happenings" && (
        <button
          onClick={() => setFilterOpen(o => !o)}
          aria-label="Toggle filters"
          style={{
            position: "fixed", left: 0, top: 60, zIndex: 49,
            background: filterOpen ? PINK : "rgba(20,8,32,0.72)",
            backdropFilter: "blur(12px)",
            border: `1.5px solid ${filterOpen ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.12)"}`,
            borderLeft: "none", borderRadius: "0 16px 16px 0",
            padding: "9px 11px 9px 7px", cursor: "pointer",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
            WebkitTapHighlightColor: "transparent",
            transition: "all 0.18s",
          }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round">
            {filterOpen
              ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
              : <><line x1="3" y1="6" x2="21" y2="6"/><line x1="7" y1="12" x2="17" y2="12"/><line x1="10" y1="18" x2="14" y2="18"/></>
            }
          </svg>
          {!filterOpen && (filter !== "All" || categoryFilter !== "all") && (
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: "white" }} />
          )}
        </button>
      )}

      {/* ── Collapsible search bar ── */}
      {standalone && searchOpen && (
        <div className="md:top-[110px] lg:top-[50px] lg:left-60 lg:right-[280px]" style={{
          position: "fixed", top: 50, left: 0, right: 0, zIndex: 50,
          background: getNavBg(), backdropFilter: "blur(20px)",
          padding: "10px 14px 12px",
          borderBottom: "1px solid rgba(255,255,255,0.1)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.12)", borderRadius: 999, padding: "8px 14px" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              autoFocus
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search events, venues, hosts…"
              style={{ flex: 1, background: "none", border: "none", outline: "none", fontFamily: "var(--font-jost)", fontSize: 13, color: "white", caretColor: PINK }}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.5)", fontSize: 16, lineHeight: 1, padding: 0 }}>×</button>
            )}
          </div>
        </div>
      )}

      {/* ── Page content ── */}
      <div style={{ paddingTop: standalone ? (searchOpen ? 104 : 50) : 0 }}>

        {/* ── HAPPENINGS TAB ── */}
        {(standalone ? tab === "happenings" : true) && (
          <>
            {/* ── Post-event witness section ── */}
            {!loading && recentPast.length > 0 && (
              <div style={{ margin: "10px 14px 4px", background: "rgba(255,255,255,0.07)", borderRadius: 12, padding: "12px 14px", border: "1px solid rgba(255,255,255,0.1)" }}>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "7.5px", fontWeight: 800, letterSpacing: "0.18em", color: "rgba(255,255,255,0.5)", marginBottom: 8 }}>HAPPENED RECENTLY</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {recentPast.slice(0, 3).map(ev => (
                    <div key={ev.id} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontFamily: "var(--font-caveat)", fontSize: 14, color: "rgba(255,255,255,0.85)", lineHeight: 1.1 }}>{ev.title}</p>
                        <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", color: "rgba(255,255,255,0.35)", marginTop: 1 }}>{ev.neighborhood ?? ev.city}</p>
                      </div>
                      {!reviewedIds.has(ev.id) && ev.host_name && (
                        <button onClick={() => setReviewEv(ev)} style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 999, padding: "4px 10px", color: "rgba(255,255,255,0.75)", fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 700, cursor: "pointer", flexShrink: 0 }}>
                          Rate host
                        </button>
                      )}
                      <button onClick={() => setWitnessEv(ev)} style={{ background: PINK, border: "none", borderRadius: 999, padding: "4px 10px", color: "white", fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, cursor: "pointer", flexShrink: 0 }}>
                        Who was there?
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Last Minute Plans ── */}
            {(() => {
              const nowMs = Date.now();
              const lastMinute = events.filter(ev => {
                const ms = new Date(ev.starts_at).getTime();
                const hoursAway = (ms - nowMs) / 36e5;
                return hoursAway >= 0 && hoursAway <= 6;
              });
              if (loading || lastMinute.length === 0) return null;
              return (
                <div style={{ margin: "12px 14px 0" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(255,220,0,0.12)", border: "1px solid rgba(255,220,0,0.22)", borderRadius: 999, padding: "4px 10px 4px 7px" }}>
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#FFD700", animation: "livePulse 1.2s ease-in-out infinite" }} />
                      <span style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 900, letterSpacing: "0.16em", color: "#FFD700" }}>LAST MINUTE</span>
                    </div>
                    <p style={{ fontFamily: "var(--font-jost)", fontSize: "9px", color: "rgba(255,255,255,0.32)", fontWeight: 600 }}>Starting in the next 6 hours</p>
                  </div>
                  <div style={{ display: "flex", gap: 10, overflowX: "auto", scrollbarWidth: "none" as const }}>
                    {lastMinute.slice(0, 6).map((ev, i) => {
                      const startTime = new Date(ev.starts_at).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
                      const hoursAway = Math.round((new Date(ev.starts_at).getTime() - nowMs) / 36e5 * 10) / 10;
                      const isJoined = joined.has(ev.id);
                      return (
                        <div key={ev.id} style={{
                          flexShrink: 0,
                          width: 160,
                          background: "rgba(255,220,0,0.06)",
                          border: "1px solid rgba(255,220,0,0.15)",
                          borderRadius: 14,
                          padding: "12px 13px 12px",
                          display: "flex",
                          flexDirection: "column",
                          gap: 6,
                        }}>
                          <p style={{ fontFamily: "var(--font-jost)", fontSize: "7.5px", fontWeight: 800, color: "#FFD700", letterSpacing: "0.1em" }}>
                            ⚡ {hoursAway < 1 ? "< 1h away" : `${hoursAway}h away`}
                          </p>
                          <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 14, fontWeight: 700, color: "white", lineHeight: 1.2 }}>{ev.title}</p>
                          <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", color: "rgba(255,255,255,0.4)", lineHeight: 1.3 }}>
                            {startTime}{ev.venue ? ` · ${ev.venue}` : ""}
                          </p>
                          <button
                            onClick={() => { const id = ev.id; void (isJoined ? leaveEvent(id) : joinEvent(id)); setJoined(prev => { const s = new Set(prev); isJoined ? s.delete(id) : s.add(id); return s; }); }}
                            style={{
                              marginTop: 2,
                              padding: "7px 0",
                              borderRadius: 999,
                              border: "none",
                              background: isJoined ? "rgba(255,255,255,0.1)" : "#FFD700",
                              color: isJoined ? "rgba(255,255,255,0.5)" : "#111",
                              fontFamily: "var(--font-jost)",
                              fontSize: "8px",
                              fontWeight: 900,
                              cursor: "pointer",
                              letterSpacing: "0.08em",
                            }}
                          >
                            {isJoined ? "Going ✓" : "Going →"}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}

            {/* ── Tonight strip ── */}
            {!loading && <TonightStrip events={events} joined={joined} onToggle={toggleJoin} />}

            {/* ── Host streak badge ── */}
            {!loading && hostedCount >= 2 && (
              <div style={{ margin: "8px 14px 4px", display: "inline-flex", alignItems: "center", gap: 10, background: "rgba(255,31,125,0.12)", borderRadius: 12, padding: "10px 14px", border: "1px solid rgba(255,31,125,0.25)" }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: PINK, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: `0 3px 10px ${PINK}55` }}>
                  <span style={{ fontFamily: "var(--font-playfair)", fontSize: 12, fontWeight: 900, fontStyle: "italic", color: "white" }}>{hostedCount}</span>
                </div>
                <div>
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: "7.5px", fontWeight: 800, letterSpacing: "0.16em", color: "rgba(255,255,255,0.9)" }}>HOST STREAK ✦</p>
                  <p style={{ fontFamily: "var(--font-caveat)", fontSize: 12, color: "rgba(255,255,255,0.45)", marginTop: 1 }}>the city knows you ♡</p>
                </div>
              </div>
            )}

            {/* Filter chips — collapsible, toggled by left pill button */}
            {filterOpen && (
              <>
                <div className="filter-scroll" style={{ display: "flex", gap: 7, overflowX: "auto", padding: "8px 14px 4px", scrollbarWidth: "none" as const }}>
                  {FILTERS.map(f => (
                    <button key={f} onClick={() => setFilter(f)} style={{
                      flexShrink: 0, padding: "6px 16px", borderRadius: 999,
                      border: "none",
                      background: filter === f ? PINK : "rgba(255,255,255,0.1)",
                      color: filter === f ? "white" : "rgba(255,255,255,0.6)",
                      fontFamily: "var(--font-jost)", fontSize: "10px", fontWeight: 700,
                      letterSpacing: "0.04em", cursor: "pointer",
                      boxShadow: filter === f ? `0 2px 12px ${PINK}55` : "none",
                      transition: "all 0.15s",
                    }}>
                      {f}
                    </button>
                  ))}
                </div>

                <div style={{ display: "flex", gap: 6, overflowX: "auto", padding: "4px 14px 10px", scrollbarWidth: "none" as const }}>
                  {CATEGORY_CHIPS.map(c => {
                    const active = categoryFilter === c.id;
                    return (
                      <button key={c.id} onClick={() => setCategoryFilter(active ? "all" : c.id)} style={{
                        flexShrink: 0, display: "flex", alignItems: "center", gap: 4,
                        padding: "4px 10px", borderRadius: 999, border: "none",
                        background: active ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.06)",
                        color: active ? "white" : "rgba(255,255,255,0.45)",
                        fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 700,
                        letterSpacing: "0.04em", cursor: "pointer",
                        outline: active ? `1.5px solid rgba(255,255,255,0.4)` : "none",
                        transition: "all 0.15s",
                      }}>
                        <span style={{ fontSize: 11, lineHeight: 1 }}>{c.emoji}</span>
                        {c.label}
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            {/* Ticker */}
            <div style={{ overflow: "hidden", borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,31,125,0.07)", padding: "7px 0", marginBottom: 12 }}>
              <div style={{ display: "flex", animation: "ticker 28s linear infinite", width: "max-content" }}>
                {[...tickerItems, ...tickerItems].map((item, i) => (
                  <span key={i} style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 700, letterSpacing: "0.14em", color: "rgba(255,255,255,0.45)", whiteSpace: "nowrap", padding: "0 24px" }}>
                    {item} <span style={{ color: PINK }}>✦</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Count label */}
            <div style={{ padding: "0 14px 10px", display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 5, height: 5, borderRadius: "50%", background: PINK, animation: "livePulse 1.4s ease-in-out infinite" }}/>
              <span style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, letterSpacing: "0.18em", color: "rgba(255,255,255,0.35)" }}>
                {loading ? "LOADING…" : events.length === 0 ? "UPCOMING THIS WEEK" : filter === "All" ? `${events.length} HAPPENINGS` : `${filtered.length} ${filter.toUpperCase()}`}
              </span>
            </div>

            {/* Loading skeletons */}
            {loading && (
              <div style={{ padding: "0 12px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div style={{ gridColumn: "span 2" }}><Skeleton h={260} br={16} dark/></div>
                <Skeleton h={195} br={10} dark/>
                <Skeleton h={195} br={10} dark/>
                <Skeleton h={195} br={10} dark/>
                <Skeleton h={195} br={10} dark/>
              </div>
            )}

            {/* Invitations: celebration template */}
            {!loading && filter === "Invitations" && (
              <CelebrationInvitationsView
                events={filtered}
                joined={joined}
                onToggle={toggleJoin}
              />
            )}

            {/* Collage: real events */}
            {!loading && filter !== "Invitations" && filtered.length > 0 && (
              <EventTemplatesStrip
                events={filtered}
                joined={joined}
                waitlistCounts={waitlistCounts}
                myWaitlist={myWaitlist}
                onToggle={toggleJoin}
                onWaitlist={toggleWaitlist}
                onInvite={setInviteEv}
                flowers={gatheringFlowers}
                onFlower={toggleEventFlower}
              />
            )}

            {/* Collage: static posters when no events */}
            {!loading && filter !== "Invitations" && events.length === 0 && (
              <StaticCollage/>
            )}

            {/* No match for filter */}
            {!loading && filter !== "Invitations" && events.length > 0 && filtered.length === 0 && (
              <div style={{ padding: "40px 24px", textAlign: "center" }}>
                <p style={{ fontFamily: "var(--font-caveat)", fontSize: 18, color: "rgba(255,255,255,0.3)" }}>nothing here yet ✦</p>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "9px", color: "rgba(255,255,255,0.2)", marginTop: 6, letterSpacing: "0.06em" }}>try a different filter</p>
              </div>
            )}

            <div style={{ height: 20 }}/>

            {/* From your city */}
            {!loading && (
              <div style={{ padding: "0 0 8px" }}>
                <div style={{ padding: "8px 14px 10px", display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 4, height: 4, borderRadius: "50%", background: PINK }}/>
                  <span style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, letterSpacing: "0.22em", color: "rgba(255,255,255,0.4)" }}>FROM YOUR CITY</span>
                </div>
                <div style={{ display: "flex", gap: 10, overflowX: "auto", padding: "0 14px 12px", scrollbarWidth: "none" as const }}>
                  {[
                    { name: "Sunset Walk",  sub: "Brooklyn Bridge · SUN 1PM", img: POSTER_IMGS[9], going: 7  },
                    { name: "Natural Wine", sub: "West Village · TONIGHT",    img: POSTER_IMGS[1], going: 6  },
                    { name: "Rooftop Girls",sub: "SAT 8PM",                   img: POSTER_IMGS[7], going: 12 },
                    { name: "Dance All Night",sub: "SAT · 11PM",              img: POSTER_IMGS[5], going: 10 },
                  ].map((item, i) => (
                    <div key={i} style={{ flexShrink: 0, width: 140, borderRadius: 12, overflow: "hidden", position: "relative", height: 108, boxShadow: "0 4px 20px rgba(0,0,0,0.6)" }}>
                      <Image src={item.img} alt={item.name} fill style={{ objectFit: "cover" }} />
                      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0) 25%, rgba(0,0,0,0.88) 100%)" }}/>
                      {/* Going badge */}
                      <div style={{ position: "absolute", top: 8, right: 8, background: PINK, borderRadius: 999, padding: "2px 7px" }}>
                        <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, color: "white" }}>{item.going} going</p>
                      </div>
                      <div style={{ position: "absolute", bottom: 8, left: 8, right: 8 }}>
                        <p style={{ fontFamily: "var(--font-playfair)", fontSize: 12, fontWeight: 900, fontStyle: "italic", color: "white", lineHeight: 1.1 }}>{item.name}</p>
                        <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", color: "rgba(255,255,255,0.5)", marginTop: 2 }}>{item.sub}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* ── TRADITIONS ── */}
            {!loading && traditions.length > 0 && (
              <TraditionsStrip traditions={traditions} onFollow={handleFollowTradition} />
            )}

            {/* ── INTRODUCTIONS link ── */}
            {!loading && (
              <div style={{ margin: "8px 14px 16px" }}>
                <Link href="/member/introductions" style={{ textDecoration: "none" }}>
                  <div style={{
                    borderRadius: 18, overflow: "hidden",
                    background: "linear-gradient(135deg, rgba(255,31,125,0.18) 0%, rgba(192,0,96,0.25) 100%)",
                    border: "1px solid rgba(255,31,125,0.22)",
                    padding: "14px 18px",
                    display: "flex", alignItems: "center", gap: 14,
                  }}>
                    <div style={{ fontSize: 24 }}>👋</div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900, fontSize: 15, color: "white", lineHeight: 1.1 }}>Introductions</p>
                      <p style={{ fontFamily: "var(--font-caveat)", fontSize: 12, color: "rgba(255,255,255,0.55)", marginTop: 2 }}>Meet new arrivals, locals & women finding their people</p>
                    </div>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2.2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
                  </div>
                </Link>
              </div>
            )}
          </>
        )}

        {/* ── INTROS TAB ── */}
        {standalone && tab === "intros" && (
          <div style={{ paddingBottom: 96 }}>
            {/* Header */}
            <div style={{ padding: "20px 18px 16px" }}>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: 8, fontWeight: 800, letterSpacing: "0.3em", color: PINK, marginBottom: 6 }}>🌸 INTRODUCTIONS</p>
              <h2 style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900, fontSize: "clamp(22px, 7vw, 28px)", color: "rgba(255,238,220,0.95)", lineHeight: 0.95, margin: 0, marginBottom: 10 }}>
                Meet the Women.
              </h2>
              <p style={{ fontFamily: "var(--font-caveat)", fontSize: 13, color: "rgba(255,255,255,0.45)", marginBottom: 14 }}>
                New arrivals, locals & women finding their people
              </p>
              <Link href="/member/introductions" style={{ textDecoration: "none", display: "block" }}>
              <div style={{
                display: "flex", alignItems: "center", gap: 10,
                background: "rgba(255,255,255,0.09)", border: "1.5px solid rgba(255,255,255,0.18)",
                borderRadius: 14, padding: "12px 16px", cursor: "pointer",
              }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: PINK, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ fontSize: 14 }}>👋</span>
                </div>
                <div style={{ flex: 1, textAlign: "left" as const }}>
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.75)" }}>Introduce yourself</p>
                  <p style={{ fontFamily: "var(--font-caveat)", fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 1 }}>Tap to share your story</p>
                </div>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
              </div>
              </Link>
            </div>
            {/* Intros list */}
            <div style={{ padding: "0 14px" }}>
              {introsLoading ? (
                <p style={{ fontFamily: "var(--font-caveat)", fontSize: 16, color: "rgba(255,255,255,0.3)", textAlign: "center" as const, padding: "30px 0" }}>Loading…</p>
              ) : intros.length === 0 ? (
                <p style={{ fontFamily: "var(--font-caveat)", fontSize: 16, color: "rgba(255,255,255,0.3)", textAlign: "center" as const, padding: "30px 0" }}>No introductions yet — be the first!</p>
              ) : intros.map(intro => (
                <div key={intro.id} style={{ background: "rgba(255,255,255,0.07)", borderRadius: 18, padding: "14px 16px", marginBottom: 10, border: "1px solid rgba(255,255,255,0.1)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                    <div style={{ width: 38, height: 38, borderRadius: "50%", background: `linear-gradient(135deg,${intro.color},${intro.color}BB)`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <span style={{ fontFamily: "var(--font-jost)", fontSize: 14, fontWeight: 800, color: "white" }}>{intro.initial}</span>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontFamily: "var(--font-jost)", fontSize: 13, fontWeight: 700, color: "white" }}>{intro.name}</p>
                      <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, color: "rgba(255,255,255,0.4)", marginTop: 1 }}>{intro.neighborhood ? `📍 ${intro.neighborhood} · ` : ""}{intro.time}</p>
                    </div>
                  </div>
                  <p style={{ fontFamily: "var(--font-caveat)", fontSize: 14, color: "rgba(255,255,255,0.7)", lineHeight: 1.5, marginBottom: 10 }}>{intro.bio}</p>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <button onClick={() => { const next = !intro.my_flower; void flowerIntro(intro.id); setIntros(prev => prev.map(i => i.id === intro.id ? { ...i, my_flower: next, flowers: i.flowers + (next ? 1 : -1) } : i)); }} style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 12px", borderRadius: 999, border: "none", cursor: "pointer", background: intro.my_flower ? `${PINK}20` : "rgba(255,255,255,0.08)" }}>
                      <span style={{ fontSize: 12 }}>🌸</span>
                      <p style={{ fontFamily: "var(--font-jost)", fontSize: 10, fontWeight: 700, color: intro.my_flower ? PINK : "rgba(255,255,255,0.5)" }}>{intro.flowers}</p>
                    </button>
                    <button style={{ padding: "7px 16px", borderRadius: 999, border: "none", cursor: "pointer", background: `linear-gradient(135deg,${PINK},#FF69B4)`, fontFamily: "var(--font-jost)", fontSize: 10, fontWeight: 800, color: "white", boxShadow: `0 2px 10px ${PINK}33` }}>
                      Connect →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── MAP TAB ── */}
        {standalone && tab === "map" && (
          <div style={{ minHeight: "calc(100vh - 54px)", display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "20px 18px 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 900, letterSpacing: "0.18em", color: PINK }}>EVENT MAP</p>
                <p style={{ fontFamily: "var(--font-caveat)", fontSize: 14, color: "rgba(255,255,255,0.45)", marginTop: 2 }}>happening near you</p>
              </div>
            </div>
            <div style={{ flex: 1, margin: "0 16px", borderRadius: 24, overflow: "hidden", position: "relative", minHeight: 380 }}>
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(160deg, #DEEDF8 0%, #C8DFF5 40%, #D5E8EE 100%)" }}/>
              {[10, 25, 40, 55, 70, 85].map(pct => (
                <div key={`h${pct}`} style={{ position: "absolute", top: `${pct}%`, left: 0, right: 0, height: 1, background: "rgba(80,130,180,0.22)", zIndex: 1 }}/>
              ))}
              {[15, 30, 45, 60, 75, 90].map(pct => (
                <div key={`v${pct}`} style={{ position: "absolute", left: `${pct}%`, top: 0, bottom: 0, width: 1, background: "rgba(80,130,180,0.22)", zIndex: 1 }}/>
              ))}
              <div style={{ position: "absolute", top: "6%", right: "8%", width: "24%", height: "32%", borderRadius: 14, background: "rgba(120,190,110,0.28)", border: "1px solid rgba(100,180,80,0.2)", zIndex: 1 }}/>
              <div style={{ position: "absolute", top: 0, left: "-2%", width: "14%", height: "100%", background: "rgba(120,160,220,0.18)", borderRight: "1px solid rgba(100,140,200,0.2)", zIndex: 1 }}/>
              {[
                {x:"24%",y:"42%",label:"Girls Night",color:"#FF1F7D",going:12},
                {x:"52%",y:"27%",label:"Rooftop",color:"#FF69B4",going:8},
                {x:"68%",y:"56%",label:"Vinyl Night",color:"#C084FC",going:6},
                {x:"36%",y:"68%",label:"Brunch Club",color:"#F97316",going:15},
                {x:"79%",y:"35%",label:"Jazz Night",color:"#FF1F7D",going:4},
                {x:"46%",y:"76%",label:"Dance All Night",color:"#C084FC",going:20},
                {x:"60%",y:"50%",label:"Book Society",color:"#84CC16",going:9},
              ].map((pin, i) => (
                <div key={i} style={{ position: "absolute", left: pin.x, top: pin.y, transform: "translate(-50%, -100%)", zIndex: 3 }}>
                  <div style={{ background: pin.color, borderRadius: 20, padding: "4px 10px 4px 8px", display: "flex", alignItems: "center", gap: 5, boxShadow: `0 3px 12px ${pin.color}66`, whiteSpace: "nowrap" as const }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: "rgba(255,255,255,0.9)", animation: "livePulse 1.4s ease-in-out infinite", flexShrink: 0 }}/>
                    <span style={{ fontSize: "9px", fontWeight: 800, color: "white", fontFamily: "var(--font-jost)", letterSpacing: "0.03em" }}>{pin.label}</span>
                    <span style={{ fontSize: "8px", color: "rgba(255,255,255,0.75)", fontFamily: "var(--font-jost)", fontWeight: 700 }}>{pin.going}</span>
                  </div>
                  <div style={{ width: 0, height: 0, borderLeft: "5px solid transparent", borderRight: "5px solid transparent", borderTop: `7px solid ${pin.color}`, margin: "0 auto" }}/>
                </div>
              ))}
              <div style={{ position: "absolute", bottom: 14, left: 14, right: 14, zIndex: 4, background: "rgba(255,255,255,0.82)", backdropFilter: "blur(12px)", borderRadius: 14, padding: "12px 16px", border: "1px solid rgba(255,31,125,0.12)" }}>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: 10, fontWeight: 800, letterSpacing: "0.1em", color: PINK, marginBottom: 3 }}>🗺 LIVE MAP</p>
                <p style={{ fontFamily: "var(--font-caveat)", fontSize: 13, color: "rgba(0,0,0,0.45)", lineHeight: 1.4 }}>Interactive map with real-time event locations near you.</p>
              </div>
            </div>
            <div style={{ padding: "12px 16px 24px", display: "flex", gap: 8, overflowX: "auto", scrollbarWidth: "none" as const }}>
              {[
                { label: "Girls Night Out", time: "Tonight", color: "#FF1F7D" },
                { label: "Rooftop Sessions", time: "Sat 8PM", color: "#FF69B4" },
                { label: "Vinyl Night", time: "Sat 9PM", color: "#C084FC" },
                { label: "Brunch Club", time: "Sun 11AM", color: "#F97316" },
                { label: "Jazz Night", time: "Fri 9PM", color: "#FF1F7D" },
                { label: "Dance All Night", time: "Sat 11PM", color: "#C084FC" },
              ].map((chip, i) => (
                <div key={i} style={{ flexShrink: 0, background: "rgba(255,255,255,0.12)", borderRadius: 999, padding: "8px 14px", border: `1.5px solid ${chip.color}44` }}>
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: "10px", fontWeight: 800, color: "white" }}>{chip.label}</p>
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", color: "rgba(255,255,255,0.45)", marginTop: 1 }}>{chip.time}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── CITY TAB (standalone only — embedded in CityPage when not standalone) ── */}
        {standalone && tab === "scene" && (
          <div style={{ padding: "0 0 24px", minHeight: "calc(100vh - 54px)" }}>
            <div style={{ padding: "20px 20px 8px" }}>
              <p style={{ fontFamily: "var(--font-caveat)", fontSize: 13, color: PINK, marginBottom: 2 }}>New York City</p>
              <h1 style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(26px, 8.5vw, 34px)", fontWeight: 900, fontStyle: "italic", color: "white", lineHeight: 1, letterSpacing: "-0.01em" }}>The City</h1>
              <p style={{ fontFamily: "var(--font-caveat)", fontSize: 14, color: "rgba(255,255,255,0.45)", marginTop: 4 }}>tap a neighborhood to explore</p>
            </div>

            <div style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", padding: "10px 0 30px", minHeight: 520 }}>
              <div style={{ width: 14, height: 14, borderRadius: "50%", background: "#8A8A8A", border: "3px solid #666", marginBottom: 0, zIndex: 2 }} />
              <div style={{ width: 8, height: "100%", position: "absolute", top: 14, background: "linear-gradient(90deg, #AAA 0%, #CCC 40%, #BBB 60%, #999 100%)", borderRadius: 4, zIndex: 1 }} />

              <div style={{ display: "flex", flexDirection: "column", gap: 14, paddingTop: 12, width: "100%", alignItems: "center", zIndex: 2 }}>
                <Link href="/member/city?area=les" style={{ textDecoration: "none", alignSelf: "flex-start", marginLeft: "5%" }}>
                  <div className="sign-s1" style={{ position: "relative", display: "inline-flex", alignItems: "center", gap: 0, filter: "drop-shadow(0 3px 8px rgba(0,0,0,0.18))" }}>
                    <div style={{ width: 0, height: 0, borderTop: "18px solid transparent", borderBottom: "18px solid transparent", borderRight: `16px solid ${PINK}` }} />
                    <div style={{ background: PINK, padding: "10px 18px 10px 10px", borderRadius: "0 8px 8px 0" }}>
                      <p style={{ fontFamily: "var(--font-playfair)", fontSize: 15, fontWeight: 900, fontStyle: "italic", color: "white", lineHeight: 1, whiteSpace: "nowrap" }}>Lower East Side</p>
                      <p style={{ fontFamily: "var(--font-jost)", fontSize: 8, fontWeight: 700, letterSpacing: "0.1em", color: "rgba(255,255,255,0.75)", marginTop: 2 }}>UNDERGROUND SPOTS · LATE NIGHTS</p>
                    </div>
                  </div>
                </Link>

                <Link href="/member/city?area=williamsburg" style={{ textDecoration: "none", alignSelf: "flex-end", marginRight: "5%" }}>
                  <div className="sign-s2" style={{ position: "relative", display: "inline-flex", alignItems: "center", gap: 0, filter: "drop-shadow(0 3px 8px rgba(0,0,0,0.18))" }}>
                    <div style={{ background: "#D86487", padding: "10px 10px 10px 18px", borderRadius: "8px 0 0 8px" }}>
                      <p style={{ fontFamily: "var(--font-playfair)", fontSize: 15, fontWeight: 900, fontStyle: "italic", color: "white", lineHeight: 1, whiteSpace: "nowrap" }}>Williamsburg</p>
                      <p style={{ fontFamily: "var(--font-jost)", fontSize: 8, fontWeight: 700, letterSpacing: "0.1em", color: "rgba(255,255,255,0.75)", marginTop: 2 }}>ROOFTOPS · STUDIOS · EATS</p>
                    </div>
                    <div style={{ width: 0, height: 0, borderTop: "18px solid transparent", borderBottom: "18px solid transparent", borderLeft: `16px solid #D86487` }} />
                  </div>
                </Link>

                <Link href="/member/city?area=crownheights" style={{ textDecoration: "none", alignSelf: "flex-start", marginLeft: "8%" }}>
                  <div className="sign-s3" style={{ position: "relative", display: "inline-flex", alignItems: "center", filter: "drop-shadow(0 3px 8px rgba(0,0,0,0.18))" }}>
                    <div style={{ width: 0, height: 0, borderTop: "18px solid transparent", borderBottom: "18px solid transparent", borderRight: `16px solid #C0185F` }} />
                    <div style={{ background: "#C0185F", padding: "10px 18px 10px 10px", borderRadius: "0 8px 8px 0" }}>
                      <p style={{ fontFamily: "var(--font-playfair)", fontSize: 15, fontWeight: 900, fontStyle: "italic", color: "white", lineHeight: 1, whiteSpace: "nowrap" }}>Crown Heights</p>
                      <p style={{ fontFamily: "var(--font-jost)", fontSize: 8, fontWeight: 700, letterSpacing: "0.1em", color: "rgba(255,255,255,0.75)", marginTop: 2 }}>BRUNCHES · RHYTHM · CULTURE</p>
                    </div>
                  </div>
                </Link>

                <Link href="/member/city?area=harlem" style={{ textDecoration: "none", alignSelf: "flex-end", marginRight: "8%" }}>
                  <div className="sign-s4" style={{ position: "relative", display: "inline-flex", alignItems: "center", filter: "drop-shadow(0 3px 8px rgba(0,0,0,0.18))" }}>
                    <div style={{ background: PINK, padding: "10px 10px 10px 18px", borderRadius: "8px 0 0 8px" }}>
                      <p style={{ fontFamily: "var(--font-playfair)", fontSize: 15, fontWeight: 900, fontStyle: "italic", color: "white", lineHeight: 1, whiteSpace: "nowrap" }}>Harlem</p>
                      <p style={{ fontFamily: "var(--font-jost)", fontSize: 8, fontWeight: 700, letterSpacing: "0.1em", color: "rgba(255,255,255,0.75)", marginTop: 2 }}>CULTURE RUNS DEEP</p>
                    </div>
                    <div style={{ width: 0, height: 0, borderTop: "18px solid transparent", borderBottom: "18px solid transparent", borderLeft: `16px solid ${PINK}` }} />
                  </div>
                </Link>

                <Link href="/member/city?area=soho" style={{ textDecoration: "none", alignSelf: "flex-start", marginLeft: "5%" }}>
                  <div className="sign-s5" style={{ position: "relative", display: "inline-flex", alignItems: "center", filter: "drop-shadow(0 3px 8px rgba(0,0,0,0.18))" }}>
                    <div style={{ width: 0, height: 0, borderTop: "18px solid transparent", borderBottom: "18px solid transparent", borderRight: `16px solid #E87BA8` }} />
                    <div style={{ background: "#E87BA8", padding: "10px 18px 10px 10px", borderRadius: "0 8px 8px 0" }}>
                      <p style={{ fontFamily: "var(--font-playfair)", fontSize: 15, fontWeight: 900, fontStyle: "italic", color: "white", lineHeight: 1, whiteSpace: "nowrap" }}>SoHo</p>
                      <p style={{ fontFamily: "var(--font-jost)", fontSize: 8, fontWeight: 700, letterSpacing: "0.1em", color: "rgba(255,255,255,0.75)", marginTop: 2 }}>GALLERIES · DINNERS · FASHION</p>
                    </div>
                  </div>
                </Link>

                <Link href="/member/city?area=dumbo" style={{ textDecoration: "none", alignSelf: "flex-end", marginRight: "5%" }}>
                  <div className="sign-s6" style={{ position: "relative", display: "inline-flex", alignItems: "center", filter: "drop-shadow(0 3px 8px rgba(0,0,0,0.18))" }}>
                    <div style={{ background: "#D86487", padding: "10px 10px 10px 18px", borderRadius: "8px 0 0 8px" }}>
                      <p style={{ fontFamily: "var(--font-playfair)", fontSize: 15, fontWeight: 900, fontStyle: "italic", color: "white", lineHeight: 1, whiteSpace: "nowrap" }}>DUMBO</p>
                      <p style={{ fontFamily: "var(--font-jost)", fontSize: 8, fontWeight: 700, letterSpacing: "0.1em", color: "rgba(255,255,255,0.75)", marginTop: 2 }}>WATERFRONT · BRIDGE VIEWS</p>
                    </div>
                    <div style={{ width: 0, height: 0, borderTop: "18px solid transparent", borderBottom: "18px solid transparent", borderLeft: `16px solid #D86487` }} />
                  </div>
                </Link>

                <Link href="/member/city?area=bushwick" style={{ textDecoration: "none", alignSelf: "flex-start", marginLeft: "10%" }}>
                  <div className="sign-s7" style={{ position: "relative", display: "inline-flex", alignItems: "center", filter: "drop-shadow(0 3px 8px rgba(0,0,0,0.18))" }}>
                    <div style={{ width: 0, height: 0, borderTop: "18px solid transparent", borderBottom: "18px solid transparent", borderRight: `16px solid #C0185F` }} />
                    <div style={{ background: "#C0185F", padding: "10px 18px 10px 10px", borderRadius: "0 8px 8px 0" }}>
                      <p style={{ fontFamily: "var(--font-playfair)", fontSize: 15, fontWeight: 900, fontStyle: "italic", color: "white", lineHeight: 1, whiteSpace: "nowrap" }}>Bushwick</p>
                      <p style={{ fontFamily: "var(--font-jost)", fontSize: 8, fontWeight: 700, letterSpacing: "0.1em", color: "rgba(255,255,255,0.75)", marginTop: 2 }}>ART · LATE NIGHTS · ENERGY</p>
                    </div>
                  </div>
                </Link>
              </div>
            </div>

            <div style={{ padding: "0 20px" }}>
              <div style={{ background: "rgba(255,255,255,0.65)", backdropFilter: "blur(12px)", borderRadius: 20, padding: "16px 18px", border: "1px solid rgba(255,31,125,0.15)" }}>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 800, letterSpacing: "0.18em", color: PINK, marginBottom: 6 }}>FULL CITY GUIDE</p>
                <p style={{ fontFamily: "var(--font-playfair)", fontSize: 13, fontStyle: "italic", color: "#666", lineHeight: 1.5, marginBottom: 12 }}>
                  Restaurants, bars, rooftops — curated by Bloomies for Bloomies.
                </p>
                <Link href="/member/city" style={{ textDecoration: "none" }}>
                  <div style={{ display: "inline-flex", background: PINK, color: "white", borderRadius: 999, padding: "9px 20px", fontFamily: "var(--font-jost)", fontSize: "10px", fontWeight: 800, letterSpacing: "0.08em", boxShadow: `0 4px 14px ${PINK}55` }}>
                    ALL OF NYC →
                  </div>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ══ FULL-PAGE MAP OVERLAY ══════════════════════════════════════════════ */}
      {/* FAB */}
      {tab === "happenings" && <CreateFAB/>}

      {/* ── Sheets ── */}
      {inviteEv  && <InviteFriendSheet ev={inviteEv}  onClose={() => setInviteEv(null)} />}
      {witnessEv && <WitnessSheet      ev={witnessEv} onClose={() => setWitnessEv(null)} />}
      {reviewEv  && (
        <HostReviewSheet
          ev={reviewEv}
          onClose={() => setReviewEv(null)}
          onDone={id => { setReviewedIds(prev => new Set([...prev, id])); setReviewEv(null); }}
        />
      )}
    </div>
  );
}
