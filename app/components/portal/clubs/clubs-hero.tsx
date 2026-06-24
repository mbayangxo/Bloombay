import Link from "next/link";
import { PushPin, GoldStar, SafetyPin, TornEdge, WashiTape } from "../scrapbook";
import { DARK, PAPER, PAPER_TEX, PINK } from "./shared";

export function ClubsHero() {
  return (
    <section style={{ padding: "14px 18px 0", position: "relative" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)", backgroundSize: "28px 28px", pointerEvents: "none" }} />
      <SafetyPin style={{ position: "absolute", top: 8, left: 24, transform: "rotate(-15deg)", zIndex: 4 }} />
      <GoldStar size={16} style={{ position: "absolute", top: 10, right: 28, zIndex: 4 }} />

      <div style={{ display: "flex", gap: 12, alignItems: "flex-start", paddingBottom: 28, position: "relative", zIndex: 2 }}>
        {/* Left: headline paper scrap */}
        <div style={{ flex: 1, position: "relative" }}>
          <div style={{ position: "absolute", top: -10, left: 20, zIndex: 5 }}>
            <WashiTape color="yellow" width={72} height={18} rot={-2} />
          </div>
          <div style={{
            background: PAPER,
            backgroundImage: PAPER_TEX,
            backgroundSize: "200px 200px",
            padding: "14px 14px 12px",
            boxShadow: "4px 6px 28px rgba(0,0,0,0.55)",
            position: "relative",
            overflow: "hidden",
          }}>
            <div style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900, lineHeight: 1.0, marginBottom: 6 }}>
              <div style={{ fontSize: "clamp(28px,8vw,36px)", color: DARK }}>Clubs.</div>
            </div>
            <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 11, color: DARK, opacity: 0.55, marginBottom: 10, lineHeight: 1.3 }}>
              clubs for every side of you.
            </p>
            <Link href="/member/clubs/create" style={{ textDecoration: "none", display: "inline-flex" }}>
              <div style={{ background: DARK, borderRadius: 999, padding: "6px 14px", display: "inline-flex", alignItems: "center", gap: 5 }}>
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.8" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: 8, fontWeight: 800, letterSpacing: "0.1em", color: "white" }}>START A CLUB</p>
              </div>
            </Link>
            <TornEdge color="#FFF0F6" height={12} style={{ marginLeft: -16, marginRight: -16, marginBottom: -1 }} />
          </div>
        </div>

        {/* Right: polaroid photo + bubble */}
        <div style={{ flexShrink: 0, position: "relative", marginTop: 12 }}>
          <div style={{ position: "absolute", top: -8, left: "50%", transform: "translateX(-50%)", zIndex: 6 }}>
            <PushPin color="pink" size={14} />
          </div>
          <div style={{
            background: "white", padding: "5px 5px 20px", width: 88,
            boxShadow: "4px 8px 24px rgba(0,0,0,0.6)",
            transform: "rotate(3.5deg)", position: "relative",
          }}>
            <div style={{ width: "100%", height: 72, background: "linear-gradient(145deg,#3D0020,#C80060,#FF5BAD)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 32, opacity: 0.7 }}>🌸</span>
            </div>
            <p style={{ fontFamily: "var(--font-caveat)", fontSize: 10, color: "rgba(0,0,0,0.45)", textAlign: "center", marginTop: 4, lineHeight: 1.2 }}>
              your new favorite<br/>room ♡
            </p>
          </div>
          <div style={{
            position: "absolute", bottom: -18, right: -14, width: 62, height: 62, borderRadius: "50%",
            background: `linear-gradient(135deg,${PINK},#FF5BAD)`,
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: `0 4px 16px ${PINK}66`, zIndex: 5,
          }}>
            <p style={{ fontFamily: "var(--font-caveat)", fontSize: 10, color: "white", textAlign: "center", lineHeight: 1.3, padding: "0 4px" }}>
              you<br/>belong<br/>here
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
