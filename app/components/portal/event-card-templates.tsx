"use client";

/**
 * Event card templates — each event type gets its own physical-world design:
 *   concert    → printed ticket stub with perforation + barcode
 *   party      → screen-printed poster with bold typography
 *   gathering  → clean sophisticated card (default)
 *   invitation → envelope/celebration card (links to ConfettiPage)
 */

import Link from "next/link";

const PINK = "#FF1F7D";
const DARK = "#1C1B1C";

export type EventType = "concert" | "party" | "gathering" | "invitation" | "brunch" | "walk" | "museum" | "open_seats" | "table";

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
  href?: string;
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
export function InvitationEventCard({ ev }: { ev: EventCardData }) {
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
// Auto-picker — selects the right card template for an event type
// ─────────────────────────────────────────────────────────────────────────────
export function EventCard({ ev }: { ev: EventCardData }) {
  if (ev.type === "concert")    return <TicketCard ev={ev} />;
  if (ev.type === "party")      return <PosterCard ev={ev} />;
  if (ev.type === "invitation") return <InvitationEventCard ev={ev} />;
  if (ev.type === "open_seats") return <OpenSeatsCard ev={ev} />;
  if (ev.type === "table")      return <TableCard ev={ev} />;
  return <GatheringCard ev={ev} />;
}
