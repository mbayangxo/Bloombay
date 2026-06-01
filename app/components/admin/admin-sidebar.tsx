"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BBLogo } from "../portal/bb-logo";

const SECTIONS = [
  {
    title: null,
    items: [
      { href: "/admin/dashboard", label: "Overview", icon: "⬡" },
      { href: "/admin/mission", label: "Mission Control", icon: "✦" },
    ],
  },
  {
    title: "COMMUNITY",
    items: [
      { href: "/admin/women", label: "Women", icon: "👤" },
      { href: "/admin/clubs", label: "Clubs", icon: "◆" },
      { href: "/admin/cities", label: "Cities", icon: "◎" },
      { href: "/admin/members", label: "Members", icon: "◻" },
      { href: "/admin/curators", label: "Curators", icon: "★" },
      { href: "/admin/moderators", label: "Moderators", icon: "◈" },
    ],
  },
  {
    title: "OPERATIONS",
    items: [
      { href: "/admin/happenings", label: "Happenings", icon: "◇" },
      { href: "/admin/safety", label: "Safety", icon: "⬟" },
      { href: "/admin/verification", label: "Verification", icon: "✓", badge: 12 },
      { href: "/admin/bloom-requests", label: "Bloom Requests", icon: "◐" },
      { href: "/admin/mailroom", label: "Mailroom", icon: "✉" },
      { href: "/admin/analytics", label: "Analytics", icon: "◈" },
      { href: "/admin/reports", label: "Reports", icon: "◧" },
    ],
  },
  {
    title: "SYSTEM",
    items: [
      { href: "/admin/settings", label: "Settings", icon: "⊙" },
      { href: "/admin/billing", label: "Billing", icon: "◱" },
    ],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  return (
    <aside
      className="hidden md:flex fixed left-0 top-0 h-full w-64 flex-col z-40 overflow-y-auto"
      style={{ background: "#111111" }}
    >
      {/* Logo */}
      <div className="px-5 py-6 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <div className="flex items-center gap-2.5 mb-1">
          <BBLogo size={26} light />
          <span className="text-white font-bold text-sm tracking-widest uppercase">
            BLOOM<span style={{ color: "#FF1F7D" }}>BAY</span>
          </span>
        </div>
        <p className="text-xs font-bold tracking-widest mt-2" style={{ color: "#FF1F7D" }}>
          FOUNDER PORTAL
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4">
        {SECTIONS.map((section, si) => (
          <div key={si} className="mb-5">
            {section.title && (
              <p
                className="text-[10px] font-bold tracking-widest uppercase px-3 mb-2"
                style={{ color: "rgba(255,255,255,0.28)" }}
              >
                {section.title}
              </p>
            )}
            <div className="flex flex-col gap-0.5">
              {section.items.map((item) => {
                const active = pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-medium"
                    style={
                      active
                        ? { background: "#FF1F7D", color: "white" }
                        : { color: "rgba(255,255,255,0.5)" }
                    }
                  >
                    <span className="text-base w-5 text-center flex-shrink-0">{item.icon}</span>
                    <span className="flex-1">{item.label}</span>
                    {"badge" in item && item.badge && (
                      <span
                        className="text-xs font-bold px-1.5 py-0.5 rounded-full"
                        style={{ background: "#FF1F7D", color: "white" }}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User */}
      <div className="px-4 py-4 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <div className="flex items-center gap-3">
          <div className="relative">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
              style={{ background: "#FF1F7D" }}
            >
              M
            </div>
            <div
              className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full border-2"
              style={{ background: "#FF1F7D", borderColor: "#111" }}
            />
          </div>
          <div>
            <p className="text-white text-xs font-semibold">Maya</p>
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>Founder · CEO</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
