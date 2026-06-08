import { CLUB_REQUESTS } from "@/lib/founder-dashboard-metrics";

export function ClubRequests() {
  return (
    <article className="bb-admin-card">
      <h2>Club requests</h2>
      <p className="bb-admin-panel-lead">What women want — demand signals</p>
      <ul className="bb-admin-club-requests">
        {CLUB_REQUESTS.map((name) => (
          <li key={name}>{name}</li>
        ))}
      </ul>
    </article>
  );
}
