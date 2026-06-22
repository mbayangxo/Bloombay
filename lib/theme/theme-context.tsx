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

// Both palettes use the unified dark colorway — consistent with all other pages
const DAY: ThemePalette = {
  pageBg: "#0C0818",
  card: "rgba(255,255,255,0.07)",
  cardElevated: "rgba(255,255,255,0.10)",
  textPrimary: "rgba(255,255,255,0.95)",
  textSecondary: "rgba(255,220,240,0.7)",
  textMuted: "rgba(255,200,225,0.42)",
  pink: "#FF1F7D",
  babyPink: "#FF80C0",
  border: "rgba(255,31,125,0.22)",
  borderStrong: "rgba(255,31,125,0.45)",
  isNight: false,
};

const NIGHT: ThemePalette = {
  pageBg: "#0C0818",
  card: "rgba(255,255,255,0.06)",
  cardElevated: "rgba(255,255,255,0.09)",
  textPrimary: "rgba(255,255,255,0.95)",
  textSecondary: "rgba(255,220,240,0.7)",
  textMuted: "rgba(255,200,225,0.38)",
  pink: "#FF1F7D",
  babyPink: "#FF80C0",
  border: "rgba(255,31,125,0.2)",
  borderStrong: "rgba(255,31,125,0.42)",
  isNight: true,
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
