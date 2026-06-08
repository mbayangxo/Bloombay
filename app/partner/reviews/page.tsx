import { PartnerShell } from "../components/partner-shell";
import { PARTNER_PROFILE, PARTNER_REVIEWS } from "@/lib/partner-portal-data";

export default function PartnerReviewsPage() {
  return (
    <PartnerShell title="Reviews" sub="Host ratings and venue ratings from members and hosts.">
      <div className="pp-stat-grid">
        <div className="pp-stat">
          <strong>{PARTNER_PROFILE.hostRating}</strong>
          <span>Host rating</span>
        </div>
        <div className="pp-stat">
          <strong>{PARTNER_PROFILE.venueRating}</strong>
          <span>Venue rating</span>
        </div>
      </div>
      {PARTNER_REVIEWS.map((r, i) => (
        <div key={i} className="pp-card">
          <strong>
            {r.author} · {r.role} · {r.rating}★
          </strong>
          <p style={{ margin: "0.5rem 0 0", fontSize: "0.88rem" }}>{r.text}</p>
        </div>
      ))}
    </PartnerShell>
  );
}
