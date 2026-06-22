"use client";

import { useState, useEffect } from "react";
import { useTheme } from "@/lib/theme/theme-context";

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

export function TimeWrapper({ children }: { children: React.ReactNode }) {
  const { palette } = useTheme();
  const [tod, setTod] = useState<TimeOfDay>("morning");

  useEffect(() => {
    setTod(getTimeOfDay(new Date().getHours()));
  }, []);

  void tod;

  return (
    <div
      className="min-h-screen"
      style={{
        background: palette.pageBg,
        color: palette.textPrimary,
        transition: "background 0.6s ease, color 0.4s ease",
      }}
    >
      {children}
    </div>
  );
}
