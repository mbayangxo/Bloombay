"use client";

import { useCountUp } from "@/app/components/bloom-suite/use-count-up";
import {
  CLUB_DEMAND,
  LAUNCH_PROGRESS,
  NYC_MARKET_AREAS,
  PARTNER_APPLICATION_TYPES,
} from "@/lib/founder-dashboard-metrics";
import { MetricRowList } from "./metric-row-list";

function ProgressPercent({ value }: { value: number }) {
  const n = useCountUp(value, 800);
  return <span className="bb-admin-launch-progress__pct">{n}%</span>;
}

export function MarketsOverview() {
  const clubItems = CLUB_DEMAND.map((c) => ({ name: c.label, count: c.count }));

  return (
    <div className="bb-admin-markets">
      <div className="bb-admin-grid bb-admin-grid--markets-top">
        <MetricRowList title="New York" items={NYC_MARKET_AREAS} />

        <article className="bb-admin-card">
          <h2 className="bb-admin-markets__title">Launch Progress</h2>
          <ul className="bb-admin-launch-progress">
            {LAUNCH_PROGRESS.map((row) => (
              <li key={row.city}>
                <div className="bb-admin-launch-progress__head">
                  <strong>{row.city}</strong>
                  <ProgressPercent value={row.percent} />
                </div>
                <div className="bb-admin-bar" aria-hidden>
                  <span style={{ width: `${row.percent}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </article>
      </div>

      <MetricRowList title="Clubs showing demand" items={clubItems} />

      <div className="bb-admin-markets__rule" aria-hidden>
        ⸻
      </div>

      <article className="bb-admin-card bb-admin-partners-panel">
        <h2 className="bb-admin-markets__title">Partners</h2>
        <p className="bb-admin-partners-panel__lead">Applications from:</p>
        <ul className="bb-admin-partner-types">
          {PARTNER_APPLICATION_TYPES.map((type) => (
            <li key={type}>{type}</li>
          ))}
        </ul>
      </article>
    </div>
  );
}
