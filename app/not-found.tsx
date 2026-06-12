import Link from "next/link";

export default function NotFound() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg, #1C0812 0%, #2A0A1A 50%, #1A0510 100%)",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: "0 24px", textAlign: "center",
    }}>
      {/* Bloom glow */}
      <div style={{
        position: "fixed", top: "20%", left: "50%", transform: "translateX(-50%)",
        width: 400, height: 400, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(255,31,125,0.18) 0%, transparent 70%)",
        filter: "blur(60px)", pointerEvents: "none",
      }}/>

      <div style={{ position: "relative" }}>
        {/* Paper card */}
        <div style={{
          background: "#FEFCF7",
          borderRadius: 4, padding: "40px 36px 32px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
          transform: "rotate(-1deg)",
          maxWidth: 320,
        }}>
          {/* Tape */}
          <div style={{
            position: "absolute", top: -10, left: "35%",
            width: 60, height: 18, borderRadius: 2,
            background: "rgba(255,252,200,0.82)",
            boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
            transform: "rotate(-2deg)",
          }}/>

          <p style={{
            fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 800,
            letterSpacing: "0.22em", color: "#FF1F7D", marginBottom: 12,
          }}>
            404 · LOST
          </p>
          <h1 style={{
            fontFamily: "var(--font-playfair)", fontSize: 36, fontWeight: 900,
            fontStyle: "italic", color: "#1C1B1C", lineHeight: 1.1, marginBottom: 12,
          }}>
            This page wandered off.
          </h1>
          <p style={{
            fontFamily: "var(--font-caveat)", fontSize: 16, color: "#7A6A5A",
            lineHeight: 1.5, marginBottom: 24,
          }}>
            The page you're looking for doesn't exist or may have moved. Let's get you back.
          </p>

          <Link href="/member/home" style={{
            display: "block", background: "#FF1F7D", color: "white",
            borderRadius: 999, padding: "12px 0", textAlign: "center",
            textDecoration: "none", fontFamily: "var(--font-jost)",
            fontSize: "10px", fontWeight: 800, letterSpacing: "0.14em",
            boxShadow: "0 6px 20px rgba(255,31,125,0.45)",
          }}>
            TAKE ME HOME ♡
          </Link>
        </div>
      </div>
    </div>
  );
}
