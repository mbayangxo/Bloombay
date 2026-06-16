import { HostProfilePage } from "@/app/components/portal/host-profile-page";

export default function HostProfile({ params }: { params: { hostId: string } }) {
  return <HostProfilePage hostId={params.hostId} />;
}
