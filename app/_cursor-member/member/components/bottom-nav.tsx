"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MEMBER_BOTTOM_TABS } from "@/lib/member-nav";
import { MemberNavIcon } from "./nav-icons";

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="mp-bottom-nav" aria-label="Member navigation">
      {MEMBER_BOTTOM_TABS.map((tab) => {
        const active = tab.match(pathname);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`mp-bottom-nav__tab${active ? " mp-bottom-nav__tab--active" : ""}`}
            aria-current={active ? "page" : undefined}
          >
            <MemberNavIcon id={tab.id} className="mp-bottom-nav__icon" />
            <span className="mp-bottom-nav__label">{tab.short}</span>
          </Link>
        );
      })}
    </nav>
  );
}
