"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BBLogo } from "./bb-logo";
import { logout } from "@/lib/auth/actions";
import { getTimeOfDay, type TimeOfDay } from "./time-wrapper";
import { MEMBER_SIDEBAR_NAV } from "@/lib/member-nav";

interface SidebarUser { name: string; initial: string; role: string; }

export function MemberSidebar({ user }: { user: SidebarUser }) {
  const pathname = usePathname();
  const [tod, setTod] = useState<TimeOfDay>("morning");

  useEffect(() => {
    setTod(getTimeOfDay(new Date().getHours()));
  }, []);

  const isNight   = tod === "evening" || tod === "night";
  const isEvening = tod === "evening";

  const sidebarBg    = isNight ? (isEvening ? "#120D0A" : "#0A0806") : "#FDFAF5";
  const borderColor  = isNight ? "rgba(255,200,175,0.08)" : "rgba(0,0,0,0.07)";
  const divider      = isNight ? "rgba(255,200,175,0.05)" : "rgba(0,0,0,0.05)";
  const brandText    = isNight ? "rgba(255,238,220,0.92)" : "#111111";
  const mutedText    = isNight ? "rgba(215,175,155,0.38)" : "rgba(0,0,0,0.3)";
  const navInactive  = isNight ? "rgba(225,190,170,0.58)" : "rgba(0,0,0,0.45)";
  const navNum       = isNight ? "rgba(205,168,148,0.3)" : "rgba(0,0,0,0.2)";
  const tagline      = isNight ? "rgba(205,168,148,0.38)" : "rgba(0,0,0,0.22)";
  const userText     = isNight ? "rgba(255,238,220,0.88)" : "#111111";
  const userRole     = isNight ? "rgba(215,175,155,0.45)" : "#888";
  const logoutStroke = isNight ? "rgba(215,175,155,0.35)" : "rgba(0,0,0,0.28)";

  return (
    <aside
      className="hidden md:flex fixed left-0 top-0 h-full flex-col z-40"
      style={{ width: "160px", background: sidebarBg, borderRight: `1px solid ${borderColor}` }}
    >
      <div className="px-6 pt-8 pb-5" style={{ borderBottom: `1px solid ${borderColor}` }}>
        <BBLogo size={24} light={isNight} />
        <p className="text-[10px] font-bold tracking-[0.28em] mt-3 uppercase" style={{ color: brandText }}>
          BLOOMBAY
        </p>
        <p className="text-[9px] tracking-[0.2em] mt-0.5 uppercase" style={{ color: mutedText }}>
          NYC · ESTD. 2024
        </p>
      </div>

      <div className="px-6 py-4">
        <span style={{ color: "#FF1F7D", fontSize: "12px" }}>✦</span>
      </div>

      <nav className="flex-1 flex flex-col gap-0 overflow-y-auto">
        {MEMBER_SIDEBAR_NAV.map((item, i) => {
          const active = item.match(pathname);
          return (
            <Link
              key={item.id}
              href={item.href}
              className="flex items-center gap-2.5 py-3.5 transition-all group relative"
              style={{
                borderBottom: `1px solid ${divider}`,
                borderLeft: active ? "2px solid #FF1F7D" : "2px solid transparent",
                paddingLeft: "22px",
                paddingRight: "24px",
              }}
            >
              <span className="text-[9px] font-mono tabular-nums flex-shrink-0"
                style={{ color: active ? "#FF1F7D" : navNum }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-[11px] font-bold tracking-[0.14em] leading-none"
                style={{ color: active ? "#FF1F7D" : navInactive }}>
                {item.label.toUpperCase()}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="px-6 py-4" style={{ borderTop: `1px solid ${divider}` }}>
        <p style={{ fontFamily: "var(--font-caveat)", fontSize: "13px", color: tagline, lineHeight: 1.4, fontStyle: "italic" }}>
          A world made<br />for women.
        </p>
      </div>

      <div className="px-5 py-4 flex items-center gap-2.5" style={{ borderTop: `1px solid ${borderColor}` }}>
        <Link href="/member/lounge" aria-label="My apartment">
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
