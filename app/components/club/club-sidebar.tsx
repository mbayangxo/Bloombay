"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BBLogo } from "../portal/bb-logo";
import { logout } from "@/lib/auth/actions";

const NAV = [
  { href: "/club-owner/dashboard", label: "Dashboard", icon: "⬡" },
  { href: "/club-owner/clubhouse", label: "Club Home", icon: "◆" },
  { href: "/club-owner/women", label: "Women", icon: "👤" },
  { href: "/club-owner/seats", label: "Open Seats", icon: "◻" },
  { href: "/club-owner/happenings", label: "Happenings", icon: "◇" },
  { href: "/club-owner/requests", label: "Requests", icon: "◐", badge: 3 },
  { href: "/club-owner/finances", label: "Finances", icon: "◱" },
  { href: "/club-owner/analytics", label: "Analytics", icon: "◈" },
  { href: "/club-owner/promote", label: "Promote", icon: "★" },
  { href: "/club-owner/settings", label: "Settings", icon: "⊙" },
  { href: "/club-owner/help", label: "Help Center", icon: "?" },
];

export function ClubSidebar() {
  const pathname = usePathname();
  return (
    <aside
      className="hidden md:flex fixed left-0 top-0 h-full w-64 flex-col z-40"
      style={{ background: "#FF1F7D" }}
    >
      {/* Logo */}
      <div className="px-5 py-6 border-b" style={{ borderColor: "rgba(255,255,255,0.18)" }}>
        <div className="flex items-center gap-2.5 mb-1">
          <BBLogo size={26} light />
          <span className="text-white font-bold text-sm tracking-widest uppercase">
            BLOOMBAY
          </span>
        </div>
        <p className="text-xs font-bold tracking-widest mt-2" style={{ color: "rgba(255,255,255,0.7)" }}>
          CLUB OWNER PORTAL
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5">
        {NAV.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-medium"
              style={
                active
                  ? { background: "rgba(0,0,0,0.2)", color: "white" }
                  : { color: "rgba(255,255,255,0.75)" }
              }
            >
              <span className="text-base w-5 text-center flex-shrink-0">{item.icon}</span>
              <span className="flex-1">{item.label}</span>
              {"badge" in item && item.badge && (
                <span
                  className="text-xs font-bold px-1.5 py-0.5 rounded-full"
                  style={{ background: "rgba(0,0,0,0.2)", color: "white" }}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="px-4 py-4 border-t" style={{ borderColor: "rgba(255,255,255,0.18)" }}>
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
            style={{ background: "rgba(255,255,255,0.25)", color: "white" }}
          >
            L
          </div>
          <div>
            <p className="text-white text-xs font-semibold">Leila K.</p>
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.6)" }}>Club Owner</p>
          </div>
        </div>
        <form action={logout} className="mt-2">
          <button type="submit" className="w-full py-2 rounded-xl text-xs font-bold" style={{ background: "rgba(0,0,0,0.15)", color: "rgba(255,255,255,0.7)" }}>
            Log out
          </button>
        </form>
      </div>
    </aside>
  );
}
