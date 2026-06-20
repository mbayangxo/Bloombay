"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Suspense } from "react";

const PINK = "#FF1F7D";

interface ConnectResult {
  streak: number;
  milestone_stamp: string | null;
  scanned_name: string;
}

function ConnectInner() {
  const searchParams = useSearchParams();
  const from = searchParams.get("from");

  const [status, setStatus] = useState<"loading" | "success" | "error" | "self" | "no-param">("loading");
  const [result, setResult] = useState<ConnectResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>("");

  useEffect(() => {
    if (!from) {
      setStatus("no-param");
      return;
    }

    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) {
        setErrorMsg("You need to be signed in.");
        setStatus("error");
        return;
      }

      if (from === user.id) {
        setStatus("self");
        return;
      }

      try {
        const res = await fetch("/api/member/scan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ scanned_user_id: from }),
        });
        const json = await res.json();
        if (!res.ok) {
          setErrorMsg(json.error || "Could not connect.");
          setStatus("error");
        } else {
          setResult({
            streak: json.streak,
            milestone_stamp: json.milestone_stamp ?? null,
            scanned_name: json.scanned_name,
          });
          setStatus("success");
        }
      } catch {
        setErrorMsg("Something went wrong. Try again.");
        setStatus("error");
      }
    });
  }, [from]);

  return (
    <div style={{ minHeight: "100vh", background: "#0A0508", display: "flex", flexDirection: "column" }}>
      {/* Ambient glow */}
      <div style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        background: "radial-gradient(ellipse at 50% 30%, rgba(255,31,125,0.12) 0%, transparent 65%)",
      }} />

      <div style={{ position: "relative", flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 24px 80px" }}>

        {/* Loading */}
        {status === "loading" && (
          <div style={{ textAlign: "center" }}>
            <p style={{
              fontFamily: "var(--font-playfair)",
              fontStyle: "italic",
              fontSize: 24,
              color: "rgba(255,235,215,0.85)",
              margin: "0 0 4px",
            }}>
              Connecting
              <span style={{ display: "inline-block", animation: "dots 1.4s steps(3, end) infinite" }}>...</span>
            </p>
          </div>
        )}

        {/* No param */}
        {status === "no-param" && (
          <div style={{ textAlign: "center" }}>
            <p style={{
              fontFamily: "var(--font-playfair)",
              fontStyle: "italic",
              fontSize: 18,
              color: "rgba(255,255,255,0.4)",
              marginBottom: 16,
            }}>
              Invalid link.
            </p>
            <Link href="/member/lounge" style={{ color: PINK, fontSize: 12, fontFamily: "Jost, sans-serif" }}>
              Back to Lounge →
            </Link>
          </div>
        )}

        {/* Self scan */}
        {status === "self" && (
          <div style={{ textAlign: "center" }}>
            <p style={{
              fontFamily: "var(--font-playfair)",
              fontStyle: "italic",
              fontSize: 18,
              color: "rgba(255,255,255,0.4)",
              marginBottom: 16,
            }}>
              {"That's your own code."}
            </p>
            <Link href="/member/scan" style={{ color: PINK, fontSize: 12, fontFamily: "Jost, sans-serif" }}>
              Go to scan →
            </Link>
          </div>
        )}

        {/* Error */}
        {status === "error" && (
          <div style={{ textAlign: "center" }}>
            <p style={{
              fontFamily: "var(--font-playfair)",
              fontStyle: "italic",
              fontSize: 18,
              color: "rgba(255,255,255,0.4)",
              marginBottom: 16,
            }}>
              {errorMsg || "Something went wrong."}
            </p>
            <Link href="/member/home" style={{ color: PINK, fontSize: 12, fontFamily: "Jost, sans-serif" }}>
              Back home →
            </Link>
          </div>
        )}

        {/* Success */}
        {status === "success" && result && (
          <div style={{ width: "100%", maxWidth: 360, position: "relative" }}>
            {/* Glow */}
            <div style={{
              position: "absolute",
              inset: 0,
              borderRadius: 24,
              pointerEvents: "none",
              background: `radial-gradient(ellipse at 50% 0%, ${PINK}22 0%, transparent 70%)`,
              filter: "blur(20px)",
              transform: "translateY(-10px) scale(1.05)",
            }} />

            {/* Card */}
            <div style={{
              position: "relative",
              borderRadius: 24,
              overflow: "hidden",
              background: "linear-gradient(160deg, #1A0812 0%, #120508 60%, #0D040C 100%)",
              border: `1px solid ${PINK}25`,
              boxShadow: `0 24px 60px rgba(0,0,0,0.6), 0 0 0 1px ${PINK}10`,
            }}>
              <div style={{ height: 1, width: "100%", background: `linear-gradient(90deg, transparent, ${PINK}30, transparent)` }} />

              <div style={{ padding: "40px 32px 32px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
                <p style={{
                  fontFamily: "Jost, sans-serif",
                  fontWeight: 700,
                  fontSize: 9,
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  color: `${PINK}66`,
                  marginBottom: 20,
                }}>
                  ✦ CONNECTED
                </p>

                <p style={{
                  fontFamily: "var(--font-playfair)",
                  fontStyle: "italic",
                  fontSize: 26,
                  color: "rgba(255,235,215,0.95)",
                  margin: "0 0 14px",
                  textShadow: `0 0 40px ${PINK}40`,
                }}>
                  {result.scanned_name}
                </p>

                <p style={{
                  fontFamily: "Jost, sans-serif",
                  fontSize: 14,
                  color: "rgba(255,255,255,0.45)",
                  margin: "0 0 20px",
                  lineHeight: 1.5,
                }}>
                  {`You've now crossed paths ${result.streak} time${result.streak === 1 ? "" : "s"}.`}
                </p>

                {result.milestone_stamp && (
                  <div style={{
                    background: `${PINK}15`,
                    borderRadius: 10,
                    padding: "10px 18px",
                    border: `1px solid ${PINK}30`,
                    marginBottom: 20,
                  }}>
                    <p style={{
                      fontFamily: "Jost, sans-serif",
                      fontWeight: 700,
                      fontSize: 11,
                      color: PINK,
                      letterSpacing: "0.08em",
                      margin: 0,
                    }}>
                      🌸 {result.milestone_stamp}
                    </p>
                  </div>
                )}

                <div style={{ height: 1, width: "100%", background: `${PINK}20`, margin: "0 0 20px" }} />

                <Link href="/member/lounge" style={{
                  fontFamily: "Jost, sans-serif",
                  fontSize: 12,
                  color: "rgba(255,255,255,0.4)",
                  letterSpacing: "0.06em",
                  textDecoration: "none",
                }}>
                  Back to lounge →
                </Link>
              </div>

              <div style={{ height: 1, width: "100%", background: `linear-gradient(90deg, transparent, ${PINK}20, transparent)` }} />
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes dots {
          0%, 20% { content: "."; }
          40% { content: ".."; }
          60%, 100% { content: "..."; }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

export default function ConnectPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: "100vh", background: "#0A0508", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 40, height: 40, borderRadius: "50%", border: "2px solid rgba(255,31,125,0.3)", borderTopColor: "#FF1F7D", animation: "spin 1s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    }>
      <ConnectInner />
    </Suspense>
  );
}
