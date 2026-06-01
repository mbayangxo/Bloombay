"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BBLogo } from "../portal/bb-logo";

const NAV = [
  { href: "/partner/dashboard", label: "Dashboard", icon: "⬡" },
  { href: "/partner/bookings", label: "Bookings", icon: "◻" },
  { href: "/partner/events", label: "Events", icon: "◇" },
  { href: "/partner/women", label: "Women", icon: "👤" },
  { href: "/partner/analytics", label: "Analytics", icon: "◈" },
  { href: "/partner/promotions", label: "Promotions", icon: "★" },
  { href: "/partner/messages", label: "Messages", icon: "✉", badge: 2 },
  { href: "/partner/payouts", label: "Payouts", icon: "◱" },
  { href: "/partner/settings", label: "Settings", icon: "⊙" },
  { href: "/partner/help", label: "Help Center", icon: "?" },
];

export function PartnerSidebar() {
  const pathname = usePathname();
  return (
    <aside
      className="hidden md:flex fixed left-0 top-0 h-full w-64 flex-col z-40"
      style={{ background: "#111111" }}
    >
      {/* Logo */}
      <div className="px-5 py-6 border-b" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
        <div className="flex items-center gap-2.5 mb-1">
          <BBLogo size={26} light />
          <span className="text-white font-bold text-sm tracking-widest uppercase">
            BLOOM<span style={{ color: "#FF1F7D" }}>BAY</span>
          </span>
        </div>
        <p className="text-xs font-bold tracking-widest mt-2" style={{ color: "#FF1F7D" }}>
          PARTNER PORTAL
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
      </nav>

      {/* User */}
      <div className="px-4 py-4 border-t" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
            style={{ background: "#FF1F7D" }}
          >
            L
          </div>
          <div>
            <p className="text-white text-xs font-semibold">Ladurée SoHo</p>
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>Verified Partner</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
