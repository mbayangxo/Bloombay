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
  pageBg: "#0A0508",
  card: "#18080F",
  cardElevated: "#210D16",
  textPrimary: "rgba(255,235,215,0.95)",
  textSecondary: "rgba(255,179,209,0.7)",
  textMuted: "rgba(255,255,255,0.35)",
  pink: "#FF1F7D",
  babyPink: "#FFB3D1",
  border: "rgba(255,31,125,0.2)",
  borderStrong: "rgba(255,31,125,0.4)",
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

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>("day");

  useEffect(() => {
    const saved = localStorage.getItem("bb-theme") as ThemeMode | null;
    if (saved === "night") setMode("night");
  }, []);

  function toggle() {
    setMode(prev => {
      const next = prev === "day" ? "night" : "day";
      localStorage.setItem("bb-theme", next);
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
