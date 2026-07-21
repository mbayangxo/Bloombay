"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const PINK  = "#FF1F7D";
const DARK  = "#0F0F1A";
const CREAM = "#FAF6F0";
const GOLD  = "#D4A853";
const GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='200' height='200' fill='%23000' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E")`;

type ColTheme = "all" | "love" | "city" | "work" | "body" | "friends" | "money" | "home";

const THEME_META: Record<ColTheme, { label: string; color: string }> = {
  all:     { label: "All",     color: DARK },
  love:    { label: "Love",    color: PINK },
  city:    { label: "City",    color: "#0F4C81" },
  work:    { label: "Work",    color: "#5B2D8E" },
  body:    { label: "Body",    color: "#C4005A" },
  friends: { label: "Friends", color: "#2E7D32" },
  money:   { label: "Money",   color: GOLD },
  home:    { label: "Home",    color: "#5D4037" },
};

interface Column {
  id: string;
  theme: ColTheme;
  title: string;
  opening: string;
  body: string;
  date: string;
  yande_note: string;
  cover_a: string;
  cover_b: string;
  featured?: boolean;
  blooms: number;
}

function FeaturedColumn({ col }: { col: Column }) {
  const meta = THEME_META[col.theme];
  const [expanded, setExpanded] = useState(false);
  return (
    <div style={{
      borderRadius: 22, overflow: "hidden",
      boxShadow: "0 12px 48px rgba(0,0,0,0.14), 0 3px 8px rgba(0,0,0,0.06)",
      background: CREAM, border: `1px solid ${GOLD}18`,
    }}>
      {/* Cover */}
      <div style={{
        height: 240,
        background: `linear-gradient(160deg, ${col.cover_a} 0%, ${col.cover_b} 100%)`,
        position: "relative", overflow: "hidden", display: "flex", alignItems: "flex-end",
      }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: GRAIN, backgroundSize: "200px 200px" }} />
        <div style={{ position: "absolute", top: 12, left: 12, background: PINK, borderRadius: 99, padding: "3px 10px" }}>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 900, color: "white", letterSpacing: "0.18em" }}>THIS WEEK'S COLUMN</p>
        </div>
        <div style={{ position: "absolute", top: 12, right: 14, fontFamily: "var(--font-caveat)", fontSize: 13, color: "rgba(255,255,255,0.4)" }}>Zuri ✦</div>
        <div style={{ position: "relative", zIndex: 1, padding: "0 20px 22px", background: "linear-gradient(to top, rgba(0,0,0,0.65), transparent)", paddingTop: 48, width: "100%" }}>
          <span style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, color: meta.color, background: `${meta.color}30`, borderRadius: 99, padding: "2px 8px", marginBottom: 10, display: "inline-block", backdropFilter: "blur(4px)" }}>{meta.label.toUpperCase()}</span>
          <h2 style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900, fontSize: 19, color: "white", lineHeight: 1.2, textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}>{col.title}</h2>
        </div>
      </div>

      {/* Yande intro */}
      <div style={{ padding: "14px 18px 10px", background: `${PINK}06`, borderBottom: `1px solid ${PINK}14` }}>
        <p style={{ fontFamily: "var(--font-caveat)", fontSize: 13, color: PINK, lineHeight: 1.5 }}>{col.yande_note} <span style={{ opacity: 0.6 }}>— Yande ✦</span></p>
      </div>

      {/* Column body */}
      <div style={{ padding: "16px 20px 20px" }}>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 700, color: "#aaa", letterSpacing: "0.15em", marginBottom: 12 }}>{col.date} · By Zuri</p>

        {/* First paragraph always visible */}
        <p style={{ fontFamily: "var(--font-caveat)", fontSize: 15, color: "rgba(0,0,0,0.75)", lineHeight: 1.7, marginBottom: 14, fontWeight: 500 }}>{col.opening}</p>

        {/* Rest of column — expandable */}
        {expanded && (
          <div>
            {col.body.split("\n\n").slice(1).map((para, i) => (
              <p key={i} style={{ fontFamily: "var(--font-caveat)", fontSize: 15, color: "rgba(0,0,0,0.68)", lineHeight: 1.7, marginBottom: 14 }}>{para}</p>
            ))}
          </div>
        )}

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 4 }}>
          <button onClick={() => setExpanded(e => !e)} style={{
            background: "none", border: `1.5px solid ${PINK}44`, borderRadius: 99, padding: "8px 18px",
            fontFamily: "var(--font-jost)", fontSize: 11, fontWeight: 700, color: PINK, cursor: "pointer",
          }}>{expanded ? "Read less" : "Read the full column →"}</button>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ fontSize: 13 }}>🌸</span>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 10, fontWeight: 700, color: PINK }}>{col.blooms}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ColumnCard({ col }: { col: Column }) {
  const meta = THEME_META[col.theme];
  const [expanded, setExpanded] = useState(false);
  return (
    <div style={{
      borderRadius: 18, overflow: "hidden",
      background: `${GRAIN}, ${CREAM}`, backgroundSize: "200px 200px, auto",
      boxShadow: "0 6px 24px rgba(0,0,0,0.08)", border: `1px solid ${GOLD}14`,
      display: "flex",
    }}>
      <div style={{ width: 5, flexShrink: 0, background: `linear-gradient(180deg, ${col.cover_a}, ${col.cover_b})` }} />
      <div style={{ flex: 1, padding: "14px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ fontFamily: "var(--font-jost)", fontSize: "7px", fontWeight: 800, color: meta.color, background: `${meta.color}12`, borderRadius: 99, padding: "2px 7px" }}>{meta.label.toUpperCase()}</span>
          <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", color: "#bbb" }}>{col.date}</p>
        </div>
        <h3 style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 700, fontSize: 15, color: DARK, lineHeight: 1.25, marginBottom: 8 }}>{col.title}</h3>
        <p style={{ fontFamily: "var(--font-caveat)", fontSize: 13, color: "rgba(0,0,0,0.6)", lineHeight: 1.55, marginBottom: 10 }}>{col.opening}</p>
        {expanded && col.body.split("\n\n").slice(1).map((para, i) => (
          <p key={i} style={{ fontFamily: "var(--font-caveat)", fontSize: 13, color: "rgba(0,0,0,0.6)", lineHeight: 1.55, marginBottom: 10 }}>{para}</p>
        ))}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <button onClick={() => setExpanded(e => !e)} style={{ background: "none", border: "none", padding: 0, fontFamily: "var(--font-jost)", fontSize: 10, fontWeight: 700, color: PINK, cursor: "pointer" }}>{expanded ? "Show less" : "Read more →"}</button>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ fontSize: 11 }}>🌸</span>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 700, color: PINK }}>{col.blooms}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ColumnPage() {
  const [activeTheme, setActiveTheme] = useState<ColTheme>("all");
  const [columns, setColumns] = useState<Column[]>([]);

  useEffect(() => {
    fetch("/api/avenue/column")
      .then(r => r.json())
      .then(d => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setColumns((d.content ?? []).map((row: any): Column => ({
          id: row.id,
          title: row.title ?? "",
          opening: row.meta?.opening ?? "",
          body: row.meta?.body_text ?? "",
          theme: (row.meta?.theme ?? "love") as ColTheme,
          date: "",
          yande_note: "",
          cover_a: PINK,
          cover_b: "#AD1457",
          featured: false,
          blooms: 0,
        })));
      })
      .catch(() => setColumns([]));
  }, []);

  const themes = Object.entries(THEME_META) as [ColTheme, { label: string; color: string }][];
  const filtered = activeTheme === "all" ? columns : columns.filter(c => c.theme === activeTheme);
  const [featured, ...rest] = filtered;

  return (
    <div style={{ background: `${GRAIN}, ${CREAM}`, backgroundSize: "200px 200px, auto", minHeight: "100vh", paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 120px)" }}>
      {/* Header */}
      <div style={{
        padding: "56px 22px 24px",
        background: `${GRAIN}, linear-gradient(150deg, #1C0A1A 0%, #2C0A3A 50%, #4A1442 100%)`,
        backgroundSize: "200px 200px, auto",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", top: -20, right: -20, width: 180, height: 180, borderRadius: "50%", background: `radial-gradient(circle, ${PINK}10, transparent)`, pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${PINK}44, transparent)` }} />
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <Link href="/member/avenue" style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.18)", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
          </Link>
          <div style={{ display: "inline-flex", background: "rgba(255,255,255,0.08)", borderRadius: 99, padding: "4px 12px", border: `1px solid ${PINK}30` }}>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "8px", fontWeight: 800, color: `${PINK}CC`, letterSpacing: "0.2em" }}>WEEKLY COLUMN</p>
          </div>
        </div>
        <p style={{ fontFamily: "var(--font-caveat)", fontSize: 16, color: "rgba(255,255,255,0.35)", marginBottom: 4 }}>I Couldn't Help But Wonder...</p>
        <h1 style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 900, fontSize: "clamp(32px, 11vw, 44px)", color: "white", lineHeight: 1, marginBottom: 8 }}>The Column.</h1>
        <p style={{ fontFamily: "var(--font-caveat)", fontSize: 14, color: "rgba(255,255,255,0.4)" }}>Zuri writes. Every Sunday. About all of it.</p>
      </div>

      {/* Theme filter */}
      <div style={{ position: "sticky", top: 0, zIndex: 20, background: "rgba(250,246,240,0.97)", backdropFilter: "blur(8px)", borderBottom: `2px solid ${PINK}16` }}>
        <div style={{ display: "flex", overflowX: "auto", scrollbarWidth: "none" as const, gap: 8, padding: "10px 18px" }}>
          {themes.map(([id, meta]) => (
            <button key={id} onClick={() => setActiveTheme(id)} style={{
              flexShrink: 0, padding: "6px 14px", borderRadius: 99,
              background: activeTheme === id ? meta.color : "white",
              border: `1.5px solid ${activeTheme === id ? meta.color : "rgba(0,0,0,0.08)"}`,
              color: activeTheme === id ? "white" : "#888",
              fontFamily: "var(--font-jost)", fontSize: 11, fontWeight: 700, cursor: "pointer",
            }}>{meta.label}</button>
          ))}
        </div>
      </div>

      <div style={{ padding: "18px 18px 0", display: "flex", flexDirection: "column", gap: 14 }}>
        {filtered.length === 0 && (
          <p style={{ textAlign: "center", color: "rgba(0,0,0,0.4)", fontFamily: "var(--font-caveat)", fontSize: 18, marginTop: 48 }}>
            Nothing published yet
          </p>
        )}
        {featured && <FeaturedColumn col={featured} />}
        {rest.map(col => <ColumnCard key={col.id} col={col} />)}
      </div>
    </div>
  );
}
