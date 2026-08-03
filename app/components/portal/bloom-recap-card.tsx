"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTheme } from "@/lib/theme/theme-context";
import { getMonthlyRecap, type MonthlyRecap } from "@/lib/actions/recap";

function buildHighlight(r: MonthlyRecap): string {
  if (r.bloomiesMet > 0) return `You met ${r.bloomiesMet} new Bloomie${r.bloomiesMet === 1 ? "" : "s"} this month.`;
  if (r.events > 0) return `You made it to ${r.events} happening${r.events === 1 ? "" : "s"} this month.`;
  if (r.clubsJoined > 0) return `You joined ${r.clubsJoined} club${r.clubsJoined === 1 ? "" : "s"} this month.`;
  if (r.flowers > 0) return `You gave ${r.flowers} flower${r.flowers === 1 ? "" : "s"} this month.`;
  if (r.saves > 0) return `You saved ${r.saves} place${r.saves === 1 ? "" : "s"} to check out.`;
  return "Nothing bloomed yet this month.";
}

function buildObservation(r: MonthlyRecap): string {
  if (!r.hasActivity) {
    return "Nothing here yet — tap into a Happening, save a place, or say hi to a Bloomie and I'll start your recap.";
  }
  return `Here's what bloomed for you in ${r.shortMonth}: ${r.events} happening${r.events === 1 ? "" : "s"}, ${r.saves} place${r.saves === 1 ? "" : "s"} saved, ${r.bloomiesMet} new Bloomie${r.bloomiesMet === 1 ? "" : "s"}, and ${r.flowers} flower${r.flowers === 1 ? "" : "s"} given.`;
}

// ── Full Recap Sheet ──────────────────────────────────────────────────────────

function RecapSheet({ recap, onClose }: { recap: MonthlyRecap; onClose: () => void }) {
  const { palette } = useTheme();
  const r = recap;
  return (
    <>
      <div
        onClick={onClose}
        style={{ position: "fixed", inset: 0, zIndex: 300, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(10px)" }}
      />
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 301,
        background: palette.card, borderRadius: "24px 24px 0 0",
        maxHeight: "92vh", overflowY: "auto",
        boxShadow: "0 -12px 48px rgba(0,0,0,0.5)",
      }}>
        <div style={{ display: "flex", justifyContent: "center", padding: "12px 0 4px" }}>
          <div style={{ width: 36, height: 4, borderRadius: 999, background: palette.border }} />
        </div>

        <div style={{ padding: "16px 22px 56px" }}>
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
            <div>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: 8, fontWeight: 800, letterSpacing: "0.22em", color: palette.pink, marginBottom: 4 }}>✦ BLOOM RECAP</p>
              <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 32, fontWeight: 700, color: palette.textPrimary, lineHeight: 1 }}>{r.month}</p>
            </div>
            <button onClick={onClose} style={{ background: palette.cardElevated, border: "none", borderRadius: "50%", width: 34, height: 34, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke={palette.textMuted} strokeWidth="1.8" strokeLinecap="round"><path d="M1 1l8 8M9 1l-8 8" /></svg>
            </button>
          </div>

          {r.hasActivity ? (
            <>
              {/* Stats */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
                {[
                  { emoji: "🌸", label: "Events attended",  value: r.events },
                  { emoji: "📍", label: "Places saved",      value: r.saves },
                  { emoji: "✦",  label: "Bloomies met",      value: r.bloomiesMet },
                  { emoji: "🌺", label: "Flowers given",     value: r.flowers },
                  { emoji: "👥", label: "Clubs joined",      value: r.clubsJoined },
                ].map(s => (
                  <div key={s.label} style={{ background: palette.cardElevated, borderRadius: 16, padding: "14px 16px" }}>
                    <p style={{ fontFamily: "var(--font-jost)", fontSize: 28, fontWeight: 900, color: palette.textPrimary, lineHeight: 1 }}>{s.value}</p>
                    <p style={{ fontFamily: "var(--font-jost)", fontSize: 10, color: palette.textMuted, marginTop: 3 }}>{s.emoji} {s.label}</p>
                  </div>
                ))}
              </div>

              {/* Highlight */}
              <div style={{ background: `${palette.pink}1F`, border: `1px solid ${palette.pink}33`, borderRadius: 16, padding: "14px 16px", marginBottom: 16 }}>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: 8, fontWeight: 800, letterSpacing: "0.18em", color: palette.pink, marginBottom: 6 }}>✦ HIGHLIGHT</p>
                <p style={{ fontFamily: "var(--font-caveat)", fontSize: 16, color: palette.textSecondary, lineHeight: 1.5 }}>{buildHighlight(r)}</p>
              </div>
            </>
          ) : null}

          {/* Yande */}
          <div style={{ background: palette.cardElevated, borderRadius: 16, padding: "16px", marginBottom: 20 }}>
            <p style={{ fontFamily: "var(--font-caveat)", fontSize: 17, color: palette.textSecondary, lineHeight: 1.6, marginBottom: 10 }}>
              &ldquo;{buildObservation(r)}&rdquo;
            </p>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 700, color: palette.pink, letterSpacing: "0.08em" }}>— Yande ✦</p>
          </div>

          {/* CTA to full Bloom Trails */}
          <Link href="/member/lounge/memories" onClick={onClose} style={{
            display: "block", textAlign: "center", padding: "14px",
            background: palette.cardElevated, border: `1px solid ${palette.border}`,
            borderRadius: 14, textDecoration: "none",
            fontFamily: "var(--font-jost)", fontSize: 12, fontWeight: 700,
            color: palette.textMuted, letterSpacing: "0.06em",
          }}>
            View all recaps in Bloom Trails →
          </Link>
        </div>
      </div>
    </>
  );
}

// ── Home Feed Card ────────────────────────────────────────────────────────────

export function BloomRecapCard({ onDismiss }: { onDismiss?: () => void }) {
  const { palette } = useTheme();
  const [recap, setRecap]         = useState<MonthlyRecap | null>(null);
  const [open, setOpen]           = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    getMonthlyRecap().then(
      r => setRecap(r),
      () => setRecap(null)
    );
  }, []);

  if (!recap || dismissed) return null;

  function handleView() { setOpen(true); }
  function handleDismiss() { setDismissed(true); onDismiss?.(); }

  const cardBg = palette.isNight
    ? `linear-gradient(150deg, ${palette.cardElevated} 0%, ${palette.card} 100%)`
    : "linear-gradient(150deg, #1d0828 0%, #2c0a1a 100%)";
  const ghostBg = palette.isNight
    ? `linear-gradient(135deg, ${palette.pageBg} 0%, ${palette.card} 100%)`
    : "linear-gradient(135deg, #120820 0%, #1e0612 100%)";

  return (
    <>
      {/* Ghost card behind */}
      <div style={{ position: "relative" }}>
        <div style={{
          position: "absolute", inset: 0,
          background: ghostBg,
          borderRadius: 14,
          transform: "rotate(1.6deg) translateY(3px)",
          opacity: 0.5,
        }} />

        {/* Main card */}
        <div style={{
          position: "relative", borderRadius: 14, overflow: "hidden",
          background: cardBg,
          boxShadow: [
            "inset 0 1px 0 rgba(255,255,255,0.10)",
            "0 2px 0 #080006",
            "0 4px 0 rgba(0,0,0,0.45)",
            "0 12px 28px rgba(0,0,0,0.55)",
          ].join(", "),
          transform: "rotate(-0.5deg)",
        }}>
          {/* Pink left spine */}
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: `linear-gradient(to bottom, ${palette.pink}, #8B0038)` }} />

          <div style={{ paddingLeft: 3 }}>
            {/* Top row */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 10px 0 10px" }}>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: 6, fontWeight: 900, letterSpacing: "0.18em", color: palette.pink }}>✦ {recap.month.toUpperCase()}</p>
              <button onClick={handleDismiss} style={{ background: "none", border: "none", cursor: "pointer", padding: 2, opacity: 0.3 }} aria-label="Dismiss">
                <svg width="8" height="8" viewBox="0 0 10 10" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round"><path d="M1 1l8 8M9 1l-8 8" /></svg>
              </button>
            </div>

            {recap.hasActivity ? (
              <div style={{ display: "flex", gap: 18, padding: "8px 10px 0" }}>
                {[
                  { value: recap.events,      label: "events"   },
                  { value: recap.saves,       label: "saves"    },
                  { value: recap.bloomiesMet, label: "bloomies" },
                  { value: recap.flowers,     label: "flowers"  },
                ].map(s => (
                  <div key={s.label}>
                    <p style={{ fontFamily: "var(--font-jost)", fontSize: 17, fontWeight: 900, color: "white", lineHeight: 1 }}>{s.value}</p>
                    <p style={{ fontFamily: "var(--font-jost)", fontSize: 7, color: "rgba(255,255,255,0.3)", marginTop: 1 }}>{s.label}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ fontFamily: "var(--font-caveat)", fontSize: 13, color: "rgba(255,255,255,0.55)", padding: "8px 10px 0" }}>
                Nothing bloomed yet this month.
              </p>
            )}

            {/* Dashed separator */}
            <div style={{ margin: "8px 10px 0", borderTop: "1px dashed rgba(255,255,255,0.08)" }} />

            {/* CTA */}
            <div style={{ padding: "8px 10px 12px" }}>
              <button onClick={handleView} style={{
                width: "100%", padding: "8px 0",
                background: palette.pink, color: "white", border: "none",
                borderRadius: 8, cursor: "pointer",
                fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 800,
                letterSpacing: "0.03em",
                boxShadow: `0 2px 0 rgba(130,0,45,0.8), 0 3px 10px ${palette.pink}44`,
              }}>
                Open {recap.shortMonth} →
              </button>
            </div>
          </div>
        </div>
      </div>

      {open && <RecapSheet recap={recap} onClose={() => { setOpen(false); handleDismiss(); }} />}
    </>
  );
}
