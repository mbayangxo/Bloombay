import { LAUNCH_NEIGHBORHOODS } from "@/lib/founder-dashboard-metrics";

export function LaunchNeighborhoods() {
  return (
    <article className="bb-admin-card">
      <h2>
        <span aria-hidden>🔥</span> Neighborhoods closest to launch
      </h2>
      <ul className="bb-admin-neighborhoods">
        {LAUNCH_NEIGHBORHOODS.map((name) => (
          <li key={name}>{name}</li>
        ))}
      </ul>
    </article>
  );
}
