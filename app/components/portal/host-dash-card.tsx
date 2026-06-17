"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getMyHostedGatherings, type HostedGathering } from "@/lib/actions/happenings";

const PINK = "#FF1F7D";

function fmtShort(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    weekday: "short", month: "short", day: "numeric",
    hour: "numeric", minute: "2-digit",
  });
}

function countdown(iso: string): string {
  const diff = new Date(iso).getTime() - Date.now();
  if (diff <= 0) return "HAPPENING NOW";
  const h = Math.floor(diff / 3600000);
  const d = Math.floor(h / 24);
  if (d > 0) return `IN ${d} DAY${d > 1 ? "S" : ""}`;
  if (h > 0) return `IN ${h}H`;
  const m = Math.floor(diff / 60000);
  return m > 0 ? `IN ${m}MIN` : "VERY SOON";
}

function FillBar({ pct }: { pct: number }) {
  return (
    <div style={{ height: 3, borderRadius: 999, background: "rgba(255,255,255,0.1)", overflow: "hidden" }}>
      <div style={{
        width: `${Math.min(pct, 100)}%`, height: "100%",
        background: `linear-gradient(90deg, ${PINK}, #FF5BAD)`,
        borderRadius: 999, transition: "width 0.6s ease",
      }} />
    </div>
  );
}

function NextEventCard({ event }: { event: HostedGathering }) {
  const spotsLeft = event.spots_left ?? (event.capacity ? event.capacity - event.attending_count : null);
  const pct = event.capacity ? Math.round((event.attending_count / event.capacity) * 100) : null;

  return (
    <div style={{
      borderRadius: 20,
      background: "linear-gradient(145deg, #0D0010 0%, #200030 55%, rgba(255,31,125,0.18) 100%)",
      border: "1px solid rgba(255,31,125,0.22)",
      boxShadow: "0 6px 32px rgba(255,31,125,0.14), 0 2px 0 rgba(0,0,0,0.5)",
      overflow: "hidden",
    }}>
      {/* Header */}
      <div style={{ padding: "16px 20px 14px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "8.5px", fontWeight: 900, letterSpacing: "0.22em", color: PINK }}>✦ YOU&apos;RE HOSTING</p>
          <div style={{
            padding: "3px 10px", borderRadius: 999,
            background: "rgba(255,31,125,0.18)", border: "1px solid rgba(255,31,125,0.3)",
          }}>
            <span style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 900, letterSpacing: "0.1em", color: PINK }}>
              {countdown(event.starts_at)}
            </span>
          </div>
        </div>
        <p style={{
          fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontWeight: 400,
          fontSize: 22, color: "rgba(255,255,255,0.93)", lineHeight: 1.15, marginBottom: 4,
        }}>{event.title}</p>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: "10px", color: "rgba(255,255,255,0.35)" }}>
          {fmtShort(event.starts_at)}
          {event.venue ? ` · ${event.venue}` : ""}
          {event.neighborhood ? ` · ${event.neighborhood}` : ""}
        </p>
      </div>

      {/* Attendance */}
      <div style={{ padding: "14px 20px 16px" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: pct !== null ? 8 : 14 }}>
          <span style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontSize: 38, color: "white", lineHeight: 1 }}>
            {event.attending_count}
          </span>
          <span style={{ fontFamily: "var(--font-jost)", fontSize: "11px", color: "rgba(255,255,255,0.38)" }}>
            women coming{spotsLeft !== null && spotsLeft > 0 ? ` · ${spotsLeft} spots left` : ""}
          </span>
        </div>
        {pct !== null && <FillBar pct={pct} />}

        <div style={{ display: "flex", gap: 9, marginTop: 14 }}>
          <Link href="/member/host?tab=dashboard" style={{ textDecoration: "none", flex: 1 }}>
            <div style={{
              textAlign: "center" as const, padding: "12px 0", borderRadius: 999,
              background: PINK,
              fontFamily: "var(--font-jost)", fontSize: "10.5px", fontWeight: 900,
              color: "white", letterSpacing: "0.06em",
              boxShadow: `0 2px 0 rgba(150,0,55,0.75), 0 6px 18px ${PINK}55`,
            }}>GUEST LIST →</div>
          </Link>
          <Link href={`/member/happenings/${event.id}`} style={{ textDecoration: "none", flex: 1 }}>
            <div style={{
              textAlign: "center" as const, padding: "12px 0", borderRadius: 999,
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.13)",
              fontFamily: "var(--font-jost)", fontSize: "10.5px", fontWeight: 700,
              color: "rgba(255,255,255,0.65)", letterSpacing: "0.04em",
            }}>VIEW EVENT</div>
          </Link>
        </div>
      </div>
    </div>
  );
}

function EmptyHostCard() {
  return (
    <Link href="/member/host" style={{ textDecoration: "none", display: "block" }}>
      <div style={{ position: "relative" }}>
        {/* Ghost card behind — slight tilt opposite direction */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(145deg, #0d0010 0%, #1a0020 100%)",
          borderRadius: 14,
          transform: "rotate(-1.2deg) translateY(3px)",
          opacity: 0.5,
        }} />

        {/* Main invitation card */}
        <div style={{
          position: "relative",
          borderRadius: 14,
          background: "linear-gradient(155deg, #0f0012 0%, #1e0030 55%, #160024 100%)",
          boxShadow: [
            "inset 0 1px 0 rgba(255,255,255,0.08)",
            "0 2px 0 #050008",
            "0 4px 0 rgba(0,0,0,0.4)",
            "0 12px 32px rgba(0,0,0,0.5)",
            `0 0 0 1px rgba(255,31,125,0.12)`,
          ].join(", "),
          transform: "rotate(0.6deg)",
          padding: "16px 18px",
          overflow: "hidden",
        }}>
          {/* Decorative corner flower — top right */}
          <svg style={{ position: "absolute", top: -8, right: -8, opacity: 0.12, pointerEvents: "none" }} width="72" height="72" viewBox="0 0 72 72" fill="none">
            {[0,1,2,3,4].map(i => {
              const a = (i/5)*Math.PI*2;
              return <ellipse key={i} cx={36+Math.cos(a)*22} cy={36+Math.sin(a)*22} rx="10" ry="18" fill={PINK} transform={`rotate(${i*72} ${36+Math.cos(a)*22} ${36+Math.sin(a)*22})`} />;
            })}
            <circle cx="36" cy="36" r="9" fill={PINK} />
          </svg>

          {/* Pink top border line — invitation header rule */}
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${PINK}88, transparent)` }} />

          <p style={{ fontFamily: "var(--font-jost)", fontSize: "7.5px", fontWeight: 900, letterSpacing: "0.24em", color: PINK, marginBottom: 8 }}>✦ HOST SOMETHING</p>

          <p style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontSize: 17, color: "rgba(255,255,255,0.9)", lineHeight: 1.2, marginBottom: 12 }}>
            Bring women together<br />this week.
          </p>

          {/* Activity chips — smaller */}
          <div style={{ display: "flex", gap: 5, flexWrap: "wrap" as const, marginBottom: 14 }}>
            {["Dinner", "Brunch", "Walk", "Coffee", "Museum"].map(k => (
              <div key={k} style={{
                padding: "4px 10px", borderRadius: 999,
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.09)",
                fontFamily: "var(--font-jost)", fontSize: "9px",
                fontWeight: 600, color: "rgba(255,255,255,0.42)",
              }}>{k}</div>
            ))}
          </div>

          {/* CTA — pill button, slightly smaller */}
          <div style={{
            display: "inline-flex", padding: "9px 20px", borderRadius: 999,
            background: PINK,
            boxShadow: `0 2px 0 rgba(130,0,45,0.8), 0 5px 16px ${PINK}44`,
            fontFamily: "var(--font-jost)", fontSize: "9.5px",
            fontWeight: 900, color: "white", letterSpacing: "0.07em",
          }}>HOST SOMETHING →</div>
        </div>
      </div>
    </Link>
  );
}

export function HostDashCard() {
  const [loading, setLoading] = useState(true);
  const [next, setNext] = useState<HostedGathering | null>(null);

  useEffect(() => {
    getMyHostedGatherings()
      .then(({ upcoming }) => { setNext(upcoming[0] ?? null); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return null;

  return (
    <div style={{ padding: "20px 16px 0" }}>
      {next ? <NextEventCard event={next} /> : <EmptyHostCard />}
    </div>
  );
}
