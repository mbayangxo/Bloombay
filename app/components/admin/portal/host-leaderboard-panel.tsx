import { HOST_LEADERBOARD } from "@/lib/founder-insights";

export function HostLeaderboardPanel() {
  return (
    <section className="fp-card">
      <h3 className="fp-card__title">Host leaderboard</h3>
      <p className="fp-sub">Top hosts · most active · highest attendance.</p>
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
  );
}
