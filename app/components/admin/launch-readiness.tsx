import { LAUNCH_READINESS } from "@/lib/founder-dashboard-metrics";

export function LaunchReadiness() {
  return (
    <article className="bb-admin-card">
      <h2>
        <span aria-hidden>🔥</span> Cities closest to launch
      </h2>
      <ul className="bb-admin-readiness">
        {LAUNCH_READINESS.map((row) => (
          <li key={row.city}>
            <div className="bb-admin-readiness__head">
              <strong>{row.city}</strong>
              <span>{row.percent}%</span>
            </div>
            <div className="bb-admin-bar" aria-hidden>
              <span style={{ width: `${row.percent}%` }} />
            </div>
          </li>
        ))}
      </ul>
    </article>
  );
}
