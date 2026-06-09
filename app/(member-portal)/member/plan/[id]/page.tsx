import { HappeningPlanRoomLoader } from "@/app/components/portal/happening-plan-room-loader";

export default async function PlanRoomPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <HappeningPlanRoomLoader gatheringId={id} />;
}
