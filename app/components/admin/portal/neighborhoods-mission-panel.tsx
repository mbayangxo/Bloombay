import {
  LAUNCH_NEIGHBORHOODS,
  LAUNCH_READINESS,
  NYC_GEOGRAPHY_HERO,
  isLaunchReady,
} from "@/lib/founder-dashboard-metrics";
import { TickerNumber } from "./ticker-number";

export function NeighborhoodsMissionPanel() {
  return (
    <div className="fp-page">
      <header className="fp-page__head">
        <p className="fp-kicker">Neighborhoods</p>
        <h2 className="fp-headline">Where BloomBay launches next</h2>
        <p className="fp-sub">
          Neighborhood heat · city readiness · founder launch calls — NYC blooms first.
        </p>
      </header>

      <section className="fp-card fp-card--hero">
        <p className="fp-kicker">{NYC_GEOGRAPHY_HERO.cityLabel}</p>
        <h3 className="fp-card__title">
          <TickerNumber value={NYC_GEOGRAPHY_HERO.totalWomen} /> women
        </h3>
        <ul className="fp-mini-tags">
          {NYC_GEOGRAPHY_HERO.boroughs.map((b) => (
            <li key={b.name}>
              {b.name} · {b.count.toLocaleString()}
            </li>
          ))}
        </ul>
      </section>

      <div className="fp-grid-2">
        <section className="fp-card">
          <h3 className="fp-card__title">Closest to launch</h3>
          <ul className="fp-neighborhood-launch">
            {LAUNCH_NEIGHBORHOODS.map((name) => {
              const match = NYC_GEOGRAPHY_HERO.neighborhoods.find((n) => n.name === name);
              const pct = match?.percent ?? 72;
              return (
                <li key={name} className="fp-neighborhood-launch__row">
                  <span>{name}</span>
                  <span className={isLaunchReady(pct) ? "fp-pill fp-pill--ready" : "fp-pill"}>
                    {pct}% {isLaunchReady(pct) ? "· Launch" : "· Build"}
                  </span>
                </li>
              );
            })}
          </ul>
        </section>
        <section className="fp-card">
          <h3 className="fp-card__title">City readiness</h3>
          <ul className="fp-admin-launch-progress">
            {LAUNCH_READINESS.map((row) => (
              <li key={row.city}>
                <div className="fp-admin-launch-progress__head">
                  <strong>{row.city}</strong>
                  <span>{row.percent}%</span>
                </div>
                <div className="bb-admin-bar" aria-hidden>
                  <span style={{ width: `${row.percent}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
