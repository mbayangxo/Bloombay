import { FounderShell } from "@/app/components/admin/founder-shell";
import { BlueDayStudio } from "@/app/components/events/blueday-studio";

export default function FounderBlueDayPage() {
  return (
    <FounderShell
      title="Blue Day events"
      subtitle="Platform-wide events for every member — RSVP, QR check-in, analytics."
      compactHeader
    >
      <BlueDayStudio backHref="/founder/events" />
    </FounderShell>
  );
}
