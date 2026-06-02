import { StandaloneEventDetail } from "@/app/components/portal/event-detail";

export default function EventDetailRoute({ params }: { params: { id: string } }) {
  return <StandaloneEventDetail eventId={params.id} />;
}
