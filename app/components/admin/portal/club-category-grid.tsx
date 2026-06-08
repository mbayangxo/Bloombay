"use client";

import { useState } from "react";
import type { GrowthTrend } from "@/lib/portal-dashboard-data";

export type ClubCategory = {
  name: string;
  interested: number;
  weekGrowth: number;
  readiness: number;
  trend: GrowthTrend;
};

export function ClubCategoryGrid({ categories }: { categories: ClubCategory[] }) {
  const [selected, setSelected] = useState<string | null>(null);
  const rows: ClubCategory[][] = [];
  for (let i = 0; i < categories.length; i += 3) {
    rows.push(categories.slice(i, i + 3));
  }

  return (
    <section className="fp-overview-card fp-overview-clubs">
      <div className="fp-overview-card__head">
        <h3 className="fp-overview-card__title">Most requested clubs</h3>
        <span className="fp-overview-card__hint">By lifestyle category</span>
      </div>

      {selected ? (
        <p className="fp-overview-clubs__placeholder" role="status">
          <strong>{selected}</strong> — club drill-down opens here when members tag clubs
          by category.
          <button type="button" className="fp-overview-clubs__clear" onClick={() => setSelected(null)}>
            Back to all categories
          </button>
        </p>
      ) : null}

      <div className={selected ? "fp-overview-clubs__grid fp-overview-clubs__grid--dim" : "fp-overview-clubs__grid"}>
        {rows.map((row, ri) => (
          <div key={ri} className="fp-overview-clubs__row">
            {row.map((c) => (
              <button
                key={c.name}
                type="button"
                className="fp-overview-club-card"
                onClick={() => setSelected(c.name)}
              >
                <span className="fp-overview-club-card__name">{c.name}</span>
                <span className="fp-overview-club-card__stat">
                  {c.interested.toLocaleString()} interested
                </span>
                <span className="fp-overview-club-card__growth">+{c.weekGrowth}% this week</span>
                <div className="fp-overview-bar">
                  <div
                    className="fp-overview-bar__fill"
                    style={{ width: `${c.readiness}%` }}
                  />
                </div>
                <span className="fp-overview-club-card__ready">{c.readiness}% ready</span>
              </button>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
