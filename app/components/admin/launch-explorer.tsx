"use client";

import { useMemo, useState } from "react";
import {
  LAUNCH_THRESHOLD_PERCENT,
  NYC_GEOGRAPHY_HERO,
} from "@/lib/founder-dashboard-metrics";
import {
  isCityLaunchReady,
  LAUNCH_CITIES,
  neighborhoodLaunchStats,
  type LaunchCity,
  type LaunchNeighborhood,
} from "@/lib/launch-cities-data";

type View = "cities" | "neighborhoods" | "neighborhood-detail";

export function LaunchExplorer({ embedded = false }: { embedded?: boolean }) {
  const [view, setView] = useState<View>("cities");
  const [cityId, setCityId] = useState<string | null>(null);
  const [neighborhoodId, setNeighborhoodId] = useState<string | null>(null);

  const city = useMemo(
    () => LAUNCH_CITIES.find((c) => c.id === cityId) ?? null,
    [cityId]
  );

  const neighborhood = useMemo(() => {
    if (!city || !neighborhoodId) return null;
    return city.neighborhoods.find((n) => n.id === neighborhoodId) ?? null;
  }, [city, neighborhoodId]);

  const stats = neighborhood
    ? neighborhoodLaunchStats(neighborhood.signedUp, neighborhood.percent)
    : null;

  function selectCity(c: LaunchCity) {
    setCityId(c.id);
    setNeighborhoodId(null);
    setView("neighborhoods");
  }

  function selectNeighborhood(n: LaunchNeighborhood) {
    setNeighborhoodId(n.id);
    setView("neighborhood-detail");
  }

  function backToCities() {
    setCityId(null);
    setNeighborhoodId(null);
    setView("cities");
  }

  function backToNeighborhoods() {
    setNeighborhoodId(null);
    setView("neighborhoods");
  }

  return (
    <article className="bb-admin-card bb-admin-launch-explorer">
      <header className="bb-admin-launch-explorer__header">
        {!embedded ? (
          <>
            <h2 className="bb-admin-launch-explorer__title">
              <span aria-hidden>🔥</span> Cities closest to launch
            </h2>
            <p className="bb-admin-launch-explorer__sub">
              Select a city, then a neighborhood, to see who&apos;s here and who&apos;s
              still needed.
            </p>
          </>
        ) : null}
        <nav className="bb-admin-launch-explorer__crumb" aria-label="Launch drill-down">
          <button
            type="button"
            className={view === "cities" ? "bb-admin-launch-explorer__crumb--on" : ""}
            onClick={backToCities}
          >
            All cities
          </button>
          {city ? (
            <>
              <span aria-hidden>›</span>
              <button
                type="button"
                className={
                  view === "neighborhoods" ? "bb-admin-launch-explorer__crumb--on" : ""
                }
                onClick={backToNeighborhoods}
              >
                {city.name}
              </button>
            </>
          ) : null}
          {neighborhood ? (
            <>
              <span aria-hidden>›</span>
              <span className="bb-admin-launch-explorer__crumb--on">
                {neighborhood.name}
              </span>
            </>
          ) : null}
        </nav>
      </header>

      {view === "cities" && (
        <ul className="bb-admin-launch-explorer__cities">
          {LAUNCH_CITIES.map((c) => (
            <li key={c.id}>
              <button
                type="button"
                className={`bb-admin-launch-explorer__city-btn ${
                  isCityLaunchReady(c.percent)
                    ? "bb-admin-launch-explorer__city-btn--glow"
                    : ""
                }`}
                onClick={() => selectCity(c)}
              >
                <span className="bb-admin-launch-explorer__city-name">{c.name}</span>
                <span className="bb-admin-launch-explorer__city-meta">
                  {c.totalSignedUp.toLocaleString()} women · {c.percent}%
                </span>
                <div className="bb-admin-bar" aria-hidden>
                  <span style={{ width: `${c.percent}%` }} />
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}

      {view === "neighborhoods" && city ? (
        <div className="bb-admin-launch-explorer__panel">
          {city.id === "nyc" ? (
            <div className="bb-admin-launch-explorer__macro">
              <p className="bb-admin-launch-explorer__macro-total">
                <strong>{city.totalSignedUp.toLocaleString()}</strong> women in{" "}
                {city.name}
              </p>
              <ul className="bb-admin-launch-explorer__macro-boroughs">
                {NYC_GEOGRAPHY_HERO.boroughs.map((b) => (
                  <li key={b.name}>
                    <span>{b.name}</span>
                    <span>{b.count.toLocaleString()}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="bb-admin-launch-explorer__macro-total">
              <strong>{city.totalSignedUp.toLocaleString()}</strong> women in{" "}
              {city.name}
            </p>
          )}
          <p className="bb-admin-launch-explorer__panel-lead">
            Neighborhoods closest to launch
          </p>
          <ul className="bb-admin-launch-explorer__hoods">
            {[...city.neighborhoods]
              .sort((a, b) => b.percent - a.percent)
              .map((n) => (
                <li key={n.id}>
                  <button
                    type="button"
                    className={`bb-admin-launch-explorer__hood-btn ${
                      n.percent >= LAUNCH_THRESHOLD_PERCENT
                        ? "bb-admin-launch-explorer__hood-btn--hot"
                        : ""
                    }`}
                    onClick={() => selectNeighborhood(n)}
                  >
                    <span>
                      {n.percent >= LAUNCH_THRESHOLD_PERCENT ? (
                        <span aria-hidden>🔥 </span>
                      ) : null}
                      {n.name}
                    </span>
                    <span>{n.percent}%</span>
                  </button>
                </li>
              ))}
          </ul>
        </div>
      ) : null}

      {view === "neighborhood-detail" && city && neighborhood && stats ? (
        <div className="bb-admin-launch-explorer__detail">
          <h3 className="bb-admin-launch-explorer__detail-title">
            {neighborhood.name}, {city.name}
          </h3>
          <div className="bb-admin-launch-explorer__detail-grid">
            <div className="bb-admin-launch-explorer__stat">
              <span className="bb-admin-launch-explorer__stat-label">
                Already signed up
              </span>
              <span className="bb-admin-launch-explorer__stat-value">
                {stats.signedUp.toLocaleString()}
              </span>
              <span className="bb-admin-launch-explorer__stat-hint">members</span>
            </div>
            <div className="bb-admin-launch-explorer__stat bb-admin-launch-explorer__stat--accent">
              <span className="bb-admin-launch-explorer__stat-label">
                Still needed to launch
              </span>
              <span className="bb-admin-launch-explorer__stat-value">
                {stats.membersLeft.toLocaleString()}
              </span>
              <span className="bb-admin-launch-explorer__stat-hint">members left</span>
            </div>
          </div>
          <p className="bb-admin-launch-explorer__detail-progress">
            <strong>{stats.percent}%</strong> toward launch · goal{" "}
            <strong>{stats.launchGoal.toLocaleString()}</strong> members in this
            neighborhood
          </p>
          <div className="bb-admin-bar bb-admin-bar--detail" aria-hidden>
            <span style={{ width: `${stats.percent}%` }} />
          </div>
          {stats.membersLeft === 0 ? (
            <p className="bb-admin-launch-explorer__ready">
              This neighborhood is ready to bloom.
            </p>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}
