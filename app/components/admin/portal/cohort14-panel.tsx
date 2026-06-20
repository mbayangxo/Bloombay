import { COHORT_14_FUNNEL, attendedRate14, type Cohort14Row } from "@/lib/founder-cohort14";

export function Cohort14Panel({ rows = COHORT_14_FUNNEL }: { rows?: Cohort14Row[] }) {
  return (
    <section className="fp-card fp-cohort14">
      <h3 className="fp-card__title">First 14 days — did she attend IRL?</h3>
      <p className="fp-sub">Joined → verified → joined club → reserved seat → attended gathering.</p>
      <div className="fp-cohort14-table-wrap">
        <table className="fp-health-table">
          <thead>
            <tr>
              <th>Cohort</th>
              <th>Joined</th>
              <th>Verified</th>
              <th>Club</th>
              <th>Seat</th>
              <th>Attended</th>
              <th>14d rate</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.cohort}>
                <td>{row.cohort}</td>
                <td>{row.joined}</td>
                <td>{row.verified}</td>
                <td>{row.joinedClub}</td>
                <td>{row.reservedSeat}</td>
                <td>
                  <strong>{row.attended}</strong>
                </td>
                <td>{attendedRate14(row)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
