import { PlanRoomPage } from "@/app/components/portal/plan-room-page";

export default async function PlanRoomRoute({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <PlanRoomPage gatheringId={id} />;
}
