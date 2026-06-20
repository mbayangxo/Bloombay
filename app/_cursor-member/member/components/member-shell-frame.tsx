"use client";

import Link from "next/link";
import { BloomBayBrand } from "./bloombay-logo";
import { MemberSidebar } from "./member-sidebar";
import { MemberHeaderIcons } from "@/app/components/member/member-header-icons";
import { MemberTopBar } from "./member-top-bar";
import { BottomNav } from "./bottom-nav";
import type { MemberShellConfig } from "@/lib/member-shell-options";

export function MemberShellFrame({
  children,
  backHref,
  backLabel = "Back",
  showNav = true,
  flush,
  right,
  wide,
  compactHeader,
  fullWidth,
  hideHeader,
  showHeaderIcons,
}: MemberShellConfig & {
  children: React.ReactNode;
  right?: React.ReactNode;
}) {
  const headerIcons = showHeaderIcons !== false && !hideHeader;

  return (
    <div className="mp-app">
      <div className={`mp-root mp-root--sidebar${wide ? " mp-root--wide" : ""}`}>
        {showNav ? <MemberSidebar /> : null}
        <div className="mp-root__main">
          {!hideHeader ? (
            <header className={`mp-header${compactHeader ? " mp-header--compact" : ""}`}>
              <div className="mp-header__left">
                {backHref ? (
                  <Link href={backHref} className="mp-back">
                    ← {backLabel}
                  </Link>
                ) : (
                  <BloomBayBrand height={30} href="/member/home" className="mp-header__brand-mobile" />
                )}
              </div>
              <div className="mp-header__actions">
                {right}
                {headerIcons ? <MemberHeaderIcons petite={compactHeader} /> : null}
                {!backHref ? (
                  <Link
                    href="/member/settings"
                    className={compactHeader ? "bb-rose-gem bb-rose-gem--settings" : "mp-icon-btn"}
                    aria-label="Settings"
                  >
                    {compactHeader ? <span className="bb-rose-gem__shape" aria-hidden /> : null}
                    <span className={compactHeader ? "bb-rose-gem__icon" : undefined}>
                      <svg
                        width={compactHeader ? 11 : 20}
                        height={compactHeader ? 11 : 20}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        aria-hidden
                      >
                        {!compactHeader ? <circle cx="12" cy="12" r="3" /> : null}
                        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                      </svg>
                    </span>
                  </Link>
                ) : null}
              </div>
            </header>
          ) : (
            <MemberTopBar />
          )}

          <main
            className={
              flush
                ? "mp-main mp-main--flush"
                : hideHeader
                  ? "mp-main mp-main--no-pad"
                  : "mp-main"
            }
          >
            <div className={fullWidth ? "mp-content mp-content--full" : "mp-content mp-member-canvas"}>
              {children}
            </div>
          </main>

          {showNav ? <BottomNav /> : null}
        </div>
      </div>
    </div>
  );
}
