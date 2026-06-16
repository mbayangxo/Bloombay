"use client";

import { useState } from "react";
import Link from "next/link";

const PINK  = "#FF1F7D";
const PLUM  = "#1A0A2E";
const IVORY = "#fdf4ec";
const INK   = "#111111";

// ── Demo seat data ────────────────────────────────────────────────────────────

const SEAT = {
  happening: "Dinner Society: June Edition",
  venue: "Carbone",
  neighborhood: "West Village",
  date: "Saturday, June 21",
  time: "7:00 PM",
  table: "07",
  seat: "B",
  rsvpStatus: "CONFIRMED",
  price: 65,
  serviceFee: 5,
  total: 70,
  companions: [
    { initial: "M", color: "#FF1F7D",  name: "Maya K.",   chem: 94 },
    { initial: "A", color: "#C084FC",  name: "Amara D.",  chem: 88 },
    { initial: "L", color: "#FF69B4",  name: "Leila M.",  chem: 79 },
    { initial: "T", color: "#D97706",  name: "Tara L.",   chem: 85 },
  ],
  yandeNote: "You and Maya are 94% compatible — same clubs, same saved places. She's going to love that you're there.",
};

// ── Invite Sheet ──────────────────────────────────────────────────────────────

function InviteSheet({ onClose }: { onClose: () => void }) {
  const [sent, setSent] = useState(false);
  const candidates = [
    { initial: "Z", color: "#0EA5E9", name: "Zara F.", chem: 91, clubs: ["Museum Girls", "Dinner Society"] },
    { initial: "N", color: "#8B5CF6", name: "Naomi B.", chem: 83, clubs: ["Girl Tech Collective"] },
    { initial: "F", color: "#FF69B4", name: "Fatima A.", chem: 76, clubs: ["African Girls Club"] },
  ];

  return (
    <>
      <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 300, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }} />
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 301, background: IVORY, borderRadius: "24px 24px 0 0", maxHeight: "85vh", overflowY: "auto", boxShadow: "0 -12px 48px rgba(0,0,0,0.22)" }}>
        <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 4px" }}>
          <div style={{ width: 36, height: 4, borderRadius: 999, background: "rgba(0,0,0,0.1)" }} />
        </div>
        <div style={{ padding: "14px 20px 56px" }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 800, letterSpacing: "0.2em", color: PINK, marginBottom: 4 }}>INVITE A BLOOMIE</p>
          <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 22, color: INK, marginBottom: 4 }}>Who should sit with you?</p>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: 12, color: "#888", marginBottom: 20 }}>Yande picked Bloomies who&apos;d fit well at your table.</p>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {candidates.map(c => (
              <div key={c.initial} style={{ display: "flex", alignItems: "center", gap: 12, background: "white", borderRadius: 16, padding: "14px 16px", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
                <div style={{ width: 44, height: 44, borderRadius: "50%", background: `linear-gradient(135deg, ${c.color}, ${c.color}BB)`, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 800, fontSize: 16, flexShrink: 0 }}>{c.initial}</div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: 13, fontWeight: 700, color: INK }}>{c.name}</p>
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: 10, color: "#aaa" }}>{c.clubs.join(" · ")}</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: 13, fontWeight: 900, color: PINK }}>{c.chem}%</p>
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: 8, color: "#bbb" }}>match</p>
                </div>
                <button
                  onClick={() => setSent(true)}
                  style={{ padding: "8px 14px", background: sent ? "#F0F0F0" : PINK, color: sent ? "#bbb" : "white", border: "none", borderRadius: 999, fontFamily: "var(--font-jost)", fontSize: 10, fontWeight: 800, cursor: "pointer", flexShrink: 0 }}
                >
                  {sent ? "Sent ✦" : "Invite"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export function SeatConfirmationPage() {
  const [showInvite, setShowInvite] = useState(false);
  const s = SEAT;

  return (
    <div style={{ minHeight: "100dvh", background: IVORY }}>

      {/* ── Header ── */}
      <div style={{ background: `linear-gradient(160deg, ${PLUM} 0%, #2E0A1C 100%)`, padding: "52px 20px 28px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -40, right: -40, width: 200, height: 200, borderRadius: "50%", background: `radial-gradient(circle, ${PINK}14 0%, transparent 70%)`, pointerEvents: "none" }} />

        <Link href="/member/happenings" style={{ display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 18, textDecoration: "none" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2.5" strokeLinecap="round"><path d="M15 18l-6-6 6-6" /></svg>
          <span style={{ fontFamily: "var(--font-jost)", fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.4)", letterSpacing: "0.12em" }}>HAPPENINGS</span>
        </Link>

        <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 800, letterSpacing: "0.22em", color: PINK, marginBottom: 6 }}>✦ YOU&apos;RE GOING</p>
        <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 26, color: "white", lineHeight: 1.1, marginBottom: 4 }}>{s.happening}</p>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: 12, color: "rgba(255,255,255,0.4)" }}>{s.venue} · {s.neighborhood}</p>
      </div>

      <div style={{ padding: "20px 16px 100px", display: "flex", flexDirection: "column", gap: 14 }}>

        {/* ── Ticket stub ── */}
        <div style={{ background: "white", borderRadius: 20, overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
          {/* Ticket top */}
          <div style={{ background: `linear-gradient(135deg, ${PLUM} 0%, #2E0A1C 100%)`, padding: "20px 20px 0", position: "relative" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
              <div>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: 8, fontWeight: 800, letterSpacing: "0.2em", color: "rgba(255,255,255,0.4)", marginBottom: 4 }}>TABLE</p>
                <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 52, fontWeight: 900, color: "white", lineHeight: 1 }}>{s.table}</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: 8, fontWeight: 800, letterSpacing: "0.2em", color: "rgba(255,255,255,0.4)", marginBottom: 4 }}>SEAT</p>
                <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 52, fontWeight: 900, color: PINK, lineHeight: 1 }}>{s.seat}</p>
              </div>
            </div>

            <div style={{ display: "flex", gap: 20, paddingBottom: 20 }}>
              {[
                { label: "DATE",   value: s.date },
                { label: "TIME",   value: s.time },
                { label: "STATUS", value: s.rsvpStatus },
              ].map(d => (
                <div key={d.label}>
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: 8, fontWeight: 700, letterSpacing: "0.12em", color: "rgba(255,255,255,0.35)", marginBottom: 2 }}>{d.label}</p>
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: 12, fontWeight: 800, color: d.label === "STATUS" ? "#22C55E" : "white" }}>{d.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Tear line */}
          <div style={{ display: "flex", alignItems: "center", position: "relative" }}>
            <div style={{ width: 20, height: 20, borderRadius: "50%", background: IVORY, marginLeft: -10, flexShrink: 0 }} />
            <div style={{ flex: 1, borderTop: "2px dashed #F0EBE4" }} />
            <div style={{ width: 20, height: 20, borderRadius: "50%", background: IVORY, marginRight: -10, flexShrink: 0 }} />
          </div>

          {/* Ticket bottom — who you'll be with */}
          <div style={{ padding: "16px 20px 20px" }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 8, fontWeight: 800, letterSpacing: "0.18em", color: "#bbb", marginBottom: 12 }}>WHO YOU&apos;LL BE WITH</p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {s.companions.map(c => (
                <div key={c.initial} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                  <div style={{ position: "relative" }}>
                    <div style={{ width: 42, height: 42, borderRadius: "50%", background: `linear-gradient(135deg, ${c.color}, ${c.color}BB)`, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 800, fontSize: 15 }}>{c.initial}</div>
                    <div style={{ position: "absolute", bottom: -2, right: -2, background: PINK, borderRadius: 999, padding: "1px 4px", border: "1.5px solid white" }}>
                      <span style={{ fontFamily: "var(--font-jost)", fontSize: 7, fontWeight: 800, color: "white" }}>{c.chem}%</span>
                    </div>
                  </div>
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, color: "#888", whiteSpace: "nowrap" }}>{c.name.split(" ")[0]}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Yande note ── */}
        <div style={{ background: PLUM, borderRadius: 18, padding: "16px" }}>
          <p style={{ fontFamily: "var(--font-caveat)", fontSize: 15, color: "rgba(255,255,255,0.75)", lineHeight: 1.6, marginBottom: 6 }}>
            &ldquo;{s.yandeNote}&rdquo;
          </p>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 700, color: PINK, letterSpacing: "0.08em" }}>— Yande ✦</p>
        </div>

        {/* ── Payment breakdown ── */}
        <div style={{ background: "white", borderRadius: 18, padding: "16px", boxShadow: "0 2px 10px rgba(0,0,0,0.04)" }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 800, letterSpacing: "0.18em", color: "#bbb", marginBottom: 12 }}>PAYMENT</p>
          {[
            { label: "Seat price",   value: `$${s.price}` },
            { label: "Service fee",  value: `$${s.serviceFee}` },
          ].map(r => (
            <div key={r.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: 13, color: "#666" }}>{r.label}</p>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: 13, color: INK }}>{r.value}</p>
            </div>
          ))}
          <div style={{ height: 1, background: "#F0EBE4", margin: "10px 0" }} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 14, fontWeight: 800, color: INK }}>Total paid</p>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 18, fontWeight: 900, color: PINK }}>${s.total}</p>
          </div>
        </div>

        {/* ── CTAs ── */}
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={() => setShowInvite(true)}
            style={{ flex: 1, padding: "16px", background: PINK, color: "white", border: "none", borderRadius: 14, fontFamily: "var(--font-jost)", fontSize: 13, fontWeight: 800, letterSpacing: "0.04em", cursor: "pointer", boxShadow: `0 3px 0 rgba(150,0,55,0.7), 0 6px 20px ${PINK}44` }}
          >
            Invite a Bloomie
          </button>
          <button
            style={{ flex: 1, padding: "16px", background: "white", color: INK, border: "1.5px solid #F0EBE4", borderRadius: 14, fontFamily: "var(--font-jost)", fontSize: 13, fontWeight: 700, cursor: "pointer" }}
          >
            Modify seat
          </button>
        </div>

        {/* Plan Room link */}
        <Link href="/member/happenings/1/plan" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "white", borderRadius: 14, padding: "14px 16px", textDecoration: "none", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 18 }}>🗓</span>
            <div>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: 13, fontWeight: 700, color: INK }}>Plan Room</p>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: 10, color: "#bbb" }}>Coordinate with your table</p>
            </div>
          </div>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ddd" strokeWidth="2.5" strokeLinecap="round"><path d="M9 18l6-6-6-6" /></svg>
        </Link>
      </div>

      {showInvite && <InviteSheet onClose={() => setShowInvite(false)} />}
    </div>
  );
}
