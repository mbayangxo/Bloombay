"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/lib/auth/actions";
import { PinIcon } from "./pin-icon";

const TABS = [
  { href: "/member/home", label: "Home", icon: "home" as const },
  { href: "/member/happenings", label: "Discover", icon: "discover" as const },
  { href: "/member/city", label: "Map", icon: "map" as const },
  { href: "/member/clubs", label: "Clubs", icon: "clubs" as const },
  { href: "/member/lounge", label: "Profile", icon: "profile" as const },
];

interface NavUser {
  name: string;
  initial: string;
  role: string;
}

function TabIcon({ icon, active, initial }: { icon: string; active: boolean; initial?: string }) {
  const stroke = active ? "#FF1F7D" : "rgba(255,255,255,0.45)";

  if (icon === "home") {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round">
        <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
        <path d="M9 21V12h6v9" />
      </svg>
    );
  }
  if (icon === "discover") {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round">
        <circle cx="11" cy="11" r="7" />
        <line x1="16.5" y1="16.5" x2="21" y2="21" />
      </svg>
    );
  }
  if (icon === "map") {
    return <PinIcon size={20} stroke={stroke} />;
  }
  if (icon === "clubs") {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87" />
        <path d="M16 3.13a4 4 0 010 7.75" />
      </svg>
    );
  }
  return (
    <span
      className="bb-bottom-nav__avatar"
      style={{
        background: active ? "#FF1F7D" : "rgba(255,255,255,0.15)",
        color: "#fff",
      }}
    >
      {initial ?? "M"}
    </span>
  );
}

export function BottomNav({ user }: { user?: NavUser }) {
  const pathname = usePathname();

  return (
    <nav className="bb-bottom-nav md:hidden" aria-label="Main navigation">
      <div className="bb-bottom-nav__inner">
        {TABS.map((tab) => {
          const active = pathname === tab.href || pathname.startsWith(`${tab.href}/`);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`bb-bottom-nav__tab${active ? " bb-bottom-nav__tab--active" : ""}`}
              aria-current={active ? "page" : undefined}
            >
              <TabIcon icon={tab.icon} active={active} initial={user?.initial} />
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
