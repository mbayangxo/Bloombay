"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/lib/auth/actions";

const PLACES = [
  { href: "/member/home",   baseLabel: "HOME",    n: "01" },
  { href: "/member/city",   baseLabel: "PICKS",   n: "02" },
  { href: "/member/clubs",  baseLabel: "CLUBS",   n: "03" },
  { href: "/member/lounge", baseLabel: "LOUNGE",  n: "04" },
  { href: "/member/match",  baseLabel: "CONNECT", n: "05" },
];

function getHomeLabel(): string {
  const h = new Date().getHours();
  if (h >= 5  && h < 12) return "MORNING";
  if (h >= 12 && h < 17) return "AFTERNOON";
  if (h >= 17 && h < 21) return "EVENING";
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

          {/* Left — collapsible menu toggle */}
          <button
            onClick={() => setOpen(o => !o)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-full transition-all active:scale-95"
            style={{ background: open ? "rgba(255,31,125,0.18)" : "rgba(255,255,255,0.08)" }}
            aria-label="Navigation menu"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
              stroke={open ? "#FF1F7D" : "rgba(255,255,255,0.7)"}
              strokeWidth="2.5" strokeLinecap="round">
              {open ? (
                <><path d="M18 6L6 18"/><path d="M6 6l12 12"/></>
              ) : (
                <><line x1="3" y1="7" x2="21" y2="7"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="17" x2="21" y2="17"/></>
              )}
            </svg>
            <svg width="8" height="8" viewBox="0 0 24 24" fill="none"
              stroke={open ? "#FF1F7D" : "rgba(255,255,255,0.32)"}
              strokeWidth="3" strokeLinecap="round">
              <polyline points={open ? "18 15 12 9 6 15" : "6 9 12 15 18 9"}/>
            </svg>
          </button>

          {/* Right — utility icons + avatar */}
          <div className="flex items-center gap-1.5">
            <Link href="/member/messages" aria-label="Mailbox"
              className="w-9 h-9 rounded-full flex items-center justify-center"
              style={{ background: pathname.startsWith("/member/messages") ? "rgba(255,31,125,0.2)" : "rgba(255,255,255,0.07)" }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                stroke={pathname.startsWith("/member/messages") ? "#FF1F7D" : "rgba(255,255,255,0.52)"}
                strokeWidth="2" strokeLinecap="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
            </Link>
            <Link href="/member/notifications" aria-label="Ping"
              className="w-9 h-9 rounded-full flex items-center justify-center relative"
              style={{ background: pathname.startsWith("/member/notifications") ? "rgba(255,31,125,0.2)" : "rgba(255,255,255,0.07)" }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                stroke={pathname.startsWith("/member/notifications") ? "#FF1F7D" : "rgba(255,255,255,0.52)"}
                strokeWidth="2" strokeLinecap="round">
                <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 01-3.46 0"/>
              </svg>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ background: "#FF1F7D" }} />
            </Link>
            <Link href="/member/plans" aria-label="Plans"
              className="w-9 h-9 rounded-full flex items-center justify-center"
              style={{ background: pathname.startsWith("/member/plans") ? "rgba(255,31,125,0.2)" : "rgba(255,255,255,0.07)" }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                stroke={pathname.startsWith("/member/plans") ? "#FF1F7D" : "rgba(255,255,255,0.52)"}
                strokeWidth="2" strokeLinecap="round">
                <rect x="1" y="4" width="22" height="16" rx="2"/>
                <line x1="1" y1="10" x2="23" y2="10"/>
                <line x1="8" y1="4" x2="8" y2="2"/>
                <line x1="16" y1="4" x2="16" y2="2"/>
              </svg>
            </Link>
            <Link href="/member/lounge" aria-label="Your apartment">
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white"
                style={{ background: "#FF1F7D", boxShadow: "0 2px 8px rgba(255,31,125,0.42)" }}>
                {user?.initial ?? "M"}
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* ── Collapsible nav panel ── */}
      {open && (
        <>
          <div
            className="fixed inset-0 z-40 md:hidden"
            style={{ background: "rgba(0,0,0,0.52)" }}
            onClick={() => setOpen(false)}
          />
          <div
            className="fixed left-0 z-50 md:hidden overflow-hidden"
            style={{
              top: "calc(env(safe-area-inset-top, 0px) + 48px)",
              background: "#111111",
              width: "216px",
              borderBottomRightRadius: "20px",
              boxShadow: "0 16px 48px rgba(0,0,0,0.6)",
              animation: "navSlideDown 0.16s ease-out",
            }}
          >
            {places.map((place, i) => {
              const active = pathname === place.href || pathname.startsWith(place.href + "/");
              return (
                <Link
                  key={place.href}
                  href={place.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-5 py-4 transition-all active:scale-[0.98]"
                  style={{
                    borderBottom: i < places.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
                    borderLeft: active ? "2px solid #FF1F7D" : "2px solid transparent",
                  }}
                >
                  <span className="text-[9px] font-mono tabular-nums w-5 flex-shrink-0"
                    style={{ color: active ? "#FF1F7D" : "rgba(255,255,255,0.2)" }}>
                    {place.n}
                  </span>
                  <span className="text-[13px] font-bold tracking-[0.14em] uppercase"
                    style={{ color: active ? "#FF1F7D" : "rgba(255,255,255,0.58)" }}>
                    {place.label}
                  </span>
                  {active && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#FF1F7D" }} />
                  )}
                </Link>
              );
            })}
          </div>
        </>
      )}

      <style>{`
        @keyframes navSlideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to   { opacity: 1; transform: translateY(0); }
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
