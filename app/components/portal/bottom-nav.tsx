"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/lib/auth/actions";

interface NavUser { name: string; initial: string; role: string; }

// ─── Bottom tabs ──────────────────────────────────────────────────────────────

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
    href: "/member/happenings",
    label: "Happenings",
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke={active ? "#FF1F7D" : "rgba(255,255,255,0.38)"}
        strokeWidth={active ? "2" : "1.6"}
        strokeLinecap="round" strokeLinejoin="round">
        {/* Sparkle / happening star */}
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
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
    href: "/member/plans",
    label: "Plans",
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke={active ? "#FF1F7D" : "rgba(255,255,255,0.38)"}
        strokeWidth={active ? "2" : "1.6"}
        strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8" y1="2" x2="8" y2="6"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
        <path d="M8 14l2.5 2.5L16 11"/>
      </svg>
    ),
  },
];

// ─── Top utility icons ────────────────────────────────────────────────────────

function AptIcon({ active }: { active: boolean }) {
  const c = active ? "#FF1F7D" : "#FF69B4";
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
      stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/>
      <path d="M9 21V15h6v6"/>
      <rect x="9" y="10" width="2" height="3" rx="0.5"/>
      <rect x="13" y="10" width="2" height="3" rx="0.5"/>
    </svg>
  );
}

function MailboxIcon({ active }: { active: boolean }) {
  const c = active ? "#FF1F7D" : "#FF69B4";
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
      stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
      <polyline points="22,6 12,13 2,6"/>
    </svg>
  );
}

function ChatIcon({ active }: { active: boolean }) {
  const c = active ? "#FF1F7D" : "#FF69B4";
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
      stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
    </svg>
  );
}

function PinDropIcon({ active }: { active: boolean }) {
  const c = active ? "#FF1F7D" : "#FF69B4";
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
      stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z"/>
      <circle cx="12" cy="10" r="3"/>
    </svg>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function BottomNav({ user }: { user?: NavUser }) {
  const pathname = usePathname();

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(href + "/");
  }

  const UTILITY = [
    { href: "/member/lounge",        label: "Apt",      Icon: AptIcon,     badge: null },
    { href: "/member/messages",      label: "Mailbox",  Icon: MailboxIcon, badge: "3" as string | null },
    { href: "/member/chat",          label: "Chat",     Icon: ChatIcon,    badge: "dot" as string | null },
    { href: "/member/happenings",     label: "Pins",     Icon: PinDropIcon, badge: null },
  ];

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

          {/* Utility icons: Apt · Mailbox · Chat · Pin drops */}
          <div className="flex items-center gap-1.5">
            {UTILITY.map(({ href, label, Icon, badge }) => {
              const active = pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  aria-label={label}
                  className="w-8 h-8 rounded-full flex items-center justify-center relative transition-all active:scale-90"
                  style={{
                    background: active ? "rgba(255,31,125,0.18)" : "rgba(255,255,255,0.06)",
                    border: active ? "1.5px solid rgba(255,31,125,0.6)" : "1.5px solid rgba(255,31,125,0.22)",
                  }}
                >
                  <Icon active={active} />
                  {badge === "dot" && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
                      style={{ background: "#FF1F7D", boxShadow: "0 0 0 1.5px rgba(10,8,8,0.92)" }} />
                  )}
                  {badge && badge !== "dot" && (
                    <div className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-black text-white"
                      style={{ background: "#FF1F7D", boxShadow: "0 0 0 1.5px rgba(10,8,8,0.92)" }}>
                      {badge}
                    </div>
                  )}
                </Link>
              );
            })}
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
                {tab.icon(active)}
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
