"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PortalSignOutButton } from "@/app/components/auth/portal-sign-out-button";
import { PortalFooter } from "@/app/components/portal/portal-footer";
import { CURATOR_NAV } from "@/lib/portal-navigation";
import { portalTourHref } from "@/lib/portal-tour";
import { PortalOnboardingTour } from "@/app/components/portal/portal-onboarding-tour";
import { CURATOR_PROFILE } from "@/lib/curator-portal-data";
import "@/app/styles/portal-footer.css";

export function CuratorShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="cu-app">
      <PortalOnboardingTour portalId="curator" />
      <aside className="cu-sidebar" aria-label="Curator portal">
        <div className="cu-sidebar__brand">
          <Image
            src="/logosbloombay/Vector-1.svg"
            alt=""
            width={24}
            height={40}
            style={{ filter: "brightness(0) invert(1)" }}
          />
          <div>
            <strong>BloomBay</strong>
            <span>Curator portal</span>
          </div>
        </div>
        <nav className="cu-sidebar__nav">
          {CURATOR_NAV.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={
                pathname === n.href || pathname.startsWith(`${n.href}/`)
                  ? "cu-sidebar__link cu-sidebar__link--active"
                  : "cu-sidebar__link"
              }
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <p className="cu-sidebar__who">
          {CURATOR_PROFILE.name} · {CURATOR_PROFILE.neighborhood}
        </p>
      </aside>
      <div className="cu-app__main">
        <header className="cu-topbar">
          <div>
            <h1>{title}</h1>
            {subtitle ? <p>{subtitle}</p> : null}
          </div>
          <PortalSignOutButton portal="curator" className="cu-topbar__out" />
        </header>
        <div className="cu-content">{children}</div>
        <PortalFooter links={CURATOR_NAV} tourHref={portalTourHref("curator")} />
      </div>
    </div>
  );
}
