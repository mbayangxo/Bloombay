import { notFound } from "next/navigation";
import { FounderShell } from "@/app/components/admin/founder-shell";
import { ClubCommandCenter } from "@/app/components/events/club-command-center";
import { CLUBS } from "@/app/member/clubs/club-data";

export default async function FounderClubDashboardPage({
  params,
}: {
  params: Promise<{ clubId: string }>;
}) {
  const { clubId } = await params;
  const club = CLUBS.find((c) => c.id === clubId);
  if (!club) notFound();

  return (
    <FounderShell
      title={club.name}
      subtitle="Club dashboard — calendar, planner room, events, members, analytics, archive."
      compactHeader
    >
      <ClubCommandCenter clubId={clubId} staffBase="/founder" defaultTab="overview" />
    </FounderShell>
  );
}
