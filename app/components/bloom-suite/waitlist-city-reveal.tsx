"use client";

import { useEffect, useState } from "react";
import {
  nycProgress,
  WAITLIST_CITY_STATS,
  type CityWaitlistStat,
} from "@/lib/waitlist-counter";

export function WaitlistProgressBar() {
  const { current, goal, pct } = nycProgress();
  return (
    <div className="bb-waitlist-meter" style={{ width: "100%", marginTop: 20 }}>
      <p className="bb-field__label" style={{ textAlign: "center" }}>
        New York City · {current.toLocaleString()} / {goal.toLocaleString()} women
      </p>
      <div
        style={{
          height: 8,
          borderRadius: 99,
          background: "rgba(255,0,85,0.12)",
          overflow: "hidden",
          marginTop: 8,
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            background: "linear-gradient(90deg, #ff0055, #ff69b4)",
            borderRadius: 99,
            transition: "width 0.6s ease",
          }}
        />
      </div>
      <p className="bb-field__hint" style={{ textAlign: "center", marginTop: 8 }}>
        {pct}% to our NYC launch bar
      </p>
    </div>
  );
}

export function WaitlistCityReveal() {
  const [cityStat, setCityStat] = useState<CityWaitlistStat | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("bb_waitlist_location");
      if (!raw) return;
      const { city, country } = JSON.parse(raw) as { city: string; country: string };
      const match =
        WAITLIST_CITY_STATS.find(
          (c) =>
            c.city.toLowerCase() === city.toLowerCase() &&
            c.country.toLowerCase() === country.toLowerCase()
        ) ?? {
          city,
          country,
          count: Math.floor(80 + Math.random() * 120),
        };
      setCityStat(match);
    } catch {
      /* ignore */
    }
  }, []);

  if (!cityStat) return null;

  return (
    <div
      className="bb-waitlist-city-reveal"
      style={{
        marginTop: 24,
        padding: "16px 20px",
        borderRadius: 12,
        background: "rgba(255,0,85,0.06)",
        border: "1px solid rgba(255,0,85,0.15)",
      }}
    >
      <p className="bb-field__label">Your city</p>
      <p style={{ fontSize: 18, fontWeight: 600, margin: "4px 0" }}>
        {cityStat.city}, {cityStat.country}
      </p>
      <p className="bb-field__hint">
        {(cityStat.count + 1).toLocaleString()} women on the waitlist here — we&apos;ll email & text
        you when your invite is ready.
      </p>
      <a href="/invite" style={{ fontSize: 14, color: "#ff0055", fontWeight: 600 }}>
        Preview invite landing →
      </a>
    </div>
  );
}
