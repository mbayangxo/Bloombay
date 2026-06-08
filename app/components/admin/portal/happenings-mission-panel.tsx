import Link from "next/link";
import { GATHERINGS } from "@/lib/member-portal-data";
import { EVENTS_LIGHT, TOP_EVENTS } from "@/lib/mission-control-data";
import { TickerNumber } from "./ticker-number";

export function HappeningsMissionPanel({ basePath }: { basePath: "/founder" | "/admin" }) {
  return (
    <div className="fp-page">
      <header className="fp-page__head">
        <p className="fp-kicker">Happenings</p>
        <h2 className="fp-headline">Gatherings & seats in the field</h2>
        <p className="fp-sub">
          What women are booking — chemistry scores, venues, and attendance. IRL is the product.
        </p>
      </header>

      <div className="fp-inbox-pink-cards">
        <article className="fp-inbox-pink-card">
          <TickerNumber value={EVENTS_LIGHT.thisWeek} className="fp-inbox-pink-card__num" />
          <span className="fp-inbox-pink-card__label">This week</span>
        </article>
        <article className="fp-inbox-pink-card">
          <TickerNumber value={EVENTS_LIGHT.seatsReserved} className="fp-inbox-pink-card__num" />
          <span className="fp-inbox-pink-card__label">Seats reserved</span>
        </article>
        <article className="fp-inbox-pink-card">
          <span className="fp-inbox-pink-card__num">{EVENTS_LIGHT.attendanceRate}%</span>
          <span className="fp-inbox-pink-card__label">Attendance rate</span>
        </article>
        <article className="fp-inbox-pink-card">
          <TickerNumber value={EVENTS_LIGHT.createdThisWeek} className="fp-inbox-pink-card__num" />
          <span className="fp-inbox-pink-card__label">New this week</span>
        </article>
      </div>

      <section className="fp-card">
        <h3 className="fp-card__title">Top happenings</h3>
        <ul className="fp-happenings-top">
          {TOP_EVENTS.map((e) => (
            <li key={e.name}>
              <strong>{e.name}</strong>
              <span>
                {e.metric} · {e.value.toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="fp-card">
        <h3 className="fp-card__title">Upcoming gatherings</h3>
        <ul className="fp-happenings-list">
          {GATHERINGS.map((g) => (
            <li key={g.id} className="fp-happenings-list__row">
              <div>
                <strong>{g.title}</strong>
                <p className="fp-sub">{g.subtitle}</p>
                <p className="fp-sub">
                  {g.date} · {g.time} · {g.venue} · {g.neighborhood}
                </p>
              </div>
              <div className="fp-happenings-list__meta">
                <span className="fp-happenings-list__chem">{g.chemistry}% chemistry</span>
                <span>{g.attendees.length + g.extra} women</span>
                <Link href={`/member/happenings/gatherings/${g.id}`} className="fp-link-pill">
                  Member view →
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <p className="fp-sub">
        Club hosts create gatherings in{" "}
        <Link href="/club-owner/gatherings" style={{ color: "var(--bb-hot-deep)", fontWeight: 600 }}>
          Clubhouse
        </Link>
        . Curators welcome women from{" "}
        <Link href="/curator/gatherings" style={{ color: "var(--bb-hot-deep)", fontWeight: 600 }}>
          Curator portal
        </Link>
        .
      </p>
    </div>
  );
}
