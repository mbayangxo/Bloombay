import Link from "next/link";

const PINK = "#FF1F7D";
const DARK = "#1C1B1C";

export default function NotFound() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg, #FFF0F8 0%, #FFE8F4 40%, #FFF5F0 100%)",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: "0 28px",
    }}>
      {/* Ambient bloom glow */}
      <div style={{
        position: "fixed", top: "15%", left: "50%", transform: "translateX(-50%)",
        width: 320, height: 320, borderRadius: "50%",
        background: `radial-gradient(circle, ${PINK}22 0%, transparent 70%)`,
        filter: "blur(50px)", pointerEvents: "none",
      }}/>

      <div style={{ position: "relative", width: "100%", maxWidth: 360, textAlign: "center" }}>

        {/* Yande avatar */}
        <div style={{
          width: 56, height: 56, borderRadius: "50%",
          background: `linear-gradient(135deg, ${PINK} 0%, #FF69B4 100%)`,
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 20px",
          boxShadow: `0 0 0 6px ${PINK}18, 0 8px 28px ${PINK}33`,
        }}>
          <span style={{ fontFamily: "var(--font-playfair)", fontWeight: 900, fontStyle: "italic", fontSize: 22, color: "white" }}>Y</span>
        </div>

        {/* Yande label */}
        <p style={{
          fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800,
          letterSpacing: "0.22em", color: PINK, marginBottom: 16,
        }}>
          YANDE · BLOOMBAY AI
        </p>

        {/* The message */}
        <h1 style={{
          fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900,
          fontSize: "clamp(26px, 8vw, 34px)", color: DARK, lineHeight: 1.2, marginBottom: 14,
        }}>
          This page isn&apos;t here.
        </h1>

        <p style={{
          fontFamily: "var(--font-caveat)", fontSize: 18, color: "#8A6A7A",
          lineHeight: 1.55, marginBottom: 36,
        }}>
          The link may have changed, or it was never here to begin with.<br/>
          Let me take you somewhere real.
        </p>

        {/* CTAs */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <Link href="/member/home" style={{
            display: "block", background: PINK, color: "white",
            borderRadius: 999, padding: "14px 0", textAlign: "center",
            textDecoration: "none", fontFamily: "var(--font-jost)",
            fontSize: "10px", fontWeight: 800, letterSpacing: "0.14em",
            boxShadow: `0 6px 20px ${PINK}44`,
          }}>
            TAKE ME HOME
          </Link>
          <Link href="/member/happenings" style={{
            display: "block", background: "rgba(255,31,125,0.06)",
            border: `1.5px solid ${PINK}33`,
            color: PINK, borderRadius: 999, padding: "13px 0", textAlign: "center",
            textDecoration: "none", fontFamily: "var(--font-jost)",
            fontSize: "10px", fontWeight: 800, letterSpacing: "0.14em",
          }}>
            SEE WHAT&apos;S HAPPENING ♡
          </Link>
        </div>

        {/* Yande sign-off */}
        <p style={{
          fontFamily: "var(--font-caveat)", fontSize: 14, color: "#C0A0B0",
          marginTop: 32, fontStyle: "italic",
        }}>
          — Yande
        </p>
      </div>
    </div>
  );
}
