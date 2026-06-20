import Link from "next/link";
import type { StaffBase } from "@/lib/mc-paths";
import { mcPath } from "@/lib/mc-paths";
import {
  CLUB_CATALOG,
  CLUBS_WAITING_DETAIL,
} from "@/lib/mission-control-data";
import { CLUBS_CENTER } from "@/lib/portal-dashboard-data";
import { ClubHealthPanel } from "./club-health-panel";
import { ClubLaunchPanel } from "./club-launch-panel";
import { HostLeaderboardPanel } from "./host-leaderboard-panel";
import { TrendBadge } from "./trend-badge";

const fastestGrowing = [...CLUB_CATALOG]
  .sort((a, b) => b.weekGrowth - a.weekGrowth)
  .slice(0, 4);

const readyToLaunch = CLUBS_CENTER.filter((c) => c.readiness >= 85);
const needHost = CLUBS_WAITING_DETAIL.filter((c) => c.host.includes("Need"));
const needVenue = CLUBS_WAITING_DETAIL.filter((c) => c.venue.includes("Need"));

export function ClubsCenter({ staffBase = "/admin" }: { staffBase?: import("@/lib/mc-paths").StaffBase }) {
  return (
    <div className="fp-page">
      <header className="fp-page__head">
        <p className="fp-kicker">Clubs</p>
        <h2 className="fp-headline">Club creation & growth center</h2>
        <p className="fp-sub">
          Emerging communities, hosts, venues, and launch readiness — build the
          social world women are asking for.
        </p>
      </header>

      <div className="fp-clubs-sections">
        <section className="fp-card">
          <h3 className="fp-card__title">Most requested</h3>
          <ul className="fp-mini-tags">
            {CLUB_CATALOG.slice(0, 5).map((c) => (
              <li key={c.name}>
                {c.name} · {c.interested.toLocaleString()}
              </li>
            ))}
          </ul>
        </section>
        <section className="fp-card">
          <h3 className="fp-card__title">Fastest growing</h3>
          <ul className="fp-mini-tags">
            {fastestGrowing.map((c) => (
              <li key={c.name}>
                {c.name} <TrendBadge trend={c.trend} /> +{c.weekGrowth}%
              </li>
            ))}
          </ul>
        </section>
        <section className="fp-card">
          <h3 className="fp-card__title">Ready to launch</h3>
          <ul className="fp-mini-tags">
            {readyToLaunch.map((c) => (
              <li key={c.name}>
                {c.name} · {c.readiness}%
              </li>
            ))}
          </ul>
        </section>
        <section className="fp-card">
          <h3 className="fp-card__title">Need host</h3>
          <ul className="fp-mini-tags">
            {needHost.map((c) => (
              <li key={c.name}>
                {c.name} · {c.women} women
              </li>
            ))}
          </ul>
        </section>
        <section className="fp-card">
          <h3 className="fp-card__title">Need venue</h3>
          <ul className="fp-mini-tags">
            {needVenue.map((c) => (
              <li key={c.name}>
                {c.name} · {c.venue}
              </li>
            ))}
          </ul>
        </section>
      </div>

      <ClubLaunchPanel staffBase={staffBase} />
      <ClubHealthPanel staffBase={staffBase} />
      <HostLeaderboardPanel />

      <div className="fp-club-cards">
        {CLUBS_CENTER.map((club) => (
          <article key={club.name} className="fp-club-card">
            <h3>{club.name}</h3>
            <p className="fp-club-card__women">
              {club.women.toLocaleString()} interested women · {club.city}
            </p>
            <dl className="fp-club-card__status">
              <div>
                <dt>Host</dt>
                <dd>{club.host}</dd>
              </div>
              <div>
                <dt>Venue</dt>
                <dd>{club.venue}</dd>
              </div>
            </dl>
            <div className="fp-progress">
              <div className="fp-progress__fill" style={{ width: `${club.readiness}%` }} />
              <span>{club.readiness}% ready</span>
            </div>
          </article>
        ))}
      </div>

      <p className="fp-page__foot">
        <Link href={mcPath("/admin/applications?type=club_host", staffBase)}>
          Review club host applications →
        </Link>
      </p>
    </div>
  );
}
