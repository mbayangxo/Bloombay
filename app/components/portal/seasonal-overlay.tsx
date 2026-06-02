"use client";

import { useMemo, useEffect, useState } from "react";

type Holiday =
  | "valentines"
  | "christmas"
  | "newyear"
  | "thanksgiving"
  | "halloween"
  | "independence";

function getNthWeekday(year: number, month: number, weekday: number, n: number): number {
  const d = new Date(year, month - 1, 1);
  const first = d.getDay();
  const offset = (weekday - first + 7) % 7;
  return 1 + offset + (n - 1) * 7;
}

function detectHoliday(): Holiday | null {
  const now = new Date();
  const m = now.getMonth() + 1;
  const d = now.getDate();
  const y = now.getFullYear();

  // Valentine's Day  Feb 13–15
  if (m === 2 && d >= 13 && d <= 15) return "valentines";
  // Christmas        Dec 24–26
  if (m === 12 && d >= 24 && d <= 26) return "christmas";
  // New Year's       Dec 31 – Jan 2
  if ((m === 12 && d === 31) || (m === 1 && d <= 2)) return "newyear";
  // Halloween        Oct 29–31
  if (m === 10 && d >= 29) return "halloween";
  // Thanksgiving (US, 4th Thursday of November)
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  if (tz.startsWith("America/") && m === 11) {
    const thu = getNthWeekday(y, 11, 4, 4);
    if (d >= thu - 1 && d <= thu + 1) return "thanksgiving";
  }
  // US Independence Day Jul 3–5
  if (tz.startsWith("America/") && m === 7 && d >= 3 && d <= 5) return "independence";

  return null;
}

interface Particle {
  id: number;
  x: number;
  size: number;
  duration: number;
  delay: number;
  color: string;
  bottom?: boolean;
}

function makeParticles(count: number, colors: string[], fromBottom = false): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    size: 8 + Math.random() * 12,
    duration: 4 + Math.random() * 6,
    delay: Math.random() * 8,
    color: colors[Math.floor(Math.random() * colors.length)],
    bottom: fromBottom,
  }));
}

function SnowLayer({ particles }: { particles: Particle[] }) {
  return (
    <>
      {particles.map((p) => (
        <div
          key={p.id}
          style={{
            position: "fixed",
            left: `${p.x}%`,
            top: "-20px",
            width: `${p.size}px`,
            height: `${p.size}px`,
            color: p.color,
            fontSize: `${p.size}px`,
            lineHeight: 1,
            animation: `snowfall ${p.duration}s ${p.delay}s infinite linear`,
            pointerEvents: "none",
            zIndex: 9999,
            userSelect: "none",
          }}
        >
          ❄
        </div>
      ))}
    </>
  );
}

function HeartsLayer({ particles }: { particles: Particle[] }) {
  return (
    <>
      {particles.map((p) => (
        <div
          key={p.id}
          style={{
            position: "fixed",
            left: `${p.x}%`,
            bottom: "10%",
            width: `${p.size}px`,
            height: `${p.size}px`,
            color: p.color,
            fontSize: `${p.size}px`,
            lineHeight: 1,
            animation: `heartFloat ${p.duration}s ${p.delay}s infinite ease-out`,
            pointerEvents: "none",
            zIndex: 9999,
            userSelect: "none",
          }}
        >
          ♥
        </div>
      ))}
    </>
  );
}

function LeafLayer({ particles }: { particles: Particle[] }) {
  return (
    <>
      {particles.map((p) => (
        <div
          key={p.id}
          style={{
            position: "fixed",
            left: `${p.x}%`,
            top: "-20px",
            width: `${p.size}px`,
            height: `${p.size}px`,
            color: p.color,
            fontSize: `${p.size}px`,
            lineHeight: 1,
            animation: `leafFall ${p.duration}s ${p.delay}s infinite linear`,
            pointerEvents: "none",
            zIndex: 9999,
            userSelect: "none",
          }}
        >
          🌸
        </div>
      ))}
    </>
  );
}

function ConfettiLayer({ particles }: { particles: Particle[] }) {
  const shapes = ["✦", "★", "◆", "●"];
  return (
    <>
      {particles.map((p, i) => (
        <div
          key={p.id}
          style={{
            position: "fixed",
            left: `${p.x}%`,
            top: "-10px",
            color: p.color,
            fontSize: `${p.size * 0.7}px`,
            lineHeight: 1,
            animation: `confettiFall ${p.duration}s ${p.delay}s infinite linear`,
            pointerEvents: "none",
            zIndex: 9999,
            userSelect: "none",
          }}
        >
          {shapes[i % shapes.length]}
        </div>
      ))}
    </>
  );
}

export function SeasonalOverlay() {
  const [holiday, setHoliday] = useState<Holiday | null>(null);

  useEffect(() => {
    setHoliday(detectHoliday());
  }, []);

  const particles = useMemo(() => {
    if (!holiday) return [];
    const pinkColors = ["#FF1F7D", "#FF69B4", "#FFB6D0"];
    const snowColors = ["#ffffff", "#FFE0EE", "#FFB6D0"];
    const confettiColors = ["#FF1F7D", "#FF69B4", "#ffffff", "#111111"];

    switch (holiday) {
      case "valentines":   return makeParticles(18, pinkColors, true);
      case "christmas":    return makeParticles(22, snowColors);
      case "newyear":      return makeParticles(28, confettiColors);
      case "thanksgiving": return makeParticles(16, pinkColors);
      case "halloween":    return makeParticles(12, ["#FF1F7D", "#111111"]);
      case "independence": return makeParticles(20, ["#FF1F7D", "#FF69B4", "#ffffff"]);
      default:             return [];
    }
  }, [holiday]);

  if (!holiday) return null;

  switch (holiday) {
    case "valentines":   return <HeartsLayer particles={particles} />;
    case "christmas":    return <SnowLayer particles={particles} />;
    case "newyear":      return <ConfettiLayer particles={particles} />;
    case "thanksgiving": return <LeafLayer particles={particles} />;
    case "halloween":    return <SnowLayer particles={particles} />;
    case "independence": return <ConfettiLayer particles={particles} />;
    default:             return null;
  }
}
