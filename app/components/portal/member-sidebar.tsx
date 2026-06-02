"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BBLogo } from "./bb-logo";
import { logout } from "@/lib/auth/actions";

const NAV = [
  { href: "/member/home",       label: "TONIGHT",    n: "01" },
  { href: "/member/clubs",      label: "CLUBS",      n: "02" },
  { href: "/member/room",       label: "LOBBY",      n: "03" },
  { href: "/member/lounge",     label: "APARTMENT",  n: "04" },
  { href: "/member/match",      label: "CONNECT",    n: "05" },
  { href: "/member/happenings", label: "THE CITY",   n: "06" },
];

interface SidebarUser { name: string; initial: string; role: string; }

export function MemberSidebar({ user }: { user: SidebarUser }) {
  const pathname = usePathname();

  return (
    <aside
      className="hidden md:flex fixed left-0 top-0 h-full flex-col z-40"
      style={{ width: "160px", background: "#111111", borderRight: "1px solid rgba(255,255,255,0.06)" }}
    >
      {/* Brand mark */}
      <div className="px-6 pt-8 pb-5" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <BBLogo size={24} light />
        <p className="text-[10px] font-bold tracking-[0.28em] mt-3 uppercase" style={{ color: "rgba(255,255,255,0.9)" }}>
          BLOOMBAY
        </p>
        <p className="text-[9px] tracking-[0.2em] mt-0.5 uppercase" style={{ color: "rgba(255,255,255,0.25)" }}>
          NYC · ESTD. 2024
        </p>
      </div>

      {/* ✦ marker */}
      <div className="px-6 py-5">
        <span style={{ color: "#FF1F7D", fontSize: "12px" }}>✦</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-0">
        {NAV.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-baseline gap-2.5 py-3 transition-all group"
              style={{
                borderBottom: "1px solid rgba(255,255,255,0.04)",
                borderLeft: active ? "2px solid #FF1F7D" : "2px solid transparent",
                paddingLeft: "22px",
                paddingRight: "24px",
              }}
            >
              <span
                className="text-[9px] font-mono tabular-nums flex-shrink-0"
                style={{ color: active ? "#FF1F7D" : "rgba(255,255,255,0.18)" }}
              >
                {item.n}
              </span>
              <span
                className="text-[11px] font-bold tracking-[0.18em] leading-none"
                style={{ color: active ? "#FF1F7D" : "rgba(255,255,255,0.42)" }}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Italic tagline */}
      <div className="px-6 py-4" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <p
          style={{
            fontFamily: "var(--font-caveat)",
            fontSize: "13px",
            color: "rgba(255,255,255,0.22)",
            lineHeight: 1.4,
            fontStyle: "italic",
          }}
        >
          A world made<br />for women.
        </p>
      </div>

      {/* User */}
      <div className="px-5 py-5 flex items-center gap-2.5" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <Link href="/member/lounge">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
            style={{ background: "#FF1F7D" }}
          >
            {user.initial}
          </div>
        </Link>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold tracking-wider truncate" style={{ color: "rgba(255,255,255,0.8)" }}>
            {user.name.toUpperCase()}
          </p>
          <p className="text-[9px] tracking-wider" style={{ color: "rgba(255,255,255,0.25)" }}>
            {user.role.toUpperCase()}
          </p>
        </div>
        <form action={logout}>
          <button
            type="submit"
            title="Sign out"
            style={{ color: "rgba(255,255,255,0.2)" }}
            className="transition-colors hover:text-white/40"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
            </svg>
          </button>
        </form>
      </div>
    </aside>
  );
}
