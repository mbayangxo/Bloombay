"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PortalFooter } from "@/app/components/portal/portal-footer";
import { PortalSignOutButton } from "@/app/components/auth/portal-sign-out-button";
import { PortalOnboardingTour } from "@/app/components/portal/portal-onboarding-tour";
import { PARTNER_NAV } from "@/lib/portal-navigation";
import { portalTourHref } from "@/lib/portal-tour";
import "@/app/styles/portal-footer.css";

export function PartnerShell({
  children,
  title,
  sub,
}: {
  children: React.ReactNode;
  title: string;
  sub?: string;
}) {
  const pathname = usePathname();

  return (
    <div className="pp-shell">
      <PortalOnboardingTour portalId="partner" />
      <nav className="pp-nav" aria-label="Partner portal">
        <div className="pp-nav__brand">
          BloomBay
          <span>Partner portal</span>
          <span className="pp-nav__portal-note">Venues only — not Clubhouse</span>
        </div>
        {PARTNER_NAV.map((n) => (
          <Link
            key={n.href}
            href={n.href}
            className={
              pathname === n.href || (n.href !== "/partner" && pathname.startsWith(n.href))
                ? "pp-nav--active"
                : ""
            }
          >
            {n.label}
          </Link>
        ))}
      </nav>
      <main className="pp-main">
        <header className="pp-hero">
          <div className="pp-hero__row">
            <div>
              <h1>{title}</h1>
              {sub ? <p>{sub}</p> : null}
            </div>
            <PortalSignOutButton portal="partner" className="pp-hero__signout" />
          </div>
        </header>
        {children}
        <PortalFooter links={PARTNER_NAV} tourHref={portalTourHref("partner")} />
      </main>
    </div>
  );
}
