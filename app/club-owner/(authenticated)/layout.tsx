import { redirect } from "next/navigation";
import { getClubOwnerRole } from "@/lib/auth/get-club-owner-role";
import { canAccessPortal } from "@/lib/auth/roles";
import { ROLE_LOGIN } from "@/lib/product-role-labels";

export default async function ClubOwnerAuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const role = await getClubOwnerRole();
  if (!role || !canAccessPortal(role, "club_owner")) {
    if (role) {
      redirect(`${ROLE_LOGIN.clubMama}?notice=wrong_portal&tried=club_owner`);
    }
    redirect(ROLE_LOGIN.clubMama);
  }
  return <>{children}</>;
}
