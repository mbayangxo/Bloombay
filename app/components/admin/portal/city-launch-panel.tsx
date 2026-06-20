import { CITY_LAUNCHES } from "@/lib/city-launch";
import { BloomScore } from "./bloom-score";

export function CityLaunchPanel() {
  return (
    <section className="fp-card">
      <h3 className="fp-card__title">City launch · Bloom Score</h3>
      <p className="fp-sub">Women · clubs · hosts · partners · safety · activity</p>
      <ul className="fp-city-launch-list">
        {CITY_LAUNCHES.map((c) => (
          <li key={c.city} className="fp-city-launch-row">
            <div>
              <strong>{c.city}</strong>
              <BloomScore score={c.bloomScore} size="sm" />
            </div>
            <div className="fp-city-launch-metrics">
              <span>{c.women.toLocaleString()} women</span>
              <span>{c.clubs} clubs</span>
              <span>{c.hosts} hosts</span>
              <span>{c.partners} partners</span>
              <span>Safety {c.safety}%</span>
              <span>Activity {c.activity}%</span>
            </div>
            <span className={`fp-tag-${c.verdict === "Launch" ? "launch" : "wait"}`}>{c.verdict}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
