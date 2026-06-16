"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

const PINK = "#FF1F7D";
const CREAM = "#FAF6F0";
const GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='200' height='200' fill='%23000' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E")`;

type InvitePhase =
  | "sealed"
  | "opening"
  | "reading"
  | "declining"
  | "declined"
  | "accepting"
  | "ticket";

// ── Invitation data ────────────────────────────────────────────────────────────

export const INVITATION_DATA: Record<string, {
  id: string; tag: string; tagColor: string; event: string;
  from: string; fromFull: string; fromInitial: string; fromColor: string;
  venue: string; time: string; date: string; seatsRemaining: number;
  price: string; isFree: boolean; type: "private" | "public";
  note: string; dresscode?: string;
  guests: { name: string; initial: string; color: string }[];
  sentAt: string;
}> = {
  "1": {
    id: "1", tag: "TONIGHT", tagColor: PINK,
    event: "Girls Dinner · Carbone",
    from: "Aminah", fromFull: "Aminah M.", fromInitial: "Am", fromColor: "#FF69B4",
    venue: "Carbone · 181 Thompson St, SoHo", time: "7:30 PM", date: "Tonight",
    seatsRemaining: 2, price: "Individual pay", isFree: true, type: "private",
    dresscode: "All Black",
    note: "I saved you a seat. I hope you can make it — it's going to be one of those nights.",
    guests: [
      { name: "Aminah", initial: "Am", color: "#FF69B4" },
      { name: "Sofia", initial: "S", color: PINK },
      { name: "Kezia", initial: "K", color: "#C084FC" },
    ],
    sentAt: "2 hours ago",
  },
  "2": {
    id: "2", tag: "SUNDAY", tagColor: "#83C5A0",
    event: "Pilates + Matcha Morning",
    from: "Sofia", fromFull: "Sofia K.", fromInitial: "S", fromColor: PINK,
    venue: "Studio Bloom · Williamsburg", time: "9:00 AM", date: "Sunday",
    seatsRemaining: 3, price: "$20", isFree: false, type: "public",
    note: "Come move with us. You'll start Sunday right — I promise.",
    guests: [
      { name: "Sofia", initial: "S", color: PINK },
      { name: "Maya", initial: "Ma", color: "#FF69B4" },
      { name: "Jade", initial: "J", color: PINK },
    ],
    sentAt: "Yesterday",
  },
  "3": {
    id: "3", tag: "SATURDAY", tagColor: "#EC4899",
    event: "MoMA + Froyo After",
    from: "Girl Creatives", fromFull: "Girl Creatives Club", fromInitial: "GC", fromColor: "#EC4899",
    venue: "MoMA · 11 W 53rd St, Midtown", time: "2:00 PM", date: "Saturday",
    seatsRemaining: 5, price: "$1 deposit", isFree: false, type: "public",
    note: "We're going as a group. Art, conversation, froyo after. You'd fit right in.",
    guests: [
      { name: "Yemi", initial: "Y", color: "#EC4899" },
      { name: "Amara", initial: "A", color: "#FF69B4" },
      { name: "Nadia", initial: "N", color: PINK },
    ],
    sentAt: "3 days ago",
  },
};

// ── Wax seal ──────────────────────────────────────────────────────────────────

function WaxSeal({ size = 72, cracked = false }: { size?: number; cracked?: boolean }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: "radial-gradient(circle at 38% 32%, #E8006A, #9A0040)",
      boxShadow: "0 6px 24px rgba(170,0,72,0.5), inset 0 1px 2px rgba(255,255,255,0.22)",
      display: "flex", alignItems: "center", justifyContent: "center",
      position: "relative", flexShrink: 0,
      transition: "transform 0.3s, opacity 0.3s",
      transform: cracked ? "scale(0.4) rotate(25deg)" : "scale(1)",
      opacity: cracked ? 0 : 1,
    }}>
      <div style={{ position: "absolute", inset: 4, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.2)" }} />
      <div style={{ display: "flex", alignItems: "center", gap: 0, position: "relative" }}>
        <span style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900, fontSize: size * 0.28, color: "rgba(255,255,255,0.9)", lineHeight: 1, letterSpacing: -1 }}>B</span>
        <span style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900, fontSize: size * 0.28, color: "rgba(255,255,255,0.9)", lineHeight: 1, display: "inline-block", transform: "scaleX(-1)", letterSpacing: -1 }}>B</span>
      </div>
    </div>
  );
}

// ── Physical envelope ─────────────────────────────────────────────────────────

function Envelope({ invite, sealCracked, cardRising }: {
  invite: typeof INVITATION_DATA[string];
  sealCracked: boolean;
  cardRising: boolean;
}) {
  return (
    <div style={{ position: "relative", width: "100%", maxWidth: 340, margin: "0 auto" }}>
      {/* Paper stack behind — gives depth */}
      <div style={{
        position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%) rotate(2.5deg)",
        width: "94%", height: "88%", borderRadius: 12,
        background: `${GRAIN}, #FFECF4`,
        backgroundSize: "200px 200px, auto",
        boxShadow: "0 8px 32px rgba(255,31,125,0.12)",
        zIndex: 0,
      }} />
      <div style={{
        position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%) rotate(-1.5deg)",
        width: "96%", height: "86%", borderRadius: 12,
        background: `${GRAIN}, #FFF5F8`,
        backgroundSize: "200px 200px, auto",
        boxShadow: "0 6px 24px rgba(255,31,125,0.08)",
        zIndex: 1,
      }} />

      {/* Main envelope body */}
      <div style={{
        position: "relative", zIndex: 2,
        borderRadius: 14, overflow: "visible",
        boxShadow: "0 24px 64px rgba(200,0,80,0.22), 0 4px 16px rgba(0,0,0,0.1)",
      }}>
        {/* Envelope body */}
        <div style={{
          borderRadius: 14, overflow: "hidden",
          background: `${GRAIN}, linear-gradient(160deg, #FF5BAD 0%, #FF1F7D 60%, #E0006A 100%)`,
          backgroundSize: "200px 200px, auto",
          position: "relative",
        }}>
          {/* Inside lining (visible at flap fold) */}
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, height: 48,
            background: "linear-gradient(180deg, rgba(255,255,255,0.12), transparent)",
            zIndex: 1,
          }} />

          {/* Top flap — V shape that "opens" */}
          <div style={{
            position: "relative", zIndex: 3,
            transition: "transform 0.7s cubic-bezier(0.34,1.1,0.64,1)",
            transformOrigin: "top center",
            transform: sealCracked ? "scaleY(-1)" : "scaleY(1)",
          }}>
            <svg width="100%" height="80" viewBox="0 0 340 80" preserveAspectRatio="none" style={{ display: "block" }}>
              <polygon points="0,0 340,0 170,80" fill="#E0005A" />
              <polygon points="0,0 340,0 170,80" fill="rgba(0,0,0,0.08)" />
              {/* Inner fold line */}
              <line x1="0" y1="0" x2="170" y2="80" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
              <line x1="340" y1="0" x2="170" y2="80" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
            </svg>
          </div>

          {/* Card peeks up when rising */}
          {cardRising && (
            <div style={{
              position: "absolute", top: 20, left: "50%",
              transform: "translateX(-50%)",
              width: "78%", zIndex: 4,
              animation: "cardPeek 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards",
            }}>
              <div style={{
                background: `${GRAIN}, ${CREAM}`,
                backgroundSize: "200px 200px, auto",
                borderRadius: 8, height: 40,
                border: "1px solid rgba(255,31,125,0.1)",
                boxShadow: "0 -4px 16px rgba(0,0,0,0.12)",
              }} />
            </div>
          )}

          {/* Body content */}
          <div style={{
            padding: "0 28px 36px", position: "relative", zIndex: 2, marginTop: -4,
          }}>
            {/* Horizontal diamond pattern */}
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 14, marginTop: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 1, height: 16, background: "rgba(255,255,255,0.2)" }} />
                <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 8 }}>✦</span>
                <div style={{ width: 40, height: 1, background: "rgba(255,255,255,0.2)" }} />
                <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 8 }}>✦</span>
                <div style={{ width: 1, height: 16, background: "rgba(255,255,255,0.2)" }} />
              </div>
            </div>

            {/* BB mark */}
            <div style={{ textAlign: "center", marginBottom: 16 }}>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 900, letterSpacing: "0.38em", color: "rgba(255,255,255,0.5)" }}>BLOOMBAY</p>
            </div>

            {/* Wax seal */}
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
              <WaxSeal size={68} cracked={sealCracked} />
            </div>

            {/* Sender chip */}
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
              <div style={{
                background: "rgba(255,255,255,0.14)", borderRadius: 999,
                padding: "6px 16px 6px 8px", border: "1px solid rgba(255,255,255,0.2)",
                display: "flex", alignItems: "center", gap: 8,
              }}>
                <div style={{
                  width: 26, height: 26, borderRadius: "50%",
                  background: `linear-gradient(135deg, ${invite.fromColor}, ${invite.fromColor}99)`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 9, fontWeight: 800, color: "white",
                  boxShadow: `0 2px 8px ${invite.fromColor}55`,
                }}>{invite.fromInitial}</div>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.9)" }}>from {invite.fromFull}</p>
              </div>
            </div>

            <p style={{ textAlign: "center", fontFamily: "var(--font-caveat)", fontSize: 14, color: "rgba(255,255,255,0.55)", marginTop: 6 }}>
              sealed with care · {invite.sentAt}
            </p>
          </div>

          {/* Bottom V */}
          <svg width="100%" height="40" viewBox="0 0 340 40" preserveAspectRatio="none" style={{ display: "block", marginTop: -1 }}>
            <polygon points="0,40 340,40 170,0" fill="#C8005A" />
          </svg>
        </div>
      </div>
    </div>
  );
}

// ── Invitation card (the real stationery) ──────────────────────────────────────

function InvitationCard({ invite, onAccept, onDecline }: {
  invite: typeof INVITATION_DATA[string];
  onAccept: () => void;
  onDecline: () => void;
}) {
  return (
    <div style={{
      position: "relative",
      animation: "cardReveal 0.55s cubic-bezier(0.34,1.56,0.64,1) forwards",
    }}>
      {/* Paper layers behind */}
      <div style={{
        position: "absolute", inset: 0, borderRadius: 20,
        background: "#FFF0F8", transform: "rotate(1.8deg)",
        boxShadow: "0 8px 32px rgba(255,31,125,0.1)", zIndex: 0,
      }} />
      <div style={{
        position: "absolute", inset: 0, borderRadius: 20,
        background: "#FFF8FB", transform: "rotate(-0.8deg)",
        boxShadow: "0 6px 20px rgba(255,31,125,0.07)", zIndex: 1,
      }} />

      {/* Main card */}
      <div style={{
        position: "relative", zIndex: 2,
        borderRadius: 20, overflow: "hidden",
        background: `${GRAIN}, ${CREAM}`,
        backgroundSize: "200px 200px, auto",
        boxShadow: "0 20px 60px rgba(0,0,0,0.18), 0 4px 12px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.9)",
        border: "1px solid rgba(255,31,125,0.08)",
      }}>
        {/* Top decorative border strip */}
        <div style={{
          height: 5,
          background: `repeating-linear-gradient(90deg, ${PINK} 0px, ${PINK} 6px, transparent 6px, transparent 10px)`,
          opacity: 0.6,
        }} />

        <div style={{ padding: "24px 26px 28px" }}>
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 900, letterSpacing: "0.38em", color: "rgba(0,0,0,0.25)", marginBottom: 6 }}>BLOOMBAY PRESENTS</p>
            {/* Thin decorative rule */}
            <div style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "center", marginBottom: 12 }}>
              <div style={{ flex: 1, height: 1, background: "rgba(255,31,125,0.15)" }} />
              <span style={{ color: "rgba(255,31,125,0.35)", fontSize: 9 }}>✦</span>
              <div style={{ flex: 1, height: 1, background: "rgba(255,31,125,0.15)" }} />
            </div>
            <div style={{ display: "inline-flex", background: `${invite.tagColor}12`, border: `1px solid ${invite.tagColor}30`, borderRadius: 99, padding: "4px 12px", marginBottom: 10 }}>
              <span style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 900, letterSpacing: "0.22em", color: invite.tagColor }}>{invite.tag}</span>
            </div>
            <h2 style={{
              fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 700,
              fontSize: "clamp(20px,5vw,26px)", color: "rgba(0,0,0,0.88)",
              lineHeight: 1.15, marginBottom: 4,
            }}>{invite.event}</h2>
            <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 12, color: "rgba(0,0,0,0.38)" }}>{invite.venue}</p>
          </div>

          {/* Details row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 20 }}>
            {[
              { label: "DATE", value: invite.date },
              { label: "TIME", value: invite.time },
              { label: "PRICE", value: invite.price, pink: !invite.isFree },
            ].map(({ label, value, pink }) => (
              <div key={label} style={{
                background: "rgba(255,31,125,0.04)",
                border: "1px solid rgba(255,31,125,0.08)",
                borderRadius: 10, padding: "10px 8px", textAlign: "center",
              }}>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.2em", color: "rgba(0,0,0,0.28)", marginBottom: 3 }}>{label}</p>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: 11, fontWeight: 700, color: pink ? PINK : "rgba(0,0,0,0.72)" }}>{value}</p>
              </div>
            ))}
          </div>

          {invite.dresscode && (
            <div style={{ textAlign: "center", marginBottom: 16 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#1C1B1C", borderRadius: 99, padding: "6px 14px" }}>
                <span style={{ fontSize: 10 }}>🖤</span>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, color: "rgba(255,255,255,0.7)", letterSpacing: "0.14em" }}>DRESS CODE: {invite.dresscode.toUpperCase()}</p>
              </div>
            </div>
          )}

          {/* Who's going */}
          <div style={{ marginBottom: 18 }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.22em", color: "rgba(0,0,0,0.28)", marginBottom: 10 }}>WHO&apos;S GOING</p>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {invite.guests.map(g => (
                <div key={g.name} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                  <div style={{
                    width: 34, height: 34, borderRadius: "50%",
                    background: `linear-gradient(135deg, ${g.color}, ${g.color}BB)`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: g.initial.length > 1 ? 9 : 12, fontWeight: 800, color: "white",
                    boxShadow: `0 3px 12px ${g.color}44`,
                    border: "2px solid white",
                  }}>{g.initial}</div>
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", color: "rgba(0,0,0,0.35)" }}>{g.name}</p>
                </div>
              ))}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                <div style={{
                  width: 34, height: 34, borderRadius: "50%",
                  background: `${PINK}0C`, border: `1.5px dashed ${PINK}55`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <span style={{ color: PINK, fontSize: 16, lineHeight: 1, fontWeight: 300 }}>+</span>
                </div>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", color: "rgba(0,0,0,0.28)" }}>You?</p>
              </div>
            </div>
          </div>

          {/* Note from sender */}
          <div style={{
            background: `${invite.fromColor}08`,
            border: `1px solid ${invite.fromColor}18`,
            borderRadius: 14, padding: "14px 16px", marginBottom: 22,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <div style={{
                width: 28, height: 28, borderRadius: "50%",
                background: `linear-gradient(135deg, ${invite.fromColor}, ${invite.fromColor}BB)`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 9, fontWeight: 800, color: "white", flexShrink: 0,
              }}>{invite.fromInitial}</div>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: 11, fontWeight: 700, color: "rgba(0,0,0,0.72)" }}>{invite.fromFull}</p>
            </div>
            <p style={{ fontFamily: "var(--font-caveat)", fontSize: 15, color: "rgba(0,0,0,0.58)", lineHeight: 1.6, fontStyle: "italic" }}>
              &ldquo;{invite.note}&rdquo;
            </p>
          </div>

          {/* Perforated divider */}
          <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 22 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#FFF0F8", border: "1px solid rgba(255,31,125,0.1)", flexShrink: 0 }} />
            <div style={{ flex: 1, borderTop: "1.5px dashed rgba(255,31,125,0.15)" }} />
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#FFF0F8", border: "1px solid rgba(255,31,125,0.1)", flexShrink: 0 }} />
          </div>

          {/* RSVP buttons */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <button
              onClick={onAccept}
              style={{
                width: "100%", padding: "16px 0", borderRadius: 50,
                background: `linear-gradient(135deg, ${PINK}, #E0005A)`,
                color: "white", fontSize: 13, fontWeight: 800,
                letterSpacing: "0.06em", border: "none", cursor: "pointer",
                boxShadow: `0 6px 24px ${PINK}44, inset 0 1px 0 rgba(255,255,255,0.2)`,
              }}
            >
              {invite.isFree ? "I'm in — count me!" : `Reserve My Spot · ${invite.price}`}
            </button>
            <button
              onClick={onDecline}
              style={{
                width: "100%", padding: "14px 0", borderRadius: 50,
                background: "transparent", color: "rgba(0,0,0,0.38)",
                fontSize: 12, fontWeight: 600,
                border: "1.5px solid rgba(0,0,0,0.1)", cursor: "pointer",
              }}
            >
              I&apos;m sorry, I can&apos;t make it
            </button>
          </div>

          {/* Footer */}
          <div style={{ marginTop: 18, textAlign: "center" }}>
            <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 14, color: "rgba(255,31,125,0.4)" }}>BloomBay ✦</p>
          </div>
        </div>

        {/* Bottom decorative border */}
        <div style={{
          height: 5,
          background: `repeating-linear-gradient(90deg, ${PINK} 0px, ${PINK} 6px, transparent 6px, transparent 10px)`,
          opacity: 0.6,
        }} />
      </div>
    </div>
  );
}

// ── Decline note sheet ────────────────────────────────────────────────────────

function DeclineSheet({ invite, onSend, onCancel }: {
  invite: typeof INVITATION_DATA[string];
  onSend: () => void;
  onCancel: () => void;
}) {
  const defaultNote = `Hi ${invite.from}! I'm so sorry, I can't make it — but thank you so much for thinking of me. I hope you all have the most amazing time! ♡`;
  const [note, setNote] = useState(defaultNote);

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 100,
      background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)",
      display: "flex", alignItems: "flex-end",
      animation: "fadeIn 0.2s ease",
    }} onClick={onCancel}>
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: "100%", borderRadius: "24px 24px 0 0",
          background: CREAM, padding: "28px 22px 40px",
          boxShadow: "0 -12px 48px rgba(0,0,0,0.18)",
          animation: "sheetUp 0.35s cubic-bezier(0.34,1.2,0.64,1)",
        }}
      >
        {/* Handle */}
        <div style={{ width: 36, height: 4, borderRadius: 99, background: "rgba(0,0,0,0.12)", margin: "0 auto 20px" }} />

        <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 700, fontSize: 20, color: "rgba(0,0,0,0.82)", marginBottom: 4 }}>
          Sending your apologies
        </p>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: 11, color: "rgba(0,0,0,0.4)", marginBottom: 18, lineHeight: 1.5 }}>
          A note will be sent to {invite.fromFull}
        </p>

        {/* Note card — looks like actual paper */}
        <div style={{
          borderRadius: 14, padding: "16px 16px",
          border: "1px solid rgba(255,31,125,0.1)",
          boxShadow: "0 4px 18px rgba(0,0,0,0.07), inset 0 1px 0 rgba(255,255,255,0.8)",
          marginBottom: 18,
          backgroundImage: `${GRAIN}, repeating-linear-gradient(transparent, transparent 25px, rgba(255,31,125,0.06) 26px)`,
          backgroundPosition: "0 0, 0 10px",
          backgroundSize: "200px 200px, 100% 26px",
          backgroundColor: "white",
        }}>
          <textarea
            value={note}
            onChange={e => setNote(e.target.value)}
            style={{
              width: "100%", background: "transparent", border: "none", outline: "none", resize: "none",
              fontFamily: "var(--font-caveat)", fontSize: 16, color: "#1C1B1C", lineHeight: "26px",
              minHeight: 104,
            }}
          />
        </div>

        <button
          onClick={onSend}
          style={{
            width: "100%", padding: "16px 0", borderRadius: 50,
            background: "#1C1B1C", color: "white", fontSize: 13,
            fontWeight: 800, letterSpacing: "0.06em", border: "none", cursor: "pointer",
            boxShadow: "0 6px 20px rgba(0,0,0,0.3)",
            marginBottom: 10,
          }}
        >
          Send My Apologies ✉
        </button>
        <button onClick={onCancel} style={{ width: "100%", background: "transparent", border: "none", padding: "10px", cursor: "pointer", fontFamily: "var(--font-jost)", fontSize: 12, color: "rgba(0,0,0,0.35)", fontWeight: 600 }}>
          Cancel
        </button>
      </div>
    </div>
  );
}

// ── Declined confirmation ─────────────────────────────────────────────────────

function DeclinedView({ invite, onBack }: { invite: typeof INVITATION_DATA[string]; onBack: () => void }) {
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      padding: "40px 28px", textAlign: "center",
      animation: "cardReveal 0.4s ease forwards",
    }}>
      {/* Envelope with sad droop */}
      <div style={{ marginBottom: 24 }}>
        <svg width="80" height="60" viewBox="0 0 80 60">
          <rect x="2" y="16" width="76" height="44" rx="6" fill="#FFB3D9"/>
          <polygon points="2,16 40,42 78,16" fill="#FF5BAD"/>
          <polygon points="2,60 78,60 78,16 40,42 2,16" fill="#FF8EC7"/>
          {/* Sad face on letter */}
          <circle cx="34" cy="38" r="2.5" fill="rgba(200,0,80,0.5)"/>
          <circle cx="46" cy="38" r="2.5" fill="rgba(200,0,80,0.5)"/>
          <path d="M35 46 Q40 42 45 46" stroke="rgba(200,0,80,0.5)" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        </svg>
      </div>
      <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 700, fontSize: 22, color: "rgba(0,0,0,0.78)", marginBottom: 6 }}>Your note was sent.</p>
      <p style={{ fontFamily: "var(--font-caveat)", fontSize: 15, color: "rgba(0,0,0,0.45)", marginBottom: 24, lineHeight: 1.6 }}>
        {invite.fromFull} will know you were thinking of them. Maybe next time ♡
      </p>
      <button
        onClick={onBack}
        style={{
          padding: "12px 28px", borderRadius: 50,
          background: "rgba(255,31,125,0.08)", color: PINK,
          border: `1.5px solid ${PINK}30`,
          fontSize: 12, fontWeight: 700, cursor: "pointer",
        }}
      >
        Back to Mailbox
      </button>
    </div>
  );
}

// ── Physical ticket ────────────────────────────────────────────────────────────

function Ticket({ invite }: { invite: typeof INVITATION_DATA[string] }) {
  const ticketNum = `BB${Date.now().toString().slice(-6)}`;
  const now = new Date();
  const issued = `${now.getDate()} ${["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][now.getMonth()]} ${now.getFullYear()}`;

  return (
    <div style={{
      position: "relative",
      animation: "ticketReveal 0.6s cubic-bezier(0.34,1.56,0.64,1) forwards",
    }}>
      {/* Ticket shadow layer */}
      <div style={{
        position: "absolute", inset: 0, borderRadius: 16,
        background: "rgba(0,0,0,0.12)", transform: "translateY(6px) rotate(0.5deg)",
        zIndex: 0,
      }} />

      {/* Main ticket */}
      <div style={{
        position: "relative", zIndex: 1,
        borderRadius: 16, overflow: "hidden",
        boxShadow: "0 16px 48px rgba(0,0,0,0.22), 0 2px 8px rgba(0,0,0,0.1)",
        display: "flex",
      }}>
        {/* LEFT STUB */}
        <div style={{
          width: 72, flexShrink: 0,
          background: `${GRAIN}, linear-gradient(180deg, #FF1F7D 0%, #C8005A 100%)`,
          backgroundSize: "200px 200px, auto",
          display: "flex", flexDirection: "column", alignItems: "center",
          justifyContent: "space-between", padding: "16px 8px",
          borderRight: "2px dashed rgba(255,255,255,0.4)",
          position: "relative",
        }}>
          {/* Cutout top */}
          <div style={{
            position: "absolute", top: -8, left: "50%", transform: "translateX(-50%)",
            width: 16, height: 16, borderRadius: "50%",
            background: "#FFF5F8",
          }} />
          {/* Cutout bottom */}
          <div style={{
            position: "absolute", bottom: -8, left: "50%", transform: "translateX(-50%)",
            width: 16, height: 16, borderRadius: "50%",
            background: "#FFF5F8",
          }} />

          {/* Vertical text */}
          <p style={{
            fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 900,
            letterSpacing: "0.22em", color: "rgba(255,255,255,0.7)",
            writingMode: "vertical-rl", textOrientation: "mixed",
            transform: "rotate(180deg)",
          }}>ADMIT ONE</p>

          {/* BB monogram */}
          <div style={{
            width: 36, height: 36, borderRadius: "50%",
            background: "rgba(255,255,255,0.15)",
            border: "1px solid rgba(255,255,255,0.3)",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}>
            <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900, fontSize: 12, color: "rgba(255,255,255,0.9)", lineHeight: 1, letterSpacing: -1 }}>BB</p>
          </div>

          {/* Barcode lines */}
          <div style={{ display: "flex", gap: 1.5, flexDirection: "column", alignItems: "center" }}>
            {Array.from({ length: 16 }).map((_, i) => (
              <div key={i} style={{
                height: 2, borderRadius: 1,
                width: i % 3 === 0 ? 32 : i % 2 === 0 ? 28 : 24,
                background: `rgba(255,255,255,${0.3 + Math.sin(i * 1.3) * 0.2})`,
              }} />
            ))}
          </div>

          <p style={{
            fontFamily: "var(--font-jost)", fontSize: "6px", fontWeight: 700,
            color: "rgba(255,255,255,0.5)", letterSpacing: "0.1em",
            writingMode: "vertical-rl", textOrientation: "mixed",
            transform: "rotate(180deg)",
          }}>{ticketNum}</p>
        </div>

        {/* RIGHT MAIN SECTION */}
        <div style={{
          flex: 1,
          background: `${GRAIN}, ${CREAM}`,
          backgroundSize: "200px 200px, auto",
          padding: "18px 18px 16px",
        }}>
          {/* Top row */}
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
            <div>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 900, letterSpacing: "0.3em", color: "rgba(255,31,125,0.5)", marginBottom: 2 }}>BLOOMBAY EVENT</p>
              <p style={{
                fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 700,
                fontSize: "clamp(14px,4vw,18px)", color: "#1C1B1C", lineHeight: 1.15,
              }}>{invite.event}</p>
            </div>
            {/* Stamp */}
            <div style={{
              width: 44, height: 44, borderRadius: "50%", flexShrink: 0,
              border: `2px solid ${PINK}40`,
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              background: `${PINK}08`,
              transform: "rotate(-8deg)",
            }}>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "5px", fontWeight: 900, color: PINK, letterSpacing: "0.2em", lineHeight: 1 }}>BLOOM</p>
              <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 9, fontWeight: 900, color: PINK, lineHeight: 1 }}>VIP</p>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "5px", fontWeight: 900, color: PINK, letterSpacing: "0.2em", lineHeight: 1 }}>MEMBER</p>
            </div>
          </div>

          {/* Divider rule */}
          <div style={{ borderTop: "1px solid rgba(255,31,125,0.1)", marginBottom: 10 }} />

          {/* Venue + time */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
            {[
              { label: "VENUE", value: invite.venue.split("·")[0].trim() },
              { label: "DATE & TIME", value: `${invite.date} · ${invite.time}` },
            ].map(({ label, value }) => (
              <div key={label}>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "6.5px", fontWeight: 800, letterSpacing: "0.18em", color: "rgba(0,0,0,0.28)", marginBottom: 2 }}>{label}</p>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: 10, fontWeight: 700, color: "rgba(0,0,0,0.72)", lineHeight: 1.3 }}>{value}</p>
              </div>
            ))}
          </div>

          {/* Guest name */}
          <div style={{ background: `${PINK}08`, borderRadius: 8, padding: "8px 10px", marginBottom: 10, border: `1px solid ${PINK}14` }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "6.5px", fontWeight: 800, letterSpacing: "0.18em", color: "rgba(255,31,125,0.5)", marginBottom: 1 }}>GUEST</p>
            <p style={{ fontFamily: "var(--font-caveat)", fontSize: 16, fontWeight: 700, color: "#1C1B1C" }}>You ✦</p>
          </div>

          {/* Footer */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "6.5px", color: "rgba(0,0,0,0.25)", letterSpacing: "0.12em" }}>ISSUED {issued}</p>
            <div style={{ display: "flex", gap: 2 }}>
              {Array.from({ length: 22 }).map((_, i) => (
                <div key={i} style={{ width: i % 4 === 0 ? 3 : 2, height: 14, background: `rgba(0,0,0,${0.12 + Math.cos(i) * 0.05})`, borderRadius: 1 }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Confetti petals ────────────────────────────────────────────────────────────

function ConfettiPetals() {
  const petals = [
    { top: "5%",  left: "12%", rotate: -15, delay: 0 },
    { top: "8%",  left: "70%", rotate: 30, delay: 0.1 },
    { top: "20%", left: "5%",  rotate: -40, delay: 0.2 },
    { top: "15%", left: "85%", rotate: 20, delay: 0.15 },
    { top: "35%", left: "90%", rotate: -25, delay: 0.25 },
    { top: "3%",  left: "45%", rotate: 10, delay: 0.05 },
  ];
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
      {petals.map((p, i) => (
        <div key={i} style={{
          position: "absolute", top: p.top, left: p.left,
          transform: `rotate(${p.rotate}deg)`,
          animation: `petalDrift 2s ease-in-out ${p.delay}s infinite alternate`,
          opacity: 0.18,
        }}>
          <svg width="28" height="40" viewBox="0 0 28 40" fill="none">
            <ellipse cx="14" cy="20" rx="10" ry="18" fill={PINK} />
          </svg>
        </div>
      ))}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function InvitationDetailPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "1";
  const invite = INVITATION_DATA[id] ?? INVITATION_DATA["1"];

  const [phase, setPhase] = useState<InvitePhase>("sealed");
  const [showDeclineSheet, setShowDeclineSheet] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  function handleOpen() {
    setPhase("opening");
    setTimeout(() => setPhase("reading"), 900);
  }

  function handleAccept() {
    if (invite.isFree) {
      setPhase("ticket");
    } else {
      // Paid events go to happenings for full RSVP
      setPhase("accepting");
    }
  }

  return (
    <div style={{
      minHeight: "100dvh",
      background: "linear-gradient(160deg, #FFF0F8 0%, #FFE4F2 50%, #FFF8F0 100%)",
      position: "relative", overflowX: "hidden",
    }}>
      <ConfettiPetals />

      {/* CSS animations */}
      <style>{`
        @keyframes flyIn {
          from { transform: translateY(60px) scale(0.94); opacity: 0; }
          to   { transform: translateY(0)   scale(1);    opacity: 1; }
        }
        @keyframes cardReveal {
          from { transform: translateY(40px); opacity: 0; }
          to   { transform: translateY(0);   opacity: 1; }
        }
        @keyframes ticketReveal {
          from { transform: translateY(30px) rotate(-1.5deg); opacity: 0; }
          to   { transform: translateY(0)    rotate(0deg);   opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes sheetUp {
          from { transform: translateY(100%); }
          to   { transform: translateY(0); }
        }
        @keyframes petalDrift {
          from { transform: translateY(0px) rotate(-15deg); }
          to   { transform: translateY(10px) rotate(15deg); }
        }
        @keyframes cardPeek {
          from { transform: translateY(30px); opacity: 0; }
          to   { transform: translateY(-20px); opacity: 1; }
        }
        @keyframes sealShake {
          0%,100% { transform: rotate(0deg); }
          25%     { transform: rotate(-3deg); }
          75%     { transform: rotate(3deg); }
        }
        @keyframes pulsePink {
          0%,100% { box-shadow: 0 6px 24px rgba(255,31,125,0.44); }
          50%     { box-shadow: 0 6px 36px rgba(255,31,125,0.7); }
        }
      `}</style>

      {/* Top nav */}
      <div style={{
        position: "relative", zIndex: 10,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "56px 20px 12px",
      }}>
        <Link href="/member/messages?filter=invitations" style={{
          width: 38, height: 38, borderRadius: "50%",
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "rgba(255,31,125,0.08)", border: "1px solid rgba(255,31,125,0.16)",
          textDecoration: "none",
        }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={PINK} strokeWidth="2.4" strokeLinecap="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </Link>

        <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 700, letterSpacing: "0.3em", color: "rgba(255,31,125,0.45)" }}>
          ✦ BLOOMBAY INVITATION
        </p>

        <div style={{ width: 38 }} />
      </div>

      {/* Main content */}
      <div style={{
        position: "relative", zIndex: 10,
        padding: "12px 22px 100px",
        animation: mounted ? "flyIn 0.5s cubic-bezier(0.34,1.2,0.64,1) forwards" : "none",
      }}>

        {/* ── PHASE: SEALED ─────────────────────────────────────────────────── */}
        {(phase === "sealed" || phase === "opening") && (
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div style={{ textAlign: "center", marginBottom: 4 }}>
              <p style={{ fontFamily: "var(--font-caveat)", fontSize: 16, color: "rgba(255,31,125,0.6)" }}>
                An invitation is waiting for you ♡
              </p>
            </div>

            <Envelope
              invite={invite}
              sealCracked={phase === "opening"}
              cardRising={phase === "opening"}
            />

            {phase === "sealed" && (
              <button
                onClick={handleOpen}
                style={{
                  width: "100%", maxWidth: 340, margin: "0 auto",
                  padding: "17px 0", borderRadius: 50,
                  background: `linear-gradient(135deg, ${PINK}, #C8005A)`,
                  color: "white", fontSize: 14, fontWeight: 800,
                  letterSpacing: "0.06em", border: "none", cursor: "pointer",
                  boxShadow: `0 8px 28px ${PINK}50, inset 0 1px 0 rgba(255,255,255,0.2)`,
                  display: "block",
                  animation: "pulsePink 2s ease infinite",
                }}
              >
                Open Invitation →
              </button>
            )}

            {phase === "opening" && (
              <div style={{ textAlign: "center" }}>
                <p style={{ fontFamily: "var(--font-caveat)", fontSize: 16, color: "rgba(255,31,125,0.55)", animation: "fadeIn 0.3s ease" }}>
                  opening…
                </p>
              </div>
            )}
          </div>
        )}

        {/* ── PHASE: READING ────────────────────────────────────────────────── */}
        {phase === "reading" && (
          <div style={{ maxWidth: 380, margin: "0 auto" }}>
            <InvitationCard
              invite={invite}
              onAccept={handleAccept}
              onDecline={() => setShowDeclineSheet(true)}
            />
          </div>
        )}

        {/* ── PHASE: PAYING (non-free public events) ────────────────────────── */}
        {phase === "accepting" && (
          <div style={{
            maxWidth: 380, margin: "0 auto",
            background: `${GRAIN}, ${CREAM}`,
            backgroundSize: "200px 200px, auto",
            borderRadius: 20, padding: "28px 24px",
            boxShadow: "0 16px 48px rgba(0,0,0,0.15)",
            animation: "cardReveal 0.4s ease forwards",
          }}>
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 700, fontSize: 22, color: "#1C1B1C", marginBottom: 4 }}>Almost there.</p>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: 11, color: "rgba(0,0,0,0.4)" }}>Complete your reservation for {invite.event}</p>
            </div>

            <div style={{ background: `${PINK}08`, border: `1px solid ${PINK}18`, borderRadius: 14, padding: "16px 18px", marginBottom: 20 }}>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.2em", color: "rgba(255,31,125,0.55)", marginBottom: 6 }}>YOU&apos;RE PAYING</p>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: 26, fontWeight: 900, color: PINK }}>{invite.price}</p>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: 11, color: "rgba(0,0,0,0.38)", marginTop: 2 }}>to hold your spot · refundable if cancelled 24h before</p>
            </div>

            <Link
              href={`/member/happenings/${invite.id}`}
              style={{
                display: "block", width: "100%", padding: "16px 0",
                borderRadius: 50, background: `linear-gradient(135deg, ${PINK}, #C8005A)`,
                color: "white", fontSize: 13, fontWeight: 800,
                letterSpacing: "0.06em", textAlign: "center", textDecoration: "none",
                boxShadow: `0 6px 24px ${PINK}44`,
              }}
            >
              Confirm &amp; Reserve →
            </Link>

            <button
              onClick={() => setPhase("reading")}
              style={{ width: "100%", background: "transparent", border: "none", padding: "12px 0 0", cursor: "pointer", fontFamily: "var(--font-jost)", fontSize: 11, color: "rgba(0,0,0,0.35)" }}
            >
              Go back
            </button>
          </div>
        )}

        {/* ── PHASE: TICKET ─────────────────────────────────────────────────── */}
        {phase === "ticket" && (
          <div style={{ maxWidth: 380, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 20, animation: "fadeIn 0.4s ease" }}>
              <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 700, fontSize: 26, color: "#1C1B1C", marginBottom: 4 }}>You&apos;re going. ✦</p>
              <p style={{ fontFamily: "var(--font-caveat)", fontSize: 15, color: "rgba(255,31,125,0.55)" }}>Your ticket is ready. Save it.</p>
            </div>

            <Ticket invite={invite} />

            <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 10, animation: "fadeIn 0.5s 0.3s ease both" }}>
              <Link href="/member/plans" style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                padding: "14px 0", borderRadius: 50,
                background: `linear-gradient(135deg, ${PINK}, #C8005A)`,
                color: "white", fontSize: 13, fontWeight: 800,
                letterSpacing: "0.06em", textDecoration: "none",
                boxShadow: `0 6px 24px ${PINK}44`,
              }}>
                View in My Plans →
              </Link>
              <Link href="/member/messages?filter=invitations" style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                padding: "13px 0", borderRadius: 50,
                background: "rgba(255,31,125,0.07)", color: PINK,
                border: `1.5px solid ${PINK}25`,
                fontSize: 12, fontWeight: 700, textDecoration: "none",
              }}>
                Back to Mailbox
              </Link>
            </div>
          </div>
        )}

        {/* ── PHASE: DECLINED ────────────────────────────────────────────────── */}
        {phase === "declined" && (
          <div style={{ maxWidth: 380, margin: "0 auto" }}>
            <DeclinedView invite={invite} onBack={() => window.history.back()} />
          </div>
        )}
      </div>

      {/* Decline sheet overlay */}
      {showDeclineSheet && (
        <DeclineSheet
          invite={invite}
          onSend={() => {
            setShowDeclineSheet(false);
            setPhase("declined");
          }}
          onCancel={() => setShowDeclineSheet(false)}
        />
      )}
    </div>
  );
}
