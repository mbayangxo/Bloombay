"use client";

import { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import { getEvents, getJoinedEventIds, joinEvent, leaveEvent, type Event } from "@/lib/actions/events";
import { EventCard, type EventCardData, type EventType } from "@/app/components/portal/event-card-templates";

const PINK   = "#FF1F7D";
const DARK   = "#1C1B1C";
const CREAM  = "#F6F1EB";
const NAV_BG = "#F6F1EB";

// Map DB event_type string → EventType for template dispatch
function inferEventType(ev: Event): EventType {
  const t = (ev.event_type ?? "").toLowerCase();
  if (t.includes("concert") || t.includes("music") || t.includes("show") || t.includes("performance")) return "concert";
  if (t.includes("party") || t.includes("birthday") || t.includes("celebration") || t.includes("social")) return "party";
  if (t.includes("invitation") || t.includes("invite")) return "invitation";
  if (t.includes("open_seat") || t.includes("open seat") || t.includes("last seat")) return "open_seats";
  if (t.includes("table") || t.includes("supper club") || t.includes("private dinner")) return "table";
  if (t.includes("brunch") || t.includes("dinner") || t.includes("lunch") || t.includes("meal")) return "brunch";
  if (t.includes("walk") || t.includes("outdoor") || t.includes("hike") || t.includes("run")) return "walk";
  if (t.includes("museum") || t.includes("gallery") || t.includes("art") || t.includes("exhibition")) return "museum";
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

type HapTab = "happenings" | "city";
type Filter = "All" | "Tonight" | "This Weekend" | "Invitations" | "Open Seats" | "Gatherings" | "Club Events" | "Parties" | "Dinners";
type CategoryFilter = "all" | "arts" | "eat" | "music" | "books" | "active" | "drinks" | "film" | "dance";

const FILTERS: Filter[] = ["All", "Tonight", "This Weekend", "Invitations", "Open Seats", "Gatherings", "Club Events", "Parties", "Dinners"];

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
  if (filter === "All") return true;
  const badge = getBadge(ev);
  if (filter === "Tonight") return badge === "TONIGHT";
  if (filter === "This Weekend") return badge === "THIS WEEKEND" || badge === "TONIGHT";
  if (filter === "Dinners") return ev.event_type === "dinner" || ev.event_type === "brunch";
  if (filter === "Parties") return ev.event_type === "party" || ev.event_type === "rooftop" || ev.event_type === "social";
  if (filter === "Gatherings") return ev.event_type === "gathering" || ev.event_type === "casual" || ev.event_type === "walk";
  if (filter === "Club Events") return ev.event_type === "club" || ev.event_type === "club_event";
  if (filter === "Invitations") return ev.event_type === "invitation" || ev.event_type === "private";
  if (filter === "Open Seats") return ev.event_type === "open_seat";
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
    label: "Club Events",
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

/* ── Poster Card (full-width, tall, image-forward) ────────── */
function PosterCard({ ev, posterIdx, joined, onToggle, fullWidth = false }: {
  ev: Event; posterIdx: number; joined: boolean; onToggle: () => void; fullWidth?: boolean;
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
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={poster} alt={ev.title} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}/>
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
          </span>
          <button onClick={onToggle} style={{
            background: joined ? "rgba(255,255,255,0.12)" : PINK,
            color: "white", border: joined ? "1.5px solid rgba(255,255,255,0.35)" : "none",
            borderRadius: 999, padding: "5px 14px",
            fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, letterSpacing: "0.06em",
            cursor: "pointer", flexShrink: 0,
            boxShadow: joined ? "none" : `0 3px 14px ${PINK}66`,
          }}>
            {joined ? "JOINED ✓" : "JOIN →"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Ticket Card (perforated stub look) ───────────────────── */
function TicketCard({ ev, ticketIdx, joined, onToggle }: {
  ev: Event; ticketIdx: number; joined: boolean; onToggle: () => void;
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
        <img src={img} alt={ev.title} style={{ width: "100%", height: "100%", objectFit: "cover" }}/>
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
        <p style={{ fontFamily: "var(--font-jost)", fontSize: "6.5px", fontWeight: 800, letterSpacing: "0.18em", color: "rgba(0,0,0,0.35)", marginBottom: 3 }}>ADMIT ONE</p>
        <p style={{ fontFamily: "var(--font-playfair)", fontSize: 13, fontWeight: 900, fontStyle: "italic", color: "#1A1A1A", lineHeight: 1.2, marginBottom: 4 }}>{ev.title}</p>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", color: "rgba(0,0,0,0.45)", letterSpacing: "0.04em", marginBottom: 8 }}>{fmtShort(ev.starts_at)}</p>
        <button onClick={onToggle} style={{
          width: "100%", padding: "7px 0",
          background: joined ? "rgba(0,0,0,0.06)" : PINK,
          color: joined ? "rgba(0,0,0,0.5)" : "white",
          border: "none", borderRadius: 6,
          fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, letterSpacing: "0.08em",
          cursor: "pointer",
        }}>
          {joined ? "JOINED ✓" : "GRAB A SEAT"}
        </button>
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
      <img src={img} alt={ev.title} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.75 }}/>
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
            {joined ? "JOINED ✓" : "JOIN →"}
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
        <img src={ev.image_url} alt={ev.title} style={{ width: "100%", height: 80, objectFit: "cover", borderRadius: 6, marginBottom: 8 }}/>
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
        {joined ? "JOINED ✓" : "JOIN →"}
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
      <img src={img} alt={title} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}/>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0) 35%, rgba(0,0,0,0.82) 100%)" }}/>
      <div style={{ position: "absolute", bottom: 10, left: 10, right: 10 }}>
        <p style={{ fontFamily: "var(--font-playfair)", fontSize: 13, fontWeight: 900, fontStyle: "italic", color: "white", lineHeight: 1.2, textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}>{title}</p>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", color: "rgba(255,255,255,0.6)", letterSpacing: "0.05em", marginTop: 2 }}>{sub}</p>
      </div>
    </div>
  );
}

/* ── Event templates strip (real events) ────────────────── */
function EventTemplatesStrip({ events }: { events: Event[] }) {
  if (events.length === 0) return null;
  return (
    <div>
      <div style={{ padding: "0 14px 10px", display: "flex", alignItems: "center", gap: 6 }}>
        <div style={{ width: 5, height: 5, borderRadius: "50%", background: PINK }} />
        <span style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, letterSpacing: "0.18em", color: "rgba(255,255,255,0.6)" }}>YOUR EVENTS</span>
      </div>
      <div style={{ display: "flex", gap: 12, overflowX: "auto", padding: "0 14px 16px", scrollbarWidth: "none" as const }}>
        {events.map(ev => (
          <EventCard key={ev.id} ev={toCardData(ev)} />
        ))}
      </div>
    </div>
  );
}

/* ── Static collage (no events yet) ─────────────────────── */
function StaticCollage() {
  const DEMO_EVENTS: EventCardData[] = [
    { id: "d1", type: "concert",    title: "Vinyl Night & Jazz",      host: "Girl Creatives", location: "Bushwick",     date: "SAT JUN 14", time: "9 PM",    spotsLeft: 12, accentColor: "#1C1B1C" },
    { id: "d2", type: "party",      title: "Girls Night Out",          host: "BloomBay",       location: "SoHo",         date: "FRI JUN 13", time: "10 PM",   spotsLeft: 6,  accentColor: PINK },
    { id: "d3", type: "gathering",  title: "Italian Dinner Society",   host: "Yande",          location: "Carbone",      date: "THU JUN 19", time: "7:30 PM", going: 8 },
    { id: "d4", type: "invitation", title: "Pilates + Matcha",         host: "Sofia K.",       location: "Williamsburg", date: "SUN JUN 15", time: "9 AM",    spotsLeft: 3 },
    { id: "d7", type: "open_seats", title: "Sunday Supper",            host: "Natalie M.",     location: "West Village", date: "SUN JUN 15", time: "7 PM",    spotsLeft: 2, going: 6 },
    { id: "d8", type: "table",      title: "Private Dinner Party",     host: "House of Flora", location: "NoHo",         date: "SAT JUN 21", time: "8 PM",    spotsLeft: 4, accentColor: "#1A3A1A" },
    { id: "d5", type: "brunch",     title: "Sunday Brunch Club", host: "BloomBay",       location: "Ladurée SoHo", date: "SUN JUN 22", time: "11 AM", going: 14 },
    { id: "d6", type: "museum",     title: "MoMA + Froyo After", host: "Girl Creatives", location: "Midtown",  date: "SAT JUN 21", time: "2 PM", spotsLeft: 5 },
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
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.img} alt={item.title} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}/>
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

/* ── FAB ─────────────────────────────────────────────────── */
function CreateFAB() {
  return (
    <Link href="/member/happenings/create" style={{ textDecoration: "none" }}>
      <div style={{
        position: "fixed",
        bottom: 84,
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

/* ── Main ────────────────────────────────────────────────── */
export function HappeningsPage({ standalone = true }: { standalone?: boolean }) {
  const [tab,            setTab]           = useState<HapTab>("happenings");
  const [filter,         setFilter]        = useState<Filter>("All");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");
  const [filterOpen,     setFilterOpen]    = useState(false);
  const [showMap,    setShowMap]   = useState(false);
  const [events,     setEvents]    = useState<Event[]>([]);
  const [joined,     setJoined]    = useState<Set<string>>(new Set());
  const [loading,    setLoading]   = useState(true);
  const [, startTransition] = useTransition();

  useEffect(() => {
    async function load() {
      setLoading(true);
      const [evs, ids] = await Promise.all([getEvents(), getJoinedEventIds()]);
      setEvents(evs);
      setJoined(new Set(ids));
      setLoading(false);
    }
    load();
  }, []);

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

  const filtered = events.filter(ev => matchesFilter(ev, filter) && matchesCategoryFilter(ev, categoryFilter));

  const tickerItems = events.length > 0
    ? events.map(ev => `${ev.title.toUpperCase()} · ${ev.neighborhood ?? ev.city} · ${fmtTime(ev.starts_at)}`)
    : ["GIRLS NIGHT OUT ✦ ITALIAN DINNER SOCIETY ✦ ROOFTOP SESSIONS ✦ VINYL NIGHT ✦ SUNDAY BRUNCH CLUB ✦ FILM NIGHT ✦ DANCE ALL NIGHT"];

  return (
    <div style={{ background: getPageBg(), minHeight: standalone ? "100vh" : "auto", paddingBottom: 100 }}>
      <style>{CSS}</style>


      {/* ── Fixed top bar ── */}
      {standalone && <div style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 51,
        background: getNavBg(),
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.12)",
        height: 54,
        paddingTop: "env(safe-area-inset-top, 0px)",
        display: "flex", alignItems: "center",
      }}>
        {/* Left: BB+ · city · slab */}
        <div style={{ flex: 1, paddingLeft: 18, display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900, fontSize: 16, color: "white" }}>BB+</span>
          <span style={{ color: "rgba(255,255,255,0.2)", fontSize: 10 }}>·</span>
          <span style={{ fontFamily: "var(--font-jost)", fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.55)", letterSpacing: "0.08em" }}>NYC</span>
        </div>

        {/* Center: HAPPENINGS | CITY toggle */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div style={{ display: "inline-flex", background: "rgba(255,255,255,0.08)", borderRadius: 999, padding: "3px" }}>
            {(["happenings","city"] as HapTab[]).map(t => (
              <button key={t} onClick={() => setTab(t)} style={{
                padding: "5px 12px", borderRadius: 999, border: "none",
                background: tab === t ? "rgba(255,255,255,0.95)" : "transparent",
                color: tab === t ? PINK : "rgba(255,255,255,0.85)",
                fontFamily: "var(--font-jost)", fontSize: "10px", fontWeight: 800,
                letterSpacing: "0.10em", cursor: "pointer", transition: "all 0.18s",
                boxShadow: tab === t ? "0 2px 10px rgba(0,0,0,0.18)" : "none",
              }}>
                {t === "happenings" ? "HAPPENINGS" : "CITY"}
              </button>
            ))}
          </div>
        </div>

        {/* Right: same icons as global nav — Apt · Pin · Mail · Chat */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, paddingRight: 14 }}>
          <Link href="/member/you" aria-label="Apartment" style={{ display: "flex", padding: 4 }}>
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.75)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="2" y1="21" x2="22" y2="21"/>
              <path d="M8 21V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v15"/>
              <circle cx="14.5" cy="13" r="0.7" fill="rgba(255,255,255,0.75)" stroke="none"/>
            </svg>
          </Link>
          <Link href="/member/city" aria-label="City" style={{ display: "flex", padding: 4 }}>
            <svg width="19" height="19" viewBox="0 0 24 24" fill="rgba(255,255,255,0.75)" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="7.5" r="5" fill="rgba(255,255,255,0.75)"/>
              <line x1="12" y1="12.5" x2="12" y2="21" stroke="rgba(255,255,255,0.75)" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          </Link>
          <Link href="/member/messages" aria-label="Mailbox" style={{ position: "relative", display: "flex", padding: 4 }}>
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.75)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
            <div style={{ position: "absolute", top: 0, right: 0, width: 13, height: 13, borderRadius: "50%", background: PINK, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "7px", fontWeight: 900, color: "white", lineHeight: 1 }}>3</div>
          </Link>
          <Link href="/member/chat" aria-label="Chat" style={{ position: "relative", display: "flex", padding: 4 }}>
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.75)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            <span style={{ position: "absolute", top: 2, right: 2, width: 7, height: 7, borderRadius: "50%", background: "white" }}/>
          </Link>
        </div>
      </div>}

      {/* ── Page content ── */}
      <div style={{ paddingTop: standalone ? 54 : 0 }}>

        {/* ── HAPPENINGS TAB ── */}
        {(standalone ? tab === "happenings" : true) && (
          <>
            {/* Filter chips — always visible horizontal scroll */}
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

            {/* Interest category chips — compact secondary row */}
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

            {/* Collage: real events */}
            {!loading && filtered.length > 0 && (
              <EventTemplatesStrip events={filtered} />
            )}

            {/* Collage: static posters when no events */}
            {!loading && events.length === 0 && (
              <StaticCollage/>
            )}

            {/* No match for filter */}
            {!loading && events.length > 0 && filtered.length === 0 && (
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
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={item.img} alt={item.name} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}/>
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
          </>
        )}

        {/* ── CITY TAB (standalone only — embedded in CityPage when not standalone) ── */}
        {standalone && tab === "city" && (
          <div style={{ padding: "0 0 24px", minHeight: "calc(100vh - 54px)" }}>
            <div style={{ padding: "20px 20px 8px" }}>
              <p style={{ fontFamily: "var(--font-caveat)", fontSize: 13, color: PINK, marginBottom: 2 }}>New York City</p>
              <h1 style={{ fontFamily: "var(--font-playfair)", fontSize: 34, fontWeight: 900, fontStyle: "italic", color: "white", lineHeight: 1, letterSpacing: "-0.01em" }}>The City</h1>
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
      {showMap && (
        <div style={{
          position: "fixed", top: 54, left: 0, right: 0, bottom: 0,
          zIndex: 49,
          display: "flex", flexDirection: "column",
          overflow: "hidden",
        }}>
          {/* Header */}
          <div style={{
            padding: "16px 18px 14px",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            background: "rgba(255,255,255,0.7)",
            backdropFilter: "blur(16px)",
            borderBottom: "1px solid rgba(255,31,125,0.1)",
            flexShrink: 0,
          }}>
            <div>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 900, letterSpacing: "0.18em", color: PINK }}>EVENT MAP</p>
              <p style={{ fontFamily: "var(--font-caveat)", fontSize: 14, color: "rgba(0,0,0,0.4)", marginTop: 2 }}>happening near you</p>
            </div>
            <button onClick={() => setShowMap(false)} style={{
              width: 36, height: 36, borderRadius: "50%",
              background: PINK, border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: `0 3px 12px ${PINK}55`,
            }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>

          {/* Map body */}
          <div style={{ flex: 1, margin: "14px 16px 0", borderRadius: 24, overflow: "hidden", position: "relative" }}>
            {/* Base map gradient */}
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(160deg, #DEEDF8 0%, #C8DFF5 40%, #D5E8EE 100%)" }}/>
            {/* Street grid */}
            {[10, 25, 40, 55, 70, 85].map(pct => (
              <div key={`h${pct}`} style={{ position: "absolute", top: `${pct}%`, left: 0, right: 0, height: 1, background: "rgba(80,130,180,0.22)", zIndex: 1 }}/>
            ))}
            {[15, 30, 45, 60, 75, 90].map(pct => (
              <div key={`v${pct}`} style={{ position: "absolute", left: `${pct}%`, top: 0, bottom: 0, width: 1, background: "rgba(80,130,180,0.22)", zIndex: 1 }}/>
            ))}
            {/* Park blob */}
            <div style={{ position: "absolute", top: "6%", right: "8%", width: "24%", height: "32%", borderRadius: 14, background: "rgba(120,190,110,0.28)", border: "1px solid rgba(100,180,80,0.2)", zIndex: 1 }}/>
            {/* Water edge */}
            <div style={{ position: "absolute", top: 0, left: "-2%", width: "14%", height: "100%", background: "rgba(120,160,220,0.18)", borderRight: "1px solid rgba(100,140,200,0.2)", zIndex: 1 }}/>

            {/* Event pins */}
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
                <div style={{
                  background: pin.color, borderRadius: 20,
                  padding: "4px 10px 4px 8px",
                  display: "flex", alignItems: "center", gap: 5,
                  boxShadow: `0 3px 12px ${pin.color}66`,
                  whiteSpace: "nowrap" as const,
                }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: "rgba(255,255,255,0.9)", animation: "livePulse 1.4s ease-in-out infinite", flexShrink: 0 }}/>
                  <span style={{ fontSize: "9px", fontWeight: 800, color: "white", fontFamily: "var(--font-jost)", letterSpacing: "0.03em" }}>{pin.label}</span>
                  <span style={{ fontSize: "8px", color: "rgba(255,255,255,0.75)", fontFamily: "var(--font-jost)", fontWeight: 700 }}>{pin.going}</span>
                </div>
                <div style={{ width: 0, height: 0, borderLeft: "5px solid transparent", borderRight: "5px solid transparent", borderTop: `7px solid ${pin.color}`, margin: "0 auto" }}/>
              </div>
            ))}

            {/* Coming soon notice */}
            <div style={{
              position: "absolute", bottom: 14, left: 14, right: 14, zIndex: 4,
              background: "rgba(255,255,255,0.82)",
              backdropFilter: "blur(12px)",
              borderRadius: 14,
              padding: "12px 16px",
              border: "1px solid rgba(255,31,125,0.12)",
            }}>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: 10, fontWeight: 800, letterSpacing: "0.1em", color: PINK, marginBottom: 3 }}>🗺 LIVE MAP · COMING SOON</p>
              <p style={{ fontFamily: "var(--font-caveat)", fontSize: 13, color: "rgba(0,0,0,0.45)", lineHeight: 1.4 }}>Interactive map with real-time event locations near you.</p>
            </div>
          </div>

          {/* Event chips scroll */}
          <div style={{ padding: "12px 16px 20px", display: "flex", gap: 8, overflowX: "auto", scrollbarWidth: "none" as const, flexShrink: 0, background: "rgba(255,255,255,0.55)", backdropFilter: "blur(12px)" }}>
            {[
              { label: "Girls Night Out", time: "Tonight", color: "#FF1F7D" },
              { label: "Rooftop Sessions", time: "Sat 8PM", color: "#FF69B4" },
              { label: "Vinyl Night", time: "Sat 9PM", color: "#C084FC" },
              { label: "Brunch Club", time: "Sun 11AM", color: "#F97316" },
              { label: "Jazz Night", time: "Fri 9PM", color: "#FF1F7D" },
              { label: "Dance All Night", time: "Sat 11PM", color: "#C084FC" },
            ].map((chip, i) => (
              <div key={i} style={{
                flexShrink: 0, background: "white", borderRadius: 999,
                padding: "8px 14px",
                border: `1.5px solid ${chip.color}33`,
                boxShadow: `0 2px 10px ${chip.color}22`,
              }}>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "10px", fontWeight: 800, color: chip.color }}>{chip.label}</p>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", color: "rgba(0,0,0,0.4)", marginTop: 1 }}>{chip.time}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FAB */}
      {tab === "happenings" && !showMap && <CreateFAB/>}
    </div>
  );
}
