"use client";

import { useCountUp } from "@/app/components/bloom-suite/use-count-up";
import { MEMBER_VELOCITY_FALLBACK } from "@/lib/founder-dashboard-metrics";

function VelocityStat({ label, value }: { label: string; value: number }) {
  const n = useCountUp(value, 700);
  return (
    <div className="bb-admin-velocity__stat">
      <span className="bb-admin-velocity__value">{n.toLocaleString()}</span>
      <span className="bb-admin-velocity__label">{label}</span>
    </div>
  );
}

export function MemberVelocity({
  today,
  thisWeek,
}: {
  today: number;
  thisWeek: number;
}) {
  const todayN = today > 0 ? today : MEMBER_VELOCITY_FALLBACK.today;
  const weekN = thisWeek > 0 ? thisWeek : MEMBER_VELOCITY_FALLBACK.thisWeek;

  return (
    <article className="bb-admin-card bb-admin-velocity">
      <VelocityStat label="New members today" value={todayN} />
      <VelocityStat label="New members this week" value={weekN} />
    </article>
  );
}
