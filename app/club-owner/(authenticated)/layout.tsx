import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getClubOwnerRole } from "@/lib/auth/get-club-owner-role";
import { canAccessPortal } from "@/lib/auth/roles";

export default async function ClubOwnerAuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const role = await getClubOwnerRole();
  if (!role) {
    redirect("/member/login?redirect=/club-owner/dashboard");
  }

  if (canAccessPortal(role, "club_owner")) {
    return <>{children}</>;
  }

  // Club ownership also grants portal access (role may still be "member")
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    const { data: club } = await supabase
      .from("clubs")
      .select("id")
      .eq("owner_id", user.id)
      .limit(1)
      .maybeSingle();
    if (club) return <>{children}</>;
  }

  redirect("/member/home?notice=club_mama_required");
}
