import { FounderShell } from "@/app/components/admin/founder-shell";
import { NightsQueueClient } from "@/app/components/admin/nights-queue-client";

export default function FounderNightsPage() {
  return (
    <FounderShell
      title="Nights queue"
      subtitle="Eventbrite pulls + member Submit a night — approve to publish on Happenings."
      compactHeader
    >
      <NightsQueueClient />
    </FounderShell>
  );
}
