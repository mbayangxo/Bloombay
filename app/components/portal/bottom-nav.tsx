"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/lib/auth/actions";

const PLACES = [
  { href: "/member/home",       baseLabel: "HOME",       n: "01" },
  { href: "/member/happenings", baseLabel: "HAPPENINGS", n: "02" },
  { href: "/member/city",       baseLabel: "THE CITY",   n: "03" },
  { href: "/member/clubs",      baseLabel: "CLUBS",      n: "04" },
  { href: "/member/lounge",     baseLabel: "LOUNGE",     n: "05" },
  { href: "/member/match",      baseLabel: "CONNECT",    n: "06" },
];

const PAGE_LABELS: Record<string, string> = {
  "/member/home":          "HOME",
  "/member/city":          "THE CITY",
  "/member/clubs":         "CLUBS",
  "/member/lounge":        "LOUNGE",
  "/member/match":         "CONNECT",
  "/member/calendar":      "CALENDAR",
  "/member/happenings":    "HAPPENINGS",
  "/member/messages":      "MAILBOX",
  "/member/chat":          "CHAT",
  "/member/notifications": "PINGS",
  "/member/plans":         "PLANS",
  "/member/room":          "THE WALL",
};

function getHomeLabel(): string {
  const h = new Date().getHours();
  if (h >= 5  && h < 12) return "THIS MORNING";
  if (h >= 12 && h < 17) return "TODAY";
  if (h >= 17 && h < 21) return "THIS EVENING";
  return "TONIGHT";
}

interface NavUser { name: string; initial: string; role: string; }

export function BottomNav({ user }: { user?: NavUser }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [homeLabel, setHomeLabel] = useState("TODAY");

  useEffect(() => {
    setHomeLabel(getHomeLabel());
  }, []);

  const places = PLACES.map((p, i) => ({
    ...p,
    label: i === 0 ? homeLabel : p.baseLabel,
  }));

  // Derive current page label for the pill
  function getCurrentLabel(): string {
    for (const [prefix, label] of Object.entries(PAGE_LABELS)) {
      if (pathname === prefix || pathname.startsWith(prefix + "/")) {
        if (prefix === "/member/home") return homeLabel;
        return label;
      }
    }
    return "NAVIGATE";
  }

  const currentLabel = getCurrentLabel();

  return (
    <>
      {/* ── Fixed mobile top bar ── */}
      <div
        className="fixed top-0 left-0 right-0 z-50 md:hidden"
        style={{
          background: "rgba(10,8,8,0.9)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          paddingTop: "env(safe-area-inset-top, 0px)",
        }}
      >
        <div className="flex items-center justify-between px-4 h-12">

          {/* Left — BB wordmark */}
          <Link href="/member/home"
            className="flex items-center gap-1"
            aria-label="BloomBay Home">
            <span className="text-sm font-black tracking-[0.06em]"
              style={{ color: "#FF1F7D", fontFamily: "var(--font-playfair)", fontStyle: "italic" }}>
              BB
            </span>
            <span className="w-1 h-1 rounded-full" style={{ background: "#FF1F7D", opacity: 0.6 }} />
          </Link>

          {/* Right — utility icons + avatar */}
          <div className="flex items-center gap-3">
            <Link href="/member/messages" aria-label="Mailbox"
              className="w-8 h-8 rounded-full flex items-center justify-center relative"
              style={{
                background: pathname.startsWith("/member/messages") ? "rgba(255,31,125,0.2)" : "rgba(255,255,255,0.07)",
                animation: !pathname.startsWith("/member/messages") ? "mailboxShake 6s ease-in-out 2s infinite" : undefined,
              }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke={pathname.startsWith("/member/messages") ? "#FF1F7D" : "rgba(255,255,255,0.72)"}
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="9" width="17" height="12" rx="2"/>
                <path d="M3 9a8.5 8.5 0 0 1 17 0"/>
                <line x1="7" y1="16" x2="13" y2="16"/>
                <line x1="20" y1="9" x2="20" y2="5"/>
                <polyline points="20,5 23,6.5 20,8"/>
              </svg>
              {/* Sender avatar — shows when not on mailbox page */}
              {!pathname.startsWith("/member/messages") && (
                <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[7px] font-black text-white"
                  style={{ background: "#FF1F7D", boxShadow: "0 0 0 1.5px rgba(10,8,8,0.9)", lineHeight: 1 }}>
                  Y
                </div>
              )}
            </Link>
            <Link href="/member/notifications" aria-label="Ping"
              className="w-8 h-8 rounded-full flex items-center justify-center relative"
              style={{ background: pathname.startsWith("/member/notifications") ? "rgba(255,31,125,0.2)" : "rgba(255,255,255,0.07)" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke={pathname.startsWith("/member/notifications") ? "#FF1F7D" : "rgba(255,255,255,0.72)"}
                strokeWidth="2" strokeLinecap="round">
                <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 01-3.46 0"/>
              </svg>
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full" style={{ background: "#FF1F7D" }} />
            </Link>
            <Link href="/member/chat" aria-label="Chat"
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: pathname.startsWith("/member/chat") ? "rgba(255,31,125,0.2)" : "rgba(255,255,255,0.07)" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke={pathname.startsWith("/member/chat") ? "#FF1F7D" : "rgba(255,255,255,0.72)"}
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
              </svg>
            </Link>
            <Link href="/member/calendar" aria-label="Calendar"
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: pathname.startsWith("/member/calendar") ? "rgba(255,31,125,0.2)" : "rgba(255,255,255,0.07)" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke={pathname.startsWith("/member/calendar") ? "#FF1F7D" : "rgba(255,255,255,0.72)"}
                strokeWidth="2" strokeLinecap="round">
                <rect x="3" y="4" width="18" height="18" rx="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            </Link>
            <Link href="/member/lounge" aria-label="Your apartment">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                style={{ background: "#FF1F7D", boxShadow: "0 2px 8px rgba(255,31,125,0.38)" }}>
                {user?.initial ?? "M"}
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* ── Floating bottom pill ── */}
      <div
        className="fixed z-50 md:hidden"
        style={{
          bottom: "calc(env(safe-area-inset-bottom, 0px) + 20px)",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        <button
          onClick={() => setOpen(o => !o)}
          className="flex items-center gap-2.5 px-5 py-3 rounded-full transition-all active:scale-95"
          style={{
            background: open ? "rgba(255,31,125,0.95)" : "rgba(12,10,10,0.92)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            boxShadow: open
              ? "0 8px 32px rgba(255,31,125,0.45)"
              : "0 8px 32px rgba(0,0,0,0.5)",
            border: open ? "1px solid rgba(255,31,125,0.3)" : "1px solid rgba(255,255,255,0.1)",
            minWidth: "120px",
          }}
        >
          <span className="text-[11px] font-bold tracking-[0.16em]"
            style={{ color: open ? "white" : "rgba(255,255,255,0.8)" }}>
            {currentLabel}
          </span>
          <svg
            width="10" height="10" viewBox="0 0 24 24" fill="none"
            stroke={open ? "white" : "rgba(255,255,255,0.5)"}
            strokeWidth="3" strokeLinecap="round"
            style={{ transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
          >
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </button>
      </div>

      {/* ── Nav sheet ── */}
      {open && (
        <>
          <div
            className="fixed inset-0 z-40 md:hidden"
            style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)", WebkitBackdropFilter: "blur(4px)" }}
            onClick={() => setOpen(false)}
          />
          <div
            className="fixed left-0 right-0 z-50 md:hidden rounded-t-3xl overflow-hidden"
            style={{
              bottom: 0,
              background: "#111111",
              boxShadow: "0 -16px 48px rgba(0,0,0,0.6)",
              paddingBottom: "env(safe-area-inset-bottom, 20px)",
              animation: "navSlideUp 0.18s ease-out",
            }}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 rounded-full" style={{ background: "rgba(255,255,255,0.15)" }} />
            </div>

            {/* Nav links */}
            <div>
              {places.map((place, i) => {
                const active = pathname === place.href || pathname.startsWith(place.href + "/");
                return (
                  <Link
                    key={place.href}
                    href={place.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-4 px-6 py-4 transition-all active:scale-[0.98]"
                    style={{
                      borderBottom: i < places.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
                    }}
                  >
                    <span className="text-[9px] font-mono tabular-nums w-5 flex-shrink-0"
                      style={{ color: active ? "#FF1F7D" : "rgba(255,255,255,0.2)" }}>
                      {place.n}
                    </span>
                    <span className="flex-1 text-[15px] font-bold tracking-[0.12em] uppercase"
                      style={{ color: active ? "#FF1F7D" : "rgba(255,255,255,0.65)" }}>
                      {place.label}
                    </span>
                    {active && (
                      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: "#FF1F7D" }} />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* ── Secondary utility links ── */}
            <div className="mx-5 mt-4 mb-2" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="flex items-center gap-0 pt-3 pb-1">
                {[
                  { href: "/member/messages",       label: "Mailbox"  },
                  { href: "/member/chat",            label: "Chat"     },
                  { href: "/member/notifications",   label: "Pings"    },
                  { href: "/member/calendar",        label: "Calendar" },
                ].map((item, i, arr) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex-1 text-center py-2 transition-all active:scale-95"
                    style={{ borderRight: i < arr.length - 1 ? "1px solid rgba(255,255,255,0.07)" : "none" }}
                  >
                    <span
                      className="text-[10px] font-semibold tracking-[0.08em]"
                      style={{
                        color: pathname.startsWith(item.href) ? "#FF1F7D" : "rgba(255,255,255,0.3)",
                      }}
                    >
                      {item.label}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* ── Sign out ── */}
            <form action={logout} className="mx-5 mb-1">
              <button
                type="submit"
                className="w-full py-3 text-center text-[10px] font-semibold tracking-[0.1em] uppercase transition-all active:scale-95"
                style={{ color: "rgba(255,31,125,0.45)" }}
              >
                Sign out
              </button>
            </form>
          </div>
        </>
      )}

      <style>{`
        @keyframes navSlideUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes mailboxShake {
          0%, 80%, 100% { transform: rotate(0deg); }
          83% { transform: rotate(-8deg); }
          86% { transform: rotate(7deg); }
          89% { transform: rotate(-5deg); }
          92% { transform: rotate(4deg); }
          95% { transform: rotate(-2deg); }
          98% { transform: rotate(0deg); }
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
