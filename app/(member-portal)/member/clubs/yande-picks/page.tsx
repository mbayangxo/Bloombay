"use client";

import { useState } from "react";
import Link from "next/link";

const PINK = "#FF1F7D";
const BABY_PINK = "#FFB3D1";

const PICKS = [
  {
    id: 1,
    name: "Soft Life Club NYC",
    color: PINK,
    women: 312,
    tags: ["Lifestyle", "Wellness"],
    vibe: "Brunches, spa days, rooftop hangs.",
    why: "You go to wellness events and love rooftop gatherings. This is your vibe.",
    activity: "12 women online now",
    live: true,
  },
  {
    id: 2,
    name: "Girl Creatives",
    color: "#FF5FA5",
    women: 98,
    tags: ["Art", "Creative"],
    vibe: "Monthly showcases and collabs.",
    why: "You've attended two art events this month. These women are making things.",
    activity: "New showcase posted",
    live: false,
  },
  {
    id: 3,
    name: "Jazz & Wine Girls",
    color: BABY_PINK,
    women: 61,
    tags: ["Music", "Social"],
    vibe: "Jazz nights, wine bars, vinyl listening sessions.",
    why: "Your taste in events says you love atmosphere. This club lives in it.",
    activity: "Friday night plans",
    live: false,
  },
];

function ClubCrest({ name, color }: { name: string; color: string }) {
  const initials = name.split(" ").slice(0, 2).map((w: string) => w[0]).join("").toUpperCase();
  return (
    <div style={{
      width: 56,
      height: 56,
      borderRadius: "50%",
      background: `radial-gradient(circle at 35% 35%, ${color}, ${color}bb)`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: 800,
      color: "white",
      fontSize: 17,
      flexShrink: 0,
      boxShadow: `0 4px 16px ${color}44`,
    }}>
      {initials}
    </div>
  );
}

export default function YandePicksPage() {
  const [applied, setApplied] = useState<Set<number>>(new Set());

  return (
    <div style={{ minHeight: "100vh", paddingBottom: 112, background: "var(--bb-bg)" }}>

      {/* Header */}
      <div style={{ position: "relative", padding: "56px 20px 32px", background: "var(--bb-bg)", borderBottom: "1px solid var(--bb-border)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <Link href="/member/home" style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "var(--bb-nav-bg)",
            border: "1px solid var(--bb-nav-border)",
            textDecoration: "none",
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--bb-nav-icon)" strokeWidth="2.2" strokeLinecap="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </Link>
          <p style={{ fontFamily: "var(--font-jost)", fontWeight: 800, fontSize: 9, letterSpacing: "0.3em", textTransform: "uppercase", color: `${PINK}99`, margin: 0 }}>
            ✦ YANDE PICKED THESE
          </p>
          <div style={{ width: 40 }} />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: `rgba(255,31,125,0.1)`, border: `1px solid ${PINK}30`, flexShrink: 0 }}>
            <span style={{ color: PINK, fontSize: 12 }}>✦</span>
          </div>
          <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 12, color: "var(--bb-text-2)", margin: 0 }}>
            Yande curated these for your energy.
          </p>
        </div>

        <h1 style={{
          fontFamily: "var(--font-playfair)",
          fontStyle: "italic",
          fontWeight: 800,
          fontSize: "clamp(42px, 11vw, 56px)",
          color: "var(--bb-text)",
          lineHeight: 0.92,
          margin: "0 0 6px",
        }}>
          3 for you.
        </h1>
        <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 11, color: "var(--bb-text-3)", margin: 0 }}>
          Based on your events, energy, and taste.
        </p>
      </div>

      {/* Club picks */}
      <div style={{ padding: "16px 20px 0", display: "flex", flexDirection: "column", gap: 14 }}>
        {PICKS.map((club, i) => (
          <div key={club.id} style={{
            borderRadius: 20,
            overflow: "hidden",
            background: "var(--bb-card)",
            boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
            border: "1px solid var(--bb-border)",
          }}>
            {/* Top accent line */}
            <div style={{ height: 3, background: `linear-gradient(90deg, ${club.color}, ${club.color}66)` }} />

            <div style={{ padding: 20 }}>
              {/* Header row */}
              <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 14 }}>
                <ClubCrest name={club.name} color={club.color} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2, flexWrap: "wrap" as const }}>
                    <p style={{ fontFamily: "var(--font-playfair)", fontWeight: 700, fontSize: 15, color: "var(--bb-text)", margin: 0, lineHeight: 1.2 }}>
                      {club.name}
                    </p>
                    <span style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 800, background: "var(--bb-text)", color: "var(--bb-bg)", borderRadius: 999, padding: "3px 8px", letterSpacing: "0.06em" }}>
                      #{i + 1} PICK
                    </span>
                  </div>
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: 11, color: "var(--bb-text-3)", margin: "0 0 4px" }}>{club.women} women</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    {club.live && <span style={{ width: 6, height: 6, borderRadius: "50%", background: PINK, flexShrink: 0 }} />}
                    <p style={{ fontFamily: "var(--font-jost)", fontSize: 11, color: club.live ? PINK : "var(--bb-text-muted)", margin: 0 }}>{club.activity}</p>
                  </div>
                </div>
              </div>

              {/* Why Yande picked it */}
              <div style={{ borderRadius: 14, padding: "12px 14px", marginBottom: 14, background: `rgba(255,31,125,0.06)`, border: `1px solid ${PINK}20` }}>
                <p style={{ fontFamily: "var(--font-jost)", fontWeight: 800, fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", color: PINK, marginBottom: 4 }}>
                  Why Yande picked this
                </p>
                <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 12, color: "var(--bb-text-2)", lineHeight: 1.5, margin: 0 }}>
                  {club.why}
                </p>
              </div>

              {/* Tags */}
              <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" as const, alignItems: "center" }}>
                {club.tags.map(tag => (
                  <span key={tag} style={{ fontFamily: "var(--font-jost)", fontSize: 11, fontWeight: 700, padding: "4px 12px", borderRadius: 999, background: `rgba(255,31,125,0.08)`, color: PINK }}>
                    {tag}
                  </span>
                ))}
                <span style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 11, color: "var(--bb-text-muted)" }}>{club.vibe}</span>
              </div>

              {/* CTA */}
              <div style={{ display: "flex", gap: 10 }}>
                <button
                  onClick={() => setApplied(p => { const n = new Set(p); n.has(club.id) ? n.delete(club.id) : n.add(club.id); return n; })}
                  style={{
                    flex: 1,
                    padding: "12px",
                    borderRadius: 14,
                    fontFamily: "var(--font-jost)",
                    fontWeight: 700,
                    fontSize: 13,
                    letterSpacing: "0.06em",
                    cursor: "pointer",
                    transition: "all 0.18s",
                    ...(applied.has(club.id)
                      ? { background: `rgba(255,31,125,0.08)`, color: PINK, border: `1px solid ${PINK}30` }
                      : { background: PINK, color: "white", border: "none", boxShadow: `0 4px 14px ${PINK}40` }),
                  }}
                >
                  {applied.has(club.id) ? "Applied ✓" : "Apply to Join →"}
                </button>
                <Link href="/member/clubs" style={{
                  padding: "12px 16px",
                  borderRadius: 14,
                  fontFamily: "var(--font-jost)",
                  fontWeight: 700,
                  fontSize: 13,
                  textDecoration: "none",
                  background: "var(--bb-nav-bg)",
                  color: "var(--bb-text-2)",
                  border: "1px solid var(--bb-border)",
                  display: "flex",
                  alignItems: "center",
                }}>
                  View
                </Link>
              </div>
            </div>
          </div>
        ))}

        {/* Browse all */}
        <Link href="/member/clubs" style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          padding: "14px",
          borderRadius: 16,
          fontFamily: "var(--font-jost)",
          fontWeight: 700,
          fontSize: 13,
          textDecoration: "none",
          background: "var(--bb-card)",
          border: "1.5px solid var(--bb-border)",
          color: "var(--bb-text-2)",
        }}>
          Browse all clubs →
        </Link>
      </div>
    </div>
  );
}
