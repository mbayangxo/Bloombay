"use client";

import { useCountUp } from "@/app/components/bloom-suite/use-count-up";
import { NYC_GEOGRAPHY_HERO } from "@/lib/founder-dashboard-metrics";

function HeroCount({ value }: { value: number }) {
  const n = useCountUp(value, 1000);
  return <span className="bb-admin-geo-hero__total-num">{n.toLocaleString()}</span>;
}

function BoroughCount({ value }: { value: number }) {
  const n = useCountUp(value, 800);
  return <span className="bb-admin-geo-hero__borough-num">{n.toLocaleString()}</span>;
}

/** NYC macro totals — neighborhoods live in LaunchExplorer drill-down */
export function GeographyHero() {
  const geo = NYC_GEOGRAPHY_HERO;

  return (
    <article className="bb-admin-card bb-admin-geo-hero">
      <p className="bb-admin-geo-hero__eyebrow">Geography · Women</p>
      <header className="bb-admin-geo-hero__headline">
        <h2 className="bb-admin-geo-hero__city">{geo.cityLabel}</h2>
        <p className="bb-admin-geo-hero__total">
          <HeroCount value={geo.totalWomen} /> women
        </p>
      </header>

      <ul className="bb-admin-geo-hero__boroughs bb-admin-geo-hero__boroughs--solo">
        {geo.boroughs.map((b) => (
          <li key={b.name}>
            <span className="bb-admin-geo-hero__borough-name">{b.name}</span>
            <BoroughCount value={b.count} />
          </li>
        ))}
      </ul>
    </article>
  );
}
