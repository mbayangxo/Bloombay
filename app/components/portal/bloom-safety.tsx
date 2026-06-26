"use client";

import { useState } from "react";
import Link from "next/link";
import {
  MEMBER_REPORT_REASONS,
  type MemberReportReason,
  resolveMemberId,
  submitMemberReport,
} from "@/lib/member-safety-client";

const PINK = "#FF1F7D";
const PLUM = "#1A0A2E";

// Silhouette Rule: looks like a shield. Second look: five petal arcs form the
// body; the pointed base is a stem. It's a bloom wearing armour.
function BloomShield({ size = 22, color = "white" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 3 C9 3 5 5 4 8 C3 11 4 15 6 17.5 C8 20 10.5 21.5 12 22" stroke={color} strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <path d="M12 3 C15 3 19 5 20 8 C21 11 20 15 18 17.5 C16 20 13.5 21.5 12 22" stroke={color} strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <path d="M12 5 C10 5.5 7 7.5 6.5 10 C6 12.5 7 15.5 8.5 17.2 C10 18.9 11.5 20 12 20.5 C12.5 20 14 18.9 15.5 17.2 C17 15.5 18 12.5 17.5 10 C17 7.5 14 5.5 12 5Z" fill={color} opacity="0.15" />
      <path d="M9 12 l2 2 l4 -4" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BloomShieldFilled({ size = 22, color = PINK }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 3 C9 3 5 5 4 8 C3 11 4 15 6 17.5 C8 20 10.5 21.5 12 22 C13.5 21.5 16 20 18 17.5 C20 15 21 11 20 8 C19 5 15 3 12 3Z" fill={color} opacity="0.15" />
      <path d="M12 3 C9 3 5 5 4 8 C3 11 4 15 6 17.5 C8 20 10.5 21.5 12 22" stroke={color} strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M12 3 C15 3 19 5 20 8 C21 11 20 15 18 17.5 C16 20 13.5 21.5 12 22" stroke={color} strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M9 12 l2 2 l4 -4" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ── Demo bouquet (until Supabase bloom_bouquet table is wired) ────────────────
const DEMO_BOUQUET = [
  { id: "1", name: "Aaliyah",  initial: "A", color: "#7B2FF7" },
  { id: "2", name: "Sofia",    initial: "S", color: "#FF69B4" },
  { id: "3", name: "Kelechi",  initial: "K", color: "#D4A853" },
  { id: "4", name: "Naomi",    initial: "N", color: "#2EC4B6" },
  { id: "5", name: "Temi",     initial: "T", color: "#E63946" },
  { id: "6", name: "Zara",     initial: "Z", color: "#FF1F7D" },
];

type CheckInDuration = 1 | 2 | 4;

interface BloomSafetySheetProps {
  onClose: () => void;
}

export function BloomSafetySheet({ onClose }: BloomSafetySheetProps) {
  const [checkInHours, setCheckInHours]   = useState<CheckInDuration | null>(null);
  const [checkInActive, setCheckInActive] = useState(false);
  const [checkedInSafe, setCheckedInSafe] = useState(false);
  const [pingsSent, setPingsSent]         = useState(false);
  const [contactName,  setContactName]    = useState("");
  const [contactPhone, setContactPhone]   = useState("");
  const [reportOpen,     setReportOpen]     = useState(false);
  const [reportTarget,   setReportTarget]   = useState("");
  const [reportCategory, setReportCategory] = useState<MemberReportReason>("other");
  const [reportText,     setReportText]     = useState("");
  const [reportSent,     setReportSent]     = useState(false);
  const [reportLoading,  setReportLoading]  = useState(false);
  const [reportError,    setReportError]    = useState<string | null>(null);

  function activateCheckIn(h: CheckInDuration) {
    setCheckInHours(h);
    setCheckInActive(true);
  }

  function markSafeArrival() {
    setCheckedInSafe(true);
    setCheckInActive(false);
    setTimeout(() => onClose(), 1200);
  }

  function pingBouquet() {
    setPingsSent(true);
    // In production: insert into safety_pings for each bouquet member,
    // which triggers a notification to each girl.
  }

  function resetReportForm() {
    setReportOpen(false);
    setReportTarget("");
    setReportCategory("other");
    setReportText("");
    setReportSent(false);
    setReportLoading(false);
    setReportError(null);
  }

  async function sendReport() {
    if (!reportTarget.trim() || !reportText.trim() || reportLoading) return;
    setReportLoading(true);
    setReportError(null);
    try {
      const reported_id = await resolveMemberId(reportTarget);
      await submitMemberReport({
        reported_id,
        reason: reportCategory,
        details: reportText,
        source_type: "bloom_safety",
      });
      setReportSent(true);
      setTimeout(resetReportForm, 2000);
    } catch (e) {
      setReportError(e instanceof Error ? e.message : "Could not submit report");
    } finally {
      setReportLoading(false);
    }
  }

  return (
    <>
      <div
        style={{ position: "fixed", inset: 0, zIndex: 300, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }}
        onClick={onClose}
      />
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 301,
        background: "#0F0F14",
        borderRadius: "24px 24px 0 0",
        maxHeight: "90vh",
        overflowY: "auto",
        boxShadow: "0 -12px 60px rgba(0,0,0,0.5)",
      }}>
        {/* Drag handle */}
        <div style={{ display: "flex", justifyContent: "center", padding: "14px 0 6px" }}>
          <div style={{ width: 36, height: 4, borderRadius: 999, background: "rgba(255,255,255,0.15)" }} />
        </div>

        {/* Header */}
        <div style={{ padding: "4px 24px 0", display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <BloomShieldFilled size={20} color={PINK} />
              <span style={{ fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 900, letterSpacing: "0.2em", color: PINK }}>
                BLOOM SAFETY
              </span>
            </div>
            <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 22, color: "white", lineHeight: 1.1 }}>
              You&apos;re always protected.
            </p>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "11px", color: "rgba(255,255,255,0.35)", marginTop: 4 }}>
              Only for BloomBay women.
            </p>
          </div>
          <button
            onClick={onClose}
            style={{ background: "rgba(255,255,255,0.08)", border: "none", borderRadius: "50%", width: 32, height: 32, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 4 }}
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.8" strokeLinecap="round"><path d="M1 1l8 8M9 1l-8 8"/></svg>
          </button>
        </div>

        <div style={{ padding: "20px 24px 48px", display: "flex", flexDirection: "column", gap: 16 }}>

          {/* ── Your Bouquet ────────────────────────────────────────────────── */}
          <div style={{
            background: "rgba(255,31,125,0.06)",
            border: `1px solid ${pingsSent ? PINK + "66" : "rgba(255,31,125,0.2)"}`,
            borderRadius: 18,
            padding: "16px 18px",
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <div>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "12px", fontWeight: 700, color: "white" }}>
                  Your Bouquet
                </p>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "10px", color: "rgba(255,255,255,0.35)", marginTop: 1 }}>
                  {pingsSent
                    ? "Your girls have been quietly notified ✦"
                    : "Your 12 closest Bloomies. They'll get a quiet ping."}
                </p>
              </div>
              <Link
                href="/member/lounge/bloomies"
                onClick={onClose}
                style={{
                  fontFamily: "var(--font-jost)", fontSize: "10px", fontWeight: 700,
                  color: PINK, textDecoration: "none", letterSpacing: "0.04em",
                }}
              >
                Edit →
              </Link>
            </div>

            {/* Girl avatars */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 14 }}>
              {DEMO_BOUQUET.map(girl => (
                <div key={girl.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: "50%",
                    background: `linear-gradient(135deg, ${girl.color}cc, ${girl.color}66)`,
                    border: `2px solid ${girl.color}44`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: "var(--font-jost)", fontSize: "14px", fontWeight: 800, color: "white",
                  }}>
                    {girl.initial}
                  </div>
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", color: "rgba(255,255,255,0.4)", textAlign: "center" }}>
                    {girl.name}
                  </p>
                </div>
              ))}
              {/* Add slot */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: "50%",
                  border: "1.5px dashed rgba(255,255,255,0.15)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" strokeLinecap="round">
                    <path d="M6 2v8M2 6h8"/>
                  </svg>
                </div>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", color: "rgba(255,255,255,0.2)", textAlign: "center" }}>
                  Add
                </p>
              </div>
            </div>

            {!pingsSent ? (
              <button
                onClick={pingBouquet}
                style={{
                  width: "100%", padding: "13px 0",
                  borderRadius: 999,
                  border: "none",
                  background: PINK,
                  color: "white",
                  fontFamily: "var(--font-jost)", fontSize: "12px", fontWeight: 800,
                  cursor: "pointer",
                  boxShadow: `0 2px 0 rgba(150,0,55,0.8), 0 6px 20px ${PINK}44`,
                  letterSpacing: "0.04em",
                }}
              >
                Ping my bouquet quietly ✦
              </button>
            ) : (
              <div style={{
                textAlign: "center", padding: "12px",
                fontFamily: "var(--font-caveat)", fontSize: "16px",
                color: "rgba(255,255,255,0.6)",
              }}>
                They know. You&apos;re not alone. 🌸
              </div>
            )}
          </div>

          {/* ── Safe Check-In ─────────────────────────────────────────────── */}
          <div style={{
            background: checkInActive ? "rgba(255,31,125,0.08)" : "rgba(255,255,255,0.04)",
            border: `1px solid ${checkInActive ? "rgba(255,31,125,0.3)" : "rgba(255,255,255,0.08)"}`,
            borderRadius: 18,
            padding: "18px 18px 16px",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: 10, background: "rgba(255,31,125,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={PINK} strokeWidth="2" strokeLinecap="round">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 6v6l4 2"/>
                </svg>
              </div>
              <div>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "12px", fontWeight: 700, color: "white" }}>
                  Safe Check-In
                </p>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "10px", color: "rgba(255,255,255,0.35)", marginTop: 1 }}>
                  {checkInActive
                    ? `Active — checking in ${checkInHours}h · your contact will be alerted if you don't respond`
                    : "Set a timer. If you don't check in, your contact is notified."}
                </p>
              </div>
            </div>

            {!checkInActive ? (
              <div style={{ display: "flex", gap: 8 }}>
                {([1, 2, 4] as CheckInDuration[]).map(h => (
                  <button
                    key={h}
                    onClick={() => activateCheckIn(h)}
                    style={{
                      flex: 1, padding: "10px 0", borderRadius: 999,
                      border: "1px solid rgba(255,255,255,0.12)",
                      background: "rgba(255,255,255,0.06)",
                      color: "rgba(255,255,255,0.75)",
                      fontFamily: "var(--font-jost)", fontSize: "11px", fontWeight: 700, cursor: "pointer",
                    }}
                  >
                    {h}h
                  </button>
                ))}
              </div>
            ) : (
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={markSafeArrival}
                  style={{
                    flex: 1, padding: "12px 0", borderRadius: 999, border: "none",
                    background: PINK, color: "white",
                    fontFamily: "var(--font-jost)", fontSize: "12px", fontWeight: 800,
                    cursor: "pointer", boxShadow: `0 2px 0 rgba(150,0,55,0.8), 0 6px 18px ${PINK}44`,
                  }}
                >
                  {checkedInSafe ? "Safe ✦" : "I'm home safe →"}
                </button>
                <button
                  onClick={() => { setCheckInActive(false); setCheckInHours(null); }}
                  style={{
                    padding: "12px 18px", borderRadius: 999,
                    border: "1px solid rgba(255,255,255,0.12)",
                    background: "rgba(255,255,255,0.06)",
                    color: "rgba(255,255,255,0.5)",
                    fontFamily: "var(--font-jost)", fontSize: "11px", fontWeight: 600, cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          {/* ── Scan in at an event ─────────────────────────────────────────── */}
          <Link
            href="/member/happenings"
            onClick={onClose}
            style={{
              display: "flex", alignItems: "center", gap: 12,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 18,
              padding: "16px 18px",
              textDecoration: "none",
            }}
          >
            <div style={{ width: 32, height: 32, borderRadius: 10, background: "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2" strokeLinecap="round">
                <rect x="3" y="3" width="5" height="5" rx="1"/><rect x="16" y="3" width="5" height="5" rx="1"/>
                <rect x="3" y="16" width="5" height="5" rx="1"/>
                <path d="M16 16h5M16 21h5M21 16v5"/>
                <path d="M9 3v3M3 9h3M9 9v3M9 12h3M12 9h3M12 12v3M12 15h3M15 12h3"/>
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "12px", fontWeight: 700, color: "white" }}>
                Scan into tonight&apos;s event
              </p>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "10px", color: "rgba(255,255,255,0.35)", marginTop: 1 }}>
                QR check-in at the venue · meet Bloomies · let Yande track your night
              </p>
            </div>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" strokeLinecap="round">
              <path d="M5 3l4 4-4 4"/>
            </svg>
          </Link>

          {/* ── My Safe Contact ─────────────────────────────────────────────── */}
          <div style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 18,
            padding: "18px 18px 16px",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <div style={{ width: 32, height: 32, borderRadius: 10, background: "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2" strokeLinecap="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <div>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "12px", fontWeight: 700, color: "white" }}>
                  Off-app Safe Contact
                </p>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "10px", color: "rgba(255,255,255,0.35)", marginTop: 1 }}>
                  For someone not on BloomBay. Saved locally on your device.
                </p>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <input
                value={contactName}
                onChange={e => setContactName(e.target.value)}
                placeholder="Contact name"
                style={{
                  padding: "11px 14px", borderRadius: 12,
                  border: "1px solid rgba(255,255,255,0.1)",
                  background: "rgba(255,255,255,0.06)",
                  color: "white", fontFamily: "var(--font-jost)", fontSize: "13px",
                  outline: "none", width: "100%", boxSizing: "border-box",
                }}
              />
              <input
                value={contactPhone}
                onChange={e => setContactPhone(e.target.value)}
                placeholder="Phone number"
                type="tel"
                style={{
                  padding: "11px 14px", borderRadius: 12,
                  border: "1px solid rgba(255,255,255,0.1)",
                  background: "rgba(255,255,255,0.06)",
                  color: "white", fontFamily: "var(--font-jost)", fontSize: "13px",
                  outline: "none", width: "100%", boxSizing: "border-box",
                }}
              />
              {contactPhone && (
                <div style={{ display: "flex", gap: 8 }}>
                  <a
                    href={`tel:${contactPhone}`}
                    style={{
                      flex: 1, padding: "10px 0", borderRadius: 999,
                      border: "1px solid rgba(255,255,255,0.15)",
                      background: "rgba(255,255,255,0.08)",
                      color: "white", fontFamily: "var(--font-jost)", fontSize: "11px",
                      fontWeight: 700, textAlign: "center", textDecoration: "none",
                    }}
                  >
                    📞 Call
                  </a>
                  <a
                    href={`sms:${contactPhone}&body=Hey, I wanted to let you know I'm out tonight. Just checking in.`}
                    style={{
                      flex: 1, padding: "10px 0", borderRadius: 999, border: "none",
                      background: PINK, color: "white",
                      fontFamily: "var(--font-jost)", fontSize: "11px", fontWeight: 700,
                      textAlign: "center", textDecoration: "none",
                      boxShadow: `0 2px 10px ${PINK}44`,
                    }}
                  >
                    💬 Text
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* ── Venue Verified ─────────────────────────────────────────────── */}
          <div style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 18, padding: "16px 18px",
            display: "flex", alignItems: "center", gap: 12,
          }}>
            <div style={{ width: 32, height: 32, borderRadius: 10, background: "rgba(255,31,125,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={PINK} strokeWidth="2" strokeLinecap="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                <path d="M9 12l2 2 4-4"/>
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "12px", fontWeight: 700, color: "white" }}>
                Bloom Partner venues only
              </p>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "10px", color: "rgba(255,255,255,0.35)", marginTop: 1 }}>
                Every happening venue is vetted by BloomBay before listing.
              </p>
            </div>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e", flexShrink: 0 }} />
          </div>

          {/* ── Report ─────────────────────────────────────────────────────── */}
          {!reportOpen ? (
            <button
              onClick={() => setReportOpen(true)}
              style={{
                padding: "14px", borderRadius: 14,
                border: "1px solid rgba(255,255,255,0.08)",
                background: "rgba(255,255,255,0.04)",
                color: "rgba(255,255,255,0.45)",
                fontFamily: "var(--font-jost)", fontSize: "12px", fontWeight: 600,
                cursor: "pointer", display: "flex", alignItems: "center", gap: 8,
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round">
                <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/>
                <line x1="4" y1="22" x2="4" y2="15"/>
              </svg>
              Report a situation to BloomBay
            </button>
          ) : (
            <div style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 18, padding: "16px 18px",
            }}>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "11px", fontWeight: 700, color: "white", marginBottom: 10 }}>
                {reportSent ? "Report received. We'll follow up shortly." : "Tell us what happened."}
              </p>
              {!reportSent && (
                <>
                  <input
                    value={reportTarget}
                    onChange={e => setReportTarget(e.target.value)}
                    placeholder="Member username (required)"
                    style={{
                      width: "100%", padding: "11px 14px", borderRadius: 12,
                      border: "1px solid rgba(255,255,255,0.1)",
                      background: "rgba(255,255,255,0.06)",
                      color: "white", fontFamily: "var(--font-jost)", fontSize: "13px",
                      outline: "none", boxSizing: "border-box", marginBottom: 10,
                    }}
                  />
                  <select
                    value={reportCategory}
                    onChange={e => setReportCategory(e.target.value as MemberReportReason)}
                    style={{
                      width: "100%", padding: "11px 14px", borderRadius: 12,
                      border: "1px solid rgba(255,255,255,0.1)",
                      background: "rgba(255,255,255,0.06)",
                      color: "white", fontFamily: "var(--font-jost)", fontSize: "13px",
                      outline: "none", boxSizing: "border-box", marginBottom: 10,
                    }}
                  >
                    {MEMBER_REPORT_REASONS.map(r => (
                      <option key={r.value} value={r.value} style={{ color: "#111" }}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                  <textarea
                    value={reportText}
                    onChange={e => setReportText(e.target.value)}
                    placeholder="Describe the situation. All reports are confidential."
                    rows={3}
                    style={{
                      width: "100%", padding: "11px 14px", borderRadius: 12,
                      border: "1px solid rgba(255,255,255,0.1)",
                      background: "rgba(255,255,255,0.06)",
                      color: "white", fontFamily: "var(--font-jost)", fontSize: "13px",
                      outline: "none", resize: "none", boxSizing: "border-box",
                      lineHeight: 1.5, marginBottom: 10,
                    }}
                  />
                  {reportError && (
                    <p style={{
                      fontFamily: "var(--font-jost)", fontSize: "11px", color: "#f87171",
                      marginBottom: 10, lineHeight: 1.4,
                    }}>
                      {reportError}
                    </p>
                  )}
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      onClick={sendReport}
                      disabled={reportLoading || !reportTarget.trim() || !reportText.trim()}
                      style={{
                        flex: 1, padding: "11px 0", borderRadius: 999, border: "none",
                        background: (reportTarget.trim() && reportText.trim() && !reportLoading) ? PINK : "rgba(255,255,255,0.08)",
                        color: (reportTarget.trim() && reportText.trim() && !reportLoading) ? "white" : "rgba(255,255,255,0.3)",
                        fontFamily: "var(--font-jost)", fontSize: "12px", fontWeight: 800,
                        cursor: (reportTarget.trim() && reportText.trim() && !reportLoading) ? "pointer" : "default",
                      }}
                    >
                      {reportLoading ? "Sending…" : "Submit report"}
                    </button>
                    <button
                      onClick={resetReportForm}
                      disabled={reportLoading}
                      style={{
                        padding: "11px 16px", borderRadius: 999,
                        border: "1px solid rgba(255,255,255,0.1)",
                        background: "none", color: "rgba(255,255,255,0.4)",
                        fontFamily: "var(--font-jost)", fontSize: "11px", cursor: "pointer",
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// ── Trigger button ────────────────────────────────────────────────────────────
export function BloomSafetyButton({ onOpen }: { onOpen: () => void }) {
  return (
    <button
      onClick={onOpen}
      aria-label="Bloom Safety"
      style={{
        position: "fixed",
        top: "calc(env(safe-area-inset-top, 0px) + 14px)",
        right: 16,
        zIndex: 100,
        background: "rgba(255,255,255,0.12)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        border: "1px solid rgba(255,255,255,0.22)",
        borderRadius: "50%",
        width: 36,
        height: 36,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        boxShadow: "0 2px 12px rgba(0,0,0,0.2)",
      }}
    >
      <BloomShield size={18} color="white" />
    </button>
  );
}
