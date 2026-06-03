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
    "--pale-pink-bg": "#FFF5F8",
    "--light-pink": "#FFE0EE",
    background: "#FFF5F8",
  } as React.CSSProperties,
  afternoon: {
    "--pale-pink-bg": "#FFF0F5",
    "--light-pink": "#FFD6E8",
    background: "#FFF0F5",
  } as React.CSSProperties,
  evening: {
    "--pale-pink-bg": "#1B1624",
    "--light-pink": "#261E38",
    background: "#1B1624",
  } as React.CSSProperties,
  night: {
    "--pale-pink-bg": "#161122",
    "--light-pink": "#201830",
    background: "#161122",
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
