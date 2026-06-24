"use client";

import { PINK } from "./shared";

const FILTER_CHIPS = ["Most Popular", "New", "Wellness", "Social", "Creative", "Foodie", "Active", "Fashion", "Faith"];

export function ClubsSearchFilter({
  searchQuery, setSearchQuery,
  showFilters, setShowFilters,
  activeFilter, setActiveFilter,
}: {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  showFilters: boolean;
  setShowFilters: (fn: (prev: boolean) => boolean) => void;
  activeFilter: string | null;
  setActiveFilter: (f: string | null) => void;
}) {
  return (
    <section style={{ padding: "0 18px 16px" }}>
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, padding: "10px 14px" }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.38)" strokeWidth="2.2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search clubs…"
            style={{ flex: 1, background: "none", border: "none", outline: "none", fontFamily: "var(--font-jost)", fontSize: 13, color: "white" }}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, color: "rgba(255,255,255,0.3)", fontSize: 14, lineHeight: 1 }}>✕</button>
          )}
        </div>
        <button onClick={() => setShowFilters(f => !f)} style={{
          width: 44, height: 44, borderRadius: 13, flexShrink: 0,
          background: showFilters ? PINK : "rgba(255,255,255,0.07)",
          border: `1px solid ${showFilters ? "transparent" : "rgba(255,255,255,0.1)"}`,
          display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
          boxShadow: showFilters ? `0 4px 16px ${PINK}55` : "none",
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round"><line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="12" y1="18" x2="12" y2="18"/></svg>
        </button>
      </div>

      {showFilters && (
        <div style={{ marginTop: 12, display: "flex", flexWrap: "wrap" as const, gap: 7 }}>
          {FILTER_CHIPS.map(f => (
            <button key={f} onClick={() => setActiveFilter(activeFilter === f ? null : f)} style={{
              padding: "6px 14px", borderRadius: 999,
              fontSize: 10, fontWeight: 700, cursor: "pointer", border: "1.5px solid",
              borderColor: activeFilter === f ? PINK : "rgba(255,255,255,0.2)",
              background: activeFilter === f ? PINK : "rgba(255,255,255,0.05)",
              color: "white", fontFamily: "var(--font-jost)",
            }}>
              {f}
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
