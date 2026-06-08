"use client";

import { GrowthChip } from "./growth-chip";
import { TickerNumber } from "./ticker-number";

export type KpiItem = {
  label: string;
  total: number;
  today: number;
  week: number;
  month: number;
};

export function KpiRow({ items }: { items: KpiItem[] }) {
  return (
    <div className="fp-overview__kpis">
      {items.map((k) => (
        <article key={k.label} className="fp-overview-kpi fp-surface-white">
          <p className="fp-overview-kpi__label">{k.label}</p>
          <p className="fp-overview-kpi__value">
            <TickerNumber value={k.total} live className="fp-ticker-hero" />
          </p>
          <div className="fp-overview-kpi__chips">
            <GrowthChip value={k.today} period="today" />
            <GrowthChip value={k.week} period="this week" />
            <GrowthChip value={k.month} period="this month" />
          </div>
        </article>
      ))}
    </div>
  );
}
