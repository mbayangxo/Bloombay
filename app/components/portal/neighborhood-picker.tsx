"use client";

import { useState } from "react";
import { NYC_NEIGHBORHOODS, setMyNeighborhood } from "@/lib/city-neighborhoods";

const PINK = "#FF1F7D";

// Shared neighborhood picker — persisted across Eat/Go/Solo and Happenings'
// Nearby view so choosing it once ("choose your neighborhood in New York")
// sticks everywhere.
export function NeighborhoodPicker({ value, onChange, dark }: { value: string | null; onChange: (h: string | null) => void; dark?: boolean }) {
  const [open, setOpen] = useState(false);
  function pick(h: string | null) {
    onChange(h);
    setMyNeighborhood(h);
    setOpen(false);
  }
  return (
    <>
      <button onClick={() => setOpen(true)} style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        background: dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
        border: `1px solid ${dark ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.08)"}`,
        borderRadius: 999, padding: "6px 12px", cursor: "pointer",
      }}>
        <span style={{ fontSize: 11 }}>📍</span>
        <span style={{ fontFamily: "var(--font-jost)", fontSize: 10, fontWeight: 700, color: dark ? "white" : "#333" }}>{value ?? "Choose your neighborhood"}</span>
      </button>
      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 300, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(6px)" }} />
          <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 301, background: "white", borderRadius: "20px 20px 0 0", padding: "18px 20px 36px", maxHeight: "70vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 14 }}>
              <div style={{ width: 36, height: 4, borderRadius: 999, background: "rgba(0,0,0,0.12)" }} />
            </div>
            <p style={{ fontFamily: "var(--font-jost)", fontSize: 9, fontWeight: 800, letterSpacing: "0.14em", color: "#999", marginBottom: 12 }}>YOUR NEIGHBORHOOD</p>
            <button onClick={() => pick(null)} style={{ display: "block", width: "100%", textAlign: "left" as const, background: "none", border: "none", padding: "10px 0", borderBottom: "1px solid rgba(0,0,0,0.06)", cursor: "pointer", fontFamily: "var(--font-jost)", fontSize: 13, fontWeight: value === null ? 800 : 500, color: value === null ? PINK : "#333" }}>
              All of NYC
            </button>
            {NYC_NEIGHBORHOODS.map(h => (
              <button key={h} onClick={() => pick(h)} style={{ display: "block", width: "100%", textAlign: "left" as const, background: "none", border: "none", padding: "10px 0", borderBottom: "1px solid rgba(0,0,0,0.06)", cursor: "pointer", fontFamily: "var(--font-jost)", fontSize: 13, fontWeight: value === h ? 800 : 500, color: value === h ? PINK : "#333" }}>
                {h}
              </button>
            ))}
          </div>
        </>
      )}
    </>
  );
}
