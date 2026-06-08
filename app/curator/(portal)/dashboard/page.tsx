import { CuratorShell } from "@/app/components/curator/curator-shell";
import {
  CURATOR_GATHERINGS,
  CURATOR_PROFILE,
  CURATOR_STATS,
  CURATOR_WOMEN,
} from "@/lib/curator-portal-data";
import Link from "next/link";

export default function CuratorDashboardPage() {
  const firstName = CURATOR_PROFILE.name.split(" ")[0];
  const upcoming = CURATOR_GATHERINGS.filter((g) => g.status === "confirmed");

  return (
    <CuratorShell
      title={`Hi, ${firstName}`}
      subtitle={`${CURATOR_PROFILE.city} · ${CURATOR_PROFILE.status} · Assigned by founders from Mission Control`}
    >
      <div className="cu-stat-row">
        <div className="cu-stat">
          <strong>{CURATOR_STATS.womenWelcomed}</strong>
          <span>Women welcomed</span>
        </div>
        <div className="cu-stat">
          <strong>{CURATOR_STATS.gatheringsHosted}</strong>
          <span>Gatherings hosted</span>
        </div>
        <div className="cu-stat">
          <strong>{CURATOR_STATS.eventsScheduled}</strong>
          <span>Upcoming</span>
        </div>
      </div>

      <article className="cu-card">
        <h2>Your clubs</h2>
        <p className="cu-note">{CURATOR_PROFILE.clubs.join(" · ")}</p>
      </article>

      <article className="cu-card">
        <h2>Next gatherings</h2>
        <ul className="cu-list">
          {upcoming.map((g) => (
            <li key={g.id} className="cu-list__row">
              <div>
                <strong>{g.title}</strong>
                <p className="cu-note">
                  {g.date} · {g.venue}
                </p>
              </div>
              <span className="cu-badge">{g.women} women</span>
            </li>
          ))}
        </ul>
        <p className="cu-note" style={{ marginTop: "0.75rem" }}>
          <Link href="/curator/gatherings" style={{ color: "var(--cu-hot)", fontWeight: 600 }}>
            All gatherings →
          </Link>
        </p>
      </article>

      <article className="cu-card">
        <h2>Women to welcome</h2>
        <ul className="cu-list">
          {CURATOR_WOMEN.filter((w) => w.status !== "welcomed")
            .slice(0, 3)
            .map((w) => (
              <li key={w.id} className="cu-list__row">
                <div>
                  <strong>{w.name}</strong>
                  <p className="cu-note">{w.note}</p>
                </div>
                <span className={`cu-badge cu-badge--${w.status}`}>{w.status}</span>
              </li>
            ))}
        </ul>
        <p className="cu-note" style={{ marginTop: "0.75rem" }}>
          <Link href="/curator/women" style={{ color: "var(--cu-hot)", fontWeight: 600 }}>
            Full roster →
          </Link>
        </p>
      </article>
    </CuratorShell>
  );
}
