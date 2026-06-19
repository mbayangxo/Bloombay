"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BBLogo } from "../portal/bb-logo";
import { MobilePortalNav } from "../portal/mobile-portal-nav";
import { logout } from "@/lib/auth/actions";

function IconGrid() { return <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><rect x="1" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" /><rect x="9" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" /><rect x="1" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" /><rect x="9" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" /></svg>; }
function IconCalendar() { return <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><rect x="1.5" y="3" width="13" height="11.5" rx="1.5" stroke="currentColor" strokeWidth="1.5" /><path d="M5 1.5V4M11 1.5V4M1.5 7h13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>; }
function IconStar() { return <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M8 1.5l1.85 3.74 4.15.6-3 2.93.71 4.12L8 10.77l-3.71 1.95.71-4.12L2 5.84l4.15-.6L8 1.5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /></svg>; }
function IconUsers() { return <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><circle cx="6" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.5" /><path d="M1 14c0-2.76 2.24-5 5-5s5 2.24 5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /><path d="M11 7.5c1.38 0 2.5 1.12 2.5 2.5v1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>; }
function IconBarChart() { return <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><rect x="1" y="9" width="3" height="5" rx="0.5" stroke="currentColor" strokeWidth="1.5" /><rect x="6" y="5" width="3" height="9" rx="0.5" stroke="currentColor" strokeWidth="1.5" /><rect x="11" y="2" width="3" height="12" rx="0.5" stroke="currentColor" strokeWidth="1.5" /></svg>; }
function IconMegaphone() { return <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M12 1.5v13M12 3.5L3 6v4l9 2.5M5.5 10V14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>; }
function IconInbox() { return <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><polyline points="1.5 7 5.5 7 6.5 9 9.5 9 10.5 7 14.5 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M3.4 3.6L1.5 7v5.5a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1V7l-1.9-3.4A1 1 0 0 0 11.7 3H4.3a1 1 0 0 0-.9.6z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>; }
function IconDollar() { return <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><path d="M8 1v14M5 4.5h4.5a2.5 2.5 0 0 1 0 5H6a2.5 2.5 0 0 0 0 5H11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>; }
function IconSettings() { return <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.5" /><path d="M8 1v2M8 13v2M1 8h2M13 8h2M2.93 2.93l1.41 1.41M11.66 11.66l1.41 1.41M2.93 13.07l1.41-1.41M11.66 4.34l1.41-1.41" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>; }
function IconHelp() { return <svg width="15" height="15" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5" /><path d="M6 6.5a2 2 0 0 1 4 0c0 1.5-2 1.5-2 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /><circle cx="8" cy="12" r="0.75" fill="currentColor" /></svg>; }

const NAV = [
  { href: "/partner/dashboard",  label: "Dashboard",   Icon: IconGrid      },
  { href: "/partner/bookings",   label: "Bookings",    Icon: IconCalendar  },
  { href: "/partner/events",     label: "Events",      Icon: IconStar      },
  { href: "/partner/women",      label: "Women",       Icon: IconUsers     },
  { href: "/partner/analytics",  label: "Analytics",   Icon: IconBarChart  },
  { href: "/partner/promotions", label: "Promotions",  Icon: IconMegaphone },
  { href: "/partner/messages",   label: "Messages",    Icon: IconInbox,    badge: 2 },
  { href: "/partner/payouts",    label: "Payouts",     Icon: IconDollar    },
  { href: "/partner/settings",   label: "Settings",    Icon: IconSettings  },
  { href: "/partner/help",       label: "Help Center", Icon: IconHelp      },
];

export function PartnerSidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* ── MOBILE ── */}
      <MobilePortalNav
        portalLabel="Partner Portal"
        theme="light"
        items={NAV.map(i => ({ href: i.href, label: i.label, icon: <i.Icon />, badge: "badge" in i ? i.badge as number : undefined }))}
        userInitial="L"
        userName="Ladurée SoHo"
        userRole="Verified Partner"
      />

      {/* ── TABLET: icon-only (md → lg) ── */}
      <aside
        className="hidden md:flex lg:hidden fixed left-0 top-0 h-full flex-col z-40 items-center py-4 gap-1"
        style={{ width: 64, background: "white", borderRight: "1px solid rgba(0,0,0,0.08)" }}
      >
        <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-4 flex-shrink-0" style={{ background: "#111111" }}>
          <BBLogo size={18} light />
        </div>
        {NAV.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          const { Icon } = item;
          return (
            <Link key={item.href} href={item.href} title={item.label}
              className="w-10 h-10 rounded-xl flex items-center justify-center relative flex-shrink-0"
              style={active ? { background: "#FF1F7D", color: "white" } : { color: "rgba(17,17,17,0.4)" }}
            >
              <Icon />
              {"badge" in item && item.badge != null && (
                <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full text-[8px] font-bold flex items-center justify-center"
                  style={{ background: "#FF1F7D", color: "white" }}>
                  {item.badge > 9 ? "9+" : item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </aside>

      {/* ── DESKTOP: full sidebar (lg+) ── */}
      <aside
        className="hidden lg:flex fixed left-0 top-0 h-full w-64 flex-col z-40 overflow-y-auto"
        style={{ background: "white", borderRight: "1px solid rgba(0,0,0,0.08)" }}
      >
        <div className="px-5 py-6 border-b" style={{ borderColor: "rgba(0,0,0,0.07)" }}>
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "#111111" }}>
              <BBLogo size={20} light />
            </div>
            <span className="font-bold text-base tracking-widest uppercase" style={{ color: "#111111" }}>BLOOM<span style={{ color: "#FF1F7D" }}>BAY</span></span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold tracking-widest"
            style={{ background: "#111111", color: "#FF1F7D", border: "1px solid rgba(255,31,125,0.25)" }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#FF1F7D" }} />
            VERIFIED PARTNER
          </div>
        </div>
        <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5">
          {NAV.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            const { Icon } = item;
            return (
              <Link key={item.href} href={item.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-2xl transition-all text-sm font-medium"
                style={active ? { background: "#FF1F7D", color: "white" } : { color: "rgba(17,17,17,0.55)" }}
                onMouseEnter={e => { if (!active) { e.currentTarget.style.background = "rgba(255,31,125,0.07)"; e.currentTarget.style.color = "#FF1F7D"; } }}
                onMouseLeave={e => { if (!active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(17,17,17,0.55)"; } }}
              >
                <span className="w-4 flex-shrink-0 flex items-center justify-center" style={{ color: active ? "white" : "rgba(17,17,17,0.4)" }}><Icon /></span>
                <span className="flex-1">{item.label}</span>
                {"badge" in item && item.badge != null && (
                  <span className="text-xs font-bold px-1.5 py-0.5 rounded-full leading-none"
                    style={active ? { background: "rgba(255,255,255,0.3)", color: "white" } : { background: "#FF1F7D", color: "white" }}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
        <div className="px-4 py-5 border-t" style={{ borderColor: "rgba(0,0,0,0.07)" }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #FF1F7D, #FF69B4)" }}>L</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold leading-none" style={{ color: "#111111" }}>Ladurée SoHo</p>
              <p className="text-xs mt-0.5 truncate" style={{ color: "rgba(17,17,17,0.4)" }}>Verified Partner</p>
            </div>
          </div>
          <form action={logout}>
            <button type="submit" className="w-full py-2 rounded-xl text-xs font-bold transition-all"
              style={{ background: "rgba(17,17,17,0.05)", color: "rgba(17,17,17,0.45)" }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,31,125,0.08)"; e.currentTarget.style.color = "#FF1F7D"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(17,17,17,0.05)"; e.currentTarget.style.color = "rgba(17,17,17,0.45)"; }}>
              Log out
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
