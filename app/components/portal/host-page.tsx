"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const PINK = "#FF1F7D";
const DARK = "#1C1B1C";

// Each kind routes into the event-create flow with a preset
const HOST_KINDS: { kind: string; label: string; emoji: string; whisper: string }[] = [
  { kind: "dinner",    label: "Dinner",    emoji: "🍷", whisper: "Six girls, one table" },
  { kind: "brunch",    label: "Brunch",    emoji: "🥂", whisper: "Sunday, obviously" },
  { kind: "coffee",    label: "Coffee",    emoji: "☕", whisper: "An hour, no pressure" },
  { kind: "walk",      label: "Walk",      emoji: "🌿", whisper: "Park loop & talk" },
  { kind: "museum",    label: "Museum",    emoji: "🏛️", whisper: "Then froyo after" },
  { kind: "picnic",    label: "Picnic",    emoji: "🧺", whisper: "Blanket, snacks, sun" },
  { kind: "open-seat", label: "Open Seat", emoji: "🪑", whisper: "Already going? Save a seat" },
  { kind: "party",     label: "Party",     emoji: "🎉", whisper: "Go big" },
];

export function HostPage() {
  const router = useRouter();
  const [showOther, setShowOther] = useState(false);
  const [otherText, setOtherText] = useState("");

  function goCustom() {
    const t = otherText.trim();
    router.push(t ? `/member/happenings/create?title=${encodeURIComponent(t)}` : "/member/happenings/create");
  }

  return (
    <div style={{ minHeight: "100vh", paddingBottom: 112, background: "#FBF6F0" }}>

      {/* Header */}
      <div style={{ padding: "62px 22px 24px" }}>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, letterSpacing: "0.26em", color: "#D4849A", marginBottom: 6 }}>BRING WOMEN TOGETHER</p>
        <h1 style={{ fontFamily: "var(--font-playfair)", fontSize: 44, fontWeight: 900, fontStyle: "italic", color: DARK, lineHeight: 1 }}>Host something.</h1>
        <p style={{ fontFamily: "var(--font-caveat)", fontSize: 17, color: "#C07080", marginTop: 8 }}>No club required. Just an idea and a date.</p>
      </div>

      {/* Kind grid */}
      <div style={{ padding: "0 18px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {HOST_KINDS.map(k => (
          <Link key={k.kind} href={`/member/happenings/create?kind=${k.kind}`} style={{ textDecoration: "none" }}>
            <div style={{
              background: "white", borderRadius: 18, padding: "18px 16px",
              border: "1.5px solid rgba(0,0,0,0.06)",
              boxShadow: "0 3px 14px rgba(200,80,120,0.07)",
            }}>
              <span style={{ fontSize: 26, display: "block", marginBottom: 8 }}>{k.emoji}</span>
              <p style={{ fontFamily: "var(--font-playfair)", fontSize: 17, fontWeight: 900, fontStyle: "italic", color: DARK }}>{k.label}</p>
              <p style={{ fontFamily: "var(--font-caveat)", fontSize: 13, color: "#B08A9A", marginTop: 2 }}>{k.whisper}</p>
            </div>
          </Link>
        ))}

        {/* Something else — spans both columns */}
        <div style={{ gridColumn: "1 / -1" }}>
          {!showOther ? (
            <button onClick={() => setShowOther(true)} style={{
              width: "100%", background: "white", borderRadius: 18, padding: "16px",
              border: "1.5px dashed rgba(255,31,125,0.35)", cursor: "pointer", textAlign: "left",
              display: "flex", alignItems: "center", gap: 12,
            }}>
              <span style={{ fontSize: 22 }}>✨</span>
              <div>
                <p style={{ fontFamily: "var(--font-playfair)", fontSize: 16, fontWeight: 900, fontStyle: "italic", color: DARK }}>Something else</p>
                <p style={{ fontFamily: "var(--font-caveat)", fontSize: 13, color: "#B08A9A", marginTop: 1 }}>Pottery class. Gallery crawl. Anything.</p>
              </div>
            </button>
          ) : (
            <div style={{
              background: "white", borderRadius: 18, padding: "16px",
              border: `1.5px solid ${PINK}55`, boxShadow: `0 4px 18px ${PINK}14`,
            }}>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, letterSpacing: "0.22em", color: "#D4849A", marginBottom: 8 }}>WHAT ARE YOU HOSTING?</p>
              <input
                autoFocus
                value={otherText}
                onChange={e => setOtherText(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") goCustom(); }}
                placeholder="Pottery night, gallery crawl, beach day…"
                style={{
                  width: "100%", border: "none", outline: "none", background: "transparent",
                  fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 18, color: DARK,
                  marginBottom: 12,
                }}
              />
              <button onClick={goCustom} style={{
                width: "100%", background: PINK, color: "white", border: "none", borderRadius: 999,
                padding: "12px 0", cursor: "pointer", fontFamily: "var(--font-jost)",
                fontSize: "10px", fontWeight: 800, letterSpacing: "0.14em",
                boxShadow: `0 4px 16px ${PINK}44`,
              }}>
                KEEP GOING →
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Divider */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "28px 22px 16px" }}>
        <div style={{ flex: 1, height: 1, background: "rgba(0,0,0,0.07)" }} />
        <p style={{ fontFamily: "var(--font-caveat)", fontSize: 14, color: "#C0A0B0" }}>or</p>
        <div style={{ flex: 1, height: 1, background: "rgba(0,0,0,0.07)" }} />
      </div>

      {/* Start a club — for something that lasts */}
      <div style={{ padding: "0 18px" }}>
        <Link href="/member/clubs/create" style={{ textDecoration: "none" }}>
          <div style={{
            borderRadius: 20, overflow: "hidden", position: "relative",
            background: `linear-gradient(145deg, ${DARK} 0%, #2E2230 100%)`,
            boxShadow: "0 8px 28px rgba(28,27,28,0.3)",
            padding: "22px",
          }}>
            <div style={{ position: "absolute", top: -20, right: -20, width: 110, height: 110, borderRadius: "50%", background: `radial-gradient(circle, ${PINK}33 0%, transparent 70%)`, pointerEvents: "none" }} />
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.3em", color: `${PINK}BB`, marginBottom: 8 }}>FOR SOMETHING THAT LASTS</p>
            <p style={{ fontFamily: "var(--font-playfair)", fontSize: 22, fontWeight: 900, fontStyle: "italic", color: "white", lineHeight: 1.15 }}>Start a club.</p>
            <p style={{ fontFamily: "var(--font-caveat)", fontSize: 14, color: "rgba(255,255,255,0.5)", marginTop: 6 }}>A crew, traditions, a name. The whole thing.</p>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 800, letterSpacing: "0.14em", color: PINK, marginTop: 14 }}>BUILD IT →</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
