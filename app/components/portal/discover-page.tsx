"use client";

import { useState } from "react";
import { HappeningsPage } from "./happenings-page";
import { CityPage } from "./city-page";

const PINK = "#FF1F7D";
type Tab = "happenings" | "city";

export function DiscoverPage() {
  const [tab, setTab] = useState<Tab>("happenings");

  return (
    <div style={{ background: "#FFF0F6", minHeight: "100vh", paddingBottom: 120 }}>

      {/* Sticky tab toggle — sits flush under the fixed top bar */}
      <div style={{
        position: "sticky",
        top: "calc(env(safe-area-inset-top, 0px) + 48px)",
        zIndex: 30,
        background: "rgba(255,240,246,0.95)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(26,26,26,0.08)",
        padding: "10px 20px",
        display: "flex",
        gap: 8,
      }}>
        {([
          { id: "happenings", label: "HAPPENINGS" },
          { id: "city",       label: "THE CITY"   },
        ] as const).map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              padding: "8px 20px",
              borderRadius: 999,
              border: "none",
              fontSize: "11px",
              fontWeight: 800,
              letterSpacing: "0.12em",
              cursor: "pointer",
              background: tab === t.id ? PINK : "rgba(26,26,26,0.06)",
              color: tab === t.id ? "white" : "rgba(26,26,26,0.45)",
              boxShadow: tab === t.id ? `0 4px 14px ${PINK}44` : "none",
              transition: "all 0.18s ease",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Content — render one at a time so each has its own scroll state */}
      {tab === "happenings" ? <HappeningsPage /> : <CityPage />}
    </div>
  );
}
