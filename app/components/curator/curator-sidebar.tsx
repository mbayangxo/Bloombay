"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { BBLogo } from "../portal/bb-logo";
import { logout } from "@/lib/auth/actions";

const NAV = [
  {
    href: "/curator/dashboard",
    label: "My Clubs",
    badge: null,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
      </svg>
    ),
  },
  {
    href: "/curator/dashboard?tab=welcomed",
    label: "Women Welcomed",
    badge: null,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    ),
  },
  {
    href: "/curator/dashboard?tab=gatherings",
    label: "Upcoming Gatherings",
    badge: null,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z" />
      </svg>
    ),
  },
  {
    href: "/curator/dashboard?tab=applications",
    label: "Applications",
    badge: 3,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
      </svg>
    ),
  },
  {
    href: "/curator/dashboard?tab=growth",
    label: "Club Growth",
    badge: null,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
        <polyline points="17 6 23 6 23 12" />
      </svg>
    ),
  },
  {
    href: "/curator/dashboard?tab=impact",
    label: "My Impact",
    badge: null,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
      </svg>
    ),
  },
];

export function CuratorSidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="hidden md:flex fixed left-0 top-0 h-full w-64 flex-col z-40 overflow-y-auto"
      style={{ background: "#111111" }}
    >
      {/* Logo */}
      <div className="px-6 py-6 border-b" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
        <div className="flex items-center gap-3 mb-2">
          <BBLogo size={26} light />
          <span className="text-white font-bold text-sm tracking-widest uppercase">
            BLOOM<span style={{ color: "#FF1F7D" }}>BAY</span>
          </span>
        </div>
        <div
          className="inline-block px-3 py-1 rounded-full text-xs font-bold tracking-widest"
          style={{ background: "rgba(255,31,125,0.18)", color: "#FF1F7D" }}
        >
          CURATOR
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-5 flex flex-col gap-0.5">
        {NAV.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href.split("?")[0] + "/") && !item.href.includes("?");
          const isBase = item.href === "/curator/dashboard" && !item.href.includes("?");
          const finalActive = isBase
            ? pathname === "/curator/dashboard"
            : pathname.startsWith(item.href.split("?")[0]);

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-semibold text-sm"
              style={
                finalActive
                  ? { background: "#FF1F7D", color: "white" }
                  : { color: "rgba(255,255,255,0.55)" }
              }
            >
              <span className="flex-shrink-0">{item.icon}</span>
              <span className="flex-1">{item.label}</span>
              {item.badge !== null && (
                <span
                  className="text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center"
                  style={{
                    background: finalActive ? "rgba(255,255,255,0.3)" : "#FF1F7D",
                    color: "white",
                  }}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Curator badge */}
      <div
        className="mx-3 mb-3 px-4 py-3 rounded-2xl"
        style={{ background: "rgba(255,31,125,0.1)" }}
      >
        <p className="text-xs font-bold tracking-wider" style={{ color: "#FF1F7D" }}>
          CULTURE CURATOR
        </p>
        <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.45)" }}>
          Trust Score: 97
        </p>
      </div>

      {/* User */}
      <div
        className="px-5 py-4 border-t"
        style={{ borderColor: "rgba(255,255,255,0.08)" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
            style={{ background: "#FF1F7D", color: "white" }}
          >
            A
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-semibold text-sm leading-none">Amanda R.</p>
            <p className="text-xs mt-0.5 truncate" style={{ color: "rgba(255,255,255,0.4)" }}>
              Williamsburg · NYC
            </p>
          </div>
        </div>
        <form action={logout} className="mt-2">
          <button type="submit" className="w-full py-2 rounded-xl text-xs font-bold" style={{ background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.4)" }}>
            Log out
          </button>
        </form>
      </div>
    </aside>
  );
}
