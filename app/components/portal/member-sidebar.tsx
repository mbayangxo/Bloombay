"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BBLogo } from "./bb-logo";
import { logout } from "@/lib/auth/actions";
import { getTimeOfDay, type TimeOfDay } from "./time-wrapper";

const BASE_NAV = [
  { href: "/member/clubs",         label: "CLUBS"       },
  { href: "/member/room",          label: "LOBBY"       },
  { href: "/member/lounge",        label: "APARTMENT"   },
  { href: "/member/match",         label: "CONNECT"     },
  { href: "/member/city",          label: "THE CITY"    },
  { href: "/member/happenings",    label: "HAPPENINGS"  },
];

interface SidebarUser { name: string; initial: string; role: string; }

export function MemberSidebar({ user }: { user: SidebarUser }) {
  const pathname = usePathname();
  const [tod, setTod] = useState<TimeOfDay>("morning");

  useEffect(() => {
    setTod(getTimeOfDay(new Date().getHours()));
  }, []);

  const isNight   = tod === "evening" || tod === "night";
  const isEvening = tod === "evening";

  const homeLabel = (tod === "evening" || tod === "night") ? "TONIGHT" : "THE DAILY";
  const NAV = [
    { href: "/member/home", label: homeLabel },
    ...BASE_NAV,
  ];

  const sidebarBg    = isNight ? (isEvening ? "#171220" : "#13101C") : "#FDFAF5";
  const borderColor  = isNight ? "rgba(220,210,240,0.07)" : "rgba(0,0,0,0.07)";
  const divider      = isNight ? "rgba(220,210,240,0.04)" : "rgba(0,0,0,0.05)";
  const brandText    = isNight ? "rgba(240,232,255,0.92)" : "#111111";
  const mutedText    = isNight ? "rgba(190,180,215,0.38)" : "rgba(0,0,0,0.3)";
  const navInactive  = isNight ? "rgba(210,200,235,0.52)" : "rgba(0,0,0,0.45)";
  const tagline      = isNight ? "rgba(185,175,210,0.35)" : "rgba(0,0,0,0.22)";
  const userText     = isNight ? "rgba(240,232,255,0.88)" : "#111111";
  const userRole     = isNight ? "rgba(200,190,225,0.45)" : "#888";
  const logoutStroke = isNight ? "rgba(200,190,225,0.35)" : "rgba(0,0,0,0.28)";
  const activeColor  = "#FF1F7D";

  return (
    <aside
      className="hidden md:flex fixed left-0 top-0 h-full flex-col z-40"
      style={{ width: "180px", background: sidebarBg, borderRight: `1px solid ${borderColor}` }}
    >
      {/* Brand mark */}
      <div className="px-6 pt-8 pb-6" style={{ borderBottom: `1px solid ${borderColor}` }}>
        <BBLogo size={24} light={isNight} />
        <p className="text-[10px] font-bold tracking-[0.28em] mt-3 uppercase" style={{ color: brandText }}>
          BLOOMBAY
        </p>
        <p className="text-[9px] tracking-[0.2em] mt-0.5 uppercase" style={{ color: mutedText }}>
          NYC · ESTD. 2024
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col overflow-y-auto py-2">
        {NAV.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center py-4 transition-all relative"
              style={{
                borderLeft: active ? "2px solid #FF1F7D" : "2px solid transparent",
                paddingLeft: "22px",
                paddingRight: "20px",
              }}
            >
              <span
                className="text-[11px] font-bold tracking-[0.18em] leading-none"
                style={{ color: active ? activeColor : navInactive }}
              >
                {item.label}
              </span>
            </Link>
          );
        })}

        {/* Inbox — mailbox in nav */}
        <div style={{ borderTop: `1px solid ${divider}`, marginTop: "8px", paddingTop: "8px" }}>
          <Link
            href="/member/messages"
            className="flex items-center gap-2.5 py-4 transition-all relative"
            style={{
              borderLeft: pathname.startsWith("/member/messages") ? "2px solid #FF1F7D" : "2px solid transparent",
              paddingLeft: "22px",
              paddingRight: "20px",
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
              stroke={pathname.startsWith("/member/messages") ? "#FF1F7D" : navInactive}
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
            <span
              className="text-[11px] font-bold tracking-[0.18em] leading-none"
              style={{ color: pathname.startsWith("/member/messages") ? activeColor : navInactive }}
            >
              INBOX
            </span>
          </Link>
        </div>
      </nav>

      {/* Tagline */}
      <div className="px-6 py-4" style={{ borderTop: `1px solid ${divider}` }}>
        <p style={{ fontFamily: "var(--font-caveat)", fontSize: "13px", color: tagline, lineHeight: 1.4, fontStyle: "italic" }}>
          A world made<br />for women.
        </p>
      </div>

      {/* User */}
      <div className="px-5 py-4 flex items-center gap-2.5" style={{ borderTop: `1px solid ${borderColor}` }}>
        <Link href="/member/lounge">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
            style={{ background: "#FF1F7D" }}>
            {user.initial}
          </div>
        </Link>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold tracking-wider truncate" style={{ color: userText }}>
            {user.name.toUpperCase()}
          </p>
          <p className="text-[9px] tracking-wider" style={{ color: userRole }}>
            {user.role.toUpperCase()}
          </p>
        </div>
        <form action={logout}>
          <button type="submit" title="Sign out">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={logoutStroke} strokeWidth="2" strokeLinecap="round">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>
            </svg>
          </button>
        </form>
      </div>
    </aside>
  );
}
