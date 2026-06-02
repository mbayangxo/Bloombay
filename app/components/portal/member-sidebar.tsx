"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BBLogo } from "./bb-logo";
import { logout } from "@/lib/auth/actions";

const NAV = [
  {
    href: "/member/home",
    label: "Home",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
      </svg>
    ),
  },
  {
    href: "/member/happenings",
    label: "Happenings",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z" />
      </svg>
    ),
  },
  {
    href: "/member/explore",
    label: "Explore",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5.5-2.5l7-3 3-7-7 3-3 7zm5.5-4c-.83 0-1.5-.67-1.5-1.5S11.17 10.5 12 10.5s1.5.67 1.5 1.5S12.83 13.5 12 13.5z"/>
      </svg>
    ),
  },
  {
    href: "/member/clubs",
    label: "Girl Clubs",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
      </svg>
    ),
  },
  {
    href: "/member/room",
    label: "The Lobby",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" />
      </svg>
    ),
  },
  {
    href: "/member/match",
    label: "Connect",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z" />
      </svg>
    ),
  },
  {
    href: "/member/lounge",
    label: "Lounge",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
      </svg>
    ),
  },
];

export function MemberSidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="hidden md:flex fixed left-0 top-0 h-full w-60 flex-col z-40"
      style={{ background: "#111111" }}
    >
      {/* Logo */}
      <div className="px-6 py-7 border-b" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
        <div className="flex items-center gap-3 mb-1">
          <BBLogo size={28} light />
        </div>
        <p className="text-white font-bold tracking-widest text-sm uppercase mt-2">
          BLOOM<span style={{ color: "#FF1F7D" }}>BAY</span>
        </p>
        <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>
          Founding Members · NYC
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-5 flex flex-col gap-1">
        {NAV.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-semibold text-sm"
              style={
                active
                  ? { background: "#FF1F7D", color: "white" }
                  : { color: "rgba(255,255,255,0.55)" }
              }
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Founding badge */}
      <div className="px-4 py-3 mx-3 mb-2 rounded-2xl" style={{ background: "rgba(255,31,125,0.12)" }}>
        <p className="text-xs font-bold" style={{ color: "#FF1F7D" }}>FOUNDING MOTHER</p>
        <p className="text-white text-xs mt-0.5 opacity-60">1 of 100 · NYC</p>
      </div>

      {/* User */}
      <div className="px-5 py-5 border-t flex items-center gap-3" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
          style={{ background: "#FF1F7D", color: "white" }}
        >
          M
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white font-semibold text-sm leading-none">Maya L.</p>
          <p className="text-xs mt-0.5 truncate" style={{ color: "rgba(255,255,255,0.4)" }}>Brooklyn · NYC</p>
        </div>
        <Link href="/member/lounge" style={{ color: "rgba(255,255,255,0.3)" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
          </svg>
        </Link>
        <form action={logout}>
          <button type="submit" title="Sign out" style={{ color: "rgba(255,255,255,0.3)" }} className="hover:text-white/60 transition-colors">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
            </svg>
          </button>
        </form>
      </div>
    </aside>
  );
}
