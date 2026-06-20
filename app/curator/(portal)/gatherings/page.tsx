import { CuratorShell } from "@/app/components/curator/curator-shell";
import { CURATOR_GATHERINGS } from "@/lib/curator-portal-data";

export default function CuratorGatheringsPage() {
  return (
    <CuratorShell
      title="Gatherings"
      subtitle="Host, welcome, and keep chemistry high — you are culture in the field."
    >
      <div className="cu-stat-row">
        <div className="cu-stat">
          <strong>{CURATOR_GATHERINGS.length}</strong>
          <span>On your calendar</span>
        </div>
        <div className="cu-stat">
          <strong>{CURATOR_GATHERINGS.filter((g) => g.status === "confirmed").length}</strong>
          <span>Confirmed</span>
        </div>
      </div>

      <article className="cu-card">
        <h2>All gatherings</h2>
        <ul className="cu-list">
          {CURATOR_GATHERINGS.map((g) => (
            <li key={g.id} className="cu-list__row">
              <div>
                <strong>{g.title}</strong>
                <p className="cu-note">
                  {g.date} · {g.venue}
                </p>
              </div>
              <div style={{ textAlign: "right" }}>
                <span className={`cu-badge ${g.status === "draft" ? "cu-badge--draft" : ""}`}>
                  {g.status}
                </span>
                <p className="cu-note" style={{ marginTop: "0.35rem" }}>
                  {g.women} women
                </p>
              </div>
            </li>
          ))}
        </ul>
      </article>

      <article className="cu-card">
        <h2>Not Clubhouse</h2>
        <p className="cu-note">
          Club hosts manage tickets & QR in Clubhouse. You curate culture — recruit women, run the room, welcome
          members IRL.
        </p>
      </article>
    </CuratorShell>
  );
}
