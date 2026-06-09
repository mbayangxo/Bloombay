"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/lib/auth/actions";
import { MEMBER_BOTTOM_TABS, shouldHideBottomNav } from "@/lib/member-nav";

interface NavUser {
  name: string;
  initial: string;
  role: string;
}

function TabIcon({ id, active }: { id: string; active: boolean }) {
  const stroke = active ? "#FF1F7D" : "rgba(255,255,255,0.45)";

  if (id === "tonight") {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round">
        <path d="M12 3a6 6 0 016 6c0 4.5-6 12-6 12S6 13.5 6 9a6 6 0 016-6z" />
        <circle cx="12" cy="9" r="2" />
      </svg>
    );
  }
  if (id === "city") {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round">
        <path d="M3 21h18" />
        <path d="M5 21V9l7-4 7 4v12" />
        <path d="M9 21v-6h6v6" />
      </svg>
    );
  }
  if (id === "clubs") {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87" />
        <path d="M16 3.13a4 4 0 010 7.75" />
      </svg>
    );
  }
  if (id === "plans") {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    );
  }
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round">
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <line x1="7" y1="8" x2="17" y2="8" />
      <line x1="7" y1="12" x2="13" y2="12" />
    </svg>
  );
}

export function BottomNav({ user }: { user?: NavUser }) {
  const pathname = usePathname();

  if (shouldHideBottomNav(pathname)) return null;

  return (
    <nav className="bb-bottom-nav lg:hidden" aria-label="Main navigation">
      <div className="bb-bottom-nav__inner">
        {MEMBER_BOTTOM_TABS.map((tab) => {
          const active = tab.match(pathname);
          return (
            <Link
              key={tab.id}
              href={tab.href}
              className={`bb-bottom-nav__tab${active ? " bb-bottom-nav__tab--active" : ""}`}
              aria-current={active ? "page" : undefined}
            >
              <TabIcon id={tab.id} active={active} />
              <span className="bb-bottom-nav__label">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function BottomNavSignout({ user }: { user: NavUser }) {
  return (
    <form action={logout} className="hidden">
      <button type="submit">{user.name}</button>
    </form>
  );
}
