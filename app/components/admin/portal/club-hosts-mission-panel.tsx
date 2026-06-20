import Link from "next/link";
import { HOST_LEADERBOARD } from "@/lib/founder-insights";
import { PORTAL_QUEUE_FALLBACK } from "@/lib/founder-dashboard-metrics";

export function ClubHostsMissionPanel({ basePath }: { basePath: "/founder" | "/admin" }) {
  return (
    <div className="fp-page">
      <header className="fp-page__head">
        <p className="fp-kicker">Hosts</p>
        <h2 className="fp-headline">Club hosts & clubhouse leads</h2>
        <p className="fp-sub">
          Women running clubs — attendance, trust, and applications waiting for your yes.
        </p>
      </header>

      <div className="fp-inbox-pink-cards">
        <article className="fp-inbox-pink-card">
          <span className="fp-inbox-pink-card__num">{PORTAL_QUEUE_FALLBACK.clubHostsPending}</span>
          <span className="fp-inbox-pink-card__label">Pending approval</span>
        </article>
        <article className="fp-inbox-pink-card">
          <span className="fp-inbox-pink-card__num">{HOST_LEADERBOARD.length}</span>
          <span className="fp-inbox-pink-card__label">Active hosts (top)</span>
        </article>
      </div>

      <section className="fp-card">
        <h3 className="fp-card__title">Host leaderboard</h3>
        <ol className="fp-host-lb">
          {HOST_LEADERBOARD.map((h) => (
            <li key={h.rank} className={`fp-host-lb__row fp-host-lb__row--${h.badge}`}>
              <span className="fp-host-lb__rank">#{h.rank}</span>
              <div>
                <strong>{h.name}</strong>
                <span className="fp-sub">{h.club}</span>
              </div>
              <div className="fp-host-lb__stats">
                <span>{h.attendanceRate}% attend</span>
                <span>{h.eventsHosted} events</span>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <p className="fp-sub">
        <Link href={`${basePath}/applications?type=club_host`} className="fp-link-pill">
          Review host applications →
        </Link>
        {" · "}
        <Link href="/club-owner/dashboard" className="fp-link-pill">
          Clubhouse portal →
        </Link>
      </p>
    </div>
  );
}
