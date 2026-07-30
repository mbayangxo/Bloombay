"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { REFERRAL_SOURCES, SAFETY_REPORT_TYPES } from "@/lib/mission-control-data";
import { TickerNumber } from "./ticker-number";

const REPORT_SNAPSHOTS = [
  { label: "Women growth (30d)", value: 1842, trend: "+12%", href: "/people" },
  { label: "Club launch readiness", value: 86, trend: "NYC leading", href: "/clubs" },
  { label: "Partner pipeline", value: 34, trend: "9 pending", href: "/partners" },
] as const;

export function ReportsMissionPanel({ basePath }: { basePath: "/founder" | "/admin" }) {
  const [openReports, setOpenReports] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/founder/safety")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setOpenReports(d?.openReports ?? 0))
      .catch(() => {});
  }, []);

  return (
    <div className="fp-page">
      <header className="fp-page__head">
        <p className="fp-kicker">Reports</p>
        <h2 className="fp-headline">Platform health & growth</h2>
        <p className="fp-sub">
          Executive snapshots — export CSV from Clubhouse, pull detail from each Mission Control tab.
        </p>
      </header>

      <p className="fp-sub" style={{ marginBottom: "1rem" }}>
        <strong>Demo data —</strong> the three snapshots below and the referral mix aren&apos;t wired to live
        data yet. Safety open-report count is real, pulled from the same source as the Safety center.
      </p>

      <div className="fp-reports-grid">
        {REPORT_SNAPSHOTS.map((r) => (
          <Link key={r.label} href={`${basePath}${r.href}`} className="fp-reports-card">
            <TickerNumber value={r.value} className="fp-reports-card__num" />
            <span className="fp-reports-card__label">{r.label} (demo)</span>
            <span className="fp-reports-card__trend">{r.trend}</span>
          </Link>
        ))}
        <Link href={`${basePath}/safety`} className="fp-reports-card">
          <TickerNumber value={openReports ?? 0} className="fp-reports-card__num" />
          <span className="fp-reports-card__label">Open safety reports</span>
          <span className="fp-reports-card__trend">live</span>
        </Link>
      </div>

      <div className="fp-grid-2">
        <section className="fp-card">
          <h3 className="fp-card__title">Referral mix (demo)</h3>
          <ul className="fp-mini-tags">
            {REFERRAL_SOURCES.map((r) => (
              <li key={r.source}>
                {r.source} · {r.percent}%
              </li>
            ))}
          </ul>
        </section>
        <section className="fp-card">
          <h3 className="fp-card__title">Safety taxonomy</h3>
          <ul className="fp-mini-tags">
            {SAFETY_REPORT_TYPES.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
          <p className="fp-sub" style={{ marginTop: "0.75rem" }}>
            Open reports: <strong>{openReports ?? "…"}</strong> ·{" "}
            <Link href={`${basePath}/safety`} className="fp-link-pill">
              Safety center →
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
}
