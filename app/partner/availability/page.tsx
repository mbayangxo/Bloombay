import { PartnerShell } from "../components/partner-shell";
import { PARTNER_AVAILABILITY } from "@/lib/partner-portal-data";

export default function PartnerAvailabilityPage() {
  return (
    <PartnerShell title="Availability" sub="Dates and times BloomBay can book your space.">
      <div className="pp-avail-grid">
        {PARTNER_AVAILABILITY.map((d) => (
          <div key={d.day} className="pp-avail-day">
            <strong>{d.day}</strong>
            {d.slots.length ? d.slots.join(", ") : "Closed"}
          </div>
        ))}
      </div>
    </PartnerShell>
  );
}
