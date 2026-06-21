"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const PINK = "#FF1F7D";
const BABY = "#FF69B4";

interface ConfirmationData {
  type: "gathering" | "event";
  confirmed: boolean;
  event: {
    id: string;
    title: string;
    venue: string | null;
    starts_at: string;
    slug: string | null;
    poster: string | null;
    accent?: string;
  };
  confirmation_code: string | null;
  reservation_id: string | null;
  confirmed_at: string | null;
  attendee_count: number;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
}
function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}
function formatConfirmedAt(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function ConfirmationPage() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params.id === "string" ? params.id : "";

  const [data, setData] = useState<ConfirmationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<"confirmation" | "ticket">("confirmation");

  useEffect(() => {
    if (!id) return;
    fetch(`/api/member/plans/confirmations/${id}`)
      .then(r => r.ok ? r.json() : null)
      .then((json: ConfirmationData | null) => setData(json))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--bb-bg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 36, height: 36, borderRadius: "50%", border: `2px solid rgba(255,31,125,0.25)`, borderTopColor: PINK, animation: "spin 1s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!data) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--bb-bg)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, padding: "0 24px" }}>
        <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 18, color: "var(--bb-text-3)", textAlign: "center" }}>
          This confirmation isn&apos;t available.
        </p>
        <Link href="/member/plans" style={{ color: PINK, fontSize: 12, fontFamily: "var(--font-jost)" }}>Back to Plans →</Link>
      </div>
    );
  }

  const qrData = encodeURIComponent(`https://bloombay.app/scan?e=${id}&c=${data.confirmation_code ?? ""}`);
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&color=1A0010&bgcolor=FFFFFF&data=${qrData}&qzone=2`;
  const hasPoster = !!data.event.poster;

  /* ── TICKET STEP ── */
  if (step === "ticket") {
    return (
      <div style={{ minHeight: "100vh", background: "var(--bb-bg)", display: "flex", flexDirection: "column" }}>
        <style>{`@keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }`}</style>

        {/* Top bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "52px 20px 20px" }}>
          <button onClick={() => setStep("confirmation")} style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--bb-nav-bg)", border: "1px solid var(--bb-nav-border)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--bb-nav-icon)" strokeWidth="2.2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <p style={{ fontFamily: "var(--font-jost)", fontWeight: 800, fontSize: 9, letterSpacing: "0.28em", textTransform: "uppercase", color: `${PINK}99` }}>✦ YOUR PASS</p>
          <div style={{ width: 40 }} />
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 24px 100px", animation: "slideUp 0.4s ease" }}>
          <div style={{ width: "100%", maxWidth: 360 }}>
            {/* Ticket card */}
            <div style={{ borderRadius: 24, overflow: "hidden", background: "var(--bb-card)", boxShadow: "0 20px 64px rgba(0,0,0,0.18)", border: "1px solid var(--bb-border-strong)" }}>
              {/* Poster strip */}
              <div style={{ height: 160, position: "relative", overflow: "hidden", background: hasPoster ? "transparent" : `linear-gradient(135deg, #18080F 0%, #3A0020 55%, ${PINK} 100%)` }}>
                {hasPoster && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={data.event.poster!} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                )}
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.65) 100%)" }} />
                {/* Bloombay wordmark */}
                <div style={{ position: "absolute", top: 16, left: 20, display: "flex", alignItems: "center", gap: 5 }}>
                  <div style={{ width: 18, height: 18, borderRadius: "50%", background: PINK, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontSize: 9, lineHeight: 1 }}>✿</span>
                  </div>
                  <span style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 900, letterSpacing: "0.2em", color: "rgba(255,255,255,0.85)" }}>BLOOMBAY</span>
                </div>
                <div style={{ position: "absolute", bottom: 18, left: 20, right: 20 }}>
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.18em", color: "rgba(255,255,255,0.55)", marginBottom: 5 }}>MEMBER PASS</p>
                  <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 24, fontWeight: 900, color: "white", lineHeight: 1.05 }}>{data.event.title}</p>
                </div>
              </div>

              {/* Tear line */}
              <div style={{ position: "relative", height: 0 }}>
                <div style={{ position: "absolute", left: -1, right: -1, height: 1, borderTop: "2px dashed var(--bb-border)", opacity: 0.6 }} />
                <div style={{ position: "absolute", left: -12, top: "50%", transform: "translateY(-50%)", width: 22, height: 22, borderRadius: "50%", background: "var(--bb-bg)", border: "1px solid var(--bb-border)" }} />
                <div style={{ position: "absolute", right: -12, top: "50%", transform: "translateY(-50%)", width: 22, height: 22, borderRadius: "50%", background: "var(--bb-bg)", border: "1px solid var(--bb-border)" }} />
              </div>

              {/* Stub: details + QR */}
              <div style={{ padding: "22px 20px 18px", display: "flex", gap: 16, alignItems: "flex-start" }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: "7.5px", fontWeight: 800, letterSpacing: "0.14em", color: "var(--bb-text-muted)", marginBottom: 10, textTransform: "uppercase" }}>Event Details</p>
                  <p style={{ fontFamily: "var(--font-jost)", fontWeight: 700, fontSize: 12, color: "var(--bb-text)", marginBottom: 2 }}>{formatDate(data.event.starts_at)}</p>
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: 11, color: "var(--bb-text-3)", marginBottom: data.event.venue ? 8 : 14 }}>{formatTime(data.event.starts_at)}</p>
                  {data.event.venue && (
                    <p style={{ fontFamily: "var(--font-jost)", fontSize: 11, color: "var(--bb-text-2)", marginBottom: 14, lineHeight: 1.4 }}>{data.event.venue}</p>
                  )}
                  <div style={{ paddingTop: 12, borderTop: "1px solid var(--bb-border)" }}>
                    <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.12em", color: "var(--bb-text-muted)", marginBottom: 3, textTransform: "uppercase" }}>Pass Code</p>
                    <p style={{ fontFamily: "var(--font-jost)", fontWeight: 800, fontSize: 13, color: PINK, letterSpacing: "0.1em" }}>{data.confirmation_code ?? "—"}</p>
                  </div>
                </div>
                {/* QR */}
                <div style={{ flexShrink: 0 }}>
                  <div style={{ borderRadius: 14, overflow: "hidden", padding: 8, background: "white", border: "1px solid rgba(0,0,0,0.06)", boxShadow: "0 2px 16px rgba(0,0,0,0.1)" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={qrUrl} alt="Scan at door" width={90} height={90} style={{ display: "block", borderRadius: 8 }} />
                  </div>
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", color: "var(--bb-text-muted)", textAlign: "center", marginTop: 6, letterSpacing: "0.04em" }}>Scan at door</p>
                </div>
              </div>

              {/* Footer band */}
              <div style={{ background: `linear-gradient(90deg, ${PINK}15, ${BABY}20)`, borderTop: "1px solid var(--bb-border)", padding: "10px 20px" }}>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "7.5px", color: `${PINK}99`, letterSpacing: "0.14em", textTransform: "uppercase" }}>
                  BloomBay Members Only · Show at the door
                </p>
              </div>
            </div>

            {/* CTA */}
            <button
              onClick={() => router.push(`/member/plans?event=${id}`)}
              style={{ width: "100%", marginTop: 18, padding: "15px", borderRadius: 18, background: PINK, border: "none", cursor: "pointer", fontFamily: "var(--font-jost)", fontWeight: 700, fontSize: 13, letterSpacing: "0.08em", color: "white", boxShadow: `0 6px 24px rgba(255,31,125,0.35)` }}
            >
              Open the plan room →
            </button>

            <Link href="/member/plans" style={{ display: "block", marginTop: 12, fontFamily: "var(--font-jost)", fontSize: 11, color: "var(--bb-text-muted)", textDecoration: "none", textAlign: "center" }}>
              Back to all plans
            </Link>
          </div>
        </div>
      </div>
    );
  }

  /* ── CONFIRMATION STEP ── */
  return (
    <div style={{ minHeight: "100vh", background: "var(--bb-bg)", display: "flex", flexDirection: "column" }}>
      <style>{`
        @keyframes checkIn { 0% { transform: scale(0.6); opacity: 0; } 70% { transform: scale(1.12); } 100% { transform: scale(1); opacity: 1; } }
        @keyframes fadeUp { from { transform: translateY(16px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      {/* Hero: poster or pink gradient */}
      <div style={{ position: "relative", height: 240, overflow: "hidden", background: hasPoster ? "transparent" : `linear-gradient(145deg, #18080F 0%, #5A0030 55%, ${PINK} 100%)` }}>
        {hasPoster && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={data.event.poster!} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        )}
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to bottom, rgba(0,0,0,0.28) 0%, rgba(0,0,0,0.0) 40%, rgba(0,0,0,0.68) 100%)` }} />

        {/* Back button */}
        <Link href="/member/plans" style={{ position: "absolute", top: "calc(env(safe-area-inset-top, 0px) + 16px)", left: 16, width: 40, height: 40, borderRadius: "50%", background: "rgba(0,0,0,0.35)", backdropFilter: "blur(12px)", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none", border: "1px solid rgba(255,255,255,0.2)" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
        </Link>

        {/* Event title in hero */}
        <div style={{ position: "absolute", bottom: 20, left: 20, right: 20 }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.22em", color: "rgba(255,255,255,0.6)", marginBottom: 5 }}>✦ YOU&apos;RE IN</p>
          <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 22, fontWeight: 900, color: "white", lineHeight: 1.1, textShadow: "0 2px 12px rgba(0,0,0,0.5)" }}>{data.event.title}</p>
        </div>
      </div>

      {/* White card sheet that slides up */}
      <div style={{ flex: 1, background: "var(--bb-bg)", borderRadius: "24px 24px 0 0", marginTop: -20, position: "relative", zIndex: 2, padding: "28px 22px calc(env(safe-area-inset-bottom, 0px) + 100px)", animation: "fadeUp 0.45s ease" }}>

        {/* Pill handle */}
        <div style={{ width: 38, height: 4, borderRadius: 2, background: "var(--bb-border-strong)", margin: "0 auto 24px" }} />

        {/* Check + headline */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 22 }}>
          <div style={{ width: 52, height: 52, borderRadius: "50%", background: `linear-gradient(135deg, ${PINK}, #c4005a)`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: `0 8px 28px rgba(255,31,125,0.38)`, animation: "checkIn 0.5s cubic-bezier(0.34,1.56,0.64,1) both" }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <div>
            <h1 style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900, fontSize: 34, color: "var(--bb-text)", lineHeight: 0.92, margin: 0 }}>
              You&apos;re in.
            </h1>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 12, color: "var(--bb-text-3)", marginTop: 4 }}>
              Your spot is secured{data.confirmed_at ? ` · ${formatConfirmedAt(data.confirmed_at)}` : ""}
            </p>
          </div>
        </div>

        {/* Event detail card */}
        <div style={{ background: "var(--bb-card)", borderRadius: 18, border: "1px solid var(--bb-border)", marginBottom: 18, overflow: "hidden" }}>
          <div style={{ height: 3, background: `linear-gradient(90deg, ${PINK}, ${BABY})` }} />
          <div style={{ padding: "16px 18px 14px" }}>
            {/* Date row */}
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: `rgba(255,31,125,0.1)`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={PINK} strokeWidth="2" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              </div>
              <div>
                <p style={{ fontFamily: "var(--font-jost)", fontWeight: 700, fontSize: 13, color: "var(--bb-text)", lineHeight: 1.2 }}>{formatDate(data.event.starts_at)}</p>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: 11, color: "var(--bb-text-3)", marginTop: 2 }}>{formatTime(data.event.starts_at)}</p>
              </div>
            </div>

            {/* Venue row */}
            {data.event.venue && (
              <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: `rgba(255,31,125,0.08)`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={PINK} strokeWidth="2" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                </div>
                <div style={{ display: "flex", alignItems: "center", flex: 1, paddingTop: 8 }}>
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: 13, color: "var(--bb-text-2)", lineHeight: 1.4 }}>{data.event.venue}</p>
                </div>
              </div>
            )}

            {/* Women count */}
            {data.attendee_count > 1 && (
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: `rgba(255,31,125,0.08)`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={PINK} strokeWidth="2" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                </div>
                <div style={{ paddingTop: 8 }}>
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: 12, color: "var(--bb-text-3)" }}>{data.attendee_count} women confirmed</p>
                </div>
              </div>
            )}

            {/* Confirmation code */}
            <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid var(--bb-border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.16em", color: "var(--bb-text-muted)", marginBottom: 3, textTransform: "uppercase" }}>Pass Code</p>
                <p style={{ fontFamily: "var(--font-jost)", fontWeight: 800, fontSize: 13, color: PINK, letterSpacing: "0.1em" }}>{data.confirmation_code ?? "—"}</p>
              </div>
              <div style={{ background: `${PINK}12`, border: `1px solid ${PINK}30`, borderRadius: 8, padding: "5px 10px" }}>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, color: PINK, letterSpacing: "0.1em" }}>SECURED ✓</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
          {/* Pass CTA */}
          <button
            onClick={() => setStep("ticket")}
            style={{ width: "100%", padding: "16px 20px", borderRadius: 18, background: `linear-gradient(135deg, ${PINK}, #c4005a)`, border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 14, textAlign: "left", boxShadow: `0 6px 24px rgba(255,31,125,0.32)` }}
          >
            <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v2z"/>
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontFamily: "var(--font-jost)", fontWeight: 800, fontSize: 13, color: "white", marginBottom: 2 }}>Show your pass</p>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: 11, color: "rgba(255,255,255,0.7)" }}>QR code · show at the door</p>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2.2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
          </button>

          {/* Plan room CTA */}
          <button
            onClick={() => router.push(`/member/plans?event=${id}`)}
            style={{ width: "100%", padding: "16px 20px", borderRadius: 18, background: "var(--bb-card)", border: "1.5px solid var(--bb-border-strong)", cursor: "pointer", display: "flex", alignItems: "center", gap: 14, textAlign: "left" }}
          >
            <div style={{ width: 40, height: 40, borderRadius: 10, background: `rgba(255,31,125,0.09)`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={PINK} strokeWidth="2" strokeLinecap="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontFamily: "var(--font-jost)", fontWeight: 800, fontSize: 13, color: "var(--bb-text)", marginBottom: 2 }}>Plan room</p>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: 11, color: "var(--bb-text-3)" }}>Coordinate with the women coming</p>
            </div>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--bb-text-muted)" strokeWidth="2.2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>

        {/* Soft tagline */}
        <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 12, color: "var(--bb-text-muted)", textAlign: "center", lineHeight: 1.6 }}>
          This pass lives in your planner. ✦
        </p>
      </div>
    </div>
  );
}
