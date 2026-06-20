"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MEMBER_SIDEBAR_NAV } from "@/lib/member-nav";
import { BloomBayLogo } from "./bloombay-logo";
import { MemberSignOutButton } from "./member-sign-out-button";
import { MemberNavIcon, NavIconSettings } from "./nav-icons";

export function MemberSidebar() {
  const pathname = usePathname();

  return (
    <aside className="mp-sidebar mp-sidebar--rail" aria-label="Member navigation">
      <div className="mp-sidebar__brand">
        <BloomBayLogo height={26} variant="pink" href="/member/home" />
      </div>

      <nav className="mp-sidebar__nav">
        {MEMBER_SIDEBAR_NAV.map((item) => {
          const active = item.match(pathname);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`mp-sidebar__link${active ? " mp-sidebar__link--active" : ""}`}
              aria-current={active ? "page" : undefined}
              aria-label={item.label}
              title={item.label}
            >
              <span className="mp-sidebar__link-icon" aria-hidden>
                <MemberNavIcon id={item.id} className="mp-sidebar__svg" />
              </span>
              <span className="mp-sidebar__tip" aria-hidden>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="mp-sidebar__foot">
        <Link
          href="/member/settings"
          className="mp-sidebar__link mp-sidebar__link--sub"
          aria-label="Settings"
          title="Settings"
        >
          <span className="mp-sidebar__link-icon" aria-hidden>
            <NavIconSettings className="mp-sidebar__svg" />
          </span>
          <span className="mp-sidebar__tip" aria-hidden>
            Settings
          </span>
        </Link>
        <MemberSignOutButton variant="sidebar" />
      </div>
    </aside>
  );
}
