"use client";

import { useState } from "react";

const PINK = "#FF1F7D";

const MAP_PINS = [
  { name: "DEVOCIÓN", left: "12%", top: "28%", color: "#E8C4A0" },
  { name: "DOMINO", left: "30%", top: "18%", color: "#A8C5DA" },
  { name: "MOGU", left: "52%", top: "35%", color: "#C8A8D8" },
  { name: "MAIL", left: "68%", top: "15%", color: "#F0C8A0" },
  { name: "REMIERE", left: "78%", top: "50%", color: "#A8D8C0" },
  { name: "SAUCED", left: "22%", top: "60%", color: "#F8A8B8" },
  { name: "A&F", left: "55%", top: "65%", color: "#C8D8A8" },
];

const CATEGORY_FILTERS = ["All", "Eat", "Café", "Bar", "Art", "Events", "Shop"];

const CURATIONS = [
  { username: "@tasha",      location: "chinatown & les",    city: "nyc", gradient: "linear-gradient(135deg,#2D1B69,#11998e)" },
  { username: "@amartini22", location: "west village",       city: "nyc", gradient: "linear-gradient(135deg,#c0392b,#f39c12)" },
  { username: "@celeste",    location: "brooklyn heights",   city: "nyc", gradient: "linear-gradient(135deg,#1a1a2e,#0f3460)" },
  { username: "@nova",       location: "soho & tribeca",     city: "nyc", gradient: "linear-gradient(135deg,#4a0e8f,#a855f7)" },
];

const CURATORS = [
  { username: "@tasha",      views: "92",  bg: "#2D1B69" },
  { username: "@amartini22", views: "147", bg: "#c0392b" },
  { username: "@celeste",    views: "38",  bg: "#1a1a2e" },
  { username: "@nova",       views: "215", bg: "#4a0e8f" },
  { username: "@mila",       views: "61",  bg: "#11998e" },
];

const LIST_PLACES = [
  { name: "Devoción",       category: "Café",   neighborhood: "Williamsburg", desc: "Best single-origin espresso in BK",  color: "#E8C4A0" },
  { name: "Mogu",           category: "Eat",    neighborhood: "East Village",  desc: "Izakaya vibes, late-night staple",   color: "#C8A8D8" },
  { name: "Sauced",         category: "Bar",    neighborhood: "Bushwick",      desc: "Natural wine, great music",          color: "#F8A8B8" },
  { name: "Remiere",        category: "Events", neighborhood: "LES",           desc: "Underground parties, invite only",   color: "#A8D8C0" },
  { name: "Artists & Flea", category: "Shop",   neighborhood: "Williamsburg",  desc: "Curated vintage + local designers",  color: "#C8D8A8" },
  { name: "Mail",           category: "Art",    neighborhood: "Greenpoint",    desc: "Gallery + studio. Rotating shows",   color: "#F0C8A0" },
];

function MapBackground() {
  return (
    <svg width="100%" height="100%" style={{ position: "absolute", top: 0, left: 0, display: "block" }} xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#1A1A1A" />
      {[30, 60, 90, 120, 150, 180, 210, 240].map((y) => <rect key={`h${y}`} x="0" y={y} width="100%" height="2" fill="#2A2A2A" />)}
      {[40, 80, 120, 160, 200, 240, 280, 320, 360].map((x) => <rect key={`v${x}`} x={x} y="0" width="2" height="100%" fill="#2A2A2A" />)}
      <line x1="0" y1="80" x2="200" y2="260" stroke="#2A2A2A" strokeWidth="2" />
      <line x1="100" y1="0" x2="400" y2="260" stroke="#2A2A2A" strokeWidth="2" />
      <rect x="0" y="85" width="100%" height="3" fill="#242424" />
      <rect x="160" y="0" width="3" height="100%" fill="#242424" />
      <rect x="320" y="0" width="3" height="100%" fill="#242424" />
    </svg>
  );
}

export function TheCity() {
  const [activeFilter, setActiveFilter]     = useState("All");
  const [viewMode, setViewMode]             = useState<"map" | "list">("map");
  const [showFilters, setShowFilters]       = useState(false);
  const [searchQuery, setSearchQuery]       = useState("");

  const filteredList = LIST_PLACES.filter(p =>
    (activeFilter === "All" || p.category === activeFilter) &&
    (searchQuery === "" || p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.neighborhood.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div style={{ background: "#F8F6F3", minHeight: "100vh", fontFamily: "var(--font-jost, sans-serif)", maxWidth: 480, margin: "0 auto", paddingBottom: 120 }}>

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div style={{ padding: "60px 18px 12px", background: "#F8F6F3" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
          <div>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: "9px", fontWeight: 900, letterSpacing: "0.22em", color: PINK, marginBottom: 4 }}>✦ THE CITY</p>
            <h1 style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontWeight: 300, fontSize: "clamp(30px,8vw,40px)", color: "#1A1A1A", lineHeight: 1, margin: 0, letterSpacing: "-0.02em" }}>
              Happenings.
            </h1>
          </div>
          {/* Top-right icons */}
          <div style={{ display: "flex", gap: 8, marginTop: 32 }}>
            {/* Notification bell */}
            <button aria-label="Notifications" style={{ width: 38, height: 38, borderRadius: "50%", background: "white", border: "1.5px solid rgba(0,0,0,0.08)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", flexShrink: 0 }}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
            </button>
            {/* Filter button */}
            <button
              onClick={() => setShowFilters(v => !v)}
              aria-label="Filters"
              aria-pressed={showFilters}
              style={{ width: 38, height: 38, borderRadius: "50%", background: showFilters ? PINK : "white", border: showFilters ? "none" : "1.5px solid rgba(0,0,0,0.08)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", flexShrink: 0, transition: "background 0.15s" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={showFilters ? "white" : "#1A1A1A"} strokeWidth="2" strokeLinecap="round">
                <line x1="4" y1="6" x2="20" y2="6" /><line x1="8" y1="12" x2="16" y2="12" /><line x1="11" y1="18" x2="13" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        {/* Search + MAP/LIST toggle row */}
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {/* Search */}
          <div style={{ flex: 1, display: "flex", alignItems: "center", background: "white", borderRadius: 999, border: "1.5px solid rgba(0,0,0,0.1)", padding: "10px 14px", gap: 8, boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2.2" strokeLinecap="round">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="search neighborhoods, places…"
              style={{ flex: 1, border: "none", outline: "none", fontFamily: "var(--font-jost)", fontSize: "13px", color: "#1A1A1A", background: "transparent" }}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} style={{ background: "none", border: "none", cursor: "pointer", color: "#AAA", fontSize: 16, lineHeight: 1, padding: 0 }}>×</button>
            )}
          </div>

          {/* MAP / LIST toggle */}
          <div style={{ display: "flex", background: "white", borderRadius: 999, border: "1.5px solid rgba(0,0,0,0.1)", overflow: "hidden", flexShrink: 0, boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}>
            <button
              onClick={() => setViewMode("map")}
              style={{ padding: "10px 14px", border: "none", background: viewMode === "map" ? "#1A1A1A" : "transparent", color: viewMode === "map" ? "white" : "#666", fontFamily: "var(--font-jost)", fontSize: "12px", fontWeight: 700, letterSpacing: "0.06em", cursor: "pointer", display: "flex", alignItems: "center", gap: 5, transition: "background 0.15s" }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><circle cx="12" cy="10" r="7" /><path d="M12 3v14M5 10h14" /></svg>
              MAP
            </button>
            <button
              onClick={() => setViewMode("list")}
              style={{ padding: "10px 14px", border: "none", background: viewMode === "list" ? PINK : "transparent", color: viewMode === "list" ? "white" : "#666", fontFamily: "var(--font-jost)", fontSize: "12px", fontWeight: 700, letterSpacing: "0.06em", cursor: "pointer", display: "flex", alignItems: "center", gap: 5, transition: "background 0.15s" }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></svg>
              LIST
            </button>
          </div>
        </div>

        {/* Collapsible filter chips */}
        {showFilters && (
          <div style={{ marginTop: 12, display: "flex", gap: 7, flexWrap: "wrap" as const, animation: "slideDown 0.18s ease" }}>
            {CATEGORY_FILTERS.map(f => {
              const active = f === activeFilter;
              return (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  style={{
                    padding: "8px 18px", borderRadius: 999,
                    background: active ? PINK : "white",
                    border: active ? "none" : "1.5px solid rgba(0,0,0,0.15)",
                    color: active ? "white" : "#1A1A1A",
                    fontFamily: "var(--font-jost)", fontSize: "13px", fontWeight: 700,
                    letterSpacing: "0.04em", cursor: "pointer",
                    boxShadow: active ? `0 2px 10px ${PINK}44` : "none",
                    transition: "all 0.12s",
                  }}
                >
                  {f}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* ── MAP VIEW ────────────────────────────────────────────────────── */}
      {viewMode === "map" && (
        <>
          <div style={{ position: "relative", height: 260, overflow: "hidden", margin: "0 18px", borderRadius: 16, boxShadow: "0 4px 20px rgba(0,0,0,0.18)" }}>
            <MapBackground />
            {MAP_PINS.map((pin) => (
              <div key={pin.name} style={{ position: "absolute", left: pin.left, top: pin.top, transform: "translate(-50%,-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, zIndex: 2 }}>
                <div style={{ width: 42, height: 42, borderRadius: "50%", background: pin.color, border: "2.5px solid white", boxShadow: "0 2px 10px rgba(0,0,0,0.55)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                  <span style={{ fontSize: 8, fontWeight: 800, color: "#1A1A1A", textAlign: "center" as const, lineHeight: 1.1, padding: "0 2px" }}>
                    {pin.name.slice(0, 3).toUpperCase()}
                  </span>
                </div>
                <span style={{ fontSize: 10, fontWeight: 800, color: "white", textAlign: "center" as const, lineHeight: 1.2, textShadow: "0 1px 4px rgba(0,0,0,0.9)", maxWidth: 60, letterSpacing: 0.2 }}>
                  {pin.name}
                </span>
              </div>
            ))}
            <div style={{ position: "absolute", bottom: 14, left: "50%", transform: "translateX(-50%)", zIndex: 4 }}>
              <button style={{ background: "white", border: "none", borderRadius: 999, padding: "9px 20px", display: "flex", alignItems: "center", gap: 6, cursor: "pointer", boxShadow: "0 2px 14px rgba(0,0,0,0.4)", fontFamily: "var(--font-jost)", fontSize: "13px", fontWeight: 700, color: "#111", letterSpacing: "0.04em" }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 7C1 4.24 3.24 2 6 2C7.38 2 8.63 2.56 9.54 3.46L11 5H8" stroke="#111" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M13 7C13 9.76 10.76 12 8 12C6.62 12 5.37 11.44 4.46 10.54L3 9H6" stroke="#111" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                search here
              </button>
            </div>
          </div>

          {/* Category pills — more prominent */}
          <div style={{ display: "flex", gap: 8, overflowX: "auto", scrollbarWidth: "none" as const, padding: "16px 18px" }}>
            {CATEGORY_FILTERS.map(f => {
              const active = f === activeFilter;
              return (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  style={{
                    flexShrink: 0, padding: "10px 20px", borderRadius: 999,
                    background: active ? "#1A1A1A" : "white",
                    border: active ? "none" : "2px solid rgba(0,0,0,0.18)",
                    color: active ? "white" : "#1A1A1A",
                    fontFamily: "var(--font-jost)", fontSize: "14px", fontWeight: 800,
                    letterSpacing: "0.04em", cursor: "pointer",
                    boxShadow: active ? "0 3px 12px rgba(0,0,0,0.3)" : "none",
                  }}
                >
                  {f}
                </button>
              );
            })}
          </div>
        </>
      )}

      {/* ── LIST VIEW ───────────────────────────────────────────────────── */}
      {viewMode === "list" && (
        <div style={{ padding: "0 18px", display: "flex", flexDirection: "column", gap: 10 }}>
          {/* Category pills in list view */}
          <div style={{ display: "flex", gap: 8, overflowX: "auto", scrollbarWidth: "none" as const, paddingBottom: 4 }}>
            {CATEGORY_FILTERS.map(f => {
              const active = f === activeFilter;
              return (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  style={{
                    flexShrink: 0, padding: "9px 18px", borderRadius: 999,
                    background: active ? PINK : "white",
                    border: active ? "none" : "2px solid rgba(0,0,0,0.14)",
                    color: active ? "white" : "#1A1A1A",
                    fontFamily: "var(--font-jost)", fontSize: "13px", fontWeight: 800,
                    letterSpacing: "0.04em", cursor: "pointer",
                    boxShadow: active ? `0 2px 10px ${PINK}44` : "none",
                  }}
                >
                  {f}
                </button>
              );
            })}
          </div>

          {filteredList.map(place => (
            <div key={place.name} style={{ background: "white", borderRadius: 16, padding: "14px 16px", display: "flex", alignItems: "center", gap: 14, boxShadow: "0 2px 10px rgba(0,0,0,0.07)", border: "1px solid rgba(0,0,0,0.06)", cursor: "pointer" }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: place.color, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontFamily: "var(--font-jost)", fontWeight: 900, fontSize: "11px", color: "#1A1A1A" }}>{place.name.slice(0, 2).toUpperCase()}</span>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontFamily: "var(--font-playfair)", fontWeight: 700, fontSize: "15px", color: "#1A1A1A", marginBottom: 2, lineHeight: 1.2 }}>{place.name}</p>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "11px", color: "#888", marginBottom: 4 }}>{place.neighborhood}</p>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "12px", color: "#555", lineHeight: 1.4 }}>{place.desc}</p>
              </div>
              <div style={{ flexShrink: 0 }}>
                <span style={{ background: activeFilter === "All" ? "#F0EBE4" : PINK + "18", color: activeFilter === "All" ? "#888" : PINK, fontFamily: "var(--font-jost)", fontSize: "10px", fontWeight: 800, letterSpacing: "0.08em", borderRadius: 999, padding: "4px 10px" }}>{place.category}</span>
              </div>
            </div>
          ))}

          {filteredList.length === 0 && (
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <p style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 18, color: "rgba(0,0,0,0.3)" }}>Nothing here yet.</p>
            </div>
          )}
        </div>
      )}

      {/* ── Curations ───────────────────────────────────────────────────── */}
      <div style={{ paddingTop: 24, paddingBottom: 8 }}>
        <div style={{ padding: "0 18px 12px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h2 style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 20, fontWeight: 700, color: "#111", margin: 0 }}>curations for you</h2>
          <button style={{ fontFamily: "var(--font-jost)", fontSize: "11px", fontWeight: 700, color: PINK, background: "none", border: "none", cursor: "pointer" }}>see all →</button>
        </div>
        <div style={{ display: "flex", gap: 10, overflowX: "auto", padding: "0 18px", scrollbarWidth: "none" as const }}>
          {CURATIONS.map((c) => (
            <div key={c.username} style={{ flexShrink: 0, width: 160, height: 110, borderRadius: 16, background: c.gradient, position: "relative", overflow: "hidden", cursor: "pointer" }}>
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(0,0,0,0.72) 0%,transparent 60%)", padding: "10px 12px", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
                <span style={{ color: "rgba(255,255,255,0.75)", fontSize: 10, fontFamily: "var(--font-jost)", fontWeight: 600 }}>{c.username}</span>
                <span style={{ color: "white", fontSize: 13, fontFamily: "var(--font-playfair)", fontWeight: 700, lineHeight: 1.2 }}>{c.location}</span>
                <span style={{ color: "rgba(255,255,255,0.65)", fontSize: 10, fontFamily: "var(--font-jost)", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" as const }}>{c.city}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Curators ────────────────────────────────────────────────────── */}
      <div style={{ paddingTop: 20, paddingBottom: 24 }}>
        <div style={{ padding: "0 18px 12px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h2 style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontSize: 20, fontWeight: 700, color: "#111", margin: 0 }}>curators for you</h2>
          <button style={{ fontFamily: "var(--font-jost)", fontSize: "11px", fontWeight: 700, color: PINK, background: "none", border: "none", cursor: "pointer" }}>see all →</button>
        </div>
        <div style={{ display: "flex", gap: 16, overflowX: "auto", padding: "0 18px", scrollbarWidth: "none" as const }}>
          {CURATORS.map((curator) => (
            <div key={curator.username} style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 7, cursor: "pointer" }}>
              <div style={{ width: 62, height: 62, borderRadius: "50%", background: curator.bg, border: `2.5px solid ${PINK}`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 2px 10px ${curator.bg}66` }}>
                <span style={{ fontSize: 20, color: "white", fontFamily: "var(--font-playfair)", fontStyle: "italic" }}>
                  {curator.username.slice(1, 2).toUpperCase()}
                </span>
              </div>
              <div style={{ textAlign: "center" as const }}>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "11px", fontWeight: 700, color: "#1A1A1A", margin: 0 }}>{curator.username}</p>
                <p style={{ fontFamily: "var(--font-jost)", fontSize: "10px", color: "#AAA", margin: 0, marginTop: 1 }}>{curator.views} saves</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
