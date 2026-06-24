import Link from "next/link";
import { DARK, PINK } from "./shared";

export function StartClubCTA() {
  return (
    <>
      {/* Club Rankings */}
      <section style={{ padding: "0 18px 24px" }}>
        <Link href="/member/clubs/rankings" style={{ textDecoration: "none" }}>
          <div style={{ background: "rgba(255,255,255,0.04)", borderRadius: 18, padding: "16px 18px", border: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 42, height: 42, borderRadius: 14, background: `linear-gradient(135deg, #D4A85344, #D4A853)`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span style={{ fontSize: 20 }}>🏆</span>
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 700, fontSize: 16, color: "white", lineHeight: 1 }}>Club Rankings</p>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: 10, color: "rgba(255,255,255,0.38)", marginTop: 4 }}>Top clubs by activity, retention & love</p>
            </div>
            <svg width="6" height="11" viewBox="0 0 6 11" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.8" strokeLinecap="round"><path d="M1 1l4 4.5-4 4.5"/></svg>
          </div>
        </Link>
      </section>

      {/* Start Your Own Club */}
      <section style={{ padding: "0 18px 60px" }}>
        <div style={{ background: DARK, borderRadius: 20, padding: "24px 20px", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -20, right: -20, width: 100, height: 100, borderRadius: "50%", background: `${PINK}18`, pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: -10, left: 30, width: 60, height: 60, borderRadius: "50%", background: `${PINK}10`, pointerEvents: "none" }} />
          <p style={{ fontFamily: "var(--font-jost)", fontSize: 8, fontWeight: 900, letterSpacing: "0.22em", color: `${PINK}BB`, marginBottom: 8 }}>CAN&apos;T FIND YOUR VIBE?</p>
          <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 700, fontSize: 22, color: "white", lineHeight: 1.1, marginBottom: 10 }}>Start your own club.</p>
          <p style={{ fontFamily: "var(--font-instrument)", fontStyle: "italic", fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.5, marginBottom: 20 }}>
            Every great club started with one woman who said &quot;I wish there was a place for this.&quot;
          </p>
          <Link href="/member/clubs/create" style={{ textDecoration: "none" }}>
            <div style={{ background: PINK, borderRadius: 999, padding: "14px 24px", display: "inline-flex", alignItems: "center", gap: 8, boxShadow: `0 4px 20px ${PINK}55` }}>
              <span style={{ fontFamily: "var(--font-jost)", fontSize: 12, fontWeight: 800, color: "white", letterSpacing: "0.06em" }}>CREATE A CLUB</span>
              <span style={{ fontSize: 14 }}>✦</span>
            </div>
          </Link>
        </div>
      </section>
    </>
  );
}
