"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/lib/auth/actions";

interface NavUser { name: string; initial: string; role: string; }

// ─── Tab definitions ──────────────────────────────────────────────────────────

const TABS = [
  {
    href: "/member/home",
    label: "Home",
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke={active ? "#FF1F7D" : "rgba(255,255,255,0.38)"}
        strokeWidth={active ? "2" : "1.6"}
        strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/>
        <path d="M9 21V12h6v9"/>
      </svg>
    ),
  },
  {
    href: "/member/discover",
    label: "Discover",
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke={active ? "#FF1F7D" : "rgba(255,255,255,0.38)"}
        strokeWidth={active ? "2" : "1.6"}
        strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"/>
        <path d="M21 21l-4.35-4.35"/>
      </svg>
    ),
  },
  {
    href: "/member/city",
    label: "Map",
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke={active ? "#FF1F7D" : "rgba(255,255,255,0.38)"}
        strokeWidth={active ? "2" : "1.6"}
        strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z"/>
        <circle cx="12" cy="10" r="3"/>
      </svg>
    ),
  },
  {
    href: "/member/clubs",
    label: "Clubs",
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke={active ? "#FF1F7D" : "rgba(255,255,255,0.38)"}
        strokeWidth={active ? "2" : "1.6"}
        strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 00-3-3.87"/>
        <path d="M16 3.13a4 4 0 010 7.75"/>
      </svg>
    ),
  },
  {
    href: "/member/lounge",
    label: "Profile",
    icon: (active: boolean, initial?: string) => (
      active ? (
        <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
          style={{ background: "linear-gradient(135deg, #FF1F7D, #FF69B4)", boxShadow: "0 0 0 2px #FF1F7D" }}>
          {initial ?? "M"}
        </div>
      ) : (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
          stroke="rgba(255,255,255,0.38)"
          strokeWidth="1.6"
          strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
      )
    ),
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export function BottomNav({ user }: { user?: NavUser }) {
  const pathname = usePathname();

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(href + "/");
  }

  return (
    <>
      {/* ── Fixed mobile top bar ── */}
      <div
        className="fixed top-0 left-0 right-0 z-50 md:hidden"
        style={{
          background: "rgba(10,8,8,0.92)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          paddingTop: "env(safe-area-inset-top, 0px)",
        }}
      >
        <div className="flex items-center justify-between px-4 h-12">
          {/* BB wordmark */}
          <Link href="/member/home" aria-label="BloomBay Home" className="flex items-center gap-1">
            <span className="text-sm font-black tracking-[0.06em]"
              style={{ color: "#FF1F7D", fontFamily: "var(--font-playfair)", fontStyle: "italic" }}>
              BB
            </span>
            <span className="w-1 h-1 rounded-full" style={{ background: "#FF1F7D", opacity: 0.6 }} />
          </Link>

          {/* Utility icons */}
          <div className="flex items-center gap-2">
            <Link href="/member/messages" aria-label="Mailbox"
              className="w-9 h-9 rounded-full flex items-center justify-center relative transition-all active:scale-90"
              style={{
                background: pathname.startsWith("/member/messages") ? "rgba(255,31,125,0.18)" : "rgba(255,255,255,0.06)",
                border: pathname.startsWith("/member/messages") ? "1.5px solid rgba(255,31,125,0.6)" : "1.5px solid rgba(255,31,125,0.22)",
              }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                stroke={pathname.startsWith("/member/messages") ? "#FF1F7D" : "#FF69B4"}
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              <div className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-black text-white"
                style={{ background: "#FF1F7D", boxShadow: "0 0 0 1.5px rgba(10,8,8,0.92)" }}>
                3
              </div>
            </Link>
            <Link href="/member/notifications" aria-label="Pings"
              className="w-9 h-9 rounded-full flex items-center justify-center relative transition-all active:scale-90"
              style={{
                background: pathname.startsWith("/member/notifications") ? "rgba(255,31,125,0.18)" : "rgba(255,255,255,0.06)",
                border: pathname.startsWith("/member/notifications") ? "1.5px solid rgba(255,31,125,0.6)" : "1.5px solid rgba(255,31,125,0.22)",
              }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                stroke={pathname.startsWith("/member/notifications") ? "#FF1F7D" : "#FF69B4"}
                strokeWidth="2" strokeLinecap="round">
                <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 01-3.46 0"/>
              </svg>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
                style={{ background: "#FF1F7D", boxShadow: "0 0 0 1.5px rgba(10,8,8,0.92)" }} />
            </Link>
          </div>
        </div>
      </div>

      {/* ── Bottom tab bar ── */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
        style={{
          background: "rgba(10,8,8,0.96)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderTop: "1px solid rgba(255,255,255,0.07)",
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
        }}
      >
        <div className="flex items-stretch">
          {TABS.map(tab => {
            const active = isActive(tab.href);
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className="relative flex-1 flex flex-col items-center justify-center gap-1 py-2.5 transition-all active:scale-90"
              >
                {active && (
                  <span
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full"
                    style={{ background: "#FF1F7D" }}
                  />
                )}
                {tab.label === "Profile"
                  ? tab.icon(active, user?.initial)
                  : tab.icon(active)}
                <span
                  className="text-[9px] font-semibold tracking-wide"
                  style={{ color: active ? "#FF1F7D" : "rgba(255,255,255,0.3)" }}
                >
                  {tab.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes mailboxShake {
          0%, 80%, 100% { transform: rotate(0deg); }
          83% { transform: rotate(-8deg); }
          86% { transform: rotate(7deg); }
          89% { transform: rotate(-5deg); }
          92% { transform: rotate(4deg); }
          95% { transform: rotate(-2deg); }
        }
      `}</style>
    </>
  );
}

export function BottomNavSignout({ user }: { user: NavUser }) {
  return (
    <form action={logout} className="hidden">
      <button type="submit">{user.name}</button>
    </form>
  );
}
