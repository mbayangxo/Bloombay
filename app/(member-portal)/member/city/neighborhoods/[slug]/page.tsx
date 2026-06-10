"use client";

import React, { useState } from "react";
import Link from "next/link";
import { use } from "react";

// ── Design tokens ──────────────────────────────────────────────────────────────
const PINK  = "#FF0090";
const GOLD  = "#D4A853";
const DARK  = "#1C1B1C";

const PAPER_TEX  = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch' result='t'/%3E%3CfeColorMatrix type='saturate' values='0' in='t'/%3E%3C/filter%3E%3Crect width='200' height='200' fill='%23000' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E")`;
const DARK_GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='160' height='160' fill='%23fff' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`;

// ── Neighborhood data ──────────────────────────────────────────────────────────
interface NeighborhoodData {
  name: string;
  borough: string;
  tagline: string;
  vibe: string[];
  bloomies: number;
  heroBg: string;
  heroAccent: string;
  eats: { name: string; type: string; note: string; saves: number; hot?: boolean }[];
  trending: { name: string; tag: string; detail: string; going: number }[];
  popular: { name: string; cat: string; saves: number; note: string; accent: string }[];
  hidden: { name: string; tip: string }[];
}

const NEIGHBORHOODS: Record<string, NeighborhoodData> = {
  "west-village": {
    name: "West Village",
    borough: "MANHATTAN",
    tagline: "Cobblestones, candlelight, and the best martini of your life.",
    vibe: ["Date Night", "Brunch", "Wine Bars", "Boutiques"],
    bloomies: 892,
    heroBg: "linear-gradient(155deg, #2A0818 0%, #3A1020 55%, #1A0810 100%)",
    heroAccent: "#D4A853",
    eats: [
      { name: "Bar Pisellino",    type: "COCKTAIL BAR",  note: "The negroni at the marble bar. Go at 6pm before the crowd.", saves: 412, hot: true },
      { name: "Via Carota",       type: "ITALIAN",        note: "Insalata verde. No reservations. Worth the wait.",           saves: 387 },
      { name: "Buvette",          type: "FRENCH BISTRO",  note: "Croque madame, 10am, window seat. Perfect.",                saves: 301 },
      { name: "L'Artusi",         type: "PASTA",          note: "Birthday dinner energy every single night.",                saves: 244 },
      { name: "Café Kitsuné",     type: "COFFEE",         note: "Matcha latte + journal. Their garden is everything.",       saves: 198 },
    ],
    trending: [
      { name: "Hotel Barrière Le Fouquet's", tag: "HOTEL BAR",  detail: "New and already the it spot for Sunday aperitivo",  going: 67 },
      { name: "Omar's La Ranita",            tag: "WINE BAR",   detail: "Natural wine, tiny tables, perfect strangers",       going: 48 },
      { name: "August",                      tag: "SEASONAL",   detail: "Their spring menu just dropped and it's stunning",   going: 34 },
    ],
    popular: [
      { name: "Bar Pisellino",  cat: "DRINKS",   saves: 412, note: "The martini. The marble bar. The people.",  accent: "#D4A070" },
      { name: "Via Carota",     cat: "DINING",   saves: 387, note: "No apps needed. Just go.",                  accent: "#E8B080" },
      { name: "Buvette",        cat: "BRUNCH",   saves: 301, note: "A little piece of Paris on Grove St.",      accent: "#C090D0" },
      { name: "Magnolia Bakery",cat: "DESSERT",  saves: 276, note: "Banana pudding. That's it.",                accent: "#F0C090" },
      { name: "Three Lives & Co",cat: "BOOKS",   saves: 234, note: "The best independent bookshop in NYC.",     accent: "#9080B0" },
    ],
    hidden: [
      { name: "The Waverly Inn",       tip: "Ring the bell. No sign outside. Ask for the back room." },
      { name: "Ty's Bar",              tip: "The oldest gay bar in NYC. Everyone's welcome. Cash only." },
      { name: "Bedford Cheese Shop",   tip: "Staff pick a cheese for you. Never wrong once." },
    ],
  },
  "soho": {
    name: "SoHo",
    borough: "MANHATTAN",
    tagline: "Cast iron, concept stores, and the city's best people-watching.",
    vibe: ["Shopping", "Galleries", "Brunch", "Fashion"],
    bloomies: 1204,
    heroBg: "linear-gradient(155deg, #080818 0%, #100820 55%, #06060E 100%)",
    heroAccent: "#6BB5F5",
    eats: [
      { name: "Sadelle's",          type: "BRUNCH",      note: "Tower of bagels. Reserve ahead. Worth every minute.", saves: 334, hot: true },
      { name: "La Mercerie",        type: "FRENCH CAFÉ",  note: "The most beautiful room in SoHo. Go for lunch.",     saves: 289 },
      { name: "Sant Ambroeus SoHo", type: "ITALIAN",      note: "Milanese in Manhattan. The espresso is perfect.",    saves: 251 },
      { name: "Balthazar",          type: "BRASSERIE",    note: "Classic. Brunch on Saturday. Steak frites.",          saves: 312 },
      { name: "Felix",              type: "WINE BAR",     note: "Outdoor tables on West Broadway. Très chic.",         saves: 167 },
    ],
    trending: [
      { name: "KITH Treats",       tag: "DESSERT POP-UP", detail: "Cereal milk soft serve. The line is worth it.", going: 89 },
      { name: "Miu Miu Café",      tag: "POP-UP CAFÉ",    detail: "Only here through the end of the season",        going: 143 },
      { name: "Zero Bond terrace", tag: "MEMBERS CLUB",   detail: "If you know, you know. Ask around.",              going: 31 },
    ],
    popular: [
      { name: "Balthazar",       cat: "DINING",   saves: 312, note: "NYC institution. Never gets old.",        accent: "#C4A070" },
      { name: "Sadelle's",       cat: "BRUNCH",   saves: 334, note: "The tower. Get the lox.",                 accent: "#E0A080" },
      { name: "Opening Ceremony",cat: "FASHION",  saves: 201, note: "Rotating designers. Always something new.", accent: "#9090D8" },
      { name: "Housing Works",   cat: "VINTAGE",  saves: 189, note: "Best thrift in NYC. Patient hunting.",     accent: "#A8C890" },
      { name: "McNally Jackson", cat: "BOOKS",    saves: 178, note: "Staff recs are always spot on.",           accent: "#D8C060" },
    ],
    hidden: [
      { name: "The Ear Inn",         tip: "Oldest bar in NYC (1817). Order the burger. Sit at the bar." },
      { name: "Vesuvio Playground",  tip: "Hidden pocket park off Prince St. Perfect reading spot." },
      { name: "Fanelli's Café",      tip: "Since 1847. Cash only. The cheeseburger is underrated." },
    ],
  },
  "williamsburg": {
    name: "Williamsburg",
    borough: "BROOKLYN",
    tagline: "Waterfront views, vintage finds, and brunch that goes until 5pm.",
    vibe: ["Brunch", "Vintage", "Live Music", "Rooftops"],
    bloomies: 743,
    heroBg: "linear-gradient(155deg, #0A1A10 0%, #142A18 55%, #081408 100%)",
    heroAccent: "#A8C97A",
    eats: [
      { name: "Lilia",           type: "PASTA",     note: "The mafaldini with pink peppercorns. Reserve weeks ahead.", saves: 445, hot: true },
      { name: "Marlow & Sons",   type: "OYSTER BAR", note: "Sunday afternoon oysters. The vibe is unmatched.",        saves: 278 },
      { name: "Bonnie's",        type: "CANTONESE",  note: "Fusion done right. Small plates, big flavor.",             saves: 231 },
      { name: "Peter Luger",     type: "STEAKHOUSE", note: "Cash only. Call ahead. Order the bacon.",                  saves: 356 },
      { name: "Diner",           type: "AMERICAN",   note: "No printed menu. Whatever's fresh. Always good.",          saves: 189 },
    ],
    trending: [
      { name: "TALEA Beer Co",         tag: "BREWERY",    detail: "Female-founded. Their pink lager is perfect.", going: 58 },
      { name: "Brooklyn Winery",       tag: "WINE TASTING", detail: "Tours on weekends, intimate and lovely",     going: 42 },
      { name: "Domino Park sunsets",   tag: "OUTDOOR",    detail: "The whole city shows up. Bring a blanket.",   going: 211 },
    ],
    popular: [
      { name: "Lilia",            cat: "DINING",    saves: 445, note: "Best pasta in New York. Full stop.",       accent: "#D4A070" },
      { name: "Smorgasburg",      cat: "FOOD MKTPLACE", saves: 389, note: "Saturdays at the waterfront. Go hungry.", accent: "#E8A080" },
      { name: "Artists & Fleas",  cat: "VINTAGE",   saves: 267, note: "Weekend market. Local designers only.",   accent: "#C0B090" },
      { name: "Domino Park",      cat: "OUTDOOR",   saves: 312, note: "East River views. Free, forever.",        accent: "#A8C890" },
      { name: "Rough Trade",      cat: "RECORDS",   saves: 198, note: "Best vinyl selection in Brooklyn.",       accent: "#9090B8" },
    ],
    hidden: [
      { name: "Maison Première",     tip: "Absinthe and oysters in a 1920s New Orleans bar. Unmissable." },
      { name: "Night of Joy",        tip: "Tiny dive bar. Best jukebox in Brooklyn. Go after 11pm." },
      { name: "Spritzenhaus",        tip: "Hidden beer garden. Huge space. Bring the whole group." },
    ],
  },
  "nolita": {
    name: "Nolita",
    borough: "MANHATTAN",
    tagline: "Four blocks. Infinite cool. The best neighborhood nobody can spell.",
    vibe: ["Boutiques", "Cafés", "Brunch", "Strolling"],
    bloomies: 567,
    heroBg: "linear-gradient(155deg, #1A0A08 0%, #2A1410 55%, #120806 100%)",
    heroAccent: "#FF9B70",
    eats: [
      { name: "Café Gitane",     type: "CAFÉ",        note: "Avocado toast before it was everywhere. The original.", saves: 312, hot: true },
      { name: "Lovely Day",      type: "THAI-FUSION",  note: "Bowl of Thai green curry on the way home. Always.",   saves: 234 },
      { name: "Rubirosa",        type: "PIZZA",        note: "Thin crust vodka pie. Arrive at 5:30 to skip the line.", saves: 289 },
      { name: "Spring Street Natural", type: "HEALTHY", note: "Since 1973. The grains bowl. Feel virtuous after.",  saves: 156 },
      { name: "Estela",          type: "WINE BAR",     note: "Small plates, natural wine, always someone interesting.", saves: 278 },
    ],
    trending: [
      { name: "Atla",          tag: "MEXICAN",       detail: "New Enrique Olvera spot. Bright, buzzy, delicious.", going: 72 },
      { name: "La Esquina",    tag: "TAQUERIA",      detail: "The basement brasserie. Ring the buzzer.",           going: 54 },
      { name: "Café Habana",   tag: "CUBAN",         detail: "The Mexican corn. Been here since always. Still #1.", going: 91 },
    ],
    popular: [
      { name: "Café Gitane",   cat: "CAFÉ",    saves: 312, note: "The definitive Nolita table.",        accent: "#E8A870" },
      { name: "Rubirosa",      cat: "PIZZA",   saves: 289, note: "Thin, crispy, perfect.",              accent: "#E08870" },
      { name: "Estela",        cat: "WINE",    saves: 278, note: "The burrata with salsa verde.",       accent: "#C0B090" },
      { name: "Warm",          cat: "FASHION", saves: 201, note: "NY-made clothes. Worth every penny.", accent: "#D0A0C0" },
      { name: "Bureau Again",  cat: "VINTAGE", saves: 178, note: "Curated consignment. Serious finds.", accent: "#A0B0C8" },
    ],
    hidden: [
      { name: "Puck Building courtyard", tip: "Hidden garden between Prince & Houston. Nobody knows it." },
      { name: "Fiore's",                 tip: "Old-school deli. No Yelp listing. The regulars hate that." },
      { name: "DeSalvio Playground",     tip: "Best espresso from the cart on Mulberry at 8am." },
    ],
  },
};

const DEFAULT_NEIGHBORHOOD: NeighborhoodData = {
  name: "Coming Soon",
  borough: "NYC",
  tagline: "We're curating this neighborhood now.",
  vibe: [],
  bloomies: 0,
  heroBg: "linear-gradient(155deg, #1A0018 0%, #2D0020 100%)",
  heroAccent: PINK,
  eats: [],
  trending: [],
  popular: [],
  hidden: [],
};

// ── Section header ─────────────────────────────────────────────────────────────
function SectionHeader({ label, sub, accent }: { label: string; sub?: string; accent: string }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <p style={{ fontFamily: "var(--font-jost)", fontSize: "11px", fontWeight: 900, letterSpacing: "0.18em", color: accent }}>{label}</p>
      {sub && <p style={{ fontFamily: "var(--font-caveat)", fontSize: 15, color: "rgba(255,255,255,0.38)", marginTop: 2 }}>{sub}</p>}
    </div>
  );
}

// ── Eat card ───────────────────────────────────────────────────────────────────
function EatCard({ eat, accent }: { eat: NeighborhoodData["eats"][0]; accent: string }) {
  const [saved, setSaved] = useState(false);
  return (
    <div style={{
      backgroundImage: DARK_GRAIN,
      backgroundSize: "160px 160px",
      backgroundColor: "#130810",
      borderRadius: 18,
      padding: "16px 16px 14px",
      marginBottom: 10,
      border: `1px solid rgba(255,255,255,0.06)`,
      boxShadow: "0 4px 20px rgba(0,0,0,0.35)",
      position: "relative",
    }}>
      {eat.hot && (
        <div style={{ position: "absolute", top: 14, right: 14, background: PINK, borderRadius: 999, padding: "2px 9px" }}>
          <span style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, color: "white", letterSpacing: "0.08em" }}>🔥 HOT</span>
        </div>
      )}
      <div style={{ display: "flex", gap: 5, alignItems: "center", marginBottom: 7 }}>
        <div style={{ background: `${accent}22`, border: `1px solid ${accent}44`, borderRadius: 999, padding: "2px 8px" }}>
          <span style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, color: accent, letterSpacing: "0.1em" }}>{eat.type}</span>
        </div>
      </div>
      <p style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontWeight: 300, fontSize: 20, color: "white", lineHeight: 1.1, marginBottom: 7 }}>{eat.name}</p>
      <p style={{ fontFamily: "var(--font-caveat)", fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 1.45, marginBottom: 10 }}>"{eat.note}"</p>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 700, color: "rgba(255,255,255,0.22)" }}>{eat.saves} saves</span>
        <button onClick={() => setSaved(s => !s)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill={saved ? GOLD : "none"} stroke={GOLD} strokeWidth="2.2">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

// ── Trending card ──────────────────────────────────────────────────────────────
function TrendingCard({ item, accent }: { item: NeighborhoodData["trending"][0]; accent: string }) {
  return (
    <div style={{
      flexShrink: 0, width: 200,
      backgroundImage: DARK_GRAIN,
      backgroundSize: "160px 160px",
      backgroundColor: "#0E080E",
      borderRadius: 18,
      padding: "16px 16px 14px",
      border: `1px solid ${accent}22`,
      boxShadow: `0 6px 24px rgba(0,0,0,0.4), 0 0 0 1px ${accent}11`,
    }}>
      <div style={{ background: `${accent}22`, border: `1px solid ${accent}55`, borderRadius: 999, padding: "3px 9px", display: "inline-flex", marginBottom: 10 }}>
        <span style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, color: accent, letterSpacing: "0.1em" }}>{item.tag}</span>
      </div>
      <p style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontWeight: 300, fontSize: 17, color: "white", lineHeight: 1.15, marginBottom: 8 }}>{item.name}</p>
      <p style={{ fontFamily: "var(--font-jost)", fontSize: "9px", color: "rgba(255,255,255,0.4)", lineHeight: 1.5, marginBottom: 12 }}>{item.detail}</p>
      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
        <div style={{ width: 6, height: 6, borderRadius: "50%", background: PINK, boxShadow: `0 0 0 2px rgba(255,0,144,0.22)` }} />
        <span style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 700, color: "rgba(255,255,255,0.35)" }}>{item.going} bloomies going</span>
      </div>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────────
export default function NeighborhoodPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const hood = NEIGHBORHOODS[slug] ?? { ...DEFAULT_NEIGHBORHOOD, name: slug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase()) };
  const [tab, setTab] = useState<"eats" | "trending" | "popular">("eats");

  return (
    <div style={{
      backgroundImage: DARK_GRAIN,
      backgroundSize: "160px 160px",
      backgroundColor: "#0A040E",
      minHeight: "100vh",
      paddingBottom: 120,
    }}>

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <div style={{ position: "relative", height: 290, overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: `${DARK_GRAIN}, ${hood.heroBg}`, backgroundSize: "160px 160px, 100% 100%" }} />
        {/* Glow */}
        <div style={{ position: "absolute", bottom: 0, left: "30%", width: 260, height: 260, borderRadius: "50%", background: `radial-gradient(circle, ${hood.heroAccent}22 0%, transparent 70%)`, filter: "blur(40px)" }} />
        {/* Overlay */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 30%, rgba(10,4,14,0.9) 100%)" }} />

        {/* Back button */}
        <Link href="/member/city" style={{ textDecoration: "none" }}>
          <div style={{
            position: "absolute", top: "calc(env(safe-area-inset-top, 0px) + 16px)", left: 16, zIndex: 20,
            background: "rgba(0,0,0,0.38)", backdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.14)", borderRadius: 999,
            padding: "6px 13px", display: "flex", alignItems: "center", gap: 6,
          }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
            <span style={{ fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 700, color: "white", letterSpacing: "0.07em" }}>CITY</span>
          </div>
        </Link>

        {/* Text */}
        <div style={{ position: "absolute", bottom: 24, left: 20, right: 20 }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, letterSpacing: "0.28em", color: hood.heroAccent, marginBottom: 6 }}>{hood.borough} · NEIGHBORHOOD</p>
          <p style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontWeight: 300, fontSize: 44, color: "white", lineHeight: 0.9, letterSpacing: "-0.02em", marginBottom: 10 }}>{hood.name}.</p>
          <p style={{ fontFamily: "var(--font-caveat)", fontSize: 15, color: "rgba(255,255,255,0.52)", lineHeight: 1.4, maxWidth: 280 }}>{hood.tagline}</p>
        </div>
      </div>

      {/* ── STATS BAR ────────────────────────────────────────────────────────── */}
      <div style={{
        backgroundImage: DARK_GRAIN,
        backgroundSize: "160px 160px",
        backgroundColor: "#120A14",
        padding: "14px 20px",
        display: "flex", alignItems: "center", gap: 0,
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}>
        <div style={{ flex: 1 }}>
          <p style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontWeight: 300, fontSize: 22, color: "white", lineHeight: 1 }}>{hood.bloomies.toLocaleString()}</p>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, letterSpacing: "0.12em", color: "rgba(255,255,255,0.3)", marginTop: 2 }}>BLOOMIES HERE</p>
        </div>
        <div style={{ width: 1, height: 32, background: "rgba(255,255,255,0.08)", margin: "0 16px" }} />
        <div style={{ flex: 2, display: "flex", gap: 6, flexWrap: "wrap" as const }}>
          {hood.vibe.map(v => (
            <div key={v} style={{ background: `${hood.heroAccent}18`, border: `1px solid ${hood.heroAccent}33`, borderRadius: 999, padding: "3px 10px" }}>
              <span style={{ fontFamily: "var(--font-jost)", fontSize: "7.5px", fontWeight: 700, color: hood.heroAccent, letterSpacing: "0.06em" }}>{v}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── TAB BAR ──────────────────────────────────────────────────────────── */}
      <div style={{ display: "flex", borderBottom: "1px solid rgba(255,255,255,0.07)", backgroundColor: "#0A040E" }}>
        {(["eats", "trending", "popular"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            flex: 1, padding: "13px 0", background: "none", border: "none", cursor: "pointer",
            borderBottom: `2px solid ${tab === t ? hood.heroAccent : "transparent"}`,
            transition: "border-color 0.2s",
          }}>
            <span style={{
              fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 800,
              letterSpacing: "0.12em", textTransform: "uppercase" as const,
              color: tab === t ? hood.heroAccent : "rgba(255,255,255,0.28)",
            }}>
              {t === "eats" ? "🍽 Eats" : t === "trending" ? "🔥 Trending" : "✦ Most Loved"}
            </span>
          </button>
        ))}
      </div>

      <div style={{ padding: "20px 16px 0" }}>

        {/* ── EATS TAB ───────────────────────────────────────────────────────── */}
        {tab === "eats" && (
          <>
            <SectionHeader label="BEST EATS" sub="Where the girls go" accent={hood.heroAccent} />
            {hood.eats.length > 0
              ? hood.eats.map((eat, i) => <EatCard key={i} eat={eat} accent={hood.heroAccent} />)
              : <p style={{ fontFamily: "var(--font-jost)", fontSize: "11px", color: "rgba(255,255,255,0.3)" }}>Coming soon.</p>
            }
          </>
        )}

        {/* ── TRENDING TAB ───────────────────────────────────────────────────── */}
        {tab === "trending" && (
          <>
            <SectionHeader label="TRENDING NOW" sub="This week's it spots" accent={hood.heroAccent} />
            <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 12, scrollbarWidth: "none" as const, marginBottom: 24 }}>
              {hood.trending.length > 0
                ? hood.trending.map((item, i) => <TrendingCard key={i} item={item} accent={hood.heroAccent} />)
                : <p style={{ fontFamily: "var(--font-jost)", fontSize: "11px", color: "rgba(255,255,255,0.3)" }}>Coming soon.</p>
              }
            </div>

            {/* Hidden gems */}
            {hood.hidden.length > 0 && (
              <>
                <SectionHeader label="HIDDEN GEMS" sub="Secrets worth knowing" accent="rgba(255,255,255,0.4)" />
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {hood.hidden.map((gem, i) => (
                    <div key={i} style={{
                      backgroundImage: PAPER_TEX,
                      backgroundSize: "200px 200px",
                      backgroundColor: "#FEF8F0",
                      borderRadius: 16,
                      padding: "14px 16px",
                      display: "flex", gap: 12, alignItems: "flex-start",
                    }}>
                      <div style={{ width: 28, height: 28, borderRadius: "50%", background: `${hood.heroAccent}22`, border: `1px solid ${hood.heroAccent}44`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <span style={{ fontSize: 13 }}>✦</span>
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontWeight: 300, fontSize: 15, color: DARK, lineHeight: 1.1, marginBottom: 5 }}>{gem.name}</p>
                        <p style={{ fontFamily: "var(--font-caveat)", fontSize: 13, color: "rgba(0,0,0,0.5)", lineHeight: 1.4 }}>{gem.tip}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}

        {/* ── MOST LOVED TAB ─────────────────────────────────────────────────── */}
        {tab === "popular" && (
          <>
            <SectionHeader label="MOST LOVED" sub="Saved by the most bloomies" accent={hood.heroAccent} />
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {hood.popular.length > 0
                ? hood.popular.map((pick, i) => (
                    <div key={i} style={{
                      backgroundImage: DARK_GRAIN,
                      backgroundSize: "160px 160px",
                      backgroundColor: "#120A14",
                      borderRadius: 18,
                      overflow: "hidden",
                      boxShadow: "0 4px 20px rgba(0,0,0,0.35)",
                    }}>
                      <div style={{ height: 2, background: `linear-gradient(90deg, transparent, ${pick.accent}88, transparent)` }} />
                      <div style={{ padding: "14px 16px", display: "flex", gap: 12, alignItems: "center" }}>
                        <div style={{ flexShrink: 0, width: 36, height: 36, borderRadius: "50%", background: `rgba(212,168,83,0.1)`, border: `1px solid ${pick.accent}55`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <span style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontSize: 16, color: pick.accent }}>{i + 1}</span>
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                            <div style={{ background: `${pick.accent}22`, border: `1px solid ${pick.accent}44`, borderRadius: 999, padding: "1.5px 7px" }}>
                              <span style={{ fontFamily: "var(--font-jost)", fontSize: "6.5px", fontWeight: 800, color: pick.accent, letterSpacing: "0.1em" }}>{pick.cat}</span>
                            </div>
                            <span style={{ fontFamily: "var(--font-jost)", fontSize: "7.5px", fontWeight: 700, color: "rgba(255,255,255,0.22)" }}>{pick.saves} saves</span>
                          </div>
                          <p style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontWeight: 300, fontSize: 17, color: "rgba(255,245,235,0.9)", lineHeight: 1.1, marginBottom: 4 }}>{pick.name}</p>
                          <p style={{ fontFamily: "var(--font-caveat)", fontSize: 12, color: `${pick.accent}bb`, lineHeight: 1.35 }}>"{pick.note}"</p>
                        </div>
                      </div>
                    </div>
                  ))
                : <p style={{ fontFamily: "var(--font-jost)", fontSize: "11px", color: "rgba(255,255,255,0.3)" }}>Coming soon.</p>
              }
            </div>
          </>
        )}
      </div>
    </div>
  );
}
