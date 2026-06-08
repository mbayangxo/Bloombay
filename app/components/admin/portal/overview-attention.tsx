"use client";

import Link from "next/link";
import { CountUp } from "./count-up";

export type AttentionPill = {
  count: number;
  label: string;
  href: string;
};

export function OverviewAttention({ pills }: { pills: AttentionPill[] }) {
  return (
    <section className="fp-overview-attention">
      <p className="fp-overview-attention__kicker">BloomBay Mission Control</p>
      <h2 className="fp-overview-attention__title">
        What requires your attention today?
      </h2>
      <ul className="fp-overview-attention__pills">
        {pills.map((p) => (
          <li key={p.label}>
            <Link href={p.href} className="fp-overview-pill">
              <CountUp value={p.count} className="fp-overview-pill__count" />
              <span className="fp-overview-pill__label">{p.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
