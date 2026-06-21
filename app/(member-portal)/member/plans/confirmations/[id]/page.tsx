"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const PINK = "#FF1F7D";

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

function formatDateTime(iso: string): { date: string; time: string } {
  const d = new Date(iso);
  const date = d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  const time = d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  return { date, time };
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
        <div style={{ width: 36, height: 36, borderRadius: "50%", border: "2px solid rgba(255,31,125,0.3)", borderTopColor: PINK, animation: "spin 1s linear infinite" }} />
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

  const dt = formatDateTime(data.event.starts_at);
  const qrData = encodeURIComponent(`https://bloombay.app/scan?e=${id}&c=${data.confirmation_code ?? ""}`);
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&color=1A0010&bgcolor=FFFFFF&data=${qrData}&qzone=2`;

  if (step === "ticket") {
    return (
      <div style={{ minHeight: "100vh", background: "var(--bb-bg)", display: "flex", flexDirection: "column" }}>
        {/* Top bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "52px 20px 20px" }}>
          <button onClick={() => setStep("confirmation")} style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--bb-nav-bg)", border: "1px solid var(--bb-nav-border)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--bb-nav-icon)" strokeWidth="2.2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <p style={{ fontFamily: "var(--font-jost)", fontWeight: 800, fontSize: 9, letterSpacing: "0.28em", textTransform: "uppercase", color: `${PINK}99` }}>✦ YOUR TICKET</p>
          <div style={{ width: 40 }} />
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 24px 100px" }}>
          {/* Ticket */}
          <div style={{ width: "100%", maxWidth: 360, borderRadius: 20, overflow: "hidden", background: "var(--bb-card)", boxShadow: "0 12px 48px rgba(0,0,0,0.12)", border: "1px solid var(--bb-border-strong)" }}>
            {/* Poster strip */}
            <div style={{ height: 140, position: "relative", overflow: "hidden", background: `linear-gradient(135deg, #18080F 0%, #3A0020 60%, #C4005A 100%)` }}>
              {data.event.poster && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={data.event.poster} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.6 }} />
              )}
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 30%, rgba(0,0,0,0.7) 100%)" }} />
              <div style={{ position: "absolute", bottom: 16, left: 20, right: 20 }}>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, letterSpacing: "0.22em", color: "rgba(255,255,255,0.6)", marginBottom: 4 }}>BLOOMBAY · EVENT TICKET</p>
                <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 22, color: "white", lineHeight: 1.1 }}>{data.event.title}</p>
              </div>
            </div>

            {/* Perforation */}
            <div style={{ height: 0, borderTop: "2px dashed var(--bb-border)", margin: "0 16px" }} />

            {/* Details + QR */}
            <div style={{ padding: "20px 20px 16px", display: "flex", gap: 16, alignItems: "flex-start" }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 5, background: `rgba(255,31,125,0.1)`, border: `1px solid rgba(255,31,125,0.25)`, borderRadius: 6, padding: "3px 8px", marginBottom: 10 }}>
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 700, color: PINK }}>{dt.date}</p>
                </div>
                <p style={{ fontFamily: "var(--font-jost)", fontWeight: 700, fontSize: 13, color: "var(--bb-text)", marginBottom: 3 }}>{dt.time}</p>
                {data.event.venue && (
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: 11, color: "var(--bb-text-3)", marginBottom: 12, lineHeight: 1.4 }}>{data.event.venue}</p>
                )}
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, letterSpacing: "0.12em", color: "var(--bb-text-muted)", marginBottom: 2 }}>CONFIRMATION</p>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: 11, fontWeight: 700, color: "var(--bb-text-2)", letterSpacing: "0.06em" }}>{data.confirmation_code ?? "—"}</p>
              </div>
              <div style={{ flexShrink: 0, borderRadius: 12, overflow: "hidden", padding: 8, background: "white", border: "1px solid rgba(0,0,0,0.06)", boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={qrUrl} alt="Scan at door" width={80} height={80} style={{ display: "block", borderRadius: 6 }} />
              </div>
            </div>

            <div style={{ borderTop: "1px solid var(--bb-border)", padding: "10px 20px" }}>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", color: "var(--bb-text-muted)", letterSpacing: "0.12em", textTransform: "uppercase" }}>
                Show at the door · BloomBay Members Only
              </p>
            </div>
          </div>

          {/* Plan room CTA */}
          <button
            onClick={() => router.push(`/member/plans?event=${id}`)}
            style={{ width: "100%", maxWidth: 360, marginTop: 16, padding: "14px", borderRadius: 16, background: PINK, border: "none", cursor: "pointer", fontFamily: "var(--font-jost)", fontWeight: 700, fontSize: 13, letterSpacing: "0.08em", color: "white", boxShadow: `0 4px 18px rgba(255,31,125,0.35)` }}
          >
            Go to plan room →
          </button>

          <Link href="/member/plans" style={{ marginTop: 12, fontFamily: "var(--font-jost)", fontSize: 11, color: "var(--bb-text-muted)", textDecoration: "none" }}>
            Back to all plans
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bb-bg)", display: "flex", flexDirection: "column" }}>

      {/* Top bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "52px 20px 20px" }}>
        <Link href="/member/plans" style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--bb-nav-bg)", border: "1px solid var(--bb-nav-border)", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--bb-nav-icon)" strokeWidth="2.2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
        </Link>
        <p style={{ fontFamily: "var(--font-jost)", fontWeight: 800, fontSize: 9, letterSpacing: "0.28em", textTransform: "uppercase", color: `${PINK}99` }}>✦ CONFIRMATION</p>
        <div style={{ width: 40 }} />
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", padding: "0 24px 100px" }}>
        <div style={{ width: "100%", maxWidth: 360 }}>

          {/* Big headline */}
          <div style={{ textAlign: "center", marginBottom: 32, marginTop: 16 }}>
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: `linear-gradient(135deg, ${PINK}, #c4005a)`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", boxShadow: `0 8px 32px rgba(255,31,125,0.35)` }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <h1 style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900, fontSize: "clamp(42px, 11vw, 56px)", color: "var(--bb-text)", lineHeight: 0.92, margin: "0 0 8px" }}>
              You&apos;re in.
            </h1>
            <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 14, color: "var(--bb-text-3)", margin: 0 }}>
              Your spot is confirmed.
            </p>
          </div>

          {/* Event card */}
          <div style={{ borderRadius: 20, overflow: "hidden", background: "var(--bb-card)", border: "1px solid var(--bb-border-strong)", boxShadow: "0 8px 32px rgba(255,31,125,0.1)", marginBottom: 16 }}>
            <div style={{ height: 3, background: `linear-gradient(90deg, transparent, ${PINK}, transparent)` }} />
            <div style={{ padding: "20px 20px 16px" }}>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, letterSpacing: "0.22em", color: `${PINK}80`, marginBottom: 8 }}>YOUR EVENT</p>
              <h2 style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 800, fontSize: 22, color: "var(--bb-text)", lineHeight: 1.1, marginBottom: 12 }}>
                {data.event.title}
              </h2>

              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={PINK} strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0, marginTop: 1 }}><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  <div>
                    <p style={{ fontFamily: "var(--font-jost)", fontWeight: 700, fontSize: 12, color: "var(--bb-text)", lineHeight: 1.2 }}>{dt.date}</p>
                    <p style={{ fontFamily: "var(--font-jost)", fontSize: 11, color: "var(--bb-text-3)", marginTop: 1 }}>{dt.time}</p>
                  </div>
                </div>
                {data.event.venue && (
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={PINK} strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0, marginTop: 1 }}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    <p style={{ fontFamily: "var(--font-jost)", fontSize: 12, color: "var(--bb-text-2)", lineHeight: 1.4 }}>{data.event.venue}</p>
                  </div>
                )}
                {data.attendee_count > 0 && (
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={PINK} strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0 }}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                    <p style={{ fontFamily: "var(--font-jost)", fontSize: 12, color: "var(--bb-text-3)" }}>{data.attendee_count} women going</p>
                  </div>
                )}
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 14, paddingTop: 14, borderTop: "1px solid var(--bb-border)" }}>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, letterSpacing: "0.18em", color: "var(--bb-text-muted)", textTransform: "uppercase" }}>Confirmation</p>
                <p style={{ fontFamily: "var(--font-jost)", fontWeight: 700, fontSize: 11, color: PINK, letterSpacing: "0.06em" }}>{data.confirmation_code ?? "—"}</p>
                {data.confirmed_at && (
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: 10, color: "var(--bb-text-muted)", marginLeft: "auto" }}>{formatConfirmedAt(data.confirmed_at)}</p>
                )}
              </div>
            </div>
          </div>

          {/* What's next */}
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, letterSpacing: "0.22em", color: "var(--bb-text-muted)", textTransform: "uppercase", marginBottom: 10 }}>WHAT&apos;S NEXT</p>

          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
            {/* View ticket */}
            <button
              onClick={() => setStep("ticket")}
              style={{ width: "100%", padding: "16px 20px", borderRadius: 16, background: PINK, border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 14, textAlign: "left", boxShadow: `0 4px 18px rgba(255,31,125,0.3)` }}
            >
              <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v2z"/><line x1="9" y1="12" x2="9.01" y2="12" strokeWidth="3"/><line x1="12" y1="12" x2="12.01" y2="12" strokeWidth="3"/><line x1="15" y1="12" x2="15.01" y2="12" strokeWidth="3"/></svg>
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontFamily: "var(--font-jost)", fontWeight: 800, fontSize: 13, color: "white", marginBottom: 2 }}>View your ticket</p>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: 11, color: "rgba(255,255,255,0.7)" }}>QR code to show at the door</p>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2.2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
            </button>

            {/* Plan room */}
            <button
              onClick={() => router.push(`/member/plans?event=${id}`)}
              style={{ width: "100%", padding: "16px 20px", borderRadius: 16, background: "var(--bb-card)", border: "1.5px solid var(--bb-border-strong)", cursor: "pointer", display: "flex", alignItems: "center", gap: 14, textAlign: "left" }}
            >
              <div style={{ width: 40, height: 40, borderRadius: 10, background: `rgba(255,31,125,0.1)`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={PINK} strokeWidth="2" strokeLinecap="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontFamily: "var(--font-jost)", fontWeight: 800, fontSize: 13, color: "var(--bb-text)", marginBottom: 2 }}>Go to plan room</p>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: 11, color: "var(--bb-text-3)" }}>Plan with others going</p>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--bb-text-muted)" strokeWidth="2.2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          </div>

          <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 11, color: "var(--bb-text-muted)", textAlign: "center", lineHeight: 1.6 }}>
            This confirmation lives in your planner.
          </p>
        </div>
      </div>
    </div>
  );
}
