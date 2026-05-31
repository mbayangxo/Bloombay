"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  {
    href: "/home",
    label: "Home",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
      </svg>
    ),
  },
  {
    href: "/city",
    label: "City",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L9.5 8.5H3l5.5 4-2 6.5L12 15l5.5 4-2-6.5L21 8.5h-6.5z" />
      </svg>
    ),
  },
  {
    href: "/clubs",
    label: "Clubs",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
      </svg>
    ),
  },
  {
    href: "/lounge",
    label: "Lounge",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C7.5 2 4 6 4 10.5c0 3.5 2 6.5 5 8l1 1.5h4l1-1.5c3-1.5 5-4.5 5-8C20 6 16.5 2 12 2zm0 13c-2.5 0-4.5-2-4.5-4.5S9.5 6 12 6s4.5 2 4.5 4.5S14.5 15 12 15z" />
      </svg>
    ),
  },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pointer-events-none md:hidden">
      <div
        className="pointer-events-auto mx-4 mb-4 flex items-center gap-1 px-3 py-2 rounded-full"
        style={{ background: "#1A0514" }}
      >
        {tabs.map((tab) => {
          const active = pathname === tab.href || pathname.startsWith(tab.href + "/");
          return (
            <Link key={tab.href} href={tab.href} className="flex flex-col items-center">
              <span
                className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-full transition-all"
                style={
                  active
                    ? { background: "var(--bb-pink)", color: "white" }
                    : { color: "rgba(255,255,255,0.55)" }
                }
              >
                {tab.icon}
                <span className="text-[10px] font-medium tracking-wide leading-none">
                  {tab.label}
                </span>
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
