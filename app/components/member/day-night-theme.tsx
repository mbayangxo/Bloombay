"use client";

import { useEffect } from "react";
import { getDayPhase } from "@/lib/time-of-day";
import {
  readThemePreference,
  shouldUseNightPalette,
  syncThemePreferenceFromServer,
} from "@/lib/member-theme-preference";

export function DayNightTheme() {
  useEffect(() => {
    function apply() {
      const phase = getDayPhase();
      const night = shouldUseNightPalette();
      const roots = document.querySelectorAll(".mp-member-root, .mp-app");
      roots.forEach((root) => {
        root.setAttribute("data-bb-phase", phase);
        if (night) root.setAttribute("data-mp-theme", "night");
        else root.removeAttribute("data-mp-theme");
      });
    }
    apply();
    void syncThemePreferenceFromServer().then(apply);
    const onPref = () => apply();
    window.addEventListener("bb-theme-preference-updated", onPref);
    const t = setInterval(apply, 60_000);
    return () => {
      clearInterval(t);
      window.removeEventListener("bb-theme-preference-updated", onPref);
    };
  }, []);

  useEffect(() => {
    readThemePreference();
  }, []);

  return null;
}
