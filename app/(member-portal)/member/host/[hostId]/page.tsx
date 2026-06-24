import { HostProfilePage } from "@/app/components/portal/host-profile-page";

export default async function HostProfile({ params }: { params: Promise<{ hostId: string }> }) {
  const { hostId } = await params;
  return <HostProfilePage hostId={hostId} />;
}
