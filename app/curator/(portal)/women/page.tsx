import { CuratorShell } from "@/app/components/curator/curator-shell";
import { CURATOR_WOMEN } from "@/lib/curator-portal-data";

export default function CuratorWomenPage() {
  return (
    <CuratorShell
      title="Women"
      subtitle="Welcome, recruit, and shepherd — every woman should feel claimed by the community."
    >
      <div className="cu-stat-row">
        <div className="cu-stat">
          <strong>{CURATOR_WOMEN.filter((w) => w.status === "welcomed").length}</strong>
          <span>Welcomed</span>
        </div>
        <div className="cu-stat">
          <strong>{CURATOR_WOMEN.filter((w) => w.status !== "welcomed").length}</strong>
          <span>In progress</span>
        </div>
      </div>

      <article className="cu-card">
        <h2>Your roster</h2>
        <ul className="cu-list">
          {CURATOR_WOMEN.map((w) => (
            <li key={w.id} className="cu-list__row">
              <div>
                <strong>{w.name}</strong>
                <p className="cu-note">
                  {w.club} · {w.note}
                </p>
              </div>
              <span
                className={`cu-badge ${w.status === "welcomed" ? "cu-badge--welcomed" : w.status === "draft" ? "cu-badge--draft" : ""}`}
              >
                {w.status}
              </span>
            </li>
          ))}
        </ul>
      </article>
    </CuratorShell>
  );
}
