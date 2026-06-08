import {
  isLaunchReady,
  LAUNCH_RADAR,
  LAUNCH_THRESHOLD_PERCENT,
} from "@/lib/founder-dashboard-metrics";

export function LaunchRadar() {
  return (
    <article className="bb-admin-card bb-admin-launch-radar">
      <h2 className="bb-admin-launch-radar__title">Launch Radar</h2>
      <p className="bb-admin-launch-radar__sub">
        Cities at {LAUNCH_THRESHOLD_PERCENT}%+ readiness glow
      </p>
      <ul className="bb-admin-launch-radar__grid">
        {LAUNCH_RADAR.map((row) => {
          const hot = isLaunchReady(row.percent);
          return (
            <li
              key={row.city}
              className={`bb-admin-launch-radar__city ${hot ? "bb-admin-launch-radar__city--glow" : ""}`}
            >
              <span className="bb-admin-launch-radar__name">{row.city}</span>
              <span className="bb-admin-launch-radar__pct">{row.percent}%</span>
              <div className="bb-admin-bar" aria-hidden>
                <span style={{ width: `${row.percent}%` }} />
              </div>
            </li>
          );
        })}
      </ul>
    </article>
  );
}
