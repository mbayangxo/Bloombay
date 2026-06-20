import { PartnerShell } from "../components/partner-shell";
import { PARTNER_MESSAGES } from "@/lib/partner-portal-data";

export default function PartnerMessagesPage() {
  return (
    <PartnerShell title="Communication" sub="Message BloomBay and club hosts.">
      <div className="pp-card">
        {PARTNER_MESSAGES.map((m) => (
          <div key={m.id} className="pp-list-row">
            <div>
              <strong>
                {m.from}
                {m.unread ? " · new" : ""}
              </strong>
              <br />
              <span style={{ color: "var(--pp-muted)" }}>{m.preview}</span>
            </div>
            <span>{m.date}</span>
          </div>
        ))}
      </div>
    </PartnerShell>
  );
}
