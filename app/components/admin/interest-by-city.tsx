import { interestLabel } from "@/lib/admin-labels";

export function InterestByCity({
  rows,
}: {
  rows: { city: string; interest: string; count: number }[];
}) {
  const max = Math.max(...rows.map((r) => r.count), 1);
  return (
    <article className="bb-admin-card">
      <h2>Interest by city</h2>
      {rows.length === 0 ? (
        <p className="bb-admin-empty">Member interests will map here by city.</p>
      ) : (
        <ul className="bb-admin-list">
          {rows.map((row) => (
            <li key={`${row.city}-${row.interest}`}>
              <span>
                <strong>{row.city}</strong> · {interestLabel(row.interest)}
              </span>
              <div className="bb-admin-bar" aria-hidden>
                <span style={{ width: `${(row.count / max) * 100}%` }} />
              </div>
              <span>{row.count}</span>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
