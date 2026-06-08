"use client";

import { useCountUp } from "@/app/components/bloom-suite/use-count-up";

function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent?: boolean;
}) {
  const n = useCountUp(value, 900);
  return (
    <article className={`bb-admin-card ${accent ? "bb-admin-card--accent" : ""}`}>
      <div className="bb-admin-stat-label">{label}</div>
      <div className="bb-admin-stat-value">
        <em>{n.toLocaleString()}</em>
      </div>
    </article>
  );
}

export function StatCards({
  total,
  members,
  clubs,
  partners,
  liveWaitlistTotal,
}: {
  total: number;
  members: number;
  clubs: number;
  partners: number;
  liveWaitlistTotal?: number;
}) {
  return (
    <article className="bb-admin-card bb-admin-card--accent">
      <h2>Signup mix</h2>
      <div className="bb-admin-grid bb-admin-grid--stats bb-admin-grid--stats-inline">
        <StatCard label="Joined" value={total} accent />
        <StatCard label="Members" value={members} />
        <StatCard label="Club hosts" value={clubs} />
        <StatCard label="Partners" value={partners} />
      </div>
      {liveWaitlistTotal != null && liveWaitlistTotal > 0 ? (
        <p className="bb-admin-stat-foot">
          {liveWaitlistTotal.toLocaleString()} in database now
        </p>
      ) : null}
    </article>
  );
}
