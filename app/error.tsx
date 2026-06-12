"use client";

import { useEffect } from "react";

const PINK = "#FF1F7D";
const DARK = "#1C1B1C";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html>
      <body style={{ margin: 0 }}>
        <div style={{
          minHeight: "100vh",
          background: "linear-gradient(160deg, #FFF0F8 0%, #FFE8F4 40%, #FFF5F0 100%)",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          padding: "0 28px",
        }}>
          {/* Ambient glow */}
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
              <span style={{ fontFamily: "Georgia, serif", fontWeight: 900, fontStyle: "italic", fontSize: 22, color: "white" }}>Y</span>
            </div>

            <p style={{
              fontFamily: "sans-serif", fontSize: "8px", fontWeight: 800,
              letterSpacing: "0.22em", color: PINK, marginBottom: 16,
            }}>
              YANDE · BLOOMBAY AI
            </p>

            <h1 style={{
              fontFamily: "Georgia, serif", fontStyle: "italic", fontWeight: 900,
              fontSize: "clamp(24px, 7vw, 32px)", color: DARK, lineHeight: 1.2, marginBottom: 14,
            }}>
              Okay, that was us. Not you.
            </h1>

            <p style={{
              fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: 17,
              color: "#8A6A7A", lineHeight: 1.6, marginBottom: 8,
            }}>
              Something broke on our end. It happens — even we have off moments.
            </p>
            <p style={{
              fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: 16,
              color: "#B08A9A", lineHeight: 1.6, marginBottom: 36,
            }}>
              Try again and it'll probably work. If it keeps happening, give us a minute — we're already on it.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <button
                onClick={() => reset()}
                style={{
                  background: PINK, color: "white", border: "none",
                  borderRadius: 999, padding: "14px 0", cursor: "pointer",
                  fontFamily: "sans-serif", fontSize: "10px", fontWeight: 800,
                  letterSpacing: "0.14em", boxShadow: `0 6px 20px ${PINK}44`,
                  width: "100%",
                }}
              >
                TRY AGAIN
              </button>
              <a href="/member/home" style={{
                display: "block",
                background: `rgba(255,31,125,0.06)`,
                border: `1.5px solid ${PINK}33`,
                color: PINK, borderRadius: 999, padding: "13px 0", textAlign: "center",
                textDecoration: "none", fontFamily: "sans-serif",
                fontSize: "10px", fontWeight: 800, letterSpacing: "0.14em",
              }}>
                TAKE ME HOME
              </a>
            </div>

            <p style={{
              fontFamily: "Georgia, serif", fontSize: 14, color: "#C0A0B0",
              marginTop: 32, fontStyle: "italic",
            }}>
              — Yande
            </p>
          </div>
        </div>
      </body>
    </html>
  );
}
