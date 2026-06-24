"use client";

import "@/app/styles/bloom-entrance.css";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  PINK, DARK,
  PAPER_TEX,
  type CityCategory, type Band,
} from "@/lib/city/tokens";
import {
  HOOD_INDEX, BANDS,
} from "@/lib/city/city-data";

import { CityLanding, DaySkyline } from "./city/city-landing";
import { EatsPage } from "./city/eats-page";
import { SoloPage } from "./city/solo-page";
import { GoPage } from "./city/go-page";
import { TrendingPage } from "./city/trending-page";
import { BloomiesFavoritesPage } from "./city/bloomies-faves-page";
import { GirlGemsPage } from "./city/girl-gems-page";
import { GirlFavsPage } from "./city/girl-favs-page";
import { NeighborhoodMap } from "./city/neighborhood-map";
import { BackBtn } from "./city/shared";

// ═══════════════════════════════════════════════════════════════════════════════
// COMING SOON  (fallback)
// ═══════════════════════════════════════════════════════════════════════════════
function ComingSoon({ band, onBack }: { band: Band; onBack: () => void }) {
  return (
    <div style={{ background: "linear-gradient(180deg, #FFB3D9 0%, #FFC8A0 100%)", minHeight: "100vh", paddingBottom: 100 }}>
      <div style={{ position: "relative", height: 230, overflow: "hidden" }}>
        <DaySkyline width={430} height={230}/>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 25%, rgba(13,8,20,0.88) 100%)" }}/>
        <BackBtn onBack={onBack} label="CITY"/>
        <div style={{ position: "absolute", bottom: 20, left: 20 }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, letterSpacing: "0.22em", color: band.accentColor, marginBottom: 6 }}>{band.label}</p>
          <p style={{ fontFamily: "var(--font-playfair)", fontSize: 28, fontWeight: 900, fontStyle: "italic", color: "white", lineHeight: 1 }}>Coming<br />Soon</p>
        </div>
      </div>
      <div style={{ padding: "28px 24px" }}>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: "11px", color: "rgba(120,40,80,0.7)", lineHeight: 1.6 }}>We&apos;re curating the best of NYC.<br/>Check back soon.</p>
      </div>
    </div>
  );
}

// ── Neighborhood search bar (hub) ────────────────────────────────────────────
function NeighborhoodSearch() {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const trimmed = query.trim().toLowerCase();
  const results = trimmed.length > 0
    ? HOOD_INDEX.filter(h =>
        h.name.toLowerCase().includes(trimmed) ||
        h.borough.toLowerCase().includes(trimmed) ||
        h.tags.some(t => t.includes(trimmed))
      ).slice(0, 6)
    : [];

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        dropdownRef.current && !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current && !inputRef.current.contains(e.target as Node)
      ) setFocused(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div style={{ position: "relative" }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 10,
        background: "rgba(255,255,255,0.15)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        border: `1.5px solid ${focused ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.28)"}`,
        borderRadius: 16, padding: "13px 16px",
        transition: "border-color 0.2s",
      }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="2.5" strokeLinecap="round">
          <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
        </svg>
        <input
          ref={inputRef}
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          placeholder="Search a neighborhood…"
          style={{
            flex: 1, background: "none", border: "none", outline: "none",
            fontFamily: "var(--font-jost)", fontSize: "14px", fontWeight: 500,
            color: "white", letterSpacing: "0.01em",
          }}
        />
        {query.length > 0 && (
          <button onClick={() => { setQuery(""); inputRef.current?.focus(); }}
            style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex" }}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2.2" strokeLinecap="round">
              <line x1="1" y1="1" x2="11" y2="11"/><line x1="11" y1="1" x2="1" y2="11"/>
            </svg>
          </button>
        )}
      </div>

      {focused && (results.length > 0 || trimmed.length > 0) && (
        <div ref={dropdownRef} style={{
          position: "absolute", top: "calc(100% + 8px)", left: 0, right: 0, zIndex: 40,
          background: "rgba(14,8,18,0.97)", backdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 18, overflow: "hidden",
          boxShadow: "0 16px 48px rgba(0,0,0,0.5)",
        }}>
          {results.length > 0 ? results.map((hood, i) => (
            <Link key={hood.slug} href={`/member/city/neighborhoods/${hood.slug}`}
              style={{ textDecoration: "none", display: "block" }}
              onClick={() => { setQuery(""); setFocused(false); }}>
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "14px 18px",
                borderBottom: i < results.length - 1 ? "1px solid rgba(255,255,255,0.07)" : "none",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: PINK, flexShrink: 0 }} />
                  <div>
                    <p style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontWeight: 300, fontSize: 17, color: "white", lineHeight: 1 }}>{hood.name}</p>
                    <p style={{ fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 700, color: "rgba(255,255,255,0.32)", letterSpacing: "0.1em", marginTop: 3 }}>{hood.borough.toUpperCase()} · {hood.tags.slice(0,2).join(" · ").toUpperCase()}</p>
                  </div>
                </div>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
              </div>
            </Link>
          )) : (
            <div style={{ padding: "20px 18px" }}>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "12px", color: "rgba(255,255,255,0.3)" }}>No neighborhoods found for &ldquo;{trimmed}&rdquo;</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}


// ── Root city page ────────────────────────────────────────────────────────────
type CityRootMode = "guide" | "map";

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN EXPORT
// ═══════════════════════════════════════════════════════════════════════════════
function CityGuide() {
  const [category, setCategory] = useState<CityCategory>("landing");

  if (category === "landing")   return <CityLanding onSelect={setCategory}/>;
  if (category === "eat")       return <EatsPage             onBack={() => setCategory("landing")}/>;
  if (category === "go")        return <GoPage               onBack={() => setCategory("landing")}/>;
  if (category === "solo")      return <SoloPage             onBack={() => setCategory("landing")}/>;
  if (category === "bloomies")  return <BloomiesFavoritesPage onBack={() => setCategory("landing")}/>;
  if (category === "girl_gems") return <GirlGemsPage         onBack={() => setCategory("landing")}/>;
  if (category === "girl_favs") return <GirlFavsPage         onBack={() => setCategory("landing")}/>;

  const band = BANDS.find(b => b.id === category);
  if (!band) return <CityLanding onSelect={setCategory}/>;
  return <ComingSoon band={band} onBack={() => setCategory("landing")}/>;
}

export function CityPage() {
  const [mode, setMode] = useState<CityRootMode>("guide");
  const [hoodQuery, setHoodQuery] = useState("");
  const [hoodOpen, setHoodOpen] = useState(false);

  const MODES: { id: CityRootMode; label: string }[] = [
    { id: "guide", label: "THE CITY" },
    { id: "map",   label: "MAP"   },
  ];

  const hoodResults = hoodQuery.length > 0
    ? HOOD_INDEX.filter(h =>
        h.name.toLowerCase().includes(hoodQuery.toLowerCase()) ||
        h.tags.some(t => t.includes(hoodQuery.toLowerCase()))
      ).slice(0, 5)
    : [];

  return (
    <div className="bloom-world-enter" style={{ minHeight: "100vh" }}>
      {/* Fixed top bar */}
      <div className="md:top-[60px] lg:top-0 lg:left-60 lg:right-[280px]" style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 51,
        paddingTop: "env(safe-area-inset-top, 0px)",
        background: "rgba(255,252,248,0.97)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        borderBottom: "1px solid rgba(255,31,125,0.1)",
        boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
      }}>
        <div style={{ height: 54, display: "flex", alignItems: "center", padding: "0 12px", gap: 7 }}>

          {/* Tab pills */}
          {MODES.map(m => {
            const active = mode === m.id;
            return (
              <button key={m.id} onClick={() => setMode(m.id)} style={{
                padding: "7px 13px", borderRadius: 999, border: "none", cursor: "pointer",
                background: active ? PINK : "rgba(0,0,0,0.06)",
                color: active ? "white" : "rgba(0,0,0,0.45)",
                fontFamily: "var(--font-jost)", fontSize: "10px", fontWeight: 800,
                letterSpacing: "0.07em", whiteSpace: "nowrap" as const,
                boxShadow: active ? `0 4px 14px ${PINK}55` : "none",
                transition: "all 0.18s cubic-bezier(0.34,1.56,0.64,1)",
                flexShrink: 0,
              }}>
                {m.label}
              </button>
            );
          })}

          {/* Divider */}
          <div style={{ width: 1, height: 18, background: "rgba(0,0,0,0.1)", flexShrink: 0 }} />

          {/* Tiny neighborhood search */}
          <div style={{ position: "relative", flex: 1, minWidth: 0 }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 5,
              background: "rgba(0,0,0,0.05)", borderRadius: 999,
              padding: "5px 10px 5px 8px",
              border: hoodOpen ? `1.5px solid ${PINK}55` : "1.5px solid transparent",
              transition: "border-color 0.15s",
            }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.35)" strokeWidth="2.5" strokeLinecap="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                value={hoodQuery}
                onChange={e => { setHoodQuery(e.target.value); setHoodOpen(true); }}
                onFocus={() => setHoodOpen(true)}
                onBlur={() => setTimeout(() => setHoodOpen(false), 150)}
                placeholder="neighborhood…"
                style={{
                  border: "none", background: "transparent", outline: "none",
                  fontFamily: "var(--font-jost)", fontSize: "11px", fontWeight: 500,
                  color: DARK, width: "100%", minWidth: 0,
                }}
              />
              {hoodQuery && (
                <button onClick={() => { setHoodQuery(""); setHoodOpen(false); }} style={{ border: "none", background: "none", padding: 0, cursor: "pointer", lineHeight: 1 }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.4)" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              )}
            </div>

            {/* Dropdown results */}
            {hoodOpen && hoodResults.length > 0 && (
              <div style={{
                position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0,
                background: "rgba(255,252,248,0.98)", borderRadius: 14,
                boxShadow: "0 8px 30px rgba(0,0,0,0.14)",
                border: "1.5px solid rgba(255,31,125,0.12)",
                overflow: "hidden", zIndex: 100,
              }}>
                {hoodResults.map(h => (
                  <button key={h.slug} onMouseDown={() => { setHoodQuery(h.name); setHoodOpen(false); }} style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    width: "100%", padding: "9px 12px", border: "none", background: "transparent",
                    cursor: "pointer", textAlign: "left" as const,
                  }}>
                    <span style={{ fontFamily: "var(--font-jost)", fontSize: "12px", fontWeight: 700, color: DARK }}>{h.name}</span>
                    <span style={{ fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 600, color: "rgba(0,0,0,0.3)", letterSpacing: "0.05em" }}>{h.borough.toUpperCase()}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Content */}
      <div className="md:pt-0" style={{ paddingTop: "calc(54px + env(safe-area-inset-top, 0px))" }}>
        {mode === "guide" && <CityGuide />}
        {mode === "map"   && <CityMapView />}
      </div>
    </div>
  );
}

// ── Map view placeholder (real map integration TBD) ──────────────────────────
function CityMapView() {
  return (
    <div style={{ minHeight: "calc(100vh - 54px)", background: "#F0EBE4", paddingBottom: 110 }}>
      {/* Neighborhood search on map page */}
      <div style={{
        padding: "16px 16px 0",
        background: "linear-gradient(160deg, #FF1F7D 0%, #E8006A 100%)",
        paddingBottom: 20,
      }}>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, letterSpacing: "0.22em", color: "rgba(255,255,255,0.6)", marginBottom: 10 }}>SEARCH NYC</p>
        <NeighborhoodSearch />
      </div>

      {/* Quick neighborhood chips */}
      <div style={{ padding: "16px 16px 0" }}>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, letterSpacing: "0.18em", color: "rgba(0,0,0,0.3)", marginBottom: 10 }}>POPULAR</p>
        <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 8 }}>
          {["West Village","Williamsburg","SoHo","Harlem","DUMBO","Nolita","Crown Heights","Bushwick"].map(n => (
            <Link key={n} href={`/member/city/neighborhoods/${n.toLowerCase().replace(/ /g,"-")}`} style={{ textDecoration: "none" }}>
              <div style={{
                background: "white", borderRadius: 999,
                padding: "8px 14px",
                border: `1.5px solid rgba(255,31,125,0.15)`,
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              }}>
                <span style={{ fontFamily: "var(--font-jost)", fontSize: "11px", fontWeight: 700, color: DARK }}>{n}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Map placeholder */}
      <div style={{ margin: "20px 16px 0", borderRadius: 20, overflow: "hidden", border: "1.5px solid rgba(0,0,0,0.08)", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
        <div style={{ background: "#D6E8F5", height: 320, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={PINK} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
          <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 18, color: "#666" }}>Map launching in New York City</p>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "10px", color: "rgba(0,0,0,0.35)", letterSpacing: "0.04em" }}>Use search above to explore neighborhoods</p>
        </div>
      </div>
    </div>
  );
}
