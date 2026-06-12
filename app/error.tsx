"use client";

import { useEffect } from "react";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Log to error tracking in production
    console.error(error);
  }, [error]);

  return (
    <html>
      <body style={{ margin: 0 }}>
        <div style={{
          minHeight: "100vh",
          background: "linear-gradient(160deg, #1C0812 0%, #2A0A1A 50%, #1A0510 100%)",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          padding: "0 24px", textAlign: "center",
        }}>
          <div style={{ position: "relative" }}>
            <div style={{
              background: "#FEFCF7", borderRadius: 4, padding: "40px 36px 32px",
              boxShadow: "0 20px 60px rgba(0,0,0,0.6)", transform: "rotate(-0.8deg)", maxWidth: 320,
            }}>
              <div style={{
                position: "absolute", top: -10, left: "35%", width: 60, height: 18, borderRadius: 2,
                background: "rgba(255,252,200,0.82)", boxShadow: "0 1px 4px rgba(0,0,0,0.2)", transform: "rotate(-2deg)",
              }}/>
              <p style={{ fontFamily: "sans-serif", fontSize: "9px", fontWeight: 800, letterSpacing: "0.22em", color: "#FF1F7D", marginBottom: 12 }}>
                SOMETHING WENT WRONG
              </p>
              <h1 style={{ fontFamily: "serif", fontSize: 28, fontWeight: 900, fontStyle: "italic", color: "#1C1B1C", lineHeight: 1.15, marginBottom: 12 }}>
                Oops. That wasn't supposed to happen.
              </h1>
              <p style={{ fontFamily: "sans-serif", fontSize: 14, color: "#7A6A5A", lineHeight: 1.5, marginBottom: 24 }}>
                Something went wrong on our end. Try refreshing — if it keeps happening, come back in a bit.
              </p>
              <button
                onClick={() => reset()}
                style={{
                  display: "block", width: "100%", background: "#FF1F7D", color: "white",
                  border: "none", borderRadius: 999, padding: "12px 0", cursor: "pointer",
                  fontFamily: "sans-serif", fontSize: "10px", fontWeight: 800, letterSpacing: "0.14em",
                  boxShadow: "0 6px 20px rgba(255,31,125,0.45)",
                }}
              >
                TRY AGAIN
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
