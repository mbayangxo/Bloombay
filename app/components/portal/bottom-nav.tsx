"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/lib/auth/actions";

interface NavUser { name: string; initial: string; role: string; }

const PINK = "#FF1F7D";
const NAV_BG = "#FAF7F2";

const TABS = [
  {
    href: "/member/home",
    label: "Home",
    icon: (active: boolean) => (
      <svg width="21" height="21" viewBox="0 0 24 24" fill="none"
        stroke={active ? PINK : "rgba(0,0,0,0.28)"}
        strokeWidth={active ? "2.2" : "1.6"}
        strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/>
        <path d="M9 21V12h6v9"/>
      </svg>
    ),
  },
  {
    href: "/member/happenings",
    label: "Happenings",
    icon: (active: boolean) => (
      <svg width="21" height="21" viewBox="0 0 24 24" fill="none"
        stroke={active ? PINK : "rgba(0,0,0,0.28)"}
        strokeWidth={active ? "2.2" : "1.6"}
        strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
      </svg>
    ),
  },
  {
    href: "/member/city",
    label: "Eats",
    icon: (active: boolean) => (
      <svg width="21" height="21" viewBox="0 0 24 24" fill="none"
        stroke={active ? PINK : "rgba(0,0,0,0.28)"}
        strokeWidth={active ? "2.2" : "1.6"}
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
      <svg width="21" height="21" viewBox="0 0 24 24" fill="none"
        stroke={active ? PINK : "rgba(0,0,0,0.28)"}
        strokeWidth={active ? "2.2" : "1.6"}
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
    icon: (active: boolean) => (
      <svg width="21" height="21" viewBox="0 0 24 24" fill="none"
        stroke={active ? PINK : "rgba(0,0,0,0.28)"}
        strokeWidth={active ? "2.2" : "1.6"}
        strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    ),
  },
];

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
          background: NAV_BG,
          borderBottom: "1px solid rgba(0,0,0,0.07)",
          boxShadow: "0 1px 8px rgba(0,0,0,0.05)",
          paddingTop: "env(safe-area-inset-top, 0px)",
        }}
      >
        <div className="flex items-center justify-between px-5 h-12">
          {/* BB wordmark */}
          <Link href="/member/home" aria-label="BloomBay Home" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "3px" }}>
            <span style={{
              fontFamily: "var(--font-playfair)",
              fontStyle: "italic",
              fontWeight: 900,
              fontSize: "20px",
              color: PINK,
              letterSpacing: "-0.02em",
            }}>
              BB
            </span>
            <span style={{ color: PINK, fontSize: "12px", opacity: 0.6 }}>✿</span>
          </Link>

          {/* Right icons: messages + notifications + avatar */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>

            {/* Mailbox with badge */}
            <Link href="/member/messages" aria-label="Mailbox" style={{ position: "relative", display: "flex" }}>
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.35)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
              <div style={{
                position: "absolute",
                top: "-4px",
                right: "-5px",
                width: "14px",
                height: "14px",
                borderRadius: "50%",
                background: PINK,
                border: "1.5px solid " + NAV_BG,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "7px",
                fontWeight: 900,
                color: "white",
                lineHeight: 1,
              }}>
                3
              </div>
            </Link>

            {/* Notifications */}
            <Link href="/member/notifications" aria-label="Notifications" style={{ position: "relative", display: "flex" }}>
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.35)" strokeWidth="2" strokeLinecap="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
              <span style={{
                position: "absolute",
                top: "-1px",
                right: "-1px",
                width: "7px",
                height: "7px",
                borderRadius: "50%",
                background: PINK,
                border: "1.5px solid " + NAV_BG,
              }} />
            </Link>

            {/* Avatar */}
            <Link href="/member/lounge" aria-label="Profile" style={{ textDecoration: "none" }}>
              <div style={{
                width: "30px",
                height: "30px",
                borderRadius: "50%",
                background: PINK,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "12px",
                fontWeight: 900,
                color: "white",
                fontFamily: "var(--font-playfair)",
                fontStyle: "italic",
                boxShadow: "0 2px 8px rgba(255,31,125,0.3)",
              }}>
                {user?.initial ?? "M"}
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* ── Bottom tab bar ── */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
        style={{
          background: NAV_BG,
          borderTop: "1px solid rgba(0,0,0,0.08)",
          boxShadow: "0 -1px 12px rgba(0,0,0,0.06)",
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
        }}
      >
        <div style={{ display: "flex", alignItems: "stretch" }}>
          {TABS.map(tab => {
            const active = isActive(tab.href);
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className="relative flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5 transition-all active:scale-90"
                style={{ textDecoration: "none" }}
              >
                {active && (
                  <span
                    style={{
                      position: "absolute",
                      top: 0,
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: "24px",
                      height: "2px",
                      borderRadius: "999px",
                      background: PINK,
                    }}
                  />
                )}
                {tab.icon(active)}
                <span
                  style={{
                    fontSize: "9px",
                    fontWeight: 600,
                    letterSpacing: "0.04em",
                    fontFamily: "var(--font-jost)",
                    color: active ? PINK : "rgba(0,0,0,0.3)",
                  }}
                >
                  {tab.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
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
