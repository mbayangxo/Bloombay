"use client";

/**
 * Event card templates — each event type gets its own physical-world design:
 *   concert    → printed ticket stub with perforation + barcode
 *   party      → screen-printed poster with bold typography
 *   gathering  → clean sophisticated card (default)
 *   invitation → envelope/celebration card (links to ConfettiPage)
 */

import Link from "next/link";
import Image from "next/image";

const PINK = "#FF1F7D";
const DARK = "#1C1B1C";

export type EventType = "concert" | "party" | "gathering" | "invitation" | "brunch" | "walk" | "museum" | "open_seats" | "table" | "food" | "popup" | "bakery" | "drinks" | "supper" | "paint";

export interface EventCardData {
  id: number | string;
  type: EventType;
  title: string;
  host?: string;
  location: string;
  date: string;          // e.g. "MAY 26"
  time: string;          // e.g. "8:00 PM"
  spotsLeft?: number;
  going?: number;
  accentColor?: string;
  imageUrl?: string;
  href?: string;
  invitationStyle?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// TICKET CARD  (concerts, shows)
// Looks like a real printed ticket — left stub, perforation, right body
// ─────────────────────────────────────────────────────────────────────────────
export function TicketCard({ ev }: { ev: EventCardData }) {
  const accent = ev.accentColor ?? "#1C1B1C";
  const href = ev.href ?? "#";

  return (
    <Link href={href} style={{ textDecoration: "none", display: "block", flexShrink: 0 }}>
      <div style={{
        width: 300, height: 110,
        display: "flex",
        borderRadius: 10,
        overflow: "hidden",
        boxShadow: "0 6px 24px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.1)",
        position: "relative",
      }}>

        {/* ── LEFT STUB ── */}
        <div style={{
          width: 76, flexShrink: 0,
          background: accent,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          padding: "10px 8px",
          position: "relative",
        }}>
          {/* Notches top/bottom for perforation illusion */}
          <div style={{ position: "absolute", top: -8, left: "50%", transform: "translateX(-50%)", width: 16, height: 16, borderRadius: "50%", background: "#F6F1EB" }} />
          <div style={{ position: "absolute", bottom: -8, left: "50%", transform: "translateX(-50%)", width: 16, height: 16, borderRadius: "50%", background: "#F6F1EB" }} />

          {/* Date */}
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 700, color: "rgba(255,255,255,0.6)", letterSpacing: "0.12em", textTransform: "uppercase" as const }}>
            {ev.date.split(" ")[0]}
          </p>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "28px", fontWeight: 900, color: "white", lineHeight: 1 }}>
            {ev.date.split(" ")[1] ?? ev.date}
          </p>
          {/* Music note */}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round" style={{ marginTop: 4 }}>
            <path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/>
          </svg>
        </div>

        {/* ── PERFORATION EDGE ── */}
        <div style={{
          width: 10, flexShrink: 0,
          background: `repeating-linear-gradient(to bottom, ${accent} 0px, ${accent} 6px, #F6F1EB 6px, #F6F1EB 10px)`,
          opacity: 0.25,
        }} />

        {/* ── MAIN BODY ── */}
        <div style={{
          flex: 1, background: "white",
          padding: "12px 14px",
          display: "flex", flexDirection: "column", justifyContent: "space-between",
          borderLeft: `3px solid ${accent}22`,
        }}>
          <div>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "7.5px", fontWeight: 800, letterSpacing: "0.18em", color: "rgba(0,0,0,0.3)", marginBottom: 4 }}>
              🎵 CONCERT · {ev.location.toUpperCase()}
            </p>
            <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900, fontSize: 17, color: DARK, lineHeight: 1.1 }}>
              {ev.title}
            </p>
            {ev.host && (
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "10px", color: "rgba(0,0,0,0.4)", marginTop: 2 }}>{ev.host}</p>
            )}
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", gap: 10 }}>
              <div>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 700, letterSpacing: "0.1em", color: "rgba(0,0,0,0.3)" }}>TIME</p>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "11px", fontWeight: 800, color: DARK }}>{ev.time}</p>
              </div>
              {ev.spotsLeft !== undefined && (
                <div>
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 700, letterSpacing: "0.1em", color: "rgba(0,0,0,0.3)" }}>SEATS</p>
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: "11px", fontWeight: 800, color: accent }}>{ev.spotsLeft} left</p>
                </div>
              )}
            </div>
            {/* Mini barcode */}
            <div style={{ display: "flex", gap: 1, alignItems: "flex-end", height: 28, opacity: 0.3 }}>
              {[3,5,2,6,3,4,5,2,3,4,6,2,4,5].map((h, i) => (
                <div key={i} style={{ width: 2, height: h * 3, background: DARK, borderRadius: 1 }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// POSTER CARD  (parties)
// Looks like a screen-printed event poster — bold type, layered design
// ─────────────────────────────────────────────────────────────────────────────
export function PosterCard({ ev }: { ev: EventCardData }) {
  const accent = ev.accentColor ?? PINK;
  const href = ev.href ?? "#";

  return (
    <Link href={href} style={{ textDecoration: "none", display: "block", flexShrink: 0 }}>
      <div style={{
        width: 175, height: 240,
        background: DARK,
        borderRadius: 12,
        overflow: "hidden",
        position: "relative",
        boxShadow: "0 8px 28px rgba(0,0,0,0.28), 0 2px 8px rgba(0,0,0,0.15)",
      }}>

        {/* Screen-print texture overlay */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 0, opacity: 0.06,
          backgroundImage: "repeating-linear-gradient(0deg, rgba(255,255,255,0.8) 0px, rgba(255,255,255,0.8) 1px, transparent 1px, transparent 4px)",
        }} />

        {/* Color block — the "ink" top portion */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 130,
          background: `linear-gradient(145deg, ${accent} 0%, ${accent}CC 100%)`,
          zIndex: 1,
        }} />

        {/* Halftone dots overlay */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 130,
          backgroundImage: "radial-gradient(circle, rgba(0,0,0,0.22) 1.5px, transparent 1.5px)",
          backgroundSize: "8px 8px",
          zIndex: 2,
        }} />

        {/* "PRESENTS" micro tag */}
        <div style={{ position: "absolute", top: 10, left: 12, zIndex: 3 }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.22em", color: "rgba(255,255,255,0.55)" }}>
            ✦ BLOOMBAY PRESENTS
          </p>
        </div>

        {/* Main poster title — big bold */}
        <div style={{ position: "absolute", top: 28, left: 12, right: 12, zIndex: 3 }}>
          <p style={{
            fontFamily: "var(--font-jost)",
            fontWeight: 900,
            fontSize: ev.title.length > 14 ? 22 : 28,
            color: "white",
            lineHeight: 0.95,
            letterSpacing: "-0.02em",
            textTransform: "uppercase" as const,
            textShadow: `0 2px 0 rgba(0,0,0,0.3)`,
          }}>
            {ev.title}
          </p>
        </div>

        {/* Bottom info section */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          padding: "12px 12px 14px",
          zIndex: 3,
        }}>
          {/* Location */}
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, letterSpacing: "0.16em", color: "rgba(255,255,255,0.45)", marginBottom: 6 }}>
            📍 {ev.location.toUpperCase()}
          </p>

          {/* Date + time row */}
          <div style={{
            background: "rgba(255,255,255,0.1)",
            borderRadius: 8, padding: "7px 10px",
            display: "flex", justifyContent: "space-between", alignItems: "center",
            border: "1px solid rgba(255,255,255,0.12)",
            marginBottom: 8,
          }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "11px", fontWeight: 900, color: "white" }}>{ev.date}</p>
            <div style={{ width: 1, height: 14, background: "rgba(255,255,255,0.2)" }} />
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "11px", fontWeight: 900, color: "white" }}>{ev.time}</p>
          </div>

          {/* Spots left pill */}
          {ev.spotsLeft !== undefined && (
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ background: accent, borderRadius: 999, padding: "3px 10px" }}>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 900, color: "white" }}>
                  {ev.spotsLeft} SPOTS LEFT
                </p>
              </div>
              {ev.going !== undefined && (
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", color: "rgba(255,255,255,0.35)" }}>
                  {ev.going} going
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// GATHERING CARD  (brunches, walks, casual meetups — default)
// Clean, sophisticated, soft editorial card
// ─────────────────────────────────────────────────────────────────────────────
export function GatheringCard({ ev }: { ev: EventCardData }) {
  const accent = ev.accentColor ?? PINK;
  const href = ev.href ?? "#";

  return (
    <Link href={href} style={{ textDecoration: "none", display: "block", flexShrink: 0 }}>
      <div style={{
        width: 220,
        background: "white",
        borderRadius: 18,
        overflow: "hidden",
        boxShadow: "0 4px 20px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)",
        border: "1px solid rgba(0,0,0,0.06)",
      }}>
        {/* Accent strip */}
        <div style={{ height: 5, background: `linear-gradient(90deg, ${accent}, ${accent}88)` }} />

        <div style={{ padding: "14px 16px 16px" }}>
          {/* Type label */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <div style={{
              background: `${accent}12`,
              border: `1px solid ${accent}28`,
              borderRadius: 999, padding: "3px 10px",
              display: "inline-flex", alignItems: "center", gap: 4,
            }}>
              <span style={{ fontSize: 10 }}>
                {ev.type === "brunch" ? "🥂" : ev.type === "walk" ? "🌿" : ev.type === "museum" ? "🏛️" : "✦"}
              </span>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "7.5px", fontWeight: 800, letterSpacing: "0.12em", color: accent }}>
                {ev.type.toUpperCase()}
              </p>
            </div>
            {ev.spotsLeft !== undefined && (
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 700, color: "rgba(0,0,0,0.35)" }}>
                {ev.spotsLeft} seats
              </p>
            )}
          </div>

          {/* Title */}
          <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900, fontSize: 19, color: DARK, lineHeight: 1.15, marginBottom: 4 }}>
            {ev.title}
          </p>

          {/* Location */}
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "10px", color: "rgba(0,0,0,0.4)", marginBottom: 12 }}>
            📍 {ev.location}
          </p>

          {/* Date + time */}
          <div style={{ display: "flex", gap: 8 }}>
            <div style={{ flex: 1, background: "#F9F5F0", borderRadius: 10, padding: "8px 10px", display: "flex", alignItems: "center", gap: 6 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.35)" strokeWidth="2" strokeLinecap="round">
                <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "10px", fontWeight: 700, color: DARK }}>{ev.date}</p>
            </div>
            <div style={{ flex: 1, background: "#F9F5F0", borderRadius: 10, padding: "8px 10px", display: "flex", alignItems: "center", gap: 6 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.35)" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
              </svg>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "10px", fontWeight: 700, color: DARK }}>{ev.time}</p>
            </div>
          </div>

          {/* Going count */}
          {ev.going !== undefined && (
            <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ display: "flex" }}>
                {[0,1,2].map(i => (
                  <div key={i} style={{ width: 20, height: 20, borderRadius: "50%", background: `hsl(${330 + i * 25},80%,60%)`, border: "2px solid white", marginLeft: i > 0 ? -6 : 0 }} />
                ))}
              </div>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "9px", color: "rgba(0,0,0,0.38)" }}>
                {ev.going} going
              </p>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// INVITATION CARD  (celebrations, confetti-style)
// Looks like a mini envelope / fold-out card
// ─────────────────────────────────────────────────────────────────────────────
function DefaultEnvelopeCard({ ev }: { ev: EventCardData }) {
  const accent = ev.accentColor ?? PINK;
  const href = ev.href ?? "/member/happenings/confetti";

  return (
    <Link href={href} style={{ textDecoration: "none", display: "block", flexShrink: 0 }}>
      <div style={{
        width: 175, height: 210,
        position: "relative",
        borderRadius: 14,
        overflow: "visible",
      }}>
        {/* Envelope back */}
        <div style={{
          position: "absolute", inset: 0,
          background: accent,
          borderRadius: 14,
          boxShadow: "0 8px 28px rgba(255,31,125,0.3), 0 2px 8px rgba(0,0,0,0.12)",
        }}>
          {/* Envelope V-flap */}
          <svg style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "50%" }} viewBox="0 0 175 100" preserveAspectRatio="none">
            <path d={`M0 0 L87.5 72 L175 0 Z`} fill={`${accent}CC`}/>
            <path d={`M0 0 L87.5 72 L175 0`} stroke="rgba(255,255,255,0.18)" strokeWidth="1" fill="none"/>
          </svg>
          {/* Bottom V */}
          <svg style={{ position: "absolute", bottom: 0, left: 0, width: "100%", height: "50%" }} viewBox="0 0 175 100" preserveAspectRatio="none">
            <path d={`M0 100 L87.5 28 L175 100 Z`} fill="rgba(0,0,0,0.1)"/>
          </svg>
        </div>

        {/* Card "letter" poking out of envelope */}
        <div style={{
          position: "absolute", top: 14, left: 12, right: 12, bottom: 22,
          background: "white",
          borderRadius: 10,
          padding: "14px 14px 12px",
          boxShadow: "0 4px 18px rgba(0,0,0,0.15)",
          display: "flex", flexDirection: "column", justifyContent: "space-between",
        }}>
          {/* Confetti dots */}
          <div style={{ position: "absolute", top: 6, right: 8 }}>
            {["#FFB3D9","#A8E6FF","#FFF0A0"].map((c, i) => (
              <span key={i} style={{ display: "inline-block", width: 5, height: 5, borderRadius: "50%", background: c, marginLeft: 2 }} />
            ))}
          </div>

          <div>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.2em", color: accent, marginBottom: 6 }}>
              YOU ARE INVITED
            </p>
            <p style={{ fontFamily: "var(--font-caveat)", fontSize: 18, fontWeight: 700, color: DARK, lineHeight: 1.2, marginBottom: 4 }}>
              {ev.title}
            </p>
            {ev.host && (
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "9px", color: "rgba(0,0,0,0.4)" }}>hosted by {ev.host}</p>
            )}
          </div>

          <div>
            <div style={{ width: "100%", height: 1, background: "rgba(0,0,0,0.06)", margin: "8px 0" }} />
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 700, color: "rgba(0,0,0,0.45)" }}>
              {ev.date} · {ev.time}
            </p>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "9px", color: "rgba(0,0,0,0.35)", marginTop: 1 }}>
              📍 {ev.location}
            </p>
          </div>
        </div>

        {/* Wax seal over envelope bottom */}
        <div style={{
          position: "absolute", bottom: 6, left: "50%", transform: "translateX(-50%)",
          width: 32, height: 32, borderRadius: "50%",
          background: "linear-gradient(135deg, #FF1F7D, #c4005a)",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 3px 10px rgba(255,31,125,0.5)",
          zIndex: 2,
        }}>
          <span style={{ fontFamily: "var(--font-jost)", fontWeight: 900, fontSize: "8px", color: "white" }}>BB</span>
        </div>
      </div>
    </Link>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// OPEN SEATS CARD  (last-minute seats at a table / dinner event)
// Looks like a restaurant hostess hold card — dark, candlelit, urgent
// ─────────────────────────────────────────────────────────────────────────────
export function OpenSeatsCard({ ev }: { ev: EventCardData }) {
  const href = ev.href ?? "#";
  const seats = ev.spotsLeft ?? 2;

  return (
    <Link href={href} style={{ textDecoration: "none", display: "block", flexShrink: 0 }}>
      <div style={{
        width: 172, height: 218,
        borderRadius: 14,
        overflow: "hidden",
        position: "relative",
        background: "linear-gradient(160deg, #1A0808 0%, #2D0E0E 50%, #1A0808 100%)",
        boxShadow: "0 10px 32px rgba(0,0,0,0.55), 0 2px 8px rgba(200,60,20,0.3)",
      }}>
        {/* Candle glow ambient */}
        <div style={{ position: "absolute", bottom: 0, left: "35%", width: 120, height: 120, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,140,40,0.28) 0%, transparent 70%)", pointerEvents: "none" }}/>

        {/* Flame SVG */}
        <div style={{ position: "absolute", top: 14, right: 16 }}>
          <svg width="10" height="16" viewBox="0 0 10 16">
            <path d="M5 15 C1 12 0 8 2 5 C3 3 4 4.5 5 2 C6 4.5 7 3 8 5 C10 8 9 12 5 15Z" fill="url(#fl_g)"/>
            <defs>
              <radialGradient id="fl_g" cx="50%" cy="80%" r="55%">
                <stop offset="0%" stopColor="#FFFAC0"/>
                <stop offset="40%" stopColor="#FFB020"/>
                <stop offset="100%" stopColor="#FF5500" stopOpacity="0.6"/>
              </radialGradient>
            </defs>
          </svg>
        </div>

        {/* Seats badge */}
        <div style={{
          position: "absolute", top: 14, left: 14,
          background: "rgba(255,100,40,0.18)", border: "1px solid rgba(255,120,40,0.35)",
          borderRadius: 999, padding: "4px 10px",
        }}>
          <span style={{ fontFamily: "var(--font-jost)", fontSize: "7.5px", fontWeight: 900, color: "#FFA060", letterSpacing: "0.1em" }}>
            {seats} SEAT{seats !== 1 ? "S" : ""} LEFT
          </span>
        </div>

        {/* Divider line */}
        <div style={{ position: "absolute", top: 52, left: 14, right: 14, height: "0.5px", background: "linear-gradient(90deg, transparent, rgba(255,120,40,0.4), transparent)" }}/>

        {/* Content */}
        <div style={{ position: "absolute", top: 64, left: 14, right: 14 }}>
          {ev.host && (
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.18em", color: "rgba(255,160,80,0.7)", marginBottom: 6 }}>
              {ev.host.toUpperCase()}
            </p>
          )}
          <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900, fontSize: 18, color: "#FFF5EE", lineHeight: 1.15, marginBottom: 8 }}>
            {ev.title}
          </p>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "8.5px", color: "rgba(255,200,150,0.55)", marginBottom: 12 }}>
            📍 {ev.location}
          </p>

          {/* Date/time row */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 8, padding: "5px 9px" }}>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 800, color: "#FFA060" }}>{ev.date}</p>
            </div>
            <div style={{ width: 3, height: 3, borderRadius: "50%", background: "rgba(255,120,40,0.4)" }}/>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 700, color: "rgba(255,200,150,0.7)" }}>{ev.time}</p>
          </div>

          {/* Perforated bottom */}
          <div style={{ borderTop: "1px dashed rgba(255,120,40,0.25)", paddingTop: 10, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, letterSpacing: "0.12em", color: "#FFA060" }}>CLAIM SEAT →</p>
            {ev.going !== undefined && (
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "7.5px", color: "rgba(255,180,100,0.45)" }}>{ev.going} going</p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TABLE CARD  (private dinner, reserved table, supper club)
// Looks like a formal dinner place card / menu cover — cream, elegant
// ─────────────────────────────────────────────────────────────────────────────
export function TableCard({ ev }: { ev: EventCardData }) {
  const accent = ev.accentColor ?? "#1A2B1A";
  const href = ev.href ?? "#";

  return (
    <Link href={href} style={{ textDecoration: "none", display: "block", flexShrink: 0 }}>
      <div style={{
        width: 172, height: 218,
        borderRadius: 14,
        overflow: "hidden",
        position: "relative",
        background: "#FDFAF4",
        boxShadow: "0 10px 32px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.08)",
        border: "1px solid rgba(180,160,120,0.2)",
      }}>
        {/* Top color band */}
        <div style={{ height: 6, background: `linear-gradient(90deg, ${accent}, ${accent}BB, ${accent})` }}/>

        {/* Ornamental top rule */}
        <div style={{ margin: "10px 14px 0", display: "flex", alignItems: "center", gap: 5 }}>
          <div style={{ flex: 1, height: "0.5px", background: `${accent}40` }}/>
          <span style={{ fontSize: 8, color: `${accent}88` }}>✦</span>
          <div style={{ flex: 1, height: "0.5px", background: `${accent}40` }}/>
        </div>

        {/* Header */}
        <div style={{ padding: "8px 14px 0", textAlign: "center" }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "6.5px", fontWeight: 800, letterSpacing: "0.22em", color: `${accent}88`, marginBottom: 5 }}>
            DINNER TABLE
          </p>
          <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900, fontSize: 19, color: accent, lineHeight: 1.1, marginBottom: 2 }}>
            {ev.title}
          </p>
          {ev.host && (
            <p style={{ fontFamily: "var(--font-caveat)", fontSize: 12, color: `${accent}88`, marginBottom: 0 }}>hosted by {ev.host}</p>
          )}
        </div>

        {/* Middle rule */}
        <div style={{ margin: "9px 14px", display: "flex", alignItems: "center", gap: 5 }}>
          <div style={{ flex: 1, height: "0.5px", background: `${accent}25` }}/>
          <span style={{ fontSize: 6, color: `${accent}55` }}>◆</span>
          <div style={{ flex: 1, height: "0.5px", background: `${accent}25` }}/>
        </div>

        {/* Details */}
        <div style={{ padding: "0 14px" }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", color: `${accent}77`, marginBottom: 5 }}>📍 {ev.location}</p>

          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
            <div>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "6.5px", fontWeight: 800, letterSpacing: "0.1em", color: `${accent}55`, marginBottom: 2 }}>DATE</p>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "10px", fontWeight: 800, color: accent }}>{ev.date}</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "6.5px", fontWeight: 800, letterSpacing: "0.1em", color: `${accent}55`, marginBottom: 2 }}>TIME</p>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "10px", fontWeight: 800, color: accent }}>{ev.time}</p>
            </div>
          </div>

          {/* Seats row */}
          {ev.spotsLeft !== undefined && (
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
              {[0,1,2,3,4,5].map(i => (
                <div key={i} style={{ width: 14, height: 14, borderRadius: "50%", background: i < ev.spotsLeft! ? `${accent}22` : "transparent", border: `1px solid ${i < ev.spotsLeft! ? accent : `${accent}30`}` }}/>
              ))}
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", color: `${accent}66` }}>{ev.spotsLeft} left</p>
            </div>
          )}
        </div>

        {/* Bottom CTA strip */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}>
          <div style={{ margin: "0 14px", borderTop: `1px solid ${accent}20`, padding: "8px 0" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div style={{ flex: 1, height: "0.5px", background: `${accent}20` }}/>
              <span style={{ fontSize: 6, color: `${accent}55` }}>◆</span>
              <div style={{ flex: 1, height: "0.5px", background: `${accent}20` }}/>
            </div>
          </div>
          <div style={{ background: accent, padding: "9px 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "8.5px", fontWeight: 800, letterSpacing: "0.12em", color: "rgba(255,255,255,0.92)" }}>RESERVE A SEAT</p>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
          </div>
        </div>
      </div>
    </Link>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FOOD EDITORIAL CARD  (food partner events — Flourie Bakery editorial style)
// Cream bg, oversized ghost text, hero food image elevated with deep shadow
// ─────────────────────────────────────────────────────────────────────────────
export function FoodEditorialCard({ ev }: { ev: EventCardData }) {
  const href   = ev.href ?? "#";
  const accent = ev.accentColor ?? "#C8860A";

  return (
    <Link href={href} style={{ textDecoration: "none", display: "block", flexShrink: 0 }}>
      <div style={{
        width: 175, height: 260,
        borderRadius: 16, overflow: "hidden",
        position: "relative", background: "#F5F0E8",
        boxShadow: "0 10px 32px rgba(0,0,0,0.15), 0 2px 8px rgba(0,0,0,0.07)",
      }}>
        {/* Brand/host name — thin italic serif at top */}
        <div style={{ padding: "13px 14px 0", textAlign: "center" as const }}>
          <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 400, fontSize: 11, color: "rgba(0,0,0,0.45)", letterSpacing: "0.08em" }}>
            {ev.host ?? "BloomBay Partner"}
          </p>
        </div>

        {/* Oversized ghost text behind image — like BAKERY in Flourie */}
        <p style={{
          position: "absolute", top: 56, left: "50%", transform: "translateX(-50%)",
          fontFamily: "var(--font-jost)", fontWeight: 900, fontSize: 64, letterSpacing: "-0.05em",
          color: "rgba(0,0,0,0.048)", whiteSpace: "nowrap" as const,
          pointerEvents: "none", lineHeight: 1, zIndex: 0,
        }}>EATS</p>

        {/* Food hero image — elevated with deep shadow + slight tilt */}
        <div style={{
          position: "absolute", top: 42, left: "50%",
          transform: "translateX(-50%) rotate(-2deg)",
          width: 130, height: 130, zIndex: 2,
        }}>
          {ev.imageUrl ? (
            <div style={{ position: "relative", width: 130, height: 130, borderRadius: 10, overflow: "hidden", boxShadow: "0 14px 40px rgba(0,0,0,0.22), 0 4px 14px rgba(0,0,0,0.14), 0 2px 0 rgba(0,0,0,0.38)", filter: "contrast(1.04) saturate(1.08)" }}>
              <Image src={ev.imageUrl} alt={ev.title} fill unoptimized style={{ objectFit: "cover" }} />
            </div>
          ) : (
            <div style={{
              width: "100%", height: "100%", borderRadius: 10,
              background: `linear-gradient(145deg, ${accent}66, ${accent}33)`,
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 52,
              boxShadow: "0 14px 40px rgba(0,0,0,0.22), 0 4px 14px rgba(0,0,0,0.14)",
            }}>🍽️</div>
          )}
        </div>

        {/* Drip line — like chocolate drip in Flourie */}
        <div style={{
          position: "absolute", top: 170, left: "50%", transform: "translateX(-50%)",
          width: 1.5, height: 10, background: `linear-gradient(to bottom, ${accent}55, transparent)`, zIndex: 1,
        }}/>

        {/* Title + details */}
        <div style={{ position: "absolute", bottom: 42, left: 14, right: 14, textAlign: "center" as const, zIndex: 3 }}>
          <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 700, fontSize: 16, color: "#1A0E00", lineHeight: 1.2, marginBottom: 3 }}>
            {ev.title}
          </p>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 700, color: "rgba(0,0,0,0.3)", letterSpacing: "0.08em", marginBottom: 4 }}>
            {ev.location.toUpperCase()}
          </p>
          <p style={{ fontFamily: "var(--font-caveat)", fontSize: 12, color: "rgba(0,0,0,0.4)" }}>
            {ev.date} · {ev.time}
          </p>
        </div>

        {/* CTA strip */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, background: accent,
          padding: "10px 14px", display: "flex", alignItems: "center", justifyContent: "space-between", zIndex: 3,
        }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "8.5px", fontWeight: 800, letterSpacing: "0.12em", color: "rgba(255,255,255,0.95)" }}>RESERVE A SPOT</p>
          {ev.spotsLeft !== undefined && (
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", color: "rgba(255,255,255,0.65)" }}>{ev.spotsLeft} left</p>
          )}
        </div>
      </div>
    </Link>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FOOD POPUP CARD  (coffee shop / café partner — Oops Bistro / Boulangerie Blue style)
// Bold social-post style: rich solid bg, food photo, brand header, TAP CTA
// ─────────────────────────────────────────────────────────────────────────────
export function FoodPopupCard({ ev }: { ev: EventCardData }) {
  const href   = ev.href ?? "#";
  const accent = ev.accentColor ?? PINK;

  return (
    <Link href={href} style={{ textDecoration: "none", display: "block", flexShrink: 0 }}>
      <div style={{
        width: 172, height: 248, borderRadius: 14, overflow: "hidden",
        position: "relative", background: accent,
        boxShadow: "0 10px 32px rgba(0,0,0,0.25), 0 2px 8px rgba(0,0,0,0.14)",
      }}>
        {/* Dot halftone texture overlay */}
        <div style={{
          position: "absolute", inset: 0, opacity: 0.07,
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.9) 1px, transparent 1px)",
          backgroundSize: "5px 5px", pointerEvents: "none",
        }}/>

        {/* Brand header row */}
        <div style={{
          padding: "10px 12px 8px",
          display: "flex", alignItems: "center", gap: 7,
          borderBottom: "1px solid rgba(255,255,255,0.15)", position: "relative", zIndex: 1,
        }}>
          <div style={{ width: 20, height: 20, borderRadius: "50%", background: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.35)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontFamily: "var(--font-jost)", fontSize: "6.5px", fontWeight: 900, color: "white" }}>{(ev.host ?? "BB")[0]}</span>
          </div>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 700, color: "rgba(255,255,255,0.72)", letterSpacing: "0.05em" }}>
            {ev.host ?? "BloomBay Partner"}
          </p>
        </div>

        {/* Food photo */}
        <div style={{ height: 120, position: "relative", overflow: "hidden", zIndex: 1 }}>
          {ev.imageUrl ? (
            <Image src={ev.imageUrl} alt={ev.title} fill unoptimized style={{ objectFit: "cover" }} />
          ) : (
            <div style={{ width: "100%", height: "100%", background: "rgba(0,0,0,0.22)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 44 }}>☕</div>
          )}
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0) 45%, rgba(0,0,0,0.32) 100%)" }}/>
        </div>

        {/* Event text */}
        <div style={{ padding: "9px 12px 0", position: "relative", zIndex: 1 }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.18em", color: "rgba(255,255,255,0.5)", marginBottom: 3 }}>
            {ev.date} · {ev.time}
          </p>
          <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900, fontSize: 15, color: "white", lineHeight: 1.2, marginBottom: 2 }}>
            {ev.title}
          </p>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", color: "rgba(255,255,255,0.5)" }}>📍 {ev.location}</p>
          {ev.spotsLeft !== undefined && ev.spotsLeft <= 5 && (
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, color: "rgba(255,255,255,0.9)", marginTop: 3 }}>
              Only {ev.spotsLeft} spots!
            </p>
          )}
        </div>

        {/* TAP TO RESERVE — Fritulizza-inspired white pill */}
        <div style={{
          position: "absolute", bottom: 12, left: 12, right: 12,
          background: "white", borderRadius: 7, padding: "9px 0",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 4px 16px rgba(0,0,0,0.2)", zIndex: 2,
        }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 900, color: accent, letterSpacing: "0.12em" }}>
            TAP TO RESERVE
          </p>
        </div>
      </div>
    </Link>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// BAKERY RECEIPT CARD  (artisan bakery / PekoBakes receipt clipboard style)
// Receipt paper on clipboard, food background, wax seal, script brand name
// ─────────────────────────────────────────────────────────────────────────────
export function BakeryReceiptCard({ ev }: { ev: EventCardData }) {
  const href   = ev.href ?? "#";
  const accent = ev.accentColor ?? "#8B3A2A";

  return (
    <Link href={href} style={{ textDecoration: "none", display: "block", flexShrink: 0 }}>
      <div style={{
        width: 172, height: 248, borderRadius: 14, overflow: "hidden",
        position: "relative", boxShadow: "0 10px 32px rgba(0,0,0,0.22)",
      }}>
        {/* Food bg image or warm gradient */}
        {ev.imageUrl ? (
          <Image src={ev.imageUrl} alt="" fill unoptimized style={{ objectFit: "cover" }} />
        ) : (
          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(145deg, ${accent}88, ${accent}44, #C4862055)` }}/>
        )}
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.28)" }}/>

        {/* Clipboard metal clip at top */}
        <div style={{
          position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
          width: 34, height: 13, zIndex: 3,
          background: "linear-gradient(180deg, #d0d0d0 0%, #808080 55%, #b0b0b0 100%)",
          borderRadius: "0 0 4px 4px",
          boxShadow: "0 3px 8px rgba(0,0,0,0.38)",
        }}/>

        {/* Receipt paper */}
        <div style={{
          position: "absolute", top: 9, left: 14, right: 14, bottom: 12,
          background: "#FEFCF8", borderRadius: 6,
          padding: "16px 13px 12px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.22)",
          zIndex: 2, display: "flex", flexDirection: "column",
        }}>
          {/* Brand name in Caveat script */}
          <div style={{ textAlign: "center" as const, marginBottom: 5 }}>
            <p style={{ fontFamily: "var(--font-caveat)", fontWeight: 700, fontSize: 20, color: accent, lineHeight: 1 }}>
              {ev.host ?? "BloomBay"}
            </p>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", color: "rgba(0,0,0,0.38)", letterSpacing: "0.06em" }}>
              {ev.location}
            </p>
          </div>

          <div style={{ borderTop: "1px dashed rgba(0,0,0,0.14)", margin: "4px 0 8px" }}/>

          {/* Receipt details */}
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "6.5px", color: "rgba(0,0,0,0.35)", letterSpacing: "0.1em" }}>EVENT</p>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "6.5px", color: "rgba(0,0,0,0.35)", letterSpacing: "0.1em" }}>DATE</p>
            </div>
            <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 700, fontSize: 13, color: "#1A0A00", lineHeight: 1.25, marginBottom: 7 }}>
              {ev.title}
            </p>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 700, color: accent, marginBottom: 3 }}>
              {ev.date} · {ev.time}
            </p>
            {ev.spotsLeft !== undefined && (
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "7.5px", color: "rgba(0,0,0,0.42)" }}>
                {ev.spotsLeft} spots available
              </p>
            )}
          </div>

          <div style={{ borderTop: "1px dashed rgba(0,0,0,0.11)", margin: "5px 0" }}/>

          {/* Wax seal + JOIN CTA */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{
              width: 28, height: 28, borderRadius: "50%",
              background: `radial-gradient(circle at 38% 38%, ${accent}CC, ${accent})`,
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: `0 2px 8px ${accent}44`,
            }}>
              <span style={{ fontFamily: "var(--font-jost)", fontSize: "5.5px", fontWeight: 900, color: "rgba(255,255,255,0.85)", letterSpacing: "0.04em" }}>BB</span>
            </div>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 900, color: accent, letterSpacing: "0.1em" }}>
              JOIN NOW →
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// COCKTAIL CARD  (bar nights, Aperitivo, Valentinis — vintage poster style)
// Rust/terracotta bg, cocktail glass SVG hero, classic editorial typography
// ─────────────────────────────────────────────────────────────────────────────
export function CocktailCard({ ev }: { ev: EventCardData }) {
  const href   = ev.href ?? "#";
  const bg     = ev.accentColor ?? "#C84030";

  return (
    <Link href={href} style={{ textDecoration: "none", display: "block", flexShrink: 0 }}>
      <div style={{
        width: 172, height: 248, borderRadius: 14, overflow: "hidden",
        position: "relative", background: bg,
        boxShadow: "0 10px 32px rgba(0,0,0,0.28), 0 2px 8px rgba(0,0,0,0.16)",
      }}>
        {/* Paper grain texture */}
        <div style={{
          position: "absolute", inset: 0, opacity: 0.06,
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='80' height='80' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
          backgroundSize: "80px 80px",
          pointerEvents: "none",
        }}/>

        {/* "JOIN US FOR" micro label */}
        <div style={{ paddingTop: 16, textAlign: "center" as const }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "7.5px", fontWeight: 800, letterSpacing: "0.24em", color: "rgba(255,255,255,0.55)" }}>
            JOIN US FOR
          </p>
        </div>

        {/* Event title — big lowercase serif */}
        <div style={{ textAlign: "center" as const, padding: "4px 14px 0" }}>
          <p style={{
            fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 400,
            fontSize: ev.title.length > 12 ? 22 : 28, lineHeight: 1.0,
            color: "rgba(255,255,255,0.95)", letterSpacing: "-0.01em",
          }}>{ev.title.toLowerCase()}</p>
        </div>

        {/* Martini glass SVG — centered hero */}
        <div style={{ display: "flex", justifyContent: "center", marginTop: 6 }}>
          <svg width="90" height="110" viewBox="0 0 90 110" fill="none">
            {/* Glass bowl (triangle inverted) */}
            <path d="M10 8 L80 8 L45 72 Z" stroke="rgba(255,255,255,0.82)" strokeWidth="2" fill="rgba(0,0,0,0.35)" strokeLinejoin="round"/>
            {/* Stem */}
            <line x1="45" y1="72" x2="45" y2="97" stroke="rgba(255,255,255,0.7)" strokeWidth="2.5" strokeLinecap="round"/>
            {/* Base */}
            <line x1="28" y1="97" x2="62" y2="97" stroke="rgba(255,255,255,0.7)" strokeWidth="2.5" strokeLinecap="round"/>
            {/* Liquid fill hint */}
            <path d="M20 22 L70 22 L45 65 Z" fill="rgba(0,0,0,0.25)" strokeWidth="0"/>
            {/* Olive */}
            <circle cx="45" cy="55" r="4" fill="rgba(255,255,255,0.55)" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
            <line x1="41" y1="55" x2="49" y2="55" stroke="rgba(255,255,255,0.45)" strokeWidth="1" strokeLinecap="round"/>
          </svg>
        </div>

        {/* Date + time flanking the glass */}
        <div style={{ display: "flex", justifyContent: "space-between", padding: "0 18px", marginTop: -26 }}>
          <div style={{ textAlign: "left" as const }}>
            <p style={{ fontFamily: "var(--font-jost)", fontWeight: 900, fontSize: "9px", letterSpacing: "0.1em", color: "rgba(255,255,255,0.9)", lineHeight: 1.2 }}>
              {ev.date.split(" ")[0]}<br/>{ev.date.split(" ").slice(1).join(" ") || ev.date}
            </p>
          </div>
          <div style={{ textAlign: "right" as const }}>
            <p style={{ fontFamily: "var(--font-jost)", fontWeight: 900, fontSize: "9px", letterSpacing: "0.1em", color: "rgba(255,255,255,0.9)", lineHeight: 1.2 }}>
              AT<br/>{ev.time}
            </p>
          </div>
        </div>

        {/* Venue in script at bottom */}
        <div style={{ position: "absolute", bottom: 14, left: 0, right: 0, textAlign: "center" as const }}>
          <p style={{ fontFamily: "var(--font-caveat)", fontSize: 18, fontWeight: 700, color: "rgba(255,255,255,0.88)", lineHeight: 1 }}>
            {ev.location}
          </p>
          {ev.spotsLeft !== undefined && (
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, color: "rgba(255,255,255,0.5)", letterSpacing: "0.1em", marginTop: 3 }}>
              {ev.spotsLeft} SEATS LEFT
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SUPPER NOTE CARD  (supper clubs, intimate dinners — handwritten notepad style)
// Cream notepad with ruled lines, handwritten Caveat font, TO/DATE/LOCATION
// ─────────────────────────────────────────────────────────────────────────────
export function SupperNoteCard({ ev }: { ev: EventCardData }) {
  const href   = ev.href ?? "#";
  const accent = ev.accentColor ?? "#8B1A1A";

  return (
    <Link href={href} style={{ textDecoration: "none", display: "block", flexShrink: 0 }}>
      <div style={{
        width: 172, height: 248, borderRadius: 10, overflow: "hidden",
        position: "relative", background: "#FAF7F0",
        boxShadow: "0 8px 28px rgba(0,0,0,0.18), 0 2px 6px rgba(0,0,0,0.1)",
      }}>
        {/* Ruled lines texture */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "repeating-linear-gradient(transparent, transparent 20px, rgba(0,0,0,0.055) 20px, rgba(0,0,0,0.055) 21px)",
          pointerEvents: "none",
        }}/>

        {/* Top header strip */}
        <div style={{
          background: accent, padding: "9px 12px",
          display: "flex", alignItems: "center", gap: 7,
          position: "relative", zIndex: 1,
        }}>
          {/* Heart/logo mark */}
          <svg width="12" height="10" viewBox="0 0 12 10" fill="white">
            <path d="M6 9.5 C6 9.5 0.5 5.5 0.5 3 C0.5 1.5 1.8 0.5 3.2 0.5 C4.3 0.5 5.2 1.2 6 2 C6.8 1.2 7.7 0.5 8.8 0.5 C10.2 0.5 11.5 1.5 11.5 3 C11.5 5.5 6 9.5 6 9.5Z"/>
          </svg>
          <p style={{ fontFamily: "var(--font-jost)", fontWeight: 900, fontSize: "8.5px", letterSpacing: "0.18em", color: "rgba(255,255,255,0.9)" }}>
            SUPPER CLUB
          </p>
        </div>

        {/* TO: / DATE: row */}
        <div style={{ padding: "10px 12px 6px", display: "flex", gap: 8, position: "relative", zIndex: 1 }}>
          <div style={{ flex: 1 }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.1em", color: "rgba(0,0,0,0.35)", marginBottom: 2 }}>TO:</p>
            <p style={{ fontFamily: "var(--font-caveat)", fontSize: 14, fontWeight: 700, color: "#1A0A00" }}>
              {ev.host ? `${ev.host}` : "Girlies!"}
            </p>
          </div>
          <div>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.1em", color: "rgba(0,0,0,0.35)", marginBottom: 2 }}>DATE:</p>
            <p style={{ fontFamily: "var(--font-caveat)", fontSize: 13, color: "#1A0A00" }}>{ev.date}</p>
          </div>
        </div>

        {/* Event title — large handwritten */}
        <div style={{ padding: "0 12px", position: "relative", zIndex: 1, flex: 1 }}>
          <p style={{
            fontFamily: "var(--font-caveat)", fontWeight: 700,
            fontSize: ev.title.length > 18 ? 17 : 20,
            color: "#1A0A00", lineHeight: 1.35,
          }}>
            {ev.title}
          </p>
        </div>

        {/* Bottom fields */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          padding: "6px 12px 10px",
          borderTop: `1px solid ${accent}22`,
          background: "rgba(250,247,240,0.95)",
          zIndex: 1,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "6.5px", fontWeight: 800, letterSpacing: "0.12em", color: "rgba(0,0,0,0.3)" }}>TIME</p>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "6.5px", fontWeight: 800, letterSpacing: "0.12em", color: "rgba(0,0,0,0.3)" }}>LOCATION</p>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "8.5px", fontWeight: 700, color: accent }}>{ev.time}</p>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", color: "rgba(0,0,0,0.55)", maxWidth: "55%", textAlign: "right" as const, lineHeight: 1.2 }}>
              {ev.location}
            </p>
          </div>
          {ev.spotsLeft !== undefined && (
            <p style={{ fontFamily: "var(--font-caveat)", fontSize: 11, color: `${accent}88`, marginTop: 4 }}>
              {ev.spotsLeft} spots · join the table →
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}

function EnvelopePhotoInvite({ ev }: { ev: EventCardData }) {
  const accent = ev.accentColor ?? PINK;
  const href = ev.href ?? "/member/happenings/confetti";

  return (
    <Link href={href} style={{ textDecoration: "none", display: "block", flexShrink: 0 }}>
      <div style={{
        width: 175, height: 240,
        position: "relative",
        borderRadius: 14,
        overflow: "visible",
      }}>
        {/* Pink envelope background */}
        <div style={{
          position: "absolute", inset: 0,
          background: PINK,
          borderRadius: 14,
          boxShadow: "0 8px 28px rgba(255,31,125,0.35), 0 2px 8px rgba(0,0,0,0.14)",
        }}>
          {/* Envelope V-flap top */}
          <svg style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "50%" }} viewBox="0 0 175 100" preserveAspectRatio="none">
            <path d="M0 0 L87.5 72 L175 0 Z" fill="rgba(255,255,255,0.15)"/>
            <path d="M0 0 L87.5 72 L175 0" stroke="rgba(255,255,255,0.2)" strokeWidth="1" fill="none"/>
          </svg>
        </div>

        {/* White card inset */}
        <div style={{
          position: "absolute", top: 10, left: 8, right: 8, bottom: 24,
          background: "white",
          borderRadius: 8,
          padding: "10px 11px 10px",
          boxShadow: "0 4px 18px rgba(0,0,0,0.18)",
          display: "flex", flexDirection: "column", gap: 6,
        }}>
          {/* Header label */}
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.2em", color: PINK, textTransform: "uppercase" as const }}>
            BLOOMBAY INVITES YOU TO
          </p>

          {/* Photo slot */}
          <div style={{ height: 70, borderRadius: 6, overflow: "hidden", flexShrink: 0 }}>
            {ev.imageUrl ? (
              <div style={{ position: "relative", width: "100%", height: "100%" }}>
                <Image src={ev.imageUrl} alt={ev.title} fill unoptimized style={{ objectFit: "cover" }} />
              </div>
            ) : (
              <div style={{ width: "100%", height: "100%", background: `linear-gradient(135deg, ${accent}99, ${accent}44)`, borderRadius: 6 }} />
            )}
          </div>

          {/* Big bold title */}
          <p style={{
            fontFamily: "var(--font-jost)", fontWeight: 900,
            fontSize: ev.title.length > 14 ? 20 : 28,
            color: accent, lineHeight: 0.95,
            textTransform: "uppercase" as const, letterSpacing: "-0.01em",
          }}>
            {ev.title}
          </p>

          {/* Handwritten date */}
          <p style={{ fontFamily: "var(--font-caveat)", fontSize: 12, fontStyle: "italic", color: "#555", lineHeight: 1 }}>
            {ev.date} · {ev.time}
          </p>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto" }}>
            {/* BB stamp circle */}
            <div style={{
              width: 32, height: 32, borderRadius: "50%",
              background: "#1A3A8F",
              display: "flex", alignItems: "center", justifyContent: "center",
              position: "relative", flexShrink: 0,
            }}>
              <svg style={{ position: "absolute", inset: 0 }} width="32" height="32" viewBox="0 0 32 32">
                <circle cx="16" cy="16" r="14" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1" strokeDasharray="3 2"/>
              </svg>
              <span style={{ fontFamily: "var(--font-jost)", fontWeight: 900, fontSize: "8px", color: "white", position: "relative", zIndex: 1 }}>BB</span>
            </div>

            {/* Attendee pill */}
            {ev.going !== undefined && ev.going > 0 && (
              <div style={{ background: `${PINK}14`, borderRadius: 999, padding: "3px 8px" }}>
                <p style={{ fontFamily: "var(--font-caveat)", fontSize: 11, color: PINK }}>{ev.going} girls attending</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <p style={{ fontFamily: "var(--font-caveat)", fontSize: 12, color: PINK, textAlign: "center" as const }}>
            can&apos;t wait! ♡
          </p>
        </div>
      </div>
    </Link>
  );
}

function ScallopCelebrationCard({ ev }: { ev: EventCardData }) {
  const accent = ev.accentColor ?? PINK;
  const href = ev.href ?? "/member/happenings/confetti";
  const displayTitle = ev.title.includes("♡") ? ev.title : `${ev.title} ♡`;

  return (
    <Link href={href} style={{ textDecoration: "none", display: "block", flexShrink: 0 }}>
      <div style={{
        width: 175, height: 230,
        background: "#FFF0F7",
        borderRadius: 16,
        border: "3px dotted rgba(255,31,125,0.27)",
        padding: 3,
        position: "relative",
        boxShadow: "0 8px 28px rgba(255,31,125,0.14), 0 2px 8px rgba(0,0,0,0.08)",
      }}>
        {/* Bow decoration top-right */}
        <svg style={{ position: "absolute", top: -8, right: 8, zIndex: 3 }} width="30" height="22" viewBox="0 0 30 22">
          <ellipse cx="8" cy="11" rx="8" ry="5" fill={PINK} opacity="0.85" transform="rotate(-20 8 11)"/>
          <ellipse cx="22" cy="11" rx="8" ry="5" fill={PINK} opacity="0.85" transform="rotate(20 22 11)"/>
          <circle cx="15" cy="11" r="3.5" fill={PINK}/>
        </svg>

        <div style={{ padding: "10px 12px 10px", display: "flex", flexDirection: "column", gap: 6, height: "100%" }}>
          {/* Eyebrow */}
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.25em", color: PINK, textTransform: "uppercase" as const, textAlign: "center" as const }}>
            BLOOMBAY CELEBRATES
          </p>

          {/* Divider */}
          <div style={{ width: "100%", height: 1, background: "rgba(255,31,125,0.13)" }} />

          {/* Big script title */}
          <p style={{
            fontFamily: "var(--font-caveat)", fontWeight: 700,
            fontSize: displayTitle.length > 18 ? 20 : 26,
            color: accent, lineHeight: 1.1, textAlign: "center" as const,
          }}>
            {displayTitle}
          </p>

          {/* Photo slot */}
          <div style={{ width: "100%", aspectRatio: "4/3", borderRadius: 8, overflow: "hidden", flexShrink: 0 }}>
            {ev.imageUrl ? (
              <div style={{ position: "relative", width: "100%", height: "100%" }}>
                <Image src={ev.imageUrl} alt={ev.title} fill unoptimized style={{ objectFit: "cover" }} />
              </div>
            ) : (
              <div style={{ width: "100%", height: "100%", background: `linear-gradient(135deg, ${accent}55, ${accent}22)` }} />
            )}
          </div>

          {/* Separator */}
          <div style={{ width: "100%", height: 1, background: "rgba(255,31,125,0.1)" }} />

          {/* Date and location */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 700, color: "rgba(0,0,0,0.45)" }}>
              {ev.date} · {ev.time}
            </p>
            {/* Small BB circle */}
            <div style={{
              width: 16, height: 16, borderRadius: "50%",
              background: PINK, display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <span style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: "5px", fontWeight: 700, color: "white" }}>BB</span>
            </div>
          </div>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", color: "rgba(0,0,0,0.38)" }}>📍 {ev.location}</p>
        </div>
      </div>
    </Link>
  );
}

function NewspaperBoldInvite({ ev }: { ev: EventCardData }) {
  const href = ev.href ?? "/member/happenings/confetti";

  return (
    <Link href={href} style={{ textDecoration: "none", display: "block", flexShrink: 0 }}>
      <div style={{
        width: 175, height: 240,
        background: "#0D1B3E",
        borderRadius: 12,
        overflow: "hidden",
        position: "relative",
        boxShadow: "0 10px 32px rgba(0,0,0,0.55), 0 2px 8px rgba(0,0,0,0.3)",
      }}>
        {/* Tape strip left */}
        <div style={{
          position: "absolute", top: 6, left: 10, width: 40, height: 10,
          background: "rgba(255,240,180,0.7)", borderRadius: 2,
          transform: "rotate(-8deg)", zIndex: 4,
        }} />
        {/* Tape strip center */}
        <div style={{
          position: "absolute", top: 4, left: "40%", width: 40, height: 10,
          background: "rgba(255,240,180,0.6)", borderRadius: 2,
          transform: "rotate(5deg)", zIndex: 4,
        }} />

        {/* Paper clip SVG top-right */}
        <svg style={{ position: "absolute", top: 8, right: 10, zIndex: 5 }} width="14" height="28" viewBox="0 0 14 28">
          <path d="M7 1 C3.5 1 1 3.5 1 7 L1 21 C1 24.5 3.5 27 7 27 C10.5 27 13 24.5 13 21 L13 8 C13 5.5 11.2 4 9 4 C6.8 4 5 5.5 5 8 L5 20 C5 21.6 6 22.5 7 22.5 C8 22.5 9 21.6 9 20 L9 9" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        </svg>

        {/* Big title */}
        <div style={{ padding: "22px 12px 0" }}>
          <p style={{
            fontFamily: "var(--font-jost)", fontWeight: 900,
            fontSize: ev.title.length > 12 ? 28 : 36,
            color: "white", lineHeight: 0.9,
            textTransform: "uppercase" as const, letterSpacing: "-0.02em",
          }}>
            {ev.title}
          </p>
        </div>

        {/* Pink accent line */}
        <div style={{ height: 2, background: PINK, margin: "8px 12px 0" }} />

        {/* Photo strip */}
        <div style={{ height: 80, overflow: "hidden", position: "relative", marginTop: 0 }}>
          {ev.imageUrl ? (
            <div style={{ position: "relative", width: "100%", height: "100%" }}>
              <Image src={ev.imageUrl} alt={ev.title} fill unoptimized style={{ objectFit: "cover" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(13,27,62,0.2) 0%, rgba(13,27,62,0.1) 100%)" }} />
            </div>
          ) : (
            <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, rgba(255,31,125,0.25), rgba(13,27,62,0.8))" }} />
          )}
        </div>

        {/* Bottom section */}
        <div style={{ padding: "8px 12px 10px", position: "relative" }}>
          <p style={{ fontFamily: "var(--font-caveat)", fontSize: 12, fontStyle: "italic", color: "rgba(255,255,255,0.7)", marginBottom: 4 }}>
            see you there!
          </p>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", color: "rgba(255,255,255,0.5)", letterSpacing: "0.06em" }}>
            {ev.date.toUpperCase()} · {ev.time} · {ev.location.toUpperCase()}
          </p>

          {/* Yellow smiley */}
          <div style={{
            position: "absolute", bottom: 10, right: 12,
            width: 22, height: 22, borderRadius: "50%",
            background: "#FFD700",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="14" height="14" viewBox="0 0 14 14">
              <circle cx="7" cy="7" r="6.5" fill="#FFD700"/>
              <circle cx="4.5" cy="5.5" r="1" fill="#333"/>
              <circle cx="9.5" cy="5.5" r="1" fill="#333"/>
              <path d="M4 9 Q7 11.5 10 9" stroke="#333" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}

function FormalEngagementInvite({ ev }: { ev: EventCardData }) {
  const href = ev.href ?? "/member/happenings/confetti";

  return (
    <Link href={href} style={{ textDecoration: "none", display: "block", flexShrink: 0 }}>
      <div style={{
        width: 175, height: 230,
        background: "#FDFAF3",
        borderRadius: 12,
        border: "1px solid rgba(196,168,64,0.53)",
        margin: 3,
        boxShadow: "0 8px 28px rgba(0,0,0,0.12), 0 2px 6px rgba(0,0,0,0.06)",
        display: "flex", flexDirection: "column", alignItems: "center",
        padding: "14px 16px 12px",
        position: "relative",
      }}>
        {/* Top ornament */}
        <p style={{ fontSize: 12, color: "#C4A840", marginBottom: 6, lineHeight: 1 }}>✦</p>

        {/* Header text */}
        <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.22em", color: "#B8960E", textAlign: "center" as const, marginBottom: 6 }}>
          PLEASE JOIN US FOR
        </p>

        {/* Centered divider */}
        <div style={{ width: "40%", height: 1, background: "#C4A840", marginBottom: 8 }} />

        {/* Event title */}
        <p style={{
          fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900,
          fontSize: ev.title.length > 18 ? 17 : 22,
          color: "#2C1A00", lineHeight: 1.1, textAlign: "center" as const, marginBottom: 8,
        }}>
          {ev.title}
        </p>

        {/* Host */}
        {ev.host && (
          <div style={{ textAlign: "center" as const, marginBottom: 6 }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "6.5px", fontWeight: 800, letterSpacing: "0.14em", color: "rgba(0,0,0,0.35)", marginBottom: 2 }}>HOSTED BY</p>
            <p style={{ fontFamily: "var(--font-caveat)", fontSize: 14, fontStyle: "italic", color: "#2C1A00" }}>{ev.host}</p>
          </div>
        )}

        {/* Decorative rule with diamond */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, width: "80%", marginBottom: 8 }}>
          <div style={{ flex: 1, height: "0.5px", background: "#C4A84055" }} />
          <span style={{ fontSize: 6, color: "#C4A840" }}>◆</span>
          <div style={{ flex: 1, height: "0.5px", background: "#C4A84055" }} />
        </div>

        {/* Date */}
        <p style={{ fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 700, color: "#2C1A00", textAlign: "center" as const, marginBottom: 3 }}>
          {ev.date}
        </p>

        {/* Location */}
        <p style={{ fontFamily: "var(--font-caveat)", fontSize: 13, color: "rgba(0,0,0,0.5)", textAlign: "center" as const, marginBottom: "auto" }}>
          {ev.location}
        </p>

        {/* RSVP pill */}
        <div style={{
          border: "1px solid #C4A840", borderRadius: 999, padding: "4px 16px",
          background: "#FDFAF3", marginTop: 8,
        }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, letterSpacing: "0.16em", color: "#B8960E" }}>RSVP</p>
        </div>

        {/* Wax seal bottom center */}
        <div style={{
          position: "absolute", bottom: -12, left: "50%", transform: "translateX(-50%)",
          width: 24, height: 24, borderRadius: "50%",
          background: "linear-gradient(135deg, #D4AF37, #B8960E)",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 2px 8px rgba(196,168,64,0.45)",
          zIndex: 2,
        }}>
          <span style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: "7px", fontWeight: 700, color: "white" }}>BB</span>
        </div>
      </div>
    </Link>
  );
}

function DarkLaunchInvite({ ev }: { ev: EventCardData }) {
  const href = ev.href ?? "/member/happenings/confetti";

  return (
    <Link href={href} style={{ textDecoration: "none", display: "block", flexShrink: 0 }}>
      <div style={{
        width: 175, height: 240,
        borderRadius: 14,
        overflow: "hidden",
        position: "relative",
        background: "linear-gradient(160deg, #3A0808, #1A0404)",
        boxShadow: "0 12px 36px rgba(0,0,0,0.6), 0 2px 10px rgba(100,0,0,0.4)",
      }}>
        {/* Dot texture */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "4px 4px",
          pointerEvents: "none",
        }} />

        {/* Starburst SVG background */}
        <svg style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", opacity: 0.08 }} width="120" height="120" viewBox="0 0 120 120">
          {Array.from({ length: 16 }, (_, i) => {
            const angle = (i * 360) / 16;
            const rad = (angle * Math.PI) / 180;
            return (
              <line
                key={i}
                x1="60" y1="60"
                x2={60 + 55 * Math.cos(rad)}
                y2={60 + 55 * Math.sin(rad)}
                stroke="white" strokeWidth="1.5" strokeLinecap="round"
              />
            );
          })}
        </svg>

        {/* Header label */}
        <div style={{ paddingTop: 16, paddingLeft: 12, paddingRight: 12, position: "relative", zIndex: 2 }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 700, letterSpacing: "0.22em", color: "rgba(255,255,255,0.55)", textTransform: "uppercase" as const }}>
            YOU&apos;RE INVITED TO OUR
          </p>
        </div>

        {/* Star accent */}
        <p style={{ position: "relative", zIndex: 2, paddingLeft: 12, fontSize: 12, color: PINK, lineHeight: 1, marginTop: 2 }}>✦</p>

        {/* Big title */}
        <div style={{ padding: "2px 12px 0", position: "relative", zIndex: 2 }}>
          <p style={{
            fontFamily: "var(--font-jost)", fontWeight: 900,
            fontSize: ev.title.length > 14 ? 22 : 30,
            color: "white", lineHeight: 0.9,
            textTransform: "uppercase" as const, letterSpacing: "-0.02em",
          }}>
            {ev.title}
          </p>
        </div>

        {/* Photo slot */}
        <div style={{ height: 80, marginTop: 10, position: "relative", overflow: "hidden", zIndex: 2 }}>
          {ev.imageUrl ? (
            <div style={{ position: "relative", width: "100%", height: "100%" }}>
              <Image src={ev.imageUrl} alt={ev.title} fill unoptimized style={{ objectFit: "cover" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(58,8,8,0.3), rgba(26,4,4,0.5))" }} />
            </div>
          ) : (
            <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, rgba(255,31,125,0.2), rgba(26,4,4,0.8))" }} />
          )}
        </div>

        {/* Date / location */}
        <div style={{ padding: "8px 12px 0", position: "relative", zIndex: 2 }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 600, color: "rgba(255,255,255,0.5)", letterSpacing: "0.08em" }}>
            {ev.date} · {ev.time} · {ev.location}
          </p>
        </div>

        {/* Spots left pill */}
        {ev.spotsLeft !== undefined && (
          <div style={{
            position: "absolute", bottom: 36, right: 12,
            background: "rgba(255,255,255,0.12)",
            borderRadius: 999, padding: "3px 9px", zIndex: 3,
          }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, color: "rgba(255,255,255,0.85)", letterSpacing: "0.1em" }}>
              {ev.spotsLeft} SPOTS LEFT
            </p>
          </div>
        )}

        {/* BB wax seal bottom center */}
        <div style={{
          position: "absolute", bottom: 10, left: "50%", transform: "translateX(-50%)",
          width: 28, height: 28, borderRadius: "50%",
          background: "linear-gradient(135deg, #8B0000, #5C0000)",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 2px 10px rgba(139,0,0,0.6)",
          zIndex: 3,
        }}>
          <span style={{ fontFamily: "var(--font-jost)", fontWeight: 900, fontSize: "8px", color: "rgba(255,255,255,0.9)" }}>BB</span>
        </div>
      </div>
    </Link>
  );
}

export function InvitationEventCard({ ev }: { ev: EventCardData }) {
  if (ev.invitationStyle === "photo")      return <EnvelopePhotoInvite ev={ev} />;
  if (ev.invitationStyle === "scallop")    return <ScallopCelebrationCard ev={ev} />;
  if (ev.invitationStyle === "newspaper")  return <NewspaperBoldInvite ev={ev} />;
  if (ev.invitationStyle === "formal")     return <FormalEngagementInvite ev={ev} />;
  if (ev.invitationStyle === "launch")     return <DarkLaunchInvite ev={ev} />;
  return <DefaultEnvelopeCard ev={ev} />;
}

// ─────────────────────────────────────────────────────────────────────────────
// BRUSH & GLASS CARD  (paint & sip bar — crimson/pink postage stamp frame)
// ─────────────────────────────────────────────────────────────────────────────
export function BrushGlassCard({ ev }: { ev: EventCardData }) {
  const accent = ev.accentColor ?? "#B42035";
  const href = ev.href ?? "#";

  return (
    <Link href={href} style={{ textDecoration: "none", display: "block", flexShrink: 0 }}>
      <div style={{
        width: 175, height: 260,
        borderRadius: 14, overflow: "hidden",
        position: "relative",
        background: accent,
        boxShadow: "0 10px 32px rgba(0,0,0,0.28), 0 2px 8px rgba(0,0,0,0.16)",
      }}>
        {/* Plus sign decorations scattered */}
        {[[14, 12], [155, 20], [10, 200], [158, 180], [80, 8], [90, 250]].map(([x, y], i) => (
          <div key={i} style={{ position: "absolute", left: x, top: y, opacity: 0.2, pointerEvents: "none" }}>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round">
              <line x1="5" y1="1" x2="5" y2="9" /><line x1="1" y1="5" x2="9" y2="5" />
            </svg>
          </div>
        ))}

        {/* TOP: eyebrow */}
        <div style={{ paddingTop: 12, textAlign: "center" }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, color: "rgba(255,255,255,0.5)", letterSpacing: "0.2em" }}>BLOOMBAY PRESENTS</p>
        </div>

        {/* Martini glass SVG */}
        <div style={{ display: "flex", justifyContent: "center", marginTop: 4 }}>
          <svg width="50" height="60" viewBox="0 0 50 60" fill="none">
            <polygon points="10,5 40,5 25,35" stroke="white" fill="rgba(255,255,255,0.15)" strokeWidth="1.5" strokeLinejoin="round"/>
            <line x1="25" y1="35" x2="25" y2="52" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="15" y1="52" x2="35" y2="52" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            <circle cx="18" cy="22" r="3" fill="rgba(255,255,255,0.5)"/>
            <circle cx="32" cy="22" r="3" fill="rgba(255,255,255,0.5)"/>
          </svg>
        </div>

        {/* PHOTO — postage stamp frame */}
        <div style={{ display: "flex", justifyContent: "center", marginTop: 4 }}>
          <div style={{ width: 120, background: "white", padding: "4px 4px 12px", border: "1px dashed rgba(255,255,255,0.3)", boxSizing: "border-box" }}>
            <div style={{ width: "100%", height: 70, overflow: "hidden", position: "relative", background: "linear-gradient(135deg, rgba(180,32,53,0.3), rgba(180,32,53,0.1))" }}>
              {ev.imageUrl ? (
                <Image src={ev.imageUrl} alt={ev.title} fill unoptimized style={{ objectFit: "cover" }} />
              ) : (
                <div style={{ width: "100%", height: "100%", background: `linear-gradient(135deg, ${accent}55, rgba(0,0,0,0.2))` }} />
              )}
            </div>
            <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: "11px", color: "#B42035", textAlign: "center", marginTop: 4, lineHeight: 1.2 }}>{ev.title}</p>
          </div>
        </div>

        {/* BOTTOM section */}
        <div style={{ padding: "8px 14px 0", textAlign: "center" }}>
          <p style={{ fontFamily: "var(--font-jost)", fontWeight: 900, fontSize: "16px", color: "white", textTransform: "uppercase", lineHeight: 1.1, letterSpacing: "-0.01em" }}>{ev.title}</p>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "9px", color: "rgba(255,255,255,0.7)", marginTop: 4 }}>{ev.date} · {ev.time}</p>
          <p style={{ fontFamily: "var(--font-caveat)", fontSize: "13px", color: "rgba(255,255,255,0.55)", marginTop: 2 }}>{ev.location}</p>
          {ev.spotsLeft !== undefined && (
            <div style={{ display: "inline-block", background: "rgba(255,255,255,0.18)", borderRadius: 999, padding: "3px 10px", marginTop: 5 }}>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "7.5px", fontWeight: 800, color: "white", letterSpacing: "0.08em" }}>{ev.spotsLeft} SPOTS · JOIN US</p>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Auto-picker — selects the right card template for an event type
// ─────────────────────────────────────────────────────────────────────────────
export function EventCard({ ev }: { ev: EventCardData }) {
  if (ev.type === "concert")    return <TicketCard ev={ev} />;
  if (ev.type === "party")      return <PosterCard ev={ev} />;
  if (ev.type === "invitation") return <InvitationEventCard ev={ev} />;
  if (ev.type === "open_seats") return <OpenSeatsCard ev={ev} />;
  if (ev.type === "table")      return <TableCard ev={ev} />;
  if (ev.type === "food")       return <FoodEditorialCard ev={ev} />;
  if (ev.type === "popup")      return <FoodPopupCard ev={ev} />;
  if (ev.type === "bakery")     return <BakeryReceiptCard ev={ev} />;
  if (ev.type === "drinks")     return <CocktailCard ev={ev} />;
  if (ev.type === "supper")     return <SupperNoteCard ev={ev} />;
  if (ev.type === "paint")      return <BrushGlassCard ev={ev} />;
  return <GatheringCard ev={ev} />;
}
