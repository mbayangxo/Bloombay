import { notFound } from "next/navigation";
import { ClubLandingPage } from "@/app/components/portal/club-landing";
import { fetchPortalClubBySlug } from "@/lib/clubs/fetch-clubs";
import { portalClubToLanding } from "@/lib/clubs/to-landing";

export default async function ClubPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: slug } = await params;
  const club = await fetchPortalClubBySlug(slug);
  if (!club) notFound();
  return <ClubLandingPage club={portalClubToLanding(club)} />;
}
