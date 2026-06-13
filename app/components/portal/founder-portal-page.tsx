"use client";

import { useState } from "react";
import Link from "next/link";

const PINK  = "#FF1F7D";
const PLUM  = "#1A0A2E";
const IVORY = "#fdf4ec";
const INK   = "#111111";

// ── Demo stats ────────────────────────────────────────────────────────────────

const STATS = [
  { label: "Bloomies",      value: "1",    sub: "You're first." },
  { label: "Happenings",    value: "0",    sub: "Create the first." },
  { label: "Clubs",         value: "12",   sub: "Active" },
  { label: "Cities",        value: "3",    sub: "NYC · London · Paris" },
];

const RECENT_HAPPENINGS = [
  { id: "h1", title: "Dinner Society Launch Night", venue: "Carbone · West Village", date: "Jun 7 · 7PM", rsvps: 12, capacity: 16, status: "upcoming" },
  { id: "h2", title: "Museum Morning: The MET",     venue: "The Metropolitan Museum", date: "Jun 14 · 10AM", rsvps: 8, capacity: 20, status: "upcoming" },
  { id: "h3", title: "Book Club: May Edition",      venue: "McNally Jackson · SoHo",  date: "May 31 · 6PM", rsvps: 22, capacity: 22, status: "past" },
];

// ── Create Happening Sheet ────────────────────────────────────────────────────

function CreateSheet({ onClose }: { onClose: () => void }) {
  const [title, setTitle]         = useState("");
  const [venue, setVenue]         = useState("");
  const [hood, setHood]           = useState("");
  const [city, setCity]           = useState("");
  const [date, setDate]           = useState("");
  const [time, setTime]           = useState("");
  const [price, setPrice]         = useState("");
  const [capacity, setCapacity]   = useState("");
  const [desc, setDesc]           = useState("");
  const [type, setType]           = useState("dinner");
  const [posted, setPosted]       = useState(false);

  const valid = title.trim() && venue.trim() && date.trim() && desc.trim();

  const TYPES = [
    { k: "dinner",   l: "Dinner" },
    { k: "museum",   l: "Museum" },
    { k: "brunch",   l: "Brunch" },
    { k: "club",     l: "Club Night" },
    { k: "workshop", l: "Workshop" },
    { k: "other",    l: "Other" },
  ];

  if (posted) return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 400, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }} />
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 401, background: IVORY, borderRadius: "24px 24px 0 0", padding: "40px 24px 64px", textAlign: "center", boxShadow: "0 -12px 48px rgba(0,0,0,0.2)" }}>
        <div style={{ fontSize: 48, marginBottom: 14 }}>🌸</div>
        <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 26, color: INK, marginBottom: 8 }}>{title} is live.</p>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: 13, color: "#888", marginBottom: 28 }}>Bloomies in {city || "your city"} can now discover it.</p>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onClose} style={{ flex: 1, padding: "14px", background: "#F0EBE4", color: INK, border: "none", borderRadius: 14, fontFamily: "var(--font-jost)", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
            Back to Portal
          </button>
          <Link href="/member/happenings" onClick={onClose} style={{ flex: 1, padding: "14px", background: PINK, color: "white", border: "none", borderRadius: 14, fontFamily: "var(--font-jost)", fontWeight: 800, fontSize: 13, cursor: "pointer", textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center" }}>
            View it live →
          </Link>
        </div>
      </div>
    </>
  );

  const INPUT: React.CSSProperties = { width: "100%", padding: "13px 14px", borderRadius: 12, border: "1.5px solid #F0EBE4", background: "white", fontFamily: "var(--font-jost)", fontSize: 14, color: INK, outline: "none", boxSizing: "border-box" };
  const LABEL: React.CSSProperties = { fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 800, letterSpacing: "0.15em", color: "#bbb", marginBottom: 6, display: "block" };

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 400, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }} />
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 401, background: IVORY, borderRadius: "24px 24px 0 0", maxHeight: "93vh", overflowY: "auto", boxShadow: "0 -12px 48px rgba(0,0,0,0.22)" }}>
        <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 4px" }}>
          <div style={{ width: 36, height: 4, borderRadius: 999, background: "rgba(0,0,0,0.1)" }} />
        </div>
        <div style={{ padding: "12px 20px 64px", display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 800, letterSpacing: "0.2em", color: PINK }}>NEW HAPPENING · HQ</p>
              <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 22, color: INK, marginTop: 2 }}>Create a happening.</p>
            </div>
            <button onClick={onClose} style={{ background: "rgba(0,0,0,0.07)", border: "none", borderRadius: "50%", width: 32, height: 32, cursor: "pointer", fontSize: 18 }}>×</button>
          </div>

          {/* Type */}
          <div>
            <label style={LABEL}>TYPE</label>
            <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
              {TYPES.map(t => (
                <button key={t.k} onClick={() => setType(t.k)} style={{ padding: "8px 14px", border: `1.5px solid ${type === t.k ? PINK : "#F0EBE4"}`, background: type === t.k ? "#FFF0F5" : "white", color: type === t.k ? PINK : "#666", borderRadius: 999, fontFamily: "var(--font-jost)", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>
                  {t.l}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label style={LABEL}>TITLE</label>
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Dinner Society: June Edition" style={INPUT} />
          </div>

          {/* Venue */}
          <div>
            <label style={LABEL}>VENUE</label>
            <input value={venue} onChange={e => setVenue(e.target.value)} placeholder="Carbone · West Village" style={INPUT} />
          </div>

          {/* City + Neighborhood */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div>
              <label style={LABEL}>CITY</label>
              <input value={city} onChange={e => setCity(e.target.value)} placeholder="New York City" style={INPUT} />
            </div>
            <div>
              <label style={LABEL}>NEIGHBORHOOD</label>
              <input value={hood} onChange={e => setHood(e.target.value)} placeholder="West Village" style={INPUT} />
            </div>
          </div>

          {/* Date + Time */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div>
              <label style={LABEL}>DATE</label>
              <input value={date} onChange={e => setDate(e.target.value)} placeholder="Jun 21, 2026" style={INPUT} />
            </div>
            <div>
              <label style={LABEL}>TIME</label>
              <input value={time} onChange={e => setTime(e.target.value)} placeholder="7:00 PM" style={INPUT} />
            </div>
          </div>

          {/* Price + Capacity */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div>
              <label style={LABEL}>PRICE PER SEAT</label>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#888", fontFamily: "var(--font-jost)", fontSize: 14 }}>$</span>
                <input value={price} onChange={e => setPrice(e.target.value)} placeholder="65" type="number" style={{ ...INPUT, paddingLeft: 28 }} />
              </div>
            </div>
            <div>
              <label style={LABEL}>CAPACITY</label>
              <input value={capacity} onChange={e => setCapacity(e.target.value)} placeholder="20" type="number" style={INPUT} />
            </div>
          </div>

          {/* Description */}
          <div>
            <label style={LABEL}>DESCRIPTION</label>
            <textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="What's this happening about? Who's it for? What's the vibe?" rows={4} style={{ ...INPUT, resize: "none", lineHeight: 1.6 }} />
          </div>

          <button onClick={() => valid && setPosted(true)} style={{ width: "100%", padding: "16px", background: valid ? PINK : "#eee", color: valid ? "white" : "#bbb", border: "none", borderRadius: 14, fontFamily: "var(--font-jost)", fontSize: 13, fontWeight: 800, letterSpacing: "0.04em", cursor: valid ? "pointer" : "default", boxShadow: valid ? `0 3px 0 rgba(150,0,55,0.7), 0 6px 20px ${PINK}44` : "none", transition: "all 0.2s" }}>
            Publish happening ✦
          </button>
        </div>
      </div>
    </>
  );
}

// ── Happening Row ─────────────────────────────────────────────────────────────

function HappeningRow({ h }: { h: typeof RECENT_HAPPENINGS[0] }) {
  const pct = Math.round((h.rsvps / h.capacity) * 100);
  const full = h.rsvps >= h.capacity;
  return (
    <Link href={`/member/happenings/${h.id}`} style={{ textDecoration: "none", display: "block", background: "white", borderRadius: 16, padding: "14px 16px", boxShadow: "0 2px 10px rgba(0,0,0,0.04)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
        <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 15, fontWeight: 700, color: INK, flex: 1, lineHeight: 1.2 }}>{h.title}</p>
        <span style={{ fontFamily: "var(--font-jost)", fontSize: 8, fontWeight: 800, letterSpacing: "0.12em", color: h.status === "past" ? "#bbb" : PINK, background: h.status === "past" ? "#F5F5F5" : "#FFF0F5", borderRadius: 999, padding: "3px 8px", marginLeft: 8, flexShrink: 0 }}>
          {h.status === "past" ? "PAST" : "UPCOMING"}
        </span>
      </div>
      <p style={{ fontFamily: "var(--font-jost)", fontSize: 11, color: "#888", marginBottom: 10 }}>{h.venue} · {h.date}</p>

      {/* RSVP bar */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ flex: 1, height: 4, background: "#F0F0F0", borderRadius: 999, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${pct}%`, background: full ? "#22C55E" : PINK, borderRadius: 999, transition: "width 0.4s ease" }} />
        </div>
        <span style={{ fontFamily: "var(--font-jost)", fontSize: 10, fontWeight: 700, color: full ? "#22C55E" : INK, flexShrink: 0 }}>
          {h.rsvps}/{h.capacity} {full ? "· Full" : ""}
        </span>
      </div>
    </Link>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export function FounderPortalPage() {
  const [showCreate, setShowCreate] = useState(false);

  return (
    <div style={{ minHeight: "100dvh", background: IVORY }}>

      {/* ── Header ── */}
      <div style={{ background: `linear-gradient(160deg, ${PLUM} 0%, #3C0E22 100%)`, padding: "52px 20px 28px", position: "relative", overflow: "hidden" }}>
        {/* Radial glow */}
        <div style={{ position: "absolute", top: -60, right: -60, width: 240, height: 240, borderRadius: "50%", background: `radial-gradient(circle, ${PINK}18 0%, transparent 70%)`, pointerEvents: "none" }} />

        <Link href="/member/you" style={{ display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 20, textDecoration: "none" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2.5" strokeLinecap="round"><path d="M15 18l-6-6 6-6" /></svg>
          <span style={{ fontFamily: "var(--font-jost)", fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.4)", letterSpacing: "0.12em" }}>YOUR PROFILE</span>
        </Link>

        {/* Bloomie #1 badge */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: `${PINK}22`, border: `1px solid ${PINK}44`, borderRadius: 999, padding: "5px 12px", marginBottom: 14 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: PINK }} />
          <span style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 800, letterSpacing: "0.15em", color: PINK }}>BLOOMIE #1 · FOUNDER</span>
        </div>

        <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 28, color: "white", lineHeight: 1.1, marginBottom: 6 }}>
          BloomBay HQ
        </p>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
          Create happenings. Build the city women want.
        </p>
      </div>

      {/* ── Stats ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, padding: "20px 16px 0" }}>
        {STATS.map(s => (
          <div key={s.label} style={{ background: "white", borderRadius: 16, padding: "16px", boxShadow: "0 2px 10px rgba(0,0,0,0.04)" }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 30, fontWeight: 900, color: s.value === "1" ? PINK : INK, lineHeight: 1 }}>{s.value}</p>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 11, fontWeight: 700, color: INK, marginTop: 3 }}>{s.label}</p>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 10, color: "#bbb", marginTop: 1 }}>{s.sub}</p>
          </div>
        ))}
      </div>

      {/* ── Create CTA ── */}
      <div style={{ padding: "20px 16px 0" }}>
        <button
          onClick={() => setShowCreate(true)}
          style={{
            width: "100%", padding: "18px",
            background: PINK, color: "white", border: "none",
            borderRadius: 16, cursor: "pointer",
            fontFamily: "var(--font-jost)", fontSize: 14, fontWeight: 800,
            letterSpacing: "0.04em",
            boxShadow: `0 3px 0 rgba(150,0,55,0.7), 0 8px 24px ${PINK}44`,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
          Create a happening
        </button>
      </div>

      {/* ── Quick actions ── */}
      <div style={{ display: "flex", gap: 10, padding: "12px 16px 0", overflowX: "auto", scrollbarWidth: "none" }}>
        {[
          { label: "Manage Clubs",   href: "/member/clubs",       icon: "👥" },
          { label: "City Guide",     href: "/member/city",        icon: "🏙" },
          { label: "All Bloomies",   href: "/member/introductions", icon: "✦" },
          { label: "Bloom Trails",   href: "/member/lounge/memories", icon: "🌸" },
        ].map(a => (
          <Link key={a.href} href={a.href} style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: 6, background: "white", borderRadius: 12, padding: "10px 14px", textDecoration: "none", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
            <span style={{ fontSize: 14 }}>{a.icon}</span>
            <span style={{ fontFamily: "var(--font-jost)", fontSize: 11, fontWeight: 700, color: INK, whiteSpace: "nowrap" }}>{a.label}</span>
          </Link>
        ))}
      </div>

      {/* ── Recent Happenings ── */}
      <div style={{ padding: "24px 16px 0" }}>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 800, letterSpacing: "0.22em", color: "#bbb", marginBottom: 12 }}>YOUR HAPPENINGS</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {RECENT_HAPPENINGS.map(h => <HappeningRow key={h.id} h={h} />)}
        </div>
      </div>

      {/* ── Yande note to founder ── */}
      <div style={{ margin: "24px 16px 100px", background: PLUM, borderRadius: 20, padding: "18px" }}>
        <p style={{ fontFamily: "var(--font-caveat)", fontSize: 16, color: "rgba(255,255,255,0.7)", lineHeight: 1.6, marginBottom: 8 }}>
          &ldquo;You&apos;re building something women have been waiting for. Every happening you create is a room that didn&apos;t exist before.&rdquo;
        </p>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 700, color: PINK, letterSpacing: "0.08em" }}>— Yande ✦</p>
      </div>

      {showCreate && <CreateSheet onClose={() => setShowCreate(false)} />}
    </div>
  );
}
