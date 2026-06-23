"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

const PINK = "#FF1F7D";

interface ScanResult {
  name: string;
  avatar_url: string | null;
  neighborhood: string | null;
  expected: boolean;
  already_checked_in: boolean;
  rsvp_status: string | null;
}

export default function BloomShieldScanPage() {
  const [gatheringId, setGatheringId] = useState<string>("");
  const [code, setCode] = useState("");
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState("");
  const [checkedIn, setCheckedIn] = useState(false);

  // Auto-resolve when code is BB-XXXX format
  useEffect(() => {
    const trimmed = code.trim().toUpperCase();
    if (trimmed.length === 7 && /^BB-[A-Z0-9]{4}$/.test(trimmed)) {
      checkMember(trimmed);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  async function checkMember(bloomCode: string) {
    if (!gatheringId.trim()) { setError("Enter the event ID first."); return; }
    setChecking(true);
    setResult(null);
    setError("");
    setCheckedIn(false);
    try {
      const res = await fetch(`/api/member/safety/verify?code=${encodeURIComponent(bloomCode)}&gatheringId=${encodeURIComponent(gatheringId.trim())}`);
      const json = await res.json();
      if (!res.ok) { setError(json.error || "Not found."); }
      else { setResult(json); }
    } catch { setError("Something went wrong."); }
    finally { setChecking(false); }
  }

  async function checkIn() {
    if (!result) return;
    setChecking(true);
    try {
      await fetch("/api/irl/check-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gatheringId: gatheringId.trim() }),
      });
      setCheckedIn(true);
    } catch { /* non-fatal */ }
    finally { setChecking(false); }
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bb-bg)", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ padding: "52px 20px 0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link href="/member/home" style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--bb-nav-bg)", border: "1px solid var(--bb-nav-border)", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--bb-nav-icon)" strokeWidth="2.2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
        </Link>
        <div style={{ textAlign: "center" }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 800, letterSpacing: "0.28em", color: `${PINK}99`, margin: 0 }}>✦ BLOOM SHIELD</p>
        </div>
        <div style={{ width: 40 }} />
      </div>

      <div style={{ flex: 1, padding: "28px 24px 80px", display: "flex", flexDirection: "column", gap: 20, maxWidth: 400, margin: "0 auto", width: "100%" }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 26, color: "var(--bb-text)", margin: "0 0 6px", lineHeight: 1.2 }}>
            Who&apos;s at the door?
          </h1>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: 11, color: "var(--bb-text-2)", margin: 0, lineHeight: 1.5 }}>
            Scan a member&apos;s Bloomies Code to verify she&apos;s expected. This keeps your space safe.
          </p>
        </div>

        {/* Event ID input */}
        <div style={{ background: "var(--bb-card)", borderRadius: 16, padding: "16px 18px", border: "1px solid var(--bb-border)" }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 800, letterSpacing: "0.2em", color: "var(--bb-text-3)", marginBottom: 8 }}>EVENT ID</p>
          <input
            type="text"
            value={gatheringId}
            onChange={e => setGatheringId(e.target.value)}
            placeholder="Paste gathering ID"
            style={{ width: "100%", boxSizing: "border-box" as const, background: "none", border: "none", outline: "none", fontFamily: "var(--font-jost)", fontSize: 13, color: "var(--bb-text)", padding: 0 }}
          />
        </div>

        {/* Bloomies Code input */}
        <div style={{ background: "var(--bb-card)", borderRadius: 16, padding: "16px 18px", border: "1px solid var(--bb-border)" }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 800, letterSpacing: "0.2em", color: "var(--bb-text-3)", marginBottom: 8 }}>HER BLOOMIES CODE</p>
          <input
            type="text"
            value={code}
            onChange={e => setCode(e.target.value)}
            placeholder="BB-XXXX"
            maxLength={7}
            autoCapitalize="characters"
            style={{ width: "100%", boxSizing: "border-box" as const, background: "none", border: "none", outline: "none", fontFamily: "var(--font-jost)", fontWeight: 700, fontSize: 22, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "var(--bb-text)", padding: 0 }}
          />
        </div>

        {/* Checking spinner */}
        {checking && (
          <div style={{ textAlign: "center", padding: "12px 0" }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", border: "2px solid rgba(255,31,125,0.3)", borderTopColor: PINK, animation: "spin 1s linear infinite", margin: "0 auto" }} />
          </div>
        )}

        {/* Error */}
        {error && <p style={{ fontFamily: "var(--font-jost)", fontSize: 13, color: PINK, textAlign: "center", margin: 0 }}>{error}</p>}

        {/* Result card */}
        {result && !checking && (
          <div style={{
            borderRadius: 20,
            overflow: "hidden",
            background: "var(--bb-card)",
            border: result.expected ? `2px solid ${PINK}` : "2px solid rgba(255,100,100,0.4)",
            boxShadow: result.expected ? `0 8px 24px rgba(255,31,125,0.15)` : "0 8px 24px rgba(0,0,0,0.08)",
          }}>
            <div style={{ height: 4, background: result.expected ? PINK : "rgba(255,80,80,0.6)" }} />
            <div style={{ padding: "20px 20px 16px" }}>
              {/* Status banner */}
              <div style={{ marginBottom: 16, textAlign: "center" }}>
                <span style={{ fontFamily: "var(--font-jost)", fontWeight: 800, fontSize: 11, letterSpacing: "0.15em", color: result.expected ? PINK : "rgba(200,40,40,0.8)" }}>
                  {result.expected ? "✓ EXPECTED GUEST" : "⚠ NOT ON THE LIST"}
                </span>
              </div>

              {/* Member info */}
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                {result.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={result.avatar_url} alt={result.name} style={{ width: 56, height: 56, borderRadius: "50%", objectFit: "cover", border: `2px solid ${PINK}40`, flexShrink: 0 }} />
                ) : (
                  <div style={{ width: 56, height: 56, borderRadius: "50%", background: `linear-gradient(135deg, ${PINK}, #c4005a)`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ fontFamily: "var(--font-jost)", fontWeight: 800, fontSize: 20, color: "white" }}>{result.name[0]?.toUpperCase()}</span>
                  </div>
                )}
                <div>
                  <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 20, color: "var(--bb-text)", margin: "0 0 2px" }}>{result.name}</p>
                  {result.neighborhood && <p style={{ fontFamily: "var(--font-jost)", fontSize: 11, color: "var(--bb-text-3)", margin: 0 }}>{result.neighborhood}</p>}
                  {result.already_checked_in && <p style={{ fontFamily: "var(--font-jost)", fontSize: 10, color: PINK, margin: "4px 0 0", fontWeight: 700 }}>Already checked in ✓</p>}
                </div>
              </div>

              {/* Action buttons */}
              {!checkedIn && result.expected && !result.already_checked_in && (
                <button onClick={checkIn} style={{ marginTop: 16, width: "100%", padding: "14px", borderRadius: 14, border: "none", background: PINK, color: "white", fontFamily: "var(--font-jost)", fontWeight: 700, fontSize: 13, letterSpacing: "0.08em", cursor: "pointer" }}>
                  Check her in ✓
                </button>
              )}
              {checkedIn && (
                <div style={{ marginTop: 12, textAlign: "center", padding: "10px", background: `rgba(255,31,125,0.08)`, borderRadius: 12 }}>
                  <p style={{ fontFamily: "var(--font-jost)", fontWeight: 700, fontSize: 12, color: PINK, margin: 0 }}>Checked in ✦</p>
                </div>
              )}
              {result.expected === false && (
                <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 12, color: "var(--bb-text-2)", textAlign: "center", marginTop: 12, lineHeight: 1.5 }}>
                  She&apos;s not on the RSVP list. Use your judgement — this space is yours to protect.
                </p>
              )}

              {/* Next scan */}
              <button onClick={() => { setCode(""); setResult(null); setError(""); setCheckedIn(false); }} style={{ marginTop: 12, width: "100%", padding: "10px", borderRadius: 12, border: "1px solid var(--bb-border)", background: "none", color: "var(--bb-text-2)", fontFamily: "var(--font-jost)", fontSize: 12, cursor: "pointer" }}>
                Next member →
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
