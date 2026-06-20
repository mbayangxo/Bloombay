"use client";

import { McLink } from "./mc-link";
import { displayType, locationLabel, type WaitlistRow } from "@/lib/waitlist-admin";
import { formatDate } from "@/lib/admin-labels";

export function ActionQueue({ items }: { items: WaitlistRow[] }) {
  return (
    <article className="bb-admin-card">
      <h2>Action queue</h2>
      {items.length === 0 ? (
        <p className="bb-admin-empty">No new submissions waiting.</p>
      ) : (
        <>
          {items.map((row) => (
            <div key={row.id} className="bb-admin-queue-item">
              <div>
                <strong>{row.first_name ?? row.email ?? "Unknown"}</strong>
                <span className={`bb-admin-badge bb-admin-badge--new`}>new</span>
              </div>
              <span>{displayType(row.signup_type)}</span>
              <small>
                {locationLabel(row)} · {formatDate(row.created_at)}
              </small>
            </div>
          ))}
          <p style={{ marginTop: "1rem", fontSize: "0.85rem" }}>
            <McLink href="/admin/applications?status=new" style={{ color: "var(--bb-hot-deep)" }}>
              Open applications →
            </McLink>
          </p>
        </>
      )}
    </article>
  );
}
