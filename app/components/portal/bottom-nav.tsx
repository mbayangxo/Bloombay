"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/lib/auth/actions";

const PLACES = [
  { href: "/member/home",       short: "TONIGHT"  },
  { href: "/member/clubs",      short: "CLUBS"    },
  { href: "/member/room",       short: "LOBBY"    },
  { href: "/member/lounge",     short: "LOUNGE"   },
  { href: "/member/match",      short: "CONNECT"  },
  { href: "/member/happenings", short: "CITY"     },
];

interface NavUser { name: string; initial: string; role: string; }

export function BottomNav({ user }: { user: NavUser }) {
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
      <div className="flex items-stretch h-14">
        {PLACES.map((place, i) => {
          const active = pathname === place.href || pathname.startsWith(place.href + "/");
          return (
            <Link
              key={place.href}
              href={place.href}
              className="flex-1 flex flex-col items-center justify-center gap-0.5 transition-all"
              style={{
                borderTop: active ? "2px solid #FF1F7D" : "2px solid transparent",
                minWidth: 0,
              }}
            >
              <span
                className="font-mono leading-none"
                style={{
                  fontSize: "7px",
                  color: active ? "rgba(255,31,125,0.6)" : "rgba(255,255,255,0.14)",
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span
                className="font-bold leading-none uppercase"
                style={{
                  fontSize: "8px",
                  letterSpacing: "0.08em",
                  color: active ? "#FF1F7D" : "rgba(255,255,255,0.32)",
                }}
              >
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
