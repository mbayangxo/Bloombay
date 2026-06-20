"use client";

import { useCountUp } from "@/app/components/bloom-suite/use-count-up";
import { TOP_CITIES_RANKED } from "@/lib/founder-dashboard-metrics";

function RankCount({ value }: { value: number }) {
  const n = useCountUp(value, 900);
  return <>{n.toLocaleString()}</>;
}

export function TopCitiesRanked() {
  return (
    <article className="bb-admin-card bb-admin-card--accent">
      <h2>Top cities</h2>
      <ol className="bb-admin-ranked">
        {TOP_CITIES_RANKED.map((row) => (
          <li key={row.city}>
            <span className="bb-admin-ranked__medal" aria-hidden>
              {row.medal}
            </span>
            <span className="bb-admin-ranked__city">{row.city}</span>
            <span className="bb-admin-ranked__count">
              — <RankCount value={row.count} />
            </span>
          </li>
        ))}
      </ol>
    </article>
  );
}
