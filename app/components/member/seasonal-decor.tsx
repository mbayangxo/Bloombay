"use client";

import { useMemo } from "react";
import { readYandeMemberState } from "@/lib/yande-member-state";

type HolidayKey =
  | "christmas"
  | "thanksgiving"
  | "diwali"
  | "bastille"
  | "summer"
  | "fall"
  | "winter"
  | "spring";

function holidaysForCountry(country: string, month: number, day: number): HolidayKey[] {
  const c = country.toLowerCase();
  const out: HolidayKey[] = [];
  if (month === 12 && day >= 1 && day <= 26) out.push("christmas");
  if (c.includes("united states") || c === "usa" || c === "us") {
    if (month === 11 && day >= 20 && day <= 28) out.push("thanksgiving");
  }
  if (c === "india" && month === 10) out.push("diwali");
  if (c === "france" && month === 7 && day === 14) out.push("bastille");
  if (month >= 6 && month <= 8) out.push("summer");
  if (month >= 9 && month <= 11 && !out.includes("christmas")) out.push("fall");
  if (month === 12 || month <= 2) out.push("winter");
  if (month >= 3 && month <= 5) out.push("spring");
  return out;
}

const EMOJI: Record<HolidayKey, string> = {
  christmas: "✦",
  thanksgiving: "🍂",
  diwali: "✨",
  bastille: "🇫🇷",
  summer: "☀️",
  fall: "🍁",
  winter: "❄️",
  spring: "🌸",
};

export function SeasonalDecor() {
  const floats = useMemo(() => {
    const now = new Date();
    const { city } = readYandeMemberState();
    const country =
      (typeof sessionStorage !== "undefined" && sessionStorage.getItem("gf_country")) ||
      "United States";
    const keys = holidaysForCountry(country, now.getMonth() + 1, now.getDate());
    return keys.slice(0, 3).map((k, i) => ({
      id: k,
      emoji: EMOJI[k],
      left: `${12 + i * 28}%`,
      delay: `${i * 0.8}s`,
      label: `${k} · ${city}`,
    }));
  }, []);

  if (floats.length === 0) return null;

  return (
    <div className="mp-seasonal-decor" aria-hidden>
      {floats.map((f) => (
        <span
          key={f.id}
          className="mp-seasonal-decor__float"
          style={{ left: f.left, animationDelay: f.delay }}
          title={f.label}
        >
          {f.emoji}
        </span>
      ))}
    </div>
  );
}
