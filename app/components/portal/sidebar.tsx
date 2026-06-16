"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BBLogo } from "./bb-logo";

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
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
    ),
  },
  {
    href: "/member/city",
    label: "The City",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
      </svg>
    ),
  },
  {
    href: "/member/clubs",
    label: "Clubs",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
      </svg>
    ),
  },
  {
    href: "/member/lounge",
    label: "Apartment",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" opacity=".4"/><path d="M7 10h10v10H7z" opacity=".6"/>
      </svg>
    ),
  },
  {
    href: "/member/match",
    label: "Connect",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5a3 3 0 000 6zm-8 0a3 3 0 000-6 3 3 0 000 6zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5C15 14.17 10.33 13 8 13zm8 0c-.29 0-.62.02-.97.05C16.19 13.89 17 15 17 16.5V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
      </svg>
    ),
  },
];

export function Sidebar() {
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
        <button style={{ color: "rgba(255,255,255,0.3)" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
          </svg>
        </button>
      </div>
    </aside>
  );
}
