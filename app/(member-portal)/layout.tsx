import { redirect } from "next/navigation";
import { BottomNav } from "../components/portal/bottom-nav";
import { DesktopTopNav } from "../components/portal/desktop-top-nav";
import { MemberDesktopSidebar } from "../components/portal/member-desktop-sidebar";
import { MemberDesktopRightPanel } from "../components/portal/member-desktop-right-panel";
import { TimeWrapper } from "../components/portal/time-wrapper";
import { SeasonalOverlay } from "../components/portal/seasonal-overlay";
import { FeedbackButton } from "../components/portal/feedback-button";
import { PWAInstallPrompt } from "../components/portal/pwa-install-prompt";
import { getAuthUser } from "@/lib/auth/get-user";
import { ThemeProvider } from "@/lib/theme/theme-context";

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
  if (!authUser) redirect("/member/login");

  const user = {
    name: authUser.first_name ?? authUser.full_name ?? "Member",
    initial: (authUser.first_name?.[0] ?? authUser.full_name?.[0] ?? "M").toUpperCase(),
    role: roleLabel(authUser.role ?? "member"),
  };

  return (
    <ThemeProvider>
    <TimeWrapper>
      <SeasonalOverlay />

      {/* ── TABLET only: compact top bar (768–1023px) ── */}
      <DesktopTopNav initial={user.initial} />

      {/* ── DESKTOP only: left sidebar + right panel (1024px+) ── */}
      <MemberDesktopSidebar initial={user.initial} name={user.name} role={user.role} />
      <MemberDesktopRightPanel />

      {/*
        Three distinct breakpoints for content column:

        MOBILE  (<768px)      max-w-[430px] centered, no top/side offset
        TABLET  (768–1023px)  max-w-[640px] centered, offset 60px top for bar
        DESKTOP (1024px+)     left: 240px sidebar · right: 280px panel
                              center column stays phone-width (max-w-[480px]),
                              centered in the remaining space between sidebars.
                              Remaining space at 1024px = 1024-240-280 = 504px.
                              At 1440px = 1440-240-280 = 920px → max-w-[480px] centered.
      */}
      <div
        className={[
          // mobile
          "max-w-[430px] mx-auto",
          // tablet — wider card, offset for top nav
          "md:max-w-[640px] md:mx-auto md:mt-[60px] md:shadow-[0_0_40px_rgba(0,0,0,0.07)]",
          // desktop — fixed margins on both sides (sidebar 240px + right panel 280px)
          // center the content column (max 480px) in the remaining space
          "lg:ml-60 lg:mr-[280px] lg:mt-0 lg:shadow-none lg:flex lg:justify-center",
        ].join(" ")}
        style={{ minHeight: "100dvh" }}
      >
        <div className="lg:w-full lg:max-w-[480px]">
          {children}
        </div>
      </div>

      <BottomNav user={user} />
      <FeedbackButton />
      <PWAInstallPrompt />
    </TimeWrapper>
    </ThemeProvider>
  );
}
