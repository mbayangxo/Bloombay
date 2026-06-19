"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MobilePortalNav } from "../portal/mobile-portal-nav";
import { logout } from "@/lib/auth/actions";

const NAV_BASE = [
  { href: "/club-owner/dashboard",  label: "YOUR CLUB",    n: "01" },
  { href: "/club-owner/women",      label: "OUR WOMEN",    n: "02" },
  { href: "/club-owner/seats",      label: "SEATS",        n: "03" },
  { href: "/club-owner/happenings", label: "GATHERINGS",   n: "04" },
  { href: "/club-owner/requests",   label: "APPLICATIONS", n: "05" },
  { href: "/club-owner/finances",   label: "TREASURY",     n: "06" },
  { href: "/club-owner/analytics",  label: "PULSE",        n: "07" },
  { href: "/club-owner/promote",    label: "ANNOUNCE",     n: "08" },
  { href: "/club-owner/settings",   label: "SETTINGS",     n: "09" },
];

// Minimal icon set for tablet icon sidebar
function NumIcon({ n }: { n: string }) {
  return (
    <span style={{ fontFamily: "monospace", fontSize: 10, fontWeight: 700 }}>{n}</span>
  );
}

export function ClubSidebar() {
  const pathname = usePathname();
  const [clubName, setClubName] = useState("YOUR CLUB");
  const [ownerName, setOwnerName] = useState("CLUB MAMA");
  const [ownerInitial, setOwnerInitial] = useState("C");
  const [pendingApps, setPendingApps] = useState(0);

  useEffect(() => {
    fetch("/api/club-portal/my-club")
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        if (!d) return;
        if (d.name) setClubName((d.name as string).toUpperCase());
        if (d.owner_name) {
          const n = d.owner_name as string;
          setOwnerName(n.toUpperCase());
          setOwnerInitial(n[0]?.toUpperCase() ?? "C");
        }
        if (typeof d.pending_applications === "number") setPendingApps(d.pending_applications);
      })
      .catch(() => {});
  }, []);

  const navWithBadge = NAV_BASE.map(item => ({
    ...item,
    badge: item.href.includes("requests") && pendingApps > 0 ? pendingApps : undefined,
  }));

  return (
    <>
      {/* ── MOBILE ── */}
      <MobilePortalNav
        portalLabel="Club Portal"
        theme="dark"
        items={navWithBadge.map(i => ({ href: i.href, label: i.label, n: i.n, badge: i.badge }))}
        userInitial={ownerInitial}
        userName={ownerName}
        userRole="Club Mama"
      />

      {/* ── TABLET: icon-only (md → lg) ── */}
      <aside
        className="hidden md:flex lg:hidden fixed left-0 top-0 h-full flex-col z-40 items-center py-4 gap-1"
        style={{ width: 64, background: "#111111", borderRight: "1px solid rgba(255,255,255,0.06)" }}
      >
        {/* Seal */}
        <div className="w-10 h-10 rounded-full flex items-center justify-center mb-3 flex-shrink-0"
          style={{ background: "radial-gradient(circle at 35% 35%, #FF1F7D, #7F0028)", boxShadow: "0 4px 16px rgba(255,31,125,0.35)" }}>
          <span style={{ color: "white", fontSize: 14, fontWeight: 900 }}>✦</span>
        </div>
        {navWithBadge.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link key={item.href} href={item.href} title={item.label}
              className="w-10 h-10 rounded-xl flex items-center justify-center relative flex-shrink-0"
              style={active ? { background: "#FF1F7D", color: "white" } : { color: "rgba(255,255,255,0.35)" }}
            >
              <NumIcon n={item.n} />
              {item.badge != null && item.badge > 0 && (
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
        className="hidden lg:flex fixed left-0 top-0 h-full flex-col z-40"
        style={{ width: 168, background: "#111111", borderRight: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="px-5 pt-8 pb-5" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="w-12 h-12 rounded-full flex items-center justify-center mb-3 relative"
            style={{ background: "radial-gradient(circle at 35% 35%, #FF1F7D, #7F0028)", boxShadow: "0 4px 16px rgba(255,31,125,0.35)" }}>
            <div className="absolute inset-0 rounded-full pointer-events-none"
              style={{ border: "1.5px solid rgba(255,255,255,0.22)", transform: "scale(0.86)", borderRadius: "50%" }} />
            <svg width="20" height="20" viewBox="0 0 40 40" fill="none">
              <g transform="translate(20,19)">
                <line x1="0" y1="5" x2="-3.5" y2="12" stroke="rgba(255,255,255,0.9)" strokeWidth="1.4" strokeLinecap="round" />
                <line x1="0" y1="5" x2="0" y2="12" stroke="rgba(255,255,255,0.9)" strokeWidth="1.4" strokeLinecap="round" />
                <line x1="0" y1="5" x2="3.5" y2="12" stroke="rgba(255,255,255,0.9)" strokeWidth="1.4" strokeLinecap="round" />
                <circle cx="-5" cy="-1" r="3.5" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.75)" strokeWidth="0.9" />
                <circle cx="-5" cy="-1" r="1.4" fill="rgba(255,255,255,0.9)" />
                <circle cx="0" cy="-5.5" r="3.5" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.75)" strokeWidth="0.9" />
                <circle cx="0" cy="-5.5" r="1.4" fill="rgba(255,255,255,0.9)" />
                <circle cx="5" cy="-1" r="3.5" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.75)" strokeWidth="0.9" />
                <circle cx="5" cy="-1" r="1.4" fill="rgba(255,255,255,0.9)" />
              </g>
            </svg>
          </div>
          <p className="text-[10px] font-bold tracking-[0.28em] uppercase truncate" style={{ color: "rgba(255,255,255,0.9)" }}>{clubName}</p>
          <p className="text-[9px] tracking-[0.18em] mt-0.5 uppercase" style={{ color: "rgba(255,255,255,0.25)" }}>CLUB PORTAL</p>
        </div>
        <div className="px-5 py-4"><span style={{ color: "#FF1F7D", fontSize: "11px" }}>✦</span></div>
        <nav className="flex-1 flex flex-col gap-0">
          {navWithBadge.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link key={item.href} href={item.href}
                className="flex items-baseline gap-2.5 py-3 transition-all"
                style={{ borderBottom: "1px solid rgba(255,255,255,0.04)", borderLeft: active ? "2px solid #FF1F7D" : "2px solid transparent", paddingLeft: "20px", paddingRight: "16px" }}
              >
                <span className="text-[9px] font-mono tabular-nums flex-shrink-0" style={{ color: active ? "#FF1F7D" : "rgba(255,255,255,0.18)" }}>{item.n}</span>
                <span className="flex-1 text-[11px] font-bold tracking-[0.18em] leading-none" style={{ color: active ? "#FF1F7D" : "rgba(255,255,255,0.42)" }}>{item.label}</span>
                {item.badge != null && item.badge > 0 && (
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full leading-none" style={{ background: "#FF1F7D", color: "white" }}>{item.badge}</span>
                )}
              </Link>
            );
          })}
        </nav>
        <div className="px-5 py-4" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
          <p style={{ fontFamily: "var(--font-caveat)", fontSize: "13px", color: "rgba(255,255,255,0.22)", lineHeight: 1.4, fontStyle: "italic" }}>
            A world made<br />for women.
          </p>
        </div>
        <div className="px-5 py-4 flex items-center gap-2.5" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
            style={{ background: "radial-gradient(circle at 35% 35%, #FF1F7D, #7F0028)" }}>
            {ownerInitial}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold tracking-wider truncate" style={{ color: "rgba(255,255,255,0.8)" }}>{ownerName}</p>
            <p className="text-[9px] tracking-wider" style={{ color: "rgba(255,255,255,0.3)" }}>CLUB MAMA</p>
          </div>
          <form action={logout}>
            <button type="submit" title="Sign out" style={{ color: "rgba(255,255,255,0.2)" }} className="transition-colors hover:text-white/40">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
              </svg>
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
