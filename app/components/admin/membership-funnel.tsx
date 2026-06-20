"use client";

import { useCountUp } from "@/app/components/bloom-suite/use-count-up";
import {
  MEMBERSHIP_FUNNEL,
  funnelConversionRate,
} from "@/lib/founder-dashboard-metrics";

function FunnelStep({
  label,
  value,
  rate,
  isLast,
}: {
  label: string;
  value: number;
  rate: number | null;
  isLast: boolean;
}) {
  const n = useCountUp(value, 500);
  return (
    <div className={`bb-admin-funnel__step ${isLast ? "bb-admin-funnel__step--final" : ""}`}>
      <span className="bb-admin-funnel__label">
        {label}
        {rate != null ? (
          <span className="bb-admin-funnel__rate"> · {rate}%</span>
        ) : null}
      </span>
      <span className="bb-admin-funnel__value">{n.toLocaleString()}</span>
    </div>
  );
}

export function MembershipFunnel() {
  return (
    <article className="bb-admin-card bb-admin-funnel bb-admin-funnel--slim">
      <h2>Membership funnel</h2>
      <div className="bb-admin-funnel__track">
        {MEMBERSHIP_FUNNEL.map((step, i) => {
          const prev = i > 0 ? MEMBERSHIP_FUNNEL[i - 1].value : null;
          const rate =
            prev != null ? funnelConversionRate(step.value, prev) : null;
          return (
            <FunnelStep
              key={step.key}
              label={step.label}
              value={step.value}
              rate={rate}
              isLast={i === MEMBERSHIP_FUNNEL.length - 1}
            />
          );
        })}
      </div>
    </article>
  );
}
