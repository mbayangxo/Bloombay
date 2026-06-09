"use client";

import { useState } from "react";
import Link from "next/link";

const PINK  = "#FF1F7D";
const DARK  = "#1C1B1C";
const CREAM = "#F6F1EB";
const PAPER = "#FEFCF7";
const PAPER_TEX = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch' result='t'/%3E%3CfeColorMatrix type='saturate' values='0' in='t'/%3E%3C/filter%3E%3Crect width='200' height='200' fill='%23000' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E")`;

const FILTERS = ["Tonight", "1+", "Italian", "Cocktails", "Date Night", "Brunch", "Outdoor", "Sushi", "Wine Bars", "More"];

const FEATURED = [
  {
    id: 1,
    name: "Bar Pisellino",
    neighborhood: "SOHO",
    cuisine: "ITALIAN",
    badge: null,
    women: 18,
    note: "So early for a martini at the bar — Maya",
    bg: "#1a0a0e",
    photo: null,
    dark: true,
  },
  {
    id: 2,
    name: "Lola Taverna",
    neighborhood: "WEST VILLAGE",
    cuisine: "GREEK",
    badge: "TRENDING",
    women: 41,
    note: "Everything we ordered was perfect — Dani",
    bg: "#2d1a0e",
    photo: null,
    dark: true,
  },
  {
    id: 3,
    name: "Via Carota",
    neighborhood: "WEST VILLAGE",
    cuisine: "ITALIAN",
    badge: "RESERVED",
    women: 12,
    note: "Best cacio e pepe in the city — Ali",
    bg: PAPER,
    photo: null,
    dark: false,
    reservation: { time: "8:15PM", seats: "2 SEATS" },
  },
];

const GRID_SPOTS = [
  { id: 4, name: "Sant Ambroeus",    neighborhood: "SOHO",          saved: 12, bg: "#FAF0E8" },
  { id: 5, name: "Cecconni's",       neighborhood: "SOHO",          saved: 8,  bg: "#F0EAF8" },
  { id: 6, name: "Rubirosa",         neighborhood: "NOLITA",        saved: 12, bg: "#FFF5F8" },
  { id: 7, name: "Pasta Night",      neighborhood: "LES",           saved: 8,  bg: "#F5F0E8" },
  { id: 8, name: "The Four Horsemen",neighborhood: "WILLIAMSBURG",  saved: 11, bg: "#EAF0F8" },
  { id: 9, name: "Burette",          neighborhood: "WEST VILLAGE",  saved: 7,  bg: "#F8EAF0" },
];

const GO_TO_LIST = [
  "Bar Pisellino",
  "Sushi Noz",
  "Lola Taverna",
  "L'Artusi",
  "Café Kitsuné",
  "Burette",
];

const CRAVING = [
  "Spicy Rigatoni",
  "Truffle Pasta",
  "Dirty Martini",
  "Chocolate",
];

const SAVED_COLORS = ["#D4B5A0","#C4A0A8","#B8A8C0","#A8B8C0","#C0B8A0"];

export function CityPage() {
  const [activeFilter, setActiveFilter] = useState("Tonight");
  const [saved, setSaved] = useState<number[]>([]);

  function toggleSave(id: number) {
    setSaved(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  }

  return (
    <div style={{ backgroundImage: PAPER_TEX, backgroundColor: CREAM, backgroundSize: "200px 200px", minHeight: "100vh", paddingBottom: 120 }}>

      {/* ── COVER HEADER ── */}
      <div style={{ position: "relative", height: 220, background: "#0d0806", overflow: "hidden" }}>
        {/* Gradient layers simulating a moody restaurant photo */}
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 40% 30%, #3d1a0a 0%, #0d0806 70%)" }} />
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 80% 60%, #2a0d1a 0%, transparent 60%)" }} />
        {/* Bokeh dots */}
        {[[12, 30, 8], [70, 50, 12], [30, 70, 6], [85, 25, 10], [50, 80, 7]].map(([l, t, s], i) => (
          <div key={i} style={{ position: "absolute", left: `${l}%`, top: `${t}%`, width: s, height: s, borderRadius: "50%", background: "rgba(255,180,80,0.3)", filter: "blur(4px)" }} />
        ))}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0) 30%, rgba(0,0,0,0.75) 100%)" }} />
        {/* Handwritten note */}
        <div style={{ position: "absolute", top: 54, left: 20, transform: "rotate(-2deg)" }}>
          <div style={{ background: "rgba(255,255,230,0.9)", padding: "8px 12px", boxShadow: "0 2px 8px rgba(0,0,0,0.3)" }}>
            <p style={{ fontFamily: "var(--font-caveat)", fontSize: 11, color: "#333", lineHeight: 1.5 }}>
              The garden is<br />blooming<br />tonight ♡
            </p>
          </div>
        </div>
        {/* Tag card */}
        <div style={{ position: "absolute", top: 60, right: 20, transform: "rotate(2deg)", background: PAPER, padding: "6px 10px", boxShadow: "0 2px 8px rgba(0,0,0,0.2)" }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, color: PINK, letterSpacing: "0.1em" }}>WEST VILLAGE</p>
          <p style={{ fontFamily: "var(--font-caveat)", fontSize: 10, color: "#666" }}>room master</p>
        </div>
        {/* Bottom title */}
        <div style={{ position: "absolute", bottom: 16, left: 18 }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.22em", color: PINK, marginBottom: 4 }}>EATS · NYC</p>
          <p style={{ fontFamily: "var(--font-playfair)", fontSize: 26, fontWeight: 900, fontStyle: "italic", color: "white", lineHeight: 1 }}>
            Tonight&apos;s<br />Table
          </p>
        </div>
        {/* Icons */}
        <div style={{ position: "absolute", top: 52, right: 18, display: "flex", gap: 12, alignItems: "center" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.8" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.8" strokeLinecap="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
        </div>
      </div>

      {/* ── FILTER PILLS ── */}
      <div style={{ background: "#0d0806", paddingBottom: 14 }}>
        <div style={{ display: "flex", gap: 8, overflowX: "auto", padding: "10px 16px 0", scrollbarWidth: "none" as const }}>
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              style={{
                flexShrink: 0,
                padding: "7px 14px",
                borderRadius: 999,
                border: `1.5px solid ${activeFilter === f ? PINK : "rgba(255,255,255,0.15)"}`,
                background: activeFilter === f ? PINK : "transparent",
                color: activeFilter === f ? "white" : "rgba(255,255,255,0.55)",
                fontSize: "10px",
                fontFamily: "var(--font-jost)",
                fontWeight: 700,
                letterSpacing: "0.04em",
                cursor: "pointer",
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: "16px 16px 0" }}>

        {/* ── FEATURED THREE ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>

          {/* Bar Pisellino — left, tall */}
          <div style={{ gridRow: "span 2", position: "relative" }}>
            <div style={{ background: FEATURED[0].bg, borderRadius: 18, overflow: "hidden", height: "100%", minHeight: 240, position: "relative", boxShadow: "0 4px 20px rgba(0,0,0,0.22)" }}>
              <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 40% 30%, rgba(180,30,60,0.5) 0%, transparent 70%)" }} />
              {/* Neon-style name */}
              <div style={{ position: "absolute", top: 20, left: 14, right: 14 }}>
                <p style={{ fontFamily: "var(--font-playfair)", fontSize: 22, fontWeight: 900, fontStyle: "italic", color: "#ff9eb5", lineHeight: 1.1, textShadow: "0 0 20px rgba(255,31,125,0.6)" }}>
                  Bar<br />Pisellino
                </p>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 700, color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em", marginTop: 4 }}>
                  {FEATURED[0].neighborhood} · {FEATURED[0].cuisine}
                </p>
              </div>
              {/* Women chip */}
              <div style={{ position: "absolute", top: 14, right: 12, background: PINK, borderRadius: 999, padding: "3px 8px", display: "flex", alignItems: "center", gap: 3 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "white" }} />
                <span style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 700, color: "white" }}>{FEATURED[0].women} going</span>
              </div>
              {/* Note */}
              <div style={{ position: "absolute", bottom: 16, left: 14, right: 14 }}>
                <div style={{ transform: "rotate(-1deg)", background: "rgba(255,255,230,0.88)", padding: "8px 10px", boxShadow: "0 2px 6px rgba(0,0,0,0.2)" }}>
                  <p style={{ fontFamily: "var(--font-caveat)", fontSize: 11, color: "#444", lineHeight: 1.4 }}>
                    {FEATURED[0].note}
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={() => toggleSave(1)}
              style={{ position: "absolute", bottom: 68, right: 10, width: 28, height: 28, borderRadius: "50%", background: "rgba(0,0,0,0.5)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill={saved.includes(1) ? PINK : "none"} stroke={PINK} strokeWidth="2.5" strokeLinecap="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
            </button>
          </div>

          {/* Lola Taverna — top right */}
          <div style={{ position: "relative", background: FEATURED[1].bg, borderRadius: 18, overflow: "hidden", minHeight: 115, boxShadow: "0 4px 20px rgba(0,0,0,0.18)" }}>
            <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 60% 30%, rgba(100,50,20,0.6) 0%, transparent 70%)" }} />
            {FEATURED[1].badge && (
              <div style={{ position: "absolute", top: 10, left: 10, background: PINK, borderRadius: 999, padding: "2px 8px" }}>
                <span style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, color: "white", letterSpacing: "0.06em" }}>{FEATURED[1].badge}</span>
              </div>
            )}
            <div style={{ position: "absolute", bottom: 14, left: 12, right: 12 }}>
              <p style={{ fontFamily: "var(--font-playfair)", fontSize: 15, fontWeight: 900, fontStyle: "italic", color: "rgba(255,230,200,0.92)", lineHeight: 1.1 }}>{FEATURED[1].name}</p>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", color: "rgba(255,255,255,0.4)", letterSpacing: "0.08em", marginTop: 2 }}>{FEATURED[1].neighborhood} · {FEATURED[1].cuisine}</p>
              <div style={{ marginTop: 6, display: "inline-flex", alignItems: "center", gap: 3 }}>
                {[1,2,3].map(i => <div key={i} style={{ width: 14, height: 14, borderRadius: "50%", background: `hsl(${20+i*20},60%,60%)`, border: "1.5px solid rgba(255,255,255,0.5)", marginLeft: i > 1 ? -5 : 0 }} />)}
                <span style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 700, color: "rgba(255,255,255,0.6)", marginLeft: 3 }}>{FEATURED[1].women} going</span>
              </div>
            </div>
          </div>

          {/* Via Carota — bottom right */}
          <div style={{ position: "relative", backgroundImage: PAPER_TEX, backgroundColor: FEATURED[2].bg, backgroundSize: "200px 200px", borderRadius: 18, minHeight: 115, padding: "12px 12px 10px", boxShadow: "0 4px 16px rgba(0,0,0,0.08)", overflow: "hidden" }}>
            {FEATURED[2].badge && (
              <div style={{ display: "inline-flex", background: "#2d1a0a", borderRadius: 999, padding: "3px 9px", marginBottom: 6 }}>
                <span style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, color: "#d4a060", letterSpacing: "0.1em" }}>⚑ {FEATURED[2].badge}</span>
              </div>
            )}
            <p style={{ fontFamily: "var(--font-playfair)", fontSize: 14, fontWeight: 900, fontStyle: "italic", color: DARK, lineHeight: 1.1 }}>{FEATURED[2].name}</p>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", color: "#aaa", letterSpacing: "0.08em", marginTop: 2 }}>{FEATURED[2].neighborhood} · {FEATURED[2].cuisine}</p>
            {FEATURED[2].reservation && (
              <div style={{ marginTop: 8, background: "#1C1B1C", borderRadius: 8, padding: "6px 8px", display: "flex", flexDirection: "column", gap: 1 }}>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 800, color: "#d4a060" }}>{FEATURED[2].reservation.time}</p>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", color: "rgba(255,255,255,0.4)", letterSpacing: "0.08em" }}>{FEATURED[2].reservation.seats}</p>
              </div>
            )}
          </div>

        </div>

        {/* ── GRID OF SPOTS ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
          {GRID_SPOTS.map(spot => (
            <div key={spot.id} style={{ backgroundImage: PAPER_TEX, backgroundColor: spot.bg, backgroundSize: "200px 200px", borderRadius: 16, padding: "12px 12px 10px", boxShadow: "0 2px 10px rgba(0,0,0,0.07)", position: "relative" }}>
              <p style={{ fontFamily: "var(--font-playfair)", fontSize: 13, fontWeight: 700, fontStyle: "italic", color: DARK, lineHeight: 1.2, marginBottom: 4 }}>{spot.name}</p>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "7.5px", color: "#aaa", letterSpacing: "0.06em" }}>{spot.neighborhood}</p>
              <div style={{ marginTop: 8, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
                  <svg width="9" height="9" viewBox="0 0 24 24" fill={PINK} stroke="none"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                  <span style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 700, color: "#bbb" }}>{spot.saved} saved</span>
                </div>
                <button onClick={() => toggleSave(spot.id)} style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill={saved.includes(spot.id) ? PINK : "none"} stroke={PINK} strokeWidth="2.5"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* ── GO-TO LIST + GIRLS NIGHT POLAROID ── */}
        <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
          {/* List card */}
          <div style={{ flex: 1, backgroundImage: PAPER_TEX, backgroundColor: PAPER, backgroundSize: "200px 200px", borderRadius: 18, padding: "14px 14px 12px", boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}>
            {/* Tape */}
            <div style={{ marginBottom: 10, marginLeft: -4 }}>
              <div style={{ display: "inline-block", width: 36, height: 12, background: "linear-gradient(to bottom, rgba(255,148,172,0.38), rgba(255,148,172,0.72) 25%, rgba(255,255,255,0.55) 46%, rgba(255,255,255,0.55) 54%, rgba(255,148,172,0.72) 75%, rgba(255,148,172,0.38))", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", transform: "rotate(-2deg)" }} />
            </div>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.16em", color: PINK, marginBottom: 8 }}>GO-TO SPOTS LATELY</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {GO_TO_LIST.map((name, i) => (
                <div key={name} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 700, color: PINK, width: 12 }}>{i + 1}.</span>
                  <span style={{ fontFamily: "var(--font-instrument)", fontSize: 12, fontStyle: "italic", color: DARK }}>{name}</span>
                </div>
              ))}
            </div>
          </div>
          {/* Girls nights polaroid */}
          <div style={{ position: "relative", width: 110, flexShrink: 0 }}>
            <div style={{ position: "absolute", top: -6, left: "50%", transform: "translateX(-50%)", zIndex: 4 }}>
              <div style={{ width: 34, height: 12, background: "linear-gradient(to bottom, rgba(255,210,60,0.38), rgba(255,210,60,0.62) 25%, rgba(255,255,255,0.55) 46%, rgba(255,255,255,0.55) 54%, rgba(255,210,60,0.62) 75%, rgba(255,210,60,0.38))", boxShadow: "0 1px 3px rgba(0,0,0,0.11)", transform: "rotate(-2deg)" }} />
            </div>
            <div style={{ backgroundImage: PAPER_TEX, backgroundColor: PAPER, backgroundSize: "200px 200px", padding: "5px 5px 24px", boxShadow: "0 6px 22px rgba(0,0,0,0.16)", transform: "rotate(1.5deg)" }}>
              <div style={{ height: 120, background: "linear-gradient(145deg, #2d0d1a 0%, #1a0809 100%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <p style={{ fontFamily: "var(--font-playfair)", fontSize: 28, fontWeight: 900, fontStyle: "italic", color: "rgba(255,80,120,0.5)" }}>g</p>
              </div>
              <p style={{ fontFamily: "var(--font-caveat)", fontSize: 10, color: "#999", textAlign: "center", marginTop: 5, lineHeight: 1.3 }}>girls&apos;<br />nights</p>
            </div>
          </div>
        </div>

        {/* ── ROOFTOP SPOTLIGHT ── */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ background: "linear-gradient(145deg, #0d0d14 0%, #1a0d20 100%)", borderRadius: 22, padding: "22px 20px", position: "relative", overflow: "hidden", boxShadow: "0 8px 30px rgba(0,0,0,0.25)" }}>
            <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 80% 20%, rgba(255,31,125,0.25) 0%, transparent 55%)", pointerEvents: "none" }} />
            <div style={{ position: "absolute", top: 10, right: 16, background: PINK, borderRadius: 999, padding: "3px 10px" }}>
              <span style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, color: "white", letterSpacing: "0.06em" }}>ROOFTOP</span>
            </div>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.2em", color: "rgba(255,31,125,0.8)", marginBottom: 6, position: "relative" }}>TONIGHT&apos;S SPOT</p>
            <p style={{ fontFamily: "var(--font-playfair)", fontSize: 20, fontWeight: 900, fontStyle: "italic", color: "#F1DFDD", lineHeight: 1.15, marginBottom: 4, position: "relative" }}>
              The Roof<br />at PUBLIC Hotel
            </p>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", color: "rgba(255,255,255,0.35)", letterSpacing: "0.06em", marginBottom: 14, position: "relative" }}>LOWER EAST SIDE · ROOFTOP</p>
            <div style={{ display: "flex", alignItems: "center", gap: 8, position: "relative" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                {[1,2,3].map(i => <div key={i} style={{ width: 22, height: 22, borderRadius: "50%", background: `hsl(${330+i*15},50%,55%)`, border: "2px solid rgba(255,255,255,0.25)", marginLeft: i > 1 ? -8 : 0 }} />)}
              </div>
              <span style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 700, color: "rgba(255,255,255,0.45)" }}>18 women going</span>
              <div style={{ marginLeft: "auto", display: "inline-flex", background: PINK, borderRadius: 999, padding: "8px 16px", boxShadow: `0 4px 14px ${PINK}55` }}>
                <span style={{ fontFamily: "var(--font-jost)", fontSize: "10px", fontWeight: 800, color: "white" }}>I&apos;M IN →</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── WHAT WE'RE CRAVING + SAVED ── */}
        <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
          <div style={{ flex: 1, backgroundImage: PAPER_TEX, backgroundColor: PAPER, backgroundSize: "200px 200px", borderRadius: 18, padding: "14px 14px 12px", boxShadow: "0 4px 14px rgba(0,0,0,0.07)" }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.16em", color: PINK, marginBottom: 10 }}>WHAT WE&apos;RE CRAVING</p>
            {CRAVING.map(item => (
              <div key={item} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 7 }}>
                <span style={{ fontSize: 8 }}>◆</span>
                <span style={{ fontFamily: "var(--font-instrument)", fontSize: 12, fontStyle: "italic", color: DARK }}>{item}</span>
              </div>
            ))}
          </div>
          <div style={{ flex: 1, backgroundImage: PAPER_TEX, backgroundColor: PAPER, backgroundSize: "200px 200px", borderRadius: 18, padding: "14px 14px 12px", boxShadow: "0 4px 14px rgba(0,0,0,0.07)" }}>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 10 }}>
              <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.16em", color: PINK }}>SAVED BY YOU</p>
              <Link href="/member/city" style={{ fontFamily: "var(--font-jost)", fontSize: "8px", color: "#bbb", textDecoration: "none" }}>See all</Link>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 4 }}>
              {SAVED_COLORS.slice(0, 6).map((c, i) => (
                <div key={i} style={{ aspectRatio: "1", borderRadius: 8, background: c, opacity: 0.7 }} />
              ))}
            </div>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", color: "#bbb", marginTop: 6 }}>+12 more</p>
          </div>
        </div>

        {/* ── LAST MINUTE TABLES ── */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 10 }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, letterSpacing: "0.18em", color: PINK }}>LAST MINUTE TABLES</p>
            <Link href="/member/city" style={{ fontFamily: "var(--font-jost)", fontSize: "8px", color: "#bbb", textDecoration: "none" }}>See all</Link>
          </div>
          <div style={{ display: "flex", gap: 10, overflowX: "auto", scrollbarWidth: "none" as const }}>
            {[
              { name: "Lodi",       nb: "BY EATALY",  time: "6:00 PM",  seats: 2, bg: "#C4A0A8" },
              { name: "Don Angie",  nb: "W. VILLAGE", time: "7:30 PM",  seats: 2, bg: "#D4B5A0" },
              { name: "Laser Wolf", nb: "WILLIAMSBURG",time: "9:00 PM", seats: 3, bg: "#B8A8C0" },
            ].map((r, i) => (
              <div key={i} style={{ flexShrink: 0, width: 100, backgroundImage: PAPER_TEX, backgroundColor: PAPER, backgroundSize: "200px 200px", borderRadius: 14, overflow: "hidden", boxShadow: "0 3px 12px rgba(0,0,0,0.08)" }}>
                <div style={{ height: 48, background: r.bg, opacity: 0.6 }} />
                <div style={{ padding: "8px 8px 10px" }}>
                  <p style={{ fontFamily: "var(--font-playfair)", fontSize: 11, fontWeight: 700, fontStyle: "italic", color: DARK }}>{r.name}</p>
                  <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", color: "#aaa", marginTop: 2 }}>{r.nb}</p>
                  <div style={{ marginTop: 6, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 700, color: PINK }}>{r.time}</span>
                    <span style={{ fontFamily: "var(--font-jost)", fontSize: "7px", color: "#bbb" }}>{r.seats} seats</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
