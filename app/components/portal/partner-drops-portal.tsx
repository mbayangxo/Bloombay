"use client";

import { useState, useEffect, useCallback, useRef } from "react";

const PINK   = "#FF1F7D";
const DARK   = "#1A1A1A";
const GREEN  = "#16A34A";
const RED    = "#DC2626";
const GRAY   = "#9CA3AF";

// ─── Types ────────────────────────────────────────────────────────────────────

type ClaimStatus = "active" | "redeemed" | "expired";

interface ClaimDetail {
  code:          string;
  claimed_at:    string;
  redeemed_at:   string | null;
  drop_id:       string;
  drop_title:    string;
  drop_category: string;
  partner_name:  string;
  neighborhood:  string | null;
  valid_until:   string | null;
  instructions:  string | null;
  cover_color_a: string;
  cover_color_b: string;
  member_name:   string;
  status:        ClaimStatus;
}

interface ClaimRow {
  claim_id:     string;
  code:         string;
  claimed_at:   string;
  redeemed_at:  string | null;
  drop_title:   string;
  drop_id:      string;
  partner_name: string;
  valid_until:  string | null;
  member_name:  string;
  status:       ClaimStatus;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}
function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}
function fmtDateTime(iso: string) {
  return `${fmtDate(iso)} at ${fmtTime(iso)}`;
}

// ─── Status chip ──────────────────────────────────────────────────────────────

function StatusChip({ status }: { status: ClaimStatus }) {
  const cfg = {
    active:   { bg: "#F0FFF4", border: "#4CAF50", color: GREEN,  label: "ACTIVE"    },
    redeemed: { bg: "rgba(0,0,0,0.04)", border: "rgba(0,0,0,0.1)", color: GRAY, label: "REDEEMED" },
    expired:  { bg: "#FFF5F5", border: "#FCA5A5", color: RED,    label: "EXPIRED"   },
  }[status];
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 4, background: cfg.bg, border: `1.5px solid ${cfg.border}`, borderRadius: 99, padding: "3px 10px" }}>
      {status === "active"   && <div style={{ width: 6, height: 6, borderRadius: "50%", background: GREEN, animation: "pulse 2s infinite" }}/>}
      <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 900, color: cfg.color, letterSpacing: "0.14em" }}>{cfg.label}</p>
    </div>
  );
}

// ─── Claim detail card (shown after code verification) ────────────────────────

function ClaimCard({ detail, onRedeem, redeeming }: {
  detail: ClaimDetail;
  onRedeem: () => void;
  redeeming: boolean;
}) {
  const canRedeem = detail.status === "active";
  return (
    <div style={{ borderRadius: 20, overflow: "hidden", boxShadow: "0 8px 32px rgba(0,0,0,0.12)", marginTop: 16 }}>
      {/* Gradient header */}
      <div style={{ background: `linear-gradient(135deg, ${detail.cover_color_a}, ${detail.cover_color_b})`, padding: "20px 20px 16px", position: "relative" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
          <div>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "7.5px", fontWeight: 800, color: "rgba(255,255,255,0.6)", letterSpacing: "0.18em", marginBottom: 4 }}>BLOOM DROP</p>
            <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900, fontSize: 22, color: "white", lineHeight: 1.05 }}>{detail.drop_title}</p>
            <p style={{ fontFamily: "var(--font-caveat)", fontSize: 13, color: "rgba(255,255,255,0.68)", marginTop: 2 }}>{detail.partner_name}{detail.neighborhood ? ` · ${detail.neighborhood}` : ""}</p>
          </div>
          <StatusChip status={detail.status}/>
        </div>
      </div>

      {/* Body */}
      <div style={{ background: "white", padding: "18px 20px 20px" }}>
        {/* Code display */}
        <div style={{ background: detail.status === "active" ? `${PINK}08` : "rgba(0,0,0,0.03)", borderRadius: 14, padding: "14px 16px", border: `1.5px solid ${detail.status === "active" ? `${PINK}20` : "rgba(0,0,0,0.07)"}`, marginBottom: 16, textAlign: "center" }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "7.5px", fontWeight: 800, color: "rgba(0,0,0,0.28)", letterSpacing: "0.2em", marginBottom: 6 }}>REDEMPTION CODE</p>
          <p style={{ fontFamily: "var(--font-jost)", fontWeight: 900, fontSize: 28, color: detail.status === "active" ? PINK : GRAY, letterSpacing: "0.15em", marginBottom: 0 }}>{detail.code}</p>
        </div>

        {/* Member + dates grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 14px", marginBottom: 16 }}>
          <div>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "7.5px", fontWeight: 800, color: "rgba(0,0,0,0.3)", letterSpacing: "0.14em", marginBottom: 3 }}>MEMBER</p>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 14, fontWeight: 700, color: DARK }}>Hi, {detail.member_name}!</p>
          </div>
          <div>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "7.5px", fontWeight: 800, color: "rgba(0,0,0,0.3)", letterSpacing: "0.14em", marginBottom: 3 }}>CLAIMED</p>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 11, fontWeight: 600, color: DARK }}>{fmtDate(detail.claimed_at)}</p>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 10, color: "#888" }}>{fmtTime(detail.claimed_at)}</p>
          </div>
          {detail.valid_until && (
            <div>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "7.5px", fontWeight: 800, color: "rgba(0,0,0,0.3)", letterSpacing: "0.14em", marginBottom: 3 }}>VALID UNTIL</p>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: 11, fontWeight: 600, color: detail.status === "expired" ? RED : DARK }}>{fmtDate(detail.valid_until)}</p>
            </div>
          )}
          {detail.redeemed_at && (
            <div>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "7.5px", fontWeight: 800, color: "rgba(0,0,0,0.3)", letterSpacing: "0.14em", marginBottom: 3 }}>REDEEMED</p>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: 11, fontWeight: 600, color: GRAY }}>{fmtDateTime(detail.redeemed_at)}</p>
            </div>
          )}
        </div>

        {/* Instructions */}
        {detail.instructions && (
          <div style={{ background: "rgba(0,0,0,0.03)", borderRadius: 10, padding: "10px 12px", marginBottom: 16 }}>
            <p style={{ fontFamily: "var(--font-caveat)", fontSize: 13, color: "rgba(0,0,0,0.55)", lineHeight: 1.5 }}>{detail.instructions}</p>
          </div>
        )}

        {/* Redeem CTA */}
        {detail.status === "redeemed" ? (
          <div style={{ background: "rgba(0,0,0,0.04)", borderRadius: 12, padding: "14px", textAlign: "center" }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 11, fontWeight: 700, color: GRAY }}>Already redeemed · {detail.redeemed_at ? fmtDateTime(detail.redeemed_at) : ""}</p>
          </div>
        ) : detail.status === "expired" ? (
          <div style={{ background: "#FFF5F5", borderRadius: 12, padding: "14px", textAlign: "center" }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 11, fontWeight: 700, color: RED }}>This drop has expired</p>
          </div>
        ) : (
          <button
            onClick={onRedeem}
            disabled={redeeming}
            style={{
              width: "100%", padding: "15px", borderRadius: 50,
              background: redeeming ? "rgba(0,0,0,0.08)" : `linear-gradient(135deg, ${GREEN}, #15803D)`,
              border: "none", cursor: redeeming ? "default" : "pointer",
              fontFamily: "var(--font-jost)", fontSize: 13, fontWeight: 900,
              color: redeeming ? "#aaa" : "white", letterSpacing: "0.06em",
              boxShadow: redeeming ? "none" : "0 6px 20px rgba(22,163,74,0.35)",
              transition: "all 0.15s",
            }}
          >
            {redeeming ? "Marking as redeemed…" : "✓ Redeem Now"}
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Claims list row ──────────────────────────────────────────────────────────

function ClaimRow({ row, onSelect }: { row: ClaimRow; onSelect: () => void }) {
  return (
    <button onClick={onSelect} style={{ width: "100%", background: "white", border: "1px solid rgba(0,0,0,0.07)", borderRadius: 14, padding: "12px 14px", display: "flex", alignItems: "center", gap: 12, cursor: "pointer", textAlign: "left", marginBottom: 8 }}>
      {/* Color dot for drop */}
      <div style={{ width: 40, height: 40, borderRadius: 10, background: `linear-gradient(135deg, ${PINK}80, ${PINK}40)`, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 900, color: "white" }}>BB</p>
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 2 }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: 12, fontWeight: 700, color: DARK, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {row.member_name} · {row.drop_title}
          </p>
          <StatusChip status={row.status}/>
        </div>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: 10, fontWeight: 800, color: PINK, letterSpacing: "0.1em", marginBottom: 1 }}>{row.code}</p>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, color: "#999" }}>{fmtDate(row.claimed_at)} · {fmtTime(row.claimed_at)}</p>
      </div>

      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="2.5" strokeLinecap="round" style={{ flexShrink: 0 }}>
        <path d="M9 18l6-6-6-6"/>
      </svg>
    </button>
  );
}

// ─── QR Scanner ───────────────────────────────────────────────────────────────

const SCANNER_EL_ID = "bb-partner-qr-scanner";

function QRScanner({ onCode, onClose }: { onCode: (code: string) => void; onClose: () => void }) {
  const [camError, setCamError] = useState<string | null>(null);
  const [scanning, setScanning] = useState(true);
  const scannerRef = useRef<unknown>(null);

  useEffect(() => {
    let stopped = false;
    async function start() {
      try {
        const { Html5Qrcode } = await import("html5-qrcode");
        const scanner = new Html5Qrcode(SCANNER_EL_ID);
        scannerRef.current = scanner;
        await scanner.start(
          { facingMode: "environment" },
          { fps: 12, qrbox: { width: 220, height: 220 } },
          (text: string) => {
            if (stopped) return;
            const code = text.trim().toUpperCase();
            stopped = true;
            setScanning(false);
            scanner.stop().catch(() => {});
            onCode(code);
          },
          () => {}
        );
      } catch {
        setCamError("Camera access denied.\nAllow camera and try again.");
      }
    }
    start();
    return () => {
      stopped = true;
      const s = scannerRef.current as { stop?: () => Promise<void> } | null;
      s?.stop?.().catch(() => {});
    };
  }, [onCode]);

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 300, background: "rgba(0,0,0,0.92)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 900, color: "rgba(255,255,255,0.5)", letterSpacing: "0.2em", marginBottom: 18 }}>SCAN MEMBER QR CODE</p>

      {camError ? (
        <div style={{ textAlign: "center", padding: "24px" }}>
          <p style={{ fontFamily: "var(--font-caveat)", fontSize: 16, color: "#FF8A8A", lineHeight: 1.7 }}>{camError}</p>
          <button onClick={onClose} style={{ marginTop: 20, padding: "12px 28px", borderRadius: 99, background: "white", border: "none", cursor: "pointer", fontFamily: "var(--font-jost)", fontSize: 12, fontWeight: 800, color: DARK }}>
            Go back
          </button>
        </div>
      ) : (
        <>
          {/* Camera viewfinder */}
          <div style={{ position: "relative", width: 270, height: 270 }}>
            {/* Corner brackets */}
            {[["0 0", "top", "left"], ["90 50% 50%", "top", "right"], ["180 50% 50%", "bottom", "right"], ["270 50% 50%", "bottom", "left"]].map(([rot, v, h], i) => (
              <svg key={i} width="28" height="28" viewBox="0 0 28 28" fill="none"
                style={{ position: "absolute", [v]: -2, [h]: -2, transform: `rotate(${rot.split(" ")[0]}deg)` }}>
                <path d="M2 18 L2 4 Q2 2 4 2 L18 2" stroke={PINK} strokeWidth="3" strokeLinecap="round"/>
              </svg>
            ))}
            <div id={SCANNER_EL_ID} style={{ width: 270, height: 270, borderRadius: 14, overflow: "hidden", background: "#000" }}/>
            {scanning && (
              <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${PINK}, transparent)`, animation: "scanline 2s linear infinite", pointerEvents: "none" }}/>
            )}
          </div>

          <p style={{ fontFamily: "var(--font-caveat)", fontSize: 15, color: "rgba(255,255,255,0.45)", marginTop: 20, textAlign: "center" }}>
            Point at the QR code on the<br/>member's phone
          </p>

          <button
            onClick={onClose}
            style={{ marginTop: 24, padding: "11px 28px", borderRadius: 99, background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.18)", cursor: "pointer", fontFamily: "var(--font-jost)", fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.7)" }}
          >
            Cancel
          </button>
        </>
      )}

      <style>{`
        @keyframes scanline {
          0% { top: 10%; opacity: 0.8; }
          50% { opacity: 1; }
          100% { top: 90%; opacity: 0.8; }
        }
      `}</style>
    </div>
  );
}

// ─── Main portal ──────────────────────────────────────────────────────────────

export function PartnerDropsPortal() {
  const [tab, setTab]           = useState<"verify" | "all">("verify");
  const [codeInput, setCodeInput] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [redeeming, setRedeeming] = useState(false);
  const [detail, setDetail]       = useState<ClaimDetail | null>(null);
  const [lookupError, setLookupError] = useState<string | null>(null);
  const [claims, setClaims]       = useState<ClaimRow[]>([]);
  const [claimsLoading, setClaimsLoading] = useState(false);
  const [filter, setFilter]       = useState<ClaimStatus | "all">("all");
  const [scannerOpen, setScannerOpen] = useState(false);

  async function verify(overrideCode?: string) {
    const code = (overrideCode ?? codeInput).trim().toUpperCase();
    if (!code) return;
    setVerifying(true); setDetail(null); setLookupError(null);
    try {
      const res = await fetch(`/api/drops/verify?code=${encodeURIComponent(code)}`);
      const data = await res.json();
      if (data.error) { setLookupError(data.error === "not_found" ? "Code not found — check it and try again." : data.error); return; }
      setDetail(data as ClaimDetail);
    } catch { setLookupError("Network error — please try again."); }
    finally { setVerifying(false); }
  }

  function handleScanned(code: string) {
    setScannerOpen(false);
    setCodeInput(code);
    verify(code);
  }

  async function redeem() {
    if (!detail || detail.status !== "active") return;
    setRedeeming(true);
    try {
      const res = await fetch("/api/drops/redeem", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: detail.code }),
      });
      const data = await res.json();
      if (data.ok) {
        setDetail(prev => prev ? { ...prev, status: "redeemed", redeemed_at: new Date().toISOString() } : null);
        // refresh list if it's loaded
        if (claims.length > 0) {
          setClaims(prev => prev.map(c =>
            c.code === detail.code
              ? { ...c, status: "redeemed", redeemed_at: new Date().toISOString() }
              : c
          ));
        }
      }
    } catch { /* silent */ }
    finally { setRedeeming(false); }
  }

  const fetchClaims = useCallback(() => {
    setClaimsLoading(true);
    fetch("/api/drops/all-claims")
      .then(r => r.json())
      .then(d => { if (Array.isArray(d.claims)) setClaims(d.claims); })
      .catch(() => {})
      .finally(() => setClaimsLoading(false));
  }, []);

  useEffect(() => {
    if (tab === "all" && claims.length === 0) fetchClaims();
  }, [tab, claims.length, fetchClaims]);

  const filtered = filter === "all" ? claims : claims.filter(c => c.status === filter);

  const tabStyle = (t: "verify" | "all") => ({
    flex: 1, padding: "10px 0", borderRadius: 10, border: "none", cursor: "pointer" as const,
    fontFamily: "var(--font-jost)", fontSize: 11, fontWeight: 800,
    background: tab === t ? "white" : "transparent",
    color: tab === t ? DARK : "#aaa",
    boxShadow: tab === t ? "0 2px 8px rgba(0,0,0,0.08)" : "none",
    transition: "all 0.15s",
  });

  return (
    <div style={{
      background: "#F7F7F8",
      minHeight: "100vh",
      paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 120px)",
      paddingTop: "calc(env(safe-area-inset-top, 0px) + 54px)",
    }}>
      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        .pr-input::placeholder { color: #ccc; }
        .pr-input:focus { outline: none; border-color: ${PINK}; box-shadow: 0 0 0 3px ${PINK}18; }
      `}</style>

      {/* Header */}
      <div style={{ padding: "24px 20px 20px", background: "white", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 900, color: PINK, letterSpacing: "0.2em", marginBottom: 4 }}>PARTNER PORTAL</p>
        <h1 style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900, fontSize: 26, color: DARK, lineHeight: 1, margin: 0 }}>Drop Redemptions</h1>
        <p style={{ fontFamily: "var(--font-caveat)", fontSize: 14, color: "rgba(0,0,0,0.45)", marginTop: 4 }}>Verify and redeem member codes in real time.</p>
      </div>

      <div style={{ padding: "16px 18px 0" }}>
        {/* Tab switcher */}
        <div style={{ display: "flex", gap: 4, background: "rgba(0,0,0,0.06)", borderRadius: 12, padding: 4, marginBottom: 20 }}>
          <button style={tabStyle("verify")} onClick={() => setTab("verify")}>Verify Code</button>
          <button style={tabStyle("all")} onClick={() => setTab("all")}>All Claims {claims.length > 0 ? `(${claims.length})` : ""}</button>
        </div>

        {/* ── VERIFY TAB ──────────────────────────────────────────────────── */}
        {tab === "verify" && (
          <div>
            {/* Primary: Scan QR button */}
            <button
              onClick={() => { setScannerOpen(true); setDetail(null); setLookupError(null); }}
              style={{
                width: "100%", padding: "16px", borderRadius: 16, border: "none",
                background: `linear-gradient(135deg, ${PINK}, #C4005A)`,
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                gap: 10, marginBottom: 14,
                boxShadow: `0 6px 22px ${PINK}38`,
              }}
            >
              {/* Camera icon */}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/>
                <circle cx="12" cy="13" r="4"/>
              </svg>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: 13, fontWeight: 900, color: "white", letterSpacing: "0.06em" }}>
                Scan QR Code
              </p>
            </button>

            {/* Divider */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <div style={{ flex: 1, height: 1, background: "rgba(0,0,0,0.08)" }}/>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 700, color: "rgba(0,0,0,0.3)", letterSpacing: "0.1em" }}>OR TYPE CODE</p>
              <div style={{ flex: 1, height: 1, background: "rgba(0,0,0,0.08)" }}/>
            </div>

            {/* Code input */}
            <div style={{ display: "flex", gap: 8 }}>
              <input
                className="pr-input"
                value={codeInput}
                onChange={e => { setCodeInput(e.target.value.toUpperCase()); setDetail(null); setLookupError(null); }}
                onKeyDown={e => e.key === "Enter" && verify()}
                placeholder="BB123456"
                maxLength={8}
                style={{
                  flex: 1, padding: "13px 16px", borderRadius: 12,
                  border: "1.5px solid rgba(0,0,0,0.1)",
                  fontFamily: "var(--font-jost)", fontSize: 18, fontWeight: 900,
                  color: DARK, background: "white",
                  letterSpacing: "0.1em", textTransform: "uppercase",
                  transition: "border-color 0.15s, box-shadow 0.15s",
                }}
              />
              <button
                onClick={() => verify()}
                disabled={verifying || codeInput.length < 3}
                style={{
                  padding: "13px 18px", borderRadius: 12, border: "none",
                  background: verifying || codeInput.length < 3 ? "rgba(0,0,0,0.08)" : DARK,
                  cursor: verifying || codeInput.length < 3 ? "default" : "pointer",
                  fontFamily: "var(--font-jost)", fontSize: 11, fontWeight: 900,
                  color: verifying || codeInput.length < 3 ? "#aaa" : "white",
                  whiteSpace: "nowrap",
                  transition: "all 0.15s",
                }}
              >{verifying ? "…" : "Verify →"}</button>
            </div>

            {/* Error */}
            {lookupError && (
              <div style={{ background: "#FFF5F5", border: "1px solid #FCA5A5", borderRadius: 10, padding: "10px 14px", marginTop: 12 }}>
                <p style={{ fontFamily: "var(--font-caveat)", fontSize: 13, color: RED }}>{lookupError}</p>
              </div>
            )}

            {/* Claim detail */}
            {detail && (
              <ClaimCard detail={detail} onRedeem={redeem} redeeming={redeeming}/>
            )}

            {/* Empty state */}
            {!detail && !lookupError && (
              <div style={{ marginTop: 36, textAlign: "center" }}>
                <p style={{ fontFamily: "var(--font-caveat)", fontSize: 15, color: "rgba(0,0,0,0.35)", lineHeight: 1.8 }}>
                  Scan the QR code on the member's phone<br/>or type the BB code manually.
                </p>
              </div>
            )}
          </div>
        )}

        {/* ── ALL CLAIMS TAB ──────────────────────────────────────────────── */}
        {tab === "all" && (
          <div>
            {/* Status filter */}
            <div style={{ display: "flex", gap: 8, marginBottom: 16, overflowX: "auto", scrollbarWidth: "none" as const }}>
              {(["all", "active", "redeemed", "expired"] as const).map(f => (
                <button key={f} onClick={() => setFilter(f)} style={{
                  flexShrink: 0, padding: "6px 14px", borderRadius: 99,
                  background: filter === f ? DARK : "white",
                  border: `1.5px solid ${filter === f ? DARK : "rgba(0,0,0,0.08)"}`,
                  color: filter === f ? "white" : "#666",
                  fontFamily: "var(--font-jost)", fontSize: 10, fontWeight: 700,
                  cursor: "pointer", transition: "all 0.15s", textTransform: "capitalize",
                }}>{f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}</button>
              ))}
              <button onClick={fetchClaims} style={{ flexShrink: 0, padding: "6px 10px", borderRadius: 99, background: "white", border: "1.5px solid rgba(0,0,0,0.08)", color: "#888", fontFamily: "var(--font-jost)", fontSize: 10, fontWeight: 700, cursor: "pointer" }}>↻ Refresh</button>
            </div>

            {/* Stats strip */}
            {claims.length > 0 && (
              <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
                {(["active", "redeemed", "expired"] as ClaimStatus[]).map(s => {
                  const count = claims.filter(c => c.status === s).length;
                  const colors: Record<ClaimStatus, string> = { active: GREEN, redeemed: GRAY, expired: RED };
                  return (
                    <div key={s} style={{ flex: 1, background: "white", borderRadius: 12, padding: "10px 12px", textAlign: "center", border: "1px solid rgba(0,0,0,0.06)" }}>
                      <p style={{ fontFamily: "var(--font-jost)", fontSize: 22, fontWeight: 900, color: colors[s], lineHeight: 1 }}>{count}</p>
                      <p style={{ fontFamily: "var(--font-jost)", fontSize: "7.5px", fontWeight: 800, color: "rgba(0,0,0,0.35)", letterSpacing: "0.12em", marginTop: 3, textTransform: "uppercase" }}>{s}</p>
                    </div>
                  );
                })}
              </div>
            )}

            {/* List */}
            {claimsLoading ? (
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <p style={{ fontFamily: "var(--font-caveat)", fontSize: 15, color: "rgba(0,0,0,0.3)" }}>Loading claims…</p>
              </div>
            ) : filtered.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <p style={{ fontFamily: "var(--font-caveat)", fontSize: 15, color: "rgba(0,0,0,0.3)" }}>No {filter !== "all" ? filter : ""} claims yet.</p>
              </div>
            ) : (
              <div>
                {filtered.map(row => (
                  <ClaimRow
                    key={row.claim_id}
                    row={row}
                    onSelect={() => {
                      setCodeInput(row.code);
                      setTab("verify");
                      fetch(`/api/drops/verify?code=${row.code}`)
                        .then(r => r.json())
                        .then(d => { if (!d.error) setDetail(d); });
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* QR Scanner overlay */}
      {scannerOpen && (
        <QRScanner onCode={handleScanned} onClose={() => setScannerOpen(false)}/>
      )}
    </div>
  );
}
