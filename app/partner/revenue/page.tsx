import { PartnerShell } from "../components/partner-shell";
import { PARTNER_REVENUE } from "@/lib/partner-portal-data";

export default function PartnerRevenuePage() {
  const r = PARTNER_REVENUE;
  return (
    <PartnerShell title="Revenue" sub="Events hosted, women hosted, revenue generated.">
      <div className="pp-stat-grid">
        <div className="pp-stat">
          <strong>{r.eventsHosted}</strong>
          <span>Events hosted</span>
        </div>
        <div className="pp-stat">
          <strong>{r.womenHosted}</strong>
          <span>Women hosted</span>
        </div>
        <div className="pp-stat">
          <strong>${r.revenueGenerated.toLocaleString()}</strong>
          <span>Revenue generated</span>
        </div>
        <div className="pp-stat">
          <strong>{r.monthDelta}</strong>
          <span>vs last month</span>
        </div>
      </div>
    </PartnerShell>
  );
}
