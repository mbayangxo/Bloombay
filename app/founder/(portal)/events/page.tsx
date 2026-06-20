import { FounderShell } from "@/app/components/admin/founder-shell";
import { EventsHub } from "@/app/components/events/events-hub";

export default function FounderEventsPage() {
  return (
    <FounderShell
      title="Happenings"
      subtitle="Current, regular, and HQ events — calendars, covers, push live to members."
      compactHeader
    >
      <EventsHub staffBase="/founder" />
    </FounderShell>
  );
}
