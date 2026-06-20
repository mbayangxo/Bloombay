"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PinIcon } from "./pin-icon";

function MailboxIcon({ stroke }: { stroke: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}

function ChatIcon({ stroke }: { stroke: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
    </svg>
  );
}

function ApartmentIcon({ stroke }: { stroke: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
      <path d="M9 21V12h6v9" />
    </svg>
  );
}

const UTILITIES = [
  { href: "/member/pin-drops", label: "Pin drops", icon: "pin" as const },
  { href: "/member/notifications", label: "Mailbox", icon: "mailbox" as const },
  { href: "/member/messages", label: "Chats", icon: "chat" as const },
  { href: "/member/lounge", label: "My apartment", icon: "apartment" as const },
];

export function PortalUtilityIcons({
  className = "",
  iconClassName = "bb-portal-utility__icon",
  showApartmentInitial,
}: {
  className?: string;
  iconClassName?: string;
  showApartmentInitial?: string;
}) {
  const pathname = usePathname();

  return (
    <div className={`bb-portal-utility${className ? ` ${className}` : ""}`}>
      {UTILITIES.map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
        const stroke = active ? "#FF1F7D" : "#333";

        if (item.icon === "apartment" && showApartmentInitial) {
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`${iconClassName}${active ? ` ${iconClassName}--active` : ""}`}
              aria-label={item.label}
            >
              <span className="bb-portal-utility__apt-initial">{showApartmentInitial}</span>
            </Link>
          );
        }

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`${iconClassName}${active ? ` ${iconClassName}--active` : ""}`}
            aria-label={item.label}
          >
            {item.icon === "pin" && <PinIcon size={18} stroke={stroke} />}
            {item.icon === "mailbox" && <MailboxIcon stroke={stroke} />}
            {item.icon === "chat" && <ChatIcon stroke={stroke} />}
            {item.icon === "apartment" && <ApartmentIcon stroke={stroke} />}
          </Link>
        );
      })}
    </div>
  );
}
