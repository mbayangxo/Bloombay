"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PortalFooter } from "@/app/components/portal/portal-footer";
import { CLUB_OWNER_NAV } from "@/lib/portal-navigation";
import { portalTourHref } from "@/lib/portal-tour";
import { PortalSignOutButton } from "@/app/components/auth/portal-sign-out-button";
import { PortalSpotlightTour } from "@/app/components/portal/portal-spotlight-tour";
import { BloomBayBrand } from "@/app/member/components/bloombay-logo";
import "@/app/styles/portal-footer.css";

// Tour IDs for each bottom-nav item (must match portal-spotlight-tour.tsx selectors)
const NAV_TOUR_IDS: Record<string, string> = {
  "/club-owner/dashboard":     "nav-home",
  "/club-owner/events-studio": "nav-events-studio",
  "/club-owner/gatherings":    "nav-gatherings",
  "/club-owner/members":       "nav-women",
  "/club-owner/applications":  "nav-applications",
  "/club-owner/comms":         "nav-broadcast",
};

export function ClubOwnerShell({
  children,
  title,
  backHref,
}: {
  children: React.ReactNode;
  title?: string;
  backHref?: string;
}) {
  const pathname = usePathname();
  const onDashboard = pathname === "/club-owner/dashboard" || pathname === "/club-owner";

  return (
    <div className="co-app">
      <PortalSpotlightTour portalId="club_owner" />
      <div className="co-main-wrap">
        <header className="co-header">
          <div className="co-header__left">
            {!onDashboard && backHref ? (
              <Link href={backHref} className="co-header__back">
                ← Home
              </Link>
            ) : null}
            <BloomBayBrand height={28} href="/club-owner/dashboard" showText />
            <span className="co-header__portal-tag">Club Mama portal</span>
          </div>
          <div className="co-header__right">
            {title ? <span className="co-header__title">{title}</span> : null}
            <PortalSignOutButton portal="club_owner" className="co-header__signout" />
          </div>
        </header>
        <div className="co-content">{children}</div>
        <nav className="co-bottom-nav" aria-label="Clubhouse portal">
          {CLUB_OWNER_NAV.slice(0, 6).map((item) => {
            const tourId = NAV_TOUR_IDS[item.href];
            return (
              <Link
                key={item.href}
                href={item.href}
                data-tour={tourId}
                className={
                  pathname === item.href || pathname.startsWith(`${item.href}/`)
                    ? "co-bottom-nav--active"
                    : ""
                }
              >
                {item.label === "Applications" ? "Apps" : item.label}
              </Link>
            );
          })}
        </nav>
        <PortalFooter links={CLUB_OWNER_NAV} tourHref={portalTourHref("club_owner")} className="co-portal-footer" />
      </div>
    </div>
  );
}
