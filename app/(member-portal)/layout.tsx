import { BottomNav } from "../components/portal/bottom-nav";
import { MemberSidebar } from "../components/portal/member-sidebar";
import { TimeWrapper } from "../components/portal/time-wrapper";
import { SeasonalOverlay } from "../components/portal/seasonal-overlay";
import { PortalIcons } from "../components/portal/portal-icons";
import { getAuthUser } from "@/lib/auth/get-user";

function roleLabel(role: string): string {
  switch (role) {
    case "founder":     return "Founding Member";
    case "admin":       return "Team";
    case "club_owner":  return "Club Owner";
    case "partner":     return "Partner";
    case "curator":     return "Curator";
    default:            return "Member";
  }
}

export default async function MemberPortalLayout({ children }: { children: React.ReactNode }) {
  const authUser = await getAuthUser();

  const user = {
    name: authUser?.first_name ?? authUser?.full_name ?? "Member",
    initial: (authUser?.first_name?.[0] ?? authUser?.full_name?.[0] ?? "M").toUpperCase(),
    role: roleLabel(authUser?.role ?? "member"),
  };

  return (
    <TimeWrapper>
      <SeasonalOverlay />
      <MemberSidebar user={user} />
      {/* Global top-right icons — visible on all pages */}
      <div className="fixed z-50 flex items-center" style={{ top: "8px", right: "20px" }}>
        <PortalIcons initial={user.initial} />
      </div>
      <div className="md:ml-[180px]">
        <div className="max-w-[430px] mx-auto md:max-w-none">
          {children}
        </div>
      </div>
      <BottomNav user={user} />
    </TimeWrapper>
  );
}
