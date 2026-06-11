"use client";

import { useState } from "react";
import Link from "next/link";

const PICKS = [
  {
    id: 1,
    name: "Soft Life Club NYC",
    color: "#FF69B4",
    crestBg: "#C51B7A",
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
    color: "#EC4899",
    crestBg: "#9D174D",
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
    color: "#8B5CF6",
    crestBg: "#5B21B6",
    women: 61,
    tags: ["Music", "Social"],
    vibe: "Jazz nights, wine bars, vinyl listening sessions.",
    why: "Your taste in events says you love atmosphere. This club lives in it.",
    activity: "Friday night plans",
    live: false,
  },
];

function ClubCrest({ name, color, crestBg }: { name: string; color: string; crestBg: string }) {
  const initials = name.split(" ").slice(0, 2).map((w: string) => w[0]).join("").toUpperCase();
  return (
    <div className="flex-shrink-0 relative rounded-full flex items-center justify-center font-bold text-white"
      style={{
        width: 56, height: 56,
        background: `radial-gradient(circle at 35% 35%, ${color}, ${crestBg})`,
        boxShadow: `0 4px 16px ${color}44, inset 0 1px 0 rgba(255,255,255,0.2)`,
        fontSize: 17,
      }}>
      <div className="absolute inset-0 rounded-full pointer-events-none"
        style={{ border: "1.5px solid rgba(255,255,255,0.22)", transform: "scale(0.86)" }} />
      <span className="relative z-10">{initials}</span>
    </div>
  );
}

export default function YandePicksPage() {
  const [applied, setApplied] = useState<Set<number>>(new Set());

  return (
    <div className="min-h-screen pb-28" style={{ background: "var(--pale-pink-bg, #FDFAF5)" }}>
      {/* Header */}
      <div className="relative overflow-hidden" style={{ background: "#0A0508", paddingBottom: "32px" }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(255,31,125,0.16) 0%, transparent 65%)" }} />
        <div className="relative flex items-center justify-between px-5 pt-14 pb-0 md:pt-10">
          <Link href="/member/home"
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-95"
            style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.65)" strokeWidth="2.2" strokeLinecap="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </Link>
          <p className="text-[9px] font-bold tracking-[0.3em] uppercase" style={{ color: "rgba(255,31,125,0.65)" }}>✦ YANDE PICKED THESE</p>
          <div className="w-10" />
        </div>
        <div className="relative px-5 pt-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: "rgba(255,31,125,0.2)", border: "1px solid rgba(255,31,125,0.3)" }}>
              <span style={{ color: "#FF1F7D", fontSize: "12px" }}>✦</span>
            </div>
            <p className="text-xs font-semibold italic" style={{ color: "rgba(255,255,255,0.55)", fontFamily: "var(--font-playfair)" }}>
              Yande curated these for your energy.
            </p>
          </div>
          <h1 className="font-black italic leading-none"
            style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(42px,11vw,60px)", color: "rgba(255,238,220,0.92)", lineHeight: 0.9 }}>
            3 for you.
          </h1>
          <p className="text-[11px] italic mt-2" style={{ color: "rgba(255,255,255,0.28)", fontFamily: "var(--font-playfair)" }}>
            Based on your events, energy, and taste.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-8 pointer-events-none"
          style={{ background: "linear-gradient(to bottom, transparent, var(--pale-pink-bg, #FDFAF5))" }} />
      </div>

      {/* Club picks */}
      <div className="px-5 pt-2 flex flex-col gap-4 md:px-8">
        {PICKS.map((club, i) => (
          <div key={club.id} className="rounded-3xl overflow-hidden"
            style={{ background: "white", boxShadow: "0 4px 20px rgba(0,0,0,0.07)", border: "1px solid rgba(0,0,0,0.05)" }}>
            {/* Top accent line */}
            <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${club.color}, ${club.crestBg})` }} />
            <div className="p-5">
              {/* Header */}
              <div className="flex items-start gap-4 mb-4">
                <ClubCrest name={club.name} color={club.color} crestBg={club.crestBg} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <p className="font-bold text-base leading-snug" style={{ fontFamily: "var(--font-playfair)", color: "#111111" }}>
                      {club.name}
                    </p>
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full"
                      style={{ background: "#111111", color: "white" }}>
                      #{i + 1} PICK
                    </span>
                  </div>
                  <p className="text-xs mt-0.5" style={{ color: "#bbb" }}>{club.women} women</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    {club.live && <span className="w-1.5 h-1.5 rounded-full animate-pulse flex-shrink-0" style={{ background: "#FF1F7D" }} />}
                    <p className="text-[11px]" style={{ color: club.live ? "#FF1F7D" : "#ccc" }}>{club.activity}</p>
                  </div>
                </div>
              </div>

              {/* Why Yande picked it */}
              <div className="rounded-2xl px-4 py-3 mb-4"
                style={{ background: "#FFF5F8", border: "1px solid #FFE0EE" }}>
                <p className="text-[9px] font-bold tracking-[0.18em] uppercase mb-1" style={{ color: "#FF1F7D" }}>Why Yande picked this</p>
                <p className="text-xs leading-relaxed italic" style={{ fontFamily: "var(--font-playfair)", color: "#555" }}>
                  {club.why}
                </p>
              </div>

              {/* Tags */}
              <div className="flex gap-2 mb-4 flex-wrap">
                {club.tags.map(tag => (
                  <span key={tag} className="text-[11px] font-bold px-3 py-1 rounded-full"
                    style={{ background: `${club.color}18`, color: club.color }}>
                    {tag}
                  </span>
                ))}
                <span className="text-[11px] italic px-2 py-1"
                  style={{ fontFamily: "var(--font-playfair)", color: "#bbb" }}>{club.vibe}</span>
              </div>

              {/* CTA */}
              <div className="flex gap-2">
                <button
                  onClick={() => setApplied(p => { const n = new Set(p); n.has(club.id) ? n.delete(club.id) : n.add(club.id); return n; })}
                  className="flex-1 py-3 rounded-2xl text-sm font-bold transition-all active:scale-[0.98]"
                  style={applied.has(club.id)
                    ? { background: "#FFF0F5", color: "#FF1F7D", border: "1px solid #FFD6E8" }
                    : { background: club.color, color: "white", boxShadow: `0 4px 14px ${club.color}44` }}>
                  {applied.has(club.id) ? "Applied ✓" : "Apply to Join →"}
                </button>
                <Link href="/member/clubs"
                  className="px-4 py-3 rounded-2xl text-sm font-bold transition-all active:scale-95 text-center"
                  style={{ background: "rgba(0,0,0,0.04)", color: "#888" }}>
                  View
                </Link>
              </div>
            </div>
          </div>
        ))}

        {/* Browse all */}
        <Link href="/member/clubs"
          className="flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-semibold transition-all active:scale-[0.98]"
          style={{ background: "white", border: "1.5px solid #F0F0F0", color: "#888", boxShadow: "0 1px 8px rgba(0,0,0,0.04)" }}>
          Browse all clubs →
        </Link>
      </div>
    </div>
  );
}
