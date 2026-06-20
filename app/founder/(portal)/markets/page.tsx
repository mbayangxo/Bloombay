import { FounderShell } from "@/app/components/admin/founder-shell";
import { MarketsOverview } from "@/app/components/admin/markets-overview";

export default function FounderMarketsPage() {
  return (
    <FounderShell
      title="Markets"
      subtitle="City launch progress, club demand, and partner mix."
      compactHeader
    >
      <div className="fp-page">
        <MarketsOverview />
      </div>
    </FounderShell>
  );
}
