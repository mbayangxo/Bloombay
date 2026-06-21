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
  pageBg: "#FFF8F0",
  card: "#FFFFFF",
  cardElevated: "#FEFCF7",
  textPrimary: "#111111",
  textSecondary: "rgba(0,0,0,0.55)",
  textMuted: "rgba(0,0,0,0.35)",
  pink: "#FF1F7D",
  babyPink: "#FFB3D1",
  border: "rgba(255,31,125,0.12)",
  borderStrong: "rgba(255,31,125,0.3)",
  isNight: false,
};

const NIGHT: ThemePalette = {
  pageBg: "#0E0906",
  card: "#1B1108",
  cardElevated: "#221508",
  textPrimary: "rgba(255,240,218,0.95)",
  textSecondary: "rgba(255,200,180,0.7)",
  textMuted: "rgba(255,220,200,0.38)",
  pink: "#FF4D94",
  babyPink: "#FFB3D1",
  border: "rgba(255,77,148,0.2)",
  borderStrong: "rgba(255,77,148,0.4)",
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
