"use client";

import { useEffect, useState } from "react";
import {
  persistThemePreference,
  readThemePreference,
  syncThemePreferenceFromServer,
  type ThemePreference,
} from "@/lib/member-theme-preference";

const OPTIONS: { id: ThemePreference; label: string; sub: string }[] = [
  { id: "auto", label: "Auto", sub: "Bright by day · soft velvet after 8pm" },
  { id: "day", label: "Day", sub: "Always bright — best if text looked washed out" },
  { id: "night", label: "Night", sub: "Deep velvet everywhere" },
];

export function SettingsAppearance() {
  const [pref, setPref] = useState<ThemePreference>("auto");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setPref(readThemePreference());
    void syncThemePreferenceFromServer();
    const onUpdate = () => setPref(readThemePreference());
    window.addEventListener("bb-theme-preference-updated", onUpdate);
    return () => window.removeEventListener("bb-theme-preference-updated", onUpdate);
  }, []);

  async function choose(next: ThemePreference) {
    setPref(next);
    await persistThemePreference(next);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="mp-settings-appearance">
      <p className="mp-settings-appearance__title">Appearance</p>
      <p className="mp-settings-appearance__sub">Same BloomBay pink — darker at night for your eyes.</p>
      <div className="mp-settings-appearance__options" role="radiogroup" aria-label="Theme">
        {OPTIONS.map((o) => (
          <button
            key={o.id}
            type="button"
            role="radio"
            aria-checked={pref === o.id}
            className={`mp-settings-appearance__opt${pref === o.id ? " mp-settings-appearance__opt--on" : ""}`}
            onClick={() => void choose(o.id)}
          >
            <span className="mp-settings-appearance__opt-label">{o.label}</span>
            <span className="mp-settings-appearance__opt-sub">{o.sub}</span>
          </button>
        ))}
      </div>
      {saved ? <p className="mp-settings-appearance__saved">Saved</p> : null}
    </div>
  );
}
