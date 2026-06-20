import { displayType, locationLabel, type WaitlistRow } from "@/lib/waitlist-admin";
import { formatDate } from "@/lib/admin-labels";

export function RecentActivity({ items }: { items: WaitlistRow[] }) {
  return (
    <article className="bb-admin-card">
      <h2>Recent activity</h2>
      {items.length === 0 ? (
        <p className="bb-admin-empty">No signups yet.</p>
      ) : (
        <ul className="bb-admin-list">
          {items.map((row) => (
            <li key={row.id}>
              <span>
                <strong>{row.first_name ?? "—"}</strong> joined as {displayType(row.signup_type)}
                <br />
                <small style={{ color: "var(--bb-muted)" }}>
                  {locationLabel(row)} · {formatDate(row.created_at)}
                </small>
              </span>
              <span className={`bb-admin-badge bb-admin-badge--${row.status}`}>
                {row.status}
              </span>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
