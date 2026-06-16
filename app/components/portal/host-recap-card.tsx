"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getLastHostedEventRecap, type HostRecapData } from "@/lib/yande/post-event";

const PINK = "#FF1F7D";

function FlowerIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="7" r="2.5" fill={PINK} />
      {[0, 1, 2, 3, 4].map(i => {
        const angle = (i / 5) * Math.PI * 2 - Math.PI / 2;
        const cx = 7 + Math.cos(angle) * 4.5;
        const cy = 7 + Math.sin(angle) * 4.5;
        return (
          <ellipse
            key={i} cx={cx} cy={cy} rx="2" ry="1.3"
            fill={PINK} opacity="0.55"
            transform={`rotate(${(i / 5) * 360}, ${cx}, ${cy})`}
          />
        );
      })}
    </svg>
  );
}

interface HostRecapCardProps {
  onDismiss?: () => void;
}

export function HostRecapCard({ onDismiss }: HostRecapCardProps) {
  const [loading, setLoading] = useState(true);
  const [recap, setRecap]     = useState<HostRecapData | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    getLastHostedEventRecap()
      .then(r => { setRecap(r); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  function handleDismiss() {
    setDismissed(true);
    onDismiss?.();
  }

  if (loading || !recap || dismissed) return null;

  const filledPct = recap.attendingCount > 0 && recap.flowerCount > 0
    ? Math.round((recap.flowerCount / recap.attendingCount) * 100)
    : 0;

  return (
    <div style={{ padding: "18px 16px 0" }}>
      <div style={{
        position: "relative",
        borderRadius: 20,
        overflow: "hidden",
        background: "linear-gradient(135deg, #FFF3F8 0%, #FDF0F8 100%)",
        border: "1.5px solid rgba(255,31,125,0.16)",
        boxShadow: "0 4px 24px rgba(255,31,125,0.1), 0 1px 0 rgba(255,255,255,0.9) inset",
      }}>

        {/* Top row */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "16px 18px 0",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <FlowerIcon />
            <span style={{
              fontFamily: "var(--font-jost)", fontSize: "8.5px",
              fontWeight: 900, letterSpacing: "0.2em", color: PINK,
            }}>YOUR NIGHT RECAP</span>
          </div>
          <button
            onClick={handleDismiss}
            aria-label="Dismiss"
            style={{ background: "none", border: "none", cursor: "pointer", padding: 4, opacity: 0.35 }}
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="#111" strokeWidth="1.8" strokeLinecap="round">
              <path d="M1 1l8 8M9 1l-8 8" />
            </svg>
          </button>
        </div>

        {/* Event title */}
        <div style={{ padding: "10px 18px 0" }}>
          <p style={{
            fontFamily: "var(--font-playfair)", fontStyle: "italic",
            fontWeight: 400, fontSize: 22, color: "#111", lineHeight: 1.2, letterSpacing: "-0.01em",
          }}>{recap.title}.</p>
          {recap.venue && (
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "11px", color: "rgba(0,0,0,0.38)", marginTop: 3 }}>
              {recap.venue}
            </p>
          )}
        </div>

        {/* Stats */}
        <div style={{ display: "flex", gap: 0, padding: "14px 18px 0" }}>
          <div style={{ textAlign: "center" as const, flex: 1 }}>
            <p style={{
              fontFamily: "var(--font-fraunces)", fontStyle: "italic",
              fontSize: 38, color: "#111", lineHeight: 1,
            }}>{recap.attendingCount}</p>
            <p style={{
              fontFamily: "var(--font-jost)", fontSize: "9px",
              fontWeight: 700, letterSpacing: "0.12em", color: "rgba(0,0,0,0.35)", marginTop: 4,
            }}>WOMEN CAME</p>
          </div>
          {recap.flowerCount > 0 && (
            <>
              <div style={{ width: 1, background: "rgba(0,0,0,0.08)", margin: "4px 16px" }} />
              <div style={{ textAlign: "center" as const, flex: 1 }}>
                <p style={{
                  fontFamily: "var(--font-fraunces)", fontStyle: "italic",
                  fontSize: 38, color: PINK, lineHeight: 1,
                }}>{recap.flowerCount}</p>
                <p style={{
                  fontFamily: "var(--font-jost)", fontSize: "9px",
                  fontWeight: 700, letterSpacing: "0.12em", color: "rgba(0,0,0,0.35)", marginTop: 4,
                }}>FLOWERS ✦</p>
              </div>
            </>
          )}
        </div>

        {/* Flower rate bar */}
        {filledPct > 0 && (
          <div style={{ padding: "10px 18px 0" }}>
            <div style={{ height: 3, borderRadius: 999, background: "rgba(255,31,125,0.1)", overflow: "hidden" }}>
              <div style={{
                width: `${filledPct}%`, height: "100%",
                background: `linear-gradient(90deg, ${PINK}, #FF5BAD)`,
                borderRadius: 999,
              }} />
            </div>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "9px", color: "rgba(0,0,0,0.3)", marginTop: 5 }}>
              {filledPct}% left flowers
            </p>
          </div>
        )}

        <p style={{
          fontFamily: "var(--font-caveat)", fontSize: 14,
          color: "rgba(0,0,0,0.4)", padding: "8px 18px 0", lineHeight: 1.5,
        }}>
          You did that. They showed up because of you.
        </p>

        {/* CTAs */}
        <div style={{ display: "flex", gap: 9, padding: "14px 18px 18px" }}>
          <Link href="/member/host" style={{ textDecoration: "none", flex: 1 }}>
            <div style={{
              textAlign: "center" as const,
              background: "#111", color: "white",
              borderRadius: 999, padding: "12px 0",
              fontFamily: "var(--font-jost)", fontSize: "11px",
              fontWeight: 800, letterSpacing: "0.06em",
              boxShadow: "0 2px 0 rgba(0,0,0,0.6), 0 4px 12px rgba(0,0,0,0.18)",
            }}>Host again →</div>
          </Link>
          <Link href={`/member/happenings/${recap.gatheringId}`} style={{ textDecoration: "none", flex: 1 }}>
            <div style={{
              textAlign: "center" as const,
              background: "white", color: "#111",
              border: "1.5px solid rgba(0,0,0,0.1)",
              borderRadius: 999, padding: "12px 0",
              fontFamily: "var(--font-jost)", fontSize: "11px",
              fontWeight: 800, letterSpacing: "0.06em",
            }}>See event</div>
          </Link>
        </div>
      </div>
    </div>
  );
}
