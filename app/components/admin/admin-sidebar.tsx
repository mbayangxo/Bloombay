"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BBLogo } from "../portal/bb-logo";
import { logout } from "@/lib/auth/actions";

// ─── SVG Icons ────────────────────────────────────────────────────────────────

function IconGrid() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
      <rect x="1" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="9" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="1" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="9" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function IconMap() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
      <path d="M8 1C5.79 1 4 2.79 4 5c0 3.25 4 9 4 9s4-5.75 4-9c0-2.21-1.79-4-4-4z" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="8" cy="5" r="1.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function IconUsers() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
      <circle cx="6" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M1 14c0-2.76 2.24-5 5-5s5 2.24 5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M11 7.5c1.38 0 2.5 1.12 2.5 2.5v1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M13.5 4.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function IconStar() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
      <path d="M8 1.5l1.85 3.74 4.15.6-3 2.93.71 4.12L8 10.77l-3.71 1.95.71-4.12L2 5.84l4.15-.6L8 1.5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

function IconHome() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
      <path d="M8 1.5L1.5 7V14.5h4.5v-4h4v4h4.5V7L8 1.5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

function IconDiamond() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
      <path d="M8 1.5L14.5 8 8 14.5 1.5 8 8 1.5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

function IconCalendar() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
      <rect x="1.5" y="3" width="13" height="11.5" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M5 1.5V4M11 1.5V4M1.5 7h13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function IconShield() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
      <path d="M8 1.5L2 4v4c0 3.31 2.67 6.4 6 7 3.33-.6 6-3.69 6-7V4L8 1.5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

function IconMail() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
      <rect x="1.5" y="3.5" width="13" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M1.5 5.5l6.5 4.5 6.5-4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function IconSettings() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 1v2M8 13v2M1 8h2M13 8h2M2.93 2.93l1.41 1.41M11.66 11.66l1.41 1.41M2.93 13.07l1.41-1.41M11.66 4.34l1.41-1.41" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function IconBilling() {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
      <rect x="1.5" y="3.5" width="13" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M1.5 7h13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

// ─── Nav config ───────────────────────────────────────────────────────────────

const SECTIONS = [
  {
    title: null,
    items: [
      { href: "/admin/dashboard", label: "Mission Control", Icon: IconGrid },
    ],
  },
  {
    title: "COMMUNITY",
    items: [
      { href: "/admin/cities", label: "Cities", Icon: IconMap },
      { href: "/admin/women", label: "Women", Icon: IconUsers },
      { href: "/admin/curators", label: "Curators", Icon: IconStar },
      { href: "/admin/hosts", label: "Hosts", Icon: IconHome },
      { href: "/admin/clubs", label: "Clubs", Icon: IconDiamond },
    ],
  },
  {
    title: "OPERATIONS",
    items: [
      { href: "/admin/open-seats", label: "Open Seats", Icon: IconCalendar },
      { href: "/admin/safety", label: "Safety Center", Icon: IconShield, badge: 6 },
      { href: "/admin/mailroom", label: "Mailroom", Icon: IconMail, badge: 35 },
    ],
  },
  {
    title: "SYSTEM",
    items: [
      { href: "/admin/settings", label: "Settings", Icon: IconSettings },
      { href: "/admin/billing", label: "Billing", Icon: IconBilling },
    ],
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="hidden md:flex fixed left-0 top-0 h-full w-64 flex-col z-40 overflow-y-auto"
      style={{ background: "#111111", borderRight: "1px solid rgba(255,255,255,0.06)" }}
    >
      {/* Logo area */}
      <div className="px-5 py-7 border-b" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #FF1F7D, #FF69B4)" }}
          >
            <BBLogo size={22} light />
          </div>
          <div>
            <span className="text-white font-bold text-base tracking-widest uppercase block">
              BLOOM<span style={{ color: "#FF1F7D" }}>BAY</span>
            </span>
            <span className="text-[9px] font-semibold tracking-wider" style={{ color: "rgba(255,255,255,0.35)" }}>
              Community Platform
            </span>
          </div>
        </div>
        <div
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold tracking-widest"
          style={{ background: "rgba(255,31,125,0.15)", color: "#FF1F7D", border: "1px solid rgba(255,31,125,0.25)" }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full animate-pulse"
            style={{ background: "#FF1F7D" }}
          />
          FOUNDER PORTAL
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4">
        {SECTIONS.map((section, si) => (
          <div key={si} className="mb-6">
            {section.title && (
              <p
                className="text-[10px] font-bold tracking-widest uppercase px-3 mb-2"
                style={{ color: "rgba(255,255,255,0.2)" }}
              >
                {section.title}
              </p>
            )}
            <div className="flex flex-col gap-0.5">
              {section.items.map((item) => {
                const active =
                  pathname === item.href || pathname.startsWith(item.href + "/");
                const { Icon } = item;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-2xl transition-all text-sm font-medium"
                    style={
                      active
                        ? { background: "#FF1F7D", color: "white" }
                        : { color: "rgba(255,255,255,0.45)" }
                    }
                    onMouseEnter={(e) => {
                      if (!active) {
                        e.currentTarget.style.background = "rgba(255,31,125,0.1)";
                        e.currentTarget.style.color = "rgba(255,255,255,0.8)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!active) {
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.color = "rgba(255,255,255,0.45)";
                      }
                    }}
                  >
                    <span
                      className="w-4 flex-shrink-0 flex items-center justify-center"
                      style={{ color: active ? "white" : "rgba(255,255,255,0.4)" }}
                    >
                      <Icon />
                    </span>
                    <span className="flex-1">{item.label}</span>
                    {"badge" in item && item.badge != null && (
                      <span
                        className="text-xs font-bold px-1.5 py-0.5 rounded-full leading-none"
                        style={
                          active
                            ? { background: "rgba(255,255,255,0.25)", color: "white" }
                            : { background: "#FF1F7D", color: "white" }
                        }
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

      {/* User section */}
      <div className="px-4 py-5 border-t" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
        <div className="flex items-center gap-3 mb-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #FF1F7D, #FF69B4)", boxShadow: "0 0 0 2px rgba(255,31,125,0.3)" }}
          >
            M
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-semibold leading-none">Maya</p>
            <p className="text-xs mt-0.5 truncate" style={{ color: "rgba(255,255,255,0.35)" }}>Founder · CEO</p>
          </div>
          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: "#FF1F7D" }} />
        </div>
        <form action={logout}>
          <button
            type="submit"
            className="w-full py-2 rounded-xl text-xs font-bold transition-all"
            style={{ background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.4)" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,31,125,0.15)";
              e.currentTarget.style.color = "#FF1F7D";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.07)";
              e.currentTarget.style.color = "rgba(255,255,255,0.4)";
            }}
          >
            Log out
          </button>
        </form>
      </div>
    </aside>
  );
}
