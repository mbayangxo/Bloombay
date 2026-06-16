"use client";

import { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import { getTraditionBySlug, toggleFollowTradition, type Tradition } from "@/lib/actions/traditions";

const PINK  = "#FF1F7D";
const DARK  = "#1C1B1C";
const PAPER = "#FEFCF7";

const FREQ_LABEL: Record<string, string> = {
  weekly: "Every week", biweekly: "Every two weeks",
  monthly: "Monthly", seasonal: "Seasonal", irregular: "Recurring",
};

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}

type TraditionGathering = {
  id: string; title: string; starts_at: string;
  venue: string | null; attending_count: number; spots_left: number | null;
};
type TraditionWithGatherings = Tradition & { gatherings?: TraditionGathering[] };

export default function TraditionPage({ params }: { params: { slug: string } }) {
  const [tradition, setTradition] = useState<TraditionWithGatherings | null>(null);
  const [loading, setLoading] = useState(true);
  const [, startTransition] = useTransition();

  useEffect(() => {
    getTraditionBySlug(params.slug).then(t => {
      setTradition(t as typeof tradition);
      setLoading(false);
    });
  }, [params.slug]);

  function follow() {
    if (!tradition) return;
    const next = !tradition.is_following;
    setTradition(t => t ? { ...t, is_following: next, follower_count: t.follower_count + (next ? 1 : -1) } : t);
    startTransition(async () => { await toggleFollowTradition(tradition.id); });
  }

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: PAPER, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 28, height: 28, borderRadius: "50%", border: `2.5px solid ${PINK}`, borderTopColor: "transparent", animation: "spin 0.8s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    );
  }

  if (!tradition) {
    return (
      <div style={{ minHeight: "100vh", background: PAPER, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 12 }}>
        <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 22, color: PINK }}>Tradition not found.</p>
        <Link href="/member/happenings" style={{ color: PINK, fontFamily: "var(--font-jost)", fontSize: 12 }}>← Back to Happenings</Link>
      </div>
    );
  }

  const gatherings: TraditionGathering[] = tradition.gatherings ?? [];

  return (
    <div style={{ minHeight: "100vh", background: PAPER, paddingBottom: 96 }}>
      {/* Header */}
      <div style={{
        background: `linear-gradient(160deg, ${DARK} 0%, #2A0818 50%, ${tradition.primary_color}44 100%)`,
        paddingTop: "calc(env(safe-area-inset-top, 0px) + 56px)",
        paddingBottom: 32, position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: -30, right: -30, width: 160, height: 160, borderRadius: "50%", background: `radial-gradient(circle, ${tradition.primary_color}28 0%, transparent 70%)`, pointerEvents: "none" }} />
        <div style={{ padding: "0 20px 14px" }}>
          <Link href="/member/happenings" style={{ display: "inline-flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2.2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
            </div>
            <span style={{ fontFamily: "var(--font-jost)", fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.45)", letterSpacing: "0.08em" }}>HAPPENINGS</span>
          </Link>
        </div>
        <div style={{ padding: "0 20px" }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: 8, fontWeight: 800, letterSpacing: "0.3em", color: tradition.primary_color, marginBottom: 6 }}>
            🌸 TRADITION · {FREQ_LABEL[tradition.frequency]}
          </p>
          <h1 style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900, fontSize: "clamp(32px,9vw,48px)", color: "rgba(255,238,220,0.92)", lineHeight: 0.95, margin: 0 }}>
            {tradition.name}
          </h1>
          {tradition.description && (
            <p style={{ fontFamily: "var(--font-caveat)", fontSize: 14, color: "rgba(255,255,255,0.45)", marginTop: 10, lineHeight: 1.5 }}>{tradition.description}</p>
          )}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 16 }}>
            <div style={{ display: "flex", gap: 12 }}>
              <div style={{ textAlign: "center" as const }}>
                <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900, fontSize: 20, color: tradition.primary_color }}>{tradition.follower_count}</p>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: 7, fontWeight: 700, color: "rgba(255,255,255,0.35)", letterSpacing: "0.08em" }}>FOLLOWING</p>
              </div>
              <div style={{ textAlign: "center" as const }}>
                <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900, fontSize: 20, color: tradition.primary_color }}>{gathering_count_display(tradition.gathering_count, gatherings.length)}</p>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: 7, fontWeight: 700, color: "rgba(255,255,255,0.35)", letterSpacing: "0.08em" }}>EDITIONS</p>
              </div>
            </div>
            <button onClick={follow} style={{
              marginLeft: "auto", flexShrink: 0,
              background: tradition.is_following ? "rgba(255,255,255,0.12)" : tradition.primary_color,
              border: "none", borderRadius: 999, padding: "10px 22px",
              color: "white", fontFamily: "var(--font-jost)", fontSize: 11, fontWeight: 800,
              cursor: "pointer", boxShadow: tradition.is_following ? "none" : `0 4px 14px ${tradition.primary_color}55`,
              transition: "all 0.18s",
            }}>
              {tradition.is_following ? "FOLLOWING ✓" : "FOLLOW →"}
            </button>
          </div>
          {tradition.host_name && (
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, color: "rgba(255,255,255,0.28)", marginTop: 10 }}>
              Hosted by {tradition.host_name} · {tradition.neighborhood ?? "NYC"}
            </p>
          )}
        </div>
      </div>

      {/* Past & Upcoming Editions */}
      <div style={{ padding: "24px 20px 0" }}>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 800, letterSpacing: "0.22em", color: "rgba(0,0,0,0.28)", marginBottom: 14 }}>ALL EDITIONS</p>

        {gatherings.length === 0 ? (
          <div style={{ textAlign: "center" as const, padding: "40px 0" }}>
            <p style={{ fontFamily: "var(--font-caveat)", fontSize: 18, color: "rgba(255,31,125,0.4)" }}>This tradition is being planned.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {gatherings.map(g => {
              const isPast = new Date(g.starts_at) < new Date();
              return (
                <Link key={g.id} href={`/member/happenings/${g.id}`} style={{ textDecoration: "none" }}>
                  <div style={{
                    background: "white", borderRadius: 16, padding: "14px 16px",
                    display: "flex", alignItems: "center", gap: 12,
                    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                    borderLeft: `3px solid ${isPast ? "rgba(0,0,0,0.1)" : tradition.primary_color}`,
                    opacity: isPast ? 0.7 : 1,
                  }}>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 700, fontSize: 14, color: DARK }}>{g.title}</p>
                      <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, color: "#bbb", marginTop: 3 }}>
                        {fmtDate(g.starts_at)}{g.venue ? ` · ${g.venue}` : ""}
                      </p>
                    </div>
                    <div style={{ textAlign: "right" as const, flexShrink: 0 }}>
                      <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 700, color: isPast ? "#bbb" : tradition.primary_color }}>
                        {isPast ? `${g.attending_count} attended` : g.spots_left !== null ? `${g.spots_left} spots left` : `${g.attending_count} going`}
                      </p>
                      <p style={{ fontFamily: "var(--font-jost)", fontSize: 8, color: "#ddd", marginTop: 2 }}>{isPast ? "Past" : "Upcoming"}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function gathering_count_display(dbCount: number, localLength: number): number {
  return Math.max(dbCount, localLength);
}
