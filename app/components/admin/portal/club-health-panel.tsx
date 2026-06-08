import Link from "next/link";
import { FOUNDER_CLUB_HEALTH } from "@/lib/founder-insights";
import type { StaffBase } from "@/lib/mc-paths";
import { mcPath } from "@/lib/mc-paths";

export function ClubHealthPanel({ staffBase = "/admin" }: { staffBase?: StaffBase }) {
  const weak = FOUNDER_CLUB_HEALTH.filter((c) => c.overall < 80);

  return (
    <section className="fp-card fp-club-health">
      <div className="fp-card__head-row">
        <h3 className="fp-card__title">Club health scores</h3>
        <Link href={mcPath("/admin/clubs", staffBase)} className="fp-link">
          All clubs →
        </Link>
      </div>
      <p className="fp-sub">Attendance, safety, host response, growth — identify weak clubs.</p>
      <div className="fp-health-table-wrap">
        <table className="fp-health-table">
          <thead>
            <tr>
              <th>Club</th>
              <th>Attend</th>
              <th>Safety</th>
              <th>Host</th>
              <th>Growth</th>
              <th>Overall</th>
              <th>No-shows</th>
            </tr>
          </thead>
          <tbody>
            {FOUNDER_CLUB_HEALTH.map((c) => (
              <tr key={c.clubId} className={c.overall < 80 ? "fp-health-table__weak" : ""}>
                <td>
                  <strong>{c.name}</strong>
                  <span className="fp-sub">{c.members} members</span>
                </td>
                <td>{c.attendance}%</td>
                <td>{c.safety}%</td>
                <td>{c.hostResponse}%</td>
                <td>{c.growth}%</td>
                <td>
                  <strong>{c.overall}</strong>
                </td>
                <td>{c.noShowsLast30}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {weak.length > 0 ? (
        <p className="fp-tag-danger" style={{ marginTop: "0.75rem" }}>
          {weak.length} club{weak.length > 1 ? "s" : ""} below 80 overall — review attendance & host response.
        </p>
      ) : null}
    </section>
  );
}
