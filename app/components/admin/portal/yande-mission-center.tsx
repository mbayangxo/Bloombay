import { YANDE_MISSION } from "@/lib/founder-insights";

export function YandeMissionCenter() {
  const y = YANDE_MISSION;

  return (
    <div className="fp-portal-page">
      <header className="fp-portal-hero fp-portal-hero--compact">
        <h2 className="fp-portal-hero__title">Yande Mission Center</h2>
        <p className="fp-sub" style={{ margin: "0.5rem 0 0" }}>
          What women are asking for — clubs, cities, complaints, and community health.
        </p>
      </header>

      <div className="fp-yande-health fp-card">
        <span className="fp-yande-health__score">{y.communityHealth.score}</span>
        <div>
          <strong>{y.communityHealth.label}</strong>
          <p className="fp-sub">
            {y.communityHealth.activeWomenPct}% active · {y.communityHealth.clubsThrivingPct}% clubs thriving · safety{" "}
            {y.communityHealth.safetyScore}%
          </p>
        </div>
      </div>

      <section className="fp-card">
        <h3 className="fp-card__title">Most requested clubs & happenings</h3>
        <ul className="fp-rank-list">
          {y.topRequests.map((r) => (
            <li key={r.label}>
              <span>{r.label}</span>
              <span>
                {r.count.toLocaleString()} women <em>{r.trend}</em>
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="fp-card">
        <h3 className="fp-card__title">Cities gaining momentum</h3>
        <ul className="fp-rank-list">
          {y.citiesMomentum.map((c) => (
            <li key={c.city}>
              <span>
                {c.city} · {c.score}
              </span>
              <span>{c.signal}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="fp-card">
        <h3 className="fp-card__title">Common complaints</h3>
        <ul className="fp-rank-list">
          {y.complaints.map((c) => (
            <li key={c.topic}>
              <span>{c.topic}</span>
              <span className={c.severity === "high" ? "fp-tag-danger" : ""}>
                {c.count} reports
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
