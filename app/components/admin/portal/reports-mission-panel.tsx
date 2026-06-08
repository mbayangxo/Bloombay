import Link from "next/link";
import { REFERRAL_SOURCES, SAFETY_HEALTH, SAFETY_REPORT_TYPES } from "@/lib/mission-control-data";
import { TickerNumber } from "./ticker-number";

const REPORT_SNAPSHOTS = [
  { label: "Women growth (30d)", value: 1842, trend: "+12%", href: "/people" },
  { label: "Club launch readiness", value: 86, trend: "NYC leading", href: "/clubs" },
  { label: "Partner pipeline", value: 34, trend: "9 pending", href: "/partners" },
  { label: "Safety resolution", value: 94, trend: "% closed < 48h", href: "/safety" },
] as const;

export function ReportsMissionPanel({ basePath }: { basePath: "/founder" | "/admin" }) {
  return (
    <div className="fp-page">
      <header className="fp-page__head">
        <p className="fp-kicker">Reports</p>
        <h2 className="fp-headline">Platform health & growth</h2>
        <p className="fp-sub">
          Executive snapshots — export CSV from Clubhouse, pull detail from each Mission Control tab.
        </p>
      </header>

      <div className="fp-reports-grid">
        {REPORT_SNAPSHOTS.map((r) => (
          <Link key={r.label} href={`${basePath}${r.href}`} className="fp-reports-card">
            <TickerNumber value={r.value} className="fp-reports-card__num" />
            <span className="fp-reports-card__label">{r.label}</span>
            <span className="fp-reports-card__trend">{r.trend}</span>
          </Link>
        ))}
      </div>

      <div className="fp-grid-2">
        <section className="fp-card">
          <h3 className="fp-card__title">Referral mix</h3>
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
            Open reports: <strong>{SAFETY_HEALTH.openReports}</strong> ·{" "}
            <Link href={`${basePath}/safety`} className="fp-link-pill">
              Safety center →
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
}
