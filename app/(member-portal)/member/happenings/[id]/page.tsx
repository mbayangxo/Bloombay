import { HappeningDetailPage } from "@/app/components/portal/happening-detail-page";

export default async function EventDetailRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <HappeningDetailPage slug={id} />;
}
