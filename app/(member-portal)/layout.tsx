import { redirect } from "next/navigation";
import { BottomNav } from "../components/portal/bottom-nav";
import { DesktopTopNav } from "../components/portal/desktop-top-nav";
import { MemberDesktopSidebar } from "../components/portal/member-desktop-sidebar";
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
  if (!authUser) redirect("/member/login");

  const user = {
    name: authUser.first_name ?? authUser.full_name ?? "Member",
    initial: (authUser.first_name?.[0] ?? authUser.full_name?.[0] ?? "M").toUpperCase(),
    role: roleLabel(authUser.role ?? "member"),
  };

  return (
    <TimeWrapper>
      <SeasonalOverlay />

      {/* ── TABLET only: top bar (768–1023px) ── */}
      <DesktopTopNav initial={user.initial} />

      {/* ── DESKTOP only: left sidebar (1024px+) ── */}
      <MemberDesktopSidebar
        initial={user.initial}
        name={user.name}
        role={user.role}
      />

      {/*
        Content wrapper — three distinct breakpoints:
          mobile  (<768px) : max-w-[430px] centered, no top offset
          tablet  (768–1023px): max-w-[640px] centered, 60px top offset for top bar
          desktop (1024px+): full-width, 240px left offset for sidebar, no top bar
      */}
      {/*
        Tablet gets a card shadow to make the centered column feel intentional.
        Desktop gets no shadow — the sidebar is the structural anchor.
      */}
      <div
        className={[
          // mobile
          "max-w-[430px] mx-auto",
          // tablet: centered card with shadow
          "md:max-w-[640px] md:mx-auto md:mt-[60px] md:shadow-[0_0_40px_rgba(0,0,0,0.08)]",
          // desktop: sidebar is 240px = Tailwind ml-60
          "lg:max-w-none lg:mx-0 lg:ml-60 lg:mt-0 lg:shadow-none",
        ].join(" ")}
        style={{ minHeight: "100dvh" }}
      >
        {children}
      </div>

      <BottomNav user={user} />
      <FeedbackButton />
    </TimeWrapper>
  );
}
