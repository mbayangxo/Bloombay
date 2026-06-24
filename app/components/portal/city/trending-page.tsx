"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  PINK, DARK,
  PAPER_TEX,
} from "@/lib/city/tokens";
import {
  TICKER_ITEMS, TREND_LIST,
} from "@/lib/city/city-data";
import { BackBtn } from "./shared";

export function TrendingPage({ onBack }: { onBack: () => void }) {
  // Live data from city_trending table; falls back to demo list when empty
  const [liveItems, setLiveItems] = useState<Array<{
    id: string; name: string; category: string; description: string | null;
    source: string | null; badge: string | null; save_count: number; neighborhood: string | null;
  }>>([]);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("city_trending")
      .select("id,name,category,description,source,badge,save_count,neighborhood")
      .eq("status", "approved")
      .order("rank_order", { ascending: true })
      .limit(10)
      .then(({ data }) => { if (data && data.length > 0) setLiveItems(data); });
  }, []);

  const displayItems = liveItems.length > 0
    ? liveItems.map((item, i) => ({
        rank: i + 1,
        name: item.name,
        tag: item.category.toUpperCase(),
        count: item.save_count,
        hot: i < 2,
        badge: item.badge,
        description: item.description,
        source: item.source,
      }))
    : TREND_LIST.map(item => ({ ...item, description: null, source: null }));

  const tickerNames = liveItems.length > 0
    ? liveItems.map(i => i.name.toUpperCase())
    : TICKER_ITEMS;

  const tickerText = tickerNames.join("   ✦   ") + "   ✦   ";
  const doubled = tickerText + tickerText;

  return (
    <div style={{
      backgroundImage: `${PAPER_TEX}`,
      backgroundSize: "200px 200px",
      backgroundColor: "#FFF0FC",
      minHeight: "100vh", paddingBottom: 120,
    }}>
      {/* Hero */}
      <div style={{ position: "relative", height: 240, overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, #1A0028 0%, #280A0A 40%, #200812 80%, #0E0018 100%)" }}/>
        {/* Neon glow layers */}
        <div style={{ position: "absolute", top: "30%", left: "20%", width: 180, height: 180, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,31,125,0.3) 0%, transparent 70%)", filter: "blur(30px)" }}/>
        <div style={{ position: "absolute", top: "20%", right: "10%", width: 120, height: 120, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,85,0,0.25) 0%, transparent 70%)", filter: "blur(22px)" }}/>
        {/* TRENDING° neon-style letters */}
        <div style={{ position: "absolute", top: 80, left: 18, right: 18 }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.28em", color: "#FF7744", marginBottom: 8 }}>TRENDING · NYC</p>
          <p style={{ fontFamily: "var(--font-playfair)", fontSize: "clamp(22px, 7.5vw, 30px)", fontWeight: 900, fontStyle: "italic", color: "white", lineHeight: 1, textShadow: "0 0 30px rgba(255,31,125,0.7), 0 0 60px rgba(255,85,0,0.3)" }}>What&apos;s<br />Hot Right Now.</p>
        </div>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 30%, rgba(8,1,14,0.7) 100%)" }}/>
        <BackBtn onBack={onBack} label="CITY"/>
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${PINK}88, #FF774466, transparent)` }}/>
      </div>

      {/* Ticker tape */}
      <div style={{ background: "#FF1F7D", overflow: "hidden", height: 28, display: "flex", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", whiteSpace: "nowrap", animation: "tickerScroll 18s linear infinite" }}>
          <span style={{ fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 800, color: "white", letterSpacing: "0.1em", paddingRight: 0 }}>
            {doubled}
          </span>
        </div>
      </div>

      {/* Trending list */}
      <div style={{ padding: "16px 16px 0" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.2em", color: "rgba(255,119,68,0.8)" }}>THIS WEEK&apos;S HOT LIST</p>
          <div style={{ background: "rgba(255,31,125,0.12)", border: "1px solid rgba(255,31,125,0.25)", borderRadius: 999, padding: "3px 10px" }}>
            <span style={{ fontFamily: "var(--font-jost)", fontSize: "7.5px", fontWeight: 700, color: PINK, animation: "hotPulse 2s ease-in-out infinite" }}>● LIVE</span>
          </div>
        </div>

        {displayItems.map((item, i) => (
          <div key={item.rank} style={{
            backgroundImage: `${PAPER_TEX}`,
            backgroundSize: "200px 200px",
            backgroundColor: i < 2 ? "#FFE8F5" : "#FFF5FA",
            borderRadius: 16, marginBottom: 8, overflow: "hidden",
            border: i < 2 ? `1px solid rgba(255,31,125,${i === 0 ? "0.35" : "0.18"})` : "1px solid rgba(255,31,125,0.08)",
            boxShadow: i === 0 ? "0 4px 16px rgba(255,31,125,0.12)" : "none",
          }}>
            <div style={{ display: "flex", alignItems: "center", padding: "14px 14px", gap: 14 }}>
              {/* Rank number */}
              <div style={{ flexShrink: 0, width: 32, textAlign: "center" as const }}>
                <p style={{ fontFamily: "var(--font-playfair)", fontSize: i < 2 ? 26 : 20, fontWeight: 900, fontStyle: "italic",
                  color: i === 0 ? PINK : i === 1 ? "#FF7744" : "rgba(180,80,120,0.3)", lineHeight: 1,
                  textShadow: i === 0 ? `0 0 20px ${PINK}44` : "none" }}>
                  {item.rank}
                </p>
              </div>
              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4, flexWrap: "wrap" as const }}>
                  <div style={{ background: "rgba(255,31,125,0.08)", borderRadius: 999, padding: "2px 7px" }}>
                    <span style={{ fontFamily: "var(--font-jost)", fontSize: "6.5px", fontWeight: 800, color: "rgba(180,40,80,0.6)", letterSpacing: "0.1em" }}>{item.tag}</span>
                  </div>
                  {item.badge && (
                    <div style={{ background: i === 0 ? "rgba(255,31,125,0.12)" : "rgba(255,119,68,0.12)", borderRadius: 999, padding: "2px 7px" }}>
                      <span style={{ fontFamily: "var(--font-jost)", fontSize: "6.5px", fontWeight: 800, color: i === 0 ? PINK : "#FF7744" }}>{item.badge}</span>
                    </div>
                  )}
                  {"source" in item && item.source && (
                    <div style={{ background: "rgba(0,0,0,0.04)", borderRadius: 999, padding: "2px 7px" }}>
                      <span style={{ fontFamily: "var(--font-jost)", fontSize: "6.5px", fontWeight: 700, color: "rgba(100,60,80,0.5)", letterSpacing: "0.06em" }}>via {item.source}</span>
                    </div>
                  )}
                </div>
                <p style={{ fontFamily: "var(--font-playfair)", fontSize: 14, fontWeight: 700, fontStyle: "italic", color: DARK, lineHeight: 1.2 }}>{item.name}</p>
                {"description" in item && item.description && (
                  <p style={{ fontFamily: "var(--font-caveat)", fontSize: 12, color: "rgba(120,60,80,0.6)", marginTop: 3, lineHeight: 1.4 }}>{item.description}</p>
                )}
              </div>
              {/* Count */}
              <div style={{ flexShrink: 0, textAlign: "right" as const }}>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "13px", fontWeight: 800, color: i < 2 ? (i === 0 ? PINK : "#FF7744") : "rgba(180,80,120,0.3)", lineHeight: 1 }}>{item.count}</p>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "6.5px", fontWeight: 700, color: "rgba(120,60,80,0.4)", letterSpacing: "0.05em" }}>SAVED</p>
              </div>
            </div>
          </div>
        ))}

        {/* This Week CTA */}
        <div style={{
          backgroundImage: `${PAPER_TEX}`,
          backgroundSize: "200px 200px",
          backgroundColor: "#FFE8F2",
          borderRadius: 18, padding: "22px 20px", marginBottom: 14,
          border: `1px solid rgba(255,31,125,0.18)`,
          boxShadow: "0 4px 16px rgba(255,31,125,0.08)",
        }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.2em", color: "#FF7744", marginBottom: 10 }}>WHAT BLOOMIES ARE DOING THIS WEEK</p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" as const }}>
            {["🍷 Wine tasting","🎭 Off-Broadway","🛍️ Vintage markets","🌙 Jazz nights","🍜 Ramen crawl"].map(item => (
              <div key={item} style={{ background: "rgba(255,255,255,0.7)", border: "1px solid rgba(255,31,125,0.15)", borderRadius: 999, padding: "6px 13px" }}>
                <span style={{ fontFamily: "var(--font-jost)", fontSize: "9px", color: "rgba(120,40,60,0.8)" }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
