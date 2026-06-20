"use client";

import { useCountUp } from "@/app/components/bloom-suite/use-count-up";
import { MEMBER_VELOCITY_FALLBACK } from "@/lib/founder-dashboard-metrics";

function PulseNum({ value }: { value: number }) {
  const n = useCountUp(value, 700);
  return <strong>{n.toLocaleString()}</strong>;
}

export function GrowthPulse({
  today,
  thisWeek,
}: {
  today: number;
  thisWeek: number;
}) {
  const t = today > 0 ? today : MEMBER_VELOCITY_FALLBACK.today;
  const w = thisWeek > 0 ? thisWeek : MEMBER_VELOCITY_FALLBACK.thisWeek;

  return (
    <section className="bb-portal-growth" aria-label="Active member growth">
      <p className="bb-portal-growth__kicker">Active member growth</p>
      <div className="bb-portal-growth__nums">
        <span>
          <PulseNum value={t} /> <em>today</em>
        </span>
        <span className="bb-portal-growth__sep" aria-hidden>
          ·
        </span>
        <span>
          <PulseNum value={w} /> <em>this week</em>
        </span>
      </div>
      <p className="bb-portal-growth__line">
        The network is filling — city by city, club by club.
      </p>
    </section>
  );
}
