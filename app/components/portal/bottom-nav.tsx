"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/lib/auth/actions";
import { PinIcon } from "./pin-icon";

const PLACES = [
  { href: "/member/home",          short: "TONIGHT"  },
  { href: "/member/city",          short: "PICKS"    },
  { href: "/member/clubs",         short: "CLUBS"    },
  { href: "/member/lounge",        short: "LOUNGE"   },
  { href: "/member/match",         short: "CONNECT"  },
];

const UTILITY = [
  { href: "/member/messages",      label: "Messages",  badge: false },
  { href: "/member/pin-drops",     label: "Pin drops", badge: false },
  { href: "/member/plans",         label: "Plans",     badge: false },
];

interface NavUser { name: string; initial: string; role: string; }

export function BottomNav({ user }: { user?: NavUser }) {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
      style={{
        background: "#111111",
        borderTop: "1px solid rgba(255,255,255,0.07)",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}
    >
      {/* Utility icon row: Messages · Pin drops · Plans */}
      <div className="flex items-center justify-end gap-3 px-5 pt-2 pb-0.5">
        {UTILITY.map(u => {
          const active = pathname.startsWith(u.href);
          return (
            <Link key={u.href} href={u.href} aria-label={u.label}
              className="relative flex flex-col items-center gap-0.5">
              {u.label === "Messages" && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={active ? "#FF1F7D" : "rgba(255,255,255,0.35)"} strokeWidth="2" strokeLinecap="round">
                  <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
                </svg>
              )}
              {u.label === "Pin drops" && (
                <PinIcon size={16} stroke={active ? "#FF1F7D" : "rgba(255,255,255,0.35)"} />
              )}
              {u.label === "Plans" && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={active ? "#FF1F7D" : "rgba(255,255,255,0.35)"} strokeWidth="2" strokeLinecap="round">
                  <rect x="1" y="4" width="22" height="16" rx="2"/>
                  <line x1="1" y1="10" x2="23" y2="10"/>
                  <line x1="8" y1="4" x2="8" y2="2"/>
                  <line x1="16" y1="4" x2="16" y2="2"/>
                </svg>
              )}
              <span className="text-[7px] font-bold tracking-wider uppercase"
                style={{ color: active ? "#FF1F7D" : "rgba(255,255,255,0.25)" }}>{u.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Main page tabs */}
      <div className="flex items-stretch h-12">
        {PLACES.map((place, i) => {
          const active = pathname === place.href || pathname.startsWith(place.href + "/");
          return (
            <Link key={place.href} href={place.href}
              className="flex-1 flex flex-col items-center justify-center gap-0.5 transition-all"
              style={{ borderTop: active ? "2px solid #FF1F7D" : "2px solid transparent", minWidth: 0 }}>
              <span className="font-mono leading-none"
                style={{ fontSize: "7px", color: active ? "rgba(255,31,125,0.6)" : "rgba(255,255,255,0.14)" }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="font-bold leading-none uppercase"
                style={{ fontSize: "8px", letterSpacing: "0.08em", color: active ? "#FF1F7D" : "rgba(255,255,255,0.32)" }}>
                {place.short}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function BottomNavSignout({ user }: { user: NavUser }) {
  return (
    <form action={logout} className="hidden">
      <button type="submit">{user.name}</button>
    </form>
  );
}
