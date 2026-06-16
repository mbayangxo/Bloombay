"use client";

import { useState, useEffect } from "react";

export type TimeOfDay = "morning" | "afternoon" | "evening" | "night";

export function getTimeOfDay(h: number): TimeOfDay {
  if (h >= 5 && h < 12) return "morning";
  if (h >= 12 && h < 17) return "afternoon";
  if (h >= 17 && h < 21) return "evening";
  return "night";
}

export function getGreeting(tod: TimeOfDay): string {
  if (tod === "morning") return "Good morning";
  if (tod === "afternoon") return "Good afternoon";
  if (tod === "evening") return "Good evening";
  return "Good night";
}

const LIGHT_STYLE: React.CSSProperties = {
  "--pale-pink-bg": "#F6F1EB",
  "--light-pink": "#FFE0EE",
  "--heading-color": "#111111",
  "--text-color": "#333333",
  "--text-muted": "#888888",
  "--card-bg": "#FFFFFF",
  "--card-border": "rgba(0,0,0,0.06)",
  background: "#F6F1EB",
} as React.CSSProperties;

const TIME_STYLES: Record<TimeOfDay, React.CSSProperties> = {
  morning:   LIGHT_STYLE,
  afternoon: LIGHT_STYLE,
  evening:   LIGHT_STYLE,
  night:     LIGHT_STYLE,
};

export function TimeWrapper({ children }: { children: React.ReactNode }) {
  const [tod, setTod] = useState<TimeOfDay>("morning");

  useEffect(() => {
    setTod(getTimeOfDay(new Date().getHours()));
  }, []);

  return (
    <div
      className="min-h-screen"
      style={TIME_STYLES[tod]}
    >
      {children}
    </div>
  );
}
