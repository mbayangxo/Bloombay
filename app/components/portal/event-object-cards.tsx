"use client";

import { type Event } from "@/lib/actions/events";

// ── Helpers ───────────────────────────────────────────────────────────────────
function fmtDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" }).toUpperCase();
}
function fmtTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

// ── Card type detection ────────────────────────────────────────────────────────
export type ObjectCardType =
  | "passport"       // ground road trip
  | "boarding-pass"  // flight
  | "book"           // book club / reading
  | "dinner-table"   // dinner / brunch / dining
  | "ticket"         // museum / exhibition / film
  | "poster"         // party / dance / girls night

export function getObjectCardType(ev: Event): ObjectCardType {
  const t  = (ev.event_type ?? "").toLowerCase();
  const ti = ev.title.toLowerCase();

  if (t.includes("flight") || t.includes("plane") || t.includes("fly") || ti.includes("flight") || ti.includes("fly"))
    return "boarding-pass";
  if (t.includes("trip") || t.includes("travel") || t.includes("road") || t.includes("bus") || t.includes("train") || t.includes("car") || ti.includes("trip") || ti.includes("road") || ti.includes("marrakech") || ti.includes("journey"))
    return "passport";
  if (t.includes("museum") || t.includes("exhibition") || t.includes("gallery") || t.includes("film") || t.includes("cinema") || ti.includes("museum") || ti.includes("film") || ti.includes("exhibition"))
    return "ticket";
  if (t.includes("book") || t.includes("reading") || t.includes("lit") || ti.includes("book") || ti.includes("read") || ti.includes("bagel"))
    return "book";
  if (t.includes("dinner") || t.includes("dining") || t.includes("supper") || t.includes("brunch") || t.includes("lunch") || t.includes("aperitivo") || ti.includes("dinner") || ti.includes("supper") || ti.includes("brunch") || ti.includes("aperitivo") || ti.includes("table") || ti.includes("carbone"))
    return "dinner-table";

  return "poster";
}

// ── PASSPORT CARD (road trip / bus / train) ───────────────────────────────────
export function PassportCard({ ev, size = "sm" }: { ev: Event; size?: "sm" | "lg" }) {
  const w = size === "lg" ? "100%" : 140;
  return (
    <div style={{
      width: w, maxWidth: size === "lg" ? 380 : undefined,
      background: "#1B2A4A",
      borderRadius: 14,
      padding: size === "lg" ? "28px 24px" : "16px 14px",
      boxShadow: "0 24px 60px rgba(0,0,0,0.55), 0 4px 0 rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)",
      position: "relative",
      overflow: "hidden",
      fontFamily: "var(--font-jost)",
    }}>
      {/* Passport security pattern */}
      <div style={{ position: "absolute", inset: 0, opacity: 0.04, backgroundImage: "repeating-linear-gradient(45deg, #C8A84B 0px, #C8A84B 1px, transparent 0px, transparent 50%)", backgroundSize: "8px 8px", pointerEvents: "none" }} />

      {/* Header: Bloombay crest */}
      <div style={{ textAlign: "center", marginBottom: size === "lg" ? 20 : 12 }}>
        <svg width={size === "lg" ? 36 : 24} height={size === "lg" ? 36 : 24} viewBox="0 0 36 36" fill="none" style={{ marginBottom: 4 }}>
          <circle cx="18" cy="18" r="16" stroke="#C8A84B" strokeWidth="1.5" />
          <path d="M18 6v24M6 18h24M9.5 9.5l17 17M26.5 9.5l-17 17" stroke="#C8A84B" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
        <p style={{ color: "#C8A84B", fontSize: size === "lg" ? 9 : 7, fontWeight: 900, letterSpacing: "0.28em", lineHeight: 1.4 }}>BLOOMBAY</p>
        <p style={{ color: "#C8A84B", fontSize: size === "lg" ? 8 : 6, letterSpacing: "0.2em", opacity: 0.7 }}>MEMBER PASSPORT</p>
      </div>

      {/* Photo placeholder */}
      <div style={{ width: size === "lg" ? 64 : 40, height: size === "lg" ? 64 : 40, border: "1.5px solid rgba(200,168,75,0.4)", margin: "0 auto", marginBottom: size === "lg" ? 16 : 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: size === "lg" ? 28 : 18 }}>✦</span>
      </div>

      {/* Data fields */}
      <div style={{ borderTop: "1px solid rgba(200,168,75,0.2)", paddingTop: size === "lg" ? 12 : 8, marginBottom: size === "lg" ? 12 : 8 }}>
        <p style={{ color: "#C8A84B", fontSize: 6, letterSpacing: "0.15em", opacity: 0.6, marginBottom: 2 }}>SURNAME / DESTINATION</p>
        <p style={{ color: "white", fontSize: size === "lg" ? 15 : 11, fontWeight: 700, lineHeight: 1.2, marginBottom: 8 }}>{ev.title}</p>
        <div style={{ display: "flex", gap: size === "lg" ? 24 : 14 }}>
          <div>
            <p style={{ color: "#C8A84B", fontSize: 6, letterSpacing: "0.12em", opacity: 0.6, marginBottom: 1 }}>DATE OF TRAVEL</p>
            <p style={{ color: "white", fontSize: size === "lg" ? 10 : 8, fontWeight: 600 }}>{fmtDate(ev.starts_at)}</p>
          </div>
          <div>
            <p style={{ color: "#C8A84B", fontSize: 6, letterSpacing: "0.12em", opacity: 0.6, marginBottom: 1 }}>DEPARTS</p>
            <p style={{ color: "white", fontSize: size === "lg" ? 10 : 8, fontWeight: 600 }}>{fmtTime(ev.starts_at)}</p>
          </div>
          {ev.venue && size === "lg" && (
            <div>
              <p style={{ color: "#C8A84B", fontSize: 6, letterSpacing: "0.12em", opacity: 0.6, marginBottom: 1 }}>VENUE</p>
              <p style={{ color: "white", fontSize: 10, fontWeight: 600 }}>{ev.venue}</p>
            </div>
          )}
        </div>
      </div>

      {/* MRZ lines */}
      <div style={{ borderTop: "1px solid rgba(200,168,75,0.15)", paddingTop: 6, fontFamily: "monospace", fontSize: size === "lg" ? 7 : 5.5, color: "rgba(200,168,75,0.3)", letterSpacing: "0.04em", lineHeight: 1.6, overflowX: "hidden" }}>
        <p>P&lt;BLM{ev.title.toUpperCase().replace(/[^A-Z]/g, "").padEnd(24, "<").slice(0, 24)}</p>
        <p>1234567890&lt;9BLM9301019F2612310&lt;&lt;&lt;&lt;&lt;&lt;</p>
      </div>
    </div>
  );
}

// ── BOARDING PASS CARD (air travel / flight) ───────────────────────────────────
export function BoardingPassCard({ ev, size = "sm" }: { ev: Event; size?: "sm" | "lg" }) {
  const isLg = size === "lg";
  return (
    <div style={{
      width: isLg ? "100%" : 220,
      maxWidth: isLg ? 420 : undefined,
      background: "#FFFDF8",
      borderRadius: 16,
      boxShadow: "0 20px 56px rgba(0,0,0,0.38), 0 4px 0 rgba(0,0,0,0.12)",
      overflow: "hidden",
      fontFamily: "var(--font-jost)",
      display: "flex",
    }}>
      {/* Left main section */}
      <div style={{ flex: 1, padding: isLg ? "20px 20px" : "14px 14px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: isLg ? 14 : 8 }}>
          <p style={{ fontSize: isLg ? 8 : 6.5, fontWeight: 900, letterSpacing: "0.2em", color: "#999" }}>BLOOMBAY AIR</p>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#FF1F7D"><path d="M21 16v-2l-8-5V3.5C13 2.67 12.33 2 11.5 2S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" /></svg>
        </div>
        <div style={{ display: "flex", gap: isLg ? 16 : 10, alignItems: "center", marginBottom: isLg ? 14 : 8 }}>
          <div>
            <p style={{ fontSize: isLg ? 30 : 22, fontWeight: 900, color: "#111", lineHeight: 1 }}>NYC</p>
            <p style={{ fontSize: 6, color: "#999", letterSpacing: "0.1em" }}>ORIGIN</p>
          </div>
          <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 4 }}>
            <div style={{ flex: 1, height: 1, background: "#ddd" }} />
            <svg width="12" height="12" viewBox="0 0 24 24" fill="#ccc"><path d="M21 16v-2l-8-5V3.5C13 2.67 12.33 2 11.5 2S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" /></svg>
            <div style={{ flex: 1, height: 1, background: "#ddd" }} />
          </div>
          <div>
            <p style={{ fontSize: isLg ? 30 : 22, fontWeight: 900, color: "#FF1F7D", lineHeight: 1 }}>✦</p>
            <p style={{ fontSize: 6, color: "#999", letterSpacing: "0.1em" }}>DEST.</p>
          </div>
        </div>
        <p style={{ fontSize: isLg ? 13 : 10, fontWeight: 700, color: "#111", marginBottom: 4, lineHeight: 1.2 }}>{ev.title}</p>
        {ev.venue && <p style={{ fontSize: isLg ? 9 : 7, color: "#888", marginBottom: isLg ? 10 : 6 }}>{ev.venue}</p>}
        <div style={{ display: "flex", gap: isLg ? 14 : 8 }}>
          <div>
            <p style={{ fontSize: 6, color: "#aaa", letterSpacing: "0.12em", marginBottom: 1 }}>DATE</p>
            <p style={{ fontSize: isLg ? 10 : 8, fontWeight: 700, color: "#333" }}>{fmtDate(ev.starts_at)}</p>
          </div>
          <div>
            <p style={{ fontSize: 6, color: "#aaa", letterSpacing: "0.12em", marginBottom: 1 }}>DEPARTS</p>
            <p style={{ fontSize: isLg ? 10 : 8, fontWeight: 700, color: "#333" }}>{fmtTime(ev.starts_at)}</p>
          </div>
        </div>
      </div>

      {/* Perforation tear line */}
      <div style={{ width: 1, background: "repeating-linear-gradient(to bottom, transparent 0px, transparent 4px, #ddd 4px, #ddd 8px)", position: "relative", flexShrink: 0 }}>
        <div style={{ position: "absolute", top: -8, left: "50%", transform: "translateX(-50%)", width: 16, height: 16, borderRadius: "50%", background: "#f5f5f5" }} />
        <div style={{ position: "absolute", bottom: -8, left: "50%", transform: "translateX(-50%)", width: 16, height: 16, borderRadius: "50%", background: "#f5f5f5" }} />
      </div>

      {/* Right stub */}
      <div style={{ width: isLg ? 80 : 56, background: "#FF1F7D", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "12px 8px", gap: 8 }}>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: 6, fontWeight: 900, color: "rgba(255,255,255,0.7)", letterSpacing: "0.15em", writingMode: "vertical-rl", transform: "rotate(180deg)" }}>BOARDING PASS</p>
        <div style={{ width: isLg ? 40 : 28, height: isLg ? 40 : 28, background: "rgba(255,255,255,0.15)", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: isLg ? 20 : 14, color: "white" }}>✦</span>
        </div>
      </div>
    </div>
  );
}

// ── BOOK CARD (book club / reading events) ────────────────────────────────────
export function BookCard({ ev, size = "sm" }: { ev: Event; size?: "sm" | "lg" }) {
  const isLg = size === "lg";
  return (
    <div style={{
      width: isLg ? "100%" : 140,
      maxWidth: isLg ? 340 : undefined,
      display: "flex",
      filter: "drop-shadow(0 22px 50px rgba(0,0,0,0.50)) drop-shadow(0 4px 8px rgba(0,0,0,0.25))",
      fontFamily: "var(--font-jost)",
    }}>
      {/* Spine */}
      <div style={{
        width: isLg ? 20 : 13,
        background: "linear-gradient(180deg, #3d2b1a 0%, #1a0f06 100%)",
        borderRadius: "6px 0 0 6px",
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}>
        <div style={{ width: 1, height: "60%", background: "rgba(255,220,160,0.15)", position: "absolute" }} />
      </div>

      {/* Cover */}
      <div style={{
        flex: 1,
        background: "linear-gradient(145deg, #2d1f0e 0%, #4a2c1a 100%)",
        borderRadius: "0 10px 10px 0",
        padding: isLg ? "24px 20px" : "14px 12px",
        position: "relative",
        overflow: "hidden",
        minHeight: isLg ? 200 : 160,
      }}>
        {/* Cloth texture */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(90deg, rgba(255,255,255,0.015) 0px, rgba(255,255,255,0.015) 1px, transparent 1px, transparent 4px)", pointerEvents: "none" }} />
        {/* Gold frame */}
        <div style={{ position: "absolute", inset: isLg ? 8 : 5, border: "1px solid rgba(200,168,75,0.25)", borderRadius: 6, pointerEvents: "none" }} />

        {/* Content */}
        <div style={{ position: "relative", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <p style={{ color: "rgba(200,168,75,0.6)", fontSize: isLg ? 7 : 5.5, letterSpacing: "0.22em", fontWeight: 700, marginBottom: isLg ? 10 : 6 }}>BOOK CLUB</p>
            <p style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontWeight: 300, fontSize: isLg ? 20 : 14, color: "#f5e8d0", lineHeight: 1.2, marginBottom: isLg ? 8 : 4 }}>{ev.title}</p>
            {ev.venue && <p style={{ color: "rgba(245,232,208,0.45)", fontSize: isLg ? 9 : 7, marginBottom: isLg ? 10 : 6 }}>{ev.venue}</p>}
          </div>
          <div style={{ borderTop: "1px solid rgba(200,168,75,0.2)", paddingTop: isLg ? 10 : 6 }}>
            <p style={{ color: "rgba(200,168,75,0.5)", fontSize: isLg ? 8 : 6, letterSpacing: "0.1em" }}>{fmtDate(ev.starts_at)} · {fmtTime(ev.starts_at)}</p>
          </div>
        </div>
      </div>

      {/* Page edges — right side */}
      <div style={{ width: isLg ? 8 : 5, display: "flex", flexDirection: "column", justifyContent: "center", gap: 1.5, paddingLeft: 1, flexShrink: 0 }}>
        {Array.from({ length: isLg ? 22 : 16 }).map((_, i) => (
          <div key={i} style={{ width: "100%", height: isLg ? 3.5 : 2.5, background: "#f0e8d8", borderRadius: "0 1px 1px 0", boxShadow: "inset -1px 0 0 rgba(0,0,0,0.08)" }} />
        ))}
      </div>
    </div>
  );
}

// ── DINNER TABLE CARD (dinner / brunch / dining events) ───────────────────────
export function DinnerTableCard({ ev, size = "sm" }: { ev: Event; size?: "sm" | "lg" }) {
  const isLg = size === "lg";
  const d = isLg ? 260 : 160;
  const plateD = isLg ? 140 : 90;
  return (
    <div style={{
      width: d,
      height: d,
      borderRadius: "50%",
      background: "linear-gradient(145deg, #2c1810 0%, #4a2217 50%, #3a1a10 100%)",
      boxShadow: `0 ${isLg ? 30 : 20}px ${isLg ? 70 : 50}px rgba(0,0,0,0.55), 0 ${isLg ? 8 : 4}px 0 rgba(0,0,0,0.35)`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      flexShrink: 0,
      fontFamily: "var(--font-jost)",
    }}>
      {/* Tablecloth edge */}
      <div style={{ position: "absolute", inset: isLg ? 10 : 6, borderRadius: "50%", border: "1px dashed rgba(255,220,180,0.18)" }} />
      <div style={{ position: "absolute", inset: isLg ? 18 : 11, borderRadius: "50%", border: "1px solid rgba(255,220,180,0.08)" }} />

      {/* Fork — left */}
      <div style={{ position: "absolute", left: isLg ? 22 : 14, top: "50%", transform: "translateY(-50%)" }}>
        <svg width={isLg ? 16 : 10} height={isLg ? 52 : 34} viewBox="0 0 16 52" fill="rgba(200,168,75,0.5)">
          <rect x="2" y="0" width="2" height="20" rx="1" />
          <rect x="7" y="0" width="2" height="20" rx="1" />
          <rect x="12" y="0" width="2" height="20" rx="1" />
          <rect x="6" y="20" width="4" height="32" rx="2" />
        </svg>
      </div>

      {/* Knife — right */}
      <div style={{ position: "absolute", right: isLg ? 22 : 14, top: "50%", transform: "translateY(-50%)" }}>
        <svg width={isLg ? 10 : 7} height={isLg ? 52 : 34} viewBox="0 0 10 52" fill="rgba(200,168,75,0.5)">
          <path d="M5 0 Q8 10 8 20 L6 20 L6 52 Q5 52 4 52 L4 20 L2 20 Q2 10 5 0Z" />
        </svg>
      </div>

      {/* Plate */}
      <div style={{
        width: plateD,
        height: plateD,
        borderRadius: "50%",
        background: "#FDFAF5",
        border: `${isLg ? 3 : 2}px solid rgba(200,168,75,0.25)`,
        boxShadow: "inset 0 2px 8px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.15)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        textAlign: "center",
        padding: isLg ? 16 : 10,
      }}>
        {/* Inner plate ring */}
        <div style={{ position: "absolute", width: plateD * 0.7, height: plateD * 0.7, borderRadius: "50%", border: "1px solid rgba(200,168,75,0.15)" }} />
        <p style={{ fontSize: isLg ? 7 : 5.5, fontWeight: 900, letterSpacing: "0.18em", color: "#bbb", marginBottom: isLg ? 6 : 3 }}>DINNER</p>
        <p style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontWeight: 300, fontSize: isLg ? 14 : 9, color: "#1a0f06", lineHeight: 1.25, position: "relative" }}>{ev.title}</p>
        <p style={{ fontSize: isLg ? 8 : 6, color: "#999", marginTop: isLg ? 6 : 3 }}>{fmtDate(ev.starts_at)}</p>
      </div>
    </div>
  );
}

// ── TICKET STUB CARD (museum / film / exhibition) ─────────────────────────────
export function TicketStubCard({ ev, size = "sm" }: { ev: Event; size?: "sm" | "lg" }) {
  const isLg = size === "lg";
  const accent = ev.accent_color ?? "#FF1F7D";
  return (
    <div style={{
      width: isLg ? "100%" : 140,
      maxWidth: isLg ? 360 : undefined,
      background: "#FEFEFE",
      borderRadius: 12,
      boxShadow: "0 20px 54px rgba(0,0,0,0.42), 0 4px 0 rgba(0,0,0,0.14)",
      overflow: "hidden",
      fontFamily: "var(--font-jost)",
    }}>
      {/* Top color band */}
      <div style={{ background: accent, padding: isLg ? "16px 18px" : "10px 12px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", right: -20, top: -20, width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,0.1)" }} />
        <p style={{ fontSize: isLg ? 8 : 6, fontWeight: 900, letterSpacing: "0.22em", color: "rgba(255,255,255,0.7)", marginBottom: 4, position: "relative" }}>BLOOMBAY ✦ ADMIT ONE</p>
        <p style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontWeight: 300, fontSize: isLg ? 22 : 14, color: "white", lineHeight: 1.15, position: "relative" }}>{ev.title}</p>
      </div>

      {/* Perforation */}
      <div style={{ height: 1, background: `repeating-linear-gradient(to right, transparent 0px, transparent 4px, rgba(0,0,0,0.12) 4px, rgba(0,0,0,0.12) 8px)`, position: "relative" }}>
        <div style={{ position: "absolute", left: -8, top: "50%", transform: "translateY(-50%)", width: 16, height: 16, borderRadius: "50%", background: "#F0F0F0" }} />
        <div style={{ position: "absolute", right: -8, top: "50%", transform: "translateY(-50%)", width: 16, height: 16, borderRadius: "50%", background: "#F0F0F0" }} />
      </div>

      {/* Body */}
      <div style={{ padding: isLg ? "14px 18px" : "10px 12px" }}>
        {ev.venue && <p style={{ fontSize: isLg ? 10 : 7.5, fontWeight: 700, color: "#333", marginBottom: isLg ? 10 : 6, lineHeight: 1.3 }}>{ev.venue}</p>}
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: isLg ? 12 : 8 }}>
          <div>
            <p style={{ fontSize: 6, color: "#aaa", letterSpacing: "0.12em", marginBottom: 2 }}>DATE</p>
            <p style={{ fontSize: isLg ? 11 : 8, fontWeight: 700, color: "#111" }}>{fmtDate(ev.starts_at)}</p>
          </div>
          <div>
            <p style={{ fontSize: 6, color: "#aaa", letterSpacing: "0.12em", marginBottom: 2 }}>TIME</p>
            <p style={{ fontSize: isLg ? 11 : 8, fontWeight: 700, color: "#111" }}>{fmtTime(ev.starts_at)}</p>
          </div>
        </div>

        {/* Barcode */}
        <div style={{ display: "flex", gap: "2px", height: isLg ? 28 : 18, alignItems: "flex-end" }}>
          {Array.from({ length: isLg ? 28 : 20 }).map((_, i) => (
            <div key={i} style={{ flex: Math.random() > 0.5 ? 2 : 1, background: "#111", height: `${60 + (i % 3) * 15}%`, borderRadius: 0.5 }} />
          ))}
        </div>
        <p style={{ fontSize: 5.5, color: "#ccc", letterSpacing: "0.08em", marginTop: 3 }}>BLM{ev.id.slice(0, 8).toUpperCase()}</p>
      </div>
    </div>
  );
}

// ── POSTER CARD (party / dance / girls night) ─────────────────────────────────
// Uses the event's own image_url or a template PNG matched by type
export function PosterCard({ ev, imageSrc, size = "sm" }: { ev: Event; imageSrc: string; size?: "sm" | "lg" }) {
  const isLg = size === "lg";
  const accent = ev.accent_color ?? "#FF1F7D";
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <div style={{ position: "relative", width: isLg ? "100%" : 140, maxWidth: isLg ? 380 : undefined, flexShrink: 0 }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imageSrc}
        alt={ev.title}
        style={{
          width: "100%",
          height: "auto",
          display: "block",
          borderRadius: 14,
          filter: `drop-shadow(0 ${isLg ? 32 : 20}px ${isLg ? 64 : 44}px rgba(0,0,0,0.45)) drop-shadow(0 4px 8px ${accent}33)`,
          transform: "translateZ(0)",
        }}
      />
    </div>
  );
}

// ── Universal event card selector ─────────────────────────────────────────────
// Poster template PNGs used when there's no uploaded image
const POSTER_TEMPLATES: Record<string, string> = {
  "girls_night":  "/happenings/posters/01_Girls_Night.png",
  "aperitivo":    "/happenings/posters/02_Save_The_Date_Aperitivo.png",
  "vinyl":        "/happenings/posters/03_Vinyl_Night_Jazz.png",
  "rooftop":      "/happenings/posters/08_Rooftop_Sessions.png",
  "dance":        "/happenings/posters/06_Dance_All_Night.png",
  "default":      "/happenings/posters/01_Girls_Night.png",
};

function getPosterTemplate(ev: Event): string {
  const t  = (ev.event_type ?? "").toLowerCase();
  const ti = ev.title.toLowerCase();
  if (ti.includes("aperitivo") || t.includes("aperitivo")) return POSTER_TEMPLATES.aperitivo;
  if (ti.includes("vinyl") || ti.includes("jazz"))         return POSTER_TEMPLATES.vinyl;
  if (ti.includes("rooftop"))                              return POSTER_TEMPLATES.rooftop;
  if (t.includes("dance") || ti.includes("dance"))         return POSTER_TEMPLATES.dance;
  return POSTER_TEMPLATES.default;
}

export function EventObjectCard({ ev, size = "sm", rotation = 0 }: { ev: Event; size?: "sm" | "lg"; rotation?: number }) {
  const type = getObjectCardType(ev);
  const style: React.CSSProperties = {
    transform: rotation ? `rotate(${rotation}deg) translateZ(0)` : "translateZ(0)",
    flexShrink: 0,
    display: "block",
  };
  return (
    <div style={style}>
      {type === "passport"      && <PassportCard ev={ev} size={size} />}
      {type === "boarding-pass" && <BoardingPassCard ev={ev} size={size} />}
      {type === "book"          && <BookCard ev={ev} size={size} />}
      {type === "dinner-table"  && <DinnerTableCard ev={ev} size={size} />}
      {type === "ticket"        && <TicketStubCard ev={ev} size={size} />}
      {type === "poster"        && <PosterCard ev={ev} imageSrc={ev.image_url ?? getPosterTemplate(ev)} size={size} />}
    </div>
  );
}
