"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/member/home",       label: "Tonight"    },
  { href: "/member/city",       label: "The City"   },
  { href: "/member/clubs",      label: "Clubs"      },
  { href: "/member/lounge",     label: "Apartment"  },
  { href: "/member/match",      label: "Connect"    },
  { href: "/member/happenings", label: "Happenings" },
  { href: "/member/room",       label: "The Lobby"  },
  { href: "/member/plans",      label: "Plans"      },
];

interface NavUser { name: string; initial: string; role: string; }

export function BottomNav({ user }: { user?: NavUser }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const current = NAV_ITEMS.find(
    n => pathname === n.href || pathname.startsWith(n.href + "/")
  );

  return (
    <>
      {/* ── Popup overlay ──────────────────────────────────────────── */}
      {open && (
        <>
          <div
            className="fixed inset-0 z-40 md:hidden"
            style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)" }}
            onClick={() => setOpen(false)}
          />
          <div
            className="fixed bottom-0 left-0 right-0 z-50 md:hidden rounded-t-3xl"
            style={{
              background: "#111111",
              paddingBottom: "max(env(safe-area-inset-bottom, 0px), 16px)",
              boxShadow: "0 -8px 40px rgba(0,0,0,0.5)",
            }}
          >
            {/* Handle bar */}
            <div className="flex justify-center pt-3 pb-5 cursor-pointer" onClick={() => setOpen(false)}>
              <div className="w-10 h-1 rounded-full" style={{ background: "rgba(255,255,255,0.18)" }} />
            </div>

            {/* Nav list — vertical */}
            <div className="pb-2">
              {NAV_ITEMS.map((item, i) => {
                const active = pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between px-6 py-4 transition-all active:opacity-70"
                    style={{
                      borderBottom: i < NAV_ITEMS.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
                      background: active ? "rgba(255,31,125,0.08)" : "transparent",
                    }}
                  >
                    <span
                      className="text-sm font-bold tracking-wide"
                      style={{ color: active ? "#FF1F7D" : "rgba(255,255,255,0.75)" }}
                    >
                      {item.label}
                    </span>
                    {active && (
                      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#FF1F7D" }} />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* ── Floating pill ──────────────────────────────────────────── */}
      <div
        className="fixed z-30 md:hidden"
        style={{
          bottom: "max(env(safe-area-inset-bottom, 0px) + 16px, 20px)",
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          pointerEvents: "none",
        }}
      >
        <button
          onClick={() => setOpen(p => !p)}
          className="flex items-center gap-2.5 transition-all active:scale-95"
          style={{
            pointerEvents: "auto",
            background: "#111111",
            borderRadius: "100px",
            padding: "12px 22px",
            boxShadow: "0 4px 28px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.07)",
          }}
        >
          <span
            className="text-[11px] font-bold tracking-wider"
            style={{ color: current ? "#FF1F7D" : "rgba(255,255,255,0.55)" }}
          >
            {(current?.label ?? "Navigate").toUpperCase()}
          </span>
          <svg
            width="11"
            height="11"
            viewBox="0 0 24 24"
            fill="none"
            stroke={open ? "#FF1F7D" : "rgba(255,255,255,0.35)"}
            strokeWidth="2.8"
            strokeLinecap="round"
          >
            <polyline points={open ? "18 15 12 9 6 15" : "6 15 12 9 18 15"} />
          </svg>
        </button>
      </div>
    </>
  );
}

export function BottomNavSignout({ user }: { user: NavUser }) {
  return null;
}
