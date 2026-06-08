"use client";

import { useEffect, useState } from "react";
import { DISCOVERY_MOODS, type DiscoveryMoodId } from "@/lib/discovery-mood";
import { getDiscoveryMood, setDiscoveryMood } from "@/lib/discovery-mood-store";

export function MoodFilterBar({ onChange }: { onChange?: (mood: DiscoveryMoodId | null) => void }) {
  const [active, setActive] = useState<DiscoveryMoodId | null>(null);

  useEffect(() => {
    setActive(getDiscoveryMood());
  }, []);

  function select(id: DiscoveryMoodId) {
    const next = active === id ? null : id;
    setActive(next);
    void setDiscoveryMood(next).then(() => onChange?.(next)).catch((e) => {
      alert(e instanceof Error ? e.message : "Could not save mood");
      setActive(getDiscoveryMood());
    });
  }

  return (
    <div className="mp-mood-bar" role="group" aria-label="How do you feel right now?">
      <p className="mp-mood-bar__label">How do you feel?</p>
      <div className="mp-mood-bar__chips">
        {DISCOVERY_MOODS.map((m) => (
          <button
            key={m.id}
            type="button"
            className={`mp-mood-chip${active === m.id ? " mp-mood-chip--on" : ""}`}
            onClick={() => select(m.id)}
            aria-pressed={active === m.id}
          >
            <span aria-hidden>{m.emoji}</span>
            {m.label}
          </button>
        ))}
      </div>
    </div>
  );
}
