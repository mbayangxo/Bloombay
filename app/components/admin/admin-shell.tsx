"use client";

import { PortalSignOutButton } from "@/app/components/auth/portal-sign-out-button";
import { PortalFooter } from "@/app/components/portal/portal-footer";
import { portalFooterLinks, portalFromStaffBase } from "@/lib/portal-navigation";
import { PortalOnboardingTour } from "@/app/components/portal/portal-onboarding-tour";
import type { PortalOnboardingId } from "@/lib/portal-onboarding/types";
import { portalTourHref } from "@/lib/portal-tour";
import { StaffSidebar } from "./staff-sidebar";
import "@/app/styles/portal-footer.css";

export function AdminShell({
  title,
  subtitle,
  compactHeader,
  staffBase = "/admin",
  staffTitle = "Operations",
  children,
}: {
  title: string;
  subtitle?: string;
  /** Hides duplicate subtitles and tightens top bar on portal pages */
  compactHeader?: boolean;
  staffBase?: "/founder" | "/admin";
  staffTitle?: string;
  children: React.ReactNode;
}) {
  const portal = portalFromStaffBase(staffBase);
  const tourPortal: PortalOnboardingId = staffBase === "/founder" ? "founder" : "admin";

  return (
    <div className="bb-admin-root">
      <PortalOnboardingTour portalId={tourPortal} />
      <div className="bb-admin-scroll">
        <div className="bb-admin-shell">
          <StaffSidebar basePath={staffBase} portalTitle={staffTitle} />
          <div className="bb-admin-main fp-portal-main">
            <header
              className={
                compactHeader
                  ? "bb-admin-topbar bb-admin-topbar--portal-compact"
                  : "bb-admin-topbar"
              }
            >
              <div>
                <h1>{title}</h1>
                {subtitle && !compactHeader ? <p>{subtitle}</p> : null}
              </div>
              <PortalSignOutButton portal={portal} className="bb-admin-logout" />
            </header>
            {children}
            <PortalFooter
              links={portalFooterLinks(staffBase === "/founder" ? "founder" : "admin")}
              tourHref={portalTourHref(tourPortal)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
