"use client";

import { useCountUp } from "@/app/components/bloom-suite/use-count-up";

function MetricCount({ value }: { value: number }) {
  const n = useCountUp(value, 900);
  return <span className="bb-admin-metric-row__count">{n.toLocaleString()}</span>;
}

export function MetricRowList({
  title,
  items,
  showBars = true,
}: {
  title: string;
  items: readonly { name: string; count: number }[];
  showBars?: boolean;
}) {
  const max = Math.max(...items.map((i) => i.count), 1);

  return (
    <article className="bb-admin-card bb-admin-card--accent">
      <h2 className="bb-admin-markets__title">{title}</h2>
      <ul className="bb-admin-metric-rows">
        {items.map((item) => (
          <li key={item.name} className="bb-admin-metric-row">
            <div className="bb-admin-metric-row__head">
              <span className="bb-admin-metric-row__name">{item.name}</span>
              <MetricCount value={item.count} />
            </div>
            {showBars ? (
              <div className="bb-admin-bar" aria-hidden>
                <span style={{ width: `${(item.count / max) * 100}%` }} />
              </div>
            ) : null}
          </li>
        ))}
      </ul>
    </article>
  );
}
