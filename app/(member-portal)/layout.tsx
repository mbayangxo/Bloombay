import { BottomNav } from "../components/portal/bottom-nav";
import { MemberSidebar } from "../components/portal/member-sidebar";
import { TimeWrapper } from "../components/portal/time-wrapper";
import { SeasonalOverlay } from "../components/portal/seasonal-overlay";
import { PortalFixedIcons } from "../components/portal/portal-fixed-icons";
import { PortalScrollUnlock } from "../components/portal/portal-scroll-unlock";
import { getAuthUser } from "@/lib/auth/get-user";
import "@/app/styles/portal-scroll.css";
import "@/app/styles/bb-home-scrapbook.css";
import "@/app/styles/bb-home-mockup.css";
import "@/app/styles/bb-home-mockup-mobile.css";
import "@/app/styles/bb-home-mockup-desktop.css";
import "@/app/styles/bb-poster-templates.css";
import "@/app/styles/bb-member-polish.css";

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
    <div data-bb-member-portal>
      <PortalScrollUnlock />
      <TimeWrapper>
        <SeasonalOverlay />
        <MemberSidebar user={user} />
        <PortalFixedIcons initial={user.initial} />
        <div className="md:ml-[160px]">
          <div className="max-w-none w-full">
            {children}
          </div>
        </div>
        <BottomNav user={user} />
      </TimeWrapper>
    </div>
  );
}
