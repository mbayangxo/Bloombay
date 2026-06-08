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

const TIME_STYLES: Record<TimeOfDay, React.CSSProperties> = {
  morning: {
    "--pale-pink-bg": "#F6F1EB",
    "--light-pink": "#FFE0EE",
    "--heading-color": "#111111",
    "--text-color": "#333333",
    "--text-muted": "#888888",
    "--card-bg": "#FFFFFF",
    "--card-border": "rgba(0,0,0,0.06)",
    background: "#F6F1EB",
  } as React.CSSProperties,
  afternoon: {
    "--pale-pink-bg": "#F6F1EB",
    "--light-pink": "#FFD6E8",
    "--heading-color": "#111111",
    "--text-color": "#333333",
    "--text-muted": "#888888",
    "--card-bg": "#FFFFFF",
    "--card-border": "rgba(0,0,0,0.06)",
    background: "#F6F1EB",
  } as React.CSSProperties,
  evening: {
    "--pale-pink-bg": "#120D0A",
    "--light-pink": "#1E1612",
    "--heading-color": "rgba(255,238,220,0.95)",
    "--text-color": "rgba(255,238,220,0.78)",
    "--text-muted": "rgba(255,200,180,0.45)",
    "--card-bg": "#1E1612",
    "--card-border": "rgba(255,255,255,0.07)",
    background: "#120D0A",
  } as React.CSSProperties,
  night: {
    "--pale-pink-bg": "#0A0806",
    "--light-pink": "#15100C",
    "--heading-color": "rgba(255,238,220,0.92)",
    "--text-color": "rgba(255,238,220,0.72)",
    "--text-muted": "rgba(255,200,180,0.38)",
    "--card-bg": "#15100C",
    "--card-border": "rgba(255,255,255,0.06)",
    background: "#0A0806",
  } as React.CSSProperties,
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
