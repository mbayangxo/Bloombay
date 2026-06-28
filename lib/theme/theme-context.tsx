"use client";
import { createContext, useContext, useEffect, useState } from "react";

export type ThemeMode = "day" | "night";

export interface ThemePalette {
  pageBg: string;
  card: string;
  cardElevated: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  pink: string;
  babyPink: string;
  border: string;
  borderStrong: string;
  isNight: boolean;
}

const DAY: ThemePalette = {
  pageBg:        "#FFFFFF",                   // white — every page (black/white/hot-pink/baby-pink)
  card:          "#FFFFFF",                   // white cards
  cardElevated:  "#FFF5F8",
  textPrimary:   "#1C1B1C",
  textSecondary: "rgba(28,27,28,0.65)",
  textMuted:     "rgba(28,27,28,0.40)",
  pink:          "#FF1F7D",
  babyPink:      "#FF69B4",
  border:        "rgba(255,31,125,0.12)",
  borderStrong:  "rgba(255,31,125,0.30)",
  isNight:       false,
};

const NIGHT: ThemePalette = {
  pageBg:        "#1A0414",                   // deep dark rose — same DNA, just dark
  card:          "#260A1C",
  cardElevated:  "#320C24",
  textPrimary:   "rgba(255,235,245,0.95)",
  textSecondary: "rgba(255,200,230,0.70)",
  textMuted:     "rgba(255,180,215,0.42)",
  pink:          "#FF1F7D",                   // same hot pink — glows on dark
  babyPink:      "#FF69B4",
  border:        "rgba(255,31,125,0.20)",
  borderStrong:  "rgba(255,31,125,0.45)",
  isNight:       true,
};

interface ThemeContextValue {
  mode: ThemeMode;
  palette: ThemePalette;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  mode: "day",
  palette: DAY,
  toggle: () => {},
});

function autoMode(): ThemeMode {
  const h = new Date().getHours();
  return h >= 19 || h < 6 ? "night" : "day";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>("day");

  useEffect(() => {
    const saved = localStorage.getItem("bb-theme") as ThemeMode | null;
    const initial: ThemeMode = saved ?? autoMode();
    setMode(initial);
    document.documentElement.setAttribute("data-theme", initial);

    // Re-check every minute; only auto-switch if user hasn't manually overridden
    const id = setInterval(() => {
      if (localStorage.getItem("bb-theme-manual")) return;
      const next = autoMode();
      setMode(prev => {
        if (prev === next) return prev;
        document.documentElement.setAttribute("data-theme", next);
        return next;
      });
    }, 60_000);
    return () => clearInterval(id);
  }, []);

  function toggle() {
    setMode(prev => {
      const next = prev === "day" ? "night" : "day";
      localStorage.setItem("bb-theme", next);
      localStorage.setItem("bb-theme-manual", "1");
      document.documentElement.setAttribute("data-theme", next);
      return next;
    });
  }

  return (
    <ThemeContext.Provider value={{ mode, palette: mode === "night" ? NIGHT : DAY, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
