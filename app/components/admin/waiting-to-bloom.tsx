import Link from "next/link";
import { WAITING_TO_BLOOM } from "@/lib/founder-dashboard-metrics";

export function WaitingToBloom() {
  return (
    <article className="bb-admin-card bb-admin-card--accent">
      <h2>Waiting to Bloom</h2>
      <p className="bb-admin-panel-lead">You need to know what women want</p>
      <ul className="bb-admin-waiting">
        {WAITING_TO_BLOOM.map((item) => (
          <li key={item.club}>
            <strong>{item.count}</strong> women waiting for a{" "}
            <span>{item.club}</span>
          </li>
        ))}
      </ul>
      <p className="bb-admin-waiting__cta">
        <Link href="/admin/applications">Review applications →</Link>
      </p>
    </article>
  );
}
