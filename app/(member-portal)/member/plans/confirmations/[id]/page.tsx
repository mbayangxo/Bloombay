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
function formatShortDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

/* ── Wallet widget: tickets fanning out of a wallet ── */
function WalletWidget({ onClick, posterUrl, title }: { onClick: () => void; posterUrl: string | null; title: string }) {
  return (
    <button
      onClick={onClick}
      style={{ width: "100%", position: "relative", height: 148, cursor: "pointer", background: "none", border: "none", padding: 0, WebkitTapHighlightColor: "transparent" }}
    >
      {/* Ticket 1 — back-left, rotated */}
      <div style={{ position: "absolute", top: 0, left: "6%", right: "28%", height: 88, borderRadius: "12px 12px 6px 6px", background: `linear-gradient(145deg, #3A0020, #C4005A)`, transform: "rotate(-8deg)", transformOrigin: "bottom center", boxShadow: "0 6px 20px rgba(0,0,0,0.32)", overflow: "hidden" }}>
        {posterUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={posterUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.35, mixBlendMode: "luminosity" }} />
        )}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.5) 100%)" }} />
        {/* Tear dots */}
        <div style={{ position: "absolute", bottom: 16, left: 6, right: 6, display: "flex", gap: 3, justifyContent: "center" }}>
          {[...Array(7)].map((_, i) => <div key={i} style={{ width: 3, height: 3, borderRadius: "50%", background: "rgba(255,255,255,0.3)" }} />)}
        </div>
      </div>

      {/* Ticket 2 — back-right, rotated opposite */}
      <div style={{ position: "absolute", top: 6, left: "26%", right: "6%", height: 82, borderRadius: "12px 12px 6px 6px", background: `linear-gradient(145deg, #2A0015, #A8004C)`, transform: "rotate(6deg)", transformOrigin: "bottom center", boxShadow: "0 6px 20px rgba(0,0,0,0.25)", overflow: "hidden" }}>
        {posterUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={posterUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.25, mixBlendMode: "luminosity" }} />
        )}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.6) 100%)" }} />
        <div style={{ position: "absolute", bottom: 14, left: 6, right: 6, display: "flex", gap: 3, justifyContent: "center" }}>
          {[...Array(6)].map((_, i) => <div key={i} style={{ width: 3, height: 3, borderRadius: "50%", background: "rgba(255,255,255,0.25)" }} />)}
        </div>
      </div>

      {/* Wallet body */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 68, borderRadius: 20, background: "linear-gradient(135deg, #160010 0%, #2A0018 50%, #1A000F 100%)", boxShadow: "0 8px 36px rgba(0,0,0,0.45), 0 1px 0 rgba(255,255,255,0.06) inset", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 18px" }}>
        {/* Left side */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: `${PINK}22`, border: `1px solid ${PINK}44`, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={PINK} strokeWidth="2" strokeLinecap="round">
              <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v2z"/>
            </svg>
          </div>
          <div>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.18em", color: "rgba(255,255,255,0.35)", marginBottom: 3 }}>YOUR TICKET</p>
            <p style={{ fontFamily: "var(--font-jost)", fontWeight: 800, fontSize: 14, color: "white" }}>Save me a seat</p>
          </div>
        </div>
        {/* Arrow */}
        <div style={{ width: 32, height: 32, borderRadius: "50%", background: PINK, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 3px 12px ${PINK}66` }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
        </div>
      </div>
    </button>
  );
}

/* ── Realistic event ticket ── */
function EventTicket({ data, qrUrl }: { data: ConfirmationData; qrUrl: string }) {
  const hasPoster = !!data.event.poster;
  const accent = data.event.accent ?? PINK;

  return (
    <div style={{ borderRadius: 22, overflow: "hidden", background: "var(--bb-card)", boxShadow: "0 24px 72px rgba(0,0,0,0.22), 0 4px 16px rgba(0,0,0,0.12)", border: "1px solid var(--bb-border-strong)" }}>

      {/* Poster strip */}
      <div style={{ height: 190, position: "relative", overflow: "hidden", background: hasPoster ? "transparent" : `linear-gradient(155deg, #18080F 0%, #3A0020 45%, ${PINK} 100%)` }}>
        {hasPoster && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={data.event.poster!} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        )}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.0) 30%, rgba(0,0,0,0.72) 100%)" }} />

        {/* Top-left badge */}
        <div style={{ position: "absolute", top: 16, left: 16, display: "flex", alignItems: "center", gap: 6, background: "rgba(0,0,0,0.4)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", borderRadius: 999, padding: "5px 10px", border: "1px solid rgba(255,255,255,0.15)" }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: PINK }} />
          <span style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 900, letterSpacing: "0.16em", color: "white" }}>BLOOMBAY</span>
        </div>

        {/* Event title */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "0 20px 20px" }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "7.5px", fontWeight: 800, letterSpacing: "0.2em", color: "rgba(255,255,255,0.55)", marginBottom: 6 }}>MEMBER TICKET · ADMIT ONE</p>
          <h2 style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900, fontSize: 26, color: "white", lineHeight: 1.0, margin: 0, textShadow: "0 2px 16px rgba(0,0,0,0.5)" }}>{data.event.title}</h2>
        </div>
      </div>

      {/* Perforation tear-line */}
      <div style={{ position: "relative", height: 24, background: "var(--bb-card)" }}>
        <div style={{ position: "absolute", left: -1, right: -1, top: "50%", transform: "translateY(-50%)", borderTop: "2px dashed var(--bb-border)", opacity: 0.7 }} />
        {/* Notch cutouts */}
        <div style={{ position: "absolute", left: -10, top: "50%", transform: "translateY(-50%)", width: 20, height: 20, borderRadius: "50%", background: "var(--bb-bg)" }} />
        <div style={{ position: "absolute", right: -10, top: "50%", transform: "translateY(-50%)", width: 20, height: 20, borderRadius: "50%", background: "var(--bb-bg)" }} />
      </div>

      {/* Stub */}
      <div style={{ padding: "4px 20px 20px" }}>
        {/* Details row */}
        <div style={{ display: "flex", gap: 14, marginBottom: 18, alignItems: "flex-start" }}>
          <div style={{ flex: 1 }}>
            <div style={{ marginBottom: 12 }}>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.14em", color: "var(--bb-text-muted)", marginBottom: 4, textTransform: "uppercase" }}>Date & Time</p>
              <p style={{ fontFamily: "var(--font-jost)", fontWeight: 700, fontSize: 13, color: "var(--bb-text)", lineHeight: 1.2 }}>{formatDate(data.event.starts_at)}</p>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: 11, color: "var(--bb-text-3)", marginTop: 1 }}>{formatTime(data.event.starts_at)}</p>
            </div>
            {data.event.venue && (
              <div style={{ marginBottom: 12 }}>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.14em", color: "var(--bb-text-muted)", marginBottom: 4, textTransform: "uppercase" }}>Venue</p>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: 12, color: "var(--bb-text-2)", lineHeight: 1.4 }}>{data.event.venue}</p>
              </div>
            )}
            <div>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.14em", color: "var(--bb-text-muted)", marginBottom: 4, textTransform: "uppercase" }}>Seat Code</p>
              <p style={{ fontFamily: "var(--font-jost)", fontWeight: 900, fontSize: 14, color: accent, letterSpacing: "0.1em" }}>{data.confirmation_code ?? "—"}</p>
            </div>
          </div>

          {/* QR Code */}
          <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <div style={{ borderRadius: 14, overflow: "hidden", padding: 10, background: "white", boxShadow: "0 2px 16px rgba(0,0,0,0.12)", border: "1px solid rgba(0,0,0,0.06)" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={qrUrl} alt="Scan at door" width={88} height={88} style={{ display: "block", borderRadius: 8 }} />
            </div>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", color: "var(--bb-text-muted)", letterSpacing: "0.06em" }}>Scan at door</p>
          </div>
        </div>

        {/* Barcode graphic */}
        <div style={{ borderTop: "1px solid var(--bb-border)", paddingTop: 14, display: "flex", gap: 2, alignItems: "flex-end", height: 42 }}>
          {[3,5,2,8,4,6,3,9,2,7,4,5,3,8,6,2,9,4,7,3,5,8,2,6,4,9,3,7,5,2,8,4,6].map((h, i) => (
            <div key={i} style={{ flex: 1, height: `${h * 3}px`, background: "var(--bb-text-3)", borderRadius: 1, opacity: 0.35 }} />
          ))}
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", color: "var(--bb-text-muted)", whiteSpace: "nowrap", marginLeft: 6, letterSpacing: "0.06em" }}>MEMBERS ONLY</p>
        </div>
      </div>
    </div>
  );
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
        <style>{`@keyframes slideUp { from { transform: translateY(24px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }`}</style>

        {/* Top bar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "52px 20px 20px" }}>
          <button onClick={() => setStep("confirmation")} style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--bb-nav-bg)", border: "1px solid var(--bb-nav-border)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--bb-nav-icon)" strokeWidth="2.2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <p style={{ fontFamily: "var(--font-jost)", fontWeight: 800, fontSize: 9, letterSpacing: "0.28em", textTransform: "uppercase", color: `${PINK}99` }}>✦ YOUR TICKET</p>
          <div style={{ width: 40 }} />
        </div>

        <div style={{ flex: 1, padding: "0 20px calc(env(safe-area-inset-bottom, 0px) + 100px)", animation: "slideUp 0.38s ease" }}>
          <EventTicket data={data} qrUrl={qrUrl} />

          <button
            onClick={() => router.push(`/member/plans?event=${id}`)}
            style={{ width: "100%", marginTop: 18, padding: "15px", borderRadius: 18, background: PINK, border: "none", cursor: "pointer", fontFamily: "var(--font-jost)", fontWeight: 700, fontSize: 13, letterSpacing: "0.08em", color: "white", boxShadow: `0 6px 24px rgba(255,31,125,0.32)` }}
          >
            Go to plan room →
          </button>

          <Link href="/member/plans" style={{ display: "block", marginTop: 12, fontFamily: "var(--font-jost)", fontSize: 11, color: "var(--bb-text-muted)", textDecoration: "none", textAlign: "center" }}>
            Back to all plans
          </Link>
        </div>
      </div>
    );
  }

  /* ── CONFIRMATION STEP ── */
  return (
    <div style={{ minHeight: "100vh", background: "var(--bb-bg)", display: "flex", flexDirection: "column" }}>
      <style>{`
        @keyframes checkIn { 0% { transform: scale(0.6); opacity: 0; } 70% { transform: scale(1.14); } 100% { transform: scale(1); opacity: 1; } }
        @keyframes fadeUp { from { transform: translateY(18px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      {/* Hero: poster or gradient */}
      <div style={{ position: "relative", height: 230, overflow: "hidden", background: hasPoster ? "transparent" : `linear-gradient(145deg, #18080F 0%, #5A0030 55%, ${PINK} 100%)` }}>
        {hasPoster && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={data.event.poster!} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        )}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.0) 35%, rgba(0,0,0,0.72) 100%)" }} />

        {/* Back button */}
        <Link href="/member/plans" style={{ position: "absolute", top: "calc(env(safe-area-inset-top, 0px) + 16px)", left: 16, width: 40, height: 40, borderRadius: "50%", background: "rgba(0,0,0,0.35)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none", border: "1px solid rgba(255,255,255,0.18)" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
        </Link>

        {/* "I'm going" badge top-right */}
        <div style={{ position: "absolute", top: "calc(env(safe-area-inset-top, 0px) + 20px)", right: 16, background: "rgba(0,0,0,0.38)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", border: `1.5px solid ${PINK}66`, borderRadius: 999, padding: "6px 12px", display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: PINK }} />
          <span style={{ fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 800, letterSpacing: "0.12em", color: "white" }}>I&apos;M GOING ✓</span>
        </div>

        {/* Event title in hero */}
        <div style={{ position: "absolute", bottom: 22, left: 20, right: 20 }}>
          <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 23, fontWeight: 900, color: "white", lineHeight: 1.1, textShadow: "0 2px 14px rgba(0,0,0,0.5)" }}>{data.event.title}</p>
          {data.event.venue && (
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 11, color: "rgba(255,255,255,0.6)", marginTop: 3 }}>{data.event.venue}</p>
          )}
        </div>
      </div>

      {/* Sheet */}
      <div style={{ flex: 1, background: "var(--bb-bg)", borderRadius: "22px 22px 0 0", marginTop: -18, position: "relative", zIndex: 2, padding: "24px 20px calc(env(safe-area-inset-bottom, 0px) + 100px)", animation: "fadeUp 0.42s ease" }}>

        {/* Pill */}
        <div style={{ width: 36, height: 4, borderRadius: 2, background: "var(--bb-border-strong)", margin: "0 auto 22px" }} />

        {/* Check + headline */}
        <div style={{ display: "flex", alignItems: "center", gap: 13, marginBottom: 20 }}>
          <div style={{ width: 50, height: 50, borderRadius: "50%", background: `linear-gradient(135deg, ${PINK}, #c4005a)`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: `0 8px 28px rgba(255,31,125,0.38)`, animation: "checkIn 0.48s cubic-bezier(0.34,1.56,0.64,1) both" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <div>
            <h1 style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900, fontSize: 32, color: "var(--bb-text)", lineHeight: 0.92, margin: 0 }}>
              Your spot is secured.
            </h1>
            {data.confirmed_at && (
              <p style={{ fontFamily: "var(--font-jost)", fontSize: 11, color: "var(--bb-text-muted)", marginTop: 4 }}>{formatShortDate(data.confirmed_at)}</p>
            )}
          </div>
        </div>

        {/* Event date card */}
        <div style={{ background: "var(--bb-card)", borderRadius: 16, border: "1px solid var(--bb-border)", padding: "14px 16px", marginBottom: 18, display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 42, height: 42, borderRadius: 12, background: `${PINK}12`, border: `1px solid ${PINK}25`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, color: PINK, letterSpacing: "0.12em", marginBottom: 1 }}>
              {new Date(data.event.starts_at).toLocaleDateString("en-US", { month: "short" }).toUpperCase()}
            </p>
            <p style={{ fontFamily: "var(--font-jost)", fontWeight: 900, fontSize: 18, color: "var(--bb-text)", lineHeight: 1 }}>
              {new Date(data.event.starts_at).getDate()}
            </p>
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontFamily: "var(--font-jost)", fontWeight: 700, fontSize: 13, color: "var(--bb-text)", marginBottom: 1 }}>
              {new Date(data.event.starts_at).toLocaleDateString("en-US", { weekday: "long" })}
            </p>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 11, color: "var(--bb-text-3)" }}>
              {formatTime(data.event.starts_at)}{data.attendee_count > 1 ? ` · ${data.attendee_count} women confirmed` : ""}
            </p>
          </div>
          <div style={{ background: `${PINK}12`, border: `1px solid ${PINK}28`, borderRadius: 8, padding: "5px 10px" }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, color: PINK, letterSpacing: "0.1em" }}>IN ✓</p>
          </div>
        </div>

        {/* Wallet widget → ticket */}
        <WalletWidget onClick={() => setStep("ticket")} posterUrl={data.event.poster} title={data.event.title} />

        {/* Plan room CTA */}
        <button
          onClick={() => router.push(`/member/plans?event=${id}`)}
          style={{ width: "100%", marginTop: 12, padding: "16px 20px", borderRadius: 18, background: "var(--bb-card)", border: "1.5px solid var(--bb-border-strong)", cursor: "pointer", display: "flex", alignItems: "center", gap: 14, textAlign: "left" }}
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
    </div>
  );
}
