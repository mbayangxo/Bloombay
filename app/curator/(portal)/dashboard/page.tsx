import { CuratorShell } from "@/app/components/curator/curator-shell";
import { getAuthUser } from "@/lib/auth/get-user";
import Link from "next/link";

/**
 * Curator dashboard — no fabricated Amanda R. / gathering demo stats.
 * Wire to /api/curator/overview when ready; until then, honest empty.
 */
export default async function CuratorDashboardPage() {
  const user = await getAuthUser();
  return (
    <CuratorShell
      title="Curator"
      subtitle="Live curator metrics aren’t wired yet — this surface stays empty rather than inventing numbers."
    >
      <div className="cu-stat-row">
        <div className="cu-stat">
          <strong>0</strong>
          <span>Women welcomed</span>
        </div>
        <div className="cu-stat">
          <strong>0</strong>
          <span>Gatherings hosted</span>
        </div>
        <div className="cu-stat">
          <strong>0</strong>
          <span>Upcoming</span>
        </div>
      </div>

      <article className="cu-card">
        <h2>Your clubs</h2>
        <p className="cu-note">No clubs assigned in live data yet.</p>
      </article>

      <article className="cu-card">
        <h2>Next gatherings</h2>
        <p className="cu-note">Nothing scheduled yet.</p>
      </article>

      <article className="cu-card">
        <h2>Women to welcome</h2>
        <p className="cu-note">No pending welcomes.</p>
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
