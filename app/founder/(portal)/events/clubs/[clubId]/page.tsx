import { redirect } from "next/navigation";

export default async function FounderClubEventsPage({
  params,
}: {
  params: Promise<{ clubId: string }>;
}) {
  const { clubId } = await params;
  redirect(`/founder/clubs/${clubId}/dashboard`);
}
