"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { logout } from "@/lib/auth/actions";

const PLACES = [
  { href: "/member/home",       label: "Tonight",    sub: "Your city, right now"     },
  { href: "/member/clubs",      label: "Club House", sub: "Your clubs and circles"   },
  { href: "/member/room",       label: "Lobby",      sub: "The social heart"         },
  { href: "/member/lounge",     label: "Apartment",  sub: "Your private world"       },
  { href: "/member/match",      label: "Concierge",  sub: "Yande connects you"       },
  { href: "/member/happenings", label: "The City",   sub: "Events & happenings"      },
];

interface NavUser { name: string; initial: string; role: string; }

export function BottomNav({ user }: { user: NavUser }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const current = PLACES.find(p => pathname === p.href || pathname.startsWith(p.href + "/"));

  return (
    <>
      {/* Floating passport button */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 md:hidden">
        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2.5 px-5 py-3 rounded-full shadow-xl transition-all active:scale-95"
          style={{ background: "#111111", boxShadow: "0 8px 32px rgba(0,0,0,0.5)" }}
        >
          {/* BB monogram */}
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: "#FF1F7D" }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
            </svg>
          </div>
          <span className="text-white text-xs font-bold tracking-[0.15em] uppercase">
            {current?.label ?? "Where to?"}
          </span>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round">
            <polyline points="18 15 12 9 6 15"/>
          </svg>
        </button>
      </div>

      {/* Passport drawer overlay */}
      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-50 md:hidden"
            style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
            onClick={() => setOpen(false)}
          />

          {/* Drawer */}
          <div
            className="fixed bottom-0 left-0 right-0 z-50 md:hidden rounded-t-3xl overflow-hidden"
            style={{ background: "#FDFAF7", maxHeight: "88vh" }}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full" style={{ background: "#E8DDD8" }} />
            </div>

            <div className="px-6 pt-3 pb-10">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p
                    style={{
                      fontFamily: "var(--font-caveat)",
                      fontSize: "22px",
                      color: "#111111",
                      lineHeight: 1.2,
                    }}
                  >
                    Where to?
                  </p>
                  <p className="text-[10px] tracking-[0.2em] uppercase mt-0.5" style={{ color: "#bbb" }}>
                    BloomBay · NYC
                  </p>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: "#F0E8E4" }}
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>

              {/* Places */}
              <div className="flex flex-col gap-0 mb-6">
                {PLACES.map((place, i) => {
                  const active = pathname === place.href || pathname.startsWith(place.href + "/");
                  return (
                    <Link
                      key={place.href}
                      href={place.href}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-4 py-3.5 transition-all"
                      style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}
                    >
                      <span
                        className="text-[9px] font-mono flex-shrink-0"
                        style={{ color: active ? "#FF1F7D" : "#C8B8B0" }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div className="flex-1">
                        <p
                          className="text-base font-bold tracking-tight leading-none"
                          style={{ color: active ? "#FF1F7D" : "#111111" }}
                        >
                          {place.label}
                        </p>
                        <p className="text-[11px] mt-0.5" style={{ color: "#aaa" }}>{place.sub}</p>
                      </div>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={active ? "#FF1F7D" : "#ddd"} strokeWidth="2" strokeLinecap="round">
                        <polyline points="9 18 15 12 9 6"/>
                      </svg>
                    </Link>
                  );
                })}
              </div>

              {/* Divider */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 h-px" style={{ background: "#E8DDD8" }} />
                <span className="text-[9px] tracking-widest uppercase" style={{ color: "#ccc" }}>also</span>
                <div className="flex-1 h-px" style={{ background: "#E8DDD8" }} />
              </div>

              {/* Secondary links */}
              <div className="flex gap-2 flex-wrap mb-6">
                {[
                  { href: "/member/messages", label: "Messages" },
                  { href: "/member/notifications", label: "Notifications" },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="px-4 py-2 rounded-full text-xs font-semibold"
                    style={{ background: "#F0E8E4", color: "#666" }}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              {/* User row */}
              <div className="flex items-center gap-3 pt-3" style={{ borderTop: "1px solid #E8DDD8" }}>
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                  style={{ background: "#FF1F7D" }}
                >
                  {user.initial}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold" style={{ color: "#111111" }}>{user.name}</p>
                  <p className="text-[10px] tracking-wider uppercase" style={{ color: "#bbb" }}>{user.role}</p>
                </div>
                <form action={logout}>
                  <button type="submit" className="text-xs" style={{ color: "#FF1F7D" }}>
                    Sign out
                  </button>
                </form>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
