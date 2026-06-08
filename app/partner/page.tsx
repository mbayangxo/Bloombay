import { PartnerDashboard } from "./components/partner-dashboard";
import { PartnerShell } from "./components/partner-shell";

export default function PartnerDashboardPage() {
  return (
    <PartnerShell
      title="Partner dashboard"
      sub="Revenue, menu performance, Boom drops, and brand — built to help you sell more."
    >
      <PartnerDashboard />
    </PartnerShell>
  );
}
