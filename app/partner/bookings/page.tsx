import { PartnerShell } from "../components/partner-shell";
import { PARTNER_BOOKINGS_PAST, PARTNER_BOOKINGS_UPCOMING } from "@/lib/partner-portal-data";

export default function PartnerBookingsPage() {
  return (
    <PartnerShell title="Bookings" sub="Upcoming BloomBay bookings and past events.">
      <div className="pp-card">
        <h2>Upcoming</h2>
        {PARTNER_BOOKINGS_UPCOMING.map((b) => (
          <div key={b.id} className="pp-list-row">
            <div>
              <strong>{b.event}</strong>
              <br />
              <span style={{ color: "var(--pp-muted)" }}>
                {b.date} · {b.host} · {b.women} women
              </span>
            </div>
            <span>{b.status}</span>
          </div>
        ))}
      </div>
      <div className="pp-card">
        <h2>Past</h2>
        {PARTNER_BOOKINGS_PAST.map((b) => (
          <div key={b.id} className="pp-list-row">
            <div>
              <strong>{b.event}</strong>
              <br />
              <span style={{ color: "var(--pp-muted)" }}>
                {b.date} · {b.women} women
              </span>
            </div>
            <span>${b.revenue}</span>
          </div>
        ))}
      </div>
    </PartnerShell>
  );
}
