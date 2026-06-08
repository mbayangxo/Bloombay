"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { PinIcon } from "./pin-icon";

const QUICK_LINKS = [
  { href: "/member/messages", label: "Messages", icon: "messages" as const },
  { href: "/member/pin-drops", label: "Pin drops", icon: "pin" as const },
  { href: "/member/plans", label: "Plans", icon: "plans" as const },
];

const MENU_LINKS = [
  { href: "/member/home", label: "Tonight" },
  { href: "/member/city", label: "Picks" },
  { href: "/member/clubs", label: "Clubs" },
  { href: "/member/lounge", label: "Lounge" },
  { href: "/member/match", label: "Connect" },
  { href: "/member/happenings", label: "Happenings" },
  { href: "/member/notifications", label: "Notifications" },
];

function HeaderIcon({
  href,
  label,
  icon,
  active,
}: {
  href: string;
  label: string;
  icon: "messages" | "pin" | "plans";
  active: boolean;
}) {
  const stroke = active ? "#FF1F7D" : "#333";

  return (
    <Link href={href} className="bb-home-header__icon" aria-label={label}>
      {icon === "messages" && (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round">
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
        </svg>
      )}
      {icon === "pin" && <PinIcon size={18} stroke={stroke} />}
      {icon === "plans" && (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round">
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      )}
    </Link>
  );
}

/** Pushpin — notifications (not a bell). */
function PushpinIcon({ stroke = "#333" }: { stroke?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 17v5" />
      <path d="M9 3h6l1 7H8L9 3z" />
      <path d="M8 10l-3 8h14l-3-8" />
    </svg>
  );
}

export function HomeScrapbookHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const notifActive = pathname.startsWith("/member/notifications");

  return (
    <>
      <header className="bb-home-header">
        <Link href="/member/home" className="bb-home-header__mark" aria-label="BloomBay home">
          <span className="bb-home-header__bb">BB*</span>
        </Link>

        <Link href="/member/home" className="bb-home-header__brand">
          Bloom<span className="bb-home-header__star">Bay*</span>
        </Link>

        <div className="bb-home-header__actions">
          {QUICK_LINKS.map((item) => (
            <HeaderIcon
              key={item.href}
              href={item.href}
              label={item.label}
              icon={item.icon}
              active={pathname.startsWith(item.href)}
            />
          ))}

          <Link
            href="/member/notifications"
            className="bb-home-header__icon bb-home-header__icon--notif"
            aria-label="Notifications"
          >
            <PushpinIcon stroke={notifActive ? "#FF1F7D" : "#333"} />
            <span className="bb-home-header__badge">3</span>
          </Link>

          <button
            type="button"
            className="bb-home-header__menu-btn"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span className={`bb-home-header__burger${open ? " bb-home-header__burger--open" : ""}`} />
          </button>
        </div>
      </header>

      {open ? (
        <>
          <button
            type="button"
            className="bb-home-header__backdrop"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          />
          <nav className="bb-home-header__drawer" aria-label="Member navigation">
            <p className="bb-home-header__drawer-title">Navigate</p>
            <ul className="bb-home-header__drawer-list">
              {MENU_LINKS.map((item) => {
                const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`bb-home-header__drawer-link${active ? " bb-home-header__drawer-link--active" : ""}`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </>
      ) : null}
    </>
  );
}
