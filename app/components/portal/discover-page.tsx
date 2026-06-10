"use client";

import { useState } from "react";
import { HappeningsPage } from "./happenings-page";
import { CityPage } from "./city-page";

const PINK = "#FF1F7D";
type Tab = "happenings" | "city";

export function DiscoverPage() {
  const [tab, setTab] = useState<Tab>("happenings");

  return (
    <div style={{ background: "linear-gradient(160deg, #FFF0F8 0%, #FFE8F4 30%, #FFF5F0 60%, #FFF0F8 100%)", minHeight: "100vh" }}>

      {/* Sticky tab toggle — sits flush under the fixed top bar */}
      <div style={{
        position: "sticky",
        top: "calc(env(safe-area-inset-top, 0px) + 48px)",
        zIndex: 30,
        background: "rgba(10,8,8,0.97)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
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
              background: tab === t.id ? PINK : "rgba(255,255,255,0.07)",
              color: tab === t.id ? "white" : "rgba(255,255,255,0.38)",
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
