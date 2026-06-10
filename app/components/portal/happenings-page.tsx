"use client";

import { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import { getEvents, getJoinedEventIds, joinEvent, leaveEvent, type Event } from "@/lib/actions/events";

const PINK   = "#FF1F7D";
const DARK   = "#0F0E0F";
const CREAM  = "#FAF6F0";
const GOLD   = "#D4A853";
const NAV_BG = "#FAF7F2";

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

const AV_COLORS = ["#FF1F7D","#FF69B4","#C084FC","#F97316","#06B6D4","#84CC16","#FBBF24"];

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
`;

type HapTab = "happenings" | "city";
type Filter = "All" | "Tonight" | "This Weekend" | "Invitations" | "Open Seats" | "Gatherings" | "Club Events" | "Parties" | "Dinners";

const FILTERS: Filter[] = ["All", "Tonight", "This Weekend", "Invitations", "Open Seats", "Gatherings", "Club Events", "Parties", "Dinners"];

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
        ? "linear-gradient(90deg, #1f1f1f 25%, #2a2a2a 50%, #1f1f1f 75%)"
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
    bg: DARK,
    color: PINK,
    border: `1px solid ${PINK}55`,
    glow: `0 0 20px ${PINK}44`,
    font: "var(--font-jost)",
    weight: 900,
    size: 11,
    spacing: "0.14em",
    sub: "Tonight",
    subColor: `${PINK}99`,
  },
  {
    label: "Dinners",
    emoji: "🕯",
    bg: "#1A0E0A",
    color: GOLD,
    border: `1px solid ${GOLD}44`,
    glow: `0 0 20px ${GOLD}33`,
    font: "var(--font-playfair)",
    weight: 900,
    size: 13,
    spacing: "0.01em",
    sub: "& Brunches",
    subColor: `${GOLD}77`,
  },
  {
    label: "Gatherings",
    emoji: "☀",
    bg: "#1C0E00",
    color: "#F59E0B",
    border: "1px solid rgba(245,158,11,0.3)",
    glow: "0 0 20px rgba(245,158,11,0.2)",
    font: "var(--font-caveat)",
    weight: 700,
    size: 15,
    spacing: "0em",
    sub: "casual & fun",
    subColor: "rgba(245,158,11,0.6)",
  },
  {
    label: "Club Events",
    emoji: "◆",
    bg: "#0A0A12",
    color: "#C4B5FD",
    border: "1px solid rgba(196,181,253,0.25)",
    glow: "0 0 20px rgba(196,181,253,0.15)",
    font: "var(--font-jost)",
    weight: 800,
    size: 10,
    spacing: "0.12em",
    sub: "Members only",
    subColor: "rgba(196,181,253,0.5)",
  },
  {
    label: "Invitations",
    emoji: "💌",
    bg: "#1A0812",
    color: "#FDA4C7",
    border: `1px solid ${PINK}33`,
    glow: `0 0 20px ${PINK}22`,
    font: "var(--font-instrument)",
    weight: 400,
    size: 14,
    spacing: "0em",
    sub: "You're invited",
    subColor: "#FDA4C7AA",
  },
  {
    label: "Open Seats",
    emoji: "🪑",
    bg: "#001820",
    color: "#38BDF8",
    border: "1px solid rgba(56,189,248,0.3)",
    glow: "0 0 20px rgba(56,189,248,0.15)",
    font: "var(--font-jost)",
    weight: 800,
    size: 10,
    spacing: "0.1em",
    sub: "Last spots",
    subColor: "rgba(56,189,248,0.55)",
  },
  {
    label: "Events",
    emoji: "🎭",
    bg: "#100818",
    color: "#E879F9",
    border: "1px solid rgba(232,121,249,0.3)",
    glow: "0 0 20px rgba(232,121,249,0.15)",
    font: "var(--font-jost)",
    weight: 800,
    size: 10,
    spacing: "0.1em",
    sub: "Experiences",
    subColor: "rgba(232,121,249,0.55)",
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
              fontStyle: tc.font === "var(--font-instrument)" ? "italic" : "normal",
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
function PosterCard({ ev, posterIdx, joined, onToggle }: {
  ev: Event; posterIdx: number; joined: boolean; onToggle: () => void;
}) {
  const badge  = getBadge(ev);
  const poster = ev.image_url ?? POSTER_IMGS[posterIdx % POSTER_IMGS.length];

  return (
    <div style={{
      gridColumn: "span 2",
      borderRadius: 16,
      overflow: "hidden",
      position: "relative",
      height: 280,
      boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
    }}>
      <img src={poster} alt={ev.title} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}/>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0.72) 70%, rgba(0,0,0,0.88) 100%)" }}/>

      {/* Top badges */}
      <div style={{ position: "absolute", top: 12, left: 12, display: "flex", gap: 6 }}>
        {badge && (
          <div style={{ display: "flex", alignItems: "center", gap: 5, background: "rgba(0,0,0,0.55)", borderRadius: 999, padding: "4px 10px", backdropFilter: "blur(8px)" }}>
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

      {/* Bottom */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "14px 14px 14px" }}>
        <p style={{ fontFamily: "var(--font-playfair)", fontSize: 24, fontWeight: 900, fontStyle: "italic", color: "white", lineHeight: 1.1, marginBottom: 3, textShadow: "0 2px 12px rgba(0,0,0,0.6)" }}>
          {ev.title}
        </p>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", color: "rgba(255,255,255,0.65)", letterSpacing: "0.05em", marginBottom: 10 }}>
          {ev.venue ?? ""}{ev.neighborhood ? ` · ${ev.neighborhood}` : ""}
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ display: "flex" }}>
            {AV_COLORS.slice(0, 4).map((c, i) => (
              <div key={i} style={{ width: 20, height: 20, borderRadius: "50%", background: c, border: "2px solid rgba(255,255,255,0.5)", marginLeft: i > 0 ? -6 : 0 }}/>
            ))}
          </div>
          <span style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 700, color: "rgba(255,255,255,0.75)" }}>{ev.attending_count ?? 0} going</span>
          <span style={{ flex: 1 }}/>
          <span style={{ fontFamily: "var(--font-jost)", fontSize: "7.5px", color: "rgba(255,255,255,0.45)" }}>{fmtShort(ev.starts_at)}</span>
          <button onClick={onToggle} style={{
            background: joined ? "rgba(255,255,255,0.15)" : PINK,
            color: "white", border: joined ? "1.5px solid rgba(255,255,255,0.4)" : "none",
            borderRadius: 999, padding: "8px 18px",
            fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 800, letterSpacing: "0.07em",
            cursor: "pointer", backdropFilter: joined ? "blur(6px)" : "none",
            boxShadow: joined ? "none" : `0 4px 16px ${PINK}55`,
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
      background: CREAM,
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

      {/* Gold corner accent */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(to right, ${GOLD}, transparent)` }}/>

      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "12px" }}>
        {badge && (
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "6.5px", fontWeight: 800, letterSpacing: "0.18em", color: GOLD, marginBottom: 4 }}>{badge} ◆</p>
        )}
        <p style={{ fontFamily: "var(--font-playfair)", fontSize: 14, fontWeight: 900, fontStyle: "italic", color: "white", lineHeight: 1.2, marginBottom: 6 }}>{ev.title}</p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontFamily: "var(--font-jost)", fontSize: "7px", color: "rgba(255,255,255,0.45)", letterSpacing: "0.04em" }}>{ev.neighborhood ?? ev.city}</span>
          <button onClick={onToggle} style={{
            background: "transparent", border: `1px solid ${GOLD}77`,
            color: GOLD, borderRadius: 6, padding: "5px 12px",
            fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.08em",
            cursor: "pointer",
          }}>
            {joined ? "JOINED" : "JOIN ◆"}
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
      background: "#FFFCF4",
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
function StaticPosterCard({ img, title, sub, wide }: { img: string; title: string; sub: string; wide?: boolean }) {
  return (
    <div style={{
      gridColumn: wide ? "span 2" : undefined,
      borderRadius: 16,
      overflow: "hidden",
      position: "relative",
      height: wide ? 240 : 195,
      boxShadow: "0 6px 24px rgba(0,0,0,0.45)",
    }}>
      <img src={img} alt={title} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}/>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0) 40%, rgba(0,0,0,0.8) 100%)" }}/>
      <div style={{ position: "absolute", bottom: 12, left: 12, right: 12 }}>
        <p style={{ fontFamily: "var(--font-playfair)", fontSize: wide ? 20 : 14, fontWeight: 900, fontStyle: "italic", color: "white", lineHeight: 1.2, textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}>{title}</p>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", color: "rgba(255,255,255,0.6)", letterSpacing: "0.05em", marginTop: 3 }}>{sub}</p>
      </div>
    </div>
  );
}

/* ── Collage section (real events) ───────────────────────── */
function CollageGrid({ events, joined, toggleJoin }: { events: Event[]; joined: Set<string>; toggleJoin: (id: string) => void }) {
  let posterCount = 0;
  let ticketCount = 0;
  let clubCount   = 0;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, padding: "0 12px" }}>
      {events.map((ev, i) => {
        const mod = i % 7;
        if (mod === 0) {
          const pi = posterCount++;
          return (
            <PosterCard key={ev.id} ev={ev} posterIdx={pi} joined={joined.has(ev.id)} onToggle={() => toggleJoin(ev.id)}/>
          );
        } else if (mod === 1 || mod === 4) {
          const ti = ticketCount++;
          return (
            <TicketCard key={ev.id} ev={ev} ticketIdx={ti} joined={joined.has(ev.id)} onToggle={() => toggleJoin(ev.id)}/>
          );
        } else if (mod === 2 || mod === 5) {
          return (
            <PaperCard key={ev.id} ev={ev} joined={joined.has(ev.id)} onToggle={() => toggleJoin(ev.id)}/>
          );
        } else {
          const ci = clubCount++;
          return (
            <ClubCard key={ev.id} ev={ev} clubIdx={ci} joined={joined.has(ev.id)} onToggle={() => toggleJoin(ev.id)}/>
          );
        }
      })}
    </div>
  );
}

/* ── Static collage (no events yet) ─────────────────────── */
function StaticCollage() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, padding: "0 12px" }}>
      <StaticPosterCard img={POSTER_IMGS[0]} title="Girls Night Out" sub="This weekend · SoHo" wide/>
      <StaticPosterCard img={POSTER_IMGS[3]} title="Italian Dinner Society" sub="Fri · Carbone · 7PM"/>
      <StaticPosterCard img={POSTER_IMGS[6]} title="Sunday Brunch Club" sub="Sun · 11AM · Ladurée"/>
      <StaticPosterCard img={POSTER_IMGS[2]} title="Vinyl Night & Jazz" sub="Sat · 9PM · Bushwick"/>
      <StaticPosterCard img={POSTER_IMGS[7]} title="Rooftop Sessions" sub="Fri · 8PM · Williamsburg" wide/>
      <StaticPosterCard img={POSTER_IMGS[4]} title="Film Club" sub="Sun · 3PM · Lower East Side"/>
      <StaticPosterCard img={POSTER_IMGS[5]} title="Dance All Night" sub="Sat · Midnight · DUMBO"/>
      <StaticPosterCard img={POSTER_IMGS[8]} title="Bagels & Books" sub="Sun · 10AM · Prospect Park"/>
      <StaticPosterCard img={POSTER_IMGS[1]} title="Save the Date: Aperitivo" sub="Next Fri · Harlem" wide/>
      <StaticPosterCard img={POSTER_IMGS[9]} title="Ladies First Road Trip" sub="Weekend Getaway"/>
    </div>
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
export function HappeningsPage() {
  const [tab,        setTab]       = useState<HapTab>("happenings");
  const [filter,     setFilter]    = useState<Filter>("All");
  const [filterOpen, setFilterOpen] = useState(false);
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

  const filtered = events.filter(ev => matchesFilter(ev, filter));

  const tickerItems = events.length > 0
    ? events.map(ev => `${ev.title.toUpperCase()} · ${ev.neighborhood ?? ev.city} · ${fmtTime(ev.starts_at)}`)
    : ["GIRLS NIGHT OUT ✦ ITALIAN DINNER SOCIETY ✦ ROOFTOP SESSIONS ✦ VINYL NIGHT ✦ SUNDAY BRUNCH CLUB ✦ FILM NIGHT ✦ DANCE ALL NIGHT"];

  return (
    <div style={{ background: DARK, minHeight: "100vh", paddingBottom: 100 }}>
      <style>{CSS}</style>

      {/* ── Fixed top bar ── */}
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 51,
        background: DARK,
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        boxShadow: "0 2px 20px rgba(0,0,0,0.4)",
        height: 54,
        paddingTop: "env(safe-area-inset-top, 0px)",
        display: "flex", alignItems: "center",
      }}>
        {/* Left: BB logo */}
        <div style={{ width: 64, display: "flex", alignItems: "center", paddingLeft: 18 }}>
          <Link href="/member/home" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "3px" }}>
            <span style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900, fontSize: "20px", color: PINK, letterSpacing: "-0.02em" }}>BB</span>
            <span style={{ color: PINK, fontSize: "12px", opacity: 0.6 }}>✿</span>
          </Link>
        </div>

        {/* Center: toggle */}
        <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
          <div style={{ display: "inline-flex", background: "rgba(255,255,255,0.07)", borderRadius: 999, padding: "3px" }}>
            {(["happenings","city"] as HapTab[]).map(t => (
              <button key={t} onClick={() => setTab(t)} style={{
                padding: "6px 14px", borderRadius: 999, border: "none",
                background: tab === t ? PINK : "transparent",
                color: tab === t ? "white" : "rgba(255,255,255,0.35)",
                fontFamily: "var(--font-jost)", fontSize: "13px", fontWeight: 800,
                letterSpacing: "0.10em", cursor: "pointer", transition: "all 0.18s",
                boxShadow: tab === t ? `0 2px 10px ${PINK}55` : "none",
              }}>
                {t === "happenings" ? "HAPPENINGS" : "THE CITY"}
              </button>
            ))}
          </div>
        </div>

        {/* Right icons */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, paddingRight: 16 }}>
          <Link href="/member/messages" aria-label="Mailbox" style={{ position: "relative", display: "flex" }}>
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
            <div style={{ position: "absolute", top: "-4px", right: "-5px", width: 14, height: 14, borderRadius: "50%", background: PINK, border: `1.5px solid ${DARK}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "7px", fontWeight: 900, color: "white", lineHeight: 1 }}>3</div>
          </Link>
          <Link href="/member/notifications" aria-label="Notifications" style={{ position: "relative", display: "flex" }}>
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="7" r="4"/>
              <line x1="8" y1="11" x2="16" y2="11"/>
              <line x1="12" y1="11" x2="12" y2="20"/>
            </svg>
            <span style={{ position: "absolute", top: "-1px", right: "-1px", width: 7, height: 7, borderRadius: "50%", background: PINK, border: `1.5px solid ${DARK}` }}/>
          </Link>
          <Link href="/member/chat" aria-label="Chats" style={{ display: "flex" }}>
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
            </svg>
          </Link>
          <Link href="/member/lounge" aria-label="My Apt" style={{ display: "flex" }}>
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 22V8l9-6 9 6v14"/>
              <path d="M9 22V12h6v10"/>
              <rect x="10" y="14" width="4" height="4" rx="0.5"/>
            </svg>
          </Link>
        </div>
      </div>

      {/* ── Page content ── */}
      <div style={{ paddingTop: 54 }}>

        {/* ── HAPPENINGS TAB ── */}
        {tab === "happenings" && (
          <>
            {/* Type carousel */}
            <TypeCarousel onSelect={label => setFilter(label as Filter)}/>

            {/* Filter trigger bar + collapsible pills */}
            <div style={{ padding: "4px 14px 8px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 700, color: filter === "All" ? "rgba(255,255,255,0.3)" : PINK, letterSpacing: "0.08em" }}>
                {filter === "All" ? "ALL HAPPENINGS" : filter.toUpperCase()} {filter !== "All" && "✦"}
              </span>
              <button onClick={() => setFilterOpen(o => !o)} style={{
                background: filterOpen ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 6, padding: "5px 10px", cursor: "pointer",
                display: "flex", alignItems: "center", gap: 5,
                fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 700,
                color: "rgba(255,255,255,0.4)", letterSpacing: "0.08em",
              }}>
                {filterOpen ? "CLOSE ✕" : "FILTER ≡"}
              </button>
            </div>
            {filterOpen && (
              <div
                className="filter-scroll"
                style={{
                  display: "flex", gap: 7, overflowX: "auto",
                  padding: "0 14px 12px",
                  scrollbarWidth: "none",
                }}
              >
                {FILTERS.map(f => (
                  <button key={f} onClick={() => setFilter(f)} style={{
                    flexShrink: 0, padding: "6px 14px", borderRadius: 999,
                    border: `1px solid ${filter === f ? PINK : "rgba(255,255,255,0.12)"}`,
                    background: filter === f ? PINK : "rgba(255,255,255,0.05)",
                    color: filter === f ? "white" : "rgba(255,255,255,0.4)",
                    fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 700,
                    letterSpacing: "0.04em", cursor: "pointer",
                    boxShadow: filter === f ? `0 2px 10px ${PINK}44` : "none",
                  }}>
                    {f}
                  </button>
                ))}
              </div>
            )}

            {/* Ticker */}
            <div style={{ overflow: "hidden", borderTop: `1px solid rgba(255,255,255,0.05)`, borderBottom: `1px solid rgba(255,255,255,0.05)`, background: `${PINK}0d`, padding: "7px 0", marginBottom: 12 }}>
              <div style={{ display: "flex", animation: "ticker 28s linear infinite", width: "max-content" }}>
                {[...tickerItems, ...tickerItems].map((item, i) => (
                  <span key={i} style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 700, letterSpacing: "0.14em", color: PINK, whiteSpace: "nowrap", padding: "0 24px" }}>
                    {item} ✦
                  </span>
                ))}
              </div>
            </div>

            {/* Count label */}
            <div style={{ padding: "0 14px 10px", display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 5, height: 5, borderRadius: "50%", background: PINK, animation: "livePulse 1.4s ease-in-out infinite" }}/>
              <span style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, letterSpacing: "0.18em", color: "rgba(255,255,255,0.3)" }}>
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
              <CollageGrid events={filtered} joined={joined} toggleJoin={toggleJoin}/>
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
                  <span style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, letterSpacing: "0.18em", color: "rgba(255,255,255,0.25)" }}>FROM YOUR CITY</span>
                </div>
                <div style={{ display: "flex", gap: 10, overflowX: "auto", padding: "0 14px 12px", scrollbarWidth: "none" as const }}>
                  {[
                    { name: "Sunset Walk", sub: "Brooklyn Bridge · SUN 1PM", img: POSTER_IMGS[9], going: 7 },
                    { name: "Natural Wine", sub: "West Village · TONIGHT", img: POSTER_IMGS[1], going: 6 },
                    { name: "Rooftop Girls", sub: "SAT 8PM", img: POSTER_IMGS[7], going: 12 },
                    { name: "Dance All Night", sub: "SAT · 11PM", img: POSTER_IMGS[5], going: 10 },
                  ].map((item, i) => (
                    <div key={i} style={{ flexShrink: 0, width: 130, borderRadius: 10, overflow: "hidden", position: "relative", height: 100, boxShadow: "0 4px 16px rgba(0,0,0,0.4)" }}>
                      <img src={item.img} alt={item.name} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}/>
                      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0) 30%, rgba(0,0,0,0.85) 100%)" }}/>
                      <div style={{ position: "absolute", bottom: 8, left: 8, right: 8 }}>
                        <p style={{ fontFamily: "var(--font-playfair)", fontSize: 11, fontWeight: 900, fontStyle: "italic", color: "white", lineHeight: 1.1, textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}>{item.name}</p>
                        <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", color: "rgba(255,255,255,0.55)", marginTop: 2 }}>{item.going} going · {item.sub}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* ── CITY TAB ── */}
        {tab === "city" && (
          <div style={{ padding: "0 0 24px", minHeight: "calc(100vh - 54px)", background: "linear-gradient(180deg, #D6E8F5 0%, #EAF2F9 35%, #F0EBE4 100%)" }}>
            <div style={{ padding: "20px 20px 8px" }}>
              <p style={{ fontFamily: "var(--font-caveat)", fontSize: 13, color: PINK, marginBottom: 2 }}>New York City</p>
              <h1 style={{ fontFamily: "var(--font-playfair)", fontSize: 34, fontWeight: 900, fontStyle: "italic", color: "#1A1A1A", lineHeight: 1, letterSpacing: "-0.01em" }}>The City</h1>
              <p style={{ fontFamily: "var(--font-caveat)", fontSize: 14, color: "#888", marginTop: 4 }}>tap a neighborhood to explore</p>
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
                <p style={{ fontFamily: "var(--font-instrument)", fontSize: 13, fontStyle: "italic", color: "#666", lineHeight: 1.5, marginBottom: 12 }}>
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

      {/* FAB */}
      {tab === "happenings" && <CreateFAB/>}
    </div>
  );
}
