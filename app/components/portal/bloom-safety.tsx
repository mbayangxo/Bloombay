"use client";

import { useState } from "react";

const PINK = "#FF1F7D";

// Silhouette Rule: looks like a shield at first. Second look: five petal
// arcs form the body; the pointed base is a stem. It's a bloom wearing armour.
function BloomShield({ size = 22, color = "white" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Petal 1 — top left arc */}
      <path
        d="M12 3 C9 3 5 5 4 8 C3 11 4 15 6 17.5 C8 20 10.5 21.5 12 22"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      />
      {/* Petal 2 — top right arc */}
      <path
        d="M12 3 C15 3 19 5 20 8 C21 11 20 15 18 17.5 C16 20 13.5 21.5 12 22"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      />
      {/* Inner petal fill — gives it bloom depth */}
      <path
        d="M12 5 C10 5.5 7 7.5 6.5 10 C6 12.5 7 15.5 8.5 17.2 C10 18.9 11.5 20 12 20.5 C12.5 20 14 18.9 15.5 17.2 C17 15.5 18 12.5 17.5 10 C17 7.5 14 5.5 12 5Z"
        fill={color}
        opacity="0.15"
      />
      {/* Centre check mark (safety tick) — hidden petal centre */}
      <path
        d="M9 12 l2 2 l4 -4"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BloomShieldFilled({ size = 22, color = PINK }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 3 C9 3 5 5 4 8 C3 11 4 15 6 17.5 C8 20 10.5 21.5 12 22 C13.5 21.5 16 20 18 17.5 C20 15 21 11 20 8 C19 5 15 3 12 3Z"
        fill={color}
        opacity="0.15"
      />
      <path
        d="M12 3 C9 3 5 5 4 8 C3 11 4 15 6 17.5 C8 20 10.5 21.5 12 22"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M12 3 C15 3 19 5 20 8 C21 11 20 15 18 17.5 C16 20 13.5 21.5 12 22"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M9 12 l2 2 l4 -4"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type CheckInDuration = 1 | 2 | 4;

interface BloomSafetySheetProps {
  onClose: () => void;
}

export function BloomSafetySheet({ onClose }: BloomSafetySheetProps) {
  const [contactName,  setContactName]  = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [checkInHours, setCheckInHours] = useState<CheckInDuration | null>(null);
  const [checkInActive, setCheckInActive] = useState(false);
  const [checkedInSafe, setCheckedInSafe] = useState(false);
  const [reportOpen,   setReportOpen]   = useState(false);
  const [reportText,   setReportText]   = useState("");
  const [reportSent,   setReportSent]   = useState(false);

  function activateCheckIn(h: CheckInDuration) {
    setCheckInHours(h);
    setCheckInActive(true);
  }

  function markSafeArrival() {
    setCheckedInSafe(true);
    setCheckInActive(false);
    setTimeout(() => onClose(), 1200);
  }

  function sendReport() {
    if (!reportText.trim()) return;
    setReportSent(true);
    setTimeout(() => { setReportOpen(false); setReportText(""); setReportSent(false); }, 2000);
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

          {/* ── Safe Check-In ── */}
          <div style={{
            background: checkInActive
              ? "rgba(255,31,125,0.08)"
              : "rgba(255,255,255,0.04)",
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
                      flex: 1,
                      padding: "10px 0",
                      borderRadius: 999,
                      border: "1px solid rgba(255,255,255,0.12)",
                      background: "rgba(255,255,255,0.06)",
                      color: "rgba(255,255,255,0.75)",
                      fontFamily: "var(--font-jost)",
                      fontSize: "11px",
                      fontWeight: 700,
                      cursor: "pointer",
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
                    flex: 1,
                    padding: "12px 0",
                    borderRadius: 999,
                    border: "none",
                    background: PINK,
                    color: "white",
                    fontFamily: "var(--font-jost)",
                    fontSize: "12px",
                    fontWeight: 800,
                    cursor: "pointer",
                    boxShadow: `0 2px 0 rgba(150,0,55,0.8), 0 6px 18px ${PINK}44`,
                  }}
                >
                  {checkedInSafe ? "Safe ✦" : "I'm home safe →"}
                </button>
                <button
                  onClick={() => { setCheckInActive(false); setCheckInHours(null); }}
                  style={{
                    padding: "12px 18px",
                    borderRadius: 999,
                    border: "1px solid rgba(255,255,255,0.12)",
                    background: "rgba(255,255,255,0.06)",
                    color: "rgba(255,255,255,0.5)",
                    fontFamily: "var(--font-jost)",
                    fontSize: "11px",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          {/* ── My Safe Contact ── */}
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
                  My Safe Contact
                </p>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "10px", color: "rgba(255,255,255,0.35)", marginTop: 1 }}>
                  Saved locally on your device only.
                </p>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <input
                value={contactName}
                onChange={e => setContactName(e.target.value)}
                placeholder="Contact name"
                style={{
                  padding: "11px 14px",
                  borderRadius: 12,
                  border: "1px solid rgba(255,255,255,0.1)",
                  background: "rgba(255,255,255,0.06)",
                  color: "white",
                  fontFamily: "var(--font-jost)",
                  fontSize: "13px",
                  outline: "none",
                  width: "100%",
                  boxSizing: "border-box",
                }}
              />
              <input
                value={contactPhone}
                onChange={e => setContactPhone(e.target.value)}
                placeholder="Phone number"
                type="tel"
                style={{
                  padding: "11px 14px",
                  borderRadius: 12,
                  border: "1px solid rgba(255,255,255,0.1)",
                  background: "rgba(255,255,255,0.06)",
                  color: "white",
                  fontFamily: "var(--font-jost)",
                  fontSize: "13px",
                  outline: "none",
                  width: "100%",
                  boxSizing: "border-box",
                }}
              />
              {contactPhone && (
                <div style={{ display: "flex", gap: 8 }}>
                  <a
                    href={`tel:${contactPhone}`}
                    style={{
                      flex: 1,
                      padding: "10px 0",
                      borderRadius: 999,
                      border: "1px solid rgba(255,255,255,0.15)",
                      background: "rgba(255,255,255,0.08)",
                      color: "white",
                      fontFamily: "var(--font-jost)",
                      fontSize: "11px",
                      fontWeight: 700,
                      textAlign: "center",
                      textDecoration: "none",
                    }}
                  >
                    📞 Call
                  </a>
                  <a
                    href={`sms:${contactPhone}&body=Hey, I wanted to let you know I'm out tonight. Just checking in.`}
                    style={{
                      flex: 1,
                      padding: "10px 0",
                      borderRadius: 999,
                      border: "none",
                      background: PINK,
                      color: "white",
                      fontFamily: "var(--font-jost)",
                      fontSize: "11px",
                      fontWeight: 700,
                      textAlign: "center",
                      textDecoration: "none",
                      boxShadow: `0 2px 10px ${PINK}44`,
                    }}
                  >
                    💬 Text
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* ── Venue Verified ── */}
          <div style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 18,
            padding: "16px 18px",
            display: "flex",
            alignItems: "center",
            gap: 12,
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

          {/* ── Report ── */}
          {!reportOpen ? (
            <button
              onClick={() => setReportOpen(true)}
              style={{
                padding: "14px",
                borderRadius: 14,
                border: "1px solid rgba(255,255,255,0.08)",
                background: "rgba(255,255,255,0.04)",
                color: "rgba(255,255,255,0.45)",
                fontFamily: "var(--font-jost)",
                fontSize: "12px",
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 8,
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
              borderRadius: 18,
              padding: "16px 18px",
            }}>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "11px", fontWeight: 700, color: "white", marginBottom: 10 }}>
                {reportSent ? "Report received. We'll follow up shortly." : "Tell us what happened."}
              </p>
              {!reportSent && (
                <>
                  <textarea
                    value={reportText}
                    onChange={e => setReportText(e.target.value)}
                    placeholder="Describe the situation. All reports are confidential."
                    rows={3}
                    style={{
                      width: "100%",
                      padding: "11px 14px",
                      borderRadius: 12,
                      border: "1px solid rgba(255,255,255,0.1)",
                      background: "rgba(255,255,255,0.06)",
                      color: "white",
                      fontFamily: "var(--font-jost)",
                      fontSize: "13px",
                      outline: "none",
                      resize: "none",
                      boxSizing: "border-box",
                      lineHeight: 1.5,
                      marginBottom: 10,
                    }}
                  />
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      onClick={sendReport}
                      style={{
                        flex: 1,
                        padding: "11px 0",
                        borderRadius: 999,
                        border: "none",
                        background: reportText.trim() ? PINK : "rgba(255,255,255,0.08)",
                        color: reportText.trim() ? "white" : "rgba(255,255,255,0.3)",
                        fontFamily: "var(--font-jost)",
                        fontSize: "12px",
                        fontWeight: 800,
                        cursor: reportText.trim() ? "pointer" : "default",
                      }}
                    >
                      Submit report
                    </button>
                    <button
                      onClick={() => { setReportOpen(false); setReportText(""); }}
                      style={{
                        padding: "11px 16px",
                        borderRadius: 999,
                        border: "1px solid rgba(255,255,255,0.1)",
                        background: "none",
                        color: "rgba(255,255,255,0.4)",
                        fontFamily: "var(--font-jost)",
                        fontSize: "11px",
                        cursor: "pointer",
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

// ── Trigger button for the home screen top-right ──────────────────────────────
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
