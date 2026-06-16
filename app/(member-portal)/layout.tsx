import { BottomNav } from "../components/portal/bottom-nav";
import { DesktopTopNav } from "../components/portal/desktop-top-nav";
import { TimeWrapper } from "../components/portal/time-wrapper";
import { SeasonalOverlay } from "../components/portal/seasonal-overlay";
import { FeedbackButton } from "../components/portal/feedback-button";
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
      <DesktopTopNav initial={user.initial} />
      {/* md:mt-[60px] offsets the fixed desktop top nav */}
      <div className="md:mt-[60px]">
        <div className="max-w-[430px] mx-auto md:max-w-none">
          {children}
        </div>
      </div>
      <BottomNav user={user} />
      <FeedbackButton />
    </TimeWrapper>
  );
}
