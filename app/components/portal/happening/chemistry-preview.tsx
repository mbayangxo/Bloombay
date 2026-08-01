"use client";

import { useEffect, useState } from "react";
import type { GatheringChemistry } from "@/lib/happenings/gathering-chemistry";

const PINK = "#FF1F7D";

function Bar({ label, pct, accent }: { label: string; pct: number; accent: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <span style={{ fontFamily: "var(--font-jost)", fontSize: 10, color: "#888", width: 62, flexShrink: 0 }}>{label}</span>
      <div style={{ flex: 1, height: 5, borderRadius: 3, background: "rgba(0,0,0,0.06)", overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", borderRadius: 3, background: accent }} />
      </div>
      <span style={{ fontFamily: "var(--font-jost)", fontSize: 10, fontWeight: 700, color: "#333", width: 28, textAlign: "right" }}>{pct}%</span>
    </div>
  );
}

/** Real chemistry preview — averages the pairwise compatibility scorer across
 *  a gathering's other reserved attendees. Honest empty state when nobody
 *  else has RSVP'd yet, instead of a placeholder number. */
export function ChemistryPreview({ gatheringId, accent = PINK }: { gatheringId: string; accent?: string }) {
  const [chemistry, setChemistry] = useState<GatheringChemistry | null | undefined>(undefined);

  useEffect(() => {
    let alive = true;
    fetch(`/api/gatherings/${encodeURIComponent(gatheringId)}/chemistry`)
      .then(r => r.json())
      .then(d => { if (alive) setChemistry(d.chemistry ?? null); })
      .catch(() => { if (alive) setChemistry(null); });
    return () => { alive = false; };
  }, [gatheringId]);

  if (chemistry === undefined) return null;

  if (chemistry === null) {
    return (
      <div className="rounded-2xl p-4" style={{ background: "rgba(0,0,0,0.03)" }}>
        <p className="text-[10px] font-bold tracking-widest uppercase mb-1" style={{ color: "#bbb" }}>
          CHEMISTRY PREVIEW
        </p>
        <p className="text-xs" style={{ color: "#999" }}>
          Once a few more women RSVP, we&apos;ll show how well your energy matches the table.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl p-4" style={{ background: `${accent}0A` }}>
      <p className="text-[10px] font-bold tracking-widest uppercase mb-2" style={{ color: "#bbb" }}>
        CHEMISTRY PREVIEW
      </p>
      <div className="flex items-end gap-3 mb-3">
        <span className="text-3xl font-bold" style={{ color: accent, fontFamily: "var(--font-playfair)" }}>
          {chemistry.score}%
        </span>
        <span className="text-xs pb-1" style={{ color: "#888" }}>
          vs. {chemistry.attendee_count} confirmed {chemistry.attendee_count === 1 ? "woman" : "women"}
        </span>
      </div>
      <div className="flex flex-col gap-2">
        <Bar label="Values" pct={chemistry.breakdown.values_pct} accent={accent} />
        <Bar label="Vibe" pct={chemistry.breakdown.vibe_pct} accent={accent} />
        <Bar label="Interests" pct={chemistry.breakdown.interests_pct} accent={accent} />
        <Bar label="Energy" pct={chemistry.breakdown.energy_pct} accent={accent} />
      </div>
    </div>
  );
}
