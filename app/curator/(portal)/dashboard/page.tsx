import { CuratorShell } from "@/app/components/curator/curator-shell";
import { getAuthUser } from "@/lib/auth/get-user";
import { getCuratorOverview } from "@/lib/curator/overview";
import Link from "next/link";

/**
 * Curator dashboard — no fabricated Amanda R. / gathering demo stats.
 * Wired to the real clubs/memberships/applications/gatherings data.
 */
export default async function CuratorDashboardPage() {
  const [user, data] = await Promise.all([getAuthUser(), getCuratorOverview()]);

  const welcomedCount = data?.stats.total_members ?? 0;
  const gatheringsCount = data?.stats.upcoming_gatherings ?? 0;
  const pendingCount = data?.stats.pending_applications ?? 0;
  const clubs = data?.clubs ?? [];
  const gatherings = data?.gatherings ?? [];
  const applications = data?.applications ?? [];

  return (
    <CuratorShell
      title="Curator"
      subtitle={data ? "Real clubs, gatherings, and welcomes — no invented numbers." : "Live curator metrics aren’t wired yet — this surface stays empty rather than inventing numbers."}
    >
      <div className="cu-stat-row">
        <div className="cu-stat">
          <strong>{welcomedCount}</strong>
          <span>Women welcomed</span>
        </div>
        <div className="cu-stat">
          <strong>{gatheringsCount}</strong>
          <span>Gatherings upcoming</span>
        </div>
        <div className="cu-stat">
          <strong>{pendingCount}</strong>
          <span>Pending welcomes</span>
        </div>
      </div>

      <article className="cu-card">
        <h2>Your clubs</h2>
        {clubs.length === 0 ? (
          <p className="cu-note">No clubs assigned in live data yet.</p>
        ) : (
          <ul className="cu-list">
            {clubs.map((c) => (
              <li key={c.id} className="cu-list__row">
                <strong>{c.name}</strong>
                <span className="cu-note">{c.members} members</span>
              </li>
            ))}
          </ul>
        )}
      </article>

      <article className="cu-card">
        <h2>Next gatherings</h2>
        {gatherings.length === 0 ? (
          <p className="cu-note">Nothing scheduled yet.</p>
        ) : (
          <ul className="cu-list">
            {gatherings.slice(0, 5).map((g) => (
              <li key={g.id} className="cu-list__row">
                <strong>{g.name}</strong>
                <span className="cu-note">{g.date}</span>
              </li>
            ))}
          </ul>
        )}
        <Link href="/curator/gatherings" className="cu-link">
          Open gatherings →
        </Link>
      </article>

      <article className="cu-card">
        <h2>Women to welcome</h2>
        {applications.length === 0 ? (
          <p className="cu-note">No pending welcomes.</p>
        ) : (
          <ul className="cu-list">
            {applications.slice(0, 5).map((a) => (
              <li key={a.id} className="cu-list__row">
                <strong>{a.name}</strong>
                <span className="cu-note">{a.club}</span>
              </li>
            ))}
          </ul>
        )}
        <Link href="/curator/women" className="cu-link">
          Open women →
        </Link>
      </article>

      {user?.email ? (
        <p className="cu-note" style={{ marginTop: 16 }}>
          Signed in as {user.email}
        </p>
      ) : null}
    </CuratorShell>
  );
}
